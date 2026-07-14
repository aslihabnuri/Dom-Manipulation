#!/usr/bin/env python3
"""Parse full workbook (2025 + 2026 monthly sheets + MoM tabs) into dashboard JSON v3."""
import json, warnings, calendar, datetime, os
import openpyxl
warnings.filterwarnings('ignore')

BASE = '/tmp/claude-0/-home-user-Dom-Manipulation/ca5f51ab-0e5a-5153-af60-f6be86b6c17f/scratchpad'
wb = openpyxl.load_workbook(f'{BASE}/workbook.xlsx', read_only=True, data_only=True)

MONTH_SHEETS = {
    '2025-01':'Januari','2025-02':'Februari','2025-03':'Maret','2025-04':'April',
    '2025-05':'May','2025-06':'June','2025-07':'July','2025-08':'August',
    '2025-09':'September','2025-10':'Oktober','2025-11':'November','2025-12':'Desember',
    '2026-01':'Januari 26','2026-02':'February 26','2026-03':'March 26','2026-04':'April 26',
    '2026-05':'May 26','2026-06':'June 26','2026-07':'July 26',
}
MON_ABBR = {'jan':1,'feb':2,'mar':3,'apr':4,'mei':4.5,'may':5,'jun':6,'jul':7,'agu':8,'aug':8,'sep':9,'okt':10,'oct':10,'nov':11,'des':12,'dec':12}

RAW_METRICS = {}
for base, key in [
    ('Ads Cost','cost'),('Purchases Conversion Value','gmv'),('Orders From Ads','orders'),
    ('Orders','orders'),
    ('Orders From MKP','ordersMkp'),('Impression','impressions'),('Impressions','impressions'),
    ('Product Clicks','clicks'),('Live Views','liveViews'),('Reach','reach'),
    ('Paid Follows','follows'),('Link Click','clicks'),('Link Clicks','clicks'),('Click','clicks'),
    ('Add to Cart','atc'),('Add to Cart Value','atcValue'),
    # Consideration Size dihitung sebagai Product Clicks (permintaan user) agar
    # masuk ke total Product Clicks di Ringkasan
    ('Consideration Size','clicks'),('Brand Consideration','clicks'),
    ('Cancel Order','cancel'),
]:
    RAW_METRICS[base]=key
    for suf in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
        RAW_METRICS[f'{base} {suf}']=key
        RAW_METRICS[f'{base} A{suf}']=key

# (title, id, platform, name, objective) — longest-prefix wins
BLOCKS = [
    ('LIVE SHOPPING ADS SMO','tt_live_smo','tiktok','Live GMV Max SMO','sales'),
    ('LIVE SHOPPING ADS SID','tt_live_sid','tiktok','Live GMV Max SID','sales'),
    ('LIVE SHOPPING ADS SMV','tt_live_smv','tiktok','Live GMV Max SMV','sales'),
    ('LIVE SHOPPING ADS Aff','tt_live_aff','tiktok','Live GMV Max Affiliate','sales'),
    ('LIVE SHOPPING ADS','tt_live_all','tiktok','Live GMV Max (gabungan)','sales'),
    ('VIDEO SHOPPING ADS + PRODUCT SHOPPING ADS','tt_vsa_psa','tiktok','VSA + PSA (gabungan)','sales'),
    ('VIDEO SHOPPING ADS NS','tt_vsa_ns','tiktok','Video Shopping Ads NS','sales'),
    ('VIDEO SHOPPING ADS','tt_vsa','tiktok','Video Shopping Ads','sales'),
    ('Product Card Shopping NS','tt_psa_ns','tiktok','Product Card NS','sales'),
    ('Product Card Shopping Ads','tt_psa','tiktok','Product Card Shopping Ads','sales'),
    ('OVERALL TIKTOK SHOP ADS',None,None,None,None),
    ('Community Interaction Sophie Martin Verse','tt_ci_smv','tiktok','Community Interaction SMV','upper'),
    ('Community Interaction Sophie Martin Official','tt_ci_smo','tiktok','Community Interaction SMO','upper'),
    ('Community Interaction Sophie Martin ID','tt_ci_sid','tiktok','Community Interaction SID','upper'),
    ('Brand Consideration EXT','tt_bc_ext','tiktok','Brand Consideration','upper'),
    ('Brand Consideration NS','tt_bc_ns','tiktok','Brand Consideration NS','upper'),
    ('Awareness TikTok Ext','tt_aw_ext','tiktok','Awareness TikTok','upper'),
    ('Awareness TikTok Affiliate','tt_aw_aff','tiktok','Awareness Affiliate','upper'),
    ('Awareness TikTok','tt_aw_ext','tiktok','Awareness TikTok','upper'),
    ('Brand Consideration','tt_bc_ext','tiktok','Brand Consideration','upper'),
    ('Community Interaction','tt_ci_smo','tiktok','Community Interaction SMO','upper'),
    ('Meta CPAS - Shopee','meta_cpas','meta','Meta CPAS (Sales)','sales'),
    ('Awareness CPAS','meta_aw','meta','Awareness — Meta Reguler','upper'),
    ('Traffic CPAS','meta_traffic','meta','Traffic — Meta Reguler','upper'),
    ('LIVE SHOPEE ADS','sp_live','shopee','Live Shopee Ads (LSA)','sales'),
    ('SBA Shopee','sp_sba','shopee','Search Brand Ads (Banner)','sales'),
    ('Ads Store','sp_store','shopee','Iklan Toko','sales'),
    ('Overall Shopee Ads',None,None,None,None),
    ('Lazada Ads Sponsore Max Store','lz_store','lazada','Sponsored Max Store','sales'),
    ('Lazada Ads Sponsore Max Product','lz_product','lazada','Sponsored Max Product','sales'),
]
BLOCKS.sort(key=lambda b:-len(b[0]))
CH_META = {}   # id -> {platform,name,objective}

