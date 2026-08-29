# Migrating from SonicWall to Cato SASE — SE brief (UK mid-market focus)

Scope: SonicWall firewalls (TZ / NSa / NSsp hardware, NSv virtual, SonicOS Gen 6 and Gen 7,
new Gen 8), NSM/GMS management, CGSS/AGSS and Essential/Advanced Protection licensing, and
SonicWall remote access (NetExtender, Mobile Connect, Global VPN Client, SMA appliances),
moving to the Cato SASE Cloud platform. This is the most incident-driven displacement brief
in the library: the 2024–2025 SSL-VPN ransomware campaigns and the MySonicWall cloud-backup
breach are documented from primary advisories below — keep VERIFIED facts and third-party
REPORTING clearly separated on pages, exactly as marked here. Anything not tied to a listed
source is marked **[recommended practice]**. Items drawn from Cato Professional Services
enablement material are marked **[Cato PS internal]** (no public URL).

All source URLs in §7 were accessed 28 Aug 2026 unless a different access note is given.

---

## 1. Vendor snapshot

### The estate you will actually find

SonicWall is a 100% channel vendor (17,000+ partners) aimed squarely at SMB and mid-market —
the classic estate is TZ-heavy: many small desktop firewalls at branches, an NSa at HQ/DC,
and SSL-VPN remote access terminating on the firewalls themselves. SonicWall's own
boilerplate claims ~500,000 business customers in 215 countries (SonicWall via Cyble, §7).
Typical estate:

- **TZ series** (desktop, branch/SMB): Gen 6 = TZ300/350/400/500/600 families; Gen 7 =
  TZ270/370/470/570/670, launched from late 2020 into 2021 alongside SonicOS 7; Gen 8 =
  TZ80/TZ280 (2025). Gen 7 TZs brought multi-gigabit ports, TLS 1.3 and SD-WAN in the
  desktop form factor.
- **NSa series** (mid-range, HQ/DC): Gen 6 = NSA 2650–6650 (and NSa 9250/9450/9650 at the
  top); Gen 7 = NSa 2700/3700/4700/5700/6700; Gen 8 = NSa 2800/3800+ (available from
  1 May 2025, running SonicOS 8).
- **NSsp series** (enterprise/MSSP: 10700–15700) and **NSv** virtual firewalls — less common
  in this segment but present in MSSP-managed estates.
- **SonicOS Gen 6 (6.5.x) vs Gen 7 (7.x)**: Gen 7 was a full OS rewrite; Gen 7 NSsp/NSv can
  run in "policy mode" (unified policy) while TZs/NSa typically run "classic mode" —
  zone-matrix access rules, address/service objects, App Rules. Config migrates Gen 6 → Gen 7
  via settings import — and that import path is exactly what the Akira campaign abused (see
  the security-history section).
- **Management**: standalone WebUI per box for the smallest shops; **NSM** (Network Security
  Manager, SaaS or on-prem) for multi-firewall estates — inventory, templates, commits,
  zero-touch; legacy **GMS** (Global Management System) hit its Last Day Order on
  1 Oct 2025 and customers are being pushed to NSM 3.0. MSSP-run estates often manage via
  the MSP's NSM tenant.
- **Licensing**: Gen 6 bundles were **CGSS** (Comprehensive Gateway Security Suite: gateway
  anti-malware, IPS, App Control, CFS Premium Business, 24×7 support) and **AGSS** (CGSS +
  Capture ATP cloud sandboxing). Gen 7 renamed these **EPSS** (Essential Protection Service
  Suite ≈ AGSS + anti-spam) and **APSS** (Advanced, adding cloud management/reporting).
  Renewal SKUs and bundle names are a reliable discovery signal for what is actually
  enforced on each box.
- **Remote access**: **NetExtender** (Windows/Linux SSL-VPN client) and **Mobile Connect**
  (iOS/Android/macOS — no longer supported on Windows) terminate on the firewall's SSL-VPN
  portal ("Virtual Office", with clientless bookmarks); **Global VPN Client** (GVC) is the
  legacy IPsec client using the firewall's GroupVPN policy; **SMA 100** appliances
  (SMA 210/410/500v) were the dedicated SSL-VPN gateway line until SonicWall force-retired
  them on 31 Oct 2025 (below). SMA 1000 remains for larger estates.
- **SonicWall's own SASE pivot**: SonicWall acquired Banyan Security (announced 3 Jan 2024,
  completed 26 Dec 2023) and sells it as **Cloud Secure Edge (CSE)** — expect it as the
  incumbent counter-pitch (§5).

### Verifiable migration drivers (EOL and refresh pressure)

