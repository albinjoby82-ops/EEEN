// node tests/verify.mjs — checks every question's formula answer against an MNA circuit solve
import fs from 'fs'; import vm from 'vm'; import path from 'path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ctx = { console, Math }; ctx.globalThis = ctx; vm.createContext(ctx);
for (const f of ['js/schem.js', 'js/util.js', 'data/sheet0.js']) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx);
const { U, SHEETS } = ctx;
let fails = 0, checks = 0;
for (const sh of SHEETS) for (const q of sh.questions) {
  const sets = [];
  const sym = U.symbols('25382076', q.symset || 'exam');
  const mine = {}; for (const [k, p] of Object.entries(q.params)) mine[k] = p.sym ? p.base + sym[p.sym] * p.step : p.base; sets.push(mine);
  for (let i = 0; i < 200; i++) { const v = {}; for (const [k, p] of Object.entries(q.params)) v[k] = p.rand ? p.rand() : p.base; sets.push(v); }
  for (const v of sets) {
    const a = q.calc(v);
    // render everything to catch template errors
    q.fig(v); q.sol(v, a);
    for (const an of q.answers) if (!isFinite(a[an.k])) { fails++; console.log('NaN', q.id, an.k, v); }
    const m = U.mna(q.net(v)); const pr = q.probe(m, v);
    for (const [k, val] of Object.entries(pr)) {
      let truth = a[k];
      if (k === 'sum') truth = a.amp + a.dc; // SPR21 1(b) at sin = 1
      if (truth === undefined) continue;
      checks++;
      if (Math.abs(val - truth) > 1e-6 * Math.max(1, Math.abs(truth)) && Math.abs(val - truth) > 1e-9) { fails++; console.log('MISMATCH', q.id, k, val, truth); break; }
    }
  }
  const a = q.calc(mine);
  console.log(q.id.padEnd(10), q.answers.map(an => `${an.k}=${U.si(a[an.k], an.unit, 4)}`).join('  '));
}
console.log(`\n${checks} solver checks, ${fails} failures`);
process.exit(fails ? 1 : 0);
