#!/usr/bin/env python3
"""Generate whatsnew.html from the git history.

Usage: python3 _extract/whatsnew.py [--all] [--out PATH]
       (from the library root; run after committing)

What it does
  - reads `git log` (date, subject, body) for every commit on the current branch
  - drops bookkeeping commits ("Regenerate what's-new", "Regenerate") unless --all
  - joins hard-wrapped bullet lines back into whole sentences
  - groups entries by month (one <h2> per month, latest month open) and by
    week-commencing inside each month, in <details> blocks
  - derives a category chip per entry from the use-case page ids it mentions
    (id -> category via assets/js/catalog.js) and links every page id or
    usecases/<id>.html token to the page
  - keeps the theme bootstrap, topnav/hero/footer chrome and the app.js include

Exit status 1 if git fails or a bullet still looks truncated (ends in ',' or '(').
"""
import argparse
import datetime as dt
import html
import re
import subprocess
import sys
from collections import OrderedDict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SEP = "\x1e"
END = "\x1f"
SKIP_SUBJECT = re.compile(r"^regenerate( what'?s[- ]new)?\.?$", re.I)
TRAILER = re.compile(r"^(Co-Authored-By|Claude-Session|Signed-off-by|Reviewed-by|Change-Id):", re.I)
BULLET = re.compile(r"^\s*[-*•]\s+(.*)$")


# ---------------------------------------------------------------- catalogue
def load_catalog():
    """id -> (category, title) from catalog.js, in catalogue order."""
    src = (ROOT / "assets" / "js" / "catalog.js").read_text(encoding="utf-8")
    cat = OrderedDict()
    for m in re.finditer(r'\bid:\s*"([^"]+)"', src):
        tail = src[m.end():m.end() + 2000]
        c = re.search(r'\bcategory:\s*"([^"]+)"', tail)
        t = re.search(r'\btitle:\s*"([^"]*)"', tail)
        cat[m.group(1)] = (c.group(1) if c else "", t.group(1) if t else m.group(1))
    return cat


def cat_slug(c):
    return re.sub(r"[^a-z0-9]+", "-", c.lower()).strip("-")


# ---------------------------------------------------------------- git log
def read_log():
    fmt = f"%h{SEP}%ad{SEP}%s{SEP}%b{END}"
    try:
        out = subprocess.run(
            ["git", "-C", str(ROOT), "log", f"--pretty=format:{fmt}", "--date=format:%Y-%m-%d"],
            capture_output=True, text=True, check=True).stdout
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        sys.exit(f"whatsnew.py: git log failed: {e}")
    entries = []
    for chunk in out.split(END):
        if not chunk.strip():
            continue
        sha, date, subject, body = (chunk.strip("\n").split(SEP, 3) + ["", "", ""])[:4]
        entries.append({
            "sha": sha.strip(), "date": dt.date.fromisoformat(date.strip()),
            "subject": subject.strip(), "bullets": parse_body(body),
        })
    return entries


def parse_body(body):
    """Return a list of (kind, text): kind is 'li' for bullets, 'p' for paragraphs.
    Hard-wrapped continuation lines are joined onto the bullet/paragraph above."""
    items = []
    current = None
    for raw in body.splitlines():
        line = raw.rstrip()
        if TRAILER.match(line.strip()):
            continue
        if not line.strip():
            current = None
            continue
        m = BULLET.match(line)
        if m:
            current = ["li", m.group(1).strip()]
            items.append(current)
        elif current is not None:
            current[1] = f"{current[1]} {line.strip()}"
        else:
            current = ["p", line.strip()]
            items.append(current)
    return [(k, re.sub(r"\s{2,}", " ", t)) for k, t in items]


# ---------------------------------------------------------------- rendering
def make_linker(catalog):
    ids = sorted(catalog, key=len, reverse=True)
    alt = "|".join(re.escape(i) for i in ids)
    pat = re.compile(rf"(?<![\w/-])(?:usecases/)?({alt})(?:\.html)?(?![\w-])")

    def link(text):
        esc = html.escape(text)

        def sub(m):
            uid = m.group(1)
            title = html.escape(catalog[uid][1], quote=True)
            return f'<a href="usecases/{uid}.html" title="{title}">{m.group(0)}</a>'
        return pat.sub(sub, esc)

    def mentioned(text):
        return [m.group(1) for m in pat.finditer(text)]
    return link, mentioned


