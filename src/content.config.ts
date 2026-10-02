import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { categories } from './data/site';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    category: z.enum(categories),
    draft: z.boolean().default(false),
    sample: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    titleZh: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    order: z.number(),
    selected: z.boolean().default(false),
    kind: z.enum(['robotics', 'signals', 'electronics', 'instrument']),
    status: z.string().default('资料待补充'),
    repository: z.url().optional(),
    gallery: z.array(z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() })).default([]),
  }),
});

export const collections = { blog, projects };
