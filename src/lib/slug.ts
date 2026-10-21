// A text turned into an address fragment: lowercase, no accents, words joined by dashes
// («Cosa devono indossare?» → "cosa-devono-indossare").
export const slugify = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** A blog article's address: its «Indirizzo dell'articolo» (the front matter's `slug`), made safe
 *  whatever the client typed, or else its file name, which the CMS writes from that field. The
 *  pages and the page switches (src/lib/pages.ts) both read it here. */
export const articleSlug = (slug: unknown, fileName: string): string =>
  (typeof slug === 'string' && slugify(slug)) || fileName.replace(/\.md$/, '');
