/* specs/migration-edgeconnect.js — HPE Aruba EdgeConnect (Silver Peak) to Cato */
DG.page('migration-edgeconnect', {
  spotlight: {
    hl: ['branch', 'dc', 'pop', 'backbone', 'saas'],
    mods: ['sdwan', 'sse'],
    flows: [{p: 'br1'}, {p: 'br2'}, {p: 'dc1'}, {p: 'r-LC'}, {p: 'eg-www'}],
    steps: [
      {t: 'A parallel Socket at each EdgeConnect hub peers over eBGP; subnet sharing and every BIO stay intact.', marks: ['dc']},
      {t: 'AS-path length anchors each region to its local hub; a migrated spoke is inspected at the PoP, not chained.', marks: ['backbone', 'pop']},
      {t: "The site's SSE tunnel is simply not rebuilt; Orchestrator and the SSE tenant retire after the final wave.", marks: ['branch', 'saas']},
    ],
    anchors: {saas: [302, 310], backbone: [1074, 592]},   // step-3 marker right of the SaaS cloud, clear of its subtitle
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, TL, pill, site, ring, fpin, fy, popBox, xmark} = K;
      let s = '';

      /* ---- top: the Cato PoP on the global private backbone ---- */
      const RG = {cx: 350, cy: 132, rx: 165, ry: 34};
      s += popBox(290, 14, 180, 56, 'Cato PoP', 'SPACE · FWaaS · SWG · ZTNA');
      s += ring(RG);
      s += T(196, 88, 'Global Private Backbone', 'f-s', 'middle');

      /* migrated paths into the backbone (drawn before the pin) */
      const fB = Math.round(fy(RG, 200)), fP = Math.round(fy(RG, 380)) + 2;
      s += fl(`M170 264C170 214 184 ${fB + 14} 200 ${fB - 2}`, 'fl-tun', {dur: 1.4});
      s += fl(`M380 264V${fP}`, 'fl-tun', {dur: 1.0});
      s += fpin(380, fP, 22, 'PoP', {halo: true});

      /* ---- top right: the third-party SSE, service-chained from the EC hub ---- */
      s += fl('M498 420H520Q540 420 540 400V79Q540 59 556 59', 'fl-ha', {dur: 2.0, arrow: 'arr-y'});
      s += pill(540, 204, 'service chain · GRE/IPsec', 'y');
      s += nd(556, 24, 190, 70, {t: 'Third-party SSE', s: ['Zscaler · HPE SSE tenant'], ic: 'globe', is: 22, icls: 'g', cls: 'dash'});
      s += pill(651, 112, 'retire after final wave', 'y');

      /* ---- centre: the Manchester hub — same site, new leg ---- */
      s += site(232, 236, 286, 236, 'MANCHESTER HUB');
      s += nd(262, 264, 236, 62, {t: 'Manchester hub', s: ['parallel Cato Socket', 'same site, new leg'], ic: 'cpu', is: 22, icls: 'g', cls: 'hot'});
      s += fl('M380 326V396', 'fl-net', {np: 0});
      s += pill(380, 361, 'eBGP handoff · AS-path symmetry', 'm');
      s += nd(262, 396, 236, 62, {t: 'Manchester hub', s: ['EC hub · subnet sharing'], ic: 'route', is: 22, icls: 'g'});

      /* ---- left: the migrated branch; its SSE tunnel is retired ---- */
      s += fl('M36 264V206', 'fl-down', {np: 0});
      s += xmark(36, 198);
      s += pill(96, 172, 'SSE tunnel · retired', 'r');
      s += nd(14, 264, 196, 70, {t: 'Bristol branch', s: ['Cato Socket · migrated', 'inspected at the PoP'], ic: 'building', is: 22, icls: 'g', cls: 'hot'});

      /* rollback lever: re-enable the EC spoke */
      s += fl('M150 334C150 396 214 428 258 428', 'fl-net', {np: 0, arrow: true});
      s += TL(20, 364, ['rollback: re-enable', 'the EC spoke —', 'routing reconverges'], 'f-s', 'start', 14);

      /* ---- bottom left: the legacy spoke on the EC fabric ---- */
      s += nd(14, 450, 196, 70, {t: 'Glasgow branch', s: ['EC appliance spoke', 'BIO overlays · wave 2'], ic: 'building', is: 22, icls: 'g', cls: 'dash'});
      s += fl('M210 500H400Q420 500 420 480V460', 'fl-ha', {dur: 1.8, arrow: 'arr-y'});
      s += pill(310, 500, 'EC fabric · BIO overlays', 'y');

      /* ---- right: Orchestrator, the EC control plane, retired last ---- */
      s += nd(556, 262, 190, 64, {t: 'Orchestrator', s: ['templates · preconfig YAML'], ic: 'console', is: 22, icls: 'g', cls: 'dash'});
      s += pill(651, 344, 'retire last', 'y');
      s += fl('M590 326V488Q590 508 570 508H490Q470 508 470 488V460', 'fl-net', {np: 0});
      s += TL(604, 400, ['control plane:', 'BIOs · templates'], 'f-s', 'start', 14);
      return s;
    },
    title: 'eBGP hub co-existence between Cato and an EdgeConnect fabric during migration',
    desc: "A parallel Socket at the EdgeConnect hub exchanges routes with the EC hub over eBGP and AS-path length anchors each region's traffic to its local hub; a migrated spoke is inspected at the PoP and its SSE tunnel is retired rather than rebuilt, while Orchestrator and the SSE tenant retire only after the final wave.",
    legend: [['tun', 'Migrated — Socket to the nearest PoP, one policy plane'], ['ha', 'Interim — EC fabric + SSE service chain until each wave completes'], ['down', 'Retired — SSE tunnel not rebuilt'], ['net', 'eBGP handoff, Orchestrator control plane and rollback lever'], 'live'],
  }],
});
