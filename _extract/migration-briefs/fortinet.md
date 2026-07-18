# Migration brief: Fortinet → Cato SASE Cloud Platform

> SE-enablement research note. UK English. Facts are cited in §6; anything marked
> **recommended practice** is field guidance without a public source. Internal anchor:
> the Cato Professional Services deck (2026) — multi-region co-existence Option F and
> the FortiGate regional-hub eBGP example (slides 57–58, 60–69).

---

## 1. Vendor snapshot

**The estate.** Fortinet customers typically run a "FortiGate everywhere" architecture:
the same FortiGate appliance at each site acts as NGFW, UTM stack (IPS, anti-virus, web
filter, application control, DNS filter) and Secure SD-WAN edge, with ADVPN building
dynamic spoke-to-spoke IPsec shortcuts over a hub-and-spoke overlay. Central operations
run through FortiManager (config, policy packages, ADOMs, CLI/Jinja templates) and
FortiAnalyzer (logging, reporting, SOC views). Remote access is FortiClient — SSL-VPN
and/or ZTNA driven by FortiClient EMS posture tags — and Fortinet's cloud answer is
FortiSASE, a separate SSE service that reuses the FortiClient agent and, for private
access (SPA), still depends on FortiGate hubs as application gateways.

**Verifiable migration drivers:**

- **Exploitation and patching burden.** As of July 2026 a third-party tracker counts
  26 Fortinet CVEs in the CISA Known Exploited Vulnerabilities catalogue, 13 of them
  used in ransomware campaigns; FortiOS is the most-listed product. Landmark entries
  include CVE-2024-21762 (unauthenticated RCE in SSLVPNd, KEV February 2024),
  CVE-2024-23113 (FortiOS format-string, KEV October 2024) and the earlier SSL-VPN
  chain CVE-2022-42475 / CVE-2023-27997. CISA alerted again in January 2026 on active
  exploitation of the FortiOS authentication-bypass CVE-2026-24858.
- **The management plane itself has been breached.** CVE-2024-47575 ("FortiJump", CVSS
  9.8) — missing authentication in FortiManager's FGFM daemon — was exploited in the
  wild from June 2024; Mandiant investigated 50+ compromised FortiManager appliances
  from which attackers exfiltrated the configurations and hashed credentials of every
  managed FortiGate. The single pane of glass became a single point of compromise.
- **Patching does not always end the incident.** In April 2025 CISA relayed a Fortinet
  advisory on a post-exploitation technique in which attackers left symbolic links on
  FortiGates that preserved read-only access *after* the original vulnerability was
  patched — driving full device re-validation, not just upgrades.
- **Forced remote-access re-engineering.** From FortiOS 7.6.3, SSL-VPN tunnel mode is
  removed from GUI and CLI and replaced with IPsec; existing SSL-VPN tunnel
  configuration and associated firewall policies are *not* upgraded. Customers must
  re-engineer remote access anyway — the natural moment to evaluate cloud-delivered
  ZTNA rather than rebuild on the same appliance.
- **Hardware refresh cycles.** FortiGate hardware End of Support typically falls 60
  months after End of Order, with the last service extension 12 months before EOS;
  support contracts cannot be renewed past EOS. Older models also cap out on earlier
  FortiOS trains, stranding sites on branches nearing end of engineering support.
  Every refresh event re-opens the box-versus-cloud decision.
- **Licence stacking.** Security value is sold per appliance as FortiCare plus a
  FortiGuard bundle (ATP → UTP → Enterprise Protection, each adding services such as
  sandbox, URL/DNS/video filtering, CASB, DLP, IoT detection), stacked on top of
  FortiManager, FortiAnalyzer, FortiClient EMS and — separately — FortiSASE
  subscriptions. Right-sizing an appliance also means right-sizing its licences at
  every refresh.

---

## 2. Component → Cato mapping

