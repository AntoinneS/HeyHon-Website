export interface FaqEntry {
  id: string;
  category: 'Purity & Storage' | 'Ordering & Payments' | 'Delivery & Pickup' | 'Sending Gifts & Travel' | 'Wholesale & Gifting';
  question: string;
  answer: string;
  tags: string[];
  ctaLabel?: string;
  ctaHref?: string;
}

export const FAQS: FaqEntry[] = [
  {
    id: 'origin',
    category: 'Purity & Storage',
    question: 'Where does Hey Hon honey come from?',
    answer:
      'All of our honey is harvested straight from our family hives in the hills of St. Mary, Jamaica, near Guy’s Hill and Louisiana.',
    tags: ['st mary', 'guys hill', 'louisiana', 'origin', 'where', 'farm', 'apiary'],
    ctaLabel: 'See the St. Mary Bloom Map',
    ctaHref: '/st-mary-flora',
  },
  {
    id: 'purity',
    category: 'Purity & Storage',
    question: 'Is Hey Hon honey 100% pure and raw?',
    answer:
      'Yes. Hey Hon is 100% pure, unheated wildflower honey with zero added sugar and no syrup blends. It is bottled straight from the comb so the natural nutrients, pollen, and fresh flower aroma stay intact.',
    tags: ['pure', 'raw', 'sugar', 'fake', 'real', 'cold extracted', 'unfiltered', 'enzymes', 'pollen'],
    ctaLabel: 'Why Hey Hon vs. Supermarket Honey',
    ctaHref: '/why-hey-hon',
  },
  {
    id: 'crystallization',
    category: 'Purity & Storage',
    question: 'Why does raw honey crystallize, and how do I soften it?',
    answer:
      'Crystallization is completely normal in pure, unheated honey and means your jar has not spoiled. Stand the closed glass jar in a bowl of warm (not boiling) water and stir gently to return it to liquid gold. Never microwave raw honey, and store it in a dry cupboard at room temperature.',
    tags: ['crystallize', 'solid', 'hard', 'sugar', 'soften', 'melt', 'store', 'fridge', 'shelf life'],
    ctaLabel: 'Read Crystallization Guide',
    ctaHref: '/learn/why-raw-honey-crystallizes-and-how-to-fix-it',
  },
  {
    id: 'color-taste-change',
    category: 'Purity & Storage',
    question: 'Why does the color or taste change slightly with the seasons?',
    answer:
      'Because our honey is 100% raw, it reflects whatever flowers are blooming in St. Mary during that time of year: lighter golden tones during winter Logwood and Citrus blossoms, and deeper amber during Mango, Pimento, Banana, and autumn Sorrel.',
    tags: ['color', 'taste', 'flavor', 'season', 'batch', 'dark', 'light', 'logwood', 'wildflower'],
    ctaLabel: 'See What Is Blooming Now',
    ctaHref: '/st-mary-flora',
  },
  {
    id: 'infants',
    category: 'Purity & Storage',
    question: 'Can babies or infants eat raw honey?',
    answer:
      'No. Never give honey (raw or heated) to infants under 12 months old.',
    tags: ['baby', 'infant', 'child', 'safe', 'age', '12 months', 'toddler'],
  },
  {
    id: 'prices',
    category: 'Ordering & Payments',
    question: 'How much does Hey Hon Raw Honey cost?',
    answer:
      'Our 266ml glass jar is JMD $2,200 and our 500ml glass jar is JMD $3,200. Our Free Kingston Delivery bundles are 2× 500ml for JMD $6,400 and 3× 266ml for JMD $6,600.',
    tags: ['price', 'cost', 'how much', '266ml', '500ml', 'bundle', 'jmd', 'usd'],
    ctaLabel: 'Shop the Harvest',
    ctaHref: '/shop',
  },
  {
    id: 'payment-methods',
    category: 'Ordering & Payments',
    question: 'How can I pay for my order?',
    answer:
      'You can pay online by Visa or Mastercard (both local Jamaican and international cards work), or choose WhatsApp Order (+1 658-218-2734) to confirm payment and delivery directly with us.',
    tags: ['pay', 'payment', 'card', 'visa', 'mastercard', 'handypay', 'whatsapp', 'online', 'cash'],
    ctaLabel: 'Shop Now',
    ctaHref: '/shop',
  },
  {
    id: 'stock-live',
    category: 'Ordering & Payments',
    question: 'How do I know if a jar size is available right now?',
    answer:
      'Every product shows current availability right on the page. Since our harvests come in small seasonal batches from St. Mary, any temporarily sold-out size lets you join a quick restock alert list.',
    tags: ['stock', 'available', 'sold out', 'inventory', 'batch', 'waitlist'],
  },
  {
    id: 'delivery-rates',
    category: 'Delivery & Pickup',
    question: 'How much is delivery across Jamaica?',
    answer:
      'Portmore courier is JMD $500, Kingston & Spanish Town courier is JMD $800, and Knutsford Express islandwide delivery is JMD $700 flat across 11 parishes. Kingston delivery is free on orders of JMD $6,000 or more.',
    tags: ['delivery', 'shipping', 'kingston', 'portmore', 'spanish town', 'knutsford', 'parish', 'islandwide', 'free'],
    ctaLabel: 'Check Your Parish Rate',
    ctaHref: '/delivery',
  },
  {
    id: 'pickup',
    category: 'Delivery & Pickup',
    question: 'Where can I pick up my order for free?',
    answer:
      'Free pickup is available at three spots: Shop 15, Northside Plaza (Liguanea, Kingston 6), Sovereign Village (Portmore), and Digicel Head Office (Downtown Kingston). Pick your spot at checkout and we confirm your ready time on WhatsApp.',
    tags: ['pickup', 'pick up', 'free', 'northside', 'liguanea', 'sovereign village', 'digicel'],
    ctaLabel: 'View Pickup Locations',
    ctaHref: '/delivery',
  },
  {
    id: 'diaspora-gift',
    category: 'Sending Gifts & Travel',
    question: 'Can I order from the USA, UK, or Canada for delivery to family in Jamaica?',
    answer:
      'Yes! You can pay online with an international Visa or Mastercard, see approximate USD, CAD, or GBP totals, include a free handwritten gift note, hide prices on the delivery slip, and deliver directly to loved ones anywhere in Jamaica.',
    tags: ['diaspora', 'usa', 'uk', 'canada', 'abroad', 'overseas', 'family', 'gift', 'send to jamaica'],
    ctaLabel: 'Send a Gift to Jamaica',
    ctaHref: '/gifting',
  },
  {
    id: 'intl-shipping',
    category: 'Sending Gifts & Travel',
    question: 'Do you ship directly to the USA, Canada, or the UK?',
    answer:
      'Yes, by custom shipping quote. Use our International Shipping Calculator to estimate parcel weight and carrier options (Jamaica Post EMS or DHL/FedEx Express), then submit your address and we reply within 24 hours with exact shipping.',
    tags: ['international', 'ship to usa', 'uk', 'canada', 'dhl', 'ems', 'fedex', 'overseas', 'export'],
    ctaLabel: 'Calculate Overseas Shipping',
    ctaHref: '/international',
  },
  {
    id: 'luggage-customs',
    category: 'Sending Gifts & Travel',
    question: 'Can I fly home with Hey Hon honey in my luggage?',
    answer:
      'Yes: pack glass jars in checked luggage only, because both 266ml and 500ml jars exceed the 100ml (3.4 oz) carry-on liquid limit. Sealed store-bought honey for personal use is generally allowed into the US, Canada, and UK when declared to customs.',
    tags: ['plane', 'fly', 'flight', 'luggage', 'airport', 'tsa', 'customs', 'carry on', 'checked bag'],
    ctaLabel: 'Read Luggage & Customs Rules',
    ctaHref: '/international#travel-guide',
  },
  {
    id: 'wholesale-moq',
    category: 'Wholesale & Gifting',
    question: 'What is the minimum order for wholesale, cafés, or wedding favors?',
    answer:
      'Our minimum wholesale order is 10 jars, with tiered discounts for 10 to 24, 25 to 49, and 50+ jars. We supply cafés, hotels, shops, corporate gifts, and wedding favors.',
    tags: ['wholesale', 'bulk', 'moq', 'minimum', 'wedding', 'favors', 'corporate', 'hotel', 'cafe', 'restaurant', 'stockist'],
    ctaLabel: 'Open Bulk Pricing Estimator',
    ctaHref: '/wholesale',
  },
  {
    id: 'gift-boxes',
    category: 'Wholesale & Gifting',
    question: 'Do you offer gift notes or gift boxes?',
    answer:
      'Every order includes a free custom handwritten gift note at checkout. Our keepsake Hey Hon Gift Boxes are coming soon, and you can join the waitlist on the Shop or Gifting page for first access.',
    tags: ['gift', 'gift box', 'note', 'card', 'present', 'ribbon', 'waitlist'],
    ctaLabel: 'Join Gift Box Waitlist',
    ctaHref: '/gifting',
  },
  {
    id: 'heyho-typo',
    category: 'Ordering & Payments',
    question: 'I searched for “Heyho Jamaica” or “Hey Ho”. Is that Hey Hon?',
    answer:
      'Yes! Hey Hon Jamaica (heyhonjamaica.com) is our St. Mary raw honey brand. People sometimes spell it Heyho, Hey Ho, or Heyhon: you are in the right place.',
    tags: ['heyho', 'hey ho', 'heyhon', 'spelling', 'brand'],
  },
];
