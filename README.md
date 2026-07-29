# Cato SASE Use Case Library

A self-contained, offline-first HTML library of **76 Cato Networks use cases** for
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

## Contents (6 categories)

| Category | Pages | Highlights |
|---|---|---|
| Access | 6 | ZTNA, BYOD on-ramps (portal / Browser Extension / Enterprise Browser), identity design, per-user remote-worker experience |
| Management | 7 | Visibility, DEM (with live CMA captures), API/Terraform, PoV framework, asset discovery, TCO |
| Network | 9 | SD-WAN, MPLS migration, cloud DC + Cloud Interconnect, ASA IPsec design, resilient sites |
| Security | 14 | FWaaS refresh, TLS inspection playbook, OT/IoT, compliance (ISO/NIS2, DORA, PCI, UK CE/CAF, NHS DSPT) |
| AI Security | 6 | GenAI visibility assessment, end-user GenAI, agentic AI, homegrown AI apps, legal GenAI |
| Migration | 34 | PS methodology + 13-vendor playbooks + per-vendor policy deep-dives (FW/SWG/CASB/DLP) + 5 animated phased journeys (MPLS, SD-WAN, VPN, firewall, Zscaler) |

Vertical filter: Retail · Finance · Public Sector · Healthcare · Manufacturing ·
Education · BPO · Legal.

Start at `index.html` → the **Start here** journeys, search box, or clickable tags.
`whatsnew.html` lists every change.

## Maintaining it

```bash
bash _extract/verify.sh              # 7-check health pass (links, catalogue, SVG, console, mobile, search index)
python3 _extract/build-search.py     # regenerate the full-text search index after page edits
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
usecases/*.html       the 76 use-case pages
assets/               shared CSS/JS, images (CMA screenshots, diagrams)
_extract/             tooling, source-deck digests, research briefs, verification scripts
"1 - … " … "5 - …"    original PowerPoint decks (do not share raw — see privacy note)
```

Built July 2026 with Claude Code; maintained by Tony Stalker (tstalker95@gmail.com).
