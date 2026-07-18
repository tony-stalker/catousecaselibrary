# Migrating from Cisco to Cato SASE — SE brief

Scope: Cisco Umbrella (DNS Security / SIG), AnyConnect / Cisco Secure Client, Catalyst SD-WAN
(Viptela) and Meraki MX SD-WAN, Cisco Secure Access (SSE), and ASA/Firepower edge firewalls,
moving to the Cato SASE Cloud platform. Anything not tied to a listed source is marked
**[recommended practice]**. Items drawn from Cato Professional Services enablement decks are
marked **[Cato PS internal]** (no public URL).

---

## 1. Vendor snapshot

### The multi-product reality

A "Cisco SASE" estate is almost never one product. A typical mid-market/enterprise account runs
some combination of:

- **Umbrella** (DNS Security Essentials/Advantage or SIG Essentials/Advantage) — its own
  dashboard, virtual appliances on-prem for internal-domain DNS forwarding, roaming protection
  on endpoints.
- **AnyConnect / Cisco Secure Client** — remote-access VPN terminating on ASA or Firepower
  (FTD) headends, often with the ISE Posture and Umbrella Roaming Security modules bolted on.
- **Catalyst SD-WAN (Viptela)** — vEdge/cEdge (Catalyst 8000) routers with the
  vManage/vSmart/vBond controller stack (renamed Catalyst SD-WAN Manager/Controller/Validator),
  OMP overlay routing with TLOC next-hops; **and/or Meraki MX** with Auto-VPN managed from the
  Meraki Dashboard.
- **ASA/FTD** edge and DC firewalls managed via ASDM, FMC or CDO.
- **ISE** for RADIUS/802.1X NAC and VPN posture; **Talos** feeds the security stack.
- **Cisco Secure Access** — Cisco's own converged SSE, now positioned as the landing zone for
  Umbrella customers; adds yet another console (Security Cloud Control) during any transition.

Each element carries a separate console, licence model and renewal date. Cato's core pitch in
these accounts is convergence: Sockets + global backbone + FWaaS/SWG/ZTNA in one cloud platform
managed from a single console (Cato Management Application, CMA).

### Verifiable migration drivers (product transitions and EOL)

| Cisco product | Milestone | Date | Forced move to |
|---|---|---|---|
| AnyConnect 4.x | End of software maintenance | 31 Mar 2024 | Cisco Secure Client 5.x (free upgrade for entitled customers) |
| AnyConnect 4.x | End of support | 31 Mar 2027 | — |
| Umbrella Roaming Client (standalone) | End of support | 2 Apr 2025 | Secure Client with Umbrella Roaming Security module |
| Umbrella legacy SKUs (Roaming, Professional, Branch, Insights/Platform, Cloud Security) | EOL announced 18 Jun 2025; end of sale | 30 Sep 2025 | Cisco Secure Access |
| Umbrella legacy SKUs | End of software maintenance | 30 Sep 2026 (TAC to 30 Sep 2030) | — |
| vEdge 100B/100M/1000 | Last day to order | 30 Jan 2021 (support milestones run out Jan 2026) | Catalyst 8000 (cEdge) |
| vEdge 2000/5000 | Last day to order | 31 Jan 2023 | Catalyst 8500 etc. |
| Viptela software 18.3 and older | EOL announced | (see Cisco notice) | 19.x+/IOS XE SD-WAN |
| Meraki MX64/64W | End of sale 26 Jul 2022 | End of support 26 Jul 2027 | MX67/68 |
| Meraki MX65/65W | End of sale 28 May 2019 | End of support 28 May 2026 | MX67/68 |
| ASA 5506-X/5508-X/5516-X | End of support | 31 Aug 2026 | Firepower 1000/3100 |

Talking point: every row above is a **forced refresh inside the Cisco portfolio** — new client
software, new routers, new firewalls, new SSE subscription — each with migration effort of its
own. If the customer must re-plan, re-licence and re-deploy anyway, the incremental cost of
evaluating a platform change to Cato is low, and the end-state removes the multi-console estate
rather than modernising each silo separately. **[recommended practice]**

