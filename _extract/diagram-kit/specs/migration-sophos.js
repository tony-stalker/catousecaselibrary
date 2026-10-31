/* specs/migration-sophos.js — Sophos (XGS Firewall & Central) to Cato */
DG.page('migration-sophos', {
  spotlight: {
    hl: ['branch', 'dc', 'users', 'pop', 'backbone'],
    mods: ['sdwan', 'sse', 'uztna'],
    flows: [{p: 'br1'}, {p: 'br2'}, {p: 'dc1'}, {p: 'dc2'}, {p: 'us1'}, {p: 'r-LC'}],
    steps: [
      {t: 'A parallel Socket at HQ exchanges routes with the XGS hub over IPsec or eBGP, default routes filtered.', marks: ['dc']},
      {t: 'SD-RED sites swap to zero-touch Sockets first; XGS branches follow in waves, legacy kit still racked.', marks: ['branch', 'pop']},
      {t: 'Remote users move from Sophos Connect to the Cato Client; Sophos Central keeps endpoint, XDR and MDR.', marks: ['users']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, site, ring, fpin, fy, by, popBox} = K;
      let s = '';

      /* ---- top: the Cato PoP on the global private backbone ---- */
      const RG = {cx: 400, cy: 156, rx: 160, ry: 34};
      s += popBox(300, 30, 200, 64, 'Cato PoP', 'One global rulebase · full inspection');
      s += ring(RG);
      s += T(400, 222, 'Global private backbone', 'f-s', 'middle');

      /* ---- top left: the remote user, moved off Sophos Connect ---- */
      const uX = 290, uY = Math.round(by(RG, uX));
      s += fl(`M206 72C250 72 282 ${uY - 24} ${uX} ${uY + 2}`, 'fl-tun', {dur: 1.4});
      s += nd(14, 40, 192, 64, {t: 'Priya — remote', s: ['Cato Client, was Connect'], ic: 'laptop', is: 20, icls: 'g', cls: 'hot'});
      s += pill(110, 122, 'on Cato · nearest PoP', 'g');

      /* Branch A → PoP and hub Socket → PoP (green tunnels, drawn before the pin) */
      const aX = 270, aY = Math.round(fy(RG, aX));
      const sX = 360, sY = Math.round(fy(RG, sX));
      s += fl(`M84 440C84 280 160 ${aY + 14} ${aX} ${aY - 2}`, 'fl-tun', {dur: 1.4});
      s += fl(`M255 290C255 250 330 ${sY + 12} ${sX} ${sY - 2}`, 'fl-tun', {dur: 1.4});
      s += fpin(400, Math.round(fy(RG, 400)) + 2, 22, 'PoP', {halo: true});

      /* ---- centre: the HQ site — parallel deployment ---- */
      s += site(150, 252, 460, 134, 'HQ SITE — PARALLEL DEPLOYMENT');
      s += nd(170, 290, 170, 64, {t: 'Cato Socket', s: ['parallel at the HQ'], ic: 'cpu', is: 20, icls: 'g', cls: 'hot'});
      s += nd(420, 290, 170, 64, {t: 'XGS hub firewall', s: ['Central Orchestration'], ic: 'firewall', is: 20, icls: 'g', cls: 'dash'});
      s += fl('M340 322H420', 'fl-lan', {np: 0});
      s += pill(380, 322, 'IPsec/eBGP', 'm');
      s += T(380, 374, 'default routes filtered', 'f-s', 'middle');

      /* ---- bottom left: the migrated branch ---- */
      s += nd(14, 440, 192, 64, {t: 'Branch A — migrated', s: ['Socket replaces SD-RED'], ic: 'building', is: 20, icls: 'g', cls: 'hot'});
      s += pill(110, 522, 'full inspection at the PoP', 'g');

      /* ---- bottom right: the legacy SD-RED branch, hairpinning to the hub ---- */
      s += fl('M650 440C650 404 560 420 560 356', 'fl-ha', {dur: 1.8, label: 'tunnel-everything', lx: 676, ly: 408, lcls: 'y'});
      s += nd(554, 440, 192, 64, {t: 'Branch B — legacy', s: ['SD-RED tunnel to hub'], ic: 'building', is: 20, icls: 'g', cls: 'dash'});
      s += pill(650, 522, 'hairpins to the hub XGS', 'y');

      /* ---- rollback: Branch A reverts by re-plugging its SD-RED ---- */
      s += fl('M206 486C300 530 470 510 494 360', 'fl-net', {np: 0, arrow: true});
      s += T(380, 548, 'Rollback — re-plug the SD-RED · its tunnel re-establishes to the hub', 'f-s', 'middle');
      return s;
    },
    title: 'Co-existence between a Sophos XGS/SD-RED estate and Cato during phased migration',
    desc: 'A parallel Socket at HQ exchanges routes with the XGS hub over an IPsec or eBGP handoff carrying un-migrated branch traffic; SD-RED sites swap to zero-touch Sockets first, remote users move from Sophos Connect to the Cato Client, and rollback is re-plugging the RED so its tunnel re-establishes.',
    legend: [['tun', 'Migrated — Cato Socket / Client via nearest PoP'], ['ha', 'Legacy — SD-RED tunnel to the hub XGS'], ['net', 'Rollback — re-plug the SD-RED'], 'live'],
  }],
});
