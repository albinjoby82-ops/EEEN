// node tests/verify.mjs — checks every worked answer against an independent circuit simulation.
import fs from 'fs'; import vm from 'vm'; import path from 'path';
import { ac, tran, cx } from './sim.mjs';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ctx = { console, Math }; ctx.globalThis = ctx; vm.createContext(ctx);
const files = ['js/schem.js', 'js/util.js', 'data/base.js', ...fs.readdirSync(path.join(root, 'data')).filter(f => /^t\d/.test(f)).sort().map(f => 'data/' + f), 'data/exams.js'].filter(f => fs.existsSync(path.join(root, f)));
for (const f of files) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
const { U, LK } = ctx;
const only = process.argv[2];
let fails = 0, checks = 0; const TOL = { dc: 1e-6, ac: 1e-6, tran: 6e-3 };
const cmp = (id, k, got, exp, tol) => { checks++; if (!(Math.abs(got - exp) <= tol * Math.max(Math.abs(exp), 1e-9) + 1e-12)) { fails++; if (fails < 40) console.log('  MISMATCH', id, k, 'sim', got, 'formula', exp); return false; } return true; };

for (const q of LK.Q) {
  if (only && !q.id.includes(only)) continue;
  const sets = []; const sym = U.symbols('25382076', q.symset || 'exam');
  const base = {}; for (const [k, p] of Object.entries(q.params)) base[k] = p.base; sets.push(base);
  const mine = {}; for (const [k, p] of Object.entries(q.params)) mine[k] = p.sym ? +(p.base + sym[p.sym] * p.step).toPrecision(12) : p.base; sets.push(mine);
  const nr = q.tran ? 6 : 60;
  for (let i = 0; i < nr; i++) { const v = {}; for (const [k, p] of Object.entries(q.params)) v[k] = p.rand ? p.rand() : p.base; sets.push(v); }
  let kinds = [];
  for (const v of sets) {
    const a = q.calc(v);
    q.fig(v); q.sol(v, a); if (q.lead) q.lead(v); if (typeof q.ask === 'function') q.ask(v);
    for (const an of q.answers) if (!isFinite(a[an.k])) { fails++; console.log('  NaN', q.id, an.k, JSON.stringify(v)); }
    if (q.net) { const m = U.mna(q.net(v)); const pr = q.probe(m, v); kinds.push('dc');
      for (const [k, val] of Object.entries(pr)) { let truth = a[k]; if (k === 'sum') truth = a.amp + a.dc; if (truth !== undefined) cmp(q.id, k, val, truth, TOL.dc); } }
    if (q.ac) { const s = q.ac(v); const sol = ac(s.net, s.w); const pr = s.probe(sol, cx); kinds.push('ac');
      for (const [k, val] of Object.entries(pr)) cmp(q.id, k, val, a[k], TOL.ac); }
    if (q.tran) { const s = q.tran(v); const r = tran(s.net, s.t0, s.t1, s.steps || 8000); const pr = s.probe(r); kinds.push('tran');
      for (const [k, val] of Object.entries(pr)) cmp(q.id, k, val, a[k], s.tol || TOL.tran); }
    if (q.chk) { kinds.push('chk'); for (const [k, got, exp, tol] of q.chk(v, a, { ac, tran, cx })) cmp(q.id, k, got, exp, tol || 1e-6); }
  }
  const a = q.calc(mine);
  const how = [...new Set(kinds)].join('+') || 'NOT CHECKED';
  console.log(q.id.padEnd(11), how.padEnd(9), q.answers.map(an => `${an.k}=${U.si(a[an.k], an.unit, 4)}`).join('  '));
}
console.log(`\n${LK.Q.length} questions, ${checks} simulation checks, ${fails} failures`);
process.exit(fails ? 1 : 0);
