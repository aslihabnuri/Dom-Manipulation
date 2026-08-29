const pptxgen = require("pptxgenjs");
const path = require("path");
const DIR = __dirname;
const P = new pptxgen();
P.layout = "LAYOUT_WIDE";
P.author = "Toni Black"; P.company = "Toni Black";
P.title = "Content Creator Brief";

const INK="282828", WHITE="FFFFFF", DAVIS="4F5052", GREY="818284", STEEL="CCCCCC";
const DISP="Zalando Sans Expanded", BODY="Arimo";
const W=13.3333, H=7.5, M=0.72, C=W-2*M;
const frame = n => path.join(DIR,"frames",n+".jpg");

// Nothing in this deck sits on a panel. Type goes straight onto the photograph;
// the only graphics are hairline rules and the outline of the page number.
const txt=(s,t,o)=>s.addText(t,{margin:0,...o});
const bleed=(s,n)=>{ s.background={color:INK}; s.addImage({path:frame(n),x:0,y:0,w:W,h:H}); };
const tile=(s,n,x,y,w,h)=>s.addImage({path:frame(n),x,y,w,h});
const rule=(s,x,y,w,c)=>s.addShape(P.ShapeType.rect,
  {x,y,w,h:0.012,fill:{color:c||STEEL},line:{color:c||STEEL}});

const head=(s,t,x,y,w,size,align)=>{ if(!w) throw new Error("head: width required"); return txt(s,t,
  {x,y,w,h:String(t).indexOf("\n")>=0?(size>=40?2.30:1.40):(size>=40?1.20:0.88),
   fontFace:DISP,fontSize:size,bold:true,
   charSpacing:size>=40?7:5,color:WHITE,align:align||"right",
   valign:"middle",lineSpacing:size*1.18}); };

const kick=(s,t,x,y,w,align)=>{ if(!w) throw new Error("kick: width required"); return txt(s,t,
  {x,y,w,h:0.26,fontFace:DISP,fontSize:8.5,bold:true,charSpacing:2.6,
   color:STEEL,align:align||"left",valign:"middle"}); };

const copy=(s,t,x,y,w,h,size,color)=>txt(s,t,
  {x,y,w,h,fontFace:BODY,fontSize:size||9.5,color:color||STEEL,
   lineSpacing:(size||9.5)*1.62,valign:"top"});

const num=(s,n)=>{
  s.addShape(P.ShapeType.ellipse,{x:W-M-0.34,y:0.50,w:0.34,h:0.34,
    fill:{type:"none"},line:{color:WHITE,width:0.6}});
  txt(s,n,{x:W-M-0.34,y:0.50,w:0.34,h:0.34,fontFace:BODY,fontSize:8.5,
    color:WHITE,align:"center",valign:"middle"});
};
const foot=s=>{
  rule(s,M,6.86,C,GREY);
  txt(s,"Content Creator Brief",{x:M,y:6.94,w:5,h:0.26,fontFace:BODY,fontSize:8.5,
    color:STEEL,valign:"middle"});
  txt(s,"Toni Black",{x:W-M-5,y:6.94,w:5,h:0.26,fontFace:DISP,fontSize:8.5,bold:true,
    charSpacing:1.6,color:WHITE,align:"right",valign:"middle"});
};
// the standard block: kicker, headline, hairline — all straight on the photo
const block=(s,kickText,title,x,y,w,size)=>{
  kick(s,kickText,x,y,w,"right");
  head(s,title,x,y+0.34,w,size||27,"right");
  const hy = y+0.34+(String(title).indexOf("\n")>=0?1.40:0.88)+0.10;
  rule(s,x,hy,w,GREY);
  return hy+0.28;
};

// ============================================================ COVER
{
  const s=P.addSlide(); bleed(s,"s01_cover");
  kick(s,"TONI BLACK",M,0.56,4);
  head(s,"CONTENT\nCREATOR BRIEF",M,3.10,10.6,44,"left");
  rule(s,M,5.66,3.10,STEEL);
  copy(s,"Panduan singkat sebelum kamu mulai syuting.",M,5.88,6.4,0.40,10,WHITE);
  txt(s,"2026",{x:W-M-3,y:5.88,w:3,h:0.40,fontFace:DISP,fontSize:10,bold:true,
    charSpacing:2.2,color:WHITE,align:"right",valign:"middle"});
  foot(s);
  s.addNotes("Brief untuk creator. Headline Inggris, isi Bahasa Indonesia.");
}

