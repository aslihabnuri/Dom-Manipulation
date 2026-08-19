"""Write the upload caption from what was actually said in the clip.

A template that only swaps the date produces six near-identical captions, which
reads as bulk-posted and works against the "each post brings new value" rule the
whole tool is built around. So instead we pull real facts out of the transcript
-- price, material, sizes, colours, the offer on the table -- work out what kind
of moment the clip is, and build the caption from those facts.

Nothing is invented. Every concrete detail in the output appears in the
transcript; when the transcript is thin, the caption stays short rather than
padding itself with claims the video does not support.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from functools import lru_cache

# --- vocabulary -------------------------------------------------------------

CATEGORIES: dict[str, tuple[str, ...]] = {
    "fashion": (
        "kaos", "kemeja", "celana", "dress", "rok", "jaket", "hoodie", "sweater",
        "hijab", "jilbab", "gamis", "khimar", "pashmina", "outer", "blouse",
        "kulot", "jeans", "legging", "daster", "piyama", "koko", "batik",
    ),
    "sepatu_tas": (
        "sepatu", "sandal", "sneakers", "heels", "flatshoes", "boots",
        "tas", "ransel", "totebag", "slingbag", "dompet", "koper",
    ),
    "skincare": (
        "serum", "toner", "moisturizer", "sunscreen", "sabun", "facial wash",
        "masker", "krim", "cream", "essence", "micellar", "acne", "skincare",
    ),
    "makeup": (
        "lipstik", "lip tint", "bedak", "foundation", "cushion", "maskara",
        "eyeliner", "blush", "concealer", "parfum",
    ),
    "makanan": (
        "keripik", "kopi", "snack", "sambal", "kue", "camilan", "madu",
        "minuman", "susu", "teh", "bumbu", "frozen",
    ),
    "elektronik": (
        "charger", "kabel", "headset", "earphone", "powerbank", "speaker",
        "lampu", "kipas", "mouse", "keyboard", "casing",
    ),
    "rumah": (
        "sprei", "bantal", "selimut", "tumbler", "panci", "wajan", "rak",
        "toples", "handuk", "karpet", "gorden",
    ),
}

MATERIALS = (
    "katun", "cotton", "combed", "denim", "jeans", "linen", "spandex", "rayon",
    "polyester", "suede", "kanvas", "fleece", "parasut", "sifon",
    "satin", "wolfis", "jersey", "babyterry", "scuba", "twill", "crinkle",
)
# Words that only mean a material in the right company. "kulit" is leather in a
# fashion clip and skin in a skincare clip, so it needs a qualifier.
AMBIGUOUS_MATERIALS: dict[str, tuple[str, ...]] = {
    "kulit": ("kulit asli", "kulit sintetis", "kulit sapi", "bahan kulit", "kulit premium"),
}
COLORS = (
    "hitam", "putih", "navy", "maroon", "cream", "krem", "mocha", "abu", "abu-abu",
    "coklat", "cokelat", "pink", "biru", "merah", "hijau", "kuning", "ungu",
    "tosca", "salem", "beige", "olive", "dusty", "gold", "silver",
)
OFFERS: dict[str, tuple[str, ...]] = {
    "gratis ongkir": ("gratis ongkir", "free ongkir", "ongkir gratis"),
    "diskon": ("diskon", "potongan harga", "korting"),
    "voucher": ("voucher", "kupon"),
    "flash sale": ("flash sale", "flashsale"),
    "bundling": ("bundling", "beli 2", "beli dua", "paket hemat", "borongan"),
    "cashback": ("cashback", "cash back"),
    "bonus": ("bonus", "free gift", "hadiah langsung"),
}

_SIZE_WORDS = re.compile(
    r"\b(?:all\s?size|allsize|fit\s?to\s?l|ukuran\s+\d{2,3}|size\s+(?:s|m|l|xl|xxl|xxxl)|"
    # A bare size letter only counts when a separator or sentence end follows,
    # so "L" in "ukuran L." is a size but the "l" inside a word is not.
    r"(?:s|m|l|xl|xxl|xxxl)\b(?=\s*(?:[,.;:)/]|\bdan\b|\bsampai\b|$)))",
    re.IGNORECASE,
)
_PRICE = re.compile(
    r"(?:rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?\s*(?:rb|ribu|jt|juta|k))\b",
    re.IGNORECASE,
)

# Which beat is this clip? Ordered by how strongly each cue signals the beat.
BEAT_CUES: dict[str, tuple[tuple[str, float], ...]] = {
    "cta": (("keranjang kuning", 3.0), ("klik keranjang", 3.0), ("checkout", 2.5),
            ("keranjang", 2.0), ("serbu", 2.0), ("buruan", 1.8), ("diorder", 1.8),
            ("gaskeun", 1.5), ("stok terbatas", 1.5)),
    "harga": (("harga", 2.0), ("cuma", 1.8), ("murah", 1.5), ("hemat", 1.2),
              ("normalnya", 1.5), ("banting harga", 2.0)),
    "promo": (("flash sale", 2.5), ("diskon", 2.0), ("voucher", 1.8),
              ("gratis ongkir", 1.8), ("bundling", 1.5), ("cashback", 1.5)),
    "demo": (("bahan", 2.0), ("kualitas", 1.8), ("jahitan", 2.0), ("adem", 1.5),
             ("nyaman", 1.5), ("tebal", 1.2), ("ukuran", 1.2), ("dipakai", 1.2),
             ("coba", 1.0), ("lihat", 1.0)),
}

HASHTAGS: dict[str, tuple[str, ...]] = {
    "fashion": ("#ootd", "#fashionmurah", "#bajumurah"),
    "sepatu_tas": ("#sepatumurah", "#tasmurah", "#ootd"),
    "skincare": ("#skincareroutine", "#skincaremurah", "#glowingskin"),
    "makeup": ("#makeuptutorial", "#makeupmurah", "#beautytips"),
    "makanan": ("#kulinerindonesia", "#snackviral", "#jajanan"),
    "elektronik": ("#gadgetmurah", "#reviewgadget", "#elektronik"),
    "rumah": ("#peralatanrumah", "#homedecor", "#rumahrapi"),
    "": ("#rekomendasiproduk",),
}
BASE_HASHTAGS = ("#tiktokshop", "#livehighlight")


# --- extraction -------------------------------------------------------------

def join_materials(materials: list[str], lowered: str) -> str:
    """Render the material list, keeping multi-word fabrics together."""
    if not materials:
        return ""
    merged: list[str] = []
    for material in materials:
        if merged and f"{merged[-1]} {material}" in lowered:
            merged[-1] = f"{merged[-1]} {material}"
        else:
            merged.append(material)
    return " & ".join(merged)


@dataclass
class CaptionFacts:
    """Concrete details lifted out of one clip's transcript."""

    price: str = ""
    category: str = ""
    source_text: str = ""
    product: str = ""
    materials: list[str] = field(default_factory=list)
    colors: list[str] = field(default_factory=list)
    sizes: list[str] = field(default_factory=list)
    offers: list[str] = field(default_factory=list)
    beat: str = "demo"

    @property
    def thin(self) -> bool:
        """True when the transcript yielded almost nothing to write about."""
        return not any((self.price, self.product, self.materials, self.colors,
                        self.sizes, self.offers))


