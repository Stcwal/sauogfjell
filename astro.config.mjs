import { defineConfig } from 'astro/config';
import db from '@astrojs/db';
import node from '@astrojs/node';
// https://astro.build/config
if (process.argv.includes('build') && !process.argv.includes('--remote') && !process.env.ASTRO_DATABASE_FILE) {
  process.env.ASTRO_DATABASE_FILE = '.astro/content.db';
}

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [db()]
});