| SonicWall milestone | Date | Consequence | Source (§7) |
|---|---|---|---|
| Gen 6 firewalls entered Limited Retirement Mode — no new firmware/features, critical fixes only | 20 Apr 2024 | Gen 6 estates frozen; every subsequent CVE response is best-effort | sonicwallonline.co.uk Gen 6 LRM notice |
| TZ400/TZ400W/TZ600/TZ600P/NSA 3600/NSa 3650: last order day for support renewal | 31 Jul 2025 | No more paid support extensions | SonicWall product notification |
| GMS Last Day Order — licences/renewals end; migrate to NSM 3.0 | 1 Oct 2025 | Management-plane refresh forced on GMS estates | SonicWall GMS EOL announcement |
| **SMA 100 series end of support brought forward; all SMA 100 devices retired** | **31 Oct 2025** | Remote-access appliance line terminated; no-charge transition offers to Cloud Secure Edge (24-month licence) or firewall SSL-VPN licences | sonicwallonline.co.uk SMA notice; SonicWall FAQ (see §6 note on "cease to function") |
| SOHO/SOHOW/TZ 300P/NSa 9250/9450/9650 end of support | 16 Apr 2026 | No technical support, firmware or RMA; SonicWall's own notice recommends **Gen 8** replacements (TZ80 for SOHO, NSa 3800–6800 etc.) | SonicWall EOS notification |
| TZ400/TZ600/NSA 3600/NSa 3650 end of support | 1 Aug 2026 | Same — the bulk of the classic Gen 6 branch estate goes dark for fixes | SonicWall product notification |
| Gen 8 hardware + SonicOS 8 shipping (NSa 2800/3800 from 1 May 2025; TZ80 etc.) | 2025 onwards | Gen 7 buyers of 2021 are already being marketed the *next* refresh; Secure Upgrade Plus trade-in pushed at every EOS notice | SonicWall Gen 8 pages; firewalls.com |

Talking point: a Gen 6 estate in 2026 is at or past end-of-support, its management platform
(GMS) is retired, its dedicated remote-access line (SMA 100) was switched off mid-contract
with barely two months' runway, and the vendor's proposed fix is another appliance
generation (Gen 8) plus a bolted-on SSE (CSE). The refresh money is being spent either way —
the question is whether it buys a third appliance cycle or removes the appliance cycle.
**[recommended practice]**

### The security-history driver (the strongest in the library — still handle with precision)

**VERIFIED from SonicWall's own advisories/notices:**

- **CVE-2024-40766 (SNWLID-2024-0015)** — improper access control in SonicOS management
  access *and* SSL-VPN, CVSS 9.3. Advisory published 22 Aug 2024; affected Gen 5
  (≤5.9.2.14-12o), Gen 6 (≤6.5.4.14-109n) and Gen 7 (≤7.0.1-5035). Updated early Sep 2024
  to flag potential active exploitation; CISA added it to the KEV catalogue on 9 Sep 2024.
  Critically, the advisory told customers to **reset all local SSL-VPN account passwords**,
  especially for configs imported from Gen 6 to Gen 7.
- **Aug 2025 Gen 7 SSL-VPN campaign** — SonicWall notice published 4 Aug 2025 (updated to
  22 Aug 2025): after initially investigating a possible zero-day, SonicWall stated with
  "high confidence" the activity was **not** a zero-day but correlated with CVE-2024-40766;
  fewer than 40 incidents under investigation, many tied to **Gen 6 → Gen 7 migrations where
  local user passwords were carried over and never reset**. Guidance: upgrade to SonicOS
  7.3.0 (released Jul 2025, with added brute-force/MFA protections), reset all local SSL-VPN
  passwords, enable Botnet Protection and Geo-IP filtering, remove inactive accounts. NHS
  England issued cyber alert CC-4686 on this activity — useful UK-relevance evidence.
- **MySonicWall cloud-backup breach** — SonicWall notice published 17 Sep 2025: an
  unauthorised party accessed firewall configuration backup files stored in MySonicWall
  cloud backup. Initially scoped at "<5% of firewalls"; on 8 Oct 2025 SonicWall (with
  Mandiant) concluded the investigation and confirmed **all customers who had used the cloud
  backup service were affected**. The files contain encrypted credentials plus full
  configuration data, and SonicWall's own notice says possession "could increase the risk of
  targeted attacks". Remediation required customers to run an "Essential Credential Reset"
  across local users, TOTP bindings and IPsec VPN keys.
- **SMA 100 forced retirement** — end of support brought forward to 31 Oct 2025 with
  no-charge transition offers (CSE 24-month licence, or SSL-VPN licences on the firewall).
  Context: the SMA 100 line had been under sustained attack (below).

**REPORTED by credible third parties (attribute as reporting, not as SonicWall statements):**

- **Akira/Fog via SSL-VPN, wave 1 (2024)** — Arctic Wolf reported ~30 Akira and Fog
  ransomware intrusions from Aug 2024 with initial access via SonicWall SSL-VPN accounts on
  devices unpatched for CVE-2024-40766; logins typically from VPS infrastructure;
  encryption often same-day. Macnica (Dec 2024) reported roughly half of organisations on
  Akira/Fog leak sites were running SonicWall, with ~48,933 devices still exposed and
  unpatched.
