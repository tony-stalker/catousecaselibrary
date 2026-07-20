#!/usr/bin/env python3
"""Derive the prospect-facing edition of the library.
Usage: python3 _extract/build-prospect.py    (from the SE library root)

Single-source model: the SE library is the master. This script regenerates
../catoprospectlibrary/ from it on every run — never hand-edit the output.
Prospect-specific wording lives in the RULES below so it survives rebuilds.

Transforms:
  - removes <section id="demo"> and <section id="talk-track"> from every page
  - removes deck download buttons; ships NO PowerPoint files
  - excludes whatsnew.html and its nav link (internal change history)
  - rewords SE-facing phrases to prospect-facing (rules below)
  - prospect footer + README
"""
import re
import shutil
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent
OUT = SRC.parent / "catoprospectlibrary"

# ---- wording rules (SE voice -> prospect voice); applied to pages, index and catalog.js
PHRASES = [
    ("step-by-step demo runbook", "practical walkthrough"),
    ("demo runbook", "walkthrough"),
    ("Demo runbook", "Walkthrough"),
    ("How to run the demo", "How it works in practice"),
    ("Discovery questions", "Questions worth asking"),
    ("Discovery question", "Ask yourself"),
    ("field library of Cato Networks use cases for sales engineers and partners",
     "library of Cato Networks use cases for teams evaluating SASE"),
    ("with diagrams, CMA screenshots and talk tracks. Converted from, and replacing, the original\n      PowerPoint decks.",
     "with architecture diagrams and real console views throughout."),
    ("Cato Networks — internal SE / partner enablement. Demo walkthroughs use example data from a demo tenant.",
     "Prepared for prospective customers. Walkthroughs use example data from a demonstration environment."),
    ("authored from research, not a delivery-verified runbook — review with Cato PS before customer use",
     "an indicative approach based on published documentation — your Cato team will tailor it with you"),
    ("not a delivery-verified runbook — review with Cato PS before customer use",
     "an indicative approach — your Cato team will tailor it with you"),
    ("review with Cato PS before customer use", "your Cato team will tailor this with you"),
    ("Review it with Cato PS", "Your Cato team will refine this with you"),
    ("review with Cato PS", "refined with your Cato team"),
    ("validate with Cato PS", "validated with your Cato team"),
    ("scope with PS", "scope with your Cato team"),
    ("Field-ready — demo verified", "Field-proven"),
    ("The source deck (<em>AI_Security-Use_Cases.pptx</em>) is explicitly marked work-in-progress,",
     "The source material behind this page is still evolving,"),
    ("one demo-tenant user", "one example user"),
    ("before customer use", "before deployment"),
    ("Review with Cato PS before deployment", "Refined with Cato before deployment"),
    ("your demo tenant", "a demonstration environment"),
    ("the demo tenant", "a demonstration environment"),
    ("demo tenant", "demonstration environment"),
]

SECTION_RE = re.compile(
    r'\n?[ \t]*<section id="(?:demo|talk-track)"[^>]*>.*?</section>\n?', re.DOTALL)
DECK_BTN_RE = re.compile(
    r'\n?[ \t]*<a class="btn btn-ghost" href="[^"]*\.pptx"[^>]*>[^<]*</a>')
WHATSNEW_LINK_RE = re.compile(r'\n?[ \t]*<a class="nav-link" href="whatsnew.html">[^<]*</a>')

def transform(text: str) -> str:
    text = SECTION_RE.sub("\n", text)
    text = DECK_BTN_RE.sub("", text)
    text = WHATSNEW_LINK_RE.sub("", text)
    for old, new in PHRASES:
        text = text.replace(old, new)
    return text

def main():
    if OUT.exists():
        for item in OUT.iterdir():
            if item.name == ".git":
                continue  # preserve the prospect repo's git history
            shutil.rmtree(item) if item.is_dir() else item.unlink()
    OUT.mkdir(exist_ok=True)

    # pages
    (OUT / "usecases").mkdir()
    n = 0
    for page in sorted((SRC / "usecases").glob("*.html")):
        (OUT / "usecases" / page.name).write_text(transform(page.read_text()))
        n += 1
    (OUT / "index.html").write_text(transform((SRC / "index.html").read_text()))

    # assets (css/js/img) — catalog.js gets the wording pass too
    shutil.copytree(SRC / "assets", OUT / "assets")
    cat = OUT / "assets" / "js" / "catalog.js"
    cat_src = re.sub(r'deck: "[^"]*"', "deck: null", transform(cat.read_text()))
    cat.write_text(cat_src)

    (OUT / "README.md").write_text(
        "# Cato SASE Use Case Library — Prospect Edition\n\n"
        "A self-contained library of Cato Networks use cases for teams evaluating SASE.\n"
        "Open `index.html` in any browser — fully offline, no installation.\n\n"
        "> GENERATED RESOURCE — do not edit by hand. This edition is derived from the\n"
        "> internal master library by `_extract/build-prospect.py`; all changes are made\n"
        "> there and regenerated. Wording rules live in the generator.\n")
    (OUT / ".gitignore").write_text(".DS_Store\n")
    print(f"prospect edition generated: {n} pages + index + assets -> {OUT}")

if __name__ == "__main__":
    main()
