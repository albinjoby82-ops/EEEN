// Formatting, random values, student-number symbols, answer parsing, MNA solver.
(function (G) {
  const PFX = [[1e9, 'G', 'G'], [1e6, 'M', 'M'], [1e3, 'k', 'k'], [1, '', ''], [1e-3, 'm', 'm'], [1e-6, 'µ', '\\mu '], [1e-9, 'n', 'n'], [1e-12, 'p', 'p']];

  function pick(v, unit) {
    if (unit !== undefined && (unit === '°' || unit === 'dB' || unit === '')) return PFX[3];
    const a = Math.abs(v);
    if (a === 0) return PFX[3];
    for (const p of PFX) if (a >= p[0] * 0.9995) return p;
    return PFX[PFX.length - 1];
  }
  function trim(s) { return s.includes('e') ? s : s.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, ''); }
  function num(v, sf = 3) {
    if (!isFinite(v)) return '—';
    if (v === 0) return '0';
    let s = Number(v).toPrecision(sf);
    if (s.includes('e')) s = String(Number(s));
    return s;
  }
  // 3 s.f. with SI prefix: si(0.00201,'A') -> "2.01 mA"
  const NOPFX = { '°': 1, 'dB': 1, '': 1 };
  function si(v, unit, sf = 3) {
    if (unit in NOPFX) return num(v, sf) + (unit === '°' ? '°' : unit ? ' ' + unit : '');
    if (v === 0) return '0 ' + unit;
    const p = pick(v);
    return num(v / p[0], sf) + ' ' + p[1] + unit;
  }
  const texUnit = (u) => u.replace('Ω', '\\Omega').replace('°', '^\\circ');
  // TeX version: "2.01\,\mathrm{mA}"
  function st(v, unit, sf = 3) {
    if (unit in NOPFX) return num(v, sf) + (unit === '°' ? '^\\circ' : unit ? '\\,\\mathrm{' + unit + '}' : '');
    if (v === 0) return '0\\,' + texUnit(unit);
    const p = pick(v);
    const u = unit === 'Ω' ? `${p[2] ? '\\mathrm{' + p[2].trim() + '}' : ''}\\Omega` : (p[2] === '\\mu ' ? '\\mu\\mathrm{' + unit + '}' : `\\mathrm{${p[2]}${unit}}`);
    return num(v / p[0], sf).replace('-', '-') + '\\,' + u;
  }
  // A given component value, shown exactly (e.g. 1205 Ω, 1.503 V, 4.006 mA)
  function given(v, unit) {
    if (unit === 'Ω' && Math.abs(v) < 1e4 && Number.isInteger(v)) return v + ' Ω';
    return si(v, unit, 4).replace(/(\.\d*?)0+ /, '$1 ').replace('. ', ' ');
  }
  function givenTex(v, unit) {
    if (unit === 'Ω' && Math.abs(v) < 1e4 && Number.isInteger(v)) return v + '\\,\\Omega';
    return st(v, unit, 4).replace(/(\.\d*?)0+\\,/, '$1\\,').replace('.\\,', '\\,');
  }

  // Parse an answer: "2.01", "2.01m", "2.01 mA", "2.01e-3", "-1.2k"
  function parse(str, shownScale) {
    if (str == null) return NaN;
    let s = String(str).trim().replace(/,/g, '.').replace(/\s+/g, '').replace(/dB|Hz|[VAWΩΩFHSs]$|ohms?|°|deg/gi, '').replace(/[VAW]$/, '');
    if (!s) return NaN;
    const m = /^([+\-−]?\d*\.?\d+(?:e[+\-]?\d+)?)([GMkmuµnp]?)$/i.exec(s.replace('−', '-'));
    if (!m) return NaN;
    let n = parseFloat(m[1]);
    const mult = { G: 1e9, M: 1e6, k: 1e3, K: 1e3, m: 1e-3, u: 1e-6, 'µ': 1e-6, n: 1e-9, p: 1e-12 }[m[2]];
    if (m[2]) return n * mult;
    return n * shownScale; // plain number = in the unit shown beside the box
  }
  function close(user, truth, rel = 0.01) {
    if (!isFinite(user)) return false;
    if (Math.abs(truth) < 1e-12) return Math.abs(user) < 1e-9;
    return Math.abs(user - truth) <= Math.abs(truth) * rel + 1e-12;
  }


  // ---------- complex numbers: [re, im] ----------
  const Z = {
    c: (re, im = 0) => [re, im],
    add: (a, b) => [a[0] + b[0], a[1] + b[1]], sub: (a, b) => [a[0] - b[0], a[1] - b[1]],
    mul: (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]],
    div: (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; },
    inv: (a) => Z.div([1, 0], a), abs: (a) => Math.hypot(a[0], a[1]), deg: (a) => Math.atan2(a[1], a[0]) * 180 / Math.PI,
    par: (a, b) => Z.div(Z.mul(a, b), Z.add(a, b)), sc: (a, k) => [a[0] * k, a[1] * k],
    R: (r) => [r, 0], L: (w, l) => [0, w * l], Cap: (w, c) => [0, -1 / (w * c)],
  };
  const sgn = (x, tex) => (x < 0 ? (tex ? '-' : '−') : '+');

  // ---------- random ----------
  const E12 = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const ri = (a, b) => Math.floor(rnd(a, b + 1));
  const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const R = {
    res(lo = 1e3, hi = 10e3) {
      for (let i = 0; i < 50; i++) { const v = choice(E12) * choice([1e2, 1e3, 1e4]); if (v >= lo && v <= hi) return Math.round(v); }
      return lo;
    },
    volt(lo = 1, hi = 12, step = 0.5) { return Math.round(rnd(lo, hi) / step) * step; },
    amp(lo = 0.5e-3, hi = 5e-3) { return Math.round(rnd(lo, hi) * 1e4) / 1e4; },
    ri, rnd, choice,
  };
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  // ---------- student-number symbols ----------
  // Homework: 8 digits, symbols sit under digits 2..8 (no β). Exams: all 8 digits, α..λ incl. β.
  function symbols(sn, set) {
    const d = String(sn || '').replace(/\D/g, '').padEnd(8, '0').slice(0, 8).split('').map(Number);
    if (set === 'hw') return { 'α': d[1], 'γ': d[2], 'δ': d[3], 'ε': d[4], 'η': d[5], 'θ': d[6], 'λ': d[7] };
    return { 'α': d[0], 'β': d[1], 'γ': d[2], 'δ': d[3], 'ε': d[4], 'η': d[5], 'θ': d[6], 'λ': d[7] };
  }

  // ---------- MNA DC solver (used by the self-check) ----------
  // els: ['R',a,b,ohms] | ['V',plus,minus,volts] | ['I',from,to,amps] (current flows from->to through the source)
  function mna(els) {
    const nodes = new Map(); const id = (n) => { if (n === '0') return -1; if (!nodes.has(n)) nodes.set(n, nodes.size); return nodes.get(n); };
    els.forEach(e => { id(e[1]); id(e[2]); });
    const vs = els.filter(e => e[0] === 'V');
    const N = nodes.size, M = vs.length, D = N + M;
    const A = Array.from({ length: D }, () => new Array(D).fill(0)), z = new Array(D).fill(0);
    let k = 0;
    for (const [t, a, b, val] of els) {
      const i = id(a), j = id(b);
      if (t === 'R') { const g = 1 / val; if (i >= 0) A[i][i] += g; if (j >= 0) A[j][j] += g; if (i >= 0 && j >= 0) { A[i][j] -= g; A[j][i] -= g; } }
      if (t === 'I') { if (i >= 0) z[i] -= val; if (j >= 0) z[j] += val; }
      if (t === 'V') { const r = N + k++; if (i >= 0) { A[i][r] += 1; A[r][i] += 1; } if (j >= 0) { A[j][r] -= 1; A[r][j] -= 1; } z[r] = val; }
    }
    for (let c = 0; c < D; c++) { // gaussian elimination
      let p = c; for (let r = c + 1; r < D; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      [A[c], A[p]] = [A[p], A[c]];[z[c], z[p]] = [z[p], z[c]];
      for (let r = 0; r < D; r++) if (r !== c) { const m = A[r][c] / A[c][c]; if (m) { for (let q = c; q < D; q++) A[r][q] -= m * A[c][q]; z[r] -= m * z[c]; } }
    }
    const x = z.map((v, i) => v / A[i][i]);
    return { v: (n) => n === '0' ? 0 : x[id(n)], ivs: (idx) => x[N + idx] };
  }

  G.U = { si, st, given, givenTex, num, parse, close, R, shuffle, symbols, mna, pick, texUnit, Z, sgn };
})(typeof window !== 'undefined' ? window : globalThis);
