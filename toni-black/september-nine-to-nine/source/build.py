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

# Three moments of one day, one talent. `key` drives the ink: a bright frame takes
# charcoal type, a dark frame takes white — both sanctioned by the guideline
# ("white on black, or black on white").
MOMENTS = [
  dict(id="0900", plate="morning", time="09:00", key="light",
       line1="The first thing you put on.", line2="Twelve hours from now, still on."),
  dict(id="1800", plate="locker",  time="18:00", key="dark",
       line1="Nine hours in. A workout later.", line2="Still nothing to think about."),
  dict(id="2100", plate="home",    time="21:00", key="dark",
       line1="Twelve hours in the same pair.", line2="Still comfortable."),
]

SIZES = {
 "16x9": dict(W=1920,H=1080, pad=96, logoW=232, logoTop=78, tsFs=38,
              num=152, mid=50, ben=22, ctaFs=17, botPad=94, ruleW=54),
 "2x1":  dict(W=1920,H=960,  pad=92, logoW=222, logoTop=68, tsFs=34,
              num=136, mid=45, ben=20, ctaFs=16.5, botPad=86, ruleW=50),
}

def figure_rows(G, cx):
    H,W=G.shape
    x0,x1=max(0,cx-450),min(W,cx+450)
    var=np.array([G[y,x0:x1].std() for y in range(H)])
    act=np.where(var>np.percentile(var,55))[0]
    return int(act.min()), int(act.max())

def prep():
    marks=json.load(open(os.path.join(SP,"kv/marks.json")))
    out={}
    for m in MOMENTS:
        src=Image.open(os.path.join(SP,f"kv/{m['plate']}_bw.png")).convert("RGB")
        W,H=src.size
        G=np.asarray(src.convert("L")).astype(float)
        cx=marks[m['plate']]['cx']; waist=marks[m['plate']]['waist']
        top,bot=figure_rows(G,cx)
        e={}
        # 16:9 -> trim width only, figure untouched
        w169=int(round(H*16/9)); off=(W-w169)//2
        p=os.path.join(SP,f"kv/set_{m['id']}_16x9.png"); src.crop((off,0,off+w169,H)).save(p)
        e["16x9"]=(p, waist/H)
        # 2:1 -> trim height, split between the room above the head and below the feet
        h21=int(round(W/2)); need=H-h21
        above,below=top,H-bot
        tcut=int(round(need*(above/max(1,above+below)))) if above+below>0 else need//2
        tcut=max(0,min(tcut,need))
        p2=os.path.join(SP,f"kv/set_{m['id']}_2x1.png"); src.crop((0,tcut,W,tcut+h21)).save(p2)
        e["2x1"]=(p2, (waist-tcut)/h21)
        out[m['id']]=e
        print(f"{m['id']} waist={waist/H:.3f} figure {top}-{bot} 2:1 cut {tcut}top/{need-tcut}bot -> waist {(waist-tcut)/h21:.3f}")
    return out

def html(v, m, plate, waist_frac, promo=False):
    light = (m["key"]=="light")
    ink      = INK   if light else WHITE
    sub      = DAVIS if light else STEEL
    ctaBg    = INK   if light else WHITE
    ctaInk   = WHITE if light else INK
    rule     = INK   if light else WHITE
    ruleTop  = round(waist_frac*v["H"])
    if promo:
        mid_block = (f'<div class="lead">Save up to</div>'
                     f'<div class="num"><b>30%</b></div>'
                     f'<div class="ben">{m["line1"]}<br>{m["line2"]}</div>')
        cta_label = "Shop Now"
        note_block = '<div class="note">9 September only</div>'
    else:
        mid_block = (f'<div class="num"><b>9</b><s>to</s><b>9</b></div>'
                     f'<div class="ben">{m["line1"]}<br>{m["line2"]}</div>')
        cta_label = "Discover Toni Black"
        note_block = ""
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
{FONT_CSS}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:{v['W']}px;height:{v['H']}px;overflow:hidden;background:{INK}}}
.stage{{position:relative;width:{v['W']}px;height:{v['H']}px;overflow:hidden;
  -webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;font-kerning:normal}}
