"""'Made For Him and Him' v6: no large voids. Figures at 95% of full-bleed scale, knee-framed; 25% at 85% W behind
the heads (cover <= 35%); logo + SAVE UP TO centred on top; the headline moves into the left column (two lines,
mid-left) with the offer block under it, so the column is used top to bottom."""
import sys, numpy as np
from PIL import Image, ImageDraw
sys.path.insert(1,"/home/user/Dom-Manipulation/banner-bau-toni-black/scripts")
from logo import make_logo
from compose_himhim import tracked, tw, cb, font, fit
from compose_himhim3 import offer
from compose_himhim5 import graded
from compose_himhim6 import centred
C282=(40,40,40)
def build(out,W=1080,H=1620,M=65,fig_scale=0.95,num_frac=0.85,kick=30,pair_left=400,clear=34):
    src=graded("gen/himhim_e_0.png"); alpha=Image.open("gen/himhim_e_cutout.png").split()[3]
    s=max(W/src.width,H/src.height)*fig_scale; fw,fh=int(src.width*s+0.5),int(src.height*s+0.5)
    fig=src.resize((fw,fh),Image.LANCZOS); fig.putalpha(alpha.resize((fw,fh),Image.LANCZOS))
    a=np.asarray(src)[...,:3]; wall=tuple(int(v) for v in np.percentile(a[:300,:400].reshape(-1,3),80,axis=0))
    cv=Image.new("RGB",(W,H),wall); d=ImageDraw.Draw(cv)
    lg=make_logo(C282,8); lw=300; lg=lg.resize((lw,int(lg.height*lw/lg.width)),Image.LANCZOS); cv.paste(lg,((W-lw)//2,48),lg); y=48+lg.height+44
    fk=font("ZalandoSansExpanded-Bold.ttf",kick); y=centred(d,W,"SAVE UP TO",fk,y,0.17)+26
    fn=font("ZalandoSansExpanded-Black.ttf",fit(d,"25%","ZalandoSansExpanded-Black.ttf",int(W*num_frac),-0.02)); nb=cb(d,"25%",fn); cap=nb[3]-nb[1]
    num_top=y; num_bot=centred(d,W,"25%",fn,y,-0.02)
    fy=H-fh; al0=np.asarray(fig.split()[3])>128; vis=al0[-fy if fy<0 else 0:]; cols=np.where(vis.any(0))[0]; bx0,bx1=cols.min(),cols.max()
    fx=int(pair_left-bx0); cv.paste(fig,(fx,fy),fig); d=ImageDraw.Draw(cv)
    strip=pair_left-clear-M
    # left column: headline (two lines) centred vertically in the column's upper half, offer block at the bottom
    lines=("MADE","FOR","HIM","AND","HIM"); z=min(fit(d,t,"ZalandoSansExpanded-Regular.ttf",strip,0.08) for t in lines); fh_=font("ZalandoSansExpanded-Regular.ttf",z); c=cb(d,"H",fh_); ch=c[3]-c[1]
    ben=22
    while ben>16 and tw(d,"Extra IDR 5K voucher",font("Arimo-Regular.ttf",ben))>strip: ben-=1
    probe=ImageDraw.Draw(Image.new("RGB",(W,H))); top_probe,_=offer(probe,M,H-M-20,ben,int(ben*2.6),ben+1); bh=(H-M-20)-top_probe
    free_top=num_bot+60; free_bot=H-M-20-bh-80
    hy=int((free_top+free_bot)/2-(len(lines)*ch+(len(lines)-1)*int(ch*0.30))/2)
    for t in lines: tracked(d,(M-cb(d,t,fh_)[0],hy-c[1]),t,fh_,C282,z*0.08); hy+=int(ch*1.30)
    ob,orx=offer(d,M,H-M-20,ben,int(ben*2.6),ben+1)
    sub=np.zeros((H,W),bool); sub[max(fy,0):H,max(fx,0):min(fx+fw,W)]=al0[max(0,-fy):H-fy,max(0,-fx):W-fx]
    rows=np.where(sub[num_top:num_bot].any(1))[0]; covered=(num_bot-(num_top+rows.min())) if len(rows) else 0
    print(f"figures {fh/H:.0%} H, pair x {fx+bx0}-{fx+bx1}, head top {np.where(sub.any(1))[0].min()} | number y {num_top}-{num_bot} cap {cap}, covered {covered}px = {covered/cap:.0%} | headline {z}px, {len(lines)} lines, ends {hy-int(ch*0.45)} | offer {ob}-{H-M-20} ben {ben}px")
    cv.save(out,quality=94,optimize=True); return cv
if __name__=="__main__": build("out/himhim7_23.jpg")