| Fortinet component | Function | Cato equivalent | Notes |
|---|---|---|---|
| FortiGate firewall policies + UTM profiles (IPS, AV, web filter, app control, DNS filter) | Per-site NGFW and threat prevention | Cato WAN Firewall + Internet Firewall with IPS, Next-Gen Anti-Malware and SWG/URL filtering applied in a single pass (SPACE) | One cloud-global rulebase replaces per-box / per-VDOM policy packages; profile-per-policy UTM model collapses into converged inspection with shared context — no service chaining |
| Fortinet Secure SD-WAN (zones, SD-WAN rules, performance SLAs) | Path selection, app steering, link SLA | Cato Socket + global private backbone; network rules with bandwidth management profiles and QoS priorities | Steering by application/source/destination with transport preference (Cato backbone / Alt-WAN / direct internet); last-mile monitoring per socket; Priority Analyzer for QoS validation |
| ADVPN (dynamic spoke-to-spoke shortcuts) | Site-to-site overlay without hub hairpin | Cato backbone routing via nearest PoP | No shortcut negotiation to operate or monitor; any-to-any connectivity is a property of the backbone, not per-tunnel state |
| FortiManager (ADOMs, policy packages, CLI/Jinja templates, scripts) | Central management and provisioning | Cato Management Application (CMA) | No firmware fleets or policy-push jobs — sockets and PoPs are maintained by Cato; automation via GraphQL API and the `catonetworks/cato` Terraform provider |
| FortiAnalyzer | Log collection, reporting, SOC analytics | CMA events and analytics, XDR storyboards, SIEM/event integrations | No collector sizing or log-rate licensing on appliances; events generated once in the cloud |
| FortiClient (SSL-VPN / IPsec / ZTNA agent) + EMS | Remote access and endpoint posture management | Cato Client (SDP) with Device Posture profiles, Always-On and Client Connectivity Policy | SSL-VPN tunnel mode is removed in FortiOS 7.6.3 regardless — migration effort is being spent either way |
| EMS ZTNA tagging rules → dynamic address objects on FortiGate | Posture-conditional access | Cato device posture checks (AM/FW/disk encryption/client version/device certificate) referenced in access policy | Tags must be re-modelled as posture profiles — see §5 |
| VDOMs (multi-VDOM) | Virtual firewalls per tenant/function | Policy scoping by site/segment within one account rulebase; separate accounts where hard tenancy is required | No per-VDOM resource carving or licensing; note split-task VDOM mode was itself removed in FortiOS 7.2 |
| FortiSASE (SIA/SPA, Universal ZTNA) | Cloud SSE for remote users and thin edges | Cato SASE Cloud — the same PoP-delivered SSE stack that already serves sites | FortiSASE SPA using ZTNA relies on FortiGate hubs as application gateways, so the appliance estate remains in the critical path; Cato needs no on-prem gateway for private access |
| FortiGate HA (FGCP clusters) | Device redundancy | Socket HA (primary/secondary) plus PoP-level and backbone-level resilience | Site survives socket, link and PoP failures independently |
| FortiSwitch / FortiAP via FortiLink | LAN switching and Wi-Fi controlled from the FortiGate | Out of scope for Cato — retain standalone/cloud management for switching & Wi-Fi | Must be re-homed before the controlling FortiGate is decommissioned — see §5 |
| FortiGate east-west / inter-VLAN policy | Local LAN segmentation | Socket LAN Firewall policy (successor to Local Routing rules) | Enforced locally on the socket; alternatively retain the FortiGate as an interim LAN firewall during transition — see §4 |

---

## 3. Recommended migration path

Anchored to the Cato PS four-phase methodology: **Discover & Design → Pilot, Build &
Initial Rollout → Advanced Security & Broader Rollout → Tune, Optimise & Handover**
(typical reference plan: four months).

### Phase 1 — Discover & Design (weeks 1–4)

