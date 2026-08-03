const fs=require('fs');
let src=fs.readFileSync('parser_core.js','utf8');

// P1: routing channel — campaign/seksi "Pure" => Puresia Official; SID/BBW dibuang
src=src.replace(`if(t.includes('AFFI'))return 'tt_live_aff';`,`if(t.includes('AFFI'))return 'tt_live_aff';
    if(t.includes('PURE'))return 'tt_live_smo';`);
src=src.replace(`if(t.includes('BBW')||t.includes('SID'))return 'tt_live_sid';`,`if(t.includes('BBW')||t.includes('SID'))return null;`);

// P2: tahun rekap — rekap dengan data Januari = 2026 (tahun penuh), tanpa Januari = 2025 (mulai April)
const OLD_Y=`  for(const s of summaries){
    if(s.rows['Meta GMV']&&!momByYear['2025']){momByYear['2025']=s.rows;s.year=2025;}
    else if(s.rows['GMV by Meta CPAS']&&!momByYear['2026']){momByYear['2026']=s.rows;s.year=2026;}
    else warnings.push('Rekap bulanan blok #'+s.blockIndex+' tidak dikenali tahunnya, dilewati');
  }`;
const NEW_Y=`  const hasJan=s=>{const t=s.rows['Total GMV From Ads']||[];return t[0]!=null&&t[0]>0;};
  for(const s of summaries){
    const y=hasJan(s)?'2026':'2025';
    if(!momByYear[y]){momByYear[y]=s.rows;s.year=+y;}
    else warnings.push('Rekap bulanan blok #'+s.blockIndex+' tidak dikenali tahunnya, dilewati');
  }`;
if(!src.includes(OLD_Y))throw new Error('patch tahun rekap gagal');
src=src.replace(OLD_Y,NEW_Y);

// P3: fallback tahun tab harian — pakai tahun tab tetangga terdekat yang cocok meyakinkan
const OLD_F=`    // fallback: posisi blok relatif thd rekap 2025
    if(best==null||bestDiff>0.5){
      const b25=sumIdx[2025]?sumIdx[2025].blockIndex:1e9;
      best=tab.blockIndex<b25?2026:2025;
    }
    tab.year=best;
  }`;
const NEW_F=`    if(best!=null&&bestDiff<=0.5){tab.year=best;tab.__conf=true;}
    else{tab.year=best;tab.__conf=false;}
  }
  // fallback: tab tanpa kecocokan meyakinkan ikut tahun tab tetangga terdekat (blok berdekatan = era sama)
  for(const tab of dailyTabs){
    if(tab.__conf)continue;
    let near=null,nd=Infinity;
    for(const o of dailyTabs){if(!o.__conf)continue;const d=Math.abs(o.blockIndex-tab.blockIndex);if(d<nd){nd=d;near=o;}}
    if(near)tab.year=near.year;
    else if(tab.year==null)tab.year=2026;
  }`;
if(!src.includes(OLD_F))throw new Error('patch fallback tahun gagal');
src=src.replace(OLD_F,NEW_F);
fs.writeFileSync('parser_patched.js',src);
eval(src);
const dump=fs.readFileSync('puresia_sheet.txt','utf8');
const res=parseBrunbrunDump(dump);
// buang bulan yang tidak punya series sama sekali
for(const mk of Object.keys(res.months)) if(!Object.keys(res.months[mk].series).length) delete res.months[mk];
console.log('warnings:');res.warnings.forEach(w=>console.log(' !',w));
console.log('mom years:',Object.keys(res.mom));
const tot={};
for(const mk of Object.keys(res.months).sort()){
  const mo=res.months[mk];
  let c=0,g=0;for(const cid in mo.series){c+=(mo.series[cid].cost||[]).reduce((a,b)=>a+b,0);g+=(mo.series[cid].gmv||[]).reduce((a,b)=>a+b,0);}
  console.log(mk,'days',mo.days,'cost',Math.round(c/1e6)+'jt','gmv',Math.round(g/1e6)+'jt','ch:',Object.keys(mo.series).join(','));
}
fs.writeFileSync('puresia_final.json',JSON.stringify({months:res.months,mom:res.mom},null,0));
console.log('saved puresia_final.json');
