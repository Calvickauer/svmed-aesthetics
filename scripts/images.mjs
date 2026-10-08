// Generates responsive AVIF + WebP variants for every original in images/ into
// public/_img/, and writes src/data/images.json (dimensions + srcsets).
// Incremental: existing variants are skipped, so re-runs are fast.
import sharp from 'sharp';
import { readdir, mkdir, stat, writeFile, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'images');
const OUT = path.join(ROOT, 'public', '_img');
const MANIFEST = path.join(ROOT, 'src', 'data', 'images.json');
const WIDTHS = [360, 640, 960, 1280, 1920, 2560];
const FORMATS = {
  avif: (s) => s.avif({ quality: 52, effort: 3 }),
  webp: (s) => s.webp({ quality: 74, effort: 4 }),
};

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(png|jpe?g|webp|gif|svg)$/i.test(e.name)) out.push(p);
  }
  return out.sort();
}

function widthsFor(w) {
  const ws = WIDTHS.filter((x) => x < w);
  if (w <= 2560) ws.push(w); // include the native width
  else ws.push(2560);
  return [...new Set(ws)];
}

const slug = (rel) => rel.replace(/\.[^.]+$/, '').replace(/[^A-Za-z0-9/_-]+/g, '-');

async function processOne(file) {
  const rel = path.relative(SRC, file).split(path.sep).join('/');
  if (rel.endsWith('.svg')) {
    const dest = path.join(OUT, rel);
    await mkdir(path.dirname(dest), { recursive: true });
    if (!existsSync(dest)) await copyFile(file, dest);
    return [rel, { svg: true, src: `_img/${rel}`, w: 0, h: 0 }];
  }
  const img = sharp(file, { failOn: 'none' });
  const meta = await img.metadata();
  // honour EXIF orientation
  const rotated = (meta.orientation || 1) >= 5;
  const W = rotated ? meta.height : meta.width;
  const H = rotated ? meta.width : meta.height;
  const entry = { w: W, h: H, alpha: !!meta.hasAlpha, avif: [], webp: [] };
  for (const w of widthsFor(W)) {
    for (const [fmt, enc] of Object.entries(FORMATS)) {
      const name = `${slug(rel)}-${w}.${fmt}`;
      const dest = path.join(OUT, name);
      if (!existsSync(dest)) {
        await mkdir(path.dirname(dest), { recursive: true });
        await enc(sharp(file, { failOn: 'none' }).rotate().resize({ width: w, withoutEnlargement: true })).toFile(dest);
      }
      entry[fmt].push([`_img/${name}`, w]);
    }
  }
  return [rel, entry];
}

const files = await walk(SRC);
const t0 = Date.now();
const results = [];
let i = 0;
const N = Math.max(2, Math.min(8, os.cpus().length));
sharp.concurrency(1);
await Promise.all(
  Array.from({ length: N }, async () => {
    while (i < files.length) {
      const f = files[i++];
      results.push(await processOne(f));
    }
  }),
);
results.sort((a, b) => a[0].localeCompare(b[0]));
await mkdir(path.dirname(MANIFEST), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(Object.fromEntries(results)));
console.log(`images: ${results.length} originals -> public/_img in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
