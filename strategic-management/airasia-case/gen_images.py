import json, os, sys, time, urllib.request, subprocess

KEY = os.environ["KIE_KEY"]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "img")
os.makedirs(OUT, exist_ok=True)

STYLE = ("Renaissance oil painting collage in the manner of an aged fresco, warm sepia and ochre palette "
         "with deep crimson and gold accents, dramatic chiaroscuro lighting, visible canvas and aged paper texture, "
         "a few torn paper fragments at the edges, cinematic editorial composition, wide 16:9. "
         "No text, no letters, no words, no logos, no watermark. ")

PROMPTS = {
    "roadmap": "An antique navigator's desk seen from above with a brass compass, a sextant, rolled parchment maps of Southeast Asia and a small red model airliner. Subject concentrated in the right half, left half plain dark wood.",
    "glance": "A row of red and white narrow body airliners parked on a tarmac at dawn, the row growing longer toward the horizon, Kuala Lumpur skyline faint in the background. Subject in the lower half, upper sky calm and simple.",
    "recognition": "A golden laurel wreath and a classical trophy on a marble pedestal beside a small red airliner model, painted angels in the sky above. Subject on the right third, left side calm and dark.",
    "problem": "A fork in the sky painted as a baroque allegory: one flight path curving over nearby tropical islands, another stretching far across an open ocean toward a distant continent, a red airliner at the fork. Subject centered, edges calm.",
    "question": "A single wide body airliner flying alone over an endless dusk ocean, tiny against a vast painted sky. Subject in the right half, left half plain sky.",
    "pestel1": "An allegorical mural of a colonial parliament building, a bustling Southeast Asian market with merchants and spices, and the Petronas twin towers, painted as a baroque fresco. Subject across the lower half, upper half calm.",
    "pestel2": "A Renaissance engineer at a workbench studying a mechanical astrolabe and airliner blueprints, a bronze scale of justice and an oil lamp beside him. Subject in the right half, left half calm and dark.",
    "fiveforces": "A fortified citadel on a hill pressed by five armies approaching from all directions, painted like a Renaissance battle mural. Citadel in the center, corners calm.",
    "driving": "Classical wind gods with puffed cheeks blowing strong winds across a harbor city, sailing ships and a modern red airliner pushed forward by the wind. Subject in the right half, left half calm sky.",
    "ksf": "A still life of an hourglass, a merchant's ledger, brass scales, stacked coins and a small red airliner model on a wooden table. Subject in the right half, left half dark plain background.",
    "groupmap": "An antique hand drawn map spanning from Kuala Lumpur across the Indian Ocean to London with dotted flight routes, a compass rose and small painted airliners. The whole image is the map, muted and low contrast so text can sit on top.",
    "benchmark": "Two airliners, one red and one blue, resting on the two pans of a giant brass balance scale floating in a painted sky. Subject in the right half, left half calm.",
    "sources": "A Leonardo da Vinci style workshop where craftsmen assemble a red airliner on wooden scaffolding, sketches and gears on the walls. Subject in the lower half, upper half calm.",
    "transfers": "Porters carrying crates, bundles and rolled maps from a small red aircraft into a much larger wide body aircraft inside a painted hangar. Subject in the right half, left half calm.",
    "nottransfer": "A small narrow body red airliner standing beside an enormous four engine wide body aircraft in a cathedral like hangar, strong scale contrast. Subject in the right half, left half calm.",
    "london": "A red wide body airliner descending over the painted skyline of London with the Thames and Big Ben at golden dusk. Subject in the right half, left half calm sky.",
    "reading": "A scholar examining an accounting ledger through a large magnifying glass by candlelight, stacks of papers and a quill. Subject in the right half, left half dark.",
    "issues": "Renaissance philosophers debating in a grand marble hall in the manner of the School of Athens, a red airliner model on a table between them. Subject in the lower half, upper half calm.",
    "altA": "A small red airliner flying low over emerald tropical islands and fishing villages of Southeast Asia, painted like a baroque landscape. Subject in the right half, left half calm.",
    "altB": "Two aircraft merging into one large aircraft above a grand hub airport whose runways radiate like the spokes of a wheel. Subject in the right half, left half calm.",
    "altC": "A stone bridge being built in stages across a gorge, scaffolding on the unfinished span, a red airliner crossing the finished part. Subject in the right half, left half calm.",
    "scorecard": "Three robed Renaissance judges at a long table weighing three sealed scrolls on brass scales. Subject in the lower half, upper half calm.",
    "recommendation": "A confident navigator at a ship's wheel pointing toward the horizon where a red airliner rises into dawn light. Subject in the right half, left half calm.",
    "implementation": "Master builders with blueprints and measuring tools directing the construction of a great clock tower with scaffolding and cranes. Subject in the right half, left half calm.",
    "lessons": "An open illuminated manuscript on a lectern in a vast old library, a small red airliner model resting on the pages. Subject in the right half, left half dark.",
    "discussion": "A council of merchants and scholars debating around a round table in a candlelit hall. Subject in the lower half, upper half calm.",
    "thanks": "A red airliner flying into a warm sunset above soft painted clouds, calm and quiet. Subject in the right half, left half calm.",
}


def api(path, body=None):
    req = urllib.request.Request("https://api.kie.ai/api/v1" + path,
                                 data=json.dumps(body).encode() if body else None,
                                 headers={"Authorization": "Bearer " + KEY, "Content-Type": "application/json"},
                                 method="POST" if body else "GET")
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def main():
    only = sys.argv[1:]  # optional subset of names to (re)generate
    names = only or [n for n in PROMPTS if not os.path.exists(os.path.join(OUT, n + ".png"))]
    tasks = {}
    for n in names:
        r = api("/jobs/createTask", {"model": "google/nano-banana",
                                     "input": {"prompt": STYLE + PROMPTS[n], "image_size": "16:9", "output_format": "png"}})
        tasks[n] = r["data"]["taskId"]
        print("submitted", n, tasks[n], flush=True)
        time.sleep(1.5)
    pending = dict(tasks)
    deadline = time.time() + 480
    while pending and time.time() < deadline:
        time.sleep(8)
        for n, tid in list(pending.items()):
            d = api("/jobs/recordInfo?taskId=" + tid)["data"]
            st = d.get("state")
            if st == "success":
                url = json.loads(d["resultJson"])["resultUrls"][0]
                subprocess.run(["curl","-sS","-m","120","-o",os.path.join(OUT, n + ".png"),url],check=True)
                print("done", n, d.get("creditsConsumed"), flush=True)
                del pending[n]
            elif st == "fail":
                print("FAILED", n, d.get("failMsg"), flush=True)
                del pending[n]
    if pending:
        print("TIMEOUT", list(pending))
    print("credits left:", api("/chat/credit")["data"])


if __name__ == "__main__":
    main()
