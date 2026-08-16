import fs from 'node:fs';
import path from 'node:path';

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ART = path.dirname(new URL(import.meta.url).pathname);
const FONTS = process.env.NARATIF_FONTS || path.join(ART, 'fonts');

/* Inline the engine exactly as the app runs it, so the tool and the pipeline
   can never disagree about what is safe to send to a voice engine. */
const ORDER = ['numbers.mjs', 'lexicon.mjs', 'normalize.mjs', 'lint.mjs', 'wer.mjs'];

const engine = ORDER.map((name) => {
  const src = fs.readFileSync(path.join(REPO, 'src/lang', name), 'utf8');
  return src
    // Imports may span several lines, so strip on the whole source rather
    // than line by line — the modules become one shared scope here.
    .replace(/^import\s+[\s\S]*?\bfrom\s+'[^']+';?[ \t]*$/gm, '')
    .replace(/^export\s+(function|const|class|let)\s/gm, '$1 ')
    .replace(/^export\s*\{[\s\S]*?\};?[ \t]*$/gm, '');
}).join('\n\n');

if (/^\s*(import|export)\s/m.test(engine)) {
  throw new Error('masih ada sintaks modul yang tersisa di mesin');
}

const b64 = (file) => fs.readFileSync(path.join(FONTS, file)).toString('base64');
const fonts = {
  serif: b64('InstrumentSerif-Regular.ttf'),
  serifItalic: b64('InstrumentSerif-Italic.ttf'),
  sans: b64('InstrumentSans-Regular.ttf'),
  sansBold: b64('InstrumentSans-Bold.ttf'),
  mono: b64('DMMono-Regular.ttf'),
};

const shell = fs.readFileSync(path.join(ART, 'shell.html'), 'utf8');
const out = shell
  .replace('/*__ENGINE__*/', engine)
  .replace(/__FONT_SERIF__/g, fonts.serif)
  .replace(/__FONT_SERIF_ITALIC__/g, fonts.serifItalic)
  .replace(/__FONT_SANS__/g, fonts.sans)
  .replace(/__FONT_SANS_BOLD__/g, fonts.sansBold)
  .replace(/__FONT_MONO__/g, fonts.mono);

fs.writeFileSync(path.join(ART, 'pemeriksa-naskah.html'), out);
console.log('dibangun:', (out.length / 1024 / 1024).toFixed(2), 'MB');
console.log('mesin   :', (engine.length / 1024).toFixed(1), 'KB');
