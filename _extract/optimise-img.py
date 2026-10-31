#!/usr/bin/env python3
"""Shrink oversized screenshots in assets/img/ (programme A10, images only).

For every assets/img/*.png larger than --min-kb (default 400 KB):
  * downscale anything wider than --max-width (default 1600 px) to that width (LANCZOS);
  * quantise to an 8-bit palette (MEDIANCUT, no dither) and save with optimize=True.
RGBA images are quantised with FASTOCTREE so the alpha channel survives.
A file is only rewritten when the result is smaller than the original.

Never touched: logo-*.png, icon-*.png, genai-anonymised-prompt-claude.png, and the
KEEP_FULL_RES allow-list below (dense rulebase / table captures whose figcaptions ask the
reader to read small text — keep them at capture resolution and full colour).

Dry-run by default: prints before/after sizes without writing.
    python3 _extract/optimise-img.py                 # report every candidate
    python3 _extract/optimise-img.py --apply         # rewrite every candidate in place
    python3 _extract/optimise-img.py --apply --top 5 # only the 5 largest candidates
    python3 _extract/optimise-img.py --only cma-ai-users.png cma-ai-uip.png
Exit 1 if any candidate could not be processed; silent-ish on success. Review the result
visually (crop a text region at 1:1) and `git checkout -- assets/img/<file>` anything that
degrades — the script is lossy by design.
"""
import argparse
import io
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit("optimise-img.py needs Pillow: python3 -m pip install Pillow")

ROOT = Path("/Users/tonystalker/Documents/claude/usecaselibrary")
IMG_DIR = ROOT / "assets" / "img"

# Captures whose value is the small text in a dense table/rulebase — keep at capture
# resolution and full colour. Add a name here before re-running if a page's figcaption
# tells the reader to read fine detail.
KEEP_FULL_RES = {
    "cma-wan-fw-rulebase.png",
    "cma-internet-fw-rulebase.png",
    "cma-net-routing.png",
    "cma-events-export-dialog.png",
}
NEVER_TOUCH_PREFIXES = ("logo-", "icon-")
NEVER_TOUCH = {"genai-anonymised-prompt-claude.png"}


def protected(name: str) -> str | None:
    """Return the reason a file must be skipped, or None if it is a candidate."""
    if name in NEVER_TOUCH or name.startswith(NEVER_TOUCH_PREFIXES):
        return "never-touch"
    if name in KEEP_FULL_RES:
        return "allow-list (small text)"
    return None


def optimise(src: Path, max_width: int) -> tuple[bytes, tuple[int, int], tuple[int, int]]:
    """Return (png_bytes, old_size, new_size) for the optimised version of src."""
    im = Image.open(src)
    im.load()
    old_size = im.size
    if im.mode not in ("RGB", "RGBA"):
        has_alpha = "A" in im.getbands() or "transparency" in im.info
        im = im.convert("RGBA" if has_alpha else "RGB")
    if im.width > max_width:
        new_h = round(im.height * max_width / im.width)
        im = im.resize((max_width, new_h), Image.LANCZOS)
    if im.mode == "RGBA":
        q = im.quantize(colors=256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE)
    else:
        q = im.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    buf = io.BytesIO()
    q.save(buf, format="PNG", optimize=True)
    return buf.getvalue(), old_size, im.size


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--apply", action="store_true", help="rewrite files in place (default: dry-run)")
    ap.add_argument("--min-kb", type=int, default=400, help="only consider PNGs larger than this (KB)")
    ap.add_argument("--max-width", type=int, default=1600, help="downscale anything wider than this (px)")
    ap.add_argument("--top", type=int, default=0, help="only process the N largest candidates")
    ap.add_argument("--only", nargs="*", default=None, metavar="FILE", help="restrict to these basenames")
    ap.add_argument("-v", "--verbose", action="store_true", help="also list skipped files")
    args = ap.parse_args()

    files = sorted(IMG_DIR.glob("*.png"), key=lambda p: -p.stat().st_size)
    if args.only:
        wanted = set(args.only)
        files = [p for p in files if p.name in wanted]
        missing = wanted - {p.name for p in files}
        if missing:
            print(f"not found in {IMG_DIR}: {', '.join(sorted(missing))}")
            return 1

    candidates = []
    for p in files:
        kb = p.stat().st_size / 1024
        if kb <= args.min_kb and not args.only:
            continue
        why = protected(p.name)
        if why:
            # Always say why when the file was named explicitly; otherwise only with -v.
            if args.verbose or args.only:
                print(f"skip  {p.name:45s} {kb:7.0f} KB  ({why})")
            continue
        candidates.append(p)
    if args.top:
        candidates = candidates[: args.top]

    if not candidates:
        print("nothing to do")
        return 0

    failures = 0
    before_total = after_total = 0
    for p in candidates:
        before = p.stat().st_size
        try:
            data, old_wh, new_wh = optimise(p, args.max_width)
        except Exception as e:  # noqa: BLE001
            print(f"FAIL  {p.name}: {e}")
            failures += 1
            continue
        after = len(data)
        if after >= before:
            print(f"keep  {p.name:45s} {before/1024:7.0f} KB  (no saving)")
            continue
        before_total += before
        after_total += after
        dims = f"{old_wh[0]}x{old_wh[1]}" + (f" -> {new_wh[0]}x{new_wh[1]}" if new_wh != old_wh else "")
        verb = "wrote" if args.apply else "would"
        print(f"{verb} {p.name:45s} {before/1024:7.0f} KB -> {after/1024:6.0f} KB  (-{100*(before-after)/before:4.1f}%)  {dims}")
        if args.apply:
            p.write_bytes(data)

    if before_total:
        print(
            f"{'saved' if args.apply else 'would save'} {(before_total-after_total)/1024/1024:.2f} MB "
            f"({before_total/1024/1024:.2f} -> {after_total/1024/1024:.2f} MB) across {len(candidates)} file(s)"
        )
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
