/* ============ render root ============ */
function demoBar(){
  const m = S.mode;
  if(m === 'client'){ const p = projOf(C.pid); return `<b>PREVIEW</b> What ${esc(p ? first(p) : 'your client')} sees when they open the link <span class="sp"></span><button class="dbtn" data-a="exitprev">← Exit preview</button>`; }
  const inApp = m === 'freelancer';
  return `<b>DEMO</b><b>Account</b>
    <button class="dbtn" aria-pressed="${S.acct === 'new'}" data-a="acct:new">New</button><button class="dbtn" aria-pressed="${S.acct === 'existing'}" data-a="acct:existing">Existing</button>
    <span class="sp"></span>
    ${inApp ? `<b>Today ${fmtW(today())}${shift ? ` (+${shift}d)` : ''}</b><button class="dbtn" data-a="shift:1">+1 day</button><button class="dbtn" data-a="shift:3">+3 days</button>${shift ? '<button class="dbtn" data-a="shift:0">Reset</button>' : ''}` : ''}
    <button class="dbtn" data-a="landing">Intro</button>
    ${inApp ? '<button class="dbtn" data-a="pal">⌘K</button>' : ''}
    <button class="dbtn" data-a="lab">Aa Fonts</button>`;
}
function render(){
  ACTS = []; HOOKS = []; clearInterval(payTimer);
  document.body.dataset.mode = S.mode;
  $('demo').innerHTML = demoBar();
  const app = $('app');
  app.innerHTML = S.mode === 'landing' ? vLanding() : S.mode === 'client' ? clientShell() : freelancerShell();
  app.classList.remove('enter');
  if(S.enter){ void app.offsetWidth; app.classList.add('enter'); S.enter = false; }
  HOOKS.forEach(h => h());
  heroSync();
}
const jump = () => window.scrollTo(0, 0);
function readStudioForm(){
  const v = id => $(id).value.trim(), num = (id, lo, hi, d) => { const n = Math.round(Number($(id).value)); return n >= lo && n <= hi ? n : d; };
  const upi = v('s-upi');
  if(!/^[\w.\-]{2,}@[A-Za-z]{2,}$/.test(upi)){ toast('Enter a UPI ID like name@bank'); $('s-upi').focus(); return false; }
  if(v('s-name').length < 2 || v('s-biz').length < 2){ toast('Add your name and studio name'); return false; }
  Object.assign(W.studio, {name:v('s-name'), biz:v('s-biz'), upi, bank:v('s-bank'), def:{reply:num('s-reply', 1, 30, 3), pay:num('s-pay', 1, 60, 5), rounds:num('s-rounds', 0, 10, 2)}});
  return true;
}
function resetData(){
  projects = []; W.onboarded = false; shift = 0; W.remind = true; W.allowOriginals = false;
  Object.assign(W.studio, {name:'Asha Iyer', biz:'Asha Studio', upi:'asha@okaxis', bank:'', def:{reply:3, pay:5, rounds:2}});
  Object.assign(F, {view:'today', pid:0, sid:0, tab:'stages', filt:'all', q:'', plan:null}); Object.assign(C, {pid:0, view:'home', sid:0, ex:0});
}
function loadAccount(kind){            // 'new': an empty studio with nothing set up.  'existing': a studio with projects already listed.
  resetData();
  if(kind === 'existing') seed();
  else { W.onboarded = true; W.studio.upi = ''; }
}
function resetAll(){ resetData(); S.mode = 'landing'; resetIntro(); }
const cgoFix = cgo;

