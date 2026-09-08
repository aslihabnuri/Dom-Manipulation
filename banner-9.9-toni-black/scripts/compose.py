"""Toni Black 9.9 banner v4: full-bleed photo, logo top-left, one centred hero lockup on the chest,
one centred offer block at the bottom. Usage: python3 compose_v4.py PHOTO OUT [scale] [hero_y]"""
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
def build(photo_path,out_path,k=1.0,bigw=640,hero_y=0.30):
    W,H=int(1080*k),int(1620*k); g=lambda v:int(round(v*k))
    def font(name,size): return ImageFont.truetype(F+name,g(size))
    def fit_font(d,text,name,target_w,track=0,lo=50,hi=1200):
        while lo<hi:
            mid=(lo+hi+1)//2
            if tracked_w(d,text,ImageFont.truetype(F+name,mid),track)<=target_w: lo=mid
            else: hi=mid-1
        return ImageFont.truetype(F+name,lo)
    src=Image.open(photo_path).convert("RGB")
    s=max(W/src.width,H/src.height); src=src.resize((int(src.width*s+0.5),int(src.height*s+0.5)),Image.LANCZOS)
    ox=(src.width-W)//2; oy=(src.height-H)//2; canvas=src.crop((ox,oy,ox+W,oy+H))
    # bottom legibility gradient only
    ov=Image.new("L",(W,H),0); od=ImageDraw.Draw(ov); bot=g(360)
    for i in range(bot): od.line([(0,H-1-i),(W,H-1-i)],fill=int(130*(1-i/bot)**1.5))
    canvas.paste(Image.new("RGB",(W,H),(0,0,0)),(0,0),ov)
    d=ImageDraw.Draw(canvas); M=g(72)
    # logo
    logo=make_logo(color=WHITE,scale=8); lw=g(280); logo=logo.resize((lw,int(logo.height*lw/logo.width)),Image.LANCZOS)
    canvas.paste(logo,(M,g(64)),logo)
    # hero lockup, centred on the chest
    f_eye=font("ZalandoSansExpanded-SemiBold.ttf",26)
    f_save=font("ZalandoSansExpanded-Bold.ttf",46)
    f_big=fit_font(d,"40%","ZalandoSansExpanded-Black.ttf",g(bigw),track=g(-8))
    y=int(H*hero_y)
    w=tracked_w(d,"9.9 SALE",f_eye,g(8)); tracked(d,((W-w)//2,y),"9.9 SALE",f_eye,WHITE,track=g(8)); y+=g(26+22)
    w=tracked_w(d,"SAVE UP TO",f_save,g(10)); tracked(d,((W-w)//2,y),"SAVE UP TO",f_save,WHITE,track=g(10)); y+=g(46+12)
    bb=d.textbbox((0,0),"40%",font=f_big); tracked(d,((W-(bb[2]-bb[0]))//2-bb[0],y-bb[1]),"40%",f_big,WHITE,track=g(-8))
    y+= (bb[3]-bb[1]) + g(30)
    # benefits directly under the hero, still one centred block
    f_ben=font("Arimo-Regular.ttf",30); f_cta=font("ZalandoSansExpanded-Bold.ttf",28); f_tc=font("Arimo-Regular.ttf",20)
    for t in ["Free shipping","Extra IDR 5K voucher for new buyers"]:
        d.text(((W-d.textlength(t,font=f_ben))//2,y),t,font=f_ben,fill=WHITE); y+=g(30+12)
    # CTA alone at the bottom centre, below the waistband
    cw=int(tracked_w(d,"SHOP NOW",f_cta,g(4)))+2*g(50); ch=g(74)
    yt=H-M-g(20); yb=yt-g(24)-ch
    d.rounded_rectangle([(W-cw)//2,yb,(W+cw)//2,yb+ch],radius=ch//2,fill=WHITE)
    tracked(d,((W-cw)//2+g(50),yb+(ch-g(28))//2-g(4)),"SHOP NOW",f_cta,CHAR,track=g(4))
    t="*Terms & conditions apply"; d.text(((W-d.textlength(t,font=f_tc))//2,yt),t,font=f_tc,fill=STEEL)
    canvas.save(out_path,quality=95); return canvas
if __name__=="__main__":
    photo,out=sys.argv[1],sys.argv[2]; k=float(sys.argv[3]) if len(sys.argv)>3 else 1.0; hy=float(sys.argv[4]) if len(sys.argv)>4 else 0.30
    im=build(photo,out,k=k,hero_y=hy); im.resize((540,810),Image.LANCZOS).save(out.rsplit(".",1)[0]+"_preview.jpg",quality=85); print(out,im.size)
