# Migration Brief: Check Point → Cato SASE Cloud

> SE-enablement research brief. UK English. Sourced claims carry a reference to the
> Sources section (§6); anything marked **recommended practice** is standard Cato SE/PS
> guidance without a public citation. Internal anchor: Cato PS deck digest
> (`_extract/andy-professional-services-deck-combined-slides-2026.md`), cited as **[PS deck]**.

---

## 1. Vendor snapshot

**Products in scope**

| Product | Role in the estate |
|---|---|
| Quantum Security Gateways (3000/5000/6000/7000/9000/15000/23000/26000/28000 series, Quantum Force) & CloudGuard Network gateways | Branch/DC edge firewall, IPsec hub, routing, NAT, HTTPS Inspection; software blades enabled per gateway |
| Quantum Spark | SMB/branch appliances, often centrally managed |
| Quantum Maestro (MHO orchestrators + Security Group members) | Hyperscale clustering: multiple gateways load-shared as one logical system [S8] |
| VSX / Virtual Systems | Multi-context firewalling: many virtual firewalls on one gateway or cluster [S9] |
| Security Management Server / SmartConsole (and Multi-Domain Server for large estates) | Central policy (Access Control layers, NAT, Threat Prevention), object database, logging (SmartLog/SmartEvent) [S10] |
| Identity Awareness blade | User/machine identity in policy via AD Query, Identity Collector, Captive Portal, agents; PDP/PEP gateway roles [S11] |
| Remote Access VPN / Mobile Access blades | Legacy client VPN (Endpoint Security VPN client) and clientless portal terminating on the gateway [S12] |
| Harmony SASE (ex-Perimeter 81) | Cloud SSE/ZTNA: agent, cloud gateways/private networks, Internet access — acquired August 2023 for ~$490m, completed September 2023 [S4][S5][S6] |
| Harmony Connect (legacy) | Check Point's first-generation cloud SSE; end-of-sale declared end of 2023, with a published EOL and service-termination notice (sk184452) [S7] |

**Typical enterprise deployment.** ClusterXL HA pairs (or Maestro Security Groups) at
DC/hub sites acting as L3 default gateway, IPsec termination and inspection point;
smaller Quantum or Spark appliances at branches; one Security Management Server (or MDS
with per-domain CMAs) driving policy packages via SmartConsole; Identity Awareness fed
by AD Query or Identity Collector; remote access via the legacy Remote Access VPN blade,
Harmony SASE, or both. CloudGuard Network extends the same gateway model into
public-cloud VNets/VPCs.

**Verifiable migration drivers**

- **Software lifecycle pressure.** Check Point's published support end dates: R80.40 —
  April 2024; R81 — October 2024; R81.10 — March 2026; R81.20 — May 2027; R82 — April
  2029 [S1]. Estates still on R81.10 face a forced major-version upgrade project (gateways
  *and* management, which must be upgraded first) — a natural decision point to move the
  inspection to a cloud service instead.
- **Hardware end-of-support wave.** A large cohort of widely deployed appliances —
  3100/3200, 5100/5200/5400/5600/5900, 15400/15600 and 23500/23800/23900 — reaches end of
  support in December 2025 [S1][S2]. Refresh quotes for Quantum Force replacements land
  at exactly the moment a SASE alternative can be tabled.
- **The SASE story was reset by acquisition.** Check Point acquired Perimeter 81
  (announced 10 August 2023, ~$490m; completed 13 September 2023) and rebuilt its SASE
  offer on that stack as Harmony SASE [S4][S5][S6]. The prior cloud service, Harmony
  Connect, went end-of-sale at the end of 2023 with a formal EOL/service-termination
  notice — existing Harmony Connect customers were required to migrate platforms once
  already [S7]. Harmony SASE runs in its own Infinity Portal application with its own
  agent and policy model, separate from the Quantum rulebase — Check Point's "single
  platform" is in practice at least two policy planes [S13].
- **Appliance patching burden and exposure.** CVE-2024-24919, a zero-day information
  disclosure in internet-exposed Quantum gateways with Remote Access VPN/Mobile Access
  enabled, was exploited in the wild (attempts observed from April 2024) and added to
  CISA's Known Exploited Vulnerabilities catalogue; hotfixes were required across R80.40
  through R81.20, Maestro, Scalable Chassis and Spark [S3]. Cato's cloud service is
  patched by Cato, with no customer-side gateway hotfix cycles.
