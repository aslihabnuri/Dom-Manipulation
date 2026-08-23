import asyncio, base64, json, os
import numpy as np
from PIL import Image
from playwright.async_api import async_playwright

SP = os.path.dirname(os.path.abspath(__file__))
def b64(p, m): return f"data:{m};base64," + base64.b64encode(open(p,'rb').read()).decode()

FF = ["ZalandoSansExpanded-600","ZalandoSansExpanded-700","ZalandoSansExpanded-800",
      "ZalandoSansExpanded-900","Arimo-400","Arimo-600","Arimo-700"]
def face(fam,w,f):
    return (f"@font-face{{font-family:'{fam}';font-style:normal;font-weight:{w};"
            f"src:url('{b64(os.path.join(SP,'fonts',f+'.ttf'),'font/ttf')}') format('truetype');}}")
FONT_CSS = "".join([face("ZSE",600,FF[0]),face("ZSE",700,FF[1]),face("ZSE",800,FF[2]),
                    face("ZSE",900,FF[3]),face("Arimo",400,FF[4]),face("Arimo",600,FF[5]),
                    face("Arimo",700,FF[6])])

INK, WHITE, DAVIS, GREY, STEEL = "#282828","#FFFFFF","#4F5052","#818284","#CCCCCC"
Z = json.load(open(os.path.join(SP,"kv/zones.json")))

# One occasion per banner. "9 to 9" is the constant; the occasion is what changes.
BANNERS = [
 dict(id="BrandStory",  plate="pause",   sizes=[("4x5",1600,2000)], key="dark",  zone="bottom",
      occ="A pause, mid-day", head="9to9", l1="Halfway through the day.", l2="Still not thinking about it.",
      cta="Discover Toni Black"),
 dict(id="ProductValue",plate="desk",    sizes=[("4x5",1600,2000)], key="dark",  zone="top",
      occ="Nine hours at the desk", head="9to9", l1="No riding up. No adjusting.",
      l2="Tagless &middot; 4-way stretch &middot; Breathable", cta="Find Your Fit"),
 dict(id="Category",    plate="weekend", sizes=[("1x1",2000,2000)], key="light", zone="top",
      occ="A slow weekend", head="9to9", l1="Days off count too.",
      l2="Brief &middot; Boxer &middot; Trunk &middot; Singlet", cta="Explore The Collection"),
 dict(id="BAUVoucher",  plate="morning", sizes=[("2x1",2000,1000)], key="light", zone="left",
      occ="Getting ready", head="9to9", l1="It starts the moment you put them on.",
      l2="Extra IDR 5K for new buyers &middot; Free shipping", cta="Shop Now"),
 dict(id="Payday",      plate="home",    sizes=[("16x9",1920,1080),("2x1",1920,960)], key="dark", zone="left",
      occ="Home at last", head="offer", offer="30%", l1="Twelve hours in the same pair.",
      l2="Still comfortable.", cta="Shop Now", note="24 &ndash; 30 September"),
 dict(id="Twindate99",  plate="locker",  sizes=[("16x9",1920,1080),("2x1",1920,960)], key="dark", zone="left",
      occ="After training", head="offer", offer="30%", l1="Nine hours in. A workout later.",
      l2="Still nothing to think about.", cta="Shop Now", note="9 September only"),
]

def scale(W):  # type scale keyed to banner width
    return W/1920.0

def crop(plate, tw, th):
    src=Image.open(os.path.join(SP,f"kv/{plate}_bw.png")).convert("RGB")
    W,H=src.size; want=tw/th; have=W/H
    if have > want:                      # too wide -> trim width, keep the figure side
        nw=int(round(H*want)); cx=Z[plate]["cx"]
        off=int(np.clip(cx-nw*0.62, 0, W-nw))
        box=(off,0,off+nw,H); wshift=off; hshift=0
    else:                                # too tall -> trim height around the figure
        nh=int(round(W/want)); need=H-nh
        top=int(np.clip(Z[plate]["waist"]-nh*0.50, 0, need))
        box=(0,top,W,top+nh); wshift=0; hshift=top
    out=os.path.join(SP,f"kv/sc_{plate}_{tw}x{th}.png"); src.crop(box).save(out)
    waist=(Z[plate]["waist"]-hshift)/ (box[3]-box[1])
    return out, waist

