/* specs/security-tls-inspection.js — TLS Inspection: Staged Rollout Playbook */
DG.page('security-tls-inspection', {
  spotlight: {
    hl: ['users', 'branch', 'pop', 'saas'],
    mods: ['sse'],
    flows: [{p: 'us1'}, {p: 'br1'}, {p: 'eg-saas'}, {p: 'eg-www'}],
    steps: [
      {t: 'The root certificate is pushed to every managed device and verified per OS before any flow is decrypted.', marks: ['users', 'branch']},
      {t: 'Cato auto-creates firewall rules blocking QUIC, so browsers fall back to inspectable TLS over TCP 443.', marks: ['popL']},
      {t: 'A pilot cohort is inspected first with the downstream engines in monitor, so breakage lands as events.', marks: ['pop']},
      {t: 'Inspection widens category by category to full enforcement; pinned and mTLS apps get owned bypass rules.', marks: ['saas']},
    ],
    anchors: {saas: [302, 310]},   // marker clear of the "Smart egress · direct-to-cloud" subtitle
  },
  diagrams: [{
    slot: 'main',
    vb: '0 40 760 352',
    draw: K => {
      const {nd, tile, fl, T, L, pill, tier, cloud, xmark} = K;
      let s = '';
      const RY = 181;                       // centre line of the stage row

      /* ---- input: everything encrypted, from users, sites and clouds ---- */
      s += cloud(66, RY, 1.0, 'HTTPS traffic', 'users · sites · cloud');
      s += fl(L(124, RY, 140, RY), 'fl-tun', {dur: .6});

      /* ---- QUIC side door, shut by the auto-created Internet Firewall rules ---- */
      s += tier(139, 54, 'INTERNET FIREWALL · AUTO-CREATED RULES');
      s += fl('M104 146C116 120 130 102 144 86', 'fl-down', {np: 0});
      s += xmark(150, 78);
      s += T(170, 76, 'QUIC / UDP 443 blocked', 'f-t');
      s += T(170, 90, 'browsers fall back to TCP', 'f-s');

      /* ---- the four stages, left to right ---- */
      s += tier(140, 122, 'TLS INSPECTION POLICY · EVERY STAGE GATES THE NEXT');
      const ST = [
        ['key',   'Root certificate',     'MDM / GPO · verified'],
        ['users', 'Pilot cohort',         'monitor-first inspect'],
        ['globe', 'Category rollout',     'inspect · wave by wave'],
        ['lock',  'Full enforcement',     'inspect by default'],
      ];
      const X0 = 140, W = 136, G = 20, TY = RY - 45;
      ST.forEach(([ic, t, sub], i) => {
        const x = X0 + i * (W + G);
        s += tile(x, TY, W, 90, ic, t, [sub], i === 3 ? {cls: 'pop'} : {});
        if (i < 3) s += fl(L(x + W, RY - 20, x + W + G, RY - 20), 'fl-flow', {np: 0, arrow: 'arr-m'});
      });

      /* ---- gates: each one must pass before the next stage opens ---- */
      [['gate: certs verified', 0], ['gate: pilot quiet', 1], ['gate: bypasses owned', 2]].forEach(([g, i]) => {
        const cx = X0 + (i + 1) * (W + G) - G / 2;
        s += fl(L(cx, TY + 90, cx, 236), 'fl-flow fl-dim', {np: 0});
        s += pill(cx, 246, g, 'y keep');
      });

      /* ---- the governed bypass lane: exceptions are explicit, never silent ---- */
      s += tier(196, 296, 'BYPASS LANE · GOVERNED EXCEPTIONS');
      s += fl(L(66, 218, 66, 304), 'fl-priv', {np: 0});
      s += nd(14, 304, 170, 56, {t: 'Bypass lane', s: ['pinned · mTLS · legacy'], ic: 'shield', is: 20, icls: 'g', cls: 'dash'});
      s += fl(L(184, 332, 612, 332), 'fl-priv', {dur: 2.4, arrow: 'arr-n', label: 'no decryption — explicit bypass rules', lx: 400, ly: 332, lcls: 'm'});
      s += nd(620, 310, 126, 44, {t: 'Destination', s: ['not decrypted'], ic: 'globe', is: 18, icls: 'g'});
      s += T(400, 358, 'time-bound · reviewed · audited · owner on every rule', 'f-s', 'middle');

      return s;
    },
    title: 'Staged TLS inspection rollout funnel',
    desc: 'All HTTPS traffic passes a staged funnel — root certificate fleet-wide, a monitor-first pilot cohort, category-by-category expansion, then full enforcement — with a gate between each stage, a governed bypass lane for pinned, mTLS and legacy applications, and QUIC blocked so browsers fall back to inspectable TCP.',
    caption: 'Staging discipline: certificates before decryption, a quiet pilot before expansion, owned bypasses before enforcement. The bottom lane is the governed exception path — never a silent one.',
    legend: [['tun', 'All HTTPS traffic — enters the staged policy'], ['flow', 'Stage gate — advance only when quiet'], ['down', 'QUIC — blocked, falls back to TCP'], ['priv', 'Bypass lane — governed exception path'], 'live'],
  }],
});
