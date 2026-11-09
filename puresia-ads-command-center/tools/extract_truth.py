import sys, json, re, datetime, openpyxl
wb=openpyxl.load_workbook(sys.argv[1], data_only=True, read_only=True)
out_dir=sys.argv[2]
MON={'jan':1,'feb':2,'mar':3,'apr':4,'may':5,'mei':5,'jun':6,'jul':7,'aug':8,'agu':8,'sep':9,'oct':10,'okt':10,'nov':11,'dec':12,'des':12,
     'januari':1,'january':1,'februari':2,'february':2,'maret':3,'march':3,'april':4,'june':6,'juni':6,'july':7,'juli':7,'august':8,'agustus':8,'september':9,'october':10,'oktober':10,'november':11,'december':12,'desember':12}
def rows_of(name):
    ws=wb[name]
    try: ws.reset_dimensions()
    except Exception: pass
    R=[]
    for r in ws.iter_rows(values_only=True):
        R.append(list(r))
    return R
def num(v):
    if v is None: return None
    if isinstance(v,(int,float)): return float(v)
    s=str(v).strip().replace('Rp','').replace(' ','')
    if not s or s.startswith('#'): return None
    pct=s.endswith('%'); s=s.rstrip('%').replace(',','')
    try: f=float(s)
    except: return None
    return f
def s(v): return '' if v is None else str(v).strip()
# ---- rekap (MoM 2025 / MoM 26): pilih kolom 'Value' saja
def recap(name):
    R=rows_of(name)
    hdr=None
    for i in range(min(6,len(R))):
        lab=s(R[i][0])
        if lab in('Metrics','Month'):
            hdr=i;break
    months=[]  # (colidx, monthnum)
    sub=R[hdr+1] if hdr+1<len(R) else []
    last=None
    for j,x in enumerate(R[hdr]):
        m=MON.get(s(x).lower().replace(' ','')) if s(x) else None
        if m: last=(j,m)
        # kolom merged: sel kosong setelah nama bulan masih bulan yang sama
        if m is None and last and j==last[0]+1 and s(x)=='' and 'growth' in s(sub[j] if j<len(sub) else '').lower():
            continue
        if m and 'growth' not in s(sub[j] if j<len(sub) else '').lower():
            months.append((j,m))
    data={}
    for r in R[hdr+1:]:
        lab=s(r[0])
        if not lab or lab in('Value','Metrics','Month'): continue
        arr=[None]*12; any_=False
        for j,m in months:
            v=num(r[j]) if j<len(r) else None
            if v is not None: arr[m-1]=v; any_=True
        if any_ and lab not in data: data[lab]=arr
    return data, [(j,m) for j,m in months]
mom25,cols25=recap('MoM'); mom26,cols26=recap('MoM 26')
print('MoM 2025 kolom bulan:',cols25)
print('MoM 2026 kolom bulan:',cols26)
json.dump({'2025':mom25,'2026':mom26},open(f'{out_dir}/mom_truth.json','w'))
for k in ['GMV by Video','GMV by Product Card','GMV by Live Stream','GMV by Meta CPAS','Total GMV From Ads','TikTok Ads Cost','Total Orders From Ads','Meta Ads Cost','Meta']:
    if k in mom25: print(f"  2025 {k:26s}", [None if v is None else round(v) for v in mom25[k]])
# ---- tab harian: seksi + total metrik
DAILY=['April','May','June','July','August','September','September-New','Oktober','November','December',
       'Januari - 26','Januari - 26 Copy','February - 26','March - 26','April - 26','May - 26','June - 26','July - 26']
