const pptxgen = require("pptxgenjs");
const path = require("path");
const DIR = __dirname;
const P = new pptxgen();
P.layout = "LAYOUT_WIDE";                       // 13.333 x 7.5
P.author = "Toni Black"; P.company = "Toni Black";
P.title = "Product Knowledge";

// ---- Brand tokens ----------------------------------------------------------
const INK="282828", WHITE="FFFFFF", DAVIS="4F5052", GREY="818284",
      STEEL="CCCCCC", PAPER="F2F2F3";
const DISP="Zalando Sans Expanded", BODY="Arimo";
const W=13.3333, H=7.5, M=0.7, C=W-2*M;         // 11.9333in of content
const LOGO_R=6.61;
const img = n => path.join(DIR,"img",n+".png");
const WD = require("./widths.json");   // real text widths, from measure.py

// ---- primitives ------------------------------------------------------------
const box = (s,x,y,w,h,fill,r) => s.addShape(
  r ? P.ShapeType.roundRect : P.ShapeType.rect,
  { x,y,w,h, ...(r?{rectRadius:r}:{}) , fill:{color:fill}, line:{color:fill} });

const txt = (s,t,o) => s.addText(t, { margin:0, ...o });

const label = (s,t,x,y,w,color,size) => txt(s,t,
  { x,y,w:w||6,h:0.26, fontFace:DISP, fontSize:size||9.5, bold:true,
    charSpacing:2.6, color, valign:"middle" });

// dark pill, top-left of every content slide
const pill = (s,n,name) => {
  const w = WD.pill[`${n}|${name}`] || 1.6;
  box(s,M,0.52,w,0.34,INK,0.17);
  txt(s,`${n}   ${name}`,{ x:M,y:0.52,w,h:0.34, fontFace:DISP,fontSize:9,bold:true,
    charSpacing:1.5,color:WHITE,align:"center",valign:"middle" });
};

const chrome = (s,n,name) => {
  s.background={color:WHITE};
  pill(s,n,name);
  txt(s,"PRODUCT KNOWLEDGE",{ x:W-M-3.2,y:0.52,w:3.2,h:0.34, fontFace:DISP,
    fontSize:8.5,bold:true,charSpacing:2.4,color:DAVIS,align:"right",valign:"middle" });
};

const title = (s,t,y,size,w,h) => txt(s,t,
  { x:M,y:y||1.05,w:w||9.4,h:h||(String(t).indexOf("\n")>=0?1.42:0.78),
    fontFace:DISP, fontSize:size||32,
    bold:true, color:INK, valign:"middle", lineSpacing:(size||32)*1.06 });

const body = (s,t,x,y,w,h,color,size) => txt(s,t,
  { x,y,w,h, fontFace:BODY, fontSize:size||11.5, color:color||DAVIS,
    lineSpacing:(size||11.5)*1.45, valign:"top" });

// a labelled figure: small caps label over a big number
const stat = (s,x,y,w,h,lab,val,dark,vs,r) => {
  box(s,x,y,w,h,dark?INK:PAPER,r===undefined?0.06:r);
  label(s,lab,x+0.26,y+0.17,w-0.52,dark?STEEL:DAVIS);
  txt(s,val,{ x:x+0.26,y:y+0.42,w:w-0.52,h:h-0.50, fontFace:DISP, fontSize:vs||20,
    bold:true, color:dark?WHITE:INK, valign:"middle" });
};

const tag = (s,t,x,y,dark) => {
  const w = WD.tag[t] || 1.2;
  box(s,x,y,w,0.30,dark?WHITE:INK,0.15);
  txt(s,t,{ x,y,w,h:0.30, fontFace:DISP,fontSize:8,bold:true,charSpacing:1.3,
    color:dark?INK:WHITE,align:"center",valign:"middle" });
};

// a row of tags, flowed from their measured widths
const tagRow = (s,list,x,y,dark,gap) => {
  let cx=x;
  list.forEach(t => { tag(s,t,cx,y,dark); cx += (WD.tag[t]||1.2) + (gap||0.16); });
  return cx - (gap||0.16);
};

