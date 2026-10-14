# Research brief: Cato Private Access with App Connectors

Compiled 14 Oct 2026 from the 16 Cato KB pages listed in the source index (raw Markdown fetched
13–14 Oct 2026; each page cited with its KB `updated` date). Backs the planned
`usecases/access-private-access-app-connectors.html` page — **the page may only claim what this
brief supports.** Anything not found in a source is quarantined in the UNVERIFIED section at the
bottom and must not appear on the page as fact.

Feature status: five of the sixteen pages (What Is Cato Private Access?, Working with App
Connectors, Monitoring App Connectors, Configuring Private Applications, Configuring the Private
Access Policy) carry the banner *"Please contact feature-releases@catonetworks.com for more
information about enabling and using this feature."* — i.e. Private Access with App Connectors
is **early-availability / request-enabled**, not default-on. The page must say so. (VERIFIED —
banner text identical on all five; see §12.)

Product-name precision used throughout:

- **Cato Private Access** — the user-to-application ZTNA service brokered at the PoP; the umbrella
  name. Not to be confused with the older "Private Access via Sites" model (Socket/vSocket/IPsec
  sites), which the ZTNA overview treats as the second deployment model of the same ZTNA broker.
- **App Connector** — the outbound-only DTLS endpoint deployed next to the application (physical
  X1500 Socket, or a virtual image in AWS/Azure/GCP/ESXi). It is **Socket software** (the KB
  requires Socket v26.0.23570+ and the Overview widget is called "Socket versions").
- **App Connector Group** — the logical set of up to 10 connectors a Private App is published
  through.
- **Private App** — the CMA object (internal address, published domain, service/port items,
  group, probing).
- **Private Access Policy** — the ordered rulebase at **Access > Private Access > Private Access
  Policy**.
- **Synthetic (CGNAT) IP** — the 100.65.0.0/16-range address Cato DNS returns for a published
  domain. The KB uses "synthetic IP", "synthetic (CGNAT) IP" and "CGNAT" interchangeably.

Every fact below is tagged VERIFIED with its source. Citation form: page title — URL (updated
date). All URLs are under https://knowledge.catonetworks.com/docs/ (never the `.md` variant).

---

## 1. What Private Access is, and its scope

- VERIFIED — "Cato Private Access lets you provide secure, identity-based access to private
  applications without extending your network to users. Instead of granting direct network-level
  connectivity like a traditional VPN, you enforce least-privileged, application-specific access
  based on user identity and context."
  — What Is Cato Private Access?, https://knowledge.catonetworks.com/docs/what-is-cato-private-access (updated 2026-10-05)
- VERIFIED — "Applications remain hidden and unreachable unless explicitly authorized. Users
  connect to the Cato Cloud, and authorized sessions are securely brokered to the application
  through outbound-only App Connectors. This architecture reduces attack surface, limits lateral
  movement, and removes the need for inbound firewall rules, route advertisements, or network
  redesign." — same page.
- VERIFIED — "Private Access is designed for rapid deployment and incremental adoption. You can
  onboard applications without modifying WAN topology or IP addressing." — same page.
- VERIFIED — **User-initiated only.** "Private Access supports user-initiated access only.
  Applications do not initiate connections toward users, and server-initiated or bidirectional
  communication patterns are not supported." — same page.
- VERIFIED — **Server-initiated / bidirectional = full site.** "Scenarios that require
  server-initiated or bidirectional communication fall outside the scope of Private Access and
  are supported by the full Cato networking architecture of IPsec and Socket sites." — same page.
  And under M&A: "If bidirectional or server-initiated connectivity is required later, you can
  onboard the environment as a full Cato site."
- VERIFIED — "Users do not directly connect to the network that hosts the application. Instead,
  access is established only to applications that are explicitly defined and exposed through App
  Connectors." — same page.
- VERIFIED — Two ZTNA deployment models exist under one broker: "two deployment models for
  enabling secure access to private applications via Cato sites or App Connectors." In the
  App Connector model, "application access is enforced in the Cato Cloud rather than being
  dependent on underlying network topology" ("network-neutral access model"). In the site model,
  "the site type (Socket, vSocket, or IPsec) provides secure access to private applications
  located behind that site."
  — Zero Trust Access to Private Applications with the Cato SASE Cloud,
  https://knowledge.catonetworks.com/docs/zero-trust-access-to-private-applications-with-the-cato-sase-cloud (updated 2026-06-22)
- VERIFIED — The topology diagram in that article is described as having "Independent routing
  domains for each private network", "No requirement for unique IP spaces", and "The Cato PoPs act
  as the ZTNA broker for access to the applications." — same page.
- VERIFIED — Once access is granted, "all traffic is subject to Cato's full security stack,
  including Threat Prevention and CASB/DLP inspection." — same page.
- CAUTION (VERIFIED wording, scoped): the ZTNA overview says granular ZTNA policies support
  "any protocol and port (including TCP/IP and UDP), **in either direction**". That sentence
  describes the Cato ZTNA Broker generally (which includes the Sites model). The Private Access
  page is explicit that App-Connector-based Private Access is user-initiated only. **Do not quote
  "in either direction" on an App Connector page.**
- VERIFIED — Prerequisite: "make sure that your account uses an identity provider (IdP) for user
  authentication. Private Access requires authenticated user identity, and unauthenticated users
  can't access private applications."
  — Configuring Cato Private Access, https://knowledge.catonetworks.com/docs/configuring-cato-private-access (updated 2026-06-22)
