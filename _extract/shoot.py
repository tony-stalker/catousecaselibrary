#!/usr/bin/env python3
"""Screenshot library pages with the cached Chromium. Usage: shoot.py <page.html> <out.png> [...]"""
import sys
from playwright.sync_api import sync_playwright

EXE = "/Users/tonystalker/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell"
BASE = "file:///Users/tonystalker/Documents/claude/usecaselibrary/"

pairs = list(zip(sys.argv[1::2], sys.argv[2::2]))
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=EXE)
    pg = b.new_page(viewport={"width": 1440, "height": 1000})
    errors = []
    pg.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    pg.on("pageerror", lambda e: errors.append(str(e)))
    for page, out in pairs:
        pg.goto(BASE + page)
        pg.wait_for_timeout(500)
        # force reveal-on-scroll elements visible (screenshots don't scroll like users)
        pg.evaluate("document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'))")
        pg.wait_for_timeout(700)
        pg.screenshot(path=out, full_page=True)
        print(f"shot {page} -> {out}")
    b.close()
    if errors:
        print("JS/console errors:")
        for e in errors:
            print("  ", e)
    else:
        print("no console errors")
