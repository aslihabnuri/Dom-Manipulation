import json,time,requests,os,sys
KEY=os.environ["KIE_API_KEY"]   # never hard-code the key; H={"Authorization":f"Bearer {KEY}","Content-Type":"application/json"}
def bal(): return requests.get("https://api.kie.ai/api/v1/chat/credit",headers=H,timeout=30).json()["data"]
b0=bal(); print("balance before",b0,flush=True)
body={"model":"ai-music-api/generate","input":{"custom_mode":True,"instrumental":True,"model":"V6","title":"Made For Every Body",
 "style":"minimal deep house instrumental, clean and modern, calm confidence, 120 BPM, steady four-on-the-floor kick from the first bar, warm sub bass, crisp hi-hats, soft plucks, premium fashion advertisement, no build-up, no drop",
 "negative_tags":"vocals, singing, choir, spoken word, lo-fi noise, aggressive, EDM drop","duration":30}}
j=requests.post("https://api.kie.ai/api/v1/jobs/createTask",headers=H,json=body,timeout=60).json(); print(j,flush=True)
assert j.get("code")==200,j; tid=j["data"]["taskId"]
t0=time.time()
while time.time()-t0<900:
    d=requests.get("https://api.kie.ai/api/v1/jobs/recordInfo",headers=H,params={"taskId":tid},timeout=60).json().get("data") or {}
    st=d.get("state") or d.get("status")
    if st in ("success","SUCCESS"):
        res=d.get("response") or json.loads(d.get("resultJson") or "{}"); open("music/result.json","w").write(json.dumps(d,indent=1)); print("done",flush=True); break
    if st in ("fail","FAILED","failed","GENERATE_AUDIO_FAILED"): print("FAILED",d,flush=True); sys.exit(1)
    time.sleep(10)
urls=[]
def walk(o):
    if isinstance(o,dict):
        for k,v in o.items():
            if k in ("audio_url","audioUrl") and v: urls.append(v)
            else: walk(v)
    elif isinstance(o,list):
        for v in o: walk(v)
    elif isinstance(o,str) and o.strip().startswith("{"):
        try: walk(json.loads(o))
        except Exception: pass
walk(d); print("urls",urls,flush=True)
for i,u in enumerate(dict.fromkeys(urls)): open(f"music/track_{i}.mp3","wb").write(requests.get(u,timeout=300).content); print("saved",i,flush=True)
time.sleep(5); b1=bal(); print("balance after",b1,"cost",round(b0-b1,2),flush=True)
