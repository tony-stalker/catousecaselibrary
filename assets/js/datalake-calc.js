/* Data Lake unit estimator — events per hour → units, variant and export volume.
   Every figure traces to _extract/research-briefs/data-lake.md (KB articles
   "Guide to Cato Data Lake", "Best Practices for Cato Event Logs and Ingestion",
   "Integrating Cato Events with AWS S3", fetched Sep 2026). The band tables are
   the KB's normative instrument; nothing here extrapolates beyond them.
   Exposes UC_DATALAKE.estimate(inputs) for unit testing; all DOM wiring is
   guarded so evaluating this file in node does not throw. */
(function () {
  'use strict';

  var UNIT_EVENTS = 2500000;      /* one Data Lake unit, events per hour */
  var GB_PER_UNIT_MONTH = 180;    /* KB: "very roughly equivalent to 180 GB per month" */

  /* KB band tables — peak events per hour, assuming all events are logged. */
  var BW = {
    b0:  { label: 'Up to 2.5 Gbps', events: 1000000 },
    b1:  { label: '2.5–6 Gbps', events: 5000000 },
    b2:  { label: '6–9 Gbps', events: 7500000 },
    b3:  { label: '9–12 Gbps', events: 10000000 },
    b4:  { label: '12–15 Gbps', events: 12500000 },
    b5:  { label: '15–18 Gbps', events: 15000000 },
    b6:  { label: '18–21 Gbps', events: 17500000 },
    b7:  { label: '21–24 Gbps', events: 20000000 },
    b8:  { label: '24–27 Gbps', events: 22500000 },
    b9:  { label: '27–30 Gbps', events: 25000000 },
    b10: { label: '30–33 Gbps', events: 27500000 },
    over: { label: '> 33 Gbps', events: null }
  };
  var SDP = {
    s0:  { label: 'Up to 3K', events: 1000000 },
    s1:  { label: '3K–7K', events: 5000000 },
    s2:  { label: '7K–11K', events: 7500000 },
    s3:  { label: '11K–15K', events: 10000000 },
    s4:  { label: '15K–19K', events: 12500000 },
    s5:  { label: '19K–23K', events: 15000000 },
    s6:  { label: '23K–27K', events: 17500000 },
    s7:  { label: '27K–31K', events: 20000000 },
    s8:  { label: '31K–35K', events: 22500000 },
    s9:  { label: '35K–39K', events: 25000000 },
    s10: { label: '39K–43K', events: 27500000 },
    over: { label: '> 43K', events: null }
  };
  var MONTHS = { '3': 3, '6': 6, '12': 12 };

  function baseNotes() {
    return [
      'The KB calls the 180 GB-per-month conversion "a very rough estimate" — data volume is not used in the calculation or purchase of units, and it is not reported by the CMA.',
      'Units are sized to the PEAK hour. The storage figures here assume that peak rate all month — an estate sized for occasional spikes will store far less than one generating events at a consistently high rate.',
      'The ≈100 bytes-per-event average is DERIVED from the KB’s own figures (2.5M events/hour ≈ 180 GB/month); Cato publishes no per-event-type sizes.',
      'XDR stories generate no events by default — an XDR Response Policy rule is required before story events appear in any feed.',
      'The first Data Lake unit (2.5M events/hour, 3-month retention) is included free with every account.'
    ];
  }

  function normalise(inputs) {
    inputs = inputs || {};
    var extra = Number(inputs.extraEventsPerHour);
    if (!isFinite(extra) || extra < 0) { extra = 0; }
    return {
      bw: Object.prototype.hasOwnProperty.call(BW, inputs.bw) ? inputs.bw : 'b0',
      sdp: Object.prototype.hasOwnProperty.call(SDP, inputs.sdp) ? inputs.sdp : 's0',
      highEventServices: !!inputs.highEventServices,
      extraEventsPerHour: extra,
      retention: Object.prototype.hasOwnProperty.call(MONTHS, String(inputs.retention)) ? String(inputs.retention) : '3'
    };
  }

  function estimate(inputs) {
    var i = normalise(inputs);

    if (i.bw === 'over' || i.sdp === 'over') {
      return {
        inputs: i,
        beyondTables: true,
        message: 'Beyond the published tables — the KB stops at 33 Gbps and 43K SDP Clients. Size from the account’s own event history with Cato rather than extrapolating.',
        peakEventsPerHour: null,
        totalUnits: null,
        additionalUnits: null,
        unitVariant: null,
        gbPerMonth: null,
        storageTotalGb: null,
        storageCompressedGb: null,
        notes: baseNotes()
      };
    }

    var peak = BW[i.bw].events + SDP[i.sdp].events + i.extraEventsPerHour;
    var totalUnits = Math.max(1, Math.ceil(peak / UNIT_EVENTS));
    var additionalUnits = (totalUnits - 1) + (i.highEventServices ? 1 : 0);
    var months = MONTHS[i.retention];
    var gbPerMonth = Math.round((peak / UNIT_EVENTS) * GB_PER_UNIT_MONTH);
    var storageTotalGb = gbPerMonth * months;

    return {
      inputs: i,
      beyondTables: false,
      peakEventsPerHour: peak,
      totalUnits: totalUnits,
      additionalUnits: additionalUnits,
      unitVariant: i.retention + '-month',
      gbPerMonth: gbPerMonth,
      storageTotalGb: storageTotalGb,
      storageCompressedGb: Math.round(storageTotalGb * 0.05),
      notes: baseNotes()
    };
  }

  /* Expose for unit tests (node-safe). */
  var root = (typeof window !== 'undefined') ? window
    : (typeof globalThis !== 'undefined') ? globalThis : {};
  root.UC_DATALAKE = { estimate: estimate, bands: { bw: BW, sdp: SDP } };

  /* ---------- DOM wiring (browser only) ---------- */
  if (typeof document === 'undefined') { return; }

  function fmt(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function standingNotesHTML() {
    return '<div class="callout" style="margin-top:16px">'
      + '<div class="co-title">Two checks this estimator cannot do for you</div>'
      + '<ul style="margin:6px 0 0;padding-left:20px">'
      + '<li><strong>Verify against the account’s own Events chart</strong> (Home → Events) — reading real peaks from the event history is the KB’s preferred method; these tables are the fallback for accounts without one.</li>'
      + '<li><strong>Unit pricing and contract terms are commercial</strong> — confirm with Cato. The KB notes some contracts include terms that differ from the published model.</li>'
      + '</ul></div>';
  }

  function renderHTML(res) {
    if (res.beyondTables) {
      return '<div class="callout warn" style="margin-top:16px">'
        + '<div class="co-title">Beyond the published tables</div>'
        + '<p>' + res.message + '</p></div>'
        + standingNotesHTML();
    }

    var i = res.inputs;
    var unitsCard = '<div class="card verdict-card">'
      + '<h3 style="margin:0;font-size:1.02rem">Units</h3><ul>'
      + '<li><strong>Estimated peak:</strong> ' + fmt(res.peakEventsPerHour) + ' events/hour'
      + (i.extraEventsPerHour > 0 ? ' (includes your ' + fmt(i.extraEventsPerHour) + ' measured/assumed extra)' : '') + '</li>'
      + '<li><strong>Units for the estimated peak:</strong> ' + res.totalUnits + ' (peak ÷ 2.5M, rounded up)</li>'
      + (i.highEventServices ? '<li><strong>High-event services:</strong> +1 unit — the KB procedure adds one unit for multiple high-event services such as CASB, RBI or LAN Firewall; it publishes no per-service figures.</li>' : '')
      + '<li><strong>Additional units to license:</strong> ' + res.additionalUnits + ' — the first unit is included free.</li>'
      + '<li><strong>Unit variant:</strong> ' + res.unitVariant + ' — the variant applies to all units; mixing retention periods is not possible.</li>'
      + '</ul></div>';

    var storageCard = '<div class="card verdict-card">'
      + '<h3 style="margin:0;font-size:1.02rem">Export volume (rough)</h3><ul>'
      + '<li><strong>≈ ' + fmt(res.gbPerMonth) + ' GB/month</strong> at the peak rate, on the KB’s 180 GB-per-unit-month conversion.</li>'
      + '<li><strong>≈ ' + fmt(res.storageTotalGb) + ' GB</strong> held over the ' + res.unitVariant + ' retention window — the same ballpark applies to external storage if everything is exported.</li>'
      + '<li>On API export, gzip compression reduces required storage by up to 95% — as little as ~' + fmt(res.storageCompressedGb) + ' GB for the same window.</li>'
      + '</ul></div>';

    var notesCard = '<div class="card verdict-card">'
      + '<h3 style="margin:0;font-size:1.02rem">Read before quoting</h3><ul>'
      + res.notes.map(function (n) { return '<li>' + n + '</li>'; }).join('')
      + '</ul></div>';

    return '<div class="verdict-grid">' + unitsCard + storageCard + notesCard + '</div>'
      + standingNotesHTML();
  }

  function init() {
    var section = document.getElementById('calculator');
    if (!section) { return; }
    var result = document.getElementById('calc-result');
    if (!result) { return; }

    function val(name) {
      var el = section.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : '';
    }
    function read() {
      var extraEl = section.querySelector('input[name="dl-extra"]');
      return {
        bw: val('dl-bw'),
        sdp: val('dl-sdp'),
        highEventServices: !!section.querySelector('input[name="dl-services"]:checked'),
        extraEventsPerHour: extraEl ? Number(extraEl.value) : 0,
        retention: val('dl-retention')
      };
    }
    function rerender() { result.innerHTML = renderHTML(estimate(read())); }

    section.addEventListener('change', rerender);
    section.addEventListener('input', rerender);
    rerender();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
