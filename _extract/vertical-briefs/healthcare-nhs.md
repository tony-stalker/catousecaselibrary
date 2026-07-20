# Vertical brief: UK healthcare / NHS data security (for Cato SEs)

Research date: 20 July 2026. Every claim below carries a source; anything that could not be
sourced was omitted. NO customer references — public incidents only, described from public
reporting.

---

## 1. The CAF-aligned DSPT — current edition and cadence

- The Data Security and Protection Toolkit (DSPT) moved to an NCSC CAF-aligned model in
  **September 2024** for large NHS organisations, restructured around **47 contributing
  outcomes** with achievement levels instead of the old assertion checklist.
  Source: https://www.dsptoolkit.nhs.uk/News/154
- The **current published edition is DSPT 2025-26 "version 8"**, explicitly "aligned to CAF
  version 3.4", with a final submission deadline of **30 June 2026** (i.e. the 2025-26 cycle
  has just closed as of this research date). Source: https://www.dsptoolkit.nhs.uk/News/161
- Cadence: a new edition publishes ahead of each financial-year cycle (v8 outcomes/evidence
  published 18 September 2025) with the standard submission deadline of 30 June the following
  year; an **early baseline submission by 31 December** applies to designated "early baseline"
  CAF organisations, and improvement-plan updates were due 31 December 2025.
  Sources: https://www.dsptoolkit.nhs.uk/News (news index, items dated 18 Sep 2025 and
  7 May 2026), https://www.grcilaw.com/blog/the-nhs-dspt-data-security-and-protection-toolkit-what-you-need-to-know-for-2025-26
- **No 2026-27 edition ("v9") was published as of mid-July 2026** — the DSPT news index shows
  nothing beyond the 2025-26 v8 cycle (latest item 7 May 2026). Expect the 2026-27 edition on
  the established ~September publication cadence; a page should mark this as a staleness
  check. Source: https://www.dsptoolkit.nhs.uk/News
- **Independent audit**: 2025-26 mandatory-audit scope was published for NHS Trusts, ICBs,
  ALBs, CSUs, OES, genomics organisations and IT Suppliers (15 Oct 2025), with independent
  assessment guides valid until the 30 June 2026 deadline.
  Sources: https://www.dsptoolkit.nhs.uk/News,
  https://www.dsptoolkit.nhs.uk/Help/Independent-Assessment-Guides,
  https://digital.nhs.uk/cyber-and-data-security/guidance-and-assurance/caf-aligned-dspt-guidance/audit-guides/strengthening-assurance-independent-assessment-and-audit-guide/guide-for-caf-aligned-dspt-independent-assessors

## 2. Who must comply (two tracks)

- **CAF-aligned track** (outcome-based, independently audited): NHS Trusts, Integrated Care
  Boards (ICBs), Commissioning Support Units (CSUs), DHSC Arm's Length Bodies (ALBs),
  independent providers designated Operators of Essential Services (OES) under the NIS
  Regulations, genomics organisations, **Key IT Suppliers**, and local authorities — the
  organisation list named in the DSPT 2025-26 improvement-plan instructions (7 May 2026).
  Source: https://www.dsptoolkit.nhs.uk/News
- **Standards-based / assertion track** (the "classic" DSPT against the 10 National Data
  Guardian standards): GP practices (Category 4, with GP-specific items such as clinical
  system access controls and NHS Spine usage), care homes, pharmacies, dental practices,
  opticians and most smaller suppliers (Category 3).
  Sources: https://dsptready.co.uk/blog/dspt-complete-guide/,
  https://dsptready.co.uk/blog/dspt-v8-changes-explained/,
  https://www.dsptoolkit.nhs.uk/News/161 (v8 guidance documents per organisation category)
- SE takeaway: a trust/ICB conversation is a CAF-outcomes conversation; a GP-federation or
  care-group conversation is still an assertion-and-evidence conversation.

## 3. CAF objectives and the network-control mapping

- The NHS CAF-aligned DSPT uses the four NCSC CAF objectives **plus an NHS-specific fifth**:
  A "Managing risk", B "Protecting against cyber attacks and data breaches", C "Detecting
  cyber security events", D "Minimising the impact of incidents", and **E "Using and sharing
  information appropriately"** (the NHS information-governance overlay — no CAF equivalent).
  Source: https://digital.nhs.uk/cyber-and-data-security/guidance-and-resources/caf-aligned-dspt-guidance