- **Config capture.** Export every FortiGate (`execute backup full-config`) or pull
  device configs and policy packages from FortiManager; capture FortiAnalyzer /
  FortiView traffic data to build the real traffic matrix — essential because ADVPN
  shortcuts mean spoke-to-spoke flows rarely appear in any design document
  (**recommended practice**).
- **Rule-base clean-up before translation.** Use policy hit counts and last-used data
  to retire dead rules, collapse duplicate address/service objects and flag
  any-any-ALLOW debt. Translate `firewall address`/`addrgrp`/`service custom` objects
  into CMA hosts, network ranges and custom services — scriptable against the parsed
  FortiOS config and pushed via the Cato API or Terraform provider (**recommended
  practice**).
- **Classify the estate**: regional FortiGate hubs (SD-WAN/ADVPN concentrators), data
  centres, branch classes (HA vs single, LTE backup), VDOM tenants, inbound NAT/VIP
  services, and everything hanging off FortiLink (switches/APs).
- **Co-existence design**: select the eBGP hub-handoff pattern (§4), agree AS numbering
  (Cato side is eBGP-only; default Cato ASN 64515), route filtering and summarisation,
  PoP egress/static-IP allocations, and the branch cutover template per site class.
- **Foundation setup**: CMA account and best-practice baseline, IdP/SCIM integration,
  endpoint readiness (Cato Client and TLSi/device certificates), socket logistics plan,
  SIEM integration planning.

### Phase 2 — Pilot, Build & Initial Rollout (month 2)

- **Parallel DC/hub deployment.** Stand up sockets (or vSockets in AWS/Azure) at data
  centres and at each FortiGate regional hub *alongside* the existing kit; establish
  the eBGP handoffs; validate WAN connectivity, routing symmetry and failover before
  any site moves.
- **Security policy conversion** from the cleaned rule-base: WAN Firewall (east-west /
  site-to-site), Internet Firewall (wizard-assisted initial policy), IPS and NGAM in
  monitor-then-block; QoS/network rules recreating SD-WAN steering intent (voice,
  business-critical, file sharing) with bandwidth profiles.
- **Pilot site + pilot users.** Cut over one representative branch using the chosen
  branch pattern; deploy the Cato Client to a pilot cohort (Client Connectivity Policy
  in monitor mode for device discovery) and validate access, performance and UX.
- Rollback for the pilot is the standard spoke rollback (§4) — designed in, not bolted on.

### Phase 3 — Advanced Security & Broader Rollout (month 3)

- **Branch waves.** Migrate branches region by region behind their regional hub
  handoff, per the spoke methodology (§4). Keep waves small early, then batch.
  Cutover order **(recommended practice)**: simple single-WAN branches → HA branches →
  complex sites with local inbound services → hubs last.
- **FortiClient → Cato Client cohorts.** Phased SDP migration groups (the PS reference
  plan uses four waves): per cohort, disable FortiClient VPN/ZTNA via EMS, enable the
  Cato Client, then re-point posture enforcement — translating EMS ZTNA tagging rules
  (AV present, domain membership, OS version, vulnerability state) into Cato device
  posture profiles and Always-On policy. Retain FortiClient's EPP function temporarily
  if it is also the endpoint AV, but avoid two concurrent VPN tunnels on one endpoint
  (**recommended practice**).
- **TLS inspection phased enablement** by URL category and/or pilot groups (the PS
  reference is four phases over four weeks), then CASB discovery, tenant controls and
  DLP monitor-mode → enforcement.

### Phase 4 — Tune, Optimise & Handover (month 4)

- Final site and user migrations; QoS and policy tuning from analytics; validation of
  security controls.
- **Decommission**: remove eBGP handoffs once each region is fully migrated, retire
  FortiGate hubs, cancel/harvest FortiCare + FortiGuard renewals against the EOS
  calendar, decommission FortiManager/FortiAnalyzer and EMS once logging retention
  obligations are met (**recommended practice**).
- Documentation, admin training, operational handover; SIEM event integration live.