const logo = (s,dark,x,y,w) => s.addImage(
  { path: path.join(DIR, dark?"logo_white.png":"logo_dark.png"), x,y,w,h:w/LOGO_R });

// a compact list of short lines, each led by a rule
const list = (s,items,x,y,w,gap,color) => items.forEach((t,i)=>{
  const yy=y+i*(gap||0.42);
  box(s,x,yy+0.135,0.14,0.03,GREY,0);
  txt(s,t,{ x:x+0.30,y:yy,w:w-0.30,h:0.30, fontFace:BODY,fontSize:11,
    color:color||DAVIS, valign:"middle" });
});

// ============================================================ 01 COVER
{
  const s=P.addSlide(); s.background={color:WHITE};
  box(s,M,0.55,C,6.40,INK,0.14);
  s.addImage({ path:img("cover"), x:12.6333-0.24-6.45, y:0.79, w:6.45, h:5.92 });
  const LX=1.25, LW=4.25;
  logo(s,true,LX,1.10,1.95);
  label(s,"PRODUCT KNOWLEDGE  ·  2026",LX,2.20,LW,STEEL);
  txt(s,"Engineered for\nEvery Body",{ x:LX,y:2.62,w:LW,h:1.70, fontFace:DISP,
    fontSize:32,bold:true,color:WHITE,lineSpacing:35 });
  body(s,"Tailored essentials for everyday comfort. What the product is, what it is "
        +"made of, and how to size it.", LX,4.45,LW,1.05,STEEL,11.5);
  tagRow(s,["MODALCLOUD™","FLOWLITE™","FIT LAB"],LX,5.68,true,0.12);
  txt(s,"toni.black",{ x:LX,y:6.28,w:2.0,h:0.28, fontFace:BODY,fontSize:10.5,
    color:STEEL,valign:"middle" });
  s.addNotes("Semua materi di deck ini diambil dari toni.black.");
}

// ============================================================ 02 BRAND
{
  const s=P.addSlide(); chrome(s,"01","Brand");
  title(s,"Tailored essentials,\nnothing extra",1.02,30,5.6);
  body(s,"Toni Black makes everyday underwear for men across Asia-Pacific. The work goes "
        +"into what you actually feel: the waistband, the fabric, the stretch, the support.",
        6.85,1.20,5.78,1.30);
  const cw=(C-0.28)/2, x2=M+cw+0.28;
  box(s,M,3.05,cw,2.85,PAPER,0.08);
  label(s,"THE BLACK-FIRST RULE",M+0.32,3.30,cw-0.64,DAVIS);
  txt(s,"Black is not a colour choice.\nIt is a design discipline.",{ x:M+0.32,y:3.65,
    w:cw-0.64,h:0.95, fontFace:DISP,fontSize:16,bold:true,color:INK,lineSpacing:21 });
  body(s,"One colour means fewer lines, less overproduction, less waste.",
        M+0.32,4.72,cw-0.64,0.60,DAVIS,10.5);
  box(s,x2,3.05,cw,2.85,INK,0.08);
  s.addImage({ path:img("brand"), x:x2+0.25, y:3.30, w:3.38, h:2.35 });
  const sx=x2+0.25+3.38+0.30, sw=x2+cw-0.25-sx;
  stat(s,sx,3.30,sw,1.10,"MARKETS","5",true,24,0.06);
  stat(s,sx,4.55,sw,1.10,"COLOUR","1",true,24,0.06);
  txt(s,"Singapore   ·   Malaysia   ·   Australia   ·   New Zealand   ·   Indonesia",
    { x:M,y:6.20,w:C,h:0.34, fontFace:BODY,fontSize:11,color:DAVIS,valign:"middle" });
  s.addNotes("Poin utama: satu warna itu keputusan desain, bukan keterbatasan stok.");
}

