from PIL import Image, ImageFilter, ImageDraw
import os
from crops import BOXES
S=4
os.makedirs('masks',exist_ok=True)
sheet=Image.open('sheet.png').convert('RGB')
W,H=sheet.size
for name,(l,t,r,b) in BOXES.items():
    l=max(0,l-6); r=min(W,r+8); t=max(0,t-4)
    c=sheet.crop((l,t,r,b)).split()[0]            # red channel: ink is dark, paper is light
    c=c.resize(((r-l)*S,(b-t)*S),Image.LANCZOS)
    c=c.filter(ImageFilter.GaussianBlur(0.8))
    ink=c.point(lambda v:0 if v<150 else 255)      # 0 = ink
    pad=16
    canvas=Image.new('L',(ink.width+2*pad,ink.height+2*pad),255)
    canvas.paste(ink,(pad,pad)); ink=canvas
    # silhouette: close tiny gaps, flood the outside, invert
    inv=ink.point(lambda v:255 if v==0 else 0)     # 255 = ink
    closed=inv.filter(ImageFilter.MaxFilter(7))
    flood=closed.copy()
    ImageDraw.floodfill(flood,(0,0),128,thresh=0)
    sil=flood.point(lambda v:255 if v!=128 else 0) # 255 = inside shape
    sil=sil.filter(ImageFilter.MinFilter(5))
    silbw=sil.point(lambda v:0 if v==255 else 255)
    ink.save(f'masks/{name}.ink.png'); silbw.save(f'masks/{name}.sil.png')
print(len(BOXES),'masks')
