"""Three typographic alternatives for the 11.11 banner (same photo, same copy, guideline fonts, logo centred alone).
A  Symmetric: one centre axis; header, 11.11, SAVE UP TO, 45% clear of the figures; details on the left wall.
B  Big header: MADE TO MOVE. / TOGETHER. as a two-line Black header on one left axis; figures at 66% width.
C  Layered: centre axis; 45% at 88% of the width behind the heads (heads cover at most a quarter of its height)."""
import sys, numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import binary_dilation
from compose_1111 import font, tw, tracked, graded, plate, C, WHITE, TNUM
from logo import make_logo
import badges
BLK="ZalandoSansExpanded-Black.ttf"; BLD="ZalandoSansExpanded-Bold.ttf"; MED="ZalandoSansExpanded-Medium.ttf"; ARB="Arimo-Bold.ttf"
def ink(t,f,trk,feat=None):
    """Exact ink box of tracked text: (dx, dy, w, h) of the ink relative to the drawing origin."""
    im=Image.new("L",(int(f.size*(len(t)+2)),int(f.size*2)),0); tracked(ImageDraw.Draw(im),(f.size//2,f.size//2),t,f,255,trk,feat=feat)
    a=np.asarray(im)>100; ys=np.where(a.any(1))[0]; xs=np.where(a.any(0))[0]
    return xs.min()-f.size//2, ys.min()-f.size//2, xs.max()-xs.min()+1, ys.max()-ys.min()+1
def at_cap(name,c,probe="H",feat=None):
    lo,hi=6,1200
    while lo<hi:
        m=(lo+hi+1)//2
        if ink(probe,font(name,m),0,feat)[3]<=c: lo=m
        else: hi=m-1
    return font(name,lo)
class Page:
    def __init__(s,photo,cutout,k=1,W=1080,H=1620,M=65,photo_w=0.72):
        s.k=k; s.W,s.H,s.M=W*k,H*k,M*k; g=s.g
        src=graded(photo); pw=int(s.W*photo_w); ph=int(src.height*pw/src.width+0.5); s.p=src.resize((pw,ph),Image.LANCZOS)
        s.a=Image.open(cutout).split()[3].resize((pw,ph),Image.LANCZOS); am=np.asarray(s.a)>128
        xs=np.where(am.any(0))[0]; s.px=int(s.W-s.M-xs.max()); s.py=s.H-ph
        s.base=plate(s.W,s.H,s.p,s.px,s.py); s.sub=np.zeros((s.H,s.W),bool); ys0,xs0=np.where(am); yy=ys0+s.py; xx=xs0+s.px; ok=(xx>=0)&(xx<s.W)&(yy>=0); s.sub[yy[ok],xx[ok]]=True
        s.head=np.where(s.sub.any(1))[0].min()
        s.back=Image.new("RGBA",(s.W,s.H),(0,0,0,0)); s.front=Image.new("RGBA",(s.W,s.H),(0,0,0,0)); s.d=ImageDraw.Draw(s.front)
        s.first=np.where(s.sub.any(1),s.sub.argmax(1),s.W)
    def g(s,v): return int(round(v*s.k))
    def text(s,t,f,trk,x,ytop,align="l",layer=None,feat=None):
        dx,dy,w,h=ink(t,f,trk,feat); X={"l":x,"c":(s.W-w)/2,"r":x-w}[align]
        tracked(ImageDraw.Draw(layer or s.front),(X-dx,ytop-dy),t,f,C,trk,feat=feat); return ytop+h,w
    def logo(s,y=56,w=300):
        lg=make_logo(C,8*s.k); lw=s.g(w); lg=lg.resize((lw,int(lg.height*lw/lg.width)),Image.LANCZOS); s.front.paste(lg,((s.W-lw)//2,s.g(y)),lg); return s.g(y)+lg.height
    def free_rows(s,y0,y1,x0,x1,clear):
        m=binary_dilation(s.sub[max(0,y0-clear):y1+clear],iterations=clear) if clear else s.sub[y0:y1]
        return not m[:,int(x0):int(x1)].any()
    def details(s,lo_y,clear=40,badge=68):
        """Badges (Arimo labels) + SHOP NOW on the left margin, centred in the free band below lo_y."""
        g=s.g; M=s.M; bi=g(badge); bgap=g(20); fb=at_cap(ARB,g(17)); tb=0.08*fb.size; bpitch=bi+g(28)
        labs=(("FREE ONGKIR",),("VOUCHER 5K","NEW BUYER")); icons=(badges.truck,badges.ticket)
        fc=at_cap(BLD,g(18)); tc=0.12*fc.size; cw=ink("SHOP NOW",fc,tc)[2]; pill_h=g(66); pill_w=int(cw+g(80))
        need=max(bi+bgap+max(ink(t,fb,tb)[2] for l in labs for t in l),pill_w); bh=bpitch+bi+g(52)+pill_h
        freew=s.first-g(clear)-M; hi_y=s.H-int(M*1.6); mid=lo_y+(hi_y-lo_y-bh)//2
        top=next(t for t in sorted(range(lo_y,hi_y-bh+1,g(4)),key=lambda t:abs(t-mid)) if freew[t:t+bh].min()>=need)
        lh=g(17); lg_=int(lh*0.7)
        for i,(l,icon) in enumerate(zip(labs,icons)):
            ic=icon(bi); y0=top+i*bpitch; s.front.paste(ic,(M,y0),ic); tot=lh*len(l)+lg_*(len(l)-1); ty=y0+(bi-tot)/2
            for j,t in enumerate(l): s.text(t,fb,tb,M+bi+bgap,ty+j*(lh+lg_))
        py=top+bpitch+bi+g(52); s.d.rounded_rectangle([M,py,M+pill_w,py+pill_h],radius=pill_h//2,fill=C+(255,))
        dx,dy,w,h=ink("SHOP NOW",fc,tc); tracked(s.d,(M+(pill_w-w)/2-dx,py+(pill_h-h)/2-dy),"SHOP NOW",fc,WHITE,tc)
    def save(s,out,clear=40):
        cv=s.base.copy(); cv.paste(s.back,(0,0),s.back)
        fig=Image.new("RGB",(s.W,s.H)); fig.paste(s.p,(s.px,s.py)); m=Image.new("L",(s.W,s.H),0); m.paste(s.a,(s.px,s.py)); cv.paste(fig,(0,0),m)
        cv.paste(s.front,(0,0),s.front)
        hit=int(((np.asarray(s.front.split()[3])>40)&binary_dilation(s.sub,iterations=s.g(clear))).sum())
        cv.save(out,quality=92,optimize=True,progressive=True); return cv,hit
def biggest_45(s,y,align,max_w,gap,x=None):
    for sz in range(s.g(600),s.g(60),-s.g(2)):
        f=font(BLK,sz); dx,dy,w,h=ink("45%",f,-0.02*sz)
        if w>max_w: continue
        x0={"c":(s.W-w)/2,"l":x}[align]
        if s.free_rows(y,y+h,x0,x0+w,gap): return f,h,w
    raise SystemExit("no fit")
def alt_A(photo,cut,out,k=1):
    s=Page(photo,cut,k); g=s.g
    y=s.logo()+g(64)
    y,_=s.text("MADE TO MOVE. TOGETHER.",at_cap(BLD,g(26)),0.08*g(26)*1.4,0,y,"c")
    f11=at_cap(MED,g(72),"1",TNUM); y,_=s.text("11.11",f11,0.04*f11.size,0,y+g(64),"c",feat=TNUM)
    y,_=s.text("SAVE UP TO",at_cap(BLD,g(22)),0.16*g(22)*1.4,0,y+g(64),"c")
    f3,h3,w3=biggest_45(s,y+g(22),"c",s.W-2*s.M,g(56)); y3e,_=s.text("45%",f3,-0.02*f3.size,0,y+g(22),"c")
    s.details(y3e+g(72)); cv,hit=s.save(out); print(out,"A 45% cap",h3,"w",w3,"gap to figures",s.head-y3e,"hit",hit)
def alt_B(photo,cut,out,k=1):
    s=Page(photo,cut,k,photo_w=0.66); g=s.g; M=s.M
    y=s.logo()+g(64); fh=at_cap(BLK,g(50)); lead=g(72)
    s.text("MADE TO MOVE.",fh,0.01*fh.size,M,y); y,_=s.text("TOGETHER.",fh,0.01*fh.size,M,y+lead)
    f11=at_cap(MED,g(56),"1",TNUM); y,_=s.text("11.11",f11,0.04*f11.size,M,y+g(64),feat=TNUM)
    y,_=s.text("SAVE UP TO",at_cap(BLD,g(22)),0.16*g(22)*1.4,M,y+g(56))
    f3,h3,w3=biggest_45(s,y+g(22),"l",s.W-2*M,g(56),x=M); y3e,_=s.text("45%",f3,-0.02*f3.size,M,y+g(22))
    s.details(y3e+g(64)); cv,hit=s.save(out); print(out,"B 45% cap",h3,"w",w3,"gap",s.head-y3e,"hit",hit)
def alt_C(photo,cut,out,k=1,overlap=0.20):
    s=Page(photo,cut,k); g=s.g
    f3=font(BLK,10)
    for sz in range(g(700),g(60),-g(2)):
        f3=font(BLK,sz); dx,dy,w3,h3=ink("45%",f3,-0.02*sz)
        if w3<=0.88*s.W: break
    y3=int(s.head+overlap*h3-h3)                                   # heads overlap the lower `overlap` of the number
    fk=at_cap(BLD,g(22)); yk=y3-g(22)-g(22)
    s.text("45%",f3,-0.02*f3.size,0,y3,"c",layer=s.back); s.text("SAVE UP TO",fk,0.16*g(22)*1.4,0,yk,"c")
    # header group centred in the space between the logo and SAVE UP TO, with equal gaps above and below
    fh=at_cap(BLD,g(26)); f11=at_cap(MED,g(80),"1",TNUM); inner=g(56); grp=g(26)+inner+g(80)
    ylogo=s.logo(); gap=(yk-ylogo-grp)//2
    y=ylogo+gap; s.text("MADE TO MOVE. TOGETHER.",fh,0.08*g(26)*1.4,0,y,"c"); s.text("11.11",f11,0.04*f11.size,0,y+g(26)+inner,"c",feat=TNUM)
    num=np.asarray(s.back.split()[3])>128; cov=(num&s.sub).sum()/num.sum()
    s.details(y3+h3+g(56)); cv,hit=s.save(out); print(out,"C 45% cap",h3,"w",w3,"rows overlapped",round((y3+h3-s.head)/h3,2),"area covered",round(cov,3),"outer gap",gap,"hit",hit)
if __name__=="__main__":
    photo,cut,outdir=sys.argv[1:4]; k=int(sys.argv[4]) if len(sys.argv)>4 else 1
    for n,fn in (("A",alt_A),("B",alt_B),("C",alt_C)): fn(photo,cut,f"{outdir}/alt_{n}.jpg",k)
