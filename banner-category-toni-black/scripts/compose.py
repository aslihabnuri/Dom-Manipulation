"""Toni Black category banner, 1200 px wide: white top band with the centred logo, 3:2 photo,
white bottom band with MEN (left) and KIDS (right). Usage: python3 compose_band.py PHOTO OUT [scale]"""
import sys
from PIL import Image, ImageDraw, ImageFont
from logo import make_logo
F="fonts/static/"
CHAR=(40,40,40); WHITE=(255,255,255)
def tracked(d,xy,text,f,fill,track=0):
    x,y=xy
    for ch in text:
        d.text((x,y),ch,font=f,fill=fill); x+=d.textlength(ch,font=f)+track
def build(photo_path,out_path,k=1.0,top_h=120,photo_h=800,bot_h=150,label_size=64,photo_shift=0.0):
    W=int(1200*k); g=lambda v:int(round(v*k))
    TH,PH,BH=g(top_h),g(photo_h),g(bot_h); H=TH+PH+BH
    def font(name,size): return ImageFont.truetype(F+name,g(size))
    canvas=Image.new("RGB",(W,H),WHITE); d=ImageDraw.Draw(canvas); M=g(60)
    # photo, cover-fit into W x PH, optional vertical shift (fraction of slack)
    src=Image.open(photo_path).convert("RGB")
    s=max(W/src.width,PH/src.height); src=src.resize((int(src.width*s+0.5),int(src.height*s+0.5)),Image.LANCZOS)
    ox=(src.width-W)//2; oy=int((src.height-PH)*(0.5+photo_shift)); oy=max(0,min(src.height-PH,oy))
    canvas.paste(src.crop((ox,oy,ox+W,oy+PH)),(0,TH))
    # top band: logo centred
    logo=make_logo(color=CHAR,scale=8); lw=g(240); logo=logo.resize((lw,int(logo.height*lw/logo.width)),Image.LANCZOS)
    canvas.paste(logo,((W-lw)//2,(TH-logo.height)//2),logo)
    # bottom band: labels on one baseline, vertically centred
    f_lab=font("ZalandoSansExpanded-Black.ttf",label_size)
    for text,align in (("MEN","left"),("KIDS","right")):
        bb=d.textbbox((0,0),text,font=f_lab); w=bb[2]-bb[0]; h=bb[3]-bb[1]
        x=M if align=="left" else W-M-w; y=TH+PH+(BH-h)//2
        tracked(d,(x-bb[0],y-bb[1]),text,f_lab,CHAR,track=g(-3))
    canvas.save(out_path,quality=95); return canvas
if __name__=="__main__":
    photo,out=sys.argv[1],sys.argv[2]; k=float(sys.argv[3]) if len(sys.argv)>3 else 1.0
    sh=float(sys.argv[4]) if len(sys.argv)>4 else 0.0
    im=build(photo,out,k=k,photo_shift=sh); im.resize((900,int(900*im.height/im.width)),Image.LANCZOS).save(out.rsplit(".",1)[0]+"_preview.jpg",quality=85); print(out,im.size)
