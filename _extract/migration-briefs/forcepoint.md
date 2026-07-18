# Forcepoint → Cato SASE — Migration Brief

**Purpose:** SE-enablement research for the Use Case Library migration pages.
**Researched:** 17 July 2026 (web sources as of this date). UK English.
**Scope:** Forcepoint Web Security (cloud and on-prem SWG, ex-Websense), Forcepoint ONE SSE (ex-Bitglass), Forcepoint NGFW / Secure SD-WAN (ex-Stonesoft), Forcepoint DLP, legacy VPN remote access.
**Sourcing rule:** every lifecycle claim below carries a source in §6. Items that are field guidance rather than documented fact are marked *(recommended practice)*.

---

## 1. Vendor snapshot

### Corporate trajectory — why customers are re-evaluating

- Forcepoint began as Websense (NetPartners, 1994; renamed 1999), was acquired by Vista Equity (2013), then Raytheon (80% stake, May 2015), which bought Intel Security's **Stonesoft NGFW and Sidewinder proxy firewall** businesses (October 2015, US$389m) and merged the lot as **Forcepoint** in January 2016.
- **Francisco Partners** acquired Forcepoint from Raytheon/RTX in January 2021.
- Forcepoint acquired **Bitglass** (SSE: CASB/SWG/ZTNA) in October 2021 — this became **Forcepoint ONE**.
- **July–October 2023:** Forcepoint sold its **Global Governments and Critical Infrastructure (G2CI)** business to TPG for **US$2.45bn** (agreed 10 July 2023, completed 2 October 2023). The divested unit rebranded as **Everfox** in January 2024. Forcepoint's stated intent was to focus the remaining commercial business on SASE/Forcepoint ONE and data security.
- **March 2025:** Forcepoint announced the acquisition of **Getvisibility** (AI-native DSPM/DDR).
- **29 April 2025:** Forcepoint launched **Forcepoint Data Security Cloud** — an AI-powered platform unifying DSPM, DDR, Enterprise DLP, SaaS security, web security and email security. The former Forcepoint ONE SSE documentation now sits under the branding **"Forcepoint Data Security Cloud | SSE"**.
- Net effect: Forcepoint has publicly repositioned as an **AI-powered data-security company**. Networking and web-proxy infrastructure are no longer the centre of its strategy — that is the conversation-opener for SASE displacement.

### Check Point rumour — verification result

The suggestion that Forcepoint's NGFW business was divested to Check Point (reportedly announced 2025) **could not be verified from any public source as of July 2026**. Forcepoint's newsroom, Check Point's acquisition history (Perimeter 81 2023, Cyberint 2024, Veriti 2025) and industry coverage show no such transaction, and comparison sites still treat the two NGFWs as competing products. **Do not state this in customer-facing material.** What *is* verifiable: Forcepoint publishes End-of-Sale/End-of-Life notices for NGFW appliance models on its support hub (articles 000016021 and 000016018 — titled "End of Sale and End of Life for Next Generation Firewall…"; the portal is JavaScript-rendered and the notice text could not be retrieved for citation, so quote it only after pulling the article via a logged-in browser).

### Product lifecycle status (as sourced)

| Product | Heritage | Status (July 2026, as sourced) |
|---|---|---|
| Web Security on-prem (v8.5.x) | Websense/TRITON | Still supported — v8.5.6 (Sep 2024) current; G2 appliances EOL Mar 2018, G3 EOL Nov 2018; 8.5.4+ requires newer hardware. Slow-cadence maintenance mode in practice. |
| Web Security Cloud | Websense cloud proxy | Still operating (documentation live); PAC-file/explicit-proxy service model. No public EOL found. |
| Forcepoint ONE SSE | Bitglass (2021) | Active; rebranded under "Forcepoint Data Security Cloud \| SSE" (April 2025 platform launch). |
| NGFW / Secure SD-WAN | Stonesoft (2015) | Still marketed; strict lifecycle — only one major release back supported; model-level EoS/EoL notices published. No verifiable divestiture. |
| DLP suite | Websense/TRITON DLP | Strategic core — actively invested (Getvisibility, Data Security Cloud, AI Mesh). Customers rarely leave this first. |
| Email Security on-prem | Websense | Third-party commentary (Trustifi, TrustLayer) reports an announced end-of-life; exact dates sit behind Forcepoint's support portal — verify before quoting. Evidence of portfolio pruning around the data-security pivot. |
| Legacy remote-access VPN | NGFW VPN client / SSL VPN | Tied to the NGFW/SMC stack; ZTNA successor is Forcepoint ONE. |

