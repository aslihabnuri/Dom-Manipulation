"""Toni Black 11.11 banner, 1080x1620 (2160x3240 retina).
Tiers: logo (alone, top centre) > 11.11 (dominant) > MADE TO MOVE. TOGETHER. > offer block bottom-left
(SAVE UP TO / 45% / SHOP NOW). All type Dark Charcoal #282828 on the light cyclorama; CTA is a charcoal pill."""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy.ndimage import binary_dilation
from logo import make_logo
import badges
import grade as G
F="fonts/static/"; C=(40,40,40); WHITE=(255,255,255)
def font(n,s): return ImageFont.truetype(F+n,int(s),layout_engine=ImageFont.Layout.RAQM)
TNUM=["tnum"]   # Zalando's tabular 1 (one.tf): full base and short flag, reads as 1 at display size; the default 1 reads as t
def tw(d,t,f,trk=0,feat=None): return sum(d.textlength(ch,font=f,features=feat) for ch in t)+trk*(len(t)-1)
def tracked(d,xy,t,f,fill,trk=0,stroke=0,feat=None):
    x,y=xy
    for ch in t: d.text((x,y),ch,font=f,fill=fill,stroke_width=stroke,stroke_fill=fill,features=feat); x+=d.textlength(ch,font=f,features=feat)+trk+2*stroke
def fit(d,t,name,target,trk_em=0.0,lo=8,hi=900,feat=None):
    while lo<hi:
        m=(lo+hi+1)//2; f=font(name,m)
        if tw(d,t,f,m*trk_em,feat)<=target: lo=m
        else: hi=m-1
    return font(name,lo)
def graded(path):
    im=np.asarray(Image.open(path).convert("RGB")).astype(np.float64); lab=G.srgb_to_lab(im)
    L=np.clip(lab[...,0]/100,0,1); Lc=np.clip(0.5+(L-0.5)*1.10-0.02,0,1); lab[...,0]=Lc*100; lab[...,1:]*=0.88
    lab[...,2]-=3.0*np.clip((Lc-0.6)/0.4,0,1); return Image.fromarray(G.lab_to_srgb(lab).astype("uint8"))
