import asyncio, base64, os
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

# ---- crops chosen by eye, then verified: 16:9 keeps the full striding figure,
#      2:1 is a deliberately tighter head-to-thigh frame (the figure fills 0-3000
#      of 3072px, so a full-figure 2:1 is impossible from this plate).
CROPS = {"16x9": (21, 0, 21+5461, 3072), "2x1": (1000, 0, 5504, 2252)}

SIZES = {
 "16x9": dict(W=1920,H=1080, pad=96, logoW=244, logoTop=76, blockTop=318,
              ruleW=50, ebFs=15, hero=132, mid=44, sup=19, ctaFs=17, noteFs=14),
 "2x1":  dict(W=1920,H=960,  pad=92, logoW=232, logoTop=66, blockTop=262,
              ruleW=48, ebFs=14, hero=118, mid=40, sup=18, ctaFs=16.5, noteFs=13.5),
}

def prep():
    src = Image.open(os.path.join(SP,"kv/stride2_bw.png")).convert("RGB")
    out={}
    for k,(x0,y0,x1,y1) in CROPS.items():
        p=os.path.join(SP,f"kv/plate_{k}.png"); src.crop((x0,y0,x1,y1)).save(p); out[k]=p
    return out

def shell(v, plate, block):
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
{FONT_CSS}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:{v['W']}px;height:{v['H']}px;overflow:hidden;background:{INK}}}
.stage{{position:relative;width:{v['W']}px;height:{v['H']}px;overflow:hidden;
  -webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;font-kerning:normal}}
.photo{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}}
.logo{{position:absolute;left:{v['pad']}px;top:{v['logoTop']}px;width:{v['logoW']}px;
  height:auto;display:block;margin-left:-1.5px}}
.col{{position:absolute;left:{v['pad']}px;top:{v['blockTop']}px;width:{int(v['W']*0.42)}px}}
.rule{{width:{v['ruleW']}px;height:3px;background:{WHITE};margin-bottom:20px}}
.eb{{font-family:'ZSE';font-weight:700;font-size:{v['ebFs']}px;letter-spacing:.28em;
  text-transform:uppercase;color:{STEEL};font-variant-numeric:tabular-nums;margin-bottom:24px}}
.hero{{text-transform:uppercase}}
.hero i{{display:block;font-style:normal;font-family:'ZSE';font-weight:900;
  font-size:{v['hero']}px;line-height:.88;letter-spacing:-.028em;color:{WHITE}}}
.hero i.mid{{font-size:{v['mid']}px;line-height:1.22;letter-spacing:.10em;
  color:{STEEL};font-weight:700}}
.hero i.n{{margin-left:-.059em}}
.hero i.s{{margin-left:-.030em}}
.hero i.p{{margin-left:-.043em}}
.hero i.mid{{margin-left:-.02em}}
.sup{{font-family:'Arimo';font-weight:400;font-size:{v['sup']}px;line-height:1.5;
  color:{STEEL};margin-top:26px;margin-left:-.02em}}
.cta{{font-family:'ZSE';font-weight:700;font-size:{v['ctaFs']}px;letter-spacing:.13em;
  text-transform:uppercase;color:{INK};background:{WHITE};border-radius:5px;
  padding:19px 32px;display:inline-block;margin-top:30px;white-space:nowrap}}
.note{{font-family:'Arimo';font-weight:600;font-size:{v['noteFs']}px;letter-spacing:.15em;
  text-transform:uppercase;color:{STEEL};margin-top:20px;margin-left:-.02em}}
</style></head><body><div class="stage">
  <img class="photo" src="{b64(plate,'image/png')}">
  <img class="logo" src="{b64(os.path.join(SP,'assets/logo_white.svg'),'image/svg+xml')}">
  <div class="col">{block}</div>
</div></body></html>"""

def block_kv(v):
    return """
      <div class="rule"></div>
      <div class="eb">09:00 &mdash; 21:00</div>
      <div class="hero"><i class="n">Nine</i><i class="mid">to</i><i class="n">Nine</i></div>
      <div class="sup">Comfort that holds<br>from morning to night.</div>
      <div class="cta">Discover Toni Black</div>"""

def block_99(v):
    return """
      <div class="rule"></div>
      <div class="eb">9.9 &middot; Nine to Nine</div>
      <div class="hero"><i class="mid">Save up to</i><i class="p">30%</i></div>
      <div class="sup">Comfort that holds<br>from morning to night.</div>
      <div class="cta">Shop Now</div>
      <div class="note">9 September only</div>"""

async def main():
    plates = prep()
    os.makedirs(os.path.join(SP,"kv3out"), exist_ok=True)
    async with async_playwright() as pw:
        b = await pw.chromium.launch(
            executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
            args=["--force-color-profile=srgb","--disable-lcd-text"])
        for vn, fn in [("KeyVisual",block_kv),("9.9",block_99)]:
            for sn, v in SIZES.items():
                p=os.path.join(SP,f"kv3out/{vn}_{sn}.html")
                open(p,"w").write(shell(v, plates[sn], fn(v)))
                pg=await b.new_page(viewport={"width":v["W"],"height":v["H"]}, device_scale_factor=2)
                await pg.goto("file://"+p); await pg.wait_for_timeout(1100)
                await pg.screenshot(path=os.path.join(SP,f"kv3out/ToniBlack_NineToNine_{vn}_{sn}.png"))
                await pg.close(); print("rendered",vn,sn)
        await b.close()

asyncio.run(main())
