#!/bin/bash
# verify.sh — one-command health check for the Cato Use Case Library.
# Usage: bash _extract/verify.sh          (from the library root)
# Runs: link check, catalog consistency, identifying-reference sweep,
#       CDN-load check, SVG text measurement, console-error render, mobile fit,
#       search-index freshness.
set -u
cd "$(dirname "$0")/.." || exit 1
FAIL=0

echo "== 1/8 link check"
python3 _extract/checklinks.py index.html planner.html whatsnew.html usecases/*.html || FAIL=1

echo "== 2/8 catalog consistency + hygiene"
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

echo "== 3/8 external resource loads (CDN) + theme snippet"
if grep -rn -E 'src="http|<link[^>]*href="http|@import|url\(http' index.html planner.html usecases/*.html assets/css/style.css; then
  echo "FAIL: external resource loads found"; FAIL=1
else
  echo "OK — file:// safe"
fi
# every page must carry the dark-mode bootstrap snippet (pages authored in
# parallel with the snippet sweep have missed it — migration-journey-vpn, Jul 2026)
SNIPMISS=0
for f in index.html planner.html whatsnew.html usecases/*.html; do
  grep -q 'uc-theme' "$f" || { echo "FAIL: theme snippet missing in $f"; SNIPMISS=1; }
done
[ "$SNIPMISS" = 0 ] && echo "OK — theme snippet on all pages" || FAIL=1

echo "== 4/8 SVG text measurement (must be silent — any output is a regression)"
python3 _extract/measure_svg.py || FAIL=1

echo "== 5/8 render + console errors (index)"
python3 _extract/shoot.py index.html /tmp/verify-index.png | tail -1 | grep -q "no console errors" && echo "OK" || { echo "FAIL: console errors"; FAIL=1; }

echo "== 6/8 mobile fit (390px, all pages)"
python3 - <<'EOF' || FAIL=1
from playwright.sync_api import sync_playwright
import pathlib, sys
sys.path.insert(0, "_extract")
from chromium import launch
BASE = "file://" + str(pathlib.Path.cwd()) + "/"
with sync_playwright() as p:
    b = launch(p)
    pg = b.new_page(viewport={"width": 390, "height": 844})
    bad = []
    for page in ["index.html", "planner.html", "whatsnew.html"] + ["usecases/" + f.name for f in sorted(pathlib.Path("usecases").glob("*.html"))]:
        pg.goto(BASE + page); pg.wait_for_timeout(200)
        pg.evaluate("document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'))")
        # runbook tabs hide the inactive panel — reveal it so its width is measured too
        pg.evaluate("document.querySelectorAll('.rb-hidden').forEach(el => el.classList.remove('rb-hidden'))")
        if pg.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 1"):
            bad.append(page)
    b.close()
if bad:
    print("overflow:", bad); sys.exit(1)
print("OK — all pages fit")
EOF

echo "== 7/8 search index freshness (full-text search)"
python3 _extract/build-search.py --check || FAIL=1

echo "== 8/8 planner rules integrity"
python3 - <<'EOF' || FAIL=1
import re, sys
from pathlib import Path
cat = Path("assets/js/catalog.js").read_text()
ids = set(re.findall(r'id: "([^"]+)"', cat))
src = Path("assets/js/planner-rules.js").read_text()
phase_keys = set(re.findall(r'key:\s*"([^"]+)",\s*\n?\s*title:', src))
errs = []
# every page id referenced by a rule must exist in the catalog
for pid in re.findall(r'pages:\s*\[([^\]]*)\]', src):
    for one in re.findall(r'"([^"]+)"', pid):
        if one not in ids:
            errs.append("planner rule references unknown page id: " + one)
# every phase key used by a rule must exist in the phase spine
for ph in re.findall(r'phase:\s*"([^"]+)"', src):
    if ph not in phase_keys:
        errs.append("planner rule uses unknown phase key: " + ph)
n_opts = len(re.findall(r'\bkey:\s*"', src)) - len(phase_keys)
print("%d catalog ids / %d phases / %d rule options" % (len(ids), len(phase_keys), n_opts))
if errs:
    print("\n".join(sorted(set(errs)))); sys.exit(1)
EOF
python3 - <<'EOF' || FAIL=1
from playwright.sync_api import sync_playwright
import pathlib, sys
sys.path.insert(0, "_extract")
from chromium import launch
BASE = "file://" + str(pathlib.Path.cwd()) + "/"
errs = []
with sync_playwright() as p:
    b = launch(p)
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(BASE + "planner.html"); pg.wait_for_timeout(300)
    pg.select_option("#f-wan", "mpls"); pg.select_option("#f-proxy", "zscaler")
    pg.select_option("#f-ra", "anyconnect")
    pg.click("#pl-go"); pg.wait_for_timeout(400)
    pg.click("#pl-view"); pg.wait_for_timeout(300)
    n_ph = pg.eval_on_selector_all(".pl-phase", "e=>e.length")
    n_st = pg.eval_on_selector_all(".pl-phase li", "e=>e.length")
    hrefs = pg.eval_on_selector_all(".pl-links a", "els=>els.map(e=>e.getAttribute('href'))")
    n_topo = pg.eval_on_selector_all(".pl-doc .pl-topo svg", "e=>e.length")
    # every export must actually build, and no slide may overflow its stage
    exports = pg.evaluate("""() => {
      const r = {};
      try { r.pptx = window.PlannerExport._pptxBlob([{title:'t',bullets:['a']}]).size > 0; }
      catch (e) { r.pptx = 'ERR ' + e.message; }
      try { r.xlsx = window.PlannerExport._xlsxBlob([{name:'S',columns:[{title:'A'}],rows:[['x']]}]).size > 0; }
      catch (e) { r.xlsx = 'ERR ' + e.message; }
      try { r.drawio = window.PlannerTopology.drawio([]).indexOf('<mxfile') === 0; }
      catch (e) { r.drawio = 'ERR ' + e.message; }
      return r;
    }""")
    # a slide whose list outgrows its room is unpresentable; measure it the way reflow does
    MEASURE = """() => {
      const out = [];
      document.querySelectorAll('#pl-stage .pl-slide').forEach((el, i) => {
        el.classList.add('active');
        const ul = el.querySelector('.sl-list');
        if (ul) {
          const cs = getComputedStyle(el);
          let room = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
          [...el.children].forEach(c => { if (!c.classList.contains('sl-list')) room -= c.getBoundingClientRect().height; });
          if (ul.getBoundingClientRect().height > room + 1) out.push(i);
        }
        el.classList.remove('active');
      });
      return out;
    }"""
    over = pg.evaluate(MEASURE)
    n_sum = pg.eval_on_selector_all("#pl-stage .pl-slide", "e=>e.length")

    # the small estate passing is not enough: a maximal estate at full detail is what
    # exhausted the old packing logic, so measure that too
    pg.select_option("#f-wan", "hybrid-mpls-internet")
    pg.wait_for_timeout(100)
    for sel in ("#f-sdwan", "#f-proxy", "#f-fw", "#f-ra", "#f-spread"):
        vals = pg.eval_on_selector_all(sel + " option", "els=>els.map(e=>e.value).filter(Boolean)")
        if vals: pg.select_option(sel, vals[0])
    pg.fill("#f-name", "Verify estate"); pg.fill("#f-sites", "120")
    pg.evaluate("document.querySelectorAll('input[type=checkbox][data-dim]').forEach(cb => cb.checked = true)")
    pg.click("#pl-go"); pg.wait_for_timeout(500)
    pg.click("#pl-view"); pg.wait_for_timeout(200)
    pg.select_option("#pl-depth", "full"); pg.wait_for_timeout(1000)
    over_full = pg.evaluate(MEASURE)
    n_full = pg.eval_on_selector_all("#pl-stage .pl-slide", "e=>e.length")
    b.close()
bad = [h for h in set(hrefs) if not (pathlib.Path.cwd() / h).exists()]
if errs: print("console errors:", errs[:3]); sys.exit(1)
if n_ph < 5 or n_st < 15: print("planner composed too little: %d phases / %d steps" % (n_ph, n_st)); sys.exit(1)
if bad: print("broken plan links:", bad); sys.exit(1)
if n_topo != 3: print("expected 3 topology diagrams, got %d" % n_topo); sys.exit(1)
bad_exp = [k for k, v in exports.items() if v is not True]
if bad_exp: print("export failures:", {k: exports[k] for k in bad_exp}); sys.exit(1)
if over: print("slides overflowing their stage:", over); sys.exit(1)
if n_sum > 24: print("summary deck too long: %d slides" % n_sum); sys.exit(1)
if over_full: print("full-detail slides overflowing (maximal estate):", over_full); sys.exit(1)
print("OK — %d phases / %d steps / %d links / 3 diagrams / %d-slide summary deck / %d-slide maximal full deck / pptx+xlsx+drawio"
      % (n_ph, n_st, len(hrefs), n_sum, n_full))
EOF

if [ "${1:-}" = "--external" ]; then
  echo "== 9/9 external links (optional, network-dependent)"
  python3 _extract/checkexternal.py || FAIL=1
fi

echo
if [ "$FAIL" -eq 0 ]; then echo "VERIFY: ALL CHECKS PASSED"; else echo "VERIFY: FAILURES FOUND (see above)"; exit 1; fi
