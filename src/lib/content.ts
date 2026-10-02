import { getCollection } from 'astro:content';

export async function getPosts() {
  return (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id));
}
export async function getProjects() {
  return (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
}
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'short', day: '2-digit', timeZone: 'UTC' }).format(date);
}