METRIC={'ads cost':'cost','purchases conversion value':'gmv','orders':'orders','orders from ads':'orders','live views':'liveViews','product clicks':'clicks','cancel order':'cancel','impression':'impressions','impressions':'impressions','reach':'reach'}
tabs={}
for name in DAILY:
    if name not in wb.sheetnames: continue
    R=rows_of(name)
    secs=[]; title=''; sub=''; budget=None; i=0
    while i<len(R):
        r=R[i]; cells=[s(c) for c in r]; li=next((k for k,c in enumerate(cells) if c),-1)
        if li<0: i+=1; continue
        lab=cells[li]; rest=[c for c in cells[li+1:] if c]
        if lab=='Product Type':
            if rest and rest[0]=='Budget': 
                nxt=R[i+1] if i+1<len(R) else []
                budget=num(nxt[li+1]) if li+1<len(nxt) else None
            i+=1; continue
        if re.search(r'tracker$',lab,re.I):
            # kolom hari
            daycols=[]; month=None
            for j in range(li+1,len(r)):
                v=r[j]
                if isinstance(v,(datetime.datetime,datetime.date)): daycols.append((j,v.day)); month=month or v.month
                else:
                    mm=re.match(r'^(\d{1,2})\s+([A-Za-z]+)',s(v))
                    if mm and MON.get(mm.group(2).lower()): daycols.append((j,int(mm.group(1)))); month=month or MON[mm.group(2).lower()]
            sec={'title':title,'sub':sub,'budget':budget,'month':month,'ndays':len(daycols),'tot':{}}
            j=i+1
            while j<len(R):
                rc=[s(c) for c in R[j]]; rli=next((k for k,c in enumerate(rc) if c),-1)
                if rli<0: j+=1; continue
                rl=rc[rli]
                if rl=='Product Type' or re.search(r'tracker$',rl,re.I): break
                key=METRIC.get(rl.lower())
                hasnum=any(num(R[j][k]) is not None for k,_ in daycols)
                if not key and not hasnum: break
                if key:
                    sec['tot'][key]=round(sum((num(R[j][k]) or 0) for k,_ in daycols))
                j+=1
            if sec['tot']: secs.append(sec)
            title='';sub='';budget=None
            i=j; continue
        if not rest or all(x.startswith('[') for x in rest):
            if re.search(r'LIVE SHOPPING|VIDEO SHOPPING|COMMUNITY|OVERALL|Monthly|PRODUCT CARD',lab,re.I): title=lab; sub=''
            elif not title: title=lab
            elif not sub: sub=lab
        elif re.match(r'^(LSA|Live|Video|SBA)',lab,re.I) and len(rest)<=1 and num(rest[0] if rest else None) is None:
            sub=lab
        i+=1
    tabs[name]=secs
    print(f"\n## TAB {name!r}")
    for sc in secs:
        print(f"   bulan={sc['month']} hari={sc['ndays']:2d} budget={sc['budget']} | {sc['title'][:34]!r} / {sc['sub'][:14]!r} | " + ' '.join(f"{k}={v:,}" for k,v in sc['tot'].items() if k in('cost','gmv','orders','clicks')))
json.dump(tabs,open(f'{out_dir}/tabs_truth.json','w'))
# ---- Budget sheet: baris channel x bulan (biaya harian)
R=rows_of('Budget')
print('\n## BUDGET sheet: baris & total per bulan')
cur_dates=None; agg={}
for r in R:
    cells=[s(c) for c in r]
    if cells and cells[0]=='Date':
        cur_dates=[(j,v) for j,v in enumerate(r) if isinstance(v,(datetime.datetime,datetime.date))]
        continue
    if cur_dates and cells and cells[0] and cells[0] not in('Product Type',):
        name=cells[0]
        for j,dt in cur_dates:
            v=num(r[j]) if j<len(r) else None
            if v: agg.setdefault(name,{}).setdefault(f"{dt.year}-{dt.month:02d}",0); agg[name][f"{dt.year}-{dt.month:02d}"]+=v
for name,mm in agg.items():
    print(f"   {name[:40]:40s}", {k:round(v) for k,v in sorted(mm.items())})
json.dump(agg,open(f'{out_dir}/budget_truth.json','w'))
