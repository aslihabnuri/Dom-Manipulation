"""Toni Black category banner (2:3). Logo alone top-left. Two category labels on one baseline:
MEN on the left axis, KIDS on the right axis; optional cutout layers the subjects in front of the type.
Usage: python3 compose_cat.py PHOTO OUT [scale] [label_y] [label_size] [cutout|-] [sub|nosub]"""
import sys
from PIL import Image, ImageDraw, ImageFont
from logo import make_logo
F="fonts/static/"
CHAR=(40,40,40); WHITE=(255,255,255); DAVI=(79,80,82); GREY=(129,130,132)
def tracked(d,xy,text,f,fill,track=0):
    x,y=xy
    for ch in text:
        d.text((x,y),ch,font=f,fill=fill); x+=d.textlength(ch,font=f)+track
def build(photo_path,out_path,k=1.0,label_y=0.86,label_size=120,cutout=None,sub=True,color=CHAR,centers=None):
    W,H=int(1080*k),int(1620*k); g=lambda v:int(round(v*k))
    def font(name,size): return ImageFont.truetype(F+name,g(size))
    src=Image.open(photo_path).convert("RGB")
    s=max(W/src.width,H/src.height); src=src.resize((int(src.width*s+0.5),int(src.height*s+0.5)),Image.LANCZOS)
    ox=(src.width-W)//2; oy=(src.height-H)//2; canvas=src.crop((ox,oy,ox+W,oy+H))
    d=ImageDraw.Draw(canvas); M=g(72); L=M; R=W-M
    f_lab=font("ZalandoSansExpanded-Black.ttf",label_size); f_sub=font("Arimo-Regular.ttf",26)
    y=int(H*label_y)
    def label(text,align):
        bb=d.textbbox((0,0),text,font=f_lab); w=bb[2]-bb[0]; h=bb[3]-bb[1]
        if centers:  # centre each label on its figure's x-axis (fraction of W), clamped to the margins
            cx=int(W*(centers[0] if align=="left" else centers[1])); x=max(L,min(R-w,cx-w//2))
        else:
            x=L if align=="left" else R-w
        tracked(d,(x-bb[0],y-bb[1]),text,f_lab,color,track=g(-4))
        if sub:
            t="Explore the collection"; tw=d.textlength(t,font=f_sub)
            d.text((L if align=="left" else R-tw,y+h+g(18)),t,font=f_sub,fill=DAVI)
    label("MEN","left"); label("KIDS","right")
    if cutout:
        cu=Image.open(cutout).convert("RGBA").resize(src.size,Image.LANCZOS).crop((ox,oy,ox+W,oy+H))
        canvas.paste(cu,(0,0),cu); d=ImageDraw.Draw(canvas)
    logo=make_logo(color=CHAR,scale=8); lw=g(280); logo=logo.resize((lw,int(logo.height*lw/logo.width)),Image.LANCZOS)
    canvas.paste(logo,(M,g(64)),logo)
    canvas.save(out_path,quality=95); return canvas
if __name__=="__main__":
    photo,out=sys.argv[1],sys.argv[2]; k=float(sys.argv[3]) if len(sys.argv)>3 else 1.0
    ly=float(sys.argv[4]) if len(sys.argv)>4 else 0.86; ls=int(sys.argv[5]) if len(sys.argv)>5 else 120
    cut=sys.argv[6] if len(sys.argv)>6 and sys.argv[6]!="-" else None; sub=(sys.argv[7]!="nosub") if len(sys.argv)>7 else True
    cen=tuple(float(v) for v in sys.argv[8].split(",")) if len(sys.argv)>8 else None
    im=build(photo,out,k=k,label_y=ly,label_size=ls,cutout=cut,sub=sub,centers=cen); im.resize((540,810),Image.LANCZOS).save(out.rsplit(".",1)[0]+"_preview.jpg",quality=85); print(out,im.size)
