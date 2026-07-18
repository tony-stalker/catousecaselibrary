# Migration brief: Netskope → Cato SASE Cloud Platform

> SE enablement research note. UK English. Facts are sourced (see §6); anything marked
> **recommended practice** is SE guidance without a public source and should be validated
> per deal. Do not quote statistics or licensing figures to customers without re-checking
> the source. Last researched: July 2026.

---

## 1. Vendor snapshot

**Company / platform.** Netskope began as a CASB/DLP vendor and has expanded into the
"Netskope One" platform: NG-SWG, CASB, Private Access (NPA/ZTNA), Cloud Firewall, RBI,
DLP, SkopeAI, and Borderless SD-WAN — positioned as single-vendor SASE ([netskope.com/products](https://www.netskope.com/products)).
Inline services run on **NewEdge**, Netskope's privately owned security cloud (data
centres in 70+ regions, extensive peering, sub-10 ms traffic-processing SLA claims)
([NewEdge](https://www.netskope.com/netskope-one/newedge)). The SD-WAN capability came
via the **Infiot acquisition (August 2022)**, delivered as SASE Gateway physical/virtual
appliances ([press release](https://www.netskope.com/press-releases/netskope-acquires-infiot-will-deliver-fully-integrated-single-vendor-sase-platform)).

**Products typically in scope for a migration:**

- **NG-SWG** — inline web/SaaS/GenAI proxy: URL filtering, threat protection, app/activity
  control ([next-gen-swg](https://www.netskope.com/products/next-gen-swg)).
- **CASB** — inline (real-time protection policies) plus **API Data Protection** for data
  at rest in sanctioned SaaS.
- **DLP** — content profiles shared across inline and API channels; EDM, fingerprinting,
  OCR, 26+ ML classifiers, 3,000+ data identifiers ([DLP datasheet](https://go.netskope.com/rs/665-KFP-612/images/netskope-data-loss-prevention-dlp.pdf)).
- **NPA (Private Access)** — ZTNA via Publisher connectors in front of private apps; app
  definitions (private app segments) with hosts/ports, optional Publisher DNS, and
  browser-based access for unmanaged devices ([NPA docs](https://docs.netskope.com/en/netskope-private-access)).
- **Cloud Firewall** — FWaaS for non-web egress ports/protocols.
- **Netskope Client** — the unified steering agent for SWG/CASB/NPA/Cloud Firewall.
- **Borderless SD-WAN / SASE Gateways** — if sold; many installed-base accounts still run
  Netskope SSE alongside a third-party SD-WAN or router estate (check per account —
  **recommended practice** to confirm in discovery, not assume).

**Typical deployment / steering methods** ([traffic steering docs](https://docs.netskope.com/en/traffic-steering)):

1. **Netskope Client** on managed endpoints (dominant pattern for user traffic). A default
   steering configuration steers thousands of apps; admins maintain steering exceptions
   for certificate-pinned apps and VPN gateways.
2. **IPsec/GRE tunnels** from site firewalls/routers/SD-WAN into NewEdge for branch
   egress ([IPsec and GRE](https://docs.netskope.com/en/ipsec-and-gre/)).
3. **Cloud Explicit Proxy** with PAC files / WPAD / manual proxy settings, including
   explicit proxy over IPsec/GRE ([explicit proxy](https://docs.netskope.com/en/explicit-proxy)).
4. **Proxy chaining** from an existing on-prem proxy, and an on-prem dataplane appliance
   option.
5. **NPA Publishers** (VM/container connectors) deployed adjacent to private apps.

**Verifiable migration drivers** (lead with these; avoid unsourced "console sprawl"
claims — Netskope markets a single console for SSE + SD-WAN):

- **Two dataplanes / appliance dependency for full SASE.** Netskope's SD-WAN arrived by
  acquisition and runs on SASE Gateway appliances feeding NewEdge; Cato's SD-WAN and
  security run as one converged cloud service with thin Socket edges — the differential
  is architectural convergence, not console count ([SDxCentral on Infiot](https://www.sdxcentral.com/news/netskope-acquires-infiot-on-the-road-to-single-vendor-sase/)).
- **Steering complexity.** Multiple steering mechanisms (Client config, PAC/explicit
  proxy, tunnels, exceptions) must be designed and maintained per cohort; Cato steering
  is Socket- or Client-based with no PAC layer ([Netskope steering configuration](https://docs.netskope.com/en/creating-a-steering-configuration)).
- **Cost and deployment complexity (reviewer-sourced).** PeerSpot reviewers cite complex
  setup and pricing that is "high compared to competitors"; third-party reviews note DLP/
  CASB/ZTNA tuning "can take months" and often needs professional services
  ([PeerSpot](https://www.peerspot.com/products/netskope-reviews), [dope.security review](https://dope.security/post/netskope-review-2025-features-pricing-pros-cons)).
- **SSE-only estates.** Where the customer runs Netskope SSE plus a separate SD-WAN or
  MPLS/firewall WAN, moving to Cato consolidates network + security into one platform and
  one policy model — the classic Cato vendor-consolidation play.

**Honest counterpoint to keep in mind:** Netskope is a strong SSE — market-leading CASB/
DLP depth and a well-engineered private cloud. The migration case is strongest on
convergence, WAN transformation, operational simplicity and total cost — not on
out-featuring Netskope's data-protection niche (see §5).

---

## 2. Component → Cato mapping

| Netskope component | Function | Cato equivalent | Notes |
|---|---|---|---|
| NG-SWG (real-time protection policies for web) | Inline SWG: URL filtering, threat protection | **Internet Firewall + Threat Prevention** in the single-pass engine | Categories + app awareness in one rulebase; actions Allow / Block / **Prompt** ([Internet Firewall](https://support.catonetworks.com/hc/en-us/articles/4413273487633-Managing-the-Internet-Firewall-Policy)) |
| CASB inline (app/activity/instance policies) | Real-time SaaS control | **Cato CASB — Application Control policy** (granular app/activity rules, tenant awareness) | Included in CASB licence; requires TLS inspection ([App Control](https://support.catonetworks.com/hc/en-us/articles/13314302436253-Managing-the-Application-Control-Policy)) |
| CASB app-instance / tenant steering | Restrict to corporate tenant | **Tenant Restrictions policy** (HTTP header injection) + tenant awareness in App Control | M365, Google Workspace, Slack, Dropbox documented ([Tenant Restrictions](https://support.catonetworks.com/hc/en-us/articles/24373653275165-Managing-Tenant-Restrictions-for-SaaS-Apps-Tenant-Restrictions-Policy)) |
| API Data Protection (API-CASB) | Scan data at rest in sanctioned SaaS | **Cato SaaS Security API / Data Protection API** | Documented connectors: SharePoint, OneDrive, Exchange (DLP + anti-malware, out-of-band). Netskope's API app coverage is broader — verify required apps before cutover ([SaaS Security API](https://support.catonetworks.com/hc/en-us/articles/5352885456669-What-is-the-Data-Protection-API)) |
| DLP profiles (EDM, fingerprinting, OCR, ML classifiers) | Content inspection | **Cato DLP — Data Control policy** with content profiles; 350+ data types, custom regex/keyword/label types, **EDM**, IDM, OCR | OCR is not supported for EDM profiles; profiles are rebuilt, not imported ([Cato DLP](https://support.catonetworks.com/hc/en-us/articles/32622848658461-How-Cato-Protects-Sensitive-Data-with-DLP), [EDM](https://support.catonetworks.com/hc/en-us/articles/16676236807453-Working-with-Exact-Data-Matching-EDM-for-DLP)) |
| NPA (Publishers + private app definitions) | ZTNA to private apps | **Cato ZTNA/SDP**: Cato Client → nearest PoP → WAN Firewall rules to apps behind Sockets/vSockets/IPsec sites; **Browser Access portal** for clientless web apps | No Publisher-style connectors to run per app enclave — apps are reachable via the site edge; access governed by WAN Firewall + Client Connectivity Policy + device posture ([Cato ZTNA](https://support.catonetworks.com/hc/en-us/articles/6266293423773-What-is-Cato-s-ZTNA-Solution), [Browser Access](https://support.catonetworks.com/hc/en-us/articles/4965522214685-Configuring-the-Browser-Access-Portal)) |
| Netskope Client + steering configuration | Endpoint steering (web + private) | **Cato Client** (Windows/macOS/Linux/iOS/Android) | One agent, one tunnel to the PoP; no steering-config/PAC layer. Bypass lists exist but are far smaller in practice — **recommended practice**: rebuild only proven cert-pinned exceptions |
| Cloud Explicit Proxy / PAC / proxy chaining | Browser-level steering | **Not required** — Socket (sites) or Client (users) steering | Removing the PAC/explicit-proxy estate is a simplification win; plan proxy-setting cleanup via GPO/MDM at cutover (**recommended practice**) |
| Cloud Firewall | FWaaS, all-port egress | **Cato Internet Firewall (FWaaS)** — all ports/protocols in the same engine | Same rulebase as web policy, not a separate product |
| RBI (for risky/uncategorised sites) | Browser isolation | **Cato RBI** (Authentic8-powered service, policy-driven) | Licence line item — confirm inclusion ([Cato RBI](https://support.catonetworks.com/hc/en-us/articles/9797943724061-Configuring-the-RBI-Service-for-Secure-Web-Browsing)) |
| Cloud Confidence Index (CCI, 0–100, 85k+ apps) | SaaS risk rating | **Cato App Catalog** — risk score 0–10 from the Application Credibility Engine; overridable per account | Rules can match on risk score ([App Catalog](https://support.catonetworks.com/hc/en-us/articles/7603867737885-Using-the-App-Catalog)) |
| User coaching / notification templates (justification capture) | Warn-and-proceed UX | **Prompt action** in Internet Firewall (user chooses to continue) | Netskope's justification text capture and template richness exceed Cato's Prompt — see §5 ([Prompt](https://support.catonetworks.com/hc/en-us/articles/4413273486865-What-is-the-Cato-Internet-Firewall)) |
| Borderless SD-WAN / SASE Gateway appliances | Branch connectivity | **Cato Socket** (X1500/X1700 etc.) or vSocket (AWS/Azure) | Sockets are zero-touch thin edges; policy lives in the cloud ([Socket vs IPsec](https://support.catonetworks.com/hc/en-us/articles/360000489917-Cato-Socket-vs-IPsec-Sites-and-Tunnels)) |
| IPsec/GRE tunnels into NewEdge | Site steering to SSE | **Socket site** (preferred) or **IPsec IKEv2 site** to a Cato PoP from existing firewalls (interim) | ([IPsec IKEv2 sites](https://support.catonetworks.com/hc/en-us/articles/4413265635473-Configuring-IPsec-IKEv2-Sites)) |
| IdP integration / SCIM to Netskope | Identity + groups | **Cato SCIM provisioning** — Entra ID, Okta, OneLogin; SSO for Client and portal | ([SCIM](https://support.catonetworks.com/hc/en-us/articles/13651160092701-Provisioning-Users-with-SCIM)) |
| Proactive DEM (if licensed) | Experience monitoring | **Cato Digital Experience Monitoring** | Validate feature parity per requirement — capabilities evolve quickly on both sides |

---

## 3. Recommended migration path

Anchored to the Cato Professional Services methodology — **Discover & Design → Pilot,
Build & Initial Rollout → Advanced Security & Rollout → Tune & Optimise** (Cato PS
deployment deck; see also the public checklist at
[How to Implement SASE](https://www.catonetworks.com/glossary/how-to-implement-sase/)).
The policy workstream follows the PS competitor-migration pattern used for Zscaler:
**Export → Review & Map → Deploy → Optimise** (Cato PS "Zscaler to Cato" deck, adapted
here for Netskope — adaptation is **recommended practice**).

### Phase 1 — Discover & Design

- **Inventory the Netskope estate.** From the tenant console (and REST API v2 where
  endpoints exist — community reports confirm the API exposes some but not all
  configuration, so expect manual export/screenshots for parts of it
  ([community thread](https://community.netskope.com/next-gen-swg-2/exporting-and-importing-information-1042))):
  real-time protection policies, DLP profiles/rules (note which use EDM/fingerprinting/
  OCR), steering configurations and exception lists, explicit-proxy/PAC usage, IPsec/GRE
  tunnel inventory, Cloud Firewall rules, NPA app definitions + Publisher placement,
  tenant/instance restrictions, notification templates, API Data Protection app scope,
  SIEM/SOAR integrations, IdP/SCIM source.
- **Classify steering per cohort**: Client-steered users, PAC/explicit-proxy users
  (often VDI/kiosk/unmanaged), tunnel-steered sites, proxy-chained locations. Each cohort
  gets its own cutover mechanism and rollback lever.
- **Map policies to Cato constructs** (per the table in §2): RTP web rules → Internet
  Firewall; app/activity rules → Application Control; instance rules → Tenant
  Restrictions; DLP profiles → Data Control content profiles (rebuild EDM datasets from
  the original source data — profiles do not import); NPA app definitions → WAN Firewall
  rules plus site/vSocket reachability design; Cloud Firewall → Internet Firewall
  service/port rules. Clean up and refactor rather than lift-and-shift — gap-analysis to
  Cato best practice is an explicit PS step (Cato PS deck).
- **Design TLS inspection** with the Cato wizard/granular policy; CASB and DLP require it
  ([TLS wizard](https://support.catonetworks.com/hc/en-us/articles/23739970551453-Using-the-TLS-Inspection-Configuration-Wizard)).
  Netskope's SSL bypass list is the best seed for Cato's inspection exemptions
  (**recommended practice**).
- **Identity**: stand up Cato SCIM from the same IdP (Entra ID/Okta/OneLogin) in parallel
  with Netskope's — both can provision from one IdP simultaneously (**recommended
  practice**; SCIM apps are independent).
- Define success criteria, cohorts, wave plan, and socket logistics.

### Phase 2 — Pilot, Build & Initial Rollout

- Account setup to Cato best practice; start from the **Default Recommended CASB/DLP
  policy** and layer mapped rules onto it ([default policy](https://support.catonetworks.com/hc/en-us/articles/24373653130781-Using-the-Default-Recommended-CASB-DLP-Policy)).
- **Sockets at pilot sites** (plus DC/DR and cloud vSockets in parallel — PS runs DC
  deployment early so private apps are reachable before user migration).
- **Pilot user cohort**: remove/disable the Netskope Client, deploy the Cato Client
  (order matters — see §4), enforce a **Client Connectivity Policy** and posture checks,
  run the client estate in monitor-first mode per PS practice.
- Validate: internet egress, private app access (replacing NPA paths), SaaS tenant
  controls, SIEM event flow, DLP in **monitor mode**.
- Browser Access portal stood up for the unmanaged-device population currently on NPA
  browser access or explicit proxy.

### Phase 3 — Advanced Security & Rollout

- **TLS inspection enabled in planned stages** (PS runs this as TLSi Phases 1–4 across
  the rollout) and DLP moved from monitor to block per profile once false positives are
  tuned.
- **User cohorts (SDP migration groups) cut over in waves** — PS schedules Groups 1–4
  phased across weeks, with posture analysis and connectivity-policy tuning between waves
  (Cato PS deck).
- **Sites**: replace IPsec/GRE-to-NewEdge with Sockets wave by wave. Interim options,
  adapted from the PS Zscaler patterns (**recommended practice** for Netskope):
  - keep the existing firewall's tunnel to Netskope for not-yet-migrated VLANs while the
    Socket takes over migrated VLANs (parallel connectivity, phased internet breakout);
  - or connect legacy firewalls to Cato as IPsec IKEv2 sites so un-socketed sites still
    ride Cato policy.
- **NPA decommissioning per app group**: once an app's site/VPC is on-net behind a
  Socket/vSocket and its WAN Firewall + posture rules are validated, retire the matching
  NPA app definition; remove Publishers only when every app they front has moved.
- Roll out Tenant Restrictions and app-instance rules; enable RBI policy for risky
  categories if licensed.

### Phase 4 — Tune & Optimise / Decommission

- Event analysis, rule tightening, removal of temporary bypasses, bandwidth/QoS tuning.
- **Netskope wind-down order** (**recommended practice**): inline SWG/CASB cohorts →
  Cloud Firewall tunnels → NPA/Publishers → API Data Protection **last** (it is
  out-of-band and conflict-free, so it can safely run until Cato SaaS Security API
  connectors cover the required apps) → steering artefacts (PAC files, proxy GPOs,
  tunnel configs) → tenant/licence termination.
- Handover to Cato Support Operations, admin training, documentation (PS deck).

---

## 4. Co-existence & rollback

**Dual-agent reality.** Both agents want to own the device's web traffic. Netskope's own
interoperability guidance shows what happens when another full tunnel is present: the
Netskope Client tunnels *inside* the other VPN, traffic takes a suboptimal path, and
inspection value degrades — exceptions must be configured for the other vendor's gateway
([Netskope Client interoperability](https://docs.netskope.com/en/netskope-client-interoperability)).
On the Cato side: third-party VPN drivers can conflict with the Cato Client (e.g. DNS
override), running the Cato Client in full-tunnel mode alongside a third-party VPN is not
recommended, and on macOS the Cato Client cannot run alongside another connected VPN
profile at all ([Preparing to Install the Cato Client](https://support.catonetworks.com/hc/en-us/articles/4411554844817-Preparing-to-Install-the-Cato-Client)).

**Therefore (recommended practice):**

- Treat the endpoint swap as **replace, not coexist**: per cohort, disable/uninstall the
  Netskope Client and install the Cato Client in the same maintenance window via
  Intune/JAMF/SCCM. Do not attempt long-running dual-steering on the same device.
- If a short overlap is unavoidable (e.g. staged validation), add Cato PoP/SSO
  destinations to the Netskope steering exceptions and keep the Cato Client disconnected
  until its cutover moment; never enable both tunnels simultaneously on macOS.
- **Coexistence belongs at the network and API layers, not the endpoint**: sites can run
  Netskope tunnels and Cato Sockets side by side on separate VLANs/cohorts, and
  **Netskope API Data Protection keeps scanning SaaS data at rest throughout the inline
  migration** with zero conflict — keep it licensed until Cato's SaaS Security API scope
  is confirmed for the customer's app list.
- Users on **explicit proxy/PAC** are the easiest rollback cohort: cutover is a
  proxy-setting change, so stage them early as a low-risk pilot.

**Rollback levers, per cohort:**

1. **Users** — redeploy/re-enable the Netskope Client (keep the MDM package and steering
   config live until the wave is signed off).
2. **Explicit-proxy users** — revert PAC/proxy GPO.
3. **Sites** — the old firewall tunnel to NewEdge stays configured (or the site rides a
   Cato IPsec interim); re-point the default route back.
4. **Private apps** — leave NPA Publishers and app definitions in place (disabled or
   scoped down) until each app group passes acceptance on Cato.
5. **Identity** — Netskope SCIM app left intact until decommission; both platforms
   provision independently from the IdP.
6. Keep the Netskope tenant licensed until the final wave completes — negotiate the
   overlap window commercially up front (**recommended practice**).

---

## 5. Gotchas & objection handling

Be honest: Netskope's data-protection stack is its crown jewel. Win on platform
convergence and operations; neutralise on features.

- **DLP fidelity gap is real but usually narrower than it looks.** Netskope advertises
  3,000+ identifiers, 26+ ML classifiers, patented EDM/fingerprinting/OCR across 2,100+
  file types ([DLP datasheet](https://go.netskope.com/rs/665-KFP-612/images/netskope-data-loss-prevention-dlp.pdf)).
  Cato DLP offers 350+ data types plus custom types, **EDM**, IDM and OCR — but OCR does
  not apply to EDM profiles ([Cato DLP](https://support.catonetworks.com/hc/en-us/articles/32622848658461-How-Cato-Protects-Sensitive-Data-with-DLP)).
  Handling: in discovery, list the DLP rules *actually firing* (most estates enforce a
  small subset of what is licensed — **recommended practice**); rebuild EDM datasets from
  source systems; run monitor-mode side-by-side during the pilot and compare hit parity
  on the customer's own traffic rather than datasheet counts.
- **API-CASB breadth.** Netskope API Data Protection covers a wide sanctioned-app set;
  Cato's documented SaaS Security API connectors centre on Microsoft 365 (SharePoint,
  OneDrive, Exchange) ([Cato connectors](https://support.catonetworks.com/hc/en-us/sections/5352915014557-Cato-SaaS-Security-API)).
  If the customer scans Google Workspace, Box, Salesforce etc. at rest, check the current
  Cato connector list at proposal time and, if there is a gap, either retain Netskope
  API-CASB for those apps in the interim (it coexists cleanly) or scope the requirement
  honestly.
- **User coaching.** Netskope's notification templates support justification capture,
  false-positive reporting and rich branding ([templates](https://docs.netskope.com/en/policy-notification-templates)).
  Cato's equivalent is the **Prompt** action (warn-and-continue; requires the Cato
  certificate on endpoints). If written justification workflows are a hard requirement,
  set expectations and explore compensating controls (e.g. event follow-up in the CMA/
  SIEM) — do not claim parity.
- **Instance/activity granularity.** Netskope's inline CASB can key policies on app
  instance and fine-grained activities. Cato provides granular Application Control rules,
  tenant awareness and header-injection Tenant Restrictions — validate the customer's
  specific app/activity/instance matrix app-by-app during the pilot rather than asserting
  blanket equivalence (**recommended practice**).
- **App risk-rating depth.** CCI rates 85,000+ apps on 50+ attributes; Cato's App Catalog
  scores 0–10 via ACE and is overridable. Rules migrate cleanly by category/risk-band,
  but audit any policy that pins specific CCI scores.
- **Steering-exception archaeology.** Years of Netskope steering exceptions (cert-pinned
  apps, VPN gateways, problem SaaS) encode real operational knowledge. Mine that list for
  the Cato TLS-inspection bypass and Client split-tunnel exclusions instead of
  rediscovering the failures in production (**recommended practice**).
- **NPA specifics.** Publisher DNS behaviour (private DNS resolution via Publishers) must
  be re-provided by site-level DNS design on Cato; NPA's L3 client-to-client/
  server-to-client modes need explicit design review. Cato's routed WAN generally makes
  these simpler, not harder — but map them, don't assume.
- **RBI licensing.** Netskope bundles RBI for risky/uncategorised sites with certain
  NG-SWG tiers; Cato RBI is a distinct service (Authentic8-powered). Check the bill of
  materials so isolation use-cases don't silently drop out.
- **Don't over-claim "single console".** Netskope One presents SSE and SD-WAN in one
  console with one policy framework per its own materials ([Next Gen SASE Branch PR](https://www.prnewswire.com/news-releases/netskope-delivers-the-next-gen-sase-branch-powered-by-borderless-sd-wan-301982890.html)).
  The differential to sell is the **converged single-pass dataplane and one policy model
  across WAN, internet, remote and cloud** — plus removing the appliance/Publisher/PAC
  scaffolding — not console counting.
- **NewEdge performance is good.** Reviewers rarely leave Netskope over PoP latency.
  Anchor the business case on consolidation (SSE + SD-WAN + FWaaS + ZTNA in one
  platform), operational simplicity, and the reviewer-sourced cost/complexity friction
  ([PeerSpot](https://www.peerspot.com/products/netskope-reviews)).

---

## 6. Sources

**Netskope (vendor docs and materials)**
- Products overview — https://www.netskope.com/products
- NG-SWG — https://www.netskope.com/products/next-gen-swg
- Traffic steering — https://docs.netskope.com/en/traffic-steering
- Steering configuration — https://docs.netskope.com/en/creating-a-steering-configuration
- Cloud Explicit Proxy — https://docs.netskope.com/en/explicit-proxy
- IPsec and GRE — https://docs.netskope.com/en/ipsec-and-gre/
- NPA overview — https://docs.netskope.com/en/netskope-private-access
- NPA app definitions — https://docs.netskope.com/en/create-a-private-app-definition/
- Client interoperability — https://docs.netskope.com/en/netskope-client-interoperability
- Notification templates — https://docs.netskope.com/en/policy-notification-templates
- Real-time protection policies — https://docs.netskope.com/en/configuring-real-time-protection-policies
- CCI / App Catalog — https://docs.netskope.com/en/cloud-confidence-index
- DLP datasheet — https://go.netskope.com/rs/665-KFP-612/images/netskope-data-loss-prevention-dlp.pdf
- NewEdge — https://www.netskope.com/netskope-one/newedge
- Infiot acquisition — https://www.netskope.com/press-releases/netskope-acquires-infiot-will-deliver-fully-integrated-single-vendor-sase-platform
- Next Gen SASE Branch PR — https://www.prnewswire.com/news-releases/netskope-delivers-the-next-gen-sase-branch-powered-by-borderless-sd-wan-301982890.html
- REST API v2 — https://docs.netskope.com/en/rest-api-v2-overview-312207 ; export limits (community) — https://community.netskope.com/next-gen-swg-2/exporting-and-importing-information-1042

**Cato Networks**
- Internet Firewall policy — https://support.catonetworks.com/hc/en-us/articles/4413273487633-Managing-the-Internet-Firewall-Policy
- What is the Internet Firewall (Prompt action) — https://support.catonetworks.com/hc/en-us/articles/4413273486865-What-is-the-Cato-Internet-Firewall
- Application Control (CASB) — https://support.catonetworks.com/hc/en-us/articles/13314302436253-Managing-the-Application-Control-Policy
- Unified CASB — https://support.catonetworks.com/hc/en-us/articles/4405498289053-What-is-the-Unified-CASB-Solution
- Tenant Restrictions — https://support.catonetworks.com/hc/en-us/articles/24373653275165-Managing-Tenant-Restrictions-for-SaaS-Apps-Tenant-Restrictions-Policy
- Data Control (DLP) policy — https://support.catonetworks.com/hc/en-us/articles/5606480974237-Creating-the-Data-Control-Policy
- How Cato protects data with DLP — https://support.catonetworks.com/hc/en-us/articles/32622848658461-How-Cato-Protects-Sensitive-Data-with-DLP
- EDM for DLP — https://support.catonetworks.com/hc/en-us/articles/16676236807453-Working-with-Exact-Data-Matching-EDM-for-DLP
- Default recommended CASB/DLP policy — https://support.catonetworks.com/hc/en-us/articles/24373653130781-Using-the-Default-Recommended-CASB-DLP-Policy
- SaaS Security API / Data Protection API — https://support.catonetworks.com/hc/en-us/articles/5352885456669-What-is-the-Data-Protection-API ; connector section — https://support.catonetworks.com/hc/en-us/sections/5352915014557-Cato-SaaS-Security-API
- TLS Inspection wizard — https://support.catonetworks.com/hc/en-us/articles/23739970551453-Using-the-TLS-Inspection-Configuration-Wizard
- Cato ZTNA — https://support.catonetworks.com/hc/en-us/articles/6266293423773-What-is-Cato-s-ZTNA-Solution
- Client Connectivity Policy — https://support.catonetworks.com/hc/en-us/articles/4415419573393-Configuring-the-Client-Connectivity-Policy
- Browser Access portal — https://support.catonetworks.com/hc/en-us/articles/4965522214685-Configuring-the-Browser-Access-Portal
- Preparing to install the Cato Client (VPN coexistence limits) — https://support.catonetworks.com/hc/en-us/articles/4411554844817-Preparing-to-Install-the-Cato-Client
- SCIM provisioning — https://support.catonetworks.com/hc/en-us/articles/13651160092701-Provisioning-Users-with-SCIM
- Socket vs IPsec sites — https://support.catonetworks.com/hc/en-us/articles/360000489917-Cato-Socket-vs-IPsec-Sites-and-Tunnels
- IPsec IKEv2 sites — https://support.catonetworks.com/hc/en-us/articles/4413265635473-Configuring-IPsec-IKEv2-Sites
- RBI — https://support.catonetworks.com/hc/en-us/articles/9797943724061-Configuring-the-RBI-Service-for-Secure-Web-Browsing
- App Catalog / risk score — https://support.catonetworks.com/hc/en-us/articles/7603867737885-Using-the-App-Catalog
- How to implement SASE — https://www.catonetworks.com/glossary/how-to-implement-sase/
- Cato PS methodology & wave plan — internal PS deck (`_extract/andy-professional-services-deck-combined-slides-2026.md`); competitor-migration pattern — internal PS deck (`_extract/zscaler-to-cato-2025-q3.md`)

**Third-party / reviews**
- PeerSpot Netskope reviews (complexity, pricing) — https://www.peerspot.com/products/netskope-reviews
- dope.security Netskope review 2025 — https://dope.security/post/netskope-review-2025-features-pricing-pros-cons
- SDxCentral on Infiot/SASE — https://www.sdxcentral.com/news/netskope-acquires-infiot-on-the-road-to-single-vendor-sase/
