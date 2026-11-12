// TOPIC 6 — Diode circuits: every past-paper part
(function (G) {
  const { S, U, B, LK } = G;
  const { D, I, step, trap, tip, flag, w, p, rR, pk, T, st, gt } = B;
  const val = (x, v, k, u) => (x && x.noval ? '' : U.given(v[k], u));
  const exam = (paper, q, marks = '20%') => ({ type: 'exam', paper, q, label: `${paper} · Q${q}`, marks });
  const TAU = 2 * Math.PI, sin = Math.sin;
  const model = `<p>An <b>ideal diode</b> is a one-way switch.</p><p><b>ON</b> (a wire) when current flows in the arrow direction.</p><p><b>OFF</b> (open) when the cathode (bar end) is at a higher voltage than the anode.</p>`;

  const F = {};
  F.clip = (v, x = {}) => w(
    S.Vac([40, 60], [40, 220], { lab: 'Vac', side: 'left' }) + S.R([40, 60], [150, 60], { lab: 'Rs', val: val(x, v, 'Rs', 'Ω') }) +
    S.D([150, 60], [150, 135], { lab: 'D1', hl: x.hl === 1 }) + S.V([150, 135], [150, 220], { lab: 'Vdc1', side: 'left', val: val(x, v, 'Vdc1', 'V'), hl: x.hl === 1 }) +
    S.wire([[150, 60], [330, 60]]) + S.V([255, 135], [255, 60], { lab: 'Vdc2', val: val(x, v, 'Vdc2', 'V'), hl: x.hl === 2 }) + S.D([255, 220], [255, 135], { lab: 'D2', hl: x.hl === 2 }) +
    S.wire([[40, 220], [330, 220]]) + S.gnd([150, 220]) + S.dot([150, 60]) + S.dot([255, 60]) + S.dot([150, 135]) + S.dot([255, 135]) + S.dot([255, 220]) +
    S.flag([40, 60], '1', 'up') + S.flag([150, 60], '2', 'up') + S.flag([150, 135], '3', 'left') + S.flag([255, 135], '4', 'left') + S.vmark([335, 80], [335, 200], 'V<tspan class="ssub" dy="4">out</tspan>', { dx: 6 }), 390, 265);
  F.half = (v, x = {}) => w(
    S.Vac([40, 60], [40, 190], { lab: 'Vs', side: 'left' }) + S.R([40, 60], [140, 60], { lab: 'Rs', val: val(x, v, 'Rs', 'Ω') }) + S.D([140, 60], [230, 60], { lab: 'D' }) +
    (x.cap ? S.C([230, 60], [230, 190], { lab: 'C', side: 'left', val: val(x, v, 'C', 'F') }) + S.wire([[230, 60], [310, 60]]) + S.dot([230, 60]) + S.dot([230, 190]) : '') +
    S.R([x.cap ? 310 : 230, 60], [x.cap ? 310 : 230, 190], { lab: 'RL', val: val(x, v, 'RL', 'Ω') }) + S.wire([[40, 190], [x.cap ? 310 : 230, 190]]) + S.gnd([140, 190]) +
    (x.cap ? S.vmark([360, 80], [360, 170], 'V<tspan class="ssub" dy="4">out</tspan>', {}) : S.arrow([230, 88], 'd', 'I<tspan class="ssub" dy="4">RL</tspan>', { tx: 216, anchor: 'end' })), x.cap ? 410 : 320, 235);
  F.clamp = (v, x = {}) => w(
    S.Vac([40, 60], [40, 210], { lab: 'V1', side: 'left' }) + S.C([40, 60], [150, 60], { lab: 'C2', val: val(x, v, 'C2', 'F') }) +
    S.D([150, 130], [150, 60], { lab: 'D3', side: 'left' }) + S.V([150, 130], [150, 210], { lab: 'V4', side: 'left', val: val(x, v, 'V4', 'V') }) +
    S.wire([[150, 60], [260, 60]]) + S.R([260, 60], [260, 210], { lab: 'R5', val: val(x, v, 'R5', 'Ω') }) + S.wire([[40, 210], [260, 210]]) + S.gnd([150, 210]) +
    S.dot([150, 60]) + S.flag([40, 60], '1', 'up') + S.flag([150, 60], '2', 'up') + S.arrow([260, 88], 'd', 'I(R5)', { tx: 246, anchor: 'end' }), 350, 255);
  F.dor = (v, x = {}) => w(
    S.V([40, 50], [40, 220], { lab: 'VDD', side: 'left', val: val(x, v, 'VDD', 'V') }) + S.wire([[40, 50], [270, 50]]) + S.R([270, 50], [270, 130], { lab: 'RL', val: val(x, v, 'RL', 'Ω') }) +
    S.D([270, 130], [160, 130], { lab: 'DA', hl: x.hl }) + S.V([160, 130], [160, 220], { lab: 'VA', side: 'left' }) + S.wire([[40, 220], [160, 220]]) + S.gnd([100, 220]) +
    S.dot([270, 130]) + S.dot([160, 130]) + S.flag([40, 50], '1', 'up') + S.flag([160, 130], '2', 'up') + S.flag([270, 130], '3', 'right'), 360, 265);
  F.bridge = (v, x = {}) => w(
    S.term([40, 100], '1') + S.term([40, 210], '2') + S.wire([[40, 100], [124, 100]]) + S.wire([[40, 210], [124, 210]]) + S.xfmr(140, 100, 210) +
    S.wire([[156, 100], [230, 100]]) + S.wire([[156, 210], [310, 210]]) +
    S.D([230, 100], [230, 40], { lab: 'D1', side: 'left' }) + S.D([230, 250], [230, 100], { lab: 'D4', side: 'left', off: 14 }) +
    S.D([310, 210], [310, 40], { lab: 'D3' }) + S.D([310, 250], [310, 210], { lab: 'D2' }) +
    S.wire([[230, 40], [430, 40]]) + S.wire([[230, 250], [430, 250]]) + S.C([380, 40], [380, 250], { lab: 'C', side: 'left', val: val(x, v, 'C', 'F') }) +
    S.dot([230, 100]) + S.dot([310, 210]) + S.dot([310, 40]) + S.dot([310, 250]) + S.dot([380, 40]) + S.dot([380, 250]) +
    S.text([190, 94], '3', { cls: 'sl b' }) + S.text([190, 228], '4', { cls: 'sl b' }) + S.term([430, 40], '5', 'right') + S.term([430, 250], '6', 'right'), 470, 285);
  const wave = (o) => S.plot({ w: 340, h: 190, ...o });

  // ---------------------------------------------------------------- DI1: two-diode clipper
  const clip = (id, paper, q, vals) => LK.add({
    id, topic: 'diode', tags: ['clipper', 'max / min'], src: exam(paper, q, q === '3' ? '50 marks' : '20%'),
    title: q === '3' ? 'Two-diode clipper: sketch, max, min and period of V<sub>out</sub>' : 'Two-diode clipper → maximum and minimum of V<sub>out</sub>',
    params: { A: p(vals.A, 'V', null, 0, pk([1, 1.5, 3, 5, 10, 15])), f: p(vals.f, 'Hz', null, 0, pk([1e3, 2e3, 5e3])), Rs: p(vals.Rs, 'Ω', null, 0, pk([100, 200, 470])), Vdc1: p(vals.V1, 'V', null, 0, pk([0.5, 0.7, 1.5, 3, 4])), Vdc2: p(vals.V2, 'V', null, 0, pk([0.5, 0.7, 1.5, 3, 4])) },
    hideParams: ['A', 'f'], lead: (v) => `V<sub>ac</sub> = A sin(2πft) with A = ${U.given(v.A, 'V')} and f = ${U.given(v.f, 'Hz')}. Assume the diodes are ideal.`,
    ask: q === '3' ? '(a) Sketch V<sub>out</sub>(t). (b) Calculate its maximum and minimum values. (c) Calculate its period.' : 'Calculate the maximum and minimum values of V<sub>out</sub>(t).',
    fig: (v) => F.clip(v),
    calc: (v) => ({ Vmax: Math.min(v.A, v.Vdc1), Vmin: Math.max(-v.A, -v.Vdc2), T: 1 / v.f }),
    answers: [{ k: 'Vmax', label: 'Maximum of V<sub>out</sub>', unit: 'V' }, { k: 'Vmin', label: 'Minimum of V<sub>out</sub>', unit: 'V' }].concat(q === '3' ? [{ k: 'T', label: 'Period', unit: 's' }] : []),
    tran: (v) => ({ net: [['V', '1', '0', (t) => v.A * sin(TAU * v.f * t)], ['R', '1', '2', v.Rs], ['D', '2', '3', 0], ['V', '3', '0', v.Vdc1], ['V', '4', '2', v.Vdc2], ['D', '0', '4', 0]], t0: 0, t1: 2 / v.f, steps: 2000, tol: 2e-3,
      probe: (r) => ({ Vmax: r.max('2', 0, r.t1), Vmin: r.min('2', 0, r.t1) }) }),
    hints: ['With both diodes off, no current flows, so there is no drop on R<sub>s</sub> and V<sub>out</sub> = V<sub>ac</sub>.', 'D<sub>1</sub> turns on when V<sub>out</sub> tries to go above V<sub>dc1</sub>. D<sub>2</sub> turns on when V<sub>out</sub> tries to go below −V<sub>dc2</sub>.'],
    sol: (v, a) => { const c1 = v.A > v.Vdc1, c2 = v.A > v.Vdc2;
      return step('1 · Diode model', model, 'The paper says to treat the diodes as ideal, so each is either a wire or a gap.') +
        step('2 · Both diodes off', D(T`V_{out} = V_{ac}`), 'No current flows, so there is no voltage drop across R<sub>s</sub>. The output just follows the source.') +
        step('3 · Upper limit (D<sub>1</sub> branch)', F.clip(v, { noval: true, hl: 1 }) + D(T`V_{out} \le V_{dc1} = ${gt(v.Vdc1, 'V')}`), 'D<sub>1</sub>\'s cathode sits at V<sub>dc1</sub>. As soon as V<sub>out</sub> reaches V<sub>dc1</sub> the diode turns on and ties the output to that battery. The extra voltage is dropped across R<sub>s</sub>.') +
        step('4 · Lower limit (D<sub>2</sub> branch)', F.clip(v, { noval: true, hl: 2 }) + D(T`V_{out} \ge -V_{dc2} = -${gt(v.Vdc2, 'V')}`), 'V<sub>dc2</sub> has its − terminal on the output, so node 4 is at V<sub>out</sub> + V<sub>dc2</sub>. D<sub>2</sub> (anode at ground) turns on when node 4 drops to 0 V, i.e. when V<sub>out</sub> = −V<sub>dc2</sub>.') +
        step('5 · Compare with the sine\'s peaks', D(T`V_{max} = \min(A,\,V_{dc1}) = \boxed{${st(a.Vmax, 'V')}}, \qquad V_{min} = \max(-A,\,-V_{dc2}) = \boxed{${st(a.Vmin, 'V')}}`), `The sine swings between ±${U.num(v.A)} V. ${c1 ? 'It tries to pass +V<sub>dc1</sub>, so the top is clipped.' : 'It never reaches +V<sub>dc1</sub>, so D<sub>1</sub> never turns on and the top is not clipped.'} ${c2 ? 'It tries to pass −V<sub>dc2</sub>, so the bottom is clipped.' : 'It never reaches −V<sub>dc2</sub>, so D<sub>2</sub> never turns on and the bottom is not clipped.'}`) +
        (q === '3' ? step('(c) · Period', D(T`T = \frac{1}{f} = \boxed{${st(a.T, 's')}}`), 'Clipping changes the shape, not the timing.') +
          step('(a) · Sketch', wave({ x: [0, 2 * a.T], y: [-v.A * 1.15, v.A * 1.15], curves: [{ f: (t) => v.A * sin(TAU * v.f * t), c: 'var(--muted)', dash: 1, w: 1.4 }, { f: (t) => Math.max(a.Vmin, Math.min(a.Vmax, v.A * sin(TAU * v.f * t))) }], marks: [{ y: a.Vmax, t: U.num(a.Vmax) }, { y: a.Vmin, t: U.num(a.Vmin) }], xm: [{ x: a.T, t: 'T' }, { x: 2 * a.T, t: '2T' }], yl: 'Vout (V)   - - Vac' }), 'Draw the sine, then flatten everything above V<sub>max</sub> and below V<sub>min</sub>. Label both levels and the period.') : '') +
        trap('Assuming both halves are always clipped. Check each limit against the amplitude A first.'); },
  });
  clip('aut22-3', 'AUT22', '3', { A: 5, f: 1e3, Rs: 100, V1: 1.5, V2: 1.5 });
  clip('spr23-3', 'SPR23', '3', { A: 1, f: 2e3, Rs: 100, V1: 0.5, V2: 1.5 });
  clip('aut23-1d', 'AUT23', '1(d)', { A: 15, f: 1e3, Rs: 200, V1: 3, V2: 4 });
  clip('spr24-1d', 'SPR24', '1(d)', { A: 1.5, f: 1e3, Rs: 200, V1: 0.7, V2: 0.7 });

  // ---------------------------------------------------------------- DI2: half-wave rectifier (SPR22 Q3)
  LK.add({
    id: 'spr22-3', topic: 'diode', tags: ['half-wave rectifier', 'sketch'], src: exam('SPR22', '3', '50 marks'), symset: 'exam',
    title: 'Half-wave rectifier: sketch I<sub>RL</sub>, its maximum and period',
    params: { A: p(1, 'V', 'ε', 1e-3, pk([1, 2, 5])), f: p(4000, 'Hz', null, 0, pk([1e3, 2e3, 4e3])), Rs: p(10, 'Ω', null, 0, pk([10, 22, 47])), RL: p(5000, 'Ω', 'η', 1, rR()) },
    hideParams: ['A', 'f'], lead: (v) => `V<sub>s</sub> = A sin(ωt) with A = ${U.given(v.A, 'V')}, f = ${U.given(v.f, 'Hz')}. Assume the diode is ideal.`,
    ask: '(a) Sketch the current I<sub>RL</sub> through R<sub>L</sub> in steady state. (b) Calculate its maximum value and its period.',
    fig: (v) => F.half(v),
    calc: (v) => ({ Imax: v.A / (v.Rs + v.RL), T: 1 / v.f }),
    answers: [{ k: 'Imax', label: 'Maximum of I<sub>RL</sub>', unit: 'A' }, { k: 'T', label: 'Period', unit: 's' }],
    tran: (v) => ({ net: [['V', '1', '0', (t) => v.A * sin(TAU * v.f * t)], ['R', '1', '2', v.Rs], ['D', '2', '3', 0], ['R', '3', '0', v.RL]], t0: 0, t1: 2 / v.f, steps: 4000, tol: 2e-3, probe: (r) => ({ Imax: r.max('3', 0, r.t1) / v.RL }) }),
    hints: ['Positive half-cycle: diode on, plain series circuit. Negative half-cycle: diode off, no current.'],
    sol: (v, a) => step('1 · Diode model', model, 'Ideal diode, as the hint says.') +
      step('2 · Positive half-cycle (V<sub>s</sub> > 0)', D(T`I_{RL} = \frac{V_s}{R_s + R_L}`), 'The source pushes current in the arrow direction, so the diode is a wire. R<sub>s</sub> and R<sub>L</sub> are in series.') +
      step('3 · Negative half-cycle (V<sub>s</sub> < 0)', D(T`I_{RL} = 0`), 'Current would have to flow backwards through the diode. It cannot, so the diode is open.') +
      step('(b) · Maximum', D(T`I_{max} = \frac{A}{R_s + R_L} = \frac{${gt(v.A, 'V')}}{${U.num(v.Rs)} + ${U.num(v.RL, 4)}} = \boxed{${st(a.Imax, 'A')}}`), 'The largest current occurs at the peak of the sine.') +
      step('(b) · Period', D(T`T = \frac{1}{f} = \boxed{${st(a.T, 's')}}`), 'One bump per cycle of the source, so the period is unchanged.') +
      step('(a) · Sketch', wave({ x: [0, 2 * a.T], y: [-0.25, 1.15], curves: [{ f: (t) => Math.max(0, sin(TAU * v.f * t)) }], marks: [{ y: 1, t: U.si(a.Imax, 'A') }], xm: [{ x: a.T / 2, t: 'T/2' }, { x: a.T, t: 'T' }, { x: 2 * a.T, t: '2T' }], yl: 'IRL' }), 'Positive half-sines separated by flat zero sections of the same width.'),
  });

  // ---------------------------------------------------------------- DI3: peak rectifier with smoothing capacitor (AUT21 Q3)
  const peakSim = (v) => { const Tp = 1 / v.f, n = 4000, dt = Tp / n; let vc = 0, mx = -1e9, mn = 1e9;
    for (let i = 0; i < 10 * n; i++) { const vs = v.A * sin(TAU * v.f * i * dt); vc += dt * ((vs > vc ? (vs - vc) / v.Rs : 0) - vc / v.RL) / v.C; if (i >= 9 * n) { mx = Math.max(mx, vc); mn = Math.min(mn, vc); } } return { mx, mn }; };
  LK.add({
    id: 'aut21-3', topic: 'diode', tags: ['peak rectifier', 'smoothing capacitor', 'sketch'], src: exam('AUT21', '3', '50 marks'), symset: 'exam',
    title: 'Rectifier with smoothing capacitor: sketch V<sub>out</sub>, its maximum and period',
    params: { A: p(5, 'V', 'ε', 1e-3, pk([5, 10, 12])), f: p(50, 'Hz', null, 0, pk([50, 60])), Rs: p(10, 'Ω', null, 0, pk([1, 4.7, 10])), RL: p(1000, 'Ω', 'η', 1, pk([1000, 2200, 4700])), C: p(100e-6, 'F', null, 0, pk([100e-6, 220e-6, 470e-6])) },
    hideParams: ['A', 'f'], lead: (v) => `V<sub>s</sub> = A sin(ωt) with A = ${U.given(v.A, 'V')}, f = ${U.given(v.f, 'Hz')}. Assume the diode is ideal.`,
    ask: '(a) Sketch V<sub>out</sub>(t) in steady state. (b) Calculate its maximum value and its period.',
    fig: (v) => F.half(v, { cap: true }),
    calc: (v) => { const Tp = 1 / v.f, s = peakSim(v); return { Vmax: v.A, T: Tp, tau: v.RL * v.C, ripple: v.A * Tp / (v.RL * v.C), simMax: s.mx, simMin: s.mn }; },
    answers: [{ k: 'Vmax', label: 'Maximum of V<sub>out</sub> (ideal estimate)', unit: 'V' }, { k: 'T', label: 'Period', unit: 's' }],
    tran: (v) => ({ net: [['V', '1', '0', (t) => v.A * sin(TAU * v.f * t)], ['R', '1', '2', v.Rs], ['D', '2', '3', 0], ['C', '3', '0', v.C], ['R', '3', '0', v.RL]], t0: 0, t1: 10 / v.f, steps: 40000, tol: 1.5e-2,
      probe: (r) => ({ simMax: r.max('3', r.t1 - 1 / v.f, r.t1), simMin: r.min('3', r.t1 - 1 / v.f, r.t1) }) }),
    hints: ['The capacitor charges through the diode up to the peak of V<sub>s</sub>, then the diode turns off.', 'While the diode is off, C discharges slowly through R<sub>L</sub> with τ = R<sub>L</sub>C.'],
    sol: (v, a) => step('1 · Charging', model + D(T`V_{out,max} \approx A = \boxed{${st(a.Vmax, 'V')}}`), 'While V<sub>s</sub> is above V<sub>out</sub> the diode conducts and charges C. With an ideal diode and small R<sub>s</sub>, C follows the source up to its peak.') +
      step('2 · Diode turns off', D(T`\tau = R_LC = ${gt(v.RL, 'Ω')}\times${gt(v.C, 'F')} = ${st(a.tau, 's')}`), 'After the peak the source falls faster than the capacitor can discharge, so the diode is reverse biased. C now discharges only through R<sub>L</sub>.') +
      step('3 · How far it droops', D(T`\Delta V \approx A\,\frac{T}{R_LC} = ${U.num(v.A, 4)}\times\frac{${st(a.T, 's')}}{${st(a.tau, 's')}} \approx ${st(a.ripple, 'V')}`), 'τ is several periods long, so in one period the exponential is nearly a straight line: ΔV ≈ (peak) × (time)/(τ).') +
      step('(b) · Period', D(T`T = \frac{1}{f} = \boxed{${st(a.T, 's')}}`), 'A half-wave rectifier tops up the capacitor once per cycle of the source.') +
      step('(a) · Sketch', wave({ x: [0, 2.5 * a.T], y: [-v.A * 1.15, v.A * 1.2], curves: [{ f: (t) => v.A * sin(TAU * v.f * t), c: 'var(--muted)', dash: 1, w: 1.4 }, { f: (t) => { const u = ((t / a.T - 0.25) % 1 + 1) % 1, dec = v.A * Math.exp(-u * a.T / a.tau), s = v.A * sin(TAU * v.f * t); return t < a.T / 4 ? Math.max(0, s) : Math.max(dec, s); }, n: 500 }], marks: [{ y: v.A, t: U.num(v.A, 3) }], xm: [{ x: a.T, t: 'T' }, { x: 2 * a.T, t: '2T' }], yl: 'Vout (V)   - - Vs' }), 'A sawtooth riding near the peak: a quick top-up at each positive peak, then a slow droop until the next one.') +
      flag(`There are no official solutions, so this uses the standard exam estimate (ideal diode, C charges to the peak). R<sub>s</sub> limits the charging current, so a simulation gives a slightly lower peak: about ${U.si(a.simMax, 'V')} max and ${U.si(a.simMin, 'V')} min. Say that you neglected R<sub>s</sub>.`),
  });

  // ---------------------------------------------------------------- DI4: clamp (SPR21 Q3)
  LK.add({
    id: 'spr21-3', topic: 'diode', tags: ['clamp', 'sketch', 'average'], src: exam('SPR21', '3', '50 marks'), symset: 'exam',
    title: 'Diode clamp: sketch I(R<sub>5</sub>), period, max, min and average',
    params: { A: p(1, 'V', 'ε', 1e-3, pk([1, 2, 3])), f: p(1000, 'Hz', 'η', 1, pk([1e3, 2e3])), C2: p(100e-6, 'F', 'θ', 1e-6, pk([47e-6, 100e-6])), V4: p(1, 'V', 'λ', 1e-3, pk([0.5, 1, 2])), R5: p(10e3, 'Ω', null, 0, pk([10e3, 22e3])) },
    hideParams: ['A', 'f'], lead: (v) => `V<sub>1</sub> = A sin(ωt) with A = ${U.given(v.A, 'V')}, f = ${U.given(v.f, 'Hz')}. Assume the diode is ideal.`,
    ask: '(a) Sketch two periods of I(R<sub>5</sub>)(t) and calculate the period T. (b) Calculate the maximum, minimum and average values of I(R<sub>5</sub>) in steady state.',
    fig: (v) => F.clamp(v),
    calc: (v) => ({ T: 1 / v.f, Imin: v.V4 / v.R5, Imax: (v.V4 + 2 * v.A) / v.R5, Iavg: (v.V4 + v.A) / v.R5, tau: v.R5 * v.C2 }),
    answers: [{ k: 'T', label: 'Period', unit: 's' }, { k: 'Imax', label: 'I(R<sub>5</sub>) max', unit: 'A' }, { k: 'Imin', label: 'I(R<sub>5</sub>) min', unit: 'A' }, { k: 'Iavg', label: 'I(R<sub>5</sub>) average', unit: 'A' }],
    tran: (v) => ({ net: [['V', '1', '0', (t) => v.A * sin(TAU * v.f * t)], ['C', '1', '2', v.C2], ['V', '3', '0', v.V4], ['D', '3', '2', 0], ['R', '2', '0', v.R5]], t0: 0, t1: 8 / v.f, steps: 16000, tol: 2.5e-2,
      probe: (r) => ({ Imax: r.max('2', r.t1 - 1 / v.f, r.t1) / v.R5, Imin: r.min('2', r.t1 - 1 / v.f, r.t1) / v.R5, Iavg: r.avg('2', r.t1 - 1 / v.f, r.t1) / v.R5 }) }),
    hints: ['The diode stops node 2 going below V<sub>4</sub>. When it conducts it charges C<sub>2</sub>.', 'R<sub>5</sub>C<sub>2</sub> is huge compared with the period, so once charged the capacitor acts like a battery.'],
    sol: (v, a) => step('1 · What the diode does', model + D(T`e_2 \ge V_4`), 'D<sub>3</sub>\'s anode is held at V<sub>4</sub>. If node 2 tries to drop below V<sub>4</sub> the diode turns on and holds it there.') +
      step('2 · The capacitor becomes a battery', D(T`\tau = R_5C_2 = ${st(a.tau, 's')} \gg T = ${st(a.T, 's')}`) + D(T`V_{C2} = A + V_4 \quad (\text{node 2 side positive})`), 'At the first negative peak (V<sub>1</sub> = −A) the diode conducts and charges C<sub>2</sub> so that e<sub>2</sub> = V<sub>4</sub>. The only discharge path is R<sub>5</sub>, which is far too slow to matter within a period.') +
      step('3 · Node 2 is the source shifted up', D(T`e_2(t) = V_1(t) + A + V_4 = A\sin(\omega t) + ${st(v.A + v.V4, 'V')}`), 'A capacitor with a fixed charge just adds a constant offset. The whole sine is lifted so its lowest point sits at V<sub>4</sub>.') +
      step('(b) · Divide by R<sub>5</sub>', D(T`I_{min} = \frac{V_4}{R_5} = \boxed{${st(a.Imin, 'A')}}, \qquad I_{max} = \frac{V_4 + 2A}{R_5} = \boxed{${st(a.Imax, 'A')}}`) + D(T`I_{avg} = \frac{V_4 + A}{R_5} = \boxed{${st(a.Iavg, 'A')}}`), 'Ohm\'s law on R<sub>5</sub>. The sine averages to zero, so the average is just the offset.') +
      step('(a) · Period and sketch', D(T`T = \frac{1}{f} = \boxed{${st(a.T, 's')}}`) + wave({ x: [0, 2 * a.T], y: [0, a.Imax * 1.2e3], curves: [{ f: (t) => (v.V4 + v.A + v.A * sin(TAU * v.f * t)) / v.R5 * 1e3 }], marks: [{ y: a.Imax * 1e3, t: U.num(a.Imax * 1e3) }, { y: a.Imin * 1e3, t: U.num(a.Imin * 1e3) }, { y: a.Iavg * 1e3, t: U.num(a.Iavg * 1e3) }], xm: [{ x: a.T, t: 'T' }, { x: 2 * a.T, t: '2T' }], yl: 'I(R5) (mA)', xl: 'time after t = 10 ms' }), 'A full, unclipped sine wave riding on a DC level. By 10 ms the clamp has long since settled.') +
      tip('This circuit is a <b>clamp</b>: it shifts a waveform without changing its shape. A clipper cuts the tops off instead.'),
  });

  // ---------------------------------------------------------------- DI5: diode + pull-up (AUT24 / SPR25 1e)
  const dor = (id, paper, vals) => LK.add({
    id, topic: 'diode', tags: ['on/off test', 'forward drop'], src: exam(paper, '1(e)'),
    title: 'Diode with a pull-up resistor: node voltage for two inputs',
    params: { VDD: p(5, 'V', null, 0, pk([3.3, 5, 9])), RL: p(vals.RL, 'Ω', null, 0, pk([10e3, 20e3, 47e3])), VD: p(vals.VD, 'V', null, 0, pk([0.5, 0.6, 0.65, 0.7])), VA1: p(vals.VA1, 'V', null, 0, pk([0.1, 0.25, 0.35, 0.5])), VA2: p(4.5, 'V', null, 0, pk([2.9, 3, 4, 4.5])) },
    hideParams: ['VD', 'VA1', 'VA2'], lead: (v) => `The forward voltage drop across the conducting diode is ${U.given(v.VD, 'V')}.`,
    ask: (v) => `Calculate the voltage at node 3 when (i) V<sub>A</sub> = ${U.given(v.VA1, 'V')} and (ii) V<sub>A</sub> = ${U.given(v.VA2, 'V')}.`,
    fig: (v) => F.dor(v),
    calc: (v) => ({ e3a: Math.min(v.VDD, v.VA1 + v.VD), e3b: Math.min(v.VDD, v.VA2 + v.VD) }),
    answers: [{ k: 'e3a', label: 'e<sub>3</sub> for (i)', unit: 'V' }, { k: 'e3b', label: 'e<sub>3</sub> for (ii)', unit: 'V' }],
    chk: (v, a, sim) => { const run = (VA) => sim.tran([['V', '1', '0', v.VDD], ['R', '1', '3', v.RL], ['D', '3', '2', v.VD], ['V', '2', '0', VA]], 0, 1, 4).end('3'); return [['e3a', run(v.VA1), a.e3a], ['e3b', run(v.VA2), a.e3b]]; },
    hints: ['Guess the diode is off. Then no current flows in R<sub>L</sub> and e<sub>3</sub> = V<sub>DD</sub>.', 'Is the voltage across the diode then at least the forward drop? If yes, the guess was wrong and the diode is on.'],
    sol: (v, a) => { const one = (VA, e, lab) => { const on = v.VDD - VA > v.VD, edge = Math.abs(v.VDD - VA - v.VD) < 1e-9;
        return step(`${lab} · V<sub>A</sub> = ${U.given(VA, 'V')}`, D(T`V_{DD} - V_A = ${U.num(v.VDD)} - ${U.num(VA)} = ${st(v.VDD - VA, 'V')} \;${on ? '>' : edge ? '=' : '<'}\; ${gt(v.VD, 'V')}`) + D(on ? T`\text{diode ON:}\quad e_3 = V_A + V_D = ${U.num(VA)} + ${U.num(v.VD)} = \boxed{${st(e, 'V')}}` : T`\text{diode OFF:}\quad e_3 = V_{DD} = \boxed{${st(e, 'V')}}`),
          on ? 'If the diode were off, node 3 would sit at V<sub>DD</sub> and the diode would have more than its forward drop across it. So it must be on, and node 3 is one diode drop above V<sub>A</sub>.' : edge ? 'Right on the edge: the diode has exactly its forward drop but carries no current. Either way e<sub>3</sub> = V<sub>DD</sub>.' : 'Even with node 3 as high as it can go (V<sub>DD</sub>), there is not enough voltage to turn the diode on. No current flows, so there is no drop across R<sub>L</sub>.'); };
      return step('Method', D(T`\text{Assume OFF} \;\rightarrow\; e_3 = V_{DD} \;\rightarrow\; \text{check } V_{DD} - V_A \text{ against } V_D`), 'With a constant-drop diode you guess a state, solve, and check the guess. Off is the easy guess because no current means no drop across R<sub>L</sub>.') +
        F.dor(v, { noval: true, hl: true }) + one(v.VA1, a.e3a, '(i)') + one(v.VA2, a.e3b, '(ii)') +
        tip('R<sub>L</sub> never appears in the answers. It only sets how much current flows when the diode is on.') +
        (paper === 'AUT24' ? flag('The question says V<sub>A</sub> = 4.5 V but the answer box is labelled "e3 when VA = 5 V". Both give e<sub>3</sub> = 5 V, so the answer is the same either way.') : ''); },
  });
  dor('aut24-1e', 'AUT24', { RL: 10e3, VD: 0.5, VA1: 0.25 });
  dor('spr25-1e', 'SPR25', { RL: 20e3, VD: 0.65, VA1: 0.35 });

  // ---------------------------------------------------------------- DI6: bridge rectifier + smoothing capacitor (AUT25 1e)
  LK.add({
    id: 'aut25-1e', topic: 'diode', tags: ['bridge rectifier', 'transformer', 'smoothing capacitor'], src: exam('AUT25', '1(e)'),
    title: 'Transformer, bridge rectifier and smoothing capacitor → V<sub>56</sub>',
    params: { Vp: p(230, 'V', null, 0, pk([115, 230, 325])), n: p(23, '', null, 0, pk([10, 11.5, 23])), C: p(100e-6, 'F', null, 0, pk([100e-6, 470e-6])), Vth: p(0.7, 'V', null, 0, pk([0.6, 0.7])), f: p(50, 'Hz', null, 0, pk([50])) },
    hideParams: ['Vp', 'n', 'Vth', 'f'], lead: (v) => `Turns ratio N<sub>1</sub>:N<sub>2</sub> = ${U.num(v.n)}:1. Each diode has a threshold V<sub>th</sub> = ${U.given(v.Vth, 'V')} and zero on-resistance. V<sub>12</sub> = ${U.num(v.Vp)} sin(100πt) V.`,
    ask: 'Estimate the peak-to-peak voltage V<sub>56</sub> between nodes 5 and 6.',
    fig: (v) => F.bridge(v),
    calc: (v) => ({ Vsec: v.Vp / v.n, Vpk: v.Vp / v.n - 2 * v.Vth, pp: 0 }),
    answers: [{ k: 'Vpk', label: 'Level V<sub>56</sub> settles at', unit: 'V' }, { k: 'pp', label: 'Peak-to-peak ripple (no load)', unit: 'V' }],
    tran: (v) => ({ net: [['V', '3', '4', (t) => v.Vp / v.n * sin(TAU * v.f * t)], ['D', '3', '5', v.Vth], ['D', '4', '5', v.Vth], ['D', '0', '3', v.Vth], ['D', '0', '4', v.Vth], ['C', '5', '0', v.C], ['R', '5', '0', 1e9]], t0: 0, t1: 3 / v.f, steps: 6000, tol: 1e-2,
      probe: (r) => ({ Vpk: r.max('5', r.t1 - 1 / v.f, r.t1) }) }),
    hints: ['Step the voltage down by the turns ratio first.', 'In a bridge, the current always passes through <b>two</b> diodes in series.', 'Look at what is connected across the capacitor. Is there anything to discharge it?'],
    sol: (v, a) => step('1 · Secondary voltage', D(T`V_{34,peak} = \frac{V_{12,peak}}{N_1/N_2} = \frac{${U.num(v.Vp)}}{${U.num(v.n)}} = ${st(a.Vsec, 'V')}`), 'An ideal transformer divides the voltage by the turns ratio.') +
      step('2 · Through the bridge', D(T`V_{56,peak} = V_{34,peak} - 2V_{th} = ${U.num(a.Vsec, 4)} - 2\times${U.num(v.Vth)} = \boxed{${st(a.Vpk, 'V')}}`), 'On each half-cycle the current goes out through one diode and back through another (D<sub>1</sub> and D<sub>2</sub>, or D<sub>3</sub> and D<sub>4</sub>). Two threshold drops are lost. The bridge flips the negative half-cycles, so node 5 is always positive.') +
      step('3 · What the capacitor does', D(T`V_{56}(t) \to ${st(a.Vpk, 'V')}\ \text{(constant)}, \qquad \Delta V_{pp} \approx \boxed{0\ \mathrm{V}}`), 'C charges to the peak. The figure shows <b>no load</b> across nodes 5 and 6, and the diodes block reverse current, so nothing discharges it. It sits at the peak.') +
      step('4 · If there were a load R', D(T`\Delta V_{pp} \approx \frac{V_{56,peak}}{2fRC}`), 'With a load the capacitor droops between top-ups. A bridge tops up twice per cycle, so the discharge time is about 1/(2f). Know this formula in case the load is drawn next time.') +
      flag('This question is ambiguous. With no load drawn, the ideal peak-to-peak ripple is zero and V<sub>56</sub> is a steady ' + U.si(a.Vpk, 'V') + '. The examiner may have meant the peak value. In the exam, state the peak (' + U.si(a.Vpk, 'V') + '), say the ripple is ≈ 0 because there is no load, and quote the ripple formula. Worth asking the lecturer.'),
  });
  LK.F6 = F;
})(typeof window !== 'undefined' ? window : globalThis);
