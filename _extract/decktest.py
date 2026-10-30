#!/usr/bin/env python3
"""decktest.py — verify.sh step: the deck builder still produces valid decks.

Loads index.html headless, applies the "Platform demo (60 min)" preset, builds the compact
and full decks through DeckExport._blob (which loads the on-demand diagram pictures), and
checks: no console errors, slide counts match the formula, every slide has notes, a picture
media part exists for every page that has a diagram picture, and the ZIP parses.
Usage: python3 _extract/decktest.py        (from the library root; exit 1 on failure)
"""
import base64
import io
import re
import sys
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from playwright.sync_api import sync_playwright  # noqa: E402
from chromium import launch  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
IDS = ["demo-swg", "demo-threat-prevention", "demo-casb", "demo-dlp", "demo-ztna", "demo-app-connectors", "demo-dem"]


def main():
    errs, problems = [], []
    with sync_playwright() as p:
        b = launch(p)
        pg = b.new_page(viewport={"width": 1400, "height": 900})
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto((ROOT / "index.html").as_uri())
        pg.wait_for_timeout(600)
        have_pics = pg.evaluate("ids => ids.filter(id => window.UC_DECK_DIAGRAMS && UC_DECK_DIAGRAMS.diagrams && UC_DECK_DIAGRAMS.diagrams[id])", IDS)
        for name, opts in (("compact", {"compact": True}), ("full", {})):
            b64 = pg.evaluate("""async ([ids, o]) => { const blob = await DeckExport._blob(ids, 'Verify deck', o);
                const buf = await blob.arrayBuffer(); let s = ''; new Uint8Array(buf).forEach(c => s += String.fromCharCode(c)); return btoa(s); }""", [IDS, opts])
            data = base64.b64decode(b64)
            z = zipfile.ZipFile(io.BytesIO(data))
            names = z.namelist()
            slides = [n for n in names if re.match(r"ppt/slides/slide\d+\.xml$", n)]
            notes = [n for n in names if re.match(r"ppt/notesSlides/notesSlide\d+\.xml$", n)]
            pics = [n for n in names if n.startswith("ppt/media/dpic-")]
            loaded = pg.evaluate("ids => ids.filter(id => window.UC_DECK_PICS && UC_DECK_PICS[id])", IDS)
            per = 2 if name == "compact" else 3 + 1  # divider+demo | divider+why+diagram(when pic)+demo
            expected = 2 + len(IDS) * per + 1 if name == "full" else 2 + len(IDS) * 2 + 1
            if name == "full":
                expected = 2 + len(IDS) * 3 + len(loaded) + 1
            ok = len(slides) == expected and len(notes) == len(slides) and (name == "compact" or len(pics) == len(loaded))
            print(f"{name}: {len(slides)} slides, {len(notes)} notes, {len(pics)} pictures ({len(loaded)} loaded of {len(have_pics)} in manifest), {len(data) // 1024} KB")
            if not ok:
                problems.append(f"{name} deck: expected {expected} slides with notes and {len(loaded)} pictures")
            if z.testzip():
                problems.append(f"{name} deck: corrupt zip member {z.testzip()}")
        b.close()
    if errs:
        problems.append("console errors: " + "; ".join(errs[:3]))
    for pr in problems:
        print("FAIL", pr)
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
