/* specs/migration-cisco-asa.js — Cisco ASA (5500-X perimeter) to Cato */
DG.page('migration-cisco-asa', {
  spotlight: {
    hl: ['branch', 'dc', 'users', 'pop', 'backbone'],
    mods: ['sdwan', 'sse', 'uztna'],
    flows: [{p: 'br1'}, {p: 'dc1'}, {p: 'dc2'}, {p: 'us1'}, {p: 'r-LC'}],
    anchors: {backbone: [1074, 592]},   // step-2 marker beside the backbone label, clear of the SLA micro-label
    steps: [
      {t: 'A parallel Socket at the DC takes migrated subnets over an L3 handoff; the ASA HA pair stays racked.', marks: ['dc']},
      {t: 'The hub ASA comes up as an interim IPsec IKEv2 site so un-migrated branches reach Cato-side resources.', marks: ['pop', 'backbone']},
      {t: 'Branches move to Sockets, AnyConnect users to the Cato Client; rollback restores ASA routes.', marks: ['branch', 'users']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, TL, pill, site, ring, fpin, fy, by, popBox} = K;
      let s = '';

      /* ---- top: the Cato PoP on the global private backbone ---- */
      const RG = {cx: 380, cy: 140, rx: 170, ry: 30};
      s += popBox(224, 12, 312, 58, 'Cato PoP', 'One global policy · greenfield engines in monitor');
      s += ring(RG);
      s += T(566, 144, 'Global private backbone', 'f-s', 'start');

      /* ---- top left: the remote user, already on the Cato Client ---- */
      /* tunnel ducks under the PoP box and lands on the back of the ring */
      const pX = 290, pY = Math.round(by(RG, pX));
      s += fl(`M194 66C236 72 262 ${pY - 6} ${pX} ${pY + 2}`, 'fl-tun', {dur: 1.3});
      s += nd(14, 24, 180, 60, {t: 'Remote user', s: ['Client, was AnyConnect'], ic: 'laptop', is: 20, icls: 'g', cls: 'hot'});
      s += pill(104, 102, 'migrated', 'g');

      /* ---- centre: London DC — Socket beside the ASA pair ---- */
      /* Socket → PoP (green) — drawn before site() so the tag pill covers it */
      const sX = 336, sY = Math.round(fy(RG, sX));
      s += fl(`M322 252C322 214 330 ${sY + 18} ${sX} ${sY - 2}`, 'fl-tun', {dur: 1.3});
      s += site(214, 220, 532, 136, 'LONDON DC — PARALLEL DEPLOYMENT');
      s += nd(232, 252, 180, 64, {t: 'Cato Socket', s: ['parallel at the DC'], ic: 'switch', is: 20, icls: 'g', cls: 'hot'});
      s += nd(556, 252, 180, 64, {t: 'ASA 5500-X HA pair', s: ['being displaced'], ic: 'firewall', is: 20, icls: 'g', cls: 'dash'});
      s += pill(676, 252, 'out of support', 'y');
      s += fl('M412 284H556', 'fl-lan', {np: 0});
      s += pill(484, 284, 'L3 handoff', 'm keep');
      s += T(484, 304, 'default routes filtered', 'f-s', 'middle');

      /* hub ASA → PoP: the interim IPsec IKEv2 site */
      const aX = 470, aY = Math.round(fy(RG, aX));
      s += fl(`M584 252C584 200 520 ${aY + 8} ${aX} ${aY - 2}`, 'fl-ipsec', {dur: 1.6, label: 'IPsec IKEv2 site — interim on-ramp', lx: 628, ly: 206});

      /* ---- bottom left: Bristol, migrated ---- */
      const bX = 222, bY = Math.round(fy(RG, bX));
      s += fl(`M104 440C104 300 140 ${bY + 30} ${bX} ${bY - 2}`, 'fl-tun', {dur: 1.4});
      s += nd(14, 440, 180, 64, {t: 'Bristol — migrated', s: ['Socket replaces the ASA'], ic: 'building', is: 20, icls: 'g', cls: 'hot'});
      s += pill(104, 524, 'via the nearest PoP', 'g');

      /* rollback lever: Bristol back to its own ASA, still racked */
      s += fl('M194 472H252', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += nd(256, 446, 170, 52, {t: 'Bristol ASA', s: ['still racked'], ic: 'firewall', is: 18, icls: 'g', cls: 'dash'});
      s += TL(341, 520, ['Rollback — restore the default gateway /', 'static routes to the branch ASA'], 'f-s', 'middle', 13);

      /* ---- bottom right: Leeds, still on the ASA crypto-map mesh ---- */
      s += fl('M690 456V320', 'fl-ha', {dur: 1.6, arrow: 'arr-y', label: 'crypto-map mesh', lx: 690, ly: 396, lcls: 'y'});
      s += nd(556, 456, 190, 64, {t: 'Leeds — un-migrated', s: ['ASA IPsec mesh to hub'], ic: 'building', is: 20, icls: 'g', cls: 'dash'});
      s += pill(651, 540, 'until its wave', 'y');

      /* the PoP pin on the front of the ring */
      s += fpin(380, Math.round(fy(RG, 380)) + 2, 22, 'PoP', {halo: true});
      return s;
    },
    title: 'Co-existence between a perimeter ASA estate and Cato during phased migration',
    desc: 'A parallel Socket at the DC takes migrated subnets over an L3 handoff while the ASA HA pair keeps its legacy IPsec mesh and comes up as a Cato IPsec IKEv2 site, so un-migrated branches reach Cato-side resources; rollback is restoring the default gateway and static routes to the ASA.',
    legend: [['tun', 'Migrated — Socket / Client via the nearest PoP'], ['ipsec', 'Interim — hub ASA as an IPsec IKEv2 site'], ['ha', 'Legacy — ASA crypto-map mesh'], ['net', 'Rollback — restore routes to the branch ASA'], 'live'],
  }],
});
