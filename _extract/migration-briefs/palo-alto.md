# Migration Brief: Palo Alto Networks → Cato SASE Cloud

> SE-enablement research brief. UK English. Sourced claims carry a reference to the
> Sources section (§6); anything marked **recommended practice** is standard Cato SE/PS
> guidance without a public citation. Internal anchor: Cato PS deck digest
> (`_extract/andy-professional-services-deck-combined-slides-2026.md`), cited as **[PS deck]**.

---

## 1. Vendor snapshot

**Products in scope**

| Product | Role in the estate |
|---|---|
| PA-series NGFW appliances (PA-400/800/1400/3200/3400/5200/5400 etc.) & VM-Series | Branch/DC edge firewall, IPsec hub, routing, NAT, decryption |
| Panorama (M-series appliance or VM) | Central management: device groups, templates, log collectors |
| Prisma Access | Cloud-delivered SSE (PAN-OS in GCP/AWS), remote user and branch security |
| GlobalProtect | Remote-access VPN client, portals/gateways, HIP posture checks |
| Prisma SD-WAN (ex-CloudGenix, ION appliances) | SD-WAN overlay; acquired April 2020 for ~$420m and rebranded from CloudGenix [S15][S16] |

**Typical enterprise deployment.** PA firewalls at DC/hub sites (often HA pairs) acting as
L3 default gateway, IPsec/SD-WAN termination and decryption point; smaller PA or ION
devices at branches; Panorama managing device groups with pre-/post-rules and shared
objects; GlobalProtect for remote users, sometimes fronted by Prisma Access instead of
on-prem gateways.

**Verifiable migration drivers**

- **Hardware EOL cycles.** PA-3200 and PA-5200 series hit end-of-sale on 31 August 2023,
  with support ending five years later (31 August 2028) [S1][S2]. Each refresh cycle is a
  natural decision point: re-buy appliances plus subscriptions, or move the inspection to
  a cloud service.
- **Subscription/licensing complexity.** Security value on PAN-OS is sold as stacked
  per-device subscriptions — Threat Prevention, Advanced URL Filtering, Advanced WildFire,
  DNS Security, GlobalProtect, SD-WAN, IoT Security [S3] — each licensed per firewall.
  Community licensing guidance warns that bundles are commonly over- or mis-bought [S4].
  Cato's equivalent protections are delivered from the PoP as platform capabilities rather
  than per-appliance licences.
- **Panorama operational load.** Panorama is itself software the customer must run,
  size and upgrade. PAN's compatibility matrix requires Panorama to run the same or a
  later PAN-OS version than the firewalls it manages (relaxed only within a release train
  from 10.2.7), which forces sequenced Panorama-first upgrade projects [S5][S6].
- **Appliance patching burden and exposure.** PAN-OS itself is an attack surface:
  CVE-2024-3400 (CVSS 10.0) was an actively exploited zero-day command injection in the
  GlobalProtect portal/gateway requiring emergency hotfixes [S7][S8]. Cato positions its
  cloud-delivered firewall as self-maintaining, with no customer-side patching [S9].
- **Migration tooling gap.** Expedition, PAN's own config-migration tool, reached
  end-of-life on 31 December 2024 with no successor product (PAN points customers to
  Professional Services / "Migration Factory") [S10], and the retired tool subsequently
  received vulnerability advisories [S11]. There is no vendor-supported self-service path
  even for PA-to-PA migrations — useful context when discussing conversion effort.

---

## 2. Component → Cato mapping

