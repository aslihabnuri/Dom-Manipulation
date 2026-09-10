"""Toni Black category banner, landscape 3:2 lifestyle photo. Logo alone top-left (sky);
category labels on the foreground sand: MEN bottom-left under the man, KIDS bottom-right under the boy.
Usage: python3 compose_life.py PHOTO OUT [scale] [label_size] [label_bottom_frac] [color]"""
import sys
from PIL import Image, ImageDraw, ImageFont
from logo import make_logo
F="fonts/static/"
CHAR=(40,40,40); WHITE=(255,255,255)
def tracked(d,xy,text,f,fill,track=0):
    x,y=xy
    for ch in text:
        d.text((x,y),ch,font=f,fill=fill); x+=d.textlength(ch,font=f)+track
def build(photo_path,out_path,k=1.0,label_size=96,bottom=0.90,color=CHAR,logo_color=None,bottom_right=None):
    W,H=int(1620*k),int(1080*k); g=lambda v:int(round(v*k))
    def font(name,size): return ImageFont.truetype(F+name,g(size))
    src=Image.open(photo_path).convert("RGB")
    s=max(W/src.width,H/src.height); src=src.resize((int(src.width*s+0.5),int(src.height*s+0.5)),Image.LANCZOS)
    ox=(src.width-W)//2; oy=(src.height-H)//2; canvas=src.crop((ox,oy,ox+W,oy+H))
    d=ImageDraw.Draw(canvas); M=g(72); L=M; R=W-M
    f_lab=font("ZalandoSansExpanded-Black.ttf",label_size)
    for text,align in (("MEN","left"),("KIDS","right")):
        yb=int(H*(bottom if align=="left" or bottom_right is None else bottom_right))
        bb=d.textbbox((0,0),text,font=f_lab); w=bb[2]-bb[0]; h=bb[3]-bb[1]
        x=L if align=="left" else R-w
        tracked(d,(x-bb[0],yb-h-bb[1]),text,f_lab,color,track=g(-4))
    logo=make_logo(color=logo_color or color,scale=8); lw=g(280); logo=logo.resize((lw,int(logo.height*lw/logo.width)),Image.LANCZOS)
    canvas.paste(logo,(M,g(60)),logo)
    canvas.save(out_path,quality=95); return canvas
if __name__=="__main__":
    photo,out=sys.argv[1],sys.argv[2]; k=float(sys.argv[3]) if len(sys.argv)>3 else 1.0
    ls=int(sys.argv[4]) if len(sys.argv)>4 else 96; bt=float(sys.argv[5]) if len(sys.argv)>5 else 0.90
    col=WHITE if (len(sys.argv)>6 and sys.argv[6]=="white") else CHAR
    im=build(photo,out,k=k,label_size=ls,bottom=bt,color=col); im.resize((810,540),Image.LANCZOS).save(out.rsplit(".",1)[0]+"_preview.jpg",quality=85); print(out,im.size)
