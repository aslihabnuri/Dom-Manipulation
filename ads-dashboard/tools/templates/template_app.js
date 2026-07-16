<script>
'use strict';
/* =================== BAHASA =================== */
const L=(id,en)=>LANG==='id'?id:en;
/* nama channel formal, dwibahasa */
const CH_LABEL={
  tt_live_smo:['GMV Max Live Sophie Martin Official','GMV Max Live Sophie Martin Official'],
  tt_live_sid:['GMV Max Live Sophie Martin','GMV Max Live Sophie Martin'],
  tt_live_smv:['GMV Max Live Sophieverse','GMV Max Live Sophieverse'],
  tt_live_aff:['GMV Max Live Affiliate','GMV Max Live Affiliate'],
  tt_live_all:['Total GMV Max Live','Total GMV Max Live'],
  tt_vsa:['Video Product Existing','Video Product Existing'],
  tt_vsa_ns:['Video New Product','Video New Product'],
  tt_psa:['Product Card Existing','Product Card Existing'],
  tt_psa_ns:['Product Card New','Product Card New'],
  tt_vsa_psa:['Total GMV Max Product','Total GMV Max Product'],
  tt_ci_smv:['Community Interaction','Community Interaction'],
  tt_bc_ext:['Brand Consideration','Brand Consideration'],
  tt_aw_ext:['Awareness TikTok','TikTok Awareness'],
  meta_cpas:['Meta CPAS (Penjualan)','Meta CPAS (Sales)'],
  meta_reg:['Meta Reguler (Penjualan)','Meta Regular (Sales)'],
  meta_aw:['Awareness Meta Reguler','Meta Regular Awareness'],
  meta_traffic:['Traffic Meta Reguler','Meta Regular Traffic'],
  sp_live:['Shopee Live','Shopee Live'],
  sp_sba:['Banner Ads','Banner Ads'],
  sp_pc:['Iklan Produk Shopee','Shopee Product Ads'],
  sp_pc_new:['Iklan Produk Baru Shopee','Shopee New Product Ads'],
  sp_store:['Iklan Toko Shopee','Shopee Shop Ads'],
  lz_store:['Lazada Sponsored Max Store','Lazada Sponsored Max Store'],
  lz_product:['Lazada Sponsored Max Product','Lazada Sponsored Max Product'],
};
const chName=id=>{const m=CH_LABEL[id];return m?(LANG==='id'?m[0]:m[1]):(chDef(id)?.name||id);};

/* =================== MESIN ANALISIS (bulan berjalan) =================== */
const HIDDEN_CH=new Set(['tt_live_all','tt_vsa_psa']);
/* agregat hitung-sendiri: Total GMV Max Live & Total GMV Max Product */
const GMVMAX_LIVE_IDS=['tt_live_smo','tt_live_sid','tt_live_smv','tt_live_aff'];
const GMVMAX_PROD_IDS=['tt_vsa','tt_vsa_ns','tt_psa','tt_psa_ns'];
const SUM_CH={ 'sum:live':{name:()=>'Total GMV Max Live',ids:GMVMAX_LIVE_IDS},
               'sum:prod':{name:()=>'Total GMV Max Product',ids:GMVMAX_PROD_IDS} };
const avg=a=>{const v=a.filter(x=>x!=null);return v.length?sum(v)/v.length:null};
const median=a=>{const v=a.filter(x=>x!=null).sort((x,y)=>x-y);if(!v.length)return null;
  const m=v.length>>1;return v.length%2?v[m]:(v[m-1]+v[m])/2;};
const windowVals=(arr,endDay,len)=>{const s=Math.max(0,endDay-len);return (arr||[]).slice(s,endDay);};
const SEV={critical:0,serious:1,warning:2,info:3};
const SEV_LBL=()=>({critical:L('KRITIS','CRITICAL'),serious:L('SERIUS','SERIOUS'),warning:L('PERHATIAN','ATTENTION'),info:L('INFO','INFO'),opp:L('PELUANG','OPPORTUNITY')});
const SEV_CLS={critical:'crit',serious:'ser',warning:'warn',info:'info',opp:'opp'};
const SEV_IC={critical:'⛔',serious:'🔻',warning:'⚠️',info:'ℹ️',opp:'🚀'};
const SOP=()=>({
  shopeeTurunModal:L('Turunkan anggaran harian kampanye dengan ROAS di bawah 10 ke tingkat "ROAS Kecil" (Rp40.008 hingga Rp60.012) sesuai SOP Anggaran Iklan Shopee.','Reduce the daily budget of campaigns with ROAS below 10 to the "Low ROAS" tier (Rp40,008 to Rp60,012) according to the Shopee Ads Budget SOP.'),
  shopeeGeser:L('Alihkan anggaran ke lima kampanye dengan ROAS tertinggi. Hindari menghentikan kampanye yang masih dalam fase pembelajaran (kurang dari 7 hari).','Shift budget to the five campaigns with the highest ROAS. Avoid pausing campaigns still in the learning phase (under 7 days).'),
  shopeeStok:L('Periksa stok, harga, dan voucher produk utama di Seller Center. Penurunan ROAS sering dipicu stok habis atau voucher yang berakhir.','Check stock, pricing, and vouchers of key products in Seller Center. ROAS declines are often caused by out-of-stock items or expired vouchers.'),
  ttCreative:L('Rotasikan 2 hingga 3 materi video baru dan hentikan video dengan CTR di bawah rata-rata channel. Kejenuhan materi umumnya muncul pada hari ke-7 hingga ke-14.','Rotate 2 to 3 new video creatives and pause videos with CTR below the channel average. Creative fatigue typically appears on days 7 to 14.'),
  ttRoi:L('Tinjau target ROI GMV Max dan ubah secara bertahap, maksimal satu kali per hari, agar fase pembelajaran tidak terulang.','Review the GMV Max ROI target and adjust gradually, at most once per day, to avoid resetting the learning phase.'),
  metaAudiens:L('Periksa tumpang tindih audiens Remarketing dan Prospecting di Ads Manager, lalu terapkan pengecualian audiens.','Check audience overlap between Remarketing and Prospecting in Ads Manager, then apply audience exclusions.'),
  metaKatalog:L('Perbarui product set CPAS: keluarkan produk yang habis stok dan prioritaskan produk dengan nilai pesanan tinggi.','Refresh the CPAS product set: remove out-of-stock items and prioritize high order value products.'),
  scaling:L('Lakukan peningkatan anggaran secara bertahap, maksimal 20 hingga 30 persen per dua hari, agar biaya per pesanan tetap stabil.','Scale budgets gradually, at most 20 to 30 percent every two days, to keep cost per order stable.'),
  peak:L('Menjelang tanggal kembar atau gajian, naikkan anggaran ke tingkat Peak pada H-1, hari H, dan H+1 sesuai SOP.','Ahead of double date or payday events, raise budgets to the Peak tier on D-1, D-day, and D+1 according to the SOP.'),
});
function actionRoas(ch){
  const S=SOP();
  if(ch.platform==='shopee') return [S.shopeeTurunModal,S.shopeeGeser,S.shopeeStok];
  if(ch.platform==='tiktok') return [S.ttCreative,S.ttRoi,L('Bandingkan harga dan voucher dengan kompetitor pada produk utama.','Compare pricing and vouchers against competitors on key products.')];
  if(ch.platform==='meta')   return [S.metaAudiens,S.metaKatalog,L('Uji format materi iklan dan alihkan anggaran ke ad set dengan ROAS terbaik.','Test creative formats and shift budget to the best performing ad sets.')];
  return [L('Audit kata kunci dan penawaran, lalu alihkan anggaran ke produk dengan konversi terbaik.','Audit keywords and bids, then shift budget to the best converting products.')];
}
function computeAlerts(){
  const alerts=[],opps=[];
  const push=(sev,ch,title,why,actions,metric)=>alerts.push({sev,ch,title,why,actions,metric});
  const DIMl=mkDays(LATEST), S=SOP();
  for(const def of CH_DEF){
    if(HIDDEN_CH.has(def.id))continue;
    const ch=chMonth(def.id,LATEST);
    const isSales=ch.objective==='sales';
    const T=targets[ch.id]||8;
    const cost=ch.days.cost||[],gmv=ch.days.gmv||[];
    if(ch.last===0){
      if((ch.budget||0)>0) push('info',ch,L('Belum ada data ','No data yet for ')+mkLabel(LATEST),
        L(`Anggaran ${fmtRpC(ch.budget)} telah dialokasikan tetapi belum ada biaya atau pesanan yang tercatat.`,`A budget of ${fmtRpC(ch.budget)} is allocated but no spend or orders are recorded.`),
        [L('Unggah data harian channel ini melalui tab Unggah.','Upload this channel\'s daily data through the Upload tab.')]);
      continue;
    }
    if(ch.last<GLOBAL_LAST-1)
      push('info',ch,L(`Data tertinggal ${GLOBAL_LAST-ch.last} hari`,`Data lags by ${GLOBAL_LAST-ch.last} days`),
        L(`Data terakhir pada hari ke-${ch.last}, sementara channel lain sudah mencapai hari ke-${GLOBAL_LAST}.`,`Latest data is on day ${ch.last}, while other channels have reached day ${GLOBAL_LAST}.`),
        [L('Unggah laporan untuk periode yang kosong melalui tab Unggah.','Upload reports for the missing period through the Upload tab.')]);
    if(!isSales) continue;
    if(ch.roas!=null){
      if(ch.roas<T*0.7)
        push('serious',ch,L(`ROAS ${fmtX(ch.roas)} jauh di bawah target ${fmtX(T)}`,`ROAS ${fmtX(ch.roas)} far below the ${fmtX(T)} target`),
          L(`Sepanjang bulan berjalan, setiap Rp1 biaya iklan hanya menghasilkan ${nf1.format(ch.roas)}. Target: ${nf1.format(T)}.`,`Month to date, every Rp1 of ad spend returns only ${nf1.format(ch.roas)}. Target: ${nf1.format(T)}.`),
          actionRoas(ch),{k:'ROAS MTD',v:fmtX(ch.roas),t:L('Target ','Target ')+fmtX(T)});
      else if(ch.roas<T)
        push('warning',ch,L(`ROAS ${fmtX(ch.roas)} di bawah target ${fmtX(T)}`,`ROAS ${fmtX(ch.roas)} below the ${fmtX(T)} target`),
          L(`Selisih ${nf1.format(100*(1-ch.roas/T))}% dari target dan masih dapat dikejar melalui optimasi kampanye.`,`A gap of ${nf1.format(100*(1-ch.roas/T))}% from target that can still be closed through campaign optimization.`),
          actionRoas(ch),{k:'ROAS MTD',v:fmtX(ch.roas),t:L('Target ','Target ')+fmtX(T)});
    }
    if(ch.last>=6){
      const roasD=cost.map((v,i)=>(v&&gmv[i]!=null)?gmv[i]/v:null);
      const trend=arr=>{
        const rec=avg(windowVals(arr,ch.last,3));
        const base=median(windowVals(arr,Math.max(0,ch.last-3),7));
        if(rec==null||base==null||base<=0)return null;
        return {rec,base,drop:100*(1-rec/base)};
      };
      const tR=trend(roasD),tG=trend(gmv),tC=trend(cost);
      if(tR&&tR.drop>=20)
        push(tR.drop>=35?'critical':'serious',ch,
          L(`ROAS turun ${nf0.format(tR.drop)}% dalam 3 hari terakhir`,`ROAS dropped ${nf0.format(tR.drop)}% in the last 3 days`),
          L(`Rata-rata 3 hari terakhir ${fmtX(tR.rec)} dibandingkan baseline 7 hari ${fmtX(tR.base)}.`,`Last 3 day average of ${fmtX(tR.rec)} versus the 7 day baseline of ${fmtX(tR.base)}.`),
          actionRoas(ch),{k:L('ROAS 3 hari','3 day ROAS'),v:fmtX(tR.rec),t:'Baseline '+fmtX(tR.base)});
      if(tG&&tG.drop>=25&&!(tC&&tC.drop>=25))
        push('serious',ch,L(`GMV harian turun ${nf0.format(tG.drop)}% dengan biaya yang stabil`,`Daily GMV dropped ${nf0.format(tG.drop)}% while spend held steady`),
          L(`Rata-rata GMV 3 hari terakhir ${fmtRpC(tG.rec)} dibandingkan baseline ${fmtRpC(tG.base)}. Efisiensi menurun.`,`Last 3 day GMV average of ${fmtRpC(tG.rec)} versus the ${fmtRpC(tG.base)} baseline. Efficiency is deteriorating.`),
          actionRoas(ch));
      else if(tG&&tG.drop>=25&&tC&&tC.drop>=25)
        push('warning',ch,L(`Biaya dan GMV turun bersamaan ${nf0.format(tC.drop)}%`,`Spend and GMV declined together by ${nf0.format(tC.drop)}%`),
          L('Penurunan terjadi seiring. Kemungkinan anggaran dikurangi atau limit tercapai, bukan masalah performa.','The decline is proportional. Budget was likely reduced or capped, rather than a performance issue.'),
          [L('Kembalikan anggaran harian ke tingkat normal bila penurunan tidak disengaja.','Restore daily budgets to the normal tier if the reduction was unintentional.'),S.scaling]);
      const clk=ch.days.clicks||[],ord=ch.days.orders||[];
      const ctorD=clk.map((v,i)=>v?100*(ord[i]||0)/v:null);
      const tCt=trend(ctorD);
      if(tCt&&tCt.drop>=20&&(ch.tot.clk||0)>500)
        push('warning',ch,L(`CTOR melemah ${nf0.format(tCt.drop)}%. Klik tidak berubah menjadi pesanan`,`CTOR weakened by ${nf0.format(tCt.drop)}%. Clicks are not converting to orders`),
          L(`CTOR 3 hari terakhir ${fmtPct(tCt.rec)} dibandingkan baseline ${fmtPct(tCt.base)}. Trafik tetap datang tetapi konversi menurun.`,`Last 3 day CTOR of ${fmtPct(tCt.rec)} versus the ${fmtPct(tCt.base)} baseline. Traffic continues but conversion is declining.`),
          [S.shopeeStok,L('Periksa halaman produk: ulasan terbaru dan kecepatan respons chat.','Review the product page: recent reviews and chat response speed.'),
           ch.platform==='tiktok'?S.ttCreative:L('Perbarui materi utama dan judul produk.','Refresh key creatives and product titles.')]);
    }
    if((ch.budget||0)>0&&ch.last>=3){
      const proj=ch.tot.cost/ch.last*DIMl;
      const pace=ch.tot.cost/(ch.budget*ch.last/DIMl);
      if(pace>1.2&&ch.roas!=null&&ch.roas>=T)
        push('info',ch,L(`Biaya ${nf0.format((pace-1)*100)}% di atas laju anggaran dengan ROAS yang sehat`,`Spend is ${nf0.format((pace-1)*100)}% above budget pace with healthy ROAS`),
          L(`Proyeksi akhir bulan ${fmtRpC(proj)} dibandingkan anggaran ${fmtRpC(ch.budget)}. ROAS ${fmtX(ch.roas)} berada di atas target sehingga kelebihan ini produktif.`,`Month end projection of ${fmtRpC(proj)} versus a ${fmtRpC(ch.budget)} budget. ROAS of ${fmtX(ch.roas)} is above target, so the overage is productive.`),
          [L('Ajukan penyesuaian anggaran bulanan bila ingin mempertahankan laju ini.','Request a monthly budget adjustment to maintain this pace.')]);
      else if(pace>1.2)
        push('warning',ch,L(`Kelebihan biaya ${nf0.format((pace-1)*100)}% dengan ROAS di bawah target`,`Overspend of ${nf0.format((pace-1)*100)}% with ROAS below target`),
          L(`Proyeksi ${fmtRpC(proj)} dibandingkan anggaran ${fmtRpC(ch.budget)}, sementara ROAS ${fmtX(ch.roas)} masih di bawah target ${fmtX(T)}.`,`Projection of ${fmtRpC(proj)} versus a ${fmtRpC(ch.budget)} budget, while ROAS of ${fmtX(ch.roas)} remains below the ${fmtX(T)} target.`),
          [L('Tahan laju biaya dan kembalikan anggaran harian ke tingkat normal.','Hold the spend pace and restore daily budgets to the normal tier.'),...actionRoas(ch).slice(0,2)]);
      else if(pace<0.6)
        push('warning',ch,L(`Penyerapan anggaran lambat (${nf0.format(pace*100)}% dari laju normal)`,`Slow budget utilization (${nf0.format(pace*100)}% of normal pace)`),
          L(`Baru ${fmtRpC(ch.tot.cost)} dari anggaran ${fmtRpC(ch.budget)}. Sisa ${fmtRpC(ch.budget-ch.tot.cost)} berisiko tidak terpakai.`,`Only ${fmtRpC(ch.tot.cost)} of the ${fmtRpC(ch.budget)} budget is used. The remaining ${fmtRpC(ch.budget-ch.tot.cost)} risks going unspent.`),
          [L('Naikkan anggaran harian secara bertahap pada kampanye dengan ROAS terbaik.','Gradually raise daily budgets on the best performing campaigns.'),S.scaling]);
    }
    if(ch.roas!=null&&ch.roas>=T*1.2&&ch.last>=5){
      const pace=(ch.budget||0)>0?ch.tot.cost/(ch.budget*ch.last/DIMl):0;
      if(pace<=1.05)
        opps.push({ch,title:L(`ROAS ${fmtX(ch.roas)}, ${nf0.format(100*ch.roas/T-100)}% di atas target. Kandidat peningkatan anggaran.`,`ROAS of ${fmtX(ch.roas)}, ${nf0.format(100*ch.roas/T-100)}% above target. A scale up candidate.`),
          why:L('Biaya masih dalam laju anggaran sehingga ada ruang peningkatan tanpa mengorbankan efisiensi.','Spend is still within budget pace, leaving room to scale without sacrificing efficiency.'),
          actions:[S.scaling,ch.platform==='shopee'?S.shopeeGeser:(ch.platform==='tiktok'?S.ttRoi:S.metaKatalog),S.peak]});
    }
  }
  alerts.sort((a,b)=>SEV[a.sev]-SEV[b.sev]);
  const perCh={},kept=[];
  for(const a of alerts){
    if(a.sev==='info'){kept.push(a);continue;}
    perCh[a.ch.id]=(perCh[a.ch.id]||0)+1;
    if(perCh[a.ch.id]<=2)kept.push(a);
  }
  return {alerts:kept,opps};
}
let ALERTS=computeAlerts();

