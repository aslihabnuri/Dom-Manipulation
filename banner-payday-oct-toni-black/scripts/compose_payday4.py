"""Payday Oct banner, offer at sale-banner scale. Left axis = headline left edge, right axis = headline right edge.
Row: SAVE UP TO (left) and the dates (right-aligned on the right axis) share one last baseline.
Below: the percentage, the largest size that keeps 25 px from the model. Then SHOP NOW."""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.ndimage import binary_dilation
from logo import make_logo
F="fonts/static/"; C282=(40,40,40); C81=(129,130,132)
def tracked(d,xy,t,f,fill,track=0):
    x,y=xy
    for ch in t: d.text((x,y),ch,font=f,fill=fill); x+=d.textlength(ch,font=f)+track
def tw(d,t,f,track=0): return sum(d.textlength(ch,font=f) for ch in t)+track*(len(t)-1)
def cb(d,t,f): return d.textbbox((0,0),t,font=f)
def build(photo,out,k=1.0,pct="35",date_lines=("25 – 31","OCTOBER"),head_y=0.255,head_x=0.14,head_w=600,clear=25,kick_ratio=0.62):
    W,H=int(1334*k),int(2000*k); g=lambda v:int(round(v*k))
    src=Image.open(photo).convert("RGB"); s=max(W/src.width,H/src.height)
    src=src.resize((int(src.width*s+0.5),int(src.height*s+0.5)),Image.LANCZOS)
    ox=(src.width-W)//2; oy=(src.height-H)//2; cv=src.crop((ox,oy,ox+W,oy+H)); d=ImageDraw.Draw(cv)
    L=np.asarray(cv.convert("L")).astype(int); bg=np.median(L[g(300):g(400),g(100):g(600)])
    subj=binary_dilation((L<bg-25)|(L>bg+12),iterations=g(clear)); subj[:g(470)]=False  # the wall above the head is empty
    font=lambda n,z: ImageFont.truetype(F+n,int(z))
    # logo
    lw=g(300); lg=make_logo(C282,8); lg=lg.resize((lw,int(lg.height*lw/lg.width)),Image.LANCZOS); cv.paste(lg,((W-lw)//2,g(80)),lg)
    # headline
    lines=("PAYDAY.","SPEND IT WELL."); x0=int(W*head_x); lo,hi=10,300
    while lo<hi:
        m=(lo+hi+1)//2; f=font("ZalandoSansExpanded-Regular.ttf",g(m))
        if tw(d,lines[1],f,int(g(m)*0.12))<=g(head_w): lo=m
        else: hi=m-1
    f_h=font("ZalandoSansExpanded-Regular.ttf",g(lo)); trh=int(g(lo)*0.12); hc=cb(d,"H",f_h); ch=hc[3]-hc[1]; y=int(H*head_y)
    for t in lines: tracked(d,(x0-cb(d,t,f_h)[0],y-hc[1]),t,f_h,C282,trh); y+=int(ch*1.55)
    xr=int(x0+tw(d,lines[1],f_h,trh)); y_row=y-int(ch*1.55)+ch+int(ch*1.15)
    # dates: a small dateline above the headline on the left axis, in the empty wall
    f_l=font("ZalandoSansExpanded-SemiBold.ttf",g(24)); trl=g(3); lc=cb(d,"H",f_l); lh=lc[3]-lc[1]; lead=int(lh*1.7)
    yd=int(H*head_y)-int(ch*1.4)-(lead*(len(date_lines)-1)+lh)
    for t in date_lines:
        tracked(d,(x0-cb(d,t,f_l)[0],yd-lc[1]),t,f_l,C282,trl); yd+=lead
    # kicker row directly under the headline
    zk_probe=None
    base=y_row+g(58)
    # percentage: largest size that clears the model
    num=f"{pct}%"; ytop=base+g(30)
    def fits(z):
        fn=font("ZalandoSansExpanded-SemiBold.ttf",z); nb=cb(d,num,fn); m=Image.new("L",(W,H),0); md=ImageDraw.Draw(m)
        tracked(md,(x0-nb[0],ytop-cb(d,"3",fn)[1]),num,fn,255,g(-2))
        return not (np.asarray(m)>0)[subj].any()
    lo,hi=g(40),g(400)
    while lo<hi:
        mid=(lo+hi+1)//2
        if fits(mid): lo=mid
        else: hi=mid-1
    fn=font("ZalandoSansExpanded-SemiBold.ttf",lo); nc=cb(d,"3",fn); nh=nc[3]-nc[1]; nw=tw(d,num,fn,g(-2))
    # kicker SAVE UP TO, sized to a share of the numeral width, sitting on the dates' last baseline
    zk=g(20)
    while tw(d,"SAVE UP TO",font("ZalandoSansExpanded-SemiBold.ttf",zk+1),g(4))<=nw*kick_ratio: zk+=1
    f_k=font("ZalandoSansExpanded-SemiBold.ttf",zk); kc=cb(d,"H",f_k)
    tracked(d,(x0-cb(d,"SAVE UP TO",f_k)[0],base-kc[3]),"SAVE UP TO",f_k,C282,g(4))
    kick_end=x0+tw(d,"SAVE UP TO",f_k,g(4)); date_start=x0
    # numeral and asterisk
    nb=cb(d,num,fn); tracked(d,(x0-nb[0],ytop-nc[1]),num,fn,C282,g(-2))
    f_a=font("ZalandoSansExpanded-SemiBold.ttf",int(lo*0.24)); ab=cb(d,"*",f_a)
    d.text((x0+nw+g(6)-ab[0],ytop-ab[1]),"*",font=f_a,fill=C282)
    # SHOP NOW
    f_s=font("ZalandoSansExpanded-SemiBold.ttf",g(24)); sc=cb(d,"H",f_s); ys=ytop+nh+g(56); t="SHOP NOW"; w=tw(d,t,f_s,g(3))
    tracked(d,(x0-cb(d,t,f_s)[0],ys-sc[1]),t,f_s,C282,g(3)); uy=ys+(sc[3]-sc[1])+g(10); d.rectangle([x0,uy,x0+int(w),uy+max(1,g(1.5))-1],fill=C282)
    # bottom line and terms
    f_b=font("ZalandoSansExpanded-SemiBold.ttf",g(22)); t="TAILORED FOR COMFORT, DEFINED BY ORIGINALITY"; bc=cb(d,"H",f_b); w=tw(d,t,f_b,g(4)); yb=int(H*0.938)
    tracked(d,((W-w)//2-cb(d,t,f_b)[0],yb-bc[1]),t,f_b,C282,g(4))
    f_t=font("Arimo-Regular.ttf",g(16)); t="*Terms & conditions apply"; tb=d.textbbox((0,0),t,font=f_t)
    d.text(((W-(tb[2]-tb[0]))//2-tb[0],yb+(bc[3]-bc[1])+g(22)-tb[1]),t,font=f_t,fill=C81)
    print(f"headline {lo and ch}cap | numeral size {lo}px cap {nh} width {int(nw)} ({nw/W:.2f} W) | kicker {zk}px ends {int(kick_end)} | dates start {int(date_start)} | shop y {ys}")
    cv.save(out); return cv
if __name__=="__main__":
    build(sys.argv[1],sys.argv[2])
