"""Slides 19-32: the Manchester United case, worked through the book's six questions."""

from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LABEL_POSITION
from deck_lib import *

FOOT_B = ("Studi Kasus  ·  Manchester United: Preparing for Life without "
          "Ferguson (Grant, 2010)")
SALMON = RGBColor(0xFF, 0x8A, 0x7A)
ASH = RGBColor(0xA8, 0x9F, 0x99)


def _chart_text(el, size=10.5, color=INK_SOFT, bold=False):
    el.font.size = Pt(size)
    el.font.bold = bold
    el.font.name = H_FONT
    el.font.color.rgb = color


def s19_divider_b(d):
    s = d.blank(bg=RED_DEEP)
    rect(s, 0, 0, 0.34, SH, fill=RED)
    txt(s, "Bagian B", 1.15, 0.92, 5.6, 0.30, size=11.5,
        color=RGBColor(0xFF, 0xBF, 0xB6), bold=True, caps=True)
    txt(s, "Manchester\nUnited", 1.15, 1.28, 5.6, 1.90, size=42, color=WHITE,
        bold=True, spacing=0.94)
    txt(s, "Preparing for Life without Ferguson", 1.15, 3.20, 5.6, 0.40, size=16,
        color=RGBColor(0xFF, 0xBF, 0xB6), italic=True, font=S_FONT)
    rect(s, 1.15, 3.78, 1.5, 0.035, fill=WHITE)
    txt(s, "Ditulis Robert M. Grant, dibantu Simon I. Peck, Christopher Carr dan "
           "Timothy Smith.  © 2010. Kasus ini bukan dari buku Thompson; kami "
           "pakai kerangka Chapter 4 untuk membedahnya.",
        1.15, 4.02, 5.3, 1.00, size=12, color=RGBColor(0xFF, 0xBF, 0xB6), spacing=1.22)

    facts = [("Waktu kasus", 1.02, 0.44,
              "Juli 2009 — tur pra-musim Asia; skuad pulang 28 Juli 2009"),
             ("Yang harus memutuskan", 1.08, 0.52,
              "David Gill, Chief Executive Manchester United Football Club Limited"),
             ("Keputusan yang dihadapi", 1.32, 0.74,
              "Menyiapkan pengganti Sir Alex Ferguson, yang akhir 2009 berusia 68 tahun "
              "dan diperkirakan pensiun akhir musim 2009–10"),
             ("Dilema intinya", 1.86, 1.28,
              "Pilih orang dalam supaya sistem Ferguson tetap jalan, tapi berisiko "
              "kurang berwibawa di depan pemain bintang. Atau pilih manajer berwibawa "
              "seperti Mourinho, yang hampir pasti membongkar seluruh sistem itu.")]
    x0, y = 7.05, 0.92
    for nm, h, th, body in facts:
        rect(s, x0, y, 5.55, h, fill=RGBColor(0x76, 0x14, 0x0D))
        rect(s, x0, y, 0.045, h, fill=WHITE)
        txt(s, nm, x0 + 0.30, y + 0.16, 4.9, 0.26, size=10.5,
            color=RGBColor(0xFF, 0xBF, 0xB6), bold=True, caps=True)
        txt(s, body, x0 + 0.30, y + 0.48, 4.95, th, size=12.5, color=WHITE, spacing=1.18)
        y += h + 0.14
    notes(s, "Buka dengan jujur soal sumber: kasus ini ditulis Robert M. Grant, bukan "
             "diambil dari buku Thompson. Yang kita pakai dari Thompson adalah "
             "KERANGKANYA, yaitu enam pertanyaan Chapter 4.\n\n"
             "Tegaskan waktunya: Juli 2009. Ferguson MASIH menjabat. Jadi semua analisis "
             "kita berdiri di titik itu, bukan dengan pengetahuan hari ini.\n\n"
             "Ceritakan pembukanya supaya audiens masuk: David Gill sedang ikut tur Asia "
             "bersama tim. Pertandingan di Malaysia, Indonesia, Korea, dan Cina itu "
             "resminya latihan pra-musim, tapi kasus menyebut tujuannya hampir "
             "seluruhnya komersial. Rutenya bahkan ditentukan oleh kesepakatan sponsor "
             "yang sudah ada.\n\n"
             "Tapi yang ada di kepala Gill bukan urusan komersial. Yang ada di kepalanya "
             "adalah: siapa yang akan menggantikan Ferguson.")
    return s


def s20_industry(d):
    s = d.blank()
    y = d.head(s, "Konteks", "Sepakbola Eropa sebagai industri",
               "Q1 menuntut perbandingan dengan pesaing. Jadi kita perlu tahu dulu "
               "industrinya seperti apa.", sublines=1)

    stats = [("€2,4 M", "Pendapatan Premier League 2007–08, terbesar di Eropa. "
              "Serie A, La Liga dan Bundesliga masing-masing sekitar €1,4 miliar"),
             ("62%", "Porsi gaji terhadap pendapatan di Premier League. Serie A 68%, "
              "La Liga 63%. Gaji adalah pos biaya terbesar klub Eropa"),
             ("8 dari 10", "Klub besar Eropa merugi selama 2000–2006. Industri ini "
              "tumbuh pesat, tapi tidak menguntungkan")]
    w = (CW - 2 * 0.28) / 3
    x = ML
    for big, body in stats:
        rect(s, x, y, w, 1.46, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.05, fill=RED)
        txt(s, big, x + 0.24, y + 0.20, w - 0.48, 0.50, size=28, color=RED,
            bold=True, font=S_FONT, spacing=0.95)
        txt(s, body, x + 0.24, y + 0.78, w - 0.48, 0.62, size=11, color=INK_SOFT,
            spacing=1.14)
        x += w + 0.28

    y2 = y + 1.74
    half = (CW - 0.40) / 2
    txt(s, "Tiga sumber pendapatan klub (Premier League 2007–08)", ML, y2, half,
        0.28, size=11, color=RED, bold=True, caps=True)
    revs = [("Matchday", "£554 jt",
             "Tiket dan hospitality. Dibatasi kapasitas stadion — itu sebabnya klub "
             "besar merenovasi atau membangun stadion baru"),
            ("Broadcasting", "£931 jt",
             "Hak siar dijual kolektif oleh liga. Kontrak 2006 bernilai £2,7 miliar; "
             "tiap klub dapat rata-rata £45 juta per tahun"),
            ("Commercial", "£447 jt",
             "Sponsor, lisensi merchandise, iklan stadion. Terpusat di sedikit klub "
             "— Real Madrid dan Barcelona menguasai lebih dari 60% La Liga")]
    yy = y2 + 0.32
    for nm, val, body in revs:
        rect(s, ML, yy, half, 0.82, fill=PAPER, line=RULE)
        rect(s, ML, yy, 0.05, 0.82, fill=RED)
        txt(s, nm, ML + 0.26, yy + 0.10, 1.9, 0.28, size=13, color=INK, bold=True)
        txt(s, val, ML + half - 1.5, yy + 0.08, 1.26, 0.30, size=14, color=RED,
            bold=True, align=PP_ALIGN.RIGHT, font=S_FONT)
        txt(s, body, ML + 0.26, yy + 0.40, half - 0.52, 0.40, size=10.5,
            color=INK_SOFT, spacing=1.10)
        yy += 0.88

    x2 = ML + half + 0.40
    txt(s, "Aturan main dan logika ekonominya", x2, y2, half, 0.28, size=11,
        color=INK, bold=True, caps=True)
    pts = [("Struktur kompetisi", "20 klub Premier League, tiga terbawah turun kasta. "
            "Empat teratas lolos Champions League bersama 31 klub terbaik Eropa lain."),
           ("Yang kaya makin kaya", "Sejak UCL dimulai 1992, muncul jurang keuangan antara "
            "empat klub teratas Inggris dan sisanya. Uang Eropa dipakai membeli pemain bagus."),
           ("Harga pemain meledak", "Rekor transfer baru tercipta musim panas 2009 meski "
            "resesi. Pendorongnya: Real Madrid, lalu Chelsea, lalu Manchester City.")]
    yy = y2 + 0.32
    for nm, body in pts:
        txt(s, nm, x2, yy, half, 0.24, size=12, color=RED, bold=True)
        txt(s, body, x2, yy + 0.24, half, 0.46, size=11, color=INK_SOFT, spacing=1.12)
        yy += 0.78
    notes(s, "Tujuan slide ini satu: membuat audiens paham bahwa sepakbola Eropa adalah "
             "industri yang besar tapi rugi. Itu penting, karena Q1 menilai kinerja "
             "RELATIF terhadap industri.\n\n"
             "Angka 8 dari 10 klub merugi itu dari Tabel 6.6 kasus. Yang untung cuma "
             "Manchester United, Arsenal, Bayern, dan Real Madrid (nyaris nol, 0,4%). "
             "Chelsea minus 60,4% dan Inter Milan minus 78,4%.\n\n"
             "Jelaskan mekanisme 'yang kaya makin kaya': lolos Champions League memberi "
             "uang besar, uang itu dipakai beli pemain bagus, pemain bagus membuat lolos "
             "lagi tahun depan. Lingkaran ini yang memisahkan empat klub teratas Inggris "
             "dari sisanya sejak 1992.\n\n"
             "Kalau ditanya: nilai kontrak sponsor jersey yang disebut kasus — "
             "Juventus dengan Tamoil €110 juta untuk 5 tahun, Arsenal dengan Emirates "
             "£100 juta untuk 15 tahun, MU dengan Aon £80 juta untuk 4 tahun, "
             "Chelsea dengan Samsung £50 juta untuk 5 tahun. Kalau dihitung per "
             "tahun, MU paling mahal.")
    d.footer(s, FOOT_B)
    return s


