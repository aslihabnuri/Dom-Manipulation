"""Toni Black motion video "Made For Every Body", 1080x1080, 24 fps, 18 s, cut to the music's bar grid.
Product carousel (real product photos), strike and sale price, SAVE UP TO 23%, FREE ONGKIR and
VOUCHER NEW BUYER 5K badges, SHOP NOW tapped by a hand cursor. Rendered frame by frame with PIL, piped to ffmpeg."""
import sys, os, math, subprocess, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy.ndimage import binary_erosion
sys.path.insert(0, os.path.dirname(__file__))
from logo import make_logo
import badges
F = os.environ.get("TB_FONTS", "fonts/static/")
W = H = 1080; FPS = 24; DUR = 18.0; M = 65
C = (40, 40, 40); G = (129, 130, 132); WH = (255, 255, 255); WALL = np.array([200, 202, 210.])
BLK, BLD, ARI = "ZalandoSansExpanded-Black.ttf", "ZalandoSansExpanded-Bold.ttf", "Arimo-Regular.ttf"
# bar starts (s) of the music cut (track 1, 11.82 s to 29.82 s; 8-bar phrase, the drop lands on 3.99)
BARS = [0.0, 2.00, 3.99, 5.97, 7.96, 9.96, 11.93, 13.93, 15.93]
PRODUCTS = [  # name, file, strike, sale
    ("BRIEF KIDS 3PCS", "brief_kids.png", 239000, 182850),
    ("BOXER BRIEF KIDS 3PCS", "boxer_brief_kids.png", 279000, 217350),
    ("BOXER BRIEF MEN 3PCS", "boxer_brief_men.png", 389000, 309350),
    ("BRIEF MEN 3PCS", "brief_men.png", 289000, 228850),
    ("BOXER MEN 2PCS", "boxer_men.png", 289000, 228850),
    ("CREWNECK MEN 2PCS", "crewneck.png", 369000, 286350),
    ("SINGLET MEN 2PCS", "tanktop.png", 289000, 228850),
]
def rp(v): return "Rp" + f"{v:,}".replace(",", ".")
def font(n, s): return ImageFont.truetype(F + n, int(s))
def ink(t, f, trk=0):
    im = Image.new("L", (int(f.size * (len(t) + 2)), int(f.size * 2)), 0); d = ImageDraw.Draw(im); x = f.size // 2
    for ch in t: d.text((x, f.size // 2), ch, font=f, fill=255); x += d.textlength(ch, font=f) + trk
    a = np.asarray(im) > 100; ys = np.where(a.any(1))[0]; xs = np.where(a.any(0))[0]
    return xs.min() - f.size // 2, ys.min() - f.size // 2, xs.max() - xs.min() + 1, ys.max() - ys.min() + 1
def at_cap(name, c, probe="H"):
    lo, hi = 6, 900
    while lo < hi:
        m = (lo + hi + 1) // 2
        if ink(probe, font(name, m))[3] <= c: lo = m
        else: hi = m - 1
    return font(name, lo)
def text_layer(t, f, trk=0, fill=C, pad=6):
    """Tight RGBA layer of tracked text; returns (img, w, h) with ink at (pad, pad)."""
    dx, dy, w, h = ink(t, f, trk); im = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0)); d = ImageDraw.Draw(im); x = pad - dx
    for ch in t: d.text((x, pad - dy), ch, font=f, fill=fill); x += d.textlength(ch, font=f) + trk
    return im, w, h
def ease(x): x = min(1, max(0, x)); return x * x * (3 - 2 * x)
def ease_out(x): x = min(1, max(0, x)); return 1 - (1 - x) ** 3
def back_out(x, s=1.4): x = min(1, max(0, x)); x -= 1; return 1 + (s + 1) * x ** 3 + s * x ** 2
def with_alpha(im, a):
    if a >= 0.999: return im
    im = im.copy(); im.putalpha(im.split()[3].point(lambda v: int(v * max(0, a)))); return im
def paste_c(cv, im, cx, cy, a=1.0, scale=1.0):
    if a <= 0.003: return
    if abs(scale - 1) > 0.003: im = im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))), Image.LANCZOS)
    im = with_alpha(im, a); cv.alpha_composite(im, (int(round(cx - im.width / 2)), int(round(cy - im.height / 2))))
