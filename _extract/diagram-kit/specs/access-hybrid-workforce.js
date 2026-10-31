/* specs/access-hybrid-workforce.js — Securing the Hybrid Workforce */
DG.page('access-hybrid-workforce', {
  spotlight: {
    hl: ['users', 'branch', 'pop', 'backbone', 'dc', 'saas'],
    mods: ['uztna', 'sse'],
    anchors: {saas: [302, 310]},           // step-3 marker clear of the SaaS subtitle
    flows: [{p: 'us1'}, {p: 'br1'}, {p: 'r-LC'}, {p: 'dc1', rev: true}, {p: 'eg-saas'}],
    steps: [
      {t: 'From home or a hotel the always-on Cato Client reaches the nearest PoP; sign-in is MFA/SSO via the IdP.', marks: ['users']},
      {t: 'At the office desk the Client detects the Cato Socket and switches to office mode; the same rule base applies.', marks: ['branch']},
      {t: 'Every path gets the full single-pass stack at the PoP; Microsoft 365 and SaaS egress locally.', marks: ['pop', 'saas']},
      {t: 'Private apps behind the London DC Socket are reached over the backbone, with no VPN concentrator.', marks: ['dc']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, tier, pill, ring, fpin, chipRow, L, R} = K;
      let s = '';
      /* headline verdict */
      s += pill(430, 22, 'One identity-driven policy — written once', 'g');
      /* the same person, three chairs */
      s += tier(14, 30, 'ONE USER · PRIYA · THREE CHAIRS');
      s += nd(14, 40, 186, 56, {t: 'Office · London', s: ['site Socket · office mode'], ic: 'building', is: 20, icls: 'g'});
      s += nd(14, 190, 186, 56, {t: 'Home · Reading', s: ['Cato Client · always-on'], ic: 'laptop', is: 20, icls: 'g'});
      s += nd(14, 380, 186, 56, {t: 'Hotel · Dubai', s: ['Cato Client · always-on'], ic: 'phone', is: 20, icls: 'g'});
      /* what went away */
      s += `<g style="opacity:.55">${nd(14, 480, 186, 50, {t: 'VPN concentrator', s: ['retired · no backhaul'], ic: 'server', is: 20, cls: 'soft'})}</g>`;
      s += `<path d="${L(24, 505, 190, 505)}" style="stroke:var(--ink-3);stroke-width:2;stroke-linecap:round"/>`;
      /* the backbone with two PoPs: London on the back, Dubai on the front */
      const RG = {cx: 430, cy: 280, rx: 150, ry: 66};
      s += ring(RG);
      s += T(405, 288, 'GLOBAL PRIVATE BACKBONE', 'tier', 'middle');
      /* Dubai → London backbone hop, over the top of the ring */
      s += fl('M530 329A150 66 0 0 0 360 222', 'fl-flow', {arrow: 'arr-m', dur: 2.2});
      /* London PoP */
      s += fpin(360, 222, 24, 'PoP', {halo: true});
      s += T(345, 124, 'London PoP', 'nd-t g', 'middle') + T(345, 138, 'ZTNA · FWaaS · full inspection', 'f-s', 'middle');
      /* Dubai PoP */
      s += fpin(530, 329, 24, 'PoP');
      s += T(592, 284, 'Dubai PoP', 'nd-t g') + T(592, 299, 'Same policy · same inspection', 'f-s');
      /* destinations */
      s += nd(550, 36, 196, 56, {t: 'London DC', s: ['Socket X1500 · apps'], ic: 'server', is: 20, icls: 'g'});
      s += nd(550, 150, 196, 56, {t: 'Microsoft 365 & SaaS', s: ['egress at the nearest PoP'], ic: 'globe', is: 20, icls: 'g'});
      /* users → nearest PoP */
      s += fl('M200 68C240 68 250 181 336 181', 'fl-tun', {dur: 1.3, label: 'Socket tunnel', lx: 236, ly: 112});
      s += fl('M200 218C250 218 300 196 338 194', 'fl-tun', {dur: 1.3, label: 'Client tunnel', lx: 258, ly: 240});
      s += fl('M200 408C300 408 460 400 508 300', 'fl-tun', {dur: 1.5, label: 'Client tunnel', lx: 330, ly: 428});
      /* PoP → destinations */
      s += fl('M382 170C450 150 470 64 550 64', 'fl-tun', {dur: 1.3, arrow: 'arr-m'});
      s += fl('M384 181C440 181 500 178 550 178', 'fl-https', {dur: 1.2, arrow: 'arr-m', label: 'local egress', lx: 466, ly: 160});
      s += fl('M530 264C530 240 556 224 562 207', 'fl-https', {dur: 1, arrow: 'arr-m'});
      /* the stack every PoP applies */
      s += tier(256, 470, 'FULL SINGLE-PASS STACK AT EVERY POP');
      s += chipRow(256, 480, ['ZTNA', 'FWaaS', 'SWG', 'IPS', 'Anti-malware', 'TLSi'], 76, 20, 6, 'g');
      return s;
    },
    title: 'Same user, same policy, nearest front door',
    desc: 'Whether Priya is at her London desk, at home in Reading or in a Dubai hotel she enters the nearest Cato PoP and hits the same identity-driven policy, with SaaS egressing locally and private apps reached over the backbone.',
    legend: [['tun', 'Cato Client or Socket tunnel'], ['flow', 'Backbone between PoPs'], ['https', 'Local SaaS egress'], 'live'],
  }],
});
