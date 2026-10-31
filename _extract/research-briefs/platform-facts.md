# Platform facts — research brief for programme A02 / A03 (UNVERIFIED-1, UNVERIFIED-2)
## 2026 Gartner MQ, customer count, PoP count, backbone SLA, Socket models, EM Client minimums

Researched 31 Oct 2026 for the A02 content fix (`usecases/migration-cloudflare.html`,
`_extract/STALENESS.md`) and the A03 single-source `assets/js/platform-facts.js`. Every claim carries
its source URL, access date and a verbatim quote where one could be captured. Labels:
**VERIFIED** = primary source fetched and quoted (press release on PR Newswire, Cato Knowledge Base
`.md` route, vendor's own blog), or two independent secondary sources agreeing with each other;
**REPORTED** = one party's word, not independently corroborated; **UNVERIFIED** = not found in any
fetched source — quarantined in §8 and NEVER cited by a page. UK English throughout; quoted text is
kept as published (US spelling).

Method notes. PR Newswire and the KB `.md` route (`curl -s -L -A "Mozilla/5.0"
https://knowledge.catonetworks.com/docs/<slug>.md`) both returned clean content. **catonetworks.com
itself could not be read**: every marketing/legal/news URL tried (home, /platform/,
/platform/global-private-backbone/, /pops/, /about-us/, /cato-sase-cloud/, /legal/sla/,
/resources/…2026…, /news/…, `?p=164793`) returned HTTP 200 with a ~212-byte bot-check body to curl,
and an empty document to WebFetch. No attempt was made to circumvent that; the site should be read
in a real browser before any "Cato's own site says…" wording is used. gartner.com/doc/8183329 (the
2026 MQ abstract) returned HTTP 403.

---

## 1. 2026 Gartner Magic Quadrant for SASE Platforms

**1.1 Cato is a Leader; third consecutive year — VERIFIED.**
Source: Cato press release on PR Newswire, dateline "TEL AVIV, ISRAEL, July 31, 2026 /PRNewswire/",
headline "Cato Networks Named a Leader in the 2026 Gartner® Magic Quadrant™ for SASE Platforms for
the Third Consecutive Year".
https://www.prnewswire.com/il/news-releases/cato-networks-named-a-leader-in-the-2026-gartner-magic-quadrant-for-sase-platforms-for-the-third-consecutive-year-302839193.html
(accessed 31 Oct 2026). Verbatim from the first paragraph: "named a Leader in the 2026 Gartner®
Magic Quadrant™ for SASE Platforms for the third consecutive year". The CEO quote repeats "for the
third consecutive year". Corroborated by Infinigate UK, "Published on 11 August 2026": "with Cato
Networks named a Leader for the third consecutive year" (https://www.infinigate.com/uk/?p=11074,
accessed 31 Oct 2026). Sequence check: 2024 (first), 2025 (second — Cloudflare's own 2025 post and
the library's current text agree Cato was a Leader in 2025), 2026 (third).

**1.2 Report publication date — VERIFIED.** The Gartner citation line in the same release reads
verbatim: "Gartner, Magic Quadrant for SASE Platforms, Jonathan Forest, Andrew Lerner, John Watts,
28 July 2026". Cloudflare's blog gives the identical line in US format: "Gartner, Magic Quadrant for
SASE Platforms, Analyst(s): Jonathan Forest, Andrew Lerner, John Watts, July 28, 2026"
(https://blog.cloudflare.com/cloudflare-sase-sse-gartner-magic-quadrants-2026/, page metadata
datePublished 2026-08-05, accessed 31 Oct 2026). So: **report dated 28 Jul 2026; Cato's release
31 Jul 2026.** The critic's "published 31 Jul 2026" conflates the two — use 28 Jul 2026 for the
report and cite it as Gartner does.

**1.3 Cloudflare's 2026 position: Visionary — VERIFIED** (vendor self-statement corroborated by two
independent secondary sources). Cloudflare blog (above): "recognized as a Visionary in both the 2026
Gartner® Magic Quadrant™ for SASE Platforms" and the SSE report; post title "Cloudflare is the only
vendor named a Visionary in 2026 SASE and SSE reports". SDxCentral, "August 03, 2026": "Cloudflare
sat on its own in the "visionaries" box"
(https://www.sdxcentral.com/news/gartner-sase-2026-rankings-netskope-leads-cato-networks-leaps-and-palo-alto-networks-falls/,
accessed 31 Oct 2026). Infinigate (above): "Cloudflare named a Visionary". Cloudflare was also a
Visionary in the 2025 edition (https://blog.cloudflare.com/cloudflare-sase-gartner-magic-quadrant-2025/,
dated 15 Jul 2025 report), so "Visionary" carries forward unchanged — but the citation year must
move to 2026.

