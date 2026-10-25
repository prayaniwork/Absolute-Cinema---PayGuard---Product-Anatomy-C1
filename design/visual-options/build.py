import subprocess, os
D='/Users/prayanipohekar/PayGuard/design/visual-options'
TODO=[('SH','Saffron Hotels','Remind Meher: advance 5 days late','Logo options','Remind',1),('NC','Northwind Cafe','Remind Sana: payment 4 days late','Concepts','Remind',1),('KF','Kite Fitness','Upload previews: 1 day late','Landing page','Upload',1),('SN','Studio Nine','Reply to Isha: problem reported','Style frames','Reply',0),('BS','Bloom Studio','Remind Priya: approval 1 day late','Homepage design','Remind',0),('TH','Tidal Health','Make changes: round 1 of 2','Flows','Open',0),('AL','Acme Logistics','Upload previews: due in 2 days','UI kit','Upload',0)]
# ================= A: PAPER (calm, editorial, top menu, list-first)
A='''<!doctype html><meta charset=utf-8><link rel=stylesheet href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap">
<style>
*{box-sizing:border-box}body{margin:0;background:#FBFAF7;color:#1B1A17;font:400 15px/22px Inter,sans-serif;-webkit-font-smoothing:antialiased}
.nav{display:flex;align-items:center;gap:36px;padding:22px 64px;border-bottom:1px solid #E9E5DC}
.nav b{font:600 20px Fraunces,serif;letter-spacing:-.01em}.nav a{color:#7B766B;font-weight:500}.nav a.on{color:#1B1A17;box-shadow:0 2px 0 #1B1A17;padding-bottom:6px}
.nav .sp{flex:1}.nav .who{display:flex;gap:14px;align-items:center;color:#7B766B}.cta{background:#1B1A17;color:#fff;border-radius:6px;padding:9px 16px;font-weight:500}
.wrap{max-width:880px;margin:0 auto;padding:64px 24px 80px}
.over{font:500 12px/16px Inter;letter-spacing:.12em;text-transform:uppercase;color:#9A9488}
h1{font:500 54px/58px Fraunces,serif;letter-spacing:-.025em;margin:14px 0 18px}
h1 i{color:#C2410C;font-style:italic}
.lede{font:400 22px/32px Fraunces,serif;color:#4A4740;margin:0 0 48px}.lede b{font-weight:600;color:#1B1A17;background:linear-gradient(transparent 62%,#F4E3B0 62%)}.lede .late{background:linear-gradient(transparent 62%,#F8D4CB 62%)}
.rule{height:1px;background:#E9E5DC;margin:0}
.sec{display:flex;justify-content:space-between;align-items:baseline;margin:56px 0 8px}.sec h2{font:500 28px Fraunces,serif;margin:0}.sec span{color:#7B766B;font-size:14px}
.todo{display:grid;grid-template-columns:36px 1fr auto;gap:18px;align-items:center;padding:20px 0;border-bottom:1px solid #E9E5DC}
.n{font:400 22px Fraunces,serif;color:#B8B2A4}.t{font-weight:500;font-size:17px}.s{color:#7B766B;font-size:14px;margin-top:2px}
.a{border:1px solid #D9D4C7;border-radius:6px;padding:7px 14px;font-weight:500}.a.p{background:#1B1A17;color:#fff;border-color:#1B1A17}
.late{color:#B4361F}
.money{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:20px}.money div{padding:4px 28px 4px 0}.money div+div{padding-left:28px;border-left:1px solid #E9E5DC}
.money .v{font:500 44px/48px Fraunces,serif;letter-spacing:-.02em}.money .l{color:#7B766B;margin-top:6px}
.bar{display:flex;height:6px;margin-top:28px;gap:3px}.bar i{display:block;height:100%}
.week{display:grid;grid-template-columns:repeat(7,1fr);gap:0;margin-top:20px;border-top:1px solid #E9E5DC}.week div{padding:16px 12px 16px 0;border-bottom:1px solid #E9E5DC;min-height:110px}.week div+div{padding-left:14px;border-left:1px solid #E9E5DC}
.week b{font:500 22px Fraunces,serif;display:block}.week small{color:#9A9488}.week p{margin:10px 0 0;font-size:13px;line-height:18px}.week .tod{background:#F6F1E4}
</style>
<div class=nav><b>PayGuard</b><a class=on>Today</a><a>Clients</a><a>Calendar</a><a>Payments</a><span class=sp></span><div class=who>Meera Iyer Studio <span class=cta>New project</span></div></div>
<div class=wrap>
<div class=over>Sunday, 25 October</div>
<h1>Hey Meera, it's Sunday.<br><i>Look at you, working.</i></h1>
<p class=lede>You've received <b>₹2,43,000</b> this month, 97% of your goal. <span class=late><b class=late>₹62,000</b></span> from two clients is late, and <b>7 things</b> are waiting on you.</p>
<div class=rule></div>
<div class=sec><h2>To do</h2><span>Most urgent first</span></div>
'''
for i,(a,c,t,s,b,l) in enumerate(TODO,1):
    A+=f'<div class=todo><div class=n>{i:02d}</div><div><div class=t>{t}</div><div class=s>{c} · {s}</div></div><span class="a {"p" if l else ""}">{b}</span></div>'
