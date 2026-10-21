// The indexing gate (SEO-10, CODE-15): one build flag decides both the robots meta of every page
// and robots.txt. Only the production build on switch day sets PUBLIC_SITE_INDEXABLE=true; the
// staging preview and every other build stay noindex. See docs/geo-e-indicizzazione.md.
export const siteIndexable = import.meta.env.PUBLIC_SITE_INDEXABLE === 'true';