### Typical deployment you will find on discovery

- **Explicit proxy with PAC files** is the canonical Forcepoint web-security deployment, on-prem and cloud: browsers steered by a PAC file distributed via **GPO**, with policy-specific PAC URLs for roaming users, and guidance to permission-lock the PAC so users cannot bypass it. Intranet traffic goes direct; HTTP/HTTPS/FTP goes to the proxy.
- On-prem estates use **Content Gateway** in explicit or transparent (WCCP/policy-routing) mode, often chained with the Hybrid Module to the cloud service.
- Forcepoint ONE (ex-Bitglass) adds agentless reverse-proxy CASB, forward-proxy SWG (also PAC/explicit-proxy capable) and ZTNA.
- NGFW estates are centrally managed by **SMC (Security Management Center)** with multi-link SD-WAN and the NGFW VPN client for remote access.
- DLP estates: management server + protectors/endpoint agents, with **fingerprinting (N-gram), machine-learning classifiers (positive/negative training sets) and an OCR server** — plus data-at-rest discovery. This is genuine enterprise-DLP depth; treat it with respect.

---

## 2. Component → Cato mapping

| Forcepoint component | Function | Cato equivalent | Notes |
|---|---|---|---|
| Web Security Cloud / Web Security on-prem (Content Gateway) | SWG: URL filtering, web policy, proxy | **Cato SWG / Internet Firewall** in the Cato SASE Cloud | Steering is by **Cato Client (users) and Socket/IPsec (sites)** — transparent, no PAC files or explicit-proxy settings to maintain. All ports/protocols inspected, not just proxied web ports. Cato's **Proxy Configuration Policy** can centrally serve a PAC during co-existence (see §4). |
| Category / URL policy (Websense categories) | Allow/block/quota by category | **Internet Firewall rules** on categories, custom categories, applications, FQDNs | Cato publishes recommended Block and Prompt category baselines. Websense "quota/confirm" actions map to Cato **Prompt**; time-based quota browsing has no direct equivalent — validate. *(recommended practice on the quota point)* |
| Content Gateway TLS decryption | HTTPS inspection | **Cato TLS Inspection** (account-level policy, single-pass at the PoP) | Wizard-driven; Cato CA cert deployed to devices; best practice is a gradual rollout starting with a test group; block QUIC/GQUIC so traffic is inspectable. |
| Forcepoint ONE SWG/CASB/ZTNA (ex-Bitglass) | Cloud-delivered SSE | **Cato SSE 360**: SWG + **Cato CASB** (inline + API, shadow-IT dashboard, app risk scores, GenAI app catalogue) + **Cato ZTNA** | Same PoP-delivered model, but one policy engine and console rather than a bolt-on acquisition. Forcepoint ONE's agentless reverse-proxy CASB pattern maps to Cato's inline/API CASB plus browser-extension access for unmanaged devices. |
| Forcepoint DLP (network + cloud channels) | Data-in-motion inspection | **Cato DLP** (Data Control policy + Content Profiles) | Cato: 350+ predefined data types, custom regex/keyword data types, **Exact Data Matching (EDM)**, Microsoft MIP/sensitivity-label matching, **OCR** on images (PNG/JPEG/TIFF/BMP/PNM/WEBP, 10 KB–50 MB; OCR is **not** supported for EDM profiles). Honest gaps in §5. |
| Forcepoint DLP Endpoint agent | Endpoint channels: USB/removable media, print, clipboard, apps | **No direct Cato equivalent** | Cato DLP is enforced in the cloud on traffic traversing the PoP. Endpoint-channel DLP (USB, print, clipboard) is out of scope — retain the Forcepoint endpoint agent or another endpoint DLP where those channels are mandated (see §3 phase 1 and §5). Cato device posture can check for a running endpoint-DLP app as a connection condition. |
| Forcepoint DLP Discover / DSPM | Data-at-rest discovery | **No Cato equivalent** | Out of SASE scope; position Cato as the data-in-motion layer alongside a data-at-rest tool. |
| NGFW (ex-Stonesoft) + Secure SD-WAN | Branch firewall, IPS, VPN, multi-link | **Cato Socket** (site appliance) + **FWaaS** (Internet + WAN Firewall), **IPS, NGAM**, Cato SD-WAN | Firewalling, IPS and anti-malware move to the PoP; the Socket does last-mile SD-WAN and HA. SMC hierarchical/template policies flatten into CMA ordered rulebases — expect rationalisation, not 1:1 import. |
| SMC (Security Management Center) | Central firewall management | **Cato Management Application (CMA)** | Single console/API for networking and security; no separate manager to host, patch or license. |
| NGFW VPN client / legacy SSL VPN | Remote-access VPN | **Cato ZTNA** via the Cato Client (Windows/macOS/iOS/Android/Linux) | Identity + MFA + continuous **device posture** (AV, disk encryption, patches, firewall, certificate); **Always-On policy** prevents bypass; MDM-based mass deployment. Clientless browser access for third parties/BYOD. |
| Cloud proxy egress IPs / IP-allowlisted SaaS | Stable egress identity | **Cato allocated egress IPs** | Each account includes 3 allocated IPs (more purchasable); egress rules pin traffic to fixed IPs per app — used to migrate third-party allowlists off Forcepoint's proxy ranges. |
| Email Security | Email hygiene/DLP channel | **No native Cato equivalent** | Keep/replace separately (e.g. M365 native + its DLP). Do not position Cato as an email security replacement. |

