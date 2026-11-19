# python3 notes/build.py <page> <out.html>  e.g.  python3 notes/build.py index notes/EEEN_Notes.html
# Serve the repo first (python3 -m http.server 8765 from the repo root). Renders notes/<page>.html and saves
# one self-contained HTML (fonts, exam-paper images and CSS inlined) that opens anywhere and prints to PDF.
import sys, re, base64, os
from playwright.sync_api import sync_playwright
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); n=sys.argv[1]; out=sys.argv[2]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1100,'height':1000})
    pg.goto(f'http://localhost:8765/notes/{n}.html'); pg.wait_for_timeout(1500)
    bodycls=pg.evaluate("document.body.className"); body=pg.eval_on_selector('#doc','e=>e.outerHTML'); title=pg.title(); b.close()
def b64(path,mime): return f'data:{mime};base64,'+base64.b64encode(open(path,'rb').read()).decode()
kcss=open(f'{root}/vendor/katex/katex.min.css').read()
kcss=re.sub(r'src:url\((fonts/[^)]+\.woff2)\) format\("woff2"\)[^;}]*', lambda m:f'src:url({b64(root+"/vendor/katex/"+m.group(1),"font/woff2")}) format("woff2")', kcss)
css=open(f'{root}/css/style.css').read()+'\n'+open(f'{root}/notes/notes.css').read()
body=re.sub(r'src="\.\./(papers/q/[^"]+\.png)"', lambda m:f'src="{b64(root+"/"+m.group(1),"image/png")}"', body)
fit="""<script>function fit(){document.querySelectorAll('.m').forEach(function(m){m.style.fontSize='';var k=m.firstElementChild;if(!k)return;var need=k.scrollWidth,have=m.clientWidth-2;if(need>have&&have>40)m.style.fontSize=Math.max(55,Math.floor(100*have/need))+'%';});}
fit();addEventListener('resize',fit);document.fonts&&document.fonts.ready.then(fit);</script>"""
html=f'<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{title}</title><style>{kcss}</style><style>{css}</style></head><body class="{bodycls}">{body}{fit}</body></html>'
open(out,'w').write(html); print(out, len(html)//1024,'KB')
