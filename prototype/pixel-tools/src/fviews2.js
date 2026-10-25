/* ============ Calendar ============ */
function vCalendar(){
  const {y, m} = F.cal;
  const startOff = (new Date(y, m, 1).getDay() + 6) % 7, dim = new Date(y, m + 1, 0).getDate();
  const weeks = Math.ceil((startOff + dim) / 7);
  const ev = events(), by = {};
  ev.forEach(e => (by[iso(e.d)] = by[iso(e.d)] || []).push(e));
  const t = iso(today());
  let cells = '';
  for(let i = 0; i < weeks * 7; i++){
    const d = new Date(y, m, 1 - startOff + i), k = iso(d), es = by[k] || [], out = d.getMonth() !== m;
    cells += `<div class="day ${out ? 'out' : ''} ${k === t ? 'today' : ''}" aria-label="${fmtW(d)}"><span class="dn">${d.getDate()}</span>
      ${es.slice(0, 3).map(e => `<button class="ev ${e.type} ${e.type !== 'paid' && diff(e.d, today()) < 0 ? 'late' : ''}" title="${esc(evText(e, 'f'))}" data-a="openp:${e.p.id}:${e.s.id}">${esc(evText(e, 'f'))}</button>`).join('')}
      ${es.length > 3 ? `<div class="more">+${es.length - 3} more</div>` : ''}</div>`;
  }
  const over = ev.filter(e => e.type !== 'paid' && diff(e.d, today()) < 0);
  const up = ev.filter(e => e.type !== 'paid' && diff(e.d, today()) >= 0 && diff(e.d, today()) <= 30).slice(0, 10);
  return `<header class="ph"><div><span class="lbl">Calendar_ ${fmtW(today())}</span><h1>Calendar</h1></div></header>
    ${!projects.length ? emptyBox('Nothing on the calendar', 'Dates appear here once a project has stages.', '+ New project', 'plan') : `
    <div class="calhead"><button class="blk small" data-a="cal:-1" aria-label="Previous month">←</button><h2>${MONL[m]} ${y}</h2><button class="blk small" data-a="cal:1" aria-label="Next month">→</button><button class="blk small" data-a="cal:0">Today</button></div>
    <div class="legend"><span><i style="background:var(--orange)"></i>You deliver</span><span><i style="background:var(--blue)"></i>Client replies or pays</span><span><i style="background:var(--g300)"></i>Paid</span><span><i style="border:2px solid var(--g900)"></i>Late</span></div>
    <div class="calwrap"><div class="calgrid">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => `<div class="dow">${d}</div>`).join('')}${cells}</div>
      <aside><h3 style="font:700 15px var(--f-ui);margin:0 0 12px">${over.length ? 'Overdue' : 'Up next'}</h3>${over.length ? pinNotes(over, 'f', true) : ''}${over.length ? '<h3 style="font:700 15px var(--f-ui);margin:22px 0 12px">Next 30 days</h3>' : ''}${up.length ? pinNotes(up, 'f', true) : '<p class="muted" style="font-size:13px;margin:6px 0 0">Nothing dated in the next 30 days.</p>'}</aside></div>`}`;
}

