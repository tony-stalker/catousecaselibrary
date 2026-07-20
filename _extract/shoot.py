#!/usr/bin/env python3
"""Screenshot library pages with the cached Chromium. Usage: shoot.py [--dark] <page.html> <out.png> [...]"""
import sys
from playwright.sync_api import sync_playwright

EXE = "/Users/tonystalker/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell"
BASE = "file:///Users/tonystalker/Documents/claude/usecaselibrary/"

args = [a for a in sys.argv[1:] if a != "--dark"]
dark = "--dark" in sys.argv[1:]
pairs = list(zip(args[0::2], args[1::2]))
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=EXE)
    pg = b.new_page(viewport={"width": 1440, "height": 1000})
    if dark:
        # set the saved theme before any page script runs; head snippet picks it up
        pg.add_init_script('try{localStorage.setItem("uc-theme","dark")}catch(e){}')
        pg.emulate_media(color_scheme="dark")
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
