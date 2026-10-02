import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../lib/content';
import { site } from '../data/site';
export async function GET(context: APIContext) {
  return rss({
    title: 'Wang Yifan · Writing',
    description: site.description,
    site: context.site!,
    items: (await getPosts()).map((post) => ({ title: post.data.title, description: post.data.description, pubDate: post.data.date, link: `/blog/${post.id}/`, categories: [post.data.category, ...post.data.tags] })),
    customData: '<language>zh-CN</language>',
  });
}
