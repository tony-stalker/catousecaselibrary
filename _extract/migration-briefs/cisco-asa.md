# Migrating from Cisco ASA to Cato SASE — SE brief (perimeter-firewall displacement)

Scope: the **ASA-only estate** — a perimeter ASA 5500-X (or HA pair) at HQ/DC, an IPsec
site-to-site mesh between ASAs, AnyConnect remote access terminating on the same boxes, and
little or nothing above L4 — moving to the Cato SASE Cloud platform. This is deliberately
narrower than the existing `cisco.md` brief (Umbrella + AnyConnect + Catalyst/Meraki SD-WAN +
ASA/FTD, the multi-console estate): here there is no Umbrella to translate, no SD-WAN overlay
to interconnect, and the policy work is mostly L3/L4 translation plus a **large greenfield
security build**. Anything not tied to a listed source is marked **[recommended practice]**.
Items drawn from Cato Professional Services enablement decks are marked **[Cato PS internal]**
(no public URL). All source URLs were accessed **28 Aug 2026** unless noted.

### How this complements the existing library pages (read before writing the new pages)

- **`migration-anyconnect.html`** already owns the remote-access play end-to-end: AnyConnect
  4.x EOL dates (maintenance ended Mar 2024, support ends 31 Mar 2027), the Secure Client 5.x
  forced client transition, the concentrator-model critique (capacity cliffs,
  internet-exposed headends, backhaul latency), six-step cohort migration, posture/DAP
  recreation as Device Posture, helpdesk playbook and a full configuration walkthrough. The
  new ASA page should summarise RA in a paragraph and link there — do not re-tread cohorts.
