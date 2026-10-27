import json, os, sys, time, urllib.request
KEY=os.environ["KIE_KEY"]; OUT=sys.argv[1]; USE_REF=sys.argv[2]=="ref"
REF={"night1":"https://drive.google.com/uc?export=download&id=11jjnLe4lH1PayhRFeTIprOC0S2hu63zz",
     "moody":"https://drive.google.com/uc?export=download&id=1BhZyVve9PRT-hx0i-CmMXCFw7zLmiS_Q",
     "golden":"https://drive.google.com/uc?export=download&id=1WK2lxdiqd6bv54jFqsemnZFgt8eVorre",
     "alaska_night":"https://drive.google.com/uc?export=download&id=1sPjk6jA-eqRm65nerq6mRT833z-TMlGJ",
     "baggage":"https://drive.google.com/uc?export=download&id=1O31RRhNXsXYnd8p4VK9nsVvBFdDlYIh4"}
TONE=" Photojournalistic airport ramp photography, realistic, high contrast, cinematic color grading, natural film-like grain. Aircraft livery: clean white fuselage, deep navy-blue tail fin with a subtle teal-to-green accent; no readable lettering, no logos, no text. Match the photographic tone, lighting and color grading of the reference images but create a completely new scene; do not copy their content, airlines or logos."
P={
 "cover_night_gate": ("3:4", ["alaska_night","night1"], "Low-angle photo at night of a white narrow-body jet parked at the gate: deep navy tail fin, cabin windows glowing warm, ground power cable and a pushback tug beside the nose gear, wet apron reflecting amber ramp lights, overcast night sky."+TONE),
 "apron_golden": ("4:3", ["golden"], "Elevated wide view of a busy airport apron at golden hour: a white jet with navy tail being serviced by a fuel truck, belt loaders and baggage carts, ground crew in hi-vis vests, control tower and terminal in warm haze, long shadows."+TONE),
 "hangar_night": ("16:9", ["night1","moody"], "Night inside an airline maintenance hangar: technicians in navy uniforms and hi-vis vests under bright work lights inspecting the open engine cowling of a white jet with navy tail, tool carts and parts bins in the foreground, bright lamps against the dark hangar."+TONE),
 "marshaller_night": ("16:9", ["night1","alaska_night"], "Night photo of an aircraft marshaller in a yellow hi-vis jacket seen from behind, raising two red lighted wands crossed above the head, guiding a white narrow-body jet with navy tail fin taxiing toward the camera, landing lights glowing, wet taxiway, traffic cones."+TONE),
 "maint_tech": ("1:1", ["moody"], "Dramatic low-angle portrait of an aircraft ground technician wearing a headset and hi-vis vest, standing under the nose of a white jet with navy tail, moody overcast sky, desaturated cinematic grading, red apron markings."+TONE),
 "pilots": ("1:1", ["golden","alaska_night"], "Two airline pilots in dark navy uniforms and caps walking across the apron toward a white jet with navy tail at dawn, carrying flight bags, seen from behind at a slight low angle, warm-cool contrast."+TONE),
 "baggage": ("1:1", ["baggage"], "Daylight photo of two ground handlers in yellow hi-vis vests and navy uniforms pushing a baggage cart with a suitcase toward a white jet with navy tail at the gate, bright sunlight, sharp shadows."+TONE),
 "ops_center": ("4:3", ["night1","moody"], "Airline operations control center at night: dispatchers with headsets at desks with multiple monitors, a large wall screen showing a flight map and weather radar, blue screen glow in a dark room, shallow depth of field."+TONE),
}
def call(url, body=None):
    req=urllib.request.Request(url, data=json.dumps(body).encode() if body else None, headers={"Authorization":"Bearer "+KEY,"Content-Type":"application/json"})
    with urllib.request.urlopen(req, timeout=60) as r: return json.loads(r.read())
tasks={}
for n,(ar,refs,prompt) in P.items():
    inp={"prompt":prompt,"aspect_ratio":ar,"resolution":"1K","output_format":"jpg"}
    if USE_REF: inp["image_input"]=[REF[r] for r in refs]
    r=call("https://api.kie.ai/api/v1/jobs/createTask", {"model":"nano-banana-2","input":inp})
    print(n, r.get("code"), r.get("msg"), flush=True)
    if r.get("code")==200: tasks[n]=r["data"]["taskId"]
    time.sleep(1)
t0=time.time()
while tasks and time.time()-t0<900:
    time.sleep(8)
    for n,tid in list(tasks.items()):
        d=(call("https://api.kie.ai/api/v1/jobs/recordInfo?taskId="+tid).get("data") or {})
        if d.get("state")=="success":
            u=json.loads(d.get("resultJson") or "{}").get("resultUrls",[])
            if u: urllib.request.urlretrieve(u[0], os.path.join(OUT,n+".jpg")); print("DONE",n,flush=True)
            tasks.pop(n)
        elif d.get("state")=="fail": print("FAIL",n,d.get("failCode"),d.get("failMsg"),flush=True); tasks.pop(n)
print("remaining",tasks)
