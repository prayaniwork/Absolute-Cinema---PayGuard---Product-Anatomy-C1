
(function () {
  'use strict';
  var KEY = 'payguard.proto.v3';
  var META = /*__META__*/{};
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
  function long(d) { return fmt(d, { weekday: 'short', day: 'numeric', month: 'short' }); }
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
  function fees(a) { var f = Math.round(a * 0.055), g = Math.round(f * 0.18), ff = Math.round(a * 0.035); return { fee: f, gst: g, total: a + f + g, ffee: ff, net: a - ff }; }
  function ago(iso0) { var d = new Date(iso0); return Math.max(0, Math.round((TODAY - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000)); }
  function dIso(off) { return iso(addDays(TODAY, off)); }

  /* ---------------- state ---------------- */
  function fresh() { return { v: 3, onboarded: false, role: 'freelancer', studio: { name: 'Meera Iyer', biz: 'Meera Iyer Studio', brand: 0 }, projects: [], cur: null, log: [], samples: false }; }
  var D = load();
  var MEM = {};
  function blankU() { return { calClient: '', more: false, waitOpen: false, view: 'today', pt: 'overview', setup: false, plan: false, filter: 'all', q: '', cf: 'all', pf: 'all', cal: new Date(TODAY.getFullYear(), TODAY.getMonth(), 1), sel: null, modal: null, draft: null, uploading: [], busy: false, checkout: false, payErr: '', fi: 0, rtab: 'summary', agree: false, fb: { note: '' } }; }
  var U = blankU();
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 3) return s; } catch (e) {} return fresh(); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) {} }
  function log(who, text, pid) { D.log.unshift({ t: new Date().toISOString(), who: who, text: text, pid: pid || D.cur }); D.log = D.log.slice(0, 200); }

  function P() { return D.projects.filter(function (p) { return p.id === D.cur; })[0] || null; }
  function ms() { return P() ? P().ms : []; }
  function unreleased(p) { return p.ms.filter(function (m) { return m.status !== 'released'; }); }
  function currentMsOf(p) { return unreleased(p)[0] || null; }
  function currentMs() { return P() ? currentMsOf(P()) : null; }
  function focusMs() { var p = P(); if (!p) return null; var s = U.sel && p.ms.filter(function (m) { return m.id === U.sel; })[0]; return s || currentMsOf(p) || p.ms[p.ms.length - 1] || null; }
  function org(p) { return p.client.org || p.client.name; }
  function clientName() { return P() ? P().client.name : 'Your client'; }
  function replyBy(m) { return m.replyBy ? parse(m.replyBy) : null; }
  function getMs(id) { return ms().filter(function (m) { return m.id === id; })[0]; }
  function getP(id) { return D.projects.filter(function (p) { return p.id === id; })[0] || null; }
  function pickCur() { var own = D.projects.filter(function (p) { return !p.sample; }); return (own[own.length - 1] || D.projects[0] || {}).id || null; }
  var STATUS = { draft: ['draft', 'Not funded'], funded: ['funded', 'Funded'], submitted: ['submitted', 'Awaiting approval'], changes: ['changes', 'Changes requested'], released: ['released', 'Released'] };
  function badge(st) { var s = STATUS[st] || STATUS.draft; return '<span class="badge ' + s[0] + '">' + s[1] + '</span>'; }
  /* One vocabulary for money: Not funded, Overdue, Funded, Awaiting approval, Payment processing, Released (client view), Paid.
     The freelancer sees Payment processing for 2 days after approval, then Paid. The client simply sees Released. */
  function fundLate(p, m) { if (m.status !== 'draft') return false; if (days(parse(m.due)) < 0) return true; var a = currentMsOf(p) === m && attentionFor(p); return !!(a && a.kind === 'fund' && a.sev === 'red'); }
  function payState(m, p, role, money) {
    if (m.status === 'released') return role === 'client' ? ['released', 'Released'] : (m.releasedAt && ago(m.releasedAt) < 2 ? ['processing', 'Payment processing'] : ['paid', 'Paid']);
    if (m.status === 'draft') return role !== 'client' && fundLate(p, m) ? ['overdue', 'Overdue'] : STATUS.draft;
    if (m.status === 'changes' && money) return STATUS.funded;
    return STATUS[m.status] || STATUS.draft;
  }
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
  function newMs(name, amount, due, rounds) { return { id: uid(), name: name, amount: amount, due: due, status: 'draft', files: [], revisions: 0, limit: rounds || 2, notes: [], replyBy: null, seen: {} }; }
  function sMs(name, amount, off, status, o) {
    o = o || {}; var m = newMs(name, amount, dIso(off)); m.status = status; m.seen = { funded: true, released: true, changes: true, submitted: true };
    if (status !== 'draft') m.fundedAt = new Date(TODAY.getTime() - (o.fundedAgo || 12) * 86400000).toISOString();
    if (status === 'submitted') { m.submittedAt = new Date(TODAY.getTime() - (o.subAgo == null ? 1 : o.subAgo) * 86400000).toISOString(); m.replyBy = dIso(o.reply == null ? 2 : o.reply); }
    if (status === 'changes') { m.revisions = 1; m.notes = [{ v: 1, text: o.note || 'Can we make the layout feel more open?', at: new Date().toISOString() }]; }
    if (status === 'released') m.releasedAt = new Date(TODAY.getTime() - (o.relAgo || 6) * 86400000).toISOString();
    if (o.files) m.files = o.files; return m;
  }
  function docFiles(names) { return names.map(function (n) { return { id: uid(), name: n[0], size: n[1], kind: n[2], url: '', v: 1 }; }); }
  function seedProjects() {
    var SC = { 'Bloom Studio': 5, 'Acme Logistics': 0, 'Northwind Cafe': 2, 'Tidal Health': 1, 'Orbit Labs': 3, 'Greenleaf Foods': 6, 'Lumen Realty': 4, 'Studio Nine': 7 }, SL = { 'Acme Logistics': logoSvg('tri', CC[0]), 'Orbit Labs': logoSvg('ring', CC[3]), 'Greenleaf Foods': logoSvg('leaf', CC[6]) };
    var P1 = function (name, cname, corg, askedAgo, clientIn, list) { return { id: uid(), sample: true, name: name, client: { name: cname, org: corg, color: SC[corg], logo: SL[corg] || '', email: first(cname).toLowerCase() + '@' + corg.toLowerCase().replace(/[^a-z]/g, '') + '.example' }, ms: list, clientIn: clientIn, askedAt: new Date(TODAY.getTime() - askedAgo * 86400000).toISOString(), reviewDays: 3, createdAt: new Date(TODAY.getTime() - (askedAgo + 2) * 86400000).toISOString() }; };
    return [
      P1('Website redesign', 'Priya Nair', 'Bloom Studio', 30, true, [sMs('Discovery', 30000, -20, 'released'), sMs('Homepage design', 60000, -1, 'submitted', { reply: -1, subAgo: 4, files: sampleFiles().map(function (f) { f.v = 1; return f; }) }), sMs('Inner pages', 45000, 18, 'draft'), sMs('Handoff', 25000, 30, 'draft')]),
      P1('Dashboard UI kit', 'Rohit Mehta', 'Acme Logistics', 40, true, [sMs('Audit', 20000, -30, 'released'), sMs('Wireframes', 45000, -10, 'released'), sMs('UI kit', 70000, 2, 'funded'), sMs('Prototype', 35000, 20, 'draft')]),
      P1('Menu and packaging', 'Sana Qureshi', 'Northwind Cafe', 5, true, [sMs('Concepts', 35000, 3, 'draft'), sMs('Final artwork', 40000, 24, 'draft')]),
      P1('Onboarding flows', 'Vikram Rao', 'Tidal Health', 25, true, [sMs('Research', 40000, -14, 'released'), sMs('Flows', 55000, 5, 'changes', { note: 'The second step feels crowded. Can we split it into two screens?' }), sMs('Specs', 30000, 25, 'draft')]),
      P1('Pitch deck', 'Neha Kapoor', 'Orbit Labs', 28, true, [sMs('Story', 22000, -18, 'released', { relAgo: 16 }), sMs('Design', 38000, -8, 'released', { relAgo: 6 }), sMs('Final deck', 20000, -4, 'released', { relAgo: 1 })]),
      P1('Social campaign', 'Anil Shah', 'Greenleaf Foods', 1, true, [sMs('Strategy', 28000, -12, 'released', { relAgo: 10 }), sMs('Content calendar', 32000, 9, 'draft'), sMs('Creatives', 50000, 30, 'draft')]),
      P1('Brochure', 'Karan Bhatia', 'Lumen Realty', 3, false, [sMs('Layout', 38000, 12, 'draft'), sMs('Print-ready files', 22000, 26, 'draft')]),
      P1('Illustration set', 'Isha Verma', 'Studio Nine', 20, true, [sMs('Style frames', 52000, 8, 'funded'), sMs('Final set', 48000, 22, 'draft')])
    ];
  }

  /* ---------------- what needs attention ---------------- */
  var SEV = { red: 0, amber: 1, blue: 2, yellow: 3 };
  var BUCKET = { red: 'overdue', amber: 'needs', blue: 'needs', yellow: 'waiting' };
  function attentionFor(p) {
    var m = currentMsOf(p); if (!m) return null; var c = first(p.client.name), age = p.askedAt ? ago(p.askedAt) : 0, due = parse(m.due), dd = days(due), it = { pid: p.id, mid: m.id, org: org(p), project: p.name, ms: m.name, amount: m.amount };
    var pl = function (n) { return n + ' day' + (n === 1 ? '' : 's'); };
    if (m.status === 'draft') {
      var all0 = p.ms.every(function (x) { return x.status === 'draft'; });
      if (!p.clientIn && all0 && age >= 2) return Object.assign(it, { kind: 'invite', sev: 'yellow', text: 'Invite not opened yet', ctx: 'link sent ' + agoTxt(p.askedAt), cta: 'Resend to ' + c, act: 'remind' });
      if (age >= 3 || dd < 0) return Object.assign(it, { kind: 'fund', sev: 'red', text: 'Not funded · ' + pl(Math.max(age - 2, -dd, 1)) + ' overdue', ctx: 'you asked ' + agoTxt(p.askedAt) + ' · stage due ' + long(due), cta: 'Remind ' + c, act: 'remind' });
      return Object.assign(it, { kind: 'fund', sev: 'yellow', text: 'Waiting for ' + c + ' to fund', ctx: 'you asked ' + agoTxt(p.askedAt) + ' · stage due ' + long(due), cta: 'Remind ' + c, act: 'remind' });
    }
    if (m.status === 'submitted') {
      var rb = replyBy(m), rd = days(rb), sub = m.submittedAt ? 'you submitted ' + agoTxt(m.submittedAt) + ' · ' : '';
      return rd < 0 ? Object.assign(it, { kind: 'approve', sev: 'red', text: 'Awaiting approval · ' + pl(Math.abs(rd)) + ' past the reply date', ctx: sub + 'reply was due ' + long(rb), cta: 'Nudge ' + c, act: 'remind' })
        : Object.assign(it, { kind: 'approve', sev: 'yellow', text: 'Awaiting approval', ctx: sub + 'reply by ' + long(rb), cta: 'Nudge ' + c, act: 'remind' });
    }
    if (m.status === 'changes') { var nt = m.notes.length ? m.notes[m.notes.length - 1].text : ''; return Object.assign(it, { kind: 'changes', sev: 'amber', text: c + ' asked for changes · round ' + m.revisions + ' of ' + m.limit, ctx: nt ? '“' + (nt.length > 70 ? nt.slice(0, 68) + '…' : nt) + '”' : 'open the note', cta: 'Open', act: 'openp' }); }
    if (m.status === 'funded') {
      var fd = m.fundedAt ? 'funded ' + agoTxt(m.fundedAt) + ' · ' : '';
      if (dd < 0) return Object.assign(it, { kind: 'deliver', sev: 'red', text: 'Delivery date passed ' + pl(Math.abs(dd)) + ' ago', ctx: fd + 'was due ' + long(due), cta: 'Upload', act: 'openp' });
      if (dd <= 7) return Object.assign(it, { kind: 'deliver', sev: 'blue', text: 'Delivery due ' + rel(due), ctx: fd + 'due ' + long(due), cta: 'Upload', act: 'openp' });
    }
    return null;
  }
  function attention() { var out = []; D.projects.forEach(function (p) { var a = attentionFor(p); if (a) out.push(a); }); return out.sort(function (a, b) { return SEV[a.sev] - SEV[b.sev] || a.amount - b.amount; }); }
  function projStatus(p) {
    if (!currentMsOf(p)) return { k: 'complete', label: 'Complete', cls: 'released' };
    var a = attentionFor(p); if (!a) return { k: 'track', label: 'On track', cls: 'funded' };
    return a.sev === 'red' ? (a.kind === 'fund' ? { k: 'late', label: 'Overdue', cls: 'overdue' } : a.kind === 'approve' ? { k: 'late', label: 'Awaiting approval', cls: 'submitted' } : { k: 'late', label: 'Needs you', cls: 'changes' }) : a.sev === 'yellow' ? { k: 'waiting', label: 'Waiting on client', cls: 'submitted' } : { k: 'needs', label: 'Needs you', cls: 'changes' };
  }
  /* ---------------- data actions ---------------- */
  function validateDraft(d) {
    var e = {}; if (!d.name.trim()) e.name = 'Give the project a name'; if (!d.cname.trim()) e.cname = 'Add your client\'s name';
    if (!/^\S+@\S+\.\S+$/.test(d.cemail.trim())) e.cemail = 'Enter a valid email';
    d.ms.forEach(function (m, i) {
      if (!m.name.trim()) e['n' + i] = 'Name this stage'; if (!(Number(m.amount) > 0)) e['a' + i] = 'Enter an amount';
      if (!m.due || parse(m.due) < TODAY) e['d' + i] = 'Pick a date from today on';
      else if (i > 0 && d.ms[i - 1].due && m.due < d.ms[i - 1].due) e['d' + i] = 'Must come after stage ' + i;
    });
    return e;
  }
  function defaultDraft() {
    return { name: 'Brand identity', cname: 'Arjun Rao', corg: 'Kiln & Co.', cemail: 'arjun@kilnandco.example', ccolor: nextColor(), clogo: '', reviewDays: 3, rounds: 2, err: {}, ms: [
      { name: 'Discovery and moodboard', amount: 25000, due: dIso(7) }, { name: 'Logo concepts', amount: 40000, due: dIso(21) },
      { name: 'Brand guidelines', amount: 35000, due: dIso(42) }, { name: 'Collateral set', amount: 20000, due: dIso(56) }] };
  }
  function totalDraft() { return U.draft.ms.reduce(function (a, m) { return a + (Number(m.amount) || 0); }, 0); }
  function fileKind(n, t) { return /^image\//.test(t) ? 'image' : /pdf/i.test(t + n) ? 'pdf' : 'doc'; }
  function fileTag(f) { return f.kind === 'image' ? 'IMG' : f.kind === 'pdf' ? 'PDF' : (/\.(zip|rar)$/i.test(f.name) ? 'ZIP' : 'DOC'); }
  function size(b) { return b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
  function fileUrl(f) { return f.url || MEM[f.id] || ''; }
  var SAMPLE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400"><rect width="640" height="400" fill="#F2EEE7"/><rect x="32" y="32" width="250" height="200" rx="8" fill="#B4532A"/><circle cx="157" cy="132" r="56" fill="#E8A33D"/><rect x="298" y="32" width="150" height="96" rx="8" fill="#2A211C"/><rect x="464" y="32" width="144" height="96" rx="8" fill="#D9C7B0"/><rect x="298" y="144" width="310" height="88" rx="8" fill="#8C9A7E"/><path d="M32 360q80-90 160 0t160 0 160 0 96 0" fill="none" stroke="#2A211C" stroke-width="6"/><text x="32" y="270" font-family="sans-serif" font-weight="700" font-size="22" fill="#2A211C">Warm, handmade, quietly precise</text><text x="32" y="294" font-family="sans-serif" font-size="14" fill="#6C5E55">Direction A · clay, ember, ink</text></svg>';
  function sampleFiles() { return [{ id: uid(), name: 'Moodboard.svg', size: '18 KB', kind: 'image', url: 'data:image/svg+xml;utf8,' + encodeURIComponent(SAMPLE_SVG) }, { id: uid(), name: 'References.pdf', size: '2.4 MB', kind: 'pdf', url: '' }, { id: uid(), name: 'Notes.docx', size: '120 KB', kind: 'doc', url: '' }]; }
  function attach(m, files) { var v = m.revisions + 1; files.forEach(function (f) { f.v = v; m.files.push(f); }); log('freelancer', 'Added ' + files.length + ' file' + (files.length > 1 ? 's' : '') + ' to ' + m.name); save(); }
  function readFiles(m, list) {
    var arr = Array.prototype.slice.call(list || []); if (!arr.length) return;
    var batch = arr.map(function (f) { return { id: uid(), name: f.name, size: size(f.size), kind: fileKind(f.name, f.type), url: '', raw: f }; });
    U.uploading = batch.map(function (b) { return { name: b.name, size: b.size }; }); render();
    var pending = batch.length;
    batch.forEach(function (b) {
      var done = function () { delete b.raw; if (--pending === 0) setTimeout(function () { U.uploading = []; attach(m, batch); render(); toast('thumbs', batch.length + (batch.length > 1 ? ' files' : ' file') + ' ready', 'Protected previews were made automatically.'); }, REDUCE ? 50 : 1000); };
      if (b.kind === 'image' && b.raw.size < 1500000) { var r = new FileReader(); r.onload = function () { b.url = r.result; done(); }; r.onerror = done; r.readAsDataURL(b.raw); }
      else { try { MEM[b.id] = URL.createObjectURL(b.raw); } catch (e) {} done(); }
    });
  }
  function doFund(m) { m.status = 'funded'; m.fundedAt = new Date().toISOString(); log('client', first(clientName()) + ' funded ' + m.name + ' (' + inr(m.amount) + ')'); save(); }
  function doSubmit(m) { m.status = 'submitted'; m.submittedAt = new Date().toISOString(); m.replyBy = dIso(P().reviewDays || 3); m.seen.submitted = false; log('freelancer', 'Submitted ' + m.name + ' for review'); save(); }
  function doApprove(m) { m.status = 'released'; m.releasedAt = new Date().toISOString(); m.seen.released = false; log('client', first(clientName()) + ' approved ' + m.name + '. ' + inr(m.amount) + ' released'); save(); }
  function doChanges(m, text) { m.revisions++; m.status = 'changes'; m.replyBy = null; m.seen.changes = false; m.notes.push({ v: m.revisions, text: text, at: new Date().toISOString() }); log('client', first(clientName()) + ' asked for changes on ' + m.name + ' (round ' + m.revisions + ' of ' + m.limit + ')'); save(); }

  /* ---------------- toasts ---------------- */
  function toast(b, title, msg) {
    var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status');
    t.innerHTML = '<span class="chip">' + buddy(b, 34) + '</span><div><b>' + esc(title) + '</b>' + (msg ? '<span class="m">' + esc(msg) + '</span>' : '') + '</div>';
    var box = document.getElementById('toasts'); while (box.children.length >= 3) box.removeChild(box.firstChild);
    box.appendChild(t); var ctl = mountBuddy(t.querySelector('.bd'), false, false);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 260); }, 4200);
  }

  /* ---------------- calendar ---------------- */
  function eventsOf(p, all) {
    var out = [], col = ccol(p); p.ms.forEach(function (m, i) {
      var tag = all ? org(p) : 'Milestone ' + (i + 1);
      out.push({ date: parse(m.due), kind: m.status === 'released' ? 'done' : 'due', label: m.name, sub: tag + (m.status === 'released' ? ' · Released' : ' · Delivery'), pid: p.id, color: col });
      if (m.status === 'submitted' && m.replyBy) out.push({ date: parse(m.replyBy), kind: 'rv', label: 'Review closes', sub: (all ? org(p) + ' · ' : '') + m.name, pid: p.id, color: col });
    }); return out;
  }
  function eventsAll() { var out = []; D.projects.forEach(function (p) { out = out.concat(eventsOf(p, true)); }); return out.sort(function (a, b) { return a.date - b.date; }); }
  function events() { return P() ? eventsOf(P(), false).sort(function (a, b) { return a.date - b.date; }) : []; }
  function calendar(evs, month, limit) {
    var first1 = new Date(month.getFullYear(), month.getMonth(), 1), lead = (first1.getDay() + 6) % 7, start = addDays(first1, -lead), h = '';
    ['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach(function (d) { h += '<div class="dow">' + d + '</div>'; });
    for (var k = 0; k < 42; k++) {
      var d = addDays(start, k); if (k >= 35 && d.getMonth() !== month.getMonth()) break;
      var e = evs.filter(function (x) { return same(x.date, d); }), c = 'd' + (d.getMonth() !== month.getMonth() ? ' out' : '') + (same(d, TODAY) ? ' today' : '') + (e.length ? ' has' : '');
      h += '<div class="' + c + '"' + (e.length ? ' style="--c:' + e[0].color + '" title="' + esc(e.map(function (x) { return x.label + ' · ' + x.sub; }).join('\n')) + '"' : '') + '><span>' + d.getDate() + '</span>' + (e.length ? '<span class="dots">' + e.slice(0, 3).map(function (x) { return '<i class="' + x.kind + '" style="--c:' + x.color + '"></i>'; }).join('') + '</span>' : '') + '</div>';
    }
    var up = evs.filter(function (x) { return x.date >= TODAY && x.kind !== 'done'; }).slice(0, limit || 4);
    return '<div class="card-b"><div class="cal-head"><b style="font-size:14px">' + fmt(month, { month: 'long', year: 'numeric' }) + '</b><span style="display:flex;gap:4px"><button data-a="calnav" data-dir="-1" aria-label="Previous month">‹</button><button data-a="calnav" data-dir="1" aria-label="Next month">›</button></span></div>' +
      '<div class="cal-grid">' + h + '</div>' +
      (up.length ? '<ul class="ag" style="margin-top:12px">' + up.map(function (x) { return '<li style="--c:' + x.color + ';' + (x.pid ? 'cursor:pointer' : '') + '"' + (x.pid ? ' data-a="openp" data-id="' + x.pid + '"' : '') + '><div class="dt"><b>' + x.date.getDate() + '</b><span>' + fmt(x.date, { month: 'short' }) + '</span></div><div style="min-width:0"><div style="font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(x.label) + '</div><div class="muted" style="font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(x.sub) + '</div></div><span class="muted" style="font-size:12px;white-space:nowrap">' + rel(x.date) + '</span></li>'; }).join('') + '</ul>' : '<p class="muted" style="margin-top:12px">Nothing coming up.</p>') + '</div>';
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
      h += '<div class="cell' + (d.getMonth() !== month.getMonth() ? ' out' : '') + (same(d, TODAY) ? ' today' : '') + '"><span class="num">' + d.getDate() + '</span>' + e.slice(0, 3).map(function (x) { return '<span class="chip ' + x.kind + '" style="--c:' + x.color + '" title="' + esc(x.label + ' · ' + x.sub) + '"' + (x.pid ? ' data-a="openp" data-id="' + x.pid + '"' : '') + '>' + esc(x.kind === 'rv' ? 'Review closes' : (x.sub.split(' · ')[0] + ': ' + x.label)) + '</span>'; }).join('') + (more ? '<span class="muted" style="font-size:11px">+' + more + ' more</span>' : '') + '</div>';
    }
    return calLegend() + '<div class="card-b"><div class="cal-head"><b style="font-size:18px;font-weight:600;letter-spacing:-.02em">' + fmt(month, { month: 'long', year: 'numeric' }) + '</b><span style="display:flex;gap:4px"><button data-a="calnav" data-dir="-1" aria-label="Previous month">‹</button><button data-a="calnav" data-dir="1" aria-label="Next month">›</button></span></div><div class="bigcal">' + h + '</div></div>';
  }
  /* ---------------- shared bits ---------------- */
  function brandStyle() { return 'style="--brand:' + BRANDS[D.studio.brand] + '"'; }
  function mark() { return '<span class="m">' + ico('shield') + '</span>'; }
  function avatarFor(p, big) { return avatarHTML({ org: org(p), name: p.client.name, color: p.client.color, logo: p.client.logo }, big); }
  function msRows() {
    return '<ul class="rows">' + ms().map(function (m, i) {
      var cur = currentMs() && currentMs().id === m.id, sel = focusMs() && focusMs().id === m.id;
      return '<li data-a="selms" data-id="' + m.id + '" class="' + (cur ? 'cur ' : '') + (sel ? 'sel' : '') + '"><span class="n">' + (m.status === 'released' ? ico('check', '') : (i + 1)) + '</span><div><div class="nm">' + esc(m.name) + '</div><div class="sub">Due ' + long(parse(m.due)) + (m.status === 'submitted' && m.replyBy ? ' · reply by ' + long(parse(m.replyBy)) : '') + '</div></div><span class="mono">' + inr(m.amount) + '</span>' + stBadge(m) + '</li>';
    }).join('') + '</ul>';
  }
  function previewStage(f, unlocked) {
    var inner;
    if (f && f.kind === 'image' && fileUrl(f)) inner = '<img src="' + esc(fileUrl(f)) + '" alt="' + esc(f.name) + '" draggable="false">';
    else inner = '<div class="docp"><div class="pg"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><b style="font-weight:500">' + esc(f ? f.name : 'No file') + '</b><span style="font-size:12px;color:#71717A">Protected preview</span></div>';
    var wm = unlocked ? '' : '<div class="wm" aria-hidden="true">' + new Array(17).join('<span>PREVIEW · PAYGUARD</span>') + '</div>';
    return '<div class="stage" data-protect="' + (unlocked ? '0' : '1') + '">' + inner + wm + '</div>';
  }
  function money(n) { return '<span class="mono">' + inr(n) + '</span>'; }
  function sheetHTML(m, p, which) {
    var f = fees(m.amount), s = D.studio, c = p.client, id = m.id.toUpperCase().slice(0, 4), paid = m.fundedAt ? new Date(m.fundedAt) : TODAY, d0 = fmt(paid, { day: 'numeric', month: 'short', year: 'numeric' });
    if (which === 'invoice') return '<div class="sheet"><p class="mt">INVOICE FROM ' + esc(s.biz.toUpperCase()) + '</p><h4>INV-' + id + '</h4><div class="mt">Issued ' + d0 + '</div><hr><div class="ln"><span class="mt">From</span><span>' + esc(s.biz) + '</span></div><div class="ln"><span class="mt">To</span><span>' + esc(org(p)) + '</span></div><hr><div class="ln"><span>' + esc(m.name) + '</span><span>' + inr(m.amount) + '</span></div><div class="ln t"><span>Total for the work</span><span>' + inr(m.amount) + '</span></div><hr><div class="mt">This is the invoice for the work itself. Tax details follow ' + esc(s.biz) + '\'s own registration. Layout shown is a prototype.</div></div>';
    var fl = D.role !== 'client';
    if (which === 'fee' && fl) return '<div class="sheet"><p class="mt">PAYGUARD SERVICE FEE</p><h4>FEE-' + id + '</h4><div class="mt">Issued ' + d0 + '</div><hr><div class="ln"><span class="mt">From</span><span>PayGuard</span></div><div class="ln"><span class="mt">To</span><span>' + esc(s.biz) + '</span></div><hr><div class="ln"><span>' + esc(m.name) + '</span><span>' + inr(m.amount) + '</span></div><div class="ln"><span>PayGuard fee (example 3.5%)</span><span>' + inr(f.ffee) + '</span></div><div class="ln t"><span>You receive</span><span>' + inr(f.net) + '</span></div><hr><div class="mt">Billed by PayGuard to you for running the milestone. Separate from your invoice for the work. Tax details to be confirmed.</div></div>';
    if (which === 'fee') return '<div class="sheet"><p class="mt">PAYGUARD SERVICE FEE</p><h4>FEE-' + id + '</h4><div class="mt">Issued ' + d0 + '</div><hr><div class="ln"><span class="mt">From</span><span>PayGuard</span></div><div class="ln"><span class="mt">To</span><span>' + esc(org(p)) + '</span></div><hr><div class="ln"><span>Service fee (example 5.5%)</span><span>' + inr(f.fee) + '</span></div><div class="ln"><span>GST 18% on fee</span><span>' + inr(f.gst) + '</span></div><div class="ln t"><span>Total fee</span><span>' + inr(f.fee + f.gst) + '</span></div><hr><div class="mt">Billed by PayGuard for running the milestone. Separate from the invoice for the work.</div></div>';
    var pst = payState(m, p, D.role), payout = fl ? '<hr><div class="ln"><span>Your stage</span><span>' + inr(m.amount) + '</span></div><div class="ln"><span>PayGuard fee (example 3.5%)</span><span>−' + inr(f.ffee) + '</span></div><div class="ln t"><span>You receive</span><span>' + inr(f.net) + '</span></div>' : '';
    return '<div class="sheet">' + (m.status === 'released' ? '<span class="stamp">' + (pst[0] === 'processing' ? 'PROCESSING' : pst[0] === 'paid' ? 'PAID' : 'RELEASED') + '</span>' : '') + '<p class="mt">PAYMENT SUMMARY</p><h4>RCT-' + id + '</h4><div class="mt">' + (m.releasedAt ? 'Approved ' + fmt(new Date(m.releasedAt), { day: 'numeric', month: 'short', year: 'numeric' }) : 'Funded ' + d0) + '</div><hr><div class="ln"><span class="mt">Paid by</span><span>' + esc(c.name) + '</span></div><div class="ln"><span class="mt">Method</span><span>Card ···· 4242</span></div><div class="ln"><span class="mt">Reference</span><span>pay_' + m.id + '</span></div><hr><div class="ln"><span>' + esc(m.name) + ' (to ' + esc(s.biz) + ')</span><span>' + inr(m.amount) + '</span></div><div class="ln"><span>PayGuard service fee</span><span>' + inr(f.fee) + '</span></div><div class="ln"><span>GST on service fee</span><span>' + inr(f.gst) + '</span></div><div class="ln t"><span>Total paid by ' + esc(first(c.name)) + '</span><span>' + inr(f.total) + '</span></div>' + payout + '<hr><div class="mt">Funded → delivered → ' + (m.revisions ? 'revised ' + m.revisions + '× → ' : '') + (m.status === 'released' ? 'approved → released.' : m.status === 'submitted' ? 'awaiting approval.' : 'in progress.') + '</div></div>';
  }

  /* ---------------- freelancer: landing, setup ---------------- */
  function shotHTML() {
    var seeds = seedProjects(), items = [];
    seeds.forEach(function (p) { var a = attentionFor(p); if (a) items.push({ a: a, p: p }); });
    items.sort(function (x, y) { return SEV[x.a.sev] - SEV[y.a.sev]; });
    var need = items.filter(function (x) { return x.a.sev !== 'yellow'; }).slice(0, 4), wait = items.filter(function (x) { return x.a.sev === 'yellow'; }).length;
    var evs = []; seeds.forEach(function (p) { evs = evs.concat(eventsOf(p, true)); }); evs.sort(function (a, b) { return a.date - b.date; });
    var rows = need.map(function (x) { return attRow(x.a, x.p, true); }).join('');
    return '<div class="shot" role="img" aria-label="The Today screen: four things that need attention, a colour-coded calendar and the money expected this month"><div class="chrome"><span class="dots3"><i></i><i></i><i></i></span><span class="url">payguard.app/today</span></div>' +
      '<div class="shot-in"><div class="shot-main"><p class="muted" style="font-size:12px">' + fmt(TODAY, { weekday: 'long', day: 'numeric', month: 'long' }) + '</p><p class="shot-h">Good morning, Meera</p><p class="muted" style="font-size:12px;margin:2px 0 14px"><b class="fgb">' + need.length + ' things need you</b>: ' + needBreak(need.map(function (x) { return x.a; })) + ' · ' + wait + ' waiting on clients</p>' +
      '<div class="card focus"><div class="card-h"><h3>Needs you today</h3><span class="badge funded">' + need.length + '</span></div><ul class="att-list" style="margin-top:6px">' + rows + '</ul></div></div>' +
      '<div class="shot-side"><div class="card">' + calendar(evs, new Date(TODAY.getFullYear(), TODAY.getMonth(), 1), 2) + '</div></div></div></div>';
  }
  function sLanding() {
    var faces = seedProjects().slice(0, 5).map(function (p) { return avatarFor(p); }).join('');
    return '<div class="lp" ' + brandStyle() + '><header class="lp-nav"><span class="logo">' + mark() + 'PayGuard</span><nav class="lp-links"><button class="linkb" data-a="scroll" data-t="how">How it works</button><button class="linkb" data-a="scroll" data-t="why">Why PayGuard</button></nav><div style="display:flex;gap:8px;align-items:center"><button class="btn ghost" data-a="start">Sign in</button><button class="btn" data-a="start">Get started</button></div></header>' +
      '<section class="lp-hero"><p class="lbl">For freelancers with 5 to 15 clients</p><h1>Run your freelance business like a business.</h1><p class="sub">Every client, project, approval and payment in one calm place, so you stop chasing people on WhatsApp.</p>' +
      '<div class="lp-cta"><button class="btn lg" data-a="start">Get started ' + ico('chev') + '</button><button class="btn lg outline" data-a="peek">See a busy day</button></div><p class="muted" style="font-size:12px">Your clients never need an account.</p></section>' +
      '<section class="lp-shotwrap">' + shotHTML() + '</section>' +
      '<section class="lp-sec" id="why"><div class="lp-head"><p class="lbl">Why PayGuard</p><h2>Know who needs you. Skip the chasing.</h2></div><div class="lp-grid">' +
      '<div class="card lp-card lead"><div class="lp-frag"><span class="faces">' + faces + '</span><span class="badge outline">4 need you today</span></div><h3>Every client, one calm Today screen</h3><p class="muted">Each client gets their own color and logo. Open PayGuard and see who needs you, who is waiting, and what is coming up.</p></div>' +
      '<div class="card lp-card"><div class="lp-frag"><span class="linkchip">' + ico('link') + 'payguard.app/p/kiln-x7</span></div><h3>Less admin, fewer follow-ups</h3><p class="muted">Send one link per project. Your client sees the plan, funds a stage, reviews the work and approves it, all in one place.</p></div>' +
      '<div class="card lp-card"><div class="lp-frag"><span class="mono">₹40,000</span><span class="badge funded">Funded</span></div><h3>Get paid with less chasing</h3><p class="muted">Each stage is funded before you start, so you\'re not left following up after the work is done.</p></div></div></section>' +
      '<section class="lp-sec" id="how"><div class="lp-head"><p class="lbl">How it works</p><h2>From plan to paid in four steps</h2></div><ol class="lp-steps">' +
      '<li><i>1</i><b>Plan the project</b><span>Your stages, amounts and dates. Your terms.</span></li><li><i>2</i><b>Client funds a stage</b><span>One link, paid by card or UPI.</span></li><li><i>3</i><b>You deliver</b><span>Upload once. A protected preview is made for you.</span></li><li><i>4</i><b>They approve, you are paid</b><span>With a reply-by date, so nobody waits in silence.</span></li></ol></section>' +
      '<section class="lp-sec"><div class="card lp-final"><div>' + buddy('thumbs', 120) + '</div><div class="lp-finaltext"><h2>Start with your first client.</h2><p class="muted">It takes about two minutes. Add the rest whenever you are ready.</p></div><button class="btn lg" data-a="start">Get started ' + ico('chev') + '</button></div></section>' +
      '<footer class="lp-foot"><span class="logo">' + mark() + 'PayGuard</span><span class="muted" style="font-size:12px">A working prototype. Names, amounts and dates are examples.</span></footer></div>';
  }
  function sSetup() {
    var s = D.studio, ok = U.agree;
    return '<div class="centerpage"><div class="formcard"><span class="logo">' + mark() + 'PayGuard</span><div style="display:flex;align-items:center;gap:16px">' + buddy('hello', 84) + '<div><p class="lbl">Step 1 of 2</p><h1 class="h1">Let\'s set up your studio</h1></div></div>' +
      '<div class="card" style="padding:20px;display:grid;gap:16px"><div class="field"><label for="s-name">Your name</label><input class="input" id="s-name" data-in="studio.name" value="' + esc(s.name) + '"></div><div class="field"><label for="s-biz">Studio or business name</label><input class="input" id="s-biz" data-in="studio.biz" value="' + esc(s.biz) + '"></div>' +
      '<div class="field"><label>Your color (your clients see it)</label><div class="swatches">' + BRANDS.map(function (c, i) { return '<button class="sw" data-a="brand" data-i="' + i + '" aria-pressed="' + (s.brand === i) + '" aria-label="Color ' + (i + 1) + '" style="background:' + c + '"></button>'; }).join('') + '</div></div></div>' +
      '<div class="card" style="padding:20px;display:grid;gap:12px"><h3 style="font-size:14px;font-weight:600">What you\'re agreeing to, in plain words</h3><ul class="plain muted"><li>PayGuard connects you and your clients. We don\'t do the work.</li><li>Original files stay locked for the client until a milestone is paid and approved.</li><li>Rights to the work pass to the client when they approve and pay.</li><li>We keep only what we need, and you can delete your data any time.</li></ul>' +
      '<label class="check"><input type="checkbox" id="agree" ' + (ok ? 'checked' : '') + '><span>I agree to the Terms and the data policy.</span></label></div>' +
      '<button class="btn lg" id="cont" data-a="finish-setup" ' + (ok ? '' : 'disabled') + '>Continue</button></div></div>';
  }

  /* ---------------- freelancer: shell ---------------- */
  var NAV = [['today', 'Today', 'home'], ['clients', 'Clients', 'users'], ['calendar', 'Calendar', 'calendar'], ['payments', 'Payments', 'wallet']];
  function shell(crumb, inner) {
    var s = D.studio, act = U.plan ? '' : (U.view === 'project' ? 'clients' : U.view), need = splitAttention().need.length;
    var navBtns = function (cls) { return NAV.map(function (n) { return '<button class="' + cls + ' ' + (act === n[0] ? 'on' : '') + '" data-a="view" data-v="' + n[0] + '">' + ico(n[2]) + n[1] + (n[0] === 'today' && need ? '<span class="count">' + need + '</span>' : '') + '</button>'; }).join(''); };
    return '<div class="shell" ' + brandStyle() + '><aside class="side"><span class="logo" style="padding:0 8px">' + mark() + 'PayGuard</span><div class="grp">' + navBtns('nav') + '</div>' +
      '<div class="grp"><button class="nav accentnav" data-a="plan">' + ico('plus') + 'Plan a project</button></div>' +
      '<div style="flex:1"></div><div class="who"><span class="avatar" aria-hidden="true">' + initials(s.name) + '</span><span style="min-width:0"><b style="display:block;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(s.name) + '</b><span class="muted" style="font-size:12px">' + esc(s.biz) + '</span></span></div></aside>' +
      '<div style="min-width:0"><div class="topbar"><div class="crumbs">' + crumb + '</div><div style="display:flex;gap:8px;align-items:center">' + (U.view === 'project' && P() && !U.plan ? '<button class="btn outline sm" data-a="invite">' + ico('link') + 'Client link</button>' : '<button class="btn sm" data-a="plan">' + ico('plus') + 'Plan a project</button>') + '</div></div><nav class="mnav" aria-label="Sections">' + navBtns('') + '</nav>' + inner + '</div></div>';
  }
  /* ---------------- freelancer: Today (command centre) ---------------- */
  function splitAttention() { var at = attention(); return { need: at.filter(function (a) { return a.sev !== 'yellow'; }), wait: at.filter(function (a) { return a.sev === 'yellow'; }) }; }
  function attRow(a, p, still) {
    p = p || getP(a.pid); var wait = a.sev === 'yellow', att = still ? '' : ' data-a="openp" data-id="' + a.pid + '"';
    var btn = still ? '<span class="btn ' + (wait ? 'outline ' : '') + 'sm">' + esc(a.cta) + '</span>' : '<button class="btn ' + (wait ? 'outline ' : '') + 'sm" data-a="' + a.act + '" data-id="' + a.pid + '">' + esc(a.cta) + '</button>';
    return '<li class="att' + (wait ? ' wait' : '') + '"' + att + '><span class="sev ' + a.sev + '" aria-hidden="true"></span>' + avatarFor(p) + '<div class="at-main"><div class="nm"><b>' + esc(a.org) + '</b> <span class="muted">· ' + esc(a.project) + '</span></div><div class="what">' + esc(a.text) + '</div><div class="ctx">' + esc(a.ms) + ' · ' + esc(a.ctx) + '</div></div><div class="act"><span class="mono amt">' + inr(a.amount) + '</span>' + btn + '</div></li>';
  }
  /* "2 payments, 1 approval, 1 delivery": what kind of thing is waiting on the freelancer */
  function needBreak(list) {
    var nm = { fund: ['payment', 'payments'], approve: ['approval', 'approvals'], changes: ['change request', 'change requests'], deliver: ['delivery', 'deliveries'] }, cnt = {};
    list.forEach(function (a) { cnt[a.kind] = (cnt[a.kind] || 0) + 1; });
    return Object.keys(nm).filter(function (k) { return cnt[k]; }).map(function (k) { return cnt[k] + ' ' + nm[k][cnt[k] === 1 ? 0 : 1]; }).join(', ');
  }
  function needsHTML() {
    var sp = splitAttention(), shown = U.more ? sp.need : sp.need.slice(0, 4), h = '<div class="card focus"><div class="card-h"><h3>Needs you today</h3><span class="badge funded">' + sp.need.length + '</span></div>';
    if (sp.need.length) h += '<ul class="att-list" style="margin-top:8px">' + shown.map(function (a) { return attRow(a); }).join('') + '</ul>' + (sp.need.length > 4 ? '<button class="moreb" data-a="more">' + (U.more ? 'Show fewer' : 'Show ' + (sp.need.length - 4) + ' more') + '</button>' : '');
    else h += '<div class="clear">' + buddy('thumbs', 84) + '<div><b>You\'re all caught up</b><div class="muted">Nothing needs you right now.</div></div></div>';
    h += '</div>';
    if (sp.wait.length) h += '<div class="card quiet"><button class="waitb" data-a="waitopen" aria-expanded="' + !!U.waitOpen + '"><span class="sev yellow"></span><b style="font-weight:500">Waiting on clients</b><span class="muted">' + sp.wait.length + '</span><span style="margin-left:auto;display:flex">' + ico('chev', U.waitOpen ? 'rot' : '') + '</span></button>' + (U.waitOpen ? '<ul class="att-list">' + sp.wait.map(function (a) { return attRow(a); }).join('') + '</ul>' : '') + '</div>';
    return h;
  }
  /* money expected in the next 30 days, after the freelancer's fee: pending approval + funded + upcoming */
  function expectedHTML() {
    var b = { submitted: 0, funded: 0, draft: 0 };
    D.projects.forEach(function (p) { p.ms.forEach(function (m) { if (m.status !== 'released' && days(parse(m.due)) <= 30) b[m.status === 'changes' ? 'funded' : m.status] += fees(m.amount).net; }); });
    var tot = b.submitted + b.funded + b.draft, rows = [['submitted', 'Pending approval', b.submitted], ['funded', 'Funded', b.funded], ['draft', 'Upcoming', b.draft]];
    return '<div class="card card-b exp"><span class="lbl">Expected in the next 30 days</span><span class="mono exp-t">' + inr(tot) + '</span><span class="muted" style="font-size:12px">total, after your fee</span><ul class="exp-l">' + rows.map(function (r) { return '<li><i class="dot ' + r[0] + '"></i><span>' + r[1] + '</span><span class="mono">' + (r[2] ? inr(r[2]) : '–') + '</span></li>'; }).join('') + '</ul></div>';
  }
  function easyCards() {
    return D.projects.map(function (p) {
      var a = attentionFor(p), m = currentMsOf(p), st = projStatus(p), line = m ? 'Next: ' + m.name + ' · due ' + long(parse(m.due)) : 'Every milestone is released';
      return '<div class="card easy" data-a="openp" data-id="' + p.id + '">' + avatarFor(p, true) + '<div style="min-width:0"><b>' + esc(org(p)) + '</b><div class="muted">' + esc(p.name) + '</div><div class="sub">' + (a ? esc(a.text) + ' · ' : '') + esc(line) + '</div></div><span class="badge ' + st.cls + '">' + st.label + '</span><button class="btn outline sm" data-a="' + (a ? a.act : 'openp') + '" data-id="' + p.id + '">' + esc(a ? a.cta : 'Open') + '</button></div>';
    }).join('');
  }
  function sToday() {
    var s0 = D.studio, hr = new Date().getHours(), greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening', n = D.projects.length, inner, sub = '', sp = splitAttention();
    if (!n) inner = homeEmpty();
    else if (n < 3) {
      sub = n === 1 ? 'You have one client. Add more whenever you are ready.' : 'You have two clients so far.';
      inner = '<div class="cols"><div class="stack">' + easyCards() + '</div><div class="stack"><aside class="card" id="calbox" data-all="1">' + calendar(eventsAll(), U.cal, 3) + '</aside></div></div>';
    } else {
      sub = (sp.need.length ? '<b class="fgb">' + sp.need.length + (sp.need.length > 1 ? ' things need you' : ' thing needs you') + '</b>: ' + needBreak(sp.need) : 'Nothing needs you today') + (sp.wait.length ? ' · ' + sp.wait.length + ' waiting on clients' : '');
      inner = '<div class="cols"><div class="stack">' + needsHTML() + '</div><div class="stack"><aside class="card" id="calbox" data-all="1">' + calendar(eventsAll(), U.cal, 4) + '</aside>' + expectedHTML() + '<button class="btn outline block" data-a="view" data-v="clients">All ' + n + ' clients ' + ico('chev') + '</button></div></div>';
    }
    return shell('<b>Today</b>', '<div class="main"><div class="ph"><div><p class="muted">' + fmt(TODAY, { weekday: 'long', day: 'numeric', month: 'long' }) + '</p><h1 class="h1">' + greet + ', ' + esc(first(s0.name)) + '</h1>' + (sub ? '<p class="muted" style="margin-top:4px">' + sub + '</p>' : '') + '</div></div>' + inner + '</div>');
  }
  function homeEmpty() {
    return '<div class="card onb"><div class="art">' + buddy('main', 190, { label: 'The PayGuard buddy' }) + '</div><div class="body"><div><p class="muted" style="margin-bottom:4px">Welcome, ' + esc(first(D.studio.name)) + '</p><h2 class="h1" style="font-size:28px">Your first client link is two steps away</h2></div><div class="progress" aria-label="1 of 3 done"><i style="width:34%"></i></div>' +
      '<ul class="steps"><li class="done"><span class="c">' + ico('check', '') + '</span><b>Set up your studio</b><span class="muted">Done</span></li><li class="now"><span class="c"></span><b>Plan your first project</b><span class="badge outline">2 min</span></li><li><span class="c"></span><b>Invite your client</b><span class="muted">One link</span></li></ul>' +
      '<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><button class="btn lg" data-a="plan">Plan a project ' + ico('chev') + '</button><button class="linkb" data-a="loadactive">Look around with sample clients</button></div></div></div>';
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
  function fTable(o) {
    var last = -1; o.rows.forEach(function (r, i) { r.on = fShow(r, o.cur, o.q || ''); if (r.on) last = i; });
    var n = o.rows.filter(function (r) { return r.on; }).length;
    return '<div class="ftable" data-f="' + o.id + '" role="region" aria-label="' + o.label + '" tabindex="0"><div class="fgrid" role="table" aria-label="' + o.label + '" style="--cols:' + o.cols + ';--min:' + o.min + 'px"><div class="fhead" role="row">' + o.heads.map(function (h) { return '<span role="columnheader">' + h + '</span>'; }).join('') + '</div>' +
      o.rows.map(function (r, i) {
        return '<div class="frow" role="presentation" data-k="' + r.k + '" data-q="' + esc(r.q) + '" data-shown="' + (r.on ? 1 : 0) + '"' + (i === last ? ' data-last="1"' : '') + (r.on ? '' : ' inert') + '><div class="fclip" role="presentation"><div class="fr" role="row"' + (r.att || '') + '>' + r.cells.map(function (c) { return '<div class="fc" role="cell">' + c + '</div>'; }).join('') + '</div></div></div>';
      }).join('') + '<div class="f-empty" ' + (n ? 'hidden' : '') + '>' + o.empty + '</div></div></div>';
  }
  /* sync chips, rows and the empty message with U.cf / U.pf / U.q, without a re-render */
  function applyF(box) {
    if (!box) return; var id = box.dataset.f, cur = id === 'c' ? U.cf : U.pf, q = id === 'c' ? U.q.trim().toLowerCase() : '', n = 0, lastEl = null;
    Array.prototype.forEach.call(box.querySelectorAll('.frow'), function (el) {
      var on = fShow({ k: el.dataset.k, q: el.dataset.q }, cur, q); el.dataset.shown = on ? 1 : 0; el.removeAttribute('data-last');
      if (on) { el.removeAttribute('inert'); n++; lastEl = el; } else el.setAttribute('inert', '');
    });
    if (lastEl) lastEl.dataset.last = 1; var em = box.querySelector('.f-empty'); if (em) em.hidden = n > 0;
    Array.prototype.forEach.call(document.querySelectorAll('[data-a="' + (id === 'c' ? 'cfilter' : 'pfilter') + '"]'), function (b) { b.setAttribute('aria-pressed', String(b.dataset.f === cur)); });
  }
  function clientsTable() {
    var rows = D.projects.map(function (p) {
      var st = projStatus(p), m = currentMsOf(p);
      return { p: p, st: st, k: st.k === 'late' ? 'needs' : st.k, q: (org(p) + ' ' + p.name + ' ' + p.client.name).toLowerCase(),
        att: ' data-a="openp" data-id="' + p.id + '" tabindex="0"',
        cells: ['<div style="display:flex;gap:12px;align-items:center;min-width:0">' + avatarFor(p) + '<div style="min-width:0"><div style="font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(org(p)) + '</div><div class="muted" style="font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(p.name) + '</div></div></div>',
          m ? '<div style="min-width:0">' + esc(m.name) + '<div class="muted" style="font-size:12px">Due ' + long(parse(m.due)) + '</div></div>' : '<span class="muted">All released</span>',
          '<span class="badge ' + st.cls + '">' + st.label + '</span>'] };
    });
    var n = function (k) { return rows.filter(function (r) { return k === 'all' || r.k === k; }).length; };
    var items = [{ k: 'all', label: 'All', n: n('all') }, { k: 'needs', label: 'Needs you', dot: 'background:var(--amber)', n: n('needs') }, { k: 'waiting', label: 'Waiting', dot: 'background:#E3B341', n: n('waiting') }, { k: 'track', label: 'On track', dot: 'background:var(--accent)', n: n('track') }, { k: 'complete', label: 'Complete', dot: 'background:var(--ok)', n: n('complete') }];
    return '<div class="fbar"><input class="input" id="q" placeholder="Search clients" aria-label="Search clients" value="' + esc(U.q) + '" style="max-width:260px">' + fChips('cfilter', items, U.cf, 'Filter clients by status') + '</div>' +
      fTable({ id: 'c', label: 'Clients', cols: 'minmax(0,1.5fr) minmax(0,1.1fr) minmax(0,.9fr)', min: 480, heads: ['Client', 'Next up', 'Status'], rows: rows, cur: U.cf, q: U.q.trim().toLowerCase(),
        empty: '<div class="clear" style="padding:32px 20px;justify-content:center">' + buddy('think', 84) + '<div><b>No clients match</b><div class="muted">Try a different search or filter.</div></div></div>' });
  }
  function emptyPage(title, line) {
    return '<div class="card clear" style="padding:48px 24px;justify-content:center;flex-direction:column;text-align:center">' + buddy('hello', 110) + '<div><b>' + title + '</b><div class="muted">' + line + '</div></div><button class="btn" data-a="plan">' + ico('plus') + 'Plan a project</button></div>';
  }
  function sClients() {
    return shell('<b>Clients</b>', '<div class="main"><div class="ph"><div><h1 class="h1">Clients</h1><p class="muted">Where every client stands.</p></div><button class="btn" data-a="plan">' + ico('plus') + 'Plan a project</button></div>' +
      (D.projects.length ? clientsTable() : emptyPage('No clients yet', 'Plan a project and invite your first client.')) + '</div>');
  }
  function sCalendar() {
    return shell('<b>Calendar</b>', '<div class="main"><div class="ph"><div><h1 class="h1">Calendar</h1><p class="muted">What is coming up, across every client. Each one has their own color.</p></div></div>' + (D.projects.length ? '<div class="card" id="calbox" data-big="1" data-all="1">' + bigCalInner(calEvents()) + '</div>' : emptyPage('Nothing scheduled', 'Dates appear here once you plan a project.')) + '</div>');
  }
  function sPayments() {
    var rows = []; D.projects.forEach(function (p) { p.ms.forEach(function (m) { rows.push({ p: p, m: m, f: fees(m.amount), ps: payState(m, p, 'freelancer', true) }); }); });
    var t = { draft: 0, overdue: 0, funded: 0, submitted: 0, processing: 0, paid: 0 }, nOver = 0;
    rows.forEach(function (r) { var k = r.ps[0]; if (k === 'overdue') { nOver++; k = 'draft'; } t[k] += r.f.net; });
    var RANK = { overdue: 0, submitted: 1, funded: 2, processing: 3, draft: 4, paid: 5 };
    var key = function (r) { return r.ps[0] === 'overdue' ? 'draft' : r.ps[0]; };
    var list = rows.slice().sort(function (a, b) { return RANK[a.ps[0]] - RANK[b.ps[0]] || parse(a.m.due) - parse(b.m.due); });
    var cnt = function (k) { return rows.filter(function (r) { return k === 'all' || key(r) === k; }).length; };
    var items = [{ k: 'all', label: 'All' }, { k: 'draft', label: 'Not funded', dot: 'background:var(--muted-fg)' }, { k: 'funded', label: 'Funded', dot: 'background:var(--accent)' }, { k: 'submitted', label: 'Awaiting approval', dot: 'background:var(--rev)' }, { k: 'processing', label: 'Processing', dot: 'background:transparent;box-shadow:inset 0 0 0 1.5px var(--accent)' }, { k: 'paid', label: 'Paid', dot: 'background:var(--ok)' }].map(function (x) { x.n = cnt(x.k); return x; });
    var frows = list.map(function (r) {
      return { k: key(r), q: '', cells: ['<div style="display:flex;gap:10px;align-items:center;min-width:0">' + avatarFor(r.p) + '<b style="font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(org(r.p)) + '</b></div>',
        '<div style="min-width:0">' + esc(r.m.name) + '<div class="muted" style="font-size:12px">Due ' + long(parse(r.m.due)) + '</div></div>', '<span class="mono">' + inr(r.f.net) + '</span>', '<span class="badge ' + r.ps[0] + '">' + r.ps[1] + '</span>',
        r.m.status !== 'draft' ? '<button class="btn outline sm" data-a="receipt" data-pid="' + r.p.id + '" data-id="' + r.m.id + '">Documents</button>' : ''] };
    });
    var head = '<div class="main"><div class="ph"><div><h1 class="h1">Payments</h1><p class="muted">Where is my money? Every stage, from not funded to paid.</p></div></div>';
    if (!rows.length) return shell('<b>Payments</b>', head + emptyPage('No payments yet', 'Payments appear once a client funds a milestone.') + '</div>');
    var funded = t.funded + t.submitted;
    return shell('<b>Payments</b>', head +
      '<div class="kpis three"><div class="kpi static"><span class="lbl">Not funded yet</span><span class="kv2 mono">' + inr(t.draft) + '</span><span class="muted" style="font-size:12px">' + (nOver ? nOver + ' overdue' : 'Nothing overdue') + '</span></div><div class="kpi static"><span class="lbl">Funded</span><span class="kv2 mono">' + inr(funded) + '</span><span class="muted" style="font-size:12px">' + (t.submitted ? inr(t.submitted) + ' awaiting approval' : funded ? 'Clients have paid, work in progress' : 'Nothing in progress') + '</span></div><div class="kpi static"><span class="lbl">Paid to you</span><span class="kv2 mono">' + inr(t.paid) + '</span><span class="muted" style="font-size:12px">' + (t.processing ? inr(t.processing) + ' payment processing' : 'After your fee') + '</span></div></div>' +
      '<div class="fbar">' + fChips('pfilter', items, U.pf, 'Filter payments by state') + '</div>' +
      fTable({ id: 'p', label: 'Payments', cols: 'minmax(0,1.3fr) minmax(0,1.2fr) minmax(0,.8fr) minmax(0,1.2fr) 124px', min: 680, heads: ['Client', 'Milestone', 'You receive', 'Status', ''], rows: frows, cur: U.pf, q: '', empty: '<p class="muted" style="padding:24px 16px">Nothing in this state right now.</p>' }) +
      '<p class="muted" style="font-size:12px;margin-top:12px">Amounts are after your PayGuard fee. Payouts usually arrive 1 to 2 days after approval. Fee rates (5.5% client, 3.5% you) are placeholders until pricing is decided.</p></div>');
  }
  /* ---------------- freelancer: plan ---------------- */
  function sPlan() {
    var d = U.draft, e = d.err || {}, fe = function (k) { return e[k] ? '<span class="hint-err">' + e[k] + '</span>' : ''; };
    var rows = d.ms.map(function (m, i) {
      return '<div class="mrow"><span class="idx">' + (i + 1) + '</span><div class="field nm"><label for="mn' + i + '">Stage</label><input class="input ' + (e['n' + i] ? 'bad' : '') + '" id="mn' + i + '" data-di="' + i + '" data-df="name" value="' + esc(m.name) + '">' + fe('n' + i) + '</div>' +
        '<div class="field"><label for="ma' + i + '">Amount (₹)</label><input class="input mono ' + (e['a' + i] ? 'bad' : '') + '" id="ma' + i + '" inputmode="numeric" data-di="' + i + '" data-df="amount" value="' + esc(m.amount) + '">' + fe('a' + i) + '</div>' +
        '<div class="field"><label for="md' + i + '">Delivery date</label><input class="input ' + (e['d' + i] ? 'bad' : '') + '" id="md' + i + '" type="date" min="' + iso(TODAY) + '" data-di="' + i + '" data-df="due" value="' + esc(m.due) + '">' + fe('d' + i) + '</div>' +
        '<button class="btn ghost sm" data-a="rmms" data-i="' + i + '" aria-label="Remove stage ' + (i + 1) + '" ' + (d.ms.length < 2 ? 'disabled' : '') + ' style="padding:0;width:32px">' + ico('x') + '</button></div>';
    }).join('');
    var sel = function (id, key, opts) { return '<select class="input" id="' + id + '" data-d="' + key + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (String(d[key]) === String(o[0]) ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>'; };
    return shell('<span>Plan a project</span>', '<div class="main"><div class="cols"><div class="stack"><div><p class="lbl">Step 2 of 2</p><h1 class="h1">Tell us how this project works</h1><p class="muted">Use your own stages, amounts and dates. We keep both of you on the same page.</p></div>' +
      '<div class="card" style="padding:20px;display:grid;gap:16px"><div class="field"><label for="pn">Project</label><input class="input ' + (e.name ? 'bad' : '') + '" id="pn" data-d="name" value="' + esc(d.name) + '">' + fe('name') + '</div><div class="two"><div class="field"><label for="co">Client company</label><input class="input" id="co" data-d="corg" value="' + esc(d.corg) + '"></div><div class="field"><label for="cn">Contact name</label><input class="input ' + (e.cname ? 'bad' : '') + '" id="cn" data-d="cname" value="' + esc(d.cname) + '">' + fe('cname') + '</div></div><div class="field"><label for="ce">Contact email</label><input class="input ' + (e.cemail ? 'bad' : '') + '" id="ce" type="email" data-d="cemail" value="' + esc(d.cemail) + '">' + fe('cemail') + '</div><div class="idrow">' + avatarHTML({ org: d.corg || d.cname, name: d.cname, color: d.ccolor, logo: d.clogo }, true) + '<div style="display:grid;gap:8px;min-width:0"><div class="lbl">Logo or color</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn outline sm" data-a="pickplogo">' + ico('upload') + (d.clogo ? 'Change logo' : 'Add logo') + '</button>' + (d.clogo ? '<button type="button" class="btn ghost sm" data-a="rmplogo">Remove</button>' : '') + '</div><input type="file" id="plogo" accept="image/*" hidden>' + swatchesHTML(d.ccolor, 'pcolor') + '<span class="muted" style="font-size:12px">No logo yet? Pick a color. You can add the logo later.</span></div></div></div>' +
      '<div class="card" style="padding:20px"><div style="display:flex;flex-wrap:wrap;gap:8px 16px;justify-content:space-between;align-items:center;margin-bottom:4px"><div class="lbl">How you get paid</div><div class="chips"><span class="muted" style="font-size:12px">Start from</span><button class="chipb" data-a="tpl" data-t="one">One payment</button><button class="chipb" data-a="tpl" data-t="half">Half and half</button><button class="chipb" data-a="tpl" data-t="three">Three stages</button></div></div>' + rows + '<div id="orderwarn"></div><button class="btn outline sm" data-a="addms" ' + (d.ms.length >= 8 ? 'disabled' : '') + ' style="margin-top:8px">' + ico('plus') + 'Add a stage</button></div>' +
      '<div class="card" style="padding:20px;display:grid;gap:12px"><div class="lbl">Your usual terms</div><div class="two"><div class="field"><label for="rd">Client replies within</label>' + sel('rd', 'reviewDays', [[2, '2 days'], [3, '3 days'], [5, '5 days'], [7, '7 days']]) + '</div><div class="field"><label for="rn">Rounds of changes included</label>' + sel('rn', 'rounds', [[1, '1 round'], [2, '2 rounds'], [3, '3 rounds']]) + '</div></div><p class="muted" style="font-size:12px">Clients fund each stage before you start it.</p></div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between"><span class="muted" style="font-size:12px">Total <b class="mono" id="tot" style="color:var(--fg)">' + inr(totalDraft()) + '</b> across ' + d.ms.length + ' stage' + (d.ms.length > 1 ? 's' : '') + '</span><span style="display:flex;gap:8px"><button class="btn ghost lg" data-a="cancelplan">Cancel</button><button class="btn lg" data-a="createproject">Create and invite ' + esc(first(d.cname) || 'client') + '</button></span></div></div>' +
      '<aside class="card" id="calbox" data-draft="1" style="position:sticky;top:72px">' + draftCal() + '</aside></div></div>');
  }
  function draftCal() {
    var evs = U.draft.ms.filter(function (m) { return m.due; }).map(function (m, i) { return { date: parse(m.due), kind: 'due', label: m.name || 'Stage ' + (i + 1), sub: 'Delivery date', color: CC[U.draft.ccolor % CC.length] }; }).sort(function (a, b) { return a.date - b.date; });
    return calendar(evs, U.cal);
  }

  /* ---------------- freelancer: project ---------------- */
  function fileRows(m) {
    return m.files.map(function (f) { return '<div class="file"><span class="ic">' + fileTag(f) + '</span><div style="min-width:0"><div class="nm">' + esc(f.name) + '</div><div class="muted" style="font-size:12px">' + esc(f.size) + (f.v > 1 ? ' · version ' + f.v : '') + '</div></div><span class="ok">' + ico('check', 'tick') + (m.status === 'released' ? 'Original unlocked' : 'Protected preview ready') + '</span></div>'; }).join('');
  }
  function trayIll() { return '<svg class="ill" viewBox="0 0 200 140" width="104" aria-hidden="true"><ellipse class="soft" cx="100" cy="116" rx="64" ry="9"/><path d="M42 82 56 62H144L158 82V108a6 6 0 0 1-6 6H48a6 6 0 0 1-6-6Z"/><path class="acc bgf" d="M76 72V32a6 6 0 0 1 6-6H108L124 42V72Z"/><path class="acc" d="M108 26V42H124M86 54H112M86 62H104"/><path class="bgf" d="M42 82H80q4 12 20 12t20-12H158V108a6 6 0 0 1-6 6H48a6 6 0 0 1-6-6Z"/><path class="acc" d="M100 16V4M95 9l5-5 5 5"/><path d="M150 30v8M146 34h8M54 38v6M51 41h6"/><circle class="adot" cx="40" cy="62" r="2"/></svg>'; }
  function homeHero(m) {
    if (!m) return '';
    var p = P(), c = clientName(), due = parse(m.due), n = days(due);
    var meta = '<div class="meta">' + (m.status === 'submitted' ? '' : '<span class="badge warn">' + ico('clock', '') + (n < 0 ? 'Delivery date passed ' + Math.abs(n) + (n === -1 ? ' day' : ' days') + ' ago' : 'Due ' + long(due) + ' · ' + (n === 0 ? 'today' : n + (n === 1 ? ' day' : ' days'))) + '</span>') + '<span class="badge outline">' + (m.limit - m.revisions) + ' of ' + m.limit + ' change rounds left</span></div>';
    var h = '<div class="card">';
    if (m.status === 'released') {
      var nxt = currentMs();
      var ps = payState(m, p, 'freelancer');
      h += '<div class="hero"><div><span class="badge ' + ps[0] + '">' + ps[1] + '</span><h3>' + esc(m.name) + '</h3><p class="muted">' + (ps[0] === 'paid' ? inr(fees(m.amount).net) + ' was paid to you, after PayGuard\'s fee.' : 'Approved. ' + inr(fees(m.amount).net) + ' is on its way to you, after PayGuard\'s fee.') + '</p><div class="acts"><button class="btn outline" data-a="receipt" data-id="' + m.id + '">' + ico('file') + 'Documents</button>' + (nxt ? '<button class="btn" data-a="selms" data-id="' + nxt.id + '">Next: ' + esc(nxt.name) + ' ' + ico('chev') + '</button>' : '') + '</div></div>' + buddy('party', 110) + '</div>';
      if (!nxt) h += '<div class="note" style="background:var(--ok-bg);color:var(--ok)"><b>That\'s the whole project, paid.</b>Every milestone has been approved and released.</div>';
    } else if (m.status === 'draft') {
      h += '<div class="hero" style="grid-template-columns:minmax(0,1fr)"><div>' + stBadge(m, p) + '<h3>' + esc(m.name) + '</h3><p class="muted">' + esc(first(c)) + ' hasn\'t funded this milestone yet. You can start once it is funded.</p>' + meta + '<div class="acts"><button class="btn outline" data-a="remind" data-id="' + p.id + '">Send a reminder</button><button class="btn ghost" data-a="role" data-r="client">Open as ' + esc(first(c)) + ' ' + ico('chev') + '</button></div></div></div>' +
        '<div class="drop locked"><svg class="ico" style="width:32px;height:32px" aria-hidden="true"><use href="#i-lock"/></svg><div><b>Uploads open once it\'s funded</b><span class="muted">Your client funds each stage first. You will see it here as soon as they do.</span></div></div>';
    } else if (m.status === 'submitted') {
      h += '<div class="hero" style="grid-template-columns:minmax(0,1fr)"><div><span class="badge submitted">Awaiting approval</span><h3>' + esc(m.name) + '</h3><p class="muted">' + (m.submittedAt ? 'You submitted ' + agoTxt(m.submittedAt) + '. ' : '') + (days(replyBy(m)) < 0 ? esc(first(c)) + '\'s reply date was ' + long(replyBy(m)) + ' (' + rel(replyBy(m)) + ').' : esc(first(c)) + ' has until ' + long(replyBy(m)) + ' to reply (' + rel(replyBy(m)) + ').') + '</p>' + meta + '<div class="acts"><button class="btn outline" data-a="remind" data-id="' + p.id + '">Nudge ' + esc(first(c)) + '</button><button class="btn ghost" data-a="role" data-r="client">Open as ' + esc(first(c)) + ' ' + ico('chev') + '</button></div></div></div><div class="files">' + fileRows(m) + '</div>';
    } else {
      var feedback = m.status === 'changes' && m.notes.length ? '<div class="note"><b>' + esc(first(c)) + ' asked for changes (round ' + m.revisions + ' of ' + m.limit + ')</b>' + esc(m.notes[m.notes.length - 1].text) + '</div>' : '';
      var fresh2 = m.files.filter(function (f) { return f.v === m.revisions + 1; });
      h += '<div class="hero" style="grid-template-columns:minmax(0,1fr)"><div><span class="badge ' + (m.status === 'changes' ? 'changes' : 'funded') + '">' + (m.status === 'changes' ? 'Changes requested' : 'Funded') + '</span><h3>' + esc(m.name) + '</h3><p class="muted">' + (m.status === 'changes' ? 'Upload the updated files and send them back.' : 'Upload your work and we\'ll make a protected preview for ' + esc(first(c)) + '.') + '</p>' + meta + '</div></div>' + feedback;
      h += '<div class="drop' + (U.over ? ' over' : '') + '" id="dz">' + trayIll() + '<div><b>Drop files here</b><span class="muted">or choose from your computer · images, PDFs, video, docs</span></div><div class="btns"><button class="btn" data-a="pick">' + ico('upload') + 'Choose files</button><button class="btn outline" data-a="sample">Use sample files</button></div><input type="file" id="fi" multiple hidden></div>';
      if (U.uploading.length) h += '<div class="files">' + U.uploading.map(function (f) { return '<div class="file"><span class="ic">…</span><div style="min-width:0"><div class="nm">' + esc(f.name) + '</div><div class="bar"><i></i></div></div><span class="muted" style="font-size:12px">Uploading</span></div>'; }).join('') + '</div>';
      if (m.files.length) h += '<div class="files">' + fileRows(m) + '</div>';
      if (fresh2.length && !U.uploading.length) h += '<div class="submitbar"><div><b>' + esc(first(c)) + ' gets until ' + long(addDays(TODAY, p.reviewDays || 3)) + ' to reply.</b><div class="muted" style="font-size:12px">They see a watermarked, view-only copy.</div></div><button class="btn lg" data-a="submit" data-id="' + m.id + '">Submit for review</button></div>';
    }
    return h + '</div>';
  }
  function projFiles() {
    var all = []; ms().forEach(function (m) { m.files.forEach(function (f) { all.push([m, f]); }); });
    if (!all.length) return '<div class="card clear" style="padding:40px 24px;justify-content:center">' + buddy('carry', 96) + '<div><b>No files yet</b><div class="muted">Files you upload to a milestone show up here.</div></div></div>';
    return '<div class="card tscroll"><table><thead><tr><th>File</th><th>Milestone</th><th>Size</th><th>Status</th></tr></thead><tbody>' + all.map(function (x) { return '<tr><td style="font-weight:500">' + esc(x[1].name) + '</td><td>' + esc(x[0].name) + '</td><td class="mono">' + esc(x[1].size) + '</td><td>' + (x[0].status === 'released' ? '<span class="badge released">Original unlocked</span>' : '<span class="badge outline">Preview only</span>') + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }
  function projActivity() {
    var items = D.log.filter(function (l) { return l.pid === D.cur; });
    if (!items.length) return '<div class="card" style="padding:32px;text-align:center"><span class="muted">Nothing yet.</span></div>';
    return '<div class="card"><ul>' + items.map(function (l) { var d = new Date(l.t); return '<li style="display:grid;grid-template-columns:28px minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px 20px;border-top:1px solid var(--border)">' + (l.who === 'client' ? avatarFor(P()) : '<span class="avatar">' + initials(D.studio.name) + '</span>') + '<span>' + esc(l.text) + '</span><span class="muted" style="font-size:12px;white-space:nowrap">' + fmt(d, { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) + '</span></li>'; }).join('') + '</ul></div>';
  }
  function sProject() {
    var p = P(); if (!p) { U.view = 'clients'; return sClients(); }
    var m = focusMs(), st = projStatus(p), tabs = '<div class="tabs" role="tablist">' + [['overview', 'Overview'], ['files', 'Files'], ['activity', 'Activity']].map(function (t) { return '<button role="tab" data-a="ptab" data-t="' + t[0] + '" aria-selected="' + (U.pt === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div>';
    var body = U.pt === 'files' ? projFiles() : U.pt === 'activity' ? projActivity() :
      '<div class="cols"><div class="stack">' + homeHero(m) + '<div class="card"><div class="card-h"><h3>Milestones</h3><span class="muted" style="font-size:12px">' + p.ms.length + ' total</span></div><div style="margin-top:8px">' + msRows() + '</div></div></div><div class="stack"><aside class="card" id="calbox">' + calendar(events(), U.cal) + '</aside></div></div>';
    return shell('<button class="linkb" data-a="view" data-v="clients">Clients</button>' + ico('chev') + '<span>' + esc(org(p)) + '</span>' + ico('chev') + '<b>' + esc(p.name) + '</b>',
      '<div class="main"><div class="ph"><div style="display:flex;gap:14px;align-items:center">' + avatarFor(p, true) + '<div><h1 class="h1" style="font-size:24px">' + esc(org(p)) + ' <button class="btn ghost sm" data-a="editclient" style="vertical-align:middle">' + ico('pencil') + 'Edit</button></h1><p class="muted">' + esc(p.name) + ' · ' + esc(p.client.name) + ' · <span class="badge ' + st.cls + '">' + st.label + '</span></p></div></div>' + tabs + '</div>' + body + '</div>');
  }
  /* ---------------- client screens ---------------- */
  function clientTop() {
    var s = D.studio, c = P() ? P().client : { name: 'Guest' };
    return '<div class="topbar"><span class="logo">' + mark() + esc(s.biz) + '</span><div style="display:flex;gap:10px;align-items:center"><span class="muted">' + esc(c.name) + ' · guest</span>' + (P() ? avatarFor(P()) : '') + '</div></div>';
  }
  function cEmpty() {
    return '<div class="clientwrap" ' + brandStyle() + '><div class="topbar"><span class="logo">' + mark() + 'PayGuard</span></div><div class="centerpage" style="background:var(--bg)"><div class="celebrate" style="max-width:420px;padding-top:48px">' + buddy('hello', 120) + '<h1 class="h1">Nothing shared with you yet</h1><p class="muted">When a freelancer sends you a project link, it opens here.</p><button class="btn" data-a="role" data-r="freelancer">Back to ' + esc(first(D.studio.name)) + '</button></div></div></div>';
  }
  function cInvite() {
    var p = P(), m0 = ms()[0], s = D.studio;
    return '<div class="clientwrap" ' + brandStyle() + '>' + clientTop() + '<div class="main"><div class="cols"><div class="stack"><div style="display:flex;align-items:center;gap:16px">' + buddy('hello', 96) + '<div><p class="lbl">An invitation from ' + esc(s.name) + '</p><h1 class="h1">' + esc(p.name) + '</h1><p class="muted">Hi ' + esc(first(p.client.name)) + '. Here\'s the plan ' + esc(first(s.name)) + ' put together. Everything for this project happens on this page.</p></div></div>' +
      '<div class="card"><div class="card-h"><h3>The ' + ms().length + ' milestone' + (ms().length > 1 ? 's' : '') + '</h3></div><div style="margin-top:8px">' + msRows() + '</div></div>' +
      '<div class="card" style="padding:20px;display:grid;gap:12px"><div class="lbl">How it works for you</div><ul class="plain"><li>You pay for one milestone at a time, before ' + esc(first(s.name)) + ' starts it.</li><li>You get a watermarked preview and ' + (p.reviewDays || 3) + ' days to approve or ask for changes.</li><li>Approving unlocks the original files and sends you a receipt.</li></ul></div>' +
      '<div><button class="btn lg" data-a="gocheckout" data-id="' + m0.id + '">Fund the first milestone · ' + inr(m0.amount) + '</button><p class="muted" style="font-size:12px;margin-top:8px">Pay by card or UPI. No account needed.</p></div></div>' +
      '<div class="stack"><div class="card"><div class="card-h"><h3>Dates agreed</h3></div>' + calendar(events(), U.cal) + '</div></div></div></div></div>';
  }
  function cCheckout() {
    var m = getMs(U.checkout), f = fees(m.amount), s = D.studio;
    return '<div class="clientwrap" ' + brandStyle() + '>' + clientTop() + '<div class="centerpage" style="background:var(--bg)"><div class="pay2"><div class="stack" style="gap:16px;align-content:start"><button class="btn ghost sm" data-a="backcheckout" style="justify-self:start">‹ Back</button><div><p class="lbl">Fund milestone ' + (ms().indexOf(m) + 1) + ' of ' + ms().length + '</p><h1 class="h1">' + esc(m.name) + '</h1></div><p class="mono" style="font-size:40px;line-height:1.1;letter-spacing:-.03em">' + inr(f.total) + '</p>' +
      '<div class="card" style="padding:16px"><div class="kv"><div><span class="muted">' + esc(m.name) + ' (to ' + esc(s.biz) + ')</span><span class="mono">' + inr(m.amount) + '</span></div><div><span class="muted">PayGuard service fee (example 5.5%)</span><span class="mono">' + inr(f.fee) + '</span></div><div><span class="muted">GST on service fee (18%)</span><span class="mono">' + inr(f.gst) + '</span></div><div class="tot"><span>You pay today</span><span class="mono">' + inr(f.total) + '</span></div></div></div>' +
      '<ul class="plain"><li>You fund one stage at a time. ' + esc(first(s.name)) + ' starts once it is funded, and it is released to them when you approve.</li><li>You review a watermarked preview first.</li><li>You get a payment summary by email once you pay.</li></ul></div>' +
      '<form class="card" id="payform" style="padding:24px;display:grid;gap:14px;align-content:start">' + (U.payErr ? '<div class="alert" style="background:var(--err-bg);border-color:transparent;color:var(--err);align-items:center" role="alert">' + buddy('worry', 64) + '<div><b>' + esc(U.payErr) + '</b><span>You have not been charged. Check the details or try another card.</span></div></div>' : '') +
      '<div class="field"><label for="em">Email for your receipt</label><input class="input" id="em" type="email" value="' + esc(P().client.email) + '"></div><div class="field"><label for="cnum">Card number</label><input class="input mono" id="cnum" inputmode="numeric" value="4242 4242 4242 4242"></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div class="field"><label for="ex">Expiry</label><input class="input mono" id="ex" value="09 / 29"></div><div class="field"><label for="cv">CVC</label><input class="input mono" id="cv" value="123"></div></div>' +
      '<button type="submit" class="btn lg block" data-a="pay" ' + (U.busy ? 'disabled' : '') + '>' + (U.busy ? 'Paying…' : 'Pay ' + inr(f.total)) + '</button><p class="reassure">' + ico('shield', '') + '<span>Card details go straight to the payment provider. PayGuard never sees them. By paying you accept the terms.</span></p></form></div></div></div>';
  }
  function cProject() {
    var p = P(), m = focusMs(), s = D.studio, body = '';
    if (m.status === 'draft') {
      var f = fees(m.amount);
      body = '<div class="card hero" style="grid-template-columns:minmax(0,1fr)"><div><span class="badge draft">Ready to fund</span><h3>' + esc(m.name) + '</h3><p class="muted">Pay ' + inr(f.total) + ' (including the service fee and GST) and ' + esc(first(s.name)) + ' can start. Due ' + long(parse(m.due)) + '.</p><div class="acts"><button class="btn lg" data-a="gocheckout" data-id="' + m.id + '">Fund this milestone</button></div></div></div>';
    } else if (m.status === 'funded' || m.status === 'changes') {
      body = '<div class="card hero" style="grid-template-columns:minmax(0,1fr)"><div><span class="badge ' + (m.status === 'changes' ? 'changes' : 'funded') + '">' + (m.status === 'changes' ? 'Changes sent' : 'Funded') + '</span><h3>' + esc(m.name) + '</h3><p class="muted">' + (m.status === 'changes' ? esc(first(s.name)) + ' is working on your changes (round ' + m.revisions + ' of ' + m.limit + ').' : 'Your ' + inr(m.amount) + ' is funded. ' + esc(first(s.name)) + ' is working on this, due ' + long(parse(m.due)) + '.') + '</p>' + (m.status === 'changes' && m.notes.length ? '<div class="note" style="margin:16px 0 0;background:var(--muted);color:var(--fg)"><b>Your note</b>' + esc(m.notes[m.notes.length - 1].text) + '</div>' : '') + '<div class="acts"><button class="btn ghost" data-a="role" data-r="freelancer">Open as ' + esc(first(s.name)) + ' ' + ico('chev') + '</button></div></div></div>';
    } else if (m.status === 'submitted') {
      var fi = Math.min(U.fi || 0, m.files.length - 1), cur = m.files[fi], rb = replyBy(m), left = m.limit - m.revisions, late = days(rb) < 0;
      body = '<div class="ph"><div><p class="lbl">Milestone ' + (ms().indexOf(m) + 1) + ' of ' + ms().length + '</p><h2 class="h1" style="font-size:24px">' + esc(m.name) + '</h2></div><span class="badge submitted">Awaiting your approval</span></div>' +
        '<div class="cols" style="grid-template-columns:minmax(0,1fr) 340px"><div class="stack" style="gap:16px"><div class="alert">' + ico('lock', '') + '<div><b>View only until you approve</b><span class="muted">The watermark comes off and downloads unlock when you approve.</span></div></div>' +
        (m.files.length > 1 ? '<div class="tabs" role="tablist">' + m.files.map(function (f, i) { return '<button role="tab" data-a="file" data-i="' + i + '" aria-selected="' + (i === fi) + '">' + esc(f.name) + '</button>'; }).join('') + '</div>' : '') + previewStage(cur, false) + '</div>' +
        '<aside class="card" style="position:sticky;top:72px"><div class="card-b" style="display:grid;gap:20px"><div><p class="muted">Reply by</p><p style="font-size:28px;font-weight:600;letter-spacing:-.03em;line-height:1.15">' + long(rb) + '</p><p class="' + 'muted' + '">' + (late ? 'The reply date has passed. Take a look when you can.' : rel(rb) + '. We\'ll remind you the day before.') + '</p></div><hr class="sep">' +
        '<div class="kv"><div><span class="muted">Pays</span><b style="font-weight:500">' + esc(s.name) + '</b></div><div><span class="muted">Releases</span><b class="mono" style="font-weight:500">' + inr(m.amount) + '</b></div><div><span class="muted">Unlocks</span><b style="font-weight:500">Original files</b></div></div>' +
        '<div style="display:grid;gap:8px"><button class="btn lg block" data-a="askapprove" data-id="' + m.id + '">Approve and release ' + inr(m.amount) + '</button><button class="btn lg outline block" data-a="askchanges" data-id="' + m.id + '" ' + (left < 1 ? 'disabled' : '') + '>Ask for changes · ' + left + ' left</button>' + (left < 1 ? '<p class="muted" style="font-size:12px">You\'ve used all your rounds. Talk to ' + esc(first(s.name)) + ' about extending the scope.</p>' : '') + '</div>' +
        '<div class="reassure">' + buddy('guard', 50) + '<span>You funded this stage before work began. It is released to ' + esc(first(s.name)) + ' when you approve.</span></div></div></aside></div>';
    } else {
      var nx = currentMs();
      body = '<div class="card hero"><div><span class="badge released">Released</span><h3>' + esc(m.name) + '</h3><p class="muted">Approved. The originals are yours.</p><div class="acts"><button class="btn outline" data-a="receipt" data-id="' + m.id + '">' + ico('file') + 'Payment documents</button>' + (nx ? '<button class="btn" data-a="selms" data-id="' + nx.id + '">Next: ' + esc(nx.name) + ' ' + ico('chev') + '</button>' : '') + '</div></div>' + buddy('party', 110) + '</div>' +
        '<div class="card"><div class="card-h"><h3>Your files</h3></div><div class="files" style="padding:16px 20px 20px">' + m.files.map(function (f) { var u = fileUrl(f); return '<div class="file"><span class="ic">' + fileTag(f) + '</span><div style="min-width:0"><div class="nm">' + esc(f.name) + '</div><div class="muted" style="font-size:12px">' + esc(f.size) + ' · original</div></div>' + (u ? '<a class="btn outline sm" href="' + esc(u) + '" download="' + esc(f.name) + '">' + ico('download') + 'Download</a>' : '<button class="btn outline sm" data-a="dl" data-n="' + esc(f.name) + '">' + ico('download') + 'Download</button>') + '</div>'; }).join('') + '</div></div>';
      if (!nx) body += '<div class="alert" style="background:var(--ok-bg);border-color:transparent;color:var(--ok)"><div><b>Project complete</b>All milestones are approved and released.</div></div>';
    }
    return '<div class="clientwrap" ' + brandStyle() + '>' + clientTop() + '<div class="main"><div class="ph"><div><p class="lbl">' + esc(s.biz) + '</p><h1 class="h1">' + esc(p.name) + '</h1></div></div>' +
      (m.status === 'submitted' ? body + '<div class="cols" style="grid-template-columns:minmax(0,1fr) 330px"><div class="card"><div class="card-h"><h3>All milestones</h3></div><div style="margin-top:8px">' + msRows() + '</div></div><aside class="card" id="calbox">' + calendar(events(), U.cal) + '</aside></div>' : '<div class="cols"><div class="stack">' + body + '<div class="card"><div class="card-h"><h3>All milestones</h3></div><div style="margin-top:8px">' + msRows() + '</div></div></div><aside class="card" id="calbox">' + calendar(events(), U.cal) + '</aside></div>') + '</div></div>';
  }

  /* ---------------- modals ---------------- */
  function modalHTML() {
    var o = U.modal; if (!o) return '';
    var body = '', wide = false;
    if (o.t === 'invite') {
      var link = 'payguard.app/p/' + P().id;
      body = '<div><h2>Project created</h2><p class="muted">Send ' + esc(first(P().client.name)) + ' this link. They can open it straight away.</p></div><div class="linkbox"><input class="input" readonly value="' + esc(link) + '" aria-label="Client link"><button class="btn outline" data-a="copylink" data-v="' + esc(link) + '">' + ico('copy') + 'Copy</button></div><div class="dfoot"><button class="btn outline" data-a="close">Done</button><button class="btn" data-a="role" data-r="client">Open as ' + esc(first(P().client.name)) + ' ' + ico('chev') + '</button></div>';
    } else if (o.t === 'approve') {
      var m = getMs(o.id);
      body = '<div style="display:flex;gap:16px;align-items:center">' + buddy('guard', 76) + '<div><h2>Approve and release ' + inr(m.amount) + '?</h2><p class="muted">This releases the payment to ' + esc(first(D.studio.name)) + ' and unlocks the original files. It can\'t be undone.</p></div></div><div class="dfoot"><button class="btn outline" data-a="close">Not yet</button><button class="btn" data-a="approve" data-id="' + m.id + '">Approve and release</button></div>';
    } else if (o.t === 'changes') {
      var m2 = getMs(o.id);
      body = '<div><h2>What should change?</h2><p class="muted">Be specific. This uses 1 of your ' + (m2.limit - m2.revisions) + ' remaining rounds.</p></div><div class="field"><label for="note">Your note to ' + esc(first(D.studio.name)) + '</label>' +
        '<div class="fb-host" id="fb"><textarea class="textarea" id="note" placeholder="For example: the palette feels a little cold. Can we try warmer clay tones?">' + esc(U.fb.note) + '</textarea><div class="fb-pass" hidden aria-live="polite"><span class="fb-sel"></span></div><div class="fb-float" style="opacity:0;pointer-events:none"><div class="fb-bar"><div class="fb-in"></div></div></div></div>' +
        '<span class="hint-err" id="noteerr"></span></div><div class="dfoot"><button class="btn outline" data-a="close">Cancel</button><button class="btn" data-a="sendchanges" data-id="' + m2.id + '">Send to ' + esc(first(D.studio.name)) + '</button></div>';
    } else if (o.t === 'receipt') {
      wide = true; var p3 = getP(o.pid) || P(), m3 = p3.ms.filter(function (x) { return x.id === o.id; })[0];
      var tabs = [['summary', 'Payment summary'], ['invoice', 'Invoice for the work'], ['fee', 'PayGuard service fee']];
      body = '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><div><h2>' + esc(m3.name) + '</h2><p class="muted">' + esc(org(p3)) + '</p></div><button class="btn ghost sm" data-a="close" aria-label="Close">' + ico('x') + '</button></div><div class="tabs" role="tablist">' + tabs.map(function (t) { return '<button role="tab" data-a="rtab" data-t="' + t[0] + '" aria-selected="' + (U.rtab === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div>' + sheetHTML(m3, p3, U.rtab) + '<div class="dfoot"><button class="btn outline" data-a="copylink" data-v="RCT-' + m3.id.toUpperCase().slice(0, 4) + '">' + ico('copy') + 'Copy reference</button><button class="btn" data-a="close">Close</button></div>';
    } else if (o.t === 'editclient') {
      var f = o.f;
      body = '<div><h2>Edit client</h2><p class="muted">How this client looks to you and on the calendar.</p></div><div class="idrow">' + avatarHTML({ org: f.org || f.name, name: f.name, color: f.color, logo: f.logo }, true) + '<div style="display:grid;gap:8px;min-width:0"><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn outline sm" data-a="pickelogo">' + ico('upload') + (f.logo ? 'Change logo' : 'Add logo') + '</button>' + (f.logo ? '<button type="button" class="btn ghost sm" data-a="rmelogo">Remove</button>' : '') + '</div><input type="file" id="elogo" accept="image/*" hidden><span class="muted" style="font-size:12px">No logo yet? A color is enough.</span></div></div><div class="field"><label>Color</label>' + swatchesHTML(f.color, 'ecolor') + '</div>' +
        '<div class="two"><div class="field"><label for="ec-org">Company</label><input class="input" id="ec-org" data-ec="org" value="' + esc(f.org) + '"></div><div class="field"><label for="ec-name">Contact name</label><input class="input" id="ec-name" data-ec="name" value="' + esc(f.name) + '"></div></div><div class="field"><label for="ec-email">Contact email</label><input class="input" id="ec-email" data-ec="email" value="' + esc(f.email) + '"></div><div class="dfoot"><button class="btn outline" data-a="close">Cancel</button><button class="btn" data-a="saveclient">Save</button></div>';
    } else if (o.t === 'paid') {
      body = '<div class="celebrate">' + buddy('thumbs', 112) + '<svg class="seal" viewBox="0 0 56 56" fill="none" stroke="var(--ok)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:44px;height:44px"><circle cx="28" cy="28" r="25"/><path d="M17 29l8 8 14-16"/></svg><div><h2>Payment received</h2><p class="muted">' + inr(o.amount) + ' is funded. ' + esc(first(D.studio.name)) + ' can start on ' + esc(o.name) + '.</p></div></div><div class="dfoot" style="justify-content:center"><button class="btn" data-a="close">Back to the project</button></div>';
    } else if (o.t === 'released') {
      var m4 = getMs(o.id), client = o.who === 'client', f4 = fees(m4.amount);
      body = '<div class="celebrate">' + buddy('party', 140) + '<div><h2 style="font-size:28px;letter-spacing:-.03em">' + (client ? 'Approved. Nicely done, ' + esc(first(P().client.name)) + '.' : inr(f4.net) + ' released to you') + '</h2><p class="muted" style="margin-top:6px">' + (client ? inr(m4.amount) + ' is on its way to ' + esc(first(D.studio.name)) + ', and your original files are unlocked.' : esc(first(P().client.name)) + ' approved ' + esc(m4.name) + '. Payment is processing and your documents are ready.') + '</p></div>' +
        '<div class="card" style="padding:12px 16px;width:100%;text-align:left"><div class="kv"><div><span class="muted">' + esc(m4.name) + '</span><span class="mono">' + inr(m4.amount) + '</span></div>' + (client ? '<div><span class="muted">Service fee + GST</span><span class="mono">' + inr(f4.fee + f4.gst) + '</span></div><div class="tot"><span>Paid</span><span class="mono">' + inr(f4.total) + '</span></div>' : '<div><span class="muted">PayGuard fee (example 3.5%)</span><span class="mono">−' + inr(f4.ffee) + '</span></div><div class="tot"><span>You receive</span><span class="mono">' + inr(f4.net) + '</span></div>') + '</div></div></div>' +
        '<div class="dfoot" style="justify-content:center"><button class="btn outline" data-a="receipt" data-id="' + m4.id + '">' + ico('file') + 'View documents</button><button class="btn" data-a="close">Continue</button></div>';
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
      return '<div class="fb-prompt"><form class="fb-form"><input class="fb-input" aria-label="Describe edits" placeholder="Describe edits" autocomplete="off"></form></div>' +
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
        var v = ta.value.trim(); if (v.length < 5) { hint('Write your note first, then tidy it up here.'); ta.focus(); return; }
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
        else if (m.fundedAt && m.seen.funded === undefined) { m.seen.funded = true; save(); setTimeout(function () { toast('cheer', first(clientName()) + ' funded ' + m.name, inr(m.amount) + ' is secured. You can start.'); }, 250); }
        else if (m.status === 'changes' && m.seen.changes === false) { m.seen.changes = true; save(); setTimeout(function () { toast('work', 'Changes requested', first(clientName()) + ' left a note on ' + m.name + '.'); }, 250); }
      } else if (m.status === 'submitted' && m.seen.submitted === false) { m.seen.submitted = true; save(); setTimeout(function () { toast('point', 'New files to review', first(D.studio.name) + ' submitted ' + m.name + '. Reply by ' + long(replyBy(m)) + '.'); }, 250); }
    });
  }
  function screen() {
    if (D.role === 'client') {
      if (!P()) return cEmpty();
      if (U.checkout) return cCheckout();
      if (!P().clientIn && ms().every(function (m) { return m.status === 'draft'; })) return cInvite();
      return cProject();
    }
    if (!D.onboarded) return U.setup ? sSetup() : sLanding();
    if (U.plan) return sPlan();
    return U.view === 'clients' ? sClients() : U.view === 'calendar' ? sCalendar() : U.view === 'payments' ? sPayments() : U.view === 'project' ? sProject() : sToday();
  }
  function protoBar() {
    var p = P(), c = p ? first(p.client.name) : 'Client', f = first(D.studio.name), mode = !D.projects.length ? 'new' : D.samples ? 'active' : '';
    document.getElementById('proto').innerHTML = '<span>View as</span><button data-a="role" data-r="freelancer" aria-pressed="' + (D.role === 'freelancer') + '">' + esc(f) + '</button><button data-a="role" data-r="client" aria-pressed="' + (D.role === 'client') + '">' + esc(c) + '</button><i class="vr"></i><span>Account</span><button data-a="acct" data-m="new" aria-pressed="' + (mode === 'new') + '">First day</button><button data-a="acct" data-m="active" aria-pressed="' + (mode === 'active') + '">Active</button><button class="reset" data-a="reset">Restart</button>';
  }
  var PREVVIEW = '', PREVMODAL = '';
  function viewKey() { var p = P(); return [D.role, D.onboarded, U.setup, U.plan, U.view, U.pt, U.checkout, p && p.id].join('|'); }
  function modalKey() { return U.modal ? JSON.stringify([U.modal.t, U.modal.id]) : ''; }
  function closeModal() {
    var ov = document.querySelector('.overlay'); if (!ov) { U.modal = null; render(); return; }
    ov.classList.add('closing'); setTimeout(function () { U.modal = null; render(); }, 170);
  }
  function render() {
    pendingEvents();
    var y = window.scrollY, app = document.getElementById('app'), vk = viewKey(), mk = modalKey(), newView = vk !== PREVVIEW, newModal = mk && mk !== PREVMODAL;
    KEYC = {}; CURK = {}; app.classList.remove('view-in');
    app.innerHTML = screen() + modalHTML();
    if (mk && !newModal) { var ov = app.querySelector('.overlay'); if (ov) ov.classList.add('static'); }
    if (newView) { app.querySelectorAll('.att-list li, .rows li, tbody tr, .frow, .easy, .kpi, .chain li').forEach(function (el, i) { el.style.setProperty('--n', Math.min(i, 9)); }); app.classList.add('view-in'); }
    PREVVIEW = vk; PREVMODAL = mk;
    mountBuddies(app);
    var fbh = document.getElementById('fb'); if (fbh) fbMount(fbh); else fbStop();
    document.documentElement.style.setProperty('--brand', BRANDS[D.studio.brand]);
    protoBar();
    if (U.keepScroll) window.scrollTo(0, y);
    U.keepScroll = true;
    var st = document.querySelector('.stage'); if (st) st.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    var dz = document.getElementById('dz');
    if (dz) {
      ['dragenter', 'dragover'].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add('over'); }); });
      ['dragleave', 'drop'].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove('over'); }); });
      dz.addEventListener('drop', function (e) { var m = focusMs(); if (m && e.dataTransfer) readFiles(m, e.dataTransfer.files); });
    }
    var fi = document.getElementById('fi'); if (fi) fi.addEventListener('change', function () { var m = focusMs(); if (m) readFiles(m, fi.files); });
  }
  /* ---------------- events ---------------- */
  function go(role) { document.getElementById('toasts').innerHTML = ''; D.role = role; if (role === 'client' && !P()) D.cur = pickCur(); U.checkout = false; U.modal = null; U.fi = 0; U.sel = null; save(); window.scrollTo(0, 0); U.keepScroll = false; render(); }
  function openProject(id, mid) { D.cur = id; U.view = 'project'; U.pt = 'overview'; U.sel = mid || null; U.plan = false; U.cal = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1); save(); U.keepScroll = false; render(); window.scrollTo(0, 0); }
  function remind(pid) { var p = getP(pid) || P(); if (!p) return; log('freelancer', 'Reminded ' + p.client.name, p.id); save(); toast('hello', 'Reminder sent', first(p.client.name) + ' will get a nudge from you.'); }
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
    if (act === 'finish-setup') { if (!U.agree) return; D.onboarded = true; D.projects = []; D.samples = false; D.cur = null; U.view = 'today'; log('freelancer', 'Set up the studio', null); save(); U.keepScroll = false; render(); window.scrollTo(0, 0); return; }
    if (act === 'view') { U.view = a.dataset.v; U.plan = false; U.cal = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1); U.keepScroll = false; render(); window.scrollTo(0, 0); return; }
    if (act === 'openp') { openProject(a.dataset.id, a.dataset.mid); return; }
    if (act === 'filter') { U.filter = a.dataset.f; if (U.view !== 'today') U.view = 'today'; render(); return; }
    if (act === 'cfilter') { U.cf = a.dataset.f; applyF(document.querySelector('.ftable[data-f="c"]')); return; }
    if (act === 'pfilter') { U.pf = a.dataset.f; applyF(document.querySelector('.ftable[data-f="p"]')); return; }
    if (act === 'ptab') { U.pt = a.dataset.t; render(); return; }
    if (act === 'acct') { D.role = 'freelancer'; if (a.dataset.m === 'new') { D.projects = []; D.samples = false; D.cur = null; } else { D.projects = seedProjects(); D.samples = true; D.cur = null; } U.view = 'today'; U.plan = false; U.modal = null; U.checkout = false; U.sel = null; U.more = false; U.waitOpen = false; U.calClient = ''; save(); document.getElementById('toasts').innerHTML = ''; U.keepScroll = false; render(); window.scrollTo(0, 0); return; }
    if (act === 'loadactive') { D.projects = seedProjects(); D.samples = true; D.cur = null; U.view = 'today'; save(); U.keepScroll = false; render(); window.scrollTo(0, 0); return; }
    if (act === 'more') { U.more = !U.more; render(); return; }
    if (act === 'waitopen') { U.waitOpen = !U.waitOpen; render(); return; }
    if (act === 'calclient') { U.calClient = a.dataset.id || ''; var cb0 = document.getElementById('calbox'); if (cb0) cb0.innerHTML = bigCalInner(calEvents()); return; }
    if (act === 'pcolor') { U.draft.ccolor = Number(a.dataset.i); render(); return; }
    if (act === 'pickplogo') { var pl = document.getElementById('plogo'); if (pl) pl.click(); return; }
    if (act === 'rmplogo') { U.draft.clogo = ''; render(); return; }
    if (act === 'editclient') { var cp = P(); U.modal = { t: 'editclient', f: { org: cp.client.org || '', name: cp.client.name, email: cp.client.email, color: cp.client.color || 0, logo: cp.client.logo || '' } }; render(); return; }
    if (act === 'ecolor') { U.modal.f.color = Number(a.dataset.i); render(); return; }
    if (act === 'pickelogo') { var el0 = document.getElementById('elogo'); if (el0) el0.click(); return; }
    if (act === 'rmelogo') { U.modal.f.logo = ''; render(); return; }
    if (act === 'saveclient') { var f0 = U.modal.f, c0 = P().client; c0.org = f0.org.trim(); c0.name = f0.name.trim() || c0.name; c0.email = f0.email.trim() || c0.email; c0.color = f0.color; c0.logo = f0.logo; save(); closeModal(); toast('thumbs', 'Client updated', 'Their color and logo show everywhere.'); return; }
    if (act === 'plan') { U.draft = defaultDraft(); U.plan = true; U.cal = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1); U.keepScroll = false; render(); window.scrollTo(0, 0); return; }
    if (act === 'cancelplan') { U.plan = false; render(); return; }
    if (act === 'tpl') {
      var d0 = U.draft, tot = totalDraft() || 100000, last = d0.ms.map(function (x) { return x.due; }).filter(Boolean).sort().pop() || dIso(30), t = a.dataset.t;
      var dueAt = function (f) { var span = Math.max(7, days(parse(last))); return iso(addDays(TODAY, Math.round(span * f))); };
      d0.ms = t === 'one' ? [{ name: 'Final delivery', amount: tot, due: dueAt(1) }] : t === 'half' ? [{ name: 'Kick-off', amount: Math.round(tot / 2), due: dueAt(0.4) }, { name: 'Final delivery', amount: tot - Math.round(tot / 2), due: dueAt(1) }] : [{ name: 'Stage 1', amount: Math.round(tot * 0.3), due: dueAt(0.33) }, { name: 'Stage 2', amount: Math.round(tot * 0.4), due: dueAt(0.66) }, { name: 'Final delivery', amount: tot - Math.round(tot * 0.3) - Math.round(tot * 0.4), due: dueAt(1) }];
      d0.err = {}; render(); return;
    }
    if (act === 'addms') { var l = U.draft.ms[U.draft.ms.length - 1]; U.draft.ms.push({ name: '', amount: 10000, due: iso(addDays(parse(l && l.due ? l.due : iso(TODAY)), 14)) }); render(); return; }
    if (act === 'rmms') { if (U.draft.ms.length > 1) { U.draft.ms.splice(Number(a.dataset.i), 1); render(); } return; }
    if (act === 'createproject') {
      var d = U.draft; d.err = validateDraft(d); if (Object.keys(d.err).length) { render(); toast('worry', 'A few things to fix', 'Check the highlighted fields.'); return; }
      var np = { id: uid() + uid().slice(0, 2), sample: false, name: d.name.trim(), client: { name: d.cname.trim(), org: d.corg.trim(), email: d.cemail.trim(), color: d.ccolor, logo: d.clogo }, ms: d.ms.map(function (x) { return newMs(x.name.trim(), Number(x.amount), x.due, Number(d.rounds)); }), clientIn: false, askedAt: new Date().toISOString(), reviewDays: Number(d.reviewDays), createdAt: new Date().toISOString() };
      D.projects.push(np); D.cur = np.id; U.plan = false; U.view = 'project'; U.pt = 'overview'; U.sel = null; log('freelancer', 'Created ' + np.name + ' with ' + np.ms.length + ' milestones', np.id); save(); U.modal = { t: 'invite' }; U.keepScroll = false; render(); window.scrollTo(0, 0); return;
    }
    if (act === 'invite') { U.modal = { t: 'invite' }; render(); return; }
    if (act === 'copylink') { var v = a.dataset.v; try { navigator.clipboard.writeText(v).then(function () { toast('thumbs', 'Copied', v); }, function () { toast('hello', 'Select and copy', v); }); } catch (er) { toast('hello', 'Select and copy', v); } return; }
    if (act === 'selms') { U.sel = a.dataset.id; U.fi = 0; render(); window.scrollTo(0, 0); return; }
    if (act === 'calnav') { var dir = Number(a.dataset.dir); U.cal = new Date(U.cal.getFullYear(), U.cal.getMonth() + dir, 1); var box = document.getElementById('calbox'); if (box) { var all = box.dataset.all; box.innerHTML = box.dataset.big ? bigCalInner(calEvents()) : box.dataset.draft ? draftCal() : calendar(all ? eventsAll() : events(), U.cal, all ? 5 : 4); } else render(); return; }
    if (act === 'remind') { e.stopPropagation(); remind(a.dataset.id); return; }
    if (act === 'pick') { var fi2 = document.getElementById('fi'); if (fi2) fi2.click(); return; }
    if (act === 'sample') { m = focusMs(); if (m) { U.uploading = [{ name: 'Moodboard.svg' }, { name: 'References.pdf' }, { name: 'Notes.docx' }]; render(); setTimeout(function () { U.uploading = []; attach(m, sampleFiles()); render(); toast('thumbs', '3 files ready', 'Protected previews were made automatically.'); }, REDUCE ? 50 : 1000); } return; }
    if (act === 'submit') { m = getMs(a.dataset.id); if (m && m.files.length) { doSubmit(m); render(); toast('point', 'Sent to ' + first(clientName()), 'They have until ' + long(replyBy(m)) + ' to reply.'); } return; }
    if (act === 'receipt') { if (a.dataset.pid) { D.cur = a.dataset.pid; } U.modal = { t: 'receipt', id: a.dataset.id, pid: a.dataset.pid || D.cur }; U.rtab = 'summary'; render(); return; }
    if (act === 'rtab') { U.rtab = a.dataset.t; render(); return; }
    if (act === 'gocheckout') { U.checkout = a.dataset.id; U.payErr = ''; P().clientIn = true; save(); render(); window.scrollTo(0, 0); return; }
    if (act === 'backcheckout') { U.checkout = false; U.payErr = ''; P().clientIn = false; render(); return; }
    if (act === 'pay') {
      e.preventDefault(); if (U.busy) return; var num = (document.getElementById('cnum') || {}).value || '', mm = getMs(U.checkout);
      U.busy = true; render();
      setTimeout(function () {
        U.busy = false;
        if (/0002\s*$/.test(num.replace(/\s/g, ''))) { U.payErr = 'Your card was declined.'; render(); return; }
        doFund(mm); var f = fees(mm.amount); U.checkout = false; U.sel = mm.id; U.modal = { t: 'paid', amount: f.total, name: mm.name }; render();
      }, REDUCE ? 100 : 1100); return;
    }
    if (act === 'file') { U.fi = Number(a.dataset.i); render(); return; }
    if (act === 'askapprove') { U.modal = { t: 'approve', id: a.dataset.id }; render(); return; }
    if (act === 'askchanges') { U.modal = { t: 'changes', id: a.dataset.id }; U.fb = { note: '' }; render(); var nf = document.getElementById('note'); if (nf) nf.focus(); return; }
    if (act === 'approve') { m = getMs(a.dataset.id); doApprove(m); U.sel = m.id; U.modal = { t: 'released', id: m.id, who: 'client' }; render(); return; }
    if (act === 'sendchanges') {
      m = getMs(a.dataset.id); var txt = ((document.getElementById('note') || {}).value || '').trim();
      if (txt.length < 5) { var er2 = document.getElementById('noteerr'); if (er2) er2.textContent = 'Add a short note so ' + first(D.studio.name) + ' knows what to change.'; return; }
      doChanges(m, txt); U.modal = null; U.fi = 0; U.fb = { note: '' }; render(); toast('thumbs', 'Sent to ' + first(D.studio.name), 'Round ' + m.revisions + ' of ' + m.limit + ' used.'); return;
    }
    if (act === 'dl') { toast('thumbs', 'Downloading ' + a.dataset.n, 'Original file. In the real product this saves to your device.'); return; }
  });
  document.addEventListener('submit', function (e) { e.preventDefault(); });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'agree') { U.agree = t.checked; var b = document.getElementById('cont'); if (b) b.disabled = !U.agree; return; }
    if (t.tagName === 'SELECT' && t.dataset.d && U.draft) { U.draft[t.dataset.d] = Number(t.value); return; }
    if (t.id === 'plogo' && t.files[0] && U.draft) shrink(t.files[0], function (u) { U.draft.clogo = u; render(); });
    if (t.id === 'elogo' && t.files[0] && U.modal) shrink(t.files[0], function (u) { U.modal.f.logo = u; render(); });
  });
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.dataset.ec && U.modal && U.modal.f) { U.modal.f[t.dataset.ec] = t.value; return; }
    if (t.id === 'note') { U.fb.note = t.value; return; }
    if (t.id === 'q') { U.q = t.value; applyF(document.querySelector('.ftable[data-f="c"]')); return; }
    if (t.dataset.in) { var p = t.dataset.in.split('.'); D[p[0]][p[1]] = t.value; save(); return; }
    if (!U.draft) return;
    if (t.dataset.d && t.tagName !== 'SELECT') { U.draft[t.dataset.d] = t.value; if (t.dataset.d === 'cname') { var b2 = document.querySelector('[data-a="createproject"]'); if (b2) b2.textContent = 'Create and invite ' + (first(t.value) || 'client'); } return; }
    if (t.dataset.di !== undefined) {
      var i = Number(t.dataset.di), f = t.dataset.df; U.draft.ms[i][f] = f === 'amount' ? Number(String(t.value).replace(/[^0-9]/g, '')) : t.value;
      if (f === 'due' && t.value) { var dd = parse(t.value); U.cal = new Date(dd.getFullYear(), dd.getMonth(), 1); }
      var ok = U.draft.ms.every(function (m, k) { return k === 0 || !m.due || !U.draft.ms[k - 1].due || m.due >= U.draft.ms[k - 1].due; });
      var w = document.getElementById('orderwarn'); if (w) w.innerHTML = ok ? '' : '<p class="hint-err" style="margin-top:8px">Dates should go in order, earliest first.</p>';
      var tt = document.getElementById('tot'); if (tt) tt.textContent = inr(totalDraft());
      var box = document.getElementById('calbox'); if (box) box.innerHTML = draftCal();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && U.modal) closeModal();
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('fr') && e.target.dataset.a) { e.preventDefault(); e.target.click(); }
  });
  window.addEventListener('storage', function (e) { if (e.key === KEY) { D = load(); render(); } });

  render();
})();