def s21_q1_sport(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 1 · Diterapkan", "Di lapangan: jelas di atas rata-rata",
               "Indikator kedua Thompson — apakah posisi dan kekuatan bersaingnya "
               "membaik — dijawab data kompetisi kasus.", sublines=1)

    stats = [("1.460", "Poin performa Eropa 2000–2009, tertinggi", "Tabel 6.2",
              "Barcelona 1.411 · Real Madrid 1.314 · Arsenal 1.310"),
             ("3", "Gelar liga beruntun 2007, 2008, 2009", "Tabel 6.1",
              "Total 11 gelar liga sejak 1993 dalam rentang kasus"),
             ("2008", "Juara Liga Champions, gelar Eropa kedua Ferguson", "Halaman 584",
              "Setelah 1999: liga, FA Cup, European Cup, Intercontinental")]
    w = (CW - 2 * 0.28) / 3
    x = ML
    for big, cap, src, sub in stats:
        rect(s, x, y, w, 1.86, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.05, fill=RED)
        txt(s, big, x + 0.26, y + 0.22, w - 1.6, 0.62, size=38, color=RED, bold=True,
            font=S_FONT, spacing=0.92)
        txt(s, src, x + w - 1.42, y + 0.26, 1.16, 0.24, size=9.5, color=MUTED,
            align=PP_ALIGN.RIGHT, caps=True, bold=True)
        txt(s, cap, x + 0.26, y + 0.94, w - 0.5, 0.50, size=12.5, color=INK, bold=True,
            spacing=1.10)
        txt(s, sub, x + 0.26, y + 1.46, w - 0.5, 0.38, size=10.5, color=INK_SOFT,
            spacing=1.10)
        x += w + 0.28

    y2 = y + 2.14
    rows = [["Klub", "Poin Eropa 2000–09", "Poin performa", "Ukuran skuad",
             "Usia rata-rata"],
            ["Manchester United", "1.460", "192,5", "34", "25,6"],
            ["Barcelona", "1.411", "200,0", "24", "26,8"],
            ["Real Madrid", "1.314", "183,0", "29", "26,2"],
            ["Bayern München", "1.314", "179,5", "25", "26,5"],
            ["Arsenal", "1.310", "162,0", "31", "23,3"],
            ["Chelsea", "1.276", "144,5", "29", "27,4"]]
    cwd = [2.85, 2.40, 2.40, 2.10, 2.18]
    tbl = make_table(s, rows, ML, y2, sum(cwd), cwd, row_h=0.32, head_h=0.38,
                     size=11.5, head_size=10.5,
                     aligns=[PP_ALIGN.LEFT] + [PP_ALIGN.CENTER] * 4)
    for ci in range(5):
        style_cell(tbl.cell(1, ci), rows[1][ci], size=11.5, color=WHITE, bold=True,
                   fill=RED, align=PP_ALIGN.LEFT if ci == 0 else PP_ALIGN.CENTER)
        set_cell_border(tbl.cell(1, ci), ("T", "B", "L", "R"), RED, 0.75)
    txt(s, "Skuad MU paling besar (34 pemain) sekaligus salah satu termuda (25,6 tahun) "
           "— cocok dengan strategi memadukan pemain muda dan pemain senior.",
        ML, y2 + 2.32, CW, 0.26, size=10, color=MUTED, italic=True)
    notes(s, "Sumber angka: Tabel 6.2 (poin Eropa), Tabel 6.1 (juara liga), dan Tabel 6.7 "
             "(poin performa, ukuran dan usia skuad) di kasus.\n\n"
             "Bedakan dua kolom poin supaya tidak membingungkan:\n"
             "- Poin Eropa 2000–09 (Tabel 6.2): akumulasi performa di liga domestik, "
             "piala domestik, dan Liga Champions, disesuaikan dengan tingkat kesulitan "
             "liga masing-masing. MU nomor satu.\n"
             "- Poin performa (Tabel 6.7): ukuran serupa, dipakai kasus untuk "
             "dibandingkan dengan belanja transfer. Di sini MU nomor dua, tipis di bawah "
             "Barcelona.\n\n"
             "Kalau ada yang tanya kenapa peringkatnya beda: keduanya memang ukuran yang "
             "berbeda dengan cakupan berbeda. Jangan dipaksa sama.\n\n"
             "Catatan skuad di bawah tabel itu penting untuk slide capability nanti: "
             "skuad terbesar tapi termuda kedua. Itu bukti strategi mengembangkan pemain "
             "muda sendiri, bukan membeli pemain jadi.")
    d.footer(s, FOOT_B)
    return s


def s22_q1_fin(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 1 · Diterapkan", "Di keuangan: paling untung di Eropa",
               "Indikator pertama Thompson — apakah kekuatan keuangan dan labanya "
               "membaik — dijawab Appendix kasus dan Tabel 6.5 serta 6.6.",
               sublines=1)

    wl = CW * 0.545
    txt(s, "Pendapatan Manchester United, £ juta — naik 121% sejak 2000",
        ML, y, wl, 0.28, size=11, color=RED, bold=True, caps=True)
    years = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008"]
    vals = [116.0, 129.6, 146.1, 173.0, 169.1, 157.2, 167.8, 212.2, 257.1]
    cd = CategoryChartData()
    cd.categories = years
    cd.add_series("Turnover", vals)
    gf = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(ML), Inches(y + 0.34),
                            Inches(wl), Inches(2.80), cd)
    ch = gf.chart
    ch.has_legend = False
    ch.has_title = False
    plot = ch.plots[0]
    plot.gap_width = 45
    plot.vary_by_categories = False
    ser = plot.series[0]
    ser.format.fill.solid()
    ser.format.fill.fore_color.rgb = MUTED
    ser.format.line.fill.background()
    for i in (7, 8):
        pt = ser.points[i]
        pt.format.fill.solid()
        pt.format.fill.fore_color.rgb = RED
        pt.format.line.fill.background()
    plot.has_data_labels = True
    dl = plot.data_labels
    dl.number_format = '0.0'
    dl.number_format_is_linked = False
    dl.position = XL_LABEL_POSITION.OUTSIDE_END
    _chart_text(dl, size=9.5, color=INK_SOFT, bold=True)
    ca = ch.category_axis
    ca.has_major_gridlines = False
    ca.format.line.color.rgb = RULE
    _chart_text(ca.tick_labels, size=10, color=INK_SOFT)
    va = ch.value_axis
    va.has_major_gridlines = False
    va.visible = False
    va.maximum_scale = 300.0
    txt(s, "2000–2004 = Manchester United plc, 12 bulan sampai 31 Juli. "
           "2005–2008 = Manchester United Limited, 11 bulan sampai 30 Juni. Kasus "
           "menyatakan kedua periode tidak sepenuhnya sebanding.",
        ML, y + 3.24, wl, 0.54, size=9.5, color=MUTED, spacing=1.14, italic=True)

    x2 = ML + wl + 0.42
    w2 = CW - wl - 0.42
    kpis = [("18,2%", "Net profit margin 2008 — laba bersih £46,8 jt atas "
             "pendapatan £257,1 jt"),
            ("12,6%", "Return on sales 2000–2006 (Tabel 6.6), tertinggi dari 10 "
             "klub besar Eropa; Real Madrid hanya 0,4%"),
            ("€101,9 jt", "EBITDA 2009 (Tabel 6.5), tertinggi di Eropa. Margin "
             "31,4% vs Barcelona 22,3% dan Real Madrid 14,1%"),
            ("£1,14 M", "Nilai klub (Forbes 2009), nomor 1 dunia — di atas "
             "Barcelona £960 jt dan Real Madrid £850 jt")]
    txt(s, "Bukti pendukung", x2, y, w2, 0.28, size=11, color=RED, bold=True, caps=True)
    yy = y + 0.34
    for big, body in kpis:
        rect(s, x2, yy, w2, 0.80, fill=PAPER, line=RULE)
        rect(s, x2, yy, 0.05, 0.80, fill=RED)
        txt(s, big, x2 + 0.24, yy + 0.22, 1.50, 0.36, size=16, color=RED, bold=True,
            font=S_FONT)
        txt(s, body, x2 + 1.82, yy + 0.09, w2 - 2.06, 0.62, size=10.5, color=INK_SOFT,
            spacing=1.10)
        yy += 0.88

    note(s, [("Satu angka yang merusak gambaran ini: ", True, SALMON),
             ("utang £616 juta (Tabel 6.5), tertinggi kedua di Eropa setelah Arsenal "
              "(£896 juta). Utang ini datang dari akuisisi Glazer 2005 yang dibiayai "
              "pinjaman, bukan dari operasi klub.", False, WHITE)], dark=True)
    notes(s, "Grafik ini memakai baris Turnover dari Appendix kasus. Dua batang merah "
             "adalah dua tahun terakhir sebelum kasus ditulis.\n\n"
             "Jelaskan pola grafiknya, jangan cuma ditunjuk: naik terus sampai 2003, "
             "turun di 2004 dan 2005, lalu melonjak tajam 2007 dan 2008. Lonjakan itu "
             "sebagian datang dari perluasan Old Trafford tahun 2006 yang menambah 7.500 "
             "kursi, dan sebagian dari pendapatan Liga Champions.\n\n"
             "PENTING dan sering ditanya dosen: kenapa periode 2000–2004 dan "
             "2005–2008 tidak sepenuhnya sebanding? Karena entitas pelapornya "
             "berganti dari Manchester United plc menjadi Manchester United Limited, dan "
             "tahun bukunya berubah dari 12 bulan sampai 31 Juli menjadi 11 bulan sampai "
             "30 Juni. Kasus menyatakan ini sendiri di catatan kaki Appendix.\n\n"
             "Soal utang £616 juta — siapkan jawaban ini: Appendix kasus "
             "memperlihatkan ekuitas pemegang saham £294 juta dan TIDAK menampilkan "
             "utang itu sama sekali. Sebabnya, utang akuisisi Glazer berada di perusahaan "
             "induk, di atas Manchester United Limited. Jadi laporan anak usahanya "
             "terlihat sehat sementara grupnya berat.")
    d.footer(s, FOOT_B)
    return s


