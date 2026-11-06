// Every page lives in its own folder (/arcotag/index.html), so its address ends in a slash and the
// host answers a link without it with a redirect (308) first: one more round trip before the page
// on every click, which shows in the visitors' loading times (LCP). Links come from the code and
// from the client, in the CMS, written either way: after the build, each internal link to a page
// that exists gets its slash, hash and query kept («/softair#prenota» → «/softair/#prenota»).
// Files (/uploads/…, .pdf), the home and addresses that only redirect (_redirects) stay as they are.

import { existsSync } from 'node:fs';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export async function addTrailingSlashes(dist: URL) {
  const root = fileURLToPath(dist);
  const isPage = (path: string) => existsSync(join(root, path, 'index.html'));
  const files = (await readdir(root, { recursive: true })).filter((f) => f.endsWith('.html'));
  for (const file of files) {
    const full = join(root, file);
    const html = await readFile(full, 'utf8');
    const next = html.replace(/href="(\/[^"/#?][^"#?]*?)([?#][^"]*)?"/g, (whole, path: string, rest = '') => {
      if (path.endsWith('/') || /\.[a-z0-9]+$/i.test(path) || !isPage(path)) return whole;
      return `href="${path}/${rest}"`;
    });
    if (next !== html) await writeFile(full, next);
  }
}
