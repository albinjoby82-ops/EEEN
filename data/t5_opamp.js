// TOPIC 5 — Op-amps and transfer functions H(ω): every past-paper part (Q2 of every paper + Q1(e) of seven)
(function (G) {
  const { S, U, B, LK } = G;
  const { D, I, step, trap, tip, flag, w, p, rR, pk, T, st, gt, cT, phT, wrap } = B;
  const Z = U.Z;
  const val = (x, v, k, u) => (x && x.noval ? '' : U.given(v[k], u));
  const exam = (paper, q, marks = '20%') => ({ type: 'exam', paper, q, label: `${paper} · Q${q}`, marks });
  const TAU = 2 * Math.PI, deg = (r) => r * 180 / Math.PI, dB = (x) => 20 * Math.log10(x);
  const outT = (Vm, fn, wt, ph) => `${st(Vm, 'V')}\\,\\${fn}(${wt} ${phT(ph)})`;
  const vout = (x, y) => S.wire([[x, y], [x + 38, y]]) + S.text([x + 44, y + 5], 'V<tspan class="ssub" dy="4">out</tspan>', { anchor: 'start', cls: 'sl b' });
  const golden = `<p>Two rules for an ideal op-amp with negative feedback:</p><p><b>1.</b> No current flows into either input.</p><p><b>2.</b> The output moves until V<sub>−</sub> = V<sub>+</sub>.</p>`;

  const F = {};
  // inverting amp with R || C feedback
  F.invlp = (v, x = {}) => w(
    S.Vac([40, 130], [40, 220], { lab: 'V1', side: 'left' }) + S.R([40, 130], [150, 130], { lab: 'R2', val: val(x, v, 'R2', 'Ω') }) +
    S.wire([[150, 130], [180, 130]]) + S.opamp([180, 144]) + S.wire([[180, 158], [166, 158], [166, 220]]) + S.wire([[40, 220], [166, 220]]) + S.gnd([166, 220]) +
    S.wire([[150, 130], [150, 30]]) + S.R([150, 75], [262, 75], { lab: 'R4', side: 'bottom', off: 4, val: val(x, v, 'R4', 'Ω'), hl: x.hlF }) + S.C([150, 30], [262, 30], { lab: 'C3', val: val(x, v, 'C3', 'F'), hl: x.hlF }) +
    S.wire([[262, 30], [262, 144]]) + S.wire([[240, 144], [262, 144]]) + vout(262, 144) +
    S.dot([150, 130]) + S.dot([150, 75]) + S.dot([262, 75]) + S.dot([262, 144]) + (x.extra || ''), 350, 250);
  // non-inverting amp. o.hp: C + R high-pass at the + input. o.cap: capacitor across the feedback resistor.
  F.ni = (v, o, x = {}) => w(
    S.Vac([40, 170], [40, 250], { lab: o.n.vin, side: 'left' }) +
    (o.hp ? S.C([40, 170], [130, 170], { lab: o.n.ch, val: val(x, v, o.n.ch, 'F') }) + S.R([130, 170], [130, 250], { lab: o.n.rh, val: val(x, v, o.n.rh, 'Ω') }) + S.dot([130, 170]) + S.flag([130, 170], '1', 'up') : S.wire([[40, 170], [130, 170]])) +
    S.wire([[130, 170], [200, 170]]) + S.opamp([200, 156]) + S.wire([[40, 250], [130, 250]]) + S.gnd([o.hp ? 130 : 85, 250]) +
    S.wire([[200, 142], [180, 142], [180, 80]]) + S.R([70, 80], [180, 80], { lab: o.n.rg, val: val(x, v, o.n.rg, 'Ω') }) + S.gnd([70, 80]) +
    S.R([180, 80], [284, 80], { lab: o.n.rf, side: o.cap ? 'bottom' : 'top', off: o.cap ? 4 : 16, val: val(x, v, o.n.rf, 'Ω'), hl: x.hlF }) +
    (o.cap ? S.wire([[180, 80], [180, 36]]) + S.C([180, 36], [284, 36], { lab: o.n.cf, val: val(x, v, o.n.cf, 'F'), hl: x.hlF }) + S.wire([[284, 36], [284, 80]]) : '') +
    S.wire([[284, 80], [284, 156]]) + S.wire([[260, 156], [284, 156]]) + vout(284, 156) +
    S.dot([180, 80]) + S.dot([284, 80]) + S.dot([284, 156]) + S.flag([180, 142], '2', 'left') + (x.extra || ''), 370, 280);
  F.diff = (v, x = {}) => w(
    S.Vac([30, 116], [30, 250], { lab: 'Vs1', side: 'left' }) + S.R([30, 116], [190, 116], { lab: 'Ri', val: val(x, v, 'Ri', 'Ω') }) + S.wire([[190, 116], [230, 116]]) + S.opamp([230, 130]) +
    S.wire([[190, 116], [190, 30]]) + S.R([190, 72], [312, 72], { lab: 'Rf', side: 'bottom', off: 4, val: val(x, v, 'Rf', 'Ω') }) + S.C([190, 30], [312, 30], { lab: 'Cf', val: val(x, v, 'Cf', 'F') }) + S.wire([[312, 30], [312, 130]]) + S.wire([[290, 130], [312, 130]]) + vout(312, 130) +
    S.Vac([95, 180], [95, 250], { lab: 'Vs2', side: 'left' }) + S.R([95, 180], [205, 180], { lab: 'Ri', side: 'bottom', off: 4 }) + S.wire([[205, 180], [258, 180]]) + S.wire([[230, 144], [218, 144], [218, 180]]) +
    S.R([205, 180], [205, 250], { lab: 'Rf', side: 'left' }) + S.C([258, 180], [258, 250], { lab: 'Cf' }) + S.wire([[30, 250], [258, 250]]) + S.gnd([150, 250]) +
    S.dot([190, 116]) + S.dot([190, 72]) + S.dot([312, 72]) + S.dot([312, 130]) + S.dot([205, 180]) + S.dot([218, 180]) + S.dot([95, 250]) + S.dot([205, 250]), 400, 280);
  F.sk = (v, x = {}) => w(
    S.Vac([40, 150], [40, 240], { lab: 'Vin', side: 'left' }) + S.R([40, 150], [130, 150], { lab: 'R1', val: val(x, v, 'R1', 'Ω') }) + S.R([130, 150], [220, 150], { lab: 'R2', val: val(x, v, 'R2', 'Ω') }) +
    S.wire([[220, 150], [250, 150]]) + S.opamp([250, 164], { plusTop: true }) + S.wire([[250, 178], [238, 178], [238, 206], [325, 206], [325, 164]]) + S.wire([[310, 164], [325, 164]]) + vout(325, 164) +
    S.wire([[130, 150], [130, 80]]) + S.C([130, 80], [325, 80], { lab: 'C3', val: val(x, v, 'C3', 'F') }) + S.wire([[325, 80], [325, 164]]) +
    S.C([220, 150], [220, 240], { lab: 'C4', side: 'left', val: val(x, v, 'C4', 'F') }) + S.wire([[40, 240], [220, 240]]) + S.gnd([130, 240]) +
    S.dot([130, 150]) + S.dot([220, 150]) + S.dot([325, 164]) + S.flag([130, 150], '1', 'down') + S.flag([220, 150], '2', 'up') + (x.extra || ''), 410, 270);
  F.mfb = (v, x = {}) => w(
    S.Vac([40, 150], [40, 240], { lab: 'Vin', side: 'left' }) + S.R([40, 150], [130, 150], { lab: 'R', side: 'bottom', off: 4 }) + S.R([130, 150], [220, 150], { lab: 'R', side: 'bottom', off: 4 }) +
    S.wire([[220, 150], [250, 150]]) + S.opamp([250, 164]) + S.wire([[250, 178], [238, 178], [238, 240]]) + S.wire([[40, 240], [238, 240]]) + S.gnd([140, 240]) +
    S.wire([[220, 150], [220, 95]]) + S.R([220, 95], [325, 95], { lab: '2R', side: 'bottom', off: 4 }) + S.wire([[130, 150], [130, 45]]) + S.C([130, 45], [325, 45], { lab: 'C' }) + S.wire([[325, 45], [325, 164]]) + S.wire([[310, 164], [325, 164]]) + vout(325, 164) +
    S.dot([130, 150]) + S.dot([220, 150]) + S.dot([325, 95]) + S.dot([325, 164]) + S.flag([130, 150], '1', 'down') + S.flag([220, 150], '2', 'down') + (x.extra || ''), 410, 270);
  F.a25 = (v, x = {}) => w(
    S.Vac([40, 170], [40, 250], { lab: 'Vin', side: 'left' }) + S.R([40, 170], [140, 170], { lab: 'R1' }) + S.R([140, 170], [140, 250], { lab: 'R2', side: 'left' }) + S.wire([[140, 170], [240, 170]]) + S.C([200, 170], [200, 250], { lab: 'C1' }) +
    S.opamp([240, 156]) + S.wire([[40, 250], [200, 250]]) + S.gnd([100, 250]) +
    S.wire([[240, 142], [215, 142], [215, 40]]) + S.R([100, 85], [215, 85], { lab: 'R3' }) + S.gnd([100, 85]) + S.R([215, 85], [322, 85], { lab: 'R4', side: 'bottom', off: 4 }) + S.C([215, 40], [322, 40], { lab: 'C2' }) +
    S.wire([[322, 40], [322, 156]]) + S.wire([[300, 156], [322, 156]]) + vout(322, 156) +
    S.dot([140, 170]) + S.dot([200, 170]) + S.dot([215, 85]) + S.dot([322, 85]) + S.dot([322, 156]) + S.dot([140, 250]) + (x.extra || ''), 410, 280);
  F.rlc = (v, x = {}) => w(
    S.Vac([40, 60], [40, 190], { lab: 'Vs', side: 'left' }) + S.R([40, 60], [140, 60], { lab: 'Rs', val: x.noval ? '' : U.given(v.R, 'Ω') }) + S.C([140, 60], [240, 60], { lab: 'C2', val: val(x, v, 'C2', 'F') }) +
    S.L([240, 60], [240, 190], { lab: 'L1', side: 'left', val: val(x, v, 'L1', 'H'), hl: x.hl }) + S.wire([[240, 60], [320, 60]]) + S.R([320, 60], [320, 190], { lab: 'RL', val: x.noval ? '' : U.given(v.R, 'Ω'), hl: x.hl }) +
    S.wire([[40, 190], [320, 190]]) + S.gnd([240, 190]) + S.dot([240, 60]) + S.flag([40, 60], '1', 'up') + S.flag([140, 60], '2', 'up') + S.flag([240, 60], '3', 'up'), 400, 235);

  // ---------------------------------------------------------------- OP1: inverting low-pass (Q1e x6)
  const invlp = (id, paper, prm, variant, fn = 'cos') => LK.add({
    id, topic: 'opamp', tags: ['inverting amp', 'low-pass', variant === 'dcbw' ? 'gain & bandwidth' : 'Vout(t)'], src: exam(paper, '1(e)'), symset: 'exam',
    title: variant === 'dcbw' ? 'Inverting low-pass filter → DC gain (dB) and 3 dB bandwidth' : 'Inverting low-pass filter → steady-state V<sub>out</sub>(t)',
    params: prm, hideParams: variant === 'dcbw' ? [] : ['A', 'f'],
    lead: variant === 'dcbw' ? null : (v) => `V<sub>1</sub>(t) = A ${fn}(2πft) with A = ${U.given(v.A, 'V')} and f = ${U.given(v.f, 'Hz')}.`,
    ask: variant === 'dcbw' ? 'Calculate the DC voltage gain (in dB) and the 3 dB bandwidth (in Hz) of the low-pass filter.' : 'Calculate the steady-state output voltage V<sub>out</sub>(t).',
    form: variant === 'dcbw' ? null : `V<sub>out</sub>(t) = [amplitude] ${fn}(2πft + [phase])`,
    fig: (v) => F.invlp(v),
    calc: (v) => { const g0 = v.R4 / v.R2, fc = 1 / (TAU * v.R4 * v.C3), x = (v.f || 0) * TAU * v.R4 * v.C3, mag = g0 / Math.hypot(1, x); return { g0, GdB: dB(g0), bw: fc, x, mag, Vm: (v.A || 0) * mag, ph: 180 - deg(Math.atan(x)) }; },
    answers: variant === 'dcbw' ? [{ k: 'GdB', label: 'DC gain', unit: 'dB' }, { k: 'bw', label: '3 dB bandwidth', unit: 'Hz' }] : [{ k: 'Vm', label: 'Amplitude', unit: 'V' }, { k: 'ph', label: 'Phase', unit: '°' }],
    chk: (v, a, sim) => { const net = (A) => [['V', 'i', '0', A], ['R', 'i', 'x', v.R2], ['R', 'x', 'o', v.R4], ['C', 'x', 'o', v.C3], ['OP', '0', 'x', 'o']];
      if (variant === 'dcbw') { const s0 = sim.ac(net(1), 0), s1 = sim.ac(net(1), TAU * a.bw); return [['GdB', dB(sim.cx.abs(s0.v('o'))), a.GdB], ['-3dB', sim.cx.abs(s1.v('o')), a.g0 / Math.SQRT2]]; }
      const s = sim.ac(net(v.A), TAU * v.f); return [['Vm', sim.cx.abs(s.v('o')), a.Vm], ['ph', sim.cx.deg(s.v('o')), a.ph]]; },
    hints: ['V<sub>+</sub> is grounded, so V<sub>−</sub> = 0 (virtual ground). Write KCL at the − input.', 'Feedback impedance: R<sub>4</sub> ∥ 1/(jωC<sub>3</sub>) = R<sub>4</sub>/(1 + jωR<sub>4</sub>C<sub>3</sub>).'],
    sol: (v, a) => step('1 · Virtual ground', golden + D(T`V_- = V_+ = 0`), 'V<sub>+</sub> is wired to ground. Rule 2 forces V<sub>−</sub> to the same voltage.') +
      step('2 · KCL at the − input', F.invlp(v, { noval: true, hlF: true }) + D(T`\frac{V_1 - 0}{R_2} + \frac{V_{out} - 0}{Z_f} = 0 \;\Rightarrow\; \frac{V_{out}}{V_1} = -\frac{Z_f}{R_2}`), 'Rule 1: no current enters the op-amp. So the current arriving through R<sub>2</sub> must leave through the feedback path.') +
      step('3 · Feedback impedance', D(T`Z_f = R_4 \parallel \frac{1}{j\omega C_3} = \frac{R_4}{1 + j\omega R_4C_3}`), 'R<sub>4</sub> and C<sub>3</sub> share both nodes, so they are in parallel. Product over sum, then multiply top and bottom by jωC<sub>3</sub>.') +
      step('4 · Transfer function', D(T`H(\omega) = \frac{V_{out}}{V_1} = -\frac{R_4}{R_2}\cdot\frac{1}{1 + j\omega R_4C_3}`), 'Substitute Z<sub>f</sub>. The minus sign means inverting. The second factor is a first-order low-pass.') +
      (variant === 'dcbw'
        ? step('5 · DC gain', D(T`|H(0)| = \frac{R_4}{R_2} = \frac{${gt(v.R4, 'Ω')}}{${gt(v.R2, 'Ω')}} = ${U.num(a.g0)} \;\Rightarrow\; 20\log_{10}(${U.num(a.g0)}) = \boxed{${st(a.GdB, 'dB')}}`), 'At DC (ω = 0) the capacitor is an open circuit, so only R<sub>4</sub>/R<sub>2</sub> is left. dB uses 20 log<sub>10</sub> of the voltage ratio.') +
          step('6 · 3 dB bandwidth', D(T`\omega R_4C_3 = 1 \;\Rightarrow\; f_{3dB} = \frac{1}{2\pi R_4C_3} = \frac{1}{2\pi\times${gt(v.R4, 'Ω')}\times${gt(v.C3, 'F')}} = \boxed{${st(a.bw, 'Hz')}}`), '−3 dB means the gain has fallen to 1/√2 of its DC value. |1 + jx| = √2 exactly when x = 1.') +
          tip('The true DC gain is −' + U.num(a.g0) + ' (inverting). In dB you quote the magnitude.')
        : step('5 · Numbers at f = ' + U.given(v.f, 'Hz'), D(T`\omega R_4C_3 = 2\pi\times${gt(v.f, 'Hz')}\times${gt(v.R4, 'Ω')}\times${gt(v.C3, 'F')} = ${U.num(a.x, 4)}`) + D(T`|H| = \frac{R_4/R_2}{\sqrt{1 + ${U.num(a.x, 4)}^2}} = \frac{${U.num(a.g0, 4)}}{${U.num(Math.hypot(1, a.x), 4)}} = ${U.num(a.mag, 4)}`) + D(T`\angle H = 180^\circ - \tan^{-1}(${U.num(a.x, 4)}) = ${st(a.ph, '°')}`), 'The minus sign contributes 180°. The low-pass factor 1/(1+jx) contributes −tan⁻¹(x).') +
          step('6 · Write the output', D(T`\boxed{V_{out}(t) = ${outT(a.Vm, fn, '2\\pi ft', a.ph)}}`), 'In steady state a sinusoid comes out at the <b>same frequency</b>, with amplitude × |H| and phase + ∠H.') +
          trap('Leaving out the 180° from the inverting sign, or mixing radians and degrees.')),
  });
  invlp('aut21-1e', 'AUT21', { A: p(1, 'V', 'δ', 1e-3, pk([0.5, 1, 2])), R2: p(1000, 'Ω', 'ε', 1, rR()), C3: p(2000e-12, 'F', 'η', 1e-12, pk([1e-9, 2.2e-9, 4.7e-9])), R4: p(4000, 'Ω', 'θ', 1, rR()), f: p(30e3, 'Hz', null, 0, pk([10e3, 20e3, 30e3])) }, 'vout', 'sin');
  invlp('spr22-1e', 'SPR22', { A: p(2, 'V', 'δ', 1e-3, pk([0.5, 1, 2])), R2: p(3300, 'Ω', 'ε', 1, rR()), C3: p(2200e-12, 'F', 'η', 1e-12, pk([1e-9, 2.2e-9, 4.7e-9])), R4: p(8200, 'Ω', 'θ', 1, rR()), f: p(10e3, 'Hz', null, 0, pk([5e3, 10e3, 20e3])) }, 'vout');
  invlp('aut22-1e', 'AUT22', { A: p(50e-3, 'V', null, 0, pk([20e-3, 50e-3, 100e-3])), R2: p(10e3, 'Ω', null, 0, pk([4700, 10e3, 22e3])), C3: p(10e-12, 'F', null, 0, pk([10e-12, 22e-12, 47e-12])), R4: p(330e3, 'Ω', null, 0, pk([100e3, 220e3, 330e3])), f: p(50e3, 'Hz', null, 0, pk([20e3, 50e3, 100e3])) }, 'vout');
  invlp('spr23-1e', 'SPR23', { A: p(100e-3, 'V', null, 0, pk([20e-3, 50e-3, 100e-3])), R2: p(4700, 'Ω', null, 0, pk([4700, 10e3, 22e3])), C3: p(12e-12, 'F', null, 0, pk([10e-12, 12e-12, 22e-12])), R4: p(33e3, 'Ω', null, 0, pk([33e3, 100e3, 220e3])), f: p(400e3, 'Hz', null, 0, pk([100e3, 200e3, 400e3])) }, 'vout');
  invlp('aut23-1e', 'AUT23', { R2: p(10e3, 'Ω', null, 0, pk([4700, 10e3, 22e3])), C3: p(10e-12, 'F', null, 0, pk([10e-12, 47e-12, 100e-12])), R4: p(100e3, 'Ω', null, 0, pk([100e3, 180e3, 220e3])) }, 'dcbw');
  invlp('spr24-1e', 'SPR24', { R2: p(22e3, 'Ω', null, 0, pk([4700, 10e3, 22e3])), C3: p(100e-12, 'F', null, 0, pk([10e-12, 47e-12, 100e-12])), R4: p(180e3, 'Ω', null, 0, pk([100e3, 180e3, 220e3])) }, 'dcbw');

  // ---------------------------------------------------------------- OP2: non-inverting high-pass (SPR21 1e)
  const NHP = { vin: 'V1', ch: 'C2', rh: 'R3', rg: 'R4', rf: 'R5' };
  LK.add({
    id: 'spr21-1e', topic: 'opamp', tags: ['non-inverting amp', 'high-pass', 'Vout(t)'], src: exam('SPR21', '1(e)'), symset: 'exam',
    title: 'High-pass into a non-inverting amplifier → V<sub>out</sub>(t)',
    params: { A: p(1, 'V', 'ε', 1e-3, pk([0.5, 1, 2])), C2: p(2000e-12, 'F', 'η', 1e-12, pk([1e-9, 2.2e-9, 4.7e-9])), R3: p(3000, 'Ω', 'θ', 1, rR()), R4: p(4000, 'Ω', null, 0, rR()), R5: p(5000, 'Ω', null, 0, rR()), f: p(10e3, 'Hz', 'λ', 1e3, pk([5e3, 10e3, 20e3])) },
    hideParams: ['A', 'f'], lead: (v) => `V<sub>1</sub>(t) = A cos(ωt) with A = ${U.given(v.A, 'V')} and f = ${U.given(v.f, 'Hz')}.`,
    ask: 'Calculate the steady-state output voltage V<sub>out</sub>(t).', form: 'V<sub>out</sub>(t) = [amplitude] cos(ωt + [phase])',
    fig: (v) => F.ni(v, { hp: true, n: NHP }),
    calc: (v) => { const x = TAU * v.f * v.R3 * v.C2, k = 1 + v.R5 / v.R4, hp = x / Math.hypot(1, x); return { x, k, hp, Vm: v.A * k * hp, ph: 90 - deg(Math.atan(x)) }; },
    answers: [{ k: 'Vm', label: 'Amplitude', unit: 'V' }, { k: 'ph', label: 'Phase', unit: '°' }],
    ac: (v) => ({ w: TAU * v.f, net: [['V', 'i', '0', v.A], ['C', 'i', '1', v.C2], ['R', '1', '0', v.R3], ['R', '2', '0', v.R4], ['R', '2', 'o', v.R5], ['OP', '1', '2', 'o']], probe: (s, c) => ({ Vm: c.abs(s.v('o')), ph: c.deg(s.v('o')) }) }),
    hints: ['Two blocks in a row: a C–R divider to node 1, then a non-inverting amplifier.', 'No current flows into the + input, so the divider is not loaded.'],
    sol: (v, a) => step('1 · Split it into two blocks', golden, 'Rule 1 says the op-amp draws no current from node 1. So the C<sub>2</sub>–R<sub>3</sub> divider and the amplifier can be solved separately and multiplied.') +
      step('2 · Block 1: high-pass divider', D(T`\frac{e_1}{V_1} = \frac{R_3}{R_3 + \dfrac{1}{j\omega C_2}} = \frac{j\omega R_3C_2}{1 + j\omega R_3C_2}`), 'Voltage divider with the output taken across R<sub>3</sub>. Low frequencies are blocked by the capacitor.') +
      step('3 · Block 2: non-inverting gain', D(T`V_- = V_{out}\frac{R_4}{R_4 + R_5} = e_1 \;\Rightarrow\; \frac{V_{out}}{e_1} = 1 + \frac{R_5}{R_4} = ${U.num(a.k, 4)}`), 'R<sub>5</sub> and R<sub>4</sub> feed a fraction of the output back to the − input. Rule 2 makes that fraction equal e<sub>1</sub>.') +
      step('4 · Numbers', D(T`\omega R_3C_2 = 2\pi\times${gt(v.f, 'Hz')}\times${gt(v.R3, 'Ω')}\times${gt(v.C2, 'F')} = ${U.num(a.x, 4)}`) + D(T`|H| = ${U.num(a.k, 4)}\times\frac{${U.num(a.x, 4)}}{\sqrt{1 + ${U.num(a.x, 4)}^2}} = ${U.num(a.k * a.hp, 4)}, \qquad \angle H = 90^\circ - \tan^{-1}(${U.num(a.x, 4)}) = ${st(a.ph, '°')}`), 'The j on top gives +90°. The (1 + jx) underneath gives −tan⁻¹(x).') +
      step('5 · Output', D(T`\boxed{V_{out}(t) = ${outT(a.Vm, 'cos', '\\omega t', a.ph)}}`), 'Same frequency, amplitude × |H|, phase + ∠H.'),
  });

  // ---------------------------------------------------------------- OP3: difference amplifier (Q2 AUT21 / SPR22)
  LK.add({
    id: 'aut21-2', topic: 'opamp', tags: ['difference amp', 'H(ω)', 'superposition'], src: exam('AUT21', '2', '50 marks'), symset: 'exam',
    title: 'Two-input (difference) amplifier with capacitors: H<sub>1</sub>, H<sub>2</sub> and V<sub>out</sub>(t)',
    params: { A1: p(1, 'V', 'α', 1e-3, pk([0.5, 1, 1.5])), A2: p(2, 'V', 'β', 1e-3, pk([2, 2.5, 3])), Ri: p(1000, 'Ω', 'ε', 1, rR(1000, 5000)), Rf: p(10e3, 'Ω', null, 0, pk([10e3, 22e3])), Cf: p(1e-9, 'F', null, 0, pk([1e-9, 2.2e-9])), f: p(10e3, 'Hz', null, 0, pk([5e3, 10e3, 20e3])) },
    hideParams: ['A1', 'A2', 'f'], lead: (v) => `V<sub>s1</sub>(t) = A<sub>1</sub> cos(2πft) and V<sub>s2</sub>(t) = A<sub>2</sub> cos(2πft), with A<sub>1</sub> = ${U.given(v.A1, 'V')}, A<sub>2</sub> = ${U.given(v.A2, 'V')}, f = ${U.given(v.f, 'Hz')}.`,
    ask: '(a) Derive H<sub>1</sub>(ω) = V<sub>out</sub>/V<sub>s1</sub>. (b) Derive H<sub>2</sub>(ω) = V<sub>out</sub>/V<sub>s2</sub>. (c) Calculate V<sub>out</sub>(t).', form: 'V<sub>out</sub>(t) = [amplitude] cos(2πft + [phase])',
    fig: (v) => F.diff(v),
    calc: (v) => { const x = TAU * v.f * v.Rf * v.Cf, zf = v.Rf / Math.hypot(1, x), dA = v.A2 - v.A1; return { x, zf, Vm: Math.abs(dA) * zf / v.Ri, ph: wrap((dA < 0 ? 180 : 0) - deg(Math.atan(x))) }; },
    answers: [{ k: 'Vm', label: 'Amplitude', unit: 'V' }, { k: 'ph', label: 'Phase', unit: '°' }],
    ac: (v) => ({ w: TAU * v.f, net: [['V', 'a', '0', v.A1], ['V', 'b', '0', v.A2], ['R', 'a', 'n', v.Ri], ['R', 'n', 'o', v.Rf], ['C', 'n', 'o', v.Cf], ['R', 'b', 'q', v.Ri], ['R', 'q', '0', v.Rf], ['C', 'q', '0', v.Cf], ['OP', 'q', 'n', 'o']], probe: (s, c) => ({ Vm: c.abs(s.v('o')), ph: c.deg(s.v('o')) }) }),
    hints: ['Superposition: find V<sub>out</sub> with V<sub>s2</sub> = 0, then with V<sub>s1</sub> = 0.', 'Call Z<sub>f</sub> = R<sub>f</sub> ∥ C<sub>f</sub>. It appears twice: in the feedback path and from the + input to ground.'],
    sol: (v, a) => step('Set up', D(T`Z_f = R_f \parallel \frac{1}{j\omega C_f} = \frac{R_f}{1 + j\omega R_fC_f}`), 'The same R<sub>f</sub>–C<sub>f</sub> pair appears twice. Naming it keeps the algebra short.') +
      step('(a) · V<sub>s1</sub> alone', D(T`V_+ = 0 \Rightarrow V_- = 0, \qquad \frac{V_{s1}}{R_i} + \frac{V_{out}}{Z_f} = 0`) + D(T`\boxed{H_1(\omega) = -\frac{Z_f}{R_i} = -\frac{R_f}{R_i}\cdot\frac{1}{1 + j\omega R_fC_f}}`), 'With V<sub>s2</sub> = 0, no current flows in the lower branch, so V<sub>+</sub> = 0. That leaves a plain inverting amplifier.') +
      step('(b) · V<sub>s2</sub> alone: the + input', D(T`V_+ = V_{s2}\,\frac{Z_f}{R_i + Z_f}`), 'The lower R<sub>i</sub> and Z<sub>f</sub> form a voltage divider. No current enters the op-amp, so it is unloaded.') +
      step('(b) · V<sub>s2</sub> alone: non-inverting gain', D(T`V_{out} = V_+\left(1 + \frac{Z_f}{R_i}\right) = V_{s2}\,\frac{Z_f}{R_i + Z_f}\cdot\frac{R_i + Z_f}{R_i}`) + D(T`\boxed{H_2(\omega) = +\frac{Z_f}{R_i} = \frac{R_f}{R_i}\cdot\frac{1}{1 + j\omega R_fC_f}}`), 'With V<sub>s1</sub> = 0 its R<sub>i</sub> goes to ground, so from V<sub>+</sub> the circuit is a non-inverting amplifier. The (R<sub>i</sub> + Z<sub>f</sub>) factors cancel.') +
      step('(c) · Superposition', D(T`V_{out} = H_1V_{s1} + H_2V_{s2} = \frac{Z_f}{R_i}\,(V_{s2} - V_{s1})`), 'Linear circuit: add the two contributions. It amplifies the <b>difference</b>.') +
      step('(c) · Numbers', D(T`\omega R_fC_f = ${U.num(a.x, 4)}, \qquad \left|\frac{Z_f}{R_i}\right| = \frac{${gt(v.Rf, 'Ω')}/${gt(v.Ri, 'Ω')}}{\sqrt{1 + ${U.num(a.x, 4)}^2}} = ${U.num(a.zf / v.Ri, 4)}, \qquad \angle = -\tan^{-1}(${U.num(a.x, 4)}) = ${st(-deg(Math.atan(a.x)), '°')}`) + D(T`\boxed{V_{out}(t) = ${outT(a.Vm, 'cos', '2\\pi ft', a.ph)}}`), `Both inputs are cosines at the same frequency and phase, so the difference is (A<sub>2</sub> − A<sub>1</sub>) cos(2πft) = ${U.si(v.A2 - v.A1, 'V')} cos(2πft).`) +
      tip('SPR22 asked for the same circuit at DC: the capacitors vanish and the gains are ∓R<sub>f</sub>/R<sub>i</sub>.'),
  });
  LK.add({
    id: 'spr22-2', topic: 'opamp', tags: ['difference amp', 'DC gain'], src: exam('SPR22', '2', '50 marks'),
    title: 'Difference amplifier at DC: H<sub>1</sub>(0), H<sub>2</sub>(0) and V<sub>out</sub>',
    params: { Ri: p(1000, 'Ω', null, 0, rR(1000, 4700)), Rf: p(5000, 'Ω', null, 0, pk([4700, 5000, 10e3])), Cf: p(1e-9, 'F', null, 0, pk([1e-9])), Vs1: p(-0.8, 'V', null, 0, pk([-1, -0.8, -0.5, 0.5])), Vs2: p(1.2, 'V', null, 0, pk([0.8, 1.2, 1.5])) },
    ask: '(a) Calculate the DC gain H<sub>1</sub>(0) = V<sub>out</sub>/V<sub>s1</sub>. (b) Calculate H<sub>2</sub>(0) = V<sub>out</sub>/V<sub>s2</sub>. (c) Calculate V<sub>out</sub>(t) for the DC inputs given.',
    fig: (v) => F.diff(v),
    calc: (v) => ({ H1: -v.Rf / v.Ri, H2: v.Rf / v.Ri, Vo: v.Rf / v.Ri * (v.Vs2 - v.Vs1) }),
    answers: [{ k: 'H1', label: 'H<sub>1</sub>(0)', unit: '' }, { k: 'H2', label: 'H<sub>2</sub>(0)', unit: '' }, { k: 'Vo', label: 'V<sub>out</sub>', unit: 'V' }],
    chk: (v, a, sim) => { const run = (a1, a2) => sim.ac([['V', 'a', '0', a1], ['V', 'b', '0', a2], ['R', 'a', 'n', v.Ri], ['R', 'n', 'o', v.Rf], ['C', 'n', 'o', v.Cf], ['R', 'b', 'q', v.Ri], ['R', 'q', '0', v.Rf], ['C', 'q', '0', v.Cf], ['OP', 'q', 'n', 'o']], 0).v('o')[0];
      return [['H1', run(1, 0), a.H1], ['H2', run(0, 1), a.H2], ['Vo', run(v.Vs1, v.Vs2), a.Vo]]; },
    hints: ['At DC a capacitor is an open circuit. Delete both C<sub>f</sub>.', 'Then use superposition: one source at a time.'],
    sol: (v, a) => step('1 · DC means no capacitors', D(T`\omega = 0 \;\Rightarrow\; \frac{1}{j\omega C_f} \to \infty`), 'At DC a capacitor carries no current, so it can be removed. Only resistors remain.') +
      step('(a) · V<sub>s1</sub> alone', D(T`H_1(0) = -\frac{R_f}{R_i} = -\frac{${gt(v.Rf, 'Ω')}}{${gt(v.Ri, 'Ω')}} = \boxed{${U.num(a.H1)}}`), 'V<sub>s2</sub> = 0 makes V<sub>+</sub> = 0, so it is an inverting amplifier.') +
      step('(b) · V<sub>s2</sub> alone', D(T`H_2(0) = \frac{R_f}{R_i + R_f}\left(1 + \frac{R_f}{R_i}\right) = \frac{R_f}{R_i} = \boxed{${U.num(a.H2)}}`), 'Divider at the + input, then non-inverting gain. The (R<sub>i</sub> + R<sub>f</sub>) terms cancel.') +
      step('(c) · Add them', D(T`V_{out} = H_1V_{s1} + H_2V_{s2} = \frac{R_f}{R_i}(V_{s2} - V_{s1}) = ${U.num(a.H2)}\times(${U.num(v.Vs2)} - (${U.num(v.Vs1)})) = \boxed{${st(a.Vo, 'V')}}`), 'Superposition. The inputs are DC, so V<sub>out</sub>(t) is a constant.') +
      trap('Dropping the sign of V<sub>s1</sub>. Subtracting a negative makes the difference bigger.'),
  });

  // ---------------------------------------------------------------- OP4: non-inverting with Z45 (Q2 AUT22 / SPR23)
  const NQ = { vin: 'Vin', ch: 'C1', rh: 'R2', rg: 'R3', rf: 'R4', cf: 'C5' };
  const z45 = (v, f) => { const x = TAU * f * v.R4 * v.C5; return Z.add([1, 0], Z.div([v.R4 / v.R3, 0], [1, x])); };
  LK.add({
    id: 'aut22-2', topic: 'opamp', tags: ['non-inverting amp', 'H(ω)', 'Vout(t)'], src: exam('AUT22', '2', '50 marks'),
    title: 'High-pass + non-inverting amplifier with Z<sub>45</sub>: e<sub>1</sub>, V<sub>out</sub>(ω) and V<sub>out</sub>(t)',
    params: { A: p(1, 'V', null, 0, pk([0.5, 1, 2])), f: p(7000, 'Hz', null, 0, pk([3e3, 7e3, 12e3])), C1: p(100e-6, 'F', null, 0, pk([10e-6, 100e-6])), R2: p(10e3, 'Ω', null, 0, pk([10e3, 22e3])), R3: p(1000, 'Ω', null, 0, pk([1000, 2200])), R4: p(10e3, 'Ω', null, 0, pk([10e3, 22e3])), C5: p(1e-9, 'F', null, 0, pk([1e-9, 2.2e-9, 4.7e-9])) },
    hideParams: ['A', 'f'], lead: (v) => `V<sub>in</sub>(t) = A cos(2πft) with A = ${U.given(v.A, 'V')}, f = ${U.given(v.f, 'Hz')}.`,
    ask: '(a) Derive e<sub>1</sub>(ω) in terms of V<sub>in</sub>, C<sub>1</sub>, R<sub>2</sub>, ω. (b) Derive V<sub>out</sub>(ω) in terms of e<sub>2</sub>, R<sub>3</sub>, R<sub>4</sub>, C<sub>5</sub>, ω. (c) Calculate V<sub>out</sub>(t).', form: 'V<sub>out</sub>(t) = [amplitude] cos(2πft + [phase])',
    fig: (v) => F.ni(v, { hp: true, cap: true, n: NQ }),
    calc: (v) => { const x1 = TAU * v.f * v.R2 * v.C1, hp = Z.div([0, x1], [1, x1]), g = z45(v, v.f), H = Z.mul(hp, g); return { x1, x5: TAU * v.f * v.R4 * v.C5, hp, g, Vm: v.A * Z.abs(H), ph: Z.deg(H) }; },
    answers: [{ k: 'Vm', label: 'Amplitude', unit: 'V' }, { k: 'ph', label: 'Phase', unit: '°' }],
    ac: (v) => ({ w: TAU * v.f, net: [['V', 'i', '0', v.A], ['C', 'i', '1', v.C1], ['R', '1', '0', v.R2], ['R', '2', '0', v.R3], ['R', '2', 'o', v.R4], ['C', '2', 'o', v.C5], ['OP', '1', '2', 'o']], probe: (s, c) => ({ Vm: c.abs(s.v('o')), ph: c.deg(s.v('o')) }) }),
    hints: ['(a) is a C–R voltage divider. (b) is a non-inverting amplifier with Z<sub>45</sub> as the feedback impedance.', 'Rule 2 gives e<sub>2</sub> = e<sub>1</sub>, which links the two parts.'],
    sol: (v, a) => step('(a) · Node 1', D(T`\boxed{e_1(\omega) = V_{in}\,\frac{j\omega R_2C_1}{1 + j\omega R_2C_1}}`), 'C<sub>1</sub> and R<sub>2</sub> form a divider, output across R<sub>2</sub>. No current enters the + input, so nothing loads it.') +
      step('(b) · Feedback impedance', D(T`Z_{45} = R_4 \parallel \frac{1}{j\omega C_5} = \frac{R_4}{1 + j\omega R_4C_5}`), 'The hint in the paper: treat R<sub>4</sub> ∥ C<sub>5</sub> as one impedance.') +
      step('(b) · KCL at node 2', D(T`\frac{e_2}{R_3} + \frac{e_2 - V_{out}}{Z_{45}} = 0 \;\Rightarrow\; \boxed{V_{out}(\omega) = e_2\left(1 + \frac{Z_{45}}{R_3}\right) = e_2\left(1 + \frac{R_4/R_3}{1 + j\omega R_4C_5}\right)}`), 'No current enters the − input, so the current down through R<sub>3</sub> equals the current arriving through Z<sub>45</sub>.') +
      step('(c) · Link them', D(T`e_2 = e_1 \;\Rightarrow\; H(\omega) = \frac{j\omega R_2C_1}{1 + j\omega R_2C_1}\left(1 + \frac{Z_{45}}{R_3}\right)`), 'Rule 2: the op-amp holds V<sub>−</sub> = V<sub>+</sub>.') +
      step('(c) · Numbers', D(T`\omega R_2C_1 = ${U.num(a.x1, 4)} \;\Rightarrow\; \frac{e_1}{V_{in}} = ${cT(a.hp, 4)} \approx 1`) + D(T`\omega R_4C_5 = ${U.num(a.x5, 4)} \;\Rightarrow\; 1 + \frac{Z_{45}}{R_3} = 1 + \frac{${U.num(v.R4 / v.R3, 4)}}{1 + j${U.num(a.x5, 4)}} = ${cT(a.g, 4)}`) + D(T`|H| = ${U.num(a.Vm / v.A, 4)}, \qquad \angle H = ${st(a.ph, '°')}`), 'C<sub>1</sub> is huge, so the high-pass does nothing at this frequency (it only blocks DC). All the action is in the feedback.') +
      step('(c) · Output', D(T`\boxed{V_{out}(t) = ${outT(a.Vm, 'cos', '2\\pi ft', a.ph)}}`), 'Amplitude × |H|, phase + ∠H.'),
  });
  LK.add({
    id: 'spr23-2', topic: 'opamp', tags: ['non-inverting amp', 'H(ω)', 'gain in dB', 'Vout(t)'], src: exam('SPR23', '2', '50 marks'),
    title: 'Non-inverting amplifier with Z<sub>45</sub>: V<sub>out</sub>(ω), gain in dB, V<sub>out</sub>(t)',
    params: { A: p(1, 'V', null, 0, pk([0.5, 1, 2])), f1: p(1000, 'Hz', null, 0, pk([500, 1e3, 2e3])), f2: p(10e3, 'Hz', null, 0, pk([5e3, 10e3, 20e3])), R3: p(1000, 'Ω', null, 0, pk([1000, 2200])), R4: p(10e3, 'Ω', null, 0, pk([10e3, 22e3])), C5: p(4.7e-9, 'F', null, 0, pk([1e-9, 2.2e-9, 4.7e-9])) },
    hideParams: ['A', 'f1', 'f2'], lead: (v) => `A = ${U.given(v.A, 'V')}.`,
    ask: (v) => `(a) Derive V<sub>out</sub>(ω) in terms of V<sub>in</sub>, C<sub>5</sub>, R<sub>3</sub>, R<sub>4</sub>, ω. (b) Calculate the gain (dB) and phase at f = ${U.given(v.f1, 'Hz')}. (c) Calculate V<sub>out</sub>(t) when V<sub>in</sub>(t) = A cos(2πft) with f = ${U.given(v.f2, 'Hz')}.`,
    fig: (v) => F.ni(v, { hp: false, cap: true, n: NQ }),
    calc: (v) => { const g1 = z45(v, v.f1), g2 = z45(v, v.f2); return { g1, g2, x1: TAU * v.f1 * v.R4 * v.C5, x2: TAU * v.f2 * v.R4 * v.C5, GdB: dB(Z.abs(g1)), ph1: Z.deg(g1), Vm: v.A * Z.abs(g2), ph2: Z.deg(g2) }; },
    answers: [{ k: 'GdB', label: 'Gain at f₁', unit: 'dB' }, { k: 'ph1', label: 'Phase at f₁', unit: '°' }, { k: 'Vm', label: 'Amplitude at f₂', unit: 'V' }, { k: 'ph2', label: 'Phase at f₂', unit: '°' }],
    chk: (v, a, sim) => { const run = (f) => sim.ac([['V', '1', '0', v.A], ['R', '2', '0', v.R3], ['R', '2', 'o', v.R4], ['C', '2', 'o', v.C5], ['OP', '1', '2', 'o']], TAU * f).v('o');
      const o1 = run(v.f1), o2 = run(v.f2); return [['GdB', dB(sim.cx.abs(o1) / v.A), a.GdB], ['ph1', sim.cx.deg(o1), a.ph1], ['Vm', sim.cx.abs(o2), a.Vm], ['ph2', sim.cx.deg(o2), a.ph2]]; },
    hints: ['V<sub>in</sub> goes straight to the + input, so e<sub>2</sub> = V<sub>in</sub>.', 'Non-inverting gain = 1 + (feedback impedance)/(impedance to ground).'],
    sol: (v, a) => step('(a) · Feedback impedance', D(T`Z_{45} = \frac{R_4}{1 + j\omega R_4C_5}`), 'R<sub>4</sub> ∥ C<sub>5</sub>, as the paper\'s hint suggests.') +
      step('(a) · KCL at node 2', D(T`V_- = V_{in}, \qquad \frac{V_{in}}{R_3} + \frac{V_{in} - V_{out}}{Z_{45}} = 0`) + D(T`\boxed{V_{out}(\omega) = V_{in}\left(1 + \frac{R_4}{R_3}\cdot\frac{1}{1 + j\omega R_4C_5}\right)}`), 'Rule 2 puts V<sub>in</sub> on the − input. Rule 1 says the R<sub>3</sub> current equals the feedback current.') +
      step(`(b) · At ${U.given(v.f1, 'Hz')}`, D(T`\omega R_4C_5 = ${U.num(a.x1, 4)}, \qquad H = 1 + \frac{${U.num(v.R4 / v.R3, 4)}}{1 + j${U.num(a.x1, 4)}} = ${cT(a.g1, 4)}`) + D(T`|H| = ${U.num(Z.abs(a.g1), 4)} \Rightarrow \boxed{${st(a.GdB, 'dB')}}, \qquad \angle H = \boxed{${st(a.ph1, '°')}}`), 'Divide the complex fraction first (multiply by the conjugate), add 1, then take magnitude and angle. dB = 20 log<sub>10</sub>|H|.') +
      step(`(c) · At ${U.given(v.f2, 'Hz')}`, D(T`\omega R_4C_5 = ${U.num(a.x2, 4)}, \qquad H = ${cT(a.g2, 4)}, \qquad |H| = ${U.num(Z.abs(a.g2), 4)}, \quad \angle H = ${st(a.ph2, '°')}`) + D(T`\boxed{V_{out}(t) = ${outT(a.Vm, 'cos', '2\\pi ft', a.ph2)}}`), 'Same formula at the new frequency. The gain has dropped because the capacitor now bypasses R<sub>4</sub>.') +
      tip('Low-frequency check: gain → 1 + R<sub>4</sub>/R<sub>3</sub> = ' + U.num(1 + v.R4 / v.R3) + '. High-frequency: gain → 1.'),
  });

  // ---------------------------------------------------------------- OP5: Sallen-Key low-pass (Q2 AUT23 / SPR24)
  const skH = (v, f) => { const om = TAU * f; return Z.inv([1 - om * om * v.R1 * v.R2 * v.C3 * v.C4, om * v.C4 * (v.R1 + v.R2)]); };
  const sk = (id, paper, k, marks, noVals) => LK.add({
    id, topic: 'opamp', tags: ['unity-gain filter', 'H(ω)', 'phase −90°'], src: exam(paper, '2', '50 marks'),
    title: 'Second-order low-pass (Z<sub>1</sub>…Z<sub>4</sub>): H(ω), f<sub>0</sub> for −90°, V<sub>out</sub>(t)',
    params: { A: p(1, 'V', null, 0, pk([1, 2])), R1: p(10e3, 'Ω', null, 0, pk([4700, 10e3, 22e3])), R2: p(10e3, 'Ω', null, 0, pk([4700, 10e3, 22e3])), C3: p(1e-9, 'F', null, 0, pk([1e-9, 2.2e-9, 4.7e-9])), C4: p(1e-9, 'F', null, 0, pk([1e-9, 2.2e-9, 4.7e-9])), k: p(k, '', null, 0, pk([1, 1, 0.5, 2])) },
    hideParams: ['A', 'k'],
    lead: (v) => `Call the branch impedances Z<sub>1</sub> (R<sub>1</sub>), Z<sub>2</sub> (R<sub>2</sub>), Z<sub>3</sub> (C<sub>3</sub>), Z<sub>4</sub> (C<sub>4</sub>).`,
    ask: (v) => `(a) Derive H(ω) = V<sub>out</sub>/V<sub>in</sub> in terms of Z<sub>1</sub>…Z<sub>4</sub>. (b) Then in terms of R<sub>1</sub>, R<sub>2</sub>, C<sub>3</sub>, C<sub>4</sub>, ω. (c) Find the frequency f<sub>0</sub> where the phase of H is −90°. (d) Find V<sub>out</sub>(t) when V<sub>in</sub>(t) = A cos(${v.k === 1 ? '2' : v.k === 0.5 ? '' : U.num(2 * v.k)}πf<sub>0</sub>t), A = ${U.given(v.A, 'V')}.`,
    fig: (v) => F.sk(v),
    calc: (v) => { const f0 = 1 / (TAU * Math.sqrt(v.R1 * v.R2 * v.C3 * v.C4)), fin = v.k * f0, H = skH(v, fin); return { f0, fin, H, re: 1 - v.k * v.k, im: TAU * fin * v.C4 * (v.R1 + v.R2), Vm: v.A * Z.abs(H), ph: Z.deg(H) }; },
    answers: [{ k: 'f0', label: 'f<sub>0</sub>', unit: 'Hz' }, { k: 'Vm', label: 'Amplitude of V<sub>out</sub>', unit: 'V' }, { k: 'ph', label: 'Phase of V<sub>out</sub>', unit: '°' }],
    chk: (v, a, sim) => { const run = (f) => sim.ac([['V', 'i', '0', v.A], ['R', 'i', '1', v.R1], ['R', '1', '2', v.R2], ['C', '1', 'o', v.C3], ['C', '2', '0', v.C4], ['OP', '2', 'o', 'o']], TAU * f).v('o');
      const o = run(a.fin); return [['ph@f0', sim.cx.deg(run(a.f0)), -90], ['Vm', sim.cx.abs(o), a.Vm], ['ph', sim.cx.deg(o), a.ph]]; },
    hints: ['The op-amp is a follower: V<sub>out</sub> = V<sub>+</sub> = e<sub>2</sub>.', 'Write e<sub>1</sub> in terms of V<sub>out</sub> with the Z<sub>2</sub>–Z<sub>4</sub> divider, then KCL at node 1.', 'Phase is −90° when the real part of the denominator is zero.'],
    sol: (v, a) => step('(a) · The op-amp is a follower', golden + D(T`V_{out} = V_- = V_+ = e_2`), 'The output is wired straight back to the − input, so rule 2 gives V<sub>out</sub> = e<sub>2</sub>.') +
      step('(a) · Divider from node 1 to node 2', D(T`e_2 = e_1\frac{Z_4}{Z_2 + Z_4} \;\Rightarrow\; e_1 = V_{out}\,\frac{Z_2 + Z_4}{Z_4}`), 'No current enters the + input, so Z<sub>2</sub> and Z<sub>4</sub> carry the same current: a plain divider.') +
      step('(a) · KCL at node 1', D(T`\frac{e_1 - V_{in}}{Z_1} + \frac{e_1 - V_{out}}{Z_3} + \frac{e_1 - V_{out}}{Z_2} = 0`), 'Three branches leave node 1: to V<sub>in</sub> through Z<sub>1</sub>, to V<sub>out</sub> through Z<sub>3</sub>, and to node 2 (= V<sub>out</sub>) through Z<sub>2</sub>.') +
      step('(a) · Substitute and tidy', D(T`\boxed{H(\omega) = \frac{V_{out}}{V_{in}} = \frac{Z_3Z_4}{Z_1Z_2 + Z_3(Z_1 + Z_2) + Z_3Z_4}}`), 'Replace e<sub>1</sub>, note e<sub>1</sub> − V<sub>out</sub> = V<sub>out</sub>Z<sub>2</sub>/Z<sub>4</sub>, then multiply through by Z<sub>1</sub>Z<sub>3</sub>Z<sub>4</sub>.') +
      step('(b) · Put in R and C', D(T`Z_1 = R_1,\; Z_2 = R_2,\; Z_3 = \frac{1}{j\omega C_3},\; Z_4 = \frac{1}{j\omega C_4}`) + D(T`\boxed{H(\omega) = \frac{1}{1 - \omega^2R_1R_2C_3C_4 + j\omega C_4(R_1 + R_2)}}`), 'Multiply top and bottom by (jω)²C<sub>3</sub>C<sub>4</sub> = −ω²C<sub>3</sub>C<sub>4</sub>. Check: at ω = 0, H = 1 ✓.') +
      step('(c) · Phase = −90°', D(T`1 - \omega_0^2R_1R_2C_3C_4 = 0 \;\Rightarrow\; f_0 = \frac{1}{2\pi\sqrt{R_1R_2C_3C_4}} = \boxed{${st(a.f0, 'Hz')}}`), 'H = 1/(real + j·imag). Its phase is −90° exactly when the real part vanishes, leaving 1/(j·something).') +
      step('(d) · Evaluate H at the input frequency', (v.k === 1 ? '' : `<p>The input is cos(${U.num(2 * v.k)}πf<sub>0</sub>t), so its frequency is <b>${U.num(v.k)} × f<sub>0</sub></b> = ${U.si(a.fin, 'Hz')}, not f<sub>0</sub>.</p>`) + D(T`H = \frac{1}{${U.num(a.re, 4)} + j${U.num(a.im, 4)}} \;\Rightarrow\; |H| = ${U.num(Z.abs(a.H), 4)}, \quad \angle H = ${st(a.ph, '°')}`) + D(T`\boxed{V_{out}(t) = ${outT(a.Vm, 'cos', v.k === 1 ? '2\\pi f_0t' : U.num(2 * v.k) + '\\pi f_0t', a.ph)}}`), 'Same frequency out as in. Read the argument of the cosine carefully to get that frequency.') +
      (noVals ? flag('This paper gives no component values for parts (c) and (d). The resit (SPR24) gives R<sub>1</sub> = R<sub>2</sub> = 10 kΩ and C<sub>3</sub> = C<sub>4</sub> = 1 nF, used here. In the exam, give the formulas.') : '') +
      (v.k !== 1 && paper === 'SPR24' ? flag('SPR24 writes the input as A cos(πf<sub>0</sub>t), which is half of f<sub>0</sub>. AUT23 used cos(2πf<sub>0</sub>t). This may be a typo, so state the frequency you used. At f<sub>0</sub> itself the answer would be 0.5 cos(2πf<sub>0</sub>t − 90°) V.') : ''),
  });
  sk('aut23-2', 'AUT23', 1, null, true);
  sk('spr24-2', 'SPR24', 0.5, null, false);

  // ---------------------------------------------------------------- OP6: multiple-feedback low-pass, phase 135° (Q2 AUT24 / SPR25)
  const mfb = (id, paper, C) => LK.add({
    id, topic: 'opamp', tags: ['inverting filter', 'H(ω)', 'phase 135°'], src: exam(paper, '2', '50 marks'),
    title: 'Inverting R–R–2R–C filter: H(ω), f<sub>0</sub> for 135°, V<sub>out</sub>(t)',
    params: { A: p(1, 'V', null, 0, pk([1, 2])), R: p(10e3, 'Ω', null, 0, pk([4700, 10e3, 22e3])), C: p(C, 'F', null, 0, pk([1e-9, 2.2e-9, 4e-9, 10e-9])) }, hideParams: ['A'],
    ask: (v) => `(a) Derive H(ω) = V<sub>out</sub>/V<sub>in</sub> in terms of R, C, ω. (b) Derive the frequency f<sub>0</sub> where the phase of H is 135°. (c) Calculate f<sub>0</sub>. (d) Find V<sub>out</sub>(t) when V<sub>in</sub>(t) = A cos(2πf<sub>0</sub>t), A = ${U.given(v.A, 'V')}.`,
    fig: (v) => F.mfb(v) + `<p class="figval">R = <b>${U.given(v.R, 'Ω')}</b>, C = <b>${U.given(v.C, 'F')}</b></p>`,
    calc: (v) => { const f0 = 1 / (3 * Math.PI * v.R * v.C); return { f0, Vm: v.A / Math.SQRT2, ph: 135 }; },
    answers: [{ k: 'f0', label: 'f<sub>0</sub>', unit: 'Hz' }, { k: 'Vm', label: 'Amplitude of V<sub>out</sub>', unit: 'V' }, { k: 'ph', label: 'Phase of V<sub>out</sub>', unit: '°' }],
    hideGiven: true,
    ac: (v) => ({ w: TAU / (3 * Math.PI * v.R * v.C), net: [['V', 'i', '0', v.A], ['R', 'i', '1', v.R], ['R', '1', '2', v.R], ['C', '1', 'o', v.C], ['R', '2', 'o', 2 * v.R], ['OP', '0', '2', 'o']], probe: (s, c) => ({ Vm: c.abs(s.v('o')), ph: c.deg(s.v('o')) }) }),
    hints: ['Node 2 is a virtual ground (V<sub>+</sub> is grounded). Two unknowns: e<sub>1</sub> and V<sub>out</sub>.', 'KCL at node 2 gives e<sub>1</sub> in terms of V<sub>out</sub>. Then KCL at node 1.'],
    sol: (v, a) => step('(a) · Virtual ground at node 2', golden + D(T`e_2 = V_- = V_+ = 0`), 'The + input is grounded, so the − input (node 2) sits at 0 V.') +
      step('(a) · KCL at node 2', D(T`\frac{e_1 - 0}{R} + \frac{V_{out} - 0}{2R} = 0 \;\Rightarrow\; e_1 = -\frac{V_{out}}{2}`), 'No current enters the op-amp. The current arriving from node 1 through R leaves through the 2R feedback resistor.') +
      step('(a) · KCL at node 1', D(T`\frac{e_1 - V_{in}}{R} + \frac{e_1 - 0}{R} + (e_1 - V_{out})\,j\omega C = 0`), 'Three branches leave node 1: R to V<sub>in</sub>, R to node 2 (at 0 V), and C to V<sub>out</sub>.') +
      step('(a) · Substitute e<sub>1</sub> = −V<sub>out</sub>/2', D(T`-\frac{V_{out}}{R} - \frac{V_{in}}{R} - \frac{3}{2}\,j\omega C\,V_{out} = 0`) + D(T`\boxed{H(\omega) = \frac{V_{out}}{V_{in}} = \frac{-1}{1 + j\tfrac32\,\omega RC}}`), 'Collect V<sub>out</sub> terms on one side and multiply through by R.') +
      step('(b) · Phase = 135°', D(T`\angle H = 180^\circ - \tan^{-1}\!\left(\tfrac32\omega RC\right) = 135^\circ \;\Rightarrow\; \tfrac32\,\omega_0RC = 1`) + D(T`\boxed{f_0 = \frac{1}{3\pi RC}}`), 'The −1 on top gives 180°. The denominator takes away tan⁻¹(1.5ωRC). You need it to take away 45°, and tan 45° = 1.') +
      step('(c) · Number', D(T`f_0 = \frac{1}{3\pi\times${gt(v.R, 'Ω')}\times${gt(v.C, 'F')}} = \boxed{${st(a.f0, 'Hz')}}`), 'Plug in.') +
      step('(d) · Output at f<sub>0</sub>', D(T`H(f_0) = \frac{-1}{1 + j} \;\Rightarrow\; |H| = \frac{1}{\sqrt2}, \quad \angle H = 135^\circ`) + D(T`\boxed{V_{out}(t) = ${outT(a.Vm, 'cos', '2\\pi f_0t', 135)}}`), 'At f<sub>0</sub> the denominator is exactly 1 + j, whose size is √2 and angle 45°.') +
      tip('AUT24 used C = 1 nF, SPR25 used C = 4 nF. Only the number in (c) changes.'),
  });
  mfb('aut24-2', 'AUT24', 1e-9);
  mfb('spr25-2', 'SPR25', 4e-9);

  // ---------------------------------------------------------------- OP7: AUT25 Q2 (all R equal, all C equal)
  LK.add({
    id: 'aut25-2', topic: 'opamp', tags: ['non-inverting filter', 'H(ω)', 'two sinusoids'], src: exam('AUT25', '2', '50 marks'),
    title: 'Low-pass divider + non-inverting stage: H(ω) and V<sub>out</sub>(t) for two sinusoids',
    params: { R: p(10e3, 'Ω', null, 0, pk([4700, 10e3, 22e3])), C: p(470e-12, 'F', null, 0, pk([220e-12, 470e-12, 1e-9])), A1: p(5, 'V', null, 0, pk([2, 5])), f1: p(1e3, 'Hz', null, 0, pk([1e3, 2e3])), A2: p(10, 'V', null, 0, pk([5, 10])), f2: p(1e6, 'Hz', null, 0, pk([100e3, 500e3, 1e6])) },
    hideParams: ['A1', 'f1', 'A2', 'f2'],
    lead: (v) => `R<sub>1</sub> = R<sub>2</sub> = R<sub>3</sub> = R<sub>4</sub> = R and C<sub>1</sub> = C<sub>2</sub> = C. V<sub>in</sub>(t) = ${U.num(v.A1)} sin(2π·${U.given(v.f1, 'Hz')}·t) + ${U.num(v.A2)} sin(2π·${U.given(v.f2, 'Hz')}·t) V.`,
    ask: '(a) Derive H(ω) = V<sub>out</sub>/V<sub>in</sub> in terms of R, C, ω. (b) Calculate the steady-state V<sub>out</sub>(t).', form: 'V<sub>out</sub>(t) = [a₁] sin(2πf₁t + [φ₁]) + [a₂] sin(2πf₂t + [φ₂])',
    fig: (v) => F.a25(v),
    calc: (v) => { const x1 = TAU * v.f1 * v.R * v.C, x2 = TAU * v.f2 * v.R * v.C; return { x1, x2, a1: v.A1 / Math.hypot(1, x1), p1: -deg(Math.atan(x1)), a2: v.A2 / Math.hypot(1, x2), p2: -deg(Math.atan(x2)) }; },
    answers: [{ k: 'a1', label: 'a₁ (low-frequency term)', unit: 'V' }, { k: 'p1', label: 'φ₁', unit: '°' }, { k: 'a2', label: 'a₂ (high-frequency term)', unit: 'V' }, { k: 'p2', label: 'φ₂', unit: '°' }],
    chk: (v, a, sim) => { const run = (A, f) => sim.ac([['V', 'i', '0', A], ['R', 'i', 'y', v.R], ['R', 'y', '0', v.R], ['C', 'y', '0', v.C], ['R', 'x', '0', v.R], ['R', 'x', 'o', v.R], ['C', 'x', 'o', v.C], ['OP', 'y', 'x', 'o']], TAU * f).v('o');
      const o1 = run(v.A1, v.f1), o2 = run(v.A2, v.f2); return [['a1', sim.cx.abs(o1), a.a1], ['p1', sim.cx.deg(o1), a.p1], ['a2', sim.cx.abs(o2), a.a2], ['p2', sim.cx.deg(o2), a.p2]]; },
    hints: ['Two blocks: a divider (R<sub>1</sub> on top, R<sub>2</sub> ∥ C<sub>1</sub> below) feeding the + input, then a non-inverting amplifier with R<sub>4</sub> ∥ C<sub>2</sub> as feedback.', 'Call Z = R ∥ 1/(jωC) = R/(1 + jωRC). It appears in both blocks and a factor cancels.', 'For (b) use superposition: treat each sinusoid separately with H at its own frequency.'],
    sol: (v, a) => step('(a) · Name the repeated impedance', D(T`Z = R \parallel \frac{1}{j\omega C} = \frac{R}{1 + j\omega RC}`), 'R<sub>2</sub> ∥ C<sub>1</sub> and R<sub>4</sub> ∥ C<sub>2</sub> are the same thing because all R are equal and both C are equal.') +
      step('(a) · Block 1: divider to the + input', D(T`V_+ = V_{in}\frac{Z}{R + Z} = V_{in}\,\frac{1}{2 + j\omega RC}`), 'R<sub>1</sub> on top, Z underneath. No current flows into the op-amp, so the divider is unloaded. Substitute Z and multiply top and bottom by (1 + jωRC).') +
      step('(a) · Block 2: non-inverting gain', D(T`\frac{V_{out}}{V_+} = 1 + \frac{Z}{R_3} = 1 + \frac{1}{1 + j\omega RC} = \frac{2 + j\omega RC}{1 + j\omega RC}`), 'Feedback impedance Z (R<sub>4</sub> ∥ C<sub>2</sub>) over R<sub>3</sub> to ground, plus 1.') +
      step('(a) · Multiply the blocks', D(T`H(\omega) = \frac{1}{2 + j\omega RC}\cdot\frac{2 + j\omega RC}{1 + j\omega RC} \;\Rightarrow\; \boxed{H(\omega) = \frac{1}{1 + j\omega RC}}`), 'The (2 + jωRC) factors cancel. The whole circuit is a simple first-order low-pass with unity DC gain.') +
      step('(b) · Superposition', D(T`RC = ${gt(v.R, 'Ω')}\times${gt(v.C, 'F')} = ${st(v.R * v.C, 's')}`), 'The circuit is linear, so each sinusoid passes through on its own, scaled and shifted by H at <b>its own</b> frequency.') +
      step(`(b) · The ${U.given(v.f1, 'Hz')} term`, D(T`\omega RC = ${U.num(a.x1, 4)}, \qquad |H| = \frac{1}{\sqrt{1 + ${U.num(a.x1, 4)}^2}} = ${U.num(a.a1 / v.A1, 4)}, \qquad \angle H = -\tan^{-1}(${U.num(a.x1, 4)}) = ${st(a.p1, '°')}`), 'Well below the corner frequency, so it passes almost untouched.') +
      step(`(b) · The ${U.given(v.f2, 'Hz')} term`, D(T`\omega RC = ${U.num(a.x2, 4)}, \qquad |H| = ${U.num(a.a2 / v.A2, 4)}, \qquad \angle H = ${st(a.p2, '°')}`), 'Well above the corner, so it is heavily attenuated and shifted by nearly −90°.') +
      step('(b) · Add the two outputs', D(T`\boxed{V_{out}(t) = ${st(a.a1, 'V')}\sin(2\pi f_1t ${phT(a.p1)}) + ${st(a.a2, 'V')}\sin(2\pi f_2t ${phT(a.p2)})}`), 'Superposition: the output is the sum of the two responses.') +
      tip(`Corner frequency 1/(2πRC) = ${U.si(1 / (TAU * v.R * v.C), 'Hz')}. The filter keeps the slow sine and removes most of the fast one.`),
  });

  // ---------------------------------------------------------------- OP8: passive RLC transfer function (Q2 SPR21)
  const rH = (v, om) => { const n = -om * om * v.L1 * v.C2 * v.R, d = [v.R - 2 * om * om * v.L1 * v.C2 * v.R, om * (v.L1 + v.R * v.R * v.C2)]; return { n, d, H: Z.div([n, 0], d) }; };
  LK.add({
    id: 'spr21-2', topic: 'opamp', tags: ['passive filter', 'H(ω)', 'Bode plot'], src: exam('SPR21', '2', '50 marks'), symset: 'exam',
    title: 'Passive RLC filter: H(ω), gain and phase plot, V<sub>m</sub> and φ',
    params: { R: p(1000, 'Ω', 'ε', 1, pk([470, 1000, 2200])), L1: p(1e-3, 'H', 'η', 1e-6, pk([470e-6, 1e-3, 2.2e-3])), C2: p(1000e-12, 'F', 'θ', 1e-12, pk([470e-12, 1e-9, 2.2e-9])), om: p(1e6, 'rad/s', null, 0, pk([1e6])) },
    hideParams: ['om', 'R'], lead: (v) => `R<sub>s</sub> = R<sub>L</sub> = ${U.given(v.R, 'Ω')}. For part (c), V<sub>s</sub>(t) = sin(10<sup>6</sup>t) and V<sub>out</sub>(t) = V<sub>m</sub> cos(10<sup>6</sup>t + φ).`,
    ask: '(a) Derive H(ω) = V<sub>out</sub>/V<sub>s</sub> in the form (a + jb)/(c + jd). (b) Plot the gain and phase from 10 kHz to 10 MHz. (c) Calculate V<sub>m</sub> and φ.',
    fig: (v) => F.rlc(v),
    calc: (v) => { const h = rH(v, v.om); return { ...h, Vm: Z.abs(h.H), argH: Z.deg(h.H), phi: wrap(Z.deg(h.H) - 90) }; },
    answers: [{ k: 'Vm', label: 'V<sub>m</sub>', unit: 'V' }, { k: 'phi', label: 'φ', unit: '°' }],
    ac: (v) => ({ w: v.om, net: [['V', '1', '0', 1], ['R', '1', '2', v.R], ['C', '2', '3', v.C2], ['L', '3', '0', v.L1], ['R', '3', '0', v.R]], probe: (s, c) => ({ Vm: c.abs(s.v('3')), phi: wrap(c.deg(s.v('3')) - 90) }) }),
    hints: ['Voltage divider: Z<sub>p</sub> = L<sub>1</sub> ∥ R<sub>L</sub> on the bottom, R<sub>s</sub> + 1/(jωC<sub>2</sub>) on top.', 'sin(x) = cos(x − 90°). Convert the input before reading off φ.'],
    sol: (v, a) => { const lf = (f) => rH(v, TAU * f).H;
      return step('(a) · Divider', F.rlc(v, { noval: true, hl: true }) + D(T`H = \frac{Z_p}{R_s + \dfrac{1}{j\omega C_2} + Z_p}, \qquad Z_p = \frac{j\omega L_1R_L}{R_L + j\omega L_1}`), 'L<sub>1</sub> and R<sub>L</sub> are in parallel across the output. R<sub>s</sub> and C<sub>2</sub> are in series above them.') +
        step('(a) · Clear the fractions', D(T`\boxed{H(\omega) = \frac{-\omega^2L_1C_2R_L}{R_L - \omega^2L_1C_2(R_s + R_L) + j\omega(L_1 + R_sR_LC_2)}}`), 'Multiply top and bottom by (R<sub>L</sub> + jωL<sub>1</sub>) and then by jωC<sub>2</sub>. That gives the (a + jb)/(c + jd) form with b = 0.') +
        step('(b) · Sketch the gain and phase',
          S.plot({ w: 340, h: 180, x: [4, 7], y: [-80, 5], curves: [{ f: (lg) => 20 * Math.log10(Z.abs(lf(10 ** lg))) }], xm: [{ x: 4, t: '10 k' }, { x: 5, t: '100 k' }, { x: 6, t: '1 M' }, { x: 7, t: '10 M' }], marks: [{ y: -6.02, t: '−6' }, { y: -40, t: '−40' }], yl: 'Gain (dB)', xl: 'f (Hz, log scale)' }) +
          S.plot({ w: 340, h: 180, x: [4, 7], y: [-10, 190], curves: [{ f: (lg) => { const d = Z.deg(lf(10 ** lg)); return d < -1 ? d + 360 : d; } }], xm: [{ x: 4, t: '10 k' }, { x: 5, t: '100 k' }, { x: 6, t: '1 M' }, { x: 7, t: '10 M' }], marks: [{ y: 180, t: '180°' }, { y: 90, t: '90°' }], yl: 'Phase', xl: 'f (Hz, log scale)' }),
          'It is a second-order <b>high-pass</b>. Low f: the capacitor blocks and the inductor shorts the output, so the gain rises at 40 dB/decade with phase near 180°. High f: C is a short and L is open, so H → R<sub>L</sub>/(R<sub>s</sub> + R<sub>L</sub>) = ½ (−6 dB) with phase 0°.') +
        step('(c) · Numbers at ω = 10⁶ rad/s', D(T`\omega^2L_1C_2 = ${U.num(v.om * v.om * v.L1 * v.C2, 4)}`) + D(T`H = \frac{${U.num(a.n, 4)}}{${U.num(a.d[0], 4)} + j${U.num(a.d[1], 4)}} = ${cT(a.H, 4)}`) + D(T`|H| = ${U.num(a.Vm, 4)}, \qquad \angle H = ${st(a.argH, '°')}`), 'Plug ω into each piece, then divide.') +
        step('(c) · Convert sin to cos', D(T`V_s = \sin(10^6t) = \cos(10^6t - 90^\circ)`) + D(T`V_{out} = |H|\cos(10^6t - 90^\circ + \angle H) \;\Rightarrow\; V_m = \boxed{${st(a.Vm, 'V')}}, \quad \varphi = ${U.num(a.argH, 4)}^\circ - 90^\circ = \boxed{${st(a.phi, '°')}}`), 'The answer is requested as a cosine but the input is a sine. A sine is a cosine delayed by 90°.') +
        trap('Reporting φ = ∠H. The sin → cos change costs 90°.'); },
  });
  LK.F5 = F;
})(typeof window !== 'undefined' ? window : globalThis);