Also verifiable churn: the Viptela controller stack was renamed (vManage → Catalyst SD-WAN
Manager), Umbrella capabilities are being folded into Secure Access, and Meraki has its own SSE
integration path (Secure Connect / Secure Access with Meraki SD-WAN) — i.e. Cisco itself is
consolidating, and customers describe roadmap uncertainty across the overlapping offers.

---

## 2. Component → Cato mapping

| Cisco component | Function | Cato equivalent | Notes |
|---|---|---|---|
| Umbrella DNS Security (Essentials/Advantage) | DNS-layer filtering and malware blocking | Cato DNS Security (DNS Protections in IPS) + Internet firewall categories | Cato inspects all DNS traffic inline at the PoP regardless of resolver; granular per-account tuning in CMA. |
| Umbrella SIG (SWG, cloud-delivered firewall, CASB, DLP) | Full web/cloud security via tunnels or roaming agent | Cato SWG / Internet firewall (FWaaS), CASB, DLP, TLS inspection | One rule base in CMA instead of separate DNS/web/firewall policies; no IPsec/GRE backhaul to a security cloud — sites are already on Cato tunnels. |
| Umbrella virtual appliances | Conditional DNS forwarders for internal domains + internal IP visibility | Not required — internal DNS stays on AD/Infoblox; Cato DNS settings per account/site/user (default 10.254.254.1 via tunnel) | Cato sees real source IPs natively because traffic arrives over the site/user tunnel. |
| Umbrella dashboard, vManage / Catalyst SD-WAN Manager, Meraki Dashboard, ASDM/FMC/CDO | Management consoles | Cato Management Application (CMA) | Single console for networking, security, access and analytics; Meraki Dashboard is retained only if MS/MR LAN gear stays. |
| AnyConnect / Secure Client (VPN) + ASA/FTD headends | Remote-access VPN | Cato Client (SDP/ZTNA) + Clientless browser access | No VPN concentrators — users connect to nearest Cato PoP; same inspection stack as sites. |
| Secure Client ISE Posture module | Endpoint posture at connect time | Device Posture profiles + Client Connectivity Policy (anti-malware, firewall, disk encryption, certificate, OS checks; Intune MDM compliance) | Continuous posture checks supported, not just at logon. |
| Umbrella Roaming Security module | Off-net DNS/web protection | Cato Client (full traffic through Cato PoP) | Single agent replaces VPN + roaming-security module pair. |
| Catalyst SD-WAN vEdge/cEdge + vManage/vSmart/vBond, OMP/TLOC overlay | SD-WAN overlay, app-aware routing | Cato Socket (X1500/X1600/X1700) + Cato global private backbone | No customer-managed controllers; PoPs provide the overlay, routing and middle-mile. OMP route/TLOC state is replaced by Cato cloud routing + BGP at the edges. |
| Meraki MX + Auto-VPN | Cloud-managed SD-WAN | Cato Socket + backbone | Auto-VPN hub/spoke topology and hub-priority logic replaced by PoP-based any-to-any connectivity. |
| ASA/FTD branch and edge firewalls | NGFW, IPS | Cato FWaaS: Internet + WAN firewall, IPS, anti-malware | Removes appliance refresh/patching cycle at sites; DC firewalls often retained for local segmentation initially. |
| ISE (802.1X / wired NAC, RADIUS) | Network access control | Partially: user/device posture for Cato-delivered access. Cato does not provide wired 802.1X port NAC — retain ISE where required **[recommended practice]** | Frame ISE as LAN infrastructure, out of SASE scope. |
| Talos intelligence | Threat intel feeding Umbrella/FTD | Cato threat intelligence (~250 ingested feeds, ML-driven false-positive elimination) + Cato CTRL research | Applied inline for all customers at the PoP; no signature/appliance updates to manage. |
| ThousandEyes / vAnalytics / Meraki Insight | Monitoring & experience | Cato analytics, events and Experience Monitoring in CMA (incl. announced Meraki LAN integration, Oct 2025) | One data set for network + security events. |