- **Per-gateway blade licensing.** Security value is sold as software blades enabled per
  gateway (Application Control, URL Filtering, IPS, Anti-Bot, Anti-Virus, SandBlast/Threat
  Emulation, Identity Awareness, DLP, HTTPS Inspection features) [S10][S14][S15]. Cato's
  equivalent protections are platform capabilities delivered at every PoP rather than
  per-appliance licences.

---

## 2. Component → Cato mapping

| Check Point component | Function | Cato equivalent | Notes |
|---|---|---|---|
| Quantum Security Gateway / ClusterXL pair / Spark | Edge firewall, routing, IPsec, inspection | Cato Socket (X-series) / vSocket + PoP single-pass inspection (FWaaS) | Socket is a thin SD-WAN edge; all security runs in the PoP. Socket LAN Firewall covers local L3/L4/L7 flows [S16] |
| Quantum Maestro (MHO + Security Groups) | Scale-out clustering of appliances [S8] | Cato PoP capacity — scaling is the provider's problem | No orchestrators, SGMs or Security Group design to own; DC throughput becomes a socket/vSocket sizing exercise (see §5) |
| VSX Virtual Systems | Many virtual firewalls on shared hardware [S9] | Policy scoping in one CMA account (site/VLAN/user/group-scoped WAN FW rules, Socket LAN FW); separate accounts only for true multi-tenant | No per-context config plane; see §5 for overlapping-IP and delegation implications |
| SmartConsole + Security Management Server / MDS | Central policy, objects, logging | Cato Management Application (CMA) | SaaS console; no management server to size, upgrade or licence; audit trail and analytics native, SIEM export available [PS deck] |
| Access Control policy: Ordered Layers & Inline Layers | Segmented, hierarchical rulebase [S17] | WAN Firewall (allowlist, implicit block) + Internet Firewall (blocklist, implicit allow) + Socket LAN Firewall | No layer construct — the hierarchy must be flattened; opposite default postures per rulebase must be designed for [S18][S19] |
| NAT rulebase (automatic + manual rules) | SNAT/DNAT, separate from access policy [S20] | Site-level NAT policy; Remote Port Forwarding (Cato allocated IPs) / Local Port Forwarding for inbound | Most branch hide-NAT disappears (PoP handles Internet SNAT); audit DC manual NAT line-by-line [S21][S22] |
| Identity Awareness (AD Query, Identity Collector, Captive Portal, agents; PDP/PEP) | User/machine identity in policy [S11] | Cato User Awareness: AD/LDAP sync, SCIM (Entra ID/Okta), Cato Identity Agent | Identity comes from the directory/IdP and Client, not from gateway-side collectors — the Identity Collector servers are decommissioned [S23][S24] |
| HTTPS Inspection blade | TLS break-and-inspect on the gateway [S14] | Cato TLS Inspection (account-level, wizard-assisted, PoP-executed) | Does **not** port 1:1 — rebuild via Cato's phased best practice [S25][S26] |
| Application Control + URL Filtering blades | L7 app/web policy [S15] | Internet Firewall app awareness + SWG URL categories; custom apps for anything niche | Category taxonomies differ — map by intent, validate in pilot (**recommended practice**) |
| IPS / Anti-Virus / Anti-Bot / Threat Emulation (SandBlast) | Threat prevention profiles [S27] | Cato IPS, Next-Gen Anti-Malware, sandboxing, DNS protection | Platform capabilities at every PoP; enable monitor-then-block per Cato best practice [S28] |
| DLP blade | Content inspection on the gateway [S29] | Cato DLP (content profiles, predefined + custom data types, EDM) | Rebuild data-type by data-type; start in monitor mode [S30][S31] |
| Remote Access VPN / Mobile Access blades | Legacy client VPN + clientless portal [S12] | Cato Client (SDP/ZTNA) + Browser (clientless) Access | Removes the exposed VPN surface implicated in CVE-2024-24919 [S3] |
| Harmony SASE agent + cloud gateways/private networks | SSE/ZTNA (Perimeter 81 stack) [S13] | Cato Client + Cato PoPs — same single-pass cloud as site traffic | One agent, one policy plane for users and sites, instead of Quantum + Harmony SASE split |
| Site-to-site VPN communities (star/mesh) | Third-party/partner VPNs | Cato IPsec sites (IKEv1/v2), BGP supported | Partner VPNs terminate on the PoP, not on site hardware [S32] |
| SmartLog / SmartEvent | Log storage, correlation, reporting | CMA events/analytics + SIEM integration | Plan retention/export before decommissioning the management estate [PS deck] (**recommended practice**) |

