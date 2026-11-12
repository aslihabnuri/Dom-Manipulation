"""'Made For Him and Him' at 1:1 (1080x1080; 2160x2160 retina), the v6 system re-set for a square:
logo and SAVE UP TO centred on top, 25% at 85% W behind the heads (heads cover about a third of its cap),
pair right-aligned on the margin and knee-framed at the bottom edge, left column = headline (two lines, broken by sense) + offer block."""
import sys, numpy as np
from PIL import Image, ImageDraw
sys.path.insert(1,"/home/user/Dom-Manipulation/banner-bau-toni-black/scripts")
from logo import make_logo
from compose_himhim import tracked, tw, cb, font, fit
from compose_himhim3 import offer
from compose_himhim5 import graded
from compose_himhim6 import centred
C282=(40,40,40)
def build(photo,cutout,out,k=1,W=1080,H=1080,M=65,num_frac=0.85,kick=26,cover=0.32,fig_h=1.0,clear=34,lines=("MADE FOR","HIM AND HIM")):   # break by sense, not by width
    g=lambda v:int(round(v*k)); W,H,M=W*k,H*k,M*k
    src=graded(photo); alpha=Image.open(cutout).split()[3]
    a=np.asarray(src)[...,:3]; wall=tuple(int(v) for v in np.percentile(a[:300,:400].reshape(-1,3),80,axis=0))
    cv=Image.new("RGB",(W,H),wall); d=ImageDraw.Draw(cv)
    lg=make_logo(C282,8*k); lw=g(280); lg=lg.resize((lw,int(lg.height*lw/lg.width)),Image.LANCZOS); cv.paste(lg,((W-lw)//2,g(48)),lg); y=g(48)+lg.height+g(40)
    fk=font("ZalandoSansExpanded-Bold.ttf",g(kick)); y=centred(d,W,"SAVE UP TO",fk,y,0.17)+g(22)
    fn=font("ZalandoSansExpanded-Black.ttf",fit(d,"25%","ZalandoSansExpanded-Black.ttf",int(W*num_frac),-0.02,hi=900)); nb=cb(d,"25%",fn); cap=nb[3]-nb[1]
    num_top=y; num_bot=centred(d,W,"25%",fn,y,-0.02)
    # figures: scale so the heads come down `cover` of the cap into the number and the frame ends at the bottom edge (knee crop)
    am=np.asarray(alpha)>128; rows=np.where(am.any(1))[0]; src_head=rows.min()
    head_y=int(num_bot-cover*cap); s=fig_h*(H-head_y)/(src.height-src_head)   # whole lower body from the head down fills to the bottom
    fw,fh=int(src.width*s+0.5),int(src.height*s+0.5); fig=src.resize((fw,fh),Image.LANCZOS); fa=alpha.resize((fw,fh),Image.LANCZOS); fig.putalpha(fa)
    fam=np.asarray(fa)>128; cols=np.where(fam.any(0))[0]; fy=head_y-int(src_head*s); fx=int(W-M-cols.max())
    cv.paste(fig,(fx,fy),fig); d=ImageDraw.Draw(cv)
    sub=np.zeros((H,W),bool); ys,xs=np.where(fam); yy=ys+fy; xx=xs+fx; ok=(yy>=0)&(yy<H)&(xx>=0)&(xx<W); sub[yy[ok],xx[ok]]=True
    pair_left=int(np.where(sub[num_bot:].any(0))[0].min()); strip=pair_left-g(clear)-M
    # left column: offer block at the bottom, headline centred in the space between the number and the offer
    ben=g(22)
    while ben>g(16) and tw(d,"Extra IDR 5K voucher",font("Arimo-Regular.ttf",ben))>strip: ben-=1
    base=H-int(M*0.9); ob,_=offer(d,M,base,ben,int(ben*2.6),ben+1)
    z=min(fit(d,t,"ZalandoSansExpanded-Regular.ttf",strip,0.08,hi=400) for t in lines); fh_=font("ZalandoSansExpanded-Regular.ttf",z); c=cb(d,"H",fh_); ch=c[3]-c[1]; lead=int(ch*1.30)
    blk=ch+lead*(len(lines)-1); top=num_bot+g(56); bot=ob-g(64); hy=int((top+bot)/2-blk/2)
    for t in lines: tracked(d,(M-cb(d,t,fh_)[0],hy-c[1]),t,fh_,C282,z*0.08); hy+=lead
    rows_n=np.where(sub[num_top:num_bot].any(1))[0]; covered=(num_bot-(num_top+rows_n.min())) if len(rows_n) else 0
    print(f"{out}: 25% {num_top}-{num_bot} cap {cap}, heads cover {covered}px = {covered/cap:.0%} | pair x {pair_left}-{fx+cols.max()} | strip {strip} | headline {z}px x{len(lines)} {top}-{bot} | offer {ob}-{base} ben {ben}")
    cv.save(out,quality=92,optimize=True,progressive=True); return cv

def build_big(photo,cutout,out,k=1,W=1080,H=1080,M=65,head_top=140,hem_src=2280,below_hem=44,clear=34):
    """Square with the pair at full height (head just under the logo band, boy's boxer hem near the bottom edge),
    right-aligned on the margin; all type in the left column: SAVE UP TO / 25% (largest that fits the free wall) /
    MADE FOR / HIM AND HIM / offer block."""
    g=lambda v:int(round(v*k)); W,H,M=W*k,H*k,M*k
    src=graded(photo); alpha=Image.open(cutout).split()[3]
    a=np.asarray(src)[...,:3]; wall=tuple(int(v) for v in np.percentile(a[:300,:400].reshape(-1,3),80,axis=0))
    cv=Image.new("RGB",(W,H),wall)
    am=np.asarray(alpha)>128; src_head=np.where(am.any(1))[0].min()
    s=(H-g(below_hem)-g(head_top))/(hem_src-src_head); fw,fh=int(src.width*s+0.5),int(src.height*s+0.5)
    fig=src.resize((fw,fh),Image.LANCZOS); fa=alpha.resize((fw,fh),Image.LANCZOS); fig.putalpha(fa); fam=np.asarray(fa)>128
    cols=np.where(fam.any(0))[0]; fx=int(W-M-cols.max()); fy=g(head_top)-int(src_head*s); cv.paste(fig,(fx,fy),fig); d=ImageDraw.Draw(cv)
    sub=np.zeros((H,W),bool); ys,xs=np.where(fam); yy=ys+fy; xx=xs+fx; ok=(yy>=0)&(yy<H)&(xx>=0)&(xx<W); sub[yy[ok],xx[ok]]=True
    first=np.where(sub.any(1),sub.argmax(1),W); free=first-g(clear)-M
    lg=make_logo(C282,8*k); lw=g(280); lg=lg.resize((lw,int(lg.height*lw/lg.width)),Image.LANCZOS)
    lx=(W-lw)//2; assert not sub[g(48):g(48)+lg.height,lx:lx+lw].any(), "logo touches the figures"
    cv.paste(lg,(lx,g(48)),lg)
    # left column
    fk=font("ZalandoSansExpanded-Bold.ttf",g(26)); kb=cb(d,"SAVE UP TO",fk); yk=g(48)+lg.height+g(64)
    tracked(d,(M-kb[0],yk-kb[1]),"SAVE UP TO",fk,C282,g(26)*0.17); y3=yk+(kb[3]-kb[1])+g(22)
    for sz in range(g(500),g(40),-g(2)):
        fn=font("ZalandoSansExpanded-Black.ttf",sz); nb=cb(d,"25%",fn); w=tw(d,"25%",fn,-0.02*sz); h=nb[3]-nb[1]
        if free[y3:y3+h].min()>=w: break
    tracked(d,(M-nb[0],y3-nb[1]),"25%",fn,C282,-0.02*sz); y3e=y3+h
    ben=g(22); base=H-int(M*0.9); ob,_=offer(d,M,base,ben,int(ben*2.6),ben+1)
    lines=("MADE FOR","HIM AND HIM"); top=y3e+g(64); bot=ob-g(64); strip=int(free[top:bot].min())
    z=min(fit(d,t,"ZalandoSansExpanded-Regular.ttf",strip,0.08,hi=400) for t in lines); fh_=font("ZalandoSansExpanded-Regular.ttf",z); c=cb(d,"H",fh_); ch=c[3]-c[1]; lead=int(ch*1.30)
    hy=int((top+bot)/2-(ch+lead)/2)
    for t in lines: tracked(d,(M-cb(d,t,fh_)[0],hy-c[1]),t,fh_,C282,z*0.08); hy+=lead
    pair=np.where(sub.any(0))[0]
    print(f"{out}: pair {pair.min()}-{pair.max()} ({(pair.max()-pair.min())/W:.0%} W), {H-g(head_top)}px tall | 25% cap {h} w {w:.0f} at {y3}-{y3e} | headline {z}px | offer {ob}-{base}")
    cv.save(out,quality=92,optimize=True,progressive=True); return cv

if __name__=="__main__":
    a=sys.argv; (build_big if "--big" in a else build)(a[1],a[2],a[3],k=int(a[4]) if len(a)>4 and not a[4].startswith("--") else 1)
