# Capture staging list — wanted screenshots that need tenant config or a live action

89 of the 150 still-wanted captures need setup a clean tenant can't provide by navigation.
You're working these in your own tenant — each bucket's heading says what to set up first.

**How to hand back:** name each file anything, drop it in the library root or `_extract/media/`,
and tell Claude the file→page mapping. It crops, catalogues, embeds and ships. Avoid real names on screen.
Auto-regenerated from live capture-wanted comments (embedded ones drop off). Full list: `CAPTURE-LIST.md`.

## BGP / Interconnect — bring up an eBGP handoff (or Cross-Connect site) so Show BGP Status is Established and the routing table shows learned routes  (14)

- migration-checkpoint: Network → Sites → Site Settings → BGP "Show BGP Status" for a socket–Gaia eBGP transit-VLAN handoff
- migration-cisco: Network → Routing Table filtered to the pilot prefixes, showing BGP-learned overlay routes via the hub handoff
- migration-edgeconnect: Network → Routing Table filtered to the exchanged prefixes — EC-fabric routes learned over the hub handoff with AS path and received communities
- migration-edgeconnect: Site Settings → BGP — Show BGP Status with the EC hub neighbour Established and learned routes listed
- migration-fortinet: Network → Routing Table filtered to the pilot prefixes, showing BGP-learned legacy routes with AS path and received communities
- migration-fortinet: Site Settings → BGP — Show BGP Status with the neighbour Established and learned routes listed
- migration-palo-alto: Network → Sites → Site Settings → BGP "Show BGP Status" for a socket–firewall eBGP handoff
- migration-versa: Network → Routing Table filtered to the pilot and overlay prefixes, showing BGP-learned routes with AS path and received communities
- migration-versa: Site Settings → BGP — Show BGP Status with the neighbour Established and learned routes listed
- network-cloud-interconnect: Monitor → Topology — a connected Cloud Interconnect site alongside socket and vSocket sites
- network-cloud-interconnect: Network → Sites — Cloud Interconnect site-creation flow showing connection type and primary/secondary PoP selection
- network-cloud-interconnect: Site Configuration → Cloud Interconnect — BGP peer definition showing MD5, metrics and primary/secondary PoP
- network-cloud-interconnect: Site Configuration → Cloud Interconnect — BGP status showing learned/advertised subnets over a live circuit
- security-firewall-refresh: Network → Sites → Site Settings → BGP "Show BGP Status" for a socket–appliance eBGP transit-VLAN handoff

## Client-side end-user view — needs a real Client/browser showing the block / anonymise / SCIM-disabled experience  (6)

- access-byod-clientless: RBI-isolated portal session — download/copy attempt refused in the browser
- management-soc-xdr: the Manage Story dialog with Analyst Verdict, Analyst Severity, Status and Classification set, plus the story timeline widget after closure
- migration-cisco: Access → Always-On Policy — a rule scoped to the pilot cohort with the bypass passcode dialog
- network-agility-mna: CMA "Activate New Socket" notification / Assign Cato Socket to Site dialogue during zero-touch activation
- security-data-casb-dlp: Cato Client block notification pop-up from a DLP Data Control rule, showing a customised notification template
- security-finance-dora: Monitor → Events filtered to the staged-incident window on the Anti-malware preset, with the CSV export dialog open

## Events / evidence — create the named pilot rule, generate matching traffic, then filter Monitor→Events (allow beside attempted-access block, by user)  (27)

