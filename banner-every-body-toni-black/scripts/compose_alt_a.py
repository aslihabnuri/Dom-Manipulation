import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from logo import make_logo
import icons
F="fonts/static/"
BG=(40,40,40); WHITE=(255,255,255); STEEL=(204,204,204)
GUT=[(0,676),(700,1364),(1387,2052),(2075,2751)]
def tracked(d,xy,text,f,fill,track=0):
    x,y=xy
    for ch in text: d.text((x,y),ch,font=f,fill=fill); x+=d.textlength(ch,font=f)+track
def tracked_w(d,text,f,track=0): return sum(d.textlength(ch,font=f) for ch in text)+track*(len(text)-1)
def invert_icon(im):
    a=np.asarray(im).astype(int); rgb=a[...,:3]; dark=rgb.sum(-1)<300
    out=a.copy(); out[...,:3][dark]=255; out[...,:3][~dark]=40; return Image.fromarray(out.astype(np.uint8))
def build(photo_path,out_path,k=1.0,head_y=0.075,panel_y=0.27,headroom=150,gutter=10,run_gap=90,icon_gap=120,
          headline=("MADE FOR","EVERY BODY."),sub="One fit for every shape. Sizes S to XXXL.",sizes=("S","M","L","XL","XXL","XXXL")):
    W,H=int(1600*k),int(2400*k); g=lambda v:int(round(v*k))
    def font(name,size): return ImageFont.truetype(F+name,g(size))
    def fit_font(d,text,name,target_w,track=0,lo=40,hi=700):
        while lo<hi:
            mid=(lo+hi+1)//2
            if tracked_w(d,text,ImageFont.truetype(F+name,mid),track)<=target_w: lo=mid
            else: hi=mid-1
        return ImageFont.truetype(F+name,lo)
    canvas=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(canvas); C=W//2
    logo=make_logo(color=WHITE,scale=8); lw=g(300); logo=logo.resize((lw,int(logo.height*lw/logo.width)),Image.LANCZOS); canvas.paste(logo,(C-lw//2,g(64)),logo)
    f_h=fit_font(d,headline[1],"ZalandoSansExpanded-Black.ttf",int(W*0.70),track=g(-3)); y=int(H*head_y); hb=None
    for t in headline:
        hb=d.textbbox((0,0),t,font=f_h); w=tracked_w(d,t,f_h,g(-3)); tracked(d,(C-w//2-hb[0],y-hb[1]),t,f_h,WHITE,track=g(-3)); y+=int((hb[3]-hb[1])*1.0)+g(14)
    f_s=font("Arimo-Regular.ttf",max(30,int((hb[3]-hb[1])/g(1)/5.5))); sb=d.textbbox((0,0),sub,font=f_s); sl=int((sb[3]-sb[1])*1.5)
    y+=sl*2-g(14); d.text((C-d.textlength(sub,font=f_s)/2-sb[0],y-sb[1]),sub,font=f_s,fill=STEEL)
    # panels: full bleed, gutters of background
    src=Image.open(photo_path).convert("RGB"); G=g(gutter); pw=(W-3*G)//4; py=int(H*panel_y); HR=g(headroom)
    for i,(x0,x1) in enumerate(GUT):
        p=src.crop((x0,0,x1,src.height)); ph=int(p.height*pw/p.width+0.5); p=p.resize((pw,ph),Image.LANCZOS)
        top=p.crop((0,0,pw,g(30))).resize((pw,HR+g(80)),Image.BILINEAR).filter(ImageFilter.GaussianBlur(g(8)))
        cell=Image.new("RGB",(pw,ph+HR),BG); cell.paste(top,(0,0))
        mask=Image.new("L",(pw,ph),255); md=ImageDraw.Draw(mask); fe=g(80)
        for j in range(fe): md.line([(0,j),(pw,j)],fill=int(255*j/fe))
        cell.paste(p,(0,HR),mask)
        px=i*(pw+G) if i<3 else W-pw
        canvas.paste(cell,(px,py))
    pbot=py+ph+HR
    # size run
    M=g(100); f_z=font("ZalandoSansExpanded-SemiBold.ttf",34); n=len(sizes); cw=(W-2*M)/n; ry=pbot+g(run_gap)
    for i,sz in enumerate(sizes):
        zb=d.textbbox((0,0),sz,font=f_z); w=tracked_w(d,sz,f_z,g(3)); cx=int(M+cw*(i+0.5)); tracked(d,(cx-w//2-zb[0],ry-zb[1]),sz,f_z,WHITE,track=g(3))
    # icons
    size=g(112); f_i=font("ZalandoSansExpanded-SemiBold.ttf",18); iy=ry+g(icon_gap)
    for i,(label,fn) in enumerate(icons.ICONS):
        ic=invert_icon(fn(size)); cx=int(M+cw*(i+0.5)); canvas.paste(ic,(cx-size//2,iy),ic); ly=iy+size+g(22)
        for line in label.split("\n"):
            lb=d.textbbox((0,0),line,font=f_i); w=tracked_w(d,line,f_i,g(2)); tracked(d,(cx-w//2-lb[0],ly-lb[1]),line,f_i,WHITE,track=g(2)); ly+=int((lb[3]-lb[1])*1.45)
    print("panels",py,pbot,"run",ry,"icons",iy,"labels end",ly,"of",H)
    canvas.save(out_path); return canvas
if __name__=="__main__":
    a=sys.argv; build(a[1],a[2],*(float(v) for v in a[3:]))
