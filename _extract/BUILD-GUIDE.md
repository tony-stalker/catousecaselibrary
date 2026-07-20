# Page Builder Guide — Cato Use Case Library

You are building ONE page of a static HTML use-case library for Cato Networks sales engineers.
The library lives at `/Users/tonystalker/Documents/claude/usecaselibrary/`. It must work when
opened from `file://` — no CDNs, no webfonts, no fetch(). All shared CSS/JS already exists.

## Read these first (in this order)
1. `usecases/access-third-party.html` — THE EXEMPLAR. Your page must match its structure,
   head block, topnav, hero, TOC, section anatomy, pager, footer and script includes exactly
   (adjusting content, ids and relative deck links).
2. `assets/js/catalog.js` — find YOUR page's entry: use its exact `id` (→ `<body data-uc="...">`),
   `file`, `title`, `summary` (hero lede can expand on it), `tags`, `status`, `deck`.
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
  (`badge-ready` "Field-ready" | `badge-wip` "In development" | `badge-new` "New"), h1, `.lede`
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
  5. Optional `id="talk-track"` — narrative card (only if source notes have one).
  6. `id="resources"` — `.grid-2` cards: "Documentation" (allowed URLs only, below) and
     "In this library" (2–3 related pages from catalog.js, relative hrefs like `security-ai.html`).
- `<nav class="pager" id="pager">` (empty — JS fills), footer, then:
  `<script src="../assets/js/catalog.js"></script><script src="../assets/js/app.js"></script>`

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
- LABELS MUST FIT: keep node labels ≤ ~22 chars for a 170-wide rect (sub ≤ ~24, tiny ≤ ~28);
  shorten the words, never shrink the font. Keep centred text ≥ half its width away from the
  viewBox edges. After shooting, also run `python3 _extract/measure_svg.py` — your page must
  produce no EDGE lines and no BOX overflow > 4px.
- Cato PoP: `circle.dg-pop` (r≈30) + optional `circle.pulse-ring` behind it; backbone as
  `ellipse.dg-backbone` or a chain of PoP circles.
- Flows: `path.lane.lane-allow|lane-limit|lane-block` (animated marching dashes;
  green=allowed, amber=restricted, red=blocked/attack) and `.lane-static` for neutral links.
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
