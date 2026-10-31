# Page Builder Guide — Cato Use Case Library

You are building ONE page of a static HTML use-case library for Cato Networks sales engineers.
The library lives at `/Users/tonystalker/Documents/claude/usecaselibrary/`. It must work when
opened from `file://` — no CDNs, no webfonts, no fetch(). All shared CSS/JS already exists.

## Read these first (in this order)
1. `usecases/access-third-party.html` — THE EXEMPLAR. Your page must match its structure,
   head block, topnav, hero, TOC, section anatomy, pager, footer and script includes exactly
   (adjusting content, ids and relative deck links).
2. `assets/js/catalog.js` — find YOUR page's entry: use its exact `id` (→ `<body data-uc="...">`),
   `file`, `title`, `summary` (hero lede can expand on it), `tags`, `status`, `added`, `deck`.
   - `status` is `"ready"` (demo runbook complete; captures, if any, from the demo tenant) or
     `"wip"` (source incomplete — the page must flag its gaps). Never write `"new"`.
   - `added` is the page's first-commit date, `"YYYY-MM-DD"`. For a brand-new page put today's
     date; after the first commit it can be confirmed with
     `git log --diff-filter=A --format=%as -- usecases/«id».html | tail -1`.
   - The **90-day rule**: app.js derives the blue "New" badge from `added` (≤ 90 days old) on
     index cards and in the hero, then falls back to `status`. The hero may be authored with
     `badge-new` "New" for a fresh page — app.js swaps it for the status badge at runtime once
     the page ages out, so the HTML is only the no-JS fallback.
3. `assets/css/style.css` — the class inventory. Use ONLY classes that exist there.
4. `_extract/image-catalog.md` — descriptions of available screenshots/diagrams in `assets/img/`.

## Page anatomy (same order as exemplar)
- `<head>`: title "«Title» — Cato Use Case Library", description = catalog summary, then the
  dark-mode boot snippet on ONE line immediately before the stylesheet link (copy verbatim):
  `<script>try{var t=localStorage.getItem("uc-theme");if(!t&&window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches)t="dark";if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>`,
  stylesheet `../assets/css/style.css`, the same inline SVG favicon.
- `.topnav` with breadcrumb: `/ <a href="../index.html#cat-«category»">«Category»</a> / «Short name»`.
- `.hero`: category chip (`chip-cat-access|management|network|security|ai-security|migration` —
  the class and `#cat-…` anchor use the category lowercased with spaces → dashes), status badge
  (`badge-ready` "Field-ready" | `badge-wip` "In development" | `badge-new` "New" — the last
  only while the catalog `added` date is within 90 days; see the status notes above), h1, `.lede`
  (2–4 sentences: the problem + what this use case demonstrates), tag row, button row.
  - If catalog `deck` is non-null: `<a class="btn btn-ghost" href="../«URL-ENCODED deck path»" download>⬇ Original deck (PPTX)</a>`
    (encode spaces as %20). Always include the `🖨 Print / PDF` button.
