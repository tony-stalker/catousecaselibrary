# Migration brief: Versa Networks → Cato SASE Cloud Platform

> SE-enablement research note. UK English. Facts are cited in §6; anything marked
> **recommended practice** is field guidance without a public source. Internal anchor:
> the Cato Professional Services deck (2026) — multi-region co-existence Option F and
> the regional-hub eBGP example (slides 57–58, 60–69). The PS deck demonstrates the
> pattern against a FortiGate SD-WAN estate; it is vendor-agnostic on the legacy side
> (the legacy hub only needs to speak eBGP), so it applies to Versa VOS hubs unchanged
> (**recommended practice** for the Versa application specifically).

---

## 1. Vendor snapshot

**The estate.** Versa customers run VOS (Versa Operating System) as the branch edge —
on Versa CSG appliances (CSG150/300/700/1000/2500/3000 series), certified white-box
hardware (Advantech, Caswell, Dell, Lanner, Silicom), VMs or cloud instances. VOS
combines SD-WAN routing with an on-box NGFW/UTM stack, and can additionally host
third-party VNFs via Versa's uCPE service-chaining framework. Behind the edges sits a
customer- (or provider-) operated **head-end**: Versa Director (management, templates,
workflows) in active-standby pairs, Versa Controller (the overlay control plane — a
custom multi-instance MP-BGP route reflector distributing routes and IPsec security
associations to branches) in active-active pairs, and a Versa Analytics cluster (data
and log/search nodes). Concerto is the higher-level orchestration portal layered on
top. Remote access is Versa Secure Access: the Versa Secure Access Client (VSAC) on
endpoints connecting to Versa Cloud Gateways, with Versa Secure Private Access (VSPA)
as the ZTNA component. For lean-IT/mid-market customers, **Versa Titan** is the
cloud-managed tier — Versa's NOC operates the cloud infrastructure and customers (or a
Titan partner) manage sites through a simplified portal. In November 2024 Versa
repositioned the portfolio as **VersaONE**, a unified platform across WAN, LAN, data
centre and cloud.

**The carrier-managed dimension.** Versa sells heavily through service providers:
Director is explicitly multi-tenant with white-label support, and Versa markets
SP-operated SD-WAN/SASE as a primary route to market. Verizon's managed SD-Branch
offering is powered by Versa (Verizon was also an early Versa investor), and Lumen
sells SD-WAN and SASE services built on Versa, including Versa Secure Access. In these
estates the *provider* owns the Director tenancy, often the CPE hardware and sometimes
the underlay circuits — which shapes discovery, cutover sequencing and contract exit
(§3, §5).

**Verifiable migration drivers:**

- **The management plane was a nation-state breach vector.** CVE-2024-39717 — a file
  upload flaw in Versa Director's GUI — was exploited as a zero-day from at least
  June 2024 and added to the CISA KEV catalogue in August 2024. Black Lotus Labs
  attributed the campaign with moderate confidence to Volt Typhoon (Chinese
  state-sponsored), which planted the in-memory "VersaMem" web shell on Director
  servers to harvest credentials, with victims identified in the ISP, MSP and IT
  sectors — i.e. the providers who run Director on behalf of many downstream
  enterprises. Fixed in Director 22.1.4+; MITRE ATT&CK tracks it as campaign C0039.
- **The orchestration layer followed.** In May 2025 ProjectDiscovery published three
  Versa Concerto vulnerabilities after a 90-day disclosure window: CVE-2025-34027
  (CVSS 10.0 — URL-decoding inconsistency allowing authentication bypass to a file
  upload endpoint and RCE via `ld.so.preload`), CVE-2025-34026 (CVSS 9.2 — Traefik
  reverse-proxy Actuator authentication bypass via the `X-Real-IP` header, exposing
  heap dumps and session tokens) and CVE-2025-34025 (privileged Docker container
  escape). Versa states hotfixes were available from March 2025 and a remediated
  release from 16 April 2025 — but every Concerto instance is another
  internet-adjacent head-end component to patch on someone's schedule.
