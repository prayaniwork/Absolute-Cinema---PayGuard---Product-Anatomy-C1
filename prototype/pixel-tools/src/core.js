/* ============ helpers ============ */
const $ = id => document.getElementById(id);
const esc = t => String(t == null ? '' : t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
const DAY = 864e5;
const sod = d => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return sod(x); };
const diff = (a, b) => Math.round((sod(a) - sod(b)) / DAY);               // a minus b, in days
const TODAY0 = sod(new Date());
let shift = 0;                                                             // demo time travel
const today = () => addDays(TODAY0, shift);
const D = n => addDays(TODAY0, n);                                         // seed helper
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WDN = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const fmt = d => d.getDate() + ' ' + MON[d.getMonth()];
const fmtW = d => WDN[d.getDay()] + ' ' + fmt(d);
const fmtY = d => fmt(d) + ' ' + d.getFullYear();
const iso = d => d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
const fromIso = s => { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); };
const rel = d => { const n = diff(d, today()); return n === 0 ? 'today' : n === 1 ? 'tomorrow' : n === -1 ? 'yesterday' : n > 0 ? `in ${n} days` : `${-n} days ago`; };
const mbLabel = m => m >= 1024 ? (m/1024).toFixed(1) + ' GB' : m < 1 ? Math.max(1, Math.round(m*1024)) + ' KB' : Math.round(m) + ' MB';

/* ============ workspace + data ============ */
const CAP_MB = 2048;                                                       // storage cap per studio
const PREVIEW_MAX_MB = 50;                                                 // a preview is a reduced copy, never the full-weight file
const PREVIEW_EXT = /\.(png|jpe?g|webp|gif|pdf|mp4|mov|webm|m4v|mp3|wav)$/i;
const kindOf = (n, mb) => PREVIEW_EXT.test(n) && mb <= PREVIEW_MAX_MB ? 'preview' : 'original';
const W = {allowOriginals:false, onboarded:false, studio:{name:'Asha Iyer', biz:'Asha Studio', upi:'asha@okaxis', bank:'', def:{reply:3, pay:5, rounds:2}}, remind:true};
let projects = [];
let uid = 100;

const ST = {
  next:    {label:'Not started',       turn:'next'},
  deposit: {label:'Advance due',       turn:'client'},
  progress:{label:'In progress',       turn:'you'},
  review:  {label:'In review',         turn:'client'},
  changes: {label:'Changes requested', turn:'you'},
  approved:{label:'Awaiting payment',  turn:'client'},
  unlocked:{label:'Unlocked',          turn:'done'},
  hold:    {label:'On hold',           turn:'hold'},
  closed:  {label:'Closed unpaid',     turn:'hold'}
};
const LADDER_AT = {next:-1, deposit:0, progress:1, changes:1, review:2, approved:3, unlocked:4, hold:1, closed:3};

const mkS = (name, price, state, due, scope, files, x = {}) => ({
  id:++uid, name, price, state, due:D(due), scope, files:(files||[]).map(([n,mb,kind]) => ({n, mb, kind:kind || kindOf(n, mb)})), delivery:'',
  round:0, claimed:false, note:'', versions:[], submittedOn:null, approvedOn:null, paidOn:null, paidVia:'', paidAmt:0,
  payout:null, depBy:null, lastNudge:null, prev:null, ...x});
const mkP = (name, client, contact, rules, stages, x = {}) => ({
  id:++uid, name, client, contact, stages, log:[], phase:'active', accepted:true, created:D(-30), credit:0, advancePaid:false,
  contract:{fBy:'Asha Iyer', fOn:D(-30), cBy:client, cOn:D(-29)},
  rules:{reply:3, pay:5, rounds:2, auto:false, autoDays:2, advance:0, unlock:'stage', ...rules}, ...x});
const L = (p, off, who, text) => p.log.push({t:D(off), who, text});

