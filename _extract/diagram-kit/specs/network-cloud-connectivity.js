/* specs/network-cloud-connectivity.js — Cloud Connectivity: vSocket vs IPsec vs Cloud Interconnect */
DG.page('network-cloud-connectivity', {
  spotlight: {
    hl: ['cloud', 'pop', 'backbone', 'branch', 'dc'],
    mods: ['sdwan'],
    flows: [{p: 'cl-aws'}, {p: 'cl-az'}, {p: 'cl-gcp'}, {p: 'cl-pv'}, {p: 'r-CR'}, {p: 'r-LC'}, {p: 'br1'}, {p: 'dc1', rev: true}],
    steps: [
      {t: 'Azure, AWS and GCP can attach by vSocket: a Cato VM in the VNet or VPC building DTLS tunnels to the PoP.', marks: ['cloud']},
      {t: 'All four clouds, including OCI, can attach by IPsec from the provider\'s native VPN gateway.', marks: ['cloud', 'popR']},
      {t: 'A private layer-2 Cloud Interconnect circuit via a fabric provider reaches the PoP with no tunnel.', marks: ['popR']},
      {t: 'Whichever door is used, the tenant lands on the same backbone, policy set and console as every site.', marks: ['backbone', 'pop']},
    ],
    anchors: {cloud: [1500, 470]},   // 1 · 2 marker clear of the cloud component badge, in the gap right of GCP
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, R, tier, cloud, fpin, ring, pill} = K;
      let s = '';
      /* section labels: four clouds → three doors → one WAN */
      s += tier(14, 16, 'FOUR CLOUDS') + T(380, 16, 'THREE DOORS IN', 'tier', 'middle') + T(746, 16, 'ONE WAN', 'tier', 'end');

      /* LEFT · the four cloud tenants and their constructs */
      const CL = [
        {y: 56,  t: 'Azure', sub: 'VNets · vWAN'},
        {y: 170, t: 'AWS',   sub: 'VPCs · TGW'},
        {y: 284, t: 'GCP',   sub: 'VPCs · Cloud Router'},
        {y: 398, t: 'OCI',   sub: 'VCNs · DRG'},
      ];
      CL.forEach(c => {
        s += R(14, c.y, 170, 66, 'nd soft', 12) + cloud(160, c.y + 18, .24);
        s += T(28, c.y + 30, c.t, 'nd-t') + T(28, c.y + 48, c.sub, 'nd-s');
      });
      s += pill(99, 480, 'no vSocket option', 'r keep');
      const cy = i => CL[i].y + 33;        // cloud mid-y: 89 · 203 · 317 · 431

      /* MIDDLE · the three doors (x 280–480; mid-y 110 · 262 · 414) */
      const DX = 280, DW = 200, DR = DX + DW;
      s += nd(DX, 74,  DW, 72, {t: 'vSocket',            s: ['Azure · AWS · GCP',  'Cato VM in the VNet/VPC'],    ic: 'cpu',  is: 22, icls: 'g', cls: 'hot'});
      s += nd(DX, 226, DW, 72, {t: 'IPsec site',         s: ['all four clouds',    'native VPN gateway · IKEv2'], ic: 'lock', is: 22, icls: 'g', cls: 'hot'});
      s += nd(DX, 378, DW, 72, {t: 'Cloud Interconnect', s: ['all four clouds',    'private L2 via fabric'],      ic: 'plug', is: 22, icls: 'g', cls: 'hot'});

      /* cloud → door. Faint lines first: Azure / AWS / GCP may also use IPsec or the interconnect */
      const c2d = (i, y2) => `M184 ${cy(i)}C232 ${cy(i)} 232 ${y2} ${DX} ${y2}`;
      [248, 256, 264].forEach((y2, i) => { s += fl(c2d(i, y2), 'fl-ipsec fl-dim', {np: 0}); });
      [400, 408, 416].forEach((y2, i) => { s += fl(c2d(i, y2), 'fl-flow fl-dim', {np: 0}); });
      /* the doors each cloud is drawn taking: Azure, AWS, GCP → vSocket; OCI → IPsec, and FastConnect → Cloud Interconnect */
      [96, 110, 124].forEach((y2, i) => { s += fl(c2d(i, y2), 'fl-tun', {dur: 1.2}); });
      s += fl(c2d(3, 276), 'fl-ipsec', {dur: 1.3});
      s += fl(c2d(3, 426), 'fl-priv', {np: 0, label: 'FastConnect', lx: 242, ly: 446, lcls: 'm keep'});

      /* RIGHT · one PoP on the global private backbone */
      const RG = {cx: 620, cy: 262, rx: 112, ry: 44};
      s += ring(RG);
      s += fl(`M${DR} 110C540 110 560 238 595 238`, 'fl-tun',   {dur: 1.1});
      s += fl(`M${DR} 262C530 262 550 255 590 255`, 'fl-ipsec', {dur: 1.1});
      s += fl(`M${DR} 414C530 414 590 330 596 274`, 'fl-priv',  {np: 0});
      s += fpin(620, 306, 30, 'PoP', {halo: true});
      s += T(656, 192, 'Cato PoP', 'nd-t g', 'middle') + T(656, 206, 'same PoP, whichever door', 'f-s', 'middle');
      /* labels sit right of the interconnect line, which climbs to the pin at x ≈ 555–575 here */
      s += T(660, 338, 'GLOBAL PRIVATE BACKBONE', 'tier', 'middle');
      s += pill(660, 364, 'one policy set · one console', 'g keep');
      s += T(660, 392, 'same backbone as every site', 'f-s', 'middle');

      /* footer */
      s += T(380, 540, 'Azure · AWS · GCP: any of the three doors  ·  OCI: IPsec or FastConnect into Cloud Interconnect', 'f-m', 'middle');
      return s;
    },
    title: 'Azure, AWS, GCP and OCI reaching the Cato backbone via vSocket, IPsec or Cloud Interconnect',
    desc: 'Four clouds on the left reach one Cato PoP through three doors — vSocket for Azure, AWS and GCP, IPsec from any native gateway, and a private layer-2 Cloud Interconnect circuit — and every door lands on the same backbone, policy set and console; OCI has no vSocket option.',
    legend: [['tun', 'vSocket — DTLS tunnels'], ['ipsec', 'IPsec site — native gateway · IKEv2'], ['priv', 'Cloud Interconnect — private L2 circuit, no tunnel, no encryption overhead'], 'live'],
  }],
});
