"""Guide composite: the two REAL rectified fronts at exactly the same size inside scene B; AI then only harmonizes."""
import numpy as np, cv2, json
from PIL import Image, ImageDraw
B = Image.open('V2_B.png').convert('RGB'); Bn = np.asarray(B).astype(np.float32); Hh, Ww = Bn.shape[:2]
PW = 470; TOP = 745; XU, XM = 150, 622
def front(name):
    p = Image.open(f'front_{name}.png').convert('RGBA').crop((0, 0, 668, 1004))      # front panel only (no side bulge, no base curve)
    m = Image.new('L', p.size, 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, p.width - 1, p.height + 60], radius=22, fill=255)
    p.putalpha(Image.fromarray(np.minimum(np.asarray(p)[..., 3], np.asarray(m))))
    return p.resize((PW, round(p.height * PW / p.width)), Image.LANCZOS)
u, m = front('ube'), front('matcha'); print("pouch px", u.size, "aspect", round(u.width / u.height, 4))
# remove what is left of the wider AI pouch on the right (it is now uncovered): rough fill, the harmonize pass redraws it
lum0 = Bn.mean(axis=2); ys0 = np.arange(Hh)[:, None]; xs0 = np.arange(Ww)[None, :]
rem = np.zeros((Hh, Ww), np.uint8)
rem[735:1250, XM + PW - 8:1240] = 1                                   # everything right of the new pouch edge, down to the lid
im_ = Image.new('L', (Ww, Hh), 0); ImageDraw.Draw(im_).polygon([(978, 885), (1040, 885), (1030, 1105), (968, 1105)], fill=255)
rem[np.asarray(im_) > 0] = 0                                           # keep the straw
keep_hi = (lum0 > 150) & (Bn[..., 0] - Bn[..., 2] > 12) & (xs0 > 1195)  # keep the bag rim / mesh at the far right
rem[keep_hi] = 0
Bf = cv2.inpaint(np.clip(Bn, 0, 255).astype(np.uint8), rem * 255, 12, cv2.INPAINT_TELEA)
# plain black film below the real pouches, down to the yams (hides the AI print that would peek out)
Bf[1440:1560, XU + 8:XM + PW - 8] = (24, 25, 30)
B = Image.fromarray(Bf); 
cv = B.convert('RGBA'); cv.alpha_composite(m, (XM, TOP)); cv.alpha_composite(u, (XU, TOP))
C = np.asarray(cv.convert('RGB')).astype(np.float32)
lum = Bn.mean(axis=2); R, G, Bl = Bn[..., 0], Bn[..., 1], Bn[..., 2]; ys = np.arange(Hh)[:, None]; xs = np.arange(Ww)[None, :]
cream = (R - Bl > 22) & (lum > 120) & (xs < 330) & (ys > 1150)
low = (ys > 1445) & (lum > 62) & ~((Bl - R > 35) & (G > 100)) & ~((np.abs(R - Bl) < 16) & (lum > 110))
def poly(pts):
    im = Image.new('L', (Ww, Hh), 0); ImageDraw.Draw(im).polygon(pts, fill=255); return np.asarray(im) > 0
cup = poly([(812, 1232), (1212, 1232), (1212, 1290), (1190, 1300), (1150, 1900), (880, 1900), (838, 1300), (812, 1290)])
straw = poly([(986, 893), (1032, 893), (1022, 1100), (976, 1100)])
dome = poly([(815, 1250), (832, 1190), (870, 1135), (930, 1100), (1010, 1088), (1090, 1100), (1150, 1135), (1190, 1190), (1208, 1250)])
Bn = np.asarray(B).astype(np.float32)   # B now = inpainted version
fg = cream | low | cup | straw
fg = cv2.morphologyEx(fg.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)).astype(np.float32)
a = cv2.GaussianBlur(fg, (0, 0), 1.0)[..., None]
Borig = np.asarray(Image.open('V2_B.png').convert('RGB')).astype(np.float32)
out = C * (1 - a) + Borig * a
# dome: add only its bright reflections over what is now behind it
hl = np.clip((Borig.mean(axis=2) - 150) / 60.0, 0, 1) * dome * (np.abs(Borig[..., 0] - Borig[..., 2]) < 26) * ~((xs > 1075) & (xs < 1170) & (ys < 1245))
hl = cv2.GaussianBlur(hl.astype(np.float32), (0, 0), 1.2)[..., None] * 0.8
out = out * (1 - hl) + 255 * hl
# through the dome, right of the new pouch edge, nothing dark should remain

Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save('guide2.png')
json.dump(dict(PW=PW, PH=u.height, TOP=TOP, XU=XU, XM=XM), open('guide2.json', 'w'))
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).crop((100, 620, 1320, 1700)).resize((915, 810)).save('guide2_t.jpg', quality=90)
