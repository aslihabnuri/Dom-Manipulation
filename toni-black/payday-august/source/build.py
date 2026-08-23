import asyncio, base64, json, os, sys
from playwright.async_api import async_playwright

SP = os.path.dirname(os.path.abspath(__file__))

def b64(p, mime):
    return f"data:{mime};base64," + base64.b64encode(open(p,'rb').read()).decode()

FONTS = {
    "z600": "fonts/ZalandoSansExpanded-600.ttf",
    "z700": "fonts/ZalandoSansExpanded-700.ttf",
    "z800": "fonts/ZalandoSansExpanded-800.ttf",
    "z900": "fonts/ZalandoSansExpanded-900.ttf",
    "a400": "fonts/Arimo-400.ttf",
    "a600": "fonts/Arimo-600.ttf",
    "a700": "fonts/Arimo-700.ttf",
}

def face(fam, weight, path):
    return f"""@font-face{{font-family:'{fam}';font-style:normal;font-weight:{weight};
    src:url('{b64(os.path.join(SP,path),"font/ttf")}') format('truetype');}}"""

FONT_CSS = "\n".join([
    face("ZSE",600,FONTS["z600"]), face("ZSE",700,FONTS["z700"]),
    face("ZSE",800,FONTS["z800"]), face("ZSE",900,FONTS["z900"]),
    face("Arimo",400,FONTS["a400"]), face("Arimo",600,FONTS["a600"]),
    face("Arimo",700,FONTS["a700"]),
])

# Brand tokens
INK      = "#282828"   # Dark Charcoal Black
WHITE    = "#FFFFFF"
STEEL    = "#CCCCCC"   # Steel Grey
GREY     = "#818284"
DAVIS    = "#4F5052"   # Davi's Grey (brand secondary)

VARIANTS = {
  "16x9": dict(W=1920, H=1080, photo="plates/final_16x9.png",
      pad=118, logoW=306, logoTop=92,
      blockTop=350, ruleW=54,
      kicker=40, kickerLs=".22em",
      sub=26,  subLs=".30em",
      hero=228, heroGapTop=10,
      gapKicker=24, gapHero=42, gapChips=46,
      chipFs=20, chipPadV=13, chipPadH=23, chipGap=13,
      ctaFs=22, ctaPadV=21, ctaPadH=44, dateFs=19,
      colW=730,
      scrim="linear-gradient(90deg, rgba(40,40,40,.985) 0%, rgba(40,40,40,.975) 32%, rgba(40,40,40,.90) 40%, rgba(40,40,40,.58) 46%, rgba(40,40,40,.21) 51%, rgba(40,40,40,0) 57%)"),
  "2x1": dict(W=1920, H=960, photo="plates/final_2x1.png",
      pad=118, logoW=290, logoTop=78,
      blockTop=300, ruleW=52,
      kicker=37, kickerLs=".22em",
      sub=25,  subLs=".30em",
      hero=206, heroGapTop=8,
      gapKicker=22, gapHero=38, gapChips=42,
      chipFs=19, chipPadV=12, chipPadH=22, chipGap=12,
      ctaFs=21, ctaPadV=19, ctaPadH=42, dateFs=18,
      colW=720,
      scrim="linear-gradient(90deg, rgba(40,40,40,.985) 0%, rgba(40,40,40,.975) 32%, rgba(40,40,40,.90) 40%, rgba(40,40,40,.58) 46%, rgba(40,40,40,.21) 51%, rgba(40,40,40,0) 57%)"),
}

def html(v):
    photo = b64(os.path.join(SP, v["photo"]), "image/png")
    logo  = b64(os.path.join(SP, "assets/logo_white.svg"), "image/svg+xml")
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
{FONT_CSS}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:{v['W']}px;height:{v['H']}px;overflow:hidden;background:{INK}}}
.stage{{position:relative;width:{v['W']}px;height:{v['H']}px;overflow:hidden;
  font-kerning:normal;text-rendering:geometricPrecision;
  -webkit-font-smoothing:antialiased}}