def local_L(plate, W, H, x0,y0,x1,y1):
    """Mean luminance of the cropped plate under a banner-space rectangle."""
    im=Image.open(plate).convert("L"); PW,PH=im.size
    sx,sy=PW/W, PH/H
    box=(max(0,int(x0*sx)),max(0,int(y0*sy)),min(PW,int(x1*sx)),min(PH,int(y1*sy)))
    if box[2]<=box[0] or box[3]<=box[1]: return 128.0
    return float(np.median(np.asarray(im.crop(box))))

def html(b, sn, W, H, plate, waist):
    s=scale(W)
    pad=round(96*s); logoW=round(232*s); numFs=round(150*s); midFs=round(48*s)
    benFs=round(21*s); ctaFs=round(17*s); occFs=round(15*s); leadFs=round(46*s)
    if b["head"]=="offer":
        block=(f'<div class="lead">Save up to</div><div class="num"><b>{b["offer"]}</b></div>')
    else:
        block=('<div class="num"><b>9</b><s>to</s><b>9</b></div>')
    note=f'<div class="note">{b["note"]}</div>' if b.get("note") else ''
    # zone geometry
    if b["zone"]=="left":
        pos=f"left:{pad}px;top:{round(waist*H)}px;width:{round(W*0.42)}px;"
        botpos=f"left:{pad}px;bottom:{round(94*s)}px;"
    elif b["zone"]=="top":
        pos=f"left:{pad}px;top:{round(200*s)}px;width:{round(W*0.62)}px;"
        botpos=f"left:{pad}px;bottom:{round(94*s)}px;"
    else:  # bottom
        pos=f"left:{pad}px;bottom:{round(250*s)}px;width:{round(W*0.62)}px;"
        botpos=f"left:{pad}px;bottom:{round(94*s)}px;"

    # --- per-element ink, chosen from the luminance actually behind each element
    logoH=round(logoW/6.62)
    midH=round((numFs*0.9 + benFs*3.4 + 110*s))
    if b["zone"]=="left":   mx0,my0 = pad, round(waist*H)
    elif b["zone"]=="top":  mx0,my0 = pad, round(200*s)
    else:                   mx0,my0 = pad, H-round(250*s)-midH
    boxes={
      "logo":(pad-round(20*s), round(58*s), pad+logoW+round(20*s), round(78*s)+logoH+round(20*s)),
      "occ" :(mx0, my0-round(70*s), mx0+round(W*0.42), my0),
      "mid" :(mx0, my0, mx0+round(W*0.42), my0+midH),
      "bot" :(pad-round(20*s), H-round(94*s)-round(84*s), pad+round(W*0.32), H-round(74*s)),
    }
    Ls={k: local_L(plate,W,H,*v) for k,v in boxes.items()}
    dark  = lambda k: Ls[k] < 118          # background dark -> white ink
    ink   = WHITE if dark("mid")  else INK
    sub   = STEEL if dark("mid")  else DAVIS
    occInk= STEEL if dark("occ")  else DAVIS
    ctaBg = WHITE if dark("bot")  else INK
    ctaIn = INK   if dark("bot")  else WHITE
    noteInk=STEEL if dark("bot")  else DAVIS
    logoFile = 'assets/logo_white.svg' if dark("logo") else 'assets/logo_dark.svg'
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
{FONT_CSS}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:{W}px;height:{H}px;overflow:hidden;background:{INK}}}
.stage{{position:relative;width:{W}px;height:{H}px;overflow:hidden;
  -webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;font-kerning:normal}}
.photo{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}}
.logo{{position:absolute;left:{pad}px;top:{round(78*s)}px;width:{logoW}px;height:auto;
  display:block;margin-left:-1.5px}}
