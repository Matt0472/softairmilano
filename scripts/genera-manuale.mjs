// Client manual builder (CMS-12) — SoftAir Milano
// The source, docs/manuale-cliente.html, is a fragment: <title>, <style> and the page body, without
// the document wrapper. Here it becomes a full page in public/<PATH>/, which Astro copies as is.
//
// The page is reserved (CMS-13): nothing links to it, it carries noindex, and @astrojs/sitemap lists
// only Astro pages, so it stays out of the sitemap. Never add PATH to robots.txt: that file is public
// and would give the address away.
//
// The site's fonts are copied next to the page from the same @fontsource packages the site uses: the
// hashed files in /_astro change at every build, so the page cannot point there. A font that is not
// found is skipped and the manual falls back to the system stack declared in its CSS.
//
// Usage: npm run manuale (also part of dev and build).

import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const SOURCE = resolve(ROOT, 'docs/manuale-cliente.html');
const PATH = 'manuale-sam-3c9e'; // unguessable on purpose; the folder is ignored by git
const OUT_DIR = resolve(ROOT, 'public', PATH);
// Published name → file in node_modules. The names match the url() in the manual's @font-face.
const FONTS = {
  'oswald-600.woff2': '@fontsource/oswald/files/oswald-latin-600-normal.woff2',
  'oswald-700.woff2': '@fontsource/oswald/files/oswald-latin-700-normal.woff2',
  'inter.woff2': '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
};

const fragment = readFileSync(SOURCE, 'utf8');

// Everything up to </style> belongs in <head>, the rest is the body.
const end = fragment.indexOf('</style>');
if (end === -1) throw new Error('docs/manuale-cliente.html has no <style> block: unexpected structure.');
const head = fragment.slice(0, end + '</style>'.length).trim();
const body = fragment.slice(end + '</style>'.length).trim();

const page = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="referrer" content="no-referrer">
<meta name="color-scheme" content="dark">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${head}
</head>
<body>
${body}
</body>
</html>
`;

// Rebuilt from scratch, so a font or file dropped from this script does not linger.
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(resolve(OUT_DIR, 'fonts'), { recursive: true });
writeFileSync(resolve(OUT_DIR, 'index.html'), page);

const missing = [];
for (const [name, from] of Object.entries(FONTS)) {
  const file = resolve(ROOT, 'node_modules', from);
  if (existsSync(file)) copyFileSync(file, resolve(OUT_DIR, 'fonts', name));
  else missing.push(name);
}

console.log(
  `Manual: /${PATH}/ written (${(page.length / 1024).toFixed(0)} KB)` +
    (missing.length ? `, fonts not found: ${missing.join(', ')} (system fallback)` : '') +
    '.',
);
