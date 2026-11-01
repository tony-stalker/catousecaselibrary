/* specs/security-ransomware.js — Ransomware & Advanced Threat Prevention */
DG.page('security-ransomware', {
  spotlight: {
    hl: ['users', 'branch', 'cloud', 'pop', 'saas', 'xops'],
    mods: ['sse'],
    flows: [{p: 'br1'}, {p: 'us1'}, {p: 'cl-aws'}, {p: 'eg-www'}, {p: 'spine'}],
    steps: [
      {t: 'Every flow from every site, remote user and cloud instance crosses a PoP; there is no unexamined path.', marks: ['branch', 'users']},
      {t: 'SPACE inspects it once against every engine: SWG, DNS, IPS, NGAM, sandbox, firewall and DLP.', marks: ['pop']},
      {t: 'Six kill-chain stages meet six independent controls, from delivery through C2 to exfiltration.', marks: ['pop']},
      {t: 'XDR correlates every blocked attempt into one incident story mapped to MITRE ATT&CK.', marks: ['xops']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 790 340',
    draw: K => {
      const {nd, fl, T, L, cloud, tier, xmark} = K;
      let s = '';
      /* legitimate lane */
      s += T(395, 18, 'Legitimate traffic — inspected in a single pass, delivered without detour', 'f-s', 'middle');
      s += fl(L(20, 36, 770, 36), 'fl-flow', {arrow: 'arr-m', dur: 2.2, n: 3});
      /* attacker */
      s += cloud(54, 122, .82, 'Attacker', 'threat actor', 'bad');
      /* kill chain */
      s += tier(110, 84, 'THE RANSOMWARE KILL CHAIN →');
      const stages = [['Delivery', 'phishing · drive-by'], ['Exploit', 'unpatched CVE'], ['Payload', 'malware executes'],
        ['C2', 'beacon to operator'], ['Lateral movement', 'spreads over WAN'], ['Exfiltration', 'data staged out']];
      const controls = [['SWG + DNS', 'delivery blocked'], ['IPS', 'virtual patching'], ['NGAM + Sandbox', 'known & zero-day'],
        ['IPS + DNS', 'C2 cut off'], ['Segmentation', 'spread contained'], ['DLP', 'exfil stopped']];
      const X = i => 110 + i * 112, W = 108, CX = i => X(i) + W / 2, AY = 196;
      /* box titles one step smaller than nd-t so the longest ('Lateral movement', 'NGAM + Sandbox') sit unsqueezed in 108 */
      const box = (i, y, t, sub, cls, tcls) => nd(X(i), y, W, 52, {t: '', s: [sub], cls})
        + T(CX(i), y + 24, t, 'nd-t ' + tcls, 'middle', 'style="font-size:11px"');
      stages.forEach(([t, sub], i) => {
        s += box(i, 96, t, sub, 'soft', '');
        if (i < 5) s += fl(L(X(i) + W, 122, X(i + 1), 122), 'fl-net', {np: 0});
      });
      /* attack path, blocked at every stage */
      s += fl(`M54 154C54 184 90 ${AY} ${CX(0) - 11} ${AY}`, 'fl-attack', {dur: 1.2, pcls: 'pt red'});
      for (let i = 0; i < 5; i++) s += fl(L(CX(i) + 11, AY, CX(i + 1) - 11, AY), 'fl-attack', {dur: 1.2, pcls: 'pt red'});
      /* controls */
      controls.forEach(([t, sub], i) => {
        s += fl(L(CX(i), 238, CX(i), AY + 11), 'fl-hot', {np: 0});
        s += box(i, 238, t, sub, 'pop', 'g');
      });
      for (let i = 0; i < 6; i++) s += xmark(CX(i), AY);
      /* footer */
      s += T(395, 320, 'All six controls run in the Cato PoP — one engine (SPACE), one policy, every flow: WAN, internet, cloud and remote user', 'f-s', 'middle');
      return s;
    },
    title: 'Cato controls breaking the ransomware kill chain at every stage',
    desc: 'A six-stage ransomware kill chain — delivery, exploit, payload, C2, lateral movement, exfiltration — is blocked at every stage by a Cato control running in the PoP: SWG and DNS security, IPS virtual patching, NGAM with sandboxing, IPS and DNS for C2, segmentation and DLP, while legitimate traffic flows unaffected.',
    legend: [['flow', 'Legitimate traffic — unaffected'], ['attack', 'Ransomware kill chain — blocked at every stage'], 'live'],
  }],
});
