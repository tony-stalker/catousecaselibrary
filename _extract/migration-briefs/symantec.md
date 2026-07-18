# Symantec (Broadcom) → Cato SASE — Migration Brief

**Purpose:** SE-enablement research for the Use Case Library migration pages.
**Researched:** 18 July 2026 (web sources as of this date). UK English.
**Scope:** Symantec/Blue Coat ProxySG and Advanced Secure Gateway appliances (SGOS, CPL policy), Web Security Service (WSS, now Cloud SWG), CloudSOC CASB, Symantec DLP, SSL Visibility Appliance, Management Center, Reporter. One short section notes the parallel Skyhigh Security (ex-McAfee) pattern.
**Sourcing rule:** every lifecycle claim below carries a source in §6. Items that are field guidance rather than documented fact are marked *(recommended practice)*.

---

## 1. Vendor snapshot

### Corporate trajectory — why these estates are actively seeking exits

- **4 November 2019:** Broadcom completed the acquisition of Symantec's **Enterprise Security business for US$10.7bn** in cash. The consumer business remained behind as NortonLifeLock. The Blue Coat proxy portfolio (Symantec had bought Blue Coat in 2016) came with the deal.
- **30 April 2020:** Broadcom sold the **Symantec Cyber Security Services** business (managed security services, SOCs, ~300 staff) to **Accenture** — the services arm left the vendor within six months of the acquisition.
- **Licensing shake-up:** third-party licensing advisories and channel press report the elimination of perpetual licences in favour of subscription, steep renewal uplifts (figures of 2–4x are reported by licensing consultancies — competitor/advisory-sourced, use with care), the disbanding of the self-service renewal portal, and a deliberate Broadcom focus on the largest global accounts with mid-market customers pushed to channel partners. The channel disruption is documented in trade press from 2020 onward.
- **Rebranding:** under Broadcom, **ProxySG became "Edge Secure Web Gateway (Edge SWG)"** from SGOS 7.4, and **Web Security Service (WSS) became "Cloud Secure Web Gateway (Cloud SWG)"**. Expect customers to use the old names.
- **Hardware exit from dedicated appliances:** the classic ProxySG hardware line has been collapsed. Edge SWG and Content Analysis no longer run directly on dedicated hardware; they run as **virtual machines on the Integrated Secure Gateway (ISG) hypervisor** on the **SSP appliance platform (SSP-S210/S410/S620)** — Broadcom's own material describes consolidating ~30 appliance models down to four.
- Net effect: the proxy estate a customer bought from Blue Coat/Symantec is now a Broadcom infrastructure-software line — services divested, channel narrowed, appliances end-of-life'd, on-prem reporting discontinued. These customers are structurally motivated to consolidate onto a platform, and the renewal date is the forcing function.

### Product lifecycle status (as sourced)

| Product | Status (July 2026, as sourced) |
|---|---|
| ProxySG SG-S200/S400/S500 hardware | Per Broadcom's EOL schedule: units bought before 31 Jul 2017 hit hardware EOL **31 Jul 2022**; later purchases are 5 years from purchase, **not to exceed 31 Oct 2026**; last 1-year support purchase not to exceed 31 Oct 2025. Verify serial-specific dates on the portal. |
| ASG-S200/S400/S500 hardware | Bought before 31 Oct 2018: hardware EOL **31 Oct 2023**; later purchases 5 years from purchase, **not to exceed 30 Apr 2027**. |
| SGOS 7.3 LTR (software) | EOL announced **31 December 2024**; customers have 2 years to upgrade to SGOS 7.4 LTR; limited support/maintenance only through **December 2026**, no new features. |
| SGOS 7.4 LTR / Edge SWG on SSP | Current supported path — GA 8 Jul 2023, running as a VM on ISG/SSP hardware. |
| **Reporter (on-prem)** | **End-of-life announced 1 March 2025 — all on-prem Reporter products.** Broadcom's stated reasons: low demand and third-party SIEM capability. Suggested replacements: Symantec Hosted Reporting or a partner tool (Braxton-Grant ODIN-I). |
| Management Center | Active (v3.3/4.x documentation live); drives Universal Policy Enforcement (UPE) across Edge SWG and Cloud SWG. |
| WSS / Cloud SWG | Active cloud service; connectivity via WSS Agent, IPsec, explicit proxy/PAC (PAC File Management Service), proxy forwarding. |
| CloudSOC CASB | Active — ongoing feature releases through 2025–26 (e.g. Audit discovery-pipeline enhancements from Nov 2025). Version-level EOS notices exist for the SpanVA log-collector appliance. |
| Symantec DLP | Active and strategically retained — DLP 16.1 current, on-prem Enforce architecture; Cloud Detection Service integrates DLP with Cloud SWG/CloudSOC. Customers rarely leave this first. |
| SSL Visibility Appliance (SV800/1800/2800/3800) | Broadcom publishes EOL/lifecycle documents for SSLV hardware and software (KB 233783); the Network Protection EOL policy is 5 years from appliance purchase with 2 years' notice. Pull the serial-specific dates from the portal before quoting. |
| Content Analysis / Malware Analysis | EOL documentation published per model/version (KB 151099); the CAS function now also runs as an ISG application. Verify per estate. |

