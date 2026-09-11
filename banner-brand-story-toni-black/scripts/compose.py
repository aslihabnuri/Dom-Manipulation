"""Toni Black Brand Story banner (4:5). Knockout headline like the original: centred headline runs across the
figure; charcoal on the wall, white wherever it overlaps the subject (via the cutout mask). Logo top-left.
Usage: python3 compose_story2.py PHOTO CUTOUT OUT [scale] [head_y] [width_frac]"""
import sys
from PIL import Image, ImageDraw, ImageFont
from logo import make_logo
F="fonts/static/"
CHAR=(40,40,40); WHITE=(255,255,255); DAVI=(79,80,82); LIGHT=(230,230,230)
def tracked(d,xy,text,f,fill,track=0):
    x,y=xy
    for ch in text:
        d.text((x,y),ch,font=f,fill=fill); x+=d.textlength(ch,font=f)+track
def tracked_w(d,text,f,track=0): return sum(d.textlength(ch,font=f) for ch in text)+track*(len(text)-1)
def build(photo_path,cutout_path,out_path,k=1.0,head_y=0.47,width_frac=0.86,
          headline=("TAILORED FOR","COMFORT."),sub_scale=0.40,sub_measure=0.36,sub_lum=150,sub_lines=("Defined by originality,","driven by innovation.","Every detail is","created with purpose."),sub=("Defined by Originality, Driven by Innovation.","Every Detail is Created With Purpose.")):
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
    ox=(src.width-W)//2; oy=(src.height-H)//2; canvas=src.crop((ox,oy,ox+W,oy+H))
    alpha=Image.open(cutout_path).convert("RGBA").resize(src.size,Image.LANCZOS).crop((ox,oy,ox+W,oy+H)).split()[3]
    # draw the type twice: dark layer, then white layer masked by the subject
    dark=Image.new("RGBA",(W,H),(0,0,0,0)); light=Image.new("RGBA",(W,H),(0,0,0,0))
    dd=ImageDraw.Draw(dark); dl=ImageDraw.Draw(light)
    f_h=fit_font(dd,headline[0],"ZalandoSansExpanded-Black.ttf",int(W*width_frac),track=g(-4))
    y=int(H*head_y); hb=None
    for t in headline:
        hb=dd.textbbox((0,0),t,font=f_h); w=tracked_w(dd,t,f_h,g(-4)); x=(W-w)//2
        for dr,col in ((dd,CHAR+(255,)),(dl,WHITE+(255,))): tracked(dr,(x-hb[0],y-hb[1]),t,f_h,col,track=g(-4))
        y+=int((hb[3]-hb[1])*1.0)+g(18)
    f_s=font("Arimo-Regular.ttf",max(30,int((hb[3]-hb[1])/g(1)*sub_scale)))
    # subline: centred; each letter whole in one colour, chosen by the brightness of the photo under the letter's own ink
    sb=dd.textbbox((0,0),sub[0],font=f_s); sl=int((sb[3]-sb[1])*1.5); y+=sl*2-g(18)
    import numpy as np
    L=np.asarray(canvas.convert("L")).astype(float)
    for t in sub:
        sb=dd.textbbox((0,0),t,font=f_s); w=dd.textlength(t,font=f_s); x=(W-w)//2
        for ch in t:
            cw=dd.textlength(ch,font=f_s)
            if ch.strip():
                ink=Image.new("L",(W,H),0); ImageDraw.Draw(ink).text((x-sb[0],y-sb[1]),ch,font=f_s,fill=255)
                m=np.asarray(ink)>128
                lum=L[m].mean() if m.any() else 255
                dd.text((x-sb[0],y-sb[1]),ch,font=f_s,fill=(WHITE if lum<sub_lum else CHAR)+(255,))
            x+=cw
        y+=sl
    canvas.paste(dark,(0,0),dark)
    lm=Image.new("L",(W,H),0); lm.paste(light.split()[3],(0,0),alpha)   # white only where the subject is
    canvas.paste(light,(0,0),lm)
    d=ImageDraw.Draw(canvas)
    logo=make_logo(color=CHAR,scale=8); lw=g(300); logo=logo.resize((lw,int(logo.height*lw/logo.width)),Image.LANCZOS)
    canvas.paste(logo,(g(100),g(90)),logo)
    canvas.save(out_path,quality=95); return canvas
if __name__=="__main__":
    a=sys.argv; photo,cut,out=a[1],a[2],a[3]; k=float(a[4]) if len(a)>4 else 1.0; hy=float(a[5]) if len(a)>5 else 0.47; wf=float(a[6]) if len(a)>6 else 0.86
    im=build(photo,cut,out,k=k,head_y=hy,width_frac=wf); im.resize((640,800),Image.LANCZOS).save(out.rsplit(".",1)[0]+"_preview.jpg",quality=85); print(out,im.size)
