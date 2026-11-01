/* specs/security-healthcare-nhs.js — UK Healthcare: NHS DSPT & CAF-Aligned SASE */
DG.page('security-healthcare-nhs', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'saas', 'mgmt'],
    mods: ['sdwan', 'sse', 'uztna'],
    flows: [{p: 'br1'}, {p: 'br2'}, {p: 'br3'}, {p: 'us1'}, {p: 'us2'}, {p: 'eg-saas'}, {p: 'm1'}],
    steps: [
      {t: 'An acute hospital, a community clinic, a GP-style site and remote clinicians all cross one UK PoP.', marks: ['branch', 'users']},
      {t: 'Inside the hospital the LAN Firewall on the Socket blocks IoMT-to-corporate traffic, even if the circuit drops.', marks: ['branch']},
      {t: 'The PoP enforces FWaaS, IPS, ZTNA and DLP on the way to NHS Spine, M365 and SaaS.', marks: ['pop', 'saas']},
      {t: 'A pathology supplier reaches only named systems over ZTNA; policy, events and devices feed the CMA.', marks: ['users', 'mgmt']},
    ],
    anchors: {mgmt: [782, 132], saas: [302, 310]},   // markers clear of the CMA and "Smart egress" subtitles
  },
  diagrams: [{
    slot: 'main',
    draw: K => {
      const {nd, fl, T, L, fpin, ring, site, sock, pill, xmark, tier, cloud} = K;
      let s = '';
      /* ---- tiers ---- */
      s += tier(300, 40, 'ONE POLICY · ENFORCED AT THE PoP') + tier(574, 40, 'SERVICES · SUPPLIER · CMA');
      /* ---- left: the acute hospital, segmented at the Socket ---- */
      s += site(14, 56, 252, 270, 'ACUTE HOSPITAL');
      s += sock(44, 84, 'Socket');
      s += pill(139, 84, 'LAN Firewall', 'g keep');
      /* the Socket is the gateway for every VLAN */
      s += fl('M60 130L60 138L32 138L32 285', 'fl-lan', {np: 0});
      s += fl(L(32, 169, 44, 169), 'fl-lan', {np: 0}) + fl(L(32, 227, 44, 227), 'fl-lan', {np: 0}) + fl(L(32, 285, 44, 285), 'fl-lan', {np: 0});
      s += nd(44, 146, 160, 46, {t: 'Clinical VLAN', s: ['EPR · PACS · pathology']});
      s += nd(44, 204, 160, 46, {t: 'IoMT VLAN', s: ['pumps · imaging · legacy']});
      s += nd(44, 262, 160, 46, {t: 'Corporate VLAN', s: ['admin · back office']});
      /* east-west: IoMT → Corporate is decided, and blocked, in the Socket */
      s += fl('M204 227C250 227 250 285 204 285', 'fl-walk fl-down', {dur: 1.4, pcls: 'pt red'}) + xmark(238, 256);
      s += pill(240, 304, 'Block', 'r keep');
      /* ---- left, below: community, primary care and remote clinicians ---- */
      s += nd(14, 338, 190, 54, {t: 'Community clinic', s: ['X1600 · broadband + LTE'], ic: 'building', is: 20, icls: 'g'});
      s += nd(14, 404, 190, 54, {t: 'GP-style small site', s: ['Socket · broadband'], ic: 'building', is: 20, icls: 'g'});
      s += nd(14, 470, 190, 54, {t: 'Remote clinicians', s: ['Cato Client · MFA'], ic: 'users', is: 20, icls: 'g'});
      /* ---- centre: the UK PoP on the backbone ---- */
      const RG = {cx: 460, cy: 250, rx: 100, ry: 30};
      s += ring(RG) + T(600, 306, 'Global Private Backbone', 'f-s', 'middle');
      /* site tunnels and client paths onto the PoP */
      s += fl('M234 107C330 107 380 220 434 224', 'fl-tun', {dur: 1.4});
      s += fl('M204 352C300 352 360 262 436 252', 'fl-tun', {dur: 1.3});
      s += fl('M204 378C310 378 372 272 440 258', 'fl-ha', {np: 0, arrow: 'arr-y'}) + pill(250, 377, 'LTE', 'y keep');
      s += fl('M204 431C320 431 380 270 444 262', 'fl-tun', {dur: 1.3});
      s += fl('M204 497C330 497 400 290 452 272', 'fl-tun', {dur: 1.3});
      /* supplier: ZTNA to the PoP, then only the named clinical systems */
      s += fl('M576 259C540 259 516 238 482 234', 'fl-hot', {dur: 1});
      s += fl('M436 230C360 230 300 169 204 169', 'fl-hot', {dur: 1.6, arrow: 'arr-m', label: 'named systems only', lx: 270, ly: 198, lcls: 'g keep'});
      /* egress to NHS and cloud services; the evidence lane into the CMA */
      s += fl('M484 226C560 220 620 190 648 146', 'fl-flow', {dur: 1, arrow: 'arr-m'});
      s += fl('M500 282C520 340 580 380 622 420', 'fl-net', {dur: 1.2, arrow: 'arr-n'});
      /* the PoP itself, on top of the flows */
      s += fpin(460, 262, 26, 'PoP', {halo: true});
      s += T(460, 162, 'Cato PoP — UK', 'nd-t g', 'middle');
      s += pill(460, 181, 'FWaaS · IPS · ZTNA · DLP', 'g keep');
      /* ---- right: destinations, the supplier and the evidence ---- */
      s += cloud(660, 100, 1.3, 'NHS & cloud services', 'Spine · M365 · SaaS');
      s += nd(576, 232, 172, 54, {t: 'Pathology supplier', s: ['ZTNA · least privilege'], ic: 'user', is: 20, icls: 'g'});
      s += nd(574, 420, 172, 72, {t: 'CMA — evidence', s: ['policy · events · devices', 'Audit Trail exports'], ic: 'console', is: 20, icls: 'g', cls: 'pop'});
      return s;
    },
    vb: '0 0 760 560',
    title: 'A segmented NHS-style trust estate',
    desc: 'An acute hospital with clinical, IoMT and corporate VLANs behind a Socket running the LAN Firewall, a community clinic, a GP-style site and remote clinicians all cross one UK Cato PoP to NHS and cloud services; IoMT-to-corporate traffic is blocked on the Socket, a pathology supplier reaches only named systems over ZTNA, and an evidence lane feeds the CMA.',
    legend: [['tun', 'Trust estate and remote clinicians (Cato Client) — one policy at the PoP'], ['hot', 'Supplier ZTNA — named systems only'], ['down', 'East-west blocked by LAN Firewall on the Socket'], ['ha', 'LTE fallback'], ['net', 'Evidence lane to the CMA'], 'live'],
  }],
});
