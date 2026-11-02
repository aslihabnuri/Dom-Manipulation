"""'Made For Him and Him', BAU structure: hero SAVE UP TO / 25% top-left at BAU scale, the message mid-left,
the offer block (benefits, SHOP NOW pill, terms) bottom-left; photo right, wall extended. BAU global grade."""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy.ndimage import binary_dilation, binary_opening
sys.path.insert(1,"/home/user/Dom-Manipulation/banner-bau-toni-black/scripts")
from logo import make_logo
from compose_himhim import graded_photo, plate, tracked, tw, cb, font, fit
C282=(40,40,40); WHITE=(255,255,255); C81=(129,130,132)
def hero(d,x,y,numw):
    fn=font("ZalandoSansExpanded-Black.ttf",fit(d,"25%","ZalandoSansExpanded-Black.ttf",numw,-0.02)); nb=cb(d,"25%",fn); nh=nb[3]-nb[1]
    fk=font("ZalandoSansExpanded-Bold.ttf",fit(d,"SAVE UP TO","ZalandoSansExpanded-Bold.ttf",numw,0.17,hi=90)); kb=cb(d,"SAVE UP TO",fk)
    tracked(d,(x-kb[0],y-kb[1]),"SAVE UP TO",fk,C282,fk.size*0.17); y+=kb[3]-kb[1]+int(fk.size*0.3)
    tracked(d,(x-nb[0],y-nb[1]),"25%",fn,C282,fn.size*-0.02); return y+nh
def message(d,x,y,size):
    f=font("ZalandoSansExpanded-Regular.ttf",size); c=cb(d,"H",f); ch=c[3]-c[1]
    for t in ("Made For","Him and Him"): tracked(d,(x-cb(d,t,f)[0],y-c[1]),t,f,C282,size*0.02); y+=int(ch*1.25)+6
    return y
def offer(d,x,base,ben=26,cta=70):
    """bottom-left block, grows upward from `base` (terms baseline)."""
    ft=font("Arimo-Regular.ttf",20); t="*Terms & conditions apply"; b=cb(d,t,ft); d.text((x-b[0],base-(b[3]-b[1])-b[1]),t,font=ft,fill=C81)
    y=base-(b[3]-b[1])-22-cta
    fc=font("ZalandoSansExpanded-Bold.ttf",26); w=tw(d,"SHOP NOW",fc,4)+92; d.rounded_rectangle([x,y,x+w,y+cta],radius=cta//2,fill=C282)
    b=cb(d,"SHOP NOW",fc); tracked(d,(x+46-b[0],y+(cta-(b[3]-b[1]))//2-b[1]),"SHOP NOW",fc,WHITE,4)
    fb=font("Arimo-Regular.ttf",ben); y-=26
    for t in reversed(["Free shipping","Extra IDR 5K voucher","for new buyers"]):
        b=cb(d,t,fb); y-=(b[3]-b[1]); d.text((x-b[0],y-b[1]),t,font=fb,fill=C282); y-=int(ben*0.45)
    return y
def subject(cv,px,py,pw,ph_h):
    L=np.asarray(cv.convert("L")).astype(int); H,W=L.shape; m=np.zeros((H,W),bool)
    reg=L[py:py+ph_h,px:px+pw]; bg=np.median(np.concatenate([reg[:,:12],reg[:,-12:]],1),1)
    mm=(reg<bg[:,None]-30)|(reg>bg[:,None]+16); m[py:py+ph_h,px:px+pw]=binary_opening(mm,iterations=2); return m
def build(W,H,out,pw_frac,right,bottom,numw,hero_y,msg_y,msg_size,M=72,clear=24):
    ph=graded_photo(); pw=int(W*pw_frac); s=pw/ph.width; phh=int(ph.height*s+0.5); px=W-right-pw; py=H-bottom-phh
    cv=plate(W,H,ph,pw,px,py); d=ImageDraw.Draw(cv)
    lg=make_logo(C282,8); lw=336; lg=lg.resize((lw,int(lg.height*lw/lg.width)),Image.LANCZOS); cv.paste(lg,((W-lw)//2,64),lg)
    hb=hero(d,M,int(H*hero_y),numw)
    mb=message(d,M,int(H*msg_y),msg_size)
    ob=offer(d,M,H-M-20)
    base=plate(W,H,ph,pw,px,py); subj=binary_dilation(subject(base,px,py,pw,phh),iterations=clear); txt=np.abs(np.asarray(cv.convert("L")).astype(int)-np.asarray(base.convert("L")).astype(int))>40
    print(f"{W}x{H}: photo x {px}-{px+pw} y {py}-{py+phh} | hero ends {hb} | message {int(H*msg_y)}-{mb} | offer top {ob} | type px within {clear}px of subject: {int((txt&subj).sum())}")
    cv.save(out,quality=94,optimize=True); return cv
if __name__=="__main__":
    build(1080,1620,"out/himhim2_23.jpg",pw_frac=0.70,right=0,bottom=36,numw=780,hero_y=0.15,msg_y=0.50,msg_size=40)
    build(1080,1080,"out/himhim2_11.jpg",pw_frac=0.58,right=0,bottom=24,numw=600,hero_y=0.15,msg_y=0.50,msg_size=34)
