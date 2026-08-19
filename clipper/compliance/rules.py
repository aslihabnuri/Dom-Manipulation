"""Claim rules for Indonesian TikTok Shop live commerce.

Patterns are deliberately context-sensitive. A bare "100%" is fine ("100% katun"),
a bare "gratis" is fine ("gratis ongkir"), and "obat" is fine for a registered
product -- only the risky *combinations* fire. A linter that cries wolf gets
switched off, which helps nobody.

Severities:
    block -- do not publish; a known route to a Shop or Community violation
    warn  -- publishable, but you must be able to substantiate it
    info  -- worth a look, usually a quality note
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


@dataclass
class Rule:
    id: str
    severity: str
    pattern: str
    message: str
    hint: str = ""
    flags: int = re.IGNORECASE
    _compiled: re.Pattern[str] | None = field(default=None, repr=False, compare=False)

    def compiled(self) -> re.Pattern[str]:
        if self._compiled is None:
            self._compiled = re.compile(self.pattern, self.flags)
        return self._compiled


_DISEASE = r"(?:kanker|diabetes|hipertensi|darah\s*tinggi|asam\s*urat|stroke|tumor|jantung|kolesterol|maag|asma|tbc|hiv|covid|stunting|autis\w*|impoten\w*|mandul)"
_INSTANT = r"(?:instan|seketika|langsung|dalam\s*(?:semalam|sehari|24\s*jam|\d+\s*(?:hari|menit|jam|minggu)))"
_SUPERLATIVE = r"(?:ter(?:murah|baik|laris|bagus|lengkap|besar|kuat|nyaman|hemat)|paling\s+\w+|nomor\s*(?:1|satu)|no\.?\s*1|satu-satunya)"

DEFAULT_RULES: list[Rule] = [
    # --- Medical and health claims -------------------------------------------
    Rule(
        "id.medis.sembuh",
        "block",
        rf"\b(?:menyembuhkan|nyembuhin|mengobati|ngobatin|sembuh(?:kan)?\s+(?:total|permanen))\b|\b(?:sembuh|hilang)\s+(?:dari\s+)?{_DISEASE}",
        "Klaim menyembuhkan/mengobati penyakit.",
        "Ganti ke bahasa fungsi produk: 'membantu menjaga', 'diformulasikan untuk'.",
    ),
    Rule(
        "id.medis.penyakit",
        "warn",
        rf"\b(?:obat|terapi|resep)\b.{{0,40}}{_DISEASE}|{_DISEASE}.{{0,40}}\b(?:obat|terapi|sembuh)\b",
        "Menyebut penyakit spesifik bersama klaim pengobatan.",
        "Klaim medis hanya boleh untuk produk terdaftar dan sesuai izin edarnya.",
    ),
    Rule(
        "id.medis.efeksamping",
        "block",
        r"\btanpa\s+efek\s+samping\b|\b(?:aman|nol)\s+100\s*%|\b100\s*%\s+aman\b",
        "Klaim 'tanpa efek samping' / '100% aman'.",
        "Klaim keamanan absolut dilarang tanpa dasar uji resmi.",
    ),
    Rule(
        "id.medis.bpom",
        "warn",
        r"\b(?:sudah\s+)?bpom\b|\bhalal\s+mui\b|\bfda\b|\bsni\b",
        "Menyebut sertifikasi resmi (BPOM/MUI/FDA/SNI).",
        "Pastikan nomor registrasinya benar dan masih berlaku.",
    ),

    # --- Absolute guarantees --------------------------------------------------
    Rule(
        "id.absolut.persen",
        "block",
        r"\b100\s*%\s*(?:ampuh|berhasil|sembuh|efektif|works?|work|manjur|putih|glowing|hilang)\b",
        "Klaim keberhasilan absolut (100% ampuh/berhasil).",
        "Pakai bahasa berbasis hasil nyata: 'banyak yang cocok', 'hasil bervariasi'.",
    ),
    Rule(
        "id.absolut.jaminan",
        "block",
        r"\b(?:dijamin|jaminan|garansi)\s+(?:ampuh|berhasil|sembuh|putih|kurus|glowing|manjur|cocok)\b|\bpasti\s+(?:sembuh|berhasil|ampuh|putih|kurus|manjur)\b",
        "Menjamin hasil pemakaian.",
        "Garansi hanya untuk hal yang benar dijamin (mis. garansi tukar barang rusak).",
    ),
    Rule(
        "id.absolut.auto",
        "block",
        rf"\bauto\s+(?:putih|glowing|cerah|kurus|langsing|mulus|kinclong|sembuh)\b|\b(?:putih|cerah|glowing|kurus|langsing|mulus)\s+{_INSTANT}",
        "Klaim hasil instan (auto putih / cerah dalam semalam).",
        "Sebutkan rentang waktu wajar dan tambahkan 'hasil tiap orang berbeda'.",
    ),
    Rule(
        "id.absolut.permanen",
        "warn",
        r"\b(?:permanen|selamanya|sekali\s+pakai\s+langsung)\b",
        "Klaim hasil permanen.",
        "Hindari kecuali memang terbukti dan tercantum pada label produk.",
    ),

    # --- Superlatives needing proof ------------------------------------------
    Rule(
        "id.superlatif.ter",
        "warn",
        r"\b(?:termurah|terbaik|terlaris|ternyaman|terbagus|terkuat|paling\s+(?:murah|bagus|baik|laris))\b(?!\s+(?:menurut|versi|di\s+toko))",
        "Klaim superlatif tanpa pembanding.",
        "Tambahkan konteks: 'termurah di toko kami', atau hapus.",
    ),
    Rule(
        "id.superlatif.nomor1",
        "warn",
        r"\b(?:nomor\s*(?:1|satu)|no\.?\s*1|number\s*one|satu-satunya|the\s+only)\b",
        "Klaim nomor satu / satu-satunya.",
        "Perlu data pihak ketiga yang bisa ditunjukkan bila diminta.",
    ),
    Rule(
        "id.superlatif.seindonesia",
        "warn",
        rf"{_SUPERLATIVE}[^.!?]{{0,25}}\b(?:se-?\s*indonesia|seluruh\s+indonesia|nasional)\b"
        rf"|\b(?:se-?\s*indonesia|seluruh\s+indonesia)\b[^.!?]{{0,25}}{_SUPERLATIVE}",
        "Klaim superlatif berskala nasional.",
        "Sulit dibuktikan; persempit ke toko atau marketplace Anda.",
    ),

    # --- Directing traffic off-platform --------------------------------------
    Rule(
        "id.offplatform.kontak",
        "block",
        r"\b(?:wa|w\.a|whatsapp|wasap)\b\s*(?:saya|aku|admin|kami|ya|nya|di|ke|:|\d)|\bchat\s+(?:wa|whatsapp|admin\s+di)\b|\bjapri\b|\bhubungi\s+(?:admin|kami)\s+di\b",
        "Mengarahkan pembeli ke WhatsApp/kontak luar.",
        "Transaksi wajib selesai di dalam TikTok Shop.",
    ),
    Rule(
        "id.offplatform.marketplace",
        "block",
        r"\b(?:shopee|tokopedia|lazada|bukalapak|blibli|tiktok\s*sebelah)\b",
        "Menyebut marketplace lain.",
        "Hapus penyebutan kompetitor platform dari klip.",
    ),
    Rule(
        "id.offplatform.transfer",
        "block",
        r"\b(?:transfer|tf)\s+(?:ke\s+)?(?:rekening|bank|dana|ovo|gopay|shopeepay)\b|\bno\.?\s*(?:rek|rekening)\b|\bcod\s+luar\s+aplikasi\b",
        "Mengarahkan pembayaran di luar platform.",
        "Pembayaran wajib lewat checkout TikTok Shop.",
    ),

    # --- Misleading price and urgency ----------------------------------------
    Rule(
        "id.harga.error",
        "warn",
        r"\b(?:harga\s+(?:error|salah)|salah\s+(?:harga|input)|kelewat\s+murah|rugi\s+banget\s+ini)\b",
        "Framing 'harga error' sebagai umpan.",
        "Dianggap menyesatkan bila harga sebenarnya normal.",
    ),
    Rule(
        "id.harga.gratis",
        "warn",
        r"\bgratis\b(?!\s*(?:ongkir|ongkos|shipping|kirim))",
        "Kata 'gratis' tanpa objek yang jelas.",
        "Sebutkan apa yang gratis dan syaratnya; 'gratis ongkir' aman.",
    ),
    Rule(
        "id.urgensi.stok",
        "info",
        r"\b(?:stok\s+(?:tinggal|sisa|terakhir)|sisa\s+\d+\s*(?:pcs|pieces|biji)|last\s+call)\b",
        "Klaim kelangkaan stok.",
        "Pastikan angkanya benar-benar sesuai stok saat itu.",
    ),

    # --- Prohibited or restricted goods --------------------------------------
    Rule(
        "id.produk.tiruan",
        "block",
        r"\b(?:kw\s*(?:super|1|2|\b)|replika|super\s*copy|mirror\s*quality|ori\s*bm|batam\s*ori|semi\s*ori)\b",
        "Indikasi barang tiruan/replika.",
        "Produk tiruan melanggar HAKI dan berisiko penutupan toko.",
    ),
    Rule(
        "id.produk.terlarang",
        "block",
        r"\b(?:judi|slot\s*gacor|togel|pinjol|investasi\s+(?:pasti|cuan)|profit\s+harian|money\s+game)\b",
        "Menyebut judi/investasi bodong.",
        "Kategori terlarang; hapus seluruhnya dari klip.",
    ),
    Rule(
        "id.produk.dewasa",
        "block",
        r"\b(?:alat\s+bantu\s+seks|obat\s+kuat|pembesar\s+(?:alat|payudara)|perangsang)\b",
        "Produk dewasa/terbatas.",
        "Kategori ini dilarang tayang di TikTok Shop.",
    ),

    # --- Platform integrity ---------------------------------------------------
    Rule(
        "id.integritas.engagement",
        "warn",
        r"\b(?:follow\s+dulu\s+baru|like\s+dulu\s+baru|share\s+dulu\s+baru|wajib\s+follow)\b",
        "Memaksa engagement sebagai syarat.",
        "Boleh mengajak, tidak boleh mewajibkan untuk dapat harga/hadiah.",
    ),
    Rule(
        "id.integritas.giveaway",
        "warn",
        r"\b(?:giveaway|bagi-bagi\s+(?:hadiah|uang)|undian\s+berhadiah)\b",
        "Menyebut giveaway/undian.",
        "Undian berhadiah punya aturan tersendiri; cek ketentuan TikTok.",
    ),
]


def load_rules(path: str | Path | None = None) -> list[Rule]:
    """Built-in rules, optionally extended or overridden by a YAML/JSON file.

    A user rule reusing a built-in ``id`` replaces it, which is how you silence
    a pattern that misfires for your catalogue.
    """
    rules = list(DEFAULT_RULES)
    if path is None:
        return rules

    p = Path(path).expanduser()
    if not p.exists():
        raise FileNotFoundError(f"rules file not found: {p}")

    raw = p.read_text(encoding="utf-8")
    data: Any
    try:
        import yaml  # type: ignore

        data = yaml.safe_load(raw) or {}
    except ImportError:
        import json

        data = json.loads(raw)

    entries = data.get("rules", data) if isinstance(data, dict) else data
    if not isinstance(entries, list):
        raise ValueError(f"{p.name}: expected a list of rules")

    by_id = {r.id: r for r in rules}
    for entry in entries:
        if not isinstance(entry, dict) or "id" not in entry or "pattern" not in entry:
            raise ValueError(f"{p.name}: each rule needs at least 'id' and 'pattern'")
        rule = Rule(
            id=str(entry["id"]),
            severity=str(entry.get("severity", "warn")),
            pattern=str(entry["pattern"]),
            message=str(entry.get("message", entry["id"])),
            hint=str(entry.get("hint", "")),
        )
        try:
            rule.compiled()
        except re.error as exc:
            raise ValueError(f"{p.name}: rule {rule.id} has an invalid regex: {exc}") from exc
        by_id[rule.id] = rule

    order = [r.id for r in rules] + [k for k in by_id if k not in {r.id for r in rules}]
    return [by_id[k] for k in dict.fromkeys(order)]
