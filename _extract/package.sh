#!/bin/bash
# package.sh — build a shareable distribution zip of the library.
# Usage: bash _extract/package.sh          full edition (catalog-referenced decks included)
#        bash _extract/package.sh lite     lite edition (no decks, deck buttons stripped, <30MB)
# Includes: index, what's-new, all use-case pages, assets — and in the full edition ONLY the
# deck files referenced by catalog.js. Excludes: _extract tooling, unreferenced decks (some
# contain customer names), git metadata. Full and lite zips coexist in dist/.
set -euo pipefail
cd "$(dirname "$0")/.."

EDITION="${1:-full}"
case "$EDITION" in
  full) SUFFIX="" ;;
  lite) SUFFIX="-lite" ;;
  *) echo "usage: bash _extract/package.sh [lite]" >&2; exit 2 ;;
esac

OUT="dist/sase-use-case-library${SUFFIX}"
mkdir -p dist
rm -rf "$OUT"
mkdir -p "$OUT"

cp index.html "$OUT/"
[ -f whatsnew.html ] && cp whatsnew.html "$OUT/"
cp -R usecases "$OUT/usecases"
cp -R assets "$OUT/assets"

if [ "$EDITION" = "full" ]; then
  # copy only catalog-referenced decks, preserving relative paths (keeps download buttons working)
  python3 - "$OUT" <<'EOF'
import re, shutil, sys
from pathlib import Path
out = Path(sys.argv[1])
for deck in re.findall(r'deck: "([^"]+)"', Path("assets/js/catalog.js").read_text()):
    src = Path(deck)
    if not src.exists():
        raise SystemExit(f"referenced deck missing: {deck}")
    dst = out / deck
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    print(f"  deck: {deck}")
EOF
else
  # lite: no decks shipped — strip the deck download buttons so nothing 404s
  python3 - "$OUT" <<'EOF'
import re, sys
from pathlib import Path
out = Path(sys.argv[1])
pat = re.compile(r'[ \t]*<a class="btn btn-ghost" href="\.\./[^"]*\.pptx" download>[^<]*</a>\n?')
stripped = 0
for page in (out / "usecases").glob("*.html"):
    html = page.read_text()
    new, n = pat.subn("", html)
    if n:
        page.write_text(new)
        stripped += n
print(f"  lite: stripped {stripped} deck buttons")
if stripped == 0:
    raise SystemExit("lite: expected deck buttons to strip but found none — check the markup pattern")
EOF
fi

if [ "$EDITION" = "lite" ]; then
  DECKNOTE="This lite edition ships without the original PPTX decks (smaller zip);
use the full edition if you need them."
else
  DECKNOTE="Original decks are linked for download from each deck-backed page."
fi

cat > "$OUT/README.txt" <<EOF
Cato SASE Use Case Library
==========================
Internal SE / partner enablement. Not for external distribution.

To use: unzip anywhere and open index.html in any modern browser.
Everything works offline (file://) — no server, no internet required.

Start with the "Start here" journeys on the index page, or use the
search box (full page text) and clickable tags to find a use case.
"What's new" lists recent changes. ${DECKNOTE}
EOF

STAMP=$(date +%Y-%m-%d)
ZIP="dist/sase-use-case-library${SUFFIX}-${STAMP}.zip"
rm -f dist/sase-use-case-library${SUFFIX}-20*.zip
(cd dist && zip -qr "$(basename "$ZIP")" "$(basename "$OUT")" -x "*.DS_Store")
SIZE=$(du -h "$ZIP" | cut -f1)
PAGES=$(ls "$OUT/usecases" | wc -l | tr -d ' ')
echo "built $ZIP (${SIZE}, ${PAGES} use-case pages + index + what's new, ${EDITION} edition)"
