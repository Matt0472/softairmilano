// The blog articles as the pages use them: only the published ones (an article switched off, or
// every article when the blog page itself is off: src/lib/pages.ts), newest first, with the
// helpers the list, the cards and the article share.

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';
import { offPaths } from './pages';
import { decodePath } from './fields';

export type Post = CollectionEntry<'blog'>;

/** Cards on one page of the list: three full rows of three. The first page also opens with the
 *  newest article, featured; past that the list goes on in numbered pages (lighter pages, and each
 *  one a page of its own for search engines). */
export const POSTS_PER_PAGE = 9;

export const postHref = (post: Post): string => `/blog/${post.id}`;

/** The cover's address when its file is in public/: an upload that is not there shows no broken image. */
export const coverOf = (post: Post): string | undefined => {
  const src = post.data.image;
  return src?.startsWith('/') && existsSync(join(process.cwd(), 'public', decodePath(src))) ? src : undefined;
};

export async function getPosts(): Promise<Post[]> {
  const off = offPaths();
  const posts = await getCollection('blog', (post) => post.data.published && !off.has(postHref(post)));
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

// Dates are calendar days written in the CMS (midnight UTC): read and written in UTC, so no time
// zone moves them to the day before.
const longDate = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** "12 marzo 2024". */
export const formatDate = (date: Date): string => longDate.format(date);

/** "2024-03-12", for <time datetime> and structured data. */
export const isoDate = (date: Date): string => date.toISOString().slice(0, 10);

// Italian prose read on screen.
const WORDS_PER_MINUTE = 200;

/** Minutes to read a Markdown body: its words, without image and link addresses. */
export function readingMinutes(body = ''): number {
  const text = body
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
