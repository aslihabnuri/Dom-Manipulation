import plates as PL

# Every slide is one photograph, type laid straight onto it. The scrim that makes
# the type readable is burned into the pixels here, per slide, on the side the
# type actually occupies — so no panel or box is ever needed on top.
EDGE=[("top",0.92,0.26),("bottom",0.93,0.26)]     # number and footer strips
def R(s=0.94,r=1.15): return [("right",s,r)]      # type on the right
def L(s=0.94,r=1.15): return [("left",s,r)]       # type on the left
def B(s=0.90,r=0.62): return [("bottom",s,r)]     # type across the base

FULL=(13.3333,7.50)
F=[
 ("s01_cover",    "commute",   *FULL, L(0.80,0.85)+B(0.86,0.55)),
 ("s02_intro",    "creator",   *FULL, R(0.95,1.30)),
 ("s03_customer", "desk",      *FULL, R(0.95,1.25)),
 ("s04_problem",  "heat",      *FULL, R(0.97,1.85)),
 ("s05_product",  "fabric",    *FULL, R(0.94,1.20)),
 ("s06_benefits", "stretch",   *FULL, B(0.93,0.55)+[("top",0.94,0.46)]),
 ("s07_object",   "locker",    *FULL, B(0.93,0.66)+[("top",0.94,0.46)]),
 ("s09_hooks",    "home",      *FULL, R(0.95,1.30)),
 ("s11_proof",    "pause",     *FULL, L(0.96,1.45)),
 ("s12_cta",      "morning",   *FULL, R(0.97,1.70)),
 ("s13_deliver",  "fold",      *FULL, L(0.95,1.35)),
 ("s14_closing",  "weekend",   *FULL, B(0.90,0.80)),
]
# mosaic tiles: full height, edge to edge, captions burned dark at the base
TILE3=(4.3911,7.50); TILE5=(2.6187,7.50)
for i,src in enumerate(["waistband2","fabric","stretch"],1):
    F.append((f"s08_t{i}", src, *TILE3, [("bottom",0.95,0.42),("top",0.95,0.48)]))
for i,src in enumerate(["waistband2","locker","fabric","commute","drawer"],1):
    F.append((f"s10_t{i}", src, *TILE5, [("bottom",0.96,0.48),("top",0.95,0.48)]))

for n,src,w,h,sc in F:
    PL.frame(n,src,w,h,sc+EDGE)
    print(f"  {n:14s} <- {src:11s} {w:7.3f} x {h:.2f}")
print(f"\n{len(F)} frames — every slide is a photograph")
