import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Potrace } = require('./tr/node_modules/potrace');
const names = fs.readdirSync('masks').filter(f => f.endsWith('.ink.png')).map(f => f.replace('.ink.png',''));
function trace(file, opts) {
  return new Promise((res, rej) => {
    const p = new Potrace(opts);
    p.loadImage(file, err => { if (err) return rej(err); res(p); });
  });
}
const round = d => d.replace(/-?\d+\.\d+/g, m => String(Math.round(parseFloat(m)*10)/10));
const out = {};
for (const n of names) {
  const opts = { turdSize: 50, alphaMax: 1.1, optCurve: true, optTolerance: 0.35, threshold: 128, blackOnWhite: true };
  const ink = await trace(`masks/${n}.ink.png`, opts);
  const sil = await trace(`masks/${n}.sil.png`, { ...opts, turdSize: 200 });
  const dOf = p => { const m = p.getSVG().match(/ d="([^"]+)"/); return m ? round(m[1]) : ''; };
  const vb = ink.getSVG().match(/viewBox="0 0 (\d+) (\d+)"/);
  out[n] = { w: +vb[1], h: +vb[2], ink: dOf(ink), sil: dOf(sil) };
}
fs.writeFileSync('traced.json', JSON.stringify(out));
console.log(Object.keys(out).length, 'traced;', Math.round(fs.statSync('traced.json').size/1024) + ' KB');
