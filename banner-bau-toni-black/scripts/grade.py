"""Match skin tone + overall grade of a target photo to a reference photo (both with rembg cutouts).
Reinhard colour transfer in Lab on skin pixels, then a global contrast/saturation/cool-highlight grade."""
import numpy as np
from PIL import Image, ImageFilter
def srgb_to_lab(rgb):
    c=rgb/255.0; c=np.where(c<=0.04045,c/12.92,((c+0.055)/1.055)**2.4)
    M=np.array([[0.4124564,0.3575761,0.1804375],[0.2126729,0.7151522,0.0721750],[0.0193339,0.1191920,0.9503041]])
    xyz=c@M.T; xyz=xyz/np.array([0.95047,1.0,1.08883])
    f=np.where(xyz>0.008856,np.cbrt(xyz),7.787*xyz+16/116)
    L=116*f[...,1]-16; a=500*(f[...,0]-f[...,1]); b=200*(f[...,1]-f[...,2]); return np.stack([L,a,b],-1)
def lab_to_srgb(lab):
    L,a,b=lab[...,0],lab[...,1],lab[...,2]; fy=(L+16)/116; fx=fy+a/500; fz=fy-b/200
    def finv(t): return np.where(t**3>0.008856,t**3,(t-16/116)/7.787)
    xyz=np.stack([finv(fx),finv(fy),finv(fz)],-1)*np.array([0.95047,1.0,1.08883])
    M=np.array([[3.2404542,-1.5371385,-0.4985314],[-0.9692660,1.8760108,0.0415560],[0.0556434,-0.2040259,1.0572252]])
    c=xyz@M.T; c=np.clip(c,0,1); c=np.where(c<=0.0031308,12.92*c,1.055*c**(1/2.4)-0.055); return np.clip(c*255,0,255)
def skin_mask(lab,alpha):
    L,a,b=lab[...,0],lab[...,1],lab[...,2]
    return (alpha>0.5)&(L>18)&(L<88)&(a>4)&(b>8)
def grade(target_png,target_cutout,ref_png,ref_cutout,out_png,out_cutout,strength=1.0):
    t=np.asarray(Image.open(target_png).convert("RGB"),dtype=np.float64); ta=np.asarray(Image.open(target_cutout).convert("RGBA"))[...,3]/255.0
    r=np.asarray(Image.open(ref_png).convert("RGB"),dtype=np.float64); ra=np.asarray(Image.open(ref_cutout).convert("RGBA"))[...,3]/255.0
    tl=srgb_to_lab(t); rl=srgb_to_lab(r)
    tm=skin_mask(tl,ta); rm=skin_mask(rl,ra)
    ms,ss=tl[tm].mean(0),tl[tm].std(0); mr,sr=rl[rm].mean(0),rl[rm].std(0)
    print("target skin mean/std",ms.round(1),ss.round(1)); print("ref    skin mean/std",mr.round(1),sr.round(1))
    xfer=(tl-ms)*(sr/ss)+mr
    xfer=tl+(xfer-tl)*strength
    # feathered skin mask so the transfer fades at edges
    m=Image.fromarray((tm*255).astype("uint8")).filter(ImageFilter.GaussianBlur(6)); m=np.asarray(m)/255.0
    lab=tl*(1-m[...,None])+xfer*m[...,None]
    # global grade (whole frame): mild S-curve on L, -12% chroma, cool highlights
    L=lab[...,0]/100.0; L=np.clip(L,0,1); Lc=0.5+ (L-0.5)*1.10; Lc=np.clip(Lc-0.02,0,1)
    lab[...,0]=Lc*100
    lab[...,1:]*=0.88
    hi=np.clip((Lc-0.6)/0.4,0,1); lab[...,2]-=3.0*hi   # cooler whites/highlights
    rgb=lab_to_srgb(lab).astype("uint8")
    Image.fromarray(rgb).save(out_png)
    cut=np.dstack([rgb,(ta*255).astype("uint8")]); Image.fromarray(cut,"RGBA").save(out_cutout); print("saved",out_png,out_cutout)
if __name__=="__main__":
    import sys
    grade(*sys.argv[1:7],strength=float(sys.argv[7]) if len(sys.argv)>7 else 1.0)
