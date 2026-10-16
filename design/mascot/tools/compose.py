import json, os, shutil
T=json.load(open('traced.json'))
OUT='/Users/prayanipohekar/PayGuard/design/mascot'
os.makedirs(OUT+'/svg',exist_ok=True); os.makedirs(OUT+'/source',exist_ok=True); os.makedirs(OUT+'/tools',exist_ok=True)
INK='#0A39B8'; PAPER='#FFFDF5'
LABEL={'main':'PayGuard buddy','invoice':'Invoice buddy','project':'Project buddy','approval':'Approval buddy','payment':'Payment buddy',
 'happy':'Happy','excited':'Excited','proud':'Proud','thinking':'Thinking','focused':'Focused','worried':'Worried','celebrating':'Celebrating',
 'walking':'Walking','running':'Running','holding-document':'Holding a document','pointing':'Pointing','carrying-files':'Carrying files','jumping':'Jumping',
 'sitting-laptop':'Sitting with a laptop','waving':'Waving','thumbs-up':'Thumbs up','holding-shield':'Holding a shield','using-phone':'Using a phone','presenting':'Presenting',
 'prop-laptop':'Laptop','prop-document':'Document','prop-files':'Files','prop-shield':'Shield','prop-rupee':'Rupee coin','prop-calendar':'Calendar','prop-checklist':'Checklist','prop-analytics':'Analytics','prop-bell':'Notification bell'}
def body(t):
    return (f'<path fill="var(--mk-paper,{PAPER})" d="{t["sil"]}"/>'
            f'<path fill="var(--mk-ink,{INK})" fill-rule="evenodd" d="{t["ink"]}"/>')
syms=[]
for n,t in T.items():
    w,h=t['w'],t['h']
    svg=(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{round(w/4)}" height="{round(h/4)}" role="img" aria-label="{LABEL[n]}">'
         f'<title>{LABEL[n]}</title>{body(t)}</svg>')
    open(f'{OUT}/svg/{n}.svg','w').write(svg)
    syms.append(f'<symbol id="mk-{n}" viewBox="0 0 {w} {h}">{body(t)}</symbol>')
open(f'{OUT}/mascot-sprite.svg','w').write('<svg xmlns="http://www.w3.org/2000/svg" style="display:none">'+''.join(syms)+'</svg>')
json.dump({n:{'w':t['w'],'h':t['h'],'label':LABEL[n]} for n,t in T.items()},open(f'{OUT}/manifest.json','w'),indent=1)
shutil.copy('sheet.png',OUT+'/source/character-sheet.png')
for f in ['crops.py','masks.py','trace.mjs','compose.py']: shutil.copy(f,OUT+'/tools/'+f)
print(len(T),'svgs', sum(os.path.getsize(f'{OUT}/svg/{n}.svg') for n in T)//1024,'KB total')
