import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string(),
    description: z.string().nullable(),
    path: z.string(),
    kind: z.enum(['service', 'brand', 'team']),
    banner: z.string().nullable(),
    gallery: z.array(z.string()).default([]),
    ogImage: z.string().nullable().optional(),
    portrait: z.string().optional(),
    cherryBanner: z.boolean().optional(),
    eyebrow: z.string().optional(),
  }),
});
export const collections = { pages };