function seed(){
  const a = mkP('Kora Coffee brand identity', 'Meera Nair', 'meera@kora.coffee', {}, [
    mkS('Logo suite', 40000, 'unlocked', -12, ['Primary logo + 3 variants','Icon mark','Colour and mono versions'], [['kora_logo_primary.png',3],['kora_icon_sheet.png',1.2],['kora_variants.pdf',6]],
      {submittedOn:D(-15), approvedOn:D(-11), paidOn:D(-9), paidVia:'UPI', paidAmt:40000, payout:'out', delivery:'https://drive.example.com/kora-logo-suite', versions:[{v:1,on:D(-15),note:''}]}),
    mkS('Brand guide', 25000, 'review', 3, ['24-page PDF guide','Type and colour rules','Do and don\'t spreads'], [['kora_guide_v1.pdf',21],['kora_guide_spreads.png',9]],
      {submittedOn:D(-1), delivery:'https://drive.example.com/kora-brand-guide', versions:[{v:1,on:D(-1),note:''}]}),
    mkS('Packaging', 35000, 'next', 24, ['Cup + sleeve artwork','Bag label','Print-ready files'], [])
  ]);
  L(a,-30,'you','Project created and contract signed'); L(a,-29,'client','Meera signed the contract');
  L(a,-15,'you','Logo suite submitted for review'); L(a,-11,'client','Meera approved Logo suite'); L(a,-9,'client','Meera paid ₹40,000 by UPI. Logo suite unlocked');
  L(a,-1,'you','Brand guide submitted for review (v1)');

  const b = mkP('Aarav Films title cards', 'Aarav Menon', '+91 98200 11876', {unlock:'stage'}, [
    mkS('Storyboard', 18000, 'approved', -2, ['12 frames','Timing notes'], [['storyboard_final.pdf',9],['frames_contact_sheet.jpg',6]], {submittedOn:D(-6), approvedOn:D(-4), delivery:'https://transfer.example.com/aarav-storyboard', versions:[{v:1,on:D(-6),note:''}]}),
    mkS('Final render', 32000, 'next', 20, ['4K title sequence','Alpha version'], [])
  ], {created:D(-20), contract:{fBy:'Asha Iyer', fOn:D(-20), cBy:'Aarav Menon', cOn:D(-20)}});
  L(b,-20,'you','Project created and contract signed'); L(b,-6,'you','Storyboard submitted for review'); L(b,-4,'client','Aarav approved Storyboard. Payment due in 5 days');

  const c = mkP('Lumen app illustrations', 'Dev Kulkarni', 'dev@lumen.app', {rounds:2, auto:true, autoDays:2}, [
    mkS('Illustration set', 30000, 'changes', -3, ['8 spot illustrations','Light and dark versions'], [['lumen_set_v2.png',12],['lumen_dark_mode.png',8]],
      {round:1, delivery:'https://drive.example.com/lumen-set', note:'Make the icons feel softer, less outline.', submittedOn:D(-7), versions:[{v:1,on:D(-7),note:''}]})
  ], {created:D(-26), contract:{fBy:'Asha Iyer', fOn:D(-26), cBy:'Dev Kulkarni', cOn:D(-25)}});
  L(c,-26,'you','Project created and contract signed'); L(c,-7,'you','Illustration set submitted for review (v1)'); L(c,-5,'client','Dev asked for changes (round 1 of 2)');

  const d = mkP('Haat Studio menu design', 'Karan Shah', '+91 99870 45512', {advance:30}, [
    mkS('Menu layout', 22000, 'deposit', 9, ['A3 menu, 2 sides','Drinks insert'], [], {depBy:D(2)}),
    mkS('Print files', 8000, 'next', 16, ['CMYK press-ready PDF'], [])
  ], {created:D(-3), contract:{fBy:'Asha Iyer', fOn:D(-3), cBy:'Karan Shah', cOn:D(-2)}});
  L(d,-3,'you','Project created and contract signed'); L(d,-2,'client','Karan signed. Advance of ₹9,000 due');

  const e = mkP('Zest Fest posters', 'Ira Bose', 'ira@zestfest.in', {}, [
    mkS('Poster series', 28000, 'hold', 5, ['6 posters, A2','Social crops'], [['zest_posters_v1.jpg',14]],
      {prev:'review', delivery:'https://drive.example.com/zest-posters', note:'Wrong files were sent. These are the 2023 posters.', submittedOn:D(-2), versions:[{v:1,on:D(-2),note:''}]})
  ], {created:D(-15), contract:{fBy:'Asha Iyer', fOn:D(-15), cBy:'Ira Bose', cOn:D(-14)}});
  L(e,-15,'you','Project created and contract signed'); L(e,-2,'you','Poster series submitted for review'); L(e,-1,'client','Ira reported a problem. Clocks paused');

  projects = [a, b, c, d, e];
  W.onboarded = true;
}

