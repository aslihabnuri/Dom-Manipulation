"""Toni Black 'Made for Every Body' banner (1600x2000). Centre axis throughout (symmetrical lineup):
logo, headline, subline on the wall above the group; size run as a scale under the feet; six-cell icon row below.
Usage: python3 compose_every.py PHOTO OUT [scale] [head_y] [run_y] [icon_y]"""
import sys
from PIL import Image, ImageDraw, ImageFont
from logo import make_logo
import icons
F="fonts/static/"
CHAR=(255,255,255); DAVI=(204,204,204)
from compose_alt_a import invert_icon
def tracked(d,xy,text,f,fill,track=0):
    x,y=xy
    for ch in text:
        d.text((x,y),ch,font=f,fill=fill); x+=d.textlength(ch,font=f)+track
def tracked_w(d,text,f,track=0): return sum(d.textlength(ch,font=f) for ch in text)+track*(len(text)-1)
def build(photo_path,out_path,k=1.0,head_y=0.075,run_y=0.80,icon_y=0.855,ext_top=150,ext_bot=263,
          headline=("MADE FOR","EVERY BODY."),sub="One fit for every shape. Sizes S to XXXL.",sizes=("S","M","L","XL","XXL","XXXL")):
    W,H=int(1600*k),int(2400*k); g=lambda v:int(round(v*k))
    def font(name,size): return ImageFont.truetype(F+name,g(size))
    def fit_font(d,text,name,target_w,track=0,lo=40,hi=700):
        while lo<hi:
            mid=(lo+hi+1)//2
            if tracked_w(d,text,ImageFont.truetype(F+name,mid),track)<=target_w: lo=mid
            else: hi=mid-1
        return ImageFont.truetype(F+name,lo)
    from PIL import ImageFilter
    src=Image.open(photo_path).convert("RGB"); src=src.resize((W,int(src.height*W/src.width+0.5)),Image.LANCZOS)
    ET,EB=g(ext_top),g(ext_bot); PH=H-ET-EB
    if src.height>PH: oy=(src.height-PH)//2; src=src.crop((0,oy,W,oy+PH))
    canvas=Image.new("RGB",(W,H),(40,40,40))
    top=src.crop((0,0,W,g(40))).resize((W,ET+g(100)),Image.BILINEAR).filter(ImageFilter.GaussianBlur(g(10))); canvas.paste(top,(0,0))
    bot=src.crop((0,src.height-g(40),W,src.height)).resize((W,EB+g(100)),Image.BILINEAR).filter(ImageFilter.GaussianBlur(g(10))); canvas.paste(bot,(0,H-EB-g(100)))
    mask=Image.new("L",(W,src.height),255); md=ImageDraw.Draw(mask); fe=g(100)
    for i in range(fe): md.line([(0,i),(W,i)],fill=int(255*i/fe)); md.line([(0,src.height-1-i),(W,src.height-1-i)],fill=int(255*i/fe))
    canvas.paste(src,(0,ET),mask); d=ImageDraw.Draw(canvas); C=W//2
    logo=make_logo(color=CHAR,scale=8); lw=g(300); logo=logo.resize((lw,int(logo.height*lw/logo.width)),Image.LANCZOS); canvas.paste(logo,(C-lw//2,g(64)),logo)
    f_h=fit_font(d,headline[1],"ZalandoSansExpanded-Black.ttf",int(W*0.70),track=g(-3)); y=int(H*head_y); hb=None
    for t in headline:
        hb=d.textbbox((0,0),t,font=f_h); w=tracked_w(d,t,f_h,g(-3)); tracked(d,(C-w//2-hb[0],y-hb[1]),t,f_h,CHAR,track=g(-3)); y+=int((hb[3]-hb[1])*1.0)+g(14)
    f_s=font("Arimo-Regular.ttf",max(30,int((hb[3]-hb[1])/g(1)/5.5))); sb=d.textbbox((0,0),sub,font=f_s); sl=int((sb[3]-sb[1])*1.5)
    y+=sl*2-g(14); d.text((C-d.textlength(sub,font=f_s)/2-sb[0],y-sb[1]),sub,font=f_s,fill=DAVI)
    # size run as a scale across the measure: six sizes spaced evenly, Zalando SemiBold, tracked
    M=g(100); f_z=font("ZalandoSansExpanded-SemiBold.ttf",34); n=len(sizes); cw=(W-2*M)/n; ry=int(H*run_y)
    for i,sz in enumerate(sizes):
        zb=d.textbbox((0,0),sz,font=f_z); w=tracked_w(d,sz,f_z,g(3)); cx=int(M+cw*(i+0.5)); tracked(d,(cx-w//2-zb[0],ry-zb[1]),sz,f_z,CHAR,track=g(3))
    # icon row
    size=g(112); f_i=font("ZalandoSansExpanded-SemiBold.ttf",18); iy=int(H*icon_y)
    for i,(label,fn) in enumerate(icons.ICONS):
        cx=int(M+cw*(i+0.5)); ic=invert_icon(fn(size)); canvas.paste(ic,(cx-size//2,iy),ic); ly=iy+size+g(22)
        for line in label.split("\n"):
            lb=d.textbbox((0,0),line,font=f_i); w=tracked_w(d,line,f_i,g(2)); tracked(d,(cx-w//2-lb[0],ly-lb[1]),line,f_i,CHAR,track=g(2)); ly+=int((lb[3]-lb[1])*1.45)
    canvas.save(out_path,quality=95); return canvas
if __name__=="__main__":
    a=sys.argv; photo,out=a[1],a[2]; k=float(a[3]) if len(a)>3 else 1.0
    hy=float(a[4]) if len(a)>4 else 0.105; ry=float(a[5]) if len(a)>5 else 0.815; iy=float(a[6]) if len(a)>6 else 0.875
    im=build(photo,out,k=k,head_y=hy,run_y=ry,icon_y=iy); im.resize((640,960),Image.LANCZOS).save(out.rsplit(".",1)[0]+"_preview.jpg",quality=85); print(out,im.size)
