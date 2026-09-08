import json, os, sys, time, urllib.request, subprocess
KEY=os.environ["KIE_KEY"]
def api(path, body=None):
    req=urllib.request.Request("https://api.kie.ai/api/v1"+path, data=json.dumps(body).encode() if body else None,
        headers={"Authorization":"Bearer "+KEY,"Content-Type":"application/json"}, method="POST" if body else "GET")
    with urllib.request.urlopen(req, timeout=60) as r: return json.load(r)
name, prompt = sys.argv[1], sys.argv[2]
r=api("/jobs/createTask", {"model":"google/nano-banana","input":{"prompt":prompt,"image_size":"16:9","output_format":"png"}})
tid=r["data"]["taskId"]; print("task",tid, flush=True)
for _ in range(60):
    time.sleep(8); d=api("/jobs/recordInfo?taskId="+tid)["data"]
    if d.get("state")=="success":
        url=json.loads(d["resultJson"])["resultUrls"][0]
        subprocess.run(["curl","-sS","-m","120","-o",f"img/{name}_raw.png",url],check=True); print("done",name); break
    if d.get("state")=="fail": print("FAILED",d.get("failMsg")); break
print("credits left:", api("/chat/credit")["data"])