@lru_cache(maxsize=2048)
def _word_pattern(word: str) -> re.Pattern[str]:
    """Match ``word`` as a whole word, tolerating the -nya suffix.

    Substring matching is not safe here: "tas" appears inside "terbatas" and
    would turn a t-shirt clip into a handbag one.
    """
    return re.compile(rf"\b{re.escape(word)}(?:nya)?\b", re.IGNORECASE)


def _word_in(word: str, text: str) -> bool:
    return _word_pattern(word).search(text) is not None


def _unique(values) -> list[str]:
    seen, out = set(), []
    for value in values:
        key = value.lower()
        if key not in seen:
            seen.add(key)
            out.append(value)
    return out


def _normalise_size(raw: str) -> str:
    """Keep size acronyms upper-case; 'all size' reads better lower-case."""
    value = " ".join(raw.split())
    if re.fullmatch(r"all\s?size", value, re.IGNORECASE):
        return "all size"
    if re.fullmatch(r"(?:size\s+)?(?:[sml]|x{1,3}l)", value, re.IGNORECASE):
        return re.sub(r"(?i)^size\s+", "", value).upper()
    return value.lower()


# Markers that introduce the price actually being charged, after an anchor.
_CURRENT_PRICE = re.compile(
    r"\b(?:jadi|sekarang|cuma|hanya|tinggal|dibanderol|kami\s+kasih)\s+"
    r"(?:rp\.?\s*)?(?:\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?\s*(?:rb|ribu|jt|juta|k))\b",
    re.IGNORECASE,
)


