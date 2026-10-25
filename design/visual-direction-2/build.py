import random, subprocess, os
D='/Users/prayanipohekar/PayGuard/design/visual-direction-2'
MASCOT='file:///Users/prayanipohekar/PayGuard/design/mascot/svg/'
IC={
'dash':'<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
'users':'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
'cal':'<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/>',
'wallet':'<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
'sliders':'<path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"/>',
'bell':'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
'plus':'<path d="M5 12h14M12 5v14"/>','chev':'<path d="m9 18 6-6-6-6"/>','down':'<path d="m6 9 6 6 6-6"/>','up':'<path d="m18 15-6-6-6 6"/>',
'check':'<path d="M20 6 9 17l-5-5"/>','arrow':'<path d="M7 7h10v10M7 17 17 7"/>','more':'<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
'upload':'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>','download':'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
'link':'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
'send':'<path d="m22 2-7 20-4-9-9-4zM22 2 11 13"/>','lock':'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>','unlock':'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
'clock':'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>','file':'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
'eye':'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>','flag':'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
'pen':'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>','tag':'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8zM7 7h.01"/>','user':'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
'filter':'<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>','rupee':'<path d="M6 3h12M6 8h12M6 13h8a4 4 0 0 0 0-5M9 13l7 8"/>','layers':'<path d="m12 2 10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
}
def ic(n,c=''): return f'<svg class="i {c}" viewBox="0 0 24 24">{IC[n]}</svg>'
HUE={'Bloom Studio':('ros','BS'),'Acme Logistics':('sky','AL'),'Northwind Cafe':('pea','NC'),'Tidal Health':('min','TH'),'Orbit Labs':('lav','OL'),'Greenleaf Foods':('lim','GF'),'Lumen Realty':('pea','LR'),'Kite Fitness':('ros','KF'),'Saffron Hotels':('lav','SH'),'Studio Nine':('min','S9')}
def av(name,cls=''): h,i=HUE[name]; return f'<span class="av {h} {cls}">{i}</span>'
def page(title,active,body,top_left,top_right='',extra_css='',w=1440):
    nav=[('dash','Today'),('users','Clients'),('cal','Calendar'),('wallet','Payments')]
    nv=''.join(f'<a class="{"on" if n==active else ""}" title="{n}">{ic(i)}{"<span class=dot></span>" if n=="Payments" else ""}</a>' for i,n in nav)
    return f'''<!doctype html><html><head><meta charset="utf-8"><title>{title}</title><link rel="stylesheet" href="ds.css"><style>{extra_css}</style></head><body><div class="shell" style="width:{w}px">
<aside class="rail"><div><div class="logo">PG</div><nav>{nv}</nav></div><div style="display:grid;gap:10px;justify-items:center"><a title="Settings" style="width:46px;height:46px;display:grid;place-items:center">{ic('sliders')}</a><div class="me">MI</div></div></aside>
<main class="main"><header class="top"><div>{top_left}</div><div class="right">{top_right or ('<span class="btn ic sec">'+ic('bell')+'</span><span class="btn">'+ic('plus','s')+'New project</span>')}</div></header>{body}</main></div></body></html>'''
def write(name,html): open(f'{D}/{name}.html','w').write(html)

# ---------- shared data
TODO=[('Saffron Hotels','Remind Meher: advance 5 days late','Logo options',0,2,'Remind','late'),
('Northwind Cafe','Remind Sana: payment 4 days late','Concepts',0,2,'Remind','late'),
('Kite Fitness','Upload previews: 1 day late','Landing page',0,2,'Upload','late'),
('Studio Nine','Reply to Isha: problem reported','Style frames',0,2,'Reply','wait'),
('Bloom Studio','Remind Priya: approval 1 day late','Homepage design',1,4,'Remind','wait'),
('Tidal Health','Make changes: round 1 of 2','Flows',1,3,'Open',''),
('Acme Logistics','Upload previews: due in 2 days','UI kit',2,4,'Upload','')]
def todo_rows(n=7):
    out=''
    for c,t,s,d,tot,b,st in TODO[:n]:
        tk=''.join(f'<i class="{"f" if i<d else ""}"></i>' for i in range(tot))
        chip={'late':'<span class="chip late"><i></i>Late</span>','wait':'<span class="chip wait"><i></i>Needs you</span>','':''}[st]
        pri='' if st=='' else ''
        out+=f'<div class="row">{av(c)}<div><div class="t">{t}</div><div class="s">{c} · {s}</div></div><div style="display:flex;gap:10px;align-items:center"><div class="ticks">{tk}</div></div><span class="btn sm {"" if st else "sec"}">{b}</span></div>'
    return out
def bars(vals,top,labels,hi=None,cur=None,tip=None):
    h='';l=''
    for i,v in enumerate(vals):
        cls=('dk' if i==hi else 'cur' if i==cur else '')
        t=f'<span class="tip">{tip}</span>' if i==hi else ''
        h+=f'<b class="{cls}" style="height:{max(4,v/top*100)}%">{t}</b>'; l+=f'<span>{labels[i]}</span>'
    return f'<div class="bars">{h}</div><div class="blab">{l}</div>'