.photo{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center}}
.scrim{{position:absolute;inset:0;background:{v['scrim']}}}
.vig{{position:absolute;inset:0;background:
  radial-gradient(120% 90% at 72% 45%, rgba(0,0,0,0) 42%, rgba(0,0,0,.30) 100%)}}
.logo{{position:absolute;left:{v['pad']}px;top:{v['logoTop']}px;width:{v['logoW']}px;
  height:auto;display:block;margin-left:-1.5px}}
.col{{position:absolute;left:{v['pad']}px;top:{v['blockTop']}px;width:{v['colW']}px}}
.rule{{width:{v['ruleW']}px;height:3px;background:{WHITE};margin-bottom:20px}}
.kicker{{font-family:'ZSE';font-weight:800;font-size:{v['kicker']}px;letter-spacing:{v['kickerLs']};
  color:{WHITE};text-transform:uppercase;line-height:1;margin-left:-.062em}}
.sub{{font-family:'ZSE';font-weight:600;font-size:{v['sub']}px;letter-spacing:{v['subLs']};
  color:{STEEL};text-transform:uppercase;line-height:1;margin-top:{v['gapKicker']}px;margin-left:-.058em}}
.hero{{font-family:'ZSE';font-weight:900;font-size:{v['hero']}px;letter-spacing:-.020em;
  color:{WHITE};line-height:.84;margin-top:{v['heroGapTop']}px;margin-left:-.048em}}
.pct{{font-size:.54em;letter-spacing:-.01em;margin-left:.045em;
  display:inline-block;vertical-align:baseline;position:relative;top:-.50em}}
.chips{{display:flex;gap:{v['chipGap']}px;margin-top:{v['gapHero']}px;flex-wrap:nowrap}}
.chip{{font-family:'Arimo';font-weight:700;font-size:{v['chipFs']}px;letter-spacing:.085em;
  color:{WHITE};text-transform:uppercase;white-space:nowrap;
  padding:{v['chipPadV']}px {v['chipPadH']}px;border-radius:5px;
  background:{DAVIS};border:0}}
.foot{{display:flex;align-items:center;margin-top:{v['gapChips']}px}}
.cta{{font-family:'ZSE';font-weight:700;font-size:{v['ctaFs']}px;letter-spacing:.13em;
  color:{INK};background:{WHITE};text-transform:uppercase;line-height:1;
  padding:{v['ctaPadV']}px {v['ctaPadH']}px;border-radius:5px;white-space:nowrap}}
.div{{width:1px;height:26px;background:{DAVIS};margin:0 26px}}
.date{{font-family:'Arimo';font-weight:600;font-size:{v['dateFs']}px;letter-spacing:.16em;
  color:{STEEL};text-transform:uppercase;white-space:nowrap}}
</style></head><body>
<div class="stage">
  <img class="photo" src="{photo}">
  <div class="scrim"></div>
  <div class="vig"></div>
  <img class="logo" src="{logo}">
  <div class="col">
    <div class="rule"></div>
    <div class="kicker">Payday Sale</div>
    <div class="sub">Save up to</div>
    <div class="hero">30<span class="pct">%</span></div>
    <div class="chips">
      <div class="chip">Extra IDR 5K for new buyers</div>
      <div class="chip">Free shipping</div>
    </div>
    <div class="foot">
      <div class="cta">Shop Now</div>
      <div class="div"></div>
      <div class="date">24 &ndash; 31 August</div>
    </div>
  </div>
</div></body></html>"""

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
                                     args=["--force-color-profile=srgb","--disable-lcd-text"])
        for name, v in VARIANTS.items():
            p = os.path.join(SP, f"out/{name}.html")
            open(p,"w").write(html(v))
            pg = await b.new_page(viewport={"width":v["W"],"height":v["H"]}, device_scale_factor=2)
            await pg.goto("file://"+p)
            await pg.wait_for_timeout(1200)
            await pg.screenshot(path=os.path.join(SP,f"out/ToniBlack_PaydaySale_{name}.png"))
            await pg.close()
            print("rendered", name, v["W"]*2, "x", v["H"]*2)
        await b.close()

asyncio.run(main())
