/* specs/migration-versa.js — Versa Networks (SD-WAN & SASE) to Cato */
DG.page('migration-versa', {
  spotlight: {
    hl: ['branch', 'dc', 'pop', 'backbone', 'mgmt'],
    mods: ['sdwan'],
    flows: [{p: 'br1'}, {p: 'br2'}, {p: 'dc1'}, {p: 'r-LC'}, {p: 'm1'}],
    steps: [
      {t: 'A parallel Socket at each Versa hub peers with the VOS hub over eBGP; the MP-BGP overlay stays intact.', marks: ['dc']},
      {t: 'AS-path length anchors each region to its local hub, so no flow returns via another VOS firewall.', marks: ['backbone']},
      {t: 'Disable the Versa spoke, bring up the Cato site, routes propagate; the head-end is retired last.', marks: ['branch', 'mgmt']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, TL, pill, site, ring, fpin, fy, popBox} = K;
      let s = '';

      /* ---- top: the Cato PoP on the global private backbone ---- */
      const RG = {cx: 380, cy: 140, rx: 200, ry: 36};
      s += popBox(290, 22, 180, 56, 'Cato PoP', 'SPACE · FWaaS · ZTNA · SWG');
      s += ring(RG);
      s += T(548, 194, 'Global Private Backbone', 'f-s', 'middle');

      /* migrated paths into the backbone (drawn before the pin) */
      const fB = Math.round(fy(RG, 236));
      s += fl(`M112 262C112 214 176 ${fB + 6} 236 ${fB - 2}`, 'fl-tun', {dur: 1.4});
      s += fl(`M380 262V${Math.round(fy(RG, 380)) + 2}`, 'fl-tun', {dur: 1.0});
      s += fpin(380, Math.round(fy(RG, 380)) + 2, 22, 'PoP', {halo: true});
      s += fpin(236, fB - 2, 16, 'PoP');

      /* ---- centre: the Manchester hub — same site, new leg ---- */
      s += site(232, 232, 286, 248, 'MANCHESTER HUB SITE');
      s += nd(262, 262, 236, 62, {t: 'Manchester hub', s: ['parallel Cato Socket', 'same site, new leg'], ic: 'cpu', is: 22, icls: 'g', cls: 'hot'});
      s += fl('M380 324V396', 'fl-net', {np: 0});
      s += pill(380, 360, 'eBGP handoff · AS-path symmetry', 'm');
      s += nd(262, 396, 236, 62, {t: 'Manchester hub', s: ['VOS hub · MP-BGP intact'], ic: 'firewall', is: 22, icls: 'g'});

      /* ---- left: the migrated branch ---- */
      s += nd(14, 262, 196, 62, {t: 'Bristol branch', s: ['Cato Socket · migrated'], ic: 'building', is: 22, icls: 'g', cls: 'hot'});
      s += pill(112, 342, 'one policy at the PoP', 'g');

      /* rollback lever: re-enable the VOS spoke */
      s += fl('M210 300C250 300 234 430 258 430', 'fl-net fl-dim', {np: 0, arrow: 'arr-n'});
      s += TL(224, 392, ['rollback: re-enable the', 'VOS spoke — BGP reconverges'], 'f-s', 'end', 14);

      /* ---- bottom left: the legacy spoke on the Versa overlay ---- */
      s += nd(14, 462, 196, 62, {t: 'Leeds branch', s: ['VOS CSG spoke'], ic: 'building', is: 22, icls: 'g', cls: 'dash'});
      s += fl('M210 493H404C418 493 420 484 420 460', 'fl-ha', {dur: 1.8, arrow: 'arr-y'});
      s += pill(306, 493, 'MP-BGP overlay · IPsec SAs', 'y');
      s += pill(112, 540, 'awaiting wave 2', 'y');

      /* ---- right: the Versa head-end, retired last ---- */
      s += nd(556, 262, 190, 70, {t: 'Versa head-end', s: ['Director · Controller', 'Analytics · Concerto'], ic: 'console', is: 22, icls: 'g', cls: 'dash'});
      s += pill(651, 348, 'retire last', 'y');
      s += fl('M600 332C600 410 540 427 500 427', 'fl-net fl-dim', {np: 0});
      s += TL(612, 400, ['control plane:', 'templates · MP-BGP SAs'], 'f-s', 'start', 14);
      return s;
    },
    title: 'eBGP hub co-existence between Cato and a Versa MP-BGP overlay during migration',
    desc: "A parallel Socket at the Versa hub exchanges routes with the VOS hub over eBGP and AS-path length anchors each region's traffic to its local hub; cutover per spoke is a routing event, rollback its mirror image, and the Director/Controller head-end is retired only after the final wave.",
    legend: [['tun', 'Migrated — Socket to the nearest PoP'], ['ha', 'Interim — Versa MP-BGP overlay until each wave completes'], ['net', 'eBGP handoff, head-end control plane and rollback lever'], 'live'],
  }],
});
