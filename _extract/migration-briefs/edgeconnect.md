# Migration brief: HPE Aruba Networking EdgeConnect SD-WAN (Silver Peak) → Cato SASE Cloud Platform

> SE-enablement research note. UK English. Facts are cited in §6; anything marked
> **recommended practice** is field guidance without a public source. Internal anchor:
> the Cato Professional Services deck (2026) — multi-region co-existence Option F and
> the regional-hub eBGP example (slides 57–58, 60–69). The PS deck demonstrates the
> pattern against a FortiGate SD-WAN estate; it is vendor-agnostic on the legacy side
> (the legacy hub only needs to speak eBGP), so it applies to EdgeConnect hubs
> unchanged (**recommended practice** for the EdgeConnect application specifically —
> EdgeConnect's LAN-side BGP/OSPF support is sourced).

---

## 1. Vendor snapshot

**The estate.** EdgeConnect customers run the former Silver Peak "Unity EdgeConnect"
platform: **EC appliances** at branches and data centres (the EC-XS/EC-S/EC-M/EC-L/
EC-XL family and successors, plus ruggedised and high-end models), or **EC-V virtual
appliances** on VMware ESXi, Hyper-V, KVM and Citrix hypervisors and in AWS, Azure,
Google Cloud, Oracle Cloud and Alibaba Cloud (including AWS GovCloud and Azure
Government). Everything is driven from **Orchestrator** (formerly GMS/Unity
Orchestrator) — delivered as an HPE-hosted SaaS ("Orchestrator-as-a-Service") or
self-hosted, depending on subscription tier. Licensing is per-appliance bandwidth
tiers (20 Mbps up to Unlimited) in **Foundation**, **Advanced** and On-Prem
subscription tiers; Foundation caps topology (hub-and-spoke, limited VRFs) while
Advanced unlocks the full SD-WAN feature set.

The platform's signature constructs:

- **Business Intent Overlays (BIOs).** Up to seven application-specific WAN overlays,
  each defining its own topology, link-bonding policy, QoS priority and internet
  breakout behaviour for a class of traffic ("SD-WAN traffic to internal subnets" vs
  "breakout traffic to internet and cloud services" per overlay).
- **Tunnel bonding and path conditioning.** Multiple transports are bonded into one
  logical tunnel per overlay; packet-level forward error correction (erasure coding)
  and real-time packet order correction give "private-line-like" behaviour over
  broadband, with Dynamic Path Control steering traffic in real time.
- **First-Packet iQ.** On-appliance application identification on the first packet
  (10,000+ applications claimed) to steer flows — notably to decide local internet
  breakout vs backhaul per BIO.
- **Boost.** The optional WAN-optimisation performance pack: TCP acceleration
  (window scaling, SACK, round-trip measurement, HighSpeed TCP), byte-level data
  reduction (deduplication data stores plus compression) and CIFS protocol
  acceleration. Licensed separately per-Mbps (historically listed at $5/Mbps/month,
  enterprise-wide and movable; sold in 100 Mbps or 10 Gbps blocks) — so WAN
  optimisation is a metered add-on, not a platform property.
- **Subnet sharing.** EdgeConnect's internal routing protocol: each site shares
  local, static and LAN-learned OSPF/BGP routes across the fabric (default metric
  50). LAN-side BGP peers are typed — routes from "Branch"/"Branch-transit" peers
  are shared into the fabric; routes from "BGP-PE" peers are deliberately not
  (loop avoidance). This matters for co-existence design (§4).

**Security posture: SD-WAN-only with a separate security vendor is the norm.**
EdgeConnect ships a zone-based firewall and (in Advanced) IDPS features, but the
design centre for full inspection is **service chaining to a cloud SSE partner** —
Orchestrator has native automated workflows that build IPsec/GRE tunnels to Zscaler,
Netskope, Palo Alto Networks, Skyhigh, Broadcom and others. HPE's own SSE is the
former **Axis Security** "Atmos" platform (acquired March 2023), now **HPE Aruba
Networking SSE** (ZTNA, SWG, CASB, DEM; 500+ edge locations) — a separate product
with its own console and licensing, orchestrated to EdgeConnect the same way as
third-party SSE. A typical EdgeConnect account is therefore running at least two
policy planes: Orchestrator for the WAN, and a cloud SWG/SSE (Zscaler, Netskope or
HPE SSE) for security.

**The SD-Branch sibling.** "EdgeConnect SD-Branch" is a *different* product line —
Aruba gateways and Microbranch APs managed from Aruba Central (with its own SD-WAN
orchestrator) — distinct from Orchestrator-managed EdgeConnect SD-WAN. HPE's
"unified fabric" lets Central orchestrate tunnels between the two, but they remain
separate management planes. Scope which estate you are actually displacing (§5).

**Verifiable migration drivers:**

- **Two ownership changes in five years, now three SD-WAN lines under one roof.**
  HPE completed the $925M Silver Peak acquisition on 21 September 2020, and closed
  the ~$13.4bn Juniper Networks acquisition on 2 July 2025. HPE now sells three
  branch-WAN propositions with three management planes: EdgeConnect SD-WAN
  (Orchestrator), EdgeConnect SD-Branch/Microbranch (Aruba Central) and Juniper
  Session Smart SD-WAN (Mist). No EdgeConnect end-of-life has been announced — say
  so honestly — but analysts flagged the rationalisation question well before close:
  Dell'Oro noted the HPE/Juniper overlap "is limited to SASE" (SD-WAN + SSE) and
  urged HPE to align quickly on one SSE to avoid "bungling the SASE integration";
  SDxCentral openly asked whether HPE would eliminate Juniper's SASE in favour of
  Aruba plus Axis; community buyer's guides describe the standard pattern of dual
  lines coexisting 12–24 months before one goes to sustaining mode. For a customer,
  the roadmap question is legitimate diligence, not FUD — put it to HPE in writing
  and weigh the answer (**recommended practice** for the framing; the acquisitions,
  the three product lines and the analyst commentary are sourced).
- **Software lifecycle clocks are running.** HPE's published EdgeConnect lifecycle
  policy sets ECOS 9.4 End of Maintenance at 31 December 2026 and End of Support at
  31 December 2028 — customers must keep planning ECOS fleet upgrades (and matching
  Orchestrator versions, which have a published compatibility matrix) on appliances
  they own, for the life of the estate.
- **WAN optimisation is a paid add-on.** Boost is licensed per-Mbps on top of the
  appliance subscription; sites needing acceleration carry an explicit metered cost,
  and the capability exists only between appliance pairs that both have Boost
  capacity assigned.
- **Two-vendor operations where security is service-chained.** The documented
  deployment model for full inspection is tunnels to a separate SSE vendor: two
  consoles, two policy models, two support contracts, and tunnel orchestration as
  the seam between them. Consolidation economics and the operational seam are the
  standard displacement conversation (**recommended practice** for the framing; the
  service-chaining model is sourced).
- **The estate is appliance-anchored.** Sizing, HA pairs, bandwidth-tier licences,
  Boost blocks and hardware refresh all live at the branch. Cato's counter is
  architectural: a thin socket at the edge and elastic inspection/optimisation in
  the PoP (**recommended practice** framing).

---

## 2. Component → Cato mapping

| EdgeConnect component | Function | Cato equivalent | Notes |
|---|---|---|---|
| EC appliance (EC-XS…EC-XL family; HA pairs) | SD-WAN branch/DC edge | Cato Socket | Thin edge: tunnel termination, path selection, QoS, LAN firewall; deep inspection moves to the PoP — no per-site bandwidth-tier or Boost sizing |
| EC-V virtual appliance (hypervisor or cloud) | Virtual edge | vSocket (AWS/Azure), IPsec to PoP, or cloud cross-connect | Disposition per platform; cloud EC-Vs often become vSockets or native IPsec (§5) |
| Orchestrator (SaaS or self-hosted) | Central management, templates, preconfig YAML | Cato Management Application (CMA) | One console for networking and security; automation via GraphQL API and Terraform provider replaces pyedgeconnect/YAML preconfig tooling |
| Business Intent Overlays (up to 7) + QoS classes | Per-application overlay topology, priority, breakout | Cato network rules + bandwidth management profiles | Intent survives; per-overlay *tunnel topologies* do not — one global fabric with app-aware rules and QoS priorities (§5) |
| Tunnel bonding + path conditioning (FEC, POC, DPC) | Last-mile resilience over broadband | Socket last-mile management: active/active links, packet-loss mitigation (packet duplication across links; UDP retransmission on single links), bandwidth management | Same problem, different mechanics; middle mile rides Cato's private backbone where loss is rare |
| Boost (TCP acceleration + data reduction + CIFS acceleration) | WAN optimisation between appliance pairs | Backbone TCP acceleration (PoP as split TCP proxy) + packet-loss mitigation + optimised backbone routing | **Architecturally different** — Cato accelerates via PoP proxying and the backbone, not byte-level deduplication stores or CIFS read-ahead; re-baseline Boost-dependent workloads (§5) |
| First-Packet iQ application classification | App identification for steering/breakout | Application-aware network rules (PoP DPI) | Classification and enforcement happen in the PoP on the same first pass as security inspection |
| Zone-based firewall / IDPS on the appliance | Branch security | WAN/Internet Firewall, IPS, NGAM at the PoP; Socket LAN firewall for local segmentation | One cloud rulebase replaces per-appliance/per-template zone policy |
| Service chaining to Zscaler / Netskope / HPE SSE | Full security inspection | Native single-pass inspection (SPACE) at every PoP | No tunnels to a third-party SWG, no second policy plane, no tunnel orchestration seam |
| HPE Aruba Networking SSE (Axis), where adopted | ZTNA, SWG, CASB, DEM | Cato Client (SDP) ZTNA, SWG, CASB, DLP, Device Posture — same PoP stack as sites | SD-WAN + SSE consolidation in one move; one policy for users and sites |
| Subnet sharing + LAN-side BGP/OSPF | Routing fabric | Cato backbone routing; eBGP at the edges (Cato is eBGP-only, default ASN 64515) | EdgeConnect fabric stays intact during co-existence; handoff via eBGP at hubs (§4) |
| Orchestrator dashboards, flow stats, Boost reports | Visibility | CMA analytics and events, XDR storyboards, SIEM integrations | Boost per-app reduction reports are useful discovery input (§3) |
| EdgeConnect HA appliance pairs | Device redundancy | Socket HA (primary/secondary) plus PoP- and backbone-level resilience | Site survives socket, link and PoP failure independently |

---

## 3. Recommended migration path

Anchored to the Cato PS four-phase methodology: **Discover & Design → Pilot, Build &
Initial Rollout → Advanced Security & Broader Rollout → Tune, Optimise & Handover**
(typical reference plan: four months).

### Phase 1 — Discover & Design (weeks 1–4)

- **Config capture.** Run Orchestrator's scheduled backup (Orchestrator database
  plus per-appliance backups), export the template groups, and pull any
  preconfiguration YAML — sites built via preconfig are self-documenting; sites
  configured by hand are not, so diff templates against per-appliance state
  (**recommended practice** for the diff; the backup/template/preconfig mechanics
  are sourced). The pyedgeconnect Python SDK and Orchestrator REST API can bulk-
  export appliance and overlay configuration for offline analysis.
