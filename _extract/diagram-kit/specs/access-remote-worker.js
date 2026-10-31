/* specs/access-remote-worker.js — Remote Worker Experience: Per-User, Per-App Assurance */
DG.page('access-remote-worker', {
  spotlight: {
    hl: ['users', 'pop', 'backbone', 'dc', 'saas', 'mgmt'],
    mods: ['uztna'],
    anchors: {mgmt: [782, 132], backbone: [1262, 528]},   // step markers clear of the CMA subtitle and the ring label
    flows: [{p: 'us1'}, {p: 'r-LC'}, {p: 'dc1', rev: true}, {p: 'eg-saas'}],
    steps: [
      {t: "Brandon's always-on Cato Client tunnels to his nearest PoP, Santa Clara; posture is checked continuously.", marks: ['users']},
      {t: 'Microsoft 365 egresses at the PoP; private applications ride the backbone to the London DC Socket.', marks: ['pop', 'dc']},
      {t: 'Client and PoP instrument every segment, so a Fair score is pinned to device, last mile, backbone or app.', marks: ['backbone']},
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

      /* last mile: encrypted Client tunnel from home to the PoP · measurement point 2 */
      s += fl('M160 230L320 230', 'fl-tun', {dur: 1.3});
      s += pill(240, 206, 'Last mile · ISP', 'keep');
      s += badge(240, 230, '2');

      /* backbone leg to the London DC Socket (tunnel along the ring front) · measurement point 3 on the ring */
      s += fl('M320 230A130 32 0 0 0 580 230C602 230 670 262 670 306', 'fl-tun', {dur: 2.2});
      s += badge(450, 262, '3');

      /* SaaS egress at the PoP: Microsoft 365 */
      s += fl('M346 178C420 130 530 96 606 96', 'fl-https', {dur: 1.4, arrow: true});

      /* the PoP pin, drawn after the flows so they meet beneath its head */
      s += fpin(320, 230, 26, 'PoP', {halo: true});
      s += T(320, 130, 'Nearest Cato PoP', 'nd-t g', 'middle') + T(320, 144, 'full inspection · egress', 'f-s', 'middle');

      /* RIGHT · two targets, measurement point 4 at each application side */
      s += cloud(670, 96, 1, 'Microsoft 365', 'SaaS · PoP egress');
      s += badge(557, 100, '4');
      s += tile(595, 306, 150, 100, 'server', 'London DC', ['Socket · private apps']);
      s += badge(670, 282, '4');

      /* BOTTOM · what Experience Monitoring scores at each point (Brandon's case: ①–③ Good, slow ④ is the app side) */
      s += tier(14, 462, 'WHERE EXPERIENCE MONITORING SCORES THE PATH');
      [['1', 'Device', 'CPU · RAM · Wi-Fi dBm', 'Good', 'g'],
       ['2', 'Last mile', 'tunnel loss · latency', 'Good', 'g'],
       ['3', 'Backbone', 'PoP to PoP', 'Good', 'g'],
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
    desc: "Because Brandon's Client, his nearest PoP and the backbone are one platform, every segment of his path is instrumented, so a Fair score can be pinned to his device, his ISP, the backbone or the application.",
    legend: [['tun', 'Encrypted tunnel — Client to nearest PoP, then backbone to each app'], ['https', 'SaaS egress at the PoP']],
  }],
});
