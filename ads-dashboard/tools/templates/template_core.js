<script>
'use strict';
/* =============== Ads Command Center v3 — Sophie Martin ===============
   Database multi-periode 2025–2026. Semua lokal di browser;
   upload/edit disimpan sebagai overlay di localStorage. */

const RAW = JSON.parse(document.getElementById('BASE_DATA').textContent);
const MONTH_KEYS = Object.keys(RAW.months).sort();
const LATEST = RAW.meta.defaultMonth;                       // '2026-07'
const FIRST_ISO = MONTH_KEYS[0]+'-01';

/* ---------- bahasa (ID / EN) ---------- */
const LS_LANG='smoAdsLang';
let LANG=(function(){try{return JSON.parse(localStorage.getItem(LS_LANG))||'id'}catch(e){return 'id'}})();
const MONTHS_ID=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const MONTHS_EN=['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_S_ID=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const MONTHS_S_EN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
let MONTHS=MONTHS_ID, MONTHS_S=MONTHS_S_ID;
let nf0,nf1,nf2;
function applyLang(){
  MONTHS = LANG==='id'?MONTHS_ID:MONTHS_EN;
  MONTHS_S = LANG==='id'?MONTHS_S_ID:MONTHS_S_EN;
  const loc = LANG==='id'?'id-ID':'en-US';
  nf0=new Intl.NumberFormat(loc,{maximumFractionDigits:0});
  nf1=new Intl.NumberFormat(loc,{maximumFractionDigits:1});
  nf2=new Intl.NumberFormat(loc,{minimumFractionDigits:1,maximumFractionDigits:2});
}
applyLang();

const PLATFORMS = {
  tiktok:{name:'TikTok', cssVar:'--tiktok'},
  shopee:{name:'Shopee', cssVar:'--shopee'},
  meta:  {name:'Meta',   cssVar:'--meta'},
  lazada:{name:'Lazada', cssVar:'--lazada'},
};
const pcolor = p => getComputedStyle(document.documentElement).getPropertyValue(PLATFORMS[p]?.cssVar||'--ink').trim();

/* ---------- channel defs ---------- */
const CH_ORDER = ['tt_live_smo','tt_live_sid','tt_live_smv','tt_live_aff','tt_live_all','tt_vsa','tt_vsa_ns','tt_psa','tt_psa_ns','tt_vsa_psa',
  'tt_ci_smv','tt_bc_ext','tt_aw_ext',
  'meta_cpas','meta_reg','meta_aw','meta_traffic','sp_live','sp_sba','sp_pc','sp_pc_new','sp_store','lz_store','lz_product'];
const CH_DEF = RAW.channels.slice().sort((a,b)=>{
  const ia=CH_ORDER.indexOf(a.id), ib=CH_ORDER.indexOf(b.id);
  return (ia<0?99:ia)-(ib<0?99:ib);
});
const chDef = id => CH_DEF.find(c=>c.id===id);
const SALES_DEF = CH_DEF.filter(c=>c.objective==='sales');
const SALES_IDS = SALES_DEF.map(c=>c.id);
const UPPER_DEF = CH_DEF.filter(c=>c.objective==='upper');
const UPPER_IDS = UPPER_DEF.map(c=>c.id);
const ALL_IDS = CH_DEF.map(c=>c.id);
const platIds = p => SALES_DEF.filter(c=>c.platform===p).map(c=>c.id);
const platUpperIds = p => UPPER_DEF.filter(c=>c.platform===p).map(c=>c.id);
const platAllIds = p => CH_DEF.filter(c=>c.platform===p).map(c=>c.id);

/* ---------- targets & storage ---------- */
const DEFAULT_TARGETS = {
  tt_vsa:10, tt_vsa_ns:6, tt_psa:15, tt_psa_ns:10, tt_vsa_psa:12,
  tt_live_smo:8, tt_live_sid:8, tt_live_smv:8, tt_live_aff:8, tt_live_all:8,
  meta_cpas:20, meta_reg:8, sp_live:8, sp_sba:4, sp_pc:10, sp_pc_new:8, sp_store:8,
  lz_store:6, lz_product:6,
};
const LS_T='smoAdsTargets', LS_O='smoAdsOverlayV3', LS_TH='smoAdsTheme', LS_MASK='smoAdsMaskMonths',
      LS_B='smoAdsBudgets', LS_GMVMP='smoAdsGmvMp';
const store = {
  get(k,d){ try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d} },
  set(k,v){ try{localStorage.setItem(k,JSON.stringify(v))}catch(e){} },
};
/* data yang di-"bake" ke dalam file HTML ekspor (mode satu operator):
   sekali per stamp, isi localStorage dari snapshot supaya tim melihat data
   yang sama tanpa server. Tidak menimpa berulang kali (menjaga eksplorasi tim). */