- **Akira wave 2 (Jul–Sep 2025)** — Arctic Wolf reported the campaign resuming from
  22 Jul 2025 against Gen 7+ firewalls with SSL-VPN enabled — largely credentials carried
  over from Gen 6 imports; The Hacker News/Rapid7 reported malicious logins that *passed
  OTP MFA challenges* (consistent with seeds/credentials harvested earlier), with port
  scanning, Impacket SMB activity and encryption in under four hours. CISA/FBI reporting
  put Akira proceeds at ~$244M by late Sep 2025.
- **SMA 100 OVERSTEP campaign** — Google Threat Intelligence (Jul 2025) documented UNC6148
  deploying the OVERSTEP rootkit/backdoor on **fully patched, end-of-life SMA 100**
  appliances, using credentials likely stolen via earlier CVEs (incl. CVE-2025-32819,
  CVE-2024-38475, CVE-2021-20038/-20039); SonicWall shipped 10.2.1.15-81sv with file-integrity
  checks in response.
- **Attribution of the backup breach** — The Hacker News (Nov 2025) reported SonicWall
  confirming a **state-sponsored** actor behind the MySonicWall incident; the SonicWall
  notice page itself says only "unauthorized party" — cite the attribution as reporting.

**The argument to run**: this is not "SonicWall is uniquely bad" — it is that the estate's
crown jewels (VPN credentials, PSKs, full configs) live on and around WAN-facing appliances
and the vendor's cloud, and both were compromised classes in 2024–2025. Two structural
lessons drive the Cato conversation: (1) SSL-VPN termination on the edge firewall is the
single most exploited entry point in this estate class — ZTNA from a cloud PoP removes it;
(2) the exploitation mechanic was **configuration carry-over** (old local passwords imported
into new boxes) — which is precisely why a Cato migration must be review-and-map with full
secret rotation, never lift-and-shift (§4/§5). **[recommended practice]**

---

## 2. What SonicWall does well — and the shape of the play

Concede honestly; it narrows the deal to winnable scope:

- **Price/performance for SMB**: TZ boxes are cheap, familiar to UK MSPs, and bundle a lot
  (AV, IPS, App Control, CFS, anti-spam in EPSS) for the money.
- **Channel depth**: 100% channel, 17,000+ partners — the MSP relationship usually outlasts
  the hardware. The MSP is the real buyer in most UK SonicWall accounts (§5).
- **Capture ATP/RTDMI** genuinely differentiated in SMB sandboxing when launched, and
  SonicWall's threat research (Capture Labs) is real.
- **The play**: this is a full network-stack displacement — unlike Sophos there is no
  beloved endpoint suite to preserve. What you must bring along is the **MSP** and the
  **operational muscle memory** (zone thinking, per-box rules) — the migration story is
  "same intent, one global policy, no boxes to patch". **[recommended practice]**

---

## 3. Component → Cato mapping

| SonicWall component | Function | Cato equivalent | Notes |
|---|---|---|---|
| TZ/NSa/NSsp/NSv + zone-based access rules | Edge NGFW | Cato Socket + FWaaS (WAN firewall for site↔site/user↔site, Internet firewall for outbound) | Zone matrix collapses into one global, ordered rule base; no per-box firmware or HA pairs |
| App Control / App Rules (signature categories, per-app actions) | App identification & control | Cato Internet/WAN firewall rules on applications and app categories | Cato's app catalogue is maintained in-cloud; App Rules bandwidth actions map to Cato QoS/bandwidth priorities |
| Content Filtering Service (CFS 4.0 profiles/policies, 60+ categories, allowed/forbidden URI lists, keywords) | Web filtering / SWG | Cato Internet firewall URL categories + custom categories (SWG) | URI lists → custom categories; per-user/group CFS policies → identity-aware rules via SCIM groups; keyword blocking has no direct equivalent — validate need |
| DPI-SSL (client/server TLS interception, resigning CA, exclusions) | TLS inspection | Cato TLS Inspection at the PoP | Same CA-trust deployment job (swap resigning cert for Cato cert); removes the appliance TLS-throughput sizing maths — DPI-SSL connection counts are a hard per-model limit on TZs |
| Gateway Anti-Virus + Anti-Spyware + IPS | Known-threat prevention | Cato IPS + Anti-Malware in the single-pass engine | Botnet Filter and Geo-IP Filter map to Cato reputation/geo protections |
| Capture ATP (+RTDMI) | Cloud sandboxing of unknown files | Cato Anti-Malware / NG Anti-Malware (ML-based) | Match file-type scoping and block-until-verdict behaviour expectations in pilot |
| Site-to-site IPsec VPN + SD-WAN groups/probes | Inter-site connectivity | Cato Socket sites on the global private backbone | SonicWall S2S is firewall-to-firewall over the public internet; Cato adds the private middle-mile; retained SonicWalls can IPsec (IKEv2) into Cato as on-ramps during co-existence |
| NetExtender / Mobile Connect / Virtual Office (SSL-VPN) | Remote access | Cato Client (ZTNA) + clientless browser access | Removes the WAN-facing SSL-VPN portal — the exploited surface in every campaign above |
| Global VPN Client + GroupVPN (IPsec) | Legacy remote access | Cato Client | GVC estates are old; treat as re-onboarding, not parity mapping |
| SMA 100/1000 (SSL-VPN appliance, bookmarks, WAF) | Dedicated remote-access gateway | Cato ZTNA + clientless access | SMA 100 is already dead (31 Oct 2025); users were force-migrated once — to CSE or firewall SSL-VPN — and can be moved once more, properly |
| NSM / GMS / Analytics | Central management & reporting | Cato Management Application (CMA) | NSM inventory export seeds discovery (§4); GMS estates have a forced management migration anyway |
| Comprehensive Anti-Spam (EPSS) | Email hygiene | **No Cato equivalent** | Almost always redundant with M365/Google email security — confirm, don't assume (§5) |
| SonicWave APs / SonicWall Switches managed from firewall/NSM | LAN/WLAN | **Not replaced by Cato** | LAN gear stays or is refreshed separately; plan management continuity before removing the firewall (§5) |

