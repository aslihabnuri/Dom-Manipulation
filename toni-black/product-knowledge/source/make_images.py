import shapes as S
J=[
 ("cover",   "home",    "notch", 6.45, 5.92, 0.34, dict(notch=0.58, corner="tr")),
 ("brand",   "morning", "asym",  3.38, 2.35, 0.55, {}),
 ("impact",  "locker",  "soft",  3.8044, 2.55, 0.20, {}),
 ("modal",   "pause",   "arch",  2.75, 4.30, 0.26, {}),
 ("built1",  "desk",    "soft",  3.30, 1.50, 0.20, {}),
 ("built2",  "locker",  "soft",  3.30, 1.50, 0.20, {}),
 ("built3",  "weekend", "soft",  3.30, 1.50, 0.20, {}),
 ("fitlab",  "morning", "asym",  5.05, 3.30, 0.62, {}),
 ("band",    "home",    "arch",  2.90, 4.45, 0.28, {}),
 ("allday",  "weekend", "notch",11.9333,3.05, 0.34, dict(notch=0.56, corner="tr")),
 ("markets", "desk",    "soft",  3.30, 2.30, 0.24, {}),
 ("kids",    "weekend", "asym",  3.30, 2.30, 0.55, {}),
 ("care1",   "pause",   "soft",  2.55, 1.55, 0.20, {}),
 ("care2",   "locker",  "soft",  2.55, 1.55, 0.20, {}),
]
for n,p,sh,w,h,r,kw in J: S.make(n,p,sh,w,h,r,**kw)
