import sys,json,time,requests,os
KEY=os.environ["KIE_API_KEY"]
H={"Authorization":f"Bearer {KEY}"}
def upload(path):
    r=requests.post("https://kieai.redpandaai.co/api/file-stream-upload",headers=H,
        files={"file":open(path,"rb")},data={"uploadPath":"toniblack"},timeout=120)
    j=r.json(); assert j.get("code")==200,j; return j["data"]["downloadUrl"]
def create(prompt,images,ar="2:3",res="2K",model="nano-banana-pro"):
    body={"model":model,"input":{"prompt":prompt,"image_input":images,"aspect_ratio":ar,"resolution":res,"output_format":"png"}}
    r=requests.post("https://api.kie.ai/api/v1/jobs/createTask",headers={**H,"Content-Type":"application/json"},json=body,timeout=60)
    j=r.json(); assert j.get("code")==200,j; return j["data"]["taskId"]
def wait(tid,maxs=900):
    t0=time.time()
    while time.time()-t0<maxs:
        j=requests.get("https://api.kie.ai/api/v1/jobs/recordInfo",headers=H,params={"taskId":tid},timeout=60).json()
        d=j.get("data") or {}
        st=d.get("state")
        if st=="success":
            return json.loads(d["resultJson"])["resultUrls"]
        if st=="fail":
            raise SystemExit(f"FAILED {tid}: {d.get('failMsg') or d}")
        time.sleep(8)
    raise SystemExit("timeout "+tid)
def download(url,out):
    r=requests.get(url,timeout=300); open(out,"wb").write(r.content); return out
if __name__=="__main__":
    cmd=sys.argv[1]
    if cmd=="upload":
        for p in sys.argv[2:]: print(p, upload(p))
    elif cmd=="gen":
        name,promptfile=sys.argv[2],sys.argv[3]; imgs=sys.argv[4:]
        ar=os.environ.get("AR","2:3"); res=os.environ.get("RES","2K")
        tid=create(open(promptfile).read(),imgs,ar,res); print("task",name,tid,flush=True)
        urls=wait(tid); print("urls",urls,flush=True)
        for i,u in enumerate(urls): print(download(u,f"gen/{name}_{i}.png"))
    elif cmd=="wait":
        print(wait(sys.argv[2]))