- **Overlay intent inventory — the core artefact.** For each BIO record: match
  criteria (applications/DSCP/ACLs), topology (full mesh vs hub-and-spoke and
  regions), link-bonding policy, QoS priority, brownout/failover thresholds, and
  the internet-breakout policy (direct, backhaul, or service-chained to which SSE).
  This table *is* the customer's network policy; it becomes Cato network rules,
  bandwidth profiles and firewall policy (**recommended practice** for the method;
  BIO contents are sourced).
- **Boost-dependency inventory.** Orchestrator's Boost/data-reduction reports show
  per-application reduction ratios — use them to find workloads that materially
  depend on deduplication (replication, backup, CIFS over distance) versus those
  that mainly benefit from latency mitigation. The former need explicit treatment
  (§5); the latter map to Cato TCP acceleration (**recommended practice** for the
  method; the reports are shown in the Boost datasheet).
- **Service-chain and SSE inventory.** Which BIOs break out to Zscaler/Netskope/HPE
  SSE tunnels, which security policy lives in the SSE console, SSE contract end
  dates, and remote-access population (HPE SSE ZTNA or a legacy VPN).
- **Routing audit.** LAN-side OSPF/BGP peers per site and their types (Branch /
  Branch-transit / BGP-PE — BGP-PE routes are not shared into the fabric), subnet-
  sharing metrics, static routes, and inbound NAT/published services.