/* =================== KOMPONEN UI =================== */
const view=document.getElementById('view');
const platChip=p=>`<span class="plat-chip"><span class="dot" style="background:${pcolor(p)}"></span>${PLATFORMS[p].name}</span>`;
function pill(roas,t){
  if(roas==null)return '<span class="pill-stat mid">n/a</span>';
  if(roas>=t)return `<span class="pill-stat ok">✓ ${fmtX(roas)}</span>`;
  if(roas>=t*0.7)return `<span class="pill-stat mid">△ ${fmtX(roas)}</span>`;
  return `<span class="pill-stat bad">✕ ${fmtX(roas)}</span>`;
}
function deltaVs(cur,prev,goodUp,vsLabel){
  if(cur==null||prev==null||prev===0)return `<span class="delta">vs ${esc(vsLabel)}: –</span>`;
  const d=100*(cur-prev)/Math.abs(prev);
  const up=d>=0,good=(up===goodUp);
  return `<span class="delta"><b class="${good?'up':'dn'}">${up?'▲':'▼'} ${nf1.format(Math.abs(d))}%</b> vs ${esc(vsLabel)}</span>`;
}
const kpiTile=(lbl,val,extra,sparkHtml)=>`<div class="card kpi"><div class="lbl">${esc(lbl)}</div><div class="val">${val}</div>${extra||''}${sparkHtml||''}</div>`;
function alertHtml(a,sevKey){
  const sev=sevKey||a.sev, SL=SEV_LBL();
  return `<div class="alert ${SEV_CLS[sev]}">
    <div class="ic">${SEV_IC[sev]}</div>
    <div class="bd">
      <div class="hd"><span class="sev">${SL[sev]}</span> ${platChip(a.ch.platform)} <b>${esc(chName(a.ch.id))}</b>
        ${a.metric?`<span style="font-size:11.5px;color:var(--muted)">${esc(a.metric.k)}: <b style="color:var(--ink)">${a.metric.v}</b> · ${esc(a.metric.t)}</span>`:''}</div>
      <div style="font-weight:700;font-size:13.5px">${esc(a.title)}</div>
      <div class="why">${esc(a.why)}</div>
      ${a.actions&&a.actions.length?`<ul class="acts"><span style="font-size:11px;font-weight:800;color:var(--muted)">${L('RENCANA TINDAKAN','ACTION PLAN')}</span>${a.actions.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
    </div></div>`;
}
function dailyOptions(includeAgg=true){
  let h='';
  if(includeAgg){
    h=`<optgroup label="${L('Agregat','Aggregate')}"><option value="all">${L('Semua Platform','All Platforms')}</option>`;
    for(const p in PLATFORMS)h+=`<option value="agg:${p}">Σ ${PLATFORMS[p].name}</option>`;
    h+='</optgroup>';
  }
  for(const p in PLATFORMS){
    const list=CH_DEF.filter(c=>c.platform===p&&!HIDDEN_CH.has(c.id));
    if(!list.length)continue;
    const extra=p==='tiktok'?`<option value="sum:live">Total GMV Max Live</option><option value="sum:prod">Total GMV Max Product</option>`:'';
    h+=`<optgroup label="${PLATFORMS[p].name}">${list.map(c=>`<option value="${c.id}">${esc(chName(c.id))}${c.objective!=='sales'?' · Branding Ads':''}</option>`).join('')}${extra}</optgroup>`;
  }
  return h;
}
function subjectOf(sel){
  if(sel==='all')return {name:L('Semua Platform','All Platforms'),platform:null,ids:SALES_IDS,sales:true};
  if(SUM_CH[sel])return {name:SUM_CH[sel].name(),platform:'tiktok',ids:SUM_CH[sel].ids,sales:true};
  if(sel.startsWith('agg:')){const p=sel.slice(4);return {name:'Σ '+PLATFORMS[p].name,platform:p,ids:platIds(p),sales:true};}
  const c=chDef(sel);
  return {name:chName(sel),platform:c.platform,ids:[c.id],sales:c.objective==='sales',ch:c};
}
const MAX_COLS=62;
function monthOptions(sel){
  return MONTH_KEYS.slice().reverse().map(mk=>`<option value="${mk}" ${mk===sel?'selected':''}>${mkLabel(mk)}</option>`).join('');
}

/* ---------- pemilih rentang tanggal (preset + custom) ---------- */
const DATA_END=()=>LATEST_LAST_ISO();
function presetRange(key){
  const end=DATA_END();
  switch(key){
    case 'today': return [end,end];
    case 'yesterday':{const y=clampIso(isoShift(end,-1));return [y,y];}
    case 'last7': return [clampIso(isoShift(end,-6)),end];
    case 'last30': return [clampIso(isoShift(end,-29)),end];
    case 'last3m': return [clampIso(isoShift(end,-89)),end];
    case 'last6m': return [clampIso(isoShift(end,-181)),end];
    case 'last12m': return [clampIso(isoShift(end,-364)),end];
    case 'thisMonth': return [isoOf(LATEST,1),end];
    case 'prevMonth':{const pm=prevMonthKey(LATEST);return [isoOf(pm,1),isoOf(pm,mkDays(pm))];}
    case 'thisYear': return [end.slice(0,4)+'-01-01',end];
    case 'prevYear':{const y=String(+end.slice(0,4)-1);return [`${y}-01-01`,`${y}-12-31`];}
  }
  return [isoOf(LATEST,1),end];
}
const PRESETS=()=>[
  ['today',L('Hari ini','Today')],['yesterday',L('Kemarin','Yesterday')],
  ['last7',L('7 hari terakhir','Last 7 days')],['last30',L('30 hari terakhir','Last 30 days')],
  ['last3m',L('3 bulan terakhir','Last 3 months')],['last6m',L('6 bulan terakhir','Last 6 months')],
  ['last12m',L('12 bulan terakhir','Last 12 months')],
  ['thisMonth',L('Bulan ini','This month')],['prevMonth',L('Bulan lalu','Last month')],
  ['thisYear',L('Tahun ini','This year')],['prevYear',L('Tahun lalu','Last year')],
];
let _rpSeq=0;
function rangePicker(container,{from,to,preset,onApply}){
  const id='rp'+(++_rpSeq);
  const wrap=document.createElement('div');wrap.className='rp';
  const lbl=()=>`${isoLabel(from)} ${from===to?'':' – '+isoLabel(to)} ${to.slice(0,4)!==from.slice(0,4)||true?to.slice(0,4):''}`.trim();
  wrap.innerHTML=`
    <button class="rp-btn" type="button"><span class="cal">🗓</span> <span class="rp-lbl">${isoLabelY(from)}${from===to?'':' – '+isoLabelY(to)}</span> <span style="opacity:.5">▾</span></button>
    <div class="rp-pop">
      <div class="rp-presets">${PRESETS().map(([k,l])=>`<button type="button" data-p="${k}" class="${k===preset?'on':''}">${l}</button>`).join('')}</div>
      <div class="rp-custom">
        <label>${L('Dari','From')}</label><input type="date" class="rp-from" value="${from}" min="${FIRST_ISO}" max="${DATA_END()}">
        <label>${L('Sampai','To')}</label><input type="date" class="rp-to" value="${to}" min="${FIRST_ISO}" max="${DATA_END()}">
        <button class="btn" type="button" style="margin-top:4px">${L('Terapkan','Apply')}</button>
      </div>
    </div>`;
  container.appendChild(wrap);
  const pop=wrap.querySelector('.rp-pop'), btn=wrap.querySelector('.rp-btn');
  btn.onclick=e=>{e.stopPropagation();pop.classList.toggle('open');};
  document.addEventListener('click',e=>{if(!wrap.contains(e.target))pop.classList.remove('open');});
  pop.querySelectorAll('.rp-presets button').forEach(b=>b.onclick=()=>{
    const [f,t]=presetRange(b.dataset.p);
    pop.classList.remove('open');
    onApply(f,t,b.dataset.p);
  });
  pop.querySelector('.btn').onclick=()=>{
    let f=pop.querySelector('.rp-from').value,t=pop.querySelector('.rp-to').value;
    if(!inData(f)||!inData(t))return uiToast(L('Tanggal di luar rentang data.','Date is outside the data range.'));
    if(t<f)[f,t]=[t,f];
    pop.classList.remove('open');
    onApply(f,t,'custom');
  };
  return wrap;
}

/* ---------- pemilih bulan (grid tahun + bulan, ala Seller Center) ---------- */
function monthPicker(container,{value,onApply}){
  const wrap=document.createElement('div');wrap.className='mp';
  const years=[...new Set(MONTH_KEYS.map(k=>k.slice(0,4)))];
  let y=value.slice(0,4);
  wrap.innerHTML=`<button class="rp-btn" type="button"><span class="cal">🗓</span> <span>${mkLabel(value)}</span> <span style="opacity:.5">▾</span></button><div class="mp-pop"></div>`;
  const pop=wrap.querySelector('.mp-pop'),btn=wrap.querySelector('.rp-btn');
  const draw=()=>{
    const yi=years.indexOf(y);
    pop.innerHTML=`
      <div class="mp-side">
        <button data-k="cur">${L('Bulan ini','This month')}</button>
        <button data-k="prev">${L('Bulan lalu','Last month')}</button>
      </div>
      <div class="mp-main">
        <div class="mp-year"><button data-n="-1" ${yi<=0?'disabled':''}>«</button><b>${y}</b><button data-n="1" ${yi>=years.length-1?'disabled':''}>»</button></div>
        <div class="mp-grid">${Array.from({length:12},(_,m)=>{
          const k2=`${y}-${String(m+1).padStart(2,'0')}`;
          const has=!!RAW.months[k2];
          return `<button type="button" data-mk="${k2}" ${has?'':'disabled'} class="${k2===value?'on':''}${k2===LATEST?' dot':''}">${MONTHS_S[m]}</button>`;}).join('')}</div>
      </div>`;
    pop.querySelectorAll('.mp-year button').forEach(b=>b.onclick=e=>{e.stopPropagation();y=years[years.indexOf(y)+ +b.dataset.n];draw();});
    pop.querySelectorAll('.mp-grid button[data-mk]').forEach(b=>b.onclick=()=>{if(b.disabled)return;pop.classList.remove('open');onApply(b.dataset.mk);});
    pop.querySelectorAll('.mp-side button').forEach(b=>b.onclick=()=>{pop.classList.remove('open');onApply(b.dataset.k==='cur'?LATEST:prevMonthKey(LATEST));});
  };
  draw();
  btn.onclick=e=>{e.stopPropagation();pop.classList.toggle('open');};
  document.addEventListener('click',e=>{if(!wrap.contains(e.target))pop.classList.remove('open');});
  container.appendChild(wrap);
}

/* ---------- chart dengan ceklis metrik ---------- */
const METRIC_CATALOG=()=>[
  {key:'cost',  label:L('Biaya Iklan','Ad Spend'), color:'var(--brand-2)', fmt:fmtRpC, unit:'rp'},
  {key:'gmv',   label:'GMV',                        color:'var(--good)',   fmt:fmtRpC, unit:'rp'},
  {key:'orders',label:L('Pesanan','Orders'),        color:'var(--shopee)', fmt:fmtN,   unit:'n'},
  {key:'impressions',label:L('Impresi','Impressions'),color:'var(--lazada)',fmt:fmtNC, unit:'n'},
  {key:'clicks',label:L('Klik Produk','Product Clicks'),color:'var(--meta)',fmt:fmtNC, unit:'n'},
  {key:'roas',  label:'ROAS',                       color:'var(--sm-pink)',fmt:fmtX,   unit:'x'},
];
let chartSel=store.get('smoAdsChartSel',{});
function metricChart(container,{id,seriesData,labels,defaults,tipTitle}){
  /* seriesData: {key:{...METRIC_CATALOG row, values[]}} */
  const box=document.createElement('div');container.appendChild(box);
  const sel=new Set(chartSel[id]||defaults);
  const draw=()=>{
    box.innerHTML='';
    const checks=document.createElement('div');checks.className='mchecks';
    for(const m of Object.values(seriesData)){
      const on=sel.has(m.key);
      const lab=document.createElement('label');
      lab.className=on?'on':'';
      lab.innerHTML=`<input type="checkbox" ${on?'checked':''}><i style="background:${m.color}"></i>${esc(m.label)}`;
      lab.querySelector('input').onchange=e=>{
        if(e.target.checked)sel.add(m.key);else if(sel.size>1)sel.delete(m.key);
        chartSel[id]=[...sel];store.set('smoAdsChartSel',chartSel);draw();
      };
      checks.appendChild(lab);
    }
    box.appendChild(checks);
    const act=Object.values(seriesData).filter(m=>sel.has(m.key));
    const units=new Set(act.map(m=>m.unit));
    const mixed=units.size>1;
    const series=act.map(m=>{
      if(!mixed)return {name:m.label,color:m.color,values:m.values};
      const mx=Math.max(...m.values.filter(v=>v!=null),0)||1;
      return {name:m.label,color:m.color,values:m.values.map(v=>v==null?null:100*v/mx),real:m.values,rfmt:m.fmt};
    });
    const fmt=mixed?(v=>nf0.format(v)):(act[0]?.fmt||fmtNC);
    const chartHost=document.createElement('div');box.appendChild(chartHost);
    lineChart(chartHost,series,labels,{fmt,tipTitle,noLegend:true,
      ...(mixed?{}:{area:series.length===1})});
    if(mixed){
      const n=document.createElement('div');n.className='note';n.style.marginTop='2px';
      n.textContent=L('Metrik memiliki satuan berbeda sehingga garis ditampilkan sebagai indeks (100 = puncak tiap metrik) agar bisa sejajar. Arahkan kursor ke grafik untuk melihat nilai aslinya lengkap dengan satuan.','Metrics use different units, so the lines are drawn as an index (100 = each metric\'s peak) to stay comparable. Hover over the chart to see the real values with units.');
      box.appendChild(n);
    }
  };
  draw();
}
function seriesDataFor(ids,from,to){
  const cat=METRIC_CATALOG();
  const out={};
  const cost=seriesRange(ids,'cost',from,to), gmv=seriesRange(ids,'gmv',from,to);
  for(const m of cat){
    let values;
    if(m.key==='roas')values=cost.map((c,i)=>c?(gmv[i]||0)/c:null);
    else if(m.key==='cost')values=cost;
    else if(m.key==='gmv')values=gmv;
    else values=seriesRange(ids,m.key,from,to);
    if(values.some(v=>v))out[m.key]={...m,values};
  }
  return out;
}

/* =================== RINGKASAN =================== */
let OV={mode:'range',from:isoOf(LATEST,1),to:LATEST_LAST_ISO(),preset:'thisMonth',cmp:'prev',year:'2026',basis:'all'};
function prevMonthKey(mk){const y=+mk.slice(0,4),m=+mk.slice(5,7);return m===1?`${y-1}-12`:`${y}-${String(m-1).padStart(2,'0')}`;}
function yoyIso(iso){let d=iso.slice(5);if(d==='02-29')d='02-28';return (+iso.slice(0,4)-1)+'-'+d;}
function fullMonthOf(from,to){
  return (dayOf(from)===1&&mkOf(from)===mkOf(to)&&dayOf(to)===mkDays(mkOf(from)))?mkOf(from):null;
}
const isMTD=()=>mkOf(OV.from)===LATEST&&dayOf(OV.from)===1&&OV.to===LATEST_LAST_ISO();
function ovRanges(){
  if(OV.mode==='year'){
    const y=OV.year, oy=y==='2026'?'2025':'2026';
    const yEnd=y==='2026'?LATEST_LAST_ISO():`${y}-12-31`;
    const cur=[`${y}-01-01`,yEnd];
    const cmp=[`${oy}-01-01`,`${oy}${yEnd.slice(4)}`];
    return {cur,cmp,curLabel:L('Tahun ','Year ')+y+(y==='2026'?' (YTD)':''),cmpLabel:L('periode sama ','same period ')+oy,fm:null};
  }
  const cur=[OV.from,OV.to], len=isoDiff(OV.from,OV.to)+1;
  const fm=fullMonthOf(OV.from,OV.to);
  let bFrom,bTo;
  if(fm||isMTD()){
    const mk=mkOf(OV.from);
    const bmk=OV.cmp==='yoy'?`${+mk.slice(0,4)-1}-${mk.slice(5)}`:prevMonthKey(mk);
    bFrom=isoOf(bmk,1);
    bTo=isoOf(bmk,Math.min(fm?mkDays(bmk):GLOBAL_LAST,mkDays(bmk)));
  }else if(OV.cmp==='yoy'){bFrom=yoyIso(OV.from);bTo=yoyIso(OV.to);}
  else{bTo=isoShift(OV.from,-1);bFrom=isoShift(bTo,-(len-1));}
  const cmp=(inData(bFrom)||inData(bTo))?[bFrom,bTo]:null;
  const curLabel=fm?mkLabel(fm):isMTD()?mkLabel(LATEST)+' (MTD)':`${isoLabelY(OV.from)} - ${isoLabelY(OV.to)}`;
  const cmpLabel=cmp?((fm||isMTD())?mkLabelS(mkOf(bFrom)):`${isoLabel(bFrom)} - ${isoLabelY(bTo)}`):'–';
  return {cur,cmp,curLabel,cmpLabel,fm};
}
/* spend "semua ads" = sales + upper funnel; impresi & klik selalu termasuk upper funnel */
function ovStats(from,to,basis){
  const s=statsRange(SALES_IDS,from,to), u=statsRange(UPPER_IDS,from,to);
  const spend=basis==='all'? s.cost+u.cost : s.cost;
  const imp=s.imp+u.imp, clk=s.clk+u.clk;
  return {spend,spendSales:s.cost,spendUpper:u.cost,
    gmv:s.gmv,orders:s.orders,imp,clk,
    roas:div(s.gmv,spend),cpo:div(spend,s.orders),aov:s.aov,
    ctr:imp?100*clk/imp:null,ctor:clk?100*s.orders/clk:null};
}
let ovMomYear='2026';
function momSectionHtml(y){
  const M=MOM[y];
  const mi=Array.from({length:12},(_,i)=>i).filter(m=>M.gmv[m]!=null||M.cost[m]!=null);
  if(!mi.length)return '';
  const lastM=mi[mi.length-1],prevM=mi[mi.length-2]??lastM;
  const yTot={gmv:sum(M.gmv.filter(Boolean)),cost:sum(M.cost.filter(Boolean)),orders:sum(M.orders.filter(Boolean)),
    imp:sum(M.imp.filter(Boolean)),clk:sum(M.clk.filter(Boolean))};
  return `
  <h2 class="sec">${L('Tabel Month over Month','Month over Month Table')}
    <span class="seg" id="momSeg" style="margin-left:12px;vertical-align:middle">
      <button data-y="2026" class="${y==='2026'?'on':''}">2026</button>
      <button data-y="2025" class="${y==='2025'?'on':''}">2025</button>
    </span></h2>
  <div class="tbl-wrap"><table><thead><tr><th>${L('Metrik','Metric')}</th>${mi.map(m=>`<th>${MONTHS_S[m]}</th>`).join('')}<th>Total ${y}</th><th>Δ ${MONTHS_S[lastM]} vs ${MONTHS_S[prevM]}</th></tr></thead>
  <tbody>${[
    ['Total GMV From Ads',M.gmv,fmtRpC,true,'sum'],['Total All Ads Cost',M.cost,fmtRpC,false,'sum'],
    ['Total Orders From Ads',M.orders,fmtN,true,'sum'],['ROAS',M.roas,fmtX,true,'roas'],
    ['Cost Per Order',M.cpo,fmtRpC,false,'cpo'],['AOV',M.aov,fmtRpC,true,'aov'],
    ['CTR',M.ctr,fmtPct,true,'ctr'],['CTOR',M.ctor,fmtPct,true,'ctor'],
    ['Impressions',M.imp,fmtNC,true,'sum'],['Product Clicks',M.clk,fmtNC,true,'sum'],
    ['Ads Efficiency Rate',M.eff,fmtPct,false,null],
    ['Total GMV All Marketplace',M.gmvAllMp.map((v,m)=>{
      const o=gmvMpOv[`${y}-${String(m+1).padStart(2,'0')}`];
      const s=o?(o.tiktok||0)+(o.shopee||0)+(o.lazada||0):0;
      return s||v; }),fmtRpC,true,'sum'],
  ].map(([lbl,arr,f,goodUp,totKind])=>{
    const d=(arr[lastM]!=null&&arr[lastM]!==0&&arr[prevM])?100*(arr[lastM]-arr[prevM])/Math.abs(arr[prevM]):null;
    const good=d!=null&&((d>=0)===goodUp);
    let tot=null;
    if(totKind==='sum')tot=sum(arr.filter(v=>v!=null));
    else if(totKind==='roas')tot=div(yTot.gmv,yTot.cost);
    else if(totKind==='cpo')tot=div(yTot.cost,yTot.orders);
    else if(totKind==='aov')tot=div(yTot.gmv,yTot.orders);
    else if(totKind==='ctr')tot=yTot.imp?100*yTot.clk/yTot.imp:null;
    else if(totKind==='ctor')tot=yTot.clk?100*yTot.orders/yTot.clk:null;
    return `<tr><td>${lbl}</td>${mi.map(m=>`<td class="num">${arr[m]==null?'–':f(arr[m])}</td>`).join('')}
      <td class="num" style="font-weight:700">${tot==null?'–':f(tot)}</td>
      <td class="num">${d==null?'–':`<b style="color:${good?'var(--good-ink)':'var(--critical)'}">${d>=0?'▲':'▼'} ${nf1.format(Math.abs(d))}%</b>`}</td></tr>`;
  }).join('')}</tbody></table></div>
  ${y==='2026'?`<p class="note">${mkLabel(LATEST)+L(' masih berjalan (MTD hingga hari ke-'+GLOBAL_LAST+').',' is still in progress (MTD through day '+GLOBAL_LAST+').')}</p>`:''}`;
}
function momStatsFor(mk,basis){
  const y=mk.slice(0,4), m=+mk.slice(5,7)-1, M=MOM[y];
  if(!M||M.gmv[m]==null||M.cost[m]==null)return null;
  const salesC=M.salesCost[m]??M.cost[m];
  const spend=basis==='sales'? salesC : M.cost[m];
  return {spend,spendSales:salesC,spendUpper:Math.max(0,(M.cost[m]||0)-(salesC||0)),
    gmv:M.gmv[m],orders:M.orders[m],imp:M.imp[m],clk:M.clk[m],
    roas:div(M.gmv[m],spend),cpo:div(spend,M.orders[m]),aov:M.aov[m],
    ctr:M.ctr[m],ctor:M.ctor[m],fromMoM:true};
}
/* panel pengisi ruang kanan pada tampilan tahunan */
function yearSideHtml(y){
  const M=MOM[y];
  const mi=Array.from({length:12},(_,i)=>i).filter(m=>M.gmv[m]!=null&&M.gmv[m]!==0);
  if(!mi.length)return '<div class="card"><div class="empty">'+L('Belum ada data tahun ini.','No data for this year yet.')+'</div></div>';
  const tG=sum(mi.map(m=>M.gmv[m]||0)),tC=sum(mi.map(m=>M.cost[m]||0)),tO=sum(mi.map(m=>M.orders[m]||0));
  const best=mi.reduce((a,b)=>(M.gmv[b]||0)>(M.gmv[a]||0)?b:a,mi[0]);
  const bestR=mi.filter(m=>M.roas[m]!=null).reduce((a,b)=>(M.roas[b]||0)>(M.roas[a]||0)?b:a,mi[0]);
  const worstR=mi.filter(m=>M.roas[m]!=null).reduce((a,b)=>(M.roas[b]||99)<(M.roas[a]||99)?b:a,mi[0]);
  const q=i=>{const ms=mi.filter(m=>Math.floor(m/3)===i);return ms.length?{g:sum(ms.map(m=>M.gmv[m]||0)),c:sum(ms.map(m=>M.cost[m]||0))}:null;};
  const gm=platMonthly(y,'gmv');
  const shares=Object.keys(PLATFORMS).map(p=>({p,v:sum((gm[p]||[]).filter(Boolean))})).filter(x=>x.v>0).sort((a,b)=>b.v-a.v);
  const shTot=sum(shares.map(s=>s.v))||1;
  return `
  <div class="card navy" style="margin-bottom:12px">
    <div class="lbl" style="font-size:11.5px;font-weight:700;letter-spacing:.05em">${L('SOROTAN TAHUN ','YEAR HIGHLIGHTS ')+y}</div>
    <div class="val" style="font-size:26px;font-weight:800;margin:4px 0 2px">${fmtRpC(tG)}</div>
    <div class="delta" style="font-size:12px">${L('GMV dari iklan · ','GMV from ads · ')}${fmtN(tO)} ${L('pesanan','orders')} · ROAS ${fmtX(div(tG,tC))}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px;font-size:12px">
      <div><div style="opacity:.7">${L('Bulan terbaik','Best month')}</div><b>${MONTHS[best]}</b> · ${fmtRpC(M.gmv[best])}</div>
      <div><div style="opacity:.7">${L('ROAS tertinggi','Highest ROAS')}</div><b>${MONTHS[bestR]}</b> · ${fmtX(M.roas[bestR])}</div>
      <div><div style="opacity:.7">${L('Biaya iklan setahun','Full year ad spend')}</div><b>${fmtRpC(tC)}</b></div>
      <div><div style="opacity:.7">${L('ROAS terendah','Lowest ROAS')}</div><b>${MONTHS[worstR]}</b> · ${fmtX(M.roas[worstR])}</div>
    </div>
  </div>
  <div class="card" style="margin-bottom:12px"><h3>${L('GMV per Kuartal','GMV per Quarter')}</h3>
    ${[0,1,2,3].map(i=>{const d=q(i);if(!d)return '';
      const w=Math.max(2,100*d.g/(Math.max(...[0,1,2,3].map(j=>q(j)?.g||0))||1));
      return `<div style="display:flex;align-items:center;gap:10px;margin:7px 0">
        <span style="width:30px;font-size:12px;font-weight:700;color:var(--ink-2)">Q${i+1}</span>
        <div style="flex:1"><div style="background:var(--brand-2);height:14px;border-radius:0 4px 4px 0;width:${w}%"></div></div>
        <span style="width:80px;text-align:right;font-size:12px;font-weight:650">${fmtRpC(d.g)}</span>
        <span style="width:64px;text-align:right;font-size:11px;color:var(--muted)">${d.c?fmtX(d.g/d.c):'–'}</span>
      </div>`;}).join('')}
    <p class="note" style="margin-top:6px">${L('Angka kanan: ROAS kuartal.','Right figure: quarterly ROAS.')}</p></div>
  <div class="card"><h3>${L('Kontribusi Platform (GMV)','Platform Contribution (GMV)')}</h3>
    ${shares.map(s=>`<div style="display:flex;align-items:center;gap:10px;margin:7px 0">
      <span style="width:64px;font-size:12px;font-weight:650">${PLATFORMS[s.p].name}</span>
      <div style="flex:1"><div style="background:${pcolor(s.p)};height:14px;border-radius:0 4px 4px 0;width:${Math.max(2,100*s.v/(shares[0].v||1))}%"></div></div>
      <span style="width:52px;text-align:right;font-size:12px;font-weight:650">${nf1.format(100*s.v/shTot)}%</span>
    </div>`).join('')}</div>`;
}
function renderOverview(){
  const {cur,cmp,curLabel,cmpLabel,fm}=ovRanges();
  let st=ovStats(cur[0],cur[1],OV.basis);
  let pv=cmp?ovStats(cmp[0],cmp[1],OV.basis):{};
  let momNote='';
  if(OV.mode==='range'&&fm&&fm!==LATEST){
    const ms=momStatsFor(fm,OV.basis);
    if(ms){st=ms;momNote=L(' · angka resmi tabel MoM',' · official MoM table figures');}
  }
  if(cmp){
    const cmpFm=fullMonthOf(cmp[0],cmp[1]);
    if(cmpFm&&cmpFm!==LATEST){const pm=momStatsFor(cmpFm,OV.basis);if(pm)pv=pm;}
  }
  const sevCount={critical:0,serious:0,warning:0,info:0};
  ALERTS.alerts.forEach(a=>sevCount[a.sev]++);
  const isYear=OV.mode==='year';
  view.innerHTML=`
  <h2 class="sec">${L('Ringkasan Semua Platform','All Platform Summary')}</h2>
  <div class="controls">
    <div class="seg" id="ovSeg">
      <button data-m="range" class="${!isYear?'on':''}">${L('Periode','Period')}</button>
      <button data-m="year" class="${isYear?'on':''}">${L('Tahunan','Yearly')}</button>
    </div>
    ${!isYear?`
      <span id="ovPicker"></span>
      <label>${L('Banding','Compare')}:</label>
      <div class="seg" id="ovCmpSeg">
        <button data-c="prev" class="${OV.cmp==='prev'?'on':''}">${L('Periode sebelumnya','Previous period')}</button>
        <button data-c="yoy" class="${OV.cmp==='yoy'?'on':''}">${L('Tahun lalu','Last year')}</button>
      </div>
    `:`
      <select id="ovYear"><option value="2026" ${OV.year==='2026'?'selected':''}>2026 (YTD)</option><option value="2025" ${OV.year==='2025'?'selected':''}>2025</option></select>
    `}
    <span style="flex:1"></span>
    <label>Spend:</label>
    <div class="seg" id="ovBasis">
      <button data-b="all" class="${OV.basis==='all'?'on':''}">${L('Semua Iklan','All Ads')}</button>
      <button data-b="sales" class="${OV.basis==='sales'?'on':''}">${L('Iklan Penjualan','Sales Ads')}</button>
    </div>
  </div>
  <div class="grid g-kpi">
    ${kpiTile(OV.basis==='all'?L('Total Spend (Semua Iklan)','Total Spend (All Ads)'):L('Total Spend (Iklan Penjualan)','Total Spend (Sales Ads)'),fmtRpC(st.spend),
      deltaVs(st.spend,pv.spend,false,cmpLabel)+
      (OV.basis==='all'&&st.spendUpper?`<span class="delta" style="display:block">${L('penjualan','sales')} ${fmtRpC(st.spendSales)} · branding ${fmtRpC(st.spendUpper)}</span>`:''))}
    ${kpiTile(L('GMV dari Iklan','GMV from Ads'),fmtRpC(st.gmv),deltaVs(st.gmv,pv.gmv,true,cmpLabel))}
    ${kpiTile('ROAS',fmtX(st.roas),deltaVs(st.roas,pv.roas,true,cmpLabel))}
    ${kpiTile(L('Pesanan dari Iklan','Orders from Ads'),fmtN(st.orders),deltaVs(st.orders,pv.orders,true,cmpLabel))}
    ${kpiTile(L('Impresi','Impressions'),fmtNC(st.imp),deltaVs(st.imp,pv.imp,true,cmpLabel))}
    ${kpiTile(L('Klik Produk','Product Clicks'),fmtNC(st.clk),deltaVs(st.clk,pv.clk,true,cmpLabel))}
    ${kpiTile('CTR',fmtPct(st.ctr),deltaVs(st.ctr,pv.ctr,true,cmpLabel))}
    ${kpiTile('CTOR',fmtPct(st.ctor),deltaVs(st.ctor,pv.ctor,true,cmpLabel))}
    ${kpiTile(L('Biaya per Pesanan','Cost per Order'),fmtRpC(st.cpo),deltaVs(st.cpo,pv.cpo,false,cmpLabel))}
    ${kpiTile('AOV',fmtRpC(st.aov),deltaVs(st.aov,pv.aov,true,cmpLabel))}
  </div>
  ${ALERTS.alerts.length?`<div class="card" style="margin-top:12px;display:flex;gap:14px;flex-wrap:wrap;align-items:center">
    <b style="font-size:13px">${L('Pemeriksaan kesehatan','Health check')} (${mkLabelS(LATEST)}):</b>
    ${sevCount.critical?`<span class="pill-stat bad">⛔ ${sevCount.critical} ${L('kritis','critical')}</span>`:''}
    ${sevCount.serious?`<span class="pill-stat bad">🔻 ${sevCount.serious} ${L('serius','serious')}</span>`:''}
    ${sevCount.warning?`<span class="pill-stat mid">⚠️ ${sevCount.warning} ${L('perhatian','attention')}</span>`:''}
    ${ALERTS.opps.length?`<span class="pill-stat ok">🚀 ${ALERTS.opps.length} ${L('peluang','opportunities')}</span>`:''}
    <a href="#/analisis" style="margin-left:auto;font-size:12.5px;font-weight:650">${L('Analisis dan rencana tindakan →','Analysis and action plan →')}</a>
  </div>`:''}
  ${isYear?`
  <div class="grid" style="grid-template-columns:1.6fr 1fr;margin-top:12px" id="yearGrid">
    <div>
      <div class="card" style="margin-bottom:12px"><h3>${L('GMV per Bulan per Platform','Monthly GMV per Platform')}</h3><div id="ovGmv"></div></div>
      <div class="card"><h3>${L('Spend per Bulan per Platform','Monthly Spend per Platform')}</h3><div id="ovCost"></div></div>
    </div>
    <div>${yearSideHtml(OV.year)}</div>
  </div>
  <style>@media(max-width:960px){#yearGrid{grid-template-columns:1fr}}</style>
  `:`
  <div class="card" style="margin-top:12px"><h3>${L('Tren Metrik Harian (channel penjualan)','Daily Metric Trend (sales channels)')}</h3><div id="ovTrend"></div></div>
  <div class="grid g-2" style="margin-top:12px">
    <div class="card"><h3>${L('GMV Harian per Platform','Daily GMV per Platform')}</h3><div id="ovGmv"></div></div>
    <div class="card"><h3>${L('Spend Harian per Platform','Daily Spend per Platform')}</h3><div id="ovCost"></div></div>
  </div>`}
  <div class="grid g-2" style="margin-top:12px">
    <div class="card"><h3>${L('Kontribusi GMV per Platform','GMV Contribution per Platform')}</h3><div id="ovShare"></div></div>
    <div class="card"><h3>${L('Channel Teratas berdasarkan GMV','Top Channels by GMV')}</h3><div id="ovTop"></div></div>
  </div>
  <h2 class="sec">${L('Ringkasan per Platform','Summary per Platform')}</h2>
  <div class="tbl-wrap"><table><thead><tr>
    <th>Platform</th><th>Spend</th><th>GMV</th><th>ROAS</th><th>${L('Pesanan','Orders')}</th><th>${L('Impresi','Impressions')}</th><th>${L('Klik','Clicks')}</th><th>CTR</th><th>CTOR</th><th>CPO</th><th>AOV</th>
  </tr></thead><tbody>${Object.keys(PLATFORMS).map(p=>{
    const s=statsRange(platIds(p),cur[0],cur[1]);
    const u=statsRange(platUpperIds(p),cur[0],cur[1]);
    const spend=OV.basis==='all'? s.cost+u.cost : s.cost;
    const imp=s.imp+u.imp, clk=s.clk+u.clk;
    if(!spend&&!s.gmv)return '';
    return `<tr class="click" data-nav="#/platform"><td>${platChip(p)}</td><td class="num">${fmtRpC(spend)}</td><td class="num">${fmtRpC(s.gmv)}</td>
      <td class="num">${s.gmv?fmtX(div(s.gmv,spend)):'–'}</td><td class="num">${fmtN(s.orders)}</td>
      <td class="num">${imp?fmtNC(imp):'–'}</td><td class="num">${clk?fmtNC(clk):'–'}</td>
      <td class="num">${imp?fmtPct(100*clk/imp):'–'}</td><td class="num">${clk?fmtPct(100*s.orders/clk):'–'}</td>
      <td class="num">${s.orders?fmtRpC(spend/s.orders):'–'}</td><td class="num">${s.aov?fmtRpC(s.aov):'–'}</td></tr>`;}).join('')}
    <tr class="tot"><td>Total</td><td class="num">${fmtRpC(st.spend)}</td><td class="num">${fmtRpC(st.gmv)}</td>
      <td class="num">${fmtX(st.roas)}</td><td class="num">${fmtN(st.orders)}</td>
      <td class="num">${fmtNC(st.imp)}</td><td class="num">${fmtNC(st.clk)}</td>
      <td class="num">${fmtPct(st.ctr)}</td><td class="num">${fmtPct(st.ctor)}</td>
      <td class="num">${fmtRpC(st.cpo)}</td><td class="num">${fmtRpC(st.aov)}</td></tr>
  </tbody></table></div>
  ${momSectionHtml(ovMomYear)}`;
  document.querySelectorAll('#ovSeg button').forEach(b=>b.onclick=()=>{OV.mode=b.dataset.m;renderOverview();});
  document.querySelectorAll('#ovBasis button').forEach(b=>b.onclick=()=>{OV.basis=b.dataset.b;renderOverview();});
  document.querySelectorAll('#momSeg button').forEach(b=>b.onclick=()=>{ovMomYear=b.dataset.y;renderOverview();});
  if(!isYear){
    rangePicker(document.getElementById('ovPicker'),{from:OV.from,to:OV.to,preset:OV.preset,
      onApply:(f,t,p)=>{OV.from=f;OV.to=t;OV.preset=p;renderOverview();}});
    document.querySelectorAll('#ovCmpSeg button').forEach(b=>b.onclick=()=>{OV.cmp=b.dataset.c;renderOverview();});
  }else{
    document.getElementById('ovYear').onchange=e=>{OV.year=e.target.value;renderOverview();};
  }
  if(isYear){
    const y=OV.year;
    const mi=Array.from({length:12},(_,i)=>i).filter(m=>RAW.months[`${y}-${String(m+1).padStart(2,'0')}`]);
    const gm=platMonthly(y,'gmv'), cs=platMonthly(y,'cost');
    stackBars(document.getElementById('ovGmv'),Object.keys(PLATFORMS).map(p=>({name:PLATFORMS[p].name,color:pcolor(p),values:gm[p]})),mi,{fmt:fmtRpC});
    stackBars(document.getElementById('ovCost'),Object.keys(PLATFORMS).map(p=>({name:PLATFORMS[p].name,color:pcolor(p),values:cs[p]})),mi,{fmt:fmtRpC});
  }else{
    const seq=isoSeq(cur[0],cur[1]);
    const lbl=seq.map(isoLabel);
    metricChart(document.getElementById('ovTrend'),{id:'ov',seriesData:seriesDataFor(SALES_IDS,cur[0],cur[1]),
      labels:lbl,defaults:['gmv','cost'],tipTitle:i=>isoLabelY(seq[i])});
    const mkSeries=metric=>Object.keys(PLATFORMS).map(p=>({name:PLATFORMS[p].name,color:pcolor(p),values:seriesRange(platIds(p),metric,cur[0],cur[1])}))
      .filter(s=>sum(s.values)>0);
    lineChart(document.getElementById('ovGmv'),mkSeries('gmv'),lbl,{fmt:fmtRpC,tipTitle:i=>isoLabelY(seq[i])});
    lineChart(document.getElementById('ovCost'),mkSeries('cost'),lbl,{fmt:fmtRpC,tipTitle:i=>isoLabelY(seq[i])});
  }
  hBars(document.getElementById('ovShare'),Object.keys(PLATFORMS).map(p=>{
    const v=sum(seriesRange(platIds(p),'gmv',cur[0],cur[1]));
    return {name:PLATFORMS[p].name,color:pcolor(p),value:v,extra:st.gmv?nf1.format(100*v/st.gmv)+'%':''};
  }).filter(i=>i.value>0).sort((a,b)=>b.value-a.value));
  hBars(document.getElementById('ovTop'),SALES_DEF.map(c=>{
    const s=statsRange([c.id],cur[0],cur[1]);
    return {name:chName(c.id),color:pcolor(c.platform),value:s.gmv,extra:s.roas?fmtX(s.roas):''};
  }).filter(i=>i.value>0).sort((a,b)=>b.value-a.value).slice(0,8));
}

/* =================== HARIAN =================== */
let dailySel='all', dailyMode='channel', dailyDate=null;
let DH={from:isoOf(LATEST,1),to:LATEST_LAST_ISO(),preset:'thisMonth'};
const METRIC_DEFS=()=>[
  ['cost',L('Biaya Iklan','Ads Cost'),fmtRp],['gmv',L('GMV (Nilai Pembelian)','GMV (Purchase Value)'),fmtRp],['orders',L('Pesanan dari Iklan','Orders from Ads'),fmtN],
  ['impressions',L('Impresi','Impressions'),fmtN],['clicks',L('Klik Produk','Product Clicks'),fmtN],
  ['liveViews',L('Penayangan Live','Live Views'),fmtN],['reach',L('Jangkauan','Reach'),fmtN],['follows',L('Pengikut Berbayar','Paid Follows'),fmtN],
  ['consideration','Consideration Size',fmtN],['atc',L('Tambah ke Keranjang','Add to Cart'),fmtN],['atcValue',L('Nilai Keranjang','ATC Value'),fmtRp],
];
function renderDaily(){
  view.innerHTML=`
  <h2 class="sec">${L('Database Harian','Daily Database')}</h2>
  <div class="controls">
    <div class="seg" id="dailySeg">
      <button data-m="channel" class="${dailyMode==='channel'?'on':''}">${L('Per Channel','By Channel')}</button>
      <button data-m="date" class="${dailyMode==='date'?'on':''}">${L('Per Tanggal','By Date')}</button>
    </div>
    <span style="flex:1"></span>
    <button class="btn ghost cta" id="goCmp">⇄ ${L('Bandingkan','Compare')}</button>
  </div>
  <div id="dailyBody"></div>`;
  document.querySelectorAll('#dailySeg button').forEach(b=>b.onclick=()=>{dailyMode=b.dataset.m;renderDaily();});
  document.getElementById('goCmp').onclick=()=>{cmp.subj=dailySel;location.hash='#/bandingkan';};
  if(dailyMode==='channel')renderDailyChannel(document.getElementById('dailyBody'));
  else renderDailyDate(document.getElementById('dailyBody'));
}
function renderDailyChannel(root){
  const S=subjectOf(dailySel);
  const from=DH.from, toFull=DH.to;
  const to=isoDiff(from,toFull)+1>MAX_COLS?isoShift(from,MAX_COLS-1):toFull;
  const clipped=to!==toFull;
  const color=S.platform?pcolor(S.platform):'var(--tiktok)';
  const seq=isoSeq(from,toFull);
  const st=statsRange(S.ids,from,toFull);
  const cost=seriesRange(S.ids,'cost',from,toFull), gmv=seriesRange(S.ids,'gmv',from,toFull);
  const oneMonth=mkOf(from)===mkOf(toFull)?mkOf(from):null;
  root.innerHTML=`
  <div class="controls" style="margin-top:0">
    <label>Channel:</label><select id="dailySelEl">${dailyOptions()}</select>
    <span id="dhPicker"></span>
    ${S.ch&&oneMonth?`<span style="font-size:12px;color:var(--muted)">${L('Anggaran','Budget')} ${fmtRpC(((budgetOv[oneMonth]||{})[S.ch.id])??(((RAW.months[oneMonth]||{}).budgets||{})[S.ch.id]||null))}</span>`:''}
  </div>
  ${clipped?`<p class="note">${L('Tabel dipotong ke '+MAX_COLS+' hari pertama agar tetap ringan; grafik dan total tetap mencakup rentang penuh.','The table is clipped to the first '+MAX_COLS+' days to stay light; the chart and totals still cover the full range.')}</p>`:''}
  <div class="grid g-kpi k6">
    ${kpiTile('Spend',fmtRpC(st.cost),'',spark(cost,color))}
    ${S.sales?kpiTile('GMV',fmtRpC(st.gmv),'',spark(gmv,'var(--good)')):kpiTile(L('Impresi','Impressions'),fmtNC(st.imp||null))}
    ${S.sales?kpiTile('ROAS',fmtX(st.roas)):kpiTile(L('Klik Produk','Product Clicks'),fmtNC(st.clk||null))}
    ${S.sales?kpiTile(L('Pesanan','Orders'),fmtN(st.orders)):kpiTile(L('Jangkauan','Reach'),fmtNC(sum(seriesRange(S.ids,'reach',from,toFull))||null))}
    ${S.sales?kpiTile('CPO',fmtRpC(st.cpo)):kpiTile('CPM',st.imp?fmtRpC(1000*st.cost/st.imp):'–')}
    ${S.sales?kpiTile('AOV',fmtRpC(st.aov)):kpiTile(L('Pengikut Berbayar','Paid Followers'),fmtN(sum(seriesRange(S.ids,'follows',from,toFull))||null))}
  </div>
  <div class="card" style="margin-top:12px"><h3>${L('Tren Harian','Daily Trend')} · ${esc(S.name)}</h3><div id="dTrend"></div></div>
  <h2 class="sec">${L('Tabel Harian','Daily Table')} · ${esc(S.name)}</h2>
  <div class="tbl-wrap" style="max-height:520px;overflow:auto"><table id="dailyTbl"></table></div>
  <p class="note">${L('Klik kepala kolom tanggal untuk membuka tampilan Per Tanggal. Kolom Total adalah penjumlahan rentang; metrik ƒ dihitung dari total.','Click a date column header to open the By Date view. The Total column sums the range; ƒ metrics are computed from totals.')}</p>`;
  const sel=root.querySelector('#dailySelEl');sel.value=dailySel;
  sel.onchange=e=>{dailySel=e.target.value;renderDaily();};
  rangePicker(root.querySelector('#dhPicker'),{from:DH.from,to:DH.to,preset:DH.preset,
    onApply:(f,t,p)=>{DH.from=f;DH.to=t;DH.preset=p;renderDaily();}});
  const lbl=seq.map(isoLabel);
  metricChart(root.querySelector('#dTrend'),{id:'dh',seriesData:seriesDataFor(S.ids,from,toFull),
    labels:lbl,defaults:S.sales?['gmv','cost']:['cost'],tipTitle:i=>isoLabelY(seq[i])});
  const showSeq=isoSeq(from,to);
  const metricKeys=new Set();
  for(const mk2 of new Set(showSeq.map(mkOf))){const ms=monthSeries(mk2);for(const cid of S.ids){for(const k in (ms[cid]||{}))metricKeys.add(k);}}
  const rows=[];
  for(const [key,label,f] of METRIC_DEFS()){
    if(!metricKeys.has(key))continue;
    const vals=seriesRange(S.ids,key,from,to);
    if(!vals.some(v=>v))continue;
    rows.push({label,vals,f,tot:sum(vals)});
  }
  const der=[];
  if(S.sales){
    const c=seriesRange(S.ids,'cost',from,to),g=seriesRange(S.ids,'gmv',from,to),
          o=seriesRange(S.ids,'orders',from,to),im=seriesRange(S.ids,'impressions',from,to),cl=seriesRange(S.ids,'clicks',from,to);
    const mk2=(label,fn,f,totFn)=>der.push({label,vals:showSeq.map((_,i)=>fn(i)),f,tot:totFn(),derived:true});
    if(sum(g)>0)mk2('ROAS',i=>c[i]?(g[i]||0)/c[i]:null,fmtX,()=>div(sum(g),sum(c)));
    if(sum(cl)>0&&sum(im)>0)mk2('CTR',i=>im[i]?100*(cl[i]||0)/im[i]:null,fmtPct,()=>100*sum(cl)/sum(im));
    if(sum(o)>0&&sum(cl)>0)mk2('CTOR',i=>cl[i]?100*(o[i]||0)/cl[i]:null,fmtPct,()=>100*sum(o)/sum(cl));
    if(sum(o)>0)mk2(L('Biaya per Pesanan','Cost per Order'),i=>o[i]?(c[i]||0)/o[i]:null,fmtRpC,()=>div(sum(c),sum(o)));
    if(sum(o)>0&&sum(g)>0)mk2('AOV',i=>o[i]?(g[i]||0)/o[i]:null,fmtRpC,()=>div(sum(g),sum(o)));
  }
  const tbl=root.querySelector('#dailyTbl');
  tbl.innerHTML=`<thead><tr><th>${L('Metrik','Metric')}</th>${showSeq.map(iso=>`<th class="dayh" data-iso="${iso}" style="cursor:pointer" title="${L('Lihat semua channel tanggal ini','View all channels on this date')}">${isoLabel(iso)}</th>`).join('')}<th>Total</th></tr></thead>
  <tbody>${[...rows,...der].map(r=>`<tr${r.derived?' style="color:var(--ink-2)"':''}><td>${esc(r.label)}${r.derived?' <span style="font-size:10px;color:var(--muted)">ƒ</span>':''}</td>
    ${r.vals.slice(0,showSeq.length).map(v=>`<td class="num">${v==null?'·':r.f(v)}</td>`).join('')}
    <td class="num" style="font-weight:700">${r.tot==null?'–':r.f(r.tot)}</td></tr>`).join('')}</tbody>`;
  tbl.querySelectorAll('th.dayh').forEach(th=>th.onclick=()=>{dailyDate=th.dataset.iso;dailyMode='date';renderDaily();});
}
function renderDailyDate(root){
  const iso=dailyDate&&inData(dailyDate)?dailyDate:LATEST_LAST_ISO();
  dailyDate=iso;
  const mk=mkOf(iso),di=dayOf(iso)-1;
  const ms=monthSeries(mk);
  const rows=[];
  let tc=0,tg=0,tor=0;
  for(const p in PLATFORMS){
    const chans=CH_DEF.filter(c=>c.platform===p&&!HIDDEN_CH.has(c.id));
    const withData=chans.filter(c=>{const d=ms[c.id]||{};return ((d.cost||[])[di]||0)>0||((d.gmv||[])[di]||0)>0||((d.orders||[])[di]||0)>0;});
    if(!withData.length)continue;
    let pc=0,pg=0,po=0,pi=0,pk=0;
    const chRows=withData.map(c=>{
      const d=ms[c.id]||{};
      const cost=(d.cost||[])[di]||0,gmv=(d.gmv||[])[di]||0,ord=(d.orders||[])[di]||0,
            im=(d.impressions||[])[di]||0,cl=(d.clicks||[])[di]||0;
      pc+=cost;pg+=gmv;po+=ord;pi+=im;pk+=cl;
      return `<tr class="click" data-ch="${c.id}"><td style="padding-left:26px">${esc(chName(c.id))}</td>
        <td class="num">${fmtRp(cost)}</td><td class="num">${gmv?fmtRp(gmv):'–'}</td>
        <td class="num">${cost&&gmv?fmtX(gmv/cost):'–'}</td><td class="num">${fmtN(ord)}</td>
        <td class="num">${im?fmtNC(im):'–'}</td><td class="num">${cl?fmtNC(cl):'–'}</td>
        <td class="num">${im&&cl?fmtPct(100*cl/im):'–'}</td><td class="num">${cl&&ord?fmtPct(100*ord/cl):'–'}</td>
        <td class="num">${ord?fmtRpC(cost/ord):'–'}</td><td class="num">${ord&&gmv?fmtRpC(gmv/ord):'–'}</td></tr>`;
    }).join('');
    tc+=pc;tg+=pg;tor+=po;
    rows.push(`<tr style="background:var(--surface-2)"><td>${platChip(p)}</td>
      <td class="num" style="font-weight:700">${fmtRp(pc)}</td><td class="num" style="font-weight:700">${pg?fmtRp(pg):'–'}</td>
      <td class="num" style="font-weight:700">${pc&&pg?fmtX(pg/pc):'–'}</td><td class="num" style="font-weight:700">${fmtN(po)}</td>
      <td class="num">${pi?fmtNC(pi):'–'}</td><td class="num">${pk?fmtNC(pk):'–'}</td>
      <td class="num">${pi&&pk?fmtPct(100*pk/pi):'–'}</td><td class="num">${pk&&po?fmtPct(100*po/pk):'–'}</td>
      <td class="num">${po?fmtRpC(pc/po):'–'}</td><td class="num">${po&&pg?fmtRpC(pg/po):'–'}</td></tr>`+chRows);
  }
  root.innerHTML=`
  <div class="controls" style="margin-top:0">
    <label>${L('Tanggal','Date')}:</label>
    <input type="date" id="dateSel" value="${iso}" min="${FIRST_ISO}" max="${isoOf(LATEST,mkDays(LATEST))}">
    <button class="btn ghost" id="dPrev">‹</button><button class="btn ghost" id="dNext">›</button>
    <span style="font-size:12px;color:var(--muted)">${L('Semua channel yang tercatat pada ','All channels recorded on ')}${isoLabelY(iso)}</span>
  </div>
  <div class="grid g-kpi k6">
    ${kpiTile('Spend',fmtRpC(tc))}${kpiTile('GMV',fmtRpC(tg))}
    ${kpiTile('ROAS',tc?fmtX(tg/tc):'–')}${kpiTile(L('Pesanan','Orders'),fmtN(tor))}
    ${kpiTile('CPO',tor?fmtRpC(tc/tor):'–')}${kpiTile('AOV',tor?fmtRpC(tg/tor):'–')}
  </div>
  <div style="margin-top:12px" class="tbl-wrap"><table><thead><tr>
    <th>Platform / Channel</th><th>Spend</th><th>GMV</th><th>ROAS</th><th>${L('Pesanan','Orders')}</th>
    <th>${L('Impresi','Impressions')}</th><th>${L('Klik','Clicks')}</th><th>CTR</th><th>CTOR</th><th>CPO</th><th>AOV</th>
  </tr></thead><tbody>${rows.join('')||`<tr><td colspan="11" class="empty">${L('Tidak ada data pada tanggal ini','No data on this date')}</td></tr>`}
  <tr class="tot"><td>${L('Total Semua Platform','Total All Platforms')}</td><td class="num">${fmtRp(tc)}</td><td class="num">${fmtRp(tg)}</td>
    <td class="num">${tc?fmtX(tg/tc):'–'}</td><td class="num">${fmtN(tor)}</td><td></td><td></td><td></td><td></td>
    <td class="num">${tor?fmtRpC(tc/tor):'–'}</td><td class="num">${tor?fmtRpC(tg/tor):'–'}</td></tr></tbody></table></div>
  <p class="note">${L('Klik baris channel untuk membuka detail harian channel tersebut.','Click a channel row to open that channel\'s daily detail.')}</p>`;
  root.querySelector('#dateSel').onchange=e=>{if(inData(e.target.value)){dailyDate=e.target.value;renderDaily();}};
  root.querySelector('#dPrev').onclick=()=>{dailyDate=clampIso(isoShift(iso,-1));renderDaily();};
  root.querySelector('#dNext').onclick=()=>{dailyDate=clampIso(isoShift(iso,1));renderDaily();};
  root.querySelectorAll('tr[data-ch]').forEach(tr=>tr.onclick=()=>{dailySel=tr.dataset.ch;dailyMode='channel';renderDaily();});
}

/* =================== BANDINGKAN (rute tersembunyi) =================== */
let cmp={mode:'periode',subj:'all',subj2:'agg:shopee',
  a1:isoShift(LATEST_LAST_ISO(),-6),a2:LATEST_LAST_ISO(),
  b1:isoShift(LATEST_LAST_ISO(),-13),b2:isoShift(LATEST_LAST_ISO(),-7)};
function renderCompare(){
  const isPeriode=cmp.mode==='periode';
  const dmin=FIRST_ISO,dmax=isoOf(LATEST,mkDays(LATEST));
  view.innerHTML=`
  <h2 class="sec">${L('Bandingkan','Compare')}</h2>
  <div class="controls">
    <div class="seg" id="cmpSeg">
      <button data-m="periode" class="${isPeriode?'on':''}">${L('Periode vs Periode','Period vs Period')}</button>
      <button data-m="channel" class="${!isPeriode?'on':''}">Channel vs Channel</button>
    </div>
  </div>
  <div class="card" style="margin-bottom:12px"><div class="controls" style="margin:0">
    ${isPeriode?`
      <label>Channel:</label><select id="cSubj">${dailyOptions()}</select>
      <label style="margin-left:8px">${L('Periode','Period')} A:</label>
      <input type="date" id="cA1" value="${cmp.a1}" min="${dmin}" max="${dmax}"> -
      <input type="date" id="cA2" value="${cmp.a2}" min="${dmin}" max="${dmax}">
      <label style="margin-left:8px">${L('Periode','Period')} B:</label>
      <input type="date" id="cB1" value="${cmp.b1}" min="${dmin}" max="${dmax}"> -
      <input type="date" id="cB2" value="${cmp.b2}" min="${dmin}" max="${dmax}">
    `:`
      <label>Channel A:</label><select id="cSubj">${dailyOptions()}</select>
      <label>Channel B:</label><select id="cSubj2">${dailyOptions()}</select>
      <label style="margin-left:8px">${L('Rentang','Range')}:</label>
      <input type="date" id="cA1" value="${cmp.a1}" min="${dmin}" max="${dmax}"> -
      <input type="date" id="cA2" value="${cmp.a2}" min="${dmin}" max="${dmax}">
    `}
    <button class="btn" id="cGo" style="margin-left:auto">${L('Bandingkan','Compare')}</button>
  </div></div>
  <div id="cmpOut"></div>`;
  document.querySelectorAll('#cmpSeg button').forEach(b=>b.onclick=()=>{cmp.mode=b.dataset.m;renderCompare();});
  const $=id=>document.getElementById(id);
  $('cSubj').value=cmp.subj;
  if(!isPeriode)$('cSubj2').value=cmp.subj2;
  $('cGo').onclick=()=>{
    cmp.subj=$('cSubj').value;
    if(!isPeriode)cmp.subj2=$('cSubj2').value;
    const a1=$('cA1').value,a2=$('cA2').value;
    if(inData(a1)&&inData(a2)&&a2>=a1){cmp.a1=a1;cmp.a2=a2;}
    if(isPeriode){const b1=$('cB1').value,b2=$('cB2').value;
      if(inData(b1)&&inData(b2)&&b2>=b1){cmp.b1=b1;cmp.b2=b2;}}
    drawCompare();
  };
  drawCompare();
  function drawCompare(){
    const out=document.getElementById('cmpOut');
    const SA=subjectOf(cmp.subj);
    const SB=isPeriode?SA:subjectOf(cmp.subj2);
    const rA=[cmp.a1,cmp.a2];
    const rB=isPeriode?[cmp.b1,cmp.b2]:[cmp.a1,cmp.a2];
    const stA=statsRange(SA.ids,rA[0],rA[1]);
    const stB=statsRange(SB.ids,rB[0],rB[1]);
    const nameA=isPeriode?`${isoLabel(rA[0])} - ${isoLabelY(rA[1])}`:SA.name;
    const nameB=isPeriode?`${isoLabel(rB[0])} - ${isoLabelY(rB[1])}`:SB.name;
    const metricRows=[
      ['Spend','cost',fmtRpC,false],['GMV','gmv',fmtRpC,true],[L('Pesanan','Orders'),'orders',fmtN,true],
      ['ROAS','roas',fmtX,true],[L('Impresi','Impressions'),'imp',fmtNC,true],[L('Klik Produk','Product Clicks'),'clk',fmtNC,true],
      ['CTR','ctr',fmtPct,true],['CTOR','ctor',fmtPct,true],[L('Biaya per Pesanan','Cost per Order'),'cpo',fmtRpC,false],['AOV','aov',fmtRpC,true],
    ];
    const trow=([lbl,k,f,goodUp])=>{
      const a=stA[k],b=stB[k];
      let dHtml='<span class="cmp-delta flat">–</span>';
      if(a!=null&&b!=null&&b!==0){
        const dd=100*(a-b)/Math.abs(b);
        const good=(dd>=0)===goodUp;
        dHtml=`<span class="cmp-delta ${Math.abs(dd)<0.05?'flat':good?'up':'dn'}">${dd>=0?'▲':'▼'} ${nf1.format(Math.abs(dd))}%</span>`;
      }
      return `<tr><td>${lbl}</td><td class="num">${a==null?'–':f(a)}</td><td class="num">${b==null?'–':f(b)}</td><td class="num">${dHtml}</td></tr>`;
    };
    out.innerHTML=`
    <div class="grid g-2">
      <div class="card"><h3>${L('Perbandingan Metrik','Metric Comparison')}</h3>
        <div class="tbl-wrap" style="border:0"><table><thead><tr><th>${L('Metrik','Metric')}</th><th>${esc(nameA)} (A)</th><th>${esc(nameB)} (B)</th><th>Δ A vs B</th></tr></thead>
        <tbody>${metricRows.map(trow).join('')}</tbody></table></div></div>
      <div class="card"><h3>${L('GMV Harian, A vs B','Daily GMV, A vs B')} ${isPeriode?``:''}</h3><div id="cChart"></div>
        <h3 style="margin-top:16px">${L('Spend Harian, A vs B','Daily Spend, A vs B')}</h3><div id="cChart2"></div></div>
    </div>`;
    const lenA=isoDiff(rA[0],rA[1])+1,lenB=isoDiff(rB[0],rB[1])+1,LN=Math.min(Math.max(lenA,lenB),366);
    const lab=Array.from({length:LN},(_,i)=>'H'+(i+1));
    const pad=a=>{const x=a.slice(0,LN);while(x.length<LN)x.push(null);return x;};
    const colA=SA.platform?pcolor(SA.platform):'var(--tiktok)';
    const colB=isPeriode?'var(--muted)':(SB.platform?pcolor(SB.platform):'var(--lazada)');
    lineChart(document.getElementById('cChart'),[
      {name:'A · '+nameA,color:colA,values:pad(seriesRange(SA.ids,'gmv',rA[0],rA[1]))},
      {name:'B · '+nameB,color:colB,values:pad(seriesRange(SB.ids,'gmv',rB[0],rB[1])),dash:isPeriode?'5 4':null},
    ],lab,{fmt:fmtRpC});
    lineChart(document.getElementById('cChart2'),[
      {name:'A · '+nameA,color:colA,values:pad(seriesRange(SA.ids,'cost',rA[0],rA[1]))},
      {name:'B · '+nameB,color:colB,values:pad(seriesRange(SB.ids,'cost',rB[0],rB[1])),dash:isPeriode?'5 4':null},
    ],lab,{fmt:fmtRpC});
  }
}
/* =================== PLATFORM =================== */
let showEmptyCh=false, platMonth=LATEST;
function renderPlatforms(){
  const mk=platMonth;
  const stats=CH_DEF.filter(c=>!HIDDEN_CH.has(c.id)).map(c=>chMonth(c.id,mk));
  const emptyCount=stats.filter(c=>c.last===0).length;
  view.innerHTML=`<h2 class="sec">${L('Breakdown per Platform','Breakdown per Platform')}</h2>
  <div class="controls">
    <span id="platPicker"></span>
    <label style="display:flex;align-items:center;gap:7px;cursor:pointer;margin-left:10px">
    <input type="checkbox" id="showEmpty" ${showEmptyCh?'checked':''}> ${L('Tampilkan channel tanpa data','Show channels without data')} (${emptyCount})</label></div>
  <div id="platWrap"></div>`;
  monthPicker(document.getElementById('platPicker'),{value:mk,onApply:v=>{platMonth=v;renderPlatforms();}});
  document.getElementById('showEmpty').onchange=e=>{showEmptyCh=e.target.checked;renderPlatforms();};
  const wrap=document.getElementById('platWrap');
  const DIMm=mkDays(mk);
  for(const p in PLATFORMS){
    let chans=stats.filter(c=>c.platform===p&&c.objective==='sales');
    let uppers=stats.filter(c=>c.platform===p&&c.objective==='upper');
    if(!showEmptyCh){chans=chans.filter(c=>c.last>0);uppers=uppers.filter(c=>c.last>0);}
    if(!chans.length&&!uppers.length)continue;
    const sales=stats.filter(c=>c.platform===p&&c.objective==='sales');
    const upAll=stats.filter(c=>c.platform===p&&c.objective==='upper');
    const cost=sum(sales.map(c=>c.tot.cost)),gmv=sum(sales.map(c=>c.tot.gmv)),ord=sum(sales.map(c=>c.tot.orders));
    const upCost=sum(upAll.map(c=>c.tot.cost));
    const sec=document.createElement('div');
    sec.innerHTML=`
    <div class="card" style="margin-bottom:14px">
      <div style="display:flex;flex-wrap:wrap;gap:18px;align-items:baseline;margin-bottom:10px">
        <span style="font-size:15px;font-weight:700">${platChip(p)}</span>
        <span style="font-size:12.5px;color:var(--ink-2)">${L('Spend Penjualan','Sales Spend')} <b>${fmtRpC(cost)}</b></span>
        ${upCost?`<span style="font-size:12.5px;color:var(--ink-2)">Spend Branding <b>${fmtRpC(upCost)}</b></span>`:''}
        <span style="font-size:12.5px;color:var(--ink-2)">GMV <b>${fmtRpC(gmv)}</b></span>
        <span style="font-size:12.5px;color:var(--ink-2)">ROAS <b>${gmv?fmtX(div(gmv,cost)):'–'}</b></span>
        <span style="font-size:12.5px;color:var(--ink-2)">${L('Pesanan','Orders')} <b>${fmtN(ord)}</b></span>
      </div>
      ${chans.length?`<div style="font-size:11.5px;font-weight:700;letter-spacing:.04em;color:var(--muted);margin:4px 0 2px">${L('PENJUALAN','SALES')}</div>
      <div class="tbl-wrap" style="border:0;border-radius:0"><table><thead><tr>
        <th>Channel</th><th>${L('Anggaran','Budget')}</th><th>Spent</th><th>Pacing</th><th>GMV</th><th>${L('Pesanan','Orders')}</th><th>ROAS vs target</th><th>CPO</th><th>AOV</th><th>CTR</th><th>CTOR</th><th>${L('Data hingga','Data through')}</th>
      </tr></thead><tbody>
      ${chans.map(c=>{
        const T=targets[c.id]||8;
        const pace=(c.budget&&c.last)?c.tot.cost/(c.budget*c.last/DIMm):null;
        const pct=c.budget?Math.min(100,100*c.tot.cost/c.budget):0;
        const pcCol=pace==null?'var(--axis)':pace>1.2?'var(--serious)':pace<0.6?'var(--warning)':'var(--good)';
        return `<tr class="click" data-ch="${c.id}">
          <td>${esc(chName(c.id))}</td>
          <td class="num"><span class="budget-edit" data-b="${c.id}" title="${L('Klik untuk mengubah anggaran bulan ini','Click to edit this month\'s budget')}" style="cursor:pointer;border-bottom:1px dashed var(--axis)">${fmtRpC(c.budget)} ✎</span></td><td class="num">${fmtRpC(c.tot.cost)}</td>
          <td><div style="display:flex;align-items:center;gap:7px"><div class="bar-track" style="flex:1"><div class="bar-fill" style="width:${pct}%;background:${pcCol}"></div></div>
            <span style="font-size:11px;color:var(--muted);width:34px;text-align:right">${c.budget?nf0.format(100*c.tot.cost/c.budget)+'%':'–'}</span></div></td>
          <td class="num">${fmtRpC(c.tot.gmv)}</td>
          <td class="num">${fmtN(c.tot.orders)}</td>
          <td>${pill(c.roas,T)} <span style="font-size:10.5px;color:var(--muted)">/ ${nf0.format(T)}</span></td>
          <td class="num">${c.cpo?fmtRpC(c.cpo):'–'}</td><td class="num">${c.aov?fmtRpC(c.aov):'–'}</td>
          <td class="num">${c.ctr!=null?fmtPct(c.ctr):'–'}</td><td class="num">${c.ctor!=null?fmtPct(c.ctor):'–'}</td>
          <td class="num">${c.last?(L('hari ','day ')+c.last):`<span style="color:var(--muted)">${L('kosong','empty')}</span>`}</td></tr>`;
      }).join('')}${p==='tiktok'?['sum:live','sum:prod'].map(key=>{
        const ids=SUM_CH[key].ids;
        const parts=stats.filter(c=>ids.includes(c.id)&&c.last>0);
        if(!parts.length)return '';
        const t={cost:sum(parts.map(c=>c.tot.cost)),gmv:sum(parts.map(c=>c.tot.gmv)),orders:sum(parts.map(c=>c.tot.orders)),imp:sum(parts.map(c=>c.tot.imp)),clk:sum(parts.map(c=>c.tot.clk))};
        const bud=sum(parts.map(c=>c.budget||0))||null;
        const last=Math.max(...parts.map(c=>c.last));
        const roas=div(t.gmv,t.cost);
        const T=targets[key==='sum:live'?'tt_live_all':'tt_vsa_psa']||8;
        const pct=bud?Math.min(100,100*t.cost/bud):0;
        return `<tr class="click" data-sum="${key}" style="background:var(--surface-2)">
          <td style="font-weight:650">Σ ${SUM_CH[key].name()}</td>
          <td class="num">${fmtRpC(bud)}</td><td class="num" style="font-weight:650">${fmtRpC(t.cost)}</td>
          <td><div style="display:flex;align-items:center;gap:7px"><div class="bar-track" style="flex:1"><div class="bar-fill" style="width:${pct}%;background:var(--brand-2)"></div></div>
            <span style="font-size:11px;color:var(--muted);width:34px;text-align:right">${bud?nf0.format(100*t.cost/bud)+'%':'–'}</span></div></td>
          <td class="num" style="font-weight:650">${fmtRpC(t.gmv)}</td>
          <td class="num" style="font-weight:650">${fmtN(t.orders)}</td>
          <td>${pill(roas,T)} <span style="font-size:10.5px;color:var(--muted)">/ ${nf0.format(T)}</span></td>
          <td class="num">${t.orders?fmtRpC(t.cost/t.orders):'–'}</td><td class="num">${t.orders?fmtRpC(t.gmv/t.orders):'–'}</td>
          <td class="num">${t.imp?fmtPct(100*t.clk/t.imp):'–'}</td><td class="num">${t.clk?fmtPct(100*t.orders/t.clk):'–'}</td>
          <td class="num">${L('hari ','day ')+last}</td></tr>`;
      }).join(''):''}</tbody></table></div>`:''}
      ${uppers.length?`<div style="font-size:11.5px;font-weight:700;letter-spacing:.04em;color:var(--muted);margin:12px 0 2px">BRANDING ADS <span style="font-weight:400;letter-spacing:0">· Awareness / Brand Consideration / Community Interaction</span></div>
      <div class="tbl-wrap" style="border:0;border-radius:0"><table><thead><tr>
        <th>Channel</th><th>${L('Anggaran','Budget')}</th><th>Spent</th><th>Pacing</th><th>${L('Jangkauan','Reach')}</th><th>${L('Impresi','Impressions')}</th><th>CPM</th><th>${L('Klik Produk','Product Clicks')}*</th><th>${L('Pengikut Berbayar','Paid Followers')}</th><th>${L('Biaya per Pengikut','Cost per Follower')}</th><th>${L('Data hingga','Data through')}</th>
      </tr></thead><tbody>
      ${uppers.map(c=>{
        const reach=sum(c.days.reach||[]),imp=c.tot.imp,clk=c.tot.clk,fol=sum(c.days.follows||[]);
        const pct=c.budget?Math.min(100,100*c.tot.cost/c.budget):0;
        const pace=(c.budget&&c.last)?c.tot.cost/(c.budget*c.last/DIMm):null;
        const pcCol=pace==null?'var(--axis)':pace>1.2?'var(--serious)':pace<0.6?'var(--warning)':'var(--good)';
        return `<tr class="click" data-ch="${c.id}">
          <td>${esc(chName(c.id))}</td>
          <td class="num"><span class="budget-edit" data-b="${c.id}" title="${L('Klik untuk mengubah anggaran bulan ini','Click to edit this month\'s budget')}" style="cursor:pointer;border-bottom:1px dashed var(--axis)">${fmtRpC(c.budget)} ✎</span></td><td class="num">${fmtRpC(c.tot.cost)}</td>
          <td><div style="display:flex;align-items:center;gap:7px"><div class="bar-track" style="flex:1"><div class="bar-fill" style="width:${pct}%;background:${pcCol}"></div></div>
            <span style="font-size:11px;color:var(--muted);width:34px;text-align:right">${c.budget?nf0.format(100*c.tot.cost/c.budget)+'%':'–'}</span></div></td>
          <td class="num">${reach?fmtNC(reach):'–'}</td><td class="num">${imp?fmtNC(imp):'–'}</td>
          <td class="num">${imp&&c.tot.cost?fmtRpC(1000*c.tot.cost/imp):'–'}</td>
          <td class="num">${clk?fmtNC(clk):'–'}</td>
          <td class="num">${fol?fmtN(fol):'–'}</td>
          <td class="num">${fol&&c.tot.cost?fmtRpC(c.tot.cost/fol):'–'}</td>
          <td class="num">${c.last?(L('hari ','day ')+c.last):`<span style="color:var(--muted)">${L('kosong','empty')}</span>`}</td></tr>`;
      }).join('')}</tbody></table></div>
      <p class="note" style="margin-top:4px">${L('*Klik Produk pada Brand Consideration adalah Consideration Size sesuai definisi database Anda. Biaya Branding Ads ikut dihitung pada Total Spend (Semua Iklan) di tab Ringkasan.','*Product Clicks on Brand Consideration equals Consideration Size per your database definition. Branding Ads spend is included in Total Spend (All Ads) on the Summary tab.')}</p>`:''}
    </div>`;
    wrap.appendChild(sec);
  }
  /* perbaikan poin 6: edit anggaran memakai modal uiPrompt (prompt() diblokir di artifact) */
  wrap.querySelectorAll('.budget-edit').forEach(el=>el.addEventListener('click',async ev=>{
    ev.stopPropagation();
    const cid=el.dataset.b;
    const cur=(budgetOv[mk]||{})[cid] ?? (((RAW.months[mk]||{}).budgets||{})[cid]||0);
    const v=await uiPrompt({title:L('Ubah Anggaran','Edit Budget'),
      label:`${chName(cid)} · ${mkLabel(mk)} (Rp)`,value:cur||'',type:'number',
      ok:L('Simpan','Save'),cancel:L('Batal','Cancel')});
    if(v===null)return;
    const n=parseFloat(String(v).replace(/[^\d.]/g,''));
    (budgetOv[mk]??={})[cid]=isNaN(n)?0:n;
    store.set(LS_B,budgetOv);invalidateCache();renderPlatforms();updateBadge();
    uiToast(L('Anggaran tersimpan di browser ini.','Budget saved in this browser.'));
  }));
  wrap.querySelectorAll('tr[data-ch],tr[data-sum]').forEach(tr=>tr.addEventListener('click',()=>{
    dailySel=tr.dataset.ch||tr.dataset.sum;dailyMode='channel';DH={from:isoOf(mk,1),to:isoOf(mk,mkDays(mk)),preset:'custom'};
    location.hash='#/harian';if(curTab==='harian')renderDaily();
  }));
}

/* =================== ANALISIS (iklan + produk + kreator) =================== */
function prodAgg(rows){
  const agg={};
  for(const r of rows){
    const key=canonKey(r.name);
    const o=agg[key]??={name:r.name,qty:0,val:0,cost:0,imp:0,clk:0,ord:0,chs:new Set()};
    o.qty+=r.qty||0;o.val+=r.val||0;o.cost+=r.cost||0;o.imp+=r.imp||0;o.clk+=r.clk||0;o.ord+=r.ord||0;
    o.chs.add(r.chId);
    if(r.name.length>o.name.length)o.name=r.name;
  }
  return Object.values(agg).map(derive);
}
function prodInsights(){
  const all=store.get(LS_P,[]).filter(r=>!LIVE_CH.has(r.chId))
    .filter(r=>['tiktok','shopee'].includes(chDef(r.chId)?.platform)).map(resolveProdName);
  if(!all.length)return null;
  const months=[...new Set(all.map(r=>mkOf(r.iso)))].sort();
  const mk=months[months.length-1];
  const rows=all.filter(r=>mkOf(r.iso)===mk);
  const list=prodAgg(rows);
  const tot=sum(list.map(x=>x.val))||1,totC=sum(list.map(x=>x.cost));
  const top=[...list].sort((a,b)=>b.val-a.val).slice(0,5);
  const low=list.filter(x=>x.cost>=300000&&x.roi!=null&&x.roi<5).sort((a,b)=>b.cost-a.cost).slice(0,5);
  const noBoost=list.filter(x=>x.roi!=null&&x.roi>=15&&x.cost<totC/list.length).sort((a,b)=>b.roi-a.roi).slice(0,3);
  return {mk,n:list.length,tot,totC,top,low,noBoost,roi:totC?tot/totC:null};
}
function creatorInsights(){
  const all=store.get(LS_V,[]);
  if(!all.length)return null;
  const months=[...new Set(all.map(r=>mkOf(r.iso)))].sort();
  const mk=months[months.length-1];
  const rows=all.filter(r=>mkOf(r.iso)===mk);
  const by={};
  for(const r of rows){
    const o=by[r.creator]??={creator:r.creator,qty:0,val:0,cost:0,imp:0,clk:0,vids:new Set()};
    o.qty+=r.qty||0;o.val+=r.val||0;o.cost+=r.cost||0;o.imp+=r.imp||0;o.clk+=r.clk||0;
    o.vids.add(r.vid||r.title);
  }
  const list=Object.values(by).map(o=>{o.ord=o.qty;return derive(o);}).sort((a,b)=>b.val-a.val);
  const tot=sum(list.map(x=>x.val))||1,totC=sum(list.map(x=>x.cost));
  const low=list.filter(x=>x.cost>=200000&&x.roi!=null&&x.roi<5).sort((a,b)=>b.cost-a.cost).slice(0,5);
  return {mk,n:list.length,tot,totC,top:list.slice(0,5),low,roi:totC?tot/totC:null};
}
function renderAnalytics(){
  ALERTS=computeAlerts();
  const {alerts,opps}=ALERTS;
  const chm=SALES_DEF.map(c=>chMonth(c.id,LATEST)).filter(c=>c.roas!=null&&c.tot.cost>500000);
  const worst=chm.slice().sort((a,b)=>a.roas-b.roas)[0];
  const best=chm.slice().sort((a,b)=>b.roas-a.roas)[0];
  const PI=prodInsights(), KI=creatorInsights();
  view.innerHTML=`
  <h2 class="sec">${L('Analisis dan Peringatan','Analysis and Warnings')}</h2>
  <div class="grid g-3">
    ${kpiTile(L('Channel terbaik','Best channel'),best?esc(chName(best.id)):'–',best?`<span class="delta">${platChip(best.platform)} · ROAS <b>${fmtX(best.roas)}</b></span>`:'')}
    ${kpiTile(L('Perlu perhatian','Needs attention'),worst?esc(chName(worst.id)):'–',worst?`<span class="delta">${platChip(worst.platform)} · ROAS <b>${fmtX(worst.roas)}</b></span>`:'')}
    ${kpiTile(L('Temuan aktif','Active findings'),String(alerts.filter(a=>a.sev!=='info').length),`<span class="delta">${opps.length} ${L('peluang peningkatan anggaran','budget scale up opportunities')}</span>`)}
  </div>
  <h2 class="sec">${L('Peringatan dan Rencana Tindakan (Iklan)','Warnings and Action Plan (Ads)')}</h2>
  <div id="alertList">${alerts.filter(a=>a.sev!=='info').map(a=>alertHtml(a)).join('')||`<div class="empty">${L('Tidak ada peringatan. Semua channel sehat ✓','No warnings. All channels are healthy ✓')}</div>`}</div>
  ${alerts.some(a=>a.sev==='info')?`<h2 class="sec">${L('Info Data','Data Info')}</h2>
  <div class="card"><div class="tbl-wrap" style="border:0"><table><thead><tr><th>Channel</th><th>Platform</th><th style="text-align:left">${L('Catatan','Note')}</th><th style="text-align:left">${L('Langkah','Step')}</th></tr></thead>
  <tbody>${alerts.filter(a=>a.sev==='info').map(a=>`<tr><td>${esc(chName(a.ch.id))}</td><td>${platChip(a.ch.platform)}</td>
    <td style="text-align:left;white-space:normal;min-width:220px"><b>${esc(a.title)}</b> · <span style="color:var(--ink-2)">${esc(a.why)}</span></td>
    <td style="text-align:left;white-space:normal;min-width:200px;color:var(--ink-2)">${esc((a.actions&&a.actions[0])||'')}</td></tr>`).join('')}</tbody></table></div></div>`:''}
  <h2 class="sec">${L('Analisis Produk','Product Analysis')}</h2>
  ${!PI?`<div class="card"><div class="empty">${L('Belum ada data produk. Unggah raw Shopee Iklan CPC atau TikTok Product GMV Max pada tab Unggah.','No product data yet. Upload Shopee CPC Ads or TikTok Product GMV Max raw files on the Upload tab.')}</div></div>`:`
  <div class="grid g-2">
    <div class="card"><h3>${L('Produk penggerak nilai','Value driving products')}</h3>
      ${PI.top.map(x=>`<div style="display:flex;align-items:center;gap:10px;margin:7px 0">
        <span style="flex:1;font-size:12.5px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(shortName(x.name))}</span>
        <span style="font-size:12px;font-variant-numeric:tabular-nums">${fmtRpC(x.val)}</span>
        <span class="pill-stat ok">${nf1.format(100*x.val/PI.tot)}%</span>
        <span style="font-size:11.5px;color:var(--muted);width:52px;text-align:right">${x.roi?fmtRoi(x.roi):'–'}</span>
      </div>`).join('')}
      <p class="note">${L('Angka kanan: ROI produk. Prioritaskan stok dan tampilan produk di atas saat live dan kampanye.','Right figure: product ROI. Prioritize stock and placement of these products in live sessions and campaigns.')}</p></div>
    <div class="card"><h3>${L('Produk boros biaya (ROI di bawah 5)','Cost heavy products (ROI below 5)')}</h3>
      ${PI.low.length?PI.low.map(x=>`<div style="display:flex;align-items:center;gap:10px;margin:7px 0">
        <span style="flex:1;font-size:12.5px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(shortName(x.name))}</span>
        <span style="font-size:12px;font-variant-numeric:tabular-nums">${fmtRpC(x.cost)}</span>
        <span class="pill-stat bad">${x.roi==null?'–':fmtRoi(x.roi)}</span>
      </div>`).join(''):`<div class="empty">${L('Tidak ada produk dengan biaya besar dan ROI rendah ✓','No high cost, low ROI products ✓')}</div>`}
      ${PI.low.length?`<ul class="acts" style="margin-top:8px;padding-left:18px;font-size:12.5px">
        <li>${L('Turunkan penawaran atau anggaran produk di atas, lalu alihkan ke produk penggerak nilai.','Lower bids or budget on the products above, then shift to the value driving products.')}</li>
        <li>${L('Periksa halaman produk: harga, foto utama, ulasan, dan voucher.','Review the product page: price, main image, reviews, and vouchers.')}</li>
      </ul>`:''}
      ${PI.noBoost.length?`<p class="note">${L('Kandidat dorongan: ','Boost candidates: ')}${PI.noBoost.map(x=>esc(shortName(x.name))+' ('+fmtRoi(x.roi)+')').join(' · ')}${L('. ROI tinggi dengan biaya masih kecil.','. High ROI with still small spend.')}</p>`:''}
    </div>
  </div>`}
  <h2 class="sec">${L('Analisis Kreator','Creator Analysis')}</h2>
  ${!KI?`<div class="card"><div class="empty">${L('Belum ada data kreator. Unggah raw TikTok Product GMV Max yang memuat kolom Akun TikTok.','No creator data yet. Upload TikTok Product GMV Max raw files containing the TikTok Account column.')}</div></div>`:`
  <div class="grid g-2">
    <div class="card"><h3>${L('Kreator dengan nilai tertinggi','Top creators by value')}</h3>
      ${KI.top.map(x=>`<div style="display:flex;align-items:center;gap:10px;margin:7px 0">
        <span style="flex:1;font-size:12.5px;font-weight:650">${esc(x.creator)}</span>
        <span style="font-size:11.5px;color:var(--muted)">${x.vids.size} video</span>
        <span style="font-size:12px;font-variant-numeric:tabular-nums">${fmtRpC(x.val)}</span>
        <span class="pill-stat ok">${nf1.format(100*x.val/KI.tot)}%</span>
        <span style="font-size:11.5px;color:var(--muted);width:52px;text-align:right">${x.roi?fmtRoi(x.roi):'–'}</span>
      </div>`).join('')}
      <p class="note">${L('Perbanyak kerja sama dan materi dari kreator di atas; gunakan video terbaik mereka sebagai referensi brief.','Increase collaboration and content volume from these creators; use their best videos as brief references.')}</p></div>
    <div class="card"><h3>${L('Kreator dengan ROI rendah','Creators with low ROI')}</h3>
      ${KI.low.length?KI.low.map(x=>`<div style="display:flex;align-items:center;gap:10px;margin:7px 0">
        <span style="flex:1;font-size:12.5px;font-weight:650">${esc(x.creator)}</span>
        <span style="font-size:12px;font-variant-numeric:tabular-nums">${fmtRpC(x.cost)}</span>
        <span class="pill-stat bad">${x.roi==null?'–':fmtRoi(x.roi)}</span>
      </div>`).join(''):`<div class="empty">${L('Tidak ada kreator dengan biaya besar dan ROI rendah ✓','No high cost, low ROI creators ✓')}</div>`}
      ${KI.low.length?`<ul class="acts" style="margin-top:8px;padding-left:18px;font-size:12.5px">
        <li>${L('Hentikan sementara promosi video dengan CTR rendah dari kreator di atas.','Temporarily pause promotion of low CTR videos from the creators above.')}</li>
        <li>${L('Evaluasi kecocokan produk dan gaya konten sebelum memperpanjang kerja sama.','Evaluate product fit and content style before extending the collaboration.')}</li>
      </ul>`:''}
    </div>
  </div>`}
  <h2 class="sec">${L('Peluang dan Saran','Opportunities and Suggestions')}</h2>
  ${opps.map(o=>alertHtml({ch:o.ch,title:o.title,why:o.why,actions:o.actions},'opp')).join('')||`<div class="empty">${L('Belum ada kandidat peningkatan anggaran (butuh ROAS minimal 120% dari target).','No scale up candidates yet (requires ROAS of at least 120% of target).')}</div>`}
  <h2 class="sec">${L('Target ROAS per Channel','ROAS Target per Channel')}</h2>
  <div class="card"><div class="tbl-wrap" style="border:0"><table><thead><tr><th>Channel</th><th>Platform</th><th>ROAS MTD</th><th>Target</th></tr></thead>
  <tbody>${SALES_DEF.filter(c=>!HIDDEN_CH.has(c.id)).map(c=>{const s=chMonth(c.id,LATEST);
    return `<tr><td>${esc(chName(c.id))}</td><td>${platChip(c.platform)}</td><td class="num">${s.roas?fmtX(s.roas):'–'}</td>
    <td><input type="number" step="0.5" min="0" style="width:84px" data-t="${c.id}" value="${targets[c.id]||8}"></td></tr>`;}).join('')}</tbody></table></div>
  <div style="margin-top:10px;display:flex;gap:8px"><button class="btn" id="saveT">${L('Simpan target','Save targets')}</button><button class="btn ghost" id="resetT">${L('Kembalikan bawaan','Reset defaults')}</button></div></div>`;
  document.getElementById('saveT').onclick=()=>{
    view.querySelectorAll('input[data-t]').forEach(inp=>{targets[inp.dataset.t]=parseFloat(inp.value)||0;});
    store.set(LS_T,targets);renderAnalytics();updateBadge();uiToast(L('Target tersimpan.','Targets saved.'));
  };
  document.getElementById('resetT').onclick=()=>{targets=Object.assign({},DEFAULT_TARGETS);store.set(LS_T,targets);renderAnalytics();updateBadge();};
}

/* =================== UNGGAH (UPLOAD) =================== */
function csvParse(text){
  const rows=[];let row=[],cur='',q=false;
  for(let i=0;i<text.length;i++){const ch=text[i];
    if(q){if(ch==='"'){if(text[i+1]==='"'){cur+='"';i++;}else q=false;}else cur+=ch;}
    else if(ch==='"')q=true;
    else if(ch===','){row.push(cur);cur='';}
    else if(ch==='\n'){row.push(cur);rows.push(row);row=[];cur='';}
    else if(ch!=='\r')cur+=ch;
  }
  if(cur!==''||row.length){row.push(cur);rows.push(row);}
  return rows;
}
const plainnum=v=>{if(v==null)return null;v=String(v).trim().replace(/[Rp%\s]/g,'').replace(/,/g,'');
  if(v===''||v==='-')return null;const n=parseFloat(v);return isNaN(n)?null:n;};
const MON_MAP={jan:1,feb:2,mar:3,apr:4,mei:5,may:5,jun:6,jul:7,agu:8,aug:8,sep:9,okt:10,oct:10,nov:11,des:12,dec:12};
function anyDateToIso(s){
  if(s==null)return null; s=String(s).trim();
  let iso=null,m;
  if((m=s.match(/^(\d{4})[-\/](\d{2})[-\/](\d{2})/)))iso=`${m[1]}-${m[2]}-${m[3]}`;
  else if((m=s.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})/)))iso=`${m[3]}-${m[2]}-${m[1]}`;
  else if((m=s.match(/^(\d{1,2})\s+([A-Za-z]{3})/))){
    const mo=MON_MAP[m[2].toLowerCase()];
    if(mo){
      const y=RAW.months[`2026-${String(mo).padStart(2,'0')}`]?'2026':'2025';
      iso=`${y}-${String(mo).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}`;
    }
  }
  return iso&&inData(iso)?iso:null;
}
function idNorm(v){
  let s=String(v??'').trim().replace(/\.0+$/,'');
  if(/^\d+(\.\d+)?e\+\d+$/i.test(s))s=String(Math.round(Number(s)));
  return s;
}
function harvestProdNames(rows){
  for(let i=0;i<Math.min(rows.length,15);i++){
    const H=rows[i].map(x=>String(x||'').trim().toLowerCase());
    let ci=-1,cn=-1;
    H.forEach((h,idx)=>{
      if(ci<0&&/^(id produk|produk id|product[ _]?id|id barang|id)$/.test(h))ci=idx;
      if(cn<0&&/(nama produk|product[ _]?name|judul produk|nama barang)/.test(h))cn=idx;
    });
    if(ci>=0&&cn>=0&&ci!==cn){
      const map={};
      for(const r of rows.slice(i+1)){
        const id=idNorm(r[ci]), nm=String(r[cn]||'').trim();
        if(/^\d{6,}$/.test(id)&&nm&&!/^\d+$/.test(nm))map[id]=nm;
      }
      if(Object.keys(map).length)return map;
    }
  }
  return null;
}
function findHeader(rows,needCols){
  for(let i=0;i<Math.min(rows.length,15);i++){
    const set=rows[i].map(x=>String(x||'').trim());
    if(needCols.every(n=>set.includes(n)))return i;
  }
  return -1;
}
const colIdxOf=(H,...names)=>{for(const n of names){const i=H.findIndex(h=>h.toLowerCase()===n.toLowerCase());if(i>=0)return i;}return -1;};
function liveChannelFromName(name){
  const n=String(name||'').toLowerCase();
  if(/\baff|affiliate/.test(n))return 'tt_live_aff';
  if(/smo/.test(n))return 'tt_live_smo';
  if(/sid/.test(n))return 'tt_live_sid';
  if(/smv/.test(n))return 'tt_live_smv';
  return 'tt_live_smo';
}
const isNS=name=>/new/i.test(String(name||''))||/\bns\b/i.test(String(name||''));
function detectRows(rows,filename){
  const head400=rows.slice(0,6).flat().join(' ');
  const H_at=i=>rows[i].map(x=>String(x||'').trim());
  const shopeeKind=
    head400.includes('Semua Laporan Iklan CPC')?'shopee_cpc':
    head400.includes('Laporan Iklan Toko')?'shopee_toko':
    head400.includes('Search Brand Ads Report')?'shopee_sba':
    (head400.includes('Livestream')||head400.includes('Iklan Live'))?'shopee_live':null;
  if(shopeeKind){
    const perLine=rows.find(r=>String(r[0]||'').trim()==='Periode');
    let date=null;
    if(perLine){const m=String(perLine[1]||'').match(/(\d{2})\/(\d{2})\/(\d{4})\s*-\s*(\d{2})\/(\d{2})\/(\d{4})/);
      if(m&&m[1]===m[4]&&m[2]===m[5])date=anyDateToIso(`${m[1]}/${m[2]}/${m[3]}`);
      else if(m)date=anyDateToIso(`${m[4]}/${m[5]}/${m[6]}`);}
    const hi=rows.findIndex(r=>String(r[0]||'').trim()==='Urutan');
    if(hi<0)return {error:L('Header tabel Shopee (kolom "Urutan") tidak ditemukan.','Shopee table header (the "Urutan" column) was not found.')};
    const H=H_at(hi);
    const cBiaya=colIdxOf(H,'Biaya'),cOmzet=colIdxOf(H,'Omzet Penjualan'),
          cKonv=colIdxOf(H,'Konversi','Pesanan'),cLihat=colIdxOf(H,'Dilihat'),
          cKlik=colIdxOf(H,'Jumlah Klik'),cView=colIdxOf(H,'Penonton'),
          cNama=colIdxOf(H,'Nama Iklan'),cKode=colIdxOf(H,'Kode Produk'),
          cTerjual=colIdxOf(H,'Produk Terjual'),cMode=colIdxOf(H,'Mode Bidding');
    const isNewProd=r=>/tahap\s*1/i.test(String(cMode>=0?r[cMode]:''));
    const acc={sp_pc:{cost:0,gmv:0,orders:0,impressions:0,clicks:0,n:0},
               sp_pc_new:{cost:0,gmv:0,orders:0,impressions:0,clicks:0,n:0}};
    let cost=0,gmv=0,orders=0,imp=0,clk=0,lv=0,n=0,active=0;
    const products=[];
    for(const r of rows.slice(hi+1)){
      if(!r[0]||!/^\d+$/.test(String(r[0]).trim()))continue;
      n++;
      const b=plainnum(r[cBiaya])||0;
      if(b<=0)continue;
      active++;
      const rowCh=shopeeKind==='shopee_cpc'?(isNewProd(r)?'sp_pc_new':'sp_pc'):null;
      const g=plainnum(r[cOmzet])||0, o=plainnum(r[cKonv])||0,
            im=cLihat>=0?(plainnum(r[cLihat])||0):0, kl=cKlik>=0?(plainnum(r[cKlik])||0):0;
      cost+=b;gmv+=g;orders+=o;imp+=im;clk+=kl;
      if(cView>=0)lv+=plainnum(r[cView])||0;
      if(rowCh){const a=acc[rowCh];a.cost+=b;a.gmv+=g;a.orders+=o;a.impressions+=im;a.clicks+=kl;a.n++;}
      if(shopeeKind==='shopee_cpc'&&cNama>=0&&String(r[cNama]||'').trim()){
        products.push({name:String(r[cNama]).trim(),code:cKode>=0?String(r[cKode]||'').trim():'',
          chId:rowCh||undefined,
          qty:(cTerjual>=0?plainnum(r[cTerjual]):plainnum(r[cKonv]))||0,
          val:g, cost:b, imp:im, clk:kl, ord:o});
      }
    }
    const lblMap={shopee_cpc:'Shopee Iklan CPC',shopee_toko:'Shopee Iklan Toko',shopee_sba:'Shopee SBA',shopee_live:'Shopee Live'};
    if(shopeeKind==='shopee_cpc'){
      const entriesNoDate=[];
      for(const [chId,a] of Object.entries(acc)){
        if(!a.cost)continue;
        const m={cost:a.cost,gmv:a.gmv,orders:a.orders};
        if(a.impressions)m.impressions=a.impressions;
        if(a.clicks)m.clicks=a.clicks;
        entriesNoDate.push({chId,metrics:m});
      }
      return {type:'shopee_cpc',needsDate:true,date,
        label:`Shopee Iklan CPC · ${L('Iklan Produk','Product Ads')} ${acc.sp_pc.n} camp / ${L('Produk Baru','New Product')} ${acc.sp_pc_new.n} camp · ${products.length} ${L('produk','products')}`,
        entriesNoDate,products};
    }
    const defaultCh=shopeeKind==='shopee_toko'?'sp_store':shopeeKind==='shopee_sba'?'sp_sba':'sp_live';
    const single={cost,gmv,orders};if(imp)single.impressions=imp;if(clk)single.clicks=clk;if(lv)single.liveViews=lv;
    return {type:shopeeKind,label:`${lblMap[shopeeKind]} · ${active}/${n} ${L('kampanye berbiaya','campaigns with spend')}`,
      single,defaultCh,date,needsDate:true,needsCh:true,products};
  }
  /* --- Laporan Campaign Branding Ads (upper funnel): Community Interaction / Awareness / Brand Consideration ---
     Consideration Size dicatat sebagai Product Clicks (masuk Ringkasan & MoM). --- */
  {
    let bhi=findHeader(rows,['Campaign name','Spend','New consideration size']);
    if(bhi<0)bhi=findHeader(rows,['Campaign name','Spend','Paid follows']);
    if(bhi>=0){
      const H=H_at(bhi);
      const cName=colIdxOf(H,'Campaign name'),cSpend=colIdxOf(H,'Spend'),
            cReach=colIdxOf(H,'Reach'),cImp=colIdxOf(H,'Impressions'),
            cCons=colIdxOf(H,'New consideration size','Consideration size'),
            cFol=colIdxOf(H,'Paid follows');
      let fnDate=null,fm;
      if((fm=String(filename||'').match(/(\d{4})[-_.]?(\d{2})[-_.]?(\d{2})/)))fnDate=`${fm[1]}-${fm[2]}-${fm[3]}`;
      if(fnDate&&!inData(fnDate))fnDate=null;
      const brandingChannel=name=>{
        const n=String(name||'').toLowerCase();
        if(n.includes('community'))return 'tt_ci_smv';
        if(n.includes('consideration'))return 'tt_bc_ext';
        if(n.includes('awareness')||n.includes('reach'))return 'tt_aw_ext';
        return null;
      };
      const agg={};let rowsUsed=0,zeroDropped=0,unknown=0;
      for(const r of rows.slice(bhi+1)){
        const name=String(r[cName]||'').trim();
        if(!name||/^total/i.test(name))continue;
        const spend=plainnum(r[cSpend])||0;
        if(spend<=0){zeroDropped++;continue;}
        const chId=brandingChannel(name);
        if(!chId){unknown++;continue;}
        rowsUsed++;
        const o=agg[chId]??={cost:0,reach:0,impressions:0,clicks:0,follows:0};
        o.cost+=spend;
        o.reach+=cReach>=0?(plainnum(r[cReach])||0):0;
        o.impressions+=cImp>=0?(plainnum(r[cImp])||0):0;
        if(chId.startsWith('tt_bc')&&cCons>=0)o.clicks+=plainnum(r[cCons])||0;   /* consideration size -> product clicks */
        if(chId.startsWith('tt_ci')&&cFol>=0)o.follows+=plainnum(r[cFol])||0;
      }
      const chIds=Object.keys(agg);
      if(chIds.length){
        const entriesNoDate=chIds.map(chId=>{
          const o=agg[chId],m={cost:o.cost};
          if(o.reach)m.reach=o.reach;
          if(o.impressions)m.impressions=o.impressions;
          if(o.clicks)m.clicks=o.clicks;
          if(o.follows)m.follows=o.follows;
          return {chId,metrics:m};
        });
        return {type:'branding',needsDate:true,date:fnDate,entriesNoDate,
          label:`${L('Iklan Branding','Branding Ads')} · ${chIds.map(c=>chName(c)).join(', ')} · ${fmtRpC(sum(chIds.map(c=>agg[c].cost)))} spend${zeroDropped?` · ${zeroDropped} ${L('campaign 0 dibuang','zero campaigns dropped')}`:''}${unknown?` · ${unknown} ${L('tak dikenal','unrecognized')}`:''}`,
          hint:L('Consideration Size dicatat sebagai Product Clicks (masuk ke Ringkasan dan tabel MoM). Pilih tanggal data bila belum terisi otomatis.','Consideration Size is recorded as Product Clicks (feeds the Summary and MoM table). Choose the data date if it is not filled automatically.')};
      }
    }
  }
  let hi=findHeader(rows,['Campaign name','Day']);
  if(hi<0)hi=findHeader(rows,['Day','Campaign name']);
  if(hi>=0){
    const H=H_at(hi);
    const cDay=colIdxOf(H,'Day'),
          cSpent=H.findIndex(h=>/amount spent/i.test(h)),
          cPur=H.findIndex(h=>/^purchases with shared/i.test(h)),
          cVal=H.findIndex(h=>/^purchases conversion value/i.test(h)),
          cClk=H.findIndex(h=>/link clicks/i.test(h)),
          cReach=colIdxOf(H,'Reach'),cImp=colIdxOf(H,'Impressions');
    const isSalesFile=cPur>=0||cVal>=0;
    const fn=String(filename||'');
    const chId=/cpas/i.test(fn)?'meta_cpas':
               /regul|\breg\b|website|dtw/i.test(fn)?(isSalesFile?'meta_reg':'meta_aw'):
               (isSalesFile?'meta_cpas':'meta_aw');
    const byIso={};let skipped=0;
    for(const r of rows.slice(hi+1)){
      const iso=anyDateToIso(r[cDay]);
      if(iso==null){if(String(r[cDay]||'').trim())skipped++;continue;}
      const o=byIso[iso]??={cost:0,gmv:0,orders:0,clicks:0,reach:0,impressions:0};
      o.cost+=plainnum(r[cSpent])||0;
      if(cVal>=0)o.gmv+=plainnum(r[cVal])||0;
      if(cPur>=0)o.orders+=plainnum(r[cPur])||0;
      if(cClk>=0)o.clicks+=plainnum(r[cClk])||0;
      if(cReach>=0)o.reach+=plainnum(r[cReach])||0;
      if(cImp>=0)o.impressions+=plainnum(r[cImp])||0;
    }
    const isos=Object.keys(byIso).sort();
    if(!isos.length)return {error:L('Tidak ada baris harian valid (kolom Day) dalam rentang database 2025 hingga 2026.','No valid daily rows (Day column) within the 2025 through 2026 database range.')};
    const entries=isos.map(iso=>({chId,iso,metrics:byIso[iso]}));
    return {type:'meta',needsCh:true,defaultCh:chId,
      label:`${chName(chId)||'Meta'} · ${isos.length} ${L('hari','days')} (${isoLabel(isos[0])} - ${isoLabelY(isos[isos.length-1])})${skipped?` · ${skipped} ${L('baris di luar rentang dilewati','rows outside range skipped')}`:''}`,entries};
  }
  {
    let hiN=-1;
    for(let i=0;i<Math.min(rows.length,15);i++){
      const set=rows[i].map(x=>String(x||'').trim().toLowerCase());
      const hasId=set.some(h=>['id produk','product id','id'].includes(h));
      const hasName=set.some(h=>['nama produk','product name','judul produk','nama'].includes(h));
      const hasBiaya=set.some(h=>/biaya|cost|pengeluaran/.test(h));
      if(hasId&&hasName&&!hasBiaya){hiN=i;break;}
    }
    if(hiN>=0){
      const H=rows[hiN].map(x=>String(x||'').trim().toLowerCase());
      const ci=H.findIndex(h=>['id produk','product id','id'].includes(h));
      const cn=H.findIndex(h=>['nama produk','product name','judul produk','nama'].includes(h));
      const mapping={};
      for(const r of rows.slice(hiN+1)){
        const id=idNorm(r[ci]), nm=String(r[cn]||'').trim();
        if(/^\d{6,}$/.test(id)&&nm)mapping[id]=nm;
      }
      const n=Object.keys(mapping).length;
      if(n)return {type:'prodnames',mapping,label:L('Kamus Produk TikTok · ','TikTok Product Dictionary · ')+n+L(' pasangan ID dan nama',' ID and name pairs')};
    }
  }
  hi=findHeader(rows,['Tanggal','Tipe Campaign','Pengeluaran']);
  if(hi>=0){
    const H=H_at(hi);
    const cTgl=colIdxOf(H,'Tanggal'),cTipe=colIdxOf(H,'Tipe Campaign'),
          cCost=colIdxOf(H,'Pengeluaran'),cRev=colIdxOf(H,'Pendapatan Toko'),
          cOrd=colIdxOf(H,'Order Toko'),cImp=colIdxOf(H,'Impresi'),cKlik=colIdxOf(H,'Klik');
    const agg={};let skipped=0,rowsUsed=0;
    for(const r of rows.slice(hi+1)){
      const iso=anyDateToIso(r[cTgl]);
      if(iso==null){if(String(r[cTgl]||'').trim())skipped++;continue;}
      const tipe=String(r[cTipe]||'').toLowerCase();
      const chId=/product/.test(tipe)?'lz_product':'lz_store';
      rowsUsed++;
      const key=chId+'|'+iso;
      const o=agg[key]??={chId,iso,metrics:{cost:0,gmv:0,orders:0,impressions:0,clicks:0}};
      o.metrics.cost+=plainnum(r[cCost])||0;
      o.metrics.gmv+=plainnum(r[cRev])||0;
      o.metrics.orders+=plainnum(r[cOrd])||0;
      o.metrics.impressions+=plainnum(r[cImp])||0;
      o.metrics.clicks+=plainnum(r[cKlik])||0;
    }
    const entries=Object.values(agg);
    if(!entries.length)return {error:L('Tidak ada baris Lazada dengan tanggal valid dalam rentang database.','No Lazada rows with valid dates within the database range.')};
    const isos=entries.map(e=>e.iso).sort();
    return {type:'lazada',
      label:`Lazada Sponsored Max · ${rowsUsed} ${L('baris','rows')} → Max Store & Max Product (${isoLabel(isos[0])} - ${isoLabelY(isos[isos.length-1])})${skipped?` · ${skipped} ${L('baris dilewati','rows skipped')}`:''}`,entries};
  }
  hi=findHeader(rows,['Nama kampanye','Biaya']);
  if(hi<0){
    for(let i=0;i<Math.min(rows.length,5);i++){
      const set=H_at(i);
      if(set.includes('Nama kampanye')&&set.some(h=>/Biaya/.test(h))){hi=i;break;}
    }
  }
  if(hi>=0){
    const H=H_at(hi);
    const cName=colIdxOf(H,'Nama kampanye'),
          cBiaya=colIdxOf(H,'Biaya'),cOrd=H.findIndex(h=>/^Pesanan/.test(h)),
          cRev=H.findIndex(h=>/Pendapatan kotor|Penghasilan bruto/.test(h)),
          cLive=H.findIndex(h=>/Tayangan LIVE$/.test(h)),
          cImp=H.findIndex(h=>/Impresi/.test(h)),cClk=H.findIndex(h=>/Jumlah klik/.test(h)),
          cJenis=colIdxOf(H,'Jenis materi iklan'),
          cWaktu=H.findIndex(h=>/Waktu peluncuran/.test(h)),cDate=colIdxOf(H,'Date','Tanggal','Hari'),
          cProdId=colIdxOf(H,'ID produk'),cVidT=colIdxOf(H,'Judul video'),
          cVidId=colIdxOf(H,'ID video'),cAkun=colIdxOf(H,'Akun TikTok'),
          cPName=colIdxOf(H,'Nama produk','Nama Produk','Product name','Judul produk');
    const isLive=cLive>=0||cWaktu>=0;
    const hasDateCol=cWaktu>=0||cDate>=0;
    let fnDate=null,m2;
    if((m2=String(filename||'').match(/(\d{4})[-_.](\d{2})[-_.](\d{2})/)))fnDate=`${m2[1]}-${m2[2]}-${m2[3]}`;
    else if((m2=String(filename||'').match(/(\d{2})[-_.](\d{2})[-_.](\d{4})/)))fnDate=`${m2[3]}-${m2[2]}-${m2[1]}`;
    if(fnDate&&!inData(fnDate))fnDate=null;
    const routeProduct=(name,jenis)=>{
      const ns=isNS(name);
      if(/video/.test(jenis))return ns?'tt_vsa_ns':'tt_vsa';
      if(/kartu|card/.test(jenis))return ns?'tt_psa_ns':'tt_psa';
      return ns?'tt_vsa_ns':'tt_vsa';
    };
    const agg={};let skipped=0,rowsUsed=0,zeroDropped=0;
    const products=[],videos=[];
    for(const r of rows.slice(hi+1)){
      const name=r[cName];
      if(!name&&!(r[cBiaya]))continue;
      const iso=hasDateCol?anyDateToIso(r[cWaktu>=0?cWaktu:cDate]):null;
      if(hasDateCol&&iso==null){skipped++;continue;}
      let chId;
      if(isLive)chId=liveChannelFromName(name);
      else{
        const rowCost=plainnum(r[cBiaya])||0;
        const rowOrd=cOrd>=0?(plainnum(r[cOrd])||0):0;
        if(rowCost===0&&rowOrd===0){zeroDropped++;continue;}
        chId=routeProduct(name,String(cJenis>=0?r[cJenis]:'').toLowerCase());
      }
      rowsUsed++;
      const key=chId+'|'+(iso||'?');
      const o=agg[key]??={chId,iso,metrics:{cost:0,gmv:0,orders:0}};
      o.metrics.cost+=plainnum(r[cBiaya])||0;
      if(cRev>=0)o.metrics.gmv+=plainnum(r[cRev])||0;
      if(cOrd>=0)o.metrics.orders+=plainnum(r[cOrd])||0;
      if(cImp>=0)o.metrics.impressions=(o.metrics.impressions||0)+(plainnum(r[cImp])||0);
      if(cClk>=0)o.metrics.clicks=(o.metrics.clicks||0)+(plainnum(r[cClk])||0);
      if(cLive>=0)o.metrics.liveViews=(o.metrics.liveViews||0)+(plainnum(r[cLive])||0);
      if(!isLive){
        const qty=(cOrd>=0?plainnum(r[cOrd]):0)||0, val=(cRev>=0?plainnum(r[cRev]):0)||0;
        const rc=plainnum(r[cBiaya])||0,
              ri=cImp>=0?(plainnum(r[cImp])||0):0, rk=cClk>=0?(plainnum(r[cClk])||0):0;
        const pid=cProdId>=0?idNorm(r[cProdId]):'';
        const pname=cPName>=0&&String(r[cPName]||'').trim()?String(r[cPName]).trim():('Produk '+pid);
        if(pid&&(qty||val))products.push({name:pname,code:pid,chId,iso,qty,val,cost:rc,imp:ri,clk:rk,ord:qty});
        const akun=cAkun>=0?String(r[cAkun]||'').trim():'';
        const vt=cVidT>=0?String(r[cVidT]||'').trim():'';
        if(akun&&(qty||val))videos.push({creator:akun,title:vt||('Video '+String(cVidId>=0?r[cVidId]:'')),
          vid:cVidId>=0?String(r[cVidId]||'').trim():'',chId,iso,qty,val,cost:rc,imp:ri,clk:rk});
      }
    }
    const entries=Object.values(agg);
    if(!entries.length){
      if(!hasDateCol)return {error:L('File TikTok terbaca tetapi kosong.','The TikTok file was read but is empty.')};
      return {error:L('Tidak ada baris TikTok dengan tanggal valid. Pastikan ada kolom Date / Waktu peluncuran.','No TikTok rows with valid dates. Ensure a Date / Launch time column exists.')};
    }
    const chs=[...new Set(entries.map(e=>chName(e.chId)))].join(', ');
    if(!hasDateCol){
      return {type:'tt_product',needsDate:true,date:fnDate,
        label:`TikTok Product GMV Max (${L('tanpa kolom tanggal','no date column')}) · ${rowsUsed} ${L('baris','rows')} → ${chs}${zeroDropped?` · ${zeroDropped} ${L('baris biaya dan pesanan 0 dibuang','zero cost and order rows dropped')}`:''}`,
        entriesNoDate:entries,products,videos,
        hint:L('Tidak ada kolom tanggal. Pilih tanggal data di samping. Saran: ekspor per 1 hari dan tambahkan tanggal pada nama file (contoh: RAW_TIKTOK_PRODUCT_2026-07-14.xlsx) agar terisi otomatis.','No date column. Choose the data date beside. Tip: export per single day and add the date to the file name (example: RAW_TIKTOK_PRODUCT_2026-07-14.xlsx) so it fills automatically.')};
    }
    return {type:isLive?'tt_live':'tt_product',
      label:`TikTok ${isLive?'Live GMV Max':'Product GMV Max'} · ${rowsUsed} ${L('baris','rows')} → ${chs}${skipped?` · ${skipped} ${L('baris tanpa tanggal valid','rows without valid dates')}`:''}${zeroDropped?` · ${zeroDropped} ${L('baris biaya dan pesanan 0 dibuang','zero cost and order rows dropped')}`:''}`,entries,products,videos};
  }
  /* --- Laporan produk TikTok Seller Center (ekspor "exportsc_confirmed"):
     per produk per hari, kolom Periode Data + Produk + Klik Produk + Penjualan.
     Dipakai sebagai sumber Klik Produk + nilai (GMV) untuk channel Live GMV Max.
     Akun (SMO/SID/SMV/Affiliate) dipilih manual karena file hanya memuat User Id. --- */
  hi=findHeader(rows,['Periode Data','Produk','Klik Produk']);
  if(hi>=0){
    const H=H_at(hi);
    const cDate=colIdxOf(H,'Periode Data'),cProd=colIdxOf(H,'Produk'),
          cClk=colIdxOf(H,'Klik Produk'),cAtc=colIdxOf(H,'Tambah ke Keranjang'),
          cOrd=H.findIndex(h=>/^Pesanan\(Pesanan Dibuat\)/i.test(h)),
          cQty=H.findIndex(h=>/^Produk Terjual\(Pesanan Dibuat\)/i.test(h)),
          cVal=H.findIndex(h=>/^Penjualan\(Pesanan Dibuat\)/i.test(h));
    /* nilai memakai format Indonesia: titik = pemisah ribuan, koma = desimal */
    const idnum=v=>{if(v==null)return 0;const t=String(v).replace(/[Rp\s]/g,'').replace(/\./g,'').replace(/,/g,'.');const n=parseFloat(t);return isNaN(n)?0:n;};
    const byIso={};let skipped=0,rowsUsed=0;
    for(const r of rows.slice(hi+1)){
      const iso=anyDateToIso(r[cDate]);
      if(iso==null){if(String(r[cProd]||'').trim())skipped++;continue;}
      rowsUsed++;
      const o=byIso[iso]??={clicks:0};
      o.clicks+=idnum(r[cClk]);   /* hanya kolom Klik Produk yang diambil */
    }
    const isos=Object.keys(byIso).sort();
    if(isos.length){
      const entries=isos.map(iso=>({iso,metrics:byIso[iso]}));
      const totClk=sum(entries.map(e=>e.metrics.clicks));
      const dateStr=isos.length===1?isoLabelY(isos[0]):`${isoLabel(isos[0])} - ${isoLabelY(isos[isos.length-1])} (${isos.length} ${L('hari','days')})`;
      return {type:'sc_clicks',needsCh:true,defaultCh:'sp_live',liveOnly:true,clicksOnly:true,entries,
        label:`${L('Klik Produk Live (Seller Center)','Live Product Clicks (Seller Center)')} · ${fmtNC(totClk)} ${L('klik produk','product clicks')} · ${dateStr}`,
        hint:L('Hanya kolom Klik Produk yang diambil. Pilih channel Live yang sesuai (Shopee Live / Live GMV Max TikTok) sebelum Terapkan; file hanya memuat User Id sehingga akun tidak dikenali otomatis.','Only the Product Clicks column is taken. Choose the matching Live channel (Shopee Live / TikTok Live GMV Max) before Apply; the file only carries a User Id, so the account is not detected automatically.')};
    }
  }
  hi=findHeader(rows,['Nama panggilan','Klik Produk']);
  if(hi<0)hi=findHeader(rows,['Nama LIVE','Produk Klik']);
  if(hi<0)hi=findHeader(rows,['Produk Klik']);
  if(hi<0)hi=findHeader(rows,['Klik Produk']);
  if(hi>=0){
    const H=H_at(hi);
    const cClk=colIdxOf(H,'Klik Produk','Produk Klik'),
          cNick=colIdxOf(H,'Nama panggilan'),cName=colIdxOf(H,'Nama kampanye'),
          cWaktu=H.findIndex(h=>/Waktu Live|Waktu peluncuran/.test(h));
    const nickChannel=nick=>{
      const n=String(nick||'').toLowerCase();
      if(n.includes('official'))return 'tt_live_smo';
      if(n.includes('_id')||n.includes('sophiemartinid'))return 'tt_live_sid';
      if(n.includes('verse'))return 'tt_live_smv';
      return 'tt_live_aff';
    };
    const agg={};let skipped=0,unknown=0;
    for(const r of rows.slice(hi+1)){
      const iso=anyDateToIso(r[cWaktu]);
      if(iso==null){if((r||[]).some(v=>String(v||'').trim()))skipped++;continue;}
      let chId=cNick>=0?nickChannel(r[cNick]):null;
      if(!chId&&cName>=0)chId=liveChannelFromName(r[cName]);
      if(!chId){unknown++;continue;}
      const key=chId+'|'+iso;
      const o=agg[key]??={chId,iso,metrics:{clicks:0}};
      o.metrics.clicks+=plainnum(r[cClk])||0;
    }
    const entries=Object.values(agg);
    if(!entries.length)return {error:L('Tidak ada baris Produk Klik dengan tanggal valid.','No Product Click rows with valid dates.')};
    const perCh={};
    for(const e of entries){perCh[e.chId]=(perCh[e.chId]||0)+e.metrics.clicks;}
    const chSum=Object.entries(perCh).map(([k,v])=>`${(chName(k)||k).replace('Live GMV Max ','')} ${fmtNC(v)}`).join(' · ');
    return {type:'tt_liveclicks',label:`${L('Produk Klik Live TikTok','TikTok Live Product Clicks')} · ${chSum}${skipped?` · ${skipped} ${L('baris dilewati','rows skipped')}`:''}${unknown?` · ${unknown} ${L('akun tak dikenal','unknown accounts')}`:''}`,entries};
  }
  return {error:L('Format tidak dikenali. Didukung: CSV Shopee (Iklan CPC / Toko / SBA / Live), Meta CSV/XLSX (kolom Day), TikTok GMV Max (Live dan Product), Lazada Sponsored Max, Produk Klik Live.','Unrecognized format. Supported: Shopee CSV (CPC / Shop / SBA / Live Ads), Meta CSV/XLSX (Day column), TikTok GMV Max (Live and Product), Lazada Sponsored Max, Live Product Clicks.')};
}
const decodeXml=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&');
const colIdx=ref=>{let n=0;for(const ch of ref)n=n*26+(ch.charCodeAt(0)-64);return n-1;};
async function xlsxToRows(buf){
  const dv=new DataView(buf),u8=new Uint8Array(buf);
  let e=-1;
  for(let i=u8.length-22;i>=Math.max(0,u8.length-65558);i--){if(dv.getUint32(i,true)===0x06054b50){e=i;break;}}
  if(e<0)throw new Error('bukan file xlsx/zip');
  const cnt=dv.getUint16(e+10,true),cdOff=dv.getUint32(e+16,true);
  const files={};let p=cdOff;
  for(let i=0;i<cnt;i++){
    if(dv.getUint32(p,true)!==0x02014b50)break;
    const method=dv.getUint16(p+10,true),csize=dv.getUint32(p+20,true),
          nlen=dv.getUint16(p+28,true),elen=dv.getUint16(p+30,true),clen=dv.getUint16(p+32,true),
          lho=dv.getUint32(p+42,true);
    files[new TextDecoder().decode(u8.subarray(p+46,p+46+nlen))]={method,csize,lho};
    p+=46+nlen+elen+clen;
  }
  async function read(name){
    const f=files[name];if(!f)return null;
    const q=f.lho,nl=dv.getUint16(q+26,true),el=dv.getUint16(q+28,true);
    const data=u8.subarray(q+30+nl+el,q+30+nl+el+f.csize);
    if(f.method===0)return new TextDecoder().decode(data);
    if(typeof DecompressionStream==='undefined')throw new Error(L('Browser tidak mendukung baca XLSX. Simpan sebagai CSV terlebih dahulu.','This browser cannot read XLSX. Save as CSV first.'));
    const stream=new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return await new Response(stream).text();
  }
  const shared=[];
  const ss=await read('xl/sharedStrings.xml');
  if(ss)for(const m of ss.matchAll(/<si[ >][\s\S]*?<\/si>/g)){
    shared.push([...m[0].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(x=>decodeXml(x[1])).join(''));
  }
  const sheetName=Object.keys(files).find(n=>/^xl\/worksheets\/sheet1\.xml$/.test(n))||Object.keys(files).find(n=>/^xl\/worksheets\/sheet\d+\.xml$/.test(n));
  const sheet=await read(sheetName);
  if(!sheet)throw new Error('worksheet tidak ditemukan');
  const rows=[];
  for(const rm of sheet.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)){
    const row=[];
    for(const cm of rm[1].matchAll(/<c([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)){
      const attrs=cm[1],inner=cm[2]||'';
      const ref=/r="([A-Z]+)\d+"/.exec(attrs);
      const col=ref?colIdx(ref[1]):row.length;
      const t=(/t="([^"]+)"/.exec(attrs)||[])[1];
      let v='';
      const vm=/<v>([\s\S]*?)<\/v>/.exec(inner);
      if(t==='s'&&vm)v=shared[+vm[1]]??'';
      else if(t==='inlineStr'){const tm=/<t[^>]*>([\s\S]*?)<\/t>/.exec(inner);v=tm?decodeXml(tm[1]):'';}
      else if(vm)v=decodeXml(vm[1]);
      while(row.length<col)row.push('');
      row[col]=v;
    }
    rows.push(row);
  }
  return rows;
}
let PENDING=[];
const LS_P='smoAdsProducts', LS_V='smoAdsVideos', LS_PN='smoAdsProdNames';
let prodStore=store.get(LS_P,[]);
let vidStore=store.get(LS_V,[]);
let prodNames=store.get(LS_PN,{});
function mergeDetail(storeArr, incoming){
  const keys=new Set(incoming.map(r=>r.chId+'|'+r.iso));
  const kept=storeArr.filter(r=>!keys.has(r.chId+'|'+r.iso));
  return kept.concat(incoming);
}
function applyEntries(entries){
  let cells=0;
  for(const en of entries){
    if(!inData(en.iso))continue;
    overlay[en.chId]??={};
    for(const k in en.metrics){
      const v=en.metrics[k];
      if(v==null)continue;
      (overlay[en.chId][k]??={})[en.iso]=Math.round(v*100)/100;
      cells++;
    }
  }
  return cells;
}
/* =================== GENERATE KE GOOGLE SHEET =================== */
const MON_EN_FULL=['January','February','March','April','May','June','July','August','September','October','November','December'];
function mAgg(ids,metric,mk){ if(!RAW.months[mk])return null; return sum(seriesRange(ids,metric,isoOf(mk,1),isoOf(mk,mkDays(mk)))); }
const CELL={
  rp:v=>v==null?'':String(Math.round(v)),
  n:v=>v==null?'':String(Math.round(v)),
  pct:v=>v==null?'':v.toFixed(2)+'%',
  x:v=>v==null?'':v.toFixed(2),
  s:v=>v==null?'':String(v),
};
function sheetNameOf(mk){const y=mk.slice(0,4),m=+mk.slice(5,7)-1;
  return y==='2025'?MONTHS_ID[m]:MON_EN_FULL[m]+' '+y.slice(2);}
function genH(y){
  const mks=MONTH_KEYS.filter(k=>k.startsWith(y));
  const G=ids=>mk=>mAgg(ids,'gmv',mk), O=ids=>mk=>mAgg(ids,'orders',mk), K=ids=>mk=>mAgg(ids,'cost',mk);
  const IM=ids=>mk=>mAgg(ids,'impressions',mk), CL=ids=>mk=>mAgg(ids,'clicks',mk);
  const mp=key=>mk=>{const o=gmvMpOv[mk];return o&&o[key]?o[key]:null;};
  const mpAll=mk=>{const o=gmvMpOv[mk];if(o){const t=(o.tiktok||0)+(o.shopee||0)+(o.lazada||0);if(t)return t;}
    const M=MOM[y],m=+mk.slice(5,7)-1;return (M&&M.gmvAllMp[m])||null;};
  const pctOf=(f,g)=>mk=>{const a=f(mk),b=g(mk);return a!=null&&b?100*a/b:null;};
  const divOf=(f,g)=>mk=>{const a=f(mk),b=g(mk);return a!=null&&b?a/b:null;};
  return {mks,G,O,K,IM,CL,mp,mpAll,pctOf,divOf};
}
function buildMoM(y){
  const {mks,G,O,K,IM,CL,mp,mpAll,pctOf,divOf}=genH(y);
  const LIVE=GMVMAX_LIVE_IDS, META=['meta_cpas','meta_reg'], LAZ=['lz_store','lz_product'];
  const totG=G(SALES_IDS), totO=O(SALES_IDS), salesC=K(SALES_IDS);
  const allC=mk=>{const a=salesC(mk);return a==null?null:a+(mAgg(UPPER_IDS,'cost',mk)||0);};
  const imp=mk=>{const a=mAgg(SALES_IDS,'impressions',mk);return a==null?null:a+(mAgg(UPPER_IDS,'impressions',mk)||0);};
  const clk=mk=>{const a=mAgg(SALES_IDS,'clicks',mk);return a==null?null:a+(mAgg(UPPER_IDS,'clicks',mk)||0);};
  const rows=[
    ['GMV by Video','rp',G(['tt_vsa'])],
    ['GMV by Video NS','rp',G(['tt_vsa_ns'])],
    ['GMV by Product Card NS','rp',G(['tt_psa_ns'])],
    ['GMV by Product Card','rp',G(['tt_psa'])],
    ['GMV by Live Stream','rp',G(LIVE)],
    ['GMV by Meta CPAS','rp',G(META)],
    ['GMV by Live Shopee Ads','rp',G(['sp_live'])],
    ['GMV by SBA Shopee','rp',G(['sp_sba'])],
    ['GMV by Product Card Shopee','rp',G(['sp_pc'])],
    ['GMV by New Product Card Shopee','rp',G(['sp_pc_new'])],
    ['GMV by Ads Store','rp',G(['sp_store'])],
    ['GMV by Lazada Ads','rp',G(LAZ)],
    ['Total GMV From Ads','rp',totG],
    ['Ads Efficiency Rate','pct',pctOf(salesC,totG)],
    ['QTY Orders by Video','n',O(['tt_vsa'])],
    ['QTY Orders by Video NP','n',O(['tt_vsa_ns'])],
    ['QTY Orders by Product Card NP','n',O(['tt_psa_ns'])],
    ['QTY Orders by Product Card','n',O(['tt_psa'])],
    ['QTY Orders by Live Stream','n',O(LIVE)],
    ['QTY Orders by CPAS','n',O(META)],
    ['QTY Orders by Live Shopee Ads','n',O(['sp_live'])],
    ['QTY Orders by SBA Shopee Ads','n',O(['sp_sba'])],
    ['QTY by Product Card Shopee','n',O(['sp_pc'])],
    ['QTY by New Product Card Shopee','n',O(['sp_pc_new'])],
    ['QTY by Ads Store','n',O(['sp_store'])],
    ['QTY Orders by Lazada Ads','n',O(LAZ)],
    ['Total Orders From Ads','n',totO],
    ['Impression','n',imp],
    ['Product Clicks','n',clk],
    ['CTOR','pct',pctOf(totO,clk)],
    ['CTR','pct',pctOf(clk,imp)],
    ['Total GMV Bruto TikTok','rp',mp('tiktok')],
    ['Total GMV Shopee','rp',mp('shopee')],
    ['Total GMV Lazada','rp',mp('lazada')],
    ['Total GMV All MP','rp',mpAll],
    ['TikTok Ads Cost','rp',K(platIds('tiktok'))],
    ['Meta Ads Cost','rp',K(platIds('meta'))],
    ['Live Shopee Ads Cost','rp',K(['sp_live'])],
    ['SBA Shopee Ads Cost','rp',K(['sp_sba'])],
    ['Product Card Shopee Ads Cost','rp',K(['sp_pc','sp_pc_new'])],
    ['Ads Store Shopee Ads Cost','rp',K(['sp_store'])],
    ['Lazada Ads Cost','rp',K(LAZ)],
    ['Total Sales Ads Cost','rp',salesC],
    ['Total All Ads Cost','rp',allC],
    ['Cost Per Orders','rp',divOf(salesC,totO)],
    ['% Contribution by Video','pct',pctOf(G(['tt_vsa','tt_vsa_ns']),mpAll)],
    ['% Contribution by Product Card','pct',pctOf(G(['tt_psa','tt_psa_ns']),mpAll)],
    ['% Contribution by Live Streaming TikTok','pct',pctOf(G(LIVE),mpAll)],
    ['% Contribution by Meta CPAS','pct',pctOf(G(META),mpAll)],
    ['% Contribution by Live Streaming Shopee','pct',pctOf(G(['sp_live']),mpAll)],
    ['% Contribution by SBA Shopee','pct',pctOf(G(['sp_sba']),mpAll)],
    ['% Contribution by Lazada Ads','pct',pctOf(G(LAZ),mpAll)],
    ['% Total Ads Contribution','pct',pctOf(totG,mpAll)],
    ['AOV','rp',divOf(totG,totO)],
    ['ROI','x',divOf(totG,salesC)],
    ['ROAS','x',divOf(totG,allC)],
  ];
  return {name:'MoM '+y.slice(2),
    header:['Metrics',...mks.map(k=>MON_EN_FULL[+k.slice(5,7)-1])],
    body:rows.map(([lbl,t,f])=>[lbl,...mks.map(mk=>CELL[t](f(mk)))]),
    note:L('GMV by Meta CPAS mencakup Meta CPAS dan Meta Reguler. Baris GMV marketplace diambil dari input GMV Marketplace Bulanan di bawah (kosong bila belum diisi).','GMV by Meta CPAS includes Meta CPAS and Meta Regular. Marketplace GMV rows come from the Monthly Marketplace GMV input below (blank if not filled).')};
}
function buildBreakdown(y){
  const {mks,G,O,K,IM,CL,mp,mpAll,pctOf,divOf}=genH(y);
  const LIVE=GMVMAX_LIVE_IDS, META=['meta_cpas','meta_reg'], LAZ=['lz_store','lz_product'];
  const TT=platIds('tiktok'), SP=platIds('shopee');
  const ttU=platUpperIds('tiktok');
  const body=[];
  const sec=(plat,rows)=>{rows.forEach(([lbl,t,f],i)=>body.push([i===0?plat:'',lbl,...mks.map(mk=>f?CELL[t](f(mk)):'')]));body.push(['','']);};
  const ttImp=mk=>{const a=mAgg(TT,'impressions',mk);return a==null?null:a+(mAgg(ttU,'impressions',mk)||0);};
  sec('TikTok',[
    ['GMV by Video','rp',G(['tt_vsa'])],['GMV by Video NS','rp',G(['tt_vsa_ns'])],
    ['GMV by Product Card NS','rp',G(['tt_psa_ns'])],['GMV by Product Card','rp',G(['tt_psa'])],
    ['GMV by Live Stream SMO','rp',G(['tt_live_smo'])],['GMV by Live Stream SID','rp',G(['tt_live_sid'])],
    ['GMV by Live Stream SMV','rp',G(['tt_live_smv'])],['GMV by Live Stream Affiliate','rp',G(['tt_live_aff'])],
    ['Total GMV From Ads','rp',G(TT)],
    ['Ads Efficiency Rate','pct',pctOf(K(TT),G(TT))],
    ['QTY Orders by Video','n',O(['tt_vsa'])],['QTY Orders by Video NP','n',O(['tt_vsa_ns'])],
    ['QTY Orders by Product Card NP','n',O(['tt_psa_ns'])],['QTY Orders by Product Card','n',O(['tt_psa'])],
    ['QTY Orders by Live Stream SMO','n',O(['tt_live_smo'])],['QTY Orders by Live Stream SID','n',O(['tt_live_sid'])],
    ['QTY Orders by Live Stream SMV','n',O(['tt_live_smv'])],['QTY Orders by Live Stream Affiliate','n',O(['tt_live_aff'])],
    ['Total Orders From Ads','n',O(TT)],
    ['Total Order From TikTok','n',null],
    ['Impression','n',ttImp],
    ['Brand Consideration','n',CL(['tt_bc_ext'])],
    ['CTOR','pct',pctOf(O(TT),CL(TT))],
    ['CTR','pct',pctOf(CL(TT),ttImp)],
    ['Total GMV Bruto TikTok','rp',mp('tiktok')],
    ['Total Sales Ads Cost','rp',K(TT)],
    ['Cost Per Orders','rp',divOf(K(TT),O(TT))],
    ['% Contribution by Video','pct',pctOf(G(['tt_vsa','tt_vsa_ns']),mp('tiktok'))],
    ['% Contribution by Product Card','pct',pctOf(G(['tt_psa','tt_psa_ns']),mp('tiktok'))],
    ['% Contribution by Live Streaming TikTok','pct',pctOf(G(LIVE),mp('tiktok'))],
    ['% Total Contribution by GMV','pct',pctOf(G(TT),mp('tiktok'))],
    ['% Total Contribution by Order','pct',null],
    ['AOV','rp',divOf(G(TT),O(TT))],
    ['ROAS','x',divOf(G(TT),K(TT))],
  ]);
  sec('Shopee',[
    ['GMV by Live Shopee Ads','rp',G(['sp_live'])],['GMV by SBA Shopee','rp',G(['sp_sba'])],
    ['GMV by Product Card','rp',G(['sp_pc'])],['GMV by New Product Card','rp',G(['sp_pc_new'])],
    ['GMV by Ads Store','rp',G(['sp_store'])],
    ['Total GMV From Ads','rp',G(SP)],
    ['Ads Efficiency Rate','pct',pctOf(K(SP),G(SP))],
    ['QTY Orders by Live Shopee Ads','n',O(['sp_live'])],['QTY Orders by SBA Shopee Ads','n',O(['sp_sba'])],
    ['QTY Orders by New Product Card','n',O(['sp_pc_new'])],['QTY Orders by Product Card','n',O(['sp_pc'])],
    ['QTY Orders by Ads Store','n',O(['sp_store'])],
    ['Total Orders From Ads','n',O(SP)],
    ['Total Orders From Shopee','n',null],
    ['Impression','n',IM(SP)],
    ['Product Clicks','n',CL(SP)],
    ['CTOR','pct',pctOf(O(SP),CL(SP))],
    ['CTR','pct',pctOf(CL(SP),IM(SP))],
    ['Total GMV Shopee','rp',mp('shopee')],
    ['Total Sales Ads Cost','rp',K(SP)],
    ['Cost Per Orders','rp',divOf(K(SP),O(SP))],
    ['% Contribution by Live Streaming Shopee','pct',pctOf(G(['sp_live']),mp('shopee'))],
    ['% Contribution by SBA Shopee','pct',pctOf(G(['sp_sba']),mp('shopee'))],
    ['% Contribution by Product Card','pct',pctOf(G(['sp_pc','sp_pc_new']),mp('shopee'))],
    ['% Contribution by Ads Store','pct',pctOf(G(['sp_store']),mp('shopee'))],
    ['% Total Ads Contribution by GMV','pct',pctOf(G(SP),mp('shopee'))],
    ['% Total Ads Contribution by Order','pct',null],
    ['AOV','rp',divOf(G(SP),O(SP))],
    ['ROAS','x',divOf(G(SP),K(SP))],
  ]);
  sec('CPAS',[
    ['GMV by Meta CPAS','rp',G(META)],
    ['Total GMV From Ads','rp',G(META)],
    ['Ads Efficiency Rate','pct',pctOf(K(META),G(META))],
    ['QTY Orders by CPAS','n',O(META)],
    ['Total Orders From Ads','n',O(META)],
    ['Impression','n',IM(platAllIds('meta'))],
    ['Product Clicks','n',CL(platAllIds('meta'))],
    ['CTOR','pct',pctOf(O(META),CL(platAllIds('meta')))],
    ['CTR','pct',pctOf(CL(platAllIds('meta')),IM(platAllIds('meta')))],
    ['Total Sales Ads Cost','rp',K(META)],
    ['Cost Per Orders','rp',divOf(K(META),O(META))],
    ['AOV','rp',divOf(G(META),O(META))],
    ['ROAS','x',divOf(G(META),K(META))],
  ]);
  sec('Lazada',[
    ['GMV by Lazada Ads','rp',G(LAZ)],
    ['Total GMV From Ads','rp',G(LAZ)],
    ['Ads Efficiency Rate','pct',pctOf(K(LAZ),G(LAZ))],
    ['QTY Orders by Lazada Ads','n',O(LAZ)],
    ['Total Orders From Ads','n',O(LAZ)],
    ['Impression','n',IM(LAZ)],
    ['Product Clicks','n',CL(LAZ)],
    ['CTOR','pct',pctOf(O(LAZ),CL(LAZ))],
    ['CTR','pct',pctOf(CL(LAZ),IM(LAZ))],
    ['Total GMV Lazada','rp',mp('lazada')],
    ['Total Sales Ads Cost','rp',K(LAZ)],
    ['Cost Per Orders','rp',divOf(K(LAZ),O(LAZ))],
    ['AOV','rp',divOf(G(LAZ),O(LAZ))],
    ['ROAS','x',divOf(G(LAZ),K(LAZ))],
  ]);
  return {name:'MoM Breakdown - '+y.slice(2),
    header:['Platforms','Metrics / Months / Days',...mks.map(k=>MON_EN_FULL[+k.slice(5,7)-1])],
    body,
    note:L('Baris yang bergantung data marketplace (Total Order From TikTok, Total Orders From Shopee, GMV bruto) dibiarkan kosong atau diambil dari input GMV Marketplace Bulanan.','Rows that depend on marketplace data (Total Order From TikTok, Total Orders From Shopee, gross GMV) are left blank or taken from the Monthly Marketplace GMV input.')};
}
const SHEET_BLOCK={tt_live_smo:'LIVE SHOPPING ADS SMO',tt_live_sid:'LIVE SHOPPING ADS SID',tt_live_smv:'LIVE SHOPPING ADS SMV',tt_live_aff:'LIVE SHOPPING ADS Affiliate',
  tt_vsa:'VIDEO SHOPPING ADS',tt_vsa_ns:'VIDEO SHOPPING ADS NS',tt_psa:'Product Card Shopping Ads',tt_psa_ns:'Product Card Shopping NS',
  tt_ci_smv:'Community Interaction Sophie Martin Verse',
  tt_bc_ext:'Brand Consideration EXT',tt_aw_ext:'Awareness TikTok Ext',
  meta_cpas:'Meta CPAS - Shopee',meta_reg:'Meta Reguler',meta_aw:'Awareness CPAS',meta_traffic:'Traffic CPAS',
  sp_live:'LIVE SHOPEE ADS',sp_sba:'SBA Shopee',sp_pc:'Product Card Shopee',sp_pc_new:'Product Card Shopee (Produk Baru)',sp_store:'Ads Store',
  lz_store:'Lazada Ads Sponsore Max Store',lz_product:'Lazada Ads Sponsore Max Product'};
function buildMonthSheet(mk){
  const nd=mkDays(mk), ms=monthSeries(mk);
  const mAbbr=MONTHS_S[+mk.slice(5,7)-1];
  const days=Array.from({length:nd},(_,i)=>i+1);
  const header=['Tracker',...days.map(d=>d+' '+mAbbr),'Total'];
  const body=[];
  for(const c of CH_DEF){
    if(HIDDEN_CH.has(c.id))continue;
    const d=ms[c.id];if(!d)continue;
    const cost=d.cost||[],gmv=d.gmv||[],ord=d.orders||[];
    if(!sum(cost)&&!sum(gmv)&&!sum(d.clicks||[]))continue;
    body.push([SHEET_BLOCK[c.id]||chName(c.id)]);
    const row=(lbl,arr,t)=>body.push([lbl,...days.map((_,i)=>CELL[t](arr[i]??null)),CELL[t](sum(arr))]);
    if(sum(cost))row('Ads Cost',cost,'rp');
    if(sum(gmv)){
      body.push(['ROAS',...days.map((_,i)=>cost[i]?CELL.x((gmv[i]||0)/cost[i]):''),CELL.x(div(sum(gmv),sum(cost)))]);
      row('Purchases Conversion Value',gmv,'rp');
    }
    if(sum(ord))row('Orders From Ads',ord,'n');
    for(const [k,lbl] of [['liveViews','Live Views'],['impressions','Impressions'],['clicks','Product Clicks'],['reach','Reach'],['follows','Paid Follows'],['consideration','Consideration Size'],['atc','Add to Cart']]){
      if(d[k]&&sum(d[k]))row(lbl,d[k],'n');
    }
    const clkArr=d.clicks||[];
    if(sum(ord)&&sum(clkArr))
      body.push(['CTOR',...days.map((_,i)=>clkArr[i]?CELL.pct(100*(ord[i]||0)/clkArr[i]):''),CELL.pct(100*sum(ord)/sum(clkArr))]);
    if(sum(ord)){
      body.push(['Cost Per Purchase',...days.map((_,i)=>ord[i]?CELL.rp((cost[i]||0)/ord[i]):''),CELL.rp(div(sum(cost),sum(ord)))]);
      if(sum(gmv))body.push(['AOV',...days.map((_,i)=>ord[i]?CELL.rp((gmv[i]||0)/ord[i]):''),CELL.rp(div(sum(gmv),sum(ord)))]);
    }
    body.push(['']);
  }
  return {name:sheetNameOf(mk),header,body,
    note:L('Blok per channel mengikuti judul blok pada sheet bulanan. Tempel blok yang dibutuhkan ke area tracker channel terkait.','Channel blocks follow the monthly sheet block titles. Paste the blocks you need into the matching channel tracker area.')};
}
function genTsv(g){return [g.header,...g.body].map(r=>r.join('\t')).join('\n');}
/* ---- penulis XLSX mandiri (zip tanpa kompresi + format angka #,##0) ---- */
function crc32buf(u8){
  let T=crc32buf.T;
  if(!T){T=crc32buf.T=new Uint32Array(256);
    for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;T[n]=c>>>0;}}
  let crc=-1;
  for(let i=0;i<u8.length;i++)crc=T[(crc^u8[i])&0xFF]^(crc>>>8);
  return (crc^-1)>>>0;
}
function zipStore(files){
  const enc=new TextEncoder(),parts=[],cd=[];let off=0;
  for(const [name,text] of files){
    const n=enc.encode(name),data=enc.encode(text),crc=crc32buf(data);
    const lh=new DataView(new ArrayBuffer(30));
    lh.setUint32(0,0x04034b50,true);lh.setUint16(4,20,true);
    lh.setUint32(14,crc,true);lh.setUint32(18,data.length,true);lh.setUint32(22,data.length,true);
    lh.setUint16(26,n.length,true);
    parts.push(new Uint8Array(lh.buffer),n,data);
    const ch=new DataView(new ArrayBuffer(46));
    ch.setUint32(0,0x02014b50,true);ch.setUint16(4,20,true);ch.setUint16(6,20,true);
    ch.setUint32(16,crc,true);ch.setUint32(20,data.length,true);ch.setUint32(24,data.length,true);
    ch.setUint16(28,n.length,true);ch.setUint32(42,off,true);
    cd.push(new Uint8Array(ch.buffer),n);
    off+=30+n.length+data.length;
  }
  let cdLen=0;for(const c of cd)cdLen+=c.length;
  const eo=new DataView(new ArrayBuffer(22));
  eo.setUint32(0,0x06054b50,true);eo.setUint16(8,files.length,true);eo.setUint16(10,files.length,true);
  eo.setUint32(12,cdLen,true);eo.setUint32(16,off,true);
  return new Blob([...parts,...cd,new Uint8Array(eo.buffer)],
    {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
const colRef=i=>{let r='';i++;while(i>0){r=String.fromCharCode(65+(i-1)%26)+r;i=Math.floor((i-1)/26);}return r;};
const escXml=t=>String(t??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function xlsxFromGen(g){
  const rows=[g.header,...g.body];
  const rowXml=rows.map((r,ri)=>{
    const cells=r.map((v,ci)=>{
      v=String(v??'');
      if(v==='')return '';
      const ref=colRef(ci)+(ri+1);
      if(ri>0&&ci>0){
        if(/^-?\d+$/.test(v))return `<c r="${ref}" s="1"><v>${v}</v></c>`;
        if(/^-?\d+\.\d+$/.test(v))return `<c r="${ref}" s="2"><v>${v}</v></c>`;
        const mp=/^(-?\d+(?:\.\d+)?)%$/.exec(v);
        if(mp)return `<c r="${ref}" s="3"><v>${+mp[1]/100}</v></c>`;
      }
      return `<c r="${ref}" t="inlineStr"${ri===0?' s="4"':''}><is><t xml:space="preserve">${escXml(v)}</t></is></c>`;
    }).join('');
    return `<row r="${ri+1}">${cells}</row>`;
  }).join('');
  const sheetName=escXml(String(g.name).replace(/[\\\/\?\*\[\]:]/g,' ').slice(0,31));
  const files=[
    ['[Content_Types].xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'],
    ['_rels/.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
    ['xl/workbook.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${sheetName}" sheetId="1" r:id="rId1"/></sheets></workbook>`],
    ['xl/_rels/workbook.xml.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'],
    ['xl/styles.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="2"><numFmt numFmtId="164" formatCode="#,##0"/><numFmt numFmtId="165" formatCode="#,##0.00"/></numFmts><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="5"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" applyNumberFormat="1"/><xf numFmtId="165" fontId="0" fillId="0" borderId="0" applyNumberFormat="1"/><xf numFmtId="10" fontId="0" fillId="0" borderId="0" applyNumberFormat="1"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyFont="1"/></cellXfs></styleSheet>'],
    ['xl/worksheets/sheet1.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${rowXml}</sheetData></worksheet>`],
  ];
  return zipStore(files);
}
/* tampilan angka pada pratinjau generate: pakai pemisah ribuan sesuai bahasa */
function fmtPrevCell(v){
  v=String(v??'');
  if(/^-?\d+$/.test(v))return nf0.format(+v);
  if(/^-?\d+\.\d+$/.test(v))return nf2.format(+v);
  return v;
}
function genCsvText(g){const esc2=c=>{c=String(c??'');return /[",\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c;};
  return [g.header,...g.body].map(r=>r.map(esc2).join(',')).join('\n');}
async function copyTsv(t){
  try{await navigator.clipboard.writeText(t);return true;}
  catch(e){
    try{const ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.opacity='0';
      document.body.appendChild(ta);ta.focus();ta.select();
      const ok=document.execCommand('copy');ta.remove();return ok;
    }catch(e2){return false;}
  }
}

function renderUpload(){
  const ovEntries=[];
  for(const cid in overlay)for(const m in overlay[cid])for(const iso in overlay[cid][m])
    ovEntries.push({cid,m,iso,v:overlay[cid][m][iso]});
  const dmin=FIRST_ISO,dmax=isoOf(LATEST,mkDays(LATEST));
  view.innerHTML=`
  <h2 class="sec">${L('Unggah Data','Upload Data')}</h2>
  <div class="card">
    <div class="drop" id="drop">
      <b>${L('Tarik dan letakkan file di sini, atau klik untuk memilih','Drag and drop files here, or click to choose')}</b>
      <small>CSV / XLSX · ${L('boleh banyak file sekaligus','multiple files at once allowed')} · Shopee (Iklan CPC, Iklan Toko, SBA, Live), Meta (Sales & Awareness), TikTok GMV Max (Product & Live), ${L('Produk Klik Live','Live Product Clicks')}</small>
      <input type="file" id="fileIn" multiple accept=".csv,.txt,.xlsx" style="display:none">
    </div>
    <div id="fileList"></div>
    <div id="applyBar" style="display:none;margin-top:12px">
      <button class="btn" id="applyAll">${L('Terapkan semua ke database','Apply all to the database')}</button>
      <span class="note" style="margin-left:8px">${L('Data masuk sebagai overlay di browser. Data dasar sheet tidak berubah.','Data is stored as an overlay in the browser. The base sheet data is unchanged.')}</span>
    </div>
  </div>
  <div class="card" style="margin-top:12px">
    <h3>${L('Generate ke Google Sheet','Generate to Google Sheet')}</h3>
    <p class="note" style="margin:0 0 10px">${L('Pilih target, tekan Generate, lalu Salin dan tempel ke tab terkait pada Google Sheet (atau unduh CSV). Struktur baris dan metrik mengikuti sheet Anda; angka dari database dashboard (data dasar ditambah unggahan).','Choose a target, press Generate, then Copy and paste into the matching Google Sheet tab (or download the CSV). Rows and metrics follow your sheet structure; figures come from the dashboard database (base data plus uploads).')}</p>
    <div class="controls" style="margin:0">
      <div class="seg" id="genSeg">
        <button data-g="mom" class="on">MoM ${LATEST.slice(2,4)}</button>
        <button data-g="bd">MoM Breakdown - ${LATEST.slice(2,4)}</button>
        <button data-g="month">${sheetNameOf(LATEST)}</button>
      </div>
      <button class="btn" id="genGo">Generate</button>
      <span style="flex:1"></span>
      <button class="btn ghost" id="genCopy" disabled>${L('Salin untuk sheet','Copy for sheet')}</button>
      <button class="btn ghost" id="genCsv" disabled>${L('Unduh Excel','Download Excel')}</button>
    </div>
    <div id="genPrev"></div>
  </div>
  <div class="grid g-2" style="margin-top:12px">
    <div class="card">
      <h3>${L('Input Manual','Manual Input')}</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <label>Channel<br><select id="mCh" style="width:100%">${dailyOptions(false)}</select></label>
        <label>${L('Metrik','Metric')}<br><select id="mMetric" style="width:100%">
          <option value="clicks">${L('Klik Produk','Product Clicks')}</option><option value="cost">${L('Biaya Iklan (Rp)','Ads Cost (Rp)')}</option>
          <option value="gmv">GMV (Rp)</option><option value="orders">${L('Pesanan','Orders')}</option>
          <option value="impressions">${L('Impresi','Impressions')}</option><option value="liveViews">${L('Penayangan Live','Live Views')}</option>
        </select></label>
        <label>${L('Dari tanggal','From date')}<br><input type="date" id="mD1" style="width:100%" min="${dmin}" max="${dmax}" value="${LATEST_LAST_ISO()}"></label>
        <label>${L('Sampai tanggal','To date')}<br><input type="date" id="mD2" style="width:100%" min="${dmin}" max="${dmax}" value="${LATEST_LAST_ISO()}"></label>
      </div>
      <div style="margin-top:10px"><button class="btn ghost" id="mBuild">${L('Buat tabel input →','Build input table →')}</button></div>
      <div id="mGrid" style="margin-top:10px"></div>
    </div>
    <div class="card">
      <h3>${L('Overlay aktif','Active overlay')}</h3>
      ${ovEntries.length?`<div class="tbl-wrap" style="border:0;max-height:240px;overflow:auto"><table><thead><tr><th>Channel</th><th>${L('Metrik','Metric')}</th><th>${L('Tanggal','Date')}</th><th>${L('Nilai','Value')}</th></tr></thead>
        <tbody>${ovEntries.sort((a,b)=>a.cid.localeCompare(b.cid)||a.iso.localeCompare(b.iso)).slice(0,300).map(e=>`<tr><td>${esc(chName(e.cid)||e.cid)}</td><td>${e.m}</td><td class="num">${isoLabelY(e.iso)}</td><td class="num">${['cost','gmv','atcValue'].includes(e.m)?fmtRp(e.v):fmtN(e.v)}</td></tr>`).join('')}</tbody></table></div>`:
        `<div class="empty">${L('Belum ada data unggahan. Dashboard memakai data dasar dari Google Sheet.','No uploaded data yet. The dashboard uses the base data from the Google Sheet.')}</div>`}
      <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn" id="expTeam">⬇ ${L('Ekspor HTML untuk tim','Export HTML for the team')}</button>
        <button class="btn ghost" id="expJson">${L('Ekspor JSON','Export JSON')}</button>
        ${ovEntries.length?`<button class="btn ghost" id="clrOv" style="color:var(--critical)">${L('Hapus semua','Delete all')}</button>`:''}
      </div>
      <p class="note" style="margin-top:8px">${L('Alur satu operator: Anda mengunggah semua data di perangkat ini, lalu tekan Ekspor HTML untuk tim. File yang dihasilkan sudah memuat seluruh data upload, jadi tim cukup membukanya untuk melihat angka yang sama tanpa perlu server.','One operator workflow: you upload all data on this device, then press Export HTML for the team. The generated file already contains all uploaded data, so the team just opens it to see the same figures with no server needed.')}</p>
    </div>
  </div>
  <div class="card" style="margin-top:12px">
    <h3>${L('Sumber Data per Bulan','Data Source per Month')}</h3>
    <p class="note" style="margin:0 0 10px">${L('Unggahan bekerja secara replace per channel per tanggal. Mengunggah ulang periode yang sama menimpa, bukan menambah, sehingga umumnya tidak dobel. Jika ingin satu bulan sepenuhnya dari unggahan, kosongkan data dasar sheet untuk bulan itu. Dapat diaktifkan kembali kapan saja, data sheet tidak hilang.','Uploads replace per channel per date. Re-uploading the same period overwrites rather than adds, so duplicates are unlikely. To make a month fully upload based, blank the base sheet data for that month. It can be re-enabled at any time; sheet data is not lost.')}</p>
    <div class="controls" style="margin:0">
      <span id="maskPick"></span>
      <button class="btn ghost" id="maskToggle"></button>
      <span style="flex:1"></span>
      <button class="btn ghost" id="clrMonth" style="color:var(--critical)">${L('Hapus data unggahan bulan terpilih','Delete uploads for the selected month')}</button>
    </div>
    <div style="margin-top:14px;border-top:1px solid var(--grid);padding-top:12px">
      <h3 style="margin-bottom:6px">${L('GMV Marketplace Bulanan','Monthly Marketplace GMV')}</h3>
      <div class="controls" style="margin:0">
        <span id="gmvPick"></span>
        <label>TikTok</label><input type="number" id="gmvTt" style="width:130px" placeholder="Rp">
        <label>Shopee</label><input type="number" id="gmvSp" style="width:130px" placeholder="Rp">
        <label>Lazada</label><input type="number" id="gmvLz" style="width:130px" placeholder="Rp">
        <button class="btn ghost" id="gmvSave">${L('Simpan','Save')}</button>
      </div>
    </div>
    <div id="maskList" style="margin-top:8px">${Object.keys(maskMonths).filter(k=>maskMonths[k]).length?
      L('Bulan yang dikosongkan (hanya memakai unggahan): ','Blanked months (uploads only): ')+Object.keys(maskMonths).filter(k=>maskMonths[k]).sort().map(mk=>`<span class="pill-stat mid" style="margin-right:6px">${mkLabel(mk)}</span>`).join(''):
      `<span class="note">${L('Tidak ada bulan yang dikosongkan. Semua bulan memakai data sheet ditambah unggahan.','No blanked months. All months use sheet data plus uploads.')}</span>`}</div>
  </div>
  <details style="margin-top:14px"><summary style="cursor:pointer;font-weight:650;font-size:13px">${L('Aturan pemetaan otomatis','Automatic mapping rules')}</summary>
  <div class="card" style="margin-top:8px"><div class="tbl-wrap" style="border:0"><table>
    <thead><tr><th style="text-align:left">File</th><th style="text-align:left">${L('Dikenali dari','Recognized by')}</th><th style="text-align:left">${L('Masuk ke channel','Routed to channel')}</th></tr></thead><tbody>
    <tr><td style="text-align:left">Shopee Iklan CPC <span style="color:var(--muted)">(${L('1 file: produk + produk baru','1 file: product + new product')})</span></td><td style="text-align:left">"Semua Laporan Iklan CPC" + ${L('baris Periode','Periode row')}</td><td style="text-align:left">${L('Per baris via kolom Mode Bidding: mengandung "Tahap 1: GMV Max Auto" → Iklan Produk Baru, selainnya → Iklan Produk; tanggal dari baris Periode','Per row via the Mode Bidding column: containing "Tahap 1: GMV Max Auto" → New Product Ads, otherwise → Product Ads; date from the Periode row')}</td></tr>
    <tr><td style="text-align:left">Shopee Iklan Toko / SBA / Live</td><td style="text-align:left">${L('Judul laporan','Report title')}</td><td style="text-align:left">${L('Iklan Toko / SBA / Iklan Live Shopee','Shopee Shop Ads / SBA / Live Ads')}</td></tr>
    <tr><td style="text-align:left">Meta (CSV/XLSX)</td><td style="text-align:left">${L('Kolom Campaign name + Day, plus nama file','Campaign name + Day columns, plus file name')}</td><td style="text-align:left">${L('Nama file mengandung "CPAS" → Meta CPAS · "REGULER" → Meta Reguler; tanpa penanda: ada kolom Purchases → CPAS, tanpa → Awareness. Channel tetap bisa diganti sebelum Terapkan.','File name containing "CPAS" → Meta CPAS · "REGULER" → Meta Regular; without a marker: Purchases column present → CPAS, absent → Awareness. The channel can still be changed before Apply.')}</td></tr>
    <tr><td style="text-align:left">TikTok Live GMV Max</td><td style="text-align:left">${L('Nama kampanye + Waktu peluncuran','Campaign name + Launch time')}</td><td style="text-align:left">"SMO" → Live SMO · "SID" → Live SID · "affiliate" → Live Affiliate · "SMV" → Live SMV</td></tr>
    <tr><td style="text-align:left">TikTok Product GMV Max</td><td style="text-align:left">${L('Nama kampanye + Jenis materi iklan + tanggal','Campaign name + Creative type + date')}</td><td style="text-align:left">${L('Jenis Video → Video Shopping Ads · Jenis Kartu Produk → Product Card Shopping Ads · nama kampanye mengandung "New" → varian NS · baris dengan Biaya 0 dan Pesanan 0 dibuang otomatis','Video type → Video Shopping Ads · Product Card type → Product Card Shopping Ads · campaign name containing "New" → NS variant · rows with zero cost and zero orders are dropped automatically')}</td></tr>
    <tr><td style="text-align:left">${L('Kamus Produk TikTok','TikTok Product Dictionary')}</td><td style="text-align:left">${L('Kolom ID produk + Nama produk (tanpa kolom biaya)','Product ID + Product name columns (no cost column)')}</td><td style="text-align:left">${L('Memberi nama semua "Produk ID" di tab Produk, berlaku surut tanpa unggah ulang; bisa juga klik ✎ pada tabel produk untuk memberi nama manual','Names all "Produk ID" entries in the Products tab retroactively without re-upload; you can also click ✎ in the product table to name manually')}</td></tr>
    <tr><td style="text-align:left">Lazada Sponsored Max (XLSX/CSV)</td><td style="text-align:left">${L('Kolom Tanggal + Tipe Campaign + Pengeluaran','Tanggal + Tipe Campaign + Pengeluaran columns')}</td><td style="text-align:left">${L('Tipe Sponsored Max Store → Max Store · Sponsored Max Product → Max Product; per hari otomatis','Sponsored Max Store type → Max Store · Sponsored Max Product → Max Product; per day automatically')}</td></tr>
    <tr><td style="text-align:left">${L('Produk Klik Live TikTok','TikTok Live Product Clicks')}</td><td style="text-align:left">${L('Kolom "Klik Produk" + "Nama panggilan" + "Waktu Live"','"Klik Produk" + "Nama panggilan" + "Waktu Live" columns')}</td><td style="text-align:left">sophiemartinofficial → Live SMO · sophiemartin_id → Live SID · sophiemartin.verse → Live SMV · ${L('akun lain','other accounts')} → Live Affiliate</td></tr>
  </tbody></table></div></div></details>`;
  const drop=document.getElementById('drop'),fin=document.getElementById('fileIn');
  drop.onclick=()=>fin.click();
  drop.ondragover=e=>{e.preventDefault();drop.classList.add('on');};
  drop.ondragleave=()=>drop.classList.remove('on');
  drop.ondrop=e=>{e.preventDefault();drop.classList.remove('on');handleFiles(e.dataTransfer.files);};
  fin.onchange=()=>handleFiles(fin.files);
  renderFileList();
  async function handleFiles(fileList){
    for(const f of fileList){
      const item={name:f.name,status:'proses…'};
      PENDING.push(item);
      try{
        let rows;
        if(/\.xlsx$/i.test(f.name))rows=await xlsxToRows(await f.arrayBuffer());
        else rows=csvParse(await f.text());
        const res=detectRows(rows,f.name);
        Object.assign(item,res);
        if(res.needsCh)item.chId=res.defaultCh;
        if(!res.error&&!res.mapping){
          const hv=harvestProdNames(rows);
          if(hv){item.harvest=hv;item.label=(item.label||'')+` · +${Object.keys(hv).length} ${L('nama produk terdeteksi','product names detected')}`;}
        }
      }catch(err){item.error=L('Gagal membaca file: ','Failed to read file: ')+(err.message||err);}
      renderFileList();
    }
  }
  function renderFileList(){
    const el=document.getElementById('fileList');
    if(!el)return;
    el.innerHTML=PENDING.map((f,i)=>{
      if(f.error)return `<div class="file-row err"><span class="fname">${esc(f.name)}</span><span class="fsum" style="color:var(--critical)">${esc(f.error)}</span><button class="del" data-i="${i}">✕</button></div>`;
      const chList=f.liveOnly?CH_DEF.filter(c=>['sp_live','tt_live_smo','tt_live_sid','tt_live_smv','tt_live_aff'].includes(c.id)):CH_DEF;
      const chSel=f.needsCh?`<select data-ch="${i}">${chList.map(c=>`<option value="${c.id}" ${c.id===f.chId?'selected':''}>${PLATFORMS[c.platform].name} · ${esc(chName(c.id))}</option>`).join('')}</select>`:'';
      const dateSel=f.needsDate?`<input type="date" data-dt="${i}" value="${f.date||''}" min="${dmin}" max="${dmax}">`:'';
      let sums='';
      if(f.single)sums=`${fmtRpC(f.single.cost||0)} spend · ${fmtRpC(f.single.gmv||0)} ${L('omzet','revenue')} · ${fmtN(f.single.orders||0)} ${L('pesanan','orders')}`;
      else if(f.entries){
        const tc=sum(f.entries.map(e=>e.metrics.cost||0)),tg=sum(f.entries.map(e=>e.metrics.gmv||0)),tk=sum(f.entries.map(e=>e.metrics.clicks||0));
        sums=(f.clicksOnly||(!tc&&!tg))?`${fmtNC(tk)} ${L('klik produk','product clicks')}`:`${fmtRpC(tc)} spend · ${fmtRpC(tg)} GMV · ${fmtNC(tk)} ${L('klik','clicks')}`;
      }
      return `<div class="file-row">
        <span class="fname" title="${esc(f.name)}">${esc(f.name)}</span>
        <span class="ftype">${esc((f.label||'').split(' · ')[0])}</span>
        <span class="fsum">${esc((f.label||'').split(' · ').slice(1).join(' · '))}${sums?' — '+sums:''}</span>
        ${chSel}${dateSel}
        <button class="del" data-i="${i}" title="${L('Hapus dari antrean','Remove from queue')}">✕</button>
        ${f.hint?`<div style="flex-basis:100%;font-size:11.5px;color:var(--muted)">💡 ${esc(f.hint)}</div>`:''}</div>`;
    }).join('');
    document.getElementById('applyBar').style.display=PENDING.some(f=>!f.error)?'':'none';
    el.querySelectorAll('.del').forEach(b=>b.onclick=()=>{PENDING.splice(+b.dataset.i,1);renderFileList();});
    el.querySelectorAll('select[data-ch]').forEach(s=>s.onchange=()=>{PENDING[+s.dataset.ch].chId=s.value;});
    el.querySelectorAll('input[data-dt]').forEach(s=>s.onchange=()=>{PENDING[+s.dataset.dt].date=inData(s.value)?s.value:null;});
  }
  document.getElementById('applyAll').onclick=()=>{
    let cells=0,applied=false,problems=[];
    for(const f of PENDING){
      if(f.error)continue;
      if(f.mapping){prodNames=Object.assign({},prodNames,f.mapping);applied=true;continue;}
      if(f.harvest){prodNames=Object.assign({},prodNames,f.harvest);applied=true;}
      if(f.entries){
        const ent=f.needsCh&&f.chId? f.entries.map(e=>({...e,chId:f.chId})) : f.entries;
        cells+=applyEntries(ent);
      }
      else if(f.entriesNoDate){
        if(!f.date){problems.push(f.name+L(': tanggal belum diisi',': date not set'));continue;}
        cells+=applyEntries(f.entriesNoDate.map(e=>({...e,iso:f.date})));
      }
      else if(f.single){
        if(!f.date){problems.push(f.name+L(': tanggal belum diisi',': date not set'));continue;}
        cells+=applyEntries([{chId:f.chId,iso:f.date,metrics:f.single}]);
      }
      if(f.products&&f.products.length){
        const iso=f.date, chId=f.chId;
        const inc=f.products.map(p=>({...p,chId:p.chId||chId,iso:p.iso||iso,code:p.code||'',
            qty:p.qty||0,val:p.val||0,cost:p.cost||0,imp:p.imp||0,clk:p.clk||0,ord:p.ord||0}))
          .filter(p=>p.chId&&p.iso&&inData(p.iso));
        if(inc.length)prodStore=mergeDetail(prodStore,inc);
      }
      if(f.videos&&f.videos.length){
        const iso=f.date;
        const inc=f.videos.map(v=>({...v,iso:v.iso||iso})).filter(v=>v.iso&&inData(v.iso));
        if(inc.length)vidStore=mergeDetail(vidStore,inc);
      }
    }
    if(problems.length){uiToast(L('Sebagian file belum lengkap: ','Some files are incomplete: ')+problems.join(' · '));return;}
    if(!cells&&!applied)return;
    store.set(LS_O,overlay);store.set(LS_P,prodStore);store.set(LS_V,vidStore);store.set(LS_PN,prodNames);
    PENDING=[];location.reload();
  };
  /* Generate ke Google Sheet */
  let genTarget='mom', genData=null;
  document.querySelectorAll('#genSeg button').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('#genSeg button').forEach(x=>x.classList.toggle('on',x===b));
    genTarget=b.dataset.g;
  });
  document.getElementById('genGo').onclick=()=>{
    const y=LATEST.slice(0,4);
    genData=genTarget==='mom'?buildMoM(y):genTarget==='bd'?buildBreakdown(y):buildMonthSheet(LATEST);
    const prev=document.getElementById('genPrev');
    const maxR=60;
    prev.innerHTML=`
      <p class="note" style="margin:10px 0 6px"><b>${L('Target tab','Target tab')}: ${esc(genData.name)}</b> · ${genData.body.length} ${L('baris','rows')}${genData.note?'<br>'+esc(genData.note):''}</p>
      <div class="gen-prev"><table><thead><tr>${genData.header.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead>
      <tbody>${genData.body.slice(0,maxR).map(r=>`<tr>${genData.header.map((_,i)=>`<td class="${i?'num':''}" style="${i?'':'text-align:left'}">${esc(i?fmtPrevCell(r[i]):(r[i]??''))}</td>`).join('')}</tr>`).join('')}
      ${genData.body.length>maxR?`<tr><td colspan="${genData.header.length}" class="empty">… ${genData.body.length-maxR} ${L('baris lagi (lengkap saat disalin / diunduh)','more rows (complete when copied / downloaded)')}</td></tr>`:''}</tbody></table></div>`;
    document.getElementById('genCopy').disabled=false;
    document.getElementById('genCsv').disabled=false;
  };
  document.getElementById('genCopy').onclick=async()=>{
    if(!genData)return;
    const ok=await copyTsv(genTsv(genData));
    uiToast(ok?L('Tersalin. Buka tab "'+genData.name+'" di Google Sheet, pilih sel awal, lalu tempel (Ctrl+V).','Copied. Open the "'+genData.name+'" tab in Google Sheets, select the starting cell, then paste (Ctrl+V).')
      :L('Salin diblokir browser. Gunakan Unduh CSV.','Copying was blocked by the browser. Use Download CSV.'));
  };
  document.getElementById('genCsv').onclick=async()=>{
    if(!genData)return;
    if(IN_ARTIFACT){
      const ok=await copyTsv(genTsv(genData));
      uiToast(ok?L('Unduhan diblokir di artifact; tabel disalin ke clipboard, tempel langsung ke Google Sheet.','Downloads are blocked on the artifact; the table was copied to the clipboard, paste it straight into Google Sheets.')
        :L('Unduhan dan clipboard diblokir. Gunakan file HTML mandiri.','Both download and clipboard are blocked. Use the standalone HTML file.'));
      return;
    }
    const a=document.createElement('a');
    a.href=URL.createObjectURL(xlsxFromGen(genData));
    a.download=genData.name.replace(/\s+/g,'_')+'.xlsx';a.click();
    uiToast(L('File Excel diunduh dengan format pemisah ribuan.','Excel file downloaded with thousand separator formatting.'));
  };
  document.getElementById('mBuild').onclick=()=>{
    const d1=document.getElementById('mD1').value,d2=document.getElementById('mD2').value;
    if(!inData(d1)||!inData(d2)||d2<d1){uiToast(L('Rentang tanggal tidak valid.','Invalid date range.'));return;}
    if(isoDiff(d1,d2)+1>31){uiToast(L('Maksimal 31 hari sekali input.','Maximum 31 days per input.'));return;}
    const seq=isoSeq(d1,d2);
    const grid=document.getElementById('mGrid');
    grid.innerHTML=`
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;flex-wrap:wrap">
        <span style="font-size:12px;color:var(--ink-2)">${L('Isi nilai per tanggal (kosongkan tanggal tanpa data):','Fill values per date (leave dates without data empty):')}</span>
        <span style="margin-left:auto;display:inline-flex;gap:6px;align-items:center">
          <input type="number" id="mFillVal" placeholder="${L('nilai','value')}" style="width:90px;padding:5px 8px;font-size:12px">
          <button class="btn ghost" id="mFillAll" style="padding:5px 10px;font-size:12px">${L('Isi semua','Fill all')}</button>
        </span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:7px">
        ${seq.map(iso=>`<label style="font-size:11px;color:var(--muted)">${isoLabel(iso)}<br>
          <input type="number" data-iso="${iso}" class="mDay" style="width:100%;padding:6px 8px;font-size:12.5px"></label>`).join('')}
      </div>
      <div style="margin-top:10px"><button class="btn" id="mSave">${L('Simpan','Save')} ${seq.length} ${L('hari','days')}</button></div>`;
    document.getElementById('mFillAll').onclick=()=>{
      const v=document.getElementById('mFillVal').value;
      if(v==='')return;
      grid.querySelectorAll('input.mDay').forEach(inp=>inp.value=v);
    };
    document.getElementById('mSave').onclick=()=>{
      const cid=document.getElementById('mCh').value,metric=document.getElementById('mMetric').value;
      const entries=[];
      grid.querySelectorAll('input.mDay').forEach(inp=>{
        if(inp.value!=='')entries.push({chId:cid,iso:inp.dataset.iso,metrics:{[metric]:parseFloat(inp.value)}});
      });
      if(!entries.length){uiToast(L('Belum ada nilai yang diisi.','No values entered yet.'));return;}
      applyEntries(entries);
      store.set(LS_O,overlay);location.reload();
    };
  };
  document.getElementById('expTeam').onclick=async()=>{
    if(IN_ARTIFACT){
      const ok=await copyTsv(JSON.stringify(currentBake()));
      await uiAlert(L('Unduhan diblokir di halaman artifact','Downloads are blocked on the artifact page'),
        ok?L('Sebagai gantinya, seluruh data unggahan Anda sudah DISALIN ke clipboard. Buka chat Claude, tempel (Cmd+V / Ctrl+V), lalu tulis "update untuk tim". Claude akan memasukkan data ini dan menerbitkan ulang artifact untuk semua orang. Unduhan file hanya tersedia bila dashboard dibuka sebagai file HTML biasa.','Instead, all of your uploaded data has been COPIED to the clipboard. Open the Claude chat, paste (Cmd+V / Ctrl+V), then write "update for the team". Claude will merge this data and republish the artifact for everyone. File downloads are only available when the dashboard is opened as a regular HTML file.')
          :L('Penyalinan ke clipboard juga ditolak browser. Gunakan file HTML mandiri (bukan artifact) untuk melakukan ekspor.','Clipboard copy was also refused by the browser. Use the standalone HTML file (not the artifact) to export.'),
        'OK');
      return;
    }
    exportTeamHtml();
    uiToast(L('File HTML diunduh. Bagikan ke tim lewat WhatsApp, email, atau Google Drive.','HTML file downloaded. Share it with your team via WhatsApp, email, or Google Drive.'));
  };
  document.getElementById('expJson').onclick=async()=>{
    const out={meta:RAW.meta,exportedAt:new Date().toISOString(),
      months:Object.fromEntries(MONTH_KEYS.map(mk=>[mk,{days:mkDays(mk),series:monthSeries(mk)}]))};
    if(IN_ARTIFACT){
      const ok=await copyTsv(JSON.stringify(out));
      uiToast(ok?L('Unduhan diblokir di artifact; JSON disalin ke clipboard.','Downloads are blocked on the artifact; JSON copied to the clipboard.')
        :L('Unduhan dan clipboard diblokir. Gunakan file HTML mandiri.','Both download and clipboard are blocked. Use the standalone HTML file.'));
      return;
    }
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([JSON.stringify(out)],{type:'application/json'}));
    a.download='ads-database-2025-2026.json';a.click();
  };
  const clr=document.getElementById('clrOv');
  if(clr)clr.onclick=async()=>{if(await uiConfirm(L('Hapus semua data unggahan?','Delete all uploaded data?'),
    L('Overlay, produk, dan video akan dihapus. Dashboard kembali ke data dasar sheet.','Overlay, products, and videos will be removed. The dashboard returns to the base sheet data.'),
    L('Hapus','Delete'),L('Batal','Cancel'))){
    overlay={};prodStore=[];vidStore=[];
    store.set(LS_O,overlay);store.set(LS_P,prodStore);store.set(LS_V,vidStore);location.reload();}};
  let maskMk=LATEST;
  const maskBtn=document.getElementById('maskToggle');
  const syncMaskBtn=()=>{maskBtn.textContent=maskMonths[maskMk]?
    L('Aktifkan kembali data sheet ','Re-enable sheet data ')+mkLabelS(maskMk):
    L('Kosongkan data dasar ','Blank base data ')+mkLabelS(maskMk)+L(' (pakai unggahan saja)',' (uploads only)');};
  const drawMaskPick=()=>{const el=document.getElementById('maskPick');el.innerHTML='';
    monthPicker(el,{value:maskMk,onApply:v=>{maskMk=v;drawMaskPick();syncMaskBtn();}});};
  drawMaskPick();syncMaskBtn();
  maskBtn.onclick=async()=>{
    const mk=maskMk;
    if(maskMonths[mk]){delete maskMonths[mk];}
    else{
      if(!await uiConfirm(L('Kosongkan data dasar ','Blank base data ')+mkLabel(mk)+'?',
        L('Angka dari Google Sheet untuk bulan ini akan disembunyikan; dashboard hanya memakai data yang Anda unggah. Dapat dibalik kapan saja.','This month\'s Google Sheet figures will be hidden; the dashboard will only use your uploads. Reversible at any time.'),
        L('Kosongkan','Blank'),L('Batal','Cancel')))return;
      maskMonths[mk]=true;
    }
    store.set(LS_MASK,maskMonths);location.reload();
  };
  let gmvSelMk=LATEST;
  const syncGmv=()=>{const o=gmvMpOv[gmvSelMk]||{};
    document.getElementById('gmvTt').value=o.tiktok??'';
    document.getElementById('gmvSp').value=o.shopee??'';
    document.getElementById('gmvLz').value=o.lazada??'';};
  const drawGmvPick=()=>{const el=document.getElementById('gmvPick');el.innerHTML='';
    monthPicker(el,{value:gmvSelMk,onApply:v=>{gmvSelMk=v;drawGmvPick();syncGmv();}});};
  drawGmvPick();syncGmv();
  document.getElementById('gmvSave').onclick=()=>{
    const g=id=>{const v=document.getElementById(id).value;return v===''?0:(parseFloat(v)||0);};
    gmvMpOv[gmvSelMk]={tiktok:g('gmvTt'),shopee:g('gmvSp'),lazada:g('gmvLz')};
    store.set(LS_GMVMP,gmvMpOv);
    uiToast(L('GMV marketplace ','Marketplace GMV for ')+mkLabel(gmvSelMk)+L(' tersimpan. Lihat baris Total GMV All Marketplace pada tabel MoM.',' saved. See the Total GMV All Marketplace row in the MoM table.'));
  };
  document.getElementById('clrMonth').onclick=async()=>{
    const mk=maskMk;
    if(!await uiConfirm(L('Hapus data unggahan ','Delete uploads for ')+mkLabel(mk)+'?',
      L('Overlay, produk, dan video bulan ini akan dihapus.','This month\'s overlay, products, and videos will be removed.'),
      L('Hapus','Delete'),L('Batal','Cancel')))return;
    for(const cid in overlay){for(const m in overlay[cid]){
      for(const iso in overlay[cid][m]) if(mkOf(iso)===mk) delete overlay[cid][m][iso];
      if(!Object.keys(overlay[cid][m]).length) delete overlay[cid][m];
    } if(!Object.keys(overlay[cid]).length) delete overlay[cid];}
    prodStore=prodStore.filter(r=>mkOf(r.iso)!==mk);
    vidStore=vidStore.filter(r=>mkOf(r.iso)!==mk);
    store.set(LS_O,overlay);store.set(LS_P,prodStore);store.set(LS_V,vidStore);location.reload();
  };
}
/* =================== PRODUK =================== */
const LIVE_CH=new Set(['tt_live_smo','tt_live_sid','tt_live_smv','tt_live_aff','tt_live_all','sp_live']);
const CAT_WORDS=new Set(['sophie','martin','jam','tangan','tas','selempang','bahu','tote','totebag','bowler','dompet','panjang','wanita','pria','bag','mini','sandal','sepatu','kacamata','clutch','ransel','backpack','sling']);
function shortName(name){
  const toks=String(name||'').trim().split(/\s+/);
  let i=0;
  while(i<toks.length-1&&CAT_WORDS.has(toks[i].toLowerCase()))i++;
  const out=toks.slice(i).join(' ').replace(/\s*\[\s*\d+\s*\]\s*$/,'');
  return out||name;
}
const fmtRoi=v=>v==null?'–':nf1.format(v)+'×';
function canonKey(name){
  return shortName(name).toLowerCase()
    .replace(/\[\s*\d+\s*\]/g,'').replace(/[^a-z0-9 ]/g,' ')
    .replace(/\s+/g,' ').trim() || String(name).toLowerCase();
}
let prodView={mode:'all',ch:'',from:FIRST_ISO,to:null,preset:'custom',q:'',sort:'val',dir:-1,fmin:{}};
const PROD_COLS=()=>[
  ['qty','Qty Sold',fmtN],['val',L('Nilai','Value'),fmtRp],['pct',L('%Kontribusi','%Contribution'),fmtPct],
  ['cost',L('Biaya Iklan','Ad Spend'),fmtRp],
  ['imp',L('Impresi','Impressions'),fmtNC],['clk',L('Klik','Clicks'),fmtNC],
  ['ctr','CTR',fmtPct],['ctor','CTOR',fmtPct],['roi','ROI',fmtRoi],
];
function derive(o){
  o.ctr=o.imp?100*o.clk/o.imp:null;
  o.ctor=o.clk?100*(o.ord||o.qty)/o.clk:null;
  o.roi=o.cost?o.val/o.cost:null;
  return o;
}
const PRODMAP=RAW.prodMap||{};
const resolveProdName=r=>{
  const byUser=prodNames[r.code], byMap=PRODMAP[r.code];
  const nm=byUser||byMap;
  return nm? {...r,name:nm} : r;
};
function renderProducts(){
  if(!prodView.to)prodView.to=DATA_END();
  const data=store.get(LS_P,[]).filter(r=>!LIVE_CH.has(r.chId))
    .filter(r=>['tiktok','shopee'].includes(chDef(r.chId)?.platform))
    .map(resolveProdName);
  let rows=data.filter(r=>r.iso>=prodView.from&&r.iso<=prodView.to);
  if(prodView.mode==='channel'&&prodView.ch)rows=rows.filter(r=>chDef(r.chId)?.platform===prodView.ch);
  if(prodView.q){const q=prodView.q.toLowerCase();rows=rows.filter(r=>r.name.toLowerCase().includes(q)||String(r.code).includes(q)||canonKey(r.name).includes(q));}
  const agg={};
  for(const r of rows){
    const key=canonKey(r.name);
    const o=agg[key]??={name:r.name,names:new Set(),codes:new Set(),qty:0,val:0,cost:0,imp:0,clk:0,ord:0,chs:new Set()};
    o.qty+=r.qty||0;o.val+=r.val||0;o.cost+=r.cost||0;o.imp+=r.imp||0;o.clk+=r.clk||0;o.ord+=r.ord||0;
    o.chs.add(r.chId);o.names.add(r.name);
    if(r.code)o.codes.add(String(r.code));
    if(r.name.length>o.name.length)o.name=r.name;
  }
  for(const o of Object.values(agg)){
    const codes=[...o.codes];
    o.code=codes.slice(0,2).join(', ')+(codes.length>2?` +${codes.length-2}`:'');
    o.allNames=[...o.names].join(' | ');
  }
  let list=Object.values(agg).map(derive);
  /* %Kontribusi = pangsa nilai produk terhadap total nilai daftar (poin 7) */
  const baseVal=sum(list.map(x=>x.val))||0;
  for(const x of list)x.pct=baseVal?100*x.val/baseVal:null;
  for(const[k,min]of Object.entries(prodView.fmin)){
    if(min!==''&&!isNaN(+min))list=list.filter(x=>(x[k]??-Infinity)>=+min);
  }
  const sk=prodView.sort,sd=prodView.dir;
  list.sort((a,b)=>((a[sk]??-Infinity)-(b[sk]??-Infinity))*sd || b.val-a.val);
  const totQty=sum(list.map(x=>x.qty)),totVal=sum(list.map(x=>x.val)),totCost=sum(list.map(x=>x.cost));
  const arrow=k=>prodView.sort===k?(prodView.dir<0?' ↓':' ↑'):'';
  view.innerHTML=`
  <h2 class="sec">${L('Produk','Products')}</h2>
  <div class="controls">
    <div class="seg" id="pSeg">
      <button data-m="all" class="${prodView.mode==='all'?'on':''}">${L('Gabungan','Combined')}</button>
      <button data-m="channel" class="${prodView.mode==='channel'?'on':''}">${L('Per Channel','By Channel')}</button>
    </div>
    ${prodView.mode==='channel'?`<select id="pCh">
      <option value="tiktok" ${prodView.ch==='tiktok'?'selected':''}>TikTok</option>
      <option value="shopee" ${prodView.ch==='shopee'?'selected':''}>Shopee</option></select>`:''}
    <span id="pPicker"></span>
    <input type="text" id="pQ" placeholder="${L('Cari produk…','Search products…')}" value="${esc(prodView.q)}" style="min-width:180px">
  </div>
  ${!data.length?`<div class="card"><div class="empty">${L('Belum ada data produk.','No product data yet.')}<br><br>
    ${L('Data produk terisi otomatis saat Anda mengunggah raw yang memuat detail produk pada tab Unggah:','Product data fills automatically when you upload raw files containing product detail on the Upload tab:')}<br>
    • <b>Shopee Iklan CPC</b> ${L('(per Nama Iklan / produk), masuk ke Iklan Produk / Iklan Produk Baru','(per ad name / product), routed to Product Ads / New Product Ads')}<br>
    • <b>TikTok Product GMV Max</b> ${L('(per ID produk), masuk ke VSA / Product Card','(per product ID), routed to VSA / Product Card')}</div></div>`:`
  <div class="grid g-kpi">
    ${kpiTile(L('Jumlah produk','Product count'),fmtN(list.length))}
    ${kpiTile('Qty Sold',fmtN(totQty))}
    ${kpiTile(L('Nilai','Value'),fmtRpC(totVal))}
    ${kpiTile(L('Biaya Iklan','Ad Spend'),fmtRpC(totCost))}
    ${kpiTile('ROI',totCost?fmtRoi(totVal/totCost):'–')}
  </div>
  <div class="card" style="margin-top:12px"><h3>${L('10 Produk Teratas berdasarkan Nilai','Top 10 Products by Value')}</h3><div id="pTop"></div></div>
  <h2 class="sec">${L('Daftar Produk','Product List')}</h2>
  <div class="card" style="padding:10px 14px;margin-bottom:10px">
    <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end">
      <span style="font-size:12px;font-weight:650;color:var(--ink-2)">${L('Filter minimum:','Minimum filter:')}</span>
      ${PROD_COLS().map(([k,lbl])=>`<label style="font-size:11px;color:var(--muted)">${lbl}<br>
        <input type="number" step="any" class="fmin" data-k="${k}" value="${prodView.fmin[k]??''}" placeholder="≥" style="width:86px;padding:5px 7px;font-size:12px"></label>`).join('')}
      <button class="btn ghost" id="fReset" style="padding:6px 12px;font-size:12px">Reset</button>
    </div>
  </div>
  <div class="tbl-wrap" style="max-height:560px;overflow:auto"><table><thead><tr>
    <th>${L('Nama Produk','Product Name')}</th><th>${L('Kode','Code')}</th>${prodView.mode==='all'?'<th>Channel</th>':''}
    ${PROD_COLS().map(([k,lbl])=>`<th class="sorth" data-k="${k}" style="cursor:pointer" title="${L('Urutkan','Sort')}">${lbl}${arrow(k)}</th>`).join('')}
  </tr></thead><tbody>
  ${list.map(x=>{
    const unnamed=x.name.startsWith('Produk ');
    const merged=x.chs.size>1||x.names.size>1;
    return `<tr><td style="white-space:normal;min-width:190px;max-width:320px${unnamed?';cursor:pointer':''}" title="${unnamed?L('Klik untuk memberi nama produk ini','Click to name this product'):esc(x.allNames||x.name)}" ${unnamed?`data-rename="${esc([...x.codes][0]||'')}"`:''}>
      <b>${esc(shortName(x.name))}</b>${unnamed?` <span style="font-size:10px;color:var(--tiktok)">✎ ${L('beri nama','add name')}</span>`:''}${merged&&!unnamed?` <span style="font-size:10px;color:var(--muted)">⊕ ${x.names.size>1?x.names.size+' listing':''}</span>`:''}<br><span style="font-size:10.5px;color:var(--muted)">${esc(x.name)}</span></td>
    <td class="num" style="font-size:11px;color:var(--muted)">${esc(x.code||'–')}</td>
    ${prodView.mode==='all'?`<td>${[...new Set([...x.chs].map(c=>chDef(c)?.platform))].map(p=>platChip(p)).join(' ')}</td>`:''}
    <td class="num">${fmtN(x.qty)}</td><td class="num">${fmtRp(x.val)}</td>
    <td class="num">${x.pct==null?'–':`<b>${fmtPct(x.pct)}</b>`}</td>
    <td class="num">${x.cost?fmtRp(x.cost):'–'}</td>
    <td class="num">${x.imp?fmtNC(x.imp):'–'}</td><td class="num">${x.clk?fmtNC(x.clk):'–'}</td>
    <td class="num">${fmtPct(x.ctr)}</td><td class="num">${fmtPct(x.ctor)}</td>
    <td class="num">${x.roi==null?'–':`<b style="color:${x.roi>=(targets.sp_pc||10)?'var(--good-ink)':x.roi>=5?'inherit':'var(--critical)'}">${fmtRoi(x.roi)}</b>`}</td></tr>`;}).join('')}
  <tr class="tot"><td>Total</td><td></td>${prodView.mode==='all'?'<td></td>':''}
    <td class="num">${fmtN(totQty)}</td><td class="num">${fmtRp(totVal)}</td><td class="num">${baseVal?fmtPct(100*totVal/baseVal):'–'}</td><td class="num">${fmtRp(totCost)}</td>
    <td class="num">${fmtNC(sum(list.map(x=>x.imp)))}</td><td class="num">${fmtNC(sum(list.map(x=>x.clk)))}</td>
    <td class="num"></td><td class="num"></td><td class="num">${totCost?fmtRoi(totVal/totCost):'–'}</td></tr>
  </tbody></table></div>`}`;
  document.querySelectorAll('#pSeg button').forEach(b=>b.onclick=()=>{prodView.mode=b.dataset.m;if(!prodView.ch)prodView.ch='tiktok';renderProducts();});
  const pc=document.getElementById('pCh');if(pc)pc.onchange=e=>{prodView.ch=e.target.value;renderProducts();};
  rangePicker(document.getElementById('pPicker'),{from:prodView.from,to:prodView.to,preset:prodView.preset,
    onApply:(f,t,p)=>{prodView.from=f;prodView.to=t;prodView.preset=p;renderProducts();}});
  const pq=document.getElementById('pQ');if(pq){pq.oninput=e=>{prodView.q=e.target.value;clearTimeout(pq._t);pq._t=setTimeout(renderProducts,300);};}
  view.querySelectorAll('th.sorth').forEach(th=>th.onclick=()=>{
    const k=th.dataset.k;
    if(prodView.sort===k)prodView.dir*=-1; else{prodView.sort=k;prodView.dir=-1;}
    renderProducts();
  });
  view.querySelectorAll('input.fmin').forEach(inp=>inp.onchange=()=>{prodView.fmin[inp.dataset.k]=inp.value;renderProducts();});
  view.querySelectorAll('td[data-rename]').forEach(td=>td.onclick=async()=>{
    const code=td.dataset.rename;
    const nm=await uiPrompt({title:L('Beri Nama Produk','Name This Product'),
      label:'ID '+code+L('\nContoh: Sophie Martin Tote Bag Wanita Francine Bag','\nExample: Sophie Martin Tote Bag Wanita Francine Bag'),
      value:prodNames[code]||'',ok:L('Simpan','Save'),cancel:L('Batal','Cancel')});
    if(nm&&nm.trim()){prodNames[code]=nm.trim();store.set(LS_PN,prodNames);renderProducts();uiToast(L('Nama produk tersimpan.','Product name saved.'));}
  });
  const fr=document.getElementById('fReset');if(fr)fr.onclick=()=>{prodView.fmin={};renderProducts();};
  const pt=document.getElementById('pTop');
  if(pt&&list.length)hBars(pt,[...list].sort((a,b)=>b.val-a.val).slice(0,10).map(x=>({
    name:shortName(x.name),color:pcolor(chDef([...x.chs][0])?.platform||'tiktok'),value:x.val,
    extra:(x.pct!=null?nf1.format(x.pct)+'%':'')})));
}

