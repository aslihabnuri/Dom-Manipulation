from PIL import Image, ImageDraw, ImageFont
import os
out=os.path.dirname(os.path.abspath(__file__))+'/src/'
def font(sz,bold=False):
    p='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    return ImageFont.truetype(p,sz) if os.path.exists(p) else ImageFont.load_default()
W,H=2400,1400
im=Image.new('RGB',(W,H),'white'); d=ImageDraw.Draw(im)
f0=font(30,True); f1=font(26,True); f2=font(22)
d.text((W//2,50),'Gambar 4.1 Arsitektur model bisnis JIIPE Low-Carbon Industrial Energy-as-a-Service',font=f0,fill='black',anchor='mm')
def box(xy,title,lines,fill):
    x0,y0,x1,y1=xy
    d.rounded_rectangle(xy,radius=14,fill=fill,outline='black',width=3)
    d.text(((x0+x1)//2,y0+30),title,font=f1,fill='black',anchor='mm')
    y=y0+65
    for l in lines: d.text((x0+16,y),l,font=f2,fill='black'); y+=32
def arr(x0,y0,x1,y1):
    d.line((x0,y0,x1,y1),fill='black',width=4)
    import math
    a=math.atan2(y1-y0,x1-x0)
    d.polygon([(x1,y1),(x1-22*math.cos(a-0.4),y1-22*math.sin(a-0.4)),(x1-22*math.cos(a+0.4),y1-22*math.sin(a+0.4))],fill='black')
# supply side
box((60,130,760,470),'PORTOFOLIO PASOKAN (aset direncanakan)',['PLTS darat 400 kWp (ada) -> 56 MWp (FS) -> 148 MWp 2032 [BREN/BKMS]','PLTS terapung 55 MW fase 1 [BREN]','Gas pipa PGN via BBE (65%) + pembangkit gas, lisensi 515 MW','Terminal LNG JIIPE bersama bp Gas & Power (target 2029)','Interkoneksi PLN 500 MVA + REC PLN sebagai pelengkap','Baterai penyimpan (baru, untuk tingkat 24/7)'],(225,245,225))
# platform
box((900,130,1500,470),'UNIT JIIPE ENERGY SERVICES (baru)',['Meter pintar + platform data per tenant','Pencocokan energi terbarukan per jam','Registri REC dan sertifikat asal','Laporan Scope 2 (lokasi + pasar),','  diverifikasi pihak ketiga','Kontrak langganan 5-10 tahun'],(250,235,215))
# products
box((1640,130,2340,470),'PRODUK LAYANAN TIGA TINGKAT',['BASE: listrik gas + laporan Scope 2 lokasi','LOW-CARBON 50: min. 50% EBT, REC dilacak','24/7 CARBON-FREE: pencocokan per jam,','  PLTS + baterai + REC pelengkap','Opsi: jasa pelaporan CBAM / jejak karbon produk'],(220,235,250))
arr(765,300,895,300); arr(1505,300,1635,300)
# customers
box((1640,560,2340,860),'PELANGGAN: 33 TENANT JIIPE',['Eksportir yang menghadapi CBAM (kimia: asam nitrat,','  amonium nitrat) dan deklarasi jejak karbon produk','  (kaca surya, copper foil untuk baterai)','Smelter dan PMR dengan target ESG pembeli global','Tenant baru: tingkat rendah karbon sebagai','  syarat standar kontrak lahan'],(245,225,245))
arr(1990,475,1990,555)
# revenue
box((900,560,1500,860),'SUMBER PENDAPATAN',['1. Biaya langganan tetap per MW terkontrak','2. Premi hijau per kWh (tingkat 50 dan 24/7)','3. Jasa pelaporan dan verifikasi per tenant','4. Perdagangan sertifikat / unit karbon','Biaya gas & LNG diteruskan via formula','  (disiplin net open position AKR)'],(250,245,225))
arr(1635,710,1505,710)
# partners
box((60,560,760,860),'MITRA DAN REGULATOR',['PLN: interkoneksi, wheeling, REC','bp Gas & Power: LNG','EPC PLTS, penyedia baterai','Lembaga verifikasi independen','Administrator KEK, Kementerian ESDM','Bank: pinjaman hijau (Taksonomi Keuangan','  Berkelanjutan Indonesia)'],(240,240,240))
arr(765,710,895,710)
# bottom: value capture
d.rounded_rectangle((60,950,2340,1300),radius=14,fill=(255,255,255),outline=(90,90,90),width=3)
d.text((1200,985),'PENCIPTAAN DAN PENANGKAPAN NILAI',font=f1,fill='black',anchor='mm')
lines=['Bagi tenant: satu kontrak, satu tagihan, satu laporan yang dapat diaudit; intensitas karbon listrik dijamin dalam kontrak.',
'Bagi AKR: utilitas JIIPE bergeser dari penjual kWh/gas ke penjual atribut rendah karbon; margin per kWh naik; tenant terkunci 5-10 tahun;',
'  pendapatan berulang tidak bergantung pada kuota impor (faktor 1) maupun harga minyak (faktor 2); transisi energi menjadi sumber pendapatan (faktor 3).',
'Kebaruan (Zott & Amit, 2010): konten (sertifikasi, pencocokan per jam), struktur (satu portofolio terkontrak), tata kelola (FID PLTS dikunci kontrak tenant).',
'Sumber: rancangan penulis berdasarkan AKR Corporindo (2026a, hlm. 117-119; 2026b, hlm. 42, 61, 90, 92), Tukker (2004), Helms (2016), Richter (2013).']
y=1025
for l in lines: d.text((90,y),l,font=f2,fill='black'); y+=36
im.save(out+'fig_4_1_eaas.png'); print('fig4 ok')