def mini_cal():
    days=['M','T','W','T','F','S','S']; cells=''.join(f'<b>{d}</b>' for d in days)
    for d in ['28','29','30']: cells+=f'<span class="o">{d}</span>'
    marks={18:'d l',21:'d l',24:'d l',25:'t',27:'d',28:'d'}
    for i in range(1,32): cells+=f'<span class="{marks.get(i,"")}">{i}</span>'
    return f'<div class="mini-cal">{cells}</div>'
def heat(weeks=18):
    random.seed(7); cells=''
    for w in range(weeks):
        for d in range(7):
            base=random.random()
            if d>=5: base*=.45
            lv=0 if base<.35 else 1 if base<.55 else 2 if base<.75 else 3 if base<.9 else 4
            if w==weeks-1 and d>5: lv=0
            cells+=f'<i class="{"l"+str(lv) if lv else ""}"></i>'
    return f'<div class="heat" style="grid-template-rows:repeat(7,auto);grid-auto-flow:column;grid-template-columns:none;grid-auto-columns:1fr">{cells}</div>'

# ---------- TODAY
today_top='''<div class="over">Sunday · 25 October</div><div class="h-display" style="margin-top:6px">Hey Meera, it's Sunday.<br>Look at you, working.</div><p class="sub" style="margin-top:8px">Just the important bits below. Then go touch some grass.</p>'''
today_right=f'''<div style="display:flex;gap:14px;align-items:center"><div class="card well" style="padding:14px 20px;display:flex;gap:28px;border-radius:20px"><div><div class="num-l">12</div><div class="small mute">Delivered<br>this month</div></div><div><div class="num-l">04</div><div class="small mute">In progress</div></div><div><div class="num-l">02</div><div class="small mute">New this<br>week</div></div></div><span class="btn ic sec">{ic('bell')}</span><span class="btn">{ic('plus','s')}New project</span></div>'''
clients_cards=''.join(f'<div class="card {h} hover" style="padding:16px;border-radius:18px"><div style="display:flex;justify-content:space-between;align-items:center"><span class="ibox" style="width:38px;height:38px;border-radius:11px">{av(n,"s")}</span><span class="small mute">{p}%</span></div><div style="margin:14px 0 4px;font:600 16px/20px var(--f-display)">{n}</div><div class="small mute">{sub}</div><div class="pbar" style="margin-top:12px"><i style="width:{p}%"></i></div></div>' for i,(n,h,sub,p) in enumerate([('Bloom Studio','ros','1 of 4 approved',25),('Acme Logistics','sky','2 of 4 approved',50),('Tidal Health','min','1 of 3 approved',33)]))
today_body=f'''<div class="bento">
<div class="c4 stack">
 <div class="card dark" style="padding:28px"><div class="chd" style="margin-bottom:6px"><div><div class="over" style="color:var(--on-dark-mute)">Received · October</div></div><span class="chip lime">▲ 18% vs Sept</span></div>
  <div class="num-xl" style="margin:8px 0 4px">₹2,43,000</div><div class="small" style="color:var(--on-dark-mute)">In your account</div>
  <div style="background:var(--on-dark);color:var(--ink);border-radius:20px;padding:16px 18px;margin-top:22px"><div style="display:flex;justify-content:space-between" class="small"><b>This month's goal</b><span class="mute">₹2,50,000</span></div><div class="pbar lime" style="margin:10px 0;background:var(--line)"><i style="width:97%"></i></div><div style="display:flex;justify-content:space-between" class="small"><span><b>97%</b> collected</span><span class="mute">₹7,000 to go</span></div></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px"><div style="background:var(--dark-2);border-radius:16px;padding:14px"><div class="small mute" style="color:var(--on-dark-mute)">Pending · not due</div><div class="num-m" style="margin-top:4px">₹6,95,000</div></div><div style="background:var(--dark-2);border-radius:16px;padding:14px"><div class="small" style="color:#B4233C">Late · 2 clients</div><div class="num-m" style="margin-top:4px">₹62,000</div></div></div>
  <div style="display:flex;gap:10px;margin-top:20px"><span class="btn onDark sm">View payments</span><span class="btn lime sm">Remind late clients</span></div></div>
 <div class="card"><div class="chd"><div><div class="h3">Your activity</div><div class="small mute">Things you finished each day, last 18 weeks</div></div><span class="chip">47 done</span></div>{heat()}<div style="display:flex;justify-content:space-between;margin-top:14px" class="small mute"><span>Best day: 6 on 14 Oct</span><span>Streak: 5 days</span></div></div>
</div>
<div class="c5 stack">
 <div class="card well" style="padding:20px"><div class="chd" style="margin-bottom:12px"><div class="h3">Active clients <span class="mute" style="font-weight:500">8</span></div><span class="small mute">All clients →</span></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">{clients_cards}</div></div>
 <div class="card"><div class="chd"><div><div class="h2">To do <span class="mute" style="font-weight:500">7</span></div><div class="small mute">Most urgent first</div></div><div class="seg"><span class="on">All <em>7</em></span><span>Late <em>3</em></span><span>Deliverables <em>3</em></span></div></div>{todo_rows(5)}<div style="display:flex;justify-content:center;margin-top:10px"><span class="btn sec sm">Show all 7 {ic('down','s')}</span></div></div>
</div>
<div class="c3 stack">
 <div class="card"><div class="chd"><div><div class="h3">Earned</div><div class="num-m" style="margin-top:6px">₹72,000</div><div class="small mute">week of 12 Oct</div></div><div class="seg"><span class="on">Weeks</span><span>Months</span></div></div>{bars([22,0,35,41,18,0,52,60,28,45,72,58],80,['3 Aug','','17','','31','','14 Sep','','28','','12 Oct','19'],hi=10,cur=11,tip='₹72,000')}</div>
 <div class="card"><div class="chd"><div><div class="h3">Billed vs received</div><div class="small mute">Last 6 months</div></div></div>
  <div class="bars" style="height:120px">{''.join(f'<div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;gap:3px;height:100%"><b style="flex:none;height:{a}%;background:#FFD7D3;border-radius:8px"></b><b style="flex:none;height:{b}%;background:var(--ink);border-radius:8px"></b></div>' for a,b in [(12,40),(8,52),(15,36),(10,60),(18,66),(24,92)])}</div><div class="blab"><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div>
  <div style="display:flex;gap:16px;margin-top:12px" class="small mute"><span><span class="chip dark" style="height:10px;width:10px;padding:0"></span> Received</span><span><span class="chip late" style="height:10px;width:10px;padding:0"></span> Still owed</span></div></div>
 <div class="card lav" style="box-shadow:none"><div class="chd" style="margin-bottom:10px"><div class="h3">October</div><span class="small" style="opacity:.6">3 late · 2 coming</span></div>{mini_cal()}</div>
</div></div>'''
write('01-today',page('Today','Today',today_body,today_top,today_right))

