/* specs/migration-cloudflare-policy.js — Cloudflare Zero Trust policy migration to Cato */
DG.page('migration-cloudflare-policy', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'mgmt'],
    mods: ['sse'],
    anchors: {mgmt: [782, 132]},   // step markers clear of the CMA subtitle
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'eg-www'}, {p: 'eg-saas'}, {p: 'm1'}],
    steps: [
      {t: 'Gateway, Magic Firewall and DLP rules export to HCL with hit counts; dead rules go; CASB feeds discovery.', marks: ['mgmt']},
      {t: 'Survivors map to WAN/Internet Firewall, RBI Isolate, Tenant Restrictions, Data Control and TLS exceptions.', marks: ['mgmt']},
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

      /* ---- top band: the four Cloudflare Zero Trust policy domains in scope ---- */
      s += tier(14, 34, 'CLOUDFLARE ZERO TRUST POLICY DOMAINS · EXPORT SCOPE');
      const DOM = [
        [14, 'FW rules', 'Gateway net · Magic FW'],
        [200, 'SWG policy', 'Gateway HTTP · DNS'],
        [386, 'CASB posture', 'API findings · Shadow IT'],
        [572, 'DLP profiles', 'Gateway DLP (add-on)'],
      ];
      /* fan-in: each domain drops to one bus that feeds EXPORT */
      DOM.forEach(([x]) => {
        const cx = x + 86;
        s += fl(cx === 100 ? 'M100 110V226' : `M${cx} 110V156Q${cx} 166 ${cx - 10} 166H110Q100 166 100 176`, 'fl-flow', {np: 0, arrow: cx === 100});
      });
      DOM.forEach(([x, t, sub]) => { s += nd(x, 50, 172, 60, {t, s: [sub]}); });
      s += pill(565, 138, 'add-ons: DLP · Isolation', 'm');

      /* ---- the pipeline: phases 1–4, left to right ---- */
      s += tier(14, 216, '1 · EXPORT');
      s += tier(164, 216, '2 · REVIEW & MAP');
      s += tier(464, 216, '3 · DEPLOY');
      s += tier(614, 216, '4 · OPTIMISE');
      const Y = 226, H = 64, W = 128;
      s += nd(14, Y, W, H, {t: 'EXPORT', s: ['cf-terraforming', '→ HCL + hit counts']});
      s += nd(164, Y, W, H, {t: 'RATIONALISE', s: ['0-hit & shadowed out'], cls: 'hot'});
      s += nd(314, Y, W, H, {t: 'MAP TO CMA', s: ['WAN FW · Internet FW', 'App Control · DLP']});
      s += nd(464, Y, W, H, {t: 'DEPLOY', s: ['monitor mode first', 'no user impact'], cls: 'dash'});
      s += nd(614, Y, W, H, {t: 'ENFORCE', s: ['flip to block', 'one rule at a time'], cls: 'pop'});
      s += mark(728, 240, 'ok');

      const MY = Y + H / 2;
      s += fl(`M142 ${MY}H161`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M292 ${MY}H311`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M442 ${MY}H461`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M592 ${MY}H611`, 'fl-ha', {arrow: 'arr-y', np: 0});
      s += pill(603, 312, 'monitor → block', 'y');
      s += pill(378, 312, 'Isolate → RBI action', 'p');

      /* ---- discard branch: nothing leaves it ---- */
      s += fl('M200 290C200 336 100 330 96 382', 'fl-down', {np: 0});
      s += xmark(148, 330);
      s += nd(14, 382, 168, 58, {t: 'Discarded', s: ['zero-hit · shadowed', 'never translated'], cls: 'dash'});

      /* ---- evidence loop: rules that never fire are pruned ---- */
      s += fl('M528 290C528 352 580 360 590 398', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += fl('M678 290C678 352 660 360 650 398', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += side(520, 400, 200, 58, 'Events & hit counts', 'Monitor → Events', 'chart');
      s += fl('M520 429C390 429 262 392 262 292', 'fl-net', {np: 0, arrow: 'arr-n', label: 'prune rules that never fire', lx: 342, ly: 396, lcls: 'm'});

      /* ---- footnotes: the carry-over facts ---- */
      s += T(380, 500, 'Gateway DNS · network · HTTP + Magic Firewall → one converged CMA policy model', 'f-s', 'middle');
      s += T(380, 520, 'Out of scope — stays on Cloudflare: WAF, CDN and redirect rules · authoritative DNS', 'f-s', 'middle');
      return s;
    },
    title: 'Cloudflare Zero Trust policy pipeline',
    desc: 'Each Cloudflare Zero Trust policy domain is exported with hit counts, stripped of dead rules, mapped to CMA constructs, deployed in monitor and enforced only when events and hit counts prove the translation.',
    legend: [['flow', 'Policy pipeline — export → rationalise → map → deploy'], ['ha', 'Promotion from monitor to block — on evidence'], ['down', 'Discarded at rationalisation — never reaches CMA'], ['net', 'Events and hit counts — evidence for promotion and clean-up']],
  }],
});