**1.4 Full 2026 quadrant (context only, REPORTED — SDxCentral's reading of the graphic):**
Leaders: Netskope, Cato Networks, Palo Alto Networks, Zscaler (new as a Leader). Challengers:
Fortinet, Cisco, Versa Networks. Visionaries: Cloudflare. Niche Players: HPE, Sangfor. SDxCentral
adds "Cato Networks now sits in second place" (its own reading of dot placement, not a Gartner
statement) and that Gartner's cautions for Cato were modular adoption of the platform and pricing.
Twelve vendors were evaluated (Versa, Gartner abstract vendor list). Do not put rank-order claims
("second place") on a page — Gartner does not rank within a quadrant.

**1.5 Gartner customer-count estimate for Cloudflare (the "~400 active enterprise SASE customers")
— UNVERIFIED for 2026.** Not present in the Cato release, the Cloudflare blog, SDxCentral,
Infinigate or any search result. The 2026 report body is paywalled (gartner.com/doc/8183329 →
HTTP 403) and no reprint page was found. The figure on `migration-cloudflare.html` is a 2025-report
number; it cannot be carried beside a 2026 citation. **Recommendation: drop the ~400 figure** (both
occurrences) unless an SE reads the 2026 reprint and records the exact sentence here.

**1.6 Gartner disclaimer (for any page that names the MQ) — VERIFIED.** The release carries the
standard text; one sentence captured verbatim: "Gartner does not endorse any company, vendor, product
or service depicted in its publications". Gartner and Magic Quadrant are registered trademarks of
Gartner, Inc. and/or its affiliates. Any library page quoting the MQ should carry the ® / ™ marks on
first use and the citation line from 1.2.

**1.7 Second Gartner document cited in the same release (REPORTED, for completeness):** "Forecast
Analysis: Secure Access Service Edge, Worldwide, 2025-2030" — Charanpal Bhogal, Neil MacDonald,
Andrew Lerner, Jonathan Forest, Charlie Winckless, 15 May 2026. No figures from it were captured.

## 2. Customer count

**2.1 "more than 4,800 customers" — VERIFIED.** Cato press release, dateline "TEL AVIV, Israel,
July 27, 2026 /PRNewswire/", headline "Cato Networks Exceeds $415M in ARR Fueled by 42% YoY Growth
and Enterprise Demand". Verbatim: "Cato Networks now serves more than 4,800 customers" and "today
announced that it has surpassed $415 million in ARR, with 42% year-over-year (YoY) growth".
https://www.prnewswire.com/il/news-releases/cato-networks-exceeds-415m-in-arr-fueled-by-42-yoy-growth-and-enterprise-demand-302833667.html
and https://tools.prnewswire.com/en-us/live/20813/release/20260727EN11395 (both accessed
31 Oct 2026). Corroborated by ChannelWeb, Globes, Pulse 2.0, ynetnews (search results, same figure).
Suggested library wording: "4,800+ customers (Cato, 27 Jul 2026)". Note the release says
"customers", not "enterprise customers" or "enterprises".

**2.2 Prior data point (REPORTED, secondary coverage of the Feb 2026 release):** the 2025 ARR
release ("Cato Networks Surpasses $350 Million ARR with 43% YoY Growth in 2025", Feb 2026) gave
"more than 4,000 enterprise customers". Not fetched directly; useful only as a trend line, not for a
page.

**2.3 Boilerplate wording in both releases — VERIFIED:** "delivers secure, zero-trust access everywhere
to thousands of customers worldwide". Neither release mentions a PoP count or the SLA.

## 3. PoP count

**3.1 "100+ PoPs" on Cato's own site — UNVERIFIED (could not be fetched).** The library was swept to
"100+ PoPs" on 30 Oct 2026 (commit dc967bb, STALENESS row 27: "updated 30 Oct 2026 from Cato pages;
was 80+"), but this pass could not reproduce that reading because catonetworks.com serves a bot-check
page to tools (see Method). Evidence that exists:
- One search-engine summary of https://www.catonetworks.com/platform/global-private-backbone/ (the
  "Cato Neural Edge" page) described it as "a cloud native, private global backbone spanning 100+
  PoPs worldwide" paired with "a 99.999% uptime SLA" — that is a search-model paraphrase, **not a
  quote from a fetched page**.
