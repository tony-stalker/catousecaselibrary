/* specs/demo-app-connectors.js — Demo Segment 6: App Connectors (one published name, two outcomes) */
DG.page('demo-app-connectors', {
  spotlight: {
    hl: ['users', 'pop', 'dc', 'mgmt'],
    mods: ['uztna'],
    flows: [{p: 'us1'}, {p: 'us2'}, {p: 'dc1', rev: true}, {p: 'm1'}],
    steps: [
      {t: 'Marcus and a contractor both type app.example.intranet; neither ever learns an internal address.', marks: ['users']},
      {t: 'The PoP evaluates the Private Access Policy: Marcus gets a synthetic IP; the contractor’s lookup is denied.', marks: ['pop']},
      {t: 'His session is brokered over the connector’s outbound DTLS tunnel to the app in the acquired DC.', marks: ['dc']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 500',
    draw: K => {
      const {nd, fl, T, tier, popBox, site, pill, xmark, mark} = K;
      let s = '';

      /* TOP · the control plane: the one rule the broker evaluates */
      s += tier(260, 26, 'CONTROL PLANE');
      s += nd(260, 36, 220, 54, {t: 'Private Access Policy', s: ['group · posture · app'], ic: 'key', cls: 'dash'});
      s += fl('M370 90L370 140', 'fl-net', {np: 0});

      /* LEFT · two users, one published name */
      s += tier(14, 184, 'TWO USERS, ONE NAME');
      s += nd(14, 196, 180, 62, {t: 'Marcus · Cato Client', s: ['Finance group · posture pass'], ic: 'laptop'});
      s += mark(194, 196, 'ok');
      s += T(104, 293, 'both type the same name', 'f-s', 'middle');
      s += pill(104, 312, 'app.example.intranet', 'm keep');
      s += nd(14, 342, 180, 62, {t: 'Contractor · Cato Client', s: ['No matching rule'], ic: 'laptop'});
      s += mark(194, 342, 'no');

      /* CENTRE · the PoP brokers and Cato DNS is the gate */
      s += popBox(250, 140, 240, 290, 'Cato PoP', 'ZTNA broker · Cato DNS');
      s += nd(264, 196, 212, 62, {t: 'Rule matched', s: ['Cato DNS returns a synthetic IP', 'session brokered to the app']});
      s += pill(446, 196, 'Allow', 'g keep');
      s += T(370, 296, 'evaluated top down', 'f-s', 'middle');
      s += T(370, 310, 'first match wins', 'f-s', 'middle');
      s += nd(264, 342, 212, 62, {t: 'No rule matched', s: ['Cato DNS denies the lookup', 'domain does not resolve']});
      s += pill(446, 342, 'Block', 'r keep');

      /* RIGHT · the acquired data centre: connector beside the app, nothing inbound */
      s += site(556, 150, 190, 280, 'Acquired DC · LAN');
      s += nd(566, 196, 170, 62, {t: 'App Connector', s: ['outbound DTLS · group'], ic: 'appc'});
      s += nd(566, 342, 170, 62, {t: 'Internal app', s: ['internal address'], ic: 'server'});
      s += fl('M651 258L651 342', 'fl-net', {np: 0, label: 'local forward', lx: 651, ly: 300});

      /* FLOWS · Marcus in; the connector dials out; the session rides the tunnel */
      s += fl('M194 227L264 227', 'fl-tun', {arrow: true, dur: 1.1});
      s += fl('M566 212L490 212', 'fl-tun', {arrow: true, dur: 1.2, label: 'dials out', lx: 523, ly: 192});
      s += fl('M476 242L566 242', 'fl-flow', {arrow: true, dur: 1.2});

      /* the contractor: the lookup stops at the PoP; nothing reaches the right */
      s += fl('M194 373L264 373', 'fl-down', {np: 0});
      s += xmark(476, 373);

      /* FOOTER · the whole policy */
      s += T(380, 470, 'One rule: Finance group · Device Posture Profile · Private App → Allow', 'f-m', 'middle');
      return s;
    },
    title: 'The PoP brokers; DNS is the gate; the connector forwards',
    desc: 'Two users type the same published name: the PoP evaluates the Private Access Policy, Cato DNS returns a synthetic IP for the authorised user, whose session is brokered over the App Connector’s outbound DTLS tunnel, while the unauthorised user’s lookup is denied and the application stays invisible.',
    legend: [
      ['tun', 'Encrypted tunnels: Cato Client in, connector dialling out'],
      ['flow', 'Rule matched — synthetic IP returned, session stitched through the connector'],
      ['down', 'No rule — Cato DNS denies the lookup, nothing reaches the application'],
      ['net', 'Control plane: policy objects and the connector’s local forwarding'],
    ],
  }],
});
