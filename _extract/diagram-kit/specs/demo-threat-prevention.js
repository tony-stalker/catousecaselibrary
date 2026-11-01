/* specs/demo-threat-prevention.js — 60-minute platform demo, Segment 2: Threat Prevention */
DG.page('demo-threat-prevention', {
  spotlight: {
    hl: ['users', 'branch', 'pop', 'saas', 'xops'],
    mods: ['sse'],
    flows: [{p: 'us1'}, {p: 'br1'}, {p: 'eg-www'}, {p: 'spine'}],
    steps: [
      {t: 'Priya on the Cato Client and the Bristol Office Socket send every flow to the nearest PoP.', marks: ['users', 'branch']},
      {t: 'The engine inspects each flow once against IPS, anti-malware, the cloud sandbox and DNS security.', marks: ['pop']},
      {t: 'Clean traffic continues; malware, exploits and C2 beacons are blocked at the PoP and recorded as events.', marks: ['saas']},
      {t: 'The same events feed the Threats Dashboard and, when they belong together, one XDR story.', marks: ['xops']},
    ],
    anchors: {saas: [302, 310]},   // step-3 marker clear of the "Smart egress" subtitle (as on demo-swg)
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 500',
    draw: K => {
      const {nd, site, popBox, ring, chips, cloud, fl, pill, xmark, tier, T} = K;
      let s = '';
      /* section labels */
      s += tier(14, 14, 'CATO SASE CLOUD');
      s += tier(20, 96, 'SOURCES') + tier(596, 96, 'DESTINATIONS');

      /* the backbone the PoP sits on */
      s += ring({cx: 380, cy: 73, rx: 150, ry: 22});
      s += T(380, 32, 'Global Private Backbone', 'f-h', 'middle');

      /* LEFT · the two sources */
      s += nd(20, 134, 170, 60, {t: 'Remote user', s: ['Priya · Cato Client'], ic: 'laptop', icls: 'g'});
      s += site(12, 236, 186, 96, 'Bristol Office');
      s += nd(20, 256, 170, 60, {t: 'Socket', s: ['all site traffic'], ic: 'building', icls: 'g'});

      /* tunnels into the PoP */
      s += fl('M190 164C222 164 222 188 250 188', 'fl-tun', {dur: 1.3});
      s += fl('M190 286C222 286 222 252 250 252', 'fl-tun', {dur: 1.3});

      /* CENTRE · the PoP and its single-pass engines */
      s += popBox(250, 96, 260, 236, 'Cato PoP', 'single-pass engine');
      s += chips(266, 156, ['IPS', 'NG Anti-Malware', 'Sandbox', 'DNS security'], 110, 26, 8, 2, 'g');
      s += T(380, 242, 'each flow inspected once', 'f-s', 'middle');
      s += pill(328, 290, 'clean · allow', 'g keep');
      s += pill(432, 290, 'threat · block', 'r keep');

      /* RIGHT TOP · clean traffic continues */
      s += fl('M510 172C548 172 556 150 588 150', 'fl-flow', {arrow: true, dur: 1.4});
      s += cloud(660, 150, 1.15, 'Internet & SaaS', 'clean traffic continues');

      /* RIGHT BOTTOM · attacker infrastructure: outbound blocked, inbound attempt stopped */
      s += cloud(660, 290, 1.15, 'Attacker server', 'malware · exploit · C2', 'bad');
      s += fl('M484 262C496 262 498 272 504 272', 'fl-flow fl-down', {np: 0});
      s += xmark(512, 272);
      s += T(552, 262, 'outbound', 'f-s', 'middle');
      s += fl('M592 310C570 310 540 310 522 310', 'fl-attack', {dur: 1.2, pcls: 'pt red'});
      s += xmark(512, 310);
      s += T(552, 330, 'inbound', 'f-s', 'middle');

      /* BOTTOM · telemetry from every verdict */
      s += tier(160, 390, 'TELEMETRY');
      s += fl('M330 332C330 370 265 370 265 402', 'fl-flow fl-dim', {dur: 1.6, arrow: 'arr-n'});
      s += fl('M430 332C430 370 495 370 495 402', 'fl-flow fl-dim', {dur: 1.6, arrow: 'arr-n'});
      s += nd(160, 404, 210, 60, {t: 'Threats Dashboard', s: ['every verdict is an event'], ic: 'chart', icls: 'g'});
      s += nd(390, 404, 210, 60, {t: 'XDR story', s: ['related events, one incident'], ic: 'eye', icls: 'g'});
      s += fl('M370 434L388 434', 'fl-flow fl-dim', {np: 0, arrow: 'arr-n'});
      return s;
    },
    title: 'One pass, every engine, one verdict',
    desc: 'A remote user and a branch site reach one PoP engine that inspects each flow once against IPS, anti-malware, sandbox and DNS security; clean traffic continues, threats are blocked at the PoP, and the resulting events build the Threats Dashboard and XDR stories.',
    legend: [['tun', 'Encrypted tunnel — Client and Socket to the PoP'], ['flow', 'Clean traffic — inspected and forwarded'],
      ['down', 'Threat — blocked at the PoP'], ['attack', 'Inbound attempt — stopped at the PoP'], ['dim', 'Telemetry — dashboard, events, stories']],
  }],
});