- Objective B principles (per NHS England guidance): B1 policies/processes, **B2 identity and
  access control** (where the MFA policy lands), **B3 data security** (incl. data in transit),
  **B4 system security** (secure configuration/hardening), **B5 resilient networks and
  systems** (network architecture, segmentation, resilience), B6 staff awareness.
  Source: https://digital.nhs.uk/cyber-and-data-security/guidance-and-resources/caf-aligned-dspt-guidance/objective-b
- Network-relevant anchors for a Cato mapping: B2 (MFA on remote/privileged access — see §5),
  B3 (encrypted transit), B4/B5 (segmentation of clinical networks, resilient WAN), C1
  (security monitoring across the estate), D (incident response/restore paths).
  Sources: objective pages under
  https://digital.nhs.uk/cyber-and-data-security/guidance-and-resources/caf-aligned-dspt-guidance
  (e.g. .../objective-b/principle-b2-identity-and-access-control)
- **CAF version nuance**: DSPT v8 (2025-26) is aligned to **CAF v3.4**, while NCSC's current
  published CAF is **v4.0 (released 6 August 2025)** — the NHS has not yet adopted v4.0.
  A page should state the NHS regime lags the headline CAF version.
  Sources: https://www.dsptoolkit.nhs.uk/News/161,
  https://www.ncsc.gov.uk/blog-post/caf-v4-0-released-in-response-to-growing-threat,
  https://www.ncsc.gov.uk/collection/cyber-assessment-framework

## 4. HSCN — status and direction

- HSCN replaced N3; migration completed by **November 2020**, described as Europe's largest
  network transition of its kind, with ~12,000 sites / ~950 organisations connected and
  estimated savings of £75m/yr.
  Sources: https://www.computerweekly.com/news/252492121/NHS-completes-transition-to-HSCN,
  https://en.wikipedia.org/wiki/Health_and_Social_Care_Network
- **HSCN remains fully operational** (NHS England service page, last updated 18 Nov 2024):
  a competitive marketplace of Consumer Network Service Providers (CN-SPs) with obligations
  on consumers. **No announced successor or retirement date.**
  Source: https://digital.nhs.uk/services/health-and-social-care-network
- Direction of travel: NHS Digital's 2018 **Internet First** policy positioned HSCN as a
  transition network between N3 and the internet; the **Future Connectivity programme closed
  March 2025** and its work continues under the **Networks and Connectivity Programme**
  (Frontline Productivity portfolio), funded subject to FY2026/27 business-case approvals —
  priorities include off-estate workforce connectivity, unified wireless access and core
  network modernisation.
  Sources: https://en.wikipedia.org/wiki/Health_and_Social_Care_Network (Internet First
  interpretation), https://digital.nhs.uk/services/future-connectivity (redirects to the
  Networks and Connectivity pages),
  https://digital.nhs.uk/services/networks-and-connectivity-transformation-frontline-capabilities
- SE takeaway: position Cato alongside/instead of legacy HSCN CN-SP circuits for
  internet-first traffic, not as "HSCN replacement mandated by NHS England" — no such mandate
  is sourced.

## 5. NHS England MFA policy

- Published **August 2023** (DSPT news announcement dated 29 August 2023); applies to NHS
  trusts and foundation trusts, ICBs, DHSC ALBs, CSUs, NIS-designated OES in health, and
  nominated genomics organisations.
  Sources: https://www.dsptoolkit.nhs.uk/News/134,
  https://digital.nhs.uk/cyber-and-data-security/guidance-and-resources/multi-factor-authentication-mfa-policy
- Requirements: MFA **must** be enforced on **all remote user access to all systems** and on
  **all privileged accounts accessing externally hosted systems** (cloud/SaaS); MFA
  **should** be enforced on privileged accounts for in-house/on-prem systems. Outcome-based —
  method not prescribed.
  Source: https://digital.nhs.uk/cyber-and-data-security/guidance-and-resources/multi-factor-authentication-mfa-policy/guide-to-multi-factor-authentication-policy
- Enforcement: incorporated as a DSPT requirement and published as guidance under s3(3)(b)
  NIS Regulations 2018 — OES have a statutory obligation under reg 10(4) to have regard to
  it; compliance progress is reported through the DSPT.
  Source: https://digital.nhs.uk/cyber-and-data-security/guidance-and-resources/multi-factor-authentication-mfa-policy

## 6. Legacy medical devices / IoMT segmentation problem