/* ============ actions (data-a="name:arg:arg") ============ */
const A = {
  nav:(b, v) => { F.view = v; F.plan = v === 'plan' ? null : F.plan; render(); jump(); },
  plan:() => { F.plan = newPlan(); F.view = 'plan'; render(); jump(); },
  openp:(b, pid, sid) => { F.view = 'project'; F.pid = +pid; F.sid = sid ? +sid : 0; F.tab = 'stages'; render(); jump(); },
  sel:(b, sid) => { F.sid = +sid; render(); },
  tab:(b, t) => { F.tab = t; render(); },
  filt:(b, k) => { F.filt = k; render(); },
  cal:(b, n) => { n = +n; if(!n){ F.cal = {y:today().getFullYear(), m:today().getMonth()}; } else { const d = new Date(F.cal.y, F.cal.m + n, 1); F.cal = {y:d.getFullYear(), m:d.getMonth()}; } render(); },
  act:(b, i) => { const fn = ACTS[+i]; if(fn) fn(); },
  rcp:(b, pid, sid) => { const p = projOf(+pid); openReceipt(p, stageIn(p, +sid)); },
  client:(b, name) => { F.view = 'client'; F.cname = decodeURIComponent(name); render(); jump(); },
  allow:(b, v) => { W.allowOriginals = v === '1'; toast(W.allowOriginals ? 'Original uploads allowed' : 'Previews only'); render(); },
  copytxt:(b, ...t) => copyText(t.join(':'), 'Link copied'),
  copyl:(b, pid) => copyText('https://' + link(projOf(+pid)), 'Link copied'),
  remindp:(b, pid) => nudge(projOf(+pid)),
  seeas:(b, pid) => { S.mode = 'client'; C.pid = +pid; C.view = projOf(+pid).phase === 'active' ? 'home' : 'invite'; C.sid = 0; render(); jump(); },
  sign:(b, pid) => { F.view = 'sign'; F.pid = +pid; render(); jump(); },
  dosign:(b, pid) => {
    const sg = SIGN['sg-f'] && SIGN['sg-f'].read(); if(!sg) return;
    const p = projOf(+pid); Object.assign(p.contract, {fBy:sg.name, fOn:today(), fImg:sg.img});
    p.phase = 'sent'; log(p, 'you', 'Contract signed and link sent to ' + first(p));
    F.view = 'send'; F.pid = p.id; render(); jump(); toast('Signed. Now send the link to ' + first(p));
  },
  mkplan:() => createFromPlan(),
  addstage:() => { const st = F.plan.stages, last = st[st.length - 1]; st.push({name:'', scope:'', price:'', due:iso(addDays(last && last.due ? fromIso(last.due) : D(14), 14))}); render(); },
  rmstage:(b, i) => { F.plan.stages.splice(+i, 1); render(); },
  adv:(b, v) => { const pl = F.plan; if(v === 'custom'){ pl.customAdv = true; pl.advance = pl.advance || 15; } else { pl.customAdv = false; pl.advance = +v; } render(); },
  unl:(b, v) => { F.plan.unlock = v; render(); },
  pauto:(b, v) => { F.plan.auto = v === '1'; render(); },
  rule:(b, key, val) => { const p = projOf(F.pid); if(key === 'auto') p.rules.auto = val === '1'; else if(key === 'unlock') p.rules.unlock = val; else p.rules[key] = Number(val); toast('Saved'); render(); },
  remind:(b, v) => { W.remind = v === '1'; render(); },
  savesettings:() => { if(readStudioForm()){ toast('Saved'); render(); } },
  samples:() => { seed(); if(S.mode !== 'freelancer'){ S.mode = 'freelancer'; } F.view = 'today'; render(); jump(); toast('Sample projects loaded'); },
  reset:() => { resetAll(); render(); jump(); },
  toast:(b, ...m) => toast(m.join(':')),
  landing:() => { S.mode = 'landing'; resetIntro(); render(); window.scrollTo(0, 0); },
  acct:(b, k) => { S.acct = k; if(S.mode === 'freelancer'){ loadAccount(k); F.view = 'today'; } render(); },
  begin:() => { if(INTRO.phase !== 'scroll') return; if(reduced) return enterApp(); INTRO.phase = 'assemble'; INTRO.target = 0; document.body.style.overflow = 'hidden'; },
  skipintro:() => window.scrollTo({top:$('intro').offsetHeight, behavior:reduced ? 'auto' : 'smooth'}),
  exitprev:() => { S.mode = 'freelancer'; const p = projOf(C.pid); if(F.view === 'send' && p && p.phase === 'active'){ F.view = 'today'; toast(first(p) + ' signed. The first stage is on your to-do list'); } render(); jump(); },
  upload:(b, pid, sid) => openUpload(pid ? +pid : 0, sid ? +sid : 0),
  shift:(b, n) => { n = +n; shift = n ? shift + n : 0; const k = sweep(); render(); if(k) toast(`${k} automatic reminder${k > 1 ? 's' : ''} sent to clients`); },
  lab:() => { const on = $('lab').classList.toggle('on'); },
  pal:() => openPal(),
  /* client side */
  cview:(b, v, sid) => cgoFix(v, sid ? +sid : 0),
  cex:(b, id) => { C.ex = C.ex === +id ? 0 : +id; render(); },
  rv:(b, k) => openReviewForm(k),
  pm:(b, m) => { pay.method = m; render(); },
  payNow:() => { pay.phase = 'wait'; render(); },
  payBank:() => { const p = projOf(C.pid), s = stageIn(p, C.sid); s.claimed = true; log(p, 'client', `${first(p)} says they paid another way`); toast(`Sent. ${fname()} will confirm when it arrives`); cgo('home'); },
  copyupi:() => copyText(W.studio.upi, 'UPI ID copied'),
  csign:() => {
    const sg = SIGN['sg-c'] && SIGN['sg-c'].read(); if(!sg) return;
    const p = projOf(C.pid); Object.assign(p.contract, {cBy:sg.name, cOn:today(), cImg:sg.img});
    p.accepted = true; p.phase = 'active';
    const s1 = p.stages[0];
    log(p, 'client', `${first(p)} signed the contract`);
    if(p.rules.advance){ s1.state = 'deposit'; s1.depBy = addDays(today(), 3); log(p, 'system', `Advance of ${inr(advanceAmt(p))} due`); C.sid = s1.id; cgoFix('pay', s1.id); }
    else { s1.state = 'progress'; log(p, 'system', `Work started on ${s1.name}`); cgo('home'); }
  }
};
$('app').addEventListener('click', e => {
  const b = e.target.closest('[data-a]'); if(!b) return;
  const [name, ...rest] = b.dataset.a.split(':');
  if(A[name]) A[name](b, ...rest);
});
$('demo').addEventListener('click', e => { const b = e.target.closest('[data-a]'); if(!b) return; const [name, ...rest] = b.dataset.a.split(':'); if(A[name]) A[name](b, ...rest); });
$('demo').addEventListener('change', e => { if(e.target.id === 'cpick'){ C.pid = +e.target.value; C.view = 'home'; C.sid = 0; render(); } });

