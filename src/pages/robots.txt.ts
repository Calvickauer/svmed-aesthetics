import type { APIRoute } from 'astro';
import { SITE } from '../lib/site';

export const GET: APIRoute = () => {
  const origin = (import.meta.env.PUBLIC_CANONICAL_ORIGIN || SITE.url).replace(/\/$/, '');
  const noindex = import.meta.env.PUBLIC_NOINDEX === 'true';
  const body = noindex ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