// ============================================================ 01 INTRO
{
  const s=P.addSlide(); bleed(s,"s02_intro"); num(s,"01"); foot(s);
  const x=6.10, w=W-M-x;
  const y=block(s,"BRIEF","INTRO",x,1.32,w);
  copy(s,"Brief ini berisi siapa yang kita ajak bicara, masalah apa yang dia hadapi, "
       +"dan apa yang membuat Toni Black terasa berbeda di kulit.\n\n"
       +"Baca sekali, simpan, lalu bikin dengan cara kamu sendiri. Semua contoh di sini "
       +"bahan mentah — bukan naskah yang harus dibacakan ulang.\n\n"
       +"Yang kami cari satu: konten jujur dari orang yang benar-benar memakainya.",
       x,y,w,3.00);
  s.addNotes("Contoh di brief ini pemantik, bukan skrip.");
}

// ============================================================ 02 THE CUSTOMER
{
  const s=P.addSlide(); bleed(s,"s03_customer"); num(s,"02"); foot(s);
  const x=6.10, w=W-M-x;
  const y=block(s,"WHO WE ARE TALKING TO","THE CUSTOMER",x,1.32,w);
  copy(s,"Dia menaruh kualitas di atas jumlah, dan menuntut lebih dari barang yang "
       +"dipakai seharian. Kenyamanan, potongan, dan mutu itu penting buat dia.\n\n"
       +"Harinya bergerak terus: kantor, urusan di luar, perjalanan, gym. Dia capek "
       +"dengan celana dalam yang berbulu, melar, hilang bentuk, dan mengunci panas di "
       +"cuaca Indonesia.\n\n"
       +"Mungkin dia sudah memakai brand mahal. Sekarang dia mencari yang harganya lebih "
       +"masuk akal, tanpa turun di kenyamanan, potongan, atau kualitas. Dia tahu pilihan "
       +"bagus itu ada — dia belum tentu tahu Toni Black.", x,y,w,3.30);
  txt(s,"KANTOR      KOMUTER      GYM",{x,y:6.20,w,h:0.28,fontFace:DISP,fontSize:8.5,
    bold:true,charSpacing:2.2,color:WHITE,align:"right",valign:"middle"});
  s.addNotes("Bukan pemula. Dia sudah tahu bedanya bahan bagus dan tidak.");
}

// ============================================================ 03 THE PROBLEM
{
  const s=P.addSlide(); bleed(s,"s04_problem"); num(s,"03"); foot(s);
  const x=6.10, w=W-M-x;
  const y=block(s,"WHAT IS BROKEN","THE PROBLEM",x,1.32,w);
  copy(s,"Kebanyakan celana dalam pria gagal di dua titik yang sama.",x,y,w,0.36,10,WHITE);
  [["01","Ukuran berhenti di large","Badan yang lebih besar tidak kebagian. Tidak ada "
    +"yang benar-benar muat, jadi dia terpaksa memakai yang kekecilan."],
   ["02","Bahan sintetis murah","Panas dan lembap terkunci di dalam. Di cuaca Indonesia "
    +"hasilnya lecet, bau, dan tidak nyaman seharian — dari duduk di meja sampai latihan."]]
   .forEach(([n,t,b],i)=>{
     const yy=y+0.72+i*1.62;
     txt(s,n,{x,y:yy,w:0.56,h:0.30,fontFace:DISP,fontSize:10,bold:true,charSpacing:1.6,
       color:WHITE,valign:"middle"});
     txt(s,t,{x:x+0.64,y:yy,w:w-0.64,h:0.30,fontFace:DISP,fontSize:13,bold:true,
       color:WHITE,valign:"middle"});
     rule(s,x,yy+0.40,w,DAVIS);
     copy(s,b,x,yy+0.54,w,0.90,9.5);
   });
  s.addNotes("Dua kegagalan ini yang paling sering disebut pembeli.");
}

