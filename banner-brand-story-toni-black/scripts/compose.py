"""Toni Black Brand Story banner (4:5, 1600x2000 base). Logo centred on top (masthead, as in the BAU banner).
Headline stack on the left wall: TAILORED FOR / COMFORT. with the subline beneath, left-aligned to one axis.
Sizes derive from the column width; gaps derive from the leading (proximity rule).
Usage: python3 compose_story.py PHOTO OUT [scale] [col_frac] [head_y] [cutout|-]"""
import sys
from PIL import Image, ImageDraw, ImageFont
from logo import make_logo
F="fonts/static/"
CHAR=(40,40,40); DAVI=(79,80,82)
def tracked(d,xy,text,f,fill,track=0):
    x,y=xy
    for ch in text:
        d.text((x,y),ch,font=f,fill=fill); x+=d.textlength(ch,font=f)+track
def tracked_w(d,text,f,track=0): return sum(d.textlength(ch,font=f) for ch in text)+track*(len(text)-1)
def build(photo_path,out_path,k=1.0,col_frac=0.52,head_y=0.40,cutout=None,
          headline=("TAILORED FOR","COMFORT."),sub=("Defined by originality, driven by innovation.","Every detail is created with purpose.")):
    W,H=int(1600*k),int(2000*k); g=lambda v:int(round(v*k))
    def font(name,size): return ImageFont.truetype(F+name,g(size))
    def fit_font(d,text,name,target_w,track=0,lo=40,hi=900):
        while lo<hi:
            mid=(lo+hi+1)//2
            if tracked_w(d,text,ImageFont.truetype(F+name,mid),track)<=target_w: lo=mid
            else: hi=mid-1
        return ImageFont.truetype(F+name,lo)
    src=Image.open(photo_path).convert("RGB")
    s=max(W/src.width,H/src.height); src=src.resize((int(src.width*s+0.5),int(src.height*s+0.5)),Image.LANCZOS)
    ox=(src.width-W)//2; oy=(src.height-H)//2; canvas=src.crop((ox,oy,ox+W,oy+H)); d=ImageDraw.Draw(canvas)
    M=g(100); L=M; colw=int(W*col_frac)-M
    # headline: size from the column width (longest line), tight leading 0.95
    f_h=fit_font(d,headline[0],"ZalandoSansExpanded-Black.ttf",colw,track=g(-4))
    y=int(H*head_y); hb=None
    for t in headline:
        hb=d.textbbox((0,0),t,font=f_h); tracked(d,(L-hb[0],y-hb[1]),t,f_h,CHAR,track=g(-4)); lead=int((hb[3]-hb[1])*1.0); y+=lead+g(18)
    # subline: gap = 2x its own leading (separate group, same axis); size ~ 1/6 of headline cap height, min 30
    f_s=font("Arimo-Regular.ttf",max(30,int((hb[3]-hb[1])/g(1)/6.0)))
    sb=d.textbbox((0,0),sub[0],font=f_s); sl=int((sb[3]-sb[1])*1.5)
    y+=sl*2-g(18)
    for t in sub:
        sb=d.textbbox((0,0),t,font=f_s); d.text((L-sb[0],y-sb[1]),t,font=f_s,fill=DAVI); y+=sl
    if cutout:
        cu=Image.open(cutout).convert("RGBA").resize(src.size,Image.LANCZOS).crop((ox,oy,ox+W,oy+H)); canvas.paste(cu,(0,0),cu); d=ImageDraw.Draw(canvas)
    logo=make_logo(color=CHAR,scale=8); lw=g(300); logo=logo.resize((lw,int(logo.height*lw/logo.width)),Image.LANCZOS)
    canvas.paste(logo,((W-lw)//2,g(80)),logo)
    canvas.save(out_path,quality=95); return canvas
if __name__=="__main__":
    a=sys.argv; photo,out=a[1],a[2]; k=float(a[3]) if len(a)>3 else 1.0; cf=float(a[4]) if len(a)>4 else 0.52; hy=float(a[5]) if len(a)>5 else 0.40
    cut=a[6] if len(a)>6 and a[6]!="-" else None
    im=build(photo,out,k=k,col_frac=cf,head_y=hy,cutout=cut); im.resize((640,800),Image.LANCZOS).save(out.rsplit(".",1)[0]+"_preview.jpg",quality=85); print(out,im.size)
