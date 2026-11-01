#!/usr/bin/env python3
"""build-diagrams.py — render the library's diagrams with the platform-overview diagram kit.

Every page's diagrams are declared in _extract/diagram-kit/specs/<page-id>.js (authoring guide:
_extract/diagram-kit/README.md). This script loads the kit host headless, renders each spec and
writes STATIC, self-contained SVG into the page — no runtime JS, file:// safe, light and dark
themed through x- prefixed classes in style.css.

  python3 _extract/build-diagrams.py                 # all specs: CSS block, sprite, pages, deck pictures
  python3 _extract/build-diagrams.py ID [ID ...]     # just these pages (CSS block always refreshed)
  python3 _extract/build-diagrams.py --preview DIR ID   # render ID to DIR/<id>-<slot>-{light,dark}.png; no page writes
  python3 _extract/build-diagrams.py --check         # verify.sh: no warnings, pages + CSS up to date (exit 1 otherwise)
  python3 _extract/build-diagrams.py --no-pics       # skip deck pictures (faster while authoring)
  python3 _extract/build-diagrams.py --catalogue DIR # every source figure as exported, light theme, to DIR/<fig>.png

What it writes (all between markers, so re-runs are idempotent):
  assets/css/style.css            /* ==== dg-kit:start ==== */ … /* ==== dg-kit:end ==== */
  usecases/<id>.html              <!-- dg:sprite --> after <body>, <!-- dg:spotlight --> section,
                                  <!-- dg:<slot> --> around each replaced <svg>, legend + caption
  assets/js/deck-pics/<id>.js     the page's main diagram as a 2x PNG (loaded on demand by deck-export.js)
  assets/js/deck-diagrams.js      manifest {diagrams: {id: {w, h, title, caption, desc}}} read by deck-export.js
Warnings (label overflow, labels past the viewBox edge, text edits that matched nothing) fail --check.
Prerequisite: _extract/diagram-kit/kit-host.html (python3 _extract/diagram-kit/make-kit-host.py <overview.html>).
"""
import argparse
import base64
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
KIT = ROOT / "_extract" / "diagram-kit"
SPECS = KIT / "specs"
CSS = ROOT / "assets" / "css" / "style.css"
PICS = ROOT / "assets" / "js" / "deck-pics"
MANIFEST = ROOT / "assets" / "js" / "deck-diagrams.js"
sys.path.insert(0, str(ROOT / "_extract"))
from chromium import launch  # noqa: E402

CSS_START, CSS_END = "/* ==== dg-kit:start ==== */", "/* ==== dg-kit:end ==== */"
SPOT_VB = "0 116 1600 784"      # the overview without its title/stat header

REGISTRY = """window.DG = { pages: {}, errors: [], page(id, cfg) { this.pages[id] = cfg; } };
window.addEventListener('error', e => DG.errors.push(String(e.message)));"""