| Palo Alto component | Function | Cato equivalent | Notes |
|---|---|---|---|
| PA-series NGFW / VM-Series | Edge firewall, routing, IPsec, inspection | Cato Socket (X-series) / vSocket + PoP single-pass inspection | Socket is a thin SD-WAN edge; all security runs in the PoP. LAN Firewall on the Socket covers local L3/L4/L7 flows [S12] |
| App-ID | Application identification in policy | Cato application awareness in the single-pass engine; app catalogue + custom apps | Custom App-IDs must be re-created as Cato custom apps or FQDN/IP objects — signatures do not transfer (**recommended practice**) |
| Security zones + zone-based rulebase | Segmentation and policy scoping | WAN Firewall (site/VLAN/user/group scoped) + Internet Firewall + Socket LAN Firewall | Cato has no zone construct. WAN FW is an allowlist (implicit any-any **block**); Internet FW is a blocklist (implicit **allow**) [S13][S14] — the opposite default postures must be designed for, not assumed |
| Content-ID stack (Threat Prevention, Adv URL Filtering, Adv WildFire, DNS Security) | IPS, AV, sandboxing, web/DNS security | Cato IPS, Next-Gen Anti-Malware, sandboxing, DNS protection, SWG URL categories | Platform capabilities at every PoP rather than per-box subscriptions [S3 vs S12] |
| Decryption policy | TLS break-and-inspect | Cato TLS Inspection policy (account-level, wizard-assisted) | Does **not** port 1:1 — rebuild using Cato's phased best practice [S17][S18] |
| User-ID | User-to-IP mapping for policy | Cato User Awareness: AD/LDAP integration, Cato Identity Agent, SCIM | SCIM via Entra ID/Okta; LDAP sync for non-SDP users [S19][S20] |
| GlobalProtect (client, portal, gateway) | Remote-access VPN | Cato Client (SDP/ZTNA) + Browser (clientless) Access | Always-On, pre-login, split-tunnel and Client Connectivity policies in CMA [PS deck] |
| GlobalProtect HIP checks | Endpoint posture in policy | Device Posture profiles & checks + Client Connectivity Policy | Posture usable in Client Connectivity and Internet/WAN FW rules; continuous re-checks supported [S21][S22] |
| Panorama (device groups, templates, log collectors) | Central management & logging | Cato Management Application (CMA) | SaaS console; no appliance, no version-compatibility matrix, no upgrade projects [S5 vs S12]. Events/analytics native in CMA, SIEM integration for export [PS deck] |
| Prisma Access | Cloud SSE for users/branches | Cato SASE Cloud — every PoP delivers full SSE | Cato is one engine/one policy set vs Prisma Access's multi-console, multi-engine assembly [S23] |
| Prisma SD-WAN (ION) | SD-WAN overlay | Cato Socket SD-WAN (built into the same platform) | If present, migrates in the same site cutover as the firewall |
| NAT policy | SNAT/DNAT at the edge | Site-level NAT policy (SNAT/DNAT for outgoing), Remote Port Forwarding, Local Port Forwarding | Inbound publishing works differently: RPF via Cato allocated IPs at the PoP, or LPF at the Socket [S24][S25] — see gotchas |
| Site-to-site IPsec on PA | Third-party/partner VPNs | Cato IPsec sites (IKEv1/v2), BGP supported | Partner VPNs terminate on the PoP, not on site hardware [S26] |

---

## 3. Recommended migration path (Cato PS methodology)

Cato PS runs delivery as four phases — **Discover & Design → Pilot, Build & Initial
Rollout → Advanced Security & Broader Rollout → Tune, Optimise & Handover** — typically
across a ~4-month example plan [PS deck]. Applied to a Palo Alto estate:

### Phase 1 — Discovery & co-existence design

- Standard PS discovery: business objectives, network/security architecture, traffic
  flows, site interdependencies, LAN architecture, routing strategy, DMZ/voice/Internet
  integration, then agree migration options and a co-existence strategy [PS deck].
- **Export the PA estate.** Pull the rulebase and objects from Panorama: CSV/PDF export
  from the Policies tab (PAN-OS 8.1+), full XML via *Save and Export Panorama and Firewall
  Configurations* or the XML API with XPath per device group, or `set`-format CLI output
  for scripted parsing [S27][S28]. Include pre-rules, post-rules, shared objects, NAT and
  decryption policies, and GlobalProtect portal/gateway/HIP config. Note: Expedition is
  EOL [S10], so treat conversion as an engineering exercise, not a tool run — Cato PS
  schedules "Security Policy Conversion" as an explicit workstream [PS deck].
- **Clean the rulebase before translating it.** Strip disabled rules, shadowed rules and
  rules with zero hit-counts (Panorama rule usage data identifies these), and collapse
  device-group duplication. Translating a 15-year-old rulebase verbatim into CMA imports
  the mess (**recommended practice**).
- **Zone → segment mapping.** Map each PA zone to Cato constructs: sites, VLANs/network
  ranges, user groups, or Socket LAN segments. Decide what lands in the WAN Firewall
  (east-west, allowlist), Internet Firewall (north-south, blocklist) and Socket LAN
  Firewall (intra-site) [S13][S14][S12]. Flag any zones whose semantics have no direct
  equivalent (e.g. multi-vsys separations) for design discussion.