def month_label(d):
    return d.strftime("%B %Y")


def week_start(d):
    return d - dt.timedelta(days=d.weekday())


def render_entry(e, link, mentioned, catalog):
    text = e["subject"] + "\n" + "\n".join(t for _, t in e["bullets"])
    cats = OrderedDict()
    for uid in mentioned(text):
        cats.setdefault(catalog[uid][0], True)
    chips = "".join(
        f'<span class="chip chip-cat-{cat_slug(c)}">{html.escape(c)}</span>' for c in cats if c
    ) or '<span class="chip wn-chip-lib">Library</span>'
    # Keep the commit body's own order: paragraphs and bullet runs interleave
    # as written (an intro line ending in ':' must stay above its list).
    parts, run = [], []
    for k, t in e["bullets"]:
        if k == "li":
            run.append(t)
            continue
        if run:
            parts.append("<ul>" + "".join(f"<li>{link(x)}</li>" for x in run) + "</ul>")
            run = []
        parts.append(f"<p>{link(t)}</p>")
    if run:
        parts.append("<ul>" + "".join(f"<li>{link(x)}</li>" for x in run) + "</ul>")
    body = "".join(parts)
    iso = e["date"].isoformat()
    nice = f"{e['date'].day} {e['date']:%B %Y}"
    return f'''
      <article class="card wn-card" id="c-{e["sha"]}">
        <div class="wn-head">
          <span class="section-kicker"><time datetime="{iso}">{nice}</time></span>
          <span class="wn-chips">{chips}</span>
        </div>
        <h4><a class="wn-anchor" href="#c-{e["sha"]}">{link(e["subject"])}</a></h4>
        {body}
      </article>'''


def render_groups(entries, link, mentioned, catalog):
    months = OrderedDict()
    for e in entries:
        months.setdefault(e["date"].strftime("%Y-%m"), []).append(e)
    out = ""
    for i, (key, es) in enumerate(months.items()):
        weeks = OrderedDict()
        for e in es:
            weeks.setdefault(week_start(e["date"]), []).append(e)
        wk_html = ""
        for ws, wes in weeks.items():
            cards = "".join(render_entry(e, link, mentioned, catalog) for e in wes)
            wk_html += f'''
    <section class="wn-week">
      <h3>Week commencing {ws.day} {ws:%B}</h3>{cards}
    </section>'''
        n = len(es)
        out += f'''
  <details class="wn-month" id="m-{key}"{" open" if i == 0 else ""}>
    <summary><h2>{month_label(es[0]["date"])}</h2><span class="wn-n">{n} change{"" if n == 1 else "s"}</span></summary>{wk_html}
  </details>'''
    return out, len(months)


STYLE = """
<style>
  .wn-intro { color: var(--ink-2); margin: 0 0 22px; font-size: .95rem; }
  .wn-month { margin: 0 0 18px; }
  .wn-month > summary {
    list-style: none; cursor: pointer; display: flex; align-items: baseline; gap: 14px;
    padding: 10px 0; border-bottom: 2px solid var(--hairline);
  }
  .wn-month > summary::-webkit-details-marker { display: none; }
  .wn-month > summary::before {
    content: "▸"; font-size: 1rem; color: var(--green-600); transition: transform .15s; align-self: center;
  }
  .wn-month[open] > summary::before { transform: rotate(90deg); }
  .wn-month > summary h2 { margin: 0; font-size: 1.35rem; }
  .wn-month > summary .wn-n { color: var(--ink-3); font-size: .9rem; }
  .wn-month > summary:focus-visible { outline: 2px solid var(--green-600); outline-offset: 4px; }
  .wn-week { margin: 18px 0 8px; }
  .wn-week h3 { font-size: .8rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); margin: 0 0 10px; }
  .wn-card { margin: 0 0 14px; }
  .wn-head { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; }
  .wn-head .section-kicker { margin: 0; }
  .wn-chips { display: inline-flex; flex-wrap: wrap; gap: 6px; }
  .wn-chips .chip { font-size: .68rem; padding: 2px 9px; }
  .wn-chip-lib { background: var(--green-050); color: var(--green-700); }
  .wn-card h4 { margin: 6px 0 0; font-size: 1.08rem; }
  .wn-card h4 .wn-anchor { color: inherit; text-decoration: none; }
  .wn-card h4 .wn-anchor:hover { color: var(--green-700); }
  .wn-card ul { margin: 8px 0 0; padding-left: 20px; font-size: .94rem; color: var(--ink-2); }
  .wn-card li + li { margin-top: 3px; }
  .wn-card p { margin: 8px 0 0; font-size: .94rem; color: var(--ink-2); }
  .wn-card code { font-size: .88em; }
  :root[data-theme="dark"] .wn-chip-lib { background: #0e3a2d; color: #7ee0bf; }
  @media print { .wn-month { display: block; } .wn-month > summary::before { content: ""; } }
</style>"""


