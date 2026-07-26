"""Generate the drink and prop shots for the remaining eleven products.

Generation costs credits, so nothing here re-runs work that already succeeded:
every job checks for its output file first and skips if it is present. A failed
job leaves no file and is simply retried on the next run.
"""

import base64, json, os, subprocess, sys, time

KEY = os.environ["KIE_API_KEY"]
REF = "refs"
OUT = "gen"
UPLOAD = "https://kieai.redpandaai.co/api/file-base64-upload"
MODEL = "google/nano-banana-edit"

GLASS = "Referensi_Gelas.jpeg"

# product -> (drink reference, drink description, prop reference, prop description)
# Frappe Base is drink-only. Milk Tea and Teh Tarik use black tea as their prop.
JOBS = {
    "matchalatte": ("Matcha_Referensi.jpg", "an iced matcha latte, milk swirling through vivid green matcha",
                    "Matcha Powder_Referensi.jpeg", "a bowl of vivid green matcha powder with fresh tea leaves"),
    "premixmatcha": ("Matcha_Referensi.jpg", "pure matcha, deep even green with a fine foam on top",
                     "Matcha Powder_Referensi.jpeg", "a bowl of vivid green matcha powder with fresh tea leaves"),
    "tehtarik": (None, "teh tarik, creamy tan pulled milk tea with a thick foam head",
                 "Black tea_referensi.jpeg", "a single small white bowl heaped with loose black tea leaves, nothing spilled or scattered outside the bowl"),
    "chocolate": ("Chocolate_referensi.jpg", "a thick chocolate shake, deep cocoa brown, dusted with grated chocolate",
                  "Chocolate_referensi.jpeg", "stacked squares and chunks of dark chocolate"),
    "cookiescream": (None, "a cookies and cream milkshake, creamy off-white with dark cookie crumbs through it",
                     "cookies and cream_referensi.jpeg", "chocolate sandwich cookies with cream filling, one broken open"),
    "charcoal": ("Charcoal_referensi.jpg", "a charcoal drink, deep black graduating into milk, fresh and clean",
                 "Charcoal_Aestetic.jpeg", "a pile of black charcoal chunks"),
    "vanilla": (None, "a vanilla latte, pale cream, smooth with a fine foam",
                "Referensi Vanilla.jpeg", "vanilla pods with pale vanilla orchid flowers"),
    "milktea": ("Milk Tea_referensi.jpg", "milk tea, even caramel brown, creamy",
                "Black tea_referensi.jpeg", "a single small white bowl heaped with loose black tea leaves, nothing spilled or scattered outside the bowl"),
    "lemontea": ("Lemon tea_referensi.jpg", "iced lemon tea, golden amber with ice and lemon slices",
                 "lemon_referensi.jpeg", "whole lemons and one cut half, with leaves"),
    "frappebase": ("Frappe Base_referensi.jpg", "a blended frappe, pale cream, topped with thick whipped cream and a caramel drizzle",
                   None, None),
    "lemongrass": ("Lemon grass_referensi.jpg", "a lemongrass cooler, clear golden green with ice",
                   "Lemon Grass_referensi.jpeg", "a tied bundle of fresh lemongrass stalks"),
}

GLASS_PROMPT = (
    "Fill this glass with {desc}. Use the FIRST image for the glass: keep its exact "
    "shape, proportions and camera angle. {ref}The drink is thick and appetising with real "
    "texture, not a flat translucent liquid. The glass stands upright and fills most of the "
    "frame. Pure white seamless background, soft studio light from upper left, soft contact "
    "shadow at the base, product photography, eye level, sharp focus, no text, no logo, "
    "ABSOLUTELY NO STRAW."
)
PROP_PROMPT = (
    "Restage this as a calm studio product shot: {desc}, arranged as one compact group "
    "resting on a flat surface. Keep the shape, texture and colour true to the reference. "
    "Natural matte colour, no rim light, no glowing outline, no neon or oversaturated edge, "
    "no harsh specular highlight. Pure white seamless background, soft diffused studio light "
    "from upper left, soft contact shadow beneath, product photography, eye level, sharp "
    "focus, no text, no logo, no props."
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


def upload(name):
    b64 = base64.b64encode(open(os.path.join(REF, name), "rb").read()).decode()
    mime = "image/png" if name.lower().endswith(".png") else "image/jpeg"
    r = req(UPLOAD, {"base64Data": f"data:{mime};base64,{b64}",
                     "uploadPath": "nomukita", "fileName": name.replace(" ", "_")})
    return r["data"]["downloadUrl"]


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
                print(f"  ok {out} ({d.get('creditsConsumed')} credits)")
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

    glass_url = link(GLASS)
    for slug, (dref, ddesc, pref, pdesc) in JOBS.items():
        if only and slug not in only:
            continue
        print(slug)
        gout = f"{OUT}/glass-{slug}.png"
        if not os.path.exists(gout):
            urls = [glass_url] + ([link(dref)] if dref else [])
            hint = ("Use the SECOND image only for how the drink itself looks and feels. "
                    if dref else "")
            run(GLASS_PROMPT.format(desc=ddesc, ref=hint), urls, "3:4", gout)
        if pref:
            pout = f"{OUT}/prop-{slug}.png"
            if not os.path.exists(pout):
                run(PROP_PROMPT.format(desc=pdesc), [link(pref)], "4:3", pout)


if __name__ == "__main__":
    main(sys.argv[1:] or None)
