import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const transcripts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/transcripts' })
});

export const collections = {
  transcripts
};
