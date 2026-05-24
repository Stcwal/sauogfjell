import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { boolean } from 'astro:schema';

const dev = defineCollection({
  loader: glob({ base: './src/content/dev', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    draft: z.boolean(),
    publishDate: z.date(),
    editDate: z.date(),
  }),
});

const stian = defineCollection({
  loader: glob({ base: './src/content/stian', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
  }),
});

const anders = defineCollection({
  loader: glob({ base: './src/content/anders', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { 
  dev,
  stian, 
  anders 
};