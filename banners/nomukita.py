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


def logo(canvas, y, width=None, variant='wordmark', align='center', x=None):
    """Paste the logo from the extracted source file — never redrawn."""
    import subprocess, tempfile
    width = width or round(300 * S)
    src = REPO / f'brand/logo/nomukita-{variant}.svg'
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
        subprocess.run(['rsvg-convert', '-w', str(width), str(src), '-o', tmp.name],
                       check=True)
        im = Image.open(tmp.name).convert('RGBA')
    if x is None:
        x = (W - im.width) / 2 if align == 'center' else MARGIN
    elif align == 'right':
        x = x - im.width
    canvas.alpha_composite(im, (round(x), round(y)))
    return im


def rule(draw, y, x0=MARGIN, x1=W - MARGIN, fill=RULE, width=2):
    draw.line([(x0, y), (x1, y)], fill=fill, width=width)


def canvas():
    return Image.new('RGBA', (W, H), BONE + (255,))


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