.occ{{font-family:'ZSE';font-weight:700;font-size:{occFs}px;letter-spacing:.24em;
  text-transform:uppercase;color:{sub};line-height:1;margin-bottom:{round(18*s)}px;
  margin-left:-.02em}}
.mid{{position:absolute;{pos}}}
.rule{{width:{round(54*s)}px;height:{max(2,round(3*s))}px;background:{ink};margin-bottom:{round(22*s)}px}}
.lead{{font-family:'ZSE';font-weight:700;font-size:{leadFs}px;letter-spacing:.16em;
  text-transform:uppercase;color:{sub};margin-bottom:{round(10*s)}px;margin-left:-.02em}}
.num{{white-space:nowrap;line-height:.86;margin-left:-.045em}}
.num b{{font-family:'ZSE';font-weight:900;font-size:{numFs}px;letter-spacing:-.03em;
  color:{ink};font-variant-numeric:tabular-nums}}
.num s{{font-family:'ZSE';font-weight:700;font-size:{midFs}px;letter-spacing:.10em;color:{sub};
  text-decoration:none;text-transform:uppercase;margin:0 .30em;position:relative;top:-.30em}}
.ben{{font-family:'Arimo';font-weight:400;font-size:{benFs}px;line-height:1.5;color:{sub};
  margin-top:{round(24*s)}px;margin-left:-.02em}}
.bot{{position:absolute;{botpos}}}
.cta{{font-family:'ZSE';font-weight:700;font-size:{ctaFs}px;letter-spacing:.13em;
  text-transform:uppercase;color:{ctaIn};background:{ctaBg};border-radius:{max(3,round(5*s))}px;
  padding:{round(19*s)}px {round(32*s)}px;display:inline-block;white-space:nowrap}}
.note{{font-family:'Arimo';font-weight:600;font-size:{round(17*s)}px;letter-spacing:.15em;
  text-transform:uppercase;color:{noteInk};margin-top:{round(18*s)}px;margin-left:-.02em}}
</style></head><body><div class="stage">
  <img class="photo" src="{b64(plate,'image/png')}">
  <img class="logo" src="{b64(os.path.join(SP,logoFile),'image/svg+xml')}">
  <div class="mid"><div class="occ">{b['occ']}</div><div class="rule"></div>{block}
    <div class="ben">{b['l1']}<br>{b['l2']}</div></div>
  <div class="bot"><div class="cta">{b['cta']}</div>{note}</div>
</div>
<script>
/* If the bottom-anchored block would collide with the middle block (offer layouts in
   short formats), reflow it to sit directly under the copy instead. */
(function()  {{
  var mid=document.querySelector('.mid'), bot=document.querySelector('.bot');
  if(!mid||!bot) return;
  var m=mid.getBoundingClientRect(), b=bot.getBoundingClientRect();
  if(m.bottom + {round(26*s)} > b.top)  {{
    bot.style.position='static'; bot.style.left='auto'; bot.style.bottom='auto';
    bot.style.marginTop='{round(30*s)}px';
    mid.appendChild(bot);
  }}
}})();
</script>
</body></html>"""

async def main():
    os.makedirs(os.path.join(SP,"suite"),exist_ok=True)
    async with async_playwright() as pw:
        br=await pw.chromium.launch(
            executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
            args=["--force-color-profile=srgb","--disable-lcd-text"])
        for b in BANNERS:
            for sn,W,H in b["sizes"]:
                plate,waist = crop(b["plate"], W, H)
                p=os.path.join(SP,f"suite/{b['id']}_{sn}.html")
                open(p,"w").write(html(b,sn,W,H,plate,waist))
                pg=await br.new_page(viewport={"width":W,"height":H},device_scale_factor=2)
                await pg.goto("file://"+p); await pg.wait_for_timeout(1100)
                await pg.screenshot(path=os.path.join(SP,f"suite/ToniBlack_9to9_{b['id']}_{sn}.png"))
                await pg.close()
                print(f"  {b['id']:13s} {sn:5s} {W}x{H}  waist@{waist:.3f}  [{b['zone']}]")
        await br.close()

asyncio.run(main())
