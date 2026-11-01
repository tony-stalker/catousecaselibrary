/* specs/migration-journey-zscaler.js — Zscaler to Cato: Animated Phased Journey
   Five phase SVGs share one geometry: branch and Priya on the left, the Cato PoP on the backbone above,
   the Zscaler ZIA cloud below, and three destinations on the right. Only the lanes (and node states) change. */
const ZS_VB = '0 0 960 500';
const ZS_LEGEND = [
  ['tun', 'On Cato — Sockets, vSockets, PoP egress'],
  ['ha', 'Interim co-existence (ZIA / dual agent)'],
  ['net', 'Legacy Zscaler: GRE/IPsec, ZCC, ZPA (live / dormant)'],
  ['down', 'Retired & decommissioned'],
];
/* n = page phase 0..4 */
const zsScene = n => K => {
  const {nd, fl, T, pill, ring, fpin, fy, cloud, xmark} = K;
  let s = '';
  const RG = {cx: 480, cy: 104, rx: 170, ry: 36};
  const PX = 480, TIP = Math.round(fy(RG, PX)), PR = 20;   // PoP pin on the front of the ring; head centre = TIP - 34

  /* ---- Cato: backbone ring + PoP (from phase 1) ---- */
  if (n >= 1) {
    s += ring(RG);
    s += T(PX, 28, 'Cato PoP', 'nd-t g', 'middle');
    const sub = ['', 'Cato Global Backbone', 'SWG · CASB · TLSi at the PoP', 'SWG · CASB · TLSi at the PoP', 'one client · one platform'][n];
    if (sub) s += pill(PX, 45, sub, 'g keep');
  }

  /* ---- Zscaler ZIA cloud (lower band) ---- */
  const zSub = ['internet security · ZPA', 'internet security · ZPA', 'internet security · ZPA', 'draining to standby', 'decommissioned'][n];
  const zc = cloud(PX, 420, 1.3, 'Zscaler ZIA', zSub, n === 4 ? 'bad' : '');
  s += n >= 3 ? `<g opacity="${n === 3 ? 0.55 : 0.5}">${zc}</g>` : zc;

  /* ---- legacy lanes: edges into ZIA ---- */
  const edgeCls = ['fl-net', 'fl-net', 'fl-net fl-dim', 'fl-net fl-dim', null][n];
  if (edgeCls) {
    const o = n >= 2 ? {np: 0} : {dur: 2.4};
    s += fl('M210 86C300 130 380 300 434 386', edgeCls, o);
    /* Priya's ZCC lane: grey while ZCC alone fronts her; amber 'side by side' with the Cato Client in phase 2, static in phase 3 */
    if (n <= 1) s += fl('M210 420C300 420 350 420 404 420', edgeCls, o);
    else s += fl('M210 420C300 420 350 420 404 420', 'fl-ha', n === 2 ? {dur: 2.2, label: 'ZCC side by side', lx: 300, ly: 442, lcls: 'y'}
      : {np: 0, label: 'ZCC side by side', lx: 300, ly: 442, lcls: 'y'});
  }
  /* ---- legacy lanes: ZIA out to the internet and, over ZPA / backhaul, to the private apps ---- */
  const outCls = ['fl-net', 'fl-net', 'fl-net', 'fl-net fl-dim', 'fl-down'][n];
  const og = n === 4 ? {np: 0, g: 'zs-retired'} : n === 3 ? {np: 0} : {dur: 2.4};
  const outLanes = ['M546 392C670 330 712 170 750 88', 'M556 420C640 410 690 270 750 260', 'M552 446C640 456 690 432 750 430'];
  outLanes.forEach(d => { s += n === 4 ? `<g opacity="0.65">${fl(d, outCls, og)}</g>` : fl(d, outCls, og); });
  if (n <= 2) s += pill(650, 476, 'ZPA / backhaul', 'm');

  /* ---- Cato lanes ---- */
  if (n >= 1) {
    /* the private-app rail: PoP to the London DC Socket and the AWS vSocket */
    s += fl('M500 112C590 140 680 220 750 246', 'fl-tun', {dur: 1.6});
    s += fl('M494 128C560 220 660 360 750 404', 'fl-tun', {dur: 1.8});
    if (n === 1) s += pill(600, 190, 'private-app rail', 'g');
  }
  if (n >= 2) {
    /* branch Socket and Priya's Client into the PoP, internet breakout at the PoP */
    s += fl('M210 64C300 52 400 70 460 104', 'fl-tun', {dur: 1.4});
    s += fl('M210 404C320 370 420 230 466 126', 'fl-tun', {dur: 1.6});
    s += fl('M500 98C590 70 680 62 750 62', 'fl-tun', {dur: 1.4});
  }
  if (n === 2 || n === 3) {
    /* dual agent: on-site ZCC rides inside the branch Socket tunnel; remote, ZCC runs side by side with the Cato Client */
    s += pill(300, 40, 'ZCC inside the tunnel', 'y');
  }
  if (n === 2) s += fl('M480 146V372', 'fl-ha', {dur: 1.8, label: 'interim IPsec fallback', lx: 480, ly: 300, lcls: 'y'});
  if (n === 3) s += fl('M480 146V372', 'fl-net fl-dim', {np: 0, label: 'dormant fallback', lx: 480, ly: 300, lcls: 'm'});

  /* ---- PoP pin drawn over the lanes that meet it ---- */
  if (n >= 1) s += fpin(PX, TIP, PR, 'PoP', {halo: true});
  if (n === 4) s += xmark(PX, 392);

  /* ---- left column: the branch and the remote user ---- */
  const brOn = n >= 2, prOn = n >= 2;
  s += nd(30, 40, 180, 60, {t: 'Branch site', s: [brOn ? 'Cato Socket' : 'GRE/IPsec to ZIA'], ic: 'building', is: 20,
    icls: brOn ? 'g' : '', cls: brOn ? 'pop' : 'soft'});
  s += nd(30, 390, 180, 60, {t: 'Priya · remote', s: [['ZCC to ZIA', 'ZCC to ZIA', 'ZCC + Cato Client', 'ZCC + Cato Client', 'Cato Client only'][n]],
    ic: 'laptop', is: 20, icls: prOn ? 'g' : '', cls: prOn ? 'pop' : 'soft'});

  /* ---- right column: the destinations ---- */
  s += nd(750, 32, 180, 60, {t: 'Internet & SaaS', s: [['egress via ZIA', 'egress via ZIA', 'pilot via Cato PoP', 'egress via Cato', 'egress via Cato'][n]],
    ic: 'globe', is: 20, icls: n >= 3 ? 'g' : '', cls: n >= 3 ? 'pop' : 'soft'});
  const appOn = n >= 1;
  s += nd(750, 222, 180, 60, {t: 'London DC', s: [appOn ? 'private apps · Socket' : 'private apps'], ic: 'server', is: 20,
    icls: appOn ? 'g' : '', cls: appOn ? 'pop' : 'soft'});
  s += nd(750, 400, 180, 60, {t: 'AWS eu-west-2', s: [appOn ? 'private apps · vSocket' : 'private apps'], ic: 'db', is: 20,
    icls: appOn ? 'g' : '', cls: appOn ? 'pop' : 'soft'});
  return s;
};

