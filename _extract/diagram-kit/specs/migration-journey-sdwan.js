/* specs/migration-journey-sdwan.js — SD-WAN to Cato: Animated Phased Journey (five-phase player) */
(() => {
  /* ---- shared geometry: identical in every phase so the cross-fade reads as motion ---- */
  const VB = '0 0 960 500';
  const RG = {cx: 480, cy: 76, rx: 300, ry: 32};           // Cato Global Backbone (upper band)
  const PX = 480, TIP = 118;                               // PoP pin tip, just below the ring front
  const LX = 30, RX = 750, CW = 180, CH = 58;              // site columns: branches left, DC + cloud right
  const TOP = 168, LOW = 332;                              // rows: Bristol / Slough DC above, Glasgow / Azure below
  const SX = 350, SY = 218, SW = 260, SH = 262;            // London hub site boundary (lower centre)
  const BX = 375, BW = 210, BH = 58, SOY = 246, LGY = 392; // boxes inside the hub: Socket above, legacy hub below

  /* legacy overlay lanes: every site → the legacy hub appliance */
  const ovl = {
    bri: `M${LX + CW} ${TOP + 29}C300 ${TOP + 29} 320 ${LGY + 15} ${BX} ${LGY + 15}`,
    gla: `M${LX + CW} ${LOW + 29}C290 ${LOW + 29} 320 ${LGY + 43} ${BX} ${LGY + 43}`,
    slo: `M${RX} ${TOP + 29}C660 ${TOP + 29} 640 ${LGY + 15} ${BX + BW} ${LGY + 15}`,
    azu: `M${RX} ${LOW + 29}C670 ${LOW + 29} 640 ${LGY + 43} ${BX + BW} ${LGY + 43}`,
  };
  /* Cato lanes: every site → the PoP */
  const cato = {
    bri: `M${LX + CW} ${TOP + 14}C330 ${TOP + 14} 400 130 ${PX - 14} ${TIP - 6}`,
    gla: `M${LX + CW} ${LOW + 14}C300 ${LOW + 14} 300 160 ${PX - 18} ${TIP - 2}`,
    slo: `M${RX} ${TOP + 14}C630 ${TOP + 14} 560 130 ${PX + 14} ${TIP - 6}`,
    azu: `M${RX} ${LOW + 14}C660 ${LOW + 14} 660 160 ${PX + 18} ${TIP - 2}`,
  };
  const uplink = `M${PX} ${SOY}V${TIP + 2}`;                // hub Socket → PoP
  const handoff = `M${PX} ${SOY + BH}V${LGY}`;              // eBGP handoff between the fabrics

  const draw = P => K => {
    const {nd, fl, T, R, ring, fpin, pill, site, xmark} = K;
    const popNd = (x, y, w, h, o) => R(x, y, w, h, 'nd', 10) + nd(x, y, w, h, {...o, cls: 'pop'});   // opaque under the mint fill
    const box = (on, x, y, w, h, o) => on ? popNd(x, y, w, h, o) : nd(x, y, w, h, {...o, cls: 'soft'});
    let s = '';

    /* upper band: backbone (from phase 1) */
    if (P.cato) s += ring(RG, 'Cato Global Backbone');

    /* London hub site boundary */
    s += site(SX, SY, SW, SH, 'LONDON HUB');

    /* lanes: overlay (live / dormant) and Cato tunnels */
    ['bri', 'gla', 'slo', 'azu'].forEach(k => {
      if (P.on[k]) {
        if (!P.off) s += fl(ovl[k], 'fl-net fl-dim', {np: 0});   // dormant until the overlay is retired
        s += fl(cato[k], 'fl-tun', {dur: 2.2});
      } else if (!P.off) s += fl(ovl[k], 'fl-net', {dur: 2.6});
    });
    if (P.cato) s += fl(uplink, 'fl-tun', {dur: 1.6});
    if (P.handoff) s += fl(handoff, 'fl-ha', {dur: 1.8, label: P.handoff, lx: PX, ly: (SOY + BH + LGY) / 2, lcls: 'y'});

    /* the PoP, drawn after the lanes so they meet beneath its head */
    if (P.cato) {
      s += fpin(PX, TIP, 22, 'PoP', {halo: true});
      s += T(PX + 34, P.pop ? 66 : 74, 'Cato PoP', 'nd-t g');
      if (P.pop) s += T(PX + 34, 81, P.pop, 'f-s');
    }

    /* branches (left) */
    s += box(P.on.bri, LX, TOP, CW, CH, {t: 'Bristol', s: [P.on.bri ? 'migrated · Cato' : 'branch · on overlay'], ic: 'building', icls: 'g'});
    s += box(P.on.gla, LX, LOW, CW, CH, {t: 'Glasgow', s: [P.on.gla ? 'migrated · Cato' : 'branch · on overlay'], ic: 'building', icls: 'g'});

    /* DC and cloud (right) */
    s += box(P.on.slo, RX, TOP, CW, CH, {t: 'Slough DC', s: [P.on.slo ? 'Socket HA · on Cato' : 'apps · via London hub'], ic: 'server', icls: 'g'});
    s += box(P.on.azu, RX, LOW, CW, CH, {t: 'Azure vWAN hub', s: [P.on.azu ? 'vSocket · on Cato' : 'reached via the hub'], ic: 'globe', icls: 'g'});

    /* inside the London hub: the parallel Socket (from phase 1) and the legacy hub appliance */
    if (P.cato) s += popNd(BX, SOY, BW, BH, {t: 'Cato Socket', s: [P.sock], ic: 'server', icls: 'g'});
    const lg = nd(BX, LGY, BW, BH, {t: 'Legacy SD-WAN hub', s: [P.legacy], cls: P.off ? 'dash' : 'soft', ic: 'route'});
    s += P.dim ? `<g style="opacity:.5">${lg}</g>` : lg;
    if (P.off) {
      s += fl(handoff, 'fl-down fl-dim', {np: 0});   // retired handoff stub
      s += xmark(BX + BW, LGY);
      s += T(PX, LGY + BH + 20, 'overlay & controllers retired', 'f-m', 'middle');
    }
    return s;
  };

  const legend = [
    ['tun', 'On the Cato backbone'],
    ['ha', 'eBGP handoff — routes exchanged'],
    ['net', 'Legacy SD-WAN overlay (live / dormant)'],
    ['down', 'Retired & decommissioned'],
  ];

  const PH = [
    { title: 'Legacy SD-WAN to Cato — phase 0: Legacy overlay',
      desc: 'Baseline: Bristol and Glasgow, the Slough DC and the Azure vWAN hub are all anchored to the legacy hub appliance at the London hub site; no Cato yet.',
      P: {cato: false, on: {}, legacy: 'incumbent overlay core'} },
    { title: 'Legacy SD-WAN to Cato — phase 1: Parallel Socket at the hub',
      desc: 'A Cato Socket stands beside the legacy appliance at the London hub and an eBGP handoff peers the two fabrics; legacy still carries all production.',
      P: {cato: true, on: {}, sock: 'parallel at London hub', handoff: 'eBGP handoff', legacy: 'incumbent overlay core'} },
    { title: 'Legacy SD-WAN to Cato — phase 2: DC and cloud on-net',
      desc: 'Slough DC comes up on HA Sockets and the Azure vWAN hub on a vSocket; branches still on the overlay reach them across the hub eBGP handoff.',
      P: {cato: true, on: {slo: true, azu: true}, sock: 'parallel at London hub', handoff: 'eBGP handoff', legacy: 'incumbent overlay core'} },
    { title: 'Legacy SD-WAN to Cato — phase 3: Branch waves',
      desc: 'Bristol and Glasgow cut over in waves; anything still on the overlay stays anchored to its own hub by AS-path length, and the handoff remains as the rollback path.',
      P: {cato: true, on: {bri: true, gla: true, slo: true, azu: true}, sock: 'parallel at London hub', handoff: 'eBGP handoff · rollback path',
          legacy: 'emptying out', dim: true} },
    { title: 'Legacy SD-WAN to Cato — phase 4: Overlay retired',
      desc: 'The legacy hub appliance, its overlay links, controllers and licences are decommissioned; every site, DC and cloud runs on one Cato fabric.',
      P: {cato: true, on: {bri: true, gla: true, slo: true, azu: true}, off: true, sock: 'the only hub now', pop: 'every site any-to-any · one fabric',
          legacy: 'decommissioned', dim: true} },
  ];

  DG.page('migration-journey-sdwan', {
    spotlight: {
      hl: ['branch', 'dc', 'cloud', 'pop', 'backbone'],
      mods: ['sdwan'],
      flows: [{p: 'br1'}, {p: 'br2'}, {p: 'dc1'}, {p: 'cl-az'}, {p: 'r-LC'}, {p: 'r-CR'}],
      steps: [
        {t: 'A Cato Socket runs in parallel at the London hub; an eBGP handoff exchanges routes between the fabrics.', marks: ['pop']},
        {t: 'Slough DC comes up on HA Sockets and the Azure vWAN hub on a vSocket — the low-risk wins first.', marks: ['dc', 'cloud']},
        {t: 'Bristol and Glasgow cut over in waves, each with instant rollback; AS-path length keeps routing symmetric.', marks: ['branch']},
        {t: 'The legacy hub appliance, overlay and licences are decommissioned — one Cato fabric remains.', marks: ['backbone']},
      ],
    },
    diagrams: PH.map((ph, i) => ({
      slot: 'phase-' + (i + 1),
      vb: VB,
      draw: draw(ph.P),
      title: ph.title,
      desc: ph.desc,
      legend,
    })),
    picSlot: 'phase-5',
  });
})();