- **Classify the estate**: hub/DC sites, HA-pair branches vs single-appliance,
  EC-V cloud and hypervisor instances, SD-Branch (Aruba Central) populations that
  are out of scope or separately scoped, licensing tier and renewal dates
  (Foundation/Advanced/Boost co-termination).
- **Co-existence design**: eBGP hub-handoff pattern (§4), AS numbering (Cato side
  eBGP-only, default ASN 64515), route filtering/summarisation, PoP egress and
  static-IP allocations, branch cutover template per site class.
- **Foundation setup**: CMA account baseline, IdP/SCIM integration, Cato Client
  packaging and TLSi certificate readiness, socket logistics, SIEM planning.

### Phase 2 — Pilot, Build & Initial Rollout (month 2)

- **Parallel hub deployment.** Stand up sockets (or vSockets) at data centres and at
  each EdgeConnect hub site alongside the EC appliances; establish eBGP handoffs
  into the hub's LAN-side routing; validate route exchange, symmetry and failover
  before any branch moves. The EdgeConnect fabric — subnet sharing and all BIOs —
  stays fully intact on its side of the handoff. Confirm how the Cato-learned
  prefixes propagate into subnet sharing at the hub (peer typing, §5).
- **Policy conversion** from the BIO inventory: network rules and bandwidth
  profiles recreating overlay steering intent (real-time, business-critical, bulk);
  WAN Firewall for any BIO topology restrictions (which sites could reach which);
  Internet Firewall (wizard-assisted initial policy) absorbing the breakout policy;
  IPS/NGAM in monitor-then-block.
