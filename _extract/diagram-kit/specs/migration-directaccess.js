/* specs/migration-directaccess.js — Microsoft DirectAccess to Cato */
DG.page('migration-directaccess', {
  spotlight: {
    hl: ['users', 'pop', 'backbone', 'dc', 'saas'],
    mods: ['uztna'],
    anchors: {saas: [302, 310]},   // step-3 marker right of the SaaS cloud, clear of its subtitle
    flows: [{p: 'us1'}, {p: 'r-LC'}, {p: 'dc1', rev: true}, {p: 'eg-saas'}],
    steps: [
      {t: 'The Cato Client is always-on like DirectAccess, but runs on Windows, macOS and mobile with no domain join.', marks: ['users']},
      {t: 'IdP SSO with MFA and continuous device posture gate the session at the nearest PoP — no NLS, PKI or IP-HTTPS.', marks: ['pop']},
      {t: 'Named datacentre apps are reached over the backbone; SaaS breaks out at the PoP — no DA gateway hairpin.', marks: ['dc', 'saas']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, TL, R, I, pill, ring, fpin, fy, cloud, popBox, side, site, tier, xmark} = K;
      let s = '';

      /* ---- left: two remote users ---- */
      s += tier(14, 50, 'REMOTE USERS');
      s += nd(14, 78, 200, 56, {t: 'Priya — DirectAccess', s: ['domain-joined Windows'], ic: 'laptop', is: 20, icls: 'g', cls: 'dash'});
      /* Marcus: laptop + phone on one client */
      s += R(14, 266, 200, 68, 'nd', 10);
      s += I('laptop', 22, 278, 19, 'ic g') + I('phone', 22, 302, 19, 'ic g');
      s += T(52, 292, 'Marcus — Cato Client', 'nd-t', 'start');
      s += T(52, 306, 'laptop + phone', 'nd-s', 'start');
      s += T(52, 319, 'Windows · macOS · mobile', 'nd-s', 'start');

      /* ---- amber lane: Priya over IP-HTTPS across the internet to the DA gateway ---- */
      s += fl('M214 106L452 106', 'fl-ha', {dur: 1.8, arrow: 'arr-y', label: 'IP-HTTPS tunnel', lx: 266, ly: 92});
      s += cloud(372, 112, .62, 'Internet');

      /* ---- top right: the datacentre — DA gateway (deprecated) and the apps behind a Socket ---- */
      s += site(440, 52, 222, 176, 'DATACENTRE');
      s += nd(452, 68, 198, 56, {t: 'DirectAccess gateway', s: ['NLS · PKI · IP-HTTPS'], ic: 'server', is: 20, icls: 'g', cls: 'dash'});
      s += xmark(650, 68);
      s += pill(540, 141, 'Deprecated — being removed', 'r keep');
      s += nd(452, 158, 198, 56, {t: 'Datacentre apps', s: ['behind a Cato Socket'], ic: 'server', is: 20, icls: 'g'});
      s += fl('M636 124V158', 'fl-ha', {np: 0, arrow: 'arr-y'});

      /* hairpin: all traffic, cloud-bound included, goes via the datacentre */
      s += fl('M650 90C730 90 752 130 752 210C752 262 736 282 720 298', 'fl-ha dashed', {dur: 2.2, arrow: 'arr-y'});
      s += TL(684, 248, ['hairpin — all traffic', 'via the datacentre'], 'f-s', 'middle', 13);

      /* ---- far right: cloud & SaaS ---- */
      s += cloud(674, 334, 1.2, 'Cloud & SaaS apps', 'M365 · Salesforce · WWW');

      /* ---- green lane: Marcus to the nearest PoP; IdP SSO + MFA and posture on the way ---- */
      s += fl('M214 300L330 300', 'fl-tun', {dur: 1.3});
      s += side(226, 340, 200, 46, 'IdP SSO + MFA · posture', 'checked for the whole session', 'key');
      s += popBox(330, 270, 180, 60, 'Nearest Cato PoP', 'ZTNA · posture · inspection');

      /* from the PoP: named datacentre apps over the backbone, cloud & SaaS straight out */
      s += fl('M470 270C470 240 510 236 528 214', 'fl-flow', {dur: 1.4, arrow: 'arr-m', label: 'named apps · backbone', lx: 392, ly: 242, lcls: 'g keep'});
      s += fl('M510 300C566 300 584 334 604 334', 'fl-flow', {dur: 1.4, arrow: 'arr-m'});

      /* ---- bottom centre: the global private backbone with the PoP pin ---- */
      /* the PoP sits on the backbone: tie the box down to the ring's PoP pin */
      s += fl('M440 330V418', 'fl-tun', {np: 0});
      const RG = {cx: 440, cy: 440, rx: 150, ry: 36};
      s += ring(RG);
      s += fpin(440, Math.round(fy(RG, 440)) + 2, 20, 'PoP', {halo: true});
      s += T(440, 506, 'Global Private Backbone', 'f-h', 'middle');
      return s;
    },
    title: 'DirectAccess gateway hairpin versus Cato Client via the nearest PoP',
    desc: 'DirectAccess hairpins a domain-joined Windows laptop over IP-HTTPS through a deprecated gateway backed by NLS and PKI; the Cato Client connects a laptop and a phone to the nearest PoP with IdP SSO, MFA and continuous posture, reaching datacentre and cloud applications directly.',
    legend: [['ha', 'DirectAccess — IP-HTTPS to the DC gateway, network-level'], ['tun', 'Cato Client — nearest PoP, app-level, cross-platform'], ['flow', 'From the PoP to named apps and SaaS'], 'live'],
  }],
});
