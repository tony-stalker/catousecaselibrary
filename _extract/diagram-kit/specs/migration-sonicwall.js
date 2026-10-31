/* specs/migration-sonicwall.js — SonicWall (TZ/NSa & SonicOS) to Cato */
DG.page('migration-sonicwall', {
  spotlight: {
    hl: ['branch', 'dc', 'users', 'pop', 'saas'],
    mods: ['sdwan', 'sse', 'uztna'],
    flows: [{p: 'br1'}, {p: 'dc2'}, {p: 'us1'}, {p: 'eg-www'}],
    steps: [
      {t: 'SSL-VPN cohorts move to ZTNA first: IdP MFA and posture at the PoP, and the WAN-facing portal is retired.', marks: ['users']},
      {t: 'TZ branches swap to parallel Sockets in waves; the NSa hub runs an interim IPsec IKEv2 on-ramp to the PoP.', marks: ['branch', 'dc']},
      {t: 'Default routes are filtered at the on-ramp; rollback is re-plugging the TZ so its site-to-site VPN returns.', marks: ['pop']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, site, ring, fpin, fy, cloud, popBox, xmark} = K;
      let s = '';

      /* ---- top: the Cato PoP on the global private backbone ---- */
      const RG = {cx: 380, cy: 150, rx: 160, ry: 32};
      s += popBox(270, 18, 220, 58, 'Cato PoP', 'One global policy · full inspection');
      s += ring(RG);
      s += T(200, 150, 'Global private backbone', 'f-s', 'end');

      /* ---- top right: the attacker hunting for SSL-VPN portals ---- */
      s += cloud(664, 70, 1.3, 'Internet attacker', 'scans for SSL-VPN portals', 'bad');
      s += fl('M680 112V182', 'fl-attack', {dur: 1.2});
      s += xmark(680, 194);
      s += pill(680, 222, 'SSL-VPN portal retired', 'r');

      /* ---- left: the remote cohort, moved to ZTNA first ---- */
      const cX = 246, cY = Math.round(fy(RG, cX));
      s += fl(`M120 220C120 196 200 ${cY + 8} ${cX} ${cY - 2}`, 'fl-tun', {dur: 1.3});
      s += nd(14, 220, 214, 70, {t: 'Remote cohort — ZTNA', s: ['Cato Client · IdP MFA', 'was NetExtender / GVC / SMA'], ic: 'users', is: 20, icls: 'g', cls: 'hot'});
      s += pill(121, 306, 'moved first', 'g');

      /* ---- centre: HQ — parallel deployment ---- */
      s += site(270, 262, 476, 120, 'HQ — PARALLEL DEPLOYMENT');
      s += nd(290, 296, 170, 64, {t: 'Cato Socket', s: ['parallel at HQ'], ic: 'cpu', is: 20, icls: 'g', cls: 'hot'});
      s += nd(556, 296, 170, 64, {t: 'NSa hub firewall', s: ['NSM-managed'], ic: 'firewall', is: 20, icls: 'g', cls: 'dash'});
      s += fl('M460 328H556', 'fl-net', {np: 0});
      s += pill(508, 328, 'L3 handoff', 'm keep');

      /* HQ Socket → PoP */
      const sX = 430, sY = Math.round(fy(RG, sX));
      s += fl(`M460 304C494 304 478 236 ${sX} ${sY - 2}`, 'fl-tun', {dur: 1.3});

      /* NSa → PoP: the interim IPsec IKEv2 on-ramp */
      const oX = 470, oY = Math.round(fy(RG, oX));
      s += fl(`M610 296C610 248 520 ${oY + 10} ${oX} ${oY - 2}`, 'fl-ha', {dur: 1.8, label: 'IPsec IKEv2 on-ramp (interim)', lx: 586, ly: 248, lcls: 'y'});

      /* ---- bottom left: the migrated branch ---- */
      const aX = 290, aY = Math.round(fy(RG, aX));
      s += fl(`M200 420C250 380 250 ${aY + 60} ${aX} ${aY - 2}`, 'fl-tun', {dur: 1.4});
      s += nd(14, 420, 200, 64, {t: 'Branch A — migrated', s: ['Socket replaces TZ'], ic: 'building', is: 20, icls: 'g', cls: 'hot'});
      s += pill(114, 500, 'on Cato · via nearest PoP', 'g');

      /* ---- bottom right: the legacy TZ branch, still on the hub ---- */
      s += fl('M680 432V360', 'fl-ha', {dur: 1.6, label: 'S2S VPN', lx: 712, ly: 404, lcls: 'y'});
      s += nd(554, 432, 192, 64, {t: 'Branch B — legacy', s: ['TZ tunnels to hub'], ic: 'building', is: 20, icls: 'g', cls: 'dash'});
      s += pill(650, 512, 'migrates in a later wave', 'y');

      /* ---- rollback: re-plug the TZ ---- */
      s += fl('M214 468C340 520 520 500 600 364', 'fl-net', {np: 0, arrow: true});
      s += T(378, 518, 'Rollback — re-plug the TZ · its site-to-site VPN re-establishes to the hub', 'f-s', 'middle');

      /* the PoP pin on the front of the ring */
      s += fpin(380, Math.round(fy(RG, 380)) + 2, 22, 'PoP', {halo: true});
      return s;
    },
    title: 'SonicWall TZ/NSa co-existence during phased migration',
    desc: 'SSL-VPN cohorts move to ZTNA first, retiring the exploited WAN-facing portal; TZ branches swap to parallel Sockets in waves and the NSa hub runs an interim IPsec IKEv2 on-ramp for un-migrated branch traffic with default routes filtered, so rollback is re-plugging the TZ and its site-to-site VPN re-establishes.',
    legend: [['tun', 'Migrated — Sockets and ZTNA cohorts via the nearest PoP'], ['ha', 'Legacy / interim — SonicWall S2S VPN and IPsec on-ramp'], ['attack', 'Attack path — removed with the SSL-VPN portal'], ['net', 'LAN handoff · rollback — re-plug the TZ'], 'live'],
  }],
});
