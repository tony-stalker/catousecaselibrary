/* specs/migration-journey-firewall.js — Firewall Refresh to FWaaS: Animated Phased Journey (five phase SVGs, shared geometry) */
const FW_J = (() => {
  /* ---- shared geometry: identical in every phase so the cross-fade reads as motion ---- */
  const RG = {cx: 480, cy: 70, rx: 330, ry: 34};          // Cato backbone (upper band)
  const W = 180, H = 60, LX = 24, RX = 756;               // edge columns
  const Y = {top: 160, mid: 245, bot: 330};               // node rows
  const HB = {x: 380, y: 245, w: 200, h: 60};             // Frankfurt hub (centre bridge)
  const VB = {x: 300, y: 420, w: 360, h: 56};             // NGFW vendor support & renewal (lower band)

  /* lanes (every path fixed; a phase only chooses which to draw and how) */
  const P = {
    /* enforcement up to FWaaS: site → its own point on the front of the ring */
    uBri: 'M204 178C244 178 262 140 262 99',
    uGla: 'M204 263C270 263 312 168 312 103',
    uMad: 'M204 348C300 348 362 206 362 106',
    uHub: 'M480 245V110',
    uDC: 'M756 178C716 178 698 140 698 99',
    uAws: 'M756 348C660 348 598 206 598 106',
    /* support ties: appliance → the vendor's support and renewal cycle */
    vBri: 'M204 202C300 202 340 330 350 420',
    vGla: 'M204 287C270 287 315 360 322 420',
    vMad: 'M204 372C252 372 278 448 300 448',
    vHub: 'M480 305V420',
    vDC: 'M756 202C660 202 620 330 610 420',
    vAws: 'M756 372C708 372 682 448 660 448',
  };

  /* per-edge state by phase (0–4): 'old' appliance enforcing · 'mon' FWaaS monitor-first · 'on' enforcing in FWaaS */
  const ST = {
    Bri: ['old', 'old', 'old', 'on', 'on'],
    Gla: ['old', 'old', 'old', 'on', 'on'],
    Mad: ['old', 'old', 'old', 'mon', 'on'],
    Hub: ['old', 'mon', 'on', 'on', 'on'],
    DC: ['old', 'old', 'mon', 'on', 'on'],
    Aws: ['old', 'old', 'on', 'on', 'on'],
  };

  const draw = ph => K => {
    const {nd, fl, T, pill, ring, fpin, fy, xmark, tier} = K;
    let s = '';

    /* ---- section labels ---- */
    s += tier(LX, 26, ph ? 'CATO SASE CLOUD · FWAAS' : 'NO CATO YET');
    s += tier(LX, 146, 'BRANCHES');
    s += tier(RX, 146, 'DC · CLOUD');
    s += tier(VB.x, 494, 'VENDOR SUPPORT & RENEWAL');

    /* ---- upper band: backbone ring (from phase 1) ---- */
    if (ph) s += ring(RG, '');

    /* ---- lanes: one enforcement lane per edge ---- */
    Object.keys(ST).forEach(k => {
      const st = ST[k][ph];
      /* support tie: live while the appliance enforces, dormant once signed off, retired at the end */
      if (ph === 4) s += fl(P['v' + k], 'fl-down fl-dim', {np: 0});
      else if (st === 'on') s += fl(P['v' + k], 'fl-net fl-dim', {np: 0});
      else s += fl(P['v' + k], 'fl-net', {np: 0});
      /* up to the PoP: amber while FWaaS only observes, green once it enforces */
      if (st === 'mon') s += fl(P['u' + k], 'fl-ha', {dur: 2.2, n: 2});
      if (st === 'on') s += fl(P['u' + k], 'fl-tun', {dur: 1.4, n: 2});
    });

    /* ---- PoP pin over the lanes, with its policy state ---- */
    if (ph) {
      s += fpin(RG.cx, Math.round(fy(RG, RG.cx)) + 2, 24, 'PoP', {halo: true});
      s += T(446, 62, 'Cato PoP', 'nd-t g', 'end') + T(446, 76, 'FWaaS', 'f-s', 'end');
      const head = ['', 'Monitor-first', 'One CMA rulebase', 'One CMA rulebase', 'One global policy'][ph];
      const sub = ['', 'appliances still enforce', 'forming · hub and cloud', 'converging wave by wave', 'every edge, DC and cloud'][ph];
      s += T(514, 62, head, 'nd-t g') + T(514, 76, sub, 'f-s');
    }

    /* ---- lower band: the NGFW vendor's support and renewal cycle ---- */
    const vSub = ['renewal quote due', 'renewal quote due', 'renewal quote due', 'appliances standby', 'support contract'][ph];
    const band = nd(VB.x, VB.y, VB.w, VB.h, {t: 'NGFW vendor', s: [vSub], ic: 'firewall', is: 22, cls: ph === 4 ? 'soft dash' : 'soft'});
    s += ph >= 3 ? `<g opacity="${ph === 3 ? .7 : .45}">${band}</g>` : band;
    if (ph === 4) { s += pill(VB.x + VB.w - 100, VB.y + VB.h / 2, 'renewal cancelled', 'r'); s += xmark(VB.x + VB.w - 26, VB.y + VB.h / 2); }

    /* ---- nodes (fixed boxes; only class, sub-lines and the monitor pill change) ---- */
    const node = (k, x, y, w, t, subs, ic) => {
      const st = ST[k][ph];
      let n = nd(x, y, w, H, {t, s: subs[st], ic, is: 20, icls: 'g', cls: st === 'on' ? 'pop' : st === 'mon' ? '' : 'soft'});
      if (st === 'mon') n += pill(x + w - 36, y, 'monitor', 'y');
      return n;
    };
    s += node('Bri', LX, Y.top, W, 'Bristol', {old: ['NGFW · local rules'], on: ['on FWaaS']}, 'building');
    s += node('Gla', LX, Y.mid, W, 'Glasgow', {old: ['NGFW · local rules'], on: ['on FWaaS']}, 'building');
    s += node('Mad', LX, Y.bot, W, 'Madrid', {old: ['NGFW · rules drifted'], mon: ['Socket · FWaaS monitor'], on: ['on FWaaS']}, 'building');
    s += node('Hub', HB.x, HB.y, HB.w, 'Frankfurt hub',
      {old: ['NGFW', 'regional interconnect'], mon: ['Socket · FWaaS monitor'], on: ['on FWaaS · eBGP bridge']}, 'route');
    if (ph === 1) s += pill(HB.x + 52, HB.y, 'eBGP handoff', 'g');
    s += node('DC', RX, Y.top, W, 'London DC', {old: ['HA firewall pair'], mon: ['Socket HA', 'FWaaS monitor'], on: ['FWaaS + LAN Firewall']}, 'server');
    s += node('Aws', RX, Y.bot, W, 'AWS eu-west-2', {old: ['virtual NGFW', 'own rules'], on: ['vSocket', 'same rulebase']}, 'cpu');
    return s;
  };

  const legend = [
    ['tun', 'Enforcing in FWaaS'],
    ['ha', 'Monitor-first — appliance still enforcing'],
    ['net', 'Vendor support tie (live / dormant)'],
    ['down', 'Retired — renewal cancelled'],
  ];
  const meta = [
    ['Firewall refresh to FWaaS — phase 0: Appliance estate',
      'Baseline: branches, the Frankfurt interconnect hub, the London DC and the AWS VPC each enforce on their own NGFW, all tied to the vendor\'s support and renewal cycle.'],
    ['Firewall refresh to FWaaS — phase 1: Hub bridges',
      'The Frankfurt hub takes the first Socket; its imported rules run in FWaaS in monitor mode while the appliance still enforces, and its eBGP handoff bridges the two estates.'],
    ['Firewall refresh to FWaaS — phase 2: DC & cloud',
      'Frankfurt cuts over; the London DC HA Socket starts its monitor run beside the firewall pair and AWS eu-west-2 lands a vSocket on the same forming CMA rulebase.'],
    ['Firewall refresh to FWaaS — phase 3: Branch waves',
      'Bristol and Glasgow cut enforcement to FWaaS, the DC splits internet and WAN policy to FWaaS and east-west to LAN Firewall, and Madrid starts its monitor run; signed-off appliances drop to standby.'],
    ['Firewall refresh to FWaaS — phase 4: Renewal cancelled',
      'Madrid\'s monitor run signs off; every edge, DC and cloud enforces one rulebase in the PoP, the renewal is cancelled and the hardware is removed.'],
  ];
  return meta.map(([title, desc], ph) => ({slot: 'phase-' + (ph + 1), vb: '0 0 960 500', draw: draw(ph), title, desc, legend}));
})();

DG.page('migration-journey-firewall', {
  spotlight: {
    hl: ['branch', 'dc', 'cloud', 'pop', 'mgmt'],
    mods: ['sse'],
    flows: [{p: 'br1'}, {p: 'br2'}, {p: 'dc1'}, {p: 'cl-aws'}, {p: 'm1'}],
    steps: [
      {t: 'The Frankfurt interconnect hub takes the first Socket; its imported rules run in FWaaS in monitor mode.', marks: ['dc']},
      {t: 'The London DC HA Socket and an AWS vSocket join; cloud egress moves onto the forming CMA rulebase.', marks: ['dc', 'cloud']},
      {t: 'Branches cut enforcement to FWaaS in waves; signed-off appliances drop to powered-on standby.', marks: ['branch']},
      {t: 'Madrid signs off and the renewal is cancelled: one global policy for every edge, enforced in the PoP.', marks: ['pop']},
    ],
  },
  diagrams: FW_J,
  picSlot: 'phase-5',
});