// ============================================================ 03 NUMBERS
{
  const s=P.addSlide(); chrome(s,"02","Numbers");
  title(s,"The product in four numbers",1.02,30);
  const sw=(C-3*0.22)/4;
  [["MODAL","91%"],["ELASTANE","9%"],["SIZES","S – 3XL"],["COLOUR","Black"]]
    .forEach(([l,v],i)=> stat(s,M+i*(sw+0.22),2.30,sw,1.40,l,v,i===0,24,0.08));
  const cw=(C-2*0.26)/3;
  box(s,M,4.00,cw,2.55,PAPER,0.08);
  label(s,"SIZING",M+0.32,4.26,cw-0.64,DAVIS);
  txt(s,"Fit Lab",{ x:M+0.32,y:4.58,w:cw-0.64,h:0.50, fontFace:DISP,fontSize:19,
    bold:true,color:INK,valign:"middle" });
  body(s,"Two inputs — height and weight. One confident answer, built on real garment "
        +"measurements and real bodies.", M+0.32,5.16,cw-0.64,1.10,DAVIS,11);
  const x2=M+cw+0.26;
  s.addImage({ path:img("impact"), x:x2, y:4.00, w:cw, h:2.55 });
  const x3=M+2*(cw+0.26);
  box(s,x3,4.00,cw,2.55,INK,0.08);
  label(s,"TRIAL",x3+0.32,4.26,cw-0.64,STEEL);
  txt(s,"First Pair\nGuarantee",{ x:x3+0.32,y:4.58,w:cw-0.64,h:0.90, fontFace:DISP,
    fontSize:19,bold:true,color:WHITE,lineSpacing:23 });
  body(s,"If the first pair misses on fit, comfort or quality, contact support. "
        +"One claim per customer.", x3+0.32,5.58,cw-0.64,0.85,STEEL,11);
  s.addNotes("Empat angka ini yang paling sering ditanya calon pembeli.");
}

// ============================================================ 04 MODALCLOUD
{
  const s=P.addSlide(); chrome(s,"03","Fabric");
  title(s,"ModalCloud™",1.02,30);
  label(s,"THE SIGNATURE FABRIC",M,1.96,5.0,DAVIS);
  body(s,"Cloud-like comfort from MicroModal. Soft, breathable, light, and it moves "
        +"naturally with the body.", M,2.40,4.20,0.95);
  tagRow(s,["EVERYDAY","WORK","TRAVEL"],M,3.60,false,0.12);
  box(s,M,4.30,4.20,2.30,PAPER,0.08);
  label(s,"USED IN",M+0.32,4.54,3.56,DAVIS);
  list(s,["Brief","Boxer Brief 5\"","Inner Singlet","Inner Crewneck T"],
        M+0.32,4.92,3.56,0.38);
  s.addImage({ path:img("modal"), x:5.30, y:2.30, w:2.75, h:4.30 });
  // image, left card and right cards all close on 6.60
  const rx=8.45, rw=12.6333-rx;
  box(s,rx,2.30,rw,2.05,PAPER,0.08);
  label(s,"COMPOSITION",rx+0.32,2.56,rw-0.64,DAVIS);
  txt(s,"Modal 91%  ·  Elastane 9%",{ x:rx+0.32,y:2.88,w:rw-0.64,h:0.46,
    fontFace:DISP,fontSize:16,bold:true,color:INK,valign:"middle" });
  body(s,"The elastane is what gives it 4-way stretch and recovery.",
        rx+0.32,3.40,rw-0.64,0.55,DAVIS,10.5);
  box(s,rx,4.55,rw,2.05,INK,0.08);
  label(s,"MOISTURE",rx+0.32,4.83,rw-0.64,STEEL);
  txt(s,"50% more than cotton",{ x:rx+0.32,y:5.17,w:rw-0.64,h:0.46, fontFace:DISP,
    fontSize:16,bold:true,color:WHITE,valign:"middle" });
  body(s,"Absorbs more, releases it faster, and resists yellowing over washes.",
        rx+0.32,5.72,rw-0.64,0.62,STEEL,10.5);
  s.addNotes("ModalCloud dipakai di hampir semua produk. FlowLite hanya di loose boxer.");
}

