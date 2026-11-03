"""Rebuild the Three Cuts photo on a light set: wall and floor in the measured colours of the
Category banner cyclorama, the garments from the rembg cutout, and the original floor shadows kept
as a softened multiply so each garment still casts the same shadow."""
import sys, numpy as np
from PIL import Image, ImageFilter
WALL=np.array([200,202,210.]); FLOOR=np.array([229,229,239.]); GLOW=8.0
def build(photo,cutout,out,shadow_strength=0.55):
    p=Image.open(photo).convert("RGB"); W,H=p.size; L=np.asarray(p.convert("L")).astype(float)
    a=np.asarray(Image.open(cutout).convert("RGBA").split()[3])>128
    # tight matte: threshold, choke 2 px, 1 px feather, so no dark halo of the old set survives on the light wall
    from scipy.ndimage import binary_erosion
    a=binary_erosion(a,iterations=2); a=np.asarray(Image.fromarray((a*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))).astype(float)/255
    # wall-to-floor transition taken from the original row profile at the left edge (no garments there)
    rm=np.convolve(L[:,:200].mean(1),np.ones(31)/31,mode="same"); lo=rm[1300:1560].mean(); hi=rm[1760:1900].mean()
    t=np.clip((rm-lo)/(hi-lo),0,1); t[:1560]=0; t[1900:]=1
    bg=WALL[None,:]*(1-t[:,None])+FLOOR[None,:]*t[:,None]; bg=np.repeat(bg[:,None,:],W,1)
    # soft centre glow on the wall, as on the Category wall (centre a few levels lighter than the corners)
    yy,xx=np.mgrid[0:H,0:W]; r=np.sqrt(((xx-W/2)/(W*0.6))**2+((yy-H*0.45)/(H*0.6))**2); bg+=GLOW*np.clip(1-r,0,1)[...,None]*(1-t)[:,None,None]
    # floor shadows: darkness of each floor pixel relative to its own row, softened
    # baseline = local bright envelope of the floor (max over 700 px, then smoothed), so the old set's
    # left-to-right light falloff and edge vignette are not mistaken for shadow; only garment shadows remain
    from scipy.ndimage import maximum_filter, gaussian_filter
    base=gaussian_filter(maximum_filter(L,size=(1,701),mode="nearest"),(8,120)); ratio=np.clip(L/np.maximum(base,1),0.2,1.0); ratio=1-(1-ratio)*shadow_strength
    w=np.clip((t-0.4)/0.3,0,1)[:,None]; sh=1-(1-ratio)*w   # shadows only on the floor proper, faded in above it; sh=np.asarray(Image.fromarray((sh*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))).astype(float)/255
    bg*=sh[...,None]
    g=np.asarray(p).astype(float); out_a=g*a[...,None]+bg*(1-a[...,None])
    Image.fromarray(np.clip(out_a,0,255).astype(np.uint8)).save(out,quality=95); print(out,"floor rows",lo.round(1),hi.round(1))
if __name__=="__main__": build(*sys.argv[1:4])