/* =================== KREATOR =================== */
let creatorView={from:FIRST_ISO,to:null,preset:'custom',creator:''};
function renderCreators(){
  if(!creatorView.to)creatorView.to=DATA_END();
  const data=store.get(LS_V,[]);
  let rows=data.filter(r=>r.iso>=creatorView.from&&r.iso<=creatorView.to);
  const byCreator={};
  for(const r of rows){
    const o=byCreator[r.creator]??={creator:r.creator,qty:0,val:0,cost:0,imp:0,clk:0,vids:new Map()};
    o.qty+=r.qty||0;o.val+=r.val||0;o.cost+=r.cost||0;o.imp+=r.imp||0;o.clk+=r.clk||0;
    const vk=r.vid||r.title;
    const v=o.vids.get(vk)||{title:r.title,vid:r.vid,qty:0,val:0,cost:0,imp:0,clk:0,chId:r.chId};
    v.qty+=r.qty||0;v.val+=r.val||0;v.cost+=r.cost||0;v.imp+=r.imp||0;v.clk+=r.clk||0;
    o.vids.set(vk,v);
  }
  const list=Object.values(byCreator).map(o=>{o.ord=o.qty;return derive(o);}).sort((a,b)=>b.val-a.val);
  const sel=creatorView.creator&&byCreator[creatorView.creator]?byCreator[creatorView.creator]:null;
  const totVal=sum(list.map(x=>x.val));
  view.innerHTML=`
  <h2 class="sec">${L('Kreator','Creators')}</h2>
  <div class="controls">
    ${sel?`<button class="btn ghost cta" id="kBack">← ${L('Kembali ke daftar kreator','Back to creator list')}</button>`:''}
    <span id="kPicker"></span>
    <label>${L('Kreator','Creator')}:</label>
    <select id="kSel"><option value="">${L('— Semua kreator (ringkasan) —','— All creators (summary) —')}</option>
      ${list.map(c=>`<option value="${esc(c.creator)}" ${c.creator===creatorView.creator?'selected':''}>${esc(c.creator)} (${c.vids.size} video)</option>`).join('')}</select>
  </div>
  ${!data.length?`<div class="card"><div class="empty">${L('Belum ada data kreator.','No creator data yet.')}<br><br>
    ${L('Data kreator terisi otomatis saat Anda mengunggah raw TikTok Product GMV Max yang memuat kolom Akun TikTok, Judul video / ID video pada tab Unggah.','Creator data fills automatically when you upload TikTok Product GMV Max raw files containing the TikTok Account, Video title / Video ID columns on the Upload tab.')}</div></div>`:
  sel?`
  <div class="grid g-kpi k6">
    ${kpiTile(L('Kreator','Creator'),esc(sel.creator))}
    ${kpiTile('QTY Video',fmtN(sel.vids.size))}
    ${kpiTile('Qty Sold',fmtN(sel.qty))}
    ${kpiTile(L('Nilai','Value'),fmtRpC(sel.val))}
    ${kpiTile(L('Biaya Iklan','Ad Spend'),fmtRpC(sel.cost))}
    ${kpiTile('ROI',sel.cost?fmtRoi(sel.val/sel.cost):'–')}
  </div>
  <h2 class="sec">${L('Video milik ','Videos by ')}${esc(sel.creator)}</h2>
  <div class="tbl-wrap" style="max-height:560px;overflow:auto"><table><thead><tr>
    <th>${L('Judul Video','Video Title')}</th><th>ID Video</th><th>Channel</th><th>Qty Sold</th><th>${L('Nilai','Value')}</th><th>${L('Biaya Iklan','Ad Spend')}</th>
    <th>${L('Impresi','Impressions')}</th><th>${L('Klik','Clicks')}</th><th>CTR</th><th>CTOR</th><th>ROI</th>
  </tr></thead><tbody>
  ${[...sel.vids.values()].map(v=>{const dv=derive({...v,ord:v.qty});return `<tr>
    <td style="white-space:normal;min-width:240px;max-width:420px">${esc(v.title||('Video '+v.vid))}</td>
    <td class="num" style="font-size:11px;color:var(--muted)">${esc(v.vid||'–')}</td>
    <td>${esc(chName(v.chId)||v.chId)}</td>
    <td class="num">${fmtN(v.qty)}</td><td class="num">${fmtRp(v.val)}</td>
    <td class="num">${v.cost?fmtRp(v.cost):'–'}</td>
    <td class="num">${v.imp?fmtNC(v.imp):'–'}</td><td class="num">${v.clk?fmtNC(v.clk):'–'}</td>
    <td class="num">${fmtPct(dv.ctr)}</td><td class="num">${fmtPct(dv.ctor)}</td>
    <td class="num">${dv.roi==null?'–':fmtRoi(dv.roi)}</td></tr>`;}).join('')}</tbody></table></div>`:`
  <div class="grid g-kpi">
    ${kpiTile(L('Jumlah kreator','Creator count'),fmtN(list.length))}
    ${kpiTile('Total video',fmtN(sum(list.map(x=>x.vids.size))))}
    ${kpiTile('Qty Sold',fmtN(sum(list.map(x=>x.qty))))}
    ${kpiTile(L('Nilai','Value'),fmtRpC(totVal))}
    ${kpiTile(L('Biaya Iklan','Ad Spend'),fmtRpC(sum(list.map(x=>x.cost))))}
  </div>
  <div class="card" style="margin-top:12px"><h3>${L('10 Kreator Teratas berdasarkan Nilai','Top 10 Creators by Value')}</h3><div id="kTop"></div></div>
  <h2 class="sec">${L('Daftar Kreator','Creator List')}</h2>
  <div class="tbl-wrap"><table><thead><tr>
    <th>${L('Kreator','Creator')}</th><th>QTY Video</th><th>Qty Sold</th><th>${L('Nilai','Value')}</th><th>${L('Biaya Iklan','Ad Spend')}</th>
    <th>${L('Impresi','Impressions')}</th><th>${L('Klik','Clicks')}</th><th>CTR</th><th>CTOR</th><th>ROI</th><th>${L('%Kontribusi','%Contribution')}</th>
  </tr></thead><tbody>
  ${list.map(c=>`<tr class="click" data-k="${esc(c.creator)}">
    <td>${esc(c.creator)}</td><td class="num">${fmtN(c.vids.size)}</td>
    <td class="num">${fmtN(c.qty)}</td><td class="num">${fmtRp(c.val)}</td>
    <td class="num">${c.cost?fmtRp(c.cost):'–'}</td>
    <td class="num">${c.imp?fmtNC(c.imp):'–'}</td><td class="num">${c.clk?fmtNC(c.clk):'–'}</td>
    <td class="num">${fmtPct(c.ctr)}</td><td class="num">${fmtPct(c.ctor)}</td>
    <td class="num">${c.roi==null?'–':fmtRoi(c.roi)}</td>
    <td class="num">${totVal?nf1.format(100*c.val/totVal)+'%':'–'}</td></tr>`).join('')}</tbody></table></div>`}`;
  const kb=document.getElementById('kBack');
  if(kb)kb.onclick=()=>{creatorView.creator='';renderCreators();};
  rangePicker(document.getElementById('kPicker'),{from:creatorView.from,to:creatorView.to,preset:creatorView.preset,
    onApply:(f,t,p)=>{creatorView.from=f;creatorView.to=t;creatorView.preset=p;renderCreators();}});
  document.getElementById('kSel').onchange=e=>{creatorView.creator=e.target.value;renderCreators();};
  view.querySelectorAll('tr[data-k]').forEach(tr=>tr.onclick=()=>{creatorView.creator=tr.dataset.k;renderCreators();});
  const kt=document.getElementById('kTop');
  if(kt&&list.length)hBars(kt,list.slice(0,10).map(c=>({name:c.creator,color:pcolor('tiktok'),value:c.val,extra:fmtN(c.qty)+' pcs'})));
}

