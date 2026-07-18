# Cloudflare → Cato SASE — Migration Brief

**Purpose:** SE-enablement research for the Use Case Library migration pages.
**Researched:** 18 July 2026 (web sources as of this date). UK English.
**Scope:** Cloudflare One (Zero Trust) — Access (ZTNA), Gateway (SWG / DNS filtering), WARP /
Cloudflare One Client, Cloudflare Tunnel (cloudflared), Magic WAN + Magic WAN Connector,
Magic Transit, Browser Isolation, DEX — moving to the Cato SASE Cloud platform.
**Out of scope (deliberately):** Cloudflare CDN, WAF, authoritative DNS, Workers, Magic
Transit DDoS scrubbing. Cato does not replace these — see §3 phase 1 and §5.
**Sourcing rule:** every product claim carries a source in §6. Field guidance without a public
source is marked **[recommended practice]**. Items drawn from the Cato Professional Services
enablement deck are marked **[Cato PS internal]** (no public URL; digest at
`_extract/andy-professional-services-deck-combined-slides-2026.md`).

---

## 1. Vendor snapshot

### How Cloudflare One estates come to exist

Cloudflare almost always lands in an account through the **CDN / WAF / DNS side** — the
website, the API, the DDoS story — and Zero Trust is adopted afterwards, often app-by-app:
one team puts an internal wiki behind Access, another spins up a cloudflared tunnel to a dev
server, DNS filtering gets switched on for roaming laptops. The commercial model encourages
exactly this: a genuinely **free Zero Trust plan for up to 50 users** (Cloudflare's original
"Zero Trust for everyone" positioning), then a self-serve **Pay-as-you-go** per-user tier,
then a negotiated **Contract/Enterprise** tier. The result on discovery is rarely a designed
SASE estate — it is an accretion of per-feature configurations across Access, Gateway,
Tunnels and Magic WAN, sometimes split across teams and even across Cloudflare accounts.
**[recommended practice]** (adoption pattern; the plan tiers themselves are sourced — §6).

### Feature-tier fragmentation (verifiable)

Capability depends heavily on which tier and which add-ons the customer bought:

| Capability | Availability (per Cloudflare docs/plans) |
|---|---|
| Access ZTNA, Gateway DNS/HTTP filtering, device client, cloudflared | All plans, including Free (≤50 users) |
| DEX (Digital Experience Monitoring) | "Available on all Cloudflare Zero Trust and SASE plans"; requires the Cloudflare One Client |
| Browser Isolation | **Add-on** to Pay-as-you-go and Enterprise plans only |
| Dedicated egress IPs (and BYOIP egress) | **Add-on to Enterprise-contracted** customers only |
| Custom DLP, expanded CASB, long log retention, SIEM integrations | Enterprise contract (third-party plan summaries; verify per customer) |
| Magic WAN / Magic Transit | Separately purchased network services, Enterprise-oriented |

Talking point: the "free/cheap" perception is set by the entry tiers, but the capabilities an
enterprise actually needs (RBI, dedicated egress IPs, retention, Magic WAN) sit in add-ons and
Enterprise contracts. Get the customer's real invoice on the table before any price debate.
**[recommended practice]**

### Branch networking: the thin end of the estate

- **Magic WAN** connects sites via **anycast GRE or IPsec tunnels** from the customer's
  existing routers/firewalls/SD-WAN devices — Cloudflare's own docs are built around
  third-party device configuration guides (Cisco, VMware, etc.).
- Cloudflare does now ship a lightweight box — the **Magic WAN Connector**, renamed
  **Cloudflare One Appliance** (hardware: Dell Virtual Edge Platform; or a virtual appliance).
  It auto-establishes IPsec tunnels and does priority-based WAN steering with ECMP. Be
  accurate about it: it exists, so "no appliance at all" is not a fair line.
- What the reference docs do and don't show (verifiable): **ICMP traffic is routed to the
  Internet and bypasses Cloudflare Gateway**; **no fail-open mode**; HA units cannot be
  cabled back-to-back (switch required); failover can take **up to 30 seconds**; and the
  Connector reference documents **no QoS / bandwidth-management capability** — steering, not
  shaping. There is no published last-mile management service; the last mile and the ISP
  relationship remain the customer's problem.