/* ============ Payments ============ */
function moneyState(s, p){
  if(s.state === 'approved') return {t:s.claimed ? 'Paid another way, to confirm' : 'Awaiting payment', c:'client'};
  if(s.state === 'unlocked'){
    if(s.paidVia === 'Unlocked without payment') return {t:'Unlocked without payment', c:'hold'};
    if(s.payout === 'pending') return {t:'Payout on its way', c:'you'};
    if(s.payout === 'direct') return {t:'Paid another way', c:'done'};
    return {t:'Paid out', c:'done'};
  }
  if(s.state === 'closed') return {t:'Closed unpaid', c:'hold'};
  return {t:'Not yet payable', c:'next'};
}
function vPayments(){
  const m = moneyAxis();
  const rows = projects.flatMap(p => p.stages.map(s => ({p, s})));
  const docs = rows.filter(({s}) => s.state === 'unlocked' && s.paidAmt > 0);
  return `<header class="ph"><div><span class="lbl">Payments_ no fee</span><h1>Payments</h1></div></header>
    <div class="tiles4"><div class="tile4 lead"><span class="lbl">Locked and approved</span><div class="n">${inr(m.awaiting)}</div></div>
      <div class="tile4"><span class="lbl">Not payable yet</span><div class="n">${inr(m.notYet)}</div></div>
      <div class="tile4"><span class="lbl">Payout on its way</span><div class="n">${inr(m.payoutPending)}</div></div>
      <div class="tile4"><span class="lbl">Paid out</span><div class="n">${inr(m.paidOut + m.direct)}</div></div></div>
    ${!rows.length ? emptyBox('No payments yet', 'Money appears here once a project has stages.', '+ New project', 'plan') : `
    <section class="sec"><h2>Every stage</h2><div class="scroll"><table class="tbl"><thead><tr><th>Project</th><th>Stage</th><th>Money</th><th>When</th><th class="r">Amount</th></tr></thead><tbody>
      ${rows.map(({p, s}) => { const ms = moneyState(s, p), di = dueInfo(s, p); return `<tr><td><button class="back" style="text-transform:none;font:600 15px var(--f-ui);color:var(--g900)" data-a="openp:${p.id}:${s.id}">${esc(p.name)}</button><div class="mono muted" style="font-size:12px">${esc(p.client)}</div></td>
        <td>${esc(s.name)}</td><td><span class="slab ${ms.c}">${ms.t}</span> ${lateChip(s, p)}</td>
        <td class="mono" style="font-size:12px">${s.state === 'approved' && di && di.date ? 'Pay by ' + fmt(di.date) : s.state === 'unlocked' && s.paidOn ? fmt(s.paidOn) : '—'}</td>
        <td class="r mono">${inr(s.state === 'unlocked' && s.paidAmt ? s.paidAmt : s.price)}</td></tr>`; }).join('')}</tbody></table></div></section>
    <div class="plan"><section class="sec"><h2>Receipts</h2>${docs.length ? `<ul class="plain files">${docs.map(({p, s}) => `<li><span>PG-${String(s.id).padStart(4, '0')} · ${esc(p.name)} · ${esc(s.name)}</span><span><button class="blk small" data-a="rcp:${p.id}:${s.id}">View receipt</button></span></li>`).join('')}</ul>` : '<p class="muted">Receipts appear when a stage is paid.</p>'}</section>
      <section class="sec"><h2>How you get paid</h2><div class="card"><dl class="kv" style="margin-top:0"><dt>UPI ID</dt><dd>${esc(W.studio.upi || 'not set')}</dd><dt>Bank account</dt><dd>${esc(W.studio.bank || 'not set')}</dd><dt>PayGuard fee</dt><dd>₹0 in beta</dd></dl>
        <button class="blk small" data-a="nav:settings" style="margin-top:12px">Edit</button></div></section></div>`}`;
}

/* ============ Clients ============ */
const paidBy = c => c.ps.reduce((a, p) => a + p.stages.filter(s => s.state === 'unlocked').reduce((b, s) => b + (s.paidAmt || 0), 0) + (p.advancePaid ? advanceAmt(p) : 0), 0);
const waitingFrom = c => c.ps.reduce((a, p) => a + p.stages.filter(s => s.state === 'approved').reduce((b, s) => b + s.price, 0), 0);
function vClients(){
  const cs = clientsList();
  return `<header class="ph"><div><span class="lbl">Clients_ ${cs.length}</span><h1>Clients</h1></div><button class="blk fill" data-a="plan">+ New project</button></header>
    ${!cs.length ? emptyBox('No clients yet', 'Clients appear when you plan a project for them.', '+ New project', 'plan') : `
    ${cs.map(c => { const w = waitingFrom(c);
      return `<button class="crow" data-a="client:${encodeURIComponent(c.name)}"><div><div class="cn">${esc(c.name)}</div><div class="cs">${esc(c.contact)}</div></div>
        <div class="cs">${c.ps.length} project${c.ps.length > 1 ? 's' : ''} · billed ${inr(c.ps.reduce((a, p) => a + total(p), 0))}${w ? ` · <b style="color:var(--g900)">${inr(w)} waiting to pay</b>` : ''}</div>${arrowBtnStatic('Open ' + c.name)}</button>`; }).join('')}`}`;
}
const arrowBtnStatic = label => `<span class="arrowbtn" role="img" aria-label="${esc(label)}">${ico('arrow', 3, '#1F3BFF', true)}</span>`;
function vClient(){
  const c = clientsList().find(x => x.name === F.cname); if(!c) return vClients();
  const log2 = c.ps.flatMap(p => p.log.map(l => ({...l, pn:p.name}))).sort((a, b) => b.t - a.t).slice(0, 10);
  return `<button class="back" data-a="nav:clients">← All clients</button>
    <header class="ph" style="margin-top:12px"><div><span class="lbl">Client_ ${esc(c.contact)}</span><h1>${esc(c.name)}</h1></div>
      <div class="acts"><button class="blk small" data-a="copyl:${c.ps[0].id}">Copy link</button><button class="blk small" data-a="seeas:${c.ps[0].id}">Preview their page <span class="after">${ico('arrow', 2, '#1F3BFF', true)}</span></button></div></header>
    <div class="stats"><div><b>${inr(c.ps.reduce((a, p) => a + total(p), 0))}</b><span class="lbl">Billed in total</span></div><div><b>${inr(paidBy(c))}</b><span class="lbl">Paid</span></div><div><b>${inr(waitingFrom(c))}</b><span class="lbl">Waiting to pay</span></div></div>
    <section class="sec"><h2>Projects <span class="lbl">${c.ps.length}</span></h2>${projRows(c.ps)}</section>
    <section class="sec"><h2>Recent activity</h2><ul class="timeline">${log2.map(l => `<li><span class="d">${fmt(l.t)}</span><span class="pt ${l.who}"></span><span>${esc(l.text)} <span class="muted">· ${esc(l.pn)}</span></span></li>`).join('')}</ul></section>`;
}

