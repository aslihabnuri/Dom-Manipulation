import json, urllib.request
K="482f6964b6cb4cb8ddf13be886c210ff"

LOOK = ("Strictly monochrome black and white — charcoal, graphite, steel grey and clean "
        "white only, zero colour cast. One hard undiffused key light, deep controlled "
        "shadows falling to near-black, premium editorial menswear campaign. Full-frame "
        "camera, tack-sharp, natural texture, subtle grain, photorealistic. "
        "ABSOLUTELY NO text, letters, numbers, logos, watermarks or graphic overlays.")

JOBS = [
 ("fabric", "16:9",
  "Extreme macro photograph of premium black modal jersey knit fabric filling the frame. "
  "Soft matte surface, fine ribbed knit structure clearly visible, one relaxed diagonal "
  "fold running across the frame catching the light along its ridge. Hard raking light "
  "from the left picks out every loop of the knit; the right side falls into deep shadow. "
  "Macro lens, shallow depth of field, the weave sharp at the fold. No hands, no garment "
  "edges, no stitching, no elastic. " + LOOK),

 ("waistband", "4:5",
  "Editorial black and white photograph cropped from mid-chest to upper thigh, no face in "
  "frame. An athletic Southeast Asian man stands relaxed, one hand lifting the hem of a "
  "plain dark t-shirt just above his waist. He wears dark tailored trousers sitting low on "
  "the hip so that a plain wide flat black underwear waistband is clearly visible above the "
  "trouser band. The waistband is completely blank, unbranded, matte black woven elastic. "
  "Lean natural midsection. Plain dark charcoal wall behind, deep shadow. " + LOOK),

 ("creator", "9:16",
  "Vertical documentary black and white photograph. An athletic Southeast Asian man in his "
  "early thirties sits on the edge of a bed in a plain bedroom, holding a smartphone at "
  "arm's length toward himself as if recording a video. He wears a plain black t-shirt and "
  "plain black boxer briefs, no branding. Relaxed unposed posture, mid-sentence expression, "
  "candid and natural rather than styled. Hard window light from the left, the far side of "
  "the room falling into deep shadow. Simple bedroom, no clutter, no posters. " + LOOK),
]
out={}
for name, ar, prompt in JOBS:
    body=json.dumps({"model":"nano-banana-2","input":{
        "prompt":prompt,"aspect_ratio":ar,"resolution":"2K","output_format":"png"}}).encode()
    r=urllib.request.Request("https://api.kie.ai/api/v1/jobs/createTask", data=body,
        headers={"Authorization":"Bearer "+K,"Content-Type":"application/json"})
    res=json.load(urllib.request.urlopen(r, timeout=120))
    print(name, res.get("code"), res.get("data",{}).get("taskId"))
    if res.get("code")==200: out[name]=res["data"]["taskId"]
json.dump(out, open("tasks.json","w")); print(out)
