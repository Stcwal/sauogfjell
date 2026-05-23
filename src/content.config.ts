import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';

const dev = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/pages/blog/developer-updates' }),
  schema: z.object({
    title: z.string(),
    relatedPosts: z.array(reference('dev')),
  })
});

const anders = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/pages/blog/anders'}),
  schema: z.object({
    title: z.string(),
    relatedPosts: z.array(reference('anders')),
  })
});

const stian = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/pages/blog/stian'}),
  schema: z.object({
    title: z.string(),
    relatedPosts: z.array(reference('stian')),
  })
});

export const collections = { dev, anders, stian};