def match_block(title, pc_count):
    if title == 'Product Card Shopee':
        return ('sp_pc','shopee','Iklan Produk','sales') if pc_count==0 else ('sp_pc_new','shopee','Iklan Produk Baru','sales')
    for t,cid,plat,name,obj in BLOCKS:
        if title.startswith(t):
            return None if cid is None else (cid,plat,name,obj)
    return 'UNKNOWN'

def day_from_header(v, year, month):
    if isinstance(v, datetime.datetime) or isinstance(v, datetime.date):
        if v.year==year and v.month==month: return v.day
        return None
    s=str(v or '').strip()
    if not s: return None
    parts=s.split()
    if len(parts)==2 and parts[0].isdigit():
        return int(parts[0])
    return None

def is_known_title(t):
    return t=='Product Card Shopee' or any(t.startswith(b[0]) for b in BLOCKS)

def parse_month_sheet(mk):
    year, month = int(mk[:4]), int(mk[5:7])
    ndays = calendar.monthrange(year, month)[1]
    ws = wb[MONTH_SHEETS[mk]]
    rows = [list(r) for r in ws.iter_rows(values_only=True)]
    series, budgets = {}, {}
    pc_count = 0
    i = 0
    while i < len(rows):
        r = rows[i]
        c0 = str(r[0]).strip() if r and r[0] is not None else ''
        c1 = str(r[1]).strip() if r and len(r)>1 and r[1] is not None else ''
        if c0=='Product Type' and c1=='Budget':
            cands=[]
            for k in range(1,4):
                if i-k>=0 and rows[i-k] and rows[i-k][0] is not None and str(rows[i-k][0]).strip():
                    cands.append(str(rows[i-k][0]).strip())
            known=[t for t in cands if is_known_title(t)]
            title = known[0] if known else (cands[-1] if cands else '')
            m = match_block(title, pc_count)
            if title=='Product Card Shopee': pc_count+=1
            budget=None
            if i+1<len(rows) and len(rows[i+1])>1 and isinstance(rows[i+1][1],(int,float)):
                budget=float(rows[i+1][1])
            # tracker header
            j=i+2; daycols=None
            while j<len(rows) and j<i+6:
                hdr=rows[j]
                cols=[]
                for c in range(1, min(len(hdr), 40)):
                    d=day_from_header(hdr[c], year, month)
                    if d and 1<=d<=ndays: cols.append((c,d))
                if len(cols)>=20 or (len(cols)>=ndays-4 and len(cols)>10):
                    daycols=cols; break
                j+=1
            if daycols and m not in (None,'UNKNOWN'):
                cid,plat,name,obj = m
                CH_META.setdefault(cid, {'platform':plat,'name':name,'objective':obj})
                ser = series.setdefault(cid, {})
                if budget: budgets[cid]=budget
                j+=1
                while j<len(rows):
                    r2=rows[j]
                    label=str(r2[0]).strip() if r2 and r2[0] is not None else ''
                    if not label: break
                    key=RAW_METRICS.get(label)
                    if key and key not in ser:
                        arr=[0]*ndays
                        any_val=False
                        for c,d in daycols:
                            v=r2[c] if c<len(r2) else None
                            if isinstance(v,(int,float)):
                                arr[d-1]=round(float(v),2)
                                if v: any_val=True
                        if any_val: ser[key]=arr
                    j+=1
                i=j
                continue
            elif m=='UNKNOWN' and title:
                print(f'  ?? {mk}: unmapped block {title!r}')
            i=j if daycols else i+1
            continue
        i+=1
    # buang channel tanpa nilai sama sekali
    series={k:v for k,v in series.items() if v}
    return {'days':ndays,'budgets':budgets,'series':series}