- Counter-indications (secondary, 2026): dope.security explainer and a techclick study note both say
  "85+ PoPs worldwide in 2026"; Infinigate's vendor page says 85+; a second (older) Cato backbone page
  (`catonetworks.com/?p=10969`) still reads "80+ PoPs" per search snippets; the only "100+" hits off
  catonetworks.com are a Netify listing and a business-model-canvas template.
**Action for whoever holds the browser:** open the backbone page and /pops/ logged out, copy the exact
heading/sentence with the PoP number and the page's date, and paste it into §3.1 with the access date.
Until then `platform-facts.js` should record `pops` with `source: "catonetworks.com/platform/global-private-backbone/ — read in browser 30 Oct 2026 (not machine-verifiable)"`,
and the staleness trigger should stay semi-annual. If the browser read does not show 100+, revert
the twelve sites listed in §7.3 to the figure it does show.

**3.2 KB facts about PoPs that ARE verifiable (for footnotes):** "FAQ - Limited Availability PoPs"
(https://knowledge.catonetworks.com/docs/faq-limited-availability-pops.md, updated 2026-06-22):
"Cato may sometimes add new PoP locations on a limited availability basis" — i.e. any headline count
may include LA PoPs; and "Cato announces the general availability of PoP locations in the weekly
Product Update email". So the honest page phrasing is "100+ PoPs (Cato, Oct 2026)" with a dated
source, never a precise number.

## 4. 99.999% backbone SLA wording

**4.1 KB wording — VERIFIED.** "Private PoP Overview for Customers"
(https://knowledge.catonetworks.com/docs/private-pop-overview-for-customers.md, updated
2026-06-22, accessed 31 Oct 2026), verbatim: "Cato offers the same enterprise-grade SLAs (including up
to 99.999% availability) for Private PoPs, leveraging the customer's own high-performance
infrastructure while ensuring end-to-end service reliability." Note the KB's own framing is **"up to
99.999% availability"** and it is an SLA on the Cato Cloud/PoP side — it says nothing about the last
mile, which matches the library's existing "The 99.999 % SLA is PoP-to-PoP" gotchas on network-sdwan
and network-global-app-performance.

**4.2 Marketing wording ("99.999% uptime SLA", "between PoPs") on catonetworks.com — UNVERIFIED this
pass** (bot wall, §Method); a search-model summary attributed "99.999% uptime SLA" to the Neural Edge
page. The legal SLA document itself (/legal/sla/ or similar) also could not be fetched; the exact
measurement basis ("between PoPs", monthly, service credits) therefore remains REPORTED from the
library's own earlier reading. The EOS notice (§5.2) confirms an SLA with "service credits" exists:
"Sites connected using Sockets that are past their EOS date are not covered by Cato Networks SLAs
and, in the event of a service failure, are not eligible for service credits."

