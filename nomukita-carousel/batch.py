"""Generate the drink and prop shots for the 1000 gram slides.

Generation costs credits, so nothing here re-runs work that already succeeded:
every job checks for its output file first and skips if it is present. A failed
job leaves no file and is simply retried on the next run.

Each drink is restaged from its own reference, so it keeps that reference's
glass. An earlier pass poured all twelve drinks into one shared reference glass
for the sake of a consistent carousel; the drinks came out looking nothing like
what the customer had picked, so the glass now follows the drink.
"""

import base64, json, os, subprocess, sys, time

import photo
import s5_menu

KEY = os.environ["KIE_API_KEY"]
REF = "refs"
OUT = "gen"
UPLOAD = "https://kieai.redpandaai.co/api/file-base64-upload"
MODEL = "google/nano-banana-edit"

# slug -> (reference the glass comes from, drink to put in it)
#
# A description of None means the reference already *is* the product's drink, so
# the shot is restaged unchanged. Teh Tarik and Cookies & Cream have no drink
# reference of their own; each borrows the glass of a drink served the same way
# and states its own contents. Avocado is absent: it was approved as it stands
# and regenerating it would only risk losing that.
DRINKS = {
    "matchalatte": ("Matcha_Referensi.jpg", None),
    "premixmatcha": ("Exclusive Matcha_referensi.jpeg", None),
    "tehtarik": ("Milk Tea_referensi.jpg",
                 "teh tarik: hot pulled milk tea, even warm tan brown all the way down, "
                 "under a thick creamy foam head. No boba, no pearls, no ice, no syrup layers"),
    "chocolate": ("Chocolate_referensi.jpg", None),
    "cookiescream": ("Chocolate_referensi.jpg",
                     "a cookies and cream milkshake: thick creamy off-white, dark chocolate "
                     "cookie crumbs suspended through it and scattered over the top"),
    "charcoal": ("Charcoal_referensi.jpg", None),
    "vanilla": ("Vanilla_referensi.jpg", None),
    "milktea": ("Milk Tea_referensi.jpg", None),
    "lemontea": ("Lemon tea_referensi.jpg", None),
    "frappebase": ("Frappe Base_referensi.jpg", None),
    "lemongrass": ("Lemon grass_referensi.jpg", None),
}

# slug -> (reference, what to build from it). Shared props are generated once.
PROPS = {
    "cookiescream": ("Cookies & Cream_referensi.webp",
                     "exactly two round chocolate sandwich biscuits with a white cream "
                     "filling, one lying flat and the second leaning against it, arranged "
                     "the same way as the reference. Plain embossed pattern on the biscuit, "
                     "no brand name and no lettering of any kind"),
    # Sent through strip_watermark first - see there for why.
    "blacktea": ("Black tea_refrensi.jpg",
                 "a low loose heap of dried curled tea leaves with one small fresh green tea "
                 "sprig resting on top, arranged and coloured the same way as the reference. "
                 "No bowl, no dish, no container, nothing scattered away from the heap"),
}

# The two products whose prop is the shared black tea heap.
SHARED = {"tehtarik": "blacktea", "milktea": "blacktea"}

# References that arrive as watermarked stock comps, and where the clean copy goes.
WATERMARKED = {"blacktea": "Black tea_clean.png"}

DRINK_PROMPT = (
    "Restage this photograph as a clean studio product shot of the drink on its own. "
    "{what} "
    "The glass must read as glass: a visible rim, visible wall thickness down both sides, "
    "clean specular highlights along the glass, and a solid foot with its own thickness "
    "showing. The drink is inside a glass, not a moulded block. "
    "Remove the straw, the table, every surrounding prop and the entire background. "
    "Stand the glass upright and centred, whole and unclipped, filling most of the frame "
    "with a margin above the rim and below the base. "
    "{sweep} {glass} No horizon line, no table edge, no surface seam, no visible floor and no "
    "gradient - the backdrop must be even everywhere behind and beside the glass. One soft "
    "contact shadow directly beneath the base and nothing else. "
    "Soft diffused studio light from the upper left. Real camera photograph, 50 mm lens, "
    "eye level, sharp focus, natural colour, no rim light, no glow, no neon edge, no text, "
    "no logo, no watermark, ABSOLUTELY NO STRAW."
)
WHITE_SWEEP = "Seamless pure white background."

