"""Menu kreasi untuk slide serving suggestion, sesuai yang disetujui pelanggan.

Gaya penulisannya mengikuti Uji_S5 persis. Acuannya berbunyi:

    HOT MATCHA LATTE      2g matcha + 30 ml hot water,
                          topped with 150 ml warm milk
    ICED MATCHA LATTE     2g matcha + 150 ml
                          cold milk and ice
    MATCHA LEMONADE       2g matcha + cold water,
                          lemon juice & honey

Yang ditiru dari situ: takaran menempel pada huruf g ("25g"), volume dipisah
spasi ("200 ml"), ada spasi di kiri-kanan "+", baris pertama diakhiri koma,
tidak ada titik di akhir, dan "&" untuk merangkai bahan terakhir.

Satu hal lagi yang ditiru dan mudah terlewat: acuannya menyebut isinya dengan
satu kata pendek - "2g matcha", bukan "2g exclusive matcha". Nama panjang
produknya sudah ada di sub-judul ("one matcha latte, three ways to enjoy"),
jadi mengulangnya di setiap baris resep hanya membuat barisnya melebar sampai
menabrak kolom sebelah. Sama seperti acuannya, kreasi ketiga boleh membuang
volumenya sama sekali ("+ cold water,") kalau barisnya sudah terlalu panjang.

`fit_s5.py` mengukur semuanya sebelum satu kredit pun dibelanjakan.
"""

# slug produk -> nama pendek yang dipakai berkas hasil generate, sama persis
# dengan `build_all.MAP`. Dua slide yang sama harus memakai nama yang sama, dan
# `build_all_s5` menegakkannya dengan assert supaya tidak ada yang menyimpang
# diam-diam.
KEY = {
    "MatchaLatte": "matchalatte", "PremixMatcha": "premixmatcha",
    "TehTarik": "tehtarik", "ChocolateSignature": "chocolate",
    "CookiesCream": "cookiescream", "Charcoal": "charcoal",
    "Avocado": "avocado", "Vanilla": "vanilla",
    "MilkTea": "milktea", "LemonTea": "lemontea",
    "FrappeBase": "frappebase", "LemonGrass": "lemongrass",
    "PureDarkCocoa": "puredarkcocoa", "DarkCocoa": "darkcocoa",
    "Cappuccino": "cappuccino", "Taro": "taro",
}

