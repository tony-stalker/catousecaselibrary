/* specs/network-global-app-performance.js — Global Application & UCaaS Performance */
DG.page('network-global-app-performance', {
  spotlight: {
    hl: ['branch', 'pop', 'backbone', 'dc', 'saas'],
    mods: ['sdwan'],
    anchors: {saas: [302, 310]},   // step-4 marker clear of the 'Smart egress' subtitle
    flows: [{p: 'br1'}, {p: 'r-LC'}, {p: 'r-CR'}, {p: 'r-RL'}, {p: 'dc1', rev: true}, {p: 'eg-saas'}],
    steps: [
      {t: 'The Sydney site enters its nearest PoP, where voice, video and bulk traffic are classified and prioritised.', marks: ['branch', 'popL']},
      {t: 'Traffic rides the private backbone with TCP acceleration and packet-loss mitigation applied between PoPs.', marks: ['backbone']},
      {t: 'Latency to the London DC is consistent hop by hop, instead of varying with public-internet peering.', marks: ['dc']},
      {t: 'Microsoft 365 leaves the backbone at the PoP closest to the application instance, not at a UK breakout.', marks: ['saas']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, L, pill, tier, fpin, cloud} = K;
      let s = '';
      const CY = 221;                                   // the backbone chain's centreline
      const popDot = (x, y, k) => `<circle cx="${x}" cy="${y}" r="15" style="fill:var(--brand)"/><circle cx="${x}" cy="${y}" r="15" style="fill:none;stroke:var(--mint);stroke-width:1.2"/>` +
        T(x, y + 3.8, k, 'chip-t', 'middle', 'style="fill:#fff;font-weight:600;font-size:9.5px"');

      /* ---- top band: the Cato global private backbone ---- */
      s += tier(14, 24, 'CATO GLOBAL PRIVATE BACKBONE');
      s += T(14, 42, 'Tier-1 carrier diversity · optimal routing per packet · 99.999 % SLA between PoPs', 'f-s');

      /* Sydney: the IPsec site enters its nearest PoP, where QoS is applied at ingress */
      s += nd(14, 191, 170, 60, {t: 'aws-sydney-ipsec', s: ['Sydney · IPsec site'], ic: 'cpu', is: 20, icls: 'g'});
      s += fl('M184 221Q205 221 226 221', 'fl-ipsec', {dur: 1.2});
      s += fpin(250, 262, 24, 'PoP', {halo: true});
      s += T(250, 170, 'Sydney PoP', 'nd-t g', 'middle');
      s += T(250, 185, 'nearest PoP — QoS applied at ingress', 'f-s', 'middle');
      /* the QoS queues */
      s += T(250, 290, 'QoS queues at ingress', 'f-m', 'middle');
      s += pill(250, 310, 'voice P1', 'g') + pill(250, 332, 'video P2', 'g') + pill(250, 354, 'bulk P3', 'm');

      /* the backbone chain Sydney → Singapore → Dubai → Frankfurt → London */
      s += fl(L(274, CY, 516, CY), 'fl-hot', {n: 3, dur: 3});
      s += popDot(340, CY, 'SIN') + popDot(415, CY, 'DXB') + popDot(490, CY, 'FRA');
      s += pill(362, 142, 'SYD → LDN ~280 ms — consistent, every packet (illustrative)', 'g');

      /* London: the egress PoP feeds the DC socket and Microsoft 365 */
      s += fpin(540, 262, 24, 'PoP', {halo: true});
      s += T(564, 292, 'London PoP', 'nd-t g', 'end');
      s += nd(576, 72, 170, 60, {t: 'London DC', s: ['Socket X1500 · file servers'], ic: 'server', is: 20, icls: 'g'});
      s += fl('M548 198Q556 102 576 102', 'fl-tun', {dur: 1.2});
      s += cloud(676, 330, 1, 'Microsoft 365', 'egress near the app');
      s += fl('M562 232Q604 330 612 330', 'fl-flow', {arrow: true, dur: 1});

      /* ---- bottom band: the public-internet alternative, hop by hop ---- */
      const H = [[70, 251], [90, 362], [190, 452], [380, 488], [560, 478], [664, 420], [704, 370]];
      s += fl('M' + H.map(([x, y]) => `${x} ${y}`).join('L'), 'fl-net', {np: 0});
      H.slice(1, 6).forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="4" style="fill:var(--ink-3)"/>`; });
      s += pill(390, 524, 'Public internet — variable latency, jitter and loss · no SLA');
      s += tier(14, 550, 'WITHOUT CATO · MANY PROVIDERS, BEST EFFORT');
      return s;
    },
    title: 'Sydney to London application traffic over the Cato global private backbone',
    desc: 'A Sydney IPsec site enters the Sydney PoP, where QoS prioritises voice, video and bulk traffic; the flow crosses a chain of backbone PoPs with consistent latency to the London PoP and on to the London DC socket and Microsoft 365 via smart egress, while the public-internet path beneath offers variable latency and no SLA.',
    legend: [['hot', 'Cato backbone — accelerated, QoS-enforced path'], ['ipsec', 'Sydney IPsec site to its nearest PoP'], ['tun', 'London DC Socket tunnel'], ['flow', 'Smart egress near the SaaS instance'], ['net', 'Public internet — best-effort contrast path'], 'live'],
  }],
});
