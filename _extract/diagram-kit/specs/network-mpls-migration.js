/* specs/network-mpls-migration.js — MPLS to SASE Migration & Co-existence */
DG.page('network-mpls-migration', {
  spotlight: {
    hl: ['branch', 'dc', 'pop', 'backbone'],
    mods: ['sdwan'],
    flows: [{p: 'br1'}, {p: 'br2'}, {p: 'r-LC'}, {p: 'dc1', rev: true}],
    steps: [
      {t: 'The datacentre takes a Socket first and becomes the bridge between the Cato cloud and MPLS.', marks: ['dc']},
      {t: 'The DC socket advertises the prefixes of sites still on MPLS, reached via the DC LAN and MPLS CE router.', marks: ['dc', 'pop']},
      {t: 'Each branch migrates on its own schedule with broadband and 4G last miles and is instantly on-net.', marks: ['branch', 'backbone']},
      {t: 'Migrated sites reach un-migrated sites by transiting the DC; the legacy network is untouched until switch-off.', marks: ['pop']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, site, ring, fpin, fy, cloud} = K;
      let s = '';

      /* ---- top centre: the Cato cloud on the global private backbone ---- */
      const RG = {cx: 380, cy: 96, rx: 170, ry: 34};
      s += T(380, 30, 'Cato Cloud', 'f-h', 'middle');
      s += T(380, 44, 'Global private backbone · nearest PoP', 'f-s', 'middle');
      s += ring(RG);

      /* Bristol → Cato: broadband and 4G tunnels (drawn before the pin so they meet under the ring front) */
      const bA = Math.round(fy(RG, 290)), bB = Math.round(fy(RG, 308));
      s += fl(`M96 262C96 200 230 ${bA + 4} 288 ${bA - 2}`, 'fl-tun', {dur: 1.3});
      s += fl(`M126 262C126 212 240 ${bB + 10} 306 ${bB - 2}`, 'fl-tun', {dur: 1.3});
      /* Cato → London DC socket */
      const dT = Math.round(fy(RG, 440));
      s += fl(`M440 ${dT - 2}C440 190 376 184 376 236`, 'fl-tun', {dur: 1.3});

      /* ---- the transit path: Bristol → backbone → DC socket → (DC LAN, not the firewall) → MPLS CE → MPLS → Leeds ---- */
      const hA = Math.round(fy(RG, 326));
      s += fl(`M156 262C156 214 262 ${hA + 12} 324 ${hA - 2}`, 'fl-hot', {dur: 1.6, n: 2});
      s += fl(`M326 ${hA - 1}A${RG.rx} ${RG.ry} 0 0 0 452 ${Math.round(fy(RG, 452)) - 1}`, 'fl-hot', {dur: 1.6, n: 2});
      s += fl(`M452 ${Math.round(fy(RG, 452)) - 2}C452 196 392 186 392 236`, 'fl-hot', {dur: 1.6, n: 2});
      s += fl('M296 270H270V444H296', 'fl-hot', {dur: 1.6, n: 2});
      s += fl('M496 462H584', 'fl-hot', {dur: 1.6, n: 2, label: 'to Leeds', lx: 540, ly: 478});
      s += fl('M650 410V352', 'fl-hot', {dur: 1.6, n: 2});

      s += fpin(380, Math.round(fy(RG, 380)) + 2, 22, 'PoP', {halo: true});
      s += pill(628, 172, 'One routing table for all sites', 'g');

      /* ---- left: the migrated branch ---- */
      s += site(14, 236, 212, 150, 'BRISTOL — MIGRATED');
      s += nd(26, 262, 188, 68, {t: 'Bristol', s: ['X1500 · 192.168.1.0/24', 'Broadband + 4G last miles'], ic: 'building', is: 18, icls: 'g', cls: 'hot'});
      s += pill(120, 358, 'internet egress via Cato PoP', 'm');

      /* ---- centre: London DC bridges both networks ---- */
      s += site(260, 210, 240, 330, 'LONDON DC · 192.168.2.0/24');
      s += fl('M278 263V451M278 263H296M278 357H296M278 451H296', 'fl-lan', {np: 0});
      s += nd(296, 236, 200, 54, {t: 'Socket X1500', s: ['advertises Leeds’ prefix too'], ic: 'server', is: 20, icls: 'g', cls: 'hot'});
      s += nd(296, 330, 200, 54, {t: 'Local firewall', s: ['internet egress (today)'], ic: 'firewall', is: 20, icls: 'g'});
      s += nd(296, 424, 200, 54, {t: 'MPLS CE router', s: ['routes 192.168.3.0/24'], ic: 'route', is: 20, icls: 'g'});
      s += T(380, 508, 'DC LAN · one L3 segment', 'f-m', 'middle');

      /* ---- right: the legacy MPLS network and the site still on it ---- */
      s += fl('M496 450H584', 'fl-net', {np: 0});
      s += cloud(640, 452, 1, 'MPLS', 'legacy — unchanged');
      s += fl('M632 410V352', 'fl-net', {np: 0});
      s += site(540, 236, 206, 116, 'LEEDS — ON MPLS');
      s += nd(552, 262, 182, 68, {t: 'Leeds', s: ['192.168.3.0/24 · CE router', 'migrates at contract end'], ic: 'building', is: 18, icls: 'g', cls: 'soft'});
      return s;
    },
    title: 'MPLS co-existence: Bristol on Cato, Leeds on MPLS, London DC bridging both',
    desc: 'Bristol, already migrated to a Socket with broadband and 4G last miles, reaches London DC over the Cato cloud and reaches Leeds, still on MPLS, by transiting the London DC socket and, across the DC LAN, the MPLS CE router; nothing on the legacy network changes until Leeds migrates.',
    legend: [['tun', 'Bristol ↔ London DC — on-net via Cato'], ['hot', 'Bristol ↔ Leeds — transits London DC during co-existence'], ['net', 'Legacy MPLS — unchanged until Leeds migrates'], 'live'],
  }],
});