- `.main.with-toc` → `aside.toc` (empty `#toc-links`, JS fills it) + `<main>` of `<section id class="reveal">`.
- Sections, each with `.section-kicker` + `h2`. Typical flow (adapt, don't force):
  1. `id="objective"` — Business objective / why this matters.
  2. A challenge/risk section — stat tiles (`.stat-row > .stat-tile`) and/or cards. Add a
     `.callout.risk` or `.callout.warn` "Discovery question" where natural.
  3. `id="solution"` — How Cato solves it: prose + **one custom inline SVG diagram** (see below)
     + `.grid-2` of `.benefit` blocks (icon = a single emoji in `.b-icon`).
  4. `id="demo"` — Demo runbook: `<ol class="steps">`, each `<li>` with `h4`, optional
     `<span class="path">Menu → Path</span>` CMA navigation chip, brief body. 4–8 steps.
  5. Optional `id="pov"` — PoV runbook section directly after the demo section; when both
     exist app.js renders them as Demo/PoV tabs. Contract and content anatomy:
     `_extract/POV-GUIDE.md`.
  6. Optional `id="talk-track"` — narrative card (only if source notes have one).
  7. `id="resources"` — `.grid-2` cards: "Documentation" (allowed URLs only, below) and
     "In this library" (2–3 related pages from catalog.js, relative hrefs like `security-ai.html`).
- `<nav class="pager" id="pager">` (empty — JS fills), footer, then:
  `<script src="../assets/js/catalog.js"></script><script src="../assets/js/platform-facts.js"></script><script src="../assets/js/app.js"></script>`
  (`platform-facts.js` must load before `app.js`; app.js no-ops without it, so older pages
  that lack the include still render.)

## Platform facts (`assets/js/platform-facts.js` — single source, Oct 2026)
Headline platform numbers (PoP count, backbone SLA, customer count, Gartner MQ position) live
ONLY in `assets/js/platform-facts.js` as `window.UC_FACTS`, each with its source URL and check
date. Never type them as bare literals. Reference a fact by wrapping the current value in an
element carrying `data-fact="«key»"`; app.js replaces that element's text at load and the authored
value is the no-JS fallback:
- prose / figcaption: `… across <span data-fact="pops">100+</span> PoPs …`
- SVG diagram text: `<text class="dg-sub" …><tspan data-fact="pops">100+</tspan> PoPs</text>`
  (wrap only the number so label-fit rules still hold; the rest of the sentence stays literal).
- stat tile: `<div class="stat-value" data-fact="backboneSla">99.999%</div>`
Keys: `pops`, `backboneSla`, `customers`, `mq` (full MQ line), `mqShort`, `mqCitation` (the
Gartner citation line — add it wherever `mq` is quoted), `asOfLabel` (e.g. "30 Oct 2026").
`alt=""` text cannot carry an attribute hook — write the alt from the figure's purpose rather than
a number. The file ships unchanged in the prospect edition. Index carries the "Platform at a
glance" strip (`.facts-strip`); use-case pages do not repeat it.

## Index URL state & linking into the library (app.js, Oct 2026)
The index mirrors its filters into the query string with `history.replaceState` and restores them
on load, `popstate` and `hashchange`, so any filtered view is a shareable link:
- `index.html?q=«text»` — search box text (also what a clicked card tag sets);
  `&cat=«Category»` (exact catalog category, e.g. `AI%20Security`); `&vert=«Vertical»`.
  Empty values are omitted; unknown values fall back to All.
- `index.html#cat-«slug»` (slug = category lowercased, spaces → dashes) selects that category
  filter AND scrolls to its heading — the breadcrumb `../index.html#cat-«category»` and the index
  topnav links rely on this. The index rewrites the hash to `?cat=…` once applied.
- `index.html?focus=search` focuses the search box (then drops the param). The `/` key does this
  from any page: on index it focuses `#uc-search`; on use-case pages it follows the `.topnav a.brand`
  href (`../index.html`) with `?focus=search` — keep the brand link pointing at index.
- Search v2 (A11, index only): app.js tokenises the query (`[a-z0-9-]` words, same grammar as
  `build-search.py`), prefix-matches each token against title / tags / summary / category and the
  page's sorted word list in `search-index.js`, requires every token to hit, and scores
  title ×6 · tags ×4 · summary ×2 · category ×2 · body ×1 (+4 when the query equals a tag exactly).
  With a query the index renders ONE flat `.uc-results` grid under `h2#search-results` sorted by
  score, with `<mark>` in title/summary, `.tag-hit` on matching tags and a `.uc-matched` line;
  without a query the per-category sections (`h2#cat-«slug»`) render as before. Filter buttons
  carry a `.btn-count` hit count while a query is active; the empty state (`.uc-empty`) offers the
  six most frequent catalog tags as `button.tag`. `assets/js/search-synonyms.js` (`window.UC_SYNONYMS`,
  loaded before app.js on index only) expands a token or phrase to its group at half weight — add a
  group when SEs type a term differently from how pages spell it; avoid words common to most pages.
  Catalog `title`, `summary` and `tags` are therefore ranking signals: put the terms an SE would type
  in the tags, not only in the body.
- Search box: `.search-wrap > input#uc-search + button.search-clear` (× appears when the query is
  non-empty; Esc also clears). app.js wraps a bare `#uc-search` at runtime, so older markup works.
- Link into a filtered view from a page with a relative href such as
  `../index.html?q=ZTNA` or `../index.html?cat=Security&vert=Finance`.
Each render still dispatches `uc:cards-rendered` on `document` (deck-export.js re-injects its
card buttons on it). The prospect build needs no change: everything lives in app.js / style.css.

## Index layout: folds, sticky filter dock, Start-here cards (A13, Oct 2026)
- **Folds.** "Start here" and "Build a demo presentation" are `<details class="fold" data-fold="«key»">`
  blocks (`start-here`, `deck-builder`) whose `<summary class="category-h fold-h">` holds the `h2`,
  a `.cat-count` and an empty `.fold-state` pill (CSS draws Show/Hide). app.js `initFolds` stores the
  reader's choice as `localStorage["uc-fold:«key»"]` = `"1"`/`"0"`, written only on a summary click
  (Enter/Space included). With nothing stored a fold is open on the first visit and closed on later
  ones (`uc-visited`), except that the deck fold stays open while `uc-deck-selection` holds ids.
  A hash or in-page link that targets something inside a closed fold (`#start-here`, `#deck-builder`)
  opens it without storing a preference. To add a fold, copy the markup and pick a new `data-fold` key.
- **Deck-builder injection point.** deck-export.js `wireIndexBuilder` inserts `#deck-builder` after
  the FIRST `.grid-2` in the document (`grid.parentNode.insertBefore(card, grid.nextSibling)`). On the
  index that is the empty `div.grid-2.deck-slot[hidden]` inside `#deck-fold`, so the builder lands in
  its fold. Keep the Start-here grid `.grid-3.start-grid` (never `.grid-2`) and keep no other
  `.grid-2` above the deck fold. The fold summary mirrors the builder's "n selected" count
  (`.deck-fold-count`), and the fold hides itself when no builder was injected.
- **Start-here cards** are `div.card.start-card > h3 + p.start-lede + ol` (no inline styles). Six cards
  fill a 3 × 2 grid (2 columns at 821–1100px, 1 below). A card for SE-only material carries
  `data-se-only`: build-prospect.py drops those cards ("Running a first demo?", "Running a PoV?") and
  the whole `#deck-fold`, and rewrites "six guided journeys" → "four". CSS lays four cards out 2 × 2.
  Update the `.cat-count` text (and the prospect replacement) when you add or remove a card.
- **Filter dock.** `#filter-dock` wraps the search `.filter-bar`, `#vertical-bar` and `#result-count`.
  It is `position: sticky` under the topnav (`--dock-top`), with a zero-height `.filter-sentinel`
  just above it. When stuck, `initFilterDock` adds `.is-stuck` (compact single rows; the chip strips
  scroll sideways and keep the active chip in view). Under 640px the index topnav stops being sticky,
  the dock sticks at 0 and the vertical row hides while stuck. Category headings get
  `scroll-margin-top` from `--dock-h`. A filter or search change made while stuck scrolls back to the
  top of the results. app.js creates the sentinel itself if the markup lacks it.

## Keyboard & dialogs: runbook tabs, lightbox, phase player (A16, Oct 2026)
All of this is runtime behaviour in app.js / style.css; pages need no new markup. Keep to the shapes below
so it keeps working.
- **Runbook tabs.** A page with both `section#demo` and `section#pov` gets an injected `.rb-tabs` tablist:
  buttons `#rb-tab-demo` / `#rb-tab-pov` with `aria-controls`, the sections become `role="tabpanel"`
  (`aria-labelledby`, `tabindex="0"`). ArrowLeft/Right cycle, Home/End jump. The choice is remembered
  library-wide in `localStorage["uc-rb-tab"]`; a hash pointing at either section, or at any id inside
  one (`#pov`, `#pov-criteria`), wins on load, on `hashchange` and on in-page link clicks. Keep both
  section ids exactly `demo` / `pov`; ids inside them must be unique on the page.
- **Lightbox.** Openers are every `figure.shot img` and every `.diagram-card` that holds an `<svg>`
  (not phase players). Each becomes a Tab stop (`tabindex="0"` on the img, or on the card's first svg,
  described by a shared hidden "Press Enter to enlarge." hint) and opens on click, Enter or Space. The
  dialog is modal (`aria-modal`, named from the img `alt` or the svg `<title>`), with a visible × that
  takes focus, Esc / backdrop close, Tab trapped, page scroll locked, and focus returned to the item last
  shown. ArrowLeft/Right and ‹ › step through the openers visible on the page ("n / N"; a hidden tab's
  are skipped). Screenshots larger than the screen get a **1:1** toggle (or click the image) and pan by
  scrolling. **Caption sources**, first match wins: the `figcaption` of the screenshot's `figure`; for a
  diagram a `.diagram-caption` / `figcaption` inside the card, then one as the card's next sibling, then
  the `figcaption` of a `<figure>` that wraps the card, then a following `ol.spot-steps` (spotlight, shown
  as a numbered list). So write every screenshot with a `figcaption`, and give every diagram a caption in
  one of those places; the alt / `<title>` should name the picture, the caption say what to look at.
- **Phase player.** `.phase-player[data-autoplay="«ms»"]` autoplays only on screen and never under
  `prefers-reduced-motion` (the ▶/❚❚ button is hidden then, and when there is no `data-autoplay`). The
  button is a toggle, `aria-label="Pause autoplay"` + `aria-pressed` (true = paused); a pause is stored
  per page and player in `localStorage["uc-phase-paused:«page-id»:«n»"]` and survives scrolling and
  reloads until play is pressed. Dots carry `aria-pressed` on the shown phase; stepping by dot, ‹ ›, the
  arrow keys or Home/End halts autoplay for the rest of the visit without storing it. The player's
  accessible name is its section's `h2`, so keep the player inside a `section` with a heading.
- **Feedback dialog** (hosted mode): `role="dialog"`, `aria-modal`, labelled by its heading, Tab trapped,
  Esc / Cancel / backdrop close, page scroll locked, focus back on the button that opened it.
- `.sr-only` is available in style.css for visually hidden text.

## Page reading aids, pager, related strip & print (A25, Oct 2026)
All runtime in app.js (`initToc`, `initPage`, `initRelated`, `initReadingAids`) and style.css; the page
skeleton is unchanged (`aside.toc > .toc-title + #toc-links`, empty `nav#pager`, `footer.footer`).
- **TOC labels.** Each `main section[id]` with an `h2` gets a link. The label is `h2[data-toc]` (or
  `section[data-toc]`) when present, else the h2 text; a text longer than 42 chars is cut at a word
  boundary with "…" and the full heading goes in the link's `title`. Give an h2 longer than ~40 chars a
  short `data-toc="…"` (2–5 words, e.g. `<h2 data-toc="SWG policy">URL filtering, web security …</h2>`).
- **TOC on narrow screens.** app.js wraps the links in `details.toc-details` (the `.toc-title` div becomes
  its `summary`). Above 900px it is held open and the summary is inert; at ≤ 900px `aside.toc` gets
  `.toc-collapsible` and becomes a sticky bar under the topnav (`--toc-top` = topnav height) reading
  "On this page · «current section»"; it opens as a list and closes on a link click or Esc. Without JS the
  TOC stays hidden below 900px as before. Scroll-spy is an IntersectionObserver band (20–35% from the top;
  first section in document order wins; the last section lights at the page bottom); the current link
  carries `.active` + `aria-current="location"`.
- **Pager** is category-scoped in catalog order and does not wrap: `← Previous | n of N in «Category» |
  Next →`; the middle links to `../index.html?cat=«Category»`, and an end gets an empty `.pager-gap`.
  Catalog order within a category is therefore the reading order — insert new entries where they belong.
- **Related pages** (`aside.related-strip`, inserted before `footer.footer`): up to 4 `a.uc-card.uc-card-mini`
  scored shared tags ×2 + same category ×1 + same vertical ×3; the vendor playbook ↔ policy deep-dive pair
  (`migration-x` / `migration-x-policy`) always leads; the two pager neighbours are skipped; Platform Demo
  pages are suggested only from Platform Demo pages. Catalog `tags` drive it, so tag precisely. Keep the
  hand-written "In this library" card in `#resources` for curated links; the strip is the automatic
  complement. deck-export.js only decorates cards inside `#uc-sections`, so these cards get no **+**.
- **Read progress / back to top.** `.read-progress` (3px, fixed at the top edge, `aria-hidden`) and a
  `button.to-top` ("↑ Top", bottom-left, shown past 600px scroll, moves focus to the h1; lifts above an open
  deck tray at ≤ 480px). The footer gets bottom padding (`body.has-reading-aids`) so the button never covers it.
- **Print.** Hidden: topnav, TOC, pager, buttons, progress bar, top button, deck tray, related strip. Both
  runbooks print (the PoV starts on a new page when tabs were active). A print-only `.print-header`
  ("Cato Use Case Library · «Category» · «Title»", date from its `data-printed` attribute, refreshed on
  `beforeprint`) tops page 1; a no-JS print shows the library name from `body[data-uc]::before`.
  `@page` margin 14mm; sections may break (only cards, steps, figures, callouts, stat rows, diagrams stay
  whole); tables split between rows with a repeated header; external links in `#resources` print their URL;
  `beforeprint` switches lazy images to eager. To check: Playwright `page.emulate_media(media="print")`
  then `page.pdf()`.

## Colour contrast & focus (A17, Oct 2026)
- **Text tokens:** body/caption text ≥ 4.5:1, large text and non-text indicators (focus rings,
  semantic borders) ≥ 3:1, in light AND dark. Current figures: `--ink-3` #5e6c66 is 5.05:1 on
  `--page` / 5.39:1 on `--surface` (dark #7e948c 5.36 / 4.75); `--green-700` is the colour for small
  green text (`.section-kicker`, `.deck-picker-cat`, links) at 5.7:1. `--green-600` (#0e8a6d, the brand
  green) is an accent/fill and ring colour only, never small text: it is 3.95:1 on `--page`.
- **Filled buttons/badges:** white on `--green-600` is only 4.31:1, so light `.btn-primary`,
  `.deck-tray-go` and the placeholder `.ph-badge` fill with `--green-700` (hover `--green-800`).
  In dark mode the fill is `--green-600` with dark ink `#04231b` (7.1:1); never white on the dark greens.
- **Focus:** a global `:focus-visible` ring (2px `--green-600`, offset 2px) covers every control;
  on navy surfaces (`.topnav`, `.hero`, `.deck-tray`, `.lightbox`, `.shot-frame`) it switches to mint
  `#7ee0bf`. A component may restyle the ring but must never set `outline: none` unless the same
  element has its own visible `:focus-visible` style. The diagram kit's generated `outline:none`
  on hotspot groups is paired by `.x-*:focus-visible` rules just above the `dg-kit:start` marker.
- **Dark-mode screenshots** keep their white background but are dimmed (`brightness(.92)`) so
  captures do not glare; the lightbox shows them undimmed.
- `.callout.warn` uses a darker amber bar (#b87400, 3.5:1) than `--status-warn`, which stays the
  reserved status colour for fills.
- To recheck after a token change: compute the WCAG ratio for each pair above (both themes);
  the A17 table lives in the A17 change notes and the planned `_extract/a11y-check.py` (A22).

## Design rules
- UK English (organisation, utilise, licence). Confident SE-to-SE tone: crisp, concrete, no fluff.
- Never invent statistics. Numbers must come from your content brief / digest. Real breach
  examples and CVE stats from the digests are fine.
- Screenshots: `figure.shot > img + figcaption`. `src="../assets/img/«name».png"`, meaningful
  `alt` written from image-catalog.md. Only embed images the catalog marks embed-worthy AND
  that belong to your topic.
- Tables: `.table-wrap > table.data`. Numeric columns get `class="num"`.
- Stat tiles: value in `.stat-value` (unit in `<span class="unit">`), label in `.stat-label`.
  Use `stat-bad` (red) for risk/cost numbers, `stat-good` (green) for outcomes.
- Do NOT add `<style>` blocks except ≤10 lines of page-specific tweaks if truly needed.
  Inline `style=""` only for the small spacing tweaks the exemplar itself uses.

## The SVG diagram (required — every page gets one custom diagram)
Inline `<svg viewBox="0 0 960 4xx" role="img" aria-labelledby="dg1-title dg1-desc">` inside a
`.diagram-card`, with `<title>`/`<desc>`, followed by `.dg-legend` (if flow lanes are used) and
`.diagram-caption`. Copy the exemplar's technique:
- Nodes: `rect.dg-node` (light) / `.dg-node-dark` / `.dg-node-green`, rx="10".
- Text: `.dg-label` (14.5px bold), `.dg-sub` (12.5px), `.dg-tiny` (11px) — never fill text with
  lane colors. For text inside dark nodes use `.dg-label-inv`/`.dg-sub-inv`.
- Topology-style diagrams (the planner and the animated journey pages) use the newer HLD
  palette instead: `rect.pt-plain/.pt-green/.pt-navy/.pt-amber/.pt-purple/.pt-bluedash`
  (green = Cato/migrated, navy = incumbent, amber = being displaced, purple = internet/SaaS,
  dashed blue = identity & telemetry), coloured bold titles `.pt-t-ink/.pt-t-green/.pt-t-amber/
  .pt-t-purple/.pt-t-blue` (`.pt-t-inv` inside navy), subs `.pt-sub`/`.pt-sub-inv`, chips
  `.pt-chip` + `.pt-chip-t`, PoP rings `.pt-pop`. Dark overrides live beside the dg- ones in
  style.css. Ordinary use-case architecture diagrams may keep the dg- classes.
- LABELS MUST FIT: keep node labels ≤ ~22 chars for a 170-wide rect (sub ≤ ~24, tiny ≤ ~28);
  shorten the words, never shrink the font. Keep centred text ≥ half its width away from the
  viewBox edges. After shooting, also run `python3 _extract/measure_svg.py` — your page must
  produce no EDGE lines and no BOX overflow > 4px.
- Cato PoP: `circle.dg-pop` (r≈30) + optional `circle.pulse-ring` behind it; backbone as
  `ellipse.dg-backbone` or a chain of PoP circles.
- Depth comes from the stylesheet, not the markup (Sep 2026): node classes carry CSS
  `filter: drop-shadow` via the `--dg-shadow*` tokens, PoP rings glow (`--dg-glow`) and have
  a filled core (`--dg-pop-core` — never put text inside the ring), the backbone ellipse is
  tinted (`--dg-backbone-fill`), and the `<svg>` sits on a dot-grid canvas (`--dg-canvas`,
  `--dg-dot`). Do not add inline filters/gradients per diagram; light and dark values of
  every token live in style.css.
- Flows: `path.lane.lane-allow|lane-limit|lane-block|lane-info` (animated marching dashes;
  green=allowed, amber=restricted, red=blocked/attack, dark blue=telemetry/alert flows to
  SOC/monitoring — legend swatch `.swatch.info`) and `.lane-static` for neutral links.
  Blocked flows terminate at an X: two crossed `path.lane-x` strokes ~24px.
- Keep it uncluttered: ≤ 12 nodes, generous spacing, no text overlapping shapes. Text labels
  go OUTSIDE circles/next to nodes (see exemplar's PoP labels above the ring).
- Diagrams describe THIS use case (e.g. migration = Bristol socket + London DC socket/firewall
  + Leeds on MPLS coexisting; IPS = user + attacker → dedicated IP at PoP → RPF to on-prem).

## Charts (only if your brief includes numeric series)
Prefer stat tiles. If you must draw a bar comparison, build it as a simple SVG with
`var(--series-1)`..`var(--series-5)` fills IN ORDER (never skip/cycle), 4px rounded top corners
on bars, direct value labels in ink (never series-colored text), no dual axes, hairline
gridlines `var(--hairline)` only.

## Example environment details (use for believable examples — a UK-flavoured demo estate; keep pages generic, never reference a specific account)
Sites (generic archetypes — never reference a specific account): London DC (X1500 datacentre
socket) · Manchester DC (X1700) · HQ lab (X1500) · Bristol Office / Glasgow / Madrid Office
branches (X1500/X1600) · an X1600 LTE site · AWS eu-west-2 vSocket (HA) · Azure-UKS-Hub-vSocket ·
an Azure vWAN hub (IPsec) · aws-sydney-ipsec · a Cloud Interconnect site.
PoPs in use: London, Manchester, Dublin, Frankfurt, Tel Aviv, Dubai, Johannesburg, Sydney.
Example users: use first-name-only fictional users (e.g. "Priya", "Marcus") — EXCEPT the DLP
screenshot which shows its own user; describe what the screenshot shows.

## CMA navigation paths (for `.path` chips — use these or paths from your source digest)
Monitor → Topology / Events / App Analytics / Threats Dashboard / Data Protection Dashboard /
Cloud Apps Dashboard / Experience Monitoring · Network → Sites / Network Rules / Bandwidth
Management · Security → WAN Firewall / LAN Firewall (global policy, scoped per site/VLAN, enforced
on the Socket) / Internet Firewall / IPS / Anti-Malware / CASB / DLP
Configuration / TLS Inspection · Access → Client Connectivity Policy / Device Posture / Users ·
Assets → Device Inventory · Administration → API & Integrations / Audit Trail

## Allowed external URLs (do not invent others; omit rather than guess)
- Platform pages: https://www.catonetworks.com/platform/{architecture, cato-management-application-cma,
  universal-zero-trust-network-access-ztna, data-loss-prevention-dlp, cloud-access-security-broker-casb,
  extended-detection-and-response-xdr}/ · https://www.catonetworks.com/solutions/next-generation-firewall/
  · https://www.catonetworks.com/services/ · https://www.catonetworks.com/security-compliance-and-privacy/
  · https://www.catonetworks.com/rapid-cve-mitigation/
- KB: https://support.catonetworks.com (root) and any support.catonetworks.com URL that appears
  verbatim in your source digest. Docs: any https://knowledge.catonetworks.com/docs/... URL you
  have actually fetched and verified (link the page URL, not the raw .md variant).
- Dev: https://api.catonetworks.com/documentation/ · https://github.com/catonetworks/cato-cli ·
  https://registry.terraform.io/providers/catonetworks/cato/latest
- Any URL quoted in your digest file.

## Self-check before you finish (mandatory)
1. Run: `cd /Users/tonystalker/Documents/claude/usecaselibrary && python3 _extract/shoot.py usecases/«your-page».html _extract/shot-«your-id».png`
   (it prints console errors — there must be none).
2. Read the screenshot (crop with PIL into ~1800px-tall bands if long) and LOOK at it:
   no overlapping SVG text, no broken images, diagram legible, sections all present.
3. Verify every local href/src you wrote exists on disk (deck paths, images, related pages —
   related pages may not exist yet; that's fine, they're being built in parallel — check the
   filename against catalog.js instead).
4. Fix what you find, re-shoot, then finish.

Your final message: 5-10 lines — what you built, which images/diagram you used, any content
gaps you flagged on the page, self-check result.
