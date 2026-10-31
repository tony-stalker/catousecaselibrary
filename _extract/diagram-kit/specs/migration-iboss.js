/* specs/migration-iboss.js — iboss Proxy to Cato */
DG.page('migration-iboss', {
  spotlight: {
    hl: ['users', 'branch', 'pop', 'saas'],
    mods: ['sse'],
    flows: [{p: 'us1'}, {p: 'br1'}, {p: 'eg-saas'}, {p: 'eg-www'}],
    steps: [
      {t: 'Both root CAs are deployed side by side first, so TLS inspection works in either direction.', marks: ['users']},
      {t: 'Wave 1 devices and the pilot site steer to the nearest PoP; later waves stay on PAC and connectors.', marks: ['branch', 'pop']},
      {t: 'SaaS allowlists carry both vendors\' egress IPs; any wave rolls back by re-pointing to the hosted PAC.', marks: ['saas']},
    ],
    anchors: {saas: [302, 310]},           // step-3 marker right of the SaaS cloud, clear of the subtitle
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, fl, T, pill, ring, fpin, fy, cloud, popBox, tier} = K;
      let s = '';

      /* ---- top band: migrated waves steer to the Cato PoP ---- */
      s += tier(44, 40, 'MIGRATED · STEERED TO CATO');
      const RG = {cx: 410, cy: 190, rx: 105, ry: 40};
      s += ring(RG);
      s += popBox(320, 80, 180, 70, 'Cato PoP', 'SWG · TLSi · CASB · DLP');
      s += T(410, 262, 'Global Private Backbone', 'f-s', 'middle');

      s += nd(44, 70, 180, 64, {t: 'Wave 1 cohort', s: ['Cato Client via MDM', 'atomic per-device swap'], ic: 'users', is: 20, icls: 'g'});
      s += pill(134, 152, 'wave 1 · migrated', 'g');
      s += nd(44, 190, 180, 64, {t: 'School / branch site', s: ['Cato Socket X1500', 'replaces GRE/IPsec tunnel'], ic: 'building', is: 20, icls: 'g'});
      s += pill(134, 272, 'pilot site', 'g');

      /* Cato tunnels: Client and Socket into the PoP */
      s += fl('M224 102C270 102 280 108 320 108', 'fl-tun', {dur: 1.3});
      s += fl('M224 222C276 222 276 136 320 136', 'fl-tun', {dur: 1.3});

      /* ---- right: SaaS & internet, keyed to both vendors' egress IPs ---- */
      s += cloud(640, 250, 1.4, 'SaaS & internet', 'M365 · Google · exam apps');
      s += pill(598, 312, 'allowlists dual-list both IPs', 'm');
      s += fl('M500 110C590 110 630 140 636 192', 'fl-flow', {dur: 1.1, arrow: 'arr-m', label: 'PoP breakout · allocated IPs', lx: 600, ly: 122, lcls: 'g keep'});

      /* ---- bottom band: remaining waves stay on iboss, change-frozen ---- */
      s += tier(44, 398, 'REMAINING WAVES · STAY ON IBOSS');
      s += nd(44, 420, 180, 64, {t: 'Waves 2+ cohorts', s: ['iboss connector + PAC', 'PAC stays hosted · frozen'], ic: 'users', is: 20, icls: 'g', cls: 'dash'});
      s += pill(134, 502, 'waves 2+', 'y');
      s += cloud(640, 452, 1.4, 'iboss cloud', 'interim · being retired');
      s += pill(640, 512, 'interim', 'y');
      s += fl('M224 452H554', 'fl-ha', {dur: 1.8, label: 'PAC / connector steering — unchanged during waves', lx: 390, ly: 452, lcls: 'y keep'});
      s += fl('M714 440V290', 'fl-ha', {np: 0, arrow: 'arr-y', label: 'legacy egress', lx: 712, ly: 368, lcls: 'y keep'});

      /* ---- rollback rail: any wave re-points to the hosted PAC ---- */
      s += fl('M44 96H34C27 96 24 100 24 107V441C24 448 27 452 34 452H44', 'fl-net fl-dim', {np: 0, arrow: true, label: '⟲ rollback: re-point wave to hosted PAC', lx: 140, ly: 336});

      /* the PoP pin on the front of the ring */
      s += fpin(410, Math.round(fy(RG, 410)) + 2, 20, 'PoP', {halo: true});
      s += T(380, 546, 'Both root CAs deployed side by side first · each device wholly on one vendor at a time', 'f-s', 'middle');
      return s;
    },
    title: 'Wave-based steering cutover from iboss to Cato',
    desc: 'Migrated cohorts and sites steer transparently to the nearest Cato PoP while remaining waves stay on PAC and connector steering into iboss; SaaS allowlists carry both vendors\' egress IPs during transition, and any wave rolls back with a single change re-pointing to the hosted PAC.',
    legend: [['tun', 'Migrated waves — Client / Socket to Cato PoP'], ['flow', 'PoP breakout via allocated IPs'], ['ha', 'Remaining waves — PAC / connector to iboss (frozen)'], ['net', '⟲ Dashed — rollback rail back to PAC'], 'live'],
  }],
});
