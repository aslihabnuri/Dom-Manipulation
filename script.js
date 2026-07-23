/* ═══════════════════════════════════════════════════════
   LARISIN · Mesin generator listing Shopee & TikTok Shop
   - Bank keyword pencarian tertinggi per industri
   - Formula judul SEO (keyword utama di depan)
   - Deskripsi terstruktur + paragraf keyword + hashtag
   - Prompt gambar ChatGPT (EN) + copy text overlay (ID)
   ═══════════════════════════════════════════════════════ */

// ── Bank keyword: kata yang paling banyak dicari pembeli per industri ──
const KEYWORDS = {
  fashionWanita: {
    utama: ["wanita", "korean style", "oversize", "premium", "kekinian", "polos", "import", "aesthetic", "jumbo", "vintage"],
    tren: ["viral", "terbaru 2026", "ootd", "bahan tebal", "bisa COD", "best seller"],
    benefit: ["bahan adem & nggak nerawang", "jahitan rapi anti dedel", "size lengkap sampai jumbo", "cocok buat daily & hangout"],
    hashShopee: ["#fashionwanita", "#ootdwanita", "#bajuwanita", "#koreanstyle", "#racunshopee"],
    hashTiktok: ["#RacunTikTok", "#OOTDIndo", "#FashionCheck", "#TikTokShopHaul", "#GRWM"]
  },
  fashionPria: {
    utama: ["pria", "distro", "original", "premium", "oversize", "polos", "keren", "cowok", "casual"],
    tren: ["viral", "terbaru 2026", "streetwear", "bisa COD", "best seller"],
    benefit: ["bahan tebal nggak gampang melar", "sablon awet anti retak", "size M sampai XXL", "cocok buat nongkrong & kerja"],
    hashShopee: ["#fashionpria", "#kaospria", "#distrooriginal", "#bajucowok", "#streetwear"],
    hashTiktok: ["#OOTDPria", "#StyleCowok", "#TikTokShop", "#MensFashion", "#ViralTikTok"]
  },
  fashionMuslim: {
    utama: ["muslimah", "syari", "premium", "voal", "instan", "polos", "motif", "terbaru"],
    tren: ["viral", "lebaran 2026", "adem", "bisa COD", "best seller"],
    benefit: ["bahan adem menyerap keringat", "nggak nerawang & jatuh di badan", "warna kalem mudah di-mix & match", "jahitan tepi rapi"],
    hashShopee: ["#fashionmuslim", "#gamisterbaru", "#hijabvoal", "#muslimahstyle", "#bajumuslim"],
    hashTiktok: ["#HijabStyle", "#MuslimahIndonesia", "#OOTDHijab", "#TikTokShop", "#GamisViral"]
  },
  beauty: {
    utama: ["glowing", "BPOM", "original", "wajah", "brightening", "acne", "halal", "skincare"],
    tren: ["viral", "racun TikTok", "paket lengkap", "bisa COD", "best seller"],
    benefit: ["sudah teruji & terdaftar BPOM", "aman untuk kulit sensitif", "hasil terlihat dalam pemakaian rutin", "tekstur ringan cepat meresap"],
    hashShopee: ["#skincareviral", "#glowingskin", "#skincarebpom", "#serumwajah", "#racunshopee"],
    hashTiktok: ["#SkincareTikTok", "#GlowUp", "#BeautyHaul", "#SkincareRoutine", "#RacunTikTok"]
  },
  ibuBayi: {
    utama: ["bayi", "anak", "SNI", "premium", "newborn", "lembut", "perlengkapan"],
    tren: ["viral", "terlaris", "hampers bayi", "bisa COD", "best seller"],
    benefit: ["berstandar SNI, aman untuk si kecil", "bahan lembut ramah kulit bayi", "mudah dicuci & cepat kering", "cocok untuk kado lahiran"],
    hashShopee: ["#perlengkapanbayi", "#bajubayi", "#mainananak", "#kadolahiran", "#ibudanbayi"],
    hashTiktok: ["#MomsOfTikTok", "#BayiLucu", "#PerlengkapanBayi", "#TikTokShop", "#ParentingIndo"]
  },
  elektronik: {
    utama: ["original", "bluetooth", "wireless", "garansi resmi", "fast charging", "gaming", "TWS"],
    tren: ["viral", "terbaru 2026", "low budget", "bisa COD", "best seller"],
    benefit: ["garansi resmi, bukan barang KW", "baterai awet seharian", "kompatibel semua perangkat", "kualitas setara brand mahal"],
    hashShopee: ["#elektronikmurah", "#twsbluetooth", "#aksesorishp", "#gadgetviral", "#garansiresmi"],
    hashTiktok: ["#TechTok", "#GadgetMurah", "#UnboxingTikTok", "#TikTokShopFinds", "#RacunGadget"]
  },
  fnb: {
    utama: ["halal", "kekinian", "premium", "asli", "khas", "camilan", "1kg"],
    tren: ["viral", "pedas nampol", "enak banget", "bisa COD", "best seller"],
    benefit: ["100% halal & higienis", "tanpa pengawet berbahaya", "packing rapat aman dikirim jauh", "cocok buat stok camilan & oleh-oleh"],
    hashShopee: ["#camilanviral", "#makananhalal", "#snackkekinian", "#jajananviral", "#kulinerindo"],
    hashTiktok: ["#FoodTok", "#CamilanViral", "#MukbangIndo", "#TikTokFood", "#JajananTikTok"]
  },
  rumahTangga: {
    utama: ["serbaguna", "multifungsi", "aesthetic", "premium", "portable", "anti slip"],
    tren: ["viral", "wajib punya", "praktis banget", "bisa COD", "best seller"],
    benefit: ["hemat tempat, gampang disimpan", "material tebal awet bertahun-tahun", "desain aesthetic cocok segala ruangan", "mudah dibersihkan"],
    hashShopee: ["#perabotrumah", "#alatrumahtangga", "#homedecor", "#rumahaesthetic", "#peralatandapur"],
    hashTiktok: ["#RacunRumahTangga", "#HomeDecorTikTok", "#BeberesRumah", "#TikTokShopFinds", "#RumahAesthetic"]
  },
  kesehatan: {
    utama: ["herbal", "BPOM", "halal", "original", "alami", "stamina"],
    tren: ["viral", "terlaris", "khasiat nyata", "bisa COD", "best seller"],
    benefit: ["100% bahan alami pilihan", "terdaftar BPOM & bersertifikat halal", "tanpa efek samping bila sesuai anjuran", "sudah dipercaya ribuan pelanggan"],
    hashShopee: ["#herbalalami", "#kesehatankeluarga", "#vitaminbpom", "#obatherbal", "#hidupsehat"],
    hashTiktok: ["#HealthTok", "#HerbalIndonesia", "#SehatAlami", "#TikTokShop", "#TipsSehat"]
  },
  olahraga: {
    utama: ["gym", "original", "premium", "anti slip", "portable", "outdoor"],
    tren: ["viral", "terbaru 2026", "home workout", "bisa COD", "best seller"],
    benefit: ["material heavy duty tahan banting", "ringan & mudah dibawa ke mana saja", "grip mantap anti licin", "cocok pemula sampai atlet"],
    hashShopee: ["#alatolahraga", "#gymequipment", "#homeworkout", "#olahragadirumah", "#outdoorgear"],
    hashTiktok: ["#GymTok", "#WorkoutIndo", "#SportTikTok", "#TikTokShopSport", "#FitnessJourney"]
  }
};