---

## 3. Recommended migration path

Anchored to the Cato PS methodology — Export → Review & Map → Deploy → Optimise, with a
discovery → co-existence design → pilot → phased cutover → optimise/decommission arc.
**[Cato PS internal]**

### Phase 0 — Discovery and design

- Inventory: sites, WAN links and bandwidths, Viptela topology (hub/spoke regions, OMP/TLOC
  design, app-route/SLA policies in vManage templates), Meraki Auto-VPN hubs and spoke modes
  (split vs full tunnel), Umbrella policy set (identities, destination lists, content category
  settings, selective decryption lists), AnyConnect tunnel-groups/profiles and SAML/ISE
  dependencies, ASA/FTD rule bases.
- Capture business intent hidden in vManage centralised policy and Meraki templates before any
  decommissioning — this is the app-priority/SLA design Cato must reproduce. **[recommended practice]**
- Map licence co-termination dates (Cisco EA/DNA, Meraki co-term, Umbrella renewal) to build
  the migration calendar around renewal leverage. **[recommended practice]**
- Agree success criteria per phase and the rollback rules (below).

### Phase 1 — Co-existence foundation

- Stand up the Cato account: CMA admin model, IdP SSO and SCIM provisioning (Entra ID/Okta),
  base security policy from Cato best-practice templates.
- Choose the overlay co-existence pattern (see §4). For multi-region Viptela estates the
  preferred pattern is **regional Cato interconnect hubs with eBGP handoff to the corresponding
  Viptela/Meraki hub**, keeping traffic symmetric per region. **[Cato PS internal]**
- At the Viptela hub, redistribute between OMP and BGP so legacy-spoke routes reach Cato and
  Cato-site routes propagate into the overlay (standard Catalyst SD-WAN OMP↔BGP
  redistribution). At Meraki hubs, MX dynamic-routing support is limited, so the handoff is
  usually static routes or eBGP at the L3 core switch behind the MX rather than the MX itself.
  **[recommended practice]**
- Filter the default route and any parallel-connected-site prefixes at the interconnect; use
  Cato BGP communities to keep migration routes isolated where needed. **[Cato PS internal]**

### Phase 2 — Pilot

- Pilot sites (1–3, low risk, representative): ship Sockets (zero-touch, self-provisioning
  from the Cato Cloud), connect in parallel (transit VLAN / L3-switch or firewall handoff),
  move a subnet at a time, validate WAN + internet paths, voice, and rollback.
- Pilot users (a small cohort): Cato Client via MDM, split-tunnel first, validate SSO, posture
  checks and app access alongside the incumbent Secure Client (see dual-agent notes in §4).
- Policy pilot: **export Umbrella destination lists to CSV** (dashboard download or
  Destination Lists API) and export report/config data; **map** Umbrella content categories and
  block/allow lists to Cato system categories, custom categories and Internet firewall rules;
  recreate DNS-layer controls in Cato DNS Protections. Stage TLS inspection and IPS in
  monitor/report mode before enforcing. Review-and-map, not lift-and-shift: rule bases shrink
  when DNS, web and firewall policy collapse into one engine. **[recommended practice]**

### Phase 3 — Phased site cutover (SD-WAN swap)

- Wave plan by region (multi-region Option C/F pattern): migrate a region's spokes to Sockets,
  keeping the region's legacy hub as interconnect until the region completes. **[Cato PS internal]**
- Per-site runbook: pre-stage Socket → move LAN VLANs (or flip the default gateway / L3-switch
  routes) → disable the legacy spoke (Viptela: OMP withdraws its routes automatically; Meraki:
  remove the spoke from Auto-VPN) → Cato propagates the site's prefixes via BGP at the
  interconnect → validate → leave legacy CPE racked and configured during the soak window.
  Rollback is the mirror image: re-enable the legacy spoke and routes converge back.
  **[Cato PS internal]**