// ============================================================ 05 BUILT FROM THREE
{
  const s=P.addSlide(); chrome(s,"04","Build");
  title(s,"Built from three things",1.02,30);
  const cw=(C-2*0.26)/3;
  const CARDS=[
    ["01","ModalCloud™","MicroModal with a touch of elastane. Soft, breathable, light. "
      +"The fabric behind most of the range.","FABRIC","built1"],
    ["02","FlowLite™","A lyocell-based fibre, finer and more fluid than modal. The "
      +"lightest fabric Toni Black makes.","FABRIC","built2"],
    ["03","Soft Elastic Waistband","A secure hold without harsh pressure. Follows the "
      +"natural waistline. Minimal branding.","CONSTRUCTION","built3"],
  ];
  CARDS.forEach(([n,t,b,tg,im],i)=>{
    const x=M+i*(cw+0.26);
    box(s,x,2.35,cw,4.35,PAPER,0.08);
    s.addImage({ path:img(im), x:x+((cw-3.30)/2), y:2.60, w:3.30, h:1.50 });
    label(s,n,x+0.32,4.28,1.0,DAVIS,10.5);
    txt(s,t,{ x:x+0.32,y:4.58,w:cw-0.64,h:0.52, fontFace:DISP,fontSize:16,bold:true,
      color:INK,valign:"middle" });
    body(s,b,x+0.32,5.14,cw-0.64,1.00,DAVIS,10.5);
    tag(s,tg,x+0.32,6.16,false);
  });
  s.addNotes("Tiga hal ini yang membedakan produknya. Dua kain, satu konstruksi.");
}

// ============================================================ 06 THE RANGE
{
  const s=P.addSlide(); chrome(s,"05","Range");
  title(s,"The men's range",1.02,30);
  const ITEMS=[
    ["Brief","ModalCloud™","Minimal leg coverage. Under fitted trousers.","Rp 79.000"],
    ["Boxer Brief 5\"","ModalCloud™","Balanced coverage. Work, travel, light activity.","Rp 99.000"],
    ["Loose Fit Boxer","FlowLite™","Relaxed and low compression. Sleep and home.","Rp 109.000"],
    ["Inner Singlet","ModalCloud™","Base layer under a shirt. White.","Rp 109.000"],
    ["Inner Crewneck T","ModalCloud™","Covers the underarm under a work shirt. White.","Rp 149.000"],
  ];
  const rows=[["Style","Fabric","Cut","From"].map((t,j)=>({ text:t, options:{
    fontFace:DISP,fontSize:10,bold:true,color:WHITE,fill:{color:INK},charSpacing:1.4,
    align:j===3?"right":"left" }}))];
  ITEMS.forEach((r,i)=>{ const f=i%2?WHITE:PAPER; rows.push([
    { text:r[0], options:{ fontFace:DISP,fontSize:11,bold:true,color:INK,fill:{color:f} } },
    { text:r[1], options:{ fontFace:BODY,fontSize:11,color:DAVIS,fill:{color:f} } },
    { text:r[2], options:{ fontFace:BODY,fontSize:11,color:DAVIS,fill:{color:f} } },
    { text:r[3], options:{ fontFace:DISP,fontSize:11,bold:true,color:INK,align:"right",fill:{color:f} } },
  ]); });
  s.addTable(rows,{ x:M,y:2.40,w:C,colW:[3.05,2.35,4.7333,1.80], rowH:0.58,
    valign:"middle", margin:[0,0.16,0,0.16], border:{type:"solid",color:STEEL,pt:0.5} });
  txt(s,"Every style comes in S, M, L, XL, 2XL and 3XL. Black, except the two white inner layers.",
    { x:M,y:6.10,w:C,h:0.34, fontFace:BODY,fontSize:11,color:DAVIS,valign:"middle" });
  s.addNotes("Harga di atas harga satuan. Multipack ada di slide berikutnya.");
}