# ---------- CLIENT PAGE
def tl(state,icon,title,chip,right,body=''):
    node={'done':'<span class="av s" style="background:var(--paid);color:#fff">'+ic('check','s')+'</span>','now':'<span class="av s" style="background:var(--ink);color:#fff">2</span>','next':'<span class="av s" style="background:var(--well);color:var(--mute);border:1px solid var(--line)">'+icon+'</span>'}[state]
    chev=ic('up','s') if body else ic('down','s')
    return f'<div style="display:grid;grid-template-columns:40px minmax(0,1fr);gap:16px"><div style="display:flex;flex-direction:column;align-items:center">{node}<div style="flex:1;width:2px;background:var(--line);margin-top:6px"></div></div><div style="padding-bottom:18px"><div class="card" style="padding:{"20px 24px" if body else "14px 20px"};border-radius:20px"><div style="display:flex;align-items:center;gap:12px"><div class="h3">{title}</div>{chip}<div style="margin-left:auto;display:flex;align-items:center;gap:12px" class="small mute">{right}<span class="btn ic sm sec">{chev}</span></div></div>{body}</div></div></div>'
open_body=f'''<div style="display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:36px;margin-top:20px;padding-top:20px;border-top:1px solid var(--line-2)">
<div><div style="display:flex;align-items:center;gap:14px"><span class="ibox">{ic('layers')}</span><div><div class="h2">What you agreed</div><div class="small mute">Deliverable 2 of 4 · due Wed 21 Oct</div></div></div>
<div style="margin-top:16px"><span class="pgress"><span class="small">3 of 3 included</span><span class="tr"><i style="width:100%"></i></span><span class="small">100%</span></span></div>
<div class="tree">{''.join(f'<div><span class="ck">{ic("check","s")}</span>{t}</div>' for t in ['Desktop and mobile homepage in Figma','One visual direction, refined','Copy placed from your doc'])}</div></div>
<div><div class="kv"><span>{ic('flag','s')}Status</span><span><span class="chip wait menu">Awaiting payment</span></span></div>
<div class="kv"><span>{ic('rupee','s')}Amount</span><b>₹60,000</b></div>
<div class="kv"><span>{ic('clock','s')}Pay by</span><span>Sat 31 Oct</span></div>
<div class="kv"><span>{ic('layers','s')}Rounds</span><span>0 of 2 used</span></div>
<div class="kv" style="align-items:start"><span>{ic('user','s')}People</span><span style="display:flex;gap:8px;flex-wrap:wrap"><span class="pill">{av('Bloom Studio','s')}Priya Nair</span><span class="pill"><span class="av s lav">MI</span>Meera</span></span></div>
<div class="kv" style="align-items:start"><span>{ic('file','s')}Files</span><span style="display:flex;gap:8px;flex-wrap:wrap"><span class="chip">Moodboard.svg</span><span class="chip">References.pdf</span><span class="chip">Notes.docx</span></span></div></div></div>
<div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding:14px 16px;border-radius:14px;background:#F7F7F5"><span class="small"><b>Priya approved this yesterday.</b> <span class="mute">Waiting for ₹60,000, due Sat 31 Oct.</span></span><span style="display:flex;gap:8px"><span class="btn ic sec" title="Mark as paid">{ic('check')}</span><span class="btn ic sec" title="Unlock without payment">{ic('unlock')}</span><span class="btn">{ic('bell','s')}Remind Priya</span></span></div>'''
client_top=f'''<div style="display:flex;gap:16px;align-items:center"><span class="av l ros">BS</span><div><div class="over">Clients › Bloom Studio</div><div class="h1">Bloom Studio</div><div class="sub">Priya Nair · Website redesign</div></div></div>'''
client_right=f'<span class="btn ic sec">{ic("bell")}</span><span class="btn sec">{ic("link","s")}Client link</span><span class="btn sec">{ic("eye","s")}View as Priya</span><span class="btn">Details</span>'
client_body=f'''<div class="bento"><div class="c8">
{tl('done','','Contract','<span class="chip paid"><i></i>Signed by both</span>','signed 23 Sept')}
{tl('done','','Advance','<span class="chip paid"><i></i>Paid</span>','₹30,000 · 50%')}
{tl('done','','Discovery','<span class="chip paid"><i></i>Unlocked</span>','₹30,000 · paid 16 Oct')}
{tl('now','','Homepage design','<span class="chip wait"><i></i>Awaiting payment</span>','₹60,000 · due 21 Oct',open_body)}
{tl('next','3','Inner pages','<span class="chip">Not started</span>','₹45,000 · due 9 Nov')}
{tl('next','4','Handoff','<span class="chip">Not started</span>','₹25,000 · due 21 Nov')}
</div><div class="c4 stack">
<div class="card"><div class="chd"><div><div class="over">Project</div><div class="num-l" style="margin-top:4px">1 of 4</div><div class="small mute">deliverables approved</div></div><span class="ibox">{ic('layers')}</span></div><div class="pbar"><i style="width:25%"></i></div></div>
<div class="card"><div class="h3" style="margin-bottom:14px">Money</div><div class="num-l">₹1,60,000</div><div class="small mute">Total project value</div><div style="display:flex;height:12px;gap:3px;margin:16px 0"><i style="width:37%;background:var(--paid);border-radius:6px"></i><i style="width:37.5%;background:var(--wait);border-radius:6px;opacity:.55"></i><i style="flex:1;background:var(--line);border-radius:6px"></i></div>
<div style="display:grid;gap:8px" class="small"><div style="display:flex;justify-content:space-between"><span><span class="chip paid" style="width:10px;height:10px;padding:0"></span> Received</span><b>₹60,000</b></div><div style="display:flex;justify-content:space-between"><span><span class="chip wait" style="width:10px;height:10px;padding:0"></span> Awaiting</span><b>₹60,000</b></div><div style="display:flex;justify-content:space-between"><span><span class="chip" style="width:10px;height:10px;padding:0"></span> Not started</span><b>₹40,000</b></div></div></div>
<div class="card"><div class="h3" style="margin-bottom:6px">Activity</div>{''.join(f'<div class="row" style="grid-template-columns:32px minmax(0,1fr) auto"><span class="av s {c}">{i}</span><div class="small"><b>{t}</b></div><span class="small mute">{w}</span></div>' for c,i,t,w in [('ros','PN','Priya approved Homepage design','yesterday'),('ros','PN','Priya opened the link','2 days ago'),('lim','MI','You sent Homepage design for review','3 days ago'),('ros','PN','Priya paid for Discovery','9 days ago')])}</div>
</div></div>'''
write('02-client-page',page('Client','Clients',client_body,client_top,client_right))

