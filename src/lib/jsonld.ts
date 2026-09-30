// Structured data shared by the pages. Values come from the CMS, so the serialiser escapes "<":
// no value can close the <script type="application/ld+json"> it is printed in.

export const toLd = (data: unknown): string => JSON.stringify(data).replace(/</g, '\\u003c');

export interface Crumb {
  label: string;
  href: string;
}

// Same URL form as the canonical (directory build: trailing slash), so the trail never points at a redirect.
const canonicalUrl = (href: string, site: URL | undefined): string =>
  new URL(href === '/' || href.endsWith('/') ? href : `${href}/`, site).toString();

export const breadcrumbLd = (crumbs: Crumb[], site: URL | undefined) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.label,
    item: canonicalUrl(c.href, site),
  })),
});

export const faqLd = (items: { q: string; a: string }[]) =>
  items.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;
