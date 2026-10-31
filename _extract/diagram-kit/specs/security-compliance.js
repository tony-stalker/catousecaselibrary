/* specs/security-compliance.js — Achieving Compliance (ISO 27001 · NIS2 · SOC 2) */
DG.page('security-compliance', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'mgmt', 'xops'],
    mods: ['sse'],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'spine'}, {p: 'm1'}],
    steps: [
      {t: 'Sites and remote users are covered alike: the same CASB and DLP policy applies to every edge.', marks: ['branch', 'users']},
      {t: 'Every flow from every edge is inspected once at the PoP by CASB, DLP, FWaaS and IPS.', marks: ['pop']},
      {t: 'Every enforcement decision lands as an event in one management application and data lake.', marks: ['mgmt', 'xops']},
      {t: 'That single, correlated record is the evidence source for ISO 27001, NIS2 and SOC 2 auditors.', marks: ['mgmt']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 460',
    draw: K => {
      const {nd, tile, popBox, ring, fl, T, tier} = K;
      let s = '';

      /* ---- tier labels ---- */
      s += tier(14, 16, 'ENFORCEMENT · EVERY PoP, EVERY EDGE');
      s += tier(300, 16, 'ONE MANAGEMENT PLANE');
      s += tier(560, 16, 'FRAMEWORKS & AUDITORS');

      /* ---- left: the PoP on the backbone, four engines in one pass ---- */
      const PX = 14, PW = 206, PY = 88, PH = 322, PC = PX + PW / 2;
      s += T(PC, 40, 'Global Private Backbone', 'f-m', 'middle');
      s += ring({cx: PC, cy: 64, rx: 92, ry: 12});
      s += popBox(PX, PY, PW, PH, 'Cato PoP', 'Single Pass Cloud Engine');
      const EX = PX + 12, EW = PW - 24, EH = 56;
      const ENG = [
        [140, 'chat',     'CASB',  'SaaS access control'],
        [206, 'file',     'DLP',   'data protection'],
        [272, 'firewall', 'FWaaS', 'firewall as a service'],
        [338, 'shield',   'IPS',   'threat prevention'],
      ];
      ENG.forEach(([y, ic, t, sub]) => { s += nd(EX, y, EW, EH, {t, s: [sub], ic, is: 20, icls: 'g'}); });
      s += T(PC, 430, 'every decision logged', 'f-s', 'middle');

      /* ---- centre: the management plane ---- */
      const CX = 300, CW = 184, CH = 112, CY = 267 - CH / 2, CR = CX + CW;
      ENG.forEach(([y], i) => {
        const cy = y + EH / 2, ty = 267 + (i - 1.5) * 14;
        s += fl(`M${PX + PW} ${cy} C ${PX + PW + 30} ${cy}, ${CX - 30} ${ty}, ${CX} ${ty}`, 'fl-flow', {arrow: 'arr-m', dur: 1.1 + i * .1});
      });
      s += T(272, 134, 'unified events', 'f-m', 'middle');
      s += tile(CX, CY, CW, CH, 'console', 'Cato Management App', ['one management plane', 'audit trail · data lake'], {cls: 'pop'});

      /* ---- right: the frameworks the evidence is mapped to ---- */
      const FX = 560, FW = 186, FH = 58;
      const FW_ = [
        [140, 'ISO 27001:2022', 'ISMS certification'],
        [238, 'NIS2',           'EU critical infrastructure'],
        [336, 'SOC 2',          'trust-services audit'],
      ];
      FW_.forEach(([y, t, sub], i) => {
        const cy = y + FH / 2;
        s += fl(`M${CR} 267 C ${CR + 30} 267, ${FX - 30} ${cy}, ${FX} ${cy}`, 'fl-flow', {arrow: true, dur: 1.2 + i * .1});
        s += nd(FX, y, FW, FH, {t, s: [sub]});
      });
      s += T(522, 410, 'unified audit evidence', 'f-m', 'middle');
      return s;
    },
    title: 'From enforcement at the PoP to unified compliance evidence',
    desc: 'CASB, DLP, FWaaS and IPS enforce policy on every flow at the Cato PoP; every decision lands in the Cato Management Application, one management plane and data lake, which produces unified audit evidence for ISO 27001, NIS2 and SOC 2.',
    legend: [['flow', 'One data path: policy enforcement → unified events → audit evidence'], 'live'],
  }],
});