(function seedBaked(){
  let B=null; try{B=JSON.parse((document.getElementById('BAKED_STATE')||{}).textContent||'null')}catch(e){}
  if(!B||!B.keys)return;
  const flag='smoAdsBaked_'+(B.stamp||'x');
  try{ if(localStorage.getItem(flag))return;
    for(const k in B.keys) localStorage.setItem(k, JSON.stringify(B.keys[k]));
    localStorage.setItem(flag,'1');
  }catch(e){}
})();
let targets = Object.assign({}, DEFAULT_TARGETS, store.get(LS_T,{}));
/* bulan yang "dikosongkan": data dasar sheet diabaikan, hanya pakai upload (overlay).
   Reversible — matikan lagi dari tab Upload untuk kembali ke data sheet. */
let maskMonths = store.get(LS_MASK,{});
let budgetOv = store.get(LS_B,{});      // {mk:{chId:budget}} — budget bisa diedit di tab Platform
let gmvMpOv = store.get(LS_GMVMP,{});   // {mk:{tiktok,shopee,lazada}} — GMV marketplace bulanan (input manual)
let overlay = store.get(LS_O,null);
if(!overlay){                       // migrasi format lama (index hari Juli) → iso
  const old=store.get('smoAdsOverlay',null);
  overlay={};
  if(old){for(const cid in old){for(const m in old[cid]){for(const d in old[cid][m]){
    ((overlay[cid]??={})[m]??={})[LATEST+'-'+String(+d+1).padStart(2,'0')]=old[cid][m][d];
  }}}}
  store.set(LS_O,overlay);
}

/* ---------- format angka (mengikuti bahasa) ---------- */
const SUF=()=>LANG==='id'?{b:' M',m:' jt',k:' rb'}:{b:'B',m:'M',k:'K'};
const fmtRp = v => v==null?'–':'Rp'+nf0.format(Math.round(v));
const fmtRpC= v => { if(v==null) return '–'; const a=Math.abs(v),s=v<0?'-':'',u=SUF();
  if(a>=1e9) return s+'Rp'+nf1.format(a/1e9)+u.b;
  if(a>=1e6) return s+'Rp'+nf1.format(a/1e6)+u.m;
  if(a>=1e3) return s+'Rp'+nf0.format(a/1e3)+u.k;
  return s+'Rp'+nf0.format(a); };
const fmtN = v => v==null?'–':nf0.format(Math.round(v));
const fmtNC= v => { if(v==null) return '–'; const a=Math.abs(v),u=SUF();
  if(a>=1e6) return nf1.format(v/1e6)+u.m;
  if(a>=1e3) return nf1.format(v/1e3)+u.k;
  return nf0.format(v); };
