# Migrating from Sophos to Cato SASE — SE brief (UK mid-market focus)

Scope: Sophos Firewall (XG/XGS running SFOS), SD-RED edge devices and Sophos SD-WAN,
Sophos ZTNA (now Workspace Protection), and Sophos Connect / SSL VPN remote access, moving to
the Cato SASE Cloud platform. Deliberately OUT of scope for replacement: Sophos Endpoint
(Intercept X), XDR and MDR — the standard play in these accounts is **keep the Sophos endpoint
stack, replace the network stack** (see §2). Anything not tied to a listed source is marked
**[recommended practice]**. Items drawn from Cato Professional Services enablement decks are
marked **[Cato PS internal]** (no public URL).

---

## 1. Vendor snapshot

### The estate you will actually find

Unlike a Cisco account, a Sophos estate genuinely is one vendor and largely one console —
Sophos Central manages firewalls, switches, wireless, email, endpoint and MDR from a single
cloud console. Do not open with a "console sprawl" pitch; it will not land. The typical UK
mid-market estate:

- **XGS (or legacy XG) firewalls** at HQ/DC and larger branches, running SFOS — current
  releases are v21.5 (GA 2 Jun 2025, MR2 Feb 2026) and v22 (released Dec 2025; MR1 Apr 2026,
  MR2 since announced). v22 is a "Secure by Design" architectural overhaul: hardened 6.6+
  kernel, containerised services, an embedded Sophos XDR Linux sensor watching the firewall
  itself, CIS-benchmark health checks.
- **SD-RED 20/60 devices** at small sites — plug-and-play remote Ethernet devices that tunnel
  everything back to a central Sophos Firewall (management is from the firewall; a Network
  subscription is required). Legacy RED 15/50 hit end-of-sale 31 Aug 2020 and end-of-life
  31 Aug 2023.
- **"SD-WAN"** = SD-WAN policy routing on the firewalls plus **Central Orchestration** (an
  SFOS licence, included in the Xstream Protection bundle) which auto-builds the VPN mesh or
  hub-and-spoke between Sophos Firewalls from Sophos Central. It is firewall-to-firewall IPsec
  over the public internet — there is no private backbone or middle-mile.
- **Remote access**: Sophos Connect client (IPsec and SSL VPN) terminating on the firewall;
  the older standalone SSL VPN client is EOL (see table). Entra ID SSO for Sophos Connect
  arrived in v21.5.
- **Sophos ZTNA**: agent + gateway model; since SFOS 19.5 MR3 the ZTNA gateway is built into
  the firewall (no separate VM), gateways are free and licensing is per user. From
  Feb 2026 ZTNA is being folded into the new **Sophos Workspace Protection** bundle and
  disappears as a standalone SKU (see table).
- **Sophos Endpoint / Intercept X, XDR, MDR** — usually present, usually liked, usually the
  reason the account is a Sophos shop at all (§2).
- Procurement is very often **via an MSP**: Sophos is explicitly channel-first, defends
  250,000+ customers through MSPs, and sells monthly consumption billing through MSP
  Connect Flex (plus the MSP Elevate programme launched May 2025).

### Verifiable migration drivers (EOL, forced refresh, price rises)

