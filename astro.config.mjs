// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Static site (default output). No SSR, no client framework.
// Set `site` to the final URL once known so canonical/sitemap links are correct.
export default defineConfig({
  site: 'https://kaist-qit.pages.dev',
  vite: {
    plugins: [tailwindcss()],
  },
});