- With the static "routed ranges" hub pattern, pre-build Cato sites with dummy ranges, then at
  cutover delete the routed range at the interconnect and update the real ranges on the new
  site; rollback = re-add the routed range and restore the dummy range. Proven at ~300-site
  scale. **[Cato PS internal]**
- Update third-party allowlists keyed to old site egress IPs (SaaS tenant restrictions, banking
  portals) to Cato egress/allocated IPs per wave. **[recommended practice]**

### Phase 4 — Users and security-service cutover

- **AnyConnect → Cato Client cohort rollout:** deploy per cohort via MDM; start split-tunnel
  with the incumbent VPN still available; once the cohort's apps are validated through Cato,
  remove the AnyConnect/Secure Client VPN profile and enable always-on with the Client
  Connectivity Policy and Device Posture profiles (recreating ISE posture rules). Decommission
  ASA/FTD headends when the last cohort completes. **[recommended practice]**
- **Umbrella / DNS redirection cutover order** **[recommended practice]**:
  1. Sites first: once a site's traffic rides the Cato tunnel, DNS and web enforcement happen
     inline at the PoP — Umbrella becomes redundant for that site the day the Socket goes live.
     Migrate the site's Umbrella web/DNS policy to Cato in the same change window, because
     Umbrella "network" identities are keyed to the site's public egress IP, which changes to a
     shared Cato PoP address at cutover.
  2. Roaming users next: the Cato Client supersedes the Umbrella Roaming Security module;
     remove the module per cohort as the Client goes always-on.
  3. Internal DNS last: repoint internal DNS forwarders away from Umbrella virtual appliances
     (or Umbrella Anycast resolvers) to normal resolution through the Cato tunnel; retire the
     VAs; keep internal-domain handling on AD DNS throughout.
  4. Let the Umbrella subscription lapse at renewal once event parity is confirmed in CMA.

### Phase 5 — Optimise and decommission

- Tune policy from real events (the Optimise step of the PS methodology): tighten
  monitor-mode rules to block, enable stricter TLS inspection scope, refine app/bandwidth
  priorities on the backbone. **[Cato PS internal]**
- Decommission in order: legacy spokes → regional hubs/interconnects → vManage/vSmart/vBond
  controllers → ASA/FTD headends → Umbrella tenancy → Meraki MX licences at co-term. Retain
  ISE (wired NAC) and Meraki MS/MR (LAN) where they remain in scope. **[recommended practice]**

---

## 4. Co-existence and rollback

### Running Viptela/Meraki overlay in parallel with Cato

- **Asymmetry is the enemy.** With two overlays joined in more than one region, a flow can
  exit via one region's hub and return via another, breaking stateful inspection and dropping
  traffic. Design for path symmetry before migrating the first site. **[Cato PS internal]**
- **Preferred pattern — regional interconnect hubs with eBGP + AS-path anchoring:** keep legacy
  routing separated (VRFs / SD-WAN overlay / transit domains), establish eBGP per region
  between the Cato Socket and that region's legacy hub, and let BGP best-path do the work:
  cross-region routes carry a longer AS-PATH (the extra inter-hub hop), so each side always
  prefers its local regional hub — symmetric by construction, with automatic route withdrawal
  on spoke cutover and simple rollback. This is the same pattern Cato PS has deployed against
  FortiGate hub estates; it applies unchanged to Viptela hubs (via OMP↔BGP redistribution) and
  to Meraki hub sites (via the L3 core). **[Cato PS internal]**
- Alternatives when eBGP at hubs is not possible: parallel connectivity at all sites (best
  under ~20 sites), a single interconnect hub (accept hairpin latency, one region at a time),
  NAT/PAT at the boundary to force symmetry (low cross-region volumes only; breaks
  IP-embedding protocols such as LDAP/WMI), or customer-managed PBR over GRE/IPsec (complex,
  generally avoided). **[Cato PS internal]**
