"""Toni Black 'Made For Him and Him' banner (Shopee / TikTok Shop). 2:3 1080x1620 and 1:1 1080x1080.
Photo: father and son high-five on a white seamless; the wall is extended so the type gets its own field."""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
sys.path.insert(1,"/home/user/Dom-Manipulation/banner-bau-toni-black/scripts")
from logo import make_logo
import grade as G
F="fonts/static/"; C282=(40,40,40); WHITE=(255,255,255); C81=(129,130,132)
def tracked(d,xy,t,f,fill,track=0):
    x,y=xy
    for ch in t: d.text((x,y),ch,font=f,fill=fill); x+=d.textlength(ch,font=f)+track
def tw(d,t,f,track=0): return sum(d.textlength(ch,font=f) for ch in t)+track*(len(t)-1)
def cb(d,t,f): return d.textbbox((0,0),t,font=f)
font=lambda n,z: ImageFont.truetype(F+n,max(1,int(round(z))))
def fit(d,t,name,target,trk=0.0,lo=10,hi=600):
    while lo<hi:
        m=(lo+hi+1)//2; f=font(name,m)
        if tw(d,t,f,m*trk)<=target: lo=m
        else: hi=m-1
    return lo
def graded_photo():
    """BAU look: the same global grade as the other banners (contrast, -12% chroma, cool highlights)."""
    im=np.asarray(Image.open("gen/himhim_a_0.png").convert("RGB")).astype(np.float64)
    lab=G.srgb_to_lab(im); L=np.clip(lab[...,0]/100,0,1); Lc=np.clip(0.5+(L-0.5)*1.10-0.02,0,1); lab[...,0]=Lc*100; lab[...,1:]*=0.88
    hi=np.clip((Lc-0.6)/0.4,0,1); lab[...,2]-=3.0*hi
    return Image.fromarray(G.lab_to_srgb(lab).astype("uint8"))
def plate(W,H,photo,pw,px,py):
    """photo scaled to width pw at (px,py); wall/floor extended from the photo's own edges."""
    s=pw/photo.width; ph=int(photo.height*s+0.5); p=photo.resize((pw,ph),Image.LANCZOS)
    out=p.resize((W,H),Image.BILINEAR).filter(ImageFilter.GaussianBlur(40))     # smooth tonal base
    top=p.crop((0,0,pw,6)).resize((W,max(1,py)+40),Image.BILINEAR).filter(ImageFilter.GaussianBlur(8)); out.paste(top,(0,0))
    bot=p.crop((0,ph-6,pw,ph)).resize((W,max(1,H-py-ph)+40),Image.BILINEAR).filter(ImageFilter.GaussianBlur(8)); out.paste(bot,(0,py+ph-40))
    l=p.crop((0,0,6,ph)).resize((max(1,px)+40,ph),Image.BILINEAR).filter(ImageFilter.GaussianBlur(8)); out.paste(l,(0,py))
    r=p.crop((pw-6,0,pw,ph)).resize((max(1,W-px-pw)+40,ph),Image.BILINEAR).filter(ImageFilter.GaussianBlur(8)); out.paste(r,(px+pw-40,py))
    m=Image.new("L",(pw,ph),255); md=ImageDraw.Draw(m); fe=40
    for i in range(fe):
        v=int(255*i/fe); md.line([(i,0),(i,ph)],fill=v); md.line([(pw-1-i,0),(pw-1-i,ph)],fill=v); md.line([(0,i),(pw,i)],fill=v); md.line([(0,ph-1-i),(pw,ph-1-i)],fill=v)
    out.paste(p,(px,py),m); return out
