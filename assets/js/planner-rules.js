/* Cato Use Case Library — Migration Planner rules (internal).

   The planner is deterministic: these rules are the whole of its judgement.
   `phases` is the canonical spine, in dependency order — a step may only be placed
   in a phase whose prerequisites its own dimension has already satisfied.
   `dimensions[].options[].pages` must be ids that exist in catalog.js; verify.sh check 8
   enforces that, so a renamed page breaks the build rather than rotting a link.

   Extracted from the library's own pages, then reconciled across dimensions.
   Edit here, not in the engine. */
window.PLANNER_RULES = {
  phases: [
    { key: "discover", title: "Discover and baseline",
      objective: "Establish what is actually running and what 'no worse than today' means in numbers, before anything is designed." },
    { key: "design", title: "Design the target",
      objective: "Agree the target topology, policy model and co-existence pattern, so the cutover has something to be measured against." },
    { key: "foundation", title: "Foundation",
      objective: "Stand up the tenant, identity and the first connectivity — the substrate every later phase assumes." },
    { key: "pilot", title: "Pilot",
      objective: "Prove the design on a small, willing, instrumented population before it becomes irreversible." },
    { key: "network-waves", title: "Network migration waves",
      objective: "Move sites in waves, each wave rehearsing the next, with the old transport still available underneath." },
    { key: "security-cutover", title: "Security cutover",
      objective: "Bring controls up monitor-first, tune on real traffic, then enforce — never the other way round." },
    { key: "remote-access", title: "Remote access cutover",
      objective: "Move users off the legacy concentrator in cohorts, with identity and posture already in place." },
    { key: "decommission", title: "Decommission",
      objective: "Retire the displaced estate only once its replacement has carried production and produced evidence." },
    { key: "handover", title: "Handover to run",
      objective: "Leave the customer able to operate, investigate and report without the deployment team." }
  ],
  dimensions: [
    {
      dimension: "common",
      options: [
        {
          key: "always", label: "Every migration",
          pages: ["migration-methodology", "management-pov-framework", "management-api-automation"],
          phases: [
            { phase: "discover", steps: [
            "Run the kick-off and write measurable success criteria: sponsor, timeline, and today's latency, experience and ticket baselines."
            ] },
            { phase: "design", steps: [
            "Order the last mile and hardware against carrier lead times: broadband, LTE, socket sizing, shipping and spares."
            ] },
            { phase: "foundation", steps: [
            "Build the Cato account first: admin roles and RBAC, admin SSO with MFA, scoped API keys, Audit Trail on.",
            "Feed CMA events to the SIEM from day one, write down retention, and export incumbent logs before licences lapse."
            ] },
            { phase: "pilot", steps: [
            "Walk a site acceptance list: voice and QoS, printers and scan-to-folder, badge and CCTV, hardcoded-gateway legacy apps."
            ] },
            { phase: "network-waves", steps: [
            "Gate every wave: CAB approval, booked window, service-desk briefing, user comms, and a written go/no-go with a named rollback owner.",
            "Update name resolution and directory after re-addressing: forwarders, split-horizon zones, DHCP scopes, AD subnets and PTR records.",
            "Re-home published inbound services to Remote Port Forwarding or an allocated static IP, lowering public DNS TTLs first."
            ] },
            { phase: "handover", steps: [
            "Hand over the operating contract: ticket severities, firmware upgrade windows, escalation paths, and hypercare with dated exit criteria."
            ] },
            { phase: "decommission", steps: [
            "Close each retired vendor: serve written notice, confirm non-renewal dates, cancel support, wipe appliances, clear the asset register."
            ] },
          ],
          prereqs: [
            "Kick-off, design workshop and account-setup sessions booked, with the sponsor and a named customer owner per workstream.",
            "Structured discovery complete: traffic flows, site interdependencies, LAN L2 versus L3, routing strategy, DMZ, internet and voice integration.",
            "Success criteria agreed at one workshop before anything is built — each testable, with a measurement and a named owner.",
            "Trial licences confirmed, TLS inspection scope approved by whoever owns privacy, IdP syncing the pilot group, change windows booked."
          ],
          risks: [
            "Asymmetric routing during co-existence: stateful hub firewalls see half the conversation, so sessions fail and traffic drops.",
            "Parallel connectivity stops scaling beyond roughly twenty socket sites — rework, repeat site visits and extra PS hours follow.",
            "Unscoped drift: every \"can it also…?\" stretches the timeline until the sponsor has forgotten why the evaluation started.",
            "No decision meeting on the calendar — the trial licence expires and nobody is ever asked to decide."
          ],
          evidence: [
            "Monitor → Topology on connection day: tunnels up, link quality to the nearest PoP, first traffic flowing, dated.",
            "Monitor → App Analytics for the pilot site — the customer's own applications and users named on screen by day five.",
            "The test-case register: every criterion with its priority, measurement and status, read out against findings at the wrap-up.",
            "Administration → Audit Trail: each change attributed to an admin or API key, with previous and new values recorded."
          ],
        },
      ]
    },
    {
      dimension: "wan",
      options: [
        {
          key: "mpls", label: "MPLS WAN (carrier-managed, hub-and-spoke)",
          pages: ["network-mpls-migration", "migration-journey-mpls", "migration-methodology", "network-resilient-site-design"],
          phases: [
            { phase: "discover", steps: [
            "Map every MPLS circuit to its site, contract end date, notice period and the prefixes that site must still reach."
            ] },
            { phase: "design", steps: [
            "Choose big-bang or phased, then pin the routing decision point per site — L3 switch, legacy firewall or Cato Socket.",
            "State whether rollback at each site is a route change or a site visit."
            ] },
            { phase: "foundation", steps: [
            "Connect the DC interconnect socket beside the CE router and add one routed range per MPLS site.",
            "Prove reachability both ways between migrated ranges and the sites still on MPLS."
            ] },
            { phase: "pilot", steps: [
            "Cut one branch over on broadband plus LTE and work the reachability matrix both directions."
            ] },
            { phase: "network-waves", steps: [
            "Migrate sites in contract-expiry order, deleting each routed range as its prefix moves.",
            "Fill in the reachability matrix wave by wave, both directions, before starting the next."
            ] },
            { phase: "decommission", steps: [
            "Withdraw the last routed range, remove the CE static route and decommission the MPLS router.",
            "Serve notice within the notice period, then cancel the MPLS contract."
            ] },
          ],
          prereqs: [
            "A circuit-by-circuit register of MPLS end dates driving the wave order.",
            "An IP plan checked for overlaps against DC service VLANs and the SDP user pool.",
            "Carrier change process opened early — CE return routes are carrier-managed with real lead times.",
            "Broadband and ideally 4G/LTE last miles ordered and live at the pilot branch."
          ],
          risks: [
            "The CE return route is the carrier's to change — raise the ticket at kick-off, not on cutover day.",
            "Keep the socket and CE on the same L3 segment or stateful devices will see half the conversation.",
            "Migrated-to-legacy flows hairpin via the DC — size that socket for transit before adding more sites.",
            "Broadband MTU plus DTLS overhead lets pings pass while large transfers and TLS handshakes hang."
          ],
          evidence: [
            "Completed reachability matrix with dated Topology screenshots for every row, both directions.",
            "Experience Monitoring site score for the pilot site next to the pre-migration latency baseline.",
            "Timed rollback exercise write-up with the matching Audit Trail entries for the route changes.",
            "Final Topology view with no routed ranges left on the DC site and the CE removed."
          ],
        },
        {
          key: "sdwan", label: "Incumbent SD-WAN overlay (hub-and-spoke fabric)",
          pages: ["migration-journey-sdwan", "migration-methodology", "network-sdwan", "network-resilient-site-design"],
          phases: [
            { phase: "discover", steps: [
            "Inventory overlay hubs, spoke counts per region, and where each fabric terminates."
            ] },
            { phase: "design", steps: [
            "Fix the regional eBGP hub handoff and anchor cross-region symmetry with AS-path length.",
            "Agree route filtering both ways: the default route and any parallel-connected site's prefixes."
            ] },
            { phase: "foundation", steps: [
            "Stand the hub socket up beside the legacy hub and bring eBGP neighbours Established."
            ] },
            { phase: "pilot", steps: [
            "Exchange test prefixes across the handoff, migrate one spoke, then rehearse the rollback."
            ] },
            { phase: "network-waves", steps: [
            "Disable the legacy spoke, turn up the Cato site, and let routes reconverge per wave."
            ] },
            { phase: "decommission", steps: [
            "Retire overlay links, controllers and licences once the final spoke has moved."
            ] },
          ],
          prereqs: [
            "A BGP-capable hub device per region with an agreed ASN and route-filtering discipline.",
            "Socket licensed and rack space available at each hub site alongside the incumbent appliance.",
            "Administrative access to the overlay controller to disable spokes wave by wave.",
            "Wave grouping agreed, with heavily utilised sites flagged for parallel connectivity."
          ],
          risks: [
            "Filter the default route and parallel-site prefixes at the handoff or you will blackhole traffic.",
            "Cross-region flows that reach a non-local hub break symmetry — trace one flow both ways before wave one.",
            "Provider-managed overlays need change tickets to disable spokes; sequence them ahead of each wave.",
            "Hub bandwidth now carries cross-fabric transit on top of its own traffic — size it before scaling waves."
          ],
          evidence: [
            "Show BGP Status at the hub with neighbours Established and the expected prefixes learned.",
            "Per-wave traceroute from both ends proving each site returns via its own regional hub.",
            "Topology showing migrated spokes on the backbone and overlay links dormant.",
            "Controller and licence decommission record for the retired overlay."
          ],
        },
        {
          key: "vpls", label: "VPLS / layer-2 carrier service",
          pages: ["migration-methodology", "network-sdwan", "network-mpls-migration", "network-resilient-site-design"],
          phases: [
            { phase: "discover", steps: [
            "Record which VLANs are stretched across sites and where each broadcast domain terminates."
            ] },
            { phase: "design", steps: [
            "Break the L2 stretch first: give each migrating site its own routed range and gateway."
            ] },
            { phase: "foundation", steps: [
            "Place a socket at the VPLS hub site and route migrated ranges towards it."
            ] },
            { phase: "pilot", steps: [
            "Move one unstretched VLAN behind a socket and prove reachability to VPLS-only sites."
            ] },
            { phase: "network-waves", steps: [
            "Re-gateway or re-address the remaining shared subnets one VLAN at a time."
            ] },
            { phase: "decommission", steps: [
            "Cease each VPLS port only once its site owns local gateways with no L2 dependency."
            ] },
          ],
          prereqs: [
            "Completed L2-versus-L3 discovery, including the VLAN termination point at every site.",
            "An IP plan that resolves overlaps before any range is declared on a socket.",
            "A hub or DC site able to hold both the VPLS CPE and a Cato socket during co-existence.",
            "Change windows agreed for each default-gateway move, with the application owners on the call."
          ],
          risks: [
            "Anything relying on L2 adjacency — clustering, appliance heartbeats, legacy discovery — breaks when the stretch is cut.",
            "Two devices answering for the same range during a gateway move causes duplicate-gateway and ARP chaos.",
            "Confirm ports can be ceased individually before promising per-site savings on a single VPLS instance.",
            "Re-addressing work is the schedule risk here, not the Cato build — budget it in the wave plan."
          ],
          evidence: [
            "A subnet-by-subnet register showing which device owns each gateway at each point in the plan.",
            "Topology range list with every migrated range declared and no overlaps outstanding.",
            "Reachability tests between a migrated VLAN and a VPLS-only site, initiated from both ends.",
            "Carrier cease confirmations per site port, filed against the wave they closed."
          ],
        },
        {
          key: "internet-ipsec", label: "Internet with IPsec VPN (DIY firewall-to-firewall)",
          pages: ["network-ipsec-asa", "migration-methodology", "network-resilient-site-design"],
          phases: [
            { phase: "discover", steps: [
            "List each firewall's software version, IKE version support, public IP and real link bandwidth."
            ] },
            { phase: "foundation", steps: [
            "Build primary and secondary tunnels bidirectionally with Initiate Connection by Cato enabled.",
            "Add one BGP neighbour per tunnel, two maximum; Cato prepends the secondary so the primary wins."
            ] },
            { phase: "pilot", steps: [
            "Drop the primary tunnel and time the failover to the alternate PoP."
            ] },
            { phase: "network-waves", steps: [
            "Join remaining sites over IPsec first, then swap sockets in waves as hardware lands."
            ] },
            { phase: "decommission", steps: [
            "Tear down the legacy VPN mesh only once every site rides the backbone."
            ] },
          ],
          prereqs: [
            "Two allocated IPs at two PoPs, with Support confirming separate maintenance schedules.",
            "Generated PSKs of up to 64 characters exchanged out of band, never by email.",
            "Firewall releases confirmed capable of IKEv2 on a tunnel interface, or the policy-based fallback agreed.",
            "Change windows booked for the failover drill and the deliberate device-reload drill."
          ],
          risks: [
            "Firewalls accepting a single traffic selector reply TS_UNACCEPTABLE — use a route-based VTI or the single-TS setting.",
            "IPsec sites never roam PoPs and get no Internet or WAN Recovery; the second tunnel is the whole resilience plan.",
            "Bandwidth fields set above the real link make the QoS engine ineffective — enter the ISP's actual speed.",
            "Upstream shaping is best-effort on IPsec, so voice-sensitive sites should be first in the socket-swap queue."
          ],
          evidence: [
            "Connection Status showing phase 1 and 2 up with the negotiated parameters matching the design sheet.",
            "Timeline connection log with a clean child SA and no TS_UNACCEPTABLE entries.",
            "Failover drill captured as a continuous ping plus timestamped disconnect and connect events.",
            "Sustained transfer to a host behind a socket site at the licensed rate with GCM negotiated."
          ],
        },
        {
          key: "hybrid-mpls-internet", label: "Hybrid MPLS core with local internet breakout",
          pages: ["migration-methodology", "network-mpls-migration", "migration-journey-mpls", "network-resilient-site-design"],
          phases: [
            { phase: "discover", steps: [
            "Record which sites already have usable broadband and which still backhaul internet to the DC."
            ] },
            { phase: "design", steps: [
            "Choose socket-as-gateway with a LAN BGP handoff, or Alt-WAN steering for legacy destinations."
            ] },
            { phase: "foundation", steps: [
            "Stand up the DC bridge and leave internet egress on the DC firewall for now."
            ] },
            { phase: "pilot", steps: [
            "Move one branch's breakout to the PoP while its WAN traffic still rides MPLS."
            ] },
            { phase: "network-waves", steps: [
            "Shift each site's WAN prefixes off MPLS in waves, choosing egress per site."
            ] },
            { phase: "decommission", steps: [
            "Downgrade or cease MPLS once no prefix and no Alt-WAN dependency remains."
            ] },
          ],
          prereqs: [
            "A BGP-capable core or a transit VLAN between the socket LAN and the existing firewall.",
            "Socket v15 or later where learned legacy routes must be kept local with community 32768.",
            "Broadband and LTE last miles ordered per site, with a change window on cutover day.",
            "An agreed interim internet-egress pattern per site — DC firewall or breakout at the PoP."
          ],
          risks: [
            "Alt-WAN BGP needs local routing set to ANY-ANY, or traffic hairpins to the PoP and turns asymmetric.",
            "An Alt-WAN failure does not trigger socket HA failover — use the LAN BGP handoff where HA sockets are required.",
            "The gradual deployment gateway policy covers RFC1918 only, and cannot be enabled for selected private ranges.",
            "Alt-WAN Recovery is not compatible with BGP-connected sites — pick one and document it per site class."
          ],
          evidence: [
            "Show BGP Status listing learned legacy prefixes, isolated with the reserved community where required.",
            "Per-site egress decision register, each entry backed by PoP firewall and IPS events for that site.",
            "Link-failure drill showing flows re-homing between last miles with no dropped call.",
            "MPLS utilisation graph trending to zero across the final waves, dated before the cease request."
          ],
        },
        {
          key: "greenfield", label: "Greenfield — no incumbent WAN (new sites, M&A, expansion)",
          pages: ["network-sdwan", "network-resilient-site-design", "network-cloud-interconnect", "migration-methodology"],
          phases: [
            { phase: "discover", steps: [
            "Confirm the site list, addressing plan, site classes and the last miles available per location."
            ] },
            { phase: "design", steps: [
            "Assign a resilience tier per site class — single socket, dual ISP, or HA pair."
            ] },
            { phase: "foundation", steps: [
            "Define the sites as code with Terraform or the GraphQL API, then apply.",
            "Create each site and assign its licence weeks before the hardware arrives."
            ] },
            { phase: "pilot", steps: [
            "Ship one socket and let local hands plug it into any live link.",
            "Confirm zero-touch registration and both tunnels, clocking power-on to first flows."
            ] },
            { phase: "network-waves", steps: [
            "Roll out remaining sites in batches, checking each on Topology as it comes on-net."
            ] },
            { phase: "handover", steps: [
            "Hand over bandwidth profiles, QoS rules and analytics dashboards to the operations team."
            ] },
          ],
          prereqs: [
            "Native ranges allocated per site with no overlap, including the SDP user range.",
            "An API key and the Terraform provider configured, with the site definitions under version control.",
            "Socket model chosen per site against real last-mile bandwidth and the site's resilience tier.",
            "Identity source connected so QoS and network rules can reference users, not just subnets."
          ],
          risks: [
            "A last-resort LTE link carries almost nothing while idle, so it is unproven under load until you test it.",
            "Two circuits from different logos can still share one duct — order genuinely diverse paths.",
            "With no legacy baseline, agree performance targets at the workshop or 'better' has nothing to beat.",
            "Cloud Interconnect provisioning lead times belong at the front of the plan, not the end."
          ],
          evidence: [
            "Terraform apply output paired with the Sites list showing every site created as defined.",
            "Topology per site with both last miles up and the connected PoP shown.",
            "App Analytics for each new site on its first day, attributing top applications and users.",
            "Signed site-class design register recording the resilience tier chosen for every location."
          ],
        },
      ]
    },
    {
      dimension: "sdwan-vendor",
      options: [
        {
          key: "versa", label: "Versa Networks (VOS with Director/Controller head-end)",
          pages: ["migration-versa", "migration-versa-policy", "migration-methodology"],
          phases: [
            { phase: "discover", steps: [
            "Export per-appliance configs and Director template stacks; in carrier estates raise the ticket in week one.",
            "Rebuild the effective per-site policy and rank every rule on Versa Analytics hit counts."
            ] },
            { phase: "design", steps: [
            "Fix the regional eBGP hub handoff: Cato is eBGP-only (ASN 64515), route filtering agreed, symmetry anchored by AS-path."
            ] },
            { phase: "foundation", steps: [
            "Deploy a parallel Socket at each Versa hub and validate eBGP symmetry before any branch moves."
            ] },
            { phase: "network-waves", steps: [
            "Disable the Versa spoke, bring up the Socket site, and let BGP propagate to both domains."
            ] },
            { phase: "security-cutover", steps: [
            "Split rules by destination into WAN and Internet policies; run IPS and NGAM in monitor."
            ] },
          ],
          prereqs: [
            "Director admin access or a contractual export clause, with Analytics retention agreed before leaving the tenant.",
            "Versa hub sites able to speak eBGP on the LAN side, or an interconnect site with routed ranges.",
            "IdP and SCIM groups standing before mapping — group-scoped rules have nothing to bind to otherwise.",
            "Contract map: end dates, notice periods, provider-owned CPE and any last mile bundled with the managed service."
          ],
          risks: [
            "In carrier-managed estates every export and spoke-disable is a provider change ticket — sequence waves around their SLAs.",
            "Join the two overlays in more than one place and a flow returns through a different stateful VOS firewall.",
            "Service-chained uCPE VNFs strand a branch at cutover unless every chained function has a documented disposition.",
            "Per-rule UTM profiles do not survive: translate variance into scoped exceptions, never per-rule signature tuning."
          ],
          evidence: [
            "Show BGP Status at the hub with neighbours Established and overlay prefixes in the Cato routing table.",
            "Bidirectional reachability between the pilot Socket branch and un-migrated VOS sites through the hub handoff.",
            "Rule-hit events for each translated rule compared against the Versa Analytics baseline, deltas triaged.",
            "A timed rollback: Versa spoke re-enabled, prefixes reconverged, recorded during the wave window."
          ],
        },
        {
          key: "edgeconnect-silverpeak", label: "HPE Aruba EdgeConnect (Silver Peak) with Orchestrator",
          pages: ["migration-edgeconnect", "migration-edgeconnect-policy", "migration-methodology"],
          phases: [
            { phase: "discover", steps: [
            "Run the Orchestrator backup, export template groups and preconfig YAML, then diff against per-appliance state.",
            "Build a Boost-dependency inventory from data-reduction reports, separating dedup-bound from latency-bound workloads."
            ] },
            { phase: "design", steps: [
            "Collapse the Business Intent Overlays into genuine intents, expressed as network rules and bandwidth profiles.",
            "Confirm peer typing at each hub so Cato-learned prefixes propagate into subnet sharing; BGP-PE-learned routes are not shared."
            ] },
            { phase: "foundation", steps: [
            "Deploy a parallel Socket at each EdgeConnect hub and confirm Cato prefixes propagate into subnet sharing."
            ] },
            { phase: "network-waves", steps: [
            "Disable the EC spoke in Orchestrator; its subnets withdraw from subnet sharing and the eBGP exchange."
            ] },
            { phase: "security-cutover", steps: [
            "Inspect migrated sites at the PoP and retire their Orchestrator SSE tunnel config rather than rebuilding it."
            ] },
          ],
          prereqs: [
            "Orchestrator access (SaaS or self-hosted) for database backups, template exports and per-appliance state.",
            "Admin access to the chained SSE tenant, plus its contract end dates and notice periods.",
            "EdgeConnect hubs configured for LAN-side eBGP, with AS numbering and route filtering agreed.",
            "An explicit in-or-out scope decision on any Aruba Central SD-Branch population — a separate product and console."
          ],
          risks: [
            "Boost's byte-level deduplication has no Cato equivalent — quantify replication flows before any Boost-heavy site moves.",
            "Seven overlays are rarely seven intents; transliterating each one imports structure rather than policy.",
            "Web policy lives in the chained SSE tenant, so keep it licensed until its last consuming site moves.",
            "BGP-PE-learned routes are deliberately not shared into the fabric — verify hub peer typing before wave one."
          ],
          evidence: [
            "eBGP neighbours Established at the EC hub with Cato prefixes visible in subnet sharing.",
            "Mirror-image rollback demonstrated: EC spoke re-enabled and routing reconverged inside the window.",
            "Measured throughput and completion time for a Boost-dependent workload running over Cato.",
            "CMA events showing translated overlay steering and monitor-mode IPS matches before enforcement."
          ],
        },
        {
          key: "cisco-viptela", label: "Cisco Catalyst SD-WAN (Viptela) or Meraki Auto-VPN",
          pages: ["migration-cisco", "migration-cisco-policy", "migration-methodology"],
          phases: [
            { phase: "discover", steps: [
            "Capture vManage centralised policy, app-route SLA templates, and Meraki Auto-VPN hubs with their spoke modes.",
            "Map Cisco EA, Meraki co-term and Umbrella renewal/EOL dates onto the migration calendar alongside the ASA and vEdge milestones."
            ] },
            { phase: "foundation", steps: [
            "Stand up regional interconnect hubs with an eBGP handoff and OMP-to-BGP redistribution, validated with test prefixes."
            ] },
            { phase: "network-waves", steps: [
            "Disable the legacy spoke so OMP withdraws its routes, then propagate Cato prefixes at the interconnect.",
            "Move each site's Umbrella web and DNS policy inside the same socket cutover window."
            ] },
          ],
          prereqs: [
            "Admin access to vManage or the Meraki Dashboard and Umbrella, plus ASA/FTD configs with hit counts.",
            "A BGP-capable regional hub, or an L3 core behind the Meraki MX to anchor the handoff.",
            "IdP SSO and SCIM provisioning live before Umbrella identity precedence is rewritten as rule order.",
            "An inventory of third-party allowlists keyed to each site's current public egress IP."
          ],
          risks: [
            "Umbrella network identities key off the site egress IP — a live Socket stops matching that policy immediately.",
            "Meraki MX dynamic routing is limited; anchor the eBGP handoff at the L3 core, not the MX itself.",
            "The app-priority and SLA intent lives in vManage templates — capture it before any controller is decommissioned.",
            "Copying zero-hit ASA ACEs and legacy Umbrella destination lists makes the new rulebase unauditable on day one."
          ],
          evidence: [
            "eBGP session up at the regional interconnect with OMP-learned prefixes in the Cato routing table.",
            "A site rolled back by re-enabling its spoke, with OMP and BGP reconverging automatically.",
            "Cato Internet Firewall and DNS Protections events matched against Umbrella reports for the same destinations.",
            "Pilot cohort connected on the Cato Client with posture profiles replacing the ISE posture checks."
          ],
        },
        {
          key: "fortinet-sdwan", label: "Fortinet Secure SD-WAN (FortiGate with ADVPN)",
          pages: ["migration-fortinet", "migration-fortinet-policy", "migration-methodology"],
          phases: [
            { phase: "discover", steps: [
            "Export every FortiGate config or the FortiManager policy packages, and mine FortiAnalyzer for the real ADVPN traffic matrix.",
            "Retire zero-hit rules and collapse duplicate address objects before a single rule or UTM profile pair is translated."
            ] },
            { phase: "foundation", steps: [
            "Deploy parallel Sockets at each FortiGate regional hub and validate eBGP symmetry with test prefixes first."
            ] },
            { phase: "network-waves", steps: [
            "Disable the FortiGate spoke, bring up the Socket site, and let BGP propagate to both domains."
            ] },
            { phase: "security-cutover", steps: [
            "Decompose each policy and its UTM profile pair into a firewall rule, IPS/NGAM layers and TLS rules."
            ] },
            { phase: "remote-access", steps: [
            "Per wave: disable FortiClient VPN and ZTNA in EMS, enrol the Cato Client, re-point posture enforcement, then uninstall."
            ] },
          ],
          prereqs: [
            "FortiGate config backups or FortiManager ADOM exports, carrying policy hit-count and last-used data.",
            "eBGP-capable regional hubs, or the published FortiGate HA IPsec tunnel design where no Socket fits.",
            "Multi-VDOM tenancy decisions taken in discovery — they shape the whole rulebase design.",
            "Agreed AS numbering, route filtering and summarisation for every handoff."
          ],
          risks: [
            "Traffic that escaped inspection because no UTM profile was attached will now be inspected — triage in monitor.",
            "Filter the default route and every parallel site's prefixes, or a half-migrated site is reachable two ways.",
            "EMS ZTNA tagging rules have no converter — inventory the tags actually used in policy and re-model them.",
            "Anything hanging off FortiLink must be re-homed before the controlling FortiGate is decommissioned."
          ],
          evidence: [
            "eBGP neighbours Established at each hub, with test prefixes proving symmetric paths and failover.",
            "Spoke rollback demonstrated: FortiGate spoke re-enabled, BGP reconverged, nothing rebuilt.",
            "Monitor-mode IPS and anti-malware events triaged before any rule is promoted to block.",
            "QoS Priority Analyzer output confirming the re-expressed SD-WAN steering intent."
          ],
        },
        {
          key: "cloudflare-magic-wan", label: "Cloudflare Magic WAN and Cloudflare One",
          pages: ["migration-cloudflare", "migration-cloudflare-policy", "migration-methodology"],
          phases: [
            { phase: "discover", steps: [
            "Export the estate with cf-terraforming; inventory Access apps, service tokens, connectors and Magic WAN tunnels."
            ] },
            { phase: "design", steps: [
            "Write and sign the stays-on-Cloudflare register: CDN, WAF, authoritative DNS, Workers and Magic Transit."
            ] },
            { phase: "pilot", steps: [
            "Deploy a Socket at one representative branch and validate paths while Magic WAN stays up untouched."
            ] },
            { phase: "network-waves", steps: [
            "Re-terminate Magic WAN sites one at a time, with primary and secondary tunnels to different PoPs."
            ] },
            { phase: "remote-access", steps: [
            "Per cohort, remove the WARP profile via MDM, then deploy the Cato Client — never both."
            ] },
            { phase: "decommission", steps: [
            "Retire connectors, then tunnels, Gateway policies and Access apps; reduce Zero Trust seats, keep the tenant."
            ] },
          ],
          prereqs: [
            "Admin access to every Cloudflare account holding Zero Trust config — these estates are usually fragmented.",
            "Confirmation of what was actually licensed: DLP, Browser Isolation and dedicated egress IPs are add-ons.",
            "MDM able to remove the WARP profile and deploy the Cato Client in one maintenance window.",
            "A Socket-versus-IPsec decision per site, since many Zero Trust sites never had edge hardware at all."
          ],
          risks: [
            "Never dual-agent: WARP and the Cato Client contend for routing, DNS and firewall control on one device.",
            "Magic Firewall rules carry no identity — rebuild them as site or subnet-scoped rules before tightening.",
            "Third-party SaaS allowlists keyed to dedicated egress IPs break silently unless re-keyed during each wave.",
            "Access service tokens have no user-centric ZTNA equivalent; design each machine-to-machine flow explicitly."
          ],
          evidence: [
            "Pilot cohort connected by name on the Cato Client with the WARP profile disabled.",
            "Side-by-side policy verdicts: Cato event export beside the matching Gateway log lines.",
            "One site re-terminated with both IPsec tunnels up and the old Magic WAN config held idle.",
            "A recorded posture-failure refusal for a named Access application republished through Cato ZTNA."
          ],
        },
        {
          key: "other-sdwan", label: "Other or in-house SD-WAN overlay",
          pages: ["migration-methodology"],
          phases: [
            { phase: "discover", steps: [
            "Run structured discovery: traffic flows, site interdependencies, LAN L2 versus L3, routing, DMZ and voice."
            ] },
            { phase: "design", steps: [
            "Choose big-bang or phased, then pin the routing decision point per site: L3 switch, legacy firewall or Socket.",
            "Fix the regional eBGP hub handoff: Cato is eBGP-only (ASN 64515), route filtering agreed, symmetry anchored by AS-path."
            ] },
            { phase: "network-waves", steps: [
            "Stand up an interconnect hub holding legacy CPE and a Socket, with the L3 switch routing between them.",
            "Migrate one VLAN at a time; rollback is a static re-added or a BGP prefix withdrawn.",
            "Where BGP is unavailable, pre-stage dummy CGN ranges and swap routed ranges at each cutover."
            ] },
          ],
          prereqs: [
            "A completed discovery questionnaire and design workshop before any co-existence pattern is chosen.",
            "Known default-gateway placement and VLAN termination point for every site class.",
            "Hub bandwidth and redundancy sized for the inter-network hairpin during co-existence.",
            "A decision on BGP capability at the core; otherwise plan routed ranges with dummy pre-staging."
          ],
          risks: [
            "Return traffic via a different regional hub breaks stateful inspection — design symmetry before wave one.",
            "Parallel connectivity at every site stops scaling around twenty sockets; beyond that use an interconnect hub.",
            "NAT/PAT symmetry masks source IPs and breaks anything embedding them, such as LDAP and WMI.",
            "Alt-WAN failure does not trigger Socket HA failover — prefer a LAN BGP handoff where HA matters."
          ],
          evidence: [
            "A signed migration design naming the co-existence pattern and rollback lever per site class.",
            "Interconnect hub live, with migrated and legacy subnets reaching each other through it.",
            "One subnet migrated and rolled back by route change alone, timed and recorded.",
            "A wave plan with per-site-class cutover templates agreed with the customer."
          ],
        },
      ]
    },
    {
      dimension: "proxy-sse",
      options: [
        {
          key: "zscaler", label: "Zscaler ZIA / ZPA (with ZCC on the endpoint)",
          pages: ["migration-zscaler", "migration-zscaler-policy", "migration-journey-zscaler", "migration-methodology", "security-tls-inspection"],
          phases: [
            { phase: "discover", steps: [
            "Export the ZIA policy base via API and flatten effective rule order against Admin Rank."
            ] },
            { phase: "design", steps: [
            "Choose an interim architecture per site: PoP-to-ZIA IKEv2 tunnels or existing firewall backhaul."
            ] },
            { phase: "foundation", steps: [
            "Build up to six active tunnels per HA role to ZIA, AES-GCM above 100 Mbps."
            ] },
            { phase: "pilot", steps: [
            "Move the pilot cohort's private-app access onto Cato rules before touching its ZCC install.",
            "Then swap that same cohort off ZCC, clearing the ZIA PAC in one GPO change."
            ] },
            { phase: "security-cutover", steps: [
            "Recreate ZIA rules monitor-first: Caution becomes Prompt, Track = Event on every rule."
            ] },
            { phase: "decommission", steps: [
            "Retire ZPA App Connectors, then remove ZCC per endpoint once Cato SWG verdicts match ZIA on the agreed test list."
            ] },
          ],
          prereqs: [
            "ZIA and ZPA policy export in hand, with hit counts from ZIA reporting for rationalisation.",
            "IdP connected and the pilot group provisioned over SCIM, visibly syncing before any rule references it.",
            "Cato root certificate deployable via GPO/MDM, plus the same channel that can remove ZCC.",
            "Trial licences confirmed for CASB and TLS Inspection wherever verdict parity is in scope."
          ],
          risks: [
            "SDP users landing in the All Unidentified Users bucket silently stop matching group-scoped SWG rules.",
            "SaaS tenants conditional-access-pinned to Zscaler egress ranges lock the cohort out the moment breakout moves to the PoP.",
            "Apps ZIA quietly exempted break under TLSi - rebuild bypasses from observed events, never port the ZIA exemption list.",
            "Narrow change windows, not the technology, set the pace; agree the cadence for every phase before kickoff."
          ],
          evidence: [
            "Side-by-side export: Cato Internet firewall events next to the matching ZIA log lines for the agreed test list.",
            "Interim IKEv2 tunnels shown up throughout in Network -> Sites with zero non-cohort connectivity incidents.",
            "Experience Monitoring baseline week against pilot week for the same cohort, plus the helpdesk queue.",
            "Internet firewall rulebase screenshot with hit counts on every converted Block and Prompt rule."
          ],
        },
        {
          key: "netskope", label: "Netskope NewEdge (NG-SWG, CASB, NPA)",
          pages: ["migration-netskope", "migration-netskope-policy", "migration-methodology", "security-data-casb-dlp", "security-tls-inspection"],
          phases: [
            { phase: "discover", steps: [
            "Inventory all five steering paths: Client, IPsec/GRE, PAC/explicit proxy, proxy chaining, on-prem appliance."
            ] },
            { phase: "design", steps: [
            "Start EDM rebuilds from the source systems now; Netskope hashes can never be exported."
            ] },
            { phase: "foundation", steps: [
            "Deploy datacentre and cloud vSockets so private apps are on-net before any user moves.",
            "Seed the Cato TLS bypass list from Netskope's SSL do-not-decrypt list before inspecting."
            ] },
            { phase: "pilot", steps: [
            "Swap one client-steered cohort in a single window: uninstall Netskope Client, install Cato Client."
            ] },
            { phase: "security-cutover", steps: [
            "Stage TLS inspection cohort by cohort, once the bypass baseline is already in place."
            ] },
            { phase: "decommission", steps: [
            "Retire NPA per app group, Publishers next, and API Data Protection last of all."
            ] },
          ],
          prereqs: [
            "Steering inventory complete, with each mechanism's exception list and its named owner.",
            "The named private apps' site or VPC behind a Socket or vSocket before any user swaps.",
            "Cato SCIM standing alongside Netskope's, both provisioning independently from the same IdP.",
            "Netskope Client MDM package and steering configuration kept live - that package is the rollback."
          ],
          risks: [
            "Never overlap the agents: on macOS the Cato Client cannot run beside another connected VPN profile.",
            "Cato SaaS Security API connectors centre on M365 - verify Box, Salesforce or Workspace coverage before retiring API-CASB.",
            "Netskope User Alert captures written justification; Cato Prompt only warns and continues, so do not claim parity.",
            "Cloud Firewall only ever judged steered traffic - quiet rules wake up once Cato sees every egress flow."
          ],
          evidence: [
            "Data Control monitor events matching the rebuilt DLP profile's hits on the agreed test payloads.",
            "WAN firewall allow events per cohort user for each named private app, with NPA logs quiet.",
            "Cato event export placed beside Netskope Real-time Protection log lines for the same users.",
            "Experience Monitoring scores across swap and parity weeks, plus the cohort's helpdesk ticket rate."
          ],
        },
        {
          key: "forcepoint", label: "Forcepoint Web Security / Forcepoint ONE (PAC-steered)",
          pages: ["migration-forcepoint", "migration-forcepoint-policy", "migration-methodology", "security-dlp-forensics", "security-tls-inspection"],
          phases: [
            { phase: "discover", steps: [
            "Document every PAC file, WPAD entry, GPO distribution point and hardcoded proxy setting."
            ] },
            { phase: "design", steps: [
            "Decide the DLP hybrid now: retain the Forcepoint endpoint agent for USB, print, clipboard."
            ] },
            { phase: "foundation", steps: [
            "Push the Cato CA fleet-wide alongside the Forcepoint CA and block QUIC before inspecting."
            ] },
            { phase: "network-waves", steps: [
            "Cut each site's breakout to the Socket, then retire NGFW and Content Gateway."
            ] },
            { phase: "security-cutover", steps: [
            "Remove the PAC per cohort via GPO and steer that cohort's web traffic to Cato."
            ] },
            { phase: "remote-access", steps: [
            "Enable Client Always-On per cohort, only once it is off the legacy VPN client."
            ] },
            { phase: "decommission", steps: [
            "Time non-renewal to the last wave; Forcepoint licences are non-cancellable with reinstatement fees."
            ] },
          ],
          prereqs: [
            "The cohort's PAC and GPO distribution path documented before the flip - it is the rollback lever.",
            "DLP estate rationalised to direct-map classifiers; fingerprints and ML classifiers scoped as a separate conversation.",
            "Egress-IP-pinned SaaS tenant restrictions and partner allowlists enumerated with owners named.",
            "Both platforms policy-frozen through each wave so the fallback stays a known-good state."
          ],
          risks: [
            "Exactly one platform owns TLS inspection per cohort - scope Cato TLSi away from users still on the PAC.",
            "Proxy-embedded NTLM/Kerberos auth and X-Authenticated-User headers vanish with the proxy; downstream consumers need redesign, not mapping.",
            "Websense time-quota browsing has no like-for-like action - Prompt covers Confirm, validate quota policies one by one.",
            "Never claim a Forcepoint EOL you cannot cite; only a model-level NGFW notice the customer holds is concrete."
          ],
          evidence: [
            "Cato event export beside Forcepoint Web Security report lines for the agreed category test list.",
            "Reconciliation sheet of Cato Data events against Forcepoint DLP incidents for the same test files.",
            "Connected cohort list with one policy event attributed to each named user and no proxy settings left on device.",
            "Change log showing zero non-cohort identities in pilot events and no Forcepoint policy edits."
          ],
        },
        {
          key: "iboss", label: "iboss cloud gateways (connectors, PAC, dedicated egress IPs)",
          pages: ["migration-iboss", "migration-iboss-policy", "migration-methodology", "security-tls-inspection"],
          phases: [
            { phase: "discover", steps: [
            "Enumerate PAC URLs, connector fleet by OS, GRE/IPsec tunnels and DNS-redirection zones."
            ] },
            { phase: "design", steps: [
            "Build the dependency register of every allowlist keyed to iboss dedicated cloud IPs."
            ] },
            { phase: "foundation", steps: [
            "Push the Cato root CA alongside the existing iboss CA before any steering change."
            ] },
            { phase: "pilot", steps: [
            "Pilot one tunnelled site plus an IT agent cohort, swapping agents atomically per device."
            ] },
            { phase: "network-waves", steps: [
            "Cut over per OU or school, dual-listing Cato allocated IPs in allowlists first."
            ] },
            { phase: "decommission", steps: [
            "Disable steering, clear allowlists, remove the iboss CA, then archive the retention window."
            ] },
          ],
          prereqs: [
            "Dedicated-IP dependency list owned, with the allocated-IP count sized beyond the three included.",
            "Identity design agreed where the customer runs Google Workspace rather than Entra ID, Okta or OneLogin.",
            "ChromeOS deployment approach validated with Cato PS before any Chromebook fleet is committed to a wave.",
            "The iboss PAC left hosted and change-frozen for the whole programme as the fallback rail."
          ],
          risks: [
            "Never split one device between both clouds - two TLS-intercepting redirection agents create undiagnosable breakage.",
            "Browsers using DNS-over-HTTPS bypass Content Restrictions; block DoH in the same change as SafeSearch.",
            "Category names are not equivalence - prove parity with a test URL list per cohort, never by name-matching.",
            "Education estates treat per-user reporting as statutory evidence; terminate the subscription only after archiving the retention window."
          ],
          evidence: [
            "Category-parity spot checks against the test URL list per wave, signed off by safeguarding staff.",
            "SaaS and exam-platform logins succeeding from the new Cato allocated egress IPs.",
            "User-attributed CMA events proving safeguarding report continuity across the wave.",
            "Wave helpdesk ticket rate measured against the pre-cutover baseline."
          ],
        },
        {
          key: "symantec-broadcom", label: "Symantec ProxySG / Cloud SWG under Broadcom",
          pages: ["migration-symantec", "migration-symantec-policy", "migration-methodology", "management-visibility"],
          phases: [
            { phase: "discover", steps: [
            "Pull Reporter hit data and archive access logs in week one - Reporter is EOL."
            ] },
            { phase: "design", steps: [
            "Classify every CPL layer as business intent, proxy plumbing or dead before mapping."
            ] },
            { phase: "foundation", steps: [
            "Wire CMA to the SIEM from day one for long-term retention, after archiving historic Reporter data."
            ] },
            { phase: "network-waves", steps: [
            "Unwind WCCP service groups per site and retire inline appliances after sampled parity checks."
            ] },
            { phase: "security-cutover", steps: [
            "Uninstall the WSS Agent and neutralise the PAC by GPO, cohort by cohort."
            ] },
            { phase: "remote-access", steps: [
            "Enable the Cato Client Always-On per cohort once it is off legacy VPN clients."
            ] },
            { phase: "decommission", steps: [
            "Align licence non-renewal to the final wave and the published appliance EOL backstops."
            ] },
          ],
          prereqs: [
            "Serial-specific EOL letters and renewal dates pulled from the customer's own Broadcom support portal.",
            "UPE estates exported from the reference Edge SWG device via Management Center as one CPL corpus.",
            "Historic web-usage data archived against HR, compliance and legal retention obligations.",
            "Endpoint-DLP hybrid decided up front, with Cato device posture requiring the agent to be running."
          ],
          risks: [
            "No automated CPL-to-Cato converter exists - rationalise on hit data rather than promising a port.",
            "IWA realms, BCAAA, Kerberos SPNs and forwarded user headers all die with the proxy; inventory their consumers first.",
            "WSS Agent conflicts with third-party tunnel clients - never run it alongside the Cato Client.",
            "ProxySG local category databases and WSS custom categories will not transfer; rebuilding them is voluminous manual work."
          ],
          evidence: [
            "Sampled CPL rules replayed against CMA events, returning the same verdicts for the cohort.",
            "SIEM receiving Cato events in parallel with any remaining Reporter output until stakeholders sign off.",
            "WCCP service groups removed from router configuration, with site breakout confirmed at the PoP.",
            "Archived Reporter database and access-log export formally accepted by the records owner."
          ],
        },
        {
          key: "cisco-umbrella", label: "Cisco Umbrella / Secure Access (often beside Viptela or Meraki)",
          pages: ["migration-cisco", "migration-cisco-policy", "migration-methodology", "security-tls-inspection"],
          phases: [
            { phase: "discover", steps: [
            "Map Cisco EA, Meraki co-term and Umbrella renewal/EOL dates against ASA and vEdge milestones."
            ] },
            { phase: "design", steps: [
            "Export destination lists to CSV and dedupe them against Cato system categories."
            ] },
            { phase: "foundation", steps: [
            "Stand up regional interconnect hubs with an eBGP handoff to each Viptela or Meraki hub.",
            "Push the Cato certificate via MDM alongside the Umbrella CA before any decryption moves.",
            "Rebuild Umbrella selective-decryption lists as Cato TLS bypasses before the first inspected flow."
            ] },
            { phase: "network-waves", steps: [
            "Move each site's Umbrella web and DNS policy inside the same socket cutover window."
            ] },
            { phase: "security-cutover", steps: [
            "Decide per app whether Cato blocks it or restricts activities, replacing Umbrella's domain blocks."
            ] },
            { phase: "decommission", steps: [
            "Remove the Umbrella root CA via MDM once no cohort is steered to Umbrella.",
            "Retire the Umbrella virtual appliances last, after the final internal DNS forwarder repoint."
            ] },
          ],
          prereqs: [
            "Business intent inside vManage centralised policy and Meraki templates captured before anything is decommissioned.",
            "eBGP possible at each regional hub, or a fallback co-existence pattern deliberately chosen and accepted.",
            "Umbrella virtual appliances left forwarding internal domains until the very last DNS repoint.",
            "AnyConnect profiles retained in MDM so any user cohort rolls back with a single push."
          ],
          risks: [
            "Umbrella network identities key on the site's public egress IP - policy stops matching the moment the Socket goes live.",
            "Two overlays joined in more than one place create asymmetric return paths that break stateful inspection.",
            "Umbrella blocks whole apps at domain level; decide per app whether Cato blocks it or restricts activities.",
            "Legacy SKUs keep TAC support to 2030 - argue the customer's own calendar, never a fabricated end-of-life."
          ],
          evidence: [
            "CMA events and rule hit counts compared with Umbrella and FMC reports per wave before decommissioning.",
            "eBGP neighbours Established at each interconnect, with migrated prefixes visible on both sides.",
            "Destination-list entries reconciled against Cato custom categories, with dropped entries recorded and defended.",
            "Internal domains still resolving via AD DNS after forwarders are repointed away from the virtual appliances."
          ],
        },
        {
          key: "none-proxy", label: "No incumbent proxy or SSE - greenfield SWG on Cato",
          pages: ["migration-methodology", "security-tls-inspection", "security-consistent", "security-firewall-refresh", "management-pov-framework"],
          phases: [
            { phase: "discover", steps: [
            "Baseline today's breakout: which sites break out locally, which backhaul, what filters anything."
            ] },
            { phase: "design", steps: [
            "Design a minimal category-based rulebase, proving each rule in monitor before it blocks."
            ] },
            { phase: "foundation", steps: [
            "Run the TLS Inspection Configuration Wizard and keep its sensitive-category bypass rules as the baseline."
            ] },
            { phase: "pilot", steps: [
            "Inspect one pilot cohort monitor-first, with QUIC blocked so browsers fall back to TCP."
            ] },
            { phase: "security-cutover", steps: [
            "Expand inspection category by category, promoting rules to block only on event evidence."
            ] },
            { phase: "handover", steps: [
            "Run best-practice enablement so the customer's team owns the rulebase after go-live."
            ] },
          ],
          prereqs: [
            "MDM or GPO able to reach every managed device, including Java, Git, IntelliJ and pre-120 Firefox stores.",
            "IdP connected with SCIM groups provisioned before any identity-scoped rule is written.",
            "A named owner for the bypass list, kept time-bound and reviewed rather than silently growing.",
            "Success criteria signed off and the decision meeting booked, per the PoV framework."
          ],
          risks: [
            "There is no incumbent bypass list to mine, so pinned and mTLS apps surface only under live inspection.",
            "Skipping the per-OS padlock verification turns the first inspection wave into a fleet-wide outage.",
            "First enforcement is the moment users notice security exists - brief the helpdesk before arming any block.",
            "No hit-count history means no baseline; soak every rule in monitor before it blocks business traffic."
          ],
          evidence: [
            "Padlock check on each operating system showing the issuer as Cato Networks plus the PoP name.",
            "Internet firewall rulebase with hit counts proving each rule matches the traffic it was written for.",
            "Monitor-mode event review per category, signed off by the security owner before any rule flips to block.",
            "Experience Monitoring scores across the pilot weeks showing inspection cost users nothing."
          ],
        },
      ]
    },
    {
      dimension: "firewall",
      options: [
        {
          key: "palo-alto", label: "Palo Alto NGFW / Panorama (with GlobalProtect or Prisma Access)",
          pages: ["migration-palo-alto", "migration-palo-alto-policy", "security-firewall-refresh", "migration-journey-firewall", "migration-methodology"],
          phases: [
            { phase: "discover", steps: [
            "Export Panorama pre-/post-rules, NAT, decryption and GlobalProtect config with rule-usage hit counts.",
            "Cull zero-hit, disabled and shadowed rules, then assign each survivor to a Cato firewall."
            ] },
            { phase: "foundation", steps: [
            "Deploy a parallel Socket on a transit VLAN, the PA staying L3 default gateway.",
            "Raise the eBGP neighbour, advertise summary routes, and keep the PA preferring its own default."
            ] },
            { phase: "pilot", steps: [
            "Move the first pilot prefix to Cato, then withdraw the handoff route and time the revert."
            ] },
            { phase: "security-cutover", steps: [
            "Re-pin explicit ports for every rule that relied on application-default, or enforcement silently broadens."
            ] },
          ],
          prereqs: [
            "Read-only Panorama export of the pilot device group with rule-usage columns.",
            "Transit VLAN and change windows agreed for the handoff route and rollback rehearsal.",
            "SCIM or LDAP groups syncing into CMA before any user-scoped rule is written.",
            "Trial licences live for Client seats, IPS, Anti-Malware and TLS inspection."
          ],
          risks: [
            "Egress via Cato with return through the stateful PA drops flows — keep regional symmetry.",
            "Leaving PA decryption enabled on a Cato-routed path doubles inspection and breaks pinned apps.",
            "Custom App-IDs do not transfer; without matching custom apps their traffic silently matches broader categories.",
            "DNAT-published services go dark unless re-homed to port forwarding with external DNS updated."
          ],
          evidence: [
            "Monitor → Topology on day one: site up, handoff routes exchanged, first traffic flowing.",
            "Per-rule CMA events reconciled against the week-zero Panorama rule-usage baseline.",
            "Experience Monitoring week for the pilot cohort with GlobalProtect removed from their machines.",
            "Timed rollback: handoff route withdrawn, traffic reverting to the PA, before/after Topology captured."
          ],
        },
        {
          key: "checkpoint", label: "Check Point Quantum / SmartConsole (Gaia, ClusterXL, possibly Harmony SASE)",
          pages: ["migration-checkpoint", "migration-checkpoint-policy", "security-firewall-refresh", "migration-journey-firewall", "migration-methodology"],
          phases: [
            { phase: "discover", steps: [
            "Pull each access layer with mgmt_cli show access-rulebase, hits shown, paginating past the 500 limit.",
            "Model the effective policy across ordered and inline layers before mapping anything into CMA."
            ] },
            { phase: "foundation", steps: [
            "Stand up the parallel socket and an eBGP neighbour to Gaia over the transit VLAN.",
            "Filter Cato-advertised routes at the Gaia neighbour on the Cato ASN and community 32768 tag."
            ] },
            { phase: "pilot", steps: [
            "Move the pilot branch's first prefix to Cato, then time a withdrawal reverting to Quantum."
            ] },
            { phase: "network-waves", steps: [
            "Re-home DNAT-published services to Remote Port Forwarding and update external DNS before gateway retirement."
            ] },
            { phase: "security-cutover", steps: [
            "Flatten the slice into WAN and Internet rules, writing the blocks inline cleanups never spelled out."
            ] },
          ],
          prereqs: [
            "Read-only mgmt_cli export of the pilot branch's access layers with hit counts.",
            "HTTPS Inspection rulebase and bypass list exported as the honesty baseline for inspection scope.",
            "Transit VLAN, peer IP and private peer ASN agreed — the Cato side is eBGP-only.",
            "Pilot cohort populated as a SCIM or LDAP group in CMA before identity-scoped rules deploy."
          ],
          risks: [
            "An inline layer's implicit cleanup that never became an explicit rule lets flows through on Cato.",
            "ClusterXL flow ownership is strict — asymmetric return through the Quantum gateway drops migrated sessions.",
            "Cato will decrypt more than the blade ever did; brief new detections as findings, not regressions.",
            "Overlapping IP space across VSX Virtual Systems forces re-addressing or NAT design — surface it in week one."
          ],
          evidence: [
            "Show BGP Status with the Gaia neighbour Established and legacy prefixes learned.",
            "Home → Reports rule hit count PDF read against the week-zero show-hits baseline.",
            "Cato TLSi rulebase placed beside the blade's export, new detections triaged with the customer.",
            "Timed prefix withdrawal reverting pilot traffic to the Quantum gateway, screenshotted both ways."
          ],
        },
        {
          key: "fortigate", label: "FortiGate estate (FortiManager, Secure SD-WAN, FortiClient)",
          pages: ["migration-fortinet", "migration-fortinet-policy", "security-firewall-refresh", "migration-journey-firewall", "migration-methodology"],
          phases: [
            { phase: "discover", steps: [
            "Export every FortiGate config or the FortiManager policy packages, and mine FortiAnalyzer for the real ADVPN traffic matrix.",
            "Retire zero-hit rules and collapse duplicate address objects before a single rule or UTM profile pair is translated."
            ] },
            { phase: "foundation", steps: [
            "Deploy a parallel socket at each regional hub and peer eBGP over the transit VLAN.",
            "Filter the default route and any parallel-connected site's prefixes inbound on that neighbour."
            ] },
            { phase: "network-waves", steps: [
            "Disable the FortiGate spoke, bring up the Socket site, and let BGP propagate to both domains."
            ] },
            { phase: "security-cutover", steps: [
            "Re-publish FortiGate VIPs as remote port forwarding, each on its own change window."
            ] },
          ],
          prereqs: [
            "Sockets shipped for hub and pilot branch — v15+ for community 32768, v21.1+ for BGP filtering.",
            "A spare routed interface or 802.1Q sub-interface plus an agreed transit VLAN and /29 at the hub.",
            "Private ASNs agreed; the FortiGate side must differ from Cato's default 64515.",
            "FortiAnalyzer reports for the pilot site as the parity baseline, and EMS access per cohort."
          ],
          risks: [
            "Editing BGP filters resets the session immediately — make filter changes in the build window.",
            "Prefixes tagged community 32768 stay in the hub socket's table and never reach the PoP.",
            "Traffic that escaped inspection with no UTM profile attached now gets inspected — triage before blocking.",
            "FortiLink-managed switches and APs lose their controller when the branch FortiGate is decommissioned."
          ],
          evidence: [
            "Show BGP Status and get router info bgp summary captured side by side, session Established.",
            "Cato routing table showing legacy prefixes with AS path and received BGP communities.",
            "Rule-hit events per translated rule reconciled against the FortiAnalyzer baseline for the same flows.",
            "Continuous ping across a deliberate spoke rollback showing measured reconvergence time."
          ],
        },
        {
          key: "sophos", label: "Sophos XGS/XG with SD-RED and Central Orchestration",
          pages: ["migration-sophos", "migration-sophos-policy", "security-firewall-refresh", "migration-journey-firewall", "migration-methodology"],
          phases: [
            { phase: "discover", steps: [
            "Export the SFOS configuration per appliance and flag every rule conditioned on Security Heartbeat.",
            "Record each RED's operating mode — bridged sites need re-addressing before their wave, not during it."
            ] },
            { phase: "foundation", steps: [
            "Build the hub XGS handoff as an IPsec IKEv2 site with a secondary tunnel.",
            "Add one eBGP neighbour per tunnel, accepting legacy prefixes but never the default route."
            ] },
            { phase: "network-waves", steps: [
            "Swap SD-RED sites first: ship a Socket, move the LAN, shelve the RED for rollback."
            ] },
            { phase: "security-cutover", steps: [
            "Agree the replacement runbook: Device Posture gates Client users, on-LAN heartbeat conditions have no equivalent."
            ] },
          ],
          prereqs: [
            "SFOS policy slice exported with per-rule traffic counters as the parity baseline.",
            "Entra ID SSO connected and SCIM syncing the pilot group before group-scoped rules.",
            "Hub XGS WAN IP, pre-shared keys and two Cato allocated IPs agreed for the tunnels.",
            "The MSP briefed and in the weekly sync — they run the Sophos estate day to day."
          ],
          risks: [
            "Bridged or transparent RED sites carry L2 semantics; Cato sites are routed, so plan re-addressing early.",
            "Heartbeat-conditioned rules translate into something broader unless the agreed replacement runbook covers them.",
            "Sophos endpoint SSL scanning layered under Cato TLSi throws certificate errors — stage the root certificate first.",
            "Audit DNAT server-access rules before retirement; forgotten published services go dark at cutover."
          ],
          evidence: [
            "Topology showing the pilot branch up, with eBGP routes received at the hub XGS.",
            "Completed endpoint-coexistence test matrix, dated and recorded per device build.",
            "Rule-hit event export reconciled against SFOS per-rule counters over a business week.",
            "Timed drill record: SD-RED re-plugged, hub tunnel re-established, then swapped forward again."
          ],
        },
        {
          key: "cisco-asa", label: "Cisco ASA perimeter (IPsec on-ramp, appliance retiring later)",
          pages: ["network-ipsec-asa", "security-firewall-refresh", "migration-journey-firewall", "migration-methodology"],
          phases: [
            { phase: "design", steps: [
            "Choose IKEv2 with a route-based VTI over crypto maps; VTI needs ASA 9.7(1) upwards.",
            "Allocate Cato IPs at two PoPs so each tunnel has a fixed, known peer address."
            ] },
            { phase: "foundation", steps: [
            "Build primary and secondary tunnels bidirectionally with Initiate Connection by Cato enabled.",
            "Add one BGP neighbour per tunnel, maximum two per site; Cato prepends the secondary."
            ] },
            { phase: "pilot", steps: [
            "Drop the primary tunnel and time the failover to the alternate PoP."
            ] },
            { phase: "network-waves", steps: [
            "Replace interim IPsec sites with Sockets in waves once the ASA joins the retirement list."
            ] },
            { phase: "security-cutover", steps: [
            "Work the ACL disposition list: translate what survives, retire the rest before the appliance goes."
            ] },
          ],
          prereqs: [
            "ASA release confirmed — VTI from 9.7(1), IKEv2 on a VTI from 9.8(1).",
            "Two Cato allocated IPs at separate PoPs, with Support confirming separate maintenance schedules.",
            "Site native range agreed, and the SDP user range routed into the tunnel.",
            "Read-only ASA config export listing the ACLs and NAT rules needing disposition."
          ],
          risks: [
            "The ASA accepts one traffic selector per child SA — multiple selectors return TS_UNACCEPTABLE.",
            "IPsec sites never roam PoPs; without the secondary tunnel there is no failover at all.",
            "A missing NAT exemption on a crypto-map ASA translates tunnel traffic and breaks return paths.",
            "Upstream shaping is best-effort over IPsec — QoS-sensitive sites still need a Socket eventually."
          ],
          evidence: [
            "Connection Status showing both tunnels up with matching proposals and lifetimes.",
            "Show BGP Status listing both neighbours and the learned site prefixes.",
            "Primary tunnel dropped deliberately, routes shifting to the secondary inside thirty seconds.",
            "Per-rule events proving translated ACL intent against the appliance's own usage baseline."
          ],
        },
        {
          key: "mixed-estate", label: "Mixed multi-vendor firewall estate approaching refresh",
          pages: ["security-firewall-refresh", "migration-journey-firewall", "migration-methodology", "migration-palo-alto", "migration-checkpoint", "migration-fortinet"],
          phases: [
            { phase: "discover", steps: [
            "Inventory every bezel: models, end-of-support dates, enabled inspection features and whether TLS decryption actually runs.",
            "Export each vendor's rulebase with per-rule usage evidence — the source differs per platform, so plan each export."
            ] },
            { phase: "design", steps: [
            "Pick parallel connectivity below roughly twenty sites, an interconnect hub above that."
            ] },
            { phase: "security-cutover", steps: [
            "Translate each vendor's highest-hit rules into one CMA rulebase, monitor-first with tracking on, judging parity on outcomes.",
            "Flip only the agreed rules to block once the monitor evidence supports it."
            ] },
            { phase: "decommission", steps: [
            "Retire bezel by bezel, management platforms last, once log retention and archive export are satisfied."
            ] },
          ],
          prereqs: [
            "A hit-count rulebase export from every vendor in scope, plus the enabled-features inventory.",
            "One transit VLAN and change window per pilot site, agreed with the network team.",
            "Socket v26 or higher if east-west device-attribute rules are needed, with device criteria enabled.",
            "SCIM or LDAP identity syncing into CMA before any user-scoped rule is translated."
          ],
          risks: [
            "Rule names never line up between vendors — compare on flow outcomes, never on labels.",
            "Multi-region hubs break symmetry; a stateful appliance seeing half a conversation drops the session.",
            "Cato's postures differ from every incumbent: WAN blocks by default, Internet allows by default.",
            "Per-box rulebases have drifted apart, so converging them exposes conflicts nobody currently owns."
          ],
          evidence: [
            "Dated Topology screenshots per pilot site showing handoff routes exchanged and traffic flowing.",
            "Home → Reports rule hit count PDF covering Internet, WAN and Network Rules policies.",
            "LAN Firewall events generated on the Socket, proving inter-VLAN control without the appliance.",
            "Renewal-decision pack: what each appliance enforces today beside what FWaaS demonstrated, gaps conceded."
          ],
        },
      ]
    },
    {
      dimension: "remote-access",
      options: [
        {
          key: "anyconnect", label: "Cisco AnyConnect on ASA/Firepower headends",
          pages: ["migration-anyconnect", "migration-journey-vpn", "access-identity-design", "access-hybrid-workforce", "access-byod-clientless"],
          phases: [
            { phase: "discover", steps: [
            "Export tunnel-groups, split-tunnel ACLs, HostScan posture rules and peak concurrent sessions per headend."
            ] },
            { phase: "foundation", steps: [
            "Enable SSO and SCIM, connect the IdP provisioning app and build flat, purpose-named groups.",
            "Confirm the pilot group syncs and stage posture profiles in monitor before user-scoped rules."
            ] },
            { phase: "pilot", steps: [
            "Swap the 5-25 user pilot cohort in one MDM or GPO window.",
            "Uninstall every incumbent agent and clear its PAC or forwarding profile, then install the Cato Client.",
            "Walk the cohort's acceptance checklist; never two SWG agents inspecting one flow."
            ] },
            { phase: "remote-access", steps: [
            "Roll departmental waves with the same MDM uninstall-install job and per-cohort rollback, split-tunnel first.",
            "After a clean baseline week, require the posture profile that recreates the ISE posture rules and add an always-on rule."
            ] },
            { phase: "decommission", steps: [
            "Drain sessions, disable tunnel-groups, retire the headends and cancel support renewals."
            ] },
          ],
          prereqs: [
            "ZTNA/SDP licences for the wave, and a Socket in front of the private applications.",
            "MDM that removes the AnyConnect profile and installs the Cato Client in one scripted job.",
            "IdP SSO connected with a dedicated wave group provisioning over SCIM before any policy.",
            "The wave's exported tunnel-group, split-tunnel ACL and posture rules as the parity checklist."
          ],
          risks: [
            "Never leave AnyConnect resident beside the Cato Client — it overrides the client's DNS settings.",
            "Incomplete AnyConnect removal breaks internal name resolution; verify the virtual adapter is gone first.",
            "Rollback stays cheap only while the headends are racked, licensed and monitored through soak.",
            "Partner allowlists and conditional-access rules keyed to VPN egress addresses must be re-pointed per wave."
          ],
          evidence: [
            "Dated show vpn-sessiondb anyconnect output before and after, concurrency down by the wave.",
            "WAN Firewall allow rules with hit counts, matched line by line against the ACL export.",
            "Experience Monitoring Remote Users capture per wave member: score, connected PoP, average TTFB.",
            "Timed rollback record — AnyConnect profile re-pushed via MDM, user back on the headend."
          ],
        },
        {
          key: "globalprotect", label: "Palo Alto GlobalProtect portals and gateways",
          pages: ["migration-palo-alto", "migration-journey-vpn", "access-identity-design", "access-hybrid-workforce"],
          phases: [
            { phase: "discover", steps: [
            "Inventory GlobalProtect portals, gateways and every HIP object actually referenced in live policy."
            ] },
            { phase: "design", steps: [
            "Map each HIP object to device posture checks: anti-malware, disk encryption, patch level, certificate."
            ] },
            { phase: "foundation", steps: [
            "Enable SSO and SCIM, connect the IdP provisioning app and build flat, purpose-named groups.",
            "Confirm the pilot group syncs and stage posture profiles in monitor before user-scoped rules."
            ] },
            { phase: "pilot", steps: [
            "Run Client Connectivity and Device Posture in monitor for the pilot cohort on Cato Client."
            ] },
            { phase: "remote-access", steps: [
            "Switch each machine scripted and short: install the Cato Client, validate app access, uninstall GlobalProtect."
            ] },
            { phase: "decommission", steps: [
            "Retire the GlobalProtect portals and gateways once the last cohort has moved across."
            ] },
          ],
          prereqs: [
            "SDP seats for the pilot cohort, provisioned as a syncing SCIM or LDAP group.",
            "Every referenced HIP object exported, with an owner named for each one.",
            "GlobalProtect portal and gateways kept warm as the per-cohort rollback path.",
            "Private applications reachable behind a Socket, or via the parallel-socket handoff at the pilot site."
          ],
          risks: [
            "Leaving GlobalProtect installed alongside the Cato Client kills traffic — its driver overrides client settings.",
            "A device that passed HIP at gateway login can fail Cato posture, which re-checks continuously.",
            "There is no automated HIP converter; validate every mapped check on a reference machine first.",
            "TLS inspection is unsupported on Android — keep Android devices out of the pilot cohort."
          ],
          evidence: [
            "A posture profile carrying the HIP trio, attached to the pilot Client Connectivity rule.",
            "A pilot-cohort week in Experience Monitoring: per-app scores, device and client version, security events.",
            "Connected-client inventory showing no GlobalProtect session remaining for cohort members.",
            "Helpdesk ticket count for the cohort across the pilot week."
          ],
        },
        {
          key: "directaccess", label: "Microsoft DirectAccess (deprecated)",
          pages: ["migration-directaccess", "migration-journey-vpn", "access-identity-design", "access-hybrid-workforce"],
          phases: [
            { phase: "discover", steps: [
            "Map DA client GPOs, the NLS, certificate templates, IP-HTTPS gateway and the uncovered non-Windows population."
            ] },
            { phase: "foundation", steps: [
            "Scope SCIM to a pilot group and rebuild managed-device intent as certificate and encryption checks."
            ] },
            { phase: "pilot", steps: [
            "Per device: drop the DA GPO, reboot, verify NRPT empty, then install the client."
            ] },
            { phase: "remote-access", steps: [
            "Roll cohorts by department, extending every wave to the Mac and mobile users DirectAccess missed.",
            "Enforce the posture profile and add an always-on rule once the clean week closes."
            ] },
            { phase: "decommission", steps: [
            "Retire the DA gateway, NLS and IP-HTTPS listener, releasing the remote-access certificate role."
            ] },
          ],
          prereqs: [
            "The DA client GPO scoped by a security group, so removal is a membership change.",
            "Cato Client staged in the same GPO or MDM estate that pushed DA configuration.",
            "Datacentre applications DirectAccess published sitting behind a Cato Socket before the first swap.",
            "A written change freeze on the NLS, PKI and IP-HTTPS gateway for the pilot window."
          ],
          risks: [
            "Never run DirectAccess and the Cato Client together — the two always-on tunnel adapters clash.",
            "Computer GPO changes apply only after reboot; a runsheet without one leaves DA alive underneath.",
            "A Windows certificate-based posture profile cannot pass on the macOS cohort member; scope checks per platform.",
            "Manage-out workflows that reached into remote machines deserve their own test case, not assumed parity."
          ],
          evidence: [
            "Per-device runsheet: GPO removed, reboot, gpresult clean, NRPT empty, first connected event.",
            "A fortnight of connection events with no manual intervention, plus the client refusing disconnect.",
            "A macOS or mobile user's row in Experience Monitoring under the same policy.",
            "Dated rollback drill returning one device to DirectAccess at the next policy refresh."
          ],
        },
        {
          key: "forticlient", label: "Fortinet FortiClient with EMS (SSL-VPN or ZTNA)",
          pages: ["migration-fortinet", "migration-journey-vpn", "access-identity-design", "access-hybrid-workforce"],
          phases: [
            { phase: "discover", steps: [
            "Inventory EMS ZTNA tagging rules and keep only those actually referenced in live policy."
            ] },
            { phase: "design", steps: [
            "Re-model surviving tags as posture profiles plus Client Connectivity and access-policy rules."
            ] },
            { phase: "foundation", steps: [
            "Bring IdP and SCIM sync live for the cohort and confirm EMS can disable per wave."
            ] },
            { phase: "pilot", steps: [
            "Put one cohort on the Cato Client with Client Connectivity Policy running in monitor."
            ] },
            { phase: "remote-access", steps: [
            "Per wave: disable FortiClient VPN and ZTNA in EMS, enrol the Cato Client, re-point posture enforcement, then uninstall."
            ] },
            { phase: "decommission", steps: [
            "Retire EMS and the SSL-VPN configuration once log-retention obligations have been met."
            ] },
          ],
          prereqs: [
            "EMS administrative access to disable FortiClient VPN and ZTNA per cohort.",
            "IdP and SCIM sync live for the pilot cohort before any user-scoped rule.",
            "The EMS tagging-rule inventory exported, since no automated converter exists for ZTNA tags.",
            "Cohort reachability to applications behind un-migrated sites via the hub handoff."
          ],
          risks: [
            "Never leave two VPN or ZTNA data paths active on one endpoint during the swap.",
            "An EMS-managed FortiClient usually must be disconnected from EMS before it uninstalls cleanly.",
            "If FortiClient is also the endpoint AV, retain its EPP function until a replacement is live.",
            "FortiOS 7.6.3 removes SSL-VPN tunnel mode without upgrading its policies — the rework happens regardless."
          ],
          evidence: [
            "Experience Monitoring Remote Users scores for the cohort across a full working week.",
            "An empty helpdesk queue for the cohort, triaged ticket by ticket.",
            "The posture profile referenced from the cohort's Client Connectivity rule, replacing the EMS tag.",
            "Client inventory confirming exactly one VPN data path per cohort endpoint."
          ],
        },
        {
          key: "zscaler-zpa", label: "Zscaler Private Access with Client Connector",
          pages: ["migration-zscaler", "migration-zscaler-policy", "migration-journey-vpn", "access-identity-design", "access-byod-clientless"],
          phases: [
            { phase: "discover", steps: [
            "Export ZPA segment groups, access policies, Browser Access, client forwarding and posture profiles."
            ] },
            { phase: "design", steps: [
            "Rebuild Browser Access apps as clientless portal entitlements and segment groups as named rules."
            ] },
            { phase: "foundation", steps: [
            "Roll the Cato Client split-tunnelled for RFC 1918 while ZCC keeps internet on ZIA."
            ] },
            { phase: "pilot", steps: [
            "For the pilot cohort only, move private-app access onto Cato WAN firewall rules.",
            "Swap that cohort off ZCC, clearing the ZIA PAC in the same GPO change."
            ] },
            { phase: "remote-access", steps: [
            "Switch the cohort's SDP client to always-on once it is off ZCC.",
            "Remove the cohort's split tunnel so Cato becomes its default internet route."
            ] },
            { phase: "decommission", steps: [
            "Retire ZPA App Connectors, then remove ZCC per endpoint once Cato SWG verdicts match ZIA on the agreed test list."
            ] },
          ],
          prereqs: [
            "A dedicated pilot group provisioned over SCIM and visibly syncing before any rule references it.",
            "ZIA stays authoritative outside the cohort; nothing in the pilot touches wider forwarding.",
            "The same GPO or MDM channel that deployed ZCC, able to remove it and its forwarding profile.",
            "A baseline week of Experience Monitoring scores captured in the dual-agent state."
          ],
          risks: [
            "Coexistence means ZCC riding inside the Cato tunnel — never two SWGs inspecting one flow.",
            "SDP users landing in All Unidentified Users silently break group-scoped rules; prove attribution first.",
            "SaaS tenants pinned to Zscaler egress ranges lock the cohort out when egress moves.",
            "GPO-pushed ZIA PAC files outlive ZCC removal and steer traffic around Cato entirely."
          ],
          evidence: [
            "Connected cohort list with device, client version and PoP, and no ZCC session.",
            "Filtered Events export per criterion, each verdict attributed to a named user and rule.",
            "Pilot-week Experience Monitoring scores no worse than the ZCC-era baseline.",
            "Zero non-cohort incidents logged while the interim ZIA path stayed up."
          ],
        },
        {
          key: "legacy-ipsec-vpn", label: "Legacy IPsec VPN concentrators",
          pages: ["migration-journey-vpn", "migration-anyconnect", "access-identity-design", "access-hybrid-workforce", "access-byod-clientless"],
          phases: [
            { phase: "discover", steps: [
            "Inventory concentrators, peak concurrent sessions, tunnel-group grants and the split-tunnel exception list's owner."
            ] },
            { phase: "foundation", steps: [
            "Put private apps behind a Socket, connect the IdP and stage posture profiles in monitor."
            ] },
            { phase: "pilot", steps: [
            "Swap the 5-25 user pilot cohort in one MDM or GPO window.",
            "Uninstall every incumbent agent and clear its PAC or forwarding profile, then install the Cato Client.",
            "Walk the cohort's acceptance checklist; never two SWG agents inspecting one flow."
            ] },
            { phase: "remote-access", steps: [
            "Roll departmental waves, replacing network-wide tunnel grants with per-app least-privilege rules.",
            "Move contractors and BYOD to clientless browser access — no agent, no network address."
            ] },
            { phase: "decommission", steps: [
            "Disable tunnel-groups, decommission the concentrators and cancel support renewals and client licences."
            ] },
          ],
          prereqs: [
            "Private applications reachable behind a Cato Socket before the first cohort swaps.",
            "IdP SSO with MFA and SCIM-provisioned cohort groups in place before policy is written.",
            "A deployment channel that can remove the VPN profile and install the client together.",
            "Named owners for the split-tunnel exception list — the app inventory nobody wrote down."
          ],
          risks: [
            "One tunnel granted the whole network, so expect blocks for apps no ACL ever listed.",
            "No machine should carry two full-tunnel agents; cohorts swap rather than dual-run.",
            "Concentrators drain to standby but stay racked and monitored until the final soak clears.",
            "Contractors are the cohort nobody wants to touch — plan them as the clientless wave."
          ],
          evidence: [
            "Concurrent session count on the headends down by the wave size at peak, dated.",
            "Per-app allow rules with hit counts over the implicit deny, plus one deliberate block.",
            "Experience Monitoring baselines per wave member set against the VPN-era ticket themes.",
            "Timed per-cohort rollback rehearsal returning one user to the old path."
          ],
        },
        {
          key: "none-ra", label: "No existing remote-access platform (greenfield)",
          pages: ["access-identity-design", "access-hybrid-workforce", "access-byod-clientless", "access-third-party"],
          phases: [
            { phase: "discover", steps: [
            "List the populations needing access — employees, contractors, BYOD — and the applications each touches."
            ] },
            { phase: "foundation", steps: [
            "Enable SSO and SCIM, connect the IdP provisioning app and build flat, purpose-named groups.",
            "Set account-wide authentication to SSO so MFA and conditional access stay in the IdP.",
            "Confirm the pilot group syncs before any user-scoped rule is written against it."
            ] },
            { phase: "pilot", steps: [
            "Run a twenty-to-thirty user cohort with posture profiles in monitor for a clean week."
            ] },
            { phase: "remote-access", steps: [
            "Enforce the posture profile on the connectivity rule, then add an always-on rule.",
            "Publish named applications to the clientless portal for contractors and unmanaged devices."
            ] },
          ],
          prereqs: [
            "The IdP admin in the room — provisioning app, assignments and logs all sit their side.",
            "A SCIM-capable IdP; Cato user SSO is OIDC, so SAML estates integrate at the IdP.",
            "ZTNA/SDP licences for the cohort plus an MDM push or documented manual client install.",
            "One office site behind a Socket, so user awareness can be proved behind the socket."
          ],
          risks: [
            "Nested IdP groups are unsupported over SCIM — flatten them at source before provisioning.",
            "Traffic with no awareness path lands in All Unidentified Users and matches only fallback rules.",
            "Always-On covers Windows, macOS, Android and iOS but not Linux; scope the criterion accordingly.",
            "Never write per-user rules; only group-scoped policy makes joiners and leavers self-maintaining."
          ],
          evidence: [
            "The group's Members tab before and after an IdP change, timed against the sync cycle.",
            "Paired events from one office subnet: bare IP before awareness, username after.",
            "Client refusing disconnect without a governed bypass passcode, plus a posture block event.",
            "Leaver drill timestamps: IdP audit entry, user disabled in Cato, failed sign-in."
          ],
        },
      ]
    },
    {
      dimension: "security-controls",
      options: [
        {
          key: "casb", label: "CASB / SaaS application control already in place",
          pages: ["security-data-casb-dlp", "security-tls-inspection", "migration-netskope-policy", "security-consistent"],
          phases: [
            { phase: "discover", steps: [
            "Export the incumbent CASB app, activity and instance matrix with per-rule hit counts."
            ] },
            { phase: "design", steps: [
            "Map each incumbent rule to app plus activity; translate instance conditions into Tenant Restrictions only for documented apps."
            ] },
            { phase: "foundation", steps: [
            "Stage TLS inspection scoped to the pilot group — CASB, DLP and compliance evidence see nothing without it."
            ] },
            { phase: "pilot", steps: [
            "Run the Cloud Apps Dashboard for two weeks once the pilot cohort is on-net and inspected.",
            "Run every translated Application Control rule in monitor posture and review hit counts weekly."
            ] },
            { phase: "security-cutover", steps: [
            "Promote high-confidence app rules to block, then sequence out-of-band SaaS API integrations last."
            ] },
          ],
          prereqs: [
            "CASB licence confirmed; any Data Control rule additionally requires the DLP licence.",
            "TLS inspection staged on the pilot cohort with the root certificate already deployed.",
            "IdP group syncing, so app events name the user rather than an IP address.",
            "Incumbent policy export plus the sanctioned-app list agreed with the business owners."
          ],
          risks: [
            "Instance-aware rules have no direct twin — Tenant Restrictions is documented for a limited app set.",
            "Apps that resolve to a URL category carry no activity control; check the App Catalog before promising it.",
            "Category taxonomies are never one-to-one; walk the mapping rule by rule with the customer.",
            "Sequencing the out-of-band API integration early floods the review before inline policy is tuned."
          ],
          evidence: [
            "Cloud Apps Dashboard export showing sanctioned versus unsanctioned counts, risk scores and newly seen apps.",
            "App & Data Inline rulebase with live hit counts against each translated rule.",
            "Events filtered to one app rule returning identical verdicts from a site source and a Client user.",
            "A Tenant Restrictions rule refusing a personal tenant login, evidenced as an event."
          ],
        },
        {
          key: "dlp", label: "DLP already enforced on web and SaaS",
          pages: ["security-data-casb-dlp", "security-dlp-forensics", "security-tls-inspection", "access-byod-clientless"],
          phases: [
            { phase: "discover", steps: [
            "Name one data owner per category — finance, HR, customer PII — for tuning."
            ] },
            { phase: "design", steps: [
            "Build Content Profiles from regional data types and record each type's occurrence threshold."
            ] },
            { phase: "foundation", steps: [
            "Stage TLS inspection scoped to the pilot group — CASB, DLP and compliance evidence see nothing without it."
            ] },
            { phase: "pilot", steps: [
            "Add Data Control rules in non-blocking posture with event tracking, scoped to the pilot.",
            "Export a fortnight of matches and mark every row true or false positive."
            ] },
            { phase: "security-cutover", steps: [
            "Promote one high-confidence rule to block with an agreed user-notification template attached."
            ] },
          ],
          prereqs: [
            "CASB plus DLP licences confirmed on the trial account before the scoping workshop.",
            "TLS inspection live on the pilot group, with privacy sign-off on the inspect scope.",
            "Named data owners committed to sit in the match-report review session.",
            "Client at Windows v5.10+ or macOS v5.7+ so security-policy user notifications render."
          ],
          risks: [
            "Files above 50 MB are not scanned, and the Data Control policy fails open by default.",
            "A rule evaluates at most 20 data types — pick the regional variants, not the whole catalogue.",
            "OCR image scanning does not apply to ML Classifier types; prove that path on pattern-based types.",
            "Booking the data-owner review at day three leaves too little traffic for a credible false-positive rate."
          ],
          evidence: [
            "DLP events export annotated true or false positive per row, signed off by the data owners.",
            "Data Protection Inline dashboard showing top violating rules and violations by data profile.",
            "Blocked event paired with a screenshot of the notification the pilot user actually saw.",
            "Data incident detail carrying rule, matched data types, named user, device and destination."
          ],
        },
        {
          key: "threat-prevention-ips", label: "IPS / threat prevention already licensed and enforcing",
          pages: ["security-ransomware", "security-inbound-ips", "security-consistent", "security-firewall-refresh"],
          phases: [
            { phase: "discover", steps: [
            "Baseline the incumbent IPS: which directions enforce, and how signatures are updated today."
            ] },
            { phase: "design", steps: [
            "Decide IPS direction scope — inbound, outbound and WAN — per pilot site and cohort."
            ] },
            { phase: "pilot", steps: [
            "Set IPS to Monitor on the scoped directions and review a week of verdicts.",
            "Enable Suspicious Activity Monitoring, monitor-only by design, and let real pilot traffic accumulate."
            ] },
            { phase: "security-cutover", steps: [
            "Flip the reviewed directions to Block, then judge the change on fresh events, not assumptions."
            ] },
            { phase: "handover", steps: [
            "Walk Rapid CVE Mitigation so virtual patching replaces their signature-update change windows."
            ] },
          ],
          prereqs: [
            "IPS licence active for the account; Suspicious Activity Monitoring is included within it.",
            "TLS inspection staged wherever outbound content-level verdicts are expected from the engine.",
            "Pilot socket and a 5–20 user cohort live, with identity syncing for attribution.",
            "Any active scanning is run by the customer's authorised security team through their own change process."
          ],
          risks: [
            "A new IPS rule can take up to ten minutes to become effective — wait before diagnosing.",
            "Geo Restriction rules never apply to Cato Client traffic, so they cannot carry parity evidence.",
            "TLS inspection is not performed inbound; published HTTPS services get reputation and protocol checks only.",
            "A quiet ten-user cohort gives the sensors little to say — this evidence accrues, it does not fire on demand."
          ],
          evidence: [
            "Threats Dashboard capture with its View Events drill-down across the pilot window.",
            "IPS events carrying the CVE reference, attributed to user, device and site.",
            "Before and after event streams either side of the monitor-to-block flip on the agreed directions.",
            "Rule hit count report read against the incumbent's own rule-usage export."
          ],
        },
        {
          key: "sandboxing", label: "Sandboxing / detonation of unknown files expected",
          pages: ["security-ransomware", "security-consistent", "security-firewall-refresh", "migration-symantec"],
          phases: [
            { phase: "discover", steps: [
            "Record the incumbent sandbox's file coverage and whether formal detonation is a contractual requirement."
            ] },
            { phase: "design", steps: [
            "Scope Anti-Malware and NG Anti-Malware against documented services; never overclaim detonation sandboxing."
            ] },
            { phase: "foundation", steps: [
            "Enable Anti-Malware first — NG Anti-Malware requires the base engine to be running."
            ] },
            { phase: "pilot", steps: [
            "Fetch the EICAR test file over HTTP from the site and from a Client user.",
            "Repeat over HTTPS once TLS inspection is staged, keeping the before/after pair as an exhibit."
            ] },
            { phase: "security-cutover", steps: [
            "Move Anti-Malware verdicts to block across the pilot scope and capture the block page."
            ] },
          ],
          prereqs: [
            "Anti-Malware licence active, plus NG Anti-Malware where next-generation verdicts are in written scope.",
            "TLS inspection staged on the pilot cohort — HTTPS file verdicts depend on it entirely.",
            "Safe test files only, from KB-documented sources, cleared with the customer's security team first.",
            "Endpoint AV exclusion agreed for the test directory, or the desktop agent eats the sample."
          ],
          risks: [
            "Disabling Anti-Malware disables NG Anti-Malware with it — check the trial covers both engines.",
            "Engines scan HTTP, HTTPS and FTP transfers up to 100 MB; larger files fall outside the verdict.",
            "Endpoint AV quarantining EICAR first muddies whether the block actually happened on the wire.",
            "A formal detonation-sandbox requirement must be scoped explicitly, not assumed to be equivalent."
          ],
          evidence: [
            "Two Anti-Malware block events for the same file: one site source, one SDP user.",
            "Threats Dashboard entry showing the detections alongside IPS activity for the same window.",
            "Before/after pair — the HTTPS sample downloading uninspected, then blocked once inspection is live.",
            "Block-page screenshot with the event attributed to user, device and site."
          ],
        },
        {
          key: "rbi", label: "Remote browser isolation already in the policy",
          pages: ["access-byod-clientless", "access-third-party", "migration-cloudflare-policy", "migration-netskope"],
          phases: [
            { phase: "discover", steps: [
            "List which cohorts need isolation and which must genuinely edit or move files."
            ] },
            { phase: "design", steps: [
            "Translate the incumbent Isolate action into the RBI rulebase action beside Allow and Block."
            ] },
            { phase: "foundation", steps: [
            "Publish the named internal applications to the portal, entitled to the pilot group."
            ] },
            { phase: "pilot", steps: [
            "Route the contractor cohort's portal access through RBI and test every named app.",
            "Stage a download and a copy attempt on camera; the refusal is the artefact."
            ] },
            { phase: "security-cutover", steps: [
            "Add the RBI isolate rule for uncategorised and new domains, tracking events first."
            ] },
          ],
          prereqs: [
            "RBI confirmed as a distinct licence line on the bill of materials, not assumed bundled.",
            "Named application list agreed — RDP farms behind a connection broker are not supported.",
            "Pilot cohort provisioned via SCIM as a dedicated group before any policy is written.",
            "Portal SSO against the customer's existing IdP, with MFA enforced there."
          ],
          risks: [
            "Portal apps configured for RBI open the entire portal in one isolated session.",
            "Isolation blocks downloads, copy/paste and printing for everything in that session — decide per cohort.",
            "Test every named app under RBI in week one, not in front of the customer in week three.",
            "The incumbent may bundle isolation into an SWG tier, so it silently drops out of scope at renewal."
          ],
          evidence: [
            "Screenshot of the refused download and copy inside the isolated portal session.",
            "Portal session events for the same identity: sign-in, app launch, refused action.",
            "Internet Firewall rulebase showing RBI as an action beside Allow, Block and Prompt.",
            "Per-identity event export proving no software was installed on the unmanaged device."
          ],
        },
        {
          key: "tls-inspection", label: "TLS decryption already running on the incumbent gateway",
          pages: ["security-tls-inspection", "security-consistent", "security-data-casb-dlp", "migration-netskope-policy"],
          phases: [
            { phase: "discover", steps: [
            "Export the incumbent's SSL do-not-decrypt list — the artefact that seeds Cato's bypasses."
            ] },
            { phase: "design", steps: [
            "Run the Configuration Wizard and keep its sensitive-category and embedded-OS bypasses as the baseline."
            ] },
            { phase: "foundation", steps: [
            "Deploy the Cato root certificate fleet-wide alongside the incumbent CA, removed only at decommission.",
            "Verify the padlock issuer reads Cato Networks on every operating system, and block QUIC first."
            ] },
            { phase: "pilot", steps: [
            "Inspect the 5–20 user cohort monitor-first, downstream engines in monitor so breakage surfaces as events."
            ] },
            { phase: "network-waves", steps: [
            "Add one category wave, watch it settle, then bypass deliberately with a named owner."
            ] },
            { phase: "security-cutover", steps: [
            "Widen the Inspect rule's source towards Any and flip downstream engines to block."
            ] },
          ],
          prereqs: [
            "Endpoint team can push the root certificate by GPO, Intune or Jamf to every pilot device.",
            "Privacy owner approves the inspect scope and sensitive-category bypasses before any traffic is decrypted.",
            "Every operating system in the cohort listed up front — certificate reach and ratio both depend on it.",
            "A content engine ready to prove a verdict: Anti-Malware for the EICAR exhibit, or DLP."
          ],
          risks: [
            "Certificate-pinned and mutual-TLS applications break by design — bypass narrowly, with owner and expiry.",
            "QUIC block rules are auto-created on first enablement; removing them re-opens an uninspected side door.",
            "Java, git and Firefox before 120 keep their own trust stores — expect this if developers are in scope.",
            "There is no dry run: a bypassed flow tells you nothing about how it behaves decrypted.",
            "Double decryption if the incumbent still inspects the same path — disable it for Cato-routed traffic."
          ],
          evidence: [
            "Dated per-OS padlock screenshots showing the issuer as Cato Networks plus the serving PoP.",
            "TLS Inspection report filtered to the pilot: inspected versus bypassed events per operating system.",
            "Bypass register beside the policy screenshot, every row carrying a reason and an owner.",
            "Zero-row query of TLSi-tagged service-desk tickets for the final pilot week."
          ],
        },
        {
          key: "none-sec", label: "No meaningful inspection today — greenfield security",
          pages: ["security-consistent", "security-firewall-refresh", "security-tls-inspection", "security-ransomware"],
          phases: [
            { phase: "discover", steps: [
            "Record which inspection features are licensed today, which are enabled, and whether decryption really runs."
            ] },
            { phase: "design", steps: [
            "Sequence enablement: TLS inspection first, then SWG categories, IPS, Anti-Malware, CASB, DLP."
            ] },
            { phase: "pilot", steps: [
            "Add one visible proof rule as Allow with event tracking before anything blocks.",
            "Enable IPS and Anti-Malware in monitor and review a week of verdicts together."
            ] },
            { phase: "security-cutover", steps: [
            "Flip the reviewed engines to block on the pilot scope and time policy propagation."
            ] },
            { phase: "handover", steps: [
            "Hand over the single rulebase and audit trail as the estate's only policy plane."
            ] },
          ],
          prereqs: [
            "IPS and Anti-Malware trial licences live for the whole evaluation window, not part of it.",
            "Pilot socket up and a 5–20 user cohort enrolled on the Cato Client.",
            "Users provisioned from the IdP so events name people rather than IP addresses.",
            "Privacy sign-off on the inspect scope before the first flow is decrypted."
          ],
          risks: [
            "New detections read as regressions — they are usually traffic nobody ever inspected before.",
            "The Internet Firewall rulebase ends in an implicit any-any allow, so unmatched traffic passes.",
            "Publishing is one-way: record the before-state, because unwinding means editing forward.",
            "Turning every engine on at once destroys the monitor baseline that makes each block defensible."
          ],
          evidence: [
            "My Policy Changes showing the publish reaching every PoP, timestamped against the change.",
            "Events filtered by the proof rule name returning site, Client and cloud sources with identical verdicts.",
            "Threats Dashboard carrying the first week of IPS and Anti-Malware verdicts from real traffic.",
            "Audit Trail record of everything the pilot added and removed, exported before licences lapse."
          ],
        },
      ]
    },
    {
      dimension: "drivers",
      options: [
        {
          key: "mpls-contract-end", label: "MPLS contract end",
          pages: ["network-mpls-migration", "migration-journey-mpls", "migration-methodology", "network-sdwan", "network-resilient-site-design", "management-vendor-consolidation", "management-pov-framework"],
          phases: [
            { phase: "discover", steps: [
            "Map every MPLS circuit to its site, contract end date, notice period and the prefixes it must still reach."
            ] },
            { phase: "design", steps: [
            "Choose the co-existence pattern: routed ranges at a static hub or eBGP handoff."
            ] },
            { phase: "foundation", steps: [
            "Connect the DC interconnect socket beside the CE router and add one routed range per site.",
            "Prove reachability both ways between migrated and un-migrated sites before the first wave."
            ] },
            { phase: "network-waves", steps: [
            "Migrate sites in contract-expiry order, deleting each routed range as its prefix moves and filling the reachability matrix."
            ] },
            { phase: "decommission", steps: [
            "Withdraw the last routed range, remove the CE static route and decommission the MPLS router.",
            "Serve notice against the notice period, then confirm the circuit contract is cancelled."
            ] },
            { phase: "handover", steps: [
            "Hand over the completed reachability matrix with dated Topology screenshots for every wave."
            ] },
          ],
          prereqs: [
            "A circuit inventory carrying contract end dates, notice periods and annual run cost per site.",
            "Carrier change ticket raised at kick-off for the return route to the pilot prefix.",
            "Baseline latency, loss and application timings captured while the pilot site is still on MPLS.",
            "An agreed routing decision point per site archetype: L3 switch, legacy firewall or Cato socket."
          ],
          risks: [
            "Carrier-managed CE static routes need change tickets — lead times run to weeks, not hours.",
            "MPLS terms rarely co-terminate, so the interim network must work for months, not days.",
            "Notice periods and early-exit penalties set the real exit date, not the technical cutover.",
            "A routed range overlapping a DC VLAN or remote-access pool silently sends traffic nowhere."
          ],
          evidence: [
            "Completed reachability matrix, every row dated against a real Topology screenshot.",
            "Experience Monitoring Sites tab holding a Good score for the migrated site week after week.",
            "Rollback rehearsed live: static route withdrawn in a change window, traffic reverting cleanly.",
            "Final wave closed with the MPLS router decommissioned and the contract termination confirmed."
          ],
        },
        {
          key: "firewall-refresh", label: "Firewall refresh / EOL",
          pages: ["security-firewall-refresh", "migration-journey-firewall", "security-consistent", "security-inbound-ips", "security-tls-inspection", "migration-methodology", "management-vendor-consolidation"],
          phases: [
            { phase: "discover", steps: [
            "Capture the renewal quote, EOL dates and which inspection features the appliance actually has enabled."
            ] },
            { phase: "design", steps: [
            "Rationalise on hit counts: take the 15–20 highest-hit rules as the parity slice."
            ] },
            { phase: "foundation", steps: [
            "Connect the pilot site socket and take dated day-one screenshots as evidence item zero."
            ] },
            { phase: "pilot", steps: [
            "Withdraw the handoff route in a change window and time the revert to the appliance."
            ] },
            { phase: "security-cutover", steps: [
            "Hold the slice in monitor until outcomes match, then flip the agreed rules to block."
            ] },
            { phase: "decommission", steps: [
            "Withdraw the handoff route permanently and power the appliance down."
            ] },
            { phase: "handover", steps: [
            "Assemble the renewal-decision pack: appliance capabilities beside dated Cato evidence, gaps conceded in writing."
            ] },
          ],
          prereqs: [
            "A read-only rulebase export with per-rule hit counts from the incumbent appliance.",
            "TLS inspection staged first wherever content-level verdicts feed a parity row.",
            "Identity integration syncing so events read as a named user, not an IP address.",
            "A change window agreed with the appliance owner for both the handoff route and the rollback."
          ],
          risks: [
            "Rule names never line up between vendors — judge parity on flow outcomes, not labels.",
            "Migrating the whole rulebase migrates the shadowed cruft; rationalise on hit counts first.",
            "LAN Firewall parity is evidenced from Socket-generated events, not PoP events — set that expectation.",
            "The refresh quote has a clock on it; a slipped pilot pushes the customer back to like-for-like."
          ],
          evidence: [
            "The translated slice as an ordered, first-match rulebase with live hit-count bars.",
            "Rule hit count report PDF from the Reports catalogue, dated inside the PoV window.",
            "One rule firing identically from the pilot site and from a Cato Client user.",
            "Timed rollback record: route withdrawn, traffic back on the appliance, nothing dropped."
          ],
        },
        {
          key: "compliance-regime", label: "Compliance regime",
          pages: ["security-compliance", "security-finance-dora", "security-retail-pci", "security-uk-public-sector", "security-healthcare-nhs", "security-data-casb-dlp", "security-tls-inspection", "access-identity-design", "management-visibility"],
          phases: [
            { phase: "discover", steps: [
            "Workshop with the compliance owner to pick controls from their SoA or audit plan."
            ] },
            { phase: "design", steps: [
            "Map each control to a named CMA artefact and a written shared-responsibility line."
            ] },
            { phase: "security-cutover", steps: [
            "Enable CASB and DLP rules in monitor, with tracking on for every in-scope rule."
            ] },
            { phase: "handover", steps: [
            "With tracking on for every in-scope rule, generate policy CSV exports, hit-count PDFs and Audit Trail extracts.",
            "Assemble the indexed pack: control text, dated artefacts and responsibility note per section."
            ] },
          ],
          prereqs: [
            "A named compliance owner — ISMS manager or audit lead — present to choose the controls.",
            "CASB licence for Application Control rules, plus the DLP licence for Data Control rules.",
            "TLS inspection scope and exclusions approved by whoever owns privacy, before traffic is inspected.",
            "An admin holding the Editor role, because policy CSV export requires it."
          ],
          risks: [
            "ISO clauses 4–10 stay customer-owned — never let the pack imply Cato closes a control.",
            "A rule without tracking reports a zero hit count, and a zero-evidence row is a failed row.",
            "Capabilities are licensed modules; an unlicensed capability cannot evidence its control row.",
            "Content-level evidence is impossible until TLS inspection is staged, so it gates the timeline."
          ],
          evidence: [
            "Signed control-to-evidence matrix, dated, with the organisational-responsibility column completed per row.",
            "Audit Trail extract for the pilot window showing every policy change attributed.",
            "Data Protection dashboard capture plus a DLP event export naming the matched data types.",
            "The auditor-consumable pack walked by the compliance owner at the decision meeting."
          ],
        },
        {
          key: "mna-integration", label: "M&A integration",
          pages: ["network-agility-mna", "management-api-automation", "access-identity-design", "security-consistent", "management-asset-discovery", "network-global-expansion", "migration-methodology"],
          phases: [
            { phase: "discover", steps: [
            "Ask how long the last deal took to integrate and what was compromised."
            ] },
            { phase: "design", steps: [
            "Agree the stopwatches: exact start and stop event for every timed run."
            ] },
            { phase: "foundation", steps: [
            "Define the acquired sites as code in Terraform and create them via the GraphQL API."
            ] },
            { phase: "pilot", steps: [
            "Ship one socket, let local hands plug it in, and clock power-on to first flows."
            ] },
            { phase: "remote-access", steps: [
            "Connect the acquired Entra ID tenant and name its groups in a WAN firewall rule."
            ] },
            { phase: "handover", steps: [
            "Walk the Audit Trail with the witness — every change attributed, nothing written by hand."
            ] },
          ],
          prereqs: [
            "An API key under Administration → API & Integrations if sites are defined as code.",
            "Site licences for the pilot branch plus a spare for any pop-up or war-room site.",
            "Access to the acquired company's Entra ID tenant for user and group provisioning.",
            "A named customer witness plus an agreed timestamp source for every clocked run."
          ],
          risks: [
            "A site with no assigned licence goes disabled and stops passing traffic — settle licences early.",
            "Sockets behind the acquired estate's edge firewall need outbound UDP 53, UDP 443 and TCP 443.",
            "My Policy Changes tracks only published changes by the admin watching — brief the witness.",
            "Agility proven by the vendor's own engineer proves nothing; their administrator must drive."
          ],
          evidence: [
            "Elapsed time from the Socket power-on photograph to first flows in App Analytics.",
            "My Policy Changes showing 100% propagation, timestamped against the publish click.",
            "A WAN firewall rule naming an acquired Entra group, with hit counts climbing.",
            "One Audit Trail view covering every timed run with nothing unattributed."
          ],
        },
        {
          key: "cloud-migration", label: "Cloud migration",
          pages: ["network-cloud-datacenter", "network-cloud-interconnect", "network-global-app-performance", "network-sdwan", "security-consistent", "management-visibility", "migration-methodology"],
          phases: [
            { phase: "discover", steps: [
            "List the cloud regions running production workloads and how branches reach them today."
            ] },
            { phase: "design", steps: [
            "Pick the on-ramp per region: vSocket, IPsec from a native gateway, or cross-connect."
            ] },
            { phase: "foundation", steps: [
            "Create the cloud site with its native range matching the VPC LAN subnet exactly."
            ] },
            { phase: "pilot", steps: [
            "Deploy the vSocket HA pair, reboot the VM, then validate IAM with the API Test Tool."
            ] },
            { phase: "security-cutover", steps: [
            "Write one WAN firewall rule matching branch, datacentre and Client sources to the workload."
            ] },
            { phase: "decommission", steps: [
            "Retire the region's interconnect circuit and virtual firewall once failover and throughput pass."
            ] },
          ],
          prereqs: [
            "AWS Marketplace, CloudFormation, IAM role and key-pair rights, or Azure resource-group owner permissions.",
            "Three subnets — MGMT, WAN and LAN — plus a dedicated LAN subnet for the HA secondary.",
            "Source/destination checking disabled on the AWS LAN interface, or IP forwarding enabled on Azure NICs.",
            "A change window for the failover test with the cloud platform team in the room."
          ],
          risks: [
            "A private-DNS-only VPC breaks vSocket HA API calls and registration — public DNS is required.",
            "Cloud route tables are usually owned elsewhere; a well-meaning correction mid-pilot breaks it silently.",
            "AWS reserves the first addresses of each subnet, so ENI addressing must avoid them.",
            "An undersized vSocket instance caps throughput — scale it before blaming the backbone."
          ],
          evidence: [
            "Topology showing the cloud site beside physical sites, HA primary active and keepalive Ok.",
            "Events for the single rule showing site and SDP-user sources against the cloud destination.",
            "Timed branch-to-VPC transfer captured alongside the site's Real Time throughput graphs.",
            "Failover capture: route table next hop moved to the secondary, workload still reachable."
          ],
        },
        {
          key: "ai-security", label: "AI security & governance",
          pages: ["ai-genai-security", "security-ai", "security-ai-visibility", "ai-agentic-security", "ai-homegrown-apps", "ai-legal-genai", "security-tls-inspection", "security-data-casb-dlp", "access-identity-design"],
          phases: [
            { phase: "discover", steps: [
            "Build the shadow-AI inventory from the incumbent proxy or firewall logs and the AI owner's list."
            ] },
            { phase: "design", steps: [
            "Fix the action ladder: pilot group, data classes, and which week each rung starts."
            ] },
            { phase: "foundation", steps: [
            "Stage TLS inspection with the Inspect rule scoped to the AI pilot group."
            ] },
            { phase: "pilot", steps: [
            "Re-run the inventory passively from Cato Internet Firewall events for the pilot cohort, blocking nothing.",
            "Move one User Interaction Policy rule from Monitor to Anonymize and Monitor."
            ] },
            { phase: "security-cutover", steps: [
            "Apply the recommended DLP profiles against the Generative AI Tools category, monitor first."
            ] },
            { phase: "handover", steps: [
            "Export dashboards and events as the governance pack the AI owner files."
            ] },
          ],
          prereqs: [
            "Trial covering AI Security for End Users across the pilot group and plugin cohort.",
            "Two weeks of monitor-mode discovery, or assessment findings naming the apps, users and data patterns.",
            "Identity integration syncing so the inventory names users rather than IP addresses.",
            "MDM access for the off-net cohort, with catonetworks.com allowlisted where a third-party SASE steers them."
          ],
          risks: [
            "The User Interaction Policy cannot inspect AI traffic until TLS inspection is on account-wide.",
            "Blocking first pushes users to personal accounts and devices, and usage simply goes dark.",
            "Prompt storage needs privacy sign-off and a restricted RBAC role before the first prompt is kept.",
            "AI Security for End Users is a separate per-user licence from AI Security for Apps."
          ],
          evidence: [
            "Dated shadow-AI inventory compared against what the customer believed was in use.",
            "User-side screenshot of a tokenised prompt beside its matching anonymise event.",
            "AI Violation Rate trend for the pilot group falling before anything is blocked.",
            "Events export annotated true or false positive against each recommended DLP rule."
          ],
        },
        {
          key: "cost-consolidation", label: "Cost & vendor consolidation",
          pages: ["management-vendor-consolidation", "security-firewall-refresh", "network-mpls-migration", "network-sdwan", "security-data-casb-dlp", "security-tls-inspection", "management-visibility", "management-pov-framework"],
          phases: [
            { phase: "discover", steps: [
            "Run the current-state inventory workshop: vendor, product, renewal date, run cost, owner."
            ] },
            { phase: "design", steps: [
            "Build the capability-coverage matrix, striking rows that do not apply and conceding gaps."
            ] },
            { phase: "pilot", steps: [
            "Run at least two technical pilots and harvest two dated tenant artefacts per row."
            ] },
            { phase: "decommission", steps: [
            "Sequence dual-running windows against notice periods before any appliance or circuit is switched off."
            ] },
            { phase: "handover", steps: [
            "Overlay every circuit and product renewal date, marking each absorb, re-pilot or retain.",
            "State plainly what any retained appliance does that Cato does not, then read out."
            ] },
          ],
          prereqs: [
            "A named contract-data owner from procurement who can bring renewal dates and run costs.",
            "At least two technical pilots live in the same account with their own criteria met.",
            "Licence entitlements checked against every matrix row before the readout is written.",
            "The no-invented-numbers rule agreed in writing at the scope workshop."
          ],
          risks: [
            "No savings figure enters the pack unless it came from the customer's own inventory.",
            "A demo-tenant screenshot taints every claim beside it — artefacts must come from their account.",
            "Proving a capability does not end a contract; notice periods and co-termination set real dates.",
            "The inventory stalls without procurement present — escalate rather than filling gaps with list prices."
          ],
          evidence: [
            "Inventory spreadsheet, dated and owned by a named person on the customer side.",
            "Rule hit count report PDF covering Internet Firewall, WAN Firewall and Network Rules together.",
            "Audit Trail screenshot for the PoV window — one attributed log across every policy.",
            "Renewal-timeline overlay with a verdict marked against each contract in the next 24 months."
          ],
        },
        {
          key: "global-expansion", label: "Global expansion",
          pages: ["network-global-expansion", "network-agility-mna", "network-global-app-performance", "network-resilient-site-design", "access-remote-worker", "management-visibility", "migration-methodology"],
          phases: [
            { phase: "discover", steps: [
            "Name the next markets and the carrier lead time on their last overseas circuit."
            ] },
            { phase: "design", steps: [
            "Read the nearest PoP from the production PoP guide and write it into the register."
            ] },
            { phase: "network-waves", steps: [
            "Prove Internet and SaaS traffic leaves at the in-region PoP instead of hairpinning home."
            ] },
            { phase: "remote-access", steps: [
            "Bridge the landing team on the Cato Client or IPsec while the socket ships."
            ] },
            { phase: "handover", steps: [
            "Evidence day-one policy inheritance: rule hits with no policy edits in the Audit Trail."
            ] },
          ],
          prereqs: [
            "Site licence agreed before the socket ships — an unlicensed site is disabled and passes nothing.",
            "An importer of record for hardware crossing the border, plus the customs paperwork.",
            "Named local hands who can plug in power and WAN, and a phone camera for timestamps.",
            "A handful of pilot users already working in the target region, or travelling there for the pilot."
          ],
          risks: [
            "China is never folded into a standard socket pilot — scope it with the Cato China team.",
            "Customs clearance varies from days to weeks, so the stopwatch starts at power-on, never dispatch.",
            "Serviced-office and landlord edges block Socket traffic — pre-clear the outbound ports and DNS.",
            "Restricting a site to its preferred PoP forces adherence even when that PoP has a problem."
          ],
          evidence: [
            "Connected PoP in Topology matching the PoP predicted at the scope workshop.",
            "Side-by-side SaaS timings via in-region local egress and via today's backhaul, same hour.",
            "Experience Monitoring Remote Users table showing the in-region PoP per pilot user.",
            "Events for the new site hitting rules published long before the site existed."
          ],
        },
      ]
    },
  ]
};
