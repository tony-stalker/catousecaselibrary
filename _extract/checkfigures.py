#!/usr/bin/env python3
"""checkfigures.py — figure, image and capture-marker hygiene for the library.

Stdlib only; reads usecases/*.html, index.html, planner.html and whatsnew.html
as text (no browser) and reports, one line each as "file:line kind detail":

  broken-src      <img src> that does not exist on disk            (FAILS)
  missing-dims    <img> without both width and height
  first-lazy      the first <img> on a page carries loading="lazy"
  eager           a later <img> on the page without loading="lazy"
  dup-src         the same image embedded twice on one page
  orphan          assets/img file referenced by no page (any src/href/srcset,
                  so SVG <image href> counts), CSS or JS            (file:0)
  marker-nopath   <!-- capture-wanted: … --> whose path part has no → / -> / >
                  separator. Markers app.js phParse() renders as a "client" or
                  "external" mock-up (Cato Client …, terminal/SIEM/S3 …) are
                  exempt — those never have a CMA path
  marker-section  marker whose first path segment is not a CMA sidebar section
                  (Home Monitor Network Security Access Assets Resources
                  Administration Account "AI Security"), so app.js cannot
                  highlight it in the placeholder console

Marker grammar follows assets/js/app.js phParse(): strip «» and a leading
"CMA ", split on " — " (em/en dash or hyphen with spaces) into path and detail;
when there is no dash the whole text is treated as detail and has no path.

Everything is a report; the exit status is 1 only for broken-src (or a missing
page). Summary line at the end.

Usage:
  python3 _extract/checkfigures.py                     # whole library
  python3 _extract/checkfigures.py --kinds eager,dup-src
  python3 _extract/checkfigures.py --counts            # summary only
  python3 _extract/checkfigures.py usecases/management-dem.html
"""
import argparse
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

LIB_ROOT = Path(__file__).resolve().parent.parent

KINDS = ["broken-src", "missing-dims", "first-lazy", "eager", "dup-src", "orphan",
         "marker-nopath", "marker-section"]
SECTIONS = ["Home", "Monitor", "Network", "Security", "Access", "Assets", "Resources",
            "Administration", "Account", "AI Security"]

IMG_RE = re.compile(r"<img\b[^>]*>", re.I)
ATTR_RE = re.compile(r'([a-zA-Z-]+)="([^"]*)"')
MARKER_RE = re.compile(r"<!--\s*capture-wanted:\s*(.*?)\s*-->", re.S)
IMG_REF_RE = re.compile(r"assets/img/[^\"')\s]+")
# every local reference a page can make to an asset (img src, <a href>, SVG <image href>, srcset…)
REF_ATTR_RE = re.compile(r'(?:src|href|xlink:href|srcset|poster|data-src)="([^"#]+)"', re.I)
DASH_SPLIT = re.compile(r"\s+[—–-]\s+")
PATH_SPLIT = re.compile(r"\s*(?:→|->|>)\s*")
# mirror app.js phParse() kind detection
CLIENT_RE = re.compile(r"^Cato Client|^Client\b|device —", re.I)
EXTERNAL_RE = re.compile(r"console|terminal|nslookup|S3|SIEM|Sentinel|Splunk", re.I)


def line_of(text, pos):
    return text.count("\n", 0, pos) + 1


def default_pages(root):
    pages = ["index.html", "planner.html", "whatsnew.html"]
    pages += sorted("usecases/" + p.name for p in (root / "usecases").glob("*.html"))
    return pages


def local_target(f, ref):
    """Resolve a page-relative reference to a path, or None for URLs/data/anchors."""
    ref = ref.strip().split()[0] if ref.strip() else ""
    if not ref or ref.startswith(("http://", "https://", "mailto:", "data:", "#", "javascript:")):
        return None
    return (f.parent / unquote(urlparse(ref).path)).resolve()


