/* specs/network-agility-mna.js — Agility: M&A Integration at Speed */
DG.page('network-agility-mna', {
  spotlight: {
    hl: ['branch', 'pop', 'backbone', 'dc', 'mgmt'],
    mods: ['sdwan'],
    flows: [{p: 'br1'}, {p: 'br2'}, {p: 'br3'}, {p: 'r-LC'}, {p: 'dc1', rev: true}, {p: 'm1'}],
    steps: [
      {t: 'Acquired sites are defined as code and created through the Cato GraphQL API with Terraform.', marks: ['mgmt']},
      {t: 'Zero-touch Sockets ship to each acquired site and connect to the nearest PoP as they are plugged in.', marks: ['branch', 'popL']},
      {t: 'The acquired estate joins the global backbone and reaches London DC under the existing converged policy.', marks: ['backbone', 'dc']},
      {t: 'Entra ID provisions acquired users and groups, so WAN firewall rules can name them from day one.', marks: ['pop']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, tier, site, side, ring, fpin, fy, by} = K;
      let s = '';
      /* ---- control plane: Terraform against the Cato API, straight down into the Cato cloud ---- */
      s += tier(330, 14, 'CONTROL PLANE');
      s += nd(330, 26, 200, 54, {t: 'Terraform · Cato API', s: ['Site definitions as code'], ic: 'code', is: 20, icls: 'g'});
      s += fl('M430 80V184', 'fl-net', {np: 0, arrow: 'arr-n', label: 'Sites created via GraphQL API', lx: 430, ly: 134});

      /* ---- left: the acquired company ---- */
      s += site(14, 74, 196, 272, 'ACQUIRED COMPANY');
      s += nd(26, 92, 172, 54, {t: 'Leeds Office', s: ['Socket X1500 — live'], ic: 'building', is: 18, icls: 'g', cls: 'hot'});
      s += pill(170, 92, 'DAY 1', 'g');
      s += nd(26, 166, 172, 54, {t: 'Sheffield Plant', s: ['Socket X1500 — shipped'], ic: 'building', is: 18, icls: 'g', cls: 'soft'});
      s += nd(26, 240, 172, 54, {t: 'Aberdeen Depot', s: ['Socket X1500 — shipped'], ic: 'building', is: 18, icls: 'g', cls: 'soft'});
      s += pill(112, 324, 'zero-touch · ship & plug in', 'm');
      s += side(14, 420, 196, 56, 'Microsoft Entra ID', 'Acquired-company tenant', 'key');

      /* ---- centre: the Cato cloud on the global private backbone ---- */
      const RG = {cx: 430, cy: 300, rx: 120, ry: 46};
      s += ring(RG, '');                              /* ring too small for the kit's curved label — labelled inside instead */
      s += fpin(430, 254, 24, 'PoP', {halo: true});
      s += T(430, 308, 'Global Private Backbone', 'f-m', 'middle');
      s += T(430, 380, 'Cato Cloud', 'nd-t g', 'middle');
      s += T(430, 395, 'SPACE · FWaaS · routing · identity', 'f-s', 'middle');

      /* data plane: Leeds is live; Sheffield and Aberdeen are shipped, not yet connected */
      s += fl('M198 119C300 119 340 198 407 206', 'fl-tun', {dur: 1.4});
      s += fl('M198 193C300 193 340 214 406 218', 'fl-tun fl-dim', {np: 0});
      s += fl('M198 267C300 267 340 230 408 230', 'fl-tun fl-dim', {np: 0});
      /* acquired-site traffic crosses the backbone to the existing estate */
      s += fl(`M${RG.cx - RG.rx} ${RG.cy}A${RG.rx} ${RG.ry} 0 0 0 ${RG.cx + RG.rx} ${RG.cy}`, 'fl-hot', {n: 3, dur: 2.6});

      /* control plane: Entra ID provisions users and groups into Cato */
      s += fl(`M210 448C290 448 326 400 ${362} ${fy(RG, 362) + 10}`, 'fl-net', {np: 0, arrow: 'arr-n', label: 'SCIM — users & groups provisioned', lx: 326, ly: 480});

      /* ---- right: the existing Cato estate ---- */
      s += site(566, 150, 180, 230, 'EXISTING CATO ESTATE');
      s += nd(578, 180, 156, 54, {t: 'London DC', s: ['Socket X1500 · core apps']});
      s += nd(578, 300, 156, 54, {t: 'On-prem lab', s: ['Socket X1500 · HQ']});
      s += fl(`M536 ${by(RG, 536)}C556 268 556 207 578 207`, 'fl-tun', {dur: 1.2});
      s += fl(`M536 ${fy(RG, 536)}C556 332 556 327 578 327`, 'fl-tun', {dur: 1.2});
      return s;
    },
    title: 'M&A onboarding: acquired sites deployed through the Cato API onto the global backbone',
    desc: 'Terraform pushes acquired-site definitions through the Cato API, zero-touch Sockets connect each site to the nearest PoP, Entra ID provisions the acquired users and groups, and the acquired estate reaches London DC and the HQ lab site over the global private backbone.',
    legend: [['tun', 'Site tunnels to the nearest PoP'], ['hot', 'Acquired-site traffic — on-net over the backbone'], ['net', 'Control plane — API site creation · Entra ID provisioning'], 'live'],
  }],
});
