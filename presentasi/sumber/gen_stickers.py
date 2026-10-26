import json, os, sys, time, urllib.request
KEY=os.environ["KIE_KEY"]; OUT=sys.argv[1]
STYLE="Flat vector sticker illustration in a friendly hand-drawn style, thick dark navy (#00274A) outlines, white fill with soft teal (#00CFF0) and lime-green (#91BE62) and atlas-blue (#0074C8) accents, thick white sticker border around the whole figure, isolated on a pure solid white background, minimal, clean, no text, no logo, no lettering."
P={
 "st_plane_snow": "A small white passenger airplane with a deep navy tail fin flying through falling snowflakes under a small grey cloud, "+STYLE,
 "st_dispatcher": "A friendly airline dispatcher wearing a headset, sitting at a desk with two computer monitors showing a map and a weather radar, "+STYLE,
 "st_parts": "An open wooden crate of aircraft spare parts (a small jet engine fan, a tire, a bolt) next to a clipboard checklist and a wrench, "+STYLE,
 "st_gate": "A smiling airline gate agent at a counter with a small departures board above, a traveler with a rolling suitcase waiting, "+STYLE,
}
def call(url, body=None):
    req=urllib.request.Request(url, data=json.dumps(body).encode() if body else None, headers={"Authorization":"Bearer "+KEY,"Content-Type":"application/json"})
    with urllib.request.urlopen(req, timeout=60) as r: return json.loads(r.read())
tasks={}
for n,p in P.items():
    r=call("https://api.kie.ai/api/v1/jobs/createTask", {"model":"nano-banana-2","input":{"prompt":p,"aspect_ratio":"1:1","resolution":"1K","output_format":"png"}})
    print(n, r.get("code"), r.get("msg"), flush=True)
    if r.get("code")==200: tasks[n]=r["data"]["taskId"]
    time.sleep(1)
t0=time.time()
while tasks and time.time()-t0<600:
    time.sleep(6)
    for n,tid in list(tasks.items()):
        d=(call("https://api.kie.ai/api/v1/jobs/recordInfo?taskId="+tid).get("data") or {})
        if d.get("state")=="success":
            u=json.loads(d.get("resultJson") or "{}").get("resultUrls",[])
            if u: urllib.request.urlretrieve(u[0], os.path.join(OUT,n+".png")); print("DONE",n,flush=True)
            tasks.pop(n)
        elif d.get("state")=="fail": print("FAIL",n,d.get("failMsg"),flush=True); tasks.pop(n)
print("remaining",tasks)
