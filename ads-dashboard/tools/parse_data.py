#!/usr/bin/env python3
"""Parse Google Sheet CSV exports into structured JSON for the ads dashboard."""
import csv, json, re, sys

BASE = '/tmp/claude-0/-home-user-Dom-Manipulation/ca5f51ab-0e5a-5153-af60-f6be86b6c17f/scratchpad'

def num(v):
    if v is None: return None
    v = str(v).strip()
    if v in ('', '-', '#DIV/0!', '#REF!', '#N/A', '#VALUE!'): return None
    neg = v.startswith('-') or (v.startswith('(') and v.endswith(')'))
    v = v.replace('Rp', '').replace('(', '').replace(')', '').replace('%', '').replace(',', '').replace(' ', '')
    if v in ('', '-'): return None
    try:
        n = float(v)
        return -abs(n) if neg and n > 0 else n
    except ValueError:
        return None

def read_rows(path):
    with open(path, newline='', encoding='utf-8-sig') as f:
        return list(csv.reader(f))

# ---------- July 26 daily blocks ----------
# Block detection: a "Product Type,Budget,..." header row; title from 1-3 rows above;
# tracker header row with "1 Jul" follows; metric rows until blank col0.
RAW_METRICS = {
    'Ads Cost': 'cost', 'Ads Cost F': 'cost', 'Ads Cost K': 'cost', 'Ads Cost Q': 'cost', 'Ads Cost AA': 'cost',
    'Purchases Conversion Value': 'gmv', 'Purchases Conversion Value O': 'gmv',
    'Purchases Conversion Value P': 'gmv', 'Purchases Conversion Value Y': 'gmv',
    'Orders From Ads': 'orders', 'Orders From Ads M': 'orders', 'Orders From Ads N': 'orders',
    'Orders From Ads O': 'orders', 'Orders From Ads Q': 'orders',
    'Orders From MKP': 'ordersMkp',
    'Impression': 'impressions', 'Impression Q': 'impressions', 'Impressions': 'impressions',
    'Impression I': 'impressions', 'Impression J': 'impressions', 'Impression K': 'impressions',
    'Impression N': 'impressions',
    'Product Clicks': 'clicks', 'Product Clicks R': 'clicks', 'Product Clicks O': 'clicks',
    'Live Views': 'liveViews', 'Live Views M': 'liveViews',
    'Reach': 'reach', 'Reach H': 'reach', 'Paid Follows': 'follows',
    'Link Click': 'clicks', 'Link Clicks N': 'clicks', 'Click N': 'clicks',
    'Add to Cart Q': 'atc', 'Add to Cart Value R': 'atcValue',
    'Consideration Size M': 'consideration', 'Brand Consideration': 'consideration',
    'Cancel Order': 'cancel',
}

# title -> (platform, channelId, channelName, objective)
BLOCK_MAP = [
    ('LIVE SHOPPING ADS SMO',        ('tiktok', 'tt_live_smo',  'Live Streaming SMO',        'sales')),
    ('LIVE SHOPPING ADS SID',        ('tiktok', 'tt_live_sid',  'Live Streaming SID',        'sales')),
    ('LIVE SHOPPING ADS SMV',        ('tiktok', 'tt_live_smv',  'Live Streaming SMV',        'sales')),
    ('LIVE SHOPPING ADS Aff',        ('tiktok', 'tt_live_aff',  'Live Streaming Affiliate',  'sales')),
    ('VIDEO SHOPPING ADS NS',        ('tiktok', 'tt_vsa_ns',    'Video Shopping Ads NS',     'sales')),
    ('VIDEO SHOPPING ADS',           ('tiktok', 'tt_vsa',       'Video Shopping Ads',        'sales')),
    ('Product Card Shopping NS',     ('tiktok', 'tt_psa_ns',    'Product Card NS',           'sales')),
    ('Product Card Shopping Ads',    ('tiktok', 'tt_psa',       'Product Card Shopping Ads', 'sales')),
    ('OVERALL TIKTOK SHOP ADS',      None),  # computed, skip
    ('Community Interaction Sophie Martin Verse', ('tiktok', 'tt_ci_smv', 'Community Interaction SMV', 'upper')),
    ('Community Interaction Sophie Martin ID',    ('tiktok', 'tt_ci_sid', 'Community Interaction SID', 'upper')),
    ('Brand Consideration EXT',      ('tiktok', 'tt_bc_ext',    'Brand Consideration',       'upper')),
    ('Brand Consideration NS',       ('tiktok', 'tt_bc_ns',     'Brand Consideration NS',    'upper')),
    ('Awareness TikTok Ext',         ('tiktok', 'tt_aw_ext',    'Awareness TikTok',          'upper')),
    ('Awareness TikTok Affiliate',   ('tiktok', 'tt_aw_aff',    'Awareness Affiliate',       'upper')),
    ('Meta CPAS - Shopee',           ('meta',   'meta_cpas',    'CPAS Sales',                'sales')),
    ('Awareness CPAS',               ('meta',   'meta_aw',      'Awareness CPAS',            'upper')),
    ('Traffic CPAS',                 ('meta',   'meta_traffic', 'Traffic CPAS',              'upper')),
    ('LIVE SHOPEE ADS',              ('shopee', 'sp_live',      'Live Shopee Ads (LSA)',     'sales')),
    ('SBA Shopee',                   ('shopee', 'sp_sba',       'Search Brand Ads (Banner)', 'sales')),
    ('Ads Store',                    ('shopee', 'sp_store',     'Iklan Toko',                'sales')),
    ('Overall Shopee Ads',           None),
    ('Lazada Ads Sponsore Max Store',  ('lazada', 'lz_store',   'Sponsored Max Store',       'sales')),
    ('Lazada Ads Sponsore Max Product',('lazada', 'lz_product', 'Sponsored Max Product',     'sales')),
]