---

## 3. Recommended migration path (Cato PS methodology)

Cato PS runs delivery as four phases — **Discover & Design → Pilot, Build & Initial
Rollout → Advanced Security & Broader Rollout → Tune, Optimise & Handover** — typically
across a ~4-month example plan [PS deck]. Applied to a Check Point estate:

### Phase 1 — Discovery & co-existence design

- Standard PS discovery: business objectives, network/security architecture, traffic
  flows, site interdependencies, LAN architecture, routing strategy, DMZ/voice/Internet
  integration; agree migration options and a co-existence strategy [PS deck].
- **Export the Check Point estate via the Management API.** `mgmt_cli show
  access-rulebase` (or the Web API) with `use-object-dictionary true`,
  `show-hits true` and `--format json` pulls each layer with hit counts; note the
  API caps `limit` at 500 per call (paginate with `offset`) and returns a single layer
  per query — **inline layers must be queried separately** [S33][S34]. The open-source
  ExportImportPolicyPackage tool exports a full policy package (R80.10+) for offline
  analysis [S35]. Capture NAT rules, Threat Prevention profiles, HTTPS Inspection
  policy, VPN communities, Identity Awareness sources and (if present) the Harmony SASE
  tenant configuration. On MDS, repeat per domain.
- **Clean the rulebase before translating it.** Use the exported hit counts and
  last-modified metadata to strip zero-hit, disabled and shadowed rules and collapse
  duplicated objects — CheckMates-documented API filters make zero-hit extraction
  scriptable [S33]. A decade of SmartConsole history translated verbatim into CMA
  imports the mess (**recommended practice**).
- **Layer flattening design.** Map each Ordered Layer/Inline Layer branch to its Cato
  destination: WAN Firewall (east-west, allowlist), Internet Firewall (north-south,
  blocklist) or Socket LAN Firewall (intra-site) [S17][S18][S19][S16]. Record each
  layer's implicit cleanup action and each "accept continues to the next layer"
  dependency so intent survives flattening (see §5). Cato PS schedules "Security Policy
  Conversion" as an explicit workstream [PS deck].
- **Identity design.** Choose SCIM (Entra ID/Okta) and/or LDAP sync to replace AD
  Query/Identity Collector feeds; plan the Cato Identity Agent where non-SDP user
  identification is needed [S23][S24].
- Foundation setup in CMA: account baseline, IdP/SSO integration, test users and a
  feedback channel; distribute the Cato Client and the Cato TLS root certificate early,
  before they are needed [PS deck].
- Logistics: socket plan and shipping; SIEM integration planning [PS deck].

### Phase 2 — Pilot, build & initial rollout

- Convert and implement security and access policies; deploy the Cato Client to pilot
  users; validate Internet connectivity at a pilot site; integrate identity and SIEM
  [PS deck].
- **Parallel DC/DR deployment**: stand up sockets alongside the Check Point estate with
  the Quantum gateway (or Maestro Security Group) still the L3 default gateway — the
  handoff patterns in §4 decide which network carries each prefix [PS deck].
- Start Client Connectivity / Device Posture policy in **monitor mode** for device
  discovery before enforcing [PS deck].
- Pre- and post-migration test plans per site; validate inbound flows (RPF) and
  return-path routing before any cutover [PS deck].

### Phase 3 — Advanced security & broader rollout

- **Agent swap by user cohort.** The PS plan runs SDP Migration Groups 1–4 as phased
  waves across months 2–4 with feedback and Client Connectivity tuning between waves
  [PS deck]. Per cohort: enrol users (SCIM), enable the Cato Client, confirm app access,
  then remove the legacy client — Endpoint Security VPN or the Harmony SASE agent —
  from that cohort's devices. Do not leave two tunnel clients active long-term (§4).
