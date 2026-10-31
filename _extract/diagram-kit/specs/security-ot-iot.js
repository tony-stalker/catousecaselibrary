/* specs/security-ot-iot.js — Manufacturing OT/IoT Device Security */
DG.page('security-ot-iot', {
  spotlight: {
    hl: ['branch', 'pop', 'users', 'mgmt'],
    mods: ['sse', 'uztna'],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'm1'}],
    steps: [
      {t: 'The Socket passively discovers every plant device: category, type, model, OS and manufacturer; no agents.', marks: ['branch']},
      {t: 'Its LAN firewall enforces micro-segmentation between Purdue levels on the plant floor itself.', marks: ['branch']},
      {t: 'WAN and internet policy is enforced at the PoP: a PLC dialling out to the internet is dropped.', marks: ['pop']},
      {t: 'A maintenance vendor reaches only the jump server over ZTNA; every allow and block is an event in the CMA.', marks: ['users', 'mgmt']},
    ],
    anchors: {mgmt: [782, 132]},   // step-4 marker on the CMA top edge, clear of the 'Terraform & API' subtitle
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 600',
    draw: K => {
      const {nd, fl, R, T, I, tier, fpin, pill, xmark, socketIcon} = K;
      let s = '';
      /* ---- top strip: the remote vendor and the Cato PoP ---- */
      s += tier(20, 14, 'OUTSIDE THE PLANT');
      s += nd(20, 30, 196, 48, {t: 'Maintenance vendor', s: ['Remote user · ZTNA'], ic: 'user', icls: 'g'});
      s += fl('M216 54H642', 'fl-https', {dur: 2.2, label: 'identity-driven ZTNA', lx: 429, ly: 54});
      s += fpin(670, 96, 24, 'PoP', {halo: true});
      s += T(634, 31, 'Cato PoP', 'nd-t g', 'end') + T(634, 44, 'Internet · WAN · FWaaS · IPS', 'f-s', 'end');
      s += fl('M670 96V118', 'fl-tun', {np: 0});

      /* ---- the four Purdue bands ---- */
      const bands = [
        [118, 96, 'LEVEL 4/5', 'Enterprise · IT'],
        [240, 96, 'LEVEL 3', 'Operations'],
        [346, 96, 'LEVEL 2', 'Control'],
        [452, 130, 'LEVEL 0/1', 'Process'],
      ];
      bands.forEach(([y, h, lv, nm]) => {
        s += R(20, y, 560, h, 'nd soft', 12);
        s += tier(34, y + 24, lv) + T(34, y + 42, nm, 'nd-t');
      });
      /* IT / OT boundary between Enterprise and Operations */
      s += fl('M20 229H580', 'fl-down', {np: 0});
      s += T(420, 225, 'IT / OT BOUNDARY — ENFORCED BY CATO', 'tier', 'middle');

      /* ---- nodes: left column and right column (next to the Socket) ---- */
      const NY = [142, 264, 370, 492];
      s += nd(140, NY[0], 170, 48, {t: 'Enterprise apps', s: ['ERP · email · SaaS'], ic: 'console', icls: 'g'});
      s += nd(380, NY[0], 170, 48, {t: 'IT users', s: ['Corporate LAN'], ic: 'users', icls: 'g'});
      s += nd(140, NY[1], 170, 48, {t: 'Historian', s: ['Process data store'], ic: 'db', icls: 'g'});
      s += nd(380, NY[1], 170, 48, {t: 'Jump server', s: ['Vendor access only'], ic: 'server', icls: 'g'});
      s += nd(140, NY[2], 170, 48, {t: 'SCADA servers', s: ['Supervisory control'], ic: 'console', icls: 'g'});
      s += nd(380, NY[2], 170, 48, {t: 'HMI', s: ['Operator stations'], ic: 'laptop', icls: 'g'});
      s += nd(140, NY[3], 170, 48, {t: 'Field devices', s: ['Level 0 instrumentation'], ic: 'cell', icls: 'g'});
      s += nd(380, NY[3], 170, 48, {t: 'PLC', s: ['Siemens S7-300'], ic: 'factory', icls: 'g'});

      /* ---- allowed within a level (no direction implied) ---- */
      NY.forEach((y, i) => { s += fl(`M310 ${y + 24}H380`, 'fl-walk', {dur: 1.2}); });
      s += pill(345, 202, 'allowed within level', 'g');
      /* ---- the one IT/OT allow the page names: historian northbound to enterprise apps ---- */
      s += fl('M225 264V190', 'fl-walk', {dur: 1.4, arrow: 'arr-m'});
      s += pill(225, 252, 'historian → ERP · allowed', 'g');

      /* ---- the Cato Socket: LAN firewall spanning every band ---- */
      s += R(596, 118, 150, 464, 'nd hot', 14);
      s += socketIcon(621, 134, 100);
      s += T(671, 178, 'Cato Socket', 'nd-t', 'middle');
      s += T(671, 192, 'on the plant floor', 'nd-s', 'middle');
      s += pill(671, 218, 'LAN Firewall', 'g');
      s += pill(671, 244, 'micro-segmentation', '');
      s += pill(671, 270, 'device-attribute rules', '');
      s += T(671, 318, 'Every cross-level flow', 'f-s', 'middle') + T(671, 331, 'must match a rule', 'f-s', 'middle');
      s += T(671, 440, 'Every allow and block', 'f-s', 'middle') + T(671, 453, 'is an event in the CMA', 'f-s', 'middle');
      s += T(671, 548, 'WAN · internet policy', 'f-s', 'middle') + T(671, 561, 'enforced at the PoP', 'f-s', 'middle');

      /* ---- vendor: jump server only, control layer blocked ---- */
      s += fl('M596 288H550', 'fl-https', {dur: 1.2, arrow: 'arr-m'});
      s += pill(470, 252, 'vendor → jump server only', '');
      s += fl('M596 382H552', 'fl-down', {np: 0}) + xmark(572, 382);
      s += pill(465, 357, 'vendor → control · blocked', 'r');

      /* ---- HMI → PLC through the Socket; PLC → internet blocked ---- */
      s += fl('M550 400H602V500H552', 'fl-walk', {dur: 1.8, arrow: 'arr-m'});
      s += pill(465, 471, 'HMI → PLC · allowed', 'g');
      s += fl('M550 532H596', 'fl-down', {np: 0}) + xmark(572, 532);
      s += pill(465, 561, 'PLC → internet · blocked', 'r');
      return s;
    },
    title: 'Purdue-model segmentation on the Socket',
    desc: 'Four Purdue bands with an IT/OT boundary are spanned by a Cato Socket running the LAN firewall: traffic flows within a level, HMI to PLC is allowed by a device-attribute rule, a maintenance vendor reaches only the jump server over ZTNA, and a PLC attempting to reach the internet is blocked.',
    legend: [['hot', 'Allowed — within level, or explicit policy'], ['https', 'Vendor over ZTNA — jump server only'], ['tun', 'Socket ↔ PoP tunnel'], ['down', 'Blocked — no PLC internet egress, no vendor → control'], 'live'],
  }],
});