DG.page('migration-journey-zscaler', {
  spotlight: {
    hl: ['branch', 'users', 'dc', 'cloud', 'saas', 'pop'],
    mods: ['sse'],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'dc1'}, {p: 'cl-aws'}, {p: 'eg-www'}, {p: 'eg-saas'}],
    steps: [
      {t: 'The private-app rail moves first — a London DC Socket and an AWS vSocket — while ZIA fronts the internet.', marks: ['dc', 'cloud']},
      {t: 'Pilot: the branch Socket and Priya\'s Cato Client swing to the PoP; on-site, ZCC rides inside the tunnel.', marks: ['branch', 'users']},
      {t: 'Cohorts follow in waves on the dual-agent bridge while ZIA, one flip away over IPsec, drains to standby.', marks: ['pop']},
      {t: 'ZCC uninstalled, ZIA and ZPA decommissioned: internet and private apps on one client, one platform.', marks: ['saas']},
    ],
    anchors: {saas: [318, 318]},
  },
  diagrams: [
    {slot: 'phase-1', vb: ZS_VB, draw: zsScene(0), legend: ZS_LEGEND,
      title: 'Zscaler to Cato — phase 0: On Zscaler',
      desc: 'Baseline: GRE/IPsec from the branch and ZCC on Priya\'s laptop into ZIA for internet, with ZPA and backhaul carrying them to the private apps in London DC and AWS eu-west-2.'},
    {slot: 'phase-2', vb: ZS_VB, draw: zsScene(1), legend: ZS_LEGEND,
      title: 'Zscaler to Cato — phase 1: Rail first',
      desc: 'The private-app rail goes green before any user moves: a Socket in London DC and a vSocket in AWS eu-west-2, while ZIA still fronts the internet.'},
    {slot: 'phase-3', vb: ZS_VB, draw: zsScene(2), legend: ZS_LEGEND,
      title: 'Zscaler to Cato — phase 2: Pilot cutover',
      desc: 'Pilot cutover: the branch Socket and Priya\'s Cato Client swing to the PoP for private apps and SWG, ZCC rides inside the tunnel and interim IPsec keeps ZIA one flip away.'},
    {slot: 'phase-4', vb: ZS_VB, draw: zsScene(3), legend: ZS_LEGEND,
      title: 'Zscaler to Cato — phase 3: Waves',
      desc: 'The remaining cohorts swap in waves on the same dual-agent bridge while ZIA drains to standby: its egress, the ZPA lanes and the fallback all go dormant.'},
    {slot: 'phase-5', vb: ZS_VB, draw: zsScene(4), legend: ZS_LEGEND,
      title: 'Zscaler to Cato — phase 4: ZIA / ZCC retired',
      desc: 'ZCC is uninstalled and ZIA and ZPA decommissioned: internet from the PoP, private apps over the London DC Socket and the AWS vSocket — one client, one platform.'},
  ],
  picSlot: 'phase-5',
});
