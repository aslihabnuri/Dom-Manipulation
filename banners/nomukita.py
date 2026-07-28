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
         within=None):
    """Paste the logo from the extracted source file — never redrawn."""
    import subprocess, tempfile
    width = width or round(300 * S)
    src = REPO / f'brand/logo/nomukita-{variant}.svg'
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


def finish(canvas_img, path, quality=92):
    """Design system §7.5: normalise the background, then write the file."""
    flat = Image.new('RGB', canvas_img.size, BONE)
    flat.paste(canvas_img, (0, 0), canvas_img)
    flat.save(path, 'PNG', optimize=True)
    size_mb = Path(path).stat().st_size / 1_048_576
    if size_mb > 2:                      # marketplace ceiling is 2 MB
        flat.save(str(path).replace('.png', '.jpg'), 'JPEG',
                  quality=quality, optimize=True, subsampling=0)
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
