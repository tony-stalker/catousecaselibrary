#!/usr/bin/env python3
"""staleness-check.py — surface overdue rows in _extract/STALENESS.md and rotten
dated wording on the pages those rows point at.

Two passes:

1. REGISTER. Parse the `| Dated fact | Where it lives | Recheck when |` table.
   For each row read the "Recheck when" cell:
     - explicit dates ("Mar 2027", "~Apr 2027", "2 Aug 2026")  -> due on the earliest one
     - a cadence word (Monthly / Quarterly / Semi-annually / Annually, "~annual")
       -> due = baseline + cadence, where the baseline is the latest date written in
          the row itself (verified/checked/accessed/updated ... 24 Sep 2026), else the
          register's "Last full staleness review" stamp, else its build-time month
       (dates quoted or cited in prose — "since 7 Aug 2026", "(upd. Aug 2026)" — are
       not triggers; a cadence-led cell only takes a date it points at: "after 2 Aug 2026")
     - "Stable" / event-only triggers ("On OJ publication") -> not computed
   A row is OVERDUE when its due date is on or before today.

2. ROT PATTERNS. Resolve each row's "Where it lives" to files (usecases/<id>.html,
   `(-policy)` expansions, "<Category> pages", "every page with a #pov section",
   "all pages with path chips", deck-content -> assets/js/deck-content.js) and grep
   their visible text — tags stripped, entities decoded, whitespace collapsed, so a
   phrase wrapped across source lines still matches; SVG <text>, img alt and
   figcaption are kept — for wording the Oct 2026 audit found rotting:
   "80+ PoPs"/"80+ Cato", a prior-year "Gartner Magic Quadrant", "still pending",
   "would land", future-tense wording ("will be", "expected", "promised", "due")
   followed by a month that has passed, "in <past year>", "this year", and
   "as of / verified / checked <date>" stamps older than --stamp-days (default 90).
   Pages no register row names are swept too (rot does not wait to be registered).

Usage:
  python3 _extract/staleness-check.py            # report; exit 0 (warn-only)
  python3 _extract/staleness-check.py --strict   # exit 1 if anything is overdue or rotten
  python3 _extract/staleness-check.py --today 2027-02-01 --verbose

Stdlib only. Silent-ish on success: one summary line.
"""
import argparse
import datetime as dt
import html
import re
import sys
from pathlib import Path

LIB_ROOT = Path(__file__).resolve().parent.parent
REGISTER = LIB_ROOT / "_extract" / "STALENESS.md"
USECASES = LIB_ROOT / "usecases"
CATALOG = LIB_ROOT / "assets" / "js" / "catalog.js"
EXTRA_FILES = {"deck-content": LIB_ROOT / "assets" / "js" / "deck-content.js"}

