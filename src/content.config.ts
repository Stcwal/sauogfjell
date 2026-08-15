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

const quizSchema = z.object({
  title: z.string(),
  author: z.string(),
  draft: z.boolean(),
  publishDate: z.coerce.date(),
  preface: z.string().optional(),
  quiz: z.object({
    questions: z.record(
      z.string(),
      z.object({
        q: z.string(),
        o: z.array(z.string()).min(2),
        a: z.string(),
      }),
    ),
  }),
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

const quiz = defineCollection({
  loader: glob({base: './src/content/games/quiz', pattern: '**/*.json'}),
  schema: quizSchema,
})

export const collections = { 
  dev,
  stian, 
  anders,
  quiz
};