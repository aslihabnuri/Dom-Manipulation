import json,sys,time,urllib.request,os,subprocess
KEY=os.environ['KIE_API_KEY']
def req(url,data=None):
    r=urllib.request.Request(url,data=json.dumps(data).encode() if data else None,
        headers={'Authorization':f'Bearer {KEY}','Content-Type':'application/json'})
    return json.load(urllib.request.urlopen(r,timeout=90))
def run(payload,out,timeout=300):
    t=req('https://api.kie.ai/api/v1/jobs/createTask',payload)
    if t.get('code')!=200: print('ERR',t); return None
    tid=t['data']['taskId']; start=time.time()
    while time.time()-start<timeout:
        time.sleep(7)
        d=req(f'https://api.kie.ai/api/v1/jobs/recordInfo?taskId={tid}')['data']
        st=d['state']
        if st=='success':
            url=json.loads(d['resultJson'])['resultUrls'][0]
            subprocess.run(['curl','-sSL','--max-time','120','-o',out,url],check=True)
            print('OK',out,d.get('creditsConsumed'),'credits'); return out
        if st in ('fail','failed','error'):
            print('FAIL',d.get('failMsg')); return None
    print('TIMEOUT'); return None
