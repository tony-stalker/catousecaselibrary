/* specs/demo-ztna.js — Demo Segment: ZTNA */
DG.page('demo-ztna', {
  spotlight: {
    hl: ['users', 'pop', 'backbone', 'dc', 'mgmt'],
    mods: ['uztna'],
    flows: [{p: 'us1'}, {p: 'r-CR'}, {p: 'dc1', rev: true}, {p: 'm1'}],
    steps: [
      {t: 'Priya connects from two laptops; the Client evaluates the Device Posture Profile on each before any tunnel.', marks: ['users']},
      {t: 'The Client Connectivity Policy admits the compliant device; the failing one gets no tunnel, only an event.', marks: ['pop']},
      {t: 'WAN Firewall rule 1 allows Finance plus posture to the ERP application behind the London DC Socket.', marks: ['dc']},
      {t: 'The rest falls to the implicit block; the allow and the posture block are both events under her name.', marks: ['mgmt']},
    ],
    anchors: {mgmt: [782, 132]},   // step-4 marker on the CMA box's top edge, clear of its subtitle
  },
  diagrams: [{
    slot: 'main',
    draw: K => {
      const {nd, tile, site, popBox, fl, T, TL, R, I, tier, pill, mark, xmark} = K;
      let s = '';
      /* ---- section labels ---- */
      s += tier(10, 12, 'ONE IDENTITY · TWO DEVICES') + tier(280, 12, 'CONTROL PLANE');

      /* ---- the allowed path, drawn first so the gates sit on top of it ---- */
      s += fl('M172 200H606', 'fl-tun', {dur: 2.2, arrow: true, label: 'allowed', lx: 209, ly: 200, lcls: 'g keep'});

      /* ---- top: what the rules reference ---- */
      s += nd(280, 28, 260, 48, {t: 'Policy inputs', s: ['IdP groups · posture profile'], ic: 'key', is: 20, icls: 'g', cls: 'dash'});

      /* ---- left: Priya twice ---- */
      s += nd(10, 166, 162, 68, {t: 'Managed laptop', s: ['Priya · Finance group', 'posture pass'], ic: 'laptop', is: 20, icls: 'g'});
      s += mark(172, 166, 'ok');
      s += nd(10, 346, 162, 68, {t: 'Personal laptop', s: ['Priya · Finance group', 'posture fail'], ic: 'laptop', is: 20, icls: 'g'});
      s += mark(172, 346, 'no');

      /* ---- centre: the PoP, two gates ---- */
      s += popBox(246, 100, 320, 340, 'Cato PoP', 'Single-pass engine · ZTNA');

      /* gate 1: Client Connectivity Policy, spanning both devices */
      s += R(260, 170, 120, 250, 'nd', 10);
      s += I('lock', 308, 226, 24, 'ic g');
      s += TL(320, 272, ['Client', 'Connectivity', 'Policy'], 'nd-t', 'middle', 15);
      s += TL(320, 324, ['the first gate', 'posture fail', '= no tunnel'], 'nd-s', 'middle', 13);

      /* gate 2: the WAN Firewall, top-down */
      s += tier(394, 162, 'WAN FIREWALL');
      s += nd(394, 170, 160, 60, {t: 'Rule 1', s: ['Finance + posture', '→ ERP application'], ic: 'firewall', is: 20, icls: 'g'});
      s += pill(530, 170, 'Allow', 'g keep');
      s += fl('M474 230V290', 'fl-flow', {np: 0, arrow: 'arr-n'});
      s += T(466, 264, 'no match', 'f-s', 'end');
      s += nd(394, 290, 160, 60, {t: 'Implicit block', s: ['everything else'], ic: 'lock', is: 20, icls: 'g', cls: 'soft'});
      s += pill(530, 290, 'Block', 'r keep');
      s += T(474, 378, 'top-down · first match', 'f-m', 'middle');

      /* control-plane references */
      s += fl('M300 76V170', 'fl-flow fl-dim', {np: 0});
      s += fl('M500 76V170', 'fl-flow fl-dim', {np: 0});

      /* ---- the failing device stops at the PoP edge: no tunnel ---- */
      s += fl('M172 392H235', 'fl-down', {np: 0, label: 'no tunnel', lx: 209, ly: 367, lcls: 'r keep'});
      s += xmark(246, 392);

      /* ---- right: the London DC Socket and the ERP application ---- */
      s += site(596, 140, 154, 122, 'London DC');
      s += tile(606, 150, 134, 100, 'server', 'ERP application', ['behind Socket X1500']);

      /* ---- the record ---- */
      s += fl('M240 403C230 440 230 496 200 496', 'fl-down', {np: 0, arrow: 'arr-n'});
      s += nd(10, 470, 190, 52, {t: 'Monitor → Events', s: ['Client Connectivity block'], ic: 'console', is: 20, icls: 'g', cls: 'soft'});
      return s;
    },
    vb: '0 0 760 540',
    title: 'Identity and posture decide; the WAN Firewall enforces',
    desc: 'One identity on two devices: the compliant laptop passes the Client Connectivity Policy and WAN Firewall rule 1 to reach the ERP behind the London DC Socket, while the device that fails posture never gets a tunnel and leaves a block event; the implicit block sits beneath the single allow.',
    legend: [['tun', 'Identity + posture match — named allow rule'], ['down', 'Posture fails — no tunnel, Client Connectivity block event'], ['dim', 'Control plane: SCIM groups and posture profile referenced by the rules']],
  }],
});
