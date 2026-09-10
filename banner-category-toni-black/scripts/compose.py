"""Toni Black category banner, 1200 px wide, full-bleed. The photo's hazy sky is extended upward (local, no credits)
to make a typographic zone: logo top-left, then a two-column row: MEN + sub-categories (left), KIDS + sub-categories (right).
Usage: python3 compose_sky.py PHOTO OUT [scale] [ext] [label_size]"""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from logo import make_logo
F="fonts/static/"
CHAR=(40,40,40); DAVI=(79,80,82)
def tracked(d,xy,text,f,fill,track=0):
    x,y=xy
    for ch in text:
        d.text((x,y),ch,font=f,fill=fill); x+=d.textlength(ch,font=f)+track
def tracked_w(d,text,f,track=0): return sum(d.textlength(ch,font=f) for ch in text)+track*(len(text)-1)
def build(photo_path,out_path,k=1.0,ext=340,label_size=96,photo_h=800,sub_men="Brief  ·  Boxer  ·  Singlet",sub_kids="Brief  ·  Boxer"):
    W=int(1200*k); g=lambda v:int(round(v*k)); PH=g(photo_h); E=g(ext); H=E+PH
    def font(name,size): return ImageFont.truetype(F+name,g(size))
    src=Image.open(photo_path).convert("RGB")
    s=W/src.width; src=src.resize((W,int(src.height*s+0.5)),Image.LANCZOS)
    photo=src.crop((0,0,W,PH)) if src.height>=PH else src
    canvas=Image.new("RGB",(W,H),(230,230,230))
    # sky extension: stretch the top strip of the photo upward, blur, feather the seam
    strip=photo.crop((0,0,W,g(40))).resize((W,E+g(120)),Image.BILINEAR).filter(ImageFilter.GaussianBlur(g(10)))
    canvas.paste(strip,(0,0))
    mask=Image.new("L",(W,PH),255); md=ImageDraw.Draw(mask); fe=g(120)
    for i in range(fe): md.line([(0,i),(W,i)],fill=int(255*i/fe))
    canvas.paste(photo,(0,E),mask)
    d=ImageDraw.Draw(canvas); M=g(60); L=M; R=W-M
    logo=make_logo(color=CHAR,scale=8); lw=g(220); logo=logo.resize((lw,int(logo.height*lw/logo.width)),Image.LANCZOS)
    canvas.paste(logo,(L,g(52)),logo)
    f_lab=font("ZalandoSansExpanded-Black.ttf",label_size); f_sub=font("Arimo-Regular.ttf",26)
    y=g(52)+logo.height+g(34)
    for text,sub,align in (("MEN",sub_men,"left"),("KIDS",sub_kids,"right")):
        bb=d.textbbox((0,0),text,font=f_lab); w=bb[2]-bb[0]; h=bb[3]-bb[1]
        x=L if align=="left" else R-w
        tracked(d,(x-bb[0],y-bb[1]),text,f_lab,CHAR,track=g(-3))
        sw=d.textlength(sub,font=f_sub); sx=L if align=="left" else R-sw
        d.text((sx,y+h+g(16)),sub,font=f_sub,fill=DAVI)
    canvas.save(out_path,quality=95); return canvas
if __name__=="__main__":
    photo,out=sys.argv[1],sys.argv[2]; k=float(sys.argv[3]) if len(sys.argv)>3 else 1.0
    ext=int(sys.argv[4]) if len(sys.argv)>4 else 340; ls=int(sys.argv[5]) if len(sys.argv)>5 else 96
    im=build(photo,out,k=k,ext=ext,label_size=ls); im.resize((900,int(900*im.height/im.width)),Image.LANCZOS).save(out.rsplit(".",1)[0]+"_preview.jpg",quality=85); print(out,im.size)
