// A text turned into an address fragment: lowercase, no accents, words joined by dashes
// («Cosa devono indossare?» → "cosa-devono-indossare").
export const slugify = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
