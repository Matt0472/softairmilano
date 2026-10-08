// Structured data shared by the pages. Values come from the CMS, so the serialiser escapes "<":
// no value can close the <script type="application/ld+json"> it is printed in.

export const toLd = (data: unknown): string => JSON.stringify(data).replace(/</g, '\\u003c');

/** The business's one @id, set in BaseLayout: other entities (an article's author) point at it. */
export const businessId = (siteUrl: string): string => new URL('/#business', siteUrl).toString();

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

interface PostLd {
  title: string;
  description?: string;
  /** "2024-03-12". */
  date: string;
  href: string;
  image?: string;
}

// Written and published by the business itself, in the list as in the article.
const postingLd = (post: PostLd, site: URL | undefined, siteUrl: string) => ({
  '@type': 'BlogPosting',
  headline: post.title,
  ...(post.description ? { description: post.description } : {}),
  datePublished: post.date,
  url: canonicalUrl(post.href, site),
  ...(post.image ? { image: new URL(post.image, site).toString() } : {}),
  author: { '@id': businessId(siteUrl) },
  publisher: { '@id': businessId(siteUrl) },
});

/** One article. */
export const blogPostingLd = (post: PostLd, site: URL | undefined, siteUrl: string) => ({
  '@context': 'https://schema.org',
  ...postingLd(post, site, siteUrl),
  mainEntityOfPage: canonicalUrl(post.href, site),
  inLanguage: 'it-IT',
});

/** The blog's list page, with the articles it shows. */
export const blogLd = (
  blog: { name: string; description?: string; href: string },
  posts: PostLd[],
  site: URL | undefined,
  siteUrl: string,
) => ({
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: blog.name,
  ...(blog.description ? { description: blog.description } : {}),
  url: canonicalUrl(blog.href, site),
  inLanguage: 'it-IT',
  publisher: { '@id': businessId(siteUrl) },
  blogPost: posts.map((p) => postingLd(p, site, siteUrl)),
});