- VERIFIED — Wider ZTNA framing (for the page intro only): Cato ZTNA "first authenticates users
  (we recommend using MFA), and then grants them least privileged access, and ensures the user's
  device posture"; capabilities listed: "Client and Clientless solutions · Device Posture · Device
  authentication and User Awareness for identity based policies · Pre-login · Always-On ·
  Continuous threat inspection of all ports and protocols".
  — What is Cato's ZTNA Solution, https://knowledge.catonetworks.com/docs/what-is-cato-s-ztna-solution (updated 2026-06-25)

---

## 2. The four core components

All four VERIFIED — What Is Cato Private Access?, https://knowledge.catonetworks.com/docs/what-is-cato-private-access (updated 2026-10-05); restated in Configuring Cato Private Access (updated 2026-06-22): "the App Connector provides connectivity to the application environment, the Private App defines what is published, and the Private Access Policy defines who can access it."

1. **Private Applications** — "represent the internal apps you publish through Cato. For each
   application, you publish internal resources securely by defining how users access the
   application and which Connector Group provides authorized connectivity. Applications are
   abstracted from internal IP addressing, and users access the published domain rather than the
   internal network."
2. **App Connectors** — "You deploy App Connectors in the same environment as the protected
   application (data center, cloud VPC, or LAN)... Each connector establishes an outbound-only
   DTLS tunnel and forwards only sessions that were explicitly authorized by policy. Because
   connectors do not accept inbound connections and do not require routing changes, you can
   introduce Private Access without redesigning the application network. You can deploy multiple
   connectors to increase resiliency and scale."
3. **App Connector Groups** — "logically group connectors to provide high availability, load
   distribution, and operational separation. Private applications are attached to a Connector
   Group rather than to a specific connector. This means that if a specific connector experiences
   an issue, the application can automatically use another available connector in the group."
4. **Private Access Policy** — "control who can access which private applications and under what
   conditions... grant application-level access based on user identity and context while
   maintaining a default-deny posture. Authorization is evaluated at the PoP before any session is
   established to the application environment."

Admin workflow order (VERIFIED — Configuring Cato Private Access, updated 2026-06-22):
"1. Deploy the App Connector and assign it to an App Connector Group. 2. Configure the settings
for the Private App. 3. Define access rules in the Private Access Policy." Best Practice: "Deploy
the App Connector before you publish the application."

---

## 3. Traffic flow, DNS, CGNAT and reserved ranges

### 3.1 Four-step summary
VERIFIED — What Is Cato Private Access? (updated 2026-10-05):
"1. A user connects to the Cato Cloud using the Cato Client or clientless access. 2. The PoP
authenticates the user and evaluates the Private Access Policy. 3. If the user is authorized, the
session is brokered through an outbound DTLS tunnel to an App Connector. 4. The App Connector
forwards the traffic locally to the application." — "Applications never accept inbound
connections and are not exposed to user networks. Access is always user-initiated and
policy-driven."

### 3.2 Detailed flow (control plane vs data plane)
VERIFIED — App Connector Reference Architecture, https://knowledge.catonetworks.com/docs/app-connector-reference-architecture (updated 2026-07-28):

- "The Cato PoP is the ZTNA Broker that registers the published application in the Private
  Access control plane and assigns a synthetic IP address to the published application domain.
  This IP address represents the application within the Cato brokered architecture and prevents
  users from learning or connecting directly to the application's internal IP address."
- Control plane "validates the user identity, evaluates the Private Access Policy, and determines
  whether the requested application, port, and protocol are authorized"; data plane "transports
  sanctioned traffic through the Cato Cloud and the selected App Connector to the internal
  application server." "Unauthorized application requests are denied before a session to the
  application environment is established."
- Step flow (verbatim structure):
  1. User connects to the Cato SASE Cloud "using the Cato Client, or another supported access
     method".
  2. User sends "a DNS request for the published application domain to the Cato DNS service".
  3. PoP identifies the Private App for that domain and evaluates the Private Access Policy.
  4. "If the user is authorized, Cato DNS returns the synthetic (CGNAT) IP address assigned to the
     published application domain. If the user is not authorized, Cato DNS denies the request.
     The domain does not resolve, and no session to the application environment is established."
     Then: user connects to the synthetic IP; "The Cato Cloud sanctions the session"; PoP "Selects
     the optimal App Connector from the associated App Connector Group"; and "Stitches the
     authorized user session to the internal application through the outbound DTLS tunnel
     established by that App Connector."
  5. "The App Connector resolves the configured internal application destination when internal
     DNS resolution is required, and forwards the traffic over the local network to the internal
     application server."
- "The user communicates with the synthetic IP address assigned to the published application
  domain and does not receive direct network reachability to the application environment."

### 3.3 DNS
- VERIFIED — **Cato DNS 10.254.254.1 on the user side.** "User devices must use the Cato DNS
  service at 10.254.254.1 so that queries for published application domains are processed by the
  PoP." — App Connector Reference Architecture (updated 2026-07-28)
- VERIFIED — **Connector side: DHCP by default.** "The App Connector uses a separate DNS path for
  internal application resolution. By default, it uses DHCP to obtain its LAN IP address, default
  gateway, and internal DNS server. When an internal application is identified by an FQDN, the App
  Connector uses the internal DNS server to resolve the application over the local network." —
  same page.
