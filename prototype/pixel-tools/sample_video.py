import sys, json
from PIL import Image
S=sys.argv[1]
PW, PH = 10.8, 14.65
def isfg(p): return p[0]>225 and p[1]<140 and p[2]<60
out=[]
for n in range(1,121):
    im=Image.open(f"{S}/frames/f{n:03d}.png").convert("RGB"); W,H=im.size; px=im.load()
    # fit offsets from edge positions
    from collections import Counter
    ct=Counter(); rt=Counter()
    for y in range(120,H,3):
        prev=isfg(px[0,y])
        for x in range(1,W):
            c=isfg(px[x,y])
            if c!=prev: ct[x]+=1
            prev=c
    for x in range(0,W,3):
        prev=isfg(px[x,120])
        for y in range(121,H):
            c=isfg(px[x,y])
            if c!=prev: rt[y]+=1
            prev=c
    def best(cnt,p):
        b=None
        for o10 in range(int(p*10)):
            o=o10/10; e=0
            for x,v in cnt.items():
                d=((x-o)/p)%1; d=min(d,1-d); e+=v*d
            if b is None or e<b[0]: b=(e,o)
        return b[1]
    ox=best(ct,PW); oy=best(rt,PH)
    rows=[]
    y=oy
    while y+PH<=H+1:
        r=""
        x=ox
        while x+PW<=W+1:
            cx=min(W-1,int(x+PW/2)); cy=min(H-1,int(y+PH/2))
            r+= "1" if isfg(px[cx,cy]) else "0"
            x+=PW
        rows.append(r); y+=PH
    # drop rows above y=118 (chip bar)
    skip=int((118-oy)//PH)+1
    out.append({"f":n,"ox":ox,"oy":oy,"skip":skip,"rows":rows[skip:]})
json.dump(out, open(f"{S}/video_grid.json","w"))
print(len(out), len(out[0]["rows"]), len(out[0]["rows"][0]), out[0]["ox"], out[0]["oy"])
