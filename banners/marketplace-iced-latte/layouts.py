V1 = dict(
    size=(1200, 1600), angle=8,
    head="ICED LATTE", head_x=60, head_y=104, head_fit=1080, head_tr=-3,
    logo=dict(x=62, y=44, w=168),
    back=[
        dict(name="milk", cx=330, cy=760, height=760, rot=-12, shadow=0.18),
        dict(name="matcha_pw", cx=170, cy=470, width=520, rot=10, shadow=0),
        dict(name="charcoal_pw", cx=1010, cy=760, width=470, rot=-8, shadow=0),
    ],
    mid=[
        dict(name="ubehalf_0", cx=1040, cy=250, width=360, rot=-18, shadow=0.3),
        dict(name="drink_matcha", cx=300, cy=640, height=640, rot=9, shadow=0.35),
        dict(name="drink_charcoal", cx=610, cy=870, height=670, rot=-3, shadow=0.35),
        dict(name="drink_ube", cx=885, cy=1095, height=830, rot=-9, shadow=0.4),
    ],
    front=[
        dict(name="pouch_matcha", cx=205, cy=905, width=300, rot=7, shadow=0.38),
        dict(name="pouch_charcoal", cx=470, cy=1150, width=320, rot=-6, shadow=0.38),
        dict(name="pouch_ube", cx=700, cy=1395, width=370, rot=5, shadow=0.4),
        dict(name="leaves", cx=1150, cy=640, width=300, rot=-30, shadow=0.25),
        dict(name="ice1", cx=1120, cy=1470, width=250, rot=12, shadow=0.25),
        dict(name="icecube_1", cx=90, cy=1240, width=150, rot=-15, shadow=0.25),
        dict(name="icecube_0", cx=60, cy=300, width=170, rot=20, shadow=0.25),
    ],
    texts=[
        dict(s="BRING THE CAFE HOME", x=1140, y=262, size=34, tr=1.5, align="right"),
        dict(s="MATCHA • UBE • CHARCOAL", arc=True, cx=885, cy=1095, r=470, start=-150, size=30, tr=3),
        dict(s="TINGGAL SEDUH,", x=60, y=1466, size=40, tr=1),
        dict(s="LANGSUNG SEGAR", x=60, y=1518, size=40, tr=1),
    ],
)

V2 = dict(V1)
V2.update(
    back=[
        dict(name="milk", cx=330, cy=770, height=760, rot=-12, shadow=0.18),
        dict(name="matcha_pw", cx=170, cy=480, width=520, rot=10, shadow=0),
        dict(name="charcoal_pw", cx=500, cy=1030, width=470, rot=-8, shadow=0),
    ],
    mid=[
        dict(name="ubehalf_0", cx=1085, cy=275, width=320, rot=-18, shadow=0.3),
        dict(name="drink_matcha", cx=300, cy=640, height=640, rot=9, shadow=0.35),
        dict(name="drink_charcoal", cx=600, cy=860, height=660, rot=-3, shadow=0.35),
        dict(name="pouch_matcha", cx=165, cy=1185, width=285, rot=11, shadow=0.38),
        dict(name="pouch_charcoal", cx=335, cy=1235, width=285, rot=1, shadow=0.38),
        dict(name="pouch_ube", cx=505, cy=1290, width=295, rot=-8, shadow=0.4),
        dict(name="drink_ube", cx=905, cy=1110, height=820, rot=-8, shadow=0.4),
    ],
    front=[
        dict(name="leaves", cx=55, cy=770, width=280, rot=50, shadow=0.25),
        dict(name="icecube_0", cx=92, cy=318, width=150, rot=20, shadow=0.25),
        dict(name="ice1", cx=1130, cy=1500, width=250, rot=12, shadow=0.25),
        dict(name="icecube_1", cx=640, cy=1520, width=120, rot=-15, shadow=0.25),
    ],
    texts=[
        dict(s="BRING THE CAFE HOME", x=1140, y=262, size=34, tr=1.5, align="right"),
        dict(s="MATCHA • UBE • CHARCOAL", arc=True, cx=905, cy=760, r=300, start=-112, size=30, tr=3),
        dict(s="TINGGAL SEDUH,", x=60, y=1466, size=40, tr=1),
        dict(s="LANGSUNG SEGAR", x=60, y=1518, size=40, tr=1),
    ],
)

V3 = dict(V2)
V3.update(
    back=[
        dict(name="milk", cx=330, cy=770, height=760, rot=-12, shadow=0.18),
        dict(name="matcha_pw", cx=170, cy=480, width=520, rot=10, shadow=0),
        dict(name="charcoal_pw", cx=770, cy=700, width=380, rot=-8, shadow=0),
        dict(name="leaves", cx=40, cy=930, width=260, rot=62, shadow=0.2),
    ],
    mid=[
        dict(name="ubehalf_0", cx=1135, cy=160, width=300, rot=-25, shadow=0.3),
        dict(name="drink_matcha", cx=300, cy=640, height=640, rot=9, shadow=0.35),
        dict(name="drink_charcoal", cx=600, cy=860, height=660, rot=-3, shadow=0.35),
        dict(name="pouch_ube", cx=535, cy=1275, width=300, rot=-7, shadow=0.4),
        dict(name="pouch_charcoal", cx=352, cy=1240, width=300, rot=2, shadow=0.4),
        dict(name="pouch_matcha", cx=172, cy=1205, width=300, rot=10, shadow=0.4),
        dict(name="drink_ube", cx=905, cy=1110, height=820, rot=-8, shadow=0.4),
    ],
    front=[
        dict(name="icecube_1", cx=88, cy=322, width=140, rot=20, shadow=0.25),
        dict(name="ice1", cx=1130, cy=1500, width=250, rot=12, shadow=0.25),
        dict(name="icecube_1", cx=640, cy=1520, width=115, rot=-15, shadow=0.25),
    ],
)

V4 = dict(V3)
V4.update(
    back=[
        dict(name="milk", cx=330, cy=770, height=760, rot=-12, shadow=0.18),
        dict(name="matcha_pw", cx=170, cy=480, width=520, rot=10, shadow=0),
        dict(name="leaves", cx=40, cy=930, width=260, rot=62, shadow=0.2),
    ],
    mid=[
        dict(name="ubehalf_0", cx=1128, cy=372, width=250, rot=-22, shadow=0.3),
        dict(name="drink_matcha", cx=300, cy=640, height=640, rot=9, shadow=0.35),
        dict(name="drink_charcoal", cx=600, cy=860, height=660, rot=-3, shadow=0.35),
        dict(name="pouch_ube", cx=535, cy=1275, width=300, rot=-7, shadow=0.4),
        dict(name="pouch_charcoal", cx=352, cy=1240, width=300, rot=2, shadow=0.4),
        dict(name="pouch_matcha", cx=172, cy=1205, width=300, rot=10, shadow=0.4),
        dict(name="drink_ube", cx=905, cy=1110, height=820, rot=-8, shadow=0.4),
    ],
    front=[
        dict(name="icecube_1", cx=96, cy=300, width=140, rot=20, shadow=0.25),
        dict(name="ice1", cx=1130, cy=1500, width=250, rot=12, shadow=0.25),
        dict(name="icecube_1", cx=640, cy=1520, width=115, rot=-15, shadow=0.25),
    ],
)