# A pale drink in a clear glass has nothing to separate against on white, and the
# first vanilla attempt came back with the glass swallowed whole - it read as a
# moulded block of ice cream with no rim, no walls and no foot. The customer's own
# reference photograph solves that with a mid grey backdrop.
#
# Copying that does not work here. The layer is developed against bone white by
# multiplying the ratio of the photo to its own backdrop, so a subject brighter
# than the sweep it was shot on runs past 255 and clips. On a 193 grey the shake
# measured a ratio of 1.20 against a ceiling of 1.058, and 54,489 pixels blew out;
# on white it peaked at 1.006 and none did.
#
# So the sweep stays white and the glass is made to read the way a photographer
# would do it on white - by lighting the glass rather than darkening the room.
GLASSWARE = (
    "This is a pale drink in clear glass on a white background, the hardest thing there is to "
    "keep legible, so light it the way a specialist would: dark-field lighting that lays a "
    "soft dark refraction line down each wall of the glass, a clearly defined rim, and a heavy "
    "base whose glass thickness reads darker than the drink above it. The glass must be "
    "unmistakably a glass and never brighter than the background."
)
GLASS_NOTE = {"vanilla": GLASSWARE}
KEEP_GLASS_AND_DRINK = (
    "Keep the same glass - identical shape, proportions, wall thickness and foot - and the "
    "same drink inside it, with the same colours, layers, foam and garnish."
)
KEEP_GLASS_ONLY = (
    "Keep the same glass - identical shape, proportions, wall thickness and foot - but fill "
    "it with {desc}. Keep the drink appetising and thick with real texture."
)
PROP_PROMPT = (
    "Restage this as a calm studio product shot: {desc}. Keep the arrangement, the scale "
    "relationship and the texture true to the reference. "
    "Natural matte colour, no rim light, no glowing outline, no neon or oversaturated edge, "
    "no harsh specular highlight. Seamless pure white background with no horizon line and no "
    "table edge, soft diffused studio light from the upper left, one soft contact shadow "
    "directly beneath. Real camera photograph, eye level, sharp focus, no text, no lettering, "
    "no brand name, no logo, no watermark, no other props."
)


# ── Slide 5: serving suggestions ─────────────────────────────────────────────
#
# Wadahnya dipotong langsung dari Uji_S5 yang sudah disetujui, jadi kedua belas
# slide S5 memakai bahasa wadah yang sama persis dengan acuannya - mug batu untuk
# yang panas, gelas tinggi untuk dua sisanya.
#
# Latarnya diputihkan dulu sebelum dikirim. Potongannya membawa latar bone white
# ber-vignette milik slide asalnya, dan modelnya meniru latar itu alih-alih
# menuruti perintah "pure white" - hasilnya sweep hangat bergradien, tepi frame
# 238 dengan sebaran 37, bukan 254 dengan sebaran 2 seperti frame yang berhasil.
# Di atas sweep seperti itu estimasi latarnya meleset, `ink` menyala di 60% frame,
# dan siluetnya menelan seluruh gambar sehingga persegi lapisannya ikut tercetak.
#
# Daftar minumannya tidak ditulis ulang di sini. Menunya sudah ada di `s5_menu`,
# dan menyalinnya ke berkas kedua berarti gambar yang digenerate bisa perlahan
# melenceng dari keterangan yang tercetak di sebelahnya - persis kesalahan yang
# baru ketahuan setelah kreditnya terlanjur habis.
VESSEL_REF = {"mug": "S5_mug_white.png", "tall": "S5_glass_white.png",
              "short": "S5_glass_white.png"}
# Label posisi kolom, bukan suhu minumannya: Avocado dan Frappe Base tidak punya
# sajian panas sama sekali, jadi kreasi pertamanya tetap bernama "-hot" walaupun
# isinya dingin. Yang menentukan wadah dan isinya adalah menunya, bukan namanya.
TAGS = ("hot", "iced", "float")

S5 = {s5_menu.KEY[slug]: [(TAGS[i], VESSEL_REF[vessel], desc)
                          for i, (_nm, vessel, _lines, desc) in enumerate(creations)]
      for slug, (_sub, creations) in s5_menu.MENU.items()}