**4.3 Resilient-site claim check.** `network-resilient-site-design.html:133` says "the 99.999% uptime
SLA for IPsec requires tunnels to at least two PoPs". Not found in any fetched source this pass —
mark REPORTED (library's earlier KB reading) and recheck against the SLA document when it can be
read.

## 5. Cato Socket models (KB, accessed 31 Oct 2026)

**5.1 Current hardware families — VERIFIED.** "Working with Socket Hardware"
(https://knowledge.catonetworks.com/docs/working-with-socket-hardware.md): "These are the available
hardware guides and data sheets for the X1500, X1600, and X1700 Sockets. As there might be some
differences between the sub-models of a Socket, for example, weight, throughput…". Sub-models seen in
KB article titles and bodies:
- **X1500** — X1500 (= X1500A), X1500B, X1500C ("How to Reset an X1500/X1500B/X1500C Socket";
  "X1500 and X1500B Sockets … X1500C Sockets" in the status-LED article).
- **X1600** — X1600, X1600 LTE, X1600 5G ("How to Reset an X1600 / X1600 LTE / X1600 5G Socket";
  "X1600 Cellular Socket Frequency Bands"; "X1600 Cellular Certified Countries"), and Wi-Fi models:
  "The X1600 Wi-Fi models include built-in Wi-Fi 6 radios (dual-band 2.4 GHz and 5 GHz) and do not
  require separate wireless access points" ("X1600 Socket WiFi FAQ"). Deployment guide
  (https://knowledge.catonetworks.com/docs/x1600-socket-deployment-guide-1.md, updated 2026-10-15):
  "These limitations apply to all X1600 Socket models"; "For 5G models, the label in the Socket Web
  UI is **Cellular 01**."
- **X1700** — X1700 (= X1700A), X1700B, X1700C. Deployment guide
  (https://knowledge.catonetworks.com/docs/socket-x1700-deployment-guide.md, updated 2026-10-11):
  "At the end of 2022, Cato introduced a second hardware model for the X1700 Socket. This hardware
  model is referred as X1700B." and "In 2026, Cato introduced a third hardware model for the X1700,
  referred to as the X1700C." X1700 takes add-on network cards; SFP transceivers are supported on
  "X1700 Socket add-on cards and the X1600 Socket".
- **vSocket** — virtual Socket (AWS/Azure/GCP; "vSocket v22+" already on management-dem.html:643).
  Not re-verified this pass; see cloud-connectivity.md brief.

**5.2 Lifecycle — VERIFIED.** "Product Lifecycle Notice - End of Support for Cato Socket Hardware"
(https://knowledge.catonetworks.com/docs/product-lifecycle-notice-end-of-support-for-cato-socket-hardware.md,
updated 2026-06-22): table rows "Cato Socket X1500A | February 18, 2026 | July 1, 2030" and
"Cato Socket X1700A | February 18, 2026 | July 1, 2030". "If a hardware version in the Sockets &
Accessories page appears without a letter suffix, it corresponds to the **A** version referenced in
this notice." Refresh policy (https://knowledge.catonetworks.com/docs/cato-socket-hardware-refresh-policy.md):
"Cato generally supports a Socket model for at least seven (7) years—and often up to ten (10)
years—from the start of service to the EOS date … typically announces EOS approximately four (4)
years in advance"; refresh window "at least 12 months". CMA path for the model inventory: "Account >
Sockets & Accessories" (Hardware Version column). Add a STALENESS row: "X1500A/X1700A EOS 1 Jul
2030 — recheck annually".

## 6. Experience Monitoring — Client and Socket version minimums (KB, accessed 31 Oct 2026)

**6.1 Base DEM user analytics — VERIFIED.** "What is Cato Experience Monitoring"
(https://knowledge.catonetworks.com/docs/what-is-cato-experience-monitoring.md, updated 2026-07-14),
section "Supported Client Versions", verbatim: "DEM analytics and data for users are supported for
these Client versions and higher: - Windows Client v5.12.10.3910 - macOS Client v.5.7.0.1545
(including users without an SDP license)." Plus: "If your account is configured with a public IP range
as a Reserved Range, full DEM feature visibility requires Windows Client version 6.8 or higher, or
macOS Client version 5.14 or higher. Contact Support to enable the required account configuration."

**6.2 Connection Details device-side nodes — VERIFIED (prerequisite is "Client connected"; the
version floor is 6.1).** "Experience Monitoring Connection Details"
(https://knowledge.catonetworks.com/docs/experience-monitoring-connection-details.md, updated
2026-10-15): "To see the User Device, Wi-Fi, and LAN Gateway nodes, the user's device must be
connected to the Cato Client both when working remotely and behind a Socket." and "Device, Wi-Fi,
and LAN Gateway data is supported on Windows and macOS Clients." The article states **no separate
version number** for these nodes; the only published floor is 6.1 (Windows 5.12.10 / macOS 5.7).
Node thresholds are unchanged from the library's reading (CPU 70/90 %, memory 60/80 %, Wi-Fi
-67/-80 dBm, LAN gateway loss 1/5 % and distance 10/50 ms, last mile loss 1/5 % and tunnel distance
20/100 ms).

**6.3 Underlay probes — VERIFIED.** "The User Experience Monitoring Drill-Down Page (Remote and
Office Users)" (https://knowledge.catonetworks.com/docs/the-user-experience-monitoring-drill-down-page-remote-and-office-users.md,
updated 2026-10-15): "For office user (Socket site) metrics - Socket v21.1.18975 or higher" and
"For remote user metrics - Client versions macOS 5.10 or Windows 5.17, or higher"; also "For data to
be collected for the Underlay Probes feature, Socket v21.1.18975 or higher is required".

**6.4 Library alignment (the A20 "5.11 vs 5.12.10" question).**
- `usecases/management-dem.html:270` "Windows v5.12.10 / macOS v5.7 or higher" and `:517`, `:642`
  (5.12.10 / 5.7) — **correct**.
- `usecases/management-dem.html:643` "Socket v21.1.18975+ … Client Windows 5.17 / macOS 5.10+" —
  **correct**.
- `usecases/access-remote-worker.html:462` "device, Wi-Fi and LAN gateway nodes in Connection Details
  need Windows v5.11 / macOS v5.7" — **stale/unsupported**: no KB article gives 5.11; align to
  "Windows v5.12.10 / macOS v5.7" (6.1). Line 461 "Windows Client v5.12+" should read "v5.12.10+".
  Line 463 (5.17 / 5.10) is correct.
- `_extract/STALENESS.md:37` — update the row to name 5.12.10.3910 / 5.7.0.1545 and the 6.8/5.14
  Reserved-Range caveat; last verified 31 Oct 2026.

## 7. Where the library currently cites the 2025 MQ, the ~400 figure and the other platform numbers

**7.1 2025 MQ and "~400" (A02 edit list) — only two files:**
- `usecases/migration-cloudflare.html:109-112` — "in the <strong>2025 Gartner Magic Quadrant for SASE
  Platforms, Cato is a Leader</strong> (repeat placement) and <strong>Cloudflare is a Visionary</strong>
  — with approximately 400 active enterprise SASE customers per Gartner's estimate (attribute that
  figure to Gartner; it is not a Cloudflare statement)."
  → "in the <strong>2026 Gartner® Magic Quadrant™ for SASE Platforms, Cato is a Leader</strong> (third
  consecutive year) and <strong>Cloudflare is a Visionary</strong>." Drop the ~400 clause; add the
  citation line from §1.2 as a `.fine` note or in Resources.
