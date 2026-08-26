# Image Catalog — Cato Networks PPT Extracts

Source directory: `/Users/tonystalker/Documents/claude/usecaselibrary/_extract/media/`

Note: `cato-sase-platform-ai-security-pov_s09_9.png` and `cato-sase-platform-visibility-pov_s20_0.png` are near-identical PoP world maps — use one, not both, if they land on the same page.

## ai-security-use-cases_s01_0.png
- **Shows:** Cato platform "onion" diagram on a dark background: a large green outer ring labeled "SASE" containing an inner ring labeled "SSE 360", with a dark core labeled "Single Pass Cloud Engine (SPACE)". White connector lines radiate out to circular line-icons: WWW cloud, SaaS cloud, IaaS cloud, and IoT on the right; a user, a database, and an office building on the left. No other text.
- **Quality:** good
- **Recommend:** embed — platform-overview visual for AI security (or any) use-case intro; illustrates SPACE at the core of SASE/SSE 360 connecting users, sites, data, WWW, SaaS, IaaS, IoT.

## cato-inbound-ips-use-case_s01_0.png
- **Shows:** A 3D-rendered metallic green torus/ring on a transparent background. Cato brand decoration, no text or data.
- **Quality:** good (but decorative-only)
- **Recommend:** skip — template decoration, carries no information.

## cato-inbound-ips-use-case_s01_1.png
- **Shows:** The Cato Networks wordmark logo ("CATO" in large letters, "NETWORKS" spaced beneath) in light gray/white on transparent background.
- **Quality:** good
- **Recommend:** skip — company logo, not use-case content.

## cato-inbound-ips-use-case_s02_0.png
- **Shows:** The ISO 27001:2022 certification badge: blue "ISO" lettering over a globe graphic, circular text "International Organization for Standardization", and "27001:2022" beneath.
- **Quality:** good
- **Recommend:** skip — third-party certification logo/badge (could optionally decorate a compliance page, but it is a logo, not a diagram).

## cato-inbound-ips-use-case_s02_1.png
- **Shows:** The UK "Cyber Essentials Certified" badge: blue arched shield shape with a green/blue tick mark, text "CYBER ESSENTIALS" at top and "CERTIFIED" at bottom.
- **Quality:** good
- **Recommend:** skip — third-party certification logo/badge.

## cato-inbound-ips-use-case_s05_0.png
- **Shows:** A decorative icon: green circle containing a white disc with a sparkle/AI glyph, surrounded by light circuit-board trace lines. No text.
- **Quality:** good (but decorative-only)
- **Recommend:** skip — generic AI decoration, no informational content.

## cato-inbound-ips-use-case_s07_0.png
- **Shows:** A webpage-style graphic titled "Rapid CVE Mitigation by Cato Security Research" (green heading). Intro text explains OWASP's definition of virtual patching and that Cato performs virtual patching via the IPS layer of the Single Pass Cloud Engine (SPACE), with Cato experts deploying new IPS rules without customer involvement. Below, a table "Selected Critical CVEs mitigated by Cato" lists: GNU telnetd Authentication Bypass, CVE-2026-24061, severity 9.8 (Critical), Detect to Protect 2 days (detection Jan 23 2026, global protection Jan 25 2026); "React2Shell" Vulnerability Targeting React Server Components, CVE-2025-55182, severity 10 (Critical), 2 days; Open-WebUI External Model Server Code Injection, CVE-2025-64496, severity 8 (Critical), 0 days.
- **Quality:** good
- **Recommend:** embed — inbound IPS / virtual patching use case; strong proof point of detect-to-protect speed.

## cato-inbound-ips-use-case_s08_0.png
- **Shows:** Flow diagram of inbound IPS protection. Left: two user icons — one sending "HTTP Request" (path marked with a green check) and one sending "Malicious Request / SQLi/XSS/XCE/RCE etc" (path marked with a red X). Both target a "Dedicated IP" on a large green circle labeled "Cato PoP Single Pass Cloud Engine IPS". The legitimate request continues right as "Remote Port Forward to On-Prem Resource" over a "DTLS tunnel to PoP" arrow ending at a building/server icon with a small green socket appliance. The malicious request is blocked at the PoP edge.
- **Quality:** good
- **Recommend:** embed — core topology diagram for the inbound IPS use case (dedicated IP, IPS scrubbing at the PoP, remote port forwarding to on-prem).

## cato-sase-platform-ai-security-pov_s03_0.png
- **Shows:** The Gartner corporate logo (blue "Gartner" wordmark with ® symbol).
- **Quality:** good
- **Recommend:** skip — analyst-firm logo.

## cato-sase-platform-ai-security-pov_s04_1.png
- **Shows:** The Gartner corporate logo again (duplicate of s03_0 at slightly different size).
- **Quality:** good
- **Recommend:** skip — analyst-firm logo (duplicate).

## cato-sase-platform-ai-security-pov_s05_1.png
- **Shows:** A grid of 16 glossy 3D circular buttons representing converged capabilities, in three rows of green shades (dark to light). Row 1: SD-WAN, Accelerate, MPLS, Optimize, Monitor, AIOps. Row 2: NGFW (colored orange, with a small brick-wall/flame firewall icon beside it), IPS, EDR/EPP, DLP, SWG, RBI. Row 3: AI Security, XDR, ZTNA, CASB. No connecting lines — a capability-stack visual.
- **Quality:** good
- **Recommend:** embed — single-vendor SASE platform convergence graphic; suits platform-overview or vendor-consolidation sections (networking + security + AI capabilities in one platform).

## cato-sase-platform-ai-security-pov_s06_1.png
- **Shows:** A single flat-design icon: dark green shield with a white circular center containing a gray power-button symbol. No text.
- **Quality:** good (but decorative-only)
- **Recommend:** skip — standalone icon extracted from a larger slide graphic.

## cato-sase-platform-ai-security-pov_s06_12.png
- **Shows:** A small clip-art cluster of gray clouds bearing app logos/labels: salesforce, SAP, box, Office 365, and "WWW". A fragment of a larger destination-cloud graphic.
- **Quality:** low-res (small raster, ~260px wide)
- **Recommend:** skip — diagram fragment, too small to embed on its own; the full version appears inside de-risking-3rd-party-access-use-case_s05_0.png.

## cato-sase-platform-ai-security-pov_s09_10.png
- **Shows:** A tiny rotated green text label reading "Global Private Backbone" on transparent background. Fragment of a larger diagram.
- **Quality:** low-res (text snippet only)
- **Recommend:** skip — stray text-label fragment.

## cato-sase-platform-ai-security-pov_s09_9.png
- **Shows:** A light-gray world map with roughly 80 green ring markers denoting Cato PoP locations, concentrated in North America, Europe, East/Southeast Asia, with additional markers across South America, Middle East, India, Africa, and Australia/New Zealand. No text or legend.
- **Quality:** good
- **Recommend:** embed — Global Private Backbone / PoP coverage visual; pair with a caption stating PoP count. Near-duplicate of cato-sase-platform-visibility-pov_s20_0.png.