---

## 4. Co-existence & rollback

### The hub pattern (Cato PS reference — proven with FortiGate SD-WAN)

The PS multi-region "interim connectivity" design (Option F), demonstrated against an
existing FortiGate Secure SD-WAN estate:

- A **Cato hub site interconnects with each FortiGate regional hub via eBGP** (LAN
  handoff at the hub, or IPsec where no socket can be placed — Cato publishes a
  FortiGate HA IPsec tunnel guide).
- **Path symmetry is maintained by AS-path length**: routes crossing regions carry an
  extra inter-hub AS hop, so BGP best-path selection anchors traffic to the local
  regional hub — traffic exits and returns through the same hub, preventing asymmetric
  routing and stateful-inspection failures on the FortiGates. Legacy routing stays
  segmented in its own VRFs / SD-WAN overlays.
- **Dynamic route exchange**: prefixes propagate automatically between the Cato and
  FortiGate domains — no per-site route engineering during the migration window.
- **Spoke migration methodology**: 1) disable the legacy FortiGate spoke (its prefixes
  are withdrawn from the overlay and the eBGP exchange); 2) bring up the Cato socket
  site; 3) routes propagate automatically to both domains; 4) **rollback is the mirror
  image** — down the socket site, re-enable the legacy spoke, and BGP reconverges.
- **Asymmetry guard-rails**: filter the default route and the prefixes of any site with
  parallel connectivity at each handoff, so a half-migrated site is never reachable via
  two paths at once; use BGP summaries and Cato's BGP filtering/communities to keep the
  exchange tidy.

Where BGP is unavailable or unwanted, the PS static alternative is an **interconnect
site with routed ranges**: pre-stage real subnets on the interconnect and dummy ranges
(e.g. CGNAT space) on the future Cato sites, referenced in groups and rules; at cutover
delete the routed range and update the dummy range — rollback is re-adding the statics.
Proven at scale (~300-site deployment cited in the PS deck).

### Branch-level co-existence variants (PS deck options)

| Pattern | Default gateway | Mechanics | Rollback |
|---|---|---|---|
| FortiGate remains DG, static routes | FortiGate | Socket on a LAN/DMZ transit; FortiGate adds specific routes to the socket floating IP per migrated subnet; socket WAN NATed by the FortiGate if needed | Remove the static routes — traffic reverts to the SD-WAN overlay instantly |
| FortiGate remains DG, eBGP over LAN transit VLAN | FortiGate | eBGP peering socket ↔ FortiGate; phased subnet migration with dynamic propagation; Cato routes can be propagated or isolated | Withdraw advertisements / drop the peering |
| L3 switch decides | L3 switch | Static (or BGP) routing between legacy and Cato-migrated subnets on the core switch; keeps interim throughput off the firewall | Flip routes on the switch |
| Socket as DG, eBGP LAN handoff | Cato Socket | Socket is the gateway; eBGP handoff for legacy prefixes; full HA support; suits DC-style sites | Re-point DG to FortiGate |
| Socket as DG, Alt-WAN BGP / Gradual Deployment | Cato Socket | Legacy MPLS/overlay reached via Alt-WAN with eBGP, or the Gradual Deployment policy routing unknown RFC1918 via Alt-WAN | Routes revert via BGP; caveats below |

Alt-WAN caveats (PS deck): configure local routing for all traffic so Alt-WAN-destined
flows are not first carried to the PoP (avoiding asymmetry), and note that Alt-WAN
failure does not trigger socket HA failover — prefer BGP on a LAN handoff where HA
matters. Gradual Deployment handles private (RFC1918) destinations only.

### Users, LAN and east-west during transition

- **Dual agents**: run FortiClient and Cato Client side by side only in a controlled
  overlap per cohort, with one VPN/ZTNA data path active at a time; use EMS to disable
  FortiClient's remote-access components as each wave moves (**recommended practice**).