- `usecases/migration-cloudflare.html:406` — gotcha card: "Gartner's 2025 MQ summaries credit
  Cloudflare's network coverage and innovation … places Cloudflare as a Visionary with a much smaller
  SASE base (per Gartner's ~400-customer estimate, attributed)." → "2026 MQ"; delete the parenthetical
  customer estimate; "much smaller SASE base" becomes unsupported once the figure goes — reword to
  "places Cloudflare as a Visionary" and, if a contrast is wanted, use Cato's own verified 4,800+
  (§2.1) as a Cato statement, not a Gartner one.
- `_extract/STALENESS.md:16` — row "2025 Gartner MQ (Cato Leader, Cloudflare Visionary, ~400 via
  Gartner) | migration-cloudflare | On next MQ publication (~annual)" → "2026 Gartner MQ (report
  28 Jul 2026; Cato Leader 3rd consecutive year; Cloudflare Visionary) | migration-cloudflare,
  platform-facts.js | Next MQ (~Jul 2027)".
- **Correction to audits.json finding (line 16):** `assets/js/deck-content.js` does **not** duplicate
  the MQ text — `grep -n -i "gartner\|visionary\|magic quadrant\|~400" assets/js/deck-content.js`
  returns no matches (the only "Magic" hits are Cloudflare "Magic WAN"/"Magic Firewall"). The cloudflare
  deck entry needs no MQ edit.
- Other Gartner mentions are unrelated to this MQ and stay as they are: `management-visibility.html:72`
  (2019 Strategic Roadmap quote — A03 proposes replacing it with the 2026 MQ line),
  `migration-iboss.html:70,170,433` (2024 SSE MQ), `migration-sophos.html:142-143` (EPP MQ).
- **Derived artefact (not an edit target):** `assets/js/search-index.js:41` carries the tokens `2025`,
  `400` and `400-customer` for `migration-cloudflare` — regenerate with `_extract/build-search.py` after
  the A02 edit; do not hand-edit.
- **False positives to ignore in the grep:** `usecases/security-healthcare-nhs.html:139` ("~400 GB" of
  stolen data — unrelated) and `usecases/migration-sophos.html:143` ("2025 Gartner Peer Insights" — EPP,
  unrelated).
- Exact grep used (second pass, 31 Oct 2026):
  `grep -rn -i -E "2025 Gartner|2025 Magic|MQ 2025|2025 MQ|400 customers|~400|400-customer|400 active" usecases index.html assets/js _extract/STALENESS.md`
  → the three true hits are `migration-cloudflare.html:109,111,406` and `_extract/STALENESS.md:16`.

