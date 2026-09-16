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
| 2025 Gartner MQ (Cato Leader, Cloudflare Visionary, ~400 via Gartner) | migration-cloudflare | On next MQ publication (~annual) |
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
| Digital Omnibus "publication still pending" wording (agreed May–Jun 2026; delays Annex III high-risk incl. Art 26 → 2 Dec 2027, Annex I → 2 Aug 2028) — in the Read-this-first callout AND objective | ai-eu-ai-act | On OJ publication (~weeks) — cite the amending regulation, drop "pending" |
| AI Act general applicability "from 2 Aug 2026" phrasing; Art 50 marking grace to 2 Dec 2026 for pre-market systems | ai-eu-ai-act | Sep 2026 — confirm "from" reads naturally as past; Dec 2026 for the grace row |
| Member-state authority tracker 9 clear / 12 partial / 6 none (as of 17 Jun 2026) | ai-eu-ai-act | Quarterly — refresh after 2 Aug 2026 enforcement start |
| CSA (13 Mar 2026) >half lack AI inventories; appliedAI 40% of 106 systems unclassifiable | ai-eu-ai-act | Stable as dated research; replace if fresher studies appear |
| Cato Data Lake default retention 3 months (extendable) — hedged on-page, support page login-gated | ai-eu-ai-act | Quarterly vs KB/SKU — firm up if a public source appears |
| PoV-runbook KB parameters across ALL 57 #pov sections (client/socket version gates, EM windows and thresholds, event/export caps, MTU 1383, BGP defaults incl. AS-path-prepend secondary preference and up-to-6 IKEv2 tunnels/role, DLP 50 MB / 20-type limits, forensics/RBAC facts, TLSi behaviour, sub-minute propagation, Audit Trail 12mo/3mo, XOps/DEM/IoT-OT/AI licence gates) — all fetched 20–23 Jul 2026 | every page with a #pov section (grep 'id="pov"') | Quarterly vs KB — the monthly staleness routine should spot-sample 5–10 sections per run |
| Trust page lists ISO/IEC 27001:2013 family (checked 23 Jul 2026) — likely to move to 27001:2022 | security-compliance, security-uk-public-sector, security-finance-dora | Quarterly — re-fetch the trust page |
| AI-attack incident set (brief: `_extract/research-briefs/ai-attacks.md`, all sources accessed 11 Sep 2026): Arup $25.6M (Jan 2024), DPRK IT-worker DOJ figures ($17M Chapman Jul 2025, $1.2M May 2026), Ferrari attempt (REPORTED), Hugging Face/OpenAI agent intrusion (Jul 2026, Nightingale follow-up 4 Sep 2026), GTG-1002 (REPORTED, single-source), LameHug/PROMPTSTEAL, Salesloft Drift 700+ orgs, Samsung 2023, Disney 1.1 TB guilty plea | ai-threat-landscape | Quarterly — stable as history, but watch for arrests/attributions/corrections (esp. Hugging Face and GTG-1002, both still moving) |
| FBI IC3 2025 AI break-out: 22,364 AI-nexus complaints, $893M adjusted losses (report released Apr 2026) | ai-threat-landscape | On IC3 2026 annual report (~Apr 2027) — replace with newer figures |
| NCSC "now to 2027" assessment quotes (7 May 2025) incl. "realistic possibility of critical systems becoming more vulnerable by 2027" | ai-threat-landscape | On next NCSC AI assessment; reframe the 2027 horizon as it approaches |
| Effectiveness/volume stats: Heiding et al. 54% vs 12% (Nov 2024, n=101), CrowdStrike 442% vishing H1→H2 2024, Verizon DBIR 2025 ~5%→~10% doubling, Hoxhunt Mar 2025 crossover (23.3%), DeepSeek wave figures (Netskope 1,052%/91%/75%, Jan 2025) | ai-threat-landscape | Annually as each report's successor lands (DBIR ~Apr, CrowdStrike ~Feb, IC3 ~Apr) |
| EchoLeak/ShadowLeak/ForcedLeak framed as "no confirmed real-world victim" (checked 11 Sep 2026) | ai-threat-landscape | Quarterly — reframe immediately if in-the-wild exploitation is ever confirmed |
| Cloud on-ramp availability matrix (OCI has NO vSocket; GCP vSocket HA new Mar 2026, min 24.0.20395; AWS vSocket HA has no BGP/alt-WAN) — brief: `_extract/research-briefs/cloud-connectivity.md`, all sources accessed 12 Sep 2026 | network-cloud-connectivity | Quarterly vs KB — an OCI vSocket or AWS-HA-BGP release invalidates the page's centrepiece cells |
| Cloud on-ramp capability matrix (QoS downstream-only on IPsec/interconnect; SD-WAN/DEM/last-mile rows vSocket-only; IPsec Active/Active/Active tunnels; interconnect active/passive; interconnect BGP-only) — from Cato SE field deck, Sep 2026 | network-cloud-connectivity | Quarterly, alongside the availability-matrix row — re-check vs KB and current SE material |
| Cloud connectivity throughput figures (Azure vSocket 1/2 Gbps by NIC count; GCP vSocket 2 Gbps; AWS vSocket deliberately unpublished; IPsec site 3 Gbps; Cloud Interconnect 10 Gbps, 500 Mbps Enforcement minimum) | network-cloud-connectivity | Semi-annually vs "Cato Cloud Thresholds and Limits" |
| Cloud-side gateway/port figures (AWS 1.25 Gbps standard / 5 Gbps large-bandwidth tunnel, $0.05/hr; Azure VpnGw SKU benchmarks, non-AZ SKUs retiring; GCP 250k pps ≈1–3 Gbps/tunnel, ~$0.05/hr; DX hosted 50 Mbps–25 Gbps; ExpressRoute 50 Mbps–10 Gbps provider circuits; Partner Interconnect 50 Mbps–50 Gbps attachments) | network-cloud-connectivity | Semi-annually vs provider docs — pricing and SKU tables move without notice |
| Cloud Interconnect lead-time tiers (immediate → 3 wk → 4 wk → 6 wk → 3 mo; Megaport CMA on-demand still EA) + fabric-provider list (Equinix, Megaport, Console Connect, Interxion) as cited on the comparison page | network-cloud-connectivity, network-cloud-interconnect | Semi-annually vs KB availability article — date any quoted extract |
| On-ramp decision helper (#decider on the comparison page): scoring rules in assets/js/onramp-decider.js mirror the page's verified matrix (throughput ceilings, HA timings, encryption, licences, lead times dated Sep 2026) | network-cloud-connectivity | Whenever the comparison matrix or the cloud-connectivity brief changes, update the decider rules AND the static which-wins-when table in the same edit |
| Data Lake unit size ("currently 2.5 million events per hour"), free-unit inclusion, band tables (to 33 Gbps / 43K clients), 180 GB/month rough conversion, S3 feed cadence (60 s / 9.5 MB), 3-integration cap, gzip "up to 95%" — all quoted on the data-lake page and driving assets/js/datalake-calc.js | management-data-lake | Quarterly vs KB guide-to-cato-data-lake (upd. Aug 2026), best-practices (Jun 2026), S3 integration (Sep 2026); update page tables AND calculator bands together |
| Two KB-internal discrepancies flagged on the data-lake page: worked example reads 5,000 SDP clients as 2.5M/h vs its own table's 5M (estimator sides with the example for that band, 16 Sep); storage-table row 3 states 540 GB/mo but totals imply 720 | management-data-lake | On each recheck: if Cato fixes either, remove the on-page callout/footnote and simplify |
| Field-calibration figure on the data-lake page: ~42 Gbps / ~43K SDP users with WAN FW+SWG+ATP+CASB peaking ~31M events/hour (anonymised field observation, Sep 2026) — drives the floor/ceiling range in datalake-calc.js and the on-page callout | management-data-lake | Refresh when a newer field measurement exists; if the KB ever publishes non-additive guidance, rebase the floor on the KB instead |
| CMA nav naming drift: current KB shows "Home → Experience Monitoring (Probes)", "Resources → Device Posture", "Home → Devices", "Account → Audit Trail"; library chips use Monitor →/Access →/Assets →/Administration → conventions (EM probes chips aligned to Home → 23 Jul) | all pages with path chips | Confirm against the live CMA, then align the convention library-wide in one sweep |

Rendering note: as of 19 Jul 2026 measure_svg.py runs completely silent — all label
bleeds fixed, and the script now ignores rects wider than 250 user-units (band/container
rects are not node boxes). A non-silent run means a real regression.