---

## 4. Recommended migration path

Anchored to the Cato PS methodology — **Export → Review & Map → Deploy (monitor-first) →
Optimise** — with a discovery → co-existence → pilot → phased cutover → decommission arc.
**[Cato PS internal]**

### Phase 0 — Discovery and EXPORT

- **Inventory**: models and generations per site (any Gen 6 = past/at end-of-support — lead
  with the table in §1), SonicOS versions (anything pre-7.3 on Gen 7 signals patch-cadence
  risk), bundle per box (CGSS/AGSS vs EPSS/APSS from MySonicWall licensing), renewal dates,
  NSM vs GMS vs unmanaged, MSP contract terms, SMA history (what happened to those users
  after 31 Oct 2025?), SonicWave/Switch dependencies.
- **Config export, three complementary forms** per firewall:
  1. **.exp settings export** (Device > Settings > Firmware & Backups > Import/Export, or
     CLI `export current-config`): the authoritative archive, but not human-readable — keep
     it as rollback/reference.
  2. **Tech Support Report (TSR)** — plain-text dump including the running config; export
     per box or via NSM; the practical input to a mapping workbook.
  3. **SonicOS API** (enable under Device > Settings > Administration; endpoints documented
     at sonicos-api.sonicwall.com): JSON export of address objects, service objects, access
     rules, NAT policies — the machine-readable feed for bulk mapping.
- **NSM-managed estates**: export the device inventory to CSV/JSON, export per-firewall
  configs to templates, and pull TSRs centrally — one pass over the whole estate.
- **Usage evidence**: per-access-rule Rx/Tx byte/packet statistics in the Access Rules page
  identify dead rules before anyone argues about them (clear counters, re-read after 30
  days); AppFlow/Analytics reports baseline application usage for the Cato app-category
  mapping. **[recommended practice]**
- **Secrets audit — non-negotiable**: enumerate local users (especially SSL-VPN-enabled),
  IPsec PSKs, SNMP strings, admin accounts. Given the MySonicWall backup exposure (all
  cloud-backup users) and the password-carry-over exploitation history, treat **every
  secret in the estate as potentially compromised**: everything gets rotated at migration
  and local VPN accounts are never recreated on the Cato side — identity comes from the IdP.
  **[recommended practice]**

### Phase 1 — Co-existence foundation

- Stand up the Cato account: CMA admin model, IdP SSO + SCIM (Entra ID in most UK
  mid-market), base policy from Cato best-practice templates.
- **TZ-heavy branch estates, two patterns** (often combined): **[Cato PS internal]**
  - **Parallel Socket per site** — the default for TZ sites: Socket (X1500/X1600) alongside
    the TZ, L3 handoff, move subnets/VLANs progressively; rollback is re-plugging.
  - **IPsec on-ramp** — remaining SonicWalls build IKEv2 IPsec tunnels to the nearest Cato
    PoP as interim sites: useful for sites awaiting Socket delivery, short-lease sites, or
    as the hub interconnect carrying un-migrated branch traffic to Cato-side resources
    during transition. Keep the SonicWall S2S VPN authoritative for un-migrated sites and
    filter default routes at the interconnect.
- Sequence waves by the EOS calendar (§1): 16 Apr 2026 models and the Aug 2026 TZ400/600
  wave first — those boxes must be replaced with *something* regardless.

### Phase 2 — Pilot (MAP validated, DEPLOY monitor-first)

- 1–3 representative sites: one TZ branch, plus the HQ NSa with the densest rule base.
- Map zone-matrix rules → Cato WAN/Internet firewall; CFS profiles → URL categories +
  custom categories; App Rules → app-category rules; DPI-SSL exclusions → TLSi bypass
  rules; Capture ATP scope → Anti-Malware settings. Review-and-map, not lift-and-shift —
  per-box rule bases collapse into one global policy, and dead rules (hit counters, Phase 0)
  are dropped, not migrated. **[recommended practice]**