## cato-sase-platform-visibility-pov_s04_1.png
- **Shows:** The Gartner corporate logo (blue wordmark with ®), same as the two copies above.
- **Quality:** good
- **Recommend:** skip — analyst-firm logo (third duplicate).

## cato-sase-platform-visibility-pov_s20_0.png
- **Shows:** The same light-gray world map with green PoP ring markers as cato-sase-platform-ai-security-pov_s09_9.png; this variant includes a few extra markers (e.g., Alaska, southern Africa). No text or legend.
- **Quality:** good
- **Recommend:** embed — Global Private Backbone / PoP coverage visual (choose this or s09_9, not both on one page).

## data-breach-investigation-use-case_s02_0.png
- **Shows:** Screenshot of the Cato Management Application (CMA) "Data Incident" detail pane (DLP incident drill-down). Header row: Time 2026/04/23 12:35:48, User Aaron Huggins, Violation CC-UK, Action Block (red icon). Details section lists: Action Block; User Name Aaron Huggins; User Email aaron.huggins@catonetworks.com; Application Microsoft Copilot; Category "General, Business Systems, Business Information, Generative ..."; App Activity Type Upload; Application Risk 2; File Type Microsoft Office Documents; File Name "Document with CC Information.doc"; Full Path URL https://catonetworks-my.sharepoint.com/personal/aaron_hug...; Rule "Copilot restrict PII"; DLP Profiles CC-UK; Matched Data Types "Credit card numbers [Universal]". A "Forensics" section below shows a locked "Evidence is Secured" panel with a privacy notice and a green "View Evidence" button.
- **Quality:** good
- **Recommend:** embed — data breach investigation / DLP forensics use case; also relevant to GenAI (Copilot) data-security pages. Shows blocked credit-card-data upload to Microsoft Copilot with secured evidence workflow.

## data-security-use-cases_s03_0.png
- **Shows:** A humorous internet meme photo: a crying toddler in a toy store labeled "CISO", surrounded by toy dinosaurs labeled with security problems: "3 new shadow SaaS apps discovered", "Agentic AI identities with no governance", "Users granted local admin privilege", "300 global administrators in Azure", "Compromised 3rd party accessing VPN", "40 identities compromised by fake DocuSign email".
- **Quality:** fuzzy (compressed meme photo)
- **Recommend:** skip — meme/stock photo of a child; unsuitable tone and unclear licensing for a reusable HTML library. The threat labels are useful copy — lift them as text bullets instead.

## de-risking-3rd-party-access-use-case_s05_0.png
- **Shows:** ZTNA device-posture topology diagram. Center: a large green Cato PoP location-pin ring sitting on an elliptical "Global Private Backbone" with two smaller PoP pins. Right: three user icons with shield badges — "Compliant Posture Authorised User" (green), "Not Compliant Posture Authorised User" (orange), "Not Compliant Posture Not Authorised User" (red). Left/top destinations: "Public Cloud Resources" (Azure cloud with a Cato vSocket box), an X1500 Cato Socket appliance fronting two server racks labeled "On-site resources", and a gray cloud cluster of apps (salesforce, SAP, box, Office 365, WWW). Dashed flow lines: green (compliant user) reaches Azure, on-site resources, and web apps; orange (authorized but non-compliant device) is blocked with red X marks before Azure and before on-site resources but still reaches the WWW cloud; red (non-compliant, non-authorized) is blocked with a red X before even reaching the Cato PoP.
- **Quality:** good
- **Recommend:** embed — third-party access / ZTNA device posture use case; clearly shows graduated access decisions by user authorization plus device posture.

## manufacturing-device-security-use-case-overiview_s05_0.png
- **Shows:** CMA screenshot of a "New Rule" dialog (IoT/OT firewall policy). Collapsible sections General, Source, and Device (expanded). Under "Device Attributes", the "Device Attributes Type" dropdown is open showing options: Category, Type, Model, OS, Manufacturer. Below is a "Platforms" section with a "Search or select Operating System" field.
- **Quality:** good
- **Recommend:** embed — manufacturing / IoT-OT device security use case; shows how device-attribute-based rules are created in CMA.

## manufacturing-device-security-use-case-overiview_s05_2.png
- **Shows:** CMA screenshot of a rule "Criteria" panel with Device Attributes: "Device Attributes Type" set to Manufacturer with value chip "Siemens"; beneath, a criteria table listing attribute/value pairs: category = OT, type = PLC, model = S7-300, manufacturer = Siemens (each row with a delete icon).
- **Quality:** good
- **Recommend:** embed — manufacturing OT security; concrete example of targeting a Siemens S7-300 PLC by device attributes.

## manufacturing-device-security-use-case-overiview_s06_0.png
- **Shows:** CMA firewall rule-base screenshot with a collapsed group "Normal Rules (1-11)" and an expanded group "IOT Device Attribute Rules (12-16)". Columns: #, Name, Source, Criteria, App/Category, Service/Port, Action, Track, Hit Count. Rules: 12 "IP Camera" (Source IOT; Criteria Category IoT AND Type IP Camera AND Manufacturer Reolink AND OS Firmware; Allow; Event; 194 hits), 13 "Smart Plug" (Category IoT AND Type Smart Plug; Allow; 59 hits), 14 "Monitor Mobile phones" (Category Mobile; Allow; 37.2K hits), 15 "IOT Discovery" (Source Any; Category IoT +2; Allow; 14K hits), 16 "block TP-LINK to internet" (Category Networking; Block, red icon; 193.7K hits).
- **Quality:** good
- **Recommend:** embed — manufacturing / IoT device security; shows a real device-attribute rule set including allow-with-logging and a block rule with hit counts.

## migration-use-case-overiview_s03_0.png
- **Shows:** MPLS-to-Cato migration coexistence topology. Left: "Bristol" site, 192.168.1.0/24, switch to an X1500 Cato Socket (DHCP) with dual uplinks (Broadband and 4G) to a Cato PoP. Center: large green circle "CATO Global WAN — Full Mesh, Multiple Tier 1 Providers, 99.999% SLA" with the CATO logo and "CATO Global WAN Optimizations: TCP Proxy, Packet Loss Mitigation, Optimal Routing with carrier diversity"; four "Cato PoP" nodes on the ring; purple routing table below: "192.168.1.0/24 > Bristol socket, 192.168.2.0/24 > London socket, 192.168.3.0/24 > London socket". Top: blue "Internet" cloud with annotations "Internet traffic goes via Cato PoP" (Bristol side) and "Internet traffic goes via local firewall" (London side). Right: "London DC", 192.168.2.0/24, with X1700 Cato Socket "(or IPsec from Cato to local firewall)", a Local Firewall (brick icon), a router, purple routing notes "Internet > Local Firewall, 192.168.1.0/24 > Cato socket, 192.168.3.0/24 > MPLS router", and a blue "MPLS" cloud linking to "Leeds 192.168.3.0/24" with a router icon.
- **Quality:** good
- **Recommend:** embed — MPLS-to-SASE migration use case; the key diagram showing phased coexistence of Cato sockets, legacy MPLS, and local firewall during migration.

