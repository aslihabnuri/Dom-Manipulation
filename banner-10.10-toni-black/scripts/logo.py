"""Official Toni Black logo from Drive `6.png` (light mark on dark ground), extracted as a mask and tinted."""
import os, numpy as np
from PIL import Image
_SRC=os.path.join(os.path.dirname(os.path.abspath(__file__)),"logo_6.png")
_cache={}
def _mask():
    if "m" not in _cache:
        im=np.asarray(Image.open(_SRC).convert("L")).astype(float)
        a=np.clip((im-60)/(200-60),0,1)            # light pixels = logo
        ys,xs=np.where(a>0.05); pad=8
        y0,y1,x0,x1=ys.min()-pad,ys.max()+pad,xs.min()-pad,xs.max()+pad
        _cache["m"]=Image.fromarray((a[y0:y1,x0:x1]*255).astype(np.uint8))
    return _cache["m"]
def make_logo(color=(40,40,40), scale=8):
    m=_mask(); W=310*scale; im=m.resize((W,int(m.height*W/m.width)),Image.LANCZOS)
    out=Image.new("RGBA",im.size,tuple(color)+(0,)); out.putalpha(im); return out
