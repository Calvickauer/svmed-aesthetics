import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../lib/site';

const STATIC = ['/', '/about-us/', '/about-us/meet-the-team/', '/services/', '/skin-care/', '/financing/', '/financing/cherry-payment-plans/', '/request-appointment/', '/testimonials/', '/before-after/', '/current-promotions/', '/contact-us/'];

export const GET: APIRoute = async () => {
  const origin = (import.meta.env.PUBLIC_CANONICAL_ORIGIN || SITE.url).replace(/\/$/, '');
  const pages = (await getCollection('pages')).map((p) => p.data.path);
  const urls = [...new Set([...STATIC, ...pages])].sort();
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((p) => `  <url><loc>${origin}${p}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