// ============================================================ 07 PACKS & KIDS
{
  const s=P.addSlide(); chrome(s,"06","Packs & Kids");
  title(s,"Buy more, pay less per pair",1.02,30);
  const TW=6.95;
  const P2=[["Single","Rp 79.000","Rp 99.000"],["3 Pack","Rp 199.000","Rp 249.000"],
            ["6 Pack","Rp 379.000","Rp 469.000"]];
  const rows=[["Pack","Brief","Boxer Brief 5\""].map((t,j)=>({ text:t, options:{
    fontFace:DISP,fontSize:10,bold:true,color:WHITE,fill:{color:INK},charSpacing:1.4,
    align:j?"right":"left" }}))];
  P2.forEach((r,i)=>{ const f=i%2?WHITE:PAPER; rows.push([
    { text:r[0], options:{ fontFace:DISP,fontSize:11,bold:true,color:INK,fill:{color:f} } },
    { text:r[1], options:{ fontFace:BODY,fontSize:11,color:DAVIS,align:"right",fill:{color:f} } },
    { text:r[2], options:{ fontFace:BODY,fontSize:11,color:DAVIS,align:"right",fill:{color:f} } },
  ]); });
  s.addTable(rows,{ x:M,y:2.35,w:TW,colW:[2.95,2.00,2.00], rowH:0.58, valign:"middle",
    margin:[0,0.16,0,0.16], border:{type:"solid",color:STEEL,pt:0.5} });
  txt(s,"A 6 Pack Brief works out at Rp 63.200 a pair — 20% under the single price.",
    { x:M,y:4.82,w:TW,h:0.34, fontFace:BODY,fontSize:11,color:DAVIS,valign:"middle" });
  box(s,M,5.30,TW,1.40,PAPER,0.08);
  label(s,"ALSO IN THE PACK RANGE",M+0.32,5.52,TW-0.64,DAVIS);
  body(s,"Loose Fit Boxer: 2 Pack Rp 179.000, 4 Pack Rp 339.000.\n"
        +"Inner Singlet: 2 Pack Rp 199.000, 4 Pack Rp 349.000. Crewneck T: 2 Pack Rp 249.000, "
        +"4 Pack Rp 479.000.", M+0.32,5.84,TW-0.64,0.78,DAVIS,10.5);
  const kx=M+TW+0.35, kw=12.6333-kx;
  box(s,kx,2.35,kw,4.35,INK,0.08);
  s.addImage({ path:img("kids"), x:kx+((kw-3.30)/2), y:2.60, w:3.30, h:2.30 });
  label(s,"KIDS",kx+0.32,5.08,kw-0.64,STEEL);
  txt(s,"Boys",{ x:kx+0.32,y:5.38,w:kw-0.64,h:0.48, fontFace:DISP,fontSize:19,
    bold:true,color:WHITE,valign:"middle" });
  body(s,"Brief from Rp 59.900, Boxer Brief from Rp 69.900. Sizes 8, 10, 12 and 14.",
        kx+0.32,5.92,kw-0.64,0.70,STEEL,10.5);
  s.addNotes("Multipack adalah cara paling mudah menaikkan nilai transaksi.");
}

// ============================================================ 08 FIT LAB
{
  const s=P.addSlide(); chrome(s,"07","Fit Lab");
  title(s,"Two inputs.\nOne answer.",1.02,30,5.4);
  body(s,"Fit Lab is built on real garment measurements and real bodies. Enter height and "
        +"weight, and it returns one size — calibrated against Toni Black's own garments and "
        +"customer fit tests.\n\nThe waistband has high stretch and full recovery, so the "
        +"answer holds.", M,2.85,6.30,2.20);
  const sw=(6.30-0.24)/2;
  stat(s,M,5.30,sw,1.15,"INPUTS","Height + weight",false,15,0.08);
  stat(s,M+sw+0.24,5.30,sw,1.15,"SIZES","S – 3XL",true,15,0.08);
  s.addImage({ path:img("fitlab"), x:12.6333-5.05, y:2.10, w:5.05, h:3.30 });
  box(s,12.6333-5.05,5.62,5.05,0.95,PAPER,0.08);
  txt(s,"Between two sizes, most customers take the smaller one.",
    { x:12.6333-5.05+0.32,y:5.62,w:5.05-0.64,h:0.95, fontFace:BODY,fontSize:11.5,
      color:INK,valign:"middle" });
  s.addNotes("Fit Lab ada di toni.black/pages/sizing-guide.");
}