// ============================================================ 04 THE PRODUCT
{
  const s=P.addSlide(); bleed(s,"s05_product"); num(s,"04"); foot(s);
  const x=6.10, w=W-M-x;
  const y=block(s,"WHY IT FEELS DIFFERENT","THE PRODUCT",x,1.32,w);
  copy(s,"Toni Black dibuat dari Modal — serat alami dari tumbuhan yang adem dan ringan "
       +"dari sananya, bukan karena diberi perlakuan kimia.\n\n"
       +"Melar ke empat arah, jadi potongannya mengikuti badan, bukan melawan badan.\n\n"
       +"Didukung R&D sendiri: ukuran S sampai XL, dicocokkan dan diuji untuk pria "
       +"60 kg sampai 150 kg. Jadi “ukuran gue nggak ada” bukan lagi masalah.",
       x,y,w,2.60);
  [["MODAL","Serat alami"],["4-WAY","Empat arah"],["60–150 KG","Diuji nyata"]]
    .forEach(([a,b],i)=>{
      const cw=(w-2*0.24)/3, cx=x+i*(cw+0.24);
      rule(s,cx,5.86,cw,DAVIS);
      txt(s,a,{x:cx,y:5.96,w:cw,h:0.32,fontFace:DISP,fontSize:12,bold:true,
        color:WHITE,valign:"middle"});
      copy(s,b,cx,6.30,cw,0.28,8.5);
    });
  s.addNotes("Modal itu serat alami. Ini pembeda utamanya, bukan klaim marketing.");
}

// ============================================================ 05 THE BENEFITS
{
  const s=P.addSlide(); bleed(s,"s06_benefits"); num(s,"05"); foot(s);
  kick(s,"WHAT HE ACTUALLY FEELS",M,1.32,C,"right");
  head(s,"THE BENEFITS",M,1.66,C,27,"right");
  const cw=(C-3*0.30)/4;
  [["BREATHABLE","Dibuat untuk panas dan lembap Indonesia, bukan sekadar diklaim begitu."],
   ["LIGHTWEIGHT","Ringan sampai hampir tidak terasa, dari pagi sampai malam."],
   ["4-WAY STRETCH","Ikut gerak. Tidak naik, tidak menekan, tidak perlu dibetulkan."],
   ["COMFORT FIRST","Bukan cuma berfungsi. Memang nyaman dipakai."]]
   .forEach(([t,b],i)=>{
     const cx=M+i*(cw+0.30);
     rule(s,cx,5.28,cw,STEEL);
     txt(s,t,{x:cx,y:5.40,w:cw,h:0.32,fontFace:DISP,fontSize:11,bold:true,
       charSpacing:1.4,color:WHITE,valign:"middle"});
     copy(s,b,cx,5.78,cw,0.86,9);
   });
  s.addNotes("Empat manfaat ini boleh dipakai sebagai struktur voiceover.");
}

// ============================================================ 06 THE OBJECTIONS
{
  const s=P.addSlide(); bleed(s,"s07_object"); num(s,"06"); foot(s);
  kick(s,"WHEN SOMEONE PUSHES BACK",M,1.32,C,"right");
  head(s,"THE OBJECTIONS",M,1.66,C,27,"right");
  const cw=(C-0.70)/2;
  [["“Toni Black mahal”",
    "Ubah hitungannya jadi biaya per pakai. Celana dalam murah cepat rusak, dan tidak "
    +"nyaman selama kamu memilikinya. Toni Black bertahan lebih lama dan terasa lebih "
    +"enak tiap kali dipakai. Di situ nilainya."],
   ["“Bukan polyester — emang lebih bagus?”",
    "Bahas Modal sebagai serat alami yang adem. Jangan menjelekkan bahan sintetis — "
    +"Toni Black bisa memakainya untuk lini activewear nanti. Cukup tunjukkan apa yang "
    +"membuat Modal terasa berbeda di kulit."]]
   .forEach(([q,a],i)=>{
     const cx=M+i*(cw+0.70);
     rule(s,cx,4.42,cw,STEEL);
     kick(s,"KEBERATAN",cx,4.56,cw);
     txt(s,q,{x:cx,y:4.88,w:cw,h:0.76,fontFace:DISP,fontSize:15,bold:true,
       color:WHITE,lineSpacing:19});
     kick(s,"JAWAB BEGINI",cx,5.76,cw);
     copy(s,a,cx,6.06,cw,0.80,9.5);
   });
  s.addNotes("Jangan menjelekkan bahan sintetis. Toni Black mungkin memakainya nanti.");
}

