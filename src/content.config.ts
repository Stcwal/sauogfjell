import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blogpostSchema = z.object({
    title: z.string(),
    author: z.string(),
    draft: z.boolean(),
    publishDate: z.date(),
    editDate: z.date().optional(),
    tags: z.array(z.string()).default([]),
  })

const dev = defineCollection({
  loader: glob({ base: './src/content/dev', pattern: '**/*.md' }),
  schema: blogpostSchema,
});

const stian = defineCollection({
  loader: glob({ base: './src/content/stian', pattern: '**/*.md' }),
  schema: blogpostSchema,
});

const anders = defineCollection({
  loader: glob({ base: './src/content/anders', pattern: '**/*.md' }),
  schema: blogpostSchema,
});

export const collections = { 
  dev,
  stian, 
  anders 
};