# ---------- CALENDAR
def ev(c,t,sub,kind,cls):
    chip={'Due':'<span class="chip" style="background:rgba(21,23,26,.08);color:var(--ink)">Due</span>','Pay':'<span class="chip late"><i></i>Payment</span>','Reply':'<span class="chip wait"><i></i>Reply</span>'}[kind]
    return f'<div class="card cev {cls}" style="border-radius:16px;padding:14px"><div style="display:flex;justify-content:space-between;align-items:center">{chip}<span class="av {HUE[c][0]}" style="width:24px;height:24px;font-size:9px;background:rgba(255,255,255,.75)">{HUE[c][1]}</span></div><div style="font:700 14px/18px var(--f-ui);margin-top:12px">{t}</div><div class="small" style="opacity:.65;margin-top:2px">{sub}</div></div>'
days=[('Mon','19',[]),('Tue','20',[ev('Bloom Studio','Reply due','Homepage design','Reply','ros')]),('Wed','21',[ev('Northwind Cafe','Payment was due','Concepts · ₹35,000','Pay','pea'),ev('Kite Fitness','Delivery was due','Landing page','Due','ros')]),('Thu','22',[]),('Fri','23',[ev('Tidal Health','Reply due','Flows','Reply','min')]),('Sat','24',[ev('Acme Logistics','Delivery was due','UI kit','Due','sky')]),('Sun','25',[])]
EMPTY='<div class="small" style="text-align:center;color:var(--faint);padding:14px">Nothing due</div>'
def daycol(d,n,e):
    cl="tod" if n=="25" else "well"
    inner="".join(e) if e else EMPTY
    return f'<div style="display:grid;gap:12px;align-content:start"><div class="card {cl}" style="padding:12px;border-radius:18px;text-align:center;box-shadow:none"><div class="small" style="opacity:.6">{d}</div><div class="num-m">{n}</div></div>{inner}</div>'