- **HTTPS Inspection → Cato TLSi is a re-build, not a port.** Follow Cato's phased
  enablement: prerequisites (block QUIC, deploy the Cato root certificate, define test
  groups), initial policy with source/destination bypasses, then gradual enablement
  over ~4 phases from high-risk/low-impact URL categories outward, tuning bypasses as
  pinned apps surface [S25][S26][PS deck]. Carry over the *intent* of the Check Point
  HTTPS Inspection bypass list (banking/health categories, pinned apps), not the rules
  themselves (**recommended practice**).
- Enable advanced services in sequence once the baseline is stable: IPS/NGAM in the
  monitor-then-block progression, CASB discovery, DLP monitor mode, posture enforcement
  [S28][PS deck].
- **Site waves with per-prefix cutover.** Migrate branches in groups; at each site's
  window, move its subnets to the socket via the static or eBGP handoff (§4) rather than
  a big-bang LAN cutover, so each prefix is individually revertible [PS deck].

### Phase 4 — Tune, optimise & decommission

- Account/policy fine-tuning, validation of security controls, operational workflow and
  alerting review, documentation and admin training, transition to BAU [PS deck].
- Decommission sequence (**recommended practice**): retire the legacy remote-access
  surface (Remote Access VPN/Mobile Access blades, Harmony SASE tenant) once the last
  cohort is migrated → retire branch gateways → retire DC gateways/Maestro Security
  Groups and orchestrators once traffic and events verify clean → decommission Identity
  Collector servers → **decommission the Security Management Server / MDS last**, after
  exporting or archiving SmartLog/SmartEvent data to satisfy retention obligations →
  terminate blade subscriptions and support contracts at renewal.

---

## 4. Co-existence & rollback

**Parallel-socket patterns (the standard Cato approach).** The socket is installed
alongside the Check Point edge, and a routing handoff decides which network carries each
subnet. The PS deck describes three placement options, chosen by where the routing
decision lives [PS deck]:

1. **L3 switch as default gateway** — the switch routes migrated subnets to the socket
   (static or BGP); keeps throughput off the Quantum gateway; simple, easily reversed.
2. **Check Point firewall remains default gateway** — a LAN transit VLAN (or spare
   interface/trunk VLAN) carries either static routes or an **eBGP handoff between the
   socket and the gateway** (Gaia supports BGP natively); migrated subnets are routed to
   Cato per prefix, everything else stays on Check Point. Dynamic propagation plus
   simple rollback; Cato-side routes can be isolated by tagging with the Cato ASN and
   community 32768 [PS deck][S32].
3. **Socket becomes default gateway** — gradual deployment via Alt-WAN or LAN BGP
   handoff selectively routes not-yet-migrated traffic back to the legacy network [PS deck].

For multi-site estates, add an **interconnecting hub site** (both legacy CPE and socket)
so legacy and Cato islands keep talking during transition — either static "routed ranges
with dummy-range pre-staging" or a BGP hub [PS deck]. Parallel connectivity at every
site is the preferred pattern below roughly 20 sites; larger or multi-region estates use
hub or phased-regional options [PS deck].

**What breaks in DIY co-existence**

- **Asymmetric routing through the stateful Check Point.** If traffic egresses via Cato
  but returns via the Quantum gateway (or crosses regions through different hubs), its
  stateful inspection drops the unseen flow — the PS deck flags that asymmetric paths
  "cause stateful inspection failures and traffic drops during coexistence"; fixes are
  parallel connectivity per region, hub anchoring, or AS-path design that keeps regional
  symmetry [PS deck]. ClusterXL/Maestro flow ownership makes Check Point strict about
  this (**recommended practice** on the specifics).
- **Double TLS inspection.** If the HTTPS Inspection blade stays enabled on a path Cato
  now also inspects, users hit certificate-on-certificate failures and pinned apps break
  twice over. Disable gateway HTTPS Inspection for Cato-routed traffic, or scope Cato
  TLSi to bypass those paths until cutover (**recommended practice**; individual
  behaviours per [S25]).
- **Dual tunnel clients.** Cato documents that third-party VPN drivers on the same
  machine can conflict with and override Cato Client settings [S36]. Keep the per-cohort
  switch (Endpoint Security VPN or Harmony SASE agent → Cato Client) short and scripted:
  install Cato Client → validate → uninstall the legacy client. Deploy the Client and
  certificates early to remove the legacy dependency [PS deck].
