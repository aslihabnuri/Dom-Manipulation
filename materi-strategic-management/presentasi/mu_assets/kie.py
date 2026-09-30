import json, sys, time, urllib.request, os
KEY = os.environ.get('KIE_API_KEY', '')
H = {'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json'}
def post(url, body):
    r = urllib.request.Request(url, data=json.dumps(body).encode(), headers=H)
    return json.load(urllib.request.urlopen(r, timeout=60))
def get(url):
    r = urllib.request.Request(url, headers=H)
    return json.load(urllib.request.urlopen(r, timeout=60))
def create(name, prompt, ar, res='1K', refs=None):
    b = {'model': 'nano-banana-2', 'input': {'prompt': prompt, 'aspect_ratio': ar, 'resolution': res, 'output_format': 'png'}}
    if refs: b['input']['image_input'] = refs
    r = post('https://api.kie.ai/api/v1/jobs/createTask', b)
    print(name, r, flush=True)
    return r['data']['taskId']
def wait(name, tid):
    for _ in range(90):
        r = get('https://api.kie.ai/api/v1/jobs/recordInfo?taskId=' + tid)
        d = r.get('data') or {}
        st = d.get('state')
        if st == 'success':
            urls = json.loads(d['resultJson'])['resultUrls']
            out = name + '.png'
            urllib.request.urlretrieve(urls[0], out)
            print('OK', name, out, 'credits', d.get('creditsConsumed'), flush=True)
            return out
        if st == 'fail':
            print('FAIL', name, d.get('failMsg'), flush=True); return None
        time.sleep(5)
    print('TIMEOUT', name); return None
if __name__ == '__main__':
    jobs = json.load(open(sys.argv[1]))
    REFS = list(json.load(open('ref_urls.json')).values())
    tids = {j['name']: create(j['name'], j['prompt'], j['ar'], j.get('res', '1K'), REFS if j.get('ref') else None) for j in jobs}
    for n, t in tids.items(): wait(n, t)
    print(get('https://api.kie.ai/api/v1/chat/credit'))