def parse_july(rows):
    channels = []
    pc_shopee_count = 0
    i = 0
    n = len(rows)
    while i < n:
        row = rows[i]
        if row and row[0].strip() == 'Product Type' and len(row) > 1 and row[1].strip() == 'Budget':
            # find title: scan up to 3 rows above for first non-empty col0
            cands = []
            for k in range(1, 4):
                if i - k >= 0 and rows[i-k] and rows[i-k][0].strip():
                    cands.append(rows[i-k][0].strip())
            def is_known(t):
                return t == 'Product Card Shopee' or any(t.startswith(b) for b, _ in BLOCK_MAP)
            known = [t for t in cands if is_known(t)]
            title = known[0] if known else (cands[-1] if cands else None)
            subtitle = cands[0] if cands and cands[0] != title else None
            # budget row
            budget = spent = None
            if i+1 < n:
                budget = num(rows[i+1][1] if len(rows[i+1]) > 1 else None)
                spent = num(rows[i+1][2] if len(rows[i+1]) > 2 else None)
            # tracker header
            j = i + 2
            while j < n and not (rows[j] and len(rows[j]) > 1 and rows[j][1].strip() == '1 Jul'):
                j += 1
                if j > i + 4: break
            metrics = {}
            if j < n and rows[j] and len(rows[j]) > 1 and rows[j][1].strip() == '1 Jul':
                j += 1
                while j < n and rows[j] and rows[j][0].strip():
                    name = rows[j][0].strip()
                    if name in RAW_METRICS:
                        key = RAW_METRICS[name]
                        vals = [num(rows[j][c]) if c < len(rows[j]) else None for c in range(1, 32)]
                        if key not in metrics:
                            metrics[key] = vals
                    j += 1
            # map title
            mapped = 'UNMAPPED'
            if title:
                if title == 'Product Card Shopee':
                    pc_shopee_count += 1
                    mapped = ('shopee', 'sp_pc', 'Iklan Produk', 'sales') if pc_shopee_count == 1 \
                        else ('shopee', 'sp_pc_new', 'Iklan Produk Baru', 'sales')
                else:
                    for t, m in BLOCK_MAP:
                        if title.startswith(t):
                            mapped = m
                            break
            if mapped == 'UNMAPPED':
                print(f'  !! unmapped block: {title!r} (sub {subtitle!r}) at row {i}', file=sys.stderr)
            elif mapped is not None:
                platform, cid, cname, obj = mapped
                channels.append({
                    'id': cid, 'platform': platform, 'name': cname, 'objective': obj,
                    'budget': budget, 'title': title, 'days': metrics,
                })
            i = j
        else:
            i += 1
    return channels

# ---------- MoM 26 monthly ----------
def parse_mom(rows):
    out = {}
    for row in rows:
        if not row or not row[0].strip(): continue
        name = row[0].strip()
        vals = [num(row[c]) if c < len(row) else None for c in range(1, 13)]
        if any(v is not None for v in vals):
            out.setdefault(name, vals)
    return out