- Run IPS, Anti-Malware and new block rules in **monitor/log first**; enable TLS inspection
  on a pilot group after swapping the DPI-SSL resigning CA for the Cato certificate in MDM.
- Pilot users on the Cato Client alongside NetExtender/GVC cohorts; validate SSO, MFA at
  the IdP, posture checks, and app access including anything that lived as a Virtual
  Office bookmark.

### Phase 3 — Phased site cutover

- TZ sites by wave: Socket in parallel → move VLANs → remove the site from the SonicWall
  VPN topology → validate → leave the TZ racked through the soak window. Rollback =
  re-enable the tunnel. **[recommended practice]**
- Inventory and re-create inbound NAT/port-forwards per site before cutover (branch
  servers, CCTV, third-party maintenance access) — Cato-side equivalents (remote port
  forwarding / allocated IPs) are a different model; surface this in discovery, not on
  cutover night. **[recommended practice]**
- Update anything keyed to site egress IPs (SaaS allowlists, partner firewalls) per wave.

### Phase 4 — Remote access displacement

- Cohort rollout of the Cato Client via MDM; NetExtender and GVC profiles removed per
  cohort; **disable the SSL-VPN service and Virtual Office portal on each firewall as its
  last cohort clears** — this is the measurable de-risking moment; log it as evidence.
- Never migrate firewall-local VPN accounts; all Cato access is IdP-backed with MFA and
  device posture. SMA-refugee users already on CSE can move in the same cohorts.
  **[recommended practice]**

### Phase 5 — OPTIMISE and decommission

- Tighten monitor-mode rules to block, widen TLSi scope, tune QoS; use CMA analytics to
  retire never-hit rules quarter by quarter. **[Cato PS internal]**
- Decommission order: branch TZs → hub NSa/interconnect → SSL-VPN portals (if not already
  off) → lapse EPSS/APSS/CGSS renewals; cancel or repurpose NSM; delete MySonicWall cloud
  backups once appliances are retired (they are an exfiltration target even post-migration —
  see §1). **[recommended practice]**

### Measurable evidence to collect along the way

- Count of Gen 6 boxes past end-of-support at project start (from NSM inventory export).
- Count of WAN-facing SSL-VPN portals at start vs zero at finish — the headline metric.
- Rule-base collapse: per-box rule counts summed vs final global policy rule count; % dead
  rules identified by hit counters.
- Secrets rotated (local accounts removed, PSKs retired) — auditable against the
  MySonicWall remediation guidance.
- Patch events eliminated: firmware updates/emergency advisories no longer applicable per
  site per year. **[recommended practice]**

---

## 5. Gotchas and objection handling

- **"We already patched CVE-2024-40766."** The 2025 wave hit *patched* Gen 7 boxes because
  imported credentials, not the bug, were the entry point — and the cloud-backup breach
  means config secrets may be adversary-held regardless of patch level. The exposure is the
  architecture (WAN-facing SSL-VPN + secrets bound to appliances), not one CVE. Precise
  citations in §1 — use them verbatim, never embellish.
- **"SonicWall has SASE too" (Cloud Secure Edge).** Concede CSE exists (Banyan, acquired
  Jan 2024). Counters: it is an SSE bolted beside the firewall estate — the appliance,
  its firmware cycle, and its refresh economics all remain; there is no private backbone;
  and customers met CSE as the forced landing zone of the SMA 100 shutdown, not as a chosen
  platform. Cato replaces the appliance layer rather than supplementing it.
  **[recommended practice]**
- **The MSP is the real buyer.** 100% channel vendor; the box margin and management fee is
  the partner's. Bring the MSP into the deal (Cato partner-delivered model) or expect
  resistance regardless of technical merit. **[recommended practice]**
- **Anti-spam gap.** EPSS bundles Comprehensive Anti-Spam; Cato does not do email security.
  Nearly always redundant with M365/Google — but verify MX records and any on-box smart-host
  arrangements before promising parity. **[recommended practice]**
- **SonicWave APs and SonicWall Switches.** Managed from the firewall/NSM; removing the
  firewall orphans their management. Inventory in Phase 0; keep NSM for LAN gear short-term,
  or fold a LAN refresh into the project. **[recommended practice]**
- **Branch inbound NAT.** TZ estates accumulate port-forwards (local servers, CCTV, BMS).
  Different model on Cato — inventory early (§4 Phase 3).
- **DPI-SSL practicalities cut both ways.** Many SonicWall estates never fully enabled
  DPI-SSL (per-model connection limits, CA-deployment pain) — which means the Cato TLSi
  rollout may be the customer's *first* full TLS inspection: plan exclusions (banking,
  health) and comms accordingly rather than assuming like-for-like. **[recommended practice]**
- **4G/5G failover.** TZs commonly run USB LTE failover. Confirm the Cato-side equivalent
  per site design during discovery — do not hand-wave it. (Not verified in this pass — see
  §8.)
