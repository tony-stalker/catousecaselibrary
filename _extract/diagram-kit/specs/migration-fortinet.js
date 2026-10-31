/* specs/migration-fortinet.js — Fortinet (FortiGate & FortiSASE) to Cato */
DG.page('migration-fortinet', {
  spotlight: {
    hl: ['branch', 'dc', 'pop', 'backbone'],
    mods: ['sdwan', 'sse'],
    flows: [{p: 'br1'}, {p: 'br2'}, {p: 'dc1'}, {p: 'r-LC'}, {p: 'r-CR'}],
    steps: [
      {t: 'A parallel Socket at each FortiGate regional hub exchanges routes with the hub over an eBGP handoff.', marks: ['dc']},
      {t: 'Routes crossing regions carry an extra AS hop, so best-path keeps each flow symmetric via its local hub.', marks: ['backbone']},
      {t: 'Disable the FortiGate spoke, bring up the Cato site, routes propagate; rollback is re-enabling the spoke.', marks: ['branch', 'pop']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, site, ring, fpin, fy, popBox} = K;
      let s = '';

      /* ---- top: the Cato PoP on the global private backbone ---- */
      const RG = {cx: 380, cy: 160, rx: 170, ry: 34};
      s += popBox(290, 40, 180, 70, 'Cato PoP', 'SPACE · one global rulebase');
      s += ring(RG);
      s += T(556, 198, 'Global private backbone', 'f-s', 'start');

      /* Branch A → PoP (green tunnel, lands just left of the pin) and hub Socket → PoP
         (green tunnel, lands just right of the pin); drawn before the pin */
      const fA = Math.round(fy(RG, 352)), fS = Math.round(fy(RG, 410));
      s += fl(`M84 440C84 300 120 222 230 216C292 213 330 ${fA + 8} 352 ${fA - 2}`, 'fl-tun', {dur: 1.4});
      s += fl(`M320 290C320 244 390 ${fS + 26} 410 ${fS - 2}`, 'fl-tun', {dur: 1.4});
      s += fpin(380, Math.round(fy(RG, 380)) + 2, 22, 'PoP', {halo: true});

      /* ---- centre: the regional hub site — parallel deployment ---- */
      s += site(150, 250, 460, 136, 'REGIONAL HUB SITE');
      s += pill(528, 250, 'parallel deployment', 'm');
      s += nd(170, 290, 170, 64, {t: 'Cato Socket', s: ['parallel at the hub'], ic: 'cpu', is: 20, icls: 'g', cls: 'hot'});
      s += nd(420, 290, 170, 64, {t: 'FortiGate hub', s: ['SD-WAN / ADVPN core'], ic: 'firewall', is: 20, icls: 'g'});
      s += fl('M340 322H420', 'fl-lan', {np: 0});
      s += pill(380, 322, 'eBGP', 'm');
      s += T(380, 374, 'AS-path anchors symmetry', 'f-s', 'middle');

      /* ---- bottom left: the migrated branch ---- */
      s += nd(14, 440, 192, 64, {t: 'Branch A — migrated', s: ['Cato Socket X1500'], ic: 'building', is: 20, icls: 'g', cls: 'hot'});
      s += pill(110, 522, 'on Cato · via nearest PoP', 'g');

      /* ---- bottom right: the legacy spoke, still behind the FortiGate hub ---- */
      s += fl('M650 440C650 404 560 420 560 356', 'fl-ha', {dur: 1.8, label: 'ADVPN overlay', lx: 672, ly: 408, lcls: 'y'});
      s += nd(554, 440, 192, 64, {t: 'Branch B — legacy', s: ['FortiGate ADVPN spoke'], ic: 'building', is: 20, icls: 'g', cls: 'dash'});
      s += pill(650, 522, 'migrates in a later wave', 'y');

      /* ---- rollback: Branch A reverts by re-enabling its FortiGate spoke ---- */
      s += fl('M206 486C300 530 440 500 476 356', 'fl-net', {np: 0, arrow: true, label: 'Rollback — re-enable the spoke · BGP reconverges', lx: 380, ly: 506, lcls: 'm'});
      return s;
    },
    title: 'eBGP regional-hub co-existence between Cato and a FortiGate SD-WAN estate',
    desc: 'A parallel Socket at each FortiGate regional hub exchanges routes over eBGP; routes crossing regions carry an extra AS hop so best-path selection anchors traffic to its local hub, and spoke cutover or rollback is BGP reconverging.',
    legend: [['tun', 'Migrated — Cato Socket via nearest PoP'], ['ha', 'Legacy — FortiGate ADVPN overlay'], ['net', 'Rollback — re-enable the FortiGate spoke'], 'live'],
  }],
});
