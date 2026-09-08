# -*- coding: utf-8 -*-
"""
Merender teks judul menjadi PNG transparan dengan font Bebas Neue (tampilan sama di semua komputer).
Pakai:  python3 render_text.py <out.png> <ukuran_pt> <warna_hex> <lebar_maks_inci> <teks...>
Cetak:  "<lebar_inci> <tinggi_inci>"
"""
import sys, os
from PIL import Image, ImageDraw, ImageFont

FONT = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "tmp")  # placeholder, diganti di bawah
FONT = os.environ.get("BEBAS", os.path.expanduser("~/.fonts/BebasNeue-Regular.ttf"))
DPI = 300

out, size_pt, color, max_w_in = sys.argv[1], float(sys.argv[2]), sys.argv[3], float(sys.argv[4])
text = " ".join(sys.argv[5:]).replace("\\n", "\n")
rgb = tuple(int(color[i:i + 2], 16) for i in (0, 2, 4))
px = int(size_pt / 72 * DPI)
font = ImageFont.truetype(FONT, px)
max_w = int(max_w_in * DPI)

# bungkus baris otomatis bila melebihi lebar maksimum (kecuali sudah ada \n)
lines = []
for para in text.split("\n"):
    words = para.split(" "); cur = ""
    for w in words:
        t = (cur + " " + w).strip()
        if font.getlength(t) <= max_w or not cur: cur = t
        else: lines.append(cur); cur = w
    lines.append(cur)
line_h = int(px * 1.02)
W = int(max(font.getlength(l) for l in lines)) + 8
H = line_h * len(lines) + 8
im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
asc, desc = font.getmetrics()
for i, l in enumerate(lines):
    d.text((4, 4 + i * line_h + (line_h - (asc + desc)) // 2), l, font=font, fill=rgb + (255,))
im.save(out)
print(f"{W / DPI:.4f} {H / DPI:.4f}")