def s23_q1_efficiency(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 1 · Kesimpulan", "Prestasi puncak, belanja paling hemat",
               "Analisis turunan kami dari Tabel 6.7: bukti terkuat bahwa keunggulan MU "
               "bukan soal uang.", sublines=1)

    wl = CW * 0.55
    txt(s, "Belanja transfer bersih 2003–2009, £ juta (Tabel 6.7)", ML, y,
        wl, 0.28, size=11, color=RED, bold=True, caps=True)
    clubs = ["Real Madrid", "Chelsea", "Barcelona", "Liverpool", "Bayern München",
             "Manchester United", "Arsenal"]
    net = [438, 430, 249, 157, 122, 100, 22]
    cd = CategoryChartData()
    cd.categories = list(reversed(clubs))
    cd.add_series("Net transfer fees", list(reversed(net)))
    gf = s.shapes.add_chart(XL_CHART_TYPE.BAR_CLUSTERED, Inches(ML), Inches(y + 0.34),
                            Inches(wl), Inches(3.00), cd)
    ch = gf.chart
    ch.has_legend = False
    ch.has_title = False
    plot = ch.plots[0]
    plot.gap_width = 45
    plot.vary_by_categories = False
    ser = plot.series[0]
    ser.format.fill.solid()
    ser.format.fill.fore_color.rgb = MUTED
    ser.format.line.fill.background()
    pt = ser.points[1]
    pt.format.fill.solid()
    pt.format.fill.fore_color.rgb = RED
    pt.format.line.fill.background()
    plot.has_data_labels = True
    dl = plot.data_labels
    dl.number_format = '0'
    dl.number_format_is_linked = False
    dl.position = XL_LABEL_POSITION.OUTSIDE_END
    _chart_text(dl, size=10, color=INK_SOFT, bold=True)
    ca = ch.category_axis
    ca.has_major_gridlines = False
    ca.format.line.color.rgb = RULE
    _chart_text(ca.tick_labels, size=10.5, color=INK)
    va = ch.value_axis
    va.has_major_gridlines = False
    va.visible = False
    va.maximum_scale = 490.0

    x2 = ML + wl + 0.42
    w2 = CW - wl - 0.42
    rect(s, x2, y, w2, 1.54, fill=INK)
    rect(s, x2, y, 0.05, 1.54, fill=RED)
    txt(s, "4,4×", x2 + 0.30, y + 0.16, 2.0, 0.50, size=32, color=SALMON,
        bold=True, font=S_FONT)
    txt(s, "Real Madrid membelanjakan 4,4 kali lipat belanja bersih MU (£438 jt vs "
           "£100 jt), tapi poin performanya lebih rendah: 183,0 vs 192,5.",
        x2 + 0.30, y + 0.74, w2 - 0.62, 0.76, size=12, color=WHITE, spacing=1.18)

    comps = [("Chelsea", "£430 jt belanja bersih, hanya 144,5 poin."),
             ("Barcelona", "£249 jt → 200,0 poin; satu-satunya yang mengungguli MU."),
             ("Arsenal & Bayern", "Lebih hemat, tapi poinnya di bawah MU.")]
    yy = y + 1.82
    for nm, body in comps:
        rect(s, x2, yy, w2, 0.58, fill=PAPER, line=RULE)
        txt(s, nm, x2 + 0.22, yy + 0.08, w2 - 0.44, 0.24, size=11.5, color=RED, bold=True)
        txt(s, body, x2 + 0.22, yy + 0.31, w2 - 0.44, 0.22, size=10.5, color=INK_SOFT,
            spacing=1.06)
        yy += 0.66

    note(s, [("Jawaban Q1: ", True, RED_DEEP),
             ("strategi MU bekerja sangat baik. Kedua indikator Thompson terpenuhi "
              "sekaligus, di industri yang mayoritas pelakunya merugi. Yang harus "
              "dijelaskan pertanyaan berikutnya: kenapa bisa begitu.", False, INK)])
    notes(s, "Slide ini analisis kami sendiri, bukan tabel yang tercetak di kasus. "
             "KATAKAN ITU. Angka mentahnya dari Tabel 6.7; perbandingannya yang kami "
             "susun.\n\n"
             "Jelaskan dulu apa itu belanja transfer bersih: total uang keluar membeli "
             "pemain dikurangi total uang masuk menjual pemain. Jadi ini ukuran seberapa "
             "banyak uang baru yang benar-benar disuntikkan ke skuad.\n\n"
             "Angka kotornya juga menarik: MU belanja kotor £322 juta, tapi bersihnya "
             "cuma £100 juta. Artinya MU juga menjual banyak, dan menjual mahal.\n\n"
             "Cara paling mudah menyampaikan intinya: Real Madrid mengeluarkan uang empat "
             "kali lipat lebih banyak, dan hasilnya tetap kalah. Chelsea mengeluarkan "
             "empat kali lipat, hasilnya jauh lebih buruk lagi.\n\n"
             "Jangan sembunyikan Barcelona. Barcelona memang mengungguli MU di poin "
             "performa, tapi dengan belanja 2,5 kali lipat. Kejujuran ini justru "
             "memperkuat argumen kita, dan menghindari pertanyaan menjebak.\n\n"
             "Tutup dengan menyambung ke Q2 dan Q3: kalau bukan uang, lalu apa? "
             "Jawabannya ada di resource dan capability.")
    d.footer(s, FOOT_B)
    return s