- Foundation setup in CMA: account baseline, IdP/SSO integration planning, SCIM or LDAP
  user provisioning, test users and feedback channel, endpoint readiness — distribute the
  Cato Client and the Cato TLS root certificate early, before they are needed [PS deck][S19].
- Logistics: socket plan and shipping; SIEM integration planning [PS deck].

### Phase 2 — Pilot, build & initial rollout

- Convert and implement security and access policies; deploy the Cato Client to pilot
  users; validate Internet connectivity at a pilot site; integrate identity and SIEM
  [PS deck].
- **Parallel DC/DR deployment**: stand up sockets at data centres alongside the PA
  estate with the PA firewall still the L3 default gateway (see §4 for the routing
  patterns) [PS deck].
- Start the Client Connectivity / Device Posture policy in **monitor mode** for device
  discovery before enforcing [PS deck].
- Pre- and post-migration test plans per site; validate inbound flows (RPF) and
  return-path routing before cutover [PS deck].

### Phase 3 — Advanced security & broader rollout

- **GlobalProtect → Cato Client by user cohort.** The PS plan runs SDP Migration Groups
  1–4 as phased waves across months 2–4, with feedback gathering and Client Connectivity
  policy tuning between waves [PS deck]. Per cohort: enrol users (SCIM), enable the Cato
  Client, confirm app access, then remove GlobalProtect from that cohort's devices —
  do not leave both clients active long-term (§4).
- **TLS inspection re-build, not port.** PA decryption policies do not translate 1:1.
  Follow Cato's phased enablement: prerequisites (block QUIC, deploy the Cato root
  certificate, define test groups), initial policy with source/destination bypasses,
  then gradual enablement over ~4 phases from high-risk/low-impact URL categories to
  broader coverage, tuning bypasses as pinned apps surface [S17][S18][PS deck].
  Carry over the *intent* of PA decryption exclusions (banking/health category bypasses,
  pinned-app exclusions) rather than the rules themselves (**recommended practice**).
- Enable advanced services in sequence once the baseline is stable: IPS/NGAM in the
  recommended monitor-then-block progression, CASB discovery, DLP monitor mode, device
  posture enforcement [PS deck][S29].
- Site waves: migrate branches in groups, moving each site's default route to the socket
  at its cutover window; decommission or repurpose the branch PA once traffic and events
  verify clean.

### Phase 4 — Tune, optimise & decommission

- Account/policy fine-tuning, validation of security controls, operational workflow and
  alerting review, documentation and admin training, transition to BAU [PS deck].
- Decommission sequence (**recommended practice**): remove GlobalProtect
  portals/gateways once the last cohort is migrated → retire branch PAs → retire DC PA
  edge function (the box may persist temporarily for east-west DC filtering, see §5) →
  decommission Panorama and log collectors last, after log-retention obligations are
  satisfied (export or archive logs first) → terminate subscriptions at renewal.

---

## 4. Co-existence & rollback

**Parallel-socket patterns (the standard Cato approach).** The socket is installed
alongside the PA edge, and a routing handoff decides which network carries each subnet.
The PS deck describes three placement options, chosen by where the routing decision
lives [PS deck]:

1. **L3 switch as default gateway** — the switch routes migrated subnets to the socket
   (static or BGP); keeps throughput off the PA; simple, easily reversed.
2. **Legacy PA firewall remains default gateway** — a LAN transit VLAN (or spare
   interface/trunk VLAN) carries either static routes or an **eBGP handoff between the
   socket and the PA**; migrated subnets are routed to Cato per prefix, everything else
   stays on the PA. Dynamic propagation plus simple rollback; Cato-side routes can be
   isolated by tagging with the Cato ASN and community 32768 (socket v15+) [PS deck].
3. **Socket becomes default gateway** — gradual deployment via Alt-WAN or LAN BGP
   handoff selectively routes not-yet-migrated traffic back to the legacy network [PS deck].

For multi-site estates, add an **interconnecting hub site** (both legacy CPE and socket)
so legacy and Cato islands keep talking during the transition — static "routed ranges
with dummy-range pre-staging" or a BGP hub, per the PS deck patterns. Parallel
connectivity at every site is preferred below roughly 20 sites; larger or multi-region
estates use hub or phased-regional options [PS deck].

**What breaks in DIY co-existence**

