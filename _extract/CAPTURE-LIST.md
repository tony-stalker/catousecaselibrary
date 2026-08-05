# Capture shopping list — demo-tenant screenshots wanted by the PoV runbooks

Regenerated 157 live `capture-wanted` items across 57 pages
(auto-drops any that have since been embedded). Grouped by CMA area for an efficient capture session.

**Self-serve workflow** — capture in your own tenant, then hand back for embedding:
1. Grab each shot in the CMA (demo mode or your personal tenant); avoid any real names on screen.
2. Name it anything and drop it in the library root or `_extract/media/` (HEIC or PNG both fine).
3. Tell Claude which files map to which pages — it crops chrome, catalogues, embeds and ships.
Regenerate this file: `grep -rn capture-wanted usecases/*.html`. Config-dependent shots are in `CAPTURE-STAGING.md`.

## AI Security (10)

- **access-offshore-bpo**: CMA Monitor → Events — one agent identity, named-rule allows beside an attempted-access WAN block
- **ai-agentic-security**: AI Security → Agent Sessions session detail — prompts, tool calls and tool results for one complete session
- **ai-agentic-security**: AI Security → Local Agents inventory with one instance drilled into (MCP servers, tools, licence type)
- **ai-agentic-security**: AI Security → Managed Agents inventory after a platform API integration
- **ai-eu-ai-act**: AI Security → User Access Policy — detection counts accumulating on an Engage User rule during the monitor-first week
- **ai-eu-ai-act**: AI Security → User Interaction Policy — rule editor showing a pilot-group rule with the Anonymize and Monitor action and a user notification template
- **ai-eu-ai-act**: Monitor → Events filtered to AI Security events with the CSV export action visible
- **ai-homegrown-apps**: AI Security → Guards — guard details page showing endpoint, headers, guard API keys and sample integration code
- **security-ai**: AI Security → User Interaction Policy rulebase with a monitor-mode rule showing its Detection Count
- **security-ai-visibility**: CMA AI Security → User Interaction Policy — a monitor-mode rule scoped to an assessment cohort

## API & automation (4)

- **management-api-automation**: Administration → API & Integrations, API Keys tab showing a View key and an Edit key with expiry and IP allowlist set
- **management-api-automation**: a Cato event rendered in a SIEM (e.g. Sentinel or Splunk) via an Event Integration
- **management-api-automation**: terminal output of terraform plan/apply for a cato_wf_rule with parallelism=1
- **management-soc-xdr**: Home → Detection & Response Policy, a Response Policy rule with the Event response, beside the resulting Detection and Response event in a SIEM

## Access — Identity (0)


## Access — Portal & clientless (1)

- **access-offshore-bpo**: CMA Applications Portal — only CRM and VDI published to a BPO cohort group, opening through RBI

## Access — Posture & Client policies (7)

- **migration-anyconnect**: CMA Access → Client Connectivity Policy — wave-group rule, posture Any, Allow WAN and Internet
- **migration-anyconnect**: Monitor → Events — Client Connectivity block event naming the failed posture check for a wave device
- **migration-cisco**: Access → Always-On Policy — a rule scoped to the pilot cohort with the bypass passcode dialog
- **migration-cloudflare**: Access → Client Connectivity Policy rule referencing a Device Posture profile, with the Client-side posture-failure message
- **migration-directaccess**: CMA Access → Always-On Policy — DA-Pilot rule with bypass settings
- **migration-directaccess**: CMA Access → Client Connectivity Policy — DA-Pilot rule, posture Any, Allow WAN and Internet
- **migration-directaccess**: CMA Access → Device Posture — DA-Pilot profile with device-certificate + disk-encryption checks

## Assets — Device Inventory (4)

- **management-asset-discovery**: Assets → Device Inventory grid grouped by Site, one pilot site expanded, device count and attribute columns visible
- **security-healthcare-nhs**: Assets → Device Inventory filtered to one hospital-style site with the OS / OS version column visible, showing devices on unsupported operating systems
- **security-ot-iot**: Assets → Device Inventory Segmentation Flows Sankey for an OT VLAN, protocols and destinations visible
- **security-retail-pci**: Home → Devices → Segmentation tab — Segmentation Flows Sankey for a store site (device type → application → protocol → destination)

## Client-side (end-user view) (2)

- **access-hybrid-workforce**: Cato Client blocked dialog — Details naming the failed device check
- **migration-anyconnect**: Cato Client for Windows connected via the nearest PoP — post-swap wave device

