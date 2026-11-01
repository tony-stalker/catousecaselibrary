/* specs/demo-casb.js — Demo Segment: CASB */
DG.page('demo-casb', {
  spotlight: {
    hl: ['users', 'branch', 'pop', 'saas', 'ai', 'mgmt'],   // 'ai' also lights the GenAI cloud that step 3 marks
    mods: ['sse'],
    flows: [{p: 'us1'}, {p: 'br1'}, {p: 'eg-saas'}, {p: 'eg-genai'}, {p: 'm1'}],
    steps: [
      {t: 'Every user and site already sends its traffic through the PoP, so the SaaS inventory builds from traffic.', marks: ['users', 'branch']},
      {t: 'The engine identifies each cloud application inline, looks up its risk score and checks the tenant.', marks: ['pop']},
      {t: 'The activity decides the action: corporate tenant allowed, personal tenant blocked, risky app browse-only.', marks: ['saas', 'genai']},
      {t: 'The inventory, risk scores and every decision land in the Cloud Apps Dashboard and the event stream.', marks: ['mgmt']},
    ],
    anchors: {mgmt: [782, 132], saas: [302, 310]},   // markers clear of the CMA and "Smart egress" subtitles (same as demo-swg, demo-dem)
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 470',
    draw: K => {
      const {nd, fl, T, tier, site, popBox, cloud, chips, pill, mark, xmark} = K;
      let s = '';
      /* ---- sources: all traffic already reaches the PoP ---- */
      s += tier(16, 20, 'ALREADY ON CATO');
      s += site(16, 44, 196, 104, 'Bristol Office');
      s += nd(28, 74, 172, 56, {t: 'Socket', s: ['all traffic'], ic: 'building', icls: 'g'});
      s += nd(16, 224, 196, 56, {t: 'Remote user', s: ['Cato Client'], ic: 'laptop', icls: 'g'});

      /* ---- the single-pass engine: four look-ups per flow ---- */
      s += popBox(244, 34, 236, 300, 'Cato PoP — single-pass engine', 'inline · every user and site');
      s += tier(262, 100, 'PER FLOW');
      s += chips(262, 112, ['App ID', 'Risk score', 'Tenant', 'Activity'], 200, 30, 14, 1, 'g');
      s += pill(362, 308, 'Application Control', 'm');

      /* ---- sources into the PoP ---- */
      s += fl('M200 102C224 102 222 127 244 127', 'fl-tun', {dur: 1.2});
      s += fl('M212 252C230 252 228 229 244 229', 'fl-tun', {dur: 1.2});

      /* ---- three outcomes ---- */
      s += tier(588, 20, 'THREE OUTCOMES');
      s += cloud(655, 74, 1.25, 'Corporate tenant', 'Sanctioned tenant');
      s += mark(596, 42, 'ok');
      s += pill(655, 128, 'Allow · monitor', 'g');
      s += cloud(655, 199, 1.25, 'Personal tenant', 'Same app — unsanctioned');
      s += pill(655, 253, 'Block', 'r');
      s += cloud(655, 324, 1.25, 'Risky shadow app', 'Browse OK · no uploads');
      s += mark(596, 292, 'warn');
      s += pill(655, 378, 'Upload blocked', 'y');

      /* ---- engine to outcomes ---- */
      s += fl('M480 150C536 150 540 74 584 74', 'fl-flow', {arrow: true, dur: 1.3});
      s += fl('M480 199H536', 'fl-down', {dur: 1});
      s += xmark(548, 199);
      s += fl('M480 248C536 248 540 324 584 324', 'fl-ha', {arrow: 'arr-y', dur: 1.6, label: 'browse only', lx: 530, ly: 288, lcls: 'y'});

      /* ---- every decision to the dashboard ---- */
      s += fl('M362 334V394', 'fl-net', {arrow: 'arr-n', np: 0, label: 'classification · decisions', lx: 362, ly: 364});
      s += nd(232, 394, 260, 56, {t: 'Cloud Apps Dashboard', s: ['inventory · risk · users · events'], ic: 'chart', icls: 'g', cls: 'soft'});
      return s;
    },
    title: 'Classify the application, score it, control the activity',
    desc: 'The same single-pass engine identifies each cloud application inline, scores its risk and checks the tenant, then the activity decides the action: sanctioned tenant allowed, personal tenant blocked, risky application restricted, with every decision feeding the Cloud Apps Dashboard.',
    legend: [['tun', 'Site and Client traffic already through the PoP'], ['flow', 'Sanctioned tenant — allowed and monitored'], ['down', 'Personal tenant — blocked'], ['ha', 'Risky application — activity restricted'], ['net', 'Classification and decisions to the dashboard']],
  }],
});
