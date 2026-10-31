#!/usr/bin/env python3
"""a11y-check.py — static-ish accessibility lint for the use-case library.

Renders every usecases/*.html plus index.html, planner.html and whatsnew.html in the cached
headless Chromium (so JS-injected markup — TOC, runbook tabs, capture
placeholders, index cards — is checked too) and reports structural defects:

  heading-skip      heading level jumps by more than one (h2 → h4)
  th-scope          data table with <th> cells that carry no scope attribute
  link-text         link whose text is just "here", "link", "click" and friends
  js-href           <a href="javascript:…"> (should be a <button>)
  nested-interactive  link/button/control inside another link or button
  img-alt           <img> with no alt attribute (alt="" is fine for decoration)
  img-dims          figure.shot img without both width and height
  svg-title         non-decorative <svg> with no <title> child and no aria-label
  dup-id            the same id used more than once on one page
  labelledby        aria-labelledby token pointing at a missing or empty element

One line per defect: "file:line kind detail". The line is located by searching
the page source for the offending open tag; markup created by JavaScript has
no source line and is reported as line 0 with an "[injected]" tag — fix it in
assets/js/app.js. Summary at the end; exit 1 if any defect is found.

Usage:
  python3 _extract/a11y-check.py                 # whole library
  python3 _extract/a11y-check.py --kinds th-scope,img-dims
  python3 _extract/a11y-check.py --counts        # summary table only
  python3 _extract/a11y-check.py usecases/network-sdwan.html   # one or more pages

Requires playwright (python) and the cached Chromium via _extract/chromium.py.
"""
import argparse
import html
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from chromium import launch  # noqa: E402

LIB_ROOT = Path(__file__).resolve().parent.parent

KINDS = ["heading-skip", "th-scope", "link-text", "js-href", "nested-interactive",
         "img-alt", "img-dims", "svg-title", "dup-id", "labelledby"]

# Runs in the page. Returns [{kind, detail, needle, injected}] — needle is the
# text we search the source for to recover a line number.
JS = r"""
() => {
  const out = [];
  const norm = s => (s || "").replace(/\s+/g, " ").trim();
  const openTag = el => {
    const h = el.outerHTML;
    const i = h.indexOf(">");
    return i > 0 ? h.slice(0, i + 1) : h.slice(0, 160);
  };
  const push = (kind, el, detail) => out.push({kind, detail, needle: el ? openTag(el) : "", id: el && el.id || "",
                                                text: el ? norm(el.textContent).slice(0, 30) : ""});

  // headings
  let prev = 0;
  document.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(h => {
    const lvl = +h.tagName[1];
    if (prev && lvl > prev + 1) push("heading-skip", h, `h${prev} → h${lvl} "${norm(h.textContent).slice(0, 60)}"`);
    prev = lvl;
  });

  // tables
  document.querySelectorAll("table").forEach(t => {
    const ths = [...t.querySelectorAll("th")];
    const bad = ths.filter(th => !th.hasAttribute("scope"));
    if (!ths.length) push("th-scope", t, "table has no <th> at all");
    else if (bad.length) push("th-scope", t, `${bad.length}/${ths.length} th without scope; first: "${norm(bad[0].textContent).slice(0, 40)}"`);
  });

  // links
  const BAD_TEXT = new Set(["here", "link", "click", "click here", "this", "read more", "more", "this link", "this page"]);
  document.querySelectorAll("a").forEach(a => {
    const txt = norm(a.textContent).toLowerCase();
    if (BAD_TEXT.has(txt) && !a.getAttribute("aria-label")) push("link-text", a, `"${txt}" → ${a.getAttribute("href")}`);
    const href = a.getAttribute("href") || "";
    if (/^\s*javascript:/i.test(href)) push("js-href", a, `${href.slice(0, 50)} "${norm(a.textContent).slice(0, 40)}"`);
  });

  // nested interactive
  const INTER = "a[href],button,input,select,textarea,[role=button],[role=link],[role=tab],[tabindex]:not([tabindex='-1'])";
  document.querySelectorAll(INTER).forEach(el => {
    const parent = el.parentElement && el.parentElement.closest("a[href],button,[role=button],[role=link]");
    if (parent) push("nested-interactive", parent, `<${el.tagName.toLowerCase()}${el.className ? "." + String(el.className).split(" ")[0] : ""}> inside <${parent.tagName.toLowerCase()}> "${norm(parent.textContent).slice(0, 40)}"`);
  });

  // images
  document.querySelectorAll("img").forEach(img => {
    const src = (img.getAttribute("src") || "").split("/").pop();
    if (!img.hasAttribute("alt")) push("img-alt", img, src);
    if (img.closest("figure.shot") && !(img.hasAttribute("width") && img.hasAttribute("height"))) push("img-dims", img, src);
  });

  // svg
  document.querySelectorAll("svg").forEach(svg => {
    if (svg.closest("[aria-hidden='true']")) return;
    if (svg.getAttribute("aria-hidden") === "true") return;
    const hasTitle = [...svg.children].some(c => c.tagName.toLowerCase() === "title" && norm(c.textContent));
    if (!hasTitle && !svg.getAttribute("aria-label")) push("svg-title", svg, `class="${svg.getAttribute("class") || ""}" ${svg.getAttribute("viewBox") || ""}`.trim());
  });

  // duplicate ids
  const seen = new Map();
  document.querySelectorAll("[id]").forEach(el => { seen.set(el.id, (seen.get(el.id) || []).concat(el)); });
  seen.forEach((els, id) => { if (els.length > 1) push("dup-id", els[1], `id="${id}" ×${els.length}`); });

  // aria-labelledby targets
  document.querySelectorAll("[aria-labelledby]").forEach(el => {
    el.getAttribute("aria-labelledby").split(/\s+/).filter(Boolean).forEach(tok => {
      const t = document.getElementById(tok);
      if (!t) push("labelledby", el, `#${tok} does not exist`);
      else if (!norm(t.textContent)) push("labelledby", el, `#${tok} is empty`);
    });
  });
  return out;
}
"""


