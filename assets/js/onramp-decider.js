/* On-ramp decider — vSocket vs IPsec site vs Cloud Interconnect.
   Every reason string traces to _extract/research-briefs/cloud-connectivity.md;
   figures as of Sep 2026. Scores are additive from 0; a "gate" rules the option
   out with its reason. Exposes UC_DECIDER.score(inputs) for unit testing; all
   DOM wiring is guarded so evaluating this file in node does not throw. */
(function () {
  'use strict';

  var GT10_REASON = 'No single Cato on-ramp exceeds 10 Gbps — Cloud Interconnect is the ceiling';

  /* Rules as data: { when(inputs) } plus either { gate: true } or { score: n },
     and a reason string. { flag: true } renders the reason prominently. */
  var OPTIONS = [
    {
      key: 'vsocket',
      label: 'vSocket',
      rules: [
        { gate: true, reason: 'No OCI vSocket — the KB lists vSocket platforms as AWS, Azure, GCP and VMware only; Cato’s documented OCI paths are IPsec and FastConnect',
          when: function (i) { return i.cloud === 'oci'; } },
        { gate: true, reason: GT10_REASON,
          when: function (i) { return i.throughput === 'gt10'; } },
        { gate: true, reason: 'Above the published vSocket ceiling — Azure tops out at 1 Gbps (2 NIC) / 2 Gbps (3 NIC, accelerated networking), GCP at 2 Gbps',
          when: function (i) { return (i.throughput === 'g2_3' || i.throughput === 'g3_10') && (i.cloud === 'azure' || i.cloud === 'gcp'); } },
        { score: -1, reason: 'No published AWS vSocket ceiling — throughput is deployment-dependent, so size and test; c5n.xlarge is the KB suggestion above 2 Gbps',
          when: function (i) { return i.cloud === 'aws' && (i.throughput === 'g2_3' || i.throughput === 'g3_10'); } },
        { score: 3, reason: 'vSocket is the only on-ramp with SD-WAN features, full QoS, last-mile monitoring and DEM probes — the others get downstream QoS only',
          when: function (i) { return i.features.sdwan; } },
        { score: 1, reason: 'Encrypted in transit — DTLS tunnels to the PoP',
          when: function (i) { return i.encryption === 'yes'; } },
        { score: 2, reason: 'GCP vSocket HA fails over behind an internal load balancer, typically 3–5 s',
          when: function (i) { return i.ha === 'fast' && i.cloud === 'gcp'; } },
        { score: -1, reason: 'Azure vSocket failover moves a floating IP — the NIC update can take up to 120 s',
          when: function (i) { return i.ha === 'fast' && i.cloud === 'azure'; } },
        { score: -1, reason: 'AWS vSocket failover is a route-table rewrite with no published failover time, and BGP is unsupported in AWS vSocket HA',
          when: function (i) { return i.ha === 'fast' && i.cloud === 'aws'; } },
        { score: 2, reason: 'Marketplace-wizard deployment with zero-touch provisioning (Terraform on GCP) — nothing to order',
          when: function (i) { return i.timeline === 'days'; } },
        { score: -2, reason: 'vSocket sites need a SASE licence — an SSE-only estate cannot take one as licensed',
          when: function (i) { return i.features.sse; } }
      ]
    },
    {
      key: 'ipsec',
      label: 'IPsec site',
      rules: [
        { gate: true, reason: 'Above the 3 Gbps per-site IPsec ceiling (IKEv1 and IKEv2)',
          when: function (i) { return i.throughput === 'g3_10'; } },
        { gate: true, reason: GT10_REASON,
          when: function (i) { return i.throughput === 'gt10'; } },
        { score: -1, reason: 'Cloud-gateway per-tunnel ceilings usually bite before Cato’s 3 Gbps per site — check the gateway SKU and ECMP options (AWS standard tunnel 1.25 Gbps, large-bandwidth option 5 Gbps, ECMP aggregation on a Transit Gateway only; GCP 1–3 Gbps per tunnel)',
          when: function (i) { return i.throughput === 'g2_3'; } },
        { score: 2, reason: 'IPsec sites run on a SASE or SSE licence; vSocket needs SASE',
          when: function (i) { return i.features.sse; } },
        { score: 2, reason: 'Nothing to deploy on the Cato side — configure the cloud gateway and tunnels',
          when: function (i) { return i.timeline === 'days'; } },
        { score: 1, reason: 'Encrypted in transit — IPsec with AES-GCM required at 100 Mbps and above',
          when: function (i) { return i.encryption === 'yes'; } },
        { score: -2, reason: 'No SD-WAN feature set on IPsec sites; QoS is downstream-only',
          when: function (i) { return i.features.sdwan; } },
        { score: -1, reason: 'Dual tunnels to two PoPs, but no automatic PoP re-homing for static-IP destinations',
          when: function (i) { return i.ha === 'fast'; } }
      ]
    },
    {
      key: 'interconnect',
      label: 'Cloud Interconnect',
      rules: [
        { gate: true, reason: GT10_REASON,
          when: function (i) { return i.throughput === 'gt10'; } },
        { score: 3, reason: 'The only on-ramp rated to 10 Gbps',
          when: function (i) { return i.throughput === 'g3_10'; } },
        { score: 1, reason: 'Comfortable headroom — rated to 10 Gbps where the other two run near their ceilings',
          when: function (i) { return i.throughput === 'g2_3'; } },
        { score: -1, reason: 'Likely oversized — minimum 500 Mbps on an Enforcement Model licence (no minimum on Bursting)',
          when: function (i) { return i.throughput === 'lt1'; } },
        { score: 2, reason: 'Cato positions Cloud Interconnect for data centres with a high volume of traffic — then compare internet-egress vs interconnect-egress rates with your provider before committing',
          when: function (i) { return i.egress === 'heavy'; } },
        { score: -3, flag: true, reason: 'Private L2 but unencrypted — the mandatory MD5 is BGP session authentication, not traffic encryption; if in-transit encryption is mandated, this needs an overlay Cato does not document',
          when: function (i) { return i.encryption === 'yes'; } },
        { score: -3, reason: 'Fabric lead times run up to 3 months by PoP; only some PoPs are CMA on-demand (as of Sep 2026)',
          when: function (i) { return i.timeline === 'days'; } },
        { score: -1, reason: 'Lead times range from immediate (CMA on-demand) to 3 months by PoP — a weeks timeline needs the availability list checked first (as of Sep 2026)',
          when: function (i) { return i.timeline === 'weeks'; } },
        { score: -2, reason: 'BGP only, and QoS is downstream-only — no SD-WAN feature set',
          when: function (i) { return i.features.sdwan; } },
        { score: 0, reason: 'FastConnect: the Cato PoP must be in the same Oracle Cloud region as the tenant',
          when: function (i) { return i.cloud === 'oci'; } }
      ]
    }
  ];

  function normalise(inputs) {
    inputs = inputs || {};
    var f = inputs.features || {};
    return {
      cloud: inputs.cloud || 'azure',
      throughput: inputs.throughput || 'g1_2',
      egress: inputs.egress || 'steady',
      encryption: inputs.encryption || 'no',
      ha: inputs.ha || 'standard',
      timeline: inputs.timeline || 'weeks',
      features: { sdwan: !!f.sdwan, sse: !!f.sse }
    };
  }

  function score(inputs) {
    var i = normalise(inputs);
    var results = OPTIONS.map(function (opt) {
      var r = { key: opt.key, label: opt.label, score: 0, gated: false, reasons: [] };
      opt.rules.forEach(function (rule) {
        if (!rule.when(i)) return;
        if (rule.gate) {
          r.gated = true;
          r.reasons.push({ kind: 'gate', delta: 0, text: rule.reason, flag: false });
        } else {
          r.score += rule.score;
          r.reasons.push({
            kind: rule.score > 0 ? 'plus' : (rule.score < 0 ? 'minus' : 'note'),
            delta: rule.score, text: rule.reason, flag: !!rule.flag
          });
        }
      });
      return r;
    });

    var live = results.filter(function (r) { return !r.gated; });
    var top = live.length ? Math.max.apply(null, live.map(function (r) { return r.score; })) : null;
    var topCount = live.filter(function (r) { return r.score === top; }).length;
    results.forEach(function (r) {
      if (r.gated) { r.verdict = 'Ruled out'; }
      else if (r.score === top) { r.verdict = topCount > 1 ? 'Recommended — tie' : 'Recommended'; }
      else if (top - r.score <= 2) { r.verdict = 'Worth considering'; }
      else { r.verdict = 'Workable'; }
    });

    var order = results.slice().sort(function (a, b) {
      if (a.gated !== b.gated) { return a.gated ? 1 : -1; }
      return b.score - a.score;
    });

    return { inputs: i, allGated: live.length === 0, results: order };
  }

  /* Expose for unit tests (node-safe). */
  var root = (typeof window !== 'undefined') ? window
    : (typeof globalThis !== 'undefined') ? globalThis : {};
  root.UC_DECIDER = { score: score };

  /* ---------- DOM wiring (browser only) ---------- */
  if (typeof document === 'undefined') { return; }

  var VERDICT_STYLE = {
    'Recommended': 'background:var(--green-050);border-color:var(--green-600);color:var(--green-700);font-weight:700',
    'Recommended — tie': 'background:var(--green-050);border-color:var(--green-600);color:var(--green-700);font-weight:700',
    'Worth considering': 'font-weight:600',
    'Workable': 'color:var(--ink-3)',
    'Ruled out': 'color:var(--ink-3);border-style:dashed'
  };

  function reasonHTML(re) {
    var prefix = re.kind === 'gate' ? 'Ruled out'
      : re.kind === 'note' ? 'Note'
      : (re.delta > 0 ? '+' + re.delta : String(re.delta));
    var text = re.flag
      ? '<strong style="color:var(--status-critical)">' + re.text + '</strong>'
      : re.text;
    return '<li><strong>' + prefix + '</strong> — ' + text + '</li>';
  }

  function cardHTML(r) {
    var head = '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">'
      + '<h3 style="margin:0;font-size:1.02rem">' + r.label + '</h3>'
      + '<span class="tag" style="' + (VERDICT_STYLE[r.verdict] || '') + '">' + r.verdict + '</span>'
      + (r.gated ? '' : '<span class="tag">score ' + (r.score > 0 ? '+' + r.score : r.score) + '</span>')
      + '</div>';
    var bullets = r.reasons.length
      ? r.reasons.map(reasonHTML).join('')
      : '<li>No rule fired either way on these answers — a neutral fit.</li>';
    return '<div class="card verdict-card' + (r.gated ? ' gated' : '') + '">'
      + head + '<ul>' + bullets + '</ul></div>';
  }

  function renderHTML(res) {
    var html = '';
    if (res.allGated) {
      html += '<div class="callout warn" style="margin-top:16px">'
        + '<div class="co-title">Above 10 Gbps, no single on-ramp fits</div>'
        + '<p>No single Cato on-ramp exceeds 10 Gbps — Cloud Interconnect is the ceiling. '
        + 'Split the workload across multiple on-ramps or sites, and raise the requirement with Cato.</p></div>';
    }
    html += '<div class="verdict-grid">' + res.results.map(cardHTML).join('') + '</div>';
    html += '<div class="callout" style="margin-top:16px">'
      + '<div class="co-title">Two checks this helper cannot do for you</div>'
      + '<ul style="margin:6px 0 0;padding-left:20px">'
      + '<li><strong>Egress rates:</strong> ask your cloud provider for its internet-egress vs interconnect-egress rates at your expected volume — the bill is usually decided there, and this library quotes no prices.</li>'
      + '<li><strong>Interconnect availability:</strong> check Cloud Interconnect PoP availability and lead time with Cato per location — from immediate (CMA on-demand) to 3 months, as of Sep 2026.</li>'
      + '</ul></div>';
    return html;
  }

  function init() {
    var section = document.getElementById('decider');
    if (!section) { return; }
    var result = document.getElementById('decider-result');
    if (!result) { return; }

    function val(name) {
      var el = section.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : '';
    }
    function read() {
      return {
        cloud: val('dc-cloud'),
        throughput: val('dc-throughput'),
        egress: val('dc-egress'),
        encryption: val('dc-encryption'),
        ha: val('dc-ha'),
        timeline: val('dc-timeline'),
        features: {
          sdwan: !!section.querySelector('input[name="dc-feat-sdwan"]:checked'),
          sse: !!section.querySelector('input[name="dc-feat-sse"]:checked')
        }
      };
    }
    function rerender() { result.innerHTML = renderHTML(score(read())); }

    section.addEventListener('change', rerender);
    rerender();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
