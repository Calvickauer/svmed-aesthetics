// Builds the favicon set from the 3200x1500 master logo (images/2022/09/svm.png).
// The leaf mark is cropped out of the logo so it stays legible at 16px.
// Run once (`npm run icons`); outputs are committed in public/.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const SRC = 'images/2022/09/svm.png';
const OUT = 'public';
// Leaf cluster region in the 3200x1500 master
const cropped = await sharp(SRC).ensureAlpha().extract({ left: 940, top: 660, width: 1260, height: 830 }).png().toBuffer();
const leaf = await sharp(cropped).trim().png().toBuffer();
const meta = await sharp(leaf).metadata();
const side = Math.round(Math.max(meta.width, meta.height) * 1.08);
const square = await sharp({ create: { width: side, height: side, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([{ input: leaf, gravity: 'center' }]).png().toBuffer();

// Small sizes (16/32/48) use only the large green leaf, like the original favicon.
const leafOnlyCrop = await sharp(SRC).ensureAlpha().extract({ left: 950, top: 670, width: 600, height: 820 }).png().toBuffer();
const leafOnly = await sharp(leafOnlyCrop).trim().png().toBuffer();
const lm = await sharp(leafOnly).metadata();
const ls = Math.max(lm.width, lm.height);
const smallSquare = await sharp({ create: { width: ls, height: ls, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([{ input: leafOnly, gravity: 'center' }]).png().toBuffer();
const png = (size) => sharp(smallSquare).resize(size, size, { kernel: 'lanczos3' });
async function opaque(size, pad) {
  const inner = Math.round(size * (1 - pad * 2));
  const fg = await sharp(square).resize(inner, inner).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } }).composite([{ input: fg, gravity: 'center' }]).png().toBuffer();
}

await png(16).png().toFile(`${OUT}/favicon-16x16.png`);
await png(32).png().toFile(`${OUT}/favicon-32x32.png`);
await writeFile(`${OUT}/apple-touch-icon.png`, await opaque(180, 0.1));
await writeFile(`${OUT}/android-chrome-192x192.png`, await opaque(192, 0.12));
await writeFile(`${OUT}/android-chrome-512x512.png`, await opaque(512, 0.12));
await writeFile(`${OUT}/maskable-512x512.png`, await opaque(512, 0.2));

// favicon.ico with 16/32/48 PNG entries
const sizes = [16, 32, 48];
const imgs = await Promise.all(sizes.map((s) => png(s).png().toBuffer()));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const o = 6 + i * 16;
  header.writeUInt8(s, o); header.writeUInt8(s, o + 1); header.writeUInt8(0, o + 2); header.writeUInt8(0, o + 3);
  header.writeUInt16LE(1, o + 4); header.writeUInt16LE(32, o + 6);
  header.writeUInt32LE(imgs[i].length, o + 8); header.writeUInt32LE(offset, o + 12);
  offset += imgs[i].length;
});
await writeFile(`${OUT}/favicon.ico`, Buffer.concat([header, ...imgs]));

await writeFile(`${OUT}/site.webmanifest`, JSON.stringify({
  name: 'Salinas Valley Medical Aesthetics',
  short_name: 'SVMA',
  icons: [
    { src: 'android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: 'android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
  theme_color: '#9bb24d',
  background_color: '#ffffff',
  display: 'browser',
  start_url: '.',
}, null, 2) + '\n');
console.log('icons written');
