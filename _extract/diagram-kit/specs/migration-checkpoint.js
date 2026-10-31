/* specs/migration-checkpoint.js — Check Point (Quantum & Harmony) to Cato */
DG.page('migration-checkpoint', {
  spotlight: {
    hl: ['branch', 'dc', 'users', 'pop', 'backbone'],
    mods: ['sdwan', 'sse', 'uztna'],
    flows: [{p: 'br1'}, {p: 'dc1'}, {p: 'us1'}, {p: 'r-LC'}, {p: 'eg-www'}],
    steps: [
      {t: 'The Socket installs beside the Quantum gateway, which keeps the default gateway role during the build.', marks: ['branch', 'dc']},
      {t: 'A transit-VLAN handoff — static or eBGP, routes tagged community 32768 — moves subnets one prefix at a time.', marks: ['pop']},
      {t: 'Cohorts swap Endpoint Security VPN or the Harmony SASE agent for the Cato Client; rollback withdraws a prefix.', marks: ['users']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, TL, pill, site, ring, fpin, fy, cloud, popBox} = K;
      let s = '';

      /* ---- top: the Cato PoP on the global private backbone ---- */
      const RG = {cx: 380, cy: 146, rx: 170, ry: 34};
      s += popBox(250, 20, 260, 60, 'Cato PoP', 'FWaaS · SWG · IPS · TLSi — single pass');
      s += ring(RG);
      s += T(468, 210, 'Global private backbone', 'f-s', 'middle');

      /* ---- top right: the internet the Quantum gateway still routes to ---- */
      s += cloud(668, 70, .8, 'Internet');

      /* ---- centre: the site — parallel build ---- */
      s += site(100, 222, 560, 166, 'BRANCH / DC SITE');
      s += nd(120, 254, 180, 64, {t: 'Cato Socket', s: ['migrated prefixes'], ic: 'switch', is: 20, icls: 'g', cls: 'hot'});
      s += nd(460, 254, 180, 64, {t: 'Quantum gateway', s: ['default GW · EOS Dec 2025'], ic: 'firewall', is: 20, icls: 'g', cls: 'dash'});

      /* the transit-VLAN handoff */
      s += fl('M300 286H460', 'fl-lan', {np: 0});
      s += pill(380, 286, 'eBGP / static', 'm keep');
      s += TL(380, 306, ['transit VLAN', 'community 32768'], 'f-s', 'middle', 12);

      /* rollback lever: withdraw the prefix */
      s += fl('M190 318C190 354 520 354 520 322', 'fl-net', {np: 0, arrow: true});
      s += T(380, 374, 'Rollback — withdraw the prefix and traffic reverts to Check Point', 'f-s', 'middle');

      /* Socket → PoP (drawn before the pin so it ends under it) */
      const sX = 352, sY = Math.round(fy(RG, sX));
      s += fl(`M270 254C270 228 320 ${sY + 8} ${sX} ${sY - 2}`, 'fl-tun', {dur: 1.3});

      /* legacy default route out of the Quantum gateway */
      s += fl('M640 286H690C708 286 712 270 712 250V112', 'fl-ha', {np: 0, arrow: 'arr-y', label: 'legacy default route', lx: 664, ly: 180, lcls: 'y keep'});

      /* ---- bottom left: the migrated cohort ---- */
      const cX = 300, cY = Math.round(fy(RG, cX));
      s += fl(`M50 452C30 250 40 176 ${cX} ${cY - 2}`, 'fl-tun', {dur: 1.4});
      s += nd(14, 452, 210, 64, {t: 'Migrated cohort', s: ['Cato Client (SDP)'], ic: 'users', is: 20, icls: 'g', cls: 'hot'});
      s += pill(119, 534, 'via the Cato PoP', 'g');

      /* ---- bottom right: the legacy cohort ---- */
      s += fl('M600 452V318', 'fl-ha', {dur: 1.6, arrow: 'arr-y'});
      s += nd(500, 452, 246, 64, {t: 'Legacy cohort', s: ['Endpoint Security VPN', 'or Harmony SASE agent'], ic: 'users', is: 20, icls: 'g', cls: 'dash'});
      s += pill(623, 534, 'via Check Point', 'y');

      /* the PoP pin on the front of the ring */
      s += fpin(380, Math.round(fy(RG, 380)) + 2, 22, 'PoP', {halo: true});
      return s;
    },
    title: 'Parallel socket build alongside a Check Point Quantum gateway with per-prefix handoff',
    desc: 'The Socket sits alongside the Quantum gateway, which keeps the default gateway role; a transit-VLAN handoff moves subnets to Cato one prefix at a time while user cohorts swap from Endpoint Security VPN or the Harmony SASE agent to the Cato Client, and rollback at every step is a route withdrawal.',
    legend: [['tun', 'Migrated — via the Cato PoP (socket / Cato Client)'], ['ha', 'Legacy — via the Quantum gateway (Endpoint VPN)'], ['net', 'Rollback — withdraw the prefix'], 'live'],
  }],
});
