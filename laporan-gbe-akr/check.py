# Automated checks: word counts, forbidden patterns, citation/number multiset vs git HEAD
import re,subprocess,collections,sys
FILES=['00_front.md','01_bab1.md','02_bab2.md','03_bab3.md','04_bab4a.md','05_bab4b.md','06_bab5.md']
def clean(t):
    t=re.sub(r'^---.*?---','',t,flags=re.S); t=re.sub(r'```\{=openxml\}.*?```','',t,flags=re.S)
    t=re.sub(r':::.*?:::','',t,flags=re.S); t=re.sub(r'!\[.*?\]\(.*?\)','',t)
    return t
def prose(t):
    t=clean(t); t=re.sub(r'^\|.*$','',t,flags=re.M); t=re.sub(r'^#.*$','',t,flags=re.M)
    t=re.sub(r'\*\*Tabel.*$','',t,flags=re.M); t=re.sub(r'^Sumber:.*$','',t,flags=re.M); return t
def nocit(t):
    t=re.sub(r'\([^()]*(?:AKR Corporindo|hlm\.|\d{4}[a-z]?\)|SJR|et al\.)[^()]*\)','',t)
    t=re.sub(r'\[(Fakta|Inferensi|Rekomendasi)\]','',t); return re.sub(r'\[(VERIFIKASI|ESTIMASI)[^\]]*\]','',t)
tot=[0,0]
for f in FILES:
    new=open('src/'+f,encoding='utf-8').read()
    old=subprocess.run(['git','show','HEAD:laporan-gbe-akr/src/'+f],capture_output=True,text=True,cwd='/home/user/Dom-Manipulation').stdout
    if f=='00_front.md':
        new_p=new[new.index('# KATA PENGANTAR'):new.index('# DAFTAR TABEL')]; old_p=old[old.index('# KATA PENGANTAR'):old.index('# DAFTAR TABEL')]
    else: new_p,old_p=new,old
    wn,wo=len(prose(new_p).split()),len(prose(old_p).split()); wnc=len(nocit(prose(new_p)).split())
    if f!='00_front.md': tot[0]+=wn; tot[1]+=wnc
    nums=lambda t: collections.Counter(re.findall(r'\d[\d.,]*',prose(t)))
    cits=lambda t: collections.Counter(re.findall(r'\([^()]*\d{4}[^()]*\)',clean(t)))
    tags=lambda t: collections.Counter(re.findall(r'\[(?:Fakta|Inferensi|Rekomendasi|VERIFIKASI[^\]]*|ESTIMASI[^\]]*)\]',clean(t)))
    dn=nums(old_p)-nums(new_p); dn2=nums(new_p)-nums(old_p); dc=cits(old_p)-cits(new_p); dc2=cits(new_p)-cits(old_p); dt=tags(old_p)-tags(new_p); dt2=tags(new_p)-tags(old_p)
    bad=[]
    body=prose(new_p)
    if '—' in body: bad.append('em dash')
    if 'melainkan' in body: bad.append('melainkan')
    longs=[s for s in re.split(r'(?<=[.!?])\s+',re.sub(r'\([^()]*\)','',body)) if len(s.split())>35]
    print(f'{f}: kata {wo}->{wn} ({(wn-wo)*100//max(wo,1):+d}%), tanpa sitasi {wnc}; angka hilang {sum(dn.values())} baru {sum(dn2.values())}; sitasi hilang {sum(dc.values())} baru {sum(dc2.values())}; label hilang {sum(dt.values())} baru {sum(dt2.values())}; kalimat>35 kata {len(longs)}; {bad}')
    for k in list(dn)[:8]: print('   angka hilang:',k,dn[k])
    for k in list(dn2)[:8]: print('   angka baru:',k,dn2[k])
    for k in list(dc)[:5]: print('   sitasi hilang:',k[:80])
    for k in list(dt)[:5]: print('   label hilang:',k[:80])
    for s in longs[:3]: print('   panjang:',s[:120])
ab=open('src/00_front.md',encoding='utf-8').read(); ab=ab[ab.index('# ABSTRAK'):ab.index('# DAFTAR TABEL')]
print('Abstrak kata:',len(re.sub(r'^#.*$','',ab,flags=re.M).split()))
print('TOTAL Bab1-5 prosa:',tot[0],'| tanpa sitasi:',tot[1])
