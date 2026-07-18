# 5 - Migration strategies/Zscaler to Cato - 2025 Q3.pptx


## Slide 1: Zscaler to Cato
- |
- Cato Professional Services

## Slide 2: Zscaler Migration Strategy
- |
- Policy Conversion & Cato Best Practices
| 1. EXPORT | 2. REVIEW & MAP |
| ZIA: Export policies, URL filtering, firewall, web security, DLP, Cloud App policies, Advanced Threat Protection, SSL Inspection, Bandwidth Control, and User/Group settings.

ZPA: Export segment groups, access policies, Browser Access, Client Forwarding, Inspection policies, Trusted Networks, Server Groups, and Posture Profiles. | ZIA: Map policies to Global Internet firewall, App Control (Tenant Restrictions, CASB, DLP), Threat Prevention, SCIM groups, and TLS Inspection.

ZPA: Review groups, site hosts, map to WAN firewall  and access control. |
| 3. DEPLOY | 4. OPTIMIZE |
| ZIA: Implement Cato best practices, including category and service restrictions, firewall, TLS Inspection, CASB, and DLP monitoring policies.

ZPA: Deploy Cato best practices for WAN firewall, segmentation, and Access Control, Browser  Access, Trusted Networks, and Group/Host configuration. | ZIA & ZPA: Event analysis, performance tuning, adjust policy restrictions, and enhance security through segmentation. |
NOTES: Policy Migration Process
Clean up
Refactoring
Gap analysis to Cato Best Practices

## Slide 3: Cato Advanced Security
- |
- Servicing PoP Breakout & SDWAN
- Zscaler Replacement
- Unified Platform
- End-to-End Visibility
- Long-term Strategic Goal
- Simplified and standard solution
- Direct Internet Breakout from servicing PoP and SDWAN preference routing
[images: zscaler-to-cato-2025-q3_s03_0.png]

## Slide 4: ZIA Gateway Integration – IKEv2 Multiple Active Tunnels
- |
- Site Backhaul Load balance over multiple ZIA tunnels
- 3 x Active IPSec ZIA Tunnels
- 3 x Backup IPSec ZIA Tunnels
- Backhaul Load balanced based on:
  - Source / Destination
- Temporary ZIA interim solution
- Support for multiple interconnects
- Tier 1 backbone
- Egress from closest PoP to Zscaler
[images: zscaler-to-cato-2025-q3_s04_0.png]

## Slide 5: ZIA Integration – Internet Backhaul to FW
- |
- |
- Backhaul - Load balance & Site Redundancy
- Backhaul Internet Breakout by existing sites
- ZIA support from FW for GRE / IPsec
- Backhaul Load balanced based on:
  - Source / Destination
- Temporary ZIA interim solution
- Reuse of existing FW ZIA connectivity
[images: zscaler-to-cato-2025-q3_s05_0.png]

## Slide 6: Phased ZIA Replacement – FW VLAN Termination
- |
- |
- Parallel ZIA Connectivity through FW
- Parallel FW ZIA connectivity
- Cato Transit Network
  - BGP or Static routing
- Temporary Cato site routed Ranges
- Convert to VLAN during FW retirement
- Reuse existing local FW ZIA connectivity
- Phased migration to Cato Internet Breakout
- Routed Ranges can be used in policy and later converted to VLAN
- Simple Bypass of Agent Connectivity
- No Cato Bandwidth and commercial impact
[images: zscaler-to-cato-2025-q3_s06_0.png]

## Slide 7: Phased ZIA Replacement – Cato VLAN Termination
- |
- Parallel ZIA Connectivity through FW
- Parallel FW ZIA connectivity
- Internet Traffic Bypass on WAN
- FW DMZ handoff for socket WAN
- Socket terminates local VLAN
- Reuse existing local FW ZIA connectivity
- Internet Breakout from FW
- Phased migration to Cato Internet Breakout
- Socket provides termination of local VLAN
- No Cato Bandwidth and commercial impact
- Cato managed inter-VLAN & visibility
[images: zscaler-to-cato-2025-q3_s07_0.png]