- **Pilot site + pilot users.** Cut over one representative branch; deploy the Cato
  Client to a pilot cohort where an SSE/VPN client is being displaced. Rollback for
  the pilot is the standard spoke rollback (§4).

### Phase 3 — Advanced Security & Broader Rollout (month 3)

- **Branch waves**, region by region behind each regional hub handoff, per the
  spoke methodology (§4). Suggested order (**recommended practice**): simple
  single-WAN branches → HA-pair branches → complex sites (local inbound services,
  Boost-heavy sites, EC-V hosts) → hubs last.
- **Security-vendor consolidation sequencing.** Where EdgeConnect service-chains to
  a cloud SWG/SSE, security moves *with each site's cutover*: the socket sends all
  traffic to the Cato PoP, so the site's SSE tunnels are simply not rebuilt —
  retire the Orchestrator SSE tunnel config for migrated sites rather than leaving
  dead tunnels, and keep the SSE tenant alive until its last consuming site and
  user cohort have moved. Migrate SSE/VPN *user* populations in parallel cohorts to
  the Cato Client, re-modelling ZTNA policy with device posture. Time SSE contract
  notice against the final wave, not the first (**recommended practice**; the
  service-chain mechanics are sourced).
- **TLS inspection phased enablement** by category/test groups (PS reference: four
  phases over four weeks), then CASB discovery, tenant controls and DLP
  monitor-mode → enforcement.
- **Boost re-validation per wave.** For sites flagged Boost-dependent in Phase 1,
  measure the workload on Cato during the wave window and apply the §5 mitigations
  before decommissioning the EC pair (**recommended practice**).

### Phase 4 — Tune, Optimise & Handover (month 4)

- Final site and user migrations; QoS tuning against the former BIO priority model;
  security-control validation; SIEM integration live.
- **Decommission**: remove eBGP handoffs as each region completes; retire EC hub
  appliances; cancel/let lapse EdgeConnect bandwidth-tier, Boost and SSE
  subscriptions per the contract map; decommission self-hosted Orchestrator (or
  close the OaaS tenancy) once config/reporting exports are archived; return or
  dispose of appliances (**recommended practice**).
- Documentation, admin training, operational handover.

---

## 4. Co-existence & rollback

### The hub pattern (Cato PS reference — Option F)

The PS multi-region "interim connectivity" design, demonstrated in the deck against
a FortiGate estate and applied identically to EdgeConnect hubs (the legacy side only
needs eBGP, which EdgeConnect supports on the LAN side):

- A **Cato hub site interconnects with each EdgeConnect hub via eBGP** — LAN handoff
  at the hub site, or IPsec to the PoP where no socket can be placed.
- **Path symmetry is maintained by AS-path length**: cross-region routes carry an
  extra inter-hub AS hop, so BGP best-path selection anchors traffic to the local
  regional hub — traffic exits and returns through the same hub, preventing
  asymmetric flows through stateful EdgeConnect firewalls. The EdgeConnect overlay
  (subnet sharing plus BIO tunnels) stays intact and segmented on its side.
- **Dynamic route exchange**: prefixes propagate automatically between the Cato and
  EdgeConnect domains — no per-site route engineering during the window. On the
  EdgeConnect side, ensure the hub peering/redistribution is designed so
  Cato-learned prefixes actually reach the fabric (subnet sharing does not share
  BGP-PE-learned routes; peer typing and redistribution must be checked in design —
  **recommended practice** for the design step; the sharing behaviour is sourced).