## Monitoring — Events (27)

- **access-hybrid-workforce**: CMA Monitor → Events — one user, same WAN rule hit from office and remote origins
- **access-identity-design**: CMA Monitor → Events — before/after pair: IP-only event beside named-user event from the same pilot subnet
- **access-third-party**: CMA Monitor → Events — one contractor identity, named-rule allows beside an attempted-access WAN block
- **management-asset-discovery**: Device Inventory Quick View of an unexpected/unmanaged device showing attributes, events and accessed apps
- **migration-cloudflare**: Monitor → Events filtered to pilot rules showing Internet-firewall Block and DNS Protection verdicts attributed to a named pilot user
- **migration-edgeconnect**: Monitor → Events filtered to the pilot site — firewall and IPS events attributed to named users, no SSE service chain in path
- **migration-iboss**: Monitor → Events filtered to a pilot user showing Internet-firewall category verdicts and Content Restrictions activity attributed by name
- **migration-palo-alto**: Monitor → Threats Dashboard showing IPS monitor-mode events for a pilot site, then a blocked test detection
- **migration-sophos**: Monitor → Events filtered to one monitor-mode (Allow + Event) rule from the translated slice, showing the per-rule hit evidence
- **migration-symantec**: Monitor → Events filtered to pilot Internet-firewall rules, showing Block and Prompt verdicts attributed to a named pilot user
- **migration-zscaler**: Monitor → Events filtered to converted Internet-firewall rules, showing Block and Prompt hits attributed to a pilot user by name
- **network-cloud-datacenter**: Home → Events filtered to one WAN Firewall rule showing site and SDP-user sources to a cloud-site destination
- **network-global-expansion**: Home → Events filtered to a single new site's first hour — Internet Firewall events hitting pre-existing global rules
- **network-ipsec-asa**: Monitor → Events — tunnel Disconnected/Connected pair around the ASA reload, timeline connection log alongside
- **network-resilient-site-design**: Home → Events filtered to Connectivity sub-types for one site across a drill window (Connected, Reconnected, Passive Connected, Socket Fail-Over)
- **network-sdwan**: Home → Events filtered to Connectivity / Failover sub-type for a pilot site
- **security-consistent**: Monitor → Events filtered by one Internet Firewall rule name, showing a site-sourced event and an SDP-user event side by side with identity attribution
- **security-data-casb-dlp**: Events page filtered to Data Control events with the export dialog — the match report as the customer sees it
- **security-finance-dora**: Monitor → Events filtered to the staged-incident window on the Anti-malware preset, with the CSV export dialog open
- **security-finance-dora**: a correlated Detection & Response story generated from a staged benign incident — timeline and related events on one screen
- **security-inbound-ips**: Monitor → Events filtered to the allocated IP — allowed inbound flows alongside IPS/scanner block events against the same address
- **security-legal-confidentiality**: CMA Monitor → Events — cross-wall WAN Firewall block event attributed to a named user, beside the same user's own-matter allow
- **security-legal-confidentiality**: CMA Monitor → Events — one identity, the same wall-rule block from office, remote and public Wi-Fi source contexts
- **security-ransomware**: Monitor → Events filtered to the Suspicious Activity sub-type — SAM findings from real pilot traffic
- **security-ransomware**: Monitor → Events — the blocked WAN Firewall event for the agreed lateral-movement test flow
- **security-tls-inspection**: Monitor → Events before/after pair — EICAR over HTTPS downloading for an uninspected user vs. Anti-Malware block event for an inspected pilot user
- **security-uk-public-sector**: Monitor → Events filtered to IPS and Anti-Malware events for a pilot site, monitor-mode window

## Monitoring — Experience (8)

- **access-offshore-bpo**: CMA Experience Monitoring user drill-down — cohort user on the Johannesburg PoP with the VDI application selected
- **access-remote-worker**: CMA Connection Details for the same user after remediation — the Wi-Fi node back to Good (the "after" half of the before/after proof)
- **access-remote-worker**: CMA Home → Experience Monitoring — Remote Users tab filtered to the complaint application, cohort-wide, for the timed "is it just me" check
- **management-dem**: an application drill-down where the app scores Poor on TTFB while the Connection Details chain is green end to end — the "not the network" verdict
- **migration-directaccess**: Cato Client connected on macOS beside the same user's row in Experience Monitoring
- **network-global-app-performance**: Home → Experience Monitoring — Applications drill-down for a WAN-hosted app showing TTFB trend across a multi-week window
- **network-sdwan**: Home → Experience Monitoring — Sites tab drill-down for a branch site over a multi-week window
- **security-finance-dora**: Monitor → Experience Monitoring site view spanning a failover drill window, scores before/during/after visible

