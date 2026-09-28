const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5
const RED='8C1D2B', DARK='2B2B2B', GREY='6B6B6B', TINT='F7EEEF', GOLD='C9A227', WHITE='FFFFFF', LIGHT='FBF7F7', GREEN='2E6B4F';
const HF='Cambria', BF='Calibri';
const IMG={fig4_1:[1417,1043],fig4_2:[1322,1192],fig4_3:[1279,1649],fig4_4:[1348,587],tab4_1a:[1302,1075],tab4_1b:[1302,1749],tab4_1c:[1302,1358],tab4_2:[1298,1379],tab4_3:[1301,886],tab4_4:[1298,1142],cap4_1:[1334,859]};
let n=0;
function fit(slide,key,x,y,maxW,maxH){const [w,h]=IMG[key];const r=Math.min(maxW/w,maxH/h);const W=w*r,H=h*r;slide.addImage({path:key+'.png',x:x+(maxW-W)/2,y:y,w:W,h:H});return H;}
function base(kicker,title,src){
  n++; const s=pres.addSlide(); s.background={color:WHITE};
  if(kicker) s.addText(kicker,{x:0.6,y:0.22,w:9,h:0.3,fontFace:BF,fontSize:11,bold:true,color:RED,charSpacing:2,margin:0,isTextBox:true});
  s.addText(title,{x:0.6,y:0.48,w:12.1,h:0.95,fontFace:HF,fontSize:23,bold:true,color:DARK,margin:0,isTextBox:true,valign:'top'});
  if(src) s.addText('Sumber: '+src,{x:0.6,y:7.0,w:11.5,h:0.3,fontFace:BF,fontSize:9,color:GREY,margin:0,isTextBox:true});
  s.addText(String(n),{x:12.5,y:7.0,w:0.4,h:0.3,fontFace:BF,fontSize:9,color:GREY,align:'right',margin:0,isTextBox:true});
  return s;
}
function circle(s,num,x,y,d=0.5){s.addShape(pres.shapes.OVAL,{x,y,w:d,h:d,fill:{color:RED},line:{color:RED}});s.addText(String(num),{x,y,w:d,h:d,fontFace:HF,fontSize:d>0.45?14:11,bold:true,color:WHITE,align:'center',valign:'middle',margin:0,isTextBox:true});}
function card(s,x,y,w,h,head,body,opts={}){
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y,w,h,fill:{color:opts.fill||TINT},line:{color:opts.fill||TINT},rectRadius:0.08});
  if(head) s.addText(head,{x:x+0.15,y:y+0.1,w:w-0.3,h:0.35,fontFace:BF,fontSize:opts.hs||13,bold:true,color:opts.hc||RED,margin:0,isTextBox:true,valign:'top'});
  if(body) s.addText(body,{x:x+0.15,y:y+(head?0.45:0.12),w:w-0.3,h:h-(head?0.55:0.24),fontFace:BF,fontSize:opts.bs||11.5,color:DARK,margin:0,isTextBox:true,valign:'top',paraSpaceAfter:3});
}
function bullets(s,items,x,y,w,h,fs=13){s.addText(items.map((t,i)=>({text:t,options:{bullet:true,breakLine:i<items.length-1}})),{x,y,w,h,fontFace:BF,fontSize:fs,color:DARK,margin:0,isTextBox:true,valign:'top',paraSpaceAfter:5});}
function para(s,t,x,y,w,h,fs=13,color=DARK,bold=false){s.addText(t,{x,y,w,h,fontFace:BF,fontSize:fs,color,bold,margin:0,isTextBox:true,valign:'top'});}
function section(kicker,title,sub){n++;const s=pres.addSlide();s.background={color:RED};
  s.addText(kicker,{x:0.8,y:2.3,w:11,h:0.4,fontFace:BF,fontSize:13,bold:true,color:GOLD,charSpacing:3,margin:0,isTextBox:true});
  s.addText(title,{x:0.8,y:2.8,w:11.5,h:1.4,fontFace:HF,fontSize:40,bold:true,color:WHITE,margin:0,isTextBox:true,valign:'top'});
  if(sub) s.addText(sub,{x:0.8,y:4.3,w:11,h:1.5,fontFace:BF,fontSize:15,color:'F3DCDF',margin:0,isTextBox:true,valign:'top'});
  s.addText(String(n),{x:12.5,y:7.0,w:0.4,h:0.3,fontFace:BF,fontSize:9,color:'F3DCDF',align:'right',margin:0,isTextBox:true});return s;}
const BOOK='Thompson, Peteraf, Gamble & Strickland (2024), Crafting & Executing Strategy, 24th ed., Ch. 4';
const CASE='Grant (2010), Case 6 "Manchester United: Preparing for Life without Ferguson"';

