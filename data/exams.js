// Topics (learning order + Learn-it boxes), sample exams, and the two fresh mocks.
(function (G) {
  const { S, U, B, LK } = G;
  const { D, I, T } = B;
  const chk = (q, a) => ({ q, a });

  // ---------------------------------------------------------------- Learn-it cards
  const dcCards = () => LK.dcNotes.map(t => ({ h: t.name, body: t.notes, check: t.check }));
  const TOPICS = [
    { id: 'dc', n: 1, name: 'DC circuits', sub: 'Nodal analysis, superposition, Thévenin, controlled sources', where: 'Q1(a) or Q1(b) in every paper · 20 marks',
      core: ['aut24-1a', 'aut23-1b', 'aut22-1b', 'aut25-1a', 'aut25-1b', 'aut23-3'],
      more: ['spr25-1a', 'spr24-1b', 'spr23-1b', 'aut21-1b', 'spr22-1b', 'spr21-1a', 'spr21-1b', 'spr24-3'],
      cards: () => dcCards().concat([{ h: 'Thévenin & controlled sources', body: `<p>Any two-terminal circuit of sources and resistors acts like <b>one source V<sub>th</sub> in series with one resistor R<sub>th</sub></b>.</p>
        <p>V<sub>th</sub> = the open-circuit voltage at the terminals.</p><p>R<sub>th</sub> = resistance seen with independent sources switched off (V → short, I → open).</p>
        <p>A <b>controlled source</b> (diamond symbol) is set by a voltage or current somewhere else. Never switch it off. Use a test source instead:</p>${D(T`R_{th} = \frac{V_t}{I_t}`)}`,
        check: chk('To find R<sub>th</sub>, what do you do with a controlled current source?', 'Leave it in. Apply a test voltage and work out the current.') }]) },
    { id: 'trans', n: 2, name: 'First-order transients', sub: 'RC and RL circuits after a switch or a step', where: 'Q1(b) or Q1(c) in every paper · Q3 in AUT25',
      core: ['aut22-1c', 'aut23-1c', 'spr21-1c', 'spr25-1b', 'aut25-3'], more: ['spr23-1c', 'aut21-1c', 'spr22-1c', 'spr24-1c', 'aut24-1b'],
      cards: () => [{ h: 'One formula for every question', body: `<p>A circuit with one capacitor or one inductor moves from a <b>start value</b> to a <b>final value</b> along an exponential.</p>
        ${D(T`x(t) = x_\infty + (x_0 - x_\infty)\,e^{-(t - t_0)/\tau}`)}
        <p><b>x<sub>0</sub></b> start value · <b>x<sub>∞</sub></b> final value · <b>τ</b> time constant · <b>t<sub>0</sub></b> when the switch happens.</p>
        ${LK.expPlot(0, 1, 1, 1.6, 'x')}<p>After 1τ: 63% of the way. After 5τ: finished.</p>`,
        check: chk('A voltage starts at 2 V and heads for 10 V. Where is it after one time constant?', '2 + 0.632 × 8 = 7.06 V.') },
      { h: 'The three things to find', body: `<p><b>Start value.</b> Capacitor <i>voltage</i> cannot jump. Inductor <i>current</i> cannot jump. So use the value just before the switch.</p>
        <p><b>Final value.</b> Wait a long time: a capacitor becomes an <b>open circuit</b>, an inductor becomes a <b>wire</b>. Then it is a DC problem.</p>
        <p><b>Time constant.</b></p>${D(T`\tau = RC \qquad\text{or}\qquad \tau = \frac{L}{R}`)}<p>R is the resistance the C or L sees with sources switched off (its Thévenin resistance).</p>`,
        check: chk('L = 100 mH in series with 1 kΩ and 1.5 kΩ. τ = ?', '0.1 / 2500 = 40 µs.') }] },
    { id: 'imp', n: 3, name: 'Impedance & phasors', sub: 'Turning R, L and C into complex ohms', where: 'Q1(c) or Q1(d) in 8 of 10 papers · needed for Q2',
      core: ['aut21-1d', 'spr23-1d', 'aut25-1d', 'aut24-1c'], more: ['aut22-1d', 'spr22-1d', 'spr21-1d', 'spr25-1c'],
      cards: () => [{ h: 'Impedance of each part', body: `<p>For a sine wave at angular frequency <b>ω = 2πf</b>, every part has an impedance Z (complex ohms):</p>
        ${D(T`Z_R = R \qquad Z_L = j\omega L \qquad Z_C = \frac{1}{j\omega C} = -\frac{j}{\omega C}`)}
        <p>Then use every DC rule (series, parallel, dividers, nodal) with Z in place of R.</p><p><b>Admittance</b> Y = 1/Z. In parallel, admittances add.</p>`,
        check: chk('What is the impedance of a 100 nF capacitor at ω = 10⁵ rad/s?', '1/(jωC) = −j100 Ω.') },
      { h: 'Magnitude and phase', body: `<p>Write Z = R + jX. Then</p>${D(T`|Z| = \sqrt{R^2 + X^2} \qquad \theta = \tan^{-1}\!\left(\frac{X}{R}\right)`)}${B.tri(3, 4)}
        <p>X positive: inductive, angle positive. X negative: capacitive, angle negative.</p><p>To divide complex numbers: divide the magnitudes, subtract the angles.</p>`,
        check: chk('Z = 30 − j40 Ω. Magnitude and phase?', '50 Ω at −53.1°.') }] },
    { id: 'pow', n: 4, name: 'AC power & transformers', sub: 'Average power, reflected loads, maximum power transfer', where: 'Q1 in 9 of 10 papers · Q3 in AUT24 and SPR25',
      core: ['aut22-1a', 'aut21-1a', 'aut23-1a', 'aut25-1c', 'spr25-1d', 'spr25-3'], more: ['spr23-1a', 'spr22-1a', 'spr24-1a', 'aut24-1d', 'aut24-3'],
      cards: () => [{ h: 'Average power', body: `<p>Only <b>resistors</b> dissipate average power. Inductors and capacitors store energy and give it back.</p>
        ${D(T`P = \tfrac12 I_{pk}^2R = \frac{V_{pk}^2}{2R}`)}<p>The ½ is there because exam sources are given as <b>peak</b> values (V<sub>m</sub> cos ωt). I<sub>pk</sub> and V<sub>pk</sub> are for that resistor only.</p>`,
        check: chk('A 10 V peak sine across 50 Ω. Average power?', '10²/(2×50) = 1 W.') },
      { h: 'Ideal transformer', body: `<p>With turns ratio n = N<sub>1</sub>/N<sub>2</sub>:</p>${D(T`V_2 = \frac{V_1}{n} \qquad I_2 = nI_1 \qquad Z' = n^2Z_L`)}
        <p>Z′ is what the source <b>sees</b>. Move the load to the primary side (× n²), solve the simple circuit, then step the voltage back down (÷ n). No power is lost.</p>${LK.F4.refl('Rs', "n²RL")}`,
        check: chk('A 10 Ω load on a 10:1 transformer looks like what from the primary?', '10² × 10 = 1 kΩ.') },
      { h: 'Maximum power transfer', body: `<p>A source with resistance R<sub>s</sub> gives the most power to a load when</p>${D(T`R_{load} = R_s \qquad\text{and the reactances cancel}`)}
        <p>Fix a mismatch with a transformer: n = √(R<sub>s</sub>/R<sub>L</sub>).</p><p>Cancel an inductor with a series capacitor: ωL = 1/(ωC).</p><p>Then P<sub>max</sub> = V<sub>m</sub>²/(8R<sub>s</sub>).</p>`,
        check: chk('R<sub>s</sub> = 200 Ω, R<sub>L</sub> = 8 Ω. Turns ratio for maximum power?', '√(200/8) = 5.') }] },
    { id: 'opamp', n: 5, name: 'Op-amps & transfer functions', sub: 'H(ω), gain in dB, phase, steady-state V<sub>out</sub>(t)', where: 'Q2 in every paper · 50 marks · plus Q1(e) in 7 papers',
      core: ['aut23-1e', 'aut22-1e', 'aut21-2', 'spr23-2', 'aut25-2', 'aut24-2', 'aut23-2'], more: ['spr24-1e', 'aut21-1e', 'spr22-1e', 'spr23-1e', 'spr21-1e', 'spr22-2', 'aut22-2', 'spr25-2', 'spr24-2', 'spr21-2'],
      cards: () => [{ h: 'The two op-amp rules', body: `<p>For an ideal op-amp with feedback from the output to the <b>−</b> input:</p><p><b>1.</b> No current flows into either input.</p><p><b>2.</b> V<sub>−</sub> = V<sub>+</sub>.</p>
        <p>Method: write V<sub>+</sub>, set V<sub>−</sub> equal to it, then write KCL at the − input.</p>${LK.F5.invlp({}, { noval: true, hlF: true })}
        ${D(T`\text{Inverting: } H = -\frac{Z_f}{Z_{in}} \qquad\qquad \text{Non-inverting: } H = 1 + \frac{Z_f}{Z_g}`)}<p>Z<sub>f</sub> is the feedback impedance. Z<sub>g</sub> goes from the − input to ground.</p>`,
        check: chk('Inverting amp, 2 kΩ input resistor, 10 kΩ feedback. Gain?', '−10k/2k = −5.') },
      { h: 'From H(ω) to V<sub>out</sub>(t)', body: `<p>The transfer function H(ω) = V<sub>out</sub>/V<sub>in</sub> is a complex number at each frequency.</p>
        ${D(T`V_{in} = A\cos(\omega t) \;\Rightarrow\; V_{out} = A\,|H|\cos(\omega t + \angle H)`)}
        <p><b>Same frequency.</b> Amplitude × |H|. Phase + ∠H.</p><p>Gain in dB = 20 log<sub>10</sub>|H|. A minus sign in H adds 180°.</p>
        <p>Building block: R ∥ C = R/(1 + jωRC). Its size drops by √2 (−3 dB) and its angle is −45° when ωRC = 1.</p><p>Two sine waves in? Do each one separately at its own frequency, then add.</p>`,
        check: chk('H = 1/(1 + j) at some frequency. What are |H| and ∠H?', '1/√2 = 0.707 and −45°.') }] },
    { id: 'diode', n: 6, name: 'Diode circuits', sub: 'Clippers, rectifiers, clamps, on/off tests', where: 'Q3 in 5 papers · Q1(d) or Q1(e) in the other 5',
      core: ['aut24-1e', 'aut22-3', 'spr22-3', 'aut21-3', 'aut25-1e', 'spr21-3'], more: ['spr25-1e', 'aut23-1d', 'spr24-1d', 'spr23-3'],
      cards: () => [{ h: 'Diode models', body: `<p>A diode lets current flow one way only: in the direction of the arrow.</p><p><b>Ideal diode:</b> ON = a wire. OFF = an open circuit.</p>
        <p><b>Constant-drop diode:</b> ON = a small fixed voltage (the paper tells you, e.g. 0.5 V or 0.7 V). OFF = open.</p>
        <p><b>Method:</b> guess OFF → no current → find the voltage across the diode. If it exceeds the threshold in the forward direction, the guess was wrong: it is ON.</p>`,
        check: chk('An ideal diode has +3 V on its cathode (bar) and +1 V on its anode. On or off?', 'Off. The cathode is higher, so it is reverse biased.') },
      { h: 'The four circuits that come up', body: `<p><b>Clipper:</b> diode + battery across the output. The output cannot pass the battery voltage, so the peak is flattened.</p>
        <p><b>Rectifier:</b> diode in series. Only positive half-cycles get through. A bridge (4 diodes) flips the negative ones, losing 2 diode drops.</p>
        <p><b>Smoothing capacitor:</b> charges to the peak, then droops slowly through the load. Ripple ≈ V<sub>pk</sub>·T/(RC).</p>
        <p><b>Clamp:</b> capacitor in series + diode to a battery. The whole waveform is shifted, shape unchanged.</p>
        ${S.plot({ w: 320, h: 150, x: [0, 2], y: [-1.2, 1.2], curves: [{ f: (t) => Math.sin(6.283 * t), c: 'var(--muted)', dash: 1, w: 1.3 }, { f: (t) => Math.max(-1, Math.min(0.5, Math.sin(6.283 * t))) }], marks: [{ y: 0.5, t: 'clip' }], yl: 'clipper output' })}`,
        check: chk('A clipper limits at +2 V. The input is a 1.5 V peak sine. What is the output maximum?', '1.5 V. The sine never reaches the limit, so nothing is clipped.') }] },
  ];
  LK.topics = TOPICS;

  // ---------------------------------------------------------------- sample exams (auto-built from the questions)
  const ORDER = ['1(a)', '1(b)', '1(c)', '1(d)', '1(e)', '2', '3'];
  const NAMES = { AUT25: 'Autumn 2025/26', SPR25: 'Spring 2024/25 (resit)', AUT24: 'Autumn 2024/25', SPR24: 'Spring 2023/24 (resit)', AUT23: 'Autumn 2023/24', SPR23: 'Spring 2022/23 (resit)', AUT22: 'Autumn 2022/23', SPR22: 'Spring 2021/22 (online)', AUT21: 'Autumn 2021/22 (online)', SPR21: 'Spring 2020/21 (online)' };
  const FILES = { AUT25: '2025_AUT', SPR25: '2025_SPR', AUT24: '2024_AUT', SPR24: '2024_SPR', AUT23: '2023_AUT', SPR23: '2023_SPR', AUT22: '2022_AUT', SPR22: '2022_SPR', AUT21: '2021_AUT', SPR21: '2021_SPR' };
  LK.papers = Object.keys(NAMES).map(code => ({ code, name: NAMES[code], file: `papers/${FILES[code]}_EEEN20020.pdf`,
    qs: LK.Q.filter(q => q.src.type === 'exam' && q.src.paper === code).sort((a, b) => ORDER.indexOf(a.src.q) - ORDER.indexOf(b.src.q)).map(q => q.id) }));
  LK.rules = [
    ['Time', '120 minutes for 200 marks. That is 0.6 min per mark.'],
    ['Pacing', 'About <b>12 min</b> for each Q1 part (20 marks). About <b>30 min</b> each for Q2 and Q3 (50 marks).'],
    ['Layout', 'Answer all questions. Q1 has five parts (a)–(e). Answers go in the boxes on the paper.'],
    ['Open book', 'Books and notes allowed, <b>on paper only</b>. Non-programmable or scientific calculator.'],
    ['Answers', 'Give a <b>number and its unit</b>, rounded to 3 significant figures. "Analytical expression" means a formula with symbols only.'],
  ];

  // ---------------------------------------------------------------- fresh mocks: same question styles, new numbers
  const clone = (id, baseId, vals, paper, q, marks) => {
    const b = LK.byId[baseId]; const params = {};
    for (const [k, pp] of Object.entries(b.params)) params[k] = { ...pp, base: vals[k] ?? pp.base, sym: null };
    for (const k of Object.keys(vals)) if (!(k in b.params)) throw new Error(`mock ${id}: no param ${k} in ${baseId}`);
    return LK.add({ ...b, id, params, src: { type: 'mock', paper, q, label: `${paper} · Q${q}`, marks, basedOn: b.src.label, baseId: b.id } });
  };
  const mock = (code, name, list) => LK.mocks.push({ code, name, qs: list.map(([q, base, vals]) => clone(`${code.toLowerCase().replace(' ', '')}-${q.replace(/[()]/g, '')}`, base, vals, code, q, q.length > 1 ? '20%' : '50 marks').id) });
  mock('Mock A', 'Mock exam A', [
    ['1(a)', 'spr25-1a', { A1: 3, A2: 4, R1: 1000, R2: 2200, R3: 4700, t0: 0.75e-3 }],
    ['1(b)', 'aut22-1c', { Vi: 5, Vf: 1, R2: 3300, C3: 220e-9, t0: 1e-3, t: 2e-3 }],
    ['1(c)', 'spr21-1d', { R1: 2200, L2: 15e-3, C3: 220e-12, f: 100e3 }],
    ['1(d)', 'spr25-1d', { Vm: 5, f: 20e3, Rs: 75, Rl: 75, Ll: 4.7e-3 }],
    ['1(e)', 'aut24-1e', { VDD: 3.3, RL: 47e3, VD: 0.6, VA1: 0.5, VA2: 3 }],
    ['2', 'aut23-2', { A: 2, R1: 22e3, R2: 22e3, C3: 2.2e-9, C4: 2.2e-9, k: 1 }],
    ['3', 'aut22-3', { A: 10, f: 5e3, Rs: 470, Vdc1: 4, Vdc2: 3 }],
  ]);
  mock('Mock B', 'Mock exam B', [
    ['1(a)', 'aut25-1a', { Vs: 12, R1: 2200, R2: 4700, R3: 1000, R4: 3300, R5: 6800 }],
    ['1(b)', 'aut25-1b', { Rs: 600, Rpi: 2200, beta: 100, Ro: 47e3 }],
    ['1(c)', 'spr24-1c', { Vi: 0, Vf: 5, R2: 2200, L3: 47e-3, R4: 1000, t0: 100e-6, t: 120e-6 }],
    ['1(d)', 'aut25-1d', { R1: 10, L: 2.2e-3, C: 47e-6, R2: 220, f: 500 }],
    ['1(e)', 'aut23-1e', { R2: 4700, C3: 47e-12, R4: 220e3 }],
    ['2', 'aut24-2', { A: 2, R: 22e3, C: 2.2e-9 }],
    ['3', 'aut25-3', { Vl: 1, Vh: 6, f: 2e3, R: 22e3, C: 10e-9 }],
  ]);

  LK.homework = { ids: LK.Q.filter(q => q.src.type === 'hw').map(q => q.id), drills: LK.Q.filter(q => q.src.type === 'drill').map(q => q.id) };
  LK.version = '2026-11-19.1';
})(typeof window !== 'undefined' ? window : globalThis);
