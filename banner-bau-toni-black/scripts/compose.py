"""Toni Black BAU banner: full-bleed photo (2:3), one left-aligned column in the empty wall area
(logo, eyebrow, SAVE UP TO, NN%, benefits, CTA), terms at the bottom.
Usage: python3 compose_bau.py PHOTO OUT [scale] [percent] [col_y]"""
import sys
from PIL import Image, ImageDraw, ImageFont
from logo import make_logo
F="fonts/static/"
CHAR=(40,40,40); WHITE=(255,255,255); DAVI=(79,80,82); GREY=(129,130,132)
def tracked(d,xy,text,f,fill,track=0):
    x,y=xy
    for ch in text:
        d.text((x,y),ch,font=f,fill=fill); x+=d.textlength(ch,font=f)+track
def tracked_w(d,text,f,track=0):
    return sum(d.textlength(ch,font=f) for ch in text)+track*(len(text)-1)
def build(photo_path,out_path,k=1.0,pct="25%",col_y=0.215,bigw=560,eyebrow="EVERYDAY ESSENTIALS"):
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
    d=ImageDraw.Draw(canvas); M=g(72); x=M
    logo=make_logo(color=CHAR,scale=8); lw=g(290); logo=logo.resize((lw,int(logo.height*lw/logo.width)),Image.LANCZOS)
    canvas.paste(logo,(M,g(64)),logo)
    f_eye=font("ZalandoSansExpanded-SemiBold.ttf",24)
    f_save=font("ZalandoSansExpanded-Bold.ttf",46)
    f_big=fit_font(d,pct,"ZalandoSansExpanded-Black.ttf",g(bigw),track=g(-8))
    f_ben=font("Arimo-Regular.ttf",30); f_cta=font("ZalandoSansExpanded-Bold.ttf",26); f_tc=font("Arimo-Regular.ttf",20)
    y=int(H*col_y)
    tracked(d,(x,y),eyebrow,f_eye,DAVI,track=g(6)); y+=g(24+26)
    tracked(d,(x,y),"SAVE UP TO",f_save,CHAR,track=g(10)); y+=g(46+10)
    bb=d.textbbox((0,0),pct,font=f_big); tracked(d,(x-bb[0],y-bb[1]),pct,f_big,CHAR,track=g(-8)); y+=(bb[3]-bb[1])+g(28)
    for t in ["Free shipping","Extra IDR 5K voucher for new buyers"]:
        d.text((x,y),t,font=f_ben,fill=CHAR); y+=g(30+12)
    y+=g(22)
    cw=int(tracked_w(d,"SHOP NOW",f_cta,g(4)))+2*g(46); ch=g(70)
    d.rounded_rectangle([x,y,x+cw,y+ch],radius=ch//2,fill=CHAR)
    tracked(d,(x+g(46),y+(ch-g(26))//2-g(4)),"SHOP NOW",f_cta,WHITE,track=g(4))
    t="*Terms & conditions apply"; d.text((x,H-M-g(20)),t,font=f_tc,fill=GREY)
    canvas.save(out_path,quality=95); return canvas
if __name__=="__main__":
    photo,out=sys.argv[1],sys.argv[2]; k=float(sys.argv[3]) if len(sys.argv)>3 else 1.0
    pct=sys.argv[4] if len(sys.argv)>4 else "25%"; cy=float(sys.argv[5]) if len(sys.argv)>5 else 0.215
    im=build(photo,out,k=k,pct=pct,col_y=cy); im.resize((540,810),Image.LANCZOS).save(out.rsplit(".",1)[0]+"_preview.jpg",quality=85); print(out,im.size)