- **Asymmetric routing through the stateful PA.** If traffic egresses via Cato but
  returns via the PA (or crosses regions through different hubs), the PA's stateful
  inspection drops the unseen flow. The PS deck flags exactly this: asymmetric paths
  "cause stateful inspection failures and traffic drops during coexistence"; the fixes
  are parallel connectivity per region, hub anchoring, or AS-path design that keeps
  regional symmetry [PS deck].
- **Double TLS inspection.** If PA decryption stays enabled on a path Cato now also
  inspects, users hit certificate-on-certificate errors and pinned apps fail twice over.
  Disable PA decryption for Cato-routed traffic, or scope Cato TLSi to bypass
  PA-inspected paths until cutover (**recommended practice**; individual behaviours per
  [S17]).
- **Dual VPN clients.** Cato documents that third-party VPN drivers on the same machine
  can conflict with and override Cato Client settings, and running the Client in
  full-tunnel mode alongside another VPN is not recommended [S30]. Keep the
  GlobalProtect-to-Cato switch per cohort short and scripted (install Cato Client →
  validate → uninstall/disable GlobalProtect); the PS guidance is to deploy the SDP
  client and certificates **early** to remove the legacy VPN dependency [PS deck].
- **Inbound published services.** Anything NAT-published through the PA (DNAT rules)
  must be consciously re-homed to Remote Port Forwarding via Cato allocated IPs or Local
  Port Forwarding at the socket — and external DNS updated — before the PA is retired
  [S24][S25]. Validate the return route goes back via the socket [PS deck].

**Rollback levers per phase**

| Phase | Rollback lever |
|---|---|
| Pilot site | Remove the static route / withdraw the BGP prefix at the L3 switch or PA; traffic reverts to the PA instantly [PS deck] |
| Subnet migration (routed-range pattern) | Re-add the dummy range on the Cato site and restore the statics at the interconnect — the deck calls this out as the designed rollback [PS deck] |
| BGP handoff | Disconnect/reconnect the site LAN; prefixes withdraw and propagate automatically [PS deck] |
| User cohorts | Re-enable GlobalProtect for the affected cohort while the portal/gateway still exists — keep GP infrastructure warm until the final wave completes (**recommended practice**) |
| TLS inspection | Roll back to an earlier enablement phase without disabling TLSi entirely [PS deck] |
| Full site | Physical LAN cutover reversal; note the deck rates big-bang LAN cutovers "complex rollback" — a reason to prefer parallel patterns [PS deck] |

---

## 5. Gotchas & objection handling

- **"App-ID is more mature than Cato's app awareness."** Both platforms do inline L7
  app identification; the practical gap is **custom App-IDs** and niche signatures.
  Inventory custom App-IDs during discovery and re-create them as Cato custom apps or
  FQDN/IP/port objects; validate each in the pilot. Do not promise signature-for-signature
  parity — demonstrate policy-outcome parity instead (**recommended practice**).
- **Zone model and default postures.** PA admins think in zones with explicit
  interzone-deny. Cato splits the world into WAN FW (implicit block) and Internet FW
  (implicit allow) [S13][S14]. The Internet FW's default-allow posture surprises PA
  admins — the recommended build adds explicit blocks/allows to match the customer's
  risk appetite [S14]. Cover this in the design workshop, not at cutover.
- **NAT differences.** PA's freeform NAT rulebase (U-turn NAT, per-rule bidirectional
  DNAT, NAT between zones) is broader than Cato's model of site-level NAT for outgoing
  traffic plus RPF/LPF for inbound publishing [S24][S25]. Most branch NAT simply
  disappears (the PoP handles Internet SNAT), but audit DC NAT rules line-by-line; a few
  may need redesign (**recommended practice**).
- **Decryption policy does not port.** Set the expectation in discovery that TLSi is a
  re-implementation with its own phased rollout [S17][S18]; certificate-pinned apps need
  bypass rules and TLSi is not supported for Android devices [S17] — check the estate's
  mobile posture early.
- **East-west DC segmentation.** Customers using PA for intra-DC micro-segmentation may
  keep a DC firewall for deep east-west policy in the near term; Cato's Socket LAN
  Firewall covers L3/L4/L7 segmentation of socket-attached VLANs [S12], but a
  hypervisor-level micro-seg estate is a scoped carve-out, not a blocker. Position the
  migration as edge/WAN/SSE first, DC interior on its own timeline (**recommended
  practice**).
