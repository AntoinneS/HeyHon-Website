import type { APIRoute } from 'astro';
import { BRAND } from '@/data/brand';
import { PRODUCTS } from '@/data/products';
import { ARTICLES } from '@/data/articles';

export const GET: APIRoute = async () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const staticRoutes = [
    { path: '/', priority: '1.0' },
    { path: '/shop', priority: '0.95' },
    { path: '/st-mary-flora', priority: '0.95' },
    { path: '/wholesale', priority: '0.9' },
    { path: '/gifting', priority: '0.9' },
    { path: '/delivery', priority: '0.9' },
    { path: '/international', priority: '0.85' },
    { path: '/story', priority: '0.8' },
    { path: '/why-hey-hon', priority: '0.85' },
    { path: '/recipes', priority: '0.8' },
    { path: '/learn', priority: '0.85' },
    { path: '/faq', priority: '0.8' },
    { path: '/contact', priority: '0.7' },
  ];

  const productRoutes = PRODUCTS.filter((p) => p.type !== 'gift_box').map((p) => ({
    path: `/shop/${p.slug}`,
    priority: '0.9',
  }));

  const articleRoutes = ARTICLES.map((a) => ({
    path: `/learn/${a.slug}`,
    priority: '0.8',
  }));

  const urls = [...staticRoutes, ...productRoutes, ...articleRoutes]
    .map(
      (r) =>
        `  <url><loc>${BRAND.domain}${r.path}</loc><lastmod>${lastmod}</lastmod><priority>${r.priority}</priority></url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
