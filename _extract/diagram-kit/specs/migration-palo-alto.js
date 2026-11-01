/* specs/migration-palo-alto.js — Palo Alto (NGFW & Prisma Access) to Cato */
DG.page('migration-palo-alto', {
  spotlight: {
    hl: ['branch', 'dc', 'users', 'pop', 'backbone', 'saas'],
    mods: ['sdwan', 'sse', 'uztna'],
    flows: [{p: 'br1'}, {p: 'dc1'}, {p: 'us1'}, {p: 'r-LC'}, {p: 'eg-www'}],
    steps: [
      {t: 'The Socket installs in parallel; the PA firewall stays default gateway while subnets hand off per prefix.', marks: ['branch', 'dc']},
      {t: 'Migrated subnets reach the internet and other Cato sites through the PoP; the rest keeps its PA route.', marks: ['pop']},
      {t: 'GlobalProtect cohorts move to the Cato Client wave by wave; rollback is a route withdrawal.', marks: ['users']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, site, ring, fpin, fy, cloud, tier, popBox} = K;
      let s = '';

      /* ---- top centre: the Cato PoP on the global private backbone ---- */
      const RG = {cx: 450, cy: 124, rx: 120, ry: 32};
      s += tier(360, 22, 'CATO SASE CLOUD');
      s += popBox(360, 30, 180, 50, 'Cato PoP', 'FWaaS · IPS · TLSi · SWG');
      s += ring(RG);
      s += T(424, 184, 'Global Private Backbone', 'f-m', 'end');

      /* ---- left: the site — PA stays default gateway, Socket in parallel ---- */
      s += site(14, 60, 232, 230, 'BRANCH / DC SITE');
      s += nd(28, 84, 204, 56, {t: 'Cato Socket', s: ['installed in parallel'], ic: 'switch', is: 20, icls: 'g', cls: 'hot'});
      s += fl('M130 140V156M130 202V212', 'fl-net', {np: 0});
      s += pill(130, 166, 'eBGP / static handoff', 'm keep');
      s += T(130, 194, 'over LAN transit VLAN', 'f-s', 'middle');
      s += nd(28, 212, 204, 56, {t: 'PA firewall (HA)', s: ['default gateway — today'], ic: 'firewall', is: 20, icls: 'g', cls: 'dash'});

      /* Socket → PoP: migrated subnets (drawn before the pin so it ends under it) */
      const sY = Math.round(fy(RG, 390));
      s += fl(`M232 112C320 112 350 ${sY - 4} 388 ${sY - 2}`, 'fl-tun', {dur: 1.3, label: 'migrated subnets', lx: 296, ly: 92, lcls: 'g keep'});

      /* ---- bottom left: the legacy WAN the PA still routes to ---- */
      s += fl('M110 268V424', 'fl-ha', {dur: 1.4, label: 'default route', lx: 110, ly: 330, lcls: 'y keep'});
      s += cloud(124, 462, 1.3, 'Legacy WAN', 'MPLS · Internet · GP VPN');

      /* ---- top right: direct breakout from the PoP ---- */
      s += fl('M568 112C596 100 604 90 616 80', 'fl-flow', {dur: 1.1, arrow: 'arr-m'});
      s += cloud(678, 64, 1.25, 'Internet & SaaS', 'direct PoP breakout');

      /* ---- right: the interconnect hub bridging the two islands ---- */
      const hY = Math.round(fy(RG, 520));
      s += fl(`M660 226C660 190 590 ${hY + 6} 524 ${hY - 2}`, 'fl-tun', {dur: 1.3});
      s += nd(576, 226, 170, 66, {t: 'Interconnect hub', s: ['Socket + legacy CPE', 'bridges Cato ↔ legacy'], ic: 'route', is: 20, icls: 'g'});
      s += fl('M724 292V512C724 526 712 534 698 534H196C182 534 176 524 172 500', 'fl-ha', {np: 0});

      /* ---- bottom: the two user cohorts, migrating left to right ---- */
      s += tier(262, 384, 'USERS');
      s += nd(262, 394, 170, 56, {t: 'GlobalProtect cohort', s: ['being retired in waves'], ic: 'users', is: 20, icls: 'g', cls: 'dash'});
      s += fl('M262 422C210 422 196 330 196 272', 'fl-ha', {dur: 1.4, arrow: 'arr-y', label: 'GP VPN → PA gateway', lx: 262, ly: 336, lcls: 'y keep'});
      s += fl('M434 422H512', 'fl-net', {np: 0, arrow: 'arr-n'});
      s += T(474, 468, 'users migrate in waves →', 'f-s', 'middle');
      s += nd(516, 394, 170, 56, {t: 'Cato Client cohort', s: ['SDP · target state'], ic: 'users', is: 20, icls: 'g', cls: 'hot'});
      const cY = Math.round(fy(RG, 450));
      s += fl(`M580 394C580 300 456 250 451 ${cY + 4}`, 'fl-tun', {dur: 1.3});

      /* the PoP pin on the front of the ring */
      s += fpin(450, cY + 2, 22, 'PoP', {halo: true});
      return s;
    },
    title: 'Phased co-existence of a Palo Alto firewall and a Cato Socket',
    desc: 'The PA firewall stays default gateway while a parallel Socket takes migrated subnets per prefix over an eBGP or static handoff on a LAN transit VLAN; an interconnect hub keeps the legacy and Cato islands talking and GlobalProtect cohorts move to the Cato Client in waves.',
    legend: [['tun', 'Cato path — migrated subnets & users'], ['flow', 'Direct PoP breakout'], ['ha', 'Legacy path via the PA — interim, retired at cutover'], 'live'],
  }],
});