MENU = {
    "MatchaLatte": ("one matcha latte", [
        ("HOT MATCHA LATTE", "mug", ["25g matcha + 200 ml hot water,", "stirred until smooth"],
         "a hot matcha latte: an even vivid green surface with a soft white latte-art rosetta poured on it, a wisp of steam"),
        ("ICED MATCHA LATTE", "tall", ["25g matcha + 60 ml hot water,", "150 ml cold milk and ice"],
         "an iced matcha latte: vivid green matcha poured over cold milk so the two sit in distinct layers, with ice cubes through the green"),
        ("MATCHA FLOAT", "tall", ["25g matcha + 150 ml cold milk,", "topped with vanilla ice cream"],
         "an iced matcha latte with one round scoop of vanilla ice cream resting on the rim, the green drink visible below it"),
    ]),
    "PremixMatcha": ("one premix matcha", [
        ("HOT MATCHA", "mug", ["25g matcha + 200 ml hot water,", "stirred until smooth"],
         "a hot matcha: a deep even green surface with a fine pale foam, a wisp of steam"),
        ("ICED MATCHA LATTE", "tall", ["25g matcha + 60 ml hot water,", "150 ml cold milk and ice"],
         "an iced matcha latte: deep green matcha poured over cold milk in distinct layers, with ice cubes"),
        ("MATCHA LEMONADE", "tall", ["25g matcha + cold water,", "lemon juice & honey"],
         "a matcha lemonade: clear bright yellow-green, plenty of ice, one thin slice of lemon on the rim"),
    ]),
    "TehTarik": ("one teh tarik", [
        ("HOT TEH TARIK", "mug", ["25g teh tarik + 200 ml hot water,", "pulled until foamy"],
         "hot teh tarik: warm tan pulled milk tea under a thick creamy foam head, a wisp of steam"),
        ("ICED TEH TARIK", "tall", ["25g teh tarik + 60 ml hot water,", "150 ml cold milk and ice"],
         "iced teh tarik: warm tan milk tea over cold milk in soft layers, with ice cubes"),
        ("TEH TARIK GULA AREN", "tall", ["25g teh tarik + 150 ml milk,", "palm sugar syrup & ice"],
         "teh tarik with palm sugar: creamy tan milk tea with dark palm sugar syrup streaking down the inside of the glass, with ice"),
    ]),
    "ChocolateSignature": ("one chocolate", [
        ("HOT CHOCOLATE", "mug", ["25g chocolate + 200 ml hot milk,", "stirred until smooth"],
         "a hot chocolate: deep glossy cocoa brown with a fine milk foam, a wisp of steam"),
        ("ICED CHOCOLATE", "tall", ["25g chocolate + 60 ml hot water,", "150 ml cold milk and ice"],
         "an iced chocolate: dark cocoa poured over cold milk in distinct layers, with ice cubes"),
        ("CHOCOLATE MILKSHAKE", "tall", ["30g chocolate + 150 ml milk,", "blended with ice cream"],
         "a thick chocolate milkshake: dense cocoa brown blended smooth, a swirl of whipped cream on top"),
    ]),
    "CookiesCream": ("one cookies & cream", [
        ("HOT COOKIES & CREAM", "mug", ["25g cookies & cream,", "200 ml hot milk, stirred"],
         "a hot cookies and cream drink: creamy off-white with fine dark biscuit specks, a wisp of steam"),
        ("ICED COOKIES & CREAM", "tall", ["25g cookies & cream,", "150 ml cold milk and ice"],
         "an iced cookies and cream: creamy off-white with dark biscuit crumbs suspended through it, with ice cubes"),
        ("COOKIES & CREAM FRAPPE", "tall", ["30g cookies & cream,", "150 ml milk, blended with ice"],
         "a cookies and cream frappe: thick creamy off-white blended smooth, crushed dark biscuit scattered on top"),
    ]),
    "Charcoal": ("one charcoal", [
        ("HOT CHARCOAL LATTE", "mug", ["25g charcoal + 200 ml hot milk,", "stirred until smooth"],
         "a hot charcoal latte: soft grey-black surface with a pale milk foam, a wisp of steam"),
        ("ICED CHARCOAL LATTE", "tall", ["25g charcoal + 60 ml hot water,", "150 ml cold milk and ice"],
         "an iced charcoal latte: deep black poured over cold milk in dramatic layers, with ice cubes"),
        ("CHARCOAL LEMONADE", "tall", ["20g charcoal + cold water,", "lemon juice & honey"],
         "a charcoal lemonade: clear deep grey-black, plenty of ice, one thin slice of lemon on the rim"),
    ]),
    "Avocado": ("one avocado", [
        ("ICED AVOCADO LATTE", "tall", ["30g avocado + 150 ml cold milk,", "poured over ice"],
         "an iced avocado latte: smooth pale green, thick and creamy, with ice cubes"),
        ("AVOCADO COFFEE", "tall", ["30g avocado + 150 ml milk,", "one shot of espresso & ice"],
         "an avocado coffee: pale green avocado below and a dark espresso layer poured over it, with ice"),
        ("AVOCADO FLOAT", "tall", ["30g avocado + 150 ml milk,", "chocolate sauce & ice cream"],
         "an avocado float: pale green drink with dark chocolate sauce streaking the glass and one scoop of vanilla ice cream on the rim"),
    ]),
    "Vanilla": ("one vanilla", [
        ("HOT VANILLA LATTE", "mug", ["25g vanilla + 200 ml hot milk,", "stirred until smooth"],
         "a hot vanilla latte: warm pale cream with a fine white foam and vanilla seed specks, a wisp of steam"),
        ("ICED VANILLA LATTE", "tall", ["25g vanilla + 60 ml hot water,", "150 ml cold milk and ice"],
         "an iced vanilla latte: pale cream with vanilla seed specks through it, with ice cubes"),
        ("VANILLA MILKSHAKE", "tall", ["30g vanilla + 150 ml cold milk,", "blended with ice cream"],
         "a thick vanilla milkshake: pale cream flecked with vanilla seeds, a swirl of whipped cream on top"),
    ]),
    "MilkTea": ("one milk tea", [
        ("HOT MILK TEA", "mug", ["25g milk tea + 200 ml hot water,", "stirred until smooth"],
         "a hot milk tea: even caramel brown with a fine foam, a wisp of steam"),
        ("ICED MILK TEA", "tall", ["25g milk tea + 60 ml hot water,", "150 ml cold milk and ice"],
         "an iced milk tea: caramel brown over cold milk in soft layers, with ice cubes"),
        ("BROWN SUGAR BOBA", "tall", ["25g milk tea + 150 ml milk,", "brown sugar pearls & ice"],
         "a brown sugar boba milk tea: creamy tan with dark brown sugar syrup streaking the glass and black tapioca pearls at the bottom"),
    ]),
    "LemonTea": ("one lemon tea", [
        ("HOT LEMON TEA", "mug", ["20g lemon tea + 200 ml hot water,", "stirred until smooth"],
         "a hot lemon tea: clear golden amber, one thin slice of lemon, a wisp of steam"),
        ("ICED LEMON TEA", "tall", ["20g lemon tea + cold water,", "ice & a slice of lemon"],
         "an iced lemon tea: clear golden amber with plenty of ice and one thin slice of lemon on the rim"),
        ("LEMON TEA SODA", "tall", ["20g lemon tea + sparkling water,", "ice & a slice of lemon"],
         "a lemon tea soda: clear golden amber with fine bubbles rising, ice, one thin slice of lemon on the rim"),
    ]),
    "FrappeBase": ("one frappe base", [
        ("CHOCOLATE FRAPPE", "tall", ["30g frappe base,", "25g chocolate & 150 ml milk"],
         "a chocolate frappe: thick cocoa brown blended smooth, a swirl of whipped cream on top"),
        ("MATCHA FRAPPE", "tall", ["30g frappe base,", "25g matcha & 150 ml milk"],
         "a matcha frappe: thick pale green blended smooth, a swirl of whipped cream on top"),
        ("COOKIES & CREAM FRAPPE", "tall", ["30g frappe base,", "25g cookies & cream, 150 ml milk"],
         "a cookies and cream frappe: thick creamy off-white with dark biscuit crumbs, a swirl of whipped cream on top"),
    ]),
    "LemonGrass": ("one lemongrass", [
        ("HOT LEMONGRASS TEA", "mug", ["20g lemongrass,", "200 ml hot water, stirred"],
         "a hot lemongrass tea: clear pale golden green, a wisp of steam"),
        ("ICED LEMONGRASS", "tall", ["20g lemongrass + cold water,", "ice & a wedge of lime"],
         "an iced lemongrass tea: clear golden green with plenty of ice and one wedge of lime"),
        ("LEMONGRASS SODA", "tall", ["20g lemongrass,", "sparkling water, lime & ice"],
         "a lemongrass soda: clear pale green with fine bubbles rising, ice and one wedge of lime"),
    ]),

    # ── empat produk yang ditambahkan belakangan ─────────────────────────────
    # Pure Dark Cocoa dan Dark Cocoa gampang sekali jadi kembar - dua-duanya
    # cokelat pekat. Yang membedakan menunya bukan hiasan melainkan sifat
    # produknya: kemasan Pure Dark Cocoa mencetak 100% cocoa, tanpa gula, jadi
    # kreasinya bertumpu pada sesuatu yang PAHIT dan pemanisnya diserahkan ke
    # peminumnya, sementara Dark Cocoa jalan menu cokelat biasa.
    "PureDarkCocoa": ("one pure cocoa", [
        ("HOT PURE COCOA", "mug", ["25g cocoa + 200 ml hot milk,", "sugar to taste"],
         "a hot pure cocoa: deep dark brown, unsweetened and glossy, with a fine milk foam and a wisp of steam"),
        ("ICED MOCHA", "tall", ["25g cocoa + one espresso shot,", "150 ml milk and ice"],
         "an iced mocha: dark cocoa and espresso over cold milk in soft layers, with ice cubes"),
        ("COCOA FLOAT", "tall", ["25g cocoa + 150 ml milk,", "chocolate sauce & ice cream"],
         "a cocoa float: dark chocolate milk with chocolate sauce streaking the glass and one scoop of vanilla ice cream on the rim"),
    ]),
    "DarkCocoa": ("one dark cocoa", [
        ("HOT DARK COCOA", "mug", ["30g cocoa + 200 ml hot milk,", "stirred until smooth"],
         "a hot dark cocoa: rich milky brown with a smooth crema on top and a wisp of steam"),
        ("ICED DARK COCOA", "tall", ["30g cocoa + 60 ml hot water,", "150 ml cold milk and ice"],
         "an iced dark cocoa: dark cocoa poured over cold milk in distinct layers, with ice cubes"),
        ("DARK COCOA FLOAT", "tall", ["30g cocoa + 150 ml milk,", "chocolate sauce & ice cream"],
         "a dark cocoa float: chocolate milk with chocolate sauce streaking the glass and one scoop of vanilla ice cream on the rim"),
    ]),
    # Kata pendeknya "coffee", bukan "cappuccino": pada 340 px yang tersedia,
    # "25g cappuccino + 200 ml hot water," melebar jadi 361 px dan menabrak kolom
    # sebelah. Nama panjangnya sudah ada di sub-judul, persis alasan yang sama
    # kenapa acuannya menulis "2g matcha" dan bukan "2g exclusive matcha".
    "Cappuccino": ("one cappuccino", [
        ("HOT CAPPUCCINO", "mug", ["25g coffee + 200 ml hot water,", "whisked to a foam"],
         "a hot cappuccino: warm tan coffee under a thick white milk foam head dusted with cocoa, a wisp of steam"),
        ("ICED CAPPUCCINO", "tall", ["25g coffee + 60 ml hot water,", "150 ml cold milk and ice"],
         "an iced cappuccino: coffee poured over cold milk in soft layers with a pale foam collar, with ice cubes"),
        ("CAPPUCCINO FLOAT", "tall", ["25g coffee + 150 ml milk,", "ice cream & cocoa dust"],
         "a cappuccino float: iced coffee milk with one scoop of vanilla ice cream on the rim, dusted with cocoa"),
    ]),
    "Taro": ("one taro", [
        ("HOT TARO LATTE", "mug", ["30g taro + 200 ml hot milk,", "stirred until smooth"],
         "a hot taro latte: soft lilac purple, creamy and even, with a fine milk foam and a wisp of steam"),
        ("ICED TARO LATTE", "tall", ["30g taro + 150 ml cold milk,", "poured over ice"],
         "an iced taro latte: soft lilac purple, thick and creamy, with ice cubes"),
        ("TARO FLOAT", "tall", ["30g taro + 150 ml milk,", "ice cream & taro dust"],
         "a taro float: lilac purple taro milk with one scoop of vanilla ice cream on the rim, dusted with purple taro powder"),
    ]),
}
