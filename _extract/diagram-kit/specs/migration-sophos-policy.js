/* specs/migration-sophos-policy.js — Sophos (SFOS) policy migration to Cato */
DG.page('migration-sophos-policy', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'mgmt'],
    mods: ['sse'],
    anchors: {mgmt: [782, 132]},   // step 1-2 markers on the CMA box's top edge, clear of its subtitle
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'eg-www'}, {p: 'eg-saas'}, {p: 'm1'}],
    steps: [
      {t: 'SFOS rules, NAT, web and app control export as XML and are culled on usage; CASB and DLP are built greenfield.', marks: ['mgmt']},
      {t: 'Attached policies become layers: firewall rules plus account-level IPS/NGAM; Heartbeat rules become posture.', marks: ['mgmt']},
      {t: 'The PoP applies the converted rules to every site and user, monitor-first with no user impact.', marks: ['pop', 'branch', 'users']},
      {t: 'Events and hit counts prove each rule before it is promoted from monitor to block.', marks: ['pop']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, side, tier, mark, xmark} = K;
      let s = '';

      /* ---- top band: the four SFOS policy domains ---- */
      s += tier(14, 30, 'SFOS POLICY DOMAINS · RULEBASES');
      s += tier(386, 30, 'GREENFIELD · DISCOVERY INPUTS');
      const DY = 40, DH = 60;
      const DOM = [
        [14, 'FW rules + NAT', ['per-box rule tables'], 'firewall', ''],
        [200, 'Web & app control', ['web policy · TLS rules', 'Warn → Prompt action'], 'globe', ''],
        [386, 'CASB — greenfield', ['usage data seeds it'], 'shield', 'dash'],
        [572, 'DLP — greenfield', ['workshop-led build'], 'file', 'dash'],
      ];

      /* rulebase fan-in: both rulebase domains drop onto one bus into EXPORT */
      const Y = 232, H = 64, W = 124, MID = Y + H / 2;
      const X = [14, 160, 306, 452, 598];          // EXPORT · RATIONALISE · MAP · DEPLOY · ENFORCE
      s += fl(`M100 ${DY + DH}V${Y - 2}`, 'fl-flow', {arrow: 'arr-n', dur: 1.4});
      s += fl(`M286 ${DY + DH}V150Q286 160 276 160H110Q100 160 100 170`, 'fl-flow', {np: 0});

      /* greenfield: skip export and translation, straight to the monitor-first build */
      s += fl(`M472 ${DY + DH}C472 150 494 176 494 ${Y - 2}`, 'fl-https', {arrow: 'arr-n', dur: 1.8});
      s += fl(`M658 ${DY + DH}C658 168 568 168 568 ${Y - 2}`, 'fl-https', {arrow: 'arr-n', dur: 1.8});
      s += pill(560, 132, 'skip translation', 'm');
      s += T(696, 176, 'discovery inputs →', 'f-s', 'middle');
      s += T(696, 190, 'best-practice build', 'f-s', 'middle');

      DOM.forEach(([x, t, sub, ic, cls]) => { s += nd(x, DY, 174, DH, {t, s: sub, ic, is: 20, icls: 'g', cls: cls || 'soft'}); });

      /* ---- the pipeline row ---- */
      s += nd(X[0], Y, W, H, {t: 'EXPORT', s: ['XML export · API', 'rule usage counters']});
      s += nd(X[1], Y, W, H, {t: 'RATIONALISE', s: ['cull on usage', 'dedupe per-box objects'], cls: 'hot'});
      s += nd(X[2], Y, W, H, {t: 'MAP TO CMA', s: ['FW · SWG · TLS rules', 'policies → layers']});
      s += nd(X[3], Y, W, H, {t: 'DEPLOY', s: ['monitor first', 'no user impact'], cls: 'dash'});
      s += nd(X[4], Y, W, H, {t: 'ENFORCE', s: ['flip to block', 'per rule'], cls: 'pop'});
      s += mark(X[4] + W - 6, Y + 6, 'ok');

      s += fl(`M${X[0] + W} ${MID}H${X[1] - 2}`, 'fl-flow', {arrow: 'arr-n', dur: 0.8});
      s += fl(`M${X[1] + W} ${MID}H${X[2] - 2}`, 'fl-flow', {arrow: 'arr-n', dur: 0.8});
      s += fl(`M${X[2] + W} ${MID}H${X[3] - 2}`, 'fl-flow', {arrow: 'arr-n', dur: 0.8});
      s += fl(`M${X[3] + W} ${MID}H${X[4] - 2}`, 'fl-ha', {arrow: 'arr-y', dur: 0.8});
      s += pill(X[4] + 4, Y + H + 20, 'amber → green on evidence', 'y');
      s += pill(X[2] + W / 2, Y + H + 20, 'zones → source scopes', '');

      /* ---- discard branch: nothing leaves it ---- */
      s += fl(`M${X[1] + 40} ${Y + H}C${X[1] + 40} 340 104 340 104 384`, 'fl-down', {np: 0});
      s += xmark(150, 344);
      s += nd(14, 384, 196, 58, {t: 'Dead rules discarded', s: ['zero-traffic · any-any debt', 'never translated'], cls: 'dash'});

      /* ---- evidence loop: optimise ---- */
      s += fl(`M${X[3] + 66} ${Y + H}V398`, 'fl-net', {arrow: 'arr-n', dur: 1.6});
      s += fl(`M${X[4] + 66} ${Y + H + 32}V398`, 'fl-net', {arrow: 'arr-n', dur: 1.6});
      s += side(X[3], 400, X[4] + W - X[3], 58, 'Events & hit counts', 'Monitor → Events · per rule', 'chart');
      s += fl(`M${X[3]} 429C350 429 ${X[1] + 104} 396 ${X[1] + 104} ${Y + H + 2}`, 'fl-net', {arrow: 'arr-n', dur: 2, label: 'OPTIMISE loop', lx: 340, ly: 404, lcls: 'm'});

      /* ---- what changes in translation: the carry-over facts ---- */
      s += tier(14, 480, 'WHAT CHANGES IN TRANSLATION');
      const notes = [
        [14, 503, 'Security Heartbeat rules', 'Device Posture + Client Connectivity Policy'],
        [390, 503, 'Decoupled NAT (SFOS 18+)', 'masquerade dissolves · DNAT → remote port forwarding'],
        [14, 538, 'Identity first', 'Entra ID SSO + SCIM groups before mapping'],
        [390, 538, 'XGS 4.8–5× TLS sizing', 'no throughput maths — scope by intent'],
      ];
      notes.forEach(([x, y, t, sub]) => { s += mark(x + 8, y - 4, 'warn') + T(x + 24, y, t, 'nd-t') + T(x + 24, y + 15, sub, 'f-s'); });
      return s;
    },
    title: 'SFOS policy pipeline — rulebases and greenfield',
    desc: 'The two SFOS rulebase domains are exported as XML and rationalised on usage, the greenfield CASB and DLP pair enters with discovery inputs, and everything that survives is mapped to CMA, deployed in monitor and promoted to enforcement when events prove it.',
    legend: [['flow', 'Rulebases — exported, reviewed and mapped'], ['https', 'Greenfield — discovery inputs, best-practice build'], ['ha', 'Monitor-first deployment — log, don\'t block'], ['down', 'Discarded at rationalisation — never reaches CMA'], ['net', 'Events and hit counts — evidence for promotion']],
  }],
});
