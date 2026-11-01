/* specs/security-finance-dora.js — Financial Services Resilience (DORA) */
DG.page('security-finance-dora', {
  spotlight: {
    hl: ['branch', 'dc', 'users', 'pop', 'backbone', 'mgmt'],
    mods: ['sdwan', 'sse'],
    anchors: {mgmt: [782, 132], backbone: [1078, 592]},   // step-4 marker on the CMA top edge; step-2 marker below the ring text, clear of '99.999%'
    flows: [{p: 'br1'}, {p: 'dc1'}, {p: 'us1'}, {p: 'r-LC'}, {p: 'r-CR'}, {p: 'm1'}],
    steps: [
      {t: 'London DC, the Bristol branch and the hybrid workforce connect to the nearest PoP on the private backbone.', marks: ['branch', 'dc', 'users']},
      {t: 'When a carrier path or PoP degrades, sockets and clients reconnect to the next-best PoP automatically.', marks: ['backbone']},
      {t: 'Every flow still crosses the full security stack at the PoP on its way to core banking applications.', marks: ['pop']},
      {t: 'One telemetry plane feeds XDR stories, the Audit Trail and Experience Monitoring: the DORA evidence.', marks: ['mgmt']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, tier, ring, fpin, fy, pill, xmark} = K;
      let s = '';

      /* ---- top: the backbone with the failed and the surviving PoP ---- */
      s += tier(14, 12, 'CATO SASE CLOUD');
      s += T(14, 34, 'Global Private Backbone', 'f-h', 'start');
      s += T(14, 50, 'multiple Tier-1 carriers', 'f-s', 'start');
      const RG = {cx: 390, cy: 112, rx: 250, ry: 40};
      const PL = 265, PM = 445;                                   /* London (failed path) · Manchester (on-path) */
      const TL = Math.round(fy(RG, PL)), TM = Math.round(fy(RG, PM));
      s += ring(RG);

      /* ---- left: the three edges ---- */
      const EX = 14, EW = 180, EH = 56;
      s += tier(EX, 232, 'EDGES · SITES & USERS');
      const EDGES = [
        [246, 'server',   'London DC',        'Socket X1500 · data centre'],
        [336, 'building', 'Bristol Office',   'Socket X1600 branch'],
        [426, 'users',    'Hybrid workforce', 'Cato Client · ZTNA'],
      ];
      EDGES.forEach(([y, ic, t, sub]) => { s += nd(EX, y, EW, EH, {t, s: [sub], ic, is: 22, icls: 'g'}); });

      /* paths first, so they meet under the pin heads */
      EDGES.forEach(([y]) => {
        const cy = y + EH / 2;
        s += fl(`M${EX + EW} ${cy} C 240 ${cy}, ${PL} 240, ${PL} ${TL}`, 'fl-tun fl-down', {np: 0});
      });
      s += xmark(PL, 204);
      s += T(PL - 18, 208, 'carrier fault — out of path', 'f-s', 'end');
      EDGES.forEach(([y], i) => {
        const cy = y + EH / 2;
        s += fl(`M${EX + EW} ${cy} C 320 ${cy}, ${PM} 250, ${PM} ${TM}`, 'fl-tun', {n: 4, dur: 1.3 + i * .15});
      });
      s += pill(366, 286, 'auto-steered to the next-best PoP', 'g');

      /* PoPs on the ring; labels above the ring, clear of the tube, over their pins */
      s += fpin(PL, TL, 22, 'PoP', {dim: true}) + fpin(PM, TM, 22, 'PoP', {halo: true});
      s += T(PL, 56, 'London PoP', 'nd-t', 'middle');
      s += T(PM, 40, 'Manchester PoP', 'nd-t', 'middle') + T(PM, 54, 'SPACE · full stack on-path', 'f-s', 'middle');

      /* ---- right: core banking applications, reached from the surviving PoP ---- */
      const RX = 566, RW = 180;
      s += tier(RX, 178, 'DESTINATIONS');
      s += nd(RX, 190, RW, 64, {t: 'Core banking apps', s: ['cloud DC · SaaS · WWW'], ic: 'globe', is: 22, icls: 'g'});
      s += fl(`M${PM + 2} ${TM + 2} C 460 200, 520 222, ${RX} 222`, 'fl-flow', {arrow: true, dur: 1.2});

      /* ---- bottom-right: one telemetry plane, the evidence ---- */
      s += tier(RX, 418, 'ONE EVIDENCE PLANE');
      s += nd(RX, 430, RW, 70, {t: 'CMA — evidence', s: ['XDR incident stories', 'Audit Trail · DEM scores'], ic: 'console', is: 22, icls: 'g'});
      s += fl(`M${PM + 4} ${TM + 4} C 480 330, 520 465, ${RX} 465`, 'fl-net', {arrow: 'arr-n', dur: 1.6});
      s += T(494, 318, 'telemetry · every flow', 'f-m');
      return s;
    },
    title: 'Self-healing backbone with a single evidence plane',
    desc: 'A financial entity\'s London data centre, Bristol branch and hybrid workforce ride the Cato private backbone; when the London PoP path fails, traffic re-routes automatically to the Manchester PoP and still crosses the full security stack, while one telemetry plane feeds XDR stories, the Audit Trail and Experience Monitoring.',
    legend: [['tun', 'Live traffic — auto-steered to the next PoP'], ['down', 'Failed element — link / PoP out of path'], ['flow', 'Inspected traffic to core banking apps'], ['net', 'Telemetry — one evidence plane'], 'live'],
  }],
});
