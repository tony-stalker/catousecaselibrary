#!/usr/bin/env python3
"""extract-deck-diagrams.py — build assets/js/deck-diagrams.js from the live SVG DOM.

For every catalog id this opens the page over file://, picks THE diagram
(first .diagram-card svg outside any .phase-player, preferring section#solution;
pages that only have a phase player get their LAST phase activated and captured),
and walks the SVG in-page — same approach as svgShapes() in planner.js — into the
shared shape schema consumed by the deck generator:

  window.UC_DECK_DIAGRAMS = {
    logos:    { "<brand>": { png, w, h } },        // copied from PLANNER_LOGOS, referenced brands only
    diagrams: { "<catalog id>": { w, h, title, caption, desc, shapes: [...] } }
  }

Shape cls values come ONLY from the DG_FILL / DG_INK vocabularies in
planner-export.js (plus the dg-backbone ellipse); anything off-vocabulary is
mapped to the nearest vocabulary class by computed colour, or skipped when
purely decorative (.pulse-ring, defs/markers). Coordinates are viewBox units
read from attributes — never getBoundingClientRect.

IMPORTANT: RE-RUN after any usecases/*.html diagram is added or edited.
  python3 _extract/extract-deck-diagrams.py

Also idempotently ensures every page loads the generated file, inserted before
deck-export.js:  deck-brand → deck-content → deck-diagrams → deck-export.
Prints a per-id coverage report (captured shape counts / skip reasons).
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, "_extract")
sys.path.insert(0, str(ROOT / "_extract"))
from playwright.sync_api import sync_playwright  # noqa: E402
from chromium import launch                      # noqa: E402

BASE = ROOT.as_uri() + "/"
OUT = ROOT / "assets" / "js" / "deck-diagrams.js"


# ---------- inputs: catalog + logo registry ----------

def read_catalog():
    """[(id, file), ...] in catalog order."""
    src = (ROOT / "assets" / "js" / "catalog.js").read_text()
    return re.findall(r'id:\s*"([^"]+)",\s*(?:vertical:\s*"[^"]*",\s*)?file:\s*"([^"]+)"', src)


def read_logos():
    """{brand: {png, w, h}} from the PLANNER_LOGOS registry — never re-fetched."""
    src = (ROOT / "assets" / "js" / "planner-logos.js").read_text()
    logos = {}
    for m in re.finditer(r'"([a-z0-9-]+)":\s*\{\s*"png":\s*"([^"]+)",\s*"w":\s*(\d+),\s*"h":\s*(\d+)', src):
        logos[m.group(1)] = {"png": m.group(2), "w": int(m.group(3)), "h": int(m.group(4))}
    return logos


# ---------- in-page capture (evaluated against the live SVG DOM) ----------

CAPTURE_JS = r"""
(args) => {
  /* vocabulary — light-theme colours mirroring DG_FILL / DG_INK in planner-export.js */
  const FILL = {
    "dg-node": ["#ffffff", "#dde6e2"], "dg-node-dark": ["#0c2936", "#123849"],
    "dg-node-green": ["#e9f7f2", "#6cc9ae"],
    "pt-green": ["#e9f7f2", "#6cc9ae"], "pt-cloud": ["#eef8f4", "#0e8a6d"],
    "pt-navy": ["#0c2936", "#123849"], "pt-plain": ["#fbfdfc", "#b9c6c1"],
    "pt-amber": ["#fdf6e9", "#d99a2b"], "pt-purple": ["#f5f1fa", "#8661c5"],
    "pt-bluedash": ["#ffffff", "#2f6fb2"], "pt-chip": ["#ffffff", "#6cc9ae"],
    "pt-pop": [null, "#0e8a6d"]
  };
  const INK = {
    "dg-label": ["#0d1a16", 1, 14.5], "dg-sub": ["#45524d", 0, 12.5],
    "dg-tiny": ["#6f7d77", 0, 11], "dg-label-inv": ["#eaf6f1", 1, 14.5],
    "dg-sub-inv": ["#b9d2c9", 0, 12.5],
    "pt-t-green": ["#0b6e57", 1, 13.5], "pt-t-ink": ["#0d1a16", 1, 13.5],
    "pt-t-inv": ["#eaf6f1", 1, 13.5], "pt-t-amber": ["#9a6a12", 1, 13.5],
    "pt-t-purple": ["#5b3f94", 1, 13.5], "pt-t-blue": ["#2f6fb2", 1, 13.5],
    "pt-t-big": ["#0b6e57", 1, 16], "pt-sub": ["#45524d", 0, 11.5],
    "pt-sub-inv": ["#b9d2c9", 0, 11.5], "pt-chip-t": ["#0b6e57", 1, 10]
  };
  const approx = new Set();
  const R = v => Math.round(v * 10) / 10;

  function parseCol(s) {
    if (!s || s === "none" || s === "transparent") return null;
    const m = s.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?/);
    if (m) { if (m[4] !== undefined && parseFloat(m[4]) === 0) return null;
             return [+m[1], +m[2], +m[3]]; }
    const h = s.match(/^#([0-9a-f]{6})$/i);
    if (h) return [parseInt(h[1].slice(0,2),16), parseInt(h[1].slice(2,4),16), parseInt(h[1].slice(4,6),16)];
    return null;
  }
  const HEX = {};
  function hex(c) { return HEX[c] || (HEX[c] = parseCol(c) || parseCol(c)); }
  Object.values(FILL).forEach(v => { if (v[0]) v[0] = parseCol(v[0]); v[1] = parseCol(v[1]); });
  Object.values(INK).forEach(v => { v[0] = parseCol(v[0]); });
  const dist = (a, b) => !a || !b ? 1e6
    : (a[0]-b[0])*(a[0]-b[0]) + (a[1]-b[1])*(a[1]-b[1]) + (a[2]-b[2])*(a[2]-b[2]);
  const greenish = c => c && c[1] > c[0] + 20 && c[1] > c[2] + 10;
  const blueish  = c => c && c[2] > c[0] + 20 && c[2] > c[1] + 20;

  function firstVocab(el, vocab) {
    for (const t of (el.getAttribute("class") || "").split(/\s+/)) if (vocab[t]) return t;
    return null;
  }
  function mapFill(el) {
    const v = firstVocab(el, FILL);
    if (v) return v;
    const cls = el.getAttribute("class") || "";
    if (/\bdg-pop\b/.test(cls)) { approx.add("dg-pop→pt-pop"); return "pt-pop"; }
    const cs = getComputedStyle(el);
    const f = parseCol(cs.fill), s = parseCol(cs.stroke);
    let best, score = Infinity;
    if (!f) {                                      /* stroke-only shape */
      best = greenish(s) ? "pt-pop" : "dg-node";   /* grey containers read as plain nodes */
    } else {
      for (const [k, spec] of Object.entries(FILL)) {
        if (!spec[0]) continue;
        const d = dist(f, spec[0]) + (s ? dist(s, spec[1]) * 0.6 : 0);
        if (d < score) { score = d; best = k; }
      }
    }
    if (cls) approx.add(cls.trim().split(/\s+/)[0] + "→" + best);
    return best;
  }
  function mapInk(el) {
    const v = firstVocab(el, INK);
    if (v) return v;
    const cs = getComputedStyle(el);
    const c = parseCol(cs.fill), px = parseFloat(cs.fontSize) || 12.5;
    const bold = (parseInt(cs.fontWeight, 10) || 400) >= 600;
    let best = "dg-sub", score = Infinity;
    for (const [k, spec] of Object.entries(INK)) {
      const d = dist(c, spec[0]) + Math.abs(px - spec[2]) * 800 + (bold !== !!spec[1] ? 4000 : 0);
      if (d < score) { score = d; best = k; }
    }
    const cls = (el.getAttribute("class") || "").trim().split(/\s+/)[0];
    if (cls) approx.add(cls + "→" + best);
    return best;
  }
  function effOpacity(el, top) {
    let o = 1, p = el;
    while (p && p !== top.parentNode) {
      const v = parseFloat(getComputedStyle(p).opacity);
      if (!isNaN(v)) o *= v;
      p = p.parentNode instanceof Element ? p.parentNode : null;
    }
    return o;
  }
  function lineFlags(el) {
    const cs = getComputedStyle(el);
    const s = parseCol(cs.stroke);
    const out = {};
    if (greenish(s)) out.green = true;
    else if (blueish(s)) out.blue = true;
    else if (s && s[0] > 150 && s[1] > 100 && s[2] < 90) out.amber = true;   /* lane-limit #d98a00 */
    else if (s && s[0] > 150 && s[0] > s[1] + 60 && s[0] > s[2] + 60) out.red = true;  /* lane-block #d03b3b */
    if (cs.strokeDasharray && cs.strokeDasharray !== "none") out.dash = true;
    if (el.getAttribute("marker-end")) out.arrow = true;
    const sw = parseFloat(cs.strokeWidth);
    if (sw) out.sw = R(sw);
    return out;
  }
  function samplePoly(el, n) {
    let len;
    try { len = el.getTotalLength(); } catch (e) { return null; }
    if (!len) return null;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const p = el.getPointAtLength(len * i / (n - 1));
      pts.push([R(p.x), R(p.y)]);
    }
    return pts;
  }

  function capture(svg) {
    const vb = (svg.getAttribute("viewBox") || "0 0 800 400").trim().split(/[\s,]+/);
    const d = { w: parseFloat(vb[2]) || 800, h: parseFloat(vb[3]) || 400,
                title: "", caption: "", desc: "", shapes: [] };
    /* title / caption / desc per the contract */
    const tEl = svg.querySelector(":scope > title");
    if (tEl && tEl.textContent.trim()) d.title = tEl.textContent.trim();
    else {
      const sec = svg.closest("section");
      const h = sec && sec.querySelector("h2, h3");
      d.title = h ? h.textContent.trim() : "How it fits together";
    }
    const dEl = svg.querySelector(":scope > desc");
    d.desc = dEl ? dEl.textContent.trim() : (svg.getAttribute("aria-label") || "").trim();
    const card = svg.closest(".diagram-card");
    const capEl = card && card.querySelector(".diagram-caption");
    if (capEl) d.caption = capEl.textContent.trim();
    else {
      const fig = svg.closest("figure.phase");
      const fc = fig && fig.querySelector("figcaption");
      d.caption = fc ? fc.textContent.trim() : "";
    }

    svg.querySelectorAll("*").forEach(el => {
      const tag = el.tagName.toLowerCase();
      if (tag === "title" || tag === "desc" || tag === "g" || tag === "tspan"
          || tag === "defs" || tag === "marker" || tag === "style") return;
      if (el.closest("defs, marker")) return;
      const cls = el.getAttribute("class") || "";
      const op = effOpacity(el, svg);
      if (op <= 0.05) return;
      const faded = op < 0.92;
      const laneCls = /\blane\b|\blane-[a-z]+\b/.test(cls);

      if (tag === "rect") {
        const sh = { t: "rect", x: R(+el.getAttribute("x") || 0), y: R(+el.getAttribute("y") || 0),
                     w: R(+el.getAttribute("width") || 0), h: R(+el.getAttribute("height") || 0),
                     cls: mapFill(el) };
        if (faded) sh.faded = true;
        d.shapes.push(sh);
      } else if (tag === "circle") {
        if (/\bpulse-ring\b/.test(cls)) return;    /* decorative CSS animation — skip */
        const sh = { t: "circle", cx: R(+el.getAttribute("cx") || 0), cy: R(+el.getAttribute("cy") || 0),
                     r: R(+el.getAttribute("r") || 0), cls: mapFill(el) };
        if (faded) sh.faded = true;
        d.shapes.push(sh);
      } else if (tag === "ellipse") {
        if (laneCls) {                              /* an ellipse drawn as a flow lane */
          const pts = samplePoly(el, 8);
          if (!pts) return;
          const sh = Object.assign({ t: "poly", pts }, lineFlags(el));
          if (faded) sh.faded = true;
          d.shapes.push(sh);
          return;
        }
        const sh = { t: "ellipse", cx: R(+el.getAttribute("cx") || 0), cy: R(+el.getAttribute("cy") || 0),
                     rx: R(+el.getAttribute("rx") || 0), ry: R(+el.getAttribute("ry") || 0),
                     cls: /\bdg-backbone\b/.test(cls) ? "dg-backbone" : mapFill(el) };
        if (faded) sh.faded = true;
        d.shapes.push(sh);
      } else if (tag === "line") {
        const sh = Object.assign({ t: "line",
          x1: R(+el.getAttribute("x1") || 0), y1: R(+el.getAttribute("y1") || 0),
          x2: R(+el.getAttribute("x2") || 0), y2: R(+el.getAttribute("y2") || 0) }, lineFlags(el));
        if (faded) sh.faded = true;
        d.shapes.push(sh);
      } else if (tag === "path") {
        const cs = getComputedStyle(el);
        const fill = parseCol(cs.fill);
        const stroke = parseCol(cs.stroke);
        /* A path with no fill anywhere in the cascade computes to the SVG default
           (pure black). Nothing in the vocabulary fills pure black, so a stroked
           path whose fill is only that default is really a stroked line, not a
           filled outline (e.g. an inline stroke="var(--hairline)" axis). */
        const defaultBlackFill = fill && !fill[0] && !fill[1] && !fill[2]
          && !el.getAttribute("fill") && !el.style.fill;
        const emitPoly = (n) => {                   /* stroked flow lane → sampled poly */
          if (!stroke) return;                      /* invisible — skip */
          const pts = samplePoly(el, n);
          if (!pts) return;
          const sh = Object.assign({ t: "poly", pts }, lineFlags(el));
          if (faded) sh.faded = true;
          d.shapes.push(sh);
        };
        if (!fill || laneCls || (defaultBlackFill && stroke)) {
          emitPoly(6);
        } else {                                    /* filled outline (cloud) → bbox rect */
          let bb;
          try { bb = el.getBBox(); } catch (e) { return; }
          if (bb.width < 1 || bb.height < 1) {      /* degenerate outline — a line really */
            emitPoly(2);
            return;
          }
          const sh = { t: "rect", x: R(bb.x), y: R(bb.y), w: R(bb.width), h: R(bb.height),
                       cls: mapFill(el) };
          if (faded) sh.faded = true;
          d.shapes.push(sh);
          approx.add((cls.trim().split(/\s+/)[0] || "path") + "→bbox rect");
        }
      } else if (tag === "image") {
        let brand = el.getAttribute("data-brand");
        if (!brand) {
          const href = el.getAttribute("href") || el.getAttribute("xlink:href") || "";
          const m = href.match(/logo-([a-z0-9-]+)\.(?:png|svg)$/);
          if (m) brand = m[1];
        }
        if (!brand || args.logoBrands.indexOf(brand) < 0) return;  /* no registry art — skip */
        const sh = { t: "img", x: R(+el.getAttribute("x") || 0), y: R(+el.getAttribute("y") || 0),
                     w: R(+el.getAttribute("width") || 0), h: R(+el.getAttribute("height") || 0),
                     brand };
        if (faded) sh.faded = true;
        d.shapes.push(sh);
      } else if (tag === "text") {
        const cls2 = mapInk(el);
        const anchor = el.getAttribute("text-anchor")
          || (getComputedStyle(el).textAnchor !== "start" ? getComputedStyle(el).textAnchor : "");
        const tspans = Array.from(el.querySelectorAll("tspan")).filter(ts => ts.getAttribute("x") !== null);
        const emit = (x, y, text) => {
          if (!text.trim()) return;
          const sh = { t: "text", x: R(x), y: R(y), text: text.trim().replace(/\s+/g, " "), cls: cls2 };
          if (anchor === "middle") sh.anchor = "middle";
          if (faded) sh.faded = true;
          d.shapes.push(sh);
        };
        if (tspans.length) tspans.forEach(ts =>
          emit(+ts.getAttribute("x") || +el.getAttribute("x") || 0,
               +ts.getAttribute("y") || +el.getAttribute("y") || 0, ts.textContent));
        else emit(+el.getAttribute("x") || 0, +el.getAttribute("y") || 0, el.textContent);
      }
    });
    return d;
  }

  /* pick THE diagram */
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
  let svg = null;
  if (args.mode === "phase") {
    svg = document.querySelector(".phase-player .phase.active svg");
    if (!svg) return { ok: false, reason: "phase player present but no active phase svg" };
  } else {
    const cands = Array.from(document.querySelectorAll(".diagram-card svg"))
      .filter(s => !s.closest(".phase-player"));
    const sol = cands.filter(s => s.closest("section#solution"));
    svg = sol[0] || cands[0];
    if (!svg) return { ok: false, reason: "no .diagram-card svg outside a phase player" };
  }
  const diagram = capture(svg);
  if (!diagram.shapes.length) return { ok: false, reason: "diagram svg captured 0 shapes" };
  return { ok: true, diagram, approx: Array.from(approx) };
}
"""

HAS_STATIC_JS = """() => Array.from(document.querySelectorAll('.diagram-card svg'))
  .some(s => !s.closest('.phase-player'))"""


def extract_all(catalog, logo_brands):
    diagrams, skipped, approx_by_page = {}, {}, {}
    with sync_playwright() as p:
        b = launch(p)
        pg = b.new_page(viewport={"width": 1440, "height": 1000})
        for uid, relfile in catalog:
            path = ROOT / relfile
            if not path.exists():
                skipped[uid] = "page file missing: " + relfile
                continue
            pg.goto(BASE + relfile)
            pg.wait_for_timeout(350)
            mode = "static"
            if not pg.evaluate(HAS_STATIC_JS):
                if pg.query_selector(".phase-player"):
                    dots = pg.query_selector_all(".phase-player .phase-dot")
                    if dots:
                        dots[-1].click()            # last phase = the end-state picture
                        pg.wait_for_timeout(650)    # let the opacity transition settle
                    mode = "phase"
                else:
                    skipped[uid] = "no .diagram-card svg and no phase player"
                    continue
            res = pg.evaluate(CAPTURE_JS, {"mode": mode, "logoBrands": logo_brands})
            if not res.get("ok"):
                skipped[uid] = res.get("reason", "capture failed")
                continue
            diagrams[uid] = res["diagram"]
            if res.get("approx"):
                approx_by_page[uid] = sorted(res["approx"])
        b.close()
    return diagrams, skipped, approx_by_page


# ---------- output ----------

HEADER = """\
/* Cato Use Case Library — per-page diagram models for the deck generator (internal).
   GENERATED by _extract/extract-deck-diagrams.py — do not edit by hand.
   Regenerate after editing any usecases/*.html diagram:
     python3 _extract/extract-deck-diagrams.py
   Captured from the live SVG DOM of each page (viewBox units); cls values come from
   the DG_FILL/DG_INK vocabularies in planner-export.js; logos are copied from
   PLANNER_LOGOS (planner-logos.js), referenced brands only. */