- **East-west/LAN**: either retain the FortiGate behind the socket purely as a LAN/
  east-west firewall (zero policy change for internal segmentation, decommission last),
  or move inter-VLAN enforcement onto the Socket LAN Firewall policy — Cato provides a
  migration path from legacy Local Routing rules to the LAN Firewall. Choose per site
  class in Phase 1.
- **Inbound services**: migrate published services (FortiGate VIPs) deliberately —
  re-publish via Cato (e.g. remote port forwarding / static-IP egress) or leave them on
  a retained FortiGate leg until their own change window (**recommended practice**).

---

## 5. Gotchas & objection handling

- **"Our SD-WAN rules are deeply tied to FortiOS."** True — SD-WAN rules reference
  performance SLAs, SD-WAN zones (which firewall policies also reference) and ISDB
  application objects, and ADVPN behaviour is emergent rather than documented. Treat
  translation as design work, not lift-and-shift: recover *intent* (which apps need
  which path/quality) and express it as Cato network rules + bandwidth profiles.
  Budget discovery time for the ADVPN traffic matrix.
- **"We've invested years in FortiManager automation."** Jinja CLI templates, scripts,
  policy packages and Ansible modules represent real sunk effort — acknowledge it. The
  counter is that most of that automation exists to keep hundreds of boxes consistent,
  a problem class that disappears with a single cloud rulebase; what remains
  (site onboarding, policy-as-code) maps to the Cato GraphQL API and Terraform
  provider. FortiJump is the sharper counter: the management plane was itself the
  breach vector, exposing every managed device's config and credentials.
- **"ZTNA tags do posture-based access today."** EMS tagging rules sync to FortiGates
  as dynamic address objects, and there is no automated converter to Cato. Inventory
  the tagging rules, keep only those actually referenced in policy, and re-model them
  as Cato device posture profiles + Client Connectivity / access policy. Note that
  Fortinet's own SSL-VPN-to-ZTNA migration path already forces this rework on FortiOS
  7.6.3+ — the effort is spent either way.
- **"FortiGate gives us hardware-accelerated line rate."** Datasheet headline firewall
  throughput is ASIC-accelerated, but Fortinet's own product matrix shows threat
  protection and SSL inspection throughput at a fraction of that figure — and the
  fleet must be sized for the *inspected* number, per box, at every refresh. Cato
  performs decryption and all inspection once, in parallel engines at the PoP (SPACE),
  and capacity is the platform's problem, not a per-site sizing exercise. For genuine
  local line-rate needs (east-west), keep enforcement on the LAN (socket LAN firewall
  or retained LAN firewall) — WAN/Internet traffic is bounded by the access link, not
  the socket.
- **FortiLink blast radius.** If FortiSwitches/FortiAPs are FortiLink-managed, the
  branch FortiGate is also the LAN/Wi-Fi controller. Re-home switching and Wi-Fi
  management (standalone, cloud management, or a retained device) *before* gateway
  decommissioning — build this into the site survey (**recommended practice**).
- **VDOM tenancy.** Multi-VDOM estates (shared services, M&A tenants, MSSP-style
  separation) need an explicit target model: policy sections/site scoping within one
  account, or separate Cato accounts for hard separation. Flag early; it shapes the
  rulebase design.
- **"We'll just add FortiSASE instead."** FortiSASE covers remote users and secure
  internet access, but SPA (private access) using ZTNA is delivered through FortiGate
  hubs acting as application gateways — the appliance estate, its refresh cycle and
  its patching burden stay in the critical path, and branch sites still need FortiGate
  hardware. It is an *addition* to the stack (another subscription), not a
  consolidation of it.
- **Feature-parity edge cases.** Niche FortiOS behaviours (proxy-mode inspection
  specifics, video filtering, bespoke NAT constructs, local-in policies) should be
  listed in discovery and validated in the PoV rather than assumed — standard PoV
  hygiene (**recommended practice**).

---

## 6. Sources