- access-identity-design: CMA Monitor → Events — before/after pair: IP-only event beside named-user event from the same pilot subnet
- access-offshore-bpo: CMA Monitor → Events — one agent identity, named-rule allows beside an attempted-access WAN block
- access-third-party: CMA Monitor → Events — one contractor identity, named-rule allows beside an attempted-access WAN block
- migration-checkpoint: Monitor → Events filtered to TLSi-decrypted pilot traffic showing first-time detections surfaced after staging
- migration-cloudflare: Monitor → Events filtered to pilot rules showing Internet-firewall Block and DNS Protection verdicts attributed to a named pilot user
- migration-edgeconnect: Monitor → Events filtered to the pilot site — firewall and IPS events attributed to named users, no SSE service chain in path
- migration-forcepoint: Monitor → Events filtered to pilot Internet-firewall and Data Control rules, Block/Prompt and DLP monitor events attributed to a named pilot user
- migration-iboss: Monitor → Events filtered to a pilot user showing Internet-firewall category verdicts and Content Restrictions activity attributed by name
- migration-netskope: Monitor → Events filtered to pilot App Control and Data Control rules, showing CASB and DLP verdicts attributed to a pilot cohort user by name
- migration-palo-alto: Monitor → Threats Dashboard showing IPS monitor-mode events for a pilot site, then a blocked test detection
- migration-sophos: Monitor → Events filtered to one monitor-mode (Allow + Event) rule from the translated slice, showing the per-rule hit evidence
- migration-symantec: Monitor → Events filtered to pilot Internet-firewall rules, showing Block and Prompt verdicts attributed to a named pilot user
- migration-zscaler: Monitor → Events filtered to converted Internet-firewall rules, showing Block and Prompt hits attributed to a pilot user by name
- network-cloud-datacenter: Home → Events filtered to one WAN Firewall rule showing site and SDP-user sources to a cloud-site destination
- network-global-expansion: Home → Events filtered to a single new site's first hour — Internet Firewall events hitting pre-existing global rules
- security-consistent: Monitor → Threats Dashboard after the EICAR tests, showing the Anti-Malware detections for both paths
- security-healthcare-nhs: Monitor → Events — LAN Firewall events for an IoMT VLAN showing east-west flows to clinical and corporate VLANs in monitor mode
- security-inbound-ips: Monitor → Events filtered to the allocated IP — allowed inbound flows alongside IPS/scanner block events against the same address
- security-legal-confidentiality: CMA Monitor → Events — cross-wall WAN Firewall block event attributed to a named user, beside the same user's own-matter allow
- security-ot-iot: Assets → Device Inventory Segmentation Flows Sankey for an OT VLAN, protocols and destinations visible
- security-ot-iot: Monitor → Events filtered to LAN Firewall events showing a blocked east-west flow from a corporate host to the OT VLAN
- security-ransomware: Monitor → Events filtered to the Suspicious Activity sub-type — SAM findings from real pilot traffic
- security-ransomware: Monitor → Events — the blocked WAN Firewall event for the agreed lateral-movement test flow
- security-retail-pci: Home → Devices → Segmentation tab — Segmentation Flows Sankey for a store site (device type → application → protocol → destination)
- security-retail-pci: Monitor → Events filtered to LAN Firewall block events — a guest Wi-Fi client stopped from reaching a POS/CDE address
- security-tls-inspection: Monitor → Events before/after pair — EICAR over HTTPS downloading for an uninspected user vs. Anti-Malware block event for an inspected pilot user
- security-uk-public-sector: Monitor → Events filtered to IPS and Anti-Malware events for a pilot site, monitor-mode window

## Other staged state (a specific rule/profile/filter that must exist first)  (19)

- access-remote-worker: CMA Connection Details for the same user after remediation — the Wi-Fi node back to Good (the "after" half of the before/after proof)
- ai-eu-ai-act: Stories Workbench — a story raised from prompt-level User Interaction Policy detections (prompt-level detects surface as XDR stories, not as exportable Monitor→Events rows)
- ai-legal-genai: CMA Monitor → Data Protection Dashboard — Legal ML classifier matches on Generative AI Tools traffic over a pilot period
- management-asset-discovery: Assets → Device Inventory grid grouped by Site, one pilot site expanded, device count and attribute columns visible
- management-vendor-consolidation: Administration → Audit Trail filtered to the PoV window, showing network and security policy changes interleaved in one attributed log
- management-visibility: Monitor → App Analytics, Users tab filtered to the pilot site — usernames, applications and usage on one screen
- migration-checkpoint: Monitor → Threats Dashboard showing IPS monitor-mode verdicts for a pilot site, then a blocked test detection with block page
- migration-directaccess: CMA Access → Always-On Policy — DA-Pilot rule with bypass settings
- migration-netskope: Security → WAN Firewall rule scoped to a pilot user group allowing a named private app behind a DC Socket — the NPA-replacement rule
- migration-versa: Monitor → Data Protection Dashboard — monitor-mode DLP matches attributed to user, app and data type
- network-agility-mna: Administration → Audit Trail filtered to the pilot window — site create, socket assign, policy publish, bandwidth edit and site delete attributed to one named admin with previous/new values
- network-global-app-performance: Monitor → Topology — two long-haul pilot sites homed to their nearest PoPs with the backbone path between them
- security-compliance: Administration → Audit Trail filtered to a pilot window, showing attributed policy changes with previous and new values
- security-data-casb-dlp: Cloud Apps / Applications Dashboard on pilot traffic — sanctioned vs unsanctioned counts and App Risk widget
- security-dlp-forensics: Audit Trail filtered to the pilot's DLP configuration changes — Store DLP Evidence enablement and admin permission grant with previous/new values
- security-dlp-forensics: Evidence viewer after View Evidence → Confirm — the matched snippet from a staged fictional-data incident
- security-finance-dora: Administration → Audit Trail filtered to the PoV window, one change expanded to show previous and new values
- security-firewall-refresh: Monitor → Threats Dashboard showing IPS monitor-mode verdicts for a pilot site, then a blocked test detection with block page
- security-healthcare-nhs: Assets → Device Inventory filtered to one hospital-style site with the OS / OS version column visible, showing devices on unsupported operating systems

