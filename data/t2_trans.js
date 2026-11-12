// TOPIC 2 — First-order transients (RL and RC): every past-paper part
(function (G) {
  const { S, U, B, LK } = G;
  const { D, I, step, trap, tip, flag, par, w, p, rR, pk, T, st, gt } = B;
  const val = (x, v, k, u) => (x && x.noval ? '' : U.given(v[k], u));
  const rV = (lo, hi) => () => U.R.volt(lo, hi, 0.5);
  const exam = (paper, q, marks = '20%') => ({ type: 'exam', paper, q, label: `${paper} · Q${q}`, marks });
  const E = Math.exp;
  // the one formula step used everywhere
  const master = D(T`x(t) = x_\infty + (x_0 - x_\infty)\,e^{-(t-t_0)/\tau}`);

  // ---------------------------------------------------------------- figures
  const F = {};
  F.rlsw = (v, x = {}) => w(
    S.V([40, 60], [40, 180], { lab: 'V1', side: 'left', val: val(x, v, 'V1', 'V') }) +
    S.SW([40, 60], [140, 60], { lab: 'SW', closed: x.closed }) +
    S.L([140, 60], [260, 60], { lab: 'L3', val: val(x, v, 'L3', 'H'), hl: x.hlL }) +
    S.R([260, 60], [260, 180], { lab: 'R4', val: val(x, v, 'R4', 'Ω') }) +
    S.wire([[40, 180], [260, 180]]) + S.gnd([260, 180]) + S.dot([140, 60]) + S.dot([260, 60]) +
    S.flag([40, 60], '1', 'up') + S.flag([140, 60], '2', 'up') + S.flag([260, 60], '3', 'up') +
    S.arrow([260, 92], 'd', 'i<tspan class="ssub" dy="4">4</tspan>', { tx: 246, anchor: 'end' }), 340, 225);
  F.rlpar = (v, x = {}) => w(
    S.V([40, 60], [40, 180], { lab: 'V1', side: 'left', val: val(x, v, 'V1', 'V') }) +
    S.SW([40, 60], [120, 60], { lab: 'SW', closed: x.closed }) +
    S.R([120, 60], [230, 60], { lab: 'R2', val: val(x, v, 'R2', 'Ω') }) +
    S.R([230, 60], [230, 180], { lab: 'R3', side: 'left', val: val(x, v, 'R3', 'Ω') }) +
    S.wire([[230, 60], [310, 60]]) + S.L([310, 60], [310, 180], { lab: 'L4', val: val(x, v, 'L4', 'H'), hl: x.hlL }) +
    S.wire([[40, 180], [310, 180]]) + S.gnd([230, 180]) + S.dot([230, 60]) + S.dot([120, 60]) +
    S.flag([40, 60], '1', 'up') + S.flag([120, 60], '2', 'up') + S.flag([230, 60], '3', 'up'), 390, 225);
  F.rc = (v, x = {}) => w(
    S.Vsq([40, 60], [40, 180], { lab: 'V1', side: 'left' }) +
    S.R([40, 60], [190, 60], { lab: 'R2', val: val(x, v, 'R2', 'Ω') }) +
    S.C([190, 60], [190, 180], { lab: 'C3', val: val(x, v, 'C3', 'F'), hl: x.hlC }) +
    S.wire([[40, 180], [190, 180]]) + S.gnd([190, 180]) + S.dot([190, 60]) +
    S.flag([40, 60], '1', 'up') + S.flag([190, 60], '2', 'up'), 280, 225);
  F.rlstep = (v, x = {}) => w(
    S.Vsq([40, 60], [40, 180], { lab: 'V1', side: 'left' }) +
    S.R([40, 60], [150, 60], { lab: 'R2', val: val(x, v, 'R2', 'Ω') }) +
    S.L([150, 60], [270, 60], { lab: 'L3', val: val(x, v, 'L3', 'H'), hl: x.hlL }) +
    S.R([270, 60], [270, 180], { lab: 'R4', val: val(x, v, 'R4', 'Ω') }) +
    S.wire([[40, 180], [270, 180]]) + S.gnd([150, 180]) + S.dot([150, 60]) + S.dot([270, 60]) +
    S.flag([40, 60], '1', 'up') + S.flag([150, 60], '2', 'up') + S.flag([270, 60], '3', 'up'), 350, 225);
  F.pulse = (v, x = {}) => w(
    S.Vsq([40, 60], [40, 210], { lab: 'V1', side: 'left' }) +
    S.R([40, 60], [200, 60], { lab: 'R1', val: val(x, v, 'R1', 'Ω') }) +
    S.R([200, 60], [200, 130], { lab: 'R2', val: val(x, v, 'R2', 'Ω') }) +
    S.L([200, 130], [200, 210], { lab: 'L', val: val(x, v, 'L', 'H'), hl: x.hlL }) +
    S.wire([[40, 210], [200, 210]]) + S.gnd([120, 210]) + S.dot([200, 60]) +
    S.flag([40, 60], '1', 'up') + S.flag([200, 60], '2', 'up') +
    S.arrow([200, 122], 'd', 'I', { tx: 186, anchor: 'end' }), 290, 255);
  F.rcsq = (v, x = {}) => w(
    S.Vsq([40, 60], [40, 180], { lab: 'Vs', side: 'left' }) +
    S.R([40, 60], [190, 60], { lab: 'R', val: val(x, v, 'R', 'Ω') }) +
    S.C([190, 60], [190, 180], { lab: 'C', side: 'left', val: val(x, v, 'C', 'F') }) +
    S.wire([[40, 180], [190, 180]]) + S.dot([190, 60]) + S.dot([190, 180]) +
    S.vmark([225, 75], [225, 165], 'V<tspan class="ssub" dy="4">c</tspan>', { dx: 4 }), 280, 220);
  // a small "x0 -> x_inf" exponential sketch
  const expPlot = (x0, xinf, tau, tq, lab) => {
    const lo = Math.min(x0, xinf), hi = Math.max(x0, xinf), pad = (hi - lo) * 0.15 || 1;
    const fx = (t) => xinf + (x0 - xinf) * E(-t / tau);
    return S.plot({ x: [0, Math.max(5 * tau, tq * 1.3)], y: [Math.min(0, lo - pad), hi + pad], curves: [{ f: fx }],
      marks: [{ y: xinf, t: 'final' }, { y: x0, t: 'start' }], xm: [{ x: tau, t: 'τ' }, { x: tq, t: 't' }], yl: lab, xl: 'time after the switch' });
  };

  // ---------------------------------------------------------------- TR1: switch closes on series RL
  const rlsw = (id, paper, vals, variant) => LK.add({
    id, topic: 'trans', tags: ['RL', 'switch'], src: exam(paper, '1(c)'), symset: 'exam',
    title: variant === 'i4' ? 'Switch closes on a series RL → current' : 'Switch closes on a series RL → voltage on R',
    params: { V1: p(1, 'V', 'ε', 1e-3, rV(1, 9)), L3: p(vals.L, 'H', 'η', 1e-6, pk([1e-3, 2.2e-3, 3.3e-3, 4.7e-3, 6.8e-3])), R4: p(4000, 'Ω', 'θ', 1, rR()), t: p(vals.t, 's', null, 0, pk([0.5e-6, 1e-6, 2e-6, 3e-6])) },
    lead: () => 'The switch is open before t = 0 and closes at t = 0. e<sub>3</sub> = 0 V at t = 0.',
    ask: variant === 'i4' ? 'Calculate the current i<sub>4</sub> at time t.' : 'Calculate the voltage e<sub>3</sub> at time t.',
    fig: (v) => F.rlsw(v),
    calc: (v) => { const tau = v.L3 / v.R4, i = v.V1 / v.R4 * (1 - E(-v.t / tau)); return { tau, i4: i, e3: i * v.R4 }; },
    answers: variant === 'i4' ? [{ k: 'i4', label: 'i<sub>4</sub>(t)', unit: 'A' }] : [{ k: 'e3', label: 'e<sub>3</sub>(t)', unit: 'V' }],
    tran: (v) => ({ net: [['V', '1', '0', v.V1], ['SW', '1', '2', 0], ['L', '2', '3', v.L3], ['R', '3', '0', v.R4]], t0: -v.t * 0.2, t1: v.t,
      probe: (r) => ({ e3: r.end('3'), i4: r.end('3') / v.R4 }) }),
    hints: ['An inductor\'s current cannot jump. What is i<sub>4</sub> just after the switch closes?', 'After a long time the inductor is just a wire. τ = L/R.'],
    sol: (v, a) => step('1 · Start value', D(T`i_4(0) = 0`), 'Inductor current cannot change instantly, and it was zero before the switch closed.') +
      step('2 · Final value', F.rlsw(v, { closed: true, noval: true, hlL: true }) + D(T`i_4(\infty) = \frac{V_1}{R_4} = \frac{${gt(v.V1, 'V')}}{${v.R4}\,\Omega} = ${st(v.V1 / v.R4, 'A')}`), 'At DC a settled inductor has no voltage across it, so it acts like a wire.') +
      step('3 · Time constant', D(T`\tau = \frac{L_3}{R_4} = \frac{${gt(v.L3, 'H')}}{${v.R4}\,\Omega} = ${st(a.tau, 's')}`), 'τ sets how fast it settles. For RL it is L over the resistance the inductor sees.') +
      step('4 · Plug into the first-order formula', master + D(T`i_4(t) = \frac{V_1}{R_4}\left(1 - e^{-t/\tau}\right) = ${st(v.V1 / v.R4, 'A')}\left(1 - e^{-${U.num(v.t / a.tau, 4)}}\right) = ${variant === 'i4' ? T`\boxed{${st(a.i4, 'A')}}` : st(a.i4, 'A')}`) + expPlot(0, v.V1 / v.R4 * 1e3, a.tau, v.t, 'i4 (mA)'), 'Every first-order circuit moves from its start value to its final value along one exponential.') +
      (variant === 'e3' ? step('5 · Voltage at node 3', D(T`e_3 = i_4R_4 = \boxed{${st(a.e3, 'V')}}`), 'Node 3 is the top of R<sub>4</sub>, so Ohm\'s law gives its voltage.') : '') +
      tip('Check: t/τ = ' + U.num(v.t / a.tau, 3) + '. After 1τ you are 63% of the way, after 5τ you are done.'),
  });
  rlsw('aut21-1c', 'AUT21', { L: 3e-3, t: 1e-6 }, 'i4');
  rlsw('spr22-1c', 'SPR22', { L: 6e-3, t: 3e-6 }, 'e3');

  // ---------------------------------------------------------------- TR2: R in series, R parallel with L
  LK.add({
    id: 'spr21-1c', topic: 'trans', tags: ['RL', 'Thévenin'], src: exam('SPR21', '1(c)'), symset: 'exam',
    title: 'Switch closes, inductor in parallel with a resistor',
    params: { V1: p(1, 'V', 'ε', 1e-3, rV(1, 9)), R2: p(2000, 'Ω', 'η', 1, rR()), R3: p(3000, 'Ω', 'θ', 1, rR()), L4: p(4e-3, 'H', 'λ', 1e-6, pk([1e-3, 2.2e-3, 4.7e-3, 6.8e-3])), t: p(5e-6, 's', null, 0, pk([1e-6, 2e-6, 5e-6])) },
    lead: () => 'The switch closes at t = 0. I(L<sub>4</sub>) = 0 just before it closes.',
    ask: 'Calculate the current I(L<sub>4</sub>) from node 3 to ground at time t.',
    fig: (v) => F.rlpar(v),
    calc: (v) => { const Rth = par(v.R2, v.R3), tau = v.L4 / Rth, Iinf = v.V1 / v.R2; return { Rth, tau, Iinf, IL: Iinf * (1 - E(-v.t / tau)) }; },
    answers: [{ k: 'IL', label: 'I(L<sub>4</sub>)(t)', unit: 'A' }],
    tran: (v) => ({ net: [['V', '1', '0', v.V1], ['SW', '1', '2', 0], ['R', '2', '3', v.R2], ['R', '3', '0', v.R3], ['L', '3', '0', v.L4]], t0: -v.t * 0.2, t1: v.t,
      probe: (r) => ({ IL: r.iEnd(4) }) }),
    hints: ['Final value: the settled inductor is a wire across R<sub>3</sub>. Where does all the current go?', 'For τ, kill V<sub>1</sub> (short it) and find the resistance the inductor sees.'],
    sol: (v, a) => step('1 · Start value', D(T`I_{L}(0) = 0`), 'Inductor current cannot jump.') +
      step('2 · Final value', D(T`I_L(\infty) = \frac{V_1}{R_2} = \frac{${gt(v.V1, 'V')}}{${v.R2}\,\Omega} = ${st(a.Iinf, 'A')}`), 'When settled, the inductor is a wire across R<sub>3</sub>. It shorts R<sub>3</sub> out, so all of the current through R<sub>2</sub> goes through the inductor.') +
      step('3 · Resistance the inductor sees', F.rlpar(v, { closed: true, noval: true, hlL: true }) + D(T`R_{th} = R_2\parallel R_3 = \frac{${v.R2}\times${v.R3}}{${v.R2}+${v.R3}} = ${st(a.Rth, 'Ω')}`), 'Short V<sub>1</sub>. Looking out from the inductor, R<sub>2</sub> and R<sub>3</sub> both run from node 3 to ground, so they are in parallel.') +
      step('4 · Time constant', D(T`\tau = \frac{L_4}{R_{th}} = \frac{${gt(v.L4, 'H')}}{${st(a.Rth, 'Ω')}} = ${st(a.tau, 's')}`), 'τ = L / (Thévenin resistance seen by the inductor).') +
      step('5 · Plug in', master + D(T`I_L(t) = ${st(a.Iinf, 'A')}\left(1 - e^{-${U.num(v.t / a.tau, 4)}}\right) = \boxed{${st(a.IL, 'A')}}`), 'Start 0, final V<sub>1</sub>/R<sub>2</sub>, one exponential between them.') +
      trap('Using τ = L/R<sub>2</sub> or L/(R<sub>2</sub>+R<sub>3</sub>). The inductor sees R<sub>2</sub>∥R<sub>3</sub>.'),
  });

  // ---------------------------------------------------------------- TR3: RC step
  const rcstep = (id, paper, vals) => LK.add({
    id, topic: 'trans', tags: ['RC', 'step'], src: exam(paper, '1(c)'),
    title: vals.Vf > vals.Vi ? 'RC step up → capacitor voltage' : 'RC step down → capacitor voltage',
    params: { Vi: p(vals.Vi, 'V', null, 0, pk([0, 1, 2, 3])), Vf: p(vals.Vf, 'V', null, 0, pk([0, 2, 4, 5])), R2: p(vals.R, 'Ω', null, 0, rR()), C3: p(vals.C, 'F', null, 0, pk([220e-9, 470e-9, 560e-9, 1e-6])), t0: p(1e-3, 's', null, 0, pk([1e-3])), t: p(vals.t, 's', null, 0, pk([1.5e-3, 2e-3])) },
    hideParams: ['Vi', 'Vf', 't0', 't'],
    lead: (v) => `V<sub>1</sub> has been at ${U.given(v.Vi, 'V')} for a long time (the capacitor is fully charged). At t = ${U.given(v.t0, 's')}, V<sub>1</sub> switches instantly to ${U.given(v.Vf, 'V')} and stays there.`,
    ask: (v) => `Calculate the voltage e<sub>2</sub> at node 2 at time t = ${U.given(v.t, 's')}.`,
    fig: (v) => F.rc(v),
    calc: (v) => { const tau = v.R2 * v.C3; return { tau, e2: v.Vf + (v.Vi - v.Vf) * E(-(v.t - v.t0) / tau) }; },
    answers: [{ k: 'e2', label: 'e<sub>2</sub>(t)', unit: 'V' }],
    tran: (v) => ({ net: [['V', '1', '0', (t) => (t < v.t0 ? v.Vi : v.Vf)], ['R', '1', '2', v.R2], ['C', '2', '0', v.C3]], t0: v.t0 - 12 * v.R2 * v.C3, t1: v.t, probe: (r) => ({ e2: r.end('2') }) }),
    hints: ['Capacitor voltage cannot jump: e<sub>2</sub> just after the switch equals e<sub>2</sub> just before.', 'Time is measured from the switching instant: use (t − t<sub>0</sub>).'],
    sol: (v, a) => step('1 · Start value', D(T`e_2(t_0) = ${gt(v.Vi, 'V')}`), 'Before the switch the capacitor was fully charged to V<sub>1</sub> (no current, so no drop on R<sub>2</sub>). Capacitor voltage cannot jump.') +
      step('2 · Final value', D(T`e_2(\infty) = ${gt(v.Vf, 'V')}`), 'Given enough time the capacitor charges to the new source voltage.') +
      step('3 · Time constant', D(T`\tau = R_2C_3 = ${v.R2}\,\Omega\times${gt(v.C3, 'F')} = ${st(a.tau, 's')}`), 'For RC, τ = R × C, with R the resistance the capacitor sees.') +
      step('4 · Time since the switch', D(T`t - t_0 = ${gt(v.t, 's')} - ${gt(v.t0, 's')} = ${st(v.t - v.t0, 's')}`), 'The exponential starts at the switching instant, not at t = 0.') +
      step('5 · Plug in', master + D(T`e_2 = ${U.num(v.Vf)} + (${U.num(v.Vi)} - ${U.num(v.Vf)})\,e^{-${U.num((v.t - v.t0) / a.tau, 4)}} = \boxed{${st(a.e2, 'V')}}`) + expPlot(v.Vi, v.Vf, a.tau, v.t - v.t0, 'e2 (V)'), 'Start value, final value and τ are all you need.') +
      trap('Putting t = ' + U.given(v.t, 's') + ' straight into the exponential. The clock starts at t<sub>0</sub> = ' + U.given(v.t0, 's') + '.') +
      (paper ? flag('The paper says "C1 is fully charged" but the capacitor in the figure is C<sub>3</sub>. It is a typo.') : ''),
  });
  rcstep('aut22-1c', 'AUT22', { Vi: 1, Vf: 2, R: 2200, C: 470e-9, t: 2e-3 });
  rcstep('spr23-1c', 'SPR23', { Vi: 1, Vf: 0, R: 1800, C: 560e-9, t: 1.5e-3 });

  // ---------------------------------------------------------------- TR4: series R-L-R step
  const rlstep = (id, paper, vals, variant) => LK.add({
    id, topic: 'trans', tags: ['RL', 'step'], src: exam(paper, '1(c)'),
    title: variant === 'e3' ? 'RL step from a non-zero start → node voltage' : 'RL step from zero → resistor current',
    params: { Vi: p(vals.Vi, 'V', null, 0, pk([0, 1, 1.5])), Vf: p(2, 'V', null, 0, pk([2, 3, 5])), R2: p(1000, 'Ω', null, 0, rR()), L3: p(100e-3, 'H', null, 0, pk([47e-3, 100e-3, 220e-3])), R4: p(vals.R4, 'Ω', null, 0, rR()), t0: p(100e-6, 's', null, 0, pk([100e-6])), t: p(150e-6, 's', null, 0, pk([150e-6, 200e-6, 250e-6])) },
    hideParams: ['Vi', 'Vf', 't0', 't'],
    lead: (v) => `V<sub>1</sub> has been at ${U.given(v.Vi, 'V')} for a long time. At t = ${U.given(v.t0, 's')}, V<sub>1</sub> switches instantly to ${U.given(v.Vf, 'V')} and stays there.`,
    ask: (v) => (variant === 'e3' ? `Calculate the voltage e<sub>3</sub> at node 3 at time t = ${U.given(v.t, 's')}.` : `Calculate the current from node 3 to ground through R<sub>4</sub> at time t = ${U.given(v.t, 's')}.`),
    fig: (v) => F.rlstep(v),
    calc: (v) => { const Rs = v.R2 + v.R4, tau = v.L3 / Rs, Ii = v.Vi / Rs, If = v.Vf / Rs, i = If + (Ii - If) * E(-(v.t - v.t0) / tau); return { tau, Ii, If, i, e3: i * v.R4 }; },
    answers: variant === 'e3' ? [{ k: 'e3', label: 'e<sub>3</sub>(t)', unit: 'V' }] : [{ k: 'i', label: 'I(R<sub>4</sub>)(t)', unit: 'A' }],
    tran: (v) => ({ net: [['V', '1', '0', (t) => (t < v.t0 ? v.Vi : v.Vf)], ['R', '1', '2', v.R2], ['L', '2', '3', v.L3], ['R', '3', '0', v.R4]], t0: v.t0 - 12 * v.L3 / (v.R2 + v.R4), t1: v.t, probe: (r) => ({ e3: r.end('3'), i: r.end('3') / v.R4 }) }),
    hints: ['Everything is in series, so one current. Find it before the step and long after.', 'τ = L / (R<sub>2</sub> + R<sub>4</sub>).'],
    sol: (v, a) => step('1 · Current before the step', D(T`i(t_0) = \frac{${U.num(v.Vi)}\,\mathrm{V}}{R_2 + R_4} = \frac{${U.num(v.Vi)}}{${v.R2}+${v.R4}} = ${st(a.Ii, 'A')}`), 'V<sub>1</sub> was steady for a long time, so the inductor is a wire and the current is V/(R<sub>2</sub>+R<sub>4</sub>). Inductor current cannot jump, so this is also the start value.') +
      step('2 · Final current', D(T`i(\infty) = \frac{${U.num(v.Vf)}\,\mathrm{V}}{${v.R2}+${v.R4}} = ${st(a.If, 'A')}`), 'Same idea with the new source voltage.') +
      step('3 · Time constant', D(T`\tau = \frac{L_3}{R_2+R_4} = \frac{${gt(v.L3, 'H')}}{${v.R2 + v.R4}\,\Omega} = ${st(a.tau, 's')}`), 'Short V<sub>1</sub>: the inductor sees R<sub>2</sub> and R<sub>4</sub> in series.') +
      step('4 · Plug in', master + D(T`i = ${st(a.If, 'A')} + (${st(a.Ii, 'A')} - ${st(a.If, 'A')})\,e^{-${U.num((v.t - v.t0) / a.tau, 4)}} = ${variant === 'i' ? T`\boxed{${st(a.i, 'A')}}` : st(a.i, 'A')}`), 'Time since the step is t − t<sub>0</sub> = ' + U.si(v.t - v.t0, 's') + '.') +
      (variant === 'e3' ? step('5 · Node voltage', D(T`e_3 = i\,R_4 = ${st(a.i, 'A')}\times${v.R4}\,\Omega = \boxed{${st(a.e3, 'V')}}`), 'e<sub>3</sub> is the voltage across R<sub>4</sub>.') : '') +
      tip('AUT23 asked for e<sub>3</sub> starting from 1 V. SPR24 asked for the current starting from 0 V. Same circuit, same method.'),
  });
  rlstep('aut23-1c', 'AUT23', { Vi: 1, R4: 1200 }, 'e3');
  rlstep('spr24-1c', 'SPR24', { Vi: 0, R4: 1500 }, 'i');

  // ---------------------------------------------------------------- TR5: pulse into RL
  const pulse = (id, paper, vals, variant) => LK.add({
    id, topic: 'trans', tags: ['RL', 'pulse'], src: exam(paper, '1(b)'),
    title: variant === 'I' ? 'Voltage pulse into RL → inductor current' : 'Voltage pulse into RL → node voltage (sign trap)',
    params: { Vp: p(vals.Vp, 'V', null, 0, pk([2, 3, 5, 10])), tp: p(vals.tp, 's', null, 0, pk([50e-6, 100e-6])), R1: p(1200, 'Ω', null, 0, rR()), R2: p(15, 'Ω', null, 0, pk([10, 15, 22, 47])), L: p(100e-3, 'H', null, 0, pk([47e-3, 100e-3, 220e-3])), t: p(vals.t, 's', null, 0, pk([150e-6, 200e-6])) },
    hideParams: ['Vp', 'tp', 't'],
    lead: (v) => `V<sub>1</sub> has been at 0 V for a long time. At t = 0 it steps up to ${U.given(v.Vp, 'V')}, stays there for ${U.given(v.tp, 's')}, then steps back to 0 V and stays there.`,
    ask: (v) => (variant === 'I' ? `Calculate the inductor current I at time t = ${U.given(v.t, 's')}.` : `Calculate the voltage e<sub>2</sub> at node 2 at time t = ${U.given(v.t, 's')}.`),
    fig: (v) => F.pulse(v),
    calc: (v) => { const Rs = v.R1 + v.R2, tau = v.L / Rs, Iinf = v.Vp / Rs, Ip = Iinf * (1 - E(-v.tp / tau)), I = Ip * E(-(v.t - v.tp) / tau); return { tau, Iinf, Ip, I, e2: -I * v.R1 }; },
    answers: variant === 'I' ? [{ k: 'I', label: 'I(t)', unit: 'A' }] : [{ k: 'e2', label: 'e<sub>2</sub>(t)', unit: 'V' }],
    tran: (v) => ({ net: [['V', '1', '0', (t) => (t >= 0 && t < v.tp ? v.Vp : 0)], ['R', '1', '2', v.R1], ['R', '2', 'x', v.R2], ['L', 'x', '0', v.L]], t0: -v.tp * 0.1, t1: v.t, steps: 40000, tol: 1.5e-2, probe: (r) => ({ I: r.iEnd(3), e2: r.end('2') }) }),
    hints: ['Split it into two transients: charging for the pulse, then discharging afterwards.', 'The end value of the first stage is the start value of the second.'],
    sol: (v, a) => step('1 · Time constant', D(T`\tau = \frac{L}{R_1+R_2} = \frac{${gt(v.L, 'H')}}{${v.R1 + v.R2}\,\Omega} = ${st(a.tau, 's')}`), 'R<sub>1</sub>, R<sub>2</sub> and L are in series. The same τ applies while the pulse is on and after it ends.') +
      step('2 · Stage 1: pulse on (0 → ' + U.si(v.tp, 's') + ')', D(T`I_\infty = \frac{V_1}{R_1+R_2} = \frac{${U.num(v.Vp)}}{${v.R1 + v.R2}} = ${st(a.Iinf, 'A')}`) + D(T`I(t_p) = I_\infty\left(1 - e^{-t_p/\tau}\right) = ${st(a.Iinf, 'A')}\left(1 - e^{-${U.num(v.tp / a.tau, 4)}}\right) = ${st(a.Ip, 'A')}`), 'I starts at 0 and heads for V/(R<sub>1</sub>+R<sub>2</sub>). The pulse ends before it gets there.') +
      step('3 · Stage 2: pulse off', D(T`I(t) = I(t_p)\,e^{-(t-t_p)/\tau} = ${st(a.Ip, 'A')}\times e^{-${U.num((v.t - v.tp) / a.tau, 4)}} = ${variant === 'I' ? T`\boxed{${st(a.I, 'A')}}` : st(a.I, 'A')}`) +
        S.plot({ x: [0, v.t * 1.6], y: [0, a.Iinf * 1e3], curves: [{ f: (t) => (t < v.tp ? a.Iinf * (1 - E(-t / a.tau)) : a.Ip * E(-(t - v.tp) / a.tau)) * 1e3 }], xm: [{ x: v.tp, t: 'pulse ends' }, { x: v.t, t: 't' }], yl: 'I (mA)', marks: [{ y: a.Iinf * 1e3, t: 'I∞' }] }), 'The source is now 0 V (a short). The current cannot jump, so it starts from I(t<sub>p</sub>) and decays towards 0.') +
      (variant === 'e2' ? step('4 · Node 2', D(T`e_2 = V_1 - I R_1 = 0 - ${st(a.I, 'A')}\times${v.R1}\,\Omega = \boxed{${st(a.e2, 'V')}}`), 'KVL from ground up through V<sub>1</sub> and across R<sub>1</sub>. V<sub>1</sub> is now 0 but the inductor keeps the current flowing, so node 2 goes <b>negative</b>.') + trap('Writing a positive answer. After the pulse, the inductor is the source and node 2 sits below ground.') : '') +
      tip('AUT24 asked for I. SPR25 used the same circuit and asked for e<sub>2</sub>.'),
  });
  pulse('aut24-1b', 'AUT24', { Vp: 5, tp: 100e-6, t: 200e-6 }, 'I');
  pulse('spr25-1b', 'SPR25', { Vp: 2, tp: 50e-6, t: 100e-6 }, 'e2');

  // ---------------------------------------------------------------- TR6: square wave into RC (Q3, 50 marks)
  const sq = (v) => { const Tp = 1 / v.f, tau = v.R * v.C, x = E(-Tp / (2 * tau)); return { T: Tp, tau, x, Vmax: v.Vl + (v.Vh - v.Vl) / (1 + x), Vmin: v.Vl + (v.Vh - v.Vl) * x / (1 + x) }; };
  const sqPlot = (v, a) => S.plot({ w: 340, h: 200, x: [0, 2 * a.T], y: [Math.min(0, v.Vl), v.Vh * 1.08],
    curves: [{ f: (t) => ((t % a.T) < a.T / 2 ? v.Vl : v.Vh), c: 'var(--muted)', dash: 1, w: 1.4, n: 400 },
      { f: (t) => { const u = t % a.T; return u < a.T / 2 ? v.Vl + (a.Vmax - v.Vl) * E(-u / a.tau) : v.Vh + (a.Vmin - v.Vh) * E(-(u - a.T / 2) / a.tau); }, n: 400 }],
    marks: [{ y: a.Vmax, t: U.num(a.Vmax) }, { y: a.Vmin, t: U.num(a.Vmin) }], xm: [{ x: a.T / 2, t: 'T/2' }, { x: a.T, t: 'T' }, { x: 2 * a.T, t: '2T' }], yl: 'Vc (V)   - - Vs' });
  LK.sqPlot = sqPlot; LK.sqCalc = sq;
  LK.add({
    id: 'aut25-3', topic: 'trans', tags: ['RC', 'square wave', 'steady state'], src: exam('AUT25', '3', '50 marks'),
    title: 'Square wave into RC: steady-state max and min',
    params: { Vl: p(0, 'V', null, 0, pk([0, 0, 1, 2])), Vh: p(8, 'V', null, 0, pk([5, 6, 8, 10, 12])), f: p(5000, 'Hz', null, 0, pk([1e3, 2e3, 5e3, 10e3])), R: p(10e3, 'Ω', null, 0, pk([4700, 10e3, 22e3])), C: p(22e-9, 'F', null, 0, pk([10e-9, 22e-9, 47e-9])) },
    hideParams: ['Vl', 'Vh', 'f'],
    lead: (v) => `V<sub>s</sub> is a square wave between ${U.given(v.Vl, 'V')} (low) and ${U.given(v.Vh, 'V')} (high), frequency ${U.given(v.f, 'Hz')}, 50% duty cycle (low for the first half of each cycle, high for the second half).`,
    ask: 'After the initial transient has passed: (a) sketch V<sub>c</sub>(t), (b) find its period, (c) its maximum and (d) its minimum.',
    fig: (v) => F.rcsq(v),
    calc: sq,
    answers: [{ k: 'T', label: 'Period', unit: 's' }, { k: 'Vmax', label: 'V<sub>c,max</sub>', unit: 'V' }, { k: 'Vmin', label: 'V<sub>c,min</sub>', unit: 'V' }],
    tran: (v) => ({ net: [['V', '1', '0', (t) => (((t * v.f) % 1 + 1) % 1 < 0.5 ? v.Vl : v.Vh)], ['R', '1', '2', v.R], ['C', '2', '0', v.C]], t0: 0, t1: Math.ceil(12 * v.R * v.C * v.f + 2) / v.f, steps: 40000,
      probe: (r) => ({ Vmax: r.max('2', r.t1 - 1 / v.f, r.t1), Vmin: r.min('2', r.t1 - 1 / v.f, r.t1) }) }),
    hints: ['Steady state means the waveform repeats: where it ends one half-cycle is where it starts the next.', 'Write one exponential for the rising half and one for the falling half. Two equations, two unknowns (V<sub>max</sub>, V<sub>min</sub>).'],
    sol: (v, a) => step('(b) · Period', D(T`T = \frac{1}{f} = \frac{1}{${gt(v.f, 'Hz')}} = \boxed{${st(a.T, 's')}}`), 'A linear circuit driven by a periodic source settles to a waveform with the <b>same period</b> as the source.') +
      step('Time constant vs half period', D(T`\tau = RC = ${gt(v.R, 'Ω')}\times${gt(v.C, 'F')} = ${st(a.tau, 's')}, \qquad \frac{T}{2} = ${st(a.T / 2, 's')}`) + D(T`x = e^{-(T/2)/\tau} = e^{-${U.num(a.T / 2 / a.tau, 4)}} = ${U.num(a.x, 4)}`), 'T/2 is not much bigger than τ, so the capacitor never finishes charging or discharging. x is the fraction of the gap that is <b>left</b> after one half-cycle.') +
      step('Rising half (source high)', D(T`V_{max} = V_h - (V_h - V_{min})\,x`), 'Start at V<sub>min</sub>, head for V<sub>h</sub>. After T/2 the remaining gap has shrunk by the factor x.') +
      step('Falling half (source low)', D(T`V_{min} = V_l + (V_{max} - V_l)\,x`), 'Start at V<sub>max</sub>, head for V<sub>l</sub>. Same shrink factor.') +
      step('(c), (d) · Solve the pair', D(T`V_{max} = V_l + \frac{V_h - V_l}{1+x} = ${U.num(v.Vl)} + \frac{${U.num(v.Vh - v.Vl)}}{1+${U.num(a.x, 4)}} = \boxed{${st(a.Vmax, 'V')}}`) + D(T`V_{min} = V_l + \frac{(V_h - V_l)\,x}{1+x} = \boxed{${st(a.Vmin, 'V')}}`), 'Substitute one equation into the other. The answers are symmetric about the middle of the square wave.') +
      step('(a) · Sketch', sqPlot(v, a), 'Low first half: V<sub>c</sub> decays from V<sub>max</sub> to V<sub>min</sub>. High second half: it rises back to V<sub>max</sub>. Label both levels, T/2 and T.') +
      tip('Check: V<sub>max</sub> + V<sub>min</sub> = V<sub>h</sub> + V<sub>l</sub> = ' + U.num(v.Vh + v.Vl) + ' V. The average of V<sub>c</sub> equals the average of the square wave.'),
  });

  LK.F2 = F; LK.expPlot = expPlot;
})(typeof window !== 'undefined' ? window : globalThis);