- Everything else at the branch — routing design, DHCP/LAN segmentation beyond the Connector's
  basics, appliance lifecycle, link monitoring — is DIY glue around tunnels.
  **[recommended practice]** (characterisation; individual doc facts sourced).

### Analyst positioning (2025 Gartner Magic Quadrant for SASE Platforms)

- **Cato Networks is a Leader** (repeat placement).
- **Cloudflare is a Visionary.** Third-party summaries of the report quote Gartner estimating
  **approximately 400 active enterprise customers for Cloudflare SASE**, with strengths in
  network/PoP coverage and innovation (post-quantum cryptography, AI). Do not quote the ~400
  figure without attributing it to Gartner via the cited summary — it is not a Cloudflare
  statement.
- Honest framing for SEs: Cloudflare's network and web-facing ZTNA are genuinely strong; the
  gap is SASE platform maturity on the WAN/branch side and enterprise operational depth. Sell
  the platform difference, not FUD about their network.

### Naming churn (discovery gotcha)

Cloudflare renamed several components during 2024–2026 and customers use the names
interchangeably: **WARP → "Cloudflare One Client"** in current docs; **Magic WAN docs now sit
under "Cloudflare WAN"**; **Magic WAN Connector → "Cloudflare One Appliance"**; the suite has
been marketed as Cloudflare for Teams → Cloudflare Zero Trust → Cloudflare One. Ask about
capabilities, not brand names, when running discovery.

---

## 2. Component → Cato mapping

| Cloudflare component | Function | Cato equivalent | Notes |
|---|---|---|---|
| **Access** applications + policies (self-hosted apps, private network apps, SaaS apps; include/require/exclude rules; service tokens for machine auth) | ZTNA — identity-aware access in front of applications | **Cato ZTNA (SDP)**: Client-based access governed by **WAN Firewall / Internet Firewall rules** per user/group/app, plus **Client Connectivity Policy**, device posture profiles and always-on/pre-login policies | Cato is network-integrated ZTNA: once the user connects to the PoP, app entitlements are firewall rules against application/segment objects — rebuild Access policy intent as rules, don't transliterate one-to-one. Access **service tokens** (machine-to-machine header auth) have no like-for-like equivalent — map those flows to site-to-site connectivity or IP/subnet-scoped rules and validate. **[recommended practice]** on the service-token mapping |
| **Access App Launcher** / clientless web access | Browser portal to internal web apps | **Cato Browser Access (Application Portal)** — clientless HTTP/S access to published apps and remote hosts, SSO-authenticated | SDP-licensed users; per-app publishing with no direct user-to-resource connectivity |
| **Gateway DNS policies** + DNS locations (office egress) | DNS filtering / resolver policy | **Cato DNS Security / DNS Protection** (part of the security stack; works with any DNS server) + Internet Firewall categories; DNS sinkholing to identify infected hosts | Cato inspects DNS in-line at the PoP for traffic already steered via Client/Socket — no separate "DNS location" construct to maintain for migrated sites |
| **Gateway HTTP + network policies**, TLS inspection | SWG: URL/category filtering, app control, inspection | **Cato Internet Firewall / SWG** + **TLS Inspection** (account-level policy, wizard-driven, CA cert to devices) | Same category/app/action model (Allow/Block/Prompt); Cato adds **RBI "Isolate"** as a policy action. Rebuild Do-Not-Inspect lists as TLS-inspection exceptions |
| **WARP / Cloudflare One Client** (+ device posture checks) | Device agent steering traffic to the edge; posture | **Cato Client** (Windows/macOS/Linux/iOS/Android) + **Device Posture profiles/checks**, Client Connectivity Policy, always-on | One agent for ZTNA + SWG + DEM on Cato too — like-for-like swap per cohort. Dual-agent caveat in §3/§5 |
| **Cloudflare Tunnel (cloudflared)** connectors | Outbound-only connector exposing private apps/networks | **Socket site / vSocket (AWS/Azure) / IPsec site** connecting the network the app lives in; app then published via ZTNA rules or Browser Access | Cato connects **networks/sites**, not per-app daemons. Each cloudflared connector's target network needs a Cato path (Socket, vSocket or IPsec) before the connector can retire — see §3 phase 3 |
| **Magic WAN** (anycast GRE/IPsec from customer devices) + **Magic WAN Connector / Cloudflare One Appliance** | Site-to-site WAN via Cloudflare's network | **Cato Socket** (edge SD-WAN device) or **IPsec IKEv2 site**, onto the **Cato Global Private Backbone** | What Cato adds over tunnel-based Magic WAN: a managed SD-WAN appliance with HA, link aggregation and app/link-quality steering; **QoS/bandwidth management profiles** (upstream+downstream, priority queues); **ILMM** — NOC-monitored last mile with proactive ISP ticketing; SLA-backed backbone PoP-to-PoP |
| **Magic Transit** | Network-layer DDoS protection for customer-owned public prefixes (BGP-advertised, min /24) | **No Cato equivalent — retain on Cloudflare** | Out of SASE scope. Say so explicitly; it builds credibility |
| **Browser Isolation** (add-on) | RBI for risky/uncategorised sites; clientless web isolation | **Cato RBI** — "Isolate" action alongside Block/Prompt in policy; engine delivered via Cato's partnership with Authentic8 | Single-click policy activation; no per-user add-on SKU decision inside the policy flow |
| **DEX** | Device/network/app experience monitoring, synthetic tests via the client | **Cato Digital Experience Monitoring (DEM)** | Cato DEM draws from existing sensors (Client, Socket, PoPs, backbone) — no extra agents; hop-by-hop Wi-Fi→edge→WAN visibility |
| **CASB / DLP** (tiered: API-only integrations on lower plans; custom DLP on Enterprise) | SaaS visibility/control, data protection | **Cato CASB** (inline + API, App Catalog risk scores, tenant restrictions) + **Cato DLP** (Data Control policy, EDM, OCR, MIP labels) | Map sanctioned-app and DLP profiles during phase 3 of rollout (§3) |
| **Email security (Area 1)** | Cloud email security | No direct Cato equivalent | Retain incumbent email security |
| **CDN / WAF / authoritative DNS / Workers / R2 etc.** | Application services / edge platform | **Stays on Cloudflare** | Not a SASE workload. The migration is scoped to Zero Trust + WAN |

