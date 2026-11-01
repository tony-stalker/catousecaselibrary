/* specs/management-soc-xdr.js — SOC Modernisation with XDR & MDR */
DG.page('management-soc-xdr', {
  spotlight: {
    hl: ['branch', 'users', 'cloud', 'pop', 'xops', 'msvc'],
    mods: ['sse'],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'cl-aws'}, {p: 'spine'}],   // 'atk' removed: the kit lights it as a green flow (no .attack view in the spotlight)
    steps: [
      {t: 'Every flow from every site, user and cloud instance already traverses a PoP: full telemetry on day one.', marks: ['branch', 'users', 'cloud']},
      {t: 'The single-pass engine inspects each flow once; attack traffic is blocked at the PoP, evidence recorded.', marks: ['pop']},
      {t: 'Cato XDR correlates the signals into one ranked story queue: ML criticality score, mapped to MITRE ATT&CK.', marks: ['xops']},
      {t: 'The analyst pivots story → events → policy fix in one console; Cato MDR works the same queue 24×7.', marks: ['msvc']},
    ],
    anchors: {msvc: [1524, 154], cloud: [1450, 326]},   // msvc inside the Managed services box right of its title; cloud beside AWS
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 560',
    draw: K => {
      const {nd, tile, side, popBox, fl, T, I, tier, pill, xmark} = K;
      let s = '';

      /* ---- top: integrations reached through the Response Policy and connectors ---- */
      s += tier(230, 16, 'INTEGRATIONS · RESPONSE POLICY RULES & CONNECTORS');
      const IY = 28, IW = 160, IH = 90;
      s += tile(230, IY, IW, IH, 'console', 'SIEM', ['Splunk · Sentinel', 'story events · opt-in']);
      s += tile(402, IY, IW, IH, 'laptop', 'Endpoint alerts', ['Cato EPP · Defender', 'SentinelOne · CrowdStrike']);
      s += tile(574, IY, IW, IH, 'chat', 'Tickets & alerts', ['ServiceNow · Jira · Slack', 'webhooks · email']);

      /* ---- left: telemetry sources ---- */
      const SX = 14, SW = 176, SH = 56;
      s += tier(SX, 150, 'TELEMETRY FROM EVERY EDGE');
      const SRC = [
        [170, 'building', 'Sites & DCs',     'Socket · every flow'],
        [250, 'users',    'Remote users',    'Cato Client cohort'],
        [330, 'cpu',      'Cloud instances', 'every flow · via a PoP'],
      ];
      SRC.forEach(([y, ic, t, sub]) => { s += nd(SX, y, SW, SH, {t, s: [sub], ic, is: 20, icls: 'g'}); });

      /* ---- centre: the PoP inspects once ---- */
      const PX = 224, PY = 212, PW = 132, PH = 132, PC = PX + PW / 2, LY = PY + PH / 2;
      s += popBox(PX, PY, PW, PH, 'Cato PoP', 'single-pass engine');
      s += I('shield', PC - 11, 262, 22, 'ic g');
      s += T(PC, 308, 'inspects each flow once', 'f-s', 'middle');
      s += T(PC, 322, 'full network telemetry', 'f-s', 'middle');
      SRC.forEach(([y], i) => {
        const cy = y + SH / 2, ty = LY + (i - 1) * 28;
        s += fl(`M${SX + SW} ${cy} C ${SX + SW + 16} ${cy}, ${PX - 16} ${ty}, ${PX} ${ty}`, 'fl-flow', {arrow: true, dur: 1.2 + i * .1});
      });

      /* ---- centre-right: XDR correlates ---- */
      const XX = 392, XW = 170, XH = 112, XY = LY - XH / 2;
      s += fl(`M${PX + PW} ${LY} L${XX} ${LY}`, 'fl-flow', {arrow: true});
      s += tile(XX, XY, XW, XH, 'eye', 'Cato XDR', ['correlated incident stories', 'ML criticality score', 'MITRE ATT&CK mapping'], {cls: 'pop'});
      /* stories out to the SIEM and to tickets & alerts; endpoint alerts in */
      s += fl(`M${XX + 28} ${XY} C ${XX + 28} ${XY - 52}, 310 ${IY + IH + 52}, 310 ${IY + IH}`, 'fl-flow', {arrow: true, dur: .9});
      s += fl(`M482 ${IY + IH} L482 ${XY}`, 'fl-flow', {arrow: true, dur: .7});
      s += fl(`M${XX + XW - 28} ${XY} C ${XX + XW - 28} ${XY - 52}, 654 ${IY + IH + 52}, 654 ${IY + IH}`, 'fl-flow', {arrow: true, dur: .9});
      s += T(494, 160, 'alerts in', 'f-m');
      s += T(326, 160, 'stories out', 'f-m', 'end');
      s += T(634, 160, 'stories out', 'f-m');

      /* ---- right: one ranked queue, the analyst, MDR ---- */
      const QX = 600, QW = 146;
      s += fl(`M${XX + XW} ${LY} L${QX} ${LY}`, 'fl-flow', {arrow: true});
      s += nd(QX, LY - 42, QW, 84, {t: 'Incident story', s: ['one ranked queue', 'criticality first'], cls: 'hot'});
      const AY = 350, AH = 96, AC = QX + QW / 2;
      s += fl(`M${AC} ${LY + 42} L${AC} ${AY}`, 'fl-flow', {arrow: true, dur: .6});
      s += tile(QX, AY, QW, AH, 'users', 'SOC analyst', ['story → events → fix']);
      s += fl(`M${AC} ${AY + AH} L${AC} 470`, 'fl-flow', {np: 0});
      s += side(566, 470, 180, 48, 'Cato MDR · 24×7', 'works the same queue', 'shield');

      /* ---- remediation: the policy fix goes back to the PoP from the same console ---- */
      s += fl(`M${QX} 420 C 480 420, ${PC} 440, ${PC} ${PY + PH + 2}`, 'fl-net', {arrow: 'arr-n', dur: 1.4, label: 'Policy fix · same console', lx: 450, ly: 424, lcls: 'g'});

      /* ---- attack traffic: blocked at the PoP, evidence recorded ---- */
      s += nd(SX, 440, SW, SH, {t: 'Attack traffic', s: ['IPS · Anti-Malware hits'], ic: 'xc', is: 20, icls: 'r', cls: 'dash'});
      s += fl(`M${SX + SW} 468 C 230 468, 252 410, 256 ${PY + PH + 10}`, 'fl-attack', {np: 0});
      s += xmark(256, PY + PH + 8);
      s += pill(SX + SW / 2, 420, 'blocked · evidence recorded', 'r');
      return s;
    },
    title: 'Cato XDR: from full telemetry to a ranked story queue',
    desc: 'Every flow already traverses a Cato PoP, so Cato XDR starts with full network telemetry and correlates it (with the endpoint alerts the customer owns) into ML-scored, MITRE ATT&CK-mapped incident stories in one ranked queue for the SOC analyst and Cato MDR, with the policy fix applied from the same console and stories fed to the SIEM and ticketing tools.',
    caption: 'Every flow already traverses the PoP, so XDR starts with full network telemetry — no agents to roll out, no logs to ship. Signals become one ranked story queue; the fix goes back into policy from the same console.',
    legend: [['flow', 'Telemetry in · stories and events out'], ['net', 'Guided remediation → policy fix'], ['attack', 'Attack traffic — blocked at the PoP, evidence recorded'], 'live'],
  }],
});
