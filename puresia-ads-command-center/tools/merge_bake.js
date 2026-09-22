// Gabungkan entries/*.json -> state (meniru applyEntries/mergeDetail runDriveSync), siap dibake
const fs=require('fs');
const inv=JSON.parse(fs.readFileSync('inventory.json','utf8'));
const byId={};for(const f of inv)byId[f.id]=f;
const files=fs.readdirSync('entries').filter(f=>f.endsWith('.json'));
// urutkan berdasarkan judul agar deterministik (duplikat "(1)" konsisten)
files.sort((a,b)=>{
  const ta=(byId[a.slice(0,-5)]||{}).title||a, tb=(byId[b.slice(0,-5)]||{}).title||b;
  return ta.localeCompare(tb);
});
const overlay={}, prodNames={}, syncedIds={};
let prodStore=[], vidStore=[];
const round2=v=>Math.round(v*100)/100;
function mergeDetail(storeArr,incoming){
  const keys=new Set(incoming.map(r=>r.chId+'|'+r.iso));
  return storeArr.filter(r=>!keys.has(r.chId+'|'+r.iso)).concat(incoming);
}
let ok=0,skip=0,cells=0;
const now=new Date().toISOString();
for(const f of files){
  const d=JSON.parse(fs.readFileSync('entries/'+f,'utf8'));
  const fid=d.fileId;
  if(d.skip){syncedIds[fid]='skip-detect';skip++;continue;}
  for(const en of (d.entries||[])){
    if(!en.chId||!en.iso)continue;
    if(en.iso<'2026-07-01')continue; // bulan <= Jun 2026 sudah lengkap dari worksheet (baked)
    overlay[en.chId]??={};
    for(const k in en.metrics){
      const v=en.metrics[k];
      if(v==null)continue;
      (overlay[en.chId][k]??={})[en.iso]=round2(v);cells++;
    }
  }
  if(d.mapping)Object.assign(prodNames,d.mapping);
  if(d.products&&d.products.length){
    const inc=d.products.filter(p=>p.chId&&p.iso&&p.iso>='2026-07-01').map(p=>({...p,code:p.code||'',qty:p.qty||0,val:p.val||0,cost:p.cost||0,imp:p.imp||0,clk:p.clk||0,ord:p.ord||0}));
    if(inc.length)prodStore=mergeDetail(prodStore,inc);
  }
  if(d.videos&&d.videos.length){
    const inc=d.videos.filter(v=>v.iso&&v.iso>='2026-07-01');
    if(inc.length)vidStore=mergeDetail(vidStore,inc);
  }
  syncedIds[fid]=now;ok++;
}
const state={stamp:now,origin:'claude-full-sync',keys:{
  puresiaAdsOverlayV3:overlay,
  puresiaAdsProducts:prodStore,
  puresiaAdsVideos:vidStore,
  puresiaAdsProdNames:prodNames,
  puresiaAdsSyncedIds:syncedIds,
}};
fs.writeFileSync('baked_state.json',JSON.stringify(state));
// ringkasan bulanan per channel
const per={};
for(const cid in overlay)for(const k in overlay[cid])for(const iso in overlay[cid][k]){
  const mk=iso.slice(0,7);
  ((per[mk]??={})[cid]??={})[k]=(per[mk][cid][k]||0)+overlay[cid][k][iso];
}
console.log('file OK:',ok,'SKIP:',skip,'sel:',cells);
console.log('ukuran state:',(fs.statSync('baked_state.json').size/1e6).toFixed(2),'MB',
  '| prodStore:',prodStore.length,'baris | vidStore:',vidStore.length,'| prodNames:',Object.keys(prodNames).length);
for(const mk of Object.keys(per).sort()){
  const t={cost:0,gmv:0,orders:0};
  for(const cid in per[mk]){t.cost+=per[mk][cid].cost||0;t.gmv+=per[mk][cid].gmv||0;t.orders+=per[mk][cid].orders||0;}
  console.log(mk,'cost',Math.round(t.cost/1e6)+'jt','gmv',Math.round(t.gmv/1e6)+'jt','orders',Math.round(t.orders),'| ch:',Object.keys(per[mk]).join(','));
}
