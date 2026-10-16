import subprocess, json, os, sys, concurrent.futures as cf
ROOT='/Users/prayanipohekar/PayGuard/prototype/index.html'
OUT='/private/tmp/claude-501/-Users-prayanipohekar-PayGuard/0c1b16e5-daec-4bf2-ba12-8af5d6437fca/scratchpad/review'
CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
base=open(ROOT).read()

PEEK=[['click','[data-a="peek"]'],['wait',700]]
def open_project(name): return [['eval',"[...document.querySelectorAll('.fr')].find(r=>/%s/.test(r.innerText)).click()"%name],['wait',700]]
CLIENTS=[['click','[data-a="view"][data-v="clients"]'],['wait',700]]
FIRSTDAY=[['click','[data-a="start"]'],['wait',400],['click','#agree'],['click','#cont'],['wait',700]]
def proj(n): return PEEK+CLIENTS+open_project(n)
CLIENT=[['click','[data-a="role"][data-r="client"]'],['wait',900]]
SC={
 'landing-top':     ([],1360,900),
 'landing-full':    ([],1360,3300),
 'setup':           ([['click','[data-a="start"]'],['wait',700]],1360,900),
 'first-day':       (FIRSTDAY,1360,900),
 'plan':            (FIRSTDAY+[['click','[data-a="plan"]'],['wait',800]],1360,1500),
 'today-active':    (PEEK,1360,1100),
 'today-waiting-open': (PEEK+[['click','[data-a="waitopen"]'],['wait',500]],1360,1300),
 'clients':         (PEEK+CLIENTS,1360,1000),
 'calendar':        (PEEK+[['click','[data-a="view"][data-v="calendar"]'],['wait',800]],1360,1000),
 'payments':        (PEEK+[['click','[data-a="view"][data-v="payments"]'],['wait',900]],1360,1500),
 'project-awaiting-approval': (proj('Bloom'),1360,1200),
 'project-overdue-funding':   (proj('Northwind'),1360,1100),
 'project-funded-upload':     (proj('Acme'),1360,1200),
 'project-changes-requested': (proj('Tidal'),1360,1200),
 'project-complete':          (proj('Orbit'),1360,1100),
 'documents-modal': (proj('Bloom')+[['eval',"document.querySelectorAll('.rows li')[0].click()"],['wait',400],['click','[data-a="receipt"]'],['wait',700]],1360,1000),
 'client-invite':   (proj('Lumen')+CLIENT,1360,1200),
 'client-checkout': (proj('Lumen')+CLIENT+[['click','[data-a="gocheckout"]'],['wait',800]],1360,1000),
 'client-review':   (proj('Bloom')+CLIENT,1360,1500),
 'client-changes-dialog': (proj('Bloom')+CLIENT+[['click','[data-a="askchanges"]'],['wait',700],['eval',"var t=document.getElementById('note');t.value='the palette feels really cold. i think we just need warmer tones. dont change the logo';t.dispatchEvent(new Event('input',{bubbles:true}))"],['wait',900]],1360,900),
 'client-approve-dialog': (proj('Bloom')+CLIENT+[['click','[data-a="askapprove"]'],['wait',800]],1360,900),
 'client-released': (proj('Bloom')+CLIENT+[['click','[data-a="askapprove"]'],['wait',600],['click','[data-a="approve"]'],['wait',1200]],1360,900),
 'm-landing':       ([],390,2800),
 'm-today':         (PEEK,390,1800),
 'm-clients':       (PEEK+CLIENTS,390,1200),
 'm-payments':      (PEEK+[['click','[data-a="view"][data-v="payments"]'],['wait',900]],390,1700),
 'm-project':       (proj('Bloom'),390,1700),
 'm-client-review': (proj('Bloom')+CLIENT,390,2400),
 'm-checkout':      (proj('Lumen')+CLIENT+[['click','[data-a="gocheckout"]'],['wait',800]],390,1500),
}
RUN="""<script>
(function(){var steps=%s;function q(s){return document.querySelector(s)}
var i=0;function next(){if(i>=steps.length)return;var s=steps[i++];try{if(s[0]==='click'){var e=q(s[1]);if(e)e.click();else console.log('MISSING '+s[1]);next();}else if(s[0]==='eval'){(new Function(s[1]))();next();}else if(s[0]==='wait'){setTimeout(next,s[1]);}}catch(er){console.log('ERR '+er.message);next();}}
setTimeout(next,600);})();
</script>"""
def shoot(name):
    steps,w,h=SC[name]
    html=base.replace('</body>', RUN%json.dumps(steps)+'</body>') if '</body>' in base else base+RUN%json.dumps(steps)
    f=f'{OUT}/_{name}.html'; open(f,'w').write(html)
    out=f'{OUT}/shots/{name}.png'
    prof=f'{OUT}/_prof_{name}'
    target=f; ww=w
    if w<500:
        wrap=f'{OUT}/_w_{name}.html'; open(wrap,'w').write(f'<!doctype html><body style="margin:0;background:#fff"><iframe src="_{name}.html" style="border:0;width:{w}px;height:{h}px;display:block"></iframe></body>'); target=wrap; ww=500
    r=subprocess.run([CHROME,'--headless=new','--disable-gpu','--hide-scrollbars','--no-first-run','--force-device-scale-factor=1',f'--user-data-dir={prof}',f'--window-size={ww},{h}','--virtual-time-budget=14000',f'--screenshot={out}','file://'+target],capture_output=True,text=True,timeout=120)
    if w<500 and os.path.exists(out):
        from PIL import Image
        im=Image.open(out); im.crop((0,0,w,im.size[1])).save(out)
    return name, os.path.exists(out)
if __name__=='__main__':
    names=sys.argv[1:] or list(SC)
    with cf.ThreadPoolExecutor(4) as ex:
        for n,ok in ex.map(shoot,names): print(n,'OK' if ok else 'FAIL',flush=True)
