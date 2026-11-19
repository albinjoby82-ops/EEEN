// EEEN Lock-In printable notes: one page per section, same look as the site.
// Each section = the method (exam recipe) + the Learn-it notes + worked examples taken from the site's question data.
(function () {
  var U = window.U, LK = window.LK, B = window.B, D = B.D, T = String.raw;
  var SN = '25382076';

  // ---------------------------------------------------------------- section content
  var SECTIONS = {
    1: {
      topic: 'dc',
      method: [
        { h: 'The one method: KCL at every unknown node', body:
          '<p>Every DC question in this section can be done with this. Dividers and Millman are only shortcuts.</p>' +
          '<ol class="recipe">' +
          '<li><b>Pick a ground.</b> If none is drawn, use the node the question measures from (e.g. node 4 for V<sub>24</sub>), or the bottom wire.</li>' +
          '<li><b>List every node and cross off the known ones.</b> Ground = 0 V. The top of a voltage source whose bottom is on ground = that source\'s voltage.</li>' +
          '<li><b>Count what\'s left.</b> A node that only touches resistors (and current sources) is unknown. One unknown → one equation. Two → two.</li>' +
          '<li><b>KCL at each unknown node:</b> every current written as <i>leaving</i>, all added up = 0. Write <b>my node first</b>.</li>' +
          '<li><b>Solve.</b> Multiply through to clear fractions, or use the calculator\'s simultaneous-equation mode.</li>' +
          '<li><b>Answer what was asked:</b> a voltage between two nodes = e<sub>a</sub> − e<sub>b</sub>; a current = Ohm\'s law on that resistor.</li></ol>' +
          D(T`\frac{e_{\text{me}} - e_{\text{other}}}{R} \quad\text{(current leaving through each resistor)}`) +
          D(T`\sum \text{currents leaving} = 0`) },
        { h: 'Why the currents add to zero', body:
          '<p>Charge can\'t pile up at a point: what flows in must flow out. If every arrow is drawn <b>leaving</b>, a current that really flows in just comes out negative, so the total is 0.</p>' +
          D(T`(-2\ \text{mA}) + (+2\ \text{mA}) = 0`) },
        { h: 'Current sources', body:
          '<p>A current source fixes the <b>current</b>, not the voltage. Put its value straight into the KCL sum.</p>' +
          '<ul><li>Arrow <b>into</b> the node → <b>minus</b> (it is −I leaving).</li><li>Arrow <b>out of</b> the node → <b>plus</b>.</li>' +
          '<li>A resistor in series with a current source <b>never appears</b>: the current is the same whatever its value.</li></ul>' },
        { h: 'Shortcut: when a divider is enough', body:
          '<p>One single loop (everything in series) → the voltage divider gives the answer straight away:</p>' +
          D(T`V_2 = V_s\,\frac{R_2}{R_1 + R_2}`) +
          '<p>A resistor joining two "middle" nodes (a bridge) → no divider. Use KCL at both.</p>' },
        { h: 'Before you write the answer', body:
          '<ul><li><b>Units in seconds</b> for t: 1.25 ms = 1.25 × 10<sup>−3</sup> s.</li><li>Calculator in <b>RAD</b> mode for sin/cos.</li>' +
          '<li>Give a <b>number and a unit</b>, 3 significant figures.</li></ul>' +
          '<table class="tbl pfx"><tr><th>M</th><th>k</th><th>m</th><th>µ</th><th>n</th><th>p</th></tr>' +
          '<tr><td>10<sup>6</sup></td><td>10<sup>3</sup></td><td>10<sup>−3</sup></td><td>10<sup>−6</sup></td><td>10<sup>−9</sup></td><td>10<sup>−12</sup></td></tr></table>' },
      ],
      // the notes, thinned: formulas + the statements that matter
      notes: [
        { h: 'Ohm\'s law & power', f: [T`V = IR`, T`P = VI = I^2R = \frac{V^2}{R}`],
          k: ['Current entering the <b>+</b> terminal → element absorbs P = VI. Resistors always absorb.'] },
        { h: 'Series & parallel', f: [T`R_s = R_1 + R_2`, T`R_1 \parallel R_2 = \frac{R_1R_2}{R_1+R_2}`],
          k: ['Series = same current. Parallel = same two nodes.', 'Parallel is always smaller than the smallest one.'] },
        { h: 'Dividers', f: [T`V_2 = V_s\,\frac{R_2}{R_1+R_2}`, T`I_1 = I\,\frac{R_2}{R_1+R_2}`],
          k: ['Voltage divider: <b>own</b> resistor on top. Current divider: <b>other</b> resistor on top.'] },
        { h: 'Sources', f: [],
          k: ['Voltage source fixes the voltage; current source fixes the current (arrow direction).',
            'Resistor in series with a current source doesn\'t change the current.', 'Open terminal → no current → no drop.'] },
        { h: 'Nodal analysis (KCL)', f: [T`\sum \frac{e_n - e_{\text{neighbour}}}{R} = I_{\text{injected}}`, T`e = \frac{\sum V_k/R_k}{\sum 1/R_k}`],
          k: ['Second formula (Millman): shortcut for one unknown node.', 'Voltage source to ground fixes that node. Source between two nodes → supernode + e<sub>a</sub> − e<sub>b</sub> = V.'] },
        { h: 'Superposition', f: [T`e(t) = k_1V_1(t) + k_2V_2(t)`],
          k: ['One source at a time: V source → <b>short</b>, I source → <b>open</b>.', 'Resistors only → same sine out, just scaled.'] },
        { h: 'Thévenin & controlled sources', f: [T`V_{th} = V_{\text{open circuit}}`, T`R_{th} = \frac{V_t}{I_t}`],
          k: ['R<sub>th</sub>: switch off independent sources (V → short, I → open).', 'Never switch off a controlled source: use a test source.'] },
      ],
      // what is new in each worked example (keyed by question id)
      examples: [
        { id: 'aut24-1a', spot: ['Nodes 1 and 3 sit on sources, so they are known. <b>Only node 2 is unknown</b> → one KCL equation.',
          'Resistors only, so each sine just gets scaled. The answer is a·sin + b·cos.',
          't in <b>seconds</b>, calculator in <b>RAD</b>.'] },
        { id: 'aut23-1b', spot: ['Nodes 1 and 2 only touch resistors → <b>two unknowns, two KCL equations</b>.',
          'A resistor above a source: its far end sits at the source voltage (1 V here).',
          'Multiply each equation by 2000 to clear the fractions, then substitute.'] },
        { id: 'aut22-1b', spot: ['<b>No ground drawn:</b> pick node 4 (the question measures V<sub>24</sub> from it), so V<sub>24</sub> = e<sub>2</sub>.',
          '<b>Current source:</b> its arrow points into node 2, so it enters KCL as <b>−I<sub>4</sub></b>.',
          '<b>R<sub>5</sub> never appears:</b> it is in series with the current source.'] },
        { id: 'aut25-1a', spot: ['No ground drawn: bottom wire = 0 V, top wire = V<sub>s</sub>.',
          '<b>R<sub>5</sub> joins A and B</b>, so dividers don\'t work. Two unknowns → KCL at A and at B.',
          'Messy numbers: use <b>simultaneous mode</b> in kΩ, then I = (e<sub>A</sub> − e<sub>B</sub>)/R<sub>5</sub>.'] },
      ],
    },

    2: {
      topic: 'trans',
      method: [
        { h: 'One formula for every question', body:
          '<p>One capacitor or one inductor: the answer slides from a start value to a final value.</p>' +
          D(T`x(t) = x_{\infty} + (x_0 - x_{\infty})\,e^{-(t - t_0)/\tau}`) +
          '<table class="tbl"><tr><td>x<sub>0</sub></td><td>start value, just before the switch</td></tr><tr><td>x<sub>∞</sub></td><td>final value, long after the switch</td></tr>' +
          '<tr><td>τ</td><td>time constant</td></tr><tr><td>t<sub>0</sub></td><td>when the switch happens</td></tr></table>' +
          '<ol class="recipe"><li>Start value (old circuit, L = wire, C = gap).</li><li>Final value (new circuit, L = wire, C = gap).</li><li>τ from the resistance L or C sees.</li><li>Put them in the formula.</li></ol>' },
        { h: 'Start value', body:
          '<ul><li><b>Inductor current</b> can\'t jump. <b>Capacitor voltage</b> can\'t jump.</li>' +
          '<li>"For a long time" = steady state: <b>L = wire</b>, <b>C = gap</b>. Solve that DC circuit.</li>' +
          '<li>If the question asks for a node voltage, find the L current or C voltage first, then get the node voltage from it.</li></ul>' },
        { h: 'Final value', body:
          '<p>Same idea with the new source value: L = wire, C = gap, solve the DC circuit.</p>' +
          '<ul><li>One loop left → voltage divider (or KCL, same answer).</li><li>A node with three or more branches → KCL.</li></ul>' },
        { h: 'Time constant', body:
          D(T`\tau = RC \qquad\qquad \tau = \frac{L}{R}`) +
          '<p>R = the resistance the L or C sees between its two ends with the sources <b>off</b>: V source → <b>short</b>, I source → <b>open</b>.</p>' +
          '<p>Series → add. Both from the same node to ground → parallel.</p>' },
        { h: 'Pulses: two stages', body:
          '<ol class="recipe"><li>Stage 1: the normal formula, up to the end of the pulse.</li><li>The answer from stage 1 becomes the <b>start</b> of stage 2.</li><li>Stage 2: the normal formula again, heading to 0.</li></ol>' +
          '<p>τ is the same in both stages: only the source changes, not the circuit.</p>' },
        { h: 'Before you write the answer', body:
          '<ul><li>Use <b>t − t<sub>0</sub></b>, the time since the switch.</li><li>µ = 10<sup>−6</sup>, m = 10<sup>−3</sup>. Same prefix top and bottom in t/τ.</li>' +
          '<li>After 1τ: 63% of the way. After 5τ: finished.</li><li>Number and unit, 3 significant figures.</li></ul>' },
      ],
      notes: [
        { h: 'The formula', f: [T`x(t) = x_{\infty} + (x_0 - x_{\infty})\,e^{-(t - t_0)/\tau}`], k: ['1τ → 63% of the way. 5τ → finished.'] },
        { h: 'Time constant', f: [T`\tau = RC`, T`\tau = \frac{L}{R}`], k: ['R seen by L or C with sources off (V → short, I → open).'] },
        { h: 'Steady state', f: [], k: ['Inductor = <b>wire</b>.', 'Capacitor = <b>gap</b> (open circuit).'] },
        { h: 'Can\'t jump', f: [], k: ['Inductor <b>current</b>.', 'Capacitor <b>voltage</b>.', 'Everything else can jump at the switch.'] },
        { h: 'Charging and decaying', f: [T`x = x_{\infty}\left(1 - e^{-t/\tau}\right)`, T`x = x_0\,e^{-t/\tau}`], k: ['First: starting from 0. Second: heading to 0.'] },
        { h: 'Square wave, steady state', f: [T`V_{max} = V_H + (V_{min} - V_H)\,e^{-T/2\tau}`, T`V_{min} = V_L + (V_{max} - V_L)\,e^{-T/2\tau}`], k: ['Rises for T/2 towards V<sub>H</sub>, falls for T/2 towards V<sub>L</sub>. Solve the pair.'] },
      ],
      examples: [
        { id: 'aut22-1c', spot: ['<b>Capacitor voltage can\'t jump</b>: the start value is the old steady-state voltage.',
          'Final value: C is a gap, so no current flows and e<sub>2</sub> = the new source voltage.', 'Use t − t<sub>0</sub> = 1 ms, not 2 ms.'] },
        { id: 'aut23-1c', spot: ['<b>Non-zero start</b>: V<sub>1</sub> was 1 V for a long time, so the inductor already carries current.',
          'Find the <b>inductor current</b> first (one loop, L = wire), then e<sub>3</sub> = I·R<sub>4</sub>.', 'τ = L / (R<sub>2</sub> + R<sub>4</sub>).'] },
        { id: 'spr21-1c', spot: ['Start value given: I(L<sub>4</sub>) = 0.',
          'Final: L<sub>4</sub> is a wire, so e<sub>3</sub> = 0. Node 3 has three branches → <b>KCL</b>.', 'τ: short V<sub>1</sub>, so R<sub>2</sub> and R<sub>3</sub> are <b>in parallel</b>.'],
          mine: ['This is a tricky one. When L<sub>4</sub> is a wire it puts e<sub>3</sub> to 0, and then we use KCL to find the L<sub>4</sub> current for x<sub>∞</sub>.', 'When I am looking for R, I need to short V<sub>1</sub>.'] },
        { id: 'spr25-1b', spot: ['<b>Pulse</b>: two stages. Stage 2 starts from where stage 1 ended.',
          'τ is the same in both stages.', '<b>Sign trap</b>: after the pulse V<sub>1</sub> = 0, so e<sub>2</sub> = 0 − I·R<sub>1</sub> is <b>negative</b>.'],
          mine: ['The method for a pulse:', 'Stage 1: the normal formula, up to the end of the pulse.', 'The answer from stage 1 becomes the start of stage 2.', 'Stage 2: the normal formula again, heading to 0.'] },
        { id: 'aut25-3', spot: ['<b>Square wave</b>, after the start-up has died away: it repeats every period.',
          'High half: rises from V<sub>min</sub> towards V<sub>H</sub>. Low half: falls from V<sub>max</sub> towards V<sub>L</sub>. Each lasts T/2.',
          'Two equations, two unknowns (V<sub>max</sub>, V<sub>min</sub>).'] },
      ],
    },
  };

  // ---------------------------------------------------------------- helpers (same as the site)
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  var NICE = { Rl: 'R<sub>load</sub>', Ll: 'L<sub>load</sub>', Cl: 'C<sub>load</sub>', beta: 'β', om: 'ω' };
  function nm(k) { return NICE[k] || (k.length === 1 ? k : k.replace(/^([A-Za-z])(.+)$/, '$1<sub>$2</sub>')); }
  function paperValues(q) {
    var sym = U.symbols(SN, q.symset || 'exam'), v = {};
    Object.keys(q.params).forEach(function (k) { var p = q.params[k]; v[k] = p.sym ? +(p.base + sym[p.sym] * p.step).toPrecision(12) : p.base; });
    return v;
  }
  function given(q, v) {
    if (q.hideGiven) return '';
    var items = Object.keys(q.params).filter(function (k) { return (q.hideParams || []).indexOf(k) < 0; })
      .map(function (k) { return '<span class="gv">' + nm(k) + ' = <b>' + U.given(v[k], q.params[k].unit) + '</b></span>'; });
    return items.length ? '<div class="given"><span class="gl">Given</span>' + items.join('') + '</div>' : '';
  }
  var fn = function (x, v) { return typeof x === 'function' ? x(v) : x || ''; };
  function steps(q, v, a) {
    var t = document.createElement('template'), out = []; t.innerHTML = q.sol(v, a, q);
    [].forEach.call(t.content.children, function (c) {
      if (c.classList.contains('step')) {
        var h = c.querySelector('h4'), title = h ? h.innerHTML.replace(/^\d+\s*·\s*/, '') : ''; if (h) h.remove();
        out.push({ t: title, b: c.innerHTML });
      } else if (out.length) out[out.length - 1].b += c.outerHTML;
      else out.push({ t: 'Before you start', b: c.outerHTML });
    });
    return out;
  }
  function paperOf(q) {
    var key = q.src.paper + '-' + q.src.q.replace(/[()]/g, ''), pg = (LK.paperPages || {})[key];
    return pg ? { img: '../papers/q/' + key + '.png', page: pg } : null;
  }

  // ---------------------------------------------------------------- build the page
  function build(n, root) {
  var S = SECTIONS[n], doc = el('div', 'section c' + n); root.appendChild(doc);
  var topic = LK.topics.filter(function (t) { return t.id === S.topic; })[0];
  function numOf(id) { var i = topic.core.indexOf(id); if (i >= 0) return n + '.1.' + (i + 1); i = topic.more.indexOf(id); return n + '.2.' + (i + 1); }

  doc.appendChild(el('div', 'head', '<span class="sc">eeen20020 · lock-in notes</span><span>Section <b>' + n + '</b></span>'));
  doc.appendChild(el('h1', 'title', '<span class="num">' + n + '</span>' + topic.name));
  doc.appendChild(el('div', 'src', topic.sub + ' · ' + topic.where));

  // contents
  var toc = '<div class="toc"><div class="toc-h sc">contents</div>' +
    '<a href="#m' + n + '"><span class="num">' + n + '.0</span>The method</a>' +
    '<a href="#notes' + n + '"><span class="num">' + n + '.N</span>Notes</a>' +
    S.examples.map(function (e, i) { var q = LK.byId[e.id]; return '<a href="#p' + n + '-' + (i + 1) + '"><span class="num">' + numOf(e.id) + '</span>' + q.title + ' <i>(' + q.src.label + ')</i></a>'; }).join('') + '</div>';
  doc.appendChild(el('div', '', toc));

  // n.0 the method
  var m = el('section', 'blk'); m.id = 'm' + n;
  m.appendChild(el('h2', '', '<span class="num">' + n + '.0</span>The method'));
  m.appendChild(el('div', 'src', 'Do this for every question in the section.'));
  S.method.forEach(function (c, i) { m.appendChild(el('div', 'mcard', '<h3><span class="num">' + n + '.0.' + (i + 1) + '</span>' + c.h + '</h3>' + c.body)); });
  doc.appendChild(m);

  // notes: formulas + key statements only
  var nb = el('section', 'blk'); nb.id = 'notes' + n;
  nb.appendChild(el('h2', '', '<span class="num">' + n + '.N</span>Notes'));
  var grid = el('div', 'fgrid');
  S.notes.forEach(function (c) {
    grid.appendChild(el('div', 'fcard', '<h3>' + c.h + '</h3>' + c.f.map(function (f) { return D(f); }).join('') +
      '<ul>' + c.k.map(function (k) { return '<li>' + k + '</li>'; }).join('') + '</ul>'));
  });
  nb.appendChild(grid); doc.appendChild(nb);

  // worked examples n.1.k
  var wb = el('section', 'blk');
  wb.appendChild(el('h2', '', '<span class="num">' + n + '.1</span>Worked examples'));
  wb.appendChild(el('div', 'src', 'Exam values. Each one: what\'s new, the paper as printed, then the full solution.'));
  doc.appendChild(wb);
  S.examples.forEach(function (e, i) {
    var q = LK.byId[e.id], v = paperValues(q), a = q.calc(v), num = numOf(e.id);
    var p = el('section', 'ex prob'); p.id = 'p' + n + '-' + (i + 1);
    var pp = paperOf(q);
    p.appendChild(el('div', 'qtext', '<span class="lead">Problem ' + num + '</span> <span class="ref">(' + q.src.label + ', ' + q.src.marks + ')</span>. <b>' + q.title + '.</b>'));
    if (pp) p.appendChild(el('figure', 'paper', '<img src="' + pp.img + '" alt="' + q.src.label + ' as printed on the exam paper"><figcaption>From the exam paper: ' + q.src.label + ', page ' + pp.page + '</figcaption>'));
    p.appendChild(el('div', 'spot', '<b>What\'s new here</b><ul>' + e.spot.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>'));
    if (e.mine) p.appendChild(el('div', 'mine', '<b>✎ My notes</b>' + e.mine.map(function (t) { return '<p>' + t + '</p>'; }).join('')));
    var sol = el('div', 'sol', '<div class="lab">Solution.</div>');
    steps(q, v, a).forEach(function (s, k) { sol.appendChild(el('div', 'step', '<span class="n">' + (k + 1) + '.</span><div><h3>' + s.t + '</h3>' + s.b + '</div>')); });
    sol.appendChild(el('div', 'ans', '<span class="l">Answer.</span>' + q.answers.map(function (an) { return an.label + ' = <b>' + U.si(a[an.k], an.unit) + '</b>'; }).join(' &nbsp;·&nbsp; ')));
    p.appendChild(sol);
    doc.appendChild(p);
  });
  }
  var root = document.getElementById('doc');
  root.dataset.section.split(',').forEach(function (n) { build(+n, root); });

  // shrink any display equation wider than the column
  function fit() {
    [].forEach.call(document.querySelectorAll('.m'), function (m) { m.style.fontSize = ''; var k = m.firstElementChild; if (!k) return; var need = k.scrollWidth, have = m.clientWidth - 2; if (need > have && have > 40) m.style.fontSize = Math.max(55, Math.floor(100 * have / need)) + '%'; });
  }
  fit(); window.addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