- **`migration-cisco.html`** owns the multi-product estate: Umbrella/SD-WAN/ISE component
  mapping, regional interconnect-hub co-existence with eBGP, Umbrella policy translation and
  the DNS cutover order. The new ASA page is its complement for accounts that have **none of
  that** — position the two against each other explicitly ("if you also run Umbrella or
  Cisco SD-WAN, see the full-estate play").
- **`migration-cisco-policy.html`** already contains a one-section ASA/FTD ACL → Cato mapping
  (interface ACLs → WAN/Internet firewall split, object-group flattening, zones/security
  levels, NAT-does-not-travel, hit-count-driven culling) inside its four-domain
  firewall/SWG/CASB/DLP structure — but its SWG/CASB/DLP domains assume an **Umbrella estate
  with policy to translate**. The new ASA policy page goes deeper on the ASA-only mechanics
  that page has no room for (hit-count caveats, packet-tracer validation, the NAT taxonomy,
  AnyConnect/DAP artefacts) and reframes SWG/CASB/DLP as **greenfield build, not
  translation**, because an ASA-only estate has nothing to export in those domains.
- **`network-ipsec-asa.html`** owns the ASA↔Cato tunnel mechanics: Socket-vs-IPsec decision,
  IKEv1 crypto-map vs IKEv2 route-based VTI (VTI from ASA 9.7(1), IKEv2-on-VTI from 9.8(1)),
  the TS_UNACCEPTABLE traffic-selector issue and its two documented remedies, dual-PoP HA,
  failover/reload drills. The migration pages must link to it for tunnel build detail and
  stay consistent with its remedies (see §6).

---

## 1. Vendor snapshot

### The estate you will actually find

The mid-market ASA-only account is the simplest Cisco estate and one of the most common
displacement targets. Typical shape **[recommended practice — field observation, not
sourced]**:

- One perimeter **ASA 5500-X at HQ/DC, usually an active/standby HA pair**; sometimes smaller
  ASAs (5506-X/5508-X) at branches. Managed by CLI + ASDM; occasionally CDO.
- **IPsec site-to-site** between ASAs and to partners/cloud VPN gateways — very often legacy
  **IKEv1 crypto-map (policy-based)** configurations that pre-date VTI support.
- **AnyConnect remote access** terminating on the same HA pair, with local or LDAP/SAML auth,
  split-tunnel ACLs, and sometimes DAP/HostScan posture rules.
- **Policy is L3/L4**: interface ACLs built from ACEs and nested object-groups, static NAT
  publishing a handful of services, PAT for egress. A decade of accumulated rules, many dead.
- **Security beyond L4 is usually absent**: no SWG/URL filtering, no CASB, no DLP, no TLS
  inspection. Where NGFW features exist they came from the ASA FirePOWER (SFR) service
  module — which dies with the hardware and whose configuration even Cisco's own migration
  tool does not convert (see §2). Some accounts bolt on Umbrella DNS — if so, use the
  full-estate brief (`cisco.md`) instead.

The consequence for the policy project: **the translation workload is smaller than a
Palo Alto/Fortinet NGFW estate, but the greenfield workload is bigger** — most of the Cato
policy build (SWG categories, CASB, DLP, TLS inspection, IPS) starts from Cato best-practice
baselines in monitor mode, not from exported vendor policy. **[recommended practice]**

### The EOL wall — every ASA 5500-X model is now dead or dying (VERIFIED)

| Model | End-of-sale (last order) | Last date of support | Cisco's named replacement |
|---|---|---|---|
| ASA 5505 | — | 31 Aug 2022 | Firepower/Secure Firewall small models |
| ASA 5512-X / 5515-X | 25 Aug 2017 (announced 24 Feb 2017) | 31 Aug 2022 | Firepower series |
| ASA 5585-X | — | 31 May 2023 (third-party trackers; Cisco notice not fetched this pass) | Firepower 4100/9300 class |
| ASA 5525-X / 5545-X / 5555-X | 4 Sep 2020 | **30 Sep 2025** | Firepower 2100 |
| ASA 5506-X (incl. H/W variants) | 2 Aug 2021 | **31 Aug 2026** | Firepower 1010 |
| ASA 5508-X / 5516-X | 2 Aug 2021 | **31 Aug 2026** | Firepower 1000 series |

Software is capped too: **ASA 9.16 is the final software release for the 5506-X/5508-X/5516-X;
ASA 9.17(1) and later removed all 5500-X support** — so the last remaining supported models
have been on a frozen software train since 2021, and after 31 Aug 2026 receive nothing at all.
The ASA FirePOWER module's last supported combination on 5508-X/5516-X is 9.16/7.0.

Talking point: as of this research date the **entire 5500-X family is at or past end of
support** — the 5506/5508/5516 wall (31 Aug 2026) is days away or already behind the reader.
There is no "wait and see" position left on this hardware; the only question is which
re-platforming project the refresh money funds. **[recommended practice]**

### The forced-migration story — what Cisco pushes ASA customers toward, and what it costs

Cisco's sanctioned path is Firepower/Secure Firewall hardware, in one of two modes:

1. **Re-platform to FTD (Threat Defense)** — different OS, different management plane
   (FMC/FDM/CDO instead of ASDM). Moving an existing Firepower appliance between ASA and FTD
   images is a **reimage, not an upgrade**. Config conversion relies on the **Cisco Secure
   Firewall migration tool**, which converts *supported* ASA features only, **ignores
   configuration for unsupported features**, and **does not convert ASA FirePOWER (SFR)
   module configuration at all** — that must be rebuilt by hand. Net: new hardware, new OS,
   new console, partial config conversion, full operational retraining. (VERIFIED from
   Cisco's migration-tool and reimage documentation.)
2. **Keep the ASA image on new hardware** — ASA software continues to be developed and runs
   on current Firepower/Secure Firewall appliances (see Cisco's ASA compatibility matrix).
   Honesty matters here: **ASA the operating system is not dead; ASA the 5500-X appliance
   is.** This path avoids retraining but is a pure hardware-refresh spend that changes
   nothing architecturally — same interface ACLs, same NAT, same internet-exposed VPN
   headend, still no SWG/CASB/DLP.

And the replacement targets keep moving underneath the customer (VERIFIED):

- The **Firepower 2100** — the replacement Cisco named for the 5525/5545/5555-X — is itself
  now end-of-sale, with support ending **31 May 2030** and migration guidance pointing at the
  Secure Firewall 3100. A 5545-X customer who followed Cisco's advice in 2020 is already one
  EOL cycle deep in the replacement.
- The **FMC 1600/2600/4600 management appliances** got their own EOL announcement
  (25 Jul 2025), and the FTD/FMC 7.0/7.2/7.3 software trains had last-order dates of
  18 Nov 2025 — the management plane and software trains churn on their own calendars.
- Third-party trackers report an end-of-sale announcement for the **Firepower 1000 series**
  (the small-model replacement for the 5506/5508/5516) with the Secure Firewall 1200 as the
  new small-form family — **UNVERIFIED against a Cisco notice this pass; a Cisco community
  response disputes it. Do not assert on pages** (see Unresolved). What is verifiable is that
  Cisco now sells the Secure Firewall 1200 series (1210CE/1210CP/1220CX compact, 1230/1240/
  1250 1U) as the current small-site family — i.e. the catalogue has moved on twice since the
  5506-X was sold.
- Cisco's retention lever is the **Technology Migration Program** (trade-in credit) — a
  discount on the next appliance cycle, not a change to the model. FTD feature licensing is
  term/subscription-based per the Cisco ordering guide **[not independently verified this
  pass — phrase generically on pages]**.

The displacement frame: **the customer must run a full migration project either way** —
export, translate, redeploy, retrain, re-licence. If the effort is being spent regardless,
the question is whether it buys another appliance-and-EOL cycle (with the same architecture
and the same missing capabilities) or removes the appliance cycle entirely.
**[recommended practice]**

### The security-history driver (handle with care — but this one is unusually strong)

The ASA story is no longer just "appliances get CVEs"; in 2024–2026 it became a
government-directive story:

- **ArcaneDoor (Apr 2024)**: Cisco Talos documented a state-sponsored espionage campaign
  exploiting two ASA zero-days — **CVE-2024-20353** (DoS via HTTP header parsing) and
  **CVE-2024-20359** (code execution from flash) — implanting the **Line Dancer** in-memory
  shellcode interpreter and the **Line Runner** persistent Lua backdoor that survives reboots
  and upgrades. Both CVEs entered the CISA Known Exploited Vulnerabilities catalogue.
- **Sep 2025**: new zero-days **CVE-2025-20333** (RCE) and **CVE-2025-20362** (privilege
  escalation / unauthenticated access to restricted VPN web endpoints) were exploited against
  ASA 5500-X devices to deploy **RayInitiator** — a GRUB bootkit specifically targeting ASA
  models **lacking secure boot, "many approaching their end-of-life dates"** — and the
  memory-resident **LINE VIPER** loader, which can harvest RADIUS/LDAP/TACACS credentials.
  The UK **NCSC** published the malware analysis and national guidance — a directly relevant
  hook for a UK mid-market audience.
- **CISA Emergency Directive ED 25-03 (25 Sep 2025)** ordered US federal agencies to
  inventory *all* ASA and Firepower devices, submit forensic core dumps from public-facing
  ASA hardware by 26 Sep 2025, and — the line that matters for this brief — **"permanently
  disconnect" ASA hardware with an end-of-support date on or before 30 Sep 2025**, because
  "these legacy platforms/releases cannot meet current vendor support and update
  requirements". A government agency ordering the *category* off the network is the
  strongest third-party validation an EOL displacement pitch can carry.
- **ED 25-03 V1 (updated 23 Apr 2026)** went further: CISA assessed that **applying Cisco's
  patches "does not necessarily remove an existing threat actor from the compromised
  device"**, documented the **FIRESTARTER** persistence mechanism on **Cisco Firepower and
  Secure Firewall devices** that survives security updates, and (per CISA's implementation
  guidance) required a physical hard reset — power-unplug, a reboot being insufficient — no
  later than 30 Apr 2026. Note what this means for the objection "we'll just buy Firepower":
  **the replacement platform Cisco steers ASA customers toward is named in the same
  directive.** CISA explicitly urged all public and private organisations, not just federal
  agencies, to act.

Frame it architecturally, not as vendor-shaming: every WAN-facing appliance VPN portal — any
vendor — is attack surface the customer patches on their own timeline, and the same KEV-table
argument exists for Fortinet, Palo Alto, Sophos and Ivanti. Cato's argument is that a
cloud-delivered PoP removes that device class from the customer's estate entirely: no
listening WebVPN/ASDM service, no bootkit-able flash, patching is Cato's job.
**[recommended practice]**

### AnyConnect → Cisco Secure Client licensing (the client is a second forced migration)

- **AnyConnect 4.x**: end of software maintenance **31 Mar 2024**; end of support
  **31 Mar 2027**. The sanctioned path is **Cisco Secure Client 5.x** — free for entitled
  customers but a full client transition (new packaging, new profiles, MDM re-rollout), as
  `migration-anyconnect.html` documents in depth.
- **Licence renaming**: AnyConnect **Plus → Secure Client Advantage**, **Apex → Secure Client
  Premier**; Cisco's ordering guide confirms Advantage/Premier terms can be **stacked with
  valid AnyConnect Plus/Apex licences** during the transition. Whether perpetual options
  survive in the current guide was not confirmed this pass (see Unresolved).
- Positioning note **[analysis, not a sourced Cisco statement]**: Secure Client is also the
  agent for Cisco Secure Access (Cisco's SSE), so the client migration doubles as Cisco's
  on-ramp to its own subscription cloud. The customer is doing an agent swap either way —
  the Cato Client is the same effort with a different end state, and the RA licence + headend
  hardware + Smart Net spend collapses into the SASE seat. Do not make specific price
  claims — commercials vary by agreement.

---

## 2. Component → Cato mapping

| ASA estate component | Function | Cato equivalent | Notes |
|---|---|---|---|
| Perimeter ASA / HA pair | Stateful L3/L4 firewall, NAT, routing | Socket site + Cato FWaaS (Internet + WAN firewall) at the PoP | Active/standby pair → Socket HA; no more failover licences or unit reimages |
| Interface ACLs (ACEs + object-groups) | Traffic policy | Ordered WAN firewall (allowlist) + Internet firewall rules in CMA | Direction split, not line-for-line copy — see §5 |
| Object-groups (network/service/protocol) | Reusable policy objects | CMA hosts, network ranges, groups, services, custom apps/categories | Flatten nesting; cull unreferenced objects at MAP |
| Object/Twice NAT, PAT | Egress NAT, publishing, VPN no-NAT | PoP egress NAT (inherent); Remote Port Forwarding (Cato allocated IPs) or Local Port Forwarding for inbound; identity/no-NAT becomes unnecessary | Inventory inbound publishes separately — see §5 |
| Site-to-site IPsec (crypto map or VTI) | WAN between sites/partners | Socket-to-Socket over the Cato backbone; IPsec IKEv2 sites for what remains (partners, cloud, interim ASA) | Tunnel mechanics live on `network-ipsec-asa.html` |
| AnyConnect / Secure Client (VPN) on the ASA | Remote access | Cato Client (SDP/ZTNA) + clientless browser access | Full play on `migration-anyconnect.html` |
| DAP / HostScan (Secure Firewall Posture) | Connect-time posture | Device Posture profiles + Client Connectivity Policy | No export path — recreate from intent, continuously evaluated |
| WebVPN / clientless portal | Browser access to internal apps | Cato clientless access via the instant-access portal | Removes the exact endpoint class exploited by CVE-2025-20362 |
| SAML/LDAP auth, LDAP attribute maps | RA authentication/authorisation | Cato IdP SSO (Entra ID/Okta) + SCIM groups | Attribute-map logic becomes group membership |
| ASA FirePOWER (SFR) module | IPS/AMP/URL (where licensed) | Cato IPS + anti-malware, SWG categories | Module config is not convertible even to FTD — rebuild from Cato baselines |
| ASDM / CDO management | Console | Cato Management Application (CMA) | One console for network + security + access + analytics |
| Syslog/NetFlow/SNMP off the ASA | Ops telemetry | CMA events/analytics, Event Feed integrations to SIEM | Re-home dashboards and alert rules before decommission **[recommended practice]** |
| EIGRP/OSPF on ASA or LAN core | Routing | BGP to Socket, or static + L3-core redistribution | Same gotcha as the full Cisco brief |
| **No ASA equivalent** — SWG/URL filtering, CASB, DLP, TLS inspection at scale, XDR | — | Cato SWG, CASB, DLP, TLS inspection, XDR | **Greenfield build from Cato best-practice policy, monitor-first** — this is most of the policy project |

---

## 3. Estate discovery and config export (feeds the EXPORT phase)

Everything needed lives in a handful of CLI artefacts — capture them per device, twice
(start and end of a representative window):

- **`show running-config`** — the full config: objects, ACLs, NAT, crypto, tunnel-groups,
  group-policies. `more system:running-config` additionally reveals pre-shared keys and
  other secrets the standard output masks — capture it under change control for the
  co-existence tunnel build. **[recommended practice]**
- **`show access-list`** — the single most valuable artefact: it **expands object-groups into
  individual ACEs and shows a live `hitcnt=` per entry**. Filter dead rules with
  `show access-list | include hitcnt=0`. Caveats that must survive onto the page: counters
  reset on reload and on `clear access-list counters`, so establish a **counting window**
  (30–90 days including a month-end/quarter-end) rather than trusting a single snapshot; a
  zero-hit ACE may be an annual DR path, so culls need change-control sign-off, not
  automation. **[recommended practice; command behaviour VERIFIED in Cisco command
  reference and support docs]**
- **`show object-group` / `show names`** — object inventory for the MAP workbook.
- **`show nat detail` and `show xlate count`** — the real NAT table in evaluation order
  (Section 1 manual/twice NAT → Section 2 object NAT → Section 3 after-auto), which is the
  input to the inbound-publishing inventory in §5.
- **`show crypto ikev2 sa` / `show crypto ipsec sa`, `show vpn-sessiondb anyconnect`** —
  live tunnel and RA session baselines for parity evidence later.
- **`packet-tracer input <if> tcp|udp <src> <sport> <dst> <dport>`** — simulates a flow
  through route lookup, ACL, NAT and VPN phases and reports the verdict per phase. Use it
  twice: at EXPORT to build a **golden flow list** (the 20–50 flows the business actually
  depends on, each with its expected verdict), and at DEPLOY to prove the ASA-side behaviour
  matched expectations before comparing against Cato events. **[recommended practice;
  command VERIFIED in Cisco command reference]**
- **FMC-managed estates** (where an SFR module or FTD is present): FMC 6.4+ displays and
  clears **access-control and prefilter rule hit counters** in the GUI; the FTD CLI
  equivalent is `clear access-list <acl> counters`. CDO holds the same data for
  cloud-managed devices. (VERIFIED — Cisco technote 212330 and FMC configuration guide.)
- Round out the inventory: `show version` (model, serial, software — anything on 9.12/9.14
  is even further past support than the hardware), `show failover`, licence state, `dir
  disk0:` for AnyConnect packages/profiles/HostScan, and the certificate estate
  (`show crypto ca certificates` — identity certs, internal CA chains, expiry dates).

---

## 4. Recommended migration path (feeds the playbook page)

Anchored to the Cato PS methodology — **EXPORT → REVIEW & MAP → DEPLOY (monitor-first) →
OPTIMISE** — with a discovery → co-existence → pilot → waves → decommission arc.
**[Cato PS internal]**

### Phase 0 — Discovery and design
- Run §3 across every ASA. Map models/serials against the EOL table in §1 — in most accounts
  this yields a slide where every device is red. Map Smart Net renewal dates and the Secure
  Client subscription anniversary as decision forcing-points. **[recommended practice]**
- Inventory the four dependency classes that bite later: inbound NAT publishes, partner VPNs
  terminating on the ASA, anything keyed to the site's egress IP, and cert/posture artefacts
  (AnyConnect profiles, DAP rules, HostScan checks, machine certs).
- Agree the golden flow list and per-phase success criteria (§7).

### Phase 1 — Co-existence foundation
- Stand up the Cato account: CMA admin model, IdP SSO + SCIM, base security policy from Cato
  best-practice templates with the greenfield engines (IPS, anti-malware, SWG, TLS
  inspection) in **monitor/report mode** from day one — every week of co-existence then
  generates evidence for the OPTIMISE phase. **[recommended practice]**
- Choose the co-existence pattern (§6): parallel connectivity per site (the mid-market
  default) and/or the existing hub ASA brought up as a **Cato IPsec site** so un-migrated
  branches reach migrated resources during the transition.

### Phase 2 — Pilot
- One representative branch on a Socket in parallel with its ASA; move a subnet at a time;
  validate the golden flows via packet-tracer (ASA side) and CMA events (Cato side).
- A pilot RA cohort on the Cato Client — run the cohort mechanics from
  `migration-anyconnect.html`, including the AnyConnect-DNS-override caveat already
  documented in `cisco.md`.
- Policy pilot: run the §5 MAP on the pilot site's ACE slice only; deploy allow-and-track;
  compare a fortnight of Cato events against the ASA hitcnt deltas for the same window.

### Phase 3 — Site waves and published services
- Per-site runbook: pre-stage Socket → move VLANs/default gateway → validate golden flows →
  soak with the ASA racked and configured → decommission. Rollback = restore the default
  gateway/routes to the ASA. **[Cato PS internal — standard parallel-connectivity runbook]**
- Re-home inbound publishes per wave: Remote Port Forwarding on Cato allocated IPs or Local
  Port Forwarding for the few true inbound services; app-by-app moves behind ZTNA/clientless
  access for everything that only ever needed *user* access, not internet exposure. Update
  external DNS and partner allowlists in the same window. **[recommended practice]**
- Update anything keyed to site egress IPs (SaaS tenant restrictions, partner firewalls).

### Phase 4 — Remote access cutover
- Execute the AnyConnect page's wave plan. The perimeter ASA usually cannot be decommissioned
  until the last RA cohort clears — sequence RA before the final HQ cutover, not after.
  **[recommended practice]**

### Phase 5 — Optimise and decommission
- OPTIMISE: tighten monitor-mode rules to block on event evidence, widen TLS inspection
  scope, retire the temporary co-existence tunnels.
- Decommission order: branch ASAs → published-service NAT → RA headend function → hub
  ASA/IPsec interconnect → lapse Smart Net and Secure Client subscriptions at renewal. Final
  acts: confirm the WebVPN/ASDM listeners are gone from the internet (external scan) and
  archive the final configs + hitcnt exports for audit. **[recommended practice]**

---

## 5. Policy mapping ASA → Cato (feeds the policy page's MAP phase)

Construct-by-construct, with the semantic traps. Consistent with — and deeper than — the
ASA/FTD section of `migration-cisco-policy.html`.

| ASA construct | Cato construct | Semantic trap / note |
|---|---|---|
| Interface ACL, inbound per interface, implicit deny | **Split by direction**: site-to-site and east-west ACEs → WAN firewall (allowlist, implicit deny); internal→internet ACEs → Internet firewall (blocklist, implicit allow) | **Direction inversion**: a raw copy puts outbound exceptions into the wrong base and inverts their meaning. **Shadowing on merge**: consolidating per-interface ACLs into one ordered base can shadow rules that never collided on the ASA — re-order deliberately and re-test with the golden flow list |
| ACE with object-groups | One CMA rule with catalogue objects | `show access-list` pre-expands groups — decide survival per expanded ACE, then re-group in Cato objects, not per line |
| Nested object-groups | Flat hosts/ranges/groups | Flatten; delete unreferenced and duplicate objects at MAP rather than importing sprawl |
| Service/protocol object-groups | Cato services / custom services; many collapse into the app catalogue | An L4 port rule for a known SaaS becomes an application rule — richer, but verify the app signature covers all the old ports |
| Security levels / `same-security-traffic` / zones | Site, network-range and group scoping on rules | No zone construct in Cato — intent must be restated, not copied |
| **Object NAT (egress PAT)** | Nothing — PoP egress NAT is inherent | Delete, don't map. Record the old egress IPs for the allowlist-update checklist |
| **Static NAT / port-forward publishes** | Remote Port Forwarding (allocated IPs) or Local Port Forwarding; better: ZTNA/clientless for user-only "publishes" | Inventory separately from the ACL work — each publish carries DNS, partner and certificate dependencies |
| **Identity NAT / no-NAT for VPN traffic** | Not needed — Cato WAN traffic is routed, not NATed | Its presence in the config marks which flows were VPN-bound: useful discovery data, zero migration output |
| **Twice/manual NAT with destination logic, hairpin NAT, DNS doctoring** | No equivalent | Redesign, not translation: split-horizon DNS replaces hairpins; destination-conditional NAT usually indicates an overlapping-subnet or partner quirk that needs an explicit design decision at MAP |
| Crypto-map ACLs ("interesting traffic") | Nothing — routing decides what enters Cato tunnels | Their content is discovery data for the site/partner inventory; the construct itself dies (and is the root of the TS_UNACCEPTABLE issue, §6) |
| MPF service-policy tweaks (inspections, timeouts) | Mostly not applicable at the PoP | Catalogue any deliberate inspection disables/timeout overrides — they often encode app quirks (SIP, legacy FTP) that need a Cato-side check |
| Threat-detection / shun / uRPF settings | Cato IPS + platform protections | No translation — note intent, verify coverage in monitor mode |
| AnyConnect tunnel-group / group-policy / split-tunnel ACL | Client Connectivity Policy + app access rules | Covered on `migration-anyconnect.html` — reference, don't duplicate |
| DAP / HostScan | Device Posture profiles + posture-gated connectivity | **No export path** — recreate from written intent; continuously evaluated rather than connect-time only |
| Local users / AAA / LDAP attribute maps | IdP SSO + SCIM group membership | Attribute-map logic becomes group design in the IdP |
| **Absent on ASA: SWG, CASB, DLP, TLS inspection, IPS (without SFR)** | Cato SWG categories, CASB, DLP, TLS inspection, IPS | **Greenfield**: deploy Cato best-practice baseline in monitor mode during co-existence, tune from events at OPTIMISE. There is nothing to export — make this explicit on the page so nobody goes hunting for a non-existent ASA artefact |

Rules that hold across the whole exercise: export **with hit counts** over a representative
window → cull zero-hit ACEs with sign-off → flatten objects → split survivors by direction →
deploy allow-and-track/monitor first → tighten to block from event evidence. Review-and-map,
not lift-and-shift: per-interface rule bases collapse into one global policy.
**[recommended practice, consistent with the existing cisco-policy page]**

---

## 6. Co-existence and rollback (ASA-specific)

### Patterns

- **Parallel connectivity per site** (the mid-market default): Socket beside the ASA, L3
  handoff, move subnets progressively. Rollback = restore routes to the ASA. Fits estates
  small enough not to need an interconnect design. **[Cato PS internal]**
- **The hub ASA as a Cato IPsec site**: bring the existing perimeter ASA up as an IPsec
  IKEv2 site so un-migrated branches (still reaching the hub over the legacy ASA mesh) can
  reach Cato-side resources during the transition, and so partner tunnels keep terminating
  somewhere familiar until they are re-homed. All tunnel mechanics per
  `network-ipsec-asa.html`: prefer the **route-based VTI** design (ASA 9.7(1)+ for VTI,
  9.8(1)+ for IKEv2-on-VTI), dual tunnels to two PoP allocated IPs, static or BGP routing,
  AES-GCM at ≥100 Mbps. **[library page + Cato KB]**
- Filter default routes and keep migration prefixes tidy at the interconnect; if both a
  Socket path and the ASA path can carry the same prefix, design for symmetry before the
  first wave. **[Cato PS internal]**

### The TS_UNACCEPTABLE trap (stay consistent with `network-ipsec-asa.html`)

When creating a child SA, Cato sends **multiple traffic selectors in one TS payload**; a
Cisco ASA supports only a **single traffic selector per child SA** and rejects the
negotiation with **TS_UNACCEPTABLE**. The two documented remedies — identical on the library
page and in Cato's KB — are:

1. **Route-based VTI** with no Network Ranges beyond native on the Cato site, so the tunnel
   negotiates a single 0.0.0.0/0 ↔ 0.0.0.0/0 selector pair; or
2. the CMA advanced setting **"IKEv2 Send Single TS per Payload"** (Site Configuration →
   Advanced Configuration) for estates that must stay policy-based (crypto map).

Wave-planning corollary from the library page: a PoV that validated remedy 1 does **not**
validate remedy 2 — if production ASAs run crypto maps, the single-TS setting needs its own
validation pass. Also note for page consistency: the library page and Cato's KB cite
"RFC 7295" for the multiple-TS behaviour; the IKEv2 specification is actually RFC 7296 —
avoid re-asserting the RFC number on new pages rather than propagating the citation.

Other ASA IPsec specifics worth keeping: IKEv1 sites are **Cato-initiated** (the PoP builds
the tunnel; a tunnel-group must exist per Cato allocated IP), and the ASA's IKEv1 hash
options are MD5/SHA1 only — one more reason the interim interconnect should be IKEv2.
**[library page]**

### Rollback rules
- Sites: ASA stays racked, powered and configured through the soak window; rollback =
  restore default gateway/static routes (or re-enable the crypto map peer). **[Cato PS
  internal / library-page reversion pattern]**
- Published services: keep the old static NAT and DNS TTLs low until the new path has soaked;
  rollback = DNS revert. **[recommended practice]**
- RA: per-cohort MDM rollback exactly as the AnyConnect page prescribes.

---

## 7. Risks, gotchas and objection handling

- **Zero-hit is not dead.** DR routes, annual jobs and break-glass rules legitimately show
  `hitcnt=0`. Cull with change-control sign-off against a counting window that includes
  month-end; keep a "parked" rule group in CMA (disabled, documented) rather than silently
  dropping contested ACEs. **[recommended practice]**
- **Shadowed ACEs surface late.** First-match on the ASA and first-match in CMA do not
  compose when several per-interface ACLs merge into one base. The golden-flow packet-tracer
  list plus monitor-mode events is the regression harness — run it after every re-order.
  **[recommended practice]**
- **Embedded NAT dependencies are the classic cutover breaker.** Partner VPNs pointed at a
  NATed address, hairpin access to a published service from inside, DNS doctoring, SaaS
  allowlists keyed to the PAT address — every one is invisible in the ACL export and every
  one breaks at cutover if not inventoried from `show nat detail` in Phase 0.
  **[recommended practice]**
- **Cert and posture recreation has no shortcut.** AnyConnect machine certs, internal CA
  chains, DAP/HostScan logic: none of it exports (Cisco's own tool doesn't carry SFR module
  config, and DAP recreation was manual even ASA→FTD). Budget real workshop time to restate
  posture intent as Device Posture profiles, and check certificate expiry dates — an expiring
  cert mid-migration looks like a Cato failure. **[recommended practice]**
- **"We'll just buy Firepower / Secure Firewall."** Valid path; counters, all sourced in §1:
  (1) it is itself a migration project (reimage, new console, partial config conversion,
  retraining) — not a renewal; (2) the replacement families have their own EOL treadmill
  (Firepower 2100 already EOS; FMC appliances EOL'd); (3) ED 25-03 V1 names Firepower/Secure
  Firewall persistence (FIRESTARTER) — the architecture keeps an internet-exposed appliance
  in the customer's patch queue; (4) it still buys none of the missing capability (SWG, CASB,
  DLP, ZTNA) without further subscriptions and consoles.
- **"ASA software isn't dead."** Correct — concede it (ASA 9.2x continues on new hardware).
  The dying asset is the 5500-X appliance and the architecture. Overclaiming "ASA is EOL"
  full-stop loses credibility with the network team who read the compatibility matrix.
- **EIGRP on the core.** Same as the full Cisco brief: Cato's dynamic routing is BGP —
  plan redistribution at the L3 core or statics for small sites. **[recommended practice]**
- **Ops telemetry re-homing.** Syslog parsers, NetFlow dashboards and SNMP polls die with
  the ASA; agree the CMA events/SIEM feed design before decommission, and export final
  configs + counters for audit retention. **[recommended practice]**
- **Don't oversell the breach story.** Use ArcaneDoor/ED 25-03 to argue the *category* is
  structurally exposed and that governments now say so — not that the customer's specific
  ASA is compromised. Offer the NCSC malware-analysis checks as a goodwill diagnostic in
  discovery. **[recommended practice]**

---

## 8. Measurable evidence of success (feeds both pages' evidence sections)

Baseline in Phase 0, measure at each wave, report at OPTIMISE:

- **Attack surface**: external scan before/after — WebVPN/ASDM/IKE listeners on the old
  egress IPs gone; zero internet-listening admin or VPN endpoints in the estate.
- **Policy hygiene**: exported ACE count → deployed CMA rule count (% reduction); zero-hit
  ACEs identified vs culled vs parked; object count before/after flattening.
- **Correctness**: golden-flow list pass rate on ASA (packet-tracer) vs on Cato (events) —
  target 100% before each wave's cutover; monitor-mode event parity for the top-N ACEs vs
  the ASA hitcnt deltas over the same window.
- **Availability**: tunnel/site uptime through co-existence; the failover and reload drill
  results from the IPsec page's runbook for any interim ASA-IPsec site.
- **User experience**: RA login success rate and latency to key apps per cohort (the
  AnyConnect page's evidence week), before/after.
- **New capability actually on** (the greenfield dividend — capabilities the ASA never had):
  % of traffic TLS-inspected, IPS/anti-malware verdicts, SWG category enforcement events,
  CASB app discoveries — reported from CMA as the OPTIMISE exit evidence.
- **Lifecycle**: count of devices past/approaching EOL removed; Smart Net + Secure Client
  subscriptions lapsed at renewal. **[recommended practice throughout]**

---

## 9. Sources (all accessed 28 Aug 2026)

**ASA 5500-X hardware lifecycle (Cisco notices; cisco.com blocks automated fetch — dates
corroborated via search excerpts of the notices and mirrored PDFs as flagged)**
- ASA 5500-X EOL/EOS notice listing (Cisco): https://www.cisco.com/c/en/us/products/security/asa-5500-series-next-generation-firewalls/eos-eol-notice-listing.html
- ASA 5508-X/5516-X EOL notice (last order 2 Aug 2021; LDoS 31 Aug 2026; Firepower 1000 recommended): https://www.cisco.com/c/en/us/products/collateral/security/asa-5500-series-next-generation-firewalls/eos-eol-notice-c51-744798.html
- ASA 5506 series EOL notice (last order 2 Aug 2021; LDoS 31 Aug 2026; Firepower 1010 recommended): https://www.cisco.com/c/en/us/products/collateral/security/asa-5500-series-next-generation-firewalls/eos-eol-notice-c51-744797.html
- ASA 5512-X/5515-X EOL notice (announced 24 Feb 2017; EoS 25 Aug 2017; **LDoS 31 Aug 2022 — read directly from the notice PDF mirror**): https://www.cisco.com/c/en/us/products/collateral/security/asa-5500-series-next-generation-firewalls/eos-eol-notice-c51-738644.html (PDF mirror: https://www.router-switch.com/media/upload/product-pdf-eos/eos-and-eol-for-the-cisco-asa-5512-x-and-asa-5515-x.pdf)
- ASA 5525/5545/5555 EOL (last order 4 Sep 2020; LDoS 30 Sep 2025; Firepower 2100 migration): https://www.cisco.com/c/en/us/products/collateral/security/asa-firepower-services/eos-eol-notice-c51-743545.html and https://community.cisco.com/t5/network-security/cisco-asa-5525-x-end-of-life-date/td-p/4903757
- Third-party lifecycle aggregates (5505 LDoS 31 Aug 2022; 5585-X LDoS 31 May 2023): https://eosl.date/security/firewall/vendor/cisco/asa/ and https://www.parkplacetechnologies.com/eosl/family/asa/ — **note: both aggregators wrongly list the 5515-X at 31 Aug 2026; the Cisco notice says 31 Aug 2022. Trust the notice.**
- ASA 9.16 last release for 5506/5508/5516; 9.17 removes 5500-X; SFR last combo 9.16/7.0: https://www.cisco.com/c/en/us/td/docs/security/asa/asa917/release/notes/asarn917.html and https://www.cisco.com/c/en/us/td/docs/security/asa/compatibility/asamatrx.html

**Firepower / Secure Firewall re-platforming**
- Firepower 2100 EOL (announcement incl. 5-yr subs 23 Oct 2025; support ends 31 May 2030; migrate to Secure Firewall 3100): https://www.cisco.com/c/en/us/products/collateral/security/firepower-ngfw/firepower-2100-series-sec-app-5-yr-sub-eol.html and https://eosl.date/security/firewall/vendor/cisco/firepower/
- FMC 1600/2600/4600 EOL announced 25 Jul 2025; FTD/FMC 7.0/7.2/7.3 last order 18 Nov 2025: https://www.cisco.com/c/en/us/products/security/firepower-management-center/eos-eol-notice-listing.html and https://www.cisco.com/c/en/us/products/security/firepower-ngfw/eos-eol-notice-listing.html
- Secure Firewall migration tool (converts supported ASA features only; ignores unsupported; does not convert ASA FirePOWER configs): https://www.cisco.com/c/en/us/td/docs/security/firepower/migration-tool/migration-guide/ASA2FTD-with-FP-Migration-Tool/m-getting-started-with-the-secure-firewall-migration-tool.html and https://www.cisco.com/c/en/us/td/docs/security/firepower/620/asa2ftd-migration/asa2ftd-migration-guide-620/asa2ftd_intro.html
- ASA↔FTD reimage guide (re-platforming is a reimage): https://www.cisco.com/c/en/us/td/docs/security/firepower/quick_start/reimage/asa-ftd-reimage.html
- Secure Firewall 1200 series data sheet (current small-site family): https://www.cisco.com/c/en/us/products/collateral/security/firewalls/secure-firewall-1200-series-ds.html
- Cisco Network Security Ordering Guide (licensing structure; not deeply verified this pass): https://www.cisco.com/c/en/us/products/collateral/security/secure-firewall/guide-c07-737902.html

**Security history / directives**
- Talos ArcaneDoor report (CVE-2024-20353/20359; Line Dancer/Line Runner; state-sponsored): https://blog.talosintelligence.com/arcanedoor-new-espionage-focused-campaign-found-targeting-perimeter-network-devices/
- CISA alert on ArcaneDoor updates (24 Apr 2024): https://www.cisa.gov/news-events/alerts/2024/04/24/cisco-releases-security-updates-addressing-arcanedoor-vulnerabilities-cisco-firewall-platforms
- CISA ED 25-03 (issued 25 Sep 2025; core dumps by 26 Sep 2025; permanently disconnect ASA hardware EOS on/before 30 Sep 2025; V1 revision updated 23 Apr 2026 — patching does not necessarily evict; FIRESTARTER on Firepower/Secure Firewall; CVE-2025-20333/20362): https://www.cisa.gov/news-events/directives/ed-25-03-identify-and-mitigate-potential-compromise-cisco-devices
- CISA announcement alert (25 Sep 2025): https://www.cisa.gov/news-events/alerts/2025/09/25/cisa-directs-federal-agencies-identify-and-mitigate-potential-compromise-cisco-devices
- CISA implementation-guidance update (12 Nov 2025; hard-reset/power-pull requirement): https://www.cisa.gov/news-events/alerts/2025/11/12/update-implementation-guidance-emergency-directive-cisco-asa-and-firepower-device-vulnerabilities
- NCSC news (RayInitiator/LINE VIPER; GRUB bootkit targeting ASA models lacking secure boot, many approaching EOL; RADIUS/LDAP/TACACS harvesting): https://www.ncsc.gov.uk/news/persistent-malicious-targeting-cisco-devices
- Coverage: https://thehackernews.com/2025/09/cisco-asa-firewall-zero-day-exploits.html and https://securityaffairs.com/182639/hacking/uk-ncsc-warns-that-attackers-exploited-cisco-firewall-zero-days-to-deploy-rayinitiator-and-line-viper-malware.html

**AnyConnect / Secure Client**
- AnyConnect 4.x EOL notice (maintenance ended 31 Mar 2024; support ends 31 Mar 2027): https://www.cisco.com/c/en/us/products/collateral/security/anyconnect-secure-mobility-client/anyconnect-secure-mobility-client-v4x-eol.html
- Secure Client Ordering Guide (Plus→Advantage, Apex→Premier; stacking with valid Plus/Apex): https://www.cisco.com/c/en/us/products/collateral/security/anyconnect-secure-mobility-client/secure-client-og.html
- Secure Client licensing FAQ: https://www.cisco.com/c/en/us/support/docs/security/anyconnect-secure-mobility-client/200191-AnyConnect-Licensing-Frequently-Asked-Qu.html
- Secure Client upgrade blog (free for entitled customers): https://umbrella.cisco.com/blog/your-free-upgrade-to-cisco-secure-client-awaits

**ASA discovery / export mechanics**
- ASA command reference (show access-list with hitcnt; packet-tracer): https://www.cisco.com/c/en/us/td/docs/security/asa/asa-cli-reference/S/asa-command-ref-S/show-aa-to-show-asr-commands.html and https://www.cisco.com/c/en/us/td/docs/security/asa/asa-cli-reference/I-R/asa-command-ref-I-R/o-commands.html
- ASA ACL configuration examples (hitcnt usage): https://www.cisco.com/c/en/us/support/docs/security/adaptive-security-appliance-asa-software/217679-asa-access-control-list-configuration-ex.html
- FMC access-policy hit counters (view/clear; FTD `clear access-list ... counters`): https://www.cisco.com/c/en/us/support/docs/security/firepower-ngfw/212330-firepower-management-center-display-acc.html
- ASA NAT model (three-section NAT table; object NAT vs twice NAT ordering): https://www.cisco.com/c/en/us/td/docs/security/asa/asa920/configuration/firewall/asa-920-firewall-config/nat-basics.html

**Cato side (already documented across the library — cited for completeness)**
- Configuring IPsec IKEv2 sites: https://knowledge.catonetworks.com/docs/configuring-ipsec-ikev2-sites · IKEv1 sites: https://knowledge.catonetworks.com/docs/configuring-ipsec-ikev1-sites
- IPsec recommendations / troubleshooting: https://knowledge.catonetworks.com/docs/recommendations-for-ipsec-connections and https://knowledge.catonetworks.com/docs/troubleshooting-ipsec-connectivity
- Advanced Configuration (IKEv2 Send Single TS per Payload): https://support.catonetworks.com/hc/en-us/articles/4413265663761-Working-with-Advanced-Configuration-for-the-Account
- Allocating IP addresses: https://knowledge.catonetworks.com/docs/allocating-ip-addresses-for-the-account · BGP for IPsec sites: https://knowledge.catonetworks.com/docs/configuring-bgp-neighbors-for-an-ipsec-connection
- What are Cato Sockets: https://support.catonetworks.com/hc/en-us/articles/30175650827677-What-are-Cato-Sockets · Internet firewall: https://support.catonetworks.com/hc/en-us/articles/4413273486865-What-is-the-Cato-Internet-Firewall · firewall best practices: https://support.catonetworks.com/hc/en-us/articles/360004274777-Recommendations-for-Internet-and-WAN-Firewall-Policies
- Device Posture: https://support.catonetworks.com/hc/en-us/articles/7387501459357-Creating-Device-Posture-Profiles-and-Device-Checks · Client Connectivity Policy: https://support.catonetworks.com/hc/en-us/articles/4415419573393-Configuring-the-Client-Connectivity-Policy
- Cato positioning vs ASA: https://www.catonetworks.com/news/cisco-asa-next-gen-firewall-vs-cato-networks/

**Internal (no public URL)**
- Cato PS enablement deck 2026 — parallel-connectivity and interconnect co-existence
  patterns, phased-cutover and rollback runbooks; Export → Review & Map → Deploy → Optimise
  policy methodology.

---

## Unresolved (not confirmed this pass — do not state on pages)

- **Firepower 1000-series end-of-sale**: a third-party tracker claims EoS 27 May 2025 with
  Secure Firewall as migration path, but a Cisco community response asserts no EOS/EOL notice
  exists for the 1000-series hardware, and no Cisco notice was located. Say only that the
  Secure Firewall 1200 is the current small-site family.
- **ASA 5585-X LDoS (31 May 2023)** and **5505 LDoS (31 Aug 2022)**: third-party lifecycle
  databases only; the Cisco notices were not fetched (cisco.com blocks automated access).
  Low risk, but attribute to trackers if used.
- **Secure Client perpetual licensing**: whether any perpetual option survives in the current
  ordering guide was not confirmed; describe the change as "Plus/Apex renamed to
  Advantage/Premier, stacking permitted" only.
- **CVSS scores for CVE-2025-20333/20362** and the exact KEV date-added values: not captured;
  say "critical / exploited in the wild, in CISA KEV" without scores.
- **Secure Firewall migration tool coverage of AnyConnect RA VPN and DAP**: tool versions
  have added partial RA-VPN migration over time; the safe verified statement is
  "supported-features-only; SFR module config not converted; unsupported config ignored".
- **Announcement date of the 5506/5508/5516 EOL notices** (the notices were located and the
  last-order/LDoS dates corroborated, but the EOL-announcement milestone dates were not
  extracted): state last-order and LDoS only.
- **"Security beyond L4 usually absent" and the estate-shape description**: field
  observation, no market-share source — keep marked as recommended-practice framing.
- The library page `network-ipsec-asa.html` and Cato's KB cite **RFC 7295** for the
  multiple-traffic-selector behaviour; the IKEv2 specification is RFC 7296. Keep new pages
  silent on the RFC number.