V5 = dict(V4)
V5.update(
    mid=[
        dict(name="ubehalf_0", cx=1128, cy=372, width=250, rot=-22, shadow=0.3),
        dict(name="drink_matcha", cx=300, cy=640, height=640, rot=9, shadow=0.35, see=True),
        dict(name="drink_charcoal_fix", cx=600, cy=860, height=660, rot=-3, shadow=0.35, see=True),
        dict(name="pouch_ube", cx=535, cy=1275, width=300, rot=-7, shadow=0.4),
        dict(name="pouch_charcoal", cx=352, cy=1240, width=300, rot=2, shadow=0.4),
        dict(name="pouch_matcha", cx=172, cy=1205, width=300, rot=10, shadow=0.4),
        dict(name="drink_ube", cx=905, cy=1110, height=820, rot=-8, shadow=0.4, see=True),
    ],
    front=[
        dict(name="icecube_1", cx=100, cy=268, width=140, rot=20, shadow=0.25),
        dict(name="ice1", cx=1130, cy=1500, width=250, rot=12, shadow=0.25),
        dict(name="icecube_1", cx=640, cy=1520, width=115, rot=-15, shadow=0.25),
    ],
)

W1 = dict(
    size=(2000, 1000), angle=4,
    head="ICED LATTE", head_x=70, head_y=150, head_fit=860, head_tr=-3,
    logo=dict(x=72, y=64, w=170),
    back=[
        dict(name="milk", cx=1010, cy=560, height=640, rot=-12, shadow=0.18),
        dict(name="matcha_pw", cx=930, cy=300, width=440, rot=10, shadow=0),
        dict(name="leaves", cx=1990, cy=860, width=240, rot=-60, shadow=0.2),
    ],
    mid=[
        dict(name="ubehalf_0", cx=1930, cy=150, width=250, rot=-22, shadow=0.3),
        dict(name="drink_matcha", cx=1080, cy=470, height=600, rot=9, shadow=0.35, see=True),
        dict(name="drink_charcoal_fix", cx=1390, cy=560, height=640, rot=-3, shadow=0.35, see=True),
        dict(name="pouch_ube", cx=545, cy=705, width=290, rot=-7, shadow=0.4),
        dict(name="pouch_charcoal", cx=365, cy=675, width=290, rot=2, shadow=0.4),
        dict(name="pouch_matcha", cx=188, cy=645, width=290, rot=10, shadow=0.4),
        dict(name="drink_ube", cx=1705, cy=590, height=760, rot=-8, shadow=0.4, see=True),
    ],
    front=[
        dict(name="icecube_1", cx=905, cy=880, width=150, rot=-15, shadow=0.25),
        dict(name="ice1", cx=1240, cy=950, width=210, rot=12, shadow=0.25),
    ],
    texts=[
        dict(s="BRING THE CAFE HOME", x=930, y=340, size=34, tr=1.5, align="right"),
        dict(s="MATCHA • UBE • CHARCOAL", arc=True, cx=370, cy=930, r=480, start=-128, size=28, tr=3),
        dict(s="TINGGAL SEDUH,", x=70, y=850, size=38, tr=1),
        dict(s="LANGSUNG SEGAR", x=70, y=900, size=38, tr=1),
    ],
)

W2 = dict(W1)
W2.update(
    back=[
        dict(name="milk", cx=1010, cy=560, height=640, rot=-12, shadow=0.18),
        dict(name="matcha_pw", cx=980, cy=250, width=400, rot=10, shadow=0),
    ],
    mid=[
        dict(name="ubehalf_0", cx=1930, cy=150, width=250, rot=-22, shadow=0.3),
        dict(name="drink_matcha", cx=1080, cy=470, height=600, rot=9, shadow=0.35, see=True),
        dict(name="drink_charcoal_fix", cx=1390, cy=560, height=640, rot=-3, shadow=0.35, see=True),
        dict(name="pouch_ube", cx=500, cy=700, width=262, rot=-7, shadow=0.4),
        dict(name="pouch_charcoal", cx=338, cy=680, width=262, rot=2, shadow=0.4),
        dict(name="pouch_matcha", cx=178, cy=660, width=262, rot=10, shadow=0.4),
        dict(name="drink_ube", cx=1705, cy=590, height=760, rot=-8, shadow=0.4, see=True),
    ],
    front=[
        dict(name="icecube_1", cx=905, cy=890, width=140, rot=-15, shadow=0.25),
        dict(name="ice1", cx=1240, cy=955, width=200, rot=12, shadow=0.25),
    ],
    texts=[
        dict(s="BRING THE CAFE HOME", x=74, y=292, size=32, tr=1.5, align="left"),
        dict(s="MATCHA • UBE • CHARCOAL", arc=True, cx=338, cy=1380, r=900, start=-108, size=26, tr=3),
        dict(s="TINGGAL SEDUH,", x=70, y=868, size=36, tr=1),
        dict(s="LANGSUNG SEGAR", x=70, y=916, size=36, tr=1),
    ],
)

S1 = dict(
    size=(1200, 1200), angle=6,
    head="ICED LATTE", head_x=60, head_y=96, head_fit=1080, head_tr=-3,
    logo=dict(x=62, y=40, w=160),
    back=[
        dict(name="milk", cx=300, cy=600, height=600, rot=-12, shadow=0.18),
        dict(name="matcha_pw", cx=150, cy=400, width=440, rot=10, shadow=0),
    ],
    mid=[
        dict(name="drink_matcha", cx=290, cy=545, height=540, rot=9, shadow=0.35, see=True),
        dict(name="drink_charcoal_fix", cx=585, cy=690, height=560, rot=-3, shadow=0.35, see=True),
        dict(name="pouch_ube", cx=500, cy=985, width=250, rot=-7, shadow=0.4),
        dict(name="pouch_charcoal", cx=330, cy=960, width=250, rot=2, shadow=0.4),
        dict(name="pouch_matcha", cx=160, cy=935, width=250, rot=10, shadow=0.4),
        dict(name="drink_ube", cx=885, cy=820, height=660, rot=-8, shadow=0.4, see=True),
    ],
    front=[
        dict(name="icecube_1", cx=96, cy=262, width=125, rot=20, shadow=0.25),
        dict(name="ubehalf_0", cx=1150, cy=1130, width=250, rot=-22, shadow=0.3),
        dict(name="icecube_1", cx=640, cy=1150, width=100, rot=-15, shadow=0.25),
    ],
    texts=[
        dict(s="BRING THE CAFE HOME", x=1140, y=258, size=32, tr=1.5, align="right"),
        dict(s="MATCHA • UBE • CHARCOAL", arc=True, cx=890, cy=600, r=255, start=-112, size=27, tr=3),
        dict(s="TINGGAL SEDUH,", x=60, y=1092, size=34, tr=1),
        dict(s="LANGSUNG SEGAR", x=60, y=1137, size=34, tr=1),
    ],
)

S2 = dict(S1)
S2["mid"] = [dict(d, cy=d["cy"] - 18) if d["name"].startswith("pouch_") else d for d in S1["mid"]]

