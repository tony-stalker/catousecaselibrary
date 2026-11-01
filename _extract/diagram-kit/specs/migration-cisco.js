/* specs/migration-cisco.js — Cisco (Umbrella, AnyConnect, Catalyst SD-WAN, Meraki) to Cato */
DG.page('migration-cisco', {
  spotlight: {
    anchors: {saas: [302, 310]},   // step-3 marker right of the SaaS cloud, clear of the 'Smart egress' subtitle
    hl: ['branch', 'dc', 'pop', 'backbone', 'saas', 'users'],
    mods: ['sdwan', 'sse'],
    flows: [{p: 'br1'}, {p: 'br2'}, {p: 'dc1'}, {p: 'r-LC'}, {p: 'eg-www'}, {p: 'eg-saas'}, {p: 'us1'}],
    steps: [
      {t: 'Regional Cato hubs peer over eBGP with each Viptela hub, or the L3 core behind a Meraki MX, for symmetry.', marks: ['dc']},
      {t: 'Disabling a legacy spoke lets OMP withdraw its routes; re-enabling it is the rollback.', marks: ['branch']},
      {t: 'Migrated sites get DNS and web security inline at the PoP, so Umbrella is bypassed.', marks: ['pop', 'saas']},
      {t: 'AnyConnect cohorts swap to the Cato Client and reach the nearest PoP with the same inspection stack.', marks: ['users']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, site, ring, fpin, pinTop, fy, popBox, cloud} = K;
      let s = '';

      /* ---- top: Cato PoP on the global private backbone, Internet & SaaS to the right ---- */
      const RG = {cx: 300, cy: 140, rx: 150, ry: 28};
      s += popBox(190, 12, 220, 58, 'Cato PoP', 'FWaaS · SWG · DNS Security · ZTNA');
      s += ring(RG);
      s += T(300, 198, 'Global Private Backbone', 'f-s', 'middle');
      s += cloud(670, 66, 1.15, 'Internet & SaaS', 'M365 · web · cloud apps');

      /* migrated paths (green): Bristol and the hub Socket tunnel to the PoP; the PoP egresses directly */
      const fB = Math.round(fy(RG, 200)), fH = Math.round(fy(RG, 430));
      s += fl(`M106 236C106 200 160 ${fB + 10} 200 ${fB}`, 'fl-tun', {dur: 1.4});
      s += fl(`M440 256C440 220 436 ${fH + 14} 430 ${fH}`, 'fl-tun', {dur: 1.4});
      const pinTip = Math.round(fy(RG, 300)) + 2;
      s += fl('M300 70V' + (pinTop(pinTip, 20) - 2), 'fl-lan', {np: 0});
      s += fpin(300, pinTip, 20, 'PoP', {halo: true});
      s += fl('M410 41C480 41 540 60 600 66', 'fl-flow', {arrow: true, dur: 1.6});
      s += pill(490, 88, 'Umbrella bypassed — enforced at PoP', 'g');

      /* ---- left: the branches ---- */
      s += nd(16, 236, 190, 70, {t: 'Bristol Office', s: ['Cato Socket · live', 'DNS + web policy at PoP'], ic: 'building', is: 20, icls: 'g', cls: 'hot'});
      s += pill(166, 236, 'migrated', 'g');
      s += nd(16, 420, 190, 70, {t: 'Glasgow branch', s: ['cEdge spoke · OMP/TLOC', 'waiting for wave 2'], ic: 'building', is: 20, icls: 'g', cls: 'dash'});
      s += pill(172, 420, 'wave 2', 'y');

      /* ---- centre: the regional interconnect — hub Socket and Viptela hub over eBGP ---- */
      s += site(236, 226, 240, 284, 'REGIONAL INTERCONNECT');
      s += nd(252, 256, 208, 70, {t: 'Interconnect hub site', s: ['Cato Socket · eBGP peer', 'AS-path keeps symmetry'], ic: 'cpu', is: 20, icls: 'g', cls: 'hot'});
      s += nd(252, 420, 208, 70, {t: 'Viptela regional hub', s: ['OMP ↔ BGP redistribute'], ic: 'route', is: 20, icls: 'g'});
      s += fl('M356 326V420', 'fl-lan', {np: 0});
      s += pill(356, 373, 'eBGP handoff', 'm');

      /* legacy paths (amber): Glasgow on the OMP overlay, egress through Umbrella */
      s += fl('M106 490C106 548 330 548 330 490', 'fl-ha', {dur: 1.8, label: 'OMP / TLOC overlay', lx: 218, ly: 533, lcls: 'y'});
      s += fl('M460 455C560 455 665 440 665 374', 'fl-ha', {arrow: 'arr-y', dur: 1.8, label: 'legacy DNS / web egress', lx: 566, ly: 452, lcls: 'y'});

      /* ---- right: Cisco Umbrella, retiring ---- */
      s += nd(584, 300, 162, 70, {t: 'Cisco Umbrella', s: ['DNS / SWG · retiring'], ic: 'globe', is: 20, icls: 'g', cls: 'dash'});
      s += pill(712, 300, 'retiring', 'y');
      s += fl('M665 300V108', 'fl-ha', {np: 0, arrow: 'arr-y'});
      return s;
    },
    title: 'Regional co-existence of Cato and a Cisco Viptela overlay during migration',
    desc: 'The migrated spoke rides the Cato backbone with DNS and web security enforced at the PoP; the legacy spoke stays on the Viptela overlay and Umbrella, and eBGP at the regional interconnect with OMP-to-BGP redistribution keeps routing symmetric so spoke cutover withdraws routes automatically.',
    legend: [['tun', 'Migrated — Cato tunnel, DNS/SWG at the PoP'], ['flow', 'Inspected egress from the PoP'], ['ha', 'Interim — OMP overlay + Umbrella until the wave completes'], 'live'],
  }],
});
