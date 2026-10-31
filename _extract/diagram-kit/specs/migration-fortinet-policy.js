/* specs/migration-fortinet-policy.js — Fortinet (FortiOS) policy migration to Cato */
DG.page('migration-fortinet-policy', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'mgmt'],
    mods: ['sse'],
    anchors: {mgmt: [782, 132]},   // step 1·2 marker on the CMA top edge, clear of its subtitle and the XOps index
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'eg-www'}, {p: 'eg-saas'}, {p: 'm1'}],
    steps: [
      {t: 'FortiOS policies, UTM profile pairs, webfilter, CASB and DLP export as flat text and are culled on hit counts.', marks: ['mgmt']},
      {t: 'Profile pairs become layers in CMA: firewall rules, account-level IPS/NGAM and a TLS Inspection rule.', marks: ['mgmt']},
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

      /* ---- top band: the four FortiOS policy domains in the export scope ---- */
      s += tier(14, 34, 'FORTIOS POLICY DOMAINS · EXPORT SCOPE');
      const DOM = [
        [14, 'FW policies', '+ UTM profile pairs'],
        [200, 'Webfilter profiles', 'FortiGuard categories'],
        [386, 'Inline CASB', 'SaaS app controls'],
        [572, 'DLP profiles', 'sensors · dictionaries'],
      ];
      /* fan-in: each domain drops to one bus that feeds EXPORT */
      DOM.forEach(([x]) => {
        const cx = x + 86;
        s += fl(cx === 100 ? 'M100 110V223' : `M${cx} 110V156Q${cx} 166 ${cx - 10} 166H110Q100 166 100 176`, 'fl-flow', {np: 0, arrow: cx === 100});
      });
      DOM.forEach(([x, t, sub]) => { s += nd(x, 50, 172, 60, {t, s: [sub]}); });
      s += pill(660, 32, 'per-VDOM · FMG ADOMs', 'm');

      /* ---- the pipeline: phases 1–3, left to right ---- */
      s += tier(14, 216, '1 · EXPORT');
      s += tier(164, 216, '2 · REVIEW & MAP');
      s += tier(464, 216, '3 · DEPLOY');
      const Y = 226, H = 64, W = 128;
      s += nd(14, Y, W, H, {t: 'EXPORT', s: ['full-config backup', 'FMG packages']});
      s += nd(164, Y, W, H, {t: 'RATIONALISE', s: ['cull on hit counts'], cls: 'hot'});
      s += nd(314, Y, W, H, {t: 'MAP TO CMA', s: ['UTM pairs → layers', 'objects, then rules']});
      s += nd(464, Y, W, H, {t: 'DEPLOY', s: ['monitor action', 'no user impact'], cls: 'dash'});
      s += nd(614, Y, W, H, {t: 'ENFORCE', s: ['flip to block', 'one rule at a time'], cls: 'pop'});
      s += mark(728, 240, 'ok');

      const MY = Y + H / 2;
      s += fl(`M142 ${MY}H161`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M292 ${MY}H311`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M442 ${MY}H461`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M592 ${MY}H611`, 'fl-ha', {arrow: 'arr-y', dur: 0.8});
      s += pill(640, 210, 'amber → green on evidence', 'y');   // above DEPLOY→ENFORCE, clear of the evidence lines
      s += pill(378, 312, 'interface pairs → scopes', '');

      /* ---- discard branch: nothing leaves it ---- */
      s += fl('M200 290C200 336 100 330 96 382', 'fl-down', {np: 0});
      s += xmark(148, 330);
      s += nd(14, 382, 168, 58, {t: 'Discarded', s: ['zero-hit · any-any debt', 'never translated'], cls: 'dash'});

      /* ---- evidence loop: phase 4, optimise ---- */
      s += fl('M528 290C528 352 580 360 590 398', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += fl('M678 290C678 352 660 360 650 398', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += side(520, 400, 200, 58, 'Events & hit counts', 'Monitor → Events', 'chart');
      s += fl('M520 429C390 429 262 392 262 292', 'fl-net', {np: 0, arrow: 'arr-n', label: '4 · OPTIMISE loop', lx: 342, ly: 396, lcls: 'm'});

      /* ---- footnotes: the carry-over facts ---- */
      s += T(380, 500, 'execute backup full-config exports flat text · objects first via GraphQL API or Terraform, then rules', 'f-s', 'middle');
      s += T(380, 520, 'Webfilter warn / continue → Prompt action · browsing quotas have no Cato construct', 'f-s', 'middle');
      return s;
    },
    title: 'FortiOS policy conversion pipeline',
    desc: 'The four FortiOS policy domains are exported once, rationalised against hit-count evidence, and only surviving intent is mapped to CMA constructs; every mapped rule deploys in monitor and is promoted to enforcement when events prove it.',
    legend: [['flow', 'Surviving rules — exported, reviewed and mapped'], ['ha', 'Monitor-first deployment — log, don\'t block'], ['down', 'Discarded at rationalisation — never reaches CMA'], ['net', 'Events and hit counts — evidence for promotion and clean-up']],
  }],
});