- **Spoke migration methodology**: 1) disable the EdgeConnect spoke (Orchestrator)
  so its subnets are withdrawn from subnet sharing and the eBGP exchange; 2) bring
  up the Cato socket site; 3) routes propagate automatically to both domains;
  4) **rollback is the mirror image** — down the socket site, re-enable the EC
  spoke, and routing reconverges.
- **Asymmetry guard-rails**: filter the default route and the prefixes of any
  half-migrated site at each handoff so no site is reachable via both domains at
  once; use BGP summaries and Cato's BGP filtering to keep the exchange tidy.

Where BGP is unavailable at a hub, the PS static alternative is an **interconnect
site with routed ranges**: pre-stage real subnets on the interconnect and dummy
ranges on the future Cato sites; at cutover delete the routed range and update the
dummy range; rollback is re-adding the statics.

### Branch-level co-existence variants (PS deck options, applied to EC branches)

| Pattern | Default gateway | Mechanics | Rollback |
|---|---|---|---|
| EC appliance remains DG, static routes | EC appliance | Socket on a LAN transit; EC routes migrated subnets to the socket | Remove the statics — traffic reverts to the EC overlay instantly |
| EC appliance remains DG, eBGP over LAN transit | EC appliance | eBGP socket ↔ EC (LAN-side BGP); phased subnet migration | Withdraw advertisements / drop the peering |
| L3 switch decides | L3 switch | Core switch routes between legacy and Cato-migrated subnets | Flip routes on the switch |
| Socket as DG, eBGP LAN handoff | Cato Socket | Socket is the gateway; eBGP handoff for legacy prefixes; full HA support | Re-point DG to the EC appliance |
| Socket as DG, Alt-WAN BGP / Gradual Deployment | Cato Socket | Legacy overlay reached via Alt-WAN with eBGP, or Gradual Deployment routing unknown RFC1918 via Alt-WAN | Routes revert via BGP; caveats below |

Alt-WAN caveats (PS deck): configure local routing so Alt-WAN-destined flows are not
first carried to the PoP (avoiding asymmetry), and note Alt-WAN failure does not
trigger socket HA failover — prefer BGP on a LAN handoff where HA matters. Gradual
Deployment handles private (RFC1918) destinations only.

### Security plane during transition

- Migrated sites are inspected by Cato; unmigrated sites keep their EC→SSE service
  chains untouched. Keep both security policies frozen except for mirrored changes
  during the window, and run one client (SSE/VPN or Cato) active per endpoint per
  cohort (**recommended practice**).
- Published/inbound services on EC appliances migrate deliberately — re-publish via
  Cato (remote port forwarding / static-IP egress) or leave on a retained leg until
  their own change window (**recommended practice**).

---

## 5. Gotchas & objection handling

- **"Boost gives us 60–90% data reduction on replication — can Cato match that?"**
  Answer it honestly: no like-for-like feature exists. Boost's data reduction is
  byte-level deduplication between appliance pairs; Cato's optimisation is
  architectural — split-TCP proxying at the PoP (larger effective windows, latency
  mitigation), packet-loss mitigation on the last mile, and a private backbone with
  optimised routing in the middle mile. For latency-bound applications this
  regularly *is* the fix; for bandwidth-bound bulk transfer over thin links the
  dedup benefit disappears and the honest mitigations are: right-size the last mile
  (broadband economics usually allow it), schedule replication windows, use
  application-native dedup/compression (modern backup and storage replication
  tools ship their own), or re-architect the workload (cloud storage/DR). Quantify
  in the PoV with the customer's real flows before the Boost-heavy sites migrate
  (**recommended practice** for the mitigations; both architectures are sourced).
- **CIFS/legacy protocol acceleration.** Boost's CIFS read-ahead/write-behind masks
  chatty-protocol latency. If discovery finds users opening file shares across
  continents, treat it as an application-architecture item (DFS placement, cloud
  file services) rather than a network-feature negotiation; validate the experience
  on Cato's TCP acceleration during the pilot (**recommended practice**; the CIFS
  feature is sourced).
- **Per-overlay topologies don't translate one-to-one.** Up to seven BIOs can each
  have a different topology, bonding policy and breakout rule. Cato is one global
  fabric: steering intent becomes app-aware network rules and bandwidth profiles;
  reachability intent (which overlay meshed where) becomes WAN Firewall policy.
  Most estates use far fewer distinct intents than they have overlays — collapse
  duplicates during the inventory rather than transliterating seven overlays into
  seven rule blocks (**recommended practice**; BIO capability is sourced).