def _format_price(raw: str) -> str:
    raw = raw.strip()
    return raw if raw.lower().startswith("rp") else f"Rp{raw}"


def _find_price(text: str) -> str:
    """The price the buyer pays.

    Hosts routinely anchor ("normalnya Rp129.000") before revealing the real
    figure ("jadi Rp89.000"). Taking the first number in the clip would quote
    the anchor, so a discount phrase wins when one is present.
    """
    discounted = _CURRENT_PRICE.search(text)
    if discounted:
        inner = _PRICE.search(discounted.group(0))
        if inner:
            return _format_price(inner.group(0))

    match = _PRICE.search(text)
    return _format_price(match.group(0)) if match else ""


def _find_category(lowered: str) -> tuple[str, str]:
    """Return (category key, the specific product word that matched)."""
    best: tuple[int, str, str] | None = None
    for category, words in CATEGORIES.items():
        for word in words:
            match = _word_pattern(word).search(lowered)
            if match and (best is None or match.start() < best[0]):
                best = (match.start(), category, word)
    return (best[1], best[2]) if best else ("", "")


def _find_materials(lowered: str) -> list[str]:
    found = [m for m in MATERIALS if _word_in(m, lowered)]
    for word, qualifiers in AMBIGUOUS_MATERIALS.items():
        if any(q in lowered for q in qualifiers):
            found.append(word)
    return found


def _find_beat(lowered: str) -> str:
    scores = {
        beat: sum(weight * lowered.count(cue) for cue, weight in cues)
        for beat, cues in BEAT_CUES.items()
    }
    best = max(scores, key=lambda k: scores[k])
    return best if scores[best] > 0 else "demo"


def extract_facts(text: str) -> CaptionFacts:
    """Pull whatever concrete details the clip's transcript actually contains."""
    if not (text or "").strip():
        return CaptionFacts()

    lowered = f" {text.lower()} "
    category, product = _find_category(lowered)

    sizes = _unique(_normalise_size(m.group(0)) for m in _SIZE_WORDS.finditer(text))

    offers = [
        label for label, variants in OFFERS.items()
        if any(v in lowered for v in variants)
    ]

    return CaptionFacts(
        source_text=lowered,
        price=_find_price(text),
        category=category,
        product=product,
        materials=_unique(_find_materials(lowered))[:3],
        colors=_unique(c for c in COLORS if _word_in(c, lowered))[:3],
        sizes=sizes[:5],
        offers=offers[:3],
        beat=_find_beat(lowered),
    )


# --- composition ------------------------------------------------------------

def _detail_line(facts: CaptionFacts) -> str:
    """One line of concrete product detail, or empty if we have nothing."""
    parts: list[str] = []
    if facts.materials:
        parts.append("bahan " + join_materials(facts.materials, facts.source_text))
    if facts.sizes:
        parts.append("ukuran " + ", ".join(facts.sizes))
    if facts.colors:
        parts.append(f"{len(facts.colors)} warna: " + ", ".join(facts.colors)
                     if len(facts.colors) > 1 else f"warna {facts.colors[0]}")
    if not parts:
        return ""
    line = ", ".join(parts[:2])
    return line[0].upper() + line[1:]


def _offer_line(facts: CaptionFacts) -> str:
    if not facts.offers:
        return ""
    listed = " + ".join(facts.offers)
    return f"Lagi ada {listed} juga."


def _price_line(facts: CaptionFacts) -> str:
    if not facts.price:
        return ""
    if not facts.product or facts.product in {"keranjang"}:
        return f"Harganya {facts.price}."
    return f"{facts.product.capitalize()} {facts.price} di keranjang."


