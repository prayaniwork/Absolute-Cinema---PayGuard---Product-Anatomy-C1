import random, subprocess, os
D='/Users/prayanipohekar/PayGuard/design/visual-direction-4'
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

# ---------- shared line chart
def smooth(pts):
    d=f"M{pts[0][0]:.1f},{pts[0][1]:.1f}"
    for i in range(len(pts)-1):
        p0=pts[i-1] if i>0 else pts[i]; p1=pts[i]; p2=pts[i+1]; p3=pts[i+2] if i+2<len(pts) else p2
        c1=(p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6); c2=(p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6)
        d+=f" C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}"
    return d
def linechart(cur,prev,labels,W=760,H=260,top=80,yl=None,hi=None,tip=None,uid='a'):
    L,R,T,B=44,10,16,30; iw=W-L-R; ih=H-T-B; n=len(cur)
    X=lambda i:L+iw*i/(n-1); Y=lambda v:T+ih*(1-v/top)
    pc=[(X(i),Y(v)) for i,v in enumerate(cur)]; pp=[(X(i),Y(v)) for i,v in enumerate(prev)]
    yl=yl or [f"₹{int(top*k/4)}k" if top*k else "₹0k" for k in range(4,-1,-1)]
    grid=''.join(f'<line x1="{L}" x2="{W-R}" y1="{T+ih*k/4:.1f}" y2="{T+ih*k/4:.1f}" stroke="#EEF0F3"/><text x="{L-8}" y="{T+ih*k/4+4:.1f}" text-anchor="end">{yl[k]}</text>' for k in range(5))
    xl=''.join(f'<text x="{X(i):.1f}" y="{H-8}" text-anchor="middle">{lab}</text>' for i,lab in enumerate(labels) if lab)
    area=smooth(pc)+f" L{pc[-1][0]:.1f},{T+ih} L{pc[0][0]:.1f},{T+ih} Z"
    mk=''
    if hi is not None:
        x,y=pc[hi]; tw=116
        mk=f'<line x1="{x:.1f}" x2="{x:.1f}" y1="{y:.1f}" y2="{T+ih}" stroke="#2F5BEA" stroke-dasharray="3 3"/><circle cx="{x:.1f}" cy="{y:.1f}" r="5" fill="#fff" stroke="#2F5BEA" stroke-width="2.5"/><g transform="translate({x-tw/2:.1f},{y-62:.1f})"><rect width="{tw}" height="46" rx="8" fill="#fff" stroke="#E4E7EC"/><text x="{tw/2}" y="19" text-anchor="middle" style="fill:#667085">{tip[0]}</text><text x="{tw/2}" y="37" text-anchor="middle" style="fill:#101828;font:600 15px Inter,sans-serif">{tip[1]}</text></g>'
    return f'<svg class="lc" viewBox="0 0 {W} {H}"><defs><linearGradient id="g{uid}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2F5BEA" stop-opacity=".22"/><stop offset="1" stop-color="#2F5BEA" stop-opacity="0"/></linearGradient></defs>{grid}<path d="{area}" fill="url(#g{uid})"/><path d="{smooth(pp)}" fill="none" stroke="#98A2B3" stroke-width="1.6" stroke-dasharray="4 4"/><path d="{smooth(pc)}" fill="none" stroke="#2F5BEA" stroke-width="2.4"/>{mk}{xl}</svg>'