- **Head-end operational burden.** The head-end is real server infrastructure the
  customer or provider must host, size, patch and upgrade: Versa's published
  requirements for a 2,500-CPE / 500-tenant estate specify two Director servers
  (24 cores / 64 GB RAM each, active-standby), a six-server Analytics cluster
  (16 cores / 64 GB each, 2 TB storage on analytics nodes) and 2–4 Controller
  servers — deployed across Tier 3/4 data centres or cloud availability zones for
  geo-redundancy, with all components required to run the same Versa software
  version (upgrades are therefore coordinated fleet events). The published
  requirements list Ubuntu 18.04 as the supported base OS for on-premises
  deployments. Versa itself now sells a hosted-and-managed head-end service (VHM) —
  tacit acknowledgement that the head-end is a burden many customers do not want.
- **Analytics scale is bought in servers.** Each Analytics cluster supports up to
  2,500 CPEs; a 20,000-CPE estate needs eight clusters. Log retention and reporting
  capacity are infrastructure decisions, not a service property.
- **Carrier-managed contract friction.** Where the SD-WAN is provider-delivered, the
  enterprise typically cannot touch Director directly: changes go through provider
  tickets, and the commercial term binds network architecture to the carrier
  contract. Cato has publicly positioned for "enterprises opting out of carrier
  SD-WAN". Contract renewal or dissatisfaction windows are the natural trigger to
  re-evaluate (**recommended practice** for the trigger claim; the operating model
  itself is sourced).
- **Platform churn.** Titan (lean-IT tier) and the Director/Concerto stack are
  distinct operating models, and the VersaONE announcement re-centres the portfolio
  on a new unified platform — meaning existing estates face a Versa-internal
  re-platforming conversation at some point regardless. Evaluating a true
  cloud-native alternative belongs in that same conversation (**recommended
  practice** for the framing; the VersaONE launch is sourced).

---

## 2. Component → Cato mapping

| Versa component | Function | Cato equivalent | Notes |
|---|---|---|---|
| VOS on CSG appliance / white box / VM (branch edge) | SD-WAN edge + on-box NGFW/UTM | Cato Socket (or vSocket in AWS/Azure) | Socket is a thin edge: tunnel termination, path selection, QoS, LAN firewall — all deep inspection moves to the PoP; no per-site security sizing |
| Versa Director (templates, workflows, device management) | Central management and provisioning | Cato Management Application (CMA) | Nothing for the customer to host, patch or upgrade; automation via GraphQL API and the `catonetworks/cato` Terraform provider |
| Versa Controller (multi-instance MP-BGP route reflector + IKE/SA distribution) | Overlay control plane | Cato PoPs and backbone — control plane is part of the Cato service | No customer-operated route reflectors; sockets connect to the nearest PoP and any-to-any routing is a property of the backbone |
| Versa Concerto | Higher-level orchestration portal | CMA (single console) | No separate orchestration tier to deploy or patch (cf. the 2025 Concerto CVEs) |
| Versa Analytics cluster | Logging, reporting, analytics | CMA events and analytics, XDR storyboards, SIEM integrations | No cluster sizing per 2,500 CPEs; events generated once in the cloud |
| Versa Secure SD-WAN overlay (branch-to-branch IPsec SAs distributed via Controller) | Site-to-site connectivity, path selection | Cato Socket tunnels terminated at the nearest PoP + global private backbone | No SA mesh or shortcut state to operate; per-link last-mile monitoring; network rules with bandwidth profiles recreate steering intent |
| VOS UTM stack (NGFW, IPS, AV, URL filtering on the box) | Per-site threat prevention | Cato single-pass inspection at the PoP (SPACE): WAN/Internet Firewall, IPS, NGAM, SWG | One cloud-global rulebase replaces per-template security policy; inspection capacity is the platform's problem |
| Versa Secure Access Client (VSAC) + Versa Cloud Gateways + VSPA | Remote access / ZTNA | Cato Client (SDP) with Device Posture, Always-On and Client Connectivity Policy | Same PoP-delivered stack that serves sites — one policy for users and sites |
| Versa SWG / Secure Internet Access | Cloud SSE for internet-bound traffic | Cato Internet Firewall, SWG, CASB, DLP at every PoP | No separate SSE product or gateway selection |
| Versa Titan (cloud-managed tier) | Simplified cloud-managed SD-WAN/SASE for lean IT | CMA — the only tier; every customer gets the full console | Titan estates have no head-end to migrate — mostly a CPE swap and policy re-model (§5) |
| uCPE / service-chained third-party VNFs on CSG | NFV hosting at the branch | No direct equivalent — disposition per function | Absorb the function into Cato (firewall, SWG etc.), retain a dedicated appliance, or re-platform; must be inventoried in discovery (§5) |
| Director multi-tenancy (SP tenants, white-label) | Provider-hosted tenancy | Policy scoping within one CMA account; separate accounts for hard tenancy | Enterprise leaves the provider's tenant entirely — history/exports need provider cooperation (§5) |
| Paired CSG HA at a site | Device redundancy | Socket HA (primary/secondary) plus PoP- and backbone-level resilience | Site survives socket, link and PoP failures independently |

