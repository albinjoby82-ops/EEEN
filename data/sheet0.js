// SHEET 0 — DC resistive circuits (Homework 0 + every matching past-paper question)
(function (G) {
  const { S, U } = G;
  const T = String.raw;
  const D = (tex) => '<div class="m">$$' + tex + '$$</div>';
  const I = (tex) => '\\(' + tex + '\\)';
  const st = U.st, gt = U.givenTex;
  const step = (title, body) => `<div class="step"><h4>${title}</h4>${body}</div>`;
  const trap = (t) => `<div class="trap"><b>Trap</b> ${t}</div>`;
  const tip = (t) => `<div class="tipbox"><b>Why it works</b> ${t}</div>`;
  const par = (a, b) => a * b / (a + b);
  const w = (body, wd, ht) => S.svg(wd, ht, body);
  const has = (x, n) => x && x.hl && x.hl.includes(n);

  // parameter spec: base value (SI), unit, student-number symbol, step per digit, random generator
  const p = (base, unit, sym, stepv, rand) => ({ base, unit, sym, step: stepv ?? (unit === 'Ω' ? 1 : 1e-3), rand });
  const rR = (lo, hi) => () => U.R.res(lo, hi);

  // ============ FIGURES ============
  const F = {};
  const val = (x, v, k, u) => x && x.noval ? '' : U.given(v[k], u);

  F.hw1a = (v, x = {}) => w(
    S.V([90, 40], [90, 115], { lab: 'Va', side: 'left', val: val(x, v, 'Va', 'V'), hl: has(x, 'V') }) +
    S.V([90, 115], [90, 190], { lab: 'Vb', side: 'left', val: val(x, v, 'Vb', 'V'), hl: has(x, 'V') }) +
    S.wire([[90, 40], [250, 40]]) + S.wire([[90, 190], [250, 190]]) +
    S.R([250, 40], [250, 115], { lab: 'R1', val: val(x, v, 'R1', 'Ω'), hl: has(x, 'R1') }) +
    S.R([250, 115], [250, 190], { lab: 'R2', val: val(x, v, 'R2', 'Ω'), hl: has(x, 'R2') }) +
    S.dot([250, 40]) + S.dot([250, 115]) + S.dot([250, 190]) + S.dot([90, 115]) +
    S.flag([250, 40], '1', 'up') + S.flag([250, 190], '3', 'down') + S.flag([90, 115], '4', 'left') +
    S.text([236, 120], '2', { cls: 'sl b', anchor: 'end' }) +
    S.vmark([340, 52], [340, 108], 'V<tspan class="ssub" dy="4">12</tspan>', { dx: 0 }) + (x.extra || ''), 380, 250);

  F.hw1b = (v, x = {}) => w(
    S.V([50, 40], [50, 210], { lab: 'Vs', side: 'left', val: val(x, v, 'Vs', 'V') }) +
    S.wire([[50, 40], [250, 40]]) + S.wire([[50, 210], [250, 210]]) + S.wire([[160, 125], [250, 125]], { hl: has(x, 'mid') }) +
    S.R([160, 40], [160, 125], { lab: 'R1', side: 'left', val: val(x, v, 'R1', 'Ω'), hl: has(x, 'R1') }) +
    S.R([250, 40], [250, 125], { lab: 'R2', val: val(x, v, 'R2', 'Ω'), hl: has(x, 'R2') }) +
    S.R([160, 125], [160, 210], { lab: 'R3', side: 'left', val: val(x, v, 'R3', 'Ω'), hl: has(x, 'R3') }) +
    S.R([250, 125], [250, 210], { lab: 'R4', val: val(x, v, 'R4', 'Ω'), hl: has(x, 'R4') }) +
    S.dot([160, 40]) + S.dot([160, 125]) + S.dot([250, 125]) + S.dot([160, 210]) +
    S.arrow([160, 143], 'd', 'I(R3)', { tx: 172, ty: 147, anchor: 'start' }) + (x.extra || ''), 340, 235);

  F.hw1c = (v, x = {}) => {
    const up = x.dir === 'up';
    return w(
      S.I(up ? [60, 150] : [60, 50], up ? [60, 50] : [60, 150], { lab: 'I1', side: 'left', val: val(x, v, 'I1', 'A') }) +
      S.wire([[60, 50], [150, 50]]) + S.wire([[60, 150], [150, 150]]) +
      S.R([150, 50], [150, 150], { lab: 'R1', val: val(x, v, 'R1', 'Ω'), hl: has(x, 'R1') }) +
      S.R([150, 50], [270, 50], { lab: 'R2', val: val(x, v, 'R2', 'Ω'), hl: has(x, 'R2') }) +
      S.R([150, 150], [270, 150], { lab: 'R3', side: 'bottom', val: val(x, v, 'R3', 'Ω'), hl: has(x, 'R3') }) +
      S.dot([150, 50]) + S.dot([150, 150]) + S.term([270, 50], 'A', 'right') + S.term([270, 150], 'B', 'right') +
      S.vmark([300, 72], [300, 132], 'V', { dx: 18 }) + (x.extra || ''), 350, 200);
  };

  F.hw1d = (v, x = {}) => w(
    S.wire([[40, 40], [250, 40]]) + S.wire([[40, 210], [250, 210]]) + S.wire([[160, 125], [250, 125]], { hl: has(x, 'mid') }) +
    S.R([160, 40], [160, 125], { lab: 'R1', side: 'left', val: val(x, v, 'R1', 'Ω'), hl: has(x, 'R1') }) +
    S.R([250, 40], [250, 125], { lab: 'R2', val: val(x, v, 'R2', 'Ω'), hl: has(x, 'R2') }) +
    S.R([160, 125], [160, 210], { lab: 'R3', side: 'left', val: val(x, v, 'R3', 'Ω'), hl: has(x, 'R3') }) +
    S.R([250, 125], [250, 210], { lab: 'R4', val: val(x, v, 'R4', 'Ω'), hl: has(x, 'R4') }) +
    S.dot([160, 40]) + S.dot([160, 125]) + S.dot([250, 125]) + S.dot([160, 210]) +
    S.term([40, 40], 'A') + S.term([40, 210], 'B') + (x.extra || ''), 340, 240);

  F.hwq2 = (v, x = {}) => w(
    S.V([40, 50], [40, 220], { lab: 'V1', side: 'left', val: val(x, v, 'V1', 'V') }) +
    S.wire([[40, 50], [190, 50]]) + S.wire([[400, 50], [400, 220]], { hl: has(x, 'R6') }) + S.wire([[40, 220], [400, 220]]) + S.wire([[110, 135], [190, 135]], { hl: has(x, 'R2') }) +
    S.R([190, 50], [190, 135], { lab: 'R1', val: val(x, v, 'R1', 'Ω'), hl: has(x, 'R1') }) +
    S.R([110, 135], [110, 220], { lab: 'R2', side: 'left', val: val(x, v, 'R2', 'Ω'), hl: has(x, 'R2') }) +
    S.R([190, 135], [190, 220], { lab: 'R3', val: val(x, v, 'R3', 'Ω'), hl: has(x, 'R3') }) +
    S.R([190, 50], [300, 50], { lab: 'R4', val: val(x, v, 'R4', 'Ω'), hl: has(x, 'R4') }) +
    S.R([300, 50], [300, 220], { lab: 'R5', val: val(x, v, 'R5', 'Ω'), hl: has(x, 'R5') }) +
    S.R([300, 50], [400, 50], { lab: 'R6', val: val(x, v, 'R6', 'Ω'), hl: has(x, 'R6') }) +
    S.dot([190, 50]) + S.dot([190, 135]) + S.dot([300, 50]) + S.dot([300, 220]) + S.dot([190, 220]) + S.dot([110, 220]) +
    S.flag([190, 50], 'A', 'up') + S.flag([300, 50], 'C', 'up') + S.flag([190, 135], 'B', 'right') + S.flag([300, 220], 'D', 'down') + (x.extra || ''), 450, 265);

  F.aut25a = (v, x = {}) => w(
    S.V([40, 40], [40, 220], { lab: 'Vs', side: 'left', val: val(x, v, 'Vs', 'V') }) +
    S.wire([[40, 40], [300, 40]]) + S.wire([[40, 220], [300, 220]]) +
    S.R([140, 40], [140, 130], { lab: 'R1', side: 'left', val: val(x, v, 'R1', 'Ω'), hl: has(x, 'R1') }) +
    S.R([140, 130], [140, 220], { lab: 'R2', side: 'left', val: val(x, v, 'R2', 'Ω'), hl: has(x, 'R2') }) +
    S.R([300, 40], [300, 130], { lab: 'R3', val: val(x, v, 'R3', 'Ω'), hl: has(x, 'R3') }) +
    S.R([300, 130], [300, 220], { lab: 'R4', val: val(x, v, 'R4', 'Ω'), hl: has(x, 'R4') }) +
    (has(x, 'noR5') ? '' : S.R([140, 130], [300, 130], { lab: 'R5', side: 'bottom', val: val(x, v, 'R5', 'Ω'), hl: has(x, 'R5') }) +
      S.arrow([172, 130], 'r', 'I(R5)', { ty: 120 })) +
    S.dot([140, 40]) + S.dot([140, 130]) + S.dot([300, 130]) + S.dot([140, 220]) + S.dot([300, 40]) + S.dot([300, 220]) +
    S.text([130, 125], 'A', { cls: 'sl b', anchor: 'end' }) + S.text([312, 125], 'B', { cls: 'sl b', anchor: 'start' }) + (x.extra || ''), 380, 245);

  // AUT21/SPR22 (voltage source V4) and AUT22/SPR23 (current source I4) share a layout
  F.ladder3 = (v, x = {}) => {
    const mid = x.isrc
      ? S.I([280, 60], [160, 60], { lab: 'I4', side: 'top', val: val(x, v, 'I4', 'A'), hl: has(x, 'I4') })
      : S.V([160, 60], [280, 60], { lab: 'V4', side: 'top', val: val(x, v, 'V4', 'V'), hl: has(x, 'V4') });
    return w(
      S.V([40, 60], [40, 180], { lab: 'V1', side: 'left', val: val(x, v, 'V1', 'V') }) +
      S.R([40, 60], [160, 60], { lab: 'R2', val: val(x, v, 'R2', 'Ω'), hl: has(x, 'R2') }) +
      S.R([160, 60], [160, 180], { lab: 'R3', val: val(x, v, 'R3', 'Ω'), hl: has(x, 'R3') }) + mid +
      S.R([280, 60], [280, 180], { lab: 'R5', val: val(x, v, 'R5', 'Ω'), hl: has(x, 'R5') }) +
      S.wire([[40, 180], [280, 180]]) +
      S.dot([40, 60]) + S.dot([160, 60]) + S.dot([280, 60]) + S.dot([160, 180]) +
      S.flag([40, 60], '1', 'up') + S.flag([160, 60], '2', 'up') + S.flag([280, 60], '3', 'up') +
      (x.isrc ? S.flag([160, 180], '4', 'down') : S.gnd([160, 180])) + (x.extra || ''), 360, 230);
  };

  F.r2r = (v, x = {}) => w(
    S.R([60, 50], [180, 50], { lab: 'R1', val: val(x, v, 'R1', 'Ω'), hl: has(x, 'R1') }) +
    S.R([180, 50], [300, 50], { lab: 'R2', val: val(x, v, 'R2', 'Ω'), hl: has(x, 'R2') }) +
    S.wire([[300, 50], [300, 215]]) +
    S.R([60, 50], [60, 130], { lab: 'R3', val: val(x, v, 'R3', 'Ω'), hl: has(x, 'R3') }) +
    S.V([60, 130], [60, 215], { lab: 'Vb1', val: val(x, v, 'Vb1', 'V') }) +
    S.R([180, 50], [180, 130], { lab: 'R4', val: val(x, v, 'R4', 'Ω'), hl: has(x, 'R4') }) +
    S.V([180, 130], [180, 215], { lab: 'Vb0', val: val(x, v, 'Vb0', 'V') }) +
    S.wire([[60, 215], [300, 215]]) + S.gnd([300, 215]) +
    S.dot([60, 50]) + S.dot([180, 50]) + S.dot([180, 215]) +
    S.flag([60, 50], '1', 'up') + S.flag([180, 50], '2', 'up') + (x.extra || ''), 360, 250);

  F.twosrc = (v, x = {}) => w(
    (x.dc ? S.V : S.Vac)([40, 60], [40, 185], { lab: 'V1', side: 'left', val: x.v1txt || '' }) +
    S.R([40, 60], [170, 60], { lab: 'R1', val: val(x, v, 'R1', 'Ω'), hl: has(x, 'R1') }) +
    S.R([170, 60], [300, 60], { lab: 'R3', val: val(x, v, 'R3', 'Ω'), hl: has(x, 'R3') }) +
    S.R([170, 60], [170, 185], { lab: 'R2', val: val(x, v, 'R2', 'Ω'), hl: has(x, 'R2') }) +
    (x.dc ? S.V : S.Vac)([300, 60], [300, 185], { lab: 'V2', val: x.v2txt || '' }) +
    S.wire([[40, 185], [300, 185]]) + S.gnd([170, 185]) +
    S.dot([40, 60]) + S.dot([170, 60]) + S.dot([300, 60]) + S.dot([170, 185]) +
    S.flag([40, 60], '1', 'up') + S.flag([170, 60], '2', 'up') + S.flag([300, 60], '3', 'up') +
    (x.i1 ? S.arrow([70, 60], 'r', 'i<tspan class="ssub" dy="4">1</tspan>', { ty: 82 }) : '') + (x.extra || ''), 380, 230);

  F.spr21a = (v, x = {}) => {
    const up = x.dir !== 'down', plusLeft = x.pol !== 'right';
    return w(
      S.I(up ? [40, 175] : [40, 60], up ? [40, 60] : [40, 175], { lab: 'I1', side: 'left', val: val(x, v, 'I1', 'A') }) +
      S.R([40, 60], [160, 60], { lab: 'R2', val: val(x, v, 'R2', 'Ω'), hl: has(x, 'R2') }) +
      S.V(plusLeft ? [160, 60] : [280, 60], plusLeft ? [280, 60] : [160, 60], { lab: 'V3', side: 'top', val: val(x, v, 'V3', 'V'), hl: has(x, 'V3') }) +
      S.R([280, 60], [280, 175], { lab: 'R4', val: val(x, v, 'R4', 'Ω'), hl: has(x, 'R4') }) +
      S.wire([[40, 175], [280, 175]]) + S.gnd([160, 175]) +
      S.dot([40, 60]) + S.dot([160, 60]) + S.dot([280, 60]) + S.dot([160, 175]) +
      S.flag([40, 60], '1', 'up') + S.flag([160, 60], '2', 'up') + S.flag([280, 60], '3', 'up') + (x.extra || ''), 360, 225);
  };

  F.spr21b = (v, x = {}) => w(
    S.Vac([40, 60], [40, 175], { lab: 'V1', side: 'left', val: x.noval ? '' : U.given(v.Vm, 'V') + ' pk' }) +
    S.R([40, 60], [160, 60], { lab: 'R2', val: val(x, v, 'R2', 'Ω'), hl: has(x, 'R2') }) +
    S.R([160, 60], [160, 175], { lab: 'R3', val: val(x, v, 'R3', 'Ω'), hl: has(x, 'R3') }) +
    S.wire([[160, 60], [270, 60]]) +
    S.I([270, 175], [270, 60], { lab: 'I4', val: val(x, v, 'I4', 'A'), hl: has(x, 'I4') }) +
    S.wire([[40, 175], [270, 175]]) + S.gnd([160, 175]) +
    S.dot([40, 60]) + S.dot([160, 60]) + S.dot([160, 175]) +
    S.flag([40, 60], '1', 'up') + S.flag([160, 60], '2', 'up') +
    S.arrow([72, 60], 'r', 'I(R2)', { ty: 85 }) + (x.extra || ''), 360, 225);

  // ---- reduced / helper diagrams for solutions ----
  F.series2 = (srcLab, srcVal, top, bot, o = {}) => w(
    S.V([110, 40], [110, 200], { lab: srcLab, side: 'left', val: srcVal }) +
    S.wire([[110, 40], [240, 40]]) + S.wire([[110, 200], [240, 200]]) +
    S.R([240, 40], [240, 120], { lab: top[0], val: top[1], hl: o.hlTop }) +
    S.R([240, 120], [240, 200], { lab: bot[0], val: bot[1], hl: o.hlBot }) + S.dot([240, 120]) +
    (o.arrow ? S.arrow([175, 40], 'r', 'I', { ty: 30 }) : '') + (o.extra || ''), 340, 230);

  F.chain = (labs) => w( // A — R — R — B
    S.term([30, 60], 'A') + S.R([30, 60], [150, 60], { lab: labs[0][0], val: labs[0][1] }) + S.dot([150, 60]) +
    S.R([150, 60], [270, 60], { lab: labs[1][0], val: labs[1][1] }) + S.term([270, 60], 'B', 'right'), 320, 100);

  F.thev = (vth, rth, rl) => w(
    S.V([40, 50], [40, 170], { lab: 'Vth', side: 'left', val: vth }) +
    S.R([40, 50], [190, 50], { lab: 'Rth', val: rth }) +
    S.R([190, 50], [190, 170], { lab: 'R5', val: rl, hl: true }) + S.wire([[40, 170], [190, 170]]) +
    S.arrow([190, 82], 'd', 'I(R5)', { tx: 205 }), 320, 200);

  F.par = (rs, x = {}) => { // drill: n resistors in parallel between A and B
    const n = rs.length, xs = rs.map((_, i) => 120 + i * 90), last = xs[n - 1];
    let b = S.wire([[40, 40], [last, 40]]) + S.wire([[40, 170], [last, 170]]) + S.term([40, 40], 'A') + S.term([40, 170], 'B');
    rs.forEach((r, i) => { b += S.R([xs[i], 40], [xs[i], 170], { lab: 'R' + (i + 1), val: x.noval ? '' : U.given(r, 'Ω') }); if (i < n - 1) b += S.dot([xs[i], 40]) + S.dot([xs[i], 170]); });
    return w(b, last + 90, 200);
  };
  F.idiv = (v, x = {}) => w(
    S.I([50, 175], [50, 45], { lab: 'Is', side: 'left', val: val(x, v, 'Is', 'A') }) +
    S.wire([[50, 45], [240, 45]]) + S.wire([[50, 175], [240, 175]]) +
    S.R([140, 45], [140, 175], { lab: 'R1', val: val(x, v, 'R1', 'Ω'), hl: true }) +
    S.R([240, 45], [240, 175], { lab: 'R2', val: val(x, v, 'R2', 'Ω') }) +
    S.dot([140, 45]) + S.dot([140, 175]) + S.arrow([140, 70], 'd', 'I1', { tx: 120, anchor: 'end' }), 330, 205);
  F.loop = (v, x = {}) => w(
    S.V([60, 45], [60, 175], { lab: 'V', side: 'left', val: val(x, v, 'V', 'V') }) +
    S.wire([[60, 45], [200, 45]]) + S.wire([[60, 175], [200, 175]]) +
    S.R([200, 45], [200, 175], { lab: 'R', val: val(x, v, 'R', 'Ω'), hl: true }), 300, 205);

  // ============ helpers for text ============
  const nm = (k) => k.replace(/^([A-Za-z])(.+)$/, '$1<sub>$2</sub>');
  const tn = (k) => k.replace(/^([A-Za-z])(.+)$/, '$1_{$2}');

  // ============ QUESTIONS ============
  const Q = [];
  const add = (q) => { Q.push(q); return q; };

  // ---------------------------------------------------------------- HW 0 Q1(a)
  add({
    id: 'hw0-1a', family: 'hw0-1a', topics: ['div', 'src'], symset: 'hw',
    src: { type: 'hw', label: 'HW 0 · Q1(a)', marks: '15%' },
    title: 'Two sources in series + a voltage divider',
    params: { R1: p(1200, 'Ω', 'α', 1, rR()), R2: p(2200, 'Ω', 'δ', 1, rR()), Va: p(1.5, 'V', 'γ', 1e-3, () => U.R.volt(0.5, 6)), Vb: p(1.5, 'V', 'λ', 1e-3, () => U.R.volt(0.5, 6)) },
    ask: 'Calculate the voltage V<sub>12</sub> across resistor R<sub>1</sub>.',
    fig: (v) => F.hw1a(v),
    calc: (v) => ({ V12: (v.Va + v.Vb) * v.R1 / (v.R1 + v.R2) }),
    answers: [{ k: 'V12', label: 'V<sub>12</sub>', unit: 'V' }],
    net: (v) => [['V', '1', '4', v.Va], ['V', '4', '0', v.Vb], ['R', '1', '2', v.R1], ['R', '2', '0', v.R2]],
    probe: (m) => ({ V12: m.v('1') - m.v('2') }),
    hints: ['V<sub>a</sub> and V<sub>b</sub> are stacked + to −. What does that make the total voltage from node 1 to node 3?',
      'Only one current flows round the loop. V<sub>12</sub> is R<sub>1</sub>\'s share of the total — a voltage divider.'],
    sol: (v, a) => {
      const Vt = v.Va + v.Vb;
      return step('1 · Add the sources',
        `<p>V<sub>b</sub>'s + connects to V<sub>a</sub>'s −, so they <b>aid</b> each other. Node 1 sits ${I('V_a+V_b')} above node 3.</p>` +
        D(T`V_{13} = V_a + V_b = ${gt(v.Va, 'V')} + ${gt(v.Vb, 'V')} = ${gt(Vt, 'V')}`) +
        F.series2('Va+Vb', U.given(Vt, 'V'), ['R1', U.given(v.R1, 'Ω')], ['R2', U.given(v.R2, 'Ω')], { hlTop: true })) +
        step('2 · Voltage divider',
          `<p>R<sub>1</sub> and R<sub>2</sub> carry the same current, so they split V<sub>13</sub> in proportion to their size.</p>` +
          D(T`V_{12} = V_{13}\,\frac{R_1}{R_1+R_2}`) +
          D(T`V_{12} = ${gt(Vt, 'V')}\times\frac{${v.R1}}{${v.R1}+${v.R2}} = \boxed{${st(a.V12, 'V')}}`)) +
        tip('Node 1 is the + end, so V<sub>12</sub> comes out positive. Check: V<sub>23</sub> = V<sub>13</sub> − V<sub>12</sub> = ' + U.si(Vt - a.V12, 'V') + '.');
    },
  });

  // ---------------------------------------------------------------- HW 0 Q1(b)
  add({
    id: 'hw0-1b', family: 'hw0-1b', topics: ['req', 'div'], symset: 'hw',
    src: { type: 'hw', label: 'HW 0 · Q1(b)', marks: '15%' },
    title: 'Parallel pairs in series + a current divider',
    params: { Vs: p(9, 'V', null, 0, () => U.R.volt(3, 15)), R1: p(1000, 'Ω', 'δ', 1, rR()), R2: p(2200, 'Ω', 'ε', 1, rR()), R3: p(3300, 'Ω', 'θ', 1, rR()), R4: p(4700, 'Ω', 'α', 1, rR()) },
    ask: 'Calculate the current I(R3) flowing from top to bottom in resistor R<sub>3</sub>.',
    fig: (v) => F.hw1b(v),
    calc: (v) => { const R12 = par(v.R1, v.R2), R34 = par(v.R3, v.R4), It = v.Vs / (R12 + R34); return { IR3: It * v.R4 / (v.R3 + v.R4) }; },
    answers: [{ k: 'IR3', label: 'I(R<sub>3</sub>)', unit: 'A' }],
    net: (v) => [['V', 't', '0', v.Vs], ['R', 't', 'm', v.R1], ['R', 't', 'm', v.R2], ['R', 'm', '0', v.R3], ['R', 'm', '0', v.R4]],
    probe: (m, v) => ({ IR3: m.v('m') / v.R3 }),
    hints: ['The middle wire joins the bottom of R<sub>1</sub> and R<sub>2</sub>. Which two resistors share both their end nodes?',
      'Collapse R<sub>1</sub>∥R<sub>2</sub> and R<sub>3</sub>∥R<sub>4</sub>, find the total current, then split it between R<sub>3</sub> and R<sub>4</sub>.'],
    sol: (v, a) => {
      const R12 = par(v.R1, v.R2), R34 = par(v.R3, v.R4), It = v.Vs / (R12 + R34);
      return step('1 · Spot the parallel pairs',
        `<p>R<sub>1</sub> and R<sub>2</sub> both run from the top rail to the middle wire, so they are in <b>parallel</b>. Same for R<sub>3</sub> and R<sub>4</sub> (middle wire to bottom rail).</p>` +
        F.hw1b(v, { hl: ['mid'], noval: true }) +
        D(T`R_{12} = \frac{R_1R_2}{R_1+R_2} = \frac{${v.R1}\times${v.R2}}{${v.R1}+${v.R2}} = ${st(R12, 'Ω')}`) +
        D(T`R_{34} = \frac{R_3R_4}{R_3+R_4} = \frac{${v.R3}\times${v.R4}}{${v.R3}+${v.R4}} = ${st(R34, 'Ω')}`)) +
        step('2 · Total current from V<sub>s</sub>',
          F.series2('Vs', U.given(v.Vs, 'V'), ['R12', U.si(R12, 'Ω')], ['R34', U.si(R34, 'Ω')], { arrow: true, hlBot: true }) +
          D(T`I = \frac{V_s}{R_{12}+R_{34}} = \frac{${gt(v.Vs, 'V')}}{${st(R12 + R34, 'Ω', 4)}} = ${st(It, 'A')}`)) +
        step('3 · Current divider',
          `<p>I splits between R<sub>3</sub> and R<sub>4</sub>. The share through R<sub>3</sub> has the <b>other</b> resistor on top.</p>` +
          D(T`I(R_3) = I\,\frac{R_4}{R_3+R_4} = ${st(It, 'A')}\times\frac{${v.R4}}{${v.R3}+${v.R4}} = \boxed{${st(a.IR3, 'A')}}`)) +
        tip(`Smaller resistor, bigger current. Check: I(R<sub>4</sub>) = I − I(R<sub>3</sub>) = ${U.si(It - a.IR3, 'A')}, and I(R<sub>3</sub>)·R<sub>3</sub> = I(R<sub>4</sub>)·R<sub>4</sub> = ${U.si(a.IR3 * v.R3, 'V')}.`);
    },
  });

  // ---------------------------------------------------------------- HW 0 Q1(c)
  add({
    id: 'hw0-1c', family: 'hw0-1c', topics: ['src', 'ohm'], symset: 'hw',
    src: { type: 'hw', label: 'HW 0 · Q1(c)', marks: '15%' },
    title: 'Current source + open terminals (sign trap)',
    params: { I1: p(1e-3, 'A', null, 0, () => U.R.amp(0.5e-3, 5e-3)), R1: p(1200, 'Ω', 'η', 1, rR()), R2: p(2200, 'Ω', 'θ', 1, rR()), R3: p(3300, 'Ω', 'λ', 1, rR()) },
    ask: 'Calculate the voltage V between nodes A and B.',
    fig: (v) => F.hw1c(v),
    calc: (v) => ({ V: -v.I1 * v.R1 }),
    answers: [{ k: 'V', label: 'V = V<sub>AB</sub>', unit: 'V' }],
    net: (v) => [['I', 't', 'b', v.I1], ['R', 't', 'b', v.R1], ['R', 't', 'A', v.R2], ['R', 'b', 'B', v.R3], ['R', 'B', '0', 1e12], ['R', 'b', '0', 1e12]],
    probe: (m) => ({ V: m.v('A') - m.v('B') }),
    hints: ['A and B connect to nothing. How much current can flow through R<sub>2</sub> and R<sub>3</sub>?',
      'The arrow points <b>down</b> inside the source. Follow the current out of the bottom: which way does it go through R<sub>1</sub>? Current flows from + to − through a resistor.'],
    sol: (v, a) => step('1 · Open terminals carry no current',
      `<p>Nothing is connected across A–B, so I(R<sub>2</sub>) = I(R<sub>3</sub>) = 0. No current means <b>no voltage drop</b> on them.</p>` +
      D(T`V_A = V_{\text{top}}, \qquad V_B = V_{\text{bottom}}`) +
      F.hw1c(v, { hl: ['R1'], noval: true, extra: S.arrow([150, 125], 'u', 'I1', { tx: 162 }) })) +
      step('2 · Follow the arrow',
        `<p>The arrow points down, so current comes <b>out of the bottom</b> of the source, goes <b>up</b> through R<sub>1</sub>, and back into the top.</p><p>Current flows from high to low voltage in a resistor, so the <b>bottom is higher</b> than the top.</p>`) +
      step('3 · Ohm\'s law on R<sub>1</sub>',
        D(T`V = V_A - V_B = V_{\text{top}} - V_{\text{bottom}} = -I_1R_1`) +
        D(T`V = -(${gt(v.I1, 'A')})(${v.R1}\,\Omega) = \boxed{${st(a.V, 'V')}}`)) +
      trap('Writing +' + U.si(-a.V, 'V') + ' loses all the marks. Always ask: <i>which end does the current enter?</i> That end is +.'),
  });

  // ---------------------------------------------------------------- HW 0 Q1(d)
  add({
    id: 'hw0-1d', family: 'hw0-1d', topics: ['req'], symset: 'hw',
    src: { type: 'hw', label: 'HW 0 · Q1(d)', marks: '15%' },
    title: 'Equivalent resistance between A and B',
    params: { R1: p(1000, 'Ω', 'η', 1, rR()), R2: p(2200, 'Ω', 'θ', 1, rR()), R3: p(3300, 'Ω', 'λ', 1, rR()), R4: p(4700, 'Ω', 'α', 1, rR()) },
    ask: 'Calculate the equivalent resistance between nodes A and B.',
    fig: (v) => F.hw1d(v),
    calc: (v) => ({ Req: par(v.R1, v.R2) + par(v.R3, v.R4) }),
    answers: [{ k: 'Req', label: 'R<sub>AB</sub>', unit: 'Ω' }],
    net: (v) => [['I', '0', 'A', 1], ['R', 'A', 'm', v.R1], ['R', 'A', 'm', v.R2], ['R', 'm', '0', v.R3], ['R', 'm', '0', v.R4]],
    probe: (m) => ({ Req: m.v('A') }),
    hints: ['Name the nodes: A (top), the middle wire, B (bottom). The middle wire makes the two middle points <b>one node</b>.',
      'R<sub>1</sub> and R<sub>2</sub> both go A → middle. R<sub>3</sub> and R<sub>4</sub> both go middle → B.'],
    sol: (v, a) => {
      const R12 = par(v.R1, v.R2), R34 = par(v.R3, v.R4);
      return step('1 · Label the nodes',
        `<p>The middle wire joins the two middle points, so they are <b>one node</b>. Only 3 nodes: A, middle, B.</p>` + F.hw1d(v, { hl: ['mid'], noval: true })) +
        step('2 · Parallel pairs',
          D(T`R_1\parallel R_2 = \frac{${v.R1}\times${v.R2}}{${v.R1}+${v.R2}} = ${st(R12, 'Ω')}`) +
          D(T`R_3\parallel R_4 = \frac{${v.R3}\times${v.R4}}{${v.R3}+${v.R4}} = ${st(R34, 'Ω')}`)) +
        step('3 · The pairs are in series',
          F.chain([['R12', U.si(R12, 'Ω')], ['R34', U.si(R34, 'Ω')]]) +
          D(T`R_{AB} = R_1\parallel R_2 + R_3\parallel R_4 = \boxed{${st(a.Req, 'Ω')}}`)) +
        tip('Parallel is always <b>smaller</b> than the smallest resistor in it. Quick sanity check: R<sub>1</sub>∥R<sub>2</sub> < ' + v.R1 + ' Ω ✓.');
    },
  });

  // ---------------------------------------------------------------- HW 0 Q2
  add({
    id: 'hw0-2', family: 'hw0-2', topics: ['div', 'ohm', 'req'], symset: 'hw',
    src: { type: 'hw', label: 'HW 0 · Q2', marks: '40 marks' },
    title: 'Two dividers across one source + power',
    params: { V1: p(9, 'V', null, 0, () => U.R.volt(3, 15)), R1: p(1000, 'Ω', 'γ', 1, rR()), R2: p(2200, 'Ω', 'δ', 1, rR()), R3: p(3300, 'Ω', 'ε', 1, rR()) },
    note: 'R<sub>6</sub> = R<sub>1</sub>, R<sub>5</sub> = R<sub>2</sub>, R<sub>4</sub> = R<sub>3</sub>.',
    ask: '(a) Calculate V<sub>CA</sub> across R<sub>4</sub>. (c) Calculate the power dissipated in R<sub>1</sub>. (e) What is the power in R<sub>2</sub> at this V<sub>1</sub>, and how does it change as V<sub>1</sub> goes 0 → 9 V?',
    fig: (v) => F.hwq2({ ...v, R4: v.R3, R5: v.R2, R6: v.R1 }),
    calc: (v) => {
      const R23 = par(v.R2, v.R3), R56 = par(v.R2, v.R1);
      const VB = v.V1 * R23 / (v.R1 + R23), VC = v.V1 * R56 / (v.R3 + R56);
      return { VCA: VC - v.V1, PR1: (v.V1 - VB) ** 2 / v.R1, PR2: VB ** 2 / v.R2 };
    },
    answers: [{ k: 'VCA', label: 'V<sub>CA</sub>', unit: 'V' }, { k: 'PR1', label: 'P(R<sub>1</sub>)', unit: 'W' }, { k: 'PR2', label: 'P(R<sub>2</sub>)', unit: 'W' }],
    net: (v) => [['V', 'A', '0', v.V1], ['R', 'A', 'B', v.R1], ['R', 'B', '0', v.R2], ['R', 'B', '0', v.R3], ['R', 'A', 'C', v.R3], ['R', 'C', '0', v.R2], ['R', 'C', '0', v.R1]],
    probe: (m, v) => ({ VCA: m.v('C') - m.v('A'), PR1: (m.v('A') - m.v('B')) ** 2 / v.R1, PR2: m.v('B') ** 2 / v.R2 }),
    hints: ['Both branches (A–B–ground and A–C–ground) connect straight across V<sub>1</sub>. They do not affect each other.',
      'V<sub>CA</sub> = V<sub>C</sub> − V<sub>A</sub>, and V<sub>A</sub> = V<sub>1</sub>. Expect a <b>negative</b> answer.',
      'P = I²R or V²/R. For (e): V<sub>B</sub> is a fixed fraction of V<sub>1</sub>, so P(R<sub>2</sub>) ∝ V<sub>1</sub>².'],
    sol: (v, a) => {
      const R4 = v.R3, R5 = v.R2, R6 = v.R1;
      const R23 = par(v.R2, v.R3), R56 = par(R5, R6);
      const VB = v.V1 * R23 / (v.R1 + R23), VC = v.V1 * R56 / (R4 + R56), I1 = v.V1 / (v.R1 + R23);
      // little P vs V1 parabola
      const k = a.PR2 / (v.V1 ** 2); let path = '';
      for (let i = 0; i <= 30; i++) { const x = v.V1 * i / 30; path += (i ? 'L' : 'M') + (40 + 220 * i / 30).toFixed(1) + ',' + (160 - 130 * (k * x * x) / a.PR2).toFixed(1); }
      const plot = S.svg(300, 195, `<line x1="40" y1="160" x2="270" y2="160" stroke="var(--ink)"/><line x1="40" y1="160" x2="40" y2="20" stroke="var(--ink)"/>
        <path d="${path}" fill="none" stroke="var(--hl)" stroke-width="2.6"/><text x="265" y="180" class="sv" text-anchor="end">V1 = ${U.given(v.V1, 'V')}</text>
        <text x="30" y="40" class="sv" text-anchor="end">${U.si(a.PR2, 'W')}</text><text x="155" y="182" class="sv" text-anchor="middle">V1 (V)</text><text x="50" y="18" class="sv">P(R2)</text>`);
      return step('1 · See the two separate branches',
        `<p>A connects straight to V<sub>1</sub>'s + and D is its −. So <b>both branches get the full V<sub>1</sub></b> and are solved separately.</p>` +
        F.hwq2({ ...v, R4, R5, R6 }, { hl: ['R4', 'R5', 'R6'], noval: true }) +
        D(T`V_A = V_1 = ${gt(v.V1, 'V')}`)) +
        step('2 · Right branch: V<sub>C</sub>',
          D(T`R_5\parallel R_6 = \frac{${R5}\times${R6}}{${R5}+${R6}} = ${st(R56, 'Ω')}`) +
          D(T`V_C = V_1\,\frac{R_5\parallel R_6}{R_4 + R_5\parallel R_6} = ${gt(v.V1, 'V')}\times\frac{${U.num(R56, 4)}}{${R4}+${U.num(R56, 4)}} = ${st(VC, 'V')}`) +
          D(T`V_{CA} = V_C - V_A = ${st(VC, 'V')} - ${gt(v.V1, 'V')} = \boxed{${st(a.VCA, 'V')}}`)) +
        step('3 · Left branch: power in R<sub>1</sub>',
          D(T`R_2\parallel R_3 = ${st(R23, 'Ω')}, \qquad I(R_1) = \frac{V_1}{R_1 + R_2\parallel R_3} = ${st(I1, 'A')}`) +
          D(T`P(R_1) = I^2R_1 = (${st(I1, 'A')})^2\times${v.R1}\,\Omega = \boxed{${st(a.PR1, 'W')}}`)) +
        step('4 · Power in R<sub>2</sub> vs V<sub>1</sub>',
          D(T`V_B = V_1\,\frac{R_2\parallel R_3}{R_1+R_2\parallel R_3} = ${st(VB, 'V')}`) +
          D(T`P(R_2) = \frac{V_B^2}{R_2} = \boxed{${st(a.PR2, 'W')}} \quad\text{at } V_1 = ${gt(v.V1, 'V')}`) +
          `<p>V<sub>B</sub> is a fixed fraction of V<sub>1</sub>, so P(R<sub>2</sub>) grows with V<sub>1</sub><b>²</b> — a parabola (this is what the LTspice DC sweep shows).</p>` + plot) +
        tip('V<sub>CA</sub> is negative because C is lower than A. The subscript order matters: V<sub>CA</sub> = V<sub>C</sub> − V<sub>A</sub>.');
    },
  });

  // ================================================================= EXAM TWINS
  // ---- family hw0-1a: node voltage with several voltage sources
  const ladderV = (id, paper, q, target) => add({
    id, family: 'hw0-1a', topics: ['nodal', 'src'], symset: 'exam',
    src: { type: 'exam', paper, label: `${paper} · Q${q}`, marks: '20%' },
    title: target === 'e2' ? 'Node voltage with a floating source (supernode)' : 'Node voltage past a floating source',
    params: paper === 'AUT21'
      ? { V1: p(1, 'V', 'ε', 1e-3, () => U.R.volt(1, 9)), R2: p(2000, 'Ω', 'η', 1, rR()), R3: p(3000, 'Ω', 'θ', 1, rR()), V4: p(4, 'V', 'λ', 1e-3, () => U.R.volt(1, 9)), R5: p(5000, 'Ω', 'α', 1, rR()) }
      : { V1: p(5, 'V', 'ε', 1e-3, () => U.R.volt(1, 9)), R2: p(4000, 'Ω', 'η', 1, rR()), R3: p(3000, 'Ω', 'θ', 1, rR()), V4: p(2, 'V', 'λ', 1e-3, () => U.R.volt(1, 9)), R5: p(5000, 'Ω', 'α', 1, rR()) },
    ask: `Calculate the voltage at node ${target === 'e2' ? '2' : '3'} relative to ground.`,
    fig: (v) => F.ladder3(v),
    calc: (v) => { const e2 = (v.V1 / v.R2 + v.V4 / v.R5) / (1 / v.R2 + 1 / v.R3 + 1 / v.R5); return target === 'e2' ? { e2 } : { e3: e2 - v.V4 }; },
    answers: [{ k: target, label: target === 'e2' ? 'e<sub>2</sub>' : 'e<sub>3</sub>', unit: 'V' }],
    net: (v) => [['V', '1', '0', v.V1], ['R', '1', '2', v.R2], ['R', '2', '0', v.R3], ['V', '2', '3', v.V4], ['R', '3', '0', v.R5]],
    probe: (m) => ({ e2: m.v('2'), e3: m.v('3') }),
    hints: ['Node 1 is fixed: e<sub>1</sub> = V<sub>1</sub>. V<sub>4</sub> fixes the gap between nodes 2 and 3: e<sub>3</sub> = e<sub>2</sub> − V<sub>4</sub>.',
      'Only one unknown left (e<sub>2</sub>). Write KCL leaving node 2 — the current through V<sub>4</sub> is the current through R<sub>5</sub>.'],
    sol: (v, a) => {
      const e2 = (v.V1 / v.R2 + v.V4 / v.R5) / (1 / v.R2 + 1 / v.R3 + 1 / v.R5);
      return step('1 · What do the sources fix?',
        F.ladder3(v, { noval: true, hl: ['V4'], extra: S.nodeV([40, 60], 'V1', { dx: 0, dy: 140 }) + S.nodeV([160, 60], 'e2', { dx: -32, dy: 30 }) + S.nodeV([280, 60], 'e2 − V4', { dx: -50, dy: 34 }) }) +
        D(T`e_1 = V_1, \qquad e_3 = e_2 - V_4`) +
        `<p>V<sub>4</sub> floats between nodes 2 and 3 (+ on node 2). Treat nodes 2 and 3 as one <b>supernode</b>.</p>`) +
        step('2 · KCL out of the supernode',
          D(T`\frac{e_2 - V_1}{R_2} + \frac{e_2}{R_3} + \frac{(e_2 - V_4) - 0}{R_5} = 0`) +
          D(T`e_2 = \frac{\dfrac{V_1}{R_2} + \dfrac{V_4}{R_5}}{\dfrac{1}{R_2}+\dfrac{1}{R_3}+\dfrac{1}{R_5}}`)) +
        step('3 · Numbers',
          D(T`e_2 = \frac{\dfrac{${U.num(v.V1, 4)}}{${v.R2}} + \dfrac{${U.num(v.V4, 4)}}{${v.R5}}}{\dfrac{1}{${v.R2}}+\dfrac{1}{${v.R3}}+\dfrac{1}{${v.R5}}} = ${target === 'e2' ? T`\boxed{${st(e2, 'V')}}` : st(e2, 'V')}`) +
          (target === 'e3' ? D(T`e_3 = e_2 - V_4 = ${st(e2, 'V', 4)} - ${gt(v.V4, 'V')} = \boxed{${st(a.e3, 'V')}}`) : '')) +
        tip('Same pattern as HW 0 Q1(a): sources fix voltages, resistors share them. This form ' + I(T`e=\frac{\sum V_k/R_k}{\sum 1/R_k}`) + ' is <b>Millman\'s formula</b> — fast for one unknown node.');
    },
  });
  ladderV('aut21-1b', 'AUT21', '1(b)', 'e2');
  ladderV('spr22-1b', 'SPR22', '1(b)', 'e3');

  const r2r = (id, paper, target) => add({
    id, family: 'hw0-1a', topics: ['nodal'], symset: 'exam',
    src: { type: 'exam', paper, label: `${paper} · Q1(b)`, marks: '20%' },
    title: 'Two unknown nodes (R–2R ladder)',
    params: { Vb0: p(1, 'V', null, 0, () => U.R.volt(0.5, 5)), Vb1: p(1, 'V', null, 0, () => U.R.volt(0.5, 5)), R1: p(1000, 'Ω', null, 0, rR()), R2: p(2000, 'Ω', null, 0, rR()), R3: p(2000, 'Ω', null, 0, rR()), R4: p(2000, 'Ω', null, 0, rR()) },
    ask: `Calculate the voltage e<sub>${target === 'e1' ? 1 : 2}</sub> on node ${target === 'e1' ? 1 : 2} relative to ground.`,
    fig: (v) => F.r2r(v),
    calc: (v) => {
      const a11 = 1 / v.R3 + 1 / v.R1, a12 = -1 / v.R1, a22 = 1 / v.R1 + 1 / v.R4 + 1 / v.R2, b1 = v.Vb1 / v.R3, b2 = v.Vb0 / v.R4;
      const det = a11 * a22 - a12 * a12; const e1 = (b1 * a22 - a12 * b2) / det, e2 = (a11 * b2 - a12 * b1) / det;
      return target === 'e1' ? { e1 } : { e2 };
    },
    answers: [{ k: target, label: `e<sub>${target === 'e1' ? 1 : 2}</sub>`, unit: 'V' }],
    net: (v) => [['R', '1', '2', v.R1], ['R', '2', '0', v.R2], ['R', '1', 'x', v.R3], ['V', 'x', '0', v.Vb1], ['R', '2', 'y', v.R4], ['V', 'y', '0', v.Vb0]],
    probe: (m) => ({ e1: m.v('1'), e2: m.v('2') }),
    hints: ['Two unknown nodes: 1 and 2. Write KCL (currents leaving) at each one.',
      'Each source sits in series with a resistor, e.g. the current from node 1 down through R<sub>3</sub> is (e<sub>1</sub> − V<sub>b1</sub>)/R<sub>3</sub>.'],
    sol: (v, a) => {
      const a11 = 1 / v.R3 + 1 / v.R1, a12 = -1 / v.R1, a22 = 1 / v.R1 + 1 / v.R4 + 1 / v.R2, b1 = v.Vb1 / v.R3, b2 = v.Vb0 / v.R4;
      const det = a11 * a22 - a12 * a12; const e1 = (b1 * a22 - a12 * b2) / det, e2 = (a11 * b2 - a12 * b1) / det;
      const mS = (g) => U.num(g * 1000, 4); // in mS
      return step('1 · KCL at node 1',
        F.r2r(v, { noval: true, extra: S.nodeV([60, 50], 'e1', { dx: -35, dy: 40 }) + S.nodeV([180, 50], 'e2', { dx: -35, dy: 40 }) }) +
        D(T`\frac{e_1 - V_{b1}}{R_3} + \frac{e_1 - e_2}{R_1} = 0`)) +
        step('2 · KCL at node 2',
          D(T`\frac{e_2 - e_1}{R_1} + \frac{e_2 - V_{b0}}{R_4} + \frac{e_2}{R_2} = 0`)) +
        step('3 · Matrix form (conductances in mS, k&Omega; units → mA)',
          D(T`\begin{bmatrix} ${mS(a11)} & ${mS(a12)} \\ ${mS(a12)} & ${mS(a22)} \end{bmatrix}\begin{bmatrix} e_1 \\ e_2\end{bmatrix} = \begin{bmatrix} ${mS(b1)} \\ ${mS(b2)} \end{bmatrix}`)) +
        step('4 · Solve (Cramer\'s rule)',
          D(T`\Delta = ${mS(a11)}\times${mS(a22)} - (${mS(a12)})^2 = ${U.num(det * 1e6, 4)}`) +
          D(T`e_1 = \frac{${mS(b1)}\times${mS(a22)} - (${mS(a12)})(${mS(b2)})}{\Delta} = ${target === 'e1' ? T`\boxed{${st(e1, 'V')}}` : st(e1, 'V')}`) +
          D(T`e_2 = \frac{${mS(a11)}\times${mS(b2)} - (${mS(a12)})(${mS(b1)})}{\Delta} = ${target === 'e2' ? T`\boxed{${st(e2, 'V')}}` : st(e2, 'V')}`)) +
        tip('Working in kΩ and mA keeps numbers small: 1/1 kΩ = 1 mS. AUT23 asked for e<sub>1</sub>, SPR24 asked for e<sub>2</sub> of the <b>same circuit</b> — solve both every time.');
    },
  });
  r2r('aut23-1b', 'AUT23', 'e1');
  r2r('spr24-1b', 'SPR24', 'e2');

  const two = (id, paper, kind) => add({
    id, family: 'hw0-1a', topics: ['sup', 'nodal'], symset: 'exam',
    src: { type: 'exam', paper, label: `${paper} · Q1(a)`, marks: '20%' },
    title: kind === 'e2' ? 'Two sine sources, resistors only → e₂(t)' : 'Two sine sources, resistors only → i₁(t)',
    params: kind === 'e2'
      ? { A1: p(5, 'V', null, 0, () => U.R.ri(1, 9)), A2: p(2, 'V', null, 0, () => U.R.ri(1, 9)), R1: p(1200, 'Ω', null, 0, rR()), R2: p(2200, 'Ω', null, 0, rR()), R3: p(3300, 'Ω', null, 0, rR()), t0: p(1.25e-3, 's', null, 0, () => U.R.choice([0.25, 0.5, 0.75, 1, 1.25, 1.5]) * 1e-3) }
      : { A1: p(2, 'V', null, 0, () => U.R.ri(1, 9)), A2: p(5, 'V', null, 0, () => U.R.ri(1, 9)), R1: p(1200, 'Ω', null, 0, rR()), R2: p(2200, 'Ω', null, 0, rR()), R3: p(3300, 'Ω', null, 0, rR()), t0: p(1e-3, 's', null, 0, () => U.R.choice([0.25, 0.5, 0.75, 1, 1.25, 1.5]) * 1e-3) },
    hideParams: ['A1', 'A2'],
    lead: (v) => `V<sub>1</sub> = ${U.num(v.A1)} sin(2000πt) V and V<sub>2</sub> = ${U.num(v.A2)} cos(5000πt) V.`,
    ask: kind === 'e2' ? 'Derive e<sub>2</sub>(t), the voltage at node 2. Hence find e<sub>2</sub> at t = t<sub>0</sub>.' : 'Derive i<sub>1</sub>(t), the current from node 1 to node 2 through R<sub>1</sub>. Hence find i<sub>1</sub> at t = t<sub>0</sub>.',
    fig: (v) => F.twosrc(v, { i1: kind === 'i1', v1txt: `${U.num(v.A1)} sin`, v2txt: `${U.num(v.A2)} cos` }),
    calc: (v) => {
      const Gs = 1 / v.R1 + 1 / v.R2 + 1 / v.R3, k1 = (1 / v.R1) / Gs, k2 = (1 / v.R3) / Gs;
      const s = Math.sin(2000 * Math.PI * v.t0), c = Math.cos(5000 * Math.PI * v.t0);
      if (kind === 'e2') return { a: k1 * v.A1, b: k2 * v.A2, at: k1 * v.A1 * s + k2 * v.A2 * c };
      const ia = (1 - k1) * v.A1 / v.R1, ib = -k2 * v.A2 / v.R1;
      return { a: ia, b: ib, at: ia * s + ib * c };
    },
    answers: kind === 'e2'
      ? [{ k: 'a', label: 'sin coefficient (V)', unit: 'V' }, { k: 'b', label: 'cos coefficient (V)', unit: 'V' }, { k: 'at', label: 'e<sub>2</sub>(t<sub>0</sub>)', unit: 'V' }]
      : [{ k: 'a', label: 'sin coefficient', unit: 'A' }, { k: 'b', label: 'cos coefficient', unit: 'A' }, { k: 'at', label: 'i<sub>1</sub>(t<sub>0</sub>)', unit: 'A' }],
    form: kind === 'e2' ? 'e<sub>2</sub>(t) = [a] sin(2000πt) + [b] cos(5000πt)' : 'i<sub>1</sub>(t) = [a] sin(2000πt) + [b] cos(5000πt)',
    net: (v) => [['V', '1', '0', v.A1 * Math.sin(2000 * Math.PI * v.t0)], ['V', '3', '0', v.A2 * Math.cos(5000 * Math.PI * v.t0)], ['R', '1', '2', v.R1], ['R', '2', '0', v.R2], ['R', '2', '3', v.R3]],
    probe: (m, v) => ({ at: kind === 'e2' ? m.v('2') : (m.v('1') - m.v('2')) / v.R1 }),
    hints: ['Only resistors → no phase shift, no memory. At every instant it is a plain DC circuit.',
      'Write e<sub>2</sub> with Millman/KCL in terms of V<sub>1</sub> and V<sub>2</sub>, then paste the sine and cosine in.'],
    sol: (v, a) => {
      const Gs = 1 / v.R1 + 1 / v.R2 + 1 / v.R3, k1 = (1 / v.R1) / Gs, k2 = (1 / v.R3) / Gs;
      const s = Math.sin(2000 * Math.PI * v.t0), c = Math.cos(5000 * Math.PI * v.t0);
      const tms = U.num(v.t0 * 1e3);
      let out = step('1 · KCL at node 2 (works at every instant)',
        D(T`\frac{e_2 - V_1}{R_1} + \frac{e_2}{R_2} + \frac{e_2 - V_2}{R_3} = 0`) +
        D(T`e_2 = \underbrace{\frac{1/R_1}{1/R_1+1/R_2+1/R_3}}_{k_1 = ${U.num(k1, 4)}}V_1 + \underbrace{\frac{1/R_3}{1/R_1+1/R_2+1/R_3}}_{k_2 = ${U.num(k2, 4)}}V_2`));
      if (kind === 'e2') {
        out += step('2 · Paste in the sources',
          D(T`e_2(t) = ${U.num(k1, 4)}\times ${U.num(v.A1)}\sin(2000\pi t) + ${U.num(k2, 4)}\times${U.num(v.A2)}\cos(5000\pi t)`) +
          D(T`\boxed{e_2(t) = ${U.num(a.a)}\sin(2000\pi t) + ${U.num(a.b)}\cos(5000\pi t)\ \text{V}}`)) +
          step(`3 · Evaluate at t = ${tms} ms`,
            D(T`\sin(2000\pi\times${tms}\text{m}) = ${U.num(s, 3)}, \qquad \cos(5000\pi\times${tms}\text{m}) = ${U.num(c, 3)}`) +
            D(T`e_2 = ${U.num(a.a)}(${U.num(s, 3)}) + ${U.num(a.b)}(${U.num(c, 3)}) = \boxed{${st(a.at, 'V')}}`));
      } else {
        out += step('2 · Current through R<sub>1</sub>',
          D(T`i_1 = \frac{V_1 - e_2}{R_1} = \frac{(1-k_1)V_1 - k_2V_2}{R_1}`) +
          D(T`\boxed{i_1(t) = ${st(a.a, 'A')}\,\sin(2000\pi t) ${a.b < 0 ? '-' : '+'} ${st(Math.abs(a.b), 'A')}\,\cos(5000\pi t)}`)) +
          step(`3 · Evaluate at t = ${tms} ms`,
            D(T`\sin(2000\pi\times${tms}\text{m}) = ${U.num(s, 3)}, \qquad \cos(5000\pi\times${tms}\text{m}) = ${U.num(c, 3)}`) +
            D(T`i_1 = \boxed{${st(a.at, 'A')}}`));
      }
      return out + trap('Set the calculator to <b>radians</b>. 2000π×1.25 ms = 2.5π, not 2.5°.') +
        tip('No capacitors or inductors means the output is just a weighted sum of the inputs (superposition). AUT24 asked for e<sub>2</sub>, SPR25 asked for i<sub>1</sub> on the same circuit.');
    },
  });
  two('aut24-1a', 'AUT24', 'e2');
  two('spr25-1a', 'SPR25', 'i1');

  // ---- family hw0-1c: current sources
  const ladderI = (id, paper, target) => add({
    id, family: 'hw0-1c', topics: ['src', 'nodal'], symset: 'exam',
    src: { type: 'exam', paper, label: `${paper} · Q1(b)`, marks: '20%' },
    title: target === 'V24' ? 'Current source into a node' : 'Current source into a node (V₁₂ version)',
    params: { V1: p(1, 'V', null, 0, () => U.R.volt(0.5, 6)), R2: p(2000, 'Ω', null, 0, rR()), R3: p(3000, 'Ω', null, 0, rR()), I4: p(0.5e-3, 'A', null, 0, () => U.R.amp(0.2e-3, 2e-3)), R5: p(5000, 'Ω', null, 0, rR()) },
    ask: `Calculate the voltage V<sub>${target === 'V24' ? '24' : '12'}</sub> between nodes ${target === 'V24' ? '2 and 4' : '1 and 2'}.`,
    fig: (v) => F.ladder3(v, { isrc: true }),
    calc: (v) => { const e2 = (v.V1 / v.R2 + v.I4) / (1 / v.R2 + 1 / v.R3); return target === 'V24' ? { V24: e2 } : { V12: v.V1 - e2 }; },
    answers: [{ k: target, label: `V<sub>${target.slice(1)}</sub>`, unit: 'V' }],
    net: (v) => [['V', '1', '4', v.V1], ['R', '1', '2', v.R2], ['R', '2', '4', v.R3], ['I', '3', '2', v.I4], ['R', '3', '4', v.R5], ['R', '4', '0', 1]],
    probe: (m) => ({ V24: m.v('2') - m.v('4'), V12: m.v('1') - m.v('2') }),
    hints: ['Use node 4 as ground. The arrow in I<sub>4</sub> points left: it pushes I<sub>4</sub> <b>into</b> node 2.',
      'R<sub>5</sub> is in series with a current source. Does R<sub>5</sub> change the current I<sub>4</sub>? So does it affect node 2?'],
    sol: (v, a) => {
      const e2 = (v.V1 / v.R2 + v.I4) / (1 / v.R2 + 1 / v.R3);
      let s = step('1 · Ground node 4, read the arrow',
        F.ladder3(v, { isrc: true, noval: true, hl: ['I4'], extra: S.nodeV([40, 60], 'V1', { dy: 140 }) + S.nodeV([160, 60], 'e2', { dx: -32, dy: 30 }) }) +
        `<p>Arrow points left → I<sub>4</sub> is pulled out of node 3 and <b>pushed into node 2</b>.</p>` +
        `<p>R<sub>5</sub> is in series with I<sub>4</sub>, so it carries exactly I<sub>4</sub> no matter its value. It <b>cannot affect node 2</b>.</p>`) +
        step('2 · KCL at node 2 (out = in)',
          D(T`\frac{e_2 - V_1}{R_2} + \frac{e_2}{R_3} = I_4`) +
          D(T`e_2 = \frac{\dfrac{V_1}{R_2} + I_4}{\dfrac{1}{R_2}+\dfrac{1}{R_3}} = \frac{\dfrac{${U.num(v.V1, 4)}}{${v.R2}} + ${U.num(v.I4, 4)}}{\dfrac{1}{${v.R2}}+\dfrac{1}{${v.R3}}} = ${st(e2, 'V')}`));
      s += target === 'V24'
        ? step('3 · Answer', D(T`V_{24} = e_2 - e_4 = \boxed{${st(a.V24, 'V')}}`))
        : step('3 · Answer', D(T`V_{12} = e_1 - e_2 = ${gt(v.V1, 'V')} - ${st(e2, 'V', 4)} = \boxed{${st(a.V12, 'V')}}`));
      return s + trap('R<sub>5</sub> is a decoy. A resistor in series with a current source never changes that branch\'s current.') +
        tip('AUT22 asked V<sub>24</sub>, SPR23 asked V<sub>12</sub> — same circuit, same e<sub>2</sub>.');
    },
  });
  ladderI('aut22-1b', 'AUT22', 'V24');
  ladderI('spr23-1b', 'SPR23', 'V12');

  add({
    id: 'spr21-1b', family: 'hw0-1c', topics: ['src', 'sup'], symset: 'exam',
    src: { type: 'exam', paper: 'SPR21', label: 'SPR21 · Q1(b)', marks: '20%' },
    title: 'Sine source + DC current source → I(R₂)(t)',
    params: { Vm: p(1, 'V', 'ε', 1e-3, () => U.R.volt(1, 9)), R2: p(2000, 'Ω', 'η', 1, rR()), R3: p(3000, 'Ω', 'θ', 1, rR()), I4: p(4e-3, 'A', 'λ', 1e-6, () => U.R.amp(0.5e-3, 5e-3)) },
    lead: () => 'V<sub>1</sub>(t) = V<sub>m</sub> sin(10<sup>6</sup>t).',
    ask: 'Calculate the current I(R2) flowing from node 1 to node 2 through R<sub>2</sub>.',
    fig: (v) => F.spr21b(v),
    calc: (v) => ({ amp: v.Vm / (v.R2 + v.R3), dc: -v.I4 * v.R3 / (v.R2 + v.R3) }),
    answers: [{ k: 'amp', label: 'sin amplitude', unit: 'A' }, { k: 'dc', label: 'DC part', unit: 'A' }],
    form: 'I(R<sub>2</sub>)(t) = [amplitude] sin(10<sup>6</sup>t) + [DC part]',
    net: (v) => [['V', '1', '0', v.Vm], ['R', '1', '2', v.R2], ['R', '2', '0', v.R3], ['I', '0', '2', v.I4]],
    probe: (m, v) => ({ sum: (m.v('1') - m.v('2')) / v.R2 }),
    hints: ['Two different kinds of source → superposition. Do V<sub>1</sub> alone, then I<sub>4</sub> alone.',
      'Killing a voltage source = short circuit. Killing a current source = open circuit.'],
    sol: (v, a) => step('1 · V<sub>1</sub> alone (I<sub>4</sub> → open)',
      `<p>R<sub>2</sub> and R<sub>3</sub> are now in series across V<sub>1</sub>.</p>` +
      D(T`I' = \frac{V_1}{R_2+R_3} = \frac{${U.num(v.Vm, 4)}\sin(10^6t)}{${v.R2}+${v.R3}} = ${st(a.amp, 'A')}\,\sin(10^6t)`)) +
      step('2 · I<sub>4</sub> alone (V<sub>1</sub> → short)',
        `<p>I<sub>4</sub> is pushed into node 2 and splits between R<sub>3</sub> (to ground) and R<sub>2</sub> (to ground through the shorted V<sub>1</sub>). Through R<sub>2</sub> it flows 2 → 1, i.e. <b>against</b> our reference.</p>` +
        D(T`I'' = -I_4\,\frac{R_3}{R_2+R_3} = -${gt(v.I4, 'A')}\times\frac{${v.R3}}{${v.R2 + v.R3}} = ${st(a.dc, 'A')}`)) +
      step('3 · Add them',
        D(T`\boxed{I(R_2)(t) = ${st(a.amp, 'A')}\,\sin(10^6t) ${a.dc < 0 ? '-' : '+'} ${st(Math.abs(a.dc), 'A')}}`)) +
      tip('Current divider again (HW 0 Q1(b)): the share through R<sub>2</sub> has R<sub>3</sub> on top.'),
  });

  // ---- family hw0-1d: equivalent resistance (used for Thévenin)
  add({
    id: 'aut25-1a', family: 'hw0-1d', topics: ['req', 'div', 'nodal'], symset: 'exam',
    src: { type: 'exam', paper: 'AUT25', label: 'AUT25 · Q1(a)', marks: '20%' },
    title: 'Unbalanced bridge — current through R₅',
    params: { Vs: p(9, 'V', null, 0, () => U.R.volt(3, 15)), R1: p(1200, 'Ω', null, 0, rR()), R2: p(2200, 'Ω', null, 0, rR()), R3: p(3300, 'Ω', null, 0, rR()), R4: p(4700, 'Ω', null, 0, rR()), R5: p(5600, 'Ω', null, 0, rR()) },
    ask: 'Calculate the current flowing from node A to node B through R<sub>5</sub>.',
    fig: (v) => F.aut25a(v),
    calc: (v) => { const VA = v.Vs * v.R2 / (v.R1 + v.R2), VB = v.Vs * v.R4 / (v.R3 + v.R4), Rth = par(v.R1, v.R2) + par(v.R3, v.R4); return { I5: (VA - VB) / (Rth + v.R5) }; },
    answers: [{ k: 'I5', label: 'I(R<sub>5</sub>)', unit: 'A' }],
    net: (v) => [['V', 't', '0', v.Vs], ['R', 't', 'A', v.R1], ['R', 'A', '0', v.R2], ['R', 't', 'B', v.R3], ['R', 'B', '0', v.R4], ['R', 'A', 'B', v.R5]],
    probe: (m, v) => ({ I5: (m.v('A') - m.v('B')) / v.R5 }),
    hints: ['R<sub>5</sub> joins two dividers, so no series/parallel shortcut works. Pull R<sub>5</sub> out and look back into A–B (Thévenin).',
      'With R<sub>5</sub> removed: V<sub>A</sub> and V<sub>B</sub> are plain dividers. Kill V<sub>s</sub> (short) and R<sub>th</sub> is exactly HW 0 Q1(d).'],
    sol: (v, a) => {
      const VA = v.Vs * v.R2 / (v.R1 + v.R2), VB = v.Vs * v.R4 / (v.R3 + v.R4), Rth = par(v.R1, v.R2) + par(v.R3, v.R4);
      return step('1 · Remove R<sub>5</sub>: two plain dividers',
        F.aut25a(v, { hl: ['noR5', 'R2', 'R4'], noval: true }) +
        D(T`V_A = V_s\frac{R_2}{R_1+R_2} = ${st(VA, 'V')}, \qquad V_B = V_s\frac{R_4}{R_3+R_4} = ${st(VB, 'V')}`) +
        D(T`V_{th} = V_A - V_B = ${st(VA - VB, 'V')}`)) +
        step('2 · Kill V<sub>s</sub> (short it) → R<sub>th</sub>',
          `<p>With V<sub>s</sub> shorted, the top and bottom rails are one node. From A: R<sub>1</sub>∥R<sub>2</sub> to that node, then R<sub>3</sub>∥R<sub>4</sub> to B — <b>exactly HW 0 Q1(d)</b>.</p>` +
          D(T`R_{th} = R_1\parallel R_2 + R_3\parallel R_4 = ${st(par(v.R1, v.R2), 'Ω')} + ${st(par(v.R3, v.R4), 'Ω')} = ${st(Rth, 'Ω')}`)) +
        step('3 · Put R<sub>5</sub> back',
          F.thev(U.si(VA - VB, 'V'), U.si(Rth, 'Ω'), U.given(v.R5, 'Ω')) +
          D(T`I(R_5) = \frac{V_{th}}{R_{th}+R_5} = \frac{${st(VA - VB, 'V')}}{${st(Rth, 'Ω')} + ${v.R5}\,\Omega} = \boxed{${st(a.I5, 'A')}}`)) +
        tip('Nodal analysis (two equations at A and B) gives the same answer. Thévenin is faster here because each piece is a skill you already have.');
    },
  });

  // ---- family hw0-2: power
  add({
    id: 'spr21-1a', family: 'hw0-2', topics: ['ohm', 'src'], symset: 'exam',
    src: { type: 'exam', paper: 'SPR21', label: 'SPR21 · Q1(a)', marks: '20%' },
    title: 'Power dissipated in a voltage source',
    params: { I1: p(1e-3, 'A', 'ε', 1e-6, () => U.R.amp(0.5e-3, 5e-3)), R2: p(2000, 'Ω', 'η', 1, rR()), V3: p(3, 'V', 'θ', 1e-3, () => U.R.volt(1, 9)), R4: p(4000, 'Ω', 'λ', 1, rR()) },
    ask: 'Calculate the instantaneous power dissipated in voltage source V<sub>3</sub>.',
    fig: (v) => F.spr21a(v),
    calc: (v) => ({ P: v.V3 * v.I1 }),
    answers: [{ k: 'P', label: 'P absorbed by V<sub>3</sub>', unit: 'W' }],
    net: (v) => [['I', '0', '1', v.I1], ['R', '1', '2', v.R2], ['V', '2', '3', v.V3], ['R', '3', '0', v.R4]],
    probe: (m, v) => ({ P: v.V3 * v.I1 }),
    hints: ['Everything is in one loop with the current source. What current goes through V<sub>3</sub>?',
      'Passive sign convention: if current <b>enters the +</b> terminal, the element absorbs P = VI.'],
    sol: (v, a) => step('1 · One loop → one current',
      F.spr21a(v, { noval: true, hl: ['V3'], extra: S.arrow([62, 60], 'r', 'I1', { ty: 84 }) }) +
      `<p>I<sub>1</sub>, R<sub>2</sub>, V<sub>3</sub>, R<sub>4</sub> are all in series. The current source forces I<sub>1</sub> = ${U.given(v.I1, 'A')} through all of them, <b>whatever R<sub>2</sub> and R<sub>4</sub> are</b>.</p>`) +
      step('2 · Which way does it go through V<sub>3</sub>?',
        `<p>Arrow up → current flows 1 → 2 → 3, so it <b>enters V<sub>3</sub> at its + terminal</b>. That is the passive sign convention, so V<sub>3</sub> absorbs power.</p>` +
        D(T`P_{V_3} = V_3\,I_1 = ${gt(v.V3, 'V')}\times${gt(v.I1, 'A')} = \boxed{${st(a.P, 'W')}}`)) +
      trap('R<sub>2</sub> and R<sub>4</sub> are decoys. If the current had entered at −, the source would be <i>delivering</i> power and the answer would be negative.'),
  });

  // ================================================================= DRILLS (basics, random every time)
  add({
    id: 'd-par', family: 'drill', topics: ['req'], drill: true,
    src: { type: 'drill', label: 'Basics drill' }, title: 'Parallel resistors',
    params: { n: p(2, '', null, 0, () => U.R.choice([2, 2, 3])), Ra: p(1000, 'Ω', null, 0, rR()), Rb: p(2200, 'Ω', null, 0, rR()), Rc: p(4700, 'Ω', null, 0, rR()) },
    hideParams: ['n', 'Ra', 'Rb', 'Rc'],
    ask: 'Find the equivalent resistance between A and B.',
    fig: (v) => F.par(v.n === 3 ? [v.Ra, v.Rb, v.Rc] : [v.Ra, v.Rb]),
    calc: (v) => ({ R: 1 / (1 / v.Ra + 1 / v.Rb + (v.n === 3 ? 1 / v.Rc : 0)) }),
    answers: [{ k: 'R', label: 'R<sub>AB</sub>', unit: 'Ω' }],
    net: (v) => [['I', '0', 'A', 1], ['R', 'A', '0', v.Ra], ['R', 'A', '0', v.Rb], ...(v.n === 3 ? [['R', 'A', '0', v.Rc]] : [])],
    probe: (m) => ({ R: m.v('A') }),
    hints: ['Parallel: add the conductances (1/R), then flip.'],
    sol: (v, a) => step('Add conductances',
      D(v.n === 3 ? T`\frac{1}{R_{AB}} = \frac{1}{${v.Ra}}+\frac{1}{${v.Rb}}+\frac{1}{${v.Rc}}` : T`R_{AB} = \frac{R_1R_2}{R_1+R_2} = \frac{${v.Ra}\times${v.Rb}}{${v.Ra}+${v.Rb}}`) +
      D(T`R_{AB} = \boxed{${st(a.R, 'Ω')}}`)) + tip('Answer must be below the smallest resistor (' + Math.min(v.Ra, v.Rb, v.n === 3 ? v.Rc : 1e9) + ' Ω).'),
  });

  add({
    id: 'd-vdiv', family: 'drill', topics: ['div'], drill: true,
    src: { type: 'drill', label: 'Basics drill' }, title: 'Voltage divider',
    params: { Vs: p(9, 'V', null, 0, () => U.R.volt(2, 15)), R1: p(1000, 'Ω', null, 0, rR()), R2: p(2200, 'Ω', null, 0, rR()) },
    ask: 'Find the voltage across R<sub>2</sub> (top of R<sub>2</sub> relative to the bottom).',
    fig: (v) => F.series2('Vs', U.given(v.Vs, 'V'), ['R1', U.given(v.R1, 'Ω')], ['R2', U.given(v.R2, 'Ω')], { hlBot: true }),
    calc: (v) => ({ V: v.Vs * v.R2 / (v.R1 + v.R2) }),
    answers: [{ k: 'V', label: 'V(R<sub>2</sub>)', unit: 'V' }],
    net: (v) => [['V', 't', '0', v.Vs], ['R', 't', 'm', v.R1], ['R', 'm', '0', v.R2]],
    probe: (m) => ({ V: m.v('m') }),
    hints: ['Share of the voltage = own resistor ÷ total.'],
    sol: (v, a) => step('Divider', D(T`V = V_s\frac{R_2}{R_1+R_2} = ${gt(v.Vs, 'V')}\times\frac{${v.R2}}{${v.R1}+${v.R2}} = \boxed{${st(a.V, 'V')}}`)),
  });

  add({
    id: 'd-idiv', family: 'drill', topics: ['div'], drill: true,
    src: { type: 'drill', label: 'Basics drill' }, title: 'Current divider',
    params: { Is: p(2e-3, 'A', null, 0, () => U.R.amp(0.5e-3, 10e-3)), R1: p(1000, 'Ω', null, 0, rR()), R2: p(2200, 'Ω', null, 0, rR()) },
    ask: 'Find the current I<sub>1</sub> down through R<sub>1</sub>.',
    fig: (v) => F.idiv(v),
    calc: (v) => ({ I1: v.Is * v.R2 / (v.R1 + v.R2) }),
    answers: [{ k: 'I1', label: 'I<sub>1</sub>', unit: 'A' }],
    net: (v) => [['I', '0', 't', v.Is], ['R', 't', '0', v.R1], ['R', 't', '0', v.R2]],
    probe: (m, v) => ({ I1: m.v('t') / v.R1 }),
    hints: ['Current divider: the <b>other</b> resistor goes on top.'],
    sol: (v, a) => step('Divider', D(T`I_1 = I_s\frac{R_2}{R_1+R_2} = ${gt(v.Is, 'A')}\times\frac{${v.R2}}{${v.R1}+${v.R2}} = \boxed{${st(a.I1, 'A')}}`)) +
      tip('Compare with the voltage divider: there the resistor\'s <b>own</b> value goes on top.'),
  });

  add({
    id: 'd-pow', family: 'drill', topics: ['ohm'], drill: true,
    src: { type: 'drill', label: 'Basics drill' }, title: 'Power in a resistor',
    params: { V: p(9, 'V', null, 0, () => U.R.volt(1, 24)), R: p(1000, 'Ω', null, 0, () => U.R.res(100, 10000)) },
    ask: 'Find the current and the power dissipated in R.',
    fig: (v) => F.loop(v),
    calc: (v) => ({ I: v.V / v.R, P: v.V * v.V / v.R }),
    answers: [{ k: 'I', label: 'I', unit: 'A' }, { k: 'P', label: 'P', unit: 'W' }],
    net: (v) => [['V', 't', '0', v.V], ['R', 't', '0', v.R]],
    probe: (m, v) => ({ I: m.v('t') / v.R }),
    hints: ['I = V/R. Then P = VI = I²R = V²/R — all three agree.'],
    sol: (v, a) => step('Ohm then power', D(T`I = \frac{V}{R} = \frac{${gt(v.V, 'V')}}{${v.R}\,\Omega} = \boxed{${st(a.I, 'A')}}`) +
      D(T`P = \frac{V^2}{R} = \frac{(${U.num(v.V, 4)})^2}{${v.R}} = \boxed{${st(a.P, 'W')}}`)),
  });

  add({
    id: 'd-isign', family: 'drill', topics: ['src'], drill: true,
    src: { type: 'drill', label: 'Basics drill' }, title: 'Current-source sign check',
    params: { I1: p(1e-3, 'A', null, 0, () => U.R.amp(0.5e-3, 5e-3)), R1: p(1200, 'Ω', null, 0, rR()), R2: p(2200, 'Ω', null, 0, rR()), R3: p(3300, 'Ω', null, 0, rR()), dir: p(0, '', null, 0, () => U.R.choice([0, 1])) },
    hideParams: ['dir'],
    ask: 'Find V = V<sub>A</sub> − V<sub>B</sub>. Watch the arrow!',
    fig: (v) => F.hw1c(v, { dir: v.dir ? 'up' : 'down' }),
    calc: (v) => ({ V: (v.dir ? 1 : -1) * v.I1 * v.R1 }),
    answers: [{ k: 'V', label: 'V<sub>AB</sub>', unit: 'V' }],
    net: (v) => v.dir ? [['I', 'b', 't', v.I1], ['R', 't', 'b', v.R1], ['R', 'b', '0', 1e12]] : [['I', 't', 'b', v.I1], ['R', 't', 'b', v.R1], ['R', 'b', '0', 1e12]],
    probe: (m) => ({ V: m.v('t') - m.v('b') }),
    hints: ['No current in R<sub>2</sub>, R<sub>3</sub>. Arrow up → current goes down through R<sub>1</sub> (top is +).'],
    sol: (v, a) => step('Follow the arrow', `<p>Arrow <b>${v.dir ? 'up' : 'down'}</b> → current flows <b>${v.dir ? 'down' : 'up'}</b> through R<sub>1</sub>, so the <b>${v.dir ? 'top' : 'bottom'}</b> is +.</p>` +
      D(T`V_{AB} = ${v.dir ? '+' : '-'}I_1R_1 = \boxed{${st(a.V, 'V')}}`)),
  });

  add({
    id: 'd-psrc', family: 'drill', topics: ['ohm', 'src'], drill: true,
    src: { type: 'drill', label: 'Basics drill' }, title: 'Absorbing or delivering?',
    params: { I1: p(1e-3, 'A', null, 0, () => U.R.amp(0.5e-3, 5e-3)), R2: p(2000, 'Ω', null, 0, rR()), V3: p(3, 'V', null, 0, () => U.R.volt(1, 9)), R4: p(4000, 'Ω', null, 0, rR()), dir: p(0, '', null, 0, () => U.R.choice([0, 1])), pol: p(0, '', null, 0, () => U.R.choice([0, 1])) },
    hideParams: ['dir', 'pol'],
    ask: 'Find the power <b>absorbed</b> by V<sub>3</sub> (negative means it delivers power).',
    fig: (v) => F.spr21a(v, { dir: v.dir ? 'down' : 'up', pol: v.pol ? 'right' : 'left' }),
    calc: (v) => ({ P: v.V3 * v.I1 * ((v.dir ? -1 : 1) * (v.pol ? -1 : 1)) }),
    answers: [{ k: 'P', label: 'P absorbed', unit: 'W' }],
    net: (v) => [['I', '0', '1', v.I1]],
    probe: (m, v) => ({}),
    hints: ['Find where the current enters V<sub>3</sub>. Enters + → absorbs (+VI). Enters − → delivers (−VI).'],
    sol: (v, a) => step('Passive sign convention', `<p>Current flows ${v.dir ? '3 → 2 → 1 (anticlockwise)' : '1 → 2 → 3 (clockwise)'}; V<sub>3</sub>'s + is on the ${v.pol ? 'right (node 3)' : 'left (node 2)'} side.</p>` +
      `<p>So the current enters V<sub>3</sub> at its <b>${a.P > 0 ? '+' : '−'}</b> terminal.</p>` + D(T`P_{abs} = ${a.P > 0 ? '+' : '-'}V_3I_1 = \boxed{${st(a.P, 'W')}}`)),
  });

  add({
    id: 'd-mill', family: 'drill', topics: ['nodal'], drill: true,
    src: { type: 'drill', label: 'Basics drill' }, title: 'One-node KCL (Millman)',
    params: { V1: p(5, 'V', null, 0, () => U.R.volt(1, 12)), V2: p(2, 'V', null, 0, () => U.R.volt(-6, 12)), R1: p(1200, 'Ω', null, 0, rR()), R2: p(2200, 'Ω', null, 0, rR()), R3: p(3300, 'Ω', null, 0, rR()) },
    ask: 'Both sources are DC here. Find e<sub>2</sub>.',
    fig: (v) => F.twosrc(v, { dc: true, v1txt: U.given(v.V1, 'V'), v2txt: U.given(v.V2, 'V') }),
    calc: (v) => ({ e2: (v.V1 / v.R1 + v.V2 / v.R3) / (1 / v.R1 + 1 / v.R2 + 1 / v.R3) }),
    answers: [{ k: 'e2', label: 'e<sub>2</sub>', unit: 'V' }],
    net: (v) => [['V', '1', '0', v.V1], ['V', '3', '0', v.V2], ['R', '1', '2', v.R1], ['R', '2', '0', v.R2], ['R', '2', '3', v.R3]],
    probe: (m) => ({ e2: m.v('2') }),
    hints: ['Sum of currents leaving node 2 = 0.'],
    sol: (v, a) => step('KCL at node 2', D(T`\frac{e_2-V_1}{R_1}+\frac{e_2}{R_2}+\frac{e_2-V_2}{R_3}=0`) +
      D(T`e_2 = \frac{${U.num(v.V1, 4)}/${v.R1} + ${U.num(v.V2, 4)}/${v.R3}}{1/${v.R1}+1/${v.R2}+1/${v.R3}} = \boxed{${st(a.e2, 'V')}}`)),
  });

  // ============ TOPICS (Learn tab) ============
  const TOPICS = [
    {
      id: 'ohm', name: 'Ohm\'s law & power', short: 'Ohm & power',
      notes: `<p>Every resistor obeys</p>${D(T`V = IR`)}
        <p><b>V</b> volts across it, <b>I</b> amps through it, <b>R</b> ohms. Use it whenever you know two of the three.</p>
        <p>Power turned into heat:</p>${D(T`P = VI = I^2R = \frac{V^2}{R}`)}
        <p>Pick the version with the two things you already know.</p>
        <p><b>Passive sign convention</b>: if current <b>enters the + terminal</b>, the element absorbs P = VI (positive). Resistors always absorb. Sources can go either way.</p>`,
      check: { q: 'A 3 V source has 2 mA entering its <b>−</b> terminal. Power absorbed?', a: '−6 mW. It is delivering 6 mW (acting as a supply).' },
    },
    {
      id: 'req', name: 'Series, parallel & R<sub>eq</sub>', short: 'Series / parallel',
      notes: `<p><b>Series</b> = same current (nothing branches off between them):</p>${D(T`R_s = R_1 + R_2 + \dots`)}
        <p><b>Parallel</b> = same two end nodes:</p>${D(T`R_1\parallel R_2 = \frac{R_1R_2}{R_1+R_2}, \qquad \frac{1}{R_p} = \frac{1}{R_1}+\frac{1}{R_2}+\dots`)}
        <p>Method: <b>name the nodes first</b>. A wire is one node, however long. Two resistors sharing both nodes are parallel.</p>
        <p>Sanity check: parallel is always smaller than the smallest one.</p>`,
      check: { q: 'Two equal 2 kΩ resistors in parallel?', a: '1 kΩ. Equal resistors in parallel: R/n.' },
    },
    {
      id: 'div', name: 'Voltage & current dividers', short: 'Dividers',
      notes: `<p><b>Voltage divider</b> (series resistors share a voltage):</p>${D(T`V_2 = V_s\,\frac{R_2}{R_1+R_2}`)}
        <p>Own resistor on top. Use it to find a node voltage between two series resistors.</p>
        <p><b>Current divider</b> (parallel resistors share a current):</p>${D(T`I_1 = I\,\frac{R_2}{R_1+R_2}`)}
        <p><b>Other</b> resistor on top — current prefers the easy path.</p>`,
      check: { q: '10 mA splits between 1 kΩ and 4 kΩ. Current in the 1 kΩ?', a: '10 mA × 4/(1+4) = 8 mA.' },
    },
    {
      id: 'src', name: 'Sources: polarity, arrows, open terminals', short: 'Sources & signs',
      notes: `<p><b>Voltage source</b>: fixes the voltage between its terminals (+ is higher). The current is whatever the circuit needs.</p>
        <p><b>Current source</b>: fixes the current in the direction of its arrow. The voltage is whatever the circuit needs.</p>
        <p>Sources in series: voltages <b>add</b> if + meets −.</p>
        <p><b>Open terminals</b> carry no current → no drop across resistors leading to them.</p>
        <p>A resistor in series with a current source <b>doesn't change</b> that current (it is a decoy for node voltages).</p>
        <p>Current flows into a resistor at its <b>+</b> end.</p>`,
      check: { q: 'A current source pushes 1 mA up through a 2 kΩ resistor. Which end of the resistor is +?', a: 'The bottom (current enters at the bottom). V<sub>top</sub> − V<sub>bottom</sub> = −2 V.' },
    },
    {
      id: 'nodal', name: 'Nodal analysis (KCL)', short: 'Nodal',
      notes: `<p>1. Pick a ground. 2. Name each unknown node e<sub>1</sub>, e<sub>2</sub>… 3. KCL at each: <b>currents leaving sum to zero</b>.</p>${D(T`\sum \frac{e_n - e_{\text{neighbour}}}{R} = I_{\text{injected}}`)}
        <p>A voltage source straight to ground just <b>fixes</b> that node. A source between two nodes → <b>supernode</b>: one KCL for both, plus e<sub>a</sub> − e<sub>b</sub> = V.</p>
        <p>One unknown node? Use <b>Millman</b>:</p>${D(T`e = \frac{\sum V_k/R_k}{\sum 1/R_k}`)}`,
      check: { q: 'Node e connects to 6 V via 1 kΩ and to ground via 2 kΩ. e = ?', a: '(6/1)/(1/1 + 1/2) = 4 V. (It is also just a divider.)' },
    },
    {
      id: 'sup', name: 'Superposition & time-varying sources', short: 'Superposition',
      notes: `<p>In a linear circuit, the answer = sum of the answers with <b>one source at a time</b>.</p>
        <p>Kill the others: voltage source → <b>short</b>, current source → <b>open</b>.</p>
        <p>With <b>only resistors</b>, nothing stores energy. So a sine in gives the <b>same sine out</b>, just scaled — same frequency, no phase shift.</p>${D(T`e(t) = k_1V_1(t) + k_2V_2(t)`)}
        <p>Find k<sub>1</sub>, k<sub>2</sub> like it is DC, then paste the functions in.</p>`,
      check: { q: 'You kill a current source. Short or open?', a: 'Open — a dead current source carries zero current.' },
    },
  ];

  // Which Sheet-0 question each paper asked (for the exam radar)
  const PAPERS = ['SPR21', 'AUT21', 'SPR22', 'AUT22', 'SPR23', 'AUT23', 'SPR24', 'AUT24', 'SPR25', 'AUT25'];

  G.SHEETS = G.SHEETS || [];
  G.SHEETS.push({
    id: 's0', n: 0, title: 'DC resistive circuits', hw: 'homework/HW0_Homework_0_Practice.pdf',
    blurb: 'Ohm\'s law, series/parallel, dividers, sources, nodal analysis. The foundation for every other sheet — and a 20-mark Q1 part in <b>every</b> paper since 2021.',
    topics: TOPICS, questions: Q, papers: PAPERS, figs: F,
    insights: [
      'Every paper (10 of 10) has at least one Sheet 0 style part in Q1 worth 20%. SPR21 had two.',
      'The autumn circuit comes back in the next spring paper with a different node asked: AUT21→SPR22, AUT22→SPR23, AUT23→SPR24, AUT24→SPR25. Expect the AUT25 bridge (current through R₅) to return in SPR26.',
      'Most common skill: finding a node voltage with 2+ sources (6 of 10 papers). Next: current sources and sign traps (3 papers).',
      'Two decoy tricks keep showing up: a resistor in series with a current source (AUT22, SPR23, SPR21) — it never matters.',
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
