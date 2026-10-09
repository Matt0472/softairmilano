// Pages the client switched off in the CMS («Pagina online», `published: false`). One source for
// the whole build:
// - the data plugin in astro.config.mjs runs every src/data/**/*.json through pruneOffLinks, so a
//   link to a switched-off page disappears everywhere it is written: menu and footer items go,
//   the home's activities go (and with them «Provate anche»), any other link keeps its content
//   and loses its address, and components already hide a link without one (CMS-10);
// - getStaticPaths skips switched-off activities and articles; a hook in astro.config.mjs removes
//   the fixed pages' folders from dist/, so the host answers with the real 404; the sitemap skips
//   them all.
// It reads the files from disk, so it works in astro.config.mjs as in the pages. In `astro dev` a
// switched-off page still renders and the link pruning stays as it was at start-up (restart to
// see a change): what counts is the build.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

/** Fixed pages and the data file that holds their switch. Home, legal pages and 404 are always on. */
const PAGE_FILES: Record<string, string> = {
  '/corso-softair': 'src/data/corso.json',
  '/festa-di-compleanno': 'src/data/compleanno.json',
  '/addio-al-celibato': 'src/data/addio-celibato.json',
  '/teambuilding': 'src/data/teambuilding.json',
  '/softair-vs-paintball': 'src/data/paintball.json',
  '/voucher-regalo': 'src/data/voucher.json',
  '/modulistica': 'src/data/modulistica.json',
  '/contatti': 'src/data/contatti.json',
  '/blog': 'src/data/blog.json',
};
/** The policies the cookie banner links to, and all the legal pages: always on, never indexed. */
export const POLICY_PATHS = ['/privacy', '/cookie'];
export const LEGAL_PATHS = [...POLICY_PATHS, '/termini'];
const ACTIVITIES_DIR = 'src/data/activities';
const BLOG_DIR = 'src/content/blog';

const jsonOff = (file: string): boolean => {
  try {
    return JSON.parse(readFileSync(join(ROOT, file), 'utf8')).published === false;
  } catch {
    return false;
  }
};
// An article's switch sits in its front matter.
const articleOff = (file: string): boolean => {
  const head = readFileSync(join(ROOT, file), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return !!head && /^published:\s*false\b/im.test(head[1]);
};

/** Every switched-off address, without the trailing slash (e.g. "/teambuilding", "/blog/x"). */
export function offPaths(): Set<string> {
  const off = new Set<string>();
  for (const [path, file] of Object.entries(PAGE_FILES)) if (jsonOff(file)) off.add(path);
  for (const name of readdirSync(join(ROOT, ACTIVITIES_DIR))) {
    if (name.endsWith('.json') && jsonOff(join(ACTIVITIES_DIR, name))) off.add(`/${name.replace(/\.json$/, '')}`);
  }
  // With the blog page off, its articles go too; a blog with no article online goes off itself.
  // An article's address is its file name, which the CMS already writes as a slug.
  const articles = existsSync(join(ROOT, BLOG_DIR)) ? readdirSync(join(ROOT, BLOG_DIR)).filter((n) => n.endsWith('.md')) : [];
  const blogOff = off.has('/blog');
  let live = 0;
  for (const name of articles) {
    if (blogOff || articleOff(join(BLOG_DIR, name))) off.add(`/blog/${name.replace(/\.md$/, '')}`);
    else live += 1;
  }
  if (!live) off.add('/blog');
  return off;
}

const pathOf = (href: string) => href.replace(/[?#].*$/, '').replace(/\/+$/, '') || '/';

/** True for an internal address whose page is switched off. Anchors and external links are always live. */
export const isOffHref = (href: unknown, off: Set<string>): boolean =>
  typeof href === 'string' && href.startsWith('/') && off.has(pathOf(href));

/** For a page's own checks: is this internal page published? */
export const isLive = (href: string): boolean => !isOffHref(href, offPaths());

const hasOffHref = (v: unknown, off: Set<string>) =>
  !!v && typeof v === 'object' && !Array.isArray(v) && isOffHref((v as { href?: unknown }).href, off);

/**
 * Removes the links to switched-off pages from one data file. In the menu (navigation.json) and in
 * the home's activities a switched-off entry is dropped; anywhere else the entry stays and only
 * its address is emptied.
 */
export function pruneOffLinks(data: unknown, file: string, off: Set<string>): unknown {
  const dropAll = /\/navigation\.json$/.test(file);
  const walk = (v: unknown, key: string, depth: number): unknown => {
    if (Array.isArray(v)) {
      const drop = dropAll || (key === 'activities' && depth === 1 && /\/home\.json$/.test(file));
      const kept = v.filter((item) => !(drop && hasOffHref(item, off))).map((item) => walk(item, key, depth + 1));
      return kept;
    }
    if (v && typeof v === 'object') {
      const out: Record<string, unknown> = {};
      for (const [k, val] of Object.entries(v)) {
        out[k] = k === 'href' && isOffHref(val, off) ? '' : walk(val, k, depth + 1);
      }
      return out;
    }
    return v;
  };
  return walk(data, '', 0);
}