---

## 3. Recommended migration path

Anchored to the Cato PS four-phase methodology: **Discover & Design → Pilot, Build &
Initial Rollout → Advanced Security & Broader Rollout → Tune, Optimise & Handover**
(typical reference plan: four months).

### Phase 1 — Discover & Design (weeks 1–4)

- **Config capture.** Export per-appliance configuration from Director (Appliances
  table → Export Configuration) or from the VOS CLI
  (`show configuration | display set | save …`), and export the staging/post-staging
  and device templates (.cfg) that generate branch config. Pull Analytics traffic
  data to build the real traffic matrix — branch-to-branch IPsec SAs mean
  spoke-to-spoke flows rarely appear in design documents (**recommended practice**).
- **Carrier-managed estates: start the export request first.** Where a provider owns
  the Director tenancy, config export, template access and Analytics data all arrive
  via the provider's change process — put the request in early, expect lead time, and
  capture what the *contract* obliges the provider to hand over (**recommended
  practice**). In parallel, inventory contract end dates, notice periods, early-exit
  terms, and which assets (CPE, circuits) are provider-owned.
- **Rule-base clean-up before translation.** Retire dead rules using Analytics
  hit/usage data, collapse duplicate address/service objects, flag any-any debt.
  Translate VOS address objects and services into CMA hosts, network ranges and
  custom services — scriptable from the exported `display set` config and pushed via
  the Cato API or Terraform provider (**recommended practice**).
- **Classify the estate**: regional VOS hubs/gateways, data centres, branch classes
  (paired-CSG HA vs single, LTE backup), tenants, inbound NAT/published services,
  uCPE sites hosting third-party VNFs, and Titan vs Director-managed populations.
- **Co-existence design**: select the eBGP hub-handoff pattern (§4), agree AS
  numbering (the Cato side is eBGP-only; default Cato ASN 64515), route filtering
  and summarisation, PoP egress/static-IP allocations, and a branch cutover template
  per site class.
- **Foundation setup**: CMA account and best-practice baseline, IdP/SCIM
  integration, endpoint readiness (Cato Client packaging, TLSi certificates), socket
  logistics, SIEM integration planning.

### Phase 2 — Pilot, Build & Initial Rollout (month 2)

- **Parallel hub deployment.** Stand up sockets (or vSockets) at data centres and at
  each Versa hub/gateway site *alongside* the existing kit; establish the eBGP
  handoffs into the site's LAN-side routing; validate route exchange, symmetry and
  failover before any branch moves. Keep the Versa overlay's MP-BGP world and the
  Cato world segmented — they meet only at the eBGP handoffs.
- **Security policy conversion** from the cleaned rule-base: WAN Firewall
  (site-to-site), Internet Firewall (wizard-assisted initial policy), IPS and NGAM in
  monitor-then-block; network rules and bandwidth profiles recreating Versa SD-WAN
  steering intent (voice, business-critical, bulk).
- **Pilot site + pilot users.** Cut over one representative branch with the chosen
  pattern; deploy the Cato Client to a pilot cohort (Client Connectivity Policy in
  monitor mode first) and validate access, performance and UX. Rollback for the
  pilot is the standard spoke rollback (§4).

### Phase 3 — Advanced Security & Broader Rollout (month 3)

