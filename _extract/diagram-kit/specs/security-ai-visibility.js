/* specs/security-ai-visibility.js — GenAI Visibility Assessment (AI Security, monitor mode) */
DG.page('security-ai-visibility', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'mgmt'],
    mods: ['ai'],
    anchors: {mgmt: [782, 132]},   // step-4 marker on the CMA box's top edge, clear of its subtitle
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'us2'}, {p: 'eg-genai'}, {p: 'm2'}],
    steps: [
      {t: "Office and remote users' GenAI traffic already crosses the PoP; an optional browser extension adds coverage.", marks: ['branch', 'users']},
      {t: 'TLS inspection, CASB/DLP and the AI Interaction Policy run in monitor mode: nothing is blocked.', marks: ['pop']},
      {t: 'Every sanctioned and shadow GenAI interaction is classified and logged across the four weeks.', marks: ['genai']},
      {t: 'The AI Security dashboards and GenAI Report become the board-ready AI risk report.', marks: ['mgmt']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, L, tier, pill, popBox, chipRow, badge} = K;
      let s = '';
      /* ---- tiers ---- */
      s += tier(14, 34, 'WHERE PEOPLE USE AI') + tier(250, 34, 'INSPECTED AT THE PoP · MONITOR MODE') + tier(574, 34, 'GENAI DESTINATIONS');

      /* ---- left: the three ways GenAI traffic reaches the PoP ---- */
      s += nd(14, 70, 200, 56, {t: 'Office users', s: ['Behind Cato Sockets'], ic: 'building', is: 20, icls: 'g'});
      s += nd(14, 160, 200, 56, {t: 'Remote users', s: ['Cato Client'], ic: 'laptop', is: 20, icls: 'g'});
      s += nd(14, 250, 200, 56, {t: 'AI Browser Extension', s: ['Optional · Intune/MDM'], ic: 'browser', is: 20, icls: 'g', cls: 'dash'});

      /* ---- centre: the PoP, inspecting but never blocking ---- */
      const PX = 250, PY = 60, PW = 260, PH = 270;
      s += popBox(PX, PY, PW, PH, 'Cato PoP', 'GenAI traffic already crosses it');
      s += chipRow(PX + 6, 116, ['TLS inspection', 'CASB / DLP', 'AI policy'], 80, 20, 4, 'g');
      s += pill(PX + PW / 2, 160, 'MONITOR MODE · nothing blocked', 'm keep');
      s += nd(PX + 25, 192, 210, 56, {t: 'Prompt-level telemetry', s: ['every interaction classified'], ic: 'eye', is: 20, icls: 'g', cls: 'soft'});
      s += T(PX + PW / 2, 276, 'traffic flows exactly as before', 'f-s', 'middle');
      s += T(PX + PW / 2, 292, 'sanctioned or shadow, nothing is touched', 'f-s', 'middle');

      /* flows onto the PoP */
      s += fl(`M214 98C232 98 236 130 ${PX} 130`, 'fl-tun', {dur: 1.3});
      s += fl(`M214 188C232 188 236 185 ${PX} 185`, 'fl-tun', {dur: 1.3});
      s += fl(`M214 278C232 278 236 250 ${PX} 250`, 'fl-https', {dur: 1.3});

      /* ---- right: where the prompts go, both lanes monitored ---- */
      s += nd(574, 90, 172, 56, {t: 'Sanctioned GenAI', s: ['ChatGPT · M365 Copilot'], ic: 'ai', is: 20, icls: 'g'});
      s += pill(660, 164, 'allowed · logged', 'g');
      s += nd(574, 230, 172, 56, {t: 'Shadow AI apps', s: ['Unsanctioned tools'], ic: 'ai', is: 20, icls: 'g', cls: 'soft'});
      s += pill(660, 304, 'visible · monitored', 'y');
      s += fl(`M${PX + PW} 150C540 150 548 118 574 118`, 'fl-flow', {dur: 1.1});
      s += fl(`M${PX + PW} 230C540 230 548 258 574 258`, 'fl-flow', {dur: 1.1});

      /* ---- evidence: telemetry into the dashboards ---- */
      s += fl(`M420 ${PY + PH}C420 372 470 388 546 388`, 'fl-net', {np: 0, arrow: true});
      s += nd(546, 360, 200, 56, {t: 'AI Security Dashboard', s: ['GenAI Report · AI events'], ic: 'chart', is: 20, icls: 'g'});

      /* ---- bottom: the four-week clock ---- */
      s += tier(14, 452, 'FOUR WEEKS · 30-MIN KICKOFF · WEEKLY SYNCS · 30-DAY TRIAL LICENCE');
      const WK = [
        ['W1 · Deploy', 'kickoff · IdP · extension'],
        ['W2 · Discover', 'Discovery · AI Users'],
        ['W3 · Protect', 'test group · monitor'],
        ['W4 · Report', 'AI risk report'],
      ];
      const BW = 168, BG = 20, BY = 466, BH = 56;
      WK.forEach(([t, sub], i) => {
        const x = 14 + i * (BW + BG);
        s += nd(x, BY, BW, BH, {t, s: [sub]});
        s += badge(x + 16, BY + 16, String(i + 1));
        /* week-to-week sequence: neutral stroke, deliberately not a legend kind */
        if (i < 3) s += `<path d="${L(x + BW, BY + BH / 2, x + BW + BG, BY + BH / 2)}" class="fl" style="stroke:var(--ink-3);stroke-width:1.4" marker-end="url(#arr-n)"/>`;
      });
      return s;
    },
    title: 'GenAI Visibility Assessment in monitor mode',
    desc: 'Office, remote and browser-plugin GenAI traffic crosses the Cato PoP where TLS inspection, CASB/DLP and the AI Interaction Policy run in monitor mode for four weeks, so sanctioned and shadow AI use is classified and reported without anything being blocked.',
    legend: [['tun', 'Socket / Client tunnel'], ['https', 'Browser extension (optional)'], ['flow', 'GenAI interaction, monitored'], ['net', 'Telemetry to dashboards'], 'live'],
  }],
});