V6 = dict(V5)
V6.update(
    back=[
        dict(name="milk", cx=330, cy=770, height=760, rot=-12, shadow=0.18),
        dict(name="matcha_pw", cx=170, cy=480, width=520, rot=10, shadow=0),
        dict(name="tealeaves", cx=55, cy=880, width=330, rot=28, shadow=0.22),
    ],
    mid=[
        dict(name="ubeslice_M", cx=1182, cy=418, width=230, rot=-15, shadow=0.3),
        dict(name="drink_matcha", cx=300, cy=640, height=640, rot=9, shadow=0.35, see=True),
        dict(name="drink_charcoal_fix", cx=600, cy=860, height=660, rot=-3, shadow=0.35, see=True),
        dict(name="ubeslice_L", cx=650, cy=1590, width=300, rot=20, shadow=0.3),
        dict(name="pouch_ube", cx=535, cy=1265, width=300, rot=-7, shadow=0.4),
        dict(name="pouch_charcoal", cx=352, cy=1230, width=300, rot=2, shadow=0.4),
        dict(name="pouch_matcha", cx=172, cy=1195, width=300, rot=10, shadow=0.4),
        dict(name="drink_ube", cx=905, cy=1110, height=820, rot=-8, shadow=0.4, see=True),
    ],
    front=[
        dict(name="icecube_1", cx=100, cy=268, width=140, rot=20, shadow=0.25),
        dict(name="ubeslice_S", cx=566, cy=262, width=128, rot=0, shadow=0.3),
        dict(name="bigice_B", cx=1132, cy=1488, width=270, rot=-10, shadow=0.25),
    ],
    texts=[
        dict(s="BRING THE CAFE HOME", x=1140, y=262, size=34, tr=1.5, align="right"),
        dict(s="MATCHA • UBE • CHARCOAL", arc=True, cx=905, cy=790, r=290, start=-114, size=30, tr=3),
        dict(s="TINGGAL SEDUH,", x=60, y=1466, size=40, tr=1),
        dict(s="LANGSUNG SEGAR", x=60, y=1518, size=40, tr=1),
    ],
)

W3 = dict(W2)
W3.update(
    back=[
        dict(name="milk", cx=1010, cy=560, height=640, rot=-12, shadow=0.18),
        dict(name="matcha_pw", cx=980, cy=250, width=400, rot=10, shadow=0),
    ],
    mid=[
        dict(name="ubeslice_M", cx=1955, cy=150, width=240, rot=-15, shadow=0.3),
        dict(name="drink_matcha", cx=1080, cy=470, height=600, rot=9, shadow=0.35, see=True),
        dict(name="drink_charcoal_fix", cx=1390, cy=560, height=640, rot=-3, shadow=0.35, see=True),
        dict(name="ubeslice_L", cx=1550, cy=1010, width=280, rot=20, shadow=0.3),
        dict(name="tealeaves", cx=1985, cy=800, width=300, rot=-25, shadow=0.22),
        dict(name="pouch_ube", cx=500, cy=700, width=262, rot=-7, shadow=0.4),
        dict(name="pouch_charcoal", cx=338, cy=680, width=262, rot=2, shadow=0.4),
        dict(name="pouch_matcha", cx=178, cy=660, width=262, rot=10, shadow=0.4),
        dict(name="drink_ube", cx=1705, cy=590, height=760, rot=-8, shadow=0.4, see=True),
    ],
    front=[
        dict(name="icecube_1", cx=905, cy=890, width=140, rot=-15, shadow=0.25),
        dict(name="bigice_B", cx=1235, cy=965, width=220, rot=-10, shadow=0.25),
    ],
)

S3 = dict(S2)
S3.update(
    back=[
        dict(name="milk", cx=300, cy=600, height=600, rot=-12, shadow=0.18),
        dict(name="matcha_pw", cx=150, cy=400, width=440, rot=10, shadow=0),
        dict(name="tealeaves", cx=45, cy=720, width=290, rot=28, shadow=0.22),
    ],
    mid=[d for d in S2["mid"]] ,
    front=[
        dict(name="icecube_1", cx=96, cy=262, width=125, rot=20, shadow=0.25),
        dict(name="ubeslice_S", cx=566, cy=254, width=118, rot=0, shadow=0.3),
        dict(name="ubeslice_L", cx=1150, cy=1150, width=280, rot=20, shadow=0.3),
        dict(name="bigice_B", cx=645, cy=1150, width=135, rot=-12, shadow=0.25),
    ],
)

VIOLET = (58, 40, 104)
P1 = dict(V6)
P1.update(
    mid=[
        dict(name="drink_matcha", cx=300, cy=640, height=640, rot=9, shadow=0.35, see=True),
        dict(name="drink_charcoal_fix", cx=600, cy=860, height=660, rot=-3, shadow=0.35, see=True),
        dict(name="ubeslice_L", cx=650, cy=1590, width=300, rot=20, shadow=0.3),
        dict(name="pouch_ube", cx=535, cy=1205, width=300, rot=-7, shadow=0.4),
        dict(name="pouch_charcoal", cx=352, cy=1170, width=300, rot=2, shadow=0.4),
        dict(name="pouch_matcha", cx=172, cy=1135, width=300, rot=10, shadow=0.4),
        dict(name="drink_ube", cx=905, cy=1110, height=820, rot=-8, shadow=0.4, see=True),
    ],
    texts=[
        dict(s="BRING THE CAFE HOME", x=1140, y=262, size=34, tr=1.5, align="right"),
        dict(s="DISC", x=640, y=346, size=40, tr=2),
        dict(s="UP TO", x=640, y=398, size=40, tr=2),
        dict(pct="25", x=1140, y=330, size=196, align="right"),
        dict(pill=True, s="GRATIS ONGKIR", x=1140, y=520, size=24, h=54, pad=24, fill=None, outline=(255, 255, 255), stroke=3, text=(255, 255, 255), align="right"),
        dict(pill=True, s="VOUCHER HINGGA 15RB", x=1140, y=586, size=24, h=54, pad=24, fill=None, outline=(255, 255, 255), stroke=3, text=(255, 255, 255), align="right"),
        dict(pill=True, s="SHOP NOW", x=60, y=1468, size=34, h=82, pad=36, fill=(255, 255, 255), text=VIOLET, arrow=True, tr=2),
    ],
)

P2 = dict(P1)
P2["texts"] = [
    dict(s="BRING THE CAFE HOME", x=1140, y=262, size=34, tr=1.5, align="right"),
    dict(s="DISC", x=628, y=334, size=42, tr=2),
    dict(s="UP TO", x=628, y=388, size=42, tr=2),
    dict(pct="25", x=1140, y=318, size=200, align="right"),
    dict(pill=True, s="GRATIS ONGKIR", x=1140, y=488, size=29, h=64, pad=24, fill=None, outline=(255, 255, 255), stroke=3.5, text=(255, 255, 255), tr=1, align="right"),
    dict(pill=True, s="VOUCHER HINGGA 15RB", x=1140, y=566, size=29, h=64, pad=24, fill=None, outline=(255, 255, 255), stroke=3.5, text=(255, 255, 255), tr=1, align="right"),
    dict(pill=True, s="SHOP NOW", x=60, y=1468, size=36, h=86, pad=38, fill=(255, 255, 255), text=VIOLET, arrow=True, tr=2),
]

P3 = dict(P1)
P3["texts"] = [
    dict(s="BRING THE CAFE HOME", x=1140, y=262, size=34, tr=1.5, align="right"),
    dict(s="DISC", x=640, y=328, size=42, tr=2),
    dict(s="UP TO", x=640, y=382, size=42, tr=2),
    dict(pct="25", x=1140, y=314, size=192, align="right"),
    dict(pill=True, s="VOUCHER HINGGA 15RB", x=1140, y=470, size=29, h=64, pad=24, fill=None, outline=(255, 255, 255), stroke=3.5, text=(255, 255, 255), tr=1, align="right"),
    dict(pill=True, s="GRATIS ONGKIR", x=1140, y=548, size=29, h=64, pad=24, fill=None, outline=(255, 255, 255), stroke=3.5, text=(255, 255, 255), tr=1, align="right"),
    dict(pill=True, s="SHOP NOW", x=60, y=1468, size=36, h=86, pad=38, fill=(255, 255, 255), text=VIOLET, arrow=True, tr=2),
]