/* =================== CHATBOT ASISTEN ANALISIS =================== */
function chatTexts(){
  document.getElementById('chatTitle').textContent=L('Asisten Analisis','Analysis Assistant');
  document.getElementById('chatSub').textContent=L('Iklan · Produk · Kreator','Ads · Products · Creators')+(chatAiAvailable()?' · AI':L(' · mesin lokal',' · local engine'));
  document.getElementById('chatIn').placeholder=L('Tulis pertanyaan…','Type a question…');
}
const CHAT_CHIPS=()=>[
  L('Tanggal berapa yang belum diinput?','Which dates are not input yet?'),
  L('Kenapa sales turun?','Why did sales drop?'),
  L('Channel mana yang turun minggu ini?','Which channels declined this week?'),
  L('Produk apa yang menurun?','Which products are declining?'),
  L('Kreator mana yang naik?','Which creators are rising?'),
  L('Bagaimana performa bulan ini?','How is this month performing?'),
  L('Apa peluang peningkatan anggaran?','Any scale up opportunities?'),
];
function chatChipsRender(){
  const el=document.getElementById('chatChips');
  el.innerHTML=CHAT_CHIPS().map(c=>`<button type="button">${esc(c)}</button>`).join('');
  el.querySelectorAll('button').forEach(b=>b.onclick=()=>chatAsk(b.textContent));
}
/* ---- mode AI: window.claude.complete (artifact ber-AI) atau kunci API Anthropic ---- */
const LS_KEY='smoAdsAnthKey';
let chatHist=[], chatNotified=false;
const chatAiAvailable=()=>!!(window.claude&&window.claude.complete)||!!store.get(LS_KEY,'');
function chatContext(){
  const st=ovStats(isoOf(LATEST,1),LATEST_LAST_ISO(),'all');
  const chm=SALES_DEF.filter(c=>!HIDDEN_CH.has(c.id)).map(c=>chMonth(c.id,LATEST)).filter(c=>c.tot.cost>0||c.tot.gmv>0);
  ALERTS=computeAlerts();
  const pm=prevMonthKey(LATEST), pms=momStatsFor(pm,'all');
  const PI=prodInsights(), KI=creatorInsights();
  const ln=[];
  ln.push(`${mkLabel(LATEST)} MTD (hari 1-${GLOBAL_LAST}): spend ${fmtRpC(st.spend)} (penjualan ${fmtRpC(st.spendSales)}, branding ${fmtRpC(st.spendUpper)}), GMV ${fmtRpC(st.gmv)}, ROAS ${fmtX(st.roas)}, pesanan ${fmtN(st.orders)}, CPO ${fmtRpC(st.cpo)}, AOV ${fmtRpC(st.aov)}, CTR ${fmtPct(st.ctr)}, CTOR ${fmtPct(st.ctor)}`);
  if(pms)ln.push(`${mkLabel(pm)} (bulan penuh): spend ${fmtRpC(pms.spend)}, GMV ${fmtRpC(pms.gmv)}, ROAS ${fmtX(pms.roas)}, pesanan ${fmtN(pms.orders)}`);
  ln.push('Channel MTD (nama | platform | spend | GMV | ROAS | target ROAS):');
  for(const c of chm)ln.push(`- ${chName(c.id)} | ${c.platform} | ${fmtRpC(c.tot.cost)} | ${fmtRpC(c.tot.gmv)} | ${c.roas?fmtX(c.roas):'-'} | ${nf0.format(targets[c.id]||8)}`);
  const act=ALERTS.alerts.filter(a=>a.sev!=='info');
  if(act.length){ln.push('Peringatan aktif:');act.slice(0,10).forEach(a=>ln.push(`- [${a.sev}] ${chName(a.ch.id)}: ${a.title}. Langkah pertama: ${(a.actions||[])[0]||'-'}`));}
  if(ALERTS.opps.length){ln.push('Peluang peningkatan anggaran:');ALERTS.opps.forEach(o=>ln.push(`- ${chName(o.ch.id)}: ${o.title}`));}
  if(PI){ln.push(`Produk ${mkLabel(PI.mk)} (${PI.n} produk, nilai ${fmtRpC(PI.tot)}, ROI ${PI.roi?fmtRoi(PI.roi):'-'}), teratas: `+PI.top.map(x=>`${shortName(x.name)} ${fmtRpC(x.val)} (ROI ${x.roi?fmtRoi(x.roi):'-'})`).join('; '));
    if(PI.low.length)ln.push('Produk ROI rendah: '+PI.low.map(x=>`${shortName(x.name)} biaya ${fmtRpC(x.cost)} ROI ${x.roi==null?'-':fmtRoi(x.roi)}`).join('; '));}
  if(KI)ln.push(`Kreator ${mkLabel(KI.mk)} teratas: `+KI.top.map(x=>`${x.creator} ${fmtRpC(x.val)} (${x.vids.size} video, ROI ${x.roi?fmtRoi(x.roi):'-'})`).join('; '));
  const cov=dataCoverage();
  const beh=cov.rows.filter(r=>r.behind>0);
  ln.push('Kelengkapan data (hari terisi menyeluruh: '+cov.last+'): '+(beh.length?'channel tertinggal '+beh.map(r=>chName(r.c.id)+' (terakhir hari '+r.lastDay+')').join('; '):'semua channel aktif lengkap sampai hari '+cov.last));
  const ct=channelTrendData(SALES_DEF.filter(c=>!HIDDEN_CH.has(c.id)));
  if(ct.down.length)ln.push('Channel GMV menurun 7 hari terakhir vs sebelumnya: '+ct.down.slice(0,6).map(r=>chName(r.c.id)+' '+trFmt(r.dG)+' (ROAS '+trFmt(r.dR)+')').join('; '));
  if(ct.up.length)ln.push('Channel GMV meningkat: '+ct.up.slice(0,6).map(r=>chName(r.c.id)+' '+trFmt(r.dG)).join('; '));
  return ln.join('\n');
}
function chatSystem(){
  return L(
'Anda adalah Asisten Analisis dashboard iklan Sophie Martin Official (merek fashion Indonesia: tas, jam tangan, dompet) yang beriklan di TikTok (GMV Max Live & Product), Shopee, Meta CPAS, dan Lazada. Jawab dalam bahasa Indonesia yang formal, ringkas, dan langsung ke inti. Gunakan HANYA angka dari data di bawah; jangan mengarang angka. Bila ditanya rekomendasi, beri langkah konkret sesuai praktik iklan e-commerce. Tulis teks polos tanpa markdown; butir memakai tanda "-". Jangan memakai tanda pisah panjang.',
'You are the Analysis Assistant for the Sophie Martin Official ads dashboard (an Indonesian fashion brand: bags, watches, wallets) advertising on TikTok (GMV Max Live & Product), Shopee, Meta CPAS, and Lazada. Reply in concise, formal English. Use ONLY the figures from the data below; never invent numbers. When asked for recommendations, give concrete steps aligned with e-commerce advertising practice. Plain text without markdown; bullets use "-".');
}
async function chatLLM(q){
  const sys=chatSystem(), ctx=chatContext();
  if(window.claude&&window.claude.complete){
    const prompt=`${sys}\n\n=== DATA DASHBOARD (fakta) ===\n${ctx}\n\n=== PERCAKAPAN ===\n${chatHist.slice(-8).map(m=>(m.role==='user'?'Pengguna: ':'Asisten: ')+m.content).join('\n')}\nPengguna: ${q}\nAsisten:`;
    const r=await window.claude.complete(prompt);
    return typeof r==='string'?r:(r&&(r.completion||r.text))||String(r);
  }
  const key=store.get(LS_KEY,'');
  if(key){
    const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',
      headers:{'content-type':'application/json','x-api-key':key,
        'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
      body:JSON.stringify({model:'claude-sonnet-5',max_tokens:700,
        system:sys+'\n\n=== DATA DASHBOARD (fakta) ===\n'+ctx,
        messages:[...chatHist.slice(-8),{role:'user',content:q}]})});
    if(!res.ok)throw new Error('API '+res.status);
    const j=await res.json();
    return (j.content||[]).map(b=>b.text||'').join('').trim();
  }
  return null;
}
function chatPush(who,html){
  const body=document.getElementById('chatBody');
  const d=document.createElement('div');
  d.className='msg '+who;
  if(who==='user')d.textContent=html;else d.innerHTML=html;
  body.appendChild(d);
  body.scrollTop=body.scrollHeight;
}
function chLine(c){return `• <b>${esc(chName(c.id))}</b> (${PLATFORMS[c.platform].name}): ROAS ${fmtX(c.roas)} · spend ${fmtRpC(c.tot.cost)} · GMV ${fmtRpC(c.tot.gmv)}`;}
/* =========== ANALISIS LANJUTAN CHATBOT (mesin lokal) =========== */
/* jendela tren: 7 hari terakhir vs 7 hari sebelumnya */
function trendWindows(){
  const end=LATEST_LAST_ISO();
  const curFrom=clampIso(isoShift(end,-6)),curTo=end;
  const prevTo=clampIso(isoShift(curFrom,-1)),prevFrom=clampIso(isoShift(prevTo,-6));
  return {curFrom,curTo,prevFrom,prevTo};
}
const trFmt=d=>d==null?'–':(d>=0?'▲':'▼')+' '+nf1.format(Math.abs(d))+'%';
const pctD=(a,b)=>a?100*(b-a)/a:null;

