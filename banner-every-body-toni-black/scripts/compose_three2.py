import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from logo import make_logo
from compose_alt_a import tracked, tracked_w, invert_icon
import icons
F="fonts/static/"; BG=(40,40,40); WHITE=(255,255,255); STEEL=(204,204,204)
# vertical rhythm on a 24 px unit; measured from the top edge
def build(photo_path,out_path,k=1.0,top=120,logo_w=340,gap_logo=96,gap_head=56,gap_sub=120,gap_names=84,gap_run=112,gap_grid=132,grid_pitch=160,
          crop_top=300,prod_top_frac=0.37,prod_bot_frac=0.66,
          headline=("MADE FOR","EVERY BODY."),sub="WHATEVER YOUR SHAPE, IT FITS",sub_track=4,
          products=(("BRIEF",0.19),("BOXER BRIEF",0.50),("BOXER",0.81)),sizes=("S","M","L","XL","XXL","XXXL")):
    W,H=int(1600*k),int(2400*k); g=lambda v:int(round(v*k)); C=W//2
    def font(name,size): return ImageFont.truetype(F+name,g(size))
    def fit_font(d,text,name,target_w,track=0,lo=40,hi=700):
        while lo<hi:
            mid=(lo+hi+1)//2
            if tracked_w(d,text,ImageFont.truetype(F+name,mid),track)<=target_w: lo=mid
            else: hi=mid-1
        return ImageFont.truetype(F+name,lo)
    # --- measure the type block first
    probe=ImageDraw.Draw(Image.new("RGB",(10,10)))
    f_h=fit_font(probe,headline[1],"ZalandoSansExpanded-Black.ttf",int(W*0.70),track=g(-3))
    hb=probe.textbbox((0,0),headline[1],font=f_h); hl=hb[3]-hb[1]
    f_s=font("Arimo-Regular.ttf",int(hl/g(1)*0.44)); sb=probe.textbbox((0,0),sub,font=f_s); sh=sb[3]-sb[1]
    logo=make_logo(color=WHITE,scale=8); lw=g(logo_w); logo=logo.resize((lw,int(logo.height*lw/logo.width)),Image.LANCZOS)
    y_logo=g(top); y_head=y_logo+logo.height+g(gap_logo); y_sub=y_head+2*hl+g(14)+g(gap_head)
    y_prod=y_sub+sh+g(gap_sub)
    # --- photo placed so the garments start at y_prod
    full=Image.open(photo_path).convert("RGB"); full=full.resize((W,int(full.height*W/full.width+0.5)),Image.LANCZOS)
    src=full.crop((0,g(crop_top),W,full.height)); ET=y_prod-int(full.height*prod_top_frac)+g(crop_top)
    canvas=full.resize((W,H),Image.LANCZOS).filter(ImageFilter.GaussianBlur(g(30)))
    mask=Image.new("L",(W,src.height),255); md=ImageDraw.Draw(mask); fe=g(300)
    for i in range(fe): md.line([(0,i),(W,i)],fill=int(255*i/fe)); md.line([(0,src.height-1-i),(W,src.height-1-i)],fill=int(255*i/fe))
    canvas.paste(src,(0,ET),mask); d=ImageDraw.Draw(canvas)
    y_prod_bot=ET+int(full.height*prod_bot_frac)-g(crop_top)
    # --- type
    canvas.paste(logo,(C-lw//2,y_logo),logo)
    y=y_head
    for t in headline:
        b=d.textbbox((0,0),t,font=f_h); w=tracked_w(d,t,f_h,g(-3)); tracked(d,(C-w//2-b[0],y-b[1]),t,f_h,WHITE,track=g(-3)); y+=hl+g(14)
    sw=tracked_w(d,sub,f_s,g(sub_track)); tracked(d,(C-sw//2-sb[0],y_sub-sb[1]),sub,f_s,STEEL,track=g(sub_track))
    f_p=font("ZalandoSansExpanded-SemiBold.ttf",28); y_names=y_prod_bot+g(gap_names)
    for name,fx in products:
        b=d.textbbox((0,0),name,font=f_p); w=tracked_w(d,name,f_p,g(4)); cx=int(W*fx); tracked(d,(cx-w//2-b[0],y_names-b[1]),name,f_p,WHITE,track=g(4))
    M=g(100); f_z=font("ZalandoSansExpanded-SemiBold.ttf",40); n=len(sizes); cw=(W-2*M)/n
    pb=d.textbbox((0,0),"BOXER",font=f_p); y_run=y_names+(pb[3]-pb[1])+g(gap_run)
    for i,sz in enumerate(sizes):
        b=d.textbbox((0,0),sz,font=f_z); w=tracked_w(d,sz,f_z,g(3)); cx=int(M+cw*(i+0.5)); tracked(d,(cx-w//2-b[0],y_run-b[1]),sz,f_z,WHITE,track=g(3))
    zb=d.textbbox((0,0),"XL",font=f_z); y_grid=y_run+(zb[3]-zb[1])+g(gap_grid)
    size=g(112); f_i=font("ZalandoSansExpanded-SemiBold.ttf",24); bw=int(W*0.70); cwid=bw//2; x0=C-bw//2; pitch=g(grid_pitch)
    for i,(label,fn) in enumerate(icons.ICONS):
        col,row=i//3,i%3; ic=invert_icon(fn(size)); x=x0+col*cwid+g(40); y0=y_grid+row*pitch
        canvas.paste(ic,(x,y0),ic); text=label.replace("\n"," "); b=d.textbbox((0,0),text,font=f_i)
        tracked(d,(x+size+g(32)-b[0],y0+size//2-(b[3]-b[1])//2-b[1]),text,f_i,WHITE,track=g(2))
    y_end=y_grid+2*pitch+size
    print(f"logo {y_logo} head {y_head} sub {y_sub} sub_size {f_s.size} prod {y_prod}-{y_prod_bot} names {y_names} run {y_run} grid {y_grid} end {y_end} bottom {H-y_end}")
    canvas.save(out_path); return canvas
if __name__=="__main__":
    a=sys.argv; build(a[1],a[2],*(float(v) for v in a[3:]))