**7.2 Customer count — zero current occurrences** of a Cato customer number in `usecases/`, `index.html`
or `deck-content.js` (grep `-E "[0-9,]+\+? customers"` finds only Sophos/SonicWall counts). 4,800+ is
new content for A03.

**7.3 "100+ PoPs" — twelve sites on the current tree** (grep `-rn "100+ PoP" usecases assets/js`,
re-run second pass 31 Oct 2026; revert or re-source per §3.1):
`usecases/network-global-expansion.html` (4), `usecases/management-visibility.html` (2, "100+ PoP"),
`usecases/access-hybrid-workforce.html` (2), `usecases/access-app-connectors.html` (1, inside the kit
spotlight SVG `<text>`), `assets/js/deck-content.js:51,858`, and the new untracked
`assets/js/platform-facts.js:8` (`pops: "100+"` — A03 single source; its `sources.pops` entry must carry
the §3.1 caveat). STALENESS row 27.

**7.4 "99.999 %" — nineteen lines (grep `-rn "99\.999" usecases assets/js`, re-run 31 Oct 2026):**
`usecases/network-sdwan.html:7,38,92,120(SVG desc),129(SVG),188,204,469`;
`usecases/network-resilient-site-design.html:133`; `usecases/security-compliance.html:296`;
`usecases/network-global-app-performance.html:116,131(SVG),262,476`; `usecases/access-app-connectors.html:136`
(SVG); `assets/js/deck-content.js:560`; **plus two found on the second pass:** `assets/js/catalog.js:188`
(network-sdwan card summary, "a 99.999 % SLA between PoPs" — catalog.js is owned by another agent; flag,
do not edit here) and `assets/js/platform-facts.js:9,28` (`backboneSla: "99.999%"` and its `sources.backboneSla.claim`
text). Formatting varies
(`99.999&nbsp;%`, `99.999&thinsp;%`, `99.999&#8201;%`, `99.999 %`, `99.999%`) — A03's
`data-fact="backboneSla"` should normalise it.

## 8. UNVERIFIED — quarantined, not to be cited

| Claim | Status | What would verify it |
|---|---|---|
| Gartner's 2026 customer-count estimate for Cloudflare (or any vendor) | UNVERIFIED — not in any fetched source; report paywalled | Read the 2026 MQ reprint (Cato's resources page, logged-in browser) and paste the sentence here |
| "100+ PoPs" as the wording on catonetworks.com | UNVERIFIED by tooling (bot wall); secondary sources say 85+ | Browser read of /platform/global-private-backbone/ and /pops/, quote + date |
| "99.999% uptime SLA between PoPs" exact marketing/legal wording and measurement basis | UNVERIFIED this pass (KB says "up to 99.999% availability") | Browser read of the SLA page under /legal/ |
| "99.999% SLA for IPsec requires tunnels to at least two PoPs" (network-resilient-site-design:133) | REPORTED (earlier library reading, no source found this pass) | Same SLA page or KB IPsec HA article |
| "Cato Networks now sits in second place" (SDxCentral) | REPORTED — journalist's reading of dot placement | Never cite; Gartner does not rank within quadrants |
| Windows v5.11 for Connection Details device nodes (access-remote-worker:462) | UNVERIFIED — no KB article gives 5.11 | Replace with 5.12.10 / 5.7 per §6.1 |

## 9. Suggested `platform-facts.js` values (for A03; every value traces to a section above)

```
pops:        "100+"      // §3.1 — UNVERIFIED by tooling; browser read 30 Oct 2026; recheck semi-annually
backboneSla: "99.999%"   // §4.1 — KB "up to 99.999% availability" (private-pop-overview-for-customers, 22 Jun 2026)
customers:   "4,800+"    // §2.1 — PR Newswire 27 Jul 2026, "more than 4,800 customers"
mq:          "Leader — 2026 Gartner® Magic Quadrant™ for SASE Platforms (third consecutive year)"  // §1.1
mqCitation:  "Gartner, Magic Quadrant for SASE Platforms, Jonathan Forest, Andrew Lerner, John Watts, 28 July 2026"  // §1.2
asOf:        "2026-10-31"
```

## 10. Second-pass re-verification (31 Oct 2026, later the same day)

