/* specs/security-dlp-forensics.js — Data Breach Investigation with DLP Forensics */
DG.page('security-dlp-forensics', {
  spotlight: {
    hl: ['users', 'pop', 'saas', 'cloud', 'mgmt'],
    mods: ['sse'],
    anchors: {mgmt: [782, 132], cloud: [1443, 331], genai: [105, 338]},   // step-4 marker on the CMA top edge; step-3 right of the AWS cloud, clear of the '4' heading; step-1 above the GenAI cloud
    flows: [{p: 'us1'}, {p: 'm1'}],   // no live traffic into the blocked GenAI app; evidence path is an API integration, not a tunnel
    steps: [
      {t: 'Priya uploads a document containing credit-card PII towards Microsoft Copilot.', marks: ['users', 'genai']},
      {t: 'The PoP DLP engine blocks the upload inline and raises a DLP event with its metadata.', marks: ['pop']},
      {t: "An encrypted forensic snippet is written to the customer's own S3 bucket under a per-account key.", marks: ['cloud']},
      {t: 'Marcus opens the Data Incident in the CMA and views the evidence under RBAC; every view is audited.', marks: ['mgmt']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 40 760 470',
    draw: K => {
      const {nd, tile, fl, T, cloud, fpin, ring, pill, tier, xmark} = K;
      let s = '';
      /* --- Cato: backbone ring with the PoP pin on it --- */
      s += tier(330, 56, 'CATO SASE CLOUD');
      s += ring({cx: 380, cy: 150, rx: 150, ry: 32}, 'Backbone');
      s += fpin(380, 188, 26, 'PoP', {halo: true});
      s += T(380, 214, 'Cato PoP', 'nd-t g', 'middle');
      s += pill(380, 234, 'DLP engine · inline TLS inspection', 'g keep');

      /* --- left: the user and her upload --- */
      s += tier(20, 100, 'USER');
      s += nd(20, 112, 180, 64, {t: 'Priya', s: ['Uploads a document', 'with credit-card PII'], ic: 'user'});
      s += fl('M200 144H352', 'fl-https', {dur: 1.2, label: 'Upload · PII', lx: 300, ly: 144});

      /* --- top right: the GenAI destination, never reached --- */
      s += cloud(655, 108, 1.2, 'Microsoft Copilot', 'GenAI SaaS app', 'ai');
      s += fl('M400 132C460 112 520 110 556 110', 'fl-down', {np: 0, label: 'Blocked by DLP rule', lcls: 'r', lx: 480, ly: 86});
      s += xmark(566, 110);

      /* --- bottom row: investigator, CMA, customer-owned evidence --- */
      s += tier(20, 346, 'INVESTIGATION');
      s += nd(20, 358, 176, 64, {t: 'Marcus', s: ['SOC analyst', 'DLP investigator'], ic: 'user'});
      s += tile(300, 330, 200, 104, 'console', 'Cato Management App', ['Data Incident → View Evidence'], {cls: 'pop'});
      s += tile(556, 330, 190, 104, 'lock', 'Customer S3 bucket', ['Your AWS account', 'Per-account encryption key']);

      /* PoP → CMA: the event and its metadata */
      s += fl('M380 246V328', 'fl-flow', {arrow: 'arr-m', dur: 1, label: 'DLP event + metadata', lx: 380, ly: 288});
      /* PoP → S3: the encrypted forensic snippet */
      s += fl('M482 234C540 234 620 250 651 328', 'fl-flow', {arrow: 'arr-m', dur: 1.4, label: 'Encrypted forensic snippet', lx: 652, ly: 228});
      /* Marcus → CMA */
      s += fl('M196 390H298', 'fl-https', {dur: 1, label: 'Investigates', lx: 248, ly: 390});
      /* CMA ↔ S3: governed retrieval */
      s += fl('M400 436C400 486 651 486 651 436', 'fl-priv', {dur: 1.6, label: 'View evidence · RBAC + audit', lx: 526, ly: 480});
      return s;
    },
    title: 'DLP forensics flow — blocked upload, encrypted evidence, governed retrieval',
    desc: "A user's upload of credit-card PII to Microsoft Copilot is blocked by the PoP DLP engine; an encrypted forensic snippet is written to the customer's own S3 bucket under a per-account key, and a SOC analyst retrieves it from the CMA Data Incident under RBAC with every view audited.",
    legend: [['down', 'Sensitive upload blocked at the PoP'], ['flow', 'DLP event and encrypted evidence from the PoP'], ['priv', 'Evidence retrieval — RBAC-governed, fully audited'], ['https', 'User or admin session'], 'live'],
  }],
});
