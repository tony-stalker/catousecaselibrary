/* specs/security-ai.js — AI Security: Users, Applications & Agentic AI (category overview) */
DG.page('security-ai', {
  spotlight: {
    hl: ['users', 'ai', 'saas', 'pop', 'mgmt'],
    anchors: {mgmt: [782, 132]},   // step-4 marker on the CMA box's top edge, clear of its subtitle
    mods: ['ai', 'sse'],
    flows: [{p: 'us1'}, {p: 'us2'}, {p: 'eg-genai'}, {p: 'ag1'}, {p: 'ag2'}, {p: 'm2'}],
    steps: [
      {t: 'Employees reach public GenAI through the Cato Client or the browser plugin; shadow AI is discovered first.', marks: ['users', 'genai']},
      {t: 'SPACE evaluates every prompt and upload against one set of AI policies: monitor, anonymise or block.', marks: ['pop']},
      {t: 'Homegrown apps and agents join the same engine through IDE integration, hooks and APIs.', marks: ['ai']},
      {t: 'Discovery, usage and risk & compliance reporting land in the Cato Management Application.', marks: ['mgmt']},
    ],
  },
  diagrams: [{
    slot: 'main',
    fig: 'aisec',
    /* every edit is an exact leaf-text match on the source figure */
    edits: [
      ['AI SECURITY · EMPLOYEES, AI APPS AND AGENTS, ONE ENGINE', 'AI SECURITY · USERS, APPLICATIONS AND AGENTS, ONE ENGINE'],
      /* on-ramps: the mechanisms the page names per surface, each in the slot whose icon fits it
         (edits change text only, so the source icon stays: cpu · route · plug · code · browser);
         'Browser plugin' / 'employees' are kept as drawn */
      ['Inline', 'Cato Client'], ['in the PoP', 'inline in the PoP'],
      ['Proxy', 'Hooks'], ['your existing proxy', 'apps · coding agents'],
      ['API', 'APIs'], ['out-of-band', 'agent discovery'],
      ['LLM gateway', 'IDE integration'], ['LiteLLM · Kong', 'homegrown apps'],
      /* the engine is a policy set evaluated by SPACE */
      ['Cato AI Security engine', 'Cato AI Security · SPACE'],
      /* detectors: the page names PII and payment data (DLP step); PHI is not on the page.
         Guardrail detectors (prompt injection, jailbreak, OWASP Top 10) stay as KB-backed figure facts
         behind the page's 'runtime guardrails' */
      ['PII · PHI', 'PII · payment data'],
      /* destinations: one per surface, named as the page names them */
      ['ChatGPT · Copilot · Claude', 'ChatGPT · Copilot'],
      ['Model APIs', 'Homegrown AI apps'], ['OpenAI · Bedrock · Azure', 'LLMs in internal apps'],
      ['Agent tools', 'Autonomous agents'], ['MCP · APIs', 'posture · runtime controls'],
      ['compliance evidence', 'usage · risk · compliance'],
      /* overview-app navigation chips become page facts */
      ['Full AI Security sheet ↗', 'one engine · three surfaces'],
      ['Full sheet: AI Security', 'Prompt-level audit log'],
      ['5 on-ramps', 'Users · apps · agents'],
    ],
    title: 'One AI Security engine for users, apps and agents',
    desc: 'Employee prompts via the Cato Client and browser plugin, homegrown apps via IDE integration and hooks, and autonomous agents via APIs all reach Cato AI Security, a set of policies evaluated by SPACE, whose detectors, profiles and actions govern every interaction and log it for usage, risk and compliance reporting.',
    caption: 'One engine, three surfaces: employee prompts arrive through the Cato Client or the browser plugin, homegrown apps through IDE integration and hooks, autonomous agents through APIs. The same detectors and profile decide allow, anonymise, redirect, notify or block, and every interaction is logged for usage, risk and compliance reporting.',
    legend: [['tun', 'On-ramp into the engine'], ['flow', 'Governed AI interaction'], 'live'],
  }],
});
