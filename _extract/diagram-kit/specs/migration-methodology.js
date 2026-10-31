/* specs/migration-methodology.js — Migration Methodology & Co-existence Patterns */
DG.page('migration-methodology', {
  spotlight: {
    hl: ['branch', 'dc', 'pop', 'backbone', 'mgmt'],
    mods: ['sdwan'],
    flows: [{p: 'br1'}, {p: 'dc1'}, {p: 'r-LC'}, {p: 'r-CR'}, {p: 'br2'}],
    steps: [
      {t: 'Discovery first: at each site, which device owns the routing decision — L3 switch, firewall or Socket?', marks: ['branch']},
      {t: 'One interconnect hub holds legacy CPE and a Cato Socket and carries traffic between the two networks.', marks: ['dc']},
      {t: 'Sites move in waves via the backbone; rollback is a route change — re-add the range or withdraw the prefix.', marks: ['backbone', 'mgmt']},
      {t: 'Multi-region estates run eBGP per regional hub; AS-PATH anchors each flow and its return to one hub.', marks: ['popL', 'popR']},
    ],
  },
  diagrams: [{
    /* ---- main: interconnect-hub co-existence ---- */
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, R, site, cloud, ring, fpin, pill} = K;
      const popNd = (x, y, w, h, o) => R(x, y, w, h, 'nd', 10) + nd(x, y, w, h, {...o, cls: 'pop'});   // opaque under the mint fill
      let s = '';
      const RG = {cx: 384, cy: 72, rx: 250, ry: 30};
      s += ring(RG, '');
      s += T(RG.cx, RG.cy - RG.ry - 12, 'CATO GLOBAL BACKBONE', 'tier', 'middle');
      /* geometry */
      const SX = 258, SW = 280, SY = 180, SH = 250;           // hub site boundary
      const BX = SX + 20, BW = SW - 40, BCX = BX + BW / 2;     // boxes inside the hub (278–518, cx 398)
      const LAND = BX + BW - 10;                               // where the tunnel from the PoP lands (right of the site tag)
      const SOY = 200, L3Y = 282, CPY = 364, BH = 52;
      const CX = 600, CY = 390;                                // MPLS cloud
      const RX = 575, RW = 160;                                // legacy branches column
      const LEEDS_Y = 262, MANC_Y = 170;
      const BRX = 20, BRW = 170, BRIS_Y = 150, GLAS_Y = 300;   // left column
      s += site(SX, SY, SW, SH, 'LONDON DC — INTERCONNECT HUB');
      /* base links */
      const bristolUp = `M${BRX + BRW} ${BRIS_Y + 12}C270 ${BRIS_Y + 12} 290 106 376 100`;
      const popDown = `M384 100C384 130 ${LAND} 110 ${LAND} ${SOY}`;
      s += fl(bristolUp, 'fl-tun', {np: 0});
      s += fl(popDown, 'fl-tun', {np: 0});
      s += fl(`M${BCX} ${SOY + BH}V${L3Y}`, 'fl-net', {np: 0});
      s += fl(`M${BCX} ${L3Y + BH}V${CPY}`, 'fl-net', {np: 0});
      s += fl(`M${BX + BW} ${CPY + 26}H${CX - 42}`, 'fl-net', {np: 0});
      s += fl(`M${CX} ${CY - 28}V${LEEDS_Y + 54}`, 'fl-net fl-dim', {np: 0});
      s += fl(`M${CX + 36} ${CY - 6}C752 ${CY - 6} 752 320 752 280V${MANC_Y + 40}C752 ${MANC_Y + 31} 744 ${MANC_Y + 28} ${RX + RW} ${MANC_Y + 28}`, 'fl-net fl-dim', {np: 0});
      /* Glasgow: today on MPLS (below the hub), next wave towards the PoP */
      s += fl(`M${BRX + BRW / 2} ${GLAS_Y + 54}V500H${CX}V${CY + 28}`, 'fl-net fl-dim', {np: 0, label: 'today via MPLS', lx: 380, ly: 500});
      s += fl(`M${BRX + BRW} ${GLAS_Y + 18}C240 ${GLAS_Y + 18} 236 140 250 124C262 104 320 98 372 100`, 'fl-tun fl-dim', {np: 0, label: 'next wave', lx: 224, ly: 246});
      /* highlight: Bristol → PoP → Socket → L3 switch → CPE → MPLS → Leeds (hidden where it runs under a box) */
      const hot = bristolUp + `L384 100C384 130 ${LAND} 110 ${LAND} ${SOY}V${SOY + 26}H${BCX}V${CPY + 26}H${CX}V${LEEDS_Y + 54}`;
      s += fl(hot, 'fl-hot', {dur: 4.5, n: 3, arrow: 'arr-ms', label: 'Migrated ↔ legacy via the hub', lx: 470, ly: 156});
      s += cloud(CX, CY, .7, 'MPLS', 'Legacy WAN');   // drawn over the flow so its label stays clear
      s += fpin(384, 100, 20, 'PoP', {halo: true}) + T(414, 92, 'Cato PoP', 'nd-t g');
      /* nodes */
      s += popNd(BRX, BRIS_Y, BRW, 54, {t: 'Bristol branch', s: ['Migrated · X1500']});
      s += nd(BRX, GLAS_Y, BRW, 54, {t: 'Glasgow branch', s: ['Migrating next'], cls: 'dash'});
      s += popNd(BX, SOY, BW, BH, {t: 'Cato Socket X1700', s: ['Hub interconnect'], ic: 'server', icls: 'g'});
      s += nd(BX, L3Y, BW, BH, {t: 'L3 switch', s: ['Route decision (DG)'], cls: 'hot', ic: 'switch', icls: 'g'});
      s += nd(BX, CPY, BW, BH, {t: 'Legacy CPE / router', s: ['MPLS termination'], cls: 'soft', ic: 'route'});
      s += pill(BX + BW - 48, L3Y, 'routing decision', 'y');
      s += T(SX + SW / 2 - 14, SY + SH + 22, 'routed ranges or eBGP · community 32768 isolation needs socket v15', 'f-m', 'middle');
      s += nd(RX, MANC_Y, RW, 54, {t: 'Manchester branch', s: ['192.168.4.0/24 · MPLS'], cls: 'soft'});
      s += nd(RX, LEEDS_Y, RW, 54, {t: 'Leeds branch', s: ['192.168.3.0/24 · MPLS'], cls: 'soft'});
      return s;
    },
    title: 'Interconnect hub co-existence topology',
    desc: 'During phased migration one interconnect hub holds both legacy CPE and a Cato Socket, and its L3 switch owns the routing decision, so a migrated branch still reaches a branch on legacy MPLS across the hub.',
    legend: [['hot', 'Migrated ↔ legacy traffic via the hub'], ['tun', 'Cato tunnels'], ['net', 'Existing links']],
  }, {
    /* ---- card-2: Option F, regional eBGP handoff (the second diagram-card on the page) ---- */
    slot: 'card-2',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, R, ring, fpin, xmark} = K;
      const popNd = (x, y, w, h, o) => R(x, y, w, h, 'nd', 10) + nd(x, y, w, h, {...o, cls: 'pop'});
      let s = '';
      const RG = {cx: 380, cy: 90, rx: 300, ry: 40};
      const LX = 200, SGX = 560, TIP = 126;
      s += ring(RG, '');
      s += T(RG.cx, RG.cy - RG.ry - 16, 'CATO GLOBAL BACKBONE', 'tier', 'middle');
      /* columns: Cato hubs outside, legacy hubs inside, sites beneath the hub they attach to */
      const HY = 230, LGY = 360, STY = 470, H = 56;
      const EC = [40, 180], EL = [120, 170], AC = [540, 180], AL = [470, 170];
      /* base links */
      const eBgpE = `M170 ${HY + H}C170 320 210 326 210 ${LGY}`;
      const eBgpA = `M590 ${HY + H}C590 320 550 326 550 ${LGY}`;
      s += fl(eBgpE, 'fl-net', {np: 0, label: 'eBGP', lx: 150, ly: 323, lcls: 'm'});
      s += fl(eBgpA, 'fl-net', {np: 0, label: 'eBGP', lx: 528, ly: 323, lcls: 'm'});
      s += fl(`M${EL[0] + EL[1]} 380H${AL[0]}`, 'fl-net fl-dim', {np: 0});
      s += T(380, 371, 'Legacy inter-region WAN', 'f-m', 'middle');
      s += fl(`M170 ${STY}C170 440 230 445 230 ${LGY + H}`, 'fl-net', {np: 0});
      s += fl(`M130 ${HY}C130 190 ${LX} 170 ${LX} ${TIP + 2}`, 'fl-tun', {np: 0});
      s += fl(`M630 ${HY}C630 190 ${SGX} 170 ${SGX} ${TIP + 2}`, 'fl-tun', {np: 0});
      s += fl(`M650 ${STY}V${HY + H}`, 'fl-tun', {np: 0});
      /* rejected: the cross-region return via the APAC legacy hub and the inter-region WAN */
      const bad = `M620 ${HY + H}C620 340 580 332 580 ${LGY}V398H${AL[0]}H${EL[0] + EL[1]}`;
      s += fl(bad, 'fl-down', {np: 0});
      s += xmark(380, 398);
      s += T(380, 424, 'Longer AS-PATH — not selected', 'f-m', 'middle');
      s += T(380, 438, 'asymmetric return via the APAC hub', 'f-s', 'middle');
      /* highlight: legacy site → EMEA legacy hub → EMEA Cato hub → London PoP → backbone → Singapore PoP → APAC Cato hub → migrated site */
      const hot = `M170 ${STY}C170 440 230 445 230 ${LGY + H}V388H210V${LGY}C210 326 170 320 170 ${HY + H}V258H130V${HY}C130 190 ${LX} 170 ${LX} ${TIP + 2}`
        + `L${LX} 122A${RG.rx} ${RG.ry} 0 0 0 ${SGX} 122L${SGX} ${TIP + 2}C${SGX} 170 630 190 630 ${HY}V258H650V${STY}`;
      s += fl(hot, 'fl-hot', {dur: 6, n: 4, arrow: 'arr-ms', label: 'Symmetric — anchored to its regional hub', lx: 380, ly: 196});
      /* PoPs */
      s += fpin(LX, TIP, 22, 'PoP', {halo: true}) + fpin(SGX, TIP, 22, 'PoP', {halo: true});
      s += T(LX + 14, 160, 'London PoP', 'nd-t g') + T(SGX - 14, 160, 'Singapore PoP', 'nd-t g', 'end');
      /* nodes */
      s += popNd(EC[0], HY, EC[1], H, {t: 'EMEA Cato hub site', s: ['Socket · eBGP handoff']});
      s += popNd(AC[0], HY, AC[1], H, {t: 'APAC Cato hub site', s: ['Socket · eBGP handoff']});
      s += nd(EL[0], LGY, EL[1], H, {t: 'EMEA legacy hub', s: ['FortiGate SD-WAN'], cls: 'soft'});
      s += nd(AL[0], LGY, AL[1], H, {t: 'APAC legacy hub', s: ['FortiGate SD-WAN'], cls: 'soft'});
      s += nd(40, STY, 180, H, {t: 'Legacy site', s: ['EMEA · MPLS'], cls: 'soft'});
      s += popNd(540, STY, 180, H, {t: 'Migrated site', s: ['APAC · Socket']});
      return s;
    },
    title: 'Option F — regional eBGP handoff keeps routing symmetric',
    desc: 'Each region keeps its own eBGP handoff between the Cato hub site and the legacy hub; cross-region routes carry a longer AS-PATH, so BGP best-path selection anchors traffic and its return to the same regional hub and avoids asymmetric routing.',
    legend: [['hot', 'Symmetric flow — anchored to its regional hub'], ['down', 'Cross-region return — rejected by best-path'], ['net', 'Links & eBGP peerings']],
  }],
});
