# 1 - Access use cases/De-risking 3rd Party Supply Chain Access/De-risking 3rd Party Access Use Case.pptx


## Slide 1: De-risking 3rd Party Access
- Overview & Use Case

## Slide 2: Overview of Risk

## Slide 3: Impact of 3rd Party Supply Chain Risk
- High profile organizations have been targeted through supplier and 3rd party access
- Jaguar-Land Rover (2025) – Compromised credentials allowed access to an internal JIRA Server which was exploited and PII leaked
  - Huge reputational damage and an estimated cost of £2B to the UK economy
- Truist Bank Data Breach (2024) - 3rd Party debt collection agency was breached and that agency had access to sensitive Truist Bank data
  - Sensitive PII data leaked for nearly 4.2 million including bank customers
  - Lawsuits, reputational damage, estimated $400-600M in damages
- Marks and Spencers (2025) – Compromised credentials from a contractor IT provider
- Online store down for nearly 2 months causing losses of up to £300M, market valuation dropped by £1B

## Slide 4: Cause of risk - Legacy 3rd Party Access
  - Legacy VPN
  - Designed for connectivity, not security
  - Overly permissive and designed for implicit trust
  - No segmentation
  - No visibility
  - Enables lateral movement of threats
  - Use of on-premise appliances
  - Requires maintenance and management
  - Extra appliances needed if security is required
  - Increases time and cost
  - No consistent security
  - Scalability challenges
  - Compromised Credentials

## Slide 5: How Cato Networks removes risk from 3rd Party Contractors
- Removing risk through least privileged access
- |
- Consistent Policy for Users Everywhere
  - Identity driven
  - Global coverage
- ZTNA: Trust but Verify
  - Access control with device posture
  - Threat prevention (FWaaS, SWG, IPS, AM)
  - Sensitive data protection (DLP)
  - Risk-based applications access control (CASB)
[images: de-risking-3rd-party-access-use-case_s05_0.png]
NOTES: [click1]
Enterprises today need to connect the hybrid workforce, securely, wherever they are. Users seamlessly roam between the office, customer locations, travel, and their homes. 

[click2]
Cato SSE 360 enforces a consistent policy on users based on their identity. 
The global cloud service seamlessly distributes the relevant policies globally, so policies are enforced consistently across the globe. 
And, there is no need to backhaul traffic across the world to a single VPN appliance, or deploy global instances to achieve the same goal. 

[click3]
Cato SSE 360 delivers true Zero Trust with continuous verification. Access control, threat prevention, and sensitive data protection are continually enforced on all traffic, throughout the user’s session. 

Using Cato for the hybrid workforce was proven During COVID. 
Our customers were able to support all their users transitioning to home working, without giving up security - due to the reach and scalability of the Cato solution.

## Slide 6: How to run the demo ( SE only slide )
- Removing risk through least privileged access
- |
- Initial discussion with prospect to dig into the ‘why’ they are looking at security for 3rd parties, contractors etc. Understand business use case for this access and risk surrounding it
- First slide – Business impact of not securing 3rd party access
- Second slide – How 3rd parties currently access resources, limitations and risk around this
- Overview of Cato ZTNA and how we use device posture, confidence, user awareness to enable least privileged access. Security capabilities like FWaaS and SWG, CASB and DLP to protect sensitive data and prevent breaches
  - Red line – geoblocking, unauthorized users and/or non-compliant devices
  - Orange line – Internet only, user authenticates but is not compliant
  - Green line – WAN and Internet – user authenticated and device compliant
- Demo
  - Start off with showing Access Tab > Client connectivity (geoblocking rules, rules for user groups, internet only rules) talk around this as examples on how to restrict that initial connectivity
  - WAN firewall rules – show rules with contractor user groups only allowed to access certain resources, corporate users must be compliant with device profile.
  - Show device posture profiles and criteria we can do.
  - Show live demo of a contractor user being blocked from internal resource but able to access another resource (HTML code for web pages in folder – contractor portal and internal portal)

## Slide 7: (no title)