---

## 3. Recommended migration path

Anchored to the Cato Professional Services four-phase methodology — **Phase 1 Discovery &
Design → Phase 2 Pilot, Build & Initial Rollout → Phase 3 Advanced Security & Broader
Rollout → Phase 4 Tune & Optimise** — with waved, business-unit-based SDP migration groups
and phased TLS inspection. **[Cato PS internal]** Cloudflare-specific detail below is
**[recommended practice]** unless a source is cited.

### Phase 1 — Discovery & Design

Inventory the Cloudflare estate precisely; it is usually more fragmented than the customer
believes:

- **Access:** every application (self-hosted, SaaS, private-network), its policies
  (include/require/exclude groups), **IdP integrations** (often several), **service tokens**
  (machine-to-machine — find the consumers, they break silently), device posture rules tied
  to WARP.
- **Gateway:** DNS policies and DNS locations (office networks pointing at Cloudflare
  resolver IPs/DoH), HTTP and network policies, TLS-inspection state and the Cloudflare root
  certificate deployment mechanism, Do-Not-Inspect lists.
- **Config export:** if the customer manages Cloudflare as code, the Terraform repo *is* the
  inventory. If not, use Cloudflare's **cf-terraforming** tool to export existing resources
  to HCL — it doubles as a point-in-time configuration snapshot for the migration runbook.
- **Connectivity:** every **cloudflared** connector (host, tunnel, replicas, which
  apps/networks route through it); every **Magic WAN** GRE/IPsec tunnel and any
  Connector/Cloudflare One Appliance; WARP split-tunnel (include/exclude) configuration.
- **Egress dependencies:** any third-party SaaS allowlists keyed to Cloudflare **dedicated
  egress IPs** (Enterprise add-on) — each one must be re-keyed during cutover (§5).
