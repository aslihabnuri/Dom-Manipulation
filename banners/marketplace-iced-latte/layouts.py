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
