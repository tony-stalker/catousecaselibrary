# Cato SASE Use Case Library

A self-contained, offline-first HTML library of **94 Cato Networks use cases** for
sales engineers and partners — business objective, how the platform solves it, a
custom diagram, and a step-by-step demo runbook for every scenario. No build step,
no CDNs, no server: unzip or clone, open `index.html`, everything works from `file://`.
Full-text search across every page, light and dark themes (topnav toggle, follows
system preference), animated phased-migration journeys, and Demo/PoV runbook tabs
library-wide: 57 KB-grounded PoV runbooks (success criteria, config walkthrough,
what-good-looks-like, troubleshooting, gotchas & exit — authoring contract in
`_extract/POV-GUIDE.md`; wanted demo-tenant captures in `_extract/CAPTURE-LIST.md`).

> **Internal SE / partner enablement. This repository must remain PRIVATE** — the
> source PPTX decks in its history contain customer references. Share externally
> only via the sanitised zip from `_extract/package.sh`.

## Contents (7 categories)

| Category | Pages | Highlights |
|---|---|---|
| Access | 7 | ZTNA, Private Access with App Connectors, BYOD on-ramps (portal / Browser Extension / Enterprise Browser), identity design, per-user remote-worker experience |
| Management | 8 | Visibility, DEM (with live CMA captures), API/Terraform, PoV framework, asset discovery, data lake & event logs, TCO |
| Network | 10 | SD-WAN, MPLS migration, cloud DC + Cloud Interconnect, cloud on-ramp comparison (vSocket / IPsec / interconnect), ASA IPsec design, resilient sites |
| Security | 15 | FWaaS refresh, TLS inspection playbook, OT/IoT, compliance (ISO/NIS2, ISO 27001 posture-enforced, DORA, PCI, UK CE/CAF, NHS DSPT) |
| AI Security | 8 | AI threat landscape (nine real incidents), GenAI visibility assessment, end-user GenAI, agentic AI, homegrown AI apps, legal GenAI |
| Migration | 38 | PS methodology + 15-vendor playbooks + per-vendor policy deep-dives (FW/SWG/CASB/DLP) + 5 animated phased journeys (MPLS, SD-WAN, VPN, firewall, Zscaler) |
| Platform Demo | 8 | SE-only demo facilitation: the 60-minute first-demo running order (timings, bridge lines, staging checklist) + seven five-minute segments (SWG, threat prevention, CASB, DLP, ZTNA, App Connectors, DEM); excluded from the prospect edition |

Vertical filter: Retail · Finance · Public Sector · Healthcare · Manufacturing ·
Education · BPO · Legal.

Start at `index.html` → the **Start here** journeys, search box, or clickable tags.
Search is tokenised and ranked: each word is a prefix match (`ztn` finds ZTNA), a page must match
every word, and hits score title ×6 · tags ×4 · summary ×2 · category ×2 · page text ×1, so a query
shows one flat **Best matches** list (category chip on each card, `<mark>` highlights, a
"matched in: title · tags · page text" line) instead of the category groups; the filter buttons
show per-button hit counts while a query is active. `assets/js/search-synonyms.js` expands SE
shorthand (`vpn replacement` → ZTNA, `sdwan` → SD-WAN; synonym hits score at half weight) and the
empty state offers the six most-used tags.
Filters live in the URL (`index.html?q=ZTNA&cat=Access&vert=Finance`, or `#cat-security`), so a
filtered view is a shareable link; press `/` on any page to jump to the search box, Esc or × clears it.
`whatsnew.html` lists every change.

`planner.html` is an internal SE tool: describe an opportunity's existing estate and it composes
a sequenced migration methodology from these pages. It is deterministic — the rules in
`assets/js/planner-rules.js` are its whole judgement — and it is excluded from the prospect build.

Every use-case page can generate a concise Cato-branded **intro deck** (.pptx, client-side, no
libraries), and the index's **Build a demo presentation** card composes one deck from any
selection — pick use cases with the **+** on their cards, drag the chips into your demo order,
or start from a preset. Slide content lives in the generated `assets/js/deck-content.js`; the
decks carry the demo click-path, so all deck tooling is stripped from the prospect build.

## Maintaining it