wk="".join(daycol(d,n,e) for d,n,e in days)
leg=''.join(f'<div style="display:flex;align-items:center;gap:10px;padding:6px 0">{av(n,"s")}<span style="font-weight:500">{n}</span></div>' for n in ['Bloom Studio','Acme Logistics','Northwind Cafe','Tidal Health','Orbit Labs'])
cal_body=f'''<div class="bento"><div class="c3 stack"><div class="card"><div class="chd" style="margin-bottom:10px"><div class="h3">October 2026</div><span style="display:flex;gap:6px"><span class="btn ic sm sec" style="transform:scaleX(-1)">{ic('chev','s')}</span><span class="btn ic sm sec">{ic('chev','s')}</span></span></div>{mini_cal()}</div><div class="card"><div class="h3" style="margin-bottom:8px">Clients</div>{leg}<div class="small mute" style="margin-top:6px">+ 5 more</div></div><div class="card lim" style="box-shadow:none"><div class="over" style="opacity:.6">This week</div><div style="display:grid;gap:8px;margin-top:10px"><div style="display:flex;justify-content:space-between"><span>Late</span><b>3</b></div><div style="display:flex;justify-content:space-between"><span>Coming up</span><b>2</b></div><div style="display:flex;justify-content:space-between"><span>Reply windows</span><b>2</b></div></div></div></div>
<div class="c9"><div class="card" style="padding:24px"><div class="chd" style="align-items:center"><div style="display:flex;align-items:center;gap:10px"><span class="btn ic sm sec" style="transform:scaleX(-1)">{ic('chev','s')}</span><span class="btn ic sm sec">{ic('chev','s')}</span><div class="h2" style="margin-left:6px">19 – 25 October</div></div><div style="display:flex;gap:10px;align-items:center"><span class="btn sec sm">Today</span><div class="seg"><span class="on">Week</span><span>Month</span></div></div></div><div style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:14px">{wk}</div></div></div></div>'''
write('03-calendar',page('Calendar','Calendar',cal_body,'<div class="over">Calendar</div><div class="h1">Due dates and windows</div><div class="sub">Everything with a date, in one place</div>'))

