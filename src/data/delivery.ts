export interface DeliveryOption {
  id: string;
  group: 'pickup' | 'courier' | 'knutsford';
  label: string;
  fullLabel: string;
  shortLabel: string;
  feeJmd: number;
  freeOverJmd?: number;
  eta: string;
  details: string;
  requiresStation?: boolean;
  stations?: string[];
}

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  // Free Pickup
  {
    id: 'pickup-northside',
    group: 'pickup',
    label: 'Shop 15, Northside Plaza (Kingston 6)',
    fullLabel: 'Free Pickup: Shop 15, Northside Plaza (Kingston 6)',
    shortLabel: 'Northside Plaza, Kgn 6',
    feeJmd: 0,
    eta: 'Pickup window confirmed via WhatsApp',
    details: 'Shop 15, Northside Plaza, Liguanea, Kingston 6, St. Andrew.',
  },
  {
    id: 'pickup-sovereign',
    group: 'pickup',
    label: 'Sovereign Village (Portmore)',
    fullLabel: 'Free Pickup: Sovereign Village (Portmore)',
    shortLabel: 'Sovereign Village, Portmore',
    feeJmd: 0,
    eta: 'Pickup window confirmed via WhatsApp',
    details: 'Convenient central Portmore pickup at Sovereign Village.',
  },
  {
    id: 'pickup-digicel',
    group: 'pickup',
    label: 'Digicel Head Office (Downtown Kingston)',
    fullLabel: 'Free Pickup: Digicel Head Office (Downtown Kingston)',
    shortLabel: 'Digicel Head Office',
    feeJmd: 0,
    eta: 'Weekday pickup confirmed via WhatsApp',
    details: 'Digicel Head Office, 14 Ocean Boulevard, Downtown Kingston.',
  },
  // Direct Courier
  {
    id: 'courier-portmore',
    group: 'courier',
    label: 'Portmore',
    fullLabel: 'Direct Courier: Portmore',
    shortLabel: 'Portmore',
    feeJmd: 500,
    eta: '1 to 2 business days',
    details: 'Direct doorstep delivery across Portmore.',
  },
  {
    id: 'courier-kingston',
    group: 'courier',
    label: 'Kingston & St. Andrew',
    fullLabel: 'Direct Courier: Kingston & St. Andrew',
    shortLabel: 'Kingston',
    feeJmd: 800,
    freeOverJmd: 6000,
    eta: '1 to 2 business days',
    details: 'Direct delivery across Kingston & St. Andrew. Free on orders JMD $6,000+.',
  },
  {
    id: 'courier-spanish-town',
    group: 'courier',
    label: 'Spanish Town',
    fullLabel: 'Direct Courier: Spanish Town',
    shortLabel: 'Spanish Town',
    feeJmd: 800,
    eta: '1 to 2 business days',
    details: 'Direct delivery across Spanish Town and nearby areas.',
  },
  // Knutsford Express (11 Parishes, JMD $700 flat rate)
  ...[
    { parish: 'Clarendon', stations: ['May Pen'] },
    { parish: 'Hanover', stations: ['Lucea', 'Negril'] },
    { parish: 'Manchester', stations: ['Mandeville'] },
    { parish: 'Portland', stations: ['Port Antonio'] },
    { parish: 'St. Ann', stations: ['Ocho Rios', 'Drax Hall', 'Runaway Bay'] },
    { parish: 'St. Elizabeth', stations: ['Santa Cruz', 'Junction'] },
    { parish: 'St. James', stations: ['Montego Bay (Pier 1 / Sangster Airport)'] },
    { parish: 'St. Mary', stations: ['Ocho Rios / Port Maria'] },
    { parish: 'St. Thomas', stations: ['Morant Bay (Courier Handoff)'] },
    { parish: 'Trelawny', stations: ['Falmouth'] },
    { parish: 'Westmoreland', stations: ['Savanna-la-Mar', 'Negril'] },
  ].map<DeliveryOption>(({ parish, stations }) => ({
    id: `knutsford-${parish.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    group: 'knutsford',
    label: parish,
    fullLabel: `Knutsford Express: ${parish}`,
    shortLabel: `${parish} (Knutsford)`,
    feeJmd: 700,
    eta: 'Next-day station pickup after dispatch',
    details: `Cushioned glass-safe parcel sent to your nearest Knutsford Express hub in ${parish}.`,
    requiresStation: true,
    stations,
  })),
];

export interface IntlRateBand {
  region: 'USA' | 'Canada' | 'UK' | 'Caribbean' | 'Europe_Rest';
  label: string;
  emsBaseUsd: [number, number];
  emsPerExtraKgUsd: [number, number];
  emsDays: string;
  expressBaseUsd: [number, number];
  expressPerExtraKgUsd: [number, number];
  expressDays: string;
  customsNote: string;
}

export const INTL_RATE_BANDS: IntlRateBand[] = [
  {
    region: 'USA',
    label: 'United States',
    emsBaseUsd: [35, 52],
    emsPerExtraKgUsd: [12, 18],
    emsDays: '7–14 business days',
    expressBaseUsd: [65, 92],
    expressPerExtraKgUsd: [18, 26],
    expressDays: '3–5 business days',
    customsNote:
      'Pure sealed honey for personal consumption is generally allowed into the US. Commercial shipments may require FDA Prior Notice; personal gifts under US$800 are typically duty-free.',
  },
  {
    region: 'Canada',
    label: 'Canada',
    emsBaseUsd: [40, 58],
    emsPerExtraKgUsd: [14, 20],
    emsDays: '10–16 business days',
    expressBaseUsd: [70, 102],
    expressPerExtraKgUsd: [20, 28],
    expressDays: '3–6 business days',
    customsNote:
      'Pure honey for personal use (up to 5 kg per person) is generally permitted by CBSA when sealed and declared accurately.',
  },
  {
    region: 'UK',
    label: 'United Kingdom',
    emsBaseUsd: [45, 65],
    emsPerExtraKgUsd: [15, 22],
    emsDays: '10–16 business days',
    expressBaseUsd: [75, 112],
    expressPerExtraKgUsd: [22, 30],
    expressDays: '4–6 business days',
    customsNote:
      'Sealed honey for personal consumption (up to 2 kg) is generally allowed into Great Britain when declared. Local VAT/customs thresholds apply on parcels over £39 (gifts).',
  },
  {
    region: 'Caribbean',
    label: 'Caribbean Islands',
    emsBaseUsd: [30, 48],
    emsPerExtraKgUsd: [10, 16],
    emsDays: '5–10 business days',
    expressBaseUsd: [55, 82],
    expressPerExtraKgUsd: [15, 22],
    expressDays: '2–5 business days',
    customsNote:
      'Import rules for raw agricultural products vary across CARICOM islands; we confirm destination requirements before you pay.',
  },
  {
    region: 'Europe_Rest',
    label: 'Europe & Rest of World',
    emsBaseUsd: [52, 75],
    emsPerExtraKgUsd: [18, 25],
    emsDays: '12–20 business days',
    expressBaseUsd: [85, 130],
    expressPerExtraKgUsd: [25, 35],
    expressDays: '5–8 business days',
    customsNote:
      'EU personal import rules generally allow up to 2 kg of honey for personal consumption. We verify carrier routing & declaration paperwork in your custom quote.',
  },
];

export function calculateLocalDeliveryFee(optionId: string, subtotalJmd: number): {
  feeJmd: number;
  isFreeUnlocked: boolean;
  option?: DeliveryOption;
} {
  const opt = DELIVERY_OPTIONS.find((o) => o.id === optionId);
  if (!opt) return { feeJmd: 0, isFreeUnlocked: false };
  if (opt.feeJmd === 0) return { feeJmd: 0, isFreeUnlocked: false, option: opt };
  if (opt.freeOverJmd && subtotalJmd >= opt.freeOverJmd) {
    return { feeJmd: 0, isFreeUnlocked: true, option: opt };
  }
  return { feeJmd: opt.feeJmd, isFreeUnlocked: false, option: opt };
}
