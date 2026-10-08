// Finishing touches on the pages written in Markdown (blog articles, legal pages), done on the
// built HTML by a hook in astro.config.mjs, because Astro 7's default Markdown processor takes no
// rehype plugins without an extra package:
// - each local image (/uploads/…) gets its width and height, read from the file, so the text never
//   jumps when it arrives (CLS), lazy loading, async decoding and the WebP the image pipeline
//   writes beside it (scripts/ottimizza-immagini.mjs) when there is one;
// - a link the client wrote to a page that is switched off (src/lib/pages.ts) keeps its words and
//   loses the link, as the links in src/data do. The menu and footer are already pruned, so what is
//   left here comes from the Markdown.

import { existsSync } from 'node:fs';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { decodePath } from './fields';
import { isOffHref } from './pages';

const PUBLIC_DIR = join(process.cwd(), 'public');

const attr = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

async function sizeImages(html: string): Promise<string> {
  const tags = [...new Set(html.match(/<img\b[^>]*>/g) ?? [])];
  for (const tag of tags) {
    const src = attr(tag, 'src') ?? '';
    // Only the Markdown's own images: a Picture already carries its size and loading.
    if (!src.startsWith('/uploads/') || attr(tag, 'width') || attr(tag, 'loading')) continue;
    const file = join(PUBLIC_DIR, decodePath(src));
    if (!existsSync(file)) continue;
    // The size as served: the WebP pipeline turns photos upright first (EXIF orientation).
    const { width, height } = (await sharp(file).metadata()).autoOrient;
    const webp = src.replace(/\.(jpe?g|png)$/i, '.webp');
    const finalSrc = webp !== src && existsSync(join(PUBLIC_DIR, decodePath(webp))) ? webp : src;
    const extra = `${width && height ? ` width="${width}" height="${height}"` : ''} loading="lazy" decoding="async"`;
    html = html.replaceAll(tag, tag.replace(`src="${src}"`, `src="${finalSrc}"`).replace(/\s*\/?>$/, `${extra}>`));
  }
  return html;
}

// An anchor to a switched-off page becomes its own words.
const unlinkOff = (html: string, off: Set<string>) =>
  off.size ? html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/g, (all, attrs: string, inner: string) => (isOffHref(attr(attrs, 'href'), off) ? inner : all)) : html;

/** Finishes every built page under the given folders of dist/. */
export async function finishMarkdownPages(dist: URL, folders: string[], off: Set<string>) {
  for (const folder of folders) {
    const root = new URL(`./${folder}/`, dist);
    if (!existsSync(root)) continue;
    for (const entry of await readdir(root, { recursive: true })) {
      if (!entry.endsWith('.html')) continue;
      const file = new URL(entry, root);
      const html = await readFile(file, 'utf8');
      const done = unlinkOff(await sizeImages(html), off);
      if (done !== html) await writeFile(file, done);
    }
  }
}
