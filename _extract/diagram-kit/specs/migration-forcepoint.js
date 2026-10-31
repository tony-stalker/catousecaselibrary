/* specs/migration-forcepoint.js — Forcepoint (Web Security & NGFW) to Cato */
DG.page('migration-forcepoint', {
  spotlight: {
    hl: ['users', 'branch', 'pop', 'saas'],
    mods: ['sse'],
    flows: [{p: 'us1'}, {p: 'br1'}, {p: 'eg-www'}, {p: 'eg-saas'}],
    steps: [
      {t: 'Cohort A keeps its GPO-pushed PAC and steers explicitly to the policy-frozen Forcepoint cloud.', marks: ['users']},
      {t: 'Cohort B steers transparently — Cato Client with Always-On, sites via Socket — to the Cato PoP.', marks: ['branch', 'pop']},
      {t: 'One TLS inspection owner per cohort; the Forcepoint DLP endpoint agent stays for USB, print, clipboard.', marks: ['pop']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, ring, fpin, fy, cloud, popBox, tier} = K;
      let s = '';

      /* ---- top lane: cohort A, still on the PAC, explicit to Forcepoint (interim) ---- */
      s += tier(14, 50, 'COHORT A · STILL ON PAC · EXPLICIT TO FORCEPOINT (INTERIM)');
      s += nd(14, 80, 184, 68, {t: 'Cohort A — on PAC', s: ['Explicit proxy via GPO', 'browser → PAC → proxy'], ic: 'users', is: 20, icls: 'g', cls: 'dash'});
      s += fl('M198 114H350', 'fl-ha', {dur: 1.8, label: 'PAC via GPO — explicit', lx: 274, ly: 92, lcls: 'y keep'});
      s += nd(350, 80, 170, 68, {t: 'Forcepoint cloud', s: ['policy-frozen · interim'], ic: 'globe', is: 20, cls: 'dash'});
      s += pill(435, 166, 'web policy still here', 'y keep');
      s += fl('M520 114C566 114 572 198 592 208', 'fl-ha', {dur: 1.8, arrow: 'arr-y'});

      /* ---- bottom lane: cohort B, migrated, transparent to the Cato PoP ---- */
      s += tier(14, 262, 'COHORT B · MIGRATED · TRANSPARENT TO THE CATO PoP');
      s += nd(14, 300, 184, 68, {t: 'Cohort B — migrated', s: ['Cato Client · Always-On', 'sites steer via Socket'], ic: 'users', is: 20, icls: 'g'});
      s += fl('M198 334C250 334 290 322 350 322', 'fl-tun', {dur: 1.3, label: 'transparent — no PAC', lx: 274, ly: 284, lcls: 'g keep'});

      const RG = {cx: 435, cy: 392, rx: 130, ry: 36};
      s += ring(RG);
      s += popBox(350, 290, 170, 64, 'Cato PoP', 'SWG · TLSi · CASB · DLP');
      s += fpin(435, Math.round(fy(RG, 435)) + 2, 20, 'PoP', {halo: true});
      s += T(435, 456, 'Global Private Backbone', 'f-s', 'middle');
      s += fl('M520 322C566 322 572 258 592 250', 'fl-flow', {dur: 1.1, arrow: 'arr-m', label: 'direct PoP breakout', lx: 640, ly: 306, lcls: 'g keep'});

      /* ---- shared destination ---- */
      s += cloud(650, 230, 1.1, 'Internet & SaaS', 'M365 · web · SaaS apps');

      /* ---- the DLP hybrid note under cohort B ---- */
      s += nd(14, 400, 200, 68, {t: 'DLP hybrid', s: ['FP endpoint agent stays', 'USB · print · clipboard'], ic: 'shield', is: 20, icls: 'g', cls: 'soft'});

      s += T(380, 546, 'One TLS inspection owner per cohort — never decrypt the same flow twice', 'f-s', 'middle');
      return s;
    },
    title: 'Dual steering planes during the Forcepoint-to-Cato transition',
    desc: 'Cohort A still steers explicitly through its GPO-pushed PAC to the policy-frozen Forcepoint cloud while cohort B steers transparently through the Cato Client and Sockets to the Cato PoP; one platform owns TLS inspection per cohort and the Forcepoint DLP endpoint agent stays for USB, print and clipboard.',
    legend: [['ha', 'Explicit — PAC → Forcepoint (interim)'], ['tun', 'Transparent — Cato Client / Socket'], ['flow', 'Direct PoP breakout'], 'live'],
  }],
});