- **Link-bonding expectations on dual-broadband sites.** EdgeConnect's FEC/POC can
  mask genuinely poor circuits. Cato mitigates loss via packet duplication across
  active/active links (and UDP retransmission on single links), but a site that was
  surviving on heavy FEC over two bad DSLs should be flagged for circuit upgrade in
  the wave plan, not discovered at cutover (**recommended practice**; both
  mechanisms are sourced).
- **EC-V virtual estates.** Cloud EC-Vs (AWS/Azure/GCP transit hubs) map to
  vSockets, native IPsec to the PoP, or cloud interconnect — decide per VPC/VNet
  during discovery. Hypervisor EC-Vs at branches usually become physical sockets;
  check anything unusual (EC-V on a host doing double duty) early (**recommended
  practice**; EC-V platforms are sourced).
- **"First-Packet iQ steers on packet one — a PoP round trip must be slower."**
  Cato classifies and inspects in the PoP on the same single pass; the PoP is the
  security edge, so there is no appliance-then-SWG double hop as in the EC + SSE
  service-chain model. Compare end-to-end paths (branch→SSE PoP vs branch→Cato
  PoP), not packet-one behaviour in isolation (**recommended practice** framing;
  both architectures are sourced).
- **The SSE seam is a project risk if unsequenced.** Cutting a site to Cato while
  its users still authenticate to a legacy SSE client, or cancelling the SSE
  contract before the last wave, creates avoidable outages. Keep the SSE tenant
  until the final consuming cohort migrates; map contract notice periods in
  Phase 1 (**recommended practice**).
- **SD-Branch confusion.** If part of the estate is Aruba Central-managed
  SD-Branch/Microbranch (gateways and APs), that is a different product with a
  different console — scope it explicitly (in or out), and don't assume Orchestrator
  exports cover it (sourced product distinction).
- **Orchestrator automation investment.** Teams with pyedgeconnect/preconfig-YAML
  pipelines re-target them at the Cato GraphQL API and Terraform provider — the
  problem class (keeping hundreds of appliance configs consistent) largely
  disappears with one cloud rulebase; what remains is site onboarding and
  policy-as-code (**recommended practice**; both toolchains are sourced).
- **"HPE says EdgeConnect is strategic — the Juniper deal changes nothing."**
  Possibly true; no EOL is announced, and say so. But the customer is entitled to
  ask which of three SD-WAN lines and which of two management clouds (Aruba
  Central vs Mist) carries the long-term roadmap, and what happens to the Axis SSE
  vs Juniper Secure Edge overlap. Analyst and community commentary consistently
  frames this as a rationalisation-in-waiting; a written roadmap commitment is a
  reasonable procurement ask — and the comparison is between that uncertainty and a
  single-vendor, single-platform alternative (sourced commentary; framing
  **recommended practice**).
- **Routing edge cases.** Subnet-sharing metric behaviour, BGP-PE non-sharing,
  overlay-specific route policies and any inbound NAT on EC appliances should be
  listed in discovery and validated in the PoV rather than assumed — standard PoV
  hygiene (**recommended practice**).

---

## 6. Sources