A+='''
<div class=sec><h2>The money</h2><span>October · across 10 clients</span></div>
<div class=money><div><div class=v>₹2,43,000</div><div class=l>Received, in your account</div></div><div><div class=v>₹6,95,000</div><div class=l>Pending, not due yet</div></div><div><div class="v late">₹62,000</div><div class=l>Late, 2 clients</div></div></div>
<div class=bar><i style="width:24%;background:#1B1A17"></i><i style="width:70%;background:#D9D4C7"></i><i style="width:6%;background:#C2410C"></i></div>
<div class=sec><h2>This week</h2><span>19 – 25 October</span></div>
<div class=week><div><small>Mon</small><b>19</b></div><div><small>Tue</small><b>20</b><p>Reply due · Bloom Studio</p></div><div><small>Wed</small><b>21</b><p class=late>Payment was due · Northwind</p></div><div><small>Thu</small><b>22</b></div><div><small>Fri</small><b>23</b><p>Reply due · Tidal Health</p></div><div><small>Sat</small><b>24</b><p class=late>Delivery was due · Acme</p></div><div class=tod><small>Sun</small><b>25</b><p>Today</p></div></div>
</div>'''
open(D+'/A-paper.html','w').write(A)
# ================= B: NIGHT (dark, dense, mono numerals)
B='''<!doctype html><meta charset=utf-8><link rel=stylesheet href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap">
<style>
*{box-sizing:border-box}body{margin:0;background:#0C0D0F;color:#E7E8EA;font:400 13px/18px Inter,sans-serif;-webkit-font-smoothing:antialiased}
.app{display:grid;grid-template-columns:208px 1fr;min-height:100vh}
.side{border-right:1px solid #1F2125;padding:16px 12px;display:flex;flex-direction:column;gap:18px}
.logo{display:flex;gap:10px;align-items:center;font-weight:600;padding:2px 8px}.logo i{width:22px;height:22px;border-radius:6px;background:#D4FF3F;display:block}
.side a{display:flex;gap:10px;align-items:center;height:32px;padding:0 10px;border-radius:6px;color:#8A8E96;font-weight:500}.side a.on{background:#1A1C20;color:#fff}.side a kbd{margin-left:auto;font:500 11px 'JetBrains Mono';color:#5B5F67}
.side .grp{font:500 11px 'JetBrains Mono';color:#5B5F67;padding:8px 10px 2px;text-transform:uppercase;letter-spacing:.08em}
main{padding:20px 28px}.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
h1{font:600 20px/26px Inter;margin:0;letter-spacing:-.01em}.sub{color:#7C8088;margin-top:2px}
.btn{height:30px;padding:0 12px;border-radius:6px;border:1px solid #2A2D33;display:inline-flex;align-items:center;font-weight:500;color:#E7E8EA}.btn.p{background:#D4FF3F;color:#0C0D0F;border-color:#D4FF3F}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#1F2125;border:1px solid #1F2125;border-radius:8px;overflow:hidden}
.k{background:#111215;padding:16px 18px}.k .l{color:#7C8088;font:500 11px 'JetBrains Mono';text-transform:uppercase;letter-spacing:.08em}.k .v{font:500 30px/36px 'JetBrains Mono';margin-top:8px;letter-spacing:-.02em}.k .d{margin-top:6px;color:#7C8088}
.pos{color:#D4FF3F}.neg{color:#FF6B5E}.amb{color:#FFC24B}
.two{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,1fr);gap:16px;margin-top:16px}
.panel{border:1px solid #1F2125;border-radius:8px;background:#111215}.ph{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #1F2125}.ph b{font-weight:600}.ph span{color:#7C8088;font:500 11px 'JetBrains Mono'}
.tr{display:grid;grid-template-columns:22px 1fr 150px 70px;gap:12px;align-items:center;padding:11px 16px;border-bottom:1px solid #191B1F}.tr:last-child{border:0}.tr:hover{background:#15171B}
.dot{width:8px;height:8px;border-radius:50%}.tt{font-weight:500;color:#F2F3F4}.ss{color:#7C8088;margin-top:1px}
.tk{display:flex;gap:2px}.tk i{width:12px;height:4px;background:#2A2D33;border-radius:1px}.tk i.f{background:#D4FF3F}
.act{justify-self:end;height:24px;padding:0 10px;border-radius:5px;border:1px solid #2A2D33;display:inline-flex;align-items:center;font-weight:500;font-size:12px}.act.p{background:#E7E8EA;color:#0C0D0F;border-color:#E7E8EA}
.bars{display:flex;gap:6px;align-items:flex-end;height:120px;padding:16px}.bars b{flex:1;background:#2A2D33;border-radius:2px}.bars b.h{background:#D4FF3F}
.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;padding:12px 16px;text-align:center;font:500 11px 'JetBrains Mono'}.cal span{padding:6px 0;border-radius:4px;color:#8A8E96}.cal span.t{background:#D4FF3F;color:#0C0D0F}.cal span.l{color:#FF6B5E}.cal b{color:#5B5F67}
.row{display:flex;justify-content:space-between;padding:9px 16px;border-bottom:1px solid #191B1F}.row:last-child{border:0}.row span:last-child{font-family:'JetBrains Mono'}
</style><div class=app><aside class=side><div class=logo><i></i>PayGuard</div>
<div><div class=grp>Workspace</div><a class=on>Today <kbd>T</kbd></a><a>Clients <kbd>C</kbd></a><a>Calendar</a><a>Payments <kbd>P</kbd></a></div><div style="margin-top:auto"><a>Settings</a><div class=logo style="margin-top:6px"><i style="background:#2A2D33;border-radius:50%"></i>Meera Iyer</div></div></aside>
<main><div class=top><div><h1>Hey Meera, it's Sunday. Look at you, working.</h1><div class=sub>25 Oct 2026 · 7 things need you · 2 clients late</div></div><div style="display:flex;gap:8px"><span class=btn>Remind late clients</span><span class="btn p">New project</span></div></div>
<div class=grid><div class=k><div class=l>Received · Oct</div><div class="v pos">₹2,43,000</div><div class=d>+18% vs Sept · 97% of goal</div></div><div class=k><div class=l>Pending</div><div class=v>₹6,95,000</div><div class=d>Not due yet · 5 clients</div></div><div class=k><div class=l>Late</div><div class="v neg">₹62,000</div><div class=d>Northwind 4d · Saffron 5d</div></div></div>
<div class=two><div class=panel><div class=ph><b>To do</b><span>7 · BY URGENCY</span></div>'''
cols=['#FF6B5E','#FF6B5E','#FF6B5E','#FFC24B','#FFC24B','#5B5F67','#5B5F67']
for (a,c,t,s,b,l),col in zip(TODO,cols):
    d=int(l)+1
    B+=f'<div class=tr><span class=dot style="background:{col}"></span><div><div class=tt>{t}</div><div class=ss>{c} · {s}</div></div><div class=tk><i class=f></i><i class=f></i><i></i><i></i></div><span class="act {"p" if l else ""}">{b}</span></div>'