CUR=[22,26,34,31,40,34,10,28,52,48,40,56,62,50,72,60,54,44,70]; CUR=[22,28,36,33,27,14,30,46,52,44,36,62,75,58,66,56,72,52,58][:12]+[]
CUR=[24,30,28,22,9,24,41,46,38,34,52,70]; PRV=[20,25,29,26,24,26,31,34,33,36,40,44]
LBL=['3 Aug','','17','','31','','14 Sep','','28','','12 Oct','']
# ---------- TODAY
today_top='<div class="over">Sunday · 25 October</div><div class="h-display" style="margin-top:8px">Hey Meera, it\'s Sunday.<br>Look at you, working.</div>'
today_right=f'<span class="btn ic sec">{ic("bell")}</span><span class="btn">{ic("plus","s")}New project</span>'
cc=''.join(f'<div class="card hover" style="padding:14px;border-radius:10px;box-shadow:none"><div style="display:flex;justify-content:space-between;align-items:center">{av(n,"s")}<span class="small mute">{p}%</span></div><div style="margin:12px 0 2px;font:600 14px/20px var(--f-ui)">{n}</div><div class="small mute">{sub}</div><div class="pbar" style="margin-top:10px"><i style="width:{p}%"></i></div></div>' for n,sub,p in [('Bloom Studio','1 of 4',25),('Acme Logistics','2 of 4',50),('Tidal Health','1 of 3',33)])
today_body=f'''<div class="bento">
<div class="card c8"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px"><div><div class="over">Received · October</div><div style="display:flex;align-items:center;gap:12px;margin-top:8px"><span class="num-xl">₹2,43,000</span><span class="chip paid">▲ 18% vs Sept</span></div></div><div style="display:grid;gap:10px;justify-items:end"><div class="seg"><span class="on">Weeks</span><span>Months</span><span>Quarter</span></div><div class="legend2"><span><i style="background:#2F5BEA"></i>This period</span><span><i style="background:#98A2B3"></i>Previous</span></div></div></div><div style="margin-top:14px">{linechart(CUR,PRV,LBL,hi=10,tip=("Week of 12 Oct","₹72,000"),uid="t")}</div></div>
<div class="goal c4"><div style="display:flex;justify-content:space-between;align-items:center"><span class="tag">Goal · October</span><span style="font:600 14px var(--f-ui);opacity:.85">₹2,50,000</span></div><div class="big">97%</div><div class="lead">of your monthly goal is already in your account.</div><div class="box"><p>₹7,000 to go. The two late payments (₹62,000) would take you past it.</p><span class="btn sm">Remind late clients</span></div></div>
<div class="card c8"><div class="chd"><div><div class="h2">To do <span class="mute" style="font-weight:500">7</span></div><div class="small mute">Most urgent first</div></div><div class="seg"><span class="on">All <em>7</em></span><span>Late <em>3</em></span><span>Deliverables <em>3</em></span></div></div>{todo_rows(7)}</div>
<div class="c4 stack"><div class="card tight"><div class="chd" style="margin-bottom:12px"><div class="h3">Active clients <span class="mute" style="font-weight:500">8</span></div><span class="small mute">All clients →</span></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">{cc}</div></div>
<div class="card"><div class="chd"><div><div class="h3">Your activity</div><div class="small mute">Things you finished each day, last 18 weeks</div></div><span class="chip">47 done</span></div>{heat()}<div style="display:flex;justify-content:space-between;margin-top:14px" class="small mute"><span>Best day: 6 on 14 Oct</span><span>Streak: 5 days</span></div></div></div>
</div>'''
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

# ---------- CALENDAR (monochrome)
G={'Pay':'₹','Due':'■','Reply':'↩'}
EV={18:[('Pay','Northwind Cafe',1)],20:[('Reply','Bloom Studio',0)],21:[('Due','Kite Fitness',1)],23:[('Reply','Tidal Health',0)],24:[('Due','Acme Logistics',1)],27:[('Due','Tidal Health',0)],28:[('Pay','Northwind Cafe',0)]}
def mev(k,c,late):
    return f'<div class="mev {"late" if late else ""}"><span class="g">{G[k]}</span><b>{c}</b></div>'