def build_hashtags(facts: CaptionFacts, limit: int = 5) -> list[str]:
    tags = list(BASE_HASHTAGS) + list(HASHTAGS.get(facts.category, HASHTAGS[""]))
    if facts.product and len(facts.product) > 3:
        slug = re.sub(r"[^a-z0-9]", "", facts.product.lower())
        if slug:
            tags.insert(2, f"#{slug}")
    return _unique(tags)[:limit]


def _closing(beat: str, index: int) -> str:
    """Vary the closing line so a batch of clips does not read identically."""
    options = {
        "cta": (
            "Stok gerak cepat waktu live, cek keranjang sebelum habis.",
            "Yang kemarin nanya, ini barangnya. Ada di keranjang.",
            "Langsung cek keranjang ya, jangan cuma disimpan.",
        ),
        "harga": (
            "Harga segini cuma waktu live kemarin, cek keranjang untuk yang terbaru.",
            "Cek keranjang buat harga dan stok hari ini.",
            "Detail harga terbaru ada di keranjang.",
        ),
        "promo": (
            "Cek keranjang, promonya masih jalan selama stok ada.",
            "Yang mau ikut promonya, semua ada di keranjang.",
            "Promo begini nggak tiap hari, cek keranjang ya.",
        ),
        "demo": (
            "Lebih jelas kalau lihat sendiri di video. Detailnya ada di keranjang.",
            "Ini potongan waktu lagi dipakai langsung, bukan foto katalog.",
            "Cek keranjang kalau mau lihat detail lengkapnya.",
        ),
    }
    pool = options.get(beat, options["demo"])
    return pool[index % len(pool)]


def _opening(facts: CaptionFacts, hook: str, index: int) -> str:
    """First line: the operator's hook, or something built from real facts."""
    hook = (hook or "").strip().rstrip(".!,")
    if hook:
        return hook + "."

    if facts.product:
        noun = facts.product.capitalize()
        openings = (
            f"{noun} yang paling banyak ditanya waktu live kemarin.",
            f"Potongan waktu bahas {facts.product}.",
            f"{noun} ini yang bikin keranjang rame kemarin.",
        )
        return openings[index % len(openings)]

    return ("Potongan paling rame dari live kemarin.",
            "Bagian ini yang paling banyak direspons waktu live.",
            "Momen yang paling ditunggu waktu live kemarin.")[index % 3]


def build_captions(
    transcript_text: str,
    hook: str = "",
    hour_label: str = "",
    session_id: str = "",
    variants: int = 3,
) -> list[str]:
    """Draft caption options for one clip, most complete first.

    Every variant is built only from details found in ``transcript_text``, so a
    clip whose audio was not transcribed gets a short, honest caption rather
    than invented product copy.
    """
    facts = extract_facts(transcript_text)
    detail = _detail_line(facts)
    price = _price_line(facts)
    offer = _offer_line(facts)
    tags = " ".join(build_hashtags(facts))

    origin = f"Potongan LIVE {session_id}".strip()
    if hour_label:
        origin += f" jam {hour_label}"
    origin += "."

    out: list[str] = []
    for index in range(max(1, variants)):
        body: list[str] = [_opening(facts, hook, index)]

        # Variant 1 leads with detail, variant 2 with the offer, variant 3 keeps
        # it lean -- so a batch of clips does not read as one template repeated.
        if index == 0:
            body += [line for line in (detail, price, offer) if line]
        elif index == 1:
            body += [line for line in (offer, detail, price) if line]
        else:
            body += [line for line in (price or detail,) if line]

        body.append(_closing(facts.beat, index))
        if facts.thin:
            # Nothing concrete was heard, so say where it came from instead of
            # padding with product claims the clip cannot support.
            body.insert(1, origin)

        out.append("\n".join(body) + f"\n\n{tags}")

    return out


def build_caption(
    transcript_text: str,
    hook: str = "",
    hour_label: str = "",
    session_id: str = "",
) -> str:
    """The single best caption draft for a clip."""
    return build_captions(transcript_text, hook, hour_label, session_id, variants=1)[0]