**Cato (public)**
- Using BGP in the Cato Cloud — https://support.catonetworks.com/hc/en-us/articles/7825408860573-Using-BGP-in-the-Cato-Cloud
- Configuring BGP Neighbors for a Cato Socket — https://support.catonetworks.com/hc/en-us/articles/4413273474065-Configuring-BGP-Neighbors-for-a-Cato-Socket
- Working with BGP Filtering — https://support.catonetworks.com/hc/en-us/articles/23972529384733-Working-with-BGP-Filtering
- Working with BGP Summary Routes — https://support.catonetworks.com/hc/en-us/articles/13472104226717-Working-with-BGP-Summary-Routes
- Cato Cloud to FortiGate via HA IPsec Tunnels — https://support.catonetworks.com/hc/en-us/articles/9830079245981-Cato-Cloud-to-FortiGate-via-HA-IPSec-Tunnels
- What is the Cato Firewall — https://support.catonetworks.com/hc/en-us/articles/25207403405853-What-is-the-Cato-Firewall
- Managing the Internet Firewall Policy — https://support.catonetworks.com/hc/en-us/articles/4413273487633-Managing-the-Internet-Firewall-Policy
- Internet Firewall Configuration Wizard — https://support.catonetworks.com/hc/en-us/articles/27286761010205-Using-the-Internet-Firewall-Configuration-Wizard
- Configuring the Socket LAN Firewall Policy — https://support.catonetworks.com/hc/en-us/articles/10642755314205-Configuring-the-Socket-LAN-Firewall-Policy
- Upgrading Local Routing to the LAN Firewall — https://support.catonetworks.com/hc/en-us/articles/11471842680477-Upgrading-the-Local-Routing-Policy-to-the-LAN-Firewall
- Configuring Network Rules — https://support.catonetworks.com/hc/en-us/articles/7785698733341-Configuring-Network-Rules
- Bandwidth Management Profiles — https://support.catonetworks.com/hc/en-us/articles/4413280514065-What-are-the-Cato-Bandwidth-Management-Profiles
- QoS Priority Analyzer — https://support.catonetworks.com/hc/en-us/articles/4413280501905-Analyzing-QoS-and-Bandwidth-Management-for-a-Site-Priority-Analyzer
- Integrating Cato with an Alt WAN Network — https://support.catonetworks.com/hc/en-us/articles/360011175857-Integrating-Cato-with-an-Alt-WAN-Network
- Client rollout / upgrade policy — https://support.catonetworks.com/hc/en-us/articles/11570704126237-Managing-the-Rollout-of-Client-Versions-Client-Upgrade-Policy
- Preparing to Install the Cato Client — https://support.catonetworks.com/hc/en-us/articles/4411554844817-Preparing-to-Install-the-Cato-Client
- Understanding Packet Flow with Cato SPACE — https://support.catonetworks.com/hc/en-us/articles/12545093882909-Understanding-Packet-Flow-with-Cato-SPACE-Architecture
- Single Pass Cloud Engine (SPACE) — https://www.catonetworks.com/blog/single-pass-cloud-engine-space-the-key-to-unlocking-the-true-value-of-sase/
- What is the Cato API — https://support.catonetworks.com/hc/en-us/articles/20564679978397-What-is-the-Cato-API
- Using Terraform with the Cato Cloud — https://support.catonetworks.com/hc/en-us/articles/17895157930525-Using-Terraform-with-the-Cato-Cloud
- Cato Terraform provider — https://registry.terraform.io/providers/catonetworks/cato/latest

**Cato (internal)**
- Cato Professional Services deck, 2026 (`_extract/andy-professional-services-deck-combined-slides-2026.md`): four-phase methodology and 4-month reference plan (slides 10–16); multi-region Option F eBGP interim connectivity (slide 57); FortiGate regional-hub example and spoke migration/rollback (slide 58); interconnect and parallel-socket patterns (slides 60–69); device posture (slide 18); phased TLS inspection (slides 44–46 area).

