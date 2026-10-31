/* specs/migration-zscaler-policy.js — Zscaler (ZIA) policy migration to Cato */
DG.page('migration-zscaler-policy', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'mgmt'],
    mods: ['sse'],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'eg-www'}, {p: 'eg-saas'}, {p: 'm1'}],
    steps: [
      {t: 'ZIA firewall, URL filtering, Cloud App Control and DLP are exported via API and culled on hit counts.', marks: ['mgmt']},
      {t: 'Survivors land in the Internet Firewall, TLS Inspection, App Control (CASB) and DLP, never the WAN Firewall.', marks: ['mgmt']},
      {t: 'The PoP applies the converted rules to every site and user, monitor-first with tracking on every rule.', marks: ['pop', 'branch', 'users']},
      {t: 'Events and hit counts prove each rule before it is promoted from monitor to block.', marks: ['pop']},
    ],
    anchors: {mgmt: [782, 138]},   // steps 1–2 marker on the CMA box's top edge, clear of its subtitle
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, side, tier, mark, xmark} = K;
      let s = '';

      /* ---- top band: the four ZIA policy domains in the export scope ---- */
      s += tier(14, 34, 'ZIA POLICY DOMAINS · EXPORT SCOPE');
      const DOM = [
        [14, 'ZIA Firewall', 'Firewall Filtering rules'],
        [200, 'URL Filtering & SSL', 'web security · ATP'],
        [386, 'Cloud App Control', 'CASB · tenant profiles'],
        [572, 'ZIA DLP', 'engines · dictionaries'],
      ];
      /* fan-in: each domain drops to one bus that feeds EXPORT */
      DOM.forEach(([x]) => {
        const cx = x + 86;
        s += fl(cx === 100 ? 'M100 110V156Q100 166 110 166V226' : `M${cx} 110V156Q${cx} 166 ${cx - 10} 166H120Q110 166 110 176V226`, 'fl-flow', {np: 0, arrow: cx === 100 ? true : false});
      });
      s += fl('M110 176V226', 'fl-flow', {np: 0, arrow: true});
      DOM.forEach(([x, t, sub]) => { s += nd(x, 50, 172, 60, {t, s: [sub]}); });
      s += pill(630, 138, 'EDM / IDM do not export · EDM rebuilt', 'y');

      /* ---- the pipeline: phases 1–3, left to right ---- */
      s += tier(14, 216, '1 · EXPORT');
      s += tier(164, 216, '2 · REVIEW & MAP');
      s += tier(464, 216, '3 · DEPLOY · MONITOR-FIRST');
      const Y = 226, H = 64, W = 124;
      s += nd(14, Y, W, H, {t: 'EXPORT', s: ['ZIA API · JSON', 'config screenshots']});
      s += nd(164, Y, W, H, {t: 'RATIONALISE', s: ['cull on hit counts'], cls: 'hot'});
      s += nd(314, Y, W, H, {t: 'MAP TO CMA', s: ['Internet FW · TLSi', 'App Control · DLP']});
      s += nd(464, Y, W, H, {t: 'DEPLOY', s: ['monitor action', 'tracking on'], cls: 'dash'});
      s += nd(614, Y, W, H, {t: 'ENFORCE', s: ['flip to block', 'one rule at a time'], cls: 'pop'});
      s += mark(724, 240, 'ok');

      const MY = Y + H / 2;
      s += fl(`M138 ${MY}H161`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M288 ${MY}H311`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M438 ${MY}H461`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M588 ${MY}H611`, 'fl-ha', {arrow: 'arr-y', dur: 0.8});
      s += pill(601, 312, 'promote on evidence', 'y');

      /* ---- discard branch: nothing leaves it ---- */
      s += fl('M200 290C200 336 100 330 96 382', 'fl-down', {np: 0});
      s += xmark(148, 330);
      s += nd(14, 382, 168, 58, {t: 'Discarded', s: ['dead · shadowed · test', 'never reaches CMA'], cls: 'dash'});

      /* ---- evidence loop: phase 4, optimise ---- */
      s += fl('M526 290C526 352 580 360 590 398', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += fl('M676 290C676 352 660 360 650 398', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += side(520, 400, 200, 58, 'Events & hit counts', 'Monitor → Events', 'chart');
      s += fl('M520 429C390 429 262 392 262 292', 'fl-net', {np: 0, arrow: 'arr-n', label: '4 · OPTIMISE loop', lx: 342, ly: 396, lcls: 'm'});

      /* ---- footnotes: the carry-over facts ---- */
      s += T(380, 504, 'After go-live, Autonomous Firewall Insights flag allow rules with no events in 60 days', 'f-s', 'middle');
      s += T(380, 524, 'ZPA access policy maps to the WAN Firewall: covered on the main Zscaler playbook', 'f-s', 'middle');
      return s;
    },
    title: 'ZIA policy conversion pipeline',
    desc: 'All four ZIA policy domains move through one pipeline: export everything, discard what hit counts cannot justify, map the survivors to CMA constructs, deploy in monitor and promote to enforce only on event evidence.',
    legend: [['flow', 'Policy flow — exported, then only survivors are mapped'], ['ha', 'Promotion — monitor to block, per rule, on event evidence'], ['down', 'Discarded at rationalisation — never reaches CMA'], ['net', 'Events and hit counts — evidence for promotion and clean-up']],
  }],
});
