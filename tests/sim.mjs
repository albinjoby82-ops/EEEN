// Independent circuit simulators used only to CHECK the worked answers.
//  - ac(net, w): complex MNA (phasors) with R, C, L, V, I, ideal op-amp, ideal transformer, controlled sources
//  - tran(net, t0, t1, steps): backward-Euler time stepping with R, C, L, V(t), switches and ideal diodes

const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]], csub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cdiv = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
const cabs = (a) => Math.hypot(a[0], a[1]);
const C = (x) => (Array.isArray(x) ? x : [x, 0]);

function csolve(A, z) {
  const n = z.length;
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (cabs(A[r][c]) > cabs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]]; [z[c], z[p]] = [z[p], z[c]];
    for (let r = 0; r < n; r++) if (r !== c) {
      const m = cdiv(A[r][c], A[c][c]); if (m[0] === 0 && m[1] === 0) continue;
      for (let q = c; q < n; q++) A[r][q] = csub(A[r][q], cmul(m, A[c][q]));
      z[r] = csub(z[r], cmul(m, z[c]));
    }
  }
  return z.map((v, i) => cdiv(v, A[i][i]));
}

// els: ['R',a,b,ohm] ['C',a,b,F] ['L',a,b,H] ['Z',a,b,[re,im]] ['V',plus,minus,phasor] ['I',from,to,phasor]
//      ['OP',inPlus,inMinus,out] ['XF',p1,p2,s1,s2,n]  (v_p = n v_s, i_s = -n i_p)
//      ['G',from,to,cp,cn,gm] (current gm*(Vcp-Vcn) flows from->to)   ['FR',from,to,ra,rb,R,beta] (beta * current in R from ra to rb)
export function ac(els, w) {
  const nodes = new Map(); const id = (n) => { if (n === '0') return -1; if (!nodes.has(n)) nodes.set(n, nodes.size); return nodes.get(n); };
  els.forEach(e => { for (let i = 1; i < e.length; i++) if (typeof e[i] === 'string') id(e[i]); });
  const extra = els.filter(e => ['V', 'OP', 'XF'].includes(e[0]) || (e[0] === 'L' && w === 0)).length;
  const N = nodes.size, D = N + extra;
  const A = Array.from({ length: D }, () => Array.from({ length: D }, () => [0, 0])), z = Array.from({ length: D }, () => [0, 0]);
  const ad = (r, c, v) => { if (r >= 0 && c >= 0) A[r][c] = cadd(A[r][c], v); };
  const stampY = (i, j, y) => { ad(i, i, y); ad(j, j, y); ad(i, j, [-y[0], -y[1]]); ad(j, i, [-y[0], -y[1]]); };
  for (let i = 0; i < N; i++) A[i][i] = [1e-15, 0];
  let k = N; const vidx = [];
  for (const e of els) {
    const t = e[0];
    if (t === 'R') stampY(id(e[1]), id(e[2]), [1 / e[3], 0]);
    else if (t === 'Z') stampY(id(e[1]), id(e[2]), cdiv([1, 0], e[3]));
    else if (t === 'C') { if (w > 0) stampY(id(e[1]), id(e[2]), [0, w * e[3]]); }
    else if (t === 'L') {
      if (w > 0) stampY(id(e[1]), id(e[2]), [0, -1 / (w * e[3])]);
      else { const r = k++, i = id(e[1]), j = id(e[2]); ad(i, r, [1, 0]); ad(r, i, [1, 0]); ad(j, r, [-1, 0]); ad(r, j, [-1, 0]); }
    }
    else if (t === 'I') { const i = id(e[1]), j = id(e[2]), v = C(e[3]); if (i >= 0) z[i] = csub(z[i], v); if (j >= 0) z[j] = cadd(z[j], v); }
    else if (t === 'V') { const r = k++, i = id(e[1]), j = id(e[2]); vidx.push(r); ad(i, r, [1, 0]); ad(r, i, [1, 0]); ad(j, r, [-1, 0]); ad(r, j, [-1, 0]); z[r] = C(e[3]); }
    else if (t === 'OP') { const r = k++, ip = id(e[1]), im = id(e[2]), o = id(e[3]); ad(o, r, [1, 0]); ad(r, ip, [1, 0]); ad(r, im, [-1, 0]); }
    else if (t === 'XF') { // unknown = primary current ip (into p1). v(p1)-v(p2) - n (v(s1)-v(s2)) = 0 ; secondary current into s1 = -n ip
      const r = k++, p1 = id(e[1]), p2 = id(e[2]), s1 = id(e[3]), s2 = id(e[4]), n = e[5];
      ad(p1, r, [1, 0]); ad(p2, r, [-1, 0]); ad(s1, r, [-n, 0]); ad(s2, r, [n, 0]);
      ad(r, p1, [1, 0]); ad(r, p2, [-1, 0]); ad(r, s1, [-n, 0]); ad(r, s2, [n, 0]);
    }
    else if (t === 'G' || t === 'FR') {
      const f = id(e[1]), to = id(e[2]), cp = id(e[3]), cn = id(e[4]), g = t === 'G' ? e[5] : e[6] / e[5];
      ad(f, cp, [g, 0]); ad(f, cn, [-g, 0]); ad(to, cp, [-g, 0]); ad(to, cn, [g, 0]);
    }
  }
  const x = csolve(A, z);
  return { v: (n) => (n === '0' ? [0, 0] : x[id(n)]), iv: (i) => x[vidx[i]] };
}

