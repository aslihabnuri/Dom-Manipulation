import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from logo import make_logo
from compose_alt_a import tracked, tracked_w, invert_icon
import icons
F="fonts/static/"; BG=(40,40,40); WHITE=(255,255,255); STEEL=(204,204,204)
def build(photo_path,out_path,k=1.0,head_y=0.075,crop_top=300,ext_top=600,label_y=0.65,run_y=0.72,icon_y=0.78,
          headline=("MADE FOR","EVERY BODY."),sub="Three cuts. Six sizes.",
          products=(("MODAL CLOUD BRIEF",0.19),("BOXER BRIEF",0.50),("BOXER",0.81)),sizes=("S","M","L","XL","XXL","XXXL")):
    W,H=int(1600*k),int(2400*k); g=lambda v:int(round(v*k))
    def font(name,size): return ImageFont.truetype(F+name,g(size))
    def fit_font(d,text,name,target_w,track=0,lo=40,hi=700):
        while lo<hi:
            mid=(lo+hi+1)//2
            if tracked_w(d,text,ImageFont.truetype(F+name,mid),track)<=target_w: lo=mid
            else: hi=mid-1
        return ImageFont.truetype(F+name,lo)
    full=Image.open(photo_path).convert("RGB"); full=full.resize((W,int(full.height*W/full.width+0.5)),Image.LANCZOS)
    src=full.crop((0,g(crop_top),W,full.height)); ET=g(ext_top)
    canvas=full.resize((W,H),Image.LANCZOS).filter(ImageFilter.GaussianBlur(g(30)))
    mask=Image.new("L",(W,src.height),255); md=ImageDraw.Draw(mask); fe=g(300)
    for i in range(fe): md.line([(0,i),(W,i)],fill=int(255*i/fe)); md.line([(0,src.height-1-i),(W,src.height-1-i)],fill=int(255*i/fe))
    canvas.paste(src,(0,ET),mask); d=ImageDraw.Draw(canvas); C=W//2
    logo=make_logo(color=WHITE,scale=8); lw=g(300); logo=logo.resize((lw,int(logo.height*lw/logo.width)),Image.LANCZOS); canvas.paste(logo,(C-lw//2,g(64)),logo)
    f_h=fit_font(d,headline[1],"ZalandoSansExpanded-Black.ttf",int(W*0.70),track=g(-3)); y=int(H*head_y); hb=None
    for t in headline:
        hb=d.textbbox((0,0),t,font=f_h); w=tracked_w(d,t,f_h,g(-3)); tracked(d,(C-w//2-hb[0],y-hb[1]),t,f_h,WHITE,track=g(-3)); y+=int((hb[3]-hb[1])*1.0)+g(14)
    f_s=font("Arimo-Regular.ttf",max(30,int((hb[3]-hb[1])/g(1)/5.5))); sb=d.textbbox((0,0),sub,font=f_s); sl=int((sb[3]-sb[1])*1.5)
    y+=sl*2-g(14); d.text((C-d.textlength(sub,font=f_s)/2-sb[0],y-sb[1]),sub,font=f_s,fill=STEEL)
    # product names under each garment
    f_p=font("ZalandoSansExpanded-SemiBold.ttf",22); ly=int(H*label_y)
    for name,fx in products:
        pb=d.textbbox((0,0),name,font=f_p); w=tracked_w(d,name,f_p,g(3)); cx=int(W*fx); tracked(d,(cx-w//2-pb[0],ly-pb[1]),name,f_p,WHITE,track=g(3))
    # size run
    M=g(100); f_z=font("ZalandoSansExpanded-SemiBold.ttf",34); n=len(sizes); cw=(W-2*M)/n; ry=int(H*run_y)
    for i,sz in enumerate(sizes):
        zb=d.textbbox((0,0),sz,font=f_z); w=tracked_w(d,sz,f_z,g(3)); cx=int(M+cw*(i+0.5)); tracked(d,(cx-w//2-zb[0],ry-zb[1]),sz,f_z,WHITE,track=g(3))
    size=g(112); f_i=font("ZalandoSansExpanded-SemiBold.ttf",18); iy=int(H*icon_y)
    for i,(label,fn) in enumerate(icons.ICONS):
        ic=invert_icon(fn(size)); cx=int(M+cw*(i+0.5)); canvas.paste(ic,(cx-size//2,iy),ic); yy=iy+size+g(22)
        for line in label.split("\n"):
            lb=d.textbbox((0,0),line,font=f_i); w=tracked_w(d,line,f_i,g(2)); tracked(d,(cx-w//2-lb[0],yy-lb[1]),line,f_i,WHITE,track=g(2)); yy+=int((lb[3]-lb[1])*1.45)
    print("photo",ET,ET+src.height,"labels",ly,"run",ry,"icons",iy,"end",yy)
    canvas.save(out_path); return canvas
if __name__=="__main__":
    a=sys.argv; build(a[1],a[2],*(float(v) for v in a[3:]))