# ---------- PAYMENTS
rows=[('Northwind Cafe','Concepts','₹35,000','late','Late · 4 days'),('Saffron Hotels','Logo options','₹27,000','late','Late · 5 days'),('Bloom Studio','Homepage design','₹60,000','pend','Not paid'),('Bloom Studio','Discovery','₹30,000','paid','Paid · 16 Oct'),('Acme Logistics','Wireframes','₹35,000','paid','Paid · 14 Oct'),('Tidal Health','Research','₹40,000','paid','Paid · 9 Oct'),('Acme Logistics','UI kit','₹70,000','pend','Not paid')]
chipcls={'late':'late','pend':'','paid':'paid'}
trs=''.join(f'<tr><td><div class="who">{av(c)}{c}</div></td><td>{d}</td><td><b>{a}</b></td><td><span class="chip {chipcls[s]}"><i></i>{lab}</span></td><td style="text-align:right"><span class="btn ic sm sec">{ic("more","s")}</span></td></tr>' for c,d,a,s,lab in rows)
pay_body=f'''<div class="bento"><div class="c4 stack"><div class="card dark" style="padding:28px"><div class="over" style="color:var(--on-dark-mute)">Earned to date</div><div class="num-xl" style="margin:10px 0 4px">₹2,43,000</div><div class="small" style="color:var(--on-dark-mute)">Received in your account</div><div style="display:flex;gap:10px;margin-top:22px"><span class="btn onDark sm">Export</span><span class="chip lime">▲ 18% vs Sept</span></div></div>
<div class="card well"><div style="display:flex;justify-content:space-between;align-items:center"><div><div class="over">Not received yet</div><div class="num-l" style="margin-top:6px">₹7,57,000</div></div><span class="chip wait"><i></i>Live</span></div><div style="display:flex;height:12px;gap:3px;margin:18px 0 10px"><i style="width:8%;background:var(--late);border-radius:6px"></i><i style="flex:1;background:#CFC9BD;border-radius:6px"></i></div><div class="small mute" style="display:flex;justify-content:space-between"><span><b style="color:var(--late)">₹62,000</b> late</span><span>₹6,95,000 not due yet</span></div></div></div>
<div class="c8 stack"><div class="bento" style="gap:20px"><div class="card c6"><div class="chd"><div><div class="h3">Income</div><div class="num-m" style="margin-top:6px">₹2,43,000</div></div><div class="seg"><span class="on">Weeks</span><span>Months</span></div></div>{bars([22,0,35,41,18,0,52,60,28,45,72,58],80,['3 Aug','','17','','31','','14 Sep','','28','','12 Oct','19'],hi=10,cur=11,tip='₹72,000')}</div>
<div class="card c6"><div class="chd"><div><div class="h3">Still owed</div><div class="num-m" style="margin-top:6px">₹7,57,000</div></div><span class="chip">by month due</span></div>{bars([20,45,30,70,55,40],80,['Oct','Nov','Dec','Jan','Feb','Mar'],hi=3,tip='₹2,10,000')}</div></div></div>
<div class="c12"><div class="card"><div class="chd" style="align-items:center"><div class="h2">All payments</div><div style="display:flex;gap:10px;align-items:center"><div class="input" style="width:190px;height:36px">All clients <span style="margin-left:auto">{ic('down','s')}</span></div><div class="seg"><span class="on">All</span><span>Paid</span><span>Not paid</span></div></div></div><table class="tbl"><thead><tr><th>Client</th><th>Deliverable</th><th>Amount</th><th>Status</th><th></th></tr></thead><tbody>{trs}</tbody></table></div></div></div>'''
write('04-payments',page('Payments','Payments',pay_body,'<div class="over">Payments</div><div class="h1">Money in, money owed</div><div class="sub">Received or not received. Nothing else.</div>'))

# ---------- CLIENTS
cl=[('Bloom Studio','Priya Nair','Homepage design','1 of 4',25,'₹1,60,000','Needs you','wait','Waiting on payment'),('Acme Logistics','Rohit Mehta','UI kit','2 of 4',50,'₹2,10,000','Needs you','late','Upload due today'),('Northwind Cafe','Sana Qureshi','Concepts','0 of 2',0,'₹75,000','Needs you','late','Payment 4 days late'),('Tidal Health','Vikram Rao','Flows','1 of 3',33,'₹1,25,000','Waiting','','Changes round 1'),('Orbit Labs','Neha Kapoor','Pitch deck','3 of 3',100,'₹90,000','Done','paid','All unlocked'),('Greenleaf Foods','Anil Shah','Content calendar','1 of 3',33,'₹1,14,000','On track','','Due in 6 days'),('Lumen Realty','Karan Bhatia','Layout','0 of 2',0,'₹60,000','On track','','Due in 9 days'),('Kite Fitness','Neel Arora','Landing page','0 of 2',0,'₹60,000','Needs you','late','Upload 1 day late')]
def ccard(n,p,cur,done,pct,val,st,cls,note):
    h=HUE[n][0]
    return f'<div class="card {h} hover c3" style="box-shadow:none;padding:20px;border-radius:24px"><div style="display:flex;justify-content:space-between;align-items:flex-start"><span class="av l" style="background:#fff">{HUE[n][1]}</span><span class="chip {cls}"><i></i>{st}</span></div><div class="h2" style="margin-top:22px">{n}</div><div class="small" style="opacity:.65">{p}</div><div style="margin:18px 0 8px;display:flex;justify-content:space-between" class="small"><span><b>{cur}</b></span><span style="opacity:.65">{done} approved</span></div><div class="pbar" style="background:rgba(21,23,26,.1)"><i style="width:{pct}%"></i></div><div style="display:flex;justify-content:space-between;margin-top:16px;align-items:center"><b>{val}</b><span class="small" style="opacity:.65">{note}</span></div></div>'
cl_body=f'''<div style="display:flex;justify-content:space-between;align-items:center"><div class="seg"><span class="on">All <em>10</em></span><span>Needs you <em>4</em></span><span>Waiting <em>1</em></span><span>On track <em>2</em></span><span>Done <em>1</em></span></div><div class="input" style="width:260px;height:40px;color:var(--mute)">Filter clients…</div></div>
<div class="bento">{''.join(ccard(*c) for c in cl)}</div>'''
write('05-clients',page('Clients','Clients',cl_body,'<div class="over">Clients</div><div class="h1">10 clients</div><div class="sub">Including finished work</div>'))