def check_page(root, page, out, referenced):
    f = root / page
    if not f.exists():
        out.append((page, 0, "missing-file", "page not found"))
        return
    text = f.read_text(encoding="utf-8", errors="replace")

    for ref in REF_ATTR_RE.findall(text):
        target = local_target(f, ref)
        if target is not None:
            try:
                referenced.add(target.relative_to(root).as_posix())
            except ValueError:
                pass

    seen_src = {}
    for n, m in enumerate(IMG_RE.finditer(text)):
        tag = m.group(0)
        ln = line_of(text, m.start())
        attrs = dict(ATTR_RE.findall(tag))
        src = attrs.get("src", "")
        name = src.split("/")[-1]
        target = local_target(f, src)
        if target is not None and not target.exists():
            out.append((page, ln, "broken-src", src))
        if not (attrs.get("width") and attrs.get("height")):
            out.append((page, ln, "missing-dims", name))
        lazy = attrs.get("loading", "").lower() == "lazy"
        if n == 0 and lazy:
            out.append((page, ln, "first-lazy", name))
        elif n > 0 and not lazy:
            out.append((page, ln, "eager", name))
        if src in seen_src:
            out.append((page, ln, "dup-src", f"{name} (first at line {seen_src[src]})"))
        else:
            seen_src[src] = ln

    for m in MARKER_RE.finditer(text):
        ln = line_of(text, m.start())
        raw = re.sub(r"\s+", " ", m.group(1))
        t = re.sub(r'^[\s«"]+|[\s»"]+$', "", raw)
        t = re.sub(r"^CMA\s+", "", t, flags=re.I)
        parts = DASH_SPLIT.split(t)
        path = parts[0] if len(parts) > 1 else ""
        segs = [s for s in PATH_SPLIT.split(path) if s]
        short = t[:70] + ("…" if len(t) > 70 else "")
        if not segs:
            if not CLIENT_RE.search(t) and not EXTERNAL_RE.search(t):
                out.append((page, ln, "marker-nopath", short))
            continue
        first = segs[0].lower()
        if not any(first.startswith(s.lower()) for s in SECTIONS):
            out.append((page, ln, "marker-section", f'"{segs[0]}" — {short}'))


def main():
    ap = argparse.ArgumentParser(description="Figure / image / capture-marker hygiene report")
    ap.add_argument("pages", nargs="*", help="pages relative to the library root (default: all)")
    ap.add_argument("--root", default=str(LIB_ROOT), help="library root (default: this checkout)")
    ap.add_argument("--kinds", default=",".join(KINDS),
                    help="comma-separated kinds to report (default: all: %s)" % ",".join(KINDS))
    ap.add_argument("--counts", action="store_true", help="print only the per-kind summary")
    args = ap.parse_args()
    root = Path(args.root).resolve()
    kinds = {k.strip() for k in args.kinds.split(",") if k.strip()}
    unknown = kinds - set(KINDS)
    if unknown:
        sys.exit(f"checkfigures.py: unknown kind(s): {', '.join(sorted(unknown))}")
    explicit = bool(args.pages)
    pages = args.pages or default_pages(root)

    out, referenced = [], set()
    for page in pages:
        check_page(root, page, out, referenced)

    # orphans: only meaningful over the whole library; CSS/JS url() refs count too
    if "orphan" in kinds and not explicit:
        for extra in list((root / "assets/css").glob("*.css")) + list((root / "assets/js").rglob("*.js")):
            for ref in IMG_REF_RE.findall(extra.read_text(encoding="utf-8", errors="replace")):
                referenced.add(ref)
        img_dir = root / "assets/img"
        if img_dir.is_dir():
            for img in sorted(img_dir.iterdir()):
                if img.is_file() and not img.name.startswith(".") and img.relative_to(root).as_posix() not in referenced:
                    out.append((img.relative_to(root).as_posix(), 0, "orphan", f"{img.stat().st_size // 1024} KB"))

    out = [d for d in out if d[2] in kinds or d[2] == "missing-file"]
    out.sort(key=lambda t: (t[0], t[1], t[2]))
    counts = {}
    for d in out:
        counts[d[2]] = counts.get(d[2], 0) + 1
    if not args.counts:
        for page, ln, kind, detail in out:
            print(f"{page}:{ln} {kind} {detail}")
    fatal = counts.get("broken-src", 0) + counts.get("missing-file", 0)
    if out:
        table = "  ".join(f"{k}={counts[k]}" for k in KINDS + ["missing-file"] if counts.get(k))
        print(f"checkfigures: {len(out)} finding(s) across {len(pages)} pages — {table}")
    else:
        print(f"OK — figures clean on {len(pages)} pages")
    sys.exit(1 if fatal else 0)


if __name__ == "__main__":
    main()
