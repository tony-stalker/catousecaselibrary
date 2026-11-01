/* specs/ai-eu-ai-act.js — EU AI Act: Visibility, Control & Evidence (AI Security, compliance) */
DG.page('ai-eu-ai-act', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'ai', 'mgmt', 'xops'],
    mods: ['ai', 'sse'],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'eg-genai'}, {p: 'm2'}, {p: 'spine'}],
    steps: [
      {t: 'EU sites, the hybrid workforce and UK users whose AI output is used in the EU all cross a Cato PoP.', marks: ['branch', 'users']},
      {t: "Shadow AI Discovery builds the deployer's AI inventory passively, without reading prompt content.", marks: ['pop']},
      {t: 'The User Interaction Policy allows, anonymises or blocks per prompt; org-classified prohibited use is blocked.', marks: ['genai']},
      {t: 'Events, the Audit Trail and SIEM export are supporting evidence; risk classification stays with governance.', marks: ['mgmt', 'xops']},
    ],
    anchors: {mgmt: [722, 146]},
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, tier, pill, popBox, chipRow, xmark} = K;
      let s = '';
      const PX = 240, PY = 60, PW = 270, PH = 300;
      /* ---- tiers ---- */
      s += tier(14, 34, 'WHERE AI IS USED') + tier(PX + 20, 34, 'CATO PoP · AI SECURITY') + tier(560, 34, 'AI DESTINATIONS');

      /* ---- left: the three edges in scope of the Act ---- */
      s += nd(14, 70, 170, 56, {t: 'Madrid Office', s: ['Socket · EU deployer'], ic: 'building', is: 20, icls: 'g'});
      s += nd(14, 160, 170, 56, {t: 'Hybrid workforce', s: ['Cato Client · ZTNA'], ic: 'laptop', is: 20, icls: 'g'});
      s += nd(14, 250, 170, 56, {t: 'London HQ — UK', s: ['Output used in the EU'], ic: 'building', is: 20, icls: 'g', cls: 'soft'});
      s += pill(116, 324, 'Art 2(1)(c) · output trigger', 'm keep');

      /* ---- centre: the PoP — discovery first, policy second ---- */
      s += popBox(PX, PY, PW, PH, 'Cato PoP', 'TLS inspection · User Interaction Policy');
      s += nd(PX + 25, 108, 220, 52, {t: 'Shadow AI Discovery', s: ['passive · no prompt content read'], ic: 'eye', is: 18, icls: 'g', cls: 'soft'});
      s += nd(PX + 25, 176, 220, 52, {t: 'User Access Policy', s: ['who may reach which AI app'], ic: 'key', is: 18, icls: 'g'});
      s += nd(PX + 25, 244, 220, 52, {t: 'User Interaction Policy', s: ['allow · anonymise · block'], ic: 'shield', is: 18, icls: 'g'});
      s += T(PX + PW / 2, 322, 'discovery first, policy second', 'f-s', 'middle');
      s += T(PX + PW / 2, 338, 'access rules run before interaction rules', 'f-s', 'middle');

      /* flows onto the PoP */
      /* fanned onto three points of the Discovery box's left edge so no two tunnels cross */
      s += fl(`M184 98C214 98 218 122 ${PX + 25} 122`, 'fl-tun', {dur: 1.3});
      s += fl(`M184 188C214 188 218 134 ${PX + 25} 134`, 'fl-tun', {dur: 1.3});
      s += fl(`M184 278C214 278 218 146 ${PX + 25} 146`, 'fl-tun', {dur: 1.3});
      /* the pipeline inside the PoP: discovery, then access, then interaction */
      s += fl(`M${PX + 135} 160L${PX + 135} 176`, 'fl-net', {np: 0, arrow: true});
      s += fl(`M${PX + 135} 228L${PX + 135} 244`, 'fl-net', {np: 0, arrow: true});

      /* ---- right: three destinations, three verdicts ---- */
      s += nd(560, 70, 186, 56, {t: 'Sanctioned AI', s: ['Approved · risk-scored'], ic: 'ai', is: 20, icls: 'g'});
      s += pill(653, 144, 'allowed · inspected', 'g');
      s += nd(560, 160, 186, 56, {t: 'Unsanctioned AI', s: ['Monitor · anonymise'], ic: 'ai', is: 20, icls: 'g', cls: 'soft'});
      s += pill(653, 234, 'monitored · anonymised', 'y');
      s += nd(560, 250, 186, 56, {t: 'Prohibited-use AI', s: ['Org-classified · blocked'], ic: 'ai', is: 20, icls: 'g', cls: 'soft'});
      s += pill(653, 324, 'blocked · non-use evidenced', 'r');
      const OX = PX + 245;   /* right edge of the User Interaction Policy box */
      /* three separate exits on the policy box's right edge, one per verdict, so no two curves cross */
      s += fl(`M${OX} 258C530 258 530 98 560 98`, 'fl-flow', {dur: 1.1});
      s += fl(`M${OX} 270C536 270 540 188 560 188`, 'fl-flow', {dur: 1.1});
      s += fl(`M${OX} 282C512 282 520 278 534 278`, 'fl-down', {np: 0});
      s += xmark(546, 278);

      /* ---- evidence lane: every decision lands in the CMA ---- */
      s += fl(`M420 ${PY + PH}C420 400 470 408 546 408`, 'fl-net', {np: 0, arrow: true});
      s += nd(546, 380, 200, 56, {t: 'CMA — evidence', s: ['AI dashboards · Events export'], ic: 'chart', is: 20, icls: 'g'});
      s += fl(`M646 436L646 456`, 'fl-net', {np: 0, arrow: true});
      s += nd(546, 456, 200, 48, {t: 'Audit Trail · SIEM feed', s: ['attributed · exportable'], ic: 'db', is: 18, icls: 'g', cls: 'soft'});
      s += T(746, 524, "supporting evidence — not the AI system's own logs", 'f-m', 'end');

      /* ---- bottom-left: the honest mapping — what stays with governance ---- */
      s += tier(14, 418, 'STAYS WITH GOVERNANCE');
      s += chipRow(14, 428, ['Risk classification', 'FRIA · Art 27', 'Conformity · docs'], 150, 22, 10, '');
      s += T(14, 474, 'The discovered inventory is the input these exercises start from;', 'f-s');
      s += T(14, 490, "they stay with the customer's governance programme.", 'f-s');
      return s;
    },
    title: 'EU AI Act readiness from the network: inventory, control, evidence',
    desc: "AI traffic from EU sites, the hybrid workforce and UK users whose output is used in the Union crosses a Cato PoP where Shadow AI Discovery builds the deployer's inventory and the User Interaction Policy allows, anonymises or blocks per prompt, with attributable events, the Audit Trail and SIEM export as supporting evidence while risk classification stays with governance.",
    legend: [['tun', 'Site / Client to the PoP'], ['flow', 'Allowed or anonymised prompt'], ['down', 'Blocked — org-classified prohibited use'], ['net', 'Evidence to the CMA / SIEM'], 'live'],
  }],
});
