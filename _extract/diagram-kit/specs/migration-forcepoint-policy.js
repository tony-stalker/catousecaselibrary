/* specs/migration-forcepoint-policy.js — Forcepoint (SMC · Web Security · ONE · DLP) policy migration to Cato */
DG.page('migration-forcepoint-policy', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'mgmt'],
    mods: ['sse'],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'eg-www'}, {p: 'eg-saas'}, {p: 'm1'}],
    steps: [
      {t: 'SMC rules, Web Security categories, ONE app intent and DLP policies are pulled with 90 days of hit data.', marks: ['mgmt']},
      {t: 'Survivors map to CMA rulebases; structured fingerprints rebuilt as EDM, ML redesigned or retained.', marks: ['mgmt']},
      {t: 'The PoP applies the converted rules to every site and user, monitor-first and log-only.', marks: ['pop', 'branch', 'users']},
      {t: 'Events and hit counts prove each rule before it is promoted from monitor to block.', marks: ['pop']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, side, tier, mark, xmark} = K;
      let s = '';

      /* ---- top band: the four Forcepoint policy domains (four heritages) ---- */
      s += tier(14, 34, 'FORCEPOINT POLICY DOMAINS · FOUR HERITAGES');
      const DOM = [
        [14, 'NGFW / SMC', 'access rules · NAT', 'Stonesoft heritage'],
        [200, 'Web Security', 'category policy', 'Websense heritage'],
        [386, 'Forcepoint ONE', 'CASB / app policy', 'ex-Bitglass'],
        [572, 'DLP policies', 'classifiers · incidents', 'TRITON heritage'],
      ];
      /* fan-in: each domain drops to one bus that feeds EXPORT */
      DOM.forEach(([x]) => {
        const cx = x + 86;
        s += fl(cx === 100 ? 'M100 118V156Q100 166 110 166V226' : `M${cx} 118V156Q${cx} 166 ${cx - 10} 166H120Q110 166 110 176V226`, 'fl-flow', {np: 0, arrow: cx === 100});
      });
      s += fl('M110 176V226', 'fl-flow', {np: 0, arrow: true});
      DOM.forEach(([x, t, a, b]) => { s += nd(x, 50, 172, 68, {t, s: [a, b]}); });
      s += pill(600, 30, '4 heritages → 1 CMA rulebase', 'm');

      /* ---- the pipeline: export → review & map → deploy → enforce ---- */
      s += tier(14, 216, '1 · EXPORT');
      s += tier(164, 216, '2 · REVIEW & MAP');
      s += tier(464, 216, '3 · DEPLOY · MONITOR-FIRST');
      const Y = 226, H = 64, W = 128;
      s += nd(14, Y, W, H, {t: 'EXPORT', s: ['SMC rule counters', 'DLP incident history']});
      s += nd(164, Y, W, H, {t: 'RATIONALISE', s: ['zero hits in 90 days', 'are out'], cls: 'hot'});
      s += nd(314, Y, W, H, {t: 'MAP TO CMA', s: ['objects, SCIM groups', 'then rules']});
      s += nd(464, Y, W, H, {t: 'DEPLOY', s: ['monitor mode', 'log only'], cls: 'dash'});
      s += nd(614, Y, W, H, {t: 'ENFORCE', s: ['block at parity', 'in stages'], cls: 'pop'});
      s += mark(728, 240, 'ok');

      const MY = Y + H / 2;
      s += fl(`M142 ${MY}H161`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M292 ${MY}H311`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M442 ${MY}H461`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M592 ${MY}H611`, 'fl-ha', {arrow: 'arr-y', dur: 0.8});
      s += pill(603, 312, 'amber → green on evidence', 'y');
      s += pill(378, 312, 'Web: Confirm → Prompt', '');

      /* ---- discard branch: nothing leaves it ---- */
      s += fl('M200 290C200 336 100 330 96 382', 'fl-down', {np: 0});
      s += xmark(148, 330);
      s += nd(14, 382, 168, 58, {t: 'Discarded', s: ['zero-hit rules', 'DLP: no triaged incident'], cls: 'dash'});

      /* ---- evidence loop: optimise ---- */
      s += fl('M528 290C528 352 580 360 590 398', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += fl('M678 290C678 352 660 360 650 398', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += side(520, 400, 200, 58, 'Events & hit counts', 'Monitor → Events', 'chart');
      s += fl('M520 429C390 429 262 392 262 292', 'fl-net', {np: 0, arrow: 'arr-n', label: '4 · OPTIMISE loop', lx: 342, ly: 396, lcls: 'm'});

      /* ---- the honest hybrid ---- */
      s += side(196, 448, 300, 50, 'Hybrid: endpoint DLP stays', 'USB · print · clipboard · Cato posture-checks it', 'lock');

      /* ---- footnotes: the carry-over facts ---- */
      s += T(380, 522, 'DLP: data types map directly · structured fingerprints → EDM rebuilt from source · unstructured & ML → redesign or retain', 'f-s', 'middle');
      s += T(380, 542, 'Quota has no time-based equivalent · OCR is not supported with EDM profiles', 'f-s', 'middle');
      return s;
    },
    title: 'Forcepoint policy conversion pipeline',
    desc: 'All four Forcepoint policy domains move through one pipeline: export with hit data, discard the dead weight, map the survivors to CMA constructs, deploy in monitor and enforce only when the event telemetry matches expectations.',
    legend: [['flow', 'Surviving rules — exported, reviewed and mapped'], ['ha', 'Monitor-first deployment — log, don\'t block'], ['down', 'Discarded at rationalisation — never reaches CMA'], ['net', 'Events and hit counts — evidence for promotion and clean-up']],
  }],
});
