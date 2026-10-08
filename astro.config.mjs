import { defineConfig } from 'astro/config';
import rehypeSvma from './src/lib/rehype-svma.mjs';

// GitHub Pages preview: https://calvickauer.github.io/svmed-aesthetics/
const SITE = process.env.SITE_URL || 'https://calvickauer.github.io';
const BASE = process.env.BASE_PATH ?? '/svmed-aesthetics';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  markdown: { rehypePlugins: [[rehypeSvma, { base: BASE + '/' }]], smartypants: false },
  devToolbar: { enabled: false },
});