- **Don't overclaim the SMA "kill switch".** Reseller notices state SMA 100 devices "cease
  to function" on 31 Oct 2025; SonicWall's own wording is end-of-support plus no-charge
  migration. Say "force-retired with two months' runway and no-charge migration offers" —
  fully supported — rather than "bricked", unless the customer's own devices confirm it.
- **Fairness note.** SonicWall published advisories promptly, shipped SonicOS 7.3
  hardening, gave SMA users free transition licences, and brought in Mandiant. The argument
  is the appliance category and the secrets-on-the-edge model — the same KEV-class story as
  Fortinet, Cisco, Ivanti — not vendor character assassination. **[recommended practice]**

---

## 6. Cato-side notes (already documented in the library — summary only)

- **Socket sites** (X1500/X1600/X1700): zero-touch branch on-ramp to the nearest PoP; the
  like-for-like physical replacement for a TZ at a branch.
- **IPsec sites**: IKEv2 tunnels from retained third-party firewalls (here: SonicWalls)
  into the PoP — the standard co-existence on-ramp.
- **FWaaS**: single global ordered policy — WAN firewall (site↔site, user↔site) and
  Internet firewall (outbound), identity-aware via SCIM groups.
- **SWG**: URL categories + custom categories under the Internet firewall; TLS inspection
  at the PoP with bypass rules.
- **ZTNA**: Cato Client + Client Connectivity Policy + Device Posture; clientless browser
  access for the bookmark/portal use cases.
- **CMA**: one console for sites, users, policy and analytics — the NSM/GMS successor in
  the target state.

---

## 7. Sources

**Estate / lifecycle / licensing**
- Gen 6 Limited Retirement Mode (20 Apr 2024): https://www.sonicwallonline.co.uk/news/gen6-limited-retirement-mode.html
- SonicWall lifecycle phases explained (LDO/ARM/LRM/EOS): https://www.sonicwall.com/support/knowledge-base/understanding-sonicwall-product-lifecycle/kA1VN0000000Mes0AE and https://www.sonicwall-sales.com/help-advice-and-tech-info/sonicwall-product-life-cycle-tables.html
- TZ400/TZ400W/TZ600/TZ600P/NSA 3600/NSa 3650 — LDO for support 31 Jul 2025, EOS 1 Aug 2026, Gen 7 replacements: https://www.sonicwall.com/support/product-notification/sonicwall-last-order-day-of-support-announcement-tz-400-tz400w-tz600-tz-600p-nsa-3600-nsa-3650/kA1VN0000000R1u0AE
- SOHO/SOHOW/TZ 300P/NSa 9250/9450/9650 — EOS 16 Apr 2026; Gen 8 replacements recommended (TZ80, TZ280W/P, NSa 3800–6800); Secure Upgrade Plus: https://www.sonicwall.com/support/product-notification/end-of-support-notification-of-soho-sohow-tz-300p-nsa-9250-nsa-9450-and-nsa-9650/kA1VN0000014jIw0AI
- GMS EOL / LDO 1 Oct 2025, NSM 3.0 transition: https://www.sonicwall.com/support/product-notification/gms-eol-announcement/kA1VN0000000R560AE and https://www.sonicwall.com/support/knowledge-base/gms-end-of-life-and-nsm-transition-faq/kA1VN0000000G6P0AU
- Gen 7 launch (TZ270–TZ670, NSa 2700–6700, NSsp, SonicOS 7): https://www.sonicwall-sales.com/news/sonicwall-announce-new-gen7-tz270-tz370-and-tz470-series.html and https://www.firewalls.com/blog/sonicwall-gen-7-firewalls/ and https://www.sonicwall.com/resources/datasheet/datasheet-sonicwall-tz-series-gen-7
- Gen 8 / SonicOS 8 (NSa 2800/3800 from 1 May 2025; TZ80): https://www.firewalls.com/blog/sonicwall-nsa-gen-8/ and https://www.sonicwall.com/resources/datasheet/sonicwall-mid-range-gen-8-nsa-series
- Bundles compared — CGSS vs AGSS vs Gen 7 EPSS/APSS: https://www.sonicwall-sales.com/bundles-compared.html and https://www.vodanetsystems.com/blog/post/sonicwall-licensing-guide
- SonicWall channel model (100% channel, 17,000+ partners): https://www.sonicwall.com/news/sonicwall-posts-record-breaking-year-as-channel-partners-thrive-with-unparallel-product-demand
- ~500,000 businesses / 215 countries (SonicWall boilerplate, quoted in ACSC-warning coverage): https://cyble.com/blog/acsc-warns-of-cve-2024-40766/

