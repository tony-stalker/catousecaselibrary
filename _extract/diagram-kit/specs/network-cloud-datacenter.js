/* specs/network-cloud-datacenter.js — Cloud Datacentre Integration */
DG.page('network-cloud-datacenter', {
  spotlight: {
    hl: ['branch', 'dc', 'pop', 'backbone', 'cloud'],
    mods: ['sdwan'],
    flows: [{p: 'br1'}, {p: 'r-LC'}, {p: 'r-CR'}, {p: 'dc1'}, {p: 'cl-aws'}, {p: 'cl-az'}, {p: 'cl-gcp'}],
    steps: [
      {t: 'Branch traffic bound for a cloud workload enters the nearest PoP and crosses the private backbone.', marks: ['branch', 'backbone']},
      {t: 'The cloud DC attaches by vSocket HA pair, IPsec from a native gateway or a layer-2 cross-connect at the PoP.', marks: ['popR']},
      {t: 'The WAN firewall governs branch-to-VPC traffic with the same rulebase and audit trail as physical sites.', marks: ['pop']},
      {t: 'Traffic egresses to the VPC at the PoP nearest the cloud region, never across the public internet.', marks: ['cloud']},
    ],
    anchors: {cloud: [1484, 322]},   // step-4 marker inside the cloud group (between AWS and Azure), clear of the ④ badge
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, R, pill, tier, ring, fpin, fy, cloud} = K;
      let s = '';

      /* ---- left: the physical estate ---- */
      s += tier(14, 128, 'PHYSICAL ESTATE');
      s += nd(14, 150, 186, 54, {t: 'Glasgow', s: ['Branch · Socket X1600'], ic: 'building', is: 20, icls: 'g'});
      s += nd(14, 300, 186, 54, {t: 'London DC', s: ['Socket X1500 · datacentre'], ic: 'server', is: 20, icls: 'g'});

      /* ---- centre: the global private backbone with two PoPs on its front ---- */
      const RG = {cx: 350, cy: 280, rx: 120, ry: 44};
      const LX = 270, CX = 430, FY = fy(RG, LX);
      s += T(350, 204, 'Cato Global Private Backbone', 'f-h', 'middle');
      s += T(350, 219, 'egress at the PoP nearest the cloud region', 'f-s', 'middle');
      s += ring(RG);

      /* site tunnels into the London PoP (drawn before the pins so they meet under the pin heads) */
      s += fl(`M200 177C224 177 254 ${FY - 50} ${LX - 3} ${FY - 4}`, 'fl-tun', {dur: 1.2});
      s += fl(`M200 327C236 327 250 ${FY + 8} ${LX - 4} ${FY + 3}`, 'fl-tun', {dur: 1.2});
      /* the backbone carries branch and DC traffic to the PoP next to the cloud region */
      s += fl(`M${LX} ${FY}A${RG.rx} ${RG.ry} 0 0 0 ${CX} ${FY}`, 'fl-hot', {n: 3, dur: 2.2});

      /* ---- right: four cloud destinations, one per attachment ---- */
      const BX = 560, BW = 190, BH = 72;
      const box = (y, title, sub, note, ha) => {
        s += R(BX, y, BW, BH, 'nd soft', 12);
        s += cloud(BX + BW - 20, y + BH - 16, .18);
        s += T(BX + 12, y + 23, title, 'nd-t');
        s += T(BX + 12, y + 39, sub, 'nd-s');
        s += T(BX + 12, y + 56, note, 'f-s');
        if (ha) s += pill(BX + BW - 30, y, 'HA', 'y');
      };
      const Y = [40, 170, 300, 430];
      box(Y[0], 'Azure VNet · UK South', 'Azure-UKS-Hub-vSocket', 'vSocket HA pair · DTLS', true);
      box(Y[1], 'AWS VPC · eu-west-2', 'AWS eu-west-2', 'vSocket HA pair · DTLS', true);
      box(Y[2], 'Azure Virtual WAN', 'Azure vWAN hub', 'IPsec · IKEv2 tunnel', false);
      box(Y[3], 'AWS region', 'Cloud Interconnect', 'L2 cross-connect at PoP', false);

      /* attachments from the cloud-adjacent PoP: two vSocket tunnels, one IPsec tunnel, one layer-2 cross-connect.
         The attachment type is named in each cloud box (and the legend), not on the lines, which bunch together near the PoP. */
      const PX = CX + 20, PY = FY - 36;
      s += fl(`M${PX} ${PY - 6}C500 ${PY - 40} 530 ${Y[0] + 36} ${BX} ${Y[0] + 36}`, 'fl-tun', {dur: 1.1});
      s += fl(`M${PX} ${PY - 2}C500 ${PY - 10} 530 ${Y[1] + 36} ${BX} ${Y[1] + 36}`, 'fl-tun', {dur: 1.1});
      s += fl(`M${PX} ${PY + 4}C500 ${PY + 14} 530 ${Y[2] + 36} ${BX} ${Y[2] + 36}`, 'fl-ipsec', {dur: 1.1});
      s += fl(`M${PX} ${PY + 10}C500 ${PY + 50} 530 ${Y[3] + 36} ${BX} ${Y[3] + 36}`, 'fl-priv', {np: 0});

      /* the PoPs sit on the ring, above the flows */
      s += fpin(LX, FY, 20, 'PoP', {fs: 9});
      s += fpin(CX, FY, 22, 'PoP', {halo: true});
      s += T(LX, 352, 'London PoP', 'f-t', 'middle');
      s += T(CX, 352, 'Cloud-adjacent PoP', 'f-t', 'middle');

      s += pill(330, 432, 'same policy · same visibility as every physical site', 'g');
      return s;
    },
    title: 'Cloud datacentres connected to the Cato WAN by vSocket, IPsec and cross-connect',
    desc: 'Glasgow and London DC reach every cloud datacentre across the global private backbone: an Azure VNet and an AWS VPC attach by vSocket HA pairs, Azure Virtual WAN by IPsec, and an AWS region by a layer-2 cross-connect at the PoP, all under the same policy and visibility.',
    legend: [['tun', 'Socket / vSocket tunnels · DTLS'], ['ipsec', 'IPsec · IKEv2 from the cloud gateway'], ['priv', 'Layer-2 cross-connect at the PoP (no tunnel)'], ['hot', 'Backbone — same policy as physical sites'], 'live'],
  }],
});