## wip-helping-achieve-compliance-with-cato-networks_s07_0.png
- **Shows:** The NIST Cybersecurity Framework 2.0 wheel: five outer segments — Identify (blue), Protect (purple), Detect (orange), Respond (red), Recover (green) — around a yellow inner ring labeled Govern, with "NIST Cybersecurity Framework" in the white center.
- **Quality:** good
- **Recommend:** embed — compliance use case; standard NIST CSF 2.0 function wheel for framing how Cato capabilities map to the framework.

## genai-report-usage.png (assets/img — from AI Security Visibility Assessment deck s14)
- **Shows:** CMA "GenAI Report — Last 14 Days", GenAI Usage page. Left: "Top Categories by Usage" horizontal bars (Generative AI Tools 9.64 GB, Conversational AI 4.42 GB, Productivity 2.93 GB, down to Office Programs 457 MB). Right: "Top Risky GenAI Applications" table — Cube, Playground, Nate AI Chat, Resemble AI, Playground AI, Designs.ai — all Medium risk, Unsanctioned, with user counts. Bottom: "User Activities Over Time" line chart with legend (Third Party Login, Execute (MCP), Download, Login, Conversation, Upload, CopilotInteraction) — Copilot interactions dominate, peaking ~2K/day.
- **Quality:** good
- **Recommend:** embed — GenAI visibility assessment use case; the shadow-AI discovery evidence a customer sees in week 2.

## genai-report-data-protection.png (assets/img — from AI Security Visibility Assessment deck s15)
- **Shows:** CMA "GenAI Report — Last 14 Days", Data Protection page. "Events by Action" donut (1.32K actions, 6 blocked), "Violations by Data Profile" donut (46 violations: PII 31/68%, Finance 13/28%, Credit cards 2/4%), "Rules Hit Count" table (Non-sanctioned apps — Monitor uploads 975; Monitor PII data uploads to Generative AI tools 25; GenAI Sensitive Data — Block 6; etc.), "Data Violations Over Time" line chart. Events created by DLP policy assigned to the GenAI application category.
- **Quality:** good
- **Recommend:** embed — GenAI visibility assessment use case; shows monitor-mode DLP findings against GenAI apps, the core week-3 output.

## cma-ai-security-overview.png (assets/img — CMA screenshot, Jul 2026, demo tenant)
- **Shows:** CMA AI Security → Overview, last month: Violation Rate 22.8%, Total AI Apps 67, AI Users 18, AI Interactions 22.2K; Latest Applications In Use table (Grammarly, ChatGPT, Otter.ai…); Violation Breakdown donut (5.07K violations — Finance & Health Care Team PII Detection 39.9%, Sensitive Business Info for HR/Finance 30.4%, AI Usage and Regulation 16.8%…); Topics Popularity donut (20.3K interactions — business management 61%); Top Interactions Flow Sankey (Copilot enterprise dominant → Safe, thin red Violation band).
- **Quality:** good
- **Recommend:** embed — GenAI visibility assessment; the week-2 sync opener.

## cma-ai-security-discovery.png (assets/img — CMA screenshot, Jul 2026, demo tenant)
- **Shows:** CMA AI Security → Discovery, last month: tiles 67 AI Applications / 18 High-Risk AI Apps / 17 AI Users; inventory table per app: AI Users, AI Interactions, Risk (Copilot enterprise Low 21,228 interactions; ChatGPT High; Grok High; Gemini Medium; Otter.ai High), Category chips, Interceptors (Cato Cloud / Internet Firewall), Last Activity.
- **Quality:** good
- **Recommend:** embed — GenAI visibility assessment; the shadow-AI inventory.

## cma-ai-users.png (assets/img — CMA screenshot, Jul 2026, demo tenant)
- **Shows:** CMA AI Security → AI Users, last month: per-user table (fictional catodemomode.com users) with AI Interactions counts, activity sparklines, Policy Violations (hits + % rate, e.g. 863 hits / 21%), Last Seen dates.
- **Quality:** good
- **Recommend:** embed — GenAI visibility assessment; per-user accountability view.

