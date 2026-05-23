import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const dev = defineCollection({
  loader: glob({ base: './src/content/dev', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
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