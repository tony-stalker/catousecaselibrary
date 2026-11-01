/* specs/demo-platform-60.js — The 60-Minute Platform Demo: one engine, seven angles */
DG.page('demo-platform-60', {
  spotlight: {
    hl: ['users', 'branch', 'pop', 'saas', 'dc', 'mgmt'],
    mods: ['sse', 'uztna', 'sdwan'],
    flows: [{p: 'us1'}, {p: 'br1'}, {p: 'eg-www'}, {p: 'eg-saas'}, {p: 'dc1', rev: true}, {p: 'm1'}],
    steps: [
      {t: 'A remote user on the Cato Client and a site behind a Socket both enter the nearest PoP.', marks: ['users', 'branch']},
      {t: 'The single-pass engine there makes every decision; segments 1 to 6 are that engine from six angles.', marks: ['pop']},
      {t: 'The flow leaves for the internet, a SaaS application or a private app behind an App Connector.', marks: ['saas', 'dc']},
      {t: 'Segment 7 is what the same engine tells you afterwards: telemetry from every flow, in one console.', marks: ['mgmt']},
    ],
    anchors: {mgmt: [782, 132], saas: [302, 308]},   // markers clear of the CMA subtitle and the SaaS egress subtitle
  },
  diagrams: [{
    slot: 'main',
    draw: K => {
      const {nd, fl, T, tier, popBox, ring, fpin, cloud} = K;
      let s = '';

      /* TOP RAIL · the seven segments, one row; 1-6 drop to the PoP, 7 is fed by telemetry */
      const RAIL = [
        ['1 · SWG', 'Internet FW · TLSi'], ['2 · Threats', 'IPS · Anti-Malware'], ['3 · CASB', 'Cloud apps · risk'],
        ['4 · DLP', 'Data types · rules'], ['5 · ZTNA', 'Identity · posture'], ['6 · Connectors', 'Private apps'],
        ['7 · DEM', 'Score · path'],
      ];
      const RX = i => 14 + i * 105, RW = 101, RY = 30, RH = 54, PCX = 380;
      s += tier(14, 18, 'SEVEN ANGLES ON ONE ENGINE');
      /* rail bar: boxes 1-6 join and drop into the PoP (static, faint) */
      let bar = `M${RX(0) + RW / 2} ${RY + RH}L${RX(0) + RW / 2} 102L${RX(5) + RW / 2} 102L${RX(5) + RW / 2} ${RY + RH}`;
      for (let i = 1; i < 5; i++) bar += `M${RX(i) + RW / 2} ${RY + RH}L${RX(i) + RW / 2} 102`;
      bar += `M${PCX} 102L${PCX} 158`;
      s += fl(bar, 'fl-flow fl-dim', {np: 0});
      RAIL.forEach(([t, sub], i) => { s += nd(RX(i), RY, RW, RH, {t, s: [sub], cls: i === 6 ? 'pop' : 'soft'}); });

      /* CENTRE · the backbone ring behind the PoP, then the PoP itself */
      const RG = {cx: PCX, cy: 398, rx: 140, ry: 30};
      s += ring(RG);
      s += T(PCX, 458, 'Global Private Backbone', 'f-h', 'middle');
      s += popBox(250, 158, 260, 214, 'Cato PoP', 'single-pass engine · one policy');

      /* LEFT · two ways in (encrypted tunnels to the nearest PoP) */
      s += tier(20, 192, 'TWO WAYS IN');
      s += nd(20, 204, 170, 58, {t: 'Remote user', s: ['Cato Client'], ic: 'laptop'});
      s += nd(20, 324, 170, 58, {t: 'Branch site', s: ['Cato Socket'], ic: 'building'});
      s += fl('M190 233C270 233 300 262 352 268', 'fl-tun', {dur: 1.4});
      s += fl('M190 353C270 353 300 290 354 276', 'fl-tun', {dur: 1.4});

      /* RIGHT · three ways out, all allowed */
      s += tier(588, 160, 'THREE WAYS OUT');
      s += cloud(668, 212, 1.1, 'Internet', 'web · categories');
      s += cloud(668, 316, 1.1, 'SaaS apps', 'sanctioned · shadow');
      s += nd(580, 400, 170, 58, {t: 'Private app', s: ['via App Connector'], ic: 'server'});
      s += fl('M406 262C480 240 560 212 602 212', 'fl-flow', {arrow: true, dur: 1.6});
      s += fl('M406 270C480 274 560 316 602 316', 'fl-flow', {arrow: true, dur: 1.6});
      s += fl('M406 282C500 300 530 429 578 429', 'fl-flow', {arrow: true, dur: 1.8});

      /* TELEMETRY · from the PoP up to segment 7 */
      s += fl(`M500 158C560 132 ${RX(6) + RW / 2} 132 ${RX(6) + RW / 2} ${RY + RH + 2}`, 'fl-net', {arrow: true, dur: 2,
        label: 'telemetry from every flow', lx: 492, ly: 120, lcls: 'm'});

      /* the PoP pin, drawn after the flows so they meet beneath its head */
      s += fpin(PCX, 312, 28, 'PoP', {halo: true});
      return s;
    },
    vb: '0 0 760 480',
    title: 'One engine, seven angles',
    desc: 'Two ways in and three ways out of one single-pass engine in the Cato PoP; segments one to six are decisions the engine makes on the flow and segment seven is what it reports about them afterwards.',
    legend: [['tun', 'Client or Socket tunnel to the nearest PoP'], ['flow', 'Flows inspected by the single-pass engine'], ['net', 'Telemetry feeding Experience Monitoring']],
  }],
});
