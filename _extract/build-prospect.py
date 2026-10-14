#!/usr/bin/env python3
"""Derive the prospect-facing edition of the library.
Usage: python3 _extract/build-prospect.py    (from the SE library root)

Single-source model: the SE library is the master. This script regenerates
../catoprospectlibrary/ from it on every run — never hand-edit the output.
Prospect-specific wording lives in the RULES below so it survives rebuilds.

Transforms:
  - removes <section id="demo">, <section id="talk-track"> and <section id="pov"> from every
    page (figures are salvaged into a gallery; the runbook tab bar is JS-injected only when
    both #demo and #pov exist, so stripped pages render tabless automatically)
  - removes deck download buttons; ships NO PowerPoint files
  - excludes whatsnew.html and its nav link (internal change history)
  - excludes planner.html, its nav link and its JS (internal SE tool)
  - excludes the "Platform Demo" category entirely (SE demo-facilitation pages: their
    catalog entries, pages, nav link, filter button and any in-library links to them)
  - rewords SE-facing phrases to prospect-facing (rules below)
  - prospect footer + README
"""
import re
import shutil
import subprocess
import sys
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent
OUT = SRC.parent / "catoprospectlibrary"

# ---- wording rules (SE voice -> prospect voice); applied to pages, index and catalog.js
PHRASES = [
    ("step-by-step demo runbook", "practical walkthrough"),
    ("demo runbook", "walkthrough"),
    ("Demo runbook", "Walkthrough"),
    ("How to run the demo", "How it works in practice"),
    ("Discovery questions", "Questions worth asking"),
    ("Discovery question", "Ask yourself"),
    ("field library of Cato Networks use cases for sales engineers and partners",
     "library of Cato Networks use cases for teams evaluating SASE"),
    ("with diagrams, CMA screenshots and talk tracks. Converted from, and replacing, the original\n      PowerPoint decks.",
     "with architecture diagrams and real console views throughout."),
    ("Cato Networks — internal SE / partner enablement. Demo walkthroughs use example data from a demo tenant.",
     "Prepared for prospective customers. Walkthroughs use example data from a demonstration environment."),
    ("authored from research, not a delivery-verified runbook — review with Cato PS before customer use",
     "an indicative approach based on published documentation — your Cato team will tailor it with you"),
    ("not a delivery-verified runbook — review with Cato PS before customer use",
     "an indicative approach — your Cato team will tailor it with you"),
    ("review with Cato PS before customer use", "your Cato team will tailor this with you"),
    ("Review it with Cato PS", "Your Cato team will refine this with you"),
    ("review with Cato PS", "refined with your Cato team"),
    ("validate with Cato PS", "validated with your Cato team"),
    ("scope with PS", "scope with your Cato team"),
    ("Field-ready — demo verified", "Field-proven"),
    ("The source deck (<em>AI_Security-Use_Cases.pptx</em>) is explicitly marked work-in-progress,",
     "The source material behind this page is still evolving,"),
    ("one demo-tenant user", "one example user"),
    ("before customer use", "before deployment"),
    ("Review with Cato PS before deployment", "Refined with Cato before deployment"),
    ("your demo tenant", "a demonstration environment"),
    ("the demo tenant", "a demonstration environment"),
    ("demo tenant", "demonstration environment"),
]

SECTION_RE = re.compile(
    r'\n?[ \t]*<section id="(?:demo|talk-track|pov)"[^>]*>.*?</section>\n?', re.DOTALL)
DECK_BTN_RE = re.compile(
    r'\n?[ \t]*<a class="btn btn-ghost" href="[^"]*\.pptx"[^>]*>[^<]*</a>')
WHATSNEW_LINK_RE = re.compile(r'\n?[ \t]*<a class="nav-link" href="whatsnew.html">[^<]*</a>')
PLANNER_LINK_RE = re.compile(r'\n?[ \t]*<a class="nav-link" href="planner.html">[^<]*</a>')
# deck generator script tags (root and ../ forms) — the JS is deleted below, so the
# tags must go too or every page would 404 three scripts
DECK_SCRIPT_RE = re.compile(
    r'\n?[ \t]*<script src="(?:\.\./)?assets/js/deck-(?:brand|content|diagrams|export)\.js"></script>')

FIGURE_RE = re.compile(r'<figure class="shot">.*?</figure>', re.DOTALL)

# ---- Platform Demo category: SE-only facilitation pages (running orders, bridge lines,
# what to click). Derived from catalog.js so new segments are excluded automatically.
INTERNAL_CATEGORIES = ("Platform Demo",)
CAT_ENTRY_RE = re.compile(r'\n[ \t]*\{\s*\n\s*id: "([^"]+)",(?:(?!\n[ \t]*\{).)*?category: "([^"]+)".*?\n[ \t]*\},?', re.DOTALL)
CAT_COMMENT_RE = re.compile(r'\n[ \t]*,?\s*/\* -+ \d+ · Platform Demo[^\n]*\*/')

def internal_ids(cat_src: str):
    return {m.group(1) for m in CAT_ENTRY_RE.finditer(cat_src) if m.group(2) in INTERNAL_CATEGORIES}

def strip_catalog(cat_src: str) -> str:
    cat_src = CAT_ENTRY_RE.sub(lambda m: "" if m.group(2) in INTERNAL_CATEGORIES else m.group(0), cat_src)
    cat_src = CAT_COMMENT_RE.sub("", cat_src)
    # a trailing comma before the closing bracket is invalid in older engines — tidy it
    cat_src = re.sub(r'\},\s*\n\s*\];', '}\n];', cat_src)
    return cat_src

