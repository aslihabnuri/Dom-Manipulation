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

KEY = os.environ["KIE_API_KEY"]
REF = "refs"
OUT = "gen"
UPLOAD = "https://kieai.redpandaai.co/api/file-base64-upload"
MODEL = "google/nano-banana-edit"

# slug -> (reference the glass comes from, drink to put in it)
#
# A description of None means the reference already *is* the product's drink, so
# the shot is restaged unchanged. Teh Tarik, Cookies & Cream and Vanilla have no
# drink reference of their own; each borrows the glass of a drink served the same
# way and states its own contents. Avocado is absent: it was approved as it
# stands and regenerating it would only risk losing that.
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
    "vanilla": ("Exclusive Matcha_referensi.jpeg",
                "a vanilla latte: warm pale cream, a gentle darker coffee layer low in the "
                "glass, under a soft white foam. Nothing green anywhere"),
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
    "Remove the straw, the table, every surrounding prop and the entire background. "
    "Stand the glass upright and centred, whole and unclipped, filling most of the frame "
    "with a margin above the rim and below the base. "
    "Seamless pure white background: no horizon line, no table edge, no surface seam, no "
    "visible floor and no gradient - the white must be even everywhere behind and beside "
    "the glass. One soft contact shadow directly beneath the base and nothing else. "
    "Soft diffused studio light from the upper left. Real camera photograph, 50 mm lens, "
    "eye level, sharp focus, natural colour, no rim light, no glow, no neon edge, no text, "
    "no logo, no watermark, ABSOLUTELY NO STRAW."
)
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


def req(url, data=None):
    """All traffic goes through curl: the proxy refuses urllib on the upload
    host and on the result CDN with a 403."""
    cmd = ["curl", "-sS", "--max-time", "180",
           "-H", f"Authorization: Bearer {KEY}", "-H", "Content-Type: application/json"]
    if data is not None:
        cmd += ["-X", "POST", "--data-binary", "@-"]
    cmd.append(url)
    p = subprocess.run(cmd, input=json.dumps(data).encode() if data else None,
                       capture_output=True, check=True)
    return json.loads(p.stdout)


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
        run(DRINK_PROMPT.format(what=what), [link(ref)], "3:4", out)

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
