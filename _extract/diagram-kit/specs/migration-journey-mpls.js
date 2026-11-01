/* specs/migration-journey-mpls.js — MPLS to Cato: Animated Phased Journey (five phase SVGs, shared geometry) */
const MPLS_J = (() => {
  /* ---- shared geometry: identical in every phase so the cross-fade reads as motion ---- */
  const RG = {cx: 480, cy: 70, rx: 330, ry: 34};          // Cato Global Backbone (upper band)
  const W = 170, H = 60, LX = 30, RX = 760;               // node columns
  const Y = {top: 160, mid: 245, bot: 330};               // node rows
  const CL = {x: 480, y: 428, k: 1.1};                    // MPLS cloud (lower band)

  /* lanes (every path fixed; a phase only chooses which to draw and how) */
  const P = {
    /* Cato tunnels: site → its own point on the front of the ring */
    tBri: 'M200 178C240 178 260 140 260 99',
    tLee: 'M200 263C268 263 310 168 310 103',
    tGla: 'M200 348C300 348 360 206 360 106',
    tAws: 'M760 178C720 178 700 140 700 99',
    tLon: 'M760 263C692 263 650 168 650 103',
    tMan: 'M760 348C660 348 600 206 600 106',
    /* legacy MPLS: site → carrier core */
    mBri: 'M200 202C320 202 404 336 450 403',
    mLee: 'M200 287C300 287 370 380 424 414',
    mGla: 'M200 372C290 372 350 430 420 440',
    mLon: 'M760 287C668 287 600 380 538 414',
    mMan: 'M760 372C668 372 610 428 545 440',
    mAws: 'M930 190C956 190 956 275 930 275',          // AWS hairpinned through the London DC
    /* interim path: carrier core → Manchester handoff → backbone */
    hLow: 'M540 456C640 462 718 432 766 392',
    hUp: 'M760 360C636 360 572 216 572 105',
  };

  const draw = ph => K => {
    const {nd, fl, T, pill, ring, fpin, fy, cloud, xmark, tier} = K;
    let s = '';
    const on = n => n <= ph;                                // has phase n happened yet?

    /* ---- section labels ---- */
    s += tier(LX, 146, 'BRANCHES');
    s += tier(RX, 146, 'HUB · DC · CLOUD');
    s += tier(LX, 26, on(1) ? 'CATO BACKBONE' : 'NO CATO YET');
    s += tier(LX, 486, 'LEGACY MPLS');

    /* ---- upper band: ring + PoP (from phase 1) ---- */
    if (on(1)) s += ring(RG, '');                         // tier already reads CATO BACKBONE

    /* ---- lanes ---- */
    const live = (d, o = {}) => fl(d, 'fl-net', {dur: 2.6, n: 2, ...o});
    const dorm = d => fl(d, 'fl-net fl-dim', {np: 0});
    const gone = d => fl(d, 'fl-down', {np: 0});
    const tun = d => fl(d, 'fl-tun', {dur: 1.4, n: 2});

    /* branches */
    [['mBri', 'tBri', 3], ['mLee', 'tLee', 3], ['mGla', 'tGla', 4]].forEach(([m, t, cut]) => {
      if (!on(cut)) s += live(P[m]);
      else if (ph < 4) s += dorm(P[m]);
      else if (cut === 4) s += gone(P[m]);
      if (on(cut)) s += tun(P[t]);
    });
    /* London DC and AWS (on-net in phase 2) */
    if (!on(2)) { s += live(P.mLon); s += live(P.mAws, {n: 1}); }
    else if (ph < 4) { s += dorm(P.mLon); s += dorm(P.mAws); }
    if (on(2)) { s += tun(P.tLon); s += tun(P.tAws); }
    /* Manchester: colo interconnect → eBGP handoff bridge → retired CE */
    if (ph < 4) s += live(P.mMan, on(1) ? {label: 'eBGP handoff', lx: 668, ly: 380, lcls: 'g'} : {});
    else s += gone(P.mMan);
    if (on(1)) s += tun(P.tMan);
    /* interim amber path for the sites still on MPLS */
    if (ph === 2 || ph === 3) {
      s += fl(P.hLow, 'fl-ha', {dur: 2.2, n: 2});
      s += fl(P.hUp, 'fl-ha', {dur: 2.2, n: 2});
      s += pill(652, 480, 'interim path via the Manchester handoff', 'y');
    }

    /* ---- PoP pin over the lanes ---- */
    if (on(1)) s += fpin(RG.cx, Math.round(fy(RG, RG.cx)) + 2, 24, 'PoP', {halo: true});
    if (ph === 4) s += pill(480, 304, 'every site, DC and cloud any-to-any · one routing table', 'g');

    /* ---- lower band: the MPLS carrier core ---- */
    const sub = ['carrier core', 'carrier core', 'carrier core', 'emptying out', 'decommissioned'][ph];
    const c = cloud(CL.x, CL.y, CL.k, 'MPLS', sub, ph === 4 ? 'bad' : '');
    s += ph >= 3 ? `<g opacity="${ph === 3 ? .55 : .7}">${c}</g>` : c;
    if (ph === 4) s += xmark(536, 392);

    /* ---- nodes (fixed boxes; only class and sub-lines change) ---- */
    const node = (x, y, t, subs, ic, isOn) =>
      nd(x, y, W, H, {t, s: subs, ic, is: 20, icls: 'g', cls: isOn ? 'pop' : 'soft'});
    s += node(LX, Y.top, 'Bristol', [on(3) ? 'on Cato' : 'on MPLS'], 'building', on(3));
    s += node(LX, Y.mid, 'Leeds', [on(3) ? 'on Cato' : 'on MPLS'], 'building', on(3));
    s += node(LX, Y.bot, 'Glasgow', [on(4) ? 'on Cato' : 'on MPLS'], 'building', on(4));
    s += node(RX, Y.top, 'AWS eu-west-2', [on(2) ? 'vSocket' : 'via London DC'], 'cpu', on(2));
    s += node(RX, Y.mid, 'London DC', ['private apps', on(2) ? 'HA Socket pair' : 'on MPLS'], 'server', on(2));
    s += node(RX, Y.bot, 'Manchester hub',
      ['colo interconnect', ...(on(4) ? ['on Cato'] : on(1) ? ['Socket + eBGP'] : [])], 'route', on(1));
    return s;
  };

  const legend = [
    ['tun', 'On the Cato backbone'],
    ['ha', 'Interim path via the Manchester handoff'],
    ['net', 'Legacy MPLS (live / dormant)'],
    ['down', 'Retired & decommissioned'],
  ];
  const meta = [
    ['MPLS exit — phase 0: Legacy',
      'Baseline: three branches, the Manchester colo interconnect and the London DC all hub-and-spoke through the MPLS cloud, and AWS eu-west-2 is reached through the DC.'],
    ['MPLS exit — phase 1: Hub bridge',
      'The first Socket goes in at the Manchester colo beside the MPLS CE and peers eBGP with it, so the hub is dual-homed with both paths live.'],
    ['MPLS exit — phase 2: DCs on-net',
      'London DC gains an HA Socket pair and AWS eu-west-2 a vSocket; branches still on MPLS reach both across the Manchester handoff.'],
    ['MPLS exit — phase 3: Waves',
      'Bristol and Leeds cut over to the PoP in waves while Glasgow still reaches everything through the Manchester handoff.'],
    ['MPLS exit — phase 4: Retired',
      'The last circuit is switched off and the MPLS contract cancelled; every site, DC and cloud rides the Cato backbone with one routing table.'],
  ];
  return meta.map(([title, desc], ph) => ({slot: 'phase-' + (ph + 1), vb: '0 0 960 500', draw: draw(ph), title, desc, legend}));
})();

DG.page('migration-journey-mpls', {
  spotlight: {
    hl: ['branch', 'dc', 'cloud', 'pop', 'backbone'],
    mods: ['sdwan'],
    flows: [{p: 'br1'}, {p: 'br2'}, {p: 'dc1'}, {p: 'cl-aws'}, {p: 'r-LC'}, {p: 'r-CR'}],
    steps: [
      {t: 'Manchester becomes the bridge: the first Socket goes in beside the MPLS CE and peers eBGP with it.', marks: ['dc']},
      {t: 'London DC and AWS eu-west-2 come on-net first; branches still on MPLS reach them across the handoff.', marks: ['dc', 'cloud']},
      {t: 'Bristol and Leeds swing up to the PoP in waves; Glasgow rides the emptying MPLS cloud until its turn.', marks: ['branch', 'pop']},
      {t: 'The last circuit is switched off: every site, DC and cloud rides the Cato backbone, one routing table.', marks: ['backbone']},
    ],
  },
  diagrams: MPLS_J,
  picSlot: 'phase-5',
});
