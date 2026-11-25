export const BRAND = {
  name: 'Hey Hon',
  legalName: 'Hey Hon Artisanal Honey',
  alternateNames: ['Hey Hon Jamaica', 'Heyho Jamaica', 'Hey Ho Jamaica', 'Heyhon Jamaica'],
  tagline: '100% Pure Raw Jamaican Honey from St. Mary',
  domain: 'https://heyhonjamaica.com',
  founder: 'Jhanelle Stewart',
  founderTitle: 'Founder & Beekeeper',
  origin: {
    parish: 'St. Mary',
    communities: ["Guy's Hill", 'Louisiana'],
    country: 'Jamaica',
    countryCode: 'JM',
    coordinates: { lat: 18.252, lng: -76.8872 },
    coordinatesLabel: '',
    elevationLabel: 'St. Mary Hills, JA',
    radaStatus: 'Registered St. Mary Apiary',
  },
  contact: {
    whatsappDigits: '16582182734',
    whatsappDisplay: '+1 (658) 218-2734',
    whatsappUrl: 'https://wa.me/16582182734',
    instagramHandle: '@heyhonjamaica',
    instagramUrl: 'https://instagram.com/heyhonjamaica',
    gbpUrl: 'https://share.google/FHRmA4Pl1rRlYEX9P',
    email: 'hello@heyhonjamaica.com',
  },
  currency: {
    code: 'JMD',
    symbol: 'JMD $',
    fxDisplay: {
      USD: 158,
      CAD: 114,
      GBP: 200,
    },
  },
  googleSheetId: '1kVxhtemSDtAVdAZj9w3npNVIenHG2uCHB_8FSwTYMPQ',
  wholesaleMoq: 10,
  freeKingstonThresholdJmd: 6000,
} as const;

export const CURRENT_BATCH = {
  id: 'BATCH-2026-NOV',
  harvestDate: 'November 2026',
  microRegion: "Guy's Hill & Louisiana, St. Mary",
  dominantBlooms: ['Spanish Needle', 'Sorrel', 'Early Logwood', 'Banana Blossom', 'Coconut Palm'],
  pfundColorHex: '#D98A2B',
  colorName: 'Warm Golden Amber',
  tastingNotes: 'Smooth tropical wildflower sweetness with soft citrus and warm caramel notes.',
  crystallizationPace: 'Moderate (Natural Unheated Raw)',
  moistureNote: 'Cold-extracted, unfiltered, zero added sugar, never pasteurized.',
} as const;

export function formatJmd(amount: number): string {
  return `JMD $${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatApproxFx(amountJmd: number, currency: 'USD' | 'CAD' | 'GBP'): string {
  const rate = BRAND.currency.fxDisplay[currency];
  const converted = Math.round((amountJmd / rate) * 100) / 100;
  const symbol = currency === 'GBP' ? '£' : currency === 'CAD' ? 'CA$' : 'US$';
  return `~${symbol}${converted.toFixed(2)}`;
}
