import json, os, sys, time, urllib.request, subprocess
KEY=os.environ["KIE_KEY"]
BASE="isolated on a flat, uniform, pure bright green chroma key background (#00FF00), no shadow on the background, no text, no letters, photographic cutout style, "
P={
 "band_cream": BASE+"a single wide horizontal strip of aged cream parchment paper with rough torn edges on all four sides, slightly crumpled, occupying the middle of the frame horizontally, wide 16:9.",
 "band_red": BASE+"a single wide horizontal strip of deep crimson red aged paper with rough torn ragged edges on all four sides, slightly crumpled, occupying the middle of the frame horizontally, wide 16:9.",
 "sheet": BASE+"one large sheet of aged parchment paper with torn irregular edges, filling about 85 percent of the frame, subtle stains and creases, wide 16:9.",
 "tag": BASE+"a small torn scrap of aged cream paper, roughly rectangular with ragged edges, centered, wide 16:9.",
}
def api(p, body=None):
    req=urllib.request.Request("https://api.kie.ai/api/v1"+p, data=json.dumps(body).encode() if body else None, headers={"Authorization":"Bearer "+KEY,"Content-Type":"application/json"}, method="POST" if body else "GET")
    return json.load(urllib.request.urlopen(req, timeout=60))
tasks={}
for n,pr in P.items():
    if os.path.exists(f"img/{n}_raw.png"): continue
    tasks[n]=api("/jobs/createTask",{"model":"google/nano-banana","input":{"prompt":pr,"image_size":"16:9","output_format":"png"}})["data"]["taskId"]; print("submitted",n); time.sleep(1.5)
while tasks:
    time.sleep(8)
    for n,t in list(tasks.items()):
        d=api("/jobs/recordInfo?taskId="+t)["data"]
        if d["state"]=="success":
            subprocess.run(["curl","-sS","-m","120","-o",f"img/{n}_raw.png",json.loads(d["resultJson"])["resultUrls"][0]],check=True); print("done",n); del tasks[n]
        elif d["state"]=="fail": print("FAIL",n,d.get("failMsg")); del tasks[n]
print("credits left:",api("/chat/credit")["data"])