S4 = dict(S3)
S4.update(
    mid=[
        dict(name="drink_matcha", cx=290, cy=545, height=540, rot=9, shadow=0.35, see=True),
        dict(name="drink_charcoal_fix", cx=590, cy=735, height=520, rot=-3, shadow=0.35, see=True),
        dict(name="pouch_ube", cx=500, cy=945, width=250, rot=-7, shadow=0.4),
        dict(name="pouch_charcoal", cx=330, cy=920, width=250, rot=2, shadow=0.4),
        dict(name="pouch_matcha", cx=160, cy=895, width=250, rot=10, shadow=0.4),
        dict(name="drink_ube", cx=895, cy=875, height=620, rot=-8, shadow=0.4, see=True),
    ],
    texts=[
        dict(s="BRING THE CAFE HOME", x=1140, y=258, size=32, tr=1.5, align="right"),
        dict(s="DISC", x=700, y=312, size=34, tr=2),
        dict(s="UP TO", x=700, y=356, size=34, tr=2),
        dict(pct="25", x=1140, y=300, size=150, align="right"),
        dict(pill=True, s="VOUCHER HINGGA 15RB", x=1140, y=422, size=25, h=54, pad=20, fill=None, outline=(255, 255, 255), stroke=3, text=(255, 255, 255), tr=1, align="right"),
        dict(pill=True, s="GRATIS ONGKIR", x=1140, y=488, size=25, h=54, pad=20, fill=None, outline=(255, 255, 255), stroke=3, text=(255, 255, 255), tr=1, align="right"),
        dict(pill=True, s="SHOP NOW", x=60, y=1090, size=32, h=76, pad=32, fill=(255, 255, 255), text=VIOLET, arrow=True, tr=2),
    ],
)

W4 = dict(W3)
W4.update(
    head_fit=820, head_y=140,
    logo=dict(x=72, y=58, w=165),
    mid=[
        dict(name="ubeslice_M", cx=1955, cy=150, width=240, rot=-15, shadow=0.3),
        dict(name="drink_matcha", cx=1080, cy=470, height=600, rot=9, shadow=0.35, see=True),
        dict(name="drink_charcoal_fix", cx=1390, cy=560, height=640, rot=-3, shadow=0.35, see=True),
        dict(name="ubeslice_L", cx=1550, cy=1010, width=280, rot=20, shadow=0.3),
        dict(name="tealeaves", cx=1985, cy=800, width=300, rot=-25, shadow=0.22),
        dict(name="pouch_ube", cx=470, cy=845, width=230, rot=-7, shadow=0.4),
        dict(name="pouch_charcoal", cx=315, cy=828, width=230, rot=2, shadow=0.4),
        dict(name="pouch_matcha", cx=165, cy=810, width=230, rot=10, shadow=0.4),
        dict(name="drink_ube", cx=1705, cy=590, height=760, rot=-8, shadow=0.4, see=True),
    ],
    front=[
        dict(name="icecube_1", cx=905, cy=890, width=140, rot=-15, shadow=0.25),
        dict(name="bigice_B", cx=1235, cy=965, width=220, rot=-10, shadow=0.25),
    ],
    texts=[
        dict(s="BRING THE CAFE HOME", x=74, y=268, size=30, tr=1.5),
        dict(s="DISC", x=74, y=340, size=36, tr=2),
        dict(s="UP TO", x=74, y=386, size=36, tr=2),
        dict(pct="25", x=228, y=326, size=150, align="left"),
        dict(pill=True, s="VOUCHER HINGGA 15RB", x=74, y=460, size=25, h=54, pad=20, fill=None, outline=(255, 255, 255), stroke=3, text=(255, 255, 255), tr=1),
        dict(pill=True, s="GRATIS ONGKIR", x=468, y=460, size=25, h=54, pad=20, fill=None, outline=(255, 255, 255), stroke=3, text=(255, 255, 255), tr=1),
        dict(pill=True, s="SHOP NOW", x=74, y=548, size=30, h=70, pad=30, fill=(255, 255, 255), text=VIOLET, arrow=True, tr=2),
    ],
)

W5 = dict(W4)
W5["texts"] = [
    dict(s="BRING THE CAFE HOME", x=74, y=268, size=30, tr=1.5),
    dict(s="DISC", x=74, y=336, size=40, tr=2),
    dict(s="UP TO", x=74, y=388, size=40, tr=2),
    dict(pct="25", x=242, y=322, size=164, align="left"),
    dict(pill=True, s="VOUCHER HINGGA 15RB", x=74, y=464, size=29, h=62, pad=22, fill=None, outline=(255, 255, 255), stroke=3.5, text=(255, 255, 255), tr=1),
    dict(pill=True, s="GRATIS ONGKIR", x=480, y=464, size=29, h=62, pad=22, fill=None, outline=(255, 255, 255), stroke=3.5, text=(255, 255, 255), tr=1),
    dict(pill=True, s="SHOP NOW", x=74, y=554, size=33, h=78, pad=32, fill=(255, 255, 255), text=VIOLET, arrow=True, tr=2),
]

W6 = dict(W5)
W6["back"] = [
    dict(name="milk", cx=1060, cy=575, height=620, rot=-12, shadow=0.18),
    dict(name="matcha_pw", cx=1015, cy=250, width=390, rot=10, shadow=0),
]

WHITE3 = (255, 255, 255)
C1 = dict(
    size=(1200, 1600), angle=6, grain=7.0,
    head="ICED LATTE", head_x=60, head_y=104, head_fit=1080, head_tr=-3,
    logo=dict(x=62, y=44, w=168),
    back=[],
    mid=[
        dict(name="drink_matcha", cx=292, cy=830, height=680, rot=5, shadow=0.32, see=True),
        dict(name="drink_charcoal_fix", cx=908, cy=830, height=680, rot=-5, shadow=0.32, see=True),
        dict(name="drink_ube", cx=600, cy=868, height=760, rot=0, shadow=0.36, see=True),
    ],
    front=[
        dict(name="pouch_matcha", cx=292, cy=1262, width=272, rot=0, shadow=0.32),
        dict(name="pouch_charcoal", cx=908, cy=1262, width=272, rot=0, shadow=0.32),
        dict(name="pouch_ube", cx=600, cy=1290, width=290, rot=0, shadow=0.34),
    ],
    texts=[
        dict(s="DISC", x=62, y=318, size=42, tr=2),
        dict(s="UP TO", x=62, y=372, size=42, tr=2),
        dict(pct="25", x=228, y=304, size=196, align="left"),
        dict(pill=True, s="VOUCHER HINGGA 15RB", x=1140, y=304, size=29, h=62, pad=24, fill=None, outline=WHITE3, stroke=3.5, text=WHITE3, tr=1, align="right"),
        dict(pill=True, s="GRATIS ONGKIR", x=1140, y=380, size=29, h=62, pad=24, fill=None, outline=WHITE3, stroke=3.5, text=WHITE3, tr=1, align="right"),
        dict(pill=True, s="SHOP NOW", x=600, y=1456, size=36, h=86, pad=40, fill=WHITE3, text=VIOLET, arrow=True, tr=2, align="center"),
    ],
)