// ============================================================ 09 SIZING STEPS
{
  const s=P.addSlide(); chrome(s,"08","Sizing");
  title(s,"How a customer finds their size",1.02,30);
  const cw=(C-2*0.26)/3;
  [["01","Open Fit Lab","On toni.black, under Sizing Guide. No tape measure needed."],
   ["02","Enter height and weight","Two inputs. Nothing else to fill in."],
   ["03","Take the answer","One size back. Between two, most customers take the smaller."]]
   .forEach(([n,t,b],i)=>{
     const x=M+i*(cw+0.26), dark=i===0;
     box(s,x,2.35,cw,2.55,dark?INK:PAPER,0.08);
     txt(s,n,{ x:x+0.32,y:2.60,w:1.2,h:0.62, fontFace:DISP,fontSize:26,bold:true,
       color:dark?WHITE:INK,valign:"middle" });
     txt(s,t,{ x:x+0.32,y:3.32,w:cw-0.64,h:0.56, fontFace:DISP,fontSize:15,bold:true,
       color:dark?WHITE:INK,valign:"middle" });
     body(s,b,x+0.32,3.94,cw-0.64,0.80,dark?STEEL:DAVIS,10.5);
   });
  box(s,M,5.18,C,1.52,PAPER,0.08);
  label(s,"WHEN THE ANSWER IS WRONG",M+0.34,5.42,6.0,DAVIS);
  body(s,"The First Pair Guarantee covers it. If the first pair misses on fit, comfort or "
        +"quality, the customer contacts support within the guarantee period. One claim per "
        +"customer, item unworn and unwashed.", M+0.34,5.74,C-0.68,0.80,DAVIS,11);
  s.addNotes("Tiga langkah ini yang dipakai affiliate saat menjawab pertanyaan ukuran.");
}

// ============================================================ 10 WAISTBAND
{
  const s=P.addSlide(); chrome(s,"09","Waistband");
  title(s,"The part you feel all day",1.02,30);
  s.addImage({ path:img("band"), x:M, y:2.15, w:2.90, h:4.45 });
  const lx=M+2.90+0.45, lw=12.6333-lx, hw=(lw-0.28)/2;
  txt(s,"The waistband is one of the most important parts of underwear.",
    { x:lx,y:2.15,w:lw,h:0.62, fontFace:DISP,fontSize:16,bold:true,color:INK,
      valign:"middle" });
  list(s,["Smooth elastic feel","Secure hold without harsh pressure",
          "Follows the natural waistline"], lx,3.05,hw,0.46);
  list(s,["Built for daily movement","Minimal visual branding, for a cleaner look"],
        lx+hw+0.28,3.05,hw,0.46);
  box(s,lx,4.75,hw,1.85,INK,0.08);
  txt(s,"Less pressure at the waist means a cleaner hold — and less adjusting "
       +"through the day.",{ x:lx+0.32,y:4.75,w:hw-0.64,h:1.85, fontFace:BODY,
    fontSize:11.5,color:WHITE,valign:"middle" });
  box(s,lx+hw+0.28,4.75,hw,1.85,PAPER,0.08);
  label(s,"ON THE LOOSE FIT BOXER",lx+hw+0.60,5.02,hw-0.64,DAVIS);
  body(s,"FlowLite™ uses a covered soft waistband — no exposed elastic edge at all.",
        lx+hw+0.60,5.36,hw-0.64,1.00,DAVIS,11);
  s.addNotes("Waistband adalah alasan paling sering disebut pembeli yang repeat order.");
}