months={}
for mk in MONTH_SHEETS:
    months[mk]=parse_month_sheet(mk)
    ns=len(months[mk]['series'])
    tot=sum(sum(a) for ch in months[mk]['series'].values() for kk,a in ch.items() if kk=='cost')
    print(f'{mk}: {ns:2d} channel, cost={tot:,.0f}')

# CATATAN AUDIT (poin 5): data dasar = 100% dari Google Sheet.
# TIDAK ada lagi auto-merge file raw Meta — data Meta Juli dimasukkan user
# sendiri lewat tab Upload agar total selalu cocok dengan sheet (single source of truth).

# Channel Meta Reguler (direct to website) — belum ada di sheet, disiapkan
# sebagai tujuan upload "Meta Reguler" (metrik sama dengan CPAS).
CH_META.setdefault('meta_reg', {'platform':'meta','name':'Meta Reguler (Sales)','objective':'sales'})

# ---------- MoM tabs ----------
PCT_ROWS={'Ads Efficiency Rate','CTOR','CTR','New consideration rate'}
MONTH_NAMES={'januari':1,'january':1,'februari':2,'february':2,'maret':3,'march':3,'april':4,
 'mei':5,'may':5,'juni':6,'june':6,'juli':7,'july':7,'agustus':8,'august':8,
 'september':9,'oktober':10,'october':10,'november':11,'desember':12,'december':12}
def parse_mom_sheet(name):
    ws=wb[name]
    rows=[list(r) for r in ws.iter_rows(values_only=True)]
    # deteksi kolom bulan: baris dengan >=6 nama bulan (MoM 2025 punya kolom delta di sela-sela)
    monthcols=None
    for row in rows[:8]:
        cols=[]
        for c,v in enumerate(row):
            m=MONTH_NAMES.get(str(v).strip().lower()) if v is not None else None
            if m: cols.append((c,m))
        if len(cols)>=6: monthcols=cols; break
    if not monthcols: monthcols=[(c,c) for c in range(1,13)]
    out={}
    for row in rows:
        if not row or row[0] is None: continue
        label=str(row[0]).strip()
        if not label: continue
        vals=[None]*12
        for c,m in monthcols:
            v=row[c] if c<len(row) else None
            if isinstance(v,(int,float)): vals[m-1]=round(float(v),4)
        if any(v is not None for v in vals) and label not in out:
            if label in PCT_ROWS or label.startswith('%'):
                vals=[(round(v*100,2) if v is not None and abs(v)<=1.5 else v) for v in vals]
            out[label]=vals
    return out

mom={'2026':parse_mom_sheet('MoM 26'),'2025':parse_mom_sheet('MoM')}

data={
 'meta':{'store':'Sophie Martin Official','generated':'2026-07-14',
   'defaultMonth':'2026-07','source':'Google Sheet: Media Buying Database 2025–2026'},
 'channels':[{'id':cid,**CH_META[cid]} for cid in CH_META],
 'months':months,
 'mom':mom,
}
out=json.dumps(data,ensure_ascii=False,separators=(',',':'))
open(f'{BASE}/dashboard_data_v3.json','w').write(out)
print('channels:',len(CH_META))
print('json size:',len(out))