def s24_swot(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 2 · Diterapkan", "SWOT Manchester United, Juli 2009",
               "Semua temuan Q1 dirangkum, lalu ditarik kesimpulan — sesuai langkah "
               "2 dan 3 Figure 4.2, bukan berhenti di daftar.", sublines=1)

    quads = [("S", "Strengths", RED, [
        "Merek global dengan 80 juta pendukung di Asia",
        "Laba tertinggi di Eropa: EBITDA €101,9 jt, RoS 12,6%",
        "Akademi dan jaringan pemandu bakat yang matang",
        "Disiplin transfer: belanja bersih hanya £100 jt"]),
        ("W", "Weaknesses", RED, [
            "Utang £616 jt warisan akuisisi Glazer 2005",
            "Bergantung pada satu orang berusia 67 tahun",
            "Belum ada rencana suksesi saat kasus ditulis",
            "Ronaldo, satu-satunya pemain MU di peringkat FIFA, baru dijual"]),
        ("O", "Opportunities", INK, [
            "Pasar Asia — India dan Cina disebut Aon sebagai target utama",
            "Sponsor per negara masih bisa diperbanyak",
            "Pendapatan siaran Premier League naik 43% dalam setahun",
            "Kanal digital: MUTV, MU Mobile, toko online"]),
        ("T", "Threats", INK, [
            "Harga pemain meledak, didorong Manchester City (£185 jt)",
            "Pesaing berpemilik sangat kaya: Abramovich, Sheikh Mansour",
            "Beban bunga membatasi kemampuan membeli pemain",
            "Barcelona unggul poin performa (200,0 vs 192,5)"])]
    gw = (CW - 0.30) / 2
    gh = 1.60
    for i, (L, nm, col, items) in enumerate(quads):
        x = ML + (i % 2) * (gw + 0.30)
        yy = y + (i // 2) * 1.76
        rect(s, x, yy, gw, gh, fill=PAPER, line=RULE)
        rect(s, x, yy, gw, 0.05, fill=col)
        txt(s, L, x + 0.24, yy + 0.16, 0.4, 0.40, size=20, color=col, bold=True, font=S_FONT)
        txt(s, nm, x + 0.66, yy + 0.20, 3.0, 0.30, size=13.5, color=INK, bold=True)
        bullets(s, items, x + 0.24, yy + 0.62, gw - 0.48, 0.96, size=10.5,
                color=INK_SOFT, gap=3, marker="·", marker_color=col, spacing=1.08)

    note(s, [("Kesimpulan (langkah 2): ", True, RED_DEEP),
             ("kekuatan MU cukup untuk menangkap peluang komersial di Asia, tapi tidak "
              "cukup menahan ancaman di pasar pemain — karena dua kelemahan "
              "terbesarnya justru menyerang sisi lapangan, yang jadi syarat bagi seluruh "
              "pendapatan komersialnya.", False, INK)])
    notes(s, "Ingatkan audiens: SWOT bukan bikin empat daftar. Jadi setelah membacakan "
             "daftarnya sekilas, langsung masuk ke kesimpulan di kotak bawah. Itu langkah "
             "2 dari Figure 4.2.\n\n"
             "Kesimpulannya, diuraikan: kekuatan MU terpusat di sisi komersial dan "
             "pengembangan pemain. Peluang terbesarnya juga komersial, di Asia. Jadi "
             "kekuatan dan peluang cocok — sampai sini bagus.\n\n"
             "Masalahnya ada di sisi ancaman. Ancaman terbesar MU ada di pasar pemain: "
             "harga meledak, pesaing punya pemilik berkantong sangat dalam. Dan dua "
             "kelemahan terbesar MU — utang dan ketergantungan pada Ferguson — "
             "keduanya menyerang sisi lapangan, bukan sisi komersial.\n\n"
             "Kenapa itu berbahaya: karena David Gill sendiri berkata pendapatan komersial "
             "mengalir SELAMA tim terus menang. Jadi kalau sisi lapangan runtuh, sisi "
             "komersial ikut terancam, walau tidak langsung.\n\n"
             "Untuk langkah 3 (tindakan), sambungkan: itu yang akan kita bahas di slide "
             "terakhir sebagai rekomendasi.")
    d.footer(s, FOOT_B)
    return s


def s25_resources(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 3 · Diterapkan", "Inventarisasi resource Manchester United",
               "Langkah pertama Q3: mendaftar aset bersaing klub memakai tipologi "
               "Tabel 4.3, semuanya berdasarkan bukti dari kasus.", sublines=1)

    tang = [("Finansial", "EBITDA €101,9 jt tertinggi di Eropa; laba bersih "
             "£46,8 jt; ekuitas £294 jt"),
            ("Fisik", "Old Trafford, diperluas 2006 dengan tambahan 7.500 kursi; museum "
             "dan tur stadion"),
            ("Organisasional", "Pemisahan tegas urusan tim (Ferguson) dan komersial "
             "(Gill, Arnold); anak usaha MU International"),
            ("Teknologi & kontrak", "Kontrak 34 pemain; portofolio hak sponsor "
             "berjangka panjang")]
    intang = [("Merek", "“Kami bukan sekadar klub olahraga, kami merek "
               "internasional” — Andy Anson. Sub-merek Fred the Red, MUFC, Red Devil"),
              ("Basis pendukung", "80 juta pendukung di Asia; 1,2 juta pemegang kartu "
               "kredit MU di Korea Selatan saja"),
              ("Human assets", "Sir Alex Ferguson sejak 1986; Cristiano Ronaldo "
               "(peringkat 1 FIFA, dijual Juni 2009); lebih dari 20 pemandu bakat"),
              ("Reputasi & relasi", "Aon: MU tak ada tandingannya dalam kesadaran merek "
               "global; AIG melompat ke peringkat 47 merek dunia dalam setahun")]
    w = (CW - 0.40) / 2
    for i, (label, rows, col) in enumerate([("Tangible", tang, INK),
                                            ("Intangible", intang, RED)]):
        x = ML + i * (w + 0.40)
        rect(s, x, y, w, 3.46, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.46, fill=col)
        txt(s, label, x + 0.24, y + 0.10, w - 0.5, 0.30, size=13.5, color=WHITE, bold=True)
        yy = y + 0.62
        for nm, ex in rows:
            txt(s, nm, x + 0.24, yy, w - 0.5, 0.24, size=12, color=col, bold=True)
            txt(s, ex, x + 0.24, yy + 0.25, w - 0.5, 0.44, size=11, color=INK_SOFT,
                spacing=1.12)
            yy += 0.72

    note(s, [("Perhatikan komposisinya: ", True, RED_DEEP),
             ("aset paling berharga MU hampir seluruhnya ada di kolom kanan, yang tidak "
              "berwujud. Itu yang membuat klub ini menarik sebagai contoh — dan "
              "sekaligus rapuh, karena aset tak berwujud bisa berjalan keluar pintu.",
              False, INK)])
    notes(s, "Sambungkan ke Tabel 4.3 yang dibahas di slide 9: tangible dibagi fisik, "
             "finansial, teknologi, organisasional. Intangible dibagi human assets, merek "
             "dan reputasi, relasi, budaya dan insentif.\n\n"
             "Tunjukkan bahwa MU punya isian di hampir semua kotak. Tapi yang benar-benar "
             "memberi keunggulan ada di kolom kanan.\n\n"
             "Bukti kekuatan mereknya layak diceritakan lengkap, karena kuat sekali: "
             "David Prosperi, VP Global PR Aon, mengatakan bahwa di tahun pertama setelah "
             "kesepakatan sponsor AIG dimulai, AIG melompat dari tidak masuk daftar 100 "
             "merek dunia menjadi peringkat 47. Kalimatnya: Manchester United tidak ada "
             "tandingannya di dunia olahraga soal kesadaran merek global, khususnya di "
             "Asia.\n\n"
             "Itu bukan klaim MU sendiri. Itu kesaksian pihak yang membayar. Jauh lebih "
             "kuat sebagai bukti.\n\n"
             "Kalimat penutup slide penting untuk dijelaskan: aset tak berwujud bisa "
             "pergi. Ferguson bisa pensiun. Ronaldo sudah dijual. Itu yang membedakannya "
             "dari stadion, yang tidak bisa ke mana-mana.")
    d.footer(s, FOOT_B)
    return s


def s26_capabilities(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 3 · Diterapkan", "Capability MU, dan mana yang core",
               "Kami pakai tangga di slide 7: mana yang sekadar competence, mana yang "
               "distinctive, dan mana yang benar-benar core competence.", sublines=2)

    caps = [("Mengenali dan mengembangkan bakat", "CORE",
             "Pemandu bakat diperbanyak dari 5 jadi lebih dari 20 orang; Youth Academy; "
             "dua pemandu bakat penuh waktu di Brasil sejak 2008.", RED_DEEP),
            ("Membentuk tim, bukan kumpulan bintang", "CORE",
             "“Tim terbaik menonjol karena mereka benar-benar sebuah tim — "
             "anggotanya menyatu sehingga tim bergerak dengan satu semangat.”", RED_DEEP),
            ("Disiplin di pasar transfer", "DISTINCTIVE",
             "Belanja kotor £322 jt, bersih hanya £100 jt. Menjual di puncak "
             "nilai: Beckham, Verón, van Nistelrooy, Ronaldo (£80 jt).", RED),
            ("Mengubah merek jadi uang", "CORE",
             "Sponsor khusus per negara (Tri Indonesia, Bharti Airtel), sub-merek per "
             "usia, MU Finance, MU Mobile, MUTV, Soccer Schools, tur Asia.", RED_DEEP),
            ("Rotasi skuad", "DISTINCTIVE",
             "Kasus menyebut Ferguson pelopornya: menyusun ulang tim untuk "
             "mengistirahatkan pemain dan menyesuaikan taktik pada lawan.", RED),
            ("Tata kelola dan pemisahan peran", "COMPETENCE",
             "Glazer memilih peran pasif; Ferguson dan Gill diberi kebebasan memutuskan. "
             "Berjalan baik, tapi bukan pembeda dari pesaing.", MUTED)]
    w = (CW - 2 * 0.26) / 3
    for i, (nm, tag, body, col) in enumerate(caps):
        x = ML + (i % 3) * (w + 0.26)
        yy = y + (i // 3) * 1.76
        rect(s, x, yy, w, 1.60, fill=PAPER, line=RULE)
        rect(s, x, yy, w, 0.05, fill=col)
        txt(s, tag, x + 0.22, yy + 0.16, w - 0.44, 0.22, size=9.5, color=col,
            bold=True, caps=True)
        txt(s, nm, x + 0.22, yy + 0.42, w - 0.44, 0.34, size=12.5, color=INK, bold=True,
            spacing=1.06)
        txt(s, body, x + 0.22, yy + 0.80, w - 0.44, 0.72, size=10.5, color=INK_SOFT,
            spacing=1.14)

    note(s, [("Yang perlu disadari: ", True, RED_DEEP),
             ("empat dari enam capability ini — bakat, pembentukan tim, disiplin "
              "transfer, rotasi skuad — semuanya bermuara pada satu orang yang sama. "
              "Hanya kemampuan komersial yang berdiri di luar Ferguson.", False, INK)])
    notes(s, "Slide ini menerapkan tangga competence dari slide 7. Jelaskan alasan "
             "penempatannya, jangan cuma dibacakan.\n\n"
             "CORE COMPETENCE — dikerjakan sangat baik DAN ada di jantung strategi:\n"
             "- Mengenali dan mengembangkan bakat: ini sumber pemain MU, langsung "
             "menentukan kekuatan tim.\n"
             "- Membentuk tim: ini yang membedakan MU dari klub yang sekadar mengumpulkan "
             "bintang seperti Real Madrid.\n"
             "- Mengubah merek jadi uang: ini mesin pendapatan klub.\n\n"
             "DISTINCTIVE COMPETENCE — lebih baik dari pesaing, tapi bukan inti "
             "strategi:\n"
             "- Disiplin transfer dan rotasi skuad. Keduanya nyata lebih baik dari "
             "pesaing, tapi sifatnya mendukung.\n\n"
             "COMPETENCE biasa — dikerjakan baik, tapi tidak membedakan:\n"
             "- Tata kelola. Kasus memang memuji MU sebagai klub Inggris yang paling "
             "berhasil membangun tata kelola efektif, tapi banyak klub lain juga punya "
             "struktur serupa.\n\n"
             "Kalimat penutup di kotak bawah adalah jembatan ke slide VRIN. Ucapkan "
             "pelan: empat dari enam kemampuan ini bermuara pada satu orang. Itu "
             "pertanda bahaya, dan uji VRIN akan menunjukkan kenapa.")
    d.footer(s, FOOT_B)
    return s


def s27_vrin(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 3 · Uji VRIN", "Dua keunggulan, dua hasil yang berbeda",
               "Kami uji dua hal dengan empat saringan yang sama: sistem Ferguson, dan "
               "merek beserta mesin komersialnya.", sublines=1)

    rows = [["Tes", "Sistem Ferguson", "Merek & mesin komersial"],
            ["Valuable",
             "LOLOS. Poin Eropa tertinggi, tiga gelar liga beruntun, Liga Champions 2008, "
             "laba tertinggi di Eropa.",
             "LOLOS. Aon membayar £20 juta per tahun — nilai per tahun "
             "tertinggi di antara kesepakatan yang disebut kasus."],
            ["Rare",
             "LOLOS. Tabel 6.8 hanya memuat 16 pelatih paling dihormati dunia; Ferguson "
             "punya masa jabatan terpanjang di satu klub.",
             "LOLOS. 80 juta pendukung di Asia. Kasus menyebut hanya Real Madrid yang "
             "setara dalam mengeksploitasi merek global."],
            ["Inimitable",
             "LOLOS. Kasus sendiri menyebut penentu performa tim “tetap misteri … "
             "menentang analisis” — causal ambiguity. Ditambah 23 tahun "
             "akumulasi dan social complexity.",
             "LOLOS. Basis pendukung dibangun puluhan tahun lewat prestasi dan siaran "
             "televisi. Chelsea dan Manchester City dengan dana lebih besar pun tidak "
             "berhasil menyamainya."],
            ["Nonsubstitutable",
             "GAGAL. Tidak ada penggantinya. Kasus menegaskan pelatih yang sangat sukses "
             "di satu tim sering gagal total di tim lain.",
             "LOLOS. Tidak ada pengganti bagi loyalitas pendukung. Sponsor membeli akses "
             "ke basis fan itu, bukan ke stadion atau pemain tertentu."]]
    cwd = [1.70, (CW - 1.70) / 2, (CW - 1.70) / 2]
    tbl = make_table(s, rows, ML, y, CW, cwd, row_h=0.64, head_h=0.38,
                     size=10.5, head_size=10.5,
                     aligns=[PP_ALIGN.LEFT, PP_ALIGN.LEFT, PP_ALIGN.LEFT],
                     body_fills=[PAPER, TINT, PAPER, RED_TINT])
    for ri, h in enumerate([0.60, 0.60, 0.86, 0.68], start=1):
        tbl.rows[ri].height = Inches(h)
    style_cell(tbl.cell(4, 0), "Nonsubstitutable", size=10.5, color=WHITE, bold=True,
               fill=RED, align=PP_ALIGN.LEFT)
    set_cell_border(tbl.cell(4, 0), ("T", "B", "L", "R"), RULE, 0.75)
    style_cell(tbl.cell(4, 1), rows[4][1], size=10.5, color=WHITE, bold=False,
               fill=RED, align=PP_ALIGN.LEFT)
    set_cell_border(tbl.cell(4, 1), ("T", "B", "L", "R"), RULE, 0.75)

    note(s, [("Kesimpulan Q3: ", True, SALMON),
             ("keunggulan MU dari Ferguson itu nyata, tapi tidak tahan lama karena gagal "
              "tes terakhir. Klub memperlakukan Ferguson sebagai resource — sesuatu "
              "yang dimiliki — padahal yang dibutuhkan agar bertahan adalah "
              "capability yang melekat pada organisasi.", False, WHITE)], dark=True)
    notes(s, "Ini slide paling penting di seluruh presentasi. Beri waktu lebih.\n\n"
             "Jalankan baris per baris, bandingkan kiri dan kanan. Tiga baris pertama "
             "hasilnya SAMA: dua-duanya lolos. Baru di baris keempat hasilnya berpisah.\n\n"
             "Untuk baris Inimitable, kutip kalimat kasusnya langsung, karena ini hadiah "
             "dari penulis kasus: 'the determinants of team performance remained a "
             "mystery … depends on a complex mix of factors that defies analysis.' "
             "Itu definisi causal ambiguity, ditulis oleh kasusnya sendiri.\n\n"
             "Untuk social complexity, kutip Ferguson: ia ingin membangun hubungan "
             "personal dengan semua orang di klub — bukan hanya pemain dan pelatih, "
             "tapi juga pegawai kantor, juru masak, dan petugas binatu. Itu persis yang "
             "dimaksud social complexity di slide 11.\n\n"
             "Untuk baris Nonsubstitutable, kutip: 'coaches that achieve outstanding "
             "success with one team are often dismal failures with another.' Artinya "
             "tidak ada mekanisme pengganti.\n\n"
             "Kesimpulan yang harus sampai ke audiens: MU bingung membedakan resource dan "
             "capability. Ferguson adalah resource — aset yang dimiliki, dan bisa "
             "pergi. Yang dibutuhkan agar keunggulan bertahan adalah capability yang "
             "hidup di dalam organisasi, bukan di kepala satu orang.\n\n"
             "Kalau ditanya 'tapi bukankah Ferguson membangun sistem?' — jawab: "
             "itulah pertanyaan inti kasus, dan kami bahas di slide berikutnya.")
    d.footer(s, FOOT_B)
    return s


def s28_dynamic(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 3 · Dynamic Capability", "Tiga kali membangun ulang tim juara",
               "MU bukan cuma punya satu skuad bagus. MU berulang kali membongkar dan "
               "menyusun ulang skuadnya — dan tetap juara.", sublines=1)

    cycles = [("1986 – 1993", "Membersihkan dan membangun fondasi",
               "Ferguson menyingkirkan pemain yang dinilai kurang berbakat atau kurang "
               "berkomitmen, mempertahankan Bryan Robson, mendatangkan Hughes, Ince, "
               "Cantona, Keane. Ia juga menegakkan disiplin latihan.",
               "FA Cup 1990 · Piala Winners 1991 · gelar liga pertama 1993"),
              ("1994 – 2003", "Generasi akademi",
               "Juara liga junior 1990 menghasilkan Giggs, Beckham, Butt, Gary dan Phil "
               "Neville, serta Scholes. Mereka jadi inti tim yang mendominasi sepakbola "
               "Inggris satu dekade.",
               "Puncaknya 1999: liga, FA Cup, European Cup, Intercontinental Cup"),
              ("2003 – 2008", "Regenerasi kedua",
               "Beckham, Keane, Schmeichel, Cole, Sheringham, Stam dijual. Penggantinya "
               "Ferdinand, Ronaldo, Rooney, van der Sar, Evra, Vidić, Carrick.",
               "Liga Champions 2008 · tiga gelar liga beruntun 2007–2009")]
    w = (CW - 2 * 0.28) / 3
    x = ML
    for period, nm, body, out in cycles:
        rect(s, x, y, w, 3.20, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.05, fill=RED)
        txt(s, period, x + 0.26, y + 0.22, w - 0.52, 0.30, size=14, color=RED, bold=True,
            font=S_FONT)
        txt(s, nm, x + 0.26, y + 0.58, w - 0.52, 0.32, size=13.5, color=INK, bold=True,
            spacing=1.06)
        txt(s, body, x + 0.26, y + 0.96, w - 0.52, 1.40, size=11, color=INK_SOFT,
            spacing=1.16)
        rect(s, x + 0.26, y + 2.46, w - 0.52, 0.012, fill=RULE)
        txt(s, out, x + 0.26, y + 2.60, w - 0.52, 0.50, size=10.5, color=RED,
            bold=True, spacing=1.12)
        x += w + 0.28

    note(s, [("Pertanyaan yang menentukan seluruh kasus: ", True, SALMON),
             ("kemampuan memperbarui diri ini milik siapa — Ferguson, atau klub? "
              "Setelah Matt Busby pensiun 1969, MU tidak juara liga selama 18 tahun. "
              "Kasus menyediakan sendiri presedennya.", False, WHITE)], dark=True)
    notes(s, "Sambungkan ke slide 12: dynamic capability adalah kemampuan memperbarui "
             "resource dan capability secara terus-menerus, sampai memperbarui itu "
             "sendiri jadi rutinitas.\n\n"
             "Tiga siklus di slide ini adalah buktinya. MU tidak sekadar beruntung punya "
             "satu generasi emas. MU membongkar dan membangun ulang tiga kali, dan setiap "
             "kali menghasilkan tim juara.\n\n"
             "Siklus kedua yang paling terkenal: juara liga junior 1990 melahirkan "
             "kelompok yang sering disebut Class of '92. Enam pemain dari satu angkatan "
             "akademi menjadi inti tim utama. Itu hasil dari capability nomor satu di "
             "slide sebelumnya.\n\n"
             "Siklus ketiga membuktikan MU juga berani menjual legendanya sendiri. "
             "Beckham, Keane, Schmeichel semuanya dijual, padahal mereka ikon. Itu "
             "disiplin yang jarang dimiliki klub lain.\n\n"
             "Sekarang pertanyaan pentingnya, dan sampaikan ini dengan tenang: apakah "
             "kemampuan memperbarui ini milik KLUB, atau milik FERGUSON?\n\n"
             "Kasus memberi kita petunjuk yang tidak menyenangkan. Setelah Matt Busby "
             "pensiun pada 1969, MU merosot dan tidak memenangi satu pun gelar liga "
             "selama 18 tahun, dan hanya sekali jadi runner-up. Kasus menuliskan itu "
             "sendiri di bagian sejarah. Pola yang sama bisa terulang.")
    d.footer(s, FOOT_B)
    return s


def s29_valuechain(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 4 · Diterapkan", "Rantai nilai dan struktur biaya MU",
               "Kerangka Figure 4.3 dipetakan ke aktivitas nyata sebuah klub. Hasilnya: "
               "keunggulan biaya MU ada di HULU, di cara mendapatkan pemain.",
               sublines=2)

    prim = [("Supply Chain", "Mendapatkan pemain",
             "Akademi, 20+ pemandu bakat, pasar transfer"),
            ("Operations", "Latihan dan bertanding",
             "Disiplin latihan, rotasi skuad, taktik"),
            ("Distribution", "Menyalurkan tontonan",
             "Hak siar liga dan UEFA, MUTV, Old Trafford"),
            ("Sales & Marketing", "Menjual merek",
             "Aon, Nike, 13+ sponsor per negara, tur Asia"),
            ("Service", "Melayani pendukung",
             "Superstore, museum, Soccer Schools, MU Mobile")]
    w = (CW * 0.62 - 4 * 0.12) / 5
    txt(s, "Primary activities", ML, y, CW * 0.62, 0.26, size=11, color=RED,
        bold=True, caps=True)
    x = ML
    for nm, role, ev in prim:
        rect(s, x, y + 0.30, w, 1.86, fill=PAPER, line=RULE)
        rect(s, x, y + 0.30, w, 0.05, fill=RED)
        txt(s, nm, x + 0.14, y + 0.44, w - 0.28, 0.42, size=10.5, color=MUTED,
            bold=True, spacing=1.04)
        txt(s, role, x + 0.14, y + 0.90, w - 0.28, 0.42, size=12, color=INK, bold=True,
            spacing=1.04)
        txt(s, ev, x + 0.14, y + 1.36, w - 0.28, 0.72, size=9.5, color=INK_SOFT,
            spacing=1.12)
        x += w + 0.12

    x2 = ML + CW * 0.62 + 0.40
    w2 = CW - CW * 0.62 - 0.40
    txt(s, "Di mana letak keunggulan biayanya", x2, y, w2, 0.26, size=11, color=RED,
        bold=True, caps=True)
    srcs = [("Gaji hanya ± 50% pendapatan",
             "Rata-rata Premier League 62%, Serie A 68%, Chelsea 81%. Selisih 31 poin "
             "dengan Chelsea.", RED),
            ("Akademi menghasilkan pemain gratis",
             "Tanpa biaya transfer. Belanja bersih 2003–09 hanya £100 jt.", RED),
            ("Menjual di puncak harga",
             "Ronaldo dilepas dengan rekor dunia £80 jt; laba penjualan pemain "
             "£21,8 jt pada 2008 saja.", RED),
            ("Yang melawan arah",
             "Amortisasi pemain naik dari £13,1 jt (2000) ke £35,5 jt (2008).",
             INK)]
    yy = y + 0.30
    for nm, body, col in srcs:
        rect(s, x2, yy, w2, 0.74, fill=PAPER, line=RULE)
        rect(s, x2, yy, 0.05, 0.74, fill=col)
        txt(s, nm, x2 + 0.24, yy + 0.09, w2 - 0.48, 0.24, size=11.5, color=INK, bold=True)
        txt(s, body, x2 + 0.24, yy + 0.33, w2 - 0.48, 0.36, size=10.5, color=INK_SOFT,
            spacing=1.10)
        yy += 0.82

    sup = [("Product R&D & Systems", "Metodologi akademi, inovasi rotasi skuad, MUTV"),
           ("Human Resource Management", "Rekrutmen, struktur gaji, penegakan disiplin"),
           ("General Administration", "Pemisahan peran Gill dan Ferguson; MU International")]
    y2 = y + 2.26
    txt(s, "Support activities", ML, y2, CW * 0.62, 0.26, size=11, color=INK,
        bold=True, caps=True)
    w3 = (CW * 0.62 - 2 * 0.16) / 3
    x = ML
    for nm, body in sup:
        rect(s, x, y2 + 0.30, w3, 0.94, fill=TINT, line=RULE)
        rect(s, x, y2 + 0.30, 0.05, 0.94, fill=INK)
        txt(s, nm, x + 0.20, y2 + 0.40, w3 - 0.4, 0.24, size=10.5, color=INK, bold=True)
        txt(s, body, x + 0.20, y2 + 0.66, w3 - 0.4, 0.48, size=9.5, color=INK_SOFT,
            spacing=1.10)
        x += w3 + 0.16

    note(s, [("Nilai bagi dua pihak berbeda. ", True, RED_DEEP),
             ("Bagi pendukung: prestasi, sejarah, dan pengalaman Old Trafford. Bagi "
              "sponsor: akses ke 80 juta pendukung Asia, ditambah bukti bahwa akses itu "
              "bekerja — lompatan AIG ke peringkat 47 merek dunia dalam satu tahun.",
              False, INK)])
    notes(s, "Terjemahkan Figure 4.3 ke bahasa sepakbola dulu, supaya audiens paham:\n"
             "Supply chain di pabrik artinya membeli bahan baku. Di klub sepakbola, "
             "'bahan bakunya' adalah pemain. Jadi supply chain MU adalah akademi dan "
             "pasar transfer.\n"
             "Operations di pabrik artinya mengolah bahan jadi produk. Di klub, artinya "
             "latihan dan pertandingan.\n"
             "Distribution artinya menyalurkan produknya. Di klub, produknya adalah "
             "tontonan, disalurkan lewat siaran televisi dan stadion.\n\n"
             "Temuan utamanya: keunggulan biaya MU ada di HULU, bukan di operasi atau "
             "pemasaran. MU tidak lebih hemat dalam melatih atau beriklan. MU lebih hemat "
             "dalam MENDAPATKAN pemain.\n\n"
             "Angka gaji dari kasus halaman 578: rata-rata Premier League 62%, Serie A "
             "68%, La Liga 63%. Chelsea 81%, tertinggi di Inggris. MU dan Arsenal "
             "masing-masing sekitar setengah pendapatannya.\n\n"
             "Jangan lupa menyebut yang melawan arah: amortisasi pemain naik hampir tiga "
             "kali lipat antara 2000 dan 2008. Itu biaya akuntansi dari pembelian pemain, "
             "dan artinya MU juga makin banyak membeli. Kejujuran ini penting.\n\n"
             "Untuk customer value proposition, ingatkan rumus di slide 13: V dikurangi P. "
             "MU punya dua 'pelanggan' dengan V yang berbeda — pendukung dan sponsor.")
    d.footer(s, FOOT_B)
    return s


def s30_csa(d):
    s = d.blank()
    rect(s, ML, 0.44, 0.30, 0.055, fill=RED)
    txt(s, "Pertanyaan 5 · Diterapkan", ML + 0.42, 0.36, CW - 0.42, 0.26, size=10,
        color=RED, bold=True, spacing=1.0, caps=True)
    txt(s, "Matriks kekuatan kompetitif Manchester United", ML, 0.68, CW, 0.50, size=27,
        color=INK, bold=True, spacing=0.98)
    txt(s, "Bobot dan rating disusun kelompok kami berdasarkan Tabel 6.2, 6.3, 6.5, 6.6 "
           "dan 6.7 kasus. Isi sel: rating (1–10) / skor tertimbang.",
        ML, 1.22, CW, 0.28, size=11.5, color=INK_SOFT)

    y = 1.60
    rows = [["Key Success Factor", "Bobot", "Man United", "Real Madrid", "Barcelona",
             "Chelsea", "Arsenal"],
            ["Kualitas skuad", "0,15", "6 / 0,90", "9 / 1,35", "10 / 1,50", "9 / 1,35", "6 / 0,90"],
            ["Kemampuan manajer", "0,15", "10 / 1,50", "5 / 0,75", "8 / 1,20", "6 / 0,90", "8 / 1,20"],
            ["Akademi & pemandu bakat", "0,10", "9 / 0,90", "3 / 0,30", "9 / 0,90", "3 / 0,30", "8 / 0,80"],
            ["Merek & basis pendukung", "0,15", "10 / 1,50", "9 / 1,35", "7 / 1,05", "5 / 0,75", "6 / 0,90"],
            ["Kemampuan komersial", "0,10", "10 / 1,00", "9 / 0,90", "7 / 0,70", "5 / 0,50", "6 / 0,60"],
            ["Profitabilitas", "0,10", "10 / 1,00", "5 / 0,50", "7 / 0,70", "1 / 0,10", "6 / 0,60"],
            ["Keleluasaan finansial (utang)", "0,10", "4 / 0,40", "7 / 0,70", "9 / 0,90", "5 / 0,50", "2 / 0,20"],
            ["Stadion & matchday", "0,05", "9 / 0,45", "8 / 0,40", "9 / 0,45", "5 / 0,25", "9 / 0,45"],
            ["Rekam jejak prestasi", "0,10", "10 / 1,00", "9 / 0,90", "10 / 1,00", "9 / 0,90", "9 / 0,90"],
            ["TOTAL SKOR TERTIMBANG", "1,00", "8,65", "7,15", "8,40", "5,55", "6,55"]]
    cwd = [3.40, 0.95, 1.52, 1.52, 1.52, 1.50, 1.50]
    row_h, head_h = 0.305, 0.38
    tbl = make_table(s, rows, ML, y, sum(cwd), cwd, row_h=row_h, head_h=head_h,
                     size=10.5, head_size=10,
                     aligns=[PP_ALIGN.LEFT] + [PP_ALIGN.CENTER] * 6)
    for ri in range(1, 10):
        style_cell(tbl.cell(ri, 2), rows[ri][2], size=10.5, color=RED_DEEP, bold=True,
                   fill=RED_TINT, align=PP_ALIGN.CENTER)
        set_cell_border(tbl.cell(ri, 2), ("T", "B", "L", "R"), RULE, 0.75)
    for ci in range(7):
        style_cell(tbl.cell(10, ci), rows[10][ci], size=12, color=WHITE, bold=True,
                   fill=INK, align=PP_ALIGN.LEFT if ci == 0 else PP_ALIGN.CENTER)
        set_cell_border(tbl.cell(10, ci), ("T", "B", "L", "R"), INK, 0.75)
    style_cell(tbl.cell(10, 2), "8,65", size=14, color=SALMON, bold=True, fill=INK,
               align=PP_ALIGN.CENTER, font=S_FONT)
    set_cell_border(tbl.cell(10, 2), ("T", "B", "L", "R"), INK, 0.75)

    y2 = y + head_h + 10 * row_h + 0.24
    boxes = [("Unggul 0,25 poin", "MU 8,65 vs Barcelona 8,40. Tipis, dan seluruhnya "
              "bertumpu pada satu baris saja.", RED),
             ("Turun ke 7,90", "Kalau rating manajer jatuh dari 10 ke 5 karena ganti "
              "pelatih, MU langsung di bawah Barcelona.", INK),
             ("Butuh minimal 8,3", "Rating yang harus dicapai pengganti Ferguson supaya "
              "MU sekadar bertahan sejajar Barcelona.", INK)]
    w = (CW - 2 * 0.26) / 3
    x = ML
    for big, body, col in boxes:
        rect(s, x, y2, w, 1.16, fill=PAPER if col is RED else INK,
             line=RULE if col is RED else None)
        rect(s, x, y2, 0.05, 1.16, fill=RED)
        txt(s, big, x + 0.26, y2 + 0.12, w - 0.5, 0.34, size=16,
            color=RED if col is RED else SALMON, bold=True, font=S_FONT)
        txt(s, body, x + 0.26, y2 + 0.52, w - 0.5, 0.58, size=10.5,
            color=INK_SOFT if col is RED else WHITE, spacing=1.10)
        x += w + 0.26
    notes(s, "Bilang dari awal: bobot dan rating ini KAMI yang menentukan, berdasarkan "
             "data kasus. Itu memang cara kerja alat ini — buku pun memakai contoh "
             "hipotetis di Tabel 4.4.\n\n"
             "Alasan beberapa rating yang mungkin ditanya:\n"
             "- Kualitas skuad MU hanya 6, padahal juara. Sebabnya: Tabel 6.3 memuat "
             "peringkat pemain dunia FIFA 2008–09, dan satu-satunya pemain MU di "
             "sana adalah Ronaldo — yang baru dijual Juni 2009. Jadi per Juli 2009, "
             "MU tidak punya pemain di daftar itu. Barcelona punya lima.\n"
             "- Kemampuan manajer MU 10, Real Madrid 5. Sebabnya: Ferguson punya masa "
             "jabatan terpanjang di Tabel 6.8, sementara Real Madrid memecat 10 pelatih "
             "antara 2003 dan Juli 2009.\n"
             "- Keleluasaan finansial MU hanya 4 karena utang £616 juta. Arsenal "
             "malah 2 karena utangnya £896 juta.\n\n"
             "Sekarang bagian yang paling penting, dan ini poin puncak presentasi:\n"
             "MU unggul dari Barcelona hanya 0,25 poin. Dan penyumbang terbesar "
             "keunggulan itu adalah baris 'kemampuan manajer', tempat MU dapat 10 "
             "sementara Barcelona 8.\n\n"
             "Coba turunkan rating itu dari 10 ke 5, seolah penggantinya manajer "
             "rata-rata. Skor MU turun 0,75 menjadi 7,90 — langsung di bawah "
             "Barcelona.\n\n"
             "Hitung titik impasnya: MU tanpa baris manajer punya 7,15. Supaya totalnya "
             "kembali ke 8,40, baris manajer harus menyumbang 1,25. Dengan bobot 0,15, "
             "berarti ratingnya minimal 8,3. Artinya penggantinya harus manajer kelas "
             "dunia, bukan sekadar bagus.\n\n"
             "Ini menghubungkan Q5 kembali ke Q3: baris yang paling rapuh di matriks "
             "adalah justru resource yang gagal tes Nonsubstitutable.")
    d.footer(s, FOOT_B)
    return s


def s31_q6(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 6 · Diterapkan", "Priority list dan rekomendasi kami",
               "Keluaran akhir Chapter 4: isu yang harus masuk meja David Gill, "
               "ditambah usulan tindakan dari kelompok kami.", sublines=1)

    wl = CW * 0.45
    worries = [("1", "Bagaimana mengganti Ferguson tanpa merusak sistemnya?",
                "Gill belum memutuskan; Ferguson belum mengumumkan niat pensiun."),
               ("2", "Apa yang harus dilakukan soal utang £616 juta?",
                "Membatasi daya beli justru saat Manchester City belanja £185 jt."),
               ("3", "Bagaimana menambal skuad setelah Ronaldo pergi?",
                "Tidak ada lagi pemain MU di peringkat FIFA Tabel 6.3."),
               ("4", "Apakah perlu membangun penyangga organisasi?",
                "Tanpa director of football, semua fungsi menumpuk pada manajer tim."),
               ("5", "Bagaimana menjaga pendapatan komersial jika prestasi turun?",
                "Gill sendiri bilang uang mengalir selama tim menang."),
               ("6", "Apakah tata kelola tetap aman tanpa Ferguson dan Gill?",
                "Peran pasif Glazer berjalan karena ada dua orang ini.")]
    txt(s, "Priority list — berisi pertanyaan, bukan jawaban", ML, y, wl, 0.26,
        size=11, color=RED, bold=True, caps=True)
    yy = y + 0.32
    for n, nm, body in worries:
        rect(s, ML, yy, wl, 0.66, fill=PAPER, line=RULE)
        rect(s, ML, yy, 0.05, 0.66, fill=RED)
        txt(s, n, ML + 0.22, yy + 0.17, 0.28, 0.30, size=14, color=RED, bold=True, font=S_FONT)
        txt(s, nm, ML + 0.58, yy + 0.07, wl - 0.82, 0.26, size=11, color=INK, bold=True,
            spacing=1.04)
        txt(s, body, ML + 0.58, yy + 0.34, wl - 0.82, 0.28, size=9.5, color=INK_SOFT,
            spacing=1.06)
        yy += 0.74

    x2 = ML + wl + 0.40
    w2 = CW - wl - 0.40
    txt(s, "Rekomendasi kelompok 4", x2, y, w2, 0.26, size=11, color=INK, bold=True, caps=True)
    recs = [("Ubah resource jadi capability sebelum Ferguson pergi",
             "Tuliskan sistem pemanduan bakat, akademi, dan rotasi skuad menjadi prosedur "
             "organisasi. Selama ini sistem itu hidup di kepala satu orang."),
            ("Pilih penerus dari dalam, dengan masa transisi",
             "Orang dalam menjaga sistem tetap jalan. Ferguson tetap mendampingi sebagai "
             "mentor untuk menutup kekurangan wibawa yang dikhawatirkan Gill."),
            ("Tolak opsi revolusi",
             "Mourinho berkonflik dengan Abramovich. Real Madrid memecat 10 pelatih "
             "dalam enam tahun. Membongkar sistem Ferguson menghancurkan aset yang "
             "paling sulit ditiru."),
            ("Lindungi dan percepat mesin komersial",
             "Merek adalah satu-satunya keunggulan yang lolos keempat tes VRIN. Perkuat "
             "India dan Cina sekarang, selagi prestasi masih tinggi."),
            ("Turunkan utang untuk memulihkan keleluasaan",
             "Keleluasaan finansial adalah baris terlemah MU di matriks Q5. Tanpa "
             "perbaikan, klub tidak bisa bereaksi saat transisi menuntut belanja besar.")]
    yy = y + 0.32
    for nm, body in recs:
        rect(s, x2, yy, w2, 0.78, fill=TINT, line=RULE)
        rect(s, x2, yy, 0.05, 0.78, fill=INK)
        txt(s, nm, x2 + 0.24, yy + 0.09, w2 - 0.48, 0.24, size=11.5, color=RED_DEEP, bold=True)
        txt(s, body, x2 + 0.24, yy + 0.33, w2 - 0.48, 0.42, size=10, color=INK_SOFT,
            spacing=1.08)
        yy += 0.86
    notes(s, "Ingatkan aturan Q6 dari slide 17: priority list berisi PERTANYAAN, bukan "
             "jawaban. Itu sebabnya kolom kiri semuanya berbentuk 'bagaimana', 'apa yang "
             "harus dilakukan soal', dan 'apakah perlu'. Persis pola yang diminta buku.\n\n"
             "Kolom kanan adalah rekomendasi kami, dan itu sudah masuk tahap berikutnya "
             "— penyusunan strategi. Pisahkan keduanya dengan jelas saat bicara, "
             "jangan dicampur.\n\n"
             "Logika rekomendasi nomor satu, yang paling penting: seluruh analisis Q3 "
             "menunjukkan masalah MU bukan kekurangan resource, tapi kenyataan bahwa "
             "capability terpentingnya tidak melekat pada organisasi. Maka solusinya "
             "bukan membeli pemain, melainkan memindahkan sistem Ferguson dari kepalanya "
             "ke dalam prosedur klub.\n\n"
             "Kenapa menolak Mourinho: kasus menyediakan dua buktinya sendiri. Pertama, "
             "kepergian Mourinho dari Chelsea disebabkan gesekan dengan Abramovich soal "
             "pembelian pemain, pemilihan pemain, dan gaya bermain. Kedua, Real Madrid "
             "yang presidennya ikut campur memecat 10 pelatih dalam enam tahun. "
             "Keduanya menunjukkan pola yang sama: campur tangan dan pergantian cepat "
             "merusak kesinambungan.\n\n"
             "Kalau ada yang berargumen bahwa orang dalam terlalu lemah wibawanya "
             "— itu memang kekhawatiran Gill sendiri di kasus, dan kami tidak "
             "menyangkalnya. Justru itu sebabnya kami mengusulkan masa transisi dengan "
             "Ferguson tetap mendampingi.")
    d.footer(s, FOOT_B)
    return s


def s32_thanks(d):
    s = d.blank(bg=INK)
    rect(s, 0, 0, 0.34, SH, fill=RED)
    rect(s, SW - 0.34, 0, 0.34, SH, fill=RED)
    txt(s, "Terima kasih", 0, 2.30, SW, 1.0, size=52, color=WHITE, bold=True,
        align=PP_ALIGN.CENTER)
    rect(s, SW / 2 - 0.85, 3.52, 1.7, 0.04, fill=RED)
    txt(s, "Kami membuka sesi tanya jawab dan diskusi", 0, 3.82, SW, 0.40, size=15,
        color=ASH, align=PP_ALIGN.CENTER)
    txt(s, "Kelompok 4", 0, 4.66, SW, 0.28, size=10, color=RED, bold=True,
        align=PP_ALIGN.CENTER, caps=True)
    txt(s, "Fitra Aidila   ·   Aulia Sisca Rahmadiyanti   ·   Bagaskoro   ·   "
           "Imam Prayudha   ·   Tegar Awanto",
        0, 4.96, SW, 0.40, size=14, color=WHITE, align=PP_ALIGN.CENTER)
    txt(s, "Strategic Management  ·  Dr. Rangga Almahendra, S.T., M.M.", 0, 5.52,
        SW, 0.30, size=11.5, color=MUTED, align=PP_ALIGN.CENTER)
    txt(s, "Chapter 4 — Thompson, Peteraf, Gamble & Strickland, 2024 Release ISE   |   "
           "Kasus: Manchester United, Robert M. Grant (2010)",
        0, 6.40, SW, 0.30, size=10, color=RGBColor(0x5A, 0x51, 0x4D),
        align=PP_ALIGN.CENTER)
    notes(s, "Lima pertanyaan yang paling mungkin muncul, dan jawabannya:\n\n"
             "1. Kenapa enam pertanyaan, bukan lima?\n"
             "Edisi lama buku ini memakai lima pertanyaan dengan SWOT diselipkan ke dalam "
             "analisis resource. Edisi 2024 memisahkan SWOT jadi Q2 tersendiri.\n\n"
             "2. Kenapa laporan keuangan MU terlihat sehat padahal utangnya £616 juta?\n"
             "Karena Appendix kasus menampilkan akun Manchester United Limited, sedangkan "
             "utang akuisisi Glazer berada di perusahaan induk di atasnya.\n\n"
             "3. Apakah akademi MU capability organisasi atau perpanjangan tangan Ferguson?\n"
             "Ini pertanyaan inti kasus, dan jujur saja kasus tidak memberi jawaban pasti. "
             "Bukti yang mendukung 'milik organisasi': ada Youth Academy, lebih dari 20 "
             "pemandu bakat, struktur yang jelas. Bukti yang mendukung 'milik Ferguson': "
             "semuanya dibangun olehnya, dan Gill sendiri khawatir sistem itu ikut hilang.\n\n"
             "4. Kalau merek MU lolos keempat tes VRIN, kenapa klubnya tetap rentan?\n"
             "Karena dua keunggulan itu saling bergantung. Gill berkata pendapatan "
             "komersial mengalir SELAMA tim menang. Uji VRIN menilai satu resource pada "
             "satu waktu, dan tidak menangkap ketergantungan antar-keunggulan.\n\n"
             "5. Utang £616 juta itu weakness atau threat?\n"
             "Weakness, karena sumbernya internal — keputusan pemilik membiayai "
             "akuisisi dengan pinjaman. Threat adalah faktor dari luar. Bedanya penting: "
             "weakness bisa diperbaiki sendiri, threat hanya bisa diantisipasi.")
    return s


SLIDES_B = [s19_divider_b, s20_industry, s21_q1_sport, s22_q1_fin, s23_q1_efficiency,
            s24_swot, s25_resources, s26_capabilities, s27_vrin, s28_dynamic,
            s29_valuechain, s30_csa, s31_q6, s32_thanks]
