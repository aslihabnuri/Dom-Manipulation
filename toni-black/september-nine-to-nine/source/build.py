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

# 16:9 trims 43px of width; 2:1 trims 320px off the bottom (figure sits rows 337-2981).
CROPS = {"16x9": (21,0,21+5461,3072), "2x1": (0,0,5504,2752)}

SIZES = {
 "16x9": dict(W=1920,H=1080, pad=96, logoW=232, logoTop=78,
              ebFs=15, num=150, mid=48, ben=21, ctaFs=17, botPad=92),
 "2x1":  dict(W=1920,H=960,  pad=92, logoW=222, logoTop=68,
              ebFs=14, num=132, mid=43, ben=19.5, ctaFs=16.5, botPad=84),
}

def prep():
    src = Image.open(os.path.join(SP,"kv/home_bw.png")).convert("RGB")
    out={}
    for k,(x0,y0,x1,y1) in CROPS.items():
        p=os.path.join(SP,f"kv/hplate_{k}.png"); src.crop((x0,y0,x1,y1)).save(p); out[k]=p
    return out

def shell(v, plate, tr, bl, br):
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
{FONT_CSS}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:{v['W']}px;height:{v['H']}px;overflow:hidden;background:{INK}}}
.stage{{position:relative;width:{v['W']}px;height:{v['H']}px;overflow:hidden;
  -webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;font-kerning:normal}}
.photo{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}}

.logo{{position:absolute;left:{v['pad']}px;top:{v['logoTop']}px;width:{v['logoW']}px;
  height:auto;display:block;margin-left:-1.5px}}

.tr{{position:absolute;right:{v['pad']}px;top:{v['logoTop']+6}px;text-align:right;
  font-family:'ZSE';font-weight:700;font-size:{v['ebFs']}px;letter-spacing:.26em;
  text-transform:uppercase;color:{STEEL};font-variant-numeric:tabular-nums}}

.bl{{position:absolute;left:{v['pad']}px;bottom:{v['botPad']}px}}
.num{{white-space:nowrap;line-height:.86;margin-left:-.045em}}
.num b{{font-family:'ZSE';font-weight:900;font-size:{v['num']}px;letter-spacing:-.03em;
  color:{WHITE};font-variant-numeric:tabular-nums}}
.num s{{font-family:'ZSE';font-weight:700;font-size:{v['mid']}px;letter-spacing:.10em;
  color:{STEEL};text-decoration:none;text-transform:uppercase;margin:0 .30em;
  position:relative;top:-.30em}}
.lead{{font-family:'ZSE';font-weight:700;font-size:{v['mid']}px;letter-spacing:.16em;
  text-transform:uppercase;color:{STEEL};margin-bottom:10px;margin-left:-.02em}}
.ben{{font-family:'Arimo';font-weight:400;font-size:{v['ben']}px;line-height:1.5;
  color:{STEEL};margin-top:22px;margin-left:-.02em}}

.br{{position:absolute;right:{v['pad']}px;bottom:{v['botPad']}px;text-align:right}}
.cta{{font-family:'ZSE';font-weight:700;font-size:{v['ctaFs']}px;letter-spacing:.13em;
  text-transform:uppercase;color:{INK};background:{WHITE};border-radius:5px;
  padding:19px 32px;display:inline-block;white-space:nowrap}}
.note{{font-family:'Arimo';font-weight:600;font-size:{v['ebFs']}px;letter-spacing:.15em;
  text-transform:uppercase;color:{STEEL};margin-top:18px}}
</style></head><body><div class="stage">
  <img class="photo" src="{b64(plate,'image/png')}">
  <img class="logo" src="{b64(os.path.join(SP,'assets/logo_white.svg'),'image/svg+xml')}">
  <div class="tr">{tr}</div>
  <div class="bl">{bl}</div>
  <div class="br">{br}</div>
</div></body></html>"""

KV = dict(
  tr = "09:00 &mdash; 21:00",
  bl = """<div class="num"><b>9</b><s>to</s><b>9</b></div>
          <div class="ben">Twelve hours in the same pair.<br>Still comfortable.</div>""",
  br = """<div class="cta">Discover Toni Black</div>""")

NINE = dict(
  tr = "9.9 &middot; 9 to 9",
  bl = """<div class="lead">Save up to</div>
          <div class="num"><b>30%</b></div>
          <div class="ben">Twelve hours in the same pair.<br>Still comfortable.</div>""",
  br = """<div class="cta">Shop Now</div>
          <div class="note">9 September only</div>""")

async def main():
    plates=prep(); os.makedirs(os.path.join(SP,"kv4out"),exist_ok=True)
    async with async_playwright() as pw:
        b=await pw.chromium.launch(
            executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
            args=["--force-color-profile=srgb","--disable-lcd-text"])
        for vn,d in [("KeyVisual",KV),("9.9",NINE)]:
            for sn,v in SIZES.items():
                p=os.path.join(SP,f"kv4out/{vn}_{sn}.html")
                open(p,"w").write(shell(v,plates[sn],d["tr"],d["bl"],d["br"]))
                pg=await b.new_page(viewport={"width":v["W"],"height":v["H"]},device_scale_factor=2)
                await pg.goto("file://"+p); await pg.wait_for_timeout(1100)
                await pg.screenshot(path=os.path.join(SP,f"kv4out/ToniBlack_NineToNine_{vn}_{sn}.png"))
                await pg.close(); print("rendered",vn,sn)
        await b.close()

asyncio.run(main())
