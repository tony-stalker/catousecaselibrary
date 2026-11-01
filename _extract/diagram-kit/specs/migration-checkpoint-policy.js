/* specs/migration-checkpoint-policy.js — Check Point policy migration (SmartConsole policy conversion pipeline) */
DG.page('migration-checkpoint-policy', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'mgmt'],
    mods: ['sse'],
    anchors: {mgmt: [782, 132]},   // merged 1 · 2 marker on the CMA box's top edge, clear of its subtitle and the XOps badge
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'eg-www'}, {p: 'eg-saas'}, {p: 'm1'}],
    steps: [
      {t: 'SmartConsole layers export via mgmt_cli with hit counts; zero-hit, disabled and shadowed rules are stripped.', marks: ['mgmt']},
      {t: 'Ordered and inline layers flatten to one first-match rulebase per firewall; implicit cleanups become explicit.', marks: ['mgmt']},
      {t: 'The PoP applies the converted rules to every site and user, monitor-first: log, don\'t block.', marks: ['pop', 'branch', 'users']},
      {t: 'Events and hit counts prove each rule before it is promoted from monitor to block.', marks: ['pop']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, tier, popBox, side, xmark, mark} = K;
      let s = '';
      const BY = 168, BH = 76, BW = 124, MID = BY + BH / 2;   // pipeline row
      const X = [14, 160, 312, 458, 604];                     // EXPORT · RATIONALISE · MAP · DEPLOY · ENFORCE

      /* ---- top: the four SmartConsole policy domains ---- */
      s += tier(14, 20, 'SMARTCONSOLE POLICY DOMAINS');
      const DX = [14, 202, 390, 578];
      const doms = [['Access + NAT', 'ordered · inline layers', 'firewall'], ['App Control · URLF', '+ HTTPS Inspection', 'globe'],
                    ['Inline CASB intent', 'Harmony SASE, if any', 'shield'], ['DLP blade', 'data types · rules', 'file']];
      doms.forEach(([t, sub, ic], i) => { s += nd(DX[i], 30, 168, 52, {t, s: [sub], ic, is: 20, icls: 'g', cls: 'soft'}); });

      /* fan-in: every domain drops onto one bus that enters EXPORT */
      DX.forEach(x => { s += fl(`M${x + 84} 82V102`, 'fl-flow', {np: 0}); });
      s += fl(`M${DX[3] + 84} 102H76V${BY}`, 'fl-flow', {dur: 2.2, arrow: 'arr-n'});
      s += T(746, 20, 'same pipeline per domain · offset in time', 'f-s', 'end');

      /* ---- the Cato side: rebuilt in CMA ---- */
      s += popBox(302, 112, 436, 144, 'Cato Management Application', 'one flat rulebase per firewall');

      /* ---- pipeline row ---- */
      s += nd(X[0], BY, BW, BH, {t: 'EXPORT', s: ['mgmt_cli · Mgmt API', 'show-hits true', 'limit 500 · paginate']});
      s += nd(X[1], BY, BW, BH, {t: 'RATIONALISE', s: ['cull on hit counts', 'model effective policy'], cls: 'hot'});
      s += nd(X[2], BY, BW, BH, {t: 'MAP TO CMA', s: ['flat · first-match', 'FW · SWG · CASB · DLP']});
      s += nd(X[3], BY, BW, BH, {t: 'DEPLOY', s: ['monitor mode first', 'log, don\'t block']});
      s += nd(X[4], BY, BW, BH, {t: 'ENFORCE', s: ['flip to block', 'rule by rule'], cls: 'pop'});
      s += mark(X[4] + BW - 4, BY + 4, 'ok');

      s += fl(`M${X[0] + BW} ${MID}H${X[1]}`, 'fl-flow', {dur: 1.2, arrow: 'arr-n'});
      s += fl(`M${X[1] + BW} ${MID}H${X[2]}`, 'fl-flow', {dur: 1.2, arrow: 'arr-n'});
      s += fl(`M${X[2] + BW} ${MID}H${X[3]}`, 'fl-flow', {dur: 1.2, arrow: 'arr-n'});
      s += fl(`M${X[3] + BW} ${MID}H${X[4]}`, 'fl-ha', {np: 0, arrow: 'arr-y'});

      /* ---- discard branch: layer debt never reaches CMA ---- */
      const RX = X[1] + 36;
      s += fl(`M${RX} ${BY + BH}V318`, 'fl-down', {np: 0});
      s += xmark(RX, 284);
      s += nd(14, 318, 224, 58, {t: 'Layer debt discarded', s: ['zero-hit · disabled · shadowed', 'never translated'], cls: 'dash'});

      /* ---- evidence loop: events from deploy and enforce feed back ---- */
      s += side(X[3], 318, X[4] + BW - X[3], 58, 'Events & hit counts', 'Monitor → Events · per rule', 'chart');
      s += fl(`M${X[3] + 62} ${BY + BH}V318`, 'fl-net', {dur: 1.6, arrow: 'arr-n'});
      s += fl(`M${X[4] + 62} ${BY + BH}V318`, 'fl-net', {dur: 1.6, arrow: 'arr-n'});
      s += fl(`M${X[3]} 347H${X[1] + 104}V${BY + BH + 2}`, 'fl-net', {dur: 2, arrow: 'arr-n'});
      s += pill(352, 347, 'OPTIMISE loop', 'y');
      s += T(352, 372, 'compare with SmartConsole hits', 'f-s', 'middle');

      /* ---- the semantic traps that change in translation ---- */
      s += tier(14, 420, 'WHAT CHANGES IN TRANSLATION');
      const notes = [
        [14, 446, 'Layer semantics', 'translate the effective policy, never the structure'],
        [390, 446, 'Inline-layer cleanup', 'explicit block on the default-allow Internet FW'],
        [14, 496, 'Ask / Inform (UserCheck)', 'becomes the Prompt action'],
        [390, 496, 'Harmony SASE tenant', 'kept warm as rollback until the last cohort'],
      ];
      notes.forEach(([x, y, t, sub]) => { s += mark(x + 8, y - 4, 'warn') + T(x + 24, y, t, 'nd-t') + T(x + 24, y + 16, sub, 'f-s'); });
      return s;
    },
    title: 'Check Point policy conversion pipeline',
    desc: 'The four SmartConsole policy domains are exported via the Management API, rationalised against hit-count evidence, and only surviving intent is mapped to CMA; every mapped rule deploys in monitor and is promoted to enforcement on evidence.',
    legend: [['flow', 'Policy through the pipeline'], ['ha', 'Promotion from monitor to block — on evidence'], ['down', 'Discarded at rationalisation — never reaches CMA'], ['net', 'Events and hit counts — the OPTIMISE evidence loop']],
  }],
});