- **Inbound published services.** Anything DNAT-published through the Check Point NAT
  rulebase must be consciously re-homed to Remote Port Forwarding via Cato allocated IPs
  or Local Port Forwarding at the socket — and external DNS updated — before the gateway
  is retired [S21][S22]. Validate the return route goes back via the socket [PS deck].
- **Identity continuity.** Rules that depend on Identity Awareness (PDP/PEP-shared
  identities) must have their Cato-side equivalents proven — SCIM/LDAP sync populated,
  Identity Agent deployed where needed — before the gateway-side identity sources are
  switched off [S11][S23][S24] (**recommended practice**).

**Rollback levers per phase**

| Phase | Rollback lever |
|---|---|
| Pilot site | Remove the static route / withdraw the BGP prefix at the L3 switch or gateway; traffic reverts to Check Point instantly [PS deck] |
| Subnet migration (routed-range pattern) | Re-add the dummy range on the Cato site and restore the statics at the interconnect — the deck's designed rollback [PS deck] |
| BGP handoff | Withdraw the prefix; routes propagate back automatically [PS deck] |
| User cohorts | Re-enable the legacy client for the affected cohort while the VPN blades / Harmony SASE tenant still exist — keep them warm until the final wave completes (**recommended practice**) |
| TLS inspection | Roll back to an earlier enablement phase without disabling TLSi entirely [PS deck] |
| Full site | Physical LAN cutover reversal; the deck rates big-bang LAN cutovers "complex rollback" — a reason to prefer parallel patterns [PS deck] |

---

## 5. Gotchas & objection handling

- **Ordered/Inline Layer semantics do not translate mechanically.** In Check Point, an
  Accept in one Ordered Layer *continues* matching into the next layer (every layer must
  pass), each layer carries its own implicit cleanup action, and Inline Layers nest
  parent/sub rules; layers can be shared across policy packages and delegated to
  different administrators [S17]. Cato's WAN/Internet/LAN firewalls are flat, first-match
  rulebases with fixed default postures (WAN implicit block, Internet implicit allow)
  [S18][S19]. Flattening is a design exercise: model the effective policy (what actually
  passes all layers), not the layer structure. Budget conversion effort by number of
  layers and inter-layer dependencies, not raw rule count (**recommended practice**).
- **NAT lives in its own rulebase.** Check Point separates access policy from NAT policy,
  with automatic NAT (object-driven) and manual NAT rules evaluated first-match [S20].
  Inventory both types during export; most branch hide-NAT disappears behind the PoP, but
  DC manual NAT (static NAT, port translation, no-NAT exemptions between internal nets)
  needs line-by-line disposition against Cato's site-level NAT and RPF/LPF model
  [S21][S22] (**recommended practice** on the mapping).
- **Identity Awareness has infrastructure of its own.** AD Query needs privileged WMI
  access to domain controllers; Identity Collector runs on Windows servers polling
  identity sources; PDP gateways share identities with PEP enforcement points [S11].
  These are components to inventory *and decommission*, and rules that silently depend on
  identity (including in HTTPS Inspection and Application Control layers) must be flagged
  in discovery. On the Cato side, identification comes from SCIM/LDAP and the Client or
  Identity Agent [S23][S24] — verify licence coverage for every user the policy must
  identify.
- **Maestro estates ("we need hyperscale").** Maestro exists to load-share up to 52
  appliances behind orchestrators as one logical gateway [S8] — it solves an appliance
  scaling problem Cato does not have, because inspection capacity lives in the PoPs.
  The honest counter: the customer's DC egress/WAN throughput becomes a socket/vSocket
  sizing and HA design conversation with Cato, and the Maestro-specific operational
  surface (MHO firmware, SGM membership, Security Group design, dual-site sync)
  disappears entirely. Do not quote throughput figures from memory — size formally
  (**recommended practice**).
- **VSX multi-context estates.** Each Virtual System has its own interfaces, routing and
  policy [S9]. In Cato, a single account with scoped WAN FW/LAN FW rules usually replaces
  context separation; genuine multi-tenant requirements (e.g. divested business units,
  regulated separation) may justify separate Cato accounts. The hard case is overlapping
  IP space across Virtual Systems — surface it in discovery, as it forces re-addressing
  or NAT design either way (**recommended practice**).
