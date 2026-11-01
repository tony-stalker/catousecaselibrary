/* specs/security-data-casb-dlp.js — Data Security with CASB & DLP */
DG.page('security-data-casb-dlp', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'backbone', 'ai'],   // 'ai' also lights the GenAI cloud that step 3 marks
    anchors: {saas: [302, 310]},   // step 3·4 marker clear of the "Smart egress" subtitle
    mods: ['sse'],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'eg-saas'}, {p: 'eg-genai'}, {p: 'eg-www'}],
    steps: [
      {t: 'Office and remote users already send every flow through the Cato PoP; CASB and DLP are simply switched on.', marks: ['branch', 'users']},
      {t: 'Inline, the PoP classifies each app, scores its risk and controls the activity per user and group.', marks: ['pop']},
      {t: 'Sanctioned SaaS is allowed and monitored; a risky GenAI app has uploads limited; card data out is blocked.', marks: ['saas', 'genai']},
      {t: 'Out-of-band API integration governs data already at rest in the sanctioned SaaS tenant.', marks: ['saas']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, tier, fpin, ring, cloud, pill, xmark, chipRow} = K;
      let s = '';
      /* section labels */
      s += tier(14, 16, 'WHERE THE TRAFFIC COMES FROM') + T(380, 16, 'CATO SASE CLOUD', 'tier', 'middle') + T(746, 16, 'CLOUD APPS', 'tier', 'end');

      /* LEFT · the two sources already on the platform */
      s += nd(14, 150, 190, 52, {t: 'Bristol Office', s: ['Socket — all traffic'], ic: 'building', is: 20, icls: 'g'});
      s += nd(14, 262, 190, 52, {t: 'Remote users', s: ['Cato Client — pilot group'], ic: 'users', is: 20, icls: 'g'});

      /* CENTRE · backbone ring with the PoP pin on it */
      const RG = {cx: 380, cy: 290, rx: 100, ry: 26};
      s += ring(RG);
      s += T(380, 334, 'GLOBAL PRIVATE BACKBONE', 'tier', 'middle');

      /* inbound: Socket tunnel and Client tunnel into the PoP */
      s += fl('M204 176C280 176 300 242 352 242', 'fl-tun', {dur: 1.3});
      s += fl('M204 288C280 288 300 242 352 242', 'fl-tun', {dur: 1.4});

      /* inline decisions, one lane per outcome */
      s += fl('M404 230C480 230 510 128 585 128', 'fl-flow', {arrow: 'arr-m', dur: 1.2, label: 'allowed & monitored', lx: 500, ly: 179, lcls: 'g'});
      s += fl('M408 246C480 246 520 270 590 270', 'fl-ha', {arrow: 'arr-m', dur: 1.6, label: 'uploads limited', lx: 500, ly: 258, lcls: 'y'});
      s += fl('M396 266C460 290 520 420 548 440', 'fl-down', {np: 0, label: 'blocked by DLP', lx: 530, ly: 392, lcls: 'r'});
      s += xmark(552, 440);

      /* out-of-band: API integration to the sanctioned tenant, data already at rest */
      s += fl('M398 222C410 60 550 44 628 84', 'fl-priv', {dur: 3, np: 0, label: 'out-of-band · API integration', lx: 498, ly: 94, lcls: 'm'});
      s += T(452, 121, 'scans data at rest', 'f-s', 'start');

      /* the PoP pin, drawn after the flows so they meet beneath its head */
      s += fpin(380, 290, 28, 'PoP', {halo: true});
      s += T(380, 358, 'Cato PoP', 'nd-t g', 'middle');
      s += pill(380, 378, 'CASB inline · DLP · TLS inspection', 'g keep');

      /* RIGHT · three destinations */
      s += cloud(660, 120, 1.2, 'Sanctioned SaaS', 'M365 · sanctioned apps');
      s += cloud(660, 270, 1.3, '', '', 'ai');
      s += T(660, 262, 'Unsanctioned', 't-cloud', 'middle') + T(660, 276, 'GenAI app', 't-cloud', 'middle');
      s += T(660, 292, 'high risk — uploads limited', 't-cloud-s', 'middle');
      s += nd(566, 414, 180, 52, {t: 'Exfiltration attempt', s: ['PII/card → personal cloud'], ic: 'file', is: 20, icls: 'r', cls: 'dash'});
      /* BOTTOM · what the inline decision is made of (page prose) */
      s += tier(14, 500, 'EVERY FLOW, INLINE AT THE PoP');
      s += chipRow(14, 510, ['App classified', 'Risk scored', 'Upload · download · share', 'Per user and group'], 176, 22, 10, 'g');
      return s;
    },
    title: 'Inline CASB and DLP at the Cato PoP',
    desc: 'Office and remote-user traffic reaches a Cato PoP running inline CASB and DLP: sanctioned SaaS is allowed and monitored, an unsanctioned GenAI app has uploads limited, an attempt to exfiltrate card data is blocked, and an out-of-band API integration scans data already at rest in the sanctioned tenant.',
    legend: [['tun', 'Socket / Client tunnel to the PoP'], ['flow', 'Sanctioned — allowed & monitored'], ['ha', 'Unsanctioned / risky — uploads limited'], ['down', 'Sensitive data out — blocked by DLP'], ['priv', 'Out-of-band API integration'], 'live'],
  }],
});
