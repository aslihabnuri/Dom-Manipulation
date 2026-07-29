#!/usr/bin/env python3
"""Minimal Kie.ai client: upload a local image, run a generation job, fetch results."""
import base64, json, mimetypes, os, time, urllib.request, urllib.error

API = "https://api.kie.ai"
UPLOAD = "https://kieai.redpandaai.co/api/file-base64-upload"
# The upload host sits behind Cloudflare, which rejects urllib's default
# User-Agent with error 1010. Send a browser UA on every request.
UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0 Safari/537.36")


def _key():
    k = os.environ.get("KIE_API_KEY")
    if not k:
        for line in open(os.path.join(os.path.dirname(__file__), "..", ".env")):
            if line.startswith("KIE_API_KEY="):
                k = line.split("=", 1)[1].strip()
    if not k:
        raise SystemExit("KIE_API_KEY not set")
    return k


def _post(url, payload, timeout=180):
    req = urllib.request.Request(
        url, data=json.dumps(payload).encode(),
        headers={"Authorization": f"Bearer {_key()}", "Content-Type": "application/json",
                 "User-Agent": UA},
        method="POST")
    try:
        return json.loads(urllib.request.urlopen(req, timeout=timeout).read())
    except urllib.error.HTTPError as e:
        return {"code": e.code, "msg": e.read().decode()[:600]}


def _get(url, timeout=120):
    req = urllib.request.Request(
        url, headers={"Authorization": f"Bearer {_key()}", "User-Agent": UA})
    try:
        return json.loads(urllib.request.urlopen(req, timeout=timeout).read())
    except urllib.error.HTTPError as e:
        return {"code": e.code, "msg": e.read().decode()[:600]}


def upload(path, upload_path="images/toniblack"):
    mime = mimetypes.guess_type(path)[0] or "image/png"
    b64 = base64.b64encode(open(path, "rb").read()).decode()
    r = _post(UPLOAD, {"base64Data": f"data:{mime};base64,{b64}",
                       "uploadPath": upload_path,
                       "fileName": os.path.basename(path)})
    d = r.get("data") or {}
    url = d.get("downloadUrl") or d.get("fileUrl") or d.get("url")
    if not url:
        raise RuntimeError(f"upload failed: {json.dumps(r)[:400]}")
    return url


def create(model, inp):
    r = _post(f"{API}/api/v1/jobs/createTask", {"model": model, "input": inp})
    tid = (r.get("data") or {}).get("taskId")
    if not tid:
        raise RuntimeError(f"createTask failed: {json.dumps(r)[:500]}")
    return tid


def result(task_id, timeout=600, interval=6):
    """Poll until the job finishes; returns the list of output image URLs."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        r = _get(f"{API}/api/v1/jobs/recordInfo?taskId={task_id}")
        d = r.get("data") or {}
        state = (d.get("state") or d.get("status") or "").lower()
        if state in ("success", "succeeded", "completed"):
            res = d.get("resultJson") or d.get("result") or {}
            if isinstance(res, str):
                res = json.loads(res)
            urls = res.get("resultUrls") or res.get("urls") or res.get("images") or []
            return [u if isinstance(u, str) else u.get("url") for u in urls]
        if state in ("fail", "failed", "error"):
            raise RuntimeError(f"job failed: {d.get('failMsg') or json.dumps(d)[:400]}")
        time.sleep(interval)
    raise TimeoutError(f"timed out waiting for {task_id}")


def download(url, dest):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=180) as r, open(dest, "wb") as f:
        f.write(r.read())
    return dest


def generate(model, inp, dest=None, timeout=600):
    urls = result(create(model, inp), timeout=timeout)
    if dest and urls:
        download(urls[0], dest)
    return urls


if __name__ == "__main__":
    print("credit:", _get(f"{API}/api/v1/chat/credit").get("data"))
