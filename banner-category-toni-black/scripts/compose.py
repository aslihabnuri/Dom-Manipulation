"""Toni Black category banner, 1200 px wide, full-bleed with a small local sky extension.
Centred composition: logo centred on top; MEN and KIDS below it, each centred on its figure's axis,
sub-categories centred under each label. Usage: python3 compose_sky2.py PHOTO OUT [scale] [ext] [label_size] [ax_men] [ax_kids]"""
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
def build(photo_path,out_path,k=1.0,ext=150,label_size=88,ax_men=0.30,ax_kids=0.70,photo_h=800,
          sub_men="Brief  ·  Boxer  ·  Singlet",sub_kids="Brief  ·  Boxer",logo_w=210):
    W=int(1200*k); g=lambda v:int(round(v*k)); PH=g(photo_h); E=g(ext); H=E+PH
    def font(name,size): return ImageFont.truetype(F+name,g(size))
    src=Image.open(photo_path).convert("RGB"); s=W/src.width; src=src.resize((W,int(src.height*s+0.5)),Image.LANCZOS)
    photo=src.crop((0,0,W,PH))
    canvas=Image.new("RGB",(W,H),(230,230,230))
    strip=photo.crop((0,0,W,g(40))).resize((W,E+g(120)),Image.BILINEAR).filter(ImageFilter.GaussianBlur(g(10)))
    canvas.paste(strip,(0,0))
    mask=Image.new("L",(W,PH),255); md=ImageDraw.Draw(mask); fe=g(120)
    for i in range(fe): md.line([(0,i),(W,i)],fill=int(255*i/fe))
    canvas.paste(photo,(0,E),mask)
    d=ImageDraw.Draw(canvas)
    logo=make_logo(color=CHAR,scale=8); lw=g(logo_w); logo=logo.resize((lw,int(logo.height*lw/logo.width)),Image.LANCZOS)
    ly=g(40); canvas.paste(logo,((W-lw)//2,ly),logo)
    f_lab=font("ZalandoSansExpanded-Black.ttf",label_size); f_sub=font("Arimo-Regular.ttf",25)
    y=ly+logo.height+g(30)
    for text,sub,ax in (("MEN",sub_men,ax_men),("KIDS",sub_kids,ax_kids)):
        bb=d.textbbox((0,0),text,font=f_lab); w=bb[2]-bb[0]; h=bb[3]-bb[1]; cx=int(W*ax)
        tracked(d,(cx-w//2-bb[0],y-bb[1]),text,f_lab,CHAR,track=g(-3))
        sw=d.textlength(sub,font=f_sub); d.text((cx-sw/2,y+h+g(14)),sub,font=f_sub,fill=DAVI)
    canvas.save(out_path,quality=95); return canvas
if __name__=="__main__":
    a=sys.argv; photo,out=a[1],a[2]; k=float(a[3]) if len(a)>3 else 1.0; ext=int(a[4]) if len(a)>4 else 150
    ls=int(a[5]) if len(a)>5 else 88; am=float(a[6]) if len(a)>6 else 0.30; ak=float(a[7]) if len(a)>7 else 0.70
    im=build(photo,out,k=k,ext=ext,label_size=ls,ax_men=am,ax_kids=ak); im.resize((900,int(900*im.height/im.width)),Image.LANCZOS).save(out.rsplit(".",1)[0]+"_preview.jpg",quality=85); print(out,im.size)
