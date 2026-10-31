/* specs/management-pov-framework.js — Running a Cato PoV */
DG.page('management-pov-framework', {
  spotlight: {
    hl: ['branch', 'users', 'pop', 'mgmt'],
    mods: [],
    flows: [{p: 'br1'}, {p: 'us1'}],
    anchors: {mgmt: [782, 132]},   // steps 1·4 marker on the CMA box's top edge, clear of its subtitle
    steps: [
      {t: 'Scope workshop: success criteria are agreed and written down before anything is built.', marks: ['mgmt']},
      {t: 'Build the pilot: one branch Socket plus a pilot group on the Cato Client, with the IdP syncing.', marks: ['branch', 'users']},
      {t: 'Test cycles work the register on the pilot’s own traffic; evidence is recorded weekly as it lands.', marks: ['pop']},
      {t: 'The wrap-up puts findings next to the criteria in a decision meeting booked at the workshop.', marks: ['mgmt']},
    ],
  },
  diagrams: [{
    slot: 'main',
    vb: '0 0 760 400',
    draw: K => {
      const {nd, fl, T, tier, pill, chipRow, xmark} = K;
      let s = '';
      /* ---- five stages on one baseline ---- */
      const W = 124, G = 28, H = 62, Y = 152, CY = Y + H / 2;
      const X = [14, 166, 318, 470, 622];
      const stages = [
        ['Scope workshop', ['Success criteria', 'agreed']],
        ['Build', ['Prereqs · IdP · TLSi']],
        ['Test cycles', ['Register worked', 'wk 1–N']],
        ['Wrap-up', ['Findings vs criteria']],
        ['Decision', ['Go · next steps']],
      ];
      stages.forEach(([t, sub], i) => {
        s += nd(X[i], Y, W, H, {t, s: sub, cls: i === 4 ? 'hot' : ''});
        if (i < 4) s += fl(`M${X[i] + W} ${CY}L${X[i + 1]} ${CY}`, 'fl-flow', {np: 0, arrow: 'arr-m'});
      });
      /* ---- the success-criteria thread beneath all five ---- */
      const TY = Y + H + 26;
      s += fl(`M${X[0] + 20} ${TY}L${X[4] + W - 14} ${TY}`, 'fl-hot', {arrow: 'arr-m', dur: 3, n: 3,
        label: 'success criteria agreed once · travel with the PoV', lx: 176, ly: TY, lcls: 'g'});
      /* ---- weekly sync loop above test cycles ---- */
      const LX = X[2] + W / 2, LR = 36, LCY = Y - 12 - LR;
      s += fl(`M${LX} ${LCY - LR}A${LR} ${LR} 0 1 1 ${LX} ${LCY + LR}A${LR} ${LR} 0 1 1 ${LX} ${LCY - LR}`, 'fl-flow', {dur: 2.4, n: 2, arrow: 'arr-m'});
      s += T(LX, LCY - 3, 'weekly', 'f-s', 'middle') + T(LX, LCY + 10, 'sync', 'f-s', 'middle');
      s += pill(LX, LCY - LR - 22, 'Weekly 30-min sync — findings recorded as they land');
      /* ---- evidence accumulates beneath test cycles ---- */
      const EY = TY + 22;
      s += chipRow(LX - 97, EY, ['wk 1', 'wk 2', 'wk 3', '…'], 44, 20, 6, 'g');
      s += T(LX, EY + 38, 'EVIDENCE ACCUMULATES WEEKLY', 'tier', 'middle');
      /* ---- unscoped drift: cut and parked ---- */
      const XX = 572, XY = TY + 112;
      s += fl(`M${X[2] + W} ${CY + 18}C${X[2] + W + 60} ${CY + 24} ${XX - 34} ${XY - 70} ${XX - 11} ${XY - 6}`, 'fl-ha', {np: 0, arrow: 'arr-y'});
      s += pill(XX + 68, TY + 42, 'Unscoped asks — "can it also…?"', 'y');
      s += xmark(XX, XY);
      s += T(XX + 12, XY + 30, 'cut here → parked in writing', 'f-s', 'end');
      s += nd(XX + 28, XY - 26, 146, 52, {t: 'Next-steps register', s: ['parked, not the PoV'], cls: 'dash'});
      return s;
    },
    title: 'The Cato PoV pipeline',
    desc: 'Five stages run left to right, from scope workshop, build and test cycles to wrap-up and decision, joined by a success-criteria thread; a weekly sync loop and accumulating evidence sit around the test cycles, and unscoped asks are cut off into a next-steps register.',
    legend: [['hot', 'Agreed scope — the success-criteria thread'], ['ha', 'Unscoped drift — cut and parked'], ['flow', 'Weekly sync · stage hand-off']],
  }],
});
