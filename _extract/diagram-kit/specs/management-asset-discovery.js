/* specs/management-asset-discovery.js — Asset Discovery & Device Inventory (IoT/OT) */
DG.page('management-asset-discovery', {
  spotlight: {
    hl: ['branch', 'pop', 'mgmt'],
    anchors: {mgmt: [782, 132]},   // step-3/4 marker clear of the CMA subtitle
    mods: [],
    flows: [{p: 'br1'}, {p: 'br2'}],
    steps: [
      {t: 'PLCs, cameras, printers, medical devices and BYOD kit sit behind the Socket; none can run an agent.', marks: ['branch']},
      {t: 'Each device is fingerprinted passively from its own traffic: category, type, model, OS, manufacturer.', marks: ['pop']},
      {t: 'One live Device Inventory in the CMA spans every site; identification can take up to 12 hours.', marks: ['mgmt']},
      {t: 'The same attributes become device-attribute firewall rules, or sync to a CMDB via the GraphQL API.', marks: ['mgmt']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, site, popBox, pill, socketIcon} = K;
      let s = '';
      /* LEFT — the mixed device estate behind one Socket */
      s += site(16, 44, 224, 476, 'MIXED DEVICE ESTATE');
      const devs = [
        ['PLC', 'OT controller', 'factory'],
        ['IP camera', 'Surveillance', 'cam'],
        ['Printer', 'Office endpoint', 'wifi'],
        ['Medical device', 'Clinical IoMT', 'cpu'],
        ['Badge reader', 'Access control', 'key'],
        ['BYOD laptop', 'Unmanaged', 'laptop'],
      ];
      devs.forEach(([t, sub, ic], i) => {
        const y = 70 + i * 76, cy = y + 24;
        s += nd(32, y, 160, 48, {t, s: [sub], ic});
        s += fl(`M192 ${cy}C236 ${cy} 236 281 270 281`, 'fl-net', {np: 0});
      });
      /* MIDDLE — the Socket as a passive sensor, then the PoP */
      s += socketIcon(285, 206, 90);
      s += nd(270, 244, 120, 74, {t: 'Cato Socket', s: ['Passive sensor', 'Agentless']});
      s += pill(405, 340, 'no agents · no active scans', 'm');
      s += fl('M390 281H420', 'fl-tun', {dur: 1.2, label: 'discovery', lx: 410, ly: 228});
      s += popBox(420, 244, 100, 74, 'Cato PoP', 'Cato Cloud');
      s += fl('M520 281H550', 'fl-flow', {dur: 1, arrow: 'arr-m'});
      /* RIGHT — one Device Inventory, then the two lanes out of it */
      s += nd(550, 226, 194, 110, {cls: 'pop', t: 'Device Inventory',
        s: ['Category · Type · Model', 'OS · OS version', 'Manufacturer', 'Device name', 'MAC · IP address']});
      s += fl('M600 336C600 372 496 376 496 410', 'fl-hot', {dur: 1.4, arrow: true, label: 'device group', lx: 548, ly: 372, lcls: 'g'});
      s += fl('M700 336C700 372 678 376 678 410', 'fl-net', {np: 0, arrow: 'arr-n', label: 'API export', lx: 706, ly: 372, lcls: 'm'});
      s += nd(396, 410, 200, 58, {t: 'Device-attribute rules', s: ['LAN · WAN · Internet FW'], ic: 'firewall'});
      s += nd(612, 410, 132, 58, {t: 'CMDB / ITSM', s: ['via GraphQL API'], ic: 'db'});
      return s;
    },
    title: 'Passive device discovery at the Socket feeding one Device Inventory',
    desc: 'A mixed estate of agentless devices behind a Cato Socket is discovered passively from its own traffic and classified in the Cato Cloud into one Device Inventory of category, type, model, OS, manufacturer, name, MAC and IP, which feeds device-attribute firewall policy and can export to a CMDB via the GraphQL API.',
    legend: [['hot', 'Discovered devices → device-attribute policy'], ['tun', 'Passive discovery — Socket to PoP'], ['flow', 'Classification into the inventory'], ['net', 'Device LAN traffic · API export to CMDB']],
  }],
});
