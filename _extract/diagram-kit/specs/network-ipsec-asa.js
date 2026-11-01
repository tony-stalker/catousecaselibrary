/* specs/network-ipsec-asa.js — IPsec Site Design: Cisco ASA (IKEv1 / IKEv2) */
DG.page('network-ipsec-asa', {
  spotlight: {
    hl: ['branch', 'pop', 'backbone', 'dc', 'cloud', 'saas'],
    mods: ['sse'],
    flows: [{p: 'br1'}, {p: 'r-LC'}, {p: 'r-CR'}, {p: 'dc1', rev: true}, {p: 'cl-aws'}, {p: 'eg-www'}],
    steps: [
      {t: 'A branch LAN behind a Cisco ASA joins Cato over IPsec: a route-based VTI on IKEv2, or a crypto map on IKEv1.', marks: ['branch']},
      {t: 'The primary tunnel lands on an allocated IP at the nearest PoP; the secondary on one at an alternate PoP.', marks: ['popL', 'popR']},
      {t: 'If every primary tunnel drops, routes fail over to the secondary; IPsec sites never roam PoPs on their own.', marks: ['pop']},
      {t: 'From the PoP, traffic rides the backbone to Socket sites, cloud datacentres and secure internet egress.', marks: ['backbone', 'dc', 'cloud', 'saas']},
    ],
    anchors: {cloud: [1446, 306], saas: [302, 310], backbone: [1077, 586]},   // markers clear of the AWS label, the Smart-egress subtitle and the SLA ring text
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, R, L, pill, ring, fpin, fy, by, cloud, site} = K;
      let s = '';

      /* ---- left: the branch behind its existing firewall ---- */
      s += site(14, 110, 206, 380, 'BRANCH BEHIND CISCO ASA');
      s += nd(28, 150, 178, 56, {t: 'Branch LAN', s: ['10.20.0.0/24'], ic: 'laptop', is: 20, icls: 'g'});
      s += fl(L(117, 206, 117, 352), 'fl-lan', {np: 0});
      s += T(126, 284, 'inside', 'f-m');
      s += nd(28, 352, 178, 72, {t: 'Cisco ASA', s: ['203.0.113.10 · outside', 'IKEv2: VTI (preferred)', 'IKEv1: crypto map'], ic: 'firewall', is: 20, icls: 'g', cls: 'hot'});
      s += T(117, 458, 'no Socket · tunnels to two', 'f-s', 'middle');
      s += T(117, 472, 'fixed allocated IPs', 'f-s', 'middle');

      /* ---- centre: the global private backbone with the two PoPs on its front ---- */
      const RG = {cx: 405, cy: 300, rx: 150, ry: 70};
      const LX = 330, MX = 480, FY = Math.round(fy(RG, LX));
      s += T(405, 192, 'Cato Global Private Backbone', 'f-h', 'middle');
      s += T(405, 207, 'full security stack applied at the PoP', 'f-s', 'middle');
      s += ring(RG);

      /* tunnels from the ASA, drawn before the pins so they meet under the pin heads */
      s += fl(`M206 372C260 372 290 ${FY + 2} ${LX - 2} ${FY + 3}`, 'fl-ipsec', {dur: 1.2, label: 'active', lx: 236, ly: 350, lcls: 'g'});
      const SEC = `M206 406C330 440 ${MX} 430 ${MX} ${FY + 3}`;
      s += fl(SEC, 'fl-ipsec fl-dim', {np: 0});
      s += fl(SEC, 'fl-ha', {np: 0, label: 'standby', lx: 396, ly: 426, lcls: 'y'});

      /* PoP labels sit inside the ring, above each pin; short headings so the two groups never meet */
      s += T(LX + 8, 268, 'Primary PoP', 'f-t', 'middle');
      s += T(LX + 8, 282, 'nearest · allocated IP', 'f-s', 'middle');
      s += T(LX + 8, 296, '198.51.100.10', 'f-m', 'middle');
      s += T(MX - 14, 268, 'Secondary PoP', 'f-t', 'middle');
      s += T(MX - 14, 282, 'alternate · allocated IP', 'f-s', 'middle');
      s += T(MX - 14, 296, '198.51.100.20', 'f-m', 'middle');
      s += fpin(LX, FY, 20, 'PoP', {halo: true, fs: 9});
      s += fpin(MX, FY, 20, 'PoP', {fs: 9});

      /* the security stack every IPsec site inherits */
      s += pill(405, 468, 'FWaaS · IPS · anti-malware · CASB · DLP at the PoP', 'g');

      /* ---- right: where the backbone takes the traffic ---- */
      const BX = 584, BW = 162, BH = 56;
      const Y = [70, 250, 430];
      const RX = RG.cx + RG.rx;
      /* feeds fan out from three points on the ring; control x values increase so no curve doubles back */
      const feed = (x0, y0, y, cls, o) => fl(`M${x0} ${y0}C${x0 + 16} ${y0} ${BX - 16} ${y} ${BX - 2} ${y}`, cls, o);
      s += feed(520, Math.round(by(RG, 520)), Y[0] + 28, 'fl-tun', {dur: 1.3});
      s += feed(RX - 4, RG.cy, Y[1] + 28, 'fl-tun', {dur: 1.3});
      /* egress: a longer horizontal run-in so the arrowhead lines up with the line */
      s += fl(`M520 ${Math.round(fy(RG, 520))}C548 ${Math.round(fy(RG, 520)) + 50} 528 ${Y[2] + 28} ${BX - 2} ${Y[2] + 28}`, 'fl-flow', {dur: 1.3, arrow: 'arr-m'});
      s += nd(BX, Y[0], BW, BH, {t: 'Datacentre', s: ['Socket site · apps'], ic: 'server', is: 20, icls: 'g'});
      s += nd(BX, Y[1], BW, BH, {t: 'AWS cloud DC', s: ['vSocket HA pair'], ic: 'cpu', is: 20, icls: 'g'});
      s += cloud(BX + BW - 18, Y[1] + BH - 12, .18);
      s += nd(BX, Y[2], BW, BH, {t: 'SaaS & internet', s: ['Secure egress at PoP'], ic: 'globe', is: 20, icls: 'g'});
      return s;
    },
    title: 'Cisco ASA site connected to Cato over dual IPsec tunnels',
    desc: 'A branch LAN behind a Cisco ASA runs a primary IPsec tunnel to a Cato allocated IP at the nearest PoP and a standby secondary tunnel to an allocated IP at an alternate PoP; both PoPs join the global private backbone, which carries traffic to a datacentre Socket site, a cloud datacentre on an AWS vSocket HA pair and secure internet egress.',
    legend: [['ipsec', 'Primary tunnel — active, nearest PoP'], ['ha', 'Secondary tunnel — standby, alternate PoP'], ['tun', 'Backbone to Socket and vSocket sites'], ['flow', 'Secure internet egress at the PoP'], 'live'],
  }],
});