/* ============ Receipt ============ */
function openReceipt(p, s){
  const d = $('rcp'), no = 'PG-' + String(s.id).padStart(4, '0'), ref = 'PGX' + (s.id * 104729).toString(36).toUpperCase(), credit = s.price - (s.paidAmt || 0);
  d.innerHTML = `<div class="rcpdoc">
      <div class="rh"><div><span class="lbl muted">Receipt</span><h2>${no}</h2></div><div class="stamp">PAID</div></div>
      <div class="rparties"><div><span class="lbl">From</span><b>${esc(studio())}</b>${esc(W.studio.name)}<br>UPI ${esc(W.studio.upi || '—')}</div>
        <div><span class="lbl">To</span><b>${esc(p.client)}</b>${esc(p.contact)}</div>
        <div><span class="lbl">Paid on</span><b>${s.paidOn ? fmtY(s.paidOn) : '—'}</b>by ${esc(s.paidVia || '—')}</div></div>
      <table class="rtab"><thead><tr><th>Description</th><th class="r">Amount</th></tr></thead><tbody>
        <tr><td>${esc(s.name)}<small>${esc(p.name)} · ${s.scope.map(esc).join(', ')}</small></td><td class="r">${inr(s.price)}</td></tr>
        ${credit > 0 ? `<tr><td>Advance already paid<small>Credited against this stage</small></td><td class="r">−${inr(credit)}</td></tr>` : ''}
        <tr><td>PayGuard fee<small>Free in beta</small></td><td class="r">₹0</td></tr>
        <tr class="tot"><td>Total paid</td><td class="r">${inr(s.paidAmt)}</td></tr></tbody></table>
      <dl class="rkv"><dt>Payment method</dt><dd>${esc(s.paidVia || '—')}</dd><dt>Reference</dt><dd>${ref}</dd><dt>Status</dt><dd>Confirmed</dd></dl>
      <p class="fine">Paid direct to the freelancer. PayGuard holds no money.</p></div>
    <div class="rcpact"><button class="blk fill" id="rcpP">Download PDF</button><button class="blk" id="rcpX">Close</button></div>`;
  d.showModal();
  $('rcpX').onclick = () => d.close();
  $('rcpP').onclick = () => { try{ window.print(); }catch(e){ toast('Printing is not available here'); } };
}

