/* specs/migration-zscaler.js — Zscaler (ZIA / ZPA) to Cato */
DG.page('migration-zscaler', {
  spotlight: {
    anchors: {saas: [302, 310]},           // step-3 marker right of the SaaS cloud, clear of the subtitle
    hl: ['users', 'branch', 'pop', 'backbone', 'saas'],
    mods: ['sse', 'uztna'],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'r-LC'}, {p: 'eg-www'}, {p: 'eg-saas'}],
    steps: [
      {t: 'Sockets and the Cato Client take transport and WAN security first; ZCC stays on the endpoint.', marks: ['branch', 'users']},
      {t: 'During transition the PoP backhauls internet traffic to ZIA over parallel IKEv2 IPsec tunnels.', marks: ['pop']},
      {t: 'Converted internet policy is proven on a test cohort, then flipped to direct PoP breakout.', marks: ['saas']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, R, pill, ring, fpin, fy, cloud, popBox, tier} = K;
      let s = '';

      /* ---- centre: the Cato PoP on the global private backbone ---- */
      const RG = {cx: 380, cy: 300, rx: 150, ry: 40};
      s += ring(RG);
      s += popBox(290, 174, 180, 70, 'Cato PoP', 'SWG · CASB/DLP · TLSi');
      s += T(380, 364, 'Global Private Backbone', 'f-s', 'middle');

      /* ---- left: the edges — on Cato first, ZCC still on the endpoint ---- */
      s += tier(14, 44, 'EDGES · ON CATO FIRST');
      s += nd(14, 90, 200, 68, {t: 'Branch site', s: ['Cato Socket', 'WAN + internet via PoP'], ic: 'building', is: 20, icls: 'g'});
      s += nd(14, 300, 200, 56, {t: 'Remote user', s: ['Cato Client + ZCC · dual tunnels'], ic: 'laptop', is: 20, icls: 'g'});
      s += pill(114, 176, 'ZCC rides inside Socket tunnel', 'm');
      s += pill(114, 380, 'ZCC + Cato tunnels side by side', 'm');

      /* Cato tunnels into the PoP */
      s += fl('M214 124C250 124 258 196 290 198', 'fl-tun', {dur: 1.3});
      s += fl('M180 300C180 246 240 226 290 226', 'fl-tun', {dur: 1.3});

      /* ---- right top: internet & SaaS — the target breakout ---- */
      s += tier(560, 44, 'INTERNET · SAAS');
      s += fl('M470 194C520 184 548 146 584 126', 'fl-flow', {dur: 1.1, arrow: 'arr-m', label: 'direct breakout — target', lx: 556, ly: 184, lcls: 'g keep'});
      s += cloud(644, 110, 1.2, 'Internet & SaaS', 'M365 · web · cloud apps');

      /* ---- right bottom: Zscaler ZIA — interim, being retired ---- */
      s += fl('M470 230C540 236 600 320 600 426', 'fl-ha', {dur: 1.8, label: 'IKEv2 IPsec · LB by src / dst', lx: 600, ly: 326, lcls: 'y keep'});
      s += nd(546, 426, 200, 60, {t: 'Zscaler ZIA', s: ['interim · being retired'], ic: 'globe', is: 20, icls: 'g'});
      s += R(546, 426, 200, 60, 'dash-card', 10);
      s += pill(650, 426, 'interim', 'y');
      s += fl('M700 426V152', 'fl-ha', {np: 0, arrow: 'arr-y', label: 'legacy egress', lx: 700, ly: 386, lcls: 'y keep'});

      /* the PoP pin on the front of the ring */
      s += fpin(380, Math.round(fy(RG, 380)) + 2, 22, 'PoP', {halo: true});
      s += T(380, 544, 'Interim ZIA tunnels egress from the Cato PoP nearest Zscaler, over the Tier-1 backbone', 'f-s', 'middle');
      return s;
    },
    title: 'Phased co-existence of Cato and Zscaler ZIA during migration',
    desc: 'Sites and users connect to the nearest Cato PoP; internet traffic is tunnelled on to ZIA over parallel IKEv2 IPsec while policies are converted, then flipped to direct breakout from the Cato PoP — no big-bang cutover.',
    legend: [['tun', 'Cato tunnels — Socket and Client'], ['flow', 'Direct PoP breakout — target'], ['ha', 'Interim backhaul to ZIA (temporary)'], 'live'],
  }],
});