**Security incidents — primary (SonicWall)**
- SNWLID-2024-0015 / CVE-2024-40766 analysis incl. affected versions and KEV date 9 Sep 2024: https://www.rapid7.com/blog/post/2024/09/09/etr-cve-2024-40766-critical-improper-access-control-vulnerability-affecting-sonicwall-devices/ (SonicWall PSIRT page: https://psirt.global.sonicwall.com/vuln-detail/SNWLID-2024-0015)
- Gen 7 SSL-VPN threat-activity notice (pub. 4 Aug 2025, upd. 22 Aug 2025; "high confidence" not zero-day; <40 incidents; Gen 6→7 password carry-over; SonicOS 7.3.0 guidance): https://www.sonicwall.com/support/notices/gen-7-and-newer-sonicwall-firewalls-sslvpn-recent-threat-activity/kA1VN0000000RDG0A2
- MySonicWall cloud-backup incident notice (pub. 17 Sep 2025; 8 Oct 2025 conclusion with Mandiant; all cloud-backup users affected; credential-reset playbook): https://www.sonicwall.com/support/notices/mysonicwall-cloud-backup-file-incident/kA1VN0000000RoD0AU
- SMA 100 EOS 31 Oct 2025 + no-charge CSE/SSL-VPN transition offers: https://www.sonicwallonline.co.uk/news/sma-end-of-support.html (SonicWall FAQ: https://www.sonicwall.com/support/knowledge-base/sma100-end-of-support-no-charge-replacement-faq/kA1VN0000000Rra0AE — page intermittently 404s; reseller notice retained as backup)

**Security incidents — reporting**
- Arctic Wolf: Akira/Fog via SonicWall SSL-VPN, ~30 intrusions from Aug 2024: https://arcticwolf.com/resources/blog/arctic-wolf-labs-observes-increased-fog-and-akira-ransomware-activity-linked-to-sonicwall-ssl-vpn/
- Macnica (Dec 2024): leak-site analysis; ~48,933 exposed unpatched devices: https://security.macnica.co.jp/en/blog/2024/12/akira-fog-exploit-sonicwall-nsa-cve-2024-40766-where-patching-stands.html
- Arctic Wolf (22 Sep 2025): July 2025 uptick, campaign from 22 Jul 2025, zero-day initially plausible then attributed to CVE-2024-40766: https://arcticwolf.com/resources/blog/arctic-wolf-observes-july-2025-uptick-in-akira-ransomware-activity-targeting-sonicwall-ssl-vpn/ and update: https://arcticwolf.com/resources/blog/september-2025-update-ongoing-akira-ransomware-campaign/
- The Hacker News (Sep 2025): OTP-MFA-passing logins, sub-4-hour encryption, ~$244M Akira proceeds: https://thehackernews.com/2025/09/sonicwall-ssl-vpn-flaw-and.html · Aug 2025 not-a-zero-day confirmation: https://thehackernews.com/2025/08/sonicwall-confirms-patched.html
- NHS England cyber alert CC-4686 (Gen 7 SSL-VPN exploitation): https://digital.nhs.uk/cyber-alerts/2025/cc-4686
- Google Threat Intelligence: UNC6148 / OVERSTEP on end-of-life SMA 100 (Jul 2025): https://cloud.google.com/blog/topics/threat-intelligence/sonicwall-secure-mobile-access-exploitation-overstep-backdoor and https://thehackernews.com/2025/07/unc6148-backdoors-fully-patched.html
- Backup-breach scope (all cloud-backup users) reporting: https://www.securityweek.com/all-sonicwall-cloud-backup-users-had-firewall-configurations-stolen/ · state-sponsored attribution reporting (Nov 2025): https://thehackernews.com/2025/11/sonicwall-confirms-state-sponsored.html

**Discovery / export mechanics**
- Export Settings vs Create Backup (.exp): https://www.sonicwall.com/support/knowledge-base/what-is-the-difference-between-export-settings-and-create-backup-settings/170504488135365/ and SonicOS 7 export UI: https://www.sonicwall.com/support/technical-documentation/docs/sonicos-7-0-0-0-device_settings/Content/Topics/Firmware_Settings/exporting-settings.htm
- CLI config export (E-CLI / `export current-config`): https://www.sonicwall.com/support/knowledge-base/export-configuration-settings-using-enterprise-command-line-interface-e-cli/170504991622695/
- SonicOS API export of objects/rules (Postman/cURL; endpoint reference sonicos-api.sonicwall.com): https://www.sonicwall.com/support/knowledge-base/export-the-address-objects-groups-using-sonicos-api-postman-and-curl/kA1VN0000000Gj70AE
- NSM device inventory + CSV/JSON export: https://www.sonicwall.com/support/technical-documentation/docs/nsm-administration/Content/topics/Inventory/device-inventory.htm and https://www.sonicwall.com/support/knowledge-base/how-to-export-or-import-all-managed-firewalls-on-nsm-on-prem/230104165757253/
- NSM: export firewall config to template: https://www.sonicwall.com/support/technical-documentation/docs/unifiedmgt-firewall-admin/Content/topics-new/Template/GoldenTemplate/exporting-firewall-config.htm · TSR export via NSM: https://www.sonicwall.com/support/knowledge-base/nsm-how-to-export-firewall-tech-support-report-tsr-from-nsm/kA1VN0000000JIr0AM
- Access-rule traffic statistics (per-rule Rx/Tx counters, clearable): https://www.sonicwall.com/support/technical-documentation/docs/sonicos-7-0-0-0-rules_and_policies/Content/access-rules-display-traffic-statistics.htm/

