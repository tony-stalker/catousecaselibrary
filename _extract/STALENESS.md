# Staleness register — dated facts that will rot

Pages cite time-sensitive facts. Recheck each item on its trigger date (or quarterly),
update the page, and move the row's "last verified" forward. All dates were verified at
build time (July 2026) from the sources cited on each page.

| Dated fact | Where it lives | Recheck when |
|---|---|---|
| AnyConnect 4.x support ends Mar 2027 (maintenance ended Mar 2024) | migration-anyconnect, migration-cisco | Mar 2027 — reframe as "ended" |
| ASA 5506/5508/5516-X EOS Aug 2026; ASA 5500-X support ends 2026 | migration-anyconnect, migration-cisco | Sep 2026 — reframe as past |
| Umbrella legacy SKUs EOS Sep 2025; vEdge support ends 2026 | migration-cisco | Quarterly |
| PA-3200/5200 EOS (support to Aug 2028); Expedition EOL Dec 2024 | migration-palo-alto(-policy) | Aug 2028 / stable |
| CVE-2024-3400, CVE-2024-47575 (FortiJump), CVE-2024-39717 (Versa), 2025 Concerto CVEs | palo-alto, fortinet, versa pages | Stable as history; add newer CVEs quarterly |
| CISA KEV counts (26 Fortinet CVEs / 13 ransomware-linked) | migration-fortinet | Quarterly — counts grow |
| FortiOS 7.6.3 removes SSL-VPN tunnel mode | migration-fortinet | Stable |
| 2026 Gartner MQ for SASE Platforms published ~28 Jul 2026 — Cato reconfirmed Leader (3rd consecutive year); page also cites the 2025 MQ (Cato Leader, Cloudflare Visionary, ~400 via Gartner) for the Cloudflare comparison — **Cloudflare's category in the 2026 MQ is unconfirmed** (Gartner report paywalled, press coverage so far only covers Leaders/Challengers); re-check before citing a 2026 Cloudflare placement | migration-cloudflare | Next visit: confirm Cloudflare's 2026 MQ category; otherwise on next MQ publication (~annual) |
| Cloudflare One Appliance limits (no fail-open, ~30s failover, no QoS) | migration-cloudflare(-policy) | Quarterly — vendor docs move |
| Client OS list NOW includes "Android and Chromebook" (KB verified 23 Jul 2026 — iboss caveat softened accordingly); Google Workspace SCIM still not in documented lists | access-byod-clientless, migration-iboss | Quarterly — support lists grow |
| AI Security: End Users and Apps are separate per-user licences; Enterprise Browser included in ZTNA licence | AI Security pages, access-byod-clientless | On licensing announcements |
| AI Gateway consolidated into Guards Jul 2026 (one guard per gateway, virtual keys → Homegrown Agents; still LiteLLM-only); Outpost licensing NO LONGER publicly documented — "confirm with Cato rep" wording on-page | ai-homegrown-apps | Quarterly — this surface moves fastest in the library |
| AI Security KB churn (Jul 2026): agent docs replaced by four what-is-* pages (old scouts/monitoring slugs 404); what-is-ai-security-for-end-users slug serves Shadow-AI-Discovery content; UIP actions 4-enum, Guards Interaction Policy 3-enum; CASB/DLP Data Control enum = Allow/Block/Notify (tenant UI shows Monitor) | AI Security pages, security-data-casb-dlp | Quarterly — re-run llms.txt link sweep |
| AI Visibility Assessment deck is DRAFT (Apr 2026), offer "no cost, limited time" | security-ai-visibility | On deck update — remove draft callout |
| Cato↔ASA IKEv2 multi-TS incompatibility + remedies; IPsec parameter/throughput figures | network-ipsec-asa | Semi-annually vs KB |
| Socket v15 BGP community 32768 requirement | migration-methodology | When v15 is universal — drop the caveat |
| Cyber Essentials (Willow) & NCSC CAF versions | security-uk-public-sector | Annually (IASME/NCSC refresh) |
| DORA applies from 17 Jan 2025 | security-finance-dora | Stable as history |
| "80+ PoPs" and PoP lists | network-global-expansion, others | Semi-annually — count grows |
| Cloud Interconnect provider list & PoP availability/lead times | network-cloud-interconnect | Semi-annually vs KB |
| Cato Terraform provider parallelism=1 caveat (+ 5-retry/1–30 s backoff defaults) | migration-cloudflare, management-api-automation | Semi-annually |
| Sophos forced-refresh calendar (XG EOL 31 Mar 2025; SFOS v22 Dec 2025 XGS-only; Workspace Protection GA Feb 2026; standalone ZTNA SKUs ended 1 May 2026; +10% XGS prices took effect 1 Jul 2026 — reframed past-tense Jul 2026 review) | migration-sophos | Quarterly — Sophos partner news moves fast |
| Six Sophos firewall CVEs in CISA KEV (incl. CVE-2020-25223 SG UTM, CVE-2020-29574 CyberoamOS) | migration-sophos | Quarterly — counts grow |
| Sophos endpoint credentials (Gartner MQ EPP Leader 17th consecutive 2026; MDR 26k+ customers Jan 2025; MSP Elevate May 2025) | migration-sophos | On next MQ / annually |
| SD-RED 20/60 has NO declared EOL — page explicitly says do not claim it | migration-sophos | Quarterly — reframe if Sophos declares one |
| DSPT 2025-26 "v8" aligned to CAF v3.4, deadline 30 Jun 2026 just closed; NO 2026-27 (v9) edition yet — page carries a staleness callout | security-healthcare-nhs | Sep 2026 — new edition expected on ~Sept cadence |
| NCSC CAF v4.0 (Aug 2025) vs NHS still on v3.4 | security-healthcare-nhs | On next DSPT edition |
| NHS Supply Chain requires CE+ from in-scope suppliers (Sep 2025); NHS England MFA policy (Aug 2023); HSCN operational, no announced successor | security-healthcare-nhs | Annually |
| Always-On bypass minimum Client versions (Win 5.9+ / macOS 5.5+ / iOS 5.6+); EM Connection Details scoring thresholds | access-remote-worker | Quarterly vs KB — versions move with releases |
| Digital Omnibus published as **Regulation (EU) 2026/1744** in the Official Journal on 24 Jul 2026, in force 27 Jul 2026 (delays Annex III high-risk incl. Art 26 → 2 Dec 2027, Annex I → 2 Aug 2028, confirmed) — page updated 1 Aug 2026 to cite the regulation and drop "pending" wording, in the Read-this-first callout AND objective | ai-eu-ai-act | Stable as history — re-verify the two deferred dates land on schedule (Dec 2027 / Aug 2028) |
| AI Act general applicability "from 2 Aug 2026" phrasing; Art 50 marking grace to 2 Dec 2026 for pre-market systems | ai-eu-ai-act | Sep 2026 — confirm "from" reads naturally as past; Dec 2026 for the grace row |
| Member-state authority tracker 9 clear / 12 partial / 6 none (as of 17 Jun 2026) | ai-eu-ai-act | Quarterly — refresh after 2 Aug 2026 enforcement start |
| CSA (13 Mar 2026) >half lack AI inventories; appliedAI 40% of 106 systems unclassifiable | ai-eu-ai-act | Stable as dated research; replace if fresher studies appear |
| Cato Data Lake default retention 3 months (extendable) — hedged on-page, support page login-gated | ai-eu-ai-act | Quarterly vs KB/SKU — firm up if a public source appears |
| PoV-runbook KB parameters across ALL 57 #pov sections (client/socket version gates, EM windows and thresholds, event/export caps, MTU 1383, BGP defaults incl. AS-path-prepend secondary preference and up-to-6 IKEv2 tunnels/role, DLP 50 MB / 20-type limits, forensics/RBAC facts, TLSi behaviour, sub-minute propagation, Audit Trail 12mo/3mo, XOps/DEM/IoT-OT/AI licence gates) — all fetched 20–23 Jul 2026 | every page with a #pov section (grep 'id="pov"') | Quarterly vs KB — the monthly staleness routine should spot-sample 5–10 sections per run |
| Trust page lists ISO/IEC 27001:2013 family (checked 23 Jul 2026) — likely to move to 27001:2022 | security-compliance, security-uk-public-sector, security-finance-dora | Quarterly — re-fetch the trust page |
| CMA nav naming drift: current KB shows "Home → Experience Monitoring (Probes)", "Resources → Device Posture", "Home → Devices", "Account → Audit Trail"; library chips use Monitor →/Access →/Assets →/Administration → conventions (EM probes chips aligned to Home → 23 Jul) | all pages with path chips | Confirm against the live CMA, then align the convention library-wide in one sweep |

Rendering note: as of 19 Jul 2026 measure_svg.py runs completely silent — all label
bleeds fixed, and the script now ignores rects wider than 250 user-units (band/container
rects are not node boxes). A non-silent run means a real regression.