MONTHS = {m: i for i, m in enumerate(
    ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"], 1)}
MONTH_ALT = r"Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec"
MONTH_RE = r"(" + MONTH_ALT + r")[a-z]*"
# "24 Sep 2026" | "Sep 2026" | "September 2026" (optionally prefixed ~)
DATE_RE = re.compile(r"(?:(\d{1,2})\s+)?~?\b" + MONTH_RE + r"\s+(20\d\d)\b")
CADENCE = [
    (re.compile(r"\bmonthly\b", re.I), 1),
    (re.compile(r"\bquarterly\b", re.I), 3),
    (re.compile(r"\bsemi-?annual", re.I), 6),
    (re.compile(r"\bannual", re.I), 12),
]
STABLE = re.compile(r"\bstable\b", re.I)
# a parenthetical that is nothing but a date: "(~Apr 2027)", "(2 Aug 2026)"
DATE_ONLY = re.compile(r"~?(?:\d{1,2}\s+)?" + MONTH_RE + r"\s+20\d\d")

SCRIPT_STYLE = re.compile(r"<(script|style)\b.*?</\1\s*>", re.I | re.S)
COMMENTS = re.compile(r"<!--.*?-->", re.S)
ALT = re.compile(r'<img\b[^>]*\balt="([^"]*)"', re.I)
TAGS = re.compile(r"<[^>]+>")


# ---------------------------------------------------------------- helpers

def parse_date(m, day_default=1):
    day = int(m.group(1)) if m.group(1) else day_default
    mon = MONTHS[m.group(2)[:3].lower()]
    year = int(m.group(3))
    try:
        return dt.date(year, mon, day)
    except ValueError:
        return dt.date(year, mon, 1)


def add_months(d, n):
    y, m = divmod(d.month - 1 + n, 12)
    return dt.date(d.year + y, m + 1, min(d.day, 28))


def visible_text(path):
    """Tags stripped, entities decoded, whitespace collapsed. alt text is kept
    (appended where the <img> sat); SVG <text> and <figcaption> survive naturally."""
    raw = path.read_text(encoding="utf-8", errors="replace")
    if path.suffix == ".html":
        raw = SCRIPT_STYLE.sub(" ", raw)
        raw = COMMENTS.sub(" ", raw)
        raw = ALT.sub(lambda m: " " + m.group(1) + " ", raw)
        raw = TAGS.sub(" ", raw)
    raw = html.unescape(raw).replace(" ", " ")
    return re.sub(r"\s+", " ", raw)


def load_catalog():
    """id -> category, from catalog.js (regex, no JS engine)."""
    cats = {}
    if not CATALOG.exists():
        return cats
    src = CATALOG.read_text(encoding="utf-8")
    for m in re.finditer(r'id: "([^"]+)".*?category: "([^"]+)"', src, re.S):
        cats[m.group(1)] = m.group(2)
    return cats


def resolve_where(cell, catalog):
    """Map a 'Where it lives' cell to a set of files. Unresolvable tokens are returned
    separately so --verbose can show them; they are never an error."""
    files, unresolved = set(), []
    pages = {p.stem: p for p in USECASES.glob("*.html")}
    low = cell.lower()
    if "#pov" in low or 'id="pov"' in low:
        files |= {p for p in pages.values() if 'id="pov"' in p.read_text(encoding="utf-8")}
        return files, unresolved
    if "path chips" in low:
        files |= {p for p in pages.values() if 'class="path"' in p.read_text(encoding="utf-8")}
        return files, unresolved
    cell = re.sub(r"\((?!-)[^)]*\)", " ", cell)  # "(check-type table, PoV ...)" is prose, not a page
    for tok in re.split(r",|;|\band\b|\+", cell):
        tok = tok.strip(" .")
        if not tok:
            continue
        # "security-iso27001 (check-type table, ...)" -> handled above by stripping parens
        # "migration-palo-alto(-policy)" -> both pages
        m = re.match(r"([a-z0-9-]+)\((-[a-z0-9-]+)\)$", tok)
        cands = [m.group(1), m.group(1) + m.group(2)] if m else [tok]
        hit = False
        for c in cands:
            if c in pages:
                files.add(pages[c]); hit = True
            elif c in EXTRA_FILES and EXTRA_FILES[c].exists():
                files.add(EXTRA_FILES[c]); hit = True
        if hit:
            continue
        # "<Category> pages" / "<Category> category"
        cm = re.match(r"(.+?)\s+(pages|category)$", tok, re.I)
        if cm:
            want = cm.group(1).strip().lower()
            ids = [i for i, c in catalog.items() if c.lower() == want]
            if ids:
                files |= {pages[i] for i in ids if i in pages}; continue
            # "palo-alto, fortinet, versa pages" — the last token carries "pages"
            want = cm.group(1).strip().lower()
            sub = [p for s, p in pages.items() if want in s]
            if sub:
                files |= set(sub); continue
        sub = [p for s, p in pages.items() if tok.lower() in s]
        if sub and len(sub) <= 6:
            files |= set(sub); continue
        unresolved.append(tok)
    return files, unresolved


# ---------------------------------------------------------------- register

STAMP_WORDS = r"\b(?:verified|checked|accessed|fetched|updated|reframed|re-?verified|review(?:ed)?|sweep|as of|read)"


def verification_dates(text):
    """Dates in a register cell that stamp WHEN the fact was last looked at
    ("KB verified 23 Jul 2026", "26 Sep 2026 sweep", "all sources accessed 11 Sep 2026")
    — not the historical dates inside the fact itself ("EOS Sep 2025")."""
    out = []
    for m in DATE_RE.finditer(text):
        before = text[max(0, m.start() - 40):m.start()]
        after = text[m.end():m.end() + 25]
        if re.search(STAMP_WORDS + r"[^.;|]{0,25}$", before, re.I) or re.match(r"[^.;|]{0,12}" + STAMP_WORDS, after, re.I):
            out.append(parse_date(m))
    return out


def parse_register():
    text = REGISTER.read_text(encoding="utf-8")
    stamp = re.search(r"Last full staleness review[^\n]*", text, re.I)
    sd = DATE_RE.search(stamp.group(0)) if stamp else None
    if sd:
        baseline_default = parse_date(sd)
    else:
        m = re.search(r"build time \((" + MONTH_RE + r"\s+20\d\d)\)", text)
        baseline_default = parse_date(DATE_RE.search(m.group(1))) if m else dt.date(2026, 7, 1)
    rows = []
    for line in text.splitlines():
        if not line.startswith("|") or line.startswith("|---") or "Dated fact" in line:
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 3:
            continue
        fact, where, when = cells[0], cells[1], " | ".join(cells[2:])
        row = {"fact": fact, "where": where, "when": when, "due": None, "kind": "event"}
        if STABLE.search(when) and not DATE_RE.search(when) and not any(c.search(when) for c, _ in CADENCE):
            row["kind"] = "stable"
        # Dates inside quotes ("since 7 Aug 2026") or prose parentheticals ("(upd. Aug 2026)")
        # describe the fact, not the trigger; a bare "(~Apr 2027)" is a trigger and is kept.
        trig = re.sub(r'"[^"]*"|“[^”]*”', " ", when)
        trig = re.sub(r"\(([^)]*)\)", lambda m: m.group(0) if DATE_ONLY.fullmatch(m.group(1).strip()) else " ", trig)
        explicit = [parse_date(m, day_default=1) for m in DATE_RE.finditer(trig)]
        if re.match(r"\s*(monthly|quarterly|semi-?annual|annual)", when, re.I):
            # a cell that LEADS with a cadence is a cadence row; a date in it only counts as the
            # trigger when it is pointed at ("refresh after 2 Aug 2026"), not cited ("(Jun 2026)")
            explicit = [parse_date(m, day_default=1) for m in DATE_RE.finditer(trig)
                        if re.search(r"\b(after|by|before|until|from|then|on)\s*$", trig[max(0, m.start() - 12):m.start()], re.I)]
        cad = [n for c, n in CADENCE if c.search(when)]
        if explicit:
            row["due"], row["kind"] = min(explicit), "date"
        elif cad:
            own = verification_dates(fact + " " + where)
            base = max(own) if own else baseline_default
            row["due"], row["kind"] = add_months(base, min(cad)), "cadence"
            row["base"] = base
        rows.append(row)
    return rows, baseline_default


# ---------------------------------------------------------------- rot

def rot_patterns(today, stamp_days):
    cutoff = today - dt.timedelta(days=stamp_days)
    past_years = "|".join(str(y) for y in range(2020, today.year))
    pats = [
        ("80+ PoPs", re.compile(r"\b80\+\s*(PoPs?|Cato)\b", re.I)),
        ("prior-year Gartner MQ", re.compile(r"\b(" + past_years + r") Gartner Magic Quadrant", re.I)),
        ("still pending", re.compile(r"\bstill pending\b", re.I)),
        ("would land", re.compile(r"\bwould land\b", re.I)),
        ("this year", re.compile(r"\bthis year\b", re.I)),
        # "an estate in 2026 is ..." / "every audience recognises in 2026" — present-tense framing of a year that has ended
        ("in <past year> as present", re.compile(
            r"\b(?:recognises?|is|are|remains?|sits?|stays?|today|currently|now)\b[^.;]{0,30}\bin (" + past_years + r")\b"
            r"|\bin (" + past_years + r")\b[^.;]{0,30}\b(?:is|are|remains?|sits?|stays?|today|currently|now)\b")),
    ]

    def future_past(text):
        """'will be / expected / promised / due ... <Month Year>' where the month has passed."""
        out = []
        for m in re.finditer(r"\b(will (?:be|land|apply|ship|take effect)|expected|promised|scheduled|is due|due (?:in|by|on))\b([^.;]{0,70}?)"
                             r"(?:(\d{1,2})\s+)?(" + MONTH_ALT + r")[a-z]*\s+(20\d\d)\b", text, re.I):
            d = dt.date(int(m.group(5)), MONTHS[m.group(4)[:3].lower()], 1)
            # the whole month must have passed before we call it rot
            if add_months(d, 1) <= today:
                out.append(m)
        return out

    def old_stamp(text):
        out = []
        for m in re.finditer(r"\b(as of|verified(?: on| in)?|checked(?: on)?|accessed(?: on)?|fetched(?: on)?)\s+"
                             r"(?:(\d{1,2})\s+)?(" + MONTH_ALT + r")[a-z]*\s+(20\d\d)\b", text, re.I):
            d = dt.date(int(m.group(4)), MONTHS[m.group(3)[:3].lower()], int(m.group(2) or 1))
            if d <= cutoff:
                out.append(m)
        return out

    return pats, [("future tense, month passed", future_past), ("stamp older than %dd" % stamp_days, old_stamp)]


def scan(files, today, stamp_days):
    pats, funcs = rot_patterns(today, stamp_days)
    hits = []  # (file, label, snippet)
    for f in sorted(files):
        text = visible_text(f)
        for label, rx in pats:
            for m in rx.finditer(text):
                hits.append((f, label, text[max(0, m.start() - 35):m.end() + 35]))
        for label, fn in funcs:
            for m in fn(text):
                hits.append((f, label, text[max(0, m.start() - 35):m.end() + 35]))
    return hits


# ---------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--strict", action="store_true", help="exit 1 when anything is overdue or rotten (default: warn only, exit 0)")
    ap.add_argument("--today", help="YYYY-MM-DD to evaluate as (default: today)")
    ap.add_argument("--stamp-days", type=int, default=90, help="flag 'as of/verified <date>' stamps older than this (default 90)")
    ap.add_argument("--verbose", "-v", action="store_true", help="also list event-only rows, unresolved locations and every hit")
    a = ap.parse_args()
    try:
        today = dt.date.fromisoformat(a.today) if a.today else dt.date.today()
    except ValueError:
        ap.error("--today must be YYYY-MM-DD, got %r" % a.today)

    if not REGISTER.exists():
        print("staleness-check: %s missing" % REGISTER); sys.exit(1)
    catalog = load_catalog()
    rows, baseline = parse_register()

    overdue, unresolved_all, named = [], [], set()
    for r in rows:
        files, unres = resolve_where(r["where"], catalog)
        r["files"] = files; named |= files
        unresolved_all += [(u, r["fact"][:50]) for u in unres]
        if r["due"] and r["due"] <= today:
            overdue.append(r)

    all_pages = set(USECASES.glob("*.html")) | {p for p in EXTRA_FILES.values() if p.exists()}
    hits = scan(all_pages, today, a.stamp_days)
    # group stamp hits per file so a page with 15 "verified 23 Jul 2026" prints once
    grouped = {}
    for f, label, snip in hits:
        grouped.setdefault((f, label), []).append(snip)

    print("staleness-check (%s): %d register rows, %d overdue; %d rot hits in %d files"
          % (today.isoformat(), len(rows), len(overdue), len(hits), len({f for f, _, _ in hits})))

    if overdue:
        print("\nOVERDUE register rows (recheck, update the page, move the row's date forward):")
        for r in sorted(overdue, key=lambda r: r["due"]):
            pages = ", ".join(sorted(p.stem for p in r["files"])) or r["where"]
            base = (" (base %s)" % r["base"].isoformat()) if r.get("base") else ""
            print("  due %s%s  %s" % (r["due"].isoformat(), base, r["fact"][:90].rstrip()))
            print("      -> %s | %s" % (pages[:110], r["when"][:80]))

    if grouped:
        print("\nROT patterns on pages (visible text incl. SVG text / alt / figcaption):")
        for (f, label), snips in sorted(grouped.items(), key=lambda kv: (str(kv[0][0]), kv[0][1])):
            rel = f.relative_to(LIB_ROOT)
            mark = "" if f in named else "  [page not in register]"
            if label.startswith("stamp") and len(snips) > 1 and not a.verbose:
                print("  %s: %s x%d  e.g. ...%s..." % (rel, label, len(snips), snips[0].strip()))
                continue
            for s in snips:
                print("  %s: %s%s\n      ...%s..." % (rel, label, mark, s.strip()))

    if a.verbose:
        ev = [r for r in rows if r["kind"] == "event"]
        if ev:
            print("\nEvent-only triggers (not computed):")
            for r in ev:
                print("  %s | %s" % (r["fact"][:70], r["when"][:60]))
        if unresolved_all:
            print("\nUnresolved 'Where it lives' tokens:")
            for u, fact in unresolved_all:
                print("  %r  (row: %s)" % (u, fact))
        print("\nBaseline for cadence rows without their own date: %s" % baseline.isoformat())

    bad = bool(overdue or hits)
    if bad and not a.strict:
        print("\n(warn-only — pass --strict to fail on these)")
    sys.exit(1 if (a.strict and bad) else 0)


if __name__ == "__main__":
    main()
