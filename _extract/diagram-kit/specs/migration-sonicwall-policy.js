/* specs/migration-sonicwall-policy.js — SonicWall (SonicOS) policy migration to Cato */
DG.page('migration-sonicwall-policy', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'mgmt'],
    mods: ['sse'],
    // one circle per step (a shared anchor draws a pill the dark theme leaves unfilled): steps 1 and 2 side by side on the
    // CMA box's top edge, clear of its subtitle; step 4 beside step 3 on the PoP, clear of the 'Cato PoP' label
    anchors: {mgmt: [764, 132], mgmt2: [800, 132], pop: [856, 334], pop4: [892, 334]},
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'eg-www'}, {p: 'eg-saas'}, {p: 'm1'}],
    steps: [
      {t: 'Access rules, NAT, CFS/App Control and security services export via TSR, API or NSM; counters cleared at discovery cull dead access rules after 30 days.', marks: ['mgmt']},
      {t: 'Zone matrices become scopes in one global rulebase; every secret in the export is rotated, never ported.', marks: ['mgmt2']},
      {t: 'The PoP applies the converted rulebase to every site and user, monitor-first before anything blocks.', marks: ['pop', 'branch', 'users']},
      {t: 'Events and hit counts prove each rule before it flips to block; the rotation log is auditable evidence.', marks: ['pop4']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, side, tier, mark, xmark} = K;
      let s = '';

      /* ---- top band: the four SonicOS policy domains ---- */
      s += tier(14, 34, 'SONICOS POLICY DOMAINS');
      const DOM = [
        [14, 'Access rules + NAT', 'zone matrix · per box', ''],
        [200, 'CFS · App Control', 'web policy · DPI-SSL', ''],
        [386, 'Security services', 'GAV · IPS · Capture ATP', ''],
        [572, 'CASB / DLP', 'greenfield · no export', 'dash'],
      ];
      /* fan-in: the three exportable domains drop to one bus that feeds EXPORT */
      s += fl('M100 110V223', 'fl-flow', {np: 0, arrow: true});
      s += fl('M286 110V156Q286 166 276 166H110Q100 166 100 176', 'fl-flow', {np: 0});
      s += fl('M472 110V156Q472 166 462 166H110Q100 166 100 176', 'fl-flow', {np: 0});
      /* greenfield: skips export and translation, still deploys monitor-first */
      s += fl('M658 110V176Q658 186 648 186H580Q570 186 570 196V223', 'fl-ha', {arrow: 'arr-y', dur: 1.4,
        label: 'discovery inputs', lx: 614, ly: 150, lcls: 'y'});
      DOM.forEach(([x, t, sub, cls]) => { s += nd(x, 50, 172, 60, {t, s: [sub], cls}); });
      s += pill(270, 32, 'classic or policy mode', 'm');

      /* ---- the pipeline, left to right ---- */
      s += tier(14, 216, '1 · EXPORT');
      s += tier(164, 216, '2 · REVIEW & MAP');
      s += tier(464, 216, '3 · DEPLOY');
      const Y = 226, H = 64, W = 128;
      s += nd(14, Y, W, H, {t: 'EXPORT', s: ['.exp · TSR · API', 'NSM: one pass']});
      s += nd(164, Y, W, H, {t: 'RATIONALISE', s: ['per-rule Rx/Tx', 'dedupe objects'], cls: 'hot'});
      s += nd(314, Y, W, H, {t: 'MAP TO CMA', s: ['zones → scopes', 'objects, then rules']});
      s += nd(464, Y, W, H, {t: 'MONITOR', s: ['log, don\'t block', 'no user impact'], cls: 'dash'});
      s += nd(614, Y, W, H, {t: 'ENFORCE', s: ['flip to block', 'one rule at a time'], cls: 'pop'});
      s += mark(728, 240, 'ok');

      const MY = Y + H / 2;
      s += fl(`M142 ${MY}H161`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M292 ${MY}H311`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M442 ${MY}H461`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M592 ${MY}H611`, 'fl-ha', {arrow: 'arr-y', dur: 0.8});
      s += pill(603, 312, 'amber → green', 'y');

      /* ---- exits: nothing leaves these ---- */
      s += fl('M200 290C200 330 100 334 98 372', 'fl-down', {np: 0});
      s += xmark(150, 326);
      s += nd(14, 372, 168, 58, {t: 'Dead rules', s: ['zero Rx/Tx at 30 days', 'never translated'], cls: 'dash'});

      s += fl('M392 290V372', 'fl-down', {np: 0});
      s += xmark(392, 330);
      s += nd(290, 372, 200, 66, {t: 'Every secret', s: ['local users · PSKs', 'TOTP seeds · SNMP', 'rotated, never ported'], ic: 'key', cls: 'dash'});

      /* ---- evidence loop: phase 4, optimise ---- */
      s += fl('M500 290C500 336 556 344 566 370', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += fl('M700 290C700 336 684 344 674 370', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += side(520, 372, 200, 58, 'Events & hit counts', 'Monitor → Events', 'chart');
      s += fl('M620 430V452Q620 462 610 462H258Q248 462 248 452V293', 'fl-net', {np: 0, arrow: 'arr-n',
        label: '4 · OPTIMISE loop', lx: 434, ly: 462, lcls: 'm'});

      /* ---- footnotes: the carry-over facts ---- */
      s += T(380, 494, 'SSLVPN-zone rules are re-authored as identity-scoped ZTNA, never translated', 'f-s', 'middle');
      s += T(380, 508, 'CGSS/AGSS · EPSS/APSS licence bundles decide today\'s per-box protections', 'f-s', 'middle');
      s += T(380, 522, 'DPI-SSL was rationed by connection limits, so Cato TLSi is often the first full inspection', 'f-s', 'middle');
      s += T(380, 536, 'Rule zero: CVE-2024-40766 (CVSS 9.3 · CISA KEV 9 Sep 2024) · MySonicWall cloud-backup breach (every user, 8 Oct 2025)', 'f-s', 'middle');
      s += T(380, 550, 'Essential Credential Reset: local users · TOTP bindings · IPsec keys', 'f-s', 'middle');
      return s;
    },
    title: 'SonicOS policy pipeline — rotate, never port',
    desc: 'The four SonicOS policy domains are exported once and rationalised against per-rule counters, where dead rules exit; at mapping every secret in the export exits too, rotated and replaced by IdP identity, and each mapped rule deploys in monitor before promotion on evidence.',
    legend: [['flow', 'Surviving rules — exported, reviewed and mapped'], ['ha', 'Monitor first — incl. greenfield CASB/DLP discovery inputs'], ['down', 'Never migrates — dead rules and every secret'], ['net', 'Events and hit counts — evidence for promotion and clean-up']],
  }],
});
