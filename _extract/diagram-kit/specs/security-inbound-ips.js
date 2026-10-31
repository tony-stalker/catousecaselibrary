/* specs/security-inbound-ips.js — Cloud-Delivered Inbound Protection (allocated IP · inbound IPS · Remote Port Forwarding) */
DG.page('security-inbound-ips', {
  spotlight: {
    hl: ['saas', 'pop', 'backbone', 'branch'],
    mods: ['sse'],
    flows: [{p: 'atk'}, {p: 'eg-www', rev: true}, {p: 'br1', rev: true}],
    steps: [
      {t: 'An allocated static IP at the London PoP is the only address the published service exposes.', marks: ['popL']},
      {t: 'Inbound requests terminate at the PoP, where SPACE and inbound IPS inspect and scrub every one.', marks: ['pop']},
      {t: 'SQLi, XSS and RCE payloads are dropped at the PoP edge; new CVE signatures arrive by virtual patching.', marks: ['popL']},
      {t: 'Clean traffic is remote-port-forwarded down the Socket’s outbound DTLS tunnel; no inbound ports open.', marks: ['branch']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 500',
    draw: K => {
      const {nd, fl, T, R, I, pill, site, popBox, tile, cloud, tier, xmark} = K;
      let s = '';

      /* ---- section labels ---- */
      s += tier(14, 44, 'INTERNET') + tier(266, 44, 'CATO SASE CLOUD');

      /* ---- centre: the London PoP, drawn first so everything else sits on it ---- */
      s += popBox(266, 60, 180, 380, 'Cato PoP — London', 'SPACE · Inbound IPS');
      s += T(356, 116, 'Virtual patching', 'f-s', 'middle');
      s += pill(356, 206, 'Allow list · IP · country', 'keep');
      s += T(356, 410, 'signatures written & deployed', 'f-s', 'middle');
      s += T(356, 424, 'by Cato Security Research', 'f-s', 'middle');

      /* ---- right: the on-prem lab site, dark to the internet ---- */
      s += site(566, 180, 180, 260, 'ON-PREM LAB');
      s += T(656, 236, 'Socket', 'f-s', 'middle');
      s += R(581, 245, 150, 46, 'dev', 9) + `<circle cx="607" cy="268" r="9" class="sock-ring"/>` + T(721, 275, 'X1500', 't-sock', 'end');
      s += fl('M656 291V330', 'fl-net', {np: 0});
      s += nd(581, 330, 150, 62, {t: 'Web server', s: ['no inbound ports'], ic: 'server', is: 20, icls: 'g'});
      s += pill(656, 418, 'site stays dark', 'g keep');

      /* ---- the tunnel: dialled out by the Socket, so the arrow points at the PoP ---- */
      s += fl('M581 268H446', 'fl-tun', {np: 0, arrow: 'arr'});
      s += T(506, 248, 'Remote Port Forward', 'f-t', 'middle');
      s += T(506, 296, 'outbound DTLS tunnel', 'f-s', 'middle');
      s += T(506, 310, 'dialled out', 'f-s', 'middle') + T(506, 324, 'by the Socket', 'f-s', 'middle');

      /* ---- left: who is connecting ---- */
      s += tile(14, 140, 124, 100, 'user', 'Legitimate user', ['HTTPS to the', 'published service']);
      s += cloud(76, 400, 1, 'Attacker', 'SQLi · XSS · RCE', 'bad');
      s += T(76, 458, 'exploit payloads', 'f-s', 'middle');

      /* ---- lanes into the allocated IP ---- */
      s += fl('M138 190C172 190 168 268 196 268', 'fl-https', {dur: 1.2});
      s += fl('M128 382C168 370 168 304 196 304', 'fl-attack', {dur: 1.4});

      /* ---- the legitimate request: through the PoP and down the tunnel to the server ---- */
      s += fl('M346 268H446', 'fl-https', {dur: .6});
      s += fl('M446 278H581', 'fl-https', {dur: 1.2});
      s += fl('M656 291V330', 'fl-https', {dur: .5});

      /* ---- the attack dies inside the PoP ---- */
      s += fl('M346 304C362 304 374 338 388 354', 'fl-attack', {dur: .9});
      s += xmark(390, 358);
      s += pill(356, 390, 'dropped by inbound IPS', 'r keep');

      /* ---- the allocated IP straddles the PoP edge: the only public address ---- */
      s += nd(196, 250, 150, 78, {t: 'Allocated IP', s: ['static IP · London PoP', 'the only address', 'you publish'], cls: 'hot'});
      s += I('globe', 206, 258, 16, 'ic g');
      return s;
    },
    title: 'Inbound protection: allocated IP, PoP IPS and Remote Port Forwarding',
    desc: 'A legitimate user and an attacker both reach an allocated IP at the London PoP; the attacker’s SQLi, XSS and RCE payloads are dropped by inbound IPS at the PoP edge, while the legitimate request is remote-port-forwarded over the Socket’s outbound DTLS tunnel to an on-prem web server with no inbound ports open.',
    legend: [['https', 'Legitimate request — forwarded to the on-prem service'], ['attack', 'Attack traffic — scrubbed by inbound IPS at the PoP'], ['tun', 'Outbound DTLS tunnel — dialled out by the Socket'], 'live'],
  }],
});
