import json, re, sys

src = open('brunbrun_inner.html').read()
# buang duplikat penutup wrapper di ekor ("</body></html>" kedua)
src = re.sub(r'</body>\s*</html>\s*</body></html>\s*$', '</body>\n</html>\n', src)

edits = []
def rep(old, new, count=1, name=''):
    global src
    n = src.count(old)
    assert n == count, f"[{name or old[:60]}] expected {count} occurrence(s), found {n}"
    src = src.replace(old, new)
    edits.append(name or old[:50])

# ---------- 1. BASE_DATA ----------
parsed = json.load(open('puresia_final.json'))
mom = parsed['mom']
for y in list(mom):
    for k in ['GMV by Lazada Ads','QTY Orders by Lazada Ads','Lazada Ads Cost','Total GMV Lazada']:
        mom[y].pop(k, None)
base = json.load(open('base_data.json'))
channels = [c for c in base['channels'] if c['id'] != 'tt_live_sid']
for c in channels:
    if c['id'] == 'tt_live_smo':
        c['name'] = 'Live Puresia Official'
new_base = {
    'meta': {'store':'Puresia Official','generated':'2026-08-03','defaultMonth':'2026-06','source':'Google Sheet: Puresia Worksheet (Ads)'},
    'channels': channels,
    'months': parsed['months'],
    'mom': mom,
    'prodMap': {},
}
m = re.search(r'(<script id="BASE_DATA" type="application/json">).*?(</script>)', src, re.S)
src = src[:m.start()] + m.group(1) + json.dumps(new_base, ensure_ascii=False, separators=(',',':')) + m.group(2) + src[m.end():]
edits.append('BASE_DATA')

# ---------- 2. Branding header ----------
rep('brand mark Sophie Martin', 'brand mark Puresia', 1, 'css-comment')
rep('<title>Ads Command Center — Brunbrun</title>', '<title>Ads Command Center — Puresia</title>', 1, 'title')
rep('''aria-label="Brunbrun">
        <g transform="translate(50 0) scale(-1 1)"><text x="3" y="64" font-size="58" text-anchor="start">B</text></g>
        <text x="50" y="64" font-size="58" text-anchor="start">B</text>''',
'''aria-label="Puresia">
        <text x="50" y="64" font-size="58" text-anchor="middle">P</text>''', 1, 'logo')
rep('<h1>BRUNBRUN <small>O F F I C I A L</small></h1>', '<h1>PURESIA <small>O F F I C I A L</small></h1>', 1, 'h1')
rep('Ads Command Center v3 — Brunbrun', 'Ads Command Center v3 — Puresia', 1, 'js-comment')

# ---------- 3. Channel defs ----------
rep("const CH_ORDER = ['tt_live_smo','tt_live_sid','tt_live_aff'", "const CH_ORDER = ['tt_live_smo','tt_live_aff'", 1, 'CH_ORDER')
rep('tt_live_smo:8, tt_live_sid:8, tt_live_aff:8, tt_live_all:8,', 'tt_live_smo:8, tt_live_aff:8, tt_live_all:8,', 1, 'DEFAULT_TARGETS')
rep("""  tt_live_smo:['GMV Max Live Brunbrun Official','GMV Max Live Brunbrun Official'],
  tt_live_sid:['GMV Max Live Brunbrun Watch','GMV Max Live Brunbrun Watch'],""",
"""  tt_live_smo:['GMV Max Live Puresia Official','GMV Max Live Puresia Official'],""", 1, 'CH_LABEL')
rep("const GMVMAX_LIVE_IDS=['tt_live_smo','tt_live_sid','tt_live_aff'];", "const GMVMAX_LIVE_IDS=['tt_live_smo','tt_live_aff'];", 1, 'GMVMAX_LIVE_IDS')
rep("['tt_live_all','tt_live_smo','tt_live_sid','tt_live_aff']", "['tt_live_all','tt_live_smo','tt_live_aff']", 1, 'parser-live-list')
rep("['sp_live','tt_live_smo','tt_live_sid','tt_live_aff']", "['sp_live','tt_live_smo','tt_live_aff']", 1, 'upload-chlist')
rep("new Set(['tt_live_smo','tt_live_sid','tt_live_aff','tt_live_all','sp_live'])", "new Set(['tt_live_smo','tt_live_aff','tt_live_all','sp_live'])", 1, 'LIVE_CH')

