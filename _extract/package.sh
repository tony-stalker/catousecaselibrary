#!/bin/bash
# package.sh — build a shareable distribution zip of the library.
# Usage: bash _extract/package.sh     (from the library root)
# Includes: index, what's-new, all use-case pages, assets, and ONLY the deck files
# referenced by catalog.js. Excludes: _extract tooling, unreferenced decks (some
# contain customer names), git metadata.
set -euo pipefail
cd "$(dirname "$0")/.."

OUT="dist/sase-use-case-library"
rm -rf dist && mkdir -p "$OUT"

cp index.html "$OUT/"
[ -f whatsnew.html ] && cp whatsnew.html "$OUT/"
cp -R usecases "$OUT/usecases"
cp -R assets "$OUT/assets"

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

cat > "$OUT/README.txt" <<'EOF'
Cato SASE Use Case Library
==========================
Internal SE / partner enablement. Not for external distribution.

To use: unzip anywhere and open index.html in any modern browser.
Everything works offline (file://) — no server, no internet required.

Start with the "Start here" journeys on the index page, or use the
search box and clickable tags to find a use case. "What's new" lists
recent changes.
EOF

STAMP=$(date +%Y-%m-%d)
ZIP="dist/sase-use-case-library-${STAMP}.zip"
(cd dist && zip -qr "$(basename "$ZIP")" "$(basename "$OUT")" -x "*.DS_Store")
SIZE=$(du -h "$ZIP" | cut -f1)
PAGES=$(ls "$OUT/usecases" | wc -l | tr -d ' ')
echo "built $ZIP (${SIZE}, ${PAGES} use-case pages + index + what's new)"
