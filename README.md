# Cato Networks — SASE Use Case Library

A self-contained, static HTML library of Cato Networks use cases for SE / partner enablement.
It replaces the PowerPoint decks in the numbered folders (which are kept as downloadable
sources and linked from each page).

## Using it

Open `index.html` in any browser — no server, build step or internet connection required
(external links to docs obviously need connectivity). Search and category filters are on the
home page. Each use-case page follows the same flow:

**Business objective → The challenge/risk → How Cato solves it (diagram) → Demo runbook → Talk track → Resources**

Every page has a Print/PDF button (print styles produce a clean handout) and, where one
exists, a download link to the original deck.

## Structure

```
index.html              Library home — search + category filtering
usecases/*.html         One page per use case (19)
assets/css/style.css    Design system (brand tokens, components, diagram animations)
assets/js/catalog.js    Use-case metadata — ADD NEW USE CASES HERE first
assets/js/app.js        Search/filter, TOC/scroll-spy, lightbox, pager
assets/img/             Screenshots & diagrams extracted from the original decks
1..4 - * use cases/     Original PowerPoint decks (sources, linked for download)
_extract/               Build tooling: deck text digests, image catalog, page-builder
                        guide (BUILD-GUIDE.md), screenshot + link-check scripts
```

## Adding a use case

1. Add an entry to `assets/js/catalog.js` (id, file, category, title, summary, tags, status, deck).
2. Copy an existing page in `usecases/` as a template — or follow `_extract/BUILD-GUIDE.md`,
   which documents the full page anatomy, design rules and SVG diagram conventions.
3. Set `<body data-uc="…">` to the catalog id — the TOC, pager and index card wire up automatically.
4. Check it: `python3 _extract/checklinks.py usecases/your-page.html` and
   `python3 _extract/shoot.py usecases/your-page.html /tmp/shot.png`.

## Status badges

- **Field-ready** — converted from a complete deck; demo flow verified against the source.
- **In development** — source deck was WIP; gaps are flagged on the page itself.
- **New** — created for this library (no source deck); review before first customer use.
