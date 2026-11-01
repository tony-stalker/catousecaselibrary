/* specs/management-api-automation.js — Automation at Scale with API, catocli & Terraform */
DG.page('management-api-automation', {
  spotlight: {
    hl: ['mgmt', 'pop', 'backbone', 'branch', 'xops'],
    mods: ['sdwan'],
    flows: [{p: 'br1'}, {p: 'br2'}, {p: 'br3'}, {p: 'r-LC'}, {p: 'spine'}],
    steps: [
      {t: 'Site and policy definitions live in Git; a CI runner executes Terraform and catocli on merge.', marks: ['mgmt']},
      {t: 'The Cato GraphQL API, the same API the CMA runs on, applies the change with one audit entry per mutation.', marks: ['api']},
      {t: 'New sites reach the topology map within minutes; one tagged script changes policy at every site.', marks: ['pop', 'branch']},
      {t: 'The eventsFeed API streams security and connectivity events into the SIEM continuously.', marks: ['xops']},
    ],
    anchors: {mgmt: [700, 132], api: [782, 132]},   // one marker per step on the CMA box's top edge, clear of 'Terraform & API'
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 430',
    draw: K => {
      const {nd, fl, T, tier, pill, popBox, ring, chipRow} = K;
      let s = '';
      /* ---- column headings ---- */
      s += tier(14, 12, 'CODE') + tier(184, 12, 'PIPELINE') + tier(330, 12, 'CATO SASE CLOUD') + tier(576, 12, 'LIVE WAN');
      /* ---- left: code and the pipeline ---- */
      const Y = 162, H = 56, CY = Y + H / 2;
      s += nd(14, Y, 140, H, {t: 'Git repository', s: ['main.tf', 'policy as code'], ic: 'code', is: 20, icls: 'g'});
      s += fl(`M154 ${CY}L184 ${CY}`, 'fl-https', {np: 0, arrow: 'arr-m'});
      s += pill(169, Y - 16, 'merge');
      s += nd(184, Y, 140, H, {t: 'CI runner', s: ['terraform', 'catocli'], ic: 'route', is: 20, icls: 'g'});
      s += fl(`M324 ${CY}L360 ${CY}`, 'fl-https', {arrow: 'arr-m', dur: .9});
      s += pill(342, Y - 16, 'HTTPS · x-api-key');   // centred on the CI → API arrow
      /* one API, three ways to consume it */
      s += tier(14, 332, 'ONE API · THREE WAYS TO CONSUME IT');
      s += chipRow(14, 344, ['GraphQL API', 'catocli', 'Terraform provider'], 104, 22, 8, 'g');
      /* ---- centre: the API in the Cato cloud ---- */
      const RG = {cx: 430, cy: CY, rx: 96, ry: 46};
      s += ring(RG);
      s += popBox(360, CY - 30, 140, 60, 'Cato GraphQL API', 'api.catonetworks.com');
      s += T(430, CY + 70, 'Cato cloud', 'f-t', 'middle');
      s += T(430, CY + 84, 'Global Private Backbone', 'f-m', 'middle');
      s += pill(430, CY + 108, 'same API the CMA runs on', 'm');
      /* ---- right: sites created, policy applied ---- */
      const RX = 576, RW = 170, RH = 48;
      const sites = [['Bristol Office', 48], ['Glasgow', 112], ['London DC', 176]];
      sites.forEach(([t, y], i) => {
        const sy = CY - 12 + i * 8;
        s += fl(`M500 ${sy}C545 ${sy} 545 ${y + 24} ${RX} ${y + 24}`, 'fl-tun', {arrow: 'arr-ms', dur: 1.3});   // small marker: arr-m scales up with the thick tunnel stroke
        s += nd(RX, y, RW, RH, {t, s: ['cato_socket_site'], ic: 'building', is: 18, icls: 'g'});
      });
      s += fl(`M500 ${CY + 14}C545 ${CY + 14} 545 264 ${RX} 264`, 'fl-flow', {arrow: 'arr-m', dur: 1});
      s += nd(RX, 240, RW, RH, {t: 'WAN policy update', s: ['tagged · revertable'], ic: 'firewall', is: 18, icls: 'g', cls: 'hot'});
      /* ---- bottom right: the events feed out ---- */
      s += tier(RX, 346, 'EVENTS OUT');
      s += fl(`M495 ${CY + 32}C535 ${CY + 72} 525 384 ${RX} 384`, 'fl-flow', {arrow: 'arr-m', dur: 1.4});
      s += pill(520, 334, 'eventsFeed API');
      s += nd(RX, 360, RW, RH, {t: 'SIEM', s: ['Splunk · Sentinel'], ic: 'console', is: 18, icls: 'g'});
      return s;
    },
    title: 'Network as code: Git to CI to the Cato GraphQL API',
    desc: 'Site and policy definitions live in Git; a CI runner executes Terraform and catocli against the Cato GraphQL API, which creates branch sites and applies a tagged, revertable WAN policy update while the eventsFeed API streams events into the SIEM.',
    legend: [['https', 'Pipeline: Git → CI → API'], ['tun', 'Sites created and connected'], ['flow', 'Policy change · events feed'], 'live'],
  }],
});
