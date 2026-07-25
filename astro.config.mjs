import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  markdown: {
    shikiConfig: {
      // themes: { light: 'github-light', dark: 'github-dark' },
      theme: 'monokai',
      wrap: true,
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});