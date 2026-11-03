"""Toni Black category banner 2000x2000: boy on the block (left), father on the floor (right).
Header band: KIDS + [BRIEF][BOXER] top-left, logo top centre, MEN + [BRIEF][BOXER][SINGLET] top-right."""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import binary_dilation
sys.path.insert(1,"/home/user/Dom-Manipulation/banner-bau-toni-black/scripts")
from logo import make_logo
from compose_himhim import tracked, tw, cb, font
from compose_himhim5 import graded
C282=(40,40,40)
def plate(W,H,photo,pw,px,py):
    s=pw/photo.width; ph=int(photo.height*s+0.5); p=photo.resize((pw,ph),Image.LANCZOS)
    out=p.resize((W,H),Image.BILINEAR).filter(ImageFilter.GaussianBlur(60))
    top=p.crop((0,0,pw,6)).resize((W,py+60),Image.BILINEAR).filter(ImageFilter.GaussianBlur(10)); out.paste(top,(0,0))
    bot=p.crop((0,ph-6,pw,ph)).resize((W,max(1,H-py-ph)+60),Image.BILINEAR).filter(ImageFilter.GaussianBlur(10)); out.paste(bot,(0,py+ph-60))
    l=p.crop((0,0,6,ph)).resize((px+60,ph),Image.BILINEAR).filter(ImageFilter.GaussianBlur(10)); out.paste(l,(0,py))
    r=p.crop((pw-6,0,pw,ph)).resize((W-px-pw+60,ph),Image.BILINEAR).filter(ImageFilter.GaussianBlur(10)); out.paste(r,(px+pw-60,py))
    m=Image.new("L",(pw,ph),255); md=ImageDraw.Draw(m); fe=60
    for i in range(fe):
        v=int(255*i/fe); md.line([(i,0),(i,ph)],fill=v); md.line([(pw-1-i,0),(pw-1-i,ph)],fill=v); md.line([(0,i),(pw,i)],fill=v); md.line([(0,ph-1-i),(pw,ph-1-i)],fill=v)
    out.paste(p,(px,py),m); return out,ph
def pills(d,x,y,labels,f,h,pad,gap,stroke):
    w=max(tw(d,t,f,f.size*0.08) for t in labels)+2*pad
    for i,t in enumerate(labels):
        x0=x+i*(w+gap); d.rounded_rectangle([x0,y,x0+w,y+h],radius=h//2,outline=C282,width=stroke)
        b=cb(d,t,f); tt=tw(d,t,f,f.size*0.08); tracked(d,(x0+(w-tt)/2-b[0],y+(h-(b[3]-b[1]))/2-b[1]),t,f,C282,f.size*0.08)
    return x+len(labels)*w+(len(labels)-1)*gap, w
def build(out,W=2000,H=2000,M=120,photo_scale=0.92,floor=0,label=64,btn=28,btn_h=68,pad=34,gap=24,stroke=3,logo_y=48,logo_gap=72,clear=40,head_gap=64):
    ph_img=graded("gen/cat2_c_fixed.png"); pw=int(W*photo_scale); s=pw/ph_img.width; phh=int(ph_img.height*s+0.5)
    px=(W-pw)//2; py=H-floor-phh; cv,_=plate(W,H,ph_img,pw,px,py); d=ImageDraw.Draw(cv)
    lg=make_logo(C282,8); lw=300; lg=lg.resize((lw,int(lg.height*lw/lg.width)),Image.LANCZOS)
    fl=font("ZalandoSansExpanded-Bold.ttf",label); fb=font("ZalandoSansExpanded-SemiBold.ttf",btn)
    cv.paste(lg,((W-lw)//2,logo_y),lg)        # logo stays where it was: alone, top centre
    # each category block sits directly above its own person, bottom-aligned to a fixed gap over that head
    a0=Image.open("gen/cat2_c_cutout.png").split()[3].resize((pw,phh),Image.LANCZOS); sub0=np.zeros((H,W),bool); sub0[py:py+phh,px:px+pw]=np.asarray(a0)>128
    boy_top=np.where(sub0[:, :int(0.45*W)].any(1))[0].min(); dad_top=np.where(sub0[:, int(0.5*W):].any(1))[0].min()
    lb=cb(d,"KIDS",fl); lh=lb[3]-lb[1]; blk=lh+28+btn_h
    ky=boy_top-head_gap-blk; krow=ky+lh+28
    xe,w=pills(d,M,krow,["BRIEF","BOXER"],fb,btn_h,pad,gap,stroke); cx=(M+xe)/2; t=tw(d,"KIDS",fl,label*0.08); tracked(d,(cx-t/2-lb[0],ky-lb[1]),"KIDS",fl,C282,label*0.08)
    my=dad_top-head_gap-blk; mrow=my+lh+28
    rw=3*w+2*gap; xs=W-M-rw; xe2,_=pills(d,xs,mrow,["BRIEF","BOXER","SINGLET"],fb,btn_h,pad,gap,stroke); cx=(xs+xe2)/2; mb=cb(d,"MEN",fl); t=tw(d,"MEN",fl,label*0.08); tracked(d,(cx-t/2-mb[0],my-mb[1]),"MEN",fl,C282,label*0.08)
    top_y,row_y=ky,mrow
    # clearance check against the cutout
    a=Image.open("gen/cat2_c_cutout.png").split()[3].resize((pw,phh),Image.LANCZOS); sub=np.zeros((H,W),bool); sub[py:py+phh,px:px+pw]=np.asarray(a)>128
    base,_=plate(W,H,ph_img,pw,px,py); txt=np.abs(np.asarray(cv.convert("L")).astype(int)-np.asarray(base.convert("L")).astype(int))>40
    hit=int((txt&binary_dilation(sub,iterations=clear)).sum()); ys,xs_=np.where(sub)
    print(f"logo {logo_y}-{logo_y+lg.height} | KIDS block {ky}-{krow+btn_h} (boy head {boy_top}) | MEN block {my}-{mrow+btn_h} (dad head {dad_top}) | photo {pw}px wide at y {py}-{py+phh} | figures x {xs_.min()}-{xs_.max()} ({(xs_.max()-xs_.min())/W:.0%} W) y {ys.min()}-{ys.max()} ({(ys.max()-ys.min())/H:.0%} H) | band {top_y}-{row_y+btn_h}, boy head top {ys.min()}, gap {ys.min()-(row_y+btn_h)} | button w {w} | type within {clear}px of figures: {hit}")
    cv.save(out,quality=92,optimize=True,progressive=True); return cv
if __name__=="__main__": build("out/cat2.jpg")
