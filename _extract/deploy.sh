#!/bin/bash
# deploy.sh — publish the library to the Azure Ubuntu host and (re)start its server.
# Usage: bash _extract/deploy.sh            (from the library root)
#
# Reads SSH credentials from ubuntu.txt in the library root ("Username - x" / "Password - y";
# the file is git-ignored — NEVER commit it). Host/port/dest below. Uses expect for the
# password so it is never echoed or passed on a command line.
#
# What it does (idempotent):
#   1. Stages the full edition (index, whatsnew, usecases, assets, catalog-referenced decks)
#      into dist/deploy-stage — same file set as package.sh's full zip.
#   2. rsync to $DEST with --delete, EXCLUDING feedback-log.txt (never clobber collected
#      feedback) and server.py (copied separately so updates propagate).
#   3. Installs/refreshes the systemd unit `usecaselibrary` (python3 server.py on :$PORT,
#      CAP_NET_BIND_SERVICE, as $SSH_USER) and restarts it.
#   4. Smoke-tests http://$HOST/ from this machine (over the Cato tunnel).
set -euo pipefail
cd "$(dirname "$0")/.."

HOST=10.7.0.4
DEST=/srv/usecaselibrary
PORT=8080   # 80 is taken by Apache (SASE-Experts contractor portal) on this host
SSH_USER=$(python3 -c "print([l.strip() for l in open('ubuntu.txt') if l.strip()][0].split(' - ',1)[1])")
export DEPLOY_PW=$(python3 -c "print([l.strip() for l in open('ubuntu.txt') if l.strip()][1].split(' - ',1)[1])")

run_expect() {  # $@ = command to spawn; answers password prompts from $DEPLOY_PW
  local exp rc=0
  exp=$(mktemp)
  cat > "$exp" <<'EOF'
set timeout 300
spawn {*}$argv
expect {
  -re "(?i)password:" { send "$env(DEPLOY_PW)\r"; exp_continue }
  eof {}
  timeout { puts "EXPECT-TIMEOUT"; exit 124 }
}
catch wait result
exit [lindex $result 3]
EOF
  expect "$exp" "$@" || rc=$?
  rm -f "$exp"
  return $rc
}

echo "== 1/4 staging"
STAGE=dist/deploy-stage
rm -rf "$STAGE" && mkdir -p "$STAGE"
cp index.html whatsnew.html "$STAGE/"
cp -R usecases "$STAGE/usecases"
cp -R assets "$STAGE/assets"
python3 - "$STAGE" <<'EOF'
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
EOF
cp _extract/server.py "$STAGE/server.py"
echo "   staged $(find "$STAGE" -type f | wc -l | tr -d ' ') files"

echo "== 2/4 rsync -> $SSH_USER@$HOST:$DEST"
run_expect ssh -o StrictHostKeyChecking=accept-new "$SSH_USER@$HOST" \
  "sudo mkdir -p $DEST && sudo chown $SSH_USER: $DEST && { command -v rsync >/dev/null || { sudo apt-get -qq update && sudo apt-get -y -qq install rsync; }; }"
run_expect rsync -az --delete \
  --exclude feedback-log.txt \
  -e "ssh -o StrictHostKeyChecking=accept-new" \
  "$STAGE/" "$SSH_USER@$HOST:$DEST/"

echo "== 3/4 systemd service"
run_expect ssh "$SSH_USER@$HOST" "
  sudo tee /etc/systemd/system/usecaselibrary.service >/dev/null <<'UNIT'
[Unit]
Description=Cato Use Case Library (static + feedback endpoint)
After=network.target

[Service]
ExecStart=/usr/bin/python3 $DEST/server.py --root $DEST --port $PORT
WorkingDirectory=$DEST
User=$SSH_USER
AmbientCapabilities=CAP_NET_BIND_SERVICE
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
UNIT
  sudo systemctl daemon-reload &&
  sudo systemctl enable --now usecaselibrary >/dev/null 2>&1 &&
  sudo systemctl restart usecaselibrary &&
  sleep 1 && systemctl is-active usecaselibrary"

echo "== 4/4 smoke test"
sleep 1
CODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "http://$HOST:$PORT/") || CODE=fail
PAGES=$(curl -s --max-time 10 "http://$HOST:$PORT/assets/js/catalog.js" | grep -c 'id: "' || true)
echo "   GET / -> $CODE; catalog entries served: $PAGES"
[ "$CODE" = "200" ] && echo "DEPLOY OK — http://$HOST:$PORT/" || { echo "DEPLOY FAILED"; exit 1; }