- Parallel-socket handoffs at a site: L3-switch default gateway, legacy-firewall default
  gateway, or Socket-as-default-gateway with LAN/Alt-WAN BGP handoff; Cato routes can be
  propagated or kept isolated with a reserved community. **[Cato PS internal]**

### Umbrella during the transition

- Umbrella keeps protecting un-migrated sites and users throughout; nothing about the Cato
  rollout breaks it as long as un-migrated sites keep their original egress IPs.
- Umbrella virtual appliances stay in place until the final DNS repoint (Phase 4 step 3);
  internal-domain forwarding behaviour is unchanged during site cutovers because VAs act as
  conditional forwarders independent of the WAN path.
- Watch the egress-IP dependency: a site behind Cato no longer matches its Umbrella network
  identity — move that site's policy to Cato at socket-swap time, not later. **[recommended practice]**
- Where a site backhauls to Umbrella SIG via IPsec/GRE from the existing firewall, that tunnel
  can be kept running in parallel from the firewall while WAN traffic moves to Cato — the same
  interim pattern Cato PS documents for Zscaler ZIA tunnels. **[Cato PS internal]**

### Dual agents on the endpoint

- Cato documents that third-party VPN clients on the same machine can conflict with the Cato
  Client — specifically, **Cisco AnyConnect can override the Cato Client's DNS settings** — and
  that running the Cato Client full-tunnel alongside a third-party VPN is not recommended.
- Sequencing that works: keep Secure Client for VPN only (no full-tunnel overlap) while the
  Cato Client runs split-tunnel, or move the cohort's remote access to Cato first and leave
  only the Umbrella module running until web policy parity is reached — then remove modules and
  client in one change. Test the interaction in the pilot cohort before scaling.
  **[recommended practice]**

### Rollback rules

- Sites: legacy CPE stays racked, powered and configured through an agreed soak window;
  rollback = re-enable spoke (BGP/OMP re-converges) or restore routed ranges at the
  interconnect. **[Cato PS internal]**
- Users: rollback = re-enable the AnyConnect profile via MDM; keep headends licensed until the
  final cohort clears soak. **[recommended practice]**
- DNS: keep Umbrella VAs and tenancy alive until after the last forwarder repoint; rollback is
  a forwarder change. **[recommended practice]**

---

## 5. Gotchas and objection handling

- **EIGRP/OSPF on the LAN core.** Cato's dynamic routing integration is BGP (Socket and IPsec
  sites); Cisco shops frequently run EIGRP (or OSPF) in the campus/DC. Plan redistribution
  EIGRP/OSPF↔BGP at the handoff device, or static routes for smaller sites — and watch
  administrative-distance and metric-seeding quirks when routes re-enter the IGP.
  **[recommended practice]**
- **Meraki full-stack dependency.** MS switches and MR access points are managed from the same
  Meraki Dashboard and licensing as the MX. Replacing the MX does not remove the Dashboard —
  scope the migration as "WAN + security to Cato, Meraki LAN retained", check co-termination
  impact on the remaining licences, and position Cato's announced Meraki Experience Monitoring
  integration (product update, Oct 2025) for LAN visibility from CMA. **[recommended practice]**
- **Meraki routing limits.** MX spokes rely on Auto-VPN and largely static routing; do not plan
  an eBGP handoff on the MX itself — anchor the interconnect at an L3 switch or firewall behind
  it. **[recommended practice]**
- **Umbrella Roaming Client vs Secure Client module confusion.** The standalone roaming client
  is already end-of-support (Apr 2025); many estates run a mix of the old client, the Secure
  Client Umbrella module and AnyConnect VPN. Audit what is actually installed before designing
  the dual-agent phase — the answer differs per cohort. **[recommended practice]**
- **SAML/ISE dependencies.** AnyConnect SAML authentication is configured per tunnel-group on
  the ASA/FTD; recreate access as Cato IdP SSO (Entra ID/Okta/OneLogin, multiple IdPs
  supported) with SCIM keeping users/groups in sync. ISE posture rules map to Cato Device
  Posture + Client Connectivity Policy, but wired 802.1X NAC, RADIUS CoA and switch-port
  enforcement stay with ISE — set that expectation early rather than defending it in the
  eleventh hour. **[recommended practice]**
