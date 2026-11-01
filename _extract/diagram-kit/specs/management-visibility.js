/* specs/management-visibility.js — Operational & Executive Visibility */
DG.page('management-visibility', {
  spotlight: {
    hl: ['branch', 'users', 'cloud', 'pop', 'xops', 'mgmt'],
    mods: [],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'cl-aws'}, {p: 'spine'}],
    anchors: {mgmt: [782, 132], cloud: [1450, 326]},   // step-3 marker on the CMA box's top edge, clear of its subtitle; cloud marker beside AWS, off the '4' badge
    steps: [
      {t: 'Sites, remote users and cloud datacentres all connect through the nearest Cato PoP.', marks: ['branch', 'users', 'cloud']},
      {t: 'SPACE processes every flow once, with identity, device, application and risk context attached.', marks: ['pop']},
      {t: 'That one data set lands in the Cato Management Application: topology, analytics, events and stories.', marks: ['mgmt']},
      {t: 'XOps turns millions of raw events into correlated, MITRE-mapped incident stories.', marks: ['xops']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, tier, ring, fpin, tile, R, pill} = K;
      let s = '';
      /* section labels */
      s += tier(10, 28, 'EVERY EDGE') + tier(236, 28, 'CATO SASE CLOUD') + tier(486, 28, 'ONE MANAGEMENT PLANE');

      /* ---- centre: the global private backbone with a PoP on it ---- */
      const RG = {cx: 320, cy: 300, rx: 90, ry: 48};
      s += ring(RG);

      /* ---- left: the three kinds of edge ---- */
      s += nd(10, 114, 190, 52, {t: 'Sites — Socket SD-WAN', s: ['London DC · Manchester DC'], ic: 'building', is: 20, icls: 'g'});
      s += nd(10, 274, 190, 52, {t: 'Remote users', s: ['Cato Client · Priya, Marcus'], ic: 'users', is: 20, icls: 'g'});
      s += nd(10, 434, 190, 52, {t: 'Cloud datacentres', s: ['AWS · Azure vSockets'], ic: 'cpu', is: 20, icls: 'g'});

      /* every edge sends all its traffic into the PoP (encrypted tunnels) */
      s += fl('M200 140C206 200 206 272 296 291', 'fl-tun', {dur: 1.4});
      s += fl('M200 300L292 300', 'fl-tun', {dur: 1});
      s += fl('M200 460C206 400 206 328 296 309', 'fl-tun', {dur: 1.4});

      /* the PoP pin, centred on the ring */
      s += fpin(320, 344, 26, 'PoP', {halo: true});
      s += T(320, 376, 'Cato PoP', 'nd-t g', 'middle');
      s += T(320, 391, 'SPACE — every flow inspected once', 'f-s', 'middle');
      s += T(320, 408, 'Global Private Backbone', 'f-m', 'middle');
      s += T(320, 422, '100+ PoP locations', 'f-m', 'middle');

      /* ONE context feed from the PoP to the console: the same single-pass data, not a collector */
      s += fl('M320 270C320 196 396 170 486 170', 'fl-flow', {arrow: 'arr-m', dur: 1.6, label: 'single-pass context feed', lx: 372, ly: 190, lcls: 'm'});
      s += T(478, 156, 'identity · device · app · risk', 'f-m', 'end');   // above the curve, clear of its rise from the PoP

      /* ---- right: the Cato Management Application ---- */
      s += R(486, 44, 260, 460, 'nd pop', 16);
      s += T(616, 70, 'Cato Management Application', 'f-h', 'middle');
      s += T(616, 86, 'One management & analytics plane', 'f-s', 'middle');
      s += tile(502, 100, 228, 88, 'chart', 'Dashboards & topology', ['Sites · users · tunnels · link health']);
      s += tile(502, 200, 228, 88, 'eye', 'App & user analytics', ['Usage · risk · shadow IT · DEM']);
      s += tile(502, 300, 228, 88, 'console', 'Unified event stream', ['Network + security + access']);
      s += tile(502, 400, 228, 88, 'shield', 'XDR incident stories', ['Correlated · MITRE-mapped · Gen-AI']);
      return s;
    },
    title: 'All edges feed one management and analytics plane',
    desc: 'Sites, remote users and cloud datacentres connect through Cato PoPs on the global private backbone; the Single Pass Cloud Engine inspects every flow once, and that single context feeds one Cato Management Application plane of dashboards, analytics, events and XDR stories.',
    caption: 'Because all edges send all traffic through the PoPs, the telemetry was never split across boxes — the context feed into the console is the same single-pass data, not a collector you deploy.',
    legend: [['tun', 'Traffic — all edges, all ports & protocols'], ['flow', 'Single-pass context feed — identity · device · app · risk'], 'live'],
  }],
});
