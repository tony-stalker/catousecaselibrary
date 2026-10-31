/* specs/migration-netskope-policy.js — Netskope Policy Migration */
DG.page('migration-netskope-policy', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'mgmt'],
    mods: ['sse'],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'eg-www'}, {p: 'eg-saas'}, {p: 'm1'}],
    steps: [
      {t: 'Export each Netskope domain, then discard dead, duplicate and shadowed rules on usage evidence.', marks: ['mgmt']},
      {t: 'Survivors map by intent to Internet Firewall, App Control, Tenant Restrictions and Data Control.', marks: ['mgmt2']},
      {t: 'The PoP runs the converted rulebase monitor-first for every site and user, with no user impact.', marks: ['pop', 'branch', 'users']},
      {t: 'Events and hit counts prove each rule before it flips from monitor to block.', marks: ['pop4']},
    ],
    // one circle per step (shared anchors would draw a pill the theme CSS leaves unfilled): steps 1 and 2 side by side on the
    // CMA box's top edge, clear of its subtitle; step 4 beside step 3 on the PoP, clear of the 'Cato PoP' label
    anchors: {mgmt: [764, 132], mgmt2: [800, 132], pop: [856, 334], pop4: [892, 334]},
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, tier, side, xmark, mark} = K;
      let s = '';

      /* ---- top: the four Netskope policy domains ---- */
      s += tier(14, 24, 'NETSKOPE POLICY DOMAINS');
      const D = [
        ['Cloud Firewall', 'egress port & protocol'],
        ['Real-time Protection', 'web categories · threats'],
        ['Inline CASB', 'activities · instances'],
        ['DLP profiles', 'EDM · ML classifiers'],
      ];
      const JX = 124;                                   /* the export bus drops into EXPORT here */
      D.forEach(([t, sub], i) => {
        const x = 14 + i * 186, cx = x + 87;
        s += nd(x, 34, 174, 54, {t, s: [sub]});
        const turn = cx < JX ? `Q${cx} 120 ${cx + 8} 120H${JX - 8}` : `Q${cx} 120 ${cx - 8} 120H${JX + 8}`;
        s += fl(`M${cx} 88V112${turn}Q${JX} 120 ${JX} 128V166`, 'fl-flow', {np: 0, arrow: i === 3 ? 'arr-m' : false});
      });

      /* ---- the pipeline: Export → Review & Map → Deploy → Optimise ---- */
      const Y = 168, H = 70, W = 128, X = [14, 165, 316, 467, 618], CY = Y + H / 2;
      s += tier(14, 158, '1 · EXPORT');
      s += tier(165, 158, '2 · REVIEW & MAP');
      s += tier(467, 158, '3 · DEPLOY');
      s += tier(618, 158, '4 · OPTIMISE');
      s += nd(X[0], Y, W, H, {t: 'EXPORT', s: ['console +', 'REST API v2']});
      s += nd(X[1], Y, W, H, {t: 'RATIONALISE', s: ['dedupe · hit counts', 'clean-up filter'], cls: 'hot'});
      s += nd(X[2], Y, W, H, {t: 'MAP TO CMA', s: ['IFW · CASB · DLP', 'mapped by intent']});
      s += nd(X[3], Y, W, H, {t: 'MONITOR', s: ['log only', 'no user impact']});
      s += nd(X[4], Y, W, H, {t: 'ENFORCE', s: ['flip to block', 'rule by rule'], cls: 'pop'});
      s += mark(X[4] + W - 14, Y + 14, 'ok');

      s += fl(`M${X[0] + W} ${CY}H${X[1]}`, 'fl-flow', {arrow: 'arr-m', dur: 1.2});
      s += fl(`M${X[1] + W} ${CY}H${X[2]}`, 'fl-flow', {arrow: 'arr-m', dur: 1.2});
      s += fl(`M${X[2] + W} ${CY}H${X[3]}`, 'fl-ha', {arrow: 'arr-y', dur: 1.4});
      s += fl(`M${X[3] + W} ${CY}H${X[4]}`, 'fl-hot', {arrow: 'arr-ms', dur: 1.2});
      s += pill(X[4] - 11, Y + H + 18, 'flip on proof', 'g');

      /* ---- discard branch: nothing leaves it ---- */
      const DX = 200;
      s += fl(`M${DX} ${Y + H}V300`, 'fl-down', {np: 0});
      s += xmark(DX, 270);
      s += nd(95, 300, 170, 52, {t: 'Rules discarded', s: ['dead · duplicate · shadowed'], cls: 'dash'});

      /* ---- evidence loop: events gate every flip ---- */
      s += side(467, 330, 279, 52, 'Events & hit counts', 'Monitor → Events · hit parity', 'chart');
      s += fl(`M${X[3] + 64} ${Y + H}V330`, 'fl-flow fl-dim', {arrow: 'arr-m', dur: 1.6});
      s += fl(`M${X[4] + 64} ${Y + H}V330`, 'fl-flow fl-dim', {arrow: 'arr-m', dur: 1.6});
      s += fl(`M467 356H296Q282 356 282 342V${Y + H + 2}`, 'fl-flow fl-dim', {arrow: 'arr-m', dur: 2.2, label: 'OPTIMISE loop', lx: 382, ly: 356, lcls: 'm'});

      /* ---- what does not travel as-is ---- */
      s += tier(14, 428, 'TRANSLATION NOTES');
      const N = [
        [14, 452, 'info', 'Stage TLS first · do-not-decrypt list seeds bypasses'],
        [14, 480, 'warn', 'User Alert → Prompt: no justification capture'],
        [390, 452, 'warn', 'EDM rebuilt from source · OCR not on EDM'],
        [390, 480, 'info', 'API Data Protection keeps running · retired last'],
      ];
      N.forEach(([x, y, k, t]) => { s += mark(x + 8, y - 4, k) + T(x + 24, y, t, 'f-s'); });
      s += T(380, 530, 'Never lift-and-shift: only rationalised, evidence-backed rules are mapped', 'f-m', 'middle');
      return s;
    },
    title: 'Netskope policy conversion pipeline',
    desc: 'The four-phase PS pipeline applied to a Netskope estate: export each domain, rationalise on usage evidence, map the survivors to CMA constructs, deploy monitor-first and let events and hit counts gate the flip to enforcement.',
    legend: [
      ['flow', 'Policy pipeline and evidence loop — export, map, prove'],
      ['ha', "Monitor-first deployment — log, don't block"],
      ['hot', 'Enforced — promoted on event evidence'],
      ['down', 'Discarded at rationalisation — never reaches CMA'],
    ],
  }],
});
