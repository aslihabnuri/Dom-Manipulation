import json, os, sys, time, urllib.request
KEY=os.environ["KIE_KEY"]; OUT=sys.argv[1]
TONE=" Photojournalistic airport ramp photography, realistic, high contrast, cinematic color grading, natural film-like grain. Aircraft livery: clean white fuselage, deep navy-blue tail fin with a subtle teal-to-green accent; no readable lettering, no logos, no text. Match the photographic tone, lighting and color grading of the reference images but create a completely new scene; do not copy their content or logos."
prompt="Night view from the apron of a row of white narrow-body jets with navy tail fins parked idle at terminal gates with jet bridges attached, no ground activity, cabin lights off, wet tarmac reflecting the terminal glow, overcast sky: a quiet ramp during a system-wide ground stop."+TONE
def call(url, body=None):
    req=urllib.request.Request(url, data=json.dumps(body).encode() if body else None, headers={"Authorization":"Bearer "+KEY,"Content-Type":"application/json"})
    with urllib.request.urlopen(req, timeout=60) as r: return json.loads(r.read())
r=call("https://api.kie.ai/api/v1/jobs/createTask", {"model":"nano-banana-2","input":{"prompt":prompt,"aspect_ratio":"4:3","resolution":"1K","output_format":"jpg","image_input":["https://drive.google.com/uc?export=download&id=1sPjk6jA-eqRm65nerq6mRT833z-TMlGJ","https://drive.google.com/uc?export=download&id=11jjnLe4lH1PayhRFeTIprOC0S2hu63zz"]}})
print(r.get("code"), r.get("msg"), flush=True); tid=r["data"]["taskId"]; t0=time.time()
while time.time()-t0<600:
    time.sleep(8); d=(call("https://api.kie.ai/api/v1/jobs/recordInfo?taskId="+tid).get("data") or {})
    if d.get("state")=="success":
        u=json.loads(d.get("resultJson") or "{}").get("resultUrls",[]); urllib.request.urlretrieve(u[0], os.path.join(OUT,"ground_stop.jpg")); print("DONE",flush=True); break
    if d.get("state")=="fail": print("FAIL",d.get("failCode"),d.get("failMsg"),flush=True); break
