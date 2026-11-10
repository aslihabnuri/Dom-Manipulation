import sys, numpy as np
from PIL import Image
a=np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(float)
ink=(a[...,0]<80)&(a[...,2]<130)&(a[...,1]<60)
r=np.where(ink[110:400, 420:640].sum(axis=1)>8)[0]      # the "5"
r4=np.where(ink[110:400, 220:420].sum(axis=1)>8)[0]     # the "4"
top=min(r.min(),r4.min())+110; bot=max(r.max(),r4.max())+110
print("digits y", top, "-", bot, "h", bot-top+1, "=", round(100*(bot-top+1)/1080,2), "% of width (ref 21.94%)")
