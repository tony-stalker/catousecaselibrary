/* specs/security-iso27001.js — ISO/IEC 27001:2022 Annex A: device posture as the enforcement gate */
DG.page('security-iso27001', {
  spotlight: {
    hl: ['users', 'pop', 'mgmt', 'xops'],
    anchors: {mgmt: [782, 132]},   // step-1 marker clear of the CMA subtitle
    mods: ['uztna', 'sse'],
    flows: [{p: 'us1'}, {p: 'spine'}, {p: 'm1'}],
    steps: [
      {t: 'The ISMS policy and Statement of Applicability select the Annex A controls to enforce.', marks: ['mgmt']},
      {t: 'The Cato Client re-evaluates its Device Posture Profile every ten minutes; a failing device gets no tunnel.', marks: ['users']},
      {t: 'Compliant devices reach the PoP, where one policy — ZTNA, FWaaS, DLP, IPS — is enforced on every flow.', marks: ['pop']},
      {t: 'Events, the Audit Trail and the Posture Compliance Report become the auditor’s evidence from one console.', marks: ['mgmt', 'xops']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 490',
    draw: K => {
      const {nd, fl, T, tier, pill, fpin, xmark, L} = K;
      let s = '';

      /* headline — the page's own claim */
      s += pill(380, 24, 'Supports and evidences the Annex A controls the customer selects', '');

      /* ---- top row: policy → posture gate → PoP → enforced controls ---- */
      s += tier(14, 62, 'ISMS · SoA');
      s += tier(222, 62, 'ENFORCEMENT GATE · CATO CLIENT');
      s += tier(558, 62, 'ENFORCED AT THE PoP');

      s += nd(14, 76, 176, 56, {t: 'ISMS policy & SoA', s: ['risk-driven controls'], ic: 'file', is: 20, icls: 'g'});
      s += nd(222, 76, 196, 56, {t: 'Device Posture gate', s: ['11 checks · every 10 min'], ic: 'laptop', is: 20, icls: 'g', cls: 'hot'});
      s += fpin(486, 124, 22, 'PoP', {halo: true});
      s += T(486, 50, 'Cato PoP', 'nd-t g', 'middle');
      s += T(486, 146, 'one policy · every edge', 'f-s', 'middle');
      s += nd(558, 76, 188, 56, {t: 'Enforced controls', s: ['ZTNA · FWaaS · DLP · IPS'], ic: 'shield', is: 20, icls: 'g'});

      s += fl(L(190, 104, 222, 104), 'fl-flow', {arrow: true, dur: .8});
      s += fl('M418 104C440 104 450 96 462 92', 'fl-flow', {arrow: true, dur: .8});
      s += fl('M510 92C522 96 536 104 558 104', 'fl-flow', {arrow: true, dur: .8});

      /* ---- posture failure: no tunnel / disconnect, recorded as an event ---- */
      s += fl('M320 132V200', 'fl-down', {np: 0});
      s += xmark(320, 212);
      s += pill(320, 246, 'fails a check → no tunnel / disconnect', 'r');
      s += fl('M332 212C420 212 500 268 558 268', 'fl-net', {arrow: 'arr-n', dur: 1.2});
      s += T(480, 286, 'posture event', 'f-m', 'middle');

      /* ---- right side: every decision lands in the CMA evidence plane ---- */
      s += fl('M716 132V230', 'fl-net', {arrow: 'arr-n', dur: .9});
      s += T(706, 186, 'every decision logged', 'f-m', 'end');
      s += tier(558, 218, 'EVIDENCE PLANE');
      s += nd(558, 230, 188, 78, {t: 'CMA evidence plane', s: ['events · Audit Trail', 'Data Lake 3–12 months'], ic: 'db', is: 20, icls: 'g', cls: 'pop'});

      /* ---- bottom row: reports → auditor ---- */
      s += tier(14, 382, 'EVIDENCE TO THE AUDITOR');
      s += fl('M652 308C652 360 560 431 484 431', 'fl-net', {arrow: 'arr-n', dur: 1.2});
      s += nd(270, 396, 214, 70, {t: 'Reports & evidence', s: ['Posture Compliance Report', 'Audit Trail · event export'], ic: 'chart', is: 20, icls: 'g'});
      s += fl(L(270, 431, 190, 431), 'fl-net', {arrow: 'arr-n', dur: .8});
      s += nd(14, 396, 176, 70, {t: 'Auditor · Stage 2', s: ['surveillance audits', 'recertification'], ic: 'users', is: 20, icls: 'g'});

      /* ---- closing the loop: management review and improvement feed policy ---- */
      s += fl('M102 396V132', 'fl-flow fl-dim', {arrow: true, dur: 2});
      s += T(112, 286, 'clause 9 review', 'f-m');
      s += T(112, 300, 'clause 10 improvement', 'f-m');
      return s;
    },
    title: 'The ISMS loop with posture as the gate',
    desc: 'The ISMS policy and SoA select the controls; the Cato Client re-evaluates the Device Posture Profile every ten minutes and refuses or disconnects a failing device; compliant devices reach the PoP where ZTNA, FWaaS, DLP and IPS are enforced on every flow; every decision lands in the CMA evidence plane whose reports feed the Stage 2 auditor, and clause 9 review and clause 10 improvement close the loop back into policy.',
    legend: [['flow', 'Enforcement path — compliant devices only'], ['down', 'Posture failure — blocked or disconnected'], ['net', 'Telemetry & evidence'], 'live'],
  }],
});
