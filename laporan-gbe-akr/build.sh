#!/bin/bash
# Rebuild Laporan_GBE_AKR_Corporindo.docx from src/*.md
set -e
cd "$(dirname "$0")"
REF=/tmp/claude-0/-home-user-Dom-Manipulation/abc9627a-0d8b-5d1e-bcd0-bdf8b145ecc0/scratchpad/ref.docx
cd src && cat 00_front.md 01_bab1.md 02_bab2.md 03_bab3.md 04_bab4a.md 05_bab4b.md 06_bab5.md 07_pustaka.md 08_lampiran.md > ../Laporan_GBE_AKR_Corporindo.md && cd ..
pandoc Laporan_GBE_AKR_Corporindo.md -o Laporan_GBE_AKR_Corporindo.docx --resource-path=src --reference-doc="$REF"
python3 - <<'PY'
import zipfile,shutil
src='Laporan_GBE_AKR_Corporindo.docx'; tmp=src+'.tmp'
zin=zipfile.ZipFile(src); zout=zipfile.ZipFile(tmp,'w',zipfile.ZIP_DEFLATED)
for item in zin.infolist():
    data=zin.read(item.filename)
    if item.filename=='word/settings.xml':
        s=data.decode('utf-8')
        if 'w:updateFields' not in s: s=s.replace('</w:settings>','<w:updateFields w:val="true"/></w:settings>')
        data=s.encode('utf-8')
    zout.writestr(item,data)
zin.close(); zout.close(); shutil.move(tmp,src); print('docx built')
PY
