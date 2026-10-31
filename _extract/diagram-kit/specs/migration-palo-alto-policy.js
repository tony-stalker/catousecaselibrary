/* specs/migration-palo-alto-policy.js — Palo Alto policy migration (PAN-OS policy conversion pipeline) */
DG.page('migration-palo-alto-policy', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'mgmt'],
    mods: ['sse'],
    anchors: {mgmt: [782, 132]},   // markers clear of the CMA subtitle
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'eg-www'}, {p: 'eg-saas'}, {p: 'm1'}],
    steps: [
      {t: 'Export the Panorama rulebase and profiles with hit counts; cull zero-hit, shadowed and disabled rules.', marks: ['mgmt']},
      {t: 'Zones become rule placement: internet-bound rules on the Internet Firewall, east-west on the WAN Firewall, local flows on the Socket LAN Firewall.', marks: ['mgmt']},
      {t: 'The PoP applies the translated rules to every site and user, first in monitor mode with event tracking.', marks: ['pop', 'branch', 'users']},
      {t: 'Events and hit counts prove each rule before it is tightened from monitor to block.', marks: ['pop']},
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

      /* ---- top: the four PAN-OS policy domains ---- */
      s += tier(14, 20, 'PAN-OS POLICY DOMAINS');
      const DX = [14, 202, 390, 578];
      const doms = [['FW rulebase', 'App-ID · zones', 'firewall'], ['URL Filtering', 'category profiles', 'globe'],
                    ['SaaS Security', 'inline · API', 'shield'], ['Enterprise DLP', 'data profiles', 'file']];
      doms.forEach(([t, sub, ic], i) => { s += nd(DX[i], 30, 168, 52, {t, s: [sub], ic, is: 20, icls: 'g', cls: 'soft'}); });

      /* fan-in: every domain drops onto one bus that enters EXPORT */
      DX.forEach(x => { s += fl(`M${x + 84} 82V102`, 'fl-flow', {np: 0}); });
      s += fl(`M${DX[3] + 84} 102H76V${BY}`, 'fl-flow', {dur: 2.2, arrow: 'arr-n'});
      s += pill(380, 102, 'one pipeline', 'm');

      /* ---- the Cato side: rebuilt in CMA ---- */
      s += popBox(302, 112, 436, 144, 'Cato Management Application', 'one single-pass policy model');

      /* ---- pipeline row ---- */
      s += nd(X[0], BY, BW, BH, {t: 'EXPORT', s: ['Panorama CSV · XML', 'set-format CLI', '+ hit counts']});
      s += nd(X[1], BY, BW, BH, {t: 'RATIONALISE', s: ['cull on hit counts', 'collapse duplicates'], cls: 'hot'});
      s += nd(X[2], BY, BW, BH, {t: 'MAP TO CMA', s: ['WAN · Internet · LAN', 'firewalls · CASB', 'DLP · TLSi']});
      s += nd(X[3], BY, BW, BH, {t: 'DEPLOY', s: ['monitor mode first', 'allow + track events']});
      s += nd(X[4], BY, BW, BH, {t: 'ENFORCE', s: ['tighten to block', 'rule by rule'], cls: 'pop'});
      s += mark(X[4] + BW - 4, BY + 4, 'ok');

      s += fl(`M${X[0] + BW} ${MID}H${X[1]}`, 'fl-flow', {dur: 1.2, arrow: 'arr-n'});
      s += fl(`M${X[1] + BW} ${MID}H${X[2]}`, 'fl-flow', {dur: 1.2, arrow: 'arr-n'});
      s += fl(`M${X[2] + BW} ${MID}H${X[3]}`, 'fl-flow', {dur: 1.2, arrow: 'arr-n'});
      s += fl(`M${X[3] + BW} ${MID}H${X[4]}`, 'fl-ha', {dur: 1.4, arrow: 'arr-y'});

      /* ---- discard branch: dead rules never reach CMA ---- */
      const RX = X[1] + 36;
      s += fl(`M${RX} ${BY + BH}V318`, 'fl-down', {np: 0});
      s += xmark(RX, 284);
      s += nd(14, 318, 224, 58, {t: 'Dead rules discarded', s: ['zero-hit · shadowed · disabled', 'never reaches CMA'], cls: 'dash'});

      /* ---- evidence loop: events from deploy and enforce feed back ---- */
      s += side(X[3], 318, X[4] + BW - X[3], 58, 'Events & hit counts', 'Monitor → Events · per rule', 'chart');
      s += fl(`M${X[3] + 62} ${BY + BH}V318`, 'fl-net', {dur: 1.6, arrow: 'arr-n'});
      s += fl(`M${X[4] + 62} ${BY + BH}V318`, 'fl-net', {dur: 1.6, arrow: 'arr-n'});
      s += fl(`M${X[3]} 347H${X[1] + 104}V${BY + BH + 2}`, 'fl-net', {dur: 2, arrow: 'arr-n'});
      s += pill(352, 347, 'OPTIMISE loop', 'y');
      s += T(352, 372, 'events are the new hit counts', 'f-s', 'middle');

      /* ---- what does not carry over ---- */
      s += tier(14, 420, 'WHAT DOES NOT CARRY OVER');
      const notes = [
        [14, 446, 'No conversion tool', 'Expedition reached EOL on 31 Dec 2024'],
        [390, 446, 'application-default', 'standard ports re-pinned explicitly per rule'],
        [14, 496, 'Security profile groups', 'account-level IPS · NGAM — duplicates collapse'],
        [390, 496, 'TLS Inspection', 'rebuilt, not ported · Android not by default'],
      ];
      notes.forEach(([x, y, t, sub]) => { s += mark(x + 8, y - 4, 'warn') + T(x + 24, y, t, 'nd-t') + T(x + 24, y + 16, sub, 'f-s'); });
      return s;
    },
    title: 'PAN-OS policy conversion pipeline',
    desc: 'Every PAN-OS policy domain runs the same pipeline — export with usage data, rationalise on hit counts, map to the WAN and Internet Firewalls, CASB, DLP and TLS Inspection, deploy monitor-first and enforce on evidence.',
    legend: [['ha', 'Monitor-first deployment — log, don\'t block'], ['down', 'Discarded at rationalisation — never reaches CMA'], ['flow', 'Policy through the pipeline'], ['net', 'Evidence loop — events feed the next review']],
  }],
});
