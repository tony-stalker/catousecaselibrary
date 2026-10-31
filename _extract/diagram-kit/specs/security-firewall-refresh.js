/* specs/security-firewall-refresh.js — Firewall Refresh to FWaaS */
DG.page('security-firewall-refresh', {
  spotlight: {
    hl: ['branch', 'dc', 'pop', 'backbone', 'saas', 'mgmt'],
    mods: ['sse'],
    anchors: {mgmt: [782, 132]},   // step-3 marker on the CMA box's top edge, clear of its subtitle
    flows: [{p: 'br1'}, {p: 'br2'}, {p: 'dc1', rev: true}, {p: 'eg-saas'}, {p: 'eg-www'}],
    steps: [
      {t: 'Sockets at every site terminate the last mile; the EOL firewall estate is retired, not refreshed.', marks: ['branch']},
      {t: 'All enforcement runs in the PoP single-pass engine: FWaaS, IPS, anti-malware and TLS inspection.', marks: ['pop']},
      {t: 'One global rule base replaces per-box configs; a change in CMA reaches every PoP in seconds.', marks: ['mgmt']},
      {t: 'IPS virtual patching shields the unpatched app server in the DC while ops patch on their own timetable.', marks: ['dc']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, site, ring, fpin, fy, cloud, tier, xmark} = K;
      let s = '';

      /* ---- centre: the Cato PoP on the global private backbone ---- */
      const RG = {cx: 400, cy: 240, rx: 160, ry: 44};
      s += T(400, 150, 'Cato PoP', 'f-h', 'middle');
      s += pill(400, 172, 'Single-pass: FWaaS · IPS · TLS', 'g keep');
      s += ring(RG);

      /* ---- left: two sites, Sockets only ---- */
      s += tier(14, 44, 'SITES · SOCKET ON THE LAST MILE');
      s += nd(14, 58, 190, 62, {t: 'Bristol Office', s: ['Socket X1500 · no NGFW'], ic: 'building', is: 20, icls: 'g', cls: 'hot'});
      s += nd(14, 152, 190, 62, {t: 'Glasgow', s: ['Socket X1600 · no NGFW'], ic: 'building', is: 20, icls: 'g', cls: 'hot'});
      /* tunnels to the PoP, drawn before the pin so they end under it */
      s += fl('M204 89C258 89 268 200 376 232', 'fl-tun', {dur: 1.3});
      s += fl('M204 183C292 183 304 238 376 246', 'fl-tun', {dur: 1.3});

      /* the retired appliance estate: no flows attach to it */
      s += tier(14, 262, 'APPLIANCE ESTATE');
      s += nd(14, 276, 190, 62, {t: 'EOL firewalls', s: ['retired — no refresh'], ic: 'firewall', is: 20, icls: 'g', cls: 'dash'});
      s += xmark(194, 286);

      /* ---- right top: internet and SaaS, inspected on the way out ---- */
      s += tier(560, 30, 'INTERNET · SAAS');
      s += fl('M548 224C600 200 606 164 630 146', 'fl-flow', {dur: 1.1, arrow: 'arr-m'});
      s += cloud(640, 100, 1.2, 'Internet & SaaS', 'M365 · Salesforce · WWW');

      /* ---- right bottom: the data centre, reached over the backbone ---- */
      s += fl(`M520 ${Math.round(fy(RG, 520)) - 2}C590 300 634 266 680 300`, 'fl-tun', {dur: 1.3});
      s += site(532, 300, 218, 150, 'LONDON DC');
      s += nd(544, 326, 196, 62, {t: 'Unpatched app server', s: ['CVE not yet patched'], ic: 'server', is: 20, icls: 'g', cls: 'hot'});
      s += pill(642, 418, 'Shielded by virtual patching', 'g keep');

      /* ---- bottom left: the exploit attempt dies at the PoP ---- */
      s += tier(94, 428, 'THREAT');
      s += fl('M204 462C280 440 352 370 392 302', 'fl-attack', {dur: 1.6, label: 'Blocked · IPS virtual patching', lx: 282, ly: 404, lcls: 'r keep'});
      s += xmark(394, 300);
      s += cloud(150, 480, .95, 'Attacker', 'new CVE exploit', 'bad');

      /* the PoP pin, on the front of the ring */
      s += fpin(400, Math.round(fy(RG, 400)) + 2, 26, 'PoP', {halo: true});
      s += T(348, 310, 'Global Private Backbone', 'f-s', 'end');
      s += T(400, 544, 'One global rule base · a change reaches every PoP in seconds', 'f-s', 'middle');
      return s;
    },
    title: 'Firewall refresh to FWaaS: enforcement at the Cato PoP',
    desc: 'Branch Sockets with no local firewalls connect to a Cato PoP whose single-pass engine inspects traffic to the internet and the London data centre; the EOL firewall estate is retired rather than refreshed, and an exploit against an unpatched application server is blocked at the PoP by IPS virtual patching.',
    legend: [['tun', 'Inspected & allowed by the single-pass engine'], ['flow', 'Inspected egress to internet & SaaS'], ['attack', 'Exploit blocked — IPS virtual patching'], 'live'],
  }],
});