### Typical deployment you will find on discovery

- **Explicit proxy with PAC files** is the canonical ProxySG/WSS deployment: browser proxy settings or PAC via GPO, with the appliance's FQDN in the proxy configuration for Kerberos to work. Transparent estates use **WCCP** (v1/v2, GRE or L2 forwarding, service groups on Cisco routers/switches) or inline/bridged deployment.
- **Policy is CPL** — Content Policy Language. Most administrators build policy in the **Visual Policy Manager (VPM)**, which generates CPL into the VPM policy file; advanced logic lives as hand-written CPL in the Local (and sometimes Central/Forward) policy files. Decades-old estates typically carry both, in multiple layers with order-dependent evaluation.
- **Proxy-embedded authentication:** IWA realms in **IWA-Direct** (appliance joined to AD) or **IWA-BCAAA** (agent on a domain member server), negotiating Kerberos with NTLM/Basic fallback; transparent deployments authenticate via a virtual URL; downstream devices may consume forwarded user headers.
- **Hybrid on-prem + cloud:** larger estates run **Universal Policy Enforcement (UPE)** — Management Center pushes a single policy, authored against a reference Edge SWG device, to both the appliances and the Cloud SWG tenant.
- **SSL Visibility appliances** feed decrypted traffic to security tools; **Content Analysis** hangs off the proxy for AV/sandboxing; **Reporter** (now EOL) aggregates access logs; **CloudSOC** provides CASB (often via Cloud SWG integration); **Symantec DLP** inspects via ICAP from the proxy and/or the endpoint agent.
- Remote users run the **WSS Agent** (or SEP Web Traffic Redirection) to reach Cloud SWG.

---

## 2. Component → Cato mapping

