import sys, zipfile, re, shutil, os
src=sys.argv[1]; tmp=src+".tmp"
zin=zipfile.ZipFile(src); zout=zipfile.ZipFile(tmp,"w",zipfile.ZIP_DEFLATED)
n=0
for item in zin.infolist():
    data=zin.read(item.filename)
    if item.filename.startswith("ppt/slides/slide") and item.filename.endswith(".xml"):
        s=data.decode("utf-8")
        s,k=re.subn(r'</a:r><a:pPr indent="0" marL="0"><a:buNone/></a:pPr>', '</a:r>', s); n+=k
        data=s.encode("utf-8")
    zout.writestr(item,data)
zin.close(); zout.close(); shutil.move(tmp,src); print("removed stray buNone:",n)
