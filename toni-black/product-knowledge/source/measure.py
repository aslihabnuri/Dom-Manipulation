"""Pill and tag widths, measured from the real font rather than guessed.

Tag text reaches tag() through variables and data tables as well as literal
calls, so every short string literal in the builder is measured. String
literals are tokenised in full — matching only short ones lets a long literal's
closing quote pair with the next literal's opening quote, which silently
mis-measures everything downstream.
"""
import json, re, os
from PIL import ImageFont

SP=os.path.dirname(os.path.abspath(__file__))
BOLD=os.path.normpath(os.path.join(SP,"..","..","september-nine-to-nine",
                                  "source","fonts","ZalandoSansExpanded-700.ttf"))
def wid(t, pt, spc):
    f=ImageFont.truetype(BOLD, int(round(pt*8)))
    return (f.getlength(t)/8.0 + spc*len(t))/72.0            # inches

src=open(f"{SP}/build_pk.js", encoding="utf-8").read()
LIT=re.compile(r'"((?:[^"\\]|\\.)*)"')                        # a full JS string literal
lits={m.group(1) for m in LIT.finditer(src)}
out={"tag":{}, "pill":{}}
for t in lits:
    if 0 < len(t) <= 40 and t.strip():
        out["tag"][t]=round(wid(t, 8, 1.3)+0.30, 4)           # + horizontal padding
for n,name in set(re.findall(r'chrome\(s,\s*"([^"]+)",\s*"([^"]+)"', src)):
    out["pill"][f"{n}|{name}"]=round(wid(f"{n}   {name}", 9, 1.5)+0.42, 4)
json.dump(out, open(f"{SP}/widths.json","w"), indent=1)
print(f"measured {len(out['tag'])} literals, {len(out['pill'])} pills")
for k in ("FABRIC","CONSTRUCTION","MODALCLOUD™","FLOWLITE™","FIT LAB"):
    print(f"  {k:16s} {out['tag'].get(k)}")
