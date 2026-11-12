// TOPIC 3 — Impedance and admittance (phasors): every past-paper part
(function (G) {
  const { S, U, B, LK } = G;
  const { D, I, step, trap, tip, flag, w, p, rR, pk, T, st, gt } = B;
  const Z = U.Z;
  const val = (x, v, k, u) => (x && x.noval ? '' : U.given(v[k], u));
  const exam = (paper, q, marks = '20%') => ({ type: 'exam', paper, q, label: `${paper} · Q${q}`, marks });
  const deg = (r) => r * 180 / Math.PI, TAU = 2 * Math.PI;
  // complex number as TeX "a + jb"
  const cT = (z, sf = 3) => `${U.num(z[0], sf)} ${z[1] < 0 ? '-' : '+'} j${U.num(Math.abs(z[1]), sf)}`;
  B.cT = cT;

  const F = {};
  F.rlc = (v, x = {}) => w(
    S.term([30, 60], 'A') + S.R([30, 60], [140, 60], { lab: 'R1', val: val(x, v, 'R1', 'Ω') }) +
    S.L([140, 60], [250, 60], { lab: 'L2', val: val(x, v, 'L2', 'H') }) +
    (x.noC ? '' : S.C([250, 60], [340, 60], { lab: 'C3', val: val(x, v, 'C3', 'F') })) +
    S.term([x.noC ? 250 : 340, 60], 'B', 'right'), x.noC ? 300 : 390, 100);
  F.rcnet = (v, x = {}) => w(
    S.wire([[70, 40], [190, 40]]) + S.wire([[70, 210], [190, 210]]) +
    S.C([70, 40], [70, 210], { lab: 'C1', side: 'left', val: val(x, v, 'C1', 'F'), hl: x.hl === 'C1' }) +
    S.R([190, 40], [190, 125], { lab: 'R2', val: val(x, v, 'R2', 'Ω'), hl: x.hl === 'br' }) +
    S.C([190, 125], [190, 210], { lab: 'C2', val: val(x, v, 'C2', 'F'), hl: x.hl === 'br' }) +
    S.dot([70, 40]) + S.dot([70, 210]) + S.dot([190, 125]) +
    S.flag([70, 40], '1', 'left') + S.flag([70, 210], '2', 'left') + S.flag([190, 125], '3', 'left'), 280, 245);
  F.ab = (v, x = {}) => w(
    S.term([30, 60], 'A') + S.R([30, 60], [140, 60], { lab: 'R1', val: val(x, v, 'R1', 'Ω') }) +
    S.L([140, 60], [250, 60], { lab: 'L', val: val(x, v, 'L', 'H') }) +
    S.C([250, 60], [250, 180], { lab: 'C', side: 'left', val: val(x, v, 'C', 'F'), hl: x.hl }) +
    S.wire([[250, 60], [340, 60]]) + S.R([340, 60], [340, 180], { lab: 'R2', val: val(x, v, 'R2', 'Ω'), hl: x.hl }) +
    S.wire([[30, 180], [340, 180]]) + S.term([30, 180], 'B') + S.dot([250, 60]) + S.dot([250, 180]), 410, 215);
  // phasor triangle: R along x, X up/down
  const tri = (R, X) => {
    const sc = 110 / Math.max(Math.abs(R), Math.abs(X), 1e-9), x1 = 60 + R * sc, y0 = X >= 0 ? 150 : 40, y1 = y0 - X * sc;
    return `<svg viewBox="0 0 300 190" class="schem plot" xmlns="http://www.w3.org/2000/svg"><line x1="60" y1="${y0}" x2="${x1}" y2="${y0}" stroke="var(--blue)" stroke-width="2.6"/>
      <line x1="${x1}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="var(--cur)" stroke-width="2.6"/><line x1="60" y1="${y0}" x2="${x1}" y2="${y1}" stroke="var(--hl)" stroke-width="2.6"/>
      <text x="${(60 + x1) / 2}" y="${y0 + (X >= 0 ? 18 : -8)}" text-anchor="middle" class="sl" fill="var(--blue)">R (real)</text>
      <text x="${x1 + 8}" y="${(y0 + y1) / 2 + 4}" class="sl" fill="var(--cur)">X (imag)</text>
      <text x="${(60 + x1) / 2 - 12}" y="${(y0 + y1) / 2 + (X >= 0 ? -8 : 16)}" text-anchor="end" class="sl" fill="var(--hl)">|Z|</text>
      <text x="92" y="${y0 + (X >= 0 ? -6 : 16)}" class="sv">θ</text></svg>`;
  };
  B.tri = tri;

  // ---------------------------------------------------------------- IM1: series RLC
  const rlc = (id, paper, prm, variant) => LK.add({
    id, topic: 'imp', tags: ['series RLC', variant === 'Y' ? 'admittance' : 'impedance'], src: exam(paper, '1(d)'), symset: 'exam',
    title: variant === 'Y' ? 'Series RLC → admittance magnitude and phase' : 'Series RLC → impedance magnitude and phase',
    params: prm,
    ask: variant === 'Y' ? 'Calculate the magnitude and phase angle of the admittance Y of the network at frequency f.' : 'Calculate the magnitude and phase angle of the impedance Z of the network at frequency f.',
    fig: (v) => F.rlc(v),
    calc: (v) => { const om = TAU * v.f, XL = om * v.L2, XC = 1 / (om * v.C3), X = XL - XC, Zm = Math.hypot(v.R1, X), Zp = deg(Math.atan2(X, v.R1)); return { om, XL, XC, X, Zm, Zp, Ym: 1 / Zm, Yp: -Zp }; },
    answers: variant === 'Y' ? [{ k: 'Ym', label: '|Y|', unit: 'S' }, { k: 'Yp', label: 'Phase of Y', unit: '°' }] : [{ k: 'Zm', label: '|Z|', unit: 'Ω' }, { k: 'Zp', label: 'Phase of Z', unit: '°' }],
    ac: (v) => ({ w: TAU * v.f, net: [['I', '0', 'A', 1], ['R', 'A', 'x', v.R1], ['L', 'x', 'y', v.L2], ['C', 'y', '0', v.C3]],
      probe: (s, c) => ({ Zm: c.abs(s.v('A')), Zp: c.deg(s.v('A')), Ym: 1 / c.abs(s.v('A')), Yp: -c.deg(s.v('A')) }) }),
    hints: ['Series: impedances add. Z = R + jωL + 1/(jωC).', '1/j = −j, so the capacitor contributes −j/(ωC).'],
    sol: (v, a) => step('1 · Angular frequency', D(T`\omega = 2\pi f = 2\pi\times${gt(v.f, 'Hz')} = ${U.num(a.om, 4)}\ \mathrm{rad/s}`), 'Impedance formulas use ω in rad/s, not f in Hz.') +
      step('2 · Reactances', D(T`X_L = \omega L_2 = ${st(a.XL, 'Ω', 4)}, \qquad X_C = \frac{1}{\omega C_3} = ${st(a.XC, 'Ω', 4)}`), 'An inductor is +jωL and a capacitor is 1/(jωC) = −j/(ωC).') +
      step('3 · Add them (series)', D(T`Z = R_1 + j(X_L - X_C) = ${U.num(v.R1, 4)} ${a.X < 0 ? '-' : '+'} j${U.num(Math.abs(a.X), 4)}\ \Omega`) + tri(v.R1, a.X), 'In series the same current flows through each, so the impedances simply add.') +
      step('4 · Magnitude', D(T`|Z| = \sqrt{R_1^2 + X^2} = \sqrt{${U.num(v.R1, 4)}^2 + ${U.num(a.X, 4)}^2} = ${variant === 'Z' ? T`\boxed{${st(a.Zm, 'Ω')}}` : st(a.Zm, 'Ω', 4)}`), 'Pythagoras on the real and imaginary parts.') +
      step('5 · Phase', D(T`\theta_Z = \tan^{-1}\!\left(\frac{X}{R_1}\right) = \tan^{-1}\!\left(\frac{${U.num(a.X, 4)}}{${U.num(v.R1, 4)}}\right) = ${variant === 'Z' ? T`\boxed{${st(a.Zp, '°')}}` : st(a.Zp, '°')}`), a.X < 0 ? 'X is negative, so the capacitor wins and the angle is negative.' : 'X is positive, so the inductor wins and the angle is positive.') +
      (variant === 'Y' ? step('6 · Flip to admittance', D(T`|Y| = \frac{1}{|Z|} = \boxed{${st(a.Ym, 'S')}}, \qquad \theta_Y = -\theta_Z = \boxed{${st(a.Yp, '°')}}`), 'Y = 1/Z. Dividing flips the magnitude and changes the sign of the angle.') : '') +
      trap('Calculator in the wrong angle mode, or forgetting the minus sign on the capacitor term.'),
  });
  rlc('aut21-1d', 'AUT21', { R1: p(1300, 'Ω', 'η', 1, rR(100, 5000)), L2: p(18e-3, 'H', null, 0, pk([10e-3, 18e-3, 47e-3])), C3: p(100e-9, 'F', null, 0, pk([47e-9, 82e-9, 100e-9, 220e-9])), f: p(1000, 'Hz', 'ε', 1, pk([1e3, 2e3, 4e3, 5e3])) }, 'Z');
  rlc('spr22-1d', 'SPR22', { R1: p(40, 'Ω', null, 0, pk([40, 100, 220])), L2: p(18e-3, 'H', null, 0, pk([10e-3, 18e-3, 47e-3])), C3: p(82e-9, 'F', null, 0, pk([47e-9, 82e-9, 100e-9])), f: p(4000, 'Hz', 'ε', 1, pk([1e3, 2e3, 4e3, 5e3])) }, 'Z');
  rlc('spr21-1d', 'SPR21', { R1: p(4700, 'Ω', 'η', 1, rR(1000, 9000)), L2: p(10e-3, 'H', 'θ', 1e-3, pk([10e-3, 15e-3, 22e-3])), C3: p(100e-12, 'F', 'λ', 1e-12, pk([47e-12, 100e-12, 220e-12])), f: p(200e3, 'Hz', 'ε', 1e3, pk([100e3, 150e3, 200e3, 300e3])) }, 'Y');

  // ---------------------------------------------------------------- IM2: series RL
  LK.add({
    id: 'aut22-1d', topic: 'imp', tags: ['series RL', 'impedance'], src: exam('AUT22', '1(d)'),
    title: 'Series RL → impedance magnitude and phase',
    params: { R1: p(40, 'Ω', null, 0, pk([22, 40, 68, 100])), L2: p(18e-3, 'H', null, 0, pk([10e-3, 18e-3, 33e-3])), f: p(1000, 'Hz', null, 0, pk([500, 1e3, 2e3])) },
    ask: 'Calculate the magnitude and phase angle of the impedance Z of the RL network at frequency f.',
    fig: (v) => F.rlc(v, { noC: true }),
    calc: (v) => { const om = TAU * v.f, XL = om * v.L2; return { om, XL, Zm: Math.hypot(v.R1, XL), Zp: deg(Math.atan2(XL, v.R1)) }; },
    answers: [{ k: 'Zm', label: '|Z|', unit: 'Ω' }, { k: 'Zp', label: 'Phase of Z', unit: '°' }],
    ac: (v) => ({ w: TAU * v.f, net: [['I', '0', 'A', 1], ['R', 'A', 'x', v.R1], ['L', 'x', '0', v.L2]], probe: (s, c) => ({ Zm: c.abs(s.v('A')), Zp: c.deg(s.v('A')) }) }),
    hints: ['Z = R + jωL.'],
    sol: (v, a) => step('1 · Reactance', D(T`X_L = \omega L_2 = 2\pi\times${gt(v.f, 'Hz')}\times${gt(v.L2, 'H')} = ${st(a.XL, 'Ω', 4)}`), 'The inductor\'s impedance is jωL. It grows with frequency.') +
      step('2 · Impedance', D(T`Z = R_1 + jX_L = ${U.num(v.R1)} + j${U.num(a.XL, 4)}\ \Omega`) + tri(v.R1, a.XL), 'Series, so add.') +
      step('3 · Magnitude and phase', D(T`|Z| = \sqrt{${U.num(v.R1)}^2 + ${U.num(a.XL, 4)}^2} = \boxed{${st(a.Zm, 'Ω')}}`) + D(T`\theta = \tan^{-1}\!\left(\frac{${U.num(a.XL, 4)}}{${U.num(v.R1)}}\right) = \boxed{${st(a.Zp, '°')}}`), 'Pythagoras for the size, inverse tan for the angle. Inductive, so the angle is positive.'),
  });
  LK.add({
    id: 'spr23-1d', topic: 'imp', tags: ['series RL', 'impedance'], src: exam('SPR23', '1(d)'),
    title: 'Series RL → frequency where real = imaginary',
    params: { R1: p(40, 'Ω', null, 0, pk([22, 40, 68, 100])), L2: p(18e-3, 'H', null, 0, pk([10e-3, 18e-3, 33e-3])) },
    ask: 'Calculate the frequency f at which the real and imaginary parts of Z have equal magnitude. Then calculate the magnitude and phase of Z at that frequency.',
    fig: (v) => F.rlc(v, { noC: true }),
    calc: (v) => ({ f: v.R1 / (TAU * v.L2), Zm: v.R1 * Math.SQRT2, Zp: 45 }),
    answers: [{ k: 'f', label: 'f', unit: 'Hz' }, { k: 'Zm', label: '|Z| at f', unit: 'Ω' }, { k: 'Zp', label: 'Phase of Z at f', unit: '°' }],
    chk: (v, a, sim) => { const s = sim.ac([['I', '0', 'A', 1], ['R', 'A', 'x', v.R1], ['L', 'x', '0', v.L2]], TAU * a.f); const z = s.v('A'); return [['re=im', z[0], z[1]], ['Zm', sim.cx.abs(z), a.Zm], ['Zp', sim.cx.deg(z), a.Zp]]; },
    hints: ['Z = R + jωL. Real part R, imaginary part ωL. Set them equal.'],
    sol: (v, a) => step('1 · Write Z', D(T`Z = R_1 + j\omega L_2`), 'Series RL. Real part is R<sub>1</sub>, imaginary part is ωL<sub>2</sub>.') +
      step('2 · Set real = imaginary', D(T`\omega L_2 = R_1 \;\Rightarrow\; f = \frac{R_1}{2\pi L_2} = \frac{${U.num(v.R1)}}{2\pi\times${gt(v.L2, 'H')}} = \boxed{${st(a.f, 'Hz')}}`), 'The question tells you the condition. Solve it for ω, then divide by 2π.') +
      step('3 · Magnitude and phase', D(T`|Z| = \sqrt{R_1^2 + R_1^2} = R_1\sqrt2 = \boxed{${st(a.Zm, 'Ω')}}, \qquad \theta = \tan^{-1}(1) = \boxed{45^\circ}`) + tri(1, 1), 'Equal sides make a 45° triangle, so no calculator needed.') +
      tip('This is the "corner frequency" of an RL circuit. The same idea gives f = 1/(2πRC) for RC.'),
  });

  // ---------------------------------------------------------------- IM3: RC network formula
  const rcnet = (id, paper, variant) => LK.add({
    id, topic: 'imp', tags: ['formula', variant === 'Y' ? 'admittance' : 'impedance'], src: exam(paper, '1(c)'),
    title: variant === 'Y' ? 'Write a formula for the admittance Y₁₂(jω)' : 'Write a formula for the impedance Z₁₂(jω)',
    params: { R2: p(1000, 'Ω', null, 0, rR()), C1: p(100e-9, 'F', null, 0, pk([47e-9, 100e-9, 220e-9])), C2: p(220e-9, 'F', null, 0, pk([47e-9, 100e-9, 220e-9])), f: p(1000, 'Hz', null, 0, pk([500, 1e3, 2e3])) },
    hideParams: ['R2', 'C1', 'C2', 'f'], symbolic: true,
    note: (v) => `The exam answer is a formula. To check yours, plug in R<sub>2</sub> = ${U.given(v.R2, 'Ω')}, C<sub>1</sub> = ${U.given(v.C1, 'F')}, C<sub>2</sub> = ${U.given(v.C2, 'F')}, f = ${U.given(v.f, 'Hz')}.`,
    ask: variant === 'Y' ? 'Write a formula for the admittance Y<sub>12</sub>(jω) of the RC network between nodes 1 and 2.' : 'Write a formula for the impedance Z<sub>12</sub>(jω) of the RC network between nodes 1 and 2.',
    fig: (v) => F.rcnet(v, { noval: true }),
    calc: (v) => { const om = TAU * v.f, Y = Z.add([0, om * v.C1], Z.div([0, om * v.C2], [1, om * v.R2 * v.C2])); return { Ym: Z.abs(Y), Zm: 1 / Z.abs(Y) }; },
    answers: variant === 'Y' ? [{ k: 'Ym', label: 'Check: |Y<sub>12</sub>| at the test values', unit: 'S' }] : [{ k: 'Zm', label: 'Check: |Z<sub>12</sub>| at the test values', unit: 'Ω' }],
    ac: (v) => ({ w: TAU * v.f, net: [['I', '0', '1', 1], ['C', '1', '0', v.C1], ['R', '1', '3', v.R2], ['C', '3', '0', v.C2]], probe: (s, c) => ({ Zm: c.abs(s.v('1')), Ym: 1 / c.abs(s.v('1')) }) }),
    hints: ['Two branches between nodes 1 and 2: C<sub>1</sub> alone, and R<sub>2</sub> in series with C<sub>2</sub>.', 'Parallel branches: <b>admittances add</b>. Find Y first, even if the question wants Z.'],
    sol: (v, a) => step('1 · Spot the structure', F.rcnet(v, { noval: true, hl: 'br' }), 'Two branches join nodes 1 and 2. Left: C<sub>1</sub>. Right: R<sub>2</sub> in series with C<sub>2</sub>. The branches are in parallel.') +
      step('2 · Admittance of each branch', D(T`Y_{C1} = j\omega C_1, \qquad Y_{R2C2} = \frac{1}{R_2 + \dfrac{1}{j\omega C_2}} = \frac{j\omega C_2}{1 + j\omega R_2C_2}`), 'Series inside the right branch: add impedances, then flip. Multiply top and bottom by jωC<sub>2</sub> to tidy it.') +
      step('3 · Parallel: add admittances', D(T`${variant === 'Y' ? '\\boxed{' : ''}Y_{12}(j\omega) = j\omega C_1 + \frac{j\omega C_2}{1 + j\omega R_2C_2}${variant === 'Y' ? '}' : ''}`) + D(T`Y_{12} = \frac{j\omega(C_1 + C_2) - \omega^2R_2C_1C_2}{1 + j\omega R_2C_2}`), 'Parallel branches share the same voltage, so their currents (and admittances) add.') +
      (variant === 'Z' ? step('4 · Flip for the impedance', D(T`\boxed{Z_{12}(j\omega) = \frac{1 + j\omega R_2C_2}{j\omega(C_1 + C_2) - \omega^2R_2C_1C_2}}`), 'Z = 1/Y. With a single fraction, just swap top and bottom.') : '') +
      step('Number check', D(variant === 'Y' ? T`|Y_{12}| = ${st(a.Ym, 'S')}` : T`|Z_{12}| = ${st(a.Zm, 'Ω')}`), 'Plugging numbers into your own formula is the quickest way to catch an algebra slip.') +
      tip('AUT24 asked for Z<sub>12</sub>. SPR25 asked for Y<sub>12</sub> of the same network. Low-frequency check: Y → jω(C<sub>1</sub>+C<sub>2</sub>), two capacitors in parallel ✓.'),
  });
  rcnet('aut24-1c', 'AUT24', 'Z');
  rcnet('spr25-1c', 'SPR25', 'Y');

  // ---------------------------------------------------------------- IM4: R + L in series with (C || R)
  LK.add({
    id: 'aut25-1d', topic: 'imp', tags: ['series-parallel', 'impedance'], src: exam('AUT25', '1(d)'),
    title: 'Series R–L feeding C ∥ R → |Z| and phase',
    params: { R1: p(6, 'Ω', null, 0, pk([4.7, 6, 10, 22])), L: p(430e-6, 'H', null, 0, pk([220e-6, 430e-6, 1e-3, 2.2e-3])), C: p(252e-6, 'F', null, 0, pk([10e-6, 47e-6, 100e-6, 252e-6])), R2: p(137, 'Ω', null, 0, pk([47, 100, 137, 220])), f: p(1000, 'Hz', null, 0, pk([500, 1e3, 2e3])) },
    ask: 'Calculate the magnitude and phase of the impedance Z<sub>AB</sub> between nodes A and B at frequency f.',
    fig: (v) => F.ab(v),
    calc: (v) => { const om = TAU * v.f, XL = om * v.L, XC = 1 / (om * v.C), Zp = Z.par([v.R2, 0], [0, -XC]), Zt = Z.add([v.R1, XL], Zp); return { om, XL, XC, Zp, Zt, Zm: Z.abs(Zt), Zph: Z.deg(Zt) }; },
    answers: [{ k: 'Zm', label: '|Z<sub>AB</sub>|', unit: 'Ω' }, { k: 'Zph', label: 'Phase of Z<sub>AB</sub>', unit: '°' }],
    ac: (v) => ({ w: TAU * v.f, net: [['I', '0', 'A', 1], ['R', 'A', 'x', v.R1], ['L', 'x', 'y', v.L], ['C', 'y', '0', v.C], ['R', 'y', '0', v.R2]], probe: (s, c) => ({ Zm: c.abs(s.v('A')), Zph: c.deg(s.v('A')) }) }),
    hints: ['C and R<sub>2</sub> share both nodes: parallel. That pair is in series with R<sub>1</sub> and L.', 'Parallel of R and −jX: (R)(−jX)/(R − jX). Multiply top and bottom by (R + jX).'],
    sol: (v, a) => step('1 · Structure', F.ab(v, { noval: true, hl: true }) + D(T`Z_{AB} = R_1 + j\omega L + \left(R_2 \parallel \frac{1}{j\omega C}\right)`), 'C and R<sub>2</sub> both go from the top wire to the B wire, so they are in parallel. R<sub>1</sub> and L are in series with that pair.') +
      step('2 · Reactances', D(T`\omega = 2\pi\times${gt(v.f, 'Hz')} = ${U.num(a.om, 4)}\ \mathrm{rad/s}`) + D(T`X_L = \omega L = ${st(a.XL, 'Ω', 4)}, \qquad X_C = \frac{1}{\omega C} = ${st(a.XC, 'Ω', 4)}`), 'Turn each L and C into ohms at this frequency.') +
      step('3 · The parallel pair', D(T`Z_p = \frac{R_2(-jX_C)}{R_2 - jX_C} = \frac{R_2X_C^2 - jR_2^2X_C}{R_2^2 + X_C^2} = ${cT(a.Zp, 4)}\ \Omega`), 'Product over sum, then multiply top and bottom by the conjugate (R<sub>2</sub> + jX<sub>C</sub>) to get a real denominator.') +
      step('4 · Add the series parts', D(T`Z_{AB} = (${U.num(v.R1)} + ${U.num(a.Zp[0], 4)}) + j(${U.num(a.XL, 4)} ${a.Zp[1] < 0 ? '-' : '+'} ${U.num(Math.abs(a.Zp[1]), 4)}) = ${cT(a.Zt, 4)}\ \Omega`) + tri(a.Zt[0], a.Zt[1]), 'Real parts add to real parts, imaginary to imaginary.') +
      step('5 · Magnitude and phase', D(T`|Z_{AB}| = \sqrt{${U.num(a.Zt[0], 4)}^2 + ${U.num(a.Zt[1], 4)}^2} = \boxed{${st(a.Zm, 'Ω')}}`) + D(T`\theta = \tan^{-1}\!\left(\frac{${U.num(a.Zt[1], 4)}}{${U.num(a.Zt[0], 4)}}\right) = \boxed{${st(a.Zph, '°')}}`), 'Same last two moves as every impedance question.') +
      tip('Sanity check: X<sub>C</sub> is tiny next to R<sub>2</sub>, so the capacitor nearly shorts R<sub>2</sub> out and Z<sub>p</sub> ≈ −jX<sub>C</sub>.'),
  });
  LK.F3 = F;
})(typeof window !== 'undefined' ? window : globalThis);
