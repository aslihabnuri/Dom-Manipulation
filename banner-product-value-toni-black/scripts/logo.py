from PIL import Image, ImageDraw, ImageFont
F="fonts/static/"
def rounded_poly(draw, pts, fill):
    draw.polygon(pts, fill=fill)
def make_logo(color=(40,40,40), scale=8):
    # canvas in design units (unit=1px at scale 1, logo ~ 310x65 like BAU crop)
    W,H=310*scale,66*scale
    im=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(im)
    s=scale
    # ICON: waistband bar + two leg panels with T-shaped gap. icon box x:2..44, y:12..56
    x0,y0=2*s,13*s; iw,ih=42*s,44*s
    r=2*s
    d.rounded_rectangle([x0,y0,x0+iw,y0+9*s],radius=r,fill=color)          # waistband
    gap=3.2*s; stem=6*s
    top=y0+9*s+gap; bot=y0+ih
    cx=x0+iw/2
    # left panel: outer edge straight, bottom angles inward (leg cut)
    L=[(x0,top),(cx-stem/2,top),(cx-stem/2,bot),(cx-stem/2-4*s,bot),(x0,bot-12*s)]
    R=[(cx+stem/2,top),(x0+iw,top),(x0+iw,bot-12*s),(cx+stem/2+4*s,bot),(cx+stem/2,bot)]
    d.polygon(L,fill=color); d.polygon(R,fill=color)
    # WORDMARK
    f1=ImageFont.truetype(F+"ZalandoSansExpanded-SemiBold.ttf",int(26*s))
    tx=52*s
    d.text((tx,10*s),"TONI BLACK",font=f1,fill=color)
    f2=ImageFont.truetype(F+"ZalandoSansExpanded-Medium.ttf",int(8.2*s))
    tag="TAILORED • ORIGINAL • INNOVATION"
    # tracked text
    x=tx; y=45*s
    for ch in tag:
        d.text((x,y),ch,font=f2,fill=color); x+=d.textlength(ch,font=f2)+0.55*s
    bb=im.getbbox(); im=im.crop(bb)
    return im
if __name__=="__main__":
    im=make_logo(); im.save("assets/logo_rebuilt.png"); print(im.size)
    ref=Image.open("assets/logo_crop_x4.png").convert("RGBA")
    cmp=Image.new("RGBA",(max(im.width,ref.width),im.height+ref.height+40),(230,230,230,255))
    cmp.paste(ref,(0,0),ref); cmp.paste(im.resize((ref.width,int(im.height*ref.width/im.width))),(0,ref.height+40),im.resize((ref.width,int(im.height*ref.width/im.width))))
    cmp.save("assets/logo_compare.png")