---

## 3. Recommended migration path

Anchored to the Cato Professional Services methodology used in current PS engagement decks: **Phase 1 Discovery & Design → Phase 2 Pilot, Build & Initial Rollout → Phase 3 Phased Migration → Phase 4 Optimise & Handover**, with policy work following the PS pattern **Export → Review & Map → Deploy → Optimise**. Forcepoint-specific actions below; unsourced specifics are *(recommended practice)*.

### Phase 1 — Discovery & Design

1. **Inventory the steering layer** *(recommended practice)*: every PAC file and its GPO distribution points, policy-specific PAC URLs, explicit-proxy settings hardcoded in apps and OS images (browsers, Java, npm/pip, curl proxies, WPAD), Content Gateway transparent-mode hooks (WCCP/PBR), and Hybrid Module chaining. The PAC estate is the rollback lever — document it before touching it.
2. **Find egress-IP pinning** *(recommended practice)*: SaaS tenant restrictions, partner allowlists and conditional-access rules keyed to Forcepoint cloud proxy or on-prem egress IPs. Plan replacements against Cato allocated IPs and egress rules.
3. **Identify proxy-embedded authentication** *(recommended practice)*: NTLM/Kerberos proxy auth, X-Authenticated-User headers consumed by downstream tools, per-user policy driven by proxy auth. In Cato, identity comes from the Client/identity-provider integration, not proxy challenges — confirm every consumer of proxy auth has an identity path.
4. **Export policy** (PS pattern): Web Security categories/actions/exceptions; NGFW SMC rulebases, NAT, VPN topologies; Forcepoint ONE SWG/CASB/ZTNA policies. Review & map to Internet Firewall, WAN Firewall, Application Control/CASB, Threat Prevention and TLS Inspection — clean up and gap-analyse against Cato best practice rather than lift-and-shift.
5. **Rationalise DLP before mapping** *(recommended practice)*: age out unused policies; classify remaining classifiers — dictionary/regex/predefined types map directly to Cato data types; structured fingerprints re-implement as **Cato EDM**; unstructured document fingerprints and ML classifiers have **no direct Cato equivalent** — redesign around data types/EDM/MIP labels or explicitly retain Forcepoint for those policies. Decide the **hybrid interim** now: where the Forcepoint DLP endpoint agent covers channels Cato's network DLP does not (USB, print, clipboard, data-at-rest discovery), keep the agent running alongside the Cato Client during (and possibly after) transition. This is an honest scope statement, not a weakness to hide.
6. **Design deliverables**: co-existence architecture (§4), TLS inspection plan with pilot categories/groups, ZTNA access design, cohort plan for users, site sequence for sockets, success criteria per wave.