def block(cv,x,y,width,align="c",head=44,kick=30,num_w=560,ben=24,cta=60,gap=(34,26,10,30,30),one_line_benefits=True):
    """masthead lockup: header / SAVE UP TO / 25% / benefits / CTA. Returns bottom y."""
    d=ImageDraw.Draw(cv); C=x+width//2
    def put(t,f,yy,fill=C282,trk=0.0):
        w=tw(d,t,f,f.size*trk); b=cb(d,t,f); xx={"c":C-w/2,"l":x}[align]; tracked(d,(xx-b[0],yy-b[1]),t,f,fill,f.size*trk); return yy+(b[3]-b[1])
    hs=min(head,fit(d,"MADE FOR HIM AND HIM","ZalandoSansExpanded-Regular.ttf",width,0.12)); fh=font("ZalandoSansExpanded-Regular.ttf",hs)
    y=put("MADE FOR HIM AND HIM",fh,y,trk=0.12)+gap[0]
    fk=font("ZalandoSansExpanded-SemiBold.ttf",kick); y=put("SAVE UP TO",fk,y,trk=0.18)+gap[2]
    ns=fit(d,"25%","ZalandoSansExpanded-Black.ttf",min(num_w,width),-0.02); fn=font("ZalandoSansExpanded-Black.ttf",ns); y=put("25%",fn,y,trk=-0.02)+gap[3]
    fb=font("Arimo-Regular.ttf",ben)
    if one_line_benefits: y=put("Free shipping  ·  Extra IDR 5K voucher for new buyers",fb,y)+gap[4]
    else:
        for t in ("Free shipping","Extra IDR 5K voucher for new buyers"): y=put(t,fb,y)+int(ben*0.5)
        y+=gap[4]-int(ben*0.5)
    fc=font("ZalandoSansExpanded-Bold.ttf",int(cta*0.4)); w=tw(d,"SHOP NOW",fc,fc.size*0.15)+cta*1.4; cx={"c":C-w/2,"l":x}[align]
    d.rounded_rectangle([cx,y,cx+w,y+cta],radius=cta//2,fill=C282); b=cb(d,"SHOP NOW",fc)
    tracked(d,(cx+cta*0.7-b[0],y+(cta-(b[3]-b[1]))//2-b[1]),"SHOP NOW",fc,WHITE,fc.size*0.15)
    return y+cta
def terms(cv,x,y,size=16,align="c",width=None):
    d=ImageDraw.Draw(cv); f=font("Arimo-Regular.ttf",size); t="*Terms & conditions apply"; b=cb(d,t,f); w=b[2]-b[0]
    xx=x+ (width-w)//2 if align=="c" else x; d.text((xx-b[0],y-b[1]),t,font=f,fill=C81)
def logo_at(cv,cx,y,w):
    lg=make_logo(C282,8); lg=lg.resize((w,int(lg.height*w/lg.width)),Image.LANCZOS); cv.paste(lg,(int(cx-w/2),y),lg); return y+lg.height
def build_23(out):
    W,H=1080,1620; ph=graded_photo(); pw=int(W*0.78); s=pw/ph.width; phh=int(ph.height*s+0.5)
    py=H-40-phh; px=(W-pw)//2; cv=plate(W,H,ph,pw,px,py)
    hands=py+int(0.197*phh)                      # first subject row in the photo
    yb=logo_at(cv,W//2,56,300)+40
    yb=block(cv,80,yb,W-160,"c",head=44,kick=30,num_w=560,ben=24,cta=60)
    terms(cv,0,H-44,16,"c",W)
    print("2:3 block ends",yb,"hands start",hands,"margin",hands-yb)
    cv.save(out,quality=94,optimize=True); return cv
def build_11(out):
    W,H=1080,1080; ph=graded_photo(); phh=int(H*0.84); s=phh/ph.height; pw=int(ph.width*s+0.5)
    px=W-40-pw; py=(H-phh)//2; cv=plate(W,H,ph,pw,px,py)
    col_w=px-60-64; x=64
    yb=logo_at(cv,x+130,64,260)+44
    yb=block(cv,x,yb,col_w,"l",head=40,kick=26,num_w=col_w,ben=22,cta=56,one_line_benefits=False)
    terms(cv,x,yb+26,15,"l")
    print("1:1 photo x",px,"col width",col_w,"block ends",yb)
    cv.save(out,quality=94,optimize=True); return cv
if __name__=="__main__":
    build_23("out/himhim_23.jpg"); build_11("out/himhim_11.jpg")
