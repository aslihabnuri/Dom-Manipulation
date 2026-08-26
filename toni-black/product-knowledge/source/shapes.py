"""Shaped image plates for the product-knowledge deck.

PowerPoint's own AutoShapes only get us rectangles, rounded rectangles and
ellipses. The shapes in the reference deck are cut differently — a concave bite
where a round button nests, an arch, corners rounded on one diagonal only. So
each image is masked here and written as a PNG with alpha, then simply placed.

Masks are drawn at 4x and downsampled, which is what keeps the curves clean.
"""
import json, os
from PIL import Image, ImageDraw

SP  = os.path.dirname(os.path.abspath(__file__))
# the greyscale plates shot for the September campaign, reused here
PLATES = os.path.normpath(os.path.join(SP, "..", "..", "september-nine-to-nine",
                                       "source", "plates"))
Z   = json.load(open(os.path.join(SP, "zones.json")))

def plate_path(name):
    for ext in (".png", ".jpg"):
        p = os.path.join(PLATES, name + "_bw" + ext)
        if os.path.exists(p): return p
    raise FileNotFoundError(f"no plate for {name} in {PLATES}")
os.makedirs(os.path.join(SP, "img"), exist_ok=True)
SS  = 4                      # supersample factor
DPI = 200                    # render density: inches -> pixels

# ---------------------------------------------------------------- mask makers
def m_soft(d, W, H, r):
    d.rounded_rectangle([0, 0, W, H], radius=r, fill=255)

def m_arch(d, W, H, r):
    """Top swept into a full semicircle, bottom corners softly rounded.
    Build up from the cap — starting from a filled rounded rect would bury it."""
    cap = min(W / 2, H * 0.62)
    d.pieslice([0, 0, W, cap * 2], 180, 360, fill=255)          # the semicircular cap
    d.rounded_rectangle([0, cap, W, H], radius=r, fill=255)     # body, soft at the base
    d.rectangle([0, cap, W, min(H, cap + r)], fill=255)         # square off under the cap

def m_asym(d, W, H, r):
    """Big radius on one diagonal, tight on the other — reads as deliberate."""
    big, small = r, r * 0.22
    d.rounded_rectangle([0, 0, W, H], radius=big, fill=255)
    d.rounded_rectangle([0, 0, W * 0.6, H * 0.6], radius=small, fill=255)
    d.rounded_rectangle([W * 0.4, H * 0.4, W, H], radius=small, fill=255)

def m_notch(d, W, H, r, notch=0.0, corner="tr"):
    """Rounded rect with a concave quarter-round bitten out of one corner, so a
    round control can sit inside the silhouette without overlapping it."""
    m_soft(d, W, H, r)
    if notch <= 0: return
    cx, cy = (W, 0) if corner == "tr" else (0, 0) if corner == "tl" else \
             (W, H) if corner == "br" else (0, H)
    d.ellipse([cx - notch, cy - notch, cx + notch, cy + notch], fill=0)

MASKS = {"soft": m_soft, "arch": m_arch, "asym": m_asym, "notch": m_notch}

# ---------------------------------------------------------------- plate crop
def crop(plate, tw, th):
    """Crop to the target ratio while keeping the figure in frame."""
    src = Image.open(plate_path(plate)).convert("RGB")
    W, H = src.size
    want, have = tw / th, W / H
    z = Z[plate]
    if have > want:                       # too wide -> trim width around the figure
        nw = int(round(H * want))
        off = int(min(max(z["cx"] - nw * 0.5, 0), W - nw))
        src = src.crop((off, 0, off + nw, H))
    else:                                 # too tall -> trim height around the waist
        nh = int(round(W / want))
        top = int(min(max(z["waist"] - nh * 0.52, 0), H - nh))
        src = src.crop((0, top, W, top + nh))
    return src.resize((tw, th), Image.LANCZOS)

def make(name, plate, shape, w_in, h_in, radius_in=0.30, **kw):
    tw, th = int(round(w_in * DPI)), int(round(h_in * DPI))
    img = crop(plate, tw, th).convert("RGBA")
    m = Image.new("L", (tw * SS, th * SS), 0)
    d = ImageDraw.Draw(m)
    args = dict(kw)
    if "notch" in args: args["notch"] = args["notch"] * DPI * SS
    MASKS[shape](d, tw * SS, th * SS, radius_in * DPI * SS, **args)
    img.putalpha(m.resize((tw, th), Image.LANCZOS))
    p = os.path.join(SP, "img", f"{name}.png")
    img.save(p)
    print(f"  {name:22s} {shape:6s} {w_in:.2f}x{h_in:.2f}in  {tw}x{th}px")
    return p

def swatch(name, w_in, h_in, shape, radius_in=0.30, fill=(40, 40, 40), **kw):
    """A shaped block of flat colour — same silhouette language, no photo."""
    tw, th = int(round(w_in * DPI)), int(round(h_in * DPI))
    img = Image.new("RGBA", (tw, th), fill + (255,))
    m = Image.new("L", (tw * SS, th * SS), 0)
    d = ImageDraw.Draw(m)
    args = dict(kw)
    if "notch" in args: args["notch"] = args["notch"] * DPI * SS
    MASKS[shape](d, tw * SS, th * SS, radius_in * DPI * SS, **args)
    img.putalpha(m.resize((tw, th), Image.LANCZOS))
    p = os.path.join(SP, "img", f"{name}.png")
    img.save(p); print(f"  {name:22s} {shape:6s} flat")
    return p
