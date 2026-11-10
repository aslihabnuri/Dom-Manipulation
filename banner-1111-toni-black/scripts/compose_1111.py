"""Toni Black 11.11 banner, 1080x1620 (2160x3240 retina).
Tiers: logo (alone, top centre) > 11.11 (dominant) > MADE TO MOVE. TOGETHER. > offer block bottom-left
(SAVE UP TO / 45% / SHOP NOW). All type Dark Charcoal #282828 on the light cyclorama; CTA is a charcoal pill."""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy.ndimage import binary_dilation
from logo import make_logo
import grade as G
F="fonts/static/"; C=(40,40,40); WHITE=(255,255,255)
def font(n,s): return ImageFont.truetype(F+n,int(s))
def tw(d,t,f,trk=0): return sum(d.textlength(ch,font=f) for ch in t)+trk*(len(t)-1)
def tracked(d,xy,t,f,fill,trk=0):
    x,y=xy
    for ch in t: d.text((x,y),ch,font=f,fill=fill); x+=d.textlength(ch,font=f)+trk
def fit(d,t,name,target,trk_em=0.0,lo=8,hi=900):
    while lo<hi:
        m=(lo+hi+1)//2; f=font(name,m)
        if tw(d,t,f,m*trk_em)<=target: lo=m
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
    lo_y=y3e+g(72); hi_y=H-int(M*1.6); best=None
    for sz in range(g(120),g(24),-g(2)):
        fh=font("ZalandoSansExpanded-Bold.ttf",sz); trk=0.04*sz; need=max(max(tw(d,t,fh,trk) for t in lines),pill_w)
        cap=d.textbbox((0,0),"MADE",font=fh); ch=cap[3]-cap[1]; lead=int(ch*1.35); bh=ch+lead*(len(lines)-1)+g(48)+pill_h
        for top in range(lo_y,hi_y-bh+1,g(8)):                         # highest position first: the stack hangs from the number
            if freerow[top:top+bh].min()>=need: best=(fh,trk,ch,lead,top,bh); break
        if best: break
    fh,trk,ch,lead,top,bh=best
    for i,t in enumerate(lines):
        bb=d.textbbox((0,0),t,font=fh); tracked(dfront,(M-bb[0],top+i*lead-bb[1]),t,fh,C,trk)
    pill_y=top+ch+lead*(len(lines)-1)+g(48); dfront.rounded_rectangle([M,pill_y,M+pill_w,pill_y+pill_h],radius=pill_h//2,fill=C+(255,))
    bc=d.textbbox((0,0),ct,font=fc); tracked(dfront,(M+(pill_w-cw)/2-bc[0],pill_y+(pill_h-(bc[3]-bc[1]))/2-bc[1]),ct,fc,WHITE,tc)
    # layers: wall, 45%, figures, front type
    base=cv.copy(); cv.paste(back,(0,0),back)
    fig=Image.new("RGBA",(W,H),(0,0,0,0)); fig.paste(p,(px,py)); m=Image.new("L",(W,H),0); m.paste(a,(px,py)); cv.paste(fig.convert("RGB"),(0,0),m)
    cv.paste(front,(0,0),front)
    hit=int(((np.asarray(front.split()[3])>40)&binary_dilation(sub,iterations=g(clear))).sum())
    print(f"{out}: logo {g(logo_y)}-{g(logo_y)+lg.height} | 11.11 {y}-{y1e} ({f1.size}px) | SAVE UP TO {yk}-{yke} | 45% {y3}-{y3e} ({f3.size}px, {w3:.0f} wide, {covered:.0%} covered by figures) | head {head} | stack {top}-{pill_y+pill_h} ({fh.size}px) | front type within {clear}px: {hit}")
    cv.save(out,quality=92,optimize=True,progressive=True); return cv
if __name__=="__main__":
    a=sys.argv; (build2 if "--v2" in a else build)(a[1],a[2],a[3],k=int(a[4]) if len(a)>4 and a[4]!="--v2" else 1)
