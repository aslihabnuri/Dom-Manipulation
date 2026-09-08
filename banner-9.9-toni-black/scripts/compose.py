"""Toni Black 9.9 banner compositor. Usage: python3 compose.py PHOTO OUT THEME [crop_right pscale bigw scale]"""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from logo import make_logo
F="fonts/static/"
CHAR=(40,40,40); WHITE=(255,255,255); DAVI=(79,80,82); GREY=(129,130,132); LIGHTG=(204,204,204)

def tracked(d,xy,text,f,fill,track=0):
    x,y=xy
    for ch in text:
        d.text((x,y),ch,font=f,fill=fill); x+=d.textlength(ch,font=f)+track
    return x
def tracked_w(d,text,f,track=0):
    return sum(d.textlength(ch,font=f) for ch in text)+track*(len(text)-1)

def build(photo_path,out_path,theme="light",k=1.0,crop_right=0.12,pscale=0.88,bigw=580):
    W,H=int(1080*k),int(1620*k)
    def font(name,size): return ImageFont.truetype(F+name,int(round(size*k)))
    def fit_font(d,text,name,target_w,track=0,lo=50,hi=900):
        while lo<hi:
            mid=(lo+hi+1)//2
            if tracked_w(d,text,ImageFont.truetype(F+name,mid),track)<=target_w: lo=mid
            else: hi=mid-1
        return ImageFont.truetype(F+name,lo)
    dark = theme=="dark"
    ink = WHITE if dark else CHAR
    sub = LIGHTG if dark else DAVI
    faint = GREY
    src=Image.open(photo_path).convert("RGB")
    sw,sh=src.size
    src=src.crop((0,0,int(sw*(1-crop_right)),sh))
    ph=int(H*pscale); pw=int(src.width*ph/src.height)
    photo=src.resize((pw,ph),Image.LANCZOS)
    canvas=Image.new("RGB",(W,H))
    # extend the seamless backdrop across the whole canvas from the photo's left edge
    strip=photo.crop((0,0,int(40*k),ph)).resize((W,H),Image.BILINEAR).filter(ImageFilter.GaussianBlur(12*k))
    canvas.paste(strip,(0,0))
    px=W-pw; py=H-int(36*k)-ph
    from PIL import ImageChops
    fl=int(140*k); ft=int(60*k)
    mL=Image.new("L",(pw,ph),255); mT=Image.new("L",(pw,ph),255)
    dL=ImageDraw.Draw(mL); dT=ImageDraw.Draw(mT)
    for i in range(fl): dL.line([(i,0),(i,ph)],fill=int(255*i/fl))
    for i in range(ft): dT.line([(0,i),(pw,i)],fill=int(255*i/ft))
    mask=ImageChops.darker(mL,mT)
    canvas.paste(photo,(px,py),mask)
    d=ImageDraw.Draw(canvas)
    M=int(72*k)
    # logo top-left (brand guideline: white/black version, no effects)
    logo=make_logo(color=ink,scale=8); lw=int(300*k); logo=logo.resize((lw,int(logo.height*lw/logo.width)),Image.LANCZOS)
    canvas.paste(logo,(M,int(64*k)),logo)
    f_handle=font("Arimo-Regular.ttf",22)
    t="@toniblack.id"; d.text((W-M-d.textlength(t,font=f_handle),int(70*k)),t,font=f_handle,fill=sub)

    f_eyebrow=font("ZalandoSansExpanded-SemiBold.ttf",28)
    f_save=font("ZalandoSansExpanded-Bold.ttf",50)
    f_big=fit_font(d,"40%","ZalandoSansExpanded-Black.ttf",int(bigw*k),track=int(-6*k))
    f_line=font("Arimo-Regular.ttf",34)
    f_ben=font("Arimo-Regular.ttf",31)
    f_cta=font("ZalandoSansExpanded-Bold.ttf",28)
    f_tc=font("Arimo-Regular.ttf",21)
    big_bb=d.textbbox((0,0),"40%",font=f_big); big_h=big_bb[3]-big_bb[1]
    g=lambda v:int(v*k)
    total = g(28+16) + g(50+10) + big_h+g(24) + g(34+30) + g(31+14) + g(31+34) + g(74+18) + g(21)
    y = H - M - total; x = M
    d.rectangle([x,y+g(13),x+g(36),y+g(15)],fill=ink)
    tracked(d,(x+g(52),y-g(2)),"9.9 SALE",f_eyebrow,ink,track=g(5))
    y += g(28+16)
    tracked(d,(x,y-g(6)),"SAVE UP TO",f_save,ink,track=g(9))
    y += g(50+10)
    tracked(d,(x-big_bb[0],y-big_bb[1]),"40%",f_big,ink,track=g(-6))
    y += big_h+g(24)
    d.text((x,y),"Trunks built to hold their shape.",font=f_line,fill=sub)
    y += g(34+30)
    for i,b in enumerate(["Free shipping","Extra IDR 5K voucher for new buyers"]):
        d.rectangle([x,y+g(12),x+g(8),y+g(20)],fill=ink)
        d.text((x+g(24),y),b,font=f_ben,fill=ink)
        y += g(31)+(g(14) if i==0 else g(34))
    cw=int(tracked_w(d,"SHOP NOW",f_cta,g(4)))+2*g(48); ch=g(74)
    d.rounded_rectangle([x,y,x+cw,y+ch],radius=ch//2,fill=ink)
    tracked(d,(x+g(48),y+(ch-g(28))//2-g(4)),"SHOP NOW",f_cta,(CHAR if dark else WHITE),track=g(4))
    y += ch+g(18)
    d.text((x,y),"*Terms & conditions apply",font=f_tc,fill=faint)
    canvas.save(out_path,quality=95)
    return canvas

if __name__=="__main__":
    photo,out,theme=sys.argv[1],sys.argv[2],sys.argv[3]
    cr=float(sys.argv[4]) if len(sys.argv)>4 else 0.12
    ps=float(sys.argv[5]) if len(sys.argv)>5 else 0.88
    bw=int(sys.argv[6]) if len(sys.argv)>6 else 580
    k=float(sys.argv[7]) if len(sys.argv)>7 else 1.0
    im=build(photo,out,theme,k=k,crop_right=cr,pscale=ps,bigw=bw)
    im.resize((540,810),Image.LANCZOS).save(out.rsplit(".",1)[0]+"_preview.jpg",quality=85)
    print(out, im.size)