RENDER = r"""async ([id, wantSpot]) => {
  const cfg = DG.pages[id]; const out = { spot: null, diagrams: [], warnings: [] };
  const host = () => { const h = document.createElement('div'); h.style.cssText = 'position:absolute;left:0;top:0;width:1600px'; document.body.appendChild(h); return h; };
  const edit = (svg, edits, drop) => {
    const leaves = [...svg.querySelectorAll('text, tspan, textPath')].filter(t => !t.querySelector('tspan, textPath'));
    (edits || []).forEach(([a, b]) => { let n = 0; leaves.forEach(t => { if (t.textContent === a) { t.textContent = b; n++; } });
      if (!n) out.warnings.push(id + ': edit matched nothing: "' + a + '"'); });
    (drop || []).forEach(a => { let n = 0; leaves.forEach(t => { if (t.textContent === a) { (t.closest('text') || t).remove(); n++; } });
      if (!n) out.warnings.push(id + ': drop matched nothing: "' + a + '"'); });
  };
  if (wantSpot && cfg.spotlight) {
    const s = cfg.spotlight, h = host(), sv = __KIT.spotlight(s, h);
    sv.setAttribute('viewBox', s.vb || '__SPOT_VB__'); edit(sv, s.edits, s.drop);
    const r = __EXPORT(sv, 'dgs', s.title || 'Where this sits in the Cato SASE platform', s.desc || '');
    r.warnings.forEach(w => out.warnings.push(id + ' spotlight: ' + w)); out.spot = r.svg; h.remove();
  }
  (cfg.diagrams || []).forEach((d, i) => {
    const h = host(); let sv;
    try { sv = __KIT.mountSpec(d.fig || d.draw, h, d.vb || (d.fig && __KIT.FIG_VB[d.fig]) || '0 0 760 560', d.title || ''); }
    catch (e) { out.warnings.push(id + ' ' + (d.slot || 'main') + ': render failed: ' + e.message); h.remove(); return; }
    /* figure states: one view of a multi-view figure, the detailed layer, the failed-over state */
    const views = [...new Set([...sv.querySelectorAll('[data-vw]')].flatMap(g => g.dataset.vw.split(' ')))];
    if (views.length) { const v = d.view || ({ dc: 'socket', ai: 'all', msvc: 'all' })[d.fig] || views[0];
      if (!views.includes(v)) out.warnings.push(id + ' ' + (d.slot || 'main') + ': unknown view "' + v + '" (has: ' + views.join(', ') + ')');
      sv.querySelectorAll('[data-vw]').forEach(g => { g.style.display = g.dataset.vw.split(' ').includes(v) ? '' : 'none'; }); }
    if (d.detailed) sv.classList.add('detailed');
    if (d.failed) sv.classList.add('fig-fail');
    edit(sv, d.edits, d.drop);
    const r = __EXPORT(sv, 'dg' + (i + 1), d.title || '', d.desc || '');
    r.warnings.forEach(w => out.warnings.push(id + ' ' + (d.slot || 'main') + ': ' + w));
    out.diagrams.push({ slot: d.slot || 'main', svg: r.svg, title: d.title || '', desc: d.desc || '', caption: d.caption || null,
      legend: d.legend === undefined ? null : d.legend, pic: d.pic !== false && (d.slot || 'main') === (cfg.picSlot || 'main') });
    h.remove();
  });
  return out;
}""".replace("__SPOT_VB__", SPOT_VB)

SPRITE = r"""() => { const s = document.querySelector('svg[aria-hidden=true][style*="position:absolute"]').cloneNode(true);
  s.querySelectorAll('[id]').forEach(e => e.id = 'x-' + e.id);
  s.querySelectorAll('*').forEach(e => { const c = e.getAttribute('class'); if (c) e.setAttribute('class', c.split(/\s+/).filter(Boolean).map(k => 'x-' + k).join(' '));
    for (const a of [...e.attributes]) { if (/url\(#/.test(a.value)) e.setAttribute(a.name, a.value.replace(/url\(#([\w-]+)\)/g, 'url(#x-$1)'));
      if (/var\(--/.test(a.value)) e.setAttribute(a.name, a.value.replace(/var\(--(?!x-)([\w-]+)/g, 'var(--x-$1')); }
    const h = e.getAttribute('href'); if (h && h.startsWith('#')) e.setAttribute('href', '#x-' + h.slice(1)); });
  s.removeAttribute('style'); s.setAttribute('class', 'x-sprite'); s.setAttribute('width', '0'); s.setAttribute('height', '0');
  return s.outerHTML.replace(/>\s+</g, '><'); }"""

