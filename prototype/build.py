import json
meta = json.load(open('meta.json'))
sprite = open('../design/mascot/mascot-sprite.svg').read()
head = open('head.html').read()
js = open('app.js').read()
out = head + '<script>' + js + '</script>\n'
out = out.replace('<!--SPRITE-->', sprite).replace('/*__META__*/{}', json.dumps(meta, separators=(',', ':')))
open('index.html', 'w').write(out)
print(len(out) // 1024, 'KB')