### Phase 2 — Pilot, Build & Initial Rollout

1. Build the CMA account to best practice (categories/service restrictions first, SIEM integration, admin roles).
2. Deploy Sockets/IPsec tunnels at pilot and hub sites **in parallel** with existing NGFW/proxy egress — routed ranges or VLAN termination let Cato carry traffic while Forcepoint still enforces web policy for non-pilot users (pattern mirrors the PS parallel-connectivity designs used for cloud-SWG replacement).
3. Deploy the Cato Client to an IT pilot cohort; validate Internet policy, ZTNA access to key apps, and posture rules.
4. Roll out the Cato CA certificate fleet-wide ahead of need; enable **TLS Inspection gradually** — test group first, then expand by URL category (the PS schedule runs TLS inspection in numbered phases); block QUIC/GQUIC via Internet Firewall.
5. Enable **CASB discovery and DLP in monitor mode** early — shadow-IT and data-flow visibility de-risks later enforcement and gives the DLP mapping real traffic to validate against.
6. Pilot exit criteria: user experience parity, policy hit parity on sampled categories, DLP monitor events reconciled against Forcepoint incidents *(recommended practice)*.

### Phase 3 — Phased Migration (cohort cutover)

1. **Users, cohort by cohort**: remove/modify the PAC via GPO for the cohort, enable the Cato Client with **Always-On**, confirm the Forcepoint agent/proxy settings no longer steer web traffic. The PS deck's "SDP Migration Groups 1–4" cadence (weekly waves with posture analysis and fine-tuning between waves) is the template.
2. **Sites in sequence**: cut each site's Internet breakout to the Socket/Cato PoP; retire local NGFW/Content Gateway once WAN and Internet policy are confirmed on Cato. Convert temporary routed-range designs to VLAN termination as firewalls retire.
3. **Third-party allowlists**: repoint SaaS tenant restrictions and partner allowlists from Forcepoint egress IPs to Cato allocated IPs per app, wave by wave *(sequencing is recommended practice; the IP feature is documented)*.
4. **Remote access**: retire the NGFW VPN gateway per region once its user population is on Cato ZTNA; keep it dark-standby until sign-off *(recommended practice)*.
5. Convert DLP policies agreed in Phase 1 from monitor to block in stages; keep Forcepoint DLP endpoint enforcement live throughout for its exclusive channels.

### Phase 4 — Optimise & Decommission

1. Event-driven tuning (firewall, TLS, CASB, DLP), documentation and admin training; transition to Cato support operations (PS handover step).
2. Decommission: Forcepoint cloud tenant, Content Gateway/V-Series appliances, SMC and NGFW estate, VPN gateways; reclaim GPO objects and PAC hosting; time licence non-renewal to the last cutover wave — Forcepoint licensing terms are non-cancellable with reinstatement fees for lapsed support, so align the contract end-date with the plan, not vice versa.
3. Re-evaluate the DLP hybrid: if endpoint-channel and discovery requirements persist, keep a slimmed Forcepoint (or alternative endpoint DLP/DSPM) licence deliberately scoped to those channels; Cato remains the enforcement point for all data-in-motion.

---

