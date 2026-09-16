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
      'The KB calls the 180 GB-per-month conversion \u201ca very rough estimate\u201d \u2014 volume is not how units are bought, and the CMA does not report it.',
      'Units are sized to the PEAK hour \u2014 spiky estates store far less than the peak-rate figures shown here.',
      '\u2248100 bytes per event is DERIVED from the KB\u2019s own figures; no per-event-type sizes are published.',
      'XDR stories generate no events by default \u2014 a Response Policy rule is required first.',
      'The band tables assume ALL events are logged \u2014 Allow-with-no-Event tuning on low-value traffic (DNS, ICMP/SNMP, Windows Update, Teams, Zoom) lowers the real peak below its band.'
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

  function sizeAt(peak, i) {
    var totalUnits = Math.max(1, Math.ceil(peak / UNIT_EVENTS));
    var covered = totalUnits === 1 && i.retention === '3' && !i.highEventServices;
    var unitsToLicense = covered ? 0 : totalUnits + (i.highEventServices ? 1 : 0);
    var months = MONTHS[i.retention];
    var gbPerMonth = Math.round((peak / UNIT_EVENTS) * GB_PER_UNIT_MONTH);
    var storageTotalGb = gbPerMonth * months;
    return {
      peakEventsPerHour: peak, totalUnits: totalUnits, covered: covered,
      unitsToLicense: unitsToLicense, gbPerMonth: gbPerMonth,
      storageTotalGb: storageTotalGb, storageCompressedGb: Math.round(storageTotalGb * 0.05)
    };
  }

  function estimate(inputs) {
    var i = normalise(inputs);

    if (i.bw === 'over' || i.sdp === 'over') {
      return {
        inputs: i,
        beyondTables: true,
        message: 'Beyond the published tables — the KB stops at 33 Gbps and 43K SDP Clients. Size from the account\u2019s own event history with Cato rather than extrapolating.',
        floor: null, ceiling: null, additionalUnitsKb: null, unitVariant: null,
        notes: baseNotes()
      };
    }

    var bwE = BW[i.bw].events, sdpE = SDP[i.sdp].events;
    var floor = sizeAt(Math.max(bwE, sdpE) + i.extraEventsPerHour, i);
    var ceiling = sizeAt(bwE + sdpE + i.extraEventsPerHour, i);
    var additionalUnitsKb = (ceiling.totalUnits - 1) + (i.highEventServices ? 1 : 0);

    return {
      inputs: i,
      beyondTables: false,
      floor: floor,
      ceiling: ceiling,
      additionalUnitsKb: additionalUnitsKb,
      unitVariant: i.retention + '-month',
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
    var f = res.floor, c = res.ceiling;
    var extraNote = (i.extraEventsPerHour > 0 ? ' (both ends include your ' + fmt(i.extraEventsPerHour) + ' measured/assumed extra)' : '');
    var unitsCard = '<div class="card verdict-card">'
      + '<h3 style="margin:0;font-size:1.02rem">Units \u2014 floor to ceiling</h3><ul>'
      + '<li><strong>Estimated peak:</strong> ' + fmt(f.peakEventsPerHour) + ' \u2013 ' + fmt(c.peakEventsPerHour) + ' events/hour' + extraNote + '</li>'
      + '<li>Floor = larger band (field-calibrated \u2014 see the calibration note above); ceiling = the KB\u2019s additive sum. Presales leans on the floor.</li>'
      + '<li><strong>Units to license:</strong> ' + (c.unitsToLicense === 0 ? 'none \u2014 covered by the included unit' : f.unitsToLicense + ' \u2013 ' + c.unitsToLicense + ' \u2014 all units are chargeable once you license (the included unit only stands alone)') + '</li>'
      + '<li><strong>The KB\u2019s additive procedure alone reads:</strong> ' + res.additionalUnitsKb + ' additional unit' + (res.additionalUnitsKb === 1 ? '' : 's') + ' on top of the included one' + (i.highEventServices ? ' (includes the single +1 for high-event services such as CASB, RBI or LAN Firewall \u2014 no per-service figures are published)' : '') + '</li>'
      + '<li><strong>Unit variant:</strong> ' + res.unitVariant + ' \u2014 the variant applies to all units; mixing retention periods is not possible.</li>'
      + '</ul></div>';

    var storageCard = '<div class="card verdict-card">'
      + '<h3 style="margin:0;font-size:1.02rem">Export volume (rough)</h3><ul>'
      + '<li><strong>\u2248 ' + fmt(f.gbPerMonth) + ' \u2013 ' + fmt(c.gbPerMonth) + ' GB/month</strong> at the peak rate, on the KB\u2019s 180 GB-per-unit-month conversion.</li>'
      + '<li><strong>\u2248 ' + fmt(f.storageTotalGb) + ' \u2013 ' + fmt(c.storageTotalGb) + ' GB</strong> held over the ' + res.unitVariant + ' retention window \u2014 the same ballpark applies to external storage if everything is exported.</li>'
      + '<li>On API export, gzip compression reduces required storage by up to 95% \u2014 as little as ~' + fmt(f.storageCompressedGb) + ' \u2013 ' + fmt(c.storageCompressedGb) + ' GB for the same window.</li>'
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
