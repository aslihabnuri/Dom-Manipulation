"""Turn the angled Drive mockup into a front view: perspective-rectify the FRONT panel (real pixels, only warped),
drop the side gusset, round the cut corners. Output: v2/front_<name>.png (RGBA)."""
import cv2, numpy as np, sys
from PIL import Image, ImageDraw
W, H = 656, 982
SRC = np.float32([[165, 28], [676, 46], [733, 985], [190, 1010]])     # front panel corners in the 800x1091 mockup
DST = np.float32([[0, 0], [W, 0], [W, H], [0, H]])
M = cv2.getPerspectiveTransform(SRC, DST)
PADR, PADB = 60, 70                                                    # room for the bulging right edge and the base curve
for name in ('ube', 'matcha'):
    p = np.asarray(Image.open(f'mock_{name}_1000.png').convert('RGBA')).astype(np.float32)
    out = cv2.warpPerspective(p, M, (W + PADR, H + PADB), flags=cv2.INTER_LANCZOS4, borderValue=0)
    a = out[..., 3] / 255.0
    # left side: cut at the fold, with rounded top-left / bottom-left corners like the real pouch
    m = Image.new('L', (W + PADR, H + PADB), 0); d = ImageDraw.Draw(m)
    d.rounded_rectangle([2, 0, W + PADR + 200, H + PADB + 200], radius=26, fill=255)
    a = np.minimum(a, np.asarray(m).astype(np.float32) / 255.0)
    a = cv2.GaussianBlur(a, (0, 0), 0.8)
    out[..., 3] = a * 255
    im = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), 'RGBA'); im = im.crop(im.getbbox()); im.save(f'v2/front_{name}.png')
    print(name, im.size)
a = Image.open('v2/front_ube.png'); b = Image.open('v2/front_matcha.png')
s = Image.new('RGB', (a.width + b.width + 60, a.height + 40), (205, 172, 206)); s.paste(a, (20, 20), a); s.paste(b, (a.width + 40, 20), b); s.save('v2/fronts.jpg', quality=92)