C2 = dict(C1)
C2.update(
    mid=[
        dict(name="drink_matcha", cx=296, cy=842, height=650, rot=5, shadow=0.32, see=True),
        dict(name="drink_charcoal_fix", cx=904, cy=842, height=650, rot=-5, shadow=0.32, see=True),
        dict(name="drink_ube", cx=600, cy=882, height=730, rot=0, shadow=0.36, see=True),
    ],
    front=[
        dict(name="pouch_matcha", cx=296, cy=1268, width=262, rot=0, shadow=0.32),
        dict(name="pouch_charcoal", cx=904, cy=1268, width=262, rot=0, shadow=0.32),
        dict(name="pouch_ube", cx=600, cy=1292, width=280, rot=0, shadow=0.34),
    ],
    texts=[t if not t.get("s") == "SHOP NOW" else dict(t, y=1462, h=80, size=34) for t in C1["texts"]],
)

S5 = dict(
    size=(1200, 1200), angle=6, grain=7.0,
    head="ICED LATTE", head_x=60, head_y=96, head_fit=1080, head_tr=-3,
    logo=dict(x=62, y=40, w=160),
    back=[],
    mid=[
        dict(name="drink_matcha", cx=330, cy=668, height=470, rot=5, shadow=0.32, see=True),
        dict(name="drink_charcoal_fix", cx=870, cy=668, height=470, rot=-5, shadow=0.32, see=True),
        dict(name="drink_ube", cx=600, cy=698, height=530, rot=0, shadow=0.36, see=True),
    ],
    front=[
        dict(name="pouch_matcha", cx=330, cy=950, width=200, rot=0, shadow=0.32),
        dict(name="pouch_charcoal", cx=870, cy=950, width=200, rot=0, shadow=0.32),
        dict(name="pouch_ube", cx=600, cy=968, width=214, rot=0, shadow=0.34),
    ],
    texts=[
        dict(s="DISC", x=62, y=290, size=34, tr=2),
        dict(s="UP TO", x=62, y=334, size=34, tr=2),
        dict(pct="25", x=196, y=280, size=150, align="left"),
        dict(pill=True, s="VOUCHER HINGGA 15RB", x=1140, y=280, size=25, h=54, pad=21, fill=None, outline=WHITE3, stroke=3, text=WHITE3, tr=1, align="right"),
        dict(pill=True, s="GRATIS ONGKIR", x=1140, y=344, size=25, h=54, pad=21, fill=None, outline=WHITE3, stroke=3, text=WHITE3, tr=1, align="right"),
        dict(pill=True, s="SHOP NOW", x=600, y=1084, size=31, h=72, pad=36, fill=WHITE3, text=VIOLET, arrow=True, tr=2, align="center"),
    ],
)

W7 = dict(
    size=(2000, 1000), angle=4, grain=7.0,
    head="ICED LATTE", head_x=74, head_y=262, head_fit=820, head_tr=-3,
    logo=dict(x=76, y=66, w=165),
    back=[],
    mid=[
        dict(name="drink_matcha", cx=1150, cy=440, height=560, rot=5, shadow=0.32, see=True),
        dict(name="drink_charcoal_fix", cx=1690, cy=440, height=560, rot=-5, shadow=0.32, see=True),
        dict(name="drink_ube", cx=1420, cy=470, height=630, rot=0, shadow=0.36, see=True),
    ],
    front=[
        dict(name="pouch_matcha", cx=1150, cy=815, width=225, rot=0, shadow=0.32),
        dict(name="pouch_charcoal", cx=1690, cy=815, width=225, rot=0, shadow=0.32),
        dict(name="pouch_ube", cx=1420, cy=835, width=240, rot=0, shadow=0.34),
    ],
    texts=[
        dict(s="DISC", x=76, y=432, size=40, tr=2),
        dict(s="UP TO", x=76, y=484, size=40, tr=2),
        dict(pct="25", x=244, y=418, size=164, align="left"),
        dict(pill=True, s="VOUCHER HINGGA 15RB", x=76, y=568, size=29, h=62, pad=22, fill=None, outline=WHITE3, stroke=3.5, text=WHITE3, tr=1),
        dict(pill=True, s="GRATIS ONGKIR", x=482, y=568, size=29, h=62, pad=22, fill=None, outline=WHITE3, stroke=3.5, text=WHITE3, tr=1),
        dict(pill=True, s="SHOP NOW", x=76, y=666, size=33, h=78, pad=32, fill=WHITE3, text=VIOLET, arrow=True, tr=2),
    ],
)

T1 = dict(
    size=(1200, 1600), angle=6, grain=8.0,
    head="ICED LATTE", head_x=60, head_y=104, head_fit=1080, head_tr=-3,
    logo=dict(x=62, y=44, w=168),
    back=[
        dict(name="milk", cx=250, cy=900, height=700, rot=-12, shadow=0.16),
        dict(name="milk", cx=960, cy=930, height=640, rot=10, flip=True, shadow=0.16),
        dict(name="matcha_pw", cx=170, cy=600, width=430, rot=10, shadow=0),
        dict(name="tealeaves", cx=40, cy=1000, width=300, rot=28, shadow=0.2),
    ],
    mid=[
        dict(name="ubeslice_M", cx=1178, cy=396, width=240, rot=-15, shadow=0.28),
        dict(name="drink_matcha", cx=296, cy=852, height=650, rot=5, shadow=0.32, see=True),
        dict(name="drink_charcoal_fix", cx=904, cy=852, height=650, rot=-5, shadow=0.32, see=True),
        dict(name="drink_ube", cx=600, cy=892, height=730, rot=0, shadow=0.36, see=True),
    ],
    front=[
        dict(name="pouch_matcha", cx=296, cy=1276, width=262, rot=0, shadow=0.32),
        dict(name="pouch_charcoal", cx=904, cy=1276, width=262, rot=0, shadow=0.32),
        dict(name="pouch_ube", cx=600, cy=1300, width=280, rot=0, shadow=0.34),
        dict(name="bigice_B", cx=1135, cy=1170, width=210, rot=-10, shadow=0.24),
        dict(name="icecube_1", cx=72, cy=1290, width=130, rot=18, shadow=0.24),
        dict(name="ubeslice_L", cx=1150, cy=1570, width=290, rot=20, shadow=0.28),
        dict(name="ubeslice_S", cx=60, cy=1545, width=170, rot=0, shadow=0.28),
    ],
    texts=[
        dict(s="DISC", x=62, y=296, size=40, tr=3, bold=False),
        dict(s="UP TO", x=62, y=348, size=40, tr=3, bold=False),
        dict(pct="25", x=222, y=284, size=170, align="left"),
        dict(s="GRATIS ONGKIR  •  VOUCHER HINGGA 15RB", x=62, y=438, size=31, tr=2.5, bold=False),
        dict(pill=True, s="SHOP NOW", x=600, y=1472, size=34, h=80, pad=40, fill=WHITE3, text=VIOLET, arrow=True, tr=2, align="center"),
    ],
)

T2a = dict(T1)
T2a["back"] = [
    dict(name="milk", cx=230, cy=930, height=760, rot=-14, shadow=0.16),
    dict(name="matcha_pw", cx=150, cy=660, width=400, rot=10, shadow=0),
    dict(name="tealeaves", cx=40, cy=1040, width=300, rot=28, shadow=0.2),
]
T2b = dict(T1)
T2b["back"] = [
    dict(name="milk", cx=600, cy=1035, height=1060, rot=78, shadow=0.16),
    dict(name="matcha_pw", cx=150, cy=660, width=400, rot=10, shadow=0),
    dict(name="tealeaves", cx=40, cy=1040, width=300, rot=28, shadow=0.2),
]