.photo{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}}
.logo{{position:absolute;left:{v['pad']}px;top:{v['logoTop']}px;width:{v['logoW']}px;
  height:auto;display:block;margin-left:-1.5px}}
.ts{{position:absolute;right:{v['pad']}px;top:{v['logoTop']-4}px;
  font-family:'ZSE';font-weight:700;font-size:{v['tsFs']}px;letter-spacing:.20em;
  color:{ink};font-variant-numeric:tabular-nums;line-height:1}}
.mid{{position:absolute;left:{v['pad']}px;top:{ruleTop}px;width:{int(v['W']*0.40)}px}}
.rule{{width:{v['ruleW']}px;height:3px;background:{rule};margin-bottom:22px}}
.num{{white-space:nowrap;line-height:.86;margin-left:-.045em}}
.num b{{font-family:'ZSE';font-weight:900;font-size:{v['num']}px;letter-spacing:-.03em;
  color:{ink};font-variant-numeric:tabular-nums}}
.num s{{font-family:'ZSE';font-weight:700;font-size:{v['mid']}px;letter-spacing:.10em;
  color:{sub};text-decoration:none;text-transform:uppercase;margin:0 .30em;
  position:relative;top:-.30em}}
.ben{{font-family:'Arimo';font-weight:400;font-size:{v['ben']}px;line-height:1.5;
  color:{sub};margin-top:24px;margin-left:-.02em}}
.lead{{font-family:'ZSE';font-weight:700;font-size:{v['mid']}px;letter-spacing:.16em;
  text-transform:uppercase;color:{sub};margin-bottom:10px;margin-left:-.02em}}
.note{{font-family:'Arimo';font-weight:600;font-size:{v['ben']-4}px;letter-spacing:.15em;
  text-transform:uppercase;color:{sub};margin-top:18px;margin-left:-.02em}}
.bot{{position:absolute;left:{v['pad']}px;bottom:{v['botPad']}px}}
.cta{{font-family:'ZSE';font-weight:700;font-size:{v['ctaFs']}px;letter-spacing:.13em;
  text-transform:uppercase;color:{ctaInk};background:{ctaBg};border-radius:5px;
  padding:19px 32px;display:inline-block;white-space:nowrap}}
</style></head><body><div class="stage">
  <img class="photo" src="{b64(plate,'image/png')}">
  <img class="logo" src="{b64(os.path.join(SP, 'assets/logo_dark.svg' if light else 'assets/logo_white.svg'),'image/svg+xml')}">
  <div class="ts">{m['time']}</div>
  <div class="mid">
    <div class="rule"></div>
    {mid_block}
  </div>
  <div class="bot"><div class="cta">{cta_label}</div>{note_block}</div>
</div></body></html>"""

async def main():
    plates=prep(); os.makedirs(os.path.join(SP,"setout"),exist_ok=True)
    async with async_playwright() as pw:
        b=await pw.chromium.launch(
            executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
            args=["--force-color-profile=srgb","--disable-lcd-text"])
        for m in MOMENTS:
            for sn,v in SIZES.items():
                plate,wf = plates[m['id']][sn]
                p=os.path.join(SP,f"setout/{m['id']}_{sn}.html")
                open(p,"w").write(html(v,m,plate,wf))
                pg=await b.new_page(viewport={"width":v["W"],"height":v["H"]},device_scale_factor=2)
                await pg.goto("file://"+p); await pg.wait_for_timeout(1100)
                await pg.screenshot(path=os.path.join(SP,f"setout/ToniBlack_9to9_{m['id']}_{sn}.png"))
                await pg.close()
            print("rendered",m['id'])
        for sn,v in SIZES.items():
            m=MOMENTS[2]; plate,wf = plates[m['id']][sn]
            p=os.path.join(SP,f"setout/promo99_{sn}.html")
            open(p,"w").write(html(v,m,plate,wf,promo=True))
            pg=await b.new_page(viewport={"width":v["W"],"height":v["H"]},device_scale_factor=2)
            await pg.goto("file://"+p); await pg.wait_for_timeout(1100)
            await pg.screenshot(path=os.path.join(SP,f"setout/ToniBlack_9to9_99Promo_{sn}.png"))
            await pg.close()
        print("rendered promo99")
        await b.close()

asyncio.run(main())