## Monitoring — Sites & real time (10)

- **network-cloud-datacenter**: Network → Sites → Site Monitoring → Real Time — cloud site throughput during a timed branch-to-VPC transfer
- **network-global-app-performance**: Monitor → Topology — two long-haul pilot sites homed to their nearest PoPs with the backbone path between them
- **network-global-app-performance**: Site Monitoring → Real Time — Transport tab for a long-haul site: Distance, jitter and loss flat across a baseline week
- **network-global-expansion**: Monitor → Topology showing a newly connected site in a new region on its in-region PoP, beside the existing estate
- **network-global-expansion**: Site Monitoring → Real Time for a new-region site — last-mile round-trip to the local PoP
- **network-mpls-migration**: Monitor → Topology showing an MPLS-site prefix reachable behind the DC socket during co-existence
- **network-resilient-site-design**: Monitor → Topology — HA site expanded showing Ready with the Connected / Keepalive / Compatible Version indicators
- **network-resilient-site-design**: Network → Sites → Site Monitoring → Real Time — Transport tab during a link pull, throughput shifting to the surviving link and the LTE link activating
- **network-sdwan**: Network → Sites → Site Monitoring → Real Time — Transport tab during a link pull, throughput shifting to the surviving link
- **network-sdwan**: Site Monitoring → Real Time — QoS tab under congestion: P10 steady, default class Queue Size climbing

## Monitoring — Threats & stories (5)

- **management-soc-xdr**: Home → Stories Workbench, Security Operations preset grouped by Indication — group headers showing high/medium/low criticality counts
- **migration-checkpoint**: Monitor → Threats Dashboard showing IPS monitor-mode verdicts for a pilot site, then a blocked test detection with block page
- **security-consistent**: Monitor → Threats Dashboard after the EICAR tests, showing the Anti-Malware detections for both paths
- **security-firewall-refresh**: Monitor → Threats Dashboard showing IPS monitor-mode verdicts for a pilot site, then a blocked test detection with block page
- **security-ransomware**: Monitor → Threats Dashboard after the delivery drill — Anti-Malware detections from site and SDP-user paths in one view

## Network — Egress & inbound (3)

- **migration-iboss**: Network → IP Allocation with allocated egress IPs bound to a NAT network rule
- **security-inbound-ips**: Network → IP Allocation showing a static IP allocated at the London PoP
- **security-inbound-ips**: Security → Remote Port Forwarding rule — external allocated IP/port mapped to an internal test-service IP/port, with an Allow List of permitted source ranges

## Network — Routing & BGP (13)

- **migration-checkpoint**: Network → Sites → Site Settings → BGP "Show BGP Status" for a socket–Gaia eBGP transit-VLAN handoff
- **migration-cisco**: Network → Routing Table filtered to the pilot prefixes, showing BGP-learned overlay routes via the hub handoff
- **migration-edgeconnect**: Network → Routing Table filtered to the exchanged prefixes — EC-fabric routes learned over the hub handoff with AS path and received communities
- **migration-edgeconnect**: Site Settings → BGP — Show BGP Status with the EC hub neighbour Established and learned routes listed
- **migration-fortinet**: Network → Routing Table filtered to the pilot prefixes, showing BGP-learned legacy routes with AS path and received communities
- **migration-fortinet**: Site Settings → BGP — Show BGP Status with the neighbour Established and learned routes listed
- **migration-palo-alto**: Network → Sites → Site Settings → BGP "Show BGP Status" for a socket–firewall eBGP handoff
- **migration-sophos**: Network → Sites — new Socket site with native range, alongside the IPsec IKEv2 hub site with BGP configured
- **migration-versa**: Network → Routing Table filtered to the pilot and overlay prefixes, showing BGP-learned routes with AS path and received communities
- **migration-versa**: Site Settings → BGP — Show BGP Status with the neighbour Established and learned routes listed
- **network-cloud-interconnect**: Site Configuration → Cloud Interconnect — BGP peer definition showing MD5, metrics and primary/secondary PoP
- **network-cloud-interconnect**: Site Configuration → Cloud Interconnect — BGP status showing learned/advertised subnets over a live circuit
- **security-firewall-refresh**: Network → Sites → Site Settings → BGP "Show BGP Status" for a socket–appliance eBGP transit-VLAN handoff

