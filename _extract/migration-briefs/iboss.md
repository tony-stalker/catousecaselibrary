# Migration brief: iboss → Cato SASE Cloud

> SE enablement research note. Sourced claims carry a bracketed reference to the Sources
> section; anything marked *recommended practice* is field guidance without a public source
> and should be validated per engagement. UK English. Last researched: July 2026.

---

## 1. Vendor snapshot

**What iboss is.** iboss is a cloud security vendor with a strong proxy/web-gateway heritage
(it began as an appliance web filter for education) that now markets a "Zero Trust SASE"
platform. Its differentiator is a patented **containerised architecture**: each customer gets
dedicated, single-tenant gateway containers with isolated processing paths rather than shared
multi-tenant data planes [S1][S2]. The platform spans SWG, malware defence, CASB, DLP,
ZTNA (VPN replacement), browser isolation and logging/reporting, delivered from 100+ points
of presence [S1][S2].

**Market position.** Gartner placed iboss as a **Niche Player** in the 2024 Magic Quadrant for
Security Service Edge. Cited strengths: aggressive availability (seven-nines) and latency
(100 ms) SLAs, low pricing with FWaaS/ZTNA included at all tiers, and responsive support.
Cited cautions: weak SaaS/API integrations, no SSPM, a small SaaS risk-rating catalogue, and
a customer base concentrated in North America and a limited set of verticals [S3]. iboss is
particularly common in **US K-12 education, libraries and government** (CIPA compliance
messaging, FedRAMP Moderate) [S3][S8].

**Typical deployment and steering modes.** iboss documents four ways to get traffic to its
cloud [S4][S5]:

1. **Cloud connector agents** on managed devices (the most common mode) — the agent redirects
   traffic, authenticates the user, maps group policy and installs the iboss root MITM
   certificate for SSL/TLS inspection [S5]. Chromebooks are covered via a Chrome
   extension/connector, which matters in education fleets [S10].
2. **PAC files / explicit proxy settings** — customer-hosted PAC scripts that proxy to iboss
   off-network and route direct or via local gateways on-network [S5].
3. **GRE or IPsec tunnels** from sites/SD-WAN edges, terminating on the public IP of the
   customer's iboss gateway nodes — typically used for guest, BYOD and IoT traffic [S4][S6].
4. **DNS redirection** for lightweight filtering [S5].

A signature iboss feature is **dedicated cloud source IPs**: because gateways are
single-tenant, every customer egresses from IPs unique to them, and many customers key SaaS
tenant restrictions and application allowlists to those IPs [S7].

**Verifiable migration drivers.**

- **SSE heritage, late SD-WAN.** iboss was an SSE-only platform until it announced "Zero
  Trust SD-WAN" on 6 May 2024 to claim single-vendor SASE [S9]. Estates that also need WAN
  transformation (MPLS replacement, site-to-site optimisation, global backbone) have
  historically had to run iboss alongside a separate SD-WAN/network vendor — two policy
  planes, two support paths. Cato converges networking and security on one cloud-native
  platform managed from a single console [S13][S14].
- **Proxy-mode operational friction.** iboss steering leans on PAC files, explicit proxy
  settings and per-platform connectors [S4][S5]. Gartner Peer Insights reviews are broadly
  positive (4.8/5 across 131 reviews at time of research) but the dislikes threads include
  complaints about support process inefficiency, difficulty getting the Chromebook
  extension working, and product instability in some SASE deployments [S10]. Treat these as
  anecdotes to probe in discovery, not as blanket claims.
- **Analyst-noted gaps** in SaaS/API security depth (CASB API mode, SSPM, SaaS risk
  catalogue) for customers whose roadmap is SaaS-heavy [S3].
- *Recommended practice:* the strongest commercial trigger events are SD-WAN/firewall
  refresh, MPLS contract expiry, an M&A-driven network rebuild, or an education/government
  re-procurement cycle — moments when "filter renewal" can be reframed as platform
  consolidation.

---

## 2. Component → Cato mapping

