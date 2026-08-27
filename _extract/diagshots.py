#!/usr/bin/env python3
"""Element-screenshot every .diagram-card on every page, and test the lightbox zoom.
Outputs to _extract/vdiag/<page>-d<i>.png plus lightbox-test.png."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
from chromium import launch

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT.as_uri() + "/"
OUT = ROOT / "_extract" / "vdiag"
OUT.mkdir(exist_ok=True)

pages = sorted(p.name for p in (ROOT / "usecases").glob("*.html"))
errors = []
with sync_playwright() as p:
    b = launch(p)
    pg = b.new_page(viewport={"width": 1440, "height": 1000})
    pg.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    pg.on("pageerror", lambda e: errors.append(str(e)))
    for page in pages:
        pg.goto(BASE + "usecases/" + page)
        pg.wait_for_timeout(400)
        pg.evaluate("document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'))")
        cards = pg.query_selector_all(".diagram-card")
        for i, c in enumerate(cards):
            c.scroll_into_view_if_needed()
            pg.wait_for_timeout(150)
            c.screenshot(path=str(OUT / f"{page.replace('.html','')}-d{i}.png"))
        print(f"{page}: {len(cards)} diagram(s)")
    # lightbox test: click first diagram on network-sdwan, shot the open lightbox
    pg.goto(BASE + "usecases/network-sdwan.html")
    pg.wait_for_timeout(400)
    d = pg.query_selector(".diagram-card.zoomable")
    if d:
        d.click()
        pg.wait_for_timeout(400)
        lb = pg.query_selector(".lightbox.open")
        if lb:
            pg.screenshot(path=str(OUT / "lightbox-test.png"))
            print("lightbox opens: YES")
            pg.keyboard.press("Escape")
            pg.wait_for_timeout(200)
            print("lightbox closes on Esc:", "YES" if not pg.query_selector(".lightbox.open") else "NO")
        else:
            print("lightbox opens: NO — .lightbox.open not found after click")
    else:
        print("no .diagram-card.zoomable found — JS hook not applied?")
    b.close()
print("console errors:" if errors else "no console errors")
for e in errors:
    print("  ", e)
