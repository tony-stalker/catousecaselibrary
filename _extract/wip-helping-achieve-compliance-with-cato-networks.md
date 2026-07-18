# 4 - Security use cases/WIP - Helping Achieve Compliance with Cato Networks.pptx


## Slide 1: (no title)
- Enabling business growth with Cato SASE Platform
- Achieving Compliance
- NAME | Sales Engineer
[images: wip-helping-achieve-compliance-with-cato-networks_s01_0.png, wip-helping-achieve-compliance-with-cato-networks_s01_1.png]
NOTES: Thank you very much for having us.
In the next 15-20 minutes, I will walk you through Cato’s True SASE Platform
Let’s make this an interactive conversation. Please feel free to ask questions as I present.
If you would like more technical details or a demo on any of the areas I will cover – we will be happy to provide them.
Let’s start

## Slide 2: SCIPAB
- Situation slide – Business requirement to achieve compliance
- Challenges – point solutions, hard to manage, creates gaps, supply chain risk
- Implication – not compliant, no customers, business goes under
- Position – Position Cato CASB + DLP
- Action – CASB + DLP Deployment plan
- Benefit – Achieving compliance

## Slide 3: What is ISO 27001, NIS2 & SOC 2?
- ISO 27001
  - A standard to establish, implement and maintain information security
- NIS2
  - A framework for the protection of critical infrastructure in the European Union (EU)
  - Ensure the security and resilience of critical infrastructure and to prevent, deter, and mitigate major accidents
- SOC 2
  - Auditing on controls on security, availability, confidentiality and privacy

## Slide 4: Challenges in Achieving Compliance
- |
- Slow Management
- Control Sprawl
- Audit Evidence
- All Edges
- SaaS Activity
| “It takes us weeks to configure the same policy across all the tools” |
| “My network security is a mess. Just too many boxes and models” |
| “How do I correlate evidence across all this tooling?” |
| “How do I make sure remote workers are kept compliant?” |
| “I need to ensure my SaaS usage is controlled” |
- Governance
| “Shadow IT and unknown SaaS apps make it difficult  to comply” |
NOTES: Before we get started, I want to share the kind of challenges we see across the IT leaders we speak with. 

They cover cost, performance, quality, user experience, and management complexity. 

Can you help me understand the primary challenges you face today?

## Slide 5: Business Impact
- Reputational impact
- Industry Regulatory requirements
- Not able to sign new customers, business unable to grow at the desired pace
- Not able to insure the business against cyber attacks

## Slide 6: Cato Networks CASB and DLP Helps Business Achieve Compliance
  - Application Dashboard – providing monitoring and visibility of Shadow IT including DLP events with forensic evidence
  - CASB Controls – Access to Cloud services using risk-based controls
  - DLP – Providing alerting and control of regulated and sensitive data
  - App Catalogue – Simplify vendor due diligence by reviewing which applications hold compliance
  - Providing both Cloud Service Governance, Access Control and information-classification and transfer-control

## Slide 7: How Cato SASE Cloud can help YOU achieve NIS2 compliancy
- |
- NIS2 art 21 directives closely align with NIST CSF functions which Cato SASE cloud already supports
| Incident handling and reporting | Detect 

Respond | thresholds for alerts and events
security scores
mitre Att&ck dashboards
threats/incidents reports
remediation | Cato Management Application (CMA)
MDR
XDR |
| NIS2 Security Area | NIST CSF Function | Cato SASE Cloud Approach | Cato SASE Technology / Service |
| Business Continuity | Identify – Business Environment | Cloud-native fully meshed architecture
99.999% SLA guarantee | Global private backbone
HA everywhere
Redundant T1 links |
| Supply Chain Security | Detect – Continuous Monitoring | granular access control policies | NGFW, CASB, DLP |
| Systems Acquisition, development, and maintenance security | Identify – Risk Assessment
Protect -  Data Security | automatic security assessement against  best practices 
full encryption of data in-transit and at-rest with proprietary distributed KMS | Cato Management Application (CMA)
Cato Socket
Cato SDP Client
Cato POPs / Data Lake |
| Cryptography and encryption | Protect -  Data Security | full encryption of data in-transit and at-rest with proprietary distributed KMS | Cato Socket
Cato SDP Client
Cato POPs / Data Lake |
| Access control policies | Protect -  Access Control | RBAC 
MFA, SSO | Cato Management Application (CMA) |
| Asset Management | Identify – Asset Management | Full Application awareness
Full Context flow awareness | DPI, NGFW, CASB, IPS |
| Zero Trust Security | Protect -  Access Control | Universal ZTNA with continous assessment
MFA, SSO | Cato Management Application (CMA)
Cato Socket
Cato SDP Client |
[images: wip-helping-achieve-compliance-with-cato-networks_s07_0.png]

