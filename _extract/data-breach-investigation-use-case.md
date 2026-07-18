# 4 - Security use cases/Data Breach Investigation Use case.pptx


## Slide 1: Data Breach investigation
- Secure and simple data forensics

## Slide 2: Business objective overview
- DLP Forensics Evidence
- The use case
- Security teams need to determine whether an event is a real data leak or a false positive.
- In the event of an incident forensics are required to determine the impact.
- The Solution
- DLP Forensics: Customer-owned storage with secure and encrypted forensics retrieval, fully governed by RBAC and auditing.
- The Value
- Seamless DLP Incidents Investigation directly from the CMA
[images: data-breach-investigation-use-case_s02_0.png]

## Slide 3: DLP Forensics
- 🔗 Forensics Encryption
- All forensics are encrypted and stored using a per-account unique encryption key.
- 🔑  RBAC
- All forensics are governed by RBAC.
- 📋 Audit & Activity Logging
- All actions related to DLP Forensics are fully audited (Config change, view forensics, etc.)
- ⚙️ DLP Forensics
- Full file storage is supported for files up to 20MB.

## Slide 4: How to
- Configure AWS S3 bucket, IAM Policy and role
- https://support.catonetworks.com/hc/en-us/articles/32769630749085-Amazon-S3-Configuring-the-Forensic-Storage-Connector
- Enable the DLP forensics integration and add the role & permissions
- https://support.catonetworks.com/hc/en-us/articles/32572506261789-Investigating-DLP-Violations-with-Forensic-Evidence
- Upload a file including sensitive PII such as credit card data to CoPilot
- Find the relevant event from the data protection dashboard .Click on the ”view forensics” from the evidence field.
- Open the data incident page and click on “view evidence” to view and download the data snippet.