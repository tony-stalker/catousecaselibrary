/* specs/ai-genai-security.js — GenAI Security for End Users */
DG.page('ai-genai-security', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'mgmt'],
    mods: ['ai', 'sse'],
    anchors: {mgmt: [720, 134]},   // step-4 marker clear of the CMA subtitle
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'us2'}, {p: 'eg-genai'}, {p: 'm2'}],
    steps: [
      {t: 'AI Usage Discovery builds the inventory from Internet Firewall events the Cato Cloud already processes.', marks: ['pop']},
      {t: 'The User Interaction Policy inspects each prompt at the PoP: monitor, anonymise or block, per interaction.', marks: ['popL']},
      {t: 'The browser plugin enforces the same outcomes on managed devices Cato traffic never crosses.', marks: ['users']},
      {t: 'Every decision is attributed and lands in the Overview dashboard and AI Users page as evidence.', marks: ['mgmt']},
    ],
  },
  diagrams: [{
    slot: 'main',
    draw: K => {
      const {nd, fl, T, TL, tier, popBox, chips, xmark} = K;
      let s = '';
      /* ---- section labels ---- */
      s += tier(14, 40, 'USERS') + tier(220, 40, 'CATO PoP · INLINE') + tier(574, 40, 'GENAI DESTINATIONS');
      /* ---- left: three personas; the first two onramp to the PoP ---- */
      s += nd(14, 80, 172, 56, {t: 'Priya — office', s: ['Site behind a Socket'], ic: 'building', is: 20, icls: 'g'});
      s += nd(14, 190, 172, 56, {t: 'Marcus — remote', s: ['Cato Client · pastes PII'], ic: 'laptop', is: 20, icls: 'g'});
      s += fl('M186 108L220 108', 'fl-tun', {dur: .8});
      s += fl('M186 218L220 218', 'fl-tun', {dur: .8});
      /* ---- centre: the PoP running the User Interaction Policy ---- */
      s += popBox(220, 60, 220, 210, 'Cato PoP', 'AI Security · User Interaction Policy');
      s += tier(232, 124, 'EACH RULE COMBINES');
      s += chips(232, 132, ['Source', 'AI applications', 'Engine profile', 'Action'], 96, 20, 8, 2, 'g');
      s += tier(232, 206, 'FOUR ACTIONS');
      s += TL(232, 220, ['Monitor · Anonymize and Monitor', 'Anonymize and Block · Block'], 'f-s', 'start', 13);
      s += T(330, 256, '+ optional notification template', 'nd-s', 'middle');
      /* ---- right: three destinations, one verdict each ---- */
      s += fl('M440 110C500 110 510 98 574 98', 'fl-flow', {dur: 1.1, arrow: 'arr-m', label: 'allowed · logged', lx: 507, ly: 104, lcls: 'g keep'});
      s += fl('M440 190C500 190 510 208 574 208', 'fl-flow', {dur: 1.1, arrow: 'arr-m', label: 'anonymised', lx: 507, ly: 199, lcls: 'y keep'});
      s += T(507, 228, 'PII masked in-flight', 'f-m', 'middle');
      s += fl('M440 240C500 240 536 318 548 318', 'fl-flow fl-down', {np: 0, label: 'blocked', lx: 498, ly: 262, lcls: 'r keep'});
      s += nd(574, 70, 172, 56, {t: 'Sanctioned GenAI', s: ['Approved AI assistant'], ic: 'ai', is: 20, icls: 'g'});
      s += nd(574, 180, 172, 56, {t: 'Embedded SaaS AI', s: ['Copilots inside SaaS'], ic: 'chat', is: 20, icls: 'g'});
      s += nd(574, 290, 172, 56, {t: 'Shadow AI apps', s: ['Unsanctioned tools'], ic: 'ai', is: 20, icls: 'g', cls: 'soft'});
      /* ---- evidence: every decision lands in the dashboards ---- */
      s += tier(220, 318, 'EVIDENCE');
      s += fl('M330 270L330 330', 'fl-net', {np: 0, arrow: true});
      s += nd(220, 330, 220, 56, {t: 'Dashboards & evidence', s: ['Overview · AI Users · Events'], ic: 'chart', is: 20, icls: 'g'});
      /* ---- bottom: the off-net contractor, covered by the browser plugin, never crosses the PoP ---- */
      s += tier(14, 424, 'OFF-NET MANAGED DEVICE');
      s += nd(14, 437, 172, 56, {t: 'Omar — contractor', s: ['Browser plugin, off-net'], ic: 'browser', is: 20, icls: 'g', cls: 'dash'});
      s += fl('M186 465L220 465', 'fl-https', {dur: .8});
      s += nd(220, 440, 186, 50, {t: 'Browser plugin', s: ['same outcomes, in the browser']});
      s += fl('M330 440L330 386', 'fl-net', {np: 0, arrow: true});
      s += fl('M406 465C520 465 540 330 574 330', 'fl-https', {arrow: 'arr-m', label: 'block · anonymise · engage', lx: 512, ly: 488, lcls: 'm keep'});
      s += xmark(548, 318);
      return s;
    },
    vb: '0 0 760 520',
    title: 'GenAI Security for End Users: one policy, three verdicts',
    desc: 'Office, remote and off-net users reach sanctioned, embedded and shadow GenAI through the Cato PoP or the browser plugin, where the User Interaction Policy decides per prompt — allow and log, anonymise sensitive values, or block — and every decision lands in the dashboards as evidence.',
    legend: [['tun', 'Socket / Client to the PoP'], ['https', 'Browser plugin, off-net'], ['flow', 'Allowed or anonymised prompt'], ['down', 'Blocked — nothing reaches the AI vendor'], ['net', 'Decision events to the dashboards'], 'live'],
  }],
});
