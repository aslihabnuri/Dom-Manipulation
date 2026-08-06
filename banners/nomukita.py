"""Toolkit for building Nomukita marketplace banners.

Follows "NOMUKITA - DESIGN SYSTEM CAROUSEL MARKETPLACE" (locked 24 July 2026):
1024x1024 master scaled to the sanctioned 3:4 portrait, bone white background,
62px margin, All Round Gothic headlines, Comfortaa body, Shippori Mincho kanji,
logos pasted from source files, background normalised as the final step.
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SCRATCH = Path('/tmp/claude-0/-home-user-Dom-Manipulation'
               '/43b48db6-6047-5848-a5ab-808fbb07d53d/scratchpad')
REPO = Path(__file__).resolve().parent.parent

# ── canvas ────────────────────────────────────────────────────────────────
MASTER = 1024
W, H = 1200, 1600           # 3:4, built by adding space above/below the master
S = W / MASTER              # 1.171875
MARGIN = round(62 * S)      # 73

# ── colour (design system §2) ─────────────────────────────────────────────
BONE = (241, 240, 235)
CHARCOAL = (28, 28, 28)
MATCHA = (122, 154, 63)
COCOA = (59, 36, 24)
STEEL = (91, 144, 176)      # rating drops and bullets
SIGNATURE = (168, 196, 216)  # small brand markers
RULE = (219, 216, 208)
KANJI_WM = (233, 231, 235)
LOGO_BLUE = (68, 180, 217)  # the blue actually used in the logo artwork

# ── type ──────────────────────────────────────────────────────────────────
ARG = REPO / 'banners/assets/fonts/All Round Gothic'
ARG_BOLD = str(ARG / 'Fontspring-DEMO-allroundgothic-bold.otf')
ARG_DEMI = str(ARG / 'Fontspring-DEMO-allroundgothic-demi.otf')
COMFORTAA = '/usr/local/share/fonts/nomukita/Comfortaa.ttf'
SHIPPORI = '/usr/local/share/fonts/nomukita/ShipporiMincho-Regular.ttf'

# All Round Gothic here is the Fontspring DEMO. Thirty glyphs are replaced by a
# "DEMO" mark; they were found by rendering every character and matching each
# bitmap against a known-locked one. The design system lists only four of them.
LOCKED = set('4%&-–°\'·>/+()!"_*#@[]{}=~^$|\\<')

_cache = {}


def _font(path, size, weight=None):
    key = (path, size, weight)
    if key not in _cache:
        f = ImageFont.truetype(path, size)
        if weight is not None:
            f.set_variation_by_axes([weight])
        _cache[key] = f
    return _cache[key]


def arg(size, demi=False):
    return _font(ARG_DEMI if demi else ARG_BOLD, size)


def comf(size, weight=400):
    return _font(COMFORTAA, size, weight)


def jp(size):
    return _font(SHIPPORI, size)


def _cap(font):
    """Cap height, used to size the substitute font to match All Round Gothic."""
    box = font.getbbox('H')
    return box[3] - box[1]


def _runs(text, size, demi, sub_weight):
    """Split text into (font, char, advance), swapping fonts on locked glyphs."""
    primary = arg(size, demi)
    target = _cap(primary)

    # scale Comfortaa so its caps match All Round Gothic's caps at this size
    probe = comf(size, sub_weight)
    scale = target / max(_cap(probe), 1)
    fallback = comf(max(round(size * scale), 1), sub_weight)

    out = []
    for ch in text:
        f = fallback if ch in LOCKED else primary
        out.append((f, ch, f.getlength(ch)))
    return out


def text_width(text, size, demi=False, tracking=0, sub_weight=700):
    runs = _runs(text, size, demi, sub_weight)
    return sum(a for _, _, a in runs) + tracking * max(len(runs) - 1, 0)


def text(draw, xy, string, size, fill, demi=False, tracking=0,
         align='left', sub_weight=700):
    """Draw a headline run on its baseline, substituting fonts for locked glyphs."""
    x, baseline = xy
    runs = _runs(string, size, demi, sub_weight)
    total = sum(a for _, _, a in runs) + tracking * max(len(runs) - 1, 0)
    if align == 'center':
        x -= total / 2
    elif align == 'right':
        x -= total
    for f, ch, adv in runs:
        if ch != ' ':
            draw.text((x, baseline), ch, font=f, fill=fill, anchor='ls')
        x += adv + tracking
    return total


def body(draw, xy, lines, size, fill, leading=1.55, align='left', weight=400):
    """Comfortaa body copy, lowercase, at the design system's 1.55 leading."""
    x, y = xy
    f = comf(size, weight)
    step = size * leading
    for i, line in enumerate(lines):
        ly = y + i * step
        if align == 'center':
            draw.text((x, ly), line, font=f, fill=fill, anchor='ma')
        elif align == 'right':
            draw.text((x, ly), line, font=f, fill=fill, anchor='ra')
        else:
            draw.text((x, ly), line, font=f, fill=fill, anchor='la')
    return len(lines) * step


def wrap(string, size, max_width, weight=400):
    f = comf(size, weight)
    words, lines, cur = string.split(), [], ''
    for w_ in words:
        trial = f'{cur} {w_}'.strip()
        if f.getlength(trial) <= max_width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w_
    if cur:
        lines.append(cur)
    return lines


# ── drawn glyphs (locked in the DEMO font, so built as vectors) ────────────

PERCENT_WIDTH = 0.88   # of cap height