/* ============ Settings ============ */
function vSettings(){
  const s = W.studio;
  return `<header class="ph"><div><span class="lbl">Settings_</span><h1>Settings</h1></div></header>
    <div class="plan"><div class="card">
      <span class="lbl">You and your studio</span>
      <label class="lbl fl" for="s-name">Your name</label><input class="field" id="s-name" value="${esc(s.name)}">
      <label class="lbl fl" for="s-biz">Studio name</label><input class="field" id="s-biz" value="${esc(s.biz)}">
      <label class="lbl fl" for="s-upi">UPI ID</label><input class="field mono" id="s-upi" value="${esc(s.upi)}" placeholder="name@bank">
      <label class="lbl fl" for="s-bank">Bank account (optional)</label><input class="field mono" id="s-bank" value="${esc(s.bank)}" placeholder="Account number">
      <span class="lbl" style="display:block;margin-top:22px">New project defaults</span>
      <div class="row2"><div><label class="lbl fl" for="s-reply">Reply within (days)</label><input class="field mono" id="s-reply" type="number" min="1" max="30" value="${s.def.reply}"></div>
      <div><label class="lbl fl" for="s-pay">Pay within (days)</label><input class="field mono" id="s-pay" type="number" min="1" max="60" value="${s.def.pay}"></div></div>
      <label class="lbl fl" for="s-rounds">Change rounds</label><input class="field mono" id="s-rounds" type="number" min="0" max="10" value="${s.def.rounds}" style="max-width:140px">
      <label class="lbl fl">Auto reminders</label><div class="optrow"><button class="opt" data-a="remind:1" aria-pressed="${W.remind}">On</button><button class="opt" data-a="remind:0" aria-pressed="${!W.remind}">Off</button></div>
      <label class="lbl fl">Original uploads</label><div class="optrow"><button class="opt" data-a="allow:0" aria-pressed="${!W.allowOriginals}">Previews only</button><button class="opt" data-a="allow:1" aria-pressed="${W.allowOriginals}">Allow originals</button></div>
      <p class="fine">Off: previews plus a delivery link.</p>
      <div class="acts" style="margin-top:22px"><button class="blk fill" data-a="savesettings">Save settings</button></div></div>
      <div class="card"><span class="lbl">Your payment QR</span><div style="margin-top:12px">${qrHTML(s.upi || 'unset')}</div>
        <hr style="border:0;border-top:3px dotted var(--g300);margin:22px 0"><span class="lbl">Demo</span><div class="acts" style="margin-top:12px"><button class="blk small" data-a="samples">${projects.length ? 'Reload sample projects' : 'Load sample projects'}</button><button class="blk small" data-a="reset">Reset everything</button></div></div></div>`;
}
function qrHTML(seedStr){
  let h = 7; for(const ch of seedStr) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => { h = (h * 1664525 + 1013904223) >>> 0; return h / 4294967296; };
  const N = 25; let r = '';
  const fin = (x, y) => [[0,0],[N-7,0],[0,N-7]].some(([a, b]) => x >= a && x < a + 7 && y >= b && y < b + 7);
  const finOn = (x, y) => [[0,0],[N-7,0],[0,N-7]].some(([a, b]) => { const u = x - a, v = y - b; if(u < 0 || v < 0 || u > 6 || v > 6) return false; return u === 0 || v === 0 || u === 6 || v === 6 || (u >= 2 && u <= 4 && v >= 2 && v <= 4); });
  for(let y = 0; y < N; y++) for(let x = 0; x < N; x++){ const on = fin(x, y) ? finOn(x, y) : rnd() > .52; if(on) r += `<rect x="${x}" y="${y}" width="1" height="1"/>`; }
  return `<svg class="qr" viewBox="-2 -2 ${N + 4} ${N + 4}" fill="#23262F" shape-rendering="crispEdges" role="img" aria-label="Demo payment QR code"><rect x="-2" y="-2" width="${N + 4}" height="${N + 4}" fill="#fff"/>${r}</svg>`;
}

