"""Three Cuts plate from the real product photos (Drive: Brief 6.png, Boxer Brief 6a.png, Boxer 1.png).
Light set from light_plate.py (Category wall and floor colours, original floor shadows), built at 3200 px.
All three garments at one scale (waistbands equal width, as the same size laid flat), waistbands on one line,
centred on the name axes 0.19 / 0.50 / 0.81 used by compose_three2.py."""
import sys, numpy as np
from PIL import Image
import light_plate
def build(old_photo,brief,boxerbrief,boxer,out,N=3200,top_frac=0.375,max_w=0.285,band=689):
    # light background with the old floor shadows, no garments
    p=Image.open(old_photo); empty=Image.new("RGBA",p.size,(0,0,0,0)); empty.save(out+".empty.png")
    light_plate.build(old_photo,out+".empty.png",out+".bg.jpg")
    bg=Image.open(out+".bg.jpg").convert("RGB").resize((N,N),Image.LANCZOS)
    items=[]
    for path,cx,bw in ((brief,0.19,920),(boxerbrief,0.50,689),(boxer,0.81,703)):
        im=Image.open(path).convert("RGBA"); im=im.crop(im.getbbox()); items.append((im.resize((int(im.width*band/bw),int(im.height*band/bw)),Image.LANCZOS),cx))
    s=min(max_w*N/im.width for im,_ in items)                      # one scale for all three
    y0=int(top_frac*N); bottoms=[]
    for im,cx in items:
        im=im.resize((int(im.width*s),int(im.height*s)),Image.LANCZOS); x=int(cx*N-im.width/2); bg.paste(im,(x,y0),im); bottoms.append(y0+im.height)
    bg.save(out,quality=95); print(out,"scale",round(s,3),"top",top_frac,"bottom frac",round(max(bottoms)/N,3))
if __name__=="__main__": build(*sys.argv[1:6])