B+='''</div><div style="display:grid;gap:16px;align-content:start"><div class=panel><div class=ph><b>Earned per week</b><span>12W · 1M</span></div><div class=bars>'''
for i,v in enumerate([22,0,35,41,18,0,52,60,28,45,72,58]): B+=f'<b class="{"h" if i==10 else ""}" style="height:{max(3,v/80*100)}%"></b>'
B+='''</div></div><div class=panel><div class=ph><b>October</b><span>3 LATE</span></div><div class=cal><b>M</b><b>T</b><b>W</b><b>T</b><b>F</b><b>S</b><b>S</b>'''
for d in ['28','29','30']+[str(i) for i in range(1,32)]:
    cls='t' if d=='25' else 'l' if d in('18','21','24') else ''
    B+=f'<span class="{cls}">{d}</span>'
B+='''</div></div><div class=panel><div class=ph><b>Activity</b><span>LAST 7D</span></div><div class=row><span>Priya opened the link</span><span>2d</span></div><div class=row><span>Tidal Health asked for changes</span><span>3d</span></div><div class=row><span>Neha paid Final deck</span><span>1d</span></div></div></div></div></main></div>'''
open(D+'/B-night.html','w').write(B)
# ================= C: SKY (bright, glass, floating dock)
C='''<!doctype html><meta charset=utf-8><link rel=stylesheet href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
<style>
*{box-sizing:border-box}body{margin:0;font:400 14px/20px 'Plus Jakarta Sans',sans-serif;color:#0F172A;background:radial-gradient(900px 500px at 15% -5%,#C9DEFF 0,transparent 60%),radial-gradient(800px 500px at 100% 0,#E6D9FF 0,transparent 55%),radial-gradient(700px 500px at 60% 100%,#CFF5E7 0,transparent 55%),#F3F7FF;min-height:100vh;-webkit-font-smoothing:antialiased}
.wrap{max-width:1180px;margin:0 auto;padding:36px 32px 130px}
.hd{display:flex;justify-content:space-between;align-items:flex-start}.over{color:#64748B;font-weight:600;font-size:13px}h1{font:800 38px/44px 'Plus Jakarta Sans';letter-spacing:-.03em;margin:6px 0 0}
.glass{background:rgba(255,255,255,.62);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.9);border-radius:28px;box-shadow:0 20px 50px -24px rgba(37,99,235,.28)}
.btn{display:inline-flex;align-items:center;height:42px;padding:0 20px;border-radius:99px;font-weight:700;background:#0F172A;color:#fff}.btn.g{background:rgba(255,255,255,.8);color:#0F172A;border:1px solid #fff}
.hero{margin-top:28px;border-radius:32px;padding:32px;color:#fff;background:linear-gradient(135deg,#2F5BEA 0,#5B8CFF 55%,#8E7CFF 100%);display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:28px;align-items:center;box-shadow:0 30px 60px -28px rgba(47,91,234,.7)}
.hero .l{opacity:.8;font-weight:600}.hero .v{font:800 52px/56px 'Plus Jakarta Sans';letter-spacing:-.04em;margin:6px 0}.hero .s{opacity:.8}
.hero .m{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.28);border-radius:22px;padding:18px}.hero .m .v{font-size:28px;line-height:32px}
.strip{display:grid;grid-template-columns:repeat(7,1fr);gap:10px;margin-top:22px}.strip div{padding:14px 10px;text-align:center;border-radius:20px}.strip small{color:#64748B;font-weight:600}.strip b{display:block;font-size:20px;margin-top:2px}.strip .t{background:#0F172A;color:#fff}.strip .t small{color:#94A3B8}.strip i{display:block;width:6px;height:6px;border-radius:50%;background:#EF4444;margin:6px auto 0}.strip i.b{background:#2F5BEA}
.sh{display:flex;justify-content:space-between;align-items:baseline;margin:34px 4px 14px}.sh h2{font:800 22px 'Plus Jakarta Sans';margin:0;letter-spacing:-.02em}.sh span{color:#64748B;font-weight:600}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.tk{padding:20px;border-radius:26px;background:rgba(255,255,255,.75);border:1px solid #fff;box-shadow:0 18px 40px -24px rgba(15,23,42,.25)}.tk .top{display:flex;justify-content:space-between;align-items:center}
.av{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:13px}.ch{height:26px;padding:0 10px;border-radius:99px;font-weight:700;font-size:12px;display:inline-flex;align-items:center}
.late{background:#FFE4E1;color:#DC2626}.need{background:#FEF3C7;color:#B45309}.ok{background:#E0F2FE;color:#0369A1}
.tk h3{font:700 16px/22px 'Plus Jakarta Sans';margin:16px 0 4px}.tk p{margin:0;color:#64748B}.tk .bt{margin-top:18px;display:flex;justify-content:space-between;align-items:center}.pr{height:6px;width:90px;background:#E2E8F0;border-radius:3px;overflow:hidden}.pr i{display:block;height:100%;background:#2F5BEA}
.dock{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);display:flex;gap:6px;padding:10px;border-radius:99px;background:rgba(15,23,42,.88);backdrop-filter:blur(14px);box-shadow:0 24px 50px -16px rgba(15,23,42,.6)}
.dock a{display:flex;gap:8px;align-items:center;height:44px;padding:0 18px;border-radius:99px;color:#CBD5E1;font-weight:700}.dock a.on{background:#fff;color:#0F172A}
</style><div class=wrap>
<div class=hd><div><div class=over>Sunday, 25 October</div><h1>Hey Meera, it's Sunday.<br>Look at you, working.</h1></div><div style="display:flex;gap:10px"><span class="btn g">Notifications · 8</span><span class=btn>+ New project</span></div></div>
<div class=hero><div><div class=l>Received this month</div><div class=v>₹2,43,000</div><div class=s>97% of your ₹2,50,000 goal · ₹7,000 to go</div></div><div class=m><div class=l>Pending</div><div class=v>₹6,95,000</div><div class=s>Not due yet</div></div><div class=m><div class=l>Late · 2 clients</div><div class=v>₹62,000</div><div class=s>Remind them →</div></div></div>
<div class="strip">'''
for d,n,mk in [('Mon',19,''),('Tue',20,'r'),('Wed',21,'r'),('Thu',22,''),('Fri',23,'b'),('Sat',24,'r'),('Sun',25,'t')]:
    C+=f'<div class="glass {"t" if mk=="t" else ""}"><small>{d}</small><b>{n}</b>{"<i></i>" if mk=="r" else "<i class=b></i>" if mk=="b" else ""}</div>'
