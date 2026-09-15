# Research brief: Event logs & the Cato Data Lake — generation, units, retention, export

Backs `usecases/management-data-lake.html` — **the page and its calculator may only claim what
this brief supports.** Sources fetched raw (curl, .md variants) 15 Sep 2026:

- A: Guide to Cato Data Lake — https://knowledge.catonetworks.com/docs/guide-to-cato-data-lake (updated 24 Aug 2026)
- B: Best Practices for Cato Event Logs and Ingestion — https://knowledge.catonetworks.com/docs/best-practices-for-cato-event-logs-and-ingestion (updated 22 Jun 2026)
- C: Integrating Cato Events with AWS S3 — https://knowledge.catonetworks.com/docs/integrating-cato-events-with-aws-s3 (updated 15 Sep 2026)

Raw copies in session scratchpad (datalake.md / bestpractices.md / s3feed.md).

## 1. The unit model (A)

- Data Lake units define retention by TWO dimensions: hourly event rate ("currently in units of
  2.5 million events per hour") and retention time (3 / 6 / 12-month unit variants).
- **Every account gets one unit free**: "accounts receive a single Data Lake unit that includes an
  event rate limit of 2.5 million events per hour and a 3-month retention period."
- Rate limiting: events beyond the licensed hourly rate "may be discarded for the remainder of the
  hour". Units define the **peak** rate; quiet hours don't bank capacity.
- Each additional unit adds 2.5M events/hour (2 units → 5M total; 3 → 7.5M).
- Retention: default 3 months (contracts/renewals from 1 Jan 2024); after retention, data is
  deleted and unrecoverable. "If a customer chooses to pay for additional data retention, no
  allowance is made for the free retention... all event retention is chargeable."
- The retention variant "applies to all data units, it is not possible to mix units."
- Examples table (A, verbatim): 2.5M/3mo → 0 additional; 2.5M/6mo → 1 (6-month unit);
  5M/3mo → 1 (3-month); 7.5M/12mo → 2 (12-month).
- Applies to accounts starting 1 Jan 2024; "(*) Some contracts... may include terms that differ."

### Additions from verify pass (all verbatim-checked against raw sources, 16 Sep)
- A: "Cato retains a core set of key security and connectivity events for each customer" and
  "Customers can select, within policies, additional events to be generated and retained."
- A's storage table DOES carry an "Additional Data Lake units" column (0/1/2) — reproduce it.
- B: "In most cases, the vast majority of generated events are Security events" and "Eliminating
  other Event Types is not likely to have a significant impact on the total number."
- C: browsers may auto-decompress .GZ files without renaming; "changing the file extension to LOG
  or TXT will correctly align the file's format with its extension."
- CMA nav (tenant-verified 14 Sep): Events = Home → Events; integrations = Resources →
  Event Integrations; API keys = Resources → Service API Keys / Admin API Keys.

## 2. Estimation procedure (A — normative, "without an event history")

Steps verbatim-in-substance: (1) read peak events/hour off the Total Bandwidth table; (2) read
off the SDP Clients table; (3) add them; (4) divide by 2.5M and round up = units for BW+SDP;
(5) "If you are using multiple Cato services that generate a large number of events, such as
CASB or LAN Firewall, add 1 Data Lake unit. (1 unit for bandwidth, 1 unit for SDP users, and
1 unit for CASB and RBI)".

Band tables (A, complete, "assume the customer is logging all events"; both are PEAK estimates):

| Total BW | events/h | | SDP clients | events/h |
|---|---|---|---|---|
| ≤2.5 Gbps | 1,000,000 | | ≤3K | 1,000,000 |
| 2.5–6 | 5,000,000 | | 3K–7K | 5,000,000 |
| 6–9 | 7,500,000 | | 7K–11K | 7,500,000 |
| 9–12 | 10,000,000 | | 11K–15K | 10,000,000 |
| 12–15 | 12,500,000 | | 15K–19K | 12,500,000 |
| 15–18 | 15,000,000 | | 19K–23K | 15,000,000 |
| 18–21 | 17,500,000 | | 23K–27K | 17,500,000 |
| 21–24 | 20,000,000 | | 27K–31K | 20,000,000 |
| 24–27 | 22,500,000 | | 31K–35K | 22,500,000 |
| 27–30 | 25,000,000 | | 35K–39K | 25,000,000 |
| 30–33 | 27,500,000 | | 39K–43K | 27,500,000 |

Nothing is published beyond 33 Gbps / 43K clients — the page must say "beyond the published
tables — size with Cato" rather than extrapolate.

**KB-internal discrepancy (flag honestly, do not hide):** A's worked example reads "a total of
5,000 SDP clients would generate an additional estimated peak of two and a half million events
per hour", but A's own SDP table puts 5,000 clients in the 3K–7K band = 5M. The tables are the
normative instrument ("Follow this procedure to calculate requirements from the tables");
the calculator follows the tables (conservative) and the page notes the example reads lower.
Example otherwise: 3 Gbps → 5M; total 7.5M "(2 units)" [= additional, base unit free];
CASB+RBI → 1 more; "buying three more Data Lake Storage units of the appropriate duration."

- Qualitative service impact (A): "if the LAN Firewall is enabled, this will increase the event
  requirements proportionate to the amount of LAN traffic and which traffic generates events."
- With an event history (A): read the Events chart peaks in CMA (Home → Events), hover bars for
  exact heights, mind Time Series Granularity, prefer a long analysis window.

## 3. Storage / event-size estimates (A)

- "One Data Lake unit (2.5 million events per hour) is very roughly equivalent to 180 GB per
  month of data storage." Explicit caveat: "this is a very rough estimate" — peak-sized units vs
  consistently-high generation give very different real volumes. Data volume "is **not** used in
  the calculation or purchase of additional units and it is not reported by the CMA."
- Storage table (A): 2.5M/h → 180 GB/mo → 540/1,080/2,160 GB at 3/6/12 months;
  5M → 360 → 1,080/2,160/4,320; 7.5M → 540 → 2,160/4,320/8,640.
- **Second KB-internal discrepancy (storage table, flag honestly):** rows 1–2 multiply cleanly
  (180 GB/mo → 540/1,080/2,160 at 3/6/12 months; 360 → 1,080/2,160/4,320) but row 3 does not:
  stated 540 GB/mo yet totals 2,160/4,320/8,640 imply 720 GB/mo. The calculator computes
  linearly (peak/2.5M × 180 GB/mo × months); the page reproduces the KB table verbatim with a
  footnote naming the row-3 arithmetic gap.
- DERIVED (arithmetic on A's own figures, label as derived, not a KB figure): 2.5M events/h
  ≈ 1.825B events/month ≈ 180 GB → **≈ 100 bytes per event average**. The KB publishes NO
  per-event-type sizes.
- Compression (B): "reduce the required storage up to 95% by enabling gzip compression when
  making API requests."

## 4. Export & ingestion (A, B, C)

- Export is free (A): "Customers may also use different integrations to forward their data to
  external cloud storage and SIEMs at no additional cost."
- Storage options (A): the CMA Events page; "a high-scale feed to Cloud Storage, such as AWS S3
  and Azure Blob Storage"; the Cato API (eventsFeed).
- S3 push feed (C): continuous push "unlike the eventsFeed API, which requires pulling data from
  Cato and can be affected by rate limiting"; uploads every 60 seconds or when >9.5 MB
  uncompressed accumulates; .GZ compressed over HTTPS; per-integration filters by event
  type/sub-type (AND across filters; default = everything); **up to three Event Integrations per
  account**; STS-active S3 regions only, China region unsupported; IAM role trusts Cato's
  documented integration ARN with the CMA account ID as ExternalId.
- Ingestion trimming workflow (B): (1) by Event Type — "the vast majority of generated events are
  Security events"; (2) by Sub-Type — "Internet and WAN Firewall events represent the vast
  majority of Security events" for many accounts; (3) by Application — DNS often a large share;
  create Allow + no-Event firewall rules (custom app for DNS server IPs); other safe-to-untrack
  examples: ICMP, SNMP, Windows Update, Microsoft Teams, Zoom.
- General practices (B): enable integration on Resources → Event Integrations even without an
  external target (lets Cato analyse the feed for support); **XDR stories generate NO events by
  default** — a Response Policy rule is required; Events-page totals can differ slightly from
  exported counts (rounding; same-minute events combined into one exported log).

## 4b. Field calibration (library maintainer, Sep 2026 — anonymised, not a KB figure)

- A real estate at ~42 Gbps total bandwidth with ~43K SDP users, running WAN Firewall, SWG, ATP
  and CASB, peaks at roughly **31M events/hour** — where the KB's ADDITIVE procedure (were its
  tables extrapolated) would suggest well over 55M. Interpretation: total bandwidth and SDP-user
  activity are substantially the SAME traffic, so summing the two tables double-counts.
- Presales guidance derived from this: present a RANGE — floor = max(BW band, SDP band)
  (field-calibrated; the real account sits just above its 27.5M SDP band) and ceiling = the KB's
  additive sum. Size the commercial conversation from the floor, verify with the Events chart.
- First-unit commercial treatment (maintainer field ruling, consistent with A's "no allowance is
  made for the free retention... all event retention is chargeable"): the included unit only
  stands alone. Once an account licenses units — more rate, longer retention, or the service
  unit — ALL units are chargeable, including the first. The calculator's "units to license"
  reflects this; the KB Examples table's "additional units" column is the capacity delta, not
  the invoice count. Confirm commercial treatment with Cato (standing action note).

## 5. UNVERIFIED — quarantined; must NOT appear as fact

1. Per-licence event contributions for XOps/DLP/DEM/IoT-OT/EPP etc. — the KB quantifies ONLY the
   "+1 unit for CASB and RBI (or LAN Firewall)" rule; everything else is qualitative. The
   calculator may not assign numbers to other licences; it exposes a user-supplied
   measured/assumed events-per-hour input instead, and points at the event-history method.
2. Event volumes generated by XOps/device-management integrations (Defender, CrowdStrike, Entra
   ID, Intune, Meraki-class device sources, Teams/M365 app activities) — nothing published.
   Same treatment as (1): measure via Home → Events filtered to the integration's event types.
3. Per-event byte sizes by event type — not published; only the ≈100 B/event average DERIVED
   from A's own rough conversion.
4. eventsFeed API rate-limit figures — the API doc was not fetched; C says only that the pull
   API "can be affected by rate limiting".
5. Azure Blob feed mechanics (cadence, size trigger) — article not fetched; A confirms Azure
   Blob as a feed target, nothing more.
6. Data Lake unit pricing — never published; do not imply.
7. Whether the +1 service unit stacks per service (CASB AND LAN FW AND RBI ⇒ +3?) — the KB's
   procedure adds a single unit for "multiple Cato services that generate a large number of
   events"; implement as one +1, not per-service stacking.
