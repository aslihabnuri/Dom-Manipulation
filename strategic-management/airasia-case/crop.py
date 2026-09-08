# usage: crop.py src dst w h anchor(cx,cy in 0..1)
import sys
from PIL import Image
src,dst,w,h=sys.argv[1],sys.argv[2],float(sys.argv[3]),float(sys.argv[4])
ax,ay=(float(v) for v in sys.argv[5].split(",")) if len(sys.argv)>5 else (0.5,0.5)
im=Image.open(src); W,H=im.size; target=w/h
if W/H>target:  # too wide: crop width
    cw=int(round(H*target)); ch=H
else:
    cw=W; ch=int(round(W/target))
x0=int(round((W-cw)*ax)); y0=int(round((H-ch)*ay))
out=im.crop((x0,y0,x0+cw,y0+ch))
if out.mode!="RGB" and dst.endswith(".jpg"): out=out.convert("RGB")
out.save(dst,quality=93)
print(out.size)
