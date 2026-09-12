# Research brief: Cloud integration connectivity — vSocket vs IPsec vs Cloud Interconnect (Azure / AWS / GCP / OCI)

Consolidated from three research passes (vSocket, IPsec, Cloud Interconnect), all sources
re-cited below with access dates. Backs `usecases/network-cloud-connectivity.html` — **the page
may only claim what this brief supports.** Anything not found in a source is quarantined in the
UNVERIFIED section at the bottom and must not appear on the page as fact.

Product-name precision used throughout:

- **vSocket** — Cato's virtual Socket appliance (a VM image of the Socket) deployed inside a
  cloud VNet/VPC.
- **IPsec site** — a Cato site type terminating IKEv1/IKEv2 tunnels from third-party devices,
  including a cloud provider's native VPN gateway.
- **Cato Cloud Interconnect** — a private Layer-2 circuit from a cloud provider's interconnect
  fabric (Direct Connect / ExpressRoute / Partner Interconnect / FastConnect) into a Cato PoP,
  delivered via a fabric provider (Equinix, Megaport, Console Connect, Interxion/Digital Realty).
- **"Cato Cross Connect"** — the FORMER name of Cloud Interconnect, renamed May 2024: "We are
  renaming our Cross Connect offering to Cloud Interconnect. No impact on existing deployments"
  — Product Update - May 13th 2024, https://knowledge.catonetworks.com/docs/en/product-update-may-13th-2024
  (accessed 12 Sep 2026). Older docs, SKUs and blog posts use the old name for the same product.
  Separately, "cross connect" in the generic colo sense (the physical fibre patch inside an
  Equinix/Interxion facility) is still what physically delivers a Cloud Interconnect circuit into
  the Cato PoP.

---

## 1. Option A — vSocket

### What it is
"A virtual Socket deployed in public cloud platforms such as Azure and AWS, or in virtualized
environments like GCP and VMware ESXi" — same management plane as physical Sockets: managed
"centrally through the Cato Management Application (CMA)" with zero-touch provisioning.
— What are Cato Sockets, https://knowledge.catonetworks.com/docs/what-are-cato-sockets (accessed 12 Sep 2026)

Registration: the site is created in the CMA first, which "assigns a unique serial number (S/N)"
supplied to the cloud-side deployment (script input on Azure, EC2 user data on AWS).
— Azure/AWS manual-deployment articles (accessed 12 Sep 2026)

### Per-cloud availability (headline row)
| Cloud | vSocket? | Evidence |
|---|---|---|
| Azure | Yes | KB "Azure vSocket Sites"; Marketplace + manual (VHD) deployment articles |
| AWS | Yes | KB "AWS vSocket Sites"; Marketplace/CloudFormation + manual (AMI) articles |
| GCP | Yes | GCP Marketplace + Terraform articles; HA added Mar 2026 |
| OCI | **No** | No OCI vSocket article exists in the KB index (llms.txt); "Connecting Sites to the Cato Cloud" enumerates vSocket platforms as "AWS, Azure, GCP, and VMware cloud data centers" — OCI absent. Cato's documented OCI paths are IPsec (IKEv1 + BGP) and Cloud Interconnect (FastConnect). |

Sources: https://knowledge.catonetworks.com/docs/connecting-sites-to-the-cato-cloud ·
https://knowledge.catonetworks.com/llms.txt (both accessed 12 Sep 2026).
(ESXi vSocket exists too — virtualisation platform, out of scope for the four-cloud page.)

### Throughput (KB figures)
- Azure: "2 NIC - up to 1 Gbps"; "3 NIC with accelerated networking - up to 2Gbps".
- GCP: "Up to 2 Gbps" (single machine type n2-standard-4).
- AWS: **no fixed figure** — "Actual throughput will depend on various factors, including the
  instance type, network configuration, and environmental conditions"; c5n.xlarge "Suggested for
  higher performance sites with bandwidth above 2Gbps".
- Socket/vSocket site *category* ceiling "Up to 10 Gbps" is the physical-Socket figure — do not
  quote it for vSockets.