/* form inputs */
$('app').addEventListener('input', e => {
  const t = e.target;
  if(t.id === 'q'){ F.q = t.value; const pos = t.selectionStart; render(); const q = $('q'); q.focus(); q.setSelectionRange(pos, pos); return; }
  if(t.dataset.pf && F.plan){ const k = t.dataset.pf; F.plan[k] = ['reply','pay','rounds','advance'].includes(k) ? Number(t.value) : t.value; if($('pp')) $('pp').innerHTML = planPreview(); }
  if(t.dataset.ps && F.plan){ const [i, k] = t.dataset.ps.split(':'); F.plan.stages[+i][k] = t.value; if($('pp')) $('pp').innerHTML = planPreview(); }
});
$('app').addEventListener('change', e => {
  const t = e.target;
  if(t.dataset.rule){ const p = projOf(F.pid), n = Math.round(Number(t.value)); if(p && n >= Number(t.min) && n <= Number(t.max)){ p.rules[t.dataset.rule] = n; toast('Saved'); render(); } else toast('That number is out of range'); }
  if(t.dataset.up){ const p = projOf(F.pid), s = stageIn(p, +t.dataset.up); const list = [...t.files].map(f => ({n:f.name, mb:f.size / 1048576})); if(list.length) addFiles(p, s, list); }
});
document.addEventListener('keydown', e => { if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); openPal(); } });
let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if(hero && INTRO.on) fitHero(); document.querySelectorAll('canvas[data-pv]').forEach(c => previewArt(c, c.dataset.pv)); }, 120); });

/* ============ font lab ============ */
const DEF = {display:'Space Mono', ui:'Space Mono'};
const FALL = {display:'ui-monospace, monospace', ui:'ui-monospace, monospace'};
const VAR = {display:'--f-display', ui:'--f-ui'};
const ids = {display:'fDisplay', ui:'fUi'};
function setFont(slot, name){
  name = name.trim(); if(!name) return;
  if(name !== DEF[slot]){
    const mk = href => { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l); return l; };
    const fam = encodeURIComponent(name).replace(/%20/g, '+');
    const l = mk(`https://fonts.googleapis.com/css2?family=${fam}:wght@400;500;600;700&display=swap`);
    l.onerror = () => mk(`https://fonts.googleapis.com/css2?family=${fam}&display=swap`);
  }
  document.documentElement.style.setProperty(VAR[slot], `'${name}', ${FALL[slot]}`);
}
$('fApply').onclick = () => {
  Object.keys(ids).forEach(k => setFont(k, $(ids[k]).value));
  try{ localStorage.setItem('pgpx4-fonts', JSON.stringify(Object.fromEntries(Object.keys(ids).map(k => [k, $(ids[k]).value])))); }catch(e){}
};
$('fReset').onclick = () => {
  Object.keys(ids).forEach(k => { $(ids[k]).value = DEF[k]; document.documentElement.style.removeProperty(VAR[k]); });
  try{ localStorage.removeItem('pgpx4-fonts'); }catch(e){}
};
['Silkscreen','Press Start 2P','VT323','Space Grotesk','Bricolage Grotesque','Martian Mono','Space Mono','Geist Mono'].forEach(n => {
  const b = document.createElement('button'); b.className = 'blk small'; b.textContent = n;
  b.onclick = () => { $('fDisplay').value = n; setFont('display', n); };
  $('presets').appendChild(b);
});
$('fFile').onchange = e => {
  const f = e.target.files[0]; if(!f) return;
  const slot = $('fSlot').value, name = 'Custom-' + slot;
  new FontFace(name, `url(${URL.createObjectURL(f)})`).load().then(ff => { document.fonts.add(ff); $(ids[slot]).value = name; setFont(slot, name); toast('Font loaded: ' + f.name); }).catch(() => toast('Could not read that font file'));
};
try{ const sv = JSON.parse(localStorage.getItem('pgpx4-fonts') || 'null'); if(sv) Object.keys(ids).forEach(k => { $(ids[k]).value = sv[k]; setFont(k, sv[k]); }); }catch(e){}

render();