S5_PROMPT = (
    "Restage this as a clean studio product shot of a single drink. "
    "Keep the SAME vessel - identical shape, proportions, wall thickness, rim, foot and "
    "handle if it has one - and fill it with {desc}. "
    "The vessel must read clearly as what it is, with a visible rim and a solid base. "
    "Remove every surrounding prop and the entire background. Stand it upright and centred, "
    "whole and unclipped, filling most of the frame with a margin above and below. "
    "Seamless pure white background: no horizon line, no table edge, no surface seam, no "
    "visible floor and no gradient. One soft contact shadow directly beneath the base and "
    "nothing else. Soft diffused studio light from the upper left. Real camera photograph, "
    # Perintahnya sengaja dibiarkan seperti saat slide Matcha Latte disetujui.
    # Versi yang lebih keras - menyebut satu per satu "no beige patch, panel, mat,
    # pool or halo" - sudah dicoba dengan biaya 4 kredit dan lempeng hangat di
    # bawah gelasnya tetap muncul, hanya bentuk minumannya yang berubah. Menukar
    # perintah yang sudah disetujui dengan perintah lain yang cacatnya sama
    # persis tidak menghasilkan apa pun selain sebelas slide yang gayanya
    # sedikit berbeda dari slide yang sudah dilihat pelanggan. `verify.flare`
    # yang mencatat lempeng itu, supaya keputusannya ada pada pelanggan.
    "50 mm lens, eye level, sharp focus, natural colour, no rim light, no glow, no neon "
    "edge, no text, no logo, no watermark, ABSOLUTELY NO STRAW."
)


def serving(only=None):
    """Generate tiga penyajian untuk tiap produk di S5."""
    os.makedirs(OUT, exist_ok=True)
    cache = {}

    def link(name):
        if name not in cache:
            cache[name] = upload(name)
        return cache[name]

    for slug, items in S5.items():
        if only and slug not in only:
            continue
        for tag, vessel, desc in items:
            out = f"{OUT}/s5-{slug}-{tag}.png"
            if os.path.exists(out):
                continue
            print(f"{slug} {tag}", flush=True)
            run(S5_PROMPT.format(desc=desc), [link(vessel)], "3:4", out)
    if SPENT:
        print(f"\n{len(SPENT)} images, {sum(SPENT)} credits this run")


def req(url, data=None, tries=5):
    """All traffic goes through curl: the proxy refuses urllib on the upload
    host and on the result CDN with a 403.

    Retried, because a dropped connection here used to end the whole run. A
    thirty-image batch takes the better part of an hour, the container was
    restarted in the middle of one, and the very next poll came back with curl
    exit 7 - which raised, unwound out of `serving()`, and left sixteen images
    ungenerated. The paid work was safe (every finished image is on disk and
    skipped on the next run), but the batch still had to be noticed and started
    again by hand. A poll that fails is worth waiting out, not dying on.
    """
    cmd = ["curl", "-sS", "--max-time", "180",
           "-H", f"Authorization: Bearer {KEY}", "-H", "Content-Type: application/json"]
    if data is not None:
        cmd += ["-X", "POST", "--data-binary", "@-"]
    cmd.append(url)
    body = json.dumps(data).encode() if data else None
    for attempt in range(tries):
        p = subprocess.run(cmd, input=body, capture_output=True)
        if p.returncode == 0:
            try:
                return json.loads(p.stdout)
            except json.JSONDecodeError:
                pass
        if attempt == tries - 1:
            raise RuntimeError(f"{url} failed {tries} times: "
                               f"exit {p.returncode} {p.stderr[:200]!r}")
        time.sleep(2 ** attempt)


def whiten(src, dst):
    """Lift a reference's background to pure white, keeping everything else.

    The S5 vessels are cut from an approved slide, so they arrive on that slide's
    warm, vignetted bone white - and the model copies the background it is shown
    rather than the one the prompt asks for. On a sweep like that the backdrop
    estimate misses, `ink` fires across sixty per cent of the frame, the
    silhouette swallows the picture and the layer prints its whole rectangle.

    Done by dividing out the estimated sweep, NOT by masking the subject and
    flooding the rest. Masking looks simpler and is wrong here: the mug's handle
    is pale cream against pale bone and measures (241, 240, 235) - the background
    value exactly - so no threshold separates them. The first attempt erased the
    handle, and the model duly produced a mug without one.
    """
    import numpy as np
    from PIL import Image
    img, bg = photo._backdrop(os.path.join(REF, src))
    out = np.clip(img / np.maximum(bg, 1) * 255.0, 0, 255)
    Image.fromarray(np.rint(out).astype(np.uint8)).save(os.path.join(REF, dst))
    return dst