**EdgeConnect architecture and operations**
- Business Intent Overlays (Orchestrator docs; up to seven BIOs, per-overlay SD-WAN vs breakout policy) — https://arubanetworking.hpe.com/techdocs/sdwan/docs/orch/configuration/overlays/bios/
- BIOs and link bonding technical white paper (9.3.0) — https://arubanetworking.hpe.com/techdocs/sdwan-PDFs/docs/tips/HPE-ANW-BIOs-Link-Bonding-TWP_latest.pdf
- Unity/Aruba EdgeConnect platform datasheet (EC family, First-Packet iQ, tunnel bonding, service chaining) — https://www.silver-peak.com/sites/default/files/infoctr/aruba-data-sheet-edgeconnect-solution-121620.pdf
- Path conditioning (FEC/erasure coding, packet order correction) — https://www.silver-peak.com/products/unity-edge-connect/path-conditioning
- Unity Boost datasheet (TCP acceleration techniques, byte-level data reduction, CIFS acceleration, per-Mbps licensing) — https://www.silver-peak.com/sites/default/files/infoctr/silver-peak_ds_boost.pdf
- Boost packaging in 100 Mbps / 10 Gbps blocks (partner overview) — https://www.ctctechnologies.com/articles/silver-peak-add-ons-orchestrator-boost-packages
- EdgeConnect SD-WAN QuickSpecs (licensing tiers Foundation/Advanced/On-Prem, bandwidth tiers, OaaS) — https://www.hpe.com/us/en/collaterals/collateral.a50004289enw.html
- Orchestrator licences page (tiers and bandwidth licences) — https://arubanetworking.hpe.com/techdocs/sdwan/docs/orch/configuration/overlays/licenses/
- EdgeConnect product lifecycle policy (ECOS 9.4 EoM 31 Dec 2026, EoST 31 Dec 2028) — https://arubanetworking.hpe.com/techdocs/sdwan-PDFs/docs/eula/EC_LifecyclePolicy_latest.pdf
- ECOS/Orchestrator release compatibility matrix — https://arubanetworking.hpe.com/techdocs/sdwan/docs/sysreq/compat/ecos_orch/
- Subnet sharing tech note (OSPF/BGP learned routes, metrics, BGP peer types, BGP-PE non-sharing) — https://arubanetworking.hpe.com/techdocs/sdwan-PDFs/docs/tips/Subnet_Sharing_Tech_Note_Latest.pdf
- Orchestrator BGP tab — https://arubanetworking.hpe.com/techdocs/sdwan/docs/orch/configuration/network/bgp/ ; OSPF tab — https://www.arubanetworks.com/techdocs/sdwan/docs/orch/configuration/network/ospf/
- Zscaler Internet Access tunnel orchestration (IPsec/GRE service chaining) — https://arubanetworking.hpe.com/techdocs/sdwan/docs/orch/configuration/cloud/zscaler/
- Schedule Orchestrator backup (Orchestrator + appliance backups) — https://arubanetworking.hpe.com/techdocs/sdwan/docs/orch/orchestrator/sw-setup/schedule-backup/
- Template groups / apply order — https://arubanetworking.hpe.com/techdocs/sdwan/docs/orch/configuration/templates/apply-template-groups/
- pyedgeconnect SDK: generate preconfig (YAML site modelling) — https://pyedgeconnect.readthedocs.io/en/latest/examples/generate_preconfig.html ; EdgeConnect + SSE quickstart orchestration — https://pyedgeconnect.readthedocs.io/en/latest/examples/ec_sse_orchestration.html
- EC-V deployment guides: AWS — https://arubanetworking.hpe.com/techdocs/sdwan-PDFs/deployments/dg_ECV-AWS_latest.pdf ; Azure — https://arubanetworking.hpe.com/techdocs/sdwan-PDFs/deployments/dg_ECV-Azure_latest.pdf ; VMware — https://arubanetworking.hpe.com/techdocs/sdwan-PDFs/deployments/dg_ECV-VMware_latest.pdf ; Hyper-V — https://arubanetworking.hpe.com/techdocs/sdwan-PDFs/deployments/dg_ECV-HyperV_latest.pdf ; cloud host system requirements — https://arubanetworking.hpe.com/techdocs/sdwan/docs/sysreq/sys-req-html/ecv-cloud-host-sys-req/
- EdgeConnect SD-WAN vs SD-Branch (Validated Solution Guide) — https://arubanetworking.hpe.com/techdocs/VSG/docs/070-sd-branch-design/esp-sd-branch-design-040-solution-overview-ec/ ; SD-Branch fundamentals — https://arubanetworking.hpe.com/techdocs/VSG/docs/070-sd-branch-design/esp-sd-branch-design-090-solution-overview-sdb/ ; unified fabric overview — https://arubanetworking.hpe.com/techdocs/sdwan/docs/unified-fabric/overview/

**HPE SSE (Axis Security)**
- HPE Aruba Networking SSE product page (ZTNA/SWG/CASB/DEM; 500+ edge locations) — https://www.hpe.com/us/en/aruba-networking-sse.html ; QuickSpecs — https://www.hpe.com/us/en/collaterals/collateral.a50009212enw.html
- HPE 8-K / Axis Security acquisition (announced 2 March 2023) — https://www.sec.gov/Archives/edgar/data/1645590/000164559023000029/ex-992x322023x8k.htm ; SDxCentral coverage — https://www.sdxcentral.com/news/hpe-stock-jumps-on-heels-of-sase-acquisition-record-q1-earnings/

