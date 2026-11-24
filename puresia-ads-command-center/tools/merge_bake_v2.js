// Gabungkan entries/*.json (file baru) ke BAKED_STATE yang sudah ada di HTML dashboard
const fs=require('fs');
const html=fs.readFileSync(process.argv[2],'utf8');
const B=JSON.parse(html.match(/<script id="BAKED_STATE" type="application\/json">(.*?)<\/script>/s)[1]);
const K=B.keys;
const overlay=K.puresiaAdsOverlayV3||{}, prodNames=K.puresiaAdsProdNames||{}, syncedIds=K.puresiaAdsSyncedIds||{};
let prodStore=K.puresiaAdsProducts||[], vidStore=K.puresiaAdsVideos||[];
const inv=JSON.parse(fs.readFileSync('inventory_v2.json','utf8')); const byId={}; for(const f of inv)byId[f.id]=f;
const files=fs.readdirSync('entries').filter(f=>f.endsWith('.json'))
  .sort((a,b)=>((byId[a.slice(0,-5)]||{}).title||a).localeCompare((byId[b.slice(0,-5)]||{}).title||b));
const round2=v=>Math.round(v*100)/100;
function mergeDetail(storeArr,incoming){const keys=new Set(incoming.map(r=>r.chId+'|'+r.iso));return storeArr.filter(r=>!keys.has(r.chId+'|'+r.iso)).concat(incoming);}
let ok=0,skip=0,cells=0,already=0; const now=new Date().toISOString(); const touched={};
for(const f of files){
  const d=JSON.parse(fs.readFileSync('entries/'+f,'utf8')); const fid=d.fileId;
  if(syncedIds[fid]&&syncedIds[fid]!=='skip-detect'&&syncedIds[fid]!=='skip-format'){already++;continue;}
  if(d.skip){syncedIds[fid]='skip-detect';skip++;continue;}
  for(const en of (d.entries||[])){
    if(!en.chId||!en.iso||en.iso<'2026-07-01')continue;
    overlay[en.chId]??={};
    for(const k in en.metrics){const v=en.metrics[k];if(v==null)continue;(overlay[en.chId][k]??={})[en.iso]=round2(v);cells++;touched[en.iso.slice(0,7)]=(touched[en.iso.slice(0,7)]||0)+1;}
  }
  if(d.mapping)Object.assign(prodNames,d.mapping);
  if(d.products&&d.products.length){const inc=d.products.filter(p=>p.chId&&p.iso&&p.iso>='2026-07-01').map(p=>({...p,code:p.code||'',qty:p.qty||0,val:p.val||0,cost:p.cost||0,imp:p.imp||0,clk:p.clk||0,ord:p.ord||0}));if(inc.length)prodStore=mergeDetail(prodStore,inc);}
  if(d.videos&&d.videos.length){const inc=d.videos.filter(v=>v.iso&&v.iso>='2026-07-01');if(inc.length)vidStore=mergeDetail(vidStore,inc);}
  syncedIds[fid]=now;ok++;
}
const state={stamp:now,origin:'claude-full-sync',keys:{puresiaAdsOverlayV3:overlay,puresiaAdsProducts:prodStore,puresiaAdsVideos:vidStore,puresiaAdsProdNames:prodNames,puresiaAdsSyncedIds:syncedIds}};
fs.writeFileSync('baked_state.json',JSON.stringify(state));
const per={};for(const cid in overlay)for(const k in overlay[cid])for(const iso in overlay[cid][k]){const mk=iso.slice(0,7);((per[mk]??={})[cid]??={})[k]=(per[mk][cid][k]||0)+overlay[cid][k][iso];}
console.log('file baru OK:',ok,'SKIP:',skip,'sudah ada:',already,'| sel baru:',cells,'| bulan tersentuh:',JSON.stringify(touched));
console.log('ukuran state:',(fs.statSync('baked_state.json').size/1e6).toFixed(2),'MB | produk',prodStore.length,'| video',vidStore.length,'| syncedIds',Object.keys(syncedIds).length);
const days=[...new Set(Object.values(overlay).flatMap(ch=>Object.values(ch).flatMap(k=>Object.keys(k))))].sort();
console.log('rentang hari overlay:',days[0],'..',days[days.length-1]);
for(const mk of Object.keys(per).sort()){const t={cost:0,gmv:0,orders:0};for(const cid in per[mk]){t.cost+=per[mk][cid].cost||0;t.gmv+=per[mk][cid].gmv||0;t.orders+=per[mk][cid].orders||0;}
  console.log(mk,'cost',Math.round(t.cost/1e6)+'jt','gmv',Math.round(t.gmv/1e6)+'jt','orders',Math.round(t.orders),'| ch:',Object.keys(per[mk]).join(','));}
