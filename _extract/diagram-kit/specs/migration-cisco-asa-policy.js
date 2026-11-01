/* specs/migration-cisco-asa-policy.js — Cisco ASA (ASA-only estate) policy migration to Cato */
DG.page('migration-cisco-asa-policy', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'mgmt'],
    mods: ['sse'],
    anchors: {mgmt: [782, 132]},   // merged 1 · 2 marker on the CMA box's top edge, clear of its subtitle
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'eg-www'}, {p: 'eg-saas'}, {p: 'm1'}],
    steps: [
      {t: 'ACLs export with 30–90 days of hitcnt, NAT via show nat detail; DAP has no export and is restated from intent.', marks: ['mgmt']},
      {t: 'East-west ACEs land on the WAN Firewall allowlist; NAT dissolves; SWG, CASB and DLP start as Cato baselines.', marks: ['mgmt']},
      {t: 'The PoP applies the converted rules to every site and user, monitor-first: logged, not blocked.', marks: ['pop', 'branch', 'users']},
      {t: 'Events and hit counts prove each rule before it is promoted from monitor to block.', marks: ['pop']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, side, tier, mark, xmark} = K;
      let s = '';

      /* ---- top band: the ASA policy domains ---- */
      s += tier(14, 22, 'THE ASA-ONLY ESTATE · NO UMBRELLA, NO SD-WAN');
      const DOM = [
        [14, 'Interface ACLs', 'ACEs · object-groups'],
        [200, 'NAT table', 'twice · object · after-auto'],
        [386, 'AnyConnect · DAP', 'posture — no export path'],
      ];
      /* fan-in: the two exportable domains drop onto one bus into EXPORT */
      s += fl('M286 94V130Q286 140 276 140H110Q100 140 100 150', 'fl-flow', {np: 0});
      s += fl('M100 94V196', 'fl-flow', {arrow: 'arr-n', dur: 1.6});
      /* DAP / HostScan: no export path, restated from intent at REVIEW & MAP */
      s += fl('M420 94V160Q420 170 410 170H350Q340 170 340 180V196', 'fl-https', {arrow: 'arr-n', dur: 1.6});
      s += T(380, 158, 'restated from intent', 'f-s', 'middle');
      DOM.forEach(([x, t, sub]) => { s += nd(x, 34, 172, 60, {t, s: [sub]}); });

      /* greenfield: nothing to export, enters at DEPLOY as Cato baselines */
      s += fl('M640 94V150Q640 160 630 160H485Q475 160 475 170V196', 'fl-ha', {arrow: 'arr-y', dur: 1.8});
      s += nd(572, 34, 174, 60, {t: 'SWG · CASB · DLP · TLS', s: ['absent on ASA'], cls: 'dash'});
      s += pill(640, 124, 'greenfield — Cato baselines', 'm');

      /* ---- the pipeline: EXPORT → REVIEW & MAP → DEPLOY → OPTIMISE ---- */
      const X = [14, 204, 394, 584], Y = 200, W = 162, H = 70, MY = Y + H / 2;
      s += nd(X[0], Y, W, H, {t: 'EXPORT', s: ['show run · access-list', 'show nat detail']});
      s += nd(X[1], Y, W, H, {t: 'REVIEW & MAP', s: ['cull on hitcnt · flatten', 'WAN FW · Internet FW'], cls: 'hot'});
      s += nd(X[2], Y, W, H, {t: 'DEPLOY — monitor', s: ['allow-and-track', 'log only'], cls: 'dash'});
      s += nd(X[3], Y, W, H, {t: 'OPTIMISE — enforce', s: ['block on event evidence', 'promoted per rule'], cls: 'pop'});
      s += mark(X[3] + W - 4, Y + 4, 'ok');

      s += fl(`M${X[0] + W} ${MY}H${X[1] - 3}`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M${X[1] + W} ${MY}H${X[2] - 3}`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M${X[2] + W} ${MY}H${X[3] - 3}`, 'fl-ha', {arrow: 'arr-y', dur: 0.8});
      s += pill(578, 292, 'amber → green on evidence', 'y');

      /* ---- discard branch: nothing leaves it ---- */
      s += fl('M244 270C244 314 120 306 114 342', 'fl-down', {np: 0});
      s += xmark(184, 306);
      s += nd(14, 342, 200, 66, {t: 'Left at review', s: ['zero-hit ACEs · dead objects', 'NAT dissolved — PAT at PoP'], cls: 'dash'});

      /* ---- evidence loop: events from DEPLOY and OPTIMISE feed back to review ---- */
      s += fl('M475 270V340', 'fl-net', {arrow: 'arr-n', dur: 1.4});
      s += fl('M680 270V340', 'fl-net', {arrow: 'arr-n', dur: 1.4});
      s += side(440, 342, 306, 58, 'Events & hit counts', 'Monitor → Events · per rule', 'chart');
      s += fl('M440 371H330Q320 371 320 361V273', 'fl-net', {arrow: 'arr-n', dur: 1.8});
      s += pill(380, 371, 'OPTIMISE loop', 'm');

      /* ---- carry-over facts ---- */
      s += tier(14, 444, 'WHAT THE ASA EVIDENCE NEEDS');
      const notes = [
        [14, 470, 'warn', 'Counters reset on reload', 'diff hitcnt over a 30–90 day window'],
        [390, 470, 'warn', 'Zero-hit is not dead', 'DR · break-glass → parked, disabled group'],
        [14, 516, 'info', 'Golden flows', 'packet-tracer at EXPORT · events at DEPLOY'],
        [390, 516, 'ok', 'WebVPN portal retires', 'clientless access · CVE-2025-20362 surface'],
      ];
      notes.forEach(([x, y, m, t, sub]) => { s += mark(x + 8, y - 4, m) + T(x + 24, y, t, 'nd-t') + T(x + 24, y + 16, sub, 'f-s'); });
      return s;
    },
    title: 'Cisco ASA policy migration pipeline',
    desc: 'The ACLs and NAT table are exported and rationalised against the hit-count window before anything is mapped, DAP posture has no export path and is restated from intent at review, while SWG, CASB, DLP and TLS inspection enter at DEPLOY as Cato baselines in monitor mode; both streams are promoted to enforcement only on evidence.',
    legend: [['flow', 'Exported intent — reviewed and mapped'], ['https', 'Restated from intent — DAP posture, no export path'], ['ha', 'Monitor first — log, don\'t block'], ['down', 'Discarded — culled at review with sign-off'], ['net', 'Telemetry — events and hit counts']],
  }],
});