- VERIFIED — **Coming Soon: static IP/DNS.** "**Coming Soon:** Support for static LAN IP and DNS
  configuration in environments without DHCP." — same page. (No date given; see UNVERIFIED #1.)
- VERIFIED — Private App FQDN must be internally resolvable: "If you want to use an FQDN, it
  needs to be resolvable internally" and "The destination's Internal App Address needs to be
  resolved using the Internal DNS Server set for the App Connector."
  — Configuring Private Applications, https://knowledge.catonetworks.com/docs/configuring-private-applications (updated 2026-10-01)

### 3.4 CGNAT / synthetic IP and reserved ranges
- VERIFIED — "When a Private Application is published through an App Connector Group, the PoP
  registers it in the Private Access control plane and assigns it a unique synthetic IP address
  from the account's Private Application CGNAT range... These ranges must not overlap with
  customer network ranges or other Cato service ranges and can be customized when required." —
  App Connector Reference Architecture (updated 2026-07-28)
- VERIFIED — **Default ranges and override location.** "By default, Private Access uses the
  following IP addresses for the management and application interfaces, respectively: MGMT -
  100.64.0.0/16. This range is reserved once you deploy an app connector · Application -
  100.65.0.0/16. This range is reserved once you deploy an application to the app connector. In
  the event that these addresses are already reserved in your network, you can override these
  values in **Resource > System Settings**." — What Is Cato Private Access? (updated 2026-10-05)
- VERIFIED — **Known Limitation:** "Synthetic IP addresses are generated automatically by Cato
  and are not exposed for direct reference in Network Policy rules." — App Connector Reference
  Architecture (updated 2026-07-28)
- VERIFIED — M&A relevance of the abstraction: "especially useful in environments with
  overlapping address spaces, such as mergers and acquisitions, because applications can be
  published without readdressing the underlying networks." — same page.

---

## 4. App Connector types and prerequisites per platform

### 4.1 Common to all connector types
- VERIFIED — **Socket version floor.** "You must have Socket v26.0.23570 or higher installed to
  work with App Connectors. If you don't have access to this Socket version, please contact
  Support and ask that they provide it to your account." — identical note on Creating Physical
  App Connectors (updated 2026-10-05), Creating App Connectors in AWS (updated 2026-10-05), …in
  Azure (updated 2026-10-05), …in Google Cloud Platform (updated 2026-10-05).
- VERIFIED — **Create-in-CMA first.** Nav path as the KB writes it: "From the navigation menu,
  click **Access > App Connector**, and then click **New**." Fields: General (**Connector Name**,
  **Country**); **Type** = **Physical** or **Virtual**; **Connector Group** ("select an existing
  App Connector group from the list or enter a name to create a new group"); **Preferred PoPs**;
  **Apply**. — all five creation pages (physical, AWS, Azure, GCP, ESXi). Note the singular
  "App Connector" in the create procedures vs. "Access > App Connectors" for the list page
  (Monitoring App Connectors; Azure S/N step; "You can see your app connectors in the Access >
  App Connectors page" on AWS/Azure/GCP pages). Record both spellings; the page should use
  **Access > App Connectors** for the list and note the KB's "Access > App Connector > New" for
  creation.
- VERIFIED — **Preferred PoPs options** (identical on all five creation pages):
  "**Disabled** - the App Connector tries to connect to the best available PoP" (default);
  "**Enabled** - Select the **Primary** and **Secondary** PoP locations that the connector tries
  to connect to"; "**Enabled** and **Only connect to the preferred PoPs** - Only connect to the
  **Primary** or **Secondary** PoP location". With the restrict option "the connector doesn't
  connect to a non-preferred PoP location despite any connectivity or performance issues that it
  is experiencing... you must define a primary and secondary PoP location."
- VERIFIED — **Serial number for virtual connectors.** "Once the App Connector is created in the
  CMA, copy the serial number, as you will need to provide it when deploying the App Connector in
  your cloud environment." (AWS/Azure/GCP/ESXi). Working with App Connectors adds: "For virtual
  connectors, this number must be provided when configuring the connector in the relevant cloud
  provider." (updated 2026-07-09)
- VERIFIED — **Assigning apps.** "You assign apps to your connectors either from the Private Apps
  page or from App Connectors page, using the **Assign App** link." — physical, AWS, Azure, GCP
  pages.
- VERIFIED — Post-deploy auto-upgrade (Azure, GCP): "After the app connector resources are
  deployed, it automatically connects to the Cato Cloud and checks if it's necessary to upgrade to
  the newest version. The Cato Management Application notification area shows messages regarding
  the status of connecting the app connector."
- VERIFIED — Supported-types list on the workflow page names only two links: "Creating Physical
  App Connectors" and "Creating App Connectors in Azure" — Configuring Cato Private Access
  (updated 2026-06-22). The AWS/GCP/ESXi pages exist and are newer; treat the workflow page's list
  as stale, not as a restriction.

### 4.2 Physical (X1500 only)
VERIFIED — Creating Physical App Connectors, https://knowledge.catonetworks.com/docs/creating-physical-app-connectors (updated 2026-10-05):
- "All x1500 Socket models support deploying a physical App Connector. Other Socket models (such
  as X1600 and X1700) are not currently supported for physical App Connectors."
- "Unlike a virtual App Connector, a physical App Connector does not require a serial number to be
  entered during a cloud deployment template. Instead, after the device is connected to the
  network and communicates with Cato, the CMA detects the new device and prompts you to identify
  and assign it."
- Workflow: "create the App Connector object in the CMA · Physically connect the device to the
  network · Assign the device to a connector · Assign apps to the connector".
- Assignment procedure: notification icon → **Notifications** panel → **Activate New Socket** →
  "Under **Assign to**, click **App Connector**" → "Under **Site**, select the app connector you
  created" → **Ok**.
- Physical cabling defers to the "Cato Socket deployment guides and data sheets".
- Editorial note (VERIFIED as present): the physical page also contains the copy-pasted sentence
  "copy the serial number, as you will need to provide it when deploying the App Connector in your
  cloud environment" — contradicts its own "does not require a serial number" statement. Do not
  carry that sentence onto the page for the physical type.
- VERIFIED — "**Coming Soon:** Support for redundant physical App Connector Cato Sockets in an HA
  pair." — App Connector Reference Architecture (updated 2026-07-28). (No date; UNVERIFIED #2.)

### 4.3 AWS
VERIFIED — Creating App Connectors in AWS, https://knowledge.catonetworks.com/docs/creating-app-connectors-in-aws (updated 2026-10-05; front matter `status: "update"`):
- Type **Virtual** in CMA; "Deploy the Cato App Connector from AWS Marketplace"; "The app
  connector image is publicly available in the Marketplace."
- Terraform: "You can also use the Cato Terraform module to create and manage the AWS app
  connector" — https://github.com/catonetworks/terraform-cato-appconnector-aws.
- Security note: "For improved security, deploy your App Connector with IMDSv2".
- Marketplace wizard: search "Cato Networks App Connector" → **Launch**; new or existing VPC;
  three subnets **minimum /28 each** — MGMT ("Management communication between the app connector
  and the AWS API"), WAN ("External WAN traffic... Internet and Cato Cloud"), LAN ("Internal AWS
  resources"); **Existing Internal Security Group**; **Instance Type** (no list given — UNVERIFIED
  #5); **MyKeyPair**; **Serial Number** pasted from CMA; **Submit**.
- "After you deploy the App Connector, **reboot it** to initiate the connection to the CMA."

### 4.4 Azure
VERIFIED — Creating App Connectors in Azure, https://knowledge.catonetworks.com/docs/creating-app-connectors-in-azure (updated 2026-10-05):
- Marketplace: search "Cato", select **Cato App Connector**; choose **Plan** and **Subscription**;
  Basics = Subscription, Resource group, Region, optional Resource prefix.
- **2 or 3 NICs**: "2 NIC deployments use the Standard_D2s_v5 instance type · 3 NIC deployments
  use the Standard_D8ls_v5 instance type"; subnets minimum /28; MGMT subnet is "3 NIC deployments,
  only"; WAN and LAN always.
- Inherited note (VERIFIED as present, but worded for vSockets): "By default, 3 NIC vSockets
  support up to 2Gb throughput with the Azure Accelerated Networking option enabled." — the KB
  says *vSockets*, not App Connectors; do not quote a throughput figure for the connector
  (UNVERIFIED #6).
- **Cato AppConnector Configuration** screen: **AppConnector Serial Number (S/N)** "Paste the S/N
  that you copied from the **Access > App Connectors** page"; **AppConnector Name** (no spaces or
  Azure-restricted characters); **WAN interface IP allocation** Dynamic/Static; **MGMT interface
  IP allocation** (3 NIC only) Dynamic/Static.
- Optional: public IPs for WAN/MGMT; NSGs for WAN/MGMT/LAN; **Availability Set** (create or
  existing; "must be in the same Resource Group as the app connector") or **Availability Zone**
  "in the range of 1 - 3".
- Editorial note: the page contains a leftover placeholder "For more information about these
  settings, see above ???." Ignore.

### 4.5 Google Cloud Platform
VERIFIED — Creating App Connectors in Google Cloud Platform, https://knowledge.catonetworks.com/docs/creating-app-connectors-in-google-cloud-platform (updated 2026-10-05):
- Marketplace: search "Cato Networks App Connector" → **Launch**; **Deployment Service Account**
  new or existing; **Zone**, **Region**, **App Connector VM Name**, **Cato Serial ID** (paste from
  CMA); three subnets MGMT/WAN/LAN, minimum /28; **Deploy**.
- No machine type is stated for the GCP App Connector (UNVERIFIED #5).

### 4.6 VMware ESXi
VERIFIED — Configuring an ESXi App Connector, https://knowledge.catonetworks.com/docs/configuring-an-esxi-app-connector (updated 2026-08-09):
- Scope: "data center or universal CPE (uCPE) running VMware ESXi."
- Prerequisites: OVA image "for the ESXi vSocket and App Connector" from the Socket and vSocket
  Image Files page; "Internet connectivity for the WAN1 interface"; "Public DNS service must be
  available for the LAN interfaces"; "Only attach 3 network interfaces (NICs) to the VM. Attaching
  more than 3 NICs may result in issues."
- Minimums: "Minimum ESXi version - ESXi 8.0"; OVA format; "2 vCPUs · 4 GB RAM · At least 7 GB
  HDD".
- Best practice: deploy "directly from the OVA file in vSphere, instead of creating a VM first and
  then attaching the OVA"; memory can be added later without redeploying.
- Deploy OVF Template wizard; map **Source Networks** LAN / Management / WAN; "enter the serial
  number for the App Connector... You need to enter the exact serial number (including dashes)."
- The fetched Markdown ends with a dangling "##" heading after step 12 — any trailing section was
  not captured (UNVERIFIED #13).

---

## 5. App Connector Groups, load balancing, failover, HA

VERIFIED — App Connector Reference Architecture, https://knowledge.catonetworks.com/docs/app-connector-reference-architecture (updated 2026-07-28), unless noted:

- "An App Connector Group is the logical connectivity layer between the Cato Cloud and a set of
  Private Applications. Private Applications are associated with a group rather than with an
  individual App Connector, and each application can be published through one App Connector
  Group at a time."
- **"Note: An App Connector Group can include up to 10 App Connectors."**
- **Probing / selection:** "The PoP continuously probes the connectors in the group and evaluates
  their availability and performance. For each sanctioned session, the PoP selects the optimal
  connector and stitches the session through that connector to the internal application."
- **Multiple groups** "can be used to represent separate environments, regions, or security
  zones, such as production, disaster recovery, cloud, or on-premises networks. The group
  associated with a Private Application must contain at least one connector that can reach the
  application over the LAN."
- **Best Practice:** "Deploy and connect the App Connectors before publishing Private
  Applications through the group. If no connector in the group is connected, the Private
  Application is unavailable and appears as disabled."
- **Auto-failover:** "If a connector becomes unreachable, the PoP stops selecting it for new
  sessions and routes subsequent sanctioned sessions through the next best available connector in
  the group. Existing sessions may need to be re-established through the newly selected
  connector. Failover occurs automatically within the App Connector Group and does not require
  administrator intervention."
- **~30 s target:** "App Connector failover is designed to restore application access within 30
  seconds. Session continuity depends on the application protocol and session state, and some
  active sessions may need to be re-established." (Wording is "designed to", not an SLA.)
- **HA guidance:** "Deploy at least two App Connectors per group and ensure that each connector
  can reach the same application destinations... For cloud deployments, place connectors in
  separate availability zones or regions to reduce dependency on a single infrastructure location.
  For physical deployments, place connectors in separate racks, power domains, or failure zones."
- **Multi-region:** "To maintain availability across regions or cloud environments, deploy App
  Connectors in each environment that hosts the application. The connectors must belong to an App
  Connector Group associated with the corresponding Private Application and must have LAN
  reachability to that application instance."
- "Coming Soon: Support for redundant physical App Connector Cato Sockets in an HA pair."
- VERIFIED — the Overview widget "App Connector Groups - the total number of app connector groups
  and the number of apps assigned to each group" and the **Group by** drop-down "to see which
  connectors are in which Connector Group and which apps are covered by the different groups" —
  Working with App Connectors (updated 2026-07-09).

---

## 6. Private Access Policy structure

VERIFIED — Configuring the Private Access Policy, https://knowledge.catonetworks.com/docs/configuring-the-private-access-policy (updated 2026-06-22), unless noted:

- Nav: "From the navigation menu, select **Access > Private Access > Private Access Policy**."
  Then **New > New Rule**; **Save** and then **Publish**.
- **Ordered rulebase, first match, default block:** "Rules are evaluated from top to bottom, and
  the first matching rule determines whether access is allowed or blocked... If no rule matches,
  access is blocked." Configuring Cato Private Access (updated 2026-06-22) phrases it "only the
  highest priority matching rule is applied to allow or block access."
- **Revisions / multi-admin:** "Like other CMA policies, it supports policy revisions for change
  tracking and rollback, and multi-admin workflows so teams can collaborate on updates."
- **Sections:** "you can use sections in the policy to group rules" (links to the WAN/Internet
  Firewall sections article).
- **Three core components:** "**Users / Groups:** Who the rule applies to. Identities are synced
  from your IdP · **Criteria:** Conditions that must match to apply the rule action (for example,
  Device Posture requirements) · **Private Apps:** The published Private Applications for the
  rule".
- **Criteria fields** (AND between multiple criteria — "If you define multiple criteria for a
  rule, there is an AND relationship between them"):
  - **User Attributes** — "User risk signals, for example, allow access only when the user risk
    level is **Low**." (procedure wording: "Risk level of the user identity")
  - **Origin of the connection** — "allows access only when users are connecting via the
    **Client**" (procedure: "Restrict access to sites or Clients")
  - **Platforms** — operating systems, e.g. "**Windows** devices". Best Practice: "specify the
    device platforms that are actually used by the users connecting to the application."
  - **Device Posture Profiles** — "require a posture profile that verifies that anti-virus is up
    to date"; uses "the same Device Profiles defined across your account".
  - **Countries** — "Restrict access by source country based on IP geo-location."
- **Action:** "**Allow** or **Block** traffic."
- **Time:** "The **Time** options define the time range that the rule is enabled. You can
  configure custom options for a rule, or choose the default working hours that are defined for
  the account."
- **Track / notify:** "**Track:** Configure optional tracking options to **Send Notification**.
  The frequency starts counting after the first notification is sent." (Subscription Groups,
  Mailing Lists, Alert Integrations.)
- **Events and Hit Count:** "Private Access Policy rules automatically generate events when the
  rule is matched. The **Hit Count** for a rule is based on the number of events generated by the
  rule."
- Continuous evaluation (ZTNA overview, updated 2026-06-22): "In each session request, all policy
  criteria (the user's device posture, behavior, risk, and more) are continuously evaluated."
- Best practices (Configuring Cato Private Access, updated 2026-06-22): "Scope **Users / User
  Group** to the required identities · Select only the required **Private Apps** for users to
  access."

---

## 7. Private App settings

VERIFIED — Configuring Private Applications, https://knowledge.catonetworks.com/docs/configuring-private-applications (updated 2026-10-01), unless noted:

- Nav: "From the navigation menu, select **Access > Private Apps**." → **New** → **Add Private
  App** panel with sections **1 - General**, **2 - App Settings**, **3 - Publish**, **4 -
  Probing** → **Apply**.
- **Internal App Address vs Published App Domain:** "**Internal App Address:** The internal
  address of the application in the private environment. Cato uses this address for DNS
  resolution and to steer traffic to the application. **Published App Domain:** The domain name
  that users use to access the application." "These values can be the same or different."
  Published domain examples: "**app.example.intranet**"; "You can use either an FQDN or a domain
  (e.g. *.example.intranet)". Internal address: "hostname or IP address... If you want to use an
  FQDN, it needs to be resolvable internally".
- **Service / Port items:** "enter the allowed protocol and port for the application and then
  click **Add**. For example, **TCP/80-88**. Repeat for each allowed service and port." Best
  practice: "Limit **Service / Port** items to only the protocols and ports required."
- **Publish:** toggle **Enabled**; **Publish via** → **App Connectors Group**; select the group.
  **Disabled until a connector connects:** "If the App Connector is not yet deployed, the private
  app is **Disabled**." (Reference Architecture: "If no connector in the group is connected, the
  Private Application is unavailable and appears as disabled.")
- **Probing — ICMP only today:** "**(Optional)** Customize the ICMP probe settings: **Interval
  (Sec)**... **Fault Threshold** - select the number of consecutive probe failures before the
  application status is **Unavailable**." Best Practice: "If your application can't respond to an
  ICMP probe, we recommend disabling probing for that Private App. TCP probes will be supported in
  the future." Note: "Disabling probing means that you can't monitor the application connectivity
  or performance in the CMA."
- **Published domain visibility:** "After publishing the private app, the **Published App
  Domain** is only available to the specific users that are allowed to access that application".
- **Reachability requirement:** "The destination needs to be routable (accept inbound traffic
  from the App Connector)".
- **Browser-based access:** "Browser-based access is supported as a method for Private Access
  users to connect to Private Apps, including: Enterprise Browser, Browser Extension, and
  Application Portal... **Note:** Browser Access is supported only for Private Applications that
  are defined for HTTP(S), RDP, or SSH."
- **Maintenance:** "When application details change, update the Private App configuration so the
  internal destination, published domain, services and ports, and App Connector Group remain
  aligned."

---

## 8. Monitoring

### 8.1 Access > App Connectors (list + Overview)
VERIFIED — Working with App Connectors, https://knowledge.catonetworks.com/docs/working-with-app-connectors (updated 2026-07-09):
- Overview widgets: "**Connectivity Status** – the total number of connectors and their statuses
  (connected or, disconnected, degraded, and disabled) · **Model** – ... (e.g., X1500, AWS, etc.)
  · **Socket versions** – ... for both physical and virtual app connectors · **App Connector
  Groups** - the total number of app connector groups and the number of apps assigned to each
  group".
- Default columns: Name · Connectivity Status (Connected or Disconnected) · Group · Model (e.g.,
  GCP or X1500) · Serial Number · Country · Connected PoP ("If the connector is disconnected, the
  field will show the name of the last connected PoP. If the connector was never connected before
  to a PoP, the field remains empty") · Private Apps.
- "The App Connectors page... shows the overall connector status, in addition to the connectivity
  status of individual ports." — Configuring Cato Private Access (updated 2026-06-22).

### 8.2 Network Analytics (per connector)
VERIFIED — Monitoring App Connectors, https://knowledge.catonetworks.com/docs/monitoring-app-connectors (updated 2026-06-22):
- Nav: "**Access > App Connectors**" → select the connector → "Click **Network Analytics**, and
  then select the **Site & Tunnels** tab" (or the **Hardware** tab).
- Site & Tunnels metrics: **Connector Status**, **Avg Throughput** (upstream/downstream), **Avg.
  Packet Loss**, **Avg. Discards** — each with a troubleshooting example (e.g. "If users report
  that apps are unreachable, first check whether the connector has connectivity").
- Hardware metrics: **Avg. CPU** and **CPU Load** ("CPU utilization over time for each core");
  "If throughput increases at the same time that CPU remains elevated, the connector might be
  approaching capacity limits."

### 8.3 Access > Private Apps
VERIFIED — Configuring Private Applications (updated 2026-10-01): "you can monitor it from the
**Private Apps** page in the CMA. The application status shows whether the application is
available through the configured App Connector Group... You can also identify Private Apps that
are not referenced in the Private Access Policy. These applications are defined in the CMA, but
they aren't currently available to users through policy."

### 8.4 Policy events
VERIFIED — rule matches generate events and drive **Hit Count** (§6). The KB pages read do not
name the event type/sub-type strings (UNVERIFIED #9).

---

## 9. Limitations (KB-flagged)

- VERIFIED — **No QoS / network rules; lowest priority.** "QoS is not applied to app connector
  traffic. You can't define a bandwidth profile and Network Rules for the traffic, and it is
  assigned the lowest network priority." — Working with App Connectors (updated 2026-07-09)
- VERIFIED — **Socket v26 LAN-subnet-only.** "For Socket v26, currently, apps not
  located/available in the LAN subnet are not supported via App Connector." — same page.
- VERIFIED — **Synthetic IPs not referenceable in Network Policy.** "Synthetic IP addresses are
  generated automatically by Cato and are not exposed for direct reference in Network Policy
  rules." — App Connector Reference Architecture (updated 2026-07-28)
- VERIFIED — **User-initiated only**; no server-initiated/bidirectional (§1).
- VERIFIED — **One group per app** (§5); **up to 10 connectors per group** (§5).
- VERIFIED — **Physical = X1500 only; X1600/X1700 not currently supported** (§4.2).
- VERIFIED — **Probing is ICMP only; TCP probes "in the future"** (§7).
- VERIFIED — **Browser Access only for HTTP(S), RDP, SSH apps** (§7).
- VERIFIED — **Static LAN IP/DNS and physical HA pair are "Coming Soon"** (§3.3, §4.2).
- VERIFIED — **Existing sessions may need re-establishing on failover** (§5).

---

## 10. Licensing

VERIFIED — Base Products, https://knowledge.catonetworks.com/docs/base-products (updated 2026-10-04); What Is Cato Private Access? links here for "Private Access service licensing".

- "Sites are licensed based on bandwidth and support all site types, including physical sites
  (Sockets), IPsec, Cloud Interconnect, and App Connector deployments. Users are licensed as ZTNA
  users and provide secure remote access to the platform."
- **Bandwidth Pool** "supports connectivity across all Cato site types, including Socket, IPsec,
  Cloud Interconnect, and App Connector deployments." Capabilities include "Private access policy
  for zero trust access to App Connector" and "WAN Firewall for site-to-site and private
  application traffic inspection and policy enforcement".
- **"App Connector deployments for private application access, with no limitation on the number
  of App Connectors or published applications"** — quotable headline.
- Bandwidth Pool "is licensed by bandwidth, in units of 1 Mbps, and evaluated per region group...
  purchased as a pooled capacity and shared across all sites in the applicable region group."
  "The Bandwidth Pool includes traffic that traverses the Cato Cloud, including site-to-site,
  user-to-site, internet-bound, and private application traffic (via App Connector)." Full-duplex
  ("a 10 Mbps license supports up to 10 Mbps upstream and 10 Mbps downstream simultaneously");
  P95 measurement with bursting; "There is no minimum quantity requirement for Bandwidth Pool."
- **ZTNA User** licences: "licensed per user and evaluated per region group... Each license
  represents one distinct authenticated user who is allowed to connect remotely"; "By default,
  each account is allocated 5 ZTNA users free of charge"; "ZTNA Users apply only to users
  connecting remotely and do not apply to users connected through a Cato site." Access methods:
  "Cato Client, clientless access portal, and browser-based access methods."
- Net for the page: Private Access over App Connectors consumes **Bandwidth Pool** (for the
  connector traffic) plus **ZTNA User** licences for remote users; no per-connector or per-app
  unit. Whether a connector consumes anything beyond pooled bandwidth is not stated (UNVERIFIED
  #3).

---

## 11. Use cases (KB-stated)

VERIFIED — What Is Cato Private Access? (updated 2026-10-05):
1. **Secure Access to Private Applications Without Network Changes** — "Securely expose internal
   applications without modifying routing, advertising subnets, or changing WAN architecture.
   Private Access requires no inbound firewall rules, uses outbound-only tunnels from the
   application environment, does not require IP readdressing, and does not require site
   on-ramping."
2. **Mergers and Acquisitions with Overlapping IP Environments** — "overlapping IP ranges often
   delay integration. Private Access publishes applications without requiring IP readdressing,
   abstracts internal addressing using CGNAT and DNS mapping, and allows user access without
   routing-domain integration... If bidirectional or server-initiated connectivity is required
   later, you can onboard the environment as a full Cato site."
3. **Incremental ZTNA adoption** — "designed for rapid deployment and incremental adoption. You
   can onboard applications without modifying WAN topology or IP addressing." Reinforced by the
   ZTNA overview: "adopt Zero Trust principles across data centers, branches, and cloud
   environments without redesigning their infrastructure."

---

## 12. Early-availability note and page freshness

- VERIFIED — Banner "Please contact feature-releases@catonetworks.com for more information about
  enabling and using this feature." appears on: What Is Cato Private Access? (2026-10-05),
  Working with App Connectors (2026-07-09), Monitoring App Connectors (2026-06-22), Configuring
  Private Applications (2026-10-01), Configuring the Private Access Policy (2026-06-22). It does
  NOT appear on: App Connector Reference Architecture, Configuring Cato Private Access, the five
  connector-creation pages, the ZTNA overview, Base Products.
- VERIFIED — Private Access category index lists "1 sub category | 5 articles" with sub-category
  "Private Access App Connectors (7 articles)". — Private Access (index),
  https://knowledge.catonetworks.com/docs/private-access (no `updated` in front matter; shows
  What Is... "Updated on 2026-10-05 | Published on 2026-06-22").

---

## 13. CMA navigation paths (exactly as the KB writes them)

| Purpose | Path (KB wording) | Source |
|---|---|---|
| Create a connector | **Access > App Connector** → **New** | all five creation pages |
| Connector list / Overview / S/N | **Access > App Connectors** | Working with App Connectors; Azure; Monitoring |
| Connector Network Analytics | **Access > App Connectors** → select connector → **Network Analytics** → **Site & Tunnels** / **Hardware** | Monitoring App Connectors |
| Assign physical device | notification icon → **Notifications** → **Activate New Socket** → **Assign to: App Connector** → **Site** | Creating Physical App Connectors |
| Create a Private App | **Access > Private Apps** → **New** → **Add Private App** (1-General, 2-App Settings, 3-Publish, 4-Probing) | Configuring Private Applications |
| Policy | **Access > Private Access > Private Access Policy** → **New > New Rule** → **Save** → **Publish** | Configuring the Private Access Policy |
| Override CGNAT ranges | **Resource > System Settings** | What Is Cato Private Access? |
| Assign app to connector | **Assign App** link on Private Apps or App Connectors page | creation pages |

---

## 14. UNVERIFIED — quarantined; do NOT state on the page

1. **Static LAN IP / DNS for connectors — availability date.** KB says only "Coming Soon" (Reference
   Architecture, 2026-07-28). No date, no version.
2. **Physical HA pair (two X1500s as one connector) — availability date.** "Coming Soon" only.
3. **Licence consumption per App Connector** — Base Products says App Connector deployments are
   covered by Bandwidth Pool with "no limitation on the number of App Connectors or published
   applications"; it does NOT say whether a connector consumes a per-site allocation or counts as
   a "site" for any other SKU. KB silence.
4. **TCP probing availability date** — "TCP probes will be supported in the future" only.
5. **Instance / machine-type guidance for AWS and GCP App Connectors** — AWS page says "Select the
   Instance Type" with no list; GCP page lists none. Only Azure (D2s_v5 / D8ls_v5) and ESXi
   (2 vCPU / 4 GB / 7 GB) are explicit.
6. **Per-connector throughput** — the only figure in the set ("3 NIC vSockets support up to 2Gb")
   is vSocket wording inherited into the Azure page. No App Connector throughput cap is published.
7. **Terraform modules for Azure / GCP App Connectors** — only `terraform-cato-appconnector-aws`
   is linked. Do not claim Azure/GCP modules.
8. **Meaning of "degraded" and "disabled" connectivity statuses** — listed in the Overview widget
   but not defined.
9. **Event type / sub-type names for Private Access Policy events** — the KB says rules
   "automatically generate events" and Hit Count derives from them; the event field values are not
   named in these pages.
10. **Whether on-site (UZTNA, behind-a-Socket) users can reach App-Connector-published apps.** The
    ZTNA overview says UZTNA principles "apply" to users behind a site; the Private Access page
    describes Cato Client or clientless access. Policy Criteria "Origin of the connection" offers
    "sites or Clients", which implies yes, but no page states it outright.
11. **X1600 / X1700 physical support timeline** — "not currently supported"; no roadmap.
12. **Maximum Private Apps per group / per account** — "no limitation on... published
    applications" is a licensing statement, not a documented technical cap.
13. **Trailing content of the ESXi page** — the fetched Markdown ends with an empty "##" after
    step 12; anything after that (e.g. a post-deploy or assignment section) was not captured.
14. **Whether the 100.64.0.0/16 MGMT range is used by the connector tunnel or by something else**
    — What Is... says it is "reserved once you deploy an app connector"; the mechanism is not
    described.
15. **Load-distribution algorithm** — KB says the PoP "selects the optimal connector" based on
    "availability and performance"; no algorithm (round-robin, weighted, latency) is stated.
16. **Whether Preferred-PoP restriction affects failover** — the restrict option says the
    connector won't move to a non-preferred PoP "despite any connectivity or performance issues";
    interaction with group failover is not described.
17. **Clientless access portal support specifics** — What Is... says "Cato Client or clientless
    access"; Configuring Private Applications limits Browser Access to HTTP(S)/RDP/SSH. Whether
    the Application Portal/clientless path supports anything else is not stated.
18. **Marketplace listing pricing / BYOL** for the AWS/Azure/GCP App Connector images — not stated.

---

## Source index (fetched 13–14 Oct 2026; all under https://knowledge.catonetworks.com/docs/)

| Slug | Title | updated |
|---|---|---|
| what-is-cato-private-access | What Is Cato Private Access? | 2026-10-05 |
| app-connector-reference-architecture | App Connector Reference Architecture | 2026-07-28 |
| working-with-app-connectors | Working with App Connectors | 2026-07-09 |
| monitoring-app-connectors | Monitoring App Connectors | 2026-06-22 |
| configuring-cato-private-access | Configuring Cato Private Access | 2026-06-22 |
| configuring-private-applications | Configuring Private Applications | 2026-10-01 |
| configuring-the-private-access-policy | Configuring the Private Access Policy | 2026-06-22 |
| creating-physical-app-connectors | Creating Physical App Connectors | 2026-10-05 |
| creating-app-connectors-in-aws | Creating App Connectors in AWS | 2026-10-05 (status: update) |
| creating-app-connectors-in-azure | Creating App Connectors in Azure | 2026-10-05 |
| creating-app-connectors-in-google-cloud-platform | Creating App Connectors in Google Cloud Platform | 2026-10-05 |
| configuring-an-esxi-app-connector | Configuring an ESXi App Connector | 2026-08-09 |
| zero-trust-access-to-private-applications-with-the-cato-sase-cloud | Zero Trust Access to Private Applications with the Cato SASE Cloud | 2026-06-22 |
| private-access | Private Access (category index) | n/a |
| what-is-cato-s-ztna-solution | What is Cato's ZTNA Solution | 2026-06-25 |
| base-products | Base Products | 2026-10-04 |

Related GitHub: https://github.com/catonetworks/terraform-cato-appconnector-aws (linked from the AWS page; not fetched).
