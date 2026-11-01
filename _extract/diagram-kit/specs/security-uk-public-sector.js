/* specs/security-uk-public-sector.js — UK Public Sector: Cyber Essentials & NCSC CAF */
DG.page('security-uk-public-sector', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'mgmt'],
    mods: ['sse', 'uztna'],
    anchors: {mgmt: [782, 132], saas: [302, 310]},   // markers clear of the CMA and "Smart egress" subtitles
    flows: [{p: 'br1'}, {p: 'br2'}, {p: 'us1'}, {p: 'eg-saas'}, {p: 'eg-www'}, {p: 'm1'}],
    steps: [
      {t: 'Council HQ, depots, schools and remote or field staff all connect through a UK Cato PoP.', marks: ['branch', 'users']},
      {t: 'One policy — FWaaS, IPS, anti-malware, ZTNA and DLP — is enforced on every flow at the PoP.', marks: ['pop']},
      {t: 'Traffic reaches government services, M365 and SaaS from one default-deny boundary for the estate.', marks: ['saas']},
      {t: 'Policy, posture and events land in the CMA: the evidence a CE Plus assessor or CAF review asks for.', marks: ['mgmt']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 460',
    draw: K => {
      const {nd, fl, T, R, tier, ring, fpin, fy, cloud} = K;
      let s = '';

      /* ---- top: the policy umbrella over the UK PoP ---- */
      s += tier(14, 16, 'CATO SASE CLOUD · UK');
      s += R(236, 26, 288, 50, 'nd soft', 12);
      s += T(380, 47, 'One policy umbrella', 'nd-t', 'middle');
      s += T(380, 64, 'FWaaS · IPS · Anti-Malware · ZTNA · DLP', 'nd-s', 'middle');
      s += T(380, 124, 'UK PoP', 'nd-t g', 'middle');
      s += T(380, 139, 'full stack on every flow', 'f-s', 'middle');

      /* the backbone ring; the PoP sits on its front edge */
      const RG = {cx: 380, cy: 200, rx: 120, ry: 30};
      const PX = 380, TIP = Math.round(fy(RG, PX));
      s += T(512, 204, 'Global Private Backbone', 'f-m', 'start');
      s += ring(RG);

      /* ---- left: the estate ---- */
      const EX = 14, EW = 180, EH = 56;
      s += tier(EX, 108, 'PUBLIC-BODY ESTATE');
      const EDGES = [
        [120, 'building', 'Council HQ',           'Socket · civic centre',  'fl-tun',   `C 290 148, 330 196, ${PX - 14} ${TIP - 6}`],
        [210, 'building', 'Depots & schools',     'branch Sockets',         'fl-tun',   `C 270 238, 320 234, ${PX - 22} ${TIP}`],
        [300, 'users',    'Remote & field staff', 'Cato Client · ZTNA',     'fl-tun',   `C 300 328, 340 300, ${PX - 12} ${TIP + 8}`],
      ];
      EDGES.forEach(([y, ic, t, sub, cls, c], i) => {
        s += fl(`M${EX + EW} ${y + EH / 2} ${c}`, cls, {dur: 1.3 + i * .15});
        s += nd(EX, y, EW, EH, {t, s: [sub], ic, is: 22, icls: 'g'});
      });

      /* ---- right: egress to cloud and internet services ---- */
      s += tier(572, 60, 'SERVICES');
      s += cloud(652, 136, 1.3, 'Cloud & internet', 'gov services · M365 · SaaS');
      s += fl(`M${PX + 24} ${TIP - 44} C 470 180, 530 156, 572 142`, 'fl-flow', {arrow: true, dur: 1.2});

      /* ---- bottom: the evidence lane ---- */
      s += fl(`M${PX + 4} ${TIP + 6} C 404 280, 402 300, 398 340`, 'fl-net', {arrow: 'arr-n', dur: 1.5});
      s += T(412, 296, 'evidence lane', 'f-m');
      s += nd(300, 340, 196, 72, {t: 'CMA — evidence', s: ['policy · posture · events', 'Audit Trail · exports'], ic: 'console', is: 22, icls: 'g', cls: 'pop'});
      s += tier(570, 286, 'ASSESSMENT');
      s += fl('M496 364 C 530 352, 540 334, 570 327', 'fl-net fl-dim', {arrow: 'arr-n', dur: 1.4});
      s += fl('M496 388 C 530 400, 540 400, 570 407', 'fl-net fl-dim', {arrow: 'arr-n', dur: 1.5});
      s += nd(570, 300, 176, 54, {t: 'CE Plus assessor', s: ['verification evidence'], ic: 'users', is: 22, icls: 'g'});
      s += nd(570, 380, 176, 54, {t: 'CAF assessment', s: ['objectives A–D'], ic: 'file', is: 22, icls: 'g'});

      /* the PoP itself, on top of the flows */
      s += fpin(PX, TIP, 26, 'PoP', {halo: true});
      return s;
    },
    title: 'One estate, one policy, one evidence lane',
    desc: 'A council HQ, depots and schools, and remote and field staff all connect through a UK Cato PoP where one policy — FWaaS, IPS, anti-malware, ZTNA and DLP — is enforced before traffic reaches cloud and internet services, while a grey evidence lane carries policy, posture and event data into the CMA for a Cyber Essentials Plus assessor and a CAF assessment.',
    legend: [['tun', 'HQ, depots & schools (Sockets) and remote & field staff (Cato Client) — encrypted tunnels to the PoP'], ['flow', 'Egress to cloud & internet services'], ['net', 'Evidence lane — policy, posture and events to the CMA'], 'live'],
  }],
});