- **Umbrella policy model differences.** Umbrella evaluates identity precedence
  (roaming > AD user/group > internal network > network); Cato is an ordered rule base with
  users/groups/sites as sources. Selective-decryption lists become Cato TLS-inspection rules.
  Verify equivalents for niche behaviours (e.g. block-page bypass codes) during Review & Map
  instead of assuming 1:1 parity. **[recommended practice]**
- **vManage intent is easy to lose.** App-route SLA classes, centralised control policies and
  templates encode years of tuning; export and translate them into Cato bandwidth priorities
  and rules before the controllers are switched off. **[recommended practice]**
- **"We'll just move to Secure Access / Catalyst refresh."** Valid objection — the counters
  are: (1) that path is itself a migration (new SKUs, new console, agent swap, router refresh),
  not a renewal; (2) it preserves the multi-product estate (SD-WAN, SSE, firewalls, NAC remain
  separate stacks); (3) Cato collapses the same scope into one platform and one policy model,
  with the co-existence patterns above de-risking the transition. **[recommended practice]**
- **Egress IP changes.** Anything keyed to office public IPs — SaaS allowlists, partner
  firewalls, Umbrella network identities — must be re-pointed as sites move behind Cato PoPs.
  Inventory these in discovery. **[recommended practice]**

---

## 6. Sources

**Cisco EOL / product transitions**
- AnyConnect 4.x EOS/EOL notice: https://www.cisco.com/c/en/us/products/collateral/security/anyconnect-secure-mobility-client/anyconnect-secure-mobility-client-v4x-eol.html
- vEdge 100B/100M/1000 EOS/EOL: https://www.cisco.com/c/en/us/products/collateral/routers/vedge-router/eos-eol-notice-c51-744078.html
- vEdge 2000/5000 EOS/EOL: https://www.cisco.com/c/en/us/products/collateral/routers/vedge-router/vedge-2000-5000-routers-modules-accessories-eol.html
- Viptela software 18.3 and older EOL: https://www.cisco.com/c/en/us/products/collateral/routers/sd-wan/eos-eol-notice-c51-743306.html
- ASA 5508/5516 EOS/EOL: https://www.cisco.com/c/en/us/products/collateral/security/asa-5500-series-next-generation-firewalls/eos-eol-notice-c51-744798.html
- Meraki EOL products and dates: https://documentation.meraki.com/Platform_Management/Product_Information/End-of-Life_Notices/Meraki_End-of-Life_(EOL)_Products_and_Dates
- Umbrella → Secure Access migration (Cisco): https://umbrella.cisco.com/umbrella-to-secure-access-migration and https://www.cisco.com/site/us/en/products/security/secure-access/umbrella-migration.html
- Umbrella legacy SKU EOL dates (third-party summary): https://jimber.io/blog/cisco-umbrella-end-of-life-migration-paths-2026/
- Umbrella Roaming Client EOL (third-party summary): https://www.dnsfilter.com/blog/cisco-umbrella-rc-end-of-life-what-you-need-to-know
- Secure Client upgrade blog (Cisco): https://umbrella.cisco.com/blog/your-free-upgrade-to-cisco-secure-client-awaits
- ASA 5500-X EOL analysis: https://jimber.io/blog/cisco-asa-5500-x-end-of-life-migration/

