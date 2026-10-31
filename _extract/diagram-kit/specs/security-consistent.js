/* specs/security-consistent.js — Consistent Security: configured once, applied everywhere */
DG.page('security-consistent', {
  spotlight: {
    hl: ['branch', 'dc', 'cloud', 'users', 'pop', 'backbone'],
    mods: ['sse', 'uztna'],
    flows: [{p: 'br1'}, {p: 'dc1'}, {p: 'cl-az'}, {p: 'us1'}, {p: 'r-LC'}, {p: 'r-CR'}, {p: 'r-RL'}],
    steps: [
      {t: 'One policy set is defined once in the CMA and distributed to every PoP on the backbone.', marks: ['pop']},
      {t: 'London DC, Glasgow, the Azure vSocket, Madrid and a home worker all cross the identical stack.', marks: ['branch', 'dc', 'cloud', 'users']},
      {t: 'Rules target IdP user groups and device-posture profiles, so a directory change alone changes access.', marks: ['users']},
      {t: 'A threat is stopped by the same IPS and Anti-Malware rules at whichever PoP it appears.', marks: ['popL']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, tier, tile, ring, fpin, pinTop, fy, cloud, pill, xmark} = K;
      let s = '';

      /* ---- the Cato cloud: the backbone ring with the one policy set at its centre ---- */
      s += tier(14, 14, 'CATO SASE CLOUD');
      s += T(420, 72, 'Global Private Backbone', 'f-h', 'middle');
      s += T(420, 88, 'every PoP runs the identical policy set', 'f-s', 'middle');
      const RG = {cx: 420, cy: 236, rx: 280, ry: 120};
      s += ring(RG, '');
      s += nd(310, 150, 220, 70, {t: 'One policy set', s: ['WAN FW · Internet FW · IPS', 'AM · CASB · DLP'], ic: 'console', is: 22, icls: 'g', cls: 'pop'});

      /* four PoPs standing on the front of the ring; each name sits above its pin head */
      const PR = 16;
      const POPS = [[260, 'London PoP', [318, 220]], [360, 'Manchester PoP', [352, 220]], [480, 'Frankfurt PoP', [488, 220]], [580, 'Dubai PoP', [522, 220]]];
      /* policy distribution: thin arrowed lines from the card to every PoP (drawn first, under the labels) */
      POPS.forEach(([x, , [sx, sy]]) => {
        const ly = pinTop(fy(RG, x), PR) - 25;
        s += fl(`M${sx} ${sy}C${sx} ${sy + 18} ${x} ${ly - 18} ${x} ${ly.toFixed(1)}`, 'fl-flow', {np: 0, arrow: true});
      });

      /* ---- edges: sites, cloud and a remote user, each on its nearest PoP over an encrypted tunnel ---- */
      const EDGES = [
        [14, 'server', 'London DC', ['Socket X1500 · datacentre'], 260],
        [162, 'laptop', 'Priya — at home', ['Cato Client · Windows'], 360 - 8],
        [310, 'building', 'Glasgow', ['Socket X1600 · branch'], 360 + 8],
        [458, 'building', 'Madrid Office', ['Socket X1500 · branch'], 480],
        [606, 'cpu', 'Azure vSocket', ['Azure hub · HA pair'], 580],
      ];
      EDGES.forEach(([x, ic, t, subs, px]) => {
        const cx = x + 70, ly = (fy(RG, px) + 2).toFixed(1);
        s += fl(`M${cx} 440C${cx} 400 ${px} 400 ${px} ${ly}`, 'fl-tun', {dur: 1.4});
        s += tile(x, 440, 140, 100, ic, t, subs);
      });

      /* pins after the tunnels so each tunnel ends under its pin tip */
      POPS.forEach(([x, lab]) => {
        const tip = fy(RG, x);
        s += fpin(x, tip, PR, 'PoP', {halo: true});
        s += T(x, pinTop(tip, PR) - 10, lab, 'nd-t g', 'middle');
      });

      /* ---- a threat on the left: blocked at the London PoP by the same IPS and Anti-Malware rules ---- */
      s += cloud(66, 250, .65, 'Threat traffic', '', 'bad');
      s += fl('M104 262C148 268 188 286 215 294', 'fl-attack', {np: 0});
      s += xmark(226, 297);
      s += pill(130, 345, 'Blocked by IPS · Anti-Malware', 'r');
      return s;
    },
    title: 'One global policy set enforced identically at every Cato PoP',
    desc: 'A single policy set defined once in the CMA is distributed to every PoP on the backbone, so London DC, a Glasgow branch, an Azure vSocket, a Madrid office and a remote home worker all traverse the identical enforcement stack and a threat is blocked by the same rules wherever it appears.',
    caption: 'One policy set, defined once in the CMA and distributed to every PoP (thin arrowed lines). London DC, Glasgow, the Azure vSocket, the Madrid office and a remote user all traverse the same enforcement stack — and a threat is stopped by the same rules wherever it appears.',
    legend: [['tun', 'Identical policy — traffic allowed'], ['attack', 'Threat — blocked at the PoP'], ['flow', 'Policy distribution to every PoP'], 'live'],
  }],
});
