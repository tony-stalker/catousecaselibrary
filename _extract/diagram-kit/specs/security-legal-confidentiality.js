/* specs/security-legal-confidentiality.js — Law Firms: Client Confidentiality & Ethical Walls */
DG.page('security-legal-confidentiality', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'dc', 'saas', 'mgmt'],
    mods: ['uztna', 'sse'],
    anchors: {mgmt: [782, 132], saas: [302, 310]},   // step markers clear of the CMA and SaaS egress subtitles
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'dc1', rev: true}, {p: 'eg-saas'}, {p: 'm1'}],
    steps: [
      {t: 'Two matter teams share one office and one LAN; a remote fee-earner joins through the Cato Client.', marks: ['branch', 'users']},
      {t: 'The PoP enforces an identity-based ethical wall: each IdP group reaches only its own DMS workspace.', marks: ['pop']},
      {t: 'A cross-wall attempt is blocked, and DLP stops a privileged document bound for personal cloud storage.', marks: ['dc', 'saas']},
      {t: 'Every allow and block lands in the CMA as the evidence a client security questionnaire asks for.', marks: ['mgmt']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, tier, site, fpin, ring, pill, xmark} = K;
      let s = '';
      const RG = {cx: 340, cy: 250, rx: 110, ry: 55};

      /* left: one office, two matter teams on the same LAN; the remote fee-earner below */
      s += site(14, 36, 206, 186, 'ONE OFFICE');
      s += T(117, 58, 'same floor · same LAN', 'f-s', 'middle');
      s += nd(26, 70, 182, 50, {t: 'Matter A team', s: ['IdP group · WALL-A'], ic: 'users', is: 20, icls: 'g'});
      s += nd(26, 146, 182, 50, {t: 'Matter B team', s: ['IdP group · WALL-B'], ic: 'users', is: 20, icls: 'g'});
      s += nd(26, 300, 182, 50, {t: 'Remote fee-earner', s: ['Cato Client · anywhere'], ic: 'laptop', is: 20, icls: 'g'});

      /* centre: the Cato PoP on the backbone, the ethical-wall policy above it */
      s += tier(230, 88, 'CATO SASE CLOUD');
      s += nd(230, 100, 220, 50, {t: 'Identity-based ethical wall', s: ['WAN FW · DMS app segments'], cls: 'soft'});
      s += fl('M340 150V188', 'fl-sig', {np: 0, arrow: 'arr-ms'});
      s += ring(RG);
      s += fpin(340, 288, 24, 'PoP', {halo: true});
      s += T(340, 324, 'Cato PoP', 'nd-t g', 'middle');
      s += T(340, 338, 'Global Private Backbone', 'f-s', 'middle');
      s += pill(340, 358, 'WAN FW · ZTNA · DLP', 'g keep');

      /* inbound: both teams and the remote fee-earner cross the same PoP */
      s += fl('M208 95C226 95 222 200 245 222', 'fl-flow', {dur: 1.3});
      s += fl('M208 171C220 171 214 236 236 242', 'fl-flow', {dur: 1.3});
      s += fl('M208 325C250 325 222 278 252 278', 'fl-https', {dur: 1.2});

      /* right: destinations */
      s += tier(570, 38, 'DESTINATIONS');
      s += nd(570, 50, 176, 50, {t: 'Matter A — DMS', s: ['privileged workspace'], ic: 'file', is: 20, icls: 'g'});
      s += nd(570, 190, 176, 50, {t: 'Matter B — DMS', s: ['opposing matter'], ic: 'file', is: 20, icls: 'g'});
      s += nd(570, 330, 176, 50, {t: 'Personal storage', s: ['consumer cloud drive'], ic: 'globe', is: 20, icls: 'g'});
      s += nd(570, 440, 176, 64, {t: 'CMA — evidence', s: ['events · Audit Trail', 'questionnaire pack'], ic: 'console', is: 20, icls: 'g', cls: 'pop'});

      /* outbound: each team to its own workspace */
      s += fl('M425 215C470 215 500 75 570 75', 'fl-flow', {dur: 1.2, arrow: 'arr-m'});
      s += fl('M446 255C490 255 500 215 570 215', 'fl-flow', {dur: 1.2, arrow: 'arr-m'});
      /* blocked: the cross-wall attempt, and the privileged upload DLP catches */
      s += fl('M446 235C488 235 505 194 526 194', 'fl-flow fl-down', {np: 0});
      s += xmark(538, 194);
      s += pill(622, 150, 'cross-wall attempt', 'r keep');
      s += fl('M444 268C480 268 490 355 526 355', 'fl-flow fl-down', {np: 0});
      s += xmark(536, 355);
      s += pill(632, 312, 'DLP — privileged upload', 'r keep');
      /* evidence lane: every allow and block lands in the CMA */
      s += fl('M410 292C430 400 470 472 570 472', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += T(486, 500, 'every allow · every block', 'f-s', 'middle');
      return s;
    },
    title: 'Identity-based ethical wall between two matter teams, with DLP and an evidence lane',
    desc: 'Two matter teams on the same office LAN and a remote fee-earner cross a Cato PoP enforcing an identity-based ethical wall: each team reaches only its own DMS workspace, a cross-wall attempt is blocked, DLP blocks a privileged document bound for personal cloud storage, and every decision lands in the CMA as evidence.',
    legend: [['flow', 'Matter teams — each to its own workspace'], ['https', 'Remote fee-earner — same wall, wherever they work'], ['down', 'Blocked at the PoP — cross-wall access · privileged-doc exfil'], ['net', 'Evidence lane to the CMA'], 'live'],
  }],
});