| Symantec component | Function | Cato equivalent | Notes |
|---|---|---|---|
| ProxySG / ASG / Edge SWG appliances | On-prem SWG: URL filtering, proxying, caching | **Cato SWG / Internet Firewall** in the Cato SASE Cloud | Steering is by **Cato Client (users) and Socket/IPsec (sites)** — transparent, no PAC files, no explicit-proxy settings, no WCCP service groups. All ports and protocols are inspected at the PoP, not just proxied web ports. Cato's **Proxy Configuration Policy** can centrally serve a PAC during co-existence (§4). |
| CPL policy (VPM + Local/Central files) | Web policy logic | **Internet Firewall rules + App Control** on categories, applications, FQDNs, custom categories, users/groups | **Be honest: decades of CPL must be rationalised, not ported.** No automated CPL-to-Cato converter is claimed or sourced. The good news: most CPL volume is dead layers, workarounds for proxy behaviour (auth exemptions, pinned-cert bypasses, WCCP quirks) that simply cease to exist in a transparent model. Follow the PS Export → Review & Map process (§3). |
| WSS / Cloud SWG | Cloud-delivered SWG | **Cato PoP-delivered SWG** | Same cloud idea, different architecture: Cato inspects in a single pass at the PoP that also carries SD-WAN, ZTNA, CASB and DLP — one policy engine, no separate agent/tenant per function. WSS PAC/explicit-proxy and proxy-forwarding steering is replaced by Client/Socket steering. |
| WSS Agent / SEP Web Traffic Redirection | Roaming-user steering to cloud proxy | **Cato Client** | The WSS Agent must be removed at cutover — Broadcom's own KBs document its conflicts with third-party VPN clients (tunnel-in-tunnel, macOS Network Extension clashes). Do not run WSS Agent and Cato Client on the same device (§5). |
| CloudSOC CASB (+ SpanVA collectors) | Shadow-IT audit, inline/API app control | **Cato CASB** (inline + API, shadow-IT dashboard, app risk scores, GenAI catalogue) | CloudSOC Securlets (API mode) map to Cato API CASB scope per app — validate app-by-app coverage during design. SpanVA log-collection appliances are simply not needed: Cato sees the traffic at the PoP. |
| Symantec DLP (Network Prevent for Web/Email, Cloud Detection Service) | Data-in-motion inspection via ICAP/cloud | **Cato DLP** (Data Control policy + Content Profiles) | Cato: 350+ predefined data types, custom regex/keyword types, **EDM**, Microsoft MIP/sensitivity-label matching, OCR on images (with documented format/size limits). Symantec **EDM → Cato EDM**; described content matching → Cato data types. **IDM (document fingerprinting) and VML (trained ML classifiers) have no direct Cato equivalent** — redesign those policies around data types/EDM/MIP labels or retain Symantec DLP for them. |
| Symantec DLP Endpoint (agent) + Discover | Endpoint channels (USB, print, clipboard), data-at-rest scanning | **No direct Cato equivalent** | Cato DLP is enforced at the PoP on traffic in motion. Endpoint-channel DLP and data-at-rest discovery are out of scope — retain the Symantec DLP agent/Discover where mandated (§4, §5). Cato device posture can require the agent to be running. |
| SSL Visibility Appliance (SV series) | Dedicated decrypt-and-feed appliance | **Cato TLS Inspection** at the PoP | Single-pass decryption inside the PoP — no dedicated decrypt appliance, no traffic-steering to a tool farm. Wizard-driven policy, gradual rollout by category/group, Cato CA cert via MDM, block QUIC so traffic is inspectable. Tool-farm feeds (out-of-band copies to IDS/forensics) are not a Cato function — events/logs go to SIEM instead. |
| Content Analysis / Malware Analysis | AV scanning, sandboxing off the proxy | **Cato Anti-Malware / NG Anti-Malware + IPS** at the PoP | Inline scanning without an ICAP hop. Full detonation-sandbox workflows should be scoped honestly against Cato's documented threat-prevention services — do not overclaim. |
| Web Isolation (ex-Fireglass) | Browser isolation for risky sites | **Cato RBI** | Cato lists RBI within its threat-prevention stack; map isolation policies (typically uncategorised/risky categories) to Cato RBI rules and validate the UX in the pilot. |
| Management Center + Reporter | Central management, log reporting | **Cato Management Application (CMA)** — one console for policy, analytics and events | Reporter is **EOL from March 2025** regardless of what the customer decides — its replacement decision is already forced. CMA analytics/events replace day-to-day reporting; long-term retention goes to the customer's SIEM via Cato's integrations. Export historic Reporter data before decommissioning (§5). |
| IWA realms / BCAAA / Auth Connector | Proxy authentication (Kerberos/NTLM) | **Cato Client identity + IdP integration (SCIM/SSO)** | Identity comes from the Client and the identity provider, not from proxy challenges. BCAAA servers, SPNs, virtual URLs and auth-exemption CPL all retire. Inventory anything that consumes forwarded user headers first (§3). |
| Cloud SWG egress IPs / IP-allowlisted SaaS | Stable egress identity | **Cato allocated egress IPs** | Broadcom documents Cloud SWG ingress/egress ranges that third parties allowlist. Each Cato account includes 3 allocated IPs (more purchasable); egress rules pin app traffic to fixed IPs — repoint allowlists wave by wave. |
| Email Security.cloud / SMG | Email hygiene | **No native Cato equivalent** | Scope out explicitly; pair with M365/Google native controls or a dedicated vendor. |
| ProxySG reverse proxy / MACH5 WAN-op | App publishing, WAN optimisation | **Not a Cato SWG use case** | Cato ZTNA covers workforce access to internal apps; a true reverse-proxy/ADC or WAN-op estate needs its own plan. Be upfront. |

---

## 3. Recommended migration path

Anchored to the Cato Professional Services methodology used in current PS engagement decks: **Phase 1 Discovery & Design → Phase 2 Pilot, Build & Initial Rollout → Phase 3 Phased Migration → Phase 4 Optimise & Handover**, with policy work following the PS pattern **Export → Review & Map → Deploy → Optimise**. Symantec-specific actions below; unsourced specifics are *(recommended practice)*.

### Phase 1 — Discovery & Design

1. **Export and rationalise the CPL estate** (PS Export step): pull the VPM, Local, Central and Forward policy files from each appliance (or the UPE reference device via Management Center), plus Cloud SWG portal policy if not in UPE mode. Use **Reporter/Management Center reports and access-log analysis for rule hit data** — which categories, layers and exceptions actually fire — before Reporter is switched off *(hit-data approach is recommended practice; Reporter EOL is documented)*. Classify every layer: business intent (map to Cato), proxy plumbing (dies with the proxy — auth exemptions, WCCP workarounds, pinned-cert SSL bypasses), and dead rules (delete). Expect the mapped set to be a fraction of the CPL line count — that is the value story, not a loss.
2. **Inventory the steering layer** *(recommended practice)*: every PAC file and its GPO/PFMS distribution, hardcoded explicit-proxy settings (browsers, OS images, Java, npm/pip, curl, WPAD), WCCP service groups and the router/switch configs behind them, inline/bridged appliances, proxy-forwarding chains from branch proxies to WSS, and WSS Agent / SEP WTR populations. The PAC/GPO estate is the rollback lever — document it before touching it.
3. **Map proxy-embedded authentication**: IWA realms (Direct vs BCAAA), Kerberos SPNs and virtual URLs, NTLM fallback dependencies, guest/unauthenticated exemptions, and any downstream consumer of forwarded user headers. In Cato, identity comes from the Client + IdP — every consumer of proxy auth needs an identity path, not a mapping *(re-design need is recommended practice; the IWA architecture is documented)*.
4. **Find egress-IP pinning**: SaaS tenant restrictions, partner allowlists and conditional-access rules keyed to Cloud SWG egress ranges (Broadcom publishes them) or to on-prem proxy egress IPs. Plan replacements against Cato allocated egress IPs and per-app egress rules.
5. **Rationalise DLP before mapping** *(recommended practice)*: separate policies by detection tech — described content/regex → Cato data types; **EDM → Cato EDM**; **IDM/VML → redesign or retain Symantec DLP** for those policies. Decide the hybrid interim now: keep the DLP endpoint agent for USB/print/clipboard and Discover for data-at-rest where mandates require; Cato posture can enforce its presence.
6. **Design deliverables**: co-existence architecture (§4), TLS inspection plan (pilot groups/categories, pinned-app bypass list rebuilt from the SSLV/ProxySG bypass lists — not assumed identical), CASB app-by-app mapping from CloudSOC, cohort plan for users, site sequence for Sockets, success criteria per wave.

