"""Naskah slide 2 (manfaat), mengikuti referensi Matchamu "Pure Sakura".

Bentuknya persis acuan: nama produk dua baris dengan kontras ukuran, lalu dua
blok manfaat yang masing-masing berupa judul huruf besar berwarna aksen di atas
badan penjelas, lalu satu baris penutup yang tenang, dan pouch berdiri sendiri
di kolom kanan.

Judul dalam bahasa Inggris, badan juga - pelanggan memilih Inggris penuh, dan
itu konsisten dengan slide yang sudah tayang ("SERVING SUGGESTIONS", "premium
grade . 1000 gram"). Tidak ada tanda pisah panjang di mana pun, atas permintaan
pelanggan.

Nama dipecah dua baris seperti acuan ("Pure" besar, "sakura" kecil). Tiga produk
bernama satu kata tidak punya kata kedua, jadi baris keduanya memakai katakana
yang memang sudah tercetak di kemasannya. Kata seri sengaja TIDAK dipakai di
sini: `build_slides.py`, nama berkas mockup, dan label yang tercetak di pouch
memberi tiga jawaban berbeda tentang produk mana yang premium dan mana yang
exclusive, jadi belum ada yang bisa dicetak.

KLAIM. Semua manfaat di bawah adalah sifat BAHANNYA, bukan hasil uji atas bubuk
jadinya, dan itu bedanya dengan acuan: Matchamu "Pure" itu produk murni, bahannya
memang produknya. Tiga baris penutup menyatakan fakta tentang produk dan masih
menunggu konfirmasi pelanggan; ditandai NEEDS_OK. Klaim detoks untuk Charcoal
sengaja tidak ditulis: arang aktif mengikat obat dan nutrisi, dan detoks masuk
kategori klaim pengobatan yang dilarang Shopee untuk makanan-minuman.
"""

# Baris yang menunggu konfirmasi pelanggan sebelum tayang.
#
# PureDarkCocoa masuk daftar karena alasan yang lain dari tiga lainnya: yang
# perlu dipastikan bukan bunyi penutupnya, melainkan NAMA produknya. Kemasan 300
# gramnya mencetak "PURE BELGIAN COCOA" sementara slide-nya berjudul PURE DARK
# COCOA, dan sampai itu jelas, naskahnya tidak menyebut Belgia sama sekali.
NEEDS_OK = {"Avocado", "Vanilla", "FrappeBase", "PureDarkCocoa"}

