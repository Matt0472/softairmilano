// Content collections. The blog articles are Markdown files the client writes in Pages CMS
// («Blog — articoli» in .pages.yml): the fields below are the front matter, the text is the body.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { articleSlug } from './lib/slug';

// Pages CMS can save a field the client emptied as "" or null: both mean "not set", so the pages
// test one value only (CMS-10).
const optionalText = z
  .string()
  .nullish()
  .transform((value) => value?.trim() || undefined);

const blog = defineCollection({
  // The address is the «Indirizzo dell'articolo» (slug: softair-sulla-neve → /blog/softair-sulla-neve),
  // else the file name (src/lib/slug.ts).
  loader: glob({
    pattern: '*.md',
    base: './src/content/blog',
    generateId: ({ entry, data }) => articleSlug(data.slug, entry),
  }),
  schema: z.object({
    title: z.string(),
    // «Indirizzo dell'articolo»: read by the loader's generateId above.
    slug: optionalText,
    // The summary under the title in the list, and the meta description.
    description: z.string(),
    date: z.coerce.date(),
    image: optionalText,
    imageAlt: optionalText,
    // «Articolo online»: switched off, the article leaves the build (src/lib/pages.ts).
    published: z.boolean().default(true),
  }),
});

export const collections = { blog };
