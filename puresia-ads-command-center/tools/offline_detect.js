// stub lingkungan minimal agar detectRows dari dashboard bisa jalan di Node
const LANG='id';
const L=(a,b)=>a;
const MONTHS_S=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const dayOf=iso=>+String(iso).slice(8,10);
const mkOf=iso=>String(iso).slice(0,7);
const isoLabel=iso=>dayOf(iso)+' '+MONTHS_S[+String(iso).slice(5,7)-1];
const isoLabelY=iso=>isoLabel(iso)+' '+String(iso).slice(0,4);
const inData=iso=>true;
const chName=id=>id;
const fmtRpC=v=>String(v);
const fmtN=v=>String(v);
const sum=a=>a.reduce((x,y)=>x+(+y||0),0);
const fmtNC=v=>String(v);const fmtPct=v=>String(v);const fmtX=v=>String(v);const fmtRp=v=>String(v);const nf0={format:v=>String(v)};const nf1={format:v=>String(v)};
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
function plausibleIso(iso){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(iso))return false;
  const y=+iso.slice(0,4),m=+iso.slice(5,7),d=+iso.slice(8,10);
  return y>=2024&&y<=2030&&m>=1&&m<=12&&d>=1&&d<=31;
}
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
  return iso&&plausibleIso(iso)?iso:null;
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
  if(/pure/.test(n))return 'tt_live_smo';
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
    (head400.includes('Ads Report - Shopee')||head400.includes('Search Ads Report')||head400.includes('Shop+ Ads Report'))?'shopee_toko':
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
      if(fnDate&&!plausibleIso(fnDate))fnDate=null;
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
  hi=findHeader(rows,['Nama kampanye','Biaya']);
  if(hi<0)hi=findHeader(rows,['Campaign name','Cost']);
  if(hi<0){
    for(let i=0;i<Math.min(rows.length,5);i++){
      const set=H_at(i);
      if((set.includes('Nama kampanye')&&set.some(h=>/Biaya/.test(h)))||(set.includes('Campaign name')&&set.some(h=>/^Cost$/i.test(h)))){hi=i;break;}
    }
  }
  if(hi>=0){
    const H=H_at(hi);
    const cName=colIdxOf(H,'Nama kampanye','Campaign name'),
          cBiaya=colIdxOf(H,'Biaya','Cost'),cOrd=H.findIndex(h=>/^Pesanan|^SKU orders$|^Orders\b/i.test(h)),
          cRev=H.findIndex(h=>/Pendapatan kotor|Penghasilan bruto|Gross revenue/i.test(h)),
          cLive=H.findIndex(h=>/Tayangan LIVE$|LIVE views$/i.test(h)),
          cImp=H.findIndex(h=>/Impresi|impressions/i.test(h)),cClk=H.findIndex(h=>/Jumlah klik|ad clicks$/i.test(h)),
          cJenis=colIdxOf(H,'Jenis materi iklan','Creative type'),
          cWaktu=H.findIndex(h=>/Waktu peluncuran|Launch time/i.test(h)),cDate=colIdxOf(H,'Date','Tanggal','Hari'),
          cProdId=colIdxOf(H,'ID produk','Product ID'),cVidT=colIdxOf(H,'Judul video','Video title'),
          cVidId=colIdxOf(H,'ID video','Video ID'),cAkun=colIdxOf(H,'Akun TikTok','TikTok account'),
          cPName=colIdxOf(H,'Nama produk','Nama Produk','Product name','Judul produk');
    const isLive=cLive>=0||cWaktu>=0;
    const hasDateCol=cWaktu>=0||cDate>=0;
    let fnDate=null,m2;
    if((m2=String(filename||'').match(/(\d{4})[-_.](\d{2})[-_.](\d{2})/)))fnDate=`${m2[1]}-${m2[2]}-${m2[3]}`;
    else if((m2=String(filename||'').match(/(\d{2})[-_.](\d{2})[-_.](\d{4})/)))fnDate=`${m2[3]}-${m2[2]}-${m2[1]}`;
    if(fnDate&&!plausibleIso(fnDate))fnDate=null;
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
     Akun (Official/Affiliate) dipilih manual karena file hanya memuat User Id. --- */
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
      if(n.includes('pure')||n.includes('official'))return 'tt_live_smo';
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
  return {error:L('Format tidak dikenali. Didukung: CSV Shopee (Iklan CPC / Toko / SBA / Live), Meta CSV/XLSX (kolom Day), TikTok GMV Max (Live dan Product), Produk Klik Live.','Unrecognized format. Supported: Shopee CSV (CPC / Shop / SBA / Live Ads), Meta CSV/XLSX (Day column), TikTok GMV Max (Live and Product), Live Product Clicks.')};
}
const decodeXml=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&');
const colIdx=ref=>{let n=0;for(const ch of ref)n=n*26+(ch.charCodeAt(0)-64);return n-1;};
function mergeDetail(storeArr, incoming){
  const keys=new Set(incoming.map(r=>r.chId+'|'+r.iso));
  const kept=storeArr.filter(r=>!keys.has(r.chId+'|'+r.iso));
  return kept.concat(incoming);
}
// ---- driver ----
const fs=require('fs');
function mdToRows(text){
  const rows=[];
  for(const line of text.split(/\r?\n/)){
    if(!line.trim())continue;
    let cells=line.replace(/^\s*\|/,'').replace(/\|\s*$/,'').split('|')
      .map(c=>c.replace(/\\\[merged\\\]\s*/g,'').replace(/\[merged\]\s*/g,'').replace(/\\([|\[\]().+\-!])/g,'$1').trim());
    if(cells.every(c=>/^:?-+:?$/.test(c)||c===''))continue;
    rows.push(cells);
  }
  return rows;
}
const FOLDER_CH={klik_sp_live:'sp_live',klik_pure:'tt_live_smo',klik_aff:'tt_live_aff',sp_toko:'sp_store',sp_sba:'sp_sba',sp_live:'sp_live'};
const [,,mode,path,folderKey,fileId,...tparts]=process.argv;
const title=tparts.join(' ');
const text=fs.readFileSync(path,'utf8').replace(/^﻿/,'');
const rows=mode==='--md'?mdToRows(text):(mode==='--rows'?JSON.parse(text):csvParse(text));
const det=detectRows(rows,title);
const out={fileId,title,folderKey};
const fch=FOLDER_CH[folderKey];
if(det.error){out.skip=det.error;}
else{
  if(det.mapping)out.mapping=det.mapping;
  let entries=null;
  if(det.entries)entries=det.entries.map(e=>({...e,chId:fch||e.chId||det.defaultCh}));
  else if(det.entriesNoDate){
    if(!det.date)out.skip='tanggal tidak terbaca';
    else entries=det.entriesNoDate.map(e=>({...e,iso:det.date,chId:fch||e.chId||det.defaultCh}));
  }else if(det.single){
    if(!det.date)out.skip='tanggal tidak terbaca';
    else entries=[{chId:fch||det.defaultCh,iso:det.date,metrics:det.single}];
  }
  if(entries)out.entries=entries;
  if(det.products&&det.products.length)out.products=det.products.map(p=>({...p,chId:p.chId||fch||det.defaultCh,iso:p.iso||det.date}));
  if(det.videos&&det.videos.length)out.videos=det.videos.map(v=>({...v,iso:v.iso||det.date}));
  out.type=det.type;out.label=det.label;
}
fs.mkdirSync('entries',{recursive:true});
fs.writeFileSync('entries/'+fileId+'.json',JSON.stringify(out));
const n=(out.entries||[]).length;
console.log((out.skip?'SKIP: '+out.skip:'OK '+out.type+' · '+n+' entri'+(out.products?' · '+out.products.length+' produk':'')+(out.videos?' · '+out.videos.length+' video':''))+' :: '+title);