// 1 Title
{n++;const s=pres.addSlide();s.background={color:RED};
 s.addText('STRATEGIC MANAGEMENT · MAN 5422 · SESI 5',{x:0.8,y:0.8,w:11,h:0.4,fontFace:BF,fontSize:13,bold:true,color:GOLD,charSpacing:3,margin:0,isTextBox:true});
 s.addText('Chapter 4\nEvaluating a Company’s Resources, Capabilities, and Competitiveness',{x:0.8,y:1.4,w:11.5,h:2.0,fontFace:HF,fontSize:36,bold:true,color:WHITE,margin:0,isTextBox:true,valign:'top'});
 s.addText('Studi kasus: Manchester United, Preparing for Life without Ferguson (Grant, 2010; setting Juli 2009)',{x:0.8,y:3.6,w:11.5,h:0.6,fontFace:BF,fontSize:16,color:'F3DCDF',margin:0,isTextBox:true});
 s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.8,y:4.6,w:5.6,h:2.1,fill:{color:'A3303E'},line:{color:'A3303E'},rectRadius:0.08});
 s.addText([{text:'KELOMPOK 4',options:{bold:true,color:GOLD,breakLine:true,fontSize:11}},{text:'Fitra Aidila · Aulia Sisca Rahmadiyanti · Bagaskoro · Imam Prayudha · Tegar Awanto',options:{color:WHITE,fontSize:14}}],{x:1.0,y:4.75,w:5.2,h:1.8,fontFace:BF,margin:0,isTextBox:true,valign:'top',paraSpaceAfter:6});
 s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:6.8,y:4.6,w:5.7,h:2.1,fill:{color:'A3303E'},line:{color:'A3303E'},rectRadius:0.08});
 s.addText([{text:'DOSEN PENGAMPU',options:{bold:true,color:GOLD,breakLine:true,fontSize:11}},{text:'Dr. Rangga Almahendra, S.T., M.M.',options:{color:WHITE,fontSize:14,breakLine:true}},{text:'MM UGM Jakarta · SEMBA · 2 Oktober 2026',options:{color:'F3DCDF',fontSize:12}}],{x:7.0,y:4.75,w:5.3,h:1.8,fontFace:BF,margin:0,isTextBox:true,valign:'top',paraSpaceAfter:6});
}
// 2 Agenda
{const s=base('ALUR PRESENTASI','Teori dulu, lalu kasus, lalu keputusan','Struktur analisis kasus mengikuti Appendix 3 silabus: Problem, Alternatives, Issues, Conclusion.');
 const items=[['01','Framework Chapter 4','Enam pertanyaan analisis internal dan alat untuk menjawabnya, dengan gambar asli dari buku.','Slide 3–18'],['02','Penerapan pada Manchester United','Kinerja, SWOT, resource dan capability, VRIN, rantai nilai, benchmarking, matriks kekuatan, priority list.','Slide 20–31'],['03','Keputusan: pola analisis kasus','Masalah, tiga alternatif, isu sebagai pertanyaan, argumen tandingan, simpulan deduktif, rencana implementasi.','Slide 32–37'],['04','Sumber dan diskusi','Peta sumber data per tabel kasus, catatan verifikasi, tanya jawab.','Slide 38–39']];
 items.forEach((it,i)=>{const x=0.6+i*3.1;card(s,x,1.8,2.9,4.6,null,null);circle(s,it[0],x+0.2,2.0,0.6);s.addText(it[1],{x:x+0.2,y:2.8,w:2.5,h:0.9,fontFace:HF,fontSize:16,bold:true,color:DARK,margin:0,isTextBox:true,valign:'top'});para(s,it[2],x+0.2,3.7,2.5,1.9,12);para(s,it[3],x+0.2,5.8,2.5,0.4,11,RED,true);});
}
// 3 Six questions
{const s=base('BAGIAN A · FRAMEWORK CHAPTER 4','Enam pertanyaan yang berurutan',BOOK+', hlm. 88–89.');
 para(s,'Jawaban setiap pertanyaan menjadi bahan bagi pertanyaan berikutnya: Q1 mengukur hasil, Q2 mencari sebab secara kasar, Q3 dan Q4 menggali sebab sampai dalam, Q5 membandingkan dengan pesaing, Q6 menyusun agenda.',0.6,1.45,12,0.7,13,GREY);
 const q=[['Seberapa baik strategi yang sekarang bekerja?','Indikator kinerja + Table 4.1'],['Apa kekuatan dan kelemahan kita dihadapkan pada peluang dan ancaman?','SWOT: Table 4.2, Figure 4.2'],['Resource dan capability apa yang paling penting, dan apakah tahan lama?','Table 4.3 + uji VRIN + dynamic capability'],['Bagaimana aktivitas rantai nilai memengaruhi biaya dan nilai pelanggan?','Figure 4.3, 4.4 + benchmarking'],['Kita lebih kuat atau lebih lemah dari pesaing utama?','Matriks kekuatan kompetitif, Table 4.4'],['Isu strategis apa yang harus ditangani lebih dulu?','Priority list']];
 q.forEach((it,i)=>{const col=i%3,row=Math.floor(i/3);const x=0.6+col*4.1,y=2.3+row*2.3;card(s,x,y,3.9,2.1,null,null);circle(s,i+1,x+0.2,y+0.2,0.5);s.addText(it[0],{x:x+0.85,y:y+0.15,w:2.9,h:1.1,fontFace:BF,fontSize:13,bold:true,color:DARK,margin:0,isTextBox:true,valign:'top'});para(s,it[1],x+0.85,y+1.35,2.9,0.6,11.5,RED);});
}
// 4 Q1 Figure 4.1
{const s=base('PERTANYAAN 1','Kenali dulu strategi yang sedang dijalankan',BOOK+', Figure 4.1 hlm. 90; indikator kinerja hlm. 91.');
 fit(s,'fig4_1',0.6,1.5,6.6,5.3);
 card(s,7.5,1.5,5.2,1.9,'Cara memakai Figure 4.1','Isi setiap kotak dengan tindakan nyata perusahaan, lalu periksa apakah tindakan itu saling mendukung. Strategi bisnis di tengah ditopang tujuh strategi fungsional di sekelilingnya.');
 card(s,7.5,3.55,5.2,3.2,'Kinerja lalu diukur dengan','• Tren penjualan dan laba\n• Tren harga saham\n• Kekuatan keuangan keseluruhan\n• Tingkat retensi pelanggan dan laju pelanggan baru\n• Perbaikan proses internal (cacat, waktu kirim, produktivitas)\n\nBuku: kinerja keuangan yang lesu dan posisi pasar kelas dua hampir selalu menandakan strategi lemah, eksekusi lemah, atau keduanya.');
}
// 5 Q1 Table 4.1
{const s=base('PERTANYAAN 1 · TABLE 4.1','Rasio keuangan: alat ukurnya',BOOK+', Table 4.1 hlm. 91–93. Lanjutan tabel (likuiditas, leverage, aktivitas, ukuran lain) ada di lampiran.');
 fit(s,'tab4_1a',0.6,1.5,6.6,5.3);
 card(s,7.5,1.5,5.2,5.3,'Lima kelompok rasio',
 'Profitabilitas: gross, operating, dan net profit margin; return on assets; return on equity (rata-rata 12–15%); return on invested capital.\n\nLikuiditas: current ratio, working capital.\n\nLeverage: debt-to-assets, long-term debt-to-capital, debt-to-equity, times-interest-earned.\n\nAktivitas: days of inventory, inventory turnover, average collection period.\n\nUkuran lain: dividend yield, P/E, payout ratio, internal cash flow, free cash flow.\n\nUntuk klub sepak bola, rasio yang paling menjelaskan model bisnis adalah rasio upah terhadap pendapatan, yang tidak ada di tabel tetapi disediakan kasus.');
}
// 6 Q2 SWOT + Table 4.2
{const s=base('PERTANYAAN 2 · SWOT','SWOT: kekuatan dan kelemahan vs peluang dan ancaman',BOOK+', hlm. 94–96; Table 4.2 hlm. 96.');
 fit(s,'tab4_2',0.6,1.5,6.0,5.3);
 card(s,6.9,1.5,5.8,2.4,'Tangga kemampuan (hlm. 94–95)','Competence: aktivitas yang dikuasai dan dikerjakan konsisten baik pada biaya wajar.\nDistinctive competence: dikerjakan lebih baik daripada pesaing.\nCore competence: mahir dan berada di jantung strategi; contoh buku: manajemen merek Procter & Gamble.');
 card(s,6.9,4.05,5.8,2.75,'Empat pertanyaan pemandu SWOT','Apakah kekuatan cukup menutup kelemahan? Apakah strategi sudah bertumpu pada kekuatan itu? Apakah kekuatan kita melampaui pesaing? Apakah strategi berhasil menangkal ancaman?\n\nPeluang yang relevan hanyalah yang cocok dengan sumber daya perusahaan, bukan setiap peluang di industri.');
}
// 7 Q2 Figure 4.2
{const s=base('PERTANYAAN 2 · FIGURE 4.2','SWOT tidak berhenti pada empat daftar',BOOK+', Figure 4.2 hlm. 97.');
 fit(s,'fig4_2',0.6,1.5,6.4,5.3);
 const steps=[['Identifikasi','Susun empat daftar berdasarkan bukti, dengan Table 4.2 sebagai pemandu.'],['Tarik simpulan','Apa sebab berhasil atau gagalnya strategi? Sisi mana dari situasi yang menarik dan mana yang mengkhawatirkan?'],['Terjemahkan jadi tindakan','Pakai kekuatan sebagai fondasi, perbaiki kelemahan yang menghambat, kejar peluang yang paling cocok, bertahan dari ancaman.']];
 steps.forEach((st,i)=>{const y=1.5+i*1.55;circle(s,i+1,7.3,y+0.1,0.5);card(s,7.95,y,4.75,1.4,st[0],st[1]);});
 card(s,7.3,6.2,5.4,0.6,null,'Yang dinilai bukan daftarnya, melainkan simpulan dan tindakannya.',{fill:'FBEBD0'});
}
// 8 Q3 Resource vs capability + Table 4.3
{const s=base('PERTANYAAN 3 · TABLE 4.3','Resource dan capability: dua hal yang berbeda',BOOK+', hlm. 98–100; Table 4.3 hlm. 99.');
 fit(s,'tab4_3',0.6,1.5,7.0,4.8);
 card(s,7.9,1.5,4.8,2.3,'Resource','Aset bersaing yang dimiliki atau dikendalikan perusahaan: merek, stadion, kas, kontrak, jaringan.');
 card(s,7.9,3.95,4.8,2.85,'Capability','Kapasitas perusahaan mengerjakan suatu aktivitas internal dengan kompeten. Dibangun dengan mengerahkan resource.\n\nBuku memasukkan sumber daya manusia ke kelompok tak berwujud untuk menekankan bahwa nilainya ada pada keterampilan dan pengetahuan, bukan pada jumlah orang.');
}
// 9 Q3 finding capabilities + bundle
{const s=base('PERTANYAAN 3 · LANJUTAN','Menemukan capability dan resource bundle',BOOK+', hlm. 100–101.');
 card(s,0.6,1.5,6.0,2.4,'Cara 1: berangkat dari daftar resource','Lihat resource, lalu tanya kemampuan apa yang tumbuh darinya. Armada truk dan pusat distribusi otomatis menandakan kemampuan logistik.');
 card(s,6.75,1.5,6.0,2.4,'Cara 2: berangkat dari fungsi perusahaan','Telusuri tiap fungsi: produksi, penjualan, riset. Kelemahannya: capability terpenting sering lintas fungsi, seperti desain Warby Parker yang lahir dari desainer, riset pasar, rekayasa, dan relasi pemasok.');
 card(s,0.6,4.1,12.15,2.7,'Resource bundle','Kumpulan aset bersaing yang saling terkait erat di sekitar satu atau beberapa capability lintas fungsi. Bundle bisa lolos uji VRIN walaupun komponennya sendiri tidak lolos. Contoh buku: gabungan keahlian styling, riset pasar, endorsement atlet, nama merek, dan kecakapan manajerial membuat Nike nomor satu lebih dari 20 tahun.\n\nKonsep inilah yang paling menentukan untuk Manchester United: jaringan pemandu bakat, akademi, disiplin latihan, rotasi skuad, dan kebijakan transfer masing-masing dapat ditiru, tetapi ikatannya sebagai satu sistem tidak.',{bs:13});
}
// 10 VRIN
{const s=base('PERTANYAAN 3 · UJI VRIN','Empat saringan daya kompetitif sebuah resource',BOOK+', hlm. 101–103. Definisi tes N dikutip persis dari buku karena sering salah dibaca.');
 const v=[['V','Valuable','Relevan langsung dengan strategi dan membuat perusahaan lebih efektif bersaing. Google Wallet gagal meski memakai resource teknologi Google.'],['R','Rare','Dimiliki hanya sebagian kecil perusahaan. Semua produsen sereal punya kemampuan pemasaran; kekuatan merek Oreo tidak umum.'],['I','Inimitable','Sulit ditiru bila unik, dibangun bertahun-tahun, butuh biaya besar, atau punya social complexity dan causal ambiguity.'],['N','Nonsubstitutable','Buku: "is it invulnerable to the threat of substitution from different types of resources and capabilities?" Lolos bila pesaing tidak dapat mencapai hasil sama lewat resource lain. Otomasi bisa dibatalkan oleh tenaga kerja murah di luar negeri.']];
 v.forEach((it,i)=>{const x=0.6+i*3.08;card(s,x,1.5,2.9,4.5,null,null);s.addText(it[0],{x:x+0.15,y:1.6,w:0.9,h:0.9,fontFace:HF,fontSize:44,bold:true,color:RED,margin:0,isTextBox:true});s.addText(it[1],{x:x+0.15,y:2.45,w:2.6,h:0.4,fontFace:BF,fontSize:14,bold:true,color:DARK,margin:0,isTextBox:true});para(s,it[2],x+0.15,2.9,2.6,3.05,11);});
 card(s,0.6,6.15,12.15,0.7,null,'V + R menentukan apakah resource bisa memberi keunggulan. I + N menentukan apakah keunggulan itu bertahan. Sebagian besar perusahaan hanya punya satu atau dua aset yang lolos semuanya.',{fill:'FBEBD0',bs:12.5});
}
// 11 Dynamic capability
{const s=base('PERTANYAAN 3 · LANJUTAN','Resource harus dikelola secara dinamis',BOOK+', hlm. 103–104.');
 const t=[['Pesaing menyusul','Yang semula tidak bisa meniru lama-lama menemukan pengganti yang makin baik.'],['Aset menyusut sendiri','Resource terdepresiasi seperti aset lain kalau dibiarkan tanpa perhatian.'],['Pasar berubah','Teknologi, selera, atau jalur distribusi dapat mengubah aset strategis "dari berlian jadi karat".']];
 t.forEach((it,i)=>card(s,0.6+i*4.1,1.5,3.9,1.7,it[0],it[1]));
 card(s,0.6,3.4,12.15,3.4,'Dynamic capability','Kapasitas berkelanjutan untuk memodifikasi resource dan capability yang ada atau menciptakan yang baru. Ia menjadi capability tersendiri ketika kegiatan memperbarui aset sudah menjadi rutinitas manajemen.\n\nDua jalurnya: memperbaiki yang ada sedikit demi sedikit (Toyota terus menyempurnakan sistem produksinya; BMW mengembangkan kapabilitas mesin hibrida menjadi mobil listrik) dan menambah yang baru lewat aliansi atau akuisisi (GM bermitra dengan LG untuk platform mobil listrik; Bristol-Myers Squibb mengganti paten kedaluwarsa lewat akuisisi).\n\nPertanyaan untuk kasus: kemampuan Manchester United membangun ulang skuad tiga kali tanpa kehilangan prestasi, milik klub atau milik Ferguson?',{bs:13});
}
// 12 Q4 value chain
{const s=base('PERTANYAAN 4 · FIGURE 4.3','Rantai nilai perusahaan dan tiga selisih',BOOK+', hlm. 104–107; Figure 4.3 hlm. 106; Illustration Capsule 4.1 hlm. 107.');
 fit(s,'fig4_3',0.6,1.5,4.3,5.3);
 fit(s,'cap4_1',5.1,1.5,4.6,3.0);
 card(s,5.1,4.65,4.6,2.15,'Contoh angka dari Capsule 4.1','Sepasang jeans Everlane: biaya total $19,60; harga jual $88; margin $68,40; harga peritel tradisional $103. Inilah wujud activity-based costing yang dituntut buku.',{bs:11.5});
 card(s,9.9,1.5,2.8,5.3,'Tiga selisih','V − P: nilai yang diterima pelanggan (customer value proposition).\n\nP − C: margin laba perusahaan.\n\nV − C: total economic value.\n\nDaftar aktivitas Figure 4.3 ilustratif, bukan definitif: rantai pasok krusial bagi Boeing, tidak ada pada Goldman Sachs. Aktivitas utama klub sepak bola harus dirumuskan ulang.',{bs:11.5});
}
// 13 Q4 Figure 4.4 + benchmarking
{const s=base('PERTANYAAN 4 · FIGURE 4.4','Sistem rantai nilai dan benchmarking',BOOK+', Figure 4.4 hlm. 109; benchmarking hlm. 109–111; Illustration Capsule 4.3 hlm. 111.');
 fit(s,'fig4_4',0.6,1.5,7.2,3.2);
 card(s,0.6,4.85,7.2,1.95,'Sistem rantai nilai','Biaya dan mutu yang sampai ke pembeli ditentukan seluruh rantai: pemasok, perusahaan, mitra hilir, pengguna akhir. Kerugian biaya dapat diatasi di ketiga mata rantai, bukan hanya di dalam perusahaan.');
 card(s,8.0,1.5,4.7,3.1,'Benchmarking dan best practice','Membandingkan cara dan biaya perusahaan lain mengerjakan aktivitas yang sama, lalu meniru cara terbaiknya. Best practice harus sudah terbukti konsisten lebih baik pada sekurang-kurangnya satu perusahaan.\n\nXerox pelopornya; Toyota meniru pengisian rak supermarket; Southwest meniru kru pit balap mobil.',{bs:11.5});
 card(s,8.0,4.75,4.7,2.05,'Etika benchmarking (Capsule 4.3)','Jangan membicarakan biaya dengan pesaing bila biaya adalah unsur harga. Data diperoleh dari laporan publik, asosiasi, kunjungan lapangan, atau konsultan yang menyamarkan nama perusahaan.',{bs:11.5});
}
// 14 Q4 remedies
{const s=base('PERTANYAAN 4 · TINDAKAN','Kalau biaya atau nilainya kalah, apa yang dilakukan',BOOK+', hlm. 112–114.');
 card(s,0.6,1.5,3.95,4.3,'1. Aktivitas internal','• Terapkan best practice di aktivitas mahal\n• Hapus aktivitas dengan merombak rantai nilai\n• Relokasi ke wilayah berbiaya rendah\n• Alih daya bila vendor lebih murah\n• Investasi teknologi penghemat biaya\n• Cari jalan memutar aktivitas mahal\n• Rancang ulang produk\n• Untuk nilai: best practice pada desain, mutu, layanan, merek; realokasi sumber daya');
 card(s,4.7,1.5,3.95,4.3,'2. Bagian pemasok','• Tekan harga beli\n• Ganti ke input pengganti yang lebih murah\n• Kolaborasi mencari penghematan bersama (just-in-time)\n• Integrasi ke belakang bila lebih murah\n• Untuk nilai: pilih pemasok bermutu tinggi, libatkan sejak desain');
 card(s,8.8,1.5,3.9,4.3,'3. Mitra hilir','• Tekan biaya dan markup distributor\n• Kolaborasi win-win (jendela kirim dua hari Walmart dan Target)\n• Ubah jalur distribusi, termasuk jual langsung lewat internet\n• Integrasi ke depan: gerai sendiri\n• Untuk nilai: iklan bersama, perjanjian eksklusif, pelatihan mitra');
 card(s,0.6,6.0,12.1,0.85,null,'Dua cara mengubah kerja rantai nilai menjadi keunggulan: lebih efisien sehingga biaya lebih rendah (Ryanair, Nucor, TJX), atau menjadi dasar diferensiasi sehingga pelanggan membayar lebih (Rolex, Braun, L.L. Bean, FedEx).',{fill:'FBEBD0',bs:12});
}
// 15 Q5 Table 4.4
{const s=base('PERTANYAAN 5 · TABLE 4.4','Matriks kekuatan kompetitif tertimbang',BOOK+', hlm. 115–118; Table 4.4 hlm. 116.');
 fit(s,'tab4_4',0.6,1.5,6.3,5.3);
 const st=[['Daftar KSF','Susun 6–10 faktor kunci keberhasilan dan ukuran kekuatan lain.'],['Beri bobot','Sesuai kepentingan; jumlah bobot harus 1,00.'],['Beri rating','Skala 1 sampai 10 untuk setiap pesaing.'],['Kalikan dan jumlahkan','Rating × bobot, lalu jumlahkan per perusahaan.'],['Tarik simpulan','Besar keunggulan atau kerugian bersih; area kuat dan lemah.']];
 st.forEach((it,i)=>{const y=1.5+i*0.9;circle(s,i+1,7.2,y+0.15,0.45);s.addText([{text:it[0]+'. ',options:{bold:true,color:RED}},{text:it[1]}],{x:7.8,y:y,w:4.9,h:0.8,fontFace:BF,fontSize:12.5,color:DARK,margin:0,isTextBox:true,valign:'top'});});
 card(s,7.2,6.05,5.5,0.8,null,'Serang di faktor tempat kita kuat dan pesaing lemah; bertahan di faktor tempat pesaing kuat dan kita lemah.',{fill:'FBEBD0',bs:12});
}
// 16 Q6
{const s=base('PERTANYAAN 6','Isu apa yang harus ditangani lebih dulu?',BOOK+', hlm. 118.');
 card(s,0.6,1.5,6.0,5.3,'Priority list','Daftar isu dan masalah yang harus dituntaskan manajemen agar perusahaan lebih berhasil secara keuangan dan bersaing.\n\nIsinya selalu berbentuk "bagaimana caranya…", "apa yang harus dilakukan soal…", dan "apakah perlu…".\n\nMenggabungkan hasil Q1 sampai Q5 dengan analisis industri dari Chapter 3.',{bs:13.5});
 card(s,6.75,1.5,6.0,2.5,'Keliru 1: daftar ini berisi isu, belum solusi','Tujuannya mengidentifikasi isu. Keputusan tindakan datang belakangan saat menyusun strategi. Inilah sebabnya kami memisahkan priority list (slide 31) dari alternatif dan simpulan (slide 32–36).',{bs:12.5});
 card(s,6.75,4.15,6.0,2.65,'Keliru 2: isi daftar menunjukkan kondisi strategi','Kalau isinya ringan, strategi cukup disempurnakan. Kalau isinya berat, menyusun strategi baru menjadi agenda utama. Strategi yang baik harus memuat cara menangani semua isu dalam daftar.',{bs:12.5});
}
// 17 Summary table
{const s=base('RINGKASAN BAGIAN A','Peta lengkap Chapter 4',BOOK);
 const rows=[[{text:'Pertanyaan',options:{bold:true,color:WHITE,fill:{color:RED}}},{text:'Alat yang dipakai',options:{bold:true,color:WHITE,fill:{color:RED}}},{text:'Hasilnya',options:{bold:true,color:WHITE,fill:{color:RED}}}],
 ['1  Seberapa baik strategi sekarang bekerja?','Indikator kinerja; rasio keuangan (Table 4.1)','Strategi berhasil atau gagal'],
 ['2  Kekuatan dan kelemahan vs peluang dan ancaman?','SWOT (Table 4.2, Figure 4.2); tangga competence','Sebab di balik berhasil atau gagalnya strategi'],
 ['3  Resource dan capability apa yang penting dan tahan lama?','Tipologi Table 4.3; resource bundle; uji VRIN; dynamic capability','Sumber keunggulan dan daya tahannya'],
 ['4  Bagaimana rantai nilai memengaruhi biaya dan nilai?','Value chain (Figure 4.3), value chain system (Figure 4.4), benchmarking','Titik unggul dan titik kalah per aktivitas'],
 ['5  Lebih kuat atau lebih lemah dari pesaing?','Matriks kekuatan tertimbang (Table 4.4)','Skor kekuatan dan net competitive advantage'],
 ['6  Isu apa yang ditangani lebih dulu?','Priority list','Agenda kerja manajemen']];
 s.addTable(rows,{x:0.6,y:1.5,w:12.1,colW:[4.3,4.6,3.2],fontFace:BF,fontSize:12,color:DARK,border:{type:'solid',pt:0.5,color:'D9C6C8'},rowH:0.6,valign:'middle'});
}
// 18 Section B
section('BAGIAN B · STUDI KASUS','Manchester United: Preparing for Life without Ferguson','Robert M. Grant (2010), dengan Simon I. Peck, Christopher Carr, dan Timothy Smith. Kasus berasal dari luar buku Thompson dan dianalisis dengan enam pertanyaan Chapter 4.');
// 19 Case intro
{const s=base('KASUS · SITUASI','Juli 2009: keputusan yang dihadapi David Gill',CASE+', hlm. 573 dan 588.');
 card(s,0.6,1.5,3.95,2.4,'Waktu','Juli 2009, tur pramusim Asia (Malaysia, Indonesia, Korea, China). Skuad pulang 28 Juli 2009.');
 card(s,4.7,1.5,3.95,2.4,'Pengambil keputusan','David Gill, Chief Executive Manchester United Football Club Limited.');
 card(s,8.8,1.5,3.9,2.4,'Keputusan','Menyiapkan pengganti Sir Alex Ferguson. Kasus: "at the end of 2009 Ferguson would be 68 years old"; Gill memperkirakan ia pensiun akhir musim 2009–10.');
 card(s,0.6,4.1,12.1,2.7,'Dilema inti (kasus hlm. 588)','Orang dalam (Queiroz, Phelan, Solskjær, McClair) menjaga "the system of training, scouting, and team development that Sir Alex had put in place", tetapi diragukan "presence and strength of personality" untuk memimpin bintang. Orang luar berwibawa seperti Mourinho "would involve a revolutionary change in coaching strategy in which much of Ferguson’s infrastructure would be taken down and rebuilt".\n\nPertanyaan Chapter 4 di baliknya: aset mana yang melekat pada klub, dan aset mana yang melekat pada satu orang?',{bs:13});
}
// 20 Industry context
{const s=base('KONTEKS','Sepak bola Eropa: pendapatan besar, laba langka',CASE+', hlm. 577–580; Table 6.5 dan 6.6.');
 const st=[['€2,4 M','Pendapatan Premier League 2007–08, terbesar di Eropa; Serie A, La Liga, Bundesliga sekitar €1,4 miliar'],['6 dari 10','Klub besar Eropa merugi 2000–2006 (Table 6.6). Hanya MU, Arsenal, dan Bayern yang labanya berarti menurut kasus'],['62%','Porsi gaji terhadap pendapatan Premier League; Serie A 68%, La Liga 63%; Chelsea 81%; MU dan Arsenal sekitar 50%']];
 st.forEach((it,i)=>{const x=0.6+i*4.1;card(s,x,1.5,3.9,2.2,null,null);s.addText(it[0],{x:x+0.15,y:1.55,w:3.6,h:0.8,fontFace:HF,fontSize:34,bold:true,color:RED,margin:0,isTextBox:true});para(s,it[1],x+0.15,2.4,3.6,1.25,11.5);});
 card(s,0.6,3.9,5.9,2.9,'Tiga sumber pendapatan (Premier League 2007–08)','Matchday £554 juta: dibatasi kapasitas stadion.\nBroadcasting £931 juta (naik 43%): kontrak 2006 £2,7 miliar, rata-rata £45 juta per klub per tahun; UEFA membayar lebih dari €30 juta ke tiap klub besar Liga Champions 2008–09.\nCommercial £447 juta: terpusat di sedikit klub.');
 card(s,6.7,3.9,6.0,2.9,'Aturan main dan logika ekonominya','Empat teratas Premier League lolos Liga Champions. Sejak 1992 muncul jurang keuangan antara empat klub teratas dan sisanya. Harga pemain meledak musim panas 2009 meski resesi; pendorongnya Real Madrid, lalu Chelsea, lalu Manchester City (£185 juta dalam satu musim). Pemilik asing kaya: Abramovich (Chelsea), Sheikh Mansour (Manchester City). MU dan Liverpool dibeli dengan utang, sehingga tidak menerima suntikan kas seperti itu.');
}
// 21 Q1 on pitch
{const s=base('PERTANYAAN 1 · DITERAPKAN','Di lapangan: posisi bersaing di atas rata-rata',CASE+', Table 6.1, 6.2; hlm. 584. Ukuran skuad dan usia rata-rata dari tabel kasus yang dirujuk kelompok.');
 const st=[['1.460','Poin performa Eropa 2000–2009, tertinggi (Table 6.2). Barcelona 1.411, Real Madrid dan Bayern 1.314, Arsenal 1.310, Chelsea 1.276'],['11','Gelar liga Inggris 1993–2009 (Table 6.1), termasuk tiga beruntun 2007, 2008, 2009'],['2008','Juara Liga Champions, gelar Eropa kedua era Ferguson setelah 1999 (liga, FA Cup, European Cup, Intercontinental Cup)']];
 st.forEach((it,i)=>{const x=0.6+i*4.1;card(s,x,1.5,3.9,2.4,null,null);s.addText(it[0],{x:x+0.15,y:1.55,w:3.6,h:0.8,fontFace:HF,fontSize:34,bold:true,color:RED,margin:0,isTextBox:true});para(s,it[1],x+0.15,2.4,3.6,1.45,11.5);});
 s.addChart(pres.charts.BAR,[{name:'Poin Eropa 2000–09',labels:['Man United','Barcelona','Real Madrid','Bayern','Arsenal','Chelsea'],values:[1460,1411,1314,1314,1310,1276]}],{x:0.6,y:4.1,w:7.4,h:2.8,barDir:'bar',chartColors:[RED],showValue:true,dataLabelPosition:'outEnd',dataLabelFontSize:10,catAxisLabelFontSize:10,valAxisLabelFontSize:9,valAxisMinVal:1200,valAxisMaxVal:1500,showLegend:false,showTitle:true,title:'Poin performa Eropa 2000–2009 (Table 6.2)',titleFontSize:11,titleColor:DARK,valGridLine:{color:'E6E6E6',size:0.5},catGridLine:{style:'none'}});
 card(s,8.2,4.1,4.5,2.8,'Indikator kedua Thompson terpenuhi','Posisi dan kekuatan bersaing membaik: tiga gelar beruntun dan poin Eropa tertinggi. Kasus: MU "emphasized the development of outstanding young talent and blending it with mature, highly experienced players" (hlm. 583).',{bs:12});
}
// 22 Q1 financial
{const s=base('PERTANYAAN 1 · DITERAPKAN','Keuangan: paling untung di Eropa, tetapi berutang',CASE+', Appendix (laporan keuangan 2000–2008), Table 6.5 (Forbes 2009), Table 6.6.');
 s.addChart(pres.charts.BAR,[{name:'Pendapatan (£ juta)',labels:['2000','2001','2002','2003','2004','2005','2006','2007','2008'],values:[116.0,129.6,146.1,173.0,169.1,157.2,167.8,212.2,257.1]}],{x:0.6,y:1.5,w:7.4,h:3.4,chartColors:[RED],showValue:true,dataLabelPosition:'outEnd',dataLabelFontSize:9,catAxisLabelFontSize:10,valAxisLabelFontSize:9,showLegend:false,showTitle:true,title:'Pendapatan Manchester United, £ juta (Appendix kasus)',titleFontSize:11,titleColor:DARK,valGridLine:{color:'E6E6E6',size:0.5},catGridLine:{style:'none'}});
 para(s,'2000–2004: Manchester United plc, 12 bulan sampai 31 Juli. 2005–2008: Manchester United Limited, 11 bulan sampai 30 Juni. Kasus menyatakan kedua periode tidak sepenuhnya sebanding.',0.6,4.95,7.4,0.6,10,GREY);
 const st=[['18,2%','Net profit margin 2008: laba £46,8 juta atas pendapatan £257,1 juta (Appendix)'],['12,6%','Return on sales 2000–2006 (Table 6.6), tertinggi dari 10 klub; Arsenal 5,6%, Bayern 4,7%, Real Madrid 0,4%'],['€101,9 jt','EBITDA menurut Forbes 2009 (Table 6.5), tertinggi di Eropa. Margin 31,4% vs Barcelona 22,3%, Real Madrid 14,1%'],['£616 jt','Utang (Table 6.5), tertinggi kedua setelah Arsenal £896 juta; berasal dari akuisisi Glazer 2005 yang dibiayai pinjaman (hlm. 579, 584)']];
 st.forEach((it,i)=>{const y=1.5+i*1.35;card(s,8.2,y,4.5,1.2,null,null);s.addText(it[0],{x:8.35,y:y+0.08,w:1.6,h:0.5,fontFace:HF,fontSize:20,bold:true,color:RED,margin:0,isTextBox:true});para(s,it[1],10.0,y+0.1,2.6,1.05,10.5);});
 card(s,0.6,5.7,7.4,1.15,null,'Ekuitas pemegang saham £294 juta (2008). Laba penjualan pemain £21,8 juta pada 2008. Amortisasi kontrak pemain naik dari £13,1 juta (2000) ke £35,5 juta (2008).',{fill:'FBEBD0',bs:11.5});
}
// 23 Q1 conclusion transfer
{const s=base('PERTANYAAN 1 · KESIMPULAN','Prestasi puncak, belanja transfer bersih moderat',CASE+', hlm. 580 dan 586; angka belanja bersih 2003–2009 dari Table 6.7 kasus sebagaimana dirujuk kelompok.');
 s.addChart(pres.charts.BAR,[{name:'Belanja transfer bersih 2003–09 (£ juta)',labels:['Real Madrid','Chelsea','Barcelona','Liverpool','Bayern','Man United','Arsenal'],values:[438,430,249,157,122,100,22]}],{x:0.6,y:1.5,w:7.0,h:5.2,barDir:'bar',chartColors:[RED],showValue:true,dataLabelPosition:'outEnd',dataLabelFontSize:10,catAxisLabelFontSize:10,valAxisLabelFontSize:9,showLegend:false,showTitle:true,title:'Belanja transfer bersih 2003–2009, £ juta (Table 6.7)',titleFontSize:11,titleColor:DARK,valGridLine:{color:'E6E6E6',size:0.5},catGridLine:{style:'none'}});
 card(s,7.8,1.5,4.9,2.4,'Apa kata kasus','"Manchester United’s net expenditure on player transfers has been relatively modest compared to other leading European clubs" (hlm. 586). "Real Madrid and Chelsea were distinguished by their massive expenditures on star players" (hlm. 580).',{bs:12});
 card(s,7.8,4.05,4.9,2.75,'Jawaban Q1','Strategi MU bekerja sangat baik: kedua indikator Thompson terpenuhi di industri yang sebagian besar pelakunya merugi. Real Madrid membelanjakan sekitar 4,4 kali belanja bersih MU dengan poin Eropa lebih rendah. Pertanyaan berikutnya: apa penyebabnya, dan apakah penyebab itu bertahan tanpa Ferguson.',{bs:12});
}
// 24 SWOT MU
{const s=base('PERTANYAAN 2 · DITERAPKAN','SWOT Manchester United Juli 2009, sampai simpulan',CASE+', hlm. 573, 579, 584–587; Table 6.3, 6.5, 6.6.');
 const q=[['S','Strengths','• Merek global: 80 juta pendukung di Asia; 1,2 juta pemegang kartu kredit MU di Korea Selatan\n• Laba tertinggi di Eropa: EBITDA €101,9 juta; RoS 12,6%\n• Akademi dan lebih dari 20 pemandu bakat\n• Disiplin transfer: menjual di puncak nilai (Ronaldo £80 juta)'],['W','Weaknesses','• Utang £616 juta warisan akuisisi Glazer 2005\n• Sistem olahraga bergantung pada Ferguson, 68 tahun pada akhir 2009\n• Belum ada pengganti; Ferguson belum mengumumkan pensiun\n• Dewan terdiri atas enam anak Glazer (hlm. 584)'],['O','Opportunities','• Aon: "Asia, particularly India and China, are prime targets"\n• Sponsor per negara masih dapat diperbanyak (Tri Indonesia, Bharti Airtel)\n• Hak siar Premier League naik 43% dalam setahun\n• Kanal sendiri: MUTV, MU Mobile, toko daring'],['T','Threats','• Harga pemain meledak; Manchester City £185 juta\n• Pemilik sangat kaya di Chelsea dan Manchester City\n• Beban bunga membatasi daya beli\n• Ronaldo, satu-satunya pemain MU di peringkat FIFA (Table 6.3), sudah dijual']];
 q.forEach((it,i)=>{const col=i%2,row=Math.floor(i/2);const x=0.6+col*6.15,y=1.5+row*2.35;card(s,x,y,6.0,2.2,null,null);s.addText(it[0],{x:x+0.15,y:y+0.1,w:0.6,h:0.6,fontFace:HF,fontSize:26,bold:true,color:RED,margin:0,isTextBox:true});s.addText(it[1],{x:x+0.75,y:y+0.22,w:2,h:0.4,fontFace:BF,fontSize:13,bold:true,color:DARK,margin:0,isTextBox:true});para(s,it[2],x+0.15,y+0.7,5.7,1.5,10.5);});
 card(s,0.6,6.25,12.15,0.6,null,'Simpulan (langkah 2 Figure 4.2): kekuatan cukup untuk menangkap peluang komersial Asia, tetapi tidak cukup menutup kelemahan ketergantungan pada Ferguson, karena kekuatan itu sendiri sebagian besar hasil kerjanya.',{fill:'FBEBD0',bs:11.5});
}
// 25 Resource inventory
{const s=base('PERTANYAAN 3 · DITERAPKAN','Inventarisasi resource MU dengan tipologi Table 4.3',CASE+', hlm. 573, 584–587; Appendix.');
 card(s,0.6,1.5,6.0,5.3,'Tangible','Finansial: EBITDA €101,9 juta; laba bersih £46,8 juta; ekuitas £294 juta; kas dari penjualan Ronaldo £80 juta.\n\nFisik: Old Trafford, diperluas 7.500 kursi pada 2006; museum, tur stadion, suite dan ballroom yang disewakan.\n\nOrganisasional: pemisahan urusan tim (Ferguson) dan komersial (Gill, Arnold); anak usaha Manchester United International sejak 1998.\n\nKontrak: kontrak pemain; portofolio sponsor (Nike, Aon mulai 2010, Budweiser, Audi, Hublot, dan lainnya).',{bs:12.5});
 card(s,6.75,1.5,6.0,5.3,'Intangible','Merek: "We’re not just a sports club, we are an international brand" (Andy Anson). Sub-merek Fred the Red, MUFC, Red Devil.\n\nBasis pendukung: 80 juta di Asia; 1,2 juta pemegang kartu kredit MU di Korea Selatan.\n\nHuman assets: Ferguson sejak 1986; lebih dari 20 pemandu bakat; dua pemandu penuh waktu di Brasil sejak 2008.\n\nReputasi dan relasi: Aon menyebut MU "has no equal in sports when it comes to global brand awareness"; AIG melompat ke peringkat 47 merek dunia dalam setahun.\n\nAset paling berharga hampir seluruhnya tak berwujud, dan sebagian melekat pada orang yang bisa pergi.',{bs:12.5});
}
// 26 Capabilities ladder
{const s=base('PERTANYAAN 3 · DITERAPKAN','Capability MU: core, distinctive, atau competence',CASE+', hlm. 584–587.');
 const c=[['CORE','Mengenali dan mengembangkan bakat','Pemandu bakat dari 5 menjadi lebih dari 20; Youth Academy "the finest youth coaching program in the country"; generasi 1992 (Giggs, Beckham, Scholes, Neville).'],['CORE','Membentuk tim, bukan kumpulan bintang','"The best teams stand out because they are teams"; prinsip tidak ada pemain lebih besar dari klub.'],['CORE','Mengubah merek jadi uang','Sponsor per negara, sub-merek per usia, MU Finance, MU Mobile, MUTV, Soccer Schools, tur Asia.'],['DISTINCTIVE','Disiplin di pasar transfer','Menjual di puncak nilai: Beckham, Verón, van Nistelrooy, Ronaldo (£80 juta). Belanja bersih moderat.'],['DISTINCTIVE','Rotasi skuad','Kasus menyebut Ferguson "a pioneering exponent of squad rotation".'],['COMPETENCE','Tata kelola dan pemisahan peran','Glazer memilih peran pasif; Ferguson dan Gill diberi kebebasan. Berjalan baik, tetapi bukan pembeda.']];
 c.forEach((it,i)=>{const col=i%3,row=Math.floor(i/3);const x=0.6+col*4.1,y=1.5+row*2.45;card(s,x,y,3.9,2.3,null,null);s.addText(it[0],{x:x+0.15,y:y+0.1,w:3.6,h:0.3,fontFace:BF,fontSize:10,bold:true,color:it[0]==='CORE'?RED:(it[0]==='DISTINCTIVE'?GOLD:GREY),charSpacing:2,margin:0,isTextBox:true});s.addText(it[1],{x:x+0.15,y:y+0.4,w:3.6,h:0.55,fontFace:BF,fontSize:13,bold:true,color:DARK,margin:0,isTextBox:true,valign:'top'});para(s,it[2],x+0.15,y+1.0,3.6,1.25,10.5);});
 para(s,'Empat dari enam capability (bakat, pembentukan tim, disiplin transfer, rotasi) bergantung pada orang yang sama. Hanya kemampuan komersial yang tidak bergantung pada Ferguson.',0.6,6.45,12.1,0.45,12,RED,true);
}
// 27 VRIN corrected
{const s=base('PERTANYAAN 3 · UJI VRIN','Dua keunggulan diuji: lolos empat tes, risiko berbeda',CASE+', hlm. 582–583, 586; Table 6.8. Definisi tes: '+BOOK+', hlm. 101–102. Konsep transferability: Grant, Contemporary Strategy Analysis (dalam daftar bacaan silabus).');
 const rows=[[{text:'Tes',options:{bold:true,color:WHITE,fill:{color:RED}}},{text:'Sistem Ferguson (resource bundle)',options:{bold:true,color:WHITE,fill:{color:RED}}},{text:'Merek dan mesin komersial',options:{bold:true,color:WHITE,fill:{color:RED}}}],
 [{text:'Valuable',options:{bold:true}},'LOLOS. Poin Eropa tertinggi, tiga gelar beruntun, Liga Champions 2008, laba tertinggi di Eropa.','LOLOS. Aon £80 juta per 4 tahun (£20 juta per tahun), tertinggi di antara klub Inggris yang disebut kasus; Arsenal–Emirates £100 juta per 15 tahun, Chelsea–Samsung £50 juta per 5 tahun.'],
 [{text:'Rare',options:{bold:true}},'LOLOS. Table 6.8 memuat sedikit pelatih paling dihormati dunia; Ferguson yang masa jabatannya terpanjang di satu klub.','LOLOS. 80 juta pendukung di Asia. Kasus: hanya Real Madrid yang setara dalam mengeksploitasi merek global.'],
 [{text:'Inimitable',options:{bold:true}},'LOLOS. Kasus: penentu performa tim "remained a mystery … defies analysis" (causal ambiguity); 23 tahun akumulasi; social complexity.','LOLOS. Dibangun puluhan tahun lewat prestasi dan siaran. Chelsea dan Manchester City dengan dana lebih besar belum menyamainya.'],
 [{text:'Nonsubstitutable',options:{bold:true}},'LOLOS. Pesaing mencoba mengganti sistem dengan uang: "Real Madrid and Chelsea’s lavishing of vast sums of money … has yielded teams that have failed to achieve greatness" (hlm. 583).','LOLOS. Tidak ada pengganti bagi loyalitas pendukung; sponsor membeli akses ke basis fan, bukan ke stadion atau pemain tertentu.']];
 s.addTable(rows,{x:0.6,y:1.5,w:12.1,colW:[1.8,5.15,5.15],fontFace:BF,fontSize:10.5,color:DARK,border:{type:'solid',pt:0.5,color:'D9C6C8'},valign:'top'});
 card(s,0.6,5.75,12.1,1.1,'Kesimpulan Q3 (koreksi dari versi sebelumnya)','Sistem Ferguson lolos keempat tes, jadi ia sumber keunggulan yang bertahan terhadap pesaing. Risikonya bukan substitusi, melainkan transferability: aset itu melekat pada satu orang, bukan pada organisasi. Klub memperlakukannya sebagai resource yang dimiliki, padahal ia harus menjadi capability yang melekat pada klub.',{bs:11.5,fill:'FBEBD0'});
}
// 28 Dynamic capability timeline
{const s=base('PERTANYAAN 3 · DYNAMIC CAPABILITY','Tiga kali membangun ulang tim juara',CASE+', hlm. 583–584.');
 const t=[['1986–1993','Membersihkan dan membangun fondasi','Ferguson menyingkirkan pemain yang dinilai kurang berbakat atau berkomitmen, mempertahankan Bryan Robson, mendatangkan Hughes, Ince, Cantona, Keane; menegakkan disiplin latihan dan melarang alkohol.','FA Cup 1990 · Cup Winners’ Cup 1991 · gelar liga 1993'],['1994–2003','Generasi akademi','Juara liga junior 1990 menghasilkan Giggs, Beckham, Butt, Gary dan Phil Neville, Scholes; menjadi inti tim yang mendominasi Inggris.','Puncak 1999: liga, FA Cup, European Cup, Intercontinental Cup'],['2003–2008','Regenerasi kedua','Beckham, Keane, Schmeichel, Cole, Sheringham, Stam dijual. Pengganti: Ferdinand, Ronaldo, Rooney, van der Sar, Evra, Vidić, Carrick.','Liga Champions 2008 · tiga gelar liga beruntun 2007–2009']];
 t.forEach((it,i)=>{const x=0.6+i*4.1;card(s,x,1.5,3.9,4.4,null,null);s.addText(it[0],{x:x+0.15,y:1.6,w:3.6,h:0.5,fontFace:HF,fontSize:20,bold:true,color:RED,margin:0,isTextBox:true});s.addText(it[1],{x:x+0.15,y:2.15,w:3.6,h:0.5,fontFace:BF,fontSize:13,bold:true,color:DARK,margin:0,isTextBox:true});para(s,it[2],x+0.15,2.7,3.6,2.1,11);para(s,it[3],x+0.15,4.9,3.6,0.9,10.5,RED,true);});
 card(s,0.6,6.05,12.1,0.8,null,'Pertanyaan utama kasus: kemampuan memperbarui diri ini milik Ferguson atau milik klub? Setelah Matt Busby pensiun 1969, MU tidak juara liga selama 18 tahun sampai Ferguson datang (hlm. 583).',{fill:'FBEBD0',bs:12});
}
// 29 Value chain MU
{const s=base('PERTANYAAN 4 · DITERAPKAN','Rantai nilai klub: keunggulan biaya MU ada di hulu',CASE+', hlm. 578, 585–587; Appendix. Aktivitas dirumuskan ulang sesuai anjuran buku hlm. 105.');
 const acts=[['Mendapatkan pemain','Akademi, 20+ pemandu bakat, pasar transfer'],['Latihan dan bertanding','Disiplin latihan, rotasi skuad, kontrol lini tengah'],['Menyalurkan tontonan','Hak siar liga dan UEFA, MUTV, Old Trafford'],['Menjual merek','Aon, Nike, sponsor per negara, tur Asia'],['Melayani pendukung','Superstore, museum, Soccer Schools, MU Mobile']];
 acts.forEach((it,i)=>{const x=0.6+i*2.45;card(s,x,1.5,2.35,1.75,null,null,{fill:i===0?'F2DADD':TINT});circle(s,i+1,x+0.15,1.62,0.4);s.addText(it[0],{x:x+0.65,y:1.58,w:1.6,h:0.55,fontFace:BF,fontSize:11,bold:true,color:DARK,margin:0,isTextBox:true,valign:'top'});para(s,it[1],x+0.15,2.2,2.05,1.0,9.5,GREY);});
 para(s,'Aktivitas pendukung: metodologi akademi dan inovasi rotasi skuad (R&D); rekrutmen, struktur gaji, disiplin (SDM); pemisahan peran Gill dan Ferguson, MU International (administrasi umum).',0.6,3.35,12.1,0.5,11,GREY);
 card(s,0.6,3.9,5.9,2.9,'Di mana letak keunggulan biayanya','Gaji sekitar 50% pendapatan, dibanding rata-rata Premier League 62%, Serie A 68%, Chelsea 81% (hlm. 578).\nAkademi memasok pemain tanpa biaya transfer; belanja bersih moderat.\nMenjual di puncak harga: Ronaldo £80 juta (rekor dunia); laba penjualan pemain £21,8 juta pada 2008 saja.\nCatatan: amortisasi pemain naik dari £13,1 juta (2000) ke £35,5 juta (2008).',{bs:12});
 card(s,6.7,3.9,6.0,2.9,'Nilai bagi dua pihak yang berbeda','Bagi pendukung: prestasi, sejarah, dan pengalaman Old Trafford.\nBagi sponsor: akses ke 80 juta pendukung Asia. Bukti efektivitasnya: AIG "came from nowhere on the list of the world’s top 100 brands to 47th" dalam setahun pertama (hlm. 573).\n\nKeunggulan biaya di aktivitas pertandingan berasal dari aktivitas hulu, sama seperti keunggulan biaya AirAsia di penerbangan berasal dari utilisasi dan waktu putar.',{bs:12});
}
// 30 Benchmarking chart
{const s=base('PERTANYAAN 4 · BENCHMARKING','Tolok ukur yang benar: margin, bukan pendapatan',CASE+', Table 6.5 (Forbes 2009) dan Table 6.6; margin dihitung dari EBITDA dibagi pendapatan.');
 s.addChart(pres.charts.BAR,[{name:'Margin EBITDA (%)',labels:['Man United','Barcelona','Arsenal','AC Milan','Juventus','Liverpool','Real Madrid','Bayern','Inter','Chelsea'],values:[31.4,22.3,19.3,17.6,17.5,15.8,14.1,12.7,9.9,-3.1]}],{x:0.6,y:1.5,w:7.2,h:5.3,barDir:'bar',chartColors:[RED],showValue:true,dataLabelPosition:'outEnd',dataLabelFontSize:9.5,catAxisLabelFontSize:10,valAxisLabelFontSize:9,showLegend:false,showTitle:true,title:'Margin EBITDA klub Eropa, % (dihitung dari Table 6.5)',titleFontSize:11,titleColor:DARK,catAxisLabelPos:'low',valAxisMinVal:-5,valAxisMaxVal:35,valGridLine:{color:'E6E6E6',size:0.5},catGridLine:{style:'none'}});
 card(s,8.0,1.5,4.7,2.6,'Tiga model perolehan pemain','Membeli pemain terbaik: Real Madrid, Chelsea. Pendapatan tinggi, laba rendah atau negatif.\nMengembangkan sendiri: Barcelona, Arsenal, Bayern. Laba positif dengan pendapatan lebih rendah.\nGabungan keduanya: MU membeli bintang tetapi menjual saat klub lain menilai lebih tinggi (hlm. 580, 583).',{bs:11.5});
 card(s,8.0,4.25,4.7,2.55,'Praktik terbaik yang terbukti','Return on sales 2000–2006 (Table 6.6): MU 12,6%, Arsenal 5,6%, Bayern 4,7%, Real Madrid 0,4%, Chelsea −60,4%, Inter −78,4%.\n\nBenchmarking mengubah dugaan VRIN menjadi bukti: sistem pengembangan dan perdagangan pemain benar-benar lebih unggul, bukan sekadar cerita.',{bs:11.5});
}
// 31 Competitive strength matrix
{const s=base('PERTANYAAN 5 · DITERAPKAN','Matriks kekuatan: unggul tipis, bertumpu satu baris','Bobot dan rating disusun kelompok dari Table 6.2, 6.3, 6.5, 6.6, 6.7 kasus. Isi sel: rating (1–10) / skor tertimbang. Jumlah bobot 1,00.');
 const H=(t)=>({text:t,options:{bold:true,color:WHITE,fill:{color:RED},align:'center'}});
 const rows=[[H('Key Success Factor'),H('Bobot'),H('Man United'),H('Real Madrid'),H('Barcelona'),H('Chelsea'),H('Arsenal')],
 ['Kualitas skuad','0,15','6 / 0,90','9 / 1,35','10 / 1,50','9 / 1,35','6 / 0,90'],
 ['Kemampuan manajer','0,15','10 / 1,50','5 / 0,75','8 / 1,20','6 / 0,90','8 / 1,20'],
 ['Akademi dan pemandu bakat','0,10','9 / 0,90','3 / 0,30','9 / 0,90','3 / 0,30','8 / 0,80'],
 ['Merek dan basis pendukung','0,15','10 / 1,50','9 / 1,35','7 / 1,05','5 / 0,75','6 / 0,90'],
 ['Kemampuan komersial','0,10','10 / 1,00','9 / 0,90','7 / 0,70','5 / 0,50','6 / 0,60'],
 ['Profitabilitas','0,10','10 / 1,00','5 / 0,50','7 / 0,70','1 / 0,10','6 / 0,60'],
 ['Keleluasaan finansial (utang)','0,10','4 / 0,40','7 / 0,70','9 / 0,90','5 / 0,50','2 / 0,20'],
 ['Stadion dan matchday','0,05','9 / 0,45','8 / 0,40','9 / 0,45','5 / 0,25','9 / 0,45'],
 ['Rekam jejak prestasi','0,10','10 / 1,00','9 / 0,90','10 / 1,00','9 / 0,90','9 / 0,90'],
 [{text:'Total skor tertimbang',options:{bold:true}},{text:'1,00',options:{bold:true}},{text:'8,65',options:{bold:true,color:RED}},{text:'7,15',options:{bold:true}},{text:'8,40',options:{bold:true}},{text:'5,55',options:{bold:true}},{text:'6,55',options:{bold:true}}]];
 s.addTable(rows,{x:0.6,y:1.45,w:8.3,colW:[2.6,0.8,1.0,1.0,0.95,0.95,1.0],fontFace:BF,fontSize:10,color:DARK,border:{type:'solid',pt:0.5,color:'D9C6C8'},rowH:0.42,valign:'middle',align:'center'});
 const st=[['+0,25','MU 8,65 vs Barcelona 8,40. Selisih tipis dan bertumpu pada baris kemampuan manajer.'],['7,90','Skor MU jika rating manajer turun dari 10 ke 5 karena pergantian pelatih: berada di bawah Barcelona.'],['≥ 8,3','Rating minimal pengganti Ferguson agar MU sekadar sejajar Barcelona (8,65 − 1,50 + 0,15x ≥ 8,40).']];
 st.forEach((it,i)=>{const y=1.45+i*1.8;card(s,9.1,y,3.6,1.65,null,null);s.addText(it[0],{x:9.25,y:y+0.08,w:3.3,h:0.55,fontFace:HF,fontSize:22,bold:true,color:RED,margin:0,isTextBox:true});para(s,it[1],9.25,y+0.65,3.3,0.95,10.5);});
 para(s,'Uji kepekaan ini adalah "risk/scenario logic" yang diminta CO2 silabus: baris terlemah MU adalah keleluasaan finansial; keunggulan bersihnya bergantung pada keberhasilan suksesi.',0.6,6.4,8.3,0.5,11,GREY);
}
// 32 Priority list
{const s=base('PERTANYAAN 6 · DITERAPKAN','Priority list: enam isu sebagai pertanyaan','Rumusan mengikuti buku hlm. 118. Bukti dari '+CASE+'.');
 const p=[['Bagaimana mengganti Ferguson tanpa merusak sistemnya?','Gill belum memutuskan; Ferguson belum mengumumkan niat pensiun (hlm. 573, 588).'],['Apa yang harus dilakukan soal utang £616 juta?','Membatasi daya beli justru saat Manchester City belanja £185 juta (hlm. 579).'],['Bagaimana menambal skuad setelah Ronaldo pergi?','Tidak ada lagi pemain MU di peringkat FIFA Table 6.3; media menunggu apakah kas Ronaldo dipakai membeli Ribery (hlm. 588).'],['Apakah perlu membangun penyangga organisasi?','Kasus: seluruh infrastruktur pemanduan, latihan, dan taktik dibangun oleh satu orang (hlm. 573).'],['Bagaimana menjaga pendapatan komersial jika prestasi turun?','Gill: "So long as the team kept winning games … the commercial revenues … would continue to flow" (hlm. 573).'],['Apakah tata kelola tetap aman tanpa Ferguson dan Gill?','Dewan terdiri atas enam anak Glazer; peran pasif pemilik berjalan karena keduanya diberi kebebasan (hlm. 584).']];
 p.forEach((it,i)=>{const col=i%2,row=Math.floor(i/2);const x=0.6+col*6.15,y=1.5+row*1.75;card(s,x,y,6.0,1.6,null,null);circle(s,i+1,x+0.15,y+0.15,0.45);s.addText(it[0],{x:x+0.75,y:y+0.1,w:5.1,h:0.6,fontFace:BF,fontSize:12.5,bold:true,color:DARK,margin:0,isTextBox:true,valign:'top'});para(s,it[1],x+0.75,y+0.75,5.1,0.8,10.5,GREY);});
 para(s,'Isu 1 dan 4 serius dan menuntut perumusan strategi baru; isu 2, 3, 5, 6 dapat ditangani dengan menyempurnakan strategi yang ada.',0.6,6.8,12.1,0.3,11,RED,true);
}
// 33 Section C
section('BAGIAN C · KEPUTUSAN','Dari priority list ke keputusan: pola analisis kasus','Mengikuti Appendix 3 silabus: masalah (tujuan dan penghalang), alternatif berjudul tanpa pro-kontra, isu sebagai pertanyaan eksplisit, simpulan yang dideduksi dari isu dengan argumen kuantitatif, lalu rencana implementasi.');
// 34 Problem
{const s=base('LANGKAH 1 · MASALAH','Tujuan yang ingin dicapai dan penghalangnya','Appendix 3 silabus: "The key words here are goals and barrier." Bukti dari '+CASE+'.');
 card(s,0.6,1.5,5.9,4.6,'Tiga tujuan','1. Mempertahankan posisi empat besar Premier League setiap musim agar pendapatan Liga Champions (lebih dari €30 juta dari UEFA per musim) dan daya tarik sponsor terjaga.\n\n2. Mempertahankan profitabilitas dengan upah sekitar 50% pendapatan dan margin EBITDA 31,4%.\n\n3. Mempertahankan sistem pengembangan bakat dan pembentukan tim yang lolos keempat tes VRIN.',{bs:12.5});
 card(s,6.7,1.5,6.0,4.6,'Tiga penghalang','1. Ferguson berusia 68 pada akhir 2009 dan sistem itu berpusat padanya, dengan causal ambiguity tinggi: penentu performa tim "defies analysis".\n\n2. Utang £616 juta membatasi kemampuan menutup kesalahan transisi dengan belanja; MU "had not received the influx of cash" seperti Chelsea atau Manchester City.\n\n3. Pesaing berpemilik kaya sedang menaikkan harga pemain, sehingga kegagalan sistem internal akan mahal untuk diganti dengan pembelian.',{bs:12.5});
 card(s,0.6,6.25,12.1,0.6,null,'Masalahnya: bagaimana memindahkan capability yang melekat pada seseorang menjadi capability yang melekat pada organisasi, dalam jangka waktu yang ditentukan oleh usia orang itu.',{fill:'FBEBD0',bs:12});
}
// 35 Alternatives
{const s=base('LANGKAH 2 · ALTERNATIF','Tiga alternatif berjudul, tanpa pro dan kontra','Appendix 3 silabus: "Strategies may be usefully given titles … Arguments pro or con … should NOT be included" pada tahap ini. Kandidat dari '+CASE+', hlm. 588.');
 const a=[['A','Kesinambungan Internal','Mengangkat salah satu asisten Ferguson (Queiroz, Phelan, Solskjær, atau McClair) sebagai manajer tim dengan mandat mempertahankan sistem pemanduan bakat, akademi, dan rotasi skuad apa adanya. Ferguson mendampingi sebagai mentor pada musim pertama.'],['B','Pemimpin Terbukti dari Luar','Mengangkat manajer berwibawa dengan rekam jejak (misalnya Mourinho) dan menerima bahwa sistem kepelatihan akan dibongkar dan dibangun ulang menurut caranya, dengan dukungan belanja pemain dari kas Ronaldo £80 juta.'],['C','Pelembagaan Sistem sebelum Suksesi','Memecah sistem Ferguson menjadi fungsi yang dipegang orang berbeda (direktur pemanduan bakat, direktur akademi, direktur sepak bola yang menetapkan filosofi permainan dan kebijakan transfer), lalu mengangkat manajer tim, dari dalam atau luar, yang bekerja di dalam struktur itu dengan batas upah 50% pendapatan.']];
 a.forEach((it,i)=>{const x=0.6+i*4.1;card(s,x,1.5,3.9,5.3,null,null);s.addText(it[0],{x:x+0.15,y:1.6,w:0.8,h:0.8,fontFace:HF,fontSize:40,bold:true,color:RED,margin:0,isTextBox:true});s.addText(it[1],{x:x+0.95,y:1.75,w:2.8,h:0.9,fontFace:BF,fontSize:15,bold:true,color:DARK,margin:0,isTextBox:true,valign:'top'});para(s,it[2],x+0.15,2.7,3.6,4.0,12);});
}
// 36 Issues
{const s=base('LANGKAH 3 · ISU','Tiga isu sebagai pertanyaan, dijawab dari Bagian B','Appendix 3 silabus: "Issues may be usefully conceived as explicit questions." Bukti dari '+CASE+'.');
 const is=[['Apakah sistem Ferguson dapat dipisahkan dari Ferguson?','Uji VRIN (slide 27): sistem itu resource bundle dengan komponen yang dikenali: jaringan pemandu bakat, akademi, disiplin latihan, filosofi permainan, kebijakan transfer. Sebagian besar dapat dilembagakan; kemampuan mengendalikan bintang mungkin tidak.','Mendukung C; membatasi A.'],['Apakah orang dalam sanggup berwibawa di hadapan bintang?','Kasus ragu: apakah asisten "could have the presence and strength of personality needed to exert leadership and authority over Manchester United’s high profile soccer stars" (hlm. 588). Prinsip tidak ada pemain lebih besar dari klub menuntut wibawa itu.','Melemahkan A.'],['Apakah neraca sanggup menanggung perombakan total?','Benchmarking (slide 30): model membeli pemain menghasilkan RoS 0,4% di Real Madrid dan −60,4% di Chelsea. Dengan utang £616 juta dan tanpa suntikan kas pemilik, MU tidak dapat meniru model itu.','Menggugurkan B.']];
 is.forEach((it,i)=>{const y=1.5+i*1.75;circle(s,i+1,0.6,y+0.1,0.5);card(s,1.25,y,7.6,1.6,it[0],it[1],{bs:10.5});card(s,9.0,y,3.7,1.6,'Implikasi',it[2],{bs:12});});
}
// 37 Counter-argument
{const s=base('ARGUMEN TANDINGAN','Membela alternatif B, lalu menguji dengan bukti','Rubrik nilai A silabus menuntut "conflicting arguments, perspectives or problem-solving approaches". Bukti dari '+CASE+', hlm. 582–583, 588; Table 6.6, 6.8.');
 card(s,0.6,1.5,5.9,5.3,'Kasus terkuat untuk Pemimpin Terbukti dari Luar','• Kasus sendiri menyebut pelatih sebagai "the single person most responsible for its success" dan bahwa kesuksesan berkelanjutan "is almost always associated with a single coach" (hlm. 582).\n• Table 6.8 memuat Mourinho dengan sukses di tiga klub berbeda (Porto, Chelsea, Inter).\n• Setelah Busby pensiun, orang dalam gagal: 18 tahun tanpa gelar liga sampai orang luar (Ferguson dari Aberdeen) datang (hlm. 583).\n• Kas £80 juta dari Ronaldo tersedia untuk membiayai pembangunan ulang.',{bs:12});
 card(s,6.7,1.5,6.0,5.3,'Mengapa argumen itu tidak cukup','• Kasus juga menyatakan "coaches that achieve outstanding success with one team are often dismal failures with another" (hlm. 582): wibawa tidak otomatis pindah.\n• Yang dibawa Ferguson pada 1986 bukan pembelian bintang melainkan pembangunan sistem dari bawah; hasil pertamanya baru 1990 dan gelar liga 1993. Orang luar yang membongkar sistem mengulang tujuh tahun itu tanpa jaminan.\n• Real Madrid, yang bergonta-ganti pelatih ternama (Capello 1996–97 dan 2006–07, Hiddink 1998–99, Del Bosque 1999–2003, Sacchi 2004, Table 6.8), mencatat RoS 0,4% dan poin Eropa di bawah MU.\n• £80 juta setara satu pemain rekor dunia, bukan satu tim; dan setiap poundsterling yang dibelanjakan menaikkan rasio upah dari 50% menuju 81% Chelsea.',{bs:12});
}
// 38 Conclusion
{const s=base('LANGKAH 4 · SIMPULAN','Alternatif C terpilih: deduksi dari tiga isu','Appendix 3 silabus: simpulan "deduces the best alternative from facts" dan "should use them to build quantitative arguments". Angka dari '+CASE+' dan slide 31.');
 const pr=[['Premis 1','Aset yang lolos VRIN adalah sistem, bukan orang; tugas utama melindungi sistem.'],['Premis 2','Sistem itu resource bundle yang komponennya dapat dipisahkan; pelembagaan mungkin dilakukan.'],['Premis 3','Neraca tidak sanggup menanggung model membeli; perombakan total (B) gugur.'],['Premis 4','Wibawa di hadapan bintang adalah komponen yang paling sulit dilembagakan; manajer dipilih atas wibawa, tetapi diikat struktur agar tidak membongkar sistem (A saja tidak cukup).']];
 pr.forEach((it,i)=>{const y=1.5+i*1.05;card(s,0.6,y,6.6,0.95,null,null);s.addText([{text:it[0]+'. ',options:{bold:true,color:RED}},{text:it[1]}],{x:0.75,y:y+0.1,w:6.3,h:0.8,fontFace:BF,fontSize:11.5,color:DARK,margin:0,isTextBox:true,valign:'top'});});
 card(s,0.6,5.75,6.6,1.1,null,'Karena itu: lembagakan sistem lebih dulu (C), lalu pilih manajer berwibawa yang bekerja di dalamnya. C memuat kekuatan A tanpa kelemahannya, dan menutup pintu risiko B.',{fill:'FBEBD0',bs:12});
 const st=[['> €30 jt','Pendapatan UEFA per musim yang hilang bila gagal lolos Liga Champions (hlm. 577), belum termasuk matchday dan sponsor.'],['8,3','Rating manajer minimal agar skor MU sejajar Barcelona; tanpa struktur, kegagalan satu orang menurunkan skor ke 7,90.'],['50%','Batas upah terhadap pendapatan yang menjaga margin 31,4%; melampaui 62% berarti kembali ke rata-rata liga yang merugi.']];
 st.forEach((it,i)=>{const y=1.5+i*1.8;card(s,7.4,y,5.3,1.65,null,null);s.addText(it[0],{x:7.55,y:y+0.08,w:5,h:0.55,fontFace:HF,fontSize:22,bold:true,color:RED,margin:0,isTextBox:true});para(s,it[1],7.55,y+0.65,5.0,0.95,10.5);});
}
// 39 Implementation plan
{const s=base('RENCANA IMPLEMENTASI','KPI, jadwal, penanggung jawab, sumber daya, risiko','Sesuai CO2 silabus: "actionable implementation plans with KPIs, timelines, ownership, resources, and risk mitigation". Nama dan angka dasar dari '+CASE+'; target adalah usulan kelompok.');
 const H=(t)=>({text:t,options:{bold:true,color:WHITE,fill:{color:RED}}});
 const rows=[[H('Tindakan'),H('KPI'),H('Jadwal'),H('Penanggung jawab'),H('Sumber daya'),H('Risiko dan mitigasi')],
 ['Mendokumentasikan dan memecah sistem menjadi direktur pemanduan bakat, akademi, dan sepak bola','Tiga posisi terisi; kebijakan transfer dan filosofi permainan tertulis disetujui dewan','Musim 2009–10, selagi Ferguson menjabat','David Gill bersama Ferguson','Tiga posisi direktur; jauh di bawah upah satu pemain bintang','Ferguson menolak berbagi kewenangan: posisikan sebagai warisan, bukan pengurangan peran'],
 ['Memilih manajer tim yang bekerja di dalam struktur','Kontrak memuat batas upah 50% pendapatan dan kewenangan transfer bersama direktur sepak bola','Diumumkan sebelum akhir musim 2009–10','Dewan atas usulan Gill','Anggaran kompensasi manajer','Kandidat berwibawa menolak batasan: siapkan kandidat internal yang dilatih selama transisi'],
 ['Membelanjakan kas Ronaldo sesuai sistem, bukan untuk satu bintang','Belanja bersih di bawah £30 juta per musim; dua lulusan akademi masuk tim utama per musim','Jendela transfer 2009 dan 2010','Direktur sepak bola dan manajer','Kas £80 juta','Tekanan media dan pendukung: komunikasi rencana sejak awal'],
 ['Mengamankan pendapatan komersial Asia selagi prestasi tinggi','Pendapatan komersial dari Asia naik 20% per tahun; dua sponsor per negara baru di India dan China','2009–2012','Direktur komersial Richard Arnold','Tim komersial London; tur Asia','Prestasi turun selama transisi: kontrak multi-tahun dikunci sekarang'],
 ['Mengevaluasi dampak setiap akhir musim','Ulangi matriks slide 31: skor sistem kepelatihan tetap di atas 7; posisi empat besar; rasio upah di bawah 55%','Setiap Juni, mulai 2010','Dewan','Data internal','Skor turun di bawah 6 meski struktur terisi: ganti manajer, bukan bongkar struktur']];
 s.addTable(rows,{x:0.6,y:1.45,w:12.1,colW:[2.3,2.4,1.5,1.6,1.7,2.6],fontFace:BF,fontSize:9,color:DARK,border:{type:'solid',pt:0.5,color:'D9C6C8'},valign:'top'});
}
// 40 Sources
{const s=base('SUMBER DAN CATATAN VERIFIKASI','Setiap angka dapat ditelusuri ke kasus','Buku: Thompson, Peteraf, Gamble & Strickland (2024). Kasus: Grant (2010), Contemporary Strategy Analysis, 7th ed., Case 6. Silabus: RPKPS MAN 5422 2026.');
 card(s,0.6,1.5,5.9,5.3,'Peta sumber data kasus','Table 6.1: gelar liga 1980–2009.\nTable 6.2: poin performa Eropa 2000–2009.\nTable 6.3: peringkat pemain FIFA 2008–09.\nTable 6.4: transfer termahal.\nTable 6.5: pendapatan, EBITDA, nilai klub, utang (Forbes 2009).\nTable 6.6: return on sales 2000–2006.\nTable 6.7: belanja transfer (dirujuk kasus hlm. 580).\nTable 6.8: pelatih paling dihormati 1990–2007.\nAppendix: laporan keuangan MU 2000–2008.\nHlm. 573: tur Asia, Aon, 80 juta pendukung. Hlm. 577–579: pendapatan liga, gaji, pemilik. Hlm. 582–588: pelatih, era Ferguson, kepemilikan, gaya manajemen, komersial, kandidat pengganti.',{bs:11.5});
 card(s,6.7,1.5,6.0,5.3,'Catatan kejujuran analisis','• Bobot dan rating matriks kekuatan (slide 31) serta semua target rencana implementasi (slide 39) adalah penilaian kelompok, bukan data kasus.\n• Margin EBITDA (slide 30) dihitung kelompok dari Table 6.5.\n• Konsep transferability (slide 27) berasal dari buku teks Grant, bukan dari teks kasus.\n• Kasus berhenti pada Juli 2009; tidak ada informasi setelah itu yang dipakai dalam analisis.\n• Gambar Figure 4.1–4.4, Table 4.1–4.4, dan Capsule 4.1 diambil langsung dari PDF buku, tidak digambar ulang.',{bs:11.5});
}
// 41 Thank you
{n++;const s=pres.addSlide();s.background={color:RED};
 s.addText('Terima kasih',{x:0.8,y:2.3,w:11,h:1.0,fontFace:HF,fontSize:44,bold:true,color:WHITE,margin:0,isTextBox:true});
 s.addText('Kami membuka sesi tanya jawab dan diskusi. Pertanyaan yang paling kami harapkan: komponen mana dari sistem Ferguson yang menurut Anda tidak dapat dilembagakan, dan bukti apa yang mendukungnya?',{x:0.8,y:3.4,w:11.5,h:1.2,fontFace:BF,fontSize:16,color:'F3DCDF',margin:0,isTextBox:true});
 s.addText('Kelompok 4 · Fitra Aidila · Aulia Sisca Rahmadiyanti · Bagaskoro · Imam Prayudha · Tegar Awanto\nStrategic Management MAN 5422 · Dr. Rangga Almahendra, S.T., M.M.',{x:0.8,y:5.4,w:11.5,h:1.0,fontFace:BF,fontSize:12,color:'F3DCDF',margin:0,isTextBox:true});
 s.addText(String(n),{x:12.5,y:7.0,w:0.4,h:0.3,fontFace:BF,fontSize:9,color:'F3DCDF',align:'right',margin:0,isTextBox:true});
}
// 42-43 Appendix Table 4.1 continued
{const s=base('LAMPIRAN · TABLE 4.1 (LANJUTAN)','Rasio likuiditas, leverage, dan aktivitas',BOOK+', Table 4.1 hlm. 92.');fit(s,'tab4_1b',0.6,1.5,12.1,5.4);}
{const s=base('LAMPIRAN · TABLE 4.1 (LANJUTAN)','Ukuran kinerja keuangan penting lainnya',BOOK+', Table 4.1 hlm. 93.');fit(s,'tab4_1c',0.6,1.5,12.1,5.4);}

pres.writeFile({fileName:'SMJKT_Group 4_Case Manchester United.pptx'}).then(f=>console.log('written',f,'slides',n));