Every VERIFIED item above was re-fetched and the quotes re-matched against the live source; nothing
changed. Specifically:
- PR Newswire MQ release 302839193 — HTTP 200, 67 KB. Re-matched verbatim: "today announced it has
  been named a Leader in the 2026 Gartner® Magic Quadrant™ for SASE Platforms for the third consecutive
  year"; dateline "TEL AVIV, ISRAEL, July 31, 2026 /PRNewswire/"; citation "Gartner, Magic Quadrant for
  SASE Platforms, Jonathan Forest, Andrew Lerner, John Watts, 28 July 2026"; disclaimer "Gartner does not
  endorse any company, vendor, product or service depicted in its publications". The release contains
  **no** occurrence of "Cloudflare", "Visionary", "PoP", "99.999" or any customer count — so §1.3 rests
  on Cloudflare's own blog plus SDxCentral/Infinigate, and §1.5 stays UNVERIFIED.
- PR Newswire ARR release 302833667 — HTTP 200, 64 KB. Re-matched verbatim: "Cato Networks now serves
  more than 4,800 customers that rely on its cIoud-native network security platform" [sic — the source
  has "cIoud" with a capital I]; dateline "TEL AVIV, Israel, July 27, 2026 /PRNewswire/"; headline
  "Cato Networks Exceeds $415M in ARR Fueled by 42% YoY Growth and Enterprise Demand".
- KB `.md` route (all HTTP 200): `experience-monitoring-connection-details` (updated 2026-10-15) —
  lines 33 and 70 match §6.2 verbatim, still no version number; `what-is-cato-experience-monitoring`
  (updated 2026-07-14) — "Windows Client v5.12.10.3910", "macOS Client v.5.7.0.1545", Reserved-Range
  note "Windows Client version 6.8 or higher, or macOS Client version 5.14 or higher" (§6.1);
  `the-user-experience-monitoring-drill-down-page-remote-and-office-users` (updated 2026-10-15) —
  "Socket v21.1.18975 or higher", "Client versions macOS 5.10 or Windows 5.17, or higher" (§6.3);
  `private-pop-overview-for-customers` (updated 2026-06-22) — "up to 99.999% availability" (§4.1);
  `working-with-socket-hardware` (updated 2026-10-19) — "X1500, X1600, and X1700 Sockets" and the
  X1500/X1500B/X1500C, X1700/X1700B sub-model mentions (§5.1).
- catonetworks.com `/platform/global-private-backbone/`, `/pops/`, `/legal/sla/` — still HTTP 200 with a
  212-byte bot-check body even with a full Chrome UA string. §3.1 and §4.2 remain UNVERIFIED; the only
  route is a human browser read.
- gartner.com reprint / 2026 MQ body — not re-attempted (403 on first pass; paywalled). §1.5 remains
  UNVERIFIED; no "~400" or any 2026 customer-count estimate exists in any fetched source.

Net status for the two programme dependencies: **UNVERIFIED-1** — MQ 2026 / Cato Leader / third year /
report date 28 Jul 2026: VERIFIED; Cloudflare Visionary: VERIFIED (vendor + two secondaries); Gartner
customer estimate: UNVERIFIED → drop. **UNVERIFIED-2** — 4,800+ customers: VERIFIED; 99.999%: VERIFIED
as KB "up to 99.999% availability" only; 100+ PoPs: UNVERIFIED by tooling (browser read needed).

---

## 9. Browser verification of the catonetworks.com items (31 Oct 2026, signed-in Chrome)

Read in a real browser (the site serves a bot-check body to tooling), page
https://www.catonetworks.com/platform/global-private-backbone/ ("Global Private Backbone | Cato Networks"),
section "OUR APPROACH", verbatim:

> "Cato Neural Edge is a cloud-native, private global backbone spanning 100+ PoPs worldwide. Purpose-built
> with embedded GPU-powered compute, it enhances AI-driven security at scale while delivering the high
> performance, resilience, low latency, and 99.999% uptime SLA that enterprises need for resilient global
> connectivity."

- **§3.1 PoP count "100+" — now VERIFIED** (Cato's own platform page, 31 Oct 2026). The library's "100+ PoPs"
  wording stands; the "85+" secondary sources are older.
- **§4.2 "99.999% uptime SLA" — now VERIFIED** as Cato's own wording on the backbone page (marketing wording;
  the contractual SLA document was not read).
- Cato now brands the backbone "Cato Neural Edge" on this page — pages may keep "Global Private Backbone"
  (the page title still uses it) but the kit's ring label "CATO NEURAL EDGE" is consistent with it.
