/* ============ intro: a pixel figure turns; scrolling disperses it; Get started pulls it back together ============ */
const GW = 66, GH = 53, CELL_ASPECT = 14.65 / 10.8;           // the video's cells are slightly taller than wide
const ORANGE = '#FF5000', BLUE = '#1F3BFF', WHITE = '#FFFFFF';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t); };
const hsh = (x, y) => (((x * 73856093) ^ (y * 19349663)) >>> 0) % 1000 / 1000;
let heroBits = null, heroBox = null, hero = null;
const INTRO = {on:false, phase:'scroll', p:0, target:0, loadStart:0, f0:0, raf:0};
function turnFrames(){
  if(heroBits) return heroBits;
  heroBox = {x0:GW, y0:GH, x1:0, y1:0};
  return heroBits = CLIPS.turn.map(b => { const bin = atob(b), bits = new Uint8Array(GW * GH);
    for(let i = 0; i < bits.length; i++){ const on = (bin.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1; bits[i] = on;
      if(on){ const x = i % GW, y = (i / GW) | 0; if(x < heroBox.x0) heroBox.x0 = x; if(x > heroBox.x1) heroBox.x1 = x; if(y < heroBox.y0) heroBox.y0 = y; if(y > heroBox.y1) heroBox.y1 = y; } }
    return bits; });
}
/* the figure is drawn big and sits high: its head near the top, the torso bleeding off the bottom */
function introGeo(W, H){
  const cw = Math.min(H * 1.12 / (GH * CELL_ASPECT), W * .95 / GW), ch = cw * CELL_ASPECT;
  return {cw, ch, ox:(W - GW * cw) / 2, oy:H - GH * ch};
}
function fitHero(){
  const st = $('istage'), c = hero.c, u = hero.u, d = window.devicePixelRatio || 1;
  c.width = u.width = Math.round(st.clientWidth * d); c.height = u.height = Math.round(st.clientHeight * d);
  hero.d = d; buildUiCache();
}
function drawIntro(frame){
  const c = hero.c, ctx = c.getContext('2d'), W = c.width, H = c.height, fr = turnFrames(), n = fr.length;
  ctx.clearRect(0, 0, W, H);
  const {cw, ch, ox, oy} = introGeo(W, H);
  const k = frame % n, a = fr[k], b = fr[(k + 1) % n], mix = k >= n - 4 ? (k - (n - 4) + 1) / 4 : 0;   // dissolve the last frames into the first so the turn loops cleanly
  const p = INTRO.p, mn = Math.min(W, H);
  ctx.fillStyle = ORANGE;
  for(let y = 0; y < GH; y++) for(let x = 0; x < GW; x++){
    const i = y * GW + x;
    if(!(mix && hsh(x, y) < mix ? b[i] : a[i])) continue;
    let lp = 0;
    if(p > 0){ lp = clamp(p * 1.5 - hsh(x * 3 + 1, y * 5 + 2) * .5); lp = lp * lp * (3 - 2 * lp); }
    if(lp >= .995) continue;
    if(lp === 0){
      const x0 = Math.round(ox + x * cw), y0 = Math.round(oy + y * ch);
      ctx.globalAlpha = 1; ctx.fillRect(x0, y0, Math.round(ox + (x + 1) * cw) - x0, Math.round(oy + (y + 1) * ch) - y0);
      continue;
    }
    const ang = hsh(x, y) * 6.2832, dist = lp * (.12 + hsh(y + 7, x + 3) * .8) * mn, sz = 1 - lp * .45;
    ctx.globalAlpha = 1 - lp * .92;
    ctx.fillRect(ox + x * cw + Math.cos(ang) * dist + lp * W * .05, oy + y * ch + Math.sin(ang) * dist - lp * lp * H * .22, cw * sz, ch * sz);
  }
  ctx.globalAlpha = 1;
}

/* ---- the design-tool layer: rulers, grid, guides, a selection frame, a pen path. It only shows where the cursor is. ---- */
const UIX = {mx:-999, my:-999, x:-999, y:-999, r:0, tr:0, cache:null, scratch:null};
function buildUiCache(){
  const st = $('istage'); if(!st || !hero) return;
  const W = st.clientWidth, H = st.clientHeight, d = hero.d, c = document.createElement('canvas');
  c.width = Math.round(W * d); c.height = Math.round(H * d);
  const x = c.getContext('2d'); x.scale(d, d); x.lineWidth = 1;
  const O = a => `rgba(255,80,0,${a})`, B = a => `rgba(31,59,255,${a})`, G = a => `rgba(35,38,47,${a})`;
  const line = (x1, y1, x2, y2, col) => { x.strokeStyle = col; x.beginPath(); x.moveTo(x1 + .5, y1 + .5); x.lineTo(x2 + .5, y2 + .5); x.stroke(); };
  for(let gx = 0; gx <= W; gx += 24) line(gx, 0, gx, H, gx % 120 === 0 ? O(.2) : O(.09));        // pixel grid
  for(let gy = 0; gy <= H; gy += 24) line(0, gy, W, gy, gy % 120 === 0 ? O(.2) : O(.09));
  const R = 20;                                                                                    // rulers
  x.fillStyle = 'rgba(255,255,255,.82)'; x.fillRect(0, 0, W, R); x.fillRect(0, 0, R, H);
  line(0, R, W, R, G(.35)); line(R, 0, R, H, G(.35));
  x.fillStyle = G(.7); x.font = '700 9px "Space Mono", monospace'; x.textBaseline = 'top';
  for(let t = 0; t <= W; t += 10){ const len = t % 100 === 0 ? 14 : t % 50 === 0 ? 9 : 4; line(t, R - len, t, R, G(.5)); if(t % 100 === 0 && t) x.fillText(String(t), t + 3, 2); }
  for(let t = 0; t <= H; t += 10){ const len = t % 100 === 0 ? 14 : t % 50 === 0 ? 9 : 4; line(R - len, t, R, t, G(.5)); if(t % 100 === 0 && t){ x.save(); x.translate(2, t + 3); x.rotate(-Math.PI / 2); x.fillText(String(t), -x.measureText(String(t)).width, 0); x.restore(); } }
  /* frame around the figure */
  turnFrames(); const g = introGeo(W, H), pad = 12;
  const fx0 = g.ox + heroBox.x0 * g.cw - pad, fx1 = g.ox + (heroBox.x1 + 1) * g.cw + pad, fy0 = g.oy + heroBox.y0 * g.ch - pad, fy1 = Math.min(H - 2, g.oy + (heroBox.y1 + 1) * g.ch + pad);
  line(fx0, 0, fx0, H, B(.3)); line(fx1, 0, fx1, H, B(.3)); line(0, fy0, W, fy0, B(.3)); line(W / 2, 0, W / 2, H, O(.35));        // guides
  x.strokeStyle = B(.9); x.strokeRect(fx0 + .5, fy0 + .5, fx1 - fx0, fy1 - fy0);
  const hs = 7; [[fx0, fy0], [(fx0 + fx1) / 2, fy0], [fx1, fy0], [fx0, (fy0 + fy1) / 2], [fx1, (fy0 + fy1) / 2], [fx0, fy1], [(fx0 + fx1) / 2, fy1], [fx1, fy1]].forEach(([hx, hy]) => {
    x.fillStyle = '#fff'; x.strokeStyle = B(1); x.fillRect(hx - hs / 2 + .5, hy - hs / 2 + .5, hs, hs); x.strokeRect(hx - hs / 2 + .5, hy - hs / 2 + .5, hs, hs); });
  const pill = (txt, px, py, bg, fg) => { x.font = '700 10px "Space Mono", monospace'; const w = x.measureText(txt).width + 14; x.fillStyle = bg; x.fillRect(px, py, w, 18); x.fillStyle = fg; x.textBaseline = 'middle'; x.fillText(txt, px + 7, py + 9.5); x.textBaseline = 'top'; return w; };
  pill('Freelancer', fx0, fy0 - 24, B(1), '#fff');
  pill(`${Math.round(fx1 - fx0)} × ${Math.round(fy1 - fy0)}`, (fx0 + fx1) / 2 - 42, fy1 + 8 < H - 22 ? fy1 + 8 : fy1 - 26, B(1), '#fff');
  /* a pen path with anchors and handles, around the head */
  const hx = (g.ox + (heroBox.x0 + heroBox.x1) / 2 * g.cw), hy = g.oy + heroBox.y0 * g.ch;
  const pts = [[hx - 120, hy + 170], [hx - 70, hy + 20], [hx + 70, hy + 20], [hx + 120, hy + 170]];
  x.strokeStyle = B(.9); x.beginPath(); x.moveTo(pts[0][0] + .5, pts[0][1] + .5); x.bezierCurveTo(pts[1][0] - 40, pts[1][1] - 60, pts[2][0] + 40, pts[2][1] - 60, pts[3][0] + .5, pts[3][1] + .5); x.stroke();
  pts.forEach(([px, py], i) => { x.strokeStyle = B(.6); const hdx = i % 2 ? 40 : -40; line(px, py, px + hdx, py - 60, B(.5)); x.fillStyle = '#fff'; x.beginPath(); x.arc(px + hdx + .5, py - 60 + .5, 3, 0, 6.283); x.fill(); x.stroke(); x.fillStyle = '#fff'; x.strokeStyle = B(1); x.fillRect(px - 3, py - 3, 7, 7); x.strokeRect(px - 3, py - 3, 7, 7); });
  /* floating layer labels */
  pill('Layer 1 · 66 × 53', fx1 + 14, fy0 + 30, '#fff', G(1)); pill('Pixel mask', fx1 + 14, fy0 + 56, '#fff', G(1)); pill('Opacity 100%', fx0 - 118, fy0 + 90, '#fff', G(1));
  const sw = pill('Fill  FF5000', fx0 - 128, fy0 + 116, '#fff', G(1)); x.fillStyle = ORANGE; x.fillRect(fx0 - 126, fy0 + 119, 12, 12);
  UIX.cache = c; UIX.scratch = document.createElement('canvas'); UIX.scratch.width = c.width; UIX.scratch.height = c.height;
}
function drawUi(){
  const u = hero.u, ctx = u.getContext('2d'), d = hero.d;
  UIX.x += (UIX.mx - UIX.x) * .35; UIX.y += (UIX.my - UIX.y) * .35; UIX.r += (UIX.tr - UIX.r) * .16;
  ctx.clearRect(0, 0, u.width, u.height);
  if(!UIX.cache || UIX.r < 2) return;
  const s = UIX.scratch, sx = s.getContext('2d'), W = u.width, H = u.height, x = UIX.x * d, y = UIX.y * d, r = UIX.r * d;
  sx.globalCompositeOperation = 'source-over'; sx.clearRect(0, 0, W, H); sx.drawImage(UIX.cache, 0, 0);
  sx.strokeStyle = 'rgba(31,59,255,.7)'; sx.lineWidth = d;                                         // crosshair + coordinates
  sx.beginPath(); sx.moveTo(x, 0); sx.lineTo(x, H); sx.moveTo(0, y); sx.lineTo(W, y); sx.stroke();
  const label = `x ${Math.round(UIX.x)}   y ${Math.round(UIX.y)}`; sx.font = `700 ${10 * d}px "Space Mono", monospace`; sx.textBaseline = 'middle';
  const lw = sx.measureText(label).width + 14 * d; sx.fillStyle = '#23262F'; sx.fillRect(x + 14 * d, y + 14 * d, lw, 18 * d); sx.fillStyle = '#fff'; sx.fillText(label, x + 21 * d, y + 23.5 * d);
  sx.fillStyle = BLUE; sx.fillRect(x - 3 * d, 0, 7 * d, 20 * d); sx.fillRect(0, y - 3 * d, 20 * d, 7 * d);   // markers on the rulers
  sx.globalCompositeOperation = 'destination-in';                                                   // reveal only under the cursor
  const gr = sx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(.55, 'rgba(0,0,0,.8)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  sx.fillStyle = gr; sx.fillRect(0, 0, W, H);
  ctx.drawImage(s, 0, 0);
}

function updateIntroDom(){
  const msg = $('imsg'); if(!msg) return;
  const p = INTRO.p, b = reduced ? 1 : smooth((p - .9) / .08), gs = $('gs');
  document.querySelectorAll('#imsgh .cc').forEach((el, i) => { const t = reduced ? 1 : smooth((p - .4 - i * .022) / .2); el.style.opacity = t; el.style.transform = `translateY(${(1 - t) * 22}px) scale(${.82 + .18 * t})`; });
  gs.style.opacity = b; gs.style.pointerEvents = b > .5 ? 'auto' : 'none'; gs.tabIndex = b > .5 ? 0 : -1;
  $('icue').style.opacity = INTRO.phase === 'scroll' ? 1 - smooth(p / .12) : 0;
}
function introLoop(ts){
  INTRO.raf = 0;
  if(!INTRO.on || !hero) return;
  const st = $('istage'), el = $('intro');
  if(!st || !el){ INTRO.on = false; return; }
  if(INTRO.phase === 'scroll'){
    const max = Math.max(1, el.offsetHeight - st.clientHeight);
    INTRO.target = reduced ? 0 : clamp(-el.getBoundingClientRect().top / max);
  }
  INTRO.p += (INTRO.target - INTRO.p) * (INTRO.phase === 'assemble' ? .085 : .16);
  if(Math.abs(INTRO.target - INTRO.p) < .002) INTRO.p = INTRO.target;
  let frame = reduced ? 22 : Math.floor(ts / 1000 * 12) % 58;
  if(INTRO.phase === 'assemble' && INTRO.p < .02){            // reassembled: now turn once, as the loading animation
    INTRO.phase = 'load'; INTRO.loadStart = ts; INTRO.f0 = frame; INTRO.p = 0; $('iload').classList.add('on');
  }
  if(INTRO.phase === 'load'){
    const f = Math.floor((ts - INTRO.loadStart) / 1000 * 24);
    if(f >= 58){ enterApp(); return; }
    frame = (INTRO.f0 + f) % 58;
    document.querySelectorAll('.ibar i').forEach((i, n) => i.classList.toggle('on', n < Math.round(f / 58 * 16)));
  }
  drawIntro(frame); drawUi(); updateIntroDom();
  INTRO.raf = requestAnimationFrame(introLoop);
}
function heroSync(){
  const c = $('hero');
  if(!c){ INTRO.on = false; hero = null; return; }
  hero = {c, u:$('uil'), d:1}; INTRO.on = true; fitHero();
  const st = $('istage');
  st.onpointermove = e => { const r = st.getBoundingClientRect(); UIX.mx = e.clientX - r.left; UIX.my = e.clientY - r.top; if(UIX.r < 2){ UIX.x = UIX.mx; UIX.y = UIX.my; } UIX.tr = 250; };
  st.onpointerleave = () => { UIX.tr = 0; };
  if(!INTRO.raf) INTRO.raf = requestAnimationFrame(introLoop);
}
function resetIntro(){ Object.assign(INTRO, {phase:'scroll', p:0, target:0}); document.body.style.overflow = ''; }
function enterApp(){
  INTRO.on = false; document.body.style.overflow = '';
  loadAccount(S.acct); S.mode = 'freelancer'; F.view = 'today'; S.enter = true;
  render(); window.scrollTo(0, 0);
}
/* the headline, set as chips: pills and squares with a few shapes in the gaps. One phrase per row. */
const chipRow = items => `<span class="crow2" aria-hidden="true">${items.map(([t, cls]) => `<span class="cc ${cls}">${t === 'ARROW' ? ico('arrow', 3, '#23262F') : t === 'CHECK' ? ico('check', 3, '#23262F') : t}</span>`).join('')}</span>`;
function vLanding(){
  return `<div class="intro" id="intro"><div class="istage" id="istage">
      <canvas id="hero" aria-hidden="true"></canvas><canvas id="uil" aria-hidden="true"></canvas>
      <div class="itop"><div class="mark"><i></i><span>PAYGUARD</span></div><button class="back" data-a="skipintro">Skip intro ↓</button></div>
      <div class="icue" id="icue">Scroll<span></span></div>
      <div class="imsg" id="imsg"><h1 class="chips-h" id="imsgh" aria-label="Show the work. Get paid. Then hand over the files.">
          ${chipRow([['Show', 'pill w'], ['the', 'sq o'], ['work.', 'pill b'], ['CHECK', 'dot w']])}
          ${chipRow([['', 'sqs b'], ['Get', 'pill o'], ['paid.', 'sq w'], ['', 'dot o']])}
          ${chipRow([['Then', 'sq w'], ['hand', 'pill b'], ['over', 'sq o'], ['the', 'pill w'], ['files.', 'pill o'], ['ARROW', 'dot w']])}
        </h1>
        <button class="blk fill big" id="gs" data-a="begin" tabindex="-1">Get started ${ico('arrow', 3, '#1F3BFF', true)}</button></div>
      <div class="iload" id="iload" role="status"><b>Setting up your desk</b><div class="ibar">${'<i></i>'.repeat(16)}</div></div>
    </div></div>`;
}

/* ============ client link page ============ */
const nowFor = p => { const s = p.stages.find(x => owner(x) === 'client'); return s || null; };
function clientShell(){
  const p = projOf(C.pid) || projects[0];
  if(!p) return `<div class="setup">${emptyBox('No link to open', 'Plan a project as a freelancer first.', 'Go to the landing page', 'landing')}</div>`;
  C.pid = p.id;
  const bar = `<header class="cbar"><div class="mark"><i></i><span>${esc(studio().toUpperCase())}</span><span class="via">via PayGuard</span></div><span class="sp"></span><span class="me">A page for ${esc(p.client)}</span></header>`;
  if(p.phase === 'draft') return bar + `<div class="cwrap" style="margin-top:40px"><div class="note"><span class="lbl">Not ready yet</span>${esc(fname())} hasn't sent this project yet. Check back once you get the link.</div></div>`;
  if(p.phase === 'sent') C.view = 'invite';
  const pages = {home:cHome, invite:cInvite, review:cReview, pay:cPay, done:cDone};
  const s = stageIn(p, C.sid) || nowFor(p) || cur(p);
  const v = C.view === 'review' && s.state !== 'review' ? 'home'
    : C.view === 'pay' && !(s.state === 'deposit' || (s.state === 'approved' && payScope(p, s).ready)) ? (s.state === 'unlocked' ? 'done' : 'home')
    : C.view === 'done' && s.state !== 'unlocked' ? 'home' : C.view;
  C.view = v;
  return bar + pages[v](p, s);
}
const cgo = (view, sid) => { if(view === 'pay') pay = {method:'upi', phase:'form'}; C.view = view; if(sid) C.sid = sid; window.scrollTo(0, 0); render(); };

function cHome(p){
  const f = fname(), n = nowFor(p), all = p.stages.every(s => ['unlocked','closed'].includes(s.state));
  const paidSoFar = p.stages.filter(s => s.state === 'unlocked').reduce((a, s) => a + (s.paidAmt || 0), 0) + (p.advancePaid ? advanceAmt(p) : 0);
  let now;
  if(n && n.state === 'review'){ const rb = replyBy(n, p);
    now = {lbl:`Needs you · reply by ${fmtW(rb)}`, h:`Review ${n.name}`, t:`Previews v${n.versions.length} are ready.`, b:'Review', fn:() => cgo('review', n.id), late:lateChip(n, p)};
  } else if(n && n.state === 'approved'){ const sc = payScope(p, n), pb = payBy(n, p);
    now = sc.ready ? {lbl:`Needs you · pay by ${fmtW(pb)}`, h:`Pay ${inr(sc.amt)} to unlock`, t:`${sc.list.map(x => x.name).join(', ')} approved. Files unlock on payment.`, b:`Pay ${inr(sc.amt)}`, fn:() => cgo('pay', n.id), late:lateChip(n, p)}
      : {lbl:'Approved', h:'Waiting on the other stages', t:'Pay once every stage is approved.', late:''};
  } else if(n && n.state === 'deposit'){
    now = {lbl:`Needs you · advance by ${fmtW(n.depBy)}`, h:`Pay the advance of ${inr(advanceAmt(p))}`, t:`Goes straight to ${f}. Credited to your first payment.`, b:`Pay ${inr(advanceAmt(p))}`, fn:() => cgo('pay', n.id), late:lateChip(n, p)};
  } else {
    const c2 = p.stages.find(s => owner(s) === 'you' && s.state !== 'next') || p.stages.find(s => s.state === 'next');
    const di = c2 && dueInfo(c2, p);
    const claimed = p.stages.find(s => s.state === 'approved' && s.claimed);
    now = all ? {lbl:'All done', h:'Everything is unlocked', t:'Every stage is paid.', late:''}
      : claimed ? {lbl:'Waiting on ' + f, h:`${f} will confirm`, t:'Files unlock once confirmed.', late:''}
      : {lbl:'Nothing for you now', h:`${f} is on ${c2 ? c2.name : 'it'}`, t: di && di.date ? `${di.label} ${fmtW(di.date)}.` : '', late:c2 ? lateChip(c2, p) : ''};
  }
  const nowI = now.fn ? reg(now.fn) : -1;
  const ev = events(p).filter(e => e.type !== 'paid' || true).slice(-8);
  const rcpt = p.stages.filter(s => s.state === 'unlocked' && s.paidAmt > 0);
  const unl = p.stages.filter(s => s.state === 'unlocked');
  return `<section class="chero"><span class="lbl">${esc(studio())}_</span><h1>${esc(p.name)}</h1><p>${p.stages.length} stage${p.stages.length > 1 ? 's' : ''} · ${inr(total(p))}</p></section>
    <div class="cwrap">
      <section class="now"><div><span class="lbl">${now.lbl} ${now.late}</span><h2>${now.h}</h2><p>${esc(now.t)}</p></div>${nowI >= 0 ? `<button class="blk fillb" style="font-size:17px;padding:14px 22px" data-a="act:${nowI}">${now.b}</button>` : ''}</section>
      <section class="csec"><h2>Stages</h2>
        ${p.stages.map((s, i) => { const di = dueInfo(s, p), open = C.ex === s.id; return `<button class="jrow" data-a="cex:${s.id}" aria-expanded="${open}"><span class="n">0${i + 1}</span>
          <span><b>${esc(s.name)}</b><span class="meta">${slabFor(s)} ${lateChip(s, p)}${di && di.date ? `<span>${di.label} ${fmt(di.date)}</span>` : ''}</span></span><span class="amt">${inr(s.price)}</span></button>
          ${open ? `<div class="jx"><ul class="plain">${s.scope.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
            ${s.state === 'unlocked' ? finalFilesHTML(s) : previewsOf(s).length ? `<ul class="plain files">${previewsOf(s).map(f2 => `<li><span><span class="kind p">PREVIEW</span>${esc(f2.n)}</span><span>${mbLabel(f2.mb)}</span></li>`).join('')}</ul>` : ''}
            </div>` : ''}`; }).join('')}</section>
      <div class="cgrid"><section class="csec"><h2>Dates</h2>
          ${ev.length ? `<ul class="dateslist">${ev.map(e => `<li><span class="dd">${fmt(e.d)}</span><span>${esc(evText(e, 'client'))}<small>${rel(e.d)}${e.type !== 'paid' && diff(e.d, today()) < 0 ? ' · late' : ''}</small></span></li>`).join('')}</ul>` : '<p class="muted">No dates yet.</p>'}</section>
        <section class="csec"><h2>Money</h2>
          <div class="ledger"><div><span>Project total</span><b>${inr(total(p))}</b></div><div><span>Paid so far</span><b>${inr(paidSoFar)}</b></div><div class="tot"><span>Still to pay</span><b>${inr(Math.max(0, total(p) - paidSoFar))}</b></div></div>
          ${rcpt.length ? `<ul class="plain files" style="margin-top:14px">${rcpt.map(s => `<li><span>Receipt PG-${String(s.id).padStart(4, '0')} · ${esc(s.name)}</span><button class="blk small" data-a="rcp:${p.id}:${s.id}">View receipt</button></li>`).join('')}</ul>` : ''}
          ${unl.length ? `<p style="margin-top:12px">${arrowLink('cview:done:' + unl[unl.length - 1].id, 'My unlocked files')}</p>` : ''}</section></div>
      <div class="cgrid"><section class="csec"><h2>Rules</h2>
          <dl class="kv"><dt>Reply within</dt><dd>${p.rules.reply} days</dd><dt>Pay within</dt><dd>${p.rules.pay} days</dd><dt>Change rounds</dt><dd>${p.rules.rounds}</dd><dt>Advance</dt><dd>${p.rules.advance ? p.rules.advance + '% · ' + inr(advanceAmt(p)) : 'None'}</dd></dl>
          <p style="margin-top:14px"><button class="blk small" data-a="cview:invite">Read the contract</button></p></section>
        <section class="csec"><h2>What happened</h2>
          <ul class="timeline">${p.log.slice().sort((a, b) => b.t - a.t).slice(0, 8).map(l => `<li><span class="d">${fmt(l.t)}</span><span class="pt ${l.who}"></span><span>${esc(l.text)}</span></li>`).join('')}</ul></section></div>
    </div>`;
}

function cInvite(p){
  const c = first(p), signed = !!p.contract.cBy;
  if(!signed) HOOKS.push(() => wireSign('sg-c'));
  const first1 = p.stages[0];
  return `<div class="split"><div class="split-l">
      <div class="crumbs">${signed ? '<button class="back" data-a="cview:home">← Back to the project</button>' : ''}</div>
      <div class="lbl muted">Invite_ for ${esc(p.client)}</div>
      <h1 class="inv-h">${esc(p.name)}</h1>
      <ol class="inv-stages">${p.stages.map((x, i) => `<li><span class="n">0${i + 1}</span><div><b>${esc(x.name)}</b><div class="inc">${x.scope.map(esc).join(' · ')}</div></div><div class="r"><span class="mono">${inr(x.price)}</span><span class="lbl muted">by ${esc(fmt(x.due))}</span></div></li>`).join('')}</ol>
      <p style="font:700 34px var(--f-ui);letter-spacing:-.02em;margin:14px 0 30px">${inr(total(p))}</p>
      ${contractHTML(p)}</div>
    <div class="split-r"><div class="lbl">How it works</div>
      <h1>You see it first. You pay after.</h1>
      <p class="say">${p.rules.advance ? `Advance ${inr(advanceAmt(p))}, then ` : ''}pay ${p.rules.unlock === 'project' ? inr(total(p)) + ' once' : inr(first1.price) + ' per stage'}.</p>
      <ol class="steps"><li><b>1</b>Review previews</li><li><b>2</b>Approve</li><li><b>3</b>Pay</li><li><b>4</b>Originals unlock</li></ol>
      ${signed ? `<div class="form"><span class="lbl">Signed</span>You signed on ${fmtY(p.contract.cOn)}. You can read the contract any time on the left.</div>`
      : `<div class="form"><span class="lbl">Sign to start</span>${signPadHTML('sg-c', p.client)}
        <div class="acts" style="margin-top:18px"><button class="blk fillb" data-a="csign">Sign and continue</button></div>
        </div>`}
    </div></div>`;
}

const PV_GLYPH = {P:'111101111100100', R:'111101110101101', E:'111100110100111', V:'101101101101010', I:'111010010010111', W:'101101111111101'};
function previewArt(c, name){
  const d = window.devicePixelRatio || 1, w = (c.parentElement.clientWidth || 240) * d, GWp = 48, GHp = 34, cw = Math.max(2, w / GWp);
  c.width = Math.round(GWp * cw); c.height = Math.round(GHp * cw);
  const ctx = c.getContext('2d');
  let h = 7; for(const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => { h = (h * 1664525 + 1013904223) >>> 0; return h / 4294967296; };
  const px = (x, y, col) => { ctx.fillStyle = col; const x0 = Math.round(x * cw), y0 = Math.round(y * cw); ctx.fillRect(x0, y0, Math.round((x + 1) * cw) - x0, Math.round((y + 1) * cw) - y0); };
  ctx.fillStyle = WHITE; ctx.fillRect(0, 0, c.width, c.height);
  const BAY = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
  const cx = 12 + rnd() * 24, cy = 9 + rnd() * 10, r = 7 + rnd() * 6, kind = Math.floor(rnd() * 3), sx = Math.floor(rnd() * 6);
  for(let y = 0; y < GHp; y++) for(let x = 0; x < GWp; x++){
    const g = y / GHp, t = BAY[(y & 3) * 4 + (x & 3)] / 16, dx = x - cx, dy = (y - cy) * 1.35;
    let col = null;
    if(dx * dx + dy * dy < r * r) col = ORANGE;
    else if(g > .5 && (g - .5) > t * .5) col = BLUE;
    else if(kind === 1 && ((x + sx + Math.floor(y / 2)) % 11) < 2) col = ORANGE;
    else if(kind === 2 && y < 6 && x % 4 < 2 && t < .5) col = BLUE;
    if(col) px(x, y, col);
  }
  for(let y = 0; y < GHp; y++) for(let x = 0; x < GWp; x++) if((x + y) % 13 === 0) px(x, y, WHITE);
  const word = 'PREVIEW', bw = word.length * 4 + 3, bx = Math.floor((GWp - bw) / 2), by = 13;
  for(let j = 0; j < 9; j++) for(let i = 0; i < bw; i++) px(bx + i, by + j, WHITE);
  [...word].forEach((ch, k) => { const gl = PV_GLYPH[ch]; for(let j = 0; j < 5; j++) for(let i = 0; i < 3; i++) if(gl[j * 3 + i] === '1') px(bx + 2 + k * 4 + i, by + 2 + j, BLUE); });
}
const wirePv = () => HOOKS.push(() => document.querySelectorAll('canvas[data-pv]').forEach(c => previewArt(c, c.dataset.pv)));

function cReview(p, s){
  const c = first(p), pv = previewsOf(s), tot = mbLabel(pv.reduce((a, f) => a + f.mb, 0)), rb = replyBy(s, p);
  wirePv();
  const approveI = reg(() => ask({
    title:`Approve ${pv.length} preview${pv.length > 1 ? 's' : ''} (v${s.versions.length})?`,
    body:`Files unlock after you pay.`, ok:'Approve',
    onOk:() => { setState(p, s, 'approved', 'client', `${c} approved ${s.name} (v${s.versions.length})`);
      if(payScope(p, s).ready) cgo('pay', s.id); else { toast('Approved. Payment opens after the other stages'); cgo('home'); } }}));
  return `<div class="split"><div class="split-l">
      <div class="crumbs"><button class="back" data-a="cview:home">← Back</button></div>
      <div class="chips"><span class="nm"><i>Review_</i> ${esc(s.name)}</span><span class="no">0${pidx(p, s)}</span></div>
      <div class="manifest"><b>${pv.length} preview file${pv.length > 1 ? 's' : ''}</b><span class="mono">${tot}</span><span class="lock l">FINAL FILES LOCKED</span></div>
      <div class="pvgrid">${pv.map(f => `<figure class="pv"><div class="pvbox"><canvas data-pv="${esc(f.n)}" role="img" aria-label="Watermarked preview of ${esc(f.n)}"></canvas></div>
        <figcaption><b>${esc(f.n)}</b><span>${mbLabel(f.mb)} · ${esc(lockNote(f.n))}</span></figcaption></figure>`).join('')}</div></div>
    <div class="split-r"><div class="lbl">Review · reply by ${fmtW(rb)} ${lateChip(s, p)}</div>
      <h1>Look right?</h1>
      <p class="say">Next: pay ${inr(payScope(p, s).amt)}.</p>
      <div class="acts"><button class="blk" data-a="act:${approveI}">Approve these files</button><button class="blk" data-a="rv:ch" id="rvCh" aria-expanded="false">Ask for changes</button><button class="blk" data-a="rv:pr" id="rvPr" aria-expanded="false">Report a problem</button></div>
      <div id="rvForm" style="margin-top:18px"></div></div></div>`;
}
function openReviewForm(kind){
  const p = projOf(C.pid), s = stageIn(p, C.sid) || nowFor(p), isCh = kind === 'ch', form = $('rvForm'), c = first(p);
  $('rvCh').setAttribute('aria-expanded', isCh); $('rvPr').setAttribute('aria-expanded', !isCh);
  const extra = isCh && s.round + 1 > p.rules.rounds;
  form.innerHTML = `<div class="form">
    ${isCh ? `<label class="lbl" for="rvTxt">Changes</label><textarea class="field" id="rvTxt" rows="4" placeholder="What should change?"></textarea>
      <p class="fine" style="color:var(--g700)">${extra ? 'Extra round. May cost more.' : `Round ${s.round + 1} of ${p.rules.rounds}`}</p>`
    : `<label class="lbl" for="rvWhy">Problem</label><select class="field" id="rvWhy"><option>Wrong files</option><option>Quality issue</option><option>Something else</option></select>
      <label class="lbl fl" for="rvTxt">Details</label><textarea class="field" id="rvTxt" rows="3"></textarea>
      <p class="fine" style="color:var(--g700)">Pauses the clocks.</p>`}
    <div class="acts" style="margin-top:12px"><button class="blk fillb" id="rvSend" disabled>${isCh ? 'Send to ' + esc(fname()) : 'Report the problem'}</button><button class="blk" id="rvX">Cancel</button></div></div>`;
  const t = $('rvTxt'), send = $('rvSend'); t.focus();
  t.oninput = () => { send.disabled = t.value.trim().length < 5; };
  $('rvX').onclick = () => { form.innerHTML = ''; $('rvCh').setAttribute('aria-expanded', 'false'); $('rvPr').setAttribute('aria-expanded', 'false'); };
  send.onclick = () => {
    s.note = (isCh ? '' : $('rvWhy').value + '. ') + t.value.trim();
    if(isCh) s.round++;
    setState(p, s, isCh ? 'changes' : 'hold', 'client', isCh ? `${c} asked for changes (round ${s.round} of ${p.rules.rounds}): “${s.note}”` : `${c} reported a problem: “${s.note}”. Clocks paused`);
    toast(isCh ? `Sent to ${fname()}` : 'Reported. Clocks are paused'); cgo('home');
  };
}

let pay = {method:'upi', phase:'form'}, payTimer = null;
function cPay(p, s){
  const dep = s.state === 'deposit', sc = payScope(p, s);
  const amt = dep ? advanceAmt(p) : sc.amt, f = fname(), c = first(p);
  const names = dep ? 'the advance' : sc.list.map(x => x.name).join(', ');
  const left = `<div class="crumbs">${pay.phase === 'form' ? '<button class="back" data-a="cview:home">← Back</button>' : ''}</div>
    <div class="chips"><span class="nm"><i>${dep ? 'Advance_' : 'Pay_'}</i> ${esc(dep ? p.name : names)}</span><span class="no">${dep ? 'ADV' : '0' + pidx(p, s)}</span></div>
    <div class="bigicon">${ico('lock', 18, '#1F3BFF')}</div>
    <div class="manifest" style="margin-top:28px"><b>${dep ? 'Advance' : 'You get'}</b><span class="mono">${dep ? 'starts the work' : finalSummary(sc.list)}</span><span class="lock l">${dep ? 'CREDITED LATER' : 'LOCKED NOW'}</span></div>
    ${dep ? '' : `<ul class="plain files">${sc.list.map(x => originalsOf(x).map(f => `<li><span><span class="kind o">ORIGINAL</span>${esc(f.n)}</span><span>${mbLabel(f.mb)}</span></li>`).join('') + (x.delivery ? `<li><span>${esc(x.name)}: delivery link</span><span>hidden until you pay</span></li>` : '')).join('') || '<li><span class="muted">The final files unlock the moment you pay.</span></li>'}</ul>`}`;
  let right;
  if(pay.phase === 'wait'){
    right = `<div class="lbl">Pay</div><h1>Confirming…</h1>
      <p class="say">Don't pay again or close this page.</p><div class="pbar" aria-hidden="true">${'<i></i>'.repeat(16)}</div>`;
  } else {
    const M = {
      upi:  `<div class="qrbox">${qrHTML(W.studio.upi || 'unset')}<div><span class="lbl muted">Pay ${esc(f)} on UPI</span><code>${esc(W.studio.upi || 'not set')}</code><button class="blk small" data-a="copyupi">Copy UPI ID</button></div></div>
        <button class="blk" style="font-size:16px;padding:12px 20px" data-a="payNow">I've paid ${inr(amt)}</button>`,
      card: `<p class="say">Card details go on your bank's page.</p><button class="blk" style="font-size:16px;padding:12px 20px" data-a="payNow">Continue to card</button>`,
      bank: `<p class="say">Pay ${esc(f)} directly. ${esc(f)} confirms.</p><button class="blk" style="font-size:16px;padding:12px 20px" data-a="payBank">I've paid another way</button>`
    };
    const m = dep && pay.method === 'bank' ? 'upi' : pay.method;
    right = `<div class="lbl">${dep ? 'Advance' : 'Pay'}</div><h1 class="giant">${inr(amt)}</h1>
      <div class="ledger" style="max-width:520px;margin-bottom:28px">
        <div><span>${dep ? `Advance (${p.rules.advance}% of ${inr(total(p))})` : names}</span><b>${inr(dep ? amt : sc.gross)}</b></div>
        ${!dep && sc.credit ? `<div><span>Advance already paid</span><b>−${inr(sc.credit)}</b></div>` : ''}
        <div><span>PayGuard fee</span><b>₹0</b></div>
        <div class="tot"><span>You pay ${esc(studio())}</span><b>${inr(amt)}</b></div></div>
      <div class="tabs" role="group" aria-label="Payment method" style="margin-bottom:18px">${[['upi','UPI / QR'],['card','Card'],['bank','Another way']].filter(x => !(dep && x[0] === 'bank')).map(x => `<button data-a="pm:${x[0]}" aria-pressed="${m === x[0]}">${x[1]}</button>`).join('')}</div>
      <div class="payform">${M[m]}</div>
      <p class="fine">No fee. Paid direct to ${esc(f)}.</p>`;
  }
  if(pay.phase === 'wait') HOOKS.push(() => {
    const bars = [...document.querySelectorAll('.pbar i')]; let k = 0;
    payTimer = setInterval(() => { bars[k % 16].classList.toggle('on'); k++; }, 110);
    setTimeout(() => {
      clearInterval(payTimer);
      if(C.view !== 'pay' || S.mode !== 'client' || pay.phase !== 'wait') return;
      const via = pay.method === 'card' ? 'Card' : 'UPI';
      if(dep){ p.advancePaid = true; p.credit = advanceAmt(p); setState(p, s, 'progress', 'client', `${c} paid the advance of ${inr(amt)} by ${via}. Work can start`); toast('Advance paid. ' + f + ' can start'); cgo('home'); }
      else { unlockStages(p, sc.list, via, 'client', `${c} paid ${inr(amt)} by ${via}`); cgo('done', s.id); }
    }, 2600);
  });
  return `<div class="split"><div class="split-l">${left}</div><div class="split-r">${right}</div></div>`;
}

function cDone(p, s){
  const no = 'PG-' + String(s.id).padStart(4, '0'), free = s.paidVia === 'Unlocked without payment';
  return `<div class="split"><div class="split-l">
      <div class="crumbs"><button class="back" data-a="cview:home">← Back to the project</button></div>
      <div class="chips"><span class="nm"><i>Unlocked_</i> ${esc(s.name)}</span><span class="no">0${pidx(p, s)}</span></div>
      <div class="bigicon o">${ico('open', 18, '#FFFFFF')}</div>
      ${free ? `<div class="receipt"><span class="lbl muted">Unlocked by ${esc(fname())}</span><p style="margin:8px 0 0;font-size:14px">${esc(fname())} unlocked these files without a payment, so there's no receipt for this stage.</p></div>`
        : `<div class="receipt"><span class="lbl muted">Receipt ${no}</span><dl class="kv"><dt>Paid to</dt><dd>${esc(studio())}</dd><dt>Stage</dt><dd>${esc(s.name)}</dd><dt>Amount</dt><dd>${inr(s.paidAmt)}</dd><dt>Via</dt><dd>${esc(s.paidVia || '—')}</dd><dt>Date</dt><dd>${s.paidOn ? fmtY(s.paidOn) : '—'}</dd></dl></div>`}</div>
    <div class="split-r orange"><div class="lbl">${free ? 'Unlocked' : 'Paid'} · ${esc(studio())}</div>
      <h1>Unlocked</h1>
      <p class="say">Your files are ready.</p>
      <div class="acts" style="margin-bottom:28px">${originalsOf(s).length ? `<button class="blk" data-a="toast:Downloading ${originalsOf(s).length} files">Download all (${originalsOf(s).length})</button>` : ''}${s.paidAmt > 0 ? `<button class="blk" data-a="rcp:${p.id}:${s.id}">View receipt</button>` : ''}<button class="blk" data-a="cview:home">Back to the project</button></div>
      <div class="boxes" style="grid-template-columns:1fr"><section><div style="display:flex;justify-content:space-between"><span class="lbl">Final files</span><span class="lock o">OPEN</span></div>${finalFilesHTML(s)}</section></div></div></div>`;
}
function finalSummary(list){
  const n = list.reduce((a, x) => a + originalsOf(x).length, 0), d = list.filter(x => x.delivery).length;
  return n ? `${n} original file${n > 1 ? 's' : ''}${d ? ' and a delivery link' : ''}` : d ? 'final files by delivery link' : 'the final files';
}
function finalFilesHTML(s){
  const o = originalsOf(s);
  return `${o.length ? `<ul class="plain files dl">${o.map(f => `<li style="align-items:center"><span><span class="kind o">ORIGINAL</span>${esc(f.n)}<br><small class="muted">${mbLabel(f.mb)}</small></span><button class="blk small" data-a="toast:Downloading ${esc(f.n)}">Download</button></li>`).join('')}</ul>` : ''}
    ${s.delivery ? `<p style="margin:12px 0 10px;word-break:break-all;font-weight:700">${esc(s.delivery)}</p><div class="acts"><a class="blk fillb" href="${esc(s.delivery)}" target="_blank" rel="noopener">Open your files</a><button class="blk small" data-a="copytxt:${esc(s.delivery)}">Copy link</button></div>` : ''}
    ${!o.length && !s.delivery ? '<p class="muted" style="font-size:13px;margin:10px 0 0">No final files were added to this stage.</p>' : ''}`;
}