// ── Gaya visual per tone brand (untuk prompt gambar) ──
const TONE_STYLE = {
  playful: {
    photo: "vibrant playful pop-style photography, bold saturated colors, fun geometric props, high-energy composition",
    mood: "fun, youthful, eye-catching",
    hook: (p, b) => `Siap-siap jatuh cinta sama ${p} dari ${b}! 😍`
  },
  premium: {
    photo: "luxurious editorial product photography, soft diffused studio lighting, elegant marble or silk textures, refined minimal composition",
    mood: "premium, sophisticated, trustworthy",
    hook: (p, b) => `${p} dari ${b}: kualitas premium yang langsung terasa bedanya. ✨`
  },
  natural: {
    photo: "organic natural photography, warm daylight, botanical elements, wooden and linen textures, earthy calm palette",
    mood: "natural, honest, calming",
    hook: (p, b) => `Kebaikan alami dalam setiap ${p} dari ${b} 🌿`
  },
  bold: {
    photo: "high-contrast dramatic product photography, dynamic diagonal angles, strong colored lighting, energetic composition",
    mood: "bold, confident, striking",
    hook: (p, b) => `Bukan ${p} biasa. ${b} hadir buat yang berani beda. 🔥`
  },
  minimal: {
    photo: "clean minimalist product photography, generous negative space, soft neutral background, subtle soft shadows, precise composition",
    mood: "clean, modern, effortless",
    hook: (p, b) => `Simpel, fungsional, tanpa drama. Kenalin ${p} dari ${b}.`
  },
  warm: {
    photo: "warm cozy lifestyle photography, golden hour lighting, homey inviting atmosphere, soft comfortable textures",
    mood: "warm, friendly, familiar",
    hook: (p, b) => `Teman baru buat hari-harimu: ${p} dari ${b} 🤗`
  }
};