T3 = dict(T2b)
T3["back"] = [
    dict(name="milk", cx=600, cy=1000, height=1060, rot=78, shadow=0.16),
    dict(name="matcha_pw", cx=150, cy=660, width=400, rot=10, shadow=0),
    dict(name="tealeaves", cx=40, cy=1040, width=300, rot=28, shadow=0.2),
]

U1 = dict(
    size=(1200, 1200), angle=6, grain=8.0,
    head="ICED LATTE", head_x=60, head_y=96, head_fit=1080, head_tr=-3,
    logo=dict(x=62, y=40, w=160),
    back=[
        dict(name="milk", cx=600, cy=790, height=860, rot=78, shadow=0.16),
        dict(name="matcha_pw", cx=135, cy=540, width=320, rot=10, shadow=0),
        dict(name="tealeaves", cx=30, cy=810, width=240, rot=28, shadow=0.2),
    ],
    mid=[
        dict(name="ubeslice_M", cx=1172, cy=330, width=200, rot=-15, shadow=0.28),
        dict(name="drink_matcha", cx=330, cy=682, height=450, rot=5, shadow=0.32, see=True),
        dict(name="drink_charcoal_fix", cx=870, cy=682, height=450, rot=-5, shadow=0.32, see=True),
        dict(name="drink_ube", cx=600, cy=710, height=505, rot=0, shadow=0.36, see=True),
    ],
    front=[
        dict(name="pouch_matcha", cx=330, cy=948, width=192, rot=0, shadow=0.32),
        dict(name="pouch_charcoal", cx=870, cy=948, width=192, rot=0, shadow=0.32),
        dict(name="pouch_ube", cx=600, cy=965, width=206, rot=0, shadow=0.34),
        dict(name="bigice_B", cx=1130, cy=880, width=170, rot=-10, shadow=0.24),
        dict(name="icecube_1", cx=72, cy=968, width=110, rot=18, shadow=0.24),
        dict(name="ubeslice_L", cx=1160, cy=1180, width=230, rot=20, shadow=0.28),
        dict(name="ubeslice_S", cx=48, cy=1165, width=140, rot=0, shadow=0.28),
    ],
    texts=[
        dict(s="DISC", x=62, y=280, size=34, tr=3, bold=False),
        dict(s="UP TO", x=62, y=324, size=34, tr=3, bold=False),
        dict(pct="25", x=200, y=270, size=142, align="left"),
        dict(s="GRATIS ONGKIR  •  VOUCHER HINGGA 15RB", x=62, y=392, size=27, tr=2.5, bold=False),
        dict(pill=True, s="SHOP NOW", x=600, y=1092, size=31, h=70, pad=36, fill=WHITE3, text=VIOLET, arrow=True, tr=2, align="center"),
    ],
)

X1 = dict(
    size=(2000, 1000), angle=4, grain=8.0,
    head="ICED LATTE", head_x=74, head_y=262, head_fit=820, head_tr=-3,
    logo=dict(x=76, y=66, w=165),
    back=[
        dict(name="milk", cx=1420, cy=640, height=920, rot=78, shadow=0.16),
        dict(name="matcha_pw", cx=1000, cy=230, width=340, rot=10, shadow=0),
        dict(name="tealeaves", cx=1990, cy=560, width=280, rot=-25, shadow=0.2),
    ],
    mid=[
        dict(name="ubeslice_M", cx=1965, cy=110, width=220, rot=-15, shadow=0.28),
        dict(name="drink_matcha", cx=1150, cy=440, height=560, rot=5, shadow=0.32, see=True),
        dict(name="drink_charcoal_fix", cx=1690, cy=440, height=560, rot=-5, shadow=0.32, see=True),
        dict(name="drink_ube", cx=1420, cy=470, height=630, rot=0, shadow=0.36, see=True),
    ],
    front=[
        dict(name="pouch_matcha", cx=1150, cy=815, width=225, rot=0, shadow=0.32),
        dict(name="pouch_charcoal", cx=1690, cy=815, width=225, rot=0, shadow=0.32),
        dict(name="pouch_ube", cx=1420, cy=835, width=240, rot=0, shadow=0.34),
        dict(name="bigice_B", cx=1925, cy=880, width=200, rot=-10, shadow=0.24),
        dict(name="icecube_1", cx=905, cy=870, width=120, rot=18, shadow=0.24),
        dict(name="ubeslice_L", cx=860, cy=1010, width=230, rot=20, shadow=0.28),
    ],
    texts=[
        dict(s="DISC", x=76, y=422, size=40, tr=3, bold=False),
        dict(s="UP TO", x=76, y=474, size=40, tr=3, bold=False),
        dict(pct="25", x=244, y=408, size=164, align="left"),
        dict(s="GRATIS ONGKIR  •  VOUCHER HINGGA 15RB", x=76, y=556, size=29, tr=2.5, bold=False),
        dict(pill=True, s="SHOP NOW", x=76, y=626, size=33, h=78, pad=32, fill=WHITE3, text=VIOLET, arrow=True, tr=2),
    ],
)

T4 = dict(T3, head="CHILL SALE")
U2 = dict(U1, head="CHILL SALE")
X2 = dict(X1, head="CHILL SALE")

H_OPTS = ["SEGER SALE", "LAGI HAUS?", "SERBU HEMAT", "COOL DEALS", "PESTA SEGAR", "HEMAT SEGAR"]
for _i, _h in enumerate(H_OPTS):
    globals()[f"H{_i+1}"] = dict(T3, head=_h)

LIME = (206, 240, 96)
BOUNCE = [(0, -2), (-9, 2), (4, -3), (-6, 2.5), (7, -2), (-5, 3), (3, -2.5), (-8, 2), (5, -3), (-3, 2)]
Z1 = dict(T3)
Z1.update(
    head="SEGERTOBER", head_bounce=BOUNCE,
    mid=[
        dict(name="drink_matcha", cx=296, cy=852, height=650, rot=5, shadow=0.32, see=True),
        dict(name="drink_charcoal_fix", cx=904, cy=852, height=650, rot=-5, shadow=0.32, see=True),
        dict(name="drink_ube", cx=600, cy=892, height=730, rot=0, shadow=0.36, see=True),
    ],
    front=[
        dict(name="pouch_matcha", cx=296, cy=1276, width=262, rot=0, shadow=0.32),
        dict(name="pouch_charcoal", cx=904, cy=1276, width=262, rot=0, shadow=0.32),
        dict(name="pouch_ube", cx=600, cy=1300, width=280, rot=0, shadow=0.34),
        dict(name="bigice_B", cx=1135, cy=1170, width=210, rot=-10, shadow=0.24),
        dict(name="icecube_1", cx=72, cy=1290, width=130, rot=18, shadow=0.24),
        dict(name="ubeslice_L", cx=1150, cy=1570, width=290, rot=20, shadow=0.28),
    ],
    texts=[
        dict(arc=True, s="VOUCHER HINGGA 15RB", cx=300, cy=930, r=500, center_on=-90, size=30, tr=3),
        dict(badge=True, cx=930, cy=414, r=150, rot=-10, fill=LIME, top="DISC UP TO", top_size=24, num_size=112, text=VIOLET),
        dict(sticker=True, s="GRATIS ONGKIR", cx=196, cy=1500, size=28, h=64, pad=26, rot=-6, fill=LIME, text=VIOLET),
        dict(pill=True, s="SHOP NOW", x=640, y=1468, size=34, h=80, pad=40, fill=WHITE3, text=VIOLET, arrow=True, tr=2, align="center"),
    ],
)