- **"Check Point has the best threat prevention."** Efficacy debates rarely land. Anchor
  instead on operational reality: blade-based protections are bounded by the appliance's
  sizing and software train, HTTPS Inspection is commonly constrained or switched off on
  appliances for performance/complexity reasons (Check Point maintains a dedicated
  best-practice SK for it [S26]), and the 2024 gateway zero-day showed the appliance
  itself is attack surface [S3]. Cato delivers IPS/NGAM/sandboxing/TLSi at every PoP,
  always current, with no customer patch cycle [S27 vs S28].
- **"We already own Harmony SASE."** It is a separate stack: Perimeter 81-derived cloud,
  own agent, own portal application, distinct from the Quantum rulebase [S13][S4]. The
  estate still runs two policy planes and two inspection paths — and Harmony Connect
  customers have already been through one forced platform migration inside the same
  vendor [S7]. Peer comparison data positions Cato ahead on platform convergence and
  usability [S37][S38]. Argue consoles-and-policies, not feature checklists.
- **SmartEvent/log retention.** Export or archive SmartLog/SmartEvent data before the
  management server is decommissioned; stand up the Cato-side SIEM integration in
  Phase 1 so there is no visibility gap [PS deck] (**recommended practice** on the
  retention step itself).
- **Timing leverage.** The December 2025 hardware EOS wave [S1][S2] and the R81.10
  March 2026 software deadline [S1] both force spend on the status quo — align the
  business case and pilot to land before the customer signs a refresh or an upgrade
  project (**recommended practice**).

---

## 6. Sources

