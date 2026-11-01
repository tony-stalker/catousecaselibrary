/* specs/migration-cisco-policy.js — Cisco (ASA/FTD + Umbrella) policy migration to Cato */
DG.page('migration-cisco-policy', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'mgmt'],
    mods: ['sse'],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'eg-www'}, {p: 'eg-saas'}, {p: 'm1'}],
    steps: [
      {t: 'ASA/FTD ACLs (with hitcnt) and Umbrella web, app and DLP policy are exported and culled on usage evidence.', marks: ['mgmt']},
      {t: 'Survivors are sorted by posture (WAN Firewall allowlist, Internet Firewall blocklist), plus CASB and DLP.', marks: ['mgmt']},
      {t: 'The PoP applies the rules to every site and user, monitor-first; site web policy moves at Socket swap.', marks: ['pop', 'branch', 'users']},
      {t: 'Events and hit counts prove each rule before it flips from monitor to block.', marks: ['pop']},
    ],
    anchors: {mgmt: [782, 132]},   // steps 1·2 marker clear of the CMA subtitle
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, tier, popBox, side, xmark, mark} = K;
      let s = '';
      const Y = 206, H = 66, W = 128, MID = Y + H / 2;        // pipeline row
      const X = [14, 164, 314, 464, 614];                     // EXPORT · RATIONALISE · MAP · DEPLOY · ENFORCE

      /* ---- top band: the four Cisco policy domains ---- */
      s += tier(14, 22, 'CISCO POLICY DOMAINS · ASDM · FMC · CDO · UMBRELLA');
      const DX = [14, 200, 386, 572];
      const doms = [['ASA / FTD firewall', ['ACLs · object-groups', '+ Umbrella CDFW']],
                    ['Umbrella web policy', ['dest lists · categories', 'decryption lists']],
                    ['Umbrella app control', ['App Discovery', 'app block settings']],
                    ['Umbrella DLP', ['real-time rules', 'classifications · regex']]];

      /* fan-in: every domain drops onto one bus that enters EXPORT */
      DX.forEach(x => { s += fl(`M${x + 86} 94V118${x === DX[0] ? 'H124' : ''}`, 'fl-flow', {np: 0}); });
      s += fl(`M${DX[3] + 86} 118H124V${Y - 2}`, 'fl-flow', {dur: 2.2, arrow: 'arr-n'});
      doms.forEach(([t, sub], i) => { s += nd(DX[i], 32, 172, 62, {t, s: sub}); });
      s += pill(472, 118, 'same pipeline per domain', 'm');

      /* ---- the Cato side: rebuilt in CMA ---- */
      s += popBox(302, 140, 450, 162, 'Cato Management Application', '');

      /* phase labels (page: EXPORT → REVIEW & MAP → DEPLOY → OPTIMISE) */
      s += tier(X[0], Y - 8, '1 · EXPORT');
      s += tier(X[1], Y - 8, '2 · REVIEW & MAP');
      s += tier(X[3], Y - 8, '3 · DEPLOY');
      s += tier(X[4], Y - 8, '4 · OPTIMISE');

      /* ---- pipeline row ---- */
      s += nd(X[0], Y, W, H, {t: 'EXPORT', s: ['show access-list', 'dest-list CSV · API']});
      s += nd(X[1], Y, W, H, {t: 'RATIONALISE', s: ['cull on hit counts', 'with sign-off'], cls: 'hot'});
      s += nd(X[2], Y, W, H, {t: 'MAP TO CMA', s: ['WAN FW allowlist', 'IFW · CASB · DLP']});
      s += nd(X[3], Y, W, H, {t: 'DEPLOY', s: ['monitor · log only', 'no blocking'], cls: 'dash'});
      s += nd(X[4], Y, W, H, {t: 'ENFORCE', s: ['flip to block', 'rule by rule'], cls: 'pop'});
      s += mark(X[4] + W - 4, Y + 4, 'ok');

      s += fl(`M${X[0] + W} ${MID}H${X[1] - 2}`, 'fl-flow', {dur: 1.2, arrow: 'arr-n'});
      s += fl(`M${X[1] + W} ${MID}H${X[2] - 2}`, 'fl-flow', {dur: 1.2, arrow: 'arr-n'});
      s += fl(`M${X[2] + W} ${MID}H${X[3] - 2}`, 'fl-flow', {dur: 1.2, arrow: 'arr-n'});
      s += fl(`M${X[3] + W} ${MID}H${X[4] - 2}`, 'fl-ha', {dur: 1.4, arrow: 'arr-y'});

      /* ---- discard branch: dead rules never reach CMA ---- */
      const RX = X[1] + 34;
      s += fl(`M${RX} ${Y + H}V348`, 'fl-down', {np: 0});
      s += xmark(RX, 312);
      s += nd(14, 348, 216, 58, {t: 'Dead rules discarded', s: ['zero-hit ACEs · stale lists', 'never translated'], cls: 'dash'});

      /* ---- evidence loop: events from deploy and enforce feed back ---- */
      const EY = 348;
      s += side(X[3], EY, X[4] + W - X[3], 58, 'Events & hit counts', 'Monitor → Events · per rule', 'chart');
      s += fl(`M${X[3] + 64} ${Y + H}V${EY - 2}`, 'fl-net', {dur: 1.6, arrow: 'arr-n'});
      s += fl(`M${X[4] + 64} ${Y + H}V${EY - 2}`, 'fl-net', {dur: 1.6, arrow: 'arr-n'});
      s += pill(603, 287, 'monitor → block', 'y');
      s += fl(`M${X[3]} ${EY + 29}H${X[1] + 104}V${Y + H + 2}`, 'fl-net', {dur: 2, arrow: 'arr-n'});
      s += pill(370, EY + 29, 'OPTIMISE loop', 'y');

      /* ---- the semantic traps that change in translation ---- */
      s += tier(14, 446, 'WHAT CHANGES IN TRANSLATION');
      const notes = [
        [14, 472, 'hitcnt is the evidence', 'show access-list expands object-groups'],
        [390, 472, 'Egress-IP identities break', 'per-site web policy moves at Socket swap'],
        [14, 522, 'NAT does not travel', 'inbound publishing → remote port forwarding'],
        [390, 522, 'Warn → Prompt', 'user can proceed · event logged'],
      ];
      notes.forEach(([x, y, t, sub]) => { s += mark(x + 8, y - 4, 'warn') + T(x + 24, y, t, 'nd-t') + T(x + 24, y + 16, sub, 'f-s'); });
      return s;
    },
    title: 'Cisco policy conversion pipeline',
    desc: 'The four-phase pipeline applied to every Cisco policy domain: export each rule base, rationalise on hit counts, map the survivors to CMA constructs, deploy in monitor mode and enforce only once events and hit counts prove parity.',
    legend: [['flow', 'Policy through the pipeline'], ['ha', 'Promotion — monitor to block, per rule, on event evidence'], ['down', 'Discarded at rationalisation — never reaches CMA'], ['net', 'Events and hit counts — evidence for promotion']],
  }],
});