def plate(W,H,p,px,py,edge=24,fe=90):
    """Photo at (px,py); wall continues outward row by row (left/right) and column by column (top), feathered."""
    a=np.asarray(p).astype(float); ph,pw=a.shape[:2]; out=np.zeros((H,W,3))
    x0,x1=max(px,0),min(px+pw,W); y0,y1=max(py,0),min(py+ph,H)
    out[y0:y1,x0:x1]=a[y0-py:y1-py,x0-px:x1-px]
    if x0>0: out[y0:y1,:x0]=a[y0-py:y1-py,x0-px:x0-px+edge].mean(1,keepdims=True)
    if x1<W: out[y0:y1,x1:]=a[y0-py:y1-py,x1-px-edge:x1-px].mean(1,keepdims=True)
    if y0>0: out[:y0]=out[y0:y0+edge].mean(0,keepdims=True)
    if y1<H: out[y1:]=out[y1-edge:y1].mean(0,keepdims=True)
    base=Image.fromarray(out.clip(0,255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(10))
    m=Image.new("L",(x1-x0,y1-y0),255); md=ImageDraw.Draw(m); w,h=m.size
    for i in range(fe):
        v=int(255*i/fe)
        if x0>0: md.line([(i,0),(i,h)],fill=v)
        if x1<W: md.line([(w-1-i,0),(w-1-i,h)],fill=v)
        if y0>0: md.line([(0,i),(w,i)],fill=v)
    base.paste(Image.fromarray(out[y0:y1,x0:x1].clip(0,255).astype(np.uint8)),(x0,y0),m); return base
def build(photo,cutout,out,k=1,W=1080,H=1620,M=65,photo_w=0.80,right=0.89,logo_w=320,logo_y=56,gap_logo=64,gap_head=40,clear=40):
    W,H,M=W*k,H*k,M*k; g=lambda v:int(round(v*k))
    src=graded(photo); pw=int(W*photo_w); s=pw/src.width; ph=int(src.height*s+0.5); p=src.resize((pw,ph),Image.LANCZOS)
    a=Image.open(cutout).split()[3].resize((pw,ph),Image.LANCZOS); am=np.asarray(a)>128
    xs=np.where(am.any(0))[0]; px=int(W-M-xs.max()); py=H-ph          # father's knee on the right margin, floor at the bottom
    cv=plate(W,H,p,px,py); sub=np.zeros((H,W),bool); ys0,xs0=np.where(am); yy=ys0+py; xx=xs0+px; ok=(xx>=0)&(xx<W)&(yy>=0); sub[yy[ok],xx[ok]]=True
    d=ImageDraw.Draw(cv); head=np.where(sub.any(1))[0].min()
    # tier 0: logo alone
    lg=make_logo(C,8*k); lw=g(logo_w); lg=lg.resize((lw,int(lg.height*lw/lg.width)),Image.LANCZOS); cv.paste(lg,((W-lw)//2,g(logo_y)),lg)
    # tier 1: 11.11, full measure
    # Arimo Bold: Zalando's flagged and footed 1 reads as "tt.tt" at display size
    f1=fit(d,"11.11","Arimo-Bold.ttf",W-2*M,-0.02); b=d.textbbox((0,0),"11.11",font=f1); t1=-0.02*f1.size; w1=tw(d,"11.11",f1,t1)
    y1=g(logo_y)+lg.height+g(gap_logo); tracked(d,((W-w1)/2-b[0],y1-b[1]),"11.11",f1,C,t1); y1e=y1+b[3]-b[1]
    # tier 2: headline, one line, tracked caps
    hl="MADE TO MOVE. TOGETHER."; f2=fit(d,hl,"ZalandoSansExpanded-Bold.ttf",W-2*M,0.04); b2=d.textbbox((0,0),hl,font=f2); t2=0.04*f2.size; w2=tw(d,hl,f2,t2)
    y2=y1e+g(gap_head); tracked(d,((W-w2)/2-b2[0],y2-b2[1]),hl,f2,C,t2); y2e=y2+b2[3]-b2[1]
    # tier 3: offer block on the left wall: the largest 45% that fits, placed as low as that size allows
    fk=font("ZalandoSansExpanded-Bold.ttf",g(30)); kt="SAVE UP TO"; tk=0.10*fk.size; kw=tw(d,kt,fk,tk)
    fc=font("ZalandoSansExpanded-Bold.ttf",g(24)); ct="SHOP NOW"; tc=0.10*fc.size; cw=tw(d,ct,fc,tc); pill_h=g(64); pill_w=int(cw+g(64))
    # free wall left of the figures, row by row (first subject column minus clearance minus margin)
    first=np.where(sub.any(1),sub.argmax(1),W); freerow=first-g(clear)-M
    def block_h(sz):
        b3=d.textbbox((0,0),"45%",font=font("ZalandoSansExpanded-Black.ttf",sz)); bk=d.textbbox((0,0),kt,font=fk)
        return (bk[3]-bk[1])+g(22)+(b3[3]-b3[1])+g(44)+pill_h
    lo_y=head+g(60); hi_y=H-int(M*1.6)
    best=None
    for sz in range(g(200),g(60),-g(4)):                               # largest 45% whose block fits somewhere in the band
        f3=font("ZalandoSansExpanded-Black.ttf",sz); w3=d.textlength("45%",font=f3); need=max(w3,kw,pill_w); bh=block_h(sz)
        for top in range(hi_y-bh,lo_y-1,-g(8)):                         # lowest position first
            if freerow[top:top+bh].min()>=need: best=(sz,top,bh); break
        if best: break
    sz,top,bh=best; f3=font("ZalandoSansExpanded-Black.ttf",sz); free=int(freerow[top:top+bh].min())
    # draw the block at the chosen band
    bk=d.textbbox((0,0),kt,font=fk); b3=d.textbbox((0,0),"45%",font=f3); h3=b3[3]-b3[1]
    yk=top; y3=yk+(bk[3]-bk[1])+g(22); pill_y=y3+h3+g(44); bottom=pill_y+pill_h
    tracked(d,(M-bk[0],yk-bk[1]),kt,fk,C,tk); d.text((M-b3[0],y3-b3[1]),"45%",font=f3,fill=C)
    d.rounded_rectangle([M,pill_y,M+pill_w,pill_y+pill_h],radius=pill_h//2,fill=C)
    bc=d.textbbox((0,0),ct,font=fc); tracked(d,(M+(pill_w-cw)/2-bc[0],pill_y+(pill_h-(bc[3]-bc[1]))/2-bc[1]),ct,fc,WHITE,tc)
    # checks
    base=plate(W,H,p,px,py); txt=np.abs(np.asarray(cv.convert("L")).astype(int)-np.asarray(base.convert("L")).astype(int))>40
    hit=int((txt&binary_dilation(sub,iterations=g(clear))).sum())
    print(f"{out}: logo {g(logo_y)}-{g(logo_y)+lg.height} | 11.11 {y1}-{y1e} ({f1.size}px) | headline {y2}-{y2e} ({f2.size}px) | head top {head} gap {head-y2e} | offer {yk}-{bottom} free {free} 45% {f3.size}px | photo {pw}x{ph} at ({px},{py}) | type within {clear}px of figures: {hit}")
    cv.save(out,quality=92,optimize=True,progressive=True); return cv
def build2(photo,cutout,out,k=1,W=1080,H=1620,M=65,photo_w=0.80,logo_w=320,logo_y=56,num_w=0.46,big_w=0.85,clear=40):
    """himhim7_23 layout: logo > 11.11 > SAVE UP TO > 45% at 85% width behind the heads; headline stacked on the left wall with SHOP NOW."""
    W,H,M=W*k,H*k,M*k; g=lambda v:int(round(v*k))
    src=graded(photo); pw=int(W*photo_w); s=pw/src.width; ph=int(src.height*s+0.5); p=src.resize((pw,ph),Image.LANCZOS)
    a=Image.open(cutout).split()[3].resize((pw,ph),Image.LANCZOS); am=np.asarray(a)>128
    xs=np.where(am.any(0))[0]; px=int(W-M-xs.max()); py=H-ph
    cv=plate(W,H,p,px,py); sub=np.zeros((H,W),bool); ys0,xs0=np.where(am); yy=ys0+py; xx=xs0+px; ok=(xx>=0)&(xx<W)&(yy>=0); sub[yy[ok],xx[ok]]=True
    head=np.where(sub.any(1))[0].min(); d=ImageDraw.Draw(cv)
    front=Image.new("RGBA",(W,H),(0,0,0,0)); dfront=ImageDraw.Draw(front)      # type that must stay in front
    back=Image.new("RGBA",(W,H),(0,0,0,0)); dback=ImageDraw.Draw(back)         # 45%: behind the heads
    lg=make_logo(C,8*k); lw=g(logo_w); lg=lg.resize((lw,int(lg.height*lw/lg.width)),Image.LANCZOS); front.paste(lg,((W-lw)//2,g(logo_y)),lg)
    y=g(logo_y)+lg.height+g(48)
    f1=fit(d,"11.11","Arimo-Bold.ttf",int(W*num_w),-0.02); b=d.textbbox((0,0),"11.11",font=f1); t1=-0.02*f1.size; w1=tw(d,"11.11",f1,t1)
    tracked(dfront,((W-w1)/2-b[0],y-b[1]),"11.11",f1,C,t1); y1e=y+b[3]-b[1]
    fk=font("ZalandoSansExpanded-Bold.ttf",g(36)); kt="SAVE UP TO"; tk=0.12*fk.size; kw=tw(d,kt,fk,tk); bk=d.textbbox((0,0),kt,font=fk)
    yk=y1e+g(40); tracked(dfront,((W-kw)/2-bk[0],yk-bk[1]),kt,fk,C,tk); yke=yk+bk[3]-bk[1]
    f3=fit(d,"45%","ZalandoSansExpanded-Black.ttf",int(W*big_w),-0.02); b3=d.textbbox((0,0),"45%",font=f3); t3=-0.02*f3.size; w3=tw(d,"45%",f3,t3)
    y3=yke+g(24); tracked(dback,((W-w3)/2-b3[0],y3-b3[1]),"45%",f3,C,t3); y3e=y3+b3[3]-b3[1]
    num=np.asarray(back.split()[3])>128; covered=(num&sub).sum()/max(num.sum(),1)
    # left wall: headline stack + CTA, the largest stack that fits between the number and the floor
    first=np.where(sub.any(1),sub.argmax(1),W); freerow=first-g(clear)-M
    lines=("MADE","TO MOVE.","TOGETHER."); fc=font("ZalandoSansExpanded-Bold.ttf",g(24)); ct="SHOP NOW"; tc=0.10*fc.size; cw=tw(d,ct,fc,tc); pill_h=g(64); pill_w=int(cw+g(64))
    # badges: icon disc + label, two rows
    bi=g(64); bgap=g(18); fb=font("ZalandoSansExpanded-SemiBold.ttf",g(20)); tb=0.08*fb.size; bpitch=g(84)
    blabels=(("FREE ONGKIR",),("VOUCHER 5K","NEW BUYER")); bicons=(badges.truck,badges.ticket)
    bw=bi+bgap+max(tw(d,t,fb,tb) for lab in blabels for t in lab); badges_h=bpitch+bi
    lo_y=y3e+g(72); hi_y=H-int(M*1.6); best=None
    for sz in range(g(120),g(24),-g(2)):
        fh=font("ZalandoSansExpanded-Bold.ttf",sz); trk=0.04*sz; need=max(max(tw(d,t,fh,trk) for t in lines),pill_w)
        cap=d.textbbox((0,0),"MADE",font=fh); ch=cap[3]-cap[1]; lead=int(ch*1.35); need=max(need,bw); bh=ch+lead*(len(lines)-1)+g(48)+badges_h+g(40)+pill_h
        mid=lo_y+(hi_y-lo_y-bh)//2                                     # centred between the number and the floor margin,
        for top in sorted(range(lo_y,hi_y-bh+1,g(4)),key=lambda t:abs(t-mid)):   # else the nearest position that fits
            if freerow[top:top+bh].min()>=need: best=(fh,trk,ch,lead,top,bh); break
        if best: break
    fh,trk,ch,lead,top,bh=best
    for i,t in enumerate(lines):
        bb=d.textbbox((0,0),t,font=fh); tracked(dfront,(M-bb[0],top+i*lead-bb[1]),t,fh,C,trk)
    yb=top+ch+lead*(len(lines)-1)+g(48)
    for i,(lab,icon) in enumerate(zip(blabels,bicons)):
        ic=icon(bi); y0=yb+i*bpitch; front.paste(ic,(M,y0),ic)
        lh=d.textbbox((0,0),"VOUCHER",font=fb); lhh=lh[3]-lh[1]; lgap=int(lhh*0.6); tot=lhh*len(lab)+lgap*(len(lab)-1); ty=y0+(bi-tot)/2
        for j,t in enumerate(lab):
            bb=d.textbbox((0,0),t,font=fb); tracked(dfront,(M+bi+bgap-bb[0],ty+j*(lhh+lgap)-lh[1]),t,fb,C,tb)
    pill_y=yb+badges_h+g(40); dfront.rounded_rectangle([M,pill_y,M+pill_w,pill_y+pill_h],radius=pill_h//2,fill=C+(255,))
    bc=d.textbbox((0,0),ct,font=fc); tracked(dfront,(M+(pill_w-cw)/2-bc[0],pill_y+(pill_h-(bc[3]-bc[1]))/2-bc[1]),ct,fc,WHITE,tc)
    # layers: wall, 45%, figures, front type
    base=cv.copy(); cv.paste(back,(0,0),back)
    fig=Image.new("RGBA",(W,H),(0,0,0,0)); fig.paste(p,(px,py)); m=Image.new("L",(W,H),0); m.paste(a,(px,py)); cv.paste(fig.convert("RGB"),(0,0),m)
    cv.paste(front,(0,0),front)
    hit=int(((np.asarray(front.split()[3])>40)&binary_dilation(sub,iterations=g(clear))).sum())
    print(f"{out}: logo {g(logo_y)}-{g(logo_y)+lg.height} | 11.11 {y}-{y1e} ({f1.size}px) | SAVE UP TO {yk}-{yke} | 45% {y3}-{y3e} ({f3.size}px, {w3:.0f} wide, {covered:.0%} covered by figures) | head {head} | stack {top}-{pill_y+pill_h} ({fh.size}px, badges {yb}-{yb+badges_h}) | front type within {clear}px: {hit}")
    cv.save(out,quality=92,optimize=True,progressive=True); return cv
def build3(photo,cutout,out,k=1,W=1080,H=1620,M=65,photo_w=0.74,logo_w=300,logo_y=56,cap=52,big_w=0.82,badge=72,clear=40,num_gap=40):
    """Header-led layout. Three tiers, three sizes of type:
    1 header  11.11 / MADE TO MOVE. / TOGETHER.  one cap height, centred, leading 1.45 cap
    2 offer   SAVE UP TO (small, tracked) tight on 45% (80% of the width), behind the heads
    3 detail  FREE ONGKIR, VOUCHER 5K / NEW BUYER badges and SHOP NOW, left wall, one left axis
    Gaps between tiers are at least twice the leading inside a tier."""
    W,H,M=W*k,H*k,M*k; g=lambda v:int(round(v*k))
    src=graded(photo); pw=int(W*photo_w); s=pw/src.width; ph=int(src.height*s+0.5); p=src.resize((pw,ph),Image.LANCZOS)
    a=Image.open(cutout).split()[3].resize((pw,ph),Image.LANCZOS); am=np.asarray(a)>128
    xs=np.where(am.any(0))[0]; px=int(W-M-xs.max()); py=H-ph
    cv=plate(W,H,p,px,py); sub=np.zeros((H,W),bool); ys0,xs0=np.where(am); yy=ys0+py; xx=xs0+px; ok=(xx>=0)&(xx<W)&(yy>=0); sub[yy[ok],xx[ok]]=True
    head=np.where(sub.any(1))[0].min(); d=ImageDraw.Draw(cv)
    front=Image.new("RGBA",(W,H),(0,0,0,0)); dfront=ImageDraw.Draw(front); back=Image.new("RGBA",(W,H),(0,0,0,0)); dback=ImageDraw.Draw(back)
    lg=make_logo(C,8*k); lw=g(logo_w); lg=lg.resize((lw,int(lg.height*lw/lg.width)),Image.LANCZOS); front.paste(lg,((W-lw)//2,g(logo_y)),lg)
    # tier 1: header, every line at the same cap height
    def at_cap(name,txt,c):
        lo,hi=8,600
        while lo<hi:
            m=(lo+hi+1)//2; b=d.textbbox((0,0),"H" if "Zalando" in name else "1",font=font(name,m))
            if b[3]-b[1]<=c: lo=m
            else: hi=m-1
        return font(name,lo)
    c=g(cap); lead=int(c*1.45); y=g(logo_y)+lg.height+g(64)
    head_lines=(("11.11","Arimo-Bold.ttf",-0.01),("MADE TO MOVE.","ZalandoSansExpanded-Black.ttf",0.02),("TOGETHER.","ZalandoSansExpanded-Black.ttf",0.02))
    # Arimo Bold's stem is about 0.21 cap, Zalando Black's about 0.31 cap: thicken 11.11 by a stroke so the three lines share one weight,
    # and set it smaller by twice the stroke so the cap height stays equal
    st=max(1,int(round(0.05*c)))
    for i,(t,n,tr) in enumerate(head_lines):
        sw=st if "Arimo" in n else 0; f=at_cap(n,t,c-2*sw); trk=tr*f.size; w=tw(d,t,f,trk)+2*sw*len(t); b=d.textbbox((0,0),t,font=f)
        top_ink=d.textbbox((0,0),"H" if "Zalando" in n else "1",font=f)[1]
        tracked(dfront,((W-w)/2-b[0]+sw,y+i*lead-top_ink+sw),t,f,C,trk,sw)
    y1e=y+2*lead+c
    # tier 2: offer
    fk=font("ZalandoSansExpanded-Bold.ttf",g(30)); kt="SAVE UP TO"; tk=0.14*fk.size; kw=tw(d,kt,fk,tk); bk=d.textbbox((0,0),kt,font=fk)
    yk=y1e+g(64); tracked(dfront,((W-kw)/2-bk[0],yk-bk[1]),kt,fk,C,tk); yke=yk+bk[3]-bk[1]
    bw_=big_w
    while True:                                                         # widest 45% that keeps num_gap clear above the heads
        f3=fit(d,"45%","ZalandoSansExpanded-Black.ttf",int(W*bw_),-0.02); b3=d.textbbox((0,0),"45%",font=f3); t3=-0.02*f3.size; w3=tw(d,"45%",f3,t3)
        y3=yke+g(20); y3e=y3+b3[3]-b3[1]
        if head-y3e>=g(num_gap) or bw_<=0.66: break
        bw_-=0.01
    tracked(dback,((W-w3)/2-b3[0],y3-b3[1]),"45%",f3,C,t3); y3e=y3+b3[3]-b3[1]
    num=np.asarray(back.split()[3])>128; covered=(num&sub).sum()/max(num.sum(),1)
    # tier 3: badges + CTA on the left wall, one left axis, centred in the band between the number and the floor where it fits
    first=np.where(sub.any(1),sub.argmax(1),W); freerow=first-g(clear)-M
    bi=g(badge); bgap=g(20); fb=font("ZalandoSansExpanded-SemiBold.ttf",g(22)); tb=0.08*fb.size; bpitch=bi+g(24)
    blabels=(("FREE ONGKIR",),("VOUCHER 5K","NEW BUYER")); bicons=(badges.truck,badges.ticket)
    fc=font("ZalandoSansExpanded-Bold.ttf",g(24)); ct="SHOP NOW"; tc=0.10*fc.size; cw=tw(d,ct,fc,tc); pill_h=g(68); pill_w=int(cw+g(72))
    need=max(bi+bgap+max(tw(d,t,fb,tb) for lab in blabels for t in lab),pill_w); bh=bpitch+bi+g(48)+pill_h
    lo_y=y3e+g(80); hi_y=H-int(M*1.6); mid=lo_y+(hi_y-lo_y-bh)//2
    top=next(t for t in sorted(range(lo_y,hi_y-bh+1,g(4)),key=lambda t:abs(t-mid)) if freerow[t:t+bh].min()>=need)
    lh=d.textbbox((0,0),"VOUCHER",font=fb); lhh=lh[3]-lh[1]; lgap=int(lhh*0.6)
    for i,(lab,icon) in enumerate(zip(blabels,bicons)):
        ic=icon(bi); y0=top+i*bpitch; front.paste(ic,(M,y0),ic); tot=lhh*len(lab)+lgap*(len(lab)-1); ty=y0+(bi-tot)/2
        for j,t in enumerate(lab):
            bb=d.textbbox((0,0),t,font=fb); tracked(dfront,(M+bi+bgap-bb[0],ty+j*(lhh+lgap)-lh[1]),t,fb,C,tb)
    pill_y=top+bpitch+bi+g(48); dfront.rounded_rectangle([M,pill_y,M+pill_w,pill_y+pill_h],radius=pill_h//2,fill=C+(255,))
    bc=d.textbbox((0,0),ct,font=fc); tracked(dfront,(M+(pill_w-cw)/2-bc[0],pill_y+(pill_h-(bc[3]-bc[1]))/2-bc[1]),ct,fc,WHITE,tc)
    cv.paste(back,(0,0),back); fig=Image.new("RGB",(W,H)); fig.paste(p,(px,py)); m=Image.new("L",(W,H),0); m.paste(a,(px,py)); cv.paste(fig,(0,0),m); cv.paste(front,(0,0),front)
    hit=int(((np.asarray(front.split()[3])>40)&binary_dilation(sub,iterations=g(clear))).sum())
    print(f"{out}: logo {g(logo_y)}-{g(logo_y)+lg.height} | header {y}-{y1e} (cap {c}, lead {lead}) | SAVE UP TO {yk}-{yke} | 45% {y3}-{y3e} ({f3.size}px, {w3:.0f} wide = {bw_:.2f} W) | head {head} gap {head-y3e} | detail {top}-{pill_y+pill_h} | front type within {clear}px: {hit}")
    cv.save(out,quality=92,optimize=True,progressive=True); return cv
def build4(photo,cutout,out,k=1,W=1080,H=1620,M=65,photo_w=0.72,logo_w=300,logo_y=56,cap=46,lead_k=1.5,gap_logo=72,gap_tier=84,big_w=0.85,num_gap=56,tag_cap=46,badge=68,clear=40,giant=False,giant_bottom=1450,tag=True):
    """Guideline fonts only, by role: Zalando Sans Expanded for display (header, 11.11, 45%, SAVE UP TO, SHOP NOW),
    Arimo for the small detail labels. No synthetic weight.
    Top: logo / MADE TO MOVE. TOGETHER. / SAVE UP TO 45%. Left wall: 11.11 / badges / SHOP NOW.
    Every gap between groups is at least twice the space between lines inside a group."""
    W,H,M=W*k,H*k,M*k; g=lambda v:int(round(v*k))
    src=graded(photo); pw=int(W*photo_w); s=pw/src.width; ph=int(src.height*s+0.5); p=src.resize((pw,ph),Image.LANCZOS)
    a=Image.open(cutout).split()[3].resize((pw,ph),Image.LANCZOS); am=np.asarray(a)>128
    xs=np.where(am.any(0))[0]; px=int(W-M-xs.max()); py=H-ph
    cv=plate(W,H,p,px,py); sub=np.zeros((H,W),bool); ys0,xs0=np.where(am); yy=ys0+py; xx=xs0+px; ok=(xx>=0)&(xx<W)&(yy>=0); sub[yy[ok],xx[ok]]=True
    head=np.where(sub.any(1))[0].min(); d=ImageDraw.Draw(cv)
    front=Image.new("RGBA",(W,H),(0,0,0,0)); df=ImageDraw.Draw(front)
    def at_cap(name,c,probe="H"):
        lo,hi=8,900
        while lo<hi:
            m=(lo+hi+1)//2; b=d.textbbox((0,0),probe,font=font(name,m))
            if b[3]-b[1]<=c: lo=m
            else: hi=m-1
        return font(name,lo)
    def line(t,f,x,ytop,trk,align="c",fill=C):
        w=tw(d,t,f,trk); b=d.textbbox((0,0),t,font=f); top_ink=d.textbbox((0,0),"H",font=f)[1]
        xx=(W-w)/2 if align=="c" else x; tracked(df,(xx-b[0],ytop-top_ink),t,f,fill,trk); return w
    BLK="ZalandoSansExpanded-Black.ttf"; BLD="ZalandoSansExpanded-Bold.ttf"
    lg=make_logo(C,8*k); lw=g(logo_w); lg=lg.resize((lw,int(lg.height*lw/lg.width)),Image.LANCZOS); front.paste(lg,((W-lw)//2,g(logo_y)),lg)
    # header
    c=g(cap); lead=int(c*lead_k); fh=at_cap(BLK,c); y=g(logo_y)+lg.height+g(gap_logo)
    for i,t in enumerate(("MADE TO MOVE.","TOGETHER.")): line(t,fh,0,y+i*lead,0.02*fh.size)
    yhe=y+lead+c
    # offer
    fk=at_cap(BLD,g(21)); yk=yhe+g(gap_tier); line("SAVE UP TO",fk,0,yk,0.16*fk.size); yke=yk+g(21)
    bw_=big_w
    while True:
        f3=fit(d,"45%",BLK,int(W*bw_),-0.02); b3=d.textbbox((0,0),"45%",font=f3); y3=yke+g(24); y3e=y3+b3[3]-b3[1]
        if head-y3e>=g(num_gap) or bw_<=0.60: break
        bw_-=0.01
    w3=tw(d,"45%",f3,-0.02*f3.size); tracked(df,((W-w3)/2-b3[0],y3-b3[1]),"45%",f3,C,-0.02*f3.size)
    # left wall: 11.11 tag, badges (Arimo labels), SHOP NOW
    first=np.where(sub.any(1),sub.argmax(1),W); freerow=first-g(clear)-M
    back=Image.new("RGBA",(W,H),(0,0,0,0)); giant_top=H
    if giant:   # 11.11 super-graphic in Clean White behind the figures, across the margins, on the band of the boxers and legs
        fg=fit(d,"11.11",BLK,W-2*M,-0.02); bg_=d.textbbox((0,0),"11.11",font=fg); tg=-0.02*fg.size; wg=tw(d,"11.11",fg,tg)
        giant_top=g(giant_bottom)-(bg_[3]-bg_[1]); tracked(ImageDraw.Draw(back),((W-wg)/2-bg_[0],giant_top-bg_[1]),"11.11",fg,WHITE,tg)
    ft=at_cap(BLK,g(tag_cap),"1"); tt=0.02*ft.size; tag_w=tw(d,"11.11",ft,tt) if tag else 0
    bi=g(badge); bgap=g(20); fb=at_cap("Arimo-Bold.ttf",g(17)); tb=0.08*fb.size; bpitch=bi+g(28)
    blabels=(("FREE ONGKIR",),("VOUCHER 5K","NEW BUYER")); bicons=(badges.truck,badges.ticket)
    fc=at_cap(BLD,g(18)); ct="SHOP NOW"; tc=0.12*fc.size; cw=tw(d,ct,fc,tc); pill_h=g(66); pill_w=int(cw+g(80))
    need=max(tag_w,bi+bgap+max(tw(d,t,fb,tb) for lab in blabels for t in lab),pill_w)
    g1=g(64) if tag else 0; g2=g(56); bh=(g(tag_cap) if tag else 0)+g1+bpitch+bi+g2+pill_h
    lo_y=y3e+g(num_gap); hi_y=(giant_top-g(56)) if giant else H-int(M*1.6); mid=lo_y+(hi_y-lo_y-bh)//2
    top=next(t for t in sorted(range(lo_y,hi_y-bh+1,g(4)),key=lambda t:abs(t-mid)) if freerow[t:t+bh].min()>=need)
    if tag: bt=d.textbbox((0,0),"11.11",font=ft); tracked(df,(M-bt[0],top-bt[1]),"11.11",ft,C,tt)
    yb=top+(g(tag_cap) if tag else 0)+g1; lh=g(17); lgap=int(lh*0.7)
    for i,(lab,icon) in enumerate(zip(blabels,bicons)):
        ic=icon(bi); y0=yb+i*bpitch; front.paste(ic,(M,y0),ic); tot=lh*len(lab)+lgap*(len(lab)-1); ty=y0+(bi-tot)/2
        top_ink=d.textbbox((0,0),"H",font=fb)[1]
        for j,t in enumerate(lab):
            bb=d.textbbox((0,0),t,font=fb); tracked(df,(M+bi+bgap-bb[0],ty+j*(lh+lgap)-top_ink),t,fb,C,tb)
    pill_y=yb+bpitch+bi+g2; df.rounded_rectangle([M,pill_y,M+pill_w,pill_y+pill_h],radius=pill_h//2,fill=C+(255,))
    bc=d.textbbox((0,0),ct,font=fc); top_ink=d.textbbox((0,0),"H",font=fc)[1]; tracked(df,(M+(pill_w-cw)/2-bc[0],pill_y+(pill_h-g(18))/2-top_ink),ct,fc,WHITE,tc)
    if giant:
        cv.paste(back,(0,0),back); fig=Image.new("RGB",(W,H)); fig.paste(p,(px,py)); m=Image.new("L",(W,H),0); m.paste(a,(px,py)); cv.paste(fig,(0,0),m)
    cv.paste(front,(0,0),front)
    hit=int(((np.asarray(front.split()[3])>40)&binary_dilation(sub,iterations=g(clear))).sum())
    print(f"giant 11.11 {giant_top}-{g(giant_bottom)}" if giant else "")
    print(f"{out}: logo {g(logo_y)}-{g(logo_y)+lg.height} | header {y}-{yhe} (cap {c}, lead {lead}) | SAVE UP TO {yk} | 45% {y3}-{y3e} ({bw_:.2f} W) | head {head} gap {head-y3e} | left {top}-{pill_y+pill_h} | type within {clear}px: {hit}")
    cv.save(out,quality=92,optimize=True,progressive=True); return cv
def build6(photo,cutout,out,k=1,W=1080,H=1620,M=65,photo_w=0.72,logo_w=300,logo_y=56,head_cap=30,hero_w=0.70,badge=68,clear=40,
           head_font="ZalandoSansExpanded-Black.ttf",head_trk=0.02,hero_font="ZalandoSansExpanded-Black.ttf",hero_cap=None,hero_trk=-0.08,gap_head=48,gap_hero=72,gap_fig=40):
    """11.11-led layout. Logo alone, centred. Everything else on one left axis (the margin):
    header line, 11.11 as the hero across the measure, then SAVE UP TO / 45% as large as the free wall allows,
    then badges and SHOP NOW beside the figures. Zalando for display, Arimo for the badge labels."""
    W,H,M=W*k,H*k,M*k; g=lambda v:int(round(v*k))
    src=graded(photo); pw=int(W*photo_w); s=pw/src.width; ph=int(src.height*s+0.5); p=src.resize((pw,ph),Image.LANCZOS)
    a=Image.open(cutout).split()[3].resize((pw,ph),Image.LANCZOS); am=np.asarray(a)>128
    xs=np.where(am.any(0))[0]; px=int(W-M-xs.max()); py=H-ph
    cv=plate(W,H,p,px,py); sub=np.zeros((H,W),bool); ys0,xs0=np.where(am); yy=ys0+py; xx=xs0+px; ok=(xx>=0)&(xx<W)&(yy>=0); sub[yy[ok],xx[ok]]=True
    head=np.where(sub.any(1))[0].min(); d=ImageDraw.Draw(cv); df=d
    def at_cap(name,c,probe="H"):
        lo,hi=8,900
        while lo<hi:
            m=(lo+hi+1)//2; b=d.textbbox((0,0),probe,font=font(name,m))
            if b[3]-b[1]<=c: lo=m
            else: hi=m-1
        return font(name,lo)
    def put(t,f,x,ytop,trk,probe="H"):
        b=d.textbbox((0,0),t,font=f); ti=d.textbbox((0,0),probe,font=f)[1]; tracked(d,(x-b[0],ytop-ti),t,f,C,trk); return tw(d,t,f,trk)
    BLK="ZalandoSansExpanded-Black.ttf"; BLD="ZalandoSansExpanded-Bold.ttf"
    first=np.where(sub.any(1),sub.argmax(1),W); freerow=first-g(clear)-M
    lg=make_logo(C,8*k); lw=g(logo_w); lg=lg.resize((lw,int(lg.height*lw/lg.width)),Image.LANCZOS); cv.paste(lg,((W-lw)//2,g(logo_y)),lg)
    # header: one line
    fh=at_cap(head_font,g(head_cap)); y=g(logo_y)+lg.height+g(64); put("MADE TO MOVE. TOGETHER.",fh,M,y,head_trk*fh.size); yhe=y+g(head_cap)
    # hero: 11.11 across the measure
    def ink_w(f):
        im=Image.new("L",(int(f.size*6),int(f.size*2)),0); tracked(ImageDraw.Draw(im),(f.size,0),"11.11",f,255,hero_trk*f.size,feat=TNUM)
        c=np.where((np.asarray(im)>128).any(0))[0]; return c.max()-c.min()+1
    if hero_cap: fx=at_cap(hero_font,g(hero_cap),"1")                    # 11.11 by cap height
    else:
        tgt=int((W-2*M)*hero_w)                                          # or by ink width: hero_w of the measure
        fx=fit(d,"11.11",hero_font,tgt,hero_trk,feat=TNUM); fx=fit(d,"11.11",hero_font,int(tgt*tgt/ink_w(fx)),hero_trk,feat=TNUM)
    bx=d.textbbox((0,0),"11.11",font=fx,features=TNUM); hx=bx[3]-bx[1]
    probe=Image.new("L",(fx.size*2,fx.size*2),0); ImageDraw.Draw(probe).text((0,0),"1",font=fx,fill=255,features=TNUM)
    lx=int(np.where((np.asarray(probe)>128).any(0))[0].min())          # measured ink edge: textbbox reports 0 for the tabular 1
    yx=yhe+g(gap_head); tracked(d,(M-lx,yx-bx[1]),"11.11",fx,C,hero_trk*fx.size,feat=TNUM); yxe=yx+hx
    # offer: SAVE UP TO + the largest 45% that fits the free wall under the hero
    fk=at_cap(BLD,g(22)); yk=yxe+g(gap_hero); put("SAVE UP TO",fk,M,yk,0.16*fk.size); y3=yk+g(22)+g(22)
    for sz in range(g(400),g(60),-g(2)):
        f3=font(BLK,sz); b3=d.textbbox((0,0),"45%",font=f3); w3=tw(d,"45%",f3,-0.02*sz); h3=b3[3]-b3[1]
        if w3<=W-2*M and freerow[y3:y3+h3+g(gap_fig)].min()>=w3: break       # the largest 45% that keeps gap_fig clear of the figures
    tracked(d,(M-b3[0],y3-b3[1]),"45%",f3,C,-0.02*f3.size); y3e=y3+h3
    # detail: badges + CTA
    bi=g(badge); bgap=g(20); fb=at_cap("Arimo-Bold.ttf",g(17)); tb=0.08*fb.size; bpitch=bi+g(28)
    blabels=(("FREE ONGKIR",),("VOUCHER 5K","NEW BUYER")); bicons=(badges.truck,badges.ticket)
    fc=at_cap(BLD,g(18)); ct="SHOP NOW"; tc=0.12*fc.size; cw=tw(d,ct,fc,tc); pill_h=g(66); pill_w=int(cw+g(80))
    need=max(bi+bgap+max(tw(d,t,fb,tb) for lab in blabels for t in lab),pill_w); bh=bpitch+bi+g(52)+pill_h
    lo_y=y3e+g(72); hi_y=H-int(M*1.6); mid=lo_y+(hi_y-lo_y-bh)//2
    top=next(t for t in sorted(range(lo_y,hi_y-bh+1,g(4)),key=lambda t:abs(t-mid)) if freerow[t:t+bh].min()>=need)
    lh=g(17); lgap=int(lh*0.7); ti=d.textbbox((0,0),"H",font=fb)[1]
    for i,(lab,icon) in enumerate(zip(blabels,bicons)):
        ic=icon(bi); y0=top+i*bpitch; cv.paste(ic,(M,y0),ic); tot=lh*len(lab)+lgap*(len(lab)-1); ty=y0+(bi-tot)/2
        for j,t in enumerate(lab):
            bb=d.textbbox((0,0),t,font=fb); tracked(d,(M+bi+bgap-bb[0],ty+j*(lh+lgap)-ti),t,fb,C,tb)
    pill_y=top+bpitch+bi+g(52); d.rounded_rectangle([M,pill_y,M+pill_w,pill_y+pill_h],radius=pill_h//2,fill=C)
    bc=d.textbbox((0,0),ct,font=fc); ti=d.textbbox((0,0),"H",font=fc)[1]; tracked(d,(M+(pill_w-cw)/2-bc[0],pill_y+(pill_h-g(18))/2-ti),ct,fc,WHITE,tc)
    base=plate(W,H,p,px,py); txt=np.abs(np.asarray(cv.convert("L")).astype(int)-np.asarray(base.convert("L")).astype(int))>40
    hit=int((txt&binary_dilation(sub,iterations=g(clear))).sum())
    print(f"{out}: logo | header {y}-{yhe} | 11.11 {yx}-{yxe} (cap {hx}px) | SAVE UP TO {yk} | 45% {y3}-{y3e} (cap {h3}px, {w3:.0f} wide) | head {head} | detail {top}-{pill_y+pill_h} | type within {clear}px: {hit}")
    cv.save(out,quality=92,optimize=True,progressive=True); return cv
if __name__=="__main__":
    a=sys.argv
    if "--v7" in a:
        build6(a[1],a[2],a[3],k=int(a[4]) if len(a)>4 and not a[4].startswith("--") else 1,head_cap=26,head_font="ZalandoSansExpanded-Bold.ttf",head_trk=0.08,
               hero_font="ZalandoSansExpanded-Medium.ttf",hero_cap=92,hero_trk=0.04,gap_head=72,gap_hero=72,gap_fig=64); sys.exit()
    if "--v6" in a: build6(a[1],a[2],a[3],k=int(a[4]) if len(a)>4 and not a[4].startswith("--") else 1); sys.exit()
    if "--v5" in a: build4(a[1],a[2],a[3],k=int(a[4]) if len(a)>4 and not a[4].startswith("--") else 1,giant=True,tag=False); sys.exit()
    (build4 if "--v4" in a else build3 if "--v3" in a else build2 if "--v2" in a else build)(a[1],a[2],a[3],k=int(a[4]) if len(a)>4 and not a[4].startswith("--") else 1)
