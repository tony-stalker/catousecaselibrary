#!/usr/bin/env python3
"""Generate whatsnew.html from the git history.
Usage: python3 _extract/whatsnew.py     (from the library root; run after committing)"""
import html
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SEP = "\x1e"
log = subprocess.run(
    ["git", "-C", str(ROOT), "log", f"--pretty=format:%ad{SEP}%s{SEP}%b{SEP}{{END}}", "--date=format:%d %B %Y"],
    capture_output=True, text=True, check=True).stdout

entries = []
for chunk in log.split("{END}"):
    chunk = chunk.strip()
    if not chunk:
        continue
    date, subject, body = (chunk.split(SEP) + ["", ""])[:3]
    bullets = [l.strip("- ").strip() for l in body.splitlines()
               if l.strip().startswith("-")]
    if not bullets:
        bullets = [l.strip() for l in body.splitlines()
                   if l.strip() and "Co-Authored-By" not in l and "Claude-Session" not in l]
    entries.append((date.strip(), subject.strip(), bullets))

cards = ""
for date, subject, bullets in entries:
    lis = "".join(f"<li>{html.escape(b)}</li>" for b in bullets)
    body_html = f'<ul style="margin:6px 0 0;padding-left:20px;font-size:.94rem;color:var(--ink-2)">{lis}</ul>' if lis else ""
    cards += f'''
    <div class="card" style="margin-bottom:16px">
      <div class="section-kicker">{html.escape(date)}</div>
      <h3 style="margin:4px 0 0">{html.escape(subject)}</h3>
      {body_html}
    </div>'''

page = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>What's new — Cato Use Case Library</title>
<meta name="description" content="Change history of the Cato SASE Use Case Library.">
<script>try{{var t=localStorage.getItem("uc-theme");if(!t&&window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches)t="dark";if(t)document.documentElement.setAttribute("data-theme",t)}}catch(e){{}}</script>
<link rel="stylesheet" href="assets/css/style.css">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='11' fill='none' stroke='%230e8a6d' stroke-width='7'/%3E%3C/svg%3E">
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
    <p class="lede">Every change to the library, newest first. Regenerated from the change history
    with <code>python3 _extract/whatsnew.py</code> after each update.</p>
  </div>
</header>
<main class="main">{cards}
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
(ROOT / "whatsnew.html").write_text(page)
print(f"whatsnew.html generated — {len(entries)} entries")
