import sys
import numpy as np
from PIL import Image, ImageFilter

logo_path, out_path = sys.argv[1], sys.argv[2]
W = H = 1080
BG = (240, 234, 224)          # warna krem dari video referensi
VX, VY, VW, VH = 46, 135, 456, 810   # posisi & ukuran video (9:16) sesuai referensi

# --- logo: hapus latar putih (color-to-alpha) ---
lg = np.asarray(Image.open(logo_path).convert("RGB")).astype(np.float32)
a = (255.0 - lg).max(axis=2) / 255.0
a[a < 0.03] = 0
safe = np.where(a > 0, a, 1)[..., None]
rgb = np.clip((lg - (1 - a[..., None]) * 255.0) / safe, 0, 255)
rgba = np.dstack([rgb, a * 255]).astype(np.uint8)
logo = Image.fromarray(rgba, "RGBA")
logo = logo.crop(logo.getbbox())
LW = 340
logo = logo.resize((LW, round(logo.height * LW / logo.width)), Image.LANCZOS)

canvas = Image.new("RGBA", (W, H), BG + (255,))

# --- bayangan lembut di bawah video ---
sh = Image.new("L", (W, H), 0)
sh.paste(60, (VX, VY + 8, VX + VW, VY + VH + 8))
sh = sh.filter(ImageFilter.GaussianBlur(14))
canvas = Image.composite(Image.new("RGBA", (W, H), (60, 45, 30, 255)), canvas, sh)

# --- logo di tengah area kanan ---
cx = (VX + VW + W) // 2
lx, ly = cx - logo.width // 2, H // 2 - logo.height // 2
canvas.alpha_composite(logo, (lx, ly))
canvas.convert("RGB").save(out_path)
print("logo", logo.size, "at", (lx, ly))
