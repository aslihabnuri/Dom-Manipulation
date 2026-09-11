"""Toni Black Product Value banner (1600x2000). Symmetrical composition on one centre axis:
logo, headline, subline, size run, product photo (untouched), then a six-cell icon row with labels.
Usage: python3 compose_pv.py PHOTO OUT [scale]"""
import sys
from PIL import Image, ImageDraw, ImageFont
from logo import make_logo
import icons
F="fonts/static/"
CHAR=(40,40,40); DAVI=(79,80,82)
def tracked(d,xy,text,f,fill,track=0):
    x,y=xy
    for ch in text:
        d.text((x,y),ch,font=f,fill=fill); x+=d.textlength(ch,font=f)+track
def tracked_w(d,text,f,track=0): return sum(d.textlength(ch,font=f) for ch in text)+track*(len(text)-1)
def build(photo_path,out_path,k=1.0,headline=("BUILT FOR EVERYDAY","PERFORMANCE"),sub="Refined for lasting comfort.",
          sizes=("S","M","L","XL","XXL","XXXL"),head_y=0.135,icon_y=0.775):
    W,H=int(1600*k),int(2000*k); g=lambda v:int(round(v*k))
    def font(name,size): return ImageFont.truetype(F+name,g(size))
    def fit_font(d,text,name,target_w,track=0,lo=40,hi=600):
        while lo<hi:
            mid=(lo+hi+1)//2
            if tracked_w(d,text,ImageFont.truetype(F+name,mid),track)<=target_w: lo=mid
            else: hi=mid-1
        return ImageFont.truetype(F+name,lo)
    canvas=Image.open(photo_path).convert("RGB").resize((W,H),Image.LANCZOS); d=ImageDraw.Draw(canvas); C=W//2
    logo=make_logo(color=CHAR,scale=8); lw=g(300); logo=logo.resize((lw,int(logo.height*lw/logo.width)),Image.LANCZOS)
    canvas.paste(logo,(C-lw//2,g(70)),logo)
    # headline: measure = 76% of width, leading 1.0
    f_h=fit_font(d,headline[0],"ZalandoSansExpanded-Black.ttf",int(W*0.76),track=g(-3))
    y=int(H*head_y); hb=None
    for t in headline:
        hb=d.textbbox((0,0),t,font=f_h); w=tracked_w(d,t,f_h,g(-3)); tracked(d,(C-w//2-hb[0],y-hb[1]),t,f_h,CHAR,track=g(-3)); y+=int((hb[3]-hb[1])*1.0)+g(16)
    # subline group: gap 2x its leading
    f_s=font("Arimo-Regular.ttf",max(30,int((hb[3]-hb[1])/g(1)/5.5))); sb=d.textbbox((0,0),sub,font=f_s); sl=int((sb[3]-sb[1])*1.5)
    y+=sl*2-g(16); d.text((C-d.textlength(sub,font=f_s)/2-sb[0],y-sb[1]),sub,font=f_s,fill=DAVI); y+=sl
    # size run: lead-in in Arimo grey, sizes in Zalando SemiBold charcoal with interpunct separators, tracked
    f_l=f_s; f_z=font("ZalandoSansExpanded-SemiBold.ttf",int(f_s.size/g(1)*0.95)); lead="Available in  "
    run="  ·  ".join(sizes); lw_=d.textlength(lead,font=f_l); rw=tracked_w(d,run,f_z,g(1)); x=C-(lw_+rw)/2
    lb=d.textbbox((0,0),lead,font=f_l); zb=d.textbbox((0,0),run,font=f_z)
    d.text((x-lb[0],y-lb[1]),lead,font=f_l,fill=DAVI); tracked(d,(x+lw_-zb[0],y-zb[1]+(lb[3]-lb[1]-(zb[3]-zb[1]))//2),run,f_z,CHAR,track=g(1))
    # icon row: six equal cells across the measure
    M=g(100); cells=len(icons.ICONS); cw=(W-2*M)/cells; size=g(118); f_i=font("ZalandoSansExpanded-SemiBold.ttf",19)
    iy=int(H*icon_y)
    for i,(label,fn) in enumerate(icons.ICONS):
        cx=int(M+cw*(i+0.5)); ic=fn(size); canvas.paste(ic,(cx-size//2,iy),ic)
        ly=iy+size+g(26)
        for line in label.split("\n"):
            lb=d.textbbox((0,0),line,font=f_i); w=tracked_w(d,line,f_i,g(2)); tracked(d,(cx-w//2-lb[0],ly-lb[1]),line,f_i,CHAR,track=g(2)); ly+=int((lb[3]-lb[1])*1.45)
    canvas.save(out_path,quality=95); return canvas
if __name__=="__main__":
    a=sys.argv; photo,out=a[1],a[2]; k=float(a[3]) if len(a)>3 else 1.0
    im=build(photo,out,k=k); im.resize((640,800),Image.LANCZOS).save(out.rsplit(".",1)[0]+"_preview.jpg",quality=85); print(out,im.size)