"""


def write_output(diagrams, logos_all):
    referenced = []
    for d in diagrams.values():
        for sh in d["shapes"]:
            if sh["t"] == "img" and sh["brand"] in logos_all and sh["brand"] not in referenced:
                referenced.append(sh["brand"])
    logos = {b: logos_all[b] for b in sorted(referenced)}
    payload = {"logos": logos, "diagrams": diagrams}
    js = HEADER + "window.UC_DECK_DIAGRAMS = " \
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n"
    OUT.write_text(js)
    return len(referenced)


# ---------- script tags: deck-brand → deck-content → deck-diagrams → deck-export ----------

def ensure_script_tags(catalog):
    pages = [ROOT / "index.html"] + [ROOT / f for _, f in catalog]
    changed = 0
    for page in pages:
        if not page.exists():
            continue
        text = page.read_text()
        prefix = "../" if page.parent.name == "usecases" else ""
        tag = '<script src="%sassets/js/deck-diagrams.js"></script>' % prefix
        if tag in text:
            continue
        anchor = '<script src="%sassets/js/deck-export.js"></script>' % prefix
        if anchor not in text:
            print("  WARN %s: no deck-export.js tag; deck-diagrams not inserted" % page.name)
            continue
        text = text.replace(anchor, tag + "\n" + anchor, 1)
        page.write_text(text)
        changed += 1
    return changed


def main():
    catalog = read_catalog()
    logos_all = read_logos()
    print("catalog ids: %d · registry brands: %d" % (len(catalog), len(logos_all)))
    diagrams, skipped, approx = extract_all(catalog, sorted(logos_all))

    n_brands = write_output(diagrams, logos_all)
    changed = ensure_script_tags(catalog)

    print("\n---- coverage ----")
    for uid, _ in catalog:
        if uid in diagrams:
            print("  %-38s captured (%d shapes)" % (uid, len(diagrams[uid]["shapes"])))
        else:
            print("  %-38s SKIPPED — %s" % (uid, skipped.get(uid, "unknown")))
    print("\ncaptured %d / %d · skipped %d · logos embedded %d · script tags added %d"
          % (len(diagrams), len(catalog), len(skipped), n_brands, changed))
    if approx:
        print("\n---- vocabulary approximations ----")
        for uid in sorted(approx):
            print("  %-38s %s" % (uid, " · ".join(approx[uid])))
    print("\nwrote %s (%.1f KB)" % (OUT.relative_to(ROOT), OUT.stat().st_size / 1024))


if __name__ == "__main__":
    main()
