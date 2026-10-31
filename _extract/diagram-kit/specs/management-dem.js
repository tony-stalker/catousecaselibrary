/* specs/management-dem.js — Proactive Digital Experience Monitoring */
DG.page('management-dem', {
  spotlight: {
    hl: ['users', 'pop', 'backbone', 'saas', 'xops', 'mgmt'],
    mods: [],
    flows: [{p: 'us1'}, {p: 'r-LC'}, {p: 'r-CR'}, {p: 'eg-saas'}, {p: 'spine'}],
    steps: [
      {t: 'The Cato Client on the device already supplies the telemetry; no extra agents to deploy.', marks: ['users']},
      {t: 'Device, Wi-Fi, LAN gateway, last mile, PoP and application are each scored Good, Fair or Poor.', marks: ['pop']},
      {t: 'The backbone carries the flow PoP to PoP, so Cato observes every hop the traffic actually takes.', marks: ['backbone', 'saas']},
      {t: 'Experience Monitoring shows the one failing segment; XOps anomaly stories raise it before users call.', marks: ['mgmt', 'xops']},
    ],
    anchors: {mgmt: [782, 132], saas: [302, 310]},   // markers clear of the CMA and "Smart egress" subtitles
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 470',
    draw: K => {
      const {nd, tile, fl, T, L, tier, pill, mark, fpin, ring, cloud} = K;
      let s = '';
      const BY = 170;                       // the hop baseline
      /* ---- heading ---- */
      s += tier(14, 34, 'EVERY HOP SCORED INDEPENDENTLY · GOOD / FAIR / POOR');
      s += T(14, 56, 'Every hop the traffic actually takes, scored per user, site and application', 'f-t');

      /* ---- the three hops before Cato: laptop, home router, ISP last mile ---- */
      const TW = 92, TH = 84, TY = BY - TH / 2;
      const HOPS = [
        [14,  'laptop', 'Laptop',        'CPU · memory'],
        [124, 'wifi',   'Home router',   'Wi-Fi · LAN gw'],
        [234, 'globe',  'ISP last mile', 'broadband uplink'],
      ];
      HOPS.forEach(([x, ic, t, sub]) => { s += tile(x, TY, TW, TH, ic, t, [sub]); });
      s += fl(L(106, BY, 124, BY), 'fl-net', {np: 0});
      s += fl(L(216, BY, 234, BY), 'fl-net', {np: 0});

      /* ---- last mile into the nearest PoP: overlay probe in the tunnel, underlay probe outside it ---- */
      const PA = 410, PB = 570, PR = 20, TIP = BY + PR * 1.7;
      s += fl(L(326, BY - 5, PA - PR, BY - 5), 'fl-tun', {dur: 1.2});
      s += fl(L(326, BY + 7, PA - PR, BY + 7), 'fl-net fl-dim', {np: 0});

      /* ---- Cato: two PoPs on the Global Private Backbone ---- */
      const RG = {cx: (PA + PB) / 2, cy: BY, rx: (PB - PA) / 2, ry: 26};
      s += ring(RG);
      s += fl(`M${PA} ${BY}A${RG.rx} ${RG.ry} 0 0 0 ${PB} ${BY}`, 'fl-hot', {dur: 1.8});
      s += fpin(PA, TIP, PR, 'PoP', {halo: true}) + fpin(PB, TIP, PR, 'PoP');
      s += T(PA, 122, 'Cato PoP', 'nd-t g', 'middle') + T(PA, 136, 'closest to user', 'f-s', 'middle');
      s += T(PB, 122, 'Cato PoP', 'nd-t g', 'middle') + T(PB, 136, 'closest to app', 'f-s', 'middle');
      s += T(RG.cx, 222, 'Global Private Backbone', 'f-s', 'middle');

      /* ---- egress PoP to the SaaS app ---- */
      s += fl(L(PB + PR, BY, 626, BY), 'fl-flow', {arrow: true, dur: 1});
      s += cloud(680, BY, .9, 'SaaS app', 'Microsoft Teams');

      /* ---- verdict under every hop: one amber, the rest green ---- */
      const MY = 240, PY = 264;
      [
        [60,  'ok',   'device healthy',   'g'],
        [170, 'ok',   'Wi-Fi healthy',    'g'],
        [280, 'warn', 'loss 4.2% · Fair', 'y'],
        [PA,  'ok',   'ingress healthy',  'g'],
        [PB,  'ok',   'egress healthy',   'g'],
        [680, 'ok',   'app responding',   'g'],
      ].forEach(([x, k, t, c]) => { s += mark(x, MY, k) + pill(x, PY, t, c); });

      /* ---- the last mile is measured twice ---- */
      const BX1 = 234, BX2 = PA + PR, BXC = (BX1 + BX2) / 2, BRY = 296;
      s += `<path d="M${BX1} ${BRY - 6}v6H${BX2}v-6" style="fill:none;stroke:var(--line);stroke-width:1.2"/>`;
      s += T(BXC, 314, 'LAST MILE · MEASURED TWICE', 'tier', 'middle');
      s += T(BXC, 332, 'overlay probe inside the DTLS tunnel', 'f-s', 'middle');
      s += T(BXC, 346, 'underlay probe outside it, Client → PoP', 'f-s', 'middle');

      /* ---- the verdict ---- */
      s += nd(14, 380, 732, 62, {cls: 'soft', t: 'One amber node, the rest green: the fault is the ISP last mile',
        s: ['4.2% loss scores Fair against the documented 1–5% band · not the laptop, not Cato, not the app']});
      return s;
    },
    title: 'Hop-by-hop experience monitoring, laptop to SaaS app',
    desc: 'A user-to-application path is measured at every hop — laptop, home router, ISP last mile, Cato PoP, backbone, second PoP, SaaS app — and only the ISP last mile is amber at 4.2% loss, isolating the fault to one segment.',
    legend: [['net', 'LAN · Wi-Fi · underlay probe outside the tunnel'], ['tun', 'Last mile — Client DTLS tunnel (overlay probe)'], ['hot', 'Cato backbone — PoP to PoP'], ['flow', 'PoP → application'], 'live'],
  }],
});