- **HIP parity questions.** HIP requires a GlobalProtect gateway licence per gateway
  [S31]; Cato Device Posture checks (AV/firewall/disk encryption/patch level/device
  certificate etc.) are configured centrally and enforceable in both Client Connectivity
  and firewall rules [S21][S22]. Map each HIP object to a Device Posture profile during
  discovery; most common checks translate directly.
- **User-ID edge cases.** Agentless User-ID via DC log scraping maps to Cato User
  Awareness with AD integration; note that SCIM-provisioned users historically needed an
  SDP licence to be identified (relaxed with the Identity Agent from Windows Client v5.9)
  [S19][S20] — check licence counts against the identification requirement.
- **"Panorama gives us config versioning and staged commits."** CMA is SaaS with
  centralised policy and audit trail; the counter is the operational cost Panorama adds —
  its own hardware/VM sizing, HA, and the PAN-OS version-compatibility ladder that forces
  Panorama-first upgrade sequencing [S5][S6] — versus zero customer-maintained management
  infrastructure.
- **"We already own Prisma Access — why move?"** Prisma Access is PAN-OS assembled
  across public-cloud PoPs with multiple management surfaces; analyst/community
  comparisons consistently cite higher deployment complexity and fragmented licensing
  versus Cato's single engine and console [S23][S32]. Anchor on operational effort and
  the number of consoles/policies, not on feature checklists.
- **Log retention & compliance.** Export or archive Panorama/log-collector data before
  decommissioning to satisfy retention obligations; plan the SIEM integration on the Cato
  side in Phase 1 so there is no visibility gap [PS deck] (**recommended practice** on
  the retention step itself).

---

## 6. Sources

