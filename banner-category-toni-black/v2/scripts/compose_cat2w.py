"""Category banner v2 in the original Banner Category size: 1200x990 (built at 2400x1980, retina)."""
import sys, numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import binary_dilation
sys.path.insert(1,"/home/user/Dom-Manipulation/banner-bau-toni-black/scripts")
from logo import make_logo
from compose_himhim import tracked, tw, cb, font
from compose_himhim5 import graded
from compose_cat2 import pills, C282
from PIL import ImageFilter
def plate(W,H,photo,pw,px,py,edge=40,fe=220):
    """Side extension: every row of the photo continues outward with its own edge colour, blended over a wide feather."""
    s=pw/photo.width; ph=int(photo.height*s+0.5); p=photo.resize((pw,ph),Image.LANCZOS); a=np.asarray(p).astype(float)
    out=np.zeros((H,W,3)); out[py:py+ph,:px]=a[:,:edge].mean(1,keepdims=True); out[py:py+ph,px+pw:]=a[:,-edge:].mean(1,keepdims=True)
    out[py:py+ph,px:px+pw]=a
    if py>0: out[:py]=out[py]
    if py+ph<H: out[py+ph:]=out[py+ph-1]
    base=Image.fromarray(out.clip(0,255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(8))
    m=Image.new("L",(pw,ph),255); md=ImageDraw.Draw(m)
    for i in range(fe):
        v=int(255*i/fe); md.line([(i,0),(i,ph)],fill=v); md.line([(pw-1-i,0),(pw-1-i,ph)],fill=v)
    base.paste(p,(px,py),m); return base,ph
def build(out,W=2400,H=1980,M=120,photo_h=0.89,label=64,btn=28,btn_h=68,pad=34,gap=24,stroke=3,logo_y=48,clear=40,head_gap=64,kids_anchor="head",lw=300):
    ph_img=graded("gen/cat2_c_fixed.png"); phh=int(H*photo_h); pw=int(ph_img.width*phh/ph_img.height+0.5)
    px=(W-pw)//2; py=H-phh; cv,_=plate(W,H,ph_img,pw,px,py); d=ImageDraw.Draw(cv)
    lg=make_logo(C282,8); lg=lg.resize((lw,int(lg.height*lw/lg.width)),Image.LANCZOS); cv.paste(lg,((W-lw)//2,logo_y),lg)
    fl=font("ZalandoSansExpanded-Bold.ttf",label); fb=font("ZalandoSansExpanded-SemiBold.ttf",btn)
    a0=Image.open("gen/cat2_c_cutout.png").split()[3].resize((pw,phh),Image.LANCZOS); sub=np.zeros((H,W),bool); sub[py:py+phh,px:px+pw]=np.asarray(a0)>128
    L=sub[:, :int(0.45*W)]; boy_top=np.where(L.any(1))[0].min(); boy_cx=np.where(L[boy_top:boy_top+160].any(0))[0].mean()
    R=sub[:, int(0.5*W):]; dad_top=np.where(R.any(1))[0].min()
    lb=cb(d,"KIDS",fl); lh=lb[3]-lb[1]; blk=lh+28+btn_h
    # KIDS block: bottom-aligned head_gap above the boy's head, centred on his head (clamped to the margin) or at the margin
    w=max(tw(d,t,fb,btn*0.08) for t in ["BRIEF","BOXER","SINGLET"])+2*pad; kw=2*w+gap
    kx=M if kids_anchor=="margin" else int(max(M,min(boy_cx-kw/2,W-M-kw)))
    ky=boy_top-head_gap-blk; krow=ky+lh+28
    xe,_=pills(d,kx,krow,["BRIEF","BOXER"],fb,btn_h,pad,gap,stroke); cx=(kx+xe)/2; t=tw(d,"KIDS",fl,label*0.08); tracked(d,(cx-t/2-lb[0],ky-lb[1]),"KIDS",fl,C282,label*0.08)
    # MEN block: right-aligned to the margin, head_gap above the father's head
    my=dad_top-head_gap-blk; mrow=my+lh+28; rw=3*w+2*gap; xs=W-M-rw
    xe2,_=pills(d,xs,mrow,["BRIEF","BOXER","SINGLET"],fb,btn_h,pad,gap,stroke); cx=(xs+xe2)/2; mb=cb(d,"MEN",fl); t=tw(d,"MEN",fl,label*0.08); tracked(d,(cx-t/2-mb[0],my-mb[1]),"MEN",fl,C282,label*0.08)
    base,_=plate(W,H,ph_img,pw,px,py); txt=np.abs(np.asarray(cv.convert("L")).astype(int)-np.asarray(base.convert("L")).astype(int))>40
    hit=int((txt&binary_dilation(sub,iterations=clear)).sum()); ys,xs_=np.where(sub)
    print(f"{out}: logo {logo_y}-{logo_y+lg.height} | KIDS {kx}-{xe} y {ky}-{krow+btn_h} (boy head {boy_top}, cx {boy_cx:.0f}) | MEN {xs}-{xe2} y {my}-{mrow+btn_h} (dad head {dad_top}) | photo {pw}x{phh} at ({px},{py}) | figures x {xs_.min()}-{xs_.max()} ({(xs_.max()-xs_.min())/W:.0%} W) y {ys.min()}-{ys.max()} ({(ys.max()-ys.min())/H:.0%} H) | type within {clear}px: {hit}")
    cv.save(out,quality=92,optimize=True,progressive=True); return cv
if __name__=="__main__":
    for a in ("head","margin"):
        cv=build(f"out/cat2w_{a}.jpg",kids_anchor=a); cv.resize((800,660),Image.LANCZOS).save(f"out/cat2w_{a}_p.jpg",quality=85)
