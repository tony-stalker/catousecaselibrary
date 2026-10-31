/* specs/ai-threat-landscape.js — AI Threat Landscape: Real Attacks & Defences */
DG.page('ai-threat-landscape', {
  spotlight: {
    hl: ['users', 'branch', 'pop', 'saas', 'ai', 'xops'],
    mods: ['sse', 'ai'],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'eg-www'}, {p: 'eg-genai'}, {p: 'spine'}],
    steps: [
      {t: 'Deepfake fraud starts with a phishing message and pivots to a stolen credential; both cross the PoP.', marks: ['users']},
      {t: 'AI-orchestrated attacks run the kill chain at machine speed; IPS virtual patching meets them in every PoP.', marks: ['popL']},
      {t: 'Shadow-AI prompts and uploads are discovered, then coached, anonymised or blocked per rule — not banned.', marks: ['genai']},
      {t: 'XDR stories correlate whatever survives each class into one incident with a timeline and MITRE mapping.', marks: ['xops']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, R, I, tier, popBox, chipRow, pill, xmark, mark} = K;
      let s = '';
      const Y = [116, 236, 356];                 // lane centres
      const LX = 14, LW = 160;                   // attack-class boxes
      const PX = 222, PW = 276;                  // Cato SASE Cloud
      const RX = 586, RW = 160;                  // outcome boxes
      const CX = PX + PW / 2;

      s += tier(LX, 20, 'AI ATTACK CLASSES');
      s += tier(RX, 20, 'THE OUTCOME');

      /* an attack class: red-edged node */
      const bad = (y, t, sub, c = 'var(--danger)') => R(LX, y - 28, LW, 56, 'nd', 10, `style="stroke:${c};stroke-width:1.6"`)
        + T(LX + LW / 2, y - 3, t, 'nd-t', 'middle') + T(LX + LW / 2, y + 12, sub, 'nd-s', 'middle');
      s += bad(Y[0], 'Deepfake fraud', 'voice & video imposters');
      s += bad(Y[1], 'AI-orchestrated attacks', 'agents · AI malware');
      s += bad(Y[2], 'Shadow AI & data leak', 'prompts · rogue AI tools', 'var(--amber)');

      /* the single-pass engine, one cell per lane */
      s += popBox(PX, 44, PW, 360, 'Cato SASE Cloud', 'one pass · every flow · every user');
      const cell = (y, chip, sub) => chipRow(CX - 110, y - 24, [chip], 220, 22, 0, 'g') + T(CX, y + 14, sub, 'f-s', 'middle');
      s += cell(Y[0], 'SWG · DNS · NGAM · ZTNA', 'phishing & stolen creds');
      s += cell(Y[1], 'IPS virtual patching', 'SPACE · XDR stories');
      s += cell(Y[2], 'AI Security suite', 'Discovery · UIP · GenAI DLP');
      s += T(CX, Y[2] + 30, 'governed, not banned', 'f-s', 'middle');

      /* lanes 1 and 2: attack paths, blocked at the PoP boundary */
      [Y[0], Y[1]].forEach((y, i) => {
        s += fl(`M${LX + LW} ${y}H${PX - 12}`, 'fl-attack', {dur: 1.2 + i * .2, pcls: 'pt red'}) + xmark(PX, y);
      });
      /* lane 3: employee prompts, governed through the PoP */
      s += fl(`M${LX + LW} ${Y[2]}H${PX}`, 'fl-https', {dur: 1.1, arrow: true});

      /* outcomes */
      const good = (y, t, sub) => nd(RX, y - 28, RW, 56, {t, s: [sub], cls: 'soft'});
      s += good(Y[0], 'Fraud chain broken', 'callback checks stay human');
      s += good(Y[1], 'Machine speed matched', 'blast radius capped');
      s += good(Y[2], 'Data stays home', 'AI adoption governed');
      Y.forEach((y, i) => {
        s += fl(`M${PX + PW} ${y}H${RX}`, 'fl-flow', {dur: 1 + i * .15, arrow: true});
        if (i < 2) s += mark((PX + PW + RX) / 2, y, 'ok');
      });
      s += pill(RX + RW / 2, Y[2] + 46, 'anonymise · monitor', 'y');

      /* whatever survives goes to XDR */
      const XY = 440;
      ['M320 404C320 424 350 420 350 ' + XY, `M${CX} 404V${XY}`, 'M400 404C400 424 370 420 370 ' + XY].forEach(d => { s += fl(d, 'fl-net', {np: 0}); });
      s += nd(CX - 100, XY, 200, 48, {t: 'XDR · data lake', s: ['one incident story'], ic: 'db', is: 20, icls: 'g'});
      s += T(380, 526, 'Every class crosses the same single-pass engine — and XDR correlates whatever survives into one story', 'f-s', 'middle');
      return s;
    },
    title: 'Three AI attack classes, one single-pass engine',
    desc: 'Deepfake fraud, AI-orchestrated attacks and shadow-AI data leakage each cross the same Cato PoP: the first two are broken at the network kill chain by SWG, DNS security, anti-malware, ZTNA and IPS virtual patching, the third is discovered and governed rather than banned, and XDR correlates whatever survives into one story.',
    legend: [['attack', 'AI-assisted attack path — blocked at the PoP'], ['https', 'Employee GenAI prompts'], ['flow', 'Outcome delivered'], ['net', 'Signals to XDR'], 'live'],
  }],
});