/* ============ derived ============ */
const total = p => p.stages.reduce((a, x) => a + x.price, 0);
const first = p => p.client.split(' ')[0];
const studio = () => W.studio.biz || 'Your studio';
const fname = () => (W.studio.name || 'You').split(' ')[0];
const advanceAmt = p => Math.round(total(p) * p.rules.advance / 100);
const pidx = (p, s) => p.stages.indexOf(s) + 1;
const owner = s => s.state === 'approved' && s.claimed ? 'you' : s.state === 'hold' ? 'you' : ST[s.state].turn;
const replyBy = (s, p) => s.submittedOn ? addDays(s.submittedOn, p.rules.reply) : null;
const payBy = (s, p) => {
  if(p.rules.unlock === 'project'){
    const ds = p.stages.filter(x => x.state === 'approved' && x.approvedOn).map(x => +x.approvedOn);
    return ds.length ? addDays(new Date(Math.max(...ds)), p.rules.pay) : null;
  }
  return s.approvedOn ? addDays(s.approvedOn, p.rules.pay) : null;
};
function payScope(p, s){
  const proj = p.rules.unlock === 'project';
  const list = proj ? p.stages.filter(x => x.state === 'approved') : [s];
  const ready = proj ? (p.stages.every(x => ['approved','unlocked','closed'].includes(x.state)) && list.length > 0) : s.state === 'approved';
  const gross = list.reduce((a, x) => a + x.price, 0);
  const credit = Math.min(p.credit || 0, gross);
  return {list, ready, gross, credit, amt: gross - credit};
}
function dueInfo(s, p){
  switch(s.state){
    case 'deposit':  return {label:'Advance by', date:s.depBy};
    case 'next':     return {label:'Planned delivery', date:s.due};
    case 'progress': case 'changes': return {label:'Delivery', date:s.due};
    case 'review':   return {label:'Reply by', date:replyBy(s, p)};
    case 'approved': return {label:'Pay by', date:payBy(s, p)};
    case 'unlocked': return {label:'Paid', date:s.paidOn};
    default:         return null;
  }
}
function lateDays(s, p){
  if(['unlocked','closed','next','hold'].includes(s.state)) return 0;
  const di = dueInfo(s, p); if(!di || !di.date) return 0;
  const n = diff(today(), di.date); return n > 0 ? n : 0;
}
const cur = p => p.stages.find(s => !['unlocked','closed'].includes(s.state)) || p.stages[p.stages.length - 1];
const usedMB = () => projects.reduce((a, p) => a + p.stages.reduce((b, s) => b + s.files.reduce((c, f) => c + f.mb, 0), 0), 0);
const WEAK = /\.(txt|md|svg|js|ts|jsx|tsx|css|html|json|csv|py|rb|php|go)$/i;
const lockNote = n => WEAK.test(n) ? 'Preview shows the full work. A screenshot can capture it.' : 'Preview is reduced size and watermarked.';
const previewsOf = s => s.files.filter(f => f.kind === 'preview');
const originalsOf = s => s.files.filter(f => f.kind === 'original');
const hasFinal = s => originalsOf(s).length > 0 || !!(s.delivery && s.delivery.trim());
function readiness(s){                   // what's missing before a stage can go to review
  const miss = [];
  if(!previewsOf(s).length) miss.push('a preview');
  if(!hasFinal(s)) miss.push(W.allowOriginals ? 'originals or a delivery link' : 'a delivery link');
  return miss;
}
const log = (p, who, text) => p.log.push({t:today(), who, text});
const link = p => 'payguard.app/c/' + p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24) + '-' + p.id;

function needsYou(){
  const out = [];
  if(W.onboarded && !W.studio.upi) out.push({p:null, s:null, kind:'upi'});          // clients can't pay you until this is set
  projects.forEach(p => { if(p.phase === 'draft') out.push({p, s:cur(p), kind:'sign'});
    else if(p.phase === 'active') p.stages.forEach(s => { if(owner(s) === 'you' && s.state !== 'next') out.push({p, s, kind:s.state}); }); });
  return out.sort((x, y) => (y.s ? lateDays(y.s, y.p) : 99) - (x.s ? lateDays(x.s, x.p) : 99));
}
function waitingOn(){
  const out = [];
  projects.forEach(p => {
    if(p.phase === 'sent') out.push({p, s:cur(p), kind:'sent'});
    else if(p.phase === 'active') p.stages.forEach(s => { if(owner(s) === 'client') out.push({p, s, kind:s.state}); });
  });
  return out;
}
function events(forP){
  const ev = [];
  projects.forEach(p => { if(forP && p !== forP) return;
    p.stages.forEach(s => {
      if(['next','progress','changes','hold'].includes(s.state)) ev.push({d:s.due, type:'deliver', p, s});
      if(s.state === 'deposit') ev.push({d:s.depBy, type:'pay', p, s, adv:true});
      if(s.state === 'review') ev.push({d:replyBy(s, p), type:'reply', p, s});
      if(s.state === 'approved' && payBy(s, p)) ev.push({d:payBy(s, p), type:'pay', p, s});
      if(s.state === 'unlocked' && s.paidOn) ev.push({d:s.paidOn, type:'paid', p, s});
    }); });
  return ev.filter(e => e.d).sort((a, b) => a.d - b.d);
}
const moneyAxis = () => {
  const m = {notYet:0, awaiting:0, payoutPending:0, paidOut:0, direct:0};
  projects.forEach(p => p.stages.forEach(s => {
    if(s.state === 'approved') m.awaiting += s.price;
    else if(s.state === 'unlocked'){ if(s.paidVia === 'Unlocked without payment') return; if(s.payout === 'pending') m.payoutPending += s.paidAmt || s.price; else if(s.payout === 'direct') m.direct += s.paidAmt || s.price; else m.paidOut += s.paidAmt || s.price; }
    else if(!['closed'].includes(s.state)) m.notYet += s.price;
  }));
  return m;
};

