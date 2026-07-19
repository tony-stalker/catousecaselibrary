# Cato SASE Use Case Library

A self-contained, offline-first HTML library of **63 Cato Networks use cases** for
sales engineers and partners — business objective, how the platform solves it, a
custom diagram, and a step-by-step demo runbook for every scenario. No build step,
no CDNs, no server: unzip or clone, open `index.html`, everything works from `file://`.

> **Internal SE / partner enablement. This repository must remain PRIVATE** — the
> source PPTX decks in its history contain customer references. Share externally
> only via the sanitised zip from `_extract/package.sh`.

## Contents (6 categories)

| Category | Pages | Highlights |
|---|---|---|
| Access | 5 | ZTNA, BYOD on-ramps (portal / Browser Extension / Enterprise Browser), identity design |
| Management | 6 | Visibility, DEM (with live CMA captures), API/Terraform, PoV framework, TCO |
| Network | 9 | SD-WAN, MPLS migration, cloud DC + Cloud Interconnect, ASA IPsec design, resilient sites |
| Security | 12 | FWaaS refresh, TLS inspection playbook, OT/IoT, compliance (ISO/NIS2, DORA, PCI, UK CE/CAF) |
| AI Security | 5 | GenAI visibility assessment, end-user GenAI, agentic AI, homegrown AI apps |
| Migration | 26 | PS methodology + 12-vendor playbooks + per-vendor policy deep-dives (FW/SWG/CASB/DLP) with real before→after examples |

Start at `index.html` → the **Start here** journeys, search box, or clickable tags.
`whatsnew.html` lists every change.

## Maintaining it

```bash
bash _extract/verify.sh              # 6-check health pass (links, catalogue, SVG, console, mobile)
bash _extract/verify.sh --external   # + probe all external URLs (curl-based; see note)
git add -A && git commit             # after a clean verify
python3 _extract/whatsnew.py         # regenerate whatsnew.html, commit it
git push                             # master tracks origin/main
bash _extract/package.sh             # shareable zip in dist/ (clean decks only)
```

Conventions and gotchas:

- **`_extract/BUILD-GUIDE.md`** is the authoring standard for new pages (structure,
  CSS classes, SVG diagram rules, allowed URLs). `assets/js/catalog.js` is the single
  source of truth driving the index, filters and pagers.
- **`_extract/STALENESS.md`** — register of dated facts (EOL dates, licensing, KB-dependent
  claims) with recheck triggers. Update it when adding dated claims; review quarterly.
- **Generic-library rules**: no customer names, no account IDs, no tenant-specific stats,
  fictional users only. Case studies are anonymised.
- `measure_svg.py` must run **silent**; any output is a diagram regression.
- External link checks use **curl, not python** — machines behind Cato TLS inspection
  lack the Cato root CA in python's trust store.
- Screenshots come from a demo tenant with fictional identities; `.heic` originals are
  archived in `_extract/media/`.

## Layout

```
index.html            landing page (journeys, search, category grid)
whatsnew.html         change log (generated from git history)
usecases/*.html       the 63 use-case pages
assets/               shared CSS/JS, images (CMA screenshots, diagrams)
_extract/             tooling, source-deck digests, research briefs, verification scripts
"1 - … " … "5 - …"    original PowerPoint decks (do not share raw — see privacy note)
```

Built July 2026 with Claude Code; maintained by Tony Stalker (tstalker95@gmail.com).