const fmtX  = v => v==null?'–':nf2.format(v)+'×';
const fmtPct= v => v==null?'–':nf1.format(v)+'%';
const esc = s => String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- kalender ---------- */
const mkOf = iso => iso.slice(0,7);
const dayOf = iso => +iso.slice(8,10);
const mkDays = mk => RAW.months[mk]? RAW.months[mk].days : new Date(+mk.slice(0,4), +mk.slice(5,7), 0).getDate();
const mkLabel = mk => MONTHS[+mk.slice(5,7)-1]+' '+mk.slice(0,4);
const mkLabelS = mk => MONTHS_S[+mk.slice(5,7)-1]+' '+mk.slice(2,4);
const isoOf = (mk,d) => mk+'-'+String(d).padStart(2,'0');
const isoLabel = iso => dayOf(iso)+' '+MONTHS_S[+iso.slice(5,7)-1];
const isoLabelY = iso => dayOf(iso)+' '+MONTHS_S[+iso.slice(5,7)-1]+' '+iso.slice(0,4);
function isoShift(iso,delta){ const d=new Date(iso+'T00:00:00'); d.setDate(d.getDate()+delta);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function isoSeq(from,to){ const out=[]; let cur=from; let guard=0;
  while(cur<=to && guard++<800){ out.push(cur); cur=isoShift(cur,1); } return out; }
const isoDiff=(a,b)=>Math.round((new Date(b+'T00:00:00')-new Date(a+'T00:00:00'))/86400000);
const inData = iso => RAW.months[mkOf(iso)]!=null;
const clampIso = iso => iso<FIRST_ISO?FIRST_ISO: iso>isoOf(LATEST,mkDays(LATEST))?isoOf(LATEST,mkDays(LATEST)):iso;

/* ---------- merged series (bulan + overlay) ---------- */
const _cache={};
function monthSeries(mk){
  if(_cache[mk]) return _cache[mk];
  const nd=mkDays(mk);
  const src=maskMonths[mk]? {} : ((RAW.months[mk]||{}).series||{});
  const out={};
  const ids=new Set([...Object.keys(src)]);
  for(const cid in overlay){for(const m in overlay[cid]){for(const iso in overlay[cid][m]){
    if(mkOf(iso)===mk) ids.add(cid);
  }}}
  for(const cid of ids){
    const chSrc=src[cid]||{};
    const o={};
    const keys=new Set([...Object.keys(chSrc),...Object.keys(overlay[cid]||{})]);
    for(const k of keys){
      let arr=chSrc[k]?chSrc[k].slice():null;
      const ov=(overlay[cid]||{})[k];
      if(ov){ for(const iso in ov){ if(mkOf(iso)===mk){ if(!arr)arr=Array(nd).fill(0); arr[dayOf(iso)-1]=ov[iso]; } } }
      if(arr){ while(arr.length<nd)arr.push(0); o[k]=arr; }
    }
    if(Object.keys(o).length) out[cid]=o;
  }
  return _cache[mk]=out;
}
function invalidateCache(){ for(const k in _cache) delete _cache[k]; if(typeof rebuildMOM==='function') rebuildMOM(); }

const sum=a=>a.reduce((x,y)=>x+(y||0),0);
const div=(a,b)=>(b&&b!==0)?a/b:null;

/* nilai deret harian untuk kumpulan channel pada rentang iso */
function seriesRange(chIds, metric, from, to){
  const seq=isoSeq(from,to);
  return seq.map(iso=>{
    const mk=mkOf(iso); const ms=RAW.months[mk]?monthSeries(mk):null;
    if(!ms) return 0;
    let v=0;
    for(const cid of chIds){ const a=(ms[cid]||{})[metric]; if(a) v+=a[dayOf(iso)-1]||0; }
    return v;
  });
}
function statsRange(chIds, from, to){
  const c=sum(seriesRange(chIds,'cost',from,to)),
        g=sum(seriesRange(chIds,'gmv',from,to)),
        o=sum(seriesRange(chIds,'orders',from,to)),
        im=sum(seriesRange(chIds,'impressions',from,to)),
        cl=sum(seriesRange(chIds,'clicks',from,to));
  return {cost:c,gmv:g,orders:o,imp:im,clk:cl,
    roas:div(g,c),cpo:div(c,o),aov:div(g,o),
    ctr:im?100*cl/im:null,ctor:cl?100*o/cl:null};
}
/* stat per channel dalam satu bulan */
function chMonth(cid, mk){
  const ms=monthSeries(mk); const days=ms[cid]||{};
  const nd=mkDays(mk);
  const cost=days.cost||[],gmv=days.gmv||[],orders=days.orders||[];
  let last=0; for(let d=0;d<nd;d++) if((cost[d]||0)>0||(gmv[d]||0)>0||(orders[d]||0)>0) last=d+1;
  const t={cost:sum(cost),gmv:sum(gmv),orders:sum(orders),imp:sum(days.impressions||[]),clk:sum(days.clicks||[])};
  return {id:cid,...(chDef(cid)||{}),days,last,tot:t,nd,
    budget:(budgetOv[mk]||{})[cid] ?? (((RAW.months[mk]||{}).budgets||{})[cid]||null),
    roas:div(t.gmv,t.cost),cpo:div(t.cost,t.orders),aov:div(t.gmv,t.orders),
    ctr:t.imp?100*t.clk/t.imp:null,ctor:t.clk?100*t.orders/t.clk:null};
}
/* iso terakhir dengan data (global, dalam LATEST) */
function computeGlobalLast(){
  let last=1;
  const ms=monthSeries(LATEST);
  for(const cid in ms){ const a=ms[cid].cost||[],g=ms[cid].gmv||[];
    for(let d=0;d<mkDays(LATEST);d++) if((a[d]||0)>0||(g[d]||0)>0) last=Math.max(last,d+1); }
  return last;
}
let GLOBAL_LAST = computeGlobalLast();
const LATEST_LAST_ISO = () => isoOf(LATEST, GLOBAL_LAST);

/* ---------- MoM (tab sheet) ---------- */
const momRow=(y,name)=>((RAW.mom[y]||{})[name]||Array(12).fill(null));
/* bulan yang punya unggahan (overlay) atau di-mask: dihitung ulang dari data harian
   supaya tabel MoM ikut terupdate tiap kali data ditambahkan, konsisten dengan tab
   Daily/Platform. Bulan tanpa unggahan tetap memakai angka resmi dari sheet. */
function momMonthLive(mk){
  if(maskMonths&&maskMonths[mk])return true;
  for(const cid in overlay){const mm=overlay[cid];for(const k in mm){for(const iso in mm[k]){if(mkOf(iso)===mk)return true;}}}
  return false;
}
function momPack(y){
  const r=n=>momRow(y,n).slice();
  const P={
    gmv:r('Total GMV From Ads'), cost:r('Total All Ads Cost'), salesCost:r('Total Sales Ads Cost'),
    orders:r('Total Orders From Ads'), roas:r('ROAS'), aov:r('AOV'), cpo:r('Cost Per Orders'),
    ctr:r('CTR'), ctor:r('CTOR'), imp:r('Impression'), clk:r('Product Clicks'), eff:r('Ads Efficiency Rate'),
    gmvAllMp:r('Total GMV All MP').map(v=>v===0?null:v),
  };
  for(let m=0;m<12;m++){
    const mk=`${y}-${String(m+1).padStart(2,'0')}`;
    if(!RAW.months[mk]||!momMonthLive(mk))continue;
    const from=isoOf(mk,1),to=isoOf(mk,mkDays(mk));
    const s=statsRange(SALES_IDS,from,to),u=statsRange(UPPER_IDS,from,to);
    const allCost=s.cost+u.cost,imp=s.imp+u.imp,clk=s.clk+u.clk;
    P.gmv[m]=s.gmv; P.cost[m]=allCost; P.salesCost[m]=s.cost; P.orders[m]=s.orders;
    P.imp[m]=imp; P.clk[m]=clk;
    P.roas[m]=div(s.gmv,allCost); P.aov[m]=div(s.gmv,s.orders); P.cpo[m]=div(allCost,s.orders);
    P.ctr[m]=imp?100*clk/imp:null; P.ctor[m]=clk?100*s.orders/clk:null;
    /* Ads Efficiency Rate tetap dari sheet (tidak dihitung dari harian);
       Total GMV All Marketplace tetap dari sheet / input manual (gmvMpOv) di render */
  }
  return P;
}
let MOM={ '2025':momPack('2025'), '2026':momPack('2026') };
function rebuildMOM(){ MOM={ '2025':momPack('2025'), '2026':momPack('2026') }; }
/* GMV & cost per platform per bulan — dihitung dari data harian channel (konsisten dgn filter) */
function platMonthly(year, metric){
  const out={};
  for(const p in PLATFORMS){
    out[p]=Array(12).fill(null);
    for(let m=0;m<12;m++){
      const mk=`${year}-${String(m+1).padStart(2,'0')}`;
      if(!RAW.months[mk]) continue;
      const v=sum(seriesRange(platIds(p),metric,isoOf(mk,1),isoOf(mk,mkDays(mk))));
      out[p][m]=v||null;
    }
  }
  return out;
}

/* ---------- tooltip & charts ---------- */
const tip=document.getElementById('tip');
function showTip(html,x,y){
  tip.innerHTML=html; tip.style.display='block';
  const r=tip.getBoundingClientRect();
  let L=x+14,T=y+14;
  if(L+r.width>innerWidth-8)L=x-r.width-14;
  if(T+r.height>innerHeight-8)T=y-r.height-14;
  tip.style.left=L+'px';tip.style.top=T+'px';
}
const hideTip=()=>tip.style.display='none';
const SVGNS='http://www.w3.org/2000/svg';
function el(tag,attrs,parent){const e=document.createElementNS(SVGNS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e;}
function niceTicks(max,n=4){
  if(!(max>0)) return [0,1];
  const step0=max/n, mag=Math.pow(10,Math.floor(Math.log10(step0)));
  const step=[1,2,2.5,5,10].map(m=>m*mag).find(s=>s>=step0);
  const out=[];for(let v=0;v<=max*1.0001+step*.5&&out.length<8;v+=step)out.push(v);
  if(out[out.length-1]<max)out.push(out[out.length-1]+step);
  return out;
}
function lineChart(container, series, labels, opts={}){
  const H=opts.height||190,PADL=46,PADR=14,PADT=12,PADB=22;
  const box=document.createElement('div');box.className='chart-box';container.appendChild(box);
  const W=Math.max(box.clientWidth||container.clientWidth||600,320);
  const svg=el('svg',{viewBox:`0 0 ${W} ${H}`,width:'100%',height:H});box.appendChild(svg);
  const iw=W-PADL-PADR,ih=H-PADT-PADB;
  const n=labels.length;
  const vals=series.flatMap(s=>s.values.filter(v=>v!=null));
  const max=Math.max(...vals,0);const ticks=niceTicks(max);const ymax=ticks[ticks.length-1]||1;
  const X=i=>PADL+(n<=1?iw/2:i*iw/(n-1));
  const Y=v=>PADT+ih-(v/ymax)*ih;
  const fmt=opts.fmt||fmtNC;
  for(const t of ticks){
    el('line',{x1:PADL,x2:W-PADR,y1:Y(t),y2:Y(t),stroke:'var(--grid)','stroke-width':1},svg);
    const tx=el('text',{x:PADL-7,y:Y(t)+3.5,'text-anchor':'end','font-size':10,fill:'var(--muted)'},svg);
    tx.textContent=fmt(t).replace('Rp','');
  }
  el('line',{x1:PADL,x2:W-PADR,y1:Y(0),y2:Y(0),stroke:'var(--axis)','stroke-width':1},svg);
  const lblEvery=Math.ceil(n/(W>700?12:7));
  labels.forEach((lb,i)=>{if(i%lblEvery===0||i===n-1){
    const tx=el('text',{x:X(i),y:H-6,'text-anchor':'middle','font-size':10,fill:'var(--muted)'},svg);
    tx.textContent=lb;}});
  for(const s of series){
    const pts=s.values.map((v,i)=>v==null?null:[X(i),Y(v)]);
    let dPath='',started=false;
    pts.forEach(p=>{if(!p){started=false;return}dPath+=(started?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1);started=true;});
    if(opts.area&&series.length===1){
      let aPath=dPath;const first=pts.find(Boolean),lastP=[...pts].reverse().find(Boolean);
      if(first&&lastP){aPath+=`L${lastP[0]} ${Y(0)}L${first[0]} ${Y(0)}Z`;
        el('path',{d:aPath,fill:s.color,opacity:.09},svg);}
    }
    el('path',{d:dPath,fill:'none',stroke:s.color,'stroke-width':2,'stroke-linejoin':'round','stroke-linecap':'round',...(s.dash?{'stroke-dasharray':s.dash}:{})},svg);
    const li=s.values.map((v,i)=>v!=null?i:null).filter(v=>v!=null).pop();
    if(li!=null)el('circle',{cx:X(li),cy:Y(s.values[li]),r:3.5,fill:s.color,stroke:'var(--surface)','stroke-width':2},svg);
  }
  const cross=el('line',{y1:PADT,y2:PADT+ih,stroke:'var(--axis)','stroke-width':1,'stroke-dasharray':'3 3',opacity:0},svg);
  const hot=el('rect',{x:PADL,y:PADT,width:iw,height:ih,fill:'transparent'},svg);
  hot.addEventListener('pointermove',ev=>{
    const r=svg.getBoundingClientRect();const sx=(ev.clientX-r.left)*(W/r.width);
    let i=Math.round((sx-PADL)/(n<=1?1:iw/(n-1)));i=Math.max(0,Math.min(n-1,i));
    cross.setAttribute('x1',X(i));cross.setAttribute('x2',X(i));cross.setAttribute('opacity',1);
    const rows=series.map(s=>{
      if(s.values[i]==null)return '';
      const shown=s.real?(s.rfmt||fmt)(s.real[i]):fmt(s.values[i]);
      return `<div class="r"><span><i style="background:${s.color}"></i>${esc(s.name)}</span><span class="v">${shown}</span></div>`;
    }).join('');
    showTip(`<div class="t">${esc(opts.tipTitle?opts.tipTitle(i):labels[i])}</div>${rows}`,ev.clientX,ev.clientY);
  });
  hot.addEventListener('pointerleave',()=>{cross.setAttribute('opacity',0);hideTip();});
  if(series.length>1&&!opts.noLegend){
    const lg=document.createElement('div');lg.className='legend';
    lg.innerHTML=series.map(s=>`<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join('');
    box.appendChild(lg);
  }
  return box;
}
function hBars(container, items, opts={}){
  const fmt=opts.fmt||fmtRpC;
  const max=Math.max(...items.map(i=>i.value||0),1);
  const div0=document.createElement('div');
  div0.innerHTML=items.map(it=>{
    const w=Math.max(1.2,100*(it.value||0)/max);
    return `<div style="display:flex;align-items:center;gap:10px;margin:7px 0">
      <span style="width:148px;flex:none;font-size:12px;color:var(--ink-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(it.name)}</span>
      <div style="flex:1"><div style="background:${it.color};height:16px;border-radius:0 4px 4px 0;width:${w}%;min-width:3px"></div></div>
      <span style="width:86px;flex:none;text-align:right;font-size:12px;font-weight:650;font-variant-numeric:tabular-nums">${fmt(it.value)}</span>
      ${it.extra?`<span style="width:64px;flex:none;text-align:right;font-size:11.5px;color:var(--muted)">${esc(it.extra)}</span>`:''}
    </div>`;}).join('');
  container.appendChild(div0);
}
function stackBars(container, series, mIdx, opts={}){
  const H=opts.height||200,PADL=46,PADR=12,PADT=12,PADB=22;
  const box=document.createElement('div');box.className='chart-box';container.appendChild(box);
  const W=Math.max(box.clientWidth||600,320);
  const svg=el('svg',{viewBox:`0 0 ${W} ${H}`,width:'100%',height:H});box.appendChild(svg);
  const iw=W-PADL-PADR,ih=H-PADT-PADB;
  const totals=mIdx.map(m=>sum(series.map(s=>s.values[m]||0)));
  const ticks=niceTicks(Math.max(...totals,1));const ymax=ticks[ticks.length-1]||1;
  const fmt=opts.fmt||fmtRpC;
  for(const t of ticks){
    el('line',{x1:PADL,x2:W-PADR,y1:PADT+ih-(t/ymax)*ih,y2:PADT+ih-(t/ymax)*ih,stroke:'var(--grid)'},svg);
    const tx=el('text',{x:PADL-7,y:PADT+ih-(t/ymax)*ih+3.5,'text-anchor':'end','font-size':10,fill:'var(--muted)'},svg);
    tx.textContent=fmt(t).replace('Rp','');
  }
  const bw=Math.min(46,iw/mIdx.length*0.55);
  mIdx.forEach((m,k)=>{
    const cx=PADL+iw*(k+0.5)/mIdx.length;
    let y=PADT+ih;
    const segs=[];
    series.forEach(s=>{
      const v=s.values[m]||0;if(v<=0)return;
      const h=Math.max(0,(v/ymax)*ih-2);
      y-=h;segs.push({s,v,y,h});y-=2;
    });
    segs.forEach((sg,si)=>{
      el('rect',{x:cx-bw/2,y:sg.y,width:bw,height:sg.h,fill:sg.s.color,rx:si===segs.length-1?4:0},svg);
    });
    const tx=el('text',{x:cx,y:H-6,'text-anchor':'middle','font-size':10,fill:'var(--muted)'},svg);
    tx.textContent=opts.labels?opts.labels[k]:MONTHS_S[m];
    const hot=el('rect',{x:cx-bw/2-4,y:PADT,width:bw+8,height:ih,fill:'transparent'},svg);
    hot.addEventListener('pointermove',ev=>{
      const rows=series.map(s=>{const v=s.values[m];return v?`<div class="r"><span><i style="background:${s.color}"></i>${esc(s.name)}</span><span class="v">${fmt(v)}</span></div>`:''}).join('');
      showTip(`<div class="t">${esc(opts.labels?opts.labels[k]:MONTHS[m])}</div>${rows}<div class="r" style="margin-top:3px;border-top:1px solid var(--grid);padding-top:3px"><span>Total</span><span class="v">${fmt(totals[k])}</span></div>`,ev.clientX,ev.clientY);
    });
    hot.addEventListener('pointerleave',hideTip);
  });
  el('line',{x1:PADL,x2:W-PADR,y1:PADT+ih,y2:PADT+ih,stroke:'var(--axis)'},svg);
  const lg=document.createElement('div');lg.className='legend';
  lg.innerHTML=series.map(s=>`<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join('');
  box.appendChild(lg);
  return box;
}
/* ---------- modal, konfirmasi, toast (pengganti prompt/alert yang diblokir
   di lingkungan artifact ber-sandbox) ---------- */
const modalWrap=document.getElementById('modalWrap'), modalBox=document.getElementById('modalBox');
function uiPrompt({title,label,value='',type='text',ok='OK',cancel='Batal'}){
  return new Promise(res=>{
    modalBox.innerHTML=`<h4>${title}</h4>${label?`<p>${label}</p>`:''}
      <input id="mInp" type="${type}" value="${String(value).replace(/"/g,'&quot;')}">
      <div class="row"><button class="btn ghost" id="mCancel">${cancel}</button><button class="btn" id="mOk">${ok}</button></div>`;
    modalWrap.classList.add('open');
    const inp=document.getElementById('mInp'); inp.focus(); inp.select();
    const done=v=>{modalWrap.classList.remove('open');res(v);};
    document.getElementById('mOk').onclick=()=>done(inp.value);
    document.getElementById('mCancel').onclick=()=>done(null);
    inp.onkeydown=e=>{if(e.key==='Enter')done(inp.value);if(e.key==='Escape')done(null);};
    modalWrap.onclick=e=>{if(e.target===modalWrap)done(null);};
  });
}
function uiConfirm(title,msg,ok='OK',cancel='Batal'){
  return new Promise(res=>{
    modalBox.innerHTML=`<h4>${title}</h4>${msg?`<p>${msg}</p>`:''}
      <div class="row"><button class="btn ghost" id="mCancel">${cancel}</button><button class="btn" id="mOk">${ok}</button></div>`;
    modalWrap.classList.add('open');
    const done=v=>{modalWrap.classList.remove('open');res(v);};
    document.getElementById('mOk').onclick=()=>done(true);
    document.getElementById('mCancel').onclick=()=>done(false);
    modalWrap.onclick=e=>{if(e.target===modalWrap)done(false);};
  });
}
let _toastT;
function uiToast(msg){
  const el=document.getElementById('toast');
  el.textContent=msg;el.classList.add('show');
  clearTimeout(_toastT);_toastT=setTimeout(()=>el.classList.remove('show'),2600);
}
function spark(values,color,w=140,h=34){
  const vals=values.filter(v=>v!=null);if(!vals.length)return'';
  const max=Math.max(...vals),min=Math.min(...vals),n=values.length;
  const X=i=>2+(w-4)*i/(n-1||1),Y=v=>h-4-(h-8)*((v-min)/((max-min)||1));
  let d='',st=false;
  values.forEach((v,i)=>{if(v==null){st=false;return}d+=(st?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1);st=true;});
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" height="${h}" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/></svg>`;
}
</script>
