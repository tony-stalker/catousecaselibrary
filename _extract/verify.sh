#!/bin/bash
# verify.sh — one-command health check for the Cato Use Case Library.
# Usage: bash _extract/verify.sh          (from the library root)
# Runs: link check, catalog consistency, identifying-reference sweep,
#       CDN-load check, SVG text measurement, console-error render, mobile fit,
#       search-index freshness.
set -u
cd "$(dirname "$0")/.." || exit 1
FAIL=0

echo "== 1/7 link check"
python3 _extract/checklinks.py index.html usecases/*.html || FAIL=1

echo "== 2/7 catalog consistency + hygiene"
python3 - <<'EOF' || FAIL=1
import re, subprocess, sys
from pathlib import Path
src = Path("assets/js/catalog.js").read_text()
ids = re.findall(r'id: "([^"]+)"', src)
files = re.findall(r'file: "([^"]+)"', src)
decks = re.findall(r'deck: "([^"]+)"', src)
pages = sorted(Path("usecases").glob("*.html"))
errs = [f"missing page: {f}" for f in files if not Path(f).exists()]
errs += [f"missing deck: {d}" for d in decks if not Path(d).exists()]
errs += [f"not in catalog: {p.name}" for p in pages if p.name not in {Path(f).name for f in files}]
errs += [f"dup id: {i}" for i in ids if ids.count(i) > 1]
for p in pages:
    m = re.search(r'<body[^>]*data-uc="([^"]+)"', p.read_text())
    if not m or m.group(1) != p.stem: errs.append(f"{p.name}: data-uc mismatch")
r = subprocess.run(["grep","-rln","-i","-E","mourant|swissport|fannie|3489|tony-","usecases/","index.html","assets/js/"], capture_output=True, text=True)
errs += [f"identifying ref in: {l}" for l in r.stdout.splitlines()]
print(f"{len(ids)} catalog entries / {len(pages)} pages / {len(decks)} deck links")
if errs:
    print("\n".join(errs)); sys.exit(1)
print("OK")
EOF

echo "== 3/7 external resource loads (CDN) + theme snippet"
if grep -rn -E 'src="http|link[^>]*href="http|@import|url\(http' index.html usecases/*.html assets/css/style.css; then
  echo "FAIL: external resource loads found"; FAIL=1
else
  echo "OK — file:// safe"
fi
# every page must carry the dark-mode bootstrap snippet (pages authored in
# parallel with the snippet sweep have missed it — migration-journey-vpn, Jul 2026)
SNIPMISS=0
for f in index.html whatsnew.html usecases/*.html; do
  grep -q 'uc-theme' "$f" || { echo "FAIL: theme snippet missing in $f"; SNIPMISS=1; }
done
[ "$SNIPMISS" = 0 ] && echo "OK — theme snippet on all pages" || FAIL=1

echo "== 4/7 SVG text measurement (must be silent — any output is a regression)"
python3 _extract/measure_svg.py || FAIL=1

echo "== 5/7 render + console errors (index)"
python3 _extract/shoot.py index.html /tmp/verify-index.png | tail -1 | grep -q "no console errors" && echo "OK" || { echo "FAIL: console errors"; FAIL=1; }

echo "== 6/7 mobile fit (390px, all pages)"
python3 - <<'EOF' || FAIL=1
from playwright.sync_api import sync_playwright
import pathlib, sys
EXE = "/Users/tonystalker/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell"
BASE = "file://" + str(pathlib.Path.cwd()) + "/"
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=EXE)
    pg = b.new_page(viewport={"width": 390, "height": 844})
    bad = []
    for page in ["index.html"] + ["usecases/" + f.name for f in sorted(pathlib.Path("usecases").glob("*.html"))]:
        pg.goto(BASE + page); pg.wait_for_timeout(200)
        pg.evaluate("document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'))")
        if pg.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 1"):
            bad.append(page)
    b.close()
if bad:
    print("overflow:", bad); sys.exit(1)
print("OK — all pages fit")
EOF

echo "== 7/7 search index freshness (full-text search)"
python3 _extract/build-search.py --check || FAIL=1

if [ "${1:-}" = "--external" ]; then
  echo "== 8/8 external links (optional, network-dependent)"
  python3 _extract/checkexternal.py || FAIL=1
fi

echo
if [ "$FAIL" -eq 0 ]; then echo "VERIFY: ALL CHECKS PASSED"; else echo "VERIFY: FAILURES FOUND (see above)"; exit 1; fi
