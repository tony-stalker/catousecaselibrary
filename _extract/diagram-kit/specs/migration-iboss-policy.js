/* specs/migration-iboss-policy.js — iboss (cloud FW · web policy · CASB · DLP) policy migration to Cato */
DG.page('migration-iboss-policy', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'mgmt'],
    mods: ['sse'],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'eg-www'}, {p: 'eg-saas'}, {p: 'm1'}],
    steps: [
      {t: 'iboss firewall, per-OU web policy, CASB and DLP rules are exported per domain and triaged on hit counts.', marks: ['mgmt']},
      {t: 'OU tiers become SCIM-group rule blocks; SafeSearch and YouTube move to Content Restrictions.', marks: ['mgmt']},
      {t: 'The PoP applies the converted rules to every site and user, monitor-first, one cohort wave at a time.', marks: ['pop', 'branch', 'users']},
      {t: 'Events and hit counts prove each rule before it is flipped from monitor to block.', marks: ['pop']},
    ],
    anchors: {mgmt: [782, 132]},
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, side, tier, mark, xmark} = K;
      let s = '';

      /* ---- top band: the four iboss policy domains, exported per domain ---- */
      s += tier(14, 34, 'IBOSS POLICY DOMAINS · PER-DOMAIN EXPORT');
      const DOM = [
        [14, 'FW rules', 'cloud firewall', 'port/protocol objects'],
        [200, 'Web policy', 'per-OU tiers', 'categories · SSL'],
        [386, 'CASB controls', 'apps · tenants', 'dedicated-IP register'],
        [572, 'DLP rules', 'patterns', 'export intent only'],
      ];
      /* fan-in: each domain drops to one bus that feeds EXPORT */
      DOM.forEach(([x]) => {
        const cx = x + 86;
        s += fl(cx === 100 ? 'M100 118V156Q100 166 110 166V226' : `M${cx} 118V156Q${cx} 166 ${cx - 10} 166H120Q110 166 110 176V226`, 'fl-flow', {np: 0, arrow: cx === 100});
      });
      s += fl('M110 176V226', 'fl-flow', {np: 0, arrow: true});
      DOM.forEach(([x, t, a, b]) => { s += nd(x, 50, 172, 68, {t, s: [a, b]}); });
      s += pill(378, 192, 'PAC + SSL bypass lists seed TLS bypass rules', 'm');

      /* ---- the pipeline: export → review & map → deploy → enforce ---- */
      s += tier(14, 216, '1 · EXPORT');
      s += tier(164, 216, '2 · REVIEW & MAP');
      s += tier(464, 216, '3 · DEPLOY · MONITOR-FIRST');
      const Y = 226, H = 64, W = 128;
      s += nd(14, Y, W, H, {t: 'EXPORT', s: ['per-domain dumps', 'PAC exceptions']});
      s += nd(164, Y, W, H, {t: 'RATIONALISE', s: ['hit-count triage'], cls: 'hot'});
      s += nd(314, Y, W, H, {t: 'MAP TO CMA', s: ['OU → SCIM groups', 'Content Restrictions']});
      s += nd(464, Y, W, H, {t: 'DEPLOY', s: ['monitor first', 'track events · no blocks'], cls: 'dash'});
      s += nd(614, Y, W, H, {t: 'ENFORCE', s: ['block on evidence', 'rule by rule'], cls: 'pop'});
      s += mark(728, 240, 'ok');

      const MY = Y + H / 2;
      s += fl(`M142 ${MY}H161`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M292 ${MY}H311`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M442 ${MY}H461`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M592 ${MY}H611`, 'fl-ha', {arrow: 'arr-y', dur: 0.8});
      s += pill(603, 312, 'amber → green on evidence', 'y');
      s += pill(378, 312, 'iboss + Cato CA side by side', '');

      /* ---- discard branch: nothing leaves it ---- */
      s += fl('M200 290C200 336 100 330 96 382', 'fl-down', {np: 0});
      s += xmark(148, 330);
      s += nd(14, 382, 168, 58, {t: 'Discarded', s: ['zero-hit · disabled · duplicate', 'never reaches CMA'], cls: 'dash'});

      /* ---- evidence loop: optimise ---- */
      s += fl('M528 290C528 352 580 360 590 398', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += fl('M678 290C678 352 660 360 650 398', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += side(520, 400, 200, 58, 'Events & hit counts', 'parity evidence per wave', 'chart');
      s += fl('M520 429C390 429 262 392 262 292', 'fl-net', {np: 0, arrow: 'arr-n', label: '4 · OPTIMISE loop', lx: 342, ly: 396, lcls: 'm'});

      /* ---- the rollback rail: cohort waves, PAC kept hosted ---- */
      s += side(196, 448, 300, 50, 'Per cohort: OU · year group · school', 'PAC stays hosted: rollback is one GPO/MDM change', 'users');

      /* ---- footnotes: the carry-over facts ---- */
      s += T(380, 522, 'DoH bypasses Content Restrictions: block DNS-over-HTTPS in the same change · DLP: 350+ data types', 'f-s', 'middle');
      s += T(380, 542, 'Default licence: 3 allocated egress IPs · dual-list both vendors’ IPs on the SaaS side before each wave', 'f-s', 'middle');
      return s;
    },
    title: 'iboss policy pipeline — per domain, per cohort',
    desc: 'The policy pipeline run per domain and per cohort wave: export, rationalise on hit counts, map to CMA constructs, deploy in monitor and enforce on evidence, with events and hit counts feeding the Optimise phase.',
    legend: [['flow', 'Surviving rules — exported, reviewed and mapped'], ['ha', 'Deploy in monitor — track events, no blocks'], ['down', 'Discarded at rationalisation — dead rules never reach CMA'], ['net', 'Events and hit counts — evidence for promotion and clean-up']],
  }],
});
