import { BRAND } from '@/data/brand';
import type { ProductItem } from '@/data/products';
import type { FaqEntry } from '@/data/faq';
import type { RecipeItem } from '@/data/recipes';
import type { ArticleItem } from '@/data/articles';

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BRAND.domain}/#organization`,
        name: BRAND.legalName,
        alternateName: [...BRAND.alternateNames],
        url: BRAND.domain,
        logo: `${BRAND.domain}/media/hey-hon-hero.webp`,
        founder: {
          '@type': 'Person',
          name: BRAND.founder,
          jobTitle: BRAND.founderTitle,
        },
        sameAs: [BRAND.contact.instagramUrl, BRAND.contact.gbpUrl],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+1-658-218-2734',
          contactType: 'customer service',
          areaServed: 'JM',
          availableLanguage: ['English'],
        },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${BRAND.domain}/#localbusiness`,
        name: BRAND.legalName,
        alternateName: [...BRAND.alternateNames],
        url: BRAND.domain,
        image: `${BRAND.domain}/media/hey-hon-og.jpg`,
        telephone: '+1-658-218-2734',
        priceRange: 'JMD $2,200 - $6,600',
        paymentAccepted: 'WhatsApp-confirmed bank transfer, Lynk, or cash on delivery/pickup',
        sameAs: [BRAND.contact.instagramUrl, BRAND.contact.gbpUrl],
        address: {
          '@type': 'PostalAddress',
          addressLocality: "Guy's Hill",
          addressRegion: 'St. Mary',
          addressCountry: 'JM',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: BRAND.origin.coordinates.lat,
          longitude: BRAND.origin.coordinates.lng,
        },
        areaServed: [
          'Kingston', 'St. Andrew', 'Portmore', 'Spanish Town', 'St. Catherine',
          'St. Mary', 'St. Ann', 'St. James', 'Manchester', 'Clarendon',
          'Portland', 'St. Thomas', 'Trelawny', 'Hanover', 'Westmoreland', 'St. Elizabeth',
        ],
        description:
          'Single-origin raw, cold-extracted wildflower honey harvested from pesticide-free apiaries near Guy’s Hill and Louisiana in St. Mary, Jamaica.',
      },
    ],
  };
}

export function buildProductSchema(product: ProductItem, inStock: boolean) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    image: `${BRAND.domain}${product.image}`,
    description: product.description,
    brand: { '@type': 'Brand', name: BRAND.name },
    countryOfOrigin: { '@type': 'Country', name: 'Jamaica' },
    offers: {
      '@type': 'Offer',
      url: `${BRAND.domain}/shop/${product.slug}`,
      priceCurrency: 'JMD',
      price: String(product.priceJmd),
      availability:
        product.statusOverride === 'coming_soon'
          ? 'https://schema.org/PreOrder'
          : inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': `${BRAND.domain}/#organization` },
    },
  };
}

export function buildFaqSchema(items: FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildRecipeSchema(recipes: RecipeItem[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': recipes.map((r) => ({
      '@type': 'Recipe',
      name: r.title,
      image: `${BRAND.domain}${r.image}`,
      description: r.summary,
      prepTime: r.prepTimeIso,
      recipeYield: r.servings,
      recipeCategory: r.category,
      recipeCuisine: 'Jamaican',
      author: { '@id': `${BRAND.domain}/#organization` },
      recipeIngredient: r.ingredients,
      recipeInstructions: r.steps.map((s, idx) => ({
        '@type': 'HowToStep',
        position: idx + 1,
        text: s,
      })),
    })),
  };
}

export function buildArticleSchema(article: ArticleItem) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    image: `${BRAND.domain}${article.image}`,
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
    author: {
      '@type': 'Person',
      name: BRAND.founder,
      jobTitle: BRAND.founderTitle,
      url: `${BRAND.domain}/story`,
    },
    publisher: { '@id': `${BRAND.domain}/#organization` },
    mainEntityOfPage: `${BRAND.domain}/learn/${article.slug}`,
  };
}

export function buildBreadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: c.name,
      item: `${BRAND.domain}${c.path}`,
    })),
  };
}
