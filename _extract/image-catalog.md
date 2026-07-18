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
