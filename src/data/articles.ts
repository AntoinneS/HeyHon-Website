export interface ArticleItem {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: 'Purity & Science' | 'Travel & Customs' | 'Flowers & Seasons' | 'Gifting & Events';
  readTime: string;
  publishedDate: string;
  directAnswer: string;
  image: string;
  sections: {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
  relatedCta: {
    label: string;
    href: string;
  };
}

export const ARTICLES: ArticleItem[] = [
  {
    slug: 'how-to-tell-if-honey-is-pure-jamaica',
    title: 'How to Tell If Honey Is 100% Pure & Raw in Jamaica',
    metaTitle: 'How to Tell If Honey Is Pure in Jamaica (Real vs. Blended Guide) | Hey Hon',
    metaDescription:
      'Learn how to spot real raw Jamaican honey vs. sugar-syrup blends. Discover why crystallization, fresh floral aroma, and knowing the parish it came from matter more than water myths.',
    category: 'Purity & Science',
    readTime: '5 min read',
    publishedDate: '2026-11-18',
    directAnswer:
      'The best way to verify pure raw honey in Jamaica is knowing the parish it comes from, natural crystallization over time, complex flower aroma (never burnt caramel), and a cold-extracted unheated label with one ingredient: 100% raw honey. Home tricks like the water or matchstick test are often misleading.',
    image: '/media/beekeeper.jpg',
    sections: [
      {
        heading: 'Why Many Supermarket Honeys Are Blended or Overheated',
        paragraphs: [
          'Globally, honey is one of the most frequently stretched foods. High-heat processing strips away natural pollen and enzymes to keep jars artificially thin on shelves, while some cheaper blends mix real honey with cane syrup.',
          'In Jamaica, genuine raw honey is seasonal and tied directly to rainfall and flowering cycles. When supply dips, blended imports or diluted bottles often fill supermarket shelves.',
        ],
      },
      {
        heading: '5 Reliable Signs of Authentic Raw Jamaican Honey',
        paragraphs: [
          'Skip unreliable viral tricks (water and thumb tests depend mostly on thickness, not purity) and look for these real quality signs instead:',
        ],
        bullets: [
          'Clear Origin: The maker names the exact Jamaican parish and community (for Hey Hon, Guy’s Hill & Louisiana in St. Mary).',
          'Natural Crystallization: Real raw honey slowly turns creamy or textured in cool rooms because natural pollen grains are still inside.',
          'Fresh Floral Scent: Open the jar and smell it: raw St. Mary honey smells of tropical flowers, citrus, and wild herbs, never flat syrup.',
          'Rich Natural Glow: Unfiltered raw honey still holds fine pollen, giving it a warm fullness instead of thin watery clarity.',
          'Seasonal Color Shifts: Pure local honey shifts naturally from pale winter gold (Logwood & Citrus) to deeper warm amber (Mango, Pimento & Sorrel).',
        ],
      },
    ],
    relatedCta: {
      label: 'Explore the St. Mary Bloom Map',
      href: '/st-mary-flora',
    },
  },
  {
    slug: 'why-raw-honey-crystallizes-and-how-to-fix-it',
    title: 'Why Real Raw Honey Crystallizes (And How to Soften It Safely)',
    metaTitle: 'Why Raw Honey Crystallizes & How to Soften It Safely | Hey Hon Jamaica',
    metaDescription:
      'Crystallized honey has not gone bad: it shows your honey is raw and unheated. Follow our simple 3-step warm-water bath to soften Jamaican raw honey safely.',
    category: 'Purity & Science',
    readTime: '4 min read',
    publishedDate: '2026-11-16',
    directAnswer:
      'Raw honey crystallizes naturally because it is full of natural flower sugars and fine pollen grains. It has not spoiled. Stand the closed glass jar in a bowl of warm (never boiling) water for 10 to 15 minutes and stir gently to turn it silky smooth again without losing nutrients.',
    image: '/media/raw-honey.png',
    sections: [
      {
        heading: 'Crystallization Is Proof It Is Real & Unheated',
        paragraphs: [
          'Large commercial packers blast honey with high heat and ultra-fine filters to strip pollen and stop crystals from forming. While that keeps plastic squeeze bottles clear for years, it cooks away natural enzymes and fresh flower flavor.',
          'Because Hey Hon is cold-extracted and unfiltered, gentle crystals can naturally form over time, especially in cool air-conditioned kitchens.',
        ],
      },
      {
        heading: 'How to Soften Crystallized Honey in 3 Safe Steps',
        paragraphs: ['Never microwave raw honey or put it in boiling water, as extreme heat cooks away its natural goodness.'],
        bullets: [
          'Step 1: Fill a bowl with warm water (comfortable to the touch, never boiling).',
          'Step 2: Stand your closed Hey Hon glass jar upright in the warm water for 10 to 15 minutes.',
          'Step 3: Stir gently with a clean, dry spoon. Keep the jar sealed in a dry cupboard, never in the fridge.',
        ],
      },
    ],
    relatedCta: {
      label: 'Shop Raw St. Mary Honey',
      href: '/shop',
    },
  },
  {
    slug: 'bringing-jamaican-honey-through-us-uk-canada-customs',
    title: 'Flying Home With Jamaican Honey: US, UK & Canada Customs Guide',
    metaTitle: 'Can You Bring Jamaican Honey on a Plane? US, UK & Canada Customs Rules | Hey Hon',
    metaDescription:
      'Yes, sealed store-bought Jamaican honey for personal use is generally allowed into the US, Canada, and UK when declared. Always pack 266ml and 500ml glass jars in checked luggage.',
    category: 'Travel & Customs',
    readTime: '4 min read',
    publishedDate: '2026-11-15',
    directAnswer:
      'Yes, you can bring Hey Hon Jamaican honey home to the USA, Canada, or the UK in your checked luggage. Because both 266ml and 500ml jars are over the 100ml (3.4 oz) carry-on liquid limit, they cannot go in hand luggage. Always declare sealed food items to customs on arrival.',
    image: '/media/islandwide.png',
    sections: [
      {
        heading: 'Carry-On vs. Checked Luggage (The 100ml Rule)',
        paragraphs: [
          'Airport security classifies honey as a liquid. Both Hey Hon 266ml and 500ml glass jars are over the 100ml carry-on allowance and must travel inside your checked suitcase.',
          'Wrap each sealed glass jar inside a zip bag cushioned with soft clothes right in the middle of your checked bag.',
        ],
      },
      {
        heading: 'Arrival Customs Basics',
        paragraphs: ['Always check current travel notices before flying and declare all sealed food items honestly:'],
        bullets: [
          'United States: Sealed commercial honey for personal use is generally permitted when declared on arrival.',
          'Canada: Travelers may generally bring sealed pure honey for personal use (up to 5 kg per person) when declared.',
          'United Kingdom: Pure honey for personal consumption (up to 2 kg) is generally allowed when declared.',
          'Traveler Tip: Order Hey Hon 2 to 3 days before your flight for hotel delivery or free pickup in Kingston 6 or Portmore.',
        ],
      },
    ],
    relatedCta: {
      label: 'Check Shipping & Travel Rules',
      href: '/international',
    },
  },
  {
    slug: 'st-mary-wildflower-vs-logwood-honey-jamaica',
    title: 'St. Mary Wildflower vs. Jamaican Logwood Honey: Color, Taste & Seasons',
    metaTitle: 'St. Mary Wildflower vs. Jamaican Logwood Honey Explained | Hey Hon',
    metaDescription:
      'Discover how St. Mary’s tropical flowers, including Logwood, Spanish Needle, Orange, Lime, Ackee, Pimento, Moringa, and Sorrel, shape raw Jamaican honey across the year.',
    category: 'Flowers & Seasons',
    readTime: '5 min read',
    publishedDate: '2026-11-12',
    directAnswer:
      'Jamaican Logwood honey (Dec to Feb) is pale golden and light, while St. Mary wildflower honey blends seasonal nectar from 39 local hillside plants including Logwood, Spanish Needle, Moringa, Citrus, Ackee, Pimento, Banana, and Sorrel, creating deeper layers of flavor and natural nutrients across the year.',
    image: '/media/st-mary-hills.jpg',
    sections: [
      {
        heading: 'Why St. Mary Hills Yield Such Rich Multi-Floral Honey',
        paragraphs: [
          'High in the green hills near Guy’s Hill and Louisiana, St. Mary is full of diverse wild trees, fruit orchards, and medicinal herbs rather than one single crop.',
          'All year round, our bees move between Logwood trees, orange and lime blossoms, native pimento, Spanish needle, moringa, ackee, banana flowers, and autumn sorrel.',
        ],
      },
      {
        heading: 'Tasting the Jamaican Bloom Calendar',
        paragraphs: ['Each harvest carries the color and character of the season when the bees capped the comb:'],
        bullets: [
          'Winter to Early Spring (Dec to Mar): Logwood, Orange Blossom, Lime, and Ackee yield lighter luminous gold honey with a crisp floral lift.',
          'Spring to Early Summer (Apr to Jun): Pimento, Moringa, Guava, Mango, and Spanish Needle bring warm golden honey with rich garden herbs and spice.',
          'Late Summer to Autumn (Jul to Nov): Banana blossoms, Coconut, Spanish Needle, and Sorrel create deeper amber jars with soft berry-caramel notes.',
        ],
      },
    ],
    relatedCta: {
      label: 'Explore the St. Mary Bloom Map',
      href: '/st-mary-flora',
    },
  },
  {
    slug: 'send-authentic-jamaican-gifts-from-abroad',
    title: 'How to Send Authentic Raw Jamaican Honey to Family in Jamaica From Abroad',
    metaTitle: 'Send Gifts to Family in Jamaica From USA, UK & Canada | Hey Hon Honey',
    metaDescription:
      'Living in the US, UK, or Canada? Send pure St. Mary raw honey with a free handwritten gift note directly to loved ones in Kingston, Portmore, or islandwide via Knutsford Express.',
    category: 'Gifting & Events',
    readTime: '3 min read',
    publishedDate: '2026-11-10',
    directAnswer:
      'Family and friends living in the USA, Canada, or the UK can order Hey Hon online by Visa or Mastercard, add a free handwritten card, hide prices on the delivery slip, and have jars delivered straight to loved ones in Jamaica from JMD $500 in Portmore or free in Kingston on orders JMD $6,000+.',
    image: '/media/hey-hon-hero.png',
    sections: [
      {
        heading: 'Skip Expensive Overseas Postage When Gifting Home',
        paragraphs: [
          'For Mother’s Day, Christmas, birthdays, or thinking-of-you parcels for family in Kingston, Mandeville, or Montego Bay, ordering locally saves heavy international shipping fees and long wait times.',
        ],
      },
      {
        heading: 'How Sending a Gift Works in 3 Easy Steps',
        paragraphs: ['Sending a thoughtful gift takes less than two minutes:'],
        bullets: [
          '1. Pick single jars (266ml JMD $2,200 / 500ml JMD $3,200) or the Free Kingston Delivery bundle (2× 500ml, JMD $6,400 / ~US$40.50).',
          '2. Enter your loved one’s name, phone number, and parish or Knutsford station, plus your personal card message (handwritten free).',
          '3. Pay by card online and we confirm delivery straight to your recipient on WhatsApp.',
        ],
      },
    ],
    relatedCta: {
      label: 'Send a Gift to Jamaica',
      href: '/gifting',
    },
  },
  {
    slug: 'wholesale-and-wedding-favor-honey-jamaica',
    title: 'Wholesale & Wedding Favor Honey in Jamaica (10+ Jars Guide)',
    metaTitle: 'Wholesale Raw Honey & Wedding Favors in Jamaica (10+ Jars) | Hey Hon',
    metaDescription:
      'Stock 100% pure St. Mary raw honey for your Jamaican café, hotel, boutique, corporate gifts, or wedding favors starting at just 10 jars.',
    category: 'Gifting & Events',
    readTime: '4 min read',
    publishedDate: '2026-11-08',
    directAnswer:
      'Hey Hon supplies bulk raw St. Mary wildflower honey across Jamaica starting at just 10 jars, with tiered discounts for 10 to 24, 25 to 49, and 50+ jars for cafés, hotels, gift boxes, and wedding favors.',
    image: '/media/hives-in-trunk.jpg',
    sections: [
      {
        heading: 'Real Jamaican Honey Elevates Every Table & Event',
        paragraphs: [
          'Guests immediately notice the difference between generic syrup packets and pure raw Jamaican honey bottled in glass.',
          'Starting at just 10 jars makes it easy for independent cafés, villas, wedding planners, and teams to order fresh St. Mary honey without buying huge pallets upfront.',
        ],
      },
      {
        heading: 'Volume Discounts & Custom Favors',
        paragraphs: ['Use our bulk estimator to see your tier and request pricing:'],
        bullets: [
          '10 to 24 Jars: Great for cafés, bridal showers, team thank-you gifts, and villa welcome baskets.',
          '25 to 49 Jars: Built for restaurants, shops, and intimate wedding guest favors.',
          '50+ Jars: Best bulk pricing for hotels, resorts, destination weddings, and company gifting with optional custom tags or ribbons.',
        ],
      },
    ],
    relatedCta: {
      label: 'Estimate Your Bulk Order',
      href: '/wholesale',
    },
  },
];

export function getArticleBySlug(slug: string): ArticleItem | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
