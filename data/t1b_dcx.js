// TOPIC 1 (continued) — DC circuits with controlled sources: Thévenin resistance and the gm amplifier
(function (G) {
  const { S, U, B, LK } = G;
  const { D, I, step, trap, tip, flag, w, p, rR, pk, T, st, gt, par } = B;
  const val = (x, v, k, u) => (x && x.noval ? '' : U.given(v[k], u));
  const exam = (paper, q, marks = '20%') => ({ type: 'exam', paper, q, label: `${paper} · Q${q}`, marks });
  const dB = (x) => 20 * Math.log10(x);
  const F = {};
  F.thev = (v, x = {}) => w(
    (x.kill ? S.wire([[40, 60], [40, 190]], { hl: true }) : S.Vac([40, 60], [40, 190], { lab: 'Vs', side: 'left' })) +
    S.R([40, 60], [130, 60], { lab: 'Rs', val: val(x, v, 'Rs', 'Ω') }) + S.R([130, 60], [230, 60], { lab: 'Rpi', val: val(x, v, 'Rpi', 'Ω') }) + S.arrow([136, 60], 'r', 'I(Rpi)', { ty: 84, tx: 150 }) +
    S.CS([230, 190], [230, 60], { lab: 'F', side: 'left', val: 'β·I(Rpi)' }) + S.wire([[230, 60], [390, 60]]) + S.R([320, 60], [320, 190], { lab: 'Ro', val: val(x, v, 'Ro', 'Ω') }) +
    S.wire([[40, 190], [390, 190]]) + S.dot([230, 60]) + S.dot([320, 60]) + S.dot([230, 190]) + S.dot([320, 190]) + S.term([390, 60], 'A', 'right') + S.term([390, 190], 'B', 'right') + (x.extra || ''), 440, 235);
  F.gm = (v, x = {}) => w(
    S.Vac([40, 80], [40, 240], { lab: 'Vs', side: 'left' }) + S.R([40, 80], [140, 80], { lab: 'Rs', val: val(x, v, 'Rs', 'Ω') }) + S.wire([[140, 80], [165, 80]]) +
    `<circle cx="169" cy="80" r="4" fill="var(--bg-card)" stroke="var(--ink)" stroke-width="1.6"/>` + S.arrow([152, 80], 'r', 'i<tspan class="ssub" dy="4">g</tspan> = 0', { ty: 66, tx: 152 }) +
    S.wire([[175, 160], [240, 160]]) + `<circle cx="171" cy="160" r="4" fill="var(--bg-card)" stroke="var(--ink)" stroke-width="1.6"/>` + S.vmark([170, 100], [170, 142], 'v<tspan class="ssub" dy="4">gs</tspan>', { dx: 22 }) +
    S.CS([240, 60], [240, 160], { lab: 'gm·vgs', hl: x.hl }) + S.R([240, 160], [240, 240], { lab: 'R1', val: val(x, v, 'R1', 'Ω') }) + S.wire([[240, 60], [340, 60]]) + S.R([340, 60], [340, 240], { lab: 'R2', val: val(x, v, 'R2', 'Ω') }) +
    S.wire([[40, 240], [340, 240]]) + S.dot([240, 160]) + S.vmark([385, 90], [385, 210], 'V<tspan class="ssub" dy="4">o</tspan>', { dx: 4 }), 430, 280);

  LK.add({
    id: 'aut25-1b', topic: 'dc', tags: ['Thévenin', 'controlled source'], topics: ['nodal'], src: exam('AUT25', '1(b)'),
    title: 'Thévenin resistance with a current-controlled current source',
    params: { Rs: p(50, 'Ω', null, 0, pk([50, 100, 600])), Rpi: p(5600, 'Ω', null, 0, pk([2200, 4700, 5600])), beta: p(200, '', null, 0, pk([50, 100, 200])), Ro: p(100e3, 'Ω', null, 0, pk([47e3, 100e3])) },
    hideParams: ['beta'], lead: (v) => `F is a current-controlled current source: I(F) = β·I(R<sub>pi</sub>) with β = ${U.num(v.beta)}. V<sub>s</sub> = 9 sin(2000πt) V.`,
    ask: 'Calculate the Thévenin equivalent resistance of the circuit to the left of nodes A and B.',
    fig: (v) => F.thev(v),
    calc: (v) => { const Re = (v.Rs + v.Rpi) / (1 + v.beta); return { Re, Rth: par(v.Ro, Re) }; },
    answers: [{ k: 'Rth', label: 'R<sub>th</sub>', unit: 'Ω' }],
    chk: (v, a, sim) => { const s = sim.ac([['R', '0', 'm', v.Rs], ['R', 'm', 'A', v.Rpi], ['FR', '0', 'A', 'm', 'A', v.Rpi, v.beta], ['R', 'A', '0', v.Ro], ['I', '0', 'A', 1]], 0);
      const net = (extra) => [['V', 's', '0', 9], ['R', 's', 'm', v.Rs], ['R', 'm', 'A', v.Rpi], ['FR', '0', 'A', 'm', 'A', v.Rpi, v.beta], ['R', 'A', '0', v.Ro], ...extra];
      const voc = sim.ac(net([]), 0).v('A')[0], isc = sim.ac(net([['R', 'A', '0', 1e-6]]), 0).v('A')[0] / 1e-6; return [['Rth test source', s.v('A')[0], a.Rth], ['Rth = Voc/Isc', voc / isc, a.Rth, 1e-4]]; },
    hints: ['For R<sub>th</sub>: switch off V<sub>s</sub> (short it) but <b>keep the controlled source</b>.', 'Apply a test voltage V<sub>t</sub> across A–B and find the current I<sub>t</sub> it supplies. R<sub>th</sub> = V<sub>t</sub>/I<sub>t</sub>.'],
    sol: (v, a) => step('1 · Set up the test', F.thev(v, { kill: true, noval: true, extra: S.text([415, 130], 'V<tspan class="ssub" dy="4">t</tspan>', { cls: 'sl b', c: 'var(--volt)' }) }) + D(T`R_{th} = \frac{V_t}{I_t}`), 'Switch off the independent source (V<sub>s</sub> → short). A controlled source is <b>not</b> switched off, because it depends on what the circuit is doing. So series/parallel alone will not work: apply a test voltage V<sub>t</sub> at A–B and find the current it supplies.') +
      step('2 · The controlling current', D(T`I(R_{pi}) = -\frac{V_t}{R_s + R_{pi}}`), 'With V<sub>s</sub> shorted, R<sub>s</sub> and R<sub>pi</sub> run in series from node A to ground. V<sub>t</sub> pushes current through them from A back to the left, <b>against</b> the reference arrow, so I(R<sub>pi</sub>) is negative.') +
      step('3 · KCL at node A', D(T`I_t + I(R_{pi}) + \beta\,I(R_{pi}) = \frac{V_t}{R_o}`) + D(T`I_t = \frac{V_t}{R_o} + (1+\beta)\frac{V_t}{R_s + R_{pi}}`), 'Currents into node A: the test current, I(R<sub>pi</sub>) arriving through R<sub>pi</sub>, and β·I(R<sub>pi</sub>) from F (its arrow points up into A). Current out: down through R<sub>o</sub>.') +
      step('4 · Thévenin resistance', D(T`R_{th} = R_o \parallel \frac{R_s + R_{pi}}{1+\beta}`) + D(T`\frac{R_s + R_{pi}}{1+\beta} = \frac{${U.num(v.Rs + v.Rpi, 4)}}{${U.num(1 + v.beta)}} = ${st(a.Re, 'Ω', 4)}, \qquad R_{th} = ${st(v.Ro, 'Ω')} \parallel ${st(a.Re, 'Ω', 4)} = \boxed{${st(a.Rth, 'Ω')}}`), 'Divide V<sub>t</sub> by I<sub>t</sub>. The controlled source makes the R<sub>s</sub> + R<sub>pi</sub> branch look (1 + β) times smaller.') +
      tip('V<sub>s</sub> and its frequency are decoys: R<sub>th</sub> never depends on the independent source. Cross-check: V<sub>oc</sub>/I<sub>sc</sub> gives the same ' + U.si(a.Rth, 'Ω') + '.') +
      trap('Switching off F as well. That would give R<sub>o</sub> ∥ (R<sub>s</sub> + R<sub>pi</sub>) = ' + U.si(par(v.Ro, v.Rs + v.Rpi), 'Ω') + ', which is wrong.'),
  });

  const gm = (id, paper, vals) => LK.add({
    id, topic: 'dc', tags: ['controlled source', 'amplifier gain', 'dB'], topics: ['nodal'], src: exam(paper, '3', '50 marks'),
    title: 'Transconductance (g<sub>m</sub>) amplifier: gain formula and the g<sub>m</sub> for a target gain',
    params: { Rs: p(1000, 'Ω', null, 0, pk([1000, 2200])), R1: p(vals.R1, 'Ω', null, 0, pk([100, 150, 220])), R2: p(vals.R2, 'Ω', null, 0, pk([22e3, 33e3, 47e3])), HdB: p(vals.dB, 'dB', null, 0, pk([20, 26, 30])) },
    hideParams: ['HdB'],
    ask: (v) => `(a) Derive H = V<sub>o</sub>/V<sub>s</sub> in terms of R<sub>s</sub>, R<sub>1</sub>, R<sub>2</sub> and g<sub>m</sub>. (b) What value of g<sub>m</sub> gives H = ${U.num(v.HdB)} dB?`,
    fig: (v) => F.gm(v),
    calc: (v) => { const Ht = 10 ** (v.HdB / 20); return { Ht, gm: Ht / (v.R2 - Ht * v.R1) }; },
    answers: [{ k: 'gm', label: 'g<sub>m</sub>', unit: 'S' }],
    chk: (v, a, sim) => { const s = sim.ac([['V', 's', '0', 1], ['R', 's', 'g', v.Rs], ['G', 'd', 'x', 'g', 'x', a.gm], ['R', 'x', '0', v.R1], ['R', 'd', '0', v.R2]], 0); return [['gain dB', dB(Math.abs(s.v('d')[0])), v.HdB], ['inverting', s.v('d')[0] < 0 ? 1 : 0, 1]]; },
    hints: ['No current flows into the gate (i<sub>g</sub> = 0). What does that make the voltage drop across R<sub>s</sub>?', 'v<sub>gs</sub> is the gate voltage minus the voltage across R<sub>1</sub>.', 'Convert dB to a ratio first: |H| = 10^(dB/20).'],
    sol: (v, a) => step('(a) · Gate voltage', D(T`i_g = 0 \;\Rightarrow\; v_g = V_s`), 'The gate is an open circuit, so no current flows in R<sub>s</sub> and there is no drop across it. R<sub>s</sub> is a decoy.') +
      step('(a) · Source node', F.gm(v, { noval: true, hl: true }) + D(T`v_{R1} = g_mv_{gs}R_1`), 'The only current reaching R<sub>1</sub> is the controlled source\'s g<sub>m</sub>v<sub>gs</sub> (the gate supplies none).') +
      step('(a) · Solve for v<sub>gs</sub>', D(T`v_{gs} = v_g - v_{R1} = V_s - g_mR_1v_{gs} \;\Rightarrow\; v_{gs} = \frac{V_s}{1 + g_mR_1}`), 'v<sub>gs</sub> is measured from the gate to the top of R<sub>1</sub>. It depends on itself, so collect the v<sub>gs</sub> terms.') +
      step('(a) · Output', D(T`V_o = -g_mv_{gs}R_2 \;\Rightarrow\; \boxed{H = \frac{V_o}{V_s} = -\frac{g_mR_2}{1 + g_mR_1}}`), 'The source pulls g<sub>m</sub>v<sub>gs</sub> <b>down</b> out of the top node. That current has to come up through R<sub>2</sub> from ground, so the top of R<sub>2</sub> is negative.') +
      step('(b) · dB to a ratio', D(T`|H| = 10^{${U.num(v.HdB)}/20} = ${U.num(a.Ht, 4)}`), 'dB = 20 log<sub>10</sub>|H|, so undo it. The gain is inverting; the dB figure is its magnitude.') +
      step('(b) · Solve for g<sub>m</sub>', D(T`\frac{g_mR_2}{1 + g_mR_1} = |H| \;\Rightarrow\; g_m = \frac{|H|}{R_2 - |H|R_1} = \frac{${U.num(a.Ht, 4)}}{${U.num(v.R2)} - ${U.num(a.Ht, 4)}\times${U.num(v.R1)}} = \boxed{${st(a.gm, 'S')}}`), 'Cross-multiply and collect g<sub>m</sub>.') +
      tip('As g<sub>m</sub> → ∞ the gain tends to −R<sub>2</sub>/R<sub>1</sub> = −' + U.num(v.R2 / v.R1) + '. The target must be below that, or no g<sub>m</sub> can reach it.'),
  });
  gm('aut23-3', 'AUT23', { R1: 500, R2: 10e3, dB: 20 });
  gm('spr24-3', 'SPR24', { R1: 470, R2: 22e3, dB: 30 });
  LK.F1b = F;
})(typeof window !== 'undefined' ? window : globalThis);
