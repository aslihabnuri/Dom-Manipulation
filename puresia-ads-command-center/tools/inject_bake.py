import json,re,sys
p=sys.argv[1]; gen=sys.argv[2]; defm=sys.argv[3]
src=open(p,encoding='utf-8').read()
state=open('baked_state.json',encoding='utf-8').read().replace('</','<\\/')
m=re.search(r'(<script id="BAKED_STATE" type="application/json">).*?(</script>)',src,re.S)
src=src[:m.start()]+m.group(1)+state+m.group(2)+src[m.end():]
m2=re.search(r'(<script id="BASE_DATA" type="application/json">)(.*?)(</script>)',src,re.S)
d=json.loads(m2.group(2)); d['meta']['generated']=gen; d['meta']['defaultMonth']=defm
src=src[:m2.start()]+m2.group(1)+json.dumps(d,ensure_ascii=False,separators=(',',':'))+m2.group(3)+src[m2.end():]
open(p,'w',encoding='utf-8').write(src); print('inject OK; HTML',round(len(src)/1e6,2),'MB')