// ── Util ──
const $ = (id) => document.getElementById(id);
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const pick = (arr, n) => shuffle(arr).slice(0, n);

// Rangkai kata tanpa duplikat kata (case-insensitive), rapikan spasi
function joinUnique(parts) {
  const seen = new Set();
  const out = [];
  parts.join(" ").split(/\s+/).forEach((w) => {
    const key = w.toLowerCase();
    if (!w) return;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(w);
  });
  return out.join(" ").trim();
}

function titleCase(s) {
  return s.replace(/\S+/g, (w) => (/^[A-Z0-9#&%]+$/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)));
}

// ── Ambil & validasi input ──
function collect() {
  const usps = $("usp").value.split("\n").map((s) => s.trim()).filter(Boolean);
  return {
    brand: $("brandName").value.trim(),
    industry: $("industry").value,
    tone: $("tone").value,
    audience: $("audience").value.trim(),
    color1: $("color1hex").value.trim() || $("color1").value,
    color2: $("color2hex").value.trim() || $("color2").value,
    usps,
    guideline: $("guideline").value.trim(),
    product: $("productName").value.trim(),
    specs: $("specs").value.trim(),
    variants: $("variants").value.trim(),
    promo: $("promo").value.trim()
  };
}

// ── Generator nama produk ──
function makeNames(d) {
  const kw = KEYWORDS[d.industry];
  const u = pick(kw.utama, 4);
  const t = pick(kw.tren, 3);

  const shopeePatterns = [
    [d.product, d.brand, u[0], u[1], d.specs, t[0]],
    [d.product, u[0], d.brand, d.specs, d.variants, t[1]],
    [d.product, u[1], u[2], d.specs, d.brand, "COD"],
    [d.brand, d.product, u[0], u[3], t[0], d.variants],
    [d.product, d.brand, t[2], u[2], d.variants]
  ];
  const tiktokPatterns = [
    [d.product, d.brand, t[0]],
    [d.brand, d.product, u[0]],
    [d.product, u[1], t[1]]
  ];

  const build = (p) => titleCase(joinUnique(p.filter(Boolean)));
  return {
    shopee: shopeePatterns.map(build),
    tiktok: tiktokPatterns.map(build)
  };
}

// ── Generator deskripsi ──
function makeDescriptions(d) {
  const kw = KEYWORDS[d.industry];
  const tone = TONE_STYLE[d.tone];
  const hook = tone.hook(d.product, d.brand);
  const benefits = [...d.usps, ...pick(kw.benefit, 2)];
  const kwParagraph = joinUnique([d.product, ...pick(kw.utama, 5), ...pick(kw.tren, 3)]).toLowerCase();

  const shopee = [
    hook,
    "",
    `✨ KENAPA HARUS ${d.brand.toUpperCase()}?`,
    ...benefits.map((b) => `✔️ ${b}`),
    "",
    "📋 SPESIFIKASI",
    `• Produk: ${d.product}`,
    d.specs ? `• Bahan/Kandungan: ${d.specs}` : null,
    d.variants ? `• Varian: ${d.variants}` : null,
    "",
    d.promo ? `🔥 PROMO HARI INI: ${d.promo}\n` : null,
    "🛒 CARA ORDER",
    "1. Pilih varian yang kamu mau",
    "2. Klik + Keranjang atau Beli Sekarang",
    "3. Bisa COD (bayar di tempat), aman!",
    "",
    "💯 Barang dikirim dari gudang kami dengan packing aman & rapi. Ada kendala? Chat kami, admin fast respon!",
    "",
    `Kata kunci: ${kwParagraph}`,
    "",
    pick(kw.hashShopee, 4).join(" ")
  ].filter((x) => x !== null).join("\n");

  const tiktok = [
    hook,
    "",
    ...benefits.slice(0, 3).map((b) => `✅ ${b}`),
    d.promo ? `\n🔥 ${d.promo}, cuma di keranjang kuning!` : "",
    "",
    "Stok sering ludes, checkout sekarang sebelum kehabisan! 🛒",
    "",
    pick(kw.hashTiktok, 4).join(" ")
  ].filter((x) => x !== null).join("\n");

  return { shopee, tiktok };
}

// ── Copy text overlay gambar ──
function makeCopyText(d) {
  const shortUsp = [...d.usps].sort((a, b) => a.length - b.length)[0] || "";
  const secondUsp = d.usps.find((u) => u !== shortUsp) || "";
  return {
    headline: shortUsp.toUpperCase(),
    sub: secondUsp || `${d.product} dari ${d.brand}`,
    badge: (d.promo || "100% ORIGINAL").toUpperCase(),
    cta: "CHECKOUT SEKARANG!"
  };
}

// ── Generator prompt gambar (bahasa Inggris untuk ChatGPT) ──
function makePrompts(d) {
  const tone = TONE_STYLE[d.tone];
  const copy = makeCopyText(d);
  const audience = d.audience ? `Indonesian ${d.audience}` : "young Indonesian online shoppers";
  const brandLine = `Brand: "${d.brand}". Primary brand color ${d.color1}, secondary color ${d.color2}. Brand mood: ${tone.mood}.`;
  const extra = d.guideline ? `\nAdditional brand guideline to respect (may be in Indonesian): "${d.guideline}".` : "";

  const p1 = `Professional e-commerce product photo for online marketplace thumbnail.
Product: ${d.product}${d.specs ? ` (${d.specs})` : ""}.
${brandLine}
Style: ${tone.photo}.
Composition: product as the hero in the center, shot on a clean background using the primary brand color ${d.color1} as a soft backdrop with subtle ${d.color2} accents, leave clear negative space at the top for text overlay, square 1:1 aspect ratio, ultra sharp details, commercial studio quality, no text, no watermark, no human hands.${extra}`;

  const p2 = `Lifestyle product photography for social commerce (TikTok Shop / Shopee feed).
Product: ${d.product} being used naturally by ${audience}.
${brandLine}
Style: ${tone.photo}, candid authentic feeling, relatable everyday Indonesian setting.
Composition: product clearly visible and in focus, warm engaging expression, vertical-friendly framing that also crops well to 1:1, natural imperfect realism (not overly staged), no text, no watermark.${extra}`;

  const p3 = `Promotional e-commerce banner / infographic image, square 1:1.
Product: ${d.product} photographed beautifully as the main object.
${brandLine}
Style: ${tone.photo}, layout like a top-selling Indonesian marketplace promo banner.
Text overlays to render EXACTLY as written (Indonesian):
- Big bold headline: "${copy.headline}"
- Smaller subheadline: "${copy.sub}"
- Promo badge/sticker shape in ${d.color2}: "${copy.badge}"
- Button-style call to action at the bottom: "${copy.cta}"
Use bold legible typography with strong contrast against ${d.color1} background, clean hierarchy, professional retail design, no watermark.${extra}`;

  return [
    { tag: "GAMBAR 1", title: "Foto Utama · Thumbnail Katalog", prompt: p1, copy: null,
      note: "Versi bersih tanpa teks: paling aman untuk foto sampul karena Shopee menurunkan performa thumbnail yang penuh teks." },
    { tag: "GAMBAR 2", title: "Lifestyle · Konten Feed & Video Cover", prompt: p2, copy: null,
      note: "Cocok untuk slide ke-2/3 katalog dan cover konten TikTok. Nuansa 'dipakai orang beneran' menaikkan kepercayaan." },
    { tag: "GAMBAR 3", title: "Banner Promo · Dengan Copy Text", prompt: p3, copy,
      note: "ChatGPT (GPT-4o) bisa merender teks. Kalau teks hasilnya typo, minta: 'perbaiki teksnya, tulis persis seperti ini'." }
  ];
}

// ── Render ──
function esc(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function charMeta(text, platform) {
  const len = text.length;
  if (platform === "shopee") {
    const ok = len >= 40 && len <= 100;
    return `<span class="${ok ? "ok" : "warn"}">${len} karakter</span> · ideal 40–100 (maks 255)`;
  }
  const visible = text.slice(0, 34);
  return `<span class="${len <= 80 ? "ok" : "warn"}">${len} karakter</span> · tampil di feed: “${esc(visible)}${len > 34 ? "…" : ""}”`;
}

function nameCard(text, platform) {
  return `<div class="rcard">
    <div class="rcard__body">
      <div class="rcard__text">${esc(text)}</div>
      <div class="rcard__meta">${charMeta(text, platform)}</div>
    </div>
    <button class="btn-copy" data-copy="${esc(text)}">SALIN</button>
  </div>`;
}

function blockCard(text) {
  return `<div class="rcard rcard--block">
    <div class="rcard__text">${esc(text)}</div>
    <button class="btn-copy" data-copy="${esc(text)}">SALIN DESKRIPSI</button>
  </div>`;
}

function promptCard(p) {
  const copyBlock = p.copy ? `<div class="pcard__copytext">
      <strong>Copy Text di Gambar</strong>
      <ul>
        <li>${esc(p.copy.headline)} <span>· headline besar</span></li>
        <li>${esc(p.copy.sub)} <span>· subheadline</span></li>
        <li>${esc(p.copy.badge)} <span>· badge promo</span></li>
        <li>${esc(p.copy.cta)} <span>· tombol CTA</span></li>
      </ul>
    </div>` : "";
  return `<div class="pcard">
    <div class="pcard__title"><span class="pcard__tag">${p.tag}</span> ${esc(p.title)}</div>
    <div class="pcard__prompt">${esc(p.prompt)}</div>
    ${copyBlock}
    <div class="rcard__meta" style="margin-top:10px">💡 ${esc(p.note)}</div>
    <button class="btn-copy" style="margin-top:12px" data-copy="${esc(p.prompt)}">SALIN PROMPT</button>
  </div>`;
}

function renderAll() {
  const d = collect();
  const names = makeNames(d);
  const desc = makeDescriptions(d);
  const prompts = makePrompts(d);

  $("shopeeNames").innerHTML = names.shopee.map((n) => nameCard(n, "shopee")).join("");
  $("tiktokNames").innerHTML = names.tiktok.map((n) => nameCard(n, "tiktok")).join("");
  $("shopeeDesc").innerHTML = blockCard(desc.shopee);
  $("tiktokDesc").innerHTML = blockCard(desc.tiktok);
  $("imagePrompts").innerHTML = prompts.map(promptCard).join("");
}

// ── Events ──
$("generateBtn").addEventListener("click", () => {
  const d = collect();
  const valid = d.brand && d.product && d.usps.length > 0;
  $("formError").hidden = valid;
  if (!valid) return;

  saveForm();
  renderAll();
  $("results").hidden = false;
  $("results").scrollIntoView({ behavior: "smooth", block: "start" });
});

$("rerollBtn").addEventListener("click", renderAll);

// Tabs
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => {
      t.classList.remove("is-active");
      t.setAttribute("aria-selected", "false");
    });
    document.querySelectorAll(".tabpane").forEach((p) => p.classList.remove("is-active"));
    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");
    $(`pane-${tab.dataset.tab}`).classList.add("is-active");
  });
});

