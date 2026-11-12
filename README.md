# EEEN20020 Lock-In — Electrical & Electronic Circuits

Exam-cram site for EEEN20020 (UCD). Open `index.html` in a browser, or host the repo root as a static site (no build step).

**Tabs**
- **Exam path** — six topics that cover every question on the 10 past papers (2021–2025). Each has a Learn-it box, core questions, and solutions revealed one step at a time with the reason for each step.
- **Sample exams** — each past paper in order, fully worked, with exam rules and pacing.
- **Mocks** — two fresh papers in the same style with new numbers.
- **All homework** — Homework 0 and basics drills.
- **Exam map** — which topic each question tested.

Every question can be re-done with new numbers. Progress (Got it / Need to redo) is saved in the browser. Keyboard: `J`/`K` question, `N` next step, `H` hint, `G` got it, `R` redo, `S` scramble, `?` help.

**Checking the maths:** `node tests/verify.mjs` runs every worked answer against an independent circuit simulation (DC and phasor nodal analysis, time stepping for transients and diodes), on the paper values plus random sets.

**Files**
- `data/t1…t6_*.js` — questions and solutions per topic; `data/exams.js` — Learn-it boxes, sample exams, mocks, data version
- `homework/`, `papers/` — source PDFs
- `vendor/katex/` — maths rendering (KaTeX, MIT licence)

When data changes, bump `LK.version` in `data/exams.js` and the `?v=` strings in `index.html`.