/* ============ state changes ============ */
function activateNext(p, s){ const n = p.stages[p.stages.indexOf(s) + 1]; if(n && n.state === 'next') n.state = 'progress'; }
function setState(p, s, to, who, msg){
  const from = s.state;
  if(to === 'hold') s.prev = from;
  s.state = to;
  if(to === 'review'){ s.submittedOn = today(); s.versions.push({v:s.versions.length + 1, on:today(), note:''}); }
  if(to === 'approved'){ s.approvedOn = today(); if(p.rules.unlock === 'project') activateNext(p, s); }
  if(msg) log(p, who || 'system', msg);
}
function unlockStages(p, list, via, who, extra){
  let credit = p.credit || 0;
  list.forEach(x => {
    const c = Math.min(credit, x.price); credit -= c;
    const free = via === 'Unlocked without payment';
    x.state = 'unlocked'; x.paidOn = today(); x.paidVia = via; x.paidAmt = free ? 0 : x.price - c;
    x.payout = free ? null : via === 'UPI' || via === 'Card' ? 'pending' : 'direct';
    if(free) credit += c;
  });
  p.credit = credit;
  if(p.rules.unlock !== 'project') activateNext(p, list[list.length - 1]);
  const amt = list.reduce((a, x) => a + x.paidAmt, 0);
  log(p, who, (extra || `Paid ${inr(amt)} by ${via}`) + '. ' + list.map(x => x.name).join(', ') + ' unlocked');
}
function sweep(){
  let n = 0;
  projects.forEach(p => { if(p.phase !== 'active') return;
    p.stages.forEach(s => {
      const nudge = (txt) => { if(!W.remind) return; if(s.lastNudge && diff(today(), s.lastNudge) < 1) return; s.lastNudge = today(); n++; log(p, 'system', txt); };
      if(s.state === 'review'){
        const rb = replyBy(s, p);
        if(p.rules.auto && diff(today(), rb) > p.rules.autoDays){ setState(p, s, 'approved', 'system', `Auto-approved after no reply (${p.rules.autoDays} days past the reply-by date)`); return; }
        if(diff(rb, today()) <= 1) nudge(`Automatic reminder sent to ${first(p)}: reply by ${fmt(rb)}`);
      }
      if(s.state === 'approved'){
        const pb = payBy(s, p);
        if(pb && diff(pb, today()) <= 1) nudge(`Automatic reminder sent to ${first(p)}: payment due ${fmt(pb)}`);
      }
      if(s.state === 'deposit' && s.depBy && diff(s.depBy, today()) <= 1) nudge(`Automatic reminder sent to ${first(p)}: advance due ${fmt(s.depBy)}`);
    }); });
  return n;
}

/* ============ copy ============ */
function say(s, p, as){
  const f = fname(), c = first(p), cl = as === 'client';
  const di = dueInfo(s, p), dl = di && di.date ? fmt(di.date) : '';
  if(s.state === 'approved' && s.claimed) return cl ? `Waiting for ${f} to confirm.` : `${c} says they paid. Confirm when it arrives.`;
  if(s.state === 'approved' && p.rules.unlock === 'project' && !payScope(p, s).ready) return cl ? 'Approved. Pay once every stage is approved.' : 'Approved. Payment opens after all stages.';
  const D = {
    next:    ['Starts after the previous stage.', `${f} starts after the previous stage.`],
    deposit: [`Waiting for ${c}'s ${inr(advanceAmt(p))} advance.`, `Pay the ${inr(advanceAmt(p))} advance to start.`],
    progress:[`Submit previews by ${dl}.`, `${f} is on it. Previews by ${dl}.`],
    review:  [`With ${c}. Reply by ${dl}.`, `Approve or ask for changes. Reply by ${dl}.`],
    changes: [`Round ${s.round} of ${p.rules.rounds}. Upload a new version.`, `${f} is making your changes.`],
    approved:[`Approved. Pay by ${dl}.`, `Approved. Pay ${inr(payScope(p, s).amt)} by ${dl}.`],
    unlocked:['Paid. Files unlocked.', 'Paid. Your files are ready.'],
    hold:    [`${c} reported a problem. Reply to resume.`, `Reported. ${f} will reply.`],
    closed:  ['Closed unpaid. Files stay locked.', 'Closed unpaid.']
  };
  return D[s.state][cl ? 1 : 0];
}