**Corporate history and analyst/community commentary**
- HPE completes Silver Peak acquisition, 21 September 2020, $925M (8-K press release) — https://www.sec.gov/Archives/edgar/data/1645590/000164559020000043/exh991pressrelease9-21.htm ; coverage — https://insidehpc.com/2020/09/hpe-completes-acquisition-of-sd-wan-vendor-silver-peak/
- HPE closes Juniper Networks acquisition, 2 July 2025 (~$13.4bn, $40/share) — https://www.hpe.com/us/en/newsroom/press-release/2025/07/hewlett-packard-enterprise-closes-acquisition-of-juniper-networks-to-offer-industry-leading-comprehensive-cloud-native-ai-driven-portfolio.html
- Dell'Oro: HPE acquires Juniper — SASE/SD-WAN overlap analysis — https://www.delloro.com/hpe-acquires-juniper-what-does-this-mean-for-its-network-security-and-sase-sd-wan-aspirations/
- SDxCentral: "Will HPE eliminate Juniper Networks' SASE in favor of Aruba plus Axis?" — https://www.sdxcentral.com/analysis/will-hpe-eliminate-juniper-networks-sase-in-favor-of-aruba-plus-axis/
- Community buyer's guide on the three HPE SD-WAN lines and rationalisation pattern — https://networkdevicesinc.com/community/blog/aruba-vs-juniper-hpe-merger-2026-buyers-guide

**Cato (public)**
- Accelerating and Optimizing Traffic — https://support.catonetworks.com/hc/en-us/articles/360001868837-Accelerating-and-Optimizing-Traffic ; Explaining the Cato TCP Acceleration and Best Practices (PoP as split TCP proxy) — https://support.catonetworks.com/hc/en-us/articles/360006675977-Explaining-the-Cato-TCP-Acceleration-and-Best-Practices
- Packet Loss Mitigation for Multi-Tunnel Links (packet duplication; UDP retransmission) — https://support.catonetworks.com/hc/en-us/articles/360011176237-Packet-Loss-Mitigation-for-Multi-Tunnel-Links ; What is Cato SD-WAN (active/active, last-mile management) — https://support.catonetworks.com/hc/en-us/articles/35675890271133-What-is-Cato-SD-WAN
- Cato on WAN optimisation as a SASE use case — https://www.catonetworks.com/glossary-use-cases/wan-optimization/
- Using BGP in the Cato Cloud (eBGP-only, default ASN 64515) — https://support.catonetworks.com/hc/en-us/articles/7825408860573-Using-BGP-in-the-Cato-Cloud ; Configuring BGP Neighbors for a Cato Socket — https://support.catonetworks.com/hc/en-us/articles/4413273474065-Configuring-BGP-Neighbors-for-a-Cato-Socket
- Working with BGP Filtering — https://support.catonetworks.com/hc/en-us/articles/23972529384733-Working-with-BGP-Filtering ; BGP Summary Routes — https://support.catonetworks.com/hc/en-us/articles/13472104226717-Working-with-BGP-Summary-Routes ; Integrating Cato with an Alt WAN Network — https://support.catonetworks.com/hc/en-us/articles/360011175857-Integrating-Cato-with-an-Alt-WAN-Network
- Configuring Network Rules — https://support.catonetworks.com/hc/en-us/articles/7785698733341-Configuring-Network-Rules ; Bandwidth Management Profiles — https://support.catonetworks.com/hc/en-us/articles/4413280514065-What-are-the-Cato-Bandwidth-Management-Profiles
- Internet Firewall Configuration Wizard — https://support.catonetworks.com/hc/en-us/articles/27286761010205-Using-the-Internet-Firewall-Configuration-Wizard ; Configuring the Socket LAN Firewall Policy — https://support.catonetworks.com/hc/en-us/articles/10642755314205-Configuring-the-Socket-LAN-Firewall-Policy
- Understanding Packet Flow with Cato SPACE — https://support.catonetworks.com/hc/en-us/articles/12545093882909-Understanding-Packet-Flow-with-Cato-SPACE-Architecture
- What is the Cato API — https://support.catonetworks.com/hc/en-us/articles/20564679978397-What-is-the-Cato-API ; Terraform provider — https://registry.terraform.io/providers/catonetworks/cato/latest

**Cato (internal)**
- Cato Professional Services deck, 2026 (`_extract/andy-professional-services-deck-combined-slides-2026.md`): four-phase methodology and reference plan (slides 10–16); multi-region Option F eBGP interim connectivity and AS-path symmetry (slide 57); regional-hub example and spoke migration/rollback (slide 58); interconnect routed-ranges and BGP-hub patterns, parallel sockets (slides 60–69); phased TLS inspection (slides ~44–46).
