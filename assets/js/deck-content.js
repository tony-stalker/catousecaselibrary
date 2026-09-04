/* Cato Use Case Library — GENERATED per-use-case presentation content. One entry per catalog id: {pain, gain, demo, hook}. Authored from the pages themselves; regenerate by re-running the deck content authoring pass. */
window.UC_DECKS = {
  "access-third-party": {
    "pain": [
      "Legacy VPN gives every third party the whole network, not one app",
      "Unmanaged supplier devices, unknown posture, credentials that outlive the contract",
      "No visibility of what contractors actually do once inside"
    ],
    "gain": [
      "Every third party reaches exactly what they need — nothing more",
      "Access gated by identity and live device posture, verified continuously",
      "Every allow and block attributed to a named person — provable"
    ],
    "demo": [
      {
        "area": "Access » Client Connectivity Policy",
        "show": "Geo and group rules decide who even gets a tunnel"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "Contractors reach only named resources; posture gates wider access"
      },
      {
        "area": "Access » Device Posture",
        "show": "EPP/EDR, encryption, OS checks — evaluated continuously, not at login"
      },
      {
        "area": "Contractor login (live)",
        "show": "Permitted portal opens; internal resource stays blocked"
      },
      {
        "area": "Monitor » Events",
        "show": "Every allow and block, attributed — the audit trail they lack"
      }
    ],
    "hook": "How many suppliers can reach more than the one application they were onboarded for — and would you know?"
  },
  "access-hybrid-workforce": {
    "pain": [
      "VPN concentrators backhaul everything and collapse at Monday 09:00",
      "Two drifting policy sets: office firewall rules and VPN ACLs",
      "Split tunnels send home traffic out uninspected — users disconnect to cope"
    ],
    "gain": [
      "Same identity, policy, protection and performance — office, home or hotel",
      "Traffic enters the nearest of 80+ PoPs — no backhaul latency",
      "One rule base for office and remote; always-on, nothing to toggle"
    ],
    "demo": [
      {
        "area": "Cato Client (from home)",
        "show": "MFA/SSO sign-in, connected to the nearest PoP, always-on"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "Same rule fires from office and sofa — one rule base"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "Blocked category from home — nothing split-tunnelled uninspected"
      },
      {
        "area": "Home » Experience Monitoring",
        "show": "Whole remote workforce scored on one screen"
      },
      {
        "area": "Monitor » Users",
        "show": "Per-user connection history and experience — visibility VPN never gave"
      }
    ],
    "hook": "Does a user at home get exactly the same policy as one at a desk — and which is the real one?"
  },
  "access-offshore-bpo": {
    "pain": [
      "Thousands of offshore users on devices you don't own, churning weekly",
      "VDI over long-haul internet: lag that slows agents and developers",
      "Regulators demand data stays in-country and off the endpoint — unprovable today"
    ],
    "gain": [
      "Client and clientless ZTNA under one policy engine, both device classes",
      "Nearest PoP plus private backbone makes VDI usable at distance",
      "DLP and RBI keep code and PII inside approved apps — evidenced"
    ],
    "demo": [
      {
        "area": "Access » Client Connectivity Policy",
        "show": "Group rule: delivery countries only, compliant posture only"
      },
      {
        "area": "Access » Device Posture",
        "show": "Managed build passes; personal laptop routes to clientless path"
      },
      {
        "area": "Clientless portal (browser)",
        "show": "Agent sees only CRM and VDI — RBI renders pixels only"
      },
      {
        "area": "Security » DLP Configuration",
        "show": "Source-code upload to personal storage blocked, incident walked"
      },
      {
        "area": "Access » Users",
        "show": "One directory change kills a leaver's client and portal access"
      }
    ],
    "hook": "When an agent leaves on Friday, how long before every credential and session they had is actually gone?"
  },
  "access-byod-clientless": {
    "pain": [
      "Contractors and BYOD users need access, but you can't install anything",
      "Shipping laptops or standing up VDI is slow, costly and unloved",
      "VPN from a personal laptop leaves corporate data cached forever"
    ],
    "gain": [
      "Any browser, day one — no client, no enrolment, no laptop to chase",
      "App-level access only: no tunnel, no route, nothing to scan",
      "DLP and RBI keep data off devices you will never see"
    ],
    "demo": [
      {
        "area": "Access portal (private window)",
        "show": "Bare browser, IdP MFA sign-in — only entitled apps appear"
      },
      {
        "area": "Unpublished resource attempt",
        "show": "It fails because there is nothing to reach"
      },
      {
        "area": "Security » DLP Configuration",
        "show": "Download to the unmanaged device blocked by device state"
      },
      {
        "area": "Monitor » Events",
        "show": "Sign-in, launches and blocks — all attributed to a named user"
      },
      {
        "area": "On-ramp comparison",
        "show": "Browser Extension and Enterprise Browser: same policies, same events"
      }
    ],
    "hook": "When a contractor starts on Monday, what has landed on their personal device by Friday?"
  },
  "access-remote-worker": {
    "pain": [
      "Estate dashboards average away the one person having a bad day",
      "\"It is slow\" tickets close as no fault found — the day stays slow",
      "Home Wi-Fi, ISP and laptop are invisible to corporate tooling"
    ],
    "gain": [
      "Per-user, per-app scores for every remote worker, continuously",
      "Fault domain named in one screen: device, Wi-Fi, last mile or app",
      "Telemetry from the same always-on Client — nothing extra deployed"
    ],
    "demo": [
      {
        "area": "Home » Experience Monitoring",
        "show": "Remote Users sorted worst-first — pick one worker's day"
      },
      {
        "area": "Select Application widget",
        "show": "Per-app TTFB, volumes and score against the all-apps line"
      },
      {
        "area": "Connection Details",
        "show": "Five scored nodes; first non-green names the fault domain"
      },
      {
        "area": "Devices panel & events",
        "show": "OS, Client, ISP — plus block events behind the slowness"
      },
      {
        "area": "Access » Client Connectivity Policy",
        "show": "Always-on, posture, split tunnel — decided once, day one"
      }
    ],
    "hook": "Pick one home worker who called last week — could you see their Microsoft 365 experience as a number?"
  },
  "access-identity-design": {
    "pain": [
      "Group-scoped rules silently match nothing when users go unidentified",
      "Events name IP addresses, not people — audits stall",
      "Policy migrated before identity is stable breeds per-user emergency exceptions"
    ],
    "gain": [
      "One identity, one policy — enforced behind a site or remote",
      "IdP groups do joiners, movers and leavers with no firewall tickets",
      "Every event carries a name — attribution regulators actually ask for"
    ],
    "demo": [
      {
        "area": "Access » Directory Services",
        "show": "SCIM tab: the IdP pushes users and groups, near real time"
      },
      {
        "area": "Access » User Groups",
        "show": "The synced group — the contract every rule will reference"
      },
      {
        "area": "Access » User Authentication",
        "show": "SSO with MFA staying in the IdP; PoP validates the token"
      },
      {
        "area": "Access » User Awareness",
        "show": "Identity Agent names office traffic behind the socket"
      },
      {
        "area": "Monitor » Events",
        "show": "Same person named at the office and at home — one identity"
      }
    ],
    "hook": "Pick any flow out of your firewall logs — can you name the person behind it, not the IP?"
  },
  "management-visibility": {
    "pain": [
      "Answers stitched from firewall logs, SD-WAN portals, VPN and carrier reports",
      "Teams check separate tools, declare their layer healthy, and point elsewhere",
      "By the time the picture is assembled, it is out of date"
    ],
    "gain": [
      "One console carries network, security, user and application context",
      "Correlation cuts time to detect; integrated tooling cuts time to fix",
      "Same data serves the 2am engineer and the board report"
    ],
    "demo": [
      {
        "area": "Monitor » Topology",
        "show": "The whole estate live on one map — no collectors deployed"
      },
      {
        "area": "Monitor » App Analytics",
        "show": "Pivot user, site and app instantly — layer-7 context"
      },
      {
        "area": "Monitor » Threats Dashboard",
        "show": "Attackers, MITRE mapping, then one event timeline with policy context"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "One policy plane, with Audit Trail proving every change"
      },
      {
        "area": "Monitor » Experience Monitoring",
        "show": "A slow-app ticket resolved to a segment — no war room"
      }
    ],
    "hook": "When a user says an app is slow, how many consoles do you open before you can answer?"
  },
  "management-api-automation": {
    "pain": [
      "Every new site is a manual, snowflake configuration",
      "A typo goes straight to production — rollback is memory",
      "Reporting is a person exporting screenshots monthly"
    ],
    "gain": [
      "Sites deploy from a template with zero console time",
      "Policy lives in Git: diffed, reviewed, applied, revertable",
      "Anything you can click, you can code — same API as the console"
    ],
    "demo": [
      {
        "area": "Administration » API & Integrations",
        "show": "Scoped keys — the CMA is a client of this same API"
      },
      {
        "area": "catocli (terminal)",
        "show": "Seconds from install to a live inventory of the estate"
      },
      {
        "area": "Terraform plan & apply",
        "show": "The diff reviewed before anything touches production"
      },
      {
        "area": "Monitor » Topology",
        "show": "The code-built site appears on the live map in minutes"
      },
      {
        "area": "Administration » Audit Trail",
        "show": "API change attributed to its key, before and after values"
      }
    ],
    "hook": "Your last multi-site change: how long, how many hands — and how would you have rolled it back?"
  },
  "management-dem": {
    "pain": [
      "\"The app is slow\" dies between network, security and app teams",
      "Every path segment has a different owner, tool and definition of fine",
      "IT learns about degradation from the helpdesk queue, days late"
    ],
    "gain": [
      "The failing segment measured, not inferred — one view, seconds",
      "Hop-by-hop evidence turns \"no fault found\" into a documented ISP case",
      "Anomaly stories surface degradation before the first user calls"
    ],
    "demo": [
      {
        "area": "Home » Experience Monitoring",
        "show": "Estate ranked worst-first — tomorrow's tickets, found today"
      },
      {
        "area": "User drill-down",
        "show": "One struggling user's Teams calls, scored per call"
      },
      {
        "area": "Connection Details",
        "show": "One amber node in a green chain — the fault, named"
      },
      {
        "area": "Path Analysis » Command Line",
        "show": "Per-hop loss starting inside the ISP — the circuit ticket, pre-written"
      },
      {
        "area": "Home » Stories Workbench",
        "show": "Anomaly stories raised before anyone reported anything"
      }
    ],
    "hook": "How many tools and teams does it take you to say whether it's the laptop, the Wi-Fi, the ISP or the app?"
  },
  "management-vendor-consolidation": {
    "pain": [
      "Every product has its own renewal date, console and certified specialist.",
      "The real cost hides in integration, patching and cross-vendor outage triage.",
      "Nobody can count the estate's renewal dates without going away to check."
    ],
    "gain": [
      "One platform, one policy model, one console — the operational maths self-evident.",
      "Adding IPS, CASB or DLP becomes a policy toggle, not a purchase.",
      "Capabilities update PoP-side — the appliance end-of-life treadmill simply ends."
    ],
    "demo": [
      {
        "area": "Network » Network Rules",
        "show": "Bandwidth and path rules sharing objects with firewall policy"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "Same sites, users and groups — one policy model"
      },
      {
        "area": "Monitor » Topology",
        "show": "Sites, cloud and remote users live on one map"
      },
      {
        "area": "Security » IPS",
        "show": "A security capability enabled by toggle, nothing deployed"
      },
      {
        "area": "Administration » Audit Trail",
        "show": "Every network and security change attributed in one place"
      }
    ],
    "hook": "How many renewal dates does your network estate have in the next 24 months?"
  },
  "management-soc-xdr": {
    "pain": [
      "A dozen consoles, and none of them sees the whole picture.",
      "Correlation is a manual swivel-chair job across alerts stripped of context.",
      "A credible 24×7 rota is unrealistic with the people available."
    ],
    "gain": [
      "One queue of correlated incident stories, ranked by ML criticality.",
      "Investigation and the policy fix live in the same console.",
      "Cato MDR puts expert eyes on the same queue, around the clock."
    ],
    "demo": [
      {
        "area": "Monitor » Threats Dashboard",
        "show": "Threat picture built from traffic already inspected — nothing deployed"
      },
      {
        "area": "Threats Dashboard » story detail",
        "show": "Correlated timeline, criticality score and MITRE ATT&CK mapping"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "Contain the incident with a rule — same console"
      },
      {
        "area": "Monitor » Stories Dashboard",
        "show": "The ranked queue a shift works top-down"
      }
    ],
    "hook": "Who covers your alert queue at 3 a.m. on a Sunday?"
  },
  "management-pov-framework": {
    "pain": [
      "Evaluations drift into free trials that never end in a decision.",
      "Goalposts move weekly — 'can it also…?' stretches every timeline.",
      "Findings get reconstructed from memory instead of recorded as they land."
    ],
    "gain": [
      "Agreed scope, measurable criteria and a decision meeting booked up front.",
      "Evidence filed weekly makes the wrap-up a formality, not archaeology.",
      "New asks are parked in writing — heard, without derailing the timeline."
    ],
    "demo": [
      {
        "area": "Scope workshop",
        "show": "Every ask pushed until measurable; both meetings booked"
      },
      {
        "area": "Network » Sites",
        "show": "Pilot branch connected, Client group enrolled, IdP syncing"
      },
      {
        "area": "Monitor » Topology",
        "show": "Evidence item zero — tunnels up, first traffic flowing"
      },
      {
        "area": "Monitor » App Analytics",
        "show": "Their apps and users on screen by day five"
      }
    ],
    "hook": "What would you need to see proven, on your own traffic, to make a decision?"
  },
  "management-asset-discovery": {
    "pain": [
      "Agentless devices — cameras, PLCs, BYOD — join the network silently.",
      "The CMDB records what was procured, not what is connected.",
      "Active scans can crash the fragile OT kit you most need to see."
    ],
    "gain": [
      "Every Socket becomes a passive discovery sensor — no agents, no scans.",
      "One live inventory, classified by category, type, model and manufacturer.",
      "Discovered attributes become firewall rules — see it, then segment it."
    ],
    "demo": [
      {
        "area": "Assets » Device Inventory",
        "show": "The estate classifying itself passively from its own traffic"
      },
      {
        "area": "Assets » Device Inventory",
        "show": "Group by manufacturer, type or site — one-click answers"
      },
      {
        "area": "Device Inventory Quick View",
        "show": "One device's attributes, events and the apps it reaches"
      },
      {
        "area": "Device Dashboard",
        "show": "IoT and OT counts plus the Segmentation Flows Sankey"
      },
      {
        "area": "Security » LAN Firewall",
        "show": "A discovered device becomes a device-attribute rule"
      }
    ],
    "hook": "How long would a complete, correct list of every connected device take you today?"
  },
  "network-sdwan": {
    "pain": [
      "New sites wait months on carrier circuit orders and appliance builds.",
      "One circuit per site — a single point of failure for voice and ERP.",
      "QoS changes mean per-carrier tickets; nobody owns the middle mile."
    ],
    "gain": [
      "Any available last mile — sites on-net with zero-touch Sockets.",
      "Active/active links — failover a live call survives; brownouts stop being outages.",
      "A private backbone with a 99.999% uptime SLA between PoPs."
    ],
    "demo": [
      {
        "area": "Administration » API & Integrations",
        "show": "Terraform apply creates the site in seconds"
      },
      {
        "area": "Network » Sites",
        "show": "Site ready for its zero-touch Socket — no engineer on-site"
      },
      {
        "area": "Monitor » Topology",
        "show": "Both last miles live — pull one, the call survives"
      },
      {
        "area": "Network » Bandwidth Management",
        "show": "Voice first, bulk last — apps and usernames, not ports"
      },
      {
        "area": "Monitor » App Analytics",
        "show": "Day-one visibility for a site provisioned before lunch"
      }
    ],
    "hook": "How long did your last new site take, order to live?"
  },
  "network-agility-mna": {
    "pain": [
      "Network integration measured in quarters is integration the business notices.",
      "Circuit orders, firewall meshes and appliance builds at every acquired site.",
      "Two directories, no common policy language — acquired users wait, or share accounts."
    ],
    "gain": [
      "Acquired sites on-net in days via API-driven Socket deployment.",
      "Entra ID provisions acquired users and groups automatically — no trust project.",
      "Acquired usernames in least-privileged policy from day one."
    ],
    "demo": [
      {
        "area": "Administration » API & Integrations",
        "show": "Terraform creates every acquired site in seconds"
      },
      {
        "area": "Monitor » Topology",
        "show": "New sites beside the existing estate — zero-touch Sockets"
      },
      {
        "area": "Access » Users",
        "show": "Acquired users synced from Entra ID, no manual accounts"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "An acquired group named in a rule, day one"
      }
    ],
    "hook": "The deal closes on Friday — when can two companies actually work as one?"
  },
  "network-mpls-migration": {
    "pain": [
      "Big-bang cutovers concentrate all the risk in one change window.",
      "MPLS contracts expire on different dates — sites must leave one by one.",
      "Nobody owns routing for the in-between network, or can prove it works."
    ],
    "gain": [
      "Cato and MPLS co-exist behind a datacentre Socket, as long as needed.",
      "Each site cuts over on its own schedule with dual last miles.",
      "You land on the target design, not a copy of the old network."
    ],
    "demo": [
      {
        "area": "Network » Sites",
        "show": "DC socket advertising MPLS-site routes — the whole integration"
      },
      {
        "area": "Monitor » Topology",
        "show": "One routing table spanning migrated and legacy sites"
      },
      {
        "area": "Network » Sites",
        "show": "Cutover simulated — move a range, delete a static route"
      },
      {
        "area": "Monitor » App Analytics",
        "show": "Live flows proving new and current sites keep talking"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "Egress via DC firewall or Cato PoP — per-site choice"
      }
    ],
    "hook": "Which sites could you move tomorrow — and which are stuck because others still need them?"
  },
  "network-cloud-datacenter": {
    "pain": [
      "Every cloud region repeats the pattern — more circuits, appliances, policy drift.",
      "Premium interconnects buy connectivity only — no inspection, no policy on the path.",
      "Cloud flows are invisible to the WAN team's tooling."
    ],
    "gain": [
      "Every VPC and VNet becomes just another site on the WAN.",
      "One rulebase and one audit trail govern cloud and physical alike.",
      "A cloud DC live on the WAN in about an hour."
    ],
    "demo": [
      {
        "area": "Monitor » Topology",
        "show": "Cloud sites rendered exactly like physical ones — that's the point"
      },
      {
        "area": "Network » Sites",
        "show": "A vSocket HA pair with automatic failover, managed for you"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "Branch-to-VPC rule, same anatomy as branch-to-DC"
      },
      {
        "area": "Monitor » App Analytics",
        "show": "Cloud flows fully attributed — the view virtual firewalls never gave"
      }
    ],
    "hook": "After all that interconnect and firewall spend, which console shows branch-to-VPC policy?"
  },
  "network-global-app-performance": {
    "pain": [
      "Choppy calls with customers get escalated the same afternoon.",
      "Intercontinental internet crosses providers you have no contract with — no SLA.",
      "Global MPLS solves predictability at a price that rules it out."
    ],
    "gain": [
      "Sydney gets the same application experience as a desk beside the DC.",
      "A private backbone — accelerated, loss-protected, QoS-prioritised end to end.",
      "SaaS exits at the PoP nearest the app, not head office."
    ],
    "demo": [
      {
        "area": "Network » Bandwidth Management",
        "show": "Voice and video prioritised globally — no per-region QoS"
      },
      {
        "area": "Home » Experience Monitoring",
        "show": "A long-haul call scored per user and site, live"
      },
      {
        "area": "Monitor » Topology",
        "show": "Last mile separated from middle mile on one screen"
      },
      {
        "area": "Network » Network Rules",
        "show": "TCP acceleration and loss mitigation as per-rule toggles"
      }
    ],
    "hook": "When Sydney's Teams calls to London go choppy, who do you even call?"
  },
  "network-cloud-interconnect": {
    "pain": [
      "Datacentre-class flows ride tunnels: internet last mile, bandwidth ceilings, encryption overhead",
      "ExpressRoute or Direct Connect lands — then a separate console owns its policy",
      "Replication and bulk data movement suffer unpredictable latency over the public internet"
    ],
    "gain": [
      "A dedicated layer-2 circuit into the PoP — deterministic latency, high sustained throughput",
      "Nothing to deploy in the path: no appliance, no tunnel, no patching",
      "The interconnect is just a site — same policy, visibility and backbone routing"
    ],
    "demo": [
      {
        "area": "Network » Sites",
        "show": "A Cloud Interconnect site — one line is the whole deployment story"
      },
      {
        "area": "Network » Sites",
        "show": "What's absent: no socket serial, no tunnel parameters, no appliance"
      },
      {
        "area": "Monitor » Topology",
        "show": "The interconnect on the same map as every branch and DC"
      },
      {
        "area": "Network » Sites",
        "show": "A live AWS vSocket's analytics — the visibility a live circuit inherits"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "One rulebase governs branch, DC, tunnel and interconnect traffic alike"
      }
    ],
    "hook": "Some flows deserve a wire, not a tunnel — and it should still be just a site."
  },
  "network-ipsec-asa": {
    "pain": [
      "Sites that can't take a Socket yet sit off the backbone entirely",
      "IKEv2 to an ASA fails with TS_UNACCEPTABLE unless you know the quirk",
      "Crypto-map ACL sprawl — every range pair becomes another security association to manage"
    ],
    "gain": [
      "The ASA you already own joins the backbone and full security stack today",
      "Dual tunnels on fixed allocated IPs at two PoPs — deterministic, approvable resilience",
      "IPsec is scaffolding: policy, routing and analytics survive the later Socket swap"
    ],
    "demo": [
      {
        "area": "Monitor » Topology",
        "show": "The IPsec site on the same map as Socket and vSocket sites"
      },
      {
        "area": "Sites » Site Settings » IPsec",
        "show": "Primary and secondary tunnels — two allocated IPs at two PoPs"
      },
      {
        "area": "Connection Status",
        "show": "Live phase 1/2 state; drop the primary, watch routes move"
      },
      {
        "area": "Monitor » Events",
        "show": "Tunnel and firewall events — the audit trail survives the Socket swap"
      }
    ],
    "hook": "Not every site can take a Socket on day one — none of them has to wait."
  },
  "network-global-expansion": {
    "pain": [
      "Every new market restarts a project: carrier contracts, shipped firewalls, travelling engineers",
      "Circuits ordered months ahead make IT the reason the site opens late",
      "China on a DIY VPN overlay means performance and regulatory risk"
    ],
    "gain": [
      "The network is already in-region — 80+ PoPs with the full security stack",
      "Connected on day one: zero-touch socket, or Client and IPsec while hardware ships",
      "China joins compliantly through Cato's in-country presence with licensed local partners"
    ],
    "demo": [
      {
        "area": "Network » Sites",
        "show": "Create their next market's site live — before any hardware exists"
      },
      {
        "area": "Network » Sites",
        "show": "A Sydney site connected over IPsec with no Cato hardware at all"
      },
      {
        "area": "Monitor » Topology",
        "show": "New regions appear on one map the moment they connect"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "No rule names a region — the global policy applied at first connect"
      },
      {
        "area": "Monitor » App Analytics",
        "show": "Application experience from the new region — measurably usable, not just connected"
      }
    ],
    "hook": "Where does the business open next — and why should the network take quarters?"
  },
  "network-resilient-site-design": {
    "pain": [
      "Every site fails eventually — cut fibre, dead power supply, PoP out of rotation",
      "Availability conversations start with an SLA percentage and end with an invoice",
      "Failover nobody has deliberately tested is a diagram, not a design"
    ],
    "gain": [
      "Four failure domains, each answered: last mile, hardware, PoP, total off-cloud",
      "Resilience and spend matched to site class — kiosk to critical datacentre",
      "Per-second SLA steering re-homes flows before users open tickets"
    ],
    "demo": [
      {
        "area": "Network » Sites",
        "show": "WAN link precedence per site class — active, passive, LTE last resort"
      },
      {
        "area": "Monitor » Topology",
        "show": "An HA site's Ready state: Connected, Keepalive, Compatible Version"
      },
      {
        "area": "Monitor » Topology",
        "show": "Pull a link and watch flows re-home to the surviving link"
      },
      {
        "area": "Monitor » Events",
        "show": "Link down, SLA violations, failover — the evidence and alerting feed"
      }
    ],
    "hook": "When did someone last deliberately pull a link to prove the failover works?"
  },
  "security-retail-pci": {
    "pain": [
      "Hundreds of stores on flat LANs — everything lands in PCI assessment scope",
      "One broadband line stands between the tills and every card payment",
      "Audit evidence is weeks of screenshots and spreadsheets, stale the next day"
    ],
    "gain": [
      "LAN firewall segmentation shrinks scope from whole store to payment network",
      "LTE failover keeps the tills authorising through a broadband cut",
      "One policy for every store — evidence becomes a console export"
    ],
    "demo": [
      {
        "area": "Monitor » Topology",
        "show": "Every site is a store — same Socket, same VLAN plan, same policy"
      },
      {
        "area": "Network » Sites » Networks",
        "show": "POS, guest, staff and camera VLANs behind one zero-touch Socket"
      },
      {
        "area": "Security » LAN Firewall",
        "show": "Guest blocked from POS at the store edge — hit counters prove it"
      },
      {
        "area": "Network » Sites",
        "show": "The LTE link — payments keep flowing when broadband dies"
      },
      {
        "area": "Administration » Audit Trail",
        "show": "Who changed what, when — the assessor pack from one console"
      }
    ],
    "hook": "If the till can't authorise a card, the store stops selling."
  },
  "security-firewall-refresh": {
    "pain": [
      "Another EOL notice: sizing gamble, capex fight, months of staged rollouts",
      "Your team owns firmware, hotfixes and change windows until the next EOL",
      "TLS inspection pushes appliances off a performance cliff, so it stays off"
    ],
    "gain": [
      "Enforcement moves to the PoP — never size, patch or EOL an appliance again",
      "One global rulebase; a policy change reaches every PoP in seconds",
      "New critical CVEs virtually patched at the IPS within days — no change window"
    ],
    "demo": [
      {
        "area": "Security » Internet Firewall",
        "show": "The whole estate's internet policy — and no box behind it"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "The DC firewall pair's segmentation job, done in the cloud"
      },
      {
        "area": "Security » TLS Inspection",
        "show": "Inspection becomes a policy decision, not a hardware upgrade"
      },
      {
        "area": "Security » IPS",
        "show": "Rapid CVE mitigation — protections deployed by Cato, no maintenance weekend"
      },
      {
        "area": "Monitor » Events",
        "show": "One rule change enforcing across regions within seconds"
      }
    ],
    "hook": "Should this refresh be the last one you ever run?"
  },
  "security-finance-dora": {
    "pain": [
      "Every point vendor is another ICT third party to assess, register and evidence",
      "Incident timelines are scattered across consoles with different clocks and retention",
      "Proving the same control applies everywhere is guesswork with per-site appliances"
    ],
    "gain": [
      "A self-healing backbone makes resilience the architecture's default behaviour",
      "One telemetry plane turns incidents into reportable evidence, fast",
      "One assessed provider shrinks the third-party register and the due diligence"
    ],
    "demo": [
      {
        "area": "Monitor » Topology",
        "show": "Dual uplinks, HA state, connected PoPs — failover with no operator action"
      },
      {
        "area": "Monitor » Experience Monitoring",
        "show": "What users actually experienced during a failover test window"
      },
      {
        "area": "Monitor » Threats Dashboard",
        "show": "An XDR incident story — the skeleton of a regulator-facing report"
      },
      {
        "area": "Monitor » Events",
        "show": "Every flow and verdict on one clock, attributed to a user"
      },
      {
        "area": "Administration » Audit Trail",
        "show": "Who changed which policy, when — exportable governance evidence"
      }
    ],
    "hook": "DORA doesn't ask you to be resilient — it asks you to prove it."
  },
  "security-consistent": {
    "pain": [
      "Dozens of policies — per firewall, VPN and cloud region — drifting apart",
      "Attackers only need to find the weakest enforcement point",
      "Nobody can say with confidence what is actually enforced where"
    ],
    "gain": [
      "One policy set, configured once, enforced identically at every PoP",
      "Rules follow IdP groups and device posture, not IP addresses",
      "The same protection at the desk, on hotel Wi-Fi, or at home"
    ],
    "demo": [
      {
        "area": "Security » Internet Firewall",
        "show": "One rulebase scoped to groups and posture — no per-site variant exists"
      },
      {
        "area": "Access » Users",
        "show": "Group membership synced from the IdP drives access automatically"
      },
      {
        "area": "Access » Device Posture",
        "show": "Identity says who; posture says from what — evaluated continuously"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "One rule change becomes the enforced policy at every PoP"
      },
      {
        "area": "Monitor » Events",
        "show": "Office and home blocked by the same rule, same identity"
      }
    ],
    "hook": "Pick one rule — is it enforced identically in Glasgow, in Dubai and at home?"
  },
  "security-ot-iot": {
    "pain": [
      "Nobody can list what is actually connected to the plant network",
      "PLCs and HMIs can't run agents, and patch windows take months",
      "One compromised camera can move laterally towards the SCADA layer"
    ],
    "gain": [
      "Every device discovered and classified passively — no agents, no scanners, no disruption",
      "Policy follows what a device is — down to a single Siemens PLC",
      "Purdue-aligned LAN firewall segmentation stops lateral movement on the plant floor"
    ],
    "demo": [
      {
        "area": "Assets » Device Inventory",
        "show": "Category, type, model, OS, manufacturer — visibility they don't have today"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "Block internet egress for every Siemens S7-300 — automatically, estate-wide"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "HMI to PLC allowed; everything cross-level denied by default"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "The maintenance vendor scoped to the jump server only"
      },
      {
        "area": "Monitor » Events",
        "show": "Live hit counts — every block attributed to a device, not an IP"
      }
    ],
    "hook": "Can you list every device on your plant floor right now?"
  },
  "security-dlp-forensics": {
    "pain": [
      "DLP events show the rule, not the data — analysts are left guessing",
      "Real leaks dismissed as noise; false positives trigger full fire drills",
      "Captured evidence in vendor storage becomes a second copy of the leak"
    ],
    "gain": [
      "See exactly what matched — real leak or false positive, answered in minutes",
      "Evidence encrypted in your own S3 bucket, with your account's key",
      "Every view RBAC-gated and audited — prove who saw what, and when"
    ],
    "demo": [
      {
        "area": "Security » DLP Configuration",
        "show": "Forensics integration switched on — the change itself is audited"
      },
      {
        "area": "Upload a PII file to Copilot",
        "show": "Blocked inline; evidence captured to your S3 at that moment"
      },
      {
        "area": "Monitor » Data Protection Dashboard",
        "show": "One click from the block event into the data incident"
      },
      {
        "area": "Data Incident » View Evidence",
        "show": "The exact matched content — role-gated, deliberate, logged"
      },
      {
        "area": "Administration » Audit Trail",
        "show": "The evidence view itself recorded — access proven"
      }
    ],
    "hook": "When DLP flags a credit-card leak, can your analysts see what actually matched — and prove who looked?"
  },
  "security-inbound-ips": {
    "pain": [
      "Every published service is an open door under constant automated attack",
      "Patching means downtime windows the business cannot afford",
      "Auditors want proof of controls scattered across an appliance stack"
    ],
    "gain": [
      "Publish the service, not the server — the site stays dark",
      "Every request scrubbed at the PoP before it reaches your equipment",
      "New critical CVEs closed in 0–2 days, with no downtime"
    ],
    "demo": [
      {
        "area": "Allocated IP at a PoP",
        "show": "One static IP is all the world sees"
      },
      {
        "area": "Remote Port Forwarding rule",
        "show": "Forward to the on-prem service; restrict sources by IP or country"
      },
      {
        "area": "Security » IPS",
        "show": "Inbound IPS on — signatures maintained by Cato, nothing to patch"
      },
      {
        "area": "Monitor » Events",
        "show": "Real scanner traffic blocked as attributed events"
      },
      {
        "area": "Rapid CVE Mitigation page",
        "show": "Public proof: detect-to-protect in 0–2 days"
      }
    ],
    "hook": "When the next critical CVE lands on a service you publish, how long are you exposed before you can patch?"
  },
  "security-compliance": {
    "pain": [
      "Weeks to configure the same policy across every tool",
      "Shadow IT and unknown SaaS apps make compliance impossible to prove",
      "Every audit is a manual evidence-hunt across a dozen consoles"
    ],
    "gain": [
      "Controls and evidence in one place — enforced everywhere, reported once",
      "Every enforcement decision lands as attributable audit evidence",
      "One evidence pack for ISO 27001, NIS2 and SOC 2 — not a screenshot quarter"
    ],
    "demo": [
      {
        "area": "Monitor » Cloud Apps Dashboard",
        "show": "The full app estate — sanctioned, unsanctioned and risk-scored"
      },
      {
        "area": "App Catalogue entry",
        "show": "Vendor attestations — supplier due diligence in a lookup"
      },
      {
        "area": "Security » DLP Configuration",
        "show": "Block cardholder data to unsanctioned apps, every match logged"
      },
      {
        "area": "Monitor » Data Protection Dashboard",
        "show": "Control-effectiveness evidence: events, rules, users, apps"
      },
      {
        "area": "Administration » Audit Trail",
        "show": "Every policy change attributed — one change record, one console"
      }
    ],
    "hook": "When the auditor asks for proof a control worked last quarter, how many consoles do you have to open?"
  },
  "security-data-casb-dlp": {
    "pain": [
      "The business adopts SaaS and AI apps faster than security can see",
      "Nobody can say which cloud apps hold customer PII today",
      "Sensitive data walks into personal storage and GenAI tools unchecked"
    ],
    "gain": [
      "Every cloud and AI app discovered from traffic — no new deployment",
      "Granular control: allow the app, block the risky activity",
      "PII, PHI and card data stopped in flight, with evidence attached"
    ],
    "demo": [
      {
        "area": "Monitor » Cloud Apps Dashboard",
        "show": "The app estate versus what they expected — the shadow-IT gap"
      },
      {
        "area": "Monitor » App Analytics",
        "show": "One risky app's score, and who is actually using it"
      },
      {
        "area": "Security » CASB",
        "show": "Allow browsing, block uploads — activity control, not crude deny"
      },
      {
        "area": "Security » DLP Configuration",
        "show": "Credit-card uploads blocked with pre-built PCI, PII, PHI profiles"
      },
      {
        "area": "Monitor » Events",
        "show": "The data incident: user, app, matched data, secured evidence"
      }
    ],
    "hook": "How many cloud apps are in use right now — and which of them hold your customers' PII?"
  },
  "security-ransomware": {
    "pain": [
      "One uninspected path — remote user, branch breakout — is all the chain needs",
      "OT and IoT devices cannot run the agent meant to compensate",
      "Fifty unrelated alerts; nobody joins them up before the encryption starts"
    ],
    "gain": [
      "Six attack stages meet six independent controls at every PoP",
      "Virtual patching closes exploited CVEs before your patch window",
      "XDR turns weak signals into one correlated, MITRE-mapped story"
    ],
    "demo": [
      {
        "area": "Monitor » Threats Dashboard",
        "show": "The tenant-wide threat picture — no 'behind the firewall' here"
      },
      {
        "area": "Security » Anti-Malware",
        "show": "EICAR download blocked inline; zero-days follow into the sandbox"
      },
      {
        "area": "Monitor » Events",
        "show": "A real exploit attempt stopped by IPS, CVE named"
      },
      {
        "area": "XDR Stories Workbench",
        "show": "Fifty alerts become one incident story with a timeline"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "Segmentation rules stopping spread to backups — hit counts prove it"
      }
    ],
    "hook": "If ransomware detonated in a branch tonight, what stops it reaching your backups before anyone sees the beacon?"
  },
  "security-tls-inspection": {
    "pain": [
      "Almost all traffic is encrypted — your controls judge it by the handshake",
      "Big-bang decryption breaks pinned apps and burns business trust",
      "Pinned apps and QUIC slip past today without a deliberate decision"
    ],
    "gain": [
      "SWG, CASB, DLP and AI controls reach full fidelity on decrypted traffic",
      "Staged rollout finds what breaks on your terms, not the helpdesk's",
      "Exceptions become governed bypass rules — owned, reviewed, audited"
    ],
    "demo": [
      {
        "area": "Security » TLS Inspection",
        "show": "The shipped rule base: inspect by default, bypass by exception"
      },
      {
        "area": "Configuration Wizard",
        "show": "A safe, data-driven starting rule set in minutes"
      },
      {
        "area": "Security » Certificate Management",
        "show": "The trust anchor your MDM team distributes first"
      },
      {
        "area": "Pilot user's browser",
        "show": "Padlock reads Cato — and blocks render clean, not scary"
      },
      {
        "area": "Monitor » Events",
        "show": "Inspected, bypassed and QUIC-blocked flows, all visible"
      }
    ],
    "hook": "What percentage of your web traffic is actually decrypted today — and who decided what slips through?"
  },
  "security-uk-public-sector": {
    "pain": [
      "Every site, depot and home worker means another boundary to control",
      "Danzell makes cloud MFA and 14-day patching automatic failures",
      "Assessment evidence lives across a rack of consoles and spreadsheets"
    ],
    "gain": [
      "One default-deny boundary answers the firewalls theme for the whole estate",
      "A whole class of security infrastructure leaves your patching scope",
      "The assessor pack assembles itself as a by-product of operation"
    ],
    "demo": [
      {
        "area": "Mapping tables",
        "show": "What Cato covers — and honestly, what stays with you"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "One ordered, default-deny rule base for every site and worker"
      },
      {
        "area": "Administration » Audit Trail",
        "show": "Who changed which rule, when — exportable change evidence"
      },
      {
        "area": "Access » Device Posture",
        "show": "Encryption, anti-malware and OS checks gating access continuously"
      },
      {
        "area": "Monitor » Events",
        "show": "One event stream, one clock — the assessor pack in one console"
      }
    ],
    "hook": "Your next Cyber Essentials renewal lands under Danzell — MFA and 14-day patching are now auto-fail questions."
  },
  "security-healthcare-nhs": {
    "pain": [
      "Ethical walls in the conflicts system, flat network underneath",
      "A supplier compromise became a patient-safety incident in 2024",
      "Unpatchable medical devices sit on VLANs nobody can map"
    ],
    "gain": [
      "Clinical, corporate and IoMT estates segmented at the Socket itself",
      "Suppliers reach exactly one system — every session evented",
      "DSPT evidence assembles as a by-product of operation, not a hunt"
    ],
    "demo": [
      {
        "area": "DSPT mapping table",
        "show": "Where Cato contributes — and Objective E conceded to IG up front"
      },
      {
        "area": "Assets » Device Inventory",
        "show": "The IoMT estate classified from traffic — no agents"
      },
      {
        "area": "Security » LAN Firewall",
        "show": "Segmentation enforced locally — holds even if the circuit drops"
      },
      {
        "area": "Access » Device Posture",
        "show": "MFA and posture on every remote path — the NHS MFA policy, worded"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "A supplier reaches one system; everything else blocks, attributed"
      }
    ],
    "hook": "If a key supplier were encrypted tonight, which clinical systems keep working — and what could their credentials reach?"
  },
  "security-legal-confidentiality": {
    "pain": [
      "Ethical walls stop at the DMS — the network beneath is flat",
      "Every panel review means another questionnaire and lost fee-earning days",
      "A leaver heading to opposing counsel — who proves access was revoked?"
    ],
    "gain": [
      "The wall becomes network policy — identity-based, enforced everywhere",
      "Privileged material blocked in flight before it reaches personal storage",
      "The client security questionnaire answers itself from one console"
    ],
    "demo": [
      {
        "area": "Obligation map",
        "show": "What Cato enforces — and what stays with the firm and COLP"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "A wall as a rule pair over the implicit deny — identity, not geography"
      },
      {
        "area": "Monitor » Events",
        "show": "The cross-wall attempt blocked and attributed — evidence, not assertion"
      },
      {
        "area": "Security » DLP Configuration",
        "show": "Legal classifiers block privileged uploads to personal cloud"
      },
      {
        "area": "Administration » Audit Trail",
        "show": "Timestamped revocation and change history — the questionnaire pack"
      }
    ],
    "hook": "What stops a fee-earner on Matter A reaching Matter B's workspace over the network — and could you prove it?"
  },
  "security-ai": {
    "pain": [
      "Employees paste company data into public chatbots nobody has assessed",
      "Developers wire LLMs and coding agents into internal applications unseen",
      "Autonomous agents act with delegated credentials — nobody can list them"
    ],
    "gain": [
      "Every AI touchpoint — user, application, agent — visible on one platform",
      "Prompt-level auditing turns guesswork into usage and compliance reporting",
      "One policy engine governs AI alongside the rest of your traffic"
    ],
    "demo": [
      {
        "area": "Monitor » Cloud Apps Dashboard",
        "show": "Far more GenAI apps in use than were ever sanctioned"
      },
      {
        "area": "Security » CASB",
        "show": "One risky app's data handling, compliance posture and risk score"
      },
      {
        "area": "Security » CASB",
        "show": "Allow prompting, block file upload — no blunt category ban"
      },
      {
        "area": "Security » DLP Configuration",
        "show": "DLP catching PII and payment data in prompts and uploads"
      },
      {
        "area": "Monitor » Data Protection Dashboard",
        "show": "Ongoing governance reporting — which apps, users and policies fired"
      }
    ],
    "hook": "If someone pasted customer PII into a chatbot yesterday, could you produce the prompt today?"
  },
  "security-ai-visibility": {
    "pain": [
      "Boards mandate AI adoption — blocking GenAI is no longer defensible",
      "Regulators expect you to know, classify and govern AI in use",
      "One pasted customer record turns an AI story into a breach"
    ],
    "gain": [
      "Four weeks from kickoff to a board-ready AI risk report",
      "Real GenAI usage discovered in monitor mode — zero business disruption",
      "Findings mapped to NIST AI RMF, ISO/IEC 42001 and the EU AI Act"
    ],
    "demo": [
      {
        "area": "AI Security » Overview",
        "show": "The violation rate, app and user totals — the sync opener"
      },
      {
        "area": "AI Security » Discovery",
        "show": "The shadow-AI inventory: every app with usage and risk rating"
      },
      {
        "area": "AI Security » AI Users",
        "show": "Names against the numbers — per-user interactions and violation rates"
      },
      {
        "area": "Monitor » Data Protection Dashboard",
        "show": "What monitor-mode DLP would have caught — nothing blocked"
      },
      {
        "area": "Home » Reports",
        "show": "The GenAI Report — the board-ready wrap-up artefact"
      }
    ],
    "hook": "A no-cost four-week assessment: your real GenAI usage discovered, nothing blocked, board-ready report at the end."
  },
  "ai-genai-security": {
    "pain": [
      "Source code, customer records and contracts leave in every prompt",
      "URL filters see the domain — never what was pasted in",
      "Blocked users switch to personal accounts and usage goes dark"
    ],
    "gain": [
      "Safe enablement — people keep AI, you control what leaves each prompt",
      "Sensitive values anonymised in-flight; the prompt still gets answered",
      "A per-prompt audit trail for the board and the auditor"
    ],
    "demo": [
      {
        "area": "AI Security » Monitoring » Overview",
        "show": "The AI app count — usually multiples of what they expect"
      },
      {
        "area": "AI Security » AI Users",
        "show": "One user drilled: apps, violations, safe-versus-violation split"
      },
      {
        "area": "AI Security » User Interaction Policy",
        "show": "One rule end to end — monitor, anonymise or block per prompt"
      },
      {
        "area": "Security » DLP Configuration",
        "show": "Recommended profiles backstopping uploads to Generative AI Tools"
      },
      {
        "area": "Monitor » Events",
        "show": "Every interaction attributed and exportable — the audit trail"
      }
    ],
    "hook": "Which GenAI tools were used last week, by whom — and what was pasted into them?"
  },
  "ai-agentic-security": {
    "pain": [
      "Nobody can list the agents running, or the MCP servers they touch",
      "Agents act at machine speed with someone's delegated permissions",
      "Injection can arrive in a tool response, not just a prompt"
    ],
    "gain": [
      "A complete inventory of local, managed and custom agents",
      "Prompts, outputs, tool calls and tool messages inspected at runtime",
      "Every session recorded for audit, with violations tagged inline"
    ],
    "demo": [
      {
        "area": "AI Security » Scout",
        "show": "Endpoint discovery via MDM script — no TLS inspection, no proxy"
      },
      {
        "area": "AI Security » Local Agents",
        "show": "One instance drilled: MCP servers, tools — mark one unsanctioned"
      },
      {
        "area": "AI Security » Agent Sessions",
        "show": "A session timeline with the blocked injected tool message highlighted"
      },
      {
        "area": "AI Security » Integrations",
        "show": "Managed platforms via API, custom agents via the AI-FW proxy"
      }
    ],
    "hook": "How many AI agents are running in your environment right now — and what did each do yesterday?"
  },
  "ai-homegrown-apps": {
    "pain": [
      "You shipped AI features — runtime protection never shipped with them",
      "Nothing between the user's prompt and the model stops injection",
      "Nobody can evidence what the chatbot told a customer"
    ],
    "gain": [
      "A Guard in the interaction path blocks injection and jailbreaks",
      "PII redacted in-flight — the app keeps answering",
      "Every interaction and verdict audited in the Interaction Explorer"
    ],
    "demo": [
      {
        "area": "AI Security » Guards",
        "show": "Three guard types and the sample code developers paste in"
      },
      {
        "area": "Guards Interaction Policy",
        "show": "Engine profiles mapped to Block, Anonymize or Monitor per guard"
      },
      {
        "area": "Security » AI Security » Playground",
        "show": "Run the jailbreak scenario live — tune detectors, re-run safely"
      },
      {
        "area": "Interaction Explorer",
        "show": "Drill the session: detections, verdicts and the engine's analysis report"
      }
    ],
    "hook": "If someone typed 'ignore your system instructions' into your chatbot tonight, what component stops it?"
  },
  "ai-legal-genai": {
    "pain": [
      "Fee-earners already paste client facts into public chatbots",
      "A prompt naming a client is a disclosure — privilege at risk",
      "Conflicting outside-counsel AI clauses defeat any firm-wide policy"
    ],
    "gain": [
      "Client identifiers redacted in-flight — the drafting carries on",
      "Per-client rules mirror your ethical walls via IdP groups",
      "An AI-usage audit pack for client reviews and the regulator"
    ],
    "demo": [
      {
        "area": "AI Security » Discovery",
        "show": "The shadow-AI estate — longer than the managing partner expects"
      },
      {
        "area": "AI Security » AI Users",
        "show": "One associate drilled: apps used, safe-versus-violation split"
      },
      {
        "area": "AI Security » User Interaction Policy",
        "show": "A client's name masked in-flight, the answer still returned"
      },
      {
        "area": "Security » DLP Configuration",
        "show": "The Legal profile flagging agreements, patents and court documents"
      },
      {
        "area": "Monitor » Events",
        "show": "Per-matter AI-usage evidence, exportable for a client security review"
      }
    ],
    "hook": "Your fee-earners use GenAI on client matters today — could you show a client how it is controlled?"
  },
  "ai-eu-ai-act": {
    "pain": [
      "General applicability lands 2 August 2026 — and no AI inventory exists",
      "Over half of organisations lack systematic AI inventories",
      "Penalties reach €35M or 7% of worldwide annual turnover"
    ],
    "gain": [
      "The AI estate discovered from traffic — nothing deployed, nothing blocked",
      "Prompt-level usage control matching how the Act thinks about AI",
      "Attributable, exportable evidence under every deployer obligation"
    ],
    "demo": [
      {
        "area": "AI Security » Monitoring » Overview",
        "show": "App count multiples of belief — the inventory gap, quantified"
      },
      {
        "area": "AI Security » Discovery",
        "show": "Every AI app with users, risk level — embedded SaaS AI included"
      },
      {
        "area": "AI Security » User Interaction Policy",
        "show": "Per-prompt actions — monitor, anonymise or block, with user notification"
      },
      {
        "area": "Monitor » Events",
        "show": "Attributed AI events, exportable to CSV or streamed to SIEM"
      },
      {
        "area": "Administration » Audit Trail",
        "show": "Who changed which AI policy, when, from where"
      }
    ],
    "hook": "If a regulator asked tomorrow which AI systems process EU data, how long would your answer take?"
  },
  "migration-methodology": {
    "pain": [
      "Nobody doubts Cato works — they doubt getting there without an outage",
      "Two networks must co-exist for months while sites move",
      "Asymmetric routing across regional hubs silently drops sessions"
    ],
    "gain": [
      "A proven Professional Services method — engineered, reversible, deliberately boring",
      "Rollback is a route change, not a truck roll",
      "Six co-existence patterns — one fits every topology, proven at ~300 sites"
    ],
    "demo": [
      {
        "area": "Whiteboard — structured discovery",
        "show": "Traffic flows, LAN architecture, routing strategy — facts before design"
      },
      {
        "area": "Whiteboard — macro approach",
        "show": "Big Bang versus phased, against site count and risk appetite"
      },
      {
        "area": "Whiteboard — gateway decision",
        "show": "Which device routes between legacy and Cato — the pattern-selector"
      },
      {
        "area": "Network » Sites",
        "show": "Routed ranges or BGP handoff — size the interconnect hub"
      },
      {
        "area": "Monitor » Topology",
        "show": "Validation tests and a written rollback step per wave"
      }
    ],
    "hook": "The question is not whether Cato works — it is whether you can get there without a weekend of heroics."
  },
  "migration-journey-mpls": {
    "pain": [
      "Migrations stall in the middle, not at the start or end",
      "Circuits expire on different dates — sites straddle two networks for months",
      "The fear: migrated and un-migrated sites losing each other"
    ],
    "gain": [
      "Reachability never breaks — every site routed throughout the exit",
      "Datacentres and cloud come on-net early as low-risk wins",
      "The last circuit switches off — one network, one routing table"
    ],
    "demo": [
      {
        "area": "Phase player — Legacy",
        "show": "Baseline: everything hub-and-spokes through the MPLS carrier core"
      },
      {
        "area": "Phase player — Hub bridge",
        "show": "First Socket at the colo, peering eBGP with the MPLS CE"
      },
      {
        "area": "Phase player — DCs on-net",
        "show": "An HA Socket pair and a vSocket — early, low-risk wins"
      },
      {
        "area": "Phase player — Waves",
        "show": "Branches swing up; the last MPLS site still reaches everything"
      },
      {
        "area": "Phase player — Retired",
        "show": "Circuit off, contract cancelled — full any-to-any on Cato"
      }
    ],
    "hook": "Press play and watch the middle of an MPLS exit — the part everyone fears — never break."
  },
  "migration-journey-sdwan": {
    "pain": [
      "Half the estate on each fabric mid-cutover — asymmetric routing tears sessions apart",
      "Every branch, the DC and even cloud backhaul through one regional hub",
      "The transition, not the destination, is what stalls the decision"
    ],
    "gain": [
      "Both fabrics co-exist cleanly — an eBGP handoff keeps every path symmetric",
      "DC and cloud on-net early; branches cut over with instant rollback",
      "Legacy hub, overlay and licences decommissioned — one fabric remains"
    ],
    "demo": [
      {
        "area": "Phase player » Parallel hub",
        "show": "Cato Socket beside the legacy hub; eBGP handoff, nothing moved yet"
      },
      {
        "area": "Phase player » DC & cloud",
        "show": "HA Sockets in the DC, vSocket in Azure — before any branch"
      },
      {
        "area": "Phase player » Branch waves",
        "show": "Branches swing to the backbone; the handoff stays as the rollback"
      },
      {
        "area": "Phase player » Retired",
        "show": "Legacy hub and overlay struck through — one Cato fabric, any-to-any"
      },
      {
        "area": "Page » Routing insight",
        "show": "AS-path length anchors each site — symmetry by routing, not manual pins"
      }
    ],
    "hook": "It never stalls on whether Cato is better — it stalls on how both fabrics coexist mid-cutover."
  },
  "migration-journey-zscaler": {
    "pain": [
      "The fear that internet security goes dark the moment users leave ZIA",
      "Two products, two policy sets, and an agent that only does security",
      "Private apps reached over ZPA and backhaul; the WAN on other kit"
    ],
    "gain": [
      "The private-app rail is on Cato before a single user moves",
      "ZCC and the Cato Client co-exist — protection never has a gap",
      "One client, one platform for internet and private apps"
    ],
    "demo": [
      {
        "area": "Phase player » Rail first",
        "show": "Socket in the DC, vSocket in AWS — users feel nothing"
      },
      {
        "area": "Phase player » Pilot cutover",
        "show": "Pilot swings to the PoP; ZIA kept one flip away"
      },
      {
        "area": "Phase player » Waves",
        "show": "Cohorts swap on the dual-agent bridge; ZIA drains to standby"
      },
      {
        "area": "Phase player » Retired",
        "show": "ZCC uninstalled, ZIA and ZPA decommissioned — one client, one platform"
      }
    ],
    "hook": "How do users keep internet security while you move? Watch the answer play out in five phases."
  },
  "migration-journey-vpn": {
    "pain": [
      "One VPN tunnel grants the whole network — contractors and BYOD included",
      "Headends sized for peak, patched on the vendor's schedule, internet-exposed",
      "Cloud app traffic hairpins through the datacentre"
    ],
    "gain": [
      "Cohorts swap clients — every user always on exactly one working path",
      "Contractors go clientless in the browser — no agent, no network address",
      "Always-on ZTNA to every app; nothing left listening on the internet"
    ],
    "demo": [
      {
        "area": "Phase player » Cato rail",
        "show": "Socket at the DC, vSocket in Azure — the hairpin collapses"
      },
      {
        "area": "Phase player » Pilot cohort",
        "show": "MDM swaps the pilot; its VPN tunnel falls dormant for rollback"
      },
      {
        "area": "Phase player » Cohort waves",
        "show": "Waves swap clients; contractors go clientless; headends drain to standby"
      },
      {
        "area": "Phase player » Headends off",
        "show": "Concentrators decommissioned — always-on ZTNA, nothing internet-exposed left to patch"
      }
    ],
    "hook": "A VPN replacement moves people, not circuits — cohorts, not cutovers, is why it never stalls."
  },
  "migration-journey-firewall": {
    "pain": [
      "A refresh buys the same posture on newer tin — next EOL booked",
      "Six edges, six rulebases, quietly drifting apart",
      "The renewal quote on the table forces a decision either way"
    ],
    "gain": [
      "FWaaS proves itself in monitor mode against live traffic before enforcing",
      "Every rulebase converges into one CMA policy for edge, DC and cloud",
      "Renewal cancelled — nothing left to size, patch or EOL"
    ],
    "demo": [
      {
        "area": "Phase player » Hub bridges",
        "show": "First Socket at the hub; FWaaS observes while the appliance enforces"
      },
      {
        "area": "Phase player » DC & cloud",
        "show": "AWS vSocket enforcing, DC monitor run — one CMA rulebase forming"
      },
      {
        "area": "Phase player » Branch waves",
        "show": "Waves cut over; the DC splits FWaaS and LAN Firewall duties"
      },
      {
        "area": "Phase player » Renewal cancelled",
        "show": "Last appliance goes quiet — one global policy, no next refresh"
      }
    ],
    "hook": "This renewal quote is a fork: another sizing exercise, or the last one you ever run."
  },
  "migration-zscaler": {
    "pain": [
      "ZIA, ZPA and ZCC — two policy sets, the WAN still separate",
      "Internet traffic hairpins into a separate security cloud",
      "Years of accumulated rules you could not explain, let alone carry forward"
    ],
    "gain": [
      "Four-phase policy conversion cleans the estate up on the way across",
      "Dual agents co-exist — internet protection never has a gap",
      "One agent left on the endpoint; every phase independently reversible"
    ],
    "demo": [
      {
        "area": "Monitor » Experience Monitoring",
        "show": "The cohort's baseline week — everything is judged against it"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "ZIA rules recreated monitor-first, hit counts as parity evidence"
      },
      {
        "area": "Security » CASB",
        "show": "Personal-tenant upload blocked, corporate allowed — matching ZIA's verdict"
      },
      {
        "area": "Monitor » Events",
        "show": "Every verdict attributed to a named user and rule, exported"
      }
    ],
    "hook": "A real customer got to one agent in five reversible phases — with the lessons learned left in."
  },
  "migration-palo-alto": {
    "pain": [
      "Every refresh re-buys hardware plus the whole per-box subscription stack",
      "Panorama is software you must size, run and upgrade yourself",
      "Expedition is end-of-life — no vendor migration path, even PA-to-PA"
    ],
    "gain": [
      "Inspection moves to the PoP — nothing licensed or sized per box",
      "Parallel socket behind the PA; rollback is a route withdrawal",
      "One CMA rulebase replaces zones, Panorama and GlobalProtect"
    ],
    "demo": [
      {
        "area": "Monitor » Topology",
        "show": "Parallel socket up beside the PA — day-one co-existence proof"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "Highest-hit App-ID rules translated, firing with the same intent"
      },
      {
        "area": "Monitor » Experience Monitoring",
        "show": "The GlobalProtect cohort's week on the Cato Client, scored per user"
      },
      {
        "area": "Monitor » Threats Dashboard",
        "show": "IPS monitor-then-block — a test detection stopped and attributed"
      },
      {
        "area": "Monitor » Topology",
        "show": "Withdraw the handoff route — reversion timed in minutes"
      }
    ],
    "hook": "The PA refresh date is already on the calendar — and Palo Alto's own migration tool is end-of-life."
  },
  "migration-netskope": {
    "pain": [
      "Five steering mechanisms, each with its own exceptions and failure modes",
      "SD-WAN by acquisition — appliances feeding a separate security cloud, two dataplanes",
      "DLP, CASB and ZTNA tuning can take months"
    ],
    "gain": [
      "Two steering paths only — Socket for sites, Client for users",
      "Cohorts swap in one window; rollback is a client push",
      "One converged single-pass engine and one policy model"
    ],
    "demo": [
      {
        "area": "Access » Users",
        "show": "The cohort connected on the Cato Client, identified by name"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "Named private apps allowed per user — the Publisher's job done by routing"
      },
      {
        "area": "Security » DLP Configuration",
        "show": "One profile rebuilt from source data, matched in monitor mode"
      },
      {
        "area": "Monitor » Events",
        "show": "SWG and CASB verdicts at parity with the Netskope logs"
      },
      {
        "area": "Monitor » Experience Monitoring",
        "show": "Scores hold steady — leaving the Netskope Client cost users nothing"
      }
    ],
    "hook": "Netskope's SSE is strong — the case is architectural: one converged dataplane instead of five steering mechanisms."
  },
  "migration-cisco": {
    "pain": [
      "Umbrella, AnyConnect, SD-WAN, firewalls, ISE — each its own console and renewal",
      "Cisco's own calendar has already booked several migrations for you",
      "Genuine roadmap uncertainty — Secure Access adds yet another console mid-transition"
    ],
    "gain": [
      "One platform, one policy model, one renewal",
      "Regional eBGP hubs keep both overlays symmetric throughout the move",
      "Every plane keeps its own rehearsed, minutes-long rollback lever"
    ],
    "demo": [
      {
        "area": "Security » Internet Firewall",
        "show": "Umbrella destination lists deduped into ordered rules, monitor-first"
      },
      {
        "area": "Network » Sites » BGP",
        "show": "The eBGP hub handoff established — overlay routes exchanged both ways"
      },
      {
        "area": "Access » Device Posture",
        "show": "The ISE posture set rebuilt as one Cato profile"
      },
      {
        "area": "Monitor » Experience Monitoring",
        "show": "The AnyConnect cohort's quiet, green week on the Cato Client"
      },
      {
        "area": "Monitor » Events",
        "show": "All three planes in one feed — the multi-console problem closed"
      }
    ],
    "hook": "How many separate migrations has the Cisco portfolio already booked for you over the next eighteen months?"
  },
  "migration-fortinet": {
    "pain": [
      "FortiOS tops the known-exploited list — emergency patches at awkward times",
      "Support ends 60 months after end of order; every refresh re-sizes everything",
      "FortiOS 7.6.3 removes SSL-VPN — remote access must be re-engineered anyway"
    ],
    "gain": [
      "A cloud-delivered platform that Cato patches and scales for you",
      "Parallel socket at each hub — rollback is just BGP reconverging",
      "One global rulebase replaces per-box policy packages and UTM profiles"
    ],
    "demo": [
      {
        "area": "Network » Sites » BGP",
        "show": "Hub handoff Established — legacy and Cato routes exchanged both ways"
      },
      {
        "area": "Monitor » Topology",
        "show": "The pilot branch reaching un-migrated FortiGate sites, and back"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "The translated policy slice firing against the FortiAnalyzer baseline"
      },
      {
        "area": "Monitor » Experience Monitoring",
        "show": "The SSL-VPN cohort's full week on the Cato Client"
      },
      {
        "area": "Network » Routing Table",
        "show": "Rollback rehearsed — spoke re-enabled, BGP reconverges in minutes"
      }
    ],
    "hook": "FortiOS 7.6.3 removes SSL-VPN either way — spend that re-engineering once, on the way out."
  },
  "migration-forcepoint": {
    "pain": [
      "PAC files, GPOs and proxy settings maintained everywhere, forever",
      "Separate consoles for web, firewall and SSE from a vendor pivoting elsewhere",
      "Only proxied web ports inspected; appliances still need patching and refresh"
    ],
    "gain": [
      "Transparent steering — no PAC or explicit proxy left to maintain",
      "Web, firewall, remote access and DLP policy in one console",
      "Every port and protocol inspected at the PoP, cohort by cohort"
    ],
    "demo": [
      {
        "area": "Access » Users",
        "show": "Pilot cohort synced over SCIM, every user identified by name"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "Category rules with live hit counts — Confirm becomes Prompt"
      },
      {
        "area": "Security » DLP Configuration",
        "show": "Forcepoint classifiers landed as predefined data types and EDM"
      },
      {
        "area": "Security » TLS Inspection",
        "show": "Bypasses first, then Inspect rules scoped to the pilot"
      },
      {
        "area": "Monitor » Events",
        "show": "Every verdict attributed to a named user and rule"
      }
    ],
    "hook": "Where does a proxy-heritage web stack sit in a data-security-first roadmap?"
  },
  "migration-anyconnect": {
    "pain": [
      "AnyConnect 4.x ends March 2027 — a client migration is unavoidable",
      "Concentrators sized for peak, patched on emergency windows, internet-exposed",
      "Full tunnels hairpin cloud traffic; split tunnels skip inspection entirely"
    ],
    "gain": [
      "Nearest PoP, no headend — nothing to size, patch or expose",
      "Always-on ZTNA with IdP MFA and continuous device posture",
      "App-level least privilege replaces subnet access; capacity absorbs any surge"
    ],
    "demo": [
      {
        "area": "Cato Client",
        "show": "SSO and MFA, attached to the nearest PoP — no gateway drop-down"
      },
      {
        "area": "Access » Client Connectivity Policy",
        "show": "Who may connect — group, country, posture — without DAP sprawl"
      },
      {
        "area": "Access » Device Posture",
        "show": "Checks evaluated continuously, not once at logon"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "One named app granted; the adjacent resource blocked"
      },
      {
        "area": "Monitor » Events",
        "show": "The full session trail, attributed to identity"
      }
    ],
    "hook": "You are already forced to replace the client — why rebuild the same architecture?"
  },
  "migration-directaccess": {
    "pain": [
      "DirectAccess is deprecated — removal lands with your next Windows Server refresh",
      "Windows-only and domain-joined only — Macs, phones and contractors never covered",
      "NLS, PKI and IP-HTTPS plumbing to nurse; one outage breaks everyone"
    ],
    "gain": [
      "Always-on across Windows, macOS and mobile — no domain join required",
      "Nothing left to keep alive — no NLS, PKI or gateway",
      "Named applications, not network reach, gated by live device posture"
    ],
    "demo": [
      {
        "area": "Cato Client",
        "show": "Always-on to the nearest PoP — no NLS, no domain join"
      },
      {
        "area": "Access » Client Connectivity Policy",
        "show": "Who may connect, made explicit and identity-driven"
      },
      {
        "area": "Access » Device Posture",
        "show": "Managed-device trust enforced live, not implied by domain membership"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "The user on the application, not the machine on the network"
      },
      {
        "area": "Monitor » Events",
        "show": "One identity-attributed audit trail, in one place"
      }
    ],
    "hook": "Microsoft has already decided DirectAccess dies — the only question is what replaces it."
  },
  "migration-versa": {
    "pain": [
      "Director, Controller, Analytics, Concerto — a head-end someone must host and patch",
      "Carrier-managed estates: every change is a provider ticket with lead time",
      "Head-end CVEs — a Director zero-day, a CVSS 10 Concerto bypass"
    ],
    "gain": [
      "No head-end anywhere in the estate — the vendor patches the platform",
      "One console for SD-WAN and security, changes without tickets",
      "Per-spoke cutover and rollback are simple routing events"
    ],
    "demo": [
      {
        "area": "Site Settings » BGP",
        "show": "Parallel Socket beside the Versa hub, eBGP neighbour Established"
      },
      {
        "area": "Network » Routing Table",
        "show": "Overlay prefixes learned with AS path and communities"
      },
      {
        "area": "Monitor » Cloud Apps Dashboard",
        "show": "Shadow-IT discovery the VOS estate has never had"
      },
      {
        "area": "Monitor » Experience Monitoring",
        "show": "Pilot site and cohort scored across a working week"
      },
      {
        "area": "Monitor » Events",
        "show": "Translated rules matching what their VOS ancestors matched"
      }
    ],
    "hook": "Who patched your Director in August 2024 — you, your carrier, or nobody?"
  },
  "migration-cloudflare": {
    "pain": [
      "Zero Trust accreted app by app — fragmented, sometimes across accounts",
      "The free anchor hides add-ons: isolation, egress IPs, DLP, retention",
      "Thin branch networking — no QoS, no fail-open, thirty-second failover"
    ],
    "gain": [
      "One converged dataplane — Socket for sites, Client for users",
      "A managed SD-WAN edge with QoS, HA and monitored last mile",
      "CDN, WAF and DNS stay on Cloudflare — a scoped, safe move"
    ],
    "demo": [
      {
        "area": "Security » Internet Firewall",
        "show": "Gateway's three policy types in one ordered rulebase"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "Each Access app becomes one rule over an implicit deny"
      },
      {
        "area": "Access » Client Connectivity Policy",
        "show": "A posture-failing device refused at connect, reason shown"
      },
      {
        "area": "Network » Sites",
        "show": "The Magic WAN edge re-pointed — both IPsec tunnels up"
      },
      {
        "area": "Monitor » Experience Monitoring",
        "show": "Cohort scores holding from the day of the swap"
      }
    ],
    "hook": "Could you list every Access app, tunnel and service token today?"
  },
  "migration-iboss": {
    "pain": [
      "PAC sprawl and per-platform connectors encode years of tribal knowledge",
      "SSE-only until 2024 — a separate network vendor, two policy planes",
      "SaaS and exam allowlists keyed to dedicated egress IPs nobody owns"
    ],
    "gain": [
      "Transparent steering — no proxy configuration on any endpoint",
      "Networking and security converge in one console, one renewal",
      "Every wave keeps a rollback rail — the hosted PAC"
    ],
    "demo": [
      {
        "area": "Network » Sites",
        "show": "A Socket replaces the GRE tunnel — HA and QoS gained"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "The cohort's tier translated — hit counts as safeguarding evidence"
      },
      {
        "area": "Security » IPS",
        "show": "SafeSearch enforced, YouTube restricted, DoH controlled"
      },
      {
        "area": "Security » TLS Inspection",
        "show": "Both root CAs coexist; bypasses seeded from iboss lists"
      },
      {
        "area": "Monitor » Events",
        "show": "A per-user trail — reporting continuity for the safeguarding lead"
      }
    ],
    "hook": "Which exam platforms are keyed to your iboss egress IPs today?"
  },
  "migration-checkpoint": {
    "pain": [
      "The December 2025 appliance end-of-support wave — refresh quotes landing now",
      "R81.10 dies March 2026: management upgrade first, then every gateway",
      "Two policy planes — SmartConsole layers plus the Harmony SASE portal"
    ],
    "gain": [
      "One policy plane in the CMA — no management server to run",
      "Every cutover a route announcement, every rollback a withdrawal",
      "No more fleet hotfix drills — Cato patches the PoPs"
    ],
    "demo": [
      {
        "area": "Monitor » Topology",
        "show": "Parallel Socket up beside the untouched Quantum gateway"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "Ordered layers flattened into one first-match rulebase"
      },
      {
        "area": "Security » TLS Inspection",
        "show": "Bypass-first staging beside the HTTPS Inspection blade export"
      },
      {
        "area": "Monitor » Threats Dashboard",
        "show": "IPS monitor-first, then a blocked test detection, attributed"
      },
      {
        "area": "Monitor » Events",
        "show": "Hit counts read against the week-zero show-hits baseline"
      }
    ],
    "hook": "Spend the refresh budget renewing the appliance model — or retiring it?"
  },
  "migration-edgeconnect": {
    "pain": [
      "SD-WAN only by design — full inspection service-chained to a separate SSE",
      "Two consoles, two contracts, tunnel orchestration as the operational seam",
      "Three HPE SD-WAN lines post-Juniper — whose roadmap survives?"
    ],
    "gain": [
      "SD-WAN and SSE consolidated in a single move, one console",
      "A thin Socket at the edge, elastic inspection in the PoP",
      "No per-Mbps Boost metering — acceleration and loss mitigation platform-wide"
    ],
    "demo": [
      {
        "area": "Site Settings » BGP",
        "show": "The eBGP handoff Established with the EdgeConnect hub"
      },
      {
        "area": "Network » Network Rules",
        "show": "One BIO's intent as an app-aware rule with hit counts"
      },
      {
        "area": "Network » Bandwidth Management",
        "show": "Overlay QoS re-expressed — shaping only under congestion"
      },
      {
        "area": "Monitor » App Analytics",
        "show": "The Boost honesty test — timed transfers against the business window"
      },
      {
        "area": "Monitor » Events",
        "show": "Firewall and IPS verdicts with no SSE tunnel in path"
      }
    ],
    "hook": "Can HPE say in writing which of three SD-WAN lines carries the roadmap?"
  },
  "migration-symantec": {
    "pain": [
      "Blue Coat hardware on a published EOL calendar; Reporter already discontinued",
      "Twenty years of CPL nobody can audit, maintained by hand",
      "Subscription-only renewals with steep uplifts from a restructuring vendor"
    ],
    "gain": [
      "PAC and WCCP retired — transparent steering, single-pass inspection",
      "CPL rationalised to a rulebase every hit count justifies",
      "WSS, CloudSOC and DLP intent land in one console"
    ],
    "demo": [
      {
        "area": "Security » Internet Firewall",
        "show": "The rationalised slice — coach pages reborn as Prompt"
      },
      {
        "area": "Security » TLS Inspection",
        "show": "The SSL Visibility appliance recast as PoP policy"
      },
      {
        "area": "Monitor » Cloud Apps Dashboard",
        "show": "CASB discovery with no SpanVA collector deployed"
      },
      {
        "area": "Access » Client Connectivity Policy",
        "show": "A pilot-scoped rule — enforcement lands only on the cohort"
      },
      {
        "area": "Monitor » Events",
        "show": "Verdicts attributed by name — no proxy challenge needed"
      }
    ],
    "hook": "Reporter is end-of-life — your hit data is a wasting asset either way."
  },
  "migration-sophos": {
    "pain": [
      "XG firewalls unpatched since March 2025 — and the XGS quote keeps rising",
      "SD-RED sites hairpin everything to the hub with no local inspection",
      "VPN portal and ZTNA gateway sit exposed on the WAN edge"
    ],
    "gain": [
      "Keep the Sophos endpoint stack you like — only the network moves",
      "Zero-touch Sockets replace SD-REDs, full inspection at the nearest PoP",
      "WAN-facing portals retired for good; rollback is re-plugging the RED"
    ],
    "demo": [
      {
        "area": "Network » Sites",
        "show": "SD-RED swapped for a zero-touch Socket; hub handoff live"
      },
      {
        "area": "Access » Device Posture",
        "show": "Sophos agent visible in the anti-malware check drop-down"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "Translated SFOS slice with live hit counts, monitor-first"
      },
      {
        "area": "Monitor » Experience Monitoring",
        "show": "Pilot cohort scoring Good with both agents installed"
      },
      {
        "area": "Monitor » Topology",
        "show": "Rollback drilled mid-pilot — re-plug the RED, revert, swap forward"
      }
    ],
    "hook": "Your XGS refresh quote rises again in July 2026 — what if it removed the appliance cycle instead?"
  },
  "migration-cisco-asa": {
    "pain": [
      "Every 5500-X is at or past its last date of support",
      "A frozen 9.16 train — no fixes, no vulnerability response, no TAC",
      "A Firepower refresh is a full migration that keeps the exposed appliance"
    ],
    "gain": [
      "Spend the forced migration once — the perimeter appliance class leaves entirely",
      "SWG, CASB, DLP and TLS inspection the ASA never had, built greenfield",
      "Rollback is a route change — the ASA stays racked through soak"
    ],
    "demo": [
      {
        "area": "Network » Sites",
        "show": "Hub ASA up as an IPsec IKEv2 site — no TS_UNACCEPTABLE"
      },
      {
        "area": "Monitor » Topology",
        "show": "Pilot branch on a Socket, tunnels green, ASA still racked"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "Translated ACEs as an ordered allowlist with live hit counts"
      },
      {
        "area": "Monitor » Threats Dashboard",
        "show": "Monitor-mode verdicts on traffic the ASA never inspected"
      },
      {
        "area": "Monitor » Experience Monitoring",
        "show": "RA cohort baselined Good — no concentrator hairpin"
      }
    ],
    "hook": "CISA ordered end-of-support ASAs permanently disconnected — a government has called time on this appliance category."
  },
  "migration-sonicwall": {
    "pain": [
      "Firewall-terminated SSL-VPN was the entry point in successive ransomware campaigns",
      "The cloud-backup breach means configs and credentials are presumed adversary-held",
      "Gen 6 boxes past end of support — the refresh cliff forces spend anyway"
    ],
    "gain": [
      "The exploited SSL-VPN surface goes first — cohorts on ZTNA, portals dark",
      "Policy rebuilt clean with every secret rotated — nothing compromised re-imported",
      "The refresh budget removes the appliance cycle instead of buying Gen 8"
    ],
    "demo": [
      {
        "area": "Access » Users",
        "show": "Pilot cohort on IdP-backed ZTNA — zero firewall-local accounts"
      },
      {
        "area": "Network » Sites",
        "show": "TZ branch on a Socket; NSa on-ramp carrying legacy traffic"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "Zone-matrix slice at parity in monitor mode"
      },
      {
        "area": "Monitor » Topology",
        "show": "Rollback drilled — re-plug the TZ, its VPN re-establishes"
      }
    ],
    "hook": "Every cloud-backup customer's firewall config was accessed — would you re-import that policy into anything?"
  },
  "migration-zscaler-policy": {
    "pain": [
      "Hundreds of ZIA rules across half a dozen engines nobody can defend",
      "Lift-and-shift imports dead rules, contradictions and every Zscaler quirk",
      "Category and DLP semantics diverge — verbatim copies silently weaken security"
    ],
    "gain": [
      "Only rules the business actually uses land in Cato — culled on hit counts",
      "Half a dozen policy engines collapse into one ordered, identity-aware rulebase",
      "Monitor-first deployment — events prove every rule before anything blocks"
    ],
    "demo": [
      {
        "area": "Security » Internet Firewall",
        "show": "One of their real ZIA rules rebuilt live, tracking on"
      },
      {
        "area": "Security » TLS Inspection",
        "show": "Why CASB, DLP and tenant restrictions queue behind this step"
      },
      {
        "area": "Security » CASB",
        "show": "Default recommended policy with their tenant restriction swapped in"
      },
      {
        "area": "Security » DLP Configuration",
        "show": "Data Control rule in monitor; EDM hashed in-browser"
      },
      {
        "area": "Monitor » Events",
        "show": "Every match attributed to user, app and rule"
      }
    ],
    "hook": "Copying five years of ZIA policy verbatim is the most reliable way to wreck a migration."
  },
  "migration-palo-alto-policy": {
    "pain": [
      "Fifteen years of App-ID rulebase layered across Panorama device groups",
      "Expedition is end-of-life — there is no tool left to hide behind",
      "application-default and zone semantics broaden silently if copied verbatim"
    ],
    "gain": [
      "A materially shorter rulebase by design — profile-only duplicates simply collapse",
      "Hit counts decide what migrates; dead rules never reach the platform",
      "Enforcement earned on event evidence — no day-one helpdesk storm"
    ],
    "demo": [
      {
        "area": "Security » Internet Firewall",
        "show": "Where internet-bound rules land; explicit blocks keep deny intent"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "One of their zone-pair rules mapped onto the allowlist live"
      },
      {
        "area": "Security » TLS Inspection",
        "show": "The staged wizard gating SWG, CASB and DLP fidelity"
      },
      {
        "area": "Monitor » Cloud Apps Dashboard",
        "show": "Discovered SaaS usage challenging the sanctioned-app list"
      },
      {
        "area": "Monitor » Events",
        "show": "Events are the new hit counts — translation proven"
      }
    ],
    "hook": "How many rules are in your rulebase — and how many actually fired in the last 90 days?"
  },
  "migration-netskope-policy": {
    "pain": [
      "Hundreds of Real-time Protection rules and DLP profiles nobody remembers commissioning",
      "A steering-exception list encoding years of operational archaeology",
      "EDM datasets cannot be exported — they are hashed in vendor-specific form"
    ],
    "gain": [
      "The firing subset migrates; the rest becomes a rationalisation log",
      "Instance-aware controls land by intent — tenant restrictions plus App Control",
      "Side-by-side monitor mode proves hit parity before anything enforces"
    ],
    "demo": [
      {
        "area": "Security » Internet Firewall",
        "show": "Cloud Firewall and RTP web rules converge in one rulebase"
      },
      {
        "area": "Security » CASB",
        "show": "An instance-aware rule mapped live, by intent"
      },
      {
        "area": "Security » DLP Configuration",
        "show": "EDM rebuilt from source systems — never imported"
      },
      {
        "area": "Security » TLS Inspection",
        "show": "Bypasses seeded from their SSL do-not-decrypt list"
      },
      {
        "area": "Monitor » Events",
        "show": "Hit tracking that gates every monitor-to-block flip"
      }
    ],
    "hook": "Your SSL do-not-decrypt list is years of archaeology — inherit it, don't rediscover it."
  },
  "migration-cisco-policy": {
    "pain": [
      "Policy scattered across ASDM, FMC, CDO and the Umbrella dashboard",
      "Nobody can say which of the accumulated exceptions still matter",
      "Umbrella policy is keyed to egress IPs that vanish at cutover"
    ],
    "gain": [
      "Separate DNS, web and firewall policies collapse into one inspection engine",
      "Hit counts cull the graveyard before a single rule is translated",
      "Real identity replaces egress-IP guesswork — rules follow users, not addresses"
    ],
    "demo": [
      {
        "area": "Security » WAN Firewall",
        "show": "One ordered base replacing several per-interface ACLs"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "A destination list reborn as a custom category, in monitor"
      },
      {
        "area": "Security » TLS Inspection",
        "show": "Decryption scope gating SWG, CASB and DLP fidelity"
      },
      {
        "area": "Monitor » Cloud Apps Dashboard",
        "show": "The shadow-IT view replacing Umbrella App Discovery"
      },
      {
        "area": "Monitor » Events",
        "show": "Monitor-mode telemetry; parity criteria agreed per domain"
      }
    ],
    "hook": "What percentage of your ASA ACEs show zero hits today — and who would still defend the rest?"
  },
  "migration-fortinet-policy": {
    "pain": [
      "Per-VDOM policy tables and near-identical UTM profile variants nobody will delete",
      "Thousands of address and service objects hiding dead entries",
      "Traffic with no profile attached was never inspected at all"
    ],
    "gain": [
      "Profile pairs become platform layers; carve-outs turn into auditable exceptions",
      "Object translation scripted end-to-end from the flat-text config",
      "The single-pass engine inspects everything — detections triaged before enforcement"
    ],
    "demo": [
      {
        "area": "Security » WAN Firewall",
        "show": "One global rulebase — no interface pairs, no policy packages"
      },
      {
        "area": "Administration » API & Integrations",
        "show": "Objects scripted in via GraphQL or Terraform, not re-keyed"
      },
      {
        "area": "Security » TLS Inspection",
        "show": "The staged switch SWG, CASB and DLP all hang off"
      },
      {
        "area": "Monitor » Cloud Apps Dashboard",
        "show": "Shadow-IT discovery running with zero configuration"
      },
      {
        "area": "Monitor » Events",
        "show": "Hit evidence justifying each monitor-to-block flip"
      }
    ],
    "hook": "Translate the estate badly and your old technical debt arrives on a new platform wearing a new logo."
  },
  "migration-forcepoint-policy": {
    "pain": [
      "Four policy heritages across four consoles — Stonesoft, Websense, Bitglass, TRITON",
      "DLP policies that never raised a triaged incident still linger",
      "Fingerprint hashes and ML classifiers cannot be ported between vendors"
    ],
    "gain": [
      "Four consoles converge into one coherent, explainable CMA rulebase",
      "Every DLP policy gets a recorded decision — map, rebuild or retain",
      "An honest hybrid keeps endpoint depth where USB and print mandates demand"
    ],
    "demo": [
      {
        "area": "Security » Internet Firewall",
        "show": "A Confirm rule mapped to Prompt; block baseline inherited day one"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "Site-to-site SMC rules on the default-deny allowlist"
      },
      {
        "area": "Security » TLS Inspection",
        "show": "Staged rollout — one inspection owner per cohort"
      },
      {
        "area": "Security » DLP Configuration",
        "show": "One of their real classifiers mapped live, set to monitor"
      },
      {
        "area": "Monitor » Events",
        "show": "Telemetry that retires dead rules and earns the block"
      }
    ],
    "hook": "The DLP estate decides this deal — rationalise it classifier by classifier, not rip and hope."
  },
  "migration-iboss-policy": {
    "pain": [
      "Per-OU web tiers and bypass lists built exception by exception for years",
      "Nobody remembers why half the rules exist, or when hit counts were reviewed",
      "SaaS tenant restrictions keyed to dedicated egress IPs — one slip breaks exams"
    ],
    "gain": [
      "Rationalise first: dead rules die at review, not in the new console",
      "One ordered global policy expresses every OU tier, with safeguarding-grade user evidence",
      "Monitor-first waves with the PAC kept hosted — rollback is one GPO change"
    ],
    "demo": [
      {
        "area": "Security » Internet Firewall",
        "show": "One ordered policy expressing the per-OU tier ladder as group-scoped rules"
      },
      {
        "area": "Security » TLS Inspection",
        "show": "Bypass rules seeded from their harvested PAC and SSL lists"
      },
      {
        "area": "Security » CASB",
        "show": "Activity-granular App Control from the default recommended policy, in monitor"
      },
      {
        "area": "Security » DLP Configuration",
        "show": "Content profiles rebuilt from rule intent — 350+ predefined data types"
      },
      {
        "area": "Monitor » Events",
        "show": "User-attributed events — safeguarding reporting continuity answered on screen"
      }
    ],
    "hook": "The steering swap takes weeks; the policy keeps you paying iboss for months. Shall we shrink it first?"
  },
  "migration-versa-policy": {
    "pain": [
      "A branch's real policy is template layers plus bind data — nobody sees it",
      "In carrier-managed estates even the export is a change ticket with lead time",
      "Per-rule UTM profiles and template drift breed duplicate objects and dead rules"
    ],
    "gain": [
      "Effective policy rebuilt per site, rationalised on Analytics hit counts before mapping",
      "One readable rulebase — IPS and anti-malware as global layers, not profiles",
      "CASB and DLP arrive as the upgrade: visibility the estate never had"
    ],
    "demo": [
      {
        "area": "Security » WAN Firewall",
        "show": "Default-deny allowlist with sections mirroring how templates used to scope"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "Category rules replacing URL-filter profiles; allow-plus-track for alert-only intent"
      },
      {
        "area": "Security » TLS Inspection",
        "show": "Staged inspection — the fidelity prerequisite for SWG, CASB and DLP"
      },
      {
        "area": "Monitor » Cloud Apps Dashboard",
        "show": "Shadow-IT discovery and risk scores — the greenfield CASB upgrade"
      },
      {
        "area": "Monitor » Events",
        "show": "Every hit attributed to user and rule — how monitor earns block"
      }
    ],
    "hook": "Could you produce one branch's effective firewall policy today — or does that answer start with a provider ticket?"
  },
  "migration-cloudflare-policy": {
    "pain": [
      "Gateway splits intent across DNS, network and HTTP rule sets, plus Magic Firewall",
      "DLP and Browser Isolation are paid add-ons — scope depends on the invoice",
      "CASB is API findings, not inline control — apps reported after the fact"
    ],
    "gain": [
      "One converged CMA policy model for firewall, SWG, CASB and DLP",
      "Isolation becomes a policy action beside Block and Prompt — no separate SKU",
      "Every rule lands in monitor first; enforcement flips on event evidence"
    ],
    "demo": [
      {
        "area": "Security » WAN Firewall",
        "show": "Allowlist versus blocklist postures — where network and Magic Firewall rules land"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "Allow, Block, Prompt and RBI Isolate in one ordered rulebase"
      },
      {
        "area": "Security » TLS Inspection",
        "show": "Category staging; rebuild a Do-Not-Inspect entry as an exception live"
      },
      {
        "area": "Security » CASB",
        "show": "App Catalog risk scores and inline App Control — findings become enforcement"
      },
      {
        "area": "Monitor » Events",
        "show": "Hit counts accumulating on a migrated rule — the evidence to enforce"
      }
    ],
    "hook": "How many of your Gateway rules fired in ninety days — and which add-ons are actually on the contract?"
  },
  "migration-checkpoint-policy": {
    "pain": [
      "Ordered and inline layers hide what policy actually allows — every layer must pass",
      "NAT lives in its own rulebase, apart from access policy entirely",
      "A decade of shared layers, delegation debt and zero-hit rules per domain"
    ],
    "gain": [
      "Translate the effective policy, flattened into one first-match rulebase per direction",
      "Hit-count exports rationalise before mapping — the migration shrinks before it starts",
      "Implicit cleanups become explicit decisions; monitor mode proves every rule first"
    ],
    "demo": [
      {
        "area": "Security » WAN Firewall",
        "show": "One flat allowlist — flatten one of their layered rules live"
      },
      {
        "area": "Administration » API & Integrations",
        "show": "Object translation scripted end-to-end from the object-dictionary export"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "Category mapping by intent; Prompt standing in for UserCheck pages"
      },
      {
        "area": "Security » TLS Inspection",
        "show": "Staged inspection their constrained HTTPS Inspection blade never delivered"
      },
      {
        "area": "Monitor » Events",
        "show": "Hit evidence justifying each monitor-to-block promotion, with audit trail"
      }
    ],
    "hook": "How many layers exist because traffic needs a boundary — and how many because an administrator needed delegation?"
  },
  "migration-edgeconnect-policy": {
    "pain": [
      "Policy lives in two planes: seven overlays in Orchestrator, web security elsewhere",
      "Seven overlays are usually three or four intents wearing different topologies",
      "The SSE service chain means two consoles, two rulebases, one tunnel seam"
    ],
    "gain": [
      "Overlay intent becomes two clean constructs: network rules plus bandwidth profiles",
      "Single-pass inspection at the PoP retires the service chain entirely",
      "CASB and DLP built greenfield — the upgrade the WAN estate never had"
    ],
    "demo": [
      {
        "area": "Network » Network Rules",
        "show": "A BIO's steering and QoS intent as one app-aware rule"
      },
      {
        "area": "Security » WAN Firewall",
        "show": "Hub-and-spoke topology restated explicitly as which-sites-reach-which rules"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "Breakout policy with no tunnel to a third-party SWG anywhere"
      },
      {
        "area": "Security » TLS Inspection",
        "show": "Staged inspection underpinning the SWG, CASB and DLP domains"
      },
      {
        "area": "Monitor » Events",
        "show": "Allow, block and monitor hits attributed — one console, not two"
      }
    ],
    "hook": "How many of your seven overlays could you justify today? Two sharing an answer is one intent, not two."
  },
  "migration-symantec-policy": {
    "pain": [
      "Up to twenty years of CPL across VPM and hand-written Local files",
      "Four consoles — VPM, WSS portal, CloudSOC, DLP Enforce — one estate",
      "Reporter is end-of-life — the hit-data evidence base is already sunset"
    ],
    "gain": [
      "No converter exists, and that's the win: rationalise, don't port the debt",
      "Proxy plumbing — auth exemptions, WCCP, PAC files — retires without replacement",
      "An honest DLP position: direct map, rebuild, or deliberately retain the endpoint depth"
    ],
    "demo": [
      {
        "area": "Security » Internet Firewall",
        "show": "Coach pages become Prompt; CPL intent lands as ordered category rules"
      },
      {
        "area": "Access » Users",
        "show": "SCIM identity replacing IWA realms, BCAAA and Kerberos SPNs entirely"
      },
      {
        "area": "Security » TLS Inspection",
        "show": "The SSLV appliance rebuilt as staged PoP policy with verified bypasses"
      },
      {
        "area": "Security » DLP Configuration",
        "show": "Map a described-content policy live; state the IDM/VML position plainly"
      },
      {
        "area": "Monitor » Events",
        "show": "Hit counts playing Reporter's role — evidence for every promotion"
      }
    ],
    "hook": "How many CPL layers are live, when were they audited — and who archives the hit data before Reporter dies?"
  },
  "migration-sophos-policy": {
    "pain": [
      "Per-appliance rule tables with near-identical web-policy variants per user population",
      "Inspection only happens where a policy is attached — gaps nobody sees",
      "Rules conditioned on Security Heartbeat break silently once the firewall goes"
    ],
    "gain": [
      "Per-box rulebases collapse into one global policy, rationalised on usage evidence",
      "TLS inspection scoped by intent, not by what the appliance could afford",
      "CASB and DLP built greenfield — the upgrade, not the gap"
    ],
    "demo": [
      {
        "area": "Security » WAN Firewall",
        "show": "Opposite default postures — translate one of their egress rules live"
      },
      {
        "area": "Administration » API & Integrations",
        "show": "The XML export scripted into objects via GraphQL or Terraform"
      },
      {
        "area": "Security » Internet Firewall",
        "show": "Category mapping by intent; Prompt replacing their Warn pages"
      },
      {
        "area": "Monitor » Cloud Apps Dashboard",
        "show": "Shadow-IT discovery with zero configuration — the greenfield domains"
      },
      {
        "area": "Monitor » Events",
        "show": "Hit evidence that flips a monitor rule to block"
      }
    ],
    "hook": "How many SFOS rules passed no traffic in ninety days — and how many depend on a Heartbeat that's leaving?"
  },
  "migration-cisco-asa-policy": {
    "pain": [
      "A decade of interface ACLs and nested object-groups, many entries dead",
      "NAT dependencies invisible in the ACL export — the classic cutover breaker",
      "Nothing above layer 4: no web filtering, CASB, DLP or TLS inspection"
    ],
    "gain": [
      "ACLs rationalised on hitcnt evidence, split cleanly into WAN and Internet bases",
      "The NAT table dissolves deliberately — PoP egress NAT is a platform property",
      "SWG, CASB and DLP arrive greenfield from best-practice baselines — the uplift"
    ],
    "demo": [
      {
        "area": "Security » WAN Firewall",
        "show": "Translate an east-west ACE live — no interfaces, no security levels"
      },
      {
        "area": "Administration » API & Integrations",
        "show": "Expanded ACL output scripted into objects via GraphQL or Terraform"
      },
      {
        "area": "Access » Device Posture",
        "show": "DAP and HostScan intent rebuilt as continuously evaluated posture profiles"
      },
      {
        "area": "Security » TLS Inspection",
        "show": "Staged bypass-first inspection — no appliance throughput deciding the scope"
      },
      {
        "area": "Monitor » Events",
        "show": "Event evidence justifying every promotion and every cull"
      }
    ],
    "hook": "How many ACEs show zero hits today — and what inspects a laptop's upload to a personal cloud drive?"
  },
  "migration-sonicwall-policy": {
    "pain": [
      "A zone matrix per box, multiplied across the branch estate, hiding duplication",
      "DPI-SSL rationed by appliance connection limits — many estates never fully enabled it",
      "After the cloud-backup breach, every credential in the export is potential breach material"
    ],
    "gain": [
      "Rule zero: every secret rotated at migration, never ported to a third platform",
      "The SSLVPN zone is replaced by IdP-backed ZTNA, not translated",
      "One global rulebase levels every site up to the same protections"
    ],
    "demo": [
      {
        "area": "Security » WAN Firewall",
        "show": "Translate a zone-matrix rule live into one global ordered rulebase"
      },
      {
        "area": "Administration » API & Integrations",
        "show": "SonicOS API JSON scripted into objects via GraphQL or Terraform"
      },
      {
        "area": "Security » TLS Inspection",
        "show": "Their first full inspection — bypasses first, no connection-count ceiling"
      },
      {
        "area": "Monitor » Cloud Apps Dashboard",
        "show": "Shadow-IT discovery and DLP — the domains the firewall never had"
      },
      {
        "area": "Monitor » Events",
        "show": "The discard pile and the rotation log — two auditable outcomes"
      }
    ],
    "hook": "After the MySonicWall backup breach, who rotated the credentials sitting inside your configuration exports?"
  }
};
