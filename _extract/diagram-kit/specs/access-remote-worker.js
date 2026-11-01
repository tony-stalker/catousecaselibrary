/* specs/access-remote-worker.js — Remote Worker Experience: Per-User, Per-App Assurance */
DG.page('access-remote-worker', {
  spotlight: {
    hl: ['users', 'pop', 'backbone', 'dc', 'saas', 'mgmt'],
    mods: ['uztna'],
    anchors: {mgmt: [782, 132]},   // step marker clear of the CMA subtitle
    flows: [{p: 'us1'}, {p: 'r-LC'}, {p: 'dc1', rev: true}, {p: 'eg-saas'}],
    steps: [
      {t: "Brandon's always-on Cato Client tunnels to his nearest PoP, Santa Clara; posture is checked continuously.", marks: ['users']},
      {t: 'Microsoft 365 egresses at the PoP; private applications ride the backbone to the datacentre Socket.', marks: ['pop', 'dc']},
      {t: 'The Client scores each node, so a Fair score is pinned to device, Wi-Fi, LAN gateway, last mile or app.', marks: ['users']},
      {t: 'Experience Monitoring in the CMA shows per-user, per-app scores before the ticket is raised.', marks: ['mgmt']},
    ],
  },
  diagrams: [{
    slot: 'main',
    draw: K => {
      const {nd, tile, fl, fpin, ring, cloud, pill, badge, tier, T, R, I} = K;
      let s = '';
      /* section labels */
      s += tier(14, 12, 'REMOTE WORKER · HOME') + tier(300, 12, 'CATO SASE CLOUD') + tier(596, 12, 'APPLICATIONS');

      /* LEFT · Brandon at home: laptop + Wi-Fi, always-on Client · measurement point 1 */
      s += tile(10, 180, 150, 100, 'laptop', 'Brandon · home', ['Cato Client · always-on'], {ic2: 'wifi'});
      s += badge(160, 180, '1');

      /* CENTRE · the backbone ring with the nearest PoP on its left end */
      const RG = {cx: 450, cy: 230, rx: 130, ry: 32};
      s += ring(RG);
      s += T(450, 292, 'Global Private Backbone', 'f-h', 'middle');

      /* home LAN gateway (point 2), then the last mile: encrypted Client tunnel from home to the PoP (point 3) */
      s += fl('M160 230L320 230', 'fl-tun', {dur: 1.3});
      s += badge(192, 230, '2') + T(192, 212, 'LAN gateway', 'f-s', 'middle');
      s += pill(262, 254, 'Last mile · ISP', 'keep');
      s += badge(262, 230, '3');

      /* backbone leg to the datacentre Socket (tunnel along the ring front) */
      s += fl('M320 230A130 32 0 0 0 580 230C602 230 670 262 670 306', 'fl-tun', {dur: 2.2});

      /* SaaS egress at the PoP: Microsoft 365 */
      s += fl('M346 178C420 130 530 96 606 96', 'fl-https', {dur: 1.4, arrow: true});

      /* the PoP pin, drawn after the flows so they meet beneath its head */
      s += fpin(320, 230, 26, 'PoP', {halo: true});
      s += T(320, 130, 'Nearest Cato PoP', 'nd-t g', 'middle') + T(320, 144, 'full inspection · egress', 'f-s', 'middle');

      /* RIGHT · two targets, measurement point 4 at each application side */
      s += cloud(670, 96, 1, 'Microsoft 365', 'SaaS · PoP egress');
      s += badge(557, 100, '4');
      s += tile(595, 306, 150, 100, 'server', 'Datacentre', ['Socket · private apps']);
      s += badge(670, 282, '4');

      /* BOTTOM · the Connection Details nodes Experience Monitoring scores (Brandon's case: ①–③ Good, slow ④ is the app side) */
      s += tier(14, 462, 'WHERE EXPERIENCE MONITORING SCORES THE PATH');
      [['1', 'Device', 'CPU · RAM · Wi-Fi dBm', 'Good', 'g'],
       ['2', 'LAN gateway', 'loss · latency', 'Good', 'g'],
       ['3', 'Last mile', 'tunnel loss · latency', 'Good', 'g'],
       ['4', 'App side', 'TTFB · TCP · TLS', 'Fair', 'y']].forEach(([n, t, sub, v, c], i) => {
        const x = 14 + i * 184, y = 474;
        s += R(x, y, 176, 50, 'nd soft', 10) + badge(x + 20, y + 25, n);
        s += T(x + 40, y + 21, t, 'nd-t') + T(x + 40, y + 37, sub, 'f-m');
        s += pill(x + 150, y + 15, v, c + ' keep');
      });
      return s;
    },
    vb: '0 0 760 560',
    title: "Where a remote worker's experience is measured",
    desc: "Because Brandon's Client, his nearest PoP and the backbone are one platform, every node of his path is scored, so a Fair score can be pinned to his device, Wi-Fi, LAN gateway, last mile or the application.",
    legend: [['tun', 'Encrypted tunnel — Client to nearest PoP, then backbone to each app'], ['https', 'SaaS egress at the PoP']],
  }],
});
