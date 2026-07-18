#!/usr/bin/env python3
"""Check that all local href/src references in given HTML files resolve on disk.
Usage: checklinks.py <file.html> [...]   (paths relative to repo root or absolute)"""
import re, sys
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path("/Users/tonystalker/Documents/claude/usecaselibrary")
problems = 0
for arg in sys.argv[1:]:
    f = Path(arg) if arg.startswith("/") else ROOT / arg
    if not f.exists():
        print(f"MISSING FILE: {f}")
        problems += 1
        continue
    html = f.read_text(encoding="utf-8", errors="replace")
    refs = re.findall(r'(?:href|src)="([^"]+)"', html)
    for r in refs:
        if r.startswith(("http://", "https://", "mailto:", "javascript:", "data:", "#")):
            continue
        path = unquote(urlparse(r).path)
        target = (f.parent / path).resolve()
        if not target.exists():
            print(f"{f.name}: BROKEN -> {r}")
            problems += 1
print("OK — all local references resolve" if problems == 0 else f"{problems} problem(s)")
sys.exit(1 if problems else 0)
