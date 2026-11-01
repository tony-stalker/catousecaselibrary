/* specs/demo-dem.js — Demo Segment 7: Digital Experience Monitoring */
DG.page('demo-dem', {
  spotlight: {
    hl: ['users', 'branch', 'pop', 'backbone', 'saas', 'dc', 'mgmt'],
    mods: [],
    flows: [{p: 'us1'}, {p: 'br1'}, {p: 'r-LC'}, {p: 'r-CR'}, {p: 'eg-saas'}, {p: 'dc1', rev: true}],
    steps: [
      {t: 'The Cato Client on the device and the Socket at the site supply the telemetry; no extra agent to deploy.', marks: ['users', 'branch']},
      {t: 'The PoP and the global private backbone are the same platform, so every hop the traffic takes is measured.', marks: ['pop', 'backbone']},
      {t: 'Each application is scored against an AI baseline built from real traffic for that application.', marks: ['saas', 'dc']},
      {t: 'Experience Monitoring scores each segment on its own; the one off-green node is the fault domain.', marks: ['mgmt']},
    ],
    anchors: {mgmt: [782, 132], saas: [302, 310], backbone: [1262, 528]},   // markers clear of the CMA and "Smart egress" subtitles and the ring label
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 500',
    draw: K => {
      const {nd, fl, T, L, tier, pill, mark, badge, fpin, ring, cloud, site} = K;
      let s = '';
      const B = 262;                                  // the path baseline: LAN gateway, last mile, PoP heads, ring centre
      const PA = 350, PB = 560, PR = 22, TIP = B + PR * 1.7;

      s += tier(14, 22, 'ONE PLATFORM · EVERY HOP THE TRAFFIC TAKES IS MEASURED');

      /* ---- LEFT · the office: device, Wi-Fi, LAN gateway (nodes 1-3) ---- */
      s += site(12, 46, 214, 248, 'Office site');
      s += nd(24, 66, 190, 52, {t: 'Device', s: ['Marcus · Cato Client'], ic: 'laptop'});
      s += nd(24, 150, 190, 52, {t: 'Wi-Fi', s: ['office access point'], ic: 'wifi'});
      s += nd(24, 234, 190, 52, {t: 'LAN gateway', s: ['site Socket'], ic: 'building'});
      s += fl(L(119, 118, 119, 150), 'fl-tun', {dur: .8});
      s += fl(L(119, 202, 119, 234), 'fl-tun', {dur: .8});
      s += badge(214, 66, 1) + badge(214, 150, 2) + badge(214, 234, 3);

      /* ---- node 4 · the ISP last mile into the London PoP, degraded (amber) ---- */
      s += fl(L(214, B, PA - PR, B), 'fl-ha', {dur: 1.6});
      s += T(272, B - 10, 'last mile', 'f-m', 'middle');
      s += badge(250, B + 26, 4) + pill(290, B + 26, 'Fair', 'y');

      /* ---- CENTRE · the London PoP (node 5) and the Global Private Backbone ---- */
      const RG = {cx: (PA + PB) / 2, cy: B, rx: (PB - PA) / 2, ry: 26};
      s += ring(RG);
      s += fl(`M${PA} ${B}A${RG.rx} ${RG.ry} 0 0 0 ${PB} ${B}`, 'fl-tun', {dur: 1.8});
      s += T(RG.cx, B + 62, 'Global Private Backbone', 'f-s', 'middle');

      /* ---- RIGHT · the applications (node 6) ---- */
      s += fl(`M${PB + PR} ${B}C604 ${B} 600 ${B - 72} 628 ${B - 72}`, 'fl-flow', {arrow: true, dur: 1});
      s += cloud(682, B - 72, .9, 'SaaS app', 'Microsoft 365');
      s += site(596, B + 24, 158, 84, 'Data centre');
      s += nd(604, B + 42, 142, 54, {t: 'Private app', s: ['DC Socket'], ic: 'server'});
      s += fl(`M${PB + PR - 4} ${B + 10}C596 ${B + 24} 572 ${B + 69} 604 ${B + 69}`, 'fl-tun', {arrow: 'arr-ms', dur: 1.4});
      s += badge(628, B - 106, 6) + badge(746, B + 42, 6);

      /* the PoP pins, drawn after the flows so the flows meet beneath their heads */
      s += fpin(PA, TIP, PR, 'PoP', {halo: true}) + fpin(PB, TIP, PR, 'PoP');
      s += badge(PA - 26, B - 26, 5);
      s += T(PA, B - 64, 'Cato PoP — London', 'nd-t g', 'middle') + T(PA, B - 50, 'single-pass engine', 'f-s', 'middle');
      s += T(PB, B - 64, 'Cato PoP', 'nd-t g', 'middle') + T(PB, B - 50, 'nearest the app', 'f-s', 'middle');

      /* ---- BOTTOM · one score per node; only the last mile is off-green ---- */
      s += tier(14, 372, 'EXPERIENCE MONITORING · EACH NODE SCORED ON ITS OWN');
      s += T(14, 392, 'The one off-green node is the fault domain: here, the last mile.', 'f-t');
      const CW = 116, CG = 8, CY = 420;
      [
        ['1 Device', 'CPU · memory', 'ok'],
        ['2 Wi-Fi', 'signal strength', 'ok'],
        ['3 LAN gateway', 'loss · latency', 'ok'],
        ['4 Last mile', 'Fair · loss · RTT', 'warn'],
        ['5 PoP', 'loss · latency', 'ok'],
        ['6 Application', 'TTFB · baseline', 'ok'],
      ].forEach(([t, sub, k], i) => {
        const x = 14 + i * (CW + CG);
        s += nd(x, CY, CW, 58, {cls: 'soft', t, s: [sub]}) + mark(x + CW / 2, CY, k);
      });
      return s;
    },
    title: 'Same engine, seen from the telemetry side',
    desc: 'Because the Client, the Socket, the PoP and the private backbone are one platform, every node from the device through the Wi-Fi, LAN gateway, last mile and PoP to the application is measured and scored separately; the one off-green node is the fault domain.',
    legend: [['tun', 'User and site traffic through the engine, measured at every hop'], ['ha', 'Degraded node — scored Fair'], ['flow', 'PoP to the SaaS app'], 'live'],
  }],
});
