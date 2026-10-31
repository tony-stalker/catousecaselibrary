#!/usr/bin/env python3
"""check-deck-content.py — validate assets/js/deck-content.js (window.UC_DECKS) and
assert the README category table matches assets/js/catalog.js.

Deck content checks (one line per failure, exit 1 if any):
  * the object after `window.UC_DECKS =` parses as strict JSON
  * UC_DECKS keys == catalog ids (no missing, no orphan entries)
  * every entry has exactly {pain, gain, demo, hook, notes} (+ slot on demo-* segments)
  * pain[3] gain[3] — non-empty strings; demo[3..7] of {area, show} non-empty strings
  * demo[].area uses " » " as the menu separator (never →, >, ->, ::, or unspaced »)
  * hook is a non-empty string; notes has exactly {divider, why, demo}, each non-empty
  * banned words anywhere in an entry: leverage, seamless, and the exclamation mark
  * demo-* entries (except the demo-platform-60 spine) carry slot "MM–MM" (en dash)
  * each notes passage ≤ 170 words — WARN by default, FAIL with --strict

Catalog count checks:
  * every "| Category | N | ..." row of the README table matches the catalog count
  * every catalog category appears in the README table
  * the README headline page count ("N Cato Networks use cases") matches the catalog

Usage:
  python3 _extract/check-deck-content.py            # silent-ish on success, exit 1 on failure
  python3 _extract/check-deck-content.py --strict   # notes > 170 words is a failure, not a warning
  python3 _extract/check-deck-content.py --max-words 200

Stdlib only; regex + json on the JS files — no node, no browser.
"""
import argparse
import json
import re
import sys
from collections import Counter
from pathlib import Path

LIB_ROOT = Path(__file__).resolve().parent.parent
DECK_JS = LIB_ROOT / "assets" / "js" / "deck-content.js"
CATALOG_JS = LIB_ROOT / "assets" / "js" / "catalog.js"
README = LIB_ROOT / "README.md"

TOP_KEYS = {"pain", "gain", "demo", "hook", "notes"}
NOTE_KEYS = {"divider", "why", "demo"}
SPINE_ID = "demo-platform-60"          # the running order itself — segments carry slots, it does not
SLOT_RE = re.compile(r"^\d{1,2}–\d{1,2}$")   # en dash, e.g. "10–15"
BANNED_WORDS = re.compile(r"\b(leverage[sd]?|leveraging|seamless(?:ly)?)\b", re.I)
BAD_SEPARATORS = ("→", " > ", "->", "::", ">>")
README_ROW = re.compile(r"^\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|", re.M)
README_HEADLINE = re.compile(r"\*\*(\d+) Cato Networks use cases\*\*")


def load_decks(path):
    src = path.read_text(encoding="utf-8")
    m = re.search(r"window\.UC_DECKS\s*=\s*", src)
    if not m:
        raise ValueError("no `window.UC_DECKS =` assignment found")
    body = src[m.end():].rstrip()
    if body.endswith(";"):
        body = body[:-1]
    return json.loads(body)


def nonempty_str(v):
    return isinstance(v, str) and v.strip() != ""


def str_list(v, n):
    return isinstance(v, list) and len(v) == n and all(nonempty_str(x) for x in v)


def walk_strings(obj):
    if isinstance(obj, str):
        yield obj
    elif isinstance(obj, dict):
        for v in obj.values():
            yield from walk_strings(v)
    elif isinstance(obj, list):
        for v in obj:
            yield from walk_strings(v)


