// Image optimizer — SoftAir Milano
// Runs before `astro dev` / `astro build`. For every raster upload in public/uploads (the JPEG/PNG
// the client manages in Pages CMS) it writes:
//  - a sibling `<name>.webp` capped at MAX_EDGE: the largest srcset candidate (MEDIA-06);
//  - narrower `<name>-w<width>.webp` variants in public/_img, so each slot downloads roughly the
//    pixels it shows (PERF-04). They live outside the CMS media folder to keep the client's library
//    to their own files, and they are pure build output: pruned when their source disappears.
// src/components/atoms/Picture.astro reads both. Incremental: an output is rewritten only when it
// is missing or older than its source (mtime), so a replaced upload is picked up on the next run.

import { readdir, stat, mkdir, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, join, parse } from 'node:path';
import sharp from 'sharp';

const PROJECT = resolve(import.meta.dirname, '..');
const DIR = resolve(PROJECT, 'public/uploads');
const VARIANT_DIR = resolve(PROJECT, 'public/_img'); // same path as VARIANT_DIR in Picture.astro
const MAX_EDGE = 1600; // cap the longest side; the full-bleed desktop hero never needs more
const QUALITY = 72;
// Device-pixel widths of the real slots: 640 = rail tiles on phones (320 css px at 2x), 800 =
// phone-width images at ~2x (the Lighthouse Moto G is 412 css px at 1.75x = 721), 1024 = tablets
// and half-width desktop columns, 1200 = phone-width images at 3x (360-400 css px). Only widths
// narrower than the capped .webp are written.
const VARIANT_WIDTHS = [640, 800, 1024, 1200];

await mkdir(DIR, { recursive: true });
await mkdir(VARIANT_DIR, { recursive: true });

const isFresh = async (out, sourceMtime) =>
  existsSync(out) && (await stat(out)).mtimeMs >= sourceMtime;

const sources = (await readdir(DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));
const expectedVariants = new Set();
const unreadable = new Set();

let made = 0;
let skipped = 0;
for (const file of sources) {
  const src = join(DIR, file);
  const { name } = parse(file);
  try {
    const sourceMtime = (await stat(src)).mtimeMs;
    const meta = await sharp(src).metadata();
    // Phone photos carry EXIF rotation; the WebP drops EXIF, so orient the pixels instead.
    const { width, height } = meta.autoOrient;
    const baseWidth = Math.round(width * Math.min(1, MAX_EDGE / Math.max(width, height)));

    const targets = [
      {
        out: join(DIR, `${name}.webp`),
        resize: { width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true },
      },
    ];
    for (const w of VARIANT_WIDTHS.filter((w) => w < baseWidth)) {
      const out = join(VARIANT_DIR, `${name}-w${w}.webp`);
      expectedVariants.add(out);
      targets.push({ out, resize: { width: w } });
    }

    const stale = [];
    for (const target of targets) {
      if (await isFresh(target.out, sourceMtime)) skipped++;
      else stale.push(target);
    }
    if (stale.length === 0) continue;

    // Decode once, encode every stale size from the same pipeline.
    const decoded = sharp(src).autoOrient();
    await Promise.all(
      stale.map((t) => decoded.clone().resize(t.resize).webp({ quality: QUALITY }).toFile(t.out)),
    );
    made += stale.length;
    console.log(`  → ${name}: ${stale.map((t) => parse(t.out).base).join(', ')}`);
  } catch (error) {
    // A broken or half-written upload must not take the whole deploy down: Picture.astro falls
    // back to the original file, and the next run retries because the outputs are still stale.
    unreadable.add(name);
    console.warn(`  ! ${file}: ${error.message}`);
  }
}

let pruned = 0;
for (const f of await readdir(VARIANT_DIR)) {
  const path = join(VARIANT_DIR, f);
  const source = f.replace(/-w\d+\.webp$/, '');
  if (!expectedVariants.has(path) && !unreadable.has(source)) {
    await unlink(path);
    pruned++;
  }
}

console.log(
  `Images: ${made} written, ${skipped} up to date` +
    (pruned ? `, ${pruned} orphan variants removed` : '') +
    (unreadable.size ? `, ${unreadable.size} unreadable sources` : '') +
    '.',
);
