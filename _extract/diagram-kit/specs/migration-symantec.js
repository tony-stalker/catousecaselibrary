/* specs/migration-symantec.js — Symantec (Broadcom) ProxySG / WSS to Cato */
DG.page('migration-symantec', {
  spotlight: {
    hl: ['users', 'branch', 'pop', 'saas'],
    anchors: {saas: [302, 310]},   // step-3 marker clear of the "Smart egress" subtitle
    mods: ['sse'],
    flows: [{p: 'us1'}, {p: 'br1'}, {p: 'eg-www'}, {p: 'eg-saas'}],
    steps: [
      {t: 'Cohort A keeps its PAC and WSS Agent, steering explicitly to the policy-frozen ProxySG/WSS estate.', marks: ['users']},
      {t: 'Cohort B steers transparently via the Cato Client and site Sockets to the PoP; WCCP is retired.', marks: ['branch', 'pop']},
      {t: 'One TLS inspection owner per cohort; Symantec DLP Endpoint and Discover stay for USB, print and data at rest.', marks: ['saas']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, ring, fpin, fy, cloud, popBox, tier, xmark} = K;
      let s = '';

      /* ---- top lane: cohort A, still on the PAC, explicit to ProxySG / WSS (interim) ---- */
      s += tier(14, 40, 'COHORT A · STILL ON PAC · EXPLICIT TO PROXYSG / WSS (INTERIM)');
      s += nd(14, 80, 186, 68, {t: 'Cohort A — on PAC', s: ['Explicit proxy · GPO/PFMS', 'roamers on WSS Agent'], ic: 'users', is: 20, icls: 'g', cls: 'dash'});
      s += pill(160, 80, 'interim', 'y keep');
      s += fl('M200 114H330', 'fl-ha', {dur: 1.8, label: 'PAC — explicit steering', lx: 265, ly: 64, lcls: 'y keep'});
      s += nd(330, 80, 190, 68, {t: 'ProxySG / ASG · WSS', s: ['appliances EOL — retiring', 'policy-frozen · interim'], ic: 'server', is: 20, cls: 'dash'});
      s += pill(494, 80, 'EOL', 'r keep');
      s += fl('M520 114C560 114 570 198 592 208', 'fl-ha', {dur: 1.8, arrow: 'arr-y', label: 'web policy still here', lx: 610, ly: 104, lcls: 'y keep'});

      /* ---- retired path: the old WCCP redirect from migrated sites ---- */
      s += fl('M170 300C190 236 300 200 368 160', 'fl-flow fl-down', {np: 0});
      s += xmark(372, 160);
      s += pill(300, 236, 'WCCP redirect — retired', 'r keep');

      /* ---- bottom lane: cohort B, migrated, transparent to the Cato PoP ---- */
      s += tier(14, 262, 'COHORT B · MIGRATED');
      s += nd(14, 300, 186, 68, {t: 'Cohort B — migrated', s: ['Cato Client · Always-On', 'sites steer via Socket'], ic: 'users', is: 20, icls: 'g'});
      s += fl('M200 334C250 334 285 322 340 322', 'fl-tun', {dur: 1.3, label: 'transparent — no PAC', lx: 270, ly: 284, lcls: 'g keep'});

      const RG = {cx: 425, cy: 392, rx: 130, ry: 36};
      s += ring(RG);
      s += popBox(340, 290, 170, 64, 'Cato PoP', 'SWG · TLSi · CASB · DLP');
      s += fpin(425, Math.round(fy(RG, 425)) + 2, 20, 'PoP', {halo: true});
      s += T(425, 456, 'Global Private Backbone', 'f-s', 'middle');
      s += fl('M510 322C556 322 568 258 592 250', 'fl-flow', {dur: 1.1, arrow: 'arr-m', label: 'single-pass breakout', lx: 640, ly: 306, lcls: 'g keep'});

      /* ---- shared destination ---- */
      s += cloud(650, 230, 1.1, 'Internet & SaaS', 'M365 · web · SaaS apps');

      /* ---- the DLP hybrid note under cohort B ---- */
      s += nd(14, 400, 200, 68, {t: 'DLP hybrid', s: ['Symantec DLP agent stays', 'USB · print · Discover'], ic: 'shield', is: 20, icls: 'g', cls: 'soft'});

      s += T(380, 546, 'One TLS inspection owner per cohort — never decrypt the same flow twice', 'f-s', 'middle');
      return s;
    },
    title: 'Dual steering planes during the Symantec-to-Cato transition',
    desc: 'Cohort A\'s PAC still sends web traffic to the EOL-marked ProxySG/WSS estate while cohort B steers transparently to the Cato PoP and the old WCCP redirect from migrated sites is retired; one platform owns TLS inspection per cohort and the Symantec DLP endpoint agent stays for its exclusive channels.',
    legend: [['ha', 'Explicit — PAC → ProxySG/WSS (interim)'], ['tun', 'Transparent — Cato Client / Socket'], ['flow', 'Single-pass PoP breakout'], ['down', 'WCCP redirect — retired'], 'live'],
  }],
});
