/* specs/ai-homegrown-apps.js — Securing Homegrown AI Applications (AI Security for Apps) */
DG.page('ai-homegrown-apps', {
  spotlight: {
    hl: ['ai', 'cloud', 'pop', 'saas', 'mgmt'],
    mods: ['ai'],
    anchors: {mgmt: [782, 132], cloud: [1263, 396]},   // step-4 marker on the CMA top edge; step-3 cloud marker on the cl-aws path, clear of the '4' heading
    flows: [{p: 'ag1'}, {p: 'ag2'}, {p: 'eg-genai'}, {p: 'cl-aws'}, {p: 'm2'}],
    steps: [
      {t: 'A homegrown chatbot, copilot or RAG app sends every prompt to a Cato Guard before it reaches a model.', marks: ['ai']},
      {t: "The engine's detectors redact PII and forward benign prompts; injection and jailbreak attempts are blocked.", marks: ['pop']},
      {t: 'Cleared requests reach OpenAI, Claude, Gemini, Bedrock or a self-hosted OpenAI-compatible model.', marks: ['genai', 'cloud']},
      {t: 'Every session, verdict and analysis report is queryable in the Interaction Explorer; blocks alert the SOC.', marks: ['mgmt']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, L, tile, tier, pill, popBox, xmark} = K;
      let s = '';

      /* ---- section labels ---- */
      s += tier(14, 34, 'WHO PROMPTS') + tier(172, 34, 'HOMEGROWN APP') + tier(340, 34, 'CATO AI SECURITY GUARD') + tier(560, 34, 'MODELS');

      /* ---- left: the two personas ---- */
      s += tile(14, 80, 136, 92, 'user', 'Priya — app user', ['Benign prompt with PII']);
      s += tile(14, 270, 136, 92, 'bolt', 'Attacker', ['Injection · jailbreak']);

      /* ---- the app both of them talk to ---- */
      s += tile(172, 176, 140, 92, 'code', 'Homegrown AI app', ['Chatbot · copilot · RAG']);
      s += fl('M150 126C162 126 162 208 172 208', 'fl-https', {arrow: true, dur: 1.3});
      s += fl('M150 316C162 316 162 236 172 236', 'fl-https', {arrow: true, dur: 1.3});

      /* ---- centre: the Guard sits between the app and every model ---- */
      const GX = 340, GY = 60, GW = 192, GH = 290, GC = GX + GW / 2;
      s += popBox(GX, GY, GW, GH, 'AI Security Guard', 'Proxy · API · AI Gateway');
      s += nd(GX + 12, 114, GW - 24, 56, {t: 'AI Security Engine', s: ['detectors · profiles'], ic: 'ai', is: 20, icls: 'g'});
      s += T(GC, 190, 'PII · secrets · injection · topics', 'f-s', 'middle');
      s += pill(GC, 214, 'Cato Cloud or Outpost', 'm');
      s += pill(GC, 238, 'Playground · test first', 'm');
      s += xmark(GC, 284);
      s += pill(GC, 318, 'blocked at the Guard', 'r');

      /* app → Guard: the benign prompt into the engine, the attack into the block */
      s += fl(`M312 208C328 208 328 142 ${GX + 12} 142`, 'fl-flow', {arrow: true, dur: 1.2});
      s += fl(`M312 240C340 240 356 284 ${GC - 11} 284`, 'fl-down', {dur: 1.2});

      /* ---- right: where cleared prompts go ---- */
      s += nd(560, 90, 186, 56, {t: 'LLM providers', s: ['OpenAI · Claude · Gemini'], ic: 'ai', is: 20, icls: 'g'});
      s += pill(653, 166, 'PII redacted · forwarded', 'g');
      s += nd(560, 230, 186, 56, {t: 'Self-hosted models', s: ['OpenAI-compatible API'], ic: 'cpu', is: 20, icls: 'g', cls: 'soft'});
      s += fl(`M${GX + GW} 130C546 130 546 118 560 118`, 'fl-flow', {arrow: true, dur: 1.1});
      s += fl(`M${GX + GW} 150C546 150 546 258 560 258`, 'fl-flow', {arrow: true, dur: 1.1});

      /* ---- bottom: the evidence ---- */
      s += tier(448, 426, 'AUDIT TRAIL') + tier(560, 426, 'ALERTING');
      s += fl(L(GC, GY + GH, GC, 440), 'fl-net', {np: 0, arrow: true});
      s += nd(340, 440, 192, 56, {t: 'Interaction Explorer', s: ['Sessions · detections'], ic: 'file', is: 20, icls: 'g'});
      s += fl(`M${GC + 11} 284C520 300 610 340 650 440`, 'fl-hot', {arrow: true, label: 'alert', lx: 578, ly: 372, lcls: 'r', dur: 1.4});
      s += nd(560, 440, 186, 56, {t: 'SOC / XDR', s: ['Blocked-event alerts'], ic: 'shield', is: 20, icls: 'g'});
      return s;
    },
    title: 'A Cato Guard in the homegrown AI interaction path',
    desc: 'Every prompt and response from a homegrown chatbot, copilot or RAG app passes a Cato AI Security Guard — Proxy, API or AI Gateway — whose engine redacts PII and forwards benign prompts to the model, blocks injection and jailbreaks, alerts the SOC and records the whole session in the Interaction Explorer.',
    legend: [['https', 'User or attacker prompt'], ['flow', 'Benign prompt — PII redacted, forwarded'], ['down', 'Injection / jailbreak — blocked at the Guard'], ['hot', 'Alert to SOC / XDR'], ['net', 'Session record to the Interaction Explorer'], 'live'],
  }],
});
