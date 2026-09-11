import numpy as np
from PIL import Image, ImageFilter, ImageDraw
from skimage import measure, morphology
src=np.asarray(Image.open("gen/alt_c_0.png").convert("RGB")).astype(float)
cut=np.asarray(Image.open("gen/alt_c_cutout.png")); alpha=cut[...,3].astype(float)/255
H,W=alpha.shape; seam=np.load("gen/alt_c_seam.npy")
# --- background plate: horizontal interpolation across a dilated foreground mask
fg=alpha>0.05; fgd=morphology.binary_dilation(fg,morphology.disk(18))
# include contact shadows: extend mask 60px below
sh=np.zeros_like(fgd); sh[60:]=fgd[:-60]; fgd|=sh
plate=src.copy()
for y in range(H):
    m=fgd[y]
    if not m.any(): continue
    xs=np.where(~m)[0]
    if len(xs)<2: continue
    for ch in range(3): plate[y,m,ch]=np.interp(np.where(m)[0],xs,src[y,xs,ch])
plate=Image.fromarray(plate.astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))
pl=np.asarray(plate).astype(float); pl=np.where(fgd[...,None],pl,src); plate=Image.fromarray(pl.astype(np.uint8))
plate.save("gen/alt_c_plate.png")
# --- split into four men
lab=measure.label(alpha>0.5); ids={}
for p in measure.regionprops(lab):
    if p.area>5000: ids[p.label]=p.bbox
labs=sorted(ids,key=lambda l:ids[l][1])
masks=[]
for l in labs[:2]: masks.append((lab==l))
big=(lab==labs[2]); xx=np.arange(W)[None,:]; left=big&(xx<seam[:,None]); right=big&(xx>=seam[:,None]); masks+= [left,right]
men=[]
for m in masks:
    md=morphology.binary_dilation(m,morphology.disk(3)); a=alpha*md
    ys,xs=np.where(m); bb=(xs.min(),ys.min(),xs.max()+1,ys.max()+1)
    rgba=np.dstack([src,a*255]).astype(np.uint8); im=Image.fromarray(rgba).crop(bb)
    men.append((im,bb)); print("man",bb)
# --- respace: equal gaps across the width, feet stay on their original floor line
S=0.78; men=[(im.resize((int(im.width*S),int(im.height*S)),Image.LANCZOS),bb) for im,bb in men]
margin=50; widths=[m.width for m,_ in men]; gap=(W-2*margin-sum(widths))/3
x=margin; out=plate.copy(); d=ImageDraw.Draw(out)
for (im,bb) in men:
    # contact shadow
    shw=Image.new("L",(im.width+80,120),0); sd=ImageDraw.Draw(shw); sd.ellipse([0,20,im.width+80,100],fill=140); shw=shw.filter(ImageFilter.GaussianBlur(22))
    out.paste(Image.new("RGB",shw.size,(8,8,10)),(int(x)-40,bb[3]-70),shw)
    out.paste(im,(int(x),bb[3]-im.height),im); x+=im.width+gap
out.save("gen/alt_c_spaced.png"); print("gap",gap)