Z2 = dict(Z1)
Z2["texts"] = [dict(arc=True, s="VOUCHER HINGGA 15RB", cx=300, cy=770, r=340, center_on=-90, size=33, tr=3)] + Z1["texts"][1:]

# --- natural October headline: question kicker + answer headline ---
Q1 = dict(Z2)
Q1.update(head="SEGERIN AJA", head_x=60, head_y=150, head_fit=1000)
Q1["texts"] = [
    dict(s="OKTOBER LAGI GERAH?", x=64, y=100, size=40, tr=4),
    dict(arc=True, s="VOUCHER HINGGA 15RB", cx=290, cy=760, r=340, center_on=-99, size=33, tr=3),
    dict(badge=True, cx=940, cy=440, r=142, rot=-10, fill=LIME, top="DISC UP TO", top_size=23, num_size=106, text=VIOLET),
] + Z2["texts"][2:]
Q1["logo"] = dict(x=62, y=40, w=160)

# --- SRUUUPUT: onomatopoeia headline riding a wave, the U's swell like a long sip ---
SRU_SCALES = [1.0, 1.0, 1.04, 1.12, 1.18, 1.0, 1.0, 1.0]
SP1 = dict(Q1)
SP1.update(head="SRUUUPUT", head_x=58, head_y=92, head_size=196, head_tr=-1, head_fit=None,
          head_wave=dict(amp=16, freq=0.78, phase=0.3, scales=SRU_SCALES))
SP1["texts"] = [
    dict(s="BUNYI PALING ADEM BULAN OKTOBER", x=64, y=300, size=30, tr=3.5),
] + Q1["texts"][1:]
SP2 = dict(SP1); SP2.update(head_size=188, head_y=100, head_tr=-2,
    head_wave=dict(amp=30, freq=0.95, phase=-0.4, scales=[1.0, 1.0, 1.07, 1.14, 1.07, 1.0, 1.0, 1.0]))
SP3 = dict(SP1); SP3.update(head_size=186, head_y=104, head_tr=-2,
    head_wave=dict(amp=26, freq=1.25, phase=1.2, scales=[1.0, 1.0, 1.1, 1.1, 1.1, 1.0, 1.0, 1.0], tilt=0.8))
SP4 = dict(SP1); SP4.update(head_size=176, head_y=100, head_tr=7,
    head_wave=dict(amp=20, freq=0.8, phase=-0.9, scales=[1.0, 1.0, 1.05, 1.1, 1.05, 1.0, 1.0, 1.0], tilt=0.65))
SP5 = dict(SP1); SP5.update(head_size=176, head_y=100, head_tr=7,
    head_wave=dict(amp=18, freq=0.8, phase=2.2, scales=[1.0, 1.0, 1.05, 1.1, 1.05, 1.0, 1.0, 1.0], tilt=0.65))
SP6 = dict(SP5); SP6.update(head_size=190, head_y=96, head_tr=6,
    head_wave=dict(amp=19, freq=0.8, phase=2.2, scales=[1.0, 1.0, 1.05, 1.1, 1.05, 1.0, 1.0, 1.0], tilt=0.65))
SP6["texts"] = [dict(s="BUNYI PALING ADEM BULAN OKTOBER", x=66, y=312, size=30, tr=3.5)] + SP1["texts"][1:]

SRU_WAVE = dict(amp=19, freq=0.8, phase=2.2, scales=[1.0, 1.0, 1.05, 1.1, 1.05, 1.0, 1.0, 1.0], tilt=0.65)
SQ1 = dict(U1)
SQ1.update(head="SRUUUPUT", head_x=58, head_y=92, head_size=160, head_tr=5, head_fit=None, head_wave=dict(SRU_WAVE, amp=16))
SQ1["front"] = [it for it in U1["front"] if it["name"] != "ubeslice_S"]
SQ1["mid"] = [it for it in U1["mid"] if it["name"] != "ubeslice_M"]
SQ1["texts"] = [
    dict(s="BUNYI PALING ADEM BULAN OKTOBER", x=62, y=272, size=26, tr=3),
    dict(arc=True, s="VOUCHER HINGGA 15RB", cx=300, cy=690, r=300, center_on=-100, size=28, tr=3),
    dict(badge=True, cx=1040, cy=250, r=118, rot=-10, fill=LIME, top="DISC UP TO", top_size=20, num_size=88, text=VIOLET),
    dict(sticker=True, s="GRATIS ONGKIR", cx=180, cy=1110, size=25, h=58, pad=22, rot=-6, fill=LIME, text=VIOLET),
    dict(pill=True, s="SHOP NOW", x=600, y=1092, size=31, h=72, pad=36, fill=WHITE3, text=VIOLET, arrow=True, tr=2, align="center"),
]
SQ2 = dict(SQ1)
SQ2["back"] = [dict(U1["back"][0], cy=830, height=820)] + U1["back"][1:]
SQ2["texts"] = [SQ1["texts"][0], dict(arc=True, s="VOUCHER HINGGA 15RB", cx=330, cy=650, r=300, center_on=-96, size=28, tr=3)] + SQ1["texts"][2:]
SW1 = dict(X1)
SW1.update(head="SRUUUPUT", head_x=72, head_y=170, head_size=162, head_tr=5, head_fit=None, head_wave=dict(SRU_WAVE, amp=16))
SW1["mid"] = [it for it in X1["mid"] if it["name"] != "ubeslice_M"]
SW1["texts"] = [
    dict(s="BUNYI PALING ADEM BULAN OKTOBER", x=78, y=392, size=27, tr=3),
    dict(badge=True, cx=240, cy=680, r=140, rot=-10, fill=LIME, top="DISC UP TO", top_size=22, num_size=102, text=VIOLET),
    dict(arc=True, s="VOUCHER HINGGA 15RB", cx=640, cy=760, r=230, center_on=-90, size=26, tr=3),
    dict(pill=True, s="SHOP NOW", x=640, y=806, size=32, h=76, pad=36, fill=WHITE3, text=VIOLET, arrow=True, tr=2, align="center"),
    dict(sticker=True, s="GRATIS ONGKIR", cx=1850, cy=120, size=26, h=60, pad=24, rot=6, fill=LIME, text=VIOLET),
]
SW2 = dict(SW1)
SW2.update(head_y=150, head_size=142, head_wave=dict(SRU_WAVE, amp=14))
SW2["back"] = [X1["back"][0], dict(name="matcha_pw", cx=1030, cy=215, width=260, rot=10, shadow=0)] + X1["back"][2:]
SW2["texts"] = [
    dict(s="BUNYI PALING ADEM BULAN OKTOBER", x=76, y=312, size=26, tr=3),
    dict(badge=True, cx=235, cy=650, r=138, rot=-10, fill=LIME, top="DISC UP TO", top_size=22, num_size=100, text=VIOLET),
    dict(arc=True, s="VOUCHER HINGGA 15RB", cx=640, cy=860, r=240, center_on=-90, size=26, tr=3),
    dict(pill=True, s="SHOP NOW", x=640, y=738, size=32, h=76, pad=36, fill=WHITE3, text=VIOLET, arrow=True, tr=2, align="center"),
    SW1["texts"][4],
]

