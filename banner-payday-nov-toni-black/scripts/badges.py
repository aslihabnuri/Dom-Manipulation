"""Offer badges in the guideline icon style: white line icon on a charcoal disc (drawn 4x, downsampled)."""
from PIL import Image, ImageDraw
C=(40,40,40); WH=(255,255,255)
def _disc(size):
    s=size*4; im=Image.new("RGBA",(s,s),(0,0,0,0)); d=ImageDraw.Draw(im); d.ellipse([0,0,s-1,s-1],fill=C+(255,)); return im,d,s
def truck(size):
    im,d,s=_disc(size); w=int(s*0.04)
    d.rounded_rectangle([s*0.20,s*0.34,s*0.58,s*0.62],radius=s*0.02,outline=WH,width=w)                 # cargo box
    d.line([(s*0.58,s*0.42),(s*0.70,s*0.42),(s*0.80,s*0.52),(s*0.80,s*0.62),(s*0.58,s*0.62)],fill=WH,width=w,joint="curve")  # cab
    for cx in (s*0.33,s*0.69): d.ellipse([cx-s*0.06,s*0.62-s*0.06,cx+s*0.06,s*0.62+s*0.06],fill=C+(255,),outline=WH,width=w)
    return im.resize((size,size),Image.LANCZOS)
def ticket(size):
    im,d,s=_disc(size); w=int(s*0.04); x0,y0,x1,y1=s*0.20,s*0.33,s*0.80,s*0.67
    d.rounded_rectangle([x0,y0,x1,y1],radius=s*0.04,outline=WH,width=w)
    r=s*0.06; my=(y0+y1)/2
    for cx in (x0,x1): d.ellipse([cx-r,my-r,cx+r,my+r],fill=C+(255,))                                  # notches
    for cx in (x0,x1): d.arc([cx-r,my-r,cx+r,my+r],-90 if cx==x0 else 90,90 if cx==x0 else 270,fill=WH,width=w)
    dx=s*0.60; y=y0+s*0.05
    while y<y1-s*0.06: d.line([(dx,y),(dx,y+s*0.04)],fill=WH,width=int(w*0.8)); y+=s*0.075            # tear line
    return im.resize((size,size),Image.LANCZOS)
