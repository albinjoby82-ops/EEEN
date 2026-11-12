// Tiny SVG schematic drawing library — lab-report style circuit diagrams.
// Every two-terminal part is drawn between two points p1 -> p2 (any angle).
(function (G) {
  const INK = 'var(--ink)', HL = 'var(--hl)';
  const f = (n) => Math.round(n * 10) / 10;

  function part(p1, p2, bodyHalf, body, o) {
    const [x1, y1] = p1, [x2, y2] = p2;
    const L = Math.hypot(x2 - x1, y2 - y1);
    const a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    const c = o.hl ? HL : INK, w = o.hl ? 2.6 : 1.6;
    const m = L / 2;
    let s = `<g transform="translate(${x1},${y1}) rotate(${f(a)})" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round">`;
    s += `<line x1="0" y1="0" x2="${f(m - bodyHalf)}" y2="0"/><line x1="${f(m + bodyHalf)}" y1="0" x2="${f(L)}" y2="0"/>`;
    s += `<g transform="translate(${f(m)},0)">${body(c)}</g></g>`;
    return s + label(p1, p2, o);
  }

  function label(p1, p2, o) {
    if (!o.lab && !o.val) return '';
    const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2;
    const vert = Math.abs(p2[0] - p1[0]) < Math.abs(p2[1] - p1[1]);
    let side = o.side || (vert ? 'right' : 'top');
    const d = o.off || (o.kind === 'src' ? 26 : 16);
    let x = mx, y = my, anchor = 'middle';
    if (side === 'right') { x = mx + d; anchor = 'start'; }
    if (side === 'left') { x = mx - d; anchor = 'end'; }
    if (side === 'top') { y = my - d - (o.val ? 12 : 0); }
    if (side === 'bottom') { y = my + d + 12; }
    const c = o.hl ? HL : INK;
    let s = '';
    if (o.lab) s += `<text x="${f(x)}" y="${f(vert ? y - (o.val ? 3 : -5) : y)}" text-anchor="${anchor}" class="sl" fill="${c}">${sub(o.lab)}</text>`;
    if (o.val) s += `<text x="${f(x)}" y="${f((vert ? y - (o.val ? 3 : -5) : y) + 14)}" text-anchor="${anchor}" class="sv">${o.val}</text>`;
    return s;
  }

  // "R12" -> R<tspan sub>12</tspan>, "Vb0" -> V<sub>b0</sub>
  function sub(t) {
    const m = /^([A-Za-zβ])([A-Za-z]?[0-9]+|[a-z]+[0-9]*|L|s|th|pi)?$/.exec(t);
    if (!m || !m[2] || t.length > 6) return esc(t);
    return `${esc(m[1])}<tspan class="ssub" dy="4">${esc(m[2])}</tspan><tspan dy="-4"></tspan>`;
  }
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  const S = {
    svg(w, h, body, cls = '') { return `<svg viewBox="-34 0 ${w + 64} ${h}" class="schem ${cls}" xmlns="http://www.w3.org/2000/svg" role="img">${body}</svg>`; },
    wire(pts, o = {}) {
      return `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${o.hl ? HL : INK}" stroke-width="${o.hl ? 2.6 : 1.6}" stroke-linejoin="round" ${o.dash ? 'stroke-dasharray="5 4"' : ''}/>`;
    },
    R(p1, p2, o = {}) {
      return part(p1, p2, 21, () => `<polyline points="-21,0 -17.5,-7 -10.5,7 -3.5,-7 3.5,7 10.5,-7 17.5,7 21,0"/>`, o);
    },
    // Voltage source: + terminal at p1
    V(p1, p2, o = {}) {
      return part(p1, p2, 17, (c) => `<circle r="17" fill="var(--bg-card)"/>
        <line x1="-11" y1="-4" x2="-11" y2="4"/><line x1="-15" y1="0" x2="-7" y2="0"/>
        <line x1="10" y1="-4" x2="10" y2="4"/>`, { kind: 'src', ...o });
    },
    // Sine source: + at p1, with ~ inside
    Vac(p1, p2, o = {}) {
      return part(p1, p2, 17, () => `<circle r="17" fill="var(--bg-card)"/><path d="M-8,0 C-5,-9 -1,-9 0,0 S5,9 8,0" transform="rotate(-90)"/>
        <line x1="-13" y1="-3" x2="-13" y2="3" stroke-width="1.2"/><line x1="-16" y1="0" x2="-10" y2="0" stroke-width="1.2"/>`, { kind: 'src', ...o });
    },
    // Current source: arrow points from p1 towards p2 (current flows p1 -> p2 through the source)
    I(p1, p2, o = {}) {
      return part(p1, p2, 17, (c) => `<circle r="17" fill="var(--bg-card)"/>
        <line x1="-9" y1="0" x2="8" y2="0"/><polyline points="3,-5 9,0 3,5" fill="${c}"/>`, { kind: 'src', ...o });
    },
    dot(p) { return `<rect x="${p[0] - 3}" y="${p[1] - 3}" width="6" height="6" fill="var(--ink)"/>`; },
    term(p, t, side = 'left') {
      const dx = side === 'left' ? -10 : 10;
      return `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="var(--bg-card)" stroke="var(--ink)" stroke-width="1.6"/>
        <text x="${p[0] + dx}" y="${p[1] + 5}" text-anchor="${side === 'left' ? 'end' : 'start'}" class="sl b">${esc(t)}</text>`;
    },
    // LTspice-style node flag
    flag(p, t, dir = 'up') {
      const [x, y] = p; const w = 10 + 9 * String(t).length;
      let ox = x, oy = y;
      let s = '';
      if (dir === 'up') { s += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - 14}" stroke="var(--ink)" stroke-width="1.2"/>`; ox = x; oy = y - 24; }
      if (dir === 'down') { s += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 14}" stroke="var(--ink)" stroke-width="1.2"/>`; ox = x; oy = y + 24; }
      if (dir === 'left') { ox = x - w / 2 - 12; oy = y; s += `<line x1="${x}" y1="${y}" x2="${x - 12}" y2="${y}" stroke="var(--ink)" stroke-width="1.2"/>`; }
      if (dir === 'right') { ox = x + w / 2 + 12; oy = y; s += `<line x1="${x}" y1="${y}" x2="${x + 12}" y2="${y}" stroke="var(--ink)" stroke-width="1.2"/>`; }
      s += `<rect x="${ox - w / 2}" y="${oy - 10}" width="${w}" height="20" rx="4" class="flag"/>
        <text x="${ox}" y="${oy + 5}" text-anchor="middle" class="sl b fl">${esc(t)}</text>`;
      return s;
    },
    gnd(p) {
      const [x, y] = p;
      return `<g stroke="var(--ink)" stroke-width="1.6"><line x1="${x}" y1="${y}" x2="${x}" y2="${y + 10}"/>
        <line x1="${x - 12}" y1="${y + 10}" x2="${x + 12}" y2="${y + 10}"/><line x1="${x - 7}" y1="${y + 15}" x2="${x + 7}" y2="${y + 15}"/>
        <line x1="${x - 3}" y1="${y + 20}" x2="${x + 3}" y2="${y + 20}"/></g>`;
    },
    // current arrow along a wire at p pointing dir (r,l,u,d)
    arrow(p, dir, t, o = {}) {
      const [x, y] = p; const r = { r: 0, d: 90, l: 180, u: -90 }[dir];
      const c = o.c || 'var(--cur)';
      let s = `<g transform="translate(${x},${y}) rotate(${r})"><polygon points="-6,-6 6,0 -6,6" fill="${c}"/></g>`;
      if (t) {
        const tx = o.tx ?? (dir === 'r' || dir === 'l' ? x : x + 12), ty = o.ty ?? (dir === 'r' || dir === 'l' ? y - 10 : y + 5);
        s += `<text x="${tx}" y="${ty}" text-anchor="${o.anchor || (dir === 'r' || dir === 'l' ? 'middle' : 'start')}" class="sl cur" fill="${c}">${t}</text>`;
      }
      return s;
    },
    // voltage annotation: + at p1, − at p2, label beside
    vmark(p1, p2, t, o = {}) {
      const c = o.c || 'var(--volt)';
      const mx = (p1[0] + p2[0]) / 2 + (o.dx || 0), my = (p1[1] + p2[1]) / 2 + (o.dy || 0);
      return `<text x="${p1[0]}" y="${p1[1] + 5}" text-anchor="middle" class="pm" fill="${c}">+</text>
        <text x="${p2[0]}" y="${p2[1] + 5}" text-anchor="middle" class="pm" fill="${c}">−</text>
        <text x="${mx}" y="${my + 5}" text-anchor="middle" class="sl b" fill="${c}">${t}</text>`;
    },
    text(p, t, o = {}) {
      return `<text x="${p[0]}" y="${p[1]}" text-anchor="${o.anchor || 'middle'}" class="${o.cls || 'sl'}" ${o.c ? `fill="${o.c}"` : ''}>${t}</text>`;
    },
    nodeV(p, t, o = {}) { // node voltage bubble
      const w = 12 + 7.2 * t.replace(/<[^>]+>/g, '').length;
      const x = p[0] + (o.dx || 0), y = p[1] + (o.dy || 0);
      return `<rect x="${x - w / 2}" y="${y - 11}" width="${w}" height="22" rx="11" class="nv"/>
        <text x="${x}" y="${y + 5}" text-anchor="middle" class="sl nvt">${t}</text>`;
    },
  };

  // ---------- extra parts (AC, op-amps, diodes, transformers) ----------
  Object.assign(S, {
    C(p1, p2, o = {}) {
      return part(p1, p2, 4, () => `<line x1="-4" y1="-11" x2="-4" y2="11"/><line x1="4" y1="-11" x2="4" y2="11"/>`, o);
    },
    L(p1, p2, o = {}) {
      return part(p1, p2, 20, () => `<path d="M-20,0 a5,6 0 0 1 10,0 a5,6 0 0 1 10,0 a5,6 0 0 1 10,0 a5,6 0 0 1 10,0"/>`, o);
    },
    // Diode: anode at p1, cathode at p2 (current flows p1 -> p2)
    D(p1, p2, o = {}) {
      return part(p1, p2, 8, (c) => `<polygon points="-8,-8 8,0 -8,8" fill="var(--bg-card)"/><line x1="8" y1="-8" x2="8" y2="8"/>`, o);
    },
    // Controlled current source (diamond): current flows p1 -> p2 through it
    CS(p1, p2, o = {}) {
      return part(p1, p2, 17, (c) => `<polygon points="-17,0 0,-14 17,0 0,14" fill="var(--bg-card)"/>
        <line x1="-8" y1="0" x2="7" y2="0"/><polyline points="2,-5 8,0 2,5" fill="${c}"/>`, { kind: 'src', ...o });
    },
    // Square / pulse source: + at p1
    Vsq(p1, p2, o = {}) {
      return part(p1, p2, 17, () => `<circle r="17" fill="var(--bg-card)"/><polyline points="-9,5 -9,-5 0,-5 0,5 9,5 9,-5" transform="rotate(-90)" stroke-width="1.3"/>`, { kind: 'src', ...o });
    },
    // Switch between p1 and p2 (drawn open)
    SW(p1, p2, o = {}) {
      return part(p1, p2, 14, (c) => `<circle cx="-14" cy="0" r="2.5" fill="${c}"/><circle cx="14" cy="0" r="2.5" fill="${c}"/><line x1="-14" y1="0" x2="${o.closed ? 14 : 10}" y2="${o.closed ? 0 : -11}"/>`, o);
    },
    // Op-amp: left edge at x, centre y. Inputs at (x, y-14) and (x, y+14); output at (x+60, y).
    opamp(p, o = {}) {
      const [x, y] = p, top = o.plusTop ? '+' : '−', bot = o.plusTop ? '−' : '+';
      return `<polygon points="${x},${y - 30} ${x},${y + 30} ${x + 60},${y}" fill="var(--bg-card)" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/>
        <text x="${x + 9}" y="${y - 9}" class="pm" text-anchor="middle" style="font-size:14px">${top}</text>
        <text x="${x + 9}" y="${y + 19}" class="pm" text-anchor="middle" style="font-size:14px">${bot}</text>`;
    },
    // Ideal transformer centred at x between y1 (top) and y2 (bottom). Primary terminals at x-16, secondary at x+16.
    xfmr(x, y1, y2, o = {}) {
      const coil = (cx, dir) => { let d = `M${cx},${y1}`; const n = 4, h = (y2 - y1) / n; for (let i = 0; i < n; i++) d += ` a6,${h / 2} 0 0 ${dir} 0,${h}`; return `<path d="${d}" fill="none" stroke="var(--ink)" stroke-width="1.6"/>`; };
      return coil(x - 16, 1) + coil(x + 16, 0) +
        `<line x1="${x - 3}" y1="${y1}" x2="${x - 3}" y2="${y2}" stroke="var(--ink)" stroke-width="1.2"/><line x1="${x + 3}" y1="${y1}" x2="${x + 3}" y2="${y2}" stroke="var(--ink)" stroke-width="1.2"/>
        <text x="${x - 30}" y="${(y1 + y2) / 2 + 5}" text-anchor="end" class="sl">${sub(o.l1 || 'N1')}</text><text x="${x + 30}" y="${(y1 + y2) / 2 + 5}" text-anchor="start" class="sl">${sub(o.l2 || 'N2')}</text>`;
    },
    // Simple y-vs-x plot. curves: [{f, c, dash, w}], marks: [{y, t}] horizontal guide lines, xm: [{x, t}]
    plot(o) {
      const W = o.w || 320, H = o.h || 190, L = 46, R = 14, T = 14, B = 30;
      const [x0, x1] = o.x, [y0, y1] = o.y;
      const X = (x) => L + (W - L - R) * (x - x0) / (x1 - x0), Y = (y) => H - B - (H - T - B) * (y - y0) / (y1 - y0);
      let s = `<line x1="${L}" y1="${T}" x2="${L}" y2="${H - B}" stroke="var(--ink)" stroke-width="1.2"/>`;
      const zy = y0 <= 0 && y1 >= 0 ? Y(0) : H - B;
      s += `<line x1="${L}" y1="${f(zy)}" x2="${W - R}" y2="${f(zy)}" stroke="var(--ink)" stroke-width="1.2"/>`;
      (o.marks || []).forEach(m => { s += `<line x1="${L}" y1="${f(Y(m.y))}" x2="${W - R}" y2="${f(Y(m.y))}" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 4"/><text x="${L - 5}" y="${f(Y(m.y) + 4)}" text-anchor="end" class="sv">${m.t}</text>`; });
      (o.xm || []).forEach(m => { s += `<line x1="${f(X(m.x))}" y1="${f(zy - 4)}" x2="${f(X(m.x))}" y2="${f(zy + 4)}" stroke="var(--ink)"/><text x="${f(X(m.x))}" y="${H - B + 14}" text-anchor="middle" class="sv">${m.t}</text>`; });
      (o.curves || []).forEach(cv => {
        const n = cv.n || 240; let d = '';
        for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; const y = Math.max(y0, Math.min(y1, cv.f(x))); d += (i ? 'L' : 'M') + f(X(x)) + ',' + f(Y(y)); }
        s += `<path d="${d}" fill="none" stroke="${cv.c || 'var(--hl)'}" stroke-width="${cv.w || 2.4}" ${cv.dash ? 'stroke-dasharray="5 4"' : ''} stroke-linejoin="round"/>`;
      });
      if (o.xl) s += `<text x="${W - R}" y="${H - 4}" text-anchor="end" class="sv">${o.xl}</text>`;
      if (o.yl) s += `<text x="${L + 6}" y="${T + 2}" class="sl">${o.yl}</text>`;
      return `<svg viewBox="0 0 ${W} ${H}" class="schem plot" xmlns="http://www.w3.org/2000/svg" role="img">${s}</svg>`;
    },
  });
  G.S = S;
})(typeof window !== 'undefined' ? window : globalThis);
