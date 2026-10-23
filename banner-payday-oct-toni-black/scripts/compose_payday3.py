"""Toni Black Payday banner, editorial layout after the reference: 1334x2000.
Bracketed copy is never printed: pass pct / date_lines only once confirmed."""
import sys
from PIL import Image, ImageDraw, ImageFont
from logo import make_logo
F="fonts/static/"
C282=(40,40,40); C4F=(79,80,82); C81=(129,130,132)
def tracked(d,xy,t,f,fill,track=0):
    x,y=xy
    for ch in t: d.text((x,y),ch,font=f,fill=fill); x+=d.textlength(ch,font=f)+track
def tw(d,t,f,track=0): return sum(d.textlength(ch,font=f) for ch in t)+track*(len(t)-1)
def capbox(d,t,f): b=d.textbbox((0,0),t,font=f); return b
def build(photo,out,k=1.0,pct=None,date_lines=None,corners=None,pct_max=110,head_y=0.255,head_x=0.14,head_w=600,col2_x=0.35):
    W,H=int(1334*k),int(2000*k); g=lambda v:int(round(v*k))
    src=Image.open(photo).convert("RGB"); s=max(W/src.width,H/src.height)
    src=src.resize((int(src.width*s+0.5),int(src.height*s+0.5)),Image.LANCZOS)
    ox=(src.width-W)//2; oy=(src.height-H)//2; cv=src.crop((ox,oy,ox+W,oy+H)); d=ImageDraw.Draw(cv)
    font=lambda n,z: ImageFont.truetype(F+n,g(z))
    M=g(80)
    # logo, top centre, #282828, no box
    lw=g(300); lg=make_logo(C282,8); lg=lg.resize((lw,int(lg.height*lw/lg.width)),Image.LANCZOS)
    ly=g(80); cv.paste(lg,((W-lw)//2,ly),lg); lc=ly+lg.height//2
    # corner labels, level with the logo centre
    f_c=font("ZalandoSansExpanded-SemiBold.ttf",22); trc=g(3)
    for t,al in (corners or ()):
        b=capbox(d,t,f_c); w=tw(d,t,f_c,trc); x=M if al=="l" else W-M-w
        tracked(d,(x-b[0],lc-(b[3]-b[1])//2-b[1]),t,f_c,C4F,trc)
    # headline: Regular, wide tracking, fitted to head_w
    lines=("PAYDAY.","SPEND IT WELL."); x0=int(W*head_x)
    lo,hi=20,200
    while lo<hi:
        m=(lo+hi+1)//2; f=ImageFont.truetype(F+"ZalandoSansExpanded-Regular.ttf",g(m))
        if tw(d,lines[1],f,int(g(m)*0.12))<=g(head_w): lo=m
        else: hi=m-1
    f_h=ImageFont.truetype(F+"ZalandoSansExpanded-Regular.ttf",g(lo)); trh=int(g(lo)*0.12)
    cap=capbox(d,"H",f_h); ch=cap[3]-cap[1]; y=int(H*head_y)
    for t in lines:
        tracked(d,(x0-capbox(d,t,f_h)[0],y-cap[1]),t,f_h,C282,trh); y+=int(ch*1.55)
    y_lab=y-int(ch*1.55)+ch+int(ch*0.9)
    # two label columns under the headline
    f_l=font("ZalandoSansExpanded-SemiBold.ttf",24); trl=g(2); lcap=capbox(d,"H",f_l); lh=lcap[3]-lcap[1]; lead=int(lh*1.7)
    xs=[x0,int(W*col2_x)]
    # left column: SAVE UP TO, then the percentage as a large numeral fitted to the column width; asterisk as a small superscript
    tracked(d,(xs[0]-capbox(d,"SAVE UP TO",f_l)[0],y_lab-lcap[1]),"SAVE UP TO",f_l,C282,trl)
    yend=y_lab+lh
    if pct:
        num=f"{pct}%"; lo2,hi2=24,300
        while lo2<hi2:
            m=(lo2+hi2+1)//2; fn=ImageFont.truetype(F+"ZalandoSansExpanded-SemiBold.ttf",g(m))
            if tw(d,num,fn,g(1))+tw(d,"*",f_l)+g(4)<=xs[1]-xs[0]-g(44) and m<=pct_max: lo2=m
            else: hi2=m-1
        fn=ImageFont.truetype(F+"ZalandoSansExpanded-SemiBold.ttf",g(lo2)); nc=capbox(d,"8",fn); nh=nc[3]-nc[1]
        yn=y_lab+lh+int(lh*0.9); tracked(d,(xs[0]-capbox(d,num,fn)[0],yn-nc[1]),num,fn,C282,g(1))
        xa=xs[0]+tw(d,num,fn,g(1))+g(4); sb=capbox(d,"*",f_l); d.text((xa-sb[0],yn-sb[1]),"*",font=f_l,fill=C282)
        yend=yn+nh; print("pct size",lo2)
    if date_lines:
        yy=y_lab
        for t in date_lines: tracked(d,(xs[1]-capbox(d,t,f_l)[0],yy-lcap[1]),t,f_l,C282,trl); yy+=lead
        yend=max(yend,yy-lead+lh)
    y_shop=yend+int(lh*1.8)
    f_s=font("ZalandoSansExpanded-SemiBold.ttf",22); trs=g(3); sc=capbox(d,"H",f_s); sh=sc[3]-sc[1]
    t="SHOP NOW"; w=tw(d,t,f_s,trs); tracked(d,(x0-capbox(d,t,f_s)[0],y_shop-sc[1]),t,f_s,C282,trs)
    uy=y_shop+sh+g(9); d.rectangle([x0,uy,x0+int(w),uy+max(1,g(1.5))-1],fill=C282)
    # bottom line and terms
    f_b=font("ZalandoSansExpanded-SemiBold.ttf",22); trb=g(4); t="TAILORED FOR COMFORT, DEFINED BY ORIGINALITY"
    bc=capbox(d,"H",f_b); w=tw(d,t,f_b,trb); yb=int(H*0.938)
    tracked(d,((W-w)//2-capbox(d,t,f_b)[0],yb-bc[1]),t,f_b,C282,trb)
    f_t=font("Arimo-Regular.ttf",16); t="*Terms & conditions apply"; tb=d.textbbox((0,0),t,font=f_t)
    d.text(((W-(tb[2]-tb[0]))//2-tb[0],yb+(bc[3]-bc[1])+g(22)-tb[1]),t,font=f_t,fill=C81)
    print("headline size",lo,"head right edge",x0+tw(d,lines[1],f_h,trh),"labels y",y_lab,"shop y",y_shop)
    cv.save(out); return cv
if __name__=="__main__":
    build(sys.argv[1],sys.argv[2])
