/* specs/management-data-lake.js — Event Logs & the Cato Data Lake */
DG.page('management-data-lake', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'xops', 'mgmt'],
    mods: [],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'spine'}],
    anchors: {mgmt: [782, 132]},   // step-3 marker on the CMA box's top edge, clear of its subtitle
    steps: [
      {t: 'Tracked policy hits, connections and detections from every edge become events at the PoP.', marks: ['branch', 'users', 'pop']},
      {t: 'Data Lake units set the hourly peak admitted: 2.5M events per hour each, licensed on the busiest hour.', marks: ['xops']},
      {t: 'Retained events are queryable in the CMA Events page for the 3, 6 or 12-month variant, then deleted.', marks: ['mgmt']},
      {t: 'Export to S3, Azure Blob, the eventsFeed API or a SIEM carries no additional Cato cost.', marks: ['xops']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, tile, fl, T, tier, pill, xmark} = K;
      let s = '';
      /* ---- event sources (left) ---- */
      const SX = 14, SW = 160, SH = 56;
      const SRC = [
        [210, 'firewall', 'Firewall policies', 'Internet · WAN · LAN'],
        [292, 'shield',   'Security services', 'IPS · CASB · RBI'],
        [374, 'building', 'Sites & SDP users', 'Sockets · Cato Clients'],
      ];
      s += tier(SX, 192, 'EVENT SOURCES · POLICY TRACKING');
      SRC.forEach(([y, ic, t, sub]) => { s += nd(SX, y, SW, SH, {t, s: [sub], ic, is: 20, icls: 'g'}); });

      /* ---- hourly rate gate ---- */
      const GX = 200, GW = 126, GY = 284, GH = 72, GC = GX + GW / 2, LY = 320;
      s += nd(GX, GY, GW, GH, {t: 'Hourly rate gate', s: ['2.5M events/h per unit', 'licensed on the peak'], cls: 'hot'});
      SRC.forEach(([y]) => {
        const cy = y + SH / 2;
        s += fl(`M${SX + SW} ${cy} C ${SX + SW + 14} ${cy}, ${GX - 14} ${LY}, ${GX} ${LY}`, 'fl-flow', {arrow: true});
      });
      /* excess lane: up from the gate to a discard mark */
      s += fl(`M${GC} ${GY} L${GC} 190`, 'fl-flow fl-down', {np: 0});
      s += xmark(GC, 176);
      s += pill(GC, 146, 'Excess may be discarded', 'r');
      s += T(GC, 104, 'events beyond the licensed peak', 'f-s', 'middle');
      s += T(GC, 118, 'for the rest of the hour', 'f-s', 'middle');
      /* heading above the excess lane */
      s += tier(SX, 40, 'LICENCE · PEAK HOUR, NOT AVERAGE');
      s += T(SX, 62, 'A quiet hour banks no capacity', 'f-t');
      s += T(SX, 78, 'for a busy one', 'f-t');

      /* ---- the Data Lake ---- */
      const LX = 342, LW = 136, LH = 112, LYT = LY - LH / 2;
      s += fl(`M${GX + GW} ${LY} L${LX} ${LY}`, 'fl-flow', {arrow: true});
      s += tile(LX, LYT, LW, LH, 'db', 'Cato Data Lake', ['3 / 6 / 12-month units', 'first unit included', 'deleted after retention'], {cls: 'pop'});
      s += T(LX + LW / 2, LYT + LH + 18, 'one variant applies to all units', 'f-s', 'middle');

      /* ---- export destinations (right) ---- */
      const EX = 556, EW = 190, EH = 50, EG = 12;
      const DST = [
        ['CMA Events page',  'Home → Events'],
        ['AWS S3 push feed', '60 s / 9.5 MB · .GZ'],
        ['Azure Blob feed',  'feed target · cadence not published'],
        ['eventsFeed API',   'pull · gzip: storage up to −95%'],
        ['SIEM ingestion',   'filtered, trimmed feed'],
      ];
      const XG = 20;   /* extra gap so the export tier sits over the four external targets only */
      const EY0 = LY - (DST.length * EH + (DST.length - 1) * EG + XG) / 2;
      s += tier(EX, EY0 - 14, 'CONSUME · IN THE CMA');
      s += tier(EX, EY0 + EH + EG + XG - 14, 'EXPORT · FREE OF CHARGE');
      DST.forEach(([t, sub], i) => {
        const y = EY0 + i * (EH + EG) + (i ? XG : 0), cy = y + EH / 2;
        const oy = LY + (i - 2) * 18;   /* spread the fan's origins down the lake's edge */
        s += fl(`M${LX + LW} ${oy} C ${LX + LW + 30} ${oy}, ${EX - 30} ${cy}, ${EX} ${cy}`, 'fl-net', {arrow: 'arr-n'});
        s += nd(EX, y, EW, EH, {t, s: [sub]});
      });
      s += T(EX + EW, EY0 + DST.length * (EH + EG) + XG + 4, 'up to 3 Event Integrations per account', 'f-m', 'end');
      return s;
    },
    title: 'The event pipeline: generation, rate limit, retention, export',
    desc: 'Cato services generate events according to policy tracking; an hourly rate gate sized in Data Lake units of 2.5 million events per hour admits them into the Data Lake, where they are held for the 3, 6 or 12-month variant and consumed through the CMA, an S3 or Azure Blob feed, the eventsFeed API or a SIEM, all free of charge.',
    legend: [['flow', 'Event generation — within the licensed hourly rate'], ['down', 'Beyond the hourly peak — may be discarded'], ['net', 'Export & ingestion — no additional Cato cost']],
  }],
});
