// EEEN Lock-In — same layout as MATH_Lock-In: contents on the left, one problem per screen,
// steps revealed one at a time, Got it / Redo later, similar question with new numbers, my notes.
(function () {
  var U = window.U, LK = window.LK;
  var KEY = 'eeen.';
  function get(k, d) { try { var v = localStorage.getItem(KEY + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) { } }
  var st = get('prog2', {}), notes = get('notes', {}), sn = get('sn', '25382076'), mode = get('mode', 'core'), paperOn = get('paper', false);

  // ---------- contents: parts > topics > questions, built from the question data ----------
  var RULES = '<dl class="rules">' + LK.rules.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; }).join('') + '</dl>';
  var INSIGHT = '<ul class="ins">' +
    '<li><b>Q2 is always a transfer function</b> (50 marks). Nine of ten use an op-amp. Topics 3 and 5 deserve the most time.</li>' +
    '<li><b>Each resit reuses the autumn circuits</b> and asks for a different quantity (AUT24 → SPR25, AUT23 → SPR24, and so on). Learn every quantity in each circuit, not just the one asked.</li>' +
    '<li><b>The autumn paper changes most years.</b> AUT25 brought in a controlled-source Thévenin, a bridge rectifier and a square wave into RC. Expect one or two new twists on the same six topics.</li>' +
    '<li><b>Q3 rotates:</b> diodes (5 papers), g<sub>m</sub> amplifier (2), transformer with RLC load (2), RC square wave (1).</li>' +
    '<li>Every paper has a DC part, a transient part and a diode part.</li></ul>';
  var qs = function (ids) { return ids.map(function (id) { return LK.byId[id]; }); };
  var DATA = { core: [], papers: [], off: [] };
  LK.topics.forEach(function (t) {
    var topics = [{ title: 'Core questions', src: t.where + ' · one of each exam-style variation', cards: t.cards, label: 'Notes — learn it first', open: true, qs: qs(t.core) }];
    if (t.more.length) topics.push({ title: 'More of the same', src: t.where + ' · the rest of the past-paper parts', cards: t.cards, label: 'Notes', qs: qs(t.more) });
    DATA.core.push({ title: t.name, topics: topics });
  });
  DATA.core.push({ title: 'Mock exams', topics: LK.mocks.map(function (m) {
    return { title: m.name, src: '7 parts · 200 marks · 120 minutes · new numbers, same style as the real papers', html: RULES, label: 'Exam rules and pacing', open: true, qs: qs(m.qs) };
  }) });
  LK.papers.forEach(function (p, i) {
    DATA.papers.push({ title: p.code, topics: [{ title: p.name, src: 'Past paper, in order, fully worked', html: RULES + '<p><b>What the papers tell you</b></p>' + INSIGHT, label: 'Exam rules and pacing', open: i === 0, qs: qs(p.qs) }] });
  });
  DATA.off.push({ title: 'Homework 0', topics: [{ title: 'Practice sheet', src: 'Homework 0 · single-skill warm-ups for Topic 1', label: 'Why this is off the exam path', open: true,
    html: '<p>The Homework 0 questions are single-skill versions of Topic 1 (DC circuits). The exam path uses the exam versions instead, so these sit here as warm-ups.</p><p>The LTspice parts of the homework are left out. The exam is on paper, so you cannot be asked to simulate.</p><p>Only Homework 0 has been added so far.</p>',
    qs: qs(LK.homework.ids) }] });
  DATA.off.push({ title: 'Basics drills', topics: [{ title: 'Basics drills', src: 'Random numbers every time', cards: LK.topics[0].cards, label: 'Notes', qs: qs(LK.homework.drills) }] });
  if (!DATA[mode]) mode = 'core';

  var list, cur = 0, shown = 0, sim = false, vals = null, steps = null, ansr = null;
  function load() {
    list = [];
    DATA[mode].forEach(function (p, pi) { p.topics.forEach(function (t, ti) { t.qs.forEach(function (q, qi) {
      list.push({ p: p, t: t, q: q, pi: pi + 1, ti: ti + 1, qi: qi + 1, num: (pi + 1) + '.' + (ti + 1) + '.' + (qi + 1), first: qi === 0 });
    }); }); });
  }
  function restore() { cur = 0; var h = get('at-' + mode, null); for (var i = 0; i < list.length; i++) if (list[i].q.id === h) { cur = i; break; } }
  load(); restore();

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  var col = function (pi) { return 'c' + ((pi - 1) % 6 + 1); };
  var fn = function (x, v) { return typeof x === 'function' ? x(v) : x || ''; };
  var isDrill = function (q) { return q.src.type === 'drill'; };
  function short(q) { return isDrill(q) ? q.title : mode === 'core' && q.src.type === 'exam' ? q.src.label.replace(' · ', ' ') : q.src.label.split(' · ').pop(); }
  function refOf(q) { return isDrill(q) ? 'Basics drill' : q.src.label + (q.src.marks ? ', ' + q.src.marks : ''); }
  function mark(id) { return st[id] === 'got' ? '✓' : st[id] === 'redo' ? '↺' : ''; }
  // shrink any display equation wider than the page
  function fit(root) {
    [].forEach.call(root.querySelectorAll('.m'), function (m) { m.style.fontSize = ''; var k = m.firstElementChild; if (!k) return; var need = k.scrollWidth, have = m.clientWidth - 2; if (need > have && have > 40) m.style.fontSize = Math.max(55, Math.floor(100 * have / need)) + '%'; });
  }
  window.addEventListener('resize', function () { fit(document); });

  // ---------- numbers ----------
  function hasSym(q) { return Object.keys(q.params).some(function (k) { return q.params[k].sym; }); }
  function paperValues(q) {
    var sym = U.symbols(sn, q.symset || 'exam'), v = {};
    Object.keys(q.params).forEach(function (k) { var p = q.params[k]; v[k] = p.sym ? +(p.base + sym[p.sym] * p.step).toPrecision(12) : p.base; });
    return v;
  }
  function randValues(q) { var v = {}; Object.keys(q.params).forEach(function (k) { var p = q.params[k]; v[k] = p.rand ? p.rand() : p.base; }); return v; }
  var NICE = { Rl: 'R<sub>load</sub>', Ll: 'L<sub>load</sub>', Cl: 'C<sub>load</sub>', beta: 'β', om: 'ω' };
  function nm(k) { return NICE[k] || (k.length === 1 ? k : k.replace(/^([A-Za-z])(.+)$/, '$1<sub>$2</sub>')); }
  function given(q, v, mine) {
    if (q.hideGiven) return '';
    var items = Object.keys(q.params).filter(function (k) { return (q.hideParams || []).indexOf(k) < 0; }).map(function (k) {
      var p = q.params[k];
      return '<span class="gv">' + nm(k) + ' = <b>' + U.given(v[k], p.unit) + '</b>' + (mine && p.sym ? ' <span class="sym">(' + U.given(p.base, p.unit) + ' + ' + p.sym + ')</span>' : '') + '</span>';
    });
    return items.length ? '<div class="given"><span class="gl">Given</span>' + items.join('') + '</div>' : '';
  }
  // work the current problem: values, steps and answer
  function work() {
    var q = list[cur].q;
    if (!vals) vals = (sim || isDrill(q)) ? randValues(q) : paperValues(q);
    var a = q.calc(vals), t = document.createElement('template');
    t.innerHTML = q.sol(vals, a, q);
    steps = [];
    [].forEach.call(t.content.children, function (c) {
      if (q.src.type === 'mock' && c.classList.contains('flagbox')) return;
      if (c.classList.contains('step')) {
        var h = c.querySelector('h4'), title = h ? h.innerHTML.replace(/^\d+\s*·\s*/, '') : ''; if (h) h.remove();
        steps.push({ t: title, b: c.innerHTML });
      } else if (steps.length) steps[steps.length - 1].b += c.outerHTML;
      else steps.push({ t: 'Before you start', b: c.outerHTML });
    });
    ansr = q.answers.map(function (an) { return an.label + ' = <b>' + U.si(a[an.k], an.unit) + '</b>'; }).join(' &nbsp;·&nbsp; ') +
      (q.src.basedOn ? '<span class="like">Same style as ' + q.src.basedOn + '.</span>' : '');
  }

  // ---------- exam paper view: the question exactly as printed, in a split screen ----------
  function paperOf(q) {
    var s = q.src.type === 'exam' ? q.src : q.src.baseId && LK.byId[q.src.baseId] ? LK.byId[q.src.baseId].src : null;
    if (!s || !s.paper || !s.q) return null;
    var key = s.paper + '-' + s.q.replace(/[()]/g, ''), pg = (LK.paperPages || {})[key];
    var pp = LK.papers.filter(function (x) { return x.code === s.paper; })[0];
    if (!pg || !pp) return null;
    return { key: key, label: s.label, page: pg, name: pp.name, pdf: pp.file, img: 'papers/q/' + key + '.png', mock: q.src.type === 'mock' };
  }
  var pane = el('aside', ''); pane.id = 'paper'; pane.hidden = true; document.body.appendChild(pane);
  function togglePaper() { if (!paperOf(list[cur].q)) return; paperOn = !paperOn; set('paper', paperOn); render(); }
  function showPaper() {
    var r = paperOf(list[cur].q), on = paperOn && !!r;
    document.body.classList.toggle('split', on); pane.hidden = !on;
    if (!on || pane.dataset.key === r.key + r.mock) return;
    pane.dataset.key = r.key + r.mock;
    pane.innerHTML = '<div class="ph"><div><b>' + r.label + '</b> <span>as printed on the exam paper</span><small>' + r.name + ' · page ' + r.page + '</small></div>' +
      '<button class="b" aria-label="Close the exam paper">✕</button></div>' +
      (r.mock ? '<p class="mk">This mock question copies this exam question. The layout is the same; your numbers are different.</p>' : '') +
      '<img src="' + r.img + '" alt="' + r.label + ' as printed on the exam paper">' +
      '<a class="pdf" href="' + r.pdf + '#page=' + r.page + '" target="_blank" rel="noopener">Open the whole paper at page ' + r.page + ' ↗</a>';
    pane.querySelector('button').onclick = togglePaper;
    pane.scrollTop = 0;
  }

  function go(i) { cur = Math.max(0, Math.min(list.length - 1, i)); shown = 0; sim = false; vals = null; document.getElementById('nav').classList.remove('open'); render(); window.scrollTo(0, 0); }
  function similar() { sim = true; vals = null; shown = 0; render(); window.scrollTo(0, 0); }
  function original() { if (!sim) return; sim = false; vals = null; shown = 0; render(); window.scrollTo(0, 0); }

  function nav() {
    var n = document.getElementById('nav'), keep = n.scrollTop; n.innerHTML = '';
    var ids = {}, done = 0; list.forEach(function (x) { if (!ids[x.q.id]) { ids[x.q.id] = 1; if (st[x.q.id] === 'got') done++; } }); var total = Object.keys(ids).length;
    n.appendChild(el('h1', '', 'EEEN Lock-In'));
    n.appendChild(el('div', 'sub sc', 'eeen20020 · electrical &amp; electronic circuits'));
    var ms = el('div', 'mode');
    [['core', 'Exam path'], ['papers', 'Past papers'], ['off', 'Off path']].forEach(function (m) {
      var b = el('button', mode === m[0] ? 'on' : '', m[1]);
      b.onclick = function () { if (mode === m[0]) return; mode = m[0]; set('mode', mode); load(); restore(); shown = 0; sim = false; vals = null; render(); window.scrollTo(0, 0); };
      ms.appendChild(b);
    });
    n.appendChild(ms);
    n.appendChild(el('div', 'prog', '<span>' + done + ' / ' + total + '</span><span class="bar"><i style="width:' + (100 * done / total) + '%"></i></span>'));
    n.appendChild(el('div', 'toc-h sc', 'contents'));
    var lastP = null, lastT = null;
    list.forEach(function (x, i) {
      if (x.p !== lastP) { lastP = x.p; n.appendChild(el('div', 'part ' + col(x.pi), '<span class="num">' + x.pi + '</span><span>' + x.p.title + '</span>')); }
      if (x.t !== lastT) { lastT = x.t; n.appendChild(el('div', 'topic ' + col(x.pi), '<span class="num">' + x.pi + '.' + x.ti + '</span><span>' + x.t.title + '</span>')); }
      var big = x.q.src.marks === '50 marks';
      var b = el('button', 'qlink ' + col(x.pi) + (big ? ' big' : '') + (i === cur ? ' on' : '') + (st[x.q.id] ? ' ' + st[x.q.id] : ''),
        '<span class="num">' + x.num + '</span><span class="r">' + short(x.q) + '</span>' + (notes[x.q.id] ? '<span class="nt" title="You wrote a note">✎</span>' : '') + '<span class="m">' + mark(x.q.id) + '</span>');
      b.onclick = function () { go(i); };
      n.appendChild(b);
    });
    var cut = { core: '<i>Six topics cover every question on all 10 past papers (2021 to 2025).</i> Bold = a 50-mark question (Q2 or Q3). Do the two mocks last: timed, on paper.',
      papers: '<i>Every past paper in order, newest first.</i> These are the same questions as the exam path, so your ticks carry over.',
      off: '<i>Only if you need the warm-up.</i> Single-skill DC questions. Finish the exam path first.' }[mode];
    n.appendChild(el('div', 'cut', cut));
    var sb = el('label', 'snbox', 'Student number (sets α…λ on the 2021–22 papers and the homework)');
    var inp = document.createElement('input'); inp.inputMode = 'numeric'; inp.maxLength = 8; inp.value = sn;
    inp.onchange = function () { sn = inp.value.replace(/\D/g, '').slice(0, 8); set('sn', sn); vals = null; shown = 0; render(); };
    sb.appendChild(inp); n.appendChild(sb);
    n.scrollTop = keep;
    var on = n.querySelector('.qlink.on');
    if (on) { var r = on.getBoundingClientRect(), nr = n.getBoundingClientRect(); if (r.top < nr.top + 40 || r.bottom > nr.bottom - 20) n.scrollTop += r.top - nr.top - nr.height / 3; }
  }

  function notesBox(x) {
    var t = x.t, d = el('details', 'notes', '<summary>' + t.label + '</summary>'), db = el('div', 'body');
    if (t.html) db.innerHTML = t.html;
    if (t.cards) t.cards().forEach(function (c, k) {
      var cd = el('details', 'card', '<summary>' + c.h + '</summary>'), cb = el('div', 'cb', c.body);
      if (c.check) {
        var ck = el('div', 'check', '<span class="h">Check.</span> ' + c.check.q), b = el('button', 'b', 'Show answer'), ca = el('div', 'ca', c.check.a);
        ca.hidden = true; b.onclick = function () { ca.hidden = false; b.hidden = true; }; ck.appendChild(b); ck.appendChild(ca); cb.appendChild(ck);
      }
      cd.appendChild(cb); if (k === 0) cd.open = true;
      cd.addEventListener('toggle', function () { if (cd.open) fit(cd); });
      db.appendChild(cd);
    });
    d.appendChild(db);
    if (t.open && x.first && !sim) d.open = true;
    d.addEventListener('toggle', function () { if (d.open) fit(d); });
    return d;
  }

  function render() {
    set('at-' + mode, list[cur].q.id);
    nav();
    var x = list[cur], q = x.q, v = document.getElementById('view'); v.innerHTML = ''; v.className = col(x.pi);
    work();
    var rand = sim || isDrill(q);
    v.appendChild(el('div', 'head', '<span class="sc">' + x.pi + ' · ' + x.p.title.toLowerCase() + '</span><span>Problem <b>' + (cur + 1) + '</b> of ' + list.length + '</span>'));
    v.appendChild(el('h2', '', '<span class="num">' + x.pi + '.' + x.ti + '</span>' + x.t.title));
    v.appendChild(el('div', 'src', x.t.src));
    v.appendChild(notesBox(x));

    var pr = el('div', 'prob'), ref = paperOf(q);
    if (ref) {
      var pb = el('button', 'b paperb' + (paperOn ? ' on' : ''), paperOn ? '✕ Hide exam paper' : (ref.mock ? '▤ See the original exam question' : '▤ See it on the exam paper'));
      pb.title = 'Opens the question exactly as it looks on the real paper, side by side (shortcut: P)'; pb.onclick = togglePaper; pr.appendChild(pb);
    }
    if (sim) pr.appendChild(el('div', 'simtag', 'Similar question · same method, new numbers'));
    pr.appendChild(el('div', 'qtext', '<span class="lead">Problem ' + x.num + (sim ? '′' : '') + '</span> <span class="ref">(' + (sim ? 'like ' : '') + refOf(q) + ')</span>. <b>' + q.title + '.</b>' +
      (q.note ? '<p>' + fn(q.note, vals) + '</p>' : '') + (q.lead ? '<p>' + fn(q.lead, vals) + '</p>' : '') + '<p>' + fn(q.ask, vals) + '</p>'));
    pr.appendChild(el('div', '', given(q, vals, !rand && hasSym(q))));
    pr.appendChild(el('div', 'fig', q.fig(vals)));
    if (q.form) pr.appendChild(el('p', 'form', 'Answer format: ' + q.form));
    v.appendChild(pr);

    var n = steps.length, all = shown > n;
    if (shown === 0) v.appendChild(el('div', 'try', 'Try it on paper first, then reveal one step at a time.'));
    if (shown > 0) {
      var sol = el('div', 'sol', '<div class="lab">Solution.</div>');
      steps.slice(0, shown).forEach(function (s, i) { sol.appendChild(el('div', 'step', '<span class="n">' + (i + 1) + '.</span><div><h3>' + s.t + '</h3>' + s.b + '</div>')); });
      if (all) { sol.appendChild(el('div', 'ans', '<span class="l">Answer.</span>' + ansr)); sol.appendChild(el('div', 'qed', '∎')); }
      v.appendChild(sol);
    }
    var row = el('div', 'row');
    if (!all) {
      var b1 = el('button', 'b pri', shown === 0 ? 'Show step 1' : (shown < n ? 'Next step (' + (shown + 1) + '/' + n + ')' : 'Show answer'));
      b1.onclick = function () { shown++; render(); }; row.appendChild(b1);
      var b2 = el('button', 'b', 'Full solution'); b2.onclick = function () { shown = n + 1; render(); }; row.appendChild(b2);
    } else {
      var g = el('button', 'b ok', '✓ Got it'); g.onclick = function () { st[q.id] = 'got'; set('prog2', st); go(cur + 1); }; row.appendChild(g);
      var a = el('button', 'b warn', '↺ Redo later'); a.onclick = function () { st[q.id] = 'redo'; set('prog2', st); go(cur + 1); }; row.appendChild(a);
      var h = el('button', 'b', 'Hide solution'); h.onclick = function () { shown = 0; render(); }; row.appendChild(h);
    }
    var sb = el('button', 'b simb', sim || isDrill(q) ? 'New numbers ↻' : 'Similar question ↻'); sb.onclick = similar; row.appendChild(sb);
    if (sim && !isDrill(q)) { var ob = el('button', 'b simb', '← Back to original'); ob.onclick = original; row.appendChild(ob); }
    v.appendChild(row);

    var nb = el('div', 'mynotes', '<label for="note">✎ My notes on this question</label>');
    var ta = document.createElement('textarea'); ta.id = 'note'; ta.rows = 3; ta.placeholder = 'Type anything you want to remember here. It saves by itself.'; ta.value = notes[q.id] || '';
    function grow() { ta.style.height = 'auto'; ta.style.height = (ta.scrollHeight + 2) + 'px'; }
    ta.oninput = function () { var had = !!notes[q.id]; if (ta.value.trim()) notes[q.id] = ta.value; else delete notes[q.id]; set('notes', notes); grow(); if (had !== !!notes[q.id]) nav(); };
    nb.appendChild(ta); v.appendChild(nb); setTimeout(grow, 0);

    var pg = el('div', 'pager');
    function lbl(i) { var y = list[i]; return '<span>' + y.num + ' · ' + y.t.title + '</span><small>' + short(y.q) + '</small>'; }
    var pv = el('button', 'pv' + (cur > 0 ? ' ' + col(list[cur - 1].pi) : ''), cur > 0 ? '<small>← Previous</small>' + lbl(cur - 1) : ''); pv.disabled = cur === 0; pv.onclick = function () { go(cur - 1); }; pg.appendChild(pv);
    var nx = el('button', 'nx' + (cur < list.length - 1 ? ' ' + col(list[cur + 1].pi) : ''), cur < list.length - 1 ? '<small>Next →</small>' + lbl(cur + 1) : ''); nx.disabled = cur === list.length - 1; nx.onclick = function () { go(cur + 1); }; pg.appendChild(nx);
    v.appendChild(pg);
    v.appendChild(el('div', 'keys', 'Space: next step · A: full solution · S: similar question (new numbers) · O: back to original · P: exam paper · ← / →: previous / next problem'));
    showPaper();
    fit(v);
    if (shown > 0) { var last = v.querySelector('.ans') || v.querySelectorAll('.sol > .step')[shown - 1]; if (last && last.scrollIntoView) last.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  }

  document.getElementById('menu').onclick = function () { document.getElementById('nav').classList.toggle('open'); };
  document.addEventListener('keydown', function (e) {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
    var n = steps ? steps.length : 0;
    if (e.key === ' ') { e.preventDefault(); if (shown <= n) { shown++; render(); } }
    else if (e.key === 'a' || e.key === 'A') { shown = n + 1; render(); }
    else if (e.key === 's' || e.key === 'S') similar();
    else if (e.key === 'o' || e.key === 'O') original();
    else if (e.key === 'p' || e.key === 'P') togglePaper();
    else if (e.key === 'ArrowRight') go(cur + 1);
    else if (e.key === 'ArrowLeft') go(cur - 1);
  });
  render();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fit(document); });
})();
