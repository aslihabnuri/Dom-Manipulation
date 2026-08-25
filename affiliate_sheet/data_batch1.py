# -*- coding: utf-8 -*-
"""Data kreator hasil ekstraksi 5 file export Kalodata (periode 2026-07-26 s/d 2026-08-24).
Format baris: (nama, handle, followers, gmv, unit_terjual, jumlah_live, jumlah_video)"""

PERIODE = "26 Jul 2026 sampai 24 Agu 2026"

SUMBER = [
    ("Kalodata_Creator_20260825140001_ID.xlsx", "uomolive"),
    ("Kalodata_Creator_20260825141205_ID.xlsx", "Rider_Underwear"),
    ("Kalodata_Creator_20260825140920_ID.xlsx", "Nosile"),
    ("Kalodata_Creator_20260825140753_ID.xlsx", "Sholadia"),
    ("Kalodata_Creator_20260825140700_ID.xlsx", "uncolive.underwear"),
]

ROWS = [
    # --- file 1: filter uomolive ---
    ("Sultan Kalisari", "sultankalisari.id", 5459, 690544056.5, 5950, 0, 4),
    ("Cik.pel_underline", "cik.pel_underline", 35300, 412845048.7, 5455, 0, 9),
    ("chupie pei04", "chupiepei_edward", 774000, 309713637.7, 2797, 0, 7),
    ("Ko.ony", "ko.ony96", 66400, 238284862.2, 2114, 0, 112),
    ("uomolive", "cukurukuk_cd", 61600, 162207140.9, 1689, 29, 82),
    ("Obral Discount", "obraldiscount", 15600, 158892109.4, 1348, 0, 2),
    ("Cipipay Store", "sisiliavv", 47000, 86676175.97, 647, 0, 22),
    ("MAMA,Saroh", "a.nsnstya", 648, 62092569.56, 520, 0, 54),
    ("Mayasari", "maya_sari308", 2023, 52665694.55, 377, 0, 6),
    ("Denok Si Paling Jalan", "sayadenidenok", 4398, 52339725.61, 811, 0, 87),
    ("Surganya Bunda-bunda", "surganyabundabunda", 2647, 37231971.38, 319, 0, 3),
    ("rydhansah", "rydhansah", 17100, 31392317.4, 401, 0, 5),
    ("velisca42", "velisca42", 1353, 29843199.27, 184, 0, 3),
    ("Cipipay", "cipipayy", 247400, 26976904.6, 203, 0, 5),
    ("Madonna", "cindycakep1", 17600, 26168472.39, 240, 0, 3),
    ("rrian", "rrian_4u", 1483, 25310342.97, 236, 60, 0),
    ("Market.Sultan", "marketsultan.id", 1208, 24467942.11, 172, 0, 5),
    ("Mister Underwear 01", "misterunderwear01", 10900, 20005846.66, 119, 0, 4),
    ("bertosaksonojati", "bertosaksonojati", 20600, 19241260.32, 241, 0, 12),
    ("Gisaka", "gisaka5", 39500, 18621986.15, 168, 0, 4),
    # --- file 2: filter Rider_Underwear ---
    ("Rider_Underwear", "riderofficialstore", 68900, 355981040.3, 5327, 42, 56),
    ("NAZ.ID", "naz.id_official", 19800, 60869350.89, 837, 31, 0),
    ("NAZ STYLES", "naz_styles", 16900, 58771034.43, 864, 80, 4),
    ("S t y lishshop", "staylise1", 681, 38655823.93, 315, 0, 31),
    ("Ryan Outfitness", "ryan.outfitness", 11300, 30759644.46, 491, 81, 0),
    ("masdo", "masdo1992", 6917, 29109632.32, 274, 70, 0),
    ("Sinari.id", "sinari.id", 6522, 27520579.62, 307, 72, 3),
    ("Ruang ganti", "ruang.ganti01", 2019, 17893714.02, 180, 29, 0),
    ("Kesya Mart Grosir", "kesyamartgrosir", 1900000, 17466719.38, 187, 4, 0),
    ("Azi.yo", "azi.yoo", 4800, 17192211.01, 139, 52, 0),
    ("RATU DALEMAN", "ratudaleman4", 3555, 11980518.56, 181, 59, 0),
    ("Spesialis Underwear", "spill_underwear", 3206, 11961481.91, 231, 80, 13),
    ("Bang Eka", "bang.eka11", 1522, 9097235.8, 129, 82, 4),
    ("memet", "memetghost1", 4123, 7715157.01, 69, 0, 32),
    ("ABBASYSHOP", "abbasy.shop6", 12400, 6598350.49, 62, 19, 0),
    ("SEMPAK.PREMIUM", "sempak.premium", 10400, 5769730.07, 59, 0, 7),
    ("Sergio Aymar", "sergioaymarr", 4080, 5723276.78, 126, 0, 16),
    ("Ayah Amora", "amorazelineahyann", 17700, 5597165.42, 33, 10, 0),
    ("sam_yanz", "sam_yanz", 44700, 5537042.15, 87, 0, 1),
    ("CELANA Dalam PRIA", "celanadalampria95", 45700, 5188327.74, 50, 51, 0),
    # --- file 3: filter Nosile ---
    ("serba murah", "keishaputri186", 2107, 91448918.73, 2250, 0, 14),
    ("Fashion_pria", "fashion_pria8899", 5467, 58734096.03, 793, 26, 45),
    ("Ds_", "dseptian7", 1442, 49647209.83, 952, 47, 25),
    ("Si Marcel", "seperlima4", 3321, 46545685.34, 677, 115, 11),
    ("celana_kuu", "celana_kuu", 3946, 35905850.95, 645, 26, 15),
    ("Azi.yo", "azi.yoo", 4800, 34905883.22, 447, 52, 4),
    ("Bunda Ais", "aisyacollecion", 117100, 34336944.23, 837, 0, 6),
    ("BEMS UNDERWARE ID", "bems.underwareid", 8589, 31612151.32, 500, 74, 5),
    ("Spesialis Underwear", "spill_underwear", 3206, 30679668.91, 567, 80, 155),
    ("Sempakmu", "sempakmu8899", 1443, 30299102.43, 374, 11, 34),
    # --- file 4: filter Sholadia ---
    ("Napas karbu", "napaskopling48", 1259, 316766160.7, 4914, 0, 11),
    ("Jrm Shop 1", "jrm.shop.1", 8263, 195960489.7, 3543, 0, 179),
    ("GaleriCDPria", "galericdpria", 1057, 127491585.8, 1290, 0, 1),
    ("Sultan Combeks", "pohon.beringin118", 626, 86611238.67, 1396, 0, 3),
    (".", "sulastridua2", 143600, 82466763.05, 1510, 0, 4),
    ("Ko.ony", "ko.ony96", 66400, 66910668.16, 872, 0, 76),
    ("Nurhapifah two", "suundammardiana", 7350, 50876655.24, 841, 0, 162),
    ("Arjuna Ginrin", "arjuna_ginrin_eros", 1305, 50339316.67, 558, 0, 2),
    ("SEMPAK.PREMIUM", "sempak.premium", 10400, 30040881.44, 447, 0, 27),
    ("CDStore.id", "cdastore.id", 1371, 27237192.14, 389, 49, 6),
    ("Aquarium", "aqurium61", 1391, 23498300.77, 228, 0, 38),
    ("galery_pria", "days.77_", 74600, 20013294.94, 282, 63, 3),
    ("masdo", "masdo1992", 6917, 18892803.77, 226, 71, 0),
    ("NyamanDalem.Id", "nyamandalem", 6112, 18774535.92, 304, 0, 106),
    ("Gudang Promo", "gm_hisyam", 1281, 17308852.28, 317, 0, 16),
    ("khalisa ofiical", "lowmekanikpbg", 2654, 17008037.05, 264, 119, 1),
    ("Andriyana.id", "andriyana134", 9944, 16691326.67, 287, 162, 8),
    ("Rejeki lancar", "rejeki_lancar11", 1044, 15667537.14, 318, 0, 15),
    ("SobatBelanja.id", "sobatbelanja.id2", 1121, 14122317.57, 252, 0, 51),
    ("MARKAS.KOLOR", "markaskolor", 5637, 13168220.58, 202, 0, 111),
    # --- file 5: filter uncolive.underwear ---
    (".", "sulastridua2", 143600, 514033148.1, 3978, 30, 4),
    ("bangjie.spallspill", "bangjie.spallspill", 20100, 200850771.3, 1473, 0, 5),
    ("kingfernandra", "kingfernandra", 325800, 150079639.5, 1206, 0, 11),
    ("rumahcivi", "rumahcivi", 95800, 125184495.9, 948, 0, 29),
    ("Even", "evenieyooo", 14500, 110675217.7, 1031, 0, 3),
    ("Azmannis World", "azmannis", 6000000, 107441748.7, 827, 0, 41),
    ("celanamu.inii", "celanamu.inii", 124900, 60407304.53, 546, 0, 8),
    ("uncolive_cd5", "uncolive_cd5", 10500, 52705544.31, 555, 27, 18),
    ("Ko.ony", "ko.ony96", 66400, 35871205.17, 329, 0, 38),
    ("Toko Aden", "tokoaden", 85400, 33693740.82, 270, 0, 22),
    ("Adalah pokoknya", "tokoku681", 2511, 33067925.45, 610, 0, 30),
    ("iyant", "iyant_ast", 4591, 31775575.76, 286, 0, 2),
    ("yummytiramichuu", "yummytiramichuu", 25700, 28618940.29, 219, 0, 6),
    ("0KSA", "_hyaeba", 14800, 26757053.1, 487, 0, 4),
    ("Panji Law", "fit.daddie", 841300, 21737923.2, 177, 86, 7),
    ("ALSTORE02", "alstoree02", 1577, 20956004.42, 192, 0, 27),
    ("Kazama", "kazamahusein", 2600000, 20147620.5, 172, 41, 0),
    ("DIAN PENJUAL DALEMAN", "jeruanklambi", 38200, 19572330.46, 147, 33, 0),
    ("Cik.pel_underline", "cik.pel_underline", 35300, 18430536.89, 150, 0, 3),
    ("uncolive.underwear2", "uncolive.underwear", 10900, 16992755.23, 162, 1, 99),
]


