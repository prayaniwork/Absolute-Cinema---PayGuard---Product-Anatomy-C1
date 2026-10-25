"""Build prototype/PayGuard-pixel.html from src/ (shell.html + core/fviews/fviews2/cviews/boot .js) and a clips.js.
usage: python3 build_pixel.py clips.js"""
import sys, pathlib
here = pathlib.Path(__file__).parent
src = here / 'src'
js = '\n'.join((src / f).read_text() for f in ['core.js', 'fviews.js', 'fviews2.js', 'cviews.js', 'boot.js'])
html = (src / 'shell.html').read_text().replace('/*CLIPS*/', pathlib.Path(sys.argv[1]).read_text()).replace('/*JS*/', js)
(here.parent / 'PayGuard-pixel.html').write_text(html)
(here.parent / 'pixel-site').mkdir(exist_ok=True)
(here.parent / 'pixel-site' / 'index.html').write_text(html)      # the folder Vercel serves
print('built', len(html), 'bytes')