// ============================================================ 11 WORK · WORKOUT · REST
{
  const s=P.addSlide(); chrome(s,"10","Use");
  title(s,"Work, workout, rest",1.02,30);
  s.addImage({ path:img("allday"), x:M, y:2.00, w:C, h:3.05 });
  const cw=(C-2*0.26)/3;
  [["WORK","Boxer Brief 5\"","Balanced coverage under trousers, jeans or a uniform. "
     +"Smooth, supportive front shape.",true],
   ["WORKOUT","4-way stretch","Modal with 9% elastane moves with the body and recovers "
     +"its shape after.",false],
   ["REST","FlowLite™ Loose Fit","Looser leg, lower compression, the lightest fabric in "
     +"the range. For the hours the body is still.",false]]
   .forEach(([l,t,b,dark],i)=>{
     const x=M+i*(cw+0.26);
     box(s,x,5.25,cw,1.60,dark?INK:PAPER,0.08);
     label(s,l,x+0.30,5.44,cw-0.60,dark?STEEL:DAVIS);
     txt(s,t,{ x:x+0.30,y:5.72,w:cw-0.60,h:0.36, fontFace:DISP,fontSize:13,bold:true,
       color:dark?WHITE:INK,valign:"middle" });
     body(s,b,x+0.30,6.10,cw-0.60,0.66,dark?STEEL:DAVIS,9.5);
   });
  s.addNotes("Satu produk, tiga momen. Ini cara paling gampang menjelaskan rangenya.");
}

// ============================================================ 12 MARKETS
{
  const s=P.addSlide(); chrome(s,"11","Markets");
  title(s,"Five markets, one product",1.02,30);
  body(s,"Toni Black sells across Asia-Pacific. The same fabric, the same fit system and "
        +"the same single colour in every market.", M,1.95,6.60,0.90);
  const MK=["Singapore","Malaysia","Australia","New Zealand","Indonesia"];
  const LW=8.2833, mw=(LW-4*0.18)/5;
  MK.forEach((m,i)=>{
    const x=M+i*(mw+0.18);
    box(s,x,3.10,mw,1.85,i===4?INK:PAPER,0.08);
    txt(s,String(i+1).padStart(2,"0"),{ x:x+0.20,y:3.32,w:mw-0.40,h:0.30, fontFace:DISP,
      fontSize:10,bold:true,charSpacing:1.4,color:i===4?STEEL:DAVIS,valign:"middle" });
    txt(s,m,{ x:x+0.20,y:3.98,w:mw-0.40,h:0.75, fontFace:DISP,fontSize:12,bold:true,
      color:i===4?WHITE:INK, lineSpacing:15 });
  });
  const sw=(LW-0.24)/2;
  stat(s,M,5.20,sw,1.30,"MARKETS","5",false,26,0.08);
  stat(s,M+sw+0.24,5.20,sw,1.30,"SIZES, EVERY MARKET","S – 3XL",false,20,0.08);
  s.addImage({ path:img("markets"), x:12.6333-3.30, y:2.00, w:3.30, h:2.30 });
  box(s,12.6333-3.30,4.50,3.30,2.00,INK,0.08);
  label(s,"HOME MARKET",12.6333-3.30+0.30,4.74,2.70,STEEL);
  txt(s,"Indonesia",{ x:12.6333-3.30+0.30,y:5.04,w:2.70,h:0.44, fontFace:DISP,
    fontSize:17,bold:true,color:WHITE,valign:"middle" });
  body(s,"Prices in this deck are the Indonesian list prices.",
        12.6333-3.30+0.30,5.56,2.70,0.70,STEEL,10);
  s.addNotes("Harga di deck ini harga Indonesia.");
}