### Phase 2 — Pilot, Build & Initial Rollout

1. Build the CMA account to best practice (recommended category baselines, admin roles, SIEM integration for the reporting continuity story — this directly answers the Reporter EOL gap).
2. Deploy Sockets/IPsec at pilot and hub sites **in parallel** with the existing proxy path — Cato carries the traffic while the PAC still points browsers at ProxySG/WSS, so users notice nothing (pattern mirrors the PS parallel-connectivity designs for cloud-SWG replacement).
3. Deploy the Cato Client to an IT pilot cohort — **after removing the WSS Agent from those devices** (§5). Validate Internet policy, identity mapping and posture.
4. Roll out the Cato CA certificate fleet-wide ahead of need; enable **TLS Inspection gradually** — test group first, expand by category per the PS phased schedule; block QUIC/GQUIC. Where the SSLV appliance previously fed tools, confirm the SIEM/event feeds satisfy the same stakeholders *(recommended practice)*.
5. Enable **CASB discovery and DLP in monitor mode** early; reconcile Cato DLP monitor events against Symantec DLP incidents to build confidence in the mapped policies *(recommended practice)*.
6. Pilot exit criteria: UX parity, category hit parity on sampled rules, auth/identity correctness for former IWA users, DLP event reconciliation *(recommended practice)*.

### Phase 3 — Phased Migration (cohort cutover)

1. **Users, cohort by cohort — PAC to Client**: per cohort, remove/neutralise the PAC and explicit-proxy settings via GPO, uninstall WSS Agent/SEP WTR, enable the Cato Client with Always-On. The PS deck's migration-group cadence (weekly waves with analysis and tuning between waves) is the template.
2. **Sites in sequence**: cut each site's breakout to the Socket/PoP; unwind WCCP service groups on the routers and retire inline appliances once policy parity is confirmed. UPE estates: freeze Management Center policy edits per wave to avoid drift *(recommended practice)*.
3. **Third-party allowlists**: repoint SaaS tenant restrictions and partner allowlists from Cloud SWG/proxy egress IPs to Cato allocated IPs before the owning cohort flips.
4. **DLP**: convert mapped policies from monitor to block in stages; keep the Symantec DLP endpoint agent live throughout for its exclusive channels.
5. **Reporting continuity**: run CMA/SIEM reporting in parallel with remaining Reporter/Hosted Reporting until stakeholders sign off; then export and archive historic log data *(recommended practice)*.

### Phase 4 — Optimise & Decommission

1. Event-driven tuning (firewall, TLS, CASB, DLP), documentation, admin training, handover to Cato support operations (PS handover step).
2. Decommission: WSS/Cloud SWG tenant, CloudSOC tenant (after API-CASB parity), ProxySG/ASG/ISG appliances, SSLV appliances, Content Analysis, BCAAA servers, Management Center and any residual Reporter instance; reclaim GPO objects, PAC hosting and WCCP router config; align licence non-renewal with the final wave — Broadcom subscription terms and renewal behaviour make the contract end-date the real deadline, so plan the waves backwards from it *(recommended practice)*.
3. Re-evaluate the DLP hybrid: if endpoint-channel and Discover requirements persist, keep a deliberately scoped Symantec DLP footprint; Cato remains the enforcement point for data-in-motion.

---

## 4. Co-existence & rollback

**Why this pairing co-exists cleanly:** Symantec's web security is *explicit* — a PAC, browser setting, WCCP redirect or agent decides what reaches it. Cato's is *transparent* — the Client/Socket owns the path. The two steering planes are independent *(recommended practice, consistent with Cato PS parallel designs)*:

