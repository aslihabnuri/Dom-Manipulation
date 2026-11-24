import sys,base64,hashlib
dst=sys.argv[1]
expected=int(sys.argv[2]) if len(sys.argv)>2 else None
b64=sys.stdin.read().strip().replace('\n','').replace(' ','')
try:
    data=base64.b64decode(b64,validate=True)
except Exception as e:
    print('B64-ERROR:',e);sys.exit(1)
if expected is not None and len(data)!=expected:
    print(f'SIZE-MISMATCH: dapat {len(data)} byte, harus {expected}');sys.exit(1)
open(dst,'wb').write(data)
print('SAVED',dst,len(data),'bytes sha1',hashlib.sha1(data).hexdigest()[:10])
