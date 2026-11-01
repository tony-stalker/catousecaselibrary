/* specs/migration-versa-policy.js — Versa (VOS / Director) policy migration to Cato */
DG.page('migration-versa-policy', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'mgmt'],
    mods: ['sse'],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'eg-www'}, {p: 'eg-saas'}, {p: 'm1'}],
    steps: [
      {t: 'Director templates and per-appliance configs export (a provider ticket if carrier-managed), culled on hits.', marks: ['branch']},
      {t: 'Rules split by destination into WAN, Internet and LAN policies; per-rule UTM becomes global IPS and NGAM.', marks: ['mgmt']},
      {t: "Cato applies the converted rules to every site and user, monitor-first: watch, don't block.", marks: ['users']},
      {t: 'Events and hit counts prove each rule before it is promoted from monitor to block.', marks: ['pop']},
    ],
    anchors: {mgmt: [782, 132]},   // step 2 marker on the CMA top edge, clear of its subtitle
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, side, tier, mark, xmark} = K;
      let s = '';

      /* ---- top band: the four VOS policy domains ---- */
      s += tier(14, 24, 'RULEBASE DOMAINS · EXPORTED');
      s += tier(386, 24, 'GREENFIELD · NOTHING TO EXPORT');

      /* rulebase fan-in: both domains drop onto one bus into EXPORT */
      s += fl('M286 92V130Q286 140 276 140H110Q100 140 100 150', 'fl-flow', {np: 0});
      s += fl('M100 92V207', 'fl-flow', {arrow: true, dur: 1.6});

      /* greenfield lanes: skip export and translation, enter at DEPLOY */
      s += fl('M472 92V120Q472 130 482 130H572', 'fl-ha', {np: 0});
      s += fl('M658 92V120Q658 130 648 130H572', 'fl-ha', {np: 0});
      s += fl('M572 130V207', 'fl-ha', {arrow: 'arr-y', dur: 1.6});

      s += nd(14, 34, 172, 58, {t: 'VOS security policy', s: ['FW rules + UTM profiles']});
      s += nd(200, 34, 172, 58, {t: 'URL-filter profiles', s: ['SWG intent']});
      s += nd(386, 34, 172, 58, {t: 'CASB — none today', s: ['Analytics app data'], cls: 'dash'});
      s += nd(572, 34, 172, 58, {t: 'DLP — none today', s: ['workshop-led build'], cls: 'dash'});
      s += pill(572, 166, 'discovery inputs → best-practice build', 'y');

      /* ---- the pipeline: EXPORT → REVIEW & MAP → DEPLOY → ENFORCE ---- */
      s += tier(14, 202, '1 · EXPORT');
      s += tier(164, 202, '2 · REVIEW & MAP');
      s += tier(464, 202, '3 · DEPLOY');
      const Y = 210, H = 64, W = 128, MY = Y + H / 2;
      s += nd(14, Y, W, H, {t: 'EXPORT', s: ['Director · VOS CLI', 'effective per site']});
      s += nd(164, Y, W, H, {t: 'RATIONALISE', s: ['cull on hit counts', 'Versa Analytics'], cls: 'hot'});
      s += nd(314, Y, W, H, {t: 'MAP TO CMA', s: ['split by destination', 'API · Terraform']});
      s += nd(464, Y, W, H, {t: 'DEPLOY', s: ['monitor mode', "watch, don't block"], cls: 'dash'});
      s += nd(614, Y, W, H, {t: 'ENFORCE', s: ['flip to block', 'on event evidence'], cls: 'pop'});
      s += mark(728, Y + 14, 'ok');

      s += fl(`M142 ${MY}H161`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M292 ${MY}H311`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M442 ${MY}H461`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M592 ${MY}H611`, 'fl-ha', {arrow: 'arr-y', dur: 0.8});
      s += pill(80, 296, 'provider ticket', 'm');
      s += pill(378, 296, 'per-rule UTM → global layers', '');
      s += pill(603, 296, 'monitor → block on evidence', 'y');

      /* ---- discard branch: nothing leaves it ---- */
      s += fl('M228 274C228 330 160 330 150 366', 'fl-down', {np: 0});
      s += xmark(196, 326);
      s += nd(60, 366, 180, 62, {t: 'Dead rules discarded', s: ['zero Analytics hits', 'e.g. Legacy-FTP-Allow'], cls: 'dash'});

      /* ---- evidence loop: phase 4, optimise ---- */
      s += fl('M496 274C496 336 580 344 590 382', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += fl('M716 274C716 336 660 344 650 382', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += side(520, 384, 200, 58, 'Events & hit counts', 'Monitor → Events', 'chart');
      s += fl('M520 413C400 413 290 380 280 276', 'fl-net', {np: 0, arrow: 'arr-n', label: '4 · OPTIMISE loop', lx: 372, ly: 386, lcls: 'm'});

      /* ---- footnotes: the carry-over facts ---- */
      s += T(380, 480, 'Effective policy = Director template stack + per-device bind data · regenerate per appliance and diff', 'f-s', 'middle');
      s += T(380, 500, 'Carrier-managed estates: the export is a provider change ticket · raise it in week one', 'f-s', 'middle');
      s += T(380, 520, 'Per-rule IPS / AV / URL-filter profiles → global IPS, NGAM and category rules · alert / inform → allow + track', 'f-s', 'middle');
      return s;
    },
    title: 'Versa policy pipeline — templates to one rulebase',
    desc: 'The four policy domains ride one pipeline: export (a provider change ticket in carrier-managed estates), clean-up on hit counts, mapping to CMA constructs, deployment in monitor mode and promotion on evidence; the greenfield domains skip translation, not monitor-first.',
    legend: [['flow', 'Rulebase domains — exported, reviewed and mapped'], ['ha', 'Greenfield builds (enter at DEPLOY) · promotion, monitor to block on evidence'], ['down', 'Discarded at clean-up — never reaches CMA'], ['net', 'Events and hit counts — evidence for promotion']],
  }],
});
