/* specs/network-cloud-interconnect.js — Cloud Interconnect: Dedicated Circuits to Cloud & DC */
DG.page('network-cloud-interconnect', {
  spotlight: {
    hl: ['dc', 'cloud', 'pop', 'backbone', 'branch', 'users'],
    mods: ['sdwan'],
    anchors: {cloud: [1484, 322]},   // step-1 marker inside the cloud group (between AWS and Azure), clear of the overview's own ④ badge
    flows: [{p: 'dc3'}, {p: 'cl-az'}, {p: 'r-CR'}, {p: 'r-LC'}, {p: 'br1'}, {p: 'us1'}],
    steps: [
      {t: 'Public clouds land their private-link services on an exchange fabric such as Equinix Fabric or Megaport.', marks: ['cloud']},
      {t: 'A private datacentre or colo cage joins by physical cross-connect or the same fabric; no socket, no tunnel.', marks: ['dc']},
      {t: 'One VLAN-coordinated layer-2 circuit carries both into the Cato PoP, where the security stack already sits.', marks: ['popR']},
      {t: 'The interconnect site is just a site: same policy, visibility and backbone routing as every other site.', marks: ['backbone', 'branch', 'users']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, L, pill, tier, ring, fpin, cloud} = K;
      let s = '';

      /* ---- the Cato side: global private backbone with the PoP on its left tip ---- */
      const RG = {cx: 610, cy: 360, rx: 112, ry: 46};
      const PX = 502, PTIP = 362, PR = 24;          // the PoP pin: tip on the ring's left end
      s += ring(RG);
      s += T(RG.cx, 440, 'Cato Global Private Backbone', 'f-s', 'middle');

      /* ---- contrast lane (top): today's IPsec over the public internet, kept as the fallback path ---- */
      s += tier(240, 40, 'TODAY · TUNNEL OVER THE INTERNET');
      s += cloud(330, 96, 1.1, 'Public internet', 'best-effort · variable');
      s += fl('M104 170C104 110 190 96 266 96', 'fl-ha', {np: 0});
      s += fl('M394 96C450 96 470 240 484 306', 'fl-ha', {np: 0, arrow: 'arr-y', label: 'IPsec over the internet', lx: 449, ly: 176, lcls: 'y'});

      /* ---- left: the two kinds of peer ---- */
      s += tier(14, 160, 'PEERS');
      s += nd(14, 170, 180, 72, {t: 'Public clouds', s: ['AWS · Azure · GCP · OCI', 'private-link services'], ic: 'cpu', is: 20, icls: 'g'});
      s += nd(14, 440, 180, 72, {t: 'Private datacentre', s: ['Customer DC · colo cage', 'physical cross-connect'], ic: 'server', is: 20, icls: 'g'});

      /* ---- centre: one exchange fabric, one VLAN, one wire into the PoP ---- */
      s += tier(240, 314, 'ONE FRONT DOOR');
      s += fl('M194 206C230 206 230 342 240 342', 'fl-priv', {dur: 1.2});
      s += fl('M194 476C230 476 230 378 240 378', 'fl-priv', {dur: 1.2});
      s += nd(240, 324, 180, 72, {t: 'Exchange fabric', s: ['Equinix Fabric · Megaport', 'one VLAN, all parties'], ic: 'plug', is: 20, icls: 'g', cls: 'hot'});
      s += fl(L(420, 360, PX - 4, 360), 'fl-priv', {dur: .7, n: 3});
      s += pill(426, 420, 'dedicated layer-2 circuit', 'g');

      /* the PoP: VLAN handoff, then the security stack that already sits there */
      s += fpin(PX, PTIP, PR, 'PoP', {halo: true});
      s += T(532, 290, 'Cato PoP', 'nd-t g') + T(532, 304, 'VLAN handoff · FWaaS · IPS', 'f-s');

      /* interconnect traffic rides the backbone to the rest of the WAN */
      s += fl(`M${RG.cx - RG.rx} ${RG.cy}A${RG.rx} ${RG.ry} 0 0 0 ${RG.cx + RG.rx} ${RG.cy}`, 'fl-hot', {n: 3, dur: 2.4});

      /* ---- right: the rest of the WAN, the same site model ---- */
      s += tier(574, 140, 'THE REST OF THE WAN');
      s += nd(574, 150, 172, 60, {t: 'Branch site', s: ['Bristol Office · Socket'], ic: 'building', is: 20, icls: 'g'});
      s += nd(574, 476, 172, 60, {t: 'Remote users', s: ['SDP Client · ZTNA'], ic: 'users', is: 20, icls: 'g'});
      s += fl('M700 210V333', 'fl-tun', {dur: 1.2});
      s += fl('M700 476V387', 'fl-https', {dur: 1.2});
      return s;
    },
    title: 'Cloud Interconnect: one layer-2 circuit into the PoP',
    desc: 'Public clouds via their private-link services and a private datacentre via physical cross-connect converge on an exchange fabric such as Equinix Fabric or Megaport; one VLAN-coordinated layer-2 circuit carries both into the Cato PoP and onto the global private backbone, moving these flows off IPsec over the public internet.',
    legend: [['priv', 'Dedicated layer-2 interconnect — private, deterministic'], ['ha', 'IPsec over the internet — today\'s path, kept as fallback'], ['hot', 'Interconnect traffic on the backbone'], ['tun', 'Branch Socket tunnel'], ['https', 'Remote users · SDP Client'], 'live'],
  }],
});
