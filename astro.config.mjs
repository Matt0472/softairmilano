// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Single source of truth for the site URL (see CLAUDE.md "Convenzioni").
// Override with the SITE_URL env var for staging previews.
const SITE_URL = process.env.SITE_URL || 'https://softairmilano.it';

export default defineConfig({
  site: SITE_URL,
  build: {
    // Inline the CSS into the HTML to avoid extra render-blocking requests.
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      // Legal pages are noindex: keep them out of the sitemap too.
      filter: (page) => !/\/(privacy|cookie)\/?$/.test(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