**Policy structure (for the MAP phase)**
- CFS overview (SonicOS 7.1 — profiles, policies, categories, URI lists): https://www.sonicwall.com/support/technical-documentation/docs/sonicos-7-1-content_filtering/Content/cfs-overview.htm and CFS 4.0 overview: https://www.sonicwall.com/support/knowledge-base/content-filtering-service-cfs-4-0-overview/170505704497427
- DPI-SSL (incl. per-access-rule disable): https://www.sonicwall.com/support/technical-documentation/docs/sonicos-8-0-tz_gsg/Content/11-DPI-SSL/dpi-ssl.htm and https://www.sonicwall.com/support/knowledge-base/how-to-disable-dpi-ssl-client-and-dpi-ssl-server-as-per-access-rule/200511225754390/
- Capture ATP + RTDMI datasheet: https://www.firewalls.com/blog/documents/SonicWALL/DataSheet-CaptureAdvancedThreatProtection-US-VG-MKTG5222-1.pdf
- SSL-VPN / NetExtender / Mobile Connect (Mobile Connect no longer supported on Windows): https://www.sonicwall.com/products/remote-access/vpn-clients and https://www.sonicwall.com/support/technical-documentation/docs/sonicos-8-0-ssl-vpn/Content/ssl-vpn-about.htm
- Access rules (classic mode, SonicOS 7.1/8): https://www.sonicwall.com/support/technical-documentation/docs/sonicos-7-1-rules_policies_global/Content/Access_Rules/access-rules-setting.htm

**SonicWall SASE counter-pitch**
- Banyan acquisition (announced 3 Jan 2024; completed 26 Dec 2023): https://www.securityweek.com/sonicwall-buys-banyan-security-for-ztna-technology/ and https://www.prnewswire.com/news-releases/sonicwall-accelerates-sase-offerings-acquires-proven-cloud-security-provider-302024973.html

**Cato documentation**
- What are Cato Sockets: https://support.catonetworks.com/hc/en-us/articles/30175650827677-What-are-Cato-Sockets
- Internet firewall: https://support.catonetworks.com/hc/en-us/articles/4413273486865-What-is-the-Cato-Internet-Firewall
- Device Posture: https://support.catonetworks.com/hc/en-us/articles/7387501459357-Creating-Device-Posture-Profiles-and-Device-Checks
- Client Connectivity Policy: https://support.catonetworks.com/hc/en-us/articles/4415419573393-Configuring-the-Client-Connectivity-Policy
- SCIM provisioning: https://support.catonetworks.com/hc/en-us/articles/13651160092701-Provisioning-Users-with-SCIM
- BGP in the Cato Cloud: https://support.catonetworks.com/hc/en-us/articles/7825408860573-Using-BGP-in-the-Cato-Cloud
- Platform pages (FWaaS/SWG/ZTNA): https://www.catonetworks.com/platform/firewall-as-a-service/ · https://www.catonetworks.com/platform/secure-web-gateway/ · https://www.catonetworks.com/platform/zero-trust-network-access/

**Internal (no public URL)**
- Cato PS enablement — co-existence patterns (parallel Socket, IPsec on-ramp/hub
  interconnect, route filtering), monitor-first deploy and rollback runbooks, reused here
  for TZ/NSa estates.

---

## 8. Unresolved (not sourced during research — do not state on pages)

- Exact per-model EOS dates for TZ300/TZ350/TZ500/SOHO 250/NSA 2650–6650 — the SonicWall
  lifecycle tables page is JS-rendered and could not be scraped this pass; reseller
  reporting puts TZ300 EOS at Jan 2025 but this was not verified from SonicWall. Verify per
  customer estate in MySonicWall before quoting.
- Exact SonicOS 7.3.0 release date — reported as late Jul 2025 (Coalition/THN); SonicWall
  release-note date not captured.
- Whether SMA 100 appliances were technically disabled ("cease to function") on
  31 Oct 2025 or only unsupported — reseller notices say terminated; SonicWall FAQ page
  intermittently 404s. Say "force-retired" and let the customer's own devices settle it.
- Precise EPSS vs APSS component split (whether RTDMI tiering or NSM tier differs between
  them) — reseller comparison tables conflict slightly; confirm against the current
  SonicWall datasheet for the customer's models.
- Cato Socket LTE/5G failover options for TZ USB-modem parity — confirm current hardware
  options with Cato SE resources.
- UK-specific SonicWall install-base or market-share figures.
- CFS category count (commonly cited as 60+ ) — not verified from a fetched SonicWall
  document this pass; avoid a specific number on pages.
