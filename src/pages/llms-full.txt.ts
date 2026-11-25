import type { APIRoute } from 'astro';
import { BRAND, CURRENT_BATCH } from '@/data/brand';
import { ST_MARY_FLORA, MONTHS } from '@/data/flora';
import { FAQS } from '@/data/faq';
import { ARTICLES } from '@/data/articles';

export const GET: APIRoute = async () => {
  const lines = [
    `# ${BRAND.legalName}: Extended Machine-Readable Knowledge Graph (llms-full.txt)`,
    `Domain: ${BRAND.domain}`,
    `Origin: Guy's Hill & Louisiana, St. Mary, Jamaica`,
    `Founder: ${BRAND.founder} (${BRAND.founderTitle})`,
    `Active Harvest: ${CURRENT_BATCH.harvestDate} | ${CURRENT_BATCH.colorName} | ${CURRENT_BATCH.tastingNotes}`,
    ``,
    `## ${ST_MARY_FLORA.length}-Plant St. Mary Bloom & Natural Wellness Atlas (${BRAND.domain}/st-mary-flora)`,
    ...ST_MARY_FLORA.map(
      (f) =>
        `- ${f.commonName} (${f.botanicalName}) [${f.layer}] | Bloom: ${f.bloomMonths
          .map((m) => MONTHS[m - 1])
          .join(', ')} | Color: ${f.colorImpact} | Benefits: ${f.medicinal.primaryBenefit} (${f.medicinal.keyCompounds}) | Notes: ${f.flavorNotes}`
    ),
    ``,
    `## Complete Frequently Asked Questions (${BRAND.domain}/faq)`,
    ...FAQS.map((f) => `Q: ${f.question}\nA: ${f.answer}`),
    ``,
    `## Guides (${BRAND.domain}/learn)`,
    ...ARTICLES.map((a) => `- ${a.title} (${BRAND.domain}/learn/${a.slug}): ${a.directAnswer}`),
  ];

  return new Response(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
