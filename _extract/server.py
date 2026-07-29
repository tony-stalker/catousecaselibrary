#!/usr/bin/env python3
"""Cato Use Case Library — hosting server (stdlib only, no dependencies).

Serves the static library AND records feedback from the in-page
"Report bug" / "Feedback" buttons (app.js initFeedback):

    POST /api/feedback  {"type":"bug|feedback","name":"...","message":"...","page":"..."}

Appends one line per submission to feedback-log.txt in the web root:
    2026-07-29T12:34:56Z | BUG | Priya Shah | /usecases/network-sdwan.html | message...
Name and message are mandatory (enforced server-side too, so reports are
always traceable to a person). feedback-log.txt and server.py are never
served over HTTP.

Usage:  python3 server.py --root /srv/usecaselibrary --port 80
Deployed by _extract/deploy.sh as the systemd unit `usecaselibrary`.
"""
import argparse
import json
import re
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

MAX_BODY = 16384
BLOCKED = {"feedback-log.txt", "server.py"}


def build_handler(root: Path):
    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *a, **kw):
            super().__init__(*a, directory=str(root), **kw)

        def do_GET(self):
            name = self.path.split("?", 1)[0].rstrip("/").rsplit("/", 1)[-1]
            if name in BLOCKED:
                self.send_error(403, "Not served")
                return
            super().do_GET()

        do_HEAD = do_GET

        def do_POST(self):
            if self.path.split("?", 1)[0] != "/api/feedback":
                self.send_error(404)
                return
            try:
                length = min(int(self.headers.get("Content-Length", 0)), MAX_BODY + 1)
                if length <= 0 or length > MAX_BODY:
                    raise ValueError("bad length")
                data = json.loads(self.rfile.read(length))
                kind = "BUG" if data.get("type") == "bug" else "FEEDBACK"
                name = str(data.get("name", "")).strip()[:80]
                message = str(data.get("message", "")).strip()[:4000]
                page = str(data.get("page", ""))[:200]
                if not name or not message:
                    self.send_error(400, "name and message are required")
                    return
                clean = lambda s: re.sub(r"[\r\n|]+", " ", s).strip()
                stamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
                line = f"{stamp} | {kind} | {clean(name)} | {clean(page)} | {clean(message)}\n"
                with open(root / "feedback-log.txt", "a", encoding="utf-8") as f:
                    f.write(line)
                self.send_response(204)
                self.end_headers()
            except Exception:
                self.send_error(400, "bad request")

        def log_message(self, fmt, *args):  # quiet: only errors matter under systemd
            if args and str(args[-2:-1]) not in ("('200',)", "('204',)", "('304',)"):
                super().log_message(fmt, *args)

    return Handler


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=".", help="web root (the library directory)")
    ap.add_argument("--port", type=int, default=8080)
    ap.add_argument("--bind", default="0.0.0.0")
    args = ap.parse_args()
    root = Path(args.root).resolve()
    srv = ThreadingHTTPServer((args.bind, args.port), build_handler(root))
    print(f"serving {root} on {args.bind}:{args.port}", flush=True)
    srv.serve_forever()


if __name__ == "__main__":
    main()
