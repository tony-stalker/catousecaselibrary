/* specs/network-global-expansion.js — Global Expansion & China Connectivity */
DG.page('network-global-expansion', {
  spotlight: {
    anchors: {backbone: [1172, 566]},   // step-1 marker on the ring, clear of the '100+ PoPs · 99.999% SLA' text
    hl: ['branch', 'users', 'pop', 'backbone', 'dc'],
    mods: ['sdwan', 'sse'],
    flows: [{p: 'br1'}, {p: 'br2'}, {p: 'us1'}, {p: 'r-LC'}, {p: 'r-CR'}, {p: 'r-RL'}, {p: 'dc1', rev: true}],
    steps: [
      {t: 'The backbone of 100+ PoPs already exists in the target region, with the full security stack in every PoP.', marks: ['backbone', 'pop']},
      {t: 'A zero-touch Socket ships direct to the new office; anyone who can plug in power and WAN installs it.', marks: ['branch']},
      {t: 'The landing team works from day one on the Cato Client or over IPsec while the hardware is in transit.', marks: ['users']},
      {t: 'On connecting to its nearest PoP, the new site inherits the same policy and visibility as the whole estate.', marks: ['dc']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, tier, site, ring, fpin, pinTop, fy, by} = K;
      let s = '';

      /* ---- the backbone: one wide ring across the centre, four PoP pins standing on it ---- */
      const RG = {cx: 380, cy: 240, rx: 300, ry: 60};
      s += ring(RG, '');
      s += T(380, 238, 'Cato Global Private Backbone', 'f-h', 'middle');
      s += T(380, 254, '100+ PoPs · full security stack in every PoP', 'f-s', 'middle');

      const PR = 16;
      const pin = (x, lab, sub) => {
        const tip = by(RG, x);
        let p = fpin(x, tip, PR, 'PoP', {halo: true});
        p += T(x, tip + 26, lab, 'nd-t g', 'middle');
        if (sub) p += T(x + (x === LON ? 14 : 0), tip + 40, sub, 'f-s', 'middle');
        return p;
      };
      const LON = 170, MAD = 310, JNB = 450, SYD = 590;
      s += pin(LON, 'London PoP', 'FWaaS · IPS · ZTNA · WAN opt.');
      s += pin(MAD, 'Madrid PoP');
      s += pin(JNB, 'Johannesburg PoP');
      s += pin(SYD, 'Sydney PoP');

      /* every site reaches every other over the backbone — same policy, same visibility */
      s += fl(`M${LON} ${fy(RG, LON).toFixed(1)}A${RG.rx} ${RG.ry} 0 0 0 ${SYD} ${fy(RG, SYD).toFixed(1)}`, 'fl-hot', {n: 3, dur: 3});

      /* ---- top row: the existing estate on the left, new sites with hardware or IPsec to the right ---- */
      s += nd(14, 40, 176, 54, {t: 'London DC', s: ['Existing estate · X1500'], ic: 'server', is: 20, icls: 'g'});
      s += fl(`M102 94C102 126 ${LON} 118 ${LON} ${pinTop(by(RG, LON), PR).toFixed(1)}`, 'fl-tun', {dur: 1.4});

      s += nd(232, 40, 176, 54, {t: 'Madrid Office', s: ['Socket X1600 · zero-touch'], ic: 'building', is: 20, icls: 'g'});
      s += fl(`M320 94C320 112 ${MAD} 112 ${MAD} ${pinTop(by(RG, MAD), PR).toFixed(1)}`, 'fl-tun', {dur: 1.2});

      s += nd(570, 40, 176, 54, {t: 'aws-sydney-ipsec', s: ['Sydney · IPsec · day one'], ic: 'cpu', is: 20, icls: 'g'});
      s += fl(`M658 94C658 126 ${SYD} 118 ${SYD} ${pinTop(by(RG, SYD), PR).toFixed(1)}`, 'fl-ipsec', {dur: 1.4});

      /* ---- bottom right: a new plant whose users are already on-net while the Socket is in transit ---- */
      s += site(420, 372, 326, 150, 'NEW PLANT — DAY 1');
      s += nd(432, 398, 148, 54, {t: 'Landing team', s: ['Users on Cato Client'], ic: 'laptop', is: 20, icls: 'g', cls: 'hot'});
      s += nd(596, 398, 138, 54, {t: 'Socket X1500', s: ['in transit'], cls: 'dash'});
      s += T(583, 492, 'same nearest PoP before and after the Socket arrives', 'f-s', 'middle');
      s += fl(`M506 398C506 360 ${JNB - 4} 340 ${JNB - 4} ${(fy(RG, JNB) + 6).toFixed(1)}`, 'fl-https', {dur: 1.4});
      s += fl(`M665 398C665 350 ${JNB + 10} 352 ${JNB + 10} ${(fy(RG, JNB) + 6).toFixed(1)}`, 'fl-tun fl-dim', {np: 0});

      /* ---- bottom left: Shanghai joins compliantly through a licensed local partner ---- */
      s += nd(14, 446, 176, 60, {t: 'Shanghai office', s: ['Compliant on-ramp', 'via licensed partner'], ic: 'building', is: 20, icls: 'g'});
      s += fl(`M102 446C102 400 235 372 235 ${(fy(RG, 235) + 6).toFixed(1)}`, 'fl-priv', {dur: 1.6, label: 'licensed local partner', lx: 214, ly: 386, lcls: 'm'});
      s += T(214, 408, 'in-country presence', 'f-m', 'middle');
      return s;
    },
    title: 'A growing global footprint joining the Cato backbone through nearest PoPs',
    desc: 'The existing London DC connects to the London PoP; new sites join on their nearest PoPs — Madrid over a zero-touch Socket, Sydney over IPsec, and a new plant whose day-one users are on the Cato Client while its Socket is in transit — and a Shanghai office joins compliantly through a licensed local partner.',
    legend: [['tun', 'Zero-touch Socket — nearest-PoP on-ramp'], ['ipsec', 'IPsec on day one, no Cato hardware'], ['https', 'Users on the Cato Client while hardware ships'], ['priv', 'Compliant China on-ramp via licensed local partner'], ['hot', 'Global private backbone — same policy everywhere'], 'live'],
  }],
});