- **Stays-on-Cloudflare register:** CDN/WAF zones, authoritative DNS, Workers, Magic Transit
  prefixes, email security. Write this down and agree it with the customer — it defuses the
  "you're asking us to leave Cloudflare" objection early.
- Cato foundation: account and baseline config, IdP/SSO + **SCIM provisioning**, PoP/region
  plan, Socket logistics (plan and ship), SIEM integration planning, endpoint readiness
  (Client + TLSi certificates). **[Cato PS internal]**

**Design decisions:** Socket vs IPsec per site; which Access apps become Client-based ZTNA
rules vs Browser Access; TLS-inspection wave plan by URL category; egress IP allocation per
region (Cato allocated IPs).

### Phase 2 — Pilot, Build & Initial Rollout

- Convert security and access policies (SWG baseline from Cato recommended policies, then the
  customer's Gateway intent; Access apps → ZTNA rules for the pilot's apps). **[Cato PS
  internal]**
- **Pilot site:** deploy a Socket at one representative branch (or IPsec from the existing
  router if hardware hasn't shipped); validate Internet and WAN paths in parallel with Magic
  WAN, which stays up untouched.
- **Pilot users — the WARP→Cato Client cohort swap.** Treat WARP and the Cato Client as
  mutually exclusive on a device. Cloudflare's own guidance on running its client beside any
  other VPN agent is that both "compete" for routing, DNS and firewall control and
  responsibilities must be split per-product — precisely the fight you do not want on user
  laptops mid-migration. Cato likewise documents client coexistence limits in "Preparing to
  Install the Cato Client". The clean pattern: per cohort, **disable/remove the WARP profile
  via MDM, then deploy the Cato Client** — same maintenance window, per-device, reversible.
- Use the Cato **Client rollout pilot-users mechanism** (pilot user groups in the Client
  Upgrade Policy) to control version rollout to the pilot cohort.
- Validate: app access parity per Access app, DNS/HTTP policy hits, posture checks,
  performance (capture a DEM baseline), user feedback channel. **[Cato PS internal]**

### Phase 3 — Advanced Security & Broader Rollout

- **Users:** waved, business-unit-based SDP migration groups; posture analysis and Client
  Connectivity Policy tuning per wave. **[Cato PS internal]**
- **Sites:** re-terminate Magic WAN sites one at a time — preferred end-state is a **Socket**
  per site; where lead time or site type dictates, an **interim IPsec IKEv2 tunnel to Cato**
  from the existing edge device (configure primary + secondary tunnels to different Cato PoP
  IPs — Cato's documented HA best practice). Decommission the site's Magic WAN
  tunnels/Connector once traffic and routing are verified on Cato.
- **Private apps:** as each application's ZTNA rules (or Browser Access publication) are
  validated on Cato, retire the corresponding **cloudflared connector**. Because Cato
  connects the underlying network, one Socket/IPsec site typically replaces several
  per-app connectors at once — sequence connector retirement app-by-app anyway so rollback
  stays granular. **[recommended practice]**
- **DNS filtering handover order:** roaming users move automatically with the client swap
  (Cato Client carries DNS protection with it); office **DNS locations** are re-pointed only
  after the site's traffic is on Cato — never leave a site's DNS on Cloudflare after its
  traffic path has moved, or policy and logging split across two vendors. **[recommended
  practice]**
- **TLS inspection** phased by URL category; then CASB monitor-mode → selective enforcement;
  DLP monitoring → refined policies. **[Cato PS internal]**
- **Advanced protections** (IPS/NGAM/RBI/sandbox) enabled after baseline stability. **[Cato
  PS internal]** Where the customer had Browser Isolation, replicate the isolation intent as
  RBI "Isolate" actions on uncategorised/risky categories.

### Phase 4 — Tune & Optimise; decommission

- QoS tuning and prioritisation (bandwidth-management profiles per site), policy fine-tuning
  via analytics, threats-dashboard review, documentation, admin training, operational
  transition. **[Cato PS internal]**
- Decommission in order: cloudflared connectors → Magic WAN tunnels/appliances → Gateway
  policies/DNS locations → Access applications → WARP/MDM artefacts → reduce Zero Trust
  seats. **Do not delete the Cloudflare account** — CDN/WAF/DNS (and Magic Transit if
  present) remain live; the Zero Trust subscription is downgraded, not the tenant closed.
  **[recommended practice]**

---

## 4. Co-existence & rollback

Cloudflare-to-Cato is one of the safer co-existence stories, because the two control planes
barely touch:

- **Per-app parallel running:** an Access application and its Cato ZTNA rules can be live
  simultaneously — pilot users reach the app via Cato, everyone else still via Access. The
  cloudflared connector keeps serving Access until the last user cohort moves. Cutover is
  per-app and per-cohort, not big-bang. **[recommended practice]**
- **Per-device rollback:** the unit of user rollback is the agent. Re-enable/redeploy the
  WARP (Cloudflare One Client) profile via MDM and remove the Cato Client, and the user is
  back on Cloudflare in one device operation. Keep the WARP MDM profile and Zero Trust
  enrolment intact (not deleted) for the whole migration window. **[recommended practice]**
- **Per-site rollback:** keep Magic WAN tunnel configurations (and Connector hardware, if
  any) in place but idle until phase 4; re-pointing routing back to the existing GRE/IPsec
  tunnels restores the old path without re-provisioning. **[recommended practice]**
- **DNS rollback:** office DNS re-points to Cloudflare resolver/DoH endpoints; roaming users
  roll back with the agent swap.
- **What never moves:** the Cloudflare tenant stays for CDN, WAF, authoritative DNS, Workers
  and Magic Transit. Public-facing services keep their Cloudflare proxy/WAF in front; Cato
  secures the users and sites *behind* them. Position this as an architectural division of
  labour, not a partial failure of the migration.

---

## 5. Gotchas & objection handling

- **"Cloudflare is basically free."** True at the entry tiers (Free ≤50 users; self-serve
  per-user Pay-as-you-go) — and that is the anchor you must defuse. The enterprise
  comparison includes the add-ons (Browser Isolation, dedicated egress IPs), Enterprise
  contract features (custom DLP, retention, SIEM), Magic WAN, plus the appliance/edge
  hardware and the operational cost of the DIY glue at branches. Compare invoices and run
  the TCO on the converged estate, never on list per-seat price. **[recommended practice]**
- **Dual agents.** Do not let anyone "test Cato alongside WARP" on the same laptop.
  Cloudflare's own docs describe its client and any other VPN agent as competing for
  routing/DNS/firewall control and require carefully split responsibilities; Cato documents
  client coexistence limits too. Cohort swap, one agent at a time (§3 phase 2).
- **Terraform / config-as-code shops.** Cloudflare's developer-first customers often manage
  everything in Terraform and will ask if they lose that. Answer: **Cato has a public
  Terraform provider** (`catonetworks/cato` on the registry — Socket sites, IPsec sites,
  WAN firewall rules, routing, identity) plus a GraphQL API, with certified modules for
  bulk sites and vSockets. Be honest about the caveat: the API requires sequential
  execution, so Cato recommends running Terraform with `parallelism=1`.
- **Egress IP allowlists.** Enterprise customers using **dedicated egress IPs** (including
  BYOIP egress) typically have third-party SaaS allowlists keyed to those IPs. Every one
  must be re-keyed to the customer's **Cato allocated IPs** — per app, during that app's
  cutover window, with the old Cloudflare IPs left allowed until the wave completes.
  Find these in phase 1; they are the most common cause of "it worked yesterday" tickets.
  **[recommended practice]** (both vendors' egress-IP features are sourced)
- **No appliance to swap.** Many Cloudflare Zero Trust sites never had an edge device — a
  cloudflared daemon on a VM and WARP on laptops was the whole footprint. Introducing a
  Socket is therefore an *addition* to the site, not a swap; where no hardware is wanted,
  use a vSocket (cloud) or IPsec from existing kit, or serve small sites Client-only. Frame
  the Socket as what makes the site a first-class WAN citizen (QoS, HA, last-mile
  visibility, ILMM eligibility) rather than an imposed box. **[recommended practice]**
- **Gateway inspection gaps as talking points — use accurately.** Sourced examples: ICMP
  from the Cloudflare One Appliance bypasses Gateway inspection; the appliance has no
  fail-open and up to 30-second failover; Browser Isolation and dedicated egress IPs are
  paid add-ons; the Connector reference documents no QoS. Do not extrapolate beyond what
  the docs say.
- **"Cloudflare has the bigger network."** Concede PoP count gracefully — Gartner's 2025 MQ
  summaries credit Cloudflare's network coverage. Pivot to what the SASE decision actually
  turns on: a Leader-placed platform, an SD-WAN edge with QoS and managed last mile, and
  one policy engine for WAN + security — the areas where the same report places Cloudflare
  as a Visionary with a much smaller SASE customer base (per Gartner's ~400 estimate,
  attributed).
- **Naming churn in discovery.** WARP/Cloudflare One Client, Magic WAN/Cloudflare WAN,
  Connector/Cloudflare One Appliance, Teams/Zero Trust/Cloudflare One — inventory by
  capability, not by the name the customer remembers.
- **Access service tokens.** Machine-to-machine flows authenticated by service tokens do not
  map one-to-one onto user-centric ZTNA. Identify every consumer in phase 1 and design each
  flow explicitly (site-to-site path, IP-scoped firewall rule) before its Access app is
  retired. **[recommended practice]**

---

## 6. Sources

**Cloudflare — plans and tiers**
- Zero Trust & SASE plans — https://www.cloudflare.com/plans/zero-trust-services/
- "Zero Trust For Everyone" (free ≤50 users) — https://blog.cloudflare.com/teams-plans/
- Browser Isolation availability (add-on, PAYG + Enterprise) — https://developers.cloudflare.com/cloudflare-one/remote-browser-isolation/
- Dedicated egress IPs (Enterprise add-on) — https://developers.cloudflare.com/cloudflare-one/traffic-policies/egress-policies/dedicated-egress-ips/
- BYOIP dedicated egress IPs (changelog, Aug 2025) — https://developers.cloudflare.com/changelog/post/2025-08-21-byoip-dedicated-egress-ip/
- DEX (all plans; requires client) — https://developers.cloudflare.com/cloudflare-one/insights/dex/
- Third-party plan/pricing summaries (retention, add-on breakdown; verify per customer) — https://costbench.com/software/business-vpn/cloudflare-zero-trust/ ; https://zerotrustcost.com/cloudflare-zero-trust-pricing

**Cloudflare — clients, tunnels, WAN**
- Cloudflare One Client with legacy VPNs (competing agents; split responsibilities) — https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/deployment/vpn/
- Client known limitations — https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/troubleshooting/known-limitations/
- Cloudflare Tunnel (cloudflared) — https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/
- Cloudflare WAN (Magic WAN) overview — https://developers.cloudflare.com/cloudflare-wan/
- GRE and IPsec tunnels — https://developers.cloudflare.com/magic-wan/reference/gre-ipsec-tunnels/
- Cloudflare One Appliance / Magic WAN Connector reference (ICMP bypass, no fail-open, failover, HA topology) — https://developers.cloudflare.com/magic-wan/configuration/connector/reference/
- Magic WAN Connector GA — https://blog.cloudflare.com/magic-wan-connector-general-availability/
- Magic Transit (Enterprise; /24 minimum) — https://developers.cloudflare.com/magic-transit/
- cf-terraforming (config export) — https://github.com/cloudflare/cf-terraforming ; import guide — https://developers.cloudflare.com/terraform/advanced-topics/import-cloudflare-resources/

**Analyst / market**
- Cato: Leader, 2025 Gartner MQ for SASE Platforms — https://www.catonetworks.com/news/cato-named-leader-in-the-2025-gartner-magic-quadrant-for-sase-platforms/ ; https://www.catonetworks.com/resources/gartner-magic-quadrant-for-sase-platforms-2025/
- Cloudflare: Visionary; Gartner ~400 active enterprise SASE customers (summary of MQ) — https://softprom.com/cloudflare-cisco-and-fortinet-recognized-in-the-2025-gartner-magic-quadrant-for-sase-platforms
- MQ Leaders coverage — https://www.channelfutures.com/sdn-sd-wan/cato-fortinet-among-sase-magic-quadrant-leaders

**Cato Networks**
- Cato ZTNA — https://support.catonetworks.com/hc/en-us/articles/6266293423773-What-is-Cato-s-ZTNA-Solution
- Client Connectivity Policy — https://support.catonetworks.com/hc/en-us/articles/4415419573393-Configuring-the-Client-Connectivity-Policy
- Preparing to install the Cato Client (coexistence limits) — https://support.catonetworks.com/hc/en-us/articles/4411554844817-Preparing-to-Install-the-Cato-Client
- Client Upgrade Policy / pilot users — https://support.catonetworks.com/hc/en-us/articles/11570704126237-Managing-the-Rollout-of-Client-Versions-Client-Upgrade-Policy
- Browser Access portal — https://support.catonetworks.com/hc/en-us/articles/4965522214685-Configuring-the-Browser-Access-Portal ; overview — https://support.catonetworks.com/hc/en-us/articles/4965522210333
- Internet Firewall — https://support.catonetworks.com/hc/en-us/articles/4413273486865-What-is-the-Cato-Internet-Firewall
- Cato DNS / DNS Protection — https://support.catonetworks.com/hc/en-us/articles/22410218141213-What-is-Cato-DNS ; https://support.catonetworks.com/hc/en-us/articles/6724699301661-Customizing-the-DNS-Protections-for-IPS
- TLS Inspection wizard — https://support.catonetworks.com/hc/en-us/articles/23739970551453-Using-the-TLS-Inspection-Configuration-Wizard
- RBI configuration — https://support.catonetworks.com/hc/en-us/articles/9797943724061-Configuring-the-RBI-Service-for-Secure-Web-Browsing ; Instant RBI + Authentic8 partnership — https://www.catonetworks.com/news/cato-networks-introduces-instant-rbi-featuring-single-click-activation/
- Cato DEM — https://www.catonetworks.com/platform/digital-experience-monitoring-dem/ ; What is Cato Experience Monitoring — https://support.catonetworks.com/hc/en-us/articles/16390246585245-What-is-Cato-Experience-Monitoring ; launch — https://www.catonetworks.com/news/cato-expands-sase-platform-with-dem/
- Cato Sockets — https://support.catonetworks.com/hc/en-us/articles/30175650827677-What-are-Cato-Sockets ; Socket vs IPsec sites — https://support.catonetworks.com/hc/en-us/articles/360000489917-Cato-Socket-vs-IPsec-Sites-and-Tunnels
- IPsec IKEv2 sites (allocated egress IPs; HA tunnel recommendation) — https://support.catonetworks.com/hc/en-us/articles/4413265635473-Configuring-IPsec-IKEv2-Sites ; best practices — https://support.catonetworks.com/hc/en-us/articles/360014381337
- QoS / bandwidth management — https://support.catonetworks.com/hc/en-us/articles/4413280514065-What-are-the-Cato-Bandwidth-Management-Profiles ; https://support.catonetworks.com/hc/en-us/articles/360001271778-QoS-Policies-Explained
- ILMM — https://support.catonetworks.com/hc/en-us/articles/6249243964445-What-is-Cato-ILMM ; https://www.catonetworks.com/news/cato-introduces-intelligent-last-mile-management-for-sd-wan-services/
- SCIM provisioning — https://support.catonetworks.com/hc/en-us/articles/13651160092701-Provisioning-Users-with-SCIM
- Terraform provider — https://registry.terraform.io/providers/catonetworks/cato/latest ; https://support.catonetworks.com/hc/en-us/articles/17895157930525-Using-Terraform-with-the-Cato-Cloud ; https://github.com/catonetworks/terraform-provider-cato
- Cato PS methodology (phases, wave plan, TLSi phasing) — **[Cato PS internal]** `_extract/andy-professional-services-deck-combined-slides-2026.md`