- **Stage A — Cato underneath, Symantec on top:** Sockets/Cato SD-WAN carry site traffic while the PAC/WCCP still steers web traffic to ProxySG or WSS. Cato is routing; Symantec is still the web-policy enforcement point.
- **Stage B — cohort flip:** retire the PAC/explicit settings for the cohort (GPO change), remove the WSS Agent, and the Cato Client/Socket steers traffic to the PoP where Internet Firewall/SWG/TLS/DLP policy applies. Cato's **Proxy Configuration Policy** can centrally manage a transitional PAC for stragglers that still need one.
- **Avoid double TLS inspection:** never decrypt the same flow twice. While a cohort still terminates at ProxySG/SSLV/WSS, scope Cato TLS Inspection away from that cohort; flip inspection ownership at cutover. Rebuild pinned-app bypass lists on the Cato side from the ProxySG/SSLV SSL-intercept exemptions — verify, don't copy blindly *(recommended practice; Cato gradual-rollout guidance is documented)*.
- **Agent exclusivity:** the WSS Agent and the Cato Client should never co-exist on a device — Broadcom's own KBs show the WSS Agent conflicts with third-party tunnels (VPN blocking, tunnel-in-tunnel, macOS Network Extension clashes). Uninstall order is part of the cohort runbook, and the runbook must be reversible.
- **DLP hybrid honesty:** where regulation mandates endpoint DLP channels or data-at-rest discovery, the Symantec DLP agent/Discover stays — alongside the Cato Client — during and possibly after the migration. Lead with this design; it is a scope statement, not a concession.

**Rollback is a configuration event, not a project:** reinstate the PAC/GPO (or WCCP redirect) for the affected cohort, reinstall the WSS Agent where roaming users need it, relax Always-On for that group, and traffic returns to Symantec at next policy refresh. Keep the tenant/appliances licensed and **policy-frozen** until final sign-off so rollback stays available; freeze parallel edits on both platforms during waves *(recommended practice)*.

---

## 5. Gotchas & objection handling

| Friction point | Reality | Handling |
|---|---|---|
| "We have 20 years of CPL — you can't replicate it" | True as stated, and the wrong goal. **No automated CPL-to-Cato converter exists (none is claimed or sourced).** CPL is a proxy-specific language spread across VPM-generated and hand-written files in order-dependent layers; much of it exists to manage the proxy itself (auth exemptions, SSL-intercept bypasses, WCCP quirks). | Rationalise, don't port. Use hit data (Reporter/access logs, while they exist) to find the live subset; classify layers as business intent vs proxy plumbing vs dead. Position the reduction as risk removal — unauditable legacy logic is a liability, and the PS Export → Review & Map step is designed for exactly this. |
| Custom categories and local databases | ProxySG local category databases and WSS custom categories won't transfer. | Export the lists in discovery; rebuild as Cato custom categories/FQDN objects. Budget real time for this — it is mechanical but voluminous *(recommended practice)*. |
| Proxy-embedded auth (IWA/BCAAA/Kerberos) | Kerberos SPNs, virtual URLs, NTLM fallback and forwarded user headers all die with the proxy. | Identity moves to the Cato Client + IdP (SCIM/SSO). Inventory every downstream consumer of proxy auth in Phase 1; anything reading user headers needs a redesign, not a mapping. |
| WSS Agent conflicts | Broadcom's KBs document WSS Agent clashes with VPN clients (blocked tunnels, tunnel-in-tunnel, macOS Network Extension conflicts). The same class of risk applies to running it alongside any other tunnel agent. | Never run WSS Agent and Cato Client together — uninstall WSS Agent/SEP WTR in the cohort runbook before enabling the Client, and script the reverse for rollback. |
| Reporter data retention | On-prem Reporter is EOL (announced 1 Mar 2025). Historic web-usage data needed for HR/compliance/legal cases lives in Reporter databases and access logs that will not migrate anywhere. | Export and archive required history before decommissioning; land future logs in the customer's SIEM from day one of the Cato build; confirm the Cato analytics retention available under the customer's licence against their reporting obligations *(recommended practice)*. |
| Egress-IP-pinned SaaS and partners | Conditional access and partner allowlists keyed to Cloud SWG's published ranges (or appliance egress IPs) break silently at cutover. | Enumerate in Phase 1; move to Cato allocated egress IPs with per-app egress rules before the owning cohort flips. |
| "Symantec DLP is deeper than Cato DLP" | Partly true. Symantec DLP has IDM document fingerprinting, VML trained classifiers, endpoint channels and Discover data-at-rest scanning. Cato DLP covers 350+ data types, custom types, EDM, MIP labels and OCR — enforced inline across all traffic at the PoP. | Don't contest depth; reframe scope. Map the *actually used* policies; EDM → EDM; IDM/VML → redesign or retain hybrid; endpoint/Discover → retain where mandated, with Cato posture requiring the agent. Test OCR limits against real policies in the pilot. |
| Sandboxing (Content Analysis / Malware Analysis) | The proxy fed files to CAS/MA for detonation. | Map to Cato's documented anti-malware/NGAM and IPS honestly; where a formal detonation-sandbox requirement exists, scope it explicitly rather than overclaiming *(recommended practice)*. |
| Caching and bandwidth savings | SGOS was also a cache; some networks credit it with bandwidth savings. | Modern TLS-everywhere traffic and CDN delivery have eroded forward-proxy cache value; validate actual byte-hit rates from the appliance stats before treating this as a loss *(recommended practice)*. |
| Reverse proxy / MACH5 | Some ProxySG estates also do reverse proxying or WAN-op. | Out of Cato SWG scope. Workforce access to internal apps maps to Cato ZTNA; true reverse-proxy/ADC workloads need their own successor plan. Say so early. |
| "Broadcom hasn't EOL'd the cloud service" | True — Cloud SWG, CloudSOC and DLP remain active. The pressure is structural: hardware EOL waves (S-series dates above), SGOS 7.3 sunset, Reporter EOL, services sold to Accenture, subscription-only licensing with reported steep uplifts, and a vendor whose stated model concentrates on the largest accounts. | Anchor on the customer's own renewal quote and appliance EOL letters — never claim an EOL you cannot cite. The Reporter EOL and hardware dates are concrete and sourced; use them. |
| UPE estates | Policy is authored on a reference Edge SWG and pushed to cloud — the appliance is the source of truth even for the cloud tenant. | Export from the reference device via Management Center; treat the UPE policy as the single CPL corpus to rationalise. Freeze it per migration wave. |

