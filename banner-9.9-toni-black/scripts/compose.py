"""Toni Black 9.9 banner v3: full-bleed torso photo, typography in three zones (top, centre, bottom).
Usage: python3 compose_v3.py PHOTO OUT [scale]"""
import sys
from PIL import Image, ImageDraw, ImageFont
from logo import make_logo
F="fonts/static/"
CHAR=(40,40,40); WHITE=(255,255,255); STEEL=(204,204,204)

def tracked(d,xy,text,f,fill,track=0):
    x,y=xy
    for ch in text:
        d.text((x,y),ch,font=f,fill=fill); x+=d.textlength(ch,font=f)+track
def tracked_w(d,text,f,track=0):
    return sum(d.textlength(ch,font=f) for ch in text)+track*(len(text)-1)

def build(photo_path,out_path,k=1.0,bigw=660,hero_y=0.285):
    W,H=int(1080*k),int(1620*k); g=lambda v:int(round(v*k))
    def font(name,size): return ImageFont.truetype(F+name,g(size))
    def fit_font(d,text,name,target_w,track=0,lo=50,hi=1200):
        while lo<hi:
            mid=(lo+hi+1)//2
            if tracked_w(d,text,ImageFont.truetype(F+name,mid),track)<=target_w: lo=mid
            else: hi=mid-1
        return ImageFont.truetype(F+name,lo)
    # full-bleed photo, cover-fit
    src=Image.open(photo_path).convert("RGB")
    s=max(W/src.width,H/src.height); src=src.resize((int(src.width*s+0.5),int(src.height*s+0.5)),Image.LANCZOS)
    ox=(src.width-W)//2; oy=(src.height-H)//2
    canvas=src.crop((ox,oy,ox+W,oy+H))
    # soft legibility gradients (brand guideline: gradient behind type is allowed)
    ov=Image.new("L",(W,H),0); od=ImageDraw.Draw(ov)
    top=g(260); bot=g(420)
    for i in range(top): od.line([(0,i),(W,i)],fill=int(70*(1-i/top)))
    for i in range(bot): od.line([(0,H-1-i),(W,H-1-i)],fill=int(120*(1-i/bot)))
    canvas.paste(Image.new("RGB",(W,H),(0,0,0)),(0,0),ov)
    d=ImageDraw.Draw(canvas)
    M=g(72)
    # TOP ZONE: logo left, sale tag right
    logo=make_logo(color=WHITE,scale=8); lw=g(290); logo=logo.resize((lw,int(logo.height*lw/logo.width)),Image.LANCZOS)
    canvas.paste(logo,(M,g(64)),logo)
    f_tag=font("ZalandoSansExpanded-SemiBold.ttf",26)
    tw=tracked_w(d,"9.9 SALE",f_tag,g(6)); ph=g(52); pw=int(tw)+2*g(26)
    px,py=W-M-pw,g(64)+ (logo.height-ph)//2
    d.rounded_rectangle([px,py,px+pw,py+ph],radius=ph//2,outline=WHITE,width=g(2))
    tracked(d,(px+g(26),py+(ph-g(26))//2-g(3)),"9.9 SALE",f_tag,WHITE,track=g(6))
    # CENTRE ZONE: hero lockup across the chest
    f_save=font("ZalandoSansExpanded-Bold.ttf",48)
    f_big=fit_font(d,"40%","ZalandoSansExpanded-Black.ttf",g(bigw),track=g(-8))
    f_line=font("Arimo-Regular.ttf",34)
    y=int(H*hero_y)
    sw=tracked_w(d,"SAVE UP TO",f_save,g(10)); tracked(d,((W-sw)//2,y),"SAVE UP TO",f_save,WHITE,track=g(10))
    y+=g(48+14)
    bb=d.textbbox((0,0),"40%",font=f_big); bw_=bb[2]-bb[0]; bh=bb[3]-bb[1]
    tracked(d,((W-bw_)//2-bb[0],y-bb[1]),"40%",f_big,WHITE,track=g(-8))
    y+=bh+g(22)
    t="Trunks built to hold their shape."; d.text(((W-d.textlength(t,font=f_line))//2,y),t,font=f_line,fill=WHITE)
    # BOTTOM ZONE: benefits left, CTA right, terms below
    f_ben=font("Arimo-Regular.ttf",31); f_cta=font("ZalandoSansExpanded-Bold.ttf",28); f_tc=font("Arimo-Regular.ttf",21)
    cw=int(tracked_w(d,"SHOP NOW",f_cta,g(4)))+2*g(46); ch=g(74)
    yb=H-M-g(21)-g(26)-ch  # top of the benefit/CTA row
    d.rounded_rectangle([W-M-cw,yb,W-M,yb+ch],radius=ch//2,fill=WHITE)
    tracked(d,(W-M-cw+g(46),yb+(ch-g(28))//2-g(4)),"SHOP NOW",f_cta,CHAR,track=g(4))
    rows=["Free shipping","Extra IDR 5K voucher for new buyers"]
    ry=yb+(ch-(2*g(31)+g(10)))//2
    for b in rows:
        d.rectangle([M,ry+g(12),M+g(8),ry+g(20)],fill=WHITE); d.text((M+g(24),ry),b,font=f_ben,fill=WHITE); ry+=g(31+10)
    d.text((M,yb+ch+g(26)),"*Terms & conditions apply",font=f_tc,fill=STEEL)
    canvas.save(out_path,quality=95); return canvas

if __name__=="__main__":
    photo,out=sys.argv[1],sys.argv[2]; k=float(sys.argv[3]) if len(sys.argv)>3 else 1.0
    im=build(photo,out,k=k); im.resize((540,810),Image.LANCZOS).save(out.rsplit(".",1)[0]+"_preview.jpg",quality=85); print(out,im.size)