**Cisco technical references**
- Catalyst SD-WAN OMP configuration (OMP/TLOC): https://www.cisco.com/c/en/us/td/docs/routers/sdwan/configuration/routing/ios-xe-17/routing-protocols-configuration-guide/OMP-routing-protocol/configure-omp.html
- Meraki Auto-VPN configuration: https://documentation.meraki.com/SASE_and_SD-WAN/MX/Design_and_Configure/Configuration_Guides/Site-to-site_VPN/Meraki_Auto_VPN_-_Configuration_and_Troubleshooting
- Meraki MX routing behaviour: https://documentation.meraki.com/SASE_and_SD-WAN/MX/Design_and_Configure/Configuration_Guides/Networks_and_Routing/MX_Routing_Behavior
- Umbrella destination list CSV download: https://securitydocs.cisco.com/docs/umbrella-dns/olh/146789.dita
- Umbrella Destination Lists API export: https://developer.cisco.com/docs/cloud-security/get-destinations-and-export-to-csv-file/
- Umbrella internal DNS / virtual appliances: https://www.cisco.com/c/en/us/support/docs/security/umbrella/224910-configure-internal-dns-servers-for.html
- Talos: https://www.talosintelligence.com/

**Cato documentation**
- What is Cato DNS: https://support.catonetworks.com/hc/en-us/articles/22410218141213-What-is-Cato-DNS
- DNS Protections for IPS: https://support.catonetworks.com/hc/en-us/articles/6724699301661-Customizing-the-DNS-Protections-for-IPS
- Internet firewall: https://support.catonetworks.com/hc/en-us/articles/4413273486865-What-is-the-Cato-Internet-Firewall
- Working with categories: https://support.catonetworks.com/hc/en-us/articles/13314286857501-Working-with-Categories
- Firewall policy recommendations: https://support.catonetworks.com/hc/en-us/articles/360004274777-Recommendations-for-Internet-and-WAN-Firewall-Policies
- Device Posture profiles/checks: https://support.catonetworks.com/hc/en-us/articles/7387501459357-Creating-Device-Posture-Profiles-and-Device-Checks
- Client Connectivity Policy: https://support.catonetworks.com/hc/en-us/articles/4415419573393-Configuring-the-Client-Connectivity-Policy
- What are Cato Sockets (zero-touch): https://support.catonetworks.com/hc/en-us/articles/30175650827677-What-are-Cato-Sockets
- Using BGP in the Cato Cloud: https://support.catonetworks.com/hc/en-us/articles/7825408860573-Using-BGP-in-the-Cato-Cloud
- BGP neighbours for a Socket: https://support.catonetworks.com/hc/en-us/articles/4413273474065-Configuring-BGP-Neighbors-for-a-Cato-Socket
- Cato reserved BGP communities: https://support.catonetworks.com/hc/en-us/articles/7490318307229-Cato-Reserved-BGP-Communities
- SCIM provisioning: https://support.catonetworks.com/hc/en-us/articles/13651160092701-Provisioning-Users-with-SCIM
- Multiple identity providers: https://support.catonetworks.com/hc/en-us/articles/23911819146909-Configuring-Multiple-Identity-Providers
- Cato Client troubleshooting (AnyConnect DNS override): https://support.catonetworks.com/hc/en-us/articles/20824958359709-Troubleshooting-Scenarios-for-Issues-with-the-Cato-Client
- Managed threat intelligence: https://support.catonetworks.com/hc/en-us/articles/17581958368157-Managed-Threat-Intelligence-in-the-Cato-Cloud
- Threat-intel feed assessment (~250 feeds): https://www.catonetworks.com/news/cato-automates-threat-intelligence-feed-assessment-eliminating-false-positives/
- Cato CTRL: https://www.catonetworks.com/cato-ctrl/
- Cisco ASA vs Cato positioning: https://www.catonetworks.com/news/cisco-asa-next-gen-firewall-vs-cato-networks/
- Product update incl. Meraki Experience Monitoring integration (Oct 2025): https://support.catonetworks.com/hc/en-us/articles/30974690766237-Product-Updates-October-13-2025

**Internal (no public URL)**
- Cato PS enablement deck 2026 — migration options, technical co-existence, interconnecting
  sites, multi-region hub options A–F, eBGP AS-path anchoring, routed-ranges hub pattern.
- Cato PS "Zscaler to Cato" deck (Q3 2025) — Export → Review & Map → Deploy → Optimise policy
  methodology and parallel security-cloud tunnel patterns reused here for Umbrella SIG.
