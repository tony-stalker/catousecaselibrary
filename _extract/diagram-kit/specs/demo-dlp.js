/* specs/demo-dlp.js — Demo Segment 4: DLP (content inspection as one more decision in the single pass) */
DG.page('demo-dlp', {
  spotlight: {
    anchors: {mgmt: [782, 132], saas: [302, 310]},   // markers 3 and 4 clear of the Internet & SaaS and CMA subtitles
    hl: ['users', 'branch', 'pop', 'saas', 'mgmt'],
    mods: ['sse'],
    flows: [{p: 'us1'}, {p: 'br1'}, {p: 'eg-saas'}, {p: 'm1'}],
    steps: [
      {t: 'Marcus uploads a spreadsheet through the Cato Client; the Bristol Office Socket sends the same kind of flow.', marks: ['users', 'branch']},
      {t: 'Decrypted once under TLS inspection, the single-pass engine asks one more question: does the content match?', marks: ['pop']},
      {t: 'The Data Control rule blocks the card-number upload to personal storage; SharePoint stays allowed.', marks: ['saas']},
      {t: 'The incident (user, file, matched data type, action, evidence) lands in Events and the dashboard.', marks: ['mgmt']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, TL, I, L, popBox, site, cloud, doc, pill, chipRow, tier, mark, xmark} = K;
      let s = '';

      /* ---- section labels ---- */
      s += tier(14, 52, 'USERS & SITES') + tier(240, 52, 'CATO SASE CLOUD') + tier(596, 52, 'DESTINATIONS');

      /* ---- left: the branch Socket and the remote user ---- */
      s += site(14, 92, 200, 112, 'Bristol Office');
      s += nd(28, 120, 172, 60, {t: 'Socket X1500', s: ['branch uploads'], ic: 'building', is: 22, icls: 'g'});
      s += nd(14, 270, 200, 60, {t: 'Marcus · Cato Client', s: ['Upload: client-list.xlsx'], ic: 'laptop', is: 22, icls: 'g'});
      s += fl(L(114, 330, 114, 352), 'fl-lan fl-dim', {np: 0});
      s += doc(64, 352, 100, 84, [[2, 8, 58, 'no']]);
      s += T(114, 454, 'client-list.xlsx', 'f-m', 'middle');
      s += T(114, 468, 'card numbers inside', 'f-s', 'middle');

      /* tunnels into the PoP */
      s += fl('M200 150 C222 150 220 202 240 202', 'fl-tun', {dur: 1.2});
      s += fl('M214 300 C230 300 226 262 240 262', 'fl-tun', {dur: 1.1});

      /* ---- centre: the PoP, one more decision in the same pass ---- */
      s += popBox(240, 76, 280, 344, 'Cato PoP', 'TLS inspection · single-pass engine');
      s += tier(258, 146, 'INLINE, AFTER DECRYPTION');
      s += chipRow(258, 156, ['Application', 'Activity', 'Content'], 76, 22, 8);
      s += fl(L(380, 180, 380, 202), 'fl-lan', {np: 0, arrow: 'arr-n'});
      s += nd(258, 206, 244, 64, {t: 'Data Control rule', s: ['Credit cards profile · Upload'], ic: 'shield', is: 22, icls: 'g'});
      s += pill(380, 292, 'Block · notify · event', 'r keep');
      s += chipRow(266, 332, ['SWG', 'IPS', 'CASB'], 54, 20, 8) + chipRow(266 + 3 * 62, 332, ['DLP'], 54, 20, 8, 'g');
      s += TL(380, 380, ['Same engine as SWG · IPS · CASB', '— one more decision'], 'f-s', 'middle', 14);

      /* ---- right: sanctioned allowed, personal blocked ---- */
      s += fl('M502 226 C552 226 552 166 596 166', 'fl-flow', {arrow: true, dur: 1.1});
      s += cloud(668, 170, 1.3, 'Sanctioned storage', 'SharePoint · allowed');
      s += mark(606, 132, 'ok', 9);
      s += fl('M502 252 C548 252 540 326 566 326', 'fl-down', {np: 0});
      s += xmark(572, 326);
      s += cloud(674, 330, 1.3, 'Personal storage', 'Blocked · user notified');

      /* ---- bottom: the incident comes out of the same pass ---- */
      s += fl('M380 420 L380 490 L548 490', 'fl-net', {np: 0, arrow: 'arr-n', label: 'who · file · data type · action', lx: 380, ly: 455, lcls: 'm'});
      s += nd(548, 460, 198, 60, {t: 'Monitor → Events', s: ['Data incident · evidence'], ic: 'file', is: 22, icls: 'g', cls: 'soft'});
      s += I('lock', 724, 466, 14, 'ic g');
      s += T(647, 536, 'evidence behind role-based access', 'f-s', 'middle');
      return s;
    },
    title: 'Content inspection as one more decision in the single pass',
    desc: 'An upload is decrypted once at the PoP and the Data Control rule reads its content against a profile; the sanctioned destination is allowed, the sensitive upload to personal storage is blocked with the user notified, and the incident with its evidence comes out of the same pass.',
    legend: [['tun', 'Cato Client and Socket tunnels to the PoP'], ['flow', 'Sanctioned destination — allowed'], ['down', 'Sensitive content to unsanctioned storage — blocked'], ['net', 'Incident telemetry — Events, dashboard, evidence']],
  }],
});