| iboss component | Function | Cato equivalent | Notes |
|---|---|---|---|
| SWG / web filtering, malware defence | URL/category filtering, threat protection, SSL inspection | **Cato SWG**: Internet firewall with URL categories, anti-malware, IPS; TLS inspection policy in CMA [S11][S12] | Category taxonomies differ — map iboss categories/exceptions to Cato categories rule-by-rule; do not assume 1:1. |
| SafeSearch / YouTube controls | Enforce SafeSearch, YouTube Restricted Mode for education | **Cato Content Restrictions**: SafeSearch plus YouTube Moderate/Strict enforcement [S12] | Cato documents a DoH caveat: browsers using DNS-over-HTTPS bypass Content Restriction — control DoH via policy/browser management [S12]. |
| Cloud connector agents (Windows/macOS/mobile) | Device steering, user auth, root-cert install | **Cato Client** — Windows, macOS, Linux, iOS, Android; MSI + MDM/Intune distribution [S15][S16] | Cato Client steers all traffic to the nearest PoP (transparent, no proxy config). **ChromeOS/Chromebook is not in Cato's documented Client OS list — validate coverage/approach in discovery for education fleets** [S15]. |
| PAC files / explicit proxy settings | Browser-level steering | Transparent steering via **Cato Client** (roaming) or **Socket/IPsec site** (on-network) | Removing PAC/proxy settings is part of cutover; plan GPO/MDM cleanup. *Recommended practice:* keep PAC infrastructure alive during co-existence as the rollback lever. |
| GRE/IPsec tunnels from sites | Site/guest/IoT steering to iboss gateways | **Cato Socket** (e.g. X1500/X1700) or **IPsec tunnel to Cato PoP** | Sockets add last-mile HA, QoS and full WAN capability — a functional upgrade, not a like-for-like tunnel swap [S13]. |
| ZTNA / VPN replacement | Remote access to private apps | **Cato SDP / Private Access**: remote-access eligibility, Private Access Policy, App Connector for published apps, clientless browser access [S17] | Cato ZTNA rides the same Client and backbone as internet security — one agent, one policy plane. |
| CASB (inline) | Shadow-IT visibility, app control | **Cato CASB / Application Control** policy in CMA [S18] | Gartner flagged iboss SaaS/API depth as a caution [S3]; compare app catalogues during discovery. |
| DLP | Data-in-motion control | **Cato DLP**: Data Control policy, 350+ content profile data types, inline inspection [S18] | Rebuild profiles rather than exporting — engines and match logic differ. |
| Browser Isolation | Isolate risky/uncategorised sites | **Cato RBI** (Authentic8 engine) — "Isolate" action alongside Allow/Block/Prompt in policy [S19] | Same pattern as iboss (isolation wired into web policy actions). |
| Dedicated cloud source IPs | SaaS tenant restrictions keyed to egress IP | **Cato allocated IPs** + NAT egress rules (3 unique IPs in the default licence; more via sales) [S20] | Critical migration dependency — see gotchas §5. |
| Reporter / logging & analytics | Per-user reporting, compliance evidence | **Cato Management Application (CMA)** events, analytics and user awareness; SIEM export | Education customers often have statutory per-user reporting expectations — demo CMA user-level views early. |
| Directory integration (Azure AD/Google/LDAP) | Identity for policy and reporting | **Cato SCIM provisioning** (Entra ID, Okta, OneLogin), Identity Agent for user awareness [S21] | **Google Workspace SCIM is not in Cato's documented list** — for Google-identity schools, validate the identity design (e.g. SAML SSO + provisioning approach) in discovery [S21]. |

---

## 3. Recommended migration path

Anchored to Cato's published guidance: phased migration, pilot first, avoid big-bang cutover;
Cato and partner professional services assist with policy conversion [S13][S14]. Phase names
below follow the standard Cato PS arc — discovery → co-existence design → pilot → phased
cutover → optimise/decommission.

### Phase 0 — Discovery and inventory (weeks 1–2)

- **Steering inventory** (*recommended practice*): enumerate every path into iboss —
  PAC file URLs and their GPO/MDM distribution scope, cloud connector fleet by OS
  (including Chromebook extension count), GRE/IPsec tunnels per site, DNS-redirection zones,
  and any proxy chaining from on-prem gateways.
- **Policy export**: extract iboss web categories, allow/block lists, per-group overrides,
  SSL decryption bypass lists, CASB/DLP rules and ZTNA app definitions. Map to Cato Internet
  firewall categories, TLS inspection rules, App Control and Private Access policies —
  expect re-authoring, not import [S13].
- **Identity**: document the directory source (Entra ID, Google Workspace, on-prem AD), group
  structures used in iboss policy, and per-OU policy tiers (year groups/staff in education).
- **Dependency register**: SaaS tenant restrictions and third-party allowlists keyed to iboss
  dedicated IPs [S7]; apps pinned to the iboss root CA; any local iboss on-prem gateways.
- **Cato design inputs**: PoP selection, Socket vs IPsec per site, allocated-IP count [S20],
  TLS inspection scope and bypass strategy [S11].

### Phase 1 — Co-existence design and foundation build (weeks 2–4)