## Posture — a Device Posture profile (AV + disk-encryption/cert checks) + a Client Connectivity rule requiring it; the dialog/event shots also need a real device that FAILS a check  (6)

- access-hybrid-workforce: Cato Client blocked dialog — Details naming the failed device check
- migration-anyconnect: CMA Access → Client Connectivity Policy — wave-group rule, posture Any, Allow WAN and Internet
- migration-anyconnect: Monitor → Events — Client Connectivity block event naming the failed posture check for a wave device
- migration-cloudflare: Access → Client Connectivity Policy rule referencing a Device Posture profile, with the Client-side posture-failure message
- migration-directaccess: CMA Access → Client Connectivity Policy — DA-Pilot rule, posture Any, Allow WAN and Internet
- migration-directaccess: CMA Access → Device Posture — DA-Pilot profile with device-certificate + disk-encryption checks

## Reports — generate/schedule the specific report and open the delivered PDF  (0)


## Resilience drill — perform the timed drill (link pull / HA failover) and capture the mid-drill Real-Time / Events state  (9)

- access-offshore-bpo: CMA Experience Monitoring user drill-down — cohort user on the Johannesburg PoP with the VDI application selected
- network-ipsec-asa: Monitor → Topology — the IPsec site shown on the secondary PoP mid-failover drill
- network-resilient-site-design: Home → Events filtered to Connectivity sub-types for one site across a drill window (Connected, Reconnected, Passive Connected, Socket Fail-Over)
- network-resilient-site-design: Network → Sites → Site Monitoring → Real Time — Transport tab during a link pull, throughput shifting to the surviving link and the LTE link activating
- network-resilient-site-design: Socket Actions menu showing Activate Manual HA Failover / Stop HA Failover
- network-sdwan: Home → Events filtered to Connectivity / Failover sub-type for a pilot site
- network-sdwan: Network → Sites → Site Monitoring → Real Time — Transport tab during a link pull, throughput shifting to the surviving link
- security-finance-dora: Monitor → Experience Monitoring site view spanning a failover drill window, scores before/during/after visible
- security-ransomware: Monitor → Threats Dashboard after the delivery drill — Anti-Malware detections from site and SDP-user paths in one view

## Rule with data — create the named pilot rule and let hit/detection counts accrue before capturing  (8)

- access-offshore-bpo: CMA Applications Portal — only CRM and VDI published to a BPO cohort group, opening through RBI
- access-remote-worker: CMA Home → Experience Monitoring — Remote Users tab filtered to the complaint application, cohort-wide, for the timed "is it just me" check
- ai-eu-ai-act: AI Security → User Access Policy — detection counts accumulating on an Engage User rule during the monitor-first week
- migration-anyconnect: CMA Security → WAN Firewall — wave-group parity rules named after the old ACL entries, hit counts accruing
- migration-sophos: Security → TLS Inspection — policy with a pilot-cohort-scoped Inspect rule above the default bypass rules
- migration-symantec: Monitor → Cloud Apps Dashboard app inventory filtered to the pilot cohort — sanctioned/unsanctioned apps with risk scores, the CloudSOC Audit comparison artefact
- migration-versa: Monitor → Cloud Apps Dashboard — shadow-IT discovery with risk scores for a pilot cohort
- security-ransomware: Security → LAN Firewall — a LAN Network rule with nested LAN Firewall rules and hit counts on a pilot Socket site
