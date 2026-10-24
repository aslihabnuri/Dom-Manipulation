"""Wide Payday banners (App 1200x400, Website 992x165) from the 1334x2000 portrait canvas.
Photo crop (head to waist) placed right; the studio wall is extended to the left; type in columns on the wall."""
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from logo import make_logo
F="fonts/static/"; C282=(40,40,40); C81=(129,130,132)
def tracked(d,xy,t,f,fill,track=0):
    x,y=xy
    for ch in t: d.text((x,y),ch,font=f,fill=fill); x+=d.textlength(ch,font=f)+track
def tw(d,t,f,track=0): return sum(d.textlength(ch,font=f) for ch in t)+track*(len(t)-1)
def cb(d,t,f): return d.textbbox((0,0),t,font=f)
font=lambda n,z: ImageFont.truetype(F+n,max(1,int(round(z))))
def plate(W,H,crop):
    cv=Image.open("gen/payday3_canvas.png").convert("RGB").crop(crop)
    s=H/cv.height; cv=cv.resize((int(cv.width*s+0.5),H),Image.LANCZOS); px=W-cv.width
    strip=cv.crop((0,0,8,H)).resize((px+80,H),Image.BILINEAR).filter(ImageFilter.GaussianBlur(6))
    out=Image.new("RGB",(W,H)); out.paste(strip,(0,0))
    m=Image.new("L",cv.size,255); md=ImageDraw.Draw(m)
    for i in range(60): md.line([(i,0),(i,H)],fill=int(255*i/60))
    out.paste(cv,(px,0),m); return out,px
def lockup_head(d,x,y,size,col=C282):
    f=font("ZalandoSansExpanded-Regular.ttf",size); tr=size*0.12; c=cb(d,"H",f); ch=c[3]-c[1]
    for t in ("PAYDAY.","WORTH THE WAIT."):
        tracked(d,(x-cb(d,t,f)[0],y-c[1]),t,f,col,tr); y+=int(ch*1.55)
    return y-int(ch*1.55)+ch, tw(d,"WORTH THE WAIT.",f,tr)
def offer(d,x,y,kick,num,col=C282):
    fk=font("ZalandoSansExpanded-SemiBold.ttf",kick); kc=cb(d,"H",fk)
    tracked(d,(x-cb(d,"SAVE UP TO",fk)[0],y-kc[1]),"SAVE UP TO",fk,col,kick*0.1); yn=y+(kc[3]-kc[1])+int(kick*0.8)
    fn=font("ZalandoSansExpanded-SemiBold.ttf",num); nc=cb(d,"3",fn); nw=tw(d,"35%",fn,-num*0.01)
    tracked(d,(x-cb(d,"35%",fn)[0],yn-nc[1]),"35%",fn,col,-num*0.01)
    fa=font("ZalandoSansExpanded-SemiBold.ttf",num*0.24); ab=cb(d,"*",fa); d.text((x+nw+num*0.03-ab[0],yn-ab[1]),"*",font=fa,fill=col)
    return yn+(nc[3]-nc[1]), x+nw+num*0.03+(ab[2]-ab[0])
def dates(d,x,y,size,col=C282):
    f=font("ZalandoSansExpanded-SemiBold.ttf",size); c=cb(d,"H",f); lh=c[3]-c[1]; lead=int(lh*1.7)
    for t in ("23 – 31","OCTOBER"): tracked(d,(x-cb(d,t,f)[0],y-c[1]),t,f,col,size*0.12); y+=lead
    return y-lead+lh, max(tw(d,t,f,size*0.12) for t in ("23 – 31","OCTOBER"))
def shop(d,x,base,size,col=C282):
    f=font("ZalandoSansExpanded-SemiBold.ttf",size); c=cb(d,"H",f); ch=c[3]-c[1]; w=tw(d,"SHOP NOW",f,size*0.12)
    tracked(d,(x-cb(d,"SHOP NOW",f)[0],base-ch-c[1]),"SHOP NOW",f,col,size*0.12)
    uy=base+max(3,int(size*0.4)); d.rectangle([x,uy,x+int(w),uy+max(1,int(round(size/16)))-1],fill=col); return uy, w
def terms(d,x,y,size):
    f=font("Arimo-Regular.ttf",size); t="*Terms & conditions apply"; b=cb(d,t,f); d.text((x-b[0],y-b[1]),t,font=f,fill=C81); return y+(b[3]-b[1]), b[2]-b[0]
def logo(cv,x,y,w):
    lg=make_logo(C282,8); lg=lg.resize((int(w),int(lg.height*w/lg.width)),Image.LANCZOS); cv.paste(lg,(int(x),int(y)),lg); return y+lg.height

def subject_mask(W,H,crop,px):
    cv=Image.open("gen/payday3_canvas.png").convert("L").crop(crop); s=H/cv.height; cv=cv.resize((int(cv.width*s+0.5),H),Image.LANCZOS)
    L=np.asarray(cv).astype(int); m=np.zeros((H,W),bool); m[:,px:]=(L<201)|(L>238); return m
def app(out,clear=30):
    from scipy.ndimage import binary_dilation
    W,H=1200,400; crop=(560,425,1334,1105); cv,px=plate(W,H,crop); M=64
    subj=binary_dilation(subject_mask(W,H,crop,px),iterations=clear)
    probe=ImageDraw.Draw(Image.new("RGB",(W,H)))
    _,hw=lockup_head(probe,M,150,26); xb=M+int(hw)+56
    size=150
    while size>60:
        t=Image.new("RGB",(W,H),(0,0,0)); td=ImageDraw.Draw(t); offer(td,xb,150,20,size,col=(255,255,255))
        if not (np.asarray(t)[...,0]>0)[subj].any(): break
        size-=2
    d=ImageDraw.Draw(cv); logo(cv,M,56,200)
    yh=150; hb,hw=lockup_head(d,M,yh,26)
    nb,ne=offer(d,xb,yh,20,size)
    db,dw=dates(d,xb,nb+26,16)
    uy,_=shop(d,M,db,16)
    terms(d,M,uy+22,12)
    print("app: numeral size",size,"offer right edge",int(ne),"photo starts",px,"dates bottom",db)
    cv.save(out,quality=92,optimize=True); return cv
def web(out):
    W,H=992,165; cv,px=plate(W,H,(560,440,1334,905)); d=ImageDraw.Draw(cv); M=40
    lb=logo(cv,M,36,140)
    hb,hw=lockup_head(d,M,lb+24,15)
    xb=M+max(140,int(hw))+52
    nb,ne=offer(d,xb,34,11,82)
    xc=int(ne)+44
    db,dw=dates(d,xc,34+0,11)
    uy,_=shop(d,xc,nb,11)
    terms(d,xc,uy+12,10)
    print("web: photo starts",px,"offer right edge",int(ne),"col C right",xc+int(dw),"headline bottom",hb)
    cv.save(out,quality=92,optimize=True); return cv
if __name__=="__main__":
    app("out/payday_app_1200x400.jpg"); web("out/payday_web_992x165.jpg")
