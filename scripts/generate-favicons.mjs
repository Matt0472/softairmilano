// Rasterises the favicon set from public/favicon.svg (the crosshair mark, accent colour):
//   favicon-16.png / favicon-32.png / favicon.ico / apple-touch-icon.png (180) / icon-192.png / icon-512.png
// Run: node scripts/generate-favicons.mjs   (after changing the SVG or the accent colour)
import sharp from 'sharp';
import { writeFile, readFile } from 'node:fs/promises';

const svg = await readFile('public/favicon.svg');
const png = (size) => sharp(svg, { density: 72 * (size / 64) * 4 }).resize(size, size).png().toBuffer();

const p16 = await png(16), p32 = await png(32);
await writeFile('public/favicon-16.png', p16);
await writeFile('public/favicon-32.png', p32);
await writeFile('public/apple-touch-icon.png', await png(180));
await writeFile('public/icon-192.png', await png(192));
await writeFile('public/icon-512.png', await png(512));

// favicon.ico with embedded PNG entries (16 + 32), no extra dependency.
const entries = [[16, p16], [32, p32]];
const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(entries.length, 4);
let offset = 6 + 16 * entries.length; const dirs = [];
for (const [size, buf] of entries) {
  const d = Buffer.alloc(16);
  d.writeUInt8(size, 0); d.writeUInt8(size, 1); d.writeUInt16LE(1, 4); d.writeUInt16LE(32, 6); d.writeUInt32LE(buf.length, 8); d.writeUInt32LE(offset, 12);
  dirs.push(d); offset += buf.length;
}
await writeFile('public/favicon.ico', Buffer.concat([header, ...dirs, ...entries.map(([, b]) => b)]));
console.log('favicons written from favicon.svg');
