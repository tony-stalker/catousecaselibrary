/* specs/migration-netskope.js — Netskope to Cato */
DG.page('migration-netskope', {
  spotlight: {
    hl: ['users', 'branch', 'dc', 'pop', 'saas'],
    mods: ['sse', 'uztna'],
    flows: [{p: 'us1'}, {p: 'br1'}, {p: 'dc1', rev: true}, {p: 'eg-saas'}],
    steps: [
      {t: 'Each cohort swaps the Netskope Client for the Cato Client in one window; never both tunnels at once.', marks: ['users']},
      {t: 'Sites run the legacy IPsec/GRE tunnel and a Cato Socket side by side, split per VLAN.', marks: ['branch']},
      {t: 'Private apps go on-net behind a Socket, replacing NPA Publishers; API Data Protection retires last.', marks: ['dc', 'pop']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, ring, fpin, fy, cloud, popBox, tier} = K;
      let s = '';

      /* ---- top band: the interim Netskope path ---- */
      s += tier(14, 38, 'INTERIM · STEERED VIA NETSKOPE NEWEDGE');
      s += cloud(380, 110, 1.2, 'Netskope NewEdge', 'SWG · CASB · NPA');

      /* ---- bottom band: the target Cato path ---- */
      s += tier(14, 332, 'TARGET · STEERED VIA CATO POP');
      const RG = {cx: 380, cy: 436, rx: 115, ry: 40};
      s += ring(RG);
      s += popBox(280, 300, 200, 70, 'Cato PoP', 'SWG · CASB · DLP · ZTNA · FWaaS');
      s += T(380, 504, 'Global Private Backbone', 'f-s', 'middle');

      /* ---- left: cohorts and the site ---- */
      s += nd(14, 62, 200, 56, {t: 'Wave 2 user cohort', s: ['Netskope Client'], ic: 'users', is: 20, icls: 'g', cls: 'dash'});
      s += pill(114, 136, 'wave 2 · not yet migrated', 'y');
      s += nd(14, 212, 200, 68, {t: 'Bristol Office', s: ['FW IPsec/GRE — interim', 'Cato Socket — target'], ic: 'building', is: 20, icls: 'g'});
      s += pill(114, 296, 'parallel per VLAN', 'm');
      s += nd(14, 420, 200, 56, {t: 'Wave 1 user cohort', s: ['Cato Client'], ic: 'users', is: 20, icls: 'g'});
      s += pill(114, 494, 'wave 1 · migrated', 'g');

      /* ---- right: the private apps and the dormant Publisher ---- */
      s += nd(546, 62, 200, 56, {t: 'NPA Publisher', s: ['dormant after cutover'], ic: 'plug', is: 20, icls: 'g', cls: 'dash'});
      s += pill(646, 136, 'dormant · rollback', 'm');
      s += nd(546, 414, 200, 68, {t: 'London DC apps', s: ['Cato Socket', 'private apps on-net'], ic: 'server', is: 20, icls: 'g'});

      /* interim flows (amber): cohort and site firewall into NewEdge; NewEdge on to the apps via the Publisher */
      s += fl('M214 90C260 90 272 104 310 104', 'fl-ha', {dur: 1.8});
      s += fl('M214 236C270 236 300 154 340 140', 'fl-ha', {dur: 1.8});
      s += fl('M450 104C490 104 500 90 546 90', 'fl-ha', {np: 0, arrow: 'arr-y'});
      s += pill(283, 194, 'interim', 'y');   // on the Bristol → NewEdge leg
      s += fl('M646 118V414', 'fl-ha', {np: 0, arrow: 'arr-y', label: 'NPA private access', lx: 646, ly: 270, lcls: 'y keep'});

      /* target flows (green): cohort and Socket into the PoP; PoP on to the apps over the WAN */
      s += fl('M214 258C260 258 250 326 280 326', 'fl-tun', {dur: 1.3});
      s += fl('M214 448C260 448 250 356 280 356', 'fl-tun', {dur: 1.3});
      s += fl('M480 340C564 340 520 448 546 448', 'fl-flow', {dur: 1.1, arrow: 'arr-m', label: 'WAN FW · ZTNA', lx: 534, ly: 392, lcls: 'g keep'});

      /* the PoP pin on the front of the ring */
      s += fpin(380, Math.round(fy(RG, 380)) + 2, 22, 'PoP', {halo: true});
      s += T(380, 544, 'Swap the client per cohort; overlap only at the network and API layers', 'f-s', 'middle');
      return s;
    },
    title: 'Cohort-based Netskope-to-Cato co-existence',
    desc: 'Each wave uninstalls the Netskope Client and installs the Cato Client in one window; the site runs parallel paths per VLAN, and private apps move from NPA Publishers to routed reachability behind a Socket while the Publisher stays dormant as the rollback.',
    legend: [['ha', 'Interim — steered via Netskope NewEdge'], ['tun', 'Target — steered via Cato PoP'], ['flow', 'On-net private apps via WAN Firewall'], 'live'],
  }],
});
