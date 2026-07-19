import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { boolean } from 'astro:schema';

const blogpostSchema = z.object({
    title: z.string(),
    author: z.string(),
    draft: z.boolean(),
    publishDate: z.date(),
    editDate: z.date().optional(),
    tags: z.array(z.string()).default([]),
  })

const dev = defineCollection({
  loader: glob({ base: './src/content/dev', pattern: '**/*.{md,mdx}' }),
  schema: blogpostSchema,
});

const stian = defineCollection({
  loader: glob({ base: './src/content/stian', pattern: '**/*.{md,mdx}' }),
  schema: blogpostSchema,
});

const anders = defineCollection({
  loader: glob({ base: './src/content/anders', pattern: '**/*.{md,mdx}' }),
  schema: blogpostSchema,
});

export const collections = { 
  dev,
  stian, 
  anders 
};