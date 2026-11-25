import type { APIRoute } from 'astro';
import { BRAND } from '@/data/brand';

export const GET: APIRoute = async ({ url }) => {
  if (url.hostname.endsWith('.workers.dev') || url.hostname.endsWith('.netlify.app')) {
    return new Response('User-agent: *\nDisallow: /\n', {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const txt = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    '',
    'User-agent: OAI-SearchBot',
    'Allow: /',
    '',
    'User-agent: ChatGPT-User',
    'Allow: /',
    '',
    'User-agent: PerplexityBot',
    'Allow: /',
    '',
    'User-agent: Claude-SearchBot',
    'Allow: /',
    '',
    `Sitemap: ${BRAND.domain}/sitemap.xml`,
    `# AI Context: ${BRAND.domain}/llms.txt`,
  ].join('\n');

  return new Response(txt, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
