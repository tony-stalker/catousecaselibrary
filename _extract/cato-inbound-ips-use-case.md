# 4 - Security use cases/Cato Inbound IPS Use Case.pptx


## Slide 1: (no title)
- Reducing the attack surface and minimizing risk
- Cloud-Delivered
- Inbound Protection
- NAME | Sales Engineer
[images: cato-inbound-ips-use-case_s01_0.png, cato-inbound-ips-use-case_s01_1.png]
NOTES: Thank you very much for having us.
In the next 15-20 minutes, I will walk you through Cato’s True SASE Platform
Let’s make this an interactive conversation. Please feel free to ask questions as I present.
If you would like more technical details or a demo on any of the areas I will cover – we will be happy to provide them.
Let’s start

## Slide 2: Why do we need Inbound Protection?Compliance
- ISO 27001
  - A standard to establish, implement and maintain information security
- NIS2
  - A framework for the protection of critical infrastructure in the European Union (EU)
  - Ensure the security and resilience of critical infrastructure and to prevent, deter, and mitigate major accidents
- SOC 2
  - Auditing on controls on security, availability, confidentiality and privacy
[images: cato-inbound-ips-use-case_s02_0.png, cato-inbound-ips-use-case_s02_1.png]

## Slide 3: Challenges in Achieving Compliance
- |
- Public Facing
- Audit Evidence
- Virtual Patching
| “How can I protect against attackers whilst ensuring services are running” |
| “How check I have controls in place?” |
| “Services need to stay active; I can’t afford downtime to patch’ |
- Governance
| “How do ensure I keep to compliance requirements” |
NOTES: Before we get started, I want to share the kind of challenges we see across the IT leaders we speak with. 

They cover cost, performance, quality, user experience, and management complexity. 

Can you help me understand the primary challenges you face today?

## Slide 4: Business Impact of not staying Compliant
- Reputational impact
  - Lowering share value
- Industry Regulatory requirements
  - Financial fines
- Not able to sign new customers, business unable to grow at the desired pace
- Not able to insure the business against cyber attacks

## Slide 5: Cato Networks Remote Port Forwarding
- Cato SPACE engine inspects and secures traffic
- Flexible Access Controls enable inbound source filtering
- Enables businesses to safely allow for connections into the organisation
- A Secure Way to Publish Services
[images: cato-inbound-ips-use-case_s05_0.png]

## Slide 6: Cato Networks Inbound IPS
- 93.2% of unique CVEs we cover (1,089 out of 1,168) include inbound protection - nearly every CVE we write a signature for protects inbound-facing services
- WAF-style signatures are almost entirely inbound - 394/395 rules (SQLi, XSS, XXE, RCE, path traversal, command injection, etc.)
- CVE coverage spans 1999-2026 with strong recent growth: 313 inbound rules for 2024 CVEs, 263 for 2025, and 23 for 2026 so far
- 64 scanner/recon detection rules catch inbound vulnerability scanning
  - Ensuring services are up and protected

## Slide 7: Cato’s Unique Architecture allows for Rapid Mitigation for our Customers
- https://www.catonetworks.com/rapid-cve-mitigation/
[images: cato-inbound-ips-use-case_s07_0.png]

## Slide 8: Cato Networks Secure Solution for Exposed Services
  - Ensuring services are up and protected
[images: cato-inbound-ips-use-case_s08_0.png]
NOTES: Leveraging a mix of Cato’s Remote Port Forwarding and leading IPS capabilities, Cato can secure outward facing services to ensure malicious attempts don’t even reach the on-premise equipment. One key benefit is that this solution can be implemented without any infrastructure or network topology changes. No need to deploy firewall appliances onsite.

## Slide 9: DEMO

## Slide 10: How to
- Configure an Allocated IP at a PoP of your choosing
- Create a remote port forwarding rule to a HTTP resource (Would recommend using azure / aws tenancy attached to your lab)
- Configure/check that IPS inbound is turned on
- Review logs/events OR trigger the IPS using a known CVE that we have a signature for to showcase live protection

## Slide 11: Thank You!