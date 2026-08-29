import json, urllib.request
K="482f6964b6cb4cb8ddf13be886c210ff"
LOOK=("Strictly monochrome black and white — charcoal, graphite, steel grey and clean white "
      "only, zero colour cast. One hard undiffused key light, deep controlled shadows falling "
      "to near-black, cinematic editorial menswear campaign. Full-frame camera, tack-sharp, "
      "natural texture, subtle grain, photorealistic. ABSOLUTELY NO text, letters, numbers, "
      "logos, watermarks or graphic overlays.")
JOBS=[
 ("waistband2","4:5",
  "Editorial black and white photograph cropped from mid-chest down to mid-thigh, no face in "
  "frame. An athletic Southeast Asian man stands relaxed against a plain dark wall. He holds "
  "the hem of a plain dark t-shirt lifted up to his ribs with one hand. His dark trousers are "
  "worn LOW on the hips, well below the navel. ABOVE the trouser waistband, a wide flat matte "
  "black elastic underwear waistband is fully and unmistakably visible as a clear horizontal "
  "band roughly four centimetres tall spanning the whole width of his hips. The underwear "
  "waistband is completely blank and unbranded. The gap between skin, underwear waistband and "
  "trouser band must be obvious and clearly separated. " + LOOK),
 ("commute","16:9",
  "Cinematic black and white photograph of an athletic Southeast Asian man in his early "
  "thirties walking briskly along a city pavement, shot from the side with slight motion blur "
  "in the background. He wears a plain dark shirt and trousers and carries a plain shoulder "
  "bag. Hard midday sun rakes across him, strong cast shadows on the pavement, background "
  "buildings falling into deep shadow. Documentary street feel. " + LOOK),
 ("stretch","16:9",
  "Close-up black and white photograph of two male hands pulling a piece of black modal knit "
  "fabric taut between them, the knit visibly stretching and the fine ribbed structure opening "
  "under tension. Hands enter from left and right, cropped at the wrists. Plain near-black "
  "background. Hard raking light from the left across the stretched fabric. " + LOOK),
 ("drawer","16:9",
  "Overhead black and white photograph looking straight down into an open wooden drawer "
  "containing neatly folded plain black underwear arranged in tidy rows, all identical and "
  "unbranded, plus one folded white undershirt at the edge. Clean, ordered, minimal. Hard "
  "light from the left, deep shadow in the drawer corners. " + LOOK),
 ("heat","4:5",
  "Cinematic black and white photograph, an athletic Southeast Asian man standing outdoors in "
  "humid tropical afternoon heat, shot from behind and slightly to the side, cropped at the "
  "shoulders and head. Damp skin at the back of his neck catching hard low sun, plain dark "
  "t-shirt clinging slightly at the shoulder blades. Blurred tropical foliage in deep shadow "
  "behind. Oppressive heat, tangible humidity. " + LOOK),
 ("fold","1:1",
  "Overhead black and white product photograph of a single pair of plain black boxer briefs "
  "folded crisply into a neat rectangle, centred on a plain matte charcoal surface. The wide "
  "flat elastic waistband is visible along the top edge of the fold, completely blank and "
  "unbranded. Hard raking light from the left revealing the knit texture, a soft shadow to the "
  "right. Nothing else in frame. " + LOOK),
]
out=json.load(open("tasks.json"))
for name,ar,prompt in JOBS:
    body=json.dumps({"model":"nano-banana-2","input":{
        "prompt":prompt,"aspect_ratio":ar,"resolution":"2K","output_format":"png"}}).encode()
    r=urllib.request.Request("https://api.kie.ai/api/v1/jobs/createTask", data=body,
        headers={"Authorization":"Bearer "+K,"Content-Type":"application/json"})
    res=json.load(urllib.request.urlopen(r,timeout=120))
    print(f"{name:12s} {res.get('code')}  {res.get('data',{}).get('taskId')}")
    if res.get("code")==200: out[name]=res["data"]["taskId"]
json.dump(out, open("tasks.json","w"))
