// Image optimizer — SoftAir Milano
// Produces a sibling .webp for every raster upload in public/uploads, resized to
// a sensible cap. Runs before `astro dev` / `astro build` so <picture> WebP
// sources always exist. Incremental: skips images whose .webp is already fresh.

import { readdir, stat, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, extname, join } from 'node:path';
import sharp from 'sharp';

const PROJECT = resolve(import.meta.dirname, '..');
const DIR = resolve(PROJECT, 'public/uploads');
const MAX_EDGE = 1600; // cap the longest side; hero images never need more on the web
const QUALITY = 72;

if (!existsSync(DIR)) {
  await mkdir(DIR, { recursive: true });
}

const entries = await readdir(DIR);
const sources = entries.filter((f) => /\.(jpe?g|png)$/i.test(f));

let made = 0;
let skipped = 0;
for (const file of sources) {
  const src = join(DIR, file);
  const out = join(DIR, file.replace(/\.(jpe?g|png)$/i, '.webp'));

  // Incremental: skip if the .webp exists and is newer than the source.
  if (existsSync(out)) {
    const [s, o] = await Promise.all([stat(src), stat(out)]);
    if (o.mtimeMs >= s.mtimeMs) { skipped++; continue; }
  }

  await sharp(src)
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out);
  made++;
  console.log(`  → ${file.replace(extname(file), '.webp')}`);
}

console.log(`Immagini: ${made} generate, ${skipped} già aggiornate.`);
