/* Cato Use Case Library — GENERATED per-use-case presentation content. One entry per catalog id: {pain, gain, demo, hook, notes} — notes holds speaker notes per slide: divider/why/demo. Authored from the pages themselves; regenerate by re-running the deck content authoring pass. */
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
    "hook": "How many suppliers can reach more than the one application they were onboarded for — and would you know?",
    "notes": {
      "divider": "Open on the people the business controls least — IT providers, logistics partners, offshore developers. They needed a handful of applications; the VPN handed them the whole network.\nLand the hook, then back it with the numbers on the page — recent third-party breaches running to hundreds of millions, one put at two billion pounds to the UK economy. Then bridge: here's what I'll show you — suppliers reaching exactly what they need, provably.",
      "why": "Talk it as a trust problem, not a tooling one: legacy VPN was designed for connectivity, so it runs on implicit trust — no segmentation, free lateral movement, and no record of what a contractor did once inside. Every bolted-on appliance adds patching, cost and drift per supplier.\nThe contrast: access decided by who the person is plus the live state of their device, re-checked throughout the session rather than once at login, with every decision attributed to a name.\nAsk the discovery question — how would you know if one of those supplier accounts was compromised today? Then pivot: let's go and look at how that's built.",
      "demo": "Start in the Client Connectivity Policy: geography and group rules are the first gate — who even gets a tunnel, from where, on which device.\nMove to the WAN Firewall: contractor groups reach only their named resources, and wider access demands a compliant posture profile. Then open Device Posture and show the criteria — EPP or EDR running, disk encryption, OS version — stressing they're evaluated continuously, not just at sign-in.\nMake it real: log in as a contractor, open the permitted portal, then watch the internal resource stay blocked — the contrast is the point.\nFinish in Events filtered to that identity: every allow and block with a name against it. Say it plainly — this is the audit trail you don't have today — then back to the slides."
    }
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
    "hook": "Does a user at home get exactly the same policy as one at a desk — and which is the real one?",
    "notes": {
      "divider": "Open with one employee's week — office Monday, home Tuesday, a customer site Wednesday, a hotel Thursday — and ask why the network they get should depend on which chair they're in.\nLand the hook, then frame it: this is about retiring the concentrator estate for one front door at the nearest of eighty-plus PoPs. Here's what I'll show you — the same user, the same policy, from the sofa and the desk.",
      "why": "Today the concentrator backhauls everything — even Microsoft 365 — through HQ, appliances collapse when everyone connects at once, and the pain trains users to disconnect and lose protection entirely. Two rule sets drift apart — office firewall and VPN ACLs — while split tunnels go out of the home router uninspected.\nWith Cato the client is always on, traffic enters the nearest PoP for the full inspection stack, and there is exactly one rule base — in the office the same user simply rides the site socket.\nAsk the discovery question: does home get the same policy as the desk, and which one is real? Then pivot to the laptop.",
      "demo": "Begin on the laptop at home: launch the client, sign in with MFA through their IdP, and point at the status — connected to the nearest PoP, nothing for the user to toggle.\nJump to the WAN Firewall: open the rule that just allowed an internal app and filter events to the user — the same rule fires from office and sofa, and behind a socket the client simply switches to office mode. Then the Internet Firewall: browse a blocked category from home — nothing is split-tunnelled out uninspected.\nZoom out on the Remote Users tab of Experience Monitoring — the whole remote workforce scored on one screen, the Monday-morning answer to is it just me.\nClose in Monitor, Users: connection history, PoP, device — the visibility the VPN never gave them. Back to the slides."
    }
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
    "hook": "When an agent leaves on Friday, how long before every credential and session they had is actually gone?",
    "notes": {
      "divider": "Open at scale: thousands of developers and agents inside the repositories, CRM and VDI — on devices the outsourcer or the individual owns, with joiners and leavers every week — while regulators insist data stays in-country and off the endpoint.\nAsk who owns the laptops on their floors, then land the Friday-leaver hook. Bridge: here's what I'll show you — both device classes under one policy engine, with the lag taken out of VDI.",
      "why": "Today's answer is a VPN granting network-level access to unmanaged devices, plus a VDI farm bolted on for every task — reached over long-haul public internet, so agents lag and developers are miserable. Offboarding runs on tickets, and leavers linger for weeks.\nWith Cato, managed builds take the client with a posture check; unmanaged seats get a clientless portal with RBI rendering pixels only; and DLP keeps source code and customer PII inside approved apps. Everything onramps at the nearest PoP and rides the private backbone to where the apps live — which is why the screen stops lagging.\nAsk the discovery question about the Friday leaver, then pivot into the console.",
      "demo": "Start in the Client Connectivity Policy: one rule for the offshore group — delivery countries only, compliant posture only — and joiners inherit it all by group membership, no tickets. Then Device Posture: the outsourcer's managed build passes; a personal laptop fails — and that failure is exactly what routes the user to the clientless path.\nSwitch to a plain browser and sign in as an agent: only CRM and VDI appear, and with RBI the session renders remotely — pixels on screen, copy and download under policy.\nThen DLP: attempt a source-code upload to personal storage and walk the incident it raises — user, app, file, rule, verdict.\nFinish with the leaver in Access, Users: one change and both client and portal access are gone, with the full attributed history left in Events — the audit trail their end customers keep asking for. Back to the deck."
    }
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
    "hook": "When a contractor starts on Monday, what has landed on their personal device by Friday?",
    "notes": {
      "divider": "Open with the population nobody can manage: contractors on their own laptops, partner staff run by someone else's IT, auditors in for a fortnight. The old answers were ship a laptop, stand up VDI, or say no — and no is how data walks out through personal email.\nLand the Monday-to-Friday hook, then bridge: everything I'm about to show runs from a bare browser — there is no client on this machine at all.",
      "why": "Today you can't install anything on a device you don't own — plenty of partner contracts forbid it — and VPN from a personal laptop leaves corporate data cached on a machine you will never see again. Shipping hardware is slow and costly; VDI is infrastructure nobody thanks you for.\nWith Cato the browser is the endpoint: users authenticate to a portal through the IdP with MFA and see only the apps their group entitles them to. Access is application-level, never network-level — no tunnel, no route, nothing to scan — and DLP and RBI keep files off the device.\nAsk what lands on a contractor's device by Friday, then pivot: an incognito window is all I need.",
      "demo": "Open a private window and say why: bare browser, no client, no enrolment — exactly what a contractor's laptop looks like. Sign in through the IdP with MFA — identity policy stays theirs; Cato consumes it.\nLaunch a published app — streamed through the PoP, no address, no route — then try an unpublished resource by hostname. Land the line: it doesn't fail because a firewall said no; it fails because there is nothing to reach.\nAttempt a download and let DLP block it — same engine, same policy language, scoped by device state — then show Events: sign-in, launches and the block, all attributed to a named user.\nClose on the other on-ramps — the Browser Extension for SaaS at scale, the Enterprise Browser for private apps — same policies, same events, inside the same ZTNA licence. Then back to the slides."
    }
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
    "hook": "Pick one home worker who called last week — could you see their Microsoft 365 experience as a number?",
    "notes": {
      "divider": "Open with the anecdote trap: one person's word against a green dashboard, a ticket closed as no fault found, a day that stays slow. Estate dashboards average that person away.\nFrame the zoom: this use case is one worker, one laptop, one home connection — the granularity tickets are actually raised at. Bridge: I'll take one remote worker's morning and turn it is slow into a named fault domain.",
      "why": "Today the home Wi-Fi, ISP and laptop are invisible to corporate tooling, so the helpdesk falls back on ritual — reboot, speed test, is anyone else seeing this — and the ticket closes as no fault found. And slow is rarely uniform: one app crawling points at the app, everything degrading at the device or last mile — without per-app numbers the two escalate to the wrong teams.\nWith Cato the always-on client is the sensor, nothing extra deployed: every sanctioned app carries a continuous per-user score, and the path decomposes into independently scored segments.\nAsk about last week's caller, then pivot: pick one worker and stay with them.",
      "demo": "In Experience Monitoring, sort Remote Users worst first, pick one person and open the drill-down — frame it as one employee's working day. Read the strip: PoP, ISP, the good-fair-poor split.\nIn Select Application choose the busiest degraded app — for instance Microsoft 365 sitting at Fair on 486 milliseconds average TTFB across five hundred flows while everything else scores Good. Then walk Connection Details left to right: the first non-green node names the fault by published thresholds, not opinion — Wi-Fi is Good at minus 67 dBm or stronger, the last mile under one per cent loss.\nShow the Devices panel and the block events on the score graph — sometimes the slow-app conversation is really a policy conversation.\nClose in the Client Connectivity Policy: always-on, posture, full tunnel — decided once, on day one. That experience is policy output, not heroics; back to the deck."
    }
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
    "hook": "Pick any flow out of your firewall logs — can you name the person behind it, not the IP?",
    "notes": {
      "divider": "Open with the one dependency every deployment shares: before any identity-scoped rule can work, the platform must know who is behind every flow. When identity is wrong the failure is quiet — group rules match nothing, users fall through to defaults, and nobody can see why.\nFrame it as a design review as much as a demo — have the IdP admin in the room. Bridge: four decisions, made once; here's how each looks in the console.",
      "why": "Today their events name IP addresses, so audits stall; rules scoped to groups silently miss whenever a user goes unidentified; and policy migrated before identity is stable breeds per-user emergency exceptions that never get removed.\nWith Cato there is a single user identity — a policy written once is enforced whether the person is behind a site or remote — and the IdP's groups handle joiners, movers and leavers without firewall tickets. Every event carries a name.\nAsk both halves of the discovery question: can you name the person behind any flow in your logs, and how many rules are per-user exceptions? Then pivot to where identity enters the platform.",
      "demo": "Start in Directory Services on the SCIM tab: a base URL and a token are all the IdP needs — it pushes users and groups in near real time. Open a synced group under User Groups — this object is the contract between the IdP and every rule you'll write.\nWalk User Authentication: SSO with MFA staying in the IdP — the PoP validates the IdP's token before issuing its own. Then User Awareness: the Identity Agent reports the logged-in identity about every thirty seconds, so office traffic behind a socket carries a name too.\nFinish in Events with one user — same name behind the office socket in the morning, on the client from home in the afternoon.\nClose on All Unidentified Users as the burn-down list: when it trends to zero, policy means what it says — that's the state you migrate on top of."
    }
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
    "hook": "When a user says an app is slow, how many consoles do you open before you can answer?",
    "notes": {
      "divider": "Open with how the picture gets assembled today — firewall logs, SD-WAN portals, VPN concentrators, carrier reports — and the admission that by the time it's stitched together, it's out of date.\nLand the console-counting hook, then make the architecture point: one console because every flow is processed once, in the cloud, with full context. Bridge: I'll go from a live global map to a resolved incident without leaving the platform.",
      "why": "The today side is four complaints you'll recognise: no idea what's going on in the network, too many overlapping point products with MSPs each owning a slice, performance finger-pointing where every team declares its own layer healthy, and policy drift no console can even show.\nWith Cato the visibility isn't integrated — it was never separate: network, security, user and application context land in one place, so correlation cuts time to detect and integrated tooling cuts time to fix. The same data serves the 2am engineer and the board report.\nAsk how many consoles the last slow-app call took, and how long. Then pivot to the map.",
      "demo": "Open on Topology: the whole estate live on one map — hover a tunnel for real-time latency, loss and jitter. No probes, no collectors; the platform observing itself.\nMove to App Analytics: sanctioned apps beside shadow IT, cross-filtering user, site and application in a couple of clicks — the pivot that normally means opening another product. Then the Threats Dashboard — attackers, geography, MITRE mapping — and drop into Events for the single timeline with policy context: why traffic was allowed or blocked.\nShow the WAN Firewall's shared rule anatomy, then the Audit Trail: every change timestamped and attributable — the governance evidence auditors ask for.\nFinish in Experience Monitoring with the classic slow-app ticket resolved to one off-green segment, no war room. Wrap: correlation cuts detection, integration cuts repair, one rule base ends the drift."
    }
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
    "hook": "Your last multi-site change: how long, how many hands — and how would you have rolled it back?",
    "notes": {
      "divider": "Open with the arithmetic: networks grow faster than network teams — an acquisition adds twenty sites overnight, a retail rollout a hundred in a quarter — and click-ops turns that into head-count or mistakes, usually both.\nAsk about their last multi-site change and let the rollback part hang. Bridge: everything the console does rides one GraphQL API, so I'll show the estate as code — inventory, a reviewed change, and the audit to prove it.",
      "why": "Today every site is a snowflake, bulk change is hours of repetitive clicking, a typo goes straight to production, rollback is somebody's memory, and reporting is a person exporting screenshots monthly.\nAs code: sites are templated resources; policy lives in Git — diffed, peer-reviewed, applied by pipeline, reverted the same way — and because the console itself runs on this API, there is no automation subset.\nBefore pivoting, ask what they automate today — Terraform elsewhere, a SIEM in place — because the message is that Cato joins their toolchain, not replaces it. Then head for the terminal.",
      "demo": "Start in API and Integrations: keys created and scoped here — and make the architectural point that the console is a client of this same API. Anything you can click, you can code.\nDrop to the terminal: install catocli and run one entity lookup — seconds from install to a live inventory of the estate, no SDK, no boilerplate. Then Terraform: plan first and walk the diff together — that review is the governance moment — then apply, noting the API executes sequentially, so parallelism one.\nSwitch to Topology and watch the code-built site land on the live map within minutes — code on one screen, the WAN on the other.\nFinish in the Audit Trail: the change attributed to its key, before and after values recorded. Close on the events feed into their SIEM — deployment, operations and detection from one API — then back to the slides."
    }
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
    "hook": "How many tools and teams does it take you to say whether it's the laptop, the Wi-Fi, the ISP or the app?",
    "notes": {
      "divider": "Open with where these tickets go to die: every segment of the user-to-app path has a different owner, a different tool and a different definition of fine — so mean time to innocence is fast, and mean time to resolution is not.\nAsk the tools-and-teams question and let them count. Bridge: the whole path in one view, per user, with the failing segment measured rather than inferred.",
      "why": "Today's monitoring watches infrastructure the organisation owns — precisely the part a hybrid worker's traffic barely touches — so the war room convenes, each team declares its layer healthy, and IT learns about degradation from the helpdesk queue days late.\nBecause the client, the socket, the PoP and the backbone are one platform, every hop the traffic takes is observed: each node scored independently against published thresholds, and the anomaly engine baselines every site-and-app pair so degradation surfaces before the first call.\nAsk how many tools and teams the verdict takes today, then pivot to the triage screen.",
      "demo": "Open Experience Monitoring and read the account score first — Good means no global problem, so anything degraded is local and findable. Sort worst first: this is the helpdesk queue before it happens.\nDrill into a struggling user and filter to the UC app — each call scored on audio, video and screen sharing from loss, jitter and latency; the console shows what every call actually got. Then Connection Details: one amber node in a green chain — expand it, and loss on both overlay and underlay means the circuit, not the tunnel.\nThen Path Analysis, Command Line: per-hop loss with history — the worked example shows twenty-four per cent loss at the first hop inside the ISP over a thousand probes while the PoP sits clean. That pastes straight into the circuit ticket.\nClose in the Stories Workbench filtered to experience anomalies — raised before anyone reported anything."
    }
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
    "hook": "How many renewal dates does your network estate have in the next 24 months?",
    "notes": {
      "divider": "Open by asking the renewal question — almost nobody knows the number without going away to count, and that's the finding: the estate has grown past the point where anyone can see its whole cost.\nKeep the argument structural, not numeric — fewer boxes, fewer renewals, fewer consoles.\nThe bridge: here's what I'll show you — everything they run as separate products, as one system in one console.",
      "why": "The invoices are only half the story — name the costs that hide: integration engineering to make the vendors coexist, patch windows multiplied across every appliance family, and outage triage where everyone's dashboard is green.\nThen the discovery question's second half: how many consoles does one investigation touch, end to end? Usually more uncomfortable than the renewal count.\nWith Cato, every flow is inspected once, in a single pass, at the nearest PoP — SWG, CASB, DLP and IPS stop being products you deploy and become policy you enable.\nLet me show you what one platform looks like in the console.",
      "demo": "Keep the whiteboard of their stack visible — the whole walk is a running comparison against that drawing.\nStart in Network Rules, then straight into the Internet Firewall without changing tools: both rule bases share the same sites, users and groups — one policy model, not an integration.\nOver to Topology — the whole estate live in one view — then into IPS for the line: in their estate this capability is a purchase order, a box and a renewal; here it's a toggle on traffic already flowing.\nFinish in the Audit Trail, every change attributed in one place, and close on lifecycle: updates land PoP-side, Socket firmware pushes from the cloud on their schedule — no forklift refresh, no end-of-life notice. Back to the slides."
    }
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
    "hook": "Who covers your alert queue at 3 a.m. on a Sunday?",
    "notes": {
      "divider": "The 3 a.m. Sunday question opens on the people problem — most teams cannot staff a credible rota.\nFrame it: every security purchase of the last decade arrived with its own console and its own blind spots, and the SOC inherited all of them.\nBridge: here's what I'll show you — one queue of correlated, ranked incidents, with the evidence and the fix in the same place.",
      "why": "Today, analysts spend the day translating between tools rather than investigating — an endpoint alert here, a firewall log there, and deciding whether they're the same attack falls to a human with a dozen tabs open. Ask the floor-walk question: how many screens would a tier-1 analyst have open right now, and what's the honest mean time from alert to knowing whether it matters?\nThe difference is where XDR starts: most projects begin with a data-collection programme — agents, pipelines, parsers. Here every flow already traverses a PoP, so telemetry is complete on day one.\nLet me show you that as a working queue.",
      "demo": "Open the Threats Dashboard and let it register that nothing was deployed to produce this — no collectors, no shipped logs.\nDrill into a story: one record per suspected incident, not a page of raw alerts — walk the criticality, indication, status, source and targets. The timeline and ATT&CK mapping are the manual correlation their analysts do today, done before anyone opened the ticket; pivot to the user and site without leaving the console.\nClose the loop in the Internet Firewall: the containing rule, same console, no hand-off.\nFinish on the Stories Dashboard sorted by criticality — how a shift starts its day — and if 24×7 came up, land MDR: Cato's analysts working this exact queue overnight. Back to the slides."
    }
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
    "hook": "What would you need to see proven, on your own traffic, to make a decision?",
    "notes": {
      "divider": "Open with the question itself — what would they need to see proven, on their own traffic, for this to end in a decision — and the follow-up matters as much: who, besides them, has to see it?\nWithout agreed criteria, an evaluation drifts into a free trial that never produces a verdict.\nBridge: here's what I'll show you — a PoV shaped to end in a meeting where the question is asked.",
      "why": "Talk through how evaluations really fail: nobody wrote down what proven means, so every session ends with interesting, can we also look at — and the goalposts move weekly. Or weeks pass between contacts and momentum dies just when the evidence was strongest.\nThe fix is a shape: one workshop where every ask is pushed until testable — we want to see our traffic becomes App Analytics shows top applications by user for the pilot site — a thirty-minute sync in the same slot weekly, and a decision meeting booked before anything is built.\nLet me walk you through week one as you'd run it.",
      "demo": "Start with the workshop, homework done: shortlist use cases from the library and pre-draft a criterion for each, so the session edits a straw man. Close by booking two meetings on the spot — the weekly sync and the decision meeting with the economic buyer.\nThen the build: pilot branch connected, Client group enrolled, IdP populating users — identity-attributed evidence is the difference between an IP did this and a named person did this.\nIn Topology, capture evidence item zero — tunnels up, first traffic — dated, into the evidence doc.\nFinish in App Analytics: their apps and users named on screen makes it real on day five, not day thirty — and when the first can-it-also arrives, park it on screen, captured, not dismissed."
    }
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
    "hook": "How long would a complete, correct list of every connected device take you today?",
    "notes": {
      "divider": "Open with the inventory question, and add the sting: how confident would they be that the list is correct? Every control they own assumes they know what's on the network — and that assumption breaks the moment you count the devices that can never run an agent.\nBridge: here's what I'll show you — an inventory that builds itself, passively, from the Sockets already in place.",
      "why": "Name the three failure modes: agentless kit joins the network silently, the CMDB records what was procured rather than what's connected, and the classic fix — an active scanner — is exactly what OT and clinical teams forbid, because an unexpected probe can hang a PLC. Ask whether they're even allowed to scan their OT estate — usually not.\nWith Cato nothing probes anything: the Socket already sits in the traffic path, so devices are simply observed and resolved into the attributes a policy needs.\nDiscovery and enforcement share one vocabulary, so seeing something is one step from segmenting it. Let me show you the inventory.",
      "demo": "Open Device Inventory and let the list speak — it built itself from the Socket that's already there; walk the columns: category, type, model, OS, manufacturer.\nGroup the list by Manufacturer, Type or Site and answer real questions instantly — every IP camera, everything at one plant.\nClick into a device for its Quick View and pick something evocative — a printer talking to the internet, a camera on old firmware — attributes beside its events and the apps it reaches.\nSwitch to the Device Dashboard — IoT and OT counts, the Segmentation Flows Sankey of what these devices actually use — then finish in the LAN Firewall: a rule built from the attributes you just discovered, allow with events first. Seeing to segmenting; the enforcement story continues on the OT security page."
    }
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
    "hook": "How long did your last new site take, order to live?",
    "notes": {
      "divider": "Ask the order-to-live question and let them tell the story — the answer is usually months, and everything you're about to show contrasts directly with that number.\nThe frame: any available last mile in, a private backbone across — MPLS-class predictability without MPLS.\nBridge: here's what I'll show you — a site defined as code, on-net before lunch, with day-one visibility.",
      "why": "The discovery question's second half stings: at a site with one circuit, what happens to voice and ERP when it fails? Today the honest answer is an outage — plus per-carrier tickets for QoS changes, and a middle mile nobody owns.\nWith Cato the Socket bonds whatever links are available — broadband, fibre, LTE — into active/active tunnels, and from the nearest PoP traffic rides a full mesh across multiple Tier-1 carriers with acceleration and loss mitigation built in. Be precise: the five-nines SLA is between PoPs — exactly why dual last miles matter.\nLet me show the whole motion, definition file to live site.",
      "demo": "Start at API and Integrations and run the apply live — one file describes one site, a loop describes fifty; it's the artefact an M&A team hands over.\nOver to Sites: the new site appears seconds later, waiting for its Socket — zero-touch means it ships, plugs into any live link and calls home for its config.\nIn Topology, open the site — two tunnels up, per-link loss, latency and jitter — and if the setup allows, pull a cable and let the call carry on over the second link.\nThen Bandwidth Management: rules keyed to the application and the person, not ports and subnets.\nClose in App Analytics filtered to the new site — day-one visibility, provisioned before lunch — and back to the slides."
    }
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
    "hook": "The deal closes on Friday — when can two companies actually work as one?",
    "notes": {
      "divider": "M&A is where network agility gets tested in public, and when integration takes quarters the business feels every one of them.\nAsk about their last deal — how long before acquired users could reach corporate applications under corporate policy, and what did they compromise on to get there?\nBridge: here's what I'll show you — that deal replayed the Cato way, from a couple of files and one directory integration.",
      "why": "The legacy timeline runs to quarters: circuit orders or contract novations before anything moves, VPN meshes bolted between two firewall estates, hands-on engineering at every acquired site. The identity gap is usually worse — acquired people either wait on a directory trust project or end up sharing VPN credentials, and policy stays written in IP ranges, blind to who's connecting.\nThe contrast is days for the sites and day one for the identities: sites defined as code exist in minutes, and Entra ID provisions the acquired users and groups so a rule can name them immediately.\nHere's the Friday-close scenario, live.",
      "demo": "Frame it: the acquisition closed on Friday; the goal is acquired sites on-net and acquired users reaching corporate apps under corporate policy within days.\nStart at API and Integrations and run the apply — one resource block per acquired site, or a CSV fed into a loop — the same workflow for three sites or three hundred.\nOver to Topology: the new sites sit alongside the existing estate; Sockets ship, anyone plugs them in, zero-touch does the rest.\nThen Access, Users — the acquired workforce synced straight from their own Entra tenant, no manual accounts — and finish in the WAN Firewall with the acquired group named as a source: least-privileged access from the first morning, every allow and block attributed to a username in Events."
    }
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
    "hook": "Which sites could you move tomorrow — and which are stuck because others still need them?",
    "notes": {
      "divider": "Most organisations buying Cato aren't building a WAN — they're leaving one, and the hard part isn't either end state, it's the middle. Land the hook, then add the follow-up: who owns the routing design for the in-between network, and how long do they have to run it?\nBridge: here's what I'll show you — co-existence by design, a datacentre Socket bridging both worlds while sites leave one at a time.",
      "why": "The big-bang trap first: a flag-day cutover puts every risk in one window — one misrouted prefix and every site loses the datacentre, so the migration gets postponed, again. And MPLS terms rarely end together, so the interim network has to work for months, not days.\nThe Cato pattern inverts it: the datacentre takes a Socket first and becomes the bridge, advertising the prefixes of every site still on MPLS; each branch moves as its contract expires, and nothing on the legacy side changes until its circuit is switched off.\nThe two routing tables are the whole trick — let me walk them.",
      "demo": "Open the datacentre site, show its routed ranges: the local range plus the prefix of a site still on MPLS, next hop the MPLS router on the DC LAN — that line is the entire integration; no BGP redesign, nothing changes on the carrier side.\nOver to Topology: migrated prefixes behind their own Sockets, legacy prefixes behind the DC.\nThen play cutover day: assign the range to a new Socket site, delete the static route — that's the whole change window. Live flows in App Analytics prove new and legacy sites keep talking.\nFinish on egress in the Internet Firewall — stay on the DC firewall or break out at the PoP, per site — then the end state: last site moves, delete the route, decommission the router, terminate the contract."
    }
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
    "hook": "After all that interconnect and firewall spend, which console shows branch-to-VPC policy?",
    "notes": {
      "divider": "Open on the spend: ask what the interconnect circuits and cloud firewall licences cost per year, then land the hook — after all of that, which single console shows the policy between a branch user and the production VPC? There usually isn't one.\nBridge: here's what I'll show you — a VPC treated as just another site on the WAN, about an hour from deployment to live.",
      "why": "Every cloud estate shows the same two spending patterns. Premium interconnects deliver a pipe and nothing more — the path carries no inspection — and branch traffic often still hairpins through a physical DC to get there. Cloud virtual firewalls add a second policy stack the customer must size, upgrade and failover-test themselves, with logging the WAN team never sees.\nWith Cato the VPC lands on the same backbone, same policy set and same analytics as any branch, and egress happens at the PoP nearest the cloud region — never the public internet middle mile.\nHere's a cloud site behaving as just another site.",
      "demo": "Start in Topology and let the rendering make the argument: the Azure and AWS sites sit beside the physical estate, drawn no differently. Mention the three ways in — vSocket, IPsec from a cloud-native gateway, or a layer-2 cross-connect at the PoP — mixed by region and requirement.\nOpen the AWS site and show the HA status: primary and secondary vSocket, both tunnelled, automatic failover — against designing, licensing and failover-testing a firewall pair yourself.\nThen the WAN Firewall: a branch group allowed to an app in the VPC — same rule anatomy as branch-to-DC, one rulebase, one audit trail.\nFinish in App Analytics filtered to the VPC — flows fully attributed — and close on economics: no interconnect subscription, no virtual firewall fleet, the next region in about an hour."
    }
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
    "hook": "When Sydney's Teams calls to London go choppy, who do you even call?",
    "notes": {
      "divider": "Open on the complaint everyone recognises — the choppy call with a customer, escalated the same afternoon — then land the hook. Between continents the internet is a chain of providers you hold no contract with, so when the fault sits in the middle mile there's nobody to ring.\nBridge: here's what I'll show you — one backbone doing what global MPLS charges a fortune for, plus the SaaS piece MPLS never covered.",
      "why": "Today it's two poor answers. The public internet hot-potato routes across providers, with peering congestion you can't see and can't escalate — and TCP throughput collapses over long, lossy paths. Global MPLS buys predictability at a price that rules it out and never covered SaaS anyway.\nWith Cato everything enters at its nearest PoP and rides one provider's backbone: TCP terminates locally so window scaling isn't throttled by round-trip time, loss is recovered between PoPs instead of punished with end-to-end retransmits, and SaaS exits beside the app.\nLet me show those mechanics as policy, then prove it with a live call.",
      "demo": "Start in Bandwidth Management: priorities keyed to the application and the person, the same policy enforced at the socket and at every PoP — no per-region QoS to drift.\nThen the live proof: a Teams or Zoom call from the far site, and its drill-down in Experience Monitoring — the latency and TTFB behind the score (scoring lives here, not in App Analytics).\nOver to Topology: separate last mile from middle mile on one screen — the who-do-you-call question answered: was the bad hour the local ISP or the long haul.\nFinish in Network Rules with the acceleration and loss-mitigation toggles — a per-rule decision, not an appliance per region — then close on smart egress: their SaaS app exiting beside the app instance, not head office. Back to the slides."
    }
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
    "hook": "Some flows deserve a wire, not a tunnel — and it should still be just a site.",
    "notes": {
      "divider": "For most cloud estates a vSocket or an IPsec tunnel is exactly right — so start by conceding that. Then name the exception: storage replication, backup, bulk data movement between DC and cloud. Those flows want what a leased line used to give them.\nHere's what I'll show you: a dedicated circuit into the PoP that still behaves like an ordinary site.",
      "why": "Concede the tunnel tax: every tunnel on-ramp rides the internet last mile and pays per-tunnel ceilings plus encryption overhead on every packet. Then ask the page's question — which of their flows run over ExpressRoute or Direct Connect today, and once that circuit lands, which console owns its policy?\nThe alternative is a layer-2 circuit through an exchange fabric — Equinix Fabric or Megaport — or a physical cross-connect from a colo cage: one VLAN coordinated across all parties, nothing to deploy or patch in the path.\nThen pivot: let me show you how little of this the console even needs to know about.",
      "demo": "Open Network, Sites, and the Cloud Interconnect site — type Cloud Datacenter, connection Cross-Connect. Say plainly it's a configuration example, not live traffic — don't promise charts from it.\nWalk the settings and let the absences talk: no socket serial, no tunnel parameters, no appliance. The console needs only the site and its ranges.\nOver to Topology — it sits on the same map as every branch and DC. Then open the AWS vSocket site and show its live analytics: the moment a circuit lands, it inherits this same visibility.\nClose in the WAN Firewall — one rulebase for branch, DC, tunnel and interconnect alike. Back on the slides, set the lead-time expectation: circuits take weeks to months, so the order goes at the front of the project plan."
    }
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
    "hook": "Not every site can take a Socket on day one — none of them has to wait.",
    "notes": {
      "divider": "Open with the honest hierarchy: a Socket is the preferred way to connect a site — but an estate of ASAs mid-migration, in a partner facility or awaiting retirement doesn't have to sit off the backbone while it waits.\nFrame it as scaffolding: same backbone, same security stack, today, on hardware they already own. Here's what I'll show you — the whole Cato side of that design, live.",
      "why": "Be straight about today: sites that can't take a Socket sit off the backbone entirely, and IKEv2 to an ASA fails with TS_UNACCEPTABLE unless you know the quirk — a route-based VTI, or the setting that sends each traffic selector separately. Knowing that is credibility in the room.\nWith Cato they get dual tunnels on fixed allocated IPs at two PoPs — deterministic, easy for change control to approve — and everything built here survives the later Socket swap.\nAsk: is the ASA staying, or is IPsec a bridge? If the site still exists in eighteen months, what stops a Socket landing there? Then move to the console.",
      "demo": "Start in Topology: the IPsec site sits beside Socket and vSocket sites — the connection method differs, the platform doesn't.\nThen Site Settings, IPsec: primary and secondary tunnels, two allocated IPs at two PoPs. Land the line that this is the whole Cato side — their ASA config is usually the longer half.\nOpen Connection Status for live phase one and two state; if a change window allows, drop the primary and let the room watch routes move — allow up to thirty seconds for detection.\nFinish in Events: tunnel connects and firewall verdicts in the same schema as every other site, carried over unchanged when the ASA becomes a Socket. Close on the wave plan — which sites swap first, which stay IPsec, and until when."
    }
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
    "hook": "Where does the business open next — and why should the network take quarters?",
    "notes": {
      "divider": "Before this slide, ask two questions: where does the business open next, and what happened last time — how long the circuit took, who staged the firewall, who flew out. Run everything against their next market, not a hypothetical.\nThe frame is simple: the commercial team signs a lease in weeks, then IT becomes the reason the site opens late. Here's what I'll show you — that next site built live.",
      "why": "Today every region restarts the same build: carrier contracts on someone else's lead time, firewalls purchased and shipped, an engineer on a plane. And China concentrates all of it, with a compliance dimension a DIY VPN overlay only makes worse.\nThe difference is that the infrastructure already exists in region — the PoP is there before they are, full stack inside — so expansion becomes onboarding, not a build.\nAsk the page's questions: which markets in the next twelve to eighteen months, and when a site opens somewhere with no engineers, who racks the kit? Then build the site live.",
      "demo": "Create their next market live in Network, Sites — name, country, socket model, native range: a policy object in minutes, before any kit is ordered. Narrate the claim flow — the socket ships, anyone plugs in power and WAN, it pulls its config. Nobody technical travels.\nOpen the Sydney site on IPsec with no Cato hardware at all: the landing team works on the Client while the socket is in transit.\nShow the spread in Topology, then the Internet Firewall — no rule names a region; the global policy applied at first connect. Finish in App Analytics: the new region measurably usable, not just connected.\nClose on China off-console — compliant connectivity through in-country presence with licensed local partners; scope specifics with the Cato China team."
    }
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
    "hook": "When did someone last deliberately pull a link to prove the failover works?",
    "notes": {
      "divider": "Open with the inevitability: every site fails eventually — a digger through the fibre, a dead power supply, a PoP out of rotation. The framing that lands is that resilience is a design decision made per site class: a kiosk shouldn't get the same design, or the same spend, as a datacentre.\nHere's what I'll show you — what that design looks like in the console, and how you prove it works.",
      "why": "Most availability conversations start with an SLA percentage and end with an invoice — and a failover nobody has deliberately tested is a diagram, not a design. That's the today side.\nWith Cato there are four distinct failure domains, each with its own building block: last mile, Socket hardware, PoP, and total off-cloud — so resilience and cost get matched to how much each site actually matters.\nAsk the page's question: which of your sites could you genuinely not afford to lose for a morning — and when did someone last deliberately pull a link there? Then go and look at a real site's link design.",
      "demo": "Open a branch site's Socket configuration and read the link design: precedence one active, two passive, three last resort — the LTE link carries almost nothing while idle, so the cellular bill stays near zero.\nThen Topology: open an HA site and walk the three indicators behind Ready — Connected, Keepalive, Compatible Version. Anything not green is a ticket, not trivia.\nNow the proof: pull the primary link in a change window and watch flows re-home to the surviving one — per-second scoring on loss, jitter and latency moves them before users open tickets; on an HA pair the standby takes over after three seconds of missed keepalives.\nFinish in Events — link down, SLA violations, failover: the change-record evidence and the alerting feed. Re-run this after every ISP change or Socket upgrade."
    }
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
    "hook": "If the till can't authorise a card, the store stops selling.",
    "notes": {
      "divider": "Open with the till: in retail the store network is the revenue path, yet it's usually the least engineered part of the business — flat LANs assembled refit by refit, behind one consumer broadband line.\nPCI DSS 4.0 raises the bar on proving controls operate continuously, not just before the assessor arrives. Here's what I'll show you — one store's build, and why it scales to hundreds without an engineer visit.",
      "why": "On a flat network the guest Wi-Fi, cameras and signage sit beside the payment devices, so everything gets assessed with them — and evidence is weeks of screenshots, stale the day after collection.\nThe answer is segmentation enforced at the store edge, LTE keeping the tills authorising through a broadband cut, and evidence that becomes a console export.\nAsk their questions: how many networks does a typical store run — and are they actually separate, or just SSIDs on one LAN? What did the last assessment's evidence collection take in weeks and teams? Hold one caveat — scope reduction is the QSA's call. Then walk the store.",
      "demo": "Narrate the estate in Topology: imagine each of these is a store — same Socket, same VLAN plan, same policy.\nOpen the site's Networks — POS, guest, staff, cameras — and make the zero-touch point: plugged in by store staff, configured centrally.\nIn the LAN Firewall, show guest blocked from the POS VLAN at the store edge and point at the hit counters — enforced and counted, not a diagram claim. Then the LTE site: describe pulling broadband and the tills keep authorising — a quiet alert instead of a store that can't sell.\nClose in the Audit Trail and Events: policy, its enforcement and its change history from one console — the pack they spent weeks assembling last time. After every rule, repeat: defined once, applied to every store."
    }
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
    "hook": "Should this refresh be the last one you ever run?",
    "notes": {
      "divider": "Get the specifics before you start: which models hit end-of-support and when, what the renewal quote says, how painful the last estate-wide change was — then run everything against those numbers.\nThe frame: a refresh is the one moment doing nothing isn't an option, which makes it the natural moment to ask whether this one should be the last. Here's what I'll show you — the firewall as a service, not a device.",
      "why": "The treadmill has three taxes: the sizing gamble against a multi-year traffic guess, the capex-and-rollout programme measured in months, and the lifecycle drag of firmware and change windows until the next EOL notice. TLS inspection quietly stays off because it pushes a correctly sized box off a performance cliff.\nWith Cato, enforcement moves to the PoP: capacity scales in the cloud, Cato owns the patching, new capabilities arrive as software.\nAsk what the annual support renewal costs across the estate, and how long the last policy change took to reach every site. Then open the rulebase they'd inherit.",
      "demo": "Open the Internet Firewall and walk the ordered rulebase — allow and block by identity, group, application and category — then say it explicitly: this is the whole estate's internet policy, and there is no box behind it.\nMove to the WAN Firewall — the segmentation their DC pair does today, in the same rule grammar. Then TLS Inspection: the switch that halves appliance throughput is a policy decision here.\nIn IPS, tell the virtual-patching story: protections for new critical CVEs deployed by Cato Security Research, no customer change window — unpatched assets shielded while ops patch on their own timetable.\nThen prove it: block a risky category, save, and filter Events to show the rule enforcing across regions within seconds. Close on the renewal quote."
    }
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
    "hook": "DORA doesn't ask you to be resilient — it asks you to prove it.",
    "notes": {
      "divider": "Before the slide, find the pressure point: ask where their DORA gap analysis hurts most — resilience-testing evidence, incident-report assembly, or the sheer size of the third-party register — and lead with that pillar.\nDORA has applied since 17 January 2025, so this is a live programme, not a future one. Here's what I'll show you — evidence for each pillar, from one console.",
      "why": "Today the stack works against them four times over: every point product is another ICT third party to assess and register, resilience is a chain of single points of failure, the incident timeline is scattered across consoles with different clocks, and proving a control applies everywhere is guesswork.\nWith Cato, resilience is the architecture's default and every flow feeds one telemetry plane — the same platform that fails over also produces the evidence.\nAsk who owns the programme and how long a report-grade timeline takes to assemble today. Mind the wording: Cato supports a DORA programme — it never makes anyone compliant. Now to the console.",
      "demo": "Start in Topology: dual uplinks, HA state, each site's connected PoP — failover with no operator action. That's the resilience pillar in one view.\nThen Experience Monitoring, positioned as the test-evidence tool: run a controlled failover window and capture what users actually experienced before, during and after.\nOpen a detection in the Threats Dashboard and pivot into its XDR story — correlated events, affected users, a timeline: the skeleton of a regulator-facing report, assembled for you, not by you. Drill into Events for the same window: every flow and verdict on one clock, attributed to a user — no logs collected from firewall, proxy and VPN separately.\nClose in the Audit Trail — who changed which policy, when, exportable — then count the displaced vendors and offer the published certifications as one due-diligence pack."
    }
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
    "hook": "Pick one rule — is it enforced identically in Glasgow, in Dubai and at home?",
    "notes": {
      "divider": "Open by asking how many devices a single policy change touches today, and how remote-user policy relates to site policy — the punchline lands hardest against their own numbers.\nThe frame: most estates don't have one security policy, they have dozens, each drifting with every change window. Here's what I'll show you — one rulebase, and the same block landing in the office and at home.",
      "why": "Today policy lives in the boxes, and every box is a separate source of truth — versions drift, and attackers only need to find the weakest enforcement point.\nWith Cato, policy is a cloud object: defined once, enforced by every PoP, written against IdP groups and posture profiles rather than IP addresses — an HR move in the directory changes access with no firewall change request.\nAsk their question: pick one rule — blocking uploads to personal cloud storage, say. Is it enforced identically in Glasgow, at home, in Dubai — and how long would proving that take? Then prove it live.",
      "demo": "Walk the Internet Firewall and point at what's absent: no per-site, per-appliance or per-region policy exists anywhere in the product. Rules are scoped to groups and posture — this is the policy, for everyone.\nOpen a user under Access and run the thought experiment: change their department in the directory and every rule referencing the group follows. Device Posture adds the second dimension — identity says who, posture says from what, both continuous.\nMake one change live — block a risky category for a group — and save: that is now the policy at every PoP, no push jobs, no maintenance window. Trigger it behind the site socket, then again on the Client from home.\nFinish in Events filtered to the user: both blocks side by side, same rule, same identity — one answer for the auditor."
    }
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
    "hook": "Can you list every device on your plant floor right now?",
    "notes": {
      "divider": "Before you open, ask which frameworks they align to — Purdue, IEC 62443 — and which vendors dominate their floor; you'll build the demo rule on their answer.\nThen land the hook: plant devices arrive with the machinery, get plugged in by integrators and stay for decades, and none of them can run an agent. Here's what I'll show you — every one of them found, named and put under policy.",
      "why": "Today's picture: no inventory anyone trusts, patch windows measured in months because production uptime always wins, and flat networks where one compromised camera can move laterally towards the SCADA layer.\nWith Cato, discovery is passive — no agents, no scanners, no disruption — and the attributes it finds become policy objects: a rule can target every PLC, or every Siemens S7-300, and it follows the device as it joins the network. Segmentation lands on the frameworks OT teams already use.\nAsk their question back: if one camera were compromised today, what stops it reaching the SCADA servers or calling out to the internet? Then open the inventory.",
      "demo": "Start in the Device Inventory: category, type, model, OS, manufacturer — classified passively from traffic. Map the screen to Purdue levels as you go: PLCs at the bottom, HMI and SCADA above, enterprise IT at the top.\nBuild the rule live in the Internet Firewall — Manufacturer Siemens, Type PLC, block internet egress: any matching PLC at any site, now or in future, inherits it automatically.\nIn the WAN Firewall, walk the segmentation — HMI to PLC on control protocols, cross-level denied by default, the same logic enforced on-LAN by the Socket — then the vendor scoped to the jump server only.\nClose in Events with live hit counts, every block attributed to a device rather than an IP — and the discipline line: on a plant you monitor first; a false positive stops a machine, not a web page."
    }
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
    "hook": "When DLP flags a credit-card leak, can your analysts see what actually matched — and prove who looked?",
    "notes": {
      "divider": "A DLP alert fires and nobody can say whether it is a real leak or noise — the tool names the rule, not the data. Worse, the evidence you would need to decide is itself sensitive, so careless capture creates a second copy of the leak.\nHere's what I'll show you: an investigation that never leaves the console — the block, the secured evidence, and proof of exactly who looked.",
      "why": "Today the analyst sees rule, user and application but never the content that matched, so real leaks get dismissed as noise while false positives trigger full incident-response fire drills.\nWith Cato the snippet — up to the full 20 MB file — lands encrypted in an S3 bucket in the customer's own AWS account, under a key unique to their account, readable only with the right role, and every view is audited.\nAsk the room: when DLP flags a credit-card upload, can your analysts see exactly what matched, and prove afterwards who looked? Then move to the console and stage one live.",
      "demo": "Open in DLP Configuration: the forensics integration toggle — and note that even switching it on is an audited change.\nNow play the user: upload a document seeded with card numbers to Copilot and let the block land on screen — at that same moment the encrypted snippet is written to the bucket.\nMove to the Data Protection Dashboard and click View Forensics on the block you just caused — one hop into the data incident, no second console. Walk the detail, then View Evidence, pausing on the locked panel: deliberate, role-gated, logged — exactly what a DPO will probe.\nClose in the Audit Trail with your own evidence view on the record — leak confirmed, impact known, access proven — then back to the deck."
    }
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
    "hook": "When the next critical CVE lands on a service you publish, how long are you exposed before you can patch?",
    "notes": {
      "divider": "Every estate still publishes something — a partner portal, a B2B API, a legacy web app — and each one is under automated attack from the moment it goes live, defended by appliances with their own patch cycles and downtime windows.\nHere's what I'll show you: the service published while the site stays dark, attacks absorbed at the PoP, and protection that arrives faster than any patch window.",
      "why": "Today an exposed service means a DMZ, a WAF and a reverse proxy — and a race every time a critical CVE lands, because patching needs downtime the business will not give. Auditors add pressure: the frameworks all want demonstrable controls over public-facing services.\nWith Cato the world sees one allocated IP at a PoP and every request is scrubbed there before it reaches their equipment — and the signature set is built for exactly this: 93 per cent of CVE signatures protect inbound.\nAsk what they publish today and how it is protected, then anchor the walk-through to the service they name.",
      "demo": "Start with the allocated IP at the PoP nearest the room — London for a UK audience: this one static address is all the internet ever sees.\nBuild the Remote Port Forwarding rule to a lab web service, showing source filtering — by IP or country — if it is partner-only.\nIn IPS, confirm inbound protection is on: signatures written and deployed by Cato Security Research, nothing for the customer to patch.\nProve the legitimate path from a phone hotspot, then open Events against the IP — real scanner traffic collects quickly, every verdict an attributed event.\nFinish on the public Rapid CVE Mitigation page: detect-to-protect in nought to two days, no downtime, no change on their side."
    }
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
    "hook": "When the auditor asks for proof a control worked last quarter, how many consoles do you have to open?",
    "notes": {
      "divider": "Open with the stakes: compliance is a condition of trading — it decides whether customers sign, whether regulators stay satisfied and whether an insurer will underwrite the cyber risk. The pain is rarely the framework itself; it is the dozen consoles the evidence lives in.\nHere's what I'll show you: the controls and the audit evidence coming from one place, ready to hand to an auditor.",
      "why": "Today the same policy takes weeks to configure across every tool, shadow SaaS makes compliance impossible to attest, and every audit is a correlation project. With Cato every flow is inspected once at the PoP and every decision lands in one management plane — the difference between owning tools and producing evidence.\nBe straight about the boundary: the ISMS clauses stay customer-owned — Cato is the engine inside it, never a substitute for governance.\nThen ask: which framework is driving you right now, and when the auditor wants proof a control worked last quarter, how many consoles do you open? Their answer is your segue into the console.",
      "demo": "Open on the Cloud Apps Dashboard and let the app count talk — sanctioned, unsanctioned, risk-scored: you cannot govern what you cannot see.\nDrill into one app's catalogue entry: its risk score and the certifications the vendor holds — supplier due diligence cut from weeks of questionnaires to a lookup.\nIn DLP Configuration, walk the rule blocking cardholder data to unsanctioned apps, and narrate it in the auditor's language: information classification and transfer control.\nSwitch to the Data Protection Dashboard for proof — events over time, top rules, users and apps: the control-effectiveness evidence clause 9 asks for.\nEnd in the Audit Trail — one attributable change record for the whole stack — and close on scheduled exports: one evidence pack, not a quarter of screenshot-gathering."
    }
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
    "hook": "How many cloud apps are in use right now — and which of them hold your customers' PII?",
    "notes": {
      "divider": "Before this slide, ask which SaaS apps they have sanctioned — and which they suspect are in use anyway. The business is adopting cloud and AI apps faster than security can see, and the most sensitive processes are moving with the data.\nHere's what I'll show you: the whole app estate discovered from traffic alone, then control that follows the data — allow the app, block the risky activity, stop the sensitive upload.",
      "why": "Today nobody can answer the PII question with confidence: new shadow apps surface weekly, users with local admin install whatever gets the job done, and data drifts into personal storage and GenAI tools unchecked. With Cato nothing new deploys — traffic already crosses the PoP, so CASB and DLP simply switch on where the data flows: inline for live traffic, out-of-band for data at rest in sanctioned tenants.\nAsk it plainly: how many cloud applications are in use right now, and how long would it take to say which hold customer PII? Then open the dashboard and answer it for them.",
      "demo": "Open the Cloud Apps Dashboard and set the discovered estate against what they expected — the gap is the shadow-IT conversation, sharpest when an app they never named appears.\nDrill into App Analytics for one risky GenAI or file-sharing app: the risk score, what feeds it, who is using it.\nIn CASB, bring it under control — allow browsing, block uploads, or hold it to a pilot group: activity control, not crude deny.\nThen DLP Configuration: block credit-card uploads to unsanctioned destinations using the pre-built PCI, PII and PHI profiles — one policy across web, SaaS and on-prem.\nFinish in Events on the data incident — user, app, matched data types, secured evidence — and bridge to the DLP forensics story if they want the investigation depth."
    }
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
    "hook": "If ransomware detonated in a branch tonight, what stops it reaching your backups before anyone sees the beacon?",
    "notes": {
      "divider": "Frame ransomware as a chain, not an event: access, payload, command and control, lateral movement, exfiltration, encryption — and every link has to cross the network. The attacker needs all six to work; the defender only needs to break one.\nHere's what I'll show you: six independent controls meeting six stages at the PoP, and the moment fifty alerts become one story.",
      "why": "Today the chain wins through the gaps — a remote user split-tunnelling past the appliance, branch breakout, OT devices that cannot run the agent — and the weak signals that do fire sit in tools that never talk to each other.\nWith Cato there is no unexamined path: every flow crosses the SPACE engine, and XDR correlates the fragments into one MITRE-mapped story natively.\nThen the discovery question: if ransomware detonated on a branch laptop tonight, what stops it reaching the backup servers — and would anyone see the C2 before the encryption starts? Go and break the chain on screen.",
      "demo": "Open the Threats Dashboard and frame it: everything here was caught because the traffic had to cross a PoP — no behind-the-firewall.\nThen the live block: as a remote user, download the harmless EICAR file and show the block page and its event — novel variants take the same path into the sandbox.\nFilter Events to IPS and open a real exploit attempt with its CVE named: that protection was live at every PoP before anyone booked a patch window.\nOpen the XDR Stories Workbench — one incident, a timeline, affected users, MITRE mapping. This is the fifty-alerts moment; let it land.\nFinish on the WAN Firewall rule guarding the backups, hit counts proving enforcement, and close on who watches at 03:00 — MDR on the same platform."
    }
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
    "hook": "What percentage of your web traffic is actually decrypted today — and who decided what slips through?",
    "notes": {
      "divider": "Open with the dependency, not the feature: nearly everything is encrypted now, so SWG, CASB, DLP and AI governance reach full fidelity only on decrypted traffic — and big-bang decryption breaks things and burns trust.\nHere's what I'll show you: a rollout that stages safely — certificates first, a monitored pilot, and exceptions that are governed rather than silent.",
      "why": "Today controls judge encrypted traffic by the handshake — a domain name and a certificate — while pinned apps and QUIC slip past with nobody deciding. The fear is legitimate: the estate holds a long tail that genuinely breaks under decryption.\nWith Cato the posture is inspect by default, bypass by exception — a staged rollout finds the breakage on your terms, and every exception becomes a bypass rule with an owner and a review date.\nAsk the page's question: what percentage of web traffic is actually decrypted today, and who decided what slips through? Then open the rule base.",
      "demo": "Start in TLS Inspection and walk the shipped rule base: first-match ordering, uneditable bypasses at the top — Android, Linux, unknown OS, the maintained pinned-app list — and the implicit final rule inspecting everything unmatched.\nRun the Configuration Wizard live: five recommended rules applied in minutes — data-driven, not a services engagement.\nIn Certificate Management, show the trust anchor — default Cato certificate or their own CA's — the artefact the MDM team distributes first.\nThen a pilot user's browser: the padlock issuer reads Cato Networks plus the PoP, and a blocked HTTPS site renders a clean branded page, not a scary warning.\nClose in Events — inspected, bypassed and QUIC-blocked flows all visible — and land the wrap: this is the fidelity prerequisite every other demo stands on."
    }
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
    "hook": "Your next Cyber Essentials renewal lands under Danzell — MFA and 14-day patching are now auto-fail questions.",
    "notes": {
      "divider": "Open with the date: since 27 April 2026 every new Cyber Essentials assessment runs under the Danzell question set, and two answers became automatic failures — MFA on cloud services and 14-day patching. A tightening, not a rewrite, but it lands on their next renewal.\nHere's what I'll show you: one boundary answering for the whole estate, and the assessor pack assembling itself from one console.",
      "why": "Today a public-body estate — civic centre, depots, libraries, schools, plus a hybrid workforce — means a boundary per site, configurations that drift, and assessment evidence scattered across a rack of consoles and spreadsheets. With Cato every site and worker crosses the same default-deny policy at the PoP, and a whole class of security infrastructure leaves the 14-day patching scope.\nAsk which conversation is in front of them this year — a CE renewal under Danzell, or a CAF-based assessment such as GovAssure or the CAF-aligned DSPT. Position with care: Cato supports the work; it never makes anyone compliant. Then open the mapping.",
      "demo": "Start on the mapping tables and read the what-stays-with-you column out loud — agreeing what Cato does not cover buys credibility for everything after.\nThen the Internet Firewall: one ordered, default-deny rule base fronting the civic centre, every depot and school, and each home worker — the firewalls theme answered once, not per box.\nInto the Audit Trail: who changed which rule, when, from where, exportable — secure-configuration evidence and CAF governance on one screen.\nOpen a Device Posture profile — encryption, anti-malware, OS version — gating access continuously: user access control a CE Plus assessor can watch operating.\nFinish in Events, one stream with one clock, and assemble the pack on screen — policy export, posture, events, audit trail — one console instead of a screenshot hunt."
    }
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
    "hook": "If a key supplier were encrypted tonight, which clinical systems keep working — and what could their credentials reach?",
    "notes": {
      "divider": "Anchor on the incident the room remembers: in 2024 a pathology supplier was encrypted, two London trusts postponed more than ten thousand outpatient appointments, and blood testing fell to a tenth of normal. A supplier compromise became a patient-safety incident — cyber risk in health is clinical risk.\nHere's what I'll show you: segmentation enforced at the Socket, the unpatchable device estate made visible, and a supplier confined to exactly one system.",
      "why": "Today it is the estate WannaCry exposed: flat networks beneath clinical systems, unpatchable devices on VLANs nobody can map, supplier credentials reaching far beyond the system they support.\nWith Cato the LAN Firewall enforces segmentation on the Socket itself — it holds even if the circuit drops — Device Inventory classifies the IoMT estate from traffic with no agents, and DSPT evidence assembles as a by-product of operation.\nAsk the page's questions: if a key supplier were encrypted tonight, which clinical systems keep working — and could you show an auditor, from live data, which VLANs an unpatched imaging device can reach today? Then go and show them.",
      "demo": "Frame with the DSPT mapping table, conceding Objective E to information governance — honesty that buys the segmentation story.\nOpen Device Inventory for a hospital site — devices classified from traffic, no agents — and ask: which of these did clinical engineering know were on this VLAN?\nThen the LAN Firewall: scoped per site and VLAN, enforced on the Socket — IoMT held to named integration flows, corporate blocked from clinical, still enforced if the internet drops.\nShow a posture profile gating a remote clinician — the NHS MFA policy worded exactly: MFA on all remote access to all systems.\nFinish in the WAN Firewall as a supplier engineer: reach the one permitted system, attempt another, show the attributed block — then events and the audit trail: the pack assembling itself."
    }
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
    "hook": "What stops a fee-earner on Matter A reaching Matter B's workspace over the network — and could you prove it?",
    "notes": {
      "divider": "Open with the firm's own claim: the wall is declared in the conflicts system and enforced in the DMS — but underneath, both matter teams share the same flat LAN and VPN. The courts' test since Bolkiah is no real risk of disclosure — hard to argue from one application layer.\nHere's what I'll show you: the wall as network policy, identity-based, enforced wherever a fee-earner works, and provable.",
      "why": "Today the obligations are impeccably documented and the estate undermines them: walls stop at the DMS, panel reviews cost partners fee-earning days on questionnaires, and when a lateral leaves for opposing counsel nobody can prove, with timestamps, when access died.\nWith Cato a wall is a rule pair over the implicit deny, scoped to IdP groups, so it holds at the office, at court and at home; DLP stops privileged-class material heading for personal storage; every decision lands as evidence.\nAsk: what stops a fee-earner on Matter A reaching Matter B's workspace over the network, and could you prove it? Then build the wall in front of them.",
      "demo": "Start on the obligation map and read the stays-with-the-firm column aloud — agreeing what Cato does not do buys the room.\nIn the WAN Firewall, build the wall as a rule pair for the two matter groups over the implicit deny, and point at the source column: identity, not geography.\nAttempt cross-wall access as a walled user and filter Events to that identity — rule, user, time: effective measures as evidence, not assertion.\nThen DLP Configuration: the built-in Legal classifier blocking privileged uploads to personal cloud — agreements, patents, court documents — and say honestly that scoping is group and data-type based, not per-matter.\nClose in the Audit Trail: change history plus the timestamped revocation when a leaver's groups are removed — the questionnaire answering itself from one console."
    }
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
    "hook": "If someone pasted customer PII into a chatbot yesterday, could you produce the prompt today?",
    "notes": {
      "divider": "Open with the question on the slide and let it sit — most rooms cannot answer it. Then widen it: it is really three questions. What are your people pasting into chatbots, what have your developers built on top of LLMs, and what are your agents doing with the access they were given?\nSay you will show one platform answering all three, and step into the walk.",
      "why": "Talk it as a governance gap, not a tech gap: GenAI adoption has outrun governance almost everywhere, and the three surfaces — users, applications, agents — usually belong to nobody.\nThe point to land on the Cato side is architectural: AI security here is not a bolt-on product, it is another set of policies evaluated by SPACE, the same single-pass engine already carrying their traffic — so discovery, prompt-level auditing and enforcement arrive with no new appliances and no re-plumbing.\nAsk the page's sharper version: which GenAI tools are your users signed into right now? Then pivot — let's go and find out in the console.",
      "demo": "Start in the Cloud Apps Dashboard, filtered to Generative AI — who uses what, how much data moves — and let the gap between sanctioned and found speak. In CASB, open one discovered tool's catalogue entry — data handling, compliance posture, risk score — to ground which apps deserve sanctioned status.\nStay in CASB for the rule and stress activity-level control: permit prompting, block the upload. Then DLP Configuration: inspect prompts and uploads for PII and payment data — the blocked card upload on the DLP forensics page is your proof point.\nClose on the Data Protection Dashboard, where discovery becomes an ongoing governance report. For homegrown apps and agents, talk to the focus-area cards rather than demoing live — that edge is still firming up."
    }
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
    "hook": "A no-cost four-week assessment: your real GenAI usage discovered, nothing blocked, board-ready report at the end.",
    "notes": {
      "divider": "Lead with the shape of the offer before any product: four weeks, led by a Cato engineer, entirely in monitor mode, currently at no cost for a limited time — nothing to deploy, nothing to break.\nFrame it as the answer to a CISO's bind: deliver AI's upside without a leaked prompt making the headlines. Then bridge: here is what the weekly syncs actually look like on screen.",
      "why": "The pressure comes from three directions at once — boards mandating adoption, regulators expecting AI to be known and governed, customers needing trust — and blocking wholesale just routes the business around you.\nThe assessment threads that needle because everything it uses is native to the platform: TLS inspection, CASB and DLP, and the AI Interaction Policy in monitor mode, so traffic flows exactly as before. The meeting load is one deployment call, two half-hour syncs and a wrap-up.\nAsk the audit version of the page's question: could you evidence GenAI usage against NIST or HIPAA tomorrow? Then pivot — everything from here is live console, not slideware.",
      "demo": "Open where the week-two sync opens, on the Overview — the reference numbers here are a 22.8 percent violation rate across 22.2 thousand interactions, broken down by policy. Move to Discovery for the inventory: every app with users, interactions, risk rating and the interceptor that saw it — and separate embedded AI early, or a sanctioned copilot's twenty-one thousand interactions will drown the shadow rows.\nAI Users puts names to the numbers: per-user trends and violation rates — the evidence that starts the acceptable-use conversation. The Data Protection Dashboard is the week-three story: monitor-mode matches only, PII leading, nothing blocked.\nFinish in Reports with the GenAI Report — a usage page and a data-protection page — the wrap-up artefact, then route the next step against the five-stage journey."
    }
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
    "hook": "Which GenAI tools were used last week, by whom — and what was pasted into them?",
    "notes": {
      "divider": "Start by asking what their AI policy actually is today. The usual answer is that they blocked a chatbot — and that sets up everything, because a ban does not stop use, it moves it to personal accounts where you cannot see it.\nFrame the goal as safe enablement: keep the productivity, control what leaves in each prompt. Then bridge: here is that capability live, from discovery through to the audit trail.",
      "why": "Contrast the two worlds honestly: the web filter judged a domain once per category and never saw what was pasted in — yet the risk lives in the prompt, and the same app can be fine for one prompt and a breach for the next.\nPrompt-level control gives a decision per interaction, and anonymisation is the unlock: sensitive values masked in flight while the prompt is still answered, so nobody drifts to a personal account.\nLand the page's sting: if you can name the tools but not what was pasted into them, you have visibility of domains, not of data. Then pivot to the console.",
      "demo": "Open on the Overview tiles and let adoption rate prove this is mainstream behaviour, not a fringe habit. Follow the latest-application widget into the shadow inventory, stressing how it was built: from traffic already crossing the platform, nothing deployed, prompt content untouched.\nOn AI Users, sort by violations and drill one person — apps used, adoption over time — the evidenced conversation to have with a department head. In the User Interaction Policy, walk one rule: source, apps, engine profile, the four actions, a notification template — and name the prerequisite out loud, TLS inspection at account level.\nShow the recommended DLP profiles against the Generative AI Tools category as the upload backstop, then close in Events: attributed, exportable — the audit trail they walked in without."
    }
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
    "hook": "How many AI agents are running in your environment right now — and what did each do yesterday?",
    "notes": {
      "divider": "Before anything on screen, ask what triggered this conversation — a developer-tools audit, a copilot-platform rollout, an incident — and who owns agent risk today; the honest answer is usually nobody.\nFrame the stakes: agents act at machine speed with someone's delegated permissions, and published attacks like EchoLeak and CurXecute arrived through tool responses, not prompts. Then bridge into the walk: discover, observe, govern.",
      "why": "Three problems compound: sprawl — nobody holds an inventory of agents or the MCP servers they touch; delegated identity — an agent carries the launcher's access to repos, file systems and CRM; and injection that can hide in what an agent reads, not just what it is asked.\nThe distinction to draw is the three agent types — local on endpoints, managed on platforms like Bedrock or Copilot Studio, and custom code — secured differently, governed in one workflow across four inspection points: prompts, outputs, tool calls and tool messages.\nPivot: start with discovery, because you cannot govern what you cannot list.",
      "demo": "Open Scout and land the deployment story: a script pushed by MDM — Intune, Jamf or Kandji — with no TLS inspection, proxy or browser extension involved. Move to Local Agents: every instance with user, tools and last seen, shadow copies flagged from personal email addresses; drill one to its MCP servers and mark a dubious tool unsanctioned — that classification feeds straight into policy.\nIn Agent Sessions, open a session with a violation tag and narrate the timeline: the payload arrived in a tool message, not a prompt, and policy intervened right there. Flip to Schema for the call graph.\nClose on Integrations: managed platforms connect by API, custom agents by repointing their LLM base URL at the AI-FW proxy — same Guards, same audit, one model for every agent."
    }
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
    "hook": "If someone typed 'ignore your system instructions' into your chatbot tonight, what component stops it?",
    "notes": {
      "divider": "Ask the app or platform team what AI they have shipped or in flight — which models, whether a gateway like LiteLLM is already in place, and who fielded the last question about whether the chatbot is safe.\nFrame the gap: a model key, a system prompt and a vector store go live in a sprint; runtime protection usually never ships. Bridge: here is a Guard in that interaction path, end to end.",
      "why": "The risks are the ones the OWASP LLM community keeps top of its list — injection and multi-turn manipulation, leakage from connected CRM and HR data, regulated topics the app must not advise on, and no audit trail when someone asks what the bot told a customer.\nThe answer is a Guard between the app and its models, deployed three ways — inline proxy, an API verdict the app enforces itself, or through an existing AI gateway — so integration is an afternoon, not a re-architecture.\nExtend the hook with the page's second half: where would you find the record of the attempt tomorrow morning? Then go live.",
      "demo": "Open a guard and walk the three types, then the details page — endpoint, headers, keys and the sample request code a developer pastes in; that page is the integration story. Move to the interaction policy: engine profiles grouping detectors — identifiers, secrets, injection, regulated topics — mapped to Block, Anonymize or Monitor per guard and direction; when rules collide, the stricter action wins.\nIn the Playground, run the jailbreak scenario live, then a custom prompt with a fake National Insurance number — adjust a confidence level and re-run; this is the rehearsal space their team keeps.\nClose in the Interaction Explorer: drill the session — detections, verdicts, the engine's analysis report — the audit trail their app lacks today."
    }
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
    "hook": "Your fee-earners use GenAI on client matters today — could you show a client how it is controlled?",
    "notes": {
      "divider": "Open with the firm's own policy: what is it today? The common answer is that everyone was told not to use public chatbots — a ban with no visibility, which sets up the whole story.\nThen ask whether any client's outside-counsel guidelines already mention AI; there is usually at least one, and it makes the per-matter point for you. Bridge: here is discovery through to client-facing evidence.",
      "why": "Keep it in the profession's language: a prompt naming a client is a transfer of confidential information to a model the firm never assessed — the SRA's Risk Outlook says exactly this, and the firm stays responsible for the outcome regardless.\nA ban fails twice: use moves to personal accounts, and the recruitment edge moves to firms that found a safer answer. The unlock is scoping — policy sources are IdP groups, so one client's no-AI clause and another's AI-with-redaction terms can both be true at once: the ethical wall, applied to AI.\nAsk: if a client requested an AI-usage report on their matter tomorrow, who could produce it? Then pivot.",
      "demo": "Open on Discovery and stress how the estate was built: from traffic already crossing the platform, nothing installed on fee-earner laptops, prompt content untouched. On AI Users, drill one associate — apps used, the safe-versus-violation split — the specific conversation a practice-group head can act on.\nIn the User Interaction Policy, build the redaction rule: a practice-group IdP source, the sanctioned assistant, Anonymize and Monitor — then run a prompt naming a client and show the identifier masked, the answer still returned. Add a second rule blocking GenAI for a restricted client team, notification attached: an outside-counsel clause enforced, not just filed.\nShow the Legal DLP profile — classifiers for agreements, patents and court documents — then close in Events: attributed, exportable, ready for a client's security review."
    }
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
    "hook": "If a regulator asked tomorrow which AI systems process EU data, how long would your answer take?",
    "notes": {
      "divider": "Open on ownership: who holds AI Act readiness — legal, compliance, the CISO — and can they list the AI actually in use? Most programmes stall on that first step.\nSketch the dates: general applicability from August 2026, the high-risk wave deferred to late 2027 — runway for building the evidence machine, not a cancellation. Bridge: here is the inventory, the control and the evidence, live.",
      "why": "Ground it in the research the page cites: over half of organisations lack systematic AI inventories, and in one analysis of 106 enterprise AI systems, 40 percent could not be clearly classified against the Act's tiers. Add the angle that surprises UK boards: output used in the Union pulls a third-country deployer into scope.\nThen position with care, exactly as the page insists — Cato supports the readiness programme, it never makes anyone compliant; classification, impact assessments and documentation stay with governance, and this is the evidence layer underneath.\nAsk whether any team's customisation of a third-party tool could tip them from deployer into provider. Pivot to the console.",
      "demo": "Open the Overview and let the tiles speak — the gap between the app count on screen and what the room believed is their inventory problem, quantified. Walk Discovery next: per-app users, risk and last activity, embedded SaaS AI included — the input every classification and scoping exercise starts from.\nBuild one User Interaction Policy rule — four actions, a notification that teaches at the moment of use, TLS inspection named as the prerequisite. In Events, filter to AI: attributed, exportable to CSV or the SIEM — and be straight that this is supporting evidence, with retention defaulting to three months against Article 26's six-month window.\nClose in the Audit Trail — who changed which AI policy, when, from where. They arrived without an inventory and leave with one."
    }
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
    "hook": "The question is not whether Cato works — it is whether you can get there without a weekend of heroics.",
    "notes": {
      "divider": "Land the doubt first: nobody in the room questions whether the platform works — they question whether they can get there without an outage or a stalled project.\nSay this is the Professional Services method itself: engineered, reversible and deliberately boring in the best possible way. Then set expectations — most of this is a whiteboard session, not a console demo, and their answers drive the design.",
      "why": "Talk the co-existence problem plainly: two networks run side by side for months, and the silent killer in multi-region estates is asymmetric routing — the return takes a different regional hub, stateful firewalls see half the conversation, sessions drop.\nThe method beats that with sequence: discovery before design, then one deciding question — which device makes the routing decision between legacy and Cato — with six patterns to choose from. The proof is scale: roughly three hundred sites moved on routed-range pre-staging, each migration a delete-and-update of ranges, not a policy rebuild.\nAsk their 2am question: is rollback a route change or a site visit? Then start the workshop.",
      "demo": "On the whiteboard, run the structured discovery first — traffic flows, layer-2 versus layer-3 LAN, routing strategy — because the pattern is dictated by facts, never a template. Weigh the macro approach next: one cutover window against phased waves, judged on site count, risk appetite and contract end dates; most estates land phased.\nThen pin the default gateway per site archetype — L3 switch, legacy firewall or the Socket — that single answer selects the co-existence pattern. In the console at Sites, show routed ranges with dummy pre-staging or a BGP handoff, sizing hub bandwidth and redundancy.\nFinish in Topology: validation tests per wave, the rollback step written down — re-add the range, withdraw the prefix, re-point the static — and if multi-region, trace one flow both directions before leaving the room."
    }
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
    "hook": "Press play and watch the middle of an MPLS exit — the part everyone fears — never break.",
    "notes": {
      "divider": "Set the emotional truth: nobody stalls at the start of an MPLS exit, or at the end — they stall in the middle, when circuits expire on different dates and half the estate sits on each network.\nSay this page exists for exactly that moment: an animated walkthrough of the middle. Then press play and let the phases carry the story.",
      "why": "The fear is specific: while sites straddle two networks, can a migrated branch still reach an un-migrated one? The answer is yes, throughout — the first Socket at the colo peers eBGP with the MPLS CE, advertising each side's prefixes to the other, so every site holds a route to every other at every phase.\nThe shape of the journey de-risks itself: the bridge first, then the datacentre and cloud as early wins, then branch waves, then the switch-off — and rollback at any point is a routing change.\nPivot: rather than assert it, watch it — the player steps through all five phases.",
      "demo": "Start the player on the baseline: everything hub-and-spoke through the carrier core, the cloud estate reached the long way, through the datacentre. Advance to the hub bridge: the first Socket lands at the colo beside the MPLS CE and peers eBGP with it — dual-homed, both paths live, nothing changes for users yet.\nNext the datacentres come on-net — an HA Socket pair on-prem, a vSocket in the cloud — with the amber interim path showing branches still on MPLS reaching them across the handoff. In the waves phase, branches swing up while the last site rides the emptying MPLS cloud, still reaching everything.\nFinish on retirement: circuit off, contract cancelled, any-to-any on one routing table — then point at the full co-existence page for the routing tables line by line."
    }
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
    "hook": "It never stalls on whether Cato is better — it stalls on how both fabrics coexist mid-cutover.",
    "notes": {
      "divider": "Most SD-WAN prospects already believe the destination — what they cannot picture is the middle, when half the estate sits on each fabric and traffic has to flow cleanly between them.\nSo rather than argue the case, I want to show you the transition itself. What follows is the eBGP-hub co-existence pattern played end to end as an animation — parallel hub, datacentre and cloud, branch waves, then the overlay switched off.",
      "why": "Today everything anchors to one hub appliance — branches, the datacentre, even the cloud estate backhauls through it. And the real fear mid-cutover is asymmetry: if a flow goes out one fabric and comes back the other, the stateful firewalls each see half a conversation and sessions drop.\nAsk them straight: how would you keep both fabrics symmetric while sites move? The answer is that the fabrics meet in exactly one place, routes are exchanged over eBGP at that boundary, and crossing between them adds an AS hop — so best-path selection keeps every flow and its return on the same hub. Rollback is just reconvergence.\nLet me press play and walk it through phase by phase.",
      "demo": "Phase one — a Socket stands up beside the legacy hub and the eBGP handoff comes alive, validated with test prefixes before a single production site moves. Point out that nothing has moved yet; legacy still carries everything.\nPhase two takes the low-risk wins: HA Sockets in the datacentre, a vSocket in the Azure hub. Apps and cloud are on-net while every branch still rides the overlay across the handoff.\nPhase three is the waves — each branch cutover is independent, its overlay link falls dormant rather than deleted, and the handoff stays as the way back until sign-off. Phase four strikes through the hub, overlay, controllers and licences — one fabric, any-to-any.\nFinish on the routing-insight section below the player: symmetry is a property of the routing, not a manual pin. The route-filtering detail and the multi-region options A to F live on the Migration Methodology page."
    }
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
    "hook": "How do users keep internet security while you move? Watch the answer play out in five phases.",
    "notes": {
      "divider": "Every SSE replacement stalls on the same fear — pull users off ZIA and internet security goes dark. It never has to, and that is the whole point of this section.\nThe answer is sequencing: the private-app rail moves first, users move last, and two agents co-exist in between. I am going to play that out for you as five phases, one moving picture.",
      "why": "Today this customer runs two products and two policy sets, an agent that only does security, and private apps reached over ZPA and backhaul — with the WAN on somebody else's kit entirely.\nThe line that beats the objection is on this page: internet security never goes dark. The apps move first — a Socket in the datacentre, a vSocket in AWS — then users swing cohort by cohort with ZIA kept one flip away over interim IPsec until the converted policy is live and proven. Only then does ZCC come off, and every phase is independently reversible.\nLet me show you exactly how that plays out.",
      "demo": "Phase one, the rail: a Socket lands in the London datacentre — the anchor of this estate — and a vSocket in AWS. The destinations users care about are on the backbone before anyone moves; users feel nothing.\nPhase two, the pilot: the branch Socket and the pilot's Cato Client swing to the PoP for private apps and the converted web policy together. Call out the trick — ZCC rides inside the Cato tunnel, and the interim IPsec lane keeps ZIA one flip away.\nPhase three, the waves: cohorts swap on the same dual-agent bridge and ZIA drains to standby — its egress, the ZPA lanes and the fallback all go dormant. Phase four retires it: ZCC uninstalled, ZIA and ZPA decommissioned, one client and one platform.\nIf they want the policy conversion and the real migration story behind this, that is the full Zscaler use case."
    }
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
    "hook": "A VPN replacement moves people, not circuits — cohorts, not cutovers, is why it never stalls.",
    "notes": {
      "divider": "Nobody needs convincing that the VPN estate is a liability — what stalls the project is the middle, with some users on the new client, some on the old, and contractors nobody wants to touch.\nThe key idea here: sites co-exist by routing, but clients co-exist by cohort. Let me play the whole retirement through for you, one cohort at a time.",
      "why": "Today one tunnel grants the whole network — employees, contractors and BYOD alike — into headends that are sized for peak, patched on the vendor's schedule and left listening on the public internet. Even the Azure apps hairpin through the same datacentre.\nThe pattern that de-risks it is swap, not stack: no machine ever runs two full-tunnel agents, so each user is always on exactly one working path, and rollback is a per-cohort MDM change measured in minutes. Contractors never install anything at all — which is exactly why they move on the clientless wave.\nHere is how it unfolds.",
      "demo": "Phase one, the rail: a Socket at the London datacentre and a vSocket in Azure put both app estates on the backbone before anyone moves — identity and MFA connected, posture in monitor, and the Azure hairpin collapses to one hop.\nPhase two, the pilot: MDM removes the VPN profile and installs the Cato Client in a single change window. The pilot's old tunnel falls dormant — that dormant tunnel is the rollback.\nPhase three, the waves: departments repeat the pilot's checklist, and contractors go clientless in the browser — no agent, no network address, just their named apps. The headends drain to standby through the soak window.\nPhase four: tunnel-groups disabled, concentrators decommissioned, posture flips from monitor to enforce and always-on takes over. Nothing is left listening on the internet. The full mechanics live in the AnyConnect and DirectAccess playbooks — back to the deck."
    }
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
    "hook": "This renewal quote is a fork: another sizing exercise, or the last one you ever run.",
    "notes": {
      "divider": "The renewal quote on the table forces a decision either way — that is what makes this conversation easy to open. A refresh buys the same posture on newer tin and books the next end-of-life date straight back onto the calendar.\nSo the honest question is whether this sizing exercise is the last one they ever run. Let me show you the refresh becoming an exit, phase by phase.",
      "why": "Today they have six edges and six rulebases, quietly drifting apart — branches, a regional hub, the datacentre pair and a virtual appliance in the cloud, all tied to one vendor's support cycle.\nWhat takes the fear out is monitor-first: FWaaS runs alongside each appliance and the events show exactly what the cloud rulebase would have allowed or blocked before it decides anything. Cutover becomes a policy change, rollback is the same change in reverse, and the appliance stays racked and licensed until its wave is signed off.\nWatch how the estate converges.",
      "demo": "Phase one: the first Socket lands at the Frankfurt hub — deliberately the regional interconnect, which already sees cross-estate traffic, so one eBGP handoff covers co-existence. Imported rules run in FWaaS monitor while the appliance enforces.\nPhase two: Frankfurt cuts over and the bridge is live. The London DC's HA Socket starts its monitor run beside the firewall pair, and the AWS vSocket is the early win — no rack visit, no downtime window — already enforcing the forming rulebase.\nPhase three: branch waves cut enforcement to the cloud, and the DC pair's jobs split — internet and WAN policy to FWaaS, east-west segmentation to the LAN Firewall on the Socket. Signed-off appliances drop to powered-on standby.\nPhase four: the last monitor run signs off, the renewal is cancelled, with nothing left to size, patch or EOL. The economics and the full runbook are on the Firewall Refresh use case."
    }
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
    "hook": "A real customer got to one agent in five reversible phases — with the lessons learned left in.",
    "notes": {
      "divider": "This one is grounded in a migration that actually happened — a UK professional-services firm that went from ZIA and ZCC on every endpoint to a single agent, in five phases, each one reversible.\nAnd the honest version of that story, friction included, builds more trust than any polished slide. Here is what I will show you: the baseline, the converted policy proving itself, and the evidence trail.",
      "why": "Today's picture is a hairpin: internet traffic detours into a separate security cloud while the WAN sits on different kit — plus years of accumulated rules nobody fully owns.\nThe discovery question on this page is worth asking out loud: if you exported your ZIA and ZPA policy base today, how much of it could you still explain — and how much would you actually want to carry forward? The honest answer is why conversion starts with clean-up, not copy: export, review and map, deploy, optimise.\nOn the endpoint, ZCC and the Cato Client genuinely co-exist — the ZCC tunnel rides inside the Cato tunnel on-site — so protection never gaps. Let me show you how the pilot proves it.",
      "demo": "Start in Monitor, Experience Monitoring: the pilot cohort's baseline week — per-user scores, connected PoP, TTFB — captured alongside the same users' ZIA logs, the yardstick for everything that follows.\nMove to Security, Internet Firewall: only the rules this cohort actually hits, recreated monitor-first. Block stays Block, Caution becomes Prompt, and every rule tracks an event — the hit counts are the parity evidence. Cato ends in an implicit allow, the same default posture as ZIA.\nThen Security, CASB: two rules — corporate SaaS pinned to the corporate tenant, uploads to personal instances blocked — matching what Cloud App Control decided for the same users.\nClose in Monitor, Events: filter to the converted rules, every verdict attributed to a named user and rule, and export the dated CSV. If the pilot passes, the group simply widens — and parity means intent, never identical counts."
    }
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
    "hook": "The PA refresh date is already on the calendar — and Palo Alto's own migration tool is end-of-life.",
    "notes": {
      "divider": "The refresh date is already on this customer's calendar — end of sale for the 3200 and 5200 series has passed and support ends in 2028 — and Palo Alto's own migration tool, Expedition, is end-of-life with no successor.\nSo even staying put is a migration project without a vendor tool. Here is what I will show you: a parallel socket beside the PA, policy proving itself at parity, and a rollback timed in minutes.",
      "why": "Today every refresh re-buys the hardware plus the whole subscription stack — Threat Prevention, URL Filtering, WildFire, DNS Security, GlobalProtect — each licensed and sized per box, with TLS decryption eating the sizing fastest. Panorama is software they must run themselves, and CVE-2024-3400, a CVSS ten zero-day in GlobalProtect, forced emergency hotfix weekends across every exposed firewall.\nThe discovery question anchors it to their numbers: what does the next refresh plus subscriptions actually cost across the estate, and how many change windows did those hotfixes take?\nWith Cato, inspection moves to the PoP and the only PA-side change in the entire pilot is one route. Let me walk it.",
      "demo": "Open Monitor, Topology: the pilot branch up on its nearest PoP with the PA untouched as default gateway — day-one co-existence, one route is all we asked of the PA estate.\nThen Security, Internet Firewall: the fifteen to twenty highest-hit App-ID rules translated monitor-first, custom App-IDs recreated as custom apps above the catalogue. Read hit counts against the week-zero Panorama baseline — compare flow outcomes, never rule labels.\nThen Monitor, Experience Monitoring: the GlobalProtect cohort's week on the Cato Client, HIP objects rebuilt as posture profiles re-checked every ten minutes, not only at logon.\nMonitor, Threats Dashboard next: IPS ran a week in monitor, then flipped to block — a harmless test detection stopped, block page shown, attributed to user, device and site.\nFinish in Topology: withdraw the handoff route in a change window and traffic reverts to the PA in minutes — a rehearsed rollback is the strongest close."
    }
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
    "hook": "Netskope's SSE is strong — the case is architectural: one converged dataplane instead of five steering mechanisms.",
    "notes": {
      "divider": "Be straight about this one: Netskope built an excellent SSE, and customers rarely leave over performance. The case is architectural — SD-WAN arrived by acquisition on appliances feeding a separate security cloud, and every user population needs its own steering mechanism.\nSo we win on convergence and operations, and we neutralise on features. Here is what I will show you: the swapped cohort, private access without Publishers, and DLP rebuilt from source.",
      "why": "A mature Netskope estate steers traffic five different ways — Client, tunnels, PAC and explicit proxy, proxy chaining — each with its own exception lists and failure modes, across two stitched-together dataplanes. And third-party reviews note DLP, CASB and ZTNA tuning can run to months.\nThe discovery question matters here: which steering mechanisms are actually live in the tenant today, and who owns the exception lists? Each mechanism is a separate cutover cohort with its own rollback — and those years of exceptions encode knowledge you want to inherit, not rediscover. The SSL bypass list is the single best import in the whole estate.\nOn the endpoint it is replace, not coexist — the two clients never tunnel side by side. Let me show you the pilot.",
      "demo": "Start in Access, Users: the swapped cohort connected by name, with device, Client version and PoP — the roster check after the swap. The Netskope MDM package stays live — it's the rollback.\nThen Security, WAN Firewall: the pilot group allowlisted to named private apps behind the datacentre Socket, implicit block underneath — the Publisher's job done by routing plus policy, NPA definitions dormant as the way back.\nThen Security, DLP Configuration: the one profile the estate fires, rebuilt from Cato's catalogue, the EDM dataset regenerated from source data — nothing exports from Netskope — in monitor.\nIn Monitor, Events, walk the test list — blocked, prompted, tenant-restricted, each DLP payload — each verdict attributed, paired with its Netskope log line.\nClose on Experience Monitoring: scores hold steady across the parity weeks — leaving the Netskope Client cost users nothing. API Data Protection keeps scanning at rest and retires last."
    }
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
    "hook": "How many separate migrations has the Cisco portfolio already booked for you over the next eighteen months?",
    "notes": {
      "divider": "Open with the calendar, not the pitch: AnyConnect 4.x support ends March 2027, the small ASA models go end-of-support in 2026, and the Umbrella legacy SKUs are already past end of sale. Cisco has booked several migrations for this customer whether they move or not.\nSo the question is whether to modernise each silo separately or converge once. Here is what I will show you: all three planes — DNS and web, remote access, and the WAN — each proven with its own rollback.",
      "why": "Today it is a console per product — the Umbrella dashboard, ASDM or FMC for the firewalls, vManage or the Meraki Dashboard for the overlay, ISE for posture — each with its own licence model and renewal date. And their own landing zone, Secure Access, adds yet another console mid-transition.\nThe discovery question does the selling: map the Cisco renewal and end-of-life dates over the next eighteen months — how many separate migrations has the portfolio already booked, and how many consoles do they land in?\nWith Cato it converges to one platform and one policy model, regional eBGP hubs keep both overlays symmetric throughout, and every plane keeps a rehearsed, minutes-long rollback — a DNS re-point, an MDM re-push, a BGP withdrawal. Let me walk the three planes.",
      "demo": "Start in Security, Internet Firewall: Umbrella destination lists deduped against system categories, survivors becoming custom categories on monitor-first rules. Flag the egress-IP catch — once a site sits behind the Socket it stops matching its Umbrella network identity, so its policy moves in that window.\nThen Network, Sites, BGP: the hub handoff Established, OMP redistributed both ways — filters dropping the default route so nothing is reachable two ways at once.\nAccess, Device Posture next: the ISE posture set rebuilt as one profile — anti-malware, disk encryption, OS build — evaluated continuously, not just at logon.\nThen Experience Monitoring: the AnyConnect cohort's quiet, green week with always-on enforced — ahead of the concentrator model, not level with it.\nFinish in Monitor, Events: one feed for DNS, web, WAN and remote access, each verdict attributed to user, site and rule — beside today's four dashboards, the multi-console problem closed on screen."
    }
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
    "hook": "FortiOS 7.6.3 removes SSL-VPN either way — spend that re-engineering once, on the way out.",
    "notes": {
      "divider": "Nobody replaces a working FortiGate estate on a whim — what puts it on the table is three calendars the customer does not control: the patch treadmill, the hardware refresh cycle, and now FortiOS 7.6.3 removing SSL-VPN tunnel mode outright.\nRemote access gets re-engineered either way, so the honest question is whether to spend that effort once, on the way out. Here is what I will show you: the hub handoff, a live branch on both fabrics, policy at parity, and the rollback run as a drill.",
      "why": "The record does the framing — FortiOS tops the known-exploited list, a chunk of those entries used in ransomware campaigns, and FortiJump showed the management plane itself becoming the breach, exposing every managed FortiGate's config and credentials. Meanwhile support ends sixty months after end of order and every refresh re-sizes both boxes and licences.\nThe discovery questions are on the page: which FortiGates are inside eighteen months of end of support, what did the last emergency patch cycle cost in change windows, and what is the plan for 7.6.3?\nThe Cato pattern is a parallel socket at each regional hub with an eBGP handoff — AS-path length keeps traffic symmetric, and every rollback is just BGP reconverging. Let me prove each piece.",
      "demo": "Start in Network, Sites, BGP, Show BGP Status: the neighbour Established, routes exchanged both ways — validated with a test prefix first, filters dropping the default route and parallel-site prefixes.\nThen Monitor, Topology: the pilot branch on its Socket reaching hosts behind un-migrated FortiGate sites and reached back — one flow crossing backbone, handoff and legacy fabric.\nSecurity, Internet Firewall next: the bounded policy slice, rationalised on hit counts, monitor-first, every rule tracking events against the FortiAnalyzer baseline. Keep it fair — the single-pass engine inspects flows FortiOS never profiled; new detections are coverage gained, not false positives.\nThen Experience Monitoring: the SSL-VPN cohort's week on the Cato Client — FortiClient disabled through EMS first, one data path per endpoint.\nClose in Network, Routing Table with the drill: withdraw the branch, re-enable the spoke, BGP reconverging in minutes, ping running, then cut forward — that rehearsal de-risks every later wave."
    }
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
    "hook": "Where does a proxy-heritage web stack sit in a data-security-first roadmap?",
    "notes": {
      "divider": "Open with the roadmap question: Forcepoint now describes itself as an AI-powered data-security company — it sold the governments business to TPG and launched Data Security Cloud in 2025. None of that is an end-of-life, and say so plainly; the pressure is strategic, and the operational case stands on its own.\nHere's what the path onto one platform looks like.",
      "why": "Today the estate is explicit by design: a PAC decides what reaches the proxy, only proxied web ports get inspected, identity rides proxy auth, and web, firewall and the ex-Bitglass SSE each keep their own console. With Cato, steering flips to transparent — the Client and Socket own the path — so the PAC estate stops being maintenance and becomes the rollback lever.\nAsk which Forcepoint products are actually deployed, when each contract renews, and whether any appliance end-of-sale notices are in hand. Be honest, too, that endpoint DLP may stay as a hybrid.\nNow let me show you how it lands.",
      "demo": "Start in Access, Users: the pilot group synced over SCIM, so everything you're about to see carries a name — identity without proxy challenges.\nThen the Internet Firewall — read the hit counts out loud; Websense's Confirm action lands as Prompt, though time-quota browsing has no direct twin, so validate that per policy. Then DLP Configuration: dictionary and regex classifiers arrive as data types, structured fingerprints as exact data matching — thresholds re-proved, never copied.\nOn TLS Inspection, show the bypasses sitting above the pilot-scoped Inspect rule — pinned apps must be bypasses. Finish in Events: one verdict per rule, attributed by name.\nClose on the safety net — rollback is reinstating the PAC by GPO — then back to the deck."
    }
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
    "hook": "You are already forced to replace the client — why rebuild the same architecture?",
    "notes": {
      "divider": "The client migration is already booked for them: AnyConnect 4.x loses support in March 2027, and the smaller ASA headends go in August 2026 — so a repackage, re-test and redeploy project happens either way. The only open question is whether they rebuild the concentrator model at the end of it.\nFrame it as the project they already own, done once, properly — here's what that looks like live.",
      "why": "Today every remote session hairpins through a datacentre appliance sized for a guessed peak — a snow day finds the cliff — and listening on the public internet. Split tunnels dodge the hairpin by skipping inspection entirely; either way, somebody loses.\nWith Cato there is no headend: the Client attaches to the nearest PoP, posture is checked for the life of the session, and access is per named application, not per subnet.\nWorth asking: how many headends, what's peak concurrency against the licensed ceiling, and who owns the split-tunnel exception list? Let's connect and see.",
      "demo": "Connect with the Client first — SSO and MFA at the IdP, attached to the nearest PoP. Point at what's absent: no concentrator address, no choosing the least busy gateway.\nThen Client Connectivity Policy: the rules deciding who may bring a tunnel up at all — group, country, posture — control an ASA scatters across DAP logic. Open a Device Posture profile and land the ISE point: these checks run continuously through the session, not once at logon.\nIn the WAN Firewall, show one named application granted and the adjacent resource refused — least privilege by default, not an ACL project. Close in Events on the full session trail by identity — the audit trail concentrator syslog never delivered — then back to the deck."
    }
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
    "hook": "Microsoft has already decided DirectAccess dies — the only question is what replaces it.",
    "notes": {
      "divider": "Microsoft's guidance is blunt: DirectAccess is deprecated and will be removed from a future Windows Server release, so the move lands with their next server refresh whether they plan it or not. Even the sanctioned successor, Always On VPN, is still a gateway estate they build and nurse themselves.\nPosition this as the forced move made once, properly — and to more than Windows. Here's what I'll walk through.",
      "why": "Today remote access covers domain-joined Windows Enterprise only — Macs, phones and contractor laptops sit outside — kept alive by a Network Location Server that breaks everyone when it fails, plus PKI and IP-HTTPS plumbing to nurse. And a connected tunnel grants the network, not an application.\nWith Cato the always-on behaviour survives, but cross-platform, with no domain join, no NLS, and posture checked live rather than assumed from domain membership.\nAsk how many non-Windows and unmanaged users sit unserved today, what happens when the NLS drops, and which Windows Server release finally forces the change. Then let's see it.",
      "demo": "Connect as the user first — the client connects on its own to the nearest PoP; no server deciding whether it's inside or outside, no domain-join prerequisite. Mention it's the same client on macOS and mobile.\nThen Client Connectivity Policy: the connection gate DirectAccess buried in GPO scoping and security groups, now explicit and identity-driven. In Device Posture, the trust domain join merely implied becomes an enforced, continuous check.\nOver to the WAN Firewall: one named application for the group and no rule granting the subnet — the machine on the network becomes the user on the application. Close in Events with the whole trail in one place — not scattered across DA server, NLS and event logs — then back to the deck."
    }
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
    "hook": "Who patched your Director in August 2024 — you, your carrier, or nobody?",
    "notes": {
      "divider": "Ask the patching question: the 2024 Director zero-day was exploited in the wild against the providers who run Director for downstream enterprises, and 2025 brought a CVSS 10 bypass in Concerto. Patches exist for all of it — the real question is who applied them, and how quickly.\nThis is the operating model on trial, not the packet path. Here's what I'll show you on the way out of it.",
      "why": "Today someone — them or their carrier — hosts and patches Director, Controller, Analytics and Concerto, all locked to one software version so upgrades are fleet events; at scale that's two Director servers and a six-server analytics cluster per 2,500 appliances. In carrier-managed estates even a config export is a change ticket with lead time.\nWith Cato there's no head-end anywhere in the estate: the control plane is part of the service and the vendor patches the platform.\nUse the page's question — who patched those four components in August 2024 and April 2025, and how long did it take? Then the co-existence build.",
      "demo": "Open the hub site's BGP settings: a parallel Socket beside their hub, neighbour Established, the MP-BGP overlay intact on its side of the seam. Then the routing table — filter to the exchanged prefixes and read off AS path and communities: the two worlds are talking.\nNow the upgrade they can't answer: Cloud Apps discovery on the pilot cohort with nothing translated, because a VOS estate typically carries no inline CASB. Follow with Experience Monitoring — site and users scored across a working week, answering whether it feels slower than the overlay.\nFinish in Events: translated rules in monitor, nothing blocking until events prove each rule matches its VOS ancestor. Wrap: cutover is a routing event; rollback re-enables the spoke and BGP reconverges."
    }
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
    "hook": "Could you list every Access app, tunnel and service token today?",
    "notes": {
      "divider": "Lead with the inventory challenge: most Cloudflare Zero Trust estates were never designed — the CDN landed first, then Access apps, tunnels and DNS filtering accreted team by team, sometimes across accounts. If they can't list every Access app, service token and egress IP today, that is the finding.\nBe clear the CDN, WAF and DNS stay on Cloudflare — a scoped move, not an exit. Here's what I'll show you.",
      "why": "Today the free anchor sets the price perception while the enterprise pieces — isolation, dedicated egress IPs, custom DLP, retention — sit in add-ons and contracts. And the branch side is thin: by their own appliance reference, no QoS, no fail-open, failover up to thirty seconds.\nWith Cato it's one dataplane — Socket for sites, Client for users, one policy engine — plus a proper SD-WAN edge with a monitored last mile. Concede the network is genuinely strong; the gap is platform convergence.\nAsk whether they could produce that full inventory today, and say which account each piece lives in. Then to the console.",
      "demo": "Start in the Internet Firewall: Gateway's DNS, network and HTTP policies as one ordered rulebase, with Isolate as a policy action rather than an add-on SKU. Then the WAN Firewall: each named Access app is one allow rule over an implicit deny — and flag that service tokens have no like-for-like, so machine flows get designed, not assumed.\nShow the connection gate: a device failing posture refused at connect, reason on screen. Over to Sites for the re-pointed Magic WAN edge — both IPsec tunnels up, the old tunnel definition idle as the rollback.\nClose on Experience Monitoring, cohort scores holding from the day of the agent swap — the swap is per cohort, never two agents on one device. Back to the deck."
    }
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
    "hook": "Which exam platforms are keyed to your iboss egress IPs today?",
    "notes": {
      "divider": "Open on the egress IPs: iboss gateways are single-tenant, so every SaaS restriction, partner firewall and exam-platform allowlist may be keyed to addresses nobody owns a list of. If that question gets a shrug, discovery starts there.\nThen the wider frame: an SSE-only platform beside a separate network vendor becomes one console — and every wave keeps the hosted PAC as its way back. Here's the walk.",
      "why": "Today steering is the estate: PAC files, per-platform connectors, GRE tunnels and DNS redirection — four paths in, each encoding years of exceptions. And because iboss was SSE-only until 2024, the network runs on a second vendor — two policy planes, two renewals.\nWith Cato, steering goes transparent — Client for roaming devices, Socket for sites — and both planes land in one console, with the hosted PAC frozen as every wave's rollback rail.\nAsk who owns the list of allowlists keyed to their dedicated IPs. Then into the console — and the pilot cohort is staff, never pupils: safeguarding filtering can't run monitor-only.",
      "demo": "Start in Sites: the pilot school's GRE tunnel replaced by a Socket — an upgrade, not a swap, with HA and QoS the proxy tunnel never had.\nThen the Internet Firewall: the cohort's tier translated with every rule tracking events — those hit counts are the safeguarding evidence. On the IPS Content Policy tab, show SafeSearch and YouTube enforcement, and say the caveat out loud: DNS-over-HTTPS bypasses these controls, so the DoH change ships alongside.\nIn TLS Inspection, both root certificates sit side by side and the bypasses are seeded from the harvested iboss lists — rollback never breaks HTTPS. Finish in Events on the per-user trail the safeguarding lead needs, then close: any wave re-points to the hosted PAC in one change."
    }
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
    "hook": "Spend the refresh budget renewing the appliance model — or retiring it?",
    "notes": {
      "divider": "The calendar does the opening: a broad appliance cohort leaves support in December 2025, so Quantum Force refresh quotes are landing now, and R81.10 follows in March 2026 with a management-first upgrade project attached. Money and change windows are being spent either way.\nPose the choice — renew the appliance model or retire it — then show what retiring it looks like, one prefix at a time.",
      "why": "Today the estate is management-heavy: SmartConsole's ordered and inline layers, blades licensed per gateway, its own identity collectors — and since Perimeter 81, a second policy plane in the Harmony SASE portal. Harmony Connect customers have already been through one forced migration inside the same vendor, and the 2024 zero-day showed the gateway itself is attack surface.\nWith Cato it's one policy plane in the CMA, no management server to run, and PoPs the vendor patches.\nAsk which gateways sit on the December list, whether a refresh quote is on the table, and who owns the management upgrade. Then the parallel build.",
      "demo": "Open Topology first: the parallel Socket alive beside the untouched Quantum gateway — the only Check Point change in the build is one route on a transit VLAN.\nThen the Internet Firewall: ordered and inline layers flattened into one first-match rulebase — effective policy translated, never the layer structure. On TLS Inspection, put the staged bypass-first rules beside the HTTPS Inspection blade export and be honest: Cato will decrypt more than the blade ever did, so new detections are findings, not regressions.\nThe Threats Dashboard shows IPS monitor-first, then a harmless test detection blocked and attributed. Close in Events, reading hit counts against the week-zero show-hits baseline — same flows, same intent, names attached. Wrap on rollback: withdraw the route, traffic reverts in minutes, rehearsed."
    }
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
    "hook": "Can HPE say in writing which of three SD-WAN lines carries the roadmap?",
    "notes": {
      "divider": "Put the roadmap question on the table: post-Juniper, HPE sells three branch SD-WAN lines on three management planes, and nobody has said which one wins. Nothing is end-of-life — say that plainly — but a written commitment is a fair procurement ask.\nMeanwhile this estate runs the WAN in one console and security in another, stitched together by tunnels. Here's the consolidation, live.",
      "why": "Today EdgeConnect does the WAN and full inspection is service-chained to a separate SSE — two consoles, two policy models, two contracts, with tunnel orchestration as the seam every change touches. Add the appliance anchor: sizing, HA pairs, bandwidth-tier licences, and Boost metered per megabit.\nWith Cato the edge thins to a Socket while inspection and acceleration move to the PoP, platform-wide and unmetered — SD-WAN and SSE consolidated in one move.\nAsk whether they know what Boost and the SSE subscription cost per year, side by side, across the estate. Then to the hub handoff.",
      "demo": "Start in the hub site's BGP settings: the eBGP handoff Established with the EdgeConnect hub, the fabric and every overlay intact on its side. Then Network Rules: one Business Intent Overlay landed as an app-aware rule, hit counts proving it matches what the overlay matched. In Bandwidth Management, the overlay's QoS priority becomes a profile that only bites under congestion — shaping under load, not throttling at rest.\nApp Analytics carries the Boost honesty test: timed transfers, run cold, judged against the agreed business window rather than a dedup ratio — either verdict is a finding. Close in Events: firewall and IPS verdicts on the pilot site, no SSE tunnel in the path — it was simply never rebuilt. Wrap: rollback re-enables the spoke and routing reconverges."
    }
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
    "hook": "Reporter is end-of-life — your hit data is a wasting asset either way.",
    "notes": {
      "divider": "Reporter's end-of-life is the opening: the hit data that justifies rationalising twenty years of CPL lives in databases that will not migrate anywhere, so exporting it is urgent whatever they decide. The rest of the pressure is structural — hardware EOL backstops, the SGOS 7.3 sunset, subscription-only renewals with steep uplifts.\nThe play is rationalise, not port. Here's what the landing zone looks like.",
      "why": "Today it's explicit steering — PAC, WCCP, agents — feeding proxies whose policy is order-dependent CPL nobody can fully audit, with decryption on a dedicated appliance and reporting on a product already discontinued. With Cato, steering goes transparent, the live fraction of the CPL becomes a rulebase where every rule earns its keep on hit counts, and WSS, CloudSOC and DLP intent land in one console.\nStay honest on DLP: fingerprinting, endpoint channels and Discover argue for a scoped hybrid, not a contest.\nAsk which components are actually deployed, when each renews, and who consumes Reporter's output today. Then the walkthrough.",
      "demo": "Open the Internet Firewall on the rationalised slice: block and prompt rules with live hit counts, the coach page reborn as Prompt — every rule justified by events, not archaeology. Then TLS Inspection: the SSL Visibility appliance recast as policy — bypasses first, verified entry by entry from the old exemptions, then Inspect scoped to the cohort; the appliance gets no successor.\nThe Cloud Apps Dashboard shows CASB discovery with no SpanVA collector — the PoP already sees the traffic. In Client Connectivity, the pilot-scoped rule above the default allow keeps enforcement on the migration group only.\nFinish in Events — verdicts attributed by name, no proxy challenge — and close on the exit: rollback reinstates the PAC and the WSS agent, a config event, not a project."
    }
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
    "hook": "Your XGS refresh quote rises again in July 2026 — what if it removed the appliance cycle instead?",
    "notes": {
      "divider": "Open on the calendar, not the product. Every XG firewall has been out of support since March 2025, licence prices rose roughly thirty per cent on the way out, and XGS hardware went up another ten per cent from July 2026 — so the refresh money is being spent either way.\nThe honest question is whether it buys another appliance cycle or removes it. Here's what I'll show you.",
      "why": "Resist the consolidation pitch — Sophos Central genuinely is one console. The real pressure is architectural: small sites tunnel everything back to the hub before anything is inspected, and the VPN portal and ZTNA gateway sit on exactly the surface class in the CISA exploited-vulnerabilities record.\nThe give-back is that everything they like stays — endpoint, XDR and MDR remain in Central, and none of it needs a Sophos firewall.\nAsk who patches the XG boxes now support has ended, and what happens to the ZTNA seat price when it becomes Workspace Protection at renewal. Then move to the live walk.",
      "demo": "Start in Network, Sites: the pilot branch that used to run an SD-RED is up on a Socket that provisioned itself, with the hub handoff carrying the un-migrated traffic.\nMove to Device Posture and open the anti-malware check — Sophos sits in the vendor drop-down, so the Security Heartbeat replacement is a selection, not a promise. Then the Internet Firewall: a bounded SFOS slice rebuilt with tracking on, nothing blocking until events justify it.\nIn Experience Monitoring, land that every device here also runs Intercept X — a week of Good scores is coexistence evidence no vendor statement provides. Finish in Topology: the RED was re-plugged mid-pilot, re-established, then swapped forward again. That drill makes the wave plan credible — back to the deck."
    }
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
    "hook": "CISA ordered end-of-support ASAs permanently disconnected — a government has called time on this appliance category.",
    "notes": {
      "divider": "Land the directive: ED 25-03 didn't ask agencies to patch — it ordered the hardware unplugged, and its April revision added that patching doesn't necessarily remove an attacker already on the box.\nFrom there the frame is simple: with every 5500-X at or past its support wall, the customer runs a migration project either way — the only choice is what it buys. Here's what I'll show you.",
      "why": "Today is a frozen picture: the surviving boxes are capped on the 9.16 train with no fixes ahead, and Cisco's sanctioned exit is Firepower — a reimage, a new console, partial config conversion — landing on hardware with its own end-of-life treadmill already visible.\nWith Cato the same effort is spent once, and the bigger half is greenfield: SWG, CASB, DLP and TLS inspection this estate never had, running in monitor from week one.\nAsk where their serials sit against the 2025 and 2026 support walls, and whether anyone has run the NCSC's RayInitiator checks. Then go live.",
      "demo": "Open in Network, Sites on the hub tunnel and name the trap avoided: an ASA takes one traffic selector per child SA, so this site is route-based VTI — and it negotiated cleanly.\nTopology next: the pilot branch on a Socket, the ASA still racked — reverting is a route change, drilled mid-pilot. Then the WAN Firewall: translated ACEs as an ordered allowlist — the direction split matters: site-to-site rules here, outbound exceptions to the Internet Firewall — with hit counts reconciling against the ASA's own hitcnt baseline.\nThe Threats Dashboard is the greenfield dividend: verdicts on traffic the ASA never looked inside. Close on Experience Monitoring — the remote cohort a week at Good, no concentrator in the path."
    }
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
    "hook": "Every cloud-backup customer's firewall config was accessed — would you re-import that policy into anything?",
    "notes": {
      "divider": "Open with the breach, stated flatly: SonicWall and Mandiant concluded that every customer using cloud backup had their firewall configs accessed — files holding credentials, keys and full policy.\nThat makes this the most incident-driven displacement in the library, and it reframes the Gen 8 refresh quote: the question isn't which appliance next, it's whether the estate gets rebuilt clean somewhere without portals. Here's what I'll show you.",
      "why": "Walk the two mechanics rather than the headlines. Firewall-terminated SSL-VPN was the reported way in across the Akira campaigns — and the 2025 wave hit patched Gen 7 boxes, through credentials carried over from Gen 6 imports. And after the backup breach, every secret in the estate is potentially adversary-held regardless of patch level.\nSo the answer is rebuild, never re-import: cohorts to IdP-backed ZTNA first, secrets rotated, nothing compromised crossing over.\nAsk whether they used MySonicWall cloud backup, whether the Essential Credential Reset is complete, and where the SMA 100 users landed after October 2025. Then go to the walk.",
      "demo": "Start in Access, Users, and land what's absent: the pilot cohort signs in through the IdP with MFA and posture, and no local account exists anywhere — the direct counter to the credential carry-over mechanic in SonicWall's own advisory.\nThen Sites: the TZ branch on a Socket, and the NSa hub running an IPsec on-ramp for un-migrated traffic — on a freshly generated key, because nothing that ever lived in a cloud backup gets reused. In the Internet Firewall, the zone-matrix slice runs as identity-aware rules with tracking on, reconciling against the SonicOS counters.\nFinish in Topology with the rollback — re-plug the TZ and its tunnel re-establishes — and mention the pilot portal going dark, verified from outside. That portal check is the de-risking headline."
    }
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
    "hook": "Copying five years of ZIA policy verbatim is the most reliable way to wreck a migration.",
    "notes": {
      "divider": "Getting sites and agents onto Cato is the easy half of a Zscaler replacement — the half that stalls programmes is five years of ZIA policy across half a dozen engines.\nSo this section is about method, not features: export everything, cull on hit counts, map what survives, and let events earn every block. Here's what that looks like in the console.",
      "why": "The failure mode is faithfulness: copy the estate verbatim and the dead rules, contradictions and every quirk arrive intact — and because the category and DLP taxonomies differ, a faithful copy can quietly weaken enforcement.\nThe method inverts that: hit counts decide what exists before anything is mapped — the same logic Cato later automates, flagging allow rules with no events in sixty days. Everything lands in monitor, so events prove each rule before it can hurt anyone.\nAsk which rules haven't matched in months, and which still say test or temp in the name — then take them into the console.",
      "demo": "Run this against their own export — a working session, not a tour. In the Internet Firewall, rebuild one of their real ZIA rules: SCIM group as source, category as destination, Caution becoming Prompt — and show the insights flagging rules nobody uses.\nTLS Inspection is the sequencing moment: certificates first, conservative bypasses, and the honest line that CASB, DLP and tenant restrictions all wait behind this switch. In CASB, open the recommended starting policy and swap their corporate tenant into a restriction rule; in DLP, a Data Control rule in monitor, with source data hashed in the browser before upload — nothing imported blind.\nClose in Events: filter to the rules just built, every match attributed, and agree who signs off each monitor-to-block flip."
    }
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
    "hook": "How many rules are in your rulebase — and how many actually fired in the last 90 days?",
    "notes": {
      "divider": "Put the question to the room and wait: how many rules, and how many fired in ninety days? The gap between those numbers is the clean-up dividend — and it sizes the whole conversion.\nAdd the uncomfortable fact: Expedition is gone, retired at the end of 2024 with no successor, so there is no tool to hide behind. Here's how the translation actually runs.",
      "why": "Fifteen years of App-ID policy doesn't convert as a file format — it's a functional translation between two models. Zones don't exist on Cato, so every rule consciously lands on a surface; and application-default is the silent trap — translate a rule without re-pinning its ports and you've quietly broadened it.\nThe good news runs the other way too: rules that only existed to attach different security profiles collapse, because IPS and anti-malware are platform layers — the translated rulebase comes out materially shorter by design.\nAnd nothing enforces on day one: monitor-first means no helpdesk storm. Now show them where their rules land.",
      "demo": "Start from their export: sort the rulebase by hit count and agree the cull list in the room — that single move reframes porting a thousand rules into translating the ones that matter.\nInternet Firewall first: default-allow posture, explicit blocks recreating their interzone-deny intent, and a rule where the ports were re-pinned rather than trusting application-default. Then the WAN Firewall — opposite posture — and map one of their zone-pair rules onto the allowlist live. In TLS Inspection, walk the wizard and say plainly that decryption is rebuilt, not ported, with three domains queueing behind it.\nCloud Apps Dashboard lets discovered SaaS challenge their sanctioned-app tags. Finish in Events: the evidence that sized the clean-up now proves the translation."
    }
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
    "hook": "Your SSL do-not-decrypt list is years of archaeology — inherit it, don't rediscover it.",
    "notes": {
      "divider": "Start with the artefact everyone forgets: the SSL do-not-decrypt list. It encodes years of certificate-pinning archaeology, and it's the single most valuable export in the whole estate — Cato's TLS bypasses get seeded straight from it.\nThe wider frame: connectivity lands in weeks; what stalls a Netskope migration is the policy estate. Here's how it translates, domain by domain.",
      "why": "Paint today honestly: hundreds of Real-time Protection rules and DLP profiles nobody remembers commissioning, and steering exceptions that bypassed inspection entirely — so coverage changes at cutover and quiet rules wake up. EDM datasets can't come at all: they're hashed in vendor-specific form, and every one is rebuilt from the source system.\nThe method makes that safe: only the firing subset migrates, and monitor mode runs side by side against Netskope events until hit parity is proven.\nAsk which rules and profiles actually fired in ninety days — and who owns the ones that didn't. Then into the console.",
      "demo": "Work from their export pack — RTP policies, DLP profiles, the do-not-decrypt list, steering exceptions, ninety days of analytics.\nInternet Firewall first: one rulebase where Cloud Firewall and web rules both land — show where an explicit catch-all block sits if they ran default-deny egress. In CASB, map one instance-aware rule by intent: corporate tenant enforced by header injection plus an app-control rule, and be straight that User Alert becomes Prompt without justification capture. DLP next: the EDM workflow, rebuilt from the HR or CRM source with data owners named — start it early, it's the long-lead item.\nIn TLS Inspection, seed the bypasses from their list. Close in Events on the hit tracking that gates every flip, and agree acceptance criteria per domain."
    }
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
    "hook": "What percentage of your ASA ACEs show zero hits today — and who would still defend the rest?",
    "notes": {
      "divider": "The network half of a Cisco migration is a routing event — the weeks disappear into policy, because it lives in four places: ASDM, FMC, CDO and the Umbrella dashboard, and nobody can say which exceptions still matter.\nThe reflex is to copy everything to be safe. That imports a decade of graveyard. Here's the pipeline that avoids it.",
      "why": "Two facts carry this section. Hit counts are already in their hands — show access-list prints a live hitcnt per entry, the most valuable artefact in the whole exercise — and they decide what migrates. And Umbrella policy is keyed to sites' public egress IPs: the moment a Socket goes live, the site stops matching its Umbrella policy entirely, so per-site web policy moves inside the swap window, never as a follow-up.\nOn Cato, DNS, web and firewall policy collapse into one engine, and rules follow real identities instead of addresses. Ask how many destination-list entries anyone would still defend, then go live.",
      "demo": "Ask for the exports in advance — a destination-list CSV and a show access-list capture; their own dead rules land harder than any slide.\nStart in the WAN Firewall: one ordered base replacing several per-interface ACLs, sorting explained — site-to-site rules onto the allowlist, outbound exceptions into the Internet Firewall, never a raw copy. Then build one mapping live: a slice of a destination list becomes a custom category on a rule in monitor — export to enforce-ready in minutes.\nTLS Inspection next: decryption is re-expressed, not transcribed, and it gates SWG, CASB and DLP fidelity alike. The Cloud Apps Dashboard is the baseline replacing App Discovery; close in Events, agreeing the parity checklist per domain — that agreement is the deliverable."
    }
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
    "hook": "Translate the estate badly and your old technical debt arrives on a new platform wearing a new logo.",
    "notes": {
      "divider": "The routing side of a FortiGate exit is solved — what's waiting is a decade of FortiOS policy: per-VDOM tables, near-identical UTM profile variants, thousands of objects with dead entries hiding inside.\nTranslate that badly and the debt simply moves house. So this section is about the pipeline that stops it travelling. Here's what I'll show you.",
      "why": "Lead with the sharpest fact: on FortiOS, inspection only happened where a profile was attached — traffic with no profile was never inspected at all. Cato's single-pass engine sees everything, so expect new detections in monitor and triage them as findings, not incidents.\nStructurally, profile pairs become platform layers — IPS and anti-malware run account-wide, carve-outs turn into explicit, auditable exceptions — and because the config is flat text, objects are scripted across rather than re-keyed.\nAsk how many rules show zero hits in ninety days, and who is empowered to decide those don't migrate. Then into the console.",
      "demo": "Have them bring a config export or FortiManager policy package — translate real rules live.\nWAN Firewall first: one global rulebase — no interface pairs, no policy packages — and the posture conversation: FortiOS is implicit-deny everywhere, Cato splits allowlist WAN from blocklist internet, so egress posture is a decision, not a translation. Then API and Integrations: the flat-text config means the whole object model is scripted across rather than re-keyed by hand.\nTLS Inspection is the staged switch — SWG parity, CASB activity control and DLP all hang off it. The Cloud Apps Dashboard shows shadow-IT discovery running with nothing configured — the upgrade from log-only sensors. Close in Events on one monitor-mode rule and the hit evidence that would earn its block."
    }
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
    "hook": "The DLP estate decides this deal — rationalise it classifier by classifier, not rip and hope.",
    "notes": {
      "divider": "Name the four heritages up front — Stonesoft rules in SMC, Websense categories, ex-Bitglass CASB, and the TRITON-era DLP suite — four consoles converging into one rulebase.\nAnd say the honest thing early: the DLP estate is genuine enterprise depth, and it gets rationalised policy by policy, with a recorded decision for each. Here's what I'll show you.",
      "why": "Most of the estate is dead weight — rules for decommissioned servers, DLP policies that never raised a triaged incident. And two things simply cannot be ported: fingerprint hashes and trained ML classifiers.\nSo every surviving DLP policy takes one of three routes — direct map onto predefined data types, rebuild as EDM from source data, or redesign-or-retain. Where USB and print mandates exceed network DLP, recommend the hybrid deliberately: the endpoint agent stays, with a posture check proving it runs.\nAsk whether they can show ninety days of hit counts across SMC, web and DLP — if not, export starts by turning counters on. Then go live.",
      "demo": "Run it on their exports — the SMC rulebase with counters, the DLP list with incident history.\nInternet Firewall first: map one of their Confirm rules to Prompt live, and point at the recommended block baseline inherited on day one. Then the WAN Firewall for the posture contrast — a site-to-site SMC rule on the default-deny allowlist. In TLS Inspection, land the co-existence rule: one inspection owner per cohort while the proxy still decrypts for everyone un-migrated.\nDLP Configuration is the deep moment: map one of their real classifiers into a content profile set to monitor — and where it's an ML classifier, the decision is redesign or retain, written down. Close in Events on the telemetry that retires dead rules and earns every block."
    }
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
    "hook": "The steering swap takes weeks; the policy keeps you paying iboss for months. Shall we shrink it first?",
    "notes": {
      "divider": "Open with the honest asymmetry: Clients and Sockets move traffic in weeks, but the policy — per-OU tiers, bypass lists, exceptions built up since the appliance-filter days — is what keeps the old subscription billing for months.\nSay the goal plainly: shrink it before you move it. A rule nobody can explain is documentation, not policy.\nThen bridge: here's what I'll show you — four policy domains landing in one console, with a rollback rail the whole way.",
      "why": "Talk the today side as lived experience: years of exceptions nobody can explain, exam platforms keyed to dedicated egress IPs where one slip breaks things mid-term, and per-user reporting that safeguarding treats as statutory evidence.\nAsk the page's question: when did anyone last review hit counts on the iboss side, and how many rules would survive a zero-hit cull? That answer usually shrinks the migration by a third before mapping starts.\nThe with-Cato side is the pipeline — dead rules die at review, survivors deploy in monitor, and the PAC stays hosted so rollback for any cohort is one GPO change.\nLet me show you what it looks like on the other side.",
      "demo": "Start in Security, Internet Firewall: walk one rule end to end and show the per-OU tier ladder as ordered group-scoped blocks — then Content Restrictions for SafeSearch and YouTube, naming the DoH caveat before anyone asks.\nMove to TLS Inspection: bypass rules seeded from their harvested PAC and SSL lists, and the CA story — Cato's root certificate alongside the iboss CA from day one, so rollback never breaks HTTPS.\nThen CASB and DLP Configuration: the default recommended policy as the starting point, activity-level control, and content profiles rebuilt from rule intent against 350-plus predefined data types — both in monitor.\nFinish in Monitor, Events: filter to one user, one rule — safeguarding continuity answered on screen. Close on the cohort wave plan."
    }
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
    "hook": "Could you produce one branch's effective firewall policy today — or does that answer start with a provider ticket?",
    "notes": {
      "divider": "Land the hook and let it sit: in most Versa estates nobody can show you what a single branch actually enforces, because the real policy is the product of Director template layers plus that device's bind data — and in a carrier-managed estate even asking is a change ticket with lead time.\nFrame the session: rebuild the effective policy per site, rationalise it, land it somewhere readable.\nHere's what I'll show you.",
      "why": "The today story is indirection: workflows, staging and post-staging templates, bind data, and per-rule UTM profiles breeding near-identical objects across revisions. In managed estates the export request goes in week one because everything downstream waits on the provider.\nAsk the page's question: could they produce one branch's effective policy today and say which rules matched traffic last quarter — and if that starts with a ticket, how long does it take?\nWith Cato it becomes one readable rulebase, IPS and anti-malware as global layers rather than per-rule profiles, plus visibility the estate never had.\nLet's look at where it lands.",
      "demo": "Open Security, WAN Firewall: default deny, with policy sections doing what template scoping used to — common intent stated once, genuine site exceptions where they earn it.\nAcross to Internet Firewall: category rules replacing URL-filter profiles, and point at action versus tracking — alert-only intent carries over as allow plus track, which is exactly how a monitor rule later becomes a block rule.\nTLS Inspection next: staged by category then pilot groups, the fidelity prerequisite for everything downstream.\nThen Monitor, Cloud Apps Dashboard: shadow-IT discovery with risk scores — the upgrade, since the estate had no CASB to migrate.\nClose in Events: every hit attributed to user and rule. A week of this answers every will-it-break-the-business question — then back to the slides."
    }
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
    "hook": "How many of your Gateway rules fired in ninety days — and which add-ons are actually on the contract?",
    "notes": {
      "divider": "Ask the hook question and wait — most teams can't say how many Gateway rules fired in ninety days, or which of DLP, Browser Isolation and dedicated egress IPs are actually on the contract.\nName the twist: intent is split across DNS, network and HTTP rule sets, with Magic Firewall in a separate packet-level engine.\nHere's what I'll show you — all of it converging into one policy model.",
      "why": "The today picture is fragmentation: three Gateway policy types evaluated as separate rule sets, Magic Firewall filtering packets with no user identity at all, CASB reporting API findings after the fact, and DLP scope depending on the invoice.\nBe clear on scope too — WAF, CDN and Workers stay on Cloudflare; only Zero Trust policy translates.\nWith Cato the same intent lands in one converged rulebase family, Isolate becomes a policy action beside Block and Prompt rather than an add-on SKU, and cf-terraforming gives you the whole estate as a machine-readable export to rationalise from.\nLet me show you the target.",
      "demo": "Start with the two firewall postures — Security, WAN Firewall then Internet Firewall: allowlist against blocklist, and where Gateway network policies and Magic Firewall rules each land. Flag that a Magic Firewall allow leaning on a permissive default must become an explicit WAN rule.\nStay in Internet Firewall for the SWG walk: Allow, Block, Prompt and RBI Isolate in one ordered rulebase — negations become allow-above-block pairs.\nThen TLS Inspection: rebuild one of their Do-Not-Inspect entries as an exception live, and land the dependency — content rules degrade to SNI matching until inspection covers the category.\nCASB next: App Catalog risk scores and an inline App Control rule — say it honestly, findings regenerate, intent migrates.\nFinish in Monitor, Events: hit counts accumulating on a migrated rule — the evidence that earns enforcement."
    }
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
    "hook": "How many layers exist because traffic needs a boundary — and how many because an administrator needed delegation?",
    "notes": {
      "divider": "Open with the hook as a genuine question — how many layers exist because traffic needs a boundary, and how many because an administrator once needed delegation? Most rooms go quiet.\nFrame the problem: with Ordered and Inline Layers, what the policy actually allows is the product of every layer passing — nobody can read it off the console.\nHere's what I'll show you: that hierarchy flattened into something readable, with the clean-up done first.",
      "why": "Walk the today side slowly: an Accept in one layer only stands if no later layer drops the flow, an inline layer's implicit cleanup silently drops what a flat rulebase would keep matching, and NAT lives in its own rulebase apart from access policy entirely.\nAsk the discovery question — how many rules have zero hits in ninety days? The Management API exports every layer with hit counts, so the answer is knowable before mapping starts.\nWith Cato you translate the effective policy, flattened, and every implicit cleanup becomes an explicit decision proven in monitor mode.\nLet me flatten one of their rules live.",
      "demo": "Start in Security, WAN Firewall: one flat, first-match allowlist — flatten one of their layered rules and point out the rule that never existed, the inline cleanup nobody wrote that must become an explicit block or the flattening silently allows traffic.\nThen Administration, API and Integrations: the object-dictionary export resolves every reference, so object translation runs end to end through GraphQL or Terraform, not re-keyed by hand.\nAcross to Internet Firewall: map two or three categories by intent and show Prompt standing in for their UserCheck Ask pages.\nTLS Inspection next: staged by category and pilot group — and be honest that their HTTPS Inspection blade probably never ran at full coverage, so expect new detections.\nClose in Monitor, Events: the hit evidence behind every monitor-to-block promotion, with the audit trail attached."
    }
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
    "hook": "How many of your seven overlays could you justify today? Two sharing an answer is one intent, not two.",
    "notes": {
      "divider": "Open on the split: this estate keeps its policy in two planes — steering, QoS and breakout in up to seven Business Intent Overlays in Orchestrator, and web security on someone else's SSE tenant at the end of a service chain.\nThen the hook: how many of those overlays could they justify today? Two overlays sharing an answer is one intent, not two.\nHere's what I'll show you — that intent re-expressed in one console.",
      "why": "The today side is structural: seven overlays are usually three or four genuine intents wearing different topologies, and the deepest translation isn't a rulebase at all — it's working out what each overlay was for. Add the SSE service chain and you have two consoles, two rulebases and a tunnel seam to keep frozen during any change window.\nAsk the discovery question: which applications actually ride each overlay, and why does its topology or QoS differ from the next?\nWith Cato each overlay collapses into two clean constructs — a network rule and a bandwidth profile — while single-pass inspection at the PoP retires the chain entirely.\nLet me show you the landing zone.",
      "demo": "Start in Network, Network Rules: one overlay's steering and QoS intent as a single app-aware rule, paired with a bandwidth profile — the priority tiers run P10 real-time down to the P255 default.\nThen Security, WAN Firewall: the hub-and-spoke restriction a topology used to imply, now stated explicitly as which-sites-reach-which rules under default deny.\nAcross to Internet Firewall: breakout policy with no tunnel to a third-party SWG anywhere in it — that seam is gone.\nTLS Inspection next: staged by category then pilot groups, because the SWG, CASB and DLP domains all hang off it.\nClose in Monitor, Events: allow, block and monitor hits attributed to user and rule — the audit trail two consoles never gave them. Then back to the wave plan."
    }
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
    "hook": "How many CPL layers are live, when were they audited — and who archives the hit data before Reporter dies?",
    "notes": {
      "divider": "Open with the hook's three-part question — how many CPL layers are live, when were they audited, and who archives the hit data before Reporter dies? On-prem Reporter's end of life is already announced, so the evidence base is on borrowed time.\nFrame the estate: up to twenty years of CPL across VPM and hand-written Local files, spread over four consoles.\nHere's what I'll show you: what survives, and where it lands.",
      "why": "Start with the fact that surprises people: no CPL-to-Cato converter exists — and that's the good news. Most CPL volume is proxy plumbing — auth exemptions, WCCP workarounds, pinned-certificate bypasses — that simply ceases to exist in a transparent Client and Socket model.\nSo the triage rule is the story: every layer is classified as business intent, plumbing, or dead, with Reporter and access-log hit data as the referee — and that data gets archived in week one, not at decommission.\nFour consoles converge into one rulebase, and if the mapped set isn't dramatically smaller than the CPL line count, the review phase didn't happen.\nLet's walk their policy through it.",
      "demo": "Start in Security, Internet Firewall: CPL intent landing as ordered category rules — map a coach page to Prompt live, and show the recommended block baseline they inherit on day one.\nThen Access, Users: SCIM-provisioned groups referenced directly in rules — no IWA realms, no BCAAA servers, no Kerberos SPNs, because nothing challenges the browser any more.\nTLS Inspection next: the SSLV appliance rebuilt as staged PoP policy — certificate fleet-wide, test group, expand by category, with the bypass list verified entry by entry rather than copied.\nThen DLP Configuration: map one of their described-content policies into a content profile live, and state the IDM and VML position plainly — redesign or retain, decided per policy; the honest hybrid keeps the endpoint agent where regulation demands it.\nClose in Monitor, Events: hit counts playing Reporter's role — the evidence for every promotion."
    }
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
    "hook": "How many SFOS rules passed no traffic in ninety days — and how many depend on a Heartbeat that's leaving?",
    "notes": {
      "divider": "Open with the hook's double question: how many SFOS rules passed no traffic in ninety days — and how many of the rest are conditioned on a Security Heartbeat that leaves with the firewall? The second half is the trap that bites late, so inventory it now.\nFrame it: swapping an XGS for a Socket is routing; the policy estate is where this project earns its keep.\nHere's what I'll show you.",
      "why": "Paint the today picture: per-appliance rule tables with near-identical web-policy variants per user population, and inspection that only happens where a policy is attached — so there are gaps nobody sees, like the guest network. TLS inspection scope was set by appliance headroom, not intent; Sophos markets its hardware on multiplying inspection throughput precisely because it runs out.\nAsk the discovery question and let the counters answer it.\nWith Cato the per-box tables collapse into one global policy rationalised on usage evidence, TLS is scoped by what they want decrypted, and CASB and DLP arrive greenfield — the upgrade, not the gap.\nLet me translate one of their rules live.",
      "demo": "Start with the postures — Security, WAN Firewall against Internet Firewall: opposite defaults, no zones, no per-box tables. Translate one of their egress rules live and ask which posture they actually want.\nThen Administration, API and Integrations: the SFOS XML export is structured data, so objects script end to end through GraphQL or Terraform rather than being re-keyed.\nBack in Internet Firewall, translate a web policy: two or three categories mapped by intent, Prompt doing their Warn pages, a custom category absorbing their URL groups.\nThen Monitor, Cloud Apps Dashboard: shadow-IT discovery running with zero configuration — the domain their firewall never had.\nClose in Events: filter to one monitor-mode rule and show the hit evidence that flips it to block — the phase they'll live in for the first months."
    }
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
    "hook": "How many ACEs show zero hits today — and what inspects a laptop's upload to a personal cloud drive?",
    "notes": {
      "divider": "Open with both halves of the hook: how many ACEs show zero hits today — and what inspects a laptop's upload to a personal cloud drive right now? The first answer sizes the clean-up; the second is almost always nothing, and it frames half this session.\nName what makes ASA unusual: the translation workload is smaller than a full NGFW estate, and the greenfield workload is bigger.\nHere's what I'll show you — both halves.",
      "why": "Today: a decade of interface ACLs and nested object-groups, a NAT table whose real dependencies are invisible in the ACL export — the classic cutover breaker — and nothing above layer four.\nThe hit-count discipline matters: counters reset on reload, so it's a thirty-to-ninety-day counting window, not a snapshot — and zero-hit is not dead; DR and break-glass rules get parked as disabled rules with sign-off, not silently dropped.\nWith Cato the survivors split cleanly into the two firewall bases, the NAT table dissolves deliberately, and SWG, CASB and DLP arrive greenfield from best-practice baselines — the uplift they're actually buying.\nLet's translate a few of their lines.",
      "demo": "Start in Security, WAN Firewall: translate one of their east-west ACEs live — no interfaces, no security levels, and per-rule hit counts doing the same evidential job their hitcnt did.\nThen Administration, API and Integrations: show access-list pre-expands the object-groups, so translation scripts end to end via GraphQL or Terraform.\nAcross to Access, Device Posture: build a profile live — AV presence, disk encryption — and say plainly that DAP and HostScan have no export path; this is intent restated, evaluated continuously rather than at connect time.\nThen TLS Inspection: bypasses first, phased inspect rules by category and pilot group, with no appliance throughput deciding the scope.\nClose in Monitor, Events: the evidence behind every promotion and every cull — then hand back to the counting-window agreement on the slides."
    }
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
    "hook": "After the MySonicWall backup breach, who rotated the credentials sitting inside your configuration exports?",
    "notes": {
      "divider": "Open with the hook and pause: after the MySonicWall cloud-backup breach, who rotated the credentials sitting inside their configuration exports? SonicWall's own investigation concluded every customer who used the service was affected.\nThat sets rule zero for this whole session: on this estate the export isn't just a mapping input, it's potential breach material — so we rotate everything and port nothing.\nHere's what I'll show you.",
      "why": "The today side has two layers. Operationally: a zone matrix per box multiplied across a branch estate, hiding duplication — and DPI-SSL rationed by per-model connection limits, so many estates never fully enabled it. Then the security layer: the exploitation mechanic in the 2024-25 campaigns was configuration carry-over — old secrets imported into new boxes — and this migration must not repeat that on a third platform.\nAsk both discovery questions: how many rules passed no traffic since the counters were cleared, and who rotated the export credentials. Ask early whether cloud backup was ever used.\nWith Cato: one global rulebase levels every site up, and the SSLVPN zone is replaced by IdP-backed ZTNA, never translated.\nLet me show you.",
      "demo": "Start in Security, WAN Firewall: translate one of their zone-matrix rules live into the global ordered rulebase — no zone columns, no per-rule service attachments, because those run as account-level layers.\nThen Administration, API and Integrations: the SonicOS API export is structured JSON — objects, rules, NAT — so translation scripts straight into GraphQL or Terraform.\nTLS Inspection next: quite likely their first full inspection — certificate via MDM, sensitive-category bypasses first, and no connection-count ceiling deciding who gets inspected; expect new detections to triage, not incidents.\nThen Monitor, Cloud Apps Dashboard: shadow-IT discovery and the DLP domains the firewall never had.\nClose in Events on the two auditable outcomes: the discard pile from rationalisation, and the rotation log — local accounts removed, keys retired, measured against SonicWall's own reset guidance."
    }
  }
};
