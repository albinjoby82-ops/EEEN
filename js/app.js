(function () {
  const { U } = window;
  const $ = (s, el = document) => el.querySelector(s);
  const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const store = {
    get(k, d) { try { const v = localStorage.getItem('eeen.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('eeen.' + k, JSON.stringify(v)); } catch (e) { } },
  };
  const state = {
    sheet: store.get('sheet', 's0'),
    sn: store.get('sn', '25382076'),
    progress: store.get('progress', {}),
    qTopic: 'all',
    practice: { topics: [], kinds: { hw: true, exam: true, drill: true }, deck: [], i: 0, score: 0, done: 0 },
  };
  const sheet = () => window.SHEETS.find(s => s.id === state.sheet) || window.SHEETS[0];
  const topicName = (id) => (sheet().topics.find(t => t.id === id) || {}).short || id;

  function typeset(el) {
    const run = () => window.MathJax.typesetPromise([el]).then(() => fit(el)).catch(() => { });
    if (window.MathJax && window.MathJax.typesetPromise) return run();
    if (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise) return window.MathJax.startup.promise.then(run);
    setTimeout(() => typeset(el), 300);
  }

  // shrink any display equation that is wider than the screen
  function fit(el) {
    el.querySelectorAll('.m').forEach(m => {
      m.style.fontSize = '';
      const c = m.querySelector('mjx-container'); if (!c) return;
      const need = c.scrollWidth, have = m.clientWidth - 4;
      if (need > have && have > 0) m.style.fontSize = Math.max(58, Math.floor(106 * have / need)) + '%';
    });
  }
  window.addEventListener('resize', () => fit(document));

  // ---------- values ----------
  function myValues(q) {
    const sym = U.symbols(state.sn, q.symset || 'exam'); const v = {};
    for (const [k, p] of Object.entries(q.params)) v[k] = p.sym ? +(p.base + sym[p.sym] * p.step).toPrecision(12) : p.base;
    return v;
  }
  function randValues(q) { const v = {}; for (const [k, p] of Object.entries(q.params)) v[k] = p.rand ? p.rand() : p.base; return v; }
  const hasMine = (q) => Object.values(q.params).some(p => p.sym);

  const nm = (k) => k.replace(/^([A-Za-z])([A-Za-z]?\d+|[a-z]+)$/, '$1<sub>$2</sub>');
  function givenList(q, v, mine) {
    return Object.entries(q.params).filter(([k]) => !(q.hideParams || []).includes(k)).map(([k, p]) => {
      let s = `<span class="gv">${nm(k)} = <b>${p.unit === 's' ? U.num(v[k] * 1e3) + ' ms' : U.given(v[k], p.unit)}</b>`;
      if (mine && p.sym) s += ` <span class="sym">(${p.unit === 'Ω' ? p.base : U.num(p.base / p.step)} + ${p.sym})${p.unit !== 'Ω' ? ' ' + (p.step === 1e-3 ? 'm' : 'µ') + p.unit : ''}</span>`;
      return s + '</span>';
    }).join('');
  }

  function badge(q) {
    if (q.src.type === 'hw') return `<span class="badge hw">${q.src.label}</span>`;
    if (q.src.type === 'exam') return `<span class="badge ex">${q.src.label}</span>`;
    return `<span class="badge dr">Drill</span>`;
  }

  // ---------- question card ----------
  function card(q, opts = {}) {
    const el = h(`<article class="qcard" data-id="${q.id}"></article>`);
    let mine = opts.random ? false : hasMine(q) || !opts.random;
    let v = opts.random ? randValues(q) : myValues(q);
    let hintN = 0;

    function render() {
      const a = q.calc(v);
      const prog = state.progress[q.id];
      el.innerHTML = `
        <header class="qh">${badge(q)}<span class="qt">${q.title}</span>${q.src.marks ? `<span class="marks">${q.src.marks}</span>` : ''}${prog && prog.right ? '<span class="tick" title="solved">✓</span>' : ''}</header>
        <div class="tags">${q.topics.map(t => `<span class="tag">${topicName(t)}</span>`).join('')}</div>
        <div class="given">${givenList(q, v, mine)}</div>
        ${q.note ? `<p class="note">${q.note}</p>` : ''}
        ${q.lead ? `<p class="lead">${q.lead(v)}</p>` : ''}
        <p class="ask">${q.ask}</p>
        <div class="fig">${q.fig(v)}</div>
        ${q.form ? `<p class="form">${q.form}</p>` : ''}
        <form class="ans">${q.answers.map((an, i) => {
          const pf = U.pick(a[an.k]);
          return `<label class="arow"><span class="al">${an.label}</span><input inputmode="decimal" autocomplete="off" data-k="${an.k}" data-scale="${pf[0]}" placeholder="?"><span class="au">${pf[1]}${an.unit}</span><span class="res" data-r="${an.k}"></span></label>`;
        }).join('')}
          <div class="btns"><button class="b pri" type="submit">Check</button>
          <button class="b" type="button" data-act="hint">Hint</button>
          <button class="b" type="button" data-act="sol">Solution</button>
          <button class="b" type="button" data-act="new" title="Random new values">🎲 New numbers</button>
          ${hasMine(q) || q.src.type !== 'drill' ? `<button class="b ghost" type="button" data-act="mine">${hasMine(q) ? 'My numbers' : 'Paper numbers'}</button>` : ''}</div>
        </form>
        <div class="hints"></div>
        <div class="sol" hidden></div>`;
      const hintsEl = $('.hints', el);
      for (let i = 0; i < hintN; i++) hintsEl.append(h(`<p class="hint"><b>Hint ${i + 1}</b> ${q.hints[i]}</p>`));

      $('.ans', el).addEventListener('submit', (e) => {
        e.preventDefault();
        let allOk = true, any = false;
        el.querySelectorAll('input[data-k]').forEach(inp => {
          const k = inp.dataset.k, truth = a[k];
          const r = $(`[data-r="${k}"]`, el);
          if (!inp.value.trim()) { r.textContent = ''; allOk = false; return; }
          any = true;
          const u = U.parse(inp.value, +inp.dataset.scale);
          const ok = U.close(u, truth, 0.01);
          const signOnly = !ok && U.close(-u, truth, 0.01);
          r.className = 'res ' + (ok ? 'ok' : 'bad');
          r.textContent = ok ? '✓' : signOnly ? '✗ sign!' : '✗';
          if (!ok) allOk = false;
        });
        if (!any) return;
        const pr = state.progress[q.id] || { tries: 0, right: 0 }; pr.tries++; if (allOk) pr.right++;
        state.progress[q.id] = pr; store.set('progress', state.progress);
        if (opts.onCheck) opts.onCheck(allOk);
      });
      el.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => {
        const act = b.dataset.act;
        if (act === 'hint') {
          if (hintN < q.hints.length) { hintsEl.append(h(`<p class="hint"><b>Hint ${hintN + 1}</b> ${q.hints[hintN]}</p>`)); hintN++; typeset(hintsEl); }
          if (hintN >= q.hints.length) b.disabled = true;
        }
        if (act === 'sol') {
          const s = $('.sol', el);
          if (s.hidden) { s.innerHTML = `<h3 class="solh">Worked solution</h3>` + q.sol(v, a) + answerLine(q, a); s.hidden = false; typeset(s); b.textContent = 'Hide solution'; }
          else { s.hidden = true; b.textContent = 'Solution'; }
        }
        if (act === 'new') { v = randValues(q); mine = false; hintN = 0; render(); }
        if (act === 'mine') { v = myValues(q); mine = true; hintN = 0; render(); }
      }));
      typeset(el);
    }
    render();
    return el;
  }
  function answerLine(q, a) {
    return `<div class="final"><b>Answer</b> ${q.answers.map(an => `${an.label} = <b>${U.si(a[an.k], an.unit)}</b>`).join(' · ')}</div>`;
  }

  // ---------- views ----------
  const views = {
    learn() {
      const s = sheet();
      const el = h(`<section><div class="hero"><h2>Sheet ${s.n} · ${s.title}</h2><p>${s.blurb}</p>
        <p class="how"><b>How to use this</b>: try the question first → hints → solution → redo with 🎲 new numbers until it's automatic.</p></div></section>`);
      s.topics.forEach((t, i) => {
        const n = s.questions.filter(q => q.topics.includes(t.id)).length;
        const d = h(`<details class="topic" ${i === 0 ? 'open' : ''}><summary><span class="tn">${i + 1}</span>${t.name}<span class="cnt">${n} Qs</span></summary>
          <div class="tbody">${t.notes}
          <div class="check"><b>Check yourself</b> ${t.check.q}<button class="b sm">Show answer</button><p class="ca" hidden>${t.check.a}</p></div>
          <button class="b pri" data-go="${t.id}">Practise ${t.short} →</button></div></details>`);
        $('.check button', d).onclick = (e) => { $('.ca', d).hidden = false; e.target.remove(); };
        $('[data-go]', d).onclick = () => { state.practice.topics = [t.id]; state.practice.deck = []; location.hash = 'practice'; };
        d.addEventListener('toggle', () => d.open && typeset(d));
        el.append(d);
      });
      typeset(el);
      return el;
    },
    questions() {
      const s = sheet();
      const el = h(`<section><div class="chips" id="qtop"></div><div id="fams"></div></section>`);
      const chips = $('#qtop', el);
      [['all', 'All topics'], ...s.topics.map(t => [t.id, t.short])].forEach(([id, n]) => {
        const c = h(`<button class="chip ${state.qTopic === id ? 'on' : ''}">${n}</button>`);
        c.onclick = () => { state.qTopic = id; show('questions'); };
        chips.append(c);
      });
      const fams = $('#fams', el);
      const match = (q) => state.qTopic === 'all' || q.topics.includes(state.qTopic);
      const hws = s.questions.filter(q => q.src.type === 'hw');
      hws.forEach(hq => {
        const twins = s.questions.filter(q => q.family === hq.family && q.src.type === 'exam');
        if (!match(hq) && !twins.some(match)) return;
        const block = h(`<div class="family"><div class="famh"><span>${hq.src.label}</span><span class="freq">${twins.length ? `turns up in <b>${new Set(twins.map(t => t.src.paper)).size}</b> past paper${twins.length > 1 ? 's' : ''}` : 'skill used inside other exam Qs'}</span></div></div>`);
        block.append(card(hq));
        if (twins.length) block.append(h(`<h3 class="twh">Past-paper versions</h3>`));
        twins.filter(match).forEach(tq => block.append(lazy(tq)));
        fams.append(block);
      });
      const drills = s.questions.filter(q => q.drill && match(q));
      if (drills.length) {
        const b = h(`<div class="family"><div class="famh"><span>Basics drills</span><span class="freq">new random numbers every time</span></div></div>`);
        drills.forEach(q => b.append(lazy(q, { random: true })));
        fams.append(b);
      }
      return el;
    },
    practice() {
      const s = sheet(), P = state.practice;
      const el = h(`<section><div class="pset">
        <p class="lbl">Topics <span class="muted">(none = all)</span></p><div class="chips" id="ptop"></div>
        <p class="lbl">Include</p><div class="chips" id="pkind"></div>
        <button class="b pri big" id="scr">🔀 Scramble a new deck</button></div><div id="deck"></div></section>`);
      s.topics.forEach(t => {
        const c = h(`<button class="chip ${P.topics.includes(t.id) ? 'on' : ''}">${t.short}</button>`);
        c.onclick = () => { P.topics = P.topics.includes(t.id) ? P.topics.filter(x => x !== t.id) : [...P.topics, t.id]; c.classList.toggle('on'); };
        $('#ptop', el).append(c);
      });
      [['hw', 'Homework'], ['exam', 'Past papers'], ['drill', 'Drills']].forEach(([k, n]) => {
        const c = h(`<button class="chip ${P.kinds[k] ? 'on' : ''}">${n}</button>`);
        c.onclick = () => { P.kinds[k] = !P.kinds[k]; c.classList.toggle('on'); };
        $('#pkind', el).append(c);
      });
      const build = () => {
        const pool = s.questions.filter(q => P.kinds[q.src.type] && (!P.topics.length || q.topics.some(t => P.topics.includes(t))));
        P.deck = U.shuffle(pool).map(q => q.id); P.i = 0; P.score = 0; P.done = 0; drawDeck();
      };
      $('#scr', el).onclick = build;
      const deckEl = $('#deck', el);
      function drawDeck() {
        deckEl.innerHTML = '';
        if (!P.deck.length) { deckEl.append(h(`<p class="empty">Nothing in the deck yet — pick topics and hit Scramble.</p>`)); return; }
        if (P.i >= P.deck.length) {
          deckEl.append(h(`<div class="done"><h3>Deck finished</h3><p>${P.score} / ${P.deck.length} correct first time.</p></div>`));
          const again = h(`<button class="b pri big">🔀 Scramble again</button>`); again.onclick = build; deckEl.append(again); return;
        }
        const q = s.questions.find(x => x.id === P.deck[P.i]);
        let counted = false;
        deckEl.append(h(`<div class="dbar"><span>Question ${P.i + 1} / ${P.deck.length}</span><span>Score ${P.score}</span><div class="pb"><i style="width:${100 * P.i / P.deck.length}%"></i></div></div>`));
        deckEl.append(card(q, { random: true, onCheck: (ok) => { if (!counted) { counted = true; if (ok) { P.score++; $('.dbar span:last-child', deckEl).textContent = 'Score ' + P.score; } } } }));
        const nx = h(`<div class="nav"><button class="b pri big">Next →</button></div>`);
        $('button', nx).onclick = () => { P.i++; drawDeck(); window.scrollTo({ top: deckEl.offsetTop - 70, behavior: 'smooth' }); };
        deckEl.append(nx);
      }
      if (!P.deck.length) build(); else drawDeck();
      return el;
    },
    radar() {
      const s = sheet();
      const fams = s.questions.filter(q => q.src.type === 'hw');
      let t = `<table class="radar"><thead><tr><th>Homework Q</th>${s.papers.map(p => `<th><span>${p.slice(0, 3)}</span><span>${p.slice(3)}</span></th>`).join('')}<th>Σ</th></tr></thead><tbody>`;
      fams.forEach(f => {
        const tw = s.questions.filter(q => q.family === f.family && q.src.type === 'exam');
        t += `<tr><td><b>${f.src.label.replace('HW 0 · ', '')}</b><br><span class="muted">${f.title}</span></td>${s.papers.map(p => {
          const hit = tw.filter(q => q.src.paper === p);
          return `<td class="${hit.length ? 'hit' : ''}">${hit.map(q => `<a href="#q-${q.id}" title="${q.title}">${q.src.label.split('Q')[1]}</a>`).join('')}</td>`;
        }).join('')}<td class="sum">${new Set(tw.map(q => q.src.paper)).size}</td></tr>`;
      });
      t += `</tbody></table>`;
      const el = h(`<section><h2>Exam radar · Sheet ${s.n}</h2><p class="muted">Which homework question showed up in which paper (Q1 parts). Tap a cell to open it.</p>
        <div class="tw">${t}</div><h3>What the papers tell you</h3><ul class="ins">${s.insights.map(i => `<li>${i}</li>`).join('')}</ul></section>`);
      el.querySelectorAll('a[href^="#q-"]').forEach(a => a.onclick = (e) => {
        e.preventDefault(); const q = s.questions.find(x => x.id === a.getAttribute('href').slice(3));
        const m = h(`<div class="modal"><div class="mbox"><button class="b x">✕ Close</button></div></div>`);
        $('.mbox', m).append(card(q)); $('.x', m).onclick = () => m.remove(); m.onclick = (ev) => { if (ev.target === m) m.remove(); };
        document.body.append(m);
      });
      return el;
    },
  };

  function lazy(q, opts) {
    const d = h(`<details class="twin" id="q-${q.id}"><summary>${badge(q)}<span class="qt">${q.title}</span>${state.progress[q.id] && state.progress[q.id].right ? '<span class="tick">✓</span>' : ''}</summary></details>`);
    let built = false;
    d.addEventListener('toggle', () => { if (d.open && !built) { built = true; d.append(card(q, opts)); } });
    return d;
  }

  function show(name) {
    if (!views[name]) name = 'learn';
    document.querySelectorAll('nav.tabs a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + name));
    const main = $('#main'); main.innerHTML = ''; main.append(views[name]());
  }

  function header() {
    const sc = $('#sheets');
    sc.innerHTML = '';
    window.SHEETS.forEach(s => { const c = h(`<button class="chip ${s.id === state.sheet ? 'on' : ''}">Sheet ${s.n}</button>`); c.onclick = () => { state.sheet = s.id; store.set('sheet', s.id); show(location.hash.slice(1)); header(); }; sc.append(c); });
    sc.append(h(`<span class="chip ghost" title="Send the next homework sheet to add it">Sheet ${window.SHEETS.length} · next</span>`));
    const sn = $('#sn'); sn.value = state.sn;
    sn.onchange = () => { state.sn = sn.value.replace(/\D/g, '').slice(0, 8); store.set('sn', state.sn); show(location.hash.slice(1)); };
  }

  window.addEventListener('hashchange', () => { if (!location.hash.startsWith('#q-')) show(location.hash.slice(1)); });
  header();
  show(location.hash.slice(1) || 'learn');
})();