# ---------- DESIGN SYSTEM SHEET
sw=lambda n,h,t='#fff': f'<div style="flex:1;min-width:0"><div style="height:64px;border-radius:16px;background:{h};border:1px solid var(--line);display:flex;align-items:flex-end;padding:8px;color:{t};font:600 11px var(--f-ui)"></div><div class="small" style="margin-top:6px"><b>{n}</b><br><span class="mute">{h}</span></div></div>'
hues=''.join(f'<div style="flex:1"><div style="height:64px;border-radius:16px;background:var(--{a});"></div><div style="height:18px;border-radius:9px;background:var(--{a}-x);margin-top:6px"></div><div class="small" style="margin-top:6px"><b>{n}</b><br><span class="mute">{{s}}</span></div></div>'.replace('{s}',s) for n,a,s in [('Lavender','lav','#E7E1FF / #8F7CF0'),('Peach','pea','#FFE5CB / #F2A15F'),('Lime','lim','#EEF6B8 / #B9CC2E'),('Mint','min','#D8F2E5 / #4DB887'),('Rose','ros','#FFDFE2 / #E8697A'),('Sky','sky','#DCEDFF / #5AA8F0')])
sheet=f'''<div class="bento">
<div class="c12"><div class="card" style="padding:32px"><div class="over">Visual direction · Soft Cards</div><div class="h-display" style="margin-top:8px">The PayGuard design system</div><p class="sub" style="margin-top:8px;max-width:760px">Clean white cards floating on a barely-warm canvas, soft shadows instead of borders, green progress, soft status chips with a small dropdown arrow, avatar pills, and tree-line checklists. Quiet and trustworthy for money, with just enough warmth to feel friendly.</p></div></div>
<div class="c6"><div class="card"><div class="h2" style="margin-bottom:16px">Typography</div>
<div class="over">Display and numerals · Inter Tight 700</div><div class="h-display" style="margin:6px 0 4px">Hey Meera, ₹2,43,000</div><div class="small mute">36 / 42 · greeting and page heroes · −2% tracking</div>
<div style="height:1px;background:var(--line-2);margin:16px 0"></div><div class="over">Money numerals · Inter Tight 700</div><div class="num-xl" style="margin:6px 0">₹6,95,000</div><div class="small mute">52 / 56 hero · 32 / 36 large · 22 / 26 medium</div>
<div style="height:1px;background:var(--line-2);margin:16px 0"></div><div class="over">Headings · Inter Tight 600</div><div class="h1" style="margin:6px 0">Money in, money owed</div><div class="h2">To do 7 · 20 / 26</div>
<div style="height:1px;background:var(--line-2);margin:16px 0"></div><div class="over">Interface · Inter 400 / 500 / 600 / 700</div><div style="margin-top:8px"><b style="font-size:16px">Card title · 16 / 22 · 600</b><br>Body text for lists and forms, 14 / 20 · 400.<br><span class="small mute">Secondary text, 13 / 18 · 400 · colour #7A7F87</span><br><span class="over">Overline · 12 / 16 · 600 · +8% tracking · caps</span></div>
<div class="small mute" style="margin-top:14px">Tables and amounts use tabular figures so columns line up.</div></div></div>
<div class="c6 stack"><div class="card"><div class="h2" style="margin-bottom:14px">Neutrals and ink</div><div style="display:flex;gap:10px">{sw('Canvas','#F6F6F4','#000')}{sw('Surface','#FFFFFF','#000')}{sw('Well','#F6F6F4','#000')}{sw('Line','#E8E8E5','#000')}</div><div style="display:flex;gap:10px;margin-top:14px">{sw('Ink','#111214')}{sw('Ink 2','#3A3D42')}{sw('Mute','#6F7278')}{sw('Green','#22C55E')}</div></div>
<div class="card"><div class="h2" style="margin-bottom:14px">Accent and money meanings</div><div style="display:flex;gap:10px">{sw('Brand blue','#2F5BEA')}{sw('Progress green','#22C55E')}{sw('Received','#157A3E')}{sw('Late','#B4233C')}{sw('Waiting','#8A5A00')}</div><div class="small mute" style="margin-top:12px">Blue = action and today. Green = progress and money received. Red / amber are only ever used for late and waiting. Status chips use a soft fill with dark text.</div></div></div>
<div class="c12"><div class="card"><div class="chd"><div><div class="h2">Client hues</div><div class="small mute">Client colour is kept small: it tints the avatar and the avatar ring only, and marks their blocks on the calendar. Cards stay white. Status never uses these.</div></div></div><div style="display:flex;gap:14px">{hues}</div></div></div>
<div class="c6"><div class="card"><div class="h2" style="margin-bottom:16px">Buttons · 12 px radius, chips are pills</div>
<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><span class="btn lg">Primary 48</span><span class="btn">Primary 40</span><span class="btn sm">Primary 32</span></div>
<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:14px"><span class="btn sec">Secondary</span><span class="btn ghost">Ghost</span><span class="btn lime">Highlight</span><span class="btn blue">Pay ₹35,000</span><span class="btn danger">Delete</span></div>
<div style="display:flex;gap:12px;align-items:center;margin-top:14px"><span class="btn ic sec">{ic('check')}</span><span class="btn ic sec">{ic('unlock')}</span><span class="btn ic">{ic('plus')}</span><span class="btn ic sm sec">{ic('more','s')}</span><span class="btn sec">{ic('download','s')}Download PDF</span></div>
<div class="small mute" style="margin-top:14px">One primary per card. Secondary actions become square icon buttons with an instant dark tooltip. Heights 48 / 40 / 32. 600 weight, 14 px, icon 16 px. Status chips can carry a dropdown arrow.</div></div></div>
<div class="c6"><div class="card"><div class="h2" style="margin-bottom:16px">Chips, tabs, progress</div>
<div style="display:flex;gap:8px;flex-wrap:wrap"><span class="chip paid"><i></i>Paid</span><span class="chip"><i></i>Not paid</span><span class="chip late"><i></i>Late</span><span class="chip wait"><i></i>Needs you</span><span class="chip blue"><i></i>In review</span><span class="chip lime">▲ 18%</span><span class="chip dark">Today</span></div>
<div class="seg" style="margin-top:16px"><span class="on">All <em>7</em></span><span>Late <em>3</em></span><span>Deliverables <em>3</em></span></div>
<div style="display:grid;gap:12px;margin-top:18px"><div class="pbar"><i style="width:68%"></i></div><div class="pbar blue"><i style="width:40%"></i></div><div style="display:flex;gap:14px;align-items:center"><div class="ticks"><i class="f"></i><i class="f"></i><i></i><i></i></div><span class="small mute">2 of 4 approved</span></div></div></div></div>
<div class="c6"><div class="card"><div class="h2" style="margin-bottom:16px">Inputs</div><div style="display:grid;gap:12px"><div class="input">Brand identity</div><div class="input focus">dev@flux.example</div><div><div class="input err">dev@</div><div class="hint-err">That doesn't look like an email. Try name@company.com.</div></div><div style="display:grid;grid-template-columns:150px 1fr;gap:8px"><div class="input">🇮🇳 +91 {ic('down','s')}</div><div class="input">98450 12345</div></div></div><div class="small mute" style="margin-top:12px">44 px high, 14 px radius, blue focus ring (4 px, 14%), red border plus message on error.</div></div></div>
<div class="c6"><div class="card"><div class="h2" style="margin-bottom:16px">Shape, depth, grid</div>
<div style="display:flex;gap:14px;align-items:flex-end"><div style="width:110px;height:80px;border-radius:24px;background:var(--surface);box-shadow:var(--shadow);display:grid;place-items:center" class="small">Card 20</div><div style="width:90px;height:60px;border-radius:16px;background:var(--well);display:grid;place-items:center" class="small">Inner 16</div><div style="height:40px;padding:0 20px;border-radius:99px;background:var(--ink);color:#fff;display:grid;place-items:center" class="small">Pill 999</div><div style="width:48px;height:48px;border-radius:50%;background:var(--lav);display:grid;place-items:center" class="small">Avatar</div></div>
<div style="margin-top:18px;display:grid;grid-template-columns:repeat(12,1fr);gap:6px">{''.join('<i style="height:34px;border-radius:8px;background:var(--lav)"></i>' for _ in range(12))}</div>
<div class="small mute" style="margin-top:12px">12-column grid, 20 px gutter, 16 px page margin, 24 px card padding. Spacing scale 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48. Rail 76 px, floating, 28 px radius. Shadow is a hairline plus a soft drop, never a hard border. Cards lift 2 px on hover.</div></div></div>
<div class="c12"><div class="card well"><div class="h2" style="margin-bottom:10px">Motion and behaviour</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px" class="small"><div><b>180 ms ease-out</b><br><span class="mute">hover lifts, chip and button state changes</span></div><div><b>240 ms expand / collapse</b><br><span class="mute">timeline cards open smoothly, chevron rotates; the current one is open by default</span></div><div><b>Count-up on load</b><br><span class="mute">money numerals count up once, then stay still. Respects reduced motion.</span></div><div><b>Tooltips on icon buttons</b><br><span class="mute">instant dark strip; every icon-only button has one</span></div></div></div></div>
</div>'''
write('00-design-system',page('Design system','Today',sheet,'<div class="over">PayGuard</div><div class="h1">Design system · Soft Cards</div>','<span class="chip">v1 · for approval</span>'))

# ---------- render
CH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
H={'00-design-system':2050,'01-today':1180,'02-client-page':1160,'03-calendar':940,'04-payments':1300,'05-clients':1050}
for n,h in H.items():
    subprocess.run([CH,'--headless=new','--disable-gpu','--hide-scrollbars','--no-first-run','--force-device-scale-factor=1',f'--user-data-dir=/tmp/pa/_u_{n}',f'--window-size=1472,{h}','--virtual-time-budget=9000',f'--screenshot={D}/{n}.png',f'file://{D}/{n}.html'],capture_output=True,timeout=180)
    print(n,os.path.getsize(f'{D}/{n}.png'))
