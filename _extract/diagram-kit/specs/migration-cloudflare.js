/* specs/migration-cloudflare.js — Cloudflare (Zero Trust & Magic WAN) to Cato */
DG.page('migration-cloudflare', {
  spotlight: {
    hl: ['users', 'branch', 'dc', 'pop', 'saas'],
    mods: ['sse', 'uztna', 'sdwan'],
    flows: [{p: 'us1'}, {p: 'br1'}, {p: 'dc1', rev: true}, {p: 'eg-www'}],
    steps: [
      {t: 'User cohorts swap WARP for the Cato Client one wave at a time; never both agents on one device.', marks: ['users']},
      {t: 'Sites run Magic WAN and a Socket in parallel; private apps move from cloudflared to SDP app by app.', marks: ['branch', 'dc']},
      {t: 'The public web estate never leaves Cloudflare: CDN, WAF, authoritative DNS and Magic Transit stay.', marks: ['saas']},
    ],
    anchors: {saas: [229, 432]},
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, TL, R, pill, ring, fpin, fy, cloud, popBox, tier} = K;
      let s = '';

      /* ---- top band: retained on Cloudflare, outside the migration ---- */
      s += R(14, 12, 732, 98, 'nd soft', 14);
      s += tier(30, 34, 'RETAINED — NOT PART OF THIS MIGRATION');
      s += nd(30, 48, 190, 50, {t: 'Public website', s: ['customer web traffic'], ic: 'globe', is: 20, icls: 'g'});
      s += fl('M220 73H366', 'fl-net', {np: 0, arrow: 'arr-n', label: 'stays on Cloudflare', lx: 293, ly: 73, lcls: 'm keep'});
      s += nd(370, 48, 210, 50, {t: 'Cloudflare CDN / WAF', s: ['auth. DNS · Magic Transit'], ic: 'shield', is: 20, icls: 'g'});
      s += TL(598, 68, ['Tenant stays live;', 'Zero Trust seats reduced'], 'f-s', 'start', 14);

      /* ---- main band: Zero Trust + WAN, interim above, target below ---- */
      s += tier(14, 138, 'MIGRATION SCOPE — ZERO TRUST + WAN');

      /* interim: the Cloudflare Zero Trust edge, retiring */
      s += cloud(380, 210, 1.5, 'Cloudflare Zero Trust', 'Access · Gateway · Magic WAN');
      s += pill(380, 272, 'retiring', 'y');

      /* target: the Cato PoP on the backbone */
      const RG = {cx: 380, cy: 450, rx: 120, ry: 34};
      s += ring(RG);
      s += popBox(280, 330, 200, 66, 'Cato PoP', 'SWG · DNS · ZTNA · FWaaS');
      s += T(380, 508, 'Global Private Backbone', 'f-s', 'middle');

      /* left: cohorts and the site */
      s += nd(14, 150, 200, 56, {t: 'Wave 2 user cohort', s: ['WARP (Cloudflare One)'], ic: 'users', is: 20, icls: 'g', cls: 'dash'});
      s += pill(114, 224, 'wave 2 · not yet migrated', 'y');
      s += nd(14, 288, 200, 68, {t: 'Bristol Office', s: ['Magic WAN IPsec — interim', 'Socket X1500 — target'], ic: 'building', is: 20, icls: 'g'});
      s += nd(14, 430, 200, 56, {t: 'Wave 1 user cohort', s: ['Cato Client'], ic: 'users', is: 20, icls: 'g'});
      s += pill(114, 504, 'wave 1 · migrated', 'g');

      /* right: the retiring connector and the private apps */
      s += nd(540, 176, 200, 56, {t: 'cloudflared connector', s: ['retires app-by-app'], ic: 'plug', is: 20, icls: 'g', cls: 'dash'});
      s += nd(540, 420, 200, 68, {t: 'London DC apps', s: ['Socket X1700', 'SDP app segments'], ic: 'server', is: 20, icls: 'g'});

      /* interim flows (amber) */
      s += fl('M214 178C254 178 262 200 296 202', 'fl-ha', {dur: 1.8});
      s += fl('M214 322C262 322 282 266 308 242', 'fl-ha', {dur: 1.8});
      s += fl('M467 204H540', 'fl-ha', {np: 0, arrow: 'arr-y'});
      s += fl('M670 232V420', 'fl-ha', {np: 0, arrow: 'arr-y', label: 'private access — retiring', lx: 670, ly: 300, lcls: 'y keep'});

      /* target flows (green tunnels; blue access to the apps) */
      s += fl('M214 342C248 342 252 352 280 352', 'fl-tun', {dur: 1.3});
      s += fl('M214 458C250 458 248 380 280 380', 'fl-tun', {dur: 1.3});
      s += fl('M480 368C520 368 512 454 540 454', 'fl-flow', {dur: 1.1, arrow: 'arr-m', label: 'WAN FW · SDP rules', lx: 588, ly: 388, lcls: 'g keep'});

      s += fpin(380, Math.round(fy(RG, 380)) + 2, 22, 'PoP', {halo: true});
      s += T(380, 544, 'Swap the agent per cohort, never overlap it; cut over per app, never big-bang', 'f-s', 'middle');
      return s;
    },
    title: 'Scoped Cloudflare-to-Cato migration with a retained Cloudflare lane',
    desc: "User cohorts swap agents one wave at a time, the site runs Magic WAN and Socket paths in parallel, and private apps move from cloudflared connectors to SDP app segments, while the public web estate stays on Cloudflare's CDN, WAF, authoritative DNS and Magic Transit.",
    legend: [['ha', 'Interim — via Cloudflare Zero Trust (retiring)'], ['tun', 'Target — via Cato PoP and backbone'], ['flow', 'WAN Firewall / SDP access to private apps'], ['net', 'Retained — CDN / WAF / DNS / Magic Transit stay'], 'live'],
  }],
});