LEGEND_KINDS = {  # kind -> (svg swatch body, default label)
    "tun": ('<path d="M2 5H30" class="x-fl x-fl-tun"/>', "Encrypted tunnel"),
    "ipsec": ('<path d="M2 5H30" class="x-fl x-fl-ipsec"/>', "IPsec"),
    "priv": ('<path d="M2 5H30" class="x-fl x-fl-priv"/>', "Private link"),
    "https": ('<path d="M2 5H30" class="x-fl x-fl-https"/>', "Browser / agent (HTTPS)"),
    "flow": ('<path d="M2 5H30" class="x-fl x-fl-flow"/>', "Traffic flow"),
    "hot": ('<path d="M2 5H30" class="x-fl x-fl-hot"/>', "Highlighted flow"),
    "ha": ('<path d="M2 5H30" class="x-fl x-fl-ha"/>', "HA / standby"),
    "net": ('<path d="M2 5H30" class="x-fl x-fl-net"/>', "LAN / underlay"),
    "down": ('<path d="M2 5H30" class="x-fl x-fl-down"/>', "Blocked / failed"),
    "attack": ('<path d="M2 5H30" class="x-fl-attack" style="fill:none"/>', "Attack"),
    "live": ('<circle cx="16" cy="5" r="3" class="x-led"/>', "Live traffic"),
    "dim": ('<path d="M2 5H30" class="x-fl x-fl-flow x-fl-dim"/>', "Possible / not in this flow"),
}
UNKNOWN_LEGEND = []   # kinds a spec used that have no swatch — reported as warnings


def legend_html(items):
    spans = []
    for it in items:
        kind, label = (it[0], it[1] if len(it) > 1 else None) if isinstance(it, list) else (it, None)
        if kind not in LEGEND_KINDS:
            UNKNOWN_LEGEND.append(kind)
        sw, default = LEGEND_KINDS.get(kind, LEGEND_KINDS["flow"])
        spans.append(f'<span class="x-lg"><svg class="x-sw" viewBox="0 0 32 10" aria-hidden="true">{sw}</svg>{html.escape(label or default)}</span>')
    return '<div class="dg-legend x-legend">' + "".join(spans) + "</div>"


def spotlight_section(spec, svg):
    s = spec["spotlight"]
    steps = "".join(f'<li><span class="spot-n" aria-hidden="true">{i + 1}</span>{st["t"]}</li>'
                    for i, st in enumerate(s.get("steps", [])) if st.get("t"))
    head = s.get("heading", "Where this sits in the Cato SASE platform")
    return ('<!-- dg:spotlight -->\n    <section id="platform" class="reveal">\n'
            '      <div class="section-kicker">On the platform</div>\n'
            f'      <h2>{head}</h2>\n'
            f'      <div class="diagram-card spotlight">{svg}</div>\n'
            + (f'      <ol class="spot-steps">{steps}</ol>\n' if steps else "")
            + '    </section>\n    <!-- /dg:spotlight -->')


def find_card_span(text, slot):
    """(start, end) of the <svg>…</svg> to replace for this slot, or None."""
    m = re.search(r'<!-- dg:%s -->(.*?)<!-- /dg:%s -->' % (re.escape(slot), re.escape(slot)), text, re.S)
    if m:
        return m.start(), m.end()
    cards = [c for c in re.finditer(r'<div class="diagram-card(?![^"]*spotlight)[^"]*"[^>]*>', text)]
    start = None
    if slot == "main":
        sol = text.find('<section id="solution"')
        pick = [c for c in cards if sol >= 0 and c.start() > sol] or cards
        if pick:
            start = text.find("<svg", pick[0].end())
    elif slot.startswith("card-"):
        n = int(slot.split("-")[1]) - 1
        if n < len(cards):
            start = text.find("<svg", cards[n].end())
    elif slot.startswith("phase-"):
        pp = text.find('class="phase-player')
        if pp >= 0:
            svgs = [m.start() for m in re.finditer(r'<svg\b', text[pp:])]
            n = int(slot.split("-")[1]) - 1
            if n < len(svgs):
                start = pp + svgs[n]
    if start is None or start < 0:
        return None
    end = text.find("</svg>", start)
    return (start, end + len("</svg>")) if end > 0 else None


def card_bounds(text, pos):
    """(open, close) of the diagram-card <div> containing pos; close = index just past its </div>."""
    open_ = text.rfind('<div class="diagram-card', 0, pos)
    if open_ < 0:
        return None
    depth = 0
    for m in re.finditer(r"<div\b|</div>", text[open_:]):
        depth += 1 if m.group(0) == "<div" else -1
        if depth == 0:
            return open_, open_ + m.end()
    return None


