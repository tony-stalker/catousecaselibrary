/* specs/migration-anyconnect.js — AnyConnect to Cato Client */
DG.page('migration-anyconnect', {
  spotlight: {
    hl: ['users', 'pop', 'backbone', 'dc', 'saas'],
    mods: ['uztna'],
    flows: [{p: 'us1'}, {p: 'r-CR'}, {p: 'dc1', rev: true}, {p: 'eg-saas'}],
    steps: [
      {t: 'The Cato Client connects to the nearest PoP with SSO and MFA at the IdP — no concentrator to find.', marks: ['users']},
      {t: 'Device posture is checked continuously at the PoP, and access is to named apps, not a subnet.', marks: ['pop']},
      {t: 'Private apps ride the backbone to the DC Socket; SaaS breaks out at the PoP — no hairpin.', marks: ['dc', 'saas']},
    ],
    anchors: {saas: [300, 300]},             // step-3 marker clear of the "Smart egress" subtitle
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, TL, pill, ring, fpin, pinTop, cloud, side, site, tier, xmark} = K;
      let s = '';

      /* ---- TOP lane: Priya on AnyConnect, across the internet to the DC concentrator ---- */
      s += tier(14, 40, 'REMOTE USERS');
      s += nd(14, 62, 190, 56, {t: 'Priya — AnyConnect', s: ['everything via the DC'], ic: 'laptop', is: 20, icls: 'g', cls: 'dash'});
      s += fl('M204 90L412 90', 'fl-ha', {dur: 1.8, arrow: 'arr-y'});
      s += cloud(306, 90, .7, 'Internet');

      /* datacentre: the headend (retiring) above the apps that sit behind a Socket */
      s += site(400, 40, 200, 190, 'DATACENTRE');
      s += nd(412, 62, 176, 56, {t: 'VPN concentrator', s: ['ASA/FTD headend'], ic: 'firewall', is: 20, icls: 'g', cls: 'dash'});
      s += xmark(588, 62);
      s += pill(486, 139, 'Marked for retirement', 'r keep');
      s += fl('M572 118V160', 'fl-ha', {np: 0, arrow: 'arr-y'});
      s += nd(412, 160, 176, 56, {t: 'Datacentre apps', s: ['behind a Cato Socket'], ic: 'server', is: 20, icls: 'g'});

      /* hairpin: cloud-bound traffic leaves the concentrator again for SaaS */
      s += fl('M588 90C700 90 742 130 742 210L742 400C742 420 736 432 726 442', 'fl-ha', {dur: 2.4, arrow: 'arr-y'});
      s += TL(672, 300, ['hairpin — cloud traffic', 'backhauled via the DC'], 'f-s', 'middle', 14);

      /* ---- BOTTOM lane: Marcus on the Cato Client, to the nearest PoP on the backbone ---- */
      s += nd(14, 382, 190, 56, {t: 'Marcus — Cato Client', s: ['SDP · always-on ZTNA'], ic: 'laptop', is: 20, icls: 'g'});
      s += side(14, 456, 204, 46, 'SAML SSO + MFA at IdP', 'Entra ID · Okta · OneLogin', 'key');
      s += fl('M204 410L320 410', 'fl-tun', {dur: 1.3});
      /* the IdP step joins Marcus's lane: sign-in happens on the way to the PoP */
      s += fl('M218 479C252 479 262 460 262 414', 'fl-tun', {np: 0});

      const RG = {cx: 460, cy: 410, rx: 140, ry: 32};
      s += ring(RG);
      s += T(460, 415, 'Global Private Backbone', 'f-h', 'middle');

      /* PoP → datacentre apps along the backbone, then up to the Socket */
      s += fl('M320 410A140 32 0 0 0 600 410C600 330 540 290 540 220', 'fl-flow', {dur: 2.2, arrow: 'arr-m'});
      s += pill(549, 268, 'over the backbone', 'g keep');   // on the backbone → datacentre-apps leg
      /* PoP → SaaS: local breakout, no hairpin */
      s += fl('M320 410C334 500 520 506 614 486', 'fl-flow', {dur: 1.6, arrow: 'arr-m'});

      /* the PoP pin, drawn after the flows so they meet beneath its head */
      s += fpin(320, 410, 22, 'PoP', {halo: true});
      const pt = pinTop(410, 22);
      s += T(320, pt - 26, 'Nearest Cato PoP', 'nd-t g', 'middle') + T(320, pt - 11, 'ZTNA · posture · inspection', 'f-s', 'middle');

      /* far right: SaaS & internet */
      s += cloud(686, 482, 1.2, 'SaaS & internet', 'M365 · Salesforce · WWW');

      s += T(380, 540, 'No headend to size, patch or expose — the PoP is the point of entry', 'f-s', 'middle');
      return s;
    },
    title: 'AnyConnect concentrator hairpin versus Cato Client via the nearest PoP',
    desc: 'AnyConnect backhauls every flow through an internet-exposed ASA/FTD headend; the Cato Client terminates at the nearest PoP with SAML SSO, MFA and continuous posture, and reaches datacentre and cloud applications directly over the backbone.',
    legend: [['ha', 'AnyConnect — hairpin via the DC concentrator'], ['tun', 'Cato Client — tunnel to the nearest PoP'], ['flow', 'From the PoP to datacentre apps and SaaS'], 'live'],
  }],
});