- Stand up the Cato account: sites, SCIM/identity integration [S21], baseline Internet
  firewall and TLS inspection policy using Cato best practices [S11], Content Restrictions
  for education tenants [S12], recommended CASB/DLP starter policy [S18].
- **Certificate strategy**: push the **Cato root certificate** to all endpoints alongside the
  existing iboss root CA *before* any steering change — Cato documents the certificate as
  mandatory for TLS inspection, downloadable from CMA, deployable via MDM [S11][S22].
  Removing the iboss CA comes last, not first (*recommended practice*).
- Define the co-existence rules: which cohorts/sites steer to Cato, which stay on iboss, and
  the rollback lever for each (see §4).

### Phase 2 — Pilot (weeks 4–8)

- Pick a pilot cohort that exercises the risky bits: one school/site with a tunnel, one
  roaming-agent cohort, IT staff first [S13][S14].
- **Agent swap, cohort by cohort**: uninstall/disable the iboss cloud connector and deploy
  the Cato Client via MDM in the same maintenance window per device ring [S15][S16].
  *Recommended practice:* never run both agents steering simultaneously on one device —
  two TLS-intercepting redirection agents create hard-to-diagnose breakage; sequence the
  swap atomically per device.
- **Site pilot**: replace the site's GRE/IPsec-to-iboss tunnel with a Cato Socket (preferred,
  adds HA/QoS) or IPsec to the nearest Cato PoP [S13].
- Validate: category parity on a test URL list, TLS inspection (Cato provides test
  articles [S11]), SafeSearch/YouTube enforcement [S12], ZTNA app access [S17], user-level
  reporting in CMA, and SaaS logins via the new allocated egress IPs.

### Phase 3 — Phased cutover (weeks 8–16, sized to estate)

- Roll cohorts/sites in waves — Cato's published pattern: pilot/critical sites, then regional
  or mid-tier waves, then the long tail with zero-touch provisioning [S13][S14].
- Education pattern (*recommended practice*): cut over **per OU/year-group/school**, aligned
  to the existing iboss group-policy tiers, so filtering levels move with the cohort and
  safeguarding staff can verify each wave.
