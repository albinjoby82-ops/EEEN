// Shared helpers + question registry for every topic file.
(function (G) {
  const { S, U } = G;
  const kx = (tex, display) => (G.katex ? G.katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: false }) : tex);
  const D = (tex) => '<div class="m">' + kx(tex, true) + '</div>';
  const I = (tex) => kx(tex, false);
  // A solution step. Every step says WHY as well as what.
  const step = (title, body, why) => `<div class="step"><h4>${title}</h4>${why ? `<p class="why"><b>Why</b> ${why}</p>` : ''}${body}</div>`;
  const trap = (t) => `<div class="trap"><b>Trap</b> ${t}</div>`;
  const tip = (t) => `<div class="tipbox"><b>Why it works</b> ${t}</div>`;
  const flag = (t) => `<div class="flagbox"><b>Paper issue</b> ${t}</div>`;
  const par = (a, b) => a * b / (a + b);
  const w = (body, wd, ht) => S.svg(wd, ht, body);
  // parameter spec: base value (SI), unit, student-number symbol, step per digit, random generator
  const p = (base, unit, sym, stepv, rand) => ({ base, unit, sym, step: stepv ?? (unit === 'Ω' ? 1 : 1e-3), rand });
  const rR = (lo, hi) => () => U.R.res(lo, hi);
  const pk = (arr) => () => U.R.choice(arr);
  // phase as "+ 12.3°" / "− 45.0°" in TeX
  const phT = (deg) => `${deg < 0 ? '-' : '+'} ${U.num(Math.abs(deg), 3)}^\\circ`;
  const phH = (deg) => `${deg < 0 ? '−' : '+'} ${U.num(Math.abs(deg), 3)}°`;
  const wrap = (d) => { while (d > 180) d -= 360; while (d <= -180) d += 360; return d; };

  const LK = {
    Q: [], byId: {}, topics: [], papers: [], mocks: [],
    add(q) { if (LK.byId[q.id]) throw new Error('duplicate id ' + q.id); LK.Q.push(q); LK.byId[q.id] = q; return q; },
  };
  G.LK = LK;
  G.B = { D, I, step, trap, tip, flag, par, w, p, rR, pk, phT, phH, wrap, T: String.raw, st: U.st, gt: U.givenTex };
})(typeof window !== 'undefined' ? window : globalThis);