def strip_internal_links(text: str, ids) -> str:
    for pid in ids:
        # list items / paragraphs / table cells that only exist to link the internal page
        text = re.sub(r'\n?[ \t]*<li>(?:(?!</li>).)*?href="(?:\.\./usecases/|usecases/)?%s\.html(?:#[^"]*)?"(?:(?!</li>).)*?</li>' % re.escape(pid), "", text, flags=re.DOTALL)
        text = re.sub(r'\n?[ \t]*<p[^>]*>(?:(?!</p>).)*?href="(?:\.\./usecases/|usecases/)?%s\.html(?:#[^"]*)?"(?:(?!</p>).)*?</p>' % re.escape(pid), "", text, flags=re.DOTALL)
        # any remaining inline anchor: keep its text, drop the link
        text = re.sub(r'<a href="(?:\.\./usecases/|usecases/)?%s\.html(?:#[^"]*)?"[^>]*>(.*?)</a>' % re.escape(pid), r'\1', text, flags=re.DOTALL)
    return text

# the index "Running a first demo?" Start-here card is SE-only end to end (its links are all
# Platform Demo pages + the deck builder, which is stripped) — drop the whole card
INTERNAL_CARD_RE = re.compile(r'\n?[ \t]*<div class="card">\s*<h3[^>]*>🎬 Running a first demo\?</h3>.*?</div>(?=\s*(?:<div class="card">|</div>))', re.DOTALL)
INTERNAL_NAV_RE = re.compile(r'\n?[ \t]*<a class="nav-link" href="#cat-platform-demo">[^<]*</a>')
INTERNAL_FILTER_RE = re.compile(r'\n?[ \t]*<button class="filter-btn" data-cat="Platform Demo">[^<]*</button>')

def _strip_section(m):
    # screenshots are prospect-safe: salvage any figures from removed sections
    figs = FIGURE_RE.findall(m.group(0))
    if not figs:
        return "\n"
    return ('\n    <section id="gallery" class="reveal">\n'
            '      <div class="section-kicker">In the console</div>\n'
            '      <h2>What this looks like live</h2>\n      '
            + "\n      ".join(figs) + "\n    </section>\n")

def transform(text: str) -> str:
    text = SECTION_RE.sub(_strip_section, text)
    text = DECK_BTN_RE.sub("", text)
    text = WHATSNEW_LINK_RE.sub("", text)
    text = PLANNER_LINK_RE.sub("", text)
    text = DECK_SCRIPT_RE.sub("", text)
    for old, new in PHRASES:
        text = text.replace(old, new)
    return text

def main():
    if OUT.exists():
        for item in OUT.iterdir():
            if item.name == ".git":
                continue  # preserve the prospect repo's git history
            shutil.rmtree(item) if item.is_dir() else item.unlink()
    OUT.mkdir(exist_ok=True)

    # pages (Platform Demo pages are SE-only and never ship)
    skip = internal_ids((SRC / "assets" / "js" / "catalog.js").read_text())
    (OUT / "usecases").mkdir()
    n = 0
    for page in sorted((SRC / "usecases").glob("*.html")):
        if page.stem in skip:
            continue
        (OUT / "usecases" / page.name).write_text(strip_internal_links(transform(page.read_text()), skip))
        n += 1
    index_src = INTERNAL_FILTER_RE.sub("", INTERNAL_NAV_RE.sub("", (SRC / "index.html").read_text()))
    index_src = INTERNAL_CARD_RE.sub("", index_src).replace("five guided journeys", "four guided journeys")
    (OUT / "index.html").write_text(strip_internal_links(transform(index_src), skip))

    # assets (css/js/img) — catalog.js gets the wording pass too
    shutil.copytree(SRC / "assets", OUT / "assets")
    for internal in ("planner.js", "planner-rules.js", "planner-export.js", "planner-topology.js", "planner-logos.js",
                     # deck generator is an internal SE tool too: the decks it builds carry
                     # demo-flow instructions (what to click in the CMA), which are not
                     # prospect-facing. With the JS gone, the injected deck button and
                     # index builder never appear; the <script> tags are stripped above.
                     "deck-export.js", "deck-content.js", "deck-brand.js", "deck-diagrams.js"):
        f = OUT / "assets" / "js" / internal
        if f.exists():
            f.unlink()  # planner is an internal SE tool; never ships to prospects
    cat = OUT / "assets" / "js" / "catalog.js"
    cat_src = re.sub(r'deck: "[^"]*"', "deck: null", transform(strip_catalog(cat.read_text())))
    cat.write_text(cat_src)
    print(f"excluded {len(skip)} internal pages: {', '.join(sorted(skip))}")

    (OUT / "README.md").write_text(
        "# Cato SASE Use Case Library — Prospect Edition\n\n"
        "A self-contained library of Cato Networks use cases for teams evaluating SASE.\n"
        "Open `index.html` in any browser — fully offline, no installation.\n\n"
        "> GENERATED RESOURCE — do not edit by hand. This edition is derived from the\n"
        "> internal master library by `_extract/build-prospect.py`; all changes are made\n"
        "> there and regenerated. Wording rules live in the generator.\n")
    (OUT / ".gitignore").write_text(".DS_Store\n")
    # the copied search index was built from the internal pages; rebuild it from
    # the transformed output so prospects never search (or receive) internal wording
    subprocess.run([sys.executable, str(Path(__file__).resolve().parent / "build-search.py"),
                    "--root", str(OUT)], check=True)

    print(f"prospect edition generated: {n} pages + index + assets -> {OUT}")

if __name__ == "__main__":
    main()