- In parallel per wave: update SaaS tenant IP restrictions to include Cato allocated IPs
  *before* the wave moves (run both vendors' IPs in the allowlist during transition) [S7][S20];
  re-point PAC-configured browsers to direct/Client steering; retire the wave's tunnels.
- Re-point identity/reporting integrations (SIEM export, safeguarding/monitoring tools) as
  each wave completes.

### Phase 4 — Optimise and decommission (weeks 16+)

- Tune policies from live CMA analytics; tighten TLS inspection bypasses; enable remaining
  services (RBI on uncategorised sites [S19], DLP content profiles [S18]).
- **Decommission order** (*recommended practice*): (1) disable iboss steering — remove PAC
  distribution, retire connectors and tunnels; (2) remove iboss dedicated IPs from SaaS
  allowlists once logs show no residual use; (3) remove the iboss root CA from endpoints via
  MDM; (4) revoke iboss directory/SIEM integrations; (5) terminate the subscription only
  after a full reporting-retention window has been archived (statutory safeguarding logs in
  education).

---

## 4. Co-existence and rollback

- **PAC as the fallback rail.** Where steering is PAC-based, keep the iboss PAC hosted and
  unchanged throughout the project. Rollback for a browser-steered cohort is then a single
  GPO/MDM change re-pointing to the old PAC (*recommended practice*; PAC hosting behaviour
  per iboss guidance [S5]).
- **Agent cohorts.** Rollback = re-enable the iboss cloud connector profile and remove the
  Cato Client via the same MDM ring used for deployment [S16]. Keep the iboss tenant licensed
  and policies frozen (change-freeze on the legacy side) until the wave is signed off.
- **Sites.** Run the Cato Socket in-line while leaving the legacy tunnel configured but
  down; rollback is re-enabling the tunnel and re-pointing the default route
  (*recommended practice*).
- **Certificates.** Because both root CAs are deployed side by side from Phase 1, TLS
  inspection works in either direction during co-existence; certificate removal is deferred
  to decommission, so rollback never breaks HTTPS [S11][S22].
- **Do not split a single device between both clouds.** Per-user/per-OU waves keep each
  device wholly on one vendor at a time; avoid designs where iboss handles some categories
  and Cato others for the same endpoint (*recommended practice* — two MITM chains).
- **Success gates per wave** (*recommended practice*): helpdesk ticket rate vs baseline,
  category-parity spot checks, safeguarding-report continuity, SaaS login success from new
  egress IPs.

---

## 5. Gotchas and objection handling

| Gotcha / objection | Reality and handling |
|---|---|
| **"iboss gives us CIPA-grade education filtering — SafeSearch, YouTube controls, Google service granularity."** [S8] | Cato documents Content Restrictions with SafeSearch and YouTube Moderate/Strict enforcement [S12]. Demo it, and be upfront about the documented DoH caveat (manage DoH via browser policy) [S12]. For fine-grained Google-service controls (e.g. per-service Google filtering, image/translate specifics), run a feature-parity check against the customer's actual iboss ruleset in discovery rather than asserting parity. UK schools: map requirements to DfE filtering-and-monitoring standards rather than US CIPA language. |
| **Chromebook estates.** | iboss covers Chromebooks via a Chrome extension [S10]; Cato's documented Client OS list is Windows/macOS/Linux/iOS/Android [S15]. For Chromebook-heavy schools this is the first technical qualification question — establish the supported approach with Cato PS/product before committing a migration plan. |
| **SaaS allowlists keyed to iboss dedicated egress IPs.** [S7] | Every SaaS tenant restriction, partner firewall rule and exam/assessment platform allowlist keyed to iboss IPs must be found and dual-listed with Cato allocated IPs before cutover [S20]. Missing one is the classic "migration broke X" incident. The default Cato licence includes 3 allocated IPs — size this early if the customer needs regional egress or more IPs [S20]. |
| **Per-user reporting expectations.** | Education and government customers use iboss reporting as safeguarding/compliance evidence [S8]. Show CMA user-level analytics and SIEM export during the pilot, and archive the iboss reporting history before termination (*recommended practice*). |
| **"iboss is now single-vendor SASE too."** | Its SD-WAN launched May 2024 [S9], versus Cato's converged cloud-native SD-WAN + security platform operating since 2015-era and validated across the Gartner single-vendor SASE market [S13][S14]. Probe the maturity of the SD-WAN estate: routing features, socket hardware ecosystem, global private backbone, last-mile HA. |
| **"Dedicated per-tenant containers are more secure than multi-tenant clouds."** [S1] | Acknowledge the architecture; reframe on outcomes: what matters is inspection quality, policy convergence and operations. Also note Gartner's caution that iboss depth in SaaS/API security lags [S3]. |
| **Identity: Google Workspace schools.** | Cato documents SCIM for Entra ID, Okta and OneLogin [S21]; Google-identity estates need an agreed identity design (SSO/provisioning path) validated in discovery — do not hand-wave this. |
| **Proxy-pinned apps and PAC sprawl.** | Years of PAC exceptions encode tribal knowledge. Harvest the PAC/bypass lists as the seed for Cato TLS-inspection bypasses and firewall exceptions [S11] — it is the cheapest policy-mining asset in the whole project (*recommended practice*). |
| **Latency/SLA comparison.** | iboss publishes seven-nines availability and a 100 ms latency SLA [S3]. Do not counter with invented numbers — position Cato's PoP proximity, private backbone and published uptime commitments, and prove latency empirically in the pilot. |

---

## 6. Sources

- [S1] iboss — Containerized SASE Architecture: https://www.iboss.com/containerized-architecture
- [S2] iboss — Platform / Revolutionary Architecture: https://www.iboss.com/platform/revolutionary-architecture
- [S3] Gartner Magic Quadrant for SSE 2024 (iboss Niche Player; strengths/cautions) — reprint summaries: https://www.nomios.com/news-blog/magic-quadrant-sse-2024/ and https://zerotrust.cio.com/wp-content/uploads/sites/64/2024/05/Gartner-Reprint.pdf
- [S4] Citrix SD-WAN and iboss cloud integration (GRE/IPsec to iboss gateway nodes): https://docs.netscaler.com/en-us/citrix-sd-wan/current-release/security/citrix-sd-wan-secure-web-gateway/iboss-integration.html
- [S5] cloudDNA — iboss FAQs (connectors, PAC behaviour, root MITM certificate): https://clouddnagroup.com/iboss-faqs/ and iboss solution brief: https://www.iboss.com/solution-briefs/connecting-users-and-devices-to-iboss-cloud/
- [S6] Citrix blog — redirecting traffic to CSIA/iboss (tunnel use cases): https://www.citrix.com/blogs/2021/06/07/citrix-tips-redirecting-traffic-to-citrix-secure-internet-access-service/
- [S7] iboss — Dedicated Cloud IPs / retain your IP identity: https://www.iboss.com/platform/dedicated-cloud-ips/ and https://www.iboss.com/platform/retain-your-unique-ip-address-identity-in-the-cloud/
- [S8] iboss — K-12 / CIPA web filtering: https://www.iboss.com/k12 and https://www.iboss.com/education/web-filtering-for-cipa-compliance/ ; CEN deployment example: https://ctedunet.net/web-filtering/
- [S9] PRWeb (6 May 2024) — iboss announces Zero Trust SD-WAN for single-vendor SASE: https://www.prweb.com/releases/iboss-announces-zero-trust-sd-wan-to-deliver-single-vendor-secure-access-service-edge-sase-302136462.html
- [S10] Gartner Peer Insights — iboss likes & dislikes: https://www.gartner.com/reviews/market/security-service-edge/vendor/iboss/likes-dislikes
- [S11] Cato Learning Center — TLS inspection: Getting Started with Cato Certificates: https://support.catonetworks.com/hc/en-us/articles/32115505825821-Getting-Started-with-Cato-Certificates ; Best Practices for TLS Inspection: https://support.catonetworks.com/hc/en-us/articles/360007713437-Best-Practices-for-TLS-Inspection ; Configuring TLS Inspection Policy: https://support.catonetworks.com/hc/en-us/articles/4413273491857-Configuring-TLS-Inspection-Policy-for-the-Account
- [S12] Cato Learning Center — Restricting Content for Internet Traffic (SafeSearch, YouTube Moderate/Strict, DoH caveat): https://support.catonetworks.com/hc/en-us/articles/4413273491089-Restricting-Content-for-Internet-Traffic
- [S13] Cato Networks — How to Implement SASE (architecture and migration checklist): https://www.catonetworks.com/glossary/how-to-implement-sase/
- [S14] Cato Networks — SASE as a Gradual Deployment: https://www.catonetworks.com/resources/sase-as-a-gradual-deployment/ ; Best Plan your SASE Migration: https://www.catonetworks.com/resources/learn-how-to-best-plan-your-sase-migration/
- [S15] Cato Learning Center — Installing the Cato Client (OS support): https://support.catonetworks.com/hc/en-us/articles/31661535809821-Installing-the-Cato-Client
- [S16] Cato Learning Center — Distributing Cato Clients to Devices / MDM deployment: https://support.catonetworks.com/hc/en-us/articles/6266279769245-Distributing-Cato-Clients-to-Devices and https://support.catonetworks.com/hc/en-us/sections/31674677797405-Deploying-Cato-Clients-via-MDMs
- [S17] Cato Learning Center — What is Cato's ZTNA Solution: https://support.catonetworks.com/hc/en-us/articles/6266293423773-What-is-Cato-s-ZTNA-Solution ; Configuring the Private Access Policy: https://support.catonetworks.com/hc/en-us/articles/35809693069213-Configuring-the-Private-Access-Policy ; Zero Trust Access to Private Applications: https://support.catonetworks.com/hc/en-us/articles/27495962097565-Zero-Trust-Access-to-Private-Applications-with-the-Cato-SASE-Cloud
- [S18] Cato Learning Center — Application Control (CASB): https://support.catonetworks.com/hc/en-us/sections/5546785297437-Application-Control-CASB ; What is the Cato DLP Service: https://support.catonetworks.com/hc/en-us/articles/5606495447197-What-is-the-Cato-DLP-Service ; Default Recommended CASB/DLP Policy: https://support.catonetworks.com/hc/en-us/articles/24373653130781-Using-the-Default-Recommended-CASB-DLP-Policy
- [S19] Cato Networks — Instant RBI announcement (Authentic8 partnership): https://www.catonetworks.com/news/cato-networks-introduces-instant-rbi-featuring-single-click-activation/ ; Securing Browsing Sessions Through RBI: https://support.catonetworks.com/hc/en-us/articles/9797956517533-Securing-Browsing-Sessions-Through-RBI
- [S20] Cato Learning Center — Allocating IP Addresses for the Account (3 IPs in default licence): https://support.catonetworks.com/hc/en-us/articles/4413273467153-Allocating-IP-Addresses-for-the-Account ; NAT egress rules: https://support.catonetworks.com/hc/en-us/articles/360000163245-How-to-Configure-a-Network-Rule-to-Egress-Traffic
- [S21] Cato Learning Center — Provisioning Users with SCIM (Entra ID, Okta, OneLogin): https://support.catonetworks.com/hc/en-us/articles/13651160092701-Provisioning-Users-with-SCIM ; SCIM with Entra ID: https://support.catonetworks.com/hc/en-us/articles/13651160164253-SCIM-Provisioning-with-Entra-ID-formerly-Azure
- [S22] Cato Learning Center — Installing the Root Certificate for TLS Inspection: https://support.catonetworks.com/hc/en-us/articles/4416504789393-Installing-the-Root-Certificate-for-TLS-Inspection