## Slide 8: ISO 27001 clauses mapped to Cato Networks
| ISO/IEC 27001:2022 clauses 4–10 mapped to Cato Networks |  |  |  |  |  |  |
| Important: all clauses 4–10 are customer-owned ISMS requirements. Cato can support them, but it does not replace your governance, risk, audit, or corrective-action processes. |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
| Clause | Requirement summary (paraphrased) | How Cato maps | What customer still owns | Coverage | Example Cato evidence | Source URL(s) |
| 4 Context | Define the ISMS scope, internal/external issues, interested parties, and dependencies relevant to information security. | Cato should be treated as an externally provided cloud security/networking service inside scope, supplier, and dependency analyses. Its security/compliance materials and DPA can support supplier due diligence. | Set scope boundaries, identify legal/regulatory requirements, decide interested-party expectations, and assess supplier risk in context of your business. | Indirect | Security/compliance page; DPA; supplier evidence collection. | https://www.catonetworks.com/security-compliance-and-privacy/https://www.catonetworks.com/cato-networks-data-processing-and-privacy-agreement/ |
| 5 Leadership | Establish policy, assign roles/accountability, and demonstrate top-management commitment. | Very little direct product mapping. Cato can support execution through centralized administration and managed services, but leadership evidence remains internal. | Approve policy, assign owners, fund the ISMS, define governance forums, and demonstrate leadership oversight. | Minimal | CMA; managed services (operational support only). | https://www.catonetworks.com/platform/cato-management-application-cma/https://www.catonetworks.com/services/ |
| 6 Planning | Perform risk assessment and treatment, set information-security objectives, and maintain the Statement of Applicability. | Cato provides candidate technical treatments and evidence: ZTNA, NGFW, SWG, IPS, CASB, DLP, DNS Security, TLS inspection, logging, XDR, and MDR. These help justify selected controls in the SoA. | Define risk methodology, evaluate risks, select or reject controls, justify exclusions, document SoA, and set measurable objectives. | Moderate | Platform architecture and control-capability pages. | https://www.catonetworks.com/platform/architecture/https://www.catonetworks.com/platform/universal-zero-trust-network-access-ztna/https://www.catonetworks.com/platform/data-loss-prevention-dlp/ |
| 7 Support | Provide resources, competence, awareness, communication, and documented information needed for the ISMS. | Cato provides a unified management plane, telemetry, documentation, integrations, and optional managed services that help run security operations and preserve evidence. | Train staff, run awareness programs, control documents and records, manage internal/external communications, and keep competence records. | Partial | CMA; integrations; managed services. | https://www.catonetworks.com/platform/cato-management-application-cma/https://support.catonetworks.com/hc/en-us/articles/15935823855389-Using-the-Integrations-Pagehttps://www.catonetworks.com/services/ |
| 8 Operation | Implement risk-treatment plans, operate controls, manage changes, and control outsourced processes relevant to the ISMS. | This is the strongest fit. Cato centrally enforces access control, network security, web filtering, cloud-app control, DLP, logging, monitoring, and detection/response across users, sites, and cloud traffic. | Run operating procedures, approve changes, manage exceptions, supervise the vendor, investigate events, and ensure outsourced activities meet your requirements. | Strong | Architecture; NGFW; ZTNA; CASB; DLP; XDR; managed services. | https://www.catonetworks.com/platform/architecture/https://www.catonetworks.com/solutions/next-generation-firewall/https://www.catonetworks.com/platform/cloud-access-security-broker-casb/https://www.catonetworks.com/platform/extended-detection-and-response-xdr/ |
| 9 Performance evaluation | Monitor, measure, analyze, evaluate, audit, and review the ISMS. | Cato provides dashboards, event telemetry, a data lake, XDR stories, and SIEM integrations that support monitoring and evidence collection for control effectiveness. | Define KPIs, review effectiveness, conduct internal audits, evaluate compliance, and hold management reviews. | Moderate | Event logs; SIEM integrations; XDR. | https://support.catonetworks.com/hc/en-us/articles/20703361797277-Best-Practices-for-Cato-Event-Logs-and-Ingestionhttps://support.catonetworks.com/hc/en-us/articles/13975273800733-Cato-Data-Third-Party-Supported-Integrationshttps://www.catonetworks.com/platform/extended-detection-and-response-xdr/ |
| 10 Improvement | Handle nonconformities, take corrective action, and continually improve the ISMS. | Cato telemetry, threat stories, and vendor-delivered service updates can help identify weaknesses and improvement opportunities. They provide inputs, not your corrective-action process itself. | Run root-cause analysis, record nonconformities, assign corrective actions, verify effectiveness, and drive continual improvement. | Partial | XDR; managed services; self-maintaining platform operations. | https://www.catonetworks.com/platform/extended-detection-and-response-xdr/https://www.catonetworks.com/services/https://www.catonetworks.com/platform/architecture/ |
- |

## Slide 9: DEMO HOW-To