# ---------- 4. Deteksi akun dari nama campaign / nickname ----------
rep("""  if(/\\baff|affiliate/.test(n))return 'tt_live_aff';
  if(/bbo/.test(n))return 'tt_live_smo';
  if(/bbw/.test(n))return 'tt_live_sid';
  return 'tt_live_smo';""",
"""  if(/\\baff|affiliate/.test(n))return 'tt_live_aff';
  if(/pure/.test(n))return 'tt_live_smo';
  return 'tt_live_smo';""", 1, 'liveChannelFromName')
rep('Akun (Official/Watch/Affiliate) dipilih manual', 'Akun (Official/Affiliate) dipilih manual', 1, 'comment-akun')
rep("""      if(n.includes('official'))return 'tt_live_smo';
      if(n.includes('_id')||n.includes('sophiemartinid'))return 'tt_live_sid';
      return 'tt_live_aff';""",
"""      if(n.includes('pure')||n.includes('official'))return 'tt_live_smo';
      return 'tt_live_aff';""", 1, 'nickChannel')

# ---------- 5. Hapus Lazada ----------
i1 = src.index("  hi=findHeader(rows,['Tanggal','Tipe Campaign','Pengeluaran']);")
i2 = src.index("  hi=findHeader(rows,['Nama kampanye','Biaya']);")
assert i1 < i2
src = src[:i1] + src[i2:]
edits.append('lazada-detect-branch')
rep("const LIVE=GMVMAX_LIVE_IDS, META=['meta_cpas','meta_reg'], LAZ=['lz_store','lz_product'];",
    "const LIVE=GMVMAX_LIVE_IDS, META=['meta_cpas','meta_reg'];", 2, 'LAZ-decl')
rep('(o.tiktok||0)+(o.shopee||0)+(o.lazada||0)', '(o.tiktok||0)+(o.shopee||0)', 3, 'gmvmp-lazada')
rep('{mk:{tiktok,shopee,lazada}}', '{mk:{tiktok,shopee}}', 1, 'gmvmp-comment')

# ---------- 6. Generate ke sheet & SHEET_BLOCK ----------
rep("['GMV by Live Stream Brunbrun Official','rp',G(['tt_live_smo'])],['GMV by Live Stream Brunbrun Watch','rp',G(['tt_live_sid'])],",
    "['GMV by Live Stream Puresia Official','rp',G(['tt_live_smo'])],", 1, 'gen-gmv-rows')
rep("['QTY Orders by Live Stream Brunbrun Official','n',O(['tt_live_smo'])],['QTY Orders by Live Stream Brunbrun Watch','n',O(['tt_live_sid'])],",
    "['QTY Orders by Live Stream Puresia Official','n',O(['tt_live_smo'])],", 1, 'gen-qty-rows')
rep("const SHEET_BLOCK={tt_live_smo:'LIVE SHOPPING ADS Brunbrun Official',tt_live_sid:'LIVE SHOPPING ADS Brunbrun Watch',tt_live_aff:'LIVE SHOPPING ADS Affiliate',",
    "const SHEET_BLOCK={tt_live_smo:'LIVE SHOPPING ADS Puresia Official',tt_live_aff:'LIVE SHOPPING ADS Affiliate',", 1, 'SHEET_BLOCK')
rep("tt_ci_smv:'Community Interaction Brunbrun',", "tt_ci_smv:'Community Interaction Puresia',", 1, 'SHEET_BLOCK-ci')

# ---------- 7. Parser: nama, routing, tahun ----------
rep('PARSER "BrunBrun 2025 Worksheet"', 'PARSER "Puresia Worksheet (Ads)"', 1, 'parser-comment')
src_count = src.count('parseBrunbrunDump'); assert src_count == 2, src_count
src = src.replace('parseBrunbrunDump', 'parsePuresiaDump'); edits.append('parser-rename')
rep("if(t.includes('AFFI'))return 'tt_live_aff';",
"""if(t.includes('AFFI'))return 'tt_live_aff';
    if(t.includes('PURE'))return 'tt_live_smo';""", 1, 'routeSection-pure')