---

## 5a. Skyhigh Security (ex-McAfee) — same displacement pattern

Skyhigh Security was spun out of McAfee Enterprise by Symphony Technology Group in **March 2022** (STG bought McAfee Enterprise for US$4bn in 2021; the SIEM/EDR side became Trellix, the SSE side became Skyhigh). The estate you meet is the same shape as Symantec's: **on-prem Secure Web Gateway appliances (ex-McAfee Web Gateway/Webwasher heritage) steered by PAC/explicit proxy or WCCP, a cloud SWG, Skyhigh CASB (ex-MVISION Cloud/Skyhigh Networks) and DLP** — under an owner that has been through carve-outs and rebrands. The Cato displacement play is identical: transparent Client/Socket steering replaces PAC/WCCP, PoP SWG/TLSi replaces appliance and cloud proxies, Cato CASB/DLP replaces the bolt-ons, and the same rationalise-don't-port rule applies to MWG rulesets (its rule-trace engine is as bespoke as CPL). Re-use §3–§5 of this brief; only the export tooling and product names change. *(Deployment-pattern parallels are recommended practice; the corporate history is sourced in §6.)*

---

## 5b. SE discovery checklist (first call) *(recommended practice)*

1. **Which components are actually deployed** — ProxySG/ASG models and SGOS versions, ISG/SSP, WSS/Cloud SWG, UPE, CloudSOC, DLP (network/endpoint/Discover), SSLV, Content Analysis, Reporter, Management Center? Renewal dates and any Broadcom EOL letters in hand?
2. **How is web traffic steered** — PAC (GPO or PFMS), explicit browser settings, WPAD, WCCP (which routers/switches), inline, proxy forwarding, WSS Agent, SEP WTR?
3. **Where does policy live** — VPM only, or hand-written CPL in Local/Central files? UPE reference device? Roughly how many layers/rules, and when was it last audited?
4. **What consumes proxy authentication** — IWA-Direct or BCAAA, Kerberos SPNs, virtual URLs, forwarded user headers, per-user reporting tied to proxy auth?
5. **Which third parties allowlist proxy/Cloud SWG egress IPs** — SaaS tenant restrictions, conditional access, partner firewalls?
6. **DLP reality check** — policies that actively generate triaged incidents; which use EDM vs IDM/VML; which endpoint channels are regulator-mandated; who owns incident workflow?
7. **TLS inspection today** — SSLV and/or SGOS SSL intercept scope, bypass lists, certificate distribution already in place?
8. **Reporting obligations** — who consumes Reporter output, what history must be retained, what replaced (or will replace) Reporter after its EOL?
9. **Remote access & agents** — WSS Agent population, other tunnel agents on the endpoint, MDM available for Client rollout?
10. **Out-of-scope workloads** — email security, reverse proxy, WAN-op — that need their own successor plan?

Outputs feed straight into Phase 1: CPL rationalisation workbook (Q3), steering inventory (Q2), auth register (Q4), allowlist register (Q5), DLP workbook (Q6), TLS pilot design (Q7), reporting-continuity plan (Q8).

---

## 6. Sources

