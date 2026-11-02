"""'Made For Him and Him' v5: 25% huge, centred, behind the figures; logo + headline + SAVE UP TO centred on top;
offer block small bottom-left. Figures cut out, knee-framed at the bottom edge, on a plain light-grey wall."""
import sys, numpy as np
from PIL import Image, ImageDraw
sys.path.insert(1,"/home/user/Dom-Manipulation/banner-bau-toni-black/scripts")
from logo import make_logo
from compose_himhim import tracked, tw, cb, font, fit
from compose_himhim3 import offer
from compose_himhim5 import graded
C282=(40,40,40)
def centred(d,W,t,f,y,trk=0.0,fill=C282):
    w=tw(d,t,f,f.size*trk); b=cb(d,t,f); tracked(d,((W-w)/2-b[0],y-b[1]),t,f,fill,f.size*trk); return y+(b[3]-b[1])
def build(out,W=1080,H=1620,M=65,fig_scale=0.86,num_frac=0.85,head_size=40,kick=30,gaps=(26,34,22)):
    src=graded("gen/himhim_e_0.png"); alpha=Image.open("gen/himhim_e_cutout.png").split()[3]
    s=max(W/src.width,H/src.height)*fig_scale; fw,fh=int(src.width*s+0.5),int(src.height*s+0.5)
    fig=src.resize((fw,fh),Image.LANCZOS); fig.putalpha(alpha.resize((fw,fh),Image.LANCZOS))
    a=np.asarray(src)[...,:3]; wall=tuple(int(v) for v in np.percentile(a[:300,:400].reshape(-1,3),80,axis=0))
    cv=Image.new("RGB",(W,H),wall); d=ImageDraw.Draw(cv)
    # top stack, centred: logo, headline, SAVE UP TO, 25%
    lg=make_logo(C282,8); lw=300; lg=lg.resize((lw,int(lg.height*lw/lg.width)),Image.LANCZOS); cv.paste(lg,((W-lw)//2,48),lg); y=48+lg.height+gaps[0]
    fh_=font("ZalandoSansExpanded-Regular.ttf",head_size); y=centred(d,W,"MADE FOR HIM AND HIM",fh_,y,0.12)+gaps[1]
    fk=font("ZalandoSansExpanded-Bold.ttf",kick); y=centred(d,W,"SAVE UP TO",fk,y,0.17)+gaps[2]
    fn=font("ZalandoSansExpanded-Black.ttf",fit(d,"25%","ZalandoSansExpanded-Black.ttf",int(W*num_frac),-0.02)); nb=cb(d,"25%",fn); cap=nb[3]-nb[1]
    num_top=y; num_bot=centred(d,W,"25%",fn,y,-0.02)
    # figures over the number, knee-framed at the bottom edge, same horizontal placement as the photo
    fx=int((W-fw)/2); fy=H-fh; cv.paste(fig,(fx,fy),fig)
    d=ImageDraw.Draw(cv); ob,orx=offer(d,M,H-M-20,22,60,24)
    # checks
    sub=np.zeros((H,W),bool); al=np.asarray(fig.split()[3])>128; sub[max(fy,0):H, max(fx,0):min(fx+fw,W)]=al[max(0,-fy):H-fy, max(0,-fx):W-fx]
    rows=np.where(sub[num_top:num_bot].any(1))[0]; covered=(num_bot-(num_top+rows.min())) if len(rows) else 0
    head_top=np.where(sub.any(1))[0].min()
    from scipy.ndimage import binary_dilation
    base=np.asarray(Image.new("RGB",(W,H),wall)).astype(int); txt=np.abs(np.asarray(cv).astype(int)-base).sum(-1)>60; txt&=~sub
    near=binary_dilation(sub,iterations=30)&txt; near[:num_bot+5]=False
    print("offer/other type within 30px of figures:",int(near.sum()),"| wall",wall)
    print(f"number: width {int(tw(d,'25%',fn,fn.size*-0.02))} ({tw(d,'25%',fn,fn.size*-0.02)/W:.0%} W), cap {cap} ({cap/H:.0%} H), y {num_top}-{num_bot} | figures top {head_top}, cover {covered}px = {covered/cap:.0%} of the number | figures {fh/H:.0%} H, x {fx}-{fx+fw} | offer right {int(orx)}")
    cv.save(out,quality=94,optimize=True); return cv
if __name__=="__main__": build("out/himhim6_23.jpg")