rep("if(t.includes('BBW')||t.includes('SID'))return 'tt_live_sid';", "if(t.includes('BBW')||t.includes('SID'))return null;", 1, 'routeSection-sid')
OLD_Y = """  for(const s of summaries){
    if(s.rows['Meta GMV']&&!momByYear['2025']){momByYear['2025']=s.rows;s.year=2025;}
    else if(s.rows['GMV by Meta CPAS']&&!momByYear['2026']){momByYear['2026']=s.rows;s.year=2026;}
    else warnings.push('Rekap bulanan blok #'+s.blockIndex+' tidak dikenali tahunnya, dilewati');
  }"""
NEW_Y = """  const hasJan=s=>{const t=s.rows['Total GMV From Ads']||[];return t[0]!=null&&t[0]>0;};
  for(const s of summaries){
    const y=hasJan(s)?'2026':'2025';
    if(!momByYear[y]){momByYear[y]=s.rows;s.year=+y;}
    else warnings.push('Rekap bulanan blok #'+s.blockIndex+' tidak dikenali tahunnya, dilewati');
  }"""
rep(OLD_Y, NEW_Y, 1, 'parser-year-summary')
OLD_F = """    // fallback: posisi blok relatif thd rekap 2025
    if(best==null||bestDiff>0.5){
      const b25=sumIdx[2025]?sumIdx[2025].blockIndex:1e9;
      best=tab.blockIndex<b25?2026:2025;
    }
    tab.year=best;
  }"""
NEW_F = """    if(best!=null&&bestDiff<=0.5){tab.year=best;tab.__conf=true;}
    else{tab.year=best;tab.__conf=false;}
  }
  // fallback: tab tanpa kecocokan meyakinkan ikut tahun tab tetangga terdekat (blok berdekatan = era sama)
  for(const tab of dailyTabs){
    if(tab.__conf)continue;
    let near=null,nd=Infinity;
    for(const o of dailyTabs){if(!o.__conf)continue;const d=Math.abs(o.blockIndex-tab.blockIndex);if(d<nd){nd=d;near=o;}}
    if(near)tab.year=near.year;
    else if(tab.year==null)tab.year=2026;
  }"""
rep(OLD_F, NEW_F, 1, 'parser-year-fallback')

# ---------- 8. Google Drive / Sheet wiring ----------
rep("const GD_SHEET_ID='1D0AOhIvi3cqkp1tt8o2wqBrFPaYPmCEp52t1W-qZXpk';", "const GD_SHEET_ID='1vJHziZAWR-d3yBTcwxtqki9QPMFwtxk_tKmlyOxoPfA';", 1, 'GD_SHEET_ID')
rep("const GD_SHEET_NAME='BrunBrun 2025 Worksheet';", "const GD_SHEET_NAME='Puresia Worksheet (Ads)';", 1, 'GD_SHEET_NAME')
rep('sinkron file mentah dari folder "BB Ads Raw Data" (pola sama dgn dashboard SM)', 'sinkron file mentah dari folder "Puresia Ads Raw Data"', 1, 'gd-comment')
m = re.search(r'const GD_FOLDERS=\[.*?\];', src, re.S)
assert m and 'BBO' in m.group(0)
NEW_FOLDERS = """const GD_FOLDERS=[
  {id:'1RE27IySB9zzExkR3MNiYX1_e0VMc5E34',name:'01 TikTok Product GMV Max'},
  {id:'1giHJMxqPhs5T2e1OrBaKgqVz9bMyli-M',name:'02 TikTok Live GMV Max'},
  {id:'1Q_1LOmzXpCUuuLGVpA8jVNcIUCgO2sWY',name:'03 Klik Produk / Shopee Live',channel:'sp_live'},
  {id:'1Bq8-KtgFMIDUQ27elaITeIDCRRMpyQEB',name:'03 Klik Produk / GMV Max Live Puresia Official',channel:'tt_live_smo'},
  {id:'1jNs10B4GvU7gne8mAKyqKr1ZYPIvXyjq',name:'03 Klik Produk / GMV Max Live Affiliate',channel:'tt_live_aff'},
  {id:'14W10_DOU-953RbnFhwOR0fkg4UaAhjsm',name:'04 Shopee CPC'},
  {id:'1o1OAZPsV1kfyn6S4-yRkbLcAMUDmtQ77',name:'05 Shopee Toko',channel:'sp_store'},
  {id:'1UfBMyxdkKGjbFSyJ2A8qO2jBFNtbTMXg',name:'06 Shopee SBA',channel:'sp_sba'},
  {id:'1i5QQzFPNxuK7U_qrXCai4REfLw83Psjq',name:'07 Shopee Live',channel:'sp_live'},
  {id:'1N5vqgB-Hjp6jy7etCSJygkzBOtkeP_D9',name:'08 Meta'},
  {id:'1Gf7CPzQmBnyfnHugTq0yYSN-uzuLohgj',name:'09 Branding Ads'},
];"""
src = src[:m.start()] + NEW_FOLDERS + src[m.end():]
edits.append('GD_FOLDERS')
rep('"BB Ads Raw Data"', '"Puresia Ads Raw Data"', 4, 'sync-text-folder')

