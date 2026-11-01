/* specs/ai-legal-genai.js — Law Firms: GenAI with Privilege Intact (AI Security for End Users, Legal vertical) */
DG.page('ai-legal-genai', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'ai', 'mgmt'],
    anchors: {mgmt: [782, 132]},   // step-4 marker clear of the CMA subtitle
    mods: ['ai'],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'eg-genai'}, {p: 'm2'}],
    steps: [
      {t: "Fee-earners' prompts already cross a Cato PoP — office behind a Socket, laptops on the Cato Client.", marks: ['branch', 'users']},
      {t: "The User Interaction Policy redacts client identifiers per IdP group, mirroring the firm's ethical walls.", marks: ['pop']},
      {t: "The sanctioned assistant answers with client identifiers masked; a restricted matter team is blocked.", marks: ['genai']},
      {t: 'Every redacted, monitored or blocked interaction is exportable as outside-counsel evidence.', marks: ['mgmt']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, tier, pill, popBox, chips, chipRow, xmark} = K;
      let s = '';
      /* ---- tiers ---- */
      s += tier(14, 34, 'FEE-EARNERS') + tier(240, 34, 'CATO PoP · AI SECURITY') + tier(560, 34, 'GENAI DESTINATIONS');

      /* ---- left: three personas, one firm ---- */
      s += nd(14, 70, 200, 56, {t: 'Rachel — associate', s: ['On-net · client IDs redacted'], ic: 'user', is: 20, icls: 'g'});
      s += nd(14, 160, 200, 56, {t: 'Partner', s: ['Personal-tier tool'], ic: 'laptop', is: 20, icls: 'g'});
      s += nd(14, 250, 200, 56, {t: 'Restricted team', s: ['Ethical-walled matter'], ic: 'users', is: 20, icls: 'g', cls: 'dash'});
      s += pill(114, 324, 'IdP group · OCG: no AI', 'm keep');

      /* ---- centre: the PoP running the User Interaction Policy ---- */
      const PX = 240, PY = 60, PW = 270, PH = 300;
      s += popBox(PX, PY, PW, PH, 'Cato PoP', 'AI Security · User Interaction Policy');
      s += tier(PX + 14, 118, 'RULE SCOPE');
      s += chips(PX + 14, 126, ['IdP group', 'AI app set', 'Engine profile', 'Action'], 118, 20, 6, 2, 'g');
      s += nd(PX + 25, 192, 220, 70, {t: 'Decision per interaction', s: ['Monitor · Anonymize and Monitor', 'Anonymize and Block · Block'], cls: 'soft'});
      s += T(PX + PW / 2, 300, 'rules scoped per IdP group', 'f-s', 'middle');
      s += T(PX + PW / 2, 316, "mirror the firm's ethical walls", 'f-s', 'middle');

      /* flows onto the PoP */
      s += fl(`M214 98C232 98 236 120 ${PX} 120`, 'fl-tun', {dur: 1.3});
      s += fl(`M214 188C232 188 236 182 ${PX} 182`, 'fl-tun', {dur: 1.3});
      s += fl(`M214 278C232 278 236 244 ${PX} 244`, 'fl-tun', {dur: 1.3});

      /* ---- right: three destinations, three verdicts ---- */
      s += nd(560, 70, 186, 56, {t: 'Sanctioned firm AI', s: ['Client IDs redacted'], ic: 'ai', is: 20, icls: 'g'});
      s += pill(653, 144, 'allowed · redacted', 'g');
      s += nd(560, 160, 186, 56, {t: 'Public GenAI', s: ['Personal-tier tools'], ic: 'ai', is: 20, icls: 'g', cls: 'soft'});
      s += pill(653, 234, 'anonymised · monitored', 'y');
      s += nd(560, 250, 186, 56, {t: 'Any GenAI app', s: ['Off-limits for team'], ic: 'ai', is: 20, icls: 'g', cls: 'soft'});
      s += pill(653, 324, 'blocked · notified', 'r');
      s += fl(`M${PX + PW} 120C540 120 548 98 560 98`, 'fl-flow', {dur: 1.1, arrow: 'arr-m'});
      s += fl(`M${PX + PW} 182C540 182 548 188 560 188`, 'fl-flow', {dur: 1.1, arrow: 'arr-m'});
      s += fl(`M${PX + PW} 244C522 244 528 272 534 278`, 'fl-down', {np: 0});
      s += xmark(546, 278);

      /* ---- evidence: every decision logged ---- */
      s += fl(`M420 ${PY + PH}C420 400 470 408 536 408`, 'fl-net', {np: 0, arrow: true});
      s += nd(536, 380, 210, 56, {t: 'AI dashboards & evidence', s: ['Report · AI Users · Events'], ic: 'chart', is: 20, icls: 'g'});

      /* ---- bottom: the DLP backstop (footnote chip, not a node) ---- */
      s += tier(14, 470, 'DLP BACKSTOP');
      s += chipRow(14, 480, ['DLP Legal profile · Generative AI Tools'], 236, 22, 12, '');
      s += T(14, 526, 'Legal profile ML classifiers detect agreements, patents, court documents and powers of attorney — set to monitor or block per stage.', 'f-s');
      return s;
    },
    title: 'GenAI for fee-earners with privilege intact',
    desc: "Fee-earners' prompts cross the Cato PoP where the User Interaction Policy, scoped per IdP group like the firm's ethical walls, redacts client identifiers for the sanctioned assistant, anonymises personal-tier use and blocks GenAI for a restricted matter team, with each decision logged as client-facing evidence.",
    legend: [['tun', 'Fee-earner traffic to the PoP'], ['flow', 'Allowed or anonymised — identifiers redacted'], ['down', 'Blocked — restricted team / OCG'], ['net', 'Evidence to dashboards'], 'live'],
  }],
});