- **Branch waves.** Migrate branches region by region behind their regional hub
  handoff, per the spoke methodology (§4). Cutover order (**recommended practice**):
  simple single-WAN branches → HA branches → complex sites (uCPE/VNF hosts, local
  inbound services) → hubs last. In provider-managed estates, schedule each wave's
  spoke-disable as a provider change ticket with a pre-agreed rollback window —
  the provider is in the loop for every cutover (**recommended practice**).
- **VSAC → Cato Client cohorts.** Phased SDP migration groups (the PS reference plan
  uses four waves): per cohort, disable Versa Secure Access Client connectivity,
  enable the Cato Client, and re-model access rules as Cato ZTNA policy with device
  posture profiles. Avoid two concurrently active VPN/ZTNA tunnels on one endpoint
  (**recommended practice**).
- **TLS inspection phased enablement** by URL category and/or pilot groups (the PS
  reference is four phases over four weeks), then CASB discovery, tenant controls
  and DLP monitor-mode → enforcement.
- **Carrier-contract sequencing.** Keep provider-managed circuits alive until the
  sites they serve are validated on Cato; if the last mile is bundled with the
  managed SD-WAN, re-procure internet access per site *ahead* of its wave so cutover
  is not gated on circuit delivery — often the true critical path (**recommended
  practice**).

### Phase 4 — Tune, Optimise & Handover (month 4)

- Final site and user migrations; QoS and policy tuning from analytics; validation
  of security controls; SIEM event integration live.
- **Decommission**: remove eBGP handoffs as each region completes; retire VOS hubs;
  decommission the head-end (Director, Controller, Analytics, Concerto servers/VMs)
  once logging-retention obligations are met; return provider-owned CPE and serve
  contract notice per the terms mapped in Phase 1 (**recommended practice**).
- Documentation, admin training, operational handover.

---

## 4. Co-existence & rollback

### The hub pattern (Cato PS reference — Option F)

The PS multi-region "interim connectivity" design, demonstrated in the deck against a
FortiGate SD-WAN estate and applied identically to Versa hubs (the legacy side only
needs eBGP):

- A **Cato hub site interconnects with each Versa hub/gateway via eBGP** — LAN
  handoff at the hub site, or IPsec to the PoP where no socket can be placed.
- **Path symmetry is maintained by AS-path length**: routes crossing regions carry an
  extra inter-hub AS hop, so BGP best-path selection anchors traffic to the local
  regional hub — traffic exits and returns through the same hub, preventing
  asymmetric routing through stateful VOS firewalls. The Versa overlay (Controller-
  distributed MP-BGP + IPsec SAs) stays intact and segmented on its side of the
  handoff.
- **Dynamic route exchange**: prefixes propagate automatically between the Cato and
  Versa domains — no per-site route engineering during the migration window.
- **Spoke migration methodology**: 1) disable the Versa spoke (via Director, or a
  provider change ticket in managed estates) so its prefixes are withdrawn from the
  overlay and the eBGP exchange; 2) bring up the Cato socket site; 3) routes
  propagate automatically to both domains; 4) **rollback is the mirror image** —
  down the socket site, re-enable the Versa spoke, and BGP reconverges.
- **Asymmetry guard-rails**: filter the default route and the prefixes of any
  half-migrated site at each handoff so no site is reachable via both domains at
  once; use BGP summaries and Cato's BGP filtering to keep the exchange tidy.

Where BGP is unavailable — common when the provider will not open a routing session
into their managed VOS estate — the PS static alternative is an **interconnect site
with routed ranges**: pre-stage real subnets on the interconnect and dummy ranges on
the future Cato sites; at cutover delete the routed range and update the dummy range;
rollback is re-adding the statics. Proven at scale (~300-site deployment cited in the
PS deck).

### Branch-level co-existence variants (PS deck options, applied to VOS branches)

| Pattern | Default gateway | Mechanics | Rollback |
|---|---|---|---|
| VOS CPE remains DG, static routes | VOS CPE | Socket on a LAN transit; CPE routes migrated subnets to the socket | Remove the statics — traffic reverts to the Versa overlay instantly |
| VOS CPE remains DG, eBGP over LAN transit | VOS CPE | eBGP socket ↔ CPE (LAN-side routing instance); phased subnet migration | Withdraw advertisements / drop the peering |
| L3 switch decides | L3 switch | Core switch routes between legacy and Cato-migrated subnets | Flip routes on the switch |
| Socket as DG, eBGP LAN handoff | Cato Socket | Socket is the gateway; eBGP handoff for legacy prefixes; full HA support | Re-point DG to the VOS CPE |
| Socket as DG, Alt-WAN BGP / Gradual Deployment | Cato Socket | Legacy overlay reached via Alt-WAN with eBGP, or Gradual Deployment routing unknown RFC1918 via Alt-WAN | Routes revert via BGP; caveats below |