# ---------- 9. localStorage isolation ----------
n = src.count('smoAds'); assert n >= 11, n
src = src.replace('smoAds', 'puresiaAds'); edits.append('ls-smoAds')
rep("const LS_SYNC='bbAdsSyncState';", "const LS_SYNC='puresiaAdsSyncState';", 1, 'LS_SYNC')
rep("const LS_SYNCF='bbAdsSyncedIds';", "const LS_SYNCF='puresiaAdsSyncedIds';", 1, 'LS_SYNCF')

# ---------- 10. Teks bantuan & chat ----------
rep('"BBO" → Live Brunbrun Official · "BBW" → Live Brunbrun Watch · "affiliate" → Live Affiliate',
    '"Pure" → GMV Max Live Puresia Official · "affiliate" → Live Affiliate', 1, 'help-campaign')
rep("sophiemartinofficial → Live Brunbrun Official · sophiemartin_id → Live Brunbrun Watch · ${L('akun lain','other accounts')} → Live Affiliate",
    "official / pure → GMV Max Live Puresia Official · ${L('akun lain','other accounts')} → Live Affiliate", 1, 'help-nick')
rep("L('\\nContoh: Brunbrun Tote Bag Wanita Francine Bag','\\nExample: Brunbrun Tote Bag Wanita Francine Bag')",
    "L('\\nContoh: Puresia Body Butter 275gr','\\nExample: Puresia Body Butter 275gr')", 1, 'prod-example')
rep('dashboard iklan Brunbrun Official (merek fashion Indonesia: tas, jam tangan, dompet)',
    'dashboard iklan Puresia Official (merek perawatan tubuh alami Indonesia: body lotion, shampoo, body butter)', 1, 'chat-prompt-id')
rep('Brunbrun Official ads dashboard (an Indonesian fashion brand: bags, watches, wallets)',
    'Puresia Official ads dashboard (an Indonesian natural body care brand: body lotion, shampoo, body butter)', 1, 'chat-prompt-en')
rep('asisten analisis Brunbrun.', 'asisten analisis Puresia.', 1, 'chat-greet-id')
rep('the Brunbrun analysis assistant', 'the Puresia analysis assistant', 1, 'chat-greet-en')
rep("new Set(['sophie','martin','jam','tangan','tas','selempang','bahu','tote','totebag','bowler','dompet','panjang','wanita','pria','bag','mini','sandal','sepatu','kacamata','clutch','ransel','backpack','sling'])",
    "new Set(['puresia','vegan','natural','new','refill','-','|'])", 1, 'CAT_WORDS')

n = src.count('BrunBrun 2025 Worksheet')
print('sisa BrunBrun 2025 Worksheet:', n)
src = src.replace('BrunBrun 2025 Worksheet', 'Puresia Worksheet (Ads)')
edits.append('worksheet-name-texts')

# ---------- Final checks ----------
leftover = re.findall(r'[Bb]run[Bb]run|BRUNBRUN|sophiemartin|Sophie Martin|tt_live_sid|lz_store|lz_product|bbAds|smoAds', src)
print('edits applied:', len(edits))
print('leftover brand refs:', leftover if leftover else 'NONE')
low = src.lower()
for pat in ['bbo','bbw']:
    idxs = [m.start() for m in re.finditer(pat, low)]
    ctx = [src[max(0,i-40):i+40].replace('\n',' ') for i in idxs]
    print(pat, len(idxs), ctx[:6])
open('puresia-ads-command-center.html','w').write(src)
print('written, bytes:', len(src))