/* ============ Plan (new project) ============ */
const newPlan = () => ({title:'', client:'', contact:'', stages:[{name:'', scope:'', price:'', due:iso(D(14))}], advance:0, customAdv:false, unlock:null, reply:W.studio.def.reply, auto:false, autoDays:2, pay:W.studio.def.pay, rounds:W.studio.def.rounds});
const planTotal = pl => pl.stages.reduce((a, s) => a + (Number(s.price) || 0), 0);
const planUnlock = pl => pl.unlock || (pl.stages.length <= 2 ? 'project' : 'stage');
function planPreview(){
  const pl = F.plan, t = planTotal(pl), u = planUnlock(pl), adv = Math.round(t * pl.advance / 100);
  return `<span class="lbl">Client sees</span>
    <p class="preview-sentence">Review, approve, pay within ${pl.pay} days. Files unlock.</p>
    <dl class="kv"><dt>Total</dt><dd>${inr(t)}</dd><dt>Stages</dt><dd>${pl.stages.length}</dd><dt>Advance</dt><dd>${pl.advance ? pl.advance + '% · ' + inr(adv) : 'None'}</dd><dt>Unlock</dt><dd>${u === 'project' ? 'Whole project' : 'Stage by stage'}</dd><dt>Reply within</dt><dd>${pl.reply} days${pl.auto ? ', then auto-approve' : ''}</dd><dt>Rounds</dt><dd>${pl.rounds} per stage</dd><dt>PayGuard fee</dt><dd>₹0 in beta</dd></dl>`;
}
function vPlan(){
  if(!F.plan) F.plan = newPlan();
  const pl = F.plan, u = planUnlock(pl), sug = pl.stages.length <= 2 ? 'whole project' : 'stage by stage';
  return `<button class="back" data-a="nav:projects">← Cancel</button>
    ${stepper(1)}<header class="ph"><div><span class="lbl">New project_</span><h1>Plan the project</h1></div></header>
    <div class="plan"><div>
      <div class="card"><span class="lbl">Who and what</span>
        <label class="lbl fl" for="pf-title">Title</label><input class="field" id="pf-title" data-pf="title" value="${esc(pl.title)}" placeholder="e.g. Podcast cover art">
        <div class="row2"><div><label class="lbl fl" for="pf-client">Client name</label><input class="field" id="pf-client" data-pf="client" value="${esc(pl.client)}"></div>
        <div><label class="lbl fl" for="pf-contact">WhatsApp or email</label><input class="field" id="pf-contact" data-pf="contact" value="${esc(pl.contact)}"></div></div></div>
      <h2 style="font:700 22px var(--f-ui);margin:30px 0 12px">Stages</h2>
      ${pl.stages.map((s, i) => `<div class="stagerow">${pl.stages.length > 1 ? `<button class="blk small xb" data-a="rmstage:${i}" aria-label="Remove stage ${i + 1}">Remove</button>` : ''}
        <span class="lbl muted">Stage ${i + 1}</span>
        <div class="row2"><div><label class="lbl fl" for="ps-${i}-name">Name</label><input class="field" id="ps-${i}-name" data-ps="${i}:name" value="${esc(s.name)}"></div>
        <div><label class="lbl fl" for="ps-${i}-price">Price (₹)</label><input class="field mono" id="ps-${i}-price" type="number" min="0" data-ps="${i}:price" value="${esc(s.price)}"></div></div>
        <div class="row2"><div><label class="lbl fl" for="ps-${i}-scope">Includes (comma separated)</label><input class="field" id="ps-${i}-scope" data-ps="${i}:scope" value="${esc(s.scope)}"></div>
        <div><label class="lbl fl" for="ps-${i}-due">Due</label><input class="field mono" id="ps-${i}-due" type="date" data-ps="${i}:due" value="${esc(s.due)}"></div></div></div>`).join('')}
      <button class="blk" data-a="addstage">+ Add a stage</button>
      <div class="card" style="margin-top:30px"><span class="lbl">Terms</span>
        <label class="lbl fl">Advance</label><div class="optrow">${[0,10,25,50].map(v => `<button class="opt" data-a="adv:${v}" aria-pressed="${!pl.customAdv && pl.advance === v}">${v ? v + '%' : 'None'}</button>`).join('')}<button class="opt" data-a="adv:custom" aria-pressed="${pl.customAdv}">Custom</button></div>
        ${pl.customAdv ? `<input class="field mono" style="max-width:140px;margin-top:10px" type="number" min="1" max="90" data-pf="advance" value="${pl.advance || ''}" aria-label="Custom advance percent" placeholder="%">` : ''}
        <label class="lbl fl">Unlock</label><div class="optrow"><button class="opt" data-a="unl:stage" aria-pressed="${u === 'stage'}">Per stage</button><button class="opt" data-a="unl:project" aria-pressed="${u === 'project'}">Whole project</button></div>
        <p class="fine">Suggested: ${sug}.</p>
        <div class="row2"><div><label class="lbl fl" for="pf-reply">Reply within (days)</label><input class="field mono" id="pf-reply" type="number" min="1" max="30" data-pf="reply" value="${pl.reply}"></div>
        <div><label class="lbl fl" for="pf-pay">Pay within (days)</label><input class="field mono" id="pf-pay" type="number" min="1" max="60" data-pf="pay" value="${pl.pay}"></div></div>
        <div class="row2"><div><label class="lbl fl" for="pf-rounds">Change rounds</label><input class="field mono" id="pf-rounds" type="number" min="0" max="10" data-pf="rounds" value="${pl.rounds}"></div>
        <div><label class="lbl fl">Auto-approve</label><div class="optrow"><button class="opt" data-a="pauto:1" aria-pressed="${pl.auto}">On</button><button class="opt" data-a="pauto:0" aria-pressed="${!pl.auto}">Off</button></div></div></div></div>
    </div>
    <aside class="sticky"><div class="card" id="pp">${planPreview()}</div>
      <div class="acts" style="margin-top:24px"><button class="blk fill" data-a="mkplan">Next: contract ${ico('arrow', 2, '#1F3BFF', true)}</button></div>
      </aside></div>`;
}
function createFromPlan(){
  const pl = F.plan, bad = [];
  if(pl.title.trim().length < 2) bad.push('a project title');
  if(pl.client.trim().length < 2) bad.push('the client\'s name');
  if(pl.contact.trim().length < 3) bad.push('how to reach them');
  if(pl.stages.some(s => s.name.trim().length < 2 || !(Number(s.price) > 0) || !s.due)) bad.push('a name, price and date on every stage');
  if(bad.length) return toast('Still needed: ' + bad.join(', '));
  const stages = pl.stages.map(s => mkS(s.name.trim(), Number(s.price), 'next', diff(fromIso(s.due), TODAY0),
    s.scope.split(',').map(x => x.trim()).filter(Boolean).length ? s.scope.split(',').map(x => x.trim()).filter(Boolean) : ['As discussed'], []));
  const p = mkP(pl.title.trim(), pl.client.trim(), pl.contact.trim(), {reply:pl.reply, pay:pl.pay, rounds:pl.rounds, auto:pl.auto, autoDays:pl.autoDays, advance:pl.advance, unlock:planUnlock(pl)}, stages,
    {phase:'draft', accepted:false, created:today(), contract:{fBy:null, fOn:null, cBy:null, cOn:null}});
  log(p, 'you', 'Project planned');
  projects.unshift(p); F.plan = null;
  F.view = 'sign'; F.pid = p.id; render(); window.scrollTo(0, 0);
}

