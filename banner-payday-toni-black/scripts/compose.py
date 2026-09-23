"""Payday banner: three zones. Logo top-left on the drum ring; hero lockup on the torso inside the porthole with a
luminance knockout (white over dark, charcoal over light); benefits bottom-left and CTA bottom-right on the drum floor,
sharing one baseline. Usage: python3 compose_payday2.py PHOTO OUT [scale] [hero_y] [bigw]"""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from logo import make_logo
from compose_v4 import tracked, tracked_w
F="fonts/static/"; CHAR=(40,40,40); WHITE=(255,255,255); STEEL=(204,204,204)
def build(photo_path,out_path,k=1.0,hero_y=0.235,bigw=500,rad=420,vstr=0.42):
    W,H=int(1080*k),int(1620*k); g=lambda v:int(round(v*k))
    font=lambda n,s: ImageFont.truetype(F+n,g(s))
    def fit(d,text,name,target,track=0,lo=50,hi=1200):
        while lo<hi:
            mid=(lo+hi+1)//2
            if tracked_w(d,text,ImageFont.truetype(F+name,mid),track)<=target: lo=mid
            else: hi=mid-1
        return ImageFont.truetype(F+name,lo)
    src=Image.open(photo_path).convert("RGB"); s=max(W/src.width,H/src.height)
    src=src.resize((int(src.width*s+0.5),int(src.height*s+0.5)),Image.LANCZOS); ox=(src.width-W)//2; oy=(src.height-H)//2
    canvas=src.crop((ox,oy,ox+W,oy+H))
    # soft bottom gradient for the footer, as in 9.9
    ov=Image.new("L",(W,H),0); od=ImageDraw.Draw(ov); bot=g(380)
    for i in range(bot): od.line([(0,H-1-i),(W,H-1-i)],fill=int(140*(1-i/bot)**1.5))
    canvas.paste(Image.new("RGB",(W,H),(0,0,0)),(0,0),ov)
    d=ImageDraw.Draw(canvas); M=g(72)
    # --- zone 1: logo
    logo=make_logo(color=WHITE,scale=8); lw=g(280); logo=logo.resize((lw,int(logo.height*lw/logo.width)),Image.LANCZOS); canvas.paste(logo,(M,g(64)),logo)
    # --- zone 2: hero, white only. A soft lens vignette inside the porthole (photographic, not a box) gives the tiles enough depth for white type
    vig=Image.new("L",(W,H),0); vd=ImageDraw.Draw(vig); cx,cy=W//2,int(H*0.40); r=g(rad)
    for i in range(40,0,-1):
        rr=r*i/40; vd.ellipse([cx-rr,cy-rr*1.08,cx+rr,cy+rr*1.08],fill=int(vstr*255*(1-(i/40)**2)))
    vig=vig.filter(ImageFilter.GaussianBlur(g(60)))
    canvas.paste(Image.new("RGB",(W,H),(0,0,0)),(0,0),vig); d=ImageDraw.Draw(canvas)
    f_eye=font("ZalandoSansExpanded-SemiBold.ttf",26); f_save=font("ZalandoSansExpanded-Bold.ttf",48); f_big=fit(d,"45%","ZalandoSansExpanded-Black.ttf",g(bigw),track=g(-8))
    y=int(H*hero_y)
    w=tracked_w(d,"PAYDAY SALE",f_eye,g(8)); tracked(d,((W-w)//2,y),"PAYDAY SALE",f_eye,WHITE,track=g(8)); y+=g(26+22)
    w=tracked_w(d,"SAVE UP TO",f_save,g(10)); tracked(d,((W-w)//2,y),"SAVE UP TO",f_save,WHITE,track=g(10)); y+=g(48+12)
    bb=d.textbbox((0,0),"45%",font=f_big); tracked(d,((W-(bb[2]-bb[0]))//2-bb[0],y-bb[1]),"45%",f_big,WHITE,track=g(-8))
    # --- zone 3: footer. benefits left, CTA right, one baseline; terms under the benefits
    f_ben=font("Arimo-Regular.ttf",30); f_cta=font("ZalandoSansExpanded-Bold.ttf",28); f_tc=font("Arimo-Regular.ttf",20)
    cw=int(tracked_w(d,"SHOP NOW",f_cta,g(4)))+2*g(50); ch=g(74); base=H-M-g(44)
    d.rounded_rectangle([W-M-cw,base-ch,W-M,base],radius=ch//2,fill=WHITE)
    tracked(d,(W-M-cw+g(50),base-ch+(ch-g(28))//2-g(4)),"SHOP NOW",f_cta,CHAR,track=g(4))
    lines=["Free shipping","Extra IDR 5K voucher for new buyers"]; lh=g(30*1.45)
    yb=base-lh*len(lines)+g(6)
    for t in lines: d.text((M,yb),t,font=f_ben,fill=WHITE); yb+=lh
    d.text((M,base+g(14)),"*Terms & conditions apply",font=f_tc,fill=STEEL)
    canvas.save(out_path,quality=95); return canvas
if __name__=="__main__":
    a=sys.argv; im=build(a[1],a[2],*(float(v) for v in a[3:]))
    im.resize((540,810),Image.LANCZOS).save(a[2].rsplit(".",1)[0]+"_preview.jpg",quality=85)
