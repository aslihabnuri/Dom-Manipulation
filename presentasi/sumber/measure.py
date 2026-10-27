import json, sys
from PIL import ImageFont
FONTS = {
    'head': '/root/.fonts/BarlowCondensed-ExtraBold.ttf',
    'head2': '/root/.fonts/BarlowCondensed-Bold.ttf',
    'body': '/root/.fonts/Barlow-Regular.ttf',
    'bodyb': '/root/.fonts/Barlow-Bold.ttf',
}
req = json.load(sys.stdin)
out = []
for font, size, text in req:
    f = ImageFont.truetype(FONTS[font], int(round(size * 10)))  # 10x for precision
    out.append(f.getlength(text) / 10 / 72)  # inches at 1pt = 1px @72dpi
print(json.dumps(out))