## 4. Co-existence & rollback

**Why this pairing co-exists cleanly:** Forcepoint's web security is *explicit* (PAC/proxy settings decide what reaches it); Cato's is *transparent* (the Client/Socket owns the path). The two steering planes are independent, so you can run both without conflict *(recommended practice, consistent with Cato PS parallel designs)*:

- **Stage A — Cato underneath, Forcepoint on top:** Sockets/Cato SD-WAN carry site traffic; the PAC still points browsers at Forcepoint (cloud or Content Gateway). Cato is routing; Forcepoint is still the web-policy enforcement point. Users notice nothing.
- **Stage B — cohort flip:** per cohort, retire the PAC (GPO change) and let the Cato Client/Socket steer web traffic to the PoP, where Internet Firewall/SWG/TLS/DLP policy now applies. Cato's **Proxy Configuration Policy** can centrally manage the PAC URL during the interim for devices that still need one.
- **Interim backhaul** *(recommended practice, mirrors PS cloud-SWG replacement patterns)*: where the cloud proxy must persist briefly for a subset, keep IPsec/GRE backhaul to it from the existing firewall or via parallel VLAN termination, with temporary routed ranges in Cato policy — explicitly temporary, removed at wave completion.

**Avoid double TLS inspection:** never decrypt the same flow twice. While a cohort's web traffic still terminates at Forcepoint (Content Gateway or cloud), bypass Cato TLS Inspection for that traffic (or scope Cato TLSi to migrated cohorts only); flip inspection ownership per cohort at cutover. Certificate-pinned app bypass lists must be rebuilt on the Cato side from the Forcepoint bypass list, not assumed identical *(recommended practice; Cato TLSi gradual-rollout guidance is documented)*.

**Rollback is a configuration event, not a project:** reinstate the PAC/GPO (or re-enable explicit proxy settings) for the affected cohort, relax the Always-On policy for that group, and traffic returns to Forcepoint at next policy refresh. Keep the Forcepoint tenant/appliances licensed and policy-frozen until final sign-off so rollback stays available; freeze parallel policy edits on both platforms during waves to avoid drift *(recommended practice)*.

---

## 5. Gotchas & objection handling

