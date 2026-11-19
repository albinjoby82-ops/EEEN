# EEEN20020 Lock-In — Electrical & Electronic Circuits

Exam-cram site for EEEN20020 (UCD). Open `index.html` in a browser, or host the repo root as a static site (no build step).

Same layout as MATH_Lock-In: contents on the left, one problem per screen, steps revealed one at a time.

**Modes**
- **Exam path** — six topics that cover every question on the 10 past papers (2021–2025), then two fresh mocks. Each topic opens with a Notes box and check questions.
- **Past papers** — each past paper in order, fully worked, with exam rules and pacing.
- **Off path** — Homework 0 and basics drills.

Every past-paper question (and every mock question) has a **See it on the exam paper** button: it opens the question exactly as printed, side by side with the worked version (bottom half on a phone). Images are in `papers/q/`, rebuilt with `python3 tests/paper_crops.py`.

Every question has a **Similar question** button (same method, new numbers) and a **My notes** box. Progress (Got it / Redo later) is saved in the browser. Keyboard: `Space` next step, `A` full solution, `S` similar question, `O` back to original, `P` exam paper, `←`/`→` previous / next problem.

**Checking the maths:** `node tests/verify.mjs` runs every worked answer against an independent circuit simulation (DC and phasor nodal analysis, time stepping for transients and diodes), on the paper values plus random sets.

**Files**
- `data/t1…t6_*.js` — questions and solutions per topic; `data/exams.js` — Learn-it boxes, sample exams, mocks, data version
- `homework/`, `papers/` — source PDFs
- `vendor/katex/` — maths rendering (KaTeX, MIT licence)

When data changes, bump `LK.version` in `data/exams.js` and the `?v=` strings in `index.html`.