## Network — Rules & QoS (3)

- **network-agility-mna**: Administration → Audit Trail filtered to the pilot window — site create, socket assign, policy publish, bandwidth edit and site delete attributed to one named admin with previous/new values
- **network-global-app-performance**: Network → Network Rules — Route via PoP rule editor with an egress PoP location selected for a SaaS app
- **network-mpls-migration**: Network → Network Rules showing a voice rule with Packet Loss Mitigation enabled and a P10 bandwidth priority

## Network — Sites & tunnels (8)

- **migration-cloudflare**: Network → Sites IPsec IKEv2 site with primary and secondary tunnels up (a re-pointed Magic WAN edge)
- **migration-zscaler**: Network → Sites IPsec IKEv2 site to a third-party SSE cloud with both tunnels up (interim ZIA bridge)
- **network-cloud-datacenter**: Monitor → Topology — a cloud vSocket site rendered beside physical sites, both tunnels up
- **network-cloud-datacenter**: Network → Sites — vSocket HA status: primary active, secondary standby, keepalive Ok
- **network-cloud-interconnect**: Monitor → Topology — a connected Cloud Interconnect site alongside socket and vSocket sites
- **network-cloud-interconnect**: Network → Sites — Cloud Interconnect site-creation flow showing connection type and primary/secondary PoP selection
- **network-ipsec-asa**: Monitor → Topology — the IPsec site shown on the secondary PoP mid-failover drill
- **network-ipsec-asa**: Network → Sites → Site Settings → IPsec — Primary and Secondary tunnel config with Init/Auth parameters set to the GCM sheet

## Other (25)

- **access-byod-clientless**: RBI-isolated portal session — download/copy attempt refused in the browser
- **ai-genai-security**: Browser plugin enforcing on an off-net device — the in-browser anonymise or block notice in Chrome
- **management-dem**: the Show Full Traceroute Data panel open, with the copy control visible
- **management-soc-xdr**: Detection & Response story detail — criticality score, MITRE ATT&CK mapping and evidences table on one screen
- **management-soc-xdr**: Security → Connectors showing the Microsoft Defender for Endpoint connector connected alongside Cato sources
- **management-soc-xdr**: the Manage Story dialog with Analyst Verdict, Analyst Severity, Status and Classification set, plus the story timeline widget after closure
- **management-visibility**: Monitor → App Analytics, Users tab filtered to the pilot site — usernames, applications and usage on one screen
- **migration-anyconnect**: CMA Security → WAN Firewall — wave-group parity rules named after the old ACL entries, hit counts accruing
- **migration-cisco**: Security → DNS Protection — the eight protections with actions set to Allow (monitor) for the PoV
- **migration-forcepoint**: Access → Proxy Configuration Policy rulebase serving a transitional PAC to a straggler group
- **migration-iboss**: Security → IPS Content Policy tab with SafeSearch enforced and YouTube Moderate/Strict selected
- **migration-netskope**: Security → WAN Firewall rule scoped to a pilot user group allowing a named private app behind a DC Socket — the NPA-replacement rule
- **migration-symantec**: Monitor → Cloud Apps Dashboard app inventory filtered to the pilot cohort — sanctioned/unsanctioned apps with risk scores, the CloudSOC Audit comparison artefact
- **migration-versa**: Monitor → Cloud Apps Dashboard — shadow-IT discovery with risk scores for a pilot cohort
- **network-agility-mna**: CMA "Activate New Socket" notification / Assign Cato Socket to Site dialogue during zero-touch activation
- **network-agility-mna**: Sockets & Accessories showing a decommissioned Socket back in Installed state, ready for reassignment
- **network-global-expansion**: Network → Sites → Site Configuration → General — Preferred PoP Location section with Automatic + City set
- **network-ipsec-asa**: Site Connection Status — live IKEv2 phase 1/2 state showing the negotiated parameters
- **network-mpls-migration**: Network → Sites → Site Configuration → Networks showing a Routed range with the MPLS CE LAN IP as Gateway
- **network-resilient-site-design**: Socket Actions menu showing Activate Manual HA Failover / Stop HA Failover
- **security-data-casb-dlp**: Cloud Apps / Applications Dashboard on pilot traffic — sanctioned vs unsanctioned counts and App Risk widget
- **security-dlp-forensics**: Evidence viewer after View Evidence → Confirm — the matched snippet from a staged fictional-data incident
- **security-legal-confidentiality**: CMA Security → WAN Firewall — symmetric wall rule pair scoped to two IdP matter-team groups
- **security-retail-pci**: Network → Sites → Networks for a store site showing POS/CDE, guest, staff and cameras/IoT ranges
- **security-tls-inspection**: Security → Certificate Management — active certificate with expiry and PEM/DER download options