def percent(canvas, x, baseline, height, fill, ss=6):
    """Geometric percent sign matching All Round Gothic's construction.

    The DEMO font locks '%', so it is built from two rings and a diagonal and
    supersampled for clean edges.
    """
    w = height * PERCENT_WIDTH
    layer = Image.new('RGBA', (round(w * ss), round(height * ss)), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    r = height * 0.235 * ss
    t = height * 0.150 * ss
    W_, H_ = layer.size

    d.line([(height * 0.085 * ss, H_ - t / 2), (W_ - height * 0.085 * ss, t / 2)],
           fill=fill + (255,), width=round(t))
    for cx, cy in ((r, r), (W_ - r, H_ - r)):
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill + (255,))
        d.ellipse([cx - r + t, cy - r + t, cx + r - t, cy + r - t], fill=(0, 0, 0, 0))

    layer = layer.resize((round(w), round(height)), Image.LANCZOS)
    canvas.alpha_composite(layer, (round(x), round(baseline - height)))
    return w


def trim_frame(img, tol=10):
    """Drop the near-uniform border the generator bakes around an illustration."""
    im = img.convert('RGB')
    px = im.load()
    corner = px[0, 0]

    def uniform(pixels):
        return all(max(abs(a - b) for a, b in zip(p, corner)) <= tol for p in pixels)

    left, right, top, bottom = 0, im.width - 1, 0, im.height - 1
    step = max(im.height // 60, 1)
    while left < right and uniform([px[left, y] for y in range(0, im.height, step)]):
        left += 1
    while right > left and uniform([px[right, y] for y in range(0, im.height, step)]):
        right -= 1
    step = max(im.width // 60, 1)
    while top < bottom and uniform([px[x, top] for x in range(0, im.width, step)]):
        top += 1
    while bottom > top and uniform([px[x, bottom] for x in range(0, im.width, step)]):
        bottom -= 1
    return im.crop((left, top, right + 1, bottom + 1))


def chevron(draw, x, cy, size, fill, width=3):
    """A '>' built as a path — the DEMO font locks the real glyph."""
    h = size / 2
    draw.line([(x, cy - h), (x + size * 0.55, cy), (x, cy + h)],
              fill=fill, width=width, joint='curve')
    return size * 0.55


def drop(canvas, x, y, size, fill):
    """The nomukita logomark, rendered from the source SVG and recoloured.

    Drawn from the real file rather than approximated, per design system §7.4.
    """
    import subprocess, tempfile, re
    size = max(round(size), 2)
    svg = (REPO / 'brand/logo/nomukita-logomark.svg').read_text()
    svg = re.sub(r'fill="#[0-9A-Fa-f]{6}"',
                 'fill="#%02X%02X%02X"' % fill[:3], svg)
    with tempfile.NamedTemporaryFile(suffix='.svg', mode='w', delete=False) as s:
        s.write(svg)
        src = s.name
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
        subprocess.run(['rsvg-convert', '-h', str(size), src, '-o', tmp.name],
                       check=True)
        mark = Image.open(tmp.name).convert('RGBA')
    canvas.alpha_composite(mark, (round(x), round(y)))
    return mark.width


# ── image helpers ─────────────────────────────────────────────────────────

def cover(img, box_w, box_h):
    """Scale to fill a box, centre-cropped."""
    img = img.convert('RGB')
    scale = max(box_w / img.width, box_h / img.height)
    img = img.resize((max(round(img.width * scale), box_w),
                      max(round(img.height * scale), box_h)), Image.LANCZOS)
    left = (img.width - box_w) // 2
    top = (img.height - box_h) // 2
    return img.crop((left, top, left + box_w, top + box_h))


def pouch(path, height):
    """Trim a mockup to its ink and scale it to a target height."""
    im = Image.open(path).convert('RGBA')
    im = im.crop(im.getbbox())
    scale = height / im.height
    return im.resize((round(im.width * scale), height), Image.LANCZOS)


def contact_shadow(canvas, im, x, y, blur=18, opacity=64, squash=0.10, spread=1.10):
    """A soft ellipse under a product so it sits on the surface instead of floating."""
    w = round(im.width * spread)
    h = max(round(im.width * squash), 6)
    layer = Image.new('RGBA', (w + blur * 4, h + blur * 4), (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse(
        [blur * 2, blur * 2, blur * 2 + w, blur * 2 + h], fill=(30, 28, 24, opacity))
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    canvas.alpha_composite(
        layer, (round(x + im.width / 2 - layer.width / 2), round(y + im.height - h)))


def logo(canvas, y, width=None, variant='wordmark', align='center', x=None,
         within=None, colour=None):
    """Paste the logo from the extracted source file — never redrawn."""
    import subprocess, tempfile
    width = width or round(300 * S)
    src = REPO / f'brand/logo/nomukita-{variant}.svg'
    if colour is not None:
        import re
        svg = src.read_text()
        svg = re.sub(r'fill="#[0-9A-Fa-f]{6}"', f'fill="{colour}"', svg)
        with tempfile.NamedTemporaryFile(suffix='.svg', mode='w', delete=False) as f:
            f.write(svg)
            src = f.name
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
        subprocess.run(['rsvg-convert', '-w', str(width), str(src), '-o', tmp.name],
                       check=True)
        im = Image.open(tmp.name).convert('RGBA')
    if x is None:
        span = within if within is not None else W
        x = (span - im.width) / 2 if align == 'center' else MARGIN
    elif align == 'right':
        x = x - im.width
    canvas.alpha_composite(im, (round(x), round(y)))
    return im


def rule(draw, y, x0=MARGIN, x1=W - MARGIN, fill=RULE, width=2):
    draw.line([(x0, y), (x1, y)], fill=fill, width=width)


def canvas(w=None, h=None):
    return Image.new('RGBA', (w or W, h or H), BONE + (255,))


MAX_BYTES = 2 * 1_048_576            # marketplace ceiling


def finish(canvas_img, path, quality=94):
    """Design system §7.5: normalise the background, then write the file.

    Flat artwork stays PNG. Photographic slides blow past the 2 MB marketplace
    ceiling as PNG, so those fall back to JPEG and the oversized PNG is removed
    rather than left behind for someone to upload by mistake.
    """
    path = Path(path)
    flat = Image.new('RGB', canvas_img.size, BONE)
    flat.paste(canvas_img, (0, 0), canvas_img)
    flat.save(path, 'PNG', optimize=True)
    if path.stat().st_size <= MAX_BYTES:
        return flat

    jpg = path.with_suffix('.jpg')
    q = quality
    while q >= 70:
        flat.save(jpg, 'JPEG', quality=q, optimize=True, progressive=True,
                  subsampling=0)
        if jpg.stat().st_size <= MAX_BYTES:
            break
        q -= 4
    path.unlink()
    return flat


# ── flat-illustration pouch ───────────────────────────────────────────────

def flat_pouch(height, accent, label=None, wordmark_ratio=0.56,
               body=(26, 26, 26), gusset=(15, 15, 15), seal=(42, 42, 42),
               tab=LOGO_BLUE):
    """A flat-vector pouch matching the real mockup's construction.

    Drawn rather than generated: the vertical wordmark has to stay legible and
    correctly formed, which is exactly what an image model gets wrong.
    """
    import subprocess, tempfile, re
    ss = 3
    w = round(height * 0.545)
    W_, H_ = w * ss, height * ss
    im = Image.new('RGBA', (W_, H_), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    r = round(w * 0.055 * ss)
    d.rounded_rectangle([0, 0, W_, H_], radius=r, fill=body + (255,))

    # left gusset panel reads as the pouch's side face
    gw = round(W_ * 0.17)
    d.rounded_rectangle([0, 0, gw + r, H_], radius=r, fill=gusset + (255,))
    d.rectangle([gw, 0, gw + r, H_], fill=gusset + (255,))

    # top seal band
    sh = round(H_ * 0.125)
    d.rounded_rectangle([0, 0, W_, sh + r], radius=r, fill=seal + (255,))
    d.rectangle([0, sh, W_, sh + r], fill=seal + (255,))
    d.line([(0, sh), (W_, sh)], fill=(12, 12, 12, 255), width=max(ss, 2))

    # cyan tab hanging over the seal, with the logomark inside it
    tw, th = round(W_ * 0.235), round(H_ * 0.175)
    tx = round(W_ * 0.63)
    d.rounded_rectangle([tx, 0, tx + tw, th], radius=tw // 2,
                        corners=(False, False, True, True), fill=tab + (255,))
    svg = (REPO / 'brand/logo/nomukita-logomark.svg').read_text()
    svg = re.sub(r'fill="#[0-9A-Fa-f]{6}"', 'fill="#FFFFFF"', svg)
    with tempfile.NamedTemporaryFile(suffix='.svg', mode='w', delete=False) as s:
        s.write(svg)
        marksrc = s.name
    msize = round(tw * 0.52)
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as t:
        subprocess.run(['rsvg-convert', '-h', str(msize), marksrc, '-o', t.name],
                       check=True)
        mark = Image.open(t.name).convert('RGBA')
    im.alpha_composite(mark, (tx + (tw - mark.width) // 2,
                              round(th * 0.42) - mark.height // 2))

    # the wordmark, rotated to run down the face exactly as it does on the pouch
    word_h = round(H_ * wordmark_ratio)
    wm_svg = (REPO / 'brand/logo/nomukita-wordmark.svg').read_text()
    # the pouch carries the letters only — the dot lives in the cyan tab
    wm_svg = re.sub(r'<g transform="[^"]*" fill="#44B4D9"[^>]*>.*?</g>', '',
                    wm_svg, flags=re.S)
    wm_svg = re.sub(r'fill="#1C1C1C"', 'fill="#FFFFFF"', wm_svg)
    with tempfile.NamedTemporaryFile(suffix='.svg', mode='w', delete=False) as s:
        s.write(wm_svg)
        wsrc = s.name
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as t:
        subprocess.run(['rsvg-convert', '-w', str(word_h), wsrc, '-o', t.name],
                       check=True)
        word = Image.open(t.name).convert('RGBA')
    word = word.transpose(Image.ROTATE_270)          # reads top to bottom
    im.alpha_composite(word, (round(W_ * 0.66), round(H_ * 0.235)))

    # category colour dot
    ds = round(W_ * 0.115)
    dsvg = (REPO / 'brand/logo/nomukita-logomark.svg').read_text()
    dsvg = re.sub(r'fill="#[0-9A-Fa-f]{6}"',
                  'fill="#%02X%02X%02X"' % accent[:3], dsvg)
    with tempfile.NamedTemporaryFile(suffix='.svg', mode='w', delete=False) as s:
        s.write(dsvg)
        dsrc = s.name
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as t:
        subprocess.run(['rsvg-convert', '-h', str(ds), dsrc, '-o', t.name], check=True)
        dot = Image.open(t.name).convert('RGBA')
    im.alpha_composite(dot, (round(W_ * 0.34), round(H_ * 0.55)))

    sheen = Image.new('RGBA', (W_, H_), (0, 0, 0, 0))
    grad = Image.new('L', (W_, 1))
    for xg in range(W_):
        t_ = xg / W_
        grad.putpixel((xg, 0), int(26 * max(0.0, 1 - abs(t_ - 0.30) / 0.34)))
    sheen.putalpha(grad.resize((W_, H_)))
    sheen.paste((255, 255, 255), (0, 0, W_, H_), sheen.getchannel('A'))
    body_mask = Image.new('L', (W_, H_), 0)
    ImageDraw.Draw(body_mask).rounded_rectangle([0, 0, W_, H_], radius=r, fill=255)
    im.paste(Image.alpha_composite(im, sheen), (0, 0), body_mask)

    if label:
        series, kanji, name, gram = label
        lx = round(W_ * 0.25)
        ly = round(H_ * 0.665)
        d.text((lx, ly), series, font=comf(round(H_ * 0.022), 400),
               fill=(196, 178, 150, 255))
        d.text((lx, ly + H_ * 0.038), kanji, font=jp(round(H_ * 0.029)),
               fill=(255, 255, 255, 255))
        for i, ln in enumerate(name):
            d.text((lx, ly + H_ * (0.084 + i * 0.032)), ln,
                   font=comf(round(H_ * 0.026), 700), fill=(255, 255, 255, 255))
        d.text((lx, ly + H_ * 0.168), gram, font=comf(round(H_ * 0.022), 400),
               fill=(230, 230, 230, 255))

    bh = round(H_ * 0.055)
    d.rounded_rectangle([0, H_ - bh - r, W_, H_], radius=r, fill=gusset + (255,))
    d.rectangle([0, H_ - bh - r, W_, H_ - bh], fill=gusset + (255,))

    return im.resize((w, height), Image.LANCZOS)


# ── 3D-illustration pouch ─────────────────────────────────────────────────

def _hgrad(size, stops):
    """One-pixel-tall gradient stretched to size. stops: [(t, value), ...]."""
    w, h = size
    strip = Image.new('L', (w, 1))
    px = strip.load()
    for x in range(w):
        t = x / max(w - 1, 1)
        for i in range(len(stops) - 1):
            t0, v0 = stops[i]
            t1, v1 = stops[i + 1]
            if t0 <= t <= t1:
                k = (t - t0) / max(t1 - t0, 1e-6)
                px[x, 0] = int(v0 + (v1 - v0) * k)
                break
        else:
            px[x, 0] = stops[-1][1]
    return strip.resize((w, h))


def pouch3d(height, accent, label=None, body=(30, 30, 30), tab=LOGO_BLUE, ss=3):
    """A stand-up pouch drawn with volume: bulged silhouette, angled gusset
    face, a top plane and form shading.

    Built rather than generated — an image model cannot be trusted with the
    vertical wordmark, and the mockups are photographs, not illustration.
    """
    import subprocess, tempfile, re, math

    Wp = round(height * 0.60)
    W_, H_ = Wp * ss, height * ss
    im = Image.new('RGBA', (W_, H_), (0, 0, 0, 0))

    top_y = round(H_ * 0.075)          # top plane sits above this
    gw = W_ * 0.215                    # side gusset face
    bulge = W_ * 0.022

    def edges(t):
        """Left and right silhouette x at vertical fraction t (0 top, 1 bottom)."""
        swell = bulge * math.sin(math.pi * min(max(t, 0), 1) ** 0.85)
        left = W_ * 0.035 * (1 - t) - swell
        right = W_ - W_ * 0.035 * (1 - t) + swell
        return left, right

    steps = 160
    left_pts, right_pts, seam_pts = [], [], []
    for i in range(steps + 1):
        t = i / steps
        y = top_y + (H_ - top_y) * t
        lx, rx = edges(t)
        left_pts.append((lx, y))
        right_pts.append((rx, y))
        seam_pts.append((lx + gw, y))

    silhouette = left_pts + right_pts[::-1]
    front_poly = seam_pts + right_pts[::-1]
    gusset_poly = left_pts + seam_pts[::-1]

    d = ImageDraw.Draw(im)
    d.polygon(silhouette, fill=body + (255,))

    # form shading across the front face: light from the upper left
    front_mask = Image.new('L', (W_, H_), 0)
    ImageDraw.Draw(front_mask).polygon(front_poly, fill=255)
    shade = Image.new('RGBA', (W_, H_), (255, 255, 255, 0))
    shade.putalpha(_hgrad((W_, H_), [(0.0, 0), (0.16, 30), (0.34, 16),
                                     (0.72, 0), (1.0, 0)]))
    im.paste(Image.alpha_composite(im, shade), (0, 0), front_mask)
    dark = Image.new('RGBA', (W_, H_), (0, 0, 0, 0))
    dark.putalpha(_hgrad((W_, H_), [(0.0, 0), (0.60, 0), (1.0, 74)]))
    im.paste(Image.alpha_composite(im, dark), (0, 0), front_mask)

    # the gusset is turned away from the light
    gm = Image.new('L', (W_, H_), 0)
    ImageDraw.Draw(gm).polygon(gusset_poly, fill=255)
    gshade = Image.new('RGBA', (W_, H_), (0, 0, 0, 0))
    gshade.putalpha(_hgrad((W_, H_), [(0.0, 130), (0.6, 88), (1.0, 150)]))
    im.paste(Image.alpha_composite(im, gshade), (0, 0), gm)

    # flat sealed top edge, the way the real pack is finished
    l0, r0 = edges(0)
    seal_h = H_ * 0.052
    d.rounded_rectangle([l0, top_y - seal_h, r0, top_y + seal_h * 0.35],
                        radius=round(seal_h * 0.45), fill=(52, 52, 52, 255))
    seal_mask = Image.new('L', (W_, H_), 0)
    ImageDraw.Draw(seal_mask).rounded_rectangle(
        [l0, top_y - seal_h, r0, top_y + seal_h * 0.35],
        radius=round(seal_h * 0.45), fill=255)
    sshade = Image.new('RGBA', (W_, H_), (0, 0, 0, 0))
    sshade.putalpha(_hgrad((W_, H_), [(0.0, 110), (0.3, 20), (1.0, 120)]))
    im.paste(Image.alpha_composite(im, sshade), (0, 0), seal_mask)

    # zip strip below the seal
    zip_y = top_y + H_ * 0.058
    d.line([(l0 + gw * 0.55, zip_y), (r0 - W_ * 0.035, zip_y)],
           fill=(78, 78, 78, 220), width=max(round(H_ * 0.009), 2))

    # seam where the gusset folds away from the front face
    d.line(seam_pts[2:], fill=(10, 10, 10, 120), width=max(round(ss * 0.9), 1))

    # base band — the flat bottom the pouch stands on
    base_t = 0.955
    lb, rb = edges(base_t)
    d.polygon([(lb, top_y + (H_ - top_y) * base_t), (rb, top_y + (H_ - top_y) * base_t),
               (right_pts[-1][0], H_), (left_pts[-1][0], H_)],
              fill=(14, 14, 14, 255))

    fl, fr = seam_pts[0][0], right_pts[0][0]     # front face span at the top
    fw = fr - fl

    # cyan tab
    tw, th = round(fw * 0.30), round(H_ * 0.155)
    tx = round(fl + fw * 0.56)
    d.rounded_rectangle([tx, top_y - seal_h * 0.9, tx + tw, top_y + th],
                        radius=tw // 2, corners=(False, False, True, True),
                        fill=tab + (255,))

    def svg_png(name, colour, **kw):
        s = (REPO / f'brand/logo/nomukita-{name}.svg').read_text()
        if name == 'wordmark':
            s = re.sub(r'<g transform="[^"]*" fill="#44B4D9"[^>]*>.*?</g>', '',
                       s, flags=re.S)
        s = re.sub(r'fill="#[0-9A-Fa-f]{6}"', f'fill="{colour}"', s)
        with tempfile.NamedTemporaryFile(suffix='.svg', mode='w', delete=False) as f:
            f.write(s)
            src = f.name
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as t:
            arg_ = ['-w', str(kw['w'])] if 'w' in kw else ['-h', str(kw['h'])]
            subprocess.run(['rsvg-convert', *arg_, src, '-o', t.name], check=True)
            return Image.open(t.name).convert('RGBA')

    mark = svg_png('logomark', '#FFFFFF', h=round(tw * 0.52))
    im.alpha_composite(mark, (tx + (tw - mark.width) // 2,
                              round(top_y + th * 0.40) - mark.height // 2))

    word = svg_png('wordmark', '#FFFFFF', w=round(H_ * 0.56))
    word = word.transpose(Image.ROTATE_270)
    im.alpha_composite(word, (round(fl + fw * 0.60), round(H_ * 0.255)))

    dot = svg_png('logomark', '#%02X%02X%02X' % accent[:3], h=round(fw * 0.145))
    im.alpha_composite(dot, (round(fl + fw * 0.20), round(H_ * 0.545)))

    if label:
        series, kanji, name, gram = label
        lx, ly = round(fl + fw * 0.12), round(H_ * 0.665)
        d.text((lx, ly), series, font=comf(round(H_ * 0.022), 400),
               fill=(198, 180, 152, 255))
        d.text((lx, ly + H_ * 0.038), kanji, font=jp(round(H_ * 0.029)),
               fill=(255, 255, 255, 255))
        for i, ln in enumerate(name):
            d.text((lx, ly + H_ * (0.084 + i * 0.032)), ln,
                   font=comf(round(H_ * 0.026), 700), fill=(255, 255, 255, 255))
        d.text((lx, ly + H_ * 0.168), gram, font=comf(round(H_ * 0.022), 400),
               fill=(228, 228, 228, 255))

    return im.resize((Wp, height), Image.LANCZOS)


def pouch250(height, accent, label=None, ss=3):
    """The 250 g format: a flat white stand pouch with a corded hangtag.

    A different construction from the stand-up packs, so it gets its own
    builder. The brush calligraphy is artwork, not type — it is composited
    from the source file rather than redrawn.
    """
    import subprocess, tempfile, re

    Wp = round(height * 1.19)
    W_, H_ = Wp * ss, height * ss
    im = Image.new('RGBA', (W_, H_), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    bx0 = round(W_ * 0.155)
    r = round(W_ * 0.055)
    d.rounded_rectangle([bx0, 0, W_, H_], radius=r, fill=(250, 249, 246, 255))

    face = Image.new('L', (W_, H_), 0)
    ImageDraw.Draw(face).rounded_rectangle([bx0, 0, W_, H_], radius=r, fill=255)
    shade = Image.new('RGBA', (W_, H_), (0, 0, 0, 0))
    shade.putalpha(_hgrad((W_, H_), [(0.0, 30), (0.24, 0), (0.80, 0), (1.0, 34)]))
    im.paste(Image.alpha_composite(im, shade), (0, 0), face)

    # zip strip
    zy = round(H_ * 0.135)
    d.rounded_rectangle([bx0 + W_ * 0.035, zy - H_ * 0.020,
                         W_ - W_ * 0.035, zy + H_ * 0.020],
                        radius=round(H_ * 0.02), fill=(238, 237, 233, 255))
    d.line([(bx0 + W_ * 0.05, zy), (W_ - W_ * 0.05, zy)],
           fill=(214, 213, 208, 255), width=max(ss, 2))

    # grommet and cord
    gx, gy = bx0 + W_ * 0.028, H_ * 0.115
    gr = W_ * 0.030
    d.ellipse([gx - gr, gy - gr, gx + gr, gy + gr], fill=(236, 235, 231, 255))
    d.ellipse([gx - gr * 0.42, gy - gr * 0.42, gx + gr * 0.42, gy + gr * 0.42],
              fill=(120, 120, 116, 255))
    cw = max(round(W_ * 0.014), 2)
    knot_y = H_ * 0.70
    d.line([(gx, gy + gr * 0.6), (gx - W_ * 0.048, H_ * 0.40), (gx - W_ * 0.030, knot_y)],
           fill=(146, 146, 132, 255), width=cw, joint='curve')
    d.ellipse([gx - W_ * 0.052, knot_y - W_ * 0.024,
               gx - W_ * 0.008, knot_y + W_ * 0.024], fill=(132, 132, 118, 255))
    for dx in (-0.062, -0.022):
        d.line([(gx - W_ * 0.030, knot_y + W_ * 0.018),
                (gx + W_ * dx, H_ * 0.93)],
               fill=(146, 146, 132, 255), width=max(round(cw * 0.8), 2), joint='curve')

    brush = Image.open(REPO / 'brand/logo/nomu-brush-250.png').convert('RGBA')
    bh = round(H_ * 0.635)
    brush = brush.resize((round(brush.width * bh / brush.height), bh), Image.LANCZOS)
    im.alpha_composite(brush, (round(bx0 + W_ * 0.085), round(H_ * 0.245)))

    if label:
        series, kanji, name, gram = label
        navy = (28, 52, 78, 255)
        lx, ly = round(W_ * 0.585), round(H_ * 0.545)
        d.text((lx, ly), series, font=comf(round(H_ * 0.044), 400), fill=navy)
        d.text((lx, ly + H_ * 0.072), kanji, font=jp(round(H_ * 0.052)), fill=navy)
        d.text((lx, ly + H_ * 0.152), name, font=comf(round(H_ * 0.048), 700),
               fill=navy)
        d.text((lx, ly + H_ * 0.238), gram, font=comf(round(H_ * 0.040), 700),
               fill=navy)

        s = (REPO / 'brand/logo/nomukita-logomark.svg').read_text()
        s = re.sub(r'fill="#[0-9A-Fa-f]{6}"', 'fill="#%02X%02X%02X"' % accent[:3], s)
        with tempfile.NamedTemporaryFile(suffix='.svg', mode='w', delete=False) as f:
            f.write(s)
            src = f.name
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as t:
            subprocess.run(['rsvg-convert', '-h', str(round(H_ * 0.085)), src,
                            '-o', t.name], check=True)
            dot = Image.open(t.name).convert('RGBA')
        im.alpha_composite(dot, (round(W_ * 0.855), round(H_ * 0.470)))

    return im.resize((Wp, height), Image.LANCZOS)


def tin(height, accent=MATCHA, label=None, ss=3):
    """A cylindrical matcha tin, drawn rather than generated.

    Same reason as the pouches: asked for a labelled tin, the image models
    returned "Pore Organic Ceremenial Grade" over three invented kanji. Built
    here, the wordmark comes from the source SVG and the label is real type.

    Drawn back to front — the body runs full height under the lid, then the lid
    skirt covers its top. Starting the body below the skirt instead leaves an
    unfilled ring between the two.
    """
    import subprocess, tempfile, re

    Wt = round(height * 0.92)
    W_, H_ = Wt * ss, height * ss
    im = Image.new('RGBA', (W_, H_), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    ry = W_ * 0.112                      # ellipse half-height: a shallow eye level
    lid_h = H_ * 0.085
    body_bot = H_ - ry
    dark = tuple(round(v * 0.78) for v in accent)

    def cyl(top, bottom, fill):
        d.rectangle([0, top, W_, bottom], fill=fill + (255,))
        d.ellipse([0, bottom - ry, W_, bottom + ry], fill=fill + (255,))

    cyl(ry, body_bot, accent)                            # body, full height
    cyl(ry, ry + lid_h, dark)                            # lid skirt over its top
    d.ellipse([0, 0, W_, ry * 2], fill=accent + (255,))  # lid face

    # One horizontal gradient over the whole silhouette turns the flat shapes
    # into a cylinder: bright at 18% across, falling away to both edges.
    sil = Image.new('L', (W_, H_), 0)
    sd = ImageDraw.Draw(sil)
    sd.rectangle([0, ry, W_, body_bot], fill=255)
    sd.ellipse([0, 0, W_, ry * 2], fill=255)
    sd.ellipse([0, body_bot - ry, W_, body_bot + ry], fill=255)
    lit = Image.new('RGBA', (W_, H_), (255, 255, 255, 0))
    lit.putalpha(_hgrad((W_, H_), [(0.0, 20), (0.18, 58), (0.42, 16), (0.7, 0), (1.0, 0)]))
    im.paste(Image.alpha_composite(im, lit), (0, 0), sil)
    shd = Image.new('RGBA', (W_, H_), (0, 0, 0, 0))
    shd.putalpha(_hgrad((W_, H_), [(0.0, 92), (0.14, 0), (0.60, 0), (1.0, 118)]))
    im.paste(Image.alpha_composite(im, shd), (0, 0), sil)

    # the seam where the lid sits down over the body
    d.line([(0, ry + lid_h), (W_, ry + lid_h)], fill=(0, 0, 0, 70),
           width=max(round(ss * 0.7), 1))

    def svg_png(name, colour, w):
        s = (REPO / f'brand/logo/nomukita-{name}.svg').read_text()
        if name == 'wordmark':
            s = re.sub(r'<g transform="[^"]*" fill="#44B4D9"[^>]*>.*?</g>', '',
                       s, flags=re.S)
        s = re.sub(r'fill="#[0-9A-Fa-f]{6}"', f'fill="{colour}"', s)
        with tempfile.NamedTemporaryFile(suffix='.svg', mode='w', delete=False) as f:
            f.write(s)
            src_ = f.name
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as t:
            subprocess.run(['rsvg-convert', '-w', str(round(w)), src_, '-o', t.name],
                           check=True)
            return Image.open(t.name).convert('RGBA')

    word = svg_png('wordmark', '#FFFFFF', W_ * 0.60)
    im.alpha_composite(word, ((W_ - word.width) // 2, round(H_ * 0.46)))

    if label:
        kanji, name = label
        cx = W_ / 2
        d.text((cx, H_ * 0.645), kanji, font=jp(round(H_ * 0.055)),
               fill=(255, 255, 255, 232), anchor='ms')
        d.text((cx, H_ * 0.725), name, font=comf(round(H_ * 0.044), 500),
               fill=(255, 255, 255, 222), anchor='ms')

    return im.resize((Wt, height), Image.LANCZOS)


def arc_text(canvas, centre, string, size, fill, radius, mid_deg=-90,
             demi=False, tracking=0, ss=3):
    """Set a line of type along a circular arc, after the client's reference.

    Each glyph is rendered on its own and rotated to the tangent, so the line
    curves around an object rather than sitting flat beside it. Supersampled,
    because rotating type at final size shreds the stems.
    """
    import math

    cx, cy = centre
    widths = [text_width(ch, size, demi=demi) + tracking for ch in string]
    total = sum(widths)
    ang = math.radians(mid_deg) - total / radius / 2

    for ch, w in zip(string, widths):
        step = w / radius
        a = ang + step / 2
        if ch != ' ':
            box = round(size * 2.2) * ss
            layer = Image.new('RGBA', (box, box), (0, 0, 0, 0))
            text(ImageDraw.Draw(layer), (box / 2 - w * ss / 2, box / 2 + size * 0.33 * ss),
                 ch, size * ss, fill, demi=demi)
            layer = layer.rotate(-math.degrees(a) - 90, Image.BICUBIC)
            layer = layer.resize((box // ss, box // ss), Image.LANCZOS)
            px = cx + radius * math.cos(a)
            py = cy + radius * math.sin(a)
            canvas.alpha_composite(layer, (round(px - layer.width / 2),
                                           round(py - layer.height / 2)))
        ang += step


def walker(height, body_w, phase=0, colour=(22, 22, 22), ss=3):
    """The cartoon legs and arms the client's reference puts under its cups.

    Drawn rather than generated: they are four rounded strokes and two shoes,
    and an image model asked to add them would redraw the pack above as well.
    One leg plants and the other steps, which is what reads as walking from the
    front; swinging both symmetrically just crosses them into a V. Arms hang off
    the pack's own width rather than off the leg length, or they float clear of
    a wide pack and clip a narrow one.

    Returns the layer and the hip point inside it, so the caller can hang it
    under a pack without knowing the padding.
    """
    W_ = round(max(body_w * 1.9, height * 2.6))
    H_ = round(height * 2.6)
    layer = Image.new('RGBA', (W_ * ss, H_ * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    ox, oy = W_ / 2, H_ - height * 1.05     # hips
    fill = colour + (255,)

    def limb(pts, w):
        pts = [(round(x * ss), round(y * ss)) for x, y in pts]
        w = round(w * ss)
        d.line(pts, fill=fill, width=w, joint='curve')
        for x, y in pts:
            d.ellipse([x - w / 2, y - w / 2, x + w / 2, y + w / 2], fill=fill)

    def shoe(ankle, toe):
        sw, sh = height * 0.34 * ss, height * 0.16 * ss
        s = Image.new('RGBA', (round(sw), round(sh)), (0, 0, 0, 0))
        ImageDraw.Draw(s).rounded_rectangle([0, 0, sw - 1, sh - 1],
                                            radius=sh / 2, fill=fill)
        layer.alpha_composite(s, (round(ankle[0] * ss + toe * sw * 0.24 - sw / 2),
                                  round(ankle[1] * ss - sh * 0.42)))

    step = 1 if phase else -1
    plant = (ox - step * height * 0.17, oy)
    limb([plant, (plant[0], oy + height * 0.46), (plant[0], oy + height * 0.90)],
         height * 0.135)
    shoe((plant[0], oy + height * 0.90), -step)

    hipb = ox + step * height * 0.17
    knee = (hipb + step * height * 0.13, oy + height * 0.44)
    ankle = (hipb + step * height * 0.26, oy + height * 0.80)
    limb([(hipb, oy), knee, ankle], height * 0.135)
    shoe(ankle, step)

    # Swung clear of the pack before they drop, or the whole forearm hides
    # behind a silhouette wider than the shoulder it hangs from.
    for side in (-1, 1):
        sx = ox + side * body_w * 0.44
        sy = oy - height * 0.72
        limb([(sx, sy), (sx + side * height * 0.30, sy + height * 0.22),
              (sx + side * height * 0.34, sy + height * 0.54)], height * 0.115)

    return layer.resize((W_, H_), Image.LANCZOS), ox, oy


def halo(canvas, layer, strength=0.62, blur=28):
    """Darken the ground immediately under a glyph layer, struck from its own
    shapes, so display type can cross a lit or patchy background.

    Shared by the banners that set type straight onto a photograph.
    """
    from PIL import ImageFilter
    sh = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    sh.paste((8, 7, 6, 255), (0, 0),
             layer.split()[3].point(lambda v: round(v * strength)))
    canvas.alpha_composite(sh.filter(ImageFilter.GaussianBlur(blur)))
    canvas.alpha_composite(layer)


def _tokens(markup):
    """Split marked-up copy into whitespace-delimited tokens.

    Each token is a list of (text, bold) runs rather than a single string, so
    punctuation stays welded to the word it follows — splitting on the asterisk
    alone turns "*tersegel*." into two tokens and prints "tersegel ." with a
    space before the stop.
    """
    runs, bold = [], False
    for part in markup.split('*'):
        if part:
            runs.append((part, bold))
        bold = not bold
    tokens, cur = [], []
    for text, b in runs:
        for i, piece in enumerate(text.split(' ')):
            if i:
                if cur:
                    tokens.append(cur)
                cur = []
            if piece:
                cur.append((piece, b))
    if cur:
        tokens.append(cur)
    return tokens


def _token_width(token, size, weight, bold):
    return sum(comf(size, bold if b else weight).getlength(t) for t, b in token)


def wrap_rich(markup, size, max_width, weight=400, bold=700):
    """Wrap marked-up copy, measuring every word at its own weight.

    Wrapping on the light weight alone overruns, because the bold words are
    wider than the text they replace.
    """
    space = comf(size, weight).getlength(' ')
    lines, cur, run = [], [], 0
    for token in _tokens(markup):
        w = _token_width(token, size, weight, bold)
        add = w if not cur else space + w
        if cur and run + add > max_width:
            lines.append(cur)
            cur, run = [token], w
        else:
            cur.append(token)
            run += add
    if cur:
        lines.append(cur)
    return lines


def body_rich(draw, xy, lines, size, fill, leading=1.55, weight=400, bold=700):
    """Body copy with individual words set bold, for the terms that carry an
    obligation. Takes the output of wrap_rich."""
    x0, y = xy
    space = comf(size, weight).getlength(' ')
    step = size * leading
    for i, line in enumerate(lines):
        x = x0
        for j, token in enumerate(line):
            if j:
                x += space
            for text, b in token:
                f = comf(size, bold if b else weight)
                draw.text((x, y + i * step), text, font=f, fill=fill, anchor='la')
                x += f.getlength(text)
    return len(lines) * step


def puff(mask, colour, steps=46, light=(-0.55, -0.72), ambient=0.60,
         spec=0.9, shine=9, relief=2.6):
    """Inflate a flat glyph mask into the soft 3D form the client's reference
    uses for its numerals.

    The height comes from a distance transform — the mask eroded a pixel at a
    time, each pass adding to an accumulator — mapped through a dome profile.
    Blurring the mask instead is the obvious shortcut and it fails: the blur
    saturates anywhere further from an edge than its radius, so the middle of a
    stroke comes out flat and the glyph reads as embossed rather than inflated.
    Steps should reach about half the stroke width.

    Normals are taken from that field, and the shading is Lambert plus a tight
    specular.
    """
    from PIL import ImageChops, ImageFilter
    import math

    bbox = mask.getbbox()
    if bbox is None:
        return Image.new('RGBA', mask.size, (0, 0, 0, 0))
    pad = 4
    box = (max(0, bbox[0] - pad), max(0, bbox[1] - pad),
           min(mask.width, bbox[2] + pad), min(mask.height, bbox[3] + pad))
    a = mask.crop(box)
    w, h_ = a.size

    inc = max(1, 255 // steps)
    dist = Image.new('L', (w, h_), 0)
    cur = a
    for _ in range(steps):
        cur = cur.filter(ImageFilter.MinFilter(3))
        dist = ImageChops.add(dist, cur.point(lambda v: inc if v > 127 else 0))

    # dome: steep at the rim, flattening toward the crown
    dome = dist.point(lambda v: round(255 * math.sqrt(max(0.0, 1 - (1 - v / 255) ** 2))))
    dome = dome.filter(ImageFilter.GaussianBlur(2.5))
    hp, ap = dome.load(), a.load()

    lx, ly = light
    lz = math.sqrt(max(0.0, 1 - lx * lx - ly * ly))
    out = Image.new('RGBA', (w, h_), (0, 0, 0, 0))
    op = out.load()
    r0, g0, b0 = colour[:3]

    for y in range(1, h_ - 1):
        for x in range(1, w - 1):
            alpha = ap[x, y]
            if not alpha:
                continue
            gx = (hp[x - 1, y] - hp[x + 1, y]) / 255.0
            gy = (hp[x, y - 1] - hp[x, y + 1]) / 255.0
            nx, ny = gx * relief, gy * relief
            inv = 1.0 / math.sqrt(nx * nx + ny * ny + 1.0)
            nx, ny, nz = nx * inv, ny * inv, inv
            lam = max(0.0, nx * lx + ny * ly + nz * lz)
            shade = ambient + (1 - ambient) * lam
            hl = spec * lam ** shine
            op[x, y] = (min(255, round(r0 * shade + 255 * hl)),
                        min(255, round(g0 * shade + 255 * hl)),
                        min(255, round(b0 * shade + 255 * hl)), alpha)

    full = Image.new('RGBA', mask.size, (0, 0, 0, 0))
    full.paste(out, (box[0], box[1]))
    return full
