"""'Made For Him and Him' v3: figures cut out and set large on the right; header and hero at poster scale on the
left axis, hero set behind the raised arms (type-behind-subject, as in BAU); offer block bottom-left."""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
sys.path.insert(1,"/home/user/Dom-Manipulation/banner-bau-toni-black/scripts")
from logo import make_logo
from compose_himhim import graded_photo, tracked, tw, cb, font, fit
C282=(40,40,40); WHITE=(255,255,255); C81=(129,130,132)
def figures():
    """graded photo + rembg alpha, cropped to the pair."""
    rgb=graded_photo(); a=Image.open("gen/himhim_a_cutout.png").split()[3]
    fig=rgb.copy(); fig.putalpha(a); bb=a.getbbox(); return fig.crop(bb)
def wall(W,H,src_rows):
    """vertical gradient from the photo's own wall: per-row median of non-subject pixels, resampled to H."""
    rgb=np.asarray(graded_photo()).astype(float); a=np.asarray(Image.open("gen/himhim_a_cutout.png").split()[3])<10
    rows=np.array([np.median(rgb[y][a[y]],axis=0) if a[y].sum()>50 else [np.nan]*3 for y in range(rgb.shape[0])])
    for c in range(3):
        v=rows[:,c]; idx=np.where(~np.isnan(v))[0]; rows[:,c]=np.interp(np.arange(len(v)),idx,v[idx])
    y0,y1=src_rows; sel=rows[int(y0*rgb.shape[0]):int(y1*rgb.shape[0])]
    col=np.array([np.interp(np.linspace(0,len(sel)-1,H),np.arange(len(sel)),sel[:,c]) for c in range(3)]).T
    im=np.repeat(col[None,:,:],W,axis=0).transpose(1,0,2); return Image.fromarray(im.astype(np.uint8))
def shadow(cv,cx,cy,w,h,alpha=70):
    s=Image.new("L",(w+120,h+120),0); ImageDraw.Draw(s).ellipse([60,60,60+w,60+h],fill=alpha); s=s.filter(ImageFilter.GaussianBlur(22))
    cv.paste(Image.new("RGB",s.size,(60,58,56)),(int(cx-s.width/2),int(cy-s.height/2)),s)
def header(d,x,y,width,lines=("MADE FOR","HIM AND HIM")):
    z=fit(d,lines[1],"ZalandoSansExpanded-Regular.ttf",width,0.12); f=font("ZalandoSansExpanded-Regular.ttf",z); c=cb(d,"H",f); ch=c[3]-c[1]
    for t in lines: tracked(d,(x-cb(d,t,f)[0],y-c[1]),t,f,C282,z*0.12); y+=int(ch*1.45)
    return y-int(ch*1.45)+ch, z
def hero(d,x,y,numw):
    fn=font("ZalandoSansExpanded-Black.ttf",fit(d,"25%","ZalandoSansExpanded-Black.ttf",numw,-0.02)); nb=cb(d,"25%",fn)
    fk=font("ZalandoSansExpanded-Bold.ttf",fit(d,"SAVE UP TO","ZalandoSansExpanded-Bold.ttf",numw,0.17,hi=90)); kb=cb(d,"SAVE UP TO",fk)
    tracked(d,(x-kb[0],y-kb[1]),"SAVE UP TO",fk,C282,fk.size*0.17); y+=kb[3]-kb[1]+int(fk.size*0.3)
    tracked(d,(x-nb[0],y-nb[1]),"25%",fn,C282,fn.size*-0.02); return y+nb[3]-nb[1]
def offer(d,x,base,ben=22,cta=60,ctaf=24):
    ft=font("Arimo-Regular.ttf",16); t="*Terms & conditions apply"; b=cb(d,t,ft); d.text((x-b[0],base-(b[3]-b[1])-b[1]),t,font=ft,fill=C81)
    y=base-(b[3]-b[1])-20-cta; fc=font("ZalandoSansExpanded-Bold.ttf",ctaf); w=tw(d,"SHOP NOW",fc,3)+int(cta*1.3)
    d.rounded_rectangle([x,y,x+w,y+cta],radius=cta//2,fill=C282); b=cb(d,"SHOP NOW",fc); tracked(d,(x+int(cta*0.65)-b[0],y+(cta-(b[3]-b[1]))//2-b[1]),"SHOP NOW",fc,WHITE,3)
    fb=font("Arimo-Regular.ttf",ben); y-=24
    for t in reversed(["Free shipping","Extra IDR 5K voucher","for new buyers"]):
        b=cb(d,t,fb); y-=(b[3]-b[1]); d.text((x-b[0],y-b[1]),t,font=fb,fill=C282); y-=int(ben*0.45)
    return y, x+w
def build(W,H,out,fig_h,fig_right,fig_bottom,M,logo_w,head_y,head_w,hero_y,numw,base_off,ben,cta,ctaf,behind=True):
    fig=figures(); s=fig_h/fig.height; fw=int(fig.width*s+0.5); f=fig.resize((fw,fig_h),Image.LANCZOS)
    fx=fig_right-fw; fy=fig_bottom-fig_h
    cv=wall(W,H,(0.0,1.0)); d=ImageDraw.Draw(cv)
    lg=make_logo(C282,8); lg=lg.resize((logo_w,int(lg.height*logo_w/lg.width)),Image.LANCZOS); cv.paste(lg,((W-logo_w)//2,56),lg)
    hb,hz=header(d,M,head_y,head_w)
    hero_bottom=hero(d,M,hero_y,numw) if behind else None
    # figures over the type (type-behind-subject); shadows first
    shadow(cv,fx+int(fw*0.72),fy+fig_h-6,int(fw*0.34),int(fig_h*0.03))
    shadow(cv,fx+int(fw*0.22),fy+fig_h-int(fig_h*0.02),int(fw*0.20),int(fig_h*0.02),alpha=40)
    cv.paste(f,(fx,fy),f); d=ImageDraw.Draw(cv)
    if not behind: hero_bottom=hero(d,M,hero_y,numw)
    ob,ox=offer(d,M,H-M-base_off,ben,cta,ctaf)
    # report overlaps of the hero with the figures
    alpha=np.zeros((H,W),bool); a=np.asarray(f.split()[3])>128; alpha[fy:fy+fig_h,fx:fx+fw]=a
    print(f"{W}x{H}: figures x {fx}-{fig_right} y {fy}-{fig_bottom} ({fig_h/H:.0%} of height) | header {hz}px ends {hb} | hero ends {hero_bottom} | offer {ob}-{H-M-base_off}, right edge {ox}, figures start {fx}")
    cv.save(out,quality=94,optimize=True); return cv
if __name__=="__main__":
    build(1080,1620,"out/himhim3_23.jpg",fig_h=940,fig_right=1050,fig_bottom=1580,M=72,logo_w=320,head_y=150,head_w=760,hero_y=400,numw=760,base_off=20,ben=22,cta=60,ctaf=24)
    build(1080,1080,"out/himhim3_11.jpg",fig_h=760,fig_right=1040,fig_bottom=1056,M=64,logo_w=280,head_y=130,head_w=380,hero_y=290,numw=380,base_off=24,ben=20,cta=54,ctaf=22,behind=False)
