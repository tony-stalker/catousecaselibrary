/* specs/access-third-party.js — De-risking 3rd-Party & Supply Chain Access */
DG.page('access-third-party', {
  spotlight: {
    hl: ['users', 'pop', 'dc', 'cloud', 'saas', 'mgmt'],
    mods: ['uztna', 'sse'],
    flows: [{p: 'us1'}, {p: 'us2'}, {p: 'dc1', rev: true}, {p: 'cl-az'}, {p: 'eg-saas'}],
    steps: [
      {t: 'Contractors and suppliers connect with the Cato Client or a clientless browser portal, not a VPN.', marks: ['users']},
      {t: 'The nearest PoP pairs IdP identity with live device posture, re-checked throughout the session.', marks: ['pop']},
      {t: 'Compliant users reach only their named apps in the DC and cloud; anything unlisted falls to the block.', marks: ['dc', 'cloud']},
      {t: 'Every allow and block lands in Events attributed to the contractor\'s identity, not an IP address.', marks: ['mgmt']},
    ],
    anchors: {mgmt: [782, 132], cloud: [1362, 408]},   // CMA marker on the box's top edge; cloud marker on the lit Azure leg, clear of the heading index
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, tier, popBox, ring, pill, xmark, mark, chips} = K;
      let s = '';
      /* section labels */
      s += tier(14, 16, 'WHO IS CONNECTING') + T(367, 16, 'DECIDED AT THE PoP', 'tier', 'middle') + T(746, 16, 'WHAT THEY MAY REACH', 'tier', 'end');

      /* three lanes: y = 150 · 262 · 374 */
      const LANES = [
        {y: 150, t: 'Authorised user',   sub: 'Compliant device',     ic: 'laptop', v: 'Named apps',     vc: 'g'},
        {y: 262, t: 'Authorised user',   sub: 'Non-compliant device', ic: 'laptop', v: 'Internet only',  vc: 'y'},
        {y: 374, t: 'Unauthorised user', sub: 'Non-compliant device', ic: 'user',   v: 'Blocked',        vc: 'r'},
      ];
      LANES.forEach(l => {
        s += nd(14, l.y - 24, 170, 48, {t: l.t, s: [l.sub], ic: l.ic, is: 18, icls: 'g'});
        s += pill(99, l.y + 42, l.v, l.vc + ' keep');
      });

      /* the PoP: one decision point, three outcomes */
      const BX = 240, BW = 254, BR = BX + BW;
      s += popBox(BX, 72, BW, 400, 'Cato PoP', 'SPACE · ZTNA · FWaaS · CASB · DLP');
      s += fl('M184 150L' + BX + ' 150', 'fl-tun', {dur: 1.1});
      s += fl('M184 262L' + BX + ' 262', 'fl-tun', {dur: 1.2});
      s += fl('M184 374L' + BX + ' 374', 'fl-down', {np: 0}) + xmark(BX, 374);

      s += mark(262, 150, 'ok') + T(278, 146, 'Named apps + internet', 'nd-t') + T(278, 160, 'WAN Firewall: named apps only', 'nd-s');
      s += mark(262, 262, 'warn') + T(278, 258, 'Internet only', 'nd-t') + T(278, 272, 'posture check failed · WAN blocked', 'nd-s');
      s += tier(262, 410, 'CHECKED ON EVERY SESSION');
      s += chips(262, 418, ['IdP identity · group', 'Device posture', 'Re-checked in session', 'WAN Firewall rules'], 108, 18, 8, 2, 'g');
      s += T(278, 370, 'No tunnel established', 'nd-t') + T(278, 384, 'geo · user group · posture rule', 'nd-s');

      /* destinations behind the backbone */
      const RG = {cx: 656, cy: 262, rx: 88, ry: 200};
      s += ring(RG);
      s += T(656, 484, 'GLOBAL PRIVATE BACKBONE', 'tier', 'middle');
      s += nd(566, 124, 180, 52, {t: 'London DC', s: ['Socket · named apps'], ic: 'server', is: 18, icls: 'g'});
      s += nd(566, 236, 180, 52, {t: 'Cloud DC — Azure', s: ['vSocket · named apps'], ic: 'db', is: 18, icls: 'g'});
      s += nd(566, 348, 180, 52, {t: 'SaaS & Internet', s: ['M365 · Salesforce · WWW'], ic: 'globe', is: 18, icls: 'g'});

      /* lane 1: the contractor group's named apps (WAN Firewall) + internet; anything unlisted falls to the implicit block */
      s += fl(`M${BR} 142C${BR + 30} 142 ${BR + 46} 150 566 150`, 'fl-flow', {arrow: 'arr-m', dur: 1});
      s += fl(`M${BR} 150C${BR + 52} 150 ${BR + 40} 262 566 262`, 'fl-flow', {arrow: 'arr-m', dur: 1.1});
      s += fl(`M${BR} 158C${BR + 22} 158 ${BR + 22} 362 566 362`, 'fl-flow', {arrow: 'arr-m', dur: 1.2});
      /* lane 2: internet only — the WAN leg stops at the PoP */
      s += fl(`M${BR} 270C${BR + 22} 270 ${BR + 22} 382 566 382`, 'fl-https', {arrow: 'arr-m', dur: 1.1});
      s += fl('M462 256L' + BR + ' 256', 'fl-down', {np: 0}) + xmark(BR, 256);

      /* the policy chain */
      s += T(380, 530, 'Client Connectivity Policy → WAN Firewall · posture profiles on rules — first match, implicit block', 'f-m', 'middle');
      return s;
    },
    title: 'Least-privileged third-party access',
    desc: 'Three identical-looking connections get three different outcomes: identity and live device posture at the PoP decide whether a contractor reaches named apps, internet only, or nothing at all.',
    legend: [['tun', 'Cato Client tunnel to the PoP'], ['flow', 'Allowed: named apps (WAN Firewall) + internet'], ['https', 'Internet only — WAN blocked'], ['down', 'Blocked — geo / user / posture rules']],
  }],
});