def strip_watermark(src, dst, margin=60, light=225, sat=28):
    """Rub the stock-library watermark off a reference before sending it.

    The black tea reference is a watermarked comp - tiled lettering across the
    picture and a strip of characters down the left edge. Asking the model to
    leave it out does not work: told twice, it copied the watermark back letter
    for letter, including the strip. It has to go before the upload.

    The subject is one heap in the middle of bare paper, so cropping the left
    margin off and flattening everything that is not the heap to white clears the
    lettering completely.

    The comp is licensed to whoever downloaded it and not to us. Buy the licence
    before this goes to print, the same as for the All Round Gothic demo font.
    """
    import numpy as np
    from PIL import Image
    from scipy import ndimage as ndi
    a = np.array(Image.open(os.path.join(REF, src)).convert("RGB")).astype(int)[:, margin:]
    subject = (a.mean(2) < light) | (a.max(2) - a.min(2) > sat)
    subject = ndi.binary_fill_holes(ndi.binary_closing(subject, np.ones((7, 7))))
    lab, n = ndi.label(subject, structure=np.ones((3, 3)))
    if n:
        subject = lab == int(np.argmax(ndi.sum(subject, lab, range(1, n + 1)))) + 1
    subject = ndi.binary_dilation(subject, np.ones((3, 3)), iterations=3)
    a[~subject] = 255
    Image.fromarray(a.astype(np.uint8)).save(os.path.join(REF, dst))
    return dst


def upload(name):
    b64 = base64.b64encode(open(os.path.join(REF, name), "rb").read()).decode()
    ext = name.lower().rsplit(".", 1)[-1]
    mime = {"png": "image/png", "webp": "image/webp"}.get(ext, "image/jpeg")
    r = req(UPLOAD, {"base64Data": f"data:{mime};base64,{b64}",
                     "uploadPath": "nomukita", "fileName": name.replace(" ", "_")})
    return r["data"]["downloadUrl"]


SPENT = []


def run(prompt, urls, size, out, tries=2):
    if os.path.exists(out):                     # never pay twice for the same file
        return out
    for attempt in range(tries):
        t = req("https://api.kie.ai/api/v1/jobs/createTask",
                {"model": MODEL, "input": {"prompt": prompt, "image_urls": urls,
                                           "output_format": "png", "image_size": size}})
        if t.get("code") != 200:
            print("  create failed:", t.get("msg")); continue
        tid = t["data"]["taskId"]
        start = time.time()
        while time.time() - start < 300:
            time.sleep(7)
            d = req(f"https://api.kie.ai/api/v1/jobs/recordInfo?taskId={tid}")["data"]
            if d["state"] == "success":
                url = json.loads(d["resultJson"])["resultUrls"][0]
                # urllib is refused by the proxy on this CDN, curl is not
                subprocess.run(["curl", "-sSL", "--max-time", "180", "-o", out, url], check=True)
                credits = d.get("creditsConsumed")
                SPENT.append(credits or 0)
                print(f"  ok {out} ({credits} credits)", flush=True)
                return out
            if d["state"] in ("fail", "failed", "error"):
                print("  job failed:", d.get("failMsg")); break
    print("  GIVING UP on", out)
    return None


def main(only=None):
    os.makedirs(OUT, exist_ok=True)
    cache = {}

    def link(name):
        if name not in cache:
            cache[name] = upload(name)
        return cache[name]

    for slug, (ref, desc) in DRINKS.items():
        if only and slug not in only:
            continue
        out = f"{OUT}/glass-{slug}.png"
        if os.path.exists(out):
            continue
        print(slug, flush=True)
        what = KEEP_GLASS_AND_DRINK if desc is None else KEEP_GLASS_ONLY.format(desc=desc)
        prompt = DRINK_PROMPT.format(what=what, sweep=WHITE_SWEEP,
                                     glass=GLASS_NOTE.get(slug, ""))
        run(prompt, [link(ref)], "3:4", out)

    for name, (ref, desc) in PROPS.items():
        if only and name not in only:
            continue
        out = f"{OUT}/prop-{name}.png"
        if os.path.exists(out):
            continue
        print("prop", name, flush=True)
        if name in WATERMARKED:
            ref = strip_watermark(ref, WATERMARKED[name])
        run(PROP_PROMPT.format(desc=desc), [link(ref)], "4:3", out)

    if SPENT:
        print(f"\n{len(SPENT)} images, {sum(SPENT)} credits this run")


if __name__ == "__main__":
    main(sys.argv[1:] or None)