# --- OKTOBRRR SALE: Okto + "brrr" (shivering with cold); RRR tremble, the rest stays straight ---
BRRR = dict(shiver=(5, 6, 7), rots=[0, 0, 0, 0, 0, -7, 6, -5], dys=[0, 0, 0, 0, 0, -5, 3, -3], ghost=9, ghost_a=0.3)
OB1 = dict(SP6)
OB1.update(head="OKTOBRRR", head_x=58, head_y=96, head_size=184, head_tr=0, head_wave=None, head_shiver=BRRR)
OB1["texts"] = [dict(s="SALE", x=62, y=298, size=112, tr=14)] + SP6["texts"][1:]
OB2 = dict(OB1)
OB2.update(head_size=176, head_x=58)
OB2["texts"] = [dict(s="SALE", x=64, y=300, size=104, tr=16)] + SP6["texts"][1:]
OB3 = dict(OB2); OB3["head_shiver"] = dict(BRRR, ghost=6, ghost_a=0.7)
OB4 = dict(OB3)
OB4["texts"] = [dict(s="SALE", x=64, y=276, size=104, tr=16)] + SP6["texts"][1:]

OQ1 = dict(SQ2)
OQ1.update(head="OKTOBRRR", head_x=58, head_y=92, head_size=146, head_tr=0, head_wave=None,
           head_shiver=dict(BRRR, ghost=5, ghost_a=0.7))
OQ1["texts"] = [
    dict(s="SALE", x=62, y=236, size=82, tr=13),
    SQ2["texts"][1],
    dict(SQ2["texts"][2], cy=300),
] + SQ2["texts"][3:]

OW1 = dict(SW2)
OW1.update(head="OKTOBRRR", head_x=72, head_y=150, head_size=132, head_tr=0, head_wave=None,
           head_shiver=dict(BRRR, ghost=5, ghost_a=0.7))
OW1["texts"] = [dict(s="SALE", x=76, y=282, size=78, tr=12)] + SW2["texts"][1:]
OW2 = dict(OW1); OW2.update(head_y=182)
OW2["texts"] = [dict(s="SALE", x=76, y=314, size=78, tr=12)] + SW2["texts"][1:]

# 2:1 richer: more ube / matcha / milk / ice, matcha powder bursting in FRONT, floating ube over a milk splash
OW3 = dict(OW2)
OW3["back"] = [
    X1["back"][0],                                                                   # milk wave behind the trio
    dict(name="milk", cx=640, cy=470, height=430, rot=-62, flip=True, shadow=0.14),  # second splash carrying the ube
    X1["back"][2],                                                                   # tea leaves, right edge
]
OW3["mid"] = [
    dict(name="ubeslice_S", cx=1556, cy=92, width=118, rot=-20, shadow=0.26),
    dict(name="icecube_0", cx=1885, cy=330, width=170, rot=8, shadow=0.22),
] + [it for it in X1["mid"] if it["name"] != "ubeslice_M"]
OW3["front"] = X1["front"] + [
    dict(name="ubehalf_single", cx=650, cy=470, width=230, rot=-16, shadow=0.3),
    dict(name="icecube_1", cx=520, cy=405, width=86, rot=24, shadow=0.22),
    dict(name="icecube_1", cx=800, cy=545, width=64, rot=-12, shadow=0.2),
    dict(name="matcha_pw", cx=940, cy=560, width=300, rot=-18, shadow=0),
]
OW4 = dict(OW3)
OW4["back"] = [X1["back"][0], dict(name="milk", cx=650, cy=445, height=310, rot=-70, flip=True, shadow=0.14), X1["back"][2]]
OW4["mid"] = [dict(OW3["mid"][0], width=132)] + OW3["mid"][1:]
OW4["front"] = X1["front"] + [
    dict(name="ubehalf_single", cx=652, cy=448, width=215, rot=-16, shadow=0.3),
    dict(name="icecube_1", cx=530, cy=392, width=80, rot=24, shadow=0.22),
    dict(name="icecube_1", cx=790, cy=520, width=60, rot=-12, shadow=0.2),
    dict(name="matcha_pw", cx=950, cy=575, width=300, rot=-18, shadow=0),
]

# --- Matcha Ube Latte in the centre glass + fresher ube imagery (vivid cut ube, tilted slice, ube powder) ---
def _swap(items, table):
    out = []
    for it in items:
        it = dict(it)
        if it["name"] in table:
            new = table[it["name"]]
            if new is None: continue
            it.update(new) if isinstance(new, dict) else it.update(name=new)
        out.append(it)
    return out

UBE_SWAP = {
    "drink_ube": "drink_matchaube",
    "ubeslice_L": dict(name="ubeslice_T"),
    "ubeslice_S": dict(name="ubeslice_T"),
    "ubeslice_M": dict(name="ubeslice_T"),
    "ubehalf_single": dict(name="ubefresh_0"),
}
def _ube(L, extra_back=(), extra_front=()):
    L = dict(L)
    L["back"] = _swap(L["back"], UBE_SWAP) + list(extra_back)
    L["mid"] = _swap(L["mid"], UBE_SWAP)
    L["front"] = _swap(L["front"], UBE_SWAP) + list(extra_front)
    return L

OB5 = _ube(OB4)
OQ3 = _ube(OQ1)
OW5 = _ube(OW4)
# ube corner: violet powder burst + vivid cut ube, mirroring the matcha burst on the opposite diagonal
def _corner(L, slice_name_xy, pw, fresh):
    L = dict(L)
    L["front"] = [it for it in L["front"] if not (it["name"] == "ubeslice_T" and (it["cx"], it["cy"]) == slice_name_xy)] + [pw, fresh]
    return L
OB6 = _corner(OB5, (1150, 1570), dict(name="ube_pw", cx=1105, cy=1475, width=360, rot=-20, shadow=0),
              dict(name="ubefresh_0", cx=1118, cy=1545, width=250, rot=-14, shadow=0.3))
OQ4 = _corner(OQ3, (1160, 1180), dict(name="ube_pw", cx=1120, cy=1095, width=290, rot=-20, shadow=0),
              dict(name="ubefresh_0", cx=1135, cy=1150, width=200, rot=-14, shadow=0.3))
OW6 = dict(OW5)
OW6["front"] = OW5["front"][:]
OW6["front"].insert(0, dict(name="ube_pw", cx=925, cy=955, width=300, rot=-25, shadow=0))
for _L in (OB6, OQ4):          # powder BEHIND the pouches so every label stays readable
    _pw = [it for it in _L["front"] if it["name"] == "ube_pw"][0]
    _L["front"] = [_pw] + [it for it in _L["front"] if it["name"] != "ube_pw"]
# turn the cut face toward the poster (ubefresh_1 shows its violet face on the left)
for _L, _xy in ((OB6, dict(cx=1092, cy=1520, width=255, rot=18)), (OQ4, dict(cx=1112, cy=1118, width=205, rot=18))):
    _L["front"] = [dict(it, name="ubefresh_1", **_xy) if it["name"] == "ubefresh_0" else it for it in _L["front"]]

# bigger DISC UP TO 25% badge
def _badge(L, **kw):
    L = dict(L)
    L["texts"] = [dict(t, **kw) if t.get("badge") else t for t in L["texts"]]
    return L
OB7 = _badge(OB6, cx=965, cy=440, r=182, top_size=29, num_size=138)
OQ5 = _badge(OQ4, cx=1032, cy=298, r=150, top_size=25, num_size=114)
OW7 = _badge(OW6, cx=258, cy=640, r=176, top_size=28, num_size=130)
OB8 = _badge(OB6, cx=1004, cy=394, r=176, top_size=28, num_size=134)
