/* specs/network-resilient-site-design.js — Resilient Site Design */
DG.page('network-resilient-site-design', {
  spotlight: {
    hl: ['dc', 'branch', 'pop', 'backbone'],
    mods: ['sdwan'],
    flows: [{p: 'dc1', rev: true}, {p: 'br1'}, {p: 'br2'}, {p: 'br3'}, {p: 'r-LC'}],
    steps: [
      {t: 'Every link is scored each second on loss, jitter and latency; a cut last mile re-homes flows to the survivor.', marks: ['branch']},
      {t: 'On critical sites an HA Socket pair takes over after 3 s of missed keepalives; LTE idles as the last resort.', marks: ['dc']},
      {t: 'If every link fails the SLA against the current PoP, the Socket moves to another; preferred PoPs steer it.', marks: ['pop']},
      {t: 'With no PoP reachable, Internet and WAN Recovery keep traffic moving off-cloud, uninspected but working.', marks: ['branch', 'dc']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, R, L, pill, tier, ring, fpin, fy, sock, xmark} = K;
      let s = '';

      /* ---- top: the backbone with the two preferred PoPs ---- */
      s += tier(14, 12, 'CATO SASE CLOUD');
      s += T(380, 32, 'Cato Global Private Backbone', 'f-h', 'middle');
      const RG = {cx: 380, cy: 100, rx: 200, ry: 34};
      const P1 = 270, P2 = 490, TIP = Math.round(fy(RG, P1));   /* both pins sit on the front of the ring */
      s += ring(RG);
      s += T(380, 97, 'PoP failover is automatic', 'f-t', 'middle') + T(380, 111, 'preferred PoPs steer it', 'f-s', 'middle');

      /* ---- the site ---- */
      /* the frame's tag sits on the bottom edge: every WAN line leaves through the top edge */
      s += R(40, 196, 680, 348, 'site-box', 18) + R(58, 535, 196, 18, 'tag-bg', 9) + T(69, 548.5, 'CRITICAL SITE — LONDON DC', 'tier g');
      s += T(702, 528, 'HA pair · both Sockets cabled to every ISP + LTE', 'f-s', 'end');

      /* WAN lines (drawn before the pins so they meet under the pin heads) */
      const ISPA = `M110 320C110 250 200 190 ${P1} ${TIP}`;          /* Socket A → PoP 1 over ISP A: cut */
      const ISPB = `M200 320C200 250 440 200 ${P2 - 2} ${TIP}`;      /* Socket A → PoP 2 over ISP B: carries everything */
      const STBY = `M400 320C400 250 505 210 ${P2 + 4} ${TIP}`;      /* Socket B's own standby tunnel */
      const LTE = `M635 320C635 250 560 200 ${P2 + 8} ${TIP}`;       /* LTE last resort: idle */
      s += fl(ISPA, 'fl-tun fl-down', {np: 0, label: 'ISP A fibre — cut', lx: 131, ly: 260, lcls: 'r'});
      s += xmark(198, 184);
      s += fl(STBY, 'fl-tun fl-dim', {np: 0});
      s += T(452, 254, 'standby tunnel', 'f-m');
      s += fl(ISPB, 'fl-tun', {n: 4, dur: 1.2, label: 'ISP B — all flows re-home', lx: 330, ly: 225, lcls: 'g'});
      s += fl(LTE, 'fl-ha', {np: 0, label: 'idle until wired links fail', lx: 600, ly: 225, lcls: 'y'});

      /* PoPs on the ring, labels beside the pin heads */
      s += fpin(P1, TIP, 22, 'PoP', {halo: true}) + fpin(P2, TIP, 22, 'PoP', {halo: true});
      s += T(162, 88, 'PoP 1 — London', 'nd-t', 'end') + T(162, 102, 'primary preferred', 'f-s', 'end');
      s += T(598, 88, 'PoP 2 — Manchester', 'nd-t') + T(598, 102, 'secondary preferred', 'f-s');

      /* HA Socket pair */
      s += sock(58, 320, 'X1700') + R(58, 320, 190, 46, 'dev-hot', 9) + sock(338, 320, 'X1700');
      s += T(58, 384, 'Socket A — X1700', 'nd-t') + T(58, 398, 'HA master · active', 'nd-s');
      s += T(528, 384, 'Socket B — X1700', 'nd-t', 'end') + T(528, 398, 'Standby · Ready', 'nd-s', 'end');
      s += fl(L(293, 343, 254, 343), 'fl-ha', {np: 0, arrow: 'arr-y'}) + fl(L(293, 343, 332, 343), 'fl-ha', {np: 0, arrow: 'arr-y'});
      s += pill(293, 304, 'VRRP keepalive', 'y');
      s += T(293, 386, '3 s → failover', 'f-m', 'middle');

      /* LTE / 5G modem, cabled to the pair */
      s += fl(L(528, 343, 560, 343), 'fl-net', {np: 0});
      s += nd(560, 286, 150, 74, {t: 'LTE / 5G modem', s: ['precedence 3', 'last resort', 'cabled to both Sockets'], ic: 'cell', is: 20, icls: 'g'});

      /* LAN: both Sockets mirrored into the same LAN; traffic walks through the active one */
      s += `<path d="M230 366V440H356V366M293 440V468" class="fl fl-lan"/>`;
      s += fl('M230 366V440H293V468', 'fl-walk', {dur: 1.6});
      s += nd(203, 468, 180, 56, {t: 'Site LAN', s: ['users · servers · OT'], ic: 'switch', is: 20, icls: 'g'});
      return s;
    },
    title: 'Critical site resilience, mid-incident',
    desc: 'A critical site runs an HA pair of X1700 Sockets with VRRP keepalives, two diverse last miles and an LTE last-resort link: the primary last mile to PoP 1 has been cut and every flow has re-homed over the second last mile to PoP 2, while the standby Socket and the idle LTE link stay in reserve.',
    legend: [['tun', 'Active last mile — carries all flows'], ['ha', 'HA keepalive · LTE last resort (idle, minimal system traffic)'], ['down', 'Failed last mile — flows re-homed by SLA scoring'], 'live'],
  }],
});