// ============================================================ 07 DEMONSTRATIONS
{
  const s=P.addSlide(); s.background={color:INK}; 
  const tw=4.3911;
  ["s08_t1","s08_t2","s08_t3"].forEach((n,i)=>tile(s,n,i*(tw+0.08),0,tw,H));
  num(s,"07"); foot(s);
  kick(s,"SHOW, DO NOT JUST SAY",M,1.32,C,"right");
  head(s,"THE DEMONSTRATIONS",M,1.66,C,27,"right");
  [["01","Waistband di atas celana","Kalau kamu nyaman, ambil shot memakai produknya. "
     +"Pinggang yang terlihat di atas celana itu opsi paling aman."],
   ["02","Close-up kain","Satu momen dekat ke bahannya. Tekstur, kehalusan, dan cara "
     +"cahaya jatuh di permukaannya."],
   ["03","Momen gerak","Opsional. Duduk, meregang, olahraga, jalan — apa pun yang kamu "
     +"kerjakan hari itu."]]
   .forEach(([n,t,b],i)=>{
     const cx=i*(tw+0.08)+0.34, cwid=tw-0.68;
     rule(s,cx,5.22,cwid,STEEL);
     txt(s,n,{x:cx,y:5.36,w:0.5,h:0.26,fontFace:DISP,fontSize:9.5,bold:true,
       charSpacing:1.6,color:WHITE,valign:"middle"});
     txt(s,t,{x:cx+0.52,y:5.36,w:cwid-0.52,h:0.26,fontFace:DISP,fontSize:11,bold:true,
       color:WHITE,valign:"middle"});
     copy(s,b,cx,5.74,cwid,0.86,9);
   });
  s.addNotes("Minimal satu close-up kain. Sisanya opsional.");
}

// ============================================================ 08 THE HOOKS
{
  const s=P.addSlide(); bleed(s,"s09_hooks"); num(s,"08"); foot(s);
  const x=5.30, w=W-M-x;
  kick(s,"PICK ONE OR RIFF ON IT",x,1.32,w,"right");
  head(s,"THE HOOKS",x,1.66,w,27,"right");
  rule(s,x,2.62,w,GREY);
  ["Celana dalem yang selalu gw pake setiap hari",
   "POV: ukuran besar akhirnya ada yang muat dan nyaman",
   "Gw kira semua celana dalem sama aja, sampai gw coba yang ini",
   "Ini alasan gw nggak balik lagi ke brand lama gw",
   "Cerita jujur setelah 24 jam pakai underwear ini di cuaca Jakarta",
   "Gak nyangka bahannya senyaman ini buat cuaca panas"].forEach((t,i)=>{
     const y=2.90+i*0.66;
     txt(s,String(i+1).padStart(2,"0"),{x,y,w:0.46,h:0.30,fontFace:DISP,fontSize:9,
       bold:true,charSpacing:1.6,color:WHITE,valign:"middle"});
     copy(s,"“"+t+"”",x+0.56,y,w-0.56,0.34,10.5,WHITE);
     if(i<5) rule(s,x,y+0.46,w,DAVIS);
   });
  s.addNotes("Pakai kata-kata kamu sendiri. Hook di sini cuma pemantik.");
}

// ============================================================ 09 CONTENT IDEAS
{
  const s=P.addSlide(); s.background={color:INK};
  const tw=2.6187, gp=0.06;
  ["s10_t1","s10_t2","s10_t3","s10_t4","s10_t5"].forEach((n,i)=>tile(s,n,i*(tw+gp),0,tw,H));
  num(s,"09"); foot(s);
  kick(s,"FIVE WAYS INTO IT  ·  TIKTOK",M,1.32,C,"right");
  head(s,"CONTENT IDEAS",M,1.66,C,27,"right");
  [["Sizing test","Try-on (pinggang saja) yang menunjukkan potongannya di badan "
     +"berbeda-beda, ditutup reaksi jujur kamu."],
   ["Gym vs desk day","Satu celana dipakai untuk latihan dan seharian di meja. "
     +"Ceritakan bagaimana dia bertahan."],
   ["Fabric close-up","Regangan dan tekstur dalam gerak lambat, dengan voiceover "
     +"kenapa Modal terasa beda."],
   ["Brand switch story","Perbandingan jujur, dibingkai sebagai perjalanan kamu "
     +"sendiri pindah brand."],
   ["What's in my drawer","Ringan dan dekat: Toni Black di sebelah brand lama kamu, "
     +"plus alasan kenapa dia menang."]]
   .forEach(([t,b],i)=>{
     const cx=i*(tw+gp)+0.30, cwid=tw-0.60;
     rule(s,cx,5.02,cwid,STEEL);
     txt(s,String(i+1).padStart(2,"0"),{x:cx,y:5.14,w:cwid,h:0.26,fontFace:DISP,
       fontSize:9,bold:true,charSpacing:1.6,color:WHITE,valign:"middle"});
     txt(s,t,{x:cx,y:5.42,w:cwid,h:0.28,fontFace:DISP,fontSize:10.5,bold:true,
       color:WHITE,valign:"middle"});
     copy(s,b,cx,5.76,cwid,0.94,8.5);
   });
  s.addNotes("Lima ide ini boleh digabung, tidak harus dibuat semua.");
}

