/* specs/access-offshore-bpo.js — Offshore Development Centres & BPO Access */
DG.page('access-offshore-bpo', {
  spotlight: {
    hl: ['users', 'pop', 'backbone', 'dc', 'cloud', 'saas'],
    mods: ['uztna', 'sse'],
    anchors: {saas: [302, 310], cloud: [1362, 408]},   // step-4 marker clear of the "Smart egress" subtitle; cloud marker on the lit Azure leg, clear of the heading index
    flows: [{p: 'us1'}, {p: 'us2'}, {p: 'r-LC'}, {p: 'dc1', rev: true}, {p: 'cl-az'}, {p: 'eg-saas'}],
    steps: [
      {t: 'Managed contractor laptops run the Cato Client with posture checks; unmanaged seats use a browser portal.', marks: ['users']},
      {t: 'Both onramp at the nearest PoP, Johannesburg or Sydney, where ZTNA, RBI and CASB/DLP are enforced.', marks: ['pop']},
      {t: 'The private backbone carries repo, VDI and CRM traffic to the region where the apps are hosted.', marks: ['dc', 'cloud']},
      {t: 'DLP blocks source code and customer PII leaving approved apps for personal storage or webmail.', marks: ['saas']},
    ],
  },
  diagrams: [{
    slot: 'main',
    draw: K => {
      const {nd, fl, T, fpin, ring, site, chipRow, pill, xmark, tier} = K;
      let s = '';
      /* ---- tiers ---- */
      s += tier(14, 40, 'OFFSHORE FLOOR') + tier(232, 40, 'ENFORCED AT THE PoP') + tier(574, 40, 'IN-REGION HOSTING');
      /* ---- left: the delivery centre, two device classes ---- */
      s += site(14, 70, 200, 350, 'DELIVERY CENTRE');
      s += nd(22, 140, 184, 60, {t: 'Offshore developers', s: ['Cato Client · posture'], ic: 'laptop', is: 20, icls: 'g'});
      s += nd(22, 290, 184, 60, {t: 'BPO contact centre', s: ['unmanaged · browser only'], ic: 'browser', is: 20, icls: 'g'});
      /* ---- centre: the nearest PoP and the backbone ---- */
      const PX = 322, TIP = 290, PR = 26;
      const RG = {cx: 474, cy: 236, rx: 76, ry: 26};
      s += ring(RG);
      s += T(RG.cx, 288, 'Global Private Backbone', 'f-s', 'middle');
      /* flows onto the PoP */
      s += fl('M206 170C250 170 266 236 300 238', 'fl-tun', {dur: 1.3, label: 'posture-gated', lx: 252, ly: 200});
      s += fl('M206 320C250 320 268 262 302 254', 'fl-https', {dur: 1.3, label: 'portal · RBI', lx: 258, ly: 292});
      /* PoP → backbone → in-region hosting */
      s += fl(`M${PX + PR} 238C370 238 380 236 ${RG.cx - RG.rx - 8} 236`, 'fl-tun', {dur: .8});
      s += fl('M518 208C536 178 548 150 574 150', 'fl-tun', {dur: 1});
      s += fl('M552 244C562 246 566 250 574 250', 'fl-tun', {dur: .6});
      /* PoP → personal storage: refused by DLP */
      s += fl(`M${PX + PR + 2} 256C440 290 500 400 541 450`, 'fl-flow fl-down', {np: 0}) + xmark(552, 450);
      s += pill(448, 488, 'DLP: source-code upload blocked', 'r keep');
      /* the PoP itself, on top of the flows */
      s += fpin(PX, TIP, PR, 'PoP', {halo: true});
      s += T(PX, 316, 'Nearest Cato PoP', 'nd-t g', 'middle') + T(PX, 331, 'Johannesburg · Sydney', 'f-s', 'middle');
      s += chipRow(PX - 96, 342, ['ZTNA', 'RBI', 'CASB · DLP'], 60, 20, 6, 'g');
      /* ---- right: where the apps are hosted, and where data may not go ---- */
      s += nd(574, 120, 172, 60, {t: 'London DC', s: ['Git repos · Socket X1500'], ic: 'server', is: 20, icls: 'g'});
      s += nd(574, 220, 172, 60, {t: 'VDI & CRM', s: ['Azure UK · vSocket'], ic: 'db', is: 20, icls: 'g'});
      s += tier(574, 408, 'OUTSIDE APPROVED APPS');
      /* .nd.dash is not in the ported CSS: dash the box inline, keep the globe icon solid */
      s += `<g style="stroke-dasharray:5 4">${nd(574, 420, 172, 60, {t: 'Personal storage', s: ['consumer file sharing'], ic: 'globe', is: 20, icls: 'g'})
        .replace('<use ', '<use style="stroke-dasharray:none" ')}</g>`;
      return s;
    },
    vb: '0 0 760 560',
    title: 'Offshore developers and BPO agents on Cato',
    desc: 'Developers and agents onramp at the nearest PoP where ZTNA, RBI and DLP are enforced; the backbone carries repo, VDI and CRM traffic to in-region hosting while DLP stops source code and PII leaving approved apps.',
    legend: [['tun', 'Encrypted tunnel: Client ZTNA, then the backbone to in-region hosting'], ['https', 'Clientless + RBI — pixels only, data off endpoint'], ['down', 'CASB/DLP — code & PII exfiltration blocked']],
  }],
});
