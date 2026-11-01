/* specs/ai-agentic-security.js — Securing Agentic AI */
DG.page('ai-agentic-security', {
  spotlight: {
    hl: ['users', 'ai', 'pop', 'cloud', 'mgmt'],
    mods: ['ai'],
    flows: [{p: 'ag1'}, {p: 'ag2'}, {p: 'm2'}],
    steps: [
      {t: 'Scout scans developer endpoints for local coding agents, their configuration and connected MCP servers.', marks: ['users']},
      {t: 'Managed agents on Bedrock, AI Foundry and Copilot Studio are discovered and traced through platform APIs.', marks: ['cloud']},
      {t: 'Custom agents send LLM calls through the AI Firewall proxy; Guards inspect prompts, outputs and tool calls.', marks: ['ai', 'pop']},
      {t: 'Every session is recorded in Agent Sessions with violations tagged inline; Local Agents holds the inventory.', marks: ['mgmt']},
    ],
    anchors: {mgmt: [730, 144], cloud: [1548, 396]},   // cloud marker on the cloud group, clear of its '4' heading badge
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, TL, tier, pill, popBox, chips, chipRow, xmark} = K;
      let s = '';
      /* headline */
      s += pill(380, 22, 'Three agent types · one control point · one session audit', 'g');
      s += tier(14, 58, 'AGENT TYPES') + tier(250, 58, 'CONTROL POINT') + tier(570, 58, 'OUTCOMES');

      /* LEFT · the three agent types and how each one is reached (none of this is network traffic) */
      s += nd(14, 80, 180, 56, {t: 'Local agents', s: ['Coding agents · laptops', 'Scout + Agent Controls'], ic: 'laptop', is: 20, icls: 'g'});
      s += T(14, 152, 'endpoint scan · no TLSi needed', 'f-m');
      s += nd(14, 200, 180, 56, {t: 'Managed agents', s: ['Bedrock · Copilot Studio', 'via platform APIs'], ic: 'cpu', is: 20, icls: 'g'});
      s += T(14, 272, 'API discovery · not network traffic', 'f-m');
      s += nd(14, 320, 180, 56, {t: 'Custom agents', s: ['LangChain · Agents SDK', 'via AI-FW proxy endpoint'], ic: 'code', is: 20, icls: 'g'});
      s += T(14, 392, 'LLM base URL → AI-FW proxy + auth header', 'f-m');

      /* agent interactions into the control point */
      s += fl('M194 108C222 108 222 130 250 130', 'fl-https', {dur: 1.2, arrow: true});
      s += fl('M194 228C222 228 222 205 250 205', 'fl-https', {dur: 1.2, arrow: true});
      s += fl('M194 348C222 348 222 280 250 280', 'fl-https', {dur: 1.2, arrow: true});

      /* CENTRE · Cato AI Security */
      s += popBox(250, 70, 270, 270, 'Cato AI Security', 'Agent Policy · AI-FW Guards');
      s += tier(266, 132, 'FOUR INSPECTION POINTS');
      s += chips(266, 140, ['Prompts', 'Outputs', 'Tool calls', 'Tool messages'], 115, 26, 8, 2, 'g');
      s += TL(385, 222, ['Detects prompt injection, jailbreaks,', 'sensitive data exposure and policy violations'], 'f-s', 'middle', 14);
      s += tier(266, 270, 'ON A MATCH');
      s += pill(296, 298, 'alert', 'b') + pill(358, 298, 'log', 'm') + pill(420, 298, 'block', 'r') + pill(484, 298, 'redact', 'y');
      s += T(385, 326, 'action varies by agent type and mode', 'f-s', 'middle');

      /* RIGHT · outcomes */
      s += nd(570, 80, 176, 56, {t: 'Sanctioned systems', s: ['Repos · APIs · MCP tools'], ic: 'db', is: 20, icls: 'g'});
      s += fl('M520 150C545 150 545 108 570 108', 'fl-flow', {dur: 1.2, arrow: 'arr-m'});
      s += pill(658, 152, 'governed · allowed', 'g');

      s += nd(570, 220, 176, 56, {t: 'Risky action', s: ['Injected exfil attempt'], ic: 'bolt', is: 20, cls: 'dash'});
      s += fl('M520 248L545 248', 'fl-down', {np: 0});
      s += xmark(556, 248);
      s += pill(658, 292, 'blocked', 'r');
      s += T(658, 312, 'payload arrived in a tool message', 'f-s', 'middle');

      s += nd(570, 360, 176, 60, {t: 'Session telemetry', s: ['Agent Sessions · audit', 'violations tagged inline'], ic: 'file', is: 20, icls: 'g'});
      s += fl('M520 290C545 290 545 390 570 390', 'fl-net', {np: 0, arrow: 'arr-n'});

      /* BOTTOM · the workflow and the two monitoring lenses */
      s += tier(14, 468, 'ONE WORKFLOW · TWO MONITORING LENSES');
      s += chipRow(14, 478, ['Discover', 'Observe', 'Govern'], 96, 24, 8, 'g');
      s += T(340, 486, 'Local Agents — inventory & posture: what exists, what it can reach', 'f-s');
      s += T(340, 502, 'Agent Sessions — runtime behaviour: what it did, whether policy intervened', 'f-s');
      return s;
    },
    title: 'Securing local, managed and custom AI agents',
    desc: 'Local coding agents found by Scout, managed agents discovered through platform APIs and custom agents proxied through the AI Firewall meet one control point, where Agent Policy and Guards inspect prompts, outputs, tool calls and tool messages, pass governed actions, alert on or block violations and record every session for audit.',
    legend: [['https', 'Agent interaction'], ['flow', 'Governed action — allowed'], ['down', 'Policy violation — blocked'], ['net', 'Session telemetry'], 'live'],
  }],
});
