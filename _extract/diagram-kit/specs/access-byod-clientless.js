/* specs/access-byod-clientless.js — BYOD & Unmanaged Device Access (clientless ZTNA) */
DG.page('access-byod-clientless', {
  spotlight: {
    hl: ['users', 'pop', 'dc', 'saas', 'mgmt'],
    mods: ['uztna', 'sse'],
    flows: [{p: 'us2'}, {p: 'us3'}, {p: 'dc1', rev: true}, {p: 'eg-saas'}, {p: 'eg-www'}],
    anchors: {mgmt: [782, 132], saas: [302, 310]},   // step markers clear of the CMA and SaaS egress subtitles
    steps: [
      {t: 'Unmanaged devices use a browser on-ramp: the access portal, the Browser Extension or the Enterprise Browser.', marks: ['users']},
      {t: 'Every session terminates at the Cato PoP; the device never receives an address, a route or a network path.', marks: ['pop']},
      {t: 'Users reach published private apps and inspected SaaS; DLP blocks downloads and RBI isolates risky web.', marks: ['dc', 'saas']},
      {t: 'Every sign-in, app launch and block is an event attributed to a named user in the CMA.', marks: ['mgmt']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 500',
    draw: K => {
      const {nd, fl, T, TL, I, L, popBox, side, chipRow, chips, tier, xmark} = K;
      let s = '';
      /* ---- top band: column labels (no backbone ring: no path on this figure uses it) ---- */
      s += tier(250, 12, 'CATO SASE CLOUD') + tier(556, 12, 'DESTINATIONS');

      /* ---- left: unmanaged devices and the three browser on-ramps ---- */
      s += I('laptop', 14, 28, 22, 'ic g') + T(44, 40, 'Unmanaged devices', 'nd-t') + T(44, 55, 'contractor · BYOD · partner', 'nd-s');
      const ramps = [
        ['browser', 'Access portal', 'any browser · no install'],
        ['ext', 'Browser Extension', 'Chrome · SaaS access'],
        ['sbrowser', 'Enterprise Browser', 'SaaS + private apps'],
      ];
      ramps.forEach(([ic, t, sub], i) => {
        const y = 96 + i * 74;
        s += nd(14, y, 180, 50, {t, s: [sub], ic, is: 18, icls: 'g'});
        s += fl(L(194, y + 25, 250, y + 25), 'fl-https', {arrow: 'arr-m', dur: 1.1 + i * .1});
      });
      s += side(14, 366, 180, 52, 'Identity provider', 'Entra ID · SSO + MFA', 'key');
      s += fl('M194 392C222 392 222 420 250 420', 'fl-https fl-dim', {np: 0, arrow: true});
      s += T(104, 440, 'sign-in redirect · MFA', 'f-s', 'middle');

      /* ---- centre: the Cato PoP, one enforcement point ---- */
      s += popBox(250, 84, 200, 376, 'Cato PoP', '');
      s += T(350, 124, 'Portal · Extension', 'f-s', 'middle') + T(350, 138, 'Enterprise Browser', 'f-s', 'middle');
      s += chipRow(256, 152, ['ZTNA', 'CASB', 'DLP', 'RBI'], 44, 20, 4, 'g');
      s += T(350, 204, 'APPLICATION-LEVEL ACCESS', 'tier', 'middle');
      s += chips(260, 214, ['no address', 'no route'], 87, 20, 6, 2);
      s += chips(260, 240, ['no scanning', 'no lateral move'], 87, 20, 6, 2);
      s += nd(260, 306, 180, 48, {t: 'RBI', s: ['isolated session'], ic: 'sbrowser', is: 18, icls: 'g'});
      s += T(350, 372, 'pixels only to the device', 'f-s', 'middle');
      s += T(350, 392, 'every session ends here', 'f-s', 'middle');
      s += T(350, 410, 'the device never joins', 'f-s', 'middle') + T(350, 424, 'the network', 'f-s', 'middle');
      s += T(350, 484, 'no client · no enrolment · HTTPS · TLS-inspected', 'f-m', 'middle');

      /* ---- right: four destinations ---- */
      s += nd(556, 96, 190, 48, {t: 'Published app', s: ['Internal HR portal'], ic: 'server', is: 18, icls: 'g'});
      s += fl(L(450, 112, 556, 112), 'fl-https', {arrow: 'arr-m', dur: 1.2, label: 'browser stream', lx: 503, ly: 98, lcls: 'g'});
      s += fl(L(556, 134, 450, 134), 'fl-down', {np: 0}) + xmark(503, 134);
      s += TL(503, 156, ['file download', 'DLP block'], 'nd-s', 'middle', 12);

      s += nd(556, 190, 190, 48, {t: 'SaaS apps', s: ['M365 · GenAI tools'], ic: 'globe', is: 18, icls: 'g'});
      s += fl(L(450, 214, 556, 214), 'fl-https', {arrow: 'arr-m', dur: 1.3, label: 'CASB · DLP', lx: 503, ly: 200, lcls: 'g'});

      s += nd(556, 306, 190, 48, {t: 'Risky website', s: ['newly registered domain'], ic: 'globe', is: 18, icls: 'g'});
      s += fl(L(556, 330, 440, 330), 'fl-flow', {arrow: 'arr-n', dur: 1.4, label: 'page code', lx: 503, ly: 316, lcls: 'p'});
      s += T(503, 350, 'runs in the PoP', 'f-s', 'middle');

      s += `<g style="opacity:.55">` + nd(556, 410, 190, 48, {t: 'Rest of the WAN', s: ['unpublished · invisible'], ic: 'route', is: 18, icls: ''}) + `</g>`;
      s += fl(L(450, 434, 556, 434), 'fl-down', {np: 0}) + xmark(503, 434);
      s += T(503, 462, 'no network path', 'nd-s', 'middle');
      return s;
    },
    title: 'Clientless ZTNA for unmanaged devices',
    desc: 'Portal, Browser Extension and Enterprise Browser all terminate at the Cato PoP, so an unmanaged device reaches only published apps and inspected SaaS while RBI renders risky pages as pixels and DLP keeps files off the endpoint.',
    legend: [['https', 'Allowed — published apps & inspected SaaS sessions'], ['flow', 'RBI — risky web rendered as pixels only'], ['down', 'Blocked — unpublished resources · downloads']],
  }],
});
