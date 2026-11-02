"""'Made For Him and Him' v4: photo full-bleed (knee framing, plain wall), type in the empty left third."""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import binary_dilation
sys.path.insert(1,"/home/user/Dom-Manipulation/banner-bau-toni-black/scripts")
from logo import make_logo
from compose_himhim import tracked, tw, cb, font, fit
from compose_himhim3 import header, hero, offer
import grade as G
C282=(40,40,40)
def graded(path):
    im=np.asarray(Image.open(path).convert("RGB")).astype(np.float64); lab=G.srgb_to_lab(im)
    L=np.clip(lab[...,0]/100,0,1); Lc=np.clip(0.5+(L-0.5)*1.10-0.02,0,1); lab[...,0]=Lc*100; lab[...,1:]*=0.88
    lab[...,2]-=3.0*np.clip((Lc-0.6)/0.4,0,1); return Image.fromarray(G.lab_to_srgb(lab).astype("uint8"))
def build(out,W=1080,H=1620,M=65,clear=40,head_y=150,hero_gap=60):
    src=graded("gen/himhim_d_0.png"); s=max(W/src.width,H/src.height); src=src.resize((int(src.width*s+0.5),int(src.height*s+0.5)),Image.LANCZOS)
    ox=(src.width-W)//2; oy=(src.height-H)//2; cv=src.crop((ox,oy,ox+W,oy+H)); d=ImageDraw.Draw(cv)
    a=Image.open("gen/himhim_d_cutout.png").split()[3].resize(src.size,Image.LANCZOS).crop((ox,oy,ox+W,oy+H)); subj=np.asarray(a)>128
    free=binary_dilation(subj,iterations=clear)
    # widest text field that clears the figures in the header band and in the hero band
    def field(y0,y1): cols=np.where(free[y0:y1].any(0))[0]; return (cols.min() if len(cols) else W)-M
    lg=make_logo(C282,8); lw=320; lg=lg.resize((lw,int(lg.height*lw/lg.width)),Image.LANCZOS); cv.paste(lg,((W-lw)//2,56),lg)
    hw=min(760,field(head_y,head_y+260)); hb,hz=header(d,M,head_y,hw)
    numw=min(int(760*0.6),hw,field(hb+hero_gap,hb+hero_gap+300)); hero_b=hero(d,M,hb+hero_gap,numw)
    ob,orx=offer(d,M,H-M-20,22,60,24)
    txt=np.abs(np.asarray(cv.convert("L")).astype(int)-np.asarray(src.crop((ox,oy,ox+W,oy+H)).convert("L")).astype(int))>40
    ys,xs=np.where(subj); print(f"figures x {xs.min()}-{xs.max()} ({(xs.max()-xs.min())/W:.0%} W) y {ys.min()}-{ys.max()} ({(ys.max()-ys.min())/H:.0%} H) | header {hz}px width {hw} | numeral width {numw} ends {hero_b} | offer {ob}-{H-M-20} right {int(orx)} | type within {clear}px of figures: {int((txt&free).sum())}")
    cv.save(out,quality=94,optimize=True); return cv
if __name__=="__main__": build("out/himhim5_23.jpg")
