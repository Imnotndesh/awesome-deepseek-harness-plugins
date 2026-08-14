import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://awesome-deepseek-harness-plugins.pages.dev',
  integrations: [sitemap()],
});