C+='''</div>
<div class=sh><h2>Needs you today</h2><span>7 things · most urgent first</span></div><div class=cards>'''
pal={'SH':('#EDE9FE','#6D28D9'),'NC':('#FFEDD5','#C2410C'),'KF':('#FEE2E2','#B91C1C'),'SN':('#CFFAFE','#0E7490'),'BS':('#FCE7F3','#BE185D'),'TH':('#D1FAE5','#047857'),'AL':('#DBEAFE','#1D4ED8')}
for i,(a,c,t,s,b,l) in enumerate(TODO[:6]):
    bg,fg=pal[a]; chip='<span class="ch late">Late</span>' if i<3 else '<span class="ch need">Needs you</span>' if i<5 else '<span class="ch ok">In progress</span>'
    C+=f'<div class=tk><div class=top><span class=av style="background:{bg};color:{fg}">{a}</span>{chip}</div><h3>{t}</h3><p>{c} · {s}</p><div class=bt><div class=pr><i style="width:{25+i*10}%"></i></div><span class="btn" style="height:36px;padding:0 16px">{b}</span></div></div>'
C+='''</div></div><div class=dock><a class=on>Today</a><a>Clients</a><a>Calendar</a><a>Payments</a><a>Settings</a></div>'''
open(D+'/C-sky.html','w').write(C)
CH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
for n,h in [('A-paper',1500),('B-night',900),('C-sky',1050)]:
    subprocess.run([CH,'--headless=new','--disable-gpu','--hide-scrollbars','--no-first-run','--force-device-scale-factor=1',f'--user-data-dir=/tmp/pa/_o_{n}',f'--window-size=1440,{h}','--virtual-time-budget=9000',f'--screenshot={D}/{n}.png',f'file://{D}/{n}.html'],capture_output=True,timeout=180)
    print(n,os.path.getsize(f'{D}/{n}.png'))