```bash
bash _extract/verify.sh              # 8-check health pass (links, catalogue, SVG, console, mobile, search index, planner)
python3 _extract/build-search.py     # regenerate the full-text search index after page edits
python3 _extract/a11y-check.py       # accessibility lint (headings, th scope, link text, javascript: hrefs, nested controls, alt, dims, SVG titles, ids); --counts for the summary
python3 _extract/checkfigures.py     # figure/image report (dims, lazy/eager, dup src, orphans, capture-wanted marker grammar); exit 1 only on broken src
bash _extract/verify.sh --external   # + probe all external URLs (curl-based; see note)
git add -A && git commit             # after a clean verify
python3 _extract/whatsnew.py         # regenerate whatsnew.html, commit it
git push                             # master tracks origin/main
bash _extract/package.sh             # shareable zip in dist/ (clean decks only, ~58M)
bash _extract/package.sh lite        # deck-free lite zip (~12M, deck buttons stripped)
python3 _extract/build-prospect.py   # regenerate ../catoprospectlibrary (prospect edition; commit+push there)
bash _extract/deploy.sh              # publish live to the Azure Ubuntu host (see Hosting below)
```

### Hosting

The library is served live at **http://10.7.0.4:8080/** (Azure Ubuntu VM, reachable over the
Cato tunnel). `bash _extract/deploy.sh` stages the full edition, rsyncs it to
`/srv/usecaselibrary` and restarts the systemd unit `usecaselibrary`
(`_extract/server.py`, stdlib-only — static files + `POST /api/feedback`). Port 80 on that
host belongs to Apache (SASE-Experts contractor portal), so the library sits on 8080.

- SSH credentials come from `ubuntu.txt` in the library root — **git-ignored, never commit it**.
- The in-page **Report bug / Feedback** buttons (top-right, only shown when served over
  http/https) append to `feedback-log.txt` in the web root with a mandatory name field.
  That file is excluded from rsync `--delete`, blocked from being served (403), and
  git-ignored. Read it with: `ssh tonylab@10.7.0.4 cat /srv/usecaselibrary/feedback-log.txt`.

Conventions and gotchas:

- **`_extract/BUILD-GUIDE.md`** is the authoring standard for new pages (structure,
  CSS classes, SVG diagram rules, allowed URLs). `assets/js/catalog.js` is the single
  source of truth driving the index, filters and pagers.
- **Status model** (Oct 2026): every catalog entry carries `status: "ready" | "wip"` and
  `added: "YYYY-MM-DD"` (the page's first commit — `git log --diff-filter=A --format=%as
  -- usecases/«id».html | tail -1`). `app.js` shows the blue **New** badge while an entry is
  ≤ 90 days old, then falls back to the field status (Field-ready / In development) on both
  the index cards and the page hero — the hero's authored `badge-new` span is swapped at
  runtime, so nothing needs re-editing when a page ages out. `ready` means the demo runbook
  is complete and, where captures exist, they come from the demo tenant; `wip` flags gaps
  on the page. Never hand-write `status: "new"` (legacy entries that still carry it are
  treated as ready once aged out).
- **Platform facts** (Oct 2026): PoP count, backbone SLA, customer count and the Gartner MQ
  line live once in `assets/js/platform-facts.js` (`window.UC_FACTS`, each with source URL and
  check date). Pages wrap the value in `data-fact="«key»"` and app.js fills it at load — the
  index "Platform at a glance" strip is the reference use. Update the file, not the pages;
  see BUILD-GUIDE "Platform facts".
- **`_extract/STALENESS.md`** — register of dated facts (EOL dates, licensing, KB-dependent
  claims) with recheck triggers. Update it when adding dated claims; review quarterly.
- **Generic-library rules**: no customer names, no account IDs, no tenant-specific stats,
  fictional users only. Case studies are anonymised.
- `measure_svg.py` must run **silent**; any output is a diagram regression.
- External link checks use **curl, not python** — machines behind Cato TLS inspection
  lack the Cato root CA in python's trust store. Known false positive: `www.sophos.com`
  times out from behind the tunnel (curl exit 28/92) but the two migration-sophos links
  are live — confirm with a browser before "fixing" them.
- Screenshots come from a demo tenant with fictional identities; `.heic` originals are
  archived in `_extract/media/`.

## Layout

```
index.html            landing page (journeys, search, category grid)
whatsnew.html         change log (generated from git history)
planner.html          migration planner (internal only; excluded from the prospect build)
usecases/*.html       the 94 use-case pages
assets/               shared CSS/JS, images (CMA screenshots, diagrams)
_extract/             tooling, source-deck digests, research briefs, verification scripts
"1 - … " … "5 - …"    original PowerPoint decks (do not share raw — see privacy note)
```

Built July 2026 with Claude Code; maintained by Tony Stalker (tstalker95@gmail.com).
