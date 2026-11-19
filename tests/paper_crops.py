# python3 tests/paper_crops.py — rebuilds papers/q/*.png (one cropped image per past-paper question)
# and data/paperpages.js (the PDF page of each). Needs pdfplumber, Pillow and pdftoppm (poppler).
import pdfplumber, glob, re, os, subprocess, tempfile
from PIL import Image, ImageOps
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = 150; s = R / 72
os.makedirs(f'{root}/papers/q', exist_ok=True)
pages = {}
for f in sorted(glob.glob(f'{root}/papers/*_EEEN20020.pdf')):
    m = re.search(r'(\d{4})_(AUT|SPR)', f); code = m.group(2) + m.group(1)[2:]
    with pdfplumber.open(f) as pdf:
        marks, inQ1 = [], False
        footer = []
        for pi, p in enumerate(pdf.pages):
            words = p.extract_words()
            footer.append(min([w['top'] for w in words if re.search(r'UCD|Page \d', w['text'])] or [p.height]))
            lines = {}
            for w in words: lines.setdefault(round(w['top']), []).append(w)
            for top in sorted(lines):
                ws = sorted(lines[top], key=lambda w: w['x0']); txt = ' '.join(w['text'] for w in ws)
                q = re.match(r'Question\s+(\d)', txt)
                if q and ws[0]['x0'] < 120:
                    inQ1 = q.group(1) == '1'; marks.append(('Q1' if inQ1 else q.group(1), pi, top)); continue
                a = re.match(r'\(([a-e])\)', ws[0]['text'])
                if inQ1 and a and ws[0]['x0'] < 110: marks.append((f'1({a.group(1)})', pi, top))
    hdr = {pi: top for lab, pi, top in marks if lab == 'Q1'}
    for lab, pi, top in marks:
        if lab == 'Q1': continue
        t = hdr.get(pi, top) if lab == '1(a)' else top   # show the "Question 1" heading above part (a)
        with tempfile.TemporaryDirectory() as d:
            subprocess.run(['pdftoppm', '-r', str(R), '-gray', '-png', '-f', str(pi + 1), '-l', str(pi + 1), '-singlefile', f, f'{d}/pg'], check=True)
            im = Image.open(f'{d}/pg.png').convert('L')
        im = im.crop((0, max(0, int((t - 14) * s)), im.width, int((footer[pi] - 8) * s)))
        bb = ImageOps.invert(im).point(lambda x: 255 if x > 40 else 0).getbbox(); pad = int(14 * s)
        im = im.crop((max(0, bb[0] - pad), 0, min(im.width, bb[2] + pad), min(im.height, bb[3] + pad))).quantize(16)
        key = code + '-' + lab.replace('(', '').replace(')', '')
        im.save(f'{root}/papers/q/{key}.png', optimize=True); pages[key] = pi + 1
body = ',\n  '.join(f"'{k}': {v}" for k, v in pages.items())
open(f'{root}/data/paperpages.js', 'w').write(f"""// Page number of every past-paper question in its PDF (papers/YYYY_TERM_EEEN20020.pdf).
// The cropped image of each question is papers/q/<key>.png. Built by tests/paper_crops.py.
(function (G) {{
  G.LK.paperPages = {{
  {body}
  }};
}})(typeof window !== 'undefined' ? window : globalThis);
""")
print(len(pages), 'questions cropped')
