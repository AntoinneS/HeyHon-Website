export interface ProductItem {
  sku: string;
  slug: string;
  name: string;
  shortName: string;
  sizeLabel: string;
  type: 'single' | 'bundle' | 'gift_box';
  componentSku?: string;
  componentQty: number;
  priceJmd: number;
  packedWeightKg: number;
  defaultStock: number;
  lowStockThreshold: number;
  statusOverride: 'auto' | 'in_stock' | 'low_stock' | 'out_of_stock' | 'coming_soon';
  waitlistEnabled: boolean;
  badge: string;
  tagline: string;
  description: string;
  highlights: string[];
  image: string;
  gallery: string[];
  freeKingstonEligible: boolean;
  servingsLabel: string;
}

export const PRODUCTS: ProductItem[] = [
  {
    sku: 'HH-RAW-266',
    slug: 'raw-st-mary-wildflower-266ml',
    name: 'Raw St. Mary Wildflower Honey: 266ml',
    shortName: '266ml Jar',
    sizeLabel: '266ml Glass Jar',
    type: 'single',
    componentQty: 1,
    priceJmd: 2200,
    packedWeightKg: 0.55,
    defaultStock: 25,
    lowStockThreshold: 5,
    statusOverride: 'auto',
    waitlistEnabled: false,
    badge: 'Everyday Size',
    tagline: 'Pure, unheated Jamaican wildflower honey in a 266ml glass jar.',
    description:
      'Harvested from our family apiaries in St. Mary, Jamaica and bottled in glass without heating. Rich in natural flavor for tea, coffee, breakfast, and gifting.',
    highlights: [
      '100% pure raw honey with zero added sugar',
      'Never heated, keeping all natural goodness',
      'Free handwritten gift note at checkout',
    ],
    image: '/media/raw-honey.png',
    gallery: ['/media/raw-honey.png', '/media/st-mary-hills.jpg', '/media/bee-forage.jpg'],
    freeKingstonEligible: false,
    servingsLabel: '~18 tablespoons',
  },
  {
    sku: 'HH-RAW-500',
    slug: 'raw-st-mary-wildflower-500ml',
    name: 'Raw St. Mary Wildflower Honey: 500ml',
    shortName: '500ml Jar',
    sizeLabel: '500ml Glass Jar',
    type: 'single',
    componentQty: 1,
    priceJmd: 3200,
    packedWeightKg: 0.95,
    defaultStock: 25,
    lowStockThreshold: 5,
    statusOverride: 'auto',
    waitlistEnabled: false,
    badge: 'Best Value',
    tagline: 'Our larger kitchen jar at our best price per ml.',
    description:
      'Our flagship 500ml glass jar gives you almost twice as much St. Mary wildflower honey at our best value per ml. Smooth, unfiltered, and packed safely in glass.',
    highlights: [
      'Save 23% per ml compared to the 266ml jar',
      '100% pure, unheated St. Mary honey in glass',
      'Free handwritten gift note at checkout',
    ],
    image: '/media/raw-honey.png',
    gallery: ['/media/raw-honey.png', '/media/beekeeper.jpg', '/media/islandwide.png'],
    freeKingstonEligible: false,
    servingsLabel: '~33 tablespoons',
  },
  {
    sku: 'HH-BUNDLE-KGN-500',
    slug: 'free-kingston-delivery-duo-500ml',
    name: 'Free Kingston Delivery Duo (2× 500ml)',
    shortName: '2× 500ml Bundle',
    sizeLabel: '2 × 500ml Glass Jars (1L Total)',
    type: 'bundle',
    componentSku: 'HH-RAW-500',
    componentQty: 2,
    priceJmd: 6400,
    packedWeightKg: 1.9,
    defaultStock: 12,
    lowStockThreshold: 3,
    statusOverride: 'auto',
    waitlistEnabled: false,
    badge: 'Free Kingston Delivery',
    tagline: 'Two 500ml jars (1 litre total) with free Kingston courier delivery.',
    description:
      'Made for households and gifting. Ordering two 500ml jars gives you a full litre of raw St. Mary honey and automatically unlocks free Kingston delivery.',
    highlights: [
      'Includes free Kingston delivery (saves JMD $800)',
      'Two 500ml glass jars (1 full litre)',
      'Free handwritten gift note included',
    ],
    image: '/media/raw-honey.png',
    gallery: ['/media/raw-honey.png', '/media/islandwide.png'],
    freeKingstonEligible: true,
    servingsLabel: '~66 tablespoons',
  },
  {
    sku: 'HH-BUNDLE-KGN-266',
    slug: 'free-kingston-delivery-trio-266ml',
    name: 'Free Kingston Delivery Trio (3× 266ml)',
    shortName: '3× 266ml Trio',
    sizeLabel: '3 × 266ml Glass Jars',
    type: 'bundle',
    componentSku: 'HH-RAW-266',
    componentQty: 3,
    priceJmd: 6600,
    packedWeightKg: 1.65,
    defaultStock: 8,
    lowStockThreshold: 3,
    statusOverride: 'auto',
    waitlistEnabled: false,
    badge: 'Gift Trio · Free Kgn Delivery',
    tagline: 'Three 266ml jars: keep one, share two, and get free Kingston delivery.',
    description:
      'Great for sharing with family or sending a multi-jar gift across Jamaica. Unlocks free Kingston delivery automatically and ships cushioned across the island.',
    highlights: [
      'Includes free Kingston delivery (saves JMD $800)',
      'Easy to share or gift across households',
      'Free handwritten gift notes included',
    ],
    image: '/media/raw-honey.png',
    gallery: ['/media/raw-honey.png', '/media/st-mary-hills.jpg'],
    freeKingstonEligible: true,
    servingsLabel: '~54 tablespoons',
  },
  {
    sku: 'HH-GIFT-BOX',
    slug: 'signature-gift-box',
    name: 'Hey Hon Signature Gift Box',
    shortName: 'Signature Gift Box',
    sizeLabel: 'Curated Presentation Box',
    type: 'gift_box',
    componentQty: 1,
    priceJmd: 0,
    packedWeightKg: 1.25,
    defaultStock: 0,
    lowStockThreshold: 0,
    statusOverride: 'coming_soon',
    waitlistEnabled: true,
    badge: 'Coming Soon',
    tagline: 'Keepsake honey gift box with wooden dipper. Join the waitlist for first access.',
    description:
      'Our bespoke presentation gift boxes are launching soon with St. Mary raw honey, a wooden honey dipper, and a keepsake box. Join the list for early access.',
    highlights: [
      'Early access before public launch',
      'Available for single gifts or events (10+ jars)',
      'Includes wooden honey dipper & gift card',
    ],
    image: '/media/hey-hon-hero.png',
    gallery: ['/media/hey-hon-hero.png'],
    freeKingstonEligible: false,
    servingsLabel: 'Limited First Edition',
  },
];

export function getProductBySku(sku: string): ProductItem | undefined {
  return PRODUCTS.find((p) => p.sku === sku);
}

export function getProductBySlug(slug: string): ProductItem | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