- DHSC's **cyber security strategy for health and adult social care to 2030** (policy paper,
  22 March 2023) is the strategic frame; it covers primary/secondary care, adult social care
  and the critical supply chain.
  Source: https://www.gov.uk/government/publications/cyber-security-strategy-for-health-and-social-care-2023-to-2030
- Peer-reviewed framing (npj Digital Medicine, 2026): connected medical devices expose the
  NHS to "bi-directional cyber-physical threats" spanning physical, network and cloud layers,
  blurring technology and patient safety. Source: https://www.nature.com/articles/s41746-026-02534-4
- NHS organisations rely heavily on legacy tech that no longer receives patches; network
  segmentation / micro-segmentation that isolates medical devices from administrative systems
  while preserving clinical workflows is the widely cited compensating control (vendor
  analyses — use as secondary sources only).
  Sources: https://claroty.com/blog/nhs-cybersecurity-a-comprehensive-guide,
  https://www.kiteworks.com/regulatory-compliance/medical-device-cybersecurity-uk-best-practices/
- DSPT hook: segmentation evidence lands under CAF Objective B (B4 system security, B5
  resilient networks and systems). Source: https://digital.nhs.uk/cyber-and-data-security/guidance-and-resources/caf-aligned-dspt-guidance/objective-b

## 7. Public incidents usable as evidence (no Cato customer references)

### WannaCry (May 2017) — NAO-verified figures
- Attack of Friday 12 May 2017; **at least 81 of 236 trusts** in England affected plus
  **603 primary care and other NHS organisations including 595 GP practices**; **6,912
  confirmed cancelled appointments, NHS England estimate >19,000**; five A&E departments
  diverted patients.
- NAO root causes: **unpatched or unsupported Windows** and **poor internet-facing firewall
  management**; NAO head: "a relatively unsophisticated attack [that] could have been
  prevented by the NHS following basic IT security best practice."
- Source: https://www.nao.org.uk/reports/investigation-wannacry-cyber-attack-and-the-nhs/
- (A widely quoted £92m cost figure could not be verified against a primary source in this
  research pass — omit or source before use.)

### June 2024 London pathology-services ransomware incident (public description: the
### Synnovis incident)
- 3 June 2024: Qilin ransomware encrypted systems at Synnovis, the pathology provider serving
  Guy's and St Thomas' and King's College Hospital NHS trusts in south-east London.
  Sources: https://www.bleepingcomputer.com/news/security/synnovis-notifies-of-data-breach-after-2024-ransomware-attack/,
  https://www.hipaajournal.com/care-disrupted-at-london-hospitals-due-to-ransomware-attack-on-pathology-vendor/
- Impact: **10,152 acute outpatient appointments and 1,710 elective procedures postponed**
  across the two trusts; blood testing in the capital dropped to ~10% of normal levels,
  triggering a national **O-type blood shortage** appeal.
  Sources: https://www.digitalhealth.net/2025/06/patient-dies-as-a-result-of-cyber-attack-on-nhs-pathology-provider/,
  https://www.hipaajournal.com/care-disrupted-at-london-hospitals-due-to-ransomware-attack-on-pathology-vendor/,
  https://www.england.nhs.uk/synnovis-cyber-incident/ (NHS England incident page)
- **Patient death**: in June 2025 King's College Hospital NHS FT confirmed a patient safety
  investigation found the cyber attack was **one of the contributing factors in a patient's
  death** (long wait for a blood test result) — reported as the first UK case where officials
  publicly linked a cyber attack to a death.
  Sources: https://www.kch.nhs.uk/news/synnovis-cyber-attack-update/,
  https://www.theregister.com/2025/06/26/qilin_ransomware_nhs_death/,
  https://www.digitalhealth.net/2025/06/patient-dies-as-a-result-of-cyber-attack-on-nhs-pathology-provider/
- Data: Qilin published **~400 GB** of stolen data; third-party analysts estimated data
  relating to **>900,000 patients** (Synnovis has neither confirmed nor disputed);
  Synnovis completed its forensic investigation and began notifying affected organisations
  in **November 2025**.
  Sources: https://www.hipaajournal.com/care-disrupted-at-london-hospitals-due-to-ransomware-attack-on-pathology-vendor/,
  https://www.theregister.com/2025/11/13/synnovis_qilin_investigation/,
  https://www.infosecurity-magazine.com/news/synnovis-breach-notification-2024/