— Cato Cloud Thresholds and Limits, https://knowledge.catonetworks.com/docs/en/cato-cloud-thresholds-and-limits ·
AWS marketplace article (both accessed 12 Sep 2026)

### Deployment methods
- **Azure**: Marketplace wizard (creates VNets, security groups, routing tables; run twice for HA;
  "not supported for Azure sites based in China") or manual VHD + `create_vm_from_vhd.sh` (Bash/
  Azure CLI; the China path). Sizes: Standard_D2s_v5 (2 NIC), Standard_D8s_v3 / Standard_D8ls_v5
  (3 NIC; default D8ls_v5); accelerated networking mandatory on D2s_v5/D8ls_v5 and supported by
  Cato only on 3-NIC types. Subnets minimum /28 each (MGMT/WAN/LAN).
  — https://knowledge.catonetworks.com/docs/deploying-azure-vsockets-from-the-marketplace ·
  https://knowledge.catonetworks.com/docs/deploying-an-azure-vsocket-site-manually (accessed 12 Sep 2026)
- **AWS**: Marketplace + CloudFormation template, or manual AMI build (three subnets MGMT/WAN/LAN,
  one ENI each, two Elastic IPs, serial in EC2 user data, "disable AWS source/destination check on
  the LAN interface", reboot required post-deploy). Certified instance types t3.large → c7i.8xlarge
  (c7i from Socket v26.0.23517).
  — https://knowledge.catonetworks.com/docs/deploying-a-vsocket-site-from-the-aws-marketplace ·
  https://knowledge.catonetworks.com/docs/deploying-an-aws-vsocket-site-manually (accessed 12 Sep 2026)
- **GCP**: Google Cloud Marketplace wizard or Cato-authored Terraform module; the deployment
  creates **three separate VPC networks** (MGMT/WAN/LAN), machine type n2-standard-4 only.
  — https://knowledge.catonetworks.com/docs/deploying-a-gcp-vsocket-from-the-marketplace ·
  https://knowledge.catonetworks.com/docs/en/configuring-a-cato-vsocket-in-gcp-using-terraform (accessed 12 Sep 2026)

### HA models (differ per cloud — good comparison material)
- **Azure**: two vSockets, Availability Zones or Availability Sets; failover = **floating IP** on
  the LAN interface moved by Azure API calls; "Network Interface configuration update can take up
  to 120 seconds". Socket v11.0+; HA script creates a Managed Identity with Contributor on the VMs.
  BGP: pre-v14.0 the primary LAN IP peers and does not survive failover; from v14.0 the floating
  IP peers. — https://knowledge.catonetworks.com/docs/configuring-ha-for-azure-vsockets (accessed 12 Sep 2026)
- **AWS**: two vSockets, single-AZ or cross-AZ; keepalives UDP 20480 between LAN interfaces;
  failover = **route-table rewrite** ("modify the LAN route table and assign the secondary vSocket
  LAN ENI as the next hop for the 0.0.0.0/0 route") needing IAM `ec2:CreateRoute`,
  `ec2:DescribeRouteTables`, `ec2:ReplaceRoute`. vSocket v9.1+. **"BGP isn't supported for AWS
  vSocket HA"**; "Alt. WAN links are not supported for AWS HA deployments". No published failover
  time. — https://knowledge.catonetworks.com/docs/configuring-ha-for-aws-vsockets (accessed 12 Sep 2026)
- **GCP** (new, Mar 2026): two vSockets in separate zones behind a **Google Cloud internal Load
  Balancer**; VRRP keepalives; "Typical failover time is approximately 3–5 seconds", failback "up
  to 8 seconds". Minimum vSocket 24.0.20395. (Older KB pages — "What is Socket HA", the single-
  vSocket note in the GCP Terraform article — predate this; the product update + dedicated HA
  article are authoritative.)
  — https://knowledge.catonetworks.com/docs/configuring-high-availability-ha-for-gcp-vsocket-sites-using-terraform ·
  https://knowledge.catonetworks.com/docs/en/product-updates-march-23-2026 (accessed 12 Sep 2026)

### Caveats (KB-flagged)
- Azure: public DNS resolution required; "Azure extensions and backups are not supported for the
  vSocket VM"; Azure Site Recovery replication unsupported. Multi-VNet scale-out = hub-and-spoke
  VNet peering with spoke routes next-hop "Virtual appliance" at the vSocket LAN IP.
  — manual-deployment + https://knowledge.catonetworks.com/docs/how-to-use-a-vsocket-in-azure-multiple-vnets-environment (accessed 12 Sep 2026)
- AWS: no VLAN/DHCP ranges; VM reboot required before first connection; first IPs of each subnet
  VPC-reserved. — AWS marketplace article (accessed 12 Sep 2026)
- GCP: three separate VPCs created; single machine type.

### Licensing
"Socket and vSocket sites require SASE licenses, while IPsec sites can use either SASE or SSE"
licences; site licence = fixed bandwidth, reassignable; pooled licences divide a regional pool.
— Managing Site Bandwidth, https://knowledge.catonetworks.com/docs/managing-site-bandwidth-in-licenses (accessed 12 Sep 2026)

---

## 2. Option B — IPsec site

### Cato side (constants across all clouds)
- Site types IKEv1 and IKEv2; "We recommend that you use IKEv2." IKEv2 modes: Responder Only or
  Bidirectional; IKEv1 sites are Cato-initiated.
  — https://knowledge.catonetworks.com/docs/en/configuring-ipsec-ikev2-sites ·
  https://knowledge.catonetworks.com/docs/en/configuring-sites-with-ipsec-connections (accessed 12 Sep 2026)
- Throughput: "IPsec IKEv1 (Cato-initiated): Up to 3 Gbps"; "IPsec IKEv2: Up to 3 Gbps" — per
  IPsec **site**, not per tunnel; the KB publishes no per-tunnel cap.
  — Cato Cloud Thresholds and Limits (accessed 12 Sep 2026)
- Tunnels/HA: IKEv2 "Up to 6 active tunnels for each HA role... all Primary tunnels are connected
  to one PoP, and all Secondary tunnels are connected to a different PoP"; in the Add Tunnel flow
  "Each tunnel must use a different public IP address" — the KB states this for the active tunnels
  stacked within an HA role; do NOT generalise it to "any two tunnels of a site" (the KB's ASA
  reference pattern runs primary and secondary from one site IP to two different allocated IPs at
  two PoPs). Re-verified 12 Sep 2026. "IPsec connections do not automatically connect to different
  PoPs if there is a problem" (unlike Sockets, which re-home dynamically) — re-verified verbatim
  12 Sep 2026; the IKEv2 page adds one nuance: with an FQDN destination in Responder Only mode
  "the PoP is selected dynamically", but static-IP destinations (the cloud-gateway case) get no
  re-homing.
  — Configuring IPsec IKEv2 Sites · Configuring Sites with IPsec Connections (accessed 12 Sep 2026)
- Encryption: AES 128/256 GCM-16 required for sites ≥100 Mbps; CBC only below 100 Mbps.
  — Configuring IPsec IKEv2 Sites + Thresholds (accessed 12 Sep 2026)
- BGP: "up to two BGP neighbors for an IPsec connection, one BGP neighbor per tunnel"; secondary
  preference by AS-path prepend (prepend_count 1 vs 2); default 1024 received prefixes per
  neighbour; private ASN 64512–65534, Cato default 64515; IPv4 only.
  — https://knowledge.catonetworks.com/docs/en/configuring-bgp-neighbors-for-an-ipsec-connection ·
  https://knowledge.catonetworks.com/docs/en/using-bgp-in-the-cato-cloud (accessed 12 Sep 2026)
- Positioning: Sockets preferred ("last-mile acceleration and optimal synchronization with the
  Cato PoP"); IPsec is the path "if you have existing third-party appliances".
  — Connecting Sites to the Cato Cloud (accessed 12 Sep 2026)
- Licensing: IPsec sites can use SASE **or SSE** licences (vSocket needs SASE).
  — Managing Site Bandwidth (accessed 12 Sep 2026)
- Terraform: Cato maintains `terraform-cato-ipsec-aws` and `terraform-cato-ipsec-azure` modules —
  https://github.com/catonetworks/terraform-cato-ipsec-aws · https://github.com/catonetworks/terraform-cato-ipsec-azure (accessed 12 Sep 2026)

### Cloud-side gateways
- **Azure VPN Gateway** — https://learn.microsoft.com/en-us/azure/vpn-gateway/about-gateway-skus (accessed 12 Sep 2026):
  AZ SKUs VpnGw1AZ 650 Mbps → VpnGw5AZ 10 Gbps aggregate benchmark (VpnGw2AZ 1.25 Gbps, VpnGw3AZ
  2.5 Gbps, VpnGw4AZ 5 Gbps); non-AZ VpnGw1–5 "slated for migration"; Basic SKU 100 Mbps, no BGP,
  dev-test. Per-tunnel observed ~1.25–2.3 Gbps with GCM ciphers (SKU-dependent), ~550–700 Mbps
  with AES256+SHA256. Max 30 tunnels (VpnGw1–3) / 100 (VpnGw4–5). BGP on all SKUs except Basic;
  active-active pairs = two public IPs (maps to Cato primary/secondary PoP tunnels). Hourly
  gateway fee per SKU + egress.
- **AWS VGW / TGW** — https://docs.aws.amazon.com/vpn/latest/s2svpn/vpn-limits.html (accessed 12 Sep 2026):
  "Maximum bandwidth per standard VPN tunnel: Up to 1.25 Gbps" (140k PPS); large-bandwidth tunnel
  option up to 5 Gbps (400k PPS). Two tunnels per S2S connection. ECMP aggregation **Transit
  Gateway only** ("ECMP is not supported on VPN connections that use static routing"; VGW cannot
  aggregate). BGP prefixes from customer side: 100 on a VGW (not adjustable) / 1,000 on a TGW.
  MTU 1446 / MSS 1406. Pricing: $0.05/hr per S2S connection; $0.60/hr per 5 Gbps large-bandwidth
  connection; TGW attachment ~$0.05/hr + data processing; egress at EC2 rates.
  — https://aws.amazon.com/vpn/pricing/ (accessed 12 Sep 2026)
- **GCP Cloud VPN (HA VPN)** — https://docs.cloud.google.com/network-connectivity/docs/vpn/concepts/overview (accessed 12 Sep 2026):
  HA VPN 99.99% SLA, two interfaces/two external IPs, **BGP mandatory** (Cloud Router); Classic
  VPN 99.9%, static routing, legacy. Per-tunnel "up to 250,000 packets per second", "between
  1 Gbps and 3 Gbps" depending on packet size; scale by ECMP across tunnels. IKEv1/IKEv2
  pre-shared key; cipher selection IKEv2 only. ~$0.05/hr per tunnel + egress (regional variants
  exist; re-verify exact rates before quoting).
- **OCI Site-to-Site VPN (VPN Connect)** — https://docs.oracle.com/en-us/iaas/Content/Network/Tasks/overviewIPsec.htm ·
  https://docs.oracle.com/en-us/iaas/Content/Network/Reference/supportedIPsecparams.htm (accessed 12 Sep 2026):
  two redundant tunnels per IPsec connection, terminating on a DRG; per-tunnel routing choice of
  BGP / static (default) / policy-based; **asymmetric routing across tunnels** ("traffic from a
  VCN to an on-premises network can use any tunnel that's 'up'") — for Cato, land both OCI
  tunnels on the same Cato site as primary+secondary. IKEv1/IKEv2. No published per-tunnel Gbps
  cap. Oracle's consistent public claim is that the VPN service itself is free (egress only) —
  corroborated only via search snippets, see UNVERIFIED.
  Cato's OCI IPsec reference design: "Redundant VPN Connection to Oracle Cloud using BGP" —
  IKEv1, active-active dual tunnels to two separate Cato PoPs, BGP (Oracle ASN 31898, Cato
  default 64515), metric steering; tunnels "can require up to 15 minutes" to become available.
  — https://knowledge.catonetworks.com/docs/redundant-vpn-connection-to-oracle-cloud-using-bgp (accessed 12 Sep 2026)

---

## 3. Option C — Cato Cloud Interconnect

### What it is
"A dedicated connection between two peers" — a private Layer-2 virtual circuit from the cloud
provider's interconnect fabric into a Cato PoP, stitched by a fabric provider; a Cloud
Interconnect site is created in the CMA and **BGP** exchanges routes. "For physical and
cloud-based data centers with a high volume of traffic"; "Only available at specific PoP
locations."
— Getting Started with Cloud Interconnect Sites, https://knowledge.catonetworks.com/docs/cloud-interconnect-sites ·
Connecting Sites to the Cato Cloud (both accessed 12 Sep 2026)

### Key facts
- Bandwidth: "Cloud Interconnect: Up to 10Gbps" (Thresholds). Minimum: "If your account is on an
  Enforcement Model license, the minimum bandwidth for a Cloud Interconnect site is 500 Mbps. If
  your account is on a Bursting Model license, there is no minimum requirement" (Getting Started —
  use this over the older overview's "400 Mbps and higher", which predates it).
- Encryption: **"Cloud Interconnect data traverses Layer2 virtual circuits, resulting in high
  performance and low latency due to no encryption overhead"** — private but unencrypted by
  design. The mandatory **MD5** field in every per-cloud article is BGP session authentication,
  NOT traffic encryption. The cloud providers say the same of their own interconnects: AWS
  "does not encrypt your traffic that is in transit by default"; Azure "By default, traffic over
  an ExpressRoute connection isn't encrypted" (MACsec only on ExpressRoute Direct, not provider
  circuits); Google "Cloud Interconnect doesn't encrypt traffic by default"; Oracle: FastConnect
  private, encryption optional (IPsec-over-FastConnect or MACsec at ≥10 Gbps ports).
- HA: "Cato supports active-passive model only for Cloud Interconnect sites with 2 circuits" —
  active link to one PoP, passive to a different PoP; single circuit supported; no load-sharing.
- Fabric providers: Equinix, Megaport, Console Connect, Interxion (Digital Realty). Lead times by
  PoP: immediate (CMA on-demand) → 3 weeks → 4 weeks → 6 weeks → 3 months; Megaport on-demand CMA
  provisioning is Early Availability; provider-side provisioning "may take up to 24 hours" to
  reflect in the GCP/OCI portal.
  — https://knowledge.catonetworks.com/docs/cloud-interconnect-availability (accessed 12 Sep 2026)

### Per-cloud
| | AWS | Azure | GCP | OCI |
|---|---|---|---|---|
| Cloud-side product | Direct Connect, private virtual interface | ExpressRoute (provider model; Equinix ECX) | Partner Interconnect, VLAN attachments | FastConnect (partner; virtual-circuit OCIDs to Cato) |
| KB article | cloud-interconnect-for-aws-public-cloud | cloud-interconnect-for-azure-public-cloud | cloud-interconnect-for-gcp-public-cloud | cloud-interconnect-for-oracle-public-cloud |
| Route/prefix limits (KB) | "up to 100 route advertisements over BGP" | advertise ≤1,000 IPv4 + 100 IPv6; receive ≤4,000 from Cato; Std SKU 10 VNets | IPv6 route exchange unsupported; GCP auto-assigns peering IPs (unchangeable) | ≤2,000 prefixes; BGP torn down 60 min if exceeded; whole VCNs advertised, no exclusions |
| Cloud-side circuit speeds (provider docs) | hosted connections 50 Mbps–10 Gbps (+25 Gbps at select locations); dedicated ports 1/10/100/400 Gbps | 50 Mbps–10 Gbps provider circuits; ExpressRoute Direct dual 10/100/400 Gbps | VLAN attachments 50 Mbps–50 Gbps | ports 1/10/100/400 Gbps (partner VC tiers vary — UNVERIFIED) |
| Notes | — | Azure VNet Gateway deployment "up to ~45 minutes"; Service Keys required | bandwidth not modifiable in console after creation | PoP must be in the same Oracle Cloud region as the tenant; DRG required; billing starts once provisioned or after 30 days |

All four per-cloud rows: /30 peering subnets, MD5 mandatory, active-passive 2-circuit HA.
Sources: the four KB articles above + AWS/Azure/GCP/OCI provider docs listed in the source
index (all accessed 12 Sep 2026).

---

## 4. Cross-option comparison (page-ready)

Cato KB throughput framing (all from Cato Cloud Thresholds and Limits + Connecting Sites to the
Cato Cloud, accessed 12 Sep 2026):

| Method | Max throughput (KB) | Character |
|---|---|---|
| vSocket | Azure 1 Gbps (2 NIC) / 2 Gbps (3 NIC accel.); GCP up to 2 Gbps; AWS deployment-dependent | Cato appliance in the VNet/VPC; DTLS tunnels; full site experience |
| IPsec site | Up to 3 Gbps per site (IKEv1 and IKEv2) | Cloud-native gateway; encrypted; internet last mile; no Cato footprint |
| Cloud Interconnect | Up to 10 Gbps | Private L2; no encryption overhead; specific PoPs; lead times |

Per-cloud option matrix (verdicts follow from the availability facts above):

| | vSocket | IPsec | Cloud Interconnect |
|---|---|---|---|
| Azure | Yes (Marketplace/manual; HA) | Yes (VPN Gateway / vWAN) | Yes (ExpressRoute via Equinix ECX) |
| AWS | Yes (Marketplace/manual; HA, no BGP in HA) | Yes (VGW/TGW; ECMP on TGW only) | Yes (Direct Connect) |
| GCP | Yes (Marketplace/Terraform; HA Mar 2026) | Yes (HA VPN; BGP mandatory) | Yes (Partner Interconnect) |
| OCI | **No** | Yes (VPN Connect; Cato's documented design is IKEv1+BGP) | Yes (FastConnect; PoP same OCI region as tenant) |

Failover actuation contrast (per-cloud vSocket HA articles, accessed 12 Sep 2026): Azure floating
IP via API (NIC update ≤120 s) · AWS route-table rewrite (no published time) · GCP internal LB +
VRRP (~3–5 s, failback ≤8 s) — vs IPsec (BGP/tunnel failover between two PoPs; no automatic PoP
re-homing) and Cloud Interconnect (BGP active/passive across two PoPs).

---

## 5. UNVERIFIED — quarantined; do NOT state on the page

1. **HA secondary vSocket licensing** — KB nowhere states whether the standby vSocket consumes a
   second site licence. KB silence, not a confirmed "free".
2. **vSocket software cost / BYOL status** of the marketplace listings — not stated in KB;
   listing pages not fetched.
3. **AWS vSocket throughput ceiling** — KB deliberately publishes none; do not quote a cap.
4. **GCP vSocket HA via Marketplace flow details** — product update names marketplace + Terraform;
   only the Terraform HA article verified.
5. **Cato per-tunnel IPsec Mbps cap** — the 3 Gbps figure is per site; no per-tunnel number in
   the KB. Field folklore ("1 Gbps per tunnel") must not be printed.
6. **OCI Site-to-Site VPN "free service"** — Oracle's consistent public claim, but oracle.com
   pricing pages 403'd; corroborated only by search snippets. Describe qualitatively ("no
   per-hour gateway fee per Oracle's public pricing — verify") or omit.
7. **OCI per-tunnel VPN throughput** — not published; an Oracle tutorial's ~1.2 Gbit/s across two
   ECMP tunnels is a lab result, not a spec.
8. **GCP exact regional VPN tunnel prices & Classic VPN deprecation dates** — $0.05/hr base
   corroborated; regional variants and deprecation timeline need re-verification.
9. **Azure VPN Gateway BGP prefix limits** and **OCI DRG BGP prefix limits** — not fetched.
10. **Per-cloud Cloud Interconnect PoP reach matrix** — the availability article lists PoPs and
    fabric providers, not per-cloud on-ramps. Page must say "check availability with Cato per
    location".
11. **Cato-side encryption over the interconnect** (MACsec / IPsec-over-interconnect) — no KB
    statement found; the page may only say the circuit is private-unencrypted with MD5 BGP auth.
12. **AWS Direct Connect hosted vs dedicated** for the Cato fabric circuit — hosted is the
    natural inference, not stated by Cato.
13. **OCI partner virtual-circuit bandwidth tiers** — partner-dependent, not enumerated by Oracle.
14. **"Bursting Model (starting in January 2027)" licence model detail** — seen in a search
    snippet of "Working with Cato License Types" only; the Getting Started article's
    Enforcement/Bursting minimum-bandwidth split IS verified and quotable.
15. **Azure vWAN integration article content** — title exists ("Integrating Cato with Azure
    vWAN"); details unfetched in this pass (the cloud-datacenter page cites it; this page should
    defer to that page).
16. **Interconnect availability lead-time table freshness** — figures accessed 12 Sep 2026; the
    list moves. Date any quotation.

## Source index (all accessed 12 Sep 2026)

Cato KB: what-are-cato-sockets · connecting-sites-to-the-cato-cloud · llms.txt ·
deploying-azure-vsockets-from-the-marketplace · deploying-an-azure-vsocket-site-manually ·
configuring-ha-for-azure-vsockets · how-to-use-a-vsocket-in-azure-multiple-vnets-environment ·
deploying-a-vsocket-site-from-the-aws-marketplace · deploying-an-aws-vsocket-site-manually ·
configuring-ha-for-aws-vsockets · deploying-a-gcp-vsocket-from-the-marketplace ·
configuring-a-cato-vsocket-in-gcp-using-terraform ·
configuring-high-availability-ha-for-gcp-vsocket-sites-using-terraform ·
product-updates-march-23-2026 · en/cato-cloud-thresholds-and-limits ·
configuring-ipsec-ikev2-sites · configuring-sites-with-ipsec-connections ·
recommendations-for-ipsec-connections · configuring-bgp-neighbors-for-an-ipsec-connection ·
using-bgp-in-the-cato-cloud · redundant-vpn-connection-to-oracle-cloud-using-bgp ·
managing-site-bandwidth-in-licenses · working-with-cato-license-types ·
cloud-interconnect-sites · cloud-interconnect-availability ·
cloud-interconnect-for-aws-public-cloud · cloud-interconnect-for-azure-public-cloud ·
cloud-interconnect-for-gcp-public-cloud · cloud-interconnect-for-oracle-public-cloud ·
en/product-update-may-13th-2024 · en/product-update-apr-29th-2024
(all under https://knowledge.catonetworks.com/docs/)

Cloud providers: learn.microsoft.com (vpn-gateway/about-gateway-skus ·
expressroute/expressroute-introduction · expressroute-about-encryption) · docs.aws.amazon.com
(vpn/latest/s2svpn/vpn-limits.html · directconnect UserGuide: Welcome, WorkingWithConnections,
hosted_connection, encryption-in-transit) · aws.amazon.com/vpn/pricing/ · docs.cloud.google.com
(vpn/concepts/overview · interconnect/concepts/{overview,partner-overview}) ·
cloud.google.com/network-connectivity/docs/interconnect/pricing/ · docs.oracle.com
(Network/Tasks/overviewIPsec.htm · Network/Reference/supportedIPsecparams.htm ·
Network/Concepts/{fastconnect,fastconnectrequirements,fastconnectsecurity}.htm)

Cato GitHub: github.com/catonetworks/terraform-cato-ipsec-aws · terraform-cato-ipsec-azure