| Friction point | Reality | Handling |
|---|---|---|
| "Forcepoint DLP is deeper than Cato DLP" | Partly true. Forcepoint has N-gram document fingerprinting, trainable ML classifiers, an OCR server with language packs, endpoint channels and data-at-rest discovery. Cato DLP covers 350+ data types, custom types, EDM, MIP labels and OCR on images — enforced inline across all traffic, not just proxied web. | Do not contest the depth claim; reframe scope. Map each *actually used* Forcepoint policy (most estates run far fewer than they own — verify in discovery). Structured fingerprints → EDM. Unstructured fingerprints/ML → redesign or retain hybrid. Cato's OCR limits (image formats, 10 KB–50 MB, no OCR with EDM) must be tested against real policies in the pilot, not asserted. |
| Endpoint DLP channels (USB, print, clipboard) | Cato enforces DLP at the PoP on traffic in motion; it is not an endpoint DLP agent. | Honest hybrid: keep the Forcepoint endpoint agent (or successor) for those channels; Cato device posture can require it to be running before granting access. Regulated industries (financial services, health, legal) often have hard mandates here — lead with the hybrid design, not a swap. |
| Regulated-industry DLP dependencies | Incident-workflow, forensics and compliance-reporting processes are often built around Forcepoint's DLP incident manager. | Map incident export (Cato events → SIEM/SOAR) in Phase 1; run both incident streams in parallel during monitor mode to build auditor confidence *(recommended practice)*. |
| Proxy-embedded authentication | NTLM/Kerberos proxy auth and X-Authenticated-User headers disappear when the proxy does. | Identity moves to the Cato Client + IdP (SCIM/SSO). Inventory every downstream consumer of proxy auth in Phase 1; anything reading proxy headers needs a redesign, not a mapping. |
| PAC stragglers and hardcoded proxies | Apps and build tooling with hardcoded proxy settings keep sending traffic to a proxy that no longer exists. | Sweep for hardcoded proxy config in discovery; Cato's Proxy Configuration Policy can serve a transitional PAC; final state is no PAC at all. *(recommended practice)* |
| SaaS/partners pinned to Forcepoint egress IPs | Cutover silently breaks conditional access and allowlists. | Enumerate in Phase 1; move to Cato allocated egress IPs with per-app egress rules before the owning cohort flips. |
| Quota/confirm browsing actions | Websense-era time-quota browsing has no like-for-like Cato action. | Cato Prompt (warn-and-continue) covers the common intent; validate policy-by-policy. *(recommended practice)* |
| NGFW/SMC policy translation | SMC hierarchical templates, sub-policies and aliases do not import 1:1. | Follow the PS Export → Review & Map process; treat it as rationalisation (dead-rule cleanup, best-practice baseline) — this is a benefit, sell it as one. |
| Email security channel | Cato does not replace Forcepoint Email Security. | Scope it out explicitly; pair with M365/native email DLP or a dedicated vendor. Note Forcepoint's own on-prem email product is reported EOL (verify dates on the portal) — customers must move that workload regardless of the SASE decision. |
| "Forcepoint says nothing is EOL" | Largely true for cloud/DLP; the pressure is strategic, not contractual: data-security pivot, G2CI divested to Everfox, console/agent fragmentation across ONE + legacy stacks, and third-party reports of steep renewal uplifts (competitor-sourced — use with care). | Anchor on roadmap direction and operational cost of the fragmented estate; never claim an EOL you cannot cite. Where the customer has an NGFW appliance EoS notice in hand (support articles 000016021/000016018), that is the concrete trigger. |
| Gov/defence-adjacent customers | Cross-domain/high-assurance products went to **Everfox** with the G2CI sale. | If they depend on those, the vendor relationship has already split — consolidation on Cato for SASE plus Everfox for cross-domain is a coherent story. |

---

## 5a. SE discovery checklist (first call) *(recommended practice)*

Qualification and scoping questions that surface the migration shape quickly:

1. **Which Forcepoint products are actually deployed** — cloud SWG, on-prem Web Security/Content Gateway, Forcepoint ONE, NGFW/SMC, DLP (network/endpoint/discover), Email Security? Renewal dates for each contract?
2. **How is web traffic steered today** — PAC via GPO, WPAD, explicit browser settings, transparent (WCCP/PBR), Hybrid Module? Who owns the GPOs?
3. **Any appliance EoS/EoL notices in hand** (NGFW models, V-Series)? These are the concrete urgency triggers.
4. **What consumes proxy authentication** — NTLM/Kerberos challenges, X-Authenticated-User headers, per-user reporting tied to proxy auth?
5. **Which third parties allowlist Forcepoint egress IPs** — SaaS tenant restrictions, conditional access, partner firewalls?
6. **DLP reality check** — how many policies exist vs actively generate triaged incidents? Which use fingerprinting/ML/OCR? Which endpoint channels (USB/print/clipboard) are mandated by regulation, and by whom?
7. **Remote access** — NGFW VPN client population, SSL VPN portals, contractors/BYOD needing clientless access?
8. **TLS inspection today** — enabled scope, bypass list (pinned apps), certificate distribution mechanism already in place?
9. **Incident/reporting integrations** — SIEM/SOAR consuming Forcepoint logs; compliance reports auditors expect to continue uninterrupted?
10. **Gov/defence entanglement** — any Everfox (ex-G2CI) cross-domain products in the estate that split the vendor relationship already?

Outputs feed straight into Phase 1: steering inventory (Q2, Q4), allowlist register (Q5), DLP rationalisation workbook (Q6), ZTNA cohort plan (Q7), TLS pilot design (Q8).

---

## 6. Sources