# ---------- MoM Breakdown per platform ----------
def parse_breakdown(rows):
    out = {}
    current = None
    for row in rows[2:]:
        if not row: continue
        p = row[0].strip()
        if p:
            current = p
            out.setdefault(current, {})
        if current and len(row) > 1 and row[1].strip():
            name = row[1].strip()
            vals = [num(row[c]) if c < len(row) else None for c in range(2, 14)]
            if any(v is not None for v in vals):
                out[current].setdefault(name, vals)
    return out

july_rows = read_rows(f'{BASE}/tab_July26.csv')
channels = parse_july(july_rows)

# ---------- Merge Meta raw xlsx (sheet July masih kosong utk Meta) ----------
import openpyxl
UP = '/root/.claude/uploads/ca5f51ab-0e5a-5153-af60-f6be86b6c17f'

def load_xlsx_rows(path):
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    ws = wb.worksheets[0]
    rows = list(ws.iter_rows(values_only=True))
    header = [str(h).strip() if h else '' for h in rows[0]]
    return header, rows[1:]

def day_of_july(datestr):
    s = str(datestr)[:10]
    if s.startswith('2026-07-'):
        try: return int(s[8:10])
        except ValueError: return None
    return None

def merge_meta(ch_id, path, colmap):
    ch = next((c for c in channels if c['id'] == ch_id), None)
    if ch is None: return
    header, rows = load_xlsx_rows(path)
    idx = {name: header.index(col) for name, col in colmap.items() if col in header}
    daycol = header.index('Day')
    acc = {k: [0.0]*31 for k in idx}
    seen = False
    for r in rows:
        d = day_of_july(r[daycol])
        if d is None: continue
        seen = True
        for k, ci in idx.items():
            v = r[ci]
            if isinstance(v, (int, float)):
                acc[k][d-1] += float(v)
    if not seen: return
    for k, arr in acc.items():
        arr = [round(v, 2) if v else 0 for v in arr]
        existing = ch['days'].get(k)
        if not existing or not any(existing):
            ch['days'][k] = arr
    ch['mergedFromRaw'] = True

merge_meta('meta_cpas', f'{UP}/d5a5c6e7-RAW_META_SALES.xlsx', {
    'cost': 'Amount spent (IDR)', 'gmv': 'Purchases conversion value for shared items only',
    'orders': 'Purchases with shared items', 'clicks': 'Link clicks',
    'reach': 'Reach', 'impressions': 'Impressions',
    'atc': 'Adds to cart with shared items', 'atcValue': 'Adds to cart conversion value for shared items only',
})
merge_meta('meta_aw', f'{UP}/7fd97624-RAW_META__AWARENESS.xlsx', {
    'cost': 'Amount spent (IDR)', 'reach': 'Reach', 'impressions': 'Impressions', 'clicks': 'Link clicks',
})
mom = parse_mom(read_rows(f'{BASE}/tab_MoM26.csv'))
breakdown = parse_breakdown(read_rows(f'{BASE}/tab_MoMBreakdown26.csv'))

data = {
    'meta': {
        'store': 'Sophie Martin Official',
        'month': 'Juli 2026', 'monthIndex': 6, 'year': 2026, 'daysInMonth': 31,
        'generated': '2026-07-14',
        'source': 'Google Sheet: Media Buying Database 2026',
    },
    'channels': channels,
    'monthly': mom,
    'breakdown': breakdown,
}

with open(f'{BASE}/dashboard_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False)

# report
print(f'channels: {len(channels)}')
for c in channels:
    tot_cost = sum(v for v in c['days'].get('cost', []) if v) if 'cost' in c['days'] else 0
    tot_gmv = sum(v for v in c['days'].get('gmv', []) if v) if 'gmv' in c['days'] else 0
    dlast = 0
    for idx, v in enumerate(c['days'].get('cost', [])):
        if v: dlast = idx + 1
    print(f"  {c['platform']:7s} {c['id']:14s} {c['name']:28s} budget={c['budget']} cost={tot_cost:,.0f} gmv={tot_gmv:,.0f} lastDay={dlast} metrics={list(c['days'].keys())}")
print('monthly keys:', len(mom))
print('breakdown platforms:', list(breakdown.keys()))
import os
print('json size:', os.path.getsize(f'{BASE}/dashboard_data.json'))
