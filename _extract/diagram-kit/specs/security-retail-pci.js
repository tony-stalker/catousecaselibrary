/* specs/security-retail-pci.js — Retail Store Networks & PCI DSS 4.0 */
DG.page('security-retail-pci', {
  spotlight: {
    hl: ['branch', 'pop', 'backbone', 'saas', 'mgmt'],
    mods: ['sdwan', 'sse'],
    flows: [{p: 'br1'}, {p: 'br2'}, {p: 'eg-saas'}, {p: 'eg-www'}, {p: 'm1'}],
    steps: [
      {t: 'Each store runs one zero-touch Socket; its LAN firewall keeps POS apart from guest, staff and IoT.', marks: ['branch']},
      {t: 'Broadband carries the store to the nearest PoP; LTE/5G stands by so the tills keep authorising.', marks: ['popL']},
      {t: 'Only the POS VLAN reaches the payment processor; guest and IoT get internet-only breakout.', marks: ['saas']},
      {t: 'One policy for every store, with events and the Audit Trail as the assessor evidence pack.', marks: ['mgmt']},
    ],
    anchors: {mgmt: [782, 132], saas: [302, 310]},   // markers clear of the CMA and "Smart egress" subtitles
  },
  diagrams: [{
    slot: 'main',
    draw: K => {
      const {nd, fl, T, L, fpin, ring, site, pill, xmark, tier} = K;
      let s = '';
      /* ---- tiers ---- */
      s += tier(360, 40, 'CATO SASE CLOUD') + tier(574, 40, 'WHERE THE TRAFFIC GOES');
      /* ---- left: one store, segmented at the Socket ---- */
      s += site(14, 56, 322, 384, 'STORE 0412 · ONE OF HUNDREDS');
      /* the four VLANs */
      s += nd(30, 86, 150, 46, {t: 'POS / CDE VLAN', s: ['tills · payment devices'], cls: 'hot'});
      s += nd(30, 160, 150, 46, {t: 'Guest Wi-Fi VLAN', s: ['captive portal']});
      s += nd(30, 234, 150, 46, {t: 'Staff Wi-Fi VLAN', s: ['corporate SSID']});
      s += nd(30, 308, 150, 46, {t: 'Cameras & IoT', s: ['CCTV · signage · sensors']});
      /* the Socket is the gateway for every VLAN: the LAN firewall sits here */
      s += fl('M180 183C196 183 194 214 206 214', 'fl-lan', {np: 0});
      s += fl('M180 257C196 257 194 226 206 226', 'fl-lan', {np: 0});
      s += fl('M180 331C200 331 192 232 206 232', 'fl-lan', {np: 0});
      s += fl('M180 109C200 109 192 208 206 208', 'fl-hot', {dur: 1.2});
      s += nd(206, 174, 116, 76, {t: 'Cato Socket', s: ['zero-touch install', 'one per store'], cls: 'hot'});
      s += pill(264, 174, 'LAN firewall', 'g keep');
      /* east-west: guest → POS is decided, and blocked, on the Socket */
      s += fl('M60 160L60 132', 'fl-walk fl-down', {dur: 1.2, pcls: 'pt red'}) + xmark(60, 146);
      s += pill(112, 146, 'Block', 'r keep');
      s += T(22, 462, 'Same VLAN plan, same policy — repeated across the estate', 'f-m', 'start');
      /* ---- centre: the PoP on the backbone; two WAN links from the Socket ---- */
      const RG = {cx: 460, cy: 250, rx: 98, ry: 26};
      s += ring(RG) + T(404, 302, 'Global private backbone', 'f-s', 'middle');
      s += fl('M322 196C370 196 404 206 438 212', 'fl-tun', {dur: 1.3, label: 'Broadband · primary', lx: 404, ly: 178, lcls: 'g keep'});
      s += fl('M322 230C370 236 404 234 438 226', 'fl-ha', {np: 0, arrow: 'arr-y', label: 'LTE / 5G · standby', lx: 412, ly: 322, lcls: 'y keep'});
      /* from the PoP: cardholder path, restricted internet breakout, and the evidence lane */
      s += fl('M484 212C530 196 540 140 574 124', 'fl-hot', {dur: 1.2, arrow: 'arr-m', label: 'cardholder path', lx: 540, ly: 174, lcls: 'g keep'});
      s += fl('M486 226C520 236 540 250 574 252', 'fl-flow', {dur: 1.1, arrow: 'arr-m'});
      s += fl('M470 284C500 330 540 372 574 388', 'fl-sig', {dur: 1.2, arrow: 'arr-m', label: 'events · audit trail', lx: 500, ly: 350, lcls: 'keep'});
      /* the PoP itself, on top of the flows */
      s += fpin(460, 262, 26, 'PoP', {halo: true});
      s += T(460, 110, 'Nearest Cato PoP', 'nd-t g', 'middle');
      s += pill(460, 130, 'FWaaS · IPS · always current', 'g keep');
      /* ---- right: destinations ---- */
      s += nd(574, 98, 172, 52, {t: 'Payment processor', s: ['acquirer / gateway'], ic: 'lock', is: 20, icls: 'g'});
      s += nd(574, 226, 172, 52, {t: 'Internet & SaaS', s: ['guest breakout · updates'], ic: 'globe', is: 20, icls: 'g'});
      s += nd(574, 356, 172, 66, {t: 'Cato CMA', s: ['one policy · every store', 'events · audit trail'], ic: 'console', is: 20, icls: 'g', cls: 'pop'});
      return s;
    },
    vb: '0 0 760 480',
    title: 'Segmented retail store connected through a Cato PoP',
    desc: 'A store’s four VLANs sit behind one zero-touch Socket whose LAN firewall blocks guest traffic into the POS VLAN; broadband with LTE/5G standby carries the store to the nearest PoP, where only the POS VLAN reaches the payment processor, guest and IoT get internet-only breakout, and the CMA holds one policy and the audit evidence for every store.',
    legend: [['hot', 'Cardholder data path — POS to processor'], ['flow', 'Restricted — internet only'], ['tun', 'Broadband — primary tunnel to the PoP'], ['ha', 'LTE / 5G — standby until broadband fails'], ['down', 'Blocked — lateral movement into POS VLAN'], 'live'],
  }],
});