def check_entry(uid, e, max_words, strict, errs, warns):
    if not isinstance(e, dict):
        errs.append(f"{uid}: entry is not an object"); return
    keys = set(e)
    expected = TOP_KEYS | ({"slot"} if uid.startswith("demo-") and uid != SPINE_ID else set())
    if keys != expected:
        extra, missing = keys - expected, expected - keys
        if missing: errs.append(f"{uid}: missing keys {sorted(missing)}")
        if extra: errs.append(f"{uid}: unexpected keys {sorted(extra)}")
    if not str_list(e.get("pain"), 3):
        errs.append(f"{uid}: pain must be exactly 3 non-empty strings")
    if not str_list(e.get("gain"), 3):
        errs.append(f"{uid}: gain must be exactly 3 non-empty strings")
    demo = e.get("demo")
    if not isinstance(demo, list) or not 3 <= len(demo) <= 7:
        errs.append(f"{uid}: demo must be a list of 3..7 steps (got {len(demo) if isinstance(demo, list) else type(demo).__name__})")
    else:
        for i, step in enumerate(demo, 1):
            if not isinstance(step, dict) or set(step) != {"area", "show"}:
                errs.append(f"{uid}: demo[{i}] must be {{area, show}}"); continue
            if not nonempty_str(step["area"]) or not nonempty_str(step["show"]):
                errs.append(f"{uid}: demo[{i}] area/show must be non-empty strings"); continue
            area = step["area"]
            for sep in BAD_SEPARATORS:
                if sep in area:
                    errs.append(f"{uid}: demo[{i}] area uses {sep!r} — separator must be ' » ': {area!r}")
            if "»" in area and re.search(r"\S»|»\S", area):
                errs.append(f"{uid}: demo[{i}] area has an unspaced » — use ' » ': {area!r}")
    if not nonempty_str(e.get("hook")):
        errs.append(f"{uid}: hook must be a non-empty string")
    notes = e.get("notes")
    if not isinstance(notes, dict) or set(notes) != NOTE_KEYS:
        errs.append(f"{uid}: notes must have exactly {sorted(NOTE_KEYS)}")
    else:
        for k, v in notes.items():
            if not nonempty_str(v):
                errs.append(f"{uid}: notes.{k} must be a non-empty string"); continue
            n = len(v.split())
            if n > max_words:
                msg = f"{uid}: notes.{k} is {n} words (limit {max_words})"
                (errs if strict else warns).append(msg)
    if "slot" in e:
        if not uid.startswith("demo-"):
            errs.append(f"{uid}: slot only belongs on demo-* segment entries")
        elif not (isinstance(e["slot"], str) and SLOT_RE.match(e["slot"])):
            errs.append(f"{uid}: slot must look like '10–15' (en dash), got {e['slot']!r}")
    for s in walk_strings(e):
        if "!" in s:
            errs.append(f"{uid}: exclamation mark in {s[:60]!r}…")
        m = BANNED_WORDS.search(s)
        if m:
            errs.append(f"{uid}: banned word {m.group(0)!r} in {s[:60]!r}…")


def check_readme_counts(catalog_src, errs):
    cats = Counter(re.findall(r'category: "([^"]+)"', catalog_src))
    text = README.read_text(encoding="utf-8")
    rows = {name: int(n) for name, n in README_ROW.findall(text) if name != "Category"}
    for name, n in sorted(rows.items()):
        if name not in cats:
            errs.append(f"README: category {name!r} not in catalog.js")
        elif cats[name] != n:
            errs.append(f"README: {name} says {n} pages, catalog.js has {cats[name]}")
    for name in sorted(set(cats) - set(rows)):
        errs.append(f"README: catalog category {name!r} missing from the Contents table")
    hm = README_HEADLINE.search(text)
    total = sum(cats.values())
    if not hm:
        errs.append("README: headline 'N Cato Networks use cases' not found")
    elif int(hm.group(1)) != total:
        errs.append(f"README: headline says {hm.group(1)} use cases, catalog.js has {total}")
    return cats


def main():
    ap = argparse.ArgumentParser(description="Validate deck-content.js and README/catalog counts")
    ap.add_argument("--strict", action="store_true", help="notes over the word limit fail instead of warn")
    ap.add_argument("--max-words", type=int, default=170, help="per-passage speaker-notes word limit (default 170)")
    args = ap.parse_args()

    errs, warns = [], []
    try:
        decks = load_decks(DECK_JS)
    except (ValueError, json.JSONDecodeError) as ex:
        print(f"FAIL: {DECK_JS.relative_to(LIB_ROOT)} does not parse: {ex}")
        sys.exit(1)
    catalog_src = CATALOG_JS.read_text(encoding="utf-8")
    ids = re.findall(r'id: "([^"]+)"', catalog_src)
    deck_ids = set(decks)
    for uid in sorted(set(ids) - deck_ids):
        errs.append(f"catalog id has no UC_DECKS entry: {uid}")
    for uid in sorted(deck_ids - set(ids)):
        errs.append(f"UC_DECKS entry not in catalog: {uid}")
    for uid in sorted(deck_ids):
        check_entry(uid, decks[uid], args.max_words, args.strict, errs, warns)
    cats = check_readme_counts(catalog_src, errs)

    for w in warns:
        print("WARN:", w)
    if errs:
        print("\n".join(errs))
        print(f"{len(errs)} problem(s)")
        sys.exit(1)
    print(f"OK — {len(decks)} deck entries match {len(ids)} catalog ids; README counts match "
          f"({len(cats)} categories, {sum(cats.values())} pages)"
          + (f"; {len(warns)} warning(s)" if warns else ""))


if __name__ == "__main__":
    main()