- [S1] Check Point — Support Life Cycle Policy (software and appliance support end dates): https://www.checkpoint.com/support-services/support-life-cycle-policy/
- [S2] Bytes — Check Point firewall appliances reach end of life in December 2025: https://www.bytes.co.uk/info/news/check-point-software-technologies-firewall-appliances-reach-end-life-december-2025-upgrade-give-you-a-smiley-face
- [S3] CVE-2024-24919 — Check Point advisory/hotfix sk182336 and analysis: https://support.checkpoint.com/results/sk/sk182336 and https://nvd.nist.gov/vuln/detail/cve-2024-24919 and https://www.tenable.com/blog/cve-2024-24919-check-point-security-gateway-information-disclosure-zero-day-exploited-in-the
- [S4] Check Point press release — To acquire Perimeter 81: https://www.checkpoint.com/press-releases/check-point-to-acquire-perimeter-81-to-deliver-the-fastest-and-most-secure-sase-solution-in-the-industry/
- [S5] TechCrunch — Check Point buys Perimeter 81 for $490M: https://techcrunch.com/2023/08/10/check-point-buys-perimeter-81-for-490m-to-enhance-its-security-tools-for-hybrid-and-remote-workers/
- [S6] Check Point SEC Form 20-F FY2023 (acquisition completed 13 September 2023): https://www.sec.gov/Archives/edgar/data/0001015922/000117891324001196/zk2431186.htm
- [S7] Check Point — sk184452 Harmony Connect EOL and Service Termination Notice; sk181531 Harmony Connect End of Sale Policy and FAQ: https://support.checkpoint.com/results/sk/sk184452 and https://support.checkpoint.com/results/sk/sk181531
- [S8] Check Point — Maestro Hyperscale Network Security and R82 Scalable Platforms Admin Guide: https://www.checkpoint.com/quantum/maestro-hyperscale-network-security/ and https://sc1.checkpoint.com/documents/R82/WebAdminGuides/EN/CP_R82_ScalablePlatforms_AdminGuide/Content/Topics-SPG/Maestro/Working-with-Maestro.htm
- [S9] Check Point — R81 VSX Administration Guide (Introduction / Virtual Devices): https://sc1.checkpoint.com/documents/R81/WebAdminGuides/EN/CP_R81_VSX_AdminGuide/Topics-VSXG/Introduction.htm
- [S10] Check Point — R81.20 Security Management Administration Guide: https://sc1.checkpoint.com/documents/R81.20/WebAdminGuides/EN/CP_R81.20_SecurityManagement_AdminGuide/CP_R81.20_Quantum_SecurityManagement_AdminGuide.pdf
- [S11] Check Point — R81.20 Identity Awareness Administration Guide (PDP/PEP, AD Query, Identity Collector): https://sc1.checkpoint.com/documents/R81.20/WebAdminGuides/EN/CP_R81.20_IdentityAwareness_AdminGuide/CP_R81.20_IdentityAwareness_AdminGuide.pdf
- [S12] Check Point — R81.20 Mobile Access Administration Guide: https://sc1.checkpoint.com/documents/R81.20/WebAdminGuides/EN/CP_R81.20_MobileAccess_AdminGuide/CP_R81.20_MobileAccess_AdminGuide.pdf
- [S13] Check Point — Harmony SASE Administration Guide (Infinity Portal) and Harmony SASE FAQ sk182225: https://sc1.checkpoint.com/documents/Infinity_Portal/WebAdminGuides/EN/SASE-Admin-Guide/Content/Topics-SASE-AG/Getting-Started-Harmony-SASE/Getting-Started.htm and https://support.checkpoint.com/results/sk/sk182225
- [S14] Check Point — R81.20 Security Gateway Guide, HTTPS Inspection: https://sc1.checkpoint.com/documents/R81.20/WebAdminGuides/EN/CP_R81.20_SecurityGateway_Guide/Content/Topics-FWG/HTTPS-Inspection.htm
- [S15] Check Point — R81.20 Creating Application Control and URL Filtering Rules: https://sc1.checkpoint.com/documents/R81.20/WebAdminGuides/EN/CP_R81.20_SecurityManagement_AdminGuide/Content/Topics-SECMG/Creating-Application-Control-and-URL-Filtering-Rules.htm
- [S16] Cato Learning Center — What are Cato Sockets / Socket LAN Firewall Policy: https://support.catonetworks.com/hc/en-us/articles/30175650827677-What-are-Cato-Sockets and https://support.catonetworks.com/hc/en-us/articles/10642755314205-Configuring-the-Socket-LAN-Firewall-Policy
- [S17] Check Point — R81 Security Management Admin Guide, Ordered Layers and Inline Layers: https://sc1.checkpoint.com/documents/R81/WebAdminGuides/EN/CP_R81_SecurityManagement_AdminGuide/Topics-SECMG/Ordered-Layers-and-Inline-Layers.htm
- [S18] Cato Learning Center — What is the Cato WAN Firewall?: https://support.catonetworks.com/hc/en-us/articles/4413265660305-What-is-the-Cato-WAN-Firewall
- [S19] Cato Learning Center — Recommendations for Internet and WAN Firewall Policies: https://support.catonetworks.com/hc/en-us/articles/360004274777-Recommendations-for-Internet-and-WAN-Firewall-Policies
- [S20] Check Point — R81 Security Management Admin Guide, Configuring the NAT Policy / Manual NAT Rules: https://sc1.checkpoint.com/documents/R81/WebAdminGuides/EN/CP_R81_SecurityManagement_AdminGuide/Topics-SECMG/Configuring-NAT-Policy.htm and https://sc1.checkpoint.com/documents/R81/WebAdminGuides/EN/CP_R81_SecurityManagement_AdminGuide/Topics-SECMG/Working_with_Manual_NAT_Rules.htm
- [S21] Cato Learning Center — Configuring a Site-Level NAT Policy: https://support.catonetworks.com/hc/en-us/articles/15601094616861-Configuring-a-Site-Level-NAT-Policy
- [S22] Cato Learning Center — Remote Port Forwarding / Local Port Forwarding: https://support.catonetworks.com/hc/en-us/articles/7784979714333-Configuring-Remote-Port-Forwarding-for-the-Account and https://support.catonetworks.com/hc/en-us/articles/4413265637393-Configuring-Local-Port-Forwarding-for-a-Site
- [S23] Cato Learning Center — Overview of Directory Services and User Awareness: https://support.catonetworks.com/hc/en-us/articles/4413280525585-Overview-of-Directory-Services-and-User-Awareness
- [S24] Cato Learning Center — Provisioning Users with SCIM (and SCIM+LDAP): https://support.catonetworks.com/hc/en-us/articles/13651160092701-Provisioning-Users-with-SCIM and https://support.catonetworks.com/hc/en-us/articles/16441170777757-Provisioning-Users-with-SCIM-and-LDAP
- [S25] Cato Learning Center — Best Practices for TLS Inspection / TLS Inspection Configuration Wizard: https://support.catonetworks.com/hc/en-us/articles/360007713437-Best-Practices-for-TLS-Inspection and https://support.catonetworks.com/hc/en-us/articles/23739970551453-Using-the-TLS-Inspection-Configuration-Wizard
- [S26] Check Point — sk108202 Best Practices: HTTPS Inspection: https://support.checkpoint.com/results/sk/sk108202
- [S27] Check Point — R81.20 Threat Prevention Administration Guide: https://sc1.checkpoint.com/documents/R81.20/WebAdminGuides/EN/CP_R81.20_ThreatPrevention_AdminGuide/CP_R81.20_ThreatPrevention_AdminGuide.pdf
- [S28] Cato Learning Center — Best Practices for Implementing Cato Threat Prevention: https://support.catonetworks.com/hc/en-us/articles/360011316297-Best-Practices-for-Implementing-Cato-Threat-Prevention
- [S29] Check Point — R81 Data Loss Prevention Administration Guide: https://sc1.checkpoint.com/documents/R81/WebAdminGuides/EN/CP_R81_DataLossPrevention_AdminGuide/Topics-DLPG/Configuring-HTTPS-Inspection.htm
- [S30] Cato Learning Center — What is the Cato DLP Service / Creating DLP Content Profiles: https://support.catonetworks.com/hc/en-us/articles/5606495447197-What-is-the-Cato-DLP-Service and https://support.catonetworks.com/hc/en-us/articles/5352915107869-Creating-DLP-Content-Profiles
- [S31] Cato Learning Center — Predefined/Custom Data Types and Exact Data Matching for DLP: https://support.catonetworks.com/hc/en-us/articles/32901519994781-Working-with-Predefined-Data-Types-for-DLP and https://support.catonetworks.com/hc/en-us/articles/16676236807453-Working-with-Exact-Data-Matching-EDM-for-DLP
- [S32] Cato Learning Center — Using BGP in the Cato Cloud / BGP Neighbors for a Socket: https://support.catonetworks.com/hc/en-us/articles/7825408860573-Using-BGP-in-the-Cato-Cloud and https://support.catonetworks.com/hc/en-us/articles/4413273474065-Configuring-BGP-Neighbors-for-a-Cato-Socket
- [S33] Check Point CheckMates — Management API: rulebase export as CSV (jq patterns, zero-hit filtering): https://community.checkpoint.com/t5/API-CLI-Discussion/Management-API-Rulebase-export-as-csv/td-p/29348
- [S34] Check Point CheckMates — How can I export the access rulebase (limit 500, offset pagination, inline layers queried separately): https://community.checkpoint.com/t5/API-CLI-Discussion/How-can-I-export-the-access-rulebase/td-p/128298
- [S35] GitHub — CheckPointSW/ExportImportPolicyPackage (policy package export tool, R80.10+): https://github.com/CheckPointSW/ExportImportPolicyPackage
- [S36] Cato Learning Center — Troubleshooting Scenarios for Issues with the Cato Client (third-party VPN conflicts): https://support.catonetworks.com/hc/en-us/articles/20824958359709-Troubleshooting-Scenarios-for-Issues-with-the-Cato-Client
- [S37] Peerspot — Cato SASE Cloud Platform vs Check Point Harmony SASE (formerly Perimeter 81): https://www.peerspot.com/products/comparisons/cato-sase-cloud-platform_vs_check-point-harmony-sase-formerly-perimeter-81
- [S38] Gartner Peer Insights — Cato Networks vs Check Point Software Technologies (SSE): https://www.gartner.com/reviews/market/security-service-edge/compare/cato-networks-vs-check-point-software-tech
- [PS deck] Internal: Cato Professional Services deck digest — `_extract/andy-professional-services-deck-combined-slides-2026.md` (phases, parallel-socket/interconnect patterns, BGP community 32768 isolation, TLSi phased enablement, SDP migration groups, asymmetric-routing warnings)
- Cato Networks blog — Deploying Cato SASE, Step by Step: https://www.catonetworks.com/blog/deploying-cato-sase-step-by-step/
- Cato Learning Center — Understanding Rollout to the Cato Cloud: https://support.catonetworks.com/hc/en-us/articles/11968052021277-Understanding-Rollout-to-the-Cato-Cloud