- [S1] Palo Alto Networks — Hardware End-of-Life Dates: https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates
- [S2] Palo Alto Networks — End-of-Sale Announcements: https://www.paloaltonetworks.com/services/support/end-of-life-announcements/end-of-sale
- [S3] PAN docs — Subscriptions You Can Use With the Firewall: https://docs.paloaltonetworks.com/ngfw/administration/subscriptions/all-subscriptions
- [S4] Vodanet — A Complete Guide to Palo Alto NGFW Licensing (2025): https://www.vodanetsystems.com/blog/post/palo-alto-firewall-licensing-guide
- [S5] PAN docs — Panorama Management Compatibility: https://docs.paloaltonetworks.com/compatibility-matrix/reference/panorama/panorama-management-compatibility
- [S6] PAN docs — Upgrade Firewalls Using Panorama: https://docs.paloaltonetworks.com/pan-os/10-2/pan-os-upgrade/upgrade-pan-os/upgrade-the-firewall-pan-os/upgrade-firewalls-using-panorama
- [S7] PAN Security Advisory — CVE-2024-3400: https://security.paloaltonetworks.com/CVE-2024-3400
- [S8] NVD — CVE-2024-3400: https://nvd.nist.gov/vuln/detail/cve-2024-3400
- [S9] Cato Networks — SASE-native LAN NGFW announcement coverage: https://www.channelinsider.com/news-and-trends/cato-networks-firewall-sase/
- [S10] PAN LIVEcommunity — End of Life Announcement for Expedition: https://live.paloaltonetworks.com/t5/expedition-articles/important-update-end-of-life-announcement-for-palo-alto-networks/ta-p/589642
- [S11] PAN-SA-2025-0001 — Expedition vulnerabilities: https://security.paloaltonetworks.com/PAN-SA-2025-0001
- [S12] Cato Learning Center — What are Cato Sockets / Socket LAN Firewall Policy: https://support.catonetworks.com/hc/en-us/articles/30175650827677-What-are-Cato-Sockets and https://support.catonetworks.com/hc/en-us/articles/10642755314205-Configuring-the-Socket-LAN-Firewall-Policy
- [S13] Cato Learning Center — What is the Cato WAN Firewall?: https://support.catonetworks.com/hc/en-us/articles/4413265660305-What-is-the-Cato-WAN-Firewall
- [S14] Cato Learning Center — Recommendations for Internet and WAN Firewall Policies: https://support.catonetworks.com/hc/en-us/articles/360004274777-Recommendations-for-Internet-and-WAN-Firewall-Policies
- [S15] Palo Alto Networks — Completes Acquisition of CloudGenix (Apr 2020): https://www.paloaltonetworks.com/company/press/2020/palo-alto-networks-completes-acquisition-of-cloudgenix
- [S16] PAN blog — Prisma SD-WAN: The New Face of CloudGenix: https://www.paloaltonetworks.com/blog/2021/02/prisma-sd-wan/
- [S17] Cato Learning Center — Best Practices for TLS Inspection: https://support.catonetworks.com/hc/en-us/articles/360007713437-Best-Practices-for-TLS-Inspection
- [S18] Cato Learning Center — Using the TLS Inspection Configuration Wizard: https://support.catonetworks.com/hc/en-us/articles/23739970551453-Using-the-TLS-Inspection-Configuration-Wizard
- [S19] Cato Learning Center — Provisioning Users with SCIM (and SCIM+LDAP): https://support.catonetworks.com/hc/en-us/articles/13651160092701-Provisioning-Users-with-SCIM and https://support.catonetworks.com/hc/en-us/articles/16441170777757-Provisioning-Users-with-SCIM-and-LDAP
- [S20] Cato Learning Center — Overview of Directory Services and User Awareness: https://support.catonetworks.com/hc/en-us/articles/4413280525585-Overview-of-Directory-Services-and-User-Awareness
- [S21] Cato Learning Center — Creating Device Posture Profiles and Device Checks: https://support.catonetworks.com/hc/en-us/articles/7387501459357-Creating-Device-Posture-Profiles-and-Device-Checks
- [S22] Cato Learning Center — Client Connectivity Policy / Continuous Posture Checks: https://support.catonetworks.com/hc/en-us/articles/29719960488989-Client-Connectivity-Policy-Improved-Posture-Checks
- [S23] Cato Networks blog — Single Vendor SASE vs. the Alternatives: https://www.catonetworks.com/blog/single-vendor-sase-vs-the-alternatives-navigating-your-options/
- [S24] Cato Learning Center — Configuring a Site-Level NAT Policy: https://support.catonetworks.com/hc/en-us/articles/15601094616861-Configuring-a-Site-Level-NAT-Policy
- [S25] Cato Learning Center — Remote Port Forwarding / Local Port Forwarding: https://support.catonetworks.com/hc/en-us/articles/7784979714333-Configuring-Remote-Port-Forwarding-for-the-Account and https://support.catonetworks.com/hc/en-us/articles/4413265637393-Configuring-Local-Port-Forwarding-for-a-Site
- [S26] Cato Learning Center — Using BGP in the Cato Cloud / BGP Neighbors for a Socket: https://support.catonetworks.com/hc/en-us/articles/7825408860573-Using-BGP-in-the-Cato-Cloud and https://support.catonetworks.com/hc/en-us/articles/4413273474065-Configuring-BGP-Neighbors-for-a-Cato-Socket
- [S27] PAN docs — Save and Export Panorama and Firewall Configurations: https://docs.paloaltonetworks.com/panorama/10-2/panorama-admin/administer-panorama/manage-panorama-and-firewall-configuration-backups/save-and-export-panorama-and-firewall-configurations
- [S28] pan.dev — Exporting Rulebases to CSV (XML API/XPath method): https://pan.dev/panos/docs/tutorials/rulebase-to-csv/
- [S29] Cato Learning Center — Best Practices for Implementing Cato Threat Prevention: https://support.catonetworks.com/hc/en-us/articles/360011316297-Best-Practices-for-Implementing-Cato-Threat-Prevention
- [S30] Cato Learning Center — Troubleshooting Scenarios for Issues with the Cato Client (third-party VPN conflicts): https://support.catonetworks.com/hc/en-us/articles/20824958359709-Troubleshooting-Scenarios-for-Issues-with-the-Cato-Client
- [S31] PAN docs/community — HIP licensing and behaviour: https://live.paloaltonetworks.com/t5/community-blogs/leveraging-host-information-profile-hip/ba-p/291126
- [S32] Peerspot — Cato SASE Cloud vs Prisma Access comparison: https://www.peerspot.com/products/comparisons/cato-networks_vs_prisma-access-by-palo-alto-networks
- [PS deck] Internal: Cato Professional Services deck digest — `_extract/andy-professional-services-deck-combined-slides-2026.md` (phases, migration options, parallel-socket/interconnect patterns, TLSi phased enablement, SDP migration groups)
- Cato Networks blog — Deploying Cato SASE, Step by Step: https://www.catonetworks.com/blog/deploying-cato-sase-step-by-step/
- Cato Learning Center — Understanding Rollout to the Cato Cloud: https://support.catonetworks.com/hc/en-us/articles/11968052021277-Understanding-Rollout-to-the-Cato-Cloud
