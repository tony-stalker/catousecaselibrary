/* specs/network-sdwan.js — SD-WAN: Global Private Access */
DG.page('network-sdwan', {
  spotlight: {
    hl: ['branch', 'pop', 'backbone', 'dc', 'cloud'],
    mods: ['sdwan'],
    anchors: {cloud: [1288, 318]},   // step-4 marker clear of the overview's own '4' badge on Public & private cloud
    flows: [{p: 'br1'}, {p: 'br2'}, {p: 'r-LC'}, {p: 'r-CR'}, {p: 'dc1', rev: true}, {p: 'cl-aws'}],
    steps: [
      {t: 'A Socket at the branch bonds any available last miles into active/active tunnels to the nearest PoP.', marks: ['branch']},
      {t: 'The PoP applies app- and identity-aware QoS, TCP acceleration and packet-loss mitigation in the path.', marks: ['pop']},
      {t: 'Traffic crosses the global private backbone: Tier-1 carrier diversity, 99.999 % uptime SLA between PoPs.', marks: ['backbone']},
      {t: 'The datacentre socket and the AWS vSocket are reached privately; the single MPLS circuit is retired.', marks: ['dc', 'cloud']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 50 760 380',
    draw: K => {
      const {nd, fl, T, pill, site, ring, fpin, fy, cloud, xmark, socketX1600} = K;
      let s = '';

      /* ---- left: the Glasgow branch, two commodity last miles ---- */
      s += site(14, 100, 200, 190, 'GLASGOW BRANCH');
      s += nd(26, 122, 176, 54, {t: 'Glasgow branch', s: ['Socket X1600'], ic: 'building', is: 20, icls: 'g'});
      s += socketX1600(36, 216, 156);
      s += T(114, 272, 'broadband + 4G/LTE · active/active', 'f-s', 'middle');

      /* ---- the legacy circuit it replaces ---- */
      s += `<g style="stroke-dasharray:5 4">${nd(26, 346, 176, 54, {t: 'Legacy MPLS', s: ['One circuit · no on-ramp'], ic: 'route', is: 20, cls: 'dash'})}</g>`;   // .nd.dash is not in the ported CSS; dash inline
      s += fl('M202 373L330 373', 'fl-down', {np: 0});
      s += xmark(266, 373);
      s += pill(402, 373, 'retired at cutover', 'r');

      /* ---- centre: the global private backbone with the two PoPs on its front ---- */
      const RG = {cx: 430, cy: 190, rx: 140, ry: 50};
      const LX = 330, CX = 530, FY = Math.round(fy(RG, LX));
      s += T(430, 82, 'Cato Global Private Backbone', 'f-h', 'middle');
      s += T(430, 98, 'full mesh of PoPs · Tier-1 carrier diversity', 'f-s', 'middle');
      s += T(430, 114, 'TCP acceleration · packet-loss mitigation', 'f-s', 'middle');
      s += ring(RG);
      s += pill(430, RG.cy - RG.ry, '99.999 % uptime SLA between PoPs', 'g');

      /* both last miles terminate on the nearest PoP (drawn before the pins so they meet under the pin heads) */
      s += fl(`M194 222C250 222 298 ${FY - 30} ${LX - 3} ${FY - 5}`, 'fl-tun', {dur: 1.2, label: 'broadband', lx: 250, ly: 206});
      s += fl(`M194 236C250 236 298 ${FY + 2} ${LX - 2} ${FY + 1}`, 'fl-tun', {dur: 1.3, label: '4G/LTE', lx: 250, ly: 252});
      /* across the backbone, nearest PoP to London */
      s += fl(`M${LX} ${FY}A${RG.rx} ${RG.ry} 0 0 0 ${CX} ${FY}`, 'fl-hot', {n: 2, dur: 2.2});

      /* ---- right: the destinations the branch now reaches privately ---- */
      s += nd(570, 70, 176, 54, {t: 'London DC', s: ['Socket · core apps'], ic: 'server', is: 20, icls: 'g'});
      s += nd(570, 330, 176, 54, {t: 'Cloud DC — AWS', s: ['vSocket · eu-west-2'], ic: 'cpu', is: 20, icls: 'g'});
      s += cloud(730, 344, .16);
      const PX = CX + 20, PY = FY - 36;
      s += fl(`M${PX} ${PY - 4}C562 156 556 97 570 97`, 'fl-tun', {dur: 1.2});
      s += fl(`M${PX} ${PY + 24}C576 280 558 357 570 357`, 'fl-tun', {dur: 1.2});

      /* the PoPs sit on the ring, above the flows */
      s += fpin(LX, FY, 24, 'PoP', {halo: true});
      s += fpin(CX, FY, 22, 'PoP', {fs: 9});
      s += T(LX, 268, 'Nearest PoP', 'f-t', 'middle');
      s += T(LX, 282, 'selected automatically', 'f-s', 'middle');
      s += T(CX - 8, 268, 'London PoP', 'f-t', 'middle');
      return s;
    },
    title: 'Glasgow branch on-net over dual last miles and the Cato global private backbone',
    desc: 'A Glasgow branch joins the WAN over broadband and 4G/LTE active/active tunnels to its nearest PoP, crosses the SLA-backed global private backbone, and reaches the London DC socket and the AWS vSocket; the single MPLS circuit it replaces is retired.',
    legend: [['tun', 'Encrypted DTLS tunnels — active/active'], ['hot', 'Global private backbone'], ['down', 'Single MPLS circuit — retired'], 'live'],
  }],
});