Alt-WAN caveats (PS deck): configure local routing so Alt-WAN-destined flows are not
first carried to the PoP (avoiding asymmetry), and note Alt-WAN failure does not
trigger socket HA failover — prefer BGP on a LAN handoff where HA matters. Gradual
Deployment handles private (RFC1918) destinations only. In provider-managed branches
the CPE-side options require provider cooperation — the L3-switch and socket-as-DG
patterns keep the changes on customer-controlled equipment (**recommended practice**).

### Users and dual agents during transition

- Run VSAC and the Cato Client side by side only in a controlled overlap per cohort,
  with one VPN/ZTNA data path active at a time (**recommended practice**).
- Published/inbound services on VOS CPEs migrate deliberately — re-publish via Cato
  (remote port forwarding / static-IP egress) or leave on a retained leg until their
  own change window (**recommended practice**).

---

## 5. Gotchas & objection handling

- **"Our whole branch config is generated from Director templates."** True — and it
  cuts both ways. Versa's model layers workflows, staging and post-staging templates,
  device templates and per-device bind data; the effective config of any one branch
  is the product of several layers. Treat migration as *intent recovery*: export the
  templates and per-appliance configs, identify what actually varies per site (bind
  data), and express the common intent once in CMA's single rulebase. The automation
  that exists to keep hundreds of VOS instances consistent is solving a problem class
  that disappears with one cloud rulebase; what remains (site onboarding,
  policy-as-code) maps to the Cato GraphQL API and Terraform provider.
- **"The provider runs it — we can't even export the config."** Common in
  carrier-managed estates: the enterprise may have a read-only portal, not Director
  admin. Mitigations: contractual data-handover clauses, provider change tickets for
  exports, and reconstruction from the customer-side artefacts (LAN addressing,
  firewall change records, Analytics reports the customer can see). Budget discovery
  time accordingly and sequence waves around provider SLAs (**recommended
  practice**).
- **Service chaining / uCPE VNFs.** CSG platforms (e.g. CSG770/1300/1500) can host
  third-party VNFs service-chained with VOS. Each chained function needs an explicit
  disposition: absorbed into Cato's PoP inspection, replaced by a dedicated device,
  or retained on separate hardware. Miss one in discovery and a branch cutover
  strands a function nobody documented (**recommended practice** for the guidance;
  the uCPE capability is sourced).
- **Titan tier differences.** Titan estates are cloud-managed with a simplified
  portal and no customer head-end — the migration is lighter (CPE swap, policy
  re-model) but the config detail available for export is also shallower, and the
  estate was chosen precisely because the customer is lean-IT: plan for Cato PS or
  partner-led delivery rather than customer self-service (**recommended practice**
  for the guidance; the Titan operating model is sourced).
- **"Versa is single-pass and single-OS too."** Versa's single-pass claim applies to
  VOS on the appliance and to Versa Cloud Gateways; the architecture still requires
  *someone* — customer, carrier or Versa — to host and operate Director, Controller,
  Analytics and Concerto, and VersaONE is explicitly offered self-managed, co-managed
  or fully managed on shared, private or sovereign infrastructure. The Cato counter
  is not the packet path but the operating model: one cloud service, one console,
  no head-end anywhere in the customer's or provider's estate, and the vendor —
  not the customer — patches the platform (see the Director and Concerto CVE
  record).
- **"We'll just patch Director and stay."** CVE-2024-39717 was exploited as a
  zero-day against the management plane itself, by an actor (Volt Typhoon) that
  targeted the ISP/MSP layer operating Director for downstream enterprises — and the
  VersaMem shell harvested credentials in memory, so patching alone did not settle
  the incident-response question. The 2025 Concerto disclosures then hit the
  orchestration layer at CVSS 9.2–10.0. The pattern argument: every self- or
  provider-hosted management component is attack surface the customer inherits.
