import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const site = process.env.SITE_URL || 'https://uestc-wangyifan.github.io';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap({ filter: (page) => !page.endsWith('/404/') })],
  vite: { plugins: [tailwindcss()] },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { strict: 'warn' }]],
      shikiConfig: {
        themes: { light: 'github-light', dark: 'github-dark' },
        wrap: false,
      },
    }),
  },
});
