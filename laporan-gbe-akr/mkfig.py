from PIL import Image, ImageDraw, ImageFont
import os
out=os.path.dirname(os.path.abspath(__file__))+'/src/'
def font(sz,bold=False):
    for p in ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']:
        if os.path.exists(p): return ImageFont.truetype(p,sz)
    return ImageFont.load_default()
def box(d,xy,title,lines,fill,f1,f2):
    x0,y0,x1,y1=xy
    d.rounded_rectangle(xy,radius=14,fill=fill,outline=(40,40,40),width=3)
    d.text(((x0+x1)//2,y0+28),title,font=f1,fill=(20,20,20),anchor='mm')
    y=y0+60
    for l in lines:
        d.text((x0+18,y),l,font=f2,fill=(30,30,30)); y+=30
def arrow(d,x0,y,x1):
    d.line((x0,y,x1,y),fill=(40,40,40),width=5)
    d.polygon([(x1,y),(x1-22,y-12),(x1-22,y+12)],fill=(40,40,40))
# Fig 2.1
W,H=2200,900
im=Image.new('RGB',(W,H),'white'); d=ImageDraw.Draw(im)
f1=font(30,True); f2=font(22); f0=font(26,True)
cols=[('ISSUE',['Gejala teramati 2024–2026','Bukti bersitasi (AR/SR,','regulasi, media tier 1)','Dampak terukur pada volume,','margin, pendapatan segmen,','capex, risiko'],(220,235,250)),
('KEY FACTOR PENYEBAB',['Kekuatan di luar kendali','perusahaan','Dibedakan dari gejala','Mekanisme sebab-akibat','didukung jurnal SJR Q1/Q2','(min. 2 per faktor)'],(250,235,215)),
('KEY ACTION',['2–3 tindakan konkret','Pemilik (Direksi/unit)','Horizon waktu','Indikator keberhasilan','Kotak Ancaman | Peluang |','Implikasi Strategis'],(225,245,225)),
('USULAN INOVATIF',['3 alternatif model bisnis','Kriteria berbobot (Tabel 4.6)','1 terpilih dibahas mendalam:','proposisi nilai, model bisnis,','peta jalan, KPI, risiko','Uji kebaruan vs rencana resmi'],(245,225,245))]
x=60
for i,(t,l,c) in enumerate(cols):
    box(d,(x,140,x+460,560),t,l,c,f1,f2)
    if i<3: arrow(d,x+465,350,x+535)
    x+=540
d.text((W//2,60),'Gambar 2.1 Kerangka analisis Bab 4: Issue → Key Factor Penyebab → Key Action → Usulan Inovatif',font=f0,fill='black',anchor='mm')
d.rounded_rectangle((60,620,W-60,800),radius=14,fill=(245,245,245),outline=(120,120,120),width=2)
d.text((90,640),'Tiga faktor prioritas diproses melalui alur yang sama: (1) Pemerintah & Regulasi, (2) Ekonomi, (3) Teknologi & Lingkungan (transisi energi).',font=f2,fill='black')
d.text((90,680),'Sintesis (Tabel 4.4): skor magnitudo, probabilitas, kecepatan, kontrolabilitas 1–5 → faktor terpenting dan interaksi antarfaktor.',font=f2,fill='black')
d.text((90,720),'Kriteria pemilihan inovasi (Teece, 2010; Zott & Amit, 2010): kesesuaian faktor 25%, kelayakan finansial 20%, kecepatan 15%, risiko regulasi 15%,',font=f2,fill='black')
d.text((90,750),'dampak keberlanjutan 10%, keunikan vs pesaing dan rencana resmi 15%.',font=f2,fill='black')
im.save(out+'fig_2_1_kerangka.png')
# Fig 3.1
W,H=2400,1400
im=Image.new('RGB',(W,H),'white'); d=ImageDraw.Draw(im)
f1=font(28,True); f2=font(23); f0=font(30,True)
d.text((W//2,50),'Gambar 3.1 Struktur grup PT AKR Corporindo Tbk: entitas kunci dan kepemilikan (31 Desember 2025)',font=f0,fill='black',anchor='mm')
d.rounded_rectangle((650,110,1750,250),radius=14,fill=(230,230,230),outline='black',width=3)
d.text((1200,150),'PT AKR Corporindo Tbk (AKRA)',font=f1,fill='black',anchor='mm')
d.text((1200,195),'Pemegang saham: PT Arthakencana Rayatama 63,71% | Publik 32,78%',font=f2,fill='black',anchor='mm')
d.text((1200,225),'Manajemen 2,15% | Saham treasuri 1,36%',font=f2,fill='black',anchor='mm')
segs=[('1. TRADING & DISTRIBUTION',['Induk: BBM industri nonsubsidi (B40, IDO, MFO) sejak 2005','Induk: BBM bersubsidi AKRA SOL (penugasan BPH Migas sejak 2010)','Induk: kimia dasar (distributor utama PT Asahimas Chemical)','PT Anugerah Krida Retailindo 99,99%','   - PT Aneka Petroindo Raya (bp AKR, ritel) 50,1%','   - PT Dirgantara Petroindo Raya (avtur, dengan Air bp) 50,1%','   - PT Anugerah Lubrindo Raya (pelumas Castrol) 80%','PT AKR Niaga Indonesia 99,99% -> PT Anugerah Kimia Indonesia 51%','Chemical Petroleum International Trading Pte Ltd (Singapura) 100%'],(220,235,250)),
('2. LOGISTICS INFRASTRUCTURE',['PT Jakarta Tank Terminal 51% (Royal Vopak 49%), 350.000 m3, Tanjung Priok','PT AKR Sea Transport 99,99% (14 kapal/SPOB)','PT AKR Transportasi Indonesia 99,90% (sekitar 250 truk tangki)','PT Andahanesa Abadi 99,99%','   - PT Terminal Nilam Utara 60%','   - PT Anugerah Kreasi Pratama Indonesia 99,99% (Gresik)','PT Terminal Energi Primer 99,99% (belum beroperasi)','PT Berkah Bunker Service 99,99% (belum beroperasi)'],(225,245,225)),
('3. MANUFACTURING',['PT Arjuna Utama Kimia (Aruki) 99,96%','   perekat kayu, kapasitas 100.000 ton, Surabaya','PT Anugrah Karya Raya 99,99% (pertambangan dan niaga batu bara)'],(250,240,215)),
('4. INTEGRATED INDUSTRIAL ESTATE & PORT (JIIPE)',['PT Usaha Era Pratama Nusantara (UEPN) 99,99%','   - PT Berkah Kawasan Manyar Sejahtera (BKMS) 60%: pengembang','     KEK JIIPE 1.761 ha; Pelindo 40%; lisensi listrik 515 MW','   - PT Berlian Manyar Sejahtera (BMS) 40%: pelabuhan 406 ha;','     Pelindo 60%; konsesi 76 tahun','PT Berkah Buana Energi (BBE) 65%: gas pipa JIIPE','PT Berkah Renewable Energi Nusantara (BREN) 99,97%: PLTS/EBT'],(245,225,245))]
pos=[(60,360),(1240,360),(60,860),(1240,860)]; w=1100
d.line((1200,250,1200,300),fill='black',width=4); d.line((610,300,1790,300),fill='black',width=4)
for (t,l,c),(x,y0) in zip(segs,pos):
    cx=x+w//2
    if y0==360: d.line((cx,300,cx,360),fill='black',width=4)
    else: d.line((cx-540 if x==60 else cx+540,300,cx-540 if x==60 else cx+540,y0),fill='black',width=2)
    h=70+34*len(l)+30
    d.rounded_rectangle((x,y0,x+w,y0+h),radius=14,fill=c,outline='black',width=3)
    d.text((cx,y0+32),t,font=f1,fill='black',anchor='mm')
    y=y0+70
    for s_ in l:
        d.text((x+18,y),s_,font=f2,fill='black'); y+=34
d.text((60,H-110),'Sumber: AKR Corporindo (2026a, hlm. 59, 60, 64, 99-100). Persentase = kepemilikan AKR atau entitas induk langsung; entitas kecil dan nonaktif tidak ditampilkan.',font=f2,fill='black')
pass
im.save(out+'fig_3_1_struktur.png')
print('figs ok')