def default_pages(root):
    pages = ["index.html", "planner.html", "whatsnew.html"]
    pages += sorted("usecases/" + p.name for p in (root / "usecases").glob("*.html"))
    return pages


def find_line(src_lines, needle, el_id, text=""):
    """Best-effort source line for a DOM open tag; 0 when the markup is JS-made.

    A bare tag (<h4>, <table>) matches many lines, so when the element has text
    the first match whose next few lines also carry the start of that text wins.
    """
    cands = []
    if el_id:
        cands.append(f'id="{el_id}"')
    if needle:
        cands.append(needle)
        # attribute order / quoting survive serialisation, but whitespace may not;
        # fall back to the src/href value, then the first attribute
        m = re.search(r'(?:src|href)="([^"]+)"', needle)
        if m:
            cands.append(m.group(0))
        m = re.search(r'^<\w+\s+([a-zA-Z-]+="[^"]*")', needle)
        if m:
            cands.append(m.group(1))
    # textContent joins cells with no whitespace, so compare with all whitespace removed
    text = re.sub(r"\s+", "", text)[:18]
    for c in cands:
        hits = [i for i, line in enumerate(src_lines, 1) if c in line]
        if not hits:
            continue
        if len(hits) > 1 and text:
            for i in hits:
                window = html.unescape(re.sub(r"<[^>]+>", " ", " ".join(src_lines[i - 1:i + 7])))
                if text in re.sub(r"\s+", "", window):
                    return i
        return hits[0]
    return 0


def main():
    ap = argparse.ArgumentParser(description="Accessibility lint for library pages (Playwright)")
    ap.add_argument("pages", nargs="*", help="pages relative to the library root (default: all)")
    ap.add_argument("--root", default=str(LIB_ROOT), help="library root (default: this checkout)")
    ap.add_argument("--kinds", default=",".join(KINDS),
                    help="comma-separated kinds to report (default: all: %s)" % ",".join(KINDS))
    ap.add_argument("--counts", action="store_true", help="print only the per-kind summary table")
    args = ap.parse_args()
    root = Path(args.root).resolve()
    kinds = {k.strip() for k in args.kinds.split(",") if k.strip()}
    unknown = kinds - set(KINDS)
    if unknown:
        sys.exit(f"a11y-check.py: unknown kind(s): {', '.join(sorted(unknown))}")
    pages = args.pages or default_pages(root)

    from playwright.sync_api import sync_playwright
    defects = []          # (file, line, kind, detail)
    per_kind = {k: 0 for k in KINDS}
    pages_hit = set()
    with sync_playwright() as p:
        b = launch(p)
        pg = b.new_page(viewport={"width": 1280, "height": 900})
        for page in pages:
            f = root / page
            if not f.exists():
                print(f"{page}:0 missing-file page not found")
                defects.append((page, 0, "missing-file", ""))
                continue
            src_lines = f.read_text(encoding="utf-8", errors="replace").splitlines()
            pg.goto(f.as_uri())
            pg.wait_for_timeout(250)
            # runbook tabs hide one panel; a11y applies to both, so unhide for the walk
            pg.evaluate("document.querySelectorAll('.rb-hidden').forEach(el => el.classList.remove('rb-hidden'))")
            for d in pg.evaluate(JS):
                if d["kind"] not in kinds:
                    continue
                line = find_line(src_lines, d["needle"], d["id"], d.get("text", ""))
                detail = d["detail"] if line else d["detail"] + " [injected]"
                defects.append((page, line, d["kind"], detail))
                per_kind[d["kind"]] += 1
                pages_hit.add(page)
        b.close()

    defects.sort(key=lambda t: (t[0], t[1], t[2]))
    if not args.counts:
        for page, line, kind, detail in defects:
            print(f"{page}:{line} {kind} {detail}")
    if defects:
        table = "  ".join(f"{k}={n}" for k, n in per_kind.items() if n)
        print(f"a11y-check: {len(defects)} defect(s) on {len(pages_hit)}/{len(pages)} pages — {table}")
        sys.exit(1)
    print(f"OK — no accessibility defects on {len(pages)} pages")


if __name__ == "__main__":
    main()
