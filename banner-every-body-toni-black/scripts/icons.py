"""Six product-feature icons drawn as clean line icons on charcoal discs (white strokes), matching the reference set."""
import math
from PIL import Image, ImageDraw
CHAR=(40,40,40); WHITE=(255,255,255)
def disc(size,fill=CHAR):
    s=size*4; im=Image.new("RGBA",(s,s),(0,0,0,0)); d=ImageDraw.Draw(im); d.ellipse([0,0,s-1,s-1],fill=fill+(255,)); return im,d,s
def finish(im,size): return im.resize((size,size),Image.LANCZOS)
def arrow(d,p0,p1,w,head):
    d.line([p0,p1],fill=WHITE,width=w)
    ang=math.atan2(p1[1]-p0[1],p1[0]-p0[0])
    for a in (ang+2.5,ang-2.5):
        d.line([p1,(p1[0]+head*math.cos(a),p1[1]+head*math.sin(a))],fill=WHITE,width=w)
def breathable(size):
    im,d,s=disc(size); w=int(s*0.035); c=s/2
    for i,(y,l) in enumerate(((0.36,0.42),(0.5,0.52),(0.64,0.36))):
        x0=c-l*s/2; x1=c+l*s/2; yy=y*s
        d.line([(x0,yy),(x1,yy)],fill=WHITE,width=w)
        d.arc([x1-s*0.08,yy-s*0.08,x1+s*0.08,yy+s*0.08],270,90,fill=WHITE,width=w)
    return finish(im,size)
def odor(size):
    im,d,s=disc(size); w=int(s*0.035); c=s/2
    for k,x in enumerate((0.36,0.5,0.64)):
        xs=x*s; y0=s*0.30; 
        pts=[(xs+math.sin(t*math.pi*2)*s*0.03, y0+t*s*0.22) for t in [i/12 for i in range(13)]]
        d.line(pts,fill=WHITE,width=w)
        d.ellipse([xs-s*0.035,s*0.62-s*0.035,xs+s*0.035,s*0.62+s*0.035],outline=WHITE,width=w)
    return finish(im,size)
def ergonomic(size):
    im,d,s=disc(size); w=int(s*0.035); c=s/2
    # waistband + brief outline
    d.rounded_rectangle([s*0.28,s*0.40,s*0.72,s*0.47],radius=s*0.02,outline=WHITE,width=w)
    d.line([(s*0.28,s*0.47),(s*0.36,s*0.66),(s*0.46,s*0.66),(s*0.5,s*0.58),(s*0.54,s*0.66),(s*0.64,s*0.66),(s*0.72,s*0.47)],fill=WHITE,width=w,joint="curve")
    arrow(d,(c,s*0.31),(s*0.80,s*0.31),w,s*0.05); arrow(d,(c,s*0.31),(s*0.20,s*0.31),w,s*0.05)
    return finish(im,size)
def moisture(size):
    im,d,s=disc(size); w=int(s*0.035); c=s/2
    # drop
    pts=[]; 
    for i in range(0,181,6):
        a=math.radians(i); pts.append((c+math.cos(a)*s*0.19, s*0.52+math.sin(a)*s*0.19))
    pts=[(c,s*0.24)]+pts+[(c,s*0.24)]
    d.line(pts,fill=WHITE,width=w,joint="curve")
    for dx in (-0.07,0.0,0.07): arrow(d,(c+dx*s,s*0.64),(c+dx*s,s*0.44),w,s*0.04)
    return finish(im,size)
def stretch(size):
    im,d,s=disc(size); w=int(s*0.035); c=s/2
    for dx,dy in ((-1,-1),(1,-1),(-1,1),(1,1)): arrow(d,(c+dx*s*0.06,c+dy*s*0.06),(c+dx*s*0.24,c+dy*s*0.24),w,s*0.06)
    d.rounded_rectangle([c-s*0.07,c-s*0.07,c+s*0.07,c+s*0.07],radius=s*0.015,outline=WHITE,width=w)
    return finish(im,size)
def formfit(size):
    im,d,s=disc(size); w=int(s*0.035); c=s/2
    # garment silhouette with waist curve, arrows pointing in
    d.line([(s*0.36,s*0.28),(s*0.40,c),(s*0.36,s*0.72)],fill=WHITE,width=w,joint="curve")
    d.line([(s*0.64,s*0.28),(s*0.60,c),(s*0.64,s*0.72)],fill=WHITE,width=w,joint="curve")
    d.line([(s*0.36,s*0.28),(s*0.64,s*0.28)],fill=WHITE,width=w); d.line([(s*0.36,s*0.72),(s*0.64,s*0.72)],fill=WHITE,width=w)
    arrow(d,(s*0.16,c),(s*0.32,c),w,s*0.05); arrow(d,(s*0.84,c),(s*0.68,c),w,s*0.05)
    return finish(im,size)
ICONS=[("BREATHABLE",breathable),("ODOR\nRESISTANT",odor),("ERGONOMIC\nFIT",ergonomic),("MOISTURE\nWICKING",moisture),("4-WAY\nSTRETCH",stretch),("FORM\nFITTING",formfit)]
if __name__=="__main__":
    sheet=Image.new("RGB",(6*150,150),(240,240,240))
    for i,(n,f) in enumerate(ICONS): ic=f(120); sheet.paste(ic,(i*150+15,15),ic)
    sheet.save("out/icons_sheet.png"); print("ok")
