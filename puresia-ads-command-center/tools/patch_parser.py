import sys
PAIRS=[
# P1: kolom rekap — ambil kolom Value pertama per bulan, lewati kolom %Growth (sel merged di markdown Drive)
("""        const idx=[];c.forEach((x,j)=>{const mo=MONTH_NUM[x.toLowerCase()];if(mo&&x.length>2)idx.push({j,mo});});""",
 """        const subh=(rows[i+1]||[]).map(clean);
        const idx=[];c.forEach((x,j)=>{const mo=MONTH_NUM[x.toLowerCase()];if(!mo||x.length<=2)return;
          if(/growth/i.test(subh[j]||''))return;            // kolom %Growth di samping Value
          if(idx.some(e=>e.mo===mo))return;                 // sel merged: bulan sama muncul dua kali
          idx.push({j,mo});});"""),
# P2: routing seksi
("""    if(t.includes('OVERALL'))return null;
    if(t.includes('MONTHLY'))return null;
    if(t.includes('COMMUNITY INTERACTION'))return 'tt_ci_smv';
    if(t.includes('AFFI'))return 'tt_live_aff';
    if(t.includes('PURE'))return 'tt_live_smo';
    if(t.includes('BBW')||t.includes('SID'))return null;
    if(t.includes('BBO')||t.includes('SMO'))return 'tt_live_smo';
    if(t.includes('VIDEO SHOPPING ADS + PRODUCT')||t.includes('VSA & PSA'))return 'tt_vsa_psa';
    if(t.includes('PRODUCT CARD SHOPPING ADS')||t.includes('KARTU PRODUK'))return 'tt_psa';
    if(t.includes('VIDEO SHOPPING ADS'))return 'tt_vsa';
    if(t.includes('LIVE SHOPPING ADS'))return 'tt_live_all';
    return null;""",
 """    if(t.includes('OVERALL SHOPEE'))return '__sp_shape';   // pola harian Shopee gabungan (dipakai untuk menyebar rekap)
    if(t.includes('OVERALL'))return null;
    if(t.includes('MONTHLY'))return null;
    if(t.includes('COMMUNITY INTERACTION'))return 'tt_ci_smv';
    if(t.includes('AFFI'))return 'tt_live_aff';
    if(t.includes('CHEF')||t.includes('CITRA'))return null;   // akun live kedua (Chef Citra) tidak dilaporkan, sama seperti BBW/SID
    if(t.includes('PURE'))return 'tt_live_smo';
    if(t.includes('BBW')||t.includes('SID'))return null;
    if(t.includes('BBO')||t.includes('SMO'))return 'tt_live_smo';
    if(t.includes('VIDEO SHOPPING ADS + PRODUCT')||t.includes('VSA & PSA'))return 'tt_vsa_psa';
    if(/PRODUCT CARD SHOPPING (ADS )?NS|KARTU PRODUK N/.test(t))return 'tt_psa_ns';
    if(/VIDEO SHOPPING ADS NS|VIDEO NS/.test(t))return 'tt_vsa_ns';
    if(t.includes('PRODUCT CARD SHOPPING ADS')||t.includes('KARTU PRODUK'))return 'tt_psa';
    if(t.includes('VIDEO SHOPPING ADS'))return 'tt_vsa';
    if(t.includes('LIVE SHOPPING ADS'))return 'tt_live_smo';   // satu akun live utama = Puresia Official
    return null;"""),
# P3: FLAT — nama baris Meta 2025 gaya Puresia + sebar mengikuti pola harian
("""    {ch:'meta_cpas',y:2025,gmv:'Meta GMV',orders:'QTY Orders From Meta',cost:'Meta Ads Cost'},""",
 """    {ch:'meta_cpas',y:2025,gmv:'Meta GMV',orders:'QTY Orders From Meta',cost:'Meta Ads Cost'},
    {ch:'meta_cpas',y:2025,gmv:'GMV by Meta CPAS',orders:'QTY Orders by CPAS',cost:'Meta',requireGmv:true},"""),
("""  for(const y of [2025,2026]){
    const s=momByYear[String(y)];if(!s)continue;
    for(let m=1;m<=12;m++){
      const mk=y+'-'+String(m).padStart(2,'0');
      for(const f of FLAT){
        if(f.y&&f.y!==y)continue;
        const gmv=(s[f.gmv]||[])[m-1],ord=f.orders?(s[f.orders]||[])[m-1]:null,cost=f.cost?(s[f.cost]||[])[m-1]:null;
        if(!gmv&&!ord&&!cost)continue;
        const exists=months[mk]&&months[mk].series[f.ch];
        if(f.requireExisting&&!exists)continue;
        const mo=ensure(mk,y,m);
        const tgt=mo.series[f.ch]||(mo.series[f.ch]={});
        if(cost&&!tgt.cost)tgt.cost=spread(Math.round(cost),mo.days,false);
        if(gmv&&!tgt.gmv)tgt.gmv=spread(Math.round(gmv),mo.days,false);
        if(ord&&!tgt.orders)tgt.orders=spread(Math.round(ord),mo.days,true);
        if(!Object.keys(tgt).length)delete mo.series[f.ch];
      }
    }""",
 """  // sebar total bulanan mengikuti pola harian bila ada (biaya harian channel itu sendiri,
  // atau pola "Overall Shopee Ads" untuk channel Shopee); jika tidak ada, rata.
  function spreadBy(total,shape,days,integer){
    if(total==null)return null;
    const S=shape?shape.reduce((a,b)=>a+(b||0),0):0;
    if(!(S>0))return spread(total,days,integer);
    const raw=shape.map(v=>total*(v||0)/S);
    if(!integer)return raw.map(v=>Math.round(v));
    const fl=raw.map(Math.floor);let rem=Math.round(total-fl.reduce((a,b)=>a+b,0));
    const order=raw.map((v,i)=>[v-Math.floor(v),i]).sort((a,b)=>b[0]-a[0]);
    for(let i=0;rem>0&&i<order.length;i++){fl[order[i][1]]+=1;rem--;}
    return fl;
  }
  const shapeFor=(mo,ch,k)=>{
    const own=mo.series[ch];
    if(k!=='cost'&&own&&own.cost&&own.cost.some(v=>v>0))return own.cost;
    const sh=mo.series.__sp_shape;
    if(ch.startsWith('sp_')&&sh){ if(sh[k]&&sh[k].some(v=>v>0))return sh[k]; if(sh.gmv&&sh.gmv.some(v=>v>0))return sh.gmv; }
    return null;
  };
  for(const y of [2025,2026]){
    const s=momByYear[String(y)];if(!s)continue;
    for(let m=1;m<=12;m++){
      const mk=y+'-'+String(m).padStart(2,'0');
      // awal 2025: seksi gabungan VSA+PSA dipecah ke Video / Product Card memakai total rekap
      const comb=months[mk]&&months[mk].series.tt_vsa_psa;
      if(comb&&y===2025){
        const gV=(s['GMV by Video']||[])[m-1],gP=(s['GMV by Product Card']||[])[m-1],
              oV=(s['QTY Orders by Video']||[])[m-1],oP=(s['QTY Orders by Product Card']||[])[m-1];
        if(gV&&gP){
          const mo=months[mk],days=mo.days;
          const cost=comb.cost||[],cT=cost.reduce((a,b)=>a+b,0);
          const split=(id,g,o,share)=>{const t={};
            if(cT>0)t.cost=spreadBy(Math.round(cT*share),cost,days,false);
            t.gmv=spreadBy(Math.round(g),comb.gmv||cost,days,false);
            if(o)t.orders=spreadBy(Math.round(o),comb.orders||comb.gmv||cost,days,true);
            mo.series[id]=t;};
          split('tt_vsa',gV,oV,gV/(gV+gP));split('tt_psa',gP,oP,gP/(gV+gP));
          if(mo.budgets.tt_vsa_psa!=null){mo.budgets.tt_vsa=mo.budgets.tt_vsa_psa;delete mo.budgets.tt_vsa_psa;}
          delete mo.series.tt_vsa_psa;
        }
      }
      for(const f of FLAT){
        if(f.y&&f.y!==y)continue;
        const gmv=(s[f.gmv]||[])[m-1],ord=f.orders?(s[f.orders]||[])[m-1]:null,cost=f.cost?(s[f.cost]||[])[m-1]:null;
        if(!gmv&&!ord&&!cost)continue;
        if(f.requireGmv&&!gmv)continue;
        const exists=months[mk]&&months[mk].series[f.ch];
        if(f.requireExisting&&!exists)continue;
        const mo=ensure(mk,y,m);
        const tgt=mo.series[f.ch]||(mo.series[f.ch]={});
        if(cost&&!tgt.cost)tgt.cost=spreadBy(Math.round(cost),shapeFor(mo,f.ch,'cost'),mo.days,false);
        if(gmv&&!tgt.gmv)tgt.gmv=spreadBy(Math.round(gmv),shapeFor(mo,f.ch,'gmv'),mo.days,false);
        if(ord&&!tgt.orders)tgt.orders=spreadBy(Math.round(ord),shapeFor(mo,f.ch,'orders'),mo.days,true);
        if(!Object.keys(tgt).length)delete mo.series[f.ch];
      }
    }"""),
# P4: buang seri pola & bulan kosong sebelum dikembalikan
("""  return {months,mom:momByYear,warnings};
}""",
 """  for(const mk in months){delete months[mk].series.__sp_shape;delete months[mk].budgets.__sp_shape;
    if(!Object.keys(months[mk].series).length)delete months[mk];}
  return {months,mom:momByYear,warnings};
}"""),
]
for fn in sys.argv[1:]:
    s=open(fn,encoding='utf-8').read()
    for old,new in PAIRS:
        n=s.count(old); assert n==1, f"{fn}: pola tidak unik/tidak ada ({n}): {old[:60]!r}"
        s=s.replace(old,new)
    open(fn,'w',encoding='utf-8').write(s)
    print('patched',fn)
