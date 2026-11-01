/* specs/access-identity-design.js — Identity Integration Design */
DG.page('access-identity-design', {
  spotlight: {
    hl: ['users', 'branch', 'pop', 'mgmt'],
    anchors: {mgmt: [782, 132]},   // step-1 marker clear of the CMA subtitle
    mods: ['uztna'],
    flows: [{p: 'us1'}, {p: 'br1'}, {p: 'm1'}],
    steps: [
      {t: 'SCIM provisions users and groups from Entra ID or Okta into the CMA; synced groups become the policy contract.', marks: ['mgmt']},
      {t: 'Remote users sign in to the Cato Client by SSO with the IdP\'s MFA; the PoP validates the IdP token.', marks: ['users']},
      {t: 'Behind the Bristol Office Socket the Identity Agent or AD Query names the user behind each IP.', marks: ['branch']},
      {t: 'The PoP enforces one identity-scoped policy; unidentified traffic matches only All Unidentified Users.', marks: ['pop']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 520',
    draw: K => {
      const {nd, fl, T, pill, mark, tier, site, popBox, ring, fpin, by} = K;
      let s = '';
      /* ---- control plane: IdP → CMA over SCIM; CMA policy references the synced groups; SSO + MFA to the remote Client ---- */
      s += tier(14, 14, 'CONTROL PLANE');
      s += nd(30, 30, 210, 54, {t: 'Identity Provider', s: ['Entra ID · Okta'], ic: 'key', icls: 'g'});
      s += nd(520, 30, 220, 54, {t: 'Cato Management App', s: ['users & groups via SCIM'], ic: 'console', icls: 'g'});
      s += fl('M240 57H520', 'fl-net', {np: 0, arrow: 'arr-n', label: 'SCIM provisioning · users & groups', lx: 380, ly: 57});
      s += fl('M630 84V196', 'fl-net', {np: 0, arrow: 'arr-n', label: 'policy references IdP groups', lx: 630, ly: 140});
      s += fl('M200 84V150', 'fl-net', {np: 0, arrow: 'arr-n', label: 'SSO + MFA (OIDC)', lx: 200, ly: 117});

      /* ---- data plane: three lanes on the left ---- */
      s += tier(14, 112, 'DATA PLANE');
      s += nd(30, 150, 210, 54, {t: 'Marcus — remote', s: ['Cato Client · SSO + MFA'], ic: 'laptop', icls: 'g'});
      s += site(30, 232, 210, 112, 'Bristol Office');
      s += nd(44, 250, 182, 50, {t: 'Priya · Socket X1500', s: ['office user · managed laptop'], ic: 'building', is: 20, icls: 'g'});
      s += pill(135, 322, 'Identity Agent', 'g');
      /* .nd.dash is not in the ported CSS: dash the coverage-gap box inline, keep the laptop icon solid */
      s += `<g style="stroke-dasharray:5 4">${nd(30, 380, 210, 54, {t: 'Warehouse shared PC', s: ['no Client · no AD Query'], ic: 'laptop'})
        .replace('<use ', '<use style="stroke-dasharray:none" ')}</g>`;

      /* ---- the PoP on the backbone ---- */
      const RG = {cx: 595, cy: 460, rx: 140, ry: 38};
      s += ring(RG);
      s += T(595, 464, 'Global Private Backbone', 't-ring', 'middle');
      s += fpin(595, by(RG, 595), 18, 'PoP', {halo: true});
      s += popBox(450, 196, 290, 166, 'Cato PoP', 'Identity-scoped policy');
      s += mark(466, 262, 'ok') + mark(466, 300, 'ok') + mark(466, 335, 'warn');
      s += pill(600, 281, 'group-scoped rule matches', 'g');
      s += pill(600, 335, 'fallback rules only', 'y');

      /* ---- lanes into the PoP ---- */
      s += fl('M240 177C340 177 350 262 450 262', 'fl-tun', {dur: 1.4, label: 'Cato Client identity', lx: 345, ly: 220});
      s += fl('M226 275C330 275 350 300 450 300', 'fl-tun', {dur: 1.4, label: 'reports identity · ~30 s', lx: 345, ly: 288});
      s += fl('M240 407C340 407 350 335 450 335', 'fl-ha', {dur: 1.8, label: 'All Unidentified Users', lx: 345, ly: 371, lcls: 'y'});
      return s;
    },
    title: 'One identity plane, every enforcement point',
    desc: 'SCIM builds users and groups in the CMA, SSO with MFA authenticates the remote Client, the Identity Agent or AD Query names office users behind the Socket, and the PoP enforces the same group-scoped policy on all of them; the amber lane is the coverage gap the design closes.',
    legend: [['tun', 'Identified & provisioned — group-scoped policy matches'], ['ha', 'Unidentified — only fallback rules apply'], ['net', 'Control plane — SCIM, SSO + MFA, policy references']],
  }],
});
