import asyncio, base64, os
from playwright.async_api import async_playwright

SP = os.path.dirname(os.path.abspath(__file__))
def b64(p, mime): return f"data:{mime};base64," + base64.b64encode(open(p,'rb').read()).decode()

F = {"z600":"ZalandoSansExpanded-600","z700":"ZalandoSansExpanded-700",
     "z800":"ZalandoSansExpanded-800","z900":"ZalandoSansExpanded-900",
     "a400":"Arimo-400","a600":"Arimo-600","a700":"Arimo-700"}
def face(fam,w,f):
    return (f"@font-face{{font-family:'{fam}';font-style:normal;font-weight:{w};"
            f"src:url('{b64(os.path.join(SP,'fonts',f+'.ttf'),'font/ttf')}') format('truetype');}}")
FONT_CSS = "".join([face("ZSE",600,F["z600"]),face("ZSE",700,F["z700"]),
                    face("ZSE",800,F["z800"]),face("ZSE",900,F["z900"]),
                    face("Arimo",400,F["a400"]),face("Arimo",600,F["a600"]),
                    face("Arimo",700,F["a700"])])

# Brand tokens — nothing outside this set may appear in the graphics layer
INK   = "#282828"   # Dark Charcoal Black  (primary)
WHITE = "#FFFFFF"   # Clean White          (primary)
DAVIS = "#4F5052"   # Davi's Grey          (secondary)
GREY  = "#818284"   # Grey                 (secondary)
STEEL = "#CCCCCC"   # Steel Grey           (secondary)

SIZES = {
  "16x9": dict(W=1920, H=1080, col=0.345, pad=68, logoW=236, logoTop=78,
               hero=104, sup=20, ctaFs=17, timeFs=19, ruleW=48,
               offFs=76, ebFs=15),
  "2x1":  dict(W=1920, H=960,  col=0.345, pad=68, logoW=228, logoTop=68,
               hero=96,  sup=19, ctaFs=16.5, timeFs=18, ruleW=46,
               offFs=70, ebFs=14.5),
}

def shell(v, panel_html):
    am = b64(os.path.join(SP,"kv/am_bw.png"), "image/png")
    pm = b64(os.path.join(SP,"kv/pm_bw.png"), "image/png")
    colw = round(v["W"]*v["col"])
    photow = (v["W"]-colw)//2
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
{FONT_CSS}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:{v['W']}px;height:{v['H']}px;overflow:hidden;background:{WHITE}}}
.stage{{position:relative;width:{v['W']}px;height:{v['H']}px;overflow:hidden;display:flex;
  -webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;font-kerning:normal}}

.col{{width:{colw}px;height:100%;background:{WHITE};padding:{v['pad']}px;
  display:flex;flex-direction:column;position:relative;flex:0 0 auto}}
.logo{{width:{v['logoW']}px;height:auto;display:block;margin-left:-1.5px}}
.body{{margin-top:auto;margin-bottom:auto}}
.rule{{width:{v['ruleW']}px;height:3px;background:{INK};margin-bottom:22px}}

.eb{{font-family:'ZSE';font-weight:700;font-size:{v['ebFs']}px;letter-spacing:.24em;
  text-transform:uppercase;color:{DAVIS};margin-bottom:16px}}
.hero{{font-family:'ZSE';font-weight:900;font-size:{v['hero']}px;line-height:.90;
  letter-spacing:-.028em;color:{INK};text-transform:uppercase}}
.hero i{{display:block;font-style:normal}}
.hero .n{{margin-left:-.059em}}
.hero .t{{margin-left:-.021em}}
.off{{font-family:'ZSE';font-weight:900;font-size:{v['offFs']}px;line-height:.92;
  letter-spacing:-.025em;color:{INK};text-transform:uppercase}}
.off i{{display:block;font-style:normal}}
.off .s{{margin-left:-.032em}}
.off .u{{margin-left:-.052em}}
.sup{{font-family:'Arimo';font-weight:400;font-size:{v['sup']}px;line-height:1.5;
  color:{DAVIS};margin-top:22px;max-width:24ch;margin-left:-.02em}}
.cta{{font-family:'ZSE';font-weight:700;font-size:{v['ctaFs']}px;letter-spacing:.13em;
  text-transform:uppercase;color:{WHITE};background:{INK};border-radius:5px;
  padding:19px 30px;display:inline-block;margin-top:30px;white-space:nowrap}}
.note{{font-family:'Arimo';font-weight:600;font-size:14px;letter-spacing:.14em;
  text-transform:uppercase;color:{DAVIS};margin-top:20px}}

.ph{{width:{photow}px;height:100%;position:relative;flex:0 0 auto;overflow:hidden}}
.ph img{{width:100%;height:100%;object-fit:cover;display:block}}
.ph.am img{{object-position:50% 50%}}
.ph.pm img{{object-position:50% 50%}}
.seam{{position:absolute;left:0;top:0;bottom:0;width:1px;background:{STEEL}}}
.time{{position:absolute;left:34px;bottom:34px;font-family:'ZSE';font-weight:700;
  font-size:{v['timeFs']}px;letter-spacing:.20em;font-variant-numeric:tabular-nums}}
.time.d{{color:{INK}}}
.time.l{{color:{WHITE}}}
</style></head><body><div class="stage">
{panel_html}
  <div class="ph am"><div class="seam"></div><img src="{am}"><div class="time d">09:00</div></div>
  <div class="ph pm"><div class="seam"></div><img src="{pm}"><div class="time l">21:00</div></div>
</div></body></html>"""

def panel_kv(v):
    logo = b64(os.path.join(SP,"assets/logo_dark.svg"), "image/svg+xml")
    return f"""  <div class="col">
    <img class="logo" src="{logo}">
    <div class="body">
      <div class="rule"></div>
      <div class="hero"><i class="n">Nine</i><i class="t">to</i><i class="n">Nine</i></div>
      <div class="sup">Comfort that holds from morning to night.</div>
      <div class="cta">Discover Toni Black</div>
    </div>
  </div>"""

def panel_99(v):
    logo = b64(os.path.join(SP,"assets/logo_dark.svg"), "image/svg+xml")
    return f"""  <div class="col">
    <img class="logo" src="{logo}">
    <div class="body">
      <div class="rule"></div>
      <div class="eb">9.9 &middot; Nine to Nine</div>
      <div class="off"><i class="s">Save</i><i class="u">up to 30%</i></div>
      <div class="sup">Comfort that holds from morning to night.</div>
      <div class="cta">Shop Now</div>
      <div class="note">9 September only</div>
    </div>
  </div>"""

VARIANTS = [("KeyVisual", panel_kv), ("9.9", panel_99)]

async def main():
    os.makedirs(os.path.join(SP,"kvout"), exist_ok=True)
    async with async_playwright() as pw:
        b = await pw.chromium.launch(
            executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
            args=["--force-color-profile=srgb","--disable-lcd-text"])
        for vname, fn in VARIANTS:
            for sname, v in SIZES.items():
                html = shell(v, fn(v))
                p = os.path.join(SP, f"kvout/{vname}_{sname}.html")
                open(p,"w").write(html)
                pg = await b.new_page(viewport={"width":v["W"],"height":v["H"]}, device_scale_factor=2)
                await pg.goto("file://"+p); await pg.wait_for_timeout(1100)
                await pg.screenshot(path=os.path.join(SP,f"kvout/ToniBlack_NineToNine_{vname}_{sname}.png"))
                await pg.close()
                print("rendered", vname, sname, v["W"]*2, "x", v["H"]*2)
        await b.close()

asyncio.run(main())