// Copy (event delegation, karena kartu dirender ulang)
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-copy");
  if (!btn) return;
  const text = btn.dataset.copy;
  const done = () => {
    btn.classList.add("copied");
    const old = btn.textContent;
    btn.textContent = "TERSALIN ✔";
    showToast();
    setTimeout(() => { btn.classList.remove("copied"); btn.textContent = old; }, 1600);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
});

function fallbackCopy(text, done) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); done(); } catch (err) { /* clipboard tidak tersedia */ }
  document.body.removeChild(ta);
}

let toastTimer;
function showToast() {
  const t = $("toast");
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

// Sinkronisasi color picker <-> input hex
[["color1", "color1hex"], ["color2", "color2hex"]].forEach(([pickerId, hexId]) => {
  $(pickerId).addEventListener("input", () => { $(hexId).value = $(pickerId).value.toUpperCase(); });
  $(hexId).addEventListener("input", () => {
    const v = $(hexId).value;
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) $(pickerId).value = v;
  });
});

// ── Simpan & pulihkan isian form (localStorage) ──
const FORM_IDS = ["brandName", "industry", "tone", "audience", "color1hex", "color2hex", "usp", "guideline", "productName", "specs", "variants", "promo"];

function saveForm() {
  const data = {};
  FORM_IDS.forEach((id) => { data[id] = $(id).value; });
  try { localStorage.setItem("larisin-form", JSON.stringify(data)); } catch (err) { /* storage penuh/di-block */ }
}

function loadForm() {
  try {
    const raw = localStorage.getItem("larisin-form");
    if (!raw) return;
    const data = JSON.parse(raw);
    FORM_IDS.forEach((id) => { if (data[id] !== undefined) $(id).value = data[id]; });
    if (/^#[0-9A-Fa-f]{6}$/.test($("color1hex").value)) $("color1").value = $("color1hex").value;
    if (/^#[0-9A-Fa-f]{6}$/.test($("color2hex").value)) $("color2").value = $("color2hex").value;
  } catch (err) { /* abaikan data korup */ }
}

loadForm();
