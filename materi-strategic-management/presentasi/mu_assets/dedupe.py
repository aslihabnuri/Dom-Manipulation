import zipfile, hashlib, re, sys, os, shutil
src, dst = sys.argv[1], sys.argv[2]
zin = zipfile.ZipFile(src)
names = zin.namelist()
media = [n for n in names if n.startswith('ppt/media/')]
canon = {}; alias = {}
for n in media:
    h = hashlib.md5(zin.read(n)).hexdigest()
    if h in canon: alias[n] = canon[h]
    else: canon[h] = n
print('media', len(media), 'unique', len(canon))
zout = zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED)
for n in names:
    if n in alias: continue
    data = zin.read(n)
    if n.endswith('.rels'):
        t = data.decode('utf8')
        for a, c in alias.items():
            t = t.replace('/' + a, '/' + c).replace(a.replace('ppt/', '../'), c.replace('ppt/', '../'))
        data = t.encode('utf8')
    zout.writestr(n, data, zipfile.ZIP_STORED if n.startswith('ppt/media/') else zipfile.ZIP_DEFLATED)
zout.close()
print('size MB', round(os.path.getsize(dst) / 1e6, 1))
