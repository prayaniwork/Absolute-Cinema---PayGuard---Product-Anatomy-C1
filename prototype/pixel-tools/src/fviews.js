/* ============ ui kit ============ */
const F = {view:'today', pid:0, sid:0, tab:'stages', filt:'all', q:'', cal:{y:TODAY0.getFullYear(), m:TODAY0.getMonth()}, plan:null, made:null};
const C = {pid:0, view:'home', sid:0, ex:0};
const S = {mode:'landing', acct:'new', enter:false};   // landing | freelancer | client (client = a preview of the link)
let ACTS = [], HOOKS = [];
const reg = fn => { ACTS.push(fn); return ACTS.length - 1; };
const projOf = id => projects.find(p => p.id === id);
const stageIn = (p, id) => p.stages.find(s => s.id === id);

const ICONS = {
  lock:  ['..XXXX..','.X....X.','.X....X.','XXXXXXXX','XXXXXXXX','XXX..XXX','XXX..XXX','XXXXXXXX'],
  open:  ['..XXXX..','.X....X.','.X......','XXXXXXXX','XXXXXXXX','XXX..XXX','XXX..XXX','XXXXXXXX'],
  check: ['........','......XX','.....XX.','X...XX..','XX.XX...','.XXX....','..X.....','........'],
  clock: ['..XXXX..','.X.XX.X.','X..XX..X','X..XXX.X','X......X','.X....X.','..XXXX..','........'],
  upload:['...XX...','..XXXX..','.XXXXXX.','...XX...','...XX...','XX.XX.XX','XX....XX','XXXXXXXX'],
  arrow: ['....X...','....XX..','....XXX.','XXXXXXXX','XXXXXXXX','....XXX.','....XX..','....X...'],
  bell:  ['...XX...','..XXXX..','.XXXXXX.','.XXXXXX.','.XXXXXX.','XXXXXXXX','........','...XX...'],
  pin:   ['..XXXX..','.XXXXXX.','.XXXXXX.','..XXXX..','...XX...','...XX...','...X....','...X....']
};
/* pixel icon; with sticker=true it gets a white die-cut border and a hard shadow */
function ico(name, px = 3, col = 'currentColor', sticker = false){
  const pts = []; ICONS[name].forEach((row, y) => [...row].forEach((c, x) => { if(c === 'X') pts.push([x, y]); }));
  let under = '';
  if(sticker){ const seen = new Set(); pts.forEach(([x, y]) => { for(let dx = -1; dx <= 1; dx++) for(let dy = -1; dy <= 1; dy++) seen.add((x + dx) + ',' + (y + dy)); });
    seen.forEach(k => { const [x, y] = k.split(',').map(Number); under += `<rect x="${x}" y="${y}" width="1" height="1" fill="#fff"/>`; }); }
  const top = pts.map(([x, y]) => `<rect x="${x}" y="${y}" width="1" height="1"/>`).join(''), n = sticker ? 10 : 8;
  return `<svg class="ico ${sticker ? 'stk' : ''}" width="${n * px}" height="${n * px}" viewBox="${sticker ? '-1 -1 10 10' : '0 0 8 8'}" fill="${col}" shape-rendering="crispEdges" aria-hidden="true">${under}${top}</svg>`;
}
const arrowBtn = (a, label) => `<button class="arrowbtn" data-a="${a}" aria-label="${esc(label)}" title="${esc(label)}">${ico('arrow', 3, '#1F3BFF', true)}</button>`;
const arrowLink = (a, label) => `<button class="linkarrow" data-a="${a}">${label} ${ico('arrow', 2, '#1F3BFF', true)}</button>`;
const PIN_ROT = [-2.2, 1.6, -1, 2.4, -1.8, 1.1, -2.6, .8];
function pinNotes(ev, as, col){
  return `<div class="pinboard ${col ? 'col' : ''}">${ev.map((e, i) => {
    const late = e.type !== 'paid' && diff(e.d, today()) < 0, pc = late ? '#23262F' : e.type === 'deliver' ? '#FF5000' : '#1F3BFF';
    return `<button class="pn ${e.type} ${late ? 'late' : ''}" style="--r:${PIN_ROT[i % PIN_ROT.length]}deg" data-a="openp:${e.p.id}:${e.s.id}"><span class="pin">${ico('pin', 3, pc, true)}</span>
      <span class="dd">${fmt(e.d)}</span><span class="tt">${esc(evText(e, as))}</span><span class="rr">${WDN[e.d.getDay()]} · ${rel(e.d)}${late ? ' · LATE' : ''}</span></button>`; }).join('')}</div>`;
}
const slabFor = s => { const m = ST[s.state]; return `<span class="slab ${s.state === 'approved' && s.claimed ? 'you' : m.turn}">${m.label}</span>`; };
const lateChip = (s, p) => { const n = lateDays(s, p); return n ? `<span class="late">late ${n}d</span>` : ''; };
function ladder(s){
  const at = LADDER_AT[s.state], t = ST[s.state].turn;
  return `<span class="ladder" title="${ST[s.state].label}">${[0,1,2,3,4].map(i => `<i class="${i <= at ? 'on ' + (i === at ? t : 'done') : ''}"></i>`).join('')}</span>`;
}
function segbar(p){
  return `<span class="segbar">${p.stages.map(s => { const t = ST[s.state].turn; return `<i class="${t === 'next' ? '' : t}" title="${esc(s.name)}: ${ST[s.state].label}"></i>`; }).join('')}</span>`;
}
function toast(t){ const el = $('toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 2200); }
function ask({title, body, ok, onOk}){
  const d = $('dlg');
  d.innerHTML = `<h3>${title}</h3><p>${body}</p><div class="acts"><button class="blk" id="dOk">${ok}</button><button class="blk" id="dNo">Cancel</button></div>`;
  d.showModal();
  $('dNo').onclick = () => d.close();
  $('dOk').onclick = () => { d.close(); onOk(); };
}
const emptyBox = (title, text, cta, a) => `<div class="empty"><h3>${title}</h3><p>${text}</p><button class="blk fill" data-a="${a}">${cta}</button></div>`;
const copyText = (t, msg) => { try{ navigator.clipboard.writeText(t).then(() => toast(msg), () => toast(msg + ' (copy manually)')); }catch(e){ toast(msg); } };
const evText = (e, as) => {
  const c = first(e.p);
  if(as === 'client') return {deliver:`${fname()} delivers ${e.s.name}`, reply:`Your reply on ${e.s.name}`, pay:e.adv ? 'Your advance' : `Your payment for ${e.s.name}`, paid:`You paid for ${e.s.name}`}[e.type];
  return {deliver:`Deliver ${e.s.name}`, reply:`${c} replies on ${e.s.name}`, pay:e.adv ? `${c}'s advance` : `${c} pays for ${e.s.name}`, paid:`${c} paid for ${e.s.name}`}[e.type];
};

/* signature pad */
const SIGN = {};
function signPadHTML(id, who){
  return `<div class="signpad" id="${id}">
    <label class="lbl fl" for="${id}-n" style="margin-top:0">Your full name</label>
    <input class="field" id="${id}-n" autocomplete="off" value="${esc(who || '')}">
    <label class="lbl fl">Signature style</label>
    <div class="tabs" role="group" aria-label="Signature style"><button type="button" data-st="type" aria-pressed="true">Type it</button><button type="button" data-st="draw" aria-pressed="false">Draw it</button></div>
    <div class="sp-draw" hidden style="margin-top:12px"><canvas aria-label="Draw your signature here"></canvas><button class="blk small" type="button" data-clear style="margin-top:8px">Clear</button></div>
  </div>`;
}
function wireSign(id){
  const root = $(id); if(!root) return;
  const st = {kind:'type', strokes:0}, cv = root.querySelector('canvas'), ctx = cv.getContext('2d'), box = root.querySelector('.sp-draw');
  const size = () => { const d = window.devicePixelRatio || 1; cv.width = Math.round(cv.clientWidth * d); cv.height = Math.round(130 * d); ctx.lineWidth = 3 * d; ctx.lineCap = 'round'; ctx.strokeStyle = '#23262F'; st.strokes = 0; };
  let down = false;
  const pos = e => { const r = cv.getBoundingClientRect(), d = cv.width / r.width; return [(e.clientX - r.left) * d, (e.clientY - r.top) * d]; };
  cv.onpointerdown = e => { down = true; cv.setPointerCapture(e.pointerId); const [x, y] = pos(e); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + .1, y + .1); ctx.stroke(); st.strokes++; };
  cv.onpointermove = e => { if(!down) return; const [x, y] = pos(e); ctx.lineTo(x, y); ctx.stroke(); };
  cv.onpointerup = () => { down = false; };
  root.querySelectorAll('[data-st]').forEach(b => b.onclick = () => {
    st.kind = b.dataset.st; box.hidden = st.kind !== 'draw';
    root.querySelectorAll('[data-st]').forEach(x => x.setAttribute('aria-pressed', x === b));
    if(st.kind === 'draw') size();
  });
  root.querySelector('[data-clear]').onclick = size;
  SIGN[id] = { read(){
    const name = $(id + '-n').value.trim();
    if(name.length < 3){ toast('Type your full name to sign'); return null; }
    if(st.kind === 'draw'){ if(!st.strokes){ toast('Draw your signature first'); return null; } return {name, img:cv.toDataURL()}; }
    return {name, img:null};
  }};
}
const sigHTML = (name, img, on) => name
  ? `<div class="sig"><div class="nm">${img ? `<img src="${img}" alt="Signature of ${esc(name)}">` : esc(name)}</div><span class="lbl muted">${esc(name)} · ${fmtY(on)}</span></div>`
  : `<div class="sig"><div class="nm"></div><span class="lbl muted">Not signed yet</span></div>`;
function contractParts(p){
  const r = p.rules;
  return [
    ['Parties', `${W.studio.name} (${studio()}) and ${p.client}.`],
    ['Stages', p.stages.map((s, i) => `${i + 1}. ${s.name}, ${inr(s.price)}, due ${fmt(s.due)}.`).join(' ')],
    ['Price', `Total ${inr(total(p))}.${r.advance ? ` Advance ${r.advance}% (${inr(advanceAmt(p))}) before work starts.` : ''}`],
    ['Review', `Client replies within ${r.reply} days${r.auto ? `, else it is approved ${r.autoDays} days later` : ''}. ${r.rounds} change rounds per stage.`],
    ['Payment', `Pay within ${r.pay} days of approval, ${r.unlock === 'project' ? 'once for the whole project' : 'per stage'}. Files stay locked until paid. Payment goes direct by UPI, QR or card.`],
    ['Ownership', 'Rights pass to the client on payment.'],
    ['PayGuard', 'A tool only. It holds no money and is not a party.']
  ];
}
function contractHTML(p){
  const k = p.contract;
  return `<article class="contract"><span class="lbl muted">Draft · pending legal review</span><h2>Project agreement</h2>
    <ol>${contractParts(p).map(([h, t]) => `<li><b>${h}</b>${esc(t)}</li>`).join('')}</ol>
    <div class="sigs">${sigHTML(k.fBy, k.fImg, k.fOn)}${sigHTML(k.cBy, k.cImg, k.cOn)}</div></article>`;
}

/* ============ freelancer shell ============ */
const clientsList = () => {
  const m = new Map();
  projects.forEach(p => { const c = m.get(p.client) || {name:p.client, contact:p.contact, ps:[]}; c.ps.push(p); m.set(p.client, c); });
  return [...m.values()];
};
function freelancerShell(){
  const nd = needsYou().length;
  const active = projects.filter(p => p.phase !== 'active' || p.stages.some(s => !['unlocked','closed'].includes(s.state))).length;
  const items = [['today','Today',nd],['projects','Projects',active],['calendar','Calendar',null],['payments','Payments',null],['clients','Clients',clientsList().length],['settings','Settings',null]];
  const views = {today:vToday, projects:vProjects, project:vProject, calendar:vCalendar, payments:vPayments, clients:vClients, settings:vSettings, plan:vPlan, sign:vSign, send:vSend, client:vClient};
  const at = F.view === 'project' ? 'projects' : F.view === 'client' ? 'clients' : ['plan','sign','send'].includes(F.view) ? '' : F.view;
  return `<div class="app"><nav class="rail" aria-label="Main">
    <button class="mark" data-a="nav:today"><i></i><span>PAYGUARD</span></button>
    <div class="nav">${items.map(([k, l, n]) => `<button data-a="nav:${k}" ${at === k ? 'aria-current="page"' : ''}>${l}${n == null ? '' : `<span class="ct ${n ? '' : 'z'}">${n}</span>`}</button>`).join('')}</div>
    <button class="blk fill" style="margin-top:16px" data-a="plan">+ New project</button>
    <div class="sp"></div>
    <div class="me"><b>${esc(studio())}</b><span>UPI ${esc(W.studio.upi || 'not set yet')}</span></div></nav>
    <main class="page">${views[F.view](projOf(F.pid))}</main></div>`;
}

/* ============ Today ============ */
function attText(x){
  const {p, s, kind} = x;
  if(kind === 'upi') return 'Needed so clients can pay you.';
  if(kind === 'sign') return 'Contract ready to sign.';
  if(kind === 'sent') return `Waiting for ${first(p)} to sign.`;
  if(['changes','hold'].includes(s.state) && s.note) return `${s.state === 'changes' ? `Round ${s.round} of ${p.rules.rounds}: ` : ''}“${s.note}”`;
  return say(s, p, 'f');
}
function nudge(p, s){
  if(s) s.lastNudge = today();
  log(p, 'you', `Reminder sent to ${first(p)} on WhatsApp`);
  toast(`Reminded ${first(p)}`);
}
function taskPrimary(x){
  const {p, s, kind} = x;
  if(kind === 'upi') return {l:'Add UPI ID', a:'nav:settings'};
  if(kind === 'sign') return {l:'Review and sign', a:`sign:${p.id}`};
  if(kind === 'progress' || kind === 'changes') return {l:kind === 'changes' ? 'Upload new version' : 'Upload work', a:`upload:${p.id}:${s.id}`, up:true};
  if(kind === 'hold') return {l:'Reply to client', a:`openp:${p.id}:${s.id}`};
  if(kind === 'approved') return {l:'Confirm payment', a:`openp:${p.id}:${s.id}`};
  return {l:'Open', a:`openp:${p.id}:${s ? s.id : 0}`};
}
function attRow(x, who){
  const {p, s, kind} = x, pr = taskPrimary(x);
  const open = kind === 'upi' ? 'nav:settings' : kind === 'sign' ? `sign:${p.id}` : `openp:${p.id}:${s ? s.id : 0}`;
  const sub = kind === 'upi' ? '<span class="slab you">Setup</span>'
    : kind === 'sign' || kind === 'sent' ? `<span class="slab ${kind === 'sign' ? 'you' : 'client'}">${kind === 'sign' ? 'Contract not signed' : 'Link sent'}</span>`
    : `<span>Stage ${pidx(p, s)} · ${esc(s.name)}</span>${slabFor(s)}${lateChip(s, p)}`;
  const nudgeI = who === 'client' && p ? reg(() => nudge(p, s)) : -1;
  return `<div class="arow"><div><button class="t" data-a="${open}">${kind === 'upi' ? 'Add your UPI ID' : esc(p.name)}</button>
    <div class="sub">${sub}</div><p>${esc(attText(x))}</p></div>
    <div class="acts">${who === 'client' ? `<button class="blk small" data-a="act:${nudgeI}">${ico('bell', 2, '#FF5000', true)} Remind ${esc(first(p))}</button>${arrowBtn(open, 'Open ' + p.name)}`
      : `<button class="blk fill" data-a="${pr.a}">${pr.up ? ico('upload', 2, '#1F3BFF', true) + ' ' : ''}${pr.l}</button>${pr.a !== open ? arrowBtn(open, 'Open ' + p.name) : ''}`}</div></div>`;
}
function agendaItems(ev, as){
  return ev.map(e => `<button class="ag" data-a="openp:${e.p.id}:${e.s.id}"><b>${esc(evText(e, as))}</b><span>${fmtW(e.d)} · ${rel(e.d)}${e.type !== 'paid' && diff(e.d, today()) < 0 ? ' · LATE' : ''}</span></button>`).join('');
}
const STEPS3 = ['Project details', 'Contract and signature', 'Send the link'];
const stepper = (n, big) => `<ol class="stepper ${big ? 'big' : ''}" aria-label="New project steps">${STEPS3.map((l, i) => `<li class="${i + 1 === n ? 'on' : i + 1 < n ? 'done' : ''}"><b>${i + 1}</b>${l}</li>`).join('')}</ol>`;
function vToday(){
  const nd = needsYou(), wt = waitingOn(), m = moneyAxis();
  const dateLbl = `<span class="lbl">Today_ ${fmtW(today())}</span>`;
  if(!projects.length) return `<header class="ph"><div>${dateLbl}<h1>Let's set up your first project.</h1></div></header>
    <section class="start">${stepper(0, true)}<p>About three minutes.</p>
      <button class="blk fill big" data-a="plan">Set up a project →</button></section>
    ${nd.length ? `<section class="sec"><h2>To do <span class="lbl">${nd.length}</span></h2>${nd.map(x => attRow(x, 'you')).join('')}</section>` : ''}`;
  const ev = events().filter(e => e.type !== 'paid' && diff(e.d, today()) >= -3 && diff(e.d, today()) <= 14).slice(0, 5);
  return `<header class="ph"><div>${dateLbl}<h1>${nd.length ? `${nd.length} thing${nd.length > 1 ? 's' : ''} to do.` : 'You\'re all clear.'}</h1></div>
      <div class="acts"><button class="blk fill" data-a="upload">${ico('upload', 2, '#1F3BFF', true)} Upload work</button><button class="blk" data-a="plan">+ New project</button></div></header>
    <div class="stats"><div><b>${inr(m.awaiting)}</b><span class="lbl">Locked, approved</span></div><div><b>${inr(m.notYet)}</b><span class="lbl">In progress</span></div><div><b>${inr(m.paidOut + m.direct + m.payoutPending)}</b><span class="lbl">Paid</span></div></div>
    <section class="sec"><h2>To do <span class="lbl">${nd.length}</span></h2>${nd.length ? nd.map(x => attRow(x, 'you')).join('') : '<p class="muted">Nothing to do.</p>'}</section>
    <section class="sec"><h2>Waiting on clients <span class="lbl">${wt.length}</span></h2>${wt.length ? wt.map(x => attRow(x, 'client')).join('') : '<p class="muted">Nothing pending.</p>'}</section>
    <section class="sec"><h2>Your projects <span class="lbl">${projects.length}</span></h2>${projRows(projects.slice(0, 5))}${projects.length > 5 ? `<p style="margin-top:10px">${arrowLink('nav:projects', 'All projects')}</p>` : ''}</section>
    <section class="sec"><h2>Coming up</h2>${ev.length ? pinNotes(ev, 'f') : '<p class="muted" style="margin:0">Nothing dated.</p>'}
      <p style="margin-top:10px">${arrowLink('nav:calendar', 'Open the calendar')}</p></section>`;
}

/* ============ Projects ============ */
function projState(p){
  if(p.phase === 'draft') return 'you';
  if(p.phase === 'sent') return 'client';
  if(p.stages.every(s => ['unlocked','closed'].includes(s.state))) return 'done';
  if(p.stages.some(s => owner(s) === 'you' && s.state !== 'next')) return 'you';
  if(p.stages.some(s => owner(s) === 'client')) return 'client';
  return 'you';
}
function projRows(list){
  return `<div class="thead lbl"><span>Project</span><span>Stages</span><span>Now</span><span>Next date</span><span style="text-align:right">Value</span></div>
    ${list.map(p => {
      const s = cur(p), di = p.phase === 'active' ? dueInfo(s, p) : null;
      const now = p.phase === 'draft' ? `<span class="slab you">Contract not signed</span>` : p.phase === 'sent' ? `<span class="slab client">Link sent</span>`
        : `<span>${esc(s.name)}</span><span>${slabFor(s)} ${lateChip(s, p)}</span>`;
      return `<button class="tr" data-a="openp:${p.id}"><div><div class="pt">${esc(p.name)}</div><div class="cl">${esc(p.client)}</div></div>
        <div>${segbar(p)}</div><div class="nowc">${now}</div>
        <div style="font-size:13px">${di && di.date ? `<span class="muted">${di.label}</span><br>${fmt(di.date)}` : '<span class="muted">—</span>'}</div>
        <div class="amt">${inr(total(p))}</div></button>`; }).join('') || '<p class="muted">No projects match.</p>'}`;
}
function vProjects(){
  const q = F.q.toLowerCase();
  const base = projects.filter(p => !q || (p.name + ' ' + p.client).toLowerCase().includes(q));
  const cnt = k => base.filter(p => k === 'all' || projState(p) === k).length;
  const list = base.filter(p => F.filt === 'all' || projState(p) === F.filt);
  const tabs = [['all','All'],['you','Needs you'],['client','With client'],['done','Done']];
  return `<header class="ph"><div><span class="lbl">Projects_ ${projects.length}</span><h1>Projects</h1></div><button class="blk fill" data-a="plan">+ New project</button></header>
    ${!projects.length ? emptyBox('No projects yet', 'Start with one.', '+ New project', 'plan') : `
    <div class="filters"><div class="tabs" role="group" aria-label="Filter">${tabs.map(([k, l]) => `<button data-a="filt:${k}" aria-pressed="${F.filt === k}">${l}<i>${cnt(k)}</i></button>`).join('')}</div>
      <input class="field search" id="q" type="search" placeholder="Search" value="${esc(F.q)}" aria-label="Search projects"></div>
    ${projRows(list)}`}`;
}

/* ============ Project ============ */
function fActions(p, s){
  const out = [], c = first(p);
  const add = (l, fn, cls = '') => out.push({l, i:reg(fn), cls});
  if(p.phase !== 'active') return out;
  switch(s.state){
    case 'next': add('Start this stage', () => { setState(p, s, 'progress', 'you', `Started ${s.name}`); render(); }, 'fill'); break;
    case 'deposit':
      add('Mark advance received', () => { p.advancePaid = true; p.credit = advanceAmt(p); setState(p, s, 'progress', 'you', `Marked ${c}'s advance of ${inr(advanceAmt(p))} as received`); render(); }, 'fill');
      add('Send a reminder', () => nudge(p, s)); break;
    case 'progress': add('Submit previews for review', () => {
      const miss = readiness(s); if(miss.length) return toast('Still needed: ' + miss.join(' and '));
      setState(p, s, 'review', 'you', `${s.name} submitted for review (v${s.versions.length + 1})`); render(); }, 'fill'); break;
    case 'review': add('Send a reminder', () => nudge(p, s)); break;
    case 'changes': add('Resubmit the new version', () => {
      const miss = readiness(s); if(miss.length) return toast('Still needed: ' + miss.join(' and '));
      setState(p, s, 'review', 'you', `${s.name} resubmitted (v${s.versions.length + 1})`); render(); }, 'fill'); break;
    case 'approved': {
      const sc = payScope(p, s);
      if(s.claimed){
        add('Confirm payment received', () => { unlockStages(p, sc.list, 'Another way', 'you', `Confirmed ${c}'s payment received outside PayGuard`); render(); }, 'fill');
        add('Not received yet', () => { s.claimed = false; log(p, 'you', `Said the payment from ${c} has not arrived`); toast('Marked as not received'); render(); });
        break;
      }
      if(sc.ready || p.rules.unlock !== 'project'){
        add('Send payment reminder', () => nudge(p, s));
        add('Extend pay-by by 3 days', () => { s.approvedOn = addDays(s.approvedOn, 3); log(p, 'you', `Extended the pay-by date by 3 days for ${s.name}`); toast('Pay-by moved 3 days'); render(); });
        add('Mark as paid another way', () => ask({title:'Mark as paid another way?', body:'Files unlock now.', ok:'Mark paid',
          onOk:() => { unlockStages(p, sc.list, 'Another way', 'you', 'Marked as paid another way'); render(); }}));
        add('Unlock anyway', () => ask({title:'Unlock without payment?', body:'Files unlock now. This can\'t be undone.', ok:'Unlock anyway',
          onOk:() => { unlockStages(p, sc.list, 'Unlocked without payment', 'you', 'Unlocked without payment'); render(); }}));
        if(lateDays(s, p) > 3) add('Close unpaid', () => ask({title:'Close this stage unpaid?', body:'Files stay locked and expire.', ok:'Close unpaid',
          onOk:() => { setState(p, s, 'closed', 'you', `Closed ${s.name} unpaid`); render(); }}));
      }
      break; }
    case 'unlocked': if(s.paidAmt > 0) add('View receipt', () => openReceipt(p, s)); break;
    case 'hold': add('Reply and resume', () => { setState(p, s, s.prev || 'progress', 'you', 'Replied and resumed'); if(s.prev === 'review') s.submittedOn = today(); render(); }, 'fill'); break;
    case 'closed': add('Reopen this stage', () => { setState(p, s, 'approved', 'you', `Reopened ${s.name}`); render(); }); break;
  }
  return out;
}
/* zone 'preview' takes preview-format files under 50 MB only. zone 'original' exists only when the studio has allowed originals. */
function addFiles(p, s, list, zone, quiet){
  const ok = [], rej = [];
  list.forEach(f => {
    if(zone === 'original'){ if(!W.allowOriginals) rej.push(`${f.n}: originals are off`); else ok.push({n:f.n, mb:f.mb, kind:'original'}); return; }
    if(!PREVIEW_EXT.test(f.n)) rej.push(`${f.n}: not a preview format`);
    else if(f.mb > PREVIEW_MAX_MB) rej.push(`${f.n}: over ${PREVIEW_MAX_MB} MB`);
    else ok.push({n:f.n, mb:f.mb, kind:'preview'});
  });
  const add = ok.reduce((a, f) => a + f.mb, 0);
  if(usedMB() + add > CAP_MB){ rej.push('Storage is full'); ok.length = 0; }
  ok.forEach(f => s.files.push(f));
  if(ok.length) log(p, 'you', `Added ${ok.length} ${zone === 'original' ? 'original' : 'preview'} file${ok.length > 1 ? 's' : ''} to ${s.name}`);
  if(!quiet) render();
  return {ok, rej};
}
const SAMPLE_FILES = [['concept_board.png', 4], ['hero_artwork.jpg', 7], ['motion_test.mp4', 28], ['layout_v3.pdf', 11]];
const SAMPLE_ORIGINALS = [['hero_artwork_master.psd', 96], ['brand_assets.zip', 210], ['source_files.fig', 64]];
let sampleIx = 0;

function stagePanel(p, s){
  const acts = fActions(p, s), di = dueInfo(s, p);
  const canUp = ['progress','changes'].includes(s.state) && p.phase === 'active';
  const used = usedMB();
  return `<div class="spanel"><div>
      <span class="lbl muted">Stage ${pidx(p, s)} of ${p.stages.length} · ${esc(s.name)}</span>
      <h2>${ST[s.state].label}</h2>
      <div class="acts" style="margin:0 0 14px">${slabFor(s)} ${lateChip(s, p)} ${di && di.date ? `<span class="mono muted" style="font-size:12px">${di.label} ${fmtW(di.date)} · ${rel(di.date)}</span>` : ''}</div>
      <p class="say">${esc(say(s, p, 'f'))}</p>
      ${s.note && ['changes','hold'].includes(s.state) ? `<blockquote class="note">“${esc(s.note)}”</blockquote>` : ''}
      ${acts.length ? `<div class="acts">${acts.map(a => `<button class="blk ${a.cls}" data-a="act:${a.i}">${a.l}</button>`).join('')}</div>` : p.phase !== 'active' ? '<p class="muted">Starts after they sign.</p>' : ''}
      <div class="card" style="margin-top:28px"><span class="lbl">Includes</span><ul class="plain">${s.scope.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <dl class="kv"><dt>Price</dt><dd>${inr(s.price)}</dd><dt>Due</dt><dd>${fmtW(s.due)}</dd><dt>Change rounds</dt><dd>${s.round} of ${p.rules.rounds}</dd></dl></div>
    </div><div>
      <div class="card"><div style="display:flex;justify-content:space-between;align-items:center"><span class="lbl">Preview files</span><span class="kind p">PREVIEW</span></div>
        ${previewsOf(s).length ? `<ul class="plain files">${previewsOf(s).map(f => `<li><span>${esc(f.n)}</span><span>${mbLabel(f.mb)}</span></li>`).join('')}</ul>` : '<p class="muted" style="margin:10px 0 0;font-size:13px">None yet.</p>'}
        ${canUp ? `<div class="drop"><button class="blk fill" data-a="upload:${p.id}:${s.id}">${ico('upload', 2, '#1F3BFF', true)} Upload work</button></div>` : ''}</div>
      <div class="card" style="margin-top:24px"><div style="display:flex;justify-content:space-between;align-items:center"><span class="lbl">Final files</span><span class="lock ${s.state === 'unlocked' ? 'o' : 'l'}">${s.state === 'unlocked' ? 'OPEN' : 'LOCKED'}</span></div>
        ${originalsOf(s).length ? `<ul class="plain files">${originalsOf(s).map(f => `<li><span><span class="kind o">ORIGINAL</span>${esc(f.n)}</span><span>${mbLabel(f.mb)}</span></li>`).join('')}</ul>` : ''}
        ${s.delivery ? `<p class="fine" style="word-break:break-all"><span class="lbl">Delivery link</span><br><b>${esc(s.delivery)}</b></p>` : !originalsOf(s).length ? `<p class="muted" style="margin:10px 0 0;font-size:13px">Not added.</p>` : ''}
        <div class="meter" aria-label="Storage used"><i style="width:${Math.min(100, used / CAP_MB * 100)}%"></i></div>
        <span class="lbl muted" style="font-size:11px">${mbLabel(used)} of ${mbLabel(CAP_MB)} used</span></div>
      <div class="card" style="margin-top:24px"><span class="lbl">Version history</span>
        ${s.versions.length ? `<ul class="vlist">${s.versions.slice().reverse().map(v => `<li><span>v${v.v} submitted</span><span class="mono">${fmt(v.on)}</span></li>`).join('')}</ul>` : '<p class="muted" style="margin:10px 0 0;font-size:13px">None yet.</p>'}</div>
    </div></div>`;
}
function vProject(p){
  if(!p) return vProjects();
  const s = stageIn(p, F.sid) || cur(p); F.sid = s.id;
  const tabs = [['stages','Stages'],['files','Files'],['contract','Contract'],['rules','Rules'],['activity','Activity']];
  const k = p.contract;
  const banner = p.phase === 'draft'
    ? `<div class="pbanner"><b>Sign the contract to send the link.</b><button class="blk" data-a="sign:${p.id}">Review and sign</button></div>`
    : p.phase === 'sent'
    ? `<div class="pbanner"><b>Waiting for ${esc(first(p))} to sign.</b><div class="acts"><button class="blk small" data-a="remindp:${p.id}">${ico('bell', 2, '#FF5000', true)} Remind</button><button class="blk small" data-a="seeas:${p.id}">Preview <span class="after">${ico('arrow', 2, '#1F3BFF', true)}</span></button></div></div>` : '';
  let body = '';
  if(F.tab === 'stages') body = `<div class="stagelist">${p.stages.map((x, i) => `<button class="strow" data-a="sel:${x.id}" aria-pressed="${x === s}"><span class="n">0${i + 1}</span>
      <span><b>${esc(x.name)}</b><span class="meta">${slabFor(x)} ${lateChip(x, p)}<span class="mono">${(() => { const d = dueInfo(x, p); return d && d.date ? d.label + ' ' + fmt(d.date) : ''; })()}</span></span></span>
      <span class="mono" style="font-size:15px">${inr(x.price)}</span></button>`).join('')}</div>${stagePanel(p, s)}`;
  if(F.tab === 'files'){
    const rows = p.stages.flatMap(x => x.files.map(f => ({x, f})));
    body = rows.length ? `<div class="scroll"><table class="tbl"><thead><tr><th>File</th><th>Type</th><th>Stage</th><th class="r">Size</th></tr></thead><tbody>${rows.map(({x, f}) =>
      `<tr><td class="mono">${esc(f.n)}</td><td><span class="kind ${f.kind === 'preview' ? 'p' : 'o'}">${f.kind === 'preview' ? 'PREVIEW' : 'ORIGINAL'}</span></td><td>${esc(x.name)}</td><td class="r mono">${mbLabel(f.mb)}</td></tr>`).join('')}</tbody></table></div>
      <div class="meter" style="max-width:420px"><i style="width:${Math.min(100, usedMB() / CAP_MB * 100)}%"></i></div><span class="lbl muted">${mbLabel(usedMB())} of ${mbLabel(CAP_MB)} used</span>`
      : emptyBox('No files yet', 'Upload from a stage in progress.', 'Go to stages', 'tab:stages');
  }
  if(F.tab === 'contract'){
    body = contractHTML(p) + (p.phase === 'draft' ? `<p style="margin-top:22px"><button class="blk fill" data-a="sign:${p.id}">Review and sign</button></p>` : '');
  }
  if(F.tab === 'rules'){
    const r = p.rules, lockd = p.phase === 'active';
    const num = (key, label, min, max) => `<label class="lbl fl" for="r-${key}">${label}</label><input class="field mono" id="r-${key}" type="number" min="${min}" max="${max}" value="${r[key]}" data-rule="${key}">`;
    body = `<div><div class="card" style="max-width:640px"><div class="row2"><div>${num('reply', 'Reply within (days)', 1, 30)}</div><div>${num('pay', 'Pay within (days)', 1, 60)}</div></div>
      <div class="row2"><div>${num('rounds', 'Change rounds', 0, 10)}</div><div>${num('autoDays', 'Auto-approve after (days)', 1, 14)}</div></div>
      <label class="lbl fl">Auto-approve</label><div class="optrow"><button class="opt" data-a="rule:auto:1" aria-pressed="${r.auto}">On</button><button class="opt" data-a="rule:auto:0" aria-pressed="${!r.auto}">Off</button></div>
      <label class="lbl fl">Advance</label><div class="optrow">${[0,10,25,50].map(v => `<button class="opt" ${lockd ? 'disabled' : ''} data-a="rule:advance:${v}" aria-pressed="${r.advance === v}">${v ? v + '%' : 'None'}</button>`).join('')}</div>
      <label class="lbl fl">Unlock</label><div class="optrow"><button class="opt" ${lockd ? 'disabled' : ''} data-a="rule:unlock:stage" aria-pressed="${r.unlock === 'stage'}">Per stage</button><button class="opt" ${lockd ? 'disabled' : ''} data-a="rule:unlock:project" aria-pressed="${r.unlock === 'project'}">Whole project</button></div>
      ${lockd ? '<p class="fine">Advance and unlock are locked after signing.</p>' : ''}</div></div>`;
  }
  if(F.tab === 'activity'){
    const items = p.log.slice().sort((a, b) => b.t - a.t);
    body = items.length ? `<ul class="timeline">${items.map(l => `<li><span class="d">${fmt(l.t)}</span><span class="pt ${l.who}"></span><span>${esc(l.text)}</span></li>`).join('')}</ul>` : '<p class="muted">Nothing yet.</p>';
  }
  return `<button class="back" data-a="nav:projects">← All projects</button>
    <header class="ph" style="margin-top:12px"><div><span class="lbl">${esc(p.client)} · ${esc(p.contact)}</span><h1>${esc(p.name)}</h1>
      <div class="sharebar"><code>${esc(link(p))}</code><button class="blk small" data-a="copyl:${p.id}">Copy link</button><a class="blk small" href="https://wa.me/?text=${encodeURIComponent('Your project page: https://' + link(p))}" target="_blank" rel="noopener">WhatsApp</a><a class="blk small" href="mailto:?subject=${encodeURIComponent(p.name)}&body=${encodeURIComponent('Your project page: https://' + link(p))}">Email</a><button class="blk small" data-a="seeas:${p.id}">Preview <span class="after">${ico('arrow', 2, '#1F3BFF', true)}</span></button></div></div>
      <div><div class="bignum">${inr(total(p))}</div><span class="lbl">${p.stages.length} stage${p.stages.length > 1 ? 's' : ''}</span></div></header>
    ${banner}
    <div class="ptabs" role="group" aria-label="Project sections">${tabs.map(([t, l]) => `<button data-a="tab:${t}" aria-pressed="${F.tab === t}">${l}</button>`).join('')}</div>${body}`;
}