def inject(text, spec, res, sprite):
    notes = []
    # sprite, once, right after <body …>
    block = f"<!-- dg:sprite -->{sprite}<!-- /dg:sprite -->"
    if "<!-- dg:sprite -->" in text:
        text = re.sub(r"<!-- dg:sprite -->.*?<!-- /dg:sprite -->", lambda m: block, text, count=1, flags=re.S)
    else:
        text = re.sub(r"(<body[^>]*>\n?)", lambda m: m.group(1) + block + "\n", text, count=1)
    # spotlight section
    if res["spot"]:
        sec = spotlight_section(spec, res["spot"])
        if "<!-- dg:spotlight -->" in text:
            text = re.sub(r"<!-- dg:spotlight -->.*?<!-- /dg:spotlight -->", lambda m: sec, text, count=1, flags=re.S)
        else:
            anchor = next((text.find(a) for a in ('<section id="solution"', '<section id="demo"', '<section id="resources"') if text.find(a) >= 0), -1)
            if anchor < 0:
                notes.append("no anchor section for the spotlight")
            else:
                line = text.rfind("\n", 0, anchor) + 1
                text = text[:line] + "    " + sec + "\n\n" + text[line:]
    # diagrams
    for d in res["diagrams"]:
        span = find_card_span(text, d["slot"])
        if not span:
            notes.append(f"slot {d['slot']}: no target <svg> found")
            continue
        new = f"<!-- dg:{d['slot']} -->{d['svg']}<!-- /dg:{d['slot']} -->"
        text = text[:span[0]] + new + text[span[1]:]
        cb = card_bounds(text, span[0])
        if not cb:
            continue
        seg = text[cb[0]:cb[1]]
        if d["legend"] is not None:
            lg = legend_html(d["legend"]) if d["legend"] else ""
            lg_re = re.compile(r'<div class="dg-legend[^"]*">(?:(?!</div>).)*</div>', re.S)
            if lg_re.search(seg):
                seg = lg_re.sub(lambda m: lg, seg, count=1)
            elif lg:
                cap = max(seg.find('<p class="diagram-caption'), seg.find('<div class="diagram-caption'))
                close = seg.rfind("</div>")
                seg = seg[:cap] + lg + "\n        " + seg[cap:] if cap >= 0 else seg[:close] + lg + seg[close:]
        if d["caption"]:
            seg = re.sub(r'<(p|div) class="diagram-caption">.*?</\1>', lambda m: f'<{m.group(1)} class="diagram-caption">{d["caption"]}</{m.group(1)}>', seg, count=1, flags=re.S)
        text = text[:cb[0]] + seg + text[cb[1]:]
    return text, notes


def css_block(pg):
    port = pg.evaluate((KIT / "port_css.js").read_text())
    glue = (KIT / "glue.css").read_text()
    return f"{CSS_START}\n{glue}\n{port['css']}{CSS_END}"


def write_css(block, check):
    src = CSS.read_text()
    if CSS_START in src:
        new = re.sub(re.escape(CSS_START) + r".*?" + re.escape(CSS_END), lambda m: block, src, count=1, flags=re.S)
    else:
        new = src.rstrip() + "\n\n" + block + "\n"
    if new != src:
        if check:
            return ["style.css: dg-kit block is stale — run build-diagrams.py"]
        CSS.write_text(new)
    return []


def page_html(theme, body, extra_css=""):
    return (f'<!DOCTYPE html><html data-theme="{theme}"><head><meta charset="utf-8"><style>{CSS.read_text()}</style>'
            f'<style>body{{margin:0;padding:16px;background:var(--page,#fff)}}{extra_css}</style></head><body>{body}</body></html>')