from data_batch2 import ROWS2, SUMBER2

SUMBER = SUMBER + SUMBER2
ROWS = ROWS + ROWS2

# riderofficialstore dihapus user dari Google Sheet, jadi tidak dimasukkan lagi
DIKECUALIKAN = {"riderofficialstore"}


def agregasi():
    """Gabung baris kreator yang sama (muncul di lebih dari satu file export).

    GMV, unit terjual, jumlah live, dan jumlah video dijumlahkan karena tiap file
    memakai filter toko yang berbeda sehingga cakupannya tidak saling tumpang tindih.
    Followers diambil nilai terbesar (nilainya sama di tiap file).
    Harga jual rata-rata dihitung ulang: total GMV dibagi total unit terjual.
    """
    acc = {}
    for nama, handle, fol, gmv, unit, live, video in ROWS:
        if handle in DIKECUALIKAN:
            continue
        d = acc.setdefault(handle, {"nama": nama, "gmv_top": -1, "fol": 0,
                                    "gmv": 0.0, "unit": 0, "live": 0, "video": 0, "n": 0})
        if gmv > d["gmv_top"]:
            d["gmv_top"] = gmv
            d["nama"] = nama
        d["fol"] = max(d["fol"], fol)
        d["gmv"] += gmv
        d["unit"] += unit
        d["live"] += live
        d["video"] += video
        d["n"] += 1
    out = []
    for handle, d in acc.items():
        aov = d["gmv"] / d["unit"] if d["unit"] else 0
        out.append({"nama": d["nama"], "handle": handle, "followers": d["fol"],
                    "gmv": round(d["gmv"], 2), "qty": d["unit"], "aov": round(aov, 2),
                    "video": d["video"], "live": d["live"], "sumber": d["n"]})
    out.sort(key=lambda r: -r["gmv"])
    return out


if __name__ == "__main__":
    data = agregasi()
    print("baris mentah :", len(ROWS))
    print("kreator unik :", len(data))
    print("gabungan     :", sum(1 for r in data if r["sumber"] > 1))
    print("total GMV    : Rp {:,.0f}".format(sum(r["gmv"] for r in data)))
    print()
    for r in data[:8]:
        print("  {:<24} {:<20} {:>10,} Rp {:>15,.0f}  aov {:>10,.0f} v{:<4} l{:<4} src{}".format(
            r["nama"][:24], r["handle"][:20], r["followers"], r["gmv"], r["aov"],
            r["video"], r["live"], r["sumber"]))
    print("  ...")
    for r in data[-3:]:
        print("  {:<24} {:<20} {:>10,} Rp {:>15,.0f}  aov {:>10,.0f} v{:<4} l{:<4} src{}".format(
            r["nama"][:24], r["handle"][:20], r["followers"], r["gmv"], r["aov"],
            r["video"], r["live"], r["sumber"]))
    print()
    print("digabung:", [ (r["handle"], r["sumber"]) for r in data if r["sumber"] > 1 ])
