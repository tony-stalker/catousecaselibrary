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
      const {nd, fl, T, R, ring, fpin, pinTop, fy, by} = K;
      let s = '';

      /* ---- the backbone: one wide ring across the centre, four PoP pins standing on it ---- */
      const RG = {cx: 380, cy: 240, rx: 300, ry: 60};
      s += ring(RG, '');
      s += T(410, 238, 'Cato Global Private Backbone', 'f-h', 'middle');
      s += T(410, 254, '100+ PoPs · full security stack in every PoP', 'f-s', 'middle');

      /* back-edge pins carry the top-row sites; front-edge pins carry the sites below the ring */
      const PR = 18, FS = 8;
      const LON = 170, MAD = 310, SYD = 590, CHN = 270, JNB = 560;
      const back = (x, lab, sub, dx = 0) => {
        const tip = by(RG, x);
        let p = fpin(x, tip, PR, 'PoP', {halo: true, fs: FS});
        p += T(x + dx, tip + 26, lab, 'nd-t g', 'middle');
        if (sub) p += T(x + 14, tip + 40, sub, 'f-s', 'middle');
        return p;
      };
      const fTip = x => fy(RG, x);
      s += back(LON, 'London PoP', 'FWaaS · IPS · ZTNA · WAN opt.');
      s += back(MAD, 'Madrid PoP');
      s += back(SYD, 'Sydney PoP', null, -12);

      /* every site reaches every other over the backbone — same policy, same visibility */
      s += fl(`M${LON} ${fy(RG, LON).toFixed(1)}A${RG.rx} ${RG.ry} 0 0 0 ${SYD} ${fy(RG, SYD).toFixed(1)}`, 'fl-hot', {n: 3, dur: 3});

      /* ---- top row: the existing estate on the left, new sites with hardware or IPsec to the right ---- */
      s += nd(14, 40, 176, 54, {t: 'London DC', s: ['Existing estate · X1500'], ic: 'server', is: 20, icls: 'g'});
      s += fl(`M102 94C102 126 ${LON} 118 ${LON} ${pinTop(by(RG, LON), PR).toFixed(1)}`, 'fl-tun', {dur: 1.4});

      s += nd(232, 40, 196, 54, {t: 'Madrid Office', s: ['Socket X1600 · zero-touch'], ic: 'building', is: 20, icls: 'g'});
      s += fl(`M${MAD} 94C${MAD} 108 ${MAD} 112 ${MAD} ${pinTop(by(RG, MAD), PR).toFixed(1)}`, 'fl-tun', {dur: 1.2});

      s += nd(570, 40, 176, 54, {t: 'aws-sydney-ipsec', s: ['Sydney · IPsec · day one'], ic: 'cpu', is: 20, icls: 'g'});
      s += fl(`M658 94C658 126 ${SYD} 118 ${SYD} ${pinTop(by(RG, SYD), PR).toFixed(1)}`, 'fl-ipsec', {dur: 1.4});

      /* ---- bottom right: a new plant whose users are already on-net while the Socket is in transit ---- */
      /* the site tag sits on the bottom edge, so both lines leave through a clear top edge */
      s += R(420, 368, 326, 150, 'site-box', 18) + R(438, 509, 128, 18, 'tag-bg', 9) + T(449, 522.5, 'NEW PLANT — DAY 1', 'tier g');
      s += nd(432, 392, 148, 54, {t: 'Landing team', s: ['Users on Cato Client'], ic: 'laptop', is: 20, icls: 'g', cls: 'hot'});
      s += `<g style="stroke-dasharray:5 4">${nd(596, 392, 138, 54, {t: 'Socket X1500', s: ['in transit'], cls: 'dash'})}</g>`;   // .nd.dash is not in the ported CSS; dash inline
      s += T(583, 480, 'same nearest PoP before and after the Socket arrives', 'f-s', 'middle');
      s += fl(`M506 392C506 340 ${JNB - 4} 330 ${JNB - 4} ${(fTip(JNB - 4) + 2).toFixed(1)}`, 'fl-https', {dur: 1.4});
      s += fl(`M665 392C665 340 ${JNB + 5} 330 ${JNB + 5} ${(fTip(JNB + 5) + 2).toFixed(1)}`, 'fl-tun fl-dim', {np: 0});

      /* ---- bottom left: Shanghai joins compliantly through a licensed local partner ---- */
      s += nd(14, 446, 176, 60, {t: 'Shanghai office', s: ['Compliant on-ramp', 'via licensed partner'], ic: 'building', is: 20, icls: 'g'});
      s += fl(`M102 446C102 400 ${CHN} 372 ${CHN} ${(fTip(CHN) + 2).toFixed(1)}`, 'fl-priv', {dur: 1.6, label: 'licensed local partner', lx: 222, ly: 392, lcls: 'm'});
      s += T(222, 414, 'in-country presence', 'f-m', 'middle');

      /* the front-edge pins sit above the lines that reach them */
      s += fpin(CHN, fTip(CHN), PR, 'PoP', {halo: true, fs: FS});
      s += T(CHN - 22, 324, 'China PoP', 'nd-t g', 'end');
      s += fpin(JNB, fTip(JNB), PR, 'PoP', {halo: true, fs: FS});
      s += T(JNB + 30, 318, 'Johannesburg PoP', 'nd-t g');
      return s;
    },
    title: 'A growing global footprint joining the Cato backbone through nearest PoPs',
    desc: 'The existing London DC connects to the London PoP; new sites join on their nearest PoPs — Madrid over a zero-touch Socket, Sydney over IPsec, and a new plant whose day-one users reach the Johannesburg PoP on the Cato Client while its Socket is in transit — and a Shanghai office joins the China PoP compliantly through a licensed local partner.',
    legend: [['tun', 'Zero-touch Socket — nearest-PoP on-ramp'], ['ipsec', 'IPsec on day one, no Cato hardware'], ['https', 'Users on the Cato Client while hardware ships'], ['priv', 'Compliant China on-ramp via licensed local partner'], ['hot', 'Global private backbone — same policy everywhere'], 'live'],
  }],
});