/* --- kelengkapan data per channel per tanggal --- */
function dataCoverage(){
  const last=GLOBAL_LAST, ms=monthSeries(LATEST);
  const rows=[];
  for(const c of CH_DEF){
    if(HIDDEN_CH.has(c.id))continue;
    const d=ms[c.id]||{};
    const hasDay=day=>{const i=day-1;return ((d.cost||[])[i]||0)>0||((d.gmv||[])[i]||0)>0||((d.clicks||[])[i]||0)>0||((d.impressions||[])[i]||0)>0||((d.orders||[])[i]||0)>0||((d.liveViews||[])[i]||0)>0;};
    let lastDay=0;for(let day=1;day<=last;day++)if(hasDay(day))lastDay=day;
    if(lastDay===0)continue;
    const missing=[];for(let day=1;day<=lastDay;day++)if(!hasDay(day))missing.push(day);
    rows.push({c,lastDay,missing,behind:last-lastDay});
  }
  return {last,rows};
}
function coverageReply(){
  const {last,rows}=dataCoverage();
  if(!rows.length)return L('Belum ada channel dengan data pada '+mkLabel(LATEST)+'. Silakan unggah raw data di tab Unggah.','No channel has data in '+mkLabel(LATEST)+' yet. Please upload raw data on the Upload tab.');
  const behind=rows.filter(r=>r.behind>0).sort((a,b)=>b.behind-a.behind);
  const gaps=rows.filter(r=>r.missing.length);
  const dayList=days=>days.map(dd=>isoLabel(isoOf(LATEST,dd))).join(', ');
  let out=`<b>${L('Kelengkapan data','Data completeness')} · ${mkLabel(LATEST)}</b>\n`+
    L(`Data terbaru menyeluruh mencapai ${isoLabelY(isoOf(LATEST,last))} (hari ke-${last}).`,`Latest data across channels reaches ${isoLabelY(isoOf(LATEST,last))} (day ${last}).`)+'\n';
  if(behind.length)out+='\n'+L(`Channel yang belum sampai hari ${last}:`,`Channels not yet at day ${last}:`)+'\n'+
    behind.map(r=>`• <b>${esc(chName(r.c.id))}</b>: ${L('terakhir','last')} ${isoLabel(isoOf(LATEST,r.lastDay))} · ${L('belum diinput','not input')} ${dayList(Array.from({length:last-r.lastDay},(_,i)=>r.lastDay+1+i))}`).join('\n');
  if(gaps.length)out+='\n\n'+L('Ada tanggal kosong di tengah:','Gaps in the middle:')+'\n'+
    gaps.map(r=>`• <b>${esc(chName(r.c.id))}</b>: ${dayList(r.missing)}`).join('\n');
  if(!behind.length&&!gaps.length)out+='\n'+L(`Semua channel aktif sudah terisi lengkap sampai hari ${last} ✓`,`All active channels are complete through day ${last} ✓`);
  out+='\n\n'+L('Catatan: channel yang memang tidak beriklan pada suatu hari terbaca "belum diinput" karena nilainya nol. Abaikan bila channel itu memang tidak jalan hari itu.','Note: a channel that genuinely did not run on a day reads as "not input" because its value is zero. Ignore if it truly was inactive that day.');
  return out;
}