**Forcepoint corporate & lifecycle**
- TPG completes acquisition of Forcepoint G2CI (2 Oct 2023, US$2.45bn): https://www.forcepoint.com/newsroom/2023/tpg-completes-acquisition-forcepoint-global-governments-and-critical-infrastructure
- TPG/Forcepoint agreement (10 Jul 2023): https://www.businesswire.com/news/home/20230710924094/en/TPG-To-Acquire-Forcepoint-Global-Governments-and-Critical-Infrastructure-Business-from-Francisco-Partners
- TechTarget on the G2CI sale: https://www.techtarget.com/searchsecurity/news/366544412/TPG-Capital-acquires-Forcepoints-government-unit-for-245B
- Forcepoint history incl. Stonesoft/Sidewinder purchase, Everfox rebrand: https://en.wikipedia.org/wiki/Forcepoint
- Forcepoint to acquire Bitglass (Oct 2021): https://www.forcepoint.com/newsroom/2021/forcepoint-acquire-security-service-edge-leader-bitglass
- Forcepoint to acquire Getvisibility (Mar 2025): https://www.forcepoint.com/newsroom/2025/forcepoint-acquire-getvisibility-expanding-ai-driven-data-security-and-risk
- Forcepoint Data Security Cloud launch (29 Apr 2025): https://www.forcepoint.com/newsroom/2025/forcepoint-unveils-data-security-cloud-uniting-visibility-and-control-data-everywhere
- "Forcepoint Data Security Cloud | SSE" documentation set: https://help.forcepoint.com/docs/Tech_Pubs/SSE/SSE.html
- Product Life Cycle Policy (EoS/EoL definitions; NGFW one-major-release-back support): https://www.forcepoint.com/sites/default/files/resources/datasheets/forcepoint-product-life-cycle-policy-en.pdf
- Product Support Life Cycle portal (authoritative dates; login/JS required): https://support.forcepoint.com/s/productsupportlifecycle
- NGFW EoS/EoL notices (titles verified; content behind JS portal): https://support.forcepoint.com/s/article/000016021 and https://support.forcepoint.com/s/article/000016018
- Web Security on-prem version/hardware lifecycle summary (third party): https://www.it-server-room.com/en/forcepoint-web-security-eos-eol-license-policy/
- Email Security EOL commentary (third party; verify dates on portal): https://trustifi.com/blog/forcepoint-email-security-end-of-life/ and https://trustlayer.co.uk/compare-trustlayer/how-to-navigate-forcepoint-email-security-end-of-life/
- Competitor commentary on Forcepoint friction points (use with care): https://dope.security/post/forcepoint-alternatives-2026

**Forcepoint deployment & DLP depth**
- PAC file best practices (explicit proxy, GPO distribution, PAC lockdown): https://help.forcepoint.com/websec/en-us/on-prem/85/pac_file_best_practices/wsop_85x_pacfbp_en-us.pdf
- Why use a PAC file / policy-specific PAC URLs: https://help.forcepoint.com/websec/en-us/on-prem/85/pac_file_best_practices/2ecffa18-72bb-43c9-b415-470ac6fd8f70.html
- Forcepoint ONE explicit proxy and PAC URLs: https://help.forcepoint.com/fpone/deploy/rhtml/guid-a95fcd2c-cdf7-4a36-85bd-a1a34bc8004c.html and https://help.forcepoint.com/fpone/deploy/rhtml/guid-ced29582-d04b-417a-b735-dd49fe7bb337.html
- Content Gateway explicit/transparent deployments: https://help.forcepoint.com/dlp/891/deployctr/F4A43A32-EFCA-4CD3-88A6-F099AC3CFA7A.html
- DLP machine-learning classifiers: https://help.forcepoint.com/dlp/10/machine_learning/2D367CFD-A22E-4083-BB52-7E2A416EC10F.html
- DLP data classification (incl. fingerprinting): https://help.forcepoint.com/dlp/90/dlphelp/E38AA3ED-E6F8-4008-82B8-8400230E8B9D.html
- DLP language support incl. OCR language packs: https://help.forcepoint.com/dlp/90/language_support/22BC8B48-2C35-40A6-B7D6-50D5CE336960.html

