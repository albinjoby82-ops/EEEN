// TOPIC 4 — AC power, transformers and maximum power transfer: every past-paper part
(function (G) {
  const { S, U, B, LK } = G;
  const { D, I, step, trap, tip, flag, w, p, rR, pk, T, st, gt, cT } = B;
  const Z = U.Z;
  const val = (x, v, k, u) => (x && x.noval ? '' : U.given(v[k], u));
  const exam = (paper, q, marks = '20%') => ({ type: 'exam', paper, q, label: `${paper} · Q${q}`, marks });
  const TAU = 2 * Math.PI;

  const F = {};
  // source + Rs -> transformer -> RL
  F.xres = (v, x = {}) => w(
    S.Vac([40, 60], [40, 180], { lab: 'Vs', side: 'left' }) + S.R([40, 60], [150, 60], { lab: 'Rs', val: val(x, v, 'Rs', 'Ω') }) +
    S.wire([[150, 60], [184, 60]]) + S.wire([[40, 180], [184, 180]]) + S.xfmr(200, 60, 180, x.turns ? { l1: x.turns[0], l2: x.turns[1] } : {}) +
    S.wire([[216, 60], [320, 60]]) + S.wire([[216, 180], [320, 180]]) + S.R([320, 60], [320, 180], { lab: 'RL', val: val(x, v, 'RL', 'Ω'), hl: x.hl }) + S.gnd([110, 180]), 400, 225);
  // reflected equivalent
  F.refl = (rsT, rT) => w(
    S.Vac([40, 60], [40, 180], { lab: 'Vs', side: 'left' }) + S.R([40, 60], [190, 60], { lab: 'Rs', val: rsT }) +
    S.R([190, 60], [190, 180], { lab: "n²RL", val: rT, hl: true }) + S.wire([[40, 180], [190, 180]]), 290, 220);
  // source + Rs feeding a load between A and B
  F.load = (v, x = {}) => w(
    S.Vac([40, 60], [40, 190], { lab: 'Vs', side: 'left' }) + S.R([40, 60], [170, 60], { lab: 'Rs', val: val(x, v, 'Rs', 'Ω') }) +
    (x.kind === 'rl'
      ? S.R([170, 60], [170, 125], { lab: 'R1', val: val(x, v, 'R1', 'Ω'), hl: true }) + S.L([170, 125], [170, 190], { lab: 'L2', val: val(x, v, 'L2', 'H') })
      : S.wire([[170, 60], [260, 60]]) + S.wire([[170, 190], [260, 190]]) + S.R([170, 60], [170, 190], { lab: 'R1', side: 'left', val: val(x, v, 'R1', 'Ω'), hl: true }) + S.C([260, 60], [260, 190], { lab: 'C2', val: val(x, v, 'C2', 'F') })) +
    S.wire([[40, 190], [170, 190]]) + S.dot([170, 60]) + S.dot([170, 190]) + S.flag([170, 60], 'A', 'up') + S.flag([170, 190], 'B', 'down') + S.gnd([100, 190]), x.kind === 'rl' ? 270 : 340, 240);
  F.xrl = (v, x = {}) => w(
    S.Vac([40, 60], [40, 180], { lab: 'Vs', side: 'left' }) + S.wire([[40, 60], [124, 60]]) + S.wire([[40, 180], [124, 180]]) + S.xfmr(140, 60, 180) +
    S.wire([[156, 60], [270, 60]]) + S.wire([[156, 180], [270, 180]]) +
    S.R([270, 60], [270, 120], { lab: 'R', val: val(x, v, 'R', 'Ω'), hl: true }) + S.L([270, 120], [270, 180], { lab: 'L', val: val(x, v, 'L', 'H') }) + S.gnd([80, 180]) + S.gnd([215, 180]), 350, 225);
  F.cs = (v, x = {}) => w(
    S.Vac([40, 60], [40, 210], { lab: 'Vs', side: 'left' }) + S.R([40, 60], [150, 60], { lab: 'Rs', val: val(x, v, 'Rs', 'Ω') }) +
    S.C([150, 60], [260, 60], { lab: 'Cs', hl: true }) +
    S.R([260, 60], [260, 135], { lab: 'Rload', val: val(x, v, 'Rl', 'Ω') }) + S.L([260, 135], [260, 210], { lab: 'Lload', val: val(x, v, 'Ll', 'H') }) +
    S.wire([[40, 210], [260, 210]]) + S.gnd([150, 210]) + S.dot([150, 60]) + S.dot([260, 60]) + S.dot([260, 135]) +
    S.flag([40, 60], '1', 'up') + S.flag([150, 60], '2', 'up') + S.flag([260, 60], '3', 'up') + S.flag([260, 135], '4', 'left'), 350, 255);
  F.xrlc = (v, x = {}) => w(
    S.Vac([40, 60], [40, 190], { lab: 'Vs', side: 'left' }) + S.R([40, 60], [140, 60], { lab: 'Rs', val: val(x, v, 'Rs', 'Ω') }) +
    S.wire([[140, 60], [164, 60]]) + S.wire([[40, 190], [164, 190]]) + S.xfmr(180, 60, 190) +
    S.wire([[196, 60], [350, 60]]) + S.wire([[196, 190], [350, 190]]) +
    S.R([270, 60], [270, 125], { lab: 'Rload', side: 'left', val: val(x, v, 'Rl', 'Ω'), hl: x.hl }) + S.L([270, 125], [270, 190], { lab: 'Lload', side: 'left', val: val(x, v, 'Ll', 'H'), hl: x.hl }) +
    S.C([350, 60], [350, 190], { lab: 'Cload', val: val(x, v, 'Cl', 'F') }) + S.gnd([90, 190]) + S.gnd([270, 190]) +
    S.dot([270, 60]) + S.dot([270, 190]) + S.dot([270, 125]) + S.flag([40, 60], '1', 'up') + S.flag([140, 60], '2', 'up') + S.flag([270, 60], '3', 'up'), 440, 235);

  // ---------------------------------------------------------------- PW1: transformer + resistive load
  const xres = (id, paper, f0, fstep, ansRs) => LK.add({
    id, topic: 'pow', tags: ['transformer', 'average power'], src: exam(paper, '1(a)'), symset: 'exam',
    title: 'Ideal transformer with a resistive load → average power',
    params: { A: p(1, 'V', 'ε', 1e-3, pk([1, 2, 5, 10])), Rs: p(1000, 'Ω', 'η', 1, rR()), RL: p(10, 'Ω', null, 0, pk([8, 10, 16, 22])), N1: p(1000, '', null, 0, pk([500, 1000, 2000])), N2: p(100, '', null, 0, pk([100, 200])), f: p(f0, 'Hz', 'δ', fstep, pk([500, 1e3, 5e3])) },
    lead: (v) => `The source is V<sub>s</sub> = A cos(2πft). The ideal transformer has N<sub>1</sub> = ${v.N1} primary turns and N<sub>2</sub> = ${v.N2} secondary turns.`,
    hideParams: ['N1', 'N2'],
    ask: 'Calculate the average steady-state power dissipated in resistor R<sub>L</sub>.' + (ansRs ? ' (The answer box on this paper says R<sub>s</sub>, so find that too.)' : ''),
    fig: (v) => F.xres(v),
    calc: (v) => { const n = v.N1 / v.N2, Rr = n * n * v.RL, I1 = v.A / (v.Rs + Rr); return { n, Rr, I1, PRL: 0.5 * I1 * I1 * Rr, PRs: 0.5 * I1 * I1 * v.Rs }; },
    answers: ansRs ? [{ k: 'PRL', label: 'P in R<sub>L</sub>', unit: 'W' }, { k: 'PRs', label: 'P in R<sub>s</sub>', unit: 'W' }] : [{ k: 'PRL', label: 'P in R<sub>L</sub>', unit: 'W' }],
    ac: (v) => ({ w: TAU * v.f, net: [['V', '1', '0', v.A], ['R', '1', '2', v.Rs], ['XF', '2', '0', '3', '0', v.N1 / v.N2], ['R', '3', '0', v.RL]],
      probe: (s, c) => ({ PRL: c.abs(s.v('3')) ** 2 / (2 * v.RL), PRs: c.abs(c.sub(s.v('1'), s.v('2'))) ** 2 / (2 * v.Rs) }) }),
    hints: ['Move R<sub>L</sub> to the primary side: it looks like (N<sub>1</sub>/N<sub>2</sub>)² R<sub>L</sub>.', 'A is a <b>peak</b> value. Average power = ½ I<sub>peak</sub>² R.'],
    sol: (v, a) => step('1 · Turns ratio', D(T`n = \frac{N_1}{N_2} = \frac{${v.N1}}{${v.N2}} = ${U.num(a.n)}`), 'Voltage scales by n, current by 1/n, so impedance scales by n².') +
      step('2 · Reflect the load to the primary', D(T`R' = n^2R_L = ${U.num(a.n)}^2\times${U.num(v.RL)}\,\Omega = ${st(a.Rr, 'Ω')}`) + F.refl(U.given(v.Rs, 'Ω'), U.si(a.Rr, 'Ω')), 'An ideal transformer makes the load look n² times bigger from the source side. Now it is a plain series circuit.') +
      step('3 · Primary current (peak)', D(T`I_1 = \frac{A}{R_s + R'} = \frac{${gt(v.A, 'V')}}{${U.num(v.Rs, 4)} + ${U.num(a.Rr, 4)}} = ${st(a.I1, 'A')}`), 'Only resistors, so no phase shift. Frequency does not matter here.') +
      step('4 · Average power', D(T`P_{R_L} = \tfrac12 I_1^2R' = \tfrac12(${st(a.I1, 'A')})^2\times${st(a.Rr, 'Ω')} = \boxed{${st(a.PRL, 'W')}}`), 'An ideal transformer loses nothing, so the power in R′ is the power in R<sub>L</sub>. The ½ is there because A is a peak value (P = V<sub>rms</sub>I<sub>rms</sub>).') +
      (ansRs ? step('5 · Power in R<sub>s</sub>', D(T`P_{R_s} = \tfrac12 I_1^2R_s = \boxed{${st(a.PRs, 'W')}}`), 'Same current flows through R<sub>s</sub>.') + flag('The question asks for the power in R<sub>L</sub> but the answer box is labelled "dissipated in Rs". Give both in the exam and say which is which.') : '') +
      trap('Forgetting the ½, or reflecting with n instead of n². f is a decoy.'),
  });
  xres('aut21-1a', 'AUT21', 5000, 1, false);
  xres('spr22-1a', 'SPR22', 500, 1, true);

  // ---------------------------------------------------------------- PW2/PW3: source + Rs + reactive load
  LK.add({
    id: 'aut22-1a', topic: 'pow', tags: ['average power', 'RL load'], src: exam('AUT22', '1(a)'),
    title: 'Average power in a series RL load',
    params: { Vm: p(325, 'V', null, 0, pk([155, 325])), f: p(50, 'Hz', null, 0, pk([50, 60])), Rs: p(10, 'Ω', null, 0, pk([5, 10, 22])), R1: p(100, 'Ω', null, 0, pk([47, 100, 220])), L2: p(0.5, 'H', null, 0, pk([0.2, 0.5, 1])) },
    lead: () => 'V<sub>s</sub> = V<sub>m</sub> cos(2πft). The load (right of A and B) is R<sub>1</sub> in series with L<sub>2</sub>.',
    ask: 'Calculate the average steady-state power dissipated in the load.',
    fig: (v) => F.load(v, { kind: 'rl' }),
    calc: (v) => { const XL = TAU * v.f * v.L2, Zm = Math.hypot(v.Rs + v.R1, XL), Ipk = v.Vm / Zm; return { XL, Zm, Ipk, P: 0.5 * Ipk * Ipk * v.R1 }; },
    answers: [{ k: 'P', label: 'P in the load', unit: 'W' }],
    ac: (v) => ({ w: TAU * v.f, net: [['V', '1', '0', v.Vm], ['R', '1', 'A', v.Rs], ['R', 'A', 'x', v.R1], ['L', 'x', '0', v.L2]], probe: (s, c) => ({ P: c.abs(c.sub(s.v('A'), s.v('x'))) ** 2 / (2 * v.R1) }) }),
    hints: ['Only resistors dissipate average power. Find the current, then ½I²R<sub>1</sub>.', 'The current is set by the <b>total</b> impedance R<sub>s</sub> + R<sub>1</sub> + jωL<sub>2</sub>.'],
    sol: (v, a) => step('1 · Reactance of L<sub>2</sub>', D(T`X_L = 2\pi fL_2 = 2\pi\times${U.num(v.f)}\times${U.num(v.L2)} = ${st(a.XL, 'Ω', 4)}`), 'Turn the inductor into ohms at 50 Hz.') +
      step('2 · Total impedance', D(T`|Z| = \sqrt{(R_s + R_1)^2 + X_L^2} = \sqrt{${U.num(v.Rs + v.R1)}^2 + ${U.num(a.XL, 4)}^2} = ${st(a.Zm, 'Ω', 4)}`), 'Everything is in series, so one current, limited by all three parts.') +
      step('3 · Peak current', D(T`I = \frac{V_m}{|Z|} = \frac{${U.num(v.Vm)}}{${U.num(a.Zm, 4)}} = ${st(a.Ipk, 'A')}`), 'Ohm\'s law with magnitudes.') +
      step('4 · Average power in the load', D(T`P = \tfrac12 I^2R_1 = \tfrac12(${U.num(a.Ipk, 4)})^2\times${U.num(v.R1)} = \boxed{${st(a.P, 'W')}}`), 'The inductor stores and returns energy; on average it dissipates nothing. Only R<sub>1</sub> counts. R<sub>s</sub> is not part of the load.') +
      trap('Using P = V<sub>m</sub>²/(2R<sub>1</sub>). The load does not get the full source voltage.'),
  });
  LK.add({
    id: 'spr23-1a', topic: 'pow', tags: ['average power', 'RC load'], src: exam('SPR23', '1(a)'),
    title: 'Average power in a parallel RC load',
    params: { Vm: p(325, 'V', null, 0, pk([155, 325])), f: p(50, 'Hz', null, 0, pk([50, 60])), Rs: p(10, 'Ω', null, 0, pk([5, 10, 22])), R1: p(100, 'Ω', null, 0, pk([47, 100, 220])), C2: p(220e-6, 'F', null, 0, pk([47e-6, 100e-6, 220e-6])) },
    lead: () => 'V<sub>s</sub> = V<sub>m</sub> cos(2πft). The load (right of A and B) is R<sub>1</sub> in parallel with C<sub>2</sub>.',
    ask: 'Calculate the average steady-state power dissipated in the load.',
    fig: (v) => F.load(v, { kind: 'rc' }),
    calc: (v) => { const XC = 1 / (TAU * v.f * v.C2), ZL = Z.par([v.R1, 0], [0, -XC]), Zt = Z.add([v.Rs, 0], ZL), Vab = v.Vm * Z.abs(ZL) / Z.abs(Zt); return { XC, ZL, Zt, Vab, P: Vab * Vab / (2 * v.R1) }; },
    answers: [{ k: 'P', label: 'P in the load', unit: 'W' }],
    ac: (v) => ({ w: TAU * v.f, net: [['V', '1', '0', v.Vm], ['R', '1', 'A', v.Rs], ['R', 'A', '0', v.R1], ['C', 'A', '0', v.C2]], probe: (s, c) => ({ P: c.abs(s.v('A')) ** 2 / (2 * v.R1) }) }),
    hints: ['Find the voltage across the load (a divider with complex impedances).', 'Only R<sub>1</sub> dissipates power: P = |V<sub>AB</sub>|²/(2R<sub>1</sub>).'],
    sol: (v, a) => step('1 · Reactance of C<sub>2</sub>', D(T`X_C = \frac{1}{2\pi fC_2} = ${st(a.XC, 'Ω', 4)}`), 'Turn the capacitor into ohms at this frequency.') +
      step('2 · Load impedance', D(T`Z_L = R_1 \parallel (-jX_C) = \frac{R_1X_C^2 - jR_1^2X_C}{R_1^2 + X_C^2} = ${cT(a.ZL, 4)}\ \Omega`), 'Parallel: product over sum, then clear the complex denominator.') +
      step('3 · Voltage across the load', D(T`|V_{AB}| = V_m\frac{|Z_L|}{|R_s + Z_L|} = ${U.num(v.Vm)}\times\frac{${U.num(Z.abs(a.ZL), 4)}}{${U.num(Z.abs(a.Zt), 4)}} = ${st(a.Vab, 'V')}`), 'Voltage divider between R<sub>s</sub> and the load, using magnitudes at the end.') +
      step('4 · Average power', D(T`P = \frac{|V_{AB}|^2}{2R_1} = \frac{${U.num(a.Vab, 4)}^2}{2\times${U.num(v.R1)}} = \boxed{${st(a.P, 'W')}}`), 'R<sub>1</sub> has the load voltage directly across it. The capacitor dissipates nothing on average.') +
      tip('AUT22 used a series RL load (find the current). This one is parallel (find the voltage). Pick whichever quantity R<sub>1</sub> shares.'),
  });

  // ---------------------------------------------------------------- PW4: transformer + series RL load
  const xrl = (id, paper, R, L) => LK.add({
    id, topic: 'pow', tags: ['transformer', 'average power', 'RL load'], src: exam(paper, '1(a)'),
    title: 'Step-down transformer feeding a series RL load',
    params: { Vm: p(325, 'V', null, 0, pk([155, 325])), f: p(50, 'Hz', null, 0, pk([50, 60])), n: p(65, '', null, 0, pk([10, 20, 32.5, 65])), R: p(R, 'Ω', null, 0, pk([47, 100, 200])), L: p(L, 'H', null, 0, pk([0.2, 0.5, 1])) },
    hideParams: ['n'],
    lead: (v) => `V<sub>s</sub> = V<sub>m</sub> cos(2πft). The turns ratio is N<sub>1</sub>/N<sub>2</sub> = ${U.num(v.n)}.`,
    ask: 'Calculate the average steady-state power dissipated in the load.',
    fig: (v) => F.xrl(v),
    calc: (v) => { const V2 = v.Vm / v.n, XL = TAU * v.f * v.L, Zm = Math.hypot(v.R, XL), I2 = V2 / Zm; return { V2, XL, Zm, I2, P: 0.5 * I2 * I2 * v.R }; },
    answers: [{ k: 'P', label: 'P in the load', unit: 'W' }],
    ac: (v) => ({ w: TAU * v.f, net: [['V', '1', '0', v.Vm], ['XF', '1', '0', '3', '0', v.n], ['R', '3', 'x', v.R], ['L', 'x', '0', v.L]], probe: (s, c) => ({ P: c.abs(c.sub(s.v('3'), s.v('x'))) ** 2 / (2 * v.R) }) }),
    hints: ['No source resistance: the secondary voltage is simply V<sub>m</sub> ÷ (N<sub>1</sub>/N<sub>2</sub>).', 'Then it is a series RL circuit: I = V/|Z|, P = ½I²R.'],
    sol: (v, a) => step('1 · Secondary voltage (peak)', D(T`V_2 = \frac{V_m}{N_1/N_2} = \frac{${U.num(v.Vm)}}{${U.num(v.n)}} = ${st(a.V2, 'V')}`), 'An ideal transformer divides the voltage by the turns ratio. Nothing is in series with the source, so the primary gets all of V<sub>m</sub>.') +
      step('2 · Load impedance', D(T`X_L = 2\pi fL = ${st(a.XL, 'Ω', 4)}, \qquad |Z| = \sqrt{R^2 + X_L^2} = ${st(a.Zm, 'Ω', 4)}`), 'Series RL on the secondary side.') +
      step('3 · Load current (peak)', D(T`I_2 = \frac{V_2}{|Z|} = \frac{${U.num(a.V2, 4)}}{${U.num(a.Zm, 4)}} = ${st(a.I2, 'A')}`), 'Ohm\'s law with magnitudes.') +
      step('4 · Average power', D(T`P = \tfrac12 I_2^2R = \tfrac12(${st(a.I2, 'A')})^2\times${U.num(v.R)}\,\Omega = \boxed{${st(a.P, 'W')}}`), 'Only R dissipates. ½ because these are peak values.') +
      tip('325 V peak is 230 V rms mains. 325/65 = 5 V peak on the secondary.'),
  });
  xrl('aut23-1a', 'AUT23', 100, 0.5);
  xrl('spr24-1a', 'SPR24', 200, 1);

  // ---------------------------------------------------------------- PW5: series capacitor for maximum power
  const cs = (id, paper, vals, both) => LK.add({
    id, topic: 'pow', tags: ['max power transfer', 'resonance'], src: exam(paper, '1(d)'),
    title: both ? 'Maximum power into an RL load, and the C that gives it' : 'Series capacitor for maximum power transfer',
    params: { Vm: p(vals.Vm, 'V', null, 0, pk([1, 2, 5])), f: p(10e3, 'Hz', null, 0, pk([5e3, 10e3, 20e3])), Rs: p(50, 'Ω', null, 0, pk([50, 75])), Rl: p(50, 'Ω', null, 0, pk([50, 75])), Ll: p(vals.L, 'H', null, 0, pk([1e-3, 4.7e-3, 10e-3, 18e-3])) },
    lead: (v) => `V<sub>s</sub> = ${U.num(v.Vm)} sin(2πft). The load is R<sub>load</sub> in series with L<sub>load</sub>.`, hideParams: ['Vm'],
    ask: both ? 'Calculate the maximum power that can be dissipated in the load, and the value of C<sub>s</sub> at which this happens.' : 'Calculate the value of C<sub>s</sub> for which maximum power is transferred from V<sub>s</sub> to the load.',
    fig: (v) => F.cs(v),
    calc: (v) => { const om = TAU * v.f, Cs = 1 / (om * om * v.Ll), Ipk = v.Vm / (v.Rs + v.Rl); return { om, XL: om * v.Ll, Cs, Ipk, P: 0.5 * Ipk * Ipk * v.Rl }; },
    answers: both ? [{ k: 'P', label: 'P<sub>max</sub> in the load', unit: 'W' }, { k: 'Cs', label: 'C<sub>s</sub>', unit: 'F' }] : [{ k: 'Cs', label: 'C<sub>s</sub>', unit: 'F' }],
    chk: (v, a, sim) => { const P = (C) => { const s = sim.ac([['V', '1', '0', v.Vm], ['R', '1', '2', v.Rs], ['C', '2', '3', C], ['R', '3', '4', v.Rl], ['L', '4', '0', v.Ll]], a.om); return sim.cx.abs(sim.cx.sub(s.v('3'), s.v('4'))) ** 2 / (2 * v.Rl); };
      return [['P', P(a.Cs), a.P], ['isMax+', P(a.Cs * 1.02) < P(a.Cs) ? 1 : 0, 1], ['isMax-', P(a.Cs * 0.98) < P(a.Cs) ? 1 : 0, 1]]; },
    hints: ['Power in R<sub>load</sub> is ½|I|²R<sub>load</sub>. Biggest current = smallest total impedance.', 'The capacitor\'s −j/(ωC) can cancel the inductor\'s +jωL.'],
    sol: (v, a) => step('1 · Total impedance seen by the source', D(T`Z = R_s + R_{load} + j\left(\omega L_{load} - \frac{1}{\omega C_s}\right)`), 'One series loop, so add every impedance.') +
      step('2 · Condition for maximum power', D(T`\omega L_{load} = \frac{1}{\omega C_s}`), 'P = ½|I|²R<sub>load</sub>, so you want the biggest current. The resistors are fixed; the only thing you can remove is the reactance. Choose C<sub>s</sub> so the two reactances cancel (series resonance).') +
      step('3 · Solve for C<sub>s</sub>', D(T`\omega = 2\pi\times${gt(v.f, 'Hz')} = ${U.num(a.om, 4)}\ \mathrm{rad/s}`) + D(T`C_s = \frac{1}{\omega^2L_{load}} = \frac{1}{(${U.num(a.om, 4)})^2\times${gt(v.Ll, 'H')}} = \boxed{${st(a.Cs, 'F')}}`), 'Rearranged resonance condition.') +
      (both ? step('4 · The maximum power', D(T`I = \frac{V_m}{R_s + R_{load}} = \frac{${U.num(v.Vm)}}{${U.num(v.Rs + v.Rl)}} = ${st(a.Ipk, 'A')}`) + D(T`P_{max} = \tfrac12 I^2R_{load} = \tfrac12(${st(a.Ipk, 'A')})^2\times${U.num(v.Rl)}\,\Omega = \boxed{${st(a.P, 'W')}}`), 'With the reactances cancelled, only the two resistors limit the current. Since R<sub>s</sub> = R<sub>load</sub>, the load is also matched: P<sub>max</sub> = V<sub>m</sub>²/(8R<sub>s</sub>).') : '') +
      tip('AUT24 asked for C<sub>s</sub> only. SPR25 asked for C<sub>s</sub> and P<sub>max</sub>.'),
  });
  cs('aut24-1d', 'AUT24', { Vm: 1, L: 1e-3 }, false);
  cs('spr25-1d', 'SPR25', { Vm: 2, L: 18e-3 }, true);

  // ---------------------------------------------------------------- PW6: turns ratio for matching
  LK.add({
    id: 'aut25-1c', topic: 'pow', tags: ['max power transfer', 'transformer'], src: exam('AUT25', '1(c)'),
    title: 'Turns ratio for maximum power transfer',
    params: { Vm: p(9, 'V', null, 0, pk([5, 9, 12])), Rs: p(50, 'Ω', null, 0, pk([50, 75, 600, 1000])), RL: p(32, 'Ω', null, 0, pk([4, 8, 16, 32])) },
    lead: (v) => `An amplifier with output resistance R<sub>s</sub> drives R<sub>L</sub> through an ideal transformer. V<sub>s</sub> = ${U.num(v.Vm)} sin(2000πt) V.`, hideParams: ['Vm'],
    ask: 'Calculate the turns ratio N<sub>1</sub>/N<sub>2</sub> that transfers the maximum power from the source to the load.',
    fig: (v) => F.xres(v, { hl: true }),
    calc: (v) => ({ n: Math.sqrt(v.Rs / v.RL), P: v.Vm * v.Vm / (8 * v.Rs) }),
    answers: [{ k: 'n', label: 'N<sub>1</sub>/N<sub>2</sub>', unit: '' }],
    chk: (v, a, sim) => { const P = (n) => { const s = sim.ac([['V', '1', '0', v.Vm], ['R', '1', '2', v.Rs], ['XF', '2', '0', '3', '0', n], ['R', '3', '0', v.RL]], 1000); return sim.cx.abs(s.v('3')) ** 2 / (2 * v.RL); };
      return [['P', P(a.n), a.P], ['isMax+', P(a.n * 1.05) < P(a.n) ? 1 : 0, 1], ['isMax-', P(a.n * 0.95) < P(a.n) ? 1 : 0, 1]]; },
    hints: ['Maximum power transfer: the load the source <b>sees</b> must equal R<sub>s</sub>.', 'Through the transformer the source sees (N<sub>1</sub>/N<sub>2</sub>)² R<sub>L</sub>.'],
    sol: (v, a) => step('1 · What the source sees', D(T`R' = \left(\frac{N_1}{N_2}\right)^2R_L`) + F.refl('Rs', "n²RL"), 'Reflect R<sub>L</sub> to the primary side.') +
      step('2 · Matching condition', D(T`R' = R_s`), 'A source with internal resistance R<sub>s</sub> delivers the most power when the load resistance equals R<sub>s</sub> (maximum power transfer theorem).') +
      step('3 · Solve', D(T`\frac{N_1}{N_2} = \sqrt{\frac{R_s}{R_L}} = \sqrt{\frac{${U.num(v.Rs)}}{${U.num(v.RL)}}} = \boxed{${U.num(a.n)}}`), 'Square root because impedance goes with the square of the turns ratio.') +
      tip(`The power delivered is then V<sub>m</sub>²/(8R<sub>s</sub>) = ${U.si(a.P, 'W')}. The source voltage and frequency are decoys for the ratio.`),
  });

  // ---------------------------------------------------------------- PW7: Q3 transformer + RLC load
  const zl = (v) => { const om = TAU * v.f, Zs = [v.Rl, om * v.Ll], Zc = [0, -1 / (om * v.Cl)], Zld = Z.par(Zs, Zc), Zr = Z.sc(Zld, v.n * v.n), V2 = Z.div(Zr, Z.add([v.Rs, 0], Zr));
    return { om, den: [1 - om * om * v.Ll * v.Cl, om * v.Rl * v.Cl], Zld, Re: Zld[0], Im: Zld[1], Zr, e3: Z.abs(V2) * v.Vm / v.n }; };
  const xrlc = (id, paper, vals, nGiven) => LK.add({
    id, topic: 'pow', tags: ['transformer', 'RLC load', 'impedance'], src: exam(paper, '3', '50 marks'),
    title: 'Transformer feeding an RLC load: Z<sub>load</sub> and the voltage on node 3',
    params: { Vm: p(1, 'V', null, 0, pk([1, 2])), f: p(1000, 'Hz', null, 0, pk([500, 1e3, 2e3])), Rs: p(100, 'Ω', null, 0, pk([50, 100, 600])), n: p(10, '', null, 0, pk([5, 10, 20])), Rl: p(vals.R, 'Ω', null, 0, pk([10, 15, 22])), Ll: p(vals.L, 'H', null, 0, pk([100e-3, 180e-3, 220e-3])), Cl: p(vals.C, 'F', null, 0, pk([47e-9, 100e-9, 120e-9])) },
    hideParams: ['Vm', 'n'],
    lead: (v) => `A source (V<sub>s</sub>, R<sub>s</sub>) drives a load (R<sub>load</sub>, L<sub>load</sub>, C<sub>load</sub>) through an ideal transformer with N<sub>1</sub>:N<sub>2</sub> = ${U.num(v.n)}:1. V<sub>s</sub> is a sine wave of amplitude ${U.num(v.Vm)} V.`,
    ask: '(a) Derive Z<sub>load</sub>(jω). (b) Find its real and imaginary parts at f. (c) Find the amplitude of the voltage on node 3.',
    fig: (v) => F.xrlc(v),
    calc: zl,
    answers: [{ k: 'Re', label: 'Re{Z<sub>load</sub>}', unit: 'Ω' }, { k: 'Im', label: 'Im{Z<sub>load</sub>}', unit: 'Ω' }, { k: 'e3', label: 'Amplitude of e<sub>3</sub>', unit: 'V' }],
    ac: (v) => ({ w: TAU * v.f, net: [['V', '1', '0', v.Vm], ['R', '1', '2', v.Rs], ['XF', '2', '0', '3', '0', v.n], ['R', '3', '4', v.Rl], ['L', '4', '0', v.Ll], ['C', '3', '0', v.Cl]], probe: (s, c) => ({ e3: c.abs(s.v('3')) }) }),
    chk: (v, a, sim) => { const s = sim.ac([['I', '0', '3', 1], ['R', '3', '4', v.Rl], ['L', '4', '0', v.Ll], ['C', '3', '0', v.Cl]], a.om); return [['Re', s.v('3')[0], a.Re], ['Im', s.v('3')[1], a.Im]]; },
    hints: ['R<sub>load</sub> and L<sub>load</sub> are in series. That branch is in parallel with C<sub>load</sub>.', 'For (c): reflect the load to the primary (×n²), use a voltage divider with R<sub>s</sub>, then step the voltage down by n.'],
    sol: (v, a) => step('(a) · Structure of the load', F.xrlc(v, { noval: true, hl: true }) + D(T`Z_{load} = (R_{load} + j\omega L_{load}) \parallel \frac{1}{j\omega C_{load}}`), 'From node 3 to ground there are two branches: R then L in series, and C on its own.') +
      step('(a) · Simplify', D(T`Z_{load} = \frac{(R + j\omega L)\dfrac{1}{j\omega C}}{R + j\omega L + \dfrac{1}{j\omega C}} \;\Rightarrow\; \boxed{Z_{load}(j\omega) = \frac{R_{load} + j\omega L_{load}}{1 - \omega^2L_{load}C_{load} + j\omega R_{load}C_{load}}}`), 'Product over sum, then multiply top and bottom by jωC to clear the small fractions. Note j·j = −1 gives the −ω²LC term.') +
      step('(b) · Numbers', D(T`\omega = ${U.num(a.om, 4)}\ \mathrm{rad/s}, \quad \omega L = ${U.num(a.om * v.Ll, 4)}\,\Omega`) + D(T`1 - \omega^2LC = ${U.num(a.den[0], 4)}, \qquad \omega RC = ${U.num(a.den[1], 4)}`) + D(T`Z_{load} = \frac{${U.num(v.Rl)} + j${U.num(a.om * v.Ll, 4)}}{${U.num(a.den[0], 4)} + j${U.num(a.den[1], 4)}}`), 'Work out each piece first so the division is tidy.') +
      step('(b) · Divide', D(T`\mathrm{Re}\{Z_{load}\} = \boxed{${st(a.Re, 'Ω')}}, \qquad \mathrm{Im}\{Z_{load}\} = \boxed{${st(a.Im, 'Ω')}}`), 'Multiply top and bottom by the conjugate of the bottom: (a+jb)/(c+jd) = [(ac+bd) + j(bc−ad)]/(c²+d²).') +
      step('(c) · Reflect to the primary', D(T`Z' = n^2Z_{load} = ${U.num(v.n)}^2\times Z_{load} = ${cT(Z.sc(a.Zr, 1e-3), 4)}\ \mathrm{k}\Omega`), 'From the source side the load looks n² times bigger.') +
      step('(c) · Divider, then step down', D(T`|e_2| = V_s\left|\frac{Z'}{R_s + Z'}\right| = ${st(a.e3 * v.n, 'V')}, \qquad |e_3| = \frac{|e_2|}{n} = \boxed{${st(a.e3, 'V')}}`), 'R<sub>s</sub> and Z′ form a divider on the primary side. The secondary voltage is the primary voltage divided by n.') +
      tip('Z′ is far bigger than R<sub>s</sub>, so almost all of V<sub>s</sub> appears on the primary and e<sub>3</sub> ≈ V<sub>s</sub>/n.') +
      (nGiven ? '' : flag('This paper only says "a turns ratio of N1:N2" and gives no number, so part (c) cannot be finished numerically. The resit (SPR25) gives 10:1, which is what the answer above uses. In the exam, leave the answer in terms of n: |e<sub>3</sub>| ≈ V<sub>s</sub>/n.')),
  });
  xrlc('aut24-3', 'AUT24', { R: 10, L: 220e-3, C: 100e-9 }, false);
  xrlc('spr25-3', 'SPR25', { R: 15, L: 180e-3, C: 120e-9 }, true);
  LK.F4 = F;
})(typeof window !== 'undefined' ? window : globalThis);
