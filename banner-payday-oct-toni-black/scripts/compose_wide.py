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
CROP_FULL=(0,400,1334,1930)
def plate(W,H,crop=CROP_FULL,right=48):
    cv=Image.open("gen/payday3_canvas.png").convert("RGB").crop(crop)
    s=H/cv.height; cv=cv.resize((int(cv.width*s+0.5),H),Image.LANCZOS); px=W-right-cv.width
    out=cv.crop((0,0,3,H)).resize((W,H),Image.BILINEAR).filter(ImageFilter.GaussianBlur(3))
    rs=cv.crop((cv.width-3,0,cv.width,H)).resize((right+10,H),Image.BILINEAR).filter(ImageFilter.GaussianBlur(3)); out.paste(rs,(W-right-10,0))
    m=Image.new("L",cv.size,255); md=ImageDraw.Draw(m); fe=6
    for i in range(fe): md.line([(i,0),(i,H)],fill=int(255*i/fe)); md.line([(cv.width-1-i,0),(cv.width-1-i,H)],fill=int(255*i/fe))
    out.paste(cv,(px,0),m); return out,px,s
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

def subject_mask(W,H,px,s,crop=CROP_FULL):
    from scipy.ndimage import binary_opening
    L=np.asarray(Image.open("gen/payday3_canvas.png").convert("L").crop(crop)).astype(int)
    bgrow=np.median(np.concatenate([L[:,-60:],L[:,0:20]],1),1)
    m=(L<bgrow[:,None]-28)|(L>bgrow[:,None]+14); m=binary_opening(m,iterations=2)
    mm=Image.fromarray((m*255).astype(np.uint8)).resize((int(m.shape[1]*s+0.5),H),Image.BILINEAR)
    out=np.zeros((H,W),bool); a=np.asarray(mm)>60; out[:,px:px+a.shape[1]]=a[:, :W-px]; return out
def fit_offer(W,H,subj,x,y,kick,lo=40,hi=200):
    size=hi
    while size>lo:
        t=Image.new("RGB",(W,H),(0,0,0)); td=ImageDraw.Draw(t); offer(td,x,y,kick,size,col=(255,255,255))
        if not (np.asarray(t)[...,0]>0)[subj].any(): return size
        size-=2
    return size
def check(cv_text,W,H,subj):
    return 0
def app(out,clear=34):
    from scipy.ndimage import binary_dilation
    W,H=1200,400; cv,px,s=plate(W,H,right=48); M=64
    subj=binary_dilation(subject_mask(W,H,px,s),iterations=clear)
    probe=ImageDraw.Draw(Image.new("RGB",(W,H)))
    _,hw=lockup_head(probe,M,150,28); xb=M+int(hw)+60
    size=fit_offer(W,H,subj,xb,150,20,hi=150)
    d=ImageDraw.Draw(cv); logo(cv,M,56,200)
    yh=150; hb,hw=lockup_head(d,M,yh,28)
    nb,ne=offer(d,xb,yh,20,size)
    db,dw=dates(d,xb,nb+26,16)
    uy,_=shop(d,M,db,16)
    terms(d,M,uy+22,12)
    print("app: figure x",px,"to",W-48,"| numeral",size,"offer right",int(ne))
    cv.save(out,quality=92,optimize=True); return cv,subject_mask(W,H,px,s)
def web(out,clear=16):
    from scipy.ndimage import binary_dilation
    W,H=992,165; cv,px,s=plate(W,H,right=36); M=40
    subj=binary_dilation(subject_mask(W,H,px,s),iterations=clear)
    d=ImageDraw.Draw(cv)
    lb=logo(cv,M,36,140)
    hb,hw=lockup_head(d,M,lb+24,15)
    xb=M+max(140,int(hw))+56
    size=fit_offer(W,H,subj,xb,34,11,hi=92)
    nb,ne=offer(d,xb,34,11,size)
    xc=int(ne)+48
    db,dw=dates(d,xc,34,11)
    uy,_=shop(d,xc,nb,11)
    terms(d,xc,uy+12,10)
    print("web: figure x",px,"to",W-36,"| numeral",size,"col C right",xc+int(dw))
    cv.save(out,quality=92,optimize=True); return cv,subject_mask(W,H,px,s)
if __name__=="__main__":
    app("out/payday_app_1200x400.jpg"); web("out/payday_web_992x165.jpg")