- SE framing: a third-party/supplier compromise with no lateral containment became a
  patient-safety incident — supports supplier-assurance (DSPT for Key IT Suppliers, CE+ in
  contracts) and segmentation/ZTNA stories. A $50m ransom demand was reported by the
  attackers to Bloomberg (secondary): https://www.hipaajournal.com/care-disrupted-at-london-hospitals-due-to-ransomware-attack-on-pathology-vendor/

## 8. Cyber Essentials in NHS supplier contracts

- **PPN 014** requires central government contracting authorities (including NHS bodies) to
  require Cyber Essentials / CE Plus in relevant procurements involving certain personal data
  or IT services. Source: https://www.periculo.co.uk/cyber-security-blog/cyber-essentials-for-nhs-suppliers-in-2026
- **NHS Supply Chain (September 2025)**: suppliers in scope of PPN 014 must demonstrate
  **Cyber Essentials Plus** (not basic CE) where they handle NHS Supply Chain personal data
  or supply IT/digital products and services; applies at Supplier Questionnaire stage for new
  suppliers, with existing-supplier compliance reviews from **8 September 2025**; risk-based
  decisions (with NHS England) on continuing to use non-compliant suppliers; **ISO 27001 is
  not accepted as an alternative**.
  Sources: https://www.supplychain.nhs.uk/news-article/cyber-security-expectations-of-suppliers/ (primary),
  https://netsecgroup.io/guides/nhs-suppliers-cyber-essentials-mandatory,
  https://www.periculo.co.uk/cyber-security-blog/nhs-supplier-cyber-security-what-you-need-to-know-about-new-nhs-supply-chain-expectations
- DSPT supplier hook: DSPT guide 10 "Accountable suppliers" covers supplier contracts
  (10.1.1–10.3.1). Source: https://digital.nhs.uk/cyber-and-data-security/guidance-and-resources/data-security-and-protection-toolkit-assessment-guides/guide-10---accountable-suppliers/your-suppliers-and-contracts/

## 9. Overlap with existing page — link, don't repeat

`usecases/security-uk-public-sector.html` already covers, and the new healthcare page should
**link to rather than duplicate**:
- Cyber Essentials fundamentals: five control themes, CE Plus verification, IASME delivery,
  April 2026 "Danzell" v3.3 changes, and a full CE-to-Cato mapping table.
- NCSC CAF fundamentals: CAF 4.0 (Aug 2025), 14 principles, objectives A–D outcome table
  with Cato contributions, GovAssure context.
- A one-paragraph note that the DSPT has been CAF-aligned since September 2024 for trusts,
  ICBs, CSUs and DHSC ALBs ("the health sector's overlay of the CAF").
- Honest-positioning language ("Cato supports, never certifies") and the evidence-pack motif.

The healthcare page's **net-new ground**: DSPT editions/deadlines/tracks (§1–2), Objective E,
the CAF 3.4-vs-4.0 lag, HSCN/internet-first, the MFA policy specifics, IoMT segmentation,
the two incidents, and NHS Supply Chain CE+ enforcement.

## Sources (deduplicated)