/* --- tren channel (naik/turun GMV & ROAS) --- */
function channelTrendData(defs){
  const w=trendWindows();
  const rows=[];
  for(const c of defs){
    const a=statsRange([c.id],w.prevFrom,w.prevTo),b=statsRange([c.id],w.curFrom,w.curTo);
    if(!a.gmv&&!b.gmv&&!a.cost&&!b.cost)continue;
    rows.push({c,a,b,dG:pctD(a.gmv,b.gmv),dR:pctD(a.roas,b.roas)});
  }
  const down=rows.filter(r=>r.dG!=null&&r.dG<=-15).sort((a,b)=>a.dG-b.dG);
  const up=rows.filter(r=>r.dG!=null&&r.dG>=15).sort((a,b)=>b.dG-a.dG);
  return {w,rows,down,up};
}
function channelTrendReply(q){
  let defs=SALES_DEF.filter(c=>!HIDDEN_CH.has(c.id));
  let scope='';
  for(const p in PLATFORMS)if(q&&q.includes(p)){defs=defs.filter(c=>c.platform===p);scope=' · '+PLATFORMS[p].name;}
  const {w,down,up}=channelTrendData(defs);
  const line=r=>`<b>${esc(chName(r.c.id))}</b>: GMV ${trFmt(r.dG)} (${fmtRpC(r.a.gmv)}→${fmtRpC(r.b.gmv)}) · ROAS ${trFmt(r.dR)}`;
  let out=`<b>${L('Tren channel','Channel trend')}${scope}</b>\n`+
    L(`7 hari terakhir (${isoLabel(w.curFrom)}–${isoLabel(w.curTo)}) vs sebelumnya (${isoLabel(w.prevFrom)}–${isoLabel(w.prevTo)})`,`Last 7 days (${isoLabel(w.curFrom)}–${isoLabel(w.curTo)}) vs prior (${isoLabel(w.prevFrom)}–${isoLabel(w.prevTo)})`)+'\n';
  if(down.length)out+='\n'+L('Menurun:','Declining:')+'\n'+down.slice(0,5).map(r=>'▼ '+line(r)).join('\n');
  if(up.length)out+='\n\n'+L('Meningkat:','Rising:')+'\n'+up.slice(0,5).map(r=>'▲ '+line(r)).join('\n');
  if(!down.length&&!up.length)out+='\n'+L('Tidak ada perubahan GMV signifikan (±15%) pada channel.','No significant GMV change (±15%) across channels.');
  return out;
}