def hand(size):
    """Minimal pointing hand, white with a charcoal outline, index finger up; tip at (0.36 size, 0)."""
    s = size * 4; im = Image.new("RGBA", (s, int(s * 1.25)), (0, 0, 0, 0)); d = ImageDraw.Draw(im); o = int(s * 0.045)
    shapes = [("r", (0.26, 0.00, 0.46, 0.62), 0.10), ("r", (0.44, 0.36, 0.62, 0.70), 0.09), ("r", (0.60, 0.42, 0.78, 0.74), 0.09),
              ("r", (0.76, 0.48, 0.92, 0.78), 0.08), ("r", (0.04, 0.50, 0.30, 0.70), 0.09), ("r", (0.18, 0.52, 0.92, 1.12), 0.18)]
    for col, grow in ((C, o), (WH, 0)):
        for _, (x0, y0, x1, y1), r in shapes:
            d.rounded_rectangle([x0 * s - grow, y0 * s - grow, x1 * s + grow, y1 * s + grow], radius=r * s + grow, fill=col)
    return im.resize((size, int(size * 1.25)), Image.LANCZOS)
class Scene:
    def __init__(s, prod_dir):
        rng = np.random.default_rng(7)
        yy, xx = np.mgrid[0:H, 0:W]; r = np.sqrt(((xx - W / 2) / (W * .7)) ** 2 + ((yy - H * .45) / (H * .7)) ** 2)
        noise = np.asarray(Image.fromarray((rng.normal(128, 40, (H, W))).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))).astype(float) - 128
        bg = WALL[None, None, :] + 7 * np.clip(1 - r, 0, 1)[..., None] + 0.06 * noise[..., None]
        s.bg = Image.fromarray(bg.clip(0, 255).astype(np.uint8)).convert("RGBA")
        lg = make_logo(C, 8); lw = 250; s.logo = lg.resize((lw, int(lg.height * lw / lg.width)), Image.LANCZOS)
        s.head, s.hw, s.hh = text_layer("MADE FOR EVERY BODY", at_cap(BLK, 36), 0.02 * 50)
        fk = at_cap(BLD, 18); s.kick, _, _ = text_layer("SAVE UP TO", fk, 0.16 * fk.size)
        fn = at_cap(BLK, 104); s.num, _, _ = text_layer("23%", fn, -0.02 * fn.size)
        fp = at_cap(BLD, 20); fs = at_cap(ARI, 21); fr = at_cap(BLD, 36)
        s.names = [text_layer(p[0], fp, 0.10 * fp.size)[0] for p in PRODUCTS]
        s.strikes = [text_layer(rp(p[2]), fs, 0.02 * fs.size, fill=G)[0] for p in PRODUCTS]
        s.sales = [text_layer(rp(p[3]), fr, 0.01 * fr.size)[0] for p in PRODUCTS]
        # products: trimmed, edges tightened (JPG cut-outs), soft shadow, fitted to one box
        s.prods = []
        for p in PRODUCTS:
            im = Image.open(os.path.join(prod_dir, p[1])).convert("RGBA"); im = im.crop(im.getbbox())
            if p[1] in ("crewneck.png", "tanktop.png"):
                a = binary_erosion(np.asarray(im.split()[3]) > 128, iterations=3)
                im.putalpha(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)))
            sc = min(440 / im.width, 300 / im.height) * 2; im = im.resize((int(im.width * sc), int(im.height * sc)), Image.LANCZOS)
            pad = 60; sh = Image.new("RGBA", (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0))
            shadow = Image.new("RGBA", sh.size, C + (0,)); shadow.putalpha(Image.new("L", sh.size, 0)); al = Image.new("L", sh.size, 0); al.paste(im.split()[3], (pad, pad + 14))
            shadow.putalpha(al.filter(ImageFilter.GaussianBlur(22)).point(lambda v: int(v * 0.22)))
            sh.alpha_composite(shadow); sh.alpha_composite(im, (pad, pad)); s.prods.append(sh)
        s.cache = {}
        # bottom row: badge, CTA, badge
        fb = at_cap("Arimo-Bold.ttf", 15); bi = 56
        def badge(icon, lines):
            ls = [text_layer(t, fb, 0.08 * fb.size)[0] for t in lines]; tw_ = max(l.width for l in ls); th = sum(l.height for l in ls) - 4 * (len(ls) - 1)
            im = Image.new("RGBA", (bi + 14 + tw_, max(bi, th)), (0, 0, 0, 0)); ic = icon(bi); im.alpha_composite(ic, (0, (im.height - bi) // 2)); y = (im.height - th) // 2
            for l in ls: im.alpha_composite(l, (bi + 14 - 6, y - 6 + 6)); y += l.height - 4
            return im
        s.b1 = badge(badges.truck, ["FREE ONGKIR"]); s.b2 = badge(badges.ticket, ["VOUCHER", "NEW BUYER 5K"])
        fc = at_cap(BLD, 18); s.cta_txt, cw, _ = text_layer("SHOP NOW", fc, 0.12 * fc.size, fill=WH); s.cta_w, s.cta_h = cw + 84, 62
        gap = 52; total = s.b1.width + gap + s.cta_w + gap + s.b2.width; x0 = (W - total) // 2; s.row_y = 936
        s.b1_x = x0; s.cta_x = x0 + s.b1.width + gap; s.b2_x = s.cta_x + s.cta_w + gap
        s.hand = hand(64)
    def prod_scaled(s, k, sc):
        key = (k, round(sc, 3))
        if key not in s.cache:
            im = s.prods[k]; s.cache[key] = im.resize((max(1, int(im.width * sc / 2)), max(1, int(im.height * sc / 2))), Image.LANCZOS)
        return s.cache[key]
    def frame(s, t):
        cv = s.bg.copy(); d = ImageDraw.Draw(cv)
        paste_c(cv, s.logo, W / 2, 40 + s.logo.height / 2, ease(t / 0.4))
        # headline wipe
        wp = ease((t - 0.25) / 0.6)
        if wp > 0:
            hl = s.head.crop((0, 0, max(1, int(s.head.width * wp)), s.head.height)); cv.alpha_composite(hl, (int((W - s.head.width) / 2), 116 - 6))
        paste_c(cv, s.kick, W / 2, 196 + s.kick.height / 2 - 6, ease((t - 0.7) / 0.3))
        pop = back_out((t - 0.85) / 0.45); pulse = 1 + 0.05 * math.sin(math.pi * min(1, max(0, (t - BARS[2]) / 0.3)))
        if t > 0.85: paste_c(cv, s.num, W / 2, 236 + s.num.height / 2 - 6, ease((t - 0.85) / 0.25), (0.86 + 0.14 * pop) * pulse)
        # carousel position p: -1.6 -> 0 during the intro, then one product per bar, arriving on the downbeat
        D_ = 470; SL = 0.42
        if t < BARS[1]: p = -1.6 * (1 - ease_out((t - 1.15) / (BARS[1] - 1.15)))
        else:
            p = 0.0
            for i in range(2, 8):
                p += ease((t - (BARS[i] - SL)) / SL)
        out = ease((t - BARS[8]) / 0.6)  # outro: all seven line up
        cy = 588
        for k in range(len(PRODUCTS)):
            dist = k - p
            if out <= 0 and abs(dist) > 1.7: continue
            x = W / 2 + dist * D_; sc = 1.0 - 0.28 * min(1, abs(dist)); y = cy
            if out > 0:   # outro grid: four over three
                tx = W / 2 + ((k - 1.5) if k < 4 else (k - 5)) * 232; ty = 500 if k < 4 else 708; tsc = 0.42; y = y + (ty - y) * out
                if abs(dist) > 1.7: x, sc = tx + (1 - out) * (600 if dist > 0 else -600), tsc
                else: x, sc = x + (tx - x) * out, sc + (tsc - sc) * out
            im = s.prod_scaled(k, sc); cv.alpha_composite(im, (int(x - im.width / 2), int(y - im.height / 2)))
        # name and prices of the product in front
        k = int(round(min(max(p, 0), 6))); fr = abs(p - round(p)); a = max(0.0, 1 - 3 * fr) * (1 - out) * ease((t - 1.6) / 0.4)
        dy = 10 * min(1, 3 * fr)
        paste_c(cv, s.names[k], W / 2, 396 + s.names[k].height / 2 - 6 + dy, a)
        st = s.strikes[k]; sx = W / 2; sy = 768 + st.height / 2 - 6 + dy; paste_c(cv, st, sx, sy, a)
        bar_t = t - (BARS[k + 1] if k + 1 < len(BARS) else 0)
        sw = ease((bar_t - 0.05) / 0.3) if k > 0 or t >= BARS[1] else 0
        if a > 0.02 and sw > 0:   # strike line on its own layer so it fades with the price
            lw_ = (st.width - 12) * sw; ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            ImageDraw.Draw(ov).line([(sx - (st.width - 12) / 2, sy + 1), (sx - (st.width - 12) / 2 + lw_, sy + 1)], fill=G + (int(255 * a),), width=3)
            cv.alpha_composite(ov)
        paste_c(cv, s.sales[k], W / 2, 802 + s.sales[k].height / 2 - 6 + dy, a)
        # bottom row
        ra = ease((t - 1.0) / 0.5); off = 40 * (1 - ease_out((t - 1.0) / 0.5))
        if ra > 0:
            cv.alpha_composite(with_alpha(s.b1, ra), (s.b1_x, int(s.row_y - s.b1.height / 2 + off)))
            cv.alpha_composite(with_alpha(s.b2, ra), (s.b2_x, int(s.row_y - s.b2.height / 2 + off)))
            # CTA with taps
            press = 0.0; ripple = None
            for tap in (BARS[3], BARS[5], BARS[7], 16.9):
                u = t - tap
                if 0 <= u < 0.18: press = math.sin(math.pi * u / 0.18)
                if 0 <= u < 0.5: ripple = u / 0.5
            sc = 1 - 0.06 * press; w_, h_ = s.cta_w * sc, s.cta_h * sc; cx = s.cta_x + s.cta_w / 2; cyy = s.row_y + off
            pill = Image.new("RGBA", (W, H), (0, 0, 0, 0)); pd = ImageDraw.Draw(pill)
            if ripple is not None:
                g_ = 18 * ease_out(ripple); pd.rounded_rectangle([cx - w_ / 2 - g_, cyy - h_ / 2 - g_, cx + w_ / 2 + g_, cyy + h_ / 2 + g_], radius=h_ / 2 + g_, outline=C + (int(110 * (1 - ripple)),), width=3)
            pd.rounded_rectangle([cx - w_ / 2, cyy - h_ / 2, cx + w_ / 2, cyy + h_ / 2], radius=h_ / 2, fill=C + (int(255 * ra),))
            cv.alpha_composite(pill); paste_c(cv, s.cta_txt, cx, cyy, ra, sc)
            # hand: in 0.35 s before the tap, out 0.45 s after
            for tap in (BARS[3], BARS[5], BARS[7], 16.9):
                u = t - tap
                if -0.4 <= u <= 0.6:
                    tipx, tipy = cx + s.cta_w * 0.22, cyy + 6
                    if u < 0: q = ease_out((u + 0.4) / 0.4); hx, hy = tipx + (1 - q) * 260, tipy + (1 - q) * 220
                    else: q = ease((u - 0.2) / 0.4); hx, hy = tipx + q * 260, tipy + q * 220
                    hs = 1 - 0.08 * press; hi_ = s.hand if hs > 0.999 else s.hand.resize((int(s.hand.width * hs), int(s.hand.height * hs)), Image.LANCZOS)
                    cv.alpha_composite(hi_, (int(hx - hi_.width * 0.36), int(hy)))
        return cv.convert("RGB")
def render(prod_dir, music, out, preview_times=None):
    sc = Scene(prod_dir)
    if preview_times:
        for t in preview_times: sc.frame(t).save(f"{out}_{t:05.2f}.jpg", quality=90)
        return
    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
           "-i", music, "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
           "-movflags", "+faststart", "-shortest", out]
    pr = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for i in range(int(DUR * FPS)): pr.stdin.write(sc.frame(i / FPS).tobytes())
    pr.stdin.close(); pr.wait(); print("wrote", out)
if __name__ == "__main__":
    a = sys.argv
    if a[1] == "preview": render(a[2], None, a[3], [float(v) for v in a[4:]])
    else: render(a[1], a[2], a[3])