# slug -> (nama baris 1, nama baris 2, [(judul, badan), (judul, badan)], penutup)
COPY = {
    "MatchaLatte": ("MATCHA", "LATTE", [
        ("ANTIOXIDANT RICH",
         "Matcha carries catechins, the natural antioxidants found in green tea leaves."),
        ("CALM ENERGY",
         "Green tea caffeine arrives together with L-theanine, so it reads as steady focus rather than a jolt."),
    ], "The whole leaf, ground fine. Not a flavouring."),

    "PremixMatcha": ("PREMIX", "MATCHA", [
        ("CEREMONIAL CHARACTER",
         "Pure matcha with a quiet umami and a deep green colour, with no cream to cover it."),
        ("ANTIOXIDANT RICH",
         "Catechins from whole ground leaves, the part a tea bag leaves behind."),
    ], "The only way to drink the leaf, not just its infusion."),

    "TehTarik": ("TEH", "TARIK", [
        ("BLACK TEA ANTIOXIDANT",
         "Black tea carries theaflavins, the antioxidants formed when the leaf is fully oxidised."),
        ("WARM COMFORT",
         "Strong tea and cream, the drink people reach for when they want to slow down."),
    ], "The foam rises from a shake. No pulling required."),

    "ChocolateSignature": ("CHOCOLATE", "SIGNATURE", [
        ("COCOA FLAVANOL",
         "Cocoa carries flavanols, antioxidants that come from the bean itself."),
        ("MOOD LIFTER",
         "Chocolate has always been the one people reach for when the day needs lifting. Warm, thick, familiar."),
    ], "Still deep after the milk and the ice go in."),

    "CookiesCream": ("COOKIES", "& CREAM", [
        ("CROWD FAVOURITE",
         "A flavour almost nobody turns down, and the safest thing on a menu for children and families."),
        ("REAL BISCUIT CRUMBS",
         "Dark biscuit crumbs pour into the glass and stay there to be chewed, not just smelled."),
    ], "Dessert you can drink."),

    "Charcoal": ("CHARCOAL", "チャコール", [
        ("CLEAN CHARACTER",
         "Food grade activated charcoal with a neutral taste, so the colour does the talking."),
        ("SIGNATURE COLOUR",
         "A deep black that makes your menu stand out on the shelf and in your customers' photos."),
    ], "The most photographed drink on the counter."),

    "Avocado": ("AVOCADO", "アボカド", [
        ("GOOD FATS",
         "Avocado is known as a source of monounsaturated fat, the kind that is kind to you."),
        ("VITAMIN E & POTASSIUM",
         "The fruit naturally carries vitamin E and potassium."),
    ], "Thick because of the fruit."),

    "Vanilla": ("VANILLA", "バニラ", [
        ("CALMING AROMA",
         "Vanilla has long been known to settle the senses, a scent that makes a drink feel softer."),
        ("REAL VANILLA SPECKS",
         "Seed specks visible through a clear glass, the sign that the aroma came from the pod."),
    ], "Sweet and soft, never sharp."),

    "MilkTea": ("MILK", "TEA", [
        ("BLACK TEA ANTIOXIDANT",
         "Black tea carries theaflavins and tannins, the natural antioxidants of the leaf."),
        ("BOBA READY",
         "The sweetness is already set to sit alongside palm sugar and pearls, so nothing needs dialling back."),
    ], "A milk tea base that needs no fixing."),

    "LemonTea": ("LEMON", "TEA", [
        ("VITAMIN C",
         "Lemon is known as a natural source of vitamin C."),
        ("REFRESHING ACIDITY",
         "A clean citrus edge that resets the palate, made for hot weather and rich food."),
    ], "Clear once brewed, never cloudy."),

    "FrappeBase": ("FRAPPE", "BASE", [
        ("ONE BASE, EVERY FLAVOUR",
         "One base for the whole frappe menu, so there is no separate blend powder to stock per flavour."),
        ("STABLE TEXTURE",
         "Gives the blend its body so it stays thick instead of separating."),
    ], "Not a flavour. A structure."),

    "LemonGrass": ("LEMON", "GRASS", [
        ("HERBAL TRADITION",
         "Lemongrass has long had a place in Indonesia's warm herbal drinks."),
        ("CALMING AROMA",
         "That unmistakable lemongrass scent, light on the stomach after a meal."),
    ], "The herbal option the shop next door does not have."),

    # ── empat produk yang ditambahkan belakangan ─────────────────────────────
    # Aturan yang sama berlaku: yang ditulis sifat BAHANNYA, bukan hasil uji atas
    # bubuk jadinya, dan tidak satu pun klaim pengobatan.
    #
    # Pure Dark Cocoa punya satu hal yang tidak dimiliki tiga lainnya: angka
    # kadar yang benar-benar TERCETAK pada kemasannya sendiri, "100% COCOA".
    # Itu boleh dikutip karena bukan saya yang mengarang. Tapi lihat NEEDS_OK:
    # kemasan itu juga mencetak nama yang lain sama sekali, PURE BELGIAN COCOA,
    # jadi kata "Belgian" TIDAK saya pakai di naskah sampai pelanggan memastikan
    # asal bijinya - asal geografis itu klaim yang bisa diperiksa orang lain.
    "PureDarkCocoa": ("PURE", "DARK COCOA", [
        ("COCOA FLAVANOL",
         "Cocoa carries flavanols, antioxidants that come from the bean itself."),
        ("NOTHING ADDED",
         "The pack states 100% cocoa, so the sweetness and the milk are yours to decide."),
    ], "Bitter on purpose. Sweeten it your way."),

    "DarkCocoa": ("DARK", "COCOA", [
        ("COCOA FLAVANOL",
         "Cocoa carries flavanols, antioxidants that come from the bean itself."),
        ("ROASTED DEEPER",
         "A darker roast profile, so the cocoa still reads through milk and ice."),
    ], "Darker than the usual chocolate drink."),

    # Cappuccino satu kata dan tidak boleh dipenggal. Nama satu kata memakai
    # katakana yang tercetak di kemasannya sebagai baris kedua, aturan yang sama
    # dengan Charcoal, Vanilla dan Taro.
    "Cappuccino": ("CAPPUCCINO", "カプチーノ", [
        ("COFFEE ANTIOXIDANT",
         "Coffee carries chlorogenic acids, the antioxidants that come from the bean."),
        ("FOAM THAT HOLDS",
         "Built to whip up a head of foam on the drink, hot or over ice."),
    ], "A cafe cup without the machine."),

    "Taro": ("TARO", "タロイモ", [
        ("FROM THE ROOT",
         "Taro is a root vegetable, and it carries the fibre and the potassium that go with one."),
        ("NATURAL COLOUR",
         "That soft lilac comes from the root, so the cup looks the way it tastes."),
    ], "The purple everyone photographs."),
}