/* ============ Sign (freelancer) ============ */
function vSign(){
  const p = projOf(F.pid); if(!p) return vProjects();
  HOOKS.push(() => wireSign('sg-f'));
  return `<button class="back" data-a="plan">← Back to the details</button>
    ${stepper(2)}<header class="ph"><div><span class="lbl">New project_</span><h1>Sign the contract</h1></div></header>
    <div class="plan"><div>${contractHTML(p)}</div>
    <aside class="sticky"><div class="card"><span class="lbl">Your signature</span>${signPadHTML('sg-f', W.studio.name)}
      <div class="acts" style="margin-top:20px"><button class="blk fill" data-a="dosign:${p.id}">Sign</button></div></div></aside></div>`;
}

/* ============ Send the link (step 3) ============ */
function vSend(){
  const p = projOf(F.pid); if(!p) return vProjects();
  const c = first(p), url = 'https://' + link(p);
  return `${stepper(3)}<header class="ph"><div><span class="lbl">Signed_</span><h1>Send to ${esc(c)}</h1></div></header>
    <div class="plan"><div>
      <div class="card"><span class="lbl">Link</span><div class="linkbig">${esc(link(p))}</div>
        <div class="acts"><button class="blk fill" data-a="copyl:${p.id}">Copy link</button>
          <a class="blk" href="https://wa.me/?text=${encodeURIComponent('Your project page: ' + url)}" target="_blank" rel="noopener">WhatsApp</a>
          <a class="blk" href="mailto:?subject=${encodeURIComponent(p.name)}&body=${encodeURIComponent('Your project page: ' + url)}">Email</a></div>
        </div></div>
    <aside class="sticky"><div class="card"><span class="lbl">What ${esc(c)} sees</span><p style="margin:12px 0 0"><button class="blk" data-a="seeas:${p.id}">Preview <span class="after">${ico('arrow', 2, '#1F3BFF', true)}</span></button></p></div>
      <div class="acts" style="margin-top:24px"><button class="blk fill" data-a="openp:${p.id}">Go to project <span class="after">${ico('arrow', 2, '#1F3BFF', true)}</span></button></div></aside></div>`;
}

