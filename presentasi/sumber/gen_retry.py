import json, os, sys, time, urllib.request
KEY=os.environ["KIE_KEY"]; OUT=sys.argv[1]
ALASKA="https://drive.google.com/uc?export=download&id=1BhZyVve9PRT-hx0i-CmMXCFw7zLmiS_Q"
NIGHT="https://drive.google.com/uc?export=download&id=11jjnLe4lH1PayhRFeTIprOC0S2hu63zz"
GOLDEN="https://drive.google.com/uc?export=download&id=1WK2lxdiqd6bv54jFqsemnZFgt8eVorre"
WIKI="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Alaska_Boeing_737-900ER_N407AS_departing_Boston_June_2025.jpg/1920px-Alaska_Boeing_737-900ER_N407AS_departing_Boston_June_2025.jpg"
LIV=(" The aircraft is an Alaska Airlines Boeing 737 in its current livery exactly as in the reference photos: glossy white fuselage with the large dark-navy 'Alaska' script wordmark along the forward fuselage, a dark-navy vertical tail carrying the Alaska Airlines smiling Eskimo face logo, and a teal-to-lime-green gradient flourish sweeping from the rear fuselage onto the tail. The 'Alaska' wordmark and the tail logo must be clearly visible, sharp and accurately rendered."
     " Photojournalistic airport ramp photography, realistic, high contrast, cinematic color grading, natural film-like grain; match the tone, lighting and color grading of the reference photos but create a new scene. No other text.")
P={
 "apron": ("4:3", [ALASKA, WIKI, GOLDEN], "Elevated wide view of a busy airport apron at golden hour: an Alaska Airlines Boeing 737 in side view being serviced by a fuel truck, belt loaders and baggage carts, ground crew in hi-vis vests, control tower and terminal in warm haze, long shadows."+LIV),
 "marshaller": ("16:9", [ALASKA, WIKI, NIGHT], "Night photo of an aircraft marshaller in a yellow hi-vis jacket seen from behind, raising two lighted marshalling wands above the head, guiding an Alaska Airlines Boeing 737 that taxis toward the camera at a slight angle so the 'Alaska' wordmark on the fuselage and the tail logo are visible, landing lights glowing through light rain, wet taxiway reflections, traffic cones."+LIV),
}
def call(url, body=None):
    req=urllib.request.Request(url, data=json.dumps(body).encode() if body else None, headers={"Authorization":"Bearer "+KEY,"Content-Type":"application/json"})
    with urllib.request.urlopen(req, timeout=60) as r: return json.loads(r.read())
def submit(n, rf):
    ar,_,prompt=P[n]
    r=call("https://api.kie.ai/api/v1/jobs/createTask", {"model":"nano-banana-2","input":{"prompt":prompt,"aspect_ratio":ar,"resolution":"1K","output_format":"jpg","image_input":rf}})
    print("submit",n,len(rf),r.get("code"),r.get("msg"),flush=True); return r["data"]["taskId"] if r.get("code")==200 else None
tasks={n:(submit(n,P[n][1]),True) for n in P}; t0=time.time()
while tasks and time.time()-t0<840:
    time.sleep(8)
    for n,(tid,withwiki) in list(tasks.items()):
        if not tid: tasks.pop(n); continue
        d=(call("https://api.kie.ai/api/v1/jobs/recordInfo?taskId="+tid).get("data") or {})
        if d.get("state")=="success":
            u=json.loads(d.get("resultJson") or "{}").get("resultUrls",[]); urllib.request.urlretrieve(u[0], os.path.join(OUT,n+".jpg")); print("DONE",n,flush=True); tasks.pop(n)
        elif d.get("state")=="fail":
            print("FAIL",n,d.get("failMsg"),flush=True); tasks.pop(n)
            if withwiki: tasks[n]=(submit(n,[x for x in P[n][1] if x!=WIKI]),False)
print("remaining",tasks)