## Reports & Audit (6)

- **management-api-automation**: Administration → Audit Trail entry for an API-key change showing previous and new values
- **management-dem**: Home → Reports — a recurring Site and User Experience report schedule with a customer mailing list
- **management-vendor-consolidation**: Administration → Audit Trail filtered to the PoV window, showing network and security policy changes interleaved in one attributed log
- **management-visibility**: Home → Reports, Saved Reports tab showing a recurring report's schedule and mailing list
- **security-compliance**: Administration → Audit Trail filtered to a pilot window, showing attributed policy changes with previous and new values
- **security-finance-dora**: Administration → Audit Trail filtered to the PoV window, one change expanded to show previous and new values

## Security — DLP & Data Protection (9)

- **ai-genai-security**: Events filtered to the four recommended AI DLP rules — the match report as the data owners review it
- **ai-legal-genai**: CMA Monitor → Data Protection Dashboard — Legal ML classifier matches on Generative AI Tools traffic over a pilot period
- **migration-forcepoint**: Monitor → Events filtered to pilot Internet-firewall and Data Control rules, Block/Prompt and DLP monitor events attributed to a named pilot user
- **migration-netskope**: Monitor → Events filtered to pilot App Control and Data Control rules, showing CASB and DLP verdicts attributed to a pilot cohort user by name
- **migration-versa**: Monitor → Data Protection Dashboard — monitor-mode DLP matches attributed to user, app and data type
- **security-data-casb-dlp**: Cato Client block notification pop-up from a DLP Data Control rule, showing a customised notification template
- **security-dlp-forensics**: Audit Trail filtered to the pilot's DLP configuration changes — Store DLP Evidence enablement and admin permission grant with previous/new values
- **security-dlp-forensics**: Security → Data Types & Profiles → Settings tab — Store DLP Evidence toggle, Store original files upon match checkbox and the locked encryption checkbox
- **security-legal-confidentiality**: CMA Monitor → Events — DLP monitor event matching the Legal ML classifier profile on an upload to personal storage

## Security — LAN Firewall (10)

- **management-asset-discovery**: Security → LAN Firewall rule with device-attribute criteria and Track = Event, plus the resulting LAN Firewall events in Monitor → Events
- **security-firewall-refresh**: Security → LAN Firewall global rulebase with rules scoped per site/VLAN and a block rule between VLANs
- **security-healthcare-nhs**: Monitor → Events — LAN Firewall events for an IoMT VLAN showing east-west flows to clinical and corporate VLANs in monitor mode
- **security-healthcare-nhs**: Security → LAN Firewall — LAN Network rule scoped to one site's IoMT VLAN with a catch-all Allow · Event rule above the default ANY-ANY Block
- **security-ot-iot**: LAN Firewall rule editor with an OT VLAN as Source, device-attribute criteria (e.g. Type = PLC) and Track = Event set
- **security-ot-iot**: Monitor → Events filtered to LAN Firewall events showing a blocked east-west flow from a corporate host to the OT VLAN
- **security-ot-iot**: Security → LAN Firewall rulebase showing a LAN Network rule scoped to one site/VLAN with its child rules and the default ANY-ANY Block as the last rule
- **security-ransomware**: Security → LAN Firewall — a LAN Network rule with nested LAN Firewall rules and hit counts on a pilot Socket site
- **security-retail-pci**: Monitor → Events filtered to LAN Firewall block events — a guest Wi-Fi client stopped from reaching a POS/CDE address
- **security-retail-pci**: Security → LAN Firewall rulebase with a LAN Network rule scoped to a store's VLANs — catch-all Allow · Event rule above the default ANY-ANY Block

## Security — TLS Inspection (2)

- **migration-checkpoint**: Monitor → Events filtered to TLSi-decrypted pilot traffic showing first-time detections surfaced after staging
- **migration-sophos**: Security → TLS Inspection — policy with a pilot-cohort-scoped Inspect rule above the default bypass rules
