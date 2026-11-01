/* specs/migration-edgeconnect-policy.js — HPE Aruba EdgeConnect policy migration to Cato */
DG.page('migration-edgeconnect-policy', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'mgmt'],
    mods: ['sdwan', 'sse'],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'eg-www'}, {p: 'eg-saas'}, {p: 'm1'}],
    steps: [
      {t: 'Orchestrator backups and templates export overlays and zone rules; the chained SSE tenant exports web policy.', marks: ['mgmt']},
      {t: 'Up to seven overlays collapse into three or four intents, then map to network rules, bandwidth and firewall.', marks: ['mgmt']},
      {t: 'The PoP enforces the converted policy for every site and user, deployed in monitor mode first.', marks: ['pop', 'branch', 'users']},
      {t: 'Events and hit counts prove each rule before it is promoted from monitor to block.', marks: ['pop']},
    ],
    anchors: {mgmt: [782, 132]},   // steps 1·2 marker clear of the CMA subtitle
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, side, tier, mark, xmark} = K;
      let s = '';

      /* ---- top band: the four EdgeConnect policy domains ---- */
      s += tier(14, 34, 'EDGECONNECT POLICY DOMAINS');
      /* fan-in: overlays, zone firewall and SWG feed EXPORT */
      s += fl('M100 110V223', 'fl-flow', {np: 0, arrow: true});
      s += fl('M286 110V156Q286 166 276 166H110Q100 166 100 176', 'fl-flow', {np: 0});
      s += fl('M472 110V156Q472 166 462 166H110Q100 166 100 176', 'fl-flow', {np: 0});
      /* greenfield lane: CASB / DLP skip export and translation, not monitor-first */
      s += fl('M700 110V178Q700 188 690 188H588Q578 188 578 198V223', 'fl-ha', {arrow: 'arr-y', dur: 1.6});
      s += nd(14, 50, 172, 60, {t: 'Intent overlays — up to 7', s: ['topology, QoS, breakout']});
      s += nd(200, 50, 172, 60, {t: 'Zone firewall + IDPS', s: ['Orchestrator rulebase']});
      s += nd(386, 50, 172, 60, {t: 'SWG — in SSE tenant', s: ['Zscaler · Netskope · HPE']});
      s += nd(572, 50, 172, 60, {t: 'CASB / DLP — none', s: ['greenfield builds'], cls: 'dash'});
      s += T(482, 138, 'SSE CONSOLE, NOT ORCHESTRATOR', 'f-m');
      s += T(692, 162, 'discovery inputs', 'f-s', 'end');
      s += T(692, 176, 'best-practice build', 'f-s', 'end');

      /* ---- the pipeline, left to right ---- */
      s += tier(14, 216, '1 · EXPORT');
      s += tier(164, 216, '2 · REVIEW & MAP');
      s += tier(464, 216, '3 · DEPLOY');
      const Y = 226, H = 64, W = 128;
      s += nd(14, Y, W, H, {t: 'EXPORT', s: ['Orchestrator backup', 'SSE tenant export']});
      s += nd(164, Y, W, H, {t: 'CLEAN-UP', s: ['collapse overlays', '≤ 7 BIOs → 3–4 intents'], cls: 'hot'});
      s += nd(314, Y, W, H, {t: 'MAP TO CMA', s: ['net rules · BW', 'WAN / Internet FW']});
      s += nd(464, Y, W, H, {t: 'DEPLOY', s: ['monitor mode', "watch, don't block"], cls: 'dash'});
      s += nd(614, Y, W, H, {t: 'ENFORCE', s: ['block or shape', 'on event evidence'], cls: 'pop'});
      s += mark(728, 240, 'ok');

      const MY = Y + H / 2;
      s += fl(`M142 ${MY}H161`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M292 ${MY}H311`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M442 ${MY}H461`, 'fl-flow', {arrow: true, dur: 0.8});
      s += fl(`M592 ${MY}H611`, 'fl-ha', {arrow: 'arr-y', dur: 0.8});
      s += pill(603, 312, 'amber → green on evidence', 'y');
      s += pill(378, 312, 'one BIO → rule + BW profile', '');

      /* ---- discard branch: nothing leaves it ---- */
      s += fl('M196 290C196 336 100 330 96 382', 'fl-down', {np: 0});
      s += xmark(146, 330);
      s += nd(14, 382, 168, 58, {t: 'Discarded', s: ['dead rules · duplicates', 'spare overlays'], cls: 'dash'});

      /* ---- evidence loop: optimise ---- */
      s += fl('M492 290C492 350 540 362 548 398', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += fl('M712 290C712 350 700 362 692 398', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += side(520, 400, 200, 58, 'Events & hit counts', 'Monitor → Events', 'chart');
      s += fl('M520 429C390 429 244 392 244 292', 'fl-net', {np: 0, arrow: 'arr-n', label: '4 · OPTIMISE loop', lx: 352, ly: 400, lcls: 'm'});

      /* ---- footnotes: the carry-over facts ---- */
      s += T(380, 496, 'BIO QoS priority → bandwidth profile: P10 real-time · P20 business-critical · P255 default', 'f-s', 'middle');
      s += T(380, 516, 'Boost-dependent flows are re-baselined, not translated · no service chain is rebuilt', 'f-s', 'middle');
      s += T(380, 536, 'CASB / DLP inputs: First-Packet iQ app statistics and a data-protection workshop', 'f-s', 'middle');
      return s;
    },
    title: 'EdgeConnect policy pipeline — overlays to intent',
    desc: 'The four EdgeConnect policy domains ride one pipeline: Orchestrator and SSE-tenant exports, a clean-up where up to seven overlays collapse into their genuine intents and dead rules are cut, mapping to CMA constructs, monitor-mode deployment and promotion on evidence; the greenfield CASB and DLP domains skip translation, not monitor-first.',
    legend: [['flow', 'Surviving intent — exported, cleaned up and mapped'], ['ha', 'Monitor-first — greenfield CASB / DLP join here'], ['down', 'Discarded at clean-up — never reaches CMA'], ['net', 'Events and hit counts — evidence for promotion']],
  }],
});
