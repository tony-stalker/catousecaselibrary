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
| Browser Extension = native Chrome; ChromeOS client + Google Workspace SCIM not in documented lists | access-byod-clientless, migration-iboss | Quarterly — support lists grow |
| AI Security: End Users and Apps are separate per-user licences; Enterprise Browser included in ZTNA licence | AI Security pages, access-byod-clientless | On licensing announcements |
| AI gateway support = LiteLLM; Outpost = separate licence | ai-homegrown-apps | Quarterly — gateway list will grow |
| AI Visibility Assessment deck is DRAFT (Apr 2026), offer "no cost, limited time" | security-ai-visibility | On deck update — remove draft callout |
| Cato↔ASA IKEv2 multi-TS incompatibility + remedies; IPsec parameter/throughput figures | network-ipsec-asa | Semi-annually vs KB |
| Socket v15 BGP community 32768 requirement | migration-methodology | When v15 is universal — drop the caveat |
| Cyber Essentials (Willow) & NCSC CAF versions | security-uk-public-sector | Annually (IASME/NCSC refresh) |
| DORA applies from 17 Jan 2025 | security-finance-dora | Stable as history |
| "80+ PoPs" and PoP lists | network-global-expansion, others | Semi-annually — count grows |
| Cloud Interconnect provider list & PoP availability/lead times | network-cloud-interconnect | Semi-annually vs KB |
| Cato Terraform provider parallelism=1 caveat | migration-cloudflare | Semi-annually |

Rendering note: as of 19 Jul 2026 measure_svg.py runs completely silent — all label
bleeds fixed, and the script now ignores rects wider than 250 user-units (band/container
rects are not node boxes). A non-silent run means a real regression.
