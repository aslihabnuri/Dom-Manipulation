import json, os, time, urllib.request, subprocess
KEY=os.environ["KIE_KEY"]
PRE="High contrast black and white documentary photograph of {}. The entire subject is fully visible and centered with margin around it, isolated on a flat uniform pure bright green chroma key background (#00FF00), no shadow on the background, no text, no logos, no watermark."
P={
 "a320":"a modern narrow body twin engine jet airliner in flight seen from the side, nose slightly up, landing gear retracted",
 "widebody":"a large four engine wide body jet airliner in flight seen from a front three quarter angle",
 "exec":"a confident Southeast Asian man in his forties in a black shirt, half length portrait, arms crossed, looking at the camera",
 "pilot":"an airline captain in uniform holding his cap, half length portrait, looking to the side",
 "petronas":"the Petronas twin towers in Kuala Lumpur, full height, daytime",
 "bigben":"the Big Ben clock tower in London, full height",
 "terminal":"a modern airport terminal building with an air traffic control tower, wide exterior view",
 "passengers":"a group of five diverse passengers with rolling suitcases walking together, full length",
 "engine":"a large turbofan jet engine seen from the front, close up",
 "hangar":"technicians in overalls working on the wing of a jet airliner inside a maintenance hangar",
 "groundcrew":"two ground crew workers in vests loading suitcases onto a baggage cart on the tarmac",
 "airstairs":"passengers climbing mobile airstairs to board a jet airliner",
 "meeting":"three business people in a discussion around a small table, seen from the side, full length",
 "tower":"an airport air traffic control tower, full height",
}
def api(p, body=None):
    req=urllib.request.Request("https://api.kie.ai/api/v1"+p, data=json.dumps(body).encode() if body else None, headers={"Authorization":"Bearer "+KEY,"Content-Type":"application/json"}, method="POST" if body else "GET")
    return json.load(urllib.request.urlopen(req, timeout=60))
tasks={}
for n,s in P.items():
    if os.path.exists(f"img/bw_{n}_raw.png"): continue
    tasks[n]=api("/jobs/createTask",{"model":"google/nano-banana","input":{"prompt":PRE.format(s),"image_size":"16:9","output_format":"png"}})["data"]["taskId"]; print("submitted",n,flush=True); time.sleep(1.5)
while tasks:
    time.sleep(8)
    for n,t in list(tasks.items()):
        d=api("/jobs/recordInfo?taskId="+t)["data"]
        if d["state"]=="success":
            subprocess.run(["curl","-sS","-m","120","-o",f"img/bw_{n}_raw.png",json.loads(d["resultJson"])["resultUrls"][0]],check=True); print("done",n,flush=True); del tasks[n]
        elif d["state"]=="fail": print("FAIL",n,d.get("failMsg")); del tasks[n]
print("credits left:",api("/chat/credit")["data"])