// ============================================================ 13 WHERE TO BUY
{
  const s=P.addSlide(); chrome(s,"12","Channels");
  title(s,"Where people buy it",1.02,30);
  const CH=[["OWN SITE","toni.black","The full range and Fit Lab."],
            ["MARKETPLACE","Shopee","Official store."],
            ["SOCIAL COMMERCE","TikTok Shop","Live selling and short video."],
            ["AFFILIATE","BLACKLIST","The affiliate programme."]];
  const cw=(C-3*0.24)/4;
  CH.forEach(([l,t,b],i)=>{
    const x=M+i*(cw+0.24);
    box(s,x,2.35,cw,2.20,i===0?INK:PAPER,0.08);
    label(s,l,x+0.30,2.60,cw-0.60,i===0?STEEL:DAVIS,8.5);
    txt(s,t,{ x:x+0.30,y:2.94,w:cw-0.60,h:0.50, fontFace:DISP,fontSize:16,bold:true,
      color:i===0?WHITE:INK,valign:"middle" });
    body(s,b,x+0.30,3.52,cw-0.60,0.70,i===0?STEEL:DAVIS,10.5);
  });
  box(s,M,4.90,C,1.80,PAPER,0.08);
  label(s,"SOCIAL",M+0.34,5.16,4.0,DAVIS);
  txt(s,"Instagram   ·   TikTok   ·   Facebook",{ x:M+0.34,y:5.48,w:6.0,h:0.46,
    fontFace:DISP,fontSize:17,bold:true,color:INK,valign:"middle" });
  body(s,"Same product, same prices. The affiliate commission is 15% plus ads.",
        M+0.34,6.02,7.0,0.44,DAVIS,11);
  txt(s,"toni.black",{ x:12.6333-4.0-0.34,y:5.48,w:4.0,h:0.46, fontFace:DISP,fontSize:17,
    bold:true,color:DAVIS,align:"right",valign:"middle" });
  s.addNotes("BLACKLIST adalah nama program affiliate Toni Black.");
}

// ============================================================ 14 CARE & RETURNS
{
  const s=P.addSlide(); chrome(s,"13","Care");
  title(s,"Care, returns, guarantee",1.02,30);
  const cw=(C-0.30)/2;
  box(s,M,2.35,cw,4.35,PAPER,0.08);
  s.addImage({ path:img("care1"), x:M+0.30, y:2.62, w:2.55, h:1.55 });
  label(s,"CARE",M+3.05,2.72,cw-3.35,DAVIS);
  txt(s,"The same for every style",{ x:M+3.05,y:3.02,w:cw-3.35,h:0.80, fontFace:DISP,
    fontSize:15,bold:true,color:INK,lineSpacing:19 });
  list(s,["Machine wash cold, gentle cycle",
          "Non-chlorine bleach only when needed",
          "Tumble dry low",
          "Iron low"], M+0.30,4.42,cw-0.60,0.44);
  const x2=M+cw+0.30;
  box(s,x2,2.35,cw,4.35,INK,0.08);
  s.addImage({ path:img("care2"), x:x2+0.30, y:2.62, w:2.55, h:1.55 });
  label(s,"GUARANTEE",x2+3.05,2.72,cw-3.35,STEEL);
  txt(s,"First Pair Guarantee",{ x:x2+3.05,y:3.02,w:cw-3.35,h:0.80, fontFace:DISP,
    fontSize:15,bold:true,color:WHITE,lineSpacing:19 });
  body(s,"If the first pair does not meet expectations for fit, comfort or quality, the "
        +"customer contacts support within the guarantee period. One claim per customer.",
        x2+0.30,4.42,cw-0.60,1.10,STEEL,11);
  label(s,"RETURNS",x2+0.30,5.66,cw-0.60,STEEL);
  body(s,"Unworn, unwashed, in original packaging, within the stated return period.",
        x2+0.30,5.96,cw-0.60,0.60,STEEL,10.5);
  s.addNotes("Care instruction sama untuk semua produk. Sumber: halaman produk toni.black.");
}

P.writeFile({ fileName: path.join(DIR,"ToniBlack_Product_Knowledge.pptx") })
  .then(f=>console.log("written:",f));