## cma-internet-fw-rulebase.png (assets/img — CMA screenshot, Jun 2026, demo tenant)
- **Shows:** CMA Security → Internet Firewall, "Active Policy", last updated Jun 29 2026, Internet Firewall Enabled toggle, "Posture Recommendations (8)" button. Rulebase table (#, Name, Source, Criteria, App/Category, Service/Port, Action, Track, Hit Count) with 13 visible rules and live hit-count bars: 1 "Block any P2P" (P2P, Block, 12.8K hits); 2 "Contractor Access - Browser Access Portal Only" (users Sean Wong, Caleb Jacobson; Connection Origin Site +3; Block); 3 "Allow Gemini for org users" (Gemini, Allow, 4.9K hits); 4 "Block risky users to MS apps" (disabled/greyed; criteria User Risk Level Equals or Greater than High; Microsoft Office365 + Azure Front Door; Block; 0 hits); 5 "Lab admin checks funky URLs" (Lab Admin, Parked domains, Allow); 6 "Block QUIC apps" (app GQuic, Block); 7 "Allow QUIC services for pentest" (device DESKTOP-I55VUV0, service QUIC, Allow); 8 "Block QUIC services" (service QUIC, Block, 132.2K hits); 9 "RBI Default Rule" (greyed; Undefined/Uncategorized categories; action RBI Default); 10 "Frank Moons special research" (Frank Moon, Hacking, Allow); 11 "Block protocols Tor, SMB, SMTP" (Tor Network, SMB +1; Block; 412 hits); 12 "Block for Risky Categories" (Criminal Activity, Cheating +12; Block; 199.1K hits); 13 "Prompt for Risky Categories" (Gambling, Sex education +6; Prompt action; 227K hits). All identities are fictional demo users.
- **Quality:** good
- **Recommend:** embed — SWG/Internet-firewall policy conversion pages; single image proving ordered rulebase with hit counts (rationalisation evidence), Prompt vs Block actions, QUIC app+service block pair, user/device-scoped rules, disabled rules, and an RBI default rule.

## cma-wan-fw-rulebase.png (assets/img — CMA screenshot, 2026, demo tenant)
- **Shows:** CMA Security → WAN Firewall, "Published Revision", WAN Firewall Enabled toggle, "Posture Recommendations (5)". Allowlist rulebase (#, Name, Source, Criteria, Direction, Destination, App/Category, Service/Port, Action, Track, Hit Count) with 12 rules, every action Allow: 1 "Cato Patient Portal Access" (dest host 10.251.1.23, bidirectional, 475 hits); 2 "Replications" (Data Centers → Data Centers, SMBV2/SMBV3); 3 "Access to old VMware" (All SDP Users, app VMware); 4 "SMB Internal Access" (sites APAC Office, BCP Larnaca +4 → BCP Larnaca, EBC Cannes +3, Track N/A); 5 "Lab special HTTPS port" (Lab Admin → BCP Larnaca, TCP/7443); 6 "IT support for remote users" (Southern California + Lab Admin +4 → user cassian andor, Tampa Factory +21; TCP/8000, UDP/8000 +10; 101 hits); 7 "Lab Admin ESXi access" (Lab Admin, Frank Moon → 192.168.66.254; HTTP(S), SSH-V1 +2); 8 "Lab Admin JumpBox access" (→ DESKTOP-I55VUV0; ICMP, RDP); 9 "temp rule admin rdp" (→ WestUS-HQ, NewYork HQ; RDP, SSH-V1 +1); 10 "Access to ADP" (app adp); 11 "RnD to Assembly" (site RnD → Yangon Assembly); 12 "Access to new agent" (Louis Lewin → NewYork HQ). Identities fictional demo users.
- **Quality:** good
- **Recommend:** embed — east-west/WAN segmentation conversion pages (Palo Alto, Check Point); shows site/user/host-scoped allowlist rules with direction, service/port pairs and hit counts over an implicit deny.

## cma-tls-inspection-policy.png (assets/img — CMA screenshot, 2026, demo tenant)
- **Shows:** CMA Security → TLS Inspection, "Published Revision", TLS Inspection Enabled toggle, collapsed "Default Bypass Rules" band. 11 ordered rules (Name, Source, Criteria/Platforms, App/Category, Action): 1 "Bypass Sensitive Categories" (Health and Medicine, Government, Finance → Bypass); 2 "Bypass Embedded Operating Systems" (Platforms EMBEDDED → Bypass); 3 "RBI Inspect" (RBI → Inspect, Untrusted Server Certificates: Allow); 4 "Categorised Exceptions" (custom category Inspect_Category_Exceptions → Bypass); 5 "Non Categorised Exceptions" (Expensify Inc., Tp-Link Technologies, Lucid, Microsoft Defender For Endpoint, custom category, domains expensify.com/pypi.org → Bypass); 6 "Device Based Bypass" (Platforms IOS +1 → Bypass); 7 "Source Based Exceptions" (Guest Networks, BYOD Networks, subnet 10.58.0.0/24 and seven host IPs → Bypass); 8 "Inpsection Phase 1" [tenant's own typo] (TLSi Test Networks + Finance Users, Inspect_Phase_1 → Inspect); 9 "Inspection Phase 2" (same sources, Inspect_Phase_2 → Inspect); 10 "Inspect Popular Cloud Apps" (→ Inspect); 11 "Inspect General, Business Information and Compu…" (Business Information → Inspect). Inspect rules all set Untrusted Server Certificates: Allow.
- **Quality:** good
- **Recommend:** embed — TLS inspection staged-rollout page and any policy page discussing SSL/TLS decryption strategy; live proof of bypass-first ordering, sensitive-category and platform bypasses, and phased inspect rules scoped to test networks.

## cma-app-data-inline-policy.png (assets/img — CMA screenshot, 2026, demo tenant)
- **Shows:** CMA App & Data Inline Protection, Application Control Policy tab (Tenant Restriction tab beside it), "Published Revision", Application Control and Data Control toggles both on, "Posture Recommendations (3)". Rule group "Department Specific Rules (1-9)" with Type (App/Data), Name, Source, Application, Criteria, Severity, Action, Tracking: 1 App "Block MS Teams Video" (Microsoft Teams, activity Video Call, High, Block, Event + Subscription); 2 Data "GenAI Sensitive Data" (Marketing + Finance Users, Generative AI Tools, Upload, profiles Credit cards + PII, High, Block); 3 Data "Block uploading credit card numbers" (four departments, Any Cloud Application, Upload, Credit cards, High, Block); 4 App "Microsoft - Only allow the tenant catonetwork…" (Marketing, Microsoft Login, criteria Logged In User CONTAINS @catonetworks.com, Allow); 5 App "Microsoft - Monitor logins for external Micro…" (AcmeCorp Users, Microsoft Login, Login, Monitor); 6 App "OneDrive - Only allow the catonetworks.com t…" (SharePoint and OneDrive Business, Full Path URL CONTAINS catonetworks.sharepoint.com, Allow); 7 App "OneDrive - Block personal OneDrive tenants" (AcmeCorp Users, OneDrive, Medium, Block); 8 App "Gmail - Monitor Gmail attachments" (three departments, Gmail, Add Attachment, Monitor); 9 App "Monitor online storage apps: risk higher than 3" (Online Storage, criteria ISO 27001 is False OR Risk Score Greater than 3, Monitor).
- **Quality:** good
- **Recommend:** embed — CASB/inline-DLP conversion pages (Netskope especially: activity-level app rules, tenant restriction, risk-score criteria mirror Real-time Protection policies); also fits GenAI data-security stories.

## cma-dlp-data-catalogue.png (assets/img — CMA screenshot, 2026, demo tenant)
- **Shows:** CMA Security → Data Types & Profiles → Data Types tab, Data Catalog selected in left nav (other entries: User Defined, Sensitivity Labels, Predefined ML Classifiers, User Defined ML Classifiers, Image ML Classifiers). Table of predefined data types (Name, Description, Data Category, Country, Threshold): "Postal addresses" for Australia (10), Canada (10), Germany (10), Spain (5), France (10), Hong Kong (5) — each described as "This detection is: REGIONAL · GRANULAR" matching regional postal-code/address formats, all in Data Category "Personally Identifiable Information".
- **Quality:** good
- **Recommend:** embed — DLP conversion pages needing the predefined-content story (regional PII data types with tunable thresholds); pairs with cma-dlp-ml-classifiers.png.

## cma-dlp-ml-classifiers.png (assets/img — CMA screenshot, 2026, demo tenant)
- **Shows:** CMA Security → Data Types & Profiles → Data Types tab with "Predefined ML Classifiers" selected in the left nav. Expandable list of 17 document-classifier families detected by machine learning: Analytics, Business, Contracts, Finance, Forms and Reports, HR, Immigration, Job Interview, Legal, Marketing, Medical, Notices and Certificates, Operations, Personal, Project Management, Real Estate, Time Management. Mostly whitespace below the list.
- **Quality:** good (sparse — list view, rows collapsed)
- **Recommend:** embed — DLP conversion pages that map legacy ML/classifier features (Forcepoint Classifiers, Netskope ML) to Cato's predefined ML document classifiers.

## em-home-users.png (assets/img — CMA screenshot, Jul 2026, demo tenant)
- **Shows:** CMA Home → Experience Monitoring landing page, Last 2 Days, **Remote Users tab** active. Summary bar: Current Site Status 24 (17 connected / 2 degraded / 5 disconnected); Applications Experience — WAN Apps 6 (3 Good, 0 Fair, 3 Poor), Internet Apps 1769 (997 Good, 590 Fair, 182 Poor); Current App Integration Status 18 (17 success, 1 failed). Account Experience score graph (Account / Sites / Remote Users lines over green-amber-red bands, 18–19 Jul) beside a Feed of stories: three Site Operations "Link quality SLA — threshold exceeded" and one Account Operations "SaaS Apps Connector Down". Below, the remote-user table (fictional catodemomode.com users: Brandon Hayes, Emily Parker, Amanda Reed, Ashley Cooper) with device name (WinCatoClient26 etc.), Experience chip (all Good), # apps, PoP (Santa Clara / Ashburn2), flows, usage, upload/download and Avg TTFB (61–298 ms).
- **Quality:** good
- **Recommend:** USED — access-hybrid-workforce.html demo runbook ("Zoom out to the whole remote workforce" step, Jul 2026). management-dem.html uses the Sites-tab variant (em-home-sites.png), which shows a Poor entry and better teaches worst-first triage.

## em-home-sites.png (assets/img — CMA screenshot, Jul 2026, demo tenant)
- **Shows:** Same Experience Monitoring landing page, **Sites tab** active; identical summary bar, Account Experience graph and story feed. Sites table: Schiphol Data Center (NL, Amsterdam PoP) scored **Poor** — 455 apps, 19K flows, 601 ms Avg TTFB; Warsaw DC and LaPaz Facilities "No score"; WestUS-HQ Good (Santa Clara PoP, 241K flows, 1.42 GB, Avg TTFB 2s 348ms). Performance View selector ("Application") and Export button visible.
- **Quality:** good
- **Recommend:** embed — management-dem.html demo runbook step 1: the one-screen triage queue with a Poor site sitting at the top and SLA stories in the feed.

## em-connection-details.png (assets/img — CMA screenshot, Jul 2026, demo tenant)
- **Shows:** User drill-down. Top: User Application Experience Score — events list (User Disconnected / Authenticated / Connected, Jul 15 23:30–23:38) beside the score timeline 13–19 Jul with per-day event bubbles; legend catoAdminConsole / All Applications. Below: **Path Analysis → Connection Details** tab, window Jul 15 21:00 – Jul 16 01:00. Node chain: 1 Device → **Wi-Fi (amber)** → LAN Gateway → Last Mile → London PoP → Cato Management Application. Scored rows: Device Hardware **Good** (Avg CPU 19.81%, Avg Memory 43.76%), Wi-Fi **Fair** (Avg Signal Strength −67.43 dBm), LAN Gateway **Good** (0.00% loss, 3 ms), Last Mile **Good** (0% probe loss, 15 ms RTT), Application **Good** (Cato Management Application).
- **Quality:** good
- **Recommend:** embed — management-dem.html solution section: the fault-domain-isolation money shot; one amber node (Wi-Fi, −67.43 dBm = Fair band) against four green ones.

## em-remote-user.png (assets/img — CMA screenshot, Jul 2026, demo tenant)
- **Shows:** User Experience Monitoring drill-down for remote user **Brandon Hayes** (brandon.hayes@catodemomode.com, Active), Site "Remote User", Network Access "WAN and Internet", Apps Experience 30 (23 Good / 5 Fair / 2 Poor), Last Connected PoP Santa Clara. Filter chips: Connection Type Is Remote, Application Is Microsoft Office365. Select Application widget: HTTP(S) 667 MB Good, ChatGPT 78.4 MB Fair, **Microsoft Office365 72.2 MB Fair** (selected), Microsoft General Good, Grok (X.ai) Fair. Office365 detail: Avg TTFB 486 ms, Download 30.5 MB, Upload 41.8 MB, 508 flows. Devices panel: WinCatoClient26, OS 11, Client 6.4.6.8830, Last Internal IP 10.41.80.31, Last External IP 20.245.25.62, ISP Microsoft Corporation. Score graph below with four "Security Block Event for Microsoft Office365" events, Jul 19.
- **Quality:** good
- **Recommend:** USED — access-remote-worker.html (the per-app remote-worker page, Jul 2026): Brandon's per-app drill-down is the page's centrepiece screenshot.

## em-traceroute.png (assets/img — CMA screenshot, Jul 2026, demo tenant)
- **Shows:** Drill-down score panel (events: Routing: BGP Routing Event ×5, Site Socket Bypass ×2; legend skype / All Applications). Below: **Path Analysis → Traceroute** tab with "Show Full Traceroute Data" button, historical window Jul 12 23:18 – Jul 13 01:00, Device Name 2352203831, PoP Destination London (ID: 19). "Last Mile Routes" hop diagram: Office User → Socket → chain of hop nodes — mostly green rings, **one red ring and one amber "+4" collapsed group** — ending at a green Cato PoP.
- **Quality:** good
- **Recommend:** embed — management-dem.html Path Analysis section: continuous traceroute history with per-hop health; where the colour starts tells you whose network is dropping packets.

## em-command-line.png (assets/img — CMA screenshot, Jul 2026, demo tenant)
- **Shows:** Same drill-down; **Path Analysis → Command Line** tab, same historical window and London PoP destination. "Last Mile Hops" MTR-style table, TTL 1–9 with per-hop IP, geolocation, Loss%, Snt, Rcv, Avg/Best/Wrst latency and StdDev: 192.168.1.1 (local, 0%) → **84.65.0.1 Preston, GB — 24.3% loss, avg 269 ms, worst 327 ms** → 63.130.172.29 New York City, US 0% → London GB hops (195.2.2.217, 195.2.8.233, 62.115.61.190, 62.115.122.188 at 3.86%, 62.115.127.101 at 2.97%) → **Cato PoP London 0% loss, avg 6 ms**. 1010 probes sent per hop.
- **Quality:** good
- **Recommend:** embed — management-dem.html runbook "Escalate with evidence" step: the ISP escalation artefact — heavy loss at the first ISP hop, a clean Cato PoP, over a thousand probes.

## cma-bandwidth-management.png (assets/img — CMA screenshot, Jul 2026, demo tenant)
- **Shows:** CMA Network → Bandwidth Management: the priority-tier table, P10–P255 (6 rows). Each tier shows Limits ("Limit only when line is congested"), upload/download limits (percentages for P10–P40, 10 Mbps for P50, none for P255 Default) and its assigned Classes of Traffic — P10 carries voice/video and critical apps, P20 SSH/RDP/backhaul, P30 business apps and SMB, P40 AVD/SFDC egress, P255 default internet traffic.
- **Quality:** good (clean single table, no chrome)
- **Recommend:** USED — migration-edgeconnect-policy.html demo runbook ("Overlay intent lands in network rules" step): the tiers EdgeConnect QoS classes map to. Also a candidate anywhere bandwidth-priority profiles need showing (network-sdwan, other policy pages' QoS rows).

## cma-network-rules.png (assets/img — CMA screenshot, Jul 2026, demo tenant)
- **Shows:** CMA Network → Network Rules, published revision, rules enabled. "Network Rules Insights" AI banner (status checked after publish and every 24h). Custom rules 1–11 (five visible): app-aware match chips (SSH/RDP, ipchicken.com, Bloomberg, Microsoft 365 app group), BW Priority column (P10/P20/P40), routing methods — NAT with named egress PoPs (Los Angeles/Tokyo/Milan), Route via New York, Backhaul via a socket, Route via Sydney/Melbourne — Active TCP Acceleration ticks and per-rule hit counts (199 hits, 1.4M hits). One rule shown disabled (greyed).
- **Quality:** good (wide rulebase view; detail legible in lightbox)
- **Recommend:** USED — migration-edgeconnect-policy.html worked example (after the "After — Cato CMA" table): the real construct the illustrative mapping lands in. Also a candidate for network-agility-mna / network-global-app-performance (egress and routing-method stories).

## cma-ai-access-policy.png (assets/img — CMA screenshot, Jul 2026, demo tenant; top chrome cropped to remove tenant name)
- **Shows:** CMA AI Security → User Access Policy (new AI Security navigation visible: Monitoring Overview/Discovery/AI Users/Session Explorer, Agents, Guards/Homegrown Agents/Interaction Explorer/Managed Agents, Engine Profiles/Playground/Integrations, User Interaction Policy/User Access Policy/Browser Plugin/Agents Policy). "Control AI Application Access" how-it-works banner (Access Policies evaluated before Interaction Policies). Published rulebase, 3 rules: #1 "ChatGPT Free and Personal" (2 apps) → Engage User; #2 "Redirect for High and Critical AI Applications" (risk-tier groups) → Redirect; #3 "Block Gemini" → Block — each with a User Notification template and Detection Count column.
- **Quality:** good (whitespace below rules; detail legible in lightbox)
- **Recommend:** USED — ai-eu-ai-act.html solution section (the "restrict which users reach which AI system" obligation made visible). Also a candidate for security-ai.html / ai-genai-security.html access-tier beats.

## genai-anonymised-prompt.png (assets/img — end-user screenshot, Jul 2026; left sidebar cropped)
- **Shows:** ChatGPT conversation where the submitted prompt reads "Redraft this notice for [NAME_1], DOB 01/01/1988, email [EMAIL_1], account [BANK_ACCOUNT_NUMBER_1]." — the name, email and bank account number replaced in-flight by the User Interaction Policy's Anonymize action before reaching the model (DOB left as-is: not in the detector set; the value is fictional). ChatGPT replies normally ("Please paste the notice you'd like redrafted") with its guided input sheet below — the conversation continues, the data never left.
- **Quality:** good (clean, minimal, tells the whole story in one frame)
- **Recommend:** USED — ai-genai-security.html Govern section (the Anonymize money shot from the user's side). Strong candidate anywhere the Interaction Policy's user experience needs showing (ai-legal-genai, security-ai).

---

## Batch: demo-tenant CMA captures (23 Jul 2026, generic demo-mode — no tenant name, fictional data)

Captured by browser-driving the demo tenant for the PoV runbook capture-wanted list. All cropped
(top global bar removed). 10 embedded (below); the rest are catalogued and available for reuse.
Naming: `cma-<area>-<page>.png`. Regenerate embeds map: grep `capture-wanted` for what still wants a shot.

**Embedded 23 Jul:** cma-home-devices (management-asset-discovery) · cma-ai-uip (ai-genai-security) ·
cma-acc-client-conn (migration-forcepoint, migration-symantec) · cma-sec-dp-dash
(security-data-casb-dlp, security-compliance) · cma-acc-users (migration-netskope) ·
cma-acc-directory (access-identity-design) · cma-home-em-probes (management-dem) ·
cma-ai-session-explorer (security-ai-visibility).

**AI Security area:** cma-ai-overview (violation rate + rule-name breakdown donuts) · cma-ai-discovery
(shadow-AI inventory, risk grades) · cma-ai-users-monitoring (per-user AI accountability) ·
cma-ai-session-explorer *(embedded)* · cma-ai-local-agents (coding-agent inventory) · cma-ai-agent-sessions
(session telemetry list) · cma-ai-agents-overview (interceptor funnel) · cma-ai-agents-policy (monitor-mode
coding-agent guardrails) · cma-ai-guards (guard estate across Proxy/API/AI-Gateway modes) · cma-ai-guards-policy
(per-guard Block/Anonymize rules + violation counts) · cma-ai-homegrown-agents (gateway virtual keys as agents)
· cma-ai-engine-profiles (detector configuration) · cma-ai-playground (test detections before enforcing) ·
cma-ai-interaction-explorer (per-invocation guard detection log) · cma-ai-uip *(embedded)*.

**Security area (7 first-time subjects):** cma-sec-lan-fw (LAN Firewall, site/VLAN-scoped rule + AI insights band)
· cma-sec-ips (IPS per-scope Block actions, Socket-LAN monitor option) · cma-sec-anti-malware (AM + NG-AM + Sandbox
toggles, default rules) · cma-sec-data-types (DLP Profiles tab, predefined vs user-defined) · cma-sec-threats-dash
(all engines blocking, per-signature breakdown, timeline) · cma-sec-dp-dash *(embedded)* · cma-sec-genai-apps-dash
(sanctioned/unsanctioned classification, events-by-action). NOTE: cma-sec-internet/wan/tls re-shoots were NOT kept —
they opened the rule Edit panel and are inferior to the existing cma-*-rulebase embeds.

**Network / Access / Monitoring:** cma-net-sites (estate, connectivity + socket-version widgets) · cma-net-ip-alloc
(allocated egress IPs vs licence pool) · cma-net-routing (routing table, static/directly-connected) · cma-acc-users
*(embedded)* · cma-acc-posture (Device Posture profiles — Resources → Objects → Device Posture) · cma-acc-client-conn
*(embedded)* · cma-acc-directory *(embedded)* · cma-acc-split-tunnel (one exclusion rule) · cma-home-events (4M events,
identity-attributed) · cma-home-app-analytics (bandwidth, top users/apps) · cma-home-em-probes *(embedded)* ·
cma-home-reports (Reports catalogue + PDF preview) · cma-home-devices *(embedded)* · cma-home-stories (Stories
Workbench, criticality banding) · cma-home-topology (radial PoP topology).

Removed as unusable: audit-trail (real-employee email — hygiene), acc-app-portal (misnavigated to Access Overview),
home-em (modal overlay), net-bw + net-rules (duplicates of existing), always-on (empty), ai-gateway/browser-plugin/scout
(empty/placeholder). These + the state-specific wants are in `_extract/CAPTURE-STAGING.md`.

## Batch: personal-tenant staging captures (29–30 Jul 2026, Tony's lab tenant + Entra sandbox)

First hand-back from the CAPTURE-STAGING self-serve workflow: 15 HEIC drops in the library root,
13 kept (converted, cropped, redacted where needed), 10 embedded across 9 want-slots on 5 pages.
Provenance: Tony's personal lab tenant ("The Lab", fictional identities incl. Bruce Banner persona)
plus a wt0hx.onmicrosoft.com Entra developer sandbox (fictional users Grady Archie / Isaiah Langer);
one demo-tenant shot. Redactions: real email/IPs boxed out of the upload-block event pair, tenant slug
boxed out of the extension URL, personal account ID boxed out of the SCIM event; Azure top bar and
client-window surroundings cropped.

**Embedded 30 Jul:** cma-alwayson-pilot-rule (access-hybrid-workforce) · app-portal-enduser
(access-third-party) · cma-user-scim-disabled (access-third-party, access-identity-design,
access-offshore-bpo) · portal-signin-refused (access-third-party, access-offshore-bpo) ·
cma-browser-access-policy (access-byod-clientless — demo tenant) · cma-events-ext-upload-filter +
cma-events-ext-upload-detail (access-byod-clientless, redacted) · browser-ext-connected
(access-byod-clientless, tenant slug redacted) · cma-user-scim-pilot (access-identity-design) ·
azure-scim-deprovision (access-identity-design, Entra provisioning log, top bar cropped).

**Catalogued for reuse:** cma-acc-overview (Access Overview dashboard — remote users per day/country/PoP,
licence usage, policy + posture match widgets; no live want matched) · client-login-refused (Cato Client
V6.8.3 "Login Error — incorrect username" for a SCIM-disabled user; portal variant was embedded instead) ·
cma-events-scim-disabled (CMA System event, Sub-Type SCIM Provisioning, "Current status: disabled",
account ID redacted — pairs with the leaver drills if a CMA-side event shot is ever wanted).

Not kept: upload-block3 (82px fragment) · browser-extension shot without the Connected popup (inferior
duplicate). Source HEICs removed from the library root after processing.

## Batch: browser-driven personal-tenant captures (30 Jul 2026, live session)

Claude drove Tony's browser against the personal lab tenant (Tony logged in; nothing was saved to
the tenant — the ISE-baseline profile and Sophos check were captured in their unsaved New dialogs
and cancelled). Top global bar cropped from all shots. 8 files, 10 embeds across 9 pages.

**Embedded 30 Jul (pm):** cma-posture-profile-corp (access-hybrid-workforce, migration-palo-alto —
7-check Windows corp profile incl. AM/disk-encryption/patch) · cma-posture-profile-baseline
(migration-cisco, security-uk-public-sector — unsaved AM+DE+registry-OS profile) ·
cma-posture-check-sophos (migration-sophos — OPSWAT vendor Sophos Limited + product list) ·
cma-ccp-rule-posture (access-hybrid-workforce — rule editor, posture profile + Allow WAN and
Internet) · cma-policy-changes (security-consistent, network-agility-mna — My Policy Changes,
publish completed + timestamp + Audit Trail link) · cma-em-probes-policy (access-remote-worker —
probes policy, user rule with probe list) · cma-sdp-users-overview (migration-anyconnect —
two connected wave users, per-user throughput).

**Catalogued for reuse:** cma-ccp-rulebase-wide (full Client Connectivity rulebase, 14 rules with
Device Posture Profiles + Action columns — candidate for the anyconnect/directaccess "wave-group
rule, posture Any" wants if a wave-named rule is ever staged) · cma-posture-checks-catalog
(Device Checks tab — check catalogue with categories, vendors and criteria incl. CrowdStrike
version-gate and real-time-protection flags).

## Batch: browser-driven personal-tenant captures (30 Jul 2026, live session)

Claude drove Tony's browser against the personal lab tenant (Tony logged in; nothing was saved to
the tenant — the ISE-baseline profile and Sophos check were captured in their unsaved New dialogs
and cancelled). Top global bar cropped from all shots. 9 files, 10 embeds across 9 pages.

**Embedded 30 Jul (pm):** cma-posture-profile-corp (access-hybrid-workforce, migration-palo-alto —
7-check Windows corp profile incl. AM/disk-encryption/patch) · cma-posture-profile-baseline
(migration-cisco, security-uk-public-sector — unsaved AM+DE+registry-OS profile) ·
cma-posture-check-sophos (migration-sophos — OPSWAT vendor Sophos Limited + product list) ·
cma-ccp-rule-posture (access-hybrid-workforce — rule editor, posture profile + Allow WAN and
Internet) · cma-policy-changes (security-consistent, network-agility-mna — My Policy Changes,
publish completed + timestamp + Audit Trail link) · cma-em-probes-policy (access-remote-worker —
probes policy, user rule with probe list) · cma-sdp-users-overview (migration-anyconnect —
two connected wave users, per-user throughput).

**Catalogued for reuse:** cma-ccp-rulebase-wide (full Client Connectivity rulebase, 14 rules with
Device Posture Profiles + Action columns — candidate for the anyconnect/directaccess "wave-group
rule, posture Any" wants if a wave-named rule is ever staged) · cma-posture-checks-catalog
(Device Checks tab — check catalogue with categories, vendors and criteria incl. CrowdStrike
version-gate and real-time-protection flags).

## Batch: Reports session — generated report PDFs + Reports UI (5 Aug, browser-driven, personal tenant)

Claude drove Tony's browser against the personal lab tenant (Tony logged in). Two benign report
PDFs were generated in the tenant ("Internet Firewall Rule Hit Count - Pilot" and "TLS Inspection -
Pilot Group", both Last Week / London — delete the rows from Home → Reports → Generated PDFs if
unwanted); the GenAI Report was staged in its Generate now drawer and cancelled, nothing else
touched. PDF pages rendered via PyMuPDF at 2x; UI shots cropped 56px (1920w). PII pass: report
cover pages carry the account name so only inner pages were used; exec p3 site name
`tony-sa-hub-azure-vsocket` redacted #555; TLS p5 (real lab hostnames) not used. 7 files,
9 embeds across 7 pages.

**Embedded 5 Aug:** cma-reports-catalog-hitcount (management-vendor-consolidation,
security-compliance — Catalog tab, IFW Hit Count template selected with live Top/Least preview) ·
cma-reports-generated-pdfs (management-vendor-consolidation, security-compliance — Generated PDFs
tab, both new reports Ready atop scheduled-report history) · cma-report-ifw-hitcount-top-least
(security-uk-public-sector, security-firewall-refresh — PDF p3, Top/Least Matched Rules 2.51M→13) ·
cma-report-ifw-hitcount-table (security-firewall-refresh — PDF p4, full rules table with event
counts + last-used) · cma-report-tls-inspected-bypassed (security-tls-inspection — PDF p3,
inspected vs bypassed donuts overall + per OS) · cma-genai-report-generate-cohort
(security-ai-visibility — Generate now drawer, "GenAI Usage - Assessment Cohort", SDP User In
Adele Vance/Alex Wilber, GenAI Usage preview behind) · cma-report-exec-usage-trends
(management-visibility — Executive Report PDF p3 Sites Overview, month of traffic over time +
top sites, one site name redacted).

**Source PDFs kept out of the repo** (scratchpad only): exec-report.pdf pp5/12/14 (users overview,
applications usage, GenAI apps tables) are clean candidates if future wants need them.

## Batch: AI DLP match report — events, incident, forensics (26 Aug, hand-back from personal lab tenant)

Tony ran the `~/Documents/claude/dlp-test-kit/` payloads as file uploads to ChatGPT from the lab
tenant and handed back six HEICs. All four monitor rules built on 5 Aug (rules 54–57) fired.

- **cma-genai-dlp-events-grid.png** — `Monitor → Events` grid, eight ChatGPT upload events, columns
  Time / User / Application / Application Activity / File Name / Rule / DLP Profiles / Action.
  All four recommended rules represented; all actions Allow. (Re-shot with the tenant's typo'd
  pre-existing rule filtered out of the view — see the note below.) No redaction needed: user is the Bruce Banner persona, all filenames are kit
  payloads, no email/tenant slug/account ID on screen. **Embedded** → ai-genai-security.
- **cma-genai-dlp-forensics.png** — composite of two captures: the evidence-access consent dialog
  ("all access and activity are logged and monitored") and the Forensics panel at match 2/3 with
  `AKIAIOSFODNN7EXAMPLE` highlighted. **Embedded** → ai-genai-security.
- **NOT used — Data Incident detail pane** (shot1): leaks `tony.stalker@catonetworks.com`
  (Logged In User), `bruce.banner@sase-experts.co.uk` (real domain), device name `TonyStal-LM-UK`
  ×2 and host MAC `64:4b:f0:24:d4:05`. The page already carries a Data Incident pane at
  `dlp-incident-cma.png` from the demo tenant, so the redaction wasn't worth spending. Kept in
  scratch if a monitor-mode (Allow) incident pane is ever wanted — redact those four fields.
- **Not used — forensics matches 1/3 and 3/3** (GitHub PAT, GitLab PAT): same panel, redundant with
  the AWS one. 3/3 also shows a truncated "Owners: Bruce Bann" line.
- The tenant's pre-existing rule is spelled "DLP - Genrative AI Monitor Up…" and can't be renamed
  or disabled — DLP rules now require a DLP profile, so editing it trips a validation error. Tony
  added a replica File Control rule above it to absorb the match, and filtered the row out of the
  events view for the published capture. If that grid is ever re-shot, keep the filter on.
- **cma-ai-plugin-engage-user.png** (26 Aug) — AI Security Browser Plugin enforcing in Edge on
  `deepseek.com`: Cato-branded modal "Please use AI applications responsibly" with a single PROCEED
  button. This is the **engage-user** outcome, not block or anonymise — captioned as such. Cropped
  to the browser window (drops an adjacent window's contents on the right and the desktop below),
  bottom trimmed to remove an "Activate Windows" watermark, and the toolbar profile avatar
  pixelated (real photo). **Embedded** → ai-genai-security. The block/anonymise variant is still
  wanted so the pair can be shown.
- **cma-ai-plugin-block.png** (26 Aug) — same plugin, **block** outcome: Edge at
  `gemini.google.com/app`, page never renders, Cato card reads "Access restricted — Access to Gemini
  is restricted by your organization." Cropped to the browser window, toolbar avatar pixelated.
  **Embedded** → ai-genai-security, paired with the engage-user notice. This closes the
  browser-plugin want; the anonymise/mask variant was never captured separately and is no longer
  tracked as a want.
- **cma-uip-monitor-interceptors.png** (26 Aug, reference-architecture account) — UIP rulebase
  cropped to the top three rules: same *Remote Access* cohort intercepted three ways (Network /
  Browser Plugin / API Integration), actions Anonymize & Monitor ×2 and Monitor, violation count 12
  on the first. **Embedded** → security-ai-visibility. Rows 4–8 cropped out deliberately: two
  reference groups shown as "(deleted)" and a joke rule name ("Block Queen conversations").
- **NOT used — demo-mode UIP rulebase** (Screenshot 14.21): seven rules with large violation counts
  (1.07K, 1.1K, 310) but every action is **Block** except one Monitor rule sitting at 0, so it
  cannot serve the `security-ai` want, whose page text prescribes a Monitor rule with an accruing
  detection count. Embedding it there would contradict the runbook. Kept in scratch; it is a
  candidate upgrade for `cma-ai-uip.png` on ai-genai-security if a wider rulebase is ever wanted
  (adds the Interception Type column). Note it shows a "Catodemomode.com Users" source group.
- **cma-uip-monitor-detection-count.png** (26 Aug, personal lab tenant) — UIP rulebase, seven rules,
  mixed actions (Engage User / Anonymize & Block / Monitor ×3 / Block ×2) each with a named engine
  profile; *Code Sharing* Monitor rule at violation count 1. **Embedded** → security-ai.
  **PENDING REFRESH:** Tony is generating more detections; UIP violation counts take ~24h to
  surface, so a higher-count re-shoot is expected. Swap in place at the same filename and update
  the figcaption's "first detection" sentence when it arrives.
- **cma-uip-rule-anonymize-monitor.png** (26 Aug, lab) — UIP rule editor for "AI Safety", Action
  dropdown open on all four options with **Anonymize & Monitor** selected; also captures the
  "applications will be added to TLS inspection" notice and the unpublished-revision footnote.
  Cropped to the drawer (drops a HOW IT WORKS banner behind it). **Embedded** → ai-eu-ai-act.
  The want also asked for a notification template, which is not in shot.
- **cma-events-export-dialog.png** (26 Aug) — Events filtered to Sub-Type = Apps Security, 640K
  events over a fortnight, Export Events dialog open over the grid. Top global bar trimmed (avatar
  and Demo chip). **Embedded** → security-data-casb-dlp.
- **cma-story-ai-upload-anomaly.png** (26 Aug) — Stories Workbench detail, "Abnormal Data Upload to
  AI Application by a User", criticality High (7), Producer = Usage Anomaly, 7-step timeline,
  14-day anomaly distribution, entities/top apps/destinations. **Embedded** → security-finance-dora
  (closest want: correlated D&R story with timeline; captioned honestly as a usage anomaly, not a
  staged incident). **Source user name redacted at #555 pending confirmation the persona is
  synthetic** — un-redact from `scratchpad/genai/n3.png` if it is.
- Still wanted for management-soc-xdr: a story with **MITRE ATT&CK mapping and an evidences table**
  — a Usage Anomaly story like the one above carries neither.
- **Product finding (26 Aug, Tony's lab):** prompt-level User Interaction Policy detections do
  **not** produce exportable Monitor → Events rows; they surface as XDR stories instead. The
  ai-eu-ai-act page asserts AI-related events are filterable and CSV-exportable in several places —
  needs verifying against the KB before those claims are trusted in front of a customer.
