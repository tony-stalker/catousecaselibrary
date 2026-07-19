#!/usr/bin/env python3
"""Check every external URL referenced by the library.
Usage: python3 _extract/checkexternal.py    (from the library root)

Classifies each unique http(s) URL found in index.html, whatsnew.html and usecases/*.html:
  OK      — 2xx/3xx
  BLOCKED — 401/403/405/406/429 (bot-blocked; almost always fine in a real browser)
  DEAD    — 404/410, 5xx, DNS/connection failures, timeouts  → exit 1
"""
import re
import ssl
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")
CTX = ssl.create_default_context()

urls = {}
pages = [ROOT / "index.html"] + sorted((ROOT / "usecases").glob("*.html"))
wn = ROOT / "whatsnew.html"
if wn.exists():
    pages.append(wn)
for p in pages:
    for u in re.findall(r'href="(https?://[^"]+)"', p.read_text()):
        urls.setdefault(u, set()).add(p.name)

def probe(url):
    # curl uses the macOS system keychain, which trusts the Cato TLS-inspection root CA
    # (python's own trust store does not -> false CERTIFICATE_VERIFY_FAILED verdicts).
    import subprocess
    for extra in (["-I"], []):  # HEAD first, then GET for HEAD-hostile servers
        try:
            r = subprocess.run(
                ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-L",
                 "--max-time", "20", "-A", UA, *extra, url],
                capture_output=True, text=True, timeout=30)
            code = int(r.stdout.strip() or 0)
        except Exception:
            code = 0
        if extra and code in (0, 403, 405, 406):
            continue
        return code
    return code

results = {}
with ThreadPoolExecutor(max_workers=12) as ex:
    for url, status in zip(urls, ex.map(probe, urls)):
        results[url] = status

BOT_WALLED = ("hpe.com", "arubanetworking.hpe.com")  # reject all non-browser clients outright

ok, blocked, dead = [], [], []
for url, status in sorted(results.items()):
    if 200 <= status < 400:
        ok.append(url)
    elif status in (401, 403, 405, 406, 429) or any(d in url for d in BOT_WALLED):
        blocked.append(url)
    else:
        dead.append((url, status))

print(f"{len(urls)} unique external URLs across {len(pages)} pages")
print(f"  OK: {len(ok)}   BLOCKED (bot-gated, verify manually once): {len(blocked)}   DEAD: {len(dead)}")
if blocked:
    print("\nBLOCKED (fine in a browser, listed for awareness):")
    for u in blocked:
        print(f"  [{results[u]}] {u}")
if dead:
    print("\nDEAD (fix these):")
    for u, st in dead:
        print(f"  [{st or 'ERR'}] {u}  — used in: {', '.join(sorted(urls[u]))}")
    sys.exit(1)
print("\nno dead links")