function rsolve(A, z) {
  const n = z.length;
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]]; [z[c], z[p]] = [z[p], z[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const m = A[r][c] / A[c][c]; if (m) { for (let q = c; q < n; q++) A[r][q] -= m * A[c][q]; z[r] -= m * z[c]; } }
  }
  return z.map((v, i) => v / A[i][i]);
}

// els: ['R',a,b,ohm] ['C',a,b,F] ['L',a,b,H] ['V',plus,minus, number | fn(t)] ['I',from,to,amps]
//      ['D',anode,cathode,Vth] ['SW',a,b,tClose] ['XFR',...] not needed
// Starts from zero state at t0. Returns a record with helpers.
export function tran(els, t0, t1, steps = 8000) {
  const nodes = new Map(); const id = (n) => { if (n === '0') return -1; if (!nodes.has(n)) nodes.set(n, nodes.size); return nodes.get(n); };
  els.forEach(e => { id(e[1]); id(e[2]); });
  const N = nodes.size; const br = []; els.forEach((e, i) => { if ('VLD'.includes(e[0])) br.push(i); });
  const bi = new Map(br.map((e, i) => [e, N + i])), Dm = N + br.length, dt = (t1 - t0) / steps;
  let x = new Array(Dm).fill(0); const dOn = new Map(); els.forEach((e, i) => { if (e[0] === 'D') dOn.set(i, false); });
  const ts = [], rec = [];
  const vd = (xx, a, b) => (a >= 0 ? xx[a] : 0) - (b >= 0 ? xx[b] : 0);
  for (let s = 1; s <= steps; s++) {
    const t = t0 + s * dt; let xn;
    for (let it = 0; it < 40; it++) {
      const A = Array.from({ length: Dm }, () => new Array(Dm).fill(0)), z = new Array(Dm).fill(0);
      for (let i = 0; i < N; i++) A[i][i] = 1e-13;
      const g = (i, j, y) => { if (i >= 0) A[i][i] += y; if (j >= 0) A[j][j] += y; if (i >= 0 && j >= 0) { A[i][j] -= y; A[j][i] -= y; } };
      els.forEach((e, ei) => {
        const a = id(e[1]), b = id(e[2]), ty = e[0];
        if (ty === 'R') g(a, b, 1 / e[3]);
        else if (ty === 'SW') g(a, b, t >= e[3] ? 1e6 : 1e-13);
        else if (ty === 'C') { const y = e[3] / dt; g(a, b, y); const ih = y * vd(x, a, b); if (a >= 0) z[a] += ih; if (b >= 0) z[b] -= ih; }
        else if (ty === 'I') { if (a >= 0) z[a] -= e[3]; if (b >= 0) z[b] += e[3]; }
        else {
          const r = bi.get(ei); if (a >= 0) { A[a][r] += 1; } if (b >= 0) { A[b][r] -= 1; }
          if (ty === 'V') { if (a >= 0) A[r][a] += 1; if (b >= 0) A[r][b] -= 1; z[r] = typeof e[3] === 'function' ? e[3](t) : e[3]; }
          if (ty === 'L') { if (a >= 0) A[r][a] += 1; if (b >= 0) A[r][b] -= 1; A[r][r] -= e[3] / dt; z[r] = -(e[3] / dt) * x[r]; }
          if (ty === 'D') { if (dOn.get(ei)) { if (a >= 0) A[r][a] += 1; if (b >= 0) A[r][b] -= 1; z[r] = e[3]; } else { A[r][r] = 1; z[r] = 0; } }
        }
      });
      xn = rsolve(A, z); let changed = false;
      els.forEach((e, ei) => {
        if (e[0] !== 'D') return; const r = bi.get(ei), on = dOn.get(ei);
        if (on && xn[r] < -1e-12) { dOn.set(ei, false); changed = true; }
        else if (!on && vd(xn, id(e[1]), id(e[2])) > e[3] + 1e-9) { dOn.set(ei, true); changed = true; }
      });
      if (!changed) break;
    }
    x = xn; ts.push(t); rec.push(x);
  }
  const col = (n) => (n === '0' ? rec.map(() => 0) : rec.map(r => r[id(n)]));
  const win = (n, ta, tb) => col(n).filter((_, i) => ts[i] >= ta - 1e-15 && ts[i] <= tb + 1e-15);
  return {
    t1, ts, end: (n) => (n === '0' ? 0 : x[id(n)]), iEnd: (ei) => x[bi.get(ei)],
    max: (n, ta, tb) => Math.max(...win(n, ta, tb)), min: (n, ta, tb) => Math.min(...win(n, ta, tb)),
    avg: (n, ta, tb) => { const a = win(n, ta, tb); return a.reduce((s, v) => s + v, 0) / a.length; },
    diff: (n, m, ta, tb) => { const a = win(n, ta, tb), b = win(m, ta, tb); return a.map((v, i) => v - b[i]); },
  };
}
export const cx = { add: cadd, sub: csub, mul: cmul, div: cdiv, abs: cabs, deg: (a) => Math.atan2(a[1], a[0]) * 180 / Math.PI };
