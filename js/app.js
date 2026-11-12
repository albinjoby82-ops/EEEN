// EEEN20020 Lock-In — single-page app: exam path, sample exams, mocks, all homework, exam map.
(function () {
  const { U, LK } = window;
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const store = {
    get(k, d) { try { const v = localStorage.getItem('eeen.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('eeen.' + k, JSON.stringify(v)); } catch (e) { } },
  };
  const state = { sn: store.get('sn', '25382076'), prog: store.get('prog2', {}), active: null, pdf: false };
  const topic = (id) => LK.topics.find(t => t.id === id);
  const examQs = LK.Q.filter(q => q.src.type === 'exam');
  const got = (ids) => ids.filter(id => state.prog[id] === 'got').length;
  const minutes = (q) => (q.src.marks === '50 marks' ? 30 : 12);

  // shrink any display equation wider than the screen
  function fit(el) {
    $$('.m', el).forEach(m => { m.style.fontSize = ''; const k = m.firstElementChild; if (!k) return; const need = k.scrollWidth, have = m.clientWidth - 2; if (need > have && have > 40) m.style.fontSize = Math.max(55, Math.floor(100 * have / need)) + '%'; });
  }
  window.addEventListener('resize', () => fit(document));

  // ---------- values ----------
  const hasSym = (q) => Object.values(q.params).some(p => p.sym);
  function paperValues(q) {
    const sym = U.symbols(state.sn, q.symset || 'exam'), v = {};
    for (const [k, p] of Object.entries(q.params)) v[k] = p.sym ? +(p.base + sym[p.sym] * p.step).toPrecision(12) : p.base;
    return v;
  }
  function randValues(q) { const v = {}; for (const [k, p] of Object.entries(q.params)) v[k] = p.rand ? p.rand() : p.base; return v; }
  const NICE = { Rl: 'R<sub>load</sub>', Ll: 'L<sub>load</sub>', Cl: 'C<sub>load</sub>', beta: 'β', om: 'ω' };
  const nm = (k) => NICE[k] || (k.length === 1 ? k : k.replace(/^([A-Za-z])(.+)$/, '$1<sub>$2</sub>'));
  function givenList(q, v, mine) {
    if (q.hideGiven) return '';
    const items = Object.entries(q.params).filter(([k]) => !(q.hideParams || []).includes(k)).map(([k, p]) =>
      `<span class="gv">${nm(k)} = <b>${U.given(v[k], p.unit)}</b>${mine && p.sym ? ` <span class="sym">(${U.given(p.base, p.unit)} + ${p.sym})</span>` : ''}</span>`);
    return items.length ? `<div class="given">${items.join('')}</div>` : '';
  }
  const fn = (x, v) => (typeof x === 'function' ? x(v) : x || '');
  const srcBadge = (q) => `<span class="badge ${q.src.type}">${q.src.type === 'drill' ? 'Drill' : q.src.label}</span>`;
  const statusIcon = (id) => (state.prog[id] === 'got' ? '<span class="st got" title="Got it">✓</span>' : state.prog[id] === 'redo' ? '<span class="st redo" title="Need to redo">↻</span>' : '<span class="st none"></span>');

  // ---------- one question ----------
  function qcard(q, opts = {}) {
    const d = h(`<details class="q" id="q-${q.id}" data-id="${q.id}"><summary>${statusIcon(q.id)}<span class="qs-main">${opts.lab ? `<span class="qlab">${opts.lab}</span>` : srcBadge(q)}<span class="qt">${q.title}</span></span>${q.src.marks ? `<span class="marks">${q.src.marks}</span>` : ''}</summary></details>`);
    let built = false;
    d.addEventListener('toggle', () => { if (d.open) { if (!built) { built = true; build(d, q, opts); } setActive(d); } });
    return d;
  }
  function setActive(d) { if (state.active && state.active !== d) state.active.classList.remove('active'); state.active = d; d.classList.add('active'); }

  function build(d, q, opts) {
    let mine = q.src.type !== 'drill', v = mine ? paperValues(q) : randValues(q), hintN = 0, stepN = 0;
    const body = h('<div class="qb"></div>'); d.append(body);
    d.addEventListener('click', () => setActive(d));

    function render() {
      const a = q.calc(v); hintN = 0; stepN = 0;
      const tp = topic(q.topic);
      body.innerHTML = `
        ${opts.hideTopic ? '' : `<div class="tags">${tp ? `<a class="tag t" href="#t-${tp.id}">Topic ${tp.n} · ${tp.name}</a>` : ''}${(q.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}${q.src.type !== 'drill' && q.src.marks ? `<span class="tag time">≈ ${minutes(q)} min</span>` : ''}</div>`}
        ${givenList(q, v, mine && hasSym(q))}
        ${q.note ? `<p class="note">${fn(q.note, v)}</p>` : ''}
        ${q.lead ? `<p class="lead">${fn(q.lead, v)}</p>` : ''}
        <p class="ask">${fn(q.ask, v)}</p>
        <div class="fig">${q.fig(v)}</div>
        ${q.form ? `<p class="form">Answer format: ${q.form}</p>` : ''}
        <form class="ans">${q.answers.map(an => { const pf = U.pick(a[an.k], an.unit);
          return `<label class="arow"><span class="al">${an.label}</span><span class="ain"><input inputmode="text" autocomplete="off" autocapitalize="off" data-k="${an.k}" data-scale="${pf[0]}" placeholder="?"><span class="au">${pf[1]}${an.unit}</span><span class="res" data-r="${an.k}"></span></span></label>`; }).join('')}
          <div class="btns"><button class="b pri" type="submit">Check</button><button class="b" type="button" data-act="hint">Hint <kbd>H</kbd></button>
          <button class="b" type="button" data-act="scramble">🎲 New numbers <kbd>S</kbd></button>
          ${q.src.type === 'drill' ? '' : `<button class="b ghost" type="button" data-act="paper">${hasSym(q) ? 'My numbers' : q.src.type === 'mock' ? 'Mock numbers' : q.src.type === 'hw' ? 'Sheet numbers' : 'Paper numbers'}</button>`}</div>
        </form>
        <div class="hints"></div>
        <div class="solwrap"><div class="solbar"><button class="b step" type="button" data-act="next">Show step 1 <kbd>N</kbd></button><button class="b ghost" type="button" data-act="all">Show all <kbd>A</kbd></button><span class="stepc"></span></div><div class="sol"></div></div>
        <div class="mark"><button class="b gotb" type="button" data-act="got">✓ Got it <kbd>G</kbd></button><button class="b redob" type="button" data-act="redo">↻ Need to redo <kbd>R</kbd></button></div>`;
      const sol = $('.sol', body);
      sol.innerHTML = q.sol(v, a, q) + `<div class="final"><b>Answer</b> ${q.answers.map(an => `${an.label} = <b>${U.si(a[an.k], an.unit)}</b>`).join(' · ')}${q.src.basedOn ? `<br><span class="muted">Same style as ${q.src.basedOn}.</span>` : ''}</div>`;
      if (q.src.type === 'mock') $$('.flagbox', sol).forEach(e => e.remove());
      const parts = [...sol.children]; parts.forEach(p => { p.hidden = true; });
      const nextB = $('[data-act=next]', body), stepc = $('.stepc', body);
      const upd = () => { nextB.disabled = stepN >= parts.length; nextB.innerHTML = stepN >= parts.length ? 'All steps shown' : (stepN ? 'Next step' : 'Show step 1') + ' <kbd>N</kbd>'; stepc.textContent = stepN ? `${Math.min(stepN, parts.length)} of ${parts.length}` : `${parts.length} steps`; };
      const reveal = (n) => { while (stepN < Math.min(n, parts.length)) { parts[stepN].hidden = false; fit(parts[stepN]); stepN++; } upd(); };
      const mark = (s) => { if (state.prog[q.id] === s) delete state.prog[q.id]; else state.prog[q.id] = s; store.set('prog2', state.prog); paintMark(); refreshProgress(); };
      const paintMark = () => { $('.gotb', body).classList.toggle('on', state.prog[q.id] === 'got'); $('.redob', body).classList.toggle('on', state.prog[q.id] === 'redo'); const s = $('summary .st', d); if (s) s.outerHTML = statusIcon(q.id); };
      const api = {
        next() { if (stepN < parts.length) { reveal(stepN + 1); parts[stepN - 1].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } },
        all() { reveal(parts.length); },
        hint() { const hs = q.hints || []; if (hintN < hs.length) { $('.hints', body).append(h(`<p class="hint"><b>Hint ${hintN + 1}</b> ${hs[hintN]}</p>`)); hintN++; } if (hintN >= hs.length) $('[data-act=hint]', body).disabled = true; },
        scramble() { v = randValues(q); mine = false; render(); },
        paper() { v = paperValues(q); mine = true; render(); },
        got() { mark('got'); }, redo() { mark('redo'); },
      };
      d._api = api; upd(); paintMark();
      $$('[data-act]', body).forEach(b => b.addEventListener('click', (e) => { e.stopPropagation(); setActive(d); api[b.dataset.act](); }));
      if (!(q.hints || []).length) $('[data-act=hint]', body).hidden = true;
      $('.ans', body).addEventListener('submit', (e) => {
        e.preventDefault();
        $$('input[data-k]', body).forEach(inp => {
          const k = inp.dataset.k, r = $(`[data-r="${k}"]`, body);
          if (!inp.value.trim()) { r.textContent = ''; return; }
          const u = U.parse(inp.value, +inp.dataset.scale), ok = U.close(u, a[k], 0.011), signOnly = !ok && U.close(-u, a[k], 0.011);
          r.className = 'res ' + (ok ? 'ok' : 'bad'); r.textContent = ok ? '✓' : signOnly ? '✗ check the sign' : '✗';
        });
      });
      fit(body);
    }
    render();
  }

  const qlist = (ids, opts = {}) => { const el = h('<div class="qlist"></div>'); ids.forEach((id, i) => el.append(qcard(LK.byId[id], typeof opts === 'function' ? opts(LK.byId[id], i) : opts))); return el; };
  const bar = (n, of) => `<span class="pbar" title="${n} of ${of}"><i style="width:${of ? 100 * n / of : 0}%"></i></span><span class="pnum">${n} / ${of}</span>`;
  const rulesBox = () => `<details class="rules"><summary>Exam rules and pacing</summary><dl>${LK.rules.map(r => `<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('')}</dl></details>`;

  // ---------- views ----------
  const views = {
    path() {
      const ids = examQs.map(q => q.id);
      const el = h(`<section><div class="hero"><h2>Exam path</h2><p>Six topics cover <b>every question on all 10 past papers</b>. Work down the list.</p>
        <p class="how"><b>How to use it:</b> try the question → hint → reveal the steps one at a time → mark <b>Got it</b> or <b>Need to redo</b> → hit 🎲 and do it again with new numbers.</p>
        <div class="heroprog">${bar(got(ids), ids.length)} past-paper parts done</div></div><div class="tlist"></div></section>`);
      LK.topics.forEach(t => { const all = t.core.concat(t.more);
        $('.tlist', el).append(h(`<a class="tcard" href="#t-${t.id}"><span class="tn">${t.n}</span><span class="tmain"><b>${t.name}</b><span class="tsub">${t.sub}</span><span class="twhere">${t.where}</span><span class="tprog">${bar(got(all), all.length)}</span></span></a>`)); });
      return el;
    },
    topic(id) {
      const t = topic(id); if (!t) return views.path();
      const nx = LK.topics[LK.topics.indexOf(t) + 1];
      const el = h(`<section><a class="back" href="#path">← Exam path</a><div class="thead"><span class="tn big">${t.n}</span><div><h2>${t.name}</h2><p class="muted">${t.where}</p></div></div>
        <h3 class="sec">Learn it</h3><div class="learn"></div>
        <h3 class="sec">Core questions <span class="muted">one of each exam-style variation</span></h3><div class="core"></div>
        <details class="more"><summary>More of the same <span class="muted">(${t.more.length} more past-paper parts)</span></summary></details>
        ${nx ? `<a class="b pri big nextt" href="#t-${nx.id}">Next: Topic ${nx.n} · ${nx.name} →</a>` : `<a class="b pri big nextt" href="#exams">Next: Sample exams →</a>`}</section>`);
      t.cards().forEach((c, k) => { const cd = h(`<details class="lcard" ${k === 0 ? 'open' : ''}><summary>${c.h}</summary><div class="lbody">${c.body}${c.check ? `<div class="check"><b>Quick check</b> ${c.check.q}<button class="b sm">Show answer</button><p class="ca" hidden>${c.check.a}</p></div>` : ''}</div></details>`);
        const cb = $('.check button', cd); if (cb) cb.onclick = () => { $('.ca', cd).hidden = false; cb.remove(); };
        cd.addEventListener('toggle', () => cd.open && fit(cd)); $('.learn', el).append(cd); });
      $('.core', el).append(qlist(t.core)); $('.more', el).append(qlist(t.more));
      return el;
    },
    exams() {
      const el = h(`<section><h2>Sample exams</h2><p class="muted">Every past paper, fully worked. Newest first: recent papers are the best guide to yours.</p>${rulesBox()}<div class="plist"></div></section>`);
      LK.papers.forEach(p => $('.plist', el).append(h(`<a class="prow" href="#p-${p.code.toLowerCase()}"><b>${p.code}</b><span class="pname">${p.name}</span><span class="tprog">${bar(got(p.qs), p.qs.length)}</span></a>`)));
      return el;
    },
    paper(code) {
      const p = LK.papers.find(x => x.code.toLowerCase() === code); if (!p) return views.exams();
      const el = h(`<section><a class="back" href="#exams">← Sample exams</a><h2>${p.code} · ${p.name}</h2>${state.pdf ? `<p><a href="${p.file}" target="_blank" rel="noopener">Open the original paper (PDF)</a></p>` : ''}${rulesBox()}<div class="pq"></div></section>`);
      $('.pq', el).append(qlist(p.qs, (q) => ({ lab: `Q${q.src.q}` })));
      return el;
    },
    mocks() {
      const el = h(`<section><h2>Fresh mocks</h2><p>Two new papers in the same style as the real ones, with new numbers. Do them <b>after</b> the exam path: timed, on paper, then check here.</p>${rulesBox()}<div class="plist"></div></section>`);
      LK.mocks.forEach(m => $('.plist', el).append(h(`<a class="prow" href="#m-${m.code.slice(-1).toLowerCase()}"><b>${m.code}</b><span class="pname">7 parts · 200 marks · 120 min</span><span class="tprog">${bar(got(m.qs), m.qs.length)}</span></a>`)));
      return el;
    },
    mock(c) {
      const m = LK.mocks.find(x => x.code.slice(-1).toLowerCase() === c); if (!m) return views.mocks();
      const el = h(`<section><a class="back" href="#mocks">← Mocks</a><h2>${m.name}</h2><div class="timer"><button class="b pri">Start 120-minute timer</button><span class="tleft"></span></div>${rulesBox()}<div class="pq"></div></section>`);
      $('.pq', el).append(qlist(m.qs, (q) => ({ lab: `Q${q.src.q}`, hideTopic: true })));
      let tm = null; $('.timer button', el).onclick = (e) => { const end = Date.now() + 120 * 60e3; clearInterval(tm); e.target.textContent = 'Restart timer';
        const tick = () => { if (!document.body.contains(el)) return clearInterval(tm); const s = Math.max(0, Math.round((end - Date.now()) / 1000)); $('.tleft', el).textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} left`; }; tick(); tm = setInterval(tick, 1000); };
      return el;
    },
    homework() {
      const el = h(`<section><h2>All homework</h2><p class="muted">Homework 0 (the practice sheet) plus basics drills. ${state.pdf ? '<a href="homework/HW0_Homework_0_Practice.pdf" target="_blank" rel="noopener">Open the sheet (PDF)</a>' : ''}</p>
        <div class="notebox"><b>What is not on the exam path, and why</b><p>The Homework 0 questions are single-skill versions of Topic 1. The exam path uses the exam versions instead, so these sit here as warm-ups.</p>
        <p>The LTspice parts of the homework are left out. The exam is on paper, so you cannot be asked to simulate.</p><p>Only Homework 0 has been added so far. The other sheets will be sorted into the six topics when they are added.</p></div>
        <h3 class="sec">Homework 0</h3><div class="hw"></div><h3 class="sec">Basics drills <span class="muted">random numbers every time</span></h3><div class="dr"></div></section>`);
      $('.hw', el).append(qlist(LK.homework.ids)); $('.dr', el).append(qlist(LK.homework.drills));
      return el;
    },
    map() {
      const codes = LK.papers.map(p => p.code).reverse();
      let t = `<table class="radar"><thead><tr><th>Topic</th>${codes.map(c => `<th><span>${c.slice(0, 3)}</span><span>${c.slice(3)}</span></th>`).join('')}<th>Parts</th></tr></thead><tbody>`;
      LK.topics.forEach(tp => { const qs = examQs.filter(q => q.topic === tp.id);
        t += `<tr><td><a href="#t-${tp.id}"><b>${tp.n}. ${tp.name}</b></a></td>${codes.map(c => { const hit = qs.filter(q => q.src.paper === c); return `<td class="${hit.length ? 'hit' : ''}">${hit.map(q => `<span class="${q.src.q.length === 1 ? 'big50' : ''}">${q.src.q.replace('1(', '').replace(')', '')}</span>`).join(' ')}</td>`; }).join('')}<td class="sum">${qs.length}</td></tr>`; });
      t += '</tbody></table>';
      return h(`<section><h2>Exam map</h2><p class="muted">Which topic each question tested. Letters are Q1 parts (20 marks each). <b class="big50">2</b> and <b class="big50">3</b> are the 50-mark questions.</p><div class="tw">${t}</div>
        <h3 class="sec">What the papers tell you</h3><ul class="ins">
        <li><b>Q2 is always a transfer function</b> (50 marks). Nine of ten use an op-amp. Topics 3 and 5 deserve the most time.</li>
        <li><b>Each resit reuses the autumn circuits</b> and asks for a different quantity (AUT24 → SPR25, AUT23 → SPR24, and so on). Learn every quantity in each circuit, not just the one asked.</li>
        <li><b>The autumn paper changes most years.</b> AUT25 brought in a controlled-source Thévenin, a bridge rectifier and a square wave into RC. Expect one or two new twists on the same six topics.</li>
        <li><b>Q3 rotates:</b> diodes (5 papers), g<sub>m</sub> amplifier (2), transformer with RLC load (2), RC square wave (1).</li>
        <li>Every paper has a DC part, a transient part and a diode part.</li></ul></section>`);
    },
  };

  // ---------- routing ----------
  function refreshProgress() { const ids = examQs.map(q => q.id); $('#gprog').innerHTML = bar(got(ids), ids.length); }
  function route() {
    const hsh = location.hash.slice(1) || 'path'; let v, tab = hsh;
    if (hsh.startsWith('t-')) { v = views.topic(hsh.slice(2)); tab = 'path'; }
    else if (hsh.startsWith('p-')) { v = views.paper(hsh.slice(2)); tab = 'exams'; }
    else if (hsh.startsWith('m-')) { v = views.mock(hsh.slice(2)); tab = 'mocks'; }
    else if (['path', 'exams', 'mocks', 'homework', 'map'].includes(hsh)) v = views[hsh](); else { v = views.path(); tab = 'path'; }
    $$('nav.tabs a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + tab));
    state.active = null; const main = $('#main'); main.innerHTML = ''; main.append(v); fit(main); window.scrollTo(0, 0); refreshProgress();
  }
  window.addEventListener('hashchange', route);

  // ---------- keyboard ----------
  function nav(dir) {
    const all = $$('#main details.q');
    if (!all.length) return; let i = all.indexOf(state.active); i = i < 0 ? (dir > 0 ? 0 : all.length - 1) : Math.max(0, Math.min(all.length - 1, i + dir));
    if (state.active && state.active !== all[i]) state.active.open = false;
    const m = all[i].closest('details.more'); if (m) m.open = true;
    all[i].open = true; setActive(all[i]); setTimeout(() => all[i].scrollIntoView({ block: 'start', behavior: 'smooth' }), 30);
  }
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) { if (e.key === 'Escape') e.target.blur(); return; }
    const k = e.key.toLowerCase(), api = state.active && state.active.open && state.active._api;
    if (k === '?') { $('#keys').hidden = !$('#keys').hidden; return; }
    if (k === 'escape') { $('#keys').hidden = true; return; }
    if (k === 'j') return nav(1); if (k === 'k') return nav(-1);
    if (!api) return;
    const map = { n: 'next', ' ': 'next', a: 'all', h: 'hint', g: 'got', r: 'redo', s: 'scramble' };
    if (map[k]) { e.preventDefault(); api[map[k]](); }
  });

  // ---------- boot ----------
  const sn = $('#sn'); sn.value = state.sn;
  sn.onchange = () => { state.sn = sn.value.replace(/\D/g, '').slice(0, 8); store.set('sn', state.sn); route(); };
  $('#ver').textContent = 'data ' + LK.version;
  $('#keybtn').onclick = () => { $('#keys').hidden = !$('#keys').hidden; };
  $('#keys').onclick = () => { $('#keys').hidden = true; };
  fetch('papers/2025_AUT_EEEN20020.pdf', { method: 'HEAD' }).then(r => { if (r.ok && /pdf/.test(r.headers.get('content-type') || '')) { state.pdf = true; if (/^(p-|homework)/.test(location.hash.slice(1))) route(); } }).catch(() => { });
  route();
})();
