// Faithful logo recolor: builds a pure-white and a dark version of the brand
// logo on a transparent background, using the artwork's own shape as the alpha
// mask (no AI redraw — the design stays pixel-exact, edges stay anti-aliased).

import sharp from 'sharp';
import { resolve } from 'node:path';

const PROJECT = resolve(import.meta.dirname, '..');
const SRC = resolve(PROJECT, 'public/logo/logo_softair_milano.png');

const { width, height } = await sharp(SRC).metadata();

// Alpha mask = darkness of the artwork (flattened on white so a transparent OR
// white source both normalise to black-on-white first). Black art -> opaque.
const alpha = await sharp(SRC)
  .flatten({ background: '#ffffff' })
  .greyscale()
  .negate()
  .raw()
  .toBuffer();

async function tint(rgb, out) {
  await sharp({ create: { width, height, channels: 3, background: rgb } })
    .joinChannel(alpha, { raw: { width, height, channels: 1 } })
    .png()
    .toFile(resolve(PROJECT, out));
}

// White for dark surfaces (nav/footer); ink for light surfaces (future use).
await tint({ r: 255, g: 255, b: 255 }, 'public/logo/logo-white.png');
await tint({ r: 14, g: 17, b: 20 }, 'public/logo/logo-dark.png');

// Preview: white logo composited on the site's dark ground (verification only).
await sharp({ create: { width: width + 80, height: height + 80, channels: 3, background: { r: 14, g: 17, b: 20 } } })
  .composite([{ input: resolve(PROJECT, 'public/logo/logo-white.png'), gravity: 'center' }])
  .png()
  .toFile('/tmp/claude-1000/-home-mpedone-personal-projects-softairmilano/468cadf8-e853-4d48-a37a-66d39271aa50/scratchpad/logo-white-preview.png');

console.log('OK', width + 'x' + height);
