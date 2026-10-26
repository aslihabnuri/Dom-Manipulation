import json, os, sys, time, urllib.request
KEY=os.environ["KIE_KEY"]; OUT=sys.argv[1]
BRAND="Brand palette: deep midnight navy (#00274A), atlas blue (#0074C8), breeze teal (#00CFF0), tropical lime green (#91BE62), white. No logos, no lettering, no text, no watermark."
PROMPTS={
 "cover_hero": ("16:9", "Photorealistic cinematic wide shot of a modern narrow-body passenger jet with a clean white fuselage, a deep midnight-navy tail fin and a smooth teal-to-lime-green gradient stripe sweeping along the rear fuselage, taxiing on a rain-soaked runway at Seattle airport at dusk; evergreen forest and a snow-capped volcanic mountain faintly in the background, soft grey rain clouds, reflections on wet tarmac, cool navy and teal palette, high detail aviation photography. "+BRAND),
 "ops_center": ("16:9", "Photorealistic interior of an airline flight operations control center at night: a wide room with a wall of large screens showing flight-tracking maps of the Pacific Northwest and weather radar, rows of dispatchers at desks with multiple monitors, deep navy walls with teal and blue ambient lighting, a vertical column of three status lights (green, yellow, red) on a pillar, editorial photography, no readable text. "+BRAND),
 "hangar": ("16:9", "Photorealistic aircraft maintenance hangar at night: a white narrow-body jet with a deep midnight-navy tail fin under bright hangar lights, technicians in navy uniforms inspecting an open engine cowling, in the foreground organized shelving of spare-parts bins and a rolling tool cart, cool blue and teal tones, clean editorial photography. "+BRAND),
 "deicing": ("16:9", "Photorealistic de-icing truck spraying fluid on a white narrow-body passenger jet with a deep midnight-navy tail fin and teal-to-lime-green gradient accent at a snowy airport at dawn, falling snow, ground crew in navy jackets, cool blue morning light, evergreen trees in the distance, editorial aviation photography. "+BRAND),
 "crew_gate": ("16:9", "Photorealistic airport terminal gate at sunrise: a pilot and two flight attendants in dark navy uniforms walking toward the jet bridge, seen from behind; through the floor-to-ceiling window a white jet with a deep midnight-navy tail fin and teal-to-lime-green gradient accent is parked at the gate, warm sunrise light mixing with cool blue tones, mountain silhouette outside, editorial photography. "+BRAND),
 "sticker_mechanic": ("1:1", "Flat vector sticker illustration in a friendly hand-drawn style: an airline maintenance technician in a midnight-navy jumpsuit holding a clipboard and a wrench, standing beside a small white airplane with a navy tail fin, thick dark navy outlines, white fill with soft teal and lime-green accents, thick white sticker border around the whole figure, isolated on a pure solid white background, minimal, clean. "+BRAND),
 "sticker_pilot": ("1:1", "Flat vector sticker illustration in a friendly hand-drawn style: a smiling airline pilot in a midnight-navy uniform and cap waving one hand and holding a paper flight timetable in the other, thick dark navy outlines, white fill with soft teal and lime-green accents, thick white sticker border around the whole figure, isolated on a pure solid white background, minimal, clean. "+BRAND),
}
def call(url, body=None):
    req=urllib.request.Request(url, data=json.dumps(body).encode() if body else None, headers={"Authorization":"Bearer "+KEY,"Content-Type":"application/json"})
    with urllib.request.urlopen(req, timeout=60) as r: return json.loads(r.read())
tasks={}
for name,(ar,prompt) in PROMPTS.items():
    r=call("https://api.kie.ai/api/v1/jobs/createTask", {"model":"nano-banana-2","input":{"prompt":prompt,"aspect_ratio":ar,"resolution":"1K","output_format":"png"}})
    print(name, r.get("code"), r.get("msg"), flush=True)
    if r.get("code")==200: tasks[name]=r["data"]["taskId"]
    time.sleep(1)
pending=dict(tasks); t0=time.time()
while pending and time.time()-t0<900:
    time.sleep(6)
    for name,tid in list(pending.items()):
        r=call("https://api.kie.ai/api/v1/jobs/recordInfo?taskId="+tid)
        d=r.get("data") or {}; st=d.get("state")
        if st=="success":
            urls=json.loads(d.get("resultJson") or "{}").get("resultUrls",[])
            if urls:
                urllib.request.urlretrieve(urls[0], os.path.join(OUT,name+".png"))
                print("DONE",name,urls[0],flush=True)
            pending.pop(name)
        elif st=="fail":
            print("FAIL",name,d.get("failCode"),d.get("failMsg"),flush=True); pending.pop(name)
print("remaining",pending)
