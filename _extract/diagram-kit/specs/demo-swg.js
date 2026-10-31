/* specs/demo-swg.js — Demo Segment: Secure Web Gateway */
DG.page('demo-swg', {
  spotlight: {
    hl: ['users', 'branch', 'pop', 'saas', 'mgmt'],
    mods: ['sse'],
    flows: [{p: 'us1'}, {p: 'br1'}, {p: 'eg-www'}, {p: 'eg-saas'}, {p: 'm1'}],
    steps: [
      {t: 'A remote user on the Cato Client and the Bristol Office behind its Socket both reach the nearest PoP.', marks: ['users', 'branch']},
      {t: 'The Internet Firewall matches user, application or category top-down; staged TLS inspection makes it exact.', marks: ['pop']},
      {t: 'The verdict is Allow, Prompt or Block, and every match is an event with user, rule and action.', marks: ['saas', 'mgmt']},
    ],
    anchors: {mgmt: [782, 132], saas: [302, 310]},   // step-3 markers clear of the CMA and "Smart egress" subtitles
  },
  diagrams: [{
    slot: 'main',
    draw: K => {
      const {nd, site, popBox, ring, fl, T, tier, badge, pill, mark, xmark} = K;
      let s = '';
      /* ---- section labels: who, should they, where ---- */
      s += tier(20, 52, 'WHO · SOURCES') + tier(240, 52, 'SHOULD THEY · ONE PASS') + tier(570, 52, 'WHERE · VERDICT');

      /* ---- the backbone the PoP sits on (drawn first, so the PoP covers its back) ---- */
      s += ring({cx: 375, cy: 438, rx: 120, ry: 28});
      s += T(375, 492, 'Global Private Backbone', 'f-h', 'middle');

      /* ---- left: the two origins ---- */
      s += nd(20, 140, 170, 56, {t: 'Priya — Cato Client', s: ['Home broadband'], ic: 'laptop', is: 20, icls: 'g'});
      s += site(20, 290, 170, 120, 'Bristol Office');
      s += nd(34, 320, 142, 56, {t: 'X1500 Socket', s: ['office users'], ic: 'building', is: 20, icls: 'g'});

      /* ---- centre: the nearest PoP and its single-pass engine ---- */
      s += popBox(240, 70, 270, 340, 'Cato PoP — London', 'nearest PoP · same policy');
      s += tier(256, 128, 'SINGLE-PASS ENGINE');
      s += nd(262, 146, 226, 60, {t: 'TLS inspection', s: ['staged by category']});
      s += fl('M375 206L375 234', 'fl-flow', {np: 0, arrow: 'arr-m'});
      s += nd(262, 236, 226, 60, {t: 'Internet Firewall', s: ['who · where · action']});
      s += badge(262, 146, '1') + badge(262, 236, '2');
      s += pill(375, 326, 'Allow · Prompt · Block', 'm');
      s += T(375, 360, 'first match wins, top-down', 'f-s', 'middle');
      s += T(375, 376, 'every verdict is an event', 'f-s', 'middle');

      /* ---- both origins converge on the same engine (stage 1) ---- */
      s += fl('M190 168C224 168 230 172 262 172', 'fl-tun', {dur: 1});
      s += fl('M176 348C222 348 224 186 262 186', 'fl-tun', {dur: 1.3});

      /* ---- right: one destination per verdict ---- */
      s += fl('M488 254C530 254 530 160 570 160', 'fl-flow', {dur: 1.1, arrow: 'arr-m', label: 'Allow', lx: 538, ly: 206, lcls: 'g keep'});
      s += fl('M488 266L570 266', 'fl-ha', {dur: 1.1, arrow: 'arr-y', label: 'Prompt', lx: 538, ly: 247, lcls: 'y keep'});
      s += fl('M488 278C530 278 516 372 537 372', 'fl-flow fl-down', {np: 0, label: 'Block', lx: 538, ly: 322, lcls: 'r keep'});
      s += xmark(548, 372);
      s += nd(570, 130, 176, 60, {t: 'Business SaaS', s: ['Allow — category rule'], ic: 'chat', is: 20, icls: 'g'});
      s += nd(570, 236, 176, 60, {t: 'Social media', s: ['Prompt — user decides'], ic: 'users', is: 20, icls: 'g'});
      s += nd(570, 342, 176, 60, {t: 'Gambling', s: ['Block — risky category'], ic: 'globe', is: 20, icls: 'g'});
      s += mark(746, 130, 'ok') + mark(746, 236, 'warn');

      /* ---- the record: every verdict lands in Monitor → Events ---- */
      s += fl('M510 360C552 360 540 498 566 498', 'fl-flow fl-dim', {dur: 1.6, arrow: 'arr-n', label: 'every verdict', lx: 560, ly: 444, lcls: 'm keep'});
      s += nd(570, 470, 176, 56, {t: 'Monitor → Events', s: ['user · rule · action'], ic: 'console', is: 20, icls: 'g', cls: 'soft'});
      return s;
    },
    vb: '0 0 760 560',
    title: 'Who, where, should they — in one pass',
    desc: 'A remote Client user and a branch Socket site hit the same single-pass engine at the nearest PoP, where staged TLS inspection feeds a user- and category-aware Internet Firewall whose Allow, Prompt or Block verdict is recorded as an event.',
    legend: [['tun', 'Client and Socket tunnels to the PoP'], ['flow', 'Allowed'], ['ha', 'Prompt — user acknowledges'], ['down', 'Blocked'], ['dim', 'Event written for every verdict']],
  }],
});