/* --- tren produk --- */
function prodAggRange(from,to){
  const all=store.get(LS_P,[]).filter(r=>!LIVE_CH.has(r.chId))
    .filter(r=>['tiktok','shopee'].includes(chDef(r.chId)?.platform)).map(resolveProdName)
    .filter(r=>r.iso>=from&&r.iso<=to);
  return prodAgg(all);
}
function prodTrendReply(){
  const w=trendWindows();
  const cur=prodAggRange(w.curFrom,w.curTo), prev=prodAggRange(w.prevFrom,w.prevTo);
  if(!cur.length&&!prev.length)return L('Belum ada data produk untuk membandingkan tren. Unggah raw produk lebih dari satu hari dulu.','No product data to compare trends yet. Upload more than one day of product data first.');
  const pmap={};prev.forEach(x=>pmap[canonKey(x.name)]=x);
  const rows=cur.map(x=>{const p=pmap[canonKey(x.name)];const pv=p?p.val:0;return {x,pv,d:pctD(pv,x.val)};});
  const down=rows.filter(r=>r.d!=null&&r.d<=-20&&r.pv>200000).sort((a,b)=>a.d-b.d);
  const up=rows.filter(r=>r.d!=null&&r.d>=20&&r.x.val>200000).sort((a,b)=>b.d-a.d);
  let out=`<b>${L('Tren produk','Product trend')}</b>\n`+L(`Nilai 7 hari terakhir vs sebelumnya`,`Value last 7 days vs prior`)+'\n';
  if(down.length)out+='\n'+L('Menurun:','Declining:')+'\n'+down.slice(0,6).map(r=>`▼ <b>${esc(shortName(r.x.name))}</b>: ${trFmt(r.d)} (${fmtRpC(r.pv)}→${fmtRpC(r.x.val)})`).join('\n');
  if(up.length)out+='\n\n'+L('Meningkat:','Rising:')+'\n'+up.slice(0,6).map(r=>`▲ <b>${esc(shortName(r.x.name))}</b>: ${trFmt(r.d)} (${fmtRpC(r.pv)}→${fmtRpC(r.x.val)})`).join('\n');
  if(!down.length&&!up.length)out+='\n'+L('Tidak ada produk dengan perubahan nilai signifikan (±20%).','No product with a significant value change (±20%).');
  return out;
}

