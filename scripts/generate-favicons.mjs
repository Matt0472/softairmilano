// Generates the favicon set from the white logo (public/logo/logo-white.png):
//   favicon-16.png / favicon-32.png / favicon.ico  → crossed rifles only (the wordmark is
//                                                    unreadable at tab size), on gunmetal
//   apple-touch-icon.png (180) / icon-192.png / icon-512.png → full logo on gunmetal
// Run: node scripts/generate-favicons.mjs
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const SRC = 'public/logo/logo-white.png';
const BG = { r: 14, g: 17, b: 20, alpha: 1 }; // --color-background #0e1114

const logo = sharp(SRC);
const { width, height } = await logo.metadata();

// Crossed rifles = top part of the mark, trimmed to its alpha bounding box.
// Two steps: sharp applies trim() before extract() inside one pipeline.
const topPart = await sharp(SRC).extract({ left: 0, top: 0, width, height: Math.round(height * 0.4) }).toBuffer();
const riflesWide = await sharp(topPart).trim().toBuffer();
// The rifles are a wide, thin motif: at tab size only the central X (the crossing) reads well,
// so the small icons use a square crop centred on it.
const rw = await sharp(riflesWide).metadata();
const side = Math.min(rw.width, Math.round(rw.height * 1.25));
const rifles = await sharp(riflesWide).extract({ left: Math.round((rw.width - side) / 2), top: 0, width: side, height: rw.height }).toBuffer();

async function icon(size, sourceBuffer, padRatio, out, rounded) {
  const inner = Math.round(size * (1 - padRatio * 2));
  const art = await sharp(sourceBuffer).resize({ width: inner, height: inner, fit: 'inside', kernel: 'lanczos3' }).png().toBuffer();
  const meta = await sharp(art).metadata();
  let bg = sharp({ create: { width: size, height: size, channels: 4, background: BG } });
  if (rounded) {
    const r = Math.round(size * 0.2);
    const mask = Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="#fff"/></svg>`);
    bg = sharp(await bg.png().toBuffer()).composite([{ input: mask, blend: 'dest-in' }]);
  }
  const buf = await sharp(await bg.png().toBuffer())
    .composite([{ input: art, left: Math.round((size - meta.width) / 2), top: Math.round((size - meta.height) / 2) }])
    .png().toBuffer();
  await writeFile(out, buf);
  return buf;
}

const p16 = await icon(16, rifles, 0.06, 'public/favicon-16.png', true);
const p32 = await icon(32, rifles, 0.06, 'public/favicon-32.png', true);
await icon(180, await sharp(SRC).toBuffer(), 0.12, 'public/apple-touch-icon.png', false); // iOS rounds it
await icon(192, await sharp(SRC).toBuffer(), 0.12, 'public/icon-192.png', false);
await icon(512, await sharp(SRC).toBuffer(), 0.12, 'public/icon-512.png', false);

// favicon.ico with embedded PNG entries (16 + 32) — no extra dependency needed.
const entries = [p16, p32];
const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(entries.length, 4);
let offset = 6 + 16 * entries.length; const dirs = [];
for (const [i, png] of entries.entries()) {
  const size = i === 0 ? 16 : 32; const d = Buffer.alloc(16);
  d.writeUInt8(size, 0); d.writeUInt8(size, 1); d.writeUInt8(0, 2); d.writeUInt8(0, 3);
  d.writeUInt16LE(1, 4); d.writeUInt16LE(32, 6); d.writeUInt32LE(png.length, 8); d.writeUInt32LE(offset, 12);
  dirs.push(d); offset += png.length;
}
await writeFile('public/favicon.ico', Buffer.concat([header, ...dirs, ...entries]));
console.log('favicons written');
