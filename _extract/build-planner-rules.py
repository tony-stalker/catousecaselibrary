#!/usr/bin/env python3
"""Assemble assets/js/planner-rules.js dimensions from an extraction run.

The phase spine and header are hand-maintained in planner-rules.js; this script only
rewrites the `dimensions: [...]` array, so edits to the spine survive a re-run.

Usage: build-planner-rules.py <dimensions.json>
  where dimensions.json is [{dimension, options:[{key,label,pages,phases,prereqs,risks,evidence}]}]
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RULES = ROOT / "assets" / "js" / "planner-rules.js"
CATALOG = ROOT / "assets" / "js" / "catalog.js"

ORDER = ["common", "wan", "sdwan-vendor", "proxy-sse", "firewall",
         "remote-access", "security-controls", "drivers"]


def js(s):
    return '"' + str(s).replace("\\", "\\\\").replace('"', '\\"') + '"'


def emit(dims, valid_ids, phase_keys):
    dims.sort(key=lambda d: ORDER.index(d["dimension"]) if d["dimension"] in ORDER else 99)
    out, dropped = [], []
    for d in dims:
        lines = ["    {", '      dimension: %s,' % js(d["dimension"]), "      options: ["]
        for o in d.get("options", []):
            pages = [p for p in o.get("pages", []) if p in valid_ids]
            dropped += [(o["key"], p) for p in o.get("pages", []) if p not in valid_ids]
            lines.append("        {")
            lines.append("          key: %s, label: %s," % (js(o["key"]), js(o["label"])))
            lines.append("          pages: [%s]," % ", ".join(js(p) for p in pages))
            phs = [p for p in o.get("phases", []) if p.get("phase") in phase_keys]
            dropped += [(o["key"], "phase:" + p.get("phase", "?"))
                        for p in o.get("phases", []) if p.get("phase") not in phase_keys]
            if phs:
                lines.append("          phases: [")
                for p in phs:
                    steps = ",\n            ".join(js(s) for s in p.get("steps", []))
                    lines.append("            { phase: %s, steps: [" % js(p["phase"]))
                    lines.append("            " + steps)
                    lines.append("            ] },")
                lines.append("          ],")
            for field in ("prereqs", "risks", "evidence"):
                vals = o.get(field) or []
                if vals:
                    lines.append("          %s: [" % field)
                    lines.append("            " + ",\n            ".join(js(v) for v in vals))
                    lines.append("          ],")
            lines.append("        },")
        lines.append("      ]")
        lines.append("    },")
        out.append("\n".join(lines))
    return "  dimensions: [\n" + "\n".join(out) + "\n  ]\n};\n", dropped


def main():
    data = json.loads(Path(sys.argv[1]).read_text())
    valid_ids = set(re.findall(r'id: "([^"]+)"', CATALOG.read_text()))
    src = RULES.read_text()
    phase_keys = set(re.findall(r'key:\s*"([^"]+)",\s*\n?\s*title:', src))

    body, dropped = emit(data, valid_ids, phase_keys)
    head = src.split("  dimensions:")[0]
    RULES.write_text(head + body)

    n_opt = sum(len(d.get("options", [])) for d in data)
    print("planner-rules.js: %d dimensions / %d options" % (len(data), n_opt))
    if dropped:
        print("dropped %d invalid references:" % len(dropped))
        for k, p in sorted(set(dropped)):
            print("  %s -> %s" % (k, p))


if __name__ == "__main__":
    main()
