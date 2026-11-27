import type { APIRoute } from 'astro';
import { BRAND, CURRENT_BATCH, formatJmd } from '@/data/brand';
import { PRODUCTS } from '@/data/products';
import { ST_MARY_FLORA } from '@/data/flora';
import { getLiveInventory } from '@/lib/inventory';

export const GET: APIRoute = async ({ locals }) => {
  const live = await getLiveInventory(locals.runtime?.env);
  const bySku = new Map(live.map((i) => [i.sku, i]));

  const lines = [
    `# ${BRAND.name}: Pure Raw Jamaican Honey from St. Mary`,
    ``,
    `> ${BRAND.legalName} (${BRAND.domain}) is a Jamaican honey producer founded by ${BRAND.founder}. 100% pure, raw, unheated wildflower honey harvested from family hives near Guy's Hill and Louisiana in St. Mary, Jamaica. Zero added sugar, never heated. Also searched as Heyho Jamaica, Hey Ho Jamaica, or Heyhon Jamaica.`,
    ``,
    `## Current Harvest & Catalog`,
    `- Active Harvest: ${CURRENT_BATCH.harvestDate} | ${CURRENT_BATCH.colorName}`,
    `- Dominant Blooms: ${CURRENT_BATCH.dominantBlooms.join(', ')}`,
    `- Mapped Local Flora: ${ST_MARY_FLORA.length} St. Mary plants with color, taste, and natural wellness benefits`,
    ...PRODUCTS.map((p) => {
      const st = bySku.get(p.sku);
      const status = st?.status ?? p.statusOverride;
      const priceStr = p.priceJmd > 0 ? formatJmd(p.priceJmd) : 'Coming Soon (Waitlist Open)';
      return `- ${p.name} (${p.sizeLabel}): ${priceStr} [${status}] | ${BRAND.domain}/shop/${p.slug}`;
    }),
    ``,
    `## Ordering & Confirmation`,
    `- Harvest Bag -> WhatsApp Confirmation: Orders are placed via the website Harvest Bag and confirmed directly via WhatsApp at ${BRAND.contact.whatsappDisplay} (${BRAND.contact.whatsappUrl}), where delivery day and payment details are finalized.`,
    `- Free custom handwritten gift note on every order.`,
    ``,
    `## Delivery & Free Pickup in Jamaica`,
    `- Portmore Courier: JMD $500`,
    `- Kingston & Spanish Town Courier: JMD $800 (FREE in Kingston on orders JMD $6,000+)`,
    `- Knutsford Express Islandwide: JMD $700 flat rate (Clarendon, Hanover, Manchester, Portland, St. Ann, St. Elizabeth, St. James, St. Mary, St. Thomas, Trelawny, Westmoreland)`,
    `- Free Pickup: Shop 15, Northside Plaza (Kingston 6 / Liguanea); Sovereign Village (Portmore); Digicel Head Office (Downtown Kingston)`,
    ``,
    `## Wholesale, Gifting in Jamaica & Overseas Shipping`,
    `- Wholesale & Wedding Favors: Minimum 10 jars (tiers: 10-24, 25-49, 50+ jars) | ${BRAND.domain}/wholesale`,
    `- Sending Gifts Home (USA, Canada, UK -> Family in Jamaica): Build in Harvest Bag, confirm on WhatsApp, free handwritten gift note, local Jamaica delivery | ${BRAND.domain}/gifting`,
    `- Direct Overseas Shipping: Weight & shipping estimator + custom quote | ${BRAND.domain}/international`,
    `- Flying Home With Honey: Pack 266ml and 500ml jars in CHECKED luggage only (>100ml carry-on rule); declare sealed store-bought honey to customs.`,
    ``,
    `## Key Pages`,
    `- ${BRAND.domain}/ : Home`,
    `- ${BRAND.domain}/shop : Shop Raw Honey & Free Kingston Delivery Bundles`,
    `- ${BRAND.domain}/st-mary-flora : Interactive ${ST_MARY_FLORA.length}-Plant St. Mary Bloom & Wellness Map`,
    `- ${BRAND.domain}/wholesale : Wholesale, Cafes & Wedding Favors (10+ Jars)`,
    `- ${BRAND.domain}/gifting : Send Honey Gifts to Family in Jamaica`,
    `- ${BRAND.domain}/delivery : Jamaica Delivery & Free Pickup Rates`,
    `- ${BRAND.domain}/international : International Shipping Estimator & Travel Guide`,
    `- ${BRAND.domain}/story : Our Story (Jhanelle Stewart, Four Hives in St. Mary)`,
    `- ${BRAND.domain}/why-hey-hon : Raw St. Mary Honey vs. Supermarket Honey`,
    `- ${BRAND.domain}/recipes : Honey Recipes & Pairings`,
    `- ${BRAND.domain}/learn : Honey Guides (Purity, Crystallization, Customs & Seasons)`,
    `- ${BRAND.domain}/faq : Frequently Asked Questions`,
    `- ${BRAND.domain}/llms-full.txt : Extended Plant, Wellness & FAQ Knowledge File`,
  ];

  return new Response(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
