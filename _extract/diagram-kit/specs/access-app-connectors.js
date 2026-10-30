/* specs/access-app-connectors.js — Private Access with App Connectors */
DG.page('access-app-connectors', {
  spotlight: {
    hl: ['users', 'pop', 'backbone', 'cloud', 'dc'],
    mods: ['uztna'],
    flows: [{p: 'us1'}, {p: 'us2'}, {p: 'r-CR'}, {p: 'cl-aws'}, {p: 'dc1', rev: true}],
    steps: [
      {t: 'Users connect with the Cato Client or a browser; they never receive network access.', marks: ['users']},
      {t: 'The nearest PoP checks identity and device posture against the Private Access Policy.', marks: ['pop']},
      {t: 'Authorised sessions are brokered to the app through an outbound-only App Connector.', marks: ['cloud', 'dc']},
    ],
  },
  diagrams: [{
    slot: 'main',
    fig: 'cloudAppc',
    edits: [['outbound only · TLS', 'outbound only · DTLS'], ['marketplace image · private IPs only · no inbound rules', 'marketplace image · internal addresses only · no inbound rules']],
    title: 'Private Access through App Connectors',
    desc: 'Users reach private applications in cloud and in the data centre through outbound-only App Connectors; the PoP enforces the Private Access Policy before any session is brokered.',
    legend: [['flow', 'Brokered session (DTLS tunnel)'], ['https', 'Client or browser to the PoP'], 'live'],
  }],
});
