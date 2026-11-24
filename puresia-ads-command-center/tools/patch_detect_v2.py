import sys
PAIRS=[
("""    let bhi=findHeader(rows,['Campaign name','Spend','New consideration size']);
    if(bhi<0)bhi=findHeader(rows,['Campaign name','Spend','Paid follows']);""",
 """    let bhi=findHeader(rows,['Campaign name','Spend','New consideration size']);
    if(bhi<0)bhi=findHeader(rows,['Campaign name','Spend','Paid follows']);
    if(bhi<0)bhi=findHeader(rows,['Campaign name','Spend','Reach','Impressions']);
    if(bhi<0)bhi=findHeader(rows,['Campaign name','Spend','Impressions']);"""),
("""            cCons=colIdxOf(H,'New consideration size','Consideration size'),
            cFol=colIdxOf(H,'Paid follows');""",
 """            cCons=colIdxOf(H,'New consideration size','Consideration size'),
            cFol=colIdxOf(H,'Paid follows'),cClkAll=colIdxOf(H,'Clicks (all)','Clicks (destination)','Clicks');"""),
("""        if(chId.startsWith('tt_bc')&&cCons>=0)o.clicks+=plainnum(r[cCons])||0;   /* consideration size -> product clicks */""",
 """        if(chId.startsWith('tt_bc')&&cCons>=0)o.clicks+=plainnum(r[cCons])||0;   /* consideration size -> product clicks */
        else if(cClkAll>=0)o.clicks+=plainnum(r[cClkAll])||0;"""),
("""    const routeProduct=(name,jenis)=>{
      const ns=isNS(name);""",
 """    const routeProduct=(name,jenis)=>{
      const ns=isNS(name);
      if(cJenis<0)return 'tt_vsa_psa';   /* ekspor level kampanye tanpa jenis materi: Video+Product Card gabungan */"""),
# entri hanya di dalam rentang tanggal nama file + rekap periode tanpa kolom tanggal disebar rata
("""    const chs=[...new Set(entries.map(e=>chName(e.chId)))].join(', ');
    if(!hasDateCol){
      return {type:'tt_product',needsDate:true,date:fnDate,""",
 """    const chs=[...new Set(entries.map(e=>chName(e.chId)))].join(', ');
    /* rentang tanggal pada nama file: entri di luar rentang (mis. live lama yang ikut terekspor) dibuang */
    const fdates=(String(filename||'').match(/\\d{4}[-_.]\\d{2}[-_.]\\d{2}/g)||[]).map(x=>x.replace(/[_.]/g,'-')).filter(plausibleIso).sort();
    let outOfRange=0;
    if(hasDateCol&&fdates.length){
      const lo=fdates[0],hi=fdates[fdates.length-1];
      const inR=iso=>!iso||(iso>=lo&&iso<=hi);
      for(let i=entries.length-1;i>=0;i--)if(!inR(entries[i].iso)){entries.splice(i,1);outOfRange++;}
      for(let i=products.length-1;i>=0;i--)if(!inR(products[i].iso))products.splice(i,1);
      for(let i=videos.length-1;i>=0;i--)if(!inR(videos[i].iso))videos.splice(i,1);
      if(!entries.length)return {error:L('Semua baris berada di luar rentang tanggal pada nama file.','All rows fall outside the date range in the file name.')};
    }
    if(!hasDateCol){
      /* rekap satu periode (mis. "Live campaign data 2026-10-01 - 2026-10-31"): sebar rata ke tiap hari */
      if(fdates.length>=2&&fdates[0]!==fdates[fdates.length-1]){
        const a=fdates[0],b=fdates[fdates.length-1];
        const days=[];for(let d=new Date(a+'T00:00:00Z');d<=new Date(b+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+1))days.push(d.toISOString().slice(0,10));
        const n=days.length,out=[];
        for(const e of entries){
          const per=days.map(()=>({}));
          for(const k in e.metrics){const tot=e.metrics[k];if(tot==null)continue;
            if(k==='orders'){const base=Math.floor(tot/n);let rem=Math.round(tot-base*n);days.forEach((_,i)=>{per[i][k]=base+(rem>0?1:0);if(rem>0)rem--;});}
            else days.forEach((_,i)=>{per[i][k]=Math.round(tot/n*100)/100;});}
          days.forEach((iso,i)=>out.push({chId:e.chId,iso,metrics:per[i]}));
        }
        return {type:isLive?'tt_live':'tt_product',entries:out,products,videos,
          label:`TikTok ${isLive?'Live':'Product'} GMV Max (${L('rekap periode disebar rata','period summary spread evenly')} ${a} \\u2013 ${b}) \\u00b7 ${rowsUsed} ${L('baris','rows')} \\u2192 ${chs}`};
      }
      return {type:'tt_product',needsDate:true,date:fnDate,"""),
]
for fn in sys.argv[1:]:
    s=open(fn,encoding='utf-8').read(); applied=0
    for old,new in PAIRS:
        if new in s: continue
        n=s.count(old); assert n==1, f"{fn}: {n}x {old[:50]!r}"
        s=s.replace(old,new); applied+=1
    open(fn,'w',encoding='utf-8').write(s); print('patched',fn,'(+%d)'%applied)
