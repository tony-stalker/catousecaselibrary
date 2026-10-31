/* specs/migration-journey-vpn.js — VPN to ZTNA: Animated Phased Journey (five-phase player) */
(() => {
  /* ---- shared geometry: identical in every phase so the cross-fade reads as motion ---- */
  const VB = '0 0 960 500';
  const RG = {cx: 480, cy: 80, rx: 300, ry: 34};          // Cato Global Backbone (upper band)
  const PX = 480, TIP = 114;                              // PoP pin tip, on the ring front
  const CX = 40, CW = 170, CH = 58;                       // cohort column (left)
  const PIL = 160, WAV = 250, CON = 340;                  // cohort rows
  const AX = 760, AW = 170, AH = 58, AZY = 160, DCY = 330; // app estates (right): Azure above, London DC below
  const HX = 330, HY = 392, HW = 300, HH = 58;            // VPN headends (lower band)

  /* lanes */
  const vpn = {                                           // cohort → headends (legacy full-tunnel VPN)
    pil: `M${CX + CW} ${PIL + 42}C300 ${PIL + 42} 384 300 404 ${HY}`,
    wav: `M${CX + CW} ${WAV + 42}C290 ${WAV + 42} 348 330 362 ${HY}`,
    con: `M${CX + CW} ${CON + 40}C270 ${CON + 40} 290 ${HY + 22} ${HX} ${HY + 22}`,
  };
  const cato = {                                          // cohort → PoP (Cato Client ZTNA / clientless)
    pil: `M${CX + CW} ${PIL + 16}C330 ${PIL + 16} 420 140 ${PX - 8} ${TIP - 4}`,
    wav: `M${CX + CW} ${WAV + 16}C340 ${WAV + 10} 440 190 ${PX - 4} ${TIP}`,
    con: `M${CX + CW} ${CON + 16}C350 ${CON + 6} 456 230 ${PX} ${TIP}`,
  };
  const handoff = `M${HX + HW} ${HY + 29}C700 ${HY + 29} 700 ${DCY + 40} ${AX} ${DCY + 40}`;   // headends → London DC
  const hairpin = `M${AX + AW / 2} ${DCY}V${AZY + AH}`;                                         // London DC → Azure
  const railDC = `M${AX} ${DCY + 18}C640 ${DCY + 10} 540 200 ${PX + 6} ${TIP}`;                 // London DC Socket → PoP
  const railAZ = `M${AX} ${AZY + 22}C650 ${AZY + 22} 560 132 ${PX + 10} ${TIP - 6}`;            // Azure vSocket → PoP

  const draw = P => K => {
    const {nd, fl, T, R, ring, fpin, pill, tier, xmark} = K;
    const popNd = (x, y, w, h, o) => R(x, y, w, h, 'nd', 10) + nd(x, y, w, h, {...o, cls: 'pop'});   // opaque under the mint fill
    const box = (on, x, y, w, h, o) => on ? popNd(x, y, w, h, o) : nd(x, y, w, h, {...o, cls: 'soft'});
    let s = '';
    /* section labels */
    s += tier(CX, PIL - 14, 'USER COHORTS') + tier(AX, AZY - 14, 'APP ESTATES') + T(HX + HW, HY - 12, 'VPN HEADEND ESTATE', 'tier', 'end');

    /* upper band: backbone + PoP (from phase 1) */
    if (P.cato) s += ring(RG, 'Cato Global Backbone');

    /* legacy lanes: cohort → headends */
    ['pil', 'wav', 'con'].forEach(k => {
      const st = P.vpn[k];
      if (st === 'live') s += fl(vpn[k], 'fl-net', {dur: 2.4});
      else if (st === 'ha') s += fl(vpn[k], 'fl-ha', {dur: 2.4});
      else if (st === 'dim') s += fl(vpn[k], 'fl-net fl-dim', {np: 0});
    });
    /* headends hand-off to the private apps at London DC */
    if (P.handoff === 'live') s += fl(handoff, 'fl-net', {dur: 2});
    else if (P.handoff === 'dim') s += fl(handoff, 'fl-net fl-dim', {np: 0});
    else if (P.handoff === 'down') s += fl(handoff, 'fl-down', {np: 0});
    /* Azure hairpin through the DC (phase 0 only) */
    if (P.hairpin) s += fl(hairpin, 'fl-net', {dur: 1.6, arrow: 'arr-n', label: 'hairpin via the DC', lx: AX + AW / 2, ly: (DCY + AZY + AH) / 2});

    /* Cato lanes */
    if (P.cato) { s += fl(railDC, 'fl-tun', {dur: 2.2}); s += fl(railAZ, 'fl-tun', {dur: 2}); }
    if (P.on.pil) s += fl(cato.pil, 'fl-tun', {dur: 2});
    if (P.on.wav) s += fl(cato.wav, 'fl-tun', {dur: 2.2});
    if (P.on.con) s += fl(cato.con, 'fl-https', {dur: 2.4});

    /* the PoP, drawn after the lanes so they meet beneath its head */
    if (P.cato) {
      s += fpin(PX, TIP, 22, 'PoP', {halo: true});
      s += T(PX + 34, P.pop ? 76 : 84, 'Cato PoP', 'nd-t g');
      if (P.pop) s += T(PX + 34, 91, P.pop, 'f-s');
    }

    /* cohorts (left) */
    s += box(P.on.pil, CX, PIL, CW, CH, {t: 'Pilot cohort', s: [P.on.pil ? 'Cato Client' : 'full-tunnel VPN'], ic: 'users', icls: 'g'});
    s += box(P.on.wav, CX, WAV, CW, CH, {t: 'Wave cohorts', s: [P.on.wav ? 'Cato Client' : 'full-tunnel VPN'], ic: 'users', icls: 'g'});
    s += box(P.on.con, CX, CON, CW, CH, {t: 'Contractors', s: [P.on.con ? 'clientless · browser' : 'BYOD · same VPN'], ic: 'laptop', icls: 'g'});

    /* app estates (right) */
    s += box(P.cato, AX, AZY, AW, AH, {t: 'Azure', s: [P.cato ? 'vSocket · cloud apps' : 'cloud apps · via DC'], ic: 'globe', icls: 'g'});
    s += box(P.cato, AX, DCY, AW, AH, {t: 'London DC', s: [P.cato ? 'Socket · private apps' : 'private apps · on-prem'], ic: 'building', icls: 'g'});

    /* VPN headends (lower band) */
    const hd = nd(HX, HY, HW, HH, {t: 'VPN headends', s: [P.head], cls: P.off ? 'dash' : 'soft', ic: 'firewall'});
    s += P.off ? `<g style="opacity:.5">${hd}</g>` + xmark(HX + HW - 28, HY + HH / 2) : hd;
    if (P.wide) s += pill(HX + HW / 2, HY + HH + 22, 'one tunnel = whole network', '');
    if (P.off) s += T(HX + HW / 2, HY + HH + 26, 'decommissioned', 'f-m', 'middle');
    return s;
  };

  const legend = [
    ['tun', 'On Cato — Client ZTNA & Socket rail'],
    ['https', 'Clientless browser access'],
    ['ha', 'Interim — still on the VPN, Cato rail live'],
    ['net', 'Legacy VPN, hand-off & hairpin (faded = dormant rollback)'],
    ['down', 'Retired & decommissioned'],
  ];

  const PH = [
    { title: 'VPN retirement — phase 0: Legacy',
      desc: 'Baseline: every employee and contractor full-tunnels to the headends at London DC, one tunnel grants the whole network, and Azure apps are reached by hairpinning through the DC.',
      P: {cato: false, vpn: {pil: 'live', wav: 'live', con: 'live'}, on: {}, handoff: 'live', hairpin: true,
          head: 'terminate at London DC', wide: true} },
    { title: 'VPN retirement — phase 1: Cato rail',
      desc: 'The app side goes on Cato before any user moves: a Socket at London DC and a vSocket in Azure put both app estates on the backbone and collapse the Azure hairpin.',
      P: {cato: true, vpn: {pil: 'ha', wav: 'ha', con: 'ha'}, on: {}, handoff: 'live',
          head: 'terminate at London DC', wide: true} },
    { title: 'VPN retirement — phase 2: Pilot cohort',
      desc: 'MDM swaps the pilot cohort to the Cato Client for ZTNA to named apps in both locations; its VPN tunnel falls dormant as the rollback path.',
      P: {cato: true, pop: 'ZTNA · per-app policy', vpn: {pil: 'dim', wav: 'ha', con: 'ha'}, on: {pil: true}, handoff: 'live',
          head: 'terminate at London DC', wide: true} },
    { title: 'VPN retirement — phase 3: Cohort waves',
      desc: 'Departmental waves repeat the pilot’s swap and contractors and BYOD move to clientless browser access; the headends drain to standby as the rollback path.',
      P: {cato: true, pop: 'per-app policy · least privilege', vpn: {pil: 'dim', wav: 'dim', con: 'dim'}, on: {pil: true, wav: true, con: true}, handoff: 'dim',
          head: 'draining · standby'} },
    { title: 'VPN retirement — phase 4: Headends off',
      desc: 'Tunnel-groups are disabled and the concentrators at London DC decommissioned; every user rides always-on, posture-checked ZTNA to both app estates.',
      P: {cato: true, pop: 'always-on ZTNA · posture-checked', vpn: {}, on: {pil: true, wav: true, con: true}, handoff: 'down',
          head: 'switched off', off: true} },
  ];

  DG.page('migration-journey-vpn', {
    spotlight: {
      hl: ['users', 'dc', 'cloud', 'pop', 'backbone'],
      mods: ['uztna'],
      flows: [{p: 'us1'}, {p: 'us2'}, {p: 'dc1'}, {p: 'cl-az'}, {p: 'r-CR'}],
      steps: [
        {t: 'The rail goes in first: a Socket at London DC and a vSocket in Azure put both app estates on Cato.', marks: ['dc', 'cloud']},
        {t: 'The pilot cohort swaps to the Cato Client — ZTNA to named apps — while the headends stay live for the rest.', marks: ['users']},
        {t: 'Departmental waves follow the pilot’s checklist; contractors and BYOD go clientless in the browser.', marks: ['users', 'pop']},
        {t: 'Tunnel-groups are disabled and the concentrators decommissioned — nothing is left listening on the internet.', marks: ['dc']},
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
