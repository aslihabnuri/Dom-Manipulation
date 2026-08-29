"""Frames for the treatment deck.

In this style type sits on the photograph, so legibility cannot be left to
chance. Each frame is cropped to its placed size and the scrim is burned into
the pixels here — not layered as a translucent shape in PowerPoint — so the
contrast behind every headline is fixed at export time and can be measured.
"""
import json, os
import numpy as np
from PIL import Image

SP  = os.path.dirname(os.path.abspath(__file__))
LOCAL  = os.path.join(SP, "plates")                       # generated for this brief
SHARED = os.path.normpath(os.path.join(SP, "..", "..", "september-nine-to-nine",
                                       "source", "plates"))
Z   = json.load(open(os.path.normpath(os.path.join(SP, "..", "..",
        "product-knowledge", "source", "zones.json"))))
DPI = 170
os.makedirs(os.path.join(SP,"frames"), exist_ok=True)

def _open(name):
    for d in (LOCAL, SHARED):
        for ext in ("_bw.jpg","_bw.png"):
            p=os.path.join(d,name+ext)
            if os.path.exists(p): return Image.open(p).convert("RGB")
    raise FileNotFoundError(name)

def _crop(name, tw, th):
    src=_open(name); W,H=src.size
    want, have = tw/th, W/H
    z=Z.get(name)
    if have > want:
        nw=int(round(H*want))
        cx = z["cx"] if z else W//2
        off=int(min(max(cx-nw*0.5,0), W-nw))
        src=src.crop((off,0,off+nw,H))
    elif have < want:
        nh=int(round(W/want))
        cy = z["waist"] if z else int(H*0.45)
        top=int(min(max(cy-nh*0.5,0), H-nh))
        src=src.crop((0,top,W,top+nh))
    return src.resize((tw,th), Image.LANCZOS)

def _scrim(a, side, strength, reach):
    """Multiply a linear ramp into the image so the text side goes dark."""
    h,w = a.shape[:2]
    if side in ("left","right"):
        t=np.linspace(0,1,w)[None,:]
        if side=="right": t=1-t
    else:
        t=np.linspace(0,1,h)[:,None]
        if side=="bottom": t=1-t
    ramp=np.clip((reach-t)/max(reach,1e-6),0,1)**1.15      # 1 at the edge, 0 past `reach`
    k=(1.0-strength*ramp)[...,None] if side in ("left","right") else (1.0-strength*ramp)[...,None]
    return np.clip(a*k,0,255)

def frame(name, plate, w_in, h_in, scrims=(), floor=None):
    tw,th=int(round(w_in*DPI)), int(round(h_in*DPI))
    a=np.asarray(_crop(plate,tw,th)).astype(float)
    for side,strength,reach in scrims:
        a=_scrim(a,side,strength,reach)
    if floor is not None:                                  # lift nothing, only cap brightness
        a=np.clip(a, 0, floor)
    out=Image.fromarray(a.astype(np.uint8))
    # photographs, not line art — JPEG at high quality cuts the deck from 16MB to
    # a size that can actually be emailed, with no visible loss at these sizes
    p=os.path.join(SP,"frames",name+".jpg"); out.save(p,quality=90,subsampling=0)
    return p

def luma(name, x0,y0,x1,y1, w_in,h_in):
    """Median luminance under a rectangle given in inches on the placed frame."""
    im=Image.open(os.path.join(SP,"frames",name+".jpg")).convert("L")
    W,H=im.size; sx,sy=W/w_in, H/h_in
    box=(max(0,int(x0*sx)),max(0,int(y0*sy)),min(W,int(x1*sx)),min(H,int(y1*sy)))
    if box[2]<=box[0] or box[3]<=box[1]: return 128.0
    return float(np.median(np.asarray(im.crop(box))))

def contrast_white(L):
    l=(L/255.0); l=(l/12.92 if l<=0.03928 else ((l+0.055)/1.055)**2.4)
    return 1.05/(l+0.05)