/* ============ Upload drawer ============ */
const U = {pid:0, sid:0, rej:[]};
const uploadTargets = () => projects.filter(p => p.phase === 'active').flatMap(p => p.stages.filter(s => ['progress','changes'].includes(s.state)).map(s => ({p, s})));
function openUpload(pid, sid){
  const t = uploadTargets();
  if(!t.length) return toast('Nothing to upload yet. A stage that is in progress shows up here.');
  const pick = (pid && t.find(x => x.p.id === pid && x.s.id === sid)) || t[0];
  U.pid = pick.p.id; U.sid = pick.s.id; U.rej = [];
  drawDrawer(); if(!$('drw').open) $('drw').showModal();
}
function drawDrawer(){
  const d = $('drw'), p = projOf(U.pid), s = p && stageIn(p, U.sid), t = uploadTargets();
  if(!s || !['progress','changes'].includes(s.state)){ if(d.open) d.close(); return; }
  const used = usedMB(), prev = previewsOf(s), orig = originalsOf(s), c = first(p);
  const fileLi = f => `<li><span>${esc(f.n)}</span><span>${mbLabel(f.mb)} <button class="blk small" data-rm="${s.files.indexOf(f)}" aria-label="Remove ${esc(f.n)}">Remove</button></span></li>`;
  d.innerHTML = `<div class="drw-h"><span class="lbl">Upload_</span><button class="back" id="drwX">Close ✕</button></div>
    <h2>Upload work</h2>
    <select class="field" id="drwSel" aria-label="Stage">${t.map(x => `<option value="${x.p.id}:${x.s.id}" ${x.s === s ? 'selected' : ''}>${esc(x.p.name)} · ${esc(x.s.name)}</option>`).join('')}</select>
    ${U.rej.length ? `<div class="rule warn">${U.rej.map(esc).join('<br>')}</div>` : ''}
    <div class="zone"><span class="lbl">Previews <span class="hint">PNG, JPG, PDF, video · max ${PREVIEW_MAX_MB} MB</span></span>
      <div class="dz sm" id="dz"><label class="blk fill" style="cursor:pointer">${ico('upload', 2, '#1F3BFF', true)} Choose files<input class="sr" type="file" multiple accept="image/*,video/*,audio/*,.pdf" id="drwFile"></label><button class="blk small" type="button" id="drwSample">Sample</button></div>
      <ul class="plain files drwlist">${prev.map(fileLi).join('')}</ul></div>
    <div class="zone"><span class="lbl">Final files <span class="lock l">LOCKED UNTIL PAID</span></span>
      ${W.allowOriginals ? `<div class="dz sm" id="dzo"><label class="blk" style="cursor:pointer">Choose originals<input class="sr" type="file" multiple id="drwFileO"></label><button class="blk small" type="button" id="drwSampleO">Sample</button></div>
      <ul class="plain files drwlist">${orig.map(fileLi).join('')}</ul>` : ''}
      <input class="field" id="drwDel" placeholder="${W.allowOriginals ? 'Or a delivery link' : 'Delivery link'} (https://…)" value="${esc(s.delivery)}" autocomplete="off" aria-label="Delivery link" style="margin-top:12px">
      ${W.allowOriginals ? '' : '<button class="linkarrow" id="drwSet" type="button">Allow originals ' + ico('arrow', 2, '#1F3BFF', true) + '</button>'}</div>
    <div class="meter" aria-label="Storage used"><i style="width:${Math.min(100, used / CAP_MB * 100)}%"></i></div><span class="lbl muted" style="font-size:11px">${mbLabel(used)} of ${mbLabel(CAP_MB)}</span>
    <div class="acts" style="margin-top:22px"><button class="blk fill" id="drwSubmit">${s.state === 'changes' ? 'Resubmit' : 'Submit for review'}</button><button class="blk" id="drwSave">Save and close</button></div>
    <p class="fine" id="drwNeed"></p>`;
  const refresh = () => { const miss = readiness(s); $('drwSubmit').disabled = miss.length > 0; $('drwNeed').textContent = miss.length ? 'Needs ' + miss.join(' and ') : ''; };
  refresh();
  $('drwX').onclick = $('drwSave').onclick = () => { d.close(); render(); };
  $('drwSel').onchange = e => { const [a, b] = e.target.value.split(':'); U.pid = +a; U.sid = +b; U.rej = []; drawDrawer(); };
  const take = (list, zone) => { if(!list.length) return; const r = addFiles(p, s, list, zone, true); U.rej = r.rej; drawDrawer(); render(); };
  const fl = fs => [...fs].map(f => ({n:f.name, mb:f.size / 1048576}));
  $('drwFile').onchange = e => take(fl(e.target.files), 'preview');
  $('drwSample').onclick = () => { const f = SAMPLE_FILES[sampleIx++ % SAMPLE_FILES.length]; take([{n:f[0], mb:f[1]}], 'preview'); };
  const dz = (id, zone) => { const z = $(id); if(!z) return; z.ondragover = e => { e.preventDefault(); z.classList.add('over'); }; z.ondragleave = () => z.classList.remove('over'); z.ondrop = e => { e.preventDefault(); z.classList.remove('over'); take(fl(e.dataTransfer.files), zone); }; };
  dz('dz', 'preview'); dz('dzo', 'original');
  if(W.allowOriginals){ $('drwFileO').onchange = e => take(fl(e.target.files), 'original'); $('drwSampleO').onclick = () => { const f = SAMPLE_ORIGINALS[sampleIx++ % SAMPLE_ORIGINALS.length]; take([{n:f[0], mb:f[1]}], 'original'); }; }
  const del = $('drwDel');
  del.oninput = () => { s.delivery = del.value.trim(); refresh(); };
  del.onchange = () => { let v = del.value.trim(); if(v && !/^https?:\/\//i.test(v)) v = 'https://' + v; s.delivery = v; del.value = v; refresh(); render(); };
  if($('drwSet')) $('drwSet').onclick = () => { d.close(); F.view = 'settings'; S.mode = 'freelancer'; render(); window.scrollTo(0, 0); };
  d.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { s.files.splice(+b.dataset.rm, 1); drawDrawer(); render(); });
  $('drwSubmit').onclick = () => {
    const miss = readiness(s); if(miss.length) return toast('Still needed: ' + miss.join(' and '));
    const was = s.state; setState(p, s, 'review', 'you', `${s.name} ${was === 'changes' ? 'resubmitted' : 'submitted for review'} (v${s.versions.length + 1})`);
    d.close(); render(); toast(`Submitted. ${c} has ${p.rules.reply} days to reply`);
  };
}

/* ============ ⌘K ============ */
function openPal(){
  if(S.mode !== 'freelancer') return toast('Search is on the freelancer side');
  const d = $('pal'); if(d.open) return;
  d.innerHTML = `<input id="palq" placeholder="Jump to a project, client or page" aria-label="Search" autocomplete="off"><ul id="pall" role="listbox"></ul>`;
  d.showModal();
  let sel = 0, items = [];
  const pages = [['Today','today'],['Projects','projects'],['Calendar','calendar'],['Payments','payments'],['Clients','clients'],['Settings','settings'],['New project','plan']];
  const build = () => {
    const q = $('palq').value.toLowerCase().trim();
    items = [...pages.map(([l, v]) => ({l, k:'Page', fn:() => { F.view = v; if(v === 'plan') F.plan = null; }})),
      ...projects.map(p => ({l:`${p.name} · ${p.client}`, k:'Project', fn:() => { F.view = 'project'; F.pid = p.id; F.sid = 0; F.tab = 'stages'; }})),
      ...clientsList().map(c => ({l:c.name, k:'Client', fn:() => { F.view = 'projects'; F.q = c.name; F.filt = 'all'; }}))]
      .filter(i => !q || i.l.toLowerCase().includes(q)).slice(0, 9);
    sel = Math.min(sel, Math.max(0, items.length - 1));
    $('pall').innerHTML = items.map((i, n) => `<li><button data-n="${n}" role="option" aria-selected="${n === sel}">${esc(i.l)}<span>${i.k}</span></button></li>`).join('') || '<li style="padding:14px;color:var(--g700)">Nothing matches.</li>';
    $('pall').querySelectorAll('button').forEach(b => b.onclick = () => go(+b.dataset.n));
  };
  const go = n => { const i = items[n]; if(!i) return; d.close(); i.fn(); render(); window.scrollTo(0, 0); };
  $('palq').oninput = () => { sel = 0; build(); };
  $('palq').onkeydown = e => {
    if(e.key === 'ArrowDown'){ e.preventDefault(); sel = Math.min(items.length - 1, sel + 1); build(); }
    if(e.key === 'ArrowUp'){ e.preventDefault(); sel = Math.max(0, sel - 1); build(); }
    if(e.key === 'Enter'){ e.preventDefault(); go(sel); }
  };
  build(); $('palq').focus();
}
