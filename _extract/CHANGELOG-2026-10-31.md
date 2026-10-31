# Library improvement pass — change log (30–31 Oct 2026)

Scope requested: adopt the platform-overview diagram style across every page, add spotlight
context diagrams and placeholder captures, then make any improvements, updates or innovations that
lift the whole application. This log is appended as each stream lands; the final section is the
verification record.

## 1 · Diagram kit (new visual language for every diagram)
- **Source**: Tony's interactive platform overview (`cato-interactive-platform-overview_64.html`).
  Its drawing code is run headless at build time; nothing of it ships. `_extract/diagram-kit/make-kit-host.py`
  derives the (gitignored) kit host; `_extract/build-diagrams.py` renders `specs/<page>.js` into static SVG.
- **Spotlight section** on every page (`#platform`, "Where this sits in the Cato SASE platform"): the overview
  with the page's components lit, its flows animated and numbered step markers, plus the steps listed under it.
- **Redrawn diagrams**: every page's main diagram re-expressed in the kit (map-pin PoPs, backbone ring,
  clouds, icon tiles, verdict pills, five line styles); source figures reused where they tell the page's
  story (with exact-text corrections), custom drawings elsewhere; journeys keep five phases with stable geometry.
- **Build safety**: idempotent markers, auto-fitted labels (≤20% over), warnings for overflow/edge/unmatched
  edits, light + dark previews, `--check` wired into `verify.sh` step 4, `--catalogue` for all 34 source figures.
- **Decks**: diagram slide is now a 2× quantised picture of the page's kit diagram (`assets/js/deck-pics/<id>.js`,
  loaded on demand; ~170 KB each) — `extract-deck-diagrams.py` retired; `decktest.py` is `verify.sh` step 9.
- **Facts**: "80+ PoPs" → "100+ PoPs" on 4 pages + deck content (Cato pages, Oct 2026); STALENESS row updated.

## 2 · Capture placeholders
- Every `<!-- capture-wanted: … -->` marker now renders as a clearly labelled illustrative mock console
  (CMA section lit from the path, title/detail from the marker, skeleton widgets/rows; a device variant for
  Cato Client dialogs), with an italic caption saying a real capture will replace it. Stripped from the
  prospect edition (`build-prospect.py` removes the markers).

## 3 · Audit (10 lenses + completeness critic) → programme A01–A25
- Findings and the prioritised programme are kept in `_extract/diagram-kit/map/{audits.json,critic.md}`.
- Streams in progress are listed below as they land.

## 4 · Tooling stream (landed 31 Oct)
- `_extract/staleness-check.py` — parses STALENESS.md triggers, flags overdue rows and greps rot patterns
  (multi-line-safe, incl. SVG text/alt); warn-only stanza in `verify.sh` (`--strict` exits 1).
- `_extract/a11y-check.py` (Playwright: heading skips, th scope, link text, js hrefs, nested interactive, img dims,
  SVG titles, duplicate ids) and `_extract/checkfigures.py` (dims, lazy/eager, duplicate src, orphans, marker grammar) —
  reporting tools; wired into verify once the page sweeps clear their baselines.
- `_extract/check-deck-content.py` — UC_DECKS shape + README/catalog count assertions; `verify.sh` step 10/10.
- `_extract/whatsnew.py` rebuilt: skips regenerate commits, joins wrapped bullets, groups by month/week, category
  chips, auto-links page ids; `whatsnew.html` regenerated.
- `_extract/optimise-img.py` — 8-bit palette + downscale >1600 px with a small-text allow-list; applied to 24 files:
  assets/img 42.9 MB → 33.2 MB with no visible loss on the spot-checked captures.
- `_extract/research-briefs/platform-facts.md` — 2026 Gartner MQ (report 28 Jul 2026, Cato Leader 3rd year,
  Cloudflare sole Visionary), 4,800+ customers (27 Jul 2026 release), 100+ PoPs and 99.999% SLA (Cato backbone
  page, read in a real browser), EM Client minimums from the KB.
- Content: migration-cloudflare now cites the 2026 MQ and drops the un-restated ~400-customer figure; the last
  wrapped "80+ Cato PoPs" line fixed; STALENESS rows updated.
