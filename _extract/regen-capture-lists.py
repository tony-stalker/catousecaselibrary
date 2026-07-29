#!/usr/bin/env python3
"""Regenerate CAPTURE-LIST.md and CAPTURE-STAGING.md against live capture-wanted comments.

Both files are grouped by hand-curated headings, so this script FILTERS rather than
rebuilds: bullets whose (page, text) no longer matches a live `<!-- capture-wanted: ... -->`
comment are dropped (i.e. the capture has been embedded), per-section counts and the
header totals are rewritten. Live wants that appear in neither file are printed at the
end for manual placement — add them under the right heading by hand.

Usage: python3 _extract/regen-capture-lists.py   (from the library root)
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s.replace("«", "").replace("»", "")).strip()


def live_wants():
    wants = set()
    for page in sorted((ROOT / "usecases").glob("*.html")):
        for m in re.finditer(r"<!--\s*capture-wanted:\s*(.*?)\s*-->", page.read_text(), re.S):
            wants.add((page.stem, norm(m.group(1))))
    return wants


def filter_file(path: Path, bullet_re: str, live: set, seen: set) -> int:
    lines = path.read_text().splitlines(keepends=True)
    out, section_start, kept_total = [], None, 0

    def close_section():
        # rewrite the trailing "(N)" on the section heading to the kept bullet count
        if section_start is None:
            return
        n = sum(1 for l in out[section_start + 1:] if re.match(bullet_re, l))
        out[section_start] = re.sub(r"\(\d+\)\s*$", f"({n})", out[section_start].rstrip()) + "\n"

    for line in lines:
        m = re.match(bullet_re, line)
        if m:
            key = (m.group(1), norm(m.group(2)))
            if key in live:
                seen.add(key)
                out.append(line)
                kept_total += 1
            continue
        if line.startswith("## "):
            close_section()
            section_start = len(out)
        out.append(line)
    close_section()
    path.write_text("".join(out))
    return kept_total


def main():
    live = live_wants()
    seen = set()

    lst = ROOT / "_extract/CAPTURE-LIST.md"
    n_list = filter_file(lst, r"- \*\*([\w-]+)\*\*: (.+)", live, seen)
    pages = len({p for p, _ in live})
    txt = lst.read_text()
    txt = re.sub(r"Regenerated \d+ live `capture-wanted` items across \d+ pages",
                 f"Regenerated {n_list} live `capture-wanted` items across {pages} pages", txt)
    lst.write_text(txt)

    stg = ROOT / "_extract/CAPTURE-STAGING.md"
    n_stg = filter_file(stg, r"- ([\w-]+): (.+)", live, seen)
    txt = stg.read_text()
    txt = re.sub(r"\d+ of the \d+ still-wanted captures",
                 f"{n_stg} of the {n_list} still-wanted captures", txt)
    stg.write_text(txt)

    print(f"CAPTURE-LIST: {n_list} wants across {pages} pages; CAPTURE-STAGING: {n_stg}")
    missing = live - seen
    if missing:
        print(f"\nWARNING — {len(missing)} live want(s) not in CAPTURE-LIST.md; add manually:")
        for p, t in sorted(missing):
            print(f"  - **{p}**: {t}")
        sys.exit(1)


if __name__ == "__main__":
    main()
