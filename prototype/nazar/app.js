
(function () {
  'use strict';
  var KEY = 'payguard.proto.v5';
  var META = {"approval":[928,840,415,814,1.199],"carrying-files":[608,512,274,475,0.779],"celebrating":[888,700,470,663,1.0],"excited":[848,688,424,653,1.0],"focused":[848,680,386,635,1.0],"happy":[848,632,449,586,1.0],"holding-document":[648,512,257,471,0.779],"holding-shield":[668,516,305,476,0.779],"invoice":[888,756,404,701,1.199],"jumping":[648,552,297,486,0.779],"main":[1208,1068,570,992,1.745],"payment":[1008,816,437,771,1.199],"pointing":[668,540,285,504,0.779],"presenting":[768,536,256,504,0.779],"project":[848,896,416,868,1.199],"prop-analytics":[388,328,194,268,1],"prop-bell":[368,344,170,280,1],"prop-calendar":[428,344,216,307,1],"prop-checklist":[408,344,194,310,1],"prop-document":[408,368,190,313,1],"prop-files":[408,384,196,330,1],"prop-laptop":[448,344,189,274,1],"prop-rupee":[408,360,201,296,1],"prop-shield":[428,384,212,324,1],"proud":[768,680,370,643,1.0],"running":[728,512,358,459,0.779],"sitting-laptop":[688,516,319,439,0.779],"thinking":[728,680,349,644,1.0],"thumbs-up":[628,516,285,476,0.779],"using-phone":[668,516,301,480,0.779],"walking":[588,512,274,472,0.779],"waving":[608,524,280,485,0.779],"worried":[728,648,332,624,1.0]};
  var BRANDS = ['#2F5BEA', '#0F766E', '#B4532A', '#7C3AED'];
  var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- helpers ---------------- */
  var TODAY = (function () { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); })();
  function pad(n) { return String(n).padStart(2, '0'); }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parse(s) { var p = String(s).split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function same(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function fmt(d, o) { return d.toLocaleDateString('en-IN', o); }
  function long(d) { return fmt(d, { weekday: 'short', day: 'numeric', month: 'short' }).replace(',', ''); }
  function days(d) { return Math.round((d - TODAY) / 86400000); }
  function rel(d) { var n = days(d); return n === 0 ? 'today' : n === 1 ? 'tomorrow' : n === -1 ? 'yesterday' : n < 0 ? Math.abs(n) + ' days ago' : 'in ' + n + ' days'; }
  function inr(n) { return '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN'); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function uid() { return Math.random().toString(36).slice(2, 9); }
  function first(n) { return String(n || '').trim().split(/\s+/)[0] || ''; }
  function initials(n) { var w = String(n || '').trim().split(/\s+/).filter(function (x) { return /[A-Za-z0-9]/.test(x.charAt(0)); }); return w.slice(0, 2).map(function (x) { return x.charAt(0); }).join('').toUpperCase() || '·'; }
  function ico(n, c) { return '<svg class="ico' + (c ? ' ' + c : '') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
  /* ---- buddy: a living mascot. Frames are the traced poses, swapped and moved so it reacts. ---- */
  var MOODS = {
    hello:   { base: 'waving', flick: ['happy', 'excited'], hover: 'excited', b: 'breathe' },
    main:    { base: 'main', flick: ['holding-shield', 'proud', 'happy'], hover: 'excited', b: 'breathe' },
    project: { base: 'project', flick: ['happy'], b: 'sway' },
    think:   { base: 'thinking', flick: ['focused', 'happy'], hover: 'excited', b: 'sway' },
    work:    { base: 'focused', flick: ['sitting-laptop', 'thinking'], hover: 'happy', b: 'breathe' },
    cheer:   { base: 'excited', loop: ['excited', 'celebrating', 'jumping', 'excited'], dur: 2000, settle: 'happy', flick: ['celebrating', 'proud'], b: 'breathe' },
    party:   { base: 'celebrating', loop: ['celebrating', 'excited', 'jumping', 'proud'], dur: 2400, settle: 'proud', flick: ['excited', 'happy'], b: 'breathe' },
    worry:   { base: 'worried', flick: ['thinking'], hover: 'happy', shake: true },
    guard:   { base: 'holding-shield', flick: ['proud', 'thumbs-up'], hover: 'thumbs-up', b: 'breathe' },
    point:   { base: 'pointing', flick: ['happy', 'thumbs-up'], hover: 'excited', b: 'breathe' },
    thumbs:  { base: 'thumbs-up', flick: ['happy', 'waving'], b: 'breathe' },
    carry:   { base: 'carrying-files', flick: ['happy', 'walking'], b: 'sway' },
    sit:     { base: 'sitting-laptop', flick: ['focused', 'happy'], b: 'breathe' },
    pay:     { base: 'payment', flick: ['happy', 'proud'], b: 'breathe' }
  };
  var KEYC = {}, PREVK = {}, CURK = {}, BUDS = [];
  function mood(m) { return MOODS[m] || MOODS.hello; }
  function frameList(md) { var a = [md.base].concat(md.flick || [], md.hover ? [md.hover] : [], md.loop || [], ['excited', 'celebrating']); return a.filter(function (x, i) { return a.indexOf(x) === i && META[x]; }); }
  function stageFor(md, size) {
    var u0 = size / 632, L = 0, R = 0, T = 0, B = 0, out = [];
    frameList(md).forEach(function (n) { var m = META[n], u = u0 / m[4]; L = Math.max(L, m[2] * u); R = Math.max(R, (m[0] - m[2]) * u); T = Math.max(T, m[3] * u); B = Math.max(B, (m[1] - m[3]) * u); out.push({ n: n, u: u, m: m }); });
    return { L: L, R: R, T: T, B: Math.min(B, size * 0.07), fr: out };
  }
  /* size = px height of a standard expression frame; a placeholder is returned and brought to life by mountBuddies */
  function buddy(moodName, size, o) {
    o = o || {}; var md = mood(moodName), st = stageFor(md, size);
    KEYC[moodName] = (KEYC[moodName] || 0) + 1; var k = moodName + '#' + KEYC[moodName]; CURK[k] = 1;
    return '<span class="bd" data-m="' + moodName + '" data-s="' + size + '" data-k="' + k + '" style="width:' + Math.ceil(st.L + st.R) + 'px;height:' + Math.ceil(st.T + st.B) + 'px"' + (o.label ? ' role="img" aria-label="' + esc(o.label) + '"' : ' aria-hidden="true"') + '></span>';
  }
  function mountBuddy(el, isNew, active) {
    var md = mood(el.dataset.m), st = stageFor(md, +el.dataset.s), ctl = { el: el, cur: null, busy: false, stopped: false, timers: [] };
    var b = document.createElement('span'), hp = document.createElement('span'), org = st.L + 'px ' + st.T + 'px', nodes = {};
    b.className = 'bd-b'; hp.className = 'bd-h'; el.style.transformOrigin = org; b.style.transformOrigin = org; hp.style.transformOrigin = org;
    st.fr.forEach(function (f) {
      var sv = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); sv.setAttribute('viewBox', '0 0 ' + f.m[0] + ' ' + f.m[1]); sv.setAttribute('class', 'bf');
      sv.style.cssText = 'left:' + (st.L - f.m[2] * f.u).toFixed(1) + 'px;top:' + (st.T - f.m[3] * f.u).toFixed(1) + 'px;width:' + (f.m[0] * f.u).toFixed(1) + 'px;height:' + (f.m[1] * f.u).toFixed(1) + 'px';
      sv.innerHTML = '<use href="#mk-' + f.n + '"/>'; hp.appendChild(sv); nodes[f.n] = sv;
    });
    b.appendChild(hp); el.appendChild(b);
    function show(n) { if (!nodes[n]) return; if (ctl.cur && nodes[ctl.cur]) nodes[ctl.cur].classList.remove('on'); nodes[n].classList.add('on'); ctl.cur = n; }
    function hop() { if (REDUCE) return; hp.classList.remove('hop', 'enter'); void hp.offsetWidth; hp.classList.add('hop'); }
    function later(fn, ms) { ctl.timers.push(setTimeout(function () { if (!ctl.stopped) fn(); }, ms)); }
    ctl.stop = function () { ctl.stopped = true; ctl.timers.forEach(clearTimeout); };
    show(md.base);
    if (REDUCE || !active) { el.classList.add('still'); return ctl; }
    if (md.b) b.classList.add('b-' + md.b);
    if (isNew) hp.classList.add('enter');
    (function flick() {
      if (md.flick && md.flick.length && !ctl.busy) { var n = md.flick[Math.floor(Math.random() * md.flick.length)]; show(n); if (Math.random() < 0.3) hop(); later(function () { if (!ctl.busy) show(md.base); }, 260 + Math.random() * 240); }
      later(flick, 6500 + Math.random() * 4500);
    })();
    if (md.loop && isNew) {
      ctl.busy = true; b.classList.remove('b-' + md.b); b.classList.add('b-bounce'); var i = 0, t0 = Date.now();
      (function step() { if (Date.now() - t0 > (md.dur || 2200)) { ctl.busy = false; b.classList.remove('b-bounce'); if (md.b) b.classList.add('b-' + md.b); show(md.settle || md.base); return; } show(md.loop[i++ % md.loop.length]); later(step, 360); })();
    }
    if (md.shake) (function sh() { b.classList.remove('b-shake'); void b.offsetWidth; b.classList.add('b-shake'); later(sh, 8000); })();
    el.addEventListener('pointerenter', function () { if (ctl.busy) return; if (md.hover) show(md.hover); hop(); });
    el.addEventListener('pointerleave', function () { if (!ctl.busy) show(md.base); });
    el.addEventListener('click', function () { if (ctl.busy) return; ctl.busy = true; show('excited'); hop(); later(function () { show('celebrating'); }, 380); later(function () { ctl.busy = false; show(md.base); }, 1100); });
    return ctl;
  }
  /* only one buddy per screen moves: the one in an open dialog, otherwise the first large one on the page */
  function mountBuddies(root) {
    BUDS.forEach(function (c) { c.stop(); }); BUDS = [];
    var all = Array.prototype.slice.call(root.querySelectorAll('.bd[data-m]'));
    var pool = all.filter(function (el) { return el.closest('.dialog'); });
    if (!pool.length) pool = all.filter(function (el) { return !el.closest('#toasts') && +el.dataset.s >= 80; });
    var lead = pool[0];
    all.forEach(function (el) { var act = el === lead, c = mountBuddy(el, !PREVK[el.dataset.k], act); if (act) BUDS.push(c); });
    PREVK = CURK; CURK = {}; KEYC = {};
  }
  (function lean() {
    if (REDUCE) return; var raf = 0, mx = 0;
    window.addEventListener('pointermove', function (e) { mx = e.clientX; if (raf) return; raf = requestAnimationFrame(function () { raf = 0; BUDS.forEach(function (c) { var r = c.el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; var d = Math.max(-1, Math.min(1, (mx - (r.left + r.width / 2)) / 380)); c.el.style.transform = 'rotate(' + (d * 4).toFixed(2) + 'deg)'; }); }); }, { passive: true });
  })();
  /* No fee in the beta, and PayGuard never holds money: clients pay the freelancer directly (UPI, QR or card).
     PayGuard holds only access to the original files. fees() stays so older call sites keep working. */
  function fees(a) { return { fee: 0, gst: 0, all: 0, cfee: 0, total: a, ffee: 0, net: a, mode: 'none' }; }
  function feeNote() { return ''; }
  /* Payment terms are the freelancer's: an optional advance (a % paid before work starts, straight to them), then
     the balance when the client approves. unlock: 'stage' = pay and unlock stage by stage; 'project' = one payment for everything. */
  function totalOf(p) { return p.ms.reduce(function (a, m) { return a + m.amount; }, 0); }
  function advPct(p) { return Number(p.advancePct) || 0; }
  function advAmt(p) { return Math.round(totalOf(p) * advPct(p) / 100); }
  function advDue(p) { return advPct(p) > 0 && !p.advancePaid; }
  function balOf(m, p) { return Math.max(0, m.amount - Math.round(m.amount * advPct(p) / 100)); }
  function projMode(p) { return p.unlock === 'project'; }
  function allApproved(p) { return p.ms.every(function (x) { return x.status === 'approved' || x.status === 'released'; }); }
  function payAmt(m, p) { return projMode(p) ? p.ms.filter(function (x) { return x.status === 'approved'; }).reduce(function (s, x) { return s + balOf(x, p); }, 0) : balOf(m, p); }
  function payBy(m, p) { return addDays(new Date(m.approvedAt || TODAY), Number(p.payDays) || 7); }
  function contractOk(p) { return !p.contract || !!(p.contract.cSig); }
  function canPay(m, p) { return m.status === 'approved' && (!projMode(p) || allApproved(p)); }
  /* When there is no reply: a submitted stage is approved automatically autoDays after its reply-by date. 0 = never. */
  function autoTxt(p) { var t = (Number(p.reviewDays) || 3) + (Number(p.autoDays) || 0); return p.autoDays ? 'Approved automatically if there is no reply, ' + t + ' days after the work is sent' : 'Never approved automatically'; }
  function autoAt(p, m) { var rb = replyBy(m); return rb && p && p.autoDays ? addDays(rb, p.autoDays) : null; }
  var REASONS = { late: 'The work wasn\'t delivered', scope: 'It doesn\'t match what\'s included', other: 'Something else' };
  var ISSUE_DAYS = 5;
  function issueBy(m) { return addDays(new Date((m.dispute && m.dispute.at) || TODAY), ISSUE_DAYS); }
  function ago(iso0) { var d = new Date(iso0); return Math.max(0, Math.round((TODAY - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000)); }
  function dIso(off) { return iso(addDays(TODAY, off)); }

  /* ---------------- state ---------------- */
  function SETD() { return { payout: { kind: 'upi', upi: '', holder: '', acct: '', ifsc: '' }, tax: { legal: '', gstin: '', pan: '', state: '' }, defaults: { reviewDays: 3, autoDays: 3, rounds: 2, extraFee: 6000, advancePct: 0, payDays: 7 }, notify: { pay: true, approve: true, digest: false, auto: true }, contract: { header: '', footer: '', extra: '' } }; }
  function S() { D.settings = D.settings || SETD(); ['payout', 'tax', 'defaults', 'notify', 'contract'].forEach(function (k) { D.settings[k] = Object.assign({}, SETD()[k], D.settings[k]); }); return D.settings; }
  function setS(path, v) { var p = path.split('.'); S()[p[0]][p[1]] = v; save(); }
  function fresh() { return { v: 4, onboarded: false, role: 'freelancer', studio: { name: 'Meera Iyer', biz: 'Meera Iyer Studio', brand: 0 }, projects: [], cur: null, log: [], samples: false }; }
  var D = load();
  var MEM = {};
  function blankU() { return { calClient: '', more: false, waitOpen: false, view: 'today', pt: 'overview', setup: false, plan: false, filter: 'all', q: '', cf: 'all', pf: 'all', cal: new Date(TODAY.getFullYear(), TODAY.getMonth(), 1), sel: null, modal: null, draft: null, uploading: [], busy: false, checkout: false, payErr: '', fi: 0, rtab: 'summary', agree: false, fb: { note: '' } }; }
  var U = blankU();
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 4) return s; } catch (e) {} return fresh(); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) {} }
  function log(who, text, pid) { D.log.unshift({ t: new Date().toISOString(), who: who, text: text, pid: pid || D.cur }); D.log = D.log.slice(0, 200); }

  function P() { return D.projects.filter(function (p) { return p.id === D.cur; })[0] || null; }
  function ms() { return P() ? P().ms : []; }
  function closed(m) { return m.status === 'released' || m.status === 'refunded'; }
  function unreleased(p) { return p.ms.filter(function (m) { return !closed(m); }); }
  function currentMsOf(p) { var u = unreleased(p); if (projMode(p)) { var k = u.filter(function (m) { return m.status !== 'approved'; })[0]; if (k) return k; } return u[0] || null; }
  /* the next queued stage starts once its turn comes (contract signed, any advance in): previous stage unlocked, or approved in whole-project mode */
  function startNext(p) {
    if (advDue(p) || !contractOk(p)) return;
    for (var i = 0; i < p.ms.length; i++) {
      var m = p.ms[i]; if (m.status !== 'draft') continue; var prev = p.ms[i - 1];
      if (!prev || prev.status === 'released' || (projMode(p) && prev.status === 'approved')) { m.status = 'funded'; m.fundedAt = new Date().toISOString(); m.scopeAt = m.scopeAt || m.fundedAt; m.seen = m.seen || {}; m.seen.funded = true; }
      break;
    }
  }
  function currentMs() { return P() ? currentMsOf(P()) : null; }
  function focusMs() { var p = P(); if (!p) return null; var s = U.sel && p.ms.filter(function (m) { return m.id === U.sel; })[0]; return s || currentMsOf(p) || p.ms[p.ms.length - 1] || null; }
  function org(p) { return p.client.org || p.client.name; }
  function clientName() { return P() ? P().client.name : 'Your client'; }
  function replyBy(m) { return m.replyBy ? parse(m.replyBy) : null; }
  function getMs(id) { return ms().filter(function (m) { return m.id === id; })[0]; }
  function getP(id) { return D.projects.filter(function (p) { return p.id === id; })[0] || null; }
  function pickCur() { var own = D.projects.filter(function (p) { return !p.sample; }); return (own[own.length - 1] || D.projects[0] || {}).id || null; }
  /* One vocabulary for both sides, seven words: Not funded, Funded, In review, Changes requested, Approved,
     On hold (an issue is open) and Refunded. Lateness is shown as text and a red dot, never as an extra status. */
  var STATUS = { draft: ['draft', 'Not started'], funded: ['funded', 'In progress'], submitted: ['submitted', 'In review'], changes: ['changes', 'Changes requested'], approved: ['approved', 'Awaiting payment'], released: ['released', 'Unlocked'], dispute: ['dispute', 'On hold'], refunded: ['refunded', 'Refunded'] };
  function badge(st) { var s = STATUS[st] || STATUS.draft; return '<span class="badge ' + s[0] + '">' + s[1] + '</span>'; }
  /* The funding clock for a stage starts at the later of: the freelancer's last ask, or the previous stage closing. */
  function askedOf(p, m) { var i = p.ms.indexOf(m), prev = i > 0 ? p.ms[i - 1] : null, a = p.askedAt || '', b = (prev && (prev.releasedAt || prev.refundedAt)) || ''; return (a > b ? a : b) || new Date().toISOString(); }
  /* Same rule as the Today screen: late only when the due date has passed or Today shows it as an overdue payment. */
  function fundLate(p, m) { var a = attentionFor(p); return !!(a && a.mid === m.id && (a.kind === 'fund' || a.kind === 'pay' || a.kind === 'sign') && a.sev === 'red'); }
  function payState(m, p, role, money) {
    if (m.status === 'draft' && p && !contractOk(p) && p.ms[0] === m) return ['draft', 'Awaiting signature'];
    if (m.status === 'draft' && p && advDue(p) && p.ms[0] === m) return ['draft', 'Advance due'];
    return STATUS[m.status] || STATUS.draft;
  }
  function paidOut(m) { var d = new Date(m.releasedAt || TODAY); return addDays(new Date(d.getFullYear(), d.getMonth(), d.getDate()), 2); }
  function stBadge(m, p, money) { var s = payState(m, p || P(), D.role, money); return '<span class="badge ' + s[0] + '">' + s[1] + '</span>'; }
  function agoTxt(iso0) { var n = ago(iso0); return n === 0 ? 'today' : n === 1 ? 'yesterday' : n + ' days ago'; }

  var CC = ['#2F5BEA', '#0F9D8A', '#E4572E', '#9B51E0', '#E8A317', '#D6336C', '#2B8A3E', '#0B7285', '#C2410C', '#6741D9'];
  function ccol(p) { return CC[((p && p.client && p.client.color) || 0) % CC.length]; }
  function nextColor() { var used = D.projects.map(function (p) { return p.client.color; }); for (var i = 0; i < CC.length; i++) if (used.indexOf(i) < 0) return i; return D.projects.length % CC.length; }
  function logoSvg(kind, c) {
    var sh = { tri: '<path d="M32 12 52 50H12Z" fill="' + c + '"/>', ring: '<circle cx="32" cy="32" r="18" fill="none" stroke="' + c + '" stroke-width="9"/>', leaf: '<path d="M14 48C14 24 30 12 52 12c0 24-12 38-38 36Z" fill="' + c + '"/>' };
    return 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' + sh[kind] + '</svg>');
  }
  function avatarHTML(c, big) {
    var col = CC[(c.color || 0) % CC.length];
    return '<span class="logo-av' + (big ? ' big' : '') + '" style="--c:' + col + '" aria-hidden="true">' + (c.logo ? '<img src="' + esc(c.logo) + '" alt="">' : '<b>' + esc(initials(c.org || c.name)) + '</b>') + '</span>';
  }
  function swatchesHTML(sel, action) { return '<div class="swatches">' + CC.map(function (c, i) { return '<button type="button" class="sw" data-a="' + action + '" data-i="' + i + '" aria-pressed="' + (sel === i) + '" aria-label="Color ' + (i + 1) + '" style="background:' + c + '"></button>'; }).join('') + '</div>'; }
  function shrink(file, cb) {
    var r = new FileReader(); r.onload = function () { var img = new Image(); img.onload = function () { var k = Math.min(1, 128 / Math.max(img.width, img.height)), c = document.createElement('canvas'); c.width = Math.max(1, Math.round(img.width * k)); c.height = Math.max(1, Math.round(img.height * k)); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); cb(c.toDataURL('image/png')); }; img.onerror = function () { cb(r.result); }; img.src = r.result; }; r.readAsDataURL(file);
  }

  /* ---------------- data builders ---------------- */
  function newMs(name, amount, due, rounds, scope) { return { id: uid(), name: name, amount: amount, due: due, status: 'draft', files: [], revisions: 0, limit: rounds || 2, notes: [], replyBy: null, seen: {}, scope: scope || [], extra: 0 }; }
  var SCOPE = {
    'Discovery': ['Kick-off call and written brief', 'Review of 3 competitor sites', 'Sitemap for the new site'],
    'Homepage design': ['Desktop and mobile homepage in Figma', 'One visual direction, refined', 'Copy placed from your doc'],
    'Inner pages': ['About, Services and Contact pages', 'Desktop and mobile layouts'],
    'Handoff': ['Developer-ready Figma file', 'Exported assets and a short spec'],
    'Audit': ['Review of the current dashboard', 'List of top 10 usability issues'],
    'Wireframes': ['Wireframes for 6 core screens', 'One round of layout changes'],
    'UI kit': ['Colors, type and spacing tokens', 'Buttons, inputs, tables and charts', 'Figma components with variants'],
    'Prototype': ['Clickable prototype of the main flow', 'Short walkthrough video'],
    'Concepts': ['3 menu and packaging concepts', 'Mockups on real products'],
    'Final artwork': ['Print-ready menu and 4 packaging sizes', 'Editable source files'],
    'Research': ['5 user interviews', 'Summary of findings'],
    'Flows': ['Sign-up and onboarding flows', 'Mobile screens in Figma'],
    'Specs': ['Annotated specs for developers', 'Edge and error states'],
    'Story': ['Narrative outline for 12 slides'], 'Design': ['12 designed slides'], 'Final deck': ['Final deck in Keynote and PDF'],
    'Strategy': ['Campaign goals and audience', 'Channel plan'], 'Content calendar': ['4-week posting calendar', 'Post copy for each slot'],
    'Creatives': ['20 static posts', '4 short reels'], 'Layout': ['8-page brochure layout', 'Placed photos and copy'],
    'Print-ready files': ['Print PDF with bleed', 'Source files'], 'Style frames': ['4 style frames in two directions'], 'Final set': ['24 final illustrations', 'SVG and PNG exports']
  };
  function scopeFor(n) { return (SCOPE[n] || ['Everything listed in the brief for this deliverable']).slice(); }
  function sMs(name, amount, off, status, o) {
    o = o || {}; var m = newMs(name, amount, dIso(off), 2, scopeFor(name)); m.status = status; m.seen = { funded: true, released: true, changes: true, submitted: true, dispute: true, refunded: true, approved: true };
    if (status !== 'draft') { m.fundedAt = new Date(TODAY.getTime() - (o.fundedAgo || 12) * 86400000).toISOString(); m.scopeAt = m.fundedAt; }
    if (status === 'dispute') m.dispute = { reason: o.reason || 'late', note: o.note || '', at: new Date(TODAY.getTime() - (o.issueAgo || 1) * 86400000).toISOString(), prev: 'funded' };
    if (status === 'submitted') { m.submittedAt = new Date(TODAY.getTime() - (o.subAgo == null ? 1 : o.subAgo) * 86400000).toISOString(); m.replyBy = dIso(o.reply == null ? 2 : o.reply); }
    if (status === 'changes') { m.revisions = 1; m.notes = [{ v: 1, text: o.note || 'Can we make the layout feel more open?', at: new Date().toISOString() }]; }
    if (status === 'approved') m.approvedAt = new Date(TODAY.getTime() - (o.apprAgo || 2) * 86400000).toISOString();
    if (status === 'released') m.releasedAt = new Date(TODAY.getTime() - (o.relAgo || 6) * 86400000).toISOString();
    if (o.files) m.files = o.files; return m;
  }
  function docFiles(names) { return names.map(function (n) { return { id: uid(), name: n[0], size: n[1], kind: n[2], url: '', v: 1 }; }); }
  function seedProjects() {
    if (!S().payout.upi) S().payout.upi = 'meera@okaxis';
    var SC = { 'Bloom Studio': 5, 'Acme Logistics': 0, 'Northwind Cafe': 2, 'Tidal Health': 1, 'Orbit Labs': 3, 'Greenleaf Foods': 6, 'Lumen Realty': 4, 'Studio Nine': 7, 'Kite Fitness': 8, 'Saffron Hotels': 9 }, SL = { 'Acme Logistics': logoSvg('tri', CC[0]), 'Orbit Labs': logoSvg('ring', CC[3]), 'Greenleaf Foods': logoSvg('leaf', CC[6]) };
    var P1 = function (name, cname, corg, askedAgo, clientIn, list, opt) { return Object.assign({ id: uid(), sample: true, name: name, client: { name: cname, org: corg, color: SC[corg], logo: SL[corg] || '', email: first(cname).toLowerCase() + '@' + corg.toLowerCase().replace(/[^a-z]/g, '') + '.example', phone: corg === 'Studio Nine' ? '' : '+91 98200 1' + String(1000 + SC[corg] * 7).slice(1) }, ms: list, clientIn: clientIn, askedAt: new Date(TODAY.getTime() - askedAgo * 86400000).toISOString(), reviewDays: 3, autoDays: 3, extraFee: 6000, unlock: 'stage', payDays: 7, advancePct: 0, advancePaid: false, openedAt: clientIn ? new Date(TODAY.getTime() - Math.max(0, askedAgo - 1) * 86400000).toISOString() : null, createdAt: new Date(TODAY.getTime() - (askedAgo + 2) * 86400000).toISOString() }, opt || {}); };
    return [
      P1('Website redesign', 'Priya Nair', 'Bloom Studio', 30, true, [sMs('Discovery', 30000, -20, 'released'), sMs('Homepage design', 60000, -1, 'submitted', { reply: -1, subAgo: 4, files: sampleFiles().map(function (f) { f.v = 1; return f; }) }), sMs('Inner pages', 45000, 18, 'draft'), sMs('Handoff', 25000, 30, 'draft')]),
      P1('Dashboard UI kit', 'Rohit Mehta', 'Acme Logistics', 40, true, [sMs('Audit', 20000, -30, 'released'), sMs('Wireframes', 45000, -10, 'released'), sMs('UI kit', 70000, 2, 'funded'), sMs('Prototype', 35000, 20, 'draft')]),
      P1('Menu and packaging', 'Sana Qureshi', 'Northwind Cafe', 5, true, [sMs('Concepts', 35000, 3, 'approved', { apprAgo: 11 }), sMs('Final artwork', 40000, 24, 'draft')]),
      P1('Onboarding flows', 'Vikram Rao', 'Tidal Health', 25, true, [sMs('Research', 40000, -14, 'released'), sMs('Flows', 55000, 5, 'changes', { note: 'The second step feels crowded. Can we split it into two screens?' }), sMs('Specs', 30000, 25, 'draft')]),
      P1('Pitch deck', 'Neha Kapoor', 'Orbit Labs', 28, true, [sMs('Story', 22000, -18, 'released', { relAgo: 16 }), sMs('Design', 38000, -8, 'released', { relAgo: 6 }), sMs('Final deck', 20000, -4, 'released', { relAgo: 1 })]),
      P1('Social campaign', 'Anil Shah', 'Greenleaf Foods', 1, true, [sMs('Strategy', 28000, -12, 'released', { relAgo: 10 }), sMs('Content calendar', 32000, 9, 'funded'), sMs('Creatives', 50000, 30, 'draft')]),
      P1('Brochure', 'Karan Bhatia', 'Lumen Realty', 3, false, [sMs('Layout', 38000, 12, 'funded'), sMs('Print-ready files', 22000, 26, 'draft')]),
      P1('Landing page', 'Neel Arora', 'Kite Fitness', 12, true, [sMs('Landing page', 42000, -1, 'funded'), sMs('Handoff', 18000, 14, 'draft')]),
      P1('Logo refresh', 'Meher Dalal', 'Saffron Hotels', 7, true, [sMs('Logo options', 36000, 4, 'draft'), sMs('Brand sheet', 24000, 20, 'draft')], { advancePct: 25, unlock: 'project' }),
      P1('Illustration set', 'Isha Verma', 'Studio Nine', 20, true, [sMs('Style frames', 52000, -2, 'dispute', { reason: 'late', note: 'These were due two days ago and I haven\'t seen anything yet. Can you share where things are?' }), sMs('Final set', 48000, 22, 'draft')])
    ];
  }

  /* ---------------- what needs attention ---------------- */
  var SEV = { red: 0, amber: 1, blue: 2, yellow: 3 };
  var BUCKET = { red: 'overdue', amber: 'needs', blue: 'needs', yellow: 'waiting' };
  function attentionFor(p) {
    var m = currentMsOf(p); if (!m) return null; var c = first(p.client.name), age = ago(askedOf(p, m)), due = parse(m.due), dd = days(due), it = { pid: p.id, mid: m.id, org: org(p), project: p.name, ms: m.name, amount: m.amount };
    var pl = function (n) { return n + ' day' + (n === 1 ? '' : 's'); };
    if (m.status === 'dispute') { var dr = m.dispute || {}; return Object.assign(it, { kind: 'dispute', sev: 'red', text: c + ' reported a problem', ctx: (REASONS[dr.reason] || 'Problem reported') + ' · reply by ' + long(issueBy(m)), cta: 'Reply to ' + c, act: 'openp' }); }
    if (m.status === 'draft') {
      if (!contractOk(p)) return age >= 3 ? Object.assign(it, { kind: 'sign', sev: 'red', text: 'Signature ' + pl(Math.max(age - 2, 1)) + ' late', ctx: 'Contract sent ' + agoTxt(askedOf(p, m)), cta: 'Remind ' + c, act: 'remind' })
        : Object.assign(it, { kind: 'sign', sev: 'yellow', text: 'Waiting for signature', ctx: 'Contract sent ' + agoTxt(askedOf(p, m)), cta: 'Remind ' + c, act: 'remind' });
      if (!advDue(p)) return null;
      if (age >= 3) return Object.assign(it, { kind: 'fund', sev: 'red', text: 'Advance ' + pl(Math.max(age - 2, 1)) + ' late', ctx: 'Asked ' + agoTxt(askedOf(p, m)) + ' · ' + inr(advAmt(p)), cta: 'Remind ' + c, act: 'remind', amount: advAmt(p) });
      return Object.assign(it, { kind: 'fund', sev: 'yellow', text: 'Waiting for advance', ctx: 'Asked ' + agoTxt(askedOf(p, m)) + ' · ' + inr(advAmt(p)), cta: 'Remind ' + c, act: 'remind', amount: advAmt(p) });
    }
    if (m.status === 'approved') {
      if (projMode(p) && !allApproved(p)) return null;
      var pb = payBy(m, p), pd = days(pb), amt = payAmt(m, p);
      return pd < 0 ? Object.assign(it, { kind: 'pay', sev: 'red', text: 'Payment ' + pl(Math.abs(pd)) + ' late', ctx: 'Approved ' + agoTxt(m.approvedAt) + ' · was due ' + long(pb), cta: 'Remind ' + c, act: 'remind', amount: amt })
        : Object.assign(it, { kind: 'pay', sev: 'yellow', text: 'Awaiting payment', ctx: 'Approved ' + agoTxt(m.approvedAt) + ' · pay by ' + long(pb), cta: 'Remind ' + c, act: 'remind', amount: amt });
    }
    if (m.status === 'submitted') {
      var rb = replyBy(m), rd = days(rb), sub = m.submittedAt ? 'Sent ' + agoTxt(m.submittedAt) + ' · ' : '', aa = autoAt(p, m);
      return rd < 0 ? Object.assign(it, { kind: 'approve', sev: 'red', text: 'Approval ' + pl(Math.abs(rd)) + ' late', ctx: sub + (aa ? 'approved automatically ' + rel(aa) : 'reply was due ' + long(rb)), cta: 'Remind ' + c, act: 'remind' })
        : Object.assign(it, { kind: 'approve', sev: 'yellow', text: 'Awaiting approval', ctx: sub + 'reply by ' + long(rb), cta: 'Remind ' + c, act: 'remind' });
    }
    if (m.status === 'changes') { var nt = m.notes.length ? m.notes[m.notes.length - 1].text : ''; return Object.assign(it, { kind: 'changes', sev: 'amber', text: 'Changes requested · round ' + m.revisions + ' of ' + m.limit, ctx: nt ? '“' + (nt.length > 70 ? nt.slice(0, 68) + '…' : nt) + '”' : 'View the note', cta: 'Open', act: 'openp' }); }
    if (m.status === 'funded') {
      var fd = m.fundedAt ? 'Started ' + agoTxt(m.fundedAt) + ' · ' : '';
      if (dd < 0) return Object.assign(it, { kind: 'deliver', sev: 'red', text: 'Delivery ' + pl(Math.abs(dd)) + ' late', ctx: fd + 'was due ' + long(due), cta: 'Upload', act: 'openp' });
      if (dd <= 7) return Object.assign(it, { kind: 'deliver', sev: 'blue', text: 'Due ' + rel(due), ctx: fd + (fd ? 'due ' : 'Due ') + long(due), cta: 'Upload', act: 'openp' });
      if (!p.clientIn && p.ms[0] === m && !items(m).length && age >= 2) return Object.assign(it, { kind: 'invite', sev: 'yellow', text: 'Link not opened yet', ctx: 'Link sent ' + agoTxt(p.askedAt), cta: 'Resend to ' + c, act: 'remind' });
    }
    return null;
  }
  function attention() { var out = []; D.projects.forEach(function (p) { var a = attentionFor(p); if (a) out.push(a); }); return out.sort(function (a, b) { return SEV[a.sev] - SEV[b.sev] || a.amount - b.amount; }); }
  /* Four project states: Needs you, Waiting on client, On track, Complete. */
  function projStatus(p) {
    if (!currentMsOf(p)) return { k: 'complete', label: 'Done', cls: 'released' };
    var a = attentionFor(p); if (!a) return { k: 'track', label: 'On track', cls: 'funded' };
    return a.sev === 'yellow' ? { k: 'waiting', label: 'Waiting', cls: 'gray' } : { k: 'needs', label: 'Needs you', cls: a.sev === 'red' ? 'red' : 'amber' };
  }
  /* ---------------- data actions ---------------- */
  /* ---------------- plan helpers: price suggestions and briefs ----------------
     Both are rule-based stand-ins for a model: a table of typical freelance rates, and a reader that looks for
     headings, bullets, amounts and durations. They only ever fill in the form; everything stays editable. */
  var RATES = [[/brand\s*(guide|book)|guidelines/i, 30000, 0], [/ui\s*kit|design\s*system|component/i, 35000, 0], [/logo/i, 9000, 1], [/mood\s*board|moodboard|references?/i, 7000, 0], [/business card|letterhead|stationery|collateral/i, 8000, 0], [/packag/i, 7000, 1], [/brochure|catalog/i, 3500, 1], [/wireframe/i, 3500, 1], [/prototype/i, 20000, 0], [/home\s*page|landing/i, 20000, 0], [/page|screen|layout|template/i, 6000, 1], [/slide|deck/i, 1500, 1], [/reel|video|animation|motion/i, 5000, 1], [/social|post|carousel|creative|poster/i, 900, 1], [/illustration|icon/i, 4500, 1], [/research|interview|survey/i, 3000, 1], [/audit|review|analysis|competitor/i, 12000, 0], [/spec|hand-?off|export|source|assets|walkthrough/i, 6000, 0], [/strategy|plan|calendar|copy|content|narrative|outline/i, 10000, 0]];
  var NUMW = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twelve: 12 };
  function r500(n) { return Math.round(n / 500) * 500; }
  function suggestFor(name, scope) {
    var items2 = lines(scope); if (!items2.length) return null; var sum = 0;
    items2.forEach(function (ln) {
      var rate = null; for (var k = 0; k < RATES.length; k++) if (RATES[k][0].test(ln)) { rate = RATES[k]; break; }
      var q = 1, mm = ln.match(/\b(\d{1,3})\b/); if (mm) q = Math.min(60, Number(mm[1]) || 1); else { var w = ln.toLowerCase().match(/\b(one|two|three|four|five|six|seven|eight|nine|ten|twelve)\b/); if (w) q = NUMW[w[1]]; }
      sum += rate ? (rate[2] ? rate[1] * Math.pow(q, 0.85) : rate[1]) : 3500;
    });
    var mid = Math.max(5000, r500(sum)); return { mid: mid, low: Math.max(3000, r500(mid * 0.8)), high: r500(mid * 1.3), n: items2.length };
  }
  function sugHTML(i) {
    var m = U.draft.ms[i], s = m && suggestFor(m.name, m.scope); if (!s) return '';
    return ico('spark') + '<span>Suggested <b class="mono">' + inr(s.mid) + '</b> <span class="muted">· usually ' + inr(s.low) + ' to ' + inr(s.high) + '</span></span>' + (Number(m.amount) === s.mid ? '<span class="muted">Applied</span>' : '<button type="button" class="linkb" data-a="usesug" data-i="' + i + '">Use ' + inr(s.mid) + '</button>');
  }
  function minDue(d, i) { var p = d.ms[i - 1]; return i > 0 && !d.ms[i].par && p && p.due ? iso(addDays(parse(p.due), 1)) : iso(TODAY); }
  function orderWarn(d) { return d.ms.map(function (m, i) { return i > 0 && !m.par && m.due && d.ms[i - 1].due && m.due <= d.ms[i - 1].due ? '<p class="hint-err" style="margin-top:8px">Deliverable ' + (i + 1) + ' overlaps deliverable ' + i + '. Pick a later date, or turn on "Runs alongside the previous deliverable".</p>' : ''; }).join(''); }
  var BR_SKIP = /^(overview|background|about( us)?|introduction|summary|objectives?|goals?|budget|pricing|timeline|schedule|contact|notes?|terms|assumptions|scope of work|deliverables?|requirements?|brief|project brief|stages?|milestones?|process)$/i;
  var SAMPLE_BRIEF = 'Brand identity for Kiln & Co.\nPrepared for: Kiln & Co.\nBudget: ₹1,20,000\n\nStage 1: Discovery and moodboard (1 week)\n- Kick-off call and written brief\n- Moodboard with 2 directions\n- Review of 3 competitor brands\n\nStage 2: Logo concepts (2 weeks)\n- 3 logo concepts\n- One concept refined\n- Colour and type palette\n\nStage 3: Brand guidelines (2 weeks)\n- 20-page brand guidelines PDF\n- Logo usage and clear space rules\n\nStage 4: Collateral (1 week)\n- Business card and letterhead\n- 4 social media templates';
  function parseBrief(text) {
    var L = String(text).replace(/\r/g, '').split('\n').map(function (x) { return x.replace(/ /g, ' ').trim(); }), cl = function (s) { return s.replace(/^#{1,6}\s*/, '').replace(/\*\*/g, '').trim(); };
    var bul = /^([-*•·▪◦–—]|\(?[a-z0-9]{1,2}[.)])\s+(\S.*)$/, firstIdx = -1; L.forEach(function (s, i) { if (firstIdx < 0 && s) firstIdx = i; });
    var cand = []; L.forEach(function (s, i) { if (/^(?:#{1,6}\s*)?\**(?:stage|phase|milestone|step|part|sprint|round)\s*\d/i.test(s)) cand.push({ i: i, t: s.replace(/^(?:#{1,6}\s*)?\**(?:stage|phase|milestone|step|part|sprint|round)\s*\d*\s*[:.\-–—)]*\s*\**\s*/i, '') }); });
    if (cand.length < 2) { cand = []; L.forEach(function (s, i) { if (i !== firstIdx && /^#{1,6}\s+\S/.test(s) && !BR_SKIP.test(cl(s).replace(/[:.]$/, ''))) cand.push({ i: i, t: cl(s) }); }); }
    if (cand.length < 2) { cand = []; L.forEach(function (s, i) { var m = s.match(/^\**(\d{1,2})[.)]\s+([A-Z][^.!?]{2,60})$/); if (m && !BR_SKIP.test(m[2])) cand.push({ i: i, t: m[2].replace(/\*\*/g, '') }); }); }
    if (cand.length < 2) { cand = []; L.forEach(function (s, i) { if (s.length >= 4 && s.length <= 50 && /^[A-Z][A-Z &/,'-]+$/.test(s) && !BR_SKIP.test(s)) cand.push({ i: i, t: s.charAt(0) + s.slice(1).toLowerCase() }); }); }
    var title = ''; for (var q = 0; q < L.length && q < 6; q++) { var s0 = cl(L[q]); if (s0 && s0.length <= 70 && !/[:]\s*\S/.test(s0) && !cand.some(function (c) { return c.i === q; })) { title = s0.replace(/^(project\s+)?brief\s*[:\-–—]\s*/i, '').replace(/[.]$/, ''); break; } }
    var client = ''; for (q = 0; q < L.length && q < 15; q++) { var cm = L[q].match(/^(?:client|prepared for|company)\s*[:\-–—]\s*(.{2,60})$/i); if (cm) { client = cm[1].trim(); break; } }
    var tm = text.match(/budget\s*[:\-–—]?\s*(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d+)?)\s*(k|lakh|lac)?/i), total = tm ? Number(tm[1].replace(/,/g, '')) * (/^k$/i.test(tm[2] || '') ? 1000 : /lakh|lac/i.test(tm[2] || '') ? 100000 : 1) : 0;
    var stages = []; if (cand.length) cand.forEach(function (c, k) {
      var end = k + 1 < cand.length ? cand[k + 1].i : L.length, block = L.slice(c.i + 1, Math.min(end, c.i + 30)).filter(function (x) { return x; }), head = L[c.i], scope = [];
      block.forEach(function (x) { var bm = x.match(bul); if (bm && !/^\d{1,2}[.)]\s+[A-Z][^.!?]{2,60}$/.test(x) || (bm && cand.length)) scope.push(bm[2].trim()); });
      if (!scope.length) block.forEach(function (x) { if (/^(fee|price|cost|budget|duration|timeline|due|deliverables?|scope)\s*:?\s*$/i.test(x)) return; x.split(/(?<=[.!?])\s+/).forEach(function (sn) { sn = sn.replace(/[.]$/, '').trim(); if (sn.length > 8 && sn.length < 110 && scope.length < 4) scope.push(sn); }); });
      scope = scope.filter(function (x) { return !/^(fee|price|cost|budget|duration|timeline|due)\s*[:\-–]/i.test(x); }).slice(0, 8);
      var blob = head + ' ' + block.join(' '), am = blob.match(/(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d+)?)\s*(k|lakh|lac)?/i), du = blob.match(/(\d+)\s*(?:-\s*\d+\s*)?(day|week|wk)s?/i);
      var nm = cl(c.t).replace(/\s*[\(\[][^)\]]*(₹|rs\.?|inr|week|day|wk)[^)\]]*[\)\]]\s*/ig, ' ').replace(/[:.\-–—\s]+$/, '').replace(/^[:.\-–—\s]+/, '').trim(); nm = nm ? nm.charAt(0).toUpperCase() + nm.slice(1, 60) : 'Deliverable ' + (k + 1);
      stages.push({ name: nm, scope: scope, amount: am ? Number(am[1].replace(/,/g, '')) * (/^k$/i.test(am[2] || '') ? 1000 : /lakh|lac/i.test(am[2] || '') ? 100000 : 1) : 0, days: du ? Number(du[1]) * (/^d/i.test(du[2]) ? 1 : 7) : 0 });
    });
    if (!stages.length) { var all = []; L.forEach(function (x) { var bm = x.match(bul); if (bm) all.push(bm[2].trim()); }); stages.push({ name: title || 'Project delivery', scope: all.slice(0, 8), amount: total, days: 0 }); }
    return { title: title, client: client, total: total, stages: stages, found: cand.length > 0 };
  }
  function docxText(buf) { return loadLib(MAMMOTH).then(function () { return window.mammoth.convertToHtml({ arrayBuffer: buf }); }).then(function (res) { var doc = new DOMParser().parseFromString(res.value, 'text/html'), out = []; Array.prototype.forEach.call(doc.body.children, function (el) { var tg = el.tagName; if (/^H[1-6]$/.test(tg)) out.push('## ' + el.textContent.trim()); else if (tg === 'UL' || tg === 'OL') Array.prototype.forEach.call(el.querySelectorAll('li'), function (li) { out.push('- ' + li.textContent.trim()); }); else if (tg === 'TABLE') Array.prototype.forEach.call(el.querySelectorAll('tr'), function (tr) { out.push(Array.prototype.map.call(tr.children, function (td) { return td.textContent.trim(); }).join(' | ')); }); else out.push(el.textContent.trim()); }); return out.join('\n'); }); }
  function pdfText(buf) {
    return loadLib(PDFJS).then(function () { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFW; return window.pdfjsLib.getDocument({ data: buf }).promise; }).then(function (pdf) {
      var n = Math.min(pdf.numPages, 15), out = [], seq = Promise.resolve();
      for (var i = 1; i <= n; i++) (function (pn) { seq = seq.then(function () { return pdf.getPage(pn).then(function (pg) { return pg.getTextContent().then(function (tc) { var rows = {}, order = []; tc.items.forEach(function (it) { var y = Math.round(it.transform[5] / 3); if (!rows[y]) { rows[y] = []; order.push(y); } rows[y].push(it); }); order.sort(function (x, y) { return y - x; }); order.forEach(function (y) { var prev = null, line = ''; rows[y].sort(function (p, q) { return p.transform[4] - q.transform[4]; }).forEach(function (it) { if (!it.str) return; var fs0 = Math.abs(it.transform[0]) || 10, gap = prev ? it.transform[4] - (prev.transform[4] + (prev.width || 0)) : 0; if (prev && gap > fs0 * 0.2 && !/\s$/.test(line) && !/^\s/.test(it.str)) line += ' '; line += it.str; prev = it; }); out.push(line.replace(/\s+/g, ' ').trim()); }); }); }); }); })(i);
      return seq.then(function () { return out.join('\n'); });
    });
  }
  /* turns a brief into draft stages: names, what's included, amounts (or a split of the stated budget) and back-to-back dates */
  function briefApply(text, src) {
    var b = parseBrief(text), d = U.draft;
    if (!b.stages.length || !b.stages.some(function (s) { return s.scope.length || s.name; })) { U.briefMsg = { err: 'We couldn\'t find anything to split. Try a brief with headings or bullet points.' }; render(); return; }
    U.briefUndo = d.ms.map(function (m) { return Object.assign({}, m); });
    var sug = b.stages.map(function (s) { var g = suggestFor(s.name, s.scope.join('\n')); return g ? g.mid : 5000; }), fixed = 0, wsum = 0;
    b.stages.forEach(function (s, k) { if (s.amount) fixed += s.amount; else wsum += sug[k]; });
    var left = Math.max(0, b.total - fixed), cum = 0;
    d.ms = b.stages.map(function (s, k) { cum += s.days || 10; return { name: s.name, scope: s.scope.join('\n'), amount: s.amount || (b.total && wsum ? r500(left * sug[k] / wsum) : ''), due: dIso(cum), par: false }; });
    if (!String(d.name).trim() && b.title) d.name = b.title; if (!String(d.corg).trim() && b.client) d.corg = b.client; d.err = {};
    U.briefMsg = { ok: 'Added ' + d.ms.length + (d.ms.length === 1 ? ' deliverable' : ' deliverables') + ' from ' + (src || 'the brief') + '.' + (b.found ? '' : ' We couldn\'t find clear sections, so everything is in one deliverable.') + ' Check the names, prices and dates.' };
    U.pstep = 1; render();
  }
  function readBrief(f) {
    var n = f.name || '', ext = ((n.match(/\.([a-z0-9]+)$/i) || [])[1] || '').toLowerCase(); U.briefMsg = { busy: true, name: n }; render();
    var p = ext === 'docx' ? f.arrayBuffer().then(docxText) : ext === 'pdf' ? f.arrayBuffer().then(pdfText) : /^(txt|md|markdown|csv)$/.test(ext) ? f.text() : Promise.reject(new Error('type'));
    p.then(function (t) { briefApply(t, n); }).catch(function (er) { U.briefMsg = { err: er && er.message === 'type' ? 'Please upload a Word file, a PDF or a text file.' : 'We couldn\'t read that file. Try another, or add the deliverables by hand.' }; render(); });
  }

  /* ---------------- form helpers: phone, email, card, brand marks ---------------- */
  var CTRY = [['IN', '🇮🇳', 'India', '+91', 10, 10], ['US', '🇺🇸', 'United States', '+1', 10, 10], ['GB', '🇬🇧', 'United Kingdom', '+44', 10, 10], ['AE', '🇦🇪', 'UAE', '+971', 9, 9], ['SG', '🇸🇬', 'Singapore', '+65', 8, 8], ['AU', '🇦🇺', 'Australia', '+61', 9, 9], ['CA', '🇨🇦', 'Canada', '+1', 10, 10], ['DE', '🇩🇪', 'Germany', '+49', 10, 11], ['FR', '🇫🇷', 'France', '+33', 9, 9], ['NL', '🇳🇱', 'Netherlands', '+31', 9, 9], ['SA', '🇸🇦', 'Saudi Arabia', '+966', 9, 9], ['BD', '🇧🇩', 'Bangladesh', '+880', 10, 10], ['NP', '🇳🇵', 'Nepal', '+977', 10, 10], ['LK', '🇱🇰', 'Sri Lanka', '+94', 9, 9]];
  function ctryOf(iso) { return CTRY.filter(function (c) { return c[0] === iso; })[0] || CTRY[0]; }
  function parsePhone(v, iso) {
    var t = String(v || '').trim(), c = iso ? ctryOf(iso) : null, digits;
    if (!c) { var best = null; CTRY.forEach(function (x) { if (t.indexOf(x[3]) === 0 && (!best || x[3].length > best[3].length)) best = x; }); c = best || CTRY[0]; }
    digits = (t.indexOf(c[3]) === 0 ? t.slice(c[3].length) : t).replace(/\D/g, '');
    if (t.indexOf('+') !== 0 && digits.length > c[5] && digits.indexOf(c[3].slice(1)) === 0) digits = digits.slice(c[3].length - 1);
    return { c: c, digits: digits };
  }
  function phoneNeed(c) { return c[4] === c[5] ? String(c[4]) : c[4] + '–' + c[5]; }
  function phoneErr(v, iso) { var q = parsePhone(v, iso); if (!q.digits) return ''; if (q.digits.length < q.c[4] || q.digits.length > q.c[5]) return 'Numbers in ' + q.c[2] + ' have ' + phoneNeed(q.c) + ' digits. You entered ' + q.digits.length + '.'; return ''; }
  function phoneHTML(target, value, err) {
    U.phIso = U.phIso || {}; var q = parsePhone(value, U.phIso[target]), c = q.c;
    return '<div class="phone' + (err ? ' bad' : '') + '" data-ph="' + target + '"><select class="input ph-cc" aria-label="Country code">' + CTRY.map(function (x) { return '<option value="' + x[0] + '"' + (x[0] === c[0] ? ' selected' : '') + '>' + x[1] + ' ' + x[3] + ' · ' + x[2] + '</option>'; }).join('') + '</select><input class="input mono ph-num' + (err ? ' bad' : '') + '" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="' + '9876543210'.slice(0, c[5]) + '" value="' + esc(q.digits) + '" aria-label="Phone number"></div><span class="hint ph-h"' + (err ? ' hidden' : '') + '>' + (q.digits ? q.digits.length + ' of ' + phoneNeed(c) + ' digits' : 'Optional. ' + phoneNeed(c) + ' digits for ' + c[2] + '.') + '</span>';
  }
  function phoneSync(w) {
    var sel = w.querySelector('.ph-cc'), inp = w.querySelector('.ph-num'), c = ctryOf(sel.value), d = inp.value.replace(/\D/g, '').slice(0, c[5]), tg = w.dataset.ph; inp.value = d;
    var val = d ? c[3] + ' ' + d : ''; U.phIso = U.phIso || {}; U.phIso[tg] = c[0];
    if (tg === 'd:cphone' && U.draft) U.draft.cphone = val; else if (tg === 'ec:phone' && U.modal && U.modal.f) U.modal.f.phone = val;
    inp.setAttribute('placeholder', '9876543210'.slice(0, c[5])); inp.classList.remove('bad'); w.classList.remove('bad');
    var h = w.parentNode.querySelector('.ph-h'); if (h) { h.classList.remove('hint-err'); h.textContent = d ? d.length + ' of ' + phoneNeed(c) + ' digits' : 'Optional. ' + phoneNeed(c) + ' digits for ' + c[2] + '.'; }
  }
  function emailErr(v) { var t = String(v || '').trim(); if (!t) return 'Enter an email address.'; return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t) ? '' : 'That doesn\'t look like an email. Try name@company.com.'; }
  function luhn(n) { var sum = 0, alt = false; for (var i = n.length - 1; i >= 0; i--) { var d = Number(n[i]); if (alt) { d *= 2; if (d > 9) d -= 9; } sum += d; alt = !alt; } return sum % 10 === 0; }
  function cardBrand(n) { n = String(n || '').replace(/\D/g, ''); if (/^(508|353|356|60|65|81|82)/.test(n)) return 'rupay'; if (/^4/.test(n)) return 'visa'; if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(n)) return 'mc'; if (/^3[47]/.test(n)) return 'amex'; return ''; }
  function cardFmt(n, brand) { n = String(n || '').replace(/\D/g, '').slice(0, brand === 'amex' ? 15 : 19); return brand === 'amex' ? n.replace(/^(\d{4})(\d{0,6})(\d{0,5}).*/, function (m, a, b, c) { return [a, b, c].filter(Boolean).join(' '); }) : n.replace(/(\d{4})(?=\d)/g, '$1 '); }
  function expFmt(v) { var d = String(v || '').replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d; }
  function cardErrs(f) {
    var e = {}, n = String(f.cnum || '').replace(/\D/g, ''), b = cardBrand(n), x = String(f.ex || '').replace(/\D/g, ''), cv = String(f.cv || '').replace(/\D/g, '');
    if (!n) e.cnum = 'Enter your card number.'; else if (n.length < 13 || !luhn(n)) e.cnum = 'That card number doesn\'t look right. Check the digits.';
    if (!x) e.ex = 'Enter the expiry.'; else { var mm = Number(x.slice(0, 2)), yy = Number(x.slice(2)), ty = TODAY.getFullYear() % 100, tm = TODAY.getMonth() + 1; if (x.length < 4 || mm < 1 || mm > 12) e.ex = 'Use MM / YY.'; else if (yy < ty || (yy === ty && mm < tm)) e.ex = 'This card has expired.'; }
    if (!cv) e.cv = 'Enter the CVC.'; else if (cv.length !== (b === 'amex' ? 4 : 3)) e.cv = (b === 'amex' ? '4' : '3') + ' digits.';
    return e;
  }
  var BK = {
    visa: '<svg class="bk" viewBox="0 0 36 24" role="img" aria-label="Visa"><rect width="36" height="24" rx="4" fill="#fff" stroke="#e4e4e7"/><text x="18" y="16.5" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-style="italic" font-size="11" fill="#1A1F71">VISA</text></svg>',
    mc: '<svg class="bk" viewBox="0 0 36 24" role="img" aria-label="Mastercard"><rect width="36" height="24" rx="4" fill="#fff" stroke="#e4e4e7"/><circle cx="14.5" cy="12" r="6.5" fill="#EB001B"/><circle cx="21.5" cy="12" r="6.5" fill="#F79E1B" fill-opacity=".92"/><path d="M18 6.9a6.5 6.5 0 0 1 0 10.2 6.5 6.5 0 0 1 0-10.2z" fill="#FF5F00"/></svg>',
    rupay: '<svg class="bk" viewBox="0 0 36 24" role="img" aria-label="RuPay"><rect width="36" height="24" rx="4" fill="#fff" stroke="#e4e4e7"/><text x="16" y="15.5" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="8.5" fill="#1B3F8B">Ru<tspan fill="#F26A21">Pay</tspan></text><path d="M28 7l4 5-4 5z" fill="#0A9A4B"/><path d="M28 7l-2 5 2 5z" fill="#F26A21" opacity=".0"/></svg>',
    amex: '<svg class="bk" viewBox="0 0 36 24" role="img" aria-label="American Express"><rect width="36" height="24" rx="4" fill="#2E77BC"/><text x="18" y="15.5" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="8.5" fill="#fff">AMEX</text></svg>',
    upi: '<svg class="bk" viewBox="0 0 36 24" role="img" aria-label="UPI"><rect width="36" height="24" rx="4" fill="#fff" stroke="#e4e4e7"/><text x="15" y="15.5" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-style="italic" font-size="9.5" fill="#3b3b3b">UPI</text><path d="M26 6l5 6-5 6" fill="none" stroke="#F37920" stroke-width="2.2" stroke-linejoin="round"/><path d="M29 6l5 6-5 6" fill="none" stroke="#0A9A4B" stroke-width="2.2" stroke-linejoin="round" opacity="0"/></svg>',
    qr: '<svg class="bk" viewBox="0 0 36 24" role="img" aria-label="QR code"><rect width="36" height="24" rx="4" fill="#fff" stroke="#e4e4e7"/><g fill="none" stroke="#3b3b3b" stroke-width="1.6"><rect x="10" y="6" width="6" height="6"/><rect x="20" y="6" width="6" height="6"/><rect x="10" y="14" width="6" height="6"/></g><path d="M20 14h2v2h-2zM24 16h2v4h-4v-2h2z" fill="#3b3b3b"/></svg>',
    card: '<svg class="bk" viewBox="0 0 36 24" role="img" aria-label="Card"><rect width="36" height="24" rx="4" fill="#fff" stroke="#e4e4e7"/><rect x="8" y="7" width="20" height="12" rx="2" fill="none" stroke="#3b3b3b" stroke-width="1.6"/><path d="M8 11h20" stroke="#3b3b3b" stroke-width="1.8"/></svg>'
  };
  var APPS = '<span class="upiapps"><span class="upiapp" style="--c:#4285F4">G Pay</span><span class="upiapp" style="--c:#5F259F">PhonePe</span><span class="upiapp" style="--c:#00B9F1">Paytm</span></span>';
  var TOOLS = '<span class="lstack" aria-label="Figma, Loom, Miro, Google Drive and more">' +
    '<svg viewBox="0 0 24 24" role="img" aria-label="Figma"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M9 3.5h3v5.5H9a2.75 2.75 0 0 1 0-5.5z" fill="#F24E1E"/><path d="M12 3.5h3a2.75 2.75 0 0 1 0 5.5h-3z" fill="#FF7262"/><path d="M9 9h3v5.5H9A2.75 2.75 0 0 1 9 9z" fill="#A259FF"/><circle cx="14.75" cy="11.75" r="2.75" fill="#1ABCFE"/><path d="M9 14.5h3v2.75A2.75 2.75 0 1 1 9 14.5z" fill="#0ACF83"/></svg>' +
    '<svg viewBox="0 0 24 24" role="img" aria-label="Loom"><circle cx="12" cy="12" r="12" fill="#625DF5"/><g stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M12 5.5v13M6.4 8.7l11.2 6.6M6.4 15.3l11.2-6.6"/></g></svg>' +
    '<svg viewBox="0 0 24 24" role="img" aria-label="Miro"><circle cx="12" cy="12" r="12" fill="#FFD02F"/><path d="M6.5 16.5v-8l3.2 4.2 3.2-4.2 3.2 4.2 1.7-2.2" fill="none" stroke="#050038" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    '<svg viewBox="0 0 24 24" role="img" aria-label="Google Drive"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M9.2 5h5.6l4.4 7.6h-5.6z" fill="#FBBC04"/><path d="M9.2 5L4.8 12.6l2.8 4.9 4.4-7.6z" fill="#0F9D58"/><path d="M7.6 17.5h8.8l2.8-4.9H10.4z" fill="#4285F4"/></svg>' +
    '<span class="lmore">+</span></span>';

  function validateDraft(d) {
    var e = {}; if (!d.name.trim()) e.name = 'Enter a project name'; if (!d.cname.trim()) e.cname = 'Enter a contact name';
    var ee = emailErr(d.cemail); if (ee) e.cemail = ee;
    d.ms.forEach(function (m, i) {
      if (!m.name.trim()) e['n' + i] = 'Enter a deliverable name'; if (!(Number(m.amount) > 0)) e['a' + i] = 'Enter an amount';
      if (!String(m.scope || '').trim()) e['s' + i] = 'List at least one thing this deliverable includes';
      if (!m.due) e['d' + i] = 'Choose a delivery date';
      else if (parse(m.due) < TODAY) e['d' + i] = 'Pick a date from today';
      else if (i > 0 && !m.par && d.ms[i - 1].due && m.due <= d.ms[i - 1].due) e['d' + i] = 'Overlaps deliverable ' + i + '. Pick a date after ' + long(parse(d.ms[i - 1].due)) + ', or turn on "Runs alongside".';
    });
    if (!(Number(d.extraFee) >= 0)) e.extraFee = 'Enter an amount (0 for free)';
    if (!/^[\w.\-]{2,}@[A-Za-z]{2,}$/.test(String(S().payout.upi || '').trim())) e.upi = 'Add your UPI ID so clients can pay you.';
    if (!(Number(d.advancePct) >= 0 && Number(d.advancePct) <= 90)) e.advancePct = 'Enter a percentage from 0 to 90';
    var pe = phoneErr(d.cphone, (U.phIso || {})['d:cphone']); if (pe) e.cphone = pe;
    return e;
  }
  function defaultDraft() {
    return { name: '', cname: '', corg: '', cemail: '', cphone: '', ccolor: nextColor(), clogo: '', reviewDays: S().defaults.reviewDays, rounds: S().defaults.rounds, autoDays: S().defaults.autoDays, extraFee: S().defaults.extraFee, advancePct: S().defaults.advancePct, payDays: S().defaults.payDays, unlock: null, err: {}, ms: [{ name: '', amount: '', due: '', scope: '' }] };
  }
  function lines(s) { return String(s || '').split(/\n+/).map(function (x) { return x.replace(/^[-*•\s]+/, '').trim(); }).filter(Boolean); }
  function totalDraft() { return U.draft.ms.reduce(function (a, m) { return a + (Number(m.amount) || 0); }, 0); }
  function fileKind(n, t) { return /^image\//.test(t) ? 'image' : /^video\//.test(t) || /\.(mp4|mov|m4v|webm|avi|mkv)$/i.test(n) ? 'video' : /pdf/i.test(t + n) ? 'pdf' : 'doc'; }
  function fileTag(f) { if (f.kind === 'link') return f.figma ? 'FIG' : 'URL'; if (f.kind === 'video') return 'VID'; return f.kind === 'image' ? 'IMG' : f.kind === 'pdf' ? 'PDF' : (/\.(zip|rar)$/i.test(f.name) ? 'ZIP' : 'DOC'); }
  function size(b) { return b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
  function fileUrl(f) { return f.url || MEM[f.id] || ''; }
  var SAMPLE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400"><rect width="640" height="400" fill="#F2EEE7"/><rect x="32" y="32" width="250" height="200" rx="8" fill="#B4532A"/><circle cx="157" cy="132" r="56" fill="#E8A33D"/><rect x="298" y="32" width="150" height="96" rx="8" fill="#2A211C"/><rect x="464" y="32" width="144" height="96" rx="8" fill="#D9C7B0"/><rect x="298" y="144" width="310" height="88" rx="8" fill="#8C9A7E"/><path d="M32 360q80-90 160 0t160 0 160 0 96 0" fill="none" stroke="#2A211C" stroke-width="6"/><text x="32" y="270" font-family="sans-serif" font-weight="700" font-size="22" fill="#2A211C">Warm, handmade, quietly precise</text><text x="32" y="294" font-family="sans-serif" font-size="14" fill="#6C5E55">Direction A · clay, ember, ink</text></svg>';
  function sampleFiles() { return [{ id: uid(), name: 'Moodboard.svg', size: '18 KB', kind: 'image', url: 'data:image/svg+xml;utf8,' + encodeURIComponent(SAMPLE_SVG) }, { id: uid(), name: 'References.pdf', size: '2.4 MB', kind: 'pdf', url: '' }, { id: uid(), name: 'Notes.docx', size: '120 KB', kind: 'doc', url: '' }]; }
  /* Only things a client can look at in the browser: images, PDFs, videos and docs. No zips, no source files.
     Anything else is turned away with a message; links (Figma and others) are added separately. */
  var VIEW_EXT = /\.(pdf|png|jpe?g|gif|webp|svg|avif|heic|bmp|tiff?|mp4|mov|m4v|webm|avi|mkv|doc|docx|txt|rtf|odt|ppt|pptx|key|xls|xlsx|csv|pages|numbers)$/i;
  var VIEW_ACCEPT = 'image/*,video/*,.pdf,.doc,.docx,.txt,.rtf,.odt,.ppt,.pptx,.key,.xls,.xlsx,.csv,.pages,.numbers';
  function viewable(f) { return /^(image|video)\//.test(f.type || '') || f.type === 'application/pdf' || VIEW_EXT.test(f.name || ''); }
  function linkInfo(u) {
    try { var x = new URL(u), host = x.hostname.replace(/^www\./, ''), seg = decodeURIComponent(x.pathname.split('/').filter(Boolean).pop() || '').replace(/[-_+]+/g, ' ').trim(), fig = /(^|\.)figma\.com$/.test(host);
      return { host: host, figma: fig, label: (fig ? 'Figma' : host) + (seg && seg.length < 40 && /\s|[a-z]{4}/i.test(seg) && !/^[\w]{18,}$/.test(seg) ? ' · ' + seg : '') }; } catch (e) { return null; }
  }
  /* everything a stage delivers: files and links, in the order they were added */
  function items(m) { return m.files.concat((m.links || []).map(function (l) { return { id: l.id, name: l.label, kind: 'link', url: l.url, size: l.host, v: l.v, figma: l.figma }; })); }
  function attach(m, files) { var v = m.revisions + 1; files.forEach(function (f) { f.v = v; m.files.push(f); }); log('freelancer', 'Added ' + files.length + ' file' + (files.length > 1 ? 's' : '') + ' to ' + m.name); save(); }
  function readFiles(m, list) {
    var arr = Array.prototype.slice.call(list || []); if (!arr.length) return;
    var bad = arr.filter(function (f) { return !viewable(f); }); arr = arr.filter(viewable);
    U.upErr = bad.length ? 'Please upload a file that can be viewed. We support images, PDFs, videos and docs. ' + (bad.length === 1 ? '“' + bad[0].name + '” can\'t be previewed.' : bad.length + ' of these files can\'t be previewed.') : '';
    if (!arr.length) { render(); return; }
    var batch = arr.map(function (f) { return { id: uid(), name: f.name, size: size(f.size), kind: fileKind(f.name, f.type), url: '', raw: f }; });
    U.uploading = batch.map(function (b) { return { name: b.name, size: b.size }; }); render();
    var pending = batch.length;
    batch.forEach(function (b) {
      var done = function () { delete b.raw; if (--pending === 0) setTimeout(function () { U.uploading = []; attach(m, batch); render(); toast('thumbs', batch.length + (batch.length > 1 ? ' files' : ' file') + ' uploaded', 'Previews are ready.'); }, REDUCE ? 50 : 1000); };
      if (b.kind === 'image' && b.raw.size < 1500000) { var r = new FileReader(); r.onload = function () { b.url = r.result; done(); }; r.onerror = done; r.readAsDataURL(b.raw); }
      else { try { MEM[b.id] = URL.createObjectURL(b.raw); } catch (e) {} done(); }
    });
  }
  /* The advance is paid straight to the freelancer; paying it (or marking it paid another way) starts work. */
  function doAdvance(p, how) { p = p || P(); p.advancePaid = true; p.advanceAt = new Date().toISOString(); p.advanceHow = how || 'online'; log(how === 'manual' ? 'freelancer' : 'client', how === 'manual' ? 'Marked the ' + inr(advAmt(p)) + ' advance as paid another way' : first(p.client.name) + ' paid the ' + inr(advAmt(p)) + ' advance to ' + first(D.studio.name), p.id); startNext(p); save(); }
  /* Paying the balance unlocks the originals. how: 'online' (the client paid), 'manual' (paid another way) or 'free' (unlocked without payment, the freelancer's call). */
  function doPay(m, how, p) {
    p = p || P(); var list = projMode(p) ? p.ms.filter(function (x) { return x.status === 'approved'; }) : [m], amt = payAmt(m, p), t = new Date().toISOString(), nm = list.map(function (x) { return x.name; }).join(', ');
    list.forEach(function (x) { x.status = 'released'; x.releasedAt = t; x.paidHow = how || 'online'; x.seen = x.seen || {}; x.seen.released = false; });
    log(how === 'online' ? 'client' : 'freelancer', how === 'free' ? 'Unlocked the originals for ' + nm + ' without payment' : (how === 'manual' ? 'Marked ' + inr(amt) + ' as paid another way' : first(p.client.name) + ' paid ' + inr(amt) + ' to ' + first(D.studio.name)) + '. Originals unlocked for ' + nm, p.id);
    startNext(p); save();
  }
  /* Feedback history: every send, change request, reply and approval for a stage, in order, so a scope dispute can be settled from the record. */
  function histOf(m) {
    var h = (m.history || []).slice();
    if (!h.length) {
      (m.notes || []).forEach(function (n) { h.push({ t: n.at, who: 'client', type: 'changes', round: n.v, text: n.text }); });
      if (m.submittedAt) h.push({ t: m.submittedAt, who: 'freelancer', type: 'submitted', v: (m.revisions || 0) + 1, text: m.deliveryNote || '' });
      if (!h.some(function (e) { return e.type === 'submitted'; }) && h.length) h.push({ t: new Date(new Date(h[0].t).getTime() - 2 * 86400000).toISOString(), who: 'freelancer', type: 'submitted', v: 1, text: '' });
      if (m.dispute) h.push({ t: m.dispute.at, who: 'client', type: 'issue', text: m.dispute.note });
      if (m.approvedAt) h.push({ t: m.approvedAt, who: m.autoApproved ? 'system' : 'client', type: 'approved' });
    }
    return h.sort(function (x, y) { return new Date(x.t) - new Date(y.t); });
  }
  function pushH(m, e) { if (!m.history) m.history = histOf(m); e.t = e.t || new Date().toISOString(); m.history.push(e); }
  function feedbackCard(m, p) {
    if (!m) return ''; var h = histOf(m), rounds = h.filter(function (e) { return e.type === 'changes'; }).length;
    if (!rounds && !h.some(function (e) { return e.type === 'issue'; })) return '';
    var name = function (w) { return w === 'client' ? esc(first(p.client.name)) : w === 'system' ? 'PayGuard' : esc(first(D.studio.name)); };
    var title = function (e) { return { submitted: 'sent version ' + e.v, changes: 'asked for changes (round ' + e.round + ')', reply: 'replied', issue: 'reported a problem', approved: e.who === 'system' ? 'approved automatically' : 'approved', extra: 'added an extra round' }[e.type] || e.type; };
    return '<section class="panel">' + secH('refresh', 'Feedback history', '<span class="muted">' + rounds + ' of ' + m.limit + ' rounds used</span>') + '<ol class="fhist">' + h.map(function (e) {
      return '<li class="fh ' + e.type + '"><span class="fdot"></span><div><b>' + name(e.who) + ' ' + title(e) + '</b><i>' + fmt(new Date(e.t), { day: 'numeric', month: 'short' }) + '</i>' + (e.text ? '<q>' + esc(e.text) + '</q>' : '') + '</div></li>';
    }).join('') + '</ol>' + (m.extraRounds ? '<p class="muted" style="font-size:var(--t1);margin:8px 0 0">Extra rounds added: ' + m.extraRounds + '.</p>' : '') + '</section>';
  }
  function doSubmit(m) { m.deliveryNote = String(U.dnote || '').trim(); U.dnote = ''; pushH(m, { who: 'freelancer', type: 'submitted', v: m.revisions + 1, text: m.deliveryNote }); m.status = 'submitted'; m.submittedAt = new Date().toISOString(); m.replyBy = dIso(P().reviewDays || 3); m.seen.submitted = false; log('freelancer', 'Submitted ' + m.name + ' for review'); save(); }
  function doApprove(m, auto, p) {
    p = p || P(); pushH(m, { who: auto ? 'system' : 'client', type: 'approved' }); m.status = 'approved'; m.approvedAt = new Date().toISOString(); m.autoApproved = !!auto; m.seen = m.seen || {}; m.seen.approved = false;
    log(auto ? 'system' : 'client', auto ? m.name + ' was approved automatically after no reply. Originals unlock when ' + first(p.client.name) + ' pays' : first(p.client.name) + ' approved ' + m.name + '. Originals unlock when they pay', p.id);
    if (projMode(p)) startNext(p); save();
  }
  /* Gentle automatic nudges: the day before a reply or payment date, and once it is late. Each is sent once per stage.
     In the prototype "sent" is recorded in the activity log; nothing leaves the browser. */
  function autoRemind() {
    if (!S().notify.auto) return; var n = 0;
    D.projects.forEach(function (p) {
      var m = currentMsOf(p), a = m && attentionFor(p); if (!a) return; var kind = '';
      if (a.kind === 'approve') { var rd = days(replyBy(m)); kind = rd === 1 ? 'before' : rd < 0 ? 'late' : ''; }
      else if (a.kind === 'pay') { var pd = days(payBy(m, p)); kind = pd === 1 ? 'before' : pd < 0 ? 'late' : ''; }
      else if (a.kind === 'fund' || a.kind === 'sign') kind = a.sev === 'red' ? 'late' : '';
      if (!kind) return; m.autoRem = m.autoRem || {}; var key = a.kind + ':' + kind; if (m.autoRem[key]) return;
      m.autoRem[key] = new Date().toISOString(); p.remindedAt = m.autoRem[key]; p.remindedAuto = true;
      log('system', 'Automatic reminder sent to ' + first(p.client.name) + ' by ' + (p.client.phone ? 'WhatsApp' : 'email') + ' (' + (kind === 'before' ? 'due tomorrow' : 'now late') + ')', p.id); n++;
    });
    if (n) { save(); U.autoSent = (U.autoSent || 0) + n; }
  }
  /* Runs before every render: approve any stage whose no-reply window has run out. */
  function sweepAuto() {
    D.projects.forEach(function (p) { p.ms.forEach(function (m) { var aa = m.status === 'submitted' && autoAt(p, m); if (aa && days(aa) <= 0) doApprove(m, true, p); }); });
  }
  function doIssue(m, reason, note) { pushH(m, { who: 'client', type: 'issue', text: note }); m.dispute = { reason: reason, note: note, at: new Date().toISOString(), prev: m.status }; m.status = 'dispute'; m.seen.dispute = false; log('client', first(clientName()) + ' reported a problem with ' + m.name + ': ' + REASONS[reason]); save(); }
  function doWithdraw(m) { m.status = (m.dispute && m.dispute.prev) || 'funded'; m.dispute = null; log('client', first(clientName()) + ' withdrew the problem report on ' + m.name); save(); }
  function doResolve(m, note) { var prev = (m.dispute && m.dispute.prev) || 'funded'; m.status = prev === 'submitted' ? 'changes' : prev; if (m.status === 'changes') m.notes.push({ v: m.revisions, text: 'From the problem report: ' + m.dispute.note, at: new Date().toISOString() }); pushH(m, { who: 'freelancer', type: 'reply', text: note }); m.reply = note; m.dispute = null; log('freelancer', 'Replied to the problem report on ' + m.name + ': “' + note + '”'); save(); }
  function doRefund(m) { m.status = 'refunded'; m.refundedAt = new Date().toISOString(); m.dispute = null; m.seen.refunded = false; log('freelancer', 'Refunded ' + first(clientName()) + ' in full for ' + m.name + ' (' + inr(fees(m.amount).total) + ')'); save(); }
  function doExtra(m) { var p = P(), x = Number(p.extraFee) || 0; pushH(m, { who: 'client', type: 'extra' }); m.limit++; m.amount += x; m.extra = (m.extra || 0) + x; m.extraRounds = (m.extraRounds || 0) + 1; log('client', first(p.client.name) + ' added a round of changes to ' + m.name + ' (+' + inr(x) + ')'); save(); }
  function doChanges(m, text) { m.revisions++; pushH(m, { who: 'client', type: 'changes', round: m.revisions, text: text }); m.status = 'changes'; m.replyBy = null; m.seen.changes = false; m.notes.push({ v: m.revisions, text: text, at: new Date().toISOString() }); log('client', first(clientName()) + ' asked for changes on ' + m.name + ' (round ' + m.revisions + ' of ' + m.limit + ')'); save(); }

  /* ---------------- toasts ---------------- */
  function toast(b, title, msg) {
    var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status');
    var TI = { worry: 'x', hello: 'clock', point: 'upload', work: 'pencil', cheer: 'wallet', wallet: 'wallet', thumbs: 'check', guard: 'shield' };
    t.innerHTML = '<span class="chip">' + ico(TI[b] || 'check') + '</span><div><b>' + esc(title) + '</b>' + (msg ? '<span class="m">' + esc(msg) + '</span>' : '') + '</div>';
    var box = document.getElementById('toasts'); while (box.children.length >= 3) box.removeChild(box.firstChild);
    box.appendChild(t);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 260); }, 4200);
  }

  /* ---------------- calendar ---------------- */
  function eventsOf(p, all) {
    var out = [], col = ccol(p); p.ms.forEach(function (m, i) {
      var tag = all ? org(p) : 'Deliverable ' + (i + 1);
      out.push({ date: parse(m.due), kind: closed(m) ? 'done' : 'due', label: m.name, sub: tag + (m.status === 'released' ? ' · Unlocked' : m.status === 'approved' ? ' · Payment' : ' · Delivery'), pid: p.id, color: col });
      if (m.status === 'submitted' && m.replyBy) out.push({ date: parse(m.replyBy), kind: 'rv', label: 'Reply due', sub: (all ? org(p) + ' · ' : '') + m.name, pid: p.id, color: col });
    }); return out;
  }
  function eventsAll() { var out = []; D.projects.forEach(function (p) { out = out.concat(eventsOf(p, true)); }); return out.sort(function (a, b) { return a.date - b.date; }); }
  function events() { return P() ? eventsOf(P(), false).sort(function (a, b) { return a.date - b.date; }) : []; }
  function nextEvents(n) { return events().filter(function (x) { return x.date >= TODAY && x.kind !== 'done'; }).slice(0, n); }
  /* The details panel is closed until asked for; the choice is remembered. */
  function paneOpen() { return !!(D.ui && D.ui.pane); }
  function calendar(evs, month, limit) {
    var first1 = new Date(month.getFullYear(), month.getMonth(), 1), lead = (first1.getDay() + 6) % 7, start = addDays(first1, -lead), h = '';
    ['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach(function (d) { h += '<div class="dow">' + d + '</div>'; });
    for (var k = 0; k < 42; k++) {
      var d = addDays(start, k); if (k >= 35 && d.getMonth() !== month.getMonth()) break;
      var e = evs.filter(function (x) { return same(x.date, d); }), c = 'd' + (d.getMonth() !== month.getMonth() ? ' out' : '') + (same(d, TODAY) ? ' today' : '') + (e.length ? ' has' : '');
      h += '<div class="' + c + '"' + (e.length ? ' style="--c:' + e[0].color + '" title="' + esc(e.map(function (x) { return x.label + ' · ' + x.sub; }).join('\n')) + '"' : '') + '><span>' + d.getDate() + '</span>' + (e.length ? '<span class="dots">' + e.slice(0, 3).map(function (x) { return '<i class="' + x.kind + '" style="--c:' + x.color + '"></i>'; }).join('') + '</span>' : '') + '</div>';
    }
    var up = evs.filter(function (x) { return x.date >= TODAY && x.kind !== 'done'; }).slice(0, limit || 4);
    return '<div class="card-b"><div class="cal-head"><b style="font-size:var(--t2)">' + fmt(month, { month: 'long', year: 'numeric' }) + '</b><span style="display:flex;gap:4px"><button data-a="calnav" data-dir="-1" aria-label="Previous month">‹</button><button data-a="calnav" data-dir="1" aria-label="Next month">›</button></span></div>' +
      '<div class="cal-grid">' + h + '</div>' +
      (up.length ? '<ul class="ag" style="margin-top:12px">' + up.map(function (x) { return '<li style="--c:' + x.color + ';' + (x.pid ? 'cursor:pointer' : '') + '"' + (x.pid ? ' data-a="openp" data-id="' + x.pid + '"' : '') + '><div class="dt"><b>' + x.date.getDate() + '</b><span>' + fmt(x.date, { month: 'short' }) + '</span></div><div style="min-width:0"><div style="font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(x.label) + '</div><div class="muted" style="font-size:var(--t1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(x.sub) + '</div></div><span class="muted" style="font-size:var(--t1);white-space:nowrap">' + rel(x.date) + '</span></li>'; }).join('') + '</ul>' : '<p class="muted" style="margin-top:12px">Nothing coming up.</p>') + '</div>';
  }
  function calEvents() { return eventsAll().filter(function (e) { return !U.calClient || e.pid === U.calClient; }); }
  function calLegend() {
    return '<div class="chips" style="padding:16px 20px 0"><button class="cl" data-a="calclient" data-id="" aria-pressed="' + !U.calClient + '">All clients</button>' + D.projects.map(function (p) { return '<button class="cl" data-a="calclient" data-id="' + p.id + '" aria-pressed="' + (U.calClient === p.id) + '" style="--c:' + ccol(p) + '"><i></i>' + esc(org(p)) + '</button>'; }).join('') + '</div>';
  }
  function bigCalInner(evs) {
    var month = U.cal, f1 = new Date(month.getFullYear(), month.getMonth(), 1), lead = (f1.getDay() + 6) % 7, start = addDays(f1, -lead), h = '';
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(function (d) { h += '<div class="dow">' + d + '</div>'; });
    for (var k = 0; k < 42; k++) {
      var d = addDays(start, k); if (k >= 35 && d.getMonth() !== month.getMonth()) break;
      var e = evs.filter(function (x) { return same(x.date, d); }), more = e.length > 3 ? e.length - 3 : 0;
      h += '<div class="cell' + (d.getMonth() !== month.getMonth() ? ' out' : '') + (same(d, TODAY) ? ' today' : '') + '"><span class="num">' + d.getDate() + '</span>' + e.slice(0, 3).map(function (x) { return '<span class="chip ' + x.kind + '" style="--c:' + x.color + '" title="' + esc(x.label + ' · ' + x.sub) + '"' + (x.pid ? ' data-a="openp" data-id="' + x.pid + '"' : '') + '>' + esc(x.kind === 'rv' ? 'Reply due' : (x.sub.split(' · ')[0] + ': ' + x.label)) + '</span>'; }).join('') + (more ? '<span class="muted" style="font-size:var(--t1)">+' + more + ' more</span>' : '') + '</div>';
    }
    return calLegend() + '<div class="card-b"><div class="cal-head"><b style="font-size:var(--t3);font-weight:600;letter-spacing:-.02em">' + fmt(month, { month: 'long', year: 'numeric' }) + '</b><span style="display:flex;gap:4px"><button data-a="calnav" data-dir="-1" aria-label="Previous month">‹</button><button data-a="calnav" data-dir="1" aria-label="Next month">›</button></span></div><div class="bigcal">' + h + '</div></div>';
  }
  /* ---------------- shared bits ---------------- */
  function brandStyle() { return 'style="--brand:' + BRANDS[D.studio.brand] + '"'; }
  function mark() { return '<span class="m">' + ico('shield') + '</span>'; }
  function avatarFor(p, big) { return avatarHTML({ org: org(p), name: p.client.name, color: p.client.color, logo: p.client.logo }, big); }
  /* Stages as an accordion: the header row carries the status and price, the detail sits underneath until opened. */
  function stageDetail(m, p, o, open) {
    var inc = m.scope && m.scope.length ? scopeList(m.scope, 'tick') : '<p class="muted" style="margin:0">Nothing listed for this deliverable.</p>';
    return '<div class="acc-b"' + (open ? '' : ' hidden') + '><p class="lbl">What\'s included</p>' + inc + '</div>';
  }
  function msRows(o) {
    o = o || {}; var p = P();
    return '<div class="acc">' + ms().map(function (m, i) {
      var open = !!(U.open && U.open[m.id]), cur = currentMs() && currentMs().id === m.id;
      return '<div class="acc-i' + (open ? ' open' : '') + (cur ? ' cur' : '') + '"><button type="button" class="acc-h" data-a="tgl" data-id="' + m.id + '" aria-expanded="' + open + '"><span class="n">' + (m.status === 'released' ? ico('check', '') : (i + 1)) + '</span><span class="acc-t"><b>' + esc(m.name) + '</b><i>Due ' + long(parse(m.due)) + '</i></span><span class="mono">' + inr(m.amount) + '</span>' + stBadge(m, p) + ico('chev', 'acc-c') + '</button>' + stageDetail(m, p, o, open) + '</div>';
    }).join('') + '</div>';
  }
  /* ---------------- previews ----------------
     What a client sees before approving: images and videos with a tiled watermark, and PDFs and Word files drawn
     page by page. Real files are rendered in the browser (pdf.js, mammoth); anything else gets a sample layout. */
  var PVC = {}, LIBP = {};
  var PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', PDFW = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js', MAMMOTH = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js', QRLIB = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
  function loadLib(src) { return LIBP[src] || (LIBP[src] = new Promise(function (res, rej) { var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = function () { delete LIBP[src]; rej(new Error('load ' + src)); }; document.head.appendChild(s); })); }
  /* two-tone tile (dark text, light outline) so it reads on white pages, photos and dark artwork alike; names the viewer and the day */
  function wmStyle() {
    var who = String(P() ? P().client.name : 'Preview').toUpperCase(), d = fmt(TODAY, { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="380" height="240"><g transform="rotate(-24 190 120)" font-family="Inter,Helvetica,Arial,sans-serif" font-weight="700" text-anchor="middle" paint-order="stroke"><text x="190" y="116" font-size="15" letter-spacing="2.4" fill="rgba(24,24,27,.34)" stroke="rgba(255,255,255,.7)" stroke-width="3">PREVIEW · ' + esc(who) + '</text><text x="190" y="138" font-size="11" letter-spacing="2" fill="rgba(24,24,27,.3)" stroke="rgba(255,255,255,.65)" stroke-width="2.5">' + d + ' · ' + esc(String(D.studio.biz || D.studio.name).toUpperCase()) + '</text></g></svg>';
    return '--wm:url(data:image/svg+xml;utf8,' + encodeURIComponent(svg).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/'/g, '%27') + ')';
  }
  function pageOf(inner, wm, cls) { return '<div class="page' + (cls ? ' ' + cls : '') + '">' + inner + (wm ? '<div class="wm" aria-hidden="true"></div>' : '') + '</div>'; }
  function samplePages(f, wm, note) {
    var t = esc(String(f ? f.name : 'Document').replace(/\.[^.]+$/, '')), s = esc(D.studio.biz);
    return pageOf('<div class="sp"><p class="sp-k">' + s + '</p><h4 class="sp-h">' + t + '</h4><p class="sp-d">Prepared for review · version 1</p><p>This document sets out the direction for the deliverable: what was agreed, what has been made, and what happens next. Everything here is open for comments before you approve.</p><div class="sp-blk" style="background:#B4532A"></div><p>The work follows the brief closely. Colour, type and layout are kept restrained so the idea has room to land, with one clear direction rather than several half-finished ones.</p><ul><li>One direction, fully developed</li><li>Desktop and mobile layouts</li><li>Notes on what to adjust in the next round</li></ul></div>', wm) +
      pageOf('<div class="sp"><p class="sp-k">' + s + '</p><h4 class="sp-h">Next steps</h4><div class="sp-cols"><div><p>Approve this deliverable to unlock the original files. If something needs to change, ask for changes and say what.</p><p>Each deliverable includes a set number of rounds of changes, shown beside the approve button.</p></div><div><div class="sp-blk" style="background:#E8A33D;height:90px"></div><div class="sp-blk" style="background:#2A211C;height:60px"></div></div></div></div>', wm) +
      (note ? '<p class="pgnote">' + esc(note) + '</p>' : '');
  }
  function pagesFromCache(c, f, wm) {
    if (c.imgs) return c.imgs.map(function (g) { return pageOf('<img src="' + g.src + '" alt="" draggable="false" style="aspect-ratio:' + g.w + '/' + g.h + '">', wm); }).join('') + (c.more ? '<p class="pgnote">Showing the first ' + c.imgs.length + ' pages of ' + (c.imgs.length + c.more) + '.</p>' : '');
    if (c.html) return pageOf('<div class="flow">' + c.html + '</div>', wm, 'flowpg');
    return samplePages(f, wm, 'The real preview couldn\'t load here, so this is a sample layout.');
  }
  function docKind(f) { var n = String(f && f.name || ''); return /\.pdf$/i.test(n) || (f && f.kind === 'pdf') ? 'pdf' : /\.docx$/i.test(n) ? 'docx' : /\.(txt|csv)$/i.test(n) ? 'txt' : ''; }
  function previewStage(f, unlocked) {
    var wm = !unlocked && !(f && f.kind === 'link'), sty = wm ? ' style="' + wmStyle() + '"' : '', u = f ? fileUrl(f) : '', wmEl = wm ? '<div class="wm" aria-hidden="true"></div>' : '', pr = ' data-protect="' + (unlocked ? '0' : '1') + '"';
    if (f && f.kind === 'link') return '<div class="deliverable"' + pr + '><div class="linkp"><span class="lic">' + ico('link') + '</span><b>' + esc(f.name) + '</b><span class="muted">' + esc(f.size) + '</span><a class="btn" href="' + esc(f.url) + '" target="_blank" rel="noopener noreferrer">Open ' + (f.figma ? 'in Figma' : 'link') + ' ' + ico('chev') + '</a><span class="muted" style="font-size:var(--t1)">Opens in a new tab. View only.</span></div></div>';
    if (f && f.kind === 'image' && u) return '<div class="deliverable"' + sty + pr + '><img src="' + esc(u) + '" alt="' + esc(f.name) + '" draggable="false">' + wmEl + '</div>';
    if (f && f.kind === 'video' && u) return '<div class="deliverable"' + sty + pr + '><video src="' + esc(u) + '" controls playsinline controlsList="nodownload noremoteplayback" disablePictureInPicture></video>' + wmEl + '</div>';
    var k = docKind(f), c = f && PVC[f.id], inner, attr = '';
    if (c) inner = pagesFromCache(c, f, wm);
    else if (u && k) { inner = '<div class="pgwait"><i class="fb-spin"></i>Preparing preview…</div>'; attr = ' data-k="' + k + '" data-url="' + esc(u) + '" data-fid="' + f.id + '"'; }
    else inner = samplePages(f, wm, f && !u && f.name ? '' : u ? 'A preview of this file type is made when it is uploaded in the real product.' : '');
    return '<div class="stage doc pv"' + sty + pr + attr + '><div class="pages">' + inner + '</div></div>';
  }
  /* fills in real PDF and Word previews after a screen is drawn; results are cached so tabs switch instantly */
  /* a real, scannable QR for the UPI link; if the library can't load, a plain placeholder is drawn instead */
  function mountQR(root) {
    var el = root.querySelector('#qrbox'); if (!el) return; var v = el.dataset.v;
    var fallback = function () { var n = 25, c = [], h = 0; for (var q = 0; q < v.length; q++) h = (h * 31 + v.charCodeAt(q)) >>> 0; var f = function (x, y) { return (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9); }; for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) { h = (h * 1103515245 + 12345) >>> 0; var on = f(x, y) ? ((x % 6 === 0 || y % 6 === 0 || x % 6 === 6 || (x % 7 > 1 && x % 7 < 5 && y % 7 > 1 && y % 7 < 5)) && (x < 7 || x > n - 8) && (y < 7 || y > n - 8)) : ((h >>> 16) & 1); if (on) c.push('<rect x="' + x + '" y="' + y + '" width="1" height="1"/>'); } el.innerHTML = '<svg viewBox="0 0 ' + n + ' ' + n + '" shape-rendering="crispEdges" role="img" aria-label="Sample QR code">' + c.join('') + '</svg>'; };
    loadLib(QRLIB).then(function () { var qr = window.qrcode(0, 'M'); qr.addData(v); qr.make(); el.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); }).catch(fallback);
  }
  function mountDocs(root) {
    Array.prototype.forEach.call(root.querySelectorAll('.pv[data-fid]'), function (el) {
      var fid = el.dataset.fid, k = el.dataset.k, url = el.dataset.url, wm = !!el.style.getPropertyValue('--wm'); el.removeAttribute('data-k');
      var f = null; ms().forEach(function (m) { items(m).forEach(function (x) { if (x.id === fid) f = x; }); });
      var done = function (c) { PVC[fid] = c; if (el.isConnected) el.querySelector('.pages').innerHTML = pagesFromCache(c, f, wm); };
      if (k === 'pdf') loadLib(PDFJS).then(function () { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFW; return fetch(url).then(function (r) { return r.arrayBuffer(); }); }).then(function (buf) { return Promise.race([window.pdfjsLib.getDocument({ data: buf }).promise, new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, 20000); })]); }).then(function (pdf) {
        var n = Math.min(pdf.numPages, 12), imgs = [], seq = Promise.resolve();
        for (var i = 1; i <= n; i++) (function (pn) { seq = seq.then(function () { return pdf.getPage(pn).then(function (pg) { var v0 = pg.getViewport({ scale: 1 }), v = pg.getViewport({ scale: Math.min(2, 900 / v0.width) }), cv = document.createElement('canvas'); cv.width = v.width; cv.height = v.height; return pg.render({ canvasContext: cv.getContext('2d'), viewport: v }).promise.then(function () { imgs.push({ src: cv.toDataURL('image/jpeg', 0.82), w: Math.round(v.width), h: Math.round(v.height) }); }); }); }); })(i);
        return seq.then(function () { done({ imgs: imgs, more: pdf.numPages - n }); });
      }).catch(function (er) { try { console.warn('PayGuard preview (pdf):', er && er.message || er); } catch (x) {} done({ fail: true }); });
      else if (k === 'docx') loadLib(MAMMOTH).then(function () { return fetch(url).then(function (r) { return r.arrayBuffer(); }); }).then(function (ab) { return window.mammoth.convertToHtml({ arrayBuffer: ab }); }).then(function (res) { done({ html: res.value }); }).catch(function () { done({ fail: true }); });
      else if (k === 'txt') fetch(url).then(function (r) { return r.text(); }).then(function (t) { done({ html: '<pre>' + esc(t.slice(0, 20000)) + '</pre>' }); }).catch(function () { done({ fail: true }); });
    });
  }
  function money(n) { return '<span class="mono">' + inr(n) + '</span>'; }
  function sheetHTML(m, p, which) {
    var s = D.studio, c = p.client, id = m.id.toUpperCase().slice(0, 4), t0 = m.releasedAt || m.approvedAt || m.fundedAt, d0 = fmt(t0 ? new Date(t0) : TODAY, { day: 'numeric', month: 'short', year: 'numeric' });
    var ln = function (a, b, cls) { return '<div class="ln' + (cls ? ' ' + cls : '') + '"><span>' + a + '</span><span>' + b + '</span></div>'; }, mt = function (x) { return '<span class="mt">' + x + '</span>'; };
    if (which === 'invoice') return '<div class="sheet"><p class="mt">INVOICE FROM ' + esc(s.biz.toUpperCase()) + '</p><h4>INV-' + id + '</h4><div class="mt">Issued ' + d0 + '</div><hr>' + ln(mt('From'), esc(s.biz)) + ln(mt('To'), esc(org(p))) + '<hr>' +
      ln(esc(m.name) + (m.extra ? ' (incl. ' + (m.extraRounds || 1) + ' extra round' + ((m.extraRounds || 1) > 1 ? 's' : '') + ')' : ''), inr(m.amount)) +
      (m.scope && m.scope.length ? '<div class="mt" style="padding:2px 0 4px">' + m.scope.map(function (x) { return '· ' + esc(x); }).join('<br>') + '</div>' : '') +
      ln('Total for the work', inr(m.amount), 't') + '<hr><div class="mt">Tax details as per ' + esc(s.biz) + '\'s registration.</div></div>';
    var done = m.status === 'released', adv = m.amount - balOf(m, p), bal = balOf(m, p);
    var stamp = done ? 'UNLOCKED' : m.status === 'dispute' ? 'ON HOLD' : '';
    var how = m.paidHow === 'free' ? 'Unlocked by ' + esc(first(s.name)) + ' without payment' : m.paidHow === 'manual' ? 'Paid another way, confirmed by ' + esc(first(s.name)) : 'UPI, QR or card, straight to ' + esc(first(s.name));
    var trail = 'Started → delivered → ' + (m.revisions ? 'revised ' + m.revisions + '× → ' : '') + (done ? (m.autoApproved ? 'approved automatically → paid → originals unlocked.' : 'approved → paid → originals unlocked.') : m.status === 'approved' ? 'approved. Awaiting payment.' : m.status === 'dispute' ? 'on hold.' : m.status === 'submitted' ? 'in review.' : 'in progress.');
    return '<div class="sheet">' + (stamp ? '<span class="stamp"' + (done ? '' : ' style="border-color:#71717A;color:#71717A"') + '>' + stamp + '</span>' : '') + '<p class="mt">PAYMENT SUMMARY</p><h4>RCT-' + id + '</h4><div class="mt">' + (done ? 'Paid ' + d0 : 'Not paid yet') + '</div><hr>' +
      ln(mt('Paid by'), esc(c.name)) + ln(mt('Paid to'), esc(s.biz)) + ln(mt('How'), how) + '<hr>' +
      ln(esc(m.name), inr(m.amount)) + (adv ? ln('Advance paid earlier', '−' + inr(adv)) : '') + ln(done ? 'Balance paid' : 'Balance due', inr(bal), 't') + '<hr><div class="mt">' + trail + '</div>' + proof(m) + '</div>';
  }
  /* proof of delivery: what was delivered and when, so the receipt doubles as a record */
  function proof(m) {
    var f = (m.files || []).filter(function (x) { return x.kind !== 'link'; }), L = function (a, b) { return '<div class="ln"><span>' + a + '</span><span>' + b + '</span></div>'; }, dt = function (t) { return t ? fmt(new Date(t), { day: 'numeric', month: 'short', year: 'numeric' }) : '–'; };
    return '<hr><div class="mt">PROOF OF DELIVERY</div>' + (f.length ? f.map(function (x) { return L(esc(x.name), 'v' + (x.v || 1) + ' · ' + esc(x.size || '')); }).join('') : L('Files', 'See the contract scope')) +
      L('Work started', dt(m.fundedAt)) + L('Delivered for review', dt(m.submittedAt)) + L('Approved', dt(m.approvedAt) + (m.autoApproved ? ' (automatic)' : '')) + L('Paid, originals unlocked', dt(m.releasedAt));
  }

  /* ---------------- freelancer: landing, setup ---------------- */
  function shotHTML() {
    var seeds = seedProjects(), items = [];
    seeds.forEach(function (p) { var a = attentionFor(p); if (a) items.push({ a: a, p: p }); });
    items.sort(function (x, y) { return SEV[x.a.sev] - SEV[y.a.sev]; });
    var need = items.filter(function (x) { return x.a.sev !== 'yellow'; }).slice(0, 4), cols = 'minmax(0,1.4fr) minmax(0,1.2fr) 90px 128px';
    var pill = function (a) { return a.kind === 'dispute' ? 'red' : a.sev === 'blue' ? 'blue' : 'amber'; };
    var net = 0, paid = 0; seeds.forEach(function (p) { p.ms.forEach(function (m) { var f = fees(m.amount, p).net; if (m.status === 'approved') paid += f; if (!closed(m) && days(parse(m.due)) <= 30) net += f; }); });
    var rows = need.map(function (x) {
      return '<div class="lv-row lv-att" style="--cols:' + cols + '"><div class="who3">' + avatarFor(x.p) + '<div><div class="t1">' + esc(x.a.org) + '</div><div class="t2">' + esc(x.a.project) + ' · ' + esc(x.a.ms) + '</div></div></div><div><span class="badge ' + pill(x.a) + '">' + esc(x.a.text) + '</span></div><span class="mono hide-sm" style="text-align:right">' + inr(x.a.amount) + '</span><span style="text-align:right"><span class="btn sm">' + esc(x.a.cta) + '</span></span></div>';
    }).join('');
    return '<div class="shot" role="img" aria-label="The Today screen: the clients that need you, each with one status and one button, and the money coming in"><div class="chrome"><span class="dots3"><i></i><i></i><i></i></span><span class="url">payguard.app/today</span></div>' +
      '<div class="shot-in"><div class="shot-main"><p class="muted" style="font-size:var(--t1)">' + fmt(TODAY, { weekday: 'long', day: 'numeric', month: 'long' }) + '</p>' +
      '<div class="numcards" style="grid-template-columns:repeat(2,minmax(0,1fr));padding:12px 0 8px"><div class="numcard"><span class="l">Awaiting payment</span><span class="v">' + inr(paid) + '</span></div><div class="numcard"><span class="l">Expected, next 30 days</span><span class="v">' + inr(net) + '</span></div></div>' +
      '<div class="tabs" style="margin:8px 0 10px"><button aria-selected="true">Needs you <span class="muted">' + need.length + '</span></button><button>Waiting</button><button>Coming up</button></div>' +
      '<div class="lv" style="padding:0"><div class="lv-head" style="--cols:' + cols + '"><span>Client</span><span>Status</span><span style="text-align:right" class="hide-sm">Amount</span><span></span></div>' + rows + '</div></div></div></div>';
  }
  function sLanding() {
    var faces = seedProjects().slice(0, 5).map(function (p) { return avatarFor(p); }).join('');
    return '<div class="lp" ' + brandStyle() + '><header class="lp-nav"><span class="logo">' + mark() + 'PayGuard</span><nav class="lp-links"><button class="linkb" data-a="scroll" data-t="how">How it works</button><button class="linkb" data-a="scroll" data-t="why">Why PayGuard</button></nav><div style="display:flex;gap:8px;align-items:center"><button class="btn ghost" data-a="start">Sign in</button><button class="btn" data-a="start">Get started</button></div></header>' +
      '<section class="lp-hero"><p class="lbl">For freelance designers with 5 to 15 clients</p><h1>Run your freelance business like a business.</h1><p class="sub">Clients, projects, approvals and payments in one place. No more chasing on WhatsApp.</p>' +
      '<div class="lp-cta"><button class="btn lg" data-a="start">Get started ' + ico('chev') + '</button><button class="btn lg outline" data-a="peek">See a busy day</button></div><p class="muted" style="font-size:var(--t1)">Your clients don\'t need an account.</p></section>' +
      '<section class="lp-shotwrap">' + shotHTML() + '</section>' +
      '<section class="lp-sec" id="why"><div class="lp-head"><p class="lbl">Why PayGuard</p><h2>Know who needs you. Skip the chasing.</h2></div><div class="lp-grid">' +
      '<div class="card lp-card lead"><div class="lp-frag"><span class="faces">' + faces + '</span><span class="badge outline">4 need you today</span></div><h3>See every client at a glance</h3><p class="muted">Who needs you, who you\'re waiting on, and what\'s next.</p></div>' +
      '<div class="card lp-card"><div class="lp-frag"><span class="linkchip">' + ico('link') + 'payguard.app/p/kiln-x7</span></div><h3>Send one link, skip the follow-ups</h3><p class="muted">Your client reviews, approves and pays in one place.</p></div>' +
      '<div class="card lp-card"><div class="lp-frag"><span class="mono">₹40,000</span><span class="badge released">Unlocked</span></div><h3>Get paid, straight to you</h3><p class="muted">Clients pay you by UPI, QR or card. Originals unlock when they do.</p></div></div></section>' +
      '<section class="lp-sec" id="how"><div class="lp-head"><p class="lbl">How it works</p><h2>From plan to paid in four steps</h2></div><ol class="lp-steps">' +
      '<li><i>1</i><b>Plan the project</b><span>Set the scope, price and date for each deliverable.</span></li><li><i>2</i><b>Both sign a contract</b><span>Then any advance you ask for is paid to you.</span></li><li><i>3</i><b>You deliver</b><span>Upload your files. Clients review a watermarked preview.</span></li><li><i>4</i><b>Client approves and pays</b><span>By UPI, QR or card, straight to you. The originals unlock.</span></li></ol></section>' +
      '<section class="lp-sec"><div class="card lp-final"><div>' + buddy('thumbs', 120) + '</div><div class="lp-finaltext"><h2>Start with your first client.</h2><p class="muted">Takes about 2 minutes.</p></div><button class="btn lg" data-a="start">Get started ' + ico('chev') + '</button></div></section>' +
      '<footer class="lp-foot"><span class="logo">' + mark() + 'PayGuard</span><span class="muted" style="font-size:var(--t1)">Prototype. All names and amounts are samples.</span></footer></div>';
  }
  function setupOk() { return !!U.agree && /^[\w.\-]{2,}@[A-Za-z]{2,}$/.test(String(S().payout.upi || '').trim()); }
  function sSetup() {
    var s = D.studio, ok = setupOk(), pay = S().payout;
    return '<div class="centerpage"><div class="formcard"><span class="logo">' + mark() + 'PayGuard</span><div style="display:flex;align-items:center;gap:16px">' + buddy('hello', 84) + '<div><p class="lbl">Step 1 of 2</p><h1 class="h1">Set up your studio</h1></div></div>' +
      '<div class="card" style="padding:20px;display:grid;gap:16px"><div class="field"><label for="s-name">Your name</label><input class="input" id="s-name" data-in="studio.name" value="' + esc(s.name) + '"></div><div class="field"><label for="s-biz">Studio or business name</label><input class="input" id="s-biz" data-in="studio.biz" value="' + esc(s.biz) + '"></div>' +
      '<div class="field"><label>Brand color</label><div class="swatches">' + BRANDS.map(function (c, i) { return '<button class="sw" data-a="brand" data-i="' + i + '" aria-pressed="' + (s.brand === i) + '" aria-label="Color ' + (i + 1) + '" style="background:' + c + '"></button>'; }).join('') + '</div></div></div>' +
      '<div class="card" style="padding:20px;display:grid;gap:16px"><div><h3 style="font-size:var(--t2);font-weight:600">Where you get paid</h3><p class="muted" style="font-size:var(--t2);margin-top:4px">Clients pay you directly, so PayGuard never holds your money. We use your UPI ID to make your payment QR code.</p></div><div class="field"><label for="s-upi">UPI ID</label><input class="input" id="s-upi" data-s="payout.upi" autocomplete="off" placeholder="name@bank" value="' + esc(pay.upi || '') + '"><span class="hint">Required. Used for UPI requests and your QR code.</span></div><div class="two"><div class="field"><label for="s-hold">Bank account holder <span class="muted" style="font-weight:400">(optional)</span></label><input class="input" id="s-hold" data-s="payout.holder" autocomplete="off" placeholder="As on the account" value="' + esc(pay.holder || '') + '"></div><div class="field"><label for="s-acct">Account number <span class="muted" style="font-weight:400">(optional)</span></label><input class="input mono" id="s-acct" data-s="payout.acct" autocomplete="off" value="' + esc(pay.acct || '') + '"></div></div><div class="field"><label for="s-ifsc">IFSC <span class="muted" style="font-weight:400">(optional)</span></label><input class="input mono" id="s-ifsc" data-s="payout.ifsc" autocomplete="off" placeholder="e.g. HDFC0001234" value="' + esc(pay.ifsc || '') + '"><span class="hint">Card payments are sent to this account.</span></div></div>' +
      '<div class="card" style="padding:20px;display:grid;gap:12px"><h3 style="font-size:var(--t2);font-weight:600">What you\'re agreeing to</h3><ul class="plain muted"><li>PayGuard connects you and your client. It doesn\'t do the work, and it never holds your money.</li><li>You and your client sign a contract before work starts.</li><li>Original files unlock when the client pays, or sooner if you choose.</li><li>You can ask us to delete your data. We keep invoices as the law requires.</li></ul>' +
      '<label class="check"><input type="checkbox" id="agree" ' + (ok ? 'checked' : '') + '><span>I agree to the Terms and Privacy Policy</span></label></div>' +
      '<button class="btn lg" id="cont" data-a="finish-setup" ' + (ok ? '' : 'disabled') + '>Continue</button></div></div>';
  }

  /* ---------------- freelancer: shell ---------------- */
  var NAV = [['today', 'Today', 'home'], ['clients', 'Clients', 'users'], ['calendar', 'Calendar', 'calendar'], ['payments', 'Payments', 'wallet']];
  /* App shell, modelled on Frappe CRM: workspace switcher, nav, a list of records, then a 42px header
     bar (breadcrumbs left, actions right) over a scrolling body. */
  function shell(crumb, inner, right) {
    var s = D.studio, act = U.plan ? '' : (U.view === 'project' ? '' : U.view), need = splitAttention().need.length;
    var navBtns = function (cls) { return NAV.map(function (n) { return '<button class="' + cls + ' ' + (act === n[0] ? 'on' : '') + '" data-a="view" data-v="' + n[0] + '">' + ico(n[2]) + n[1] + (n[0] === 'today' && need ? '<span class="count">' + need + '</span>' : '') + '</button>'; }).join(''); };
    var recs = D.projects.map(function (p) { var a = attentionFor(p); return '<button class="rec' + (U.view === 'project' && D.cur === p.id && !U.plan ? ' on' : '') + '" data-a="openp" data-id="' + p.id + '" style="--c:' + ccol(p) + '" title="' + esc(org(p) + ' · ' + p.name) + '"><i></i><span>' + esc(org(p)) + '</span>' + (a && a.sev !== 'yellow' ? '<em title="Needs you"></em>' : '') + '</button>'; }).join('');
    var bn = '<nav class="bnav" aria-label="Sections">' + NAV.map(function (n) { return '<button class="' + (act === n[0] ? 'on' : '') + '" data-a="view" data-v="' + n[0] + '">' + ico(n[2]) + '<span>' + n[1] + '</span>' + (n[0] === 'today' && need ? '<em>' + need + '</em>' : '') + '</button>'; }).join('') + '<button class="' + (act === 'settings' ? 'on' : '') + '" data-a="view" data-v="settings">' + ico('gear') + '<span>Settings</span></button></nav>';
    if (right == null) right = '<button class="btn sm hdr-new" data-a="plan">' + ico('plus') + 'New project</button>';
    return '<div class="app" ' + brandStyle() + '><aside class="side"><button class="brandbtn" data-a="view" data-v="today"><span class="logo-m">' + ico('shield') + '</span><span class="bt"><b>' + esc(s.biz) + '</b><span>' + esc(s.name) + '</span></span></button>' +
      '<div class="grp">' + navBtns('nav') + '</div>' +
      '<div style="flex:1"></div>' +
      '<div class="grp">' + (U.plan ? '<button class="nav on" data-a="pstep" data-i="0" aria-current="page">' + ico('pencil') + '<span id="draftnav" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(String(U.draft.name || '').trim() || 'Untitled project') + '</span></button>' : '<button class="nav" data-a="plan">' + ico('plus') + 'New project</button>') + '<button class="nav' + (act === 'settings' ? ' on' : '') + '" data-a="view" data-v="settings">' + ico('gear') + 'Settings</button></div></aside>' +
      '<div class="pane"><header class="hdr"><div class="crumbs">' + crumb + '</div><div class="acts2">' + bellHTML() + right + '</div></header><nav class="mnav" aria-label="Sections">' + navBtns('') + '</nav><div class="body">' + inner + '</div></div>' + bn + notifPop() + '</div>';
  }
  /* ---------------- freelancer: Today (command centre) ---------------- */
  function splitAttention() { var at = attention(); return { need: at.filter(function (a) { return a.sev !== 'yellow'; }), wait: at.filter(function (a) { return a.sev === 'yellow'; }) }; }
  function attRow(a, p, still) {
    p = p || getP(a.pid); var wait = a.sev === 'yellow', att = still ? '' : ' data-a="openp" data-id="' + a.pid + '"';
    var btn = still ? '<span class="btn ' + (wait ? 'outline ' : '') + 'sm">' + esc(a.cta) + '</span>' : '<button class="btn ' + (wait ? 'outline ' : '') + 'sm" data-a="' + a.act + '" data-id="' + a.pid + '">' + esc(a.cta) + '</button>';
    return '<li class="att' + (wait ? ' wait' : '') + (a.sev === 'red' ? ' urgent' : '') + '"' + att + (still ? '' : ' tabindex="0"') + '><span class="sev ' + a.sev + '" aria-hidden="true"></span>' + avatarFor(p) + '<div class="at-main"><div class="nm"><b>' + esc(a.org) + '</b> <span class="muted">· ' + esc(a.project) + '</span></div><div class="what">' + esc(a.text) + '</div><div class="ctx">' + esc(a.ms) + ' · ' + esc(a.ctx) + '</div></div><div class="act"><span class="mono amt">' + inr(a.amount) + '</span>' + btn + '</div></li>';
  }
  /* "2 payments, 1 approval, 1 delivery": what kind of thing is waiting on the freelancer */
  function needBreak(list) {
    var nm = { dispute: ['problem', 'problems'], fund: ['payment', 'payments'], pay: ['payment', 'payments'], sign: ['signature', 'signatures'], approve: ['approval', 'approvals'], changes: ['change request', 'change requests'], deliver: ['delivery', 'deliveries'] }, cnt = {};
    list.forEach(function (a) { cnt[a.kind] = (cnt[a.kind] || 0) + 1; });
    return Object.keys(nm).filter(function (k) { return cnt[k]; }).map(function (k) { return cnt[k] + ' ' + nm[k][cnt[k] === 1 ? 0 : 1]; }).join(', ');
  }
  function moneyBuckets() {
    var b = { held: 0, exp: 0 };
    D.projects.forEach(function (p) { p.ms.forEach(function (m) { if (m.status === 'approved') b.held += balOf(m, p); if (!closed(m) && days(parse(m.due)) <= 30) b.exp += balOf(m, p); }); });
    return b;
  }
  /* Today is a list view: number cards, quick-filter tabs, then one dense row per thing that needs attention. */
  /* what the freelancer has already done about a late item, so Remind has a memory */
  function traceOf(a, p) {
    if (!p || ['fund', 'pay', 'sign', 'invite', 'approve'].indexOf(a.kind) < 0) return '';
    return [p.openedAt ? 'Opened ' + agoTxt(p.openedAt) : 'Not opened yet', p.remindedAt ? 'Reminded ' + agoTxt(p.remindedAt) : ''].filter(Boolean).join(' · ');
  }
  function remTrace(p) { return '<span class="muted" style="align-self:center;font-size:var(--t2)">' + (p.remindedAt ? (p.remindedAuto ? 'Auto-reminded ' : 'Reminded ') + agoTxt(p.remindedAt) + ' · ' : '') + (p.openedAt ? 'Link opened ' + agoTxt(p.openedAt) : 'Link not opened yet') + '</span>'; }
  /* one segment per stage: green approved, amber in review, grey the rest */
  function segBar(p) { return '<div class="seg3" aria-label="' + p.ms.filter(closed).length + ' of ' + p.ms.length + ' deliverables approved">' + p.ms.map(function (m) { return '<i class="' + (closed(m) ? 'g' : m.status === 'submitted' ? 'a' : '') + '"></i>'; }).join('') + '</div>'; }
  function stageLine(p, m) {
    if (!m) return ''; var i = p.ms.indexOf(m), st = (STATUS[m.status] || STATUS.draft)[1].toLowerCase();
    return '<p class="stageline"><b>Deliverable ' + (i + 1) + ' of ' + p.ms.length + '</b> · ' + (closed(m) ? 'approved' : st) + (closed(m) ? '' : ' · Due ' + long(parse(m.due))) + '</p>';
  }
  function dbar(p) {
    var n = p.ms.length, ap = p.ms.filter(closed).length, cur = p.ms.findIndex(function (m) { return !closed(m); }), nx = cur > -1 ? p.ms[cur] : null;
    var nodes = p.ms.map(function (m, k) { var st = closed(m) ? 'done' : k === cur ? 'now' : 'next'; return (k ? '<i class="cn' + (closed(p.ms[k - 1]) ? ' on' : '') + '"></i>' : '') + '<span class="nd ' + st + '" title="' + esc(m.name) + '">' + (st === 'done' ? ico('check', '') : (k + 1)) + '</span>'; }).join('');
    return '<div class="dbar"><div class="dbar-h"><b>Delivery status</b><span>' + (nx ? 'Deliverable ' + (cur + 1) + ' of ' + n + ' in progress' : 'All ' + n + ' deliverables approved') + '</span></div><div class="trk" role="img" aria-label="' + ap + ' of ' + n + ' deliverables approved">' + nodes + '</div>' + (nx ? '<div class="dbar-f"><span>Next up</span><b>' + esc(nx.name) + '</b><span>Due ' + long(parse(nx.due)) + '</span></div>' : '') + '</div>';
  }

  /* Board: one column per stage state, one card per client, like a Kanban board. */

  function soonEvents() { return eventsAll().filter(function (x) { return x.date >= TODAY && x.kind !== 'done' && days(x.date) <= 30; }); }


  /* ---------------- freelancer: Today ----------------
     One job: what needs me today. To do (a plain list), Coming up (next 2 days and what is late), Payment status. */
  function lcf(t) { return String(t || '').charAt(0).toLowerCase() + String(t || '').slice(1); }
  function todoTitle(a) {
    if (a.kind === 'dispute') return a.cta + ': problem reported';
    if (a.kind === 'changes') return 'Make changes: ' + (a.text.split('· ')[1] || 'changes requested');
    if (a.kind === 'deliver') return 'Upload previews: ' + lcf(a.text.replace(/^Delivery /, ''));
    return a.cta + ': ' + lcf(a.text);
  }
  function moneyNow() {
    var got = 0, pend = 0;
    D.projects.forEach(function (p) {
      if (p.advancePaid) got += advAmt(p); else if (advPct(p)) pend += advAmt(p);
      p.ms.forEach(function (m) { if (m.status === 'released') got += balOf(m, p); else if (m.status !== 'refunded') pend += balOf(m, p); });
    });
    return { got: got, pend: pend };
  }
  function comingUp() {
    var out = [], wd = function (d) { return fmt(d, { weekday: 'long' }); };
    D.projects.forEach(function (p) {
      p.ms.forEach(function (m) {
        if (closed(m)) return; var base = { pid: p.id, org: org(p), ms: m.name, p: p };
        var add = function (d, past, fut) { var n = days(d); if (n < 0 && n >= -30) out.push(Object.assign({ date: d, late: true, title: past }, base)); else if (n >= 0 && n <= 2) out.push(Object.assign({ date: d, late: false, title: fut(n) }, base)); };
        if (m.status === 'funded' || m.status === 'changes') add(parse(m.due), 'Delivery was due', function (n) { return n === 0 ? 'Due today' : n === 1 ? 'Due tomorrow' : 'Due ' + wd(parse(m.due)); });
        if (m.status === 'submitted' && m.replyBy) add(parse(m.replyBy), 'Reply was due', function (n) { return n === 0 ? 'Reply due today' : n === 1 ? 'Reply due tomorrow' : 'Reply due ' + wd(parse(m.replyBy)); });
        if (m.status === 'approved' && canPay(m, p)) add(payBy(m, p), 'Payment was due', function (n) { return n === 0 ? 'Payment due today' : n === 1 ? 'Payment due tomorrow' : 'Payment due ' + wd(payBy(m, p)); });
      });
    });
    return out.sort(function (a, b) { return a.date - b.date; });
  }
  /* what others did, newest first. Information only: a row opens the client, no buttons. */
  function notifFeed() {
    var out = [], fp = function (p) { return first(p.client.name); };
    D.projects.forEach(function (p) {
      var add = function (t, html) { if (t) out.push({ t: new Date(t).getTime(), html: html, pid: p.id }); };
      add(p.openedAt, '<b>' + esc(fp(p)) + '</b> opened the link');
      if (p.contract && p.contract.cSig) add(p.contract.cSig.at, '<b>' + esc(fp(p)) + '</b> signed the contract');
      if (p.advancePaid) add(p.advanceAt, '<b>' + esc(fp(p)) + '</b> paid the advance');
      if (p.remindedAuto && p.remindedAt) add(p.remindedAt, 'Automatic reminder sent to <b>' + esc(fp(p)) + '</b>');
      p.ms.forEach(function (m) {
        (m.notes || []).forEach(function (n) { add(n.at, '<b>' + esc(fp(p)) + '</b> asked for changes on <b>' + esc(m.name) + '</b><span class="nq">“' + esc(String(n.text || '').replace(/^What to change:\s*/i, '')) + '”</span>'); });
        if (m.dispute) add(m.dispute.at, '<b>' + esc(fp(p)) + '</b> reported a problem with <b>' + esc(m.name) + '</b>' + (m.dispute.note ? '<span class="nq">“' + esc(m.dispute.note) + '”</span>' : ''));
        if (m.approvedAt) add(m.approvedAt, m.autoApproved ? '<b>' + esc(m.name) + '</b> was approved automatically' : '<b>' + esc(fp(p)) + '</b> approved <b>' + esc(m.name) + '</b>');
        if (m.releasedAt && m.paidHow !== 'free') add(m.releasedAt, '<b>' + esc(fp(p)) + '</b> paid for <b>' + esc(m.name) + '</b>');
      });
    });
    return out.sort(function (a, b) { return b.t - a.t; }).slice(0, 8);
  }
  function notifUnread(feed) { var seen = D.notifSeen || 0; return feed.filter(function (x) { return x.t > seen; }).length; }
  function bellHTML() {
    var f = notifFeed(), n = notifUnread(f);
    return '<button type="button" class="ibtn bell" data-a="notif" aria-label="Notifications' + (n ? ', ' + n + ' new' : '') + '" aria-expanded="' + !!U.notif + '">' + ico('bell') + (n ? '<span class="bdg">' + n + '</span>' : '') + '</button>';
  }
  function notifPop() {
    if (!U.notif) return '';
    var f = notifFeed(), seen = D.notifSeen || 0;
    return '<div class="pbk" data-a="notif"></div><div class="npop" role="dialog" aria-label="Notifications"><div class="np-h"><b>Notifications</b><button type="button" class="linkb" data-a="notifread">Mark all as read</button></div>' +
      (f.length ? f.map(function (x) { var p = getP(x.pid); return '<button type="button" class="nrow" data-a="openp" data-id="' + x.pid + '">' + avatarFor(p) + '<span class="tx">' + x.html + '<small>' + agoTxt(new Date(x.t).toISOString()) + '</small></span>' + (x.t > seen ? '<i class="ud"></i>' : '<i></i>') + '</button>'; }).join('') : '<p class="muted" style="padding:16px">Nothing new yet.</p>') + '</div>';
  }
  function posePic(name, w, h) { return '<svg viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true"><use href="#mk-' + name + '"/></svg>'; }
  function moneyScene(got) {
    return '<div class="sc" style="--ms:' + mascotScale(got) + '" aria-hidden="true"><div class="ground"></div><div class="gdash dwalk"></div><div class="gdash drun"></div>' +
      '<div class="pose pwalk">' + posePic('walking', 588, 512) + '</div><div class="pose prun">' + posePic('running', 728, 512) + '</div><div class="pose pcel">' + posePic('excited', 848, 688) + '</div></div>';
  }
  function statCard(cls, ic, l, v, s) { return '<div class="stat"><div class="stat-h"><span class="l">' + l + '</span><span class="chip2 ' + cls + '">' + ico(ic, '') + '</span></div><span class="v">' + v + '</span><span class="s">' + s + '</span></div>'; }
  /* mobile collapse: items past the first n get class mx and are hidden on phones until "Show all" is tapped */
  function xcls(i, n) { return i >= n ? ' mx' : ''; }
  function xbtn(key, total, n) { if (total <= n) return ''; var on = !!(U.xall && U.xall[key]); return '<button type="button" class="xbtn" data-a="xtgl" data-k="' + key + '" aria-expanded="' + on + '">' + (on ? 'Show less' : 'Show all ' + total) + ico('chev', 'xc' + (on ? ' up' : '')) + '</button>'; }
  function xon(key) { return U.xall && U.xall[key] ? ' xall' : ''; }
  var HELLO = [
    ['Hey {n}, it\'s Sunday. Look at you, working.', 'Just the important bits below. Then go touch some grass.'],
    ['Happy Monday, {n}!', 'Fresh week, fresh wins. Here\'s where to start.'],
    ['Tuesday, {n}. Let\'s get things moving.', 'A few things are waiting on you. Quick ones first.'],
    ['Hump day, {n}. Halfway there.', 'Clear these and the rest of the week feels light.'],
    ['Thursday, {n}. Almost at the finish line.', 'Tie up the loose ends before the weekend sneaks up.'],
    ['Fun Friday, {n}!', 'Clear these and the weekend is all yours.'],
    ['Saturday, {n}? That\'s dedication.', 'Quick check-in, then back to your weekend.']
  ];
  function hello() { var h = HELLO[TODAY.getDay()], n = esc(first(D.studio.name)); return [h[0].replace('{n}', n), h[1]]; }
  function mascotScale(got) { return Math.max(0.55, Math.min(1.2, 0.55 + 0.65 * Math.min(1, Math.sqrt(Math.max(0, got) / 1000000)))).toFixed(2); }
  function sToday() {
    var crumb = '<b>Today</b><span class="muted" style="font-size:var(--t2);margin-left:4px">' + fmt(TODAY, { weekday: 'long', day: 'numeric', month: 'long' }) + '</span>';
    if (!D.projects.length) return shell(crumb, '<div class="pad">' + homeEmpty() + '</div>');
    var todo = splitAttention().need, cu = comingUp(), mn = moneyNow();
    var row = function (p, title, sub, right, att, x) { return '<button type="button" class="li' + (x || '') + '" ' + att + '>' + avatarFor(p) + '<span class="lt"><b>' + title + '</b><span>' + sub + '</span></span>' + right + '</button>'; };
    var todoRows = todo.length ? todo.map(function (a, i) { return row(getP(a.pid), esc(todoTitle(a)), esc(a.org) + ' · ' + esc(a.ms), ico('chev', 'ch'), 'data-a="openp" data-id="' + a.pid + '"', xcls(i, 4)); }).join('') : '<div class="lv-empty">' + buddy('thumbs', 84) + '<div><b>You\'re all caught up</b><div class="muted">Nothing needs you today.</div></div></div>';
    var cuRows = cu.length ? cu.map(function (x, i) { return row(x.p, esc(x.title), esc(x.org) + ' · ' + esc(x.ms), '<span class="wh' + (x.late ? ' late' : '') + '">' + long(x.date) + '</span>', 'data-a="openp" data-id="' + x.pid + '"', xcls(i, 3)); }).join('') : '<p class="muted" style="padding:20px">Nothing due in the next 2 days.</p>';
    var hi = hello(), main = '<div class="pghead"><h1>' + hi[0] + '</h1><p>' + hi[1] + '</p></div><div class="g4">' +
      '<section class="col ga"><div class="colh"><i class="dt" style="background:#f59e0b"></i><b>To do</b><span class="n">' + todo.length + '</span></div><div class="lst' + xon('todo') + '">' + todoRows + '</div>' + xbtn('todo', todo.length, 4) + '</section>' +
      '<section class="col gb"><div class="colh"><i class="dt" style="background:#16a34a"></i><b>Payment status</b><button type="button" class="btn outline sm" data-a="view" data-v="payments" style="margin-left:auto">View all</button></div><div class="lst">' +
      '<div class="li li3"><span class="lt"><b>Received</b><span>In your account</span></span><b class="bign pos">' + inr(mn.got) + '</b></div><div class="li li3"><span class="lt"><b>Pending</b><span>Approved or still in progress</span></span><b class="bign neu">' + inr(mn.pend) + '</b></div></div><div class="alone">' + moneyScene(mn.got) + '</div></section>' +
      '<section class="col gc"><div class="colh"><i class="dt" style="background:#3b82f6"></i><b>Coming up</b><span class="n">' + cu.length + '</span></div><div class="lst' + xon('cu') + '">' + cuRows + '</div>' + xbtn('cu', cu.length, 3) + '</section></div>';
    return shell(crumb, main);
  }



  function homeEmpty() {
    return '<div class="card onb"><div class="art">' + buddy('main', 190, { label: 'The PayGuard buddy' }) + '</div><div class="body"><div><p class="muted" style="margin-bottom:4px">Welcome, ' + esc(first(D.studio.name)) + '</p><h2 class="h1" style="font-size:var(--t5)">Send your first project link</h2></div>' +
      '<ul class="steps"><li class="done"><span class="c">' + ico('check', '') + '</span><b>Set up your studio</b></li><li class="now"><span class="c"></span><b>Plan your project</b></li><li><span class="c"></span><b>Send the link to your client</b></li></ul>' +
      '<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><button class="btn lg" data-a="plan">New project ' + ico('chev') + '</button><button class="linkb" data-a="loadactive">Try it with sample clients</button></div></div></div>';
  }
  /* ---------------- freelancer: Clients ---------------- */
  /* Filter table. Chips (dot, label, count) sit above a ruled grid. Filtering never re-renders:
     rows stay in the DOM and collapse in place (grid 1fr to 0fr), so they ease out instead of vanishing. */
  function fChips(act, items, cur, label) {
    return '<div class="fchips" role="group" aria-label="' + label + '">' + items.map(function (x) {
      return '<button type="button" class="fchip" data-a="' + act + '" data-f="' + x.k + '" aria-pressed="' + (cur === x.k) + '">' + (x.dot ? '<i class="fdot" style="' + x.dot + '"></i>' : '') + x.label + '<span class="fcount">' + x.n + '</span></button>';
    }).join('') + '</div>';
  }
  function fShow(r, cur, q) { return (cur === 'all' || r.k === cur) && (!q || r.q.indexOf(q) > -1); }
  var PGSZ = { c: 15, p: 25 };
  function pgHTML(id, total) {
    var size = PGSZ[id], pages = Math.max(1, Math.ceil(total / size)), cur = Math.min(Math.max(1, (U.pg || {})[id] || 1), pages); if (pages < 2) return '';
    var b = function (n, label, dis, on) { return '<button type="button" class="pgb' + (on ? ' on' : '') + '" data-a="pg" data-id="' + id + '" data-n="' + n + '"' + (dis ? ' disabled' : '') + (on ? ' aria-current="page"' : '') + '>' + label + '</button>'; }, h = '';
    for (var k = 1; k <= pages; k++) h += b(k, k, false, k === cur);
    return '<span class="pg-i">' + ((cur - 1) * size + 1) + '–' + Math.min(total, cur * size) + ' of ' + total + '</span><span class="pg-b">' + b(cur - 1, '‹', cur === 1) + h + b(cur + 1, '›', cur === pages) + '</span>';
  }
  /* marks which matching rows fall on the current page; returns the matching count */
  function pgWindow(id, rows) {
    var size = PGSZ[id], m = 0, total = rows.filter(function (r) { return r.on; }).length, pages = Math.max(1, Math.ceil(total / size)); U.pg = U.pg || {}; U.pg[id] = Math.min(Math.max(1, U.pg[id] || 1), pages);
    var lo = (U.pg[id] - 1) * size, hi = lo + size;
    rows.forEach(function (r) { if (r.on) { if (m < lo || m >= hi) r.on = false; m++; } });
    return total;
  }
  function fTable(o) {
    var last = -1; o.rows.forEach(function (r) { r.on = fShow(r, o.cur, o.q || ''); }); var total = pgWindow(o.id, o.rows); o.rows.forEach(function (r, i) { if (r.on) last = i; });
    var n = o.rows.filter(function (r) { return r.on; }).length;
    return '<div class="ftable" data-f="' + o.id + '" role="region" aria-label="' + o.label + '" tabindex="0"><div class="fgrid" role="table" aria-label="' + o.label + '" style="--cols:' + o.cols + ';--min:' + o.min + 'px"><div class="fhead" role="row">' + o.heads.map(function (h) { return '<span role="columnheader">' + h + '</span>'; }).join('') + '</div>' +
      o.rows.map(function (r, i) {
        return '<div class="frow" role="presentation" data-k="' + r.k + '" data-q="' + esc(r.q) + '" data-shown="' + (r.on ? 1 : 0) + '"' + (i === last ? ' data-last="1"' : '') + (r.on ? '' : ' inert') + '><div class="fclip" role="presentation"><div class="fr" role="row"' + (r.att || '') + '>' + r.cells.map(function (c) { return '<div class="fc" role="cell">' + c + '</div>'; }).join('') + '</div></div></div>';
      }).join('') + '<div class="f-empty" ' + (n ? 'hidden' : '') + '>' + o.empty + '</div></div></div><div class="pager" data-pg="' + o.id + '">' + pgHTML(o.id, total) + '</div>';
  }
  /* sync chips, rows and the empty message with U.cf / U.pf / U.q, without a re-render */
  function applyF(box) {
    if (!box) return; var id = box.dataset.f, cur = id === 'c' ? U.cf : U.pf, q = id === 'c' ? U.q.trim().toLowerCase() : '', n = 0, lastEl = null;
    var els = Array.prototype.slice.call(box.querySelectorAll('.frow')), pr = els.map(function (el) { return { el: el, on: fShow({ k: el.dataset.k, q: el.dataset.q }, cur, q) }; }), total = pgWindow(id, pr);
    pr.forEach(function (r) { var el = r.el, on = r.on; el.dataset.shown = on ? 1 : 0; el.removeAttribute('data-last');
      if (on) { el.removeAttribute('inert'); n++; lastEl = el; } else el.setAttribute('inert', '');
    }); var pgEl = document.querySelector('.pager[data-pg="' + id + '"]'); if (pgEl) pgEl.innerHTML = pgHTML(id, total);
    if (lastEl) lastEl.dataset.last = 1; var em = box.querySelector('.f-empty'); if (em) em.hidden = n > 0;
    Array.prototype.forEach.call(document.querySelectorAll('[data-a="' + (id === 'c' ? 'cfilter' : 'pfilter') + '"]'), function (b) { b.setAttribute('aria-pressed', String(b.dataset.f === cur)); });
  }
  function clientsTable() {
    var rk = { needs: 0, waiting: 1, track: 2, complete: 3 }, grp = {}, ord = [];
    D.projects.forEach(function (p) { var k = String(p.client.email || org(p)).toLowerCase(); if (!grp[k]) { grp[k] = []; ord.push(k); } grp[k].push(p); });
    var rows = ord.map(function (k) {
      var ps = grp[k].slice().sort(function (x, y) { return (rk[projStatus(x).k] || 0) - (rk[projStatus(y).k] || 0); }), p = ps[0];
      var st = projStatus(p), m = currentMsOf(p), tot = ps.reduce(function (s, q) { return s + q.ms.reduce(function (a, x) { return a + x.amount; }, 0); }, 0), done = ps.reduce(function (s, q) { return s + q.ms.filter(closed).length; }, 0), nst = ps.reduce(function (s, q) { return s + q.ms.length; }, 0);
      var ell = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
      return { p: p, st: st, k: st.k, q: (org(p) + ' ' + ps.map(function (z) { return z.name; }).join(' ') + ' ' + p.client.name).toLowerCase(),
        att: ' data-a="openp" data-id="' + p.id + '" tabindex="0"',
        cells: ['<div style="display:flex;gap:10px;align-items:center;min-width:0">' + avatarFor(p) + '<div style="min-width:0"><div style="font-weight:500;color:var(--ink-gray-9);' + ell + '">' + esc(org(p)) + '</div><div class="muted" style="font-size:var(--t1);' + ell + '">' + esc(p.client.name) + '</div></div></div>',
          '<div style="min-width:0"><div style="' + ell + '">' + esc(p.name) + (ps.length > 1 ? ' <span class="muted">+ ' + (ps.length - 1) + ' more</span>' : '') + '</div><div class="muted" style="font-size:var(--t1)">' + (ps.length > 1 ? ps.length + ' projects · ' : '') + done + ' of ' + nst + ' deliverables approved</div></div>',
          m ? '<div style="min-width:0"><div style="' + ell + '">' + esc(m.name) + '</div><div class="muted" style="font-size:var(--t1)">Due ' + long(parse(m.due)) + '</div></div>' : '<span class="muted">Done</span>',
          '<span class="mono">' + inr(tot) + '</span>',
          '<span class="badge ' + st.cls + '">' + st.label + '</span>'] };
    });
    var n = function (k) { return rows.filter(function (r) { return k === 'all' || r.k === k; }).length; };
    var items = [{ k: 'all', label: 'All', n: n('all') }, { k: 'needs', label: 'Needs you', dot: 'background:var(--surface-amber-7)', n: n('needs') }, { k: 'waiting', label: 'Waiting', dot: 'background:transparent;box-shadow:inset 0 0 0 1.5px var(--outline-gray-4)', n: n('waiting') }, { k: 'track', label: 'On track', dot: 'background:var(--surface-blue-6)', n: n('track') }, { k: 'complete', label: 'Done', dot: 'background:var(--surface-green-7)', n: n('complete') }].filter(function (x) { return x.n || x.k === 'all' || x.k === U.cf; });
    return '<div class="pghead"><h1>Clients</h1><p>' + rows.length + (rows.length === 1 ? ' client' : ' clients') + ', including finished work.</p></div><section class="panel tpanel"><div class="vc">' + fChips('cfilter', items, U.cf, 'Filter clients by status') + '<input class="input" id="q" placeholder="Search clients" aria-label="Search clients" value="' + esc(U.q) + '"></div>' +
      fTable({ id: 'c', label: 'Clients', cols: 'minmax(0,1.3fr) minmax(0,1.2fr) minmax(0,1.2fr) minmax(0,.7fr) minmax(0,.9fr)', min: 760, heads: ['Client', 'Project', 'Next up', 'Value', 'Status'], rows: rows, cur: U.cf, q: U.q.trim().toLowerCase(),
        empty: '<div class="clear" style="padding:32px 20px;justify-content:center">' + buddy('think', 84) + '<div><b>No clients match</b><div class="muted">Try a different search or filter.</div></div></div>' }) +
      '<div class="lv-foot">' + rows.length + ' client' + (rows.length === 1 ? '' : 's') + '</div></section>';
  }
  function emptyPage(title, line) {
    return '<div class="card clear" style="padding:48px 24px;justify-content:center;flex-direction:column;text-align:center">' + buddy('hello', 110) + '<div><b>' + title + '</b><div class="muted">' + line + '</div></div><button class="btn" data-a="plan">' + ico('plus') + 'New project</button></div>';
  }
  function sClients() {
    return shell('<b>Clients</b>', D.projects.length ? clientsTable() : '<div class="pad">' + emptyPage('No clients yet', 'Create a project and send your first link.') + '</div>');
  }
  function sSettings() {
    var s = S(), st = D.studio, sec = function (t, sub, inner) { var k = 'set' + t, on = U.xall && k in U.xall ? U.xall[k] : t === 'Studio'; return '<section class="fsec msec' + (on ? ' open' : '') + '" style="padding:32px 0"><h3 data-a="xtgl" data-k="' + k + '" data-d="' + (t === 'Studio' ? 1 : 0) + '" role="button" aria-expanded="' + on + '">' + t + ico('chev', 'xc msc') + '</h3>' + (sub ? '<p class="sub2">' + sub + '</p>' : '') + inner + '</section>'; };
    var fld = function (label, path, val, ph, hint, mono) { return '<div class="field"><label for="s_' + path + '">' + label + '</label><input class="input' + (mono ? ' mono' : '') + '" id="s_' + path + '" data-s="' + path + '" value="' + esc(val) + '" placeholder="' + esc(ph || '') + '" autocomplete="off">' + (hint ? '<span class="hint">' + hint + '</span>' : '') + '</div>'; };
    var sel = function (label, path, val, opts) { return '<div class="field"><label for="s_' + path + '">' + label + '</label><select class="input" id="s_' + path + '" data-s="' + path + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (String(val) === String(o[0]) ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></div>'; };
    var tog = function (label, path, on) { return '<label class="check"><input type="checkbox" data-s="' + path + '"' + (on ? ' checked' : '') + '><span>' + label + '</span></label>'; };
    var seg = function (items2, cur, act, aria) { return '<div class="seg" role="group" aria-label="' + aria + '">' + items2.map(function (x) { return '<button type="button" data-a="' + act + '" data-k="' + x[0] + '" aria-pressed="' + (cur === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div>'; };
    var main = '<div class="pad formcol" style="gap:0"><div><p class="muted" style="font-size:var(--t2)">Changes save as you type.</p></div>' +
      sec('Studio', 'Your clients see this on every link.', '<div class="two"><div class="field"><label for="s-name">Your name</label><input class="input" id="s-name" data-in="studio.name" value="' + esc(st.name) + '"></div><div class="field"><label for="s-biz">Studio or business name</label><input class="input" id="s-biz" data-in="studio.biz" value="' + esc(st.biz) + '"></div></div><div class="field"><label>Brand color</label><div class="swatches">' + BRANDS.map(function (c, i) { return '<button class="sw" data-a="brand" data-i="' + i + '" aria-pressed="' + (st.brand === i) + '" aria-label="Color ' + (i + 1) + '" style="background:' + c + '"></button>'; }).join('') + '</div></div>') +
      sec('How you get paid', 'Clients pay you directly by UPI, QR or card. Clients never see your bank details.', fld('UPI ID', 'payout.upi', s.payout.upi, 'name@bank', 'Used for UPI requests and your payment QR code.') + '<div class="two">' + fld('Bank account holder', 'payout.holder', s.payout.holder, 'As on the account') + fld('Account number', 'payout.acct', s.payout.acct, '', '', true) + '</div>' + fld('IFSC', 'payout.ifsc', s.payout.ifsc, 'e.g. HDFC0001234', 'Card payments are sent to this account.', true)) +
      sec('Contract template', 'Upload your own header so every contract comes on your letterhead, and add your own clauses.', tplCard()) +
      sec('Tax and invoices', 'Shown on the invoice for your work.', '<div class="two">' + fld('Legal name', 'tax.legal', s.tax.legal, 'As on your PAN') + fld('State', 'tax.state', s.tax.state, 'e.g. Karnataka') + '</div><div class="two">' + fld('GSTIN', 'tax.gstin', s.tax.gstin, '', 'Leave blank if you are not GST-registered.', true) + fld('PAN', 'tax.pan', s.tax.pan, '', '', true) + '</div>') +
      sec('Defaults for new projects', 'Used to fill the Terms on every new project. You can change them per project.', '<div class="two"><div class="field"><label for="sd1">Client replies within</label>' + selC('s', 'reviewDays', s.defaults.reviewDays, [[2, '2 days'], [3, '3 days'], [5, '5 days'], [7, '7 days']], 'days', 'sd1') + '</div><div class="field"><label for="sd2">If they don\'t reply</label>' + selC('s', 'autoDays', s.defaults.autoDays, [[2, 'Approve after 2 days'], [3, 'Approve after 3 days'], [5, 'Approve after 5 days'], [0, 'Never approve automatically']], 'days', 'sd2') + '</div></div><div class="two"><div class="field"><label for="sd3">Rounds of changes per deliverable</label>' + selC('s', 'rounds', s.defaults.rounds, [[1, '1 round'], [2, '2 rounds'], [3, '3 rounds']], 'rounds', 'sd3') + '</div>' + fld('Price of an extra round (₹)', 'defaults.extraFee', s.defaults.extraFee, '6000', '', true) + '</div><div class="two"><div class="field"><label for="sd4">Advance before work starts</label>' + selC('s', 'advancePct', s.defaults.advancePct, [[0, 'No advance'], [10, '10%'], [25, '25%'], [50, '50%']], '%', 'sd4') + '</div><div class="field"><label for="sd5">Balance due within</label>' + selC('s', 'payDays', s.defaults.payDays, [[3, '3 days'], [7, '7 days'], [14, '14 days'], [30, '30 days']], 'days of approval', 'sd5') + '</div></div>') +
      sec('Notifications', 'Tell me when something happens.', '<div style="display:grid;gap:12px">' + tog('A client pays for a deliverable', 'notify.pay', s.notify.pay) + tog('A client approves or asks for changes', 'notify.approve', s.notify.approve) + tog('A weekly summary of who owes me', 'notify.digest', s.notify.digest) + tog('Remind clients automatically: a day before a reply or payment date, and once it\'s late', 'notify.auto', s.notify.auto) + '</div>') + '</div>';
    return shell('<b>Settings</b>', main);
  }
  function sCalendar() {
    return shell('<b>Calendar</b>', '<div class="pad">' + (D.projects.length ? '<div class="card" id="calbox" data-big="1" data-all="1">' + bigCalInner(calEvents()) + '</div>' : emptyPage('Nothing scheduled', 'Dates appear once you create a project.')) + '</div>');
  }

  /* ---------------- freelancer: Payments ----------------
     One question: what have I received, what is still to come. Two states only: Paid, Not paid. */
  function sPayments() {
    var rows = [];
    D.projects.forEach(function (p) {
      if (advPct(p)) rows.push({ p: p, m: null, name: 'Advance (' + advPct(p) + '%)', amt: advAmt(p), paid: !!p.advancePaid, when: p.advanceAt, late: false, order: p.advancePaid ? 3 : 1 });
      p.ms.forEach(function (m) { var late = fundLate(p, m); rows.push({ p: p, m: m, name: m.name, amt: balOf(m, p), paid: m.status === 'released', when: m.releasedAt, late: late, order: m.status === 'released' ? 3 : late ? 0 : 1 }); });
    });
    if (!rows.length) return shell('<b>Payments</b>', '<div class="pad">' + emptyPage('No payments yet', 'Payments appear once you have a project.') + '</div>');
    var mn = moneyNow(), cl = U.pcl || 'all', st = U.pstat || 'all', pg = U.ppage || 1, PS = 25;
    var shown = rows.filter(function (r) { return (cl === 'all' || r.p.id === cl) && (st === 'all' || (st === 'paid') === r.paid); }).sort(function (a, b) { return a.order - b.order || (a.when && b.when ? new Date(b.when) - new Date(a.when) : 0); });
    var pages = Math.max(1, Math.ceil(shown.length / PS)); pg = Math.min(pg, pages); var view = shown.slice((pg - 1) * PS, pg * PS);
    var opts = '<option value="all">All clients</option>' + D.projects.map(function (q) { return '<option value="' + q.id + '"' + (cl === q.id ? ' selected' : '') + '>' + esc(org(q)) + '</option>'; }).join('');
    var seg = '<div class="seg" role="group" aria-label="Status">' + [['all', 'All'], ['paid', 'Paid'], ['not', 'Not paid']].map(function (x) { return '<button type="button" data-a="pstat" data-k="' + x[0] + '" aria-pressed="' + (st === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div>';
    var tr = view.map(function (r, i) {
      return '<tr class="' + (r.m ? 'clk' : '') + xcls(i, 6) + '"' + (r.m ? ' data-a="openp" data-id="' + r.p.id + '"' : '') + '><td><div class="who3">' + avatarFor(r.p) + '<b>' + esc(org(r.p)) + '</b></div></td><td>' + esc(r.name) + '</td><td class="mono">' + inr(r.amt) + '</td><td><span class="badge ' + (r.paid ? 'released' : 'draft') + '">' + (r.paid ? 'Paid' : 'Not paid') + '</span></td><td class="muted">' + (r.paid ? (r.when ? long(new Date(r.when)) : '') : r.late ? '<span class="late">Late</span>' : '') + '</td></tr>';
    }).join('') || '<tr><td colspan="5" class="muted" style="padding:24px">Nothing here.</td></tr>';
    var pager = pages > 1 ? '<div class="pager"><span class="pg-i">' + ((pg - 1) * PS + 1) + '–' + Math.min(shown.length, pg * PS) + ' of ' + shown.length + '</span><span class="pg-b">' + Array.apply(null, Array(pages)).map(function (_, i) { return '<button type="button" class="pgb' + (i + 1 === pg ? ' on' : '') + '" data-a="ppg" data-n="' + (i + 1) + '">' + (i + 1) + '</button>'; }).join('') + '</span></div>' : '';
    var main = '<div class="pghead"><h1>Payments</h1><p>Money you have received and money still to come.</p></div><div class="pbig"><div class="pbox"><span class="lbl">Earned to date</span><div class="num pos">' + inr(mn.got) + '</div><p class="muted">Received in your account</p></div><div class="pbox"><span class="lbl">Not received yet</span><div class="num neu">' + inr(mn.pend) + '</div><p class="muted">Approved or still in progress</p></div></div>' +
      '<div class="pfilt"><select class="input" id="pcl" aria-label="Client">' + opts + '</select>' + seg + '</div>' +
      '<div class="pt' + xon('pay') + '"><table class="ptb"><thead><tr><th>Client</th><th>Deliverable</th><th>Amount</th><th>Status</th><th></th></tr></thead><tbody>' + tr + '</tbody></table></div>' + xbtn('pay', view.length, 6) + pager;
    return shell('<b>Payments</b>', '<div class="pad pay3">' + main + '</div>');
  }
  /* ---------------- freelancer: plan ---------------- */
  /* Planning is a document form in three tabs (Project, Stages, Terms). The side panel fills in as the
     stages do: a row per stage once it has a name or amount, and the dates calendar once a date is set. */
  /* a dropdown of common values plus "Custom…", which reveals a number box. scope 'd' = this project's draft, 's' = settings defaults */
  function selC(scope, key, val, opts, unit, id) {
    var cust = !!(U.cust && U.cust[scope + key]) || !opts.some(function (o) { return String(o[0]) === String(val); });
    return '<div class="selc"><select class="input" id="' + id + '" data-cs="' + scope + ':' + key + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (!cust && String(val) === String(o[0]) ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '<option value="__c"' + (cust ? ' selected' : '') + '>Custom…</option></select>' +
      (cust ? '<span class="cwrap"><input class="input mono" inputmode="numeric" data-cv="' + scope + ':' + key + '" value="' + esc(val) + '" aria-label="Custom value"><span class="unit">' + unit + '</span></span>' : '') + '</div>';
  }
  function setCS(scope, key, v) { if (scope === 'd') { if (U.draft) U.draft[key] = v; } else setS('defaults.' + key, v); }
  function draftAsProject(d) {
    return { name: d.name || 'Untitled project', client: { name: d.cname, org: d.corg, email: d.cemail }, ms: d.ms.map(function (x) { return { name: x.name || 'Untitled deliverable', amount: Number(x.amount) || 0, due: x.due, scope: lines(x.scope), limit: Number(d.rounds) || 2 }; }), reviewDays: Number(d.reviewDays), autoDays: Number(d.autoDays), extraFee: Number(d.extraFee) || 0, advancePct: Number(d.advancePct) || 0, payDays: Number(d.payDays) || 7, unlock: unlockOf(d), contract: null, draft: true };
  }
  function unlockOf(d) { return d.unlock || (d.ms.length >= 3 ? 'stage' : 'project'); }
  /* ---------------- contract and signatures ---------------- */
  function freshSig() { return { mode: 'draw', typed: '', img: '', agree: false }; }
  function sigMark(sg, name) {
    if (!sg) return '<div class="sig-empty">Not signed yet</div>';
    return '<div class="sig-done">' + (sg.img ? '<img src="' + sg.img + '" alt="Signature of ' + esc(name) + '">' : '<span class="sig-type">' + esc(sg.typed || name) + '</span>') + '</div>';
  }
  function contractHTML(p, o) {
    o = o || {}; var s = D.studio, c = p.client, t = S().tax, fn = esc(first(s.name)), cn = esc(first(c.name)), cl = p.contract || {}, tpl = cl.tpl || S().contract || {};
    var sample = !p.contract && !p.draft;
    var fSig = o.fSig !== undefined ? o.fSig : sample ? { typed: s.name, at: p.createdAt } : cl.fSig, cSig = o.cSig !== undefined ? o.cSig : sample ? { typed: c.name, at: p.createdAt } : cl.cSig;
    var tot = totalOf(p), adv = advAmt(p), stage = !projMode(p), pd = Number(p.payDays) || 7, rd = Number(p.reviewDays) || 3, ad = Number(p.autoDays) || 0, rounds = p.ms[0] ? p.ms[0].limit : 2;
    var date = fmt(p.createdAt ? new Date(p.createdAt) : TODAY, { day: 'numeric', month: 'long', year: 'numeric' });
    var stg = p.ms.map(function (m, i) { return '<tr><td class="cnum">' + (i + 1) + '</td><td><b>' + esc(m.name) + '</b>' + (m.scope && m.scope.length ? '<ul>' + m.scope.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') + '</td><td>' + (m.due ? long(parse(m.due)) : '–') + '</td><td class="amt">' + inr(m.amount) + '</td></tr>'; }).join('');
    var sigBlock = function (title, nm, sg) { return '<div class="sigbox"><span class="lbl">' + title + '</span>' + sigMark(sg, nm) + '<div class="sigmeta"><b>' + esc(nm) + '</b>' + (sg && sg.at ? '<span>Signed ' + fmt(new Date(sg.at), { day: 'numeric', month: 'short', year: 'numeric' }) + '</span>' : '<span>Awaiting signature</span>') + '</div></div>'; };
    var extra = String(tpl.extra || '').trim() ? '<section><h3>6. Additional terms</h3>' + String(tpl.extra).split(/\n+/).filter(Boolean).map(function (x) { return '<p>' + esc(x) + '</p>'; }).join('') + '</section>' : '';
    return '<article class="contract">' + (tpl.header ? '<div class="chead"><img src="' + tpl.header + '" alt="' + esc(s.biz) + ' letterhead"></div>' : '') + '<header><p class="lbl">Service agreement</p><h2>' + esc(p.name) + '</h2><p class="muted">Dated ' + date + '</p></header>' +
      '<section class="cparties"><div><span class="lbl">Freelancer</span><b>' + esc(s.biz) + '</b><span>' + esc(t.legal || s.name) + '</span>' + (t.gstin ? '<span>GSTIN ' + esc(t.gstin) + '</span>' : '') + '</div><div><span class="lbl">Client</span><b>' + esc(c.org || c.name) + '</b><span>' + esc(c.name) + '</span><span>' + esc(c.email || '') + '</span></div></section>' +
      '<section><h3>1. The work</h3><p>' + esc(first(s.name)) + ' will deliver the deliverables below, with what each includes and by the dates shown.</p><table class="ctable"><thead><tr><th></th><th>Deliverable and what it includes</th><th>Delivery</th><th class="amt">Price</th></tr></thead><tbody>' + stg + '</tbody><tfoot><tr><td></td><td colspan="2">Total</td><td class="amt">' + inr(tot) + '</td></tr></tfoot></table><p class="muted">Anything not listed is a new request and may be priced separately.</p></section>' +
      '<section><h3>2. Payment</h3><ul>' + (adv ? '<li>The client pays a ' + advPct(p) + '% advance (' + inr(adv) + ') before work starts. It is paid straight to ' + fn + '.</li>' : '<li>No advance is asked. Work starts once both parties have signed.</li>') +
        '<li>' + (stage ? 'After the client approves a deliverable, the client pays that deliverable\'s balance' : 'After the client has approved every deliverable, the client pays the whole balance once') + ' within <b>' + pd + ' days</b> of approval.</li>' +
        '<li>Payments are made by UPI, QR code or card, directly to ' + fn + (S().payout.upi ? ' (' + esc(S().payout.upi) + ')' : '') + '. The money is never held by anyone else.</li></ul></section>' +
      '<section><h3>3. Review and approval</h3><ul><li>The client reviews each preview within <b>' + rd + ' days</b>.</li>' + (ad ? '<li>If the client does not reply, the deliverable is approved automatically <b>' + ad + ' days</b> after the reply date.</li>' : '<li>A deliverable is never approved automatically.</li>') + '<li>' + rounds + ' round' + (rounds > 1 ? 's' : '') + ' of changes are included per deliverable. ' + (Number(p.extraFee) ? 'Each extra round costs ' + inr(p.extraFee) + '.' : 'Extra rounds are free.') + '</li></ul></section>' +
      '<section><h3>4. Files and ownership</h3><ul><li>Until payment, the client sees watermarked previews only.</li><li>The original files unlock when ' + (stage ? 'each deliverable is paid' : 'the balance is paid') + '. ' + fn + ' may also unlock them earlier at their own discretion.</li><li>Rights in the delivered work pass to the client once the work it covers is paid in full.</li></ul></section>' +
      '<section><h3>5. Problems</h3><ul><li>The client can report a problem before approving. Approval is then on hold and ' + fn + ' has 5 days to reply.</li><li>The parties settle disagreements between themselves. The scope, approvals and messages are recorded, but nobody else decides disputes.</li></ul></section>' +
      extra + '<section class="csigs">' + (o.fBlock || sigBlock('Freelancer', s.name, fSig)) + (o.cBlock || sigBlock('Client', c.name, cSig)) + '</section>' + (o.tail || '') + '<p class="muted cfine">' + (String(tpl.footer || '').trim() ? esc(tpl.footer) + ' · ' : '') + 'Signed electronically. This template is a starting point for the prototype and is not legal advice.</p></article>';
  }
  function sigPadHTML(who, o) {
    o = o || {}; var g = U.sig || (U.sig = freshSig());
    var modes = '<div class="seg sigmodes" role="group" aria-label="How to sign">' + [['draw', 'Draw', 'pencil'], ['type', 'Type', 'text']].map(function (x) { return '<button type="button" data-a="sigmode" data-k="' + x[0] + '" aria-pressed="' + (g.mode === x[0]) + '" title="' + x[1] + '">' + ico(x[2]) + x[1] + '</button>'; }).join('') + '</div>';
    return '<div class="sigbox sigedit"><span class="lbl">' + esc(o.title || 'Sign here') + '</span>' + modes +
      (g.mode === 'draw' ? '<div class="sigcanvas"><canvas id="sigpad" width="640" height="180" aria-label="Draw your signature"></canvas><button type="button" class="linkb" data-a="sigclear">Clear</button><span class="sigline"></span></div>' : '<div class="field"><input class="input" id="sigtype" aria-label="Type your full name" autocomplete="off" value="' + esc(g.typed) + '" placeholder="' + esc(who) + '"></div><div class="sigprev" id="sigprev">' + esc(g.typed || ' ') + '</div>') +
      '<div class="sigmeta"><b>' + esc(who) + '</b><span>' + (o.sub || 'Signing today') + '</span></div></div>' + (o.noAgree ? '' : agreeLine());
  }
  function agreeLine() { var g = U.sig || {}; return '<label class="check agree"><input type="checkbox" id="sigagree" ' + (g.agree ? 'checked' : '') + '><span>I have read the contract and I sign it electronically.</span></label>'; }
  function sigReady() { var g = U.sig; return !!(g && g.agree && (g.mode === 'draw' ? g.img : String(g.typed).trim().length > 1)); }
  function sigValue(name) { var g = U.sig; return { mode: g.mode, img: g.mode === 'draw' ? g.img : '', typed: g.mode === 'type' ? g.typed.trim() : '', name: name, at: new Date().toISOString() }; }
  function syncSign() { Array.prototype.forEach.call(document.querySelectorAll('[data-a="signsend"],[data-a="signc"]'), function (b) { b.disabled = !sigReady(); }); }
  function mountSig(root) {
    var cv = root.querySelector('#sigpad'); if (!cv) return; var ctx = cv.getContext('2d'), g = U.sig, down = false, last = null;
    ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#18181B';
    if (g.img) { var im = new Image(); im.onload = function () { ctx.drawImage(im, 0, 0, cv.width, cv.height); }; im.src = g.img; }
    var pt = function (e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * cv.width / r.width, y: (e.clientY - r.top) * cv.height / r.height }; };
    cv.addEventListener('pointerdown', function (e) { down = true; last = pt(e); try { cv.setPointerCapture(e.pointerId); } catch (er) {} ctx.beginPath(); ctx.arc(last.x, last.y, 1.2, 0, 7); ctx.fill(); });
    cv.addEventListener('pointermove', function (e) { if (!down) return; var q = pt(e); ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(q.x, q.y); ctx.stroke(); last = q; });
    var end = function () { if (!down) return; down = false; g.img = cv.toDataURL('image/png'); syncSign(); };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  }

  var PLAN_STEPS = [['project', 'Project and client'], ['deliverables', 'Deliverables'], ['terms', 'Terms']];
  var PLANS = [['one', 'One payment', 0, 'Paid in full after you deliver.'], ['half', 'Half and half', 50, 'Half before work starts, half as you deliver.'], ['three', 'Three payments', 30, 'A smaller advance, then two payments as you deliver.']];
  function planOf(d) { if (d.plan) return d.plan; var a = Number(d.advancePct) || 0; return a <= 0 ? 'one' : a >= 40 ? 'half' : 'three'; }
  function hueIdx(str) { var h = 0, t = String(str || ''); for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0; return h % CC.length; }
  function stepOfKey(k) { return /^[nasd]\d+$/.test(k) ? 1 : (k === 'extraFee' || k === 'upi' || k === 'advancePct') ? 2 : 0; }
  function pieHTML(pct, size) { var c = 'var(--ink-blue-7,#2563eb)', r = 'var(--surface-gray-3,#e4e4e7)'; return '<span class="pie" style="width:' + size + 'px;height:' + size + 'px;background:' + (pct <= 0 ? r : 'conic-gradient(' + c + ' 0 ' + pct + '%,' + r + ' ' + pct + '% 100%)') + '" aria-hidden="true"></span>'; }
  function planSum(d) {
    var t = totalDraft(), pct = Number(d.advancePct) || 0, adv = Math.round(t * pct / 100), nm = function (m, i) { return String(m.name || '').trim() || 'Deliverable ' + (i + 1); };
    var row = function (l, v, cls) { return '<div class="sumrow' + (cls ? ' ' + cls : '') + '"><span>' + l + '</span><span class="mono">' + v + '</span></div>'; };
    var dl = d.ms.map(function (m, i) { return String(m.name || '').trim() || Number(m.amount) > 0 ? row(esc(nm(m, i)), Number(m.amount) > 0 ? inr(m.amount) : '–') : ''; }).join('');
    var money = t ? '<div class="sumsep"></div>' + (pct ? row('Advance (' + pct + '%)', inr(adv)) + row('After each approval', inr(t - adv)) : row('Paid after approval', inr(t))) + row('You receive', inr(t), 'big') + '<p class="muted sumnote">Paid straight to you. No PayGuard fee in the beta.</p>' : '';
    var terms = '<div class="sumsep"></div><div class="sumrow"><span>Client replies within</span><span>' + (Number(d.reviewDays) || 3) + ' days</span></div><div class="sumrow"><span>Rounds of changes</span><span>' + (Number(d.rounds) || 2) + '</span></div><div class="sumrow"><span>Files unlock</span><span>' + (unlockOf(d) === 'stage' ? 'Deliverable by deliverable' : 'Whole project') + '</span></div>';
    return dl + '<div class="sumrow tot"><span>Project total</span><span class="mono">' + inr(t) + '</span></div>' + money + terms;
  }
  function planMoney(t, d) { return ''; }
  function planGo(k) { var i = PLAN_STEPS.map(function (x) { return x[0]; }).indexOf(k); if (i < 0) i = Number(k) || 0; U.pstep = i; render(); window.scrollTo(0, 0); var bd = document.querySelector('.body'); if (bd) bd.scrollTop = 0; }
  function setPlanTab() {} function planSpy() {}
  function syncPlanSide() { var sb = document.getElementById('sumbox'); if (sb) sb.innerHTML = planSum(U.draft); }
  function planStepper(cur, e) {
    var bad = {}; Object.keys(e || {}).forEach(function (k) { bad[stepOfKey(k)] = 1; });
    return '<ol class="pstepper" aria-label="Steps">' + PLAN_STEPS.map(function (x, i) { var st = i === cur ? 'on' : i < cur ? 'done' : ''; return '<li class="' + st + (bad[i] ? ' bad' : '') + '"><button type="button" data-a="pstep" data-i="' + i + '" ' + (i === cur ? 'aria-current="step"' : '') + '><span class="pn">' + (i < cur ? ico('check', '') : (i + 1)) + '</span>' + x[1] + '</button></li>'; }).join('<li class="pline" aria-hidden="true"></li>') + '</ol>';
  }
  function sPlan() {
    var d = U.draft, e = d.err || {}, cur = Math.min(2, Math.max(0, U.pstep || 0)), fe = function (k) { return e[k] ? '<span class="hint-err">' + e[k] + '</span>' : ''; };
    var rows = d.ms.map(function (m, i) {
      if (m.shut && !e['n' + i] && !e['a' + i] && !e['d' + i] && !e['s' + i]) return '<div class="mrow shut"><button type="button" class="mshead" data-a="mtgl" data-i="' + i + '" aria-expanded="false"><span class="idx">' + (i + 1) + '</span><span class="mst"><b>' + esc(m.name || 'Untitled deliverable') + '</b><i>' + (Number(m.amount) > 0 ? inr(m.amount) : 'No price yet') + (m.due ? ' · ' + long(parse(m.due)) : '') + (lines(m.scope).length ? ' · ' + lines(m.scope).length + ' included' : '') + '</i></span>' + ico('chev', 'acc-c') + '</button></div>';
      return '<div class="mrow"><div class="mcolrow"><button type="button" class="linkb" data-a="mtgl" data-i="' + i + '" aria-expanded="true">Hide details ' + ico('chev', 'acc-c up') + '</button></div><span class="idx">' + (i + 1) + '</span><div class="field nm"><label for="mn' + i + '">Deliverable</label><input class="input ' + (e['n' + i] ? 'bad' : '') + '" id="mn' + i + '" data-di="' + i + '" data-df="name" placeholder="e.g. Logo concepts" value="' + esc(m.name) + '">' + fe('n' + i) + '</div>' +
        '<div class="field"><label for="ma' + i + '">Amount (₹)</label><input class="input mono ' + (e['a' + i] ? 'bad' : '') + '" id="ma' + i + '" inputmode="numeric" data-di="' + i + '" data-df="amount" placeholder="25000" value="' + esc(m.amount || '') + '">' + fe('a' + i) + '</div>' +
        '<div class="field"><label for="md' + i + '">Delivery date</label><input class="input ' + (e['d' + i] ? 'bad' : '') + '" id="md' + i + '" type="date" min="' + minDue(d, i) + '" data-di="' + i + '" data-df="due" value="' + esc(m.due) + '">' + fe('d' + i) + '</div>' +
        '<button class="btn ghost" data-a="rmms" data-i="' + i + '" aria-label="Remove deliverable ' + (i + 1) + '" ' + (d.ms.length < 2 ? 'disabled' : '') + ' style="padding:0;width:36px">' + ico('x') + '</button>' +
        '<div class="field inc"><label for="ms' + i + '">What\'s included <span style="font-weight:400">(one per line)</span></label><textarea class="textarea ' + (e['s' + i] ? 'bad' : '') + '" id="ms' + i + '" data-di="' + i + '" data-df="scope" rows="' + Math.max(3, lines(m.scope).length + 1) + '" placeholder="3 logo concepts&#10;One concept refined">' + esc(m.scope || '') + '</textarea>' + fe('s' + i) + '</div>' +
        '<div class="sug" id="sg' + i + '">' + sugHTML(i) + '</div>' + (i > 0 ? '<label class="check par"><input type="checkbox" data-di="' + i + '" data-df="par"' + (m.par ? ' checked' : '') + '><span>Runs alongside the previous deliverable</span></label>' : '') + '</div>';
    }).join('');
    var bm = U.briefMsg;
    var brief = '<div class="brief"><div class="brief-t"><b>Start from a brief</b><span class="muted">We split it into deliverables with prices and dates. You can edit everything.</span></div><div class="brief-a"><button type="button" class="btn outline" data-a="pickbrief">' + ico('upload') + 'Upload a brief</button><button type="button" class="btn outline" data-a="samplebrief">Try a sample brief</button><span class="muted">or just write below</span></div><input type="file" id="brieffile" hidden accept=".docx,.pdf,.txt,.md">' +
      (bm ? (bm.busy ? '<p class="brief-s"><i class="fb-spin"></i>Reading ' + esc(bm.name) + '…</p>' : bm.err ? '<p class="brief-s err">' + esc(bm.err) + '</p>' : '<p class="brief-s ok">' + ico('check', '') + '<span>' + esc(bm.ok) + '</span>' + (U.briefUndo ? '<button type="button" class="linkb" data-a="undobrief">Undo</button>' : '') + '</p>') : '') + '</div>';
    var tot = totalDraft(), pl = planOf(d), plc = PLANS.map(function (x) { var on = pl === x[0]; return '<button type="button" class="plc' + (on ? ' on' : '') + '" data-a="plan3" data-k="' + x[0] + '" aria-pressed="' + on + '">' + pieHTML(x[2] || 0, 44) + '<b>' + x[1] + '</b><span>' + x[3] + '</span></button>'; }).join('');
    var pct = Number(d.advancePct) || 0, adv = Math.round(tot * pct / 100);
    var logoAv = avatarHTML({ org: d.corg || d.cname, name: d.cname, color: hueIdx(d.corg || d.cname), logo: d.clogo }, true);
    var steps = [
      '<section class="fsec"><h3>Project and client</h3><div class="field"><label for="pn">Project name</label><input class="input ' + (e.name ? 'bad' : '') + '" id="pn" data-d="name" placeholder="e.g. Brand identity" value="' + esc(d.name) + '">' + fe('name') + '</div>' +
        '<div class="two"><div class="field"><label for="co">Client company</label><input class="input" id="co" data-d="corg" placeholder="e.g. Kiln &amp; Co." value="' + esc(d.corg) + '"></div><div class="field"><label for="cn">Contact name</label><input class="input ' + (e.cname ? 'bad' : '') + '" id="cn" data-d="cname" placeholder="e.g. Arjun Rao" value="' + esc(d.cname) + '">' + fe('cname') + '</div></div>' +
        '<div class="two"><div class="field"><label for="ce">Contact email</label><input class="input ' + (e.cemail ? 'bad' : '') + '" id="ce" type="email" data-d="cemail" placeholder="name@company.com" value="' + esc(d.cemail) + '">' + fe('cemail') + '</div><div class="field"><label>WhatsApp number <span style="font-weight:400">(optional)</span></label>' + phoneHTML('d:cphone', d.cphone, e.cphone) + fe('cphone') + '</div></div>' +
        '<div class="idrow">' + logoAv + '<div style="display:grid;gap:4px;min-width:0"><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn outline" data-a="pickplogo">' + ico('upload') + (d.clogo ? 'Change logo' : 'Add logo') + '</button>' + (d.clogo ? '<button type="button" class="btn ghost" data-a="rmplogo">Remove</button>' : '') + '</div><span class="hint">No logo? We show the client\'s initials.</span><input type="file" id="plogo" accept="image/*" hidden></div></div></section>',
      '<section class="fsec"><h3>Deliverables</h3><p class="sub2">What you will hand over, what each includes and when. Your client agrees to this before work starts.</p>' + brief + rows + '<div id="orderwarn">' + orderWarn(d) + '</div><div class="addrow"><button class="btn outline" data-a="addms" ' + (d.ms.length >= 8 ? 'disabled' : '') + '>' + ico('plus') + 'Add a deliverable</button><button class="btn ghost" data-a="sugall">' + ico('wallet') + 'Suggest prices</button>' + (d.ms.length > 1 ? '<button class="btn ghost" data-a="mtglall">' + (d.ms.every(function (x) { return x.shut; }) ? 'Expand all' : 'Collapse all') + '</button>' : '') + '</div><p class="hint est">Suggested prices are estimates from typical freelance rates, not a quote.</p></section>',
      '<section class="fsec"><h3>Terms</h3><p class="sub2">Your client reads these in the contract before signing.</p>' +
        '<div class="two"><div class="field"><label for="rd">Client replies within</label>' + selC('d', 'reviewDays', d.reviewDays, [[2, '2 days'], [3, '3 days'], [5, '5 days'], [7, '7 days']], 'days', 'rd') + '</div><div class="field"><label for="ad">If they don\'t reply</label>' + selC('d', 'autoDays', d.autoDays, [[2, 'Approve after 2 days'], [3, 'Approve after 3 days'], [5, 'Approve after 5 days'], [0, 'Never approve automatically']], 'days', 'ad') + '</div></div>' +
        '<div class="two"><div class="field"><label for="rn">Rounds of changes per deliverable</label>' + selC('d', 'rounds', d.rounds, [[1, '1 round'], [2, '2 rounds'], [3, '3 rounds']], 'rounds', 'rn') + '</div><div class="field"><label for="xf">Price of an extra round (₹)</label><input class="input mono ' + (e.extraFee ? 'bad' : '') + '" id="xf" inputmode="numeric" data-d="extraFee" value="' + esc(d.extraFee) + '">' + fe('extraFee') + '</div></div>' +
        '<h3 style="margin-top:32px">How you get paid</h3><p class="sub2">Clients pay you directly by UPI, QR or card. PayGuard never holds the money.</p>' +
        '<div class="plcs" role="group" aria-label="Payment plan">' + plc + '</div>' +
        '<div class="plsplit">' + pieHTML(pct, 72) + '<div><div><b>' + (pct ? inr(adv) + ' advance' : 'No advance') + '</b><span class="muted">' + (pct ? ' (' + pct + '%) before work starts' : ' · work starts once you both sign') + '</span></div><div><b>' + inr(tot - adv) + '</b><span class="muted"> paid as each deliverable is approved</span></div></div></div>' + fe('advancePct') +
        '<div class="two"><div class="field"><label for="pdd">Client pays within</label>' + selC('d', 'payDays', d.payDays, [[3, '3 days'], [7, '7 days'], [14, '14 days'], [30, '30 days']], 'days of approving', 'pdd') + '</div><div class="field"><label>Original files unlock</label><div class="seg" role="group" aria-label="When originals unlock">' + [['stage', 'Deliverable by deliverable'], ['project', 'Whole project']].map(function (x) { return '<button type="button" data-a="unlockmode" data-k="' + x[0] + '" aria-pressed="' + (unlockOf(d) === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div></div></div>' +
        '<div class="field"><label for="pupi">Your UPI ID</label><input class="input ' + (e.upi ? 'bad' : '') + '" id="pupi" data-s="payout.upi" autocomplete="off" placeholder="name@bank" value="' + esc(S().payout.upi || '') + '"><span class="hint">Clients pay here by UPI or QR code. Card payments go to the bank account in Settings.</span>' + fe('upi') + '</div></section>'
    ];
    var nav = '<div class="pnav">' + (cur > 0 ? '<button class="btn outline" data-a="pstep" data-i="' + (cur - 1) + '">Back</button>' : '<button class="btn ghost" data-a="cancelplan">Cancel</button>') + (cur < 2 ? '<button class="btn" data-a="pstep" data-i="' + (cur + 1) + '">Next: ' + PLAN_STEPS[cur + 1][1] + ' ' + ico('chev') + '</button>' : '<button class="btn" data-a="createproject">Review the contract ' + ico('chev') + '</button>') + '</div>';
    var main = '<div class="pad formcol" style="gap:0"><div class="pst-h">' + planStepper(cur, e) + '</div>' + steps[cur] + nav + '</div>';
    var side = '<details class="dsec" open><summary>' + ico('chev') + 'Summary</summary><div id="sumbox">' + planSum(d) + '</div></details>';
    return shell('<button class="linkb" data-a="view" data-v="clients">Clients</button>' + ico('chev') + '<b>New project</b>',
      '<div class="detail"><div class="dmain">' + main + '</div><aside class="dside"><div class="dside-in">' + side + '</div></aside></div>', '');
  }
  function draftCal() {
    var evs = U.draft.ms.filter(function (m) { return m.due; }).map(function (m, i) { return { date: parse(m.due), kind: 'due', label: m.name || 'Deliverable ' + (i + 1), sub: 'Delivery date', color: CC[U.draft.ccolor % CC.length] }; }).sort(function (a, b) { return a.date - b.date; });
    return calendar(evs, U.cal);
  }

  /* ---------------- freelancer: project ---------------- */
  function fileRows(m, edit) {
    return items(m).map(function (f) {
      var link = f.kind === 'link', sub = esc(f.size) + (f.v > 1 ? ' · version ' + f.v : '');
      return '<div class="file"' + (edit ? ' style="grid-template-columns:36px minmax(0,1fr) auto 28px"' : '') + '><span class="ic">' + fileTag(f) + '</span><div style="min-width:0"><div class="nm">' + esc(f.name) + '</div><div class="muted" style="font-size:var(--t1)">' + sub + '</div></div>' +
        (link ? '<a class="ok" href="' + esc(f.url) + '" target="_blank" rel="noopener noreferrer">Open link</a>' : '<span class="ok">' + ico('check', 'tick') + (m.status === 'released' ? 'Original unlocked' : 'Preview ready') + '</span>') +
        (edit ? '<button class="ibtn" data-a="rmitem" data-m="' + m.id + '" data-id="' + f.id + '" aria-label="Remove ' + esc(f.name) + '">' + ico('x') + '</button>' : '') + '</div>';
    }).join('');
  }
  function trayIll() { return '<svg class="ill" viewBox="0 0 200 140" width="104" aria-hidden="true"><ellipse class="soft" cx="100" cy="116" rx="64" ry="9"/><path d="M42 82 56 62H144L158 82V108a6 6 0 0 1-6 6H48a6 6 0 0 1-6-6Z"/><path class="acc bgf" d="M76 72V32a6 6 0 0 1 6-6H108L124 42V72Z"/><path class="acc" d="M108 26V42H124M86 54H112M86 62H104"/><path class="bgf" d="M42 82H80q4 12 20 12t20-12H158V108a6 6 0 0 1-6 6H48a6 6 0 0 1-6-6Z"/><path class="acc" d="M100 16V4M95 9l5-5 5 5"/><path d="M150 30v8M146 34h8M54 38v6M51 41h6"/><circle class="adot" cx="40" cy="62" r="2"/></svg>'; }
  function scopeList(s, cls) { return s && s.length ? '<ul class="scope' + (cls ? ' ' + cls : '') + '">' + s.map(function (x) { return '<li>' + (cls === 'tick' ? ico('check', 'tk') : '') + '<span>' + esc(x) + '</span></li>'; }).join('') + '</ul>' : ''; }
  function scopeBox(m, title, open) { return m.scope && m.scope.length ? '<details class="scopebox" style="margin-top:14px"' + (open ? ' open' : '') + '><summary><span class="lbl">' + (title || 'What\'s included') + (m.scopeAt ? ' · agreed ' + fmt(new Date(m.scopeAt), { day: 'numeric', month: 'short' }) : '') + '</span><span class="muted">' + m.scope.length + (m.scope.length === 1 ? ' item' : ' items') + '</span></summary>' + scopeList(m.scope) + '</details>' : ''; }
  function homeHero(m) {
    if (!m) return '';
    var p = P(), c = clientName(), fc = esc(first(c)), due = parse(m.due), n = days(due);
    var left = Math.max(0, m.limit - m.revisions), parts = [];
    if (m.status !== 'submitted') parts.push(n < 0 ? '<span class="late">' + Math.abs(n) + (n === -1 ? ' day' : ' days') + ' late</span>' : 'Due ' + long(due) + ' · ' + (n === 0 ? 'today' : 'in ' + n + (n === 1 ? ' day' : ' days')));
    parts.push(left + (left === 1 ? ' round' : ' rounds') + ' of changes left'); if (m.extra) parts.push('+' + inr(m.extra) + ' for extra rounds');
    var meta = '<p class="meta2">' + parts.join(' · ') + '</p>';
    var acts = function (inner) { return '<div class="acts">' + inner + '</div>'; };
    var h = '<div class="card">', one = '<div class="hero" style="grid-template-columns:minmax(0,1fr)"><div>';
    if (m.status === 'released' || m.status === 'refunded') {
      var nxt = currentMs(), next = nxt && nxt.id !== m.id ? '<button class="btn" data-a="selms" data-id="' + nxt.id + '">Next: ' + esc(nxt.name) + ' ' + ico('chev') + '</button>' : '', docs = '<button class="btn outline" data-a="receipt" data-id="' + m.id + '">' + ico('file') + 'Documents</button>';
      var howTxt = m.paidHow === 'free' ? 'You unlocked the originals without payment.' : m.paidHow === 'manual' ? 'You marked it paid another way. Originals are unlocked.' : fc + ' paid ' + inr(balOf(m, p)) + ' straight to you. Originals are unlocked.';
      h += one + '<span class="badge released">Unlocked</span><h3>' + esc(m.name) + '</h3><p class="muted">' + (m.autoApproved ? 'Approved automatically after no reply. ' : fc + ' approved this. ') + howTxt + '</p>' + acts(docs + next) + '</div></div>';
      if (!nxt || nxt.id === m.id) h += '<div class="note" style="background:var(--ok-bg);color:var(--ok)"><b>All deliverables unlocked.</b></div>';
    } else if (m.status === 'approved') {
      var pb = payBy(m, p), pdn = days(pb), cp = canPay(m, p), amt = payAmt(m, p);
      h += one + '<span class="badge approved">Awaiting payment</span><h3>' + esc(m.name) + '</h3><p class="muted">' + fc + ' approved this ' + agoTxt(m.approvedAt) + '. ' + (cp ? 'The originals stay locked until they pay ' + inr(amt) + ' (by ' + long(pb) + ').' : 'You can start the next deliverable. ' + fc + ' pays once after the last deliverable is approved.') + '</p>' +
        (cp && pdn < 0 ? '<p><span class="badge amber">Payment ' + Math.abs(pdn) + (Math.abs(pdn) === 1 ? ' day' : ' days') + ' late</span></p>' : '') + scopeBox(m) +
        acts('<button class="btn outline" data-a="remind" data-id="' + p.id + '">Remind ' + fc + '</button>' + (cp ? '<button class="btn" data-a="markpaid" data-id="' + m.id + '">Mark as paid</button><button class="btn ghost" data-a="askunlock" data-id="' + m.id + '">Unlock anyway</button>' : '') + remTrace(p)) + '</div></div><div class="files">' + fileRows(m) + '</div>';
    } else if (m.status === 'dispute') {
      var dr = m.dispute || {}, by = issueBy(m);
      h += one + '<span class="badge dispute">On hold</span><h3>' + fc + ' reported a problem with ' + esc(m.name) + '</h3><p class="muted">Approval is on hold until you reply. ' + (days(by) >= 0 ? 'Reply by ' + long(by) + ' (' + rel(by) + ').' : 'The reply window has closed. Reach out to ' + fc + ' directly.') + '</p>' + scopeBox(m) + '</div></div>' +
        '<div class="note" style="background:var(--err-bg);color:var(--err)"><b>' + esc(REASONS[dr.reason] || 'Problem reported') + '</b>' + esc(dr.note) + '</div>' +
        '<div class="submitbar"><div><b>Reply to ' + fc + '</b><div class="muted" style="font-size:var(--t1)">Say what you\'ll do and by when. Approval stays on hold until you do.</div></div><span style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-a="askrespond" data-id="' + m.id + '">Reply</button></span></div>';
    } else if (m.status === 'draft') {
      var waitSign = !contractOk(p), first0 = p.ms[0] === m;
      h += one + stBadge(m, p) + '<h3>' + esc(m.name) + '</h3><p class="muted">' + (waitSign ? 'Waiting for ' + fc + ' to sign the contract.' : first0 && advDue(p) ? 'Waiting for ' + fc + ' to pay the ' + inr(advAmt(p)) + ' advance (' + advPct(p) + '%).' : 'This deliverable starts once the previous one is unlocked.') + '</p>' + (function () { var x = attentionFor(p); return x && (x.kind === 'fund' || x.kind === 'sign') ? '<p><span class="badge amber">' + esc(x.text) + (p.openedAt ? ' · link opened ' + agoTxt(p.openedAt) : ' · link not opened yet') + '</span></p>' : ''; })() + meta + scopeBox(m) +
        acts((waitSign || (first0 && advDue(p)) ? '<button class="btn outline" data-a="remind" data-id="' + p.id + '">Remind ' + fc + '</button>' : '') + (!waitSign && first0 && advDue(p) ? '<button class="btn" data-a="markadv">Mark advance as paid</button>' : '') + (waitSign || (first0 && advDue(p)) ? remTrace(p) : '')) + '</div></div>' +
        '<div class="drop locked"><svg class="ico" style="width:32px;height:32px" aria-hidden="true"><use href="#i-lock"/></svg><div><b>Uploads open when this deliverable starts</b><span class="muted">' + (waitSign ? 'Once ' + fc + ' signs the contract' : first0 && advDue(p) ? 'Once the advance is paid' : 'After the previous deliverable is unlocked') + '.</span></div></div>';
    } else if (m.status === 'submitted') {
      var rb = replyBy(m), aa = autoAt(p, m);
      h += one + '<span class="badge submitted">In review</span><h3>' + esc(m.name) + '</h3><p class="muted">' + (m.submittedAt ? 'Sent ' + agoTxt(m.submittedAt) + '. ' : '') + (days(rb) < 0 ? fc + '\'s reply was due ' + rel(rb) + '.' : fc + ' has until ' + long(rb) + ' to reply (' + rel(rb) + ').') + (aa ? ' It\'s approved automatically on ' + long(aa) + '.' : '') + '</p>' + meta + scopeBox(m) + (m.deliveryNote ? '<div class="note" style="margin-top:14px;background:var(--muted);color:var(--fg)"><b>Your note to ' + fc + '</b>' + esc(m.deliveryNote) + '</div>' : '') + acts('<button class="btn outline" data-a="remind" data-id="' + p.id + '">Remind ' + fc + '</button>' + remTrace(p)) + '</div></div><div class="files">' + fileRows(m) + '</div>';
    } else {
      var feedback = m.status === 'changes' && m.notes.length ? '<div class="note"><b>Changes requested · round ' + m.revisions + ' of ' + m.limit + '</b>' + esc(m.notes[m.notes.length - 1].text) + '</div>' : '';
      var reply = m.reply ? '<div class="note" style="background:var(--muted);color:var(--fg)"><b>Your reply to the issue</b>' + esc(m.reply) + '</div>' : '';
      var fresh2 = items(m).filter(function (f) { return f.v === m.revisions + 1; });
      h += one + '<span class="badge ' + (m.status === 'changes' ? 'changes' : 'funded') + '">' + (m.status === 'changes' ? 'Changes requested' : 'In progress') + '</span><h3>' + esc(m.name) + '</h3><p class="muted">' + (m.status === 'changes' ? 'Upload the revised files.' : 'Upload your files. ' + fc + ' sees a watermarked preview.') + '</p>' + meta + scopeBox(m) + '</div></div>' + feedback + reply;
      var nIt = items(m).length;
      h += '<div class="upl' + (U.over ? ' over' : '') + '" id="dz"><ol class="steps3"><li class="' + (nIt ? 'done' : 'on') + '"><i>1</i>Add your work</li><li class="' + (U.dnote ? 'done' : nIt ? 'on' : '') + '"><i>2</i>Add a note</li><li class="' + (fresh2.length ? 'on' : '') + '"><i>3</i>Preview and send</li></ol><div class="drop upl-main">' + trayIll() + '<div><b>Drop files here, or choose them</b><span class="muted">Images, PDFs, videos and docs</span></div><div class="btns"><button class="btn" data-a="pick">' + ico('upload') + 'Choose files</button></div></div>' +
        '<div class="upl-link"><label for="lnk">Or add a link ' + TOOLS + '</label><div class="upl-row"><input class="input" id="lnk" type="url" placeholder="https://www.figma.com/design/…" autocomplete="off"><button class="btn outline" data-a="addlink">' + ico('link') + 'Add link</button></div><p class="hint">Use a view-only link. ' + fc + ' opens it in a new tab.</p></div>' +
        (U.upErr ? '<div class="upl-err" role="alert">' + ico('x', '') + '<span>' + esc(U.upErr) + '</span></div>' : '') +
        '<div class="upl-foot"><button class="linkb" data-a="sample">Try it with sample files</button></div><input type="file" id="fi" multiple hidden accept="' + VIEW_ACCEPT + '"></div>';
      if (U.uploading.length) h += '<div class="files">' + U.uploading.map(function (f) { return '<div class="file"><span class="ic">…</span><div style="min-width:0"><div class="nm">' + esc(f.name) + '</div><div class="bar"><i></i></div></div><span class="muted" style="font-size:var(--t1)">Uploading</span></div>'; }).join('') + '</div>';
      if (items(m).length) h += '<div class="files">' + fileRows(m, true) + '</div>';
      if (fresh2.length && !U.uploading.length) h += '<div class="deliver"><div class="field"><label for="dn">Note for ' + fc + ' <span class="muted">(optional)</span></label><textarea class="textarea" id="dn" rows="2" placeholder="What is in this delivery? For example: Homepage in two directions. Start with direction A.">' + esc(U.dnote || '') + '</textarea></div><div class="submitbar"><div><b>Reply due ' + long(addDays(TODAY, p.reviewDays || 3)) + '</b><div class="muted" style="font-size:var(--t1)">' + fc + ' sees a watermarked preview.' + (p.autoDays ? ' Approved automatically ' + p.autoDays + ' days later.' : '') + '</div></div><span style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn outline" data-a="previewas" data-id="' + m.id + '">' + ico('eye') + 'Preview as ' + fc + '</button><button class="btn lg" data-a="submit" data-id="' + m.id + '">Send for review</button></span></div></div>';
    }
    return h + '</div>';
  }
  function secH(ic, t, r) { return '<div class="sec-h"><span class="ic-c">' + ico(ic, '') + '</span><h3>' + t + '</h3>' + (r || '') + '</div>'; }
  var STI = { released: ['check', 'Unlocked'], approved: ['lock', 'Awaiting payment'], submitted: ['eye', 'In review'], draft: ['clock', 'Not started'], funded: ['clock', 'In progress'], changes: ['refresh', 'Changes'], dispute: ['x', 'On hold'], refunded: ['x', 'Refunded'] };
  function stPill(m) { var s = STI[m.status] || STI.draft, c = (STATUS[m.status] || STATUS.draft)[0]; return '<span class="stp ' + c + '">' + ico(s[0], '') + s[1] + '</span>'; }
  function filesCard(p) {
    var all = []; p.ms.forEach(function (m) { items(m).forEach(function (f) { all.push([m, f]); }); });
    return '<section class="panel">' + secH('file', 'Files &amp; links', '<span class="muted">' + all.length + '</span><button class="btn outline sm" data-a="ptab" data-t="files" style="margin-left:auto">View all</button>') + (all.length ? '<div class="prows">' + all.slice(0, 4).map(function (x) { return '<div class="prow static"><span class="fic">' + fileTag(x[1]) + '</span><div style="flex:1;min-width:0"><div class="t1">' + esc(x[1].name) + '</div><div class="t2">' + esc(x[0].name) + '</div></div></div>'; }).join('') + '</div>' : '<p class="muted" style="padding:4px 4px 8px">Files and links appear here once the work starts.</p>') + '</section>';
  }
  function approvalsCard(p) {
    var c = first(p.client.name);
    return '<section class="panel">' + secH('check', 'Approvals', '<span class="muted">' + p.ms.filter(closed).length + ' of ' + p.ms.length + ' approved</span>') + '<div class="atable"><div class="ahead"><span>Deliverable</span><span>Approver</span><span>Updated</span><span>Status</span></div>' + p.ms.map(function (m, i) {
      var cur = focusMs() && focusMs().id === m.id, up = m.releasedAt || m.submittedAt || m.fundedAt, open = !!(U.open && U.open[m.id]);
      return '<div class="aw' + (open ? ' open' : '') + '"><button type="button" class="arow' + (cur ? ' sel' : '') + '" data-a="tgl" data-id="' + m.id + '" aria-expanded="' + open + '"><span class="aid">' + (i + 1) + '</span><span class="anm"><b>' + esc(m.name) + '</b><i>Due ' + long(parse(m.due)) + '</i></span><span class="apr">' + avatarFor(p) + esc(c) + '</span><span class="aup">' + (up ? fmt(new Date(up), { day: 'numeric', month: 'short' }) : '–') + '</span>' + stPill(m) + ico('chev', 'acc-c') + '</button>' + stageDetail(m, p, null, open) + '</div>';
    }).join('') + '</div></section>';
  }
  function projFiles() {
    var all = []; ms().forEach(function (m) { items(m).forEach(function (f) { all.push([m, f]); }); });
    var cur = currentMs(), canAdd = cur && (cur.status === 'funded' || cur.status === 'changes'), cols = 'minmax(0,1.6fr) minmax(0,1fr) 90px 150px';
    var head = '<div class="vc" style="padding:0"><span class="muted">' + all.length + (all.length === 1 ? ' item' : ' items') + '</span>' + (canAdd ? '<button class="btn sm" data-a="gotoup">' + ico('upload') + 'Add to ' + esc(cur.name) + '</button>' : '') + '</div>';
    if (!all.length) return head + '<div class="lv-empty"><div><b>No files yet</b><div class="muted">' + (canAdd ? 'Add your first file or link to ' + esc(cur.name) + '.' : 'Files and links appear here once the work starts.') + '</div></div></div>';
    return head + '<div class="lv" style="padding:0"><div class="lv-head" style="--cols:' + cols + '"><span>File</span><span>Deliverable</span><span style="text-align:right">Size</span><span>Status</span></div>' + all.map(function (x) {
      var f = x[1], m = x[0], link = f.kind === 'link';
      return '<div class="lv-row static" style="--cols:' + cols + '"><div class="who3"><span class="fic">' + fileTag(f) + '</span><div><div class="t1">' + (link ? '<a href="' + esc(f.url) + '" target="_blank" rel="noopener noreferrer">' + esc(f.name) + '</a>' : esc(f.name)) + '</div></div></div><span class="t2" style="font-size:var(--t2)">' + esc(m.name) + '</span><span class="mono t2" style="text-align:right">' + esc(link ? 'Link' : f.size) + '</span><span><span class="badge ' + (m.status === 'released' ? 'green' : 'gray') + '">' + (link ? 'Link' : m.status === 'released' ? 'Original unlocked' : 'Preview only') + '</span></span></div>';
    }).join('') + '</div>';
  }
  function projActivity() {
    var items2 = D.log.filter(function (l) { return l.pid === D.cur; });
    /* a project with no recorded actions (the samples) shows its stage history instead */
    if (!items2.length && P()) { var pp = P(), fp = first(pp.client.name), fs2 = first(D.studio.name); pp.ms.forEach(function (m) {
      if (m.fundedAt) items2.push({ t: m.fundedAt, who: 'system', text: 'Work started on ' + m.name });
      if (m.approvedAt) items2.push({ t: m.approvedAt, who: m.autoApproved ? 'system' : 'client', text: m.autoApproved ? m.name + ' was approved automatically' : fp + ' approved ' + m.name });
      if (m.submittedAt) items2.push({ t: m.submittedAt, who: 'freelancer', text: 'Sent ' + m.name + ' for review' });
      (m.notes || []).forEach(function (n) { items2.push({ t: n.at, who: 'client', text: fp + ' asked for changes on ' + m.name }); });
      if (m.dispute) items2.push({ t: m.dispute.at, who: 'client', text: fp + ' reported a problem with ' + m.name });
      if (m.releasedAt) items2.push({ t: m.releasedAt, who: 'client', text: fp + ' paid for ' + m.name + '. Originals unlocked' });
      if (m.refundedAt) items2.push({ t: m.refundedAt, who: 'freelancer', text: 'Refunded ' + fp + ' for ' + m.name });
    }); items2.sort(function (x, y) { return new Date(y.t) - new Date(x.t); }); }
    if (!items2.length) return '<div class="lv-empty"><span class="muted">No activity yet.</span></div>';
    return '<div class="lv" style="padding:0">' + items2.map(function (l) {
      var d = new Date(l.t), who = l.who === 'client' ? avatarFor(P()) : l.who === 'system' ? '<span class="avatar" style="background:var(--surface-gray-2);color:var(--ink-gray-7)" title="PayGuard">' + ico('shield', '') + '</span>' : '<span class="avatar">' + initials(D.studio.name) + '</span>';
      return '<div class="lv-row static" style="--cols:32px minmax(0,1fr) auto">' + who + '<span style="font-size:var(--t2)">' + esc(l.text) + '</span><span class="t2" style="text-align:right">' + fmt(d, { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) + '</span></div>';
    }).join('') + '</div>';
  }
  /* Project page, modelled on a Frappe CRM deal: underline tabs in the main column, the record in a side panel. */
  function projSide(p) {
    var c = p.client, tot = p.ms.reduce(function (a, m) { return a + m.amount; }, 0), m0 = p.ms[0] || {}, nx = nextEvents(3);
    var fr = function (l, v) { return '<div class="frow2"><span>' + l + '</span><span>' + v + '</span></div>'; }, sec = function (t, open) { return '<details class="dsec"' + (open ? ' open' : '') + '><summary>' + ico('chev') + t + '</summary>'; };
    /* PayGuard's fee and each side's share, summed stage by stage so it matches the Payments page */
    return '<div class="who2">' + avatarFor(p, true) + '<div style="min-width:0"><div class="t">' + esc(org(p)) + '</div><div class="iconbtns">' +
        '<a class="ibtn" href="mailto:' + esc(encodeURIComponent(c.email || '')) + '" title="Email ' + esc(first(c.name)) + '" aria-label="Email ' + esc(first(c.name)) + '">' + ico('mail') + '</a>' +
        '<button class="ibtn" data-a="editclient" title="Edit client" aria-label="Edit client">' + ico('pencil') + '</button>' +
        '<button class="ibtn" data-a="role" data-r="client" title="View as ' + esc(first(c.name)) + '" aria-label="View as ' + esc(first(c.name)) + '">' + ico('eye') + '</button></div></div></div>' +
      sec('Next up', true) + (nx.length ? nx.map(function (x) { return fr(long(x.date), esc(x.label) + (x.kind === 'rv' ? ' · reply due' : '')); }).join('') : '<p class="muted" style="padding:0 8px;font-size:var(--t2)">Nothing coming up.</p>') + '</details>' +
      sec('Money', true) + fr('Project value', '<span class="mono">' + inr(tot) + '</span>') + (advPct(p) ? fr('Advance (' + advPct(p) + '%)', '<span class="mono">' + inr(advAmt(p)) + '</span>' + (p.advancePaid ? ' · paid' : ' · due')) : fr('Advance', 'None')) + fr('Originals unlock', projMode(p) ? 'Once, after all deliverables' : 'Deliverable by deliverable') + fr('Balance due', (Number(p.payDays) || 7) + ' days after approval') +
        '<p class="muted" style="font-size:var(--t1);padding:6px 8px 0">Clients pay you directly. No PayGuard fee in the beta.</p></details>' +
      sec('Contract') + fr('You', 'Signed') + fr(esc(first(c.name)), contractOk(p) ? 'Signed' : 'Waiting') + '<div style="padding:6px 8px 0"><button class="btn ghost sm" data-a="ptab" data-t="contract">Open the contract tab</button></div></details>' +
      sec('Terms') + fr('Client replies within', (p.reviewDays || 3) + ' days') + fr('If no reply', autoTxt(p)) + fr('Rounds of changes', (m0.limit || 2) + ' per deliverable') + fr('Extra round', Number(p.extraFee) ? inr(p.extraFee) : 'Free') + '</details>' +
      sec('Contact') + fr('Name', esc(c.name)) + fr('Email', esc(c.email || '–')) + fr('WhatsApp', esc(c.phone || '–')) + '</details>';
  }

  /* ---------------- freelancer: one client (the timeline) ----------------
     Job of the page: what state is the work in. A vertical timeline: contract, advance, then each deliverable. */
  function isOpenT(id, def) { return U.open && U.open[id] !== undefined ? !!U.open[id] : def; }
  function activityItems(p) {
    var out = D.log.filter(function (l) { return l.pid === p.id; }).map(function (l) { return { t: new Date(l.t).getTime(), text: l.text }; });
    if (!out.length) {
      var fp = first(p.client.name);
      p.ms.forEach(function (m) {
        var add = function (t, x) { if (t) out.push({ t: new Date(t).getTime(), text: x }); };
        add(m.fundedAt, 'Work started on ' + m.name); add(m.submittedAt, 'Sent ' + m.name + ' for review');
        (m.notes || []).forEach(function (n) { add(n.at, fp + ' asked for changes on ' + m.name); });
        if (m.dispute) add(m.dispute.at, fp + ' reported a problem with ' + m.name);
        add(m.approvedAt, m.autoApproved ? m.name + ' was approved automatically' : fp + ' approved ' + m.name);
        add(m.releasedAt, fp + ' paid for ' + m.name + '. Originals unlocked');
      });
    }
    return out.sort(function (a, b) { return b.t - a.t; }).slice(0, 6);
  }
  function tNode(state, inner) { return '<span class="tnode ' + state + '">' + inner + '</span>'; }
  function tItem(id, state, nodeInner, title, pill, right, open, body) {
    return '<div class="tli ' + state + '"><div class="tcol">' + tNode(state, nodeInner) + '</div><div class="tbody"><button type="button" class="thd" data-a="ttgl" data-id="' + id + '" data-o="' + (open ? 1 : 0) + '" aria-expanded="' + open + '"><b>' + title + '</b>' + pill + '<span class="tr">' + right + ico('chev', 'tch' + (open ? ' up' : '')) + '</span></button>' + (open ? body : '') + '</div></div>';
  }
  function dAction(p, m) {
    var c = esc(first(p.client.name)), rem = '<button type="button" class="btn pri" data-a="remind" data-id="' + p.id + '">' + ico('bell') + 'Remind ' + c + '</button>';
    if (m.status === 'submitted') return rem;
    if (m.status === 'approved') return (canPay(m, p) ? '<button type="button" class="btn outline icon" data-a="markpaid" data-id="' + m.id + '" data-tip="Mark as paid" aria-label="Mark as paid">' + ico('check') + '</button><button type="button" class="btn outline icon" data-a="askunlock" data-id="' + m.id + '" data-tip="Unlock without payment" aria-label="Unlock without payment">' + ico('unlock') + '</button>' : '') + rem;
    if (m.status === 'dispute') return '<button type="button" class="btn pri" data-a="askrespond" data-id="' + m.id + '">Reply to ' + c + '</button>';
    if (m.status === 'released') return '<button type="button" class="btn outline" data-a="receipt" data-id="' + m.id + '">' + ico('file') + 'Receipt and contract</button>';
    return '';
  }
  function uploadArea(p, m, noFiles) {
    var fc = esc(first(p.client.name)), fresh2 = items(m).filter(function (f) { return f.v === m.revisions + 1; }), nIt = items(m).length, h = '', re = m.status === 'changes';
    var ready = fresh2.length && !U.uploading.length;
    h += '<div class="upl' + (U.over ? ' over' : '') + '" id="dz"><ol class="steps3"><li class="' + (ready ? 'done' : 'on') + '"><i>1</i>' + (re ? 'Re-upload your work' : 'Add your work') + '</li><li class="' + (U.dnote ? 'done' : ready ? 'on' : '') + '"><i>2</i>Add a note</li><li><i>3</i>Send for review</li></ol>' +
      '<div class="upl-box"><div class="drop upl-main">' + trayIll() + '<div><b>' + (re ? 'Drop the revised files here, or choose them' : 'Drop files here, or choose them') + '</b><span class="muted">Images, PDFs, videos and docs</span></div><div class="btns"><button class="btn" data-a="pick">' + ico('upload') + (re ? 'Re-upload files' : 'Choose files') + '</button></div></div>' +
      '<div class="upl-link"><label for="lnk">Or add a link ' + TOOLS + '</label><div class="upl-row"><input class="input" id="lnk" type="url" placeholder="https://www.figma.com/design/…" autocomplete="off"><button class="btn outline" data-a="addlink">' + ico('link') + 'Add link</button></div><p class="hint">Use a view-only link. ' + fc + ' opens it in a new tab.</p></div>' +
      (U.upErr ? '<div class="upl-err" role="alert">' + ico('x', '') + '<span>' + esc(U.upErr) + '</span></div>' : '') +
      (ready ? '<div class="field"><label for="dn">Note for ' + fc + ' <span class="muted">(optional)</span></label><textarea class="textarea" id="dn" rows="2" placeholder="What is in this delivery? For example: Homepage in two directions. Start with direction A.">' + esc(U.dnote || '') + '</textarea></div>' : '') +
      '<div class="upl-cta"><button class="linkb" data-a="sample">Try it with sample files</button><span class="upl-go">' + (ready ? '<span class="muted">Reply due ' + long(addDays(TODAY, p.reviewDays || 3)) + '</span><button class="btn outline" data-a="previewas" data-id="' + m.id + '">' + ico('eye') + 'Preview as ' + fc + '</button>' : '') + '<button class="btn" data-a="submit" data-id="' + m.id + '" ' + (ready ? '' : 'disabled') + '>Send for review</button></span></div></div><input type="file" id="fi" multiple hidden accept="' + VIEW_ACCEPT + '"></div>';
    if (U.uploading.length) h += '<div class="files">' + U.uploading.map(function (f) { return '<div class="file"><span class="ic">…</span><div style="min-width:0"><div class="nm">' + esc(f.name) + '</div><div class="bar"><i></i></div></div><span class="muted" style="font-size:var(--t1)">Uploading</span></div>'; }).join('') + '</div>';
    if (nIt && !noFiles) h += '<div class="files">' + fileRows(m, true) + '</div>';
    return h;
  }
  function dCard(p, m) {
    var c = esc(first(p.client.name)), its = items(m), working = (m.status === 'funded' || m.status === 'changes'), left = Math.max(0, m.limit - m.revisions);
    var inc = m.scope && m.scope.length ? '<ul class="ul">' + m.scope.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '<p class="muted" style="margin:0">Nothing listed.</p>';
    var files = working ? '<p class="muted" style="margin:0">' + (its.length ? its.length + (its.length === 1 ? ' file' : ' files') + ' added. Add more below.' : m.status === 'changes' ? 'Nothing re-uploaded yet. Re-upload below.' : 'No files yet. Add your work below.') + '</p>' : its.length ? its.map(function (f) { return '<div class="tf"><span class="t">' + fileTag(f) + '</span>' + esc(f.name) + '</div>'; }).join('') : '<p class="muted" style="margin:0">No files.</p>';
    var third, h3 = 'Changes';
    if (m.status === 'dispute') { var dr = m.dispute || {}; h3 = 'Problem reported'; third = '<p style="margin:0"><b>' + esc(REASONS[dr.reason] || 'Problem') + '</b><br><span class="muted">' + esc(dr.note) + '</span></p>'; }
    else if (m.status === 'approved') { h3 = 'Payment'; third = '<p class="muted" style="margin:0">' + c + ' approved this ' + agoTxt(m.approvedAt) + '. ' + (canPay(m, p) ? 'Waiting for ' + inr(payAmt(m, p)) + ', due ' + long(payBy(m, p)) + '.' : 'Paid once, after the last deliverable.') + '</p>'; }
    else if (m.status === 'released') { h3 = 'Payment'; third = '<p class="muted" style="margin:0">' + (m.paidHow === 'free' ? 'Unlocked without payment.' : 'Paid ' + inr(balOf(m, p)) + '. Originals are unlocked.') + '</p>'; }
    else if (m.notes && m.notes.length) third = '<p style="margin:0"><span class="muted">Round ' + m.revisions + ' of ' + m.limit + (m.status === 'changes' ? ' · see the request below' : '') + '</span></p>';
    else third = '<p class="muted" style="margin:0">No changes asked yet. ' + left + (left === 1 ? ' round' : ' rounds') + ' left.</p>';
    var act = dAction(p, m);
    return '<div class="tcard"><div><h3>What\'s included</h3>' + inc + '</div><div><h3>Files shared</h3>' + files + '</div><div><h3>' + h3 + '</h3>' + third + '</div>' + (act ? '<div class="tact">' + act + '</div>' : '<span></span>') + '</div>' + (working ? (its.length ? '<div class="files tfiles">' + fileRows(m, true) + '</div>' : '') + changeNote(p, m) + uploadArea(p, m, true) : '');
  }
  function changeNote(p, m) {
    if (m.status !== 'changes' || !m.notes || !m.notes.length) return '';
    var n = m.notes[m.notes.length - 1], c = esc(first(p.client.name));
    return '<div class="fbc" role="note"><div class="fbh">' + avatarFor(p) + '<b>' + c + ' asked for changes</b><span class="muted">Round ' + m.revisions + ' of ' + m.limit + (n.at ? ' · ' + agoTxt(n.at) : '') + '</span></div><p>“' + esc(String(n.text || '').replace(/^What to change:\s*/i, '')) + '”</p><span class="muted fbn">Upload the revised files below, then send them for review again.</span></div>';
  }
  function timelineHTML(p) {
    var cur = focusMs(), c = esc(first(p.client.name)), signed = contractOk(p), out = '';
    var remBtn = '<button type="button" class="btn pri" data-a="remind" data-id="' + p.id + '">' + ico('bell') + 'Remind ' + c + '</button>';
    // contract
    var cOpen = isOpenT('ctr', !signed), cBody = '<div class="tcard one"><div><p class="muted" style="margin:0">' + (signed ? 'Signed by both on ' + (p.contract && p.contract.cSig ? long(new Date(p.contract.cSig.at)) : long(new Date(p.createdAt || TODAY))) + '.' : 'Work starts once ' + c + ' signs the contract.') + '</p></div><div class="tact">' + (signed ? '' : remBtn) + '<button type="button" class="btn outline" data-a="viewcontract" data-id="' + p.id + '">' + ico('file') + 'View contract</button><button type="button" class="btn outline" data-a="dlcontract" data-id="' + p.id + '">' + ico('download') + 'Download PDF</button></div></div>';
    out += tItem('ctr', signed ? 'done' : 'now', signed ? ico('check', '') : ico('lock', ''), 'Contract', '<span class="badge ' + (signed ? 'released' : 'changes') + '">' + (signed ? 'Signed by both' : 'Waiting for ' + c + ' to sign') + '</span>', signed ? '' : 'sent ' + agoTxt(p.contract && p.contract.sentAt || p.createdAt || p.askedAt), cOpen, cBody);
    // advance
    if (advPct(p)) {
      var paid = !!p.advancePaid, aOpen = isOpenT('adv', signed && !paid), aState = paid ? 'done' : signed ? 'now' : 'next';
      var aBody = '<div class="tcard one"><div><p class="muted" style="margin:0">' + (paid ? 'Paid straight to you.' : signed ? c + ' pays ' + inr(advAmt(p)) + ' (' + advPct(p) + '%) before work starts.' : 'Due after the contract is signed.') + '</p></div><div class="tact">' + (signed && !paid ? remBtn + '<button type="button" class="btn outline" data-a="markadv">Mark as paid</button>' : '') + '</div></div>';
      out += tItem('adv', aState, paid ? ico('check', '') : '$', 'Advance', '<span class="badge ' + (paid ? 'released' : signed ? 'changes' : 'draft') + '">' + (paid ? 'Paid' : signed ? 'Waiting for ' + c : 'Not due yet') + '</span>', inr(advAmt(p)) + ' · ' + advPct(p) + '%', aOpen, aBody);
    }
    // deliverables
    p.ms.forEach(function (m, i) {
      var done = closed(m), isCur = !!cur && cur.id === m.id, open = isOpenT(m.id, isCur), a = attentionFor(p), late = a && a.mid === m.id && a.sev === 'red' ? '<span class="badge changes">' + esc(a.text) + '</span>' : '';
      var st = done ? 'done' : isCur ? 'now' : 'next', right = inr(m.amount) + ' · ' + (m.status === 'released' ? 'paid ' + long(new Date(m.releasedAt || TODAY)) : 'due ' + long(parse(m.due)));
      out += tItem(m.id, st, done ? ico('check', '') : (i + 1), esc(m.name), stBadge(m, p) + late, right, open, dCard(p, m));
    });
    return '<div class="tln">' + out + '</div>';
  }
  function detailsDrawer(p) {
    if (!paneOpen()) return '';
    var tot = totalOf(p), got = (p.advancePaid ? advAmt(p) : 0) + p.ms.reduce(function (a, m) { return a + (m.status === 'released' ? balOf(m, p) : 0); }, 0), signed = contractOk(p), c = esc(p.client.name);
    var kv = function (l, v) { return '<div class="dkv"><span>' + l + '</span><span>' + v + '</span></div>'; };
    return '<div class="dbk" data-a="pane"></div><aside class="dwr" aria-label="Details"><div class="dwr-h"><h2>Details</h2><button type="button" class="ibtn" data-a="pane" aria-label="Close details">' + ico('x') + '</button></div>' +
      '<section><h3>Contract</h3>' + kv('With', c + ', ' + esc(org(p))) + kv('Status', '<span class="badge ' + (signed ? 'released' : 'changes') + '">' + (signed ? 'Signed by both' : 'Waiting for signature') + '</span>') + '<div class="kb"><button type="button" class="btn outline sm" data-a="dlcontract" data-id="' + p.id + '">' + ico('download') + 'Download contract</button></div></section>' +
      '<section><h3>Money</h3>' + kv('Total', '<b class="mono">' + inr(tot) + '</b>') + kv('Received', '<b class="mono">' + inr(got) + '</b>') + kv('Not received yet', '<b class="mono">' + inr(Math.max(0, tot - got)) + '</b>') + '</section>' +
      '<section><h3>Terms</h3>' + kv('Client replies within', (p.reviewDays || 3) + ' days') + kv('Rounds of changes', (p.ms[0] ? p.ms[0].limit : 2)) + kv('Client pays within', (Number(p.payDays) || 7) + ' days of approving') + kv('Originals unlock', projMode(p) ? 'Once, at the end' : 'As each deliverable is paid') + '</section>' +
      '<section><h3>Activity</h3>' + (activityItems(p).map(function (x) { return '<div class="dact"><i></i><div>' + esc(x.text) + '<small>' + agoTxt(new Date(x.t).toISOString()) + '</small></div></div>'; }).join('') || '<p class="muted">Nothing yet.</p>') + '</section></aside>';
  }
  function sProject() {
    var p = P(); if (!p) { U.view = 'clients'; return sClients(); }
    var right = '<button type="button" class="btn outline sm" data-a="invite">' + ico('link') + 'Client link</button><button type="button" class="btn outline sm" data-a="role" data-r="client" title="See what ' + esc(first(p.client.name)) + ' sees">' + ico('eye') + 'View as ' + esc(first(p.client.name)) + '</button><button type="button" class="btn outline sm" data-a="pane" aria-pressed="' + paneOpen() + '">Details</button>';
    var head = '<div class="chd">' + avatarFor(p, true) + '<div><h1>' + esc(org(p)) + '</h1><span class="muted">' + esc(p.client.name) + '</span></div></div>';
    return shell('<button class="linkb" data-a="view" data-v="clients">Clients</button>' + ico('chev') + '<b>' + esc(org(p)) + '</b>', '<div class="pad tpg">' + head + timelineHTML(p) + '</div>' + detailsDrawer(p), right);
  }
  /* ---------------- client screens ---------------- */
  function clientTop(crumb) {
    var s = D.studio, c = P() ? P().client : { name: 'Guest' };
    return '<header class="hdr"><div class="crumbs"><span class="logo" style="font-size:var(--t2)">' + mark() + esc(s.biz) + '</span>' + (crumb ? ico('chev') + crumb : '') + '</div><div class="acts2"><span class="muted" style="font-size:var(--t1)">' + esc(c.name) + '</span>' + (P() ? avatarFor(P()) : '') + '</div></header>';
  }
  /* The client's side panel: who it's from, the project, the agreed terms and dates. */
  function cSide(p, terms) {
    var s = D.studio, tot = p.ms.reduce(function (a, m) { return a + m.amount; }, 0), m0 = p.ms[0] || {}, nx = nextEvents(3);
    var fr = function (l, v) { return '<div class="frow2"><span>' + l + '</span><span>' + v + '</span></div>'; }, sec = function (t, open) { return '<details class="dsec"' + (open ? ' open' : '') + '><summary>' + ico('chev') + t + '</summary>'; };
    return '<div class="who2"><span class="logo-av big" style="--c:' + BRANDS[s.brand] + '"><b>' + esc(initials(s.biz)) + '</b></span><div style="min-width:0"><div class="t">' + esc(s.biz) + '</div><div class="muted" style="font-size:var(--t2);margin-top:2px">' + esc(s.name) + '</div></div></div>' +
      sec('Project', true) + fr('Total', '<span class="mono">' + inr(tot) + '</span>') + fr('Deliverables', p.ms.length) + (advPct(p) ? fr('Advance', advPct(p) + '% · ' + inr(advAmt(p)) + (p.advancePaid ? ' · paid' : '')) : '') + fr('Originals unlock', projMode(p) ? 'Once, after all deliverables' : 'After each deliverable is paid') + '</details>' +
      (terms ? sec('Terms') + fr('Client replies within', (p.reviewDays || 3) + ' days') + fr('If no reply', autoTxt(p)) + fr('Rounds of changes', (m0.limit || 2) + ' per deliverable') + fr('Extra round', Number(p.extraFee) ? inr(p.extraFee) : 'Free') + '</details>' : '') +
      sec('Next up') + (nx.length ? nx.map(function (x) { return fr(long(x.date), esc(x.label)); }).join('') : '<p class="muted" style="padding:0 8px;font-size:var(--t2)">Nothing coming up.</p>') + '</details>';
  }
  /* The Contract tab: the agreement itself, who has signed, and a way to take it away. No second "view" step. */
  function contractView(p) {
    var cl = p.contract, fOk = !cl || !!cl.fSig, cOk = contractOk(p), fn = esc(first(D.studio.name)), cn = esc(first(p.client.name));
    return '<div class="ctabhead"><div class="csigstate"><span class="badge ' + (fOk ? 'released' : 'draft') + '">' + fn + (fOk ? ' signed' : ': not signed') + '</span><span class="badge ' + (cOk ? 'released' : 'draft') + '">' + cn + (cOk ? ' signed' : ': waiting to sign') + '</span></div><button class="btn outline sm" data-a="dlcontract" data-id="' + p.id + '">' + ico('download') + 'Download PDF</button></div>' + contractHTML(p);
  }
  var CONTRACT_CSS = '@page{margin:16mm}body{font:14px/1.6 -apple-system,Segoe UI,Inter,sans-serif;color:#27272a;margin:0}.contract{display:grid;gap:20px;max-width:760px;margin:0 auto}.chead img{max-width:100%;max-height:110px}h2{font-size:24px;margin:4px 0}h3{font-size:15px;margin:0 0 6px;color:#18181b}.lbl{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#71717a;margin:0}.muted{color:#71717a}.cparties{display:grid;grid-template-columns:1fr 1fr;gap:12px}.cparties>div{display:grid;gap:2px;padding:12px;border-radius:8px;background:#f4f4f5}ul{margin:0;padding-left:20px}p{margin:0 0 6px}table{width:100%;border-collapse:collapse}th,td{text-align:left;vertical-align:top;padding:8px 6px;border-bottom:1px solid #e4e4e7}.amt{text-align:right;white-space:nowrap}tfoot td{font-weight:600;border-bottom:0}.csigs{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:8px;break-inside:avoid}.sigbox{display:grid;gap:6px}.sig-empty,.sig-done{height:64px;border-bottom:1.5px solid #3f3f46;display:flex;align-items:flex-end;padding-bottom:4px}.sig-done img{max-height:56px}.sig-type{font-family:"Snell Roundhand","Segoe Script","Brush Script MT",cursive;font-size:28px;color:#1d2a4d}.sigmeta{display:flex;justify-content:space-between;font-size:12px;color:#52525b}.cfine{font-size:12px}section{break-inside:avoid}';
  var SHEET_CSS = '.sheet{border:1px solid #d4d4d8;border-radius:10px;padding:20px;margin:0 auto 20px;max-width:520px;position:relative}.sheet h4{margin:0 0 4px;font-size:18px}.sheet .mt{font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:#71717a}.sheet .ln{display:flex;justify-content:space-between;gap:16px;padding:4px 0;font-size:13px}.sheet .ln.t{font-weight:700;border-top:1px solid #d4d4d8;margin-top:4px;padding-top:8px}.sheet hr{border:0;border-top:1px dashed #d4d4d8;margin:10px 0}.sheet .stamp{position:absolute;right:16px;top:16px;border:2px solid #15803d;color:#15803d;padding:2px 8px;border-radius:6px;font-weight:700;font-size:12px;letter-spacing:.08em;transform:rotate(-6deg)}.pb{break-after:page}';
  function printDoc(title, inner) {
    var doc = '<!doctype html><html><head><meta charset="utf-8"><title>' + esc(title) + '</title><style>' + CONTRACT_CSS + SHEET_CSS + '</style></head><body>' + inner + '</body></html>';
    var fr = document.createElement('iframe'); fr.setAttribute('aria-hidden', 'true'); fr.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0'; document.body.appendChild(fr);
    fr.onload = function () { setTimeout(function () { try { fr.contentWindow.focus(); fr.contentWindow.print(); } catch (er) { toast('hello', 'Couldn\'t open the print dialog', 'Try again, or use your browser\'s print and choose Save as PDF.'); } setTimeout(function () { fr.remove(); }, 4000); }, 300); };
    fr.srcdoc = doc; toast('thumbs', 'Preparing your document', 'Choose Save as PDF in the print window.');
  }
  function docPack(m, p, which) {
    var parts = { summary: function () { return sheetHTML(m, p, 'summary'); }, invoice: function () { return sheetHTML(m, p, 'invoice'); }, contract: function () { return contractHTML(p); } };
    var keys = which === 'all' ? ['summary', 'invoice', 'contract'] : [which];
    return keys.map(function (k, i) { return '<div' + (i < keys.length - 1 ? ' class="pb"' : '') + '>' + parts[k]() + '</div>'; }).join('');
  }
  function printContract(p) { printDoc('Contract - ' + p.name, contractHTML(p)); }
  /* letterheads can be wide, so keep up to 1200px across and compress */
  function readHeader(file, cb) {
    var r = new FileReader(); r.onload = function () { var img = new Image(); img.onload = function () { var k = Math.min(1, 1200 / img.width), c = document.createElement('canvas'); c.width = Math.max(1, Math.round(img.width * k)); c.height = Math.max(1, Math.round(img.height * k)); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); cb(c.toDataURL('image/png')); }; img.onerror = function () { toast('hello', 'That image couldn\'t be read', 'Try a PNG or JPG.'); }; img.src = r.result; }; r.readAsDataURL(file);
  }
  function tplCard() {
    var c = S().contract;
    return '<div class="tplcard"><div class="tplrow"><div class="tplprev">' + (c.header ? '<img src="' + c.header + '" alt="Your letterhead">' : '<span class="muted">No letterhead yet</span>') + '</div><div class="tplbtns"><button type="button" class="btn outline sm" data-a="pickhdr">' + ico('upload') + (c.header ? 'Change header' : 'Upload your header') + '</button>' + (c.header ? '<button type="button" class="btn ghost sm" data-a="rmhdr">Remove</button>' : '') + '</div><input type="file" id="hdrfile" accept="image/*" hidden></div>' +
      '<div class="field"><label for="s-cfoot">Footer line <span class="muted" style="font-weight:400">(optional)</span></label><input class="input" id="s-cfoot" data-s="contract.footer" autocomplete="off" placeholder="e.g. Registered address, GSTIN, website" value="' + esc(c.footer || '') + '"></div>' +
      '<div class="field"><label for="s-cextra">Your own clauses <span class="muted" style="font-weight:400">(optional, one per line)</span></label><textarea class="textarea" id="s-cextra" data-s="contract.extra" rows="3" placeholder="e.g. Work is delivered in English. Travel is billed separately.">' + esc(c.extra || '') + '</textarea></div></div>';
  }
  function sContractF() {
    var d = U.draft, p = draftAsProject(d), cn = esc(first(d.cname) || 'your client');
    var c = contractHTML(p, { fSig: null, cSig: null, fBlock: sigPadHTML(D.studio.name, { noAgree: true, title: 'Freelancer · sign here' }), tail: '<div class="cread">' + agreeLine() + '</div>' });
    var main = '<div class="pad formcol cwide"><div><p class="lbl">Last step</p><h1 class="h1" style="margin-top:2px">Review and sign the contract</h1><p class="muted" style="margin-top:6px">Built from what you just entered. Sign it and we send it to ' + cn + ' with the link. Work starts once you have both signed.</p></div>' + c +
      '<div class="dfoot" style="justify-content:flex-start;gap:12px"><button class="btn lg" data-a="signsend" ' + (sigReady() ? '' : 'disabled') + '>Sign and send to ' + cn + '</button><button class="btn ghost" data-a="backplan">Back to edit</button></div></div>';
    return shell('<button class="linkb" data-a="backplan">New project</button>' + ico('chev') + '<b>Contract</b>', main, '<button class="btn ghost sm" data-a="backplan">Back to edit</button>');
  }
  function cSteps(cur) {
    return '<ol class="pstepper" aria-label="Steps">' + [['The work'], ['The contract']].map(function (x, i) { var st = i === cur ? 'on' : i < cur ? 'done' : ''; return '<li class="' + st + '"><span class="pn">' + (i < cur ? ico('check', '') : (i + 1)) + '</span><b style="font-weight:500">' + x[0] + '</b></li>'; }).join('<li class="pline" aria-hidden="true"></li>') + '</ol>';
  }
  function cContract() {
    var p = P(), cn = esc(first(p.client.name)), fn = esc(first(D.studio.name)), adv = advDue(p);
    var c = contractHTML(p, { cBlock: sigPadHTML(p.client.name, { noAgree: true, title: 'Client · sign here' }), tail: '<div class="cread">' + agreeLine() + '</div>' });
    var main = '<div class="pad formcol cwide"><div class="pst-h" style="padding-top:0">' + cSteps(1) + '</div><div><h1 class="h1" style="margin-top:2px">The contract</h1><p class="muted" style="margin-top:6px">Read it through, then sign. ' + fn + ' has already signed.</p></div>' + c +
      '<div class="dfoot" style="justify-content:flex-start;gap:12px"><button class="btn lg" data-a="signc" ' + (sigReady() ? '' : 'disabled') + '>' + (adv ? 'Sign and pay ' + inr(advAmt(p)) + ' to start' : 'Sign and continue') + '</button><button class="btn ghost" data-a="closecontract">Back</button></div></div>';
    return '<div class="capp" ' + brandStyle() + '>' + clientTop('<b>' + esc(p.name) + '</b>') + '<div class="body"><div class="detail solo"><div class="dmain">' + main + '</div></div></div></div>';
  }
  function cEmpty() {
    return '<div class="clientwrap" ' + brandStyle() + '><div class="topbar"><span class="logo">' + mark() + 'PayGuard</span></div><div class="centerpage" style="background:var(--bg)"><div class="celebrate" style="max-width:420px;padding-top:48px">' + buddy('hello', 120) + '<h1 class="h1">Nothing shared with you yet</h1><p class="muted">Project links you receive open here.</p><button class="btn" data-a="role" data-r="freelancer">Back to ' + esc(first(D.studio.name)) + '</button></div></div></div>';
  }
  function payTerms(p, fn) {
    var out = [];
    out.push('<li>You and ' + fn + ' sign a contract first. Then work starts.</li>');
    if (advPct(p) > 0) out.push('<li>' + fn + ' asks for a ' + advPct(p) + '% advance (' + inr(advAmt(p)) + ') before starting. It goes straight to ' + fn + '.</li>');
    out.push('<li>Review each preview within ' + (p.reviewDays || 3) + ' days.' + (p.autoDays ? ' If you don\'t reply, it\'s approved automatically on day ' + ((Number(p.reviewDays) || 3) + Number(p.autoDays)) + '.' : '') + '</li>');
    out.push(projMode(p) ? '<li>Once every deliverable is approved, you pay the balance once. All the original files unlock.</li>' : '<li>After you approve a deliverable, you pay for it and its original files unlock.</li>');
    out.push('<li>Pay by UPI, QR code or card, within ' + (Number(p.payDays) || 7) + ' days of approving. The money goes straight to ' + fn + '.</li>');
    out.push('<li>' + (p.ms[0] ? p.ms[0].limit : 2) + ' round' + ((p.ms[0] ? p.ms[0].limit : 2) > 1 ? 's' : '') + ' of changes per deliverable. ' + (Number(p.extraFee) ? 'An extra round costs ' + inr(p.extraFee) + '.' : 'Extra rounds are free.') + '</li>');
    out.push('<li>If something\'s wrong, report a problem. Approval is on hold until it\'s sorted.</li>');
    return out.join('');
  }
  function cInvite() {
    var p = P(), s = D.studio, fn = esc(first(s.name)), n = ms().length, tot = totalOf(p), adv = advAmt(p), pct = advPct(p);
    var split = '<div class="card csplit">' + pieHTML(pct, 56) + '<div><div class="lbl">The money</div>' + (pct ? '<div><b class="mono">' + inr(adv) + '</b> <span class="muted">to start (' + pct + '%)</span></div>' : '<div class="muted">Nothing to pay before work starts.</div>') + '<div><b class="mono">' + inr(tot - adv) + '</b> <span class="muted">' + (projMode(p) ? 'once every deliverable is approved' : 'as you approve each deliverable') + '</span></div></div><div class="ctot"><span class="lbl">Total</span><b class="mono">' + inr(tot) + '</b></div></div>';
    var main = '<div class="pad formcol"><div class="pst-h" style="padding-top:0">' + cSteps(0) + '</div><div><p class="lbl">From ' + esc(s.name) + '</p><h1 class="h1" style="margin-top:2px">' + esc(p.name) + '</h1><p class="muted" style="margin-top:6px">Hi ' + esc(first(p.client.name)) + ', here\'s the work ' + fn + ' will do for you.</p></div>' +
      '<div class="card"><div class="card-h"><h3>' + n + ' deliverable' + (n > 1 ? 's' : '') + '</h3></div><div style="margin-top:8px">' + msRows({ scope: true }) + '</div></div>' + split +
      '<div><button class="btn lg" data-a="opencontract">Continue to the contract ' + ico('chev') + '</button><p class="muted" style="font-size:var(--t1);margin-top:8px">No account needed. <button type="button" class="linkb" data-a="howtgl">How does this work?</button></p></div>' +
      (U.how ? '<div class="card" style="padding:16px 20px"><ul class="plain">' + payTerms(p, fn) + '</ul></div>' : '') + '</div>';
    return '<div class="capp" ' + brandStyle() + '>' + clientTop('<b>' + esc(p.name) + '</b>') + '<div class="body"><div class="detail solo"><div class="dmain">' + main + '</div></div></div></div>';
  }
  /* what the client is paying right now: the advance, or the balance for a stage (or the whole project) */
  function payTarget() {
    var p = P(), s = D.studio;
    if (U.checkout === 'advance') return { kind: 'advance', amount: advAmt(p), title: 'Pay your advance', name: p.name, sub: advPct(p) + '% of ' + inr(totalOf(p)), lines: [[advPct(p) + '% advance on ' + inr(totalOf(p)), inr(advAmt(p))]], what: p.ms.map(function (m) { return m.name + ' · ' + inr(m.amount); }) };
    var m = getMs(U.checkout), amt = payAmt(m, p), list = projMode(p) ? p.ms.filter(function (x) { return x.status === 'approved'; }) : [m], adv = list.reduce(function (t, x) { return t + (x.amount - balOf(x, p)); }, 0), full = list.reduce(function (t, x) { return t + x.amount; }, 0);
    return { kind: 'balance', m: m, amount: amt, title: projMode(p) ? 'Pay the balance for the whole project' : 'Pay for deliverable ' + (p.ms.indexOf(m) + 1) + ' of ' + p.ms.length, name: projMode(p) ? p.name : m.name, sub: 'The original files unlock when you pay',
      lines: [[projMode(p) ? 'All deliverables' : m.name, inr(full)]].concat(adv ? [['Advance already paid', '−' + inr(adv)]] : []), what: list.map(function (x) { return x.name; }) };
  }
  function cCheckout() {
    var p = P(), tg = payTarget(), s = D.studio, fn = esc(first(s.name)), ok = tg.kind === 'balance' || !!U.scopeOk, pm = U.payM || 'upi', upi = (S().payout.upi || 'meera@okaxis').trim(), fx = U.fieldErr || {}, PF = U.payF || {}, cn0 = PF.cnum != null ? PF.cnum : '4242 4242 4242 4242';
    return '<div class="clientwrap" ' + brandStyle() + '>' + clientTop() + '<div class="centerpage" style="background:var(--bg)"><div class="pay2"><div class="stack" style="gap:16px;align-content:start"><button class="btn ghost sm" data-a="backcheckout" style="justify-self:start">‹ Back</button><div><p class="lbl">' + esc(tg.title) + '</p><h1 class="h1">' + esc(tg.name) + '</h1></div><p class="mono" style="font-size:var(--t6);font-weight:600;line-height:1.1;color:var(--ink-gray-9)">' + inr(tg.amount) + '</p>' +
      '<div class="card" style="padding:16px"><div class="kv">' + tg.lines.map(function (l) { return '<div><span class="muted">' + esc(l[0]) + '</span><span class="mono">' + l[1] + '</span></div>'; }).join('') + '<div class="tot"><span>You pay ' + fn + '</span><span class="mono">' + inr(tg.amount) + '</span></div></div></div>' +
      (tg.kind === 'advance' ? '<div class="scopebox"><span class="lbl">The plan</span><ul class="scope">' + tg.what.map(function (x) { return '<li><span>' + esc(x) + '</span></li>'; }).join('') + '</ul><label class="check" style="margin-top:12px"><input type="checkbox" id="scopeok" ' + (U.scopeOk ? 'checked' : '') + '><span>I agree to the plan and what each deliverable includes.</span></label></div>' : '<div class="scopebox"><span class="lbl">Unlocks</span><ul class="scope tick">' + tg.what.map(function (x) { return '<li>' + ico('check', 'tk') + '<span>' + esc(x) + ' · original files</span></li>'; }).join('') + '</ul></div>') +
      '<ul class="plain muted"><li>' + (tg.kind === 'advance' ? 'This is paid straight to ' + fn + ' so they can start.' : 'The original files unlock as soon as the payment is confirmed.') + '</li><li>The money goes straight to ' + fn + '\'s account.</li></ul></div>' +
      '<form class="card" id="payform" style="padding:24px;display:grid;gap:14px;align-content:start"><div class="alert" style="align-items:center" role="note"><div><b>Test mode</b><span>No real money moves in this prototype. Payments are simulated.</span></div></div>' + (U.payErr ? '<div class="alert" style="background:var(--err-bg);border-color:transparent;color:var(--err);align-items:center" role="alert">' + ico('x', '') + '<div><b>' + esc(U.payErr) + '</b><span>You weren\'t charged. Try again or use another way to pay.</span></div></div>' : '') +
      '<div class="field"><label for="em">Receipt email</label><input class="input' + (fx.em ? ' bad' : '') + '" id="em" type="email" autocomplete="email" value="' + esc(PF.em != null ? PF.em : p.client.email) + '">' + (fx.em ? '<span class="hint-err">' + fx.em + '</span>' : '') + '</div>' +
      '<div class="field"><label>How would you like to pay?</label><div class="seg pm" role="group" aria-label="Payment method">' + [['upi', 'UPI', 'upi'], ['qr', 'QR code', 'qr'], ['card', 'Card', 'card']].map(function (x) { return '<button type="button" data-a="paym" data-k="' + x[0] + '" aria-pressed="' + (pm === x[0]) + '">' + BK[x[2]] + x[1] + '</button>'; }).join('') + '</div></div>' +
      (pm === 'upi' ? '<div class="field"><label for="upi">Your UPI ID</label><div class="inl">' + BK.upi + '<input class="input' + (fx.upi ? ' bad' : '') + '" id="upi" autocomplete="off" inputmode="email" placeholder="name@bank" value="' + esc(U.upiId || '') + '"></div>' + (fx.upi ? '<span class="hint-err">' + fx.upi + '</span>' : '<span class="hint">You\'ll get a request in your UPI app. Approve it there to pay ' + fn + '.</span>') + '</div>'
        : pm === 'qr' ? '<div class="qrwrap"><div class="qrbox" id="qrbox" data-v="' + esc('upi://pay?pa=' + upi + '&pn=' + encodeURIComponent(s.biz) + '&am=' + tg.amount.toFixed(2) + '&cu=INR&tn=' + encodeURIComponent(tg.name)) + '"></div><div class="qrtxt"><b>Scan with any UPI app</b><span class="muted">Open any UPI app, scan, and pay ' + inr(tg.amount) + ' to ' + esc(upi) + '.</span>' + APPS + '<span class="muted"><p class="qrstat"><i class="fb-spin"></i>Waiting for payment…</p><p class="hint">This code is made from ' + fn + '\'s UPI ID. In the prototype, no money moves.</p></div></div>'
        : '<div class="field"><label for="cnum">Card number <span class="muted" style="font-weight:400">(credit or debit)</span></label><div class="inl"><span id="cbrand" class="cb">' + (BK[cardBrand(cn0)] || BK.card) + '</span><input class="input mono' + (fx.cnum ? ' bad' : '') + '" id="cnum" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" value="' + esc(cardFmt(cn0, cardBrand(cn0))) + '"></div>' + (fx.cnum ? '<span class="hint-err">' + fx.cnum + '</span>' : '') + '<div class="accepts" aria-label="Accepted cards">' + ['visa', 'mc', 'rupay', 'amex'].map(function (b) { return BK[b].replace('<svg class="bk"', '<svg class="bk' + (cardBrand(cn0) && cardBrand(cn0) !== b ? ' dim' : '') + '" data-b="' + b + '"'); }).join('') + '</div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div class="field"><label for="ex">Expiry</label><input class="input mono' + (fx.ex ? ' bad' : '') + '" id="ex" inputmode="numeric" autocomplete="cc-exp" placeholder="MM / YY" value="' + esc(PF.ex != null ? PF.ex : '09 / 29') + '">' + (fx.ex ? '<span class="hint-err">' + fx.ex + '</span>' : '') + '</div><div class="field"><label for="cv">CVC</label><input class="input mono' + (fx.cv ? ' bad' : '') + '" id="cv" inputmode="numeric" autocomplete="cc-csc" placeholder="123" value="' + esc(PF.cv != null ? PF.cv : '123') + '">' + (fx.cv ? '<span class="hint-err">' + fx.cv + '</span>' : '') + '</div></div>') +
      (pm === 'qr' ? '<button type="button" class="btn lg outline block" id="paybtn" data-a="simqr" ' + (U.busy || !ok ? 'disabled' : '') + '>' + (U.busy ? 'Confirming…' : 'Prototype: simulate the payment') + '</button>' : '<button type="submit" class="btn lg block" id="paybtn" data-a="pay" ' + (U.busy || !ok ? 'disabled' : '') + '>' + (U.busy ? 'Paying…' : pm === 'upi' ? 'Send request for ' + inr(tg.amount) : 'Pay ' + inr(tg.amount)) + '</button>') +
      '<p class="hint" id="payhint"' + (ok ? ' hidden' : '') + '>Agree to the plan to continue.</p><p class="reassure">' + ico('shield', '') + '<span>' + (pm === 'card' ? 'Card details go straight to the payment provider. Nobody else sees them.' : 'You approve the payment in your own UPI app. Nobody else sees your PIN.') + ' By paying you accept the terms.</span></p></form></div></div></div>';
  }
  function payInput(t) {
    var F = U.payF = U.payF || {}, id = t.id;
    if (id === 'cnum') { var b = cardBrand(t.value); t.value = cardFmt(t.value, b); var bk = document.getElementById('cbrand'); if (bk) bk.innerHTML = BK[b] || BK.card; document.querySelectorAll('.accepts .bk').forEach(function (x) { x.classList.toggle('dim', !!b && x.dataset.b !== b); }); }
    if (id === 'ex') t.value = expFmt(t.value);
    if (id === 'cv') t.value = t.value.replace(/\D/g, '').slice(0, 4);
    F[id] = t.value; if (id === 'upi') U.upiId = t.value;
    t.classList.remove('bad'); var h = t.parentNode.querySelector('.hint-err') || (t.parentNode.parentNode && t.parentNode.parentNode.querySelector('.hint-err[data-f="' + id + '"]')); if (h) h.remove(); if (U.fieldErr) delete U.fieldErr[id];
  }
  function lockedPreview(m) {
    var its = items(m), fi = Math.min(U.fi || 0, its.length - 1), cur = its[fi];
    return (its.length > 1 ? '<div class="tabs" role="tablist">' + its.map(function (f, i) { return '<button role="tab" data-a="file" data-i="' + i + '" aria-selected="' + (i === fi) + '">' + esc(f.name) + '</button>'; }).join('') + '</div>' : '') + (cur ? previewStage(cur, false) : '');
  }
  function cProject() {
    var p = P(), m = focusMs(), s = D.studio, fn = esc(first(s.name)), body = '', decide = '';
    var issue = '<button class="linkb" data-a="askissue" data-id="' + m.id + '">Report a problem</button>';
    var hero = function (inner) { return '<div class="card hero" style="grid-template-columns:minmax(0,1fr)"><div>' + inner + '</div></div>'; };
    if (m.status === 'draft') {
      var first0 = p.ms[0] === m;
      body = first0 && advDue(p) ? hero('<span class="badge draft">Advance due</span><h3>Pay ' + inr(advAmt(p)) + ' to start</h3><p class="muted">' + fn + ' starts once the ' + advPct(p) + '% advance is paid. It goes straight to ' + fn + '.</p>' + scopeBox(m, null, true) + '<div class="acts"><button class="btn lg" data-a="gocheckout" data-id="advance">Pay ' + inr(advAmt(p)) + ' advance</button></div>')
        : hero('<span class="badge draft">Not started</span><h3>' + esc(m.name) + '</h3><p class="muted">' + fn + ' starts this deliverable after the previous one is unlocked. Due ' + long(parse(m.due)) + '.</p>' + scopeBox(m, null, true));
    } else if (m.status === 'funded' || m.status === 'changes') {
      body = hero('<span class="badge ' + (m.status === 'changes' ? 'changes' : 'funded') + '">' + (m.status === 'changes' ? 'Changes requested' : 'In progress') + '</span><h3>' + esc(m.name) + '</h3><p class="muted">' + (m.status === 'changes' ? 'Changes in progress · round ' + m.revisions + ' of ' + m.limit + '.' : fn + ' is working on it · due ' + long(parse(m.due)) + '.') + '</p>' + (m.status === 'changes' && m.notes.length ? '<div class="note" style="margin:16px 0 0;background:var(--muted);color:var(--fg)"><b>Your note</b>' + esc(m.notes[m.notes.length - 1].text) + '</div>' : '') + (m.reply ? '<div class="note" style="margin:12px 0 0;background:var(--muted);color:var(--fg)"><b>' + fn + '\'s reply</b>' + esc(m.reply) + '</div>' : '') + scopeBox(m) + '<div class="acts" style="align-items:center;gap:16px">' + issue + '</div>');
    } else if (m.status === 'dispute') {
      var dr = m.dispute || {}, by = issueBy(m);
      body = hero('<span class="badge dispute">On hold</span><h3>You reported a problem</h3><p class="muted">Approval is on hold. ' + (days(by) >= 0 ? fn + ' has until ' + long(by) + ' to reply.' : 'The reply window has passed. You can follow up with ' + fn + '.') + '</p><div class="note" style="margin:16px 0 0;background:var(--err-bg);color:var(--err)"><b>' + esc(REASONS[dr.reason] || 'Problem reported') + '</b>' + esc(dr.note) + '</div>' + scopeBox(m) + '<div class="acts"><button class="btn outline" data-a="withdraw" data-id="' + m.id + '">Withdraw</button></div>');
    } else if (m.status === 'submitted') {
      var rb = replyBy(m), aa = autoAt(p, m), left = m.limit - m.revisions, late = days(rb) < 0, xa = Number(p.extraFee) || 0, its = items(m), fi = Math.min(U.fi || 0, its.length - 1), cur = its[fi];
      var changeBtn = left > 0 ? '<button class="btn lg outline block" data-a="askchanges" data-id="' + m.id + '">Ask for changes (' + left + ' left)</button>' : '<button class="btn lg outline block" data-a="askextra" data-id="' + m.id + '">Add a change round · ' + (xa ? inr(xa) : 'free') + '</button><p class="hint">All included rounds used.</p>';
      body = '<div class="ph"><div><p class="lbl">Deliverable ' + (ms().indexOf(m) + 1) + ' of ' + ms().length + '</p><h2 class="h1" style="font-size:var(--t4)">' + esc(m.name) + '</h2></div><span class="badge submitted">Awaiting your approval</span></div>' +
        '<div class="alert">' + ico('lock', '') + '<div><b>Preview only</b><span class="muted">The original files unlock when you approve and pay.</span></div></div>' +
        (m.deliveryNote ? '<div class="note" style="background:var(--muted);color:var(--fg)"><b>Note from ' + fn + '</b>' + esc(m.deliveryNote) + '</div>' : '') + lockedPreview(m);
      decide = '<div class="decide"><div><p class="muted">Please reply by</p><p style="font-size:var(--t4);font-weight:600;line-height:1.25;color:var(--ink-gray-9)">' + long(rb) + '</p><p class="muted" style="font-size:var(--t1)">' + (late ? 'That date has passed.' : rel(rb).charAt(0).toUpperCase() + rel(rb).slice(1) + '.') + (aa ? (late ? ' It\'s approved automatically on ' : ' If you don\'t reply, it\'s approved automatically on ') + long(aa) + (late ? ' unless you reply.' : '.') : '') + '</p></div>' +
        (m.scope && m.scope.length ? '<div><p class="lbl">What\'s included</p>' + scopeList(m.scope, 'tick') + '</div>' : '') +
        '<div style="display:grid;gap:8px"><button class="btn lg block" data-a="askapprove" data-id="' + m.id + '">Approve</button>' + changeBtn + '</div>' +
        '<div class="reassure">' + ico('shield', '') + '<span>After you approve, you pay ' + inr(payAmt(m, p) || balOf(m, p)) + ' to ' + fn + ' and the original files unlock. Something wrong? ' + issue + '</span></div></div>';
    } else if (m.status === 'approved') {
      var cp = canPay(m, p), pb = payBy(m, p);
      body = hero('<span class="badge approved">Awaiting payment</span><h3>' + (cp ? 'Pay ' + inr(payAmt(m, p)) + ' to unlock the originals' : esc(m.name) + ' is approved') + '</h3><p class="muted">' + (cp ? 'Pay by ' + long(pb) + '. The money goes straight to ' + fn + ' and the original files unlock right away.' : 'You\'ll pay once, after the last deliverable is approved. Then every original file unlocks.') + '</p><div class="acts">' + (cp ? '<button class="btn lg" data-a="gocheckout" data-id="' + m.id + '">Pay ' + inr(payAmt(m, p)) + '</button>' : '') + '</div>') +
        '<div class="card" style="margin-top:16px"><div class="card-h"><h3>Preview</h3><span class="muted" style="font-size:var(--t1)">Locked until you pay</span></div><div style="padding:16px 20px 20px">' + lockedPreview(m) + '</div></div>';
    } else if (m.status === 'refunded') {
      body = hero('<span class="badge refunded">Closed</span><h3>' + esc(m.name) + '</h3><p class="muted">This deliverable was closed.</p>');
    } else {
      var nx = currentMs();
      body = hero('<span class="badge released">Unlocked</span><h3>' + esc(m.name) + '</h3><p class="muted">' + (m.paidHow === 'free' ? fn + ' unlocked the original files for you.' : 'Paid. The original files are unlocked.') + '</p><p class="muted" style="margin-top:8px">' + (nx && nx.id !== m.id ? 'Next up: ' + esc(nx.name) + ', due ' + long(parse(nx.due)) + '. ' + (nx.status === 'draft' ? fn + ' starts it soon.' : fn + ' is working on it.') : 'That was the last deliverable. Thank you.') + '</p><div class="acts"><button class="btn outline" data-a="dlall" data-id="' + m.id + '">' + ico('download') + 'Download all</button><button class="btn outline" data-a="receipt" data-id="' + m.id + '">' + ico('file') + 'Documents</button><button class="btn outline" data-a="dldoc" data-id="' + m.id + '" data-pid="' + p.id + '" data-t="all">' + ico('download') + 'Receipt and contract</button>' + (nx && nx.id !== m.id ? '<button class="btn" data-a="selms" data-id="' + nx.id + '">Next: ' + esc(nx.name) + ' ' + ico('chev') + '</button>' : '') + '</div>') +
        '<div class="card"><div class="card-h"><h3>Your files</h3></div><div class="files" style="padding:16px 20px 20px">' + items(m).map(function (f) { var u = fileUrl(f); if (f.kind === 'link') return '<div class="file"><span class="ic">' + fileTag(f) + '</span><div style="min-width:0"><div class="nm">' + esc(f.name) + '</div><div class="muted" style="font-size:var(--t1)">' + esc(f.size) + '</div></div><a class="btn outline sm" href="' + esc(f.url) + '" target="_blank" rel="noopener noreferrer">Open link</a></div>'; return '<div class="file"><span class="ic">' + fileTag(f) + '</span><div style="min-width:0"><div class="nm">' + esc(f.name) + '</div><div class="muted" style="font-size:var(--t1)">' + esc(f.size) + ' · original</div></div>' + (u ? '<a class="btn outline sm" href="' + esc(u) + '" download="' + esc(f.name) + '">' + ico('download') + 'Download</a>' : '<button class="btn outline sm" data-a="dl" data-n="' + esc(f.name) + '">' + ico('download') + 'Download</button>') + '</div>'; }).join('') + '</div></div>';
      if (!nx) body += '<div class="alert" style="background:var(--ok-bg);border-color:transparent;color:var(--ok)"><div><b>All deliverables unlocked.</b></div></div>';
    }
    var ct = U.ct || 'cur';
    var tabs = '<div class="ttabs" role="tablist">' + [['cur', m.status === 'submitted' ? 'Review' : 'Current deliverable'], ['all', 'All deliverables'], ['contract', 'Contract']].map(function (t) { return '<button role="tab" data-a="ctab" data-t="' + t[0] + '" aria-selected="' + (ct === t[0]) + '">' + t[1] + (t[0] === 'all' ? '<span class="cnt">' + ms().length + '</span>' : '') + '</button>'; }).join('') + '</div>';
    var inner = ct === 'contract' ? contractView(p) : ct === 'all' ? '<div class="card">' + msRows({ scope: true, go: true }) + '</div>' : body;
    return '<div class="capp" ' + brandStyle() + '>' + clientTop('<b>' + esc(p.name) + '</b>') + '<div class="body"><div class="detail"><div class="dmain">' + tabs + '<div class="pad">' + (ct === 'cur' ? stageLine(p, m) : '') + inner + (ct === 'cur' ? feedbackCard(m, p) : '') + '</div></div><aside class="dside"><div class="dside-in">' + decide + cSide(p, true) + '</div></aside></div></div></div>';
  }

  /* ---------------- modals ---------------- */
  /* Reminders go out through the freelancer's own WhatsApp or email, prefilled for the situation. */
  function remindText(p, a) {
    var c = first(p.client.name), f = first(D.studio.name), link = 'payguard.app/p/' + p.id, m = currentMsOf(p) || p.ms[p.ms.length - 1];
    if (a && (a.kind === 'invite' || a.kind === 'sign')) return 'Hi ' + c + ', here\'s the contract for ' + p.name + '. Have a look and sign it so we can start: ' + link + '\n\nThanks, ' + f;
    if (a && a.kind === 'pay') return 'Hi ' + c + ', ' + m.name + ' is approved. Once you pay ' + inr(payAmt(m, p)) + ' I\'ll unlock the original files: ' + link + '\n\nThanks, ' + f;
    if (a && a.kind === 'approve') return 'Hi ' + c + ', ' + m.name + ' is ready to review. Please approve or ask for changes by ' + long(replyBy(m)) + ': ' + link + '\n\nThanks, ' + f;
    if (a && a.kind === 'fund') return 'Hi ' + c + ', a quick reminder about the ' + inr(advAmt(p)) + ' advance for ' + p.name + ' so I can start: ' + link + '\n\nThanks, ' + f;
    return 'Hi ' + c + ', an update on ' + p.name + ': ' + link + '\n\nThanks, ' + f;
  }
  function remindHref(cl, ch, msg, p) {
    return ch === 'wa' ? 'https://wa.me/' + String(cl.phone || '').replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent(msg)
      : 'mailto:' + encodeURIComponent(cl.email || '') + '?subject=' + encodeURIComponent(p.name + ' · ' + D.studio.biz) + '&body=' + encodeURIComponent(msg);
  }
  function modalHTML() {
    var o = U.modal; if (!o) return '';
    var body = '', wide = false, fn = esc(first(D.studio.name)), fc = P() ? esc(first(P().client.name)) : '';
    if (o.t === 'invite') {
      var link = 'payguard.app/p/' + P().id;
      body = '<div><h2>' + (o.created ? 'Project created' : 'Client link') + '</h2><p class="muted">Share this link with ' + fc + '. No account needed.</p></div><div class="linkbox"><input class="input" readonly value="' + esc(link) + '" aria-label="Client link"><button class="btn outline" data-a="copylink" data-v="' + esc(link) + '">' + ico('copy') + 'Copy</button></div><div class="dfoot"><button class="btn outline" data-a="remind" data-id="' + P().id + '">Send by WhatsApp or email</button><button class="btn" data-a="role" data-r="client">View as ' + fc + ' ' + ico('chev') + '</button></div>';
    } else if (o.t === 'remind') {
      var pr = getP(o.pid), cl = pr.client, ch = o.ch || (cl.phone ? 'wa' : 'email'), msg = o.msg != null ? o.msg : remindText(pr, attentionFor(pr)); o.ch = ch; o.msg = msg;
      body = '<div><h2>Remind ' + esc(first(cl.name)) + '</h2><p class="muted">' + esc(org(pr)) + ' · ' + esc(pr.name) + '</p></div>' +
        '<div class="seg" role="group" aria-label="Send by"><button type="button" data-a="rch" data-c="wa" aria-pressed="' + (ch === 'wa') + '"' + (cl.phone ? '' : ' disabled') + '>WhatsApp</button><button type="button" data-a="rch" data-c="email" aria-pressed="' + (ch === 'email') + '">Email</button></div>' +
        '<div class="field"><label for="rmsg">Message to ' + esc(ch === 'wa' ? cl.phone : cl.email) + '</label><textarea class="textarea" id="rmsg" style="min-height:120px">' + esc(msg) + '</textarea></div>' +
        (cl.phone ? '' : '<p class="hint">No WhatsApp number. Add one in Edit client.</p>') +
        '<div class="dfoot"><button class="btn outline" data-a="close">Cancel</button><a class="btn" id="rsend" data-a="sendremind" data-pid="' + pr.id + '" target="_blank" rel="noopener" href="' + esc(remindHref(cl, ch, msg, pr)) + '">' + ico(ch === 'wa' ? 'link' : 'file') + (ch === 'wa' ? 'Open WhatsApp' : 'Open email') + '</a></div>';
    } else if (o.t === 'approve') {
      var m = getMs(o.id);
      body = '<div><h2>Approve this deliverable?</h2><p class="muted">' + (projMode(P()) && P().ms.some(function (x) { return x !== m && x.status !== 'approved' && x.status !== 'released'; }) ? 'Approving moves ' + esc(m.name) + ' towards payment. You pay once after every deliverable is approved, and the original files unlock then.' : 'Next you pay ' + inr(balOf(m, P())) + ' to ' + fn + ' and the original files unlock.') + ' You can\'t undo this.</p></div>' + (m.scope && m.scope.length ? '<div class="scopebox"><span class="lbl">What\'s included</span>' + scopeList(m.scope, 'tick') + '</div>' : '') + '<div class="dfoot"><button class="btn outline" data-a="close">Not yet</button><button class="btn" data-a="approve" data-id="' + m.id + '">Approve</button></div>';
    } else if (o.t === 'changes') {
      var m2 = getMs(o.id);
      body = '<div><h2>What would you like changed?</h2><p class="muted">This uses 1 of your ' + (m2.limit - m2.revisions) + ' rounds of changes.</p></div><div class="field"><label for="note">Note to ' + fn + '</label>' +
        '<div class="fb-host" id="fb"><textarea class="textarea" id="note" placeholder="e.g. The palette feels cold. Try warmer tones.">' + esc(U.fb.note) + '</textarea><div class="fb-pass" hidden aria-live="polite"><span class="fb-sel"></span></div><div class="fb-float" style="opacity:0;pointer-events:none"><div class="fb-bar"><div class="fb-in"></div></div></div></div>' +
        '<span class="hint-err" id="noteerr"></span></div><div class="dfoot"><button class="btn outline" data-a="close">Cancel</button><button class="btn" data-a="sendchanges" data-id="' + m2.id + '">Send to ' + fn + '</button></div>';
    } else if (o.t === 'previewas') {
      wide = true; var mp = getMs(o.id), its2 = items(mp), fi2 = Math.min(U.fi || 0, its2.length - 1);
      body = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px"><div><h2>What ' + fc + ' will see</h2><p class="muted">The watermark and your note appear exactly like this.</p></div><button class="btn ghost sm" data-a="close" aria-label="Close">' + ico('x') + '</button></div>' +
        (U.dnote ? '<div class="note" style="background:var(--muted);color:var(--fg)"><b>Note from ' + fn + '</b>' + esc(U.dnote) + '</div>' : '') +
        (its2.length > 1 ? '<div class="tabs" role="tablist">' + its2.map(function (f, i) { return '<button role="tab" data-a="file" data-i="' + i + '" aria-selected="' + (i === fi2) + '">' + esc(f.name) + '</button>'; }).join('') + '</div>' : '') + previewStage(its2[fi2], false) +
        '<div class="dfoot"><button class="btn outline" data-a="close">Back to editing</button><button class="btn" data-a="submit" data-id="' + mp.id + '">Send for review</button></div>';
    } else if (o.t === 'extra') {
      var mx = getMs(o.id), xa = Number(P().extraFee) || 0, fx = fees(xa);
      body = '<div><h2>Add a round of changes</h2><p class="muted">All included rounds used. ' + (xa ? 'One more costs ' + inr(xa) + (fx.cfee ? ' + ' + inr(fx.cfee) + ' fee' : '') + '.' : 'One more round is free.') + '</p></div>' +
        '<div class="dfoot"><button class="btn outline" data-a="close">Cancel</button><button class="btn" data-a="doextra" data-id="' + mx.id + '" ' + (U.busy ? 'disabled' : '') + '>' + (U.busy ? 'Paying…' : xa ? 'Pay ' + inr(fx.total) : 'Add round') + '</button></div>';
    } else if (o.t === 'issue') {
      var mi = getMs(o.id), r = o.r || '';
      body = '<div><h2>Report a problem</h2><p class="muted">Approval of ' + esc(mi.name) + ' is on hold until it\'s sorted. ' + fn + ' has ' + ISSUE_DAYS + ' days to reply.</p></div>' +
        '<div style="display:grid;gap:8px" role="radiogroup" aria-label="What went wrong">' + Object.keys(REASONS).map(function (k) { return '<label class="radio"><input type="radio" name="reason" value="' + k + '"' + (r === k ? ' checked' : '') + '><span>' + REASONS[k] + '</span></label>'; }).join('') + '</div>' +
        '<div class="field"><label for="inote">What happened?</label><textarea class="textarea" id="inote" placeholder="Describe the problem">' + esc(o.note || '') + '</textarea><span class="hint-err" id="ierr"></span></div>' +
        '<div class="dfoot"><button class="btn outline" data-a="close">Cancel</button><button class="btn danger" data-a="sendissue" data-id="' + mi.id + '">Report problem</button></div>';
    } else if (o.t === 'respond') {
      var mr = getMs(o.id);
      body = '<div><h2>Reply to ' + fc + '</h2><p class="muted">Say what you\'ll do and by when.</p></div><div class="field"><label for="rnote">Your reply</label><textarea class="textarea" id="rnote" placeholder="e.g. Sorry for the delay. Style frames by Friday.">' + esc(o.note || '') + '</textarea><span class="hint-err" id="rerr"></span></div><div class="dfoot"><button class="btn outline" data-a="close">Cancel</button><button class="btn" data-a="sendrespond" data-id="' + mr.id + '">Send reply</button></div>';
    } else if (o.t === 'refund') {
      var mf = getMs(o.id), ff = fees(mf.amount);
      body = '<div><h2>Refund ' + fc + ' ' + inr(ff.total) + '?</h2><p class="muted">Includes their share of the fee. The deliverable closes unpaid. You can\'t undo this.</p></div><div class="dfoot"><button class="btn outline" data-a="close">Cancel</button><button class="btn danger" data-a="dorefund" data-id="' + mf.id + '">Refund in full</button></div>';
    } else if (o.t === 'receipt') {
      wide = true; var p3 = getP(o.pid) || P(), m3 = p3.ms.filter(function (x) { return x.id === o.id; })[0];
      var tabs = [['summary', 'Receipt'], ['invoice', 'Invoice'], ['contract', 'Contract']];
      body = '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><div><h2>' + esc(m3.name) + '</h2><p class="muted">' + esc(org(p3)) + '</p></div><button class="btn ghost sm" data-a="close" aria-label="Close">' + ico('x') + '</button></div><div class="tabs" role="tablist">' + tabs.map(function (t) { return '<button role="tab" data-a="rtab" data-t="' + t[0] + '" aria-selected="' + (U.rtab === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div>' + (U.rtab === 'contract' ? contractHTML(p3) : sheetHTML(m3, p3, U.rtab)) + '<div class="dfoot"><button class="btn outline" data-a="dldoc" data-id="' + m3.id + '" data-pid="' + p3.id + '" data-t="' + (U.rtab || 'summary') + '">' + ico('download') + 'Download this</button><button class="btn outline" data-a="dldoc" data-id="' + m3.id + '" data-pid="' + p3.id + '" data-t="all">' + ico('download') + 'Download all three</button><button class="btn" data-a="close">Close</button></div>';
    } else if (o.t === 'editclient') {
      var f = o.f;
      body = '<div><h2>Edit client</h2></div><div class="idrow">' + avatarHTML({ org: f.org || f.name, name: f.name, color: f.color, logo: f.logo }, true) + '<div style="display:grid;gap:8px;min-width:0"><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn outline sm" data-a="pickelogo">' + ico('upload') + (f.logo ? 'Change logo' : 'Add logo') + '</button>' + (f.logo ? '<button type="button" class="btn ghost sm" data-a="rmelogo">Remove</button>' : '') + '</div><input type="file" id="elogo" accept="image/*" hidden><span class="muted" style="font-size:var(--t1)">Optional</span></div></div><div class="field"><label>Color</label>' + swatchesHTML(f.color, 'ecolor') + '</div>' +
        '<div class="two"><div class="field"><label for="ec-org">Company</label><input class="input" id="ec-org" data-ec="org" value="' + esc(f.org) + '"></div><div class="field"><label for="ec-name">Contact name</label><input class="input' + ((o.err || {}).name ? ' bad' : '') + '" id="ec-name" data-ec="name" value="' + esc(f.name) + '">' + ((o.err || {}).name ? '<span class="hint-err">' + o.err.name + '</span>' : '') + '</div></div><div class="two"><div class="field"><label for="ec-email">Contact email</label><input class="input' + ((o.err || {}).email ? ' bad' : '') + '" id="ec-email" type="email" data-ec="email" value="' + esc(f.email) + '">' + ((o.err || {}).email ? '<span class="hint-err">' + o.err.email + '</span>' : '') + '</div><div class="field"><label>WhatsApp number</label>' + phoneHTML('ec:phone', f.phone, (o.err || {}).phone) + ((o.err || {}).phone ? '<span class="hint-err">' + o.err.phone + '</span>' : '') + '</div></div><div class="dfoot"><button class="btn outline" data-a="close">Cancel</button><button class="btn" data-a="saveclient">Save</button></div>';
    } else if (o.t === 'paid') {
      body = '<div class="celebrate">' + buddy('thumbs', 112) + '<svg class="seal" viewBox="0 0 56 56" fill="none" stroke="var(--ok)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:44px;height:44px"><circle cx="28" cy="28" r="25"/><path d="M17 29l8 8 14-16"/></svg><div><h2>Advance paid</h2><p class="muted">' + inr(o.amount) + ' sent to ' + fn + '. They can start on ' + esc(o.name) + '.</p></div></div><div class="dfoot" style="justify-content:center"><button class="btn" data-a="close">Back to project</button></div>';
    } else if (o.t === 'released') {
      var m4 = getMs(o.id), client = o.who === 'client', amt4 = o.amount != null ? o.amount : balOf(m4, P());
      body = '<div class="celebrate">' + buddy('party', 140) + '<div><h2 style="font-size:var(--t4)">' + (client ? 'Unlocked' : inr(amt4) + ' paid') + '</h2><p class="muted" style="margin-top:6px">' + (client ? 'Your original files are unlocked.' : fc + ' paid you directly. The original files are unlocked for ' + fc + '.') + '</p></div>' +
        '<div class="card" style="padding:12px 16px;width:100%;text-align:left"><div class="kv"><div><span class="muted">' + esc(m4.name) + '</span><span class="mono">' + inr(m4.amount) + '</span></div><div class="tot"><span>' + (client ? 'You paid' : 'You received') + '</span><span class="mono">' + inr(amt4) + '</span></div></div></div></div>' +
        '<div class="dfoot" style="justify-content:center"><button class="btn outline" data-a="receipt" data-id="' + m4.id + '">' + ico('file') + 'Documents</button><button class="btn" data-a="close">Continue</button></div>';
    } else if (o.t === 'approved') {
      var m5 = getMs(o.id), p5 = P();
      body = '<div class="celebrate">' + buddy('thumbs', 112) + '<div><h2>Approved</h2><p class="muted">' + (canPay(m5, p5) ? 'Pay ' + inr(payAmt(m5, p5)) + ' to ' + fn + ' to unlock the original files.' : 'You\'ll pay once, after the last deliverable is approved.') + '</p></div></div><div class="dfoot" style="justify-content:center"><button class="btn outline" data-a="close">Pay later</button>' + (canPay(m5, p5) ? '<button class="btn" data-a="gocheckout" data-id="' + m5.id + '">Pay now</button>' : '') + '</div>';
    } else if (o.t === 'unlock') {
      var m6 = getMs(o.id);
      body = '<div><h2>Unlock without payment?</h2><p class="muted">' + fc + ' can download the original files for ' + esc(m6.name) + ' straight away. You can\'t lock them again. Use this if you\'ve decided to waive payment.</p></div><div class="dfoot"><button class="btn outline" data-a="close">Cancel</button><button class="btn" data-a="dounlock" data-id="' + m6.id + '">Unlock originals</button></div>';
    } else if (o.t === 'contract') {
      wide = true; var p7 = getP(o.pid) || P();
      body = '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><div><h2>Contract</h2><p class="muted">' + esc(p7.name) + '</p></div><button class="btn ghost sm" data-a="close" aria-label="Close">' + ico('x') + '</button></div>' + contractHTML(p7) + '<div class="dfoot"><button class="btn" data-a="close">Close</button></div>';
    }
    return '<div class="overlay" data-a="overlay" role="dialog" aria-modal="true"><div class="dialog' + (wide ? ' wide' : '') + '">' + body + '</div></div>';
  }

  /* ---------------- feedback note: selection-actions bar ----------------
     A pill bar attached beneath the note: an instruction input, quick actions that expand,
     then thinking, streaming into the highlighted note, and Keep / Discard / try again.
     The rewrites are local text clean-ups, so the prototype needs no model. */
  var FB = { ts: [], raf: 0, ro: null, anim: null };
  function fbStop() { FB.ts.forEach(function (t) { clearTimeout(t); clearInterval(t); }); FB.ts = []; cancelAnimationFrame(FB.raf); if (FB.ro) { FB.ro.disconnect(); FB.ro = null; } if (FB.anim) { FB.anim.cancel(); FB.anim = null; } }
  var FB_ACTIONS = { primary: [['Improve', 'spark'], ['Shorten', 'scissors']], more: [['Tone', 'smile'], ['Grammar', 'text']] };
  var FB_BUSY = { Improve: 'Improving', Shorten: 'Shortening', Tone: 'Changing tone', Grammar: 'Fixing grammar' };
  var FB_FIX = { dont: "don't", cant: "can't", wont: "won't", doesnt: "doesn't", didnt: "didn't", isnt: "isn't", im: "I'm", ive: "I've", thats: "that's", theres: "there's", youre: "you're", whats: "what's" };
  function fbTidy(t) {
    t = String(t).replace(/\s+/g, ' ').replace(/\s+([,.!?;:])/g, '$1').replace(/([,;])(?=\S)/g, '$1 ').trim();
    t = t.replace(/\b(dont|cant|wont|doesnt|didnt|isnt|im|ive|thats|theres|youre|whats)\b/gi, function (w) { return FB_FIX[w.toLowerCase()] || w; }).replace(/\bi\b/g, 'I');
    t = t.replace(/(^|[.!?]\s+)([a-z])/g, function (m, a, b) { return a + b.toUpperCase(); });
    return t && !/[.!?]$/.test(t) ? t + '.' : t;
  }
  function fbSentences(t) { return (t.match(/[^.!?]+[.!?]+/g) || [t]).map(function (x) { return x.trim(); }).filter(Boolean); }
  function fbHow(x) { return FB_BUSY[x] ? x : /short|brief|concise|trim|cut/i.test(x) ? 'Shorten' : /friend|polite|warm|kind|tone|soft|nice/i.test(x) ? 'Tone' : /grammar|spell|typo/i.test(x) ? 'Grammar' : 'Improve'; }
  function fbRewrite(note, how, n) {
    var t = fbTidy(note);
    if (how === 'Grammar') return t;
    if (how === 'Shorten') { var k = fbTidy(t.replace(/\b(really|very|just|actually|basically|kind of|sort of|a bit|a little|maybe|probably|honestly)\b,?\s*/gi, '').replace(/\b(i think|i feel like|i guess)\b,?\s*/gi, '')); return fbSentences(k).slice(0, 2).join(' '); }
    if (how === 'Tone') return (n % 2 ? 'Thanks, this is a good start. ' : 'Thanks for sending this over. ') + t + ' Could we take another look when you have a moment?';
    var ss = fbSentences(t); return ss.length > 1 ? 'What to change:\n' + ss.map(function (x) { return '• ' + x; }).join('\n') : 'What to change: ' + t;
  }
  function fbMount(host) {
    fbStop();
    var ta = host.querySelector('#note'), pass = host.querySelector('.fb-pass'), sel = pass.firstElementChild, wrap = host.querySelector('.fb-float'), bar = host.querySelector('.fb-bar'), cont = host.querySelector('.fb-in');
    var st = { mode: 'idle', how: 'Improve', prompt: '', typingW: null, exp: false, orig: '', out: '', tries: 0, shown: false, pos: false }, anchor = { x: 0, y: 0 };
    var hint = function (m) { var e = document.getElementById('noteerr'); if (e) e.textContent = m || ''; };
    var q = function (cls, ic, label, fb, aria) { return '<button type="button" class="' + cls + '" data-fb="' + fb + '"' + (aria ? ' aria-label="' + aria + '"' : '') + '>' + ico(ic) + (label ? '<span>' + label + '</span>' : '') + '</button>'; };
    function place() {
      cancelAnimationFrame(FB.raf);
      FB.raf = requestAnimationFrame(function () {
        var hb = host.getBoundingClientRect(), x, y;
        if (st.mode === 'idle') { var tb = ta.getBoundingClientRect(); x = tb.left - hb.left + tb.width / 2; y = tb.bottom - hb.top + 8; }
        else { var b = sel.getBoundingClientRect(), ls = sel.getClientRects(), last = ls[ls.length - 1]; if (!last) return; x = b.left - hb.left + b.width / 2; y = last.bottom - hb.top + 8; }
        var hw = host.clientWidth, bw = bar.offsetWidth; x = Math.round(Math.max(bw / 2, Math.min(hw - bw / 2, x))); y = Math.round(y);
        host.classList.toggle('fb-narrow', hw < 340); wrap.style.setProperty('--fbw', hw + 'px');
        if (x !== anchor.x || y !== anchor.y || !st.pos) {
          var first = !st.pos; anchor = { x: x, y: y }; if (first) wrap.style.transition = 'none';
          wrap.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) translateX(-50%)'; if (first) { void wrap.offsetWidth; wrap.style.transition = ''; }
        }
        st.pos = true; reveal();
      });
    }
    function reveal() { if (!st.shown || !st.pos || wrap.dataset.on) return; wrap.dataset.on = 1; wrap.style.opacity = 1; wrap.style.pointerEvents = 'auto'; if (!REDUCE) bar.style.animation = 'pop-in .22s cubic-bezier(.23,1,.32,1) both'; }
    function idleHTML() {
      return '<div class="fb-prompt"><form class="fb-form"><input class="fb-input" aria-label="Ask to rewrite your note" placeholder="Ask to rewrite your note" autocomplete="off"></form></div>' +
        '<div class="fb-acts"><span class="fb-div strong"></span>' + FB_ACTIONS.primary.map(function (a) { return q('fb-q', a[1], a[0], 'act:' + a[0]); }).join('') +
        '<div class="fb-more">' + FB_ACTIONS.more.map(function (a) { return q('fb-q', a[1], a[0], 'act:' + a[0], a[0]); }).join('') + '</div><span class="fb-div"></span><button type="button" class="fb-chev" data-fb="toggle" aria-label="Show more actions" aria-expanded="false"><span class="fb-chevi">' + ico('chev') + '</span></button></div>' +
        '<div class="fb-sendwrap"><button type="button" class="fb-send" data-fb="send" aria-label="Send edit instruction">' + ico('arrowup') + '</button></div>';
    }
    function paint() {
      var has = st.prompt.trim().length > 0, hw = host.clientWidth, PW = Math.max(72, Math.min(145, hw - 236)), $ = function (c) { return cont.querySelector(c); };
      var pr = $('.fb-prompt'), fm = $('.fb-form'), ac = $('.fb-acts'), mo = $('.fb-more'), sw = $('.fb-sendwrap'), ch = $('.fb-chev'), cv = $('.fb-chevi'), d0 = $('.fb-div.strong');
      if (!pr) return; var typing = has && st.typingW, w = typing ? st.typingW - 40 : PW;
      pr.style.maxWidth = st.exp ? '0px' : w + 'px'; pr.style.opacity = st.exp ? 0 : 1; pr.style.transform = st.exp ? 'translateX(-8px)' : 'none'; fm.style.width = w + 'px';
      ac.style.maxWidth = has ? '0px' : (st.exp ? '462px' : '224px'); ac.style.opacity = has ? 0 : 1; ac.style.transform = has ? 'translateX(-8px)' : 'none'; d0.style.display = st.exp ? 'none' : '';
      mo.style.maxWidth = st.exp ? '262px' : '0px'; mo.style.opacity = st.exp ? 1 : 0; mo.style.marginLeft = st.exp ? '2px' : '0px';
      sw.style.maxWidth = has ? '30px' : '0px'; sw.style.opacity = has ? 1 : 0; sw.style.transform = has ? 'scale(1)' : 'scale(.88)';
      cv.style.transform = st.exp ? 'rotate(180deg)' : 'none'; ch.setAttribute('aria-expanded', String(st.exp)); ch.setAttribute('aria-label', st.exp ? 'Show fewer actions' : 'Show more actions');
      bar.style.width = typing ? st.typingW + 'px' : ''; cont.style.width = typing ? st.typingW - 8 + 'px' : '';
    }
    function draw() {
      var m = st.mode;
      if (m === 'idle') { cont.innerHTML = idleHTML(); paint(); }
      else if (m === 'result') cont.innerHTML = '<button type="button" class="fb-keep" data-fb="keep">' + ico('check') + 'Keep</button>' + q('fb-q', 'x', 'Discard', 'discard') + '<span class="fb-div"></span>' + q('fb-retry', 'refresh', '', 'retry', 'Try again');
      else { var lb = (FB_BUSY[st.how] || 'Editing') + '…'; cont.innerHTML = '<span class="fb-busy"><i class="fb-spin"></i>' + (m === 'thinking' ? '<span class="fb-shim">' + lb + '</span>' : '<span>' + lb + '</span>') + '</span>'; }
    }
    function setMode(m) {
      var prevW = Math.ceil(bar.getBoundingClientRect().width), prev = st.mode; st.mode = m; draw();
      var nextW = Math.ceil(cont.getBoundingClientRect().width) + 8;
      if (prev !== m && st.shown && Math.abs(nextW - prevW) > 1 && !REDUCE) { if (FB.anim) FB.anim.cancel(); FB.anim = bar.animate([{ width: prevW + 'px' }, { width: nextW + 'px' }], { duration: 320, easing: 'cubic-bezier(.23,1,.32,1)' }); }
      var sb = document.querySelector('[data-a="sendchanges"]'); if (sb) sb.disabled = m !== 'idle';
      place();
    }
    function back(keep) {
      if (keep) { ta.value = st.out; U.fb.note = st.out; }
      pass.hidden = true; ta.style.display = ''; st.exp = false; st.prompt = ''; st.typingW = null; st.how = 'Improve'; st.tries = 0; setMode('idle'); ta.focus();
    }
    function run(how) {
      if (st.mode === 'idle') {
        var v = ta.value.trim(); if (v.length < 5) { hint('Write a note first.'); ta.focus(); return; }
        hint(''); st.orig = v; pass.style.minHeight = ta.offsetHeight + 'px'; ta.style.display = 'none'; pass.hidden = false;
      }
      st.how = how; st.exp = false; st.tries++; sel.textContent = st.orig; setMode('thinking');
      FB.ts.push(setTimeout(function () {
        st.out = fbRewrite(st.orig, fbHow(how), st.tries); setMode('streaming');
        var tk = st.out.split(/(\s+)/), i = 0;
        if (REDUCE) { sel.textContent = st.out; setMode('result'); return; }
        var iv = setInterval(function () { i += 2; sel.textContent = tk.slice(0, i).join(''); place(); if (i >= tk.length) { clearInterval(iv); FB.ts.push(setTimeout(function () { setMode('result'); }, 120)); } }, 26); FB.ts.push(iv);
      }, REDUCE ? 0 : 700));
    }
    host.addEventListener('click', function (e) {
      var b = e.target.closest('[data-fb]'); if (!b) return; var k = b.dataset.fb;
      if (k === 'toggle') { st.exp = !st.exp; paint(); place(); }
      else if (k === 'send') run(st.prompt.trim() || 'Improve');
      else if (k === 'keep') back(true); else if (k === 'discard') back(false); else if (k === 'retry') run(st.how);
      else if (k.indexOf('act:') === 0) run(k.slice(4));
    });
    host.addEventListener('submit', function (e) { e.preventDefault(); run(st.prompt.trim() || 'Improve'); });
    host.addEventListener('input', function (e) {
      var t = e.target; if (t === ta) { hint(''); return; } if (!t.classList.contains('fb-input')) return;
      var nx = t.value; if (!st.prompt.trim() && nx.trim()) st.typingW = Math.ceil(bar.getBoundingClientRect().width); else if (!nx.trim()) st.typingW = null;
      st.prompt = nx; paint(); place();
    });
    if (window.ResizeObserver) { FB.ro = new ResizeObserver(place); FB.ro.observe(host); }
    draw(); FB.ts.push(setTimeout(function () { st.shown = true; place(); }, REDUCE ? 0 : 280));
  }

  /* ---------------- render ---------------- */
  function pendingEvents() {
    var p = P(); if (!p || U.modal) return;
    p.ms.forEach(function (m) {
      if (D.role === 'freelancer') {
        if (m.status === 'released' && m.seen.released === false) { m.seen.released = true; save(); U.modal = { t: 'released', id: m.id, who: 'freelancer' }; }
        else if (m.status === 'approved' && m.seen.approved === false) { m.seen.approved = true; save(); setTimeout(function () { toast('cheer', first(clientName()) + ' approved ' + m.name, 'Awaiting payment of ' + inr(payAmt(m, p)) + '.'); }, 250); }
        
        else if (m.status === 'changes' && m.seen.changes === false) { m.seen.changes = true; save(); setTimeout(function () { toast('work', 'Changes requested on ' + m.name); }, 250); }
        else if (m.status === 'dispute' && m.seen.dispute === false) { m.seen.dispute = true; save(); setTimeout(function () { toast('worry', 'Problem reported on ' + m.name, 'Reply by ' + long(issueBy(m)) + '.'); }, 250); }
      } else if (m.status === 'refunded' && m.seen.refunded === false) { m.seen.refunded = true; save(); setTimeout(function () { toast('wallet', 'You were refunded', first(D.studio.name) + ' refunded ' + inr(fees(m.amount).total) + ' for ' + m.name + '.'); }, 250); }
      else if (m.status === 'submitted' && m.seen.submitted === false) { m.seen.submitted = true; save(); setTimeout(function () { toast('point', 'New preview to review', first(D.studio.name) + ' sent ' + m.name + '. Reply by ' + long(replyBy(m)) + '.'); }, 250); }
    });
  }
  function screen() {
    if (D.role === 'client') {
      if (!P()) return cEmpty();
      if (U.ccontract) return cContract();
      if (U.checkout) return cCheckout();
      if (!contractOk(P())) return cInvite();
      return cProject();
    }
    if (!D.onboarded) return U.setup ? sSetup() : sLanding();
    if (U.plan) return U.cstep ? sContractF() : sPlan();
    return U.view === 'clients' ? sClients() : U.view === 'calendar' ? sCalendar() : U.view === 'payments' ? sPayments() : U.view === 'settings' ? sSettings() : U.view === 'project' ? sProject() : sToday();
  }
  function protoBar() {
    var p = P(), c = p ? first(p.client.name) : 'Client', f = first(D.studio.name), mode = !D.projects.length ? 'new' : D.samples ? 'active' : '';
    document.getElementById('proto').innerHTML = '<span>View as</span><button data-a="role" data-r="freelancer" aria-pressed="' + (D.role === 'freelancer') + '">' + esc(f) + '</button><button data-a="role" data-r="client" aria-pressed="' + (D.role === 'client') + '">' + esc(c) + '</button><i class="vr"></i><span>Account</span><button data-a="acct" data-m="new" aria-pressed="' + (mode === 'new') + '">First day</button><button data-a="acct" data-m="active" aria-pressed="' + (mode === 'active') + '">Active</button><button class="reset" data-a="reset">Restart</button>';
  }
  var PREVVIEW = '', PREVMODAL = '';
  function viewKey() { var p = P(); return [D.role, D.onboarded, U.setup, U.plan, U.cstep, U.ccontract, U.view, U.pt, U.checkout, p && p.id].join('|'); }
  function modalKey() { return U.modal ? JSON.stringify([U.modal.t, U.modal.id]) : ''; }
  function closeModal() {
    var ov = document.querySelector('.overlay'); if (!ov) { U.modal = null; render(); return; }
    ov.classList.add('closing'); setTimeout(function () { U.modal = null; render(); }, 170);
  }
  function render() {
    sweepAuto();
    autoRemind();
    pendingEvents();
    var y = window.scrollY, app = document.getElementById('app'), vk = viewKey(), mk = modalKey(), newView = vk !== PREVVIEW, newModal = mk && mk !== PREVMODAL;
    KEYC = {}; CURK = {}; app.classList.remove('view-in');
    var bs0 = document.querySelector('.body'), by0 = bs0 ? bs0.scrollTop : 0;
    app.innerHTML = screen() + modalHTML();
    if (U.keepScroll && !newView) { var bs1 = document.querySelector('.body'); if (bs1) bs1.scrollTop = by0; }
    if (mk && !newModal) { var ov = app.querySelector('.overlay'); if (ov) ov.classList.add('static'); }
    if (newView) { app.querySelectorAll('.att-list li, .rows > li, tbody tr, .frow, .easy, .kpi, .chain li').forEach(function (el, i) { el.style.setProperty('--n', Math.min(i, 9)); }); app.classList.add('view-in'); }
    PREVVIEW = vk; PREVMODAL = mk;
    mountBuddies(app); mountDocs(app); mountQR(app); mountSig(app);
    var fbh = document.getElementById('fb'); if (fbh) fbMount(fbh); else fbStop();
    if (U.scrollTo) { var sk = document.getElementById(U.scrollTo); U.scrollTo = null; if (sk) setTimeout(function () { sk.scrollIntoView({ block: 'center', behavior: REDUCE ? 'auto' : 'smooth' }); if (sk.focus && sk.tagName === 'INPUT') sk.focus({ preventScroll: true }); }, 80); }
    document.documentElement.style.setProperty('--brand', BRANDS[D.studio.brand]);
    protoBar();
    if (U.autoSent && D.role === 'freelancer' && D.onboarded) { var ns = U.autoSent; U.autoSent = 0; setTimeout(function () { toast('point', ns + (ns === 1 ? ' automatic reminder sent' : ' automatic reminders sent'), 'Clients were nudged about dates that are close or past.'); }, 500); } else U.autoSent = 0;
    if (U.keepScroll) window.scrollTo(0, y);
    U.keepScroll = true;
    var st = document.querySelector('.deliverable'); if (st) st.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    var dz = document.getElementById('dz');
    if (dz) {
      ['dragenter', 'dragover'].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add('over'); }); });
      ['dragleave', 'drop'].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove('over'); }); });
      dz.addEventListener('drop', function (e) { var m = focusMs(); if (m && e.dataTransfer) readFiles(m, e.dataTransfer.files); });
    }
    var fi = document.getElementById('fi'); if (fi) fi.addEventListener('change', function () { var m = focusMs(); if (m) readFiles(m, fi.files); });
  }
  /* Cmd/Ctrl+K: jump to any client or page without leaving the keyboard */
  function openCmd() {
    if (document.getElementById('cmdk') || D.role !== 'freelancer' || !D.onboarded) return;
    var ov = document.createElement('div'); ov.id = 'cmdk'; ov.className = 'cmdk'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Search');
    ov.innerHTML = '<div class="cmdk-box"><div class="cmdk-top">' + ico('search') + '<input id="cmdq" class="cmdk-in" placeholder="Search clients and pages" autocomplete="off" aria-label="Search clients and pages"><kbd>Esc</kbd></div><div class="cmdk-list" id="cmdl" role="listbox"></div></div>';
    document.body.appendChild(ov);
    var q = ov.querySelector('#cmdq'), list = ov.querySelector('#cmdl'), sel = 0, rows = [], prev = document.activeElement;
    var pages = [['Today', 'home', 'today'], ['Clients', 'users', 'clients'], ['Calendar', 'calendar', 'calendar'], ['Payments', 'wallet', 'payments'], ['Settings', 'gear', 'settings']];
    function close() { document.removeEventListener('keydown', onkey, true); ov.remove(); if (prev && prev.focus) try { prev.focus(); } catch (e) {} }
    function run(x) { close(); if (!x) return; if (x.kind === 'project') openProject(x.id); else if (x.kind === 'plan') { var pb = document.querySelector('[data-a="plan"]'); if (pb) pb.click(); } else { var nb = document.querySelector('[data-a="view"][data-v="' + x.v + '"]'); if (nb) nb.click(); } }
    function build() {
      var t = q.value.trim().toLowerCase(); rows = [];
      D.projects.forEach(function (p) { if (!t || (org(p) + ' ' + p.name + ' ' + p.client.name).toLowerCase().indexOf(t) > -1) { var a0 = attentionFor(p); rows.push({ kind: 'project', id: p.id, label: org(p), sub: p.name + (a0 ? ' · ' + a0.text : ''), color: ccol(p) }); } });
      pages.forEach(function (p) { if (!t || p[0].toLowerCase().indexOf(t) > -1) rows.push({ kind: 'page', v: p[2], label: p[0], sub: 'Go to', icon: p[1] }); });
      if (!t || 'new project'.indexOf(t) > -1) rows.push({ kind: 'plan', label: 'New project', sub: 'Create', icon: 'plus' });
      if (sel >= rows.length) sel = Math.max(0, rows.length - 1);
      list.innerHTML = rows.length ? rows.map(function (x, i) { return '<button type="button" class="cmdk-row" role="option" aria-selected="' + (i === sel) + '" data-i="' + i + '">' + (x.kind === 'project' ? '<i class="cmdk-dot" style="background:' + x.color + '"></i>' : ico(x.icon)) + '<span class="cmdk-l">' + esc(x.label) + '</span><span class="cmdk-s">' + esc(x.sub) + '</span></button>'; }).join('') : '<p class="cmdk-empty">No matches</p>';
    }
    function onkey(e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(rows.length - 1, sel + 1); build(); var s1 = list.querySelector('[aria-selected="true"]'); if (s1) s1.scrollIntoView({ block: 'nearest' }); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); build(); var s2 = list.querySelector('[aria-selected="true"]'); if (s2) s2.scrollIntoView({ block: 'nearest' }); }
      else if (e.key === 'Enter') { e.preventDefault(); run(rows[sel]); }
      else if (e.key === 'Tab') { e.preventDefault(); q.focus(); }
    }
    document.addEventListener('keydown', onkey, true);
    q.addEventListener('input', function () { sel = 0; build(); });
    list.addEventListener('click', function (e) { var b = e.target.closest('[data-i]'); if (b) run(rows[Number(b.dataset.i)]); });
    ov.addEventListener('mousedown', function (e) { if (e.target === ov) close(); });
    build(); q.focus();
  }
  /* ---------------- events ---------------- */
  function go(role) { document.getElementById('toasts').innerHTML = ''; D.role = role; if (role === 'client' && !P()) D.cur = pickCur(); if (role === 'client' && P() && !P().openedAt) P().openedAt = new Date().toISOString(); U.checkout = false; U.modal = null; U.fi = 0; U.sel = null; save(); window.scrollTo(0, 0); U.keepScroll = false; render(); }
  function openProject(id, mid) { D.cur = id; U.view = 'project'; U.pt = 'overview'; U.sel = mid || null; U.plan = false; U.cal = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1); save(); U.keepScroll = false; render(); window.scrollTo(0, 0); }
  function remind(pid, ch) { var p = getP(pid) || P(); if (!p) return; p.remindedAt = new Date().toISOString(); p.remindedAuto = false; log('freelancer', 'Reminded ' + p.client.name + ' by ' + (ch === 'wa' ? 'WhatsApp' : 'email'), p.id); save(); toast('hello', 'Reminder ready in ' + (ch === 'wa' ? 'WhatsApp' : 'your email')); }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-a]'); if (!a) return; var act = a.dataset.a, m;
    if (act === 'overlay') { if (e.target !== a) return; closeModal(); return; }
    if (act === 'close') { closeModal(); return; }
    if (act === 'role') { go(a.dataset.r); return; }
    if (act === 'reset') { try { localStorage.removeItem(KEY); } catch (er) {} D = fresh(); U = blankU(); window.scrollTo(0, 0); U.keepScroll = false; render(); return; }
    if (act === 'scroll') { var tgt = document.getElementById(a.dataset.t); if (tgt) tgt.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'start' }); return; }
    if (act === 'peek') { D.onboarded = true; D.projects = seedProjects(); D.samples = true; D.cur = null; U.setup = false; U.view = 'today'; save(); U.keepScroll = false; render(); window.scrollTo(0, 0); return; }
    if (act === 'start') { U.setup = true; U.keepScroll = false; render(); window.scrollTo(0, 0); return; }
    if (act === 'brand') { D.studio.brand = Number(a.dataset.i); save(); render(); return; }
    if (act === 'finish-setup') { if (!setupOk()) return; D.onboarded = true; D.projects = []; D.samples = false; D.cur = null; U.view = 'today'; log('freelancer', 'Set up the studio', null); save(); U.keepScroll = false; render(); window.scrollTo(0, 0); return; }
    if (act === 'view') { U.notif = false; U.view = a.dataset.v; U.plan = false; U.cal = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1); U.keepScroll = false; render(); window.scrollTo(0, 0); return; }
    if (act === 'openp') { U.notif = false; if (a.dataset.up) U.scrollTo = 'dz'; openProject(a.dataset.id, a.dataset.mid); return; }
    if (act === 'filter') { U.filter = a.dataset.f; if (U.view !== 'today') U.view = 'today'; render(); return; }
    if (act === 'payk') { S().payout.kind = a.dataset.k; save(); render(); return; }
    if (act === 'deffee') { S().defaults.feeMode = a.dataset.k; save(); render(); return; }
    if (act === 'notif') { U.notif = !U.notif; render(); return; }
    if (act === 'notifread') { D.notifSeen = Date.now(); save(); render(); return; }
    if (act === 'pane') { D.ui = D.ui || {}; D.ui.pane = !D.ui.pane; save(); render(); return; }
    if (act === 'tview') { U.tview = a.dataset.v; render(); return; }
    if (act === 'pg') { U.pg = U.pg || {}; U.pg[a.dataset.id] = Number(a.dataset.n); applyF(document.querySelector('.ftable[data-f="' + a.dataset.id + '"]')); var tp = document.querySelector('.tpanel'); if (tp && tp.scrollIntoView) tp.scrollIntoView({ block: 'start' }); return; }
    if (act === 'cfilter') { (U.pg = U.pg || {}).c = 1; U.cf = a.dataset.f; applyF(document.querySelector('.ftable[data-f="c"]')); return; }
    if (act === 'pfilter') { (U.pg = U.pg || {}).p = 1; U.pf = a.dataset.f; applyF(document.querySelector('.ftable[data-f="p"]')); return; }
    if (act === 'ptab') { U.pt = a.dataset.t; render(); return; }
    if (act === 'needall') { U.needAll = !U.needAll; render(); return; }
    if (act === 'ttab') { U.ttab = a.dataset.t; render(); return; }
    if (act === 'ctab') { U.ct = a.dataset.t; render(); return; }
    if (act === 'acct') { D.role = 'freelancer'; if (a.dataset.m === 'new') { D.projects = []; D.samples = false; D.cur = null; } else { D.projects = seedProjects(); D.samples = true; D.cur = null; } U.view = 'today'; U.plan = false; U.modal = null; U.checkout = false; U.sel = null; U.more = false; U.waitOpen = false; U.calClient = ''; save(); document.getElementById('toasts').innerHTML = ''; U.keepScroll = false; render(); window.scrollTo(0, 0); return; }
    if (act === 'loadactive') { D.projects = seedProjects(); D.samples = true; D.cur = null; U.view = 'today'; save(); U.keepScroll = false; render(); window.scrollTo(0, 0); return; }
    if (act === 'more') { U.more = !U.more; render(); return; }
    if (act === 'waitopen') { U.waitOpen = !U.waitOpen; render(); return; }
    if (act === 'calclient') { U.calClient = a.dataset.id || ''; var cb0 = document.getElementById('calbox'); if (cb0) cb0.innerHTML = bigCalInner(calEvents()); return; }
    if (act === 'pcolor') { U.draft.ccolor = Number(a.dataset.i); render(); return; }
    if (act === 'pickplogo') { var pl = document.getElementById('plogo'); if (pl) pl.click(); return; }
    if (act === 'rmplogo') { U.draft.clogo = ''; render(); return; }
    if (act === 'editclient') { var cp = P(); U.modal = { t: 'editclient', f: { org: cp.client.org || '', name: cp.client.name, email: cp.client.email, phone: cp.client.phone || '', color: cp.client.color || 0, logo: cp.client.logo || '' } }; render(); return; }
    if (act === 'ecolor') { U.modal.f.color = Number(a.dataset.i); render(); return; }
    if (act === 'pickelogo') { var el0 = document.getElementById('elogo'); if (el0) el0.click(); return; }
    if (act === 'rmelogo') { U.modal.f.logo = ''; render(); return; }
    if (act === 'saveclient') { var f0 = U.modal.f, c0 = P().client; var er0 = {}, ee0 = emailErr(f0.email), pe0 = phoneErr(f0.phone, (U.phIso || {})['ec:phone']); if (ee0) er0.email = ee0; if (pe0) er0.phone = pe0; if (!f0.name.trim()) er0.name = 'Enter a contact name.'; if (Object.keys(er0).length) { U.modal.err = er0; render(); return; } c0.org = f0.org.trim(); c0.name = f0.name.trim() || c0.name; c0.email = f0.email.trim() || c0.email; c0.phone = String(f0.phone || '').trim(); c0.color = f0.color; c0.logo = f0.logo; save(); closeModal(); toast('thumbs', 'Client updated'); return; }
    if (act === 'plan') { if (U.plan) return; U.briefMsg = null; U.briefUndo = null; U.draft = defaultDraft(); U.pstep = 0; U.plan = true; U.cal = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1); U.keepScroll = false; render(); window.scrollTo(0, 0); return; }
    if (act === 'pstep') { U.draft.err = U.draft.err || {}; planGo(Number(a.dataset.i)); return; }
    if (act === 'plan3') { var pk = PLANS.filter(function (x) { return x[0] === a.dataset.k; })[0]; U.draft.plan = pk[0]; U.draft.advancePct = pk[2]; render(); return; }
    if (act === 'cancelplan') { U.plan = false; render(); return; }
    if (act === 'addms') { var ld = U.draft.ms[U.draft.ms.length - 1]; U.draft.ms.push({ name: '', amount: '', due: ld && ld.due ? iso(addDays(parse(ld.due), 10)) : '', scope: '', par: false }); render(); return; }
    if (act === 'tpl') {
      var d0 = U.draft, tot = totalDraft(), spec = { one: [['Final delivery', 1]], half: [['Kick-off', 0.5], ['Final delivery', 0.5]], three: [['Deliverable 1', 0.3], ['Deliverable 2', 0.4], ['Final delivery', 0.3]] }[a.dataset.t];
      d0.ms = spec.map(function (x, k) { var old = d0.ms[k] || {}; return { name: old.name || x[0], amount: tot ? r500(tot * x[1]) : '', due: dIso(10 * (k + 1)), scope: old.scope || '', par: false }; }); d0.err = {}; render(); return;
    }
    if (act === 'pickbrief') { var bf = document.getElementById('brieffile'); if (bf) bf.click(); return; }
    if (act === 'samplebrief') { briefApply(SAMPLE_BRIEF, 'the sample brief'); return; }
    if (act === 'undobrief') { if (U.briefUndo) { U.draft.ms = U.briefUndo; U.briefUndo = null; U.briefMsg = null; render(); } return; }
    if (act === 'usesug') { var si = Number(a.dataset.i), sg = suggestFor(U.draft.ms[si].name, U.draft.ms[si].scope); if (sg) { U.draft.ms[si].amount = sg.mid; var ai = document.getElementById('ma' + si); if (ai) ai.value = sg.mid; var se = document.getElementById('sg' + si); if (se) se.innerHTML = sugHTML(si); syncPlanSide(); } return; }
    if (act === 'sugall') { U.draft.ms.forEach(function (m0) { var g0 = suggestFor(m0.name, m0.scope); if (g0 && !Number(m0.amount)) m0.amount = g0.mid; }); render(); return; }
    if (act === 'rmms') { if (U.draft.ms.length > 1) { U.draft.ms.splice(Number(a.dataset.i), 1); render(); } return; }
    if (act === 'createproject') {
      var d = U.draft; d.err = validateDraft(d); if (Object.keys(d.err).length) { planGo(stepOfKey(Object.keys(d.err)[0])); toast('worry', 'Fix the fields marked in red'); return; }
      d.ccolor = hueIdx(d.corg || d.cname); U.cstep = true; U.sig = freshSig(); U.keepScroll = false; render(); window.scrollTo(0, 0); var bd = document.querySelector('.body'); if (bd) bd.scrollTop = 0; return;
    }
    if (act === 'backplan') { U.cstep = false; U.keepScroll = false; render(); return; }
    if (act === 'signsend') {
      if (!sigReady()) return; var d = U.draft;
      var np = { id: uid() + uid().slice(0, 2), sample: false, name: d.name.trim(), client: { name: d.cname.trim(), org: d.corg.trim(), email: d.cemail.trim(), phone: d.cphone.trim(), color: d.ccolor, logo: d.clogo }, ms: d.ms.map(function (x) { var mm = newMs(x.name.trim(), Number(x.amount), x.due, Number(d.rounds), lines(x.scope)); mm.par = !!x.par; return mm; }), clientIn: false, askedAt: new Date().toISOString(), reviewDays: Number(d.reviewDays), autoDays: Number(d.autoDays), extraFee: Number(d.extraFee) || 0, advancePct: Number(d.advancePct) || 0, advancePaid: false, payDays: Number(d.payDays) || 7, unlock: unlockOf(d), createdAt: new Date().toISOString() };
      np.contract = { id: uid(), fSig: sigValue(D.studio.name), cSig: null, sentAt: new Date().toISOString(), tpl: Object.assign({}, S().contract) };
      D.projects.push(np); D.cur = np.id; U.plan = false; U.cstep = false; U.sig = null; U.view = 'project'; U.pt = 'overview'; U.sel = null; log('freelancer', 'Created ' + np.name + ' with ' + np.ms.length + ' deliverables and signed the contract', np.id); save(); U.modal = { t: 'invite', created: true }; U.keepScroll = false; render(); window.scrollTo(0, 0); return;
    }
    if (act === 'unlockmode') { U.draft.unlock = a.dataset.k; render(); return; }
    if (act === 'xtgl') { U.xall = U.xall || {}; var xk = a.dataset.k; U.xall[xk] = xk in U.xall ? !U.xall[xk] : a.dataset.d === '1' ? false : true; var xy = window.scrollY, xb = document.querySelector('.body'), xs = xb ? xb.scrollTop : 0; U.keepScroll = true; render(); window.scrollTo(0, xy); var xb2 = document.querySelector('.body'); if (xb2) xb2.scrollTop = xs; return; }
    if (act === 'pstat') { U.pstat = a.dataset.k; U.ppage = 1; render(); return; }
    if (act === 'ppg') { U.ppage = Number(a.dataset.n); render(); window.scrollTo(0, 0); return; }
    if (act === 'ttgl') { U.open = U.open || {}; U.open[a.dataset.id] = a.dataset.o !== '1'; render(); return; }
    if (act === 'tgl') {
      U.open = U.open || {}; var on = U.open[a.dataset.id] = !U.open[a.dataset.id], wrap = a.closest('.acc-i, .aw'), pn = wrap && wrap.querySelector('.acc-b');
      a.setAttribute('aria-expanded', String(on)); if (wrap) wrap.classList.toggle('open', on); if (pn) pn.hidden = !on; return;
    }
    if (act === 'mtgl') { var mi = U.draft.ms[Number(a.dataset.i)]; mi.shut = !mi.shut; render(); return; }
    if (act === 'mtglall') { var allShut = U.draft.ms.every(function (x) { return x.shut; }); U.draft.ms.forEach(function (x) { x.shut = !allShut; }); render(); return; }
    if (act === 'dldoc') { var pdx = getP(a.dataset.pid) || P(), mdx = pdx.ms.filter(function (x) { return x.id === a.dataset.id; })[0]; if (mdx) printDoc((a.dataset.t === 'all' ? 'Documents' : a.dataset.t === 'summary' ? 'Receipt' : a.dataset.t === 'invoice' ? 'Invoice' : 'Contract') + ' - ' + pdx.name, docPack(mdx, pdx, a.dataset.t)); return; }
    if (act === 'viewcontract') { U.modal = { t: 'contract', pid: a.dataset.id || D.cur }; render(); return; }
    if (act === 'dlcontract') { var pd = getP(a.dataset.id) || P(); if (pd) printContract(pd); return; }
    if (act === 'pickhdr') { var hf = document.getElementById('hdrfile'); if (hf) hf.click(); return; }
    if (act === 'rmhdr') { setS('contract.header', ''); render(); return; }
    if (act === 'opencontract') { U.ccontract = true; U.sig = freshSig(); U.keepScroll = false; render(); window.scrollTo(0, 0); return; }
    if (act === 'howtgl') { U.how = !U.how; render(); return; }
    if (act === 'closecontract') { U.ccontract = false; U.keepScroll = false; render(); return; }
    if (act === 'sigmode') { U.sig.mode = a.dataset.k; render(); return; }
    if (act === 'sigclear') { U.sig.img = ''; var cv0 = document.getElementById('sigpad'); if (cv0) cv0.getContext('2d').clearRect(0, 0, cv0.width, cv0.height); syncSign(); return; }
    if (act === 'signc') {
      if (!sigReady()) return; var pc = P(); pc.contract = pc.contract || { id: uid() }; pc.contract.cSig = sigValue(pc.client.name); pc.clientIn = true; pc.openedAt = pc.openedAt || new Date().toISOString();
      log('client', first(pc.client.name) + ' signed the contract', pc.id); startNext(pc); save(); U.ccontract = false; U.sig = null; U.keepScroll = false;
      if (advDue(pc)) { U.checkout = 'advance'; U.payErr = ''; U.fieldErr = {}; U.payF = {}; U.scopeOk = false; }
      render(); window.scrollTo(0, 0); toast('thumbs', 'Contract signed', advDue(pc) ? 'Next, pay the ' + inr(advAmt(pc)) + ' advance to start.' : first(D.studio.name) + ' can start now.'); return;
    }
    if (act === 'markpaid') { m = getMs(a.dataset.id); doPay(m, 'manual'); U.sel = m.id; render(); toast('thumbs', 'Marked as paid', 'The originals are unlocked for ' + first(clientName()) + '.'); return; }
    if (act === 'askunlock') { U.modal = { t: 'unlock', id: a.dataset.id }; render(); return; }
    if (act === 'dounlock') { m = getMs(a.dataset.id); doPay(m, 'free'); U.sel = m.id; U.modal = null; render(); toast('thumbs', 'Originals unlocked', first(clientName()) + ' can download them now.'); return; }
    if (act === 'markadv') { doAdvance(P(), 'manual'); render(); toast('thumbs', 'Advance marked as paid', 'Work can start.'); return; }
    if (act === 'invite') { U.modal = { t: 'invite' }; render(); return; }
    if (act === 'copylink') { var v = a.dataset.v; try { navigator.clipboard.writeText(v).then(function () { toast('thumbs', 'Copied', v); }, function () { toast('hello', 'Couldn\'t copy', 'Select the link and copy it.'); }); } catch (er) { toast('hello', 'Couldn\'t copy', 'Select the link and copy it.'); } return; }
    if (act === 'selms') { U.sel = a.dataset.id; U.fi = 0; U.ct = 'cur'; render(); window.scrollTo(0, 0); return; }
    if (act === 'calnav') { var dir = Number(a.dataset.dir); U.cal = new Date(U.cal.getFullYear(), U.cal.getMonth() + dir, 1); var box = document.getElementById('calbox'); if (box) { var all = box.dataset.all; box.innerHTML = box.dataset.big ? bigCalInner(calEvents()) : box.dataset.draft ? draftCal() : calendar(all ? eventsAll() : events(), U.cal, all ? 5 : 4); } else render(); return; }
    if (act === 'remind') { e.stopPropagation(); var rp = getP(a.dataset.id) || P(); if (rp) { U.modal = { t: 'remind', pid: rp.id }; render(); } return; }
    if (act === 'rch') { U.modal.ch = a.dataset.c; render(); return; }
    if (act === 'sendremind') { remind(a.dataset.pid, U.modal && U.modal.ch); closeModal(); return; }
    if (act === 'feemode') { U.draft.feeMode = a.dataset.k; render(); return; }
    if (act === 'askissue') { U.modal = { t: 'issue', id: a.dataset.id }; render(); return; }
    if (act === 'sendissue') {
      m = getMs(a.dataset.id); var ie = document.getElementById('ierr'), inote = ((document.getElementById('inote') || {}).value || '').trim();
      if (!U.modal.r) { if (ie) ie.textContent = 'Choose a reason.'; return; }
      if (inote.length < 10) { if (ie) ie.textContent = 'Add a short description.'; return; }
      doIssue(m, U.modal.r, inote); U.modal = null; render(); toast('guard', 'Problem reported', 'Reply by ' + long(issueBy(m)) + '.'); return;
    }
    if (act === 'withdraw') { m = getMs(a.dataset.id); doWithdraw(m); render(); toast('thumbs', 'Problem withdrawn', 'The deliverable is back to ' + STATUS[m.status][1].toLowerCase() + '.'); return; }
    if (act === 'askrespond') { U.modal = { t: 'respond', id: a.dataset.id }; render(); return; }
    if (act === 'sendrespond') {
      m = getMs(a.dataset.id); var rn = ((document.getElementById('rnote') || {}).value || '').trim();
      if (rn.length < 10) { var re = document.getElementById('rerr'); if (re) re.textContent = 'Write a short reply.'; return; }
      doResolve(m, rn); U.modal = null; render(); toast('thumbs', 'Reply sent'); return;
    }
    if (act === 'dorefund') { m = getMs(a.dataset.id); doRefund(m); U.sel = m.id; U.modal = null; render(); toast('wallet', 'Refund sent', first(clientName()) + ' gets ' + inr(fees(m.amount).total) + ' back.'); return; }
    if (act === 'askextra') { U.modal = { t: 'extra', id: a.dataset.id }; U.busy = false; render(); return; }
    if (act === 'doextra') {
      if (U.busy) return; m = getMs(a.dataset.id); U.busy = true; render();
      setTimeout(function () { U.busy = false; doExtra(m); U.modal = { t: 'changes', id: m.id }; U.fb = { note: '' }; render(); toast('thumbs', 'Round added', 'Now describe what to change.'); var nf2 = document.getElementById('note'); if (nf2) nf2.focus(); }, REDUCE ? 100 : 900);
      return;
    }
    if (act === 'addlink') {
      m = focusMs(); var lin = document.getElementById('lnk'), lu = (lin && lin.value || '').trim(), li = /^https?:\/\//i.test(lu) ? linkInfo(lu) : null;
      if (!m) return; if (!li) { U.upErr = 'Enter a full link that starts with https://'; U.scrollTo = 'lnk'; render(); return; }
      m.links = m.links || []; m.links.push({ id: uid(), url: lu, host: li.host, figma: li.figma, label: li.label, v: m.revisions + 1 }); log('freelancer', 'Added a link to ' + m.name); save(); U.upErr = ''; render(); toast('thumbs', 'Link added', li.label); return;
    }
    if (act === 'rmitem') { m = getMs(a.dataset.m); if (m) { m.files = m.files.filter(function (f) { return f.id !== a.dataset.id; }); m.links = (m.links || []).filter(function (l) { return l.id !== a.dataset.id; }); save(); render(); } return; }
    if (act === 'gotoup') { var cm = currentMs(); U.pt = 'overview'; U.sel = cm ? cm.id : null; U.scrollTo = 'dz'; render(); return; }
    if (act === 'pick') { U.upErr = ''; var fi2 = document.getElementById('fi'); if (fi2) fi2.click(); return; }
    if (act === 'sample') { m = focusMs(); if (m) { U.uploading = [{ name: 'Moodboard.svg' }, { name: 'References.pdf' }, { name: 'Notes.docx' }]; render(); setTimeout(function () { U.uploading = []; attach(m, sampleFiles()); render(); toast('thumbs', '3 files uploaded', 'Previews are ready.'); }, REDUCE ? 50 : 1000); } return; }
    if (act === 'previewas') { U.modal = { t: 'previewas', id: a.dataset.id }; U.fi = 0; render(); return; }
    if (act === 'submit') { m = getMs(a.dataset.id); if (m && items(m).length) { U.modal = null; doSubmit(m); render(); toast('point', 'Sent to ' + first(clientName()), 'Reply due ' + long(replyBy(m)) + '.'); } return; }
    if (act === 'receipt') { if (a.dataset.pid) { D.cur = a.dataset.pid; } U.modal = { t: 'receipt', id: a.dataset.id, pid: a.dataset.pid || D.cur }; U.rtab = 'summary'; render(); return; }
    if (act === 'rtab') { U.rtab = a.dataset.t; render(); return; }
    if (act === 'gocheckout') { U.checkout = a.dataset.id; U.payErr = ''; U.fieldErr = {}; U.payF = {}; U.scopeOk = false; P().clientIn = true; save(); render(); window.scrollTo(0, 0); return; }
    if (act === 'backcheckout') { U.checkout = false; U.payErr = ''; P().clientIn = false; render(); return; }
    if (act === 'paym') { U.payM = a.dataset.k; U.payErr = ''; U.fieldErr = {}; render(); return; }
    if (act === 'pay' || act === 'simqr') {
      e.preventDefault(); var tg0 = payTarget(); if (U.busy || !(tg0.kind === 'balance' || U.scopeOk)) return; var pm = U.payM || 'upi', mm = tg0.m, why = '';
      var PFv = U.payF || {}, fe0 = {};
      if (act === 'pay') {
        var em0 = (document.getElementById('em') || {}).value; if (em0 != null) { var eE = emailErr(em0); if (eE) fe0.em = eE; }
        if (pm === 'upi') { var uid0 = ((document.getElementById('upi') || {}).value || '').trim(); U.upiId = uid0; if (!uid0) fe0.upi = 'Enter your UPI ID.'; else if (!/^[\w.\-]{2,}@[A-Za-z]{2,}$/.test(uid0)) fe0.upi = 'That UPI ID doesn\'t look right. It looks like name@bank.'; else if (/fail/i.test(uid0)) why = 'The payment request wasn\'t approved.'; }
        if (pm === 'card') { var cf = cardErrs({ cnum: (document.getElementById('cnum') || {}).value, ex: (document.getElementById('ex') || {}).value, cv: (document.getElementById('cv') || {}).value }); Object.keys(cf).forEach(function (k) { fe0[k] = cf[k]; }); if (!Object.keys(cf).length && /0002\s*$/.test(((document.getElementById('cnum') || {}).value || '').replace(/\s/g, ''))) why = 'Your card was declined.'; }
      }
      if (Object.keys(fe0).length) { U.fieldErr = fe0; U.payErr = ''; render(); var bad0 = document.querySelector('#payform .input.bad'); if (bad0) bad0.focus(); return; }
      U.fieldErr = {};
      if (why) { U.payErr = why; render(); return; }
      U.busy = true; U.payErr = ''; render();
      setTimeout(function () {
        U.busy = false; U.checkout = false; if (tg0.kind === 'advance') { doAdvance(P(), 'online'); U.modal = { t: 'paid', amount: tg0.amount, name: P().ms[0].name }; } else { doPay(mm, 'online'); U.sel = mm.id; U.modal = { t: 'released', id: mm.id, who: 'client', amount: tg0.amount }; } render();
      }, REDUCE ? 100 : 1100); return;
    }
    if (act === 'file') { U.fi = Number(a.dataset.i); render(); return; }
    if (act === 'askapprove') { U.modal = { t: 'approve', id: a.dataset.id }; render(); return; }
    if (act === 'askchanges') { U.modal = { t: 'changes', id: a.dataset.id }; U.fb = { note: '' }; render(); var nf = document.getElementById('note'); if (nf) nf.focus(); return; }
    if (act === 'approve') { m = getMs(a.dataset.id); doApprove(m); U.sel = m.id; U.modal = { t: 'approved', id: m.id }; render(); return; }
    if (act === 'sendchanges') {
      m = getMs(a.dataset.id); var txt = ((document.getElementById('note') || {}).value || '').trim();
      if (txt.length < 5) { var er2 = document.getElementById('noteerr'); if (er2) er2.textContent = 'Add a short note.'; return; }
      doChanges(m, txt); U.modal = null; U.fi = 0; U.fb = { note: '' }; render(); toast('thumbs', 'Sent to ' + first(D.studio.name), 'Round ' + m.revisions + ' of ' + m.limit + ' used.'); return;
    }
    if (act === 'dlall') { m = getMs(a.dataset.id); var got = 0; if (m) items(m).forEach(function (f) { var u = fileUrl(f); if (u && f.kind !== 'link') { var an = document.createElement('a'); an.href = u; an.download = f.name; document.body.appendChild(an); an.click(); an.remove(); got++; } }); toast('thumbs', 'Downloading ' + (m ? items(m).filter(function (f) { return f.kind !== 'link'; }).length : 0) + ' file' + (m && items(m).filter(function (f) { return f.kind !== 'link'; }).length === 1 ? '' : 's'), got ? '' : 'Sample files have nothing to save here. Real uploads download.'); return; }
    if (act === 'dl') { toast('thumbs', 'Downloading ' + a.dataset.n); return; }
  });
  document.addEventListener('submit', function (e) { e.preventDefault(); });
  function refreshCont() { var b = document.getElementById('cont'); if (b) b.disabled = !setupOk(); }
  function tipFor(e) { var t = e.target && e.target.closest ? e.target.closest('.ibtn,.btn.icon') : null; if (t && !t.dataset.tip) { var l = t.getAttribute('aria-label'); if (l) t.dataset.tip = l.replace(/, \d+ new$/, ''); } }
  document.addEventListener('mouseover', tipFor); document.addEventListener('focusin', tipFor);
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.classList && t.classList.contains('ph-cc')) { phoneSync(t.closest('.phone')); return; }
    if (t.id === 'pcl') { U.pcl = t.value; U.ppage = 1; render(); return; }
    if (t.dataset.cs) { var kk = t.dataset.cs.split(':'); U.cust = U.cust || {}; if (t.value === '__c') { U.cust[kk[0] + kk[1]] = true; render(); var ci = document.querySelector('[data-cv="' + t.dataset.cs + '"]'); if (ci) { ci.focus(); ci.select(); } } else { U.cust[kk[0] + kk[1]] = false; setCS(kk[0], kk[1], Number(t.value)); render(); } return; }
    if (t.id === 'sigagree') { U.sig.agree = t.checked; syncSign(); return; }
    if (t.dataset.s) { setS(t.dataset.s, t.type === 'checkbox' ? t.checked : t.tagName === 'SELECT' ? Number(t.value) : t.value); return; }
    if (t.id === 'brieffile' && t.files[0]) { readBrief(t.files[0]); return; }
    if (t.dataset.df === 'par' && U.draft) { U.draft.ms[Number(t.dataset.di)].par = t.checked; render(); return; }
    if (t.id === 'agree') { U.agree = t.checked; refreshCont(); return; }
    if (t.id === 'scopeok') { U.scopeOk = t.checked; var pb = document.getElementById('paybtn'), ph = document.getElementById('payhint'); if (pb) pb.disabled = !U.scopeOk || U.busy; if (ph) ph.hidden = U.scopeOk; return; }
    if (t.name === 'reason' && U.modal) { U.modal.r = t.value; var ie2 = document.getElementById('ierr'); if (ie2) ie2.textContent = ''; return; }
    if (t.tagName === 'SELECT' && t.dataset.d && U.draft) { U.draft[t.dataset.d] = Number(t.value); return; }
    if (t.id === 'hdrfile' && t.files[0]) { readHeader(t.files[0], function (u) { setS('contract.header', u); render(); }); return; }
    if (t.id === 'plogo' && t.files[0] && U.draft) shrink(t.files[0], function (u) { U.draft.clogo = u; render(); });
    if (t.id === 'elogo' && t.files[0] && U.modal) shrink(t.files[0], function (u) { U.modal.f.logo = u; render(); });
  });
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.classList && t.classList.contains('ph-num')) { phoneSync(t.closest('.phone')); return; }
    if (U.checkout && /^(em|upi|cnum|ex|cv)$/.test(t.id)) { payInput(t); return; }
    if (t.dataset.cv) { var k2 = t.dataset.cv.split(':'); setCS(k2[0], k2[1], Number(String(t.value).replace(/[^0-9]/g, ''))); if (k2[0] === 'd') syncPlanSide(); return; }
    if (t.id === 'sigtype') { U.sig.typed = t.value; var sp = document.getElementById('sigprev'); if (sp) sp.textContent = t.value || ' '; syncSign(); return; }
    if (t.dataset.ec && U.modal && U.modal.f) { U.modal.f[t.dataset.ec] = t.value; return; }
    if (t.id === 'note') { U.fb.note = t.value; return; }
    if (t.id === 'dn') { U.dnote = t.value; return; }
    if (t.dataset.s) { setS(t.dataset.s, t.dataset.s.indexOf('defaults.extraFee') === 0 ? Number(String(t.value).replace(/[^0-9]/g, '')) : t.value); if (t.dataset.s === 'payout.upi') { refreshCont(); t.classList.remove('bad'); } return; }
    if (t.id === 'rmsg' && U.modal) { U.modal.msg = t.value; var rs = document.getElementById('rsend'), rp2 = getP(U.modal.pid); if (rs && rp2) rs.href = remindHref(rp2.client, U.modal.ch, t.value, rp2); return; }
    if (t.id === 'inote' && U.modal) { U.modal.note = t.value; return; }
    if (t.id === 'rnote' && U.modal) { U.modal.note = t.value; return; }
    if (t.id === 'q') { (U.pg = U.pg || {}).c = 1; U.q = t.value; applyF(document.querySelector('.ftable[data-f="c"]')); return; }
    if (t.dataset.in) { var p = t.dataset.in.split('.'); D[p[0]][p[1]] = t.value; save(); return; }
    if (!U.draft) return;
    if (t.dataset.d && t.tagName !== 'SELECT') { U.draft[t.dataset.d] = t.value; if (t.dataset.d === 'name') { var dn = document.getElementById('draftnav'); if (dn) dn.textContent = t.value.trim() || 'Untitled project'; } return; }
    if (t.dataset.di !== undefined) {
      var i = Number(t.dataset.di), f = t.dataset.df; U.draft.ms[i][f] = f === 'amount' ? Number(String(t.value).replace(/[^0-9]/g, '')) : t.value;
      if (f === 'due' && t.value) { var dd = parse(t.value); U.cal = new Date(dd.getFullYear(), dd.getMonth(), 1); }
      var w = document.getElementById('orderwarn'); if (w) w.innerHTML = orderWarn(U.draft);
      U.draft.ms.forEach(function (m0, k) { var di0 = document.getElementById('md' + k); if (di0) di0.min = minDue(U.draft, k); var sg0 = document.getElementById('sg' + k); if (sg0) sg0.innerHTML = sugHTML(k); });
      syncPlanSide();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && U.modal) closeModal();
    /* Presenter controls stay out of sight; press ` to show or hide them. */
    if (e.key === '`' && !e.metaKey && !e.ctrlKey && !/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) && !e.target.isContentEditable) { var pb = document.getElementById('proto'); pb.hidden = !pb.hidden; e.preventDefault(); }
    if (e.key === 'Enter' && e.target.id === 'lnk') { e.preventDefault(); var ab = document.querySelector('[data-a="addlink"]'); if (ab) ab.click(); return; }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && (e.target.classList.contains('fr') || e.target.classList.contains('att') || e.target.classList.contains('easy')) && e.target.dataset.a) { e.preventDefault(); e.target.click(); }
  });
  window.addEventListener('storage', function (e) { if (e.key === KEY) { D = load(); render(); } });

  render();
})();