| Sophos milestone | Date | Consequence |
|---|---|---|
| XG-series licence prices raised ~30% | 1 Oct 2024 | Renewal shock on ageing hardware |
| Last order date for XG hardware renewal SKUs | 31 Jan 2025 | No more paid extensions |
| **All XG-series hardware end-of-life / end-of-support** | **31 Mar 2025** | Base firewall/VPN keeps running but receives no fixes — any new vulnerability stays unpatched; SFOS v21+ never supported XG, so staying current means buying XGS |
| SG/UTM renewal SKUs raised 20% | 1 Jun 2025 | Same squeeze on the older SG estate |
| ZTNA gateways on ESXi/Hyper-V older than v2.1, or on EOL SFOS, unsupported | 1 Oct 2025 | Forced gateway upgrades |
| SFOS v22 released — requires XGS or virtual; no XG/SG support | Dec 2025 | Software carrot tied to hardware refresh |
| Sophos Workspace Protection GA; ZTNA auto-upgraded into it | late Feb 2026 (targeting 26 Feb) | New bundle, new pricing at renewal |
| MSP ZTNA billing transitions to Workspace Protection — "a price increase will apply in most cases" (Sophos' words) | late Apr 2026 | MSP-billed ZTNA gets dearer |
| Standalone ZTNA term SKUs no longer orderable | 1 May 2026 | Product-as-bought ceases to exist |
| Flat 10% global price increase on XGS hardware and related subscriptions | 1 Jul 2026 | The refresh quote just went up again |

Talking point: an XG customer in 2026 is already past end-of-support, has absorbed a 30%
licence rise, is being quoted XGS hardware that costs 10% more from July 2026, and is watching
the remote-access products they bought (SSL VPN client, standalone ZTNA) be retired or
repackaged. The refresh money is being spent either way — the question is whether it buys
another appliance cycle or removes the appliance cycle. **[recommended practice]**

### The security-history driver (handle with care)

Sophos' own **Pacific Rim** report (Oct 2024) documents a five-year campaign by interlinked
China-based actors (TTP overlaps with Volt Typhoon, APT31, APT41) specifically targeting
Sophos firewalls — zero-days used to plant webshells and rootkits on WAN-facing portals.
Exploited-in-the-wild SFOS CVEs in the **CISA Known Exploited Vulnerabilities catalogue**:

| CVE | What | Notes |
|---|---|---|
| CVE-2020-12271 | Pre-auth SQL injection → RCE ("Asnarök"), XG Firewall admin/User Portal on WAN | Exploited in the wild Apr 2020; in CISA KEV |
| CVE-2020-15069 | Buffer overflow in HTTP/S bookmarks (clientless access) → RCE | Exploited per Pacific Rim; added to KEV 6 Feb 2025 |
| CVE-2020-29574 | CyberoamOS SQL injection (legacy Cyberoam line) — used to create a hidden "cybersupport" admin | Added to KEV 6 Feb 2025 |
| CVE-2022-1040 | Auth bypass → RCE in User Portal/Webadmin | Exploited by "Drifting Cloud" APT; in CISA KEV |
| CVE-2022-3236 | Code injection → RCE in User Portal/Webadmin | Zero-day against South-Asia targets; in CISA KEV |
| CVE-2024-12727 / -12728 / -12729 | Dec 2024 trio (SQLi in email protection, weak HA SSH passphrase, post-auth injection); two rated CVSS 9.8 | Hotfixed Dec 2024; not in KEV — patched before broad exploitation |

Frame this fairly: Sophos handled Pacific Rim with unusual transparency, ships hotfixes
automatically by default, and the 2024 trio was fixed fast. The argument is **architectural,
not vendor-shaming**: every WAN-facing appliance portal (any vendor) is attack surface the
customer must patch on the customer's timeline; a cloud-delivered SASE PoP removes that class
of exposure from the customer's estate entirely. The same argument applies to the
firewall-hosted ZTNA gateway and VPN portal. **[recommended practice]**

---

## 2. What Sophos does well — and the shape of the play

Be explicit about this in the room; it builds credibility and narrows the deal to winnable
scope:

- **Endpoint**: Sophos is a Leader in the Gartner Magic Quadrant for Endpoint Protection
  Platforms for the 17th consecutive report (2026), and a 2025 Gartner Peer Insights
  Customers' Choice for both EPP and XDR.
- **MDR**: 26,000+ MDR customers as of Jan 2025 (37% growth in 2024), 30K+ claimed on the
  current company page — Sophos calls it the most widely used MDR service in the world.
- **Scale**: 600K+ customers globally.

**The play**: keep Sophos Endpoint/Intercept X and MDR; replace the network stack (firewalls,
SD-RED, SD-WAN VPN, Sophos Connect, ZTNA) with Cato. **[recommended practice]**

Two accuracy notes for SEs:

1. **Do NOT claim "Cato has no endpoint offering".** Cato sells Cato EPP — a SASE-managed
   endpoint protection platform powered by Bitdefender's prevention engine, managed from CMA,
   feeding the same data lake as Cato XDR (launched Jan 2024). The honest positioning: Cato
   EPP exists as a consolidation option, but Sophos' endpoint stack is a Gartner MQ Leader the
   customer already owns and staffs — replacing it is a separate conversation, not a
   prerequisite. Cato does not sell an endpoint-focused MDR equivalent to Sophos MDR's
   human-led endpoint response; keep that boundary clean. **[recommended practice]**
2. The customer loses nothing on the endpoint side by moving the network: Sophos Endpoint and
   MDR do not require a Sophos Firewall. What IS lost is Sophos' firewall↔endpoint
   Synchronized Security / Security Heartbeat lateral-isolation trick and the v21.5 NDR
   Essentials feed into Sophos Central — cover both honestly in §5.

---

## 3. Component → Cato mapping

| Sophos component | Function | Cato equivalent | Notes |
|---|---|---|---|
| XGS/XG firewall (SFOS) — firewall rules, IPS, ATP | Edge NGFW | Cato FWaaS (Internet + WAN firewall), IPS, anti-malware at the PoP | Removes appliance sizing, HA pairs, firmware/hotfix cycle and WAN-facing portals |
| Web Protection subscription (web filtering, TLS inspection on-box) | SWG | Cato SWG / Internet firewall categories + cloud TLS inspection | Cloud TLS inspection scales without appliance headroom maths (§5) |
| Zero-Day Protection (sandboxing/ML) | Unknown-file analysis | Cato anti-malware + threat prevention at the PoP | Position as engine-for-engine coverage in the same single pass |
| Xstream SD-WAN + SD-WAN policy routing + Central Orchestration VPN mesh | SD-WAN overlay between Sophos Firewalls | Cato Socket (X1500/X1600/X1700) + Cato global private backbone | Sophos overlay is firewall-to-firewall IPsec over public internet; Cato adds the private middle-mile and PoP-based any-to-any routing |
| SD-RED 20/60 | Tunnel-everything small-site edge, managed from the central firewall | Cato Socket (zero-touch, self-provisioning) | SD-RED has no local inspection — traffic is inspected at the hub firewall; a Socket site gets full inspection at the nearest PoP with no hairpin |
| Sophos Connect (IPsec/SSL VPN) + firewall VPN portal | Remote-access VPN | Cato Client (SDP/ZTNA) + clientless browser access | No VPN termination on an appliance; users hit the nearest PoP with the same inspection as sites |
| Sophos ZTNA / Workspace Protection (agent + firewall-hosted or VM gateway) | Per-app zero-trust access | Cato ZTNA (Client + Client Connectivity Policy + Device Posture) | Cato ZTNA is delivered from the PoP, not from a gateway on the customer's firewall |
| Sophos DNS Protection | Protective DNS | Cato DNS Security (DNS Protections in IPS) | Inline at the PoP for all traffic |
| Sophos Central (network portion: firewall management, Central Firewall Reporting, SD-WAN groups) | Cloud management/reporting for the network estate | Cato Management Application (CMA) | Sophos Central **stays** for endpoint/MDR — the network objects leave it |
| NDR Essentials (v21.5, Xstream bundle) | Network detection feed | Cato XDR network stories (native sensor = the PoP) | Cato XDR sees all site+user traffic without appliance taps |
| Synchronized Security / Security Heartbeat | Firewall↔endpoint health signalling, auto-isolation | No direct equivalent; nearest: Cato Device Posture (EPP/AV checks incl. third-party) gating access via Client Connectivity Policy | Be upfront — see §5 |

---

## 4. Recommended migration path

Anchored to the Cato PS methodology — Export → Review & Map → Deploy → Optimise, with a
discovery → co-existence → pilot → phased cutover → decommission arc. **[Cato PS internal]**

### Phase 0 — Discovery and design

- Inventory: firewall models and SFOS versions (any XG left = already unsupported — lead with
  it), SD-RED sites and their hub firewalls, Central Orchestration SD-WAN connection groups
  (mesh vs hub-and-spoke), Sophos Connect user counts and whether IPsec or SSL VPN, ZTNA
  apps/gateways (firewall-hosted vs VM), Xstream vs Standard Protection bundles and renewal
  dates per box, MSP contract terms and Flex billing arrangements.
- Export the SFOS rule bases (firewall rules, web policies, SD-WAN routes, NAT) per appliance —
  SFOS backup files plus the XML API/config export feed the Review & Map workbook.
  **[recommended practice]**
- Map renewal dates against the price-rise calendar in §1 — the 1 Jul 2026 XGS increase and
  Workspace Protection renewal repricing are natural decision forcing-points.
  **[recommended practice]**
- Identify Synchronized Security dependencies (heartbeat-based firewall rules, auto-isolation
  runbooks) and agree replacements before cutover (§5).

### Phase 1 — Co-existence foundation

- Stand up the Cato account: CMA admin model, IdP SSO + SCIM (Entra ID — the estate is almost
  always Microsoft), base policy from Cato best-practice templates.
- Co-existence pattern: mid-market Sophos estates are usually small enough (5–50 sites) for
  **parallel connectivity at each site** (Socket alongside the XGS, L3 handoff, move subnets
  progressively). For hub-and-spoke estates, an interconnect at the hub XGS via IPsec or eBGP
  handoff carries un-migrated RED/branch traffic to Cato-side resources during the transition —
  the same hub-interconnect pattern PS uses for FortiGate estates. **[Cato PS internal]**
- Keep the Sophos overlay authoritative for un-migrated sites; filter default routes at the
  interconnect. **[Cato PS internal]**

### Phase 2 — Pilot

- 1–3 representative sites: at least one SD-RED site (the simplest possible swap — an
  unmanaged tunnel device for a zero-touch Socket) and one XGS site with local rules.
- Pilot users on the Cato Client alongside Sophos Connect cohorts — validate SSO, posture and
  app access; test Client/Connect coexistence on shared machines before scaling, and confirm
  the Sophos endpoint agent and Cato Client behaviour together in the pilot cohort (see §5).
  **[recommended practice]**
- Policy pilot: map SFOS firewall rules + web policy categories + TLS exclusions to Cato
  Internet/WAN firewall rules, system/custom categories and TLS-inspection rules; run IPS and
  TLS inspection in monitor/report mode first. Review-and-map, not lift-and-shift — per-box
  rule bases collapse into one global policy. **[recommended practice]**

### Phase 3 — Phased site cutover

- SD-RED sites first: ship a Socket, move the LAN, delete the RED interface on the hub
  firewall. Rollback = re-plug the RED (it re-establishes its tunnel to the hub).
  **[recommended practice]**
- XGS sites by wave: Socket in parallel → move subnets/VLANs → withdraw the site from the
  Central Orchestration SD-WAN group → prefixes propagate via the interconnect → validate →
  leave the XGS racked through the soak window. Rollback = re-add the connection-group
  membership. **[recommended practice]**
- Update anything keyed to site egress IPs (SaaS allowlists, partner firewalls) per wave.
  **[recommended practice]**

### Phase 4 — Users, remote access and ZTNA

- Cohort rollout of the Cato Client via MDM/Intune; split-tunnel first, then always-on with
  Client Connectivity Policy + Device Posture. Remove Sophos Connect profiles per cohort;
  retire the firewall VPN portal (a WAN-facing portal — see the CVE table) as the last cohort
  clears. **[recommended practice]**
- ZTNA: recreate per-app policies as Cato application access rules; decommission
  firewall-hosted ZTNA gateways with the firewalls. Time this against the Workspace
  Protection forced transition (Feb–May 2026) — customers mid-transition have a natural exit
  point before renewal repricing. **[recommended practice]**

### Phase 5 — Optimise and decommission

- Tighten monitor-mode rules to block, widen TLS inspection scope, tune QoS/bandwidth
  priorities on the backbone. **[Cato PS internal]**
- Decommission order: SD-REDs → branch XGS → hub XGS/interconnect → VPN portal/ZTNA gateways →
  lapse Network/Web/Xstream firewall subscriptions at renewal. **Retain Sophos Central with
  Endpoint/XDR/MDR licences** — flag to the MSP that only the network SKUs are lapsing.
  **[recommended practice]**

---

## 5. Gotchas and objection handling

- **TLS-inspection appliance sizing is the wedge.** Sophos' own XGS marketing leads with
  4.8–5× TLS-inspection throughput gains over XG precisely because inspection throughput, not
  headline firewall throughput, is what runs out. Size any appliance comparison on
  inspected-traffic numbers, and position cloud TLS inspection as removing the sizing exercise
  (and the mid-life "we need a bigger box to turn inspection on" upgrade) entirely.
  **[recommended practice]**
- **"Sophos is already one console."** True for the vendor suite — concede it. The counters:
  (1) the network estate is still appliance-anchored: per-box firmware, hotfixes, HA pairs,
  hardware EOL cycles and WAN-facing portals; (2) the SD-WAN overlay has no private backbone —
  international or cloud-bound traffic rides the public internet between firewalls; (3) v22's
  headline features are about hardening the appliance itself (embedded XDR sensor watching the
  firewall, kernel hardening) — evidence that the appliance remains the attack surface.
  **[recommended practice]**
- **Synchronized Security / Security Heartbeat loss.** Firewall-triggered endpoint isolation
  and heartbeat-conditional rules disappear with the XGS. Replacements: Cato Device Posture
  checks (anti-malware/EDR presence incl. third-party) gating access continuously via Client
  Connectivity Policy, and MDR-side response through Sophos' own tooling. Surface this in
  discovery, not after the objection lands. **[recommended practice]**
- **NDR Essentials disappears with the firewall.** It is an Xstream-bundle feature of v21.5.
  Counter: Cato XDR's native network sensor is the PoP itself — no appliance needed for
  network detection, and it covers remote users too. **[recommended practice]**
- **The MSP is the real buyer.** UK mid-market Sophos is heavily MSP-mediated (channel-first,
  MSP Flex monthly billing, 250K+ customers via MSPs). A rip-and-replace pitched to the end
  customer that strands the MSP's margin will be resisted. Bring the MSP into the deal —
  Cato's partner-delivered model, or split the account: MSP keeps endpoint/MDR management in
  Sophos Central, adds Cato as the network platform. **[recommended practice]**
- **"ZTNA is free with our firewall."** The gateway is free and built into SFOS 19.5 MR3+;
  users are licensed per seat, and from Feb–May 2026 that seat licence becomes Workspace
  Protection with Sophos itself warning MSPs "a price increase will apply in most cases."
  Also: a ZTNA gateway hosted ON the edge firewall means app access terminates on exactly the
  appliance class documented in the KEV table. **[recommended practice]**
- **Legacy remnants.** The standalone SSL VPN client went EOL 31 Jan 2022 and SFOS 20.0 MR1+
  refuses its connections — estates that upgraded recently may have just re-onboarded users to
  Sophos Connect, so re-onboarding to the Cato Client is a like-for-like motion they have
  already practised, not a novel disruption. Audit what is actually installed per cohort.
  **[recommended practice]**
- **RED tunnel modes.** RED/SD-RED sites can run in transparent/bridged modes where the remote
  LAN is effectively part of the hub network (L2 semantics); Cato sites are routed (L3). Check
  RED operating modes in discovery and plan re-addressing or local DHCP where a site relied on
  bridging. **[recommended practice]**
- **Don't oversell the security history.** Sophos patched fast, ships automatic hotfixes by
  default, and published Pacific Rim voluntarily. Use the KEV table to argue the appliance
  *category* is structurally exposed — the same table exists for Fortinet, Palo Alto, Cisco and
  Ivanti — and Cato removes the category, not to argue Sophos is uniquely bad.
  **[recommended practice]**
- **Endpoint entanglement in bundles.** Where firewall and endpoint renew together (common
  under MSP Flex monthly billing this is easy; under term deals check co-termination), separate
  the renewals so the endpoint stack can stay without dragging the firewall renewal along.
  **[recommended practice]**

---

## 6. Sources

**Sophos hardware / software lifecycle**
- XG-series hardware EOL FAQ (31 Mar 2025; v21 requires XGS; backup/restore migration, 30-day licence grace): https://community.sophos.com/sophos-xg-firewall/b/blog/posts/xg-series-hardware-end-of-life-eol-frequently-asked-questions
- Sophos network-products retirement calendar: https://support.sophos.com/support/s/article/KBA-000003353
- XG final renewal-SKU order date 31 Jan 2025: https://partnernews.sophos.com/en-us/2025/01/products/xg-eol-final-order-date-for-xg-hardware-renewal-skus/
- Third-party lifecycle calendar (XG per-model EOS/EOL; RED 15/50 EOS 31 Aug 2020, EOL 31 Aug 2023; SD-RED 20/60 "not declared"): https://www.avanet.com/en/kb/sophos-product-lifecycle-calendar-end-of-sale-end-of-life/
- SFOS v21.5 GA announcement (2 Jun 2025; NDR Essentials with Xstream bundle; Entra ID SSO for Sophos Connect; no XG/SG support): https://community.sophos.com/sophos-xg-firewall/b/blog/posts/sophos-firewall-v21-5-is-now-available and https://partnernews.sophos.com/en-us/2025/06/products/sophos-firewall-v21-5-now-available/
- SFOS v21.5 release notes (MR2 Build 323, Feb 2026): https://docs.sophos.com/releasenotes/output/en-us/nsg/sf_215_rn.html
- SFOS v22 announcement / release notes (Dec 2025; hardened kernel, containerised services, XDR Linux sensor, CIS health check): https://community.sophos.com/sophos-xg-firewall/b/blog/posts/sophos-firewall-v22-is-now-available and https://docs.sophos.com/releasenotes/output/en-us/nsg/sf_220_rn.html
- SFOS v22 feature overview: https://www.sophos.com/en-us/blog/sophos-firewall-v22-your-top-requested-features and https://www.avanet.com/en/blog/sophos-firewall-v22/
- v22 MR1 (Apr 2026): https://partnernews.sophos.com/en-us/2026/04/products/sophos-firewall-v22-mr1-is-now-available/ · v22 MR2: https://www.sophos.com/en-us/partner-news/sophos-firewall-v22-mr2-is-now-available

**Pricing / renewal pressure**
- XG licences +30% from 1 Oct 2024: https://www.avanet.com/en/blog/sophos-xg-firewall-licenses-get-30-percent-more-expensive/
- SG/UTM renewals +20% from 1 Jun 2025: https://www.schneider.im/sophos-utm-and-sg-series-end-of-life-and-price-increase/
- XGS hardware + subscriptions +10% from 1 Jul 2026: https://www.avanet.com/en/blog/sophos-firewall-price-increase-2026/ and https://www.openpr.com/news/4509035/sophos-xgs-firewalls-to-become-more-expensive-starting-july-2026

**Management / SD-WAN / SD-RED**
- Sophos Firewall product page (Sophos Central single cloud console positioning): https://www.sophos.com/en-us/products/next-gen-firewall
- Central SD-WAN VPN Orchestration (mesh/hub-and-spoke auto-build; Central Orchestration licence; included in Xstream bundle; CFR Advanced 30-day retention): https://www.sophos.com/en-us/blog/sophos-central-sd-wan-vpn-orchestration-early-access-is-now-available
- SD-WAN connection groups (Central docs): https://docs.sophos.com/central/customer/help/en-us/ManageYourProducts/FirewallManagement/SDWANConnectionGroup/index.html
- Xstream SD-WAN page (firewall + SD-RED positioning): https://www.sophos.com/en-us/products/next-gen-firewall/sd-wan
- SD-RED product page (managed from the firewall): https://www.sophos.com/en-us/products/next-gen-firewall/sd-red-sd-wan-edge-device
- SD-RED launch / vs legacy RED FAQ (SD-RED 20/60 specs, RED 15/50 EOS 31 Aug 2020, Network subscription for firewall management): https://partnernews.sophos.com/en-us/2020/05/products/sd-red-remote-ethernet-devices-plug-and-play-connectivity-for-the-network-edge/ and https://partnernews.sophos.com/en-us/2020/08/products/selling-sophos-sd-red-vs-legacy-red-frequently-asked-questions/ and https://www.avanet.com/en/blog/new-sophos-hardware-sd-red-20-and-sd-red-60-available/
- RED device requirements and traffic behaviour (tunnel/bridge modes): https://docs.sophos.com/nsg/sophos-firewall/20.0/Help/en-us/webhelp/onlinehelp/AdministratorHelp/Network/Interfaces/REDInterfaces/RED50vsRED60Behavior/index.html

**Licensing bundles**
- Firewall bundle comparison (Standard vs Xstream; Xstream = Base + Network + Web + Zero-Day Protection + Central Orchestration + Enhanced Support): https://www.avanet.com/en/kb/which-sophos-firewall-bundles-are-available/ and https://www.vodanetsystems.com/blog/post/sophos-firewall-licensing-guide

**ZTNA / remote access**
- ZTNA on Sophos Firewall (integrated gateway from SFOS 19.5 MR3; free gateways; per-user licensing): https://www.sophos.com/en-us/blog/introducing-sophos-ztna-on-sophos-firewall and https://www.avanet.com/en/blog/sophos-ztna-gateway-on-sophos-firewall/
- Free ZTNA licences for firewall customers: https://www.sophos.com/en-us/blog/free-ztna-licenses-for-sophos-firewall-customers
- ZTNA → Workspace Protection transition (GA target 26 Feb 2026; standalone SKUs end 1 May 2026; MSP billing transition late Apr 2026 with price increase "in most cases"): https://www.sophos.com/en-us/partner-news/sophos-ztna-transition-to-sophos-workspace-protection
- ZTNA gateway platform-support cutoffs from 1 Oct 2025: https://partnernews.sophos.com/en-us/2025/06/products/whats-new-in-sophos-ztna-new-features-and-insights-for-june-2025/
- Legacy SSL VPN client EOL (31 Jan 2022): https://community.sophos.com/sophos-xg-firewall/b/blog/posts/end-of-life-for-sophos-ssl-vpn-client
- SFOS 20.0 MR1 refuses legacy SSL VPN client connections; Sophos Connect is the current client: https://support.sophos.com/support/s/article/KBA-000004884 and https://docs.sophos.com/nsg/sophos-firewall/21.0/Help/en-us/webhelp/onlinehelp/AdministratorHelp/RemoteAccessVPN/index.html
- Sophos Connect vs SSL VPN client background: https://www.avanet.com/en/kb/sophos-connect-client-vs-ssl-vpn-client-what-s-the-difference/

**Security history / CVEs**
- Pacific Rim report + timeline (5-year China-based campaigns; CVE-2020-29574 "cybersupport" account; CVE-2020-15069 exploitation; CVE-2022-1040 zero-day): https://www.sophos.com/en-us/content/pacific-rim and https://www.sophos.com/en-us/blog/pacific-rim-timeline and https://www.sophos.com/en-us/press/press-releases/2024/10/hunter-versus-spy-sophos-pacific-rim-report-details-its-defensive-and
- Pacific Rim coverage: https://www.bleepingcomputer.com/news/security/sophos-reveals-5-year-battle-with-chinese-hackers-attacking-network-devices/
- CISA KEV catalogue (search vendor Sophos): https://www.cisa.gov/known-exploited-vulnerabilities-catalog
- CISA adds CVE-2020-29574 and CVE-2020-15069 to KEV (6 Feb 2025): https://www.cisa.gov/news-events/alerts/2025/02/06/cisa-adds-five-known-exploited-vulnerabilities-catalog and https://www.bleepingcomputer.com/news/security/cisa-warns-of-actively-exploited-windows-sophos-and-oracle-bugs/
- CVE-2020-12271 (NVD — exploited in the wild Apr 2020): https://nvd.nist.gov/vuln/detail/cve-2020-12271
- CVE-2022-1040 Drifting Cloud exploitation: https://www.securityweek.com/sophos-firewall-zero-day-exploited-attacks-south-asian-organizations/
- CVE-2022-3236 exploitation + KEV: https://www.helpnetsecurity.com/2022/09/26/cve-2022-3236/ and https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=CVE-2022-3236
- Sophos advisory CVE-2024-12727/-12728/-12729 (hotfix dates, affected-device percentages, auto-hotfix default): https://www.sophos.com/en-us/security-advisories/sophos-sa-20241219-sfos-rce and https://thehackernews.com/2024/12/sophos-fixes-3-critical-firewall-flaws.html

**TLS-inspection sizing**
- Xstream TLS FastPath (v19.5) and XG→XGS TLS-inspection throughput uplifts (XG 86 75 Mbps → XGS 87 375 Mbps; XG 210 230 Mbps → XGS 2100 1,100 Mbps): https://www.sophos.com/en-us/blog/sophos-firewall-v19-5-xstream-tls-fastpath-architecture-enhancements

**Sophos strengths (the keep-endpoint side)**
- Gartner MQ EPP Leader, 17th consecutive report (2026): https://www.sophos.com/en-us/blog/gartner-epp-mq-17 · 16th (2025): https://www.sophos.com/en-us/press/press-releases/2025/07/sophos-named-leader-2025-gartnerr-magic-quadranttm-endpoint-protection
- Gartner Peer Insights Customers' Choice EPP + XDR (2025): https://www.sophos.com/en-us/press/press-releases/2025/06/sophos-named-2025-gartnerr-peer-insightstm-customers-choice-both-0
- Sophos MDR 26,000+ customers, +37% in 2024 (Jan 2025): https://www.sophos.com/en-us/press/press-releases/2025/01/sophos-mdr-defends-26000-customers-worldwide-new-enhancements
- Company page (600K+ customers, 30K MDR customers): https://www.sophos.com/en-us/company
- Channel-first / MSP model (250K+ customers via MSPs; MSP Elevate launch May 2025): https://www.sophos.com/en-us/press/press-releases/2025/05/sophos-msp-elevate-program-0 and https://news.sophos.com/en-us/2025/05/13/introducing-the-sophos-msp-elevate-program/
- MSP Connect Flex consumption billing: https://www.sophos.com/en-us/partners/managed-service-providers

**Cato documentation**
- Cato EPP (Bitdefender-powered, CMA-managed): https://www.catonetworks.com/platform/endpoint-protection-epp/ and https://support.catonetworks.com/hc/en-us/articles/12919234397981-Getting-Started-with-Cato-s-Endpoint-Protection-EPP
- Cato XDR + EPP launch (Jan 2024, shared data lake): https://www.prnewswire.com/news-releases/cato-networks-introduces-worlds-first-sase-based-xdr-302041995.html
- What are Cato Sockets (zero-touch): https://support.catonetworks.com/hc/en-us/articles/30175650827677-What-are-Cato-Sockets
- Internet firewall: https://support.catonetworks.com/hc/en-us/articles/4413273486865-What-is-the-Cato-Internet-Firewall
- What is Cato DNS: https://support.catonetworks.com/hc/en-us/articles/22410218141213-What-is-Cato-DNS
- Device Posture profiles/checks: https://support.catonetworks.com/hc/en-us/articles/7387501459357-Creating-Device-Posture-Profiles-and-Device-Checks
- Client Connectivity Policy: https://support.catonetworks.com/hc/en-us/articles/4415419573393-Configuring-the-Client-Connectivity-Policy
- Using BGP in the Cato Cloud: https://support.catonetworks.com/hc/en-us/articles/7825408860573-Using-BGP-in-the-Cato-Cloud
- SCIM provisioning: https://support.catonetworks.com/hc/en-us/articles/13651160092701-Provisioning-Users-with-SCIM

**Internal (no public URL)**
- Cato PS enablement deck 2026 — co-existence patterns (parallel connectivity, hub interconnect
  with eBGP, route filtering), phased-cutover and rollback runbooks, reused here for
  XGS/SD-RED estates.

---

## Unresolved (not sourced during research — do not state on pages)

- Sophos HQ location / "UK home-grown vendor" angle (widely reported as Oxford/Abingdon, UK,
  but not verified from a fetched source in this pass).
- SD-RED 20/60 end-of-sale or end-of-life dates — none declared as of this research
  (lifecycle calendar lists them as "not declared"); do not claim SD-RED is EOL.
- UK-specific Sophos mid-market market-share figures.
- Whether Sophos Connect (or the Sophos endpoint agent) and the Cato Client are formally
  validated to coexist on one machine — no vendor statement found either way; test in pilot.
- Exact KEV date-added values for CVE-2020-12271, CVE-2022-1040 and CVE-2022-3236 (KEV listing
  confirmed; specific catalogue-entry dates not captured).
- "30K MDR customers" appears on the Sophos company page but the dated press-release figure is
  26,000 (Jan 2025) — prefer the press-release figure with date on pages.
