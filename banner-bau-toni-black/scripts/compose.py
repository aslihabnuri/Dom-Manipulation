"""Toni Black BAU banner, diagonal grid layout.
Top row: logo (left) + eyebrow (right) on a shared baseline, hairline rule beneath.
Hero: justified lockup (SAVE UP TO tracked to the width of the display number) filling the wall area.
Bottom-right (sofa): benefits, CTA, terms, right-aligned to the same margin as the eyebrow.
Usage: python3 compose_bau2.py PHOTO OUT [scale] [percent]"""
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
def build(photo_path,out_path,k=1.0,pct="25%",bigw=560,hero_y=0.165,eyebrow="EVERYDAY ESSENTIALS",cutout=None):
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
    d=ImageDraw.Draw(canvas); M=g(72); L=M; R=W-M
    # --- top row: masthead ---
    logo=make_logo(color=CHAR,scale=8); lw=g(280); logo=logo.resize((lw,int(logo.height*lw/logo.width)),Image.LANCZOS)
    ty=g(64); canvas.paste(logo,(L,ty),logo)
    f_eye=font("ZalandoSansExpanded-SemiBold.ttf",22)
    ew=tracked_w(d,eyebrow,f_eye,g(6)); tracked(d,(R-ew,ty+(logo.height-g(22))//2-g(2)),eyebrow,f_eye,DAVI,track=g(6))
    ry=ty+logo.height+g(26); d.line([(L,ry),(R,ry)],fill=(170,170,170),width=max(1,g(1.5)))
    # --- hero lockup, justified to the display number ---
    f_big=fit_font(d,pct,"ZalandoSansExpanded-Black.ttf",g(bigw),track=g(-10))
    bb=d.textbbox((0,0),pct,font=f_big); numw=bb[2]-bb[0]; numh=bb[3]-bb[1]
    # kicker sized (not over-tracked) so its width matches the display number
    f_save=fit_font(d,"SAVE UP TO","ZalandoSansExpanded-Bold.ttf",numw,track=g(8),hi=g(80))
    sb=d.textbbox((0,0),"SAVE UP TO",font=f_save); sh=sb[3]-sb[1]
    y=int(H*hero_y)
    tracked(d,(L-sb[0],y-sb[1]),"SAVE UP TO",f_save,CHAR,track=g(8)); y+=sh+g(14)
    tracked(d,(L-bb[0],y-bb[1]),pct,f_big,CHAR,track=g(-10)); y+=numh+g(30)
    f_line=font("Arimo-Regular.ttf",30)
    d.text((L,y),"Made to move with you.",font=f_line,fill=DAVI)
    if cutout:  # subject layered in front of the display number (type-behind-subject)
        cu=Image.open(cutout).convert("RGBA").resize(src.size,Image.LANCZOS).crop((ox,oy,ox+W,oy+H))
        canvas.paste(cu,(0,0),cu); d=ImageDraw.Draw(canvas)
    # --- bottom-right block on the sofa ---
    f_ben=font("Arimo-Regular.ttf",26); f_cta=font("ZalandoSansExpanded-Bold.ttf",26); f_tc=font("Arimo-Regular.ttf",20)
    cw=int(tracked_w(d,"SHOP NOW",f_cta,g(4)))+2*g(46); ch=g(70)
    yb=H-M-g(20)              # terms baseline top
    t="*Terms & conditions apply"; d.text((R-d.textlength(t,font=f_tc),yb),t,font=f_tc,fill=GREY)
    yb-=g(22)+ch
    d.rounded_rectangle([R-cw,yb,R,yb+ch],radius=ch//2,fill=CHAR)
    tracked(d,(R-cw+g(46),yb+(ch-g(26))//2-g(4)),"SHOP NOW",f_cta,WHITE,track=g(4))
    # benefits: top-right, under the rule, right-aligned to the eyebrow axis
    by=ry+g(22)
    for t in ["Free shipping","Extra IDR 5K voucher for new buyers"]:
        d.text((R-d.textlength(t,font=f_ben),by),t,font=f_ben,fill=CHAR); by+=g(26+8)
    canvas.save(out_path,quality=95); return canvas
if __name__=="__main__":
    photo,out=sys.argv[1],sys.argv[2]; k=float(sys.argv[3]) if len(sys.argv)>3 else 1.0; pct=sys.argv[4] if len(sys.argv)>4 else "25%"
    bw=int(sys.argv[5]) if len(sys.argv)>5 else 560; hy=float(sys.argv[6]) if len(sys.argv)>6 else 0.165; cut=sys.argv[7] if len(sys.argv)>7 else None
    im=build(photo,out,k=k,pct=pct,bigw=bw,hero_y=hy,cutout=cut); im.resize((540,810),Image.LANCZOS).save(out.rsplit(".",1)[0]+"_preview.jpg",quality=85); print(out,im.size)
