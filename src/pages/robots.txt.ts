// robots.txt from the indexing gate (src/lib/indexing.ts). Staging blocks every crawler; production
// lets them all in, names the AI crawlers on purpose (SEO-09: the permission stays declared even if
// their defaults change) and points to the sitemap. The client manual's path is never written here,
// not even in a comment: robots.txt is public (SEO-11).
import type { APIRoute } from 'astro';
import { siteIndexable } from '../lib/indexing';

const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
];

export const GET: APIRoute = ({ site }) => {
  const lines = siteIndexable
    ? [
        'User-agent: *',
        'Allow: /',
        '',
        ...AI_CRAWLERS.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', '']),
        `Sitemap: ${new URL('sitemap-index.xml', site)}`,
      ]
    : ['User-agent: *', 'Disallow: /'];
  return new Response(`${lines.join('\n')}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
