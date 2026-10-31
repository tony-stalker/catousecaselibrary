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
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, L, R, tier, pill, mark, badge, fpin, ring, cloud, site} = K;
      let s = '';
      const B = 232;                                  // the path baseline (PoP heads, ring centre)
      const PA = 350, PB = 560, PR = 22, TIP = B + PR * 1.7;

      s += tier(14, 30, 'ONE PLATFORM · EVERY HOP THE TRAFFIC TAKES IS MEASURED');

      /* ---- LEFT · the two sources (segment 1: the device) ---- */
      s += nd(20, B - 122, 170, 58, {t: 'Remote user', s: ['Priya · Cato Client'], ic: 'laptop'});
      s += site(12, B + 40, 186, 92, 'Bristol Office');
      s += nd(20, B + 58, 170, 58, {t: 'Socket X1500', s: ['site traffic'], ic: 'building'});
      s += badge(190, B - 122, 1) + badge(190, B + 58, 1);

      /* ---- segment 2 · the ISP last mile into the London PoP, degraded (amber) ---- */
      const MX = 232;
      s += fl(`M190 ${B - 93}C214 ${B - 93} 208 ${B} ${MX} ${B}`, 'fl-tun', {dur: 1.2});
      s += fl(`M190 ${B + 87}C214 ${B + 87} 208 ${B} ${MX} ${B}`, 'fl-tun', {dur: 1.2});
      s += fl(L(MX, B, PA - PR, B), 'fl-ha', {dur: 1.6});
      s += T(282, B - 10, 'ISP last mile', 'f-m', 'middle');
      s += badge(258, B + 26, 2) + pill(298, B + 26, 'Fair', 'y');

      /* ---- CENTRE · two PoPs on the Global Private Backbone (segment 3) ---- */
      const RG = {cx: (PA + PB) / 2, cy: B, rx: (PB - PA) / 2, ry: 26};
      s += ring(RG);
      s += fl(`M${PA} ${B}A${RG.rx} ${RG.ry} 0 0 0 ${PB} ${B}`, 'fl-tun', {dur: 1.8});
      s += T(RG.cx, B + 62, 'Global Private Backbone', 'f-s', 'middle');
      s += badge(RG.cx, B - RG.ry - 4, 3);

      /* ---- RIGHT · the applications (segment 4) ---- */
      s += fl(L(PB + PR, B, 626, B), 'fl-flow', {arrow: true, dur: 1});
      s += cloud(682, B, .9, 'SaaS app', 'Microsoft 365');
      s += site(578, B + 82, 176, 92, 'London DC');
      s += nd(582, B + 100, 168, 58, {t: 'Private app', s: ['London DC Socket'], ic: 'server'});
      s += fl(`M${PB + 6} ${B + 30}C${PB + 6} ${B + 100} ${PB + 6} ${B + 129} 582 ${B + 129}`, 'fl-tun', {arrow: 'arr-ms', dur: 1.4});
      s += badge(604, B - 22, 4);

      /* the PoP pins, drawn after the flows so the flows meet beneath their heads */
      s += fpin(PA, TIP, PR, 'PoP', {halo: true}) + fpin(PB, TIP, PR, 'PoP');
      s += T(PA, B - 64, 'Cato PoP — London', 'nd-t g', 'middle') + T(PA, B - 50, 'single-pass engine', 'f-s', 'middle');
      s += T(PB, B - 64, 'Cato PoP — egress', 'nd-t g', 'middle') + T(PB, B - 50, 'nearest the app', 'f-s', 'middle');

      /* ---- BOTTOM · one score per segment; only segment 2 is off-green ---- */
      s += tier(14, 426, 'EXPERIENCE MONITORING · EACH SEGMENT SCORED ON ITS OWN');
      s += T(14, 446, 'The one off-green node is the fault domain: here, the ISP last mile.', 'f-t');
      const CW = 176, CG = 9, CY = 476;
      [
        ['1 Device', 'CPU · memory · Wi-Fi', 'ok'],
        ['2 Last mile — Fair', 'tunnel loss · RTT · jitter', 'warn'],
        ['3 Backbone', 'PoP to PoP', 'ok'],
        ['4 Application', 'TTFB · TCP · TLS', 'ok'],
      ].forEach(([t, sub, k], i) => {
        const x = 14 + i * (CW + CG);
        s += nd(x, CY, CW, 58, {cls: 'soft', t, s: [sub]}) + mark(x + CW / 2, CY, k);
      });
      return s;
    },
    title: 'Same engine, seen from the telemetry side',
    desc: 'Because the Client, the Socket, the PoP and the private backbone are one platform, every hop from the device through the last mile and backbone to the application is measured and scored separately; the one off-green segment is the fault domain.',
    legend: [['tun', 'User and site traffic through the engine, measured at every hop'], ['ha', 'Degraded segment — scored Fair'], ['flow', 'Egress PoP to the SaaS app'], 'live'],
  }],
});