- **Analytics history.** Leaving a provider tenant or decommissioning an Analytics
  cluster forfeits historical reporting unless exported; agree retention needs and
  export format during Phase 1, and run CMA analytics in parallel from the pilot
  onward so trending exists before decommissioning (**recommended practice**).
- **Feature-parity edge cases.** Niche VOS behaviours (bespoke NAT constructs,
  per-tenant routing instances, CGNAT, local breakout exceptions, voice
  SLA-steering specifics) should be listed in discovery and validated in the PoV
  rather than assumed — standard PoV hygiene (**recommended practice**).

---

## 6. Sources

**Versa architecture and operations**
- Headend hardware/software requirements (sizing, HA pairs, Ubuntu 18.04, same-version constraint) — https://docs.versa-networks.com/Getting_Started/Deployment_and_Initial_Configuration/Headend_Deployment/Headend_Basics/Hardware_and_Software_Requirements_for_Headend
- Headend overview (Director/Analytics/Controller/Concerto components) — https://docs.versa-networks.com/Getting_Started/Deployment_and_Initial_Configuration/Headend_Deployment/Headend_Basics/01_Headend_Overview
- SD-WAN headend design guidelines (Tier 3/4 DCs, geo-redundancy, AZ placement) — https://docs.versa-networks.com/Integrations_and_Solutions/SD-WAN_Design/02_SD-WAN_Headend_Design_Guidelines
- SD-WAN solution architecture (Controller as multi-instance MP-BGP route reflector; IPsec SA distribution; control vs data plane) — https://docs.versa-networks.com/Reference/Architecture/02_SD-WAN_Solution_Architecture
- Versa Hosted and Managed Head-End (VHM) datasheet — https://versa-networks.com/documents/datasheets/versa-networks-hosted-and-managed-head-end.pdf
- Export appliance configuration (Director) — https://support.versa-networks.com/support/solutions/articles/23000027499-export-appliance-configuration
- Back up and restore a Director node — https://docs.versa-networks.com/Management_and_Orchestration/Versa_Director/Configuration/Back_Up_and_Restore_a_Director_Node
- Overview of configuration templates (staging/post-staging, device templates) — https://docs.versa-networks.com/Secure_SD-WAN/01_Configuration_from_Director/SD-WAN_Configuration/Basic_SD-WAN_Configuration/01_Overview_of_Configuration_Templates
- Configure uCPE on a VOS device (service-chain templates, third-party VNFs) — https://docs.versa-networks.com/Secure_SD-WAN/01_Configuration_from_Director/Common_Configuration/Configure_uCPE_on_a_VOS_Device
- Versa CSG appliance series — https://versa-networks.com/products/components/appliances/
- Versa SD-WAN white-box appliances (certified vendors) — https://docs.versa-networks.com/Hardware/Versa_SD-WAN_White-Box_Appliances/Versa_SD-WAN_White-Box_Appliances
- Versa Titan for lean IT (cloud-managed tier, Versa NOC operation) — https://versa-networks.com/solutions/lean-it/
- Versa Secure Private Access datasheet (VSAC, VSPA, Versa Cloud Gateways) — https://versa-networks.com/documents/datasheets/versa-secure-private-access.pdf
- VersaONE announcement, November 2024 (self-/co-/fully managed; shared/private/sovereign) — https://versa-networks.com/news/2024/versa-announces-versaone-the-industrys-first-universal-sase-platform-across-wan-lan-data-centers-and-cloud/

**Service-provider delivery**
- Verizon and Versa Networks solution brief — https://versa-networks.com/documents/solution-briefs/verizon-and-versa-networks.pdf
- Versa–Verizon partner page — https://versa-networks.com/partners/verizon/
- Verizon SD-Branch powered by Versa (FlexVNF) — https://www.enterprisenetworkingplanet.com/data-center/versa-networks-partners-with-verizon-to-bring-sd-wan-to-branches/
- Lumen SASE with Versa — https://www.lumen.com/en-us/services/sase-versa.html and Versa Secure Access service guide — https://www.lumen.com/content/dam/lumen/help/sdwan-versa/assets/sdwan-versa-secure-access.pdf
- Cato on enterprises opting out of carrier SD-WAN — https://www.catonetworks.com/news/cato-caters-to-enterprises-opting-out-of-carrier-sd-wan/

