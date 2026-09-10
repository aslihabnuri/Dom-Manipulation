"""Toni Black category banner, 1200 px wide, full-bleed with a local sky extension.
Stepped (cascade) lockup: logo centred on top; MEN and KIDS on different baselines, each centred on its own axis,
sub-categories centred under each. Usage: python3 compose_sky3.py PHOTO OUT [scale] [ext] [size] [men_ax,men_y] [kids_ax,kids_y]"""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from logo import make_logo
F="fonts/static/"
CHAR=(40,40,40); DAVI=(79,80,82)
def tracked(d,xy,text,f,fill,track=0):
    x,y=xy
    for ch in text:
        d.text((x,y),ch,font=f,fill=fill); x+=d.textlength(ch,font=f)+track
def build(photo_path,out_path,k=1.0,ext=190,label_size=88,men=(0.24,130),kids=(0.78,215),photo_h=800,
          sub_men="Brief  ·  Boxer  ·  Singlet",sub_kids="Brief  ·  Boxer",logo_w=210,logo_y=40):
    W=int(1200*k); g=lambda v:int(round(v*k)); PH=g(photo_h); E=g(ext); H=E+PH
    def font(name,size): return ImageFont.truetype(F+name,g(size))
    src=Image.open(photo_path).convert("RGB"); s=W/src.width; src=src.resize((W,int(src.height*s+0.5)),Image.LANCZOS)
    photo=src.crop((0,0,W,PH)); canvas=Image.new("RGB",(W,H),(230,230,230))
    strip=photo.crop((0,0,W,g(40))).resize((W,E+g(120)),Image.BILINEAR).filter(ImageFilter.GaussianBlur(g(10)))
    canvas.paste(strip,(0,0))
    mask=Image.new("L",(W,PH),255); md=ImageDraw.Draw(mask); fe=g(120)
    for i in range(fe): md.line([(0,i),(W,i)],fill=int(255*i/fe))
    canvas.paste(photo,(0,E),mask); d=ImageDraw.Draw(canvas)
    logo=make_logo(color=CHAR,scale=8); lw=g(logo_w); logo=logo.resize((lw,int(logo.height*lw/logo.width)),Image.LANCZOS)
    canvas.paste(logo,((W-lw)//2,g(logo_y)),logo)
    f_lab=font("ZalandoSansExpanded-Black.ttf",label_size); f_sub=font("Arimo-Regular.ttf",25)
    for text,sub,(ax,ty) in (("MEN",sub_men,men),("KIDS",sub_kids,kids)):
        y=g(ty); bb=d.textbbox((0,0),text,font=f_lab); w=bb[2]-bb[0]; h=bb[3]-bb[1]; cx=int(W*ax)
        tracked(d,(cx-w//2-bb[0],y-bb[1]),text,f_lab,CHAR,track=g(-3))
        sw=d.textlength(sub,font=f_sub); d.text((cx-sw/2,y+h+g(14)),sub,font=f_sub,fill=DAVI)
    canvas.save(out_path,quality=95); return canvas
if __name__=="__main__":
    a=sys.argv; photo,out=a[1],a[2]; k=float(a[3]) if len(a)>3 else 1.0; ext=int(a[4]) if len(a)>4 else 190; ls=int(a[5]) if len(a)>5 else 88
    men=tuple(float(v) for v in a[6].split(",")) if len(a)>6 else (0.24,130); kids=tuple(float(v) for v in a[7].split(",")) if len(a)>7 else (0.78,215)
    im=build(photo,out,k=k,ext=ext,label_size=ls,men=men,kids=kids); im.resize((900,int(900*im.height/im.width)),Image.LANCZOS).save(out.rsplit(".",1)[0]+"_preview.jpg",quality=85); print(out,im.size)