1. https://www.dsptoolkit.nhs.uk/News/161 — DSPT 2025-26 (version 8), CAF v3.4 alignment, 30 June 2026 deadline, org categories
2. https://www.dsptoolkit.nhs.uk/News — DSPT news index: improvement-plan instructions (7 May 2026) with in-scope org list; v8 outcomes (18 Sep 2025); mandatory audit areas (15 Oct 2025)
3. https://www.dsptoolkit.nhs.uk/News/154 — Sept 2024 CAF adoption, 47 contributing outcomes, status framework
4. https://www.dsptoolkit.nhs.uk/News/134 — MFA policy announcement, 29 Aug 2023
5. https://www.dsptoolkit.nhs.uk/Help/Independent-Assessment-Guides — 25-26 v8 independent assessment guides
6. https://digital.nhs.uk/cyber-and-data-security/guidance-and-resources/caf-aligned-dspt-guidance — objectives A–E
7. https://digital.nhs.uk/cyber-and-data-security/guidance-and-resources/caf-aligned-dspt-guidance/objective-b — principles B1–B6
8. https://digital.nhs.uk/cyber-and-data-security/guidance-and-assurance/caf-aligned-dspt-guidance/audit-guides/strengthening-assurance-independent-assessment-and-audit-guide/guide-for-caf-aligned-dspt-independent-assessors — independent assessor guide
9. https://digital.nhs.uk/cyber-and-data-security/guidance-and-resources/multi-factor-authentication-mfa-policy — MFA policy scope and NIS status
10. https://digital.nhs.uk/cyber-and-data-security/guidance-and-resources/multi-factor-authentication-mfa-policy/guide-to-multi-factor-authentication-policy — MFA requirements detail
11. https://digital.nhs.uk/services/health-and-social-care-network — HSCN service page (operational status)
12. https://digital.nhs.uk/services/networks-and-connectivity-transformation-frontline-capabilities — Networks and Connectivity Programme
13. https://digital.nhs.uk/services/future-connectivity — Future Connectivity (closed Mar 2025) redirect/continuation
14. https://digital.nhs.uk/cyber-and-data-security/guidance-and-resources/data-security-and-protection-toolkit-assessment-guides/guide-10---accountable-suppliers/your-suppliers-and-contracts/ — DSPT supplier assertions
15. https://www.ncsc.gov.uk/collection/cyber-assessment-framework — NCSC CAF collection
16. https://www.ncsc.gov.uk/blog-post/caf-v4-0-released-in-response-to-growing-threat — CAF v4.0 release, 6 Aug 2025
17. https://www.nao.org.uk/reports/investigation-wannacry-cyber-attack-and-the-nhs/ — NAO WannaCry investigation
18. https://www.gov.uk/government/publications/cyber-security-strategy-for-health-and-social-care-2023-to-2030 — DHSC strategy to 2030 (22 Mar 2023)
19. https://www.england.nhs.uk/synnovis-cyber-incident/ — NHS England Synnovis incident page
20. https://www.kch.nhs.uk/news/synnovis-cyber-attack-update/ — King's College Hospital update incl. patient-death investigation
21. https://www.digitalhealth.net/2025/06/patient-dies-as-a-result-of-cyber-attack-on-nhs-pathology-provider/ — postponement figures, patient death
22. https://www.theregister.com/2025/06/26/qilin_ransomware_nhs_death/ — confirmed death reporting
23. https://www.theregister.com/2025/11/13/synnovis_qilin_investigation/ — investigation completion, Nov 2025 notifications
24. https://www.infosecurity-magazine.com/news/synnovis-breach-notification-2024/ — breach notification timing
25. https://www.bleepingcomputer.com/news/security/synnovis-notifies-of-data-breach-after-2024-ransomware-attack/ — attack date, Qilin attribution
26. https://www.hipaajournal.com/care-disrupted-at-london-hospitals-due-to-ransomware-attack-on-pathology-vendor/ — 400GB leak, blood shortage, ransom demand reporting
27. https://www.computerweekly.com/news/252492121/NHS-completes-transition-to-HSCN — HSCN transition complete, £75m/yr
28. https://en.wikipedia.org/wiki/Health_and_Social_Care_Network — HSCN scale, Internet First context
29. https://www.supplychain.nhs.uk/news-article/cyber-security-expectations-of-suppliers/ — NHS Supply Chain CE+ expectations
30. https://netsecgroup.io/guides/nhs-suppliers-cyber-essentials-mandatory — CE+ mandate detail (secondary)
31. https://www.periculo.co.uk/cyber-security-blog/cyber-essentials-for-nhs-suppliers-in-2026 — PPN 014 context (secondary)
32. https://www.periculo.co.uk/cyber-security-blog/nhs-supplier-cyber-security-what-you-need-to-know-about-new-nhs-supply-chain-expectations — 8 Sep 2025 review start (secondary)
33. https://dsptready.co.uk/blog/dspt-complete-guide/ — GP/care/pharmacy DSPT categories (secondary)
34. https://dsptready.co.uk/blog/dspt-v8-changes-explained/ — small-provider v8 changes (secondary)
35. https://www.grcilaw.com/blog/the-nhs-dspt-data-security-and-protection-toolkit-what-you-need-to-know-for-2025-26 — 31 Dec 2025 baseline, cycle dates (secondary)
36. https://www.nature.com/articles/s41746-026-02534-4 — npj Digital Medicine, connected medical device threats
37. https://claroty.com/blog/nhs-cybersecurity-a-comprehensive-guide — legacy/segmentation (vendor, secondary)
38. https://www.kiteworks.com/regulatory-compliance/medical-device-cybersecurity-uk-best-practices/ — IoMT segmentation practice (vendor, secondary)
