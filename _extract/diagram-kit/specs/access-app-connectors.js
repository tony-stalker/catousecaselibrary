/* specs/access-app-connectors.js — Private Access with App Connectors */
DG.page('access-app-connectors', {
  spotlight: {
    hl: ['users', 'pop', 'backbone', 'cloud', 'dc'],
    mods: ['uztna'],
    flows: [{p: 'us1'}, {p: 'us2'}, {p: 'r-CR'}, {p: 'cl-aws'}, {p: 'dc1', rev: true}],
    steps: [
      {t: 'Users connect with the Cato Client or a browser; they never receive network access.', marks: ['users']},
      {t: 'The nearest PoP checks identity and device posture against the Private Access Policy.', marks: ['pop']},
      {t: 'Authorised sessions are brokered to the app through an outbound-only App Connector.', marks: ['cloud', 'dc']},
    ],
    anchors: {cloud: [1257, 394]},   // cloud marker on the lit AWS leg, clear of the heading index
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    /* the overview's cloudAppc figure, redrawn so its labels match the page: the policy is the Private Access Policy,
       browser access is HTTP(S)/RDP/SSH only, and the private-cloud host named in the prose is ESXi */
    draw: K => {
      const {T, R, I, fl, fpin, site} = K;
      let s = '';
      /* users and the PoP on the left */
      s += T(62, 30, 'Users', 'f-h', 'middle');
      [['Cato Client'], ['Browser']].forEach(([c], i) => { const y = 44 + i * 30; s += R(16, y, 92, 24, 'chip-r', 12) + T(62, y + 15.5, c, 'chip-t', 'middle'); });
      s += T(62, 112, 'HTTP(S) · RDP · SSH', 'f-s', 'middle');
      s += fl('M62 120V164', 'fl-https', {dur: 1});
      s += fpin(62, 236, 26, 'PoP', {halo: true}) + T(62, 256, 'Nearest Cato PoP', 'f-s', 'middle');
      s += T(62, 272, 'Private Access', 'nd-t g', 'middle') + T(62, 286, 'Policy', 'nd-t g', 'middle') + T(62, 300, 'identity · device · risk', 'f-s', 'middle');
      /* one environment: a connector pair on the left, the applications it publishes on the right */
      const env = (y, h, label, sub, note, apps) => {
        s += site(150, y, 590, h, label);
        s += R(176, y + 40, 170, 50, 'nd hot', 10) + I('appc', 188, y + 53, 24, 'ic g') + T(222, y + 60, 'App Connector', 'nd-t') + T(222, y + 75, 'outbound only · DTLS', 'nd-s');
        s += `<g opacity=".55">${R(176, y + 100, 170, 44, 'nd', 10)}${I('appc', 188, y + 110, 24, 'ic g')}${T(222, y + 118, 'App Connector 2', 'nd-t')}${T(222, y + 133, 'high availability', 'nd-s')}</g>`;
        s += R(430, y + 30, 290, h - 56, 'nd soft', 12) + T(444, y + 50, 'Private applications', 'f-t') + T(444, y + 64, sub, 'nd-s');
        apps.forEach(([t, ic], i) => { const x = 444 + i * 92; s += R(x, y + 76, 84, 60, 'nd', 10) + I(ic, x + 30, y + 84, 24, 'ic g') + T(x + 42, y + 126, t, 'nd-s', 'middle'); });
        s += fl(`M176 ${y + 65}C130 ${y + 65} 120 192 88 192`, 'fl-tun', {dur: 1.4});
        s += fl(`M346 ${y + 65}C390 ${y + 65} 396 ${y + 106} 430 ${y + 106}`, 'fl-flow', {dur: 1, arrow: 'arr-m'});
        s += T(176, y + h - 14, note, 'f-m');
      };
      env(36, 212, 'CLOUD · AWS · AZURE · GCP', 'VPC or VNet subnets', 'marketplace image · internal addresses only · no inbound rules',
        [['HR portal', 'browser'], ['Finance app', 'chart'], ['Database', 'db']]);
      env(304, 232, 'PRIVATE CLOUD · DATA CENTRE', 'VMware ESXi', 'same connector, same policy · no VPN concentrator',
        [['ERP', 'console'], ['File server', 'file'], ['Database', 'db']]);
      return s;
    },
    title: 'Private Access through App Connectors',
    desc: 'Users reach private applications in cloud and in the data centre through outbound-only App Connectors; the PoP enforces the Private Access Policy before any session is brokered.',
    legend: [['tun', 'DTLS tunnel, held open outbound by the connector'], ['flow', 'Connector to app on the LAN'], ['https', 'Client or browser to the PoP'], 'live'],
  }],
});