/* --- tren kreator --- */
function creatorAggRange(from,to){
  const rows=store.get(LS_V,[]).filter(r=>r.iso>=from&&r.iso<=to);
  const by={};
  for(const r of rows){const o=by[r.creator]??={creator:r.creator,qty:0,val:0,cost:0,imp:0,clk:0,vids:new Set()};
    o.qty+=r.qty||0;o.val+=r.val||0;o.cost+=r.cost||0;o.imp+=r.imp||0;o.clk+=r.clk||0;o.vids.add(r.vid||r.title);}
  return Object.values(by).map(o=>{o.ord=o.qty;return derive(o);});
}
function creatorTrendReply(){
  const w=trendWindows();
  const cur=creatorAggRange(w.curFrom,w.curTo), prev=creatorAggRange(w.prevFrom,w.prevTo);
  if(!cur.length&&!prev.length)return L('Belum ada data kreator untuk membandingkan tren.','No creator data to compare trends yet.');
  const pmap={};prev.forEach(x=>pmap[x.creator]=x);
  const rows=cur.map(x=>{const p=pmap[x.creator];const pv=p?p.val:0;return {x,pv,d:pctD(pv,x.val)};});
  const down=rows.filter(r=>r.d!=null&&r.d<=-20&&r.pv>150000).sort((a,b)=>a.d-b.d);
  const up=rows.filter(r=>r.d!=null&&r.d>=20&&r.x.val>150000).sort((a,b)=>b.d-a.d);
  let out=`<b>${L('Tren kreator','Creator trend')}</b>\n`+L('Nilai 7 hari terakhir vs sebelumnya','Value last 7 days vs prior')+'\n';
  if(down.length)out+='\n'+L('Menurun:','Declining:')+'\n'+down.slice(0,6).map(r=>`▼ <b>${esc(r.x.creator)}</b>: ${trFmt(r.d)} (${fmtRpC(r.pv)}→${fmtRpC(r.x.val)})`).join('\n');
  if(up.length)out+='\n\n'+L('Meningkat:','Rising:')+'\n'+up.slice(0,6).map(r=>`▲ <b>${esc(r.x.creator)}</b>: ${trFmt(r.d)} (${fmtRpC(r.pv)}→${fmtRpC(r.x.val)})`).join('\n');
  if(!down.length&&!up.length)out+='\n'+L('Tidak ada kreator dengan perubahan nilai signifikan (±20%).','No creator with a significant value change (±20%).');
  return out;
}

/* --- diagnosis penyebab sales turun --- */
function driverReply(q){
  const w=trendWindows();
  let defs=SALES_DEF.filter(c=>!HIDDEN_CH.has(c.id));
  for(const p in PLATFORMS)if(q&&q.includes(p))defs=defs.filter(c=>c.platform===p);
  const A=statsRange(defs.map(c=>c.id),w.prevFrom,w.prevTo), B=statsRange(defs.map(c=>c.id),w.curFrom,w.curTo);
  const dG=pctD(A.gmv,B.gmv);
  const rows=[];
  for(const c of defs){const a=statsRange([c.id],w.prevFrom,w.prevTo),b=statsRange([c.id],w.curFrom,w.curTo);
    if(a.gmv||b.gmv)rows.push({c,a,b,delta:b.gmv-a.gmv});}
  const drops=rows.filter(r=>r.delta<0).sort((a,b)=>a.delta-b.delta).slice(0,4);
  const gains=rows.filter(r=>r.delta>0).sort((a,b)=>b.delta-a.delta).slice(0,2);
  const diag=r=>{
    const dCost=pctD(r.a.cost,r.b.cost),dRoas=pctD(r.a.roas,r.b.roas),dCtor=pctD(r.a.ctor,r.b.ctor),dClk=pctD(r.a.clk,r.b.clk);
    if(dCost!=null&&dCost<=-15)return L(`anggaran turun ${nf0.format(-dCost)}% (volume iklan berkurang)`,`spend down ${nf0.format(-dCost)}% (ad volume reduced)`);
    if(dRoas!=null&&dRoas<=-15)return L(`efisiensi ROAS turun ${nf0.format(-dRoas)}% (biaya tetap, hasil turun)`,`ROAS efficiency down ${nf0.format(-dRoas)}% (spend held, returns fell)`);
    if(dCtor!=null&&dCtor<=-15)return L(`konversi CTOR melemah ${nf0.format(-dCtor)}% (klik masuk tapi tidak jadi order)`,`CTOR conversion weakened ${nf0.format(-dCtor)}% (clicks arrive but do not convert)`);
    if(dClk!=null&&dClk<=-15)return L(`trafik/klik turun ${nf0.format(-dClk)}%`,`traffic/clicks down ${nf0.format(-dClk)}%`);
    return L('penurunan volume umum','general volume decline');
  };
  let out=`<b>${L('Diagnosis penjualan','Sales diagnosis')}</b>\n`+
    L(`GMV 7 hari terakhir ${fmtRpC(B.gmv)} vs 7 hari sebelumnya ${fmtRpC(A.gmv)} (${trFmt(dG)}).`,`GMV last 7 days ${fmtRpC(B.gmv)} vs prior 7 days ${fmtRpC(A.gmv)} (${trFmt(dG)}).`)+'\n';
  if(dG!=null&&dG>=0){
    out+='\n'+L('GMV tidak turun pada periode ini.','GMV did not decline in this period.')+(gains.length?'\n'+L('Pendorong: ','Drivers: ')+gains.map(r=>esc(chName(r.c.id))+' +'+fmtRpC(r.delta)).join(', '):'');
    return out;
  }
  if(drops.length)out+='\n'+L('Penyumbang penurunan terbesar:','Biggest contributors to the drop:')+'\n'+
    drops.map(r=>`▼ <b>${esc(chName(r.c.id))}</b>: ${fmtRpC(r.a.gmv)}→${fmtRpC(r.b.gmv)} (${fmtRpC(r.delta)})\n   ${L('Penyebab','Cause')}: ${diag(r)}`).join('\n');
  if(gains.length)out+='\n\n'+L('Yang menahan penurunan (naik): ','Offsetting (rose): ')+gains.map(r=>esc(chName(r.c.id))+' +'+fmtRpC(r.delta)).join(', ');
  out+='\n\n'+L('Saran: prioritaskan channel penurun terbesar sesuai penyebabnya (kembalikan anggaran, rotasi materi bila ROAS turun, atau perbaiki halaman produk bila CTOR turun). Lihat tab Analisis untuk rencana tindakan lengkap.','Suggestion: prioritize the biggest decliners per their cause (restore budget, rotate creatives if ROAS fell, or fix the product page if CTOR fell). See the Analysis tab for full action plans.');
  return out;
}

function botReply(q0){
  const q=String(q0||'').toLowerCase();
  const st=ovStats(isoOf(LATEST,1),LATEST_LAST_ISO(),'all');
  const chm=SALES_DEF.filter(c=>!HIDDEN_CH.has(c.id)).map(c=>chMonth(c.id,LATEST)).filter(c=>c.tot.cost>0||c.tot.gmv>0);
  const has=(...ws)=>ws.some(w=>q.includes(w));
  const wantTrend=has('turun','naik','penurunan','kenaikan','menurun','meningkat','tren','trend','decline','increase','drop','rising','anjlok','melonjak');
  const wantWhy=has('kenapa','mengapa','penyebab','why','cause','karena','apa yang menyebabkan');
  /* 1. kelengkapan data / tanggal yang belum diinput */
  if(has('belum diinput','belum input','belum saya input','yang belum','kelengkapan','sudah lengkap','belum lengkap','cek data','cek kelengkapan','tanggal berapa','data belum','kurang input','missing','tertinggal'))
    return coverageReply();
  /* 2. penyebab penjualan turun */
  if(wantWhy&&has('sales','penjualan','gmv','roas','turun','drop','anjlok','omzet'))
    return driverReply(q);
  /* 3. tren naik/turun dengan subjek */
  if(wantTrend){
    if(has('produk','product'))return prodTrendReply();
    if(has('kreator','creator','video','afiliator'))return creatorTrendReply();
    return channelTrendReply(q);
  }
  /* platform tertentu */
  for(const p in PLATFORMS){
    if(q.includes(p)){
      const ids=platIds(p),uids=platUpperIds(p);
      const s=statsRange(ids,isoOf(LATEST,1),LATEST_LAST_ISO());
      const u=statsRange(uids,isoOf(LATEST,1),LATEST_LAST_ISO());
      const chansP=chm.filter(c=>c.platform===p).sort((a,b)=>b.tot.gmv-a.tot.gmv);
      if(!s.cost&&!u.cost)return L(`Belum ada biaya tercatat untuk ${PLATFORMS[p].name} pada ${mkLabel(LATEST)}.`,`No spend recorded for ${PLATFORMS[p].name} in ${mkLabel(LATEST)}.`);
      return `<b>${PLATFORMS[p].name} · ${mkLabel(LATEST)} (MTD)</b>\n`+
        L(`Spend penjualan ${fmtRpC(s.cost)}${u.cost?` · Branding Ads ${fmtRpC(u.cost)}`:''}\nGMV ${fmtRpC(s.gmv)} · ROAS ${fmtX(s.roas)} · ${fmtN(s.orders)} pesanan\n`,
          `Sales spend ${fmtRpC(s.cost)}${u.cost?` · Branding Ads ${fmtRpC(u.cost)}`:''}\nGMV ${fmtRpC(s.gmv)} · ROAS ${fmtX(s.roas)} · ${fmtN(s.orders)} orders\n`)+
        chansP.slice(0,5).map(chLine).join('\n');
    }
  }
  if(has('produk','product')){
    const PI=prodInsights();
    if(!PI)return L('Belum ada data produk. Unggah raw Shopee Iklan CPC atau TikTok Product GMV Max pada tab Unggah terlebih dahulu.','No product data yet. Upload Shopee CPC Ads or TikTok Product GMV Max raw files on the Upload tab first.');
    let out=`<b>${L('Produk','Products')} · ${mkLabel(PI.mk)}</b>\n`+
      L(`${PI.n} produk · nilai total ${fmtRpC(PI.tot)} · ROI ${PI.roi?fmtRoi(PI.roi):'–'}\n\n${L('Terlaris','Top')}:`,`${PI.n} products · total value ${fmtRpC(PI.tot)} · ROI ${PI.roi?fmtRoi(PI.roi):'–'}\n\nTop sellers:`)+'\n'+
      PI.top.map(x=>`• <b>${esc(shortName(x.name))}</b>: ${fmtRpC(x.val)} (${nf1.format(100*x.val/PI.tot)}%) · ROI ${x.roi?fmtRoi(x.roi):'–'}`).join('\n');
    if(PI.low.length)out+='\n\n'+L('Perlu perhatian (biaya besar, ROI di bawah 5):','Needs attention (high spend, ROI below 5):')+'\n'+
      PI.low.map(x=>`• ${esc(shortName(x.name))}: ${L('biaya','spend')} ${fmtRpC(x.cost)} · ROI ${x.roi==null?'–':fmtRoi(x.roi)}`).join('\n')+
      '\n'+L('Saran: turunkan penawaran produk tersebut dan alihkan anggarannya ke produk terlaris.','Suggestion: lower bids on those products and shift the budget to the top sellers.');
    return out;
  }
  if(has('kreator','creator','video','afiliator')){
    const KI=creatorInsights();
    if(!KI)return L('Belum ada data kreator. Unggah raw TikTok Product GMV Max yang memuat kolom Akun TikTok.','No creator data yet. Upload TikTok Product GMV Max raw files containing the TikTok Account column.');
    let out=`<b>${L('Kreator','Creators')} · ${mkLabel(KI.mk)}</b>\n`+
      `${KI.n} ${L('kreator aktif · nilai total','active creators · total value')} ${fmtRpC(KI.tot)} · ROI ${KI.roi?fmtRoi(KI.roi):'–'}\n\n`+
      L('Teratas:','Top:')+'\n'+
      KI.top.map(x=>`• <b>${esc(x.creator)}</b>: ${fmtRpC(x.val)} (${nf1.format(100*x.val/KI.tot)}%) · ${x.vids.size} video · ROI ${x.roi?fmtRoi(x.roi):'–'}`).join('\n');
    if(KI.low.length)out+='\n\n'+L('ROI rendah: ','Low ROI: ')+KI.low.map(x=>esc(x.creator)).join(', ')+
      '. '+L('Saran: jeda promosi video ber-CTR rendah dari kreator tersebut.','Suggestion: pause promotion of their low CTR videos.');
    return out;
  }
  if(has('masalah','bermasalah','warning','peringatan','alert','turun','drop','issue','problem','perhatian')){
    ALERTS=computeAlerts();
    const act=ALERTS.alerts.filter(a=>a.sev!=='info').slice(0,5);
    if(!act.length)return L('Tidak ada peringatan aktif. Semua channel dalam kondisi sehat ✓','No active warnings. All channels are healthy ✓');
    return `<b>${L('Temuan aktif','Active findings')} (${act.length}${ALERTS.alerts.filter(a=>a.sev!=='info').length>5?'+':''})</b>\n`+
      act.map(a=>`${SEV_IC[a.sev]} <b>${esc(chName(a.ch.id))}</b>: ${esc(a.title)}\n   ${L('Langkah','Step')}: ${esc((a.actions&&a.actions[0])||'-')}`).join('\n')+
      '\n\n'+L('Detail lengkap dan rencana tindakan ada di tab Analisis.','Full detail and action plans are on the Analysis tab.');
  }
  if(has('peluang','scale','opportunit','naikkan','tingkatkan')){
    ALERTS=computeAlerts();
    if(!ALERTS.opps.length)return L('Belum ada kandidat peningkatan anggaran. Syaratnya ROAS minimal 120% dari target dengan laju biaya masih aman.','No scale up candidates yet. The requirement is ROAS of at least 120% of target with spend pace still safe.');
    return `<b>${L('Peluang peningkatan anggaran','Budget scale up opportunities')}</b>\n`+
      ALERTS.opps.map(o=>`🚀 <b>${esc(chName(o.ch.id))}</b>: ${esc(o.title)}`).join('\n')+
      '\n'+L('Naikkan bertahap maksimal 20 sampai 30 persen per dua hari.','Scale gradually, at most 20 to 30 percent every two days.');
  }
  if(has('roas','target')){
    const bad=chm.filter(c=>c.roas!=null&&c.roas<(targets[c.id]||8)).sort((a,b)=>a.roas-b.roas);
    const good=chm.filter(c=>c.roas!=null&&c.roas>=(targets[c.id]||8)).sort((a,b)=>b.roas-a.roas);
    return `<b>ROAS ${mkLabel(LATEST)} (MTD)</b>\n${L('Gabungan','Blended')}: ${fmtX(st.roas)}\n\n`+
      (good.length?L('Di atas target:','Above target:')+'\n'+good.slice(0,4).map(c=>`✓ ${esc(chName(c.id))}: ${fmtX(c.roas)} / ${nf0.format(targets[c.id]||8)}`).join('\n')+'\n\n':'')+
      (bad.length?L('Di bawah target:','Below target:')+'\n'+bad.slice(0,4).map(c=>`✕ ${esc(chName(c.id))}: ${fmtX(c.roas)} / ${nf0.format(targets[c.id]||8)}`).join('\n'):L('Semua channel di atas target ✓','All channels above target ✓'));
  }
  if(has('spend','biaya','anggaran','budget','cost','pacing')){
    const buds=chm.map(c=>({c,b:c.budget||0})).filter(x=>x.b>0);
    const totB=sum(buds.map(x=>x.b)),totS=sum(chm.map(c=>c.tot.cost));
    const over=buds.filter(x=>x.c.tot.cost/(x.b*x.c.last/mkDays(LATEST))>1.2).map(x=>x.c);
    const under=buds.filter(x=>x.c.last>=3&&x.c.tot.cost/(x.b*x.c.last/mkDays(LATEST))<0.6).map(x=>x.c);
    return `<b>Spend ${mkLabel(LATEST)} (MTD)</b>\n`+
      L(`Total ${fmtRpC(st.spend)} (penjualan ${fmtRpC(st.spendSales)} · branding ${fmtRpC(st.spendUpper)})\nAnggaran channel tercatat ${fmtRpC(totB)} · terpakai ${fmtRpC(totS)}\n`,
        `Total ${fmtRpC(st.spend)} (sales ${fmtRpC(st.spendSales)} · branding ${fmtRpC(st.spendUpper)})\nRecorded channel budgets ${fmtRpC(totB)} · used ${fmtRpC(totS)}\n`)+
      (over.length?'\n'+L('Di atas laju anggaran: ','Above budget pace: ')+over.map(c=>esc(chName(c.id))).join(', '):'')+
      (under.length?'\n'+L('Penyerapan lambat: ','Slow utilization: ')+under.map(c=>esc(chName(c.id))).join(', '):'')+
      '\n\n'+L('Anggaran per channel dapat diubah pada tab Platform (klik angka anggaran).','Channel budgets can be edited on the Platform tab (click the budget figure).');
  }
  if(has('bandingkan','compare','bulan lalu','last month','mom')){
    const pm=prevMonthKey(LATEST);
    const a=momStatsFor(pm,'all'),b=ovStats(isoOf(LATEST,1),LATEST_LAST_ISO(),'all');
    if(!a)return L('Data bulan sebelumnya tidak tersedia.','Previous month data is unavailable.');
    const row=(lbl,x,y,f)=>`• ${lbl}: ${f(y)} vs ${f(x)} (${x?((y-x)/Math.abs(x)>=0?'▲':'▼')+' '+nf1.format(Math.abs(100*(y-x)/Math.abs(x)))+'%':'–'})`;
    return `<b>${mkLabelS(LATEST)} (MTD) vs ${mkLabelS(pm)} (${L('bulan penuh','full month')})</b>\n`+
      row('Spend',a.spend,b.spend,fmtRpC)+'\n'+row('GMV',a.gmv,b.gmv,fmtRpC)+'\n'+
      row('ROAS',a.roas,b.roas,fmtX)+'\n'+row(L('Pesanan','Orders'),a.orders,b.orders,fmtN)+
      '\n\n'+L('Catatan: bulan berjalan belum selesai sehingga selisih wajar tampak besar.','Note: the current month is not finished, so gaps naturally look large.');
  }
  if(has('ctr','ctor','klik','click','impresi','impression','funnel','konversi','conversion')){
    return `<b>Funnel ${mkLabel(LATEST)} (MTD)</b>\n`+
      `${L('Impresi','Impressions')}: ${fmtNC(st.imp)}\n${L('Klik produk','Product clicks')}: ${fmtNC(st.clk)} (CTR ${fmtPct(st.ctr)})\n${L('Pesanan','Orders')}: ${fmtN(st.orders)} (CTOR ${fmtPct(st.ctor)})\nAOV: ${fmtRpC(st.aov)} · CPO: ${fmtRpC(st.cpo)}\n\n`+
      L('CTR rendah berarti materi iklan kurang menarik; CTOR rendah berarti halaman produk atau harga yang menahan konversi.','Low CTR means creatives are underperforming; low CTOR means the product page or pricing is holding back conversion.');
  }
  if(has('performa','ringkasan','summary','bulan ini','this month','bagaimana','gimana','how')){
    ALERTS=computeAlerts();
    const n=ALERTS.alerts.filter(a=>a.sev!=='info').length;
    const best=chm.filter(c=>c.roas!=null).sort((a,b)=>b.roas-a.roas)[0];
    const worst=chm.filter(c=>c.roas!=null&&c.tot.cost>500000).sort((a,b)=>a.roas-b.roas)[0];
    return `<b>${mkLabel(LATEST)} (MTD, ${L('hingga hari ke-','through day ')}${GLOBAL_LAST})</b>\n`+
      `Spend ${fmtRpC(st.spend)} · GMV ${fmtRpC(st.gmv)} · ROAS ${fmtX(st.roas)}\n${fmtN(st.orders)} ${L('pesanan','orders')} · CPO ${fmtRpC(st.cpo)} · AOV ${fmtRpC(st.aov)}\n\n`+
      (best?`${L('Terbaik','Best')}: <b>${esc(chName(best.id))}</b> (ROAS ${fmtX(best.roas)})\n`:'')+
      (worst?`${L('Perlu perhatian','Needs attention')}: <b>${esc(chName(worst.id))}</b> (ROAS ${fmtX(worst.roas)})\n`:'')+
      `\n${n?L(`Ada ${n} temuan aktif dan ${ALERTS.opps.length} peluang. Tanyakan "channel bermasalah" untuk detail.`,`There are ${n} active findings and ${ALERTS.opps.length} opportunities. Ask "which channels have issues" for detail.`):L('Tidak ada peringatan aktif ✓','No active warnings ✓')}`;
  }
  return L('Saya teman analisis Anda. Contoh yang bisa ditanyakan:\n• Tanggal berapa yang belum saya input?\n• Kenapa sales turun? (diagnosis penyebab)\n• Channel / produk / kreator mana yang turun atau naik?\n• Ringkasan TikTok / Shopee / Meta / Lazada\n• ROAS di bawah target, peluang scale up, pacing anggaran\n• Bandingkan dengan bulan lalu',
    'I am your analysis companion. You can ask, for example:\n• Which dates have I not input yet?\n• Why did sales drop? (root-cause diagnosis)\n• Which channels / products / creators are up or down?\n• TikTok / Shopee / Meta / Lazada summary\n• ROAS below target, scale up opportunities, budget pacing\n• Compare with last month');
}
async function chatAsk(q){
  q=String(q||'').trim();
  if(!q)return;
  chatPush('user',q);
  chatHist.push({role:'user',content:q});
  document.getElementById('chatIn').value='';
  const body=document.getElementById('chatBody');
  const tp=document.createElement('div');tp.className='msg bot typing';tp.innerHTML='<i></i><i></i><i></i>';
  body.appendChild(tp);body.scrollTop=body.scrollHeight;
  const t0=Date.now();
  let ans=null,viaAI=false;
  try{ans=await chatLLM(q);viaAI=ans!=null&&String(ans).trim()!=='';}catch(e){ans=null;}
  const wait=380-(Date.now()-t0);
  if(wait>0)await new Promise(r=>setTimeout(r,wait));
  tp.remove();
  if(!viaAI){
    ans=botReply(q);
    if(!chatAiAvailable()&&!chatNotified){
      chatNotified=true;
      ans+='\n\n'+L('Catatan: jawaban di atas dari mesin analisis lokal. Untuk jawaban AI yang memahami konteks bebas, buka dashboard sebagai file HTML lalu tekan ikon ⚙ di kepala chat dan masukkan kunci API Anthropic.','Note: the answer above comes from the local analysis engine. For AI answers with free-form context, open the dashboard as an HTML file, press the ⚙ icon in the chat header, and enter an Anthropic API key.');
    }
  }
  chatHist.push({role:'assistant',content:String(ans).replace(/<[^>]+>/g,'')});
  if(chatHist.length>20)chatHist=chatHist.slice(-20);
  chatPush('bot',viaAI?esc(ans):ans);
}
let chatGreeted=false;
function chatOpen(open){
  const p=document.getElementById('chatPanel');
  p.classList.toggle('open',open);
  if(open&&!chatGreeted){
    chatGreeted=true;
    chatPush('bot',L('Halo! Saya asisten analisis Sophie Martin. Tanyakan apa saja tentang performa iklan, produk, atau kreator. Anda juga bisa memakai tombol saran di bawah.','Hello! I am the Sophie Martin analysis assistant. Ask me anything about ads, product, or creator performance. You can also use the suggestion buttons below.'));
  }
  if(open)document.getElementById('chatIn').focus();
}

/* =================== ROUTER & BOOT =================== */
const TAB_LBL=()=>({
  ringkasan:L('Ringkasan','Summary'),harian:L('Harian','Daily'),platform:'Platform',
  produk:L('Produk','Products'),kreator:L('Kreator','Creators'),
  analisis:L('Analisis','Analysis'),upload:L('Unggah','Upload'),
});
const TABS=[
  ['ringkasan',renderOverview],
  ['harian',renderDaily],
  ['platform',renderPlatforms],
  ['produk',renderProducts],
  ['kreator',renderCreators],
  ['analisis',renderAnalytics],
  ['upload',renderUpload],
];
const HIDDEN_ROUTES={bandingkan:['harian',renderCompare]};
let curTab='ringkasan';
function buildTabs(){
  const tabs=document.getElementById('tabs');
  const lbl=TAB_LBL();
  tabs.innerHTML=TABS.map(t=>`<button data-tab="${t[0]}">${lbl[t[0]]}</button>`).join('');
  tabs.querySelectorAll('button').forEach(b=>b.onclick=()=>location.hash='#/'+b.dataset.tab);
  tabs.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.tab===curTab));
}
function updateBadge(){
  ALERTS=computeAlerts();
  const n=ALERTS.alerts.filter(a=>a.sev!=='info').length;
  const b=document.querySelector('nav.tabs button[data-tab="analisis"]');
  if(b)b.innerHTML=TAB_LBL().analisis+(n?`<span class="n">${n}</span>`:'');
}
function applyLangUi(){
  applyLang();
  document.getElementById('langBtn').textContent=LANG.toUpperCase();
  document.getElementById('brandSub').textContent=L('Ads Command Center · Database Iklan Semua Platform','Ads Command Center · All Platform Ads Database');
  document.getElementById('periodPill').textContent='2025 - '+mkLabel(LATEST);
  document.getElementById('asOfPill').textContent=L('Data hingga ','Data through ')+isoLabelY(LATEST_LAST_ISO());
  chatTexts();chatChipsRender();
  buildTabs();updateBadge();
}
function nav(){
  const h=(location.hash||'#/ringkasan').replace('#/','');
  if(HIDDEN_ROUTES[h]){
    curTab=HIDDEN_ROUTES[h][0];
    document.querySelectorAll('nav.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===curTab));
    view.innerHTML='';HIDDEN_ROUTES[h][1]();
    window.scrollTo({top:0});return;
  }
  const t=TABS.find(t=>t[0]===h)||TABS[0];
  curTab=t[0];
  document.querySelectorAll('nav.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===curTab));
  view.innerHTML='';t[1]();
  window.scrollTo({top:0});
}
/* snapshot HTML bersih (sebelum #view diisi) untuk ekspor file mandiri */
let PRISTINE_HTML='';
/* halaman artifact claude.ai berjalan dalam iframe sandbox yang memblokir unduhan;
   di lingkungan itu ekspor beralih ke clipboard */
const IN_ARTIFACT=(()=>{try{return window.self!==window.top}catch(e){return true}})();
function currentBake(){
  return { stamp:new Date().toISOString(), origin:IN_ARTIFACT?'artifact':'file',
    keys:{ [LS_O]:overlay, [LS_P]:prodStore, [LS_V]:vidStore, [LS_PN]:prodNames,
      [LS_B]:budgetOv, [LS_GMVMP]:gmvMpOv, [LS_T]:targets, [LS_MASK]:maskMonths } };
}
function uiAlert(title,msg,ok){
  return new Promise(res=>{
    modalBox.innerHTML=`<h4>${title}</h4>${msg?`<p>${msg}</p>`:''}
      <div class="row"><button class="btn" id="mOk">${ok||'OK'}</button></div>`;
    modalWrap.classList.add('open');
    const done=()=>{modalWrap.classList.remove('open');res(true);};
    document.getElementById('mOk').onclick=done;
    modalWrap.onclick=e=>{if(e.target===modalWrap)done();};
  });
}
function exportTeamHtml(){
  const json=JSON.stringify(currentBake()).replace(/<\//g,'<\\/');
  const html=PRISTINE_HTML.replace(/(<script id="BAKED_STATE"[^>]*>)[\s\S]*?(<\/script>)/,
    (m,a,b)=>a+json+b);
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));
  a.download='ads-command-center-'+LATEST+'.html';a.click();
}
function boot(){
  PRISTINE_HTML='<!doctype html>\n'+document.documentElement.outerHTML;
  applyLangUi();
  document.getElementById('langBtn').onclick=()=>{
    LANG=LANG==='id'?'en':'id';
    store.set(LS_LANG,LANG);
    applyLangUi();
    nav();
  };
  const mq=matchMedia('(prefers-color-scheme: dark)');
  const applyOs=()=>document.documentElement.dataset.osdark=mq.matches?'1':'0';
  applyOs();mq.addEventListener('change',applyOs);
  const saved=store.get(LS_TH,null);
  if(saved)document.documentElement.dataset.theme=saved;
  document.getElementById('themeBtn').onclick=()=>{
    const cur=document.documentElement.dataset.theme;
    const isDark=cur?cur==='dark':mq.matches;
    const next=isDark?'light':'dark';
    document.documentElement.dataset.theme=next;store.set(LS_TH,next);
    nav();
  };
  /* chatbot */
  document.getElementById('chatFab').onclick=()=>chatOpen(!document.getElementById('chatPanel').classList.contains('open'));
  document.getElementById('chatCfg').onclick=async()=>{
    if(window.claude&&window.claude.complete){
      uiToast(L('Mode AI sudah aktif melalui lingkungan artifact.','AI mode is already active through the artifact environment.'));return;
    }
    const v=await uiPrompt({title:L('Mode AI Chatbot','Chatbot AI Mode'),
      label:L('Tempel kunci API Anthropic (sk-ant-...) agar chatbot dijawab Claude dengan konteks data dashboard. Kunci hanya disimpan di browser ini dan dipakai langsung ke api.anthropic.com. Kosongkan lalu Simpan untuk menonaktifkan.','Paste an Anthropic API key (sk-ant-...) so the chatbot is answered by Claude with dashboard data context. The key is stored only in this browser and used directly against api.anthropic.com. Clear and Save to disable.'),
      value:store.get(LS_KEY,''),ok:L('Simpan','Save'),cancel:L('Batal','Cancel')});
    if(v===null)return;
    store.set(LS_KEY,v.trim());chatTexts();
    uiToast(v.trim()?L('Mode AI aktif.','AI mode enabled.'):L('Mode AI dimatikan; memakai mesin lokal.','AI mode disabled; using the local engine.'));
  };
  document.getElementById('chatClose').onclick=()=>chatOpen(false);
  document.getElementById('chatSend').onclick=()=>chatAsk(document.getElementById('chatIn').value);
  document.getElementById('chatIn').onkeydown=e=>{if(e.key==='Enter')chatAsk(e.target.value);};
  addEventListener('hashchange',nav);
  let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(nav,220);});
  document.body.addEventListener('click',e=>{
    const tr=e.target.closest('tr[data-nav]');if(tr)location.hash=tr.dataset.nav;
  });
  nav();
}
boot();
</script>
