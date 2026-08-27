#!/usr/bin/env python3
"""Report SVG diagram texts that escape the viewBox or overflow their enclosing rect (user units)."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from chromium import launch

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT.as_uri() + "/"

JS = """
(() => {
  const out = [];
  document.querySelectorAll('.diagram-card svg').forEach(svg => {
    const vb = svg.viewBox.baseVal;
    const rects = [...svg.querySelectorAll('rect')].map(r => ({
      x: r.x.baseVal.value, y: r.y.baseVal.value,
      w: r.width.baseVal.value, h: r.height.baseVal.value
    }));
    svg.querySelectorAll('text').forEach(t => {
      const b = t.getBBox();
      const s = (t.textContent || '').trim().slice(0, 45);
      if (b.x < vb.x - 0.5) out.push(`EDGE-L  x=${b.x.toFixed(0)} "${s}"`);
      if (b.x + b.width > vb.x + vb.width + 0.5) out.push(`EDGE-R  x2=${(b.x+b.width).toFixed(0)}/${vb.width} "${s}"`);
      // anchor point inside a rect and vertically within it -> text should fit that rect
      const ax = t.x.baseVal.length ? t.x.baseVal.getItem(0).value : b.x;
      const cy = b.y + b.height / 2;
      for (const r of rects) {
        if (r.w > 250) continue; // band/container rects are not node boxes
        if (ax >= r.x && ax <= r.x + r.w && cy >= r.y && cy <= r.y + r.h) {
          const over = Math.max(r.x - b.x, (b.x + b.width) - (r.x + r.w));
          if (over > 1) out.push(`BOX+${over.toFixed(0)}px rect@${r.x.toFixed(0)},${r.y.toFixed(0)} "${s}"`);
          break;
        }
      }
    });
  });
  return out;
})()
"""

with sync_playwright() as p:
    b = launch(p)
    pg = b.new_page(viewport={"width": 1440, "height": 1000})
    for f in sorted((ROOT / "usecases").glob("*.html")):
        pg.goto(BASE + "usecases/" + f.name)
        pg.wait_for_timeout(300)
        issues = pg.evaluate(JS)
        if issues:
            print(f.name)
            for i in issues:
                print("   ", i)
    b.close()
print("done")
