/* Cato Use Case Library — catalog of all use cases.
   Single source of truth: drives index cards, filtering, and prev/next pagers.
   status: "ready" | "wip" | "new"   (wip = source deck incomplete, page flags gaps) */
window.UC_CATALOG = [
  /* ---------------- 1 · Access ---------------- */
  {
    id: "access-third-party",
    file: "usecases/access-third-party.html",
    category: "Access",
    title: "De-risking 3rd-Party & Supply Chain Access",
    summary: "Replace legacy VPN access for contractors and suppliers with identity-driven, posture-aware ZTNA — least-privileged access without appliances.",
    tags: ["ZTNA", "Device Posture", "FWaaS", "CASB", "DLP", "Client Connectivity Policy"],
    status: "ready",
    deck: "1 - Access use cases/De-risking 3rd Party Supply Chain Access/De-risking 3rd Party Access Use Case.pptx"
  },
  {
    id: "access-hybrid-workforce",
    file: "usecases/access-hybrid-workforce.html",
    category: "Access",
    title: "Securing the Hybrid Workforce",
    summary: "One consistent, optimised and secure access experience for users in the office, at home, or on the road — universal ZTNA in place of VPN concentrators.",
    tags: ["ZTNA", "Cato Client", "Always-On", "MFA/SSO"],
    status: "new",
    deck: null
  },
  {
    id: "access-offshore-bpo",
    vertical: "BPO",
    file: "usecases/access-offshore-bpo.html",
    category: "Access",
    title: "Offshore Development Centres & BPO Access",
    summary: "Secure thousands of offshore developers and BPO agents — ZTNA, RBI and DLP keep code and customer data in-country while the backbone keeps VDI usable.",
    tags: ["ZTNA", "RBI", "DLP", "VDI", "Offshore"],
    status: "new",
    deck: null
  },
  {
    id: "access-byod-clientless",
    file: "usecases/access-byod-clientless.html",
    category: "Access",
    title: "BYOD & Unmanaged Device Access",
    summary: "Give unmanaged devices, BYOD users and third parties browser-based access — clientless portal, Browser Extension or Enterprise Browser — with RBI and CASB/DLP keeping data off the endpoint.",
    tags: ["Clientless ZTNA", "Enterprise Browser", "Browser Extension", "RBI", "CASB"],
    status: "new",
    deck: null
  },
  {
    id: "access-remote-worker",
    file: "usecases/access-remote-worker.html",
    category: "Access",
    title: "Remote Worker Experience: Per-User, Per-App Assurance",
    summary: "Prove and improve every remote worker's day — always-on Cato Client, nearest-PoP egress, and per-user, per-app Experience Monitoring that turns \"the VPN is slow\" into an evidence-backed fix.",
    tags: ["Experience Monitoring", "DEM", "Cato Client", "Remote Access", "Last Mile"],
    status: "new",
    deck: null
  },

  {
    id: "access-identity-design",
    file: "usecases/access-identity-design.html",
    category: "Access",
    title: "Identity Integration Design",
    summary: "The dependency every deployment shares — SCIM provisioning, Identity Agents, user awareness behind sockets, and SAML/MFA flows designed once, referenced everywhere.",
    tags: ["SCIM", "Entra ID", "User Awareness", "SSO / MFA", "Identity Agent"],
    status: "new",
    deck: null
  },

  /* ---------------- 2 · Management ---------------- */
  {
    id: "management-visibility",
    file: "usecases/management-visibility.html",
    category: "Management",
    title: "Operational & Executive Visibility",
    summary: "Single-pane-of-glass visibility across network, security, users and applications — from live troubleshooting to executive reporting.",
    tags: ["CMA", "Analytics", "DEM", "XDR", "Reporting"],
    status: "ready",
    deck: "2 - Management use cases/Visibility/Cato SASE Platform - Visibility PoV.pptx"
  },
  {
    id: "management-api-automation",
    file: "usecases/management-api-automation.html",
    category: "Management",
    title: "Automation at Scale with API, catocli & Terraform",
    summary: "Deploy and operate hundreds of sites as code — GraphQL API, catocli and the Cato Terraform provider for zero-touch rollout and CI/CD-driven policy.",
    tags: ["GraphQL API", "catocli", "Terraform", "Zero-Touch"],
    status: "new",
    deck: null
  },
  {
    id: "management-dem",
    file: "usecases/management-dem.html",
    category: "Management",
    title: "Proactive Digital Experience Monitoring",
    summary: "See what users actually experience — hop-by-hop path visibility from device to app, so IT finds the fault domain before the helpdesk ticket lands.",
    tags: ["DEM", "Experience Monitoring", "AIOps", "Last Mile"],
    status: "new",
    deck: null
  },

  {
    id: "management-vendor-consolidation",
    file: "usecases/management-vendor-consolidation.html",
    category: "Management",
    title: "Vendor Consolidation & Network TCO",
    summary: "Retire the appliance estate — MPLS, edge firewalls, VPN concentrators, SWG and CASB point products collapse into one platform with one policy and one bill.",
    tags: ["TCO", "Consolidation", "Platform", "OpEx"],
    status: "new",
    deck: null
  },
  {
    id: "management-soc-xdr",
    file: "usecases/management-soc-xdr.html",
    category: "Management",
    title: "SOC Modernisation with XDR & MDR",
    summary: "From alert fatigue across a dozen consoles to correlated incident stories — native XDR on full network telemetry, with 24×7 MDR when the SOC needs depth.",
    tags: ["XDR", "MDR", "SOC", "MITRE ATT&CK", "Incident Response"],
    status: "new",
    deck: null
  },

  {
    id: "management-pov-framework",
    file: "usecases/management-pov-framework.html",
    category: "Management",
    title: "Running a Cato PoV",
    summary: "A repeatable proof-of-value framework — scope, success criteria, test-case tables, weekly cadence and the wrap-up that converts evidence into a decision.",
    tags: ["PoV", "Success Criteria", "Test Cases", "Evaluation", "Framework"],
    status: "new",
    deck: "2 - Management use cases/Visibility/Cato SASE Platform - Visibility PoV.pptx"
  },

  {
    id: "management-asset-discovery",
    file: "usecases/management-asset-discovery.html",
    category: "Management",
    title: "Asset Discovery & Device Inventory (IoT/OT)",
    summary: "You cannot secure what you cannot see — the IoT/OT licence turns every Socket into a passive discovery sensor, fingerprinting and classifying every device into one live inventory, no agents or disruptive scans.",
    tags: ["Asset Discovery", "Device Inventory", "IoT/OT Licence", "Fingerprinting", "Visibility"],
    status: "new",
    deck: null
  },

  /* ---------------- 3 · Network ---------------- */
  {
    id: "network-sdwan",
    file: "usecases/network-sdwan.html",
    category: "Network",
    title: "SD-WAN: Global Private Access",
    summary: "Bring off-net sites on-net over the global private backbone — active/active last miles, app-aware QoS, and a 99.999 % SLA between PoPs.",
    tags: ["SD-WAN", "Sockets", "Backbone", "QoS", "API / Terraform"],
    status: "ready",
    deck: "3 - Network use cases/SDWAN use case overiview.pptx"
  },
  {
    id: "network-agility-mna",
    file: "usecases/network-agility-mna.html",
    category: "Network",
    title: "Agility: M&A Integration at Speed",
    summary: "Onboard acquired companies in days, not quarters — API-driven site deployment, Entra ID integration and identity-aware policy from day one.",
    tags: ["M&A", "API", "Terraform", "Entra ID"],
    status: "ready",
    deck: "3 - Network use cases/Agility use case overiview.pptx"
  },
  {
    id: "network-mpls-migration",
    file: "usecases/network-mpls-migration.html",
    category: "Network",
    title: "MPLS to SASE Migration & Co-existence",
    summary: "Migrate site-by-site from MPLS with full co-existence — new and legacy sites keep talking throughout, with no big-bang cutover.",
    tags: ["MPLS", "Migration", "Co-existence", "Routing"],
    status: "ready",
    deck: "3 - Network use cases/Migration use case overiview.pptx"
  },
  {
    id: "network-cloud-datacenter",
    file: "usecases/network-cloud-datacenter.html",
    category: "Network",
    title: "Cloud Datacentre Integration",
    summary: "Make AWS, Azure and GCP first-class sites on the WAN — vSocket, IPsec or cross-connect, with the same policy and visibility as physical sites.",
    tags: ["vSocket", "AWS", "Azure", "Cross-Connect"],
    status: "new",
    deck: null
  },
  {
    id: "network-global-app-performance",
    file: "usecases/network-global-app-performance.html",
    category: "Network",
    title: "Global Application & UCaaS Performance",
    summary: "Predictable voice, video and SaaS performance for global users — backbone routing, TCP acceleration, packet-loss mitigation and app-aware QoS.",
    tags: ["UCaaS", "QoS", "Backbone", "Acceleration"],
    status: "new",
    deck: null
  },

  {
    id: "network-cloud-interconnect",
    file: "usecases/network-cloud-interconnect.html",
    category: "Network",
    title: "Cloud Interconnect: Dedicated Circuits to Cloud & DC",
    summary: "Bring public cloud and private datacentres onto the WAN over dedicated layer-2 circuits into the Cato PoP — exchange-fabric or physical cross-connect for deterministic latency and high throughput, no tunnels required.",
    tags: ["Cloud Interconnect", "Cross-Connect", "Equinix", "Megaport", "Private DC"],
    status: "new",
    deck: null
  },
  {
    id: "network-ipsec-asa",
    file: "usecases/network-ipsec-asa.html",
    category: "Network",
    title: "IPsec Site Design: Cisco ASA (IKEv1 / IKEv2)",
    summary: "Connect ASA-fronted sites to the nearest Cato PoP over IPsec — IKEv1 vs IKEv2 design choices, allocated IPs, dual-PoP HA and routing — as interim migration connectivity or for socketless sites.",
    tags: ["IPsec", "IKEv2", "IKEv1", "Cisco ASA", "Allocated IP"],
    status: "new",
    deck: null
  },
  {
    id: "network-global-expansion",
    file: "usecases/network-global-expansion.html",
    category: "Network",
    title: "Global Expansion & China Connectivity",
    summary: "Open offices and plants in new regions in weeks — nearest-PoP reach on day one, and compliant, performant China connectivity without building infrastructure.",
    tags: ["Global Expansion", "China", "PoPs", "Zero-Touch"],
    status: "new",
    deck: null
  },

  {
    id: "network-resilient-site-design",
    file: "usecases/network-resilient-site-design.html",
    category: "Network",
    title: "Resilient Site Design",
    summary: "Design sites that stay up — HA socket pairs, dual last miles, LTE/5G failover, BGP options and off-cloud behaviour, with the patterns to match site criticality.",
    tags: ["HA", "Last Mile", "LTE Failover", "BGP", "Site Design"],
    status: "new",
    deck: null
  },

  /* ---------------- 4 · Security ---------------- */
  {
    id: "security-retail-pci",
    vertical: "Retail",
    file: "usecases/security-retail-pci.html",
    category: "Security",
    title: "Retail Store Networks & PCI DSS 4.0",
    summary: "Hundreds of stores, one platform — POS segmentation that shrinks PCI scope, zero-touch sockets with LTE failover, and audit evidence from a single console.",
    tags: ["Retail", "PCI DSS", "Segmentation", "LTE Failover"],
    status: "new",
    deck: null
  },
  {
    id: "security-firewall-refresh",
    file: "usecases/security-firewall-refresh.html",
    category: "Security",
    title: "Firewall Refresh to FWaaS",
    summary: "The appliance estate is end-of-life again — replace the refresh cycle with cloud-delivered FWaaS: no sizing, no patching, no EOL, always-current protection.",
    tags: ["FWaaS", "NGFW", "EOL", "Lifecycle"],
    status: "new",
    deck: null
  },
  {
    id: "security-finance-dora",
    vertical: "Finance",
    file: "usecases/security-finance-dora.html",
    category: "Security",
    title: "Financial Services Resilience (DORA)",
    summary: "Meet DORA's ICT risk, resilience and reporting demands — a self-healing global backbone, unified telemetry for incident reporting, and managed detection depth.",
    tags: ["DORA", "Financial Services", "Resilience", "Reporting"],
    status: "new",
    deck: null
  },
  {
    id: "security-consistent",
    file: "usecases/security-consistent.html",
    category: "Security",
    title: "Consistent Security Everywhere",
    summary: "One global policy, enforced identically for every user, device and site — configured once, applied everywhere via the single-pass cloud engine.",
    tags: ["FWaaS", "ZTNA", "IdP Policy", "Threat Prevention", "Device Posture"],
    status: "ready",
    deck: "4 - Security use cases/Consistent Security Use case overiview.pptx"
  },
  {
    id: "security-ot-iot",
    vertical: "Manufacturing",
    file: "usecases/security-ot-iot.html",
    category: "Security",
    title: "Manufacturing OT/IoT Device Security",
    summary: "Discover, classify and segment OT/IoT devices — Purdue-model segmentation and device-attribute policies down to a single Siemens PLC.",
    tags: ["OT/IoT", "LAN Firewall", "Segmentation", "Purdue Model"],
    status: "ready",
    deck: "4 - Security use cases/Manufacturing Device Security Use case overiview.pptx"
  },
  {
    id: "security-dlp-forensics",
    file: "usecases/security-dlp-forensics.html",
    category: "Security",
    title: "Data Breach Investigation with DLP Forensics",
    summary: "Investigate DLP incidents with encrypted, customer-owned forensic evidence — real leak or false positive, answered directly from the CMA.",
    tags: ["DLP", "Forensics", "RBAC", "Audit", "S3"],
    status: "ready",
    deck: "4 - Security use cases/Data Breach Investigation Use case.pptx"
  },
  {
    id: "security-inbound-ips",
    file: "usecases/security-inbound-ips.html",
    category: "Security",
    title: "Cloud-Delivered Inbound Protection",
    summary: "Publish services safely without exposing them — remote port forwarding with inbound IPS scrubbing and virtual patching at the PoP edge.",
    tags: ["IPS", "Remote Port Forwarding", "Virtual Patching", "CVE"],
    status: "ready",
    deck: "4 - Security use cases/Cato Inbound IPS Use Case.pptx"
  },
  {
    id: "security-compliance",
    file: "usecases/security-compliance.html",
    category: "Security",
    title: "Achieving Compliance (ISO 27001 · NIS2 · SOC 2)",
    summary: "Map Cato capabilities to compliance frameworks — CASB, DLP and unified audit evidence to cut compliance overhead and pass the audit.",
    tags: ["ISO 27001", "NIS2", "SOC 2", "CASB", "DLP"],
    status: "wip",
    deck: "4 - Security use cases/WIP - Helping Achieve Compliance with Cato Networks.pptx"
  },
  {
    id: "security-data-casb-dlp",
    file: "usecases/security-data-casb-dlp.html",
    category: "Security",
    title: "Data Security with CASB & DLP",
    summary: "Discover shadow IT, control sanctioned SaaS, and stop sensitive data walking out — six field-proven CASB/DLP scenarios with the licence mapping.",
    tags: ["CASB", "DLP", "Shadow IT", "SaaS Governance"],
    status: "ready",
    deck: "4 - Security use cases/Data_Security-Use_Cases.pptx"
  },
  {
    id: "security-ransomware",
    file: "usecases/security-ransomware.html",
    category: "Security",
    title: "Ransomware & Advanced Threat Prevention",
    summary: "Break the ransomware kill chain in the cloud — IPS, NGAM, sandboxing and DNS security inspecting every flow, with XDR correlating what remains.",
    tags: ["IPS", "Anti-Malware", "XDR", "DNS Security"],
    status: "new",
    deck: null
  },

  {
    id: "security-tls-inspection",
    file: "usecases/security-tls-inspection.html",
    category: "Security",
    title: "TLS Inspection: Staged Rollout Playbook",
    summary: "The prerequisite everything else depends on — certificate deployment, category-by-category enablement, QUIC handling, pilot cohorts and breakage triage, done in the right order.",
    tags: ["TLS Inspection", "Certificates", "QUIC", "Staged Rollout", "Best Practice"],
    status: "new",
    deck: null
  },
  {
    id: "security-uk-public-sector",
    vertical: "Public Sector",
    file: "usecases/security-uk-public-sector.html",
    category: "Security",
    title: "UK Public Sector: Cyber Essentials & NCSC CAF",
    summary: "Map Cato capabilities to Cyber Essentials Plus controls and the NCSC Cyber Assessment Framework — evidence-led conversations for councils, health, education and central government.",
    tags: ["Cyber Essentials", "NCSC CAF", "Public Sector", "UK", "Compliance"],
    status: "new",
    deck: null
  },
  {
    id: "security-healthcare-nhs",
    vertical: "Healthcare",
    file: "usecases/security-healthcare-nhs.html",
    category: "Security",
    title: "UK Healthcare: NHS DSPT & CAF-Aligned SASE",
    summary: "Meet the CAF-aligned Data Security and Protection Toolkit with one platform — segmented clinical networks, protected patient data, and audit-ready evidence for trusts, providers and their suppliers.",
    tags: ["Healthcare", "NHS DSPT", "CAF", "Compliance", "Segmentation"],
    status: "new",
    deck: null
  },
  {
    id: "security-legal-confidentiality",
    vertical: "Legal",
    file: "usecases/security-legal-confidentiality.html",
    category: "Security",
    title: "Law Firms: Client Confidentiality & Ethical Walls",
    summary: "Meet outside-counsel guidelines and prove it — identity-based ethical walls, DLP over privileged material, and audit evidence for client security reviews, from one platform.",
    tags: ["Legal", "Ethical Walls", "OCG", "DLP", "Client Audits"],
    status: "new",
    deck: null
  },

  /* ---------------- 5 · AI Security ---------------- */
  {
    id: "security-ai",
    file: "usecases/security-ai.html",
    category: "AI Security",
    title: "AI Security: Users, Applications & Agentic AI",
    summary: "Shadow-AI discovery, prompt-level auditing and guardrails — governing GenAI use by employees, homegrown apps and autonomous agents.",
    tags: ["GenAI", "Shadow AI", "Prompt Auditing", "Agentic AI"],
    status: "wip",
    deck: "4 - Security use cases/AI_Security-Use_Cases.pptx"
  },
  {
    id: "security-ai-visibility",
    file: "usecases/security-ai-visibility.html",
    category: "AI Security",
    title: "GenAI Visibility Assessment",
    summary: "Run the no-cost, four-week AI Security Visibility Assessment — shadow-AI discovery, prompt-level visibility and a board-ready risk report mapped to NIST AI RMF, ISO/IEC 42001 and the EU AI Act.",
    tags: ["GenAI", "Shadow AI", "Visibility Assessment", "DLP", "NIST AI RMF"],
    status: "wip",
    deck: null
  },
  {
    id: "ai-genai-security",
    file: "usecases/ai-genai-security.html",
    category: "AI Security",
    title: "GenAI Security for End Users",
    summary: "From shadow-AI discovery to prompt-level enforcement — the User Interaction Policy, browser plugin and DLP working together so employees can use GenAI without leaking data.",
    tags: ["GenAI", "Shadow AI", "User Interaction Policy", "Browser Plugin", "DLP"],
    status: "new",
    deck: null
  },
  {
    id: "ai-agentic-security",
    file: "usecases/ai-agentic-security.html",
    category: "AI Security",
    title: "Securing Agentic AI",
    summary: "AI agents act on their own — inventory managed, local and custom agents, watch their sessions, and govern what they can touch with Scouts and agent controls.",
    tags: ["Agentic AI", "AI Agents", "Scouts", "MCP", "Session Monitoring"],
    status: "new",
    deck: null
  },
  {
    id: "ai-homegrown-apps",
    file: "usecases/ai-homegrown-apps.html",
    category: "AI Security",
    title: "Securing Homegrown AI Applications",
    summary: "Protect the AI you build — AI Gateway integration, Guards and the Guards Interaction Policy, Outposts, and the AI Security Engine defending against prompt injection and jailbreaks at runtime.",
    tags: ["AI Guards", "AI Gateway", "Prompt Injection", "Outposts", "AI Security Engine"],
    status: "new",
    deck: null
  },

  {
    id: "ai-legal-genai",
    vertical: "Legal",
    file: "usecases/ai-legal-genai.html",
    category: "AI Security",
    title: "Law Firms: GenAI with Privilege Intact",
    summary: "Let fee-earners use GenAI without waiving privilege — shadow-AI discovery, prompt-level redaction of client identifiers, and defensible audit trails for regulators and clients.",
    tags: ["Legal", "GenAI", "Privilege", "Shadow AI", "Interaction Policy"],
    status: "new",
    deck: null
  },

  /* ---------------- 6 · Migration ---------------- */
  {
    id: "migration-methodology",
    file: "usecases/migration-methodology.html",
    category: "Migration",
    title: "Migration Methodology & Co-existence Patterns",
    summary: "How Cato Professional Services de-risks any migration — big-bang vs phased, parallel connectivity, interconnect hubs, routed ranges vs BGP handoff, and multi-region co-existence without asymmetric routing.",
    tags: ["Methodology", "Co-existence", "BGP", "Routed Ranges", "Multi-Region"],
    status: "ready",
    deck: null
  },
  {
    id: "migration-journey-mpls",
    file: "usecases/migration-journey-mpls.html",
    category: "Migration",
    title: "MPLS to Cato: Animated Phased Journey",
    summary: "Watch an MPLS exit unfold phase by phase — DC socket first, sites migrating over the backbone while legacy sites stay reachable, then the circuit switched off. An animated walkthrough of the co-existence pattern.",
    tags: ["MPLS", "Phased Migration", "Co-existence", "Animated", "Journey"],
    status: "new",
    deck: null
  },
  {
    id: "migration-journey-sdwan",
    file: "usecases/migration-journey-sdwan.html",
    category: "Migration",
    title: "SD-WAN to Cato: Animated Phased Journey",
    summary: "See an SD-WAN displacement step through its phases — parallel sockets at the hub, eBGP co-existence with the legacy fabric, spoke-by-spoke cutover, then the overlay retired. The eBGP hub pattern, animated.",
    tags: ["SD-WAN", "Phased Migration", "eBGP", "Animated", "Journey"],
    status: "new",
    deck: null
  },
  {
    id: "migration-journey-zscaler",
    file: "usecases/migration-journey-zscaler.html",
    category: "Migration",
    title: "Zscaler to Cato: Animated Phased Journey",
    summary: "Follow a Zscaler migration across its phases — interim ZIA co-existence, cohort client swaps, policy cutover, then ZIA and ZCC retired. The dual-agent transition, animated step by step.",
    tags: ["Zscaler", "Phased Migration", "SSE", "Animated", "Journey"],
    status: "new",
    deck: null
  },
  {
    id: "migration-journey-vpn",
    file: "usecases/migration-journey-vpn.html",
    category: "Migration",
    title: "VPN to ZTNA: Animated Phased Journey",
    summary: "Watch a VPN retirement unfold — concentrators giving way to cohort-based Cato Client rollout, app-by-app least-privilege policy, and the headends switched off. The remote-access transition, animated.",
    tags: ["VPN Replacement", "ZTNA", "Phased Migration", "Animated", "Journey"],
    status: "new",
    deck: null
  },
  {
    id: "migration-journey-firewall",
    file: "usecases/migration-journey-firewall.html",
    category: "Migration",
    title: "Firewall Refresh to FWaaS: Animated Phased Journey",
    summary: "See an appliance refresh become an exit — branch firewalls absorbed into FWaaS site by site, policy converging in the CMA, and the renewal cancelled. The last hardware refresh, animated.",
    tags: ["FWaaS", "Firewall Refresh", "Phased Migration", "Animated", "Journey"],
    status: "new",
    deck: null
  },
  {
    id: "migration-zscaler",
    file: "usecases/migration-zscaler.html",
    category: "Migration",
    title: "Zscaler (ZIA / ZPA) to Cato",
    summary: "Replace ZIA and ZPA with the Cato SASE Cloud — four-phase policy conversion, interim ZIA integration over IPsec, phased agent cutover, and a real-world migration story.",
    tags: ["Zscaler", "ZIA", "ZPA", "SSE", "Policy Conversion"],
    status: "ready",
    deck: null
  },
  {
    id: "migration-palo-alto",
    file: "usecases/migration-palo-alto.html",
    category: "Migration",
    title: "Palo Alto (NGFW & Prisma Access) to Cato",
    summary: "Retire PA appliances, Panorama and Prisma Access — policy translation from App-ID to Cato app-aware rules, GlobalProtect to Cato Client, and a phased edge cutover.",
    tags: ["Palo Alto", "NGFW", "Prisma Access", "GlobalProtect", "Panorama"],
    status: "new",
    deck: null
  },
  {
    id: "migration-netskope",
    file: "usecases/migration-netskope.html",
    category: "Migration",
    title: "Netskope to Cato",
    summary: "Move SWG, CASB and ZTNA from Netskope's SSE overlay to the converged Cato platform — steering-client replacement, policy mapping and DLP profile migration.",
    tags: ["Netskope", "SWG", "CASB", "DLP", "NPA"],
    status: "new",
    deck: null
  },
  {
    id: "migration-cisco",
    file: "usecases/migration-cisco.html",
    category: "Migration",
    title: "Cisco (Umbrella, AnyConnect & SD-WAN) to Cato",
    summary: "Consolidate Umbrella DNS/SIG, AnyConnect VPN and Catalyst (Viptela) or Meraki SD-WAN into one platform — DNS security, remote access and WAN edge in a single policy.",
    tags: ["Cisco", "Umbrella", "AnyConnect", "Catalyst SD-WAN", "Meraki"],
    status: "new",
    deck: null
  },
  {
    id: "migration-fortinet",
    file: "usecases/migration-fortinet.html",
    category: "Migration",
    title: "Fortinet (FortiGate & FortiSASE) to Cato",
    summary: "Replace the FortiGate estate and FortiSASE — policy translation from FortiOS, SD-WAN co-existence via eBGP hub handoff, and staged branch cutover with simple rollback.",
    tags: ["Fortinet", "FortiGate", "FortiSASE", "SD-WAN", "eBGP"],
    status: "new",
    deck: null
  },
  {
    id: "migration-forcepoint",
    file: "usecases/migration-forcepoint.html",
    category: "Migration",
    title: "Forcepoint (Web Security & NGFW) to Cato",
    summary: "Move from Forcepoint web security and NGFW to cloud-delivered SWG, CASB and DLP — proxy/PAC retirement, DLP policy mapping and appliance decommissioning.",
    tags: ["Forcepoint", "SWG", "DLP", "NGFW", "PAC"],
    status: "new",
    deck: null
  },
  {
    id: "migration-anyconnect",
    file: "usecases/migration-anyconnect.html",
    category: "Migration",
    title: "AnyConnect to Cato Client",
    summary: "Retire the VPN concentrators — replace AnyConnect remote access with Cato SDP in cohort-based waves: always-on ZTNA, device posture and IdP MFA, with no headends to size or patch.",
    tags: ["AnyConnect", "Cato Client", "SDP", "VPN Replacement", "Device Posture"],
    status: "new",
    deck: null
  },
  {
    id: "migration-directaccess",
    file: "usecases/migration-directaccess.html",
    category: "Migration",
    title: "Microsoft DirectAccess to Cato",
    summary: "Retire a deprecated, Windows-only always-on VPN — replace DirectAccess (and its PKI, NLS and IP-HTTPS plumbing) with Cato SDP: cross-platform always-on ZTNA, device posture and IdP MFA, no infrastructure to keep alive.",
    tags: ["DirectAccess", "Cato Client", "SDP", "Always-On", "VPN Replacement"],
    status: "new",
    deck: null
  },
  {
    id: "migration-versa",
    file: "usecases/migration-versa.html",
    category: "Migration",
    title: "Versa Networks (SD-WAN & SASE) to Cato",
    summary: "Move from Versa's VOS appliance estate and Director-managed SD-WAN to the Cato platform — policy translation, eBGP hub co-existence and staged branch cutover with simple rollback.",
    tags: ["Versa", "VOS", "Director", "SD-WAN", "eBGP"],
    status: "new",
    deck: null
  },
  {
    id: "migration-cloudflare",
    file: "usecases/migration-cloudflare.html",
    category: "Migration",
    title: "Cloudflare (Zero Trust & Magic WAN) to Cato",
    summary: "Replace Cloudflare Access, Gateway, WARP and Magic WAN with the converged Cato platform — client swap by cohort, tunnel re-pointing and ZTNA policy mapping without the DIY glue.",
    tags: ["Cloudflare", "WARP", "Access", "Magic WAN", "ZTNA"],
    status: "new",
    deck: null
  },
  {
    id: "migration-iboss",
    vertical: "Education",
    file: "usecases/migration-iboss.html",
    category: "Migration",
    title: "iboss Proxy to Cato",
    summary: "Retire the iboss cloud proxy — replace PAC-file and agent steering with Cato Client and socket-based breakout, keeping URL filtering, TLS inspection and CASB in one console.",
    tags: ["iboss", "Proxy", "PAC", "SWG", "TLS Inspection"],
    status: "new",
    deck: null
  },
  {
    id: "migration-checkpoint",
    file: "usecases/migration-checkpoint.html",
    category: "Migration",
    title: "Check Point (Quantum & Harmony) to Cato",
    summary: "Retire the Check Point estate — Quantum gateways, SmartConsole policy and Harmony SASE mapped to the Cato platform with phased cutover and simple rollback.",
    tags: ["Check Point", "Quantum", "SmartConsole", "Harmony", "NGFW"],
    status: "new",
    deck: null
  },
  {
    id: "migration-edgeconnect",
    file: "usecases/migration-edgeconnect.html",
    category: "Migration",
    title: "HPE Aruba EdgeConnect (Silver Peak) to Cato",
    summary: "Move from EdgeConnect SD-WAN and Orchestrator to the Cato platform — overlay co-existence, Boost/QoS intent translation and staged branch cutover.",
    tags: ["EdgeConnect", "Silver Peak", "Orchestrator", "SD-WAN", "HPE Aruba"],
    status: "new",
    deck: null
  },
  {
    id: "migration-symantec",
    file: "usecases/migration-symantec.html",
    category: "Migration",
    title: "Symantec (Broadcom) to Cato",
    summary: "Replace ageing Symantec web security — ProxySG/ASG appliances, WSS cloud and CloudSOC CASB — with cloud-delivered SWG, CASB and DLP on one platform.",
    tags: ["Symantec", "ProxySG", "WSS", "CloudSOC", "Broadcom"],
    status: "new",
    deck: null
  },
  {
    id: "migration-sophos",
    file: "usecases/migration-sophos.html",
    category: "Migration",
    title: "Sophos (XGS Firewall & Central) to Cato",
    summary: "Retire the XG/XGS estate and SD-RED overlay — Sophos Firewall policy, Central-managed SD-WAN and remote access mapped to the Cato platform, sized for UK mid-market estates.",
    tags: ["Sophos", "XGS", "SD-RED", "Central", "UK Mid-Market"],
    status: "new",
    deck: null
  },

  {
    id: "migration-zscaler-policy",
    file: "usecases/migration-zscaler-policy.html",
    category: "Migration",
    title: "Zscaler Policy Migration",
    summary: "Translate ZIA and ZPA policy to Cato — firewall, URL filtering, Cloud App Control, and DLP moved through the four-phase export → map → deploy → optimise process.",
    tags: ["Policy Migration", "FW Rules", "SWG", "CASB", "DLP"],
    status: "new",
    deck: null
  },
  {
    id: "migration-palo-alto-policy",
    file: "usecases/migration-palo-alto-policy.html",
    category: "Migration",
    title: "Palo Alto Policy Migration",
    summary: "Translate PAN-OS security policy to Cato — App-ID rulebases, URL Filtering, SaaS security and Enterprise DLP mapped to the single-pass policy model, clean-up first.",
    tags: ["Policy Migration", "FW Rules", "SWG", "CASB", "DLP"],
    status: "new",
    deck: null
  },
  {
    id: "migration-netskope-policy",
    file: "usecases/migration-netskope-policy.html",
    category: "Migration",
    title: "Netskope Policy Migration",
    summary: "Translate Netskope Real-time Protection policy to Cato — SWG, inline and API CASB, and DLP profiles (EDM rebuilt from source) with monitor-then-block discipline.",
    tags: ["Policy Migration", "FW Rules", "SWG", "CASB", "DLP"],
    status: "new",
    deck: null
  },
  {
    id: "migration-cisco-policy",
    file: "usecases/migration-cisco-policy.html",
    category: "Migration",
    title: "Cisco Policy Migration",
    summary: "Translate Umbrella and ASA/FTD policy to Cato — destination lists and web policies, firewall ACLs, and Umbrella DLP mapped to CMA policy sets.",
    tags: ["Policy Migration", "FW Rules", "SWG", "CASB", "DLP"],
    status: "new",
    deck: null
  },
  {
    id: "migration-fortinet-policy",
    file: "usecases/migration-fortinet-policy.html",
    category: "Migration",
    title: "Fortinet Policy Migration",
    summary: "Translate FortiOS policy to Cato — firewall policies and UTM profiles, web filtering, inline CASB and DLP profiles, rationalised on hit counts before mapping.",
    tags: ["Policy Migration", "FW Rules", "SWG", "CASB", "DLP"],
    status: "new",
    deck: null
  },
  {
    id: "migration-forcepoint-policy",
    file: "usecases/migration-forcepoint-policy.html",
    category: "Migration",
    title: "Forcepoint Policy Migration",
    summary: "Translate Forcepoint policy to Cato — web security categories, NGFW access rules, and the DLP estate (classifiers rationalised before mapping, hybrid where depth demands).",
    tags: ["Policy Migration", "FW Rules", "SWG", "CASB", "DLP"],
    status: "new",
    deck: null
  },
  {
    id: "migration-iboss-policy",
    vertical: "Education",
    file: "usecases/migration-iboss-policy.html",
    category: "Migration",
    title: "iboss Policy Migration",
    summary: "Translate iboss policy to Cato — URL and category rules, education-grade content controls, CASB and DLP patterns mapped to CMA policy with PAC-safe rollback.",
    tags: ["Policy Migration", "FW Rules", "SWG", "CASB", "DLP"],
    status: "new",
    deck: null
  },
  {
    id: "migration-versa-policy",
    file: "usecases/migration-versa-policy.html",
    category: "Migration",
    title: "Versa Policy Migration",
    summary: "Translate VOS security policy to Cato — firewall and UTM profiles, URL filtering, and a greenfield best-practice build for CASB and DLP where Versa had none.",
    tags: ["Policy Migration", "FW Rules", "SWG", "CASB", "DLP"],
    status: "new",
    deck: null
  },
  {
    id: "migration-cloudflare-policy",
    file: "usecases/migration-cloudflare-policy.html",
    category: "Migration",
    title: "Cloudflare Policy Migration",
    summary: "Translate Cloudflare Gateway and Access policy to Cato — HTTP/DNS/network policies, API CASB findings and DLP profiles mapped to the converged CMA policy model.",
    tags: ["Policy Migration", "FW Rules", "SWG", "CASB", "DLP"],
    status: "new",
    deck: null
  },
  {
    id: "migration-checkpoint-policy",
    file: "usecases/migration-checkpoint-policy.html",
    category: "Migration",
    title: "Check Point Policy Migration",
    summary: "Translate SmartConsole policy to Cato — access layers and NAT, HTTPS inspection, URL filtering and DLP blades mapped to the CMA policy model, clean-up first.",
    tags: ["Policy Migration", "FW Rules", "SWG", "CASB", "DLP"],
    status: "new",
    deck: null
  },
  {
    id: "migration-edgeconnect-policy",
    file: "usecases/migration-edgeconnect-policy.html",
    category: "Migration",
    title: "EdgeConnect Policy Migration",
    summary: "Translate EdgeConnect Orchestrator config to Cato — business intent overlays, firewall zones and QoS classes re-expressed as CMA network rules and policy, plus greenfield SWG/CASB/DLP.",
    tags: ["Policy Migration", "FW Rules", "QoS", "Overlays", "Greenfield SSE"],
    status: "new",
    deck: null
  },
  {
    id: "migration-symantec-policy",
    file: "usecases/migration-symantec-policy.html",
    category: "Migration",
    title: "Symantec Policy Migration",
    summary: "Translate Symantec policy to Cato — ProxySG CPL and WSS web policy, CloudSOC CASB and DLP rules mapped to the CMA model without lifting twenty years of proxy logic.",
    tags: ["Policy Migration", "CPL", "SWG", "CASB", "DLP"],
    status: "new",
    deck: null
  },
  {
    id: "migration-sophos-policy",
    file: "usecases/migration-sophos-policy.html",
    category: "Migration",
    title: "Sophos Policy Migration",
    summary: "Translate Sophos Firewall policy to Cato — firewall and NAT rules, web policy, application control and SSL/TLS inspection re-expressed in the CMA model, with greenfield CASB and DLP.",
    tags: ["Policy Migration", "FW Rules", "SWG", "CASB", "DLP"],
    status: "new",
    deck: null
  }
];
