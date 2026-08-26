const L = require('./lib.js');
const pres = L.newPres();
let counter = 1;
const ctx = { n: () => counter++ };
require('./slides-a.js')(pres, ctx);
require('./slides-b.js')(pres, ctx);
require('./slides-c.js')(pres, ctx);
const out = process.argv[2] || 'Bab2-Framing-Business-Ethics-PT-Djarum.pptx';
pres.writeFile({ fileName: out }).then(() => console.log('written:', out, '| slides:', pres.slides.length));
