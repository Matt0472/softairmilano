// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { offPaths, isOffHref, pruneOffLinks, LEGAL_PATHS } from './src/lib/pages.ts';
import { join } from 'node:path';
import { finishMarkdownPages } from './src/lib/markdown-pages.ts';

// Single source of truth for the site URL (CODE-14).
// Override with the SITE_URL env var for staging previews.
const SITE_URL = process.env.SITE_URL || 'https://softairmilano.it';

// Pages switched off in the CMS («Pagina online»): see src/lib/pages.ts. The data plugin drops the
// links to them from every src/data file as it is imported; the hook puts the «not found» page at
// their addresses (see below).
const off = offPaths();
const DATA_DIR = join(process.cwd(), 'src', 'data');
const pruneOffPages = {
  name: 'softair:prune-off-pages',
  enforce: /** @type {const} */ ('pre'),
  transform(/** @type {string} */ code, /** @type {string} */ id) {
    // Only the site's own data files, imported as plain JSON (a ?raw or ?url import is not JSON).
    if (!off.size || id.includes('?') || !id.startsWith(DATA_DIR) || !id.endsWith('.json')) return;
    return { code: JSON.stringify(pruneOffLinks(JSON.parse(code), id, off)), map: null };
  },
};
const postBuild = {
  name: 'softair:post-build',
  hooks: {
    'astro:build:done': async (/** @type {{ dir: URL }} */ { dir }) => {
      // Cloudflare Pages keeps serving a file that a deploy removed, from each data center, for up to
      // a week (asset retention: purging the cache does not clear it). So a switched-off page keeps
      // its address in the build, holding the «not found» page (noindex, no canonical): every
      // visitor sees it at once. An article deleted outright can still show for up to a week, hence
      // the manual's «switch it off, do not delete it».
      const notFound = await readFile(new URL('./404.html', dir));
      for (const path of off) {
        const folder = new URL(`.${path}/`, dir);
        await rm(folder, { recursive: true, force: true });
        await mkdir(folder, { recursive: true });
        await writeFile(new URL('index.html', folder), notFound);
      }
      // Markdown pages: image sizes, lazy loading and WebP; links to switched-off pages unlinked.
      await finishMarkdownPages(dir, ['blog', ...LEGAL_PATHS.map((p) => p.slice(1))], off);
    },
  },
};

export default defineConfig({
  site: SITE_URL,
  build: {
    // Inline the CSS into the HTML to avoid extra render-blocking requests.
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      // Legal pages are noindex: keep them out of the sitemap too, with the switched-off pages.
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '');
        return !LEGAL_PATHS.includes(path) && !isOffHref(path, off);
      },
    }),
    postBuild,
  ],
  vite: {
    plugins: [pruneOffPages, tailwindcss()],
  },
});