**Broadcom/Symantec corporate & licensing**
- Broadcom completes acquisition of Symantec Enterprise Security (4 Nov 2019, US$10.7bn): https://investors.broadcom.com/news-releases/news-release-details/broadcom-completes-acquisition-symantec-enterprise-security and https://www.prnewswire.com/news-releases/broadcom-completes-acquisition-of-symantec-enterprise-security-business-300950721.html
- Accenture completes acquisition of Symantec Cyber Security Services (30 Apr 2020): https://newsroom.accenture.com/news/2020/accenture-completes-acquisition-of-broadcoms-symantec-cyber-security-services-business
- Channel disruption after the acquisition (ARN): https://www.arnnet.com.au/article/670495/partners-left-pick-up-pieces-after-symantec-acquisition/
- Licensing-advisory commentary on subscription shift and renewal uplifts (advisory-sourced; use with care): https://redresscompliance.com/symantec-enterprise-software-licensing-under-broadcom-a-cio-playbook.html

**Lifecycle & EOL (Broadcom)**
- End of life and product lifecycle for Edge SWG (ProxySG) and ASG — SGOS 7.3 EOL 31 Dec 2024, hardware date tables in attached PDF: https://knowledge.broadcom.com/external/article/151102/end-of-life-and-product-lifecycle-for-pr.html
- Network Protection End-of-Life Policy (5-year appliance policy, 2 years' notice): https://knowledge.broadcom.com/external/article/151118/network-protection-endoflife-policy.html
- **End of Life for Reporter (announcement 1 Mar 2025; all on-prem Reporter EOL; Hosted Reporting/ODIN-I alternatives):** https://knowledge.broadcom.com/external/article/386552/end-of-life-for-reporter.html
- End of life and product lifecycle for SSL Visibility hardware and software: https://knowledge.broadcom.com/external/article/233783/end-of-life-and-product-lifecycle-for-ss.html
- Content Analysis / Malware Analysis EOL documents: https://knowledge.broadcom.com/external/article/151099/content-analysis-endoflife-documents.html
- Product lifecycle portal (serial/version-specific dates): https://knowledge.broadcom.com/external/article/150550/product-lifecycle-and-end-of-life-inform.html
- Secure Web Gateway appliances (SSP platform; consolidation of appliance models; Edge SWG as ISG-hosted VM): https://docs.broadcom.com/doc/secure-web-gateway-appliances and https://knowledge.broadcom.com/external/article/219820/how-to-upgrade-edge-swg-proxysg-or-conte.html
- CloudSOC SpanVA version EOS notices: https://support.broadcom.com/web/ecx/support-content-notification/-/external/content/product-advisories/End-of-Service-dates-for-versions-of-Symantec-CloudSOC-SpanVA/16148

**Symantec product architecture (techdocs.broadcom.com)**
- Edge SWG (formerly ProxySG) product page: https://www.broadcom.com/products/cybersecurity/network/web-protection/proxy-sg-and-advanced-secure-gateway
- Cloud SWG (formerly WSS) product page and docs: https://www.broadcom.com/products/cybersecurity/network/web-protection/cloud-secure-web-gateway and https://techdocs.broadcom.com/us/en/symantec-security-software/web-and-network-security/cloud-swg/help.html
- ProxySG 7.3 Content Policy Language Reference (PDF): https://techdocs.broadcom.com/content/dam/broadcom/techdocs/us/en/dita/symantec-security-software/web-and-network-security/edge-swg/generated-pdfs/ProxySG_CPL_73.pdf
- Writing policy using CPL (VPM vs Local/Central/Forward policy files): https://techdocs.broadcom.com/us/en/symantec-security-software/web-and-network-security/edge-swg/7-3/overview4/writing_CPL.html
- How to write rules using CPL: https://knowledge.broadcom.com/external/article/166537/how-to-write-rules-using-cpl-with-exampl.html
- Introduction to IWA on ProxySG (IWA-Direct/BCAAA, Kerberos/NTLM, virtual URL): https://knowledge.broadcom.com/external/article/166614/introduction-to-working-with-iwa-on-the.html
- WCCP Reference Guide (v1/v2, GRE/L2, service groups): https://techdocs.broadcom.com/content/dam/broadcom/techdocs/us/en/dita/symantec-security-software/web-and-network-security/edge-swg/generated-pdfs/WCCP_Ref_Guide.pdf
- Cloud SWG connectivity matrix (IPsec, explicit proxy, proxy forwarding, agents): https://techdocs.broadcom.com/us/en/symantec-security-software/web-and-network-security/cloud-swg/help/conn-matrix.html
- Cloud SWG PAC File Management Service: https://techdocs.broadcom.com/us/en/symantec-security-software/web-and-network-security/cloud-swg/help/conn-matrix/conn-about-explicit/conn-pfms.html
- Cloud SWG ingress/egress IP addresses: https://knowledge.broadcom.com/external/article/167174/cloud-swg-formerly-wss-ingress-and-egres.html
- WSS Agent blocks enterprise VPN connection: https://knowledge.broadcom.com/external/article/169389/wss-agent-client-blocks-enterprise-vpn-c.html
- VPN client configuration with WSSA/SEP/ESA (split-tunnel requirement, no tunnel-in-tunnel): https://knowledge.broadcom.com/external/article/265736/vpn-client-configuration-with-wssa-or-se.html
- VPN routing inconsistencies (macOS Network Extension conflicts): https://knowledge.broadcom.com/external/article/279160/inconsistencies-in-network-routing-with.html
- Universal Policy Enforcement (Management Center + reference device across Edge/Cloud SWG): https://techdocs.broadcom.com/us/en/symantec-security-software/web-and-network-security/management-center/3-3/about_upe_co.html and https://knowledge.broadcom.com/external/article/259547/universal-policy-enforcement-upe-101-for.html
- CloudSOC docs and what's new (active development): https://techdocs.broadcom.com/us/en/symantec-security-software/information-security/symantec-cloudsoc/cloud.html and https://techdocs.broadcom.com/us/en/symantec-security-software/information-security/symantec-cloudsoc/cloud/cloudsoc_whatsnew.html
- Symantec DLP 16.1 Help Center: https://techdocs.broadcom.com/us/en/symantec-security-software/information-security/data-loss-prevention/16-1.html
- Symantec Cloud DLP integration with Cloud SWG (UPE): https://knowledge.broadcom.com/external/article?legacyId=TECH254125
- SSL Visibility appliance guides (SV series): https://techdocs.broadcom.com/us/en/symantec-security-software/web-and-network-security/hardware-appliances/1-0/ssl-visibility-hardware-appliances.html

**Skyhigh Security (parallels)**
- Skyhigh Security emerges from McAfee Enterprise SSE (22 Mar 2022): https://www.securityweek.com/sse-company-skyhigh-security-emerges-mcafee-enterprise/ and https://www.techtarget.com/searchsecurity/news/252514921/STG-launches-Skyhigh-Security-from-McAfee-cloud-assets

**Cato equivalents & methodology**
- Cato platform overview (SSE 360: SWG, IPS, anti-malware, DNS Security, RBI, CASB, DLP, ZTNA): https://www.catonetworks.com/platform/
- Managing the Internet Firewall Policy: https://support.catonetworks.com/hc/en-us/articles/4413273487633-Managing-the-Internet-Firewall-Policy
- Recommended Internet/WAN firewall baselines: https://support.catonetworks.com/hc/en-us/articles/360004274777-Recommendations-for-Internet-and-WAN-Firewall-Policies
- TLS Inspection best practices (gradual rollout, cert, QUIC): https://support.catonetworks.com/hc/en-us/articles/360007713437-Best-Practices-for-TLS-Inspection
- TLS Inspection Configuration Wizard: https://support.catonetworks.com/hc/en-us/articles/23739970551453-Using-the-TLS-Inspection-Configuration-Wizard
- Proxy Configuration Policy (centralised PAC during co-existence): https://support.catonetworks.com/hc/en-us/articles/16231563119901-Centralized-Management-of-Proxy-Configuration-Proxy-Configuration-Policy
- Unified CASB: https://support.catonetworks.com/hc/en-us/articles/4405498289053-What-is-the-Unified-CASB-Solution
- What is the Cato DLP Service: https://support.catonetworks.com/hc/en-us/articles/5606495447197-What-is-the-Cato-DLP-Service
- DLP Content Profiles (incl. OCR scope/limits): https://support.catonetworks.com/hc/en-us/articles/5352915107869-Creating-DLP-Content-Profiles
- Exact Data Matching for DLP: https://support.catonetworks.com/hc/en-us/articles/16676236807453-Working-with-Exact-Data-Matching-EDM-for-DLP
- Predefined data types (350+): https://support.catonetworks.com/hc/en-us/articles/32901519994781-Working-with-Predefined-Data-Types-for-DLP
- Cato ZTNA solution: https://support.catonetworks.com/hc/en-us/articles/6266293423773-What-is-Cato-s-ZTNA-Solution
- Cato Client capabilities: https://support.catonetworks.com/hc/en-us/articles/22836322246685-Understanding-the-Capabilities-of-the-Cato-Client
- Allocated egress IPs: https://support.catonetworks.com/hc/en-us/articles/4413273467153-Allocating-IP-Addresses-for-the-Account
- Egress rules per app: https://support.catonetworks.com/hc/en-us/articles/360000163245-How-to-Configure-a-Network-Rule-to-Egress-Traffic
- Understanding Rollout to the Cato Cloud: https://support.catonetworks.com/hc/en-us/articles/11968052021277-Understanding-Rollout-to-the-Cato-Cloud
- Deploying Cato SASE step by step: https://www.catonetworks.com/blog/deploying-cato-sase-step-by-step/
- SASE project planning guide: https://www.catonetworks.com/blog/the-path-to-sase-a-project-planning-guide/
- Internal: Cato PS deck digest (phases 1–4, migration groups, TLS inspection phases) — `_extract/andy-professional-services-deck-combined-slides-2026.md`; Zscaler-to-Cato PS migration deck (Export→Map→Deploy→Optimise, parallel backhaul patterns) — `_extract/zscaler-to-cato-2025-q3.md`