**Fortinet / vulnerability record**
- CISA Known Exploited Vulnerabilities catalogue — https://www.cisa.gov/known-exploited-vulnerabilities-catalog
- Senserva KEV tracker: 26 Fortinet CVEs, July 2026 — https://senserva.com/exploited/fortinet.html
- Rapid7 on CVE-2024-21762 exploitation — https://www.rapid7.com/blog/post/2024/02/12/etr-critical-fortinet-fortios-cve-2024-21762-exploited/
- Mandiant/Google Cloud: FortiManager zero-day CVE-2024-47575 — https://cloud.google.com/blog/topics/threat-intelligence/fortimanager-zero-day-exploitation-cve-2024-47575
- Tenable FortiJump FAQ — https://www.tenable.com/blog/cve-2024-47575-faq-about-fortijump-zero-day-in-fortimanager-fortimanager-cloud
- CISA alert, April 2025: post-exploitation persistence on FortiOS — https://www.cisa.gov/news-events/alerts/2025/04/11/fortinet-releases-advisory-new-post-exploitation-technique-known-vulnerabilities
- CISA alert, January 2026: CVE-2026-24858 exploitation — https://www.cisa.gov/news-events/alerts/2026/01/28/fortinet-releases-guidance-address-ongoing-exploitation-authentication-bypass-vulnerability-cve-2026
- FortiOS 7.6.3: SSL-VPN tunnel mode replaced with IPsec — https://docs.fortinet.com/document/fortigate/7.6.6/fortios-release-notes/173430/ssl-vpn-tunnel-mode-replaced-with-ipsec-vpn and migration guide — https://docs.fortinet.com/document/fortigate/7.6.6/administration-guide/155142/ssl-vpn-tunnel-mode-to-ipsec-vpn-migration
- Fortinet product life cycle (EOO/EOS/LSED) — https://community.fortinet.com/customer-service-42/customer-service-tip-product-life-cycle-information-on-fortinet-products-96482
- FortiGuard bundle ordering guide (ATP/UTP/EP) — https://www.fortinet.com/content/dam/fortinet/assets/data-sheets/og-fortiguard.pdf
- FortiGate product matrix (throughput columns) — https://www.fortinet.com/content/dam/fortinet/assets/data-sheets/Fortinet_Product_Matrix.pdf
- ADVPN and shortcut paths — https://docs.fortinet.com/document/fortigate/7.6.6/administration-guide/985659/advpn-and-shortcut-paths
- EMS ZTNA tagging rules — https://docs.fortinet.com/document/fortigate/7.2.5/ztna-deployment/224675/configuring-ems-ztna-tagging-rules ; tag sync to FortiOS — https://docs.fortinet.com/document/fortigate/7.6.0/administration-guide/335228/synchronizing-forticlient-ztna-tags
- FortiManager CLI/Jinja templates — https://docs.fortinet.com/document/fortimanager/7.6.6/administration-guide/759109/cli-templates
- VDOMs (multi-VDOM; split-task removed in 7.2) — https://docs.fortinet.com/document/fortigate/6.4.0/administration-guide/109991/virtual-domains ; https://docs.fortinet.com/document/fortigate/7.2.0/new-features/726143/remove-split-task-vdoms-and-add-a-new-administrative-vdom-type
- FortiSASE datasheet — https://www.fortinet.com/content/dam/fortinet/assets/data-sheets/fortisase.pdf ; SPA using ZTNA deployment guide — https://fortinetweb.s3.amazonaws.com/docs.fortinet.com/v2/attachments/6460a9d7-c51f-11ee-8c42-fa163e15d75b/FortiSASE-24.1-SPA_Using_ZTNA_Deployment_Guide.pdf
- FortiOS configuration backup CLI — https://docs.fortinet.com/document/fortigate/8.0.0/administration-guide/702257/configuration-backups-and-reset