def render_pic(b, svg, sprite):
    """The deck picture: white background (no gradient, no dot grid), 2x, palette-quantised PNG."""
    page = b.new_page(viewport={"width": 1400, "height": 1000}, device_scale_factor=2)
    page.set_content(page_html("light", f'{sprite}<div class="pic">{svg}</div>',
                               "body{padding:0;background:#fff} .pic{width:1400px} svg.x-fig{border-radius:0;box-shadow:none;background:#fff}"))
    page.wait_for_timeout(500)
    page.evaluate("document.querySelectorAll('animateMotion').forEach(a=>a.parentNode.style.display='none')")
    el = page.query_selector(".pic svg")
    box = el.bounding_box()
    png = el.screenshot(type="png", animations="disabled")
    page.close()
    try:
        import io
        from PIL import Image
        im = Image.open(io.BytesIO(png)).convert("RGB").quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
        buf = io.BytesIO(); im.save(buf, "PNG", optimize=True); png = buf.getvalue()
    except Exception:
        pass
    return png, round(box["width"]), round(box["height"])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ids", nargs="*")
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--preview")
    ap.add_argument("--no-pics", action="store_true")
    ap.add_argument("--catalogue")
    a = ap.parse_args()
    from playwright.sync_api import sync_playwright
    if not (KIT / "kit-host.html").exists():
        sys.exit("missing _extract/diagram-kit/kit-host.html — run make-kit-host.py on the platform-overview HTML first")
    specs = sorted(SPECS.glob("*.js"))
    if a.ids:
        specs = [s for s in specs if s.stem in a.ids]
        missing = set(a.ids) - {s.stem for s in specs}
        if missing:
            sys.exit(f"no spec for: {', '.join(sorted(missing))}")
    problems, warnings, manifest = [], [], {}
    if MANIFEST.exists():
        m = re.search(r"=\s*(\{.*\})\s*;?\s*$", MANIFEST.read_text(), re.S)
        if m:
            try:
                manifest = json.loads(m.group(1)).get("diagrams", {})
            except ValueError:
                manifest = {}
        # only pages whose picture file exists may stay in the manifest (deck-export loads deck-pics/<id>.js on demand)
        manifest = {k: {f: v[f] for f in ("w", "h", "title", "caption", "desc") if f in v}
                    for k, v in manifest.items() if (PICS / f"{k}.js").exists()}
    with sync_playwright() as p:
        b = launch(p)
        pg = b.new_page(viewport={"width": 1600, "height": 1000})
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto((KIT / "kit-host.html").as_uri())
        pg.wait_for_timeout(1200)
        pg.evaluate("document.documentElement.setAttribute('data-theme','light')")
        pg.add_script_tag(content=(KIT / "export_svg.js").read_text())
        pg.add_script_tag(content=REGISTRY)
        for s in specs:
            pg.add_script_tag(content=f"/* {s.name} */\ntry {{\n{s.read_text()}\n}} catch (e) {{ DG.errors.push('{s.stem}: ' + e.message); }}")
        if a.catalogue:
            out = Path(a.catalogue); out.mkdir(parents=True, exist_ok=True)
            sprite = pg.evaluate(SPRITE)
            for fig in pg.evaluate("Object.keys(__KIT.FIGS)"):
                r = pg.evaluate("""f => { const h=document.createElement('div'); document.body.appendChild(h);
                    const sv=__KIT.mountSpec(f,h,__KIT.FIG_VB[f]||'0 0 760 560',f); const r=__EXPORT(sv,'dg1',f,''); h.remove(); return r; }""", fig)
                v = b.new_page(viewport={"width": 1100, "height": 900})
                v.set_content(page_html("light", f'{sprite}<div class="diagram-card">{r["svg"]}</div>', "body{padding:12px}"))
                v.wait_for_timeout(500); v.query_selector("svg.x-fig").screenshot(path=str(out / f"{fig}.png")); v.close()
                print(fig, "warnings:", r["warnings"][:3])
            b.close()
            return
        spec_errs = pg.evaluate("DG.errors")
        if spec_errs:
            problems += [f"spec error: {e}" for e in spec_errs]
        if not a.preview:
            problems += write_css(css_block(pg), a.check)
        sprite = pg.evaluate(SPRITE)
        ids = pg.evaluate("Object.keys(DG.pages)")
        for pid in ids:
            res = pg.evaluate(RENDER, [pid, True])
            warnings += res["warnings"]
            spec = pg.evaluate("id => JSON.parse(JSON.stringify(DG.pages[id], (k, v) => typeof v === 'function' ? undefined : v))", pid)
            if a.preview:
                out = Path(a.preview); out.mkdir(parents=True, exist_ok=True)
                items = ([("spotlight", res["spot"])] if res["spot"] else []) + [(d["slot"], d["svg"]) for d in res["diagrams"]]
                for slot, svg in items:
                    for theme in ("light", "dark"):
                        v = b.new_page(viewport={"width": 1300, "height": 900})
                        v.set_content(page_html(theme, f'{sprite}<div class="diagram-card">{svg}</div>'))
                        v.wait_for_timeout(700)
                        v.query_selector("svg.x-fig").screenshot(path=str(out / f"{pid}-{slot}-{theme}.png"))
                        v.close()
                print(f"{pid}: previews in {out}" + (f" — {len(res['warnings'])} warning(s)" if res["warnings"] else ""))
                continue
            page = ROOT / "usecases" / f"{pid}.html"
            if not page.exists():
                problems.append(f"{pid}: no page usecases/{pid}.html")
                continue
            old = page.read_text()
            new, notes = inject(old, spec, res, sprite)
            problems += [f"{pid}: {n}" for n in notes]
            if new != old:
                if a.check:
                    problems.append(f"{pid}: page diagrams are stale — run build-diagrams.py {pid}")
                else:
                    page.write_text(new)
            main_d = next((d for d in res["diagrams"] if d["pic"]), None)
            if main_d and not a.no_pics and not a.check:
                PICS.mkdir(parents=True, exist_ok=True)
                png, w, h = render_pic(b, main_d["svg"], sprite)
                (PICS / f"{pid}.js").write_text(
                    "/* GENERATED by _extract/build-diagrams.py — the page's main diagram for the deck (2x PNG) */\n"
                    f"(window.UC_DECK_PICS = window.UC_DECK_PICS || {{}})[{json.dumps(pid)}] = "
                    f"{{w: {w}, h: {h}, png: \"data:image/png;base64,{base64.b64encode(png).decode()}\"}};\n")
                cap = main_d["caption"] or ""
                if not cap:
                    m = re.search(r'<!-- /dg:%s -->.*?<(?:p|div) class="diagram-caption">(.*?)</(?:p|div)>' % re.escape(main_d["slot"]), new, re.S)
                    cap = re.sub(r"<[^>]+>", "", m.group(1)).strip() if m else ""
                manifest[pid] = {"w": w, "h": h, "title": main_d["title"], "caption": cap, "desc": main_d["desc"]}
            print(f"{pid}: {'spotlight + ' if res['spot'] else ''}{len(res['diagrams'])} diagram(s)"
                  + (f" — {len(res['warnings'])} warning(s)" if res["warnings"] else ""))
        if errs:
            problems += [f"kit host error: {e}" for e in errs[:5]]
        b.close()
    if manifest and not a.check and not a.preview and not a.no_pics:
        MANIFEST.write_text("/* GENERATED by _extract/build-diagrams.py — deck diagram manifest; pictures load on demand from deck-pics/<id>.js */\n"
                            "window.UC_DECK_DIAGRAMS = " + json.dumps({"diagrams": dict(sorted(manifest.items()))}, indent=1, ensure_ascii=False) + ";\n")
    warnings += [f"legend kind '{k}' has no swatch (rendered as 'flow') — use one of {', '.join(LEGEND_KINDS)}" for k in sorted(set(UNKNOWN_LEGEND))]
    for w in warnings:
        print("WARN", w)
    for pbl in problems:
        print("FAIL", pbl)
    if (a.check and warnings) or problems:
        sys.exit(1)


if __name__ == "__main__":
    main()