def build_page(groups_html, n_entries, n_months, skipped, all_mode):
    skipped_note = ("" if all_mode else
                    f" Bookkeeping commits ({skipped} “Regenerate what's-new”) are left out;"
                    " <code>--all</code> includes them.")
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>What's new — Cato Use Case Library</title>
<meta name="description" content="Change history of the Cato SASE Use Case Library.">
<script>try{{var t=localStorage.getItem("uc-theme");if(!t&&window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches)t="dark";if(t)document.documentElement.setAttribute("data-theme",t)}}catch(e){{}}</script>
<link rel="stylesheet" href="assets/css/style.css">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='11' fill='none' stroke='%230e8a6d' stroke-width='7'/%3E%3C/svg%3E">{STYLE}
</head>
<body>
<nav class="topnav" aria-label="Primary">
  <div class="topnav-inner">
    <a class="brand" href="index.html">
      <svg class="logo-ring" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="11" fill="none" stroke="#12a380" stroke-width="7"/></svg>
      <span>Cato Networks<small>Use Case Library</small></span>
    </a>
    <span class="crumb">/ What's new</span>
    <span class="spacer"></span>
    <a class="nav-link" href="index.html">← All use cases</a>
  </div>
</nav>
<header class="hero">
  <div class="hero-inner">
    <h1>What's new</h1>
    <p class="lede">Every change to the library, newest first, grouped by month and week. Regenerated from the
    change history with <code>python3 _extract/whatsnew.py</code> after each update.</p>
  </div>
</header>
<main class="main">
  <p class="wn-intro">{n_entries} changes across {n_months} months. Chips show which categories a change touched;
  page names link to the use case. Open a month to see its weeks.{skipped_note}</p>{groups_html}
</main>
<footer class="footer">
  <div class="footer-inner">
    <span>Cato Networks — internal SE / partner enablement.</span>
    <span><a href="index.html">Use case library</a></span>
  </div>
</footer>
<script src="assets/js/app.js"></script>
</body>
</html>
'''


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--all", action="store_true", help="keep the 'Regenerate what's-new' bookkeeping commits")
    ap.add_argument("--out", default=str(ROOT / "whatsnew.html"), help="output path (default: whatsnew.html)")
    args = ap.parse_args()

    catalog = load_catalog()
    if not catalog:
        sys.exit("whatsnew.py: no ids found in assets/js/catalog.js")
    link, mentioned = make_linker(catalog)

    entries = read_log()
    kept = entries if args.all else [e for e in entries if not SKIP_SUBJECT.match(e["subject"])]
    skipped = len(entries) - len(kept)

    bad = [(e["sha"], t) for e in kept for _, t in e["bullets"] if t.endswith((",", "("))]
    for sha, t in bad:
        print(f"WARN {sha}: bullet still looks truncated: {t[-60:]!r}", file=sys.stderr)

    groups_html, n_months = render_groups(kept, link, mentioned, catalog)
    Path(args.out).write_text(build_page(groups_html, len(kept), n_months, skipped, args.all), encoding="utf-8")
    print(f"{Path(args.out).name} generated — {len(kept)} entries in {n_months} months ({skipped} bookkeeping commits skipped)")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