**Vulnerability record**
- Lumen Black Lotus Labs: Versa Director zero-day exploitation (VersaMem, ISP/MSP victims) — https://www.lumen.com/blog/en-us/uncovering-versa-director-zero-day-exploitation
- The Hacker News: Volt Typhoon exploits CVE-2024-39717 — https://thehackernews.com/2024/08/chinese-volt-typhoon-exploits-versa.html
- MITRE ATT&CK campaign C0039 (Versa Director zero-day exploitation) — https://attack.mitre.org/campaigns/C0039/
- Tenable CVE-2024-39717 record — https://www.tenable.com/cve/CVE-2024-39717
- CISA Known Exploited Vulnerabilities catalogue — https://www.cisa.gov/known-exploited-vulnerabilities-catalog
- ProjectDiscovery: Concerto authentication bypass to RCE (CVE-2025-34025/34026/34027) — https://projectdiscovery.io/blog/versa-concerto-authentication-bypass-rce
- Qualys ThreatPROTECT on the Concerto CVEs — https://threatprotect.qualys.com/2025/05/22/versa-concerto-zero-day-remote-code-execution-vulnerabilities-cve-2025-34025-cve-2025-34026-cve-2025-34027/
- Arctic Wolf on the Concerto disclosure/patch timeline — https://arcticwolf.com/resources/blog/multiple-unpatched-vulnerabilities-versa-concerto-disclosed/

**Cato (public)**
- Using BGP in the Cato Cloud (eBGP-only, default ASN 64515) — https://support.catonetworks.com/hc/en-us/articles/7825408860573-Using-BGP-in-the-Cato-Cloud
- Configuring BGP Neighbors for a Cato Socket — https://support.catonetworks.com/hc/en-us/articles/4413273474065-Configuring-BGP-Neighbors-for-a-Cato-Socket
- Working with BGP Filtering — https://support.catonetworks.com/hc/en-us/articles/23972529384733-Working-with-BGP-Filtering
- Working with BGP Summary Routes — https://support.catonetworks.com/hc/en-us/articles/13472104226717-Working-with-BGP-Summary-Routes
- Integrating Cato with an Alt WAN Network — https://support.catonetworks.com/hc/en-us/articles/360011175857-Integrating-Cato-with-an-Alt-WAN-Network
- Configuring Network Rules — https://support.catonetworks.com/hc/en-us/articles/7785698733341-Configuring-Network-Rules
- Bandwidth Management Profiles — https://support.catonetworks.com/hc/en-us/articles/4413280514065-What-are-the-Cato-Bandwidth-Management-Profiles
- Internet Firewall Configuration Wizard — https://support.catonetworks.com/hc/en-us/articles/27286761010205-Using-the-Internet-Firewall-Configuration-Wizard
- Configuring the Socket LAN Firewall Policy — https://support.catonetworks.com/hc/en-us/articles/10642755314205-Configuring-the-Socket-LAN-Firewall-Policy
- Client rollout / upgrade policy — https://support.catonetworks.com/hc/en-us/articles/11570704126237-Managing-the-Rollout-of-Client-Versions-Client-Upgrade-Policy
- Understanding Packet Flow with Cato SPACE — https://support.catonetworks.com/hc/en-us/articles/12545093882909-Understanding-Packet-Flow-with-Cato-SPACE-Architecture
- What is the Cato API — https://support.catonetworks.com/hc/en-us/articles/20564679978397-What-is-the-Cato-API
- Cato Terraform provider — https://registry.terraform.io/providers/catonetworks/cato/latest

**Cato (internal)**
- Cato Professional Services deck, 2026 (`_extract/andy-professional-services-deck-combined-slides-2026.md`): four-phase methodology and 4-month reference plan (slides 10–16); multi-region Option F eBGP interim connectivity and AS-path symmetry (slide 57); regional-hub example and spoke migration/rollback (slide 58); interconnect and parallel-socket patterns (slides 60–69); phased TLS inspection (slides 44–46 area).
