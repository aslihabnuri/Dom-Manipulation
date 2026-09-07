import json, os, time, urllib.request, subprocess
KEY=os.environ["KIE_KEY"]
SEL="Documentary photograph in black and white with selective color: only the AirAsia aircraft keeps its real bright red livery with white 'airasia' lettering on the fuselage, everything else is monochrome. No other text or logos. "
CUT=" The entire subject is fully visible and centered with margin, isolated on a flat uniform pure bright green chroma key background (#00FF00), no shadow on the background."
P={
 "aa_a320": SEL+"An AirAsia Airbus A320 narrow body jet in flight, side view, nose slightly up, landing gear retracted."+CUT,
 "aa_a330": SEL+"An AirAsia X Airbus A330 wide body jet in flight, front three quarter view."+CUT,
 "aa_pair": SEL+"A small AirAsia Airbus A320 parked beside a much larger AirAsia X Airbus A330, both in red livery, side view on the apron, showing the size difference."+CUT,
 "aa_captain": "Black and white documentary portrait with selective color: an airline captain wearing an AirAsia red uniform jacket and cap, half length, looking to the side; only the red uniform is in color."+CUT,
 "aa_crew": "Black and white documentary photograph with selective color: five AirAsia cabin crew in bright red uniforms standing in a confident row, full length; only the red uniforms are in color."+CUT,
 "aa_fleet": SEL+"A long row of AirAsia red aircraft parked at a low cost carrier terminal seen from a slightly elevated wide angle, morning light.",
 "aa_fuel": SEL+"A fuel tanker truck refueling an AirAsia A320 on the apron, a worker holding the hose, close view.",
 "aa_turnaround": SEL+"Ground crew rushing to load bags into an AirAsia A320 at the gate during a quick turnaround, baggage carts and a stairs truck, busy scene.",
 "aa_london": SEL+"An AirAsia X Airbus A330 landing low over the London skyline with Big Ben and the Thames, dusk.",
 "aa_board": "Black and white documentary photograph: airline executives in a boardroom debating around a long table, a large world route map on the wall behind them, no text visible.",
 "aa_tower": SEL+"An airport air traffic control tower with an AirAsia A320 taxiing past in the foreground.",
 "aa_transfer": SEL+"Ground crew moving luggage carts from a small AirAsia A320 toward a large AirAsia X A330 parked nose to nose on the apron.",
}
def api(p, body=None):
    req=urllib.request.Request("https://api.kie.ai/api/v1"+p, data=json.dumps(body).encode() if body else None, headers={"Authorization":"Bearer "+KEY,"Content-Type":"application/json"}, method="POST" if body else "GET")
    return json.load(urllib.request.urlopen(req, timeout=60))
tasks={}
for n,s in P.items():
    if os.path.exists(f"img/{n}_raw.png"): continue
    tasks[n]=api("/jobs/createTask",{"model":"google/nano-banana","input":{"prompt":s,"image_size":"16:9","output_format":"png"}})["data"]["taskId"]; print("submitted",n,flush=True); time.sleep(1.5)
while tasks:
    time.sleep(8)
    for n,t in list(tasks.items()):
        d=api("/jobs/recordInfo?taskId="+t)["data"]
        if d["state"]=="success":
            subprocess.run(["curl","-sS","-m","120","-o",f"img/{n}_raw.png",json.loads(d["resultJson"])["resultUrls"][0]],check=True); print("done",n,flush=True); del tasks[n]
        elif d["state"]=="fail": print("FAIL",n,d.get("failMsg")); del tasks[n]
print("credits left:",api("/chat/credit")["data"])