cells=''.join(f'<div class="h">{d}</div>' for d in ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'])
for lab in [('28','o'),('29','o'),('30','o')]+[(str(i),'') for i in range(1,32)]+[('1','o')]:
    n,cl=lab
    day=int(n); evs=EV.get(day,[]) if not cl else []
    if n=='25' and not cl: cl='t'
    shown=''.join(mev(*e) for e in evs[:2])
    cells+=f'<div class="d {cl}"><span class="n">{n}</span>{shown}</div>'
cal_month=f'''<div class="card" style="padding:0;overflow:hidden"><div style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px"><div style="display:flex;align-items:center;gap:10px"><span class="btn ic sm sec" style="transform:scaleX(-1)">{ic('chev','s')}</span><span class="btn ic sm sec">{ic('chev','s')}</span><div class="h2" style="margin-left:6px">October 2026</div></div><div style="display:flex;gap:10px;align-items:center"><span class="btn sec sm">Today</span><div class="input" style="width:150px;height:32px">All clients<span style="margin-left:auto">{ic('down','s')}</span></div><div class="seg"><span class="on">Month</span><span>Quarter</span></div></div></div><div class="mcal">{cells}</div><div style="display:flex;gap:22px;padding:14px 20px" class="small mute"><span><b style="color:var(--ink)">₹</b> Payment</span><span><b style="color:var(--ink)">■</b> Delivery</span><span><b style="color:var(--ink)">↩</b> Reply window</span><span><span style="display:inline-block;width:22px;height:12px;border:1px solid var(--ink);border-radius:4px;vertical-align:middle"></span> Outlined means late</span></div></div>'''
write('03-calendar-month',page('Calendar','Calendar',cal_month,'<div class="over">Calendar</div><div class="h1">Due dates and windows</div><div class="sub">Everything with a date. Late items are outlined.</div>'))
import calendar as _c
def qmonth(name,y,m,ev):
    wd,nd=_c.monthrange(y,m); cs=''.join(f'<b>{d}</b>' for d in 'MTWTFSS')+'<span class="o">0</span>'*wd
    for d in range(1,nd+1):
        k=ev.get(d,0); cl='e1' if k==1 else 'e2' if k==2 else 'e3' if k>=3 else ''
        if m==10 and d==25: cl='t'
        cs+=f'<span class="{cl}">{d}</span>'
    tot=sum(ev.values())
    return f'<div class="card qm"><div style="display:flex;justify-content:space-between;align-items:baseline"><div class="h3">{name}</div><span class="small mute">{tot} dates</span></div><div class="cal7">{cs}</div></div>'
qs=qmonth('October 2026',2026,10,{18:1,20:1,21:1,23:1,24:1,27:1,28:1})+qmonth('November 2026',2026,11,{9:1,13:1,15:2,16:1,18:1,21:1,25:1})+qmonth('December 2026',2026,12,{4:1,9:1,11:2,15:3,18:1,22:1})
quarter=f'''<div class="card" style="padding:16px 20px;display:flex;justify-content:space-between;align-items:center"><div style="display:flex;align-items:center;gap:10px"><span class="btn ic sm sec" style="transform:scaleX(-1)">{ic('chev','s')}</span><span class="btn ic sm sec">{ic('chev','s')}</span><div class="h2" style="margin-left:6px">Q4 2026 · Oct to Dec</div></div><div style="display:flex;gap:10px;align-items:center"><span class="btn sec sm">This quarter</span><div class="input" style="width:150px;height:32px">All clients<span style="margin-left:auto">{ic('down','s')}</span></div><div class="seg"><span>Month</span><span class="on">Quarter</span></div></div></div><div class="qgrid">{qs}</div><div class="card"><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px"><div><div class="over">Dates this quarter</div><div class="num-l" style="margin-top:6px">24</div></div><div><div class="over">Payments due</div><div class="num-l" style="margin-top:6px">9</div></div><div><div class="over">Deliveries due</div><div class="num-l" style="margin-top:6px">11</div></div><div><div class="over">Busiest day</div><div class="num-l" style="margin-top:6px">15 Dec</div></div></div><div class="small mute" style="margin-top:14px">Darker squares mean more dates on that day. Click a month to open it.</div></div>'''
write('03-calendar-quarter',page('Calendar','Calendar',quarter,'<div class="over">Calendar</div><div class="h1">The quarter at a glance</div><div class="sub">Where your busy days are</div>'))

# ---------- PAYMENTS
rows=[('Northwind Cafe','Concepts','₹35,000','late','Late · 4 days'),('Saffron Hotels','Logo options','₹27,000','late','Late · 5 days'),('Bloom Studio','Homepage design','₹60,000','pend','Not paid'),('Bloom Studio','Discovery','₹30,000','paid','Paid · 16 Oct'),('Acme Logistics','Wireframes','₹35,000','paid','Paid · 14 Oct'),('Tidal Health','Research','₹40,000','paid','Paid · 9 Oct'),('Acme Logistics','UI kit','₹70,000','pend','Not paid')]
chipcls={'late':'late','pend':'','paid':'paid'}
trs=''.join(f'<tr><td><div class="who">{av(c)}{c}</div></td><td>{d}</td><td><b>{a}</b></td><td><span class="chip {chipcls[s]}"><i></i>{lab}</span></td><td style="text-align:right"><span class="btn ic sm sec">{ic("more","s")}</span></td></tr>' for c,d,a,s,lab in rows)
pay_body=f'''<div class="bento"><div class="c4 stack"><div class="card dark" style="padding:28px"><div class="over" style="color:var(--on-dark-mute)">Earned to date</div><div class="num-xl" style="margin:10px 0 4px">₹2,43,000</div><div class="small" style="color:var(--on-dark-mute)">Received in your account</div><div style="display:flex;gap:10px;margin-top:22px"><span class="btn onDark sm">Export</span><span class="chip lime">▲ 18% vs Sept</span></div></div>
<div class="card well"><div style="display:flex;justify-content:space-between;align-items:center"><div><div class="over">Not received yet</div><div class="num-l" style="margin-top:6px">₹7,57,000</div></div><span class="chip wait"><i></i>Live</span></div><div style="display:flex;height:12px;gap:3px;margin:18px 0 10px"><i style="width:8%;background:var(--late);border-radius:6px"></i><i style="flex:1;background:#CFC9BD;border-radius:6px"></i></div><div class="small mute" style="display:flex;justify-content:space-between"><span><b style="color:var(--late)">₹62,000</b> late</span><span>₹6,95,000 not due yet</span></div></div></div>
<div class="c8 stack"><div class="bento" style="gap:20px"><div class="card c6"><div class="chd"><div><div class="h3">Income</div><div class="num-m" style="margin-top:6px">₹2,43,000</div></div><div class="seg"><span class="on">Weeks</span><span>Months</span></div></div>{linechart(CUR,PRV,LBL,W=372,H=226,hi=10,tip=("Week of 12 Oct","₹72,000"),uid="p")}</div>
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

# ---------- shared bits for forms and client side
def steps(n,labels):
    out=[]
    for i,l in enumerate(labels,1):
        cls='on' if i==n else 'done' if i<n else ''
        mark=ic("check","s") if i<n else str(i)
        out.append(f'<div class="s {cls}"><b>{mark}</b>{l}</div>')
    return '<div class="steps">'+'<div class="ln"></div>'.join(out)+'</div>'
def fld(l,v,cls='',hint=''): return f'<div class="fld"><label>{l}</label><div class="input {cls}">{v}</div>{hint}</div>'
CHEV=f'<span style="margin-left:auto">{ic("down","s")}</span>'
SUMMARY='<div class="card" style="position:sticky;top:16px"><div class="h3" style="margin-bottom:10px">Summary</div><div class="sumrow"><span>Logo and palette</span><b>₹40,000</b></div><div class="sumrow"><span>Brand guidelines</span><b>₹20,000</b></div><div class="sumrow t"><span>Project total</span><b>₹60,000</b></div><div style="height:1px;background:var(--line-2);margin:10px 0"></div><div class="sumrow"><span class="mute">Advance (50%)</span><b>₹30,000</b></div><div class="sumrow"><span class="mute">After each approval</span><b>₹30,000</b></div><div class="sumrow t"><span>You receive</span><b>₹60,000</b></div><p class="small mute" style="margin-top:6px">Paid straight to you. No PayGuard fee in the beta.</p><div style="height:1px;background:var(--line-2);margin:14px 0"></div><div class="sumrow"><span class="mute">Client replies within</span><span>3 days</span></div><div class="sumrow"><span class="mute">Rounds of changes</span><span>2</span></div><div class="sumrow"><span class="mute">Files unlock</span><span>Whole project</span></div></div>'
NP_TOP='<div class="over">Clients › New project</div><div class="h1">New project</div>'
NP_STEPS=['Project and client','Deliverables','Terms']
def npnav(back,nxt): return f'<div style="display:flex;justify-content:space-between;margin-top:4px"><span class="btn sec">{back}</span><span class="btn">{nxt} {ic("chev","s")}</span></div>'
def drow(n,name,amt,date,inc):
    return f'<div style="border:1px solid var(--line);border-radius:10px;padding:16px;display:grid;gap:14px"><div style="display:flex;align-items:center;gap:12px"><span class="av s" style="background:var(--well);border:1px solid var(--line)">{n}</span><div class="h3" style="flex:1">{name}</div><span class="btn ic sm sec">{ic("up","s")}</span></div><div class="three">{fld("Deliverable",name)}{fld("Amount (₹)",amt)}{fld("Delivery date",date)}</div><div class="fld"><label>What\'s included <span class="mute" style="font-weight:400">(one per line)</span></label><div class="input ta" style="white-space:pre-line">{inc}</div></div></div>'
DR1=drow(1,'Logo and palette','40000','31/10/2026','3 logo concepts\nOne concept refined')
DR2=drow(2,'Brand guidelines','20000','14/11/2026','Colour and type rules\nLogo usage')
np2=f'''<div class="bento"><div class="c8 stack">{steps(2,NP_STEPS)}<div class="card"><div class="h2">Deliverables</div><p class="sub" style="margin-top:2px">What you will hand over and when. Your client agrees to this before work starts.</p>
<div class="card" style="background:var(--well);box-shadow:none;margin-top:16px;padding:18px"><div class="h3">Start from a brief</div><div class="small mute" style="margin-top:2px">We split it into deliverables with prices and dates. You can edit everything.</div><div style="display:flex;gap:10px;align-items:center;margin-top:12px"><span class="btn sec sm">{ic("upload","s")}Upload a brief</span><span class="btn sec sm">Try a sample brief</span><span class="small mute">or just write below</span></div></div>
<div style="display:grid;gap:14px;margin-top:16px">{DR1}{DR2}</div>
<div style="display:flex;gap:10px;margin-top:16px"><span class="btn sec">{ic("plus","s")}Add a deliverable</span><span class="btn ghost">{ic("wallet","s")}Suggest prices</span></div><p class="small mute" style="margin-top:10px;font-style:italic">Suggested prices are estimates from typical freelance rates, not a quote.</p></div>{npnav("Back","Next: Terms")}</div><div class="c4">{SUMMARY}</div></div>'''
write('06-new-project-deliverables',page('New project','Clients',np2,NP_TOP,'<span class="btn ghost">Cancel</span>'))
def plan(pct,t,sub,on=False):
    return f'<div class="plan {"on" if on else ""}"><div class="pie" style="background:conic-gradient(var(--blue) 0 {pct}%,#E4E7EC {pct}% 100%)"></div><b>{t}</b><span class="small mute">{sub}</span></div>'
np3=f'''<div class="bento"><div class="c8 stack">{steps(3,NP_STEPS)}<div class="card"><div class="h2">Terms</div><p class="sub" style="margin-top:2px">Your client reads these in the contract before signing.</p>
<div class="two" style="margin-top:16px">{fld("Client replies within","3 days"+CHEV)}{fld("If they don't reply","Approve after 3 days"+CHEV)}</div>
<div class="two" style="margin-top:16px">{fld("Rounds of changes per deliverable","2 rounds"+CHEV)}{fld("Price of an extra round (₹)","6000")}</div>
<div style="height:1px;background:var(--line-2);margin:24px 0"></div><div class="h3">How you get paid</div><p class="sub" style="margin-top:2px">Clients pay you directly by UPI, QR or card. PayGuard never holds the money.</p>
<div class="three" style="margin-top:14px">{plan(0,"One payment","Paid in full after you deliver.")}{plan(50,"Half and half","Half before work starts, half as you deliver.",True)}{plan(30,"Three payments","A smaller advance, then two payments as you deliver.")}</div>
<div class="two" style="margin-top:16px">{fld("Client pays within","7 days of approving"+CHEV)}<div class="fld"><label>Original files unlock</label><div class="seg" style="width:fit-content"><span>Deliverable by deliverable</span><span class="on">Whole project</span></div></div></div>
<div style="margin-top:16px">{fld("Your UPI ID","meera@okaxis","",'<span class="small mute">Clients pay here by UPI or QR code. Card payments go to the bank account in Settings.</span>')}</div></div>{npnav("Back","Review the contract")}</div><div class="c4">{SUMMARY}</div></div>'''
write('07-new-project-terms',page('New project','Clients',np3,NP_TOP,'<span class="btn ghost">Cancel</span>'))
def contract_doc(sign_html):
    return f'''<div class="card doc"><div class="over">Service agreement</div><h2 style="margin-top:8px">Brand refresh</h2><p class="mute">Dated 25 October 2026</p>
<div class="two" style="margin-top:20px"><div class="card well" style="padding:16px;box-shadow:none"><div class="over">Freelancer</div><div class="h3" style="margin-top:4px">Meera Iyer Studio</div><p>Meera Iyer</p></div><div class="card well" style="padding:16px;box-shadow:none"><div class="over">Client</div><div class="h3" style="margin-top:4px">Flux Labs</div><p>Arjun Rao · arjun@flux.example</p></div></div>
<h4>1. The work</h4><p>Meera will deliver the deliverables below, with what each includes and by the dates shown.</p><table class="tbl" style="margin-top:8px"><thead><tr><th>Deliverable and what it includes</th><th>Delivery</th><th style="text-align:right">Price</th></tr></thead><tbody><tr><td><b>Logo and palette</b><br><span class="mute small">3 logo concepts · One concept refined</span></td><td>Sat 31 Oct</td><td style="text-align:right"><b>₹40,000</b></td></tr><tr><td><b>Brand guidelines</b><br><span class="mute small">Colour and type rules · Logo usage</span></td><td>Sat 14 Nov</td><td style="text-align:right"><b>₹20,000</b></td></tr><tr><td><b>Total</b></td><td></td><td style="text-align:right"><b>₹60,000</b></td></tr></tbody></table>
<h4>2. Payment</h4><ul><li>The client pays a 50% advance (₹30,000) before work starts. It is paid straight to Meera.</li><li>After the client has approved every deliverable, the client pays the balance once within 7 days of approval.</li><li>Payments are made by UPI, QR code or card, directly to Meera (meera@okaxis).</li></ul>
<h4>3. Review and approval</h4><ul><li>The client reviews each preview within 3 days.</li><li>2 rounds of changes are included per deliverable. Each extra round costs ₹6,000.</li></ul>
<h4>4. Files and ownership</h4><ul><li>Until payment, the client sees watermarked previews only.</li><li>Rights in the delivered work pass to the client once it is paid in full.</li></ul>
<div class="two" style="margin-top:28px">{sign_html}</div></div>'''
def sigedit(title,who,typed=False):
    body='<div class="sig-type">'+who+'</div>' if typed else '<div class="sigcv">Draw your signature here</div>'
    d='' if typed else 'on'; t='on' if typed else ''
    return f'<div class="sigbox"><div style="display:flex;justify-content:space-between;align-items:center"><span class="over">{title}</span><div class="seg"><span class="{d}">{ic("pen","s")}Draw</span><span class="{t}">Aa Type</span></div></div>{body}<div class="small mute">{who} · signing today</div></div>'
signed='<div class="sigbox" style="background:var(--well)"><span class="over">Freelancer</span><div class="sig-type" style="color:var(--ink-2)">Meera Iyer</div><div class="small mute">Meera Iyer · signed 25 Oct 2026</div></div>'
unsigned='<div class="sigbox" style="background:var(--well)"><span class="over">Client</span><div class="mute" style="padding:26px 0">Not signed yet</div><div class="small mute">Arjun Rao · awaiting signature</div></div>'
contract_f=f'''<div class="cwrap" style="max-width:860px;padding:8px 0 0">{contract_doc(sigedit("Freelancer · sign here","Meera Iyer")+unsigned)}
<div class="card tight" style="display:flex;justify-content:space-between;align-items:center"><div class="chk"><i></i>I have read the contract and I sign it electronically.</div><span style="display:flex;gap:10px"><span class="btn ghost">Back to edit</span><span class="btn" style="opacity:.55">Sign and send to Arjun</span></span></div></div>'''
write('08-contract-freelancer',page('Contract','Clients',contract_f,'<div class="over">New project › Contract</div><div class="h1">Review and sign the contract</div><div class="sub">Sign it and we send it to Arjun with the link. Work starts once you have both signed.</div>','<span class="btn ghost">Back to edit</span>'))
def cpage(title,body,w=1440):
    return f'<!doctype html><html><head><meta charset="utf-8"><title>{title}</title><link rel="stylesheet" href="ds.css"></head><body><div class="cshell" style="width:{w}px"><div class="ctop"><div style="display:flex;align-items:center;gap:12px"><span class="av s" style="background:var(--blue);color:#fff;border-radius:8px">MI</span><b>Meera Iyer Studio</b><span class="mute">›</span><span>Brand refresh</span></div><div style="display:flex;align-items:center;gap:10px" class="small mute">Arjun Rao <span class="av s sky">AR</span></div></div>{body}</div></body></html>'
deliv=''.join(f'<div class="row" style="grid-template-columns:32px minmax(0,1fr) auto auto"><span class="av s" style="background:var(--well);border:1px solid var(--line)">{i}</span><div><div class="t">{n}</div><div class="s">{inc}</div></div><span class="small mute">Due {d}</span><b>{a}</b></div>' for i,(n,inc,d,a) in enumerate([('Logo and palette','3 logo concepts · One concept refined','31 Oct','₹40,000'),('Brand guidelines','Colour and type rules · Logo usage','14 Nov','₹20,000')],1))
cw1=f'''<div class="cwrap">{steps(1,["The work","The contract"])}<div><div class="over">From Meera Iyer Studio</div><div class="h1" style="margin-top:4px">Brand refresh</div><p class="sub" style="margin-top:4px">Hi Arjun, here's the work Meera will do for you.</p></div>
<div class="card"><div class="chd" style="margin-bottom:6px"><div class="h3">2 deliverables</div></div>{deliv}</div>
<div class="card" style="display:flex;gap:28px;align-items:center"><div class="pie" style="width:64px;height:64px;background:conic-gradient(var(--blue) 0 50%,#E4E7EC 50% 100%)"></div><div style="display:grid;gap:6px"><div class="over">The money</div><div><b>₹30,000</b> <span class="mute">to start (50%)</span></div><div><b>₹30,000</b> <span class="mute">once every deliverable is approved</span></div></div><div style="margin-left:auto;text-align:right"><div class="over">Total</div><div class="num-l">₹60,000</div></div></div>
<div><span class="btn lg">Continue to the contract {ic("chev","s")}</span><p class="small mute" style="margin-top:10px">No account needed. <u>How does this work?</u></p></div></div>'''
write('09-client-work',cpage('The work',cw1))
cw2=f'''<div class="cwrap" style="max-width:860px">{steps(2,["The work","The contract"])}<div><div class="h1">The contract</div><p class="sub" style="margin-top:4px">Read it through, then sign. Meera has already signed.</p></div>{contract_doc(signed+sigedit("Client · sign here","Arjun Rao",True))}<div class="card tight" style="display:flex;justify-content:space-between;align-items:center"><div class="chk"><i style="background:var(--blue);border-color:var(--blue)"></i>I have read the contract and I sign it electronically.</div><span style="display:flex;gap:10px"><span class="btn ghost">Back</span><span class="btn lg">Sign and pay ₹30,000 to start</span></span></div></div>'''
write('10-client-contract',cpage('Contract',cw2))
VISA='<svg viewBox="0 0 36 24" style="width:34px;height:22px"><rect width="36" height="24" rx="4" fill="#fff" stroke="#e4e4e7"/><text x="18" y="16.5" text-anchor="middle" font-family="Arial" font-weight="800" font-style="italic" font-size="11" fill="#1A1F71">VISA</text></svg>'
accepts=''.join(f'<span class="chip" style="opacity:{o}">{n}</span>' for n,o in [("Visa",1),("Mastercard",.4),("RuPay",.4),("Amex",.4)])
co=f'''<div class="cwrap" style="max-width:980px"><div class="bento"><div class="c6 stack"><div><div class="over">Pay your advance</div><div class="h1" style="margin-top:4px">Brand refresh</div><div class="num-xl" style="margin-top:8px">₹30,000</div></div><div class="card tight"><div class="sumrow"><span class="mute">50% advance on ₹60,000</span><b>₹30,000</b></div><div class="sumrow t"><span>You pay Meera</span><b>₹30,000</b></div></div><div class="card tight"><div class="over">The plan</div><div style="display:grid;gap:8px;margin-top:10px"><div>Logo and palette · ₹40,000</div><div>Brand guidelines · ₹20,000</div></div><div class="chk" style="margin-top:14px"><i style="background:var(--blue);border-color:var(--blue)"></i>I agree to the plan and what each deliverable includes.</div></div></div>
<div class="c6"><div class="card" style="display:grid;gap:16px"><div class="chip wait" style="width:fit-content">Test mode · no real money moves</div>{fld("Receipt email","arjun@flux.example")}<div class="fld"><label>How would you like to pay?</label><div class="seg" style="width:100%;display:grid;grid-template-columns:repeat(3,1fr)"><span style="justify-content:center">UPI</span><span style="justify-content:center">QR code</span><span class="on" style="justify-content:center">Card</span></div></div>
<div class="fld"><label>Card number <span class="mute" style="font-weight:400">(credit or debit)</span></label><div class="input err" style="gap:10px">{VISA}4242 4242 4242 424</div><div class="hint-err">That card number doesn't look right. Check the digits.</div><div style="display:flex;gap:6px;margin-top:4px">{accepts}</div></div>
<div class="two">{fld("Expiry","09 / 29")}{fld("CVC","123")}</div><span class="btn lg" style="width:100%">Pay ₹30,000</span><p class="small mute" style="text-align:center">Card details go straight to the payment provider. Nobody else sees them.</p></div></div></div></div>'''
write('11-client-checkout',cpage('Checkout',co))

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
H={'06-new-project-deliverables':1150,'07-new-project-terms':1250,'08-contract-freelancer':1500,'09-client-work':800,'10-client-contract':1600,'11-client-checkout':880,'00-design-system':2050,'01-today':1180,'02-client-page':1160,'03-calendar-month':1000,'03-calendar-quarter':980,'04-payments':1300,'05-clients':1050}
for n,h in H.items():
    subprocess.run([CH,'--headless=new','--disable-gpu','--hide-scrollbars','--no-first-run','--force-device-scale-factor=1',f'--user-data-dir=/tmp/pa/_u_{n}',f'--window-size=1472,{h}','--virtual-time-budget=9000',f'--screenshot={D}/{n}.png',f'file://{D}/{n}.html'],capture_output=True,timeout=180)
    print(n,os.path.getsize(f'{D}/{n}.png'))