**Cato equivalents & methodology**
- What is the Cato DLP Service: https://support.catonetworks.com/hc/en-us/articles/5606495447197-What-is-the-Cato-DLP-Service
- Creating DLP Content Profiles (incl. OCR scope/limits): https://support.catonetworks.com/hc/en-us/articles/5352915107869-Creating-DLP-Content-Profiles
- Exact Data Matching for DLP: https://support.catonetworks.com/hc/en-us/articles/16676236807453-Working-with-Exact-Data-Matching-EDM-for-DLP
- Predefined data types (350+): https://support.catonetworks.com/hc/en-us/articles/32901519994781-Working-with-Predefined-Data-Types-for-DLP
- Custom data types: https://support.catonetworks.com/hc/en-us/articles/6223075015197-Working-with-Custom-Data-Types-for-DLP
- Managing the Internet Firewall Policy: https://support.catonetworks.com/hc/en-us/articles/4413273487633-Managing-the-Internet-Firewall-Policy
- Recommended Internet/WAN firewall baselines: https://support.catonetworks.com/hc/en-us/articles/360004274777-Recommendations-for-Internet-and-WAN-Firewall-Policies
- TLS Inspection best practices (gradual rollout, cert, QUIC): https://support.catonetworks.com/hc/en-us/articles/360007713437-Best-Practices-for-TLS-Inspection
- TLS Inspection Configuration Wizard: https://support.catonetworks.com/hc/en-us/articles/23739970551453-Using-the-TLS-Inspection-Configuration-Wizard
- Proxy Configuration Policy (centralised PAC during co-existence): https://support.catonetworks.com/hc/en-us/articles/16231563119901-Centralized-Management-of-Proxy-Configuration-Proxy-Configuration-Policy
- Unified CASB: https://support.catonetworks.com/hc/en-us/articles/4405498289053-What-is-the-Unified-CASB-Solution
- Cato ZTNA solution: https://support.catonetworks.com/hc/en-us/articles/6266293423773-What-is-Cato-s-ZTNA-Solution
- Universal ZTNA (posture attributes, always-on, MDM deployment): https://www.catonetworks.com/platform/universal-zero-trust-network-access-ztna/
- Cato Client capabilities: https://support.catonetworks.com/hc/en-us/articles/22836322246685-Understanding-the-Capabilities-of-the-Cato-Client
- Understanding Rollout to the Cato Cloud: https://support.catonetworks.com/hc/en-us/articles/11968052021277-Understanding-Rollout-to-the-Cato-Cloud
- Client rollout best practices (Cato Academy): https://academy.catonetworks.com/client-rollout-best-practices
- Deploying Cato SASE step by step: https://www.catonetworks.com/blog/deploying-cato-sase-step-by-step/
- SASE project planning guide: https://www.catonetworks.com/blog/the-path-to-sase-a-project-planning-guide/
- Allocated egress IPs: https://support.catonetworks.com/hc/en-us/articles/4413273467153-Allocating-IP-Addresses-for-the-Account
- Egress rules per app: https://support.catonetworks.com/hc/en-us/articles/360000163245-How-to-Configure-a-Network-Rule-to-Egress-Traffic
- Cato PS TLS/CASB/DLP enablement AMA (PS methodology, TLS phases): https://connect.catonetworks.com/t5/s/dhink38672/attachments/dhink38672/cato-cloud-discussions/423/1/Cato%20PS%20AMA%202025%20Q4%20TLS%20Inspection%20&%20CASB%20DLP%20Enablement.pdf
- Internal: Cato PS deck digest (phases 1–4, SDP migration groups, TLS inspection phases) — `_extract/andy-professional-services-deck-combined-slides-2026.md`; Zscaler-to-Cato PS migration deck (Export→Map→Deploy→Optimise, parallel backhaul patterns) — `_extract/zscaler-to-cato-2025-q3.md`