// ============================================================ 10 THE PROOF
{
  const s=P.addSlide(); bleed(s,"s11_proof"); num(s,"10"); foot(s);
  const x=M, w=6.30;
  kick(s,"BE SPECIFIC, NOT GENERIC",x,1.32,w);
  head(s,"THE PROOF",x,1.66,w,27,"left");
  rule(s,x,2.62,w,GREY);
  copy(s,"Berikan review jujur dan spesifik setelah memakainya seharian penuh. Kalau "
       +"relevan, bandingkan dengan brand yang dulu kamu pakai — tapi samarkan namanya. "
       +"Sebut “Brand C” atau “Brand U”, jangan disebut langsung.\n\n"
       +"Lewati pujian umum seperti “adem” atau “breathable”. Masuk ke detailnya.",
       x,2.90,w,1.70);
  ["Jam ke-8 rasanya bagaimana?",
   "Bertahan waktu latihan atau di perjalanan?",
   "Apa yang ternyata beda dari yang biasa kamu pakai?"].forEach((q,i)=>{
     const y=4.86+i*0.56;
     rule(s,x,y+0.16,0.20,STEEL);
     copy(s,q,x+0.38,y,w-0.38,0.34,10.5,WHITE);
   });
  s.addNotes("Detail spesifik jauh lebih meyakinkan daripada kata sifat umum.");
}

// ============================================================ 11 CALL TO ACTION
{
  const s=P.addSlide(); bleed(s,"s12_cta"); num(s,"11"); foot(s);
  const x=6.10, w=W-M-x;
  kick(s,"KEEP IT NATURAL",x,1.32,w,"right");
  head(s,"THE CALL\nTO ACTION",x,1.66,w,27,"right");
  rule(s,x,3.20,w,GREY);
  txt(s,"“Link ada di bio /\nkeranjang kuning”",{x,y:3.52,w,h:1.10,fontFace:DISP,
    fontSize:17,bold:true,color:WHITE,align:"right",lineSpacing:23});
  rule(s,x,4.82,w,DAVIS);
  copy(s,"Buat sewajarnya, jangan terdengar seperti jualan. Hindari kalimat keras "
       +"seperti “beli sekarang”.\n\nBiarkan kejujuran kontennya yang menjual. Kalau "
       +"ceritanya benar, penontonnya akan mencari sendiri linknya.", x,5.02,w,1.60);
  s.addNotes("CTA lembut. Hard sell justru menurunkan kepercayaan.");
}

// ============================================================ 12 DELIVERABLES
{
  const s=P.addSlide(); bleed(s,"s13_deliver"); num(s,"12"); foot(s);
  const x=M, w=6.10;
  kick(s,"WHAT TO SEND BACK",x,1.32,w);
  head(s,"DELIVERABLES",x,1.66,w,27,"left");
  rule(s,x,2.62,w,GREY);
  [["DURASI","30–45 detik"],["RASIO","9:16 vertikal"],
   ["REVISI","Satu putaran"],["USAGE","Paid social + organic, 6 bulan"]]
   .forEach(([a,b],i)=>{
     const y=2.94+i*0.88;
     kick(s,a,x,y,w);
     txt(s,b,{x,y:y+0.28,w,h:0.34,fontFace:DISP,fontSize:14,bold:true,
       color:WHITE,valign:"middle"});
     if(i<3) rule(s,x,y+0.72,w,DAVIS);
   });
  copy(s,"Kecuali disepakati lain di kontrak.",x,6.34,w,0.28,8.5);
  s.addNotes("Kalau ada kebutuhan usage di luar ini, bicarakan sebelum syuting.");
}

// ============================================================ CLOSING
{
  const s=P.addSlide(); bleed(s,"s14_closing"); foot(s);
  head(s,"THANK YOU",M,4.20,10.6,44,"left");
  rule(s,M,5.52,3.10,STEEL);
  copy(s,"Ada yang mau ditanyakan sebelum mulai syuting? Hubungi tim Toni Black dulu — "
       +"lebih enak dibereskan sebelum kamera menyala.",M,5.74,6.8,0.80,10,WHITE);
  s.addNotes("Tutup. Dorong creator bertanya sebelum produksi.");
}

P.writeFile({ fileName: path.join(DIR,"ToniBlack_Creator_Brief.pptx") })
  .then(f=>console.log("written:",f));
