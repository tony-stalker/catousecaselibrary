"""Resolve the Playwright headless-shell Chromium portably.

Order: $PLANNER_CHROMIUM, newest cached headless shell (macOS then Linux
cache layout), else let Playwright resolve its own install.
"""
import os
from pathlib import Path


def find_chromium():
    env = os.environ.get("PLANNER_CHROMIUM")
    if env and Path(env).exists():
        return env
    for base in (Path.home() / "Library/Caches/ms-playwright",
                 Path.home() / ".cache/ms-playwright"):
        hits = sorted(base.glob(
            "chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell"))
        if hits:
            return str(hits[-1])
    return None


def launch(p, **kwargs):
    exe = find_chromium()
    if exe:
        return p.chromium.launch(executable_path=exe, **kwargs)
    return p.chromium.launch(**kwargs)
