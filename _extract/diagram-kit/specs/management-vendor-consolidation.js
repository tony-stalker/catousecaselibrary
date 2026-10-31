/* specs/management-vendor-consolidation.js — Vendor Consolidation & Network TCO */
DG.page('management-vendor-consolidation', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'backbone', 'mgmt'],
    anchors: {mgmt: [782, 132], backbone: [1230, 590]},   // mgmt: clear of 'Terraform & API'; backbone: below the ring text
    mods: ['sdwan', 'sse', 'uztna'],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'r-LC'}, {p: 'm1'}, {p: 'm2'}],
    steps: [
      {t: 'MPLS, routers, firewalls, VPN concentrators, SWG, CASB/DLP, an SD-WAN overlay: seven families, seven consoles.', marks: ['branch']},
      {t: 'Every flow is inspected once, in a single pass, at the nearest PoP; SD-WAN and security converge there.', marks: ['pop']},
      {t: 'The backbone replaces MPLS, a Socket replaces router plus firewall, the Client replaces the VPN concentrator.', marks: ['backbone', 'branch', 'users']},
      {t: 'Network and security are configured, monitored and audited in one console, the CMA.', marks: ['mgmt']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, popBox, ring, pill, tier, T} = K;
      let s = '';
      /* LEFT — the seven product families the estate retires (dashed = retired, not blocked) */
      s += tier(16, 36, 'WHAT YOU RETIRE');
      const retired = [
        ['MPLS circuits', 'per-site carriage'],
        ['Edge routers', 'refresh & config drift'],
        ['Branch firewalls', 'patch & EOL treadmill'],
        ['VPN concentrators', 'remote-access head-end'],
        ['SWG / web proxy', 'own licence & console'],
        ['CASB / DLP add-ons', 'point-product bolt-ons'],
        ['SD-WAN overlay', 'another vendor & console'],
      ];
      const PX = 290, PY = 246, PW = 180, PH = 66;          // the PoP box
      /* CENTRE — the ring first, so the converging lines and the PoP box sit on top of it */
      const RG = {cx: 380, cy: 279, rx: 150, ry: 62};      // holds the whole PoP box inside the ring
      s += ring(RG);
      retired.forEach(([t, sub], i) => {
        const y = 52 + i * 66, cy = y + 24, ty = PY + 6 + i * 9;
        s += `<g style="stroke-dasharray:5 4">${nd(16, y, 170, 48, {t, s: [sub], cls: 'dash'})}</g>`;   // .nd.dash is not in the ported CSS; dash inline
        s += fl(`M186 ${cy}C246 ${cy} 250 ${ty} ${PX} ${ty}`, 'fl-net fl-dim', {np: 0, arrow: 'arr-n'});
      });
      /* CENTRE — one PoP on the global private backbone */
      s += T(380, 372, 'Global Private Backbone', 'nd-t g', 'middle');
      s += popBox(PX, PY, PW, PH, 'Cato PoP', 'SD-WAN + security — one pass');
      s += pill(380, 398, 'seven product families → one single pass', 'g');
      /* RIGHT — what remains to own and operate */
      s += tier(552, 36, 'WHAT YOU RUN INSTEAD');
      s += nd(552, 118, 192, 58, {t: 'Cato Socket', s: ['replaces router + firewall'], ic: 'building'});
      s += nd(552, 250, 192, 58, {t: 'Cato Client', s: ['replaces VPN concentrator'], ic: 'laptop'});
      s += nd(552, 388, 192, 58, {cls: 'pop', t: 'CMA — one console', s: ['all policy, one audit trail'], ic: 'console'});
      s += fl(`M${PX + PW} 262C500 262 500 147 552 147`, 'fl-tun', {dur: 1.3});
      s += fl(`M${PX + PW} 279C500 279 500 279 552 279`, 'fl-tun', {dur: 1.3});
      s += fl(`M${PX + PW} 296C500 296 500 417 552 417`, 'fl-flow', {dur: 1.6, arrow: true,
        label: 'policy · analytics · audit', lx: 592, ly: 348});   // between Client and CMA, beside the curve's descent
      return s;
    },
    title: 'The appliance estate collapses into the Cato platform',
    desc: 'Seven legacy product families — MPLS circuits, edge routers, branch firewalls, VPN concentrators, an SWG proxy, CASB/DLP add-ons and an SD-WAN overlay — converge into a single pass at the Cato PoP on the global private backbone, leaving a Socket at the branch, the Client on the device and the CMA as the one console.',
    legend: [['net', 'Retired — absorbed into the PoP'], ['tun', 'What remains: Socket and Client'], ['flow', 'One console — policy, analytics, audit'], 'live'],
  }],
});
