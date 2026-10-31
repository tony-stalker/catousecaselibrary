/* specs/migration-symantec-policy.js — Symantec (ProxySG CPL · WSS · CloudSOC · DLP) policy migration to Cato */
DG.page('migration-symantec-policy', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'mgmt'],
    mods: ['sse'],
    anchors: {mgmt: [782, 132]},   // steps 1·2 marker on the CMA box's top edge, clear of its subtitle
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'eg-www'}, {p: 'eg-saas'}, {p: 'm1'}],
    steps: [
      {t: 'Policy exports with Reporter hits and DLP incident history; every layer is triaged: intent, plumbing or dead.', marks: ['mgmt']},
      {t: 'Only intent crosses to CMA rules, TLS bypasses and DLP data types; IWA/BCAAA gives way to SCIM identity.', marks: ['mgmt']},
      {t: 'The PoP applies the converted rulebase to every site and user, deployed monitor-first.', marks: ['pop', 'branch', 'users']},
      {t: 'Events and hit counts prove each rule before it is promoted from monitor to block.', marks: ['pop']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, side, tier, mark, xmark} = K;
      let s = '';

      /* ---- top band: the four Symantec policy domains (four consoles) ---- */
      s += tier(14, 34, 'SYMANTEC POLICY DOMAINS · FOUR CONSOLES');
      const DOM = [
        [14, 'ProxySG CPL', 'VPM · Local layers'],
        [200, 'WSS / Cloud SWG', 'portal · UPE policy'],
        [386, 'CloudSOC CASB', 'Securlets · inline'],
        [572, 'Symantec DLP', 'policies · incidents'],
      ];
      /* fan-in: each domain drops to one bus that feeds EXPORT */
      DOM.forEach(([x]) => {
        const cx = x + 86;
        s += fl(cx === 100 ? 'M100 110V156Q100 166 110 166V226' : `M${cx} 110V156Q${cx} 166 ${cx - 10} 166H120Q110 166 110 176V226`, 'fl-flow', {np: 0, arrow: cx === 100});
      });
      s += fl('M110 176V226', 'fl-flow', {np: 0, arrow: true});
      DOM.forEach(([x, t, sub]) => { s += nd(x, 50, 172, 60, {t, s: [sub]}); });
      s += pill(250, 192, '4 consoles → 1 CMA rulebase', 'm');

      /* ---- the pipeline: export → review & map → deploy → enforce ---- */
      s += tier(14, 216, '1 · EXPORT');
      s += tier(164, 216, '2 · REVIEW & MAP');
      s += tier(464, 216, '3 · DEPLOY · MONITOR-FIRST');
      const Y = 226, H = 64, W = 128;
      s += nd(14, Y, W, H, {t: 'EXPORT', s: ['CPL files', 'Reporter · access logs']});
      s += nd(164, Y, W, H, {t: 'RATIONALISE', s: ['intent vs plumbing', 'dead layers out'], cls: 'hot'});
      s += nd(314, Y, W, H, {t: 'MAP TO CMA', s: ['FW · SWG', 'CASB · DLP']});
      s += nd(464, Y, W, H, {t: 'DEPLOY', s: ['monitor mode', 'log only'], cls: 'dash'});
      s += nd(614, Y, W, H, {t: 'ENFORCE', s: ['block at parity', 'in stages'], cls: 'pop'});
      s += mark(728, 240, 'ok');

      const MY = Y + H / 2;
      s += fl(`M142 ${MY}H161`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M292 ${MY}H311`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M442 ${MY}H461`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M592 ${MY}H611`, 'fl-ha', {arrow: 'arr-y', dur: 0.8});
      s += pill(603, 312, 'amber → green on evidence', 'y');
      s += pill(378, 312, 'coach → Prompt', '');
      s += pill(378, 338, 'IWA / BCAAA → SCIM', 'b');

      /* ---- Reporter EOL: the evidence base is on borrowed time ---- */
      s += T(14, 308, 'Reporter EOL Mar 2025', 'f-m');
      s += T(14, 322, 'archive in week one', 'f-m');

      /* ---- discard branch: nothing leaves it ---- */
      s += fl('M220 290C220 340 110 336 98 382', 'fl-down', {np: 0});
      s += xmark(166, 340);
      s += nd(14, 382, 168, 58, {t: 'Discarded', s: ['dead CPL · plumbing', 'auth exemptions · WCCP'], cls: 'dash'});

      /* ---- evidence loop: optimise ---- */
      s += fl('M528 290C528 352 580 360 590 398', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += fl('M678 290C678 352 660 360 650 398', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += side(520, 400, 200, 58, 'Events & hit counts', 'Monitor → Events', 'chart');
      s += fl('M520 429C390 429 262 392 262 292', 'fl-net', {np: 0, arrow: 'arr-n', label: '4 · OPTIMISE loop', lx: 342, ly: 400, lcls: 'm'});

      /* ---- the honest hybrid ---- */
      s += side(196, 448, 300, 50, 'Hybrid: endpoint DLP stays', 'USB · print · clipboard on Symantec agent', 'lock');

      /* ---- footnotes: the carry-over facts ---- */
      s += T(380, 522, 'No automated CPL-to-Cato converter exists · CPL is rationalised, never ported', 'f-s', 'middle');
      s += T(380, 542, 'DLP: described content → data types · EDM rebuilt from source · IDM and VML → redesign or retain', 'f-s', 'middle');
      return s;
    },
    title: 'Symantec policy pipeline — CPL to intent',
    desc: 'All four Symantec policy domains move through one pipeline: export the CPL corpus and portal policy with Reporter and access-log hit data, discard dead layers and proxy plumbing, map the survivors to CMA, deploy in monitor and enforce only at telemetry parity.',
    legend: [['flow', 'Surviving policy — exported, reviewed and mapped'], ['ha', 'Monitor-first deployment — log, don\'t block'], ['down', 'Dead CPL and plumbing — discarded on hit data'], ['net', 'Events and hit counts — evidence for promotion and clean-up']],
  }],
});
