import json, os, sys, time, urllib.request
KEY=os.environ["KIE_KEY"]; OUT=sys.argv[1]
ALASKA="https://drive.google.com/uc?export=download&id=1BhZyVve9PRT-hx0i-CmMXCFw7zLmiS_Q"   # foto referensi Alaska (wordmark)
NIGHT="https://drive.google.com/uc?export=download&id=11jjnLe4lH1PayhRFeTIprOC0S2hu63zz"
GOLDEN="https://drive.google.com/uc?export=download&id=1WK2lxdiqd6bv54jFqsemnZFgt8eVorre"
MOODY="https://drive.google.com/uc?export=download&id=1sPjk6jA-eqRm65nerq6mRT833z-TMlGJ"
BAG="https://drive.google.com/uc?export=download&id=1O31RRhNXsXYnd8p4VK9nsVvBFdDlYIh4"
wiki=None
try:
    req=urllib.request.Request("https://en.wikipedia.org/api/rest_v1/page/summary/Alaska_Airlines", headers={"User-Agent":"DeckBuilder/1.0 (aslihabnuri28@gmail.com)"})
    d=json.loads(urllib.request.urlopen(req, timeout=30).read()); wiki=d.get("originalimage",{}).get("source"); print("wiki image:", wiki, flush=True)
    if wiki: urllib.request.urlretrieve(wiki, os.path.join(OUT,"_wiki_ref.jpg"))
except Exception as e: print("wiki failed:", e, flush=True)
LIV=(" The aircraft is an Alaska Airlines Boeing 737 in its current livery exactly as in the reference photos: glossy white fuselage with the large dark-navy 'Alaska' script wordmark along the forward fuselage, a dark-navy vertical tail carrying the Alaska Airlines smiling Eskimo face logo, and a teal-to-lime-green gradient flourish sweeping from the rear fuselage onto the tail. The 'Alaska' wordmark and the tail logo must be clearly visible, sharp and accurately rendered."
     " Photojournalistic airport ramp photography, realistic, high contrast, cinematic color grading, natural film-like grain; match the tone, lighting and color grading of the reference photos but create a new scene. No other text.")
refs=lambda *r: [x for x in ([ALASKA]+([wiki] if wiki else [])+list(r)) if x]
P={
 "cover": ("3:4", refs(NIGHT), "Portrait composition, low angle from the wet apron at night: ONE complete Alaska Airlines Boeing 737 parked at a terminal gate, seen in three-quarter front view so that the entire aircraft from nose to tail fits inside the frame with margin, cabin windows glowing warm, a pushback tug near the nose gear, amber ramp lights reflecting on wet tarmac, dark overcast sky."+LIV),
 "apron": ("4:3", refs(GOLDEN), "Elevated wide view of a busy airport apron at golden hour: an Alaska Airlines Boeing 737 in side view being serviced by a fuel truck, belt loaders and baggage carts, ground crew in hi-vis vests, control tower and terminal in warm haze, long shadows."+LIV),
 "hangar": ("16:9", refs(NIGHT, MOODY), "Night inside an airline maintenance hangar: an Alaska Airlines Boeing 737 seen from the side with the engine cowling open, technicians in navy uniforms and hi-vis vests under bright work lights, tool carts and parts bins in the foreground, bright lamps against the dark hangar; the tail logo and 'Alaska' wordmark visible."+LIV),
 "marshaller": ("16:9", refs(NIGHT), "Night photo of an aircraft marshaller in a yellow hi-vis jacket seen from behind, raising two lighted marshalling wands above the head, guiding an Alaska Airlines Boeing 737 that taxis toward the camera at a slight angle so the 'Alaska' wordmark on the fuselage and the tail logo are visible, landing lights glowing through light rain, wet taxiway reflections, traffic cones."+LIV),
 "ground_stop": ("4:3", refs(NIGHT), "Night view from the apron of a row of Alaska Airlines Boeing 737s parked idle at terminal gates with jet bridges attached, no ground activity, tails with the Eskimo logo lined up, wet tarmac reflecting the terminal glow, overcast sky: a quiet ramp during a system-wide ground stop."+LIV),
 "tech": ("4:3", refs(MOODY), "Dramatic low-angle portrait of an aircraft ground technician wearing a headset and hi-vis vest standing beside the nose gear of an Alaska Airlines Boeing 737, the 'Alaska' wordmark large behind him and the tail logo visible, moody overcast sky, desaturated cinematic grading, red apron markings."+LIV),
 "pilots": ("4:3", refs(GOLDEN), "Two airline pilots in dark navy uniforms and caps walking across the apron toward an Alaska Airlines Boeing 737 at dawn, carrying flight bags, seen from behind at a slight low angle, the aircraft in side view with wordmark and tail logo visible, warm-cool contrast."+LIV),
 "baggage": ("4:3", refs(BAG), "Daylight photo of two ground handlers in yellow hi-vis vests and navy uniforms pushing a baggage cart with a suitcase toward an Alaska Airlines Boeing 737 at the gate, the 'Alaska' wordmark and tail logo visible, bright sunlight, sharp shadows."+LIV),
}
def call(url, body=None):
    req=urllib.request.Request(url, data=json.dumps(body).encode() if body else None, headers={"Authorization":"Bearer "+KEY,"Content-Type":"application/json"})
    with urllib.request.urlopen(req, timeout=60) as r: return json.loads(r.read())
tasks={}
for n,(ar,rf,prompt) in P.items():
    r=call("https://api.kie.ai/api/v1/jobs/createTask", {"model":"nano-banana-2","input":{"prompt":prompt,"aspect_ratio":ar,"resolution":"1K","output_format":"jpg","image_input":rf}})
    print(n, r.get("code"), r.get("msg"), flush=True)
    if r.get("code")==200: tasks[n]=r["data"]["taskId"]
    time.sleep(1)
t0=time.time()
while tasks and time.time()-t0<840:
    time.sleep(8)
    for n,tid in list(tasks.items()):
        d=(call("https://api.kie.ai/api/v1/jobs/recordInfo?taskId="+tid).get("data") or {})
        if d.get("state")=="success":
            u=json.loads(d.get("resultJson") or "{}").get("resultUrls",[])
            if u: urllib.request.urlretrieve(u[0], os.path.join(OUT,n+".jpg")); print("DONE",n,flush=True)
            tasks.pop(n)
        elif d.get("state")=="fail": print("FAIL",n,d.get("failCode"),d.get("failMsg"),flush=True); tasks.pop(n)
print("remaining",tasks)