## Slide 8: Case Study - [customer redacted]
- |
- Business - Legal advisory services
- Technical - Using Zscaler ZIA (tunnels and ZCC) with identity for Internet access, not using ZPA
- Heavy focus on ZTNA, MPLS for WAN access protected by legacy firewalls
- Goal to better protect WAN using ZTNA model
- Why Buy - Zscaler ZIA Replacement
- Customer extremely unhappy with Zscaler solution
- Purchased Zscaler CASB but solution was not working for them
[images: zscaler-to-cato-2025-q3_s08_0.png]

## Slide 9: Case Study - [customer redacted]
- |
- Phase 0 - Sites on Zscaler ZIA tunnels (GRE) + Managed endpoints on Zscaler ZCC
- Remote access using legacy Remote Access VPN solution (Forcepoint?)
- Migrated sites to Cato sockets
  - Imploy WAN protect using UA before moving anyone over from Zscaler ZIA
  - Site routing via PBR of WAN traffic to Cato
  - Site Internet via default route to Zscaler ZIA via tunnel
- Phase 1 - Rollout SDP to all users
- Split tunnel RFC 1918 for SD-WAN over Cato
  - SDP not in always-on, manually enabled when remote
- Internet via ZIA over tunnels at sites (default route) and Zscaler ZCC when remote
  - Co-existing ZCC and SDP on workstations, dual tunnels while remote

## Slide 10: Case Study - [customer redacted]
- |
- Phase 2 - WAN rules completed following ZTNA model
- Removed PBR and migrated default route to Cato for WAN access
  - Non-user systems (e.g., servers, IoT, etc.) migrated to Cato SWG via socket using minimal rule set, maintained visibility and relative security posture
- ZTNA policies only using Cato UA identities for enforcement
- Zscaler ZIA still running via ZCC on all managed endpoints for Internet protection
  - Zscaler ZCC tunnel inside Cato socket tunnel when onsite
  - Zscaler ZCC tunnel and Cato SDP tunnel co-existing when remote
- Phase 3 - Copy Zscaler SWG policies into Cato SWG
- Testing subset of users by removing Zscaler ZCC agent (on-prem sandbox) and confirmed functionality
  - Isolated SDP policy dependency from testing methodology
- Phase 4 - Clear path to removal of Zscaler ZCC across all managed endpoints
- Enable SDP always-on, still split-tunnel RFC 1918, still relying on Zscaler ZCC for ZIA
- Big bang removal of split tunnel
  - SDP provides default route to Internet via Cato POP, ZCC forms ZIA tunnel via Cato to Zscaler POP
- Remove Zscaler ZCC client at convenience, Internet traffic flips from Zscaler ZIA to Cato SWG

## Slide 11: Case Study - [customer redacted]
- |
- Results
- Full SDP for remote access and SWG
- Eliminated Zscaler ZIA and ZCC solution
- Eliminated legacy remote access VPN solution
- Future Projects
- Phase X - CASB & DLP - Achieve security posture originally desired when using Zscaler
- Phase Y - Eliminate legacy firewall platform for only Cato NGFW
- Hindsight Being 20/20
- All SDP users being identified as "All Unidentified Users" group while logic for specific users groups worked behind socket, caused SWG policy logic failure
  - Flaw in Cato logic, being fixed, and quickly resolved using exception for All SDP Users groups
- TLSi caused issues with Outlook, change management delayed diagnostic testing, resulted in little more than a month delay in rollout
  - Issue on customer side, resolved via Cato support ticket
- Tight change control and windows resulted in extremely slow progress
- Looking Forward
- Integrated (recently released) SDP agenda-based identity with WMI based identity to improve UA experience
- Utilization of (soon to be released) user/group based split tunnel policies to simplify Phase 3 testing and Phase 4 gradual cutover

## Slide 12: (no title)
- |