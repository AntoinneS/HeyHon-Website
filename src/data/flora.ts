export type EcologicalLayer =
  | 'Main Honey Flowers'
  | 'Fruit & Herb Blossoms'
  | 'Surrounding Trees & Crops';

export interface MedicinalProfile {
  primaryBenefit: string;
  keyCompounds: string;
  honeyEffect: string;
  scores: {
    antioxidant: number; // 0-100
    soothing: number; // throat & respiratory soothing
    immuneVitality: number; // natural antimicrobial / enzyme synergy
    mineralDensity: number; // trace minerals (potassium, iron, zinc)
    pollenNutrition: number; // bee pollen amino acids & phytonutrients
  };
}

export interface FloraSpecies {
  id: string;
  commonName: string;
  botanicalName: string;
  layer: EcologicalLayer;
  bloomMonths: number[]; // 1-12
  peakMonths: number[]; // 1-12
  nectarScore: number; // 1-5
  pollenScore: number; // 1-5
  colorHex: string;
  colorImpact: string;
  flavorNotes: string;
  aromaProfile: {
    floral: number;
    fruity: number;
    spiced: number;
    caramel: number;
    brightness: number;
  };
  medicinal: MedicinalProfile;
  mapZone: string;
  x: number;
  y: number;
}

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

export const FULL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export const ST_MARY_FLORA: FloraSpecies[] = [
  {
    id: 'logwood',
    commonName: 'Logwood',
    botanicalName: 'Haematoxylum campechianum',
    layer: 'Main Honey Flowers',
    bloomMonths: [12, 1, 2],
    peakMonths: [1, 2],
    nectarScore: 5,
    pollenScore: 3,
    colorHex: '#F4D078',
    colorImpact: 'Water-clear to pale luminous gold',
    flavorNotes: 'Delicate floral sweetness with a silky, velvety finish. Jamaica’s most celebrated winter nectar flow.',
    aromaProfile: { floral: 95, fruity: 35, spiced: 20, caramel: 25, brightness: 95 },
    medicinal: {
      primaryBenefit: 'Gentle Throat Soothing & Daily Antioxidants',
      keyCompounds: 'Floral flavonoids, phenolic acids, natural hydrogen-peroxide enzymes',
      honeyEffect: 'Nectar produces a clean, gentle winter honey prized in Jamaican households for soothing dry throats and pairing with herbal teas.',
      scores: { antioxidant: 78, soothing: 94, immuneVitality: 88, mineralDensity: 58, pollenNutrition: 72 },
    },
    mapZone: 'North Ridge',
    x: 22,
    y: 20,
  },
  {
    id: 'spanish-needle',
    commonName: 'Spanish Needle',
    botanicalName: 'Bidens pilosa',
    layer: 'Main Honey Flowers',
    bloomMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    peakMonths: [5, 6, 9, 10, 11],
    nectarScore: 5,
    pollenScore: 5,
    colorHex: '#E09F3E',
    colorImpact: 'Warm bright golden',
    flavorNotes: 'Crisp wildflower brightness with classic herbaceous Caribbean aroma. A year-round staple across St. Mary pastures.',
    aromaProfile: { floral: 85, fruity: 40, spiced: 35, caramel: 45, brightness: 82 },
    medicinal: {
      primaryBenefit: 'Natural Immune & Soothing Support',
      keyCompounds: 'Plant antioxidants & abundant wildflower pollen',
      honeyEffect: 'Dense pollen and nectar from Spanish Needle fill the honey with natural antioxidants and calming plant nutrients.',
      scores: { antioxidant: 92, soothing: 82, immuneVitality: 94, mineralDensity: 78, pollenNutrition: 96 },
    },
    mapZone: 'Open Pastures',
    x: 42,
    y: 35,
  },
  {
    id: 'orange',
    commonName: 'Orange Blossom',
    botanicalName: 'Citrus × sinensis',
    layer: 'Main Honey Flowers',
    bloomMonths: [2, 3, 4, 5],
    peakMonths: [2, 3, 4],
    nectarScore: 5,
    pollenScore: 4,
    colorHex: '#F2C55C',
    colorImpact: 'Light radiant gold',
    flavorNotes: 'Intensely fragrant citrus perfume that lifts spring harvests with a clean, sunlit floral finish.',
    aromaProfile: { floral: 92, fruity: 88, spiced: 15, caramel: 20, brightness: 96 },
    medicinal: {
      primaryBenefit: 'Calming Scent & Citrus Antioxidants',
      keyCompounds: 'Natural citrus flower nutrients & light pollen',
      honeyEffect: 'Citrus-blossom nectar adds a calming natural aroma often enjoyed at bedtime or in morning tea.',
      scores: { antioxidant: 84, soothing: 92, immuneVitality: 86, mineralDensity: 60, pollenNutrition: 80 },
    },
    mapZone: 'Orchard Slope',
    x: 68,
    y: 25,
  },
  {
    id: 'lime',
    commonName: 'Lime Blossom',
    botanicalName: 'Citrus aurantiifolia',
    layer: 'Main Honey Flowers',
    bloomMonths: [1, 2, 3, 4, 8, 9],
    peakMonths: [2, 3, 4],
    nectarScore: 4,
    pollenScore: 3,
    colorHex: '#EFC96A',
    colorImpact: 'Pale golden amber',
    flavorNotes: 'Zesty citrus-blossom aromatics bringing a crisp, refreshing top note to early-year extractions.',
    aromaProfile: { floral: 84, fruity: 85, spiced: 18, caramel: 18, brightness: 94 },
    medicinal: {
      primaryBenefit: 'Respiratory Clarity & Antioxidant Lift',
      keyCompounds: 'Citrus bioflavonoids, limonene traces, enzymatic glucose oxidase',
      honeyEffect: 'Bright lime-blossom nectar contributes invigorating floral compounds favored for cold-season tea elixirs.',
      scores: { antioxidant: 82, soothing: 88, immuneVitality: 85, mineralDensity: 58, pollenNutrition: 72 },
    },
    mapZone: 'Orchard Slope',
    x: 76,
    y: 33,
  },
  {
    id: 'grapefruit-tangerine',
    commonName: 'Grapefruit & Tangerine',
    botanicalName: 'Citrus × paradisi',
    layer: 'Main Honey Flowers',
    bloomMonths: [2, 3, 4],
    peakMonths: [2, 3],
    nectarScore: 5,
    pollenScore: 4,
    colorHex: '#F3CA68',
    colorImpact: 'Luminous pale gold',
    flavorNotes: 'Lush orchard citrus blossoms adding sparkling floral aroma and clean spring sweetness.',
    aromaProfile: { floral: 90, fruity: 90, spiced: 16, caramel: 22, brightness: 95 },
    medicinal: {
      primaryBenefit: 'Flavonoid Vitality & Digestive Harmony',
      keyCompounds: 'Naringin, hesperidin, citrus terpenes, bright pollen',
      honeyEffect: 'Enriches spring batches with citrus flavonoids that complement warm water and ginger morning rituals.',
      scores: { antioxidant: 83, soothing: 86, immuneVitality: 84, mineralDensity: 60, pollenNutrition: 78 },
    },
    mapZone: 'Orchard Slope',
    x: 82,
    y: 24,
  },
  {
    id: 'ackee',
    commonName: 'Ackee Blossom',
    botanicalName: 'Blighia sapida',
    layer: 'Main Honey Flowers',
    bloomMonths: [1, 2, 3, 6, 7, 8],
    peakMonths: [2, 3, 7],
    nectarScore: 5,
    pollenScore: 4,
    colorHex: '#D98A2B',
    colorImpact: 'Rich golden amber',
    flavorNotes: 'Heavy white fragrant blossom clusters overflowing with nectar, lending lush tropical body and lingering sweetness.',
    aromaProfile: { floral: 80, fruity: 72, spiced: 28, caramel: 55, brightness: 70 },
    medicinal: {
      primaryBenefit: 'Steady Natural Energy & Trace Phytonutrients',
      keyCompounds: 'Balanced natural sugars, floral phenolics, protein-rich pollen grains',
      honeyEffect: 'Nectar from Jamaica’s national tree creates a smooth, nutrient-dense energy source with high natural pollen vitality.',
      scores: { antioxidant: 84, soothing: 80, immuneVitality: 82, mineralDensity: 76, pollenNutrition: 86 },
    },
    mapZone: "Guy's Hill Groves",
    x: 34,
    y: 28,
  },
  {
    id: 'mango',
    commonName: 'Mango Blossom',
    botanicalName: 'Mangifera indica',
    layer: 'Main Honey Flowers',
    bloomMonths: [1, 2, 3, 4],
    peakMonths: [2, 3],
    nectarScore: 4,
    pollenScore: 3,
    colorHex: '#C67622',
    colorImpact: 'Deep warm amber',
    flavorNotes: 'Orchard fruit depth with softly earthy, full-bodied warmth that anchors early-year wildflower harvests.',
    aromaProfile: { floral: 55, fruity: 86, spiced: 32, caramel: 68, brightness: 54 },
    medicinal: {
      primaryBenefit: 'Rich Natural Antioxidants',
      keyCompounds: 'Mango flower nectar & dark mineral-rich antioxidants',
      honeyEffect: 'Darker orchard nectar brings higher natural antioxidants and trace minerals than pale commercial honeys.',
      scores: { antioxidant: 89, soothing: 78, immuneVitality: 85, mineralDensity: 84, pollenNutrition: 76 },
    },
    mapZone: 'Valley Groves',
    x: 62,
    y: 65,
  },
  {
    id: 'pimento',
    commonName: 'Pimento (Allspice)',
    botanicalName: 'Pimenta dioica',
    layer: 'Main Honey Flowers',
    bloomMonths: [3, 4, 5, 6],
    peakMonths: [4, 5],
    nectarScore: 4,
    pollenScore: 4,
    colorHex: '#B86B1F',
    colorImpact: 'Medium spiced amber',
    flavorNotes: 'Native Jamaican pimento blossoms infuse subtle warm allspice and aromatic woodland complexity.',
    aromaProfile: { floral: 65, fruity: 35, spiced: 94, caramel: 62, brightness: 58 },
    medicinal: {
      primaryBenefit: 'Warming Digestive & Wellness Support',
      keyCompounds: 'Warm allspice aromas & spice-tree antioxidants',
      honeyEffect: 'Natural allspice warmth makes the honey comforting for digestion and sore throats.',
      scores: { antioxidant: 91, soothing: 90, immuneVitality: 93, mineralDensity: 82, pollenNutrition: 84 },
    },
    mapZone: 'Highland Ridge',
    x: 48,
    y: 14,
  },
  {
    id: 'guava',
    commonName: 'Guava',
    botanicalName: 'Psidium guajava',
    layer: 'Main Honey Flowers',
    bloomMonths: [3, 4, 5, 9, 10],
    peakMonths: [3, 4, 5],
    nectarScore: 4,
    pollenScore: 5,
    colorHex: '#D99432',
    colorImpact: 'Golden amber',
    flavorNotes: 'Dense white brush-like stamens offer generous pollen and soft tropical fruit aromatics.',
    aromaProfile: { floral: 72, fruity: 82, spiced: 24, caramel: 42, brightness: 74 },
    medicinal: {
      primaryBenefit: 'Gentle Gut Support & Heavy Pollen',
      keyCompounds: 'Natural plant antioxidants & abundant bee pollen',
      honeyEffect: 'Guava blossoms contribute plenty of natural pollen and gentle gut-soothing plant nutrients.',
      scores: { antioxidant: 88, soothing: 84, immuneVitality: 88, mineralDensity: 78, pollenNutrition: 94 },
    },
    mapZone: 'Hillside Clearings',
    x: 19,
    y: 50,
  },
  {
    id: 'sorrel',
    commonName: 'Sorrel (Roselle)',
    botanicalName: 'Hibiscus sabdariffa',
    layer: 'Main Honey Flowers',
    bloomMonths: [9, 10, 11, 12],
    peakMonths: [10, 11],
    nectarScore: 4,
    pollenScore: 3,
    colorHex: '#B55D1E',
    colorImpact: 'Rich autumnal amber',
    flavorNotes: 'Vital late-year short-day bloom bringing vibrant autumn nectar and subtle berry-tart complexity.',
    aromaProfile: { floral: 76, fruity: 84, spiced: 48, caramel: 60, brightness: 68 },
    medicinal: {
      primaryBenefit: 'Deep Antioxidants & Heart Wellness',
      keyCompounds: 'Sorrel plant antioxidants & rich amber nectar',
      honeyEffect: 'Autumn sorrel nectar fills late-year honey with natural antioxidants and a crisp berry-floral finish.',
      scores: { antioxidant: 94, soothing: 80, immuneVitality: 90, mineralDensity: 82, pollenNutrition: 76 },
    },
    mapZone: 'Farm Terraces',
    x: 81,
    y: 56,
  },
  {
    id: 'banana',
    commonName: 'Banana Blossom',
    botanicalName: 'Musa spp.',
    layer: 'Main Honey Flowers',
    bloomMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    peakMonths: [4, 5, 6, 9, 10],
    nectarScore: 5,
    pollenScore: 3,
    colorHex: '#9E551A',
    colorImpact: 'Deep rich amber',
    flavorNotes: 'Purple blossom bracts brim with dark sweet nectar, deepening color and adding luscious caramel-fruit richness.',
    aromaProfile: { floral: 42, fruity: 76, spiced: 38, caramel: 92, brightness: 36 },
    medicinal: {
      primaryBenefit: 'Mineral-Dense Dark Antioxidant Power',
      keyCompounds: 'Potassium, magnesium, iron traces, dark phenolic pigments',
      honeyEffect: 'Darker banana-blossom nectar significantly raises trace mineral density and antioxidant potency in every spoonful.',
      scores: { antioxidant: 93, soothing: 78, immuneVitality: 86, mineralDensity: 95, pollenNutrition: 74 },
    },
    mapZone: 'Louisiana Valley',
    x: 56,
    y: 78,
  },
  {
    id: 'plantain',
    commonName: 'Plantain Blossom',
    botanicalName: 'Musa × paradisiaca',
    layer: 'Main Honey Flowers',
    bloomMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    peakMonths: [4, 5, 6, 9, 10],
    nectarScore: 4,
    pollenScore: 3,
    colorHex: '#A35A1C',
    colorImpact: 'Deep warm amber',
    flavorNotes: 'Velvety rounded sweetness contributing dark mineral depth and lush viscosity year-round.',
    aromaProfile: { floral: 40, fruity: 70, spiced: 35, caramel: 88, brightness: 38 },
    medicinal: {
      primaryBenefit: 'Trace Minerals & Sustaining Stamina',
      keyCompounds: 'Electrolyte trace minerals, dark amber flavonoids, prebiotic oligosaccharides',
      honeyEffect: 'Adds rich prebiotic oligosaccharides and mineral depth that support digestive balance and natural athletic recovery.',
      scores: { antioxidant: 90, soothing: 78, immuneVitality: 84, mineralDensity: 92, pollenNutrition: 72 },
    },
    mapZone: 'Louisiana Valley',
    x: 46,
    y: 82,
  },
  {
    id: 'guango',
    commonName: 'Guango (Rain Tree)',
    botanicalName: 'Samanea saman',
    layer: 'Main Honey Flowers',
    bloomMonths: [3, 4, 5, 9],
    peakMonths: [3, 4, 5],
    nectarScore: 5,
    pollenScore: 4,
    colorHex: '#C87D24',
    colorImpact: 'Rich velvety amber',
    flavorNotes: 'Pasture-canopy powder-puff pink blossoms producing a prolific, deeply aromatic spring amber nectar flow.',
    aromaProfile: { floral: 78, fruity: 54, spiced: 42, caramel: 74, brightness: 62 },
    medicinal: {
      primaryBenefit: 'Digestive Calm & Living Natural Enzymes',
      keyCompounds: 'Natural flower antioxidants & unheated enzymes',
      honeyEffect: 'Heavy spring Guango nectar keeps natural honey enzymes active for comforting digestive wellness.',
      scores: { antioxidant: 89, soothing: 88, immuneVitality: 87, mineralDensity: 86, pollenNutrition: 82 },
    },
    mapZone: 'Open Pastures',
    x: 29,
    y: 42,
  },
  {
    id: 'christmas-pops',
    commonName: 'Christmas Pops',
    botanicalName: 'Turbina corymbosa',
    layer: 'Main Honey Flowers',
    bloomMonths: [11, 12, 1],
    peakMonths: [11, 12],
    nectarScore: 5,
    pollenScore: 3,
    colorHex: '#ECC163',
    colorImpact: 'Bright holiday pale gold',
    flavorNotes: 'Perfumed cascades of white bell-shaped flowers erupting across St. Mary hedgerows right before Christmas.',
    aromaProfile: { floral: 96, fruity: 44, spiced: 24, caramel: 32, brightness: 92 },
    medicinal: {
      primaryBenefit: 'Soothing Evening Floral Aromatics',
      keyCompounds: 'Clean light-amber floral phenolics, soothing aromatic esters',
      honeyEffect: 'Bees collect only pure floral nectar (never plant seeds), yielding an ultra-smooth, calming winter honey prized for evening tea.',
      scores: { antioxidant: 79, soothing: 93, immuneVitality: 84, mineralDensity: 62, pollenNutrition: 72 },
    },
    mapZone: 'North Ridge',
    x: 13,
    y: 26,
  },
  {
    id: 'avocado',
    commonName: 'Avocado (Jamaican Pear)',
    botanicalName: 'Persea americana',
    layer: 'Main Honey Flowers',
    bloomMonths: [1, 2, 3, 4],
    peakMonths: [1, 2, 3],
    nectarScore: 5,
    pollenScore: 4,
    colorHex: '#8E4917',
    colorImpact: 'Deep mahogany amber',
    flavorNotes: 'Lush buttery depth and rich molasses-like smoothness from dense early-year pear blossoms.',
    aromaProfile: { floral: 46, fruity: 58, spiced: 40, caramel: 95, brightness: 34 },
    medicinal: {
      primaryBenefit: 'Ultra-High Dark Antioxidants & Iron',
      keyCompounds: 'High natural iron, potassium & dark plant antioxidants',
      honeyEffect: 'Avocado blossom honey is known around the world for having some of the highest antioxidant and mineral levels of any honey.',
      scores: { antioxidant: 97, soothing: 82, immuneVitality: 90, mineralDensity: 98, pollenNutrition: 85 },
    },
    mapZone: "Guy's Hill Groves",
    x: 28,
    y: 34,
  },
  {
    id: 'moringa',
    commonName: 'Moringa',
    botanicalName: 'Moringa oleifera',
    layer: 'Main Honey Flowers',
    bloomMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    peakMonths: [3, 4, 5, 6, 9, 10, 11],
    nectarScore: 5,
    pollenScore: 5,
    colorHex: '#E5B24C',
    colorImpact: 'Luminous golden nectar',
    flavorNotes: 'Creamy white fragrant blossoms yielding a remarkably smooth, lightly herbal, clean golden honey.',
    aromaProfile: { floral: 82, fruity: 44, spiced: 38, caramel: 42, brightness: 84 },
    medicinal: {
      primaryBenefit: 'Superfood Amino Acids & Broad-Spectrum Immunity',
      keyCompounds: 'Quercetin, chlorogenic acid, essential amino acids in bee pollen, trace vitamins',
      honeyEffect: 'Known across Jamaica as the Miracle Tree, Moringa nectar and pollen infuse raw honey with remarkable cellular antioxidant and immune vitality.',
      scores: { antioxidant: 96, soothing: 86, immuneVitality: 97, mineralDensity: 90, pollenNutrition: 98 },
    },
    mapZone: 'Hillside Clearings',
    x: 40,
    y: 48,
  },
  {
    id: 'blue-vervain',
    commonName: 'Blue Vervain (Porterweed)',
    botanicalName: 'Stachytarpheta jamaicensis',
    layer: 'Main Honey Flowers',
    bloomMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    peakMonths: [6, 7, 8, 9, 10, 11],
    nectarScore: 5,
    pollenScore: 4,
    colorHex: '#CF8428',
    colorImpact: 'Warm herbal amber',
    flavorNotes: 'Tubular violet-blue roadside spikes visited nonstop by St. Mary bees, adding clean cooling herbal lift.',
    aromaProfile: { floral: 84, fruity: 34, spiced: 62, caramel: 48, brightness: 76 },
    medicinal: {
      primaryBenefit: 'Respiratory Cooling & Calming Botanicals',
      keyCompounds: 'Verbenalin-family iridoids, flavonoids, soothing herbaceous phenolics',
      honeyEffect: 'Celebrated in Jamaican bush-medicine tradition as a cooling respiratory tonic; its nectar lends soothing throat and chest comfort.',
      scores: { antioxidant: 90, soothing: 96, immuneVitality: 92, mineralDensity: 78, pollenNutrition: 84 },
    },
    mapZone: 'Apiary Border',
    x: 54,
    y: 56,
  },
  {
    id: 'gungo-pea',
    commonName: 'Gungo Pea (Pigeon Pea)',
    botanicalName: 'Cajanus cajan',
    layer: 'Main Honey Flowers',
    bloomMonths: [11, 12, 1, 2],
    peakMonths: [11, 12, 1],
    nectarScore: 4,
    pollenScore: 5,
    colorHex: '#E0A13B',
    colorImpact: 'Warm winter gold',
    flavorNotes: 'Bright yellow-and-crimson legume flowers energizing hives during the festive holiday season.',
    aromaProfile: { floral: 74, fruity: 38, spiced: 32, caramel: 54, brightness: 74 },
    medicinal: {
      primaryBenefit: 'Protein-Dense Pollen & Winter Vitality',
      keyCompounds: 'Legume pollen amino acids, isoflavones, iron-rich winter nectar',
      honeyEffect: 'Delivers protein-dense winter bee pollen and gentle restorative nutrients as the cool season peaks.',
      scores: { antioxidant: 83, soothing: 80, immuneVitality: 85, mineralDensity: 82, pollenNutrition: 93 },
    },
    mapZone: 'Farm Terraces',
    x: 86,
    y: 64,
  },

  {
    id: 'coconut',
    commonName: 'Coconut Palm',
    botanicalName: 'Cocos nucifera',
    layer: 'Fruit & Herb Blossoms',
    bloomMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    peakMonths: [3, 4, 5, 6, 7, 8],
    nectarScore: 4,
    pollenScore: 5,
    colorHex: '#DDA142',
    colorImpact: 'Warm golden',
    flavorNotes: 'Year-round golden pollen backbone and mild tropical nectar keeping hives thriving every season.',
    aromaProfile: { floral: 60, fruity: 55, spiced: 20, caramel: 52, brightness: 65 },
    medicinal: {
      primaryBenefit: 'Electrolyte Minerals & Continuous Pollen Supply',
      keyCompounds: 'Potassium, trace electrolytes, nutrient-dense palm pollen',
      honeyEffect: 'Provides a steady year-round foundation of natural minerals and raw bee pollen for everyday stamina.',
      scores: { antioxidant: 80, soothing: 78, immuneVitality: 82, mineralDensity: 88, pollenNutrition: 94 },
    },
    mapZone: 'Hill Crest',
    x: 62,
    y: 18,
  },
  {
    id: 'palm-tree',
    commonName: 'Wild & Royal Palms',
    botanicalName: 'Arecaceae',
    layer: 'Fruit & Herb Blossoms',
    bloomMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    peakMonths: [4, 5, 6, 7],
    nectarScore: 3,
    pollenScore: 5,
    colorHex: '#DCA348',
    colorImpact: 'Soft golden',
    flavorNotes: 'Abundant year-round pollen nutrition fueling strong St. Mary colonies and natural pollen-rich texture.',
    aromaProfile: { floral: 55, fruity: 45, spiced: 18, caramel: 46, brightness: 64 },
    medicinal: {
      primaryBenefit: 'Rich Bee-Pollen Amino Acid Profile',
      keyCompounds: 'Complete botanical pollen proteins, B-vitamin precursors, carotenoids',
      honeyEffect: 'Because we never ultra-filter, micro-grains of St. Mary palm pollen stay suspended in every jar.',
      scores: { antioxidant: 76, soothing: 74, immuneVitality: 80, mineralDensity: 78, pollenNutrition: 95 },
    },
    mapZone: 'Hill Crest',
    x: 73,
    y: 16,
  },
  {
    id: 'otaheite-apple',
    commonName: 'Otaheite Apple',
    botanicalName: 'Syzygium malaccense',
    layer: 'Fruit & Herb Blossoms',
    bloomMonths: [2, 3, 4, 6, 7],
    peakMonths: [2, 3, 4],
    nectarScore: 4,
    pollenScore: 4,
    colorHex: '#CC7A28',
    colorImpact: 'Warm copper amber',
    flavorNotes: 'Showy crimson stamen blossoms carpet the ground in spring, adding delicate rose-apple fruity aromatics.',
    aromaProfile: { floral: 78, fruity: 86, spiced: 26, caramel: 48, brightness: 72 },
    medicinal: {
      primaryBenefit: 'Anthocyanin-Rich Crimson Stamen Pollen',
      keyCompounds: 'Anthocyanins, flavonoids, refreshing rose-apple phenolics',
      honeyEffect: 'Vibrant crimson stamens contribute antioxidant flavonoids and light digestive-soothing fruit aromatics.',
      scores: { antioxidant: 87, soothing: 82, immuneVitality: 84, mineralDensity: 74, pollenNutrition: 86 },
    },
    mapZone: 'Orchard Slope',
    x: 85,
    y: 42,
  },
  {
    id: 'blue-mahoe',
    commonName: 'Blue Mahoe',
    botanicalName: 'Talipariti elatum',
    layer: 'Fruit & Herb Blossoms',
    bloomMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    peakMonths: [4, 5, 6, 7],
    nectarScore: 4,
    pollenScore: 4,
    colorHex: '#D58429',
    colorImpact: 'Rich copper-gold',
    flavorNotes: 'Jamaica’s National Tree opens color-shifting golden-to-crimson hibiscus blooms rich in hillside nectar.',
    aromaProfile: { floral: 84, fruity: 50, spiced: 30, caramel: 54, brightness: 70 },
    medicinal: {
      primaryBenefit: 'Soothing Flower Oils & Chest Comfort',
      keyCompounds: 'Natural hibiscus flower nutrients & calming nectar',
      honeyEffect: 'Traditionally associated with throat and chest comfort in Jamaica, its blossoms enrich our honey’s smooth soothing feel.',
      scores: { antioxidant: 86, soothing: 94, immuneVitality: 85, mineralDensity: 78, pollenNutrition: 82 },
    },
    mapZone: 'Highland Ridge',
    x: 42,
    y: 18,
  },
  {
    id: 'tamarind',
    commonName: 'Tamarind',
    botanicalName: 'Tamarindus indica',
    layer: 'Fruit & Herb Blossoms',
    bloomMonths: [4, 5, 6, 7],
    peakMonths: [5, 6],
    nectarScore: 4,
    pollenScore: 4,
    colorHex: '#C27321',
    colorImpact: 'Tangy golden amber',
    flavorNotes: 'Delicate yellow-and-red orchid-like clusters yielding subtly tangy, full-bodied summer nectar.',
    aromaProfile: { floral: 68, fruity: 82, spiced: 42, caramel: 64, brightness: 74 },
    medicinal: {
      primaryBenefit: 'Digestive Vitality & Tangy Antioxidants',
      keyCompounds: 'Natural fruit flower antioxidants & trace magnesium',
      honeyEffect: 'Summer tamarind blossoms add bright antioxidant richness and gentle digestive support.',
      scores: { antioxidant: 88, soothing: 82, immuneVitality: 85, mineralDensity: 84, pollenNutrition: 82 },
    },
    mapZone: 'Valley Groves',
    x: 70,
    y: 60,
  },
  {
    id: 'cerasee',
    commonName: 'Cerasee',
    botanicalName: 'Momordica charantia',
    layer: 'Fruit & Herb Blossoms',
    bloomMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    peakMonths: [5, 6, 7, 8, 9, 10],
    nectarScore: 3,
    pollenScore: 4,
    colorHex: '#CE862A',
    colorImpact: 'Herbaceous warm amber',
    flavorNotes: 'Bright yellow morning blossoms along sun-drenched St. Mary fencelines adding subtle tonic complexity (never bitter in the honey).',
    aromaProfile: { floral: 64, fruity: 32, spiced: 58, caramel: 52, brightness: 68 },
    medicinal: {
      primaryBenefit: 'Traditional Cleansing Plant Nutrients',
      keyCompounds: 'Plant antioxidants & colorful flower pollen',
      honeyEffect: 'Beloved across Jamaica as a wellness vine; its floral pollen adds micro-nutrients and antioxidant fullness without bitterness.',
      scores: { antioxidant: 92, soothing: 78, immuneVitality: 93, mineralDensity: 80, pollenNutrition: 88 },
    },
    mapZone: 'Hillside Clearings',
    x: 14,
    y: 60,
  },
  {
    id: 'soursop',
    commonName: 'Soursop',
    botanicalName: 'Annona muricata',
    layer: 'Fruit & Herb Blossoms',
    bloomMonths: [3, 4, 5, 8, 9, 10],
    peakMonths: [4, 5, 9],
    nectarScore: 2,
    pollenScore: 3,
    colorHex: '#D79538',
    colorImpact: 'Soft tropical gold',
    flavorNotes: 'Fragrant cream-green hillside blossoms growing right beside our family apiary groves.',
    aromaProfile: { floral: 70, fruity: 76, spiced: 24, caramel: 46, brightness: 70 },
    medicinal: {
      primaryBenefit: 'Restful Wellness & Antioxidant Heritage',
      keyCompounds: 'Annonaceae floral aromatics, calming phytonutrients, trace antioxidants',
      honeyEffect: 'A treasured Jamaican wellness tree whose serene hillside orchard surroundings enrich our soothing evening-tea honey.',
      scores: { antioxidant: 84, soothing: 92, immuneVitality: 84, mineralDensity: 72, pollenNutrition: 74 },
    },
    mapZone: "Guy's Hill Groves",
    x: 22,
    y: 42,
  },
  {
    id: 'june-plum',
    commonName: 'June Plum',
    botanicalName: 'Spondias dulcis',
    layer: 'Fruit & Herb Blossoms',
    bloomMonths: [3, 4, 5, 6],
    peakMonths: [4, 5],
    nectarScore: 3,
    pollenScore: 4,
    colorHex: '#DFA33E',
    colorImpact: 'Bright orchard gold',
    flavorNotes: 'Tiny fragrant star-like white blossoms bursting across spring yards with crisp orchard pollen.',
    aromaProfile: { floral: 72, fruity: 80, spiced: 22, caramel: 38, brightness: 82 },
    medicinal: {
      primaryBenefit: 'Vitamin-Rich Orchard Pollen & Crisp Vitality',
      keyCompounds: 'Ascorbate-associated flavonoids, spring orchard pollen',
      honeyEffect: 'Adds fresh spring pollen diversity and crisp antioxidant brightness to mid-year extractions.',
      scores: { antioxidant: 82, soothing: 78, immuneVitality: 84, mineralDensity: 72, pollenNutrition: 84 },
    },
    mapZone: 'Orchard Slope',
    x: 78,
    y: 48,
  },
  {
    id: 'star-apple',
    commonName: 'Star Apple',
    botanicalName: 'Chrysophyllum cainito',
    layer: 'Fruit & Herb Blossoms',
    bloomMonths: [7, 8, 9, 10],
    peakMonths: [8, 9],
    nectarScore: 3,
    pollenScore: 3,
    colorHex: '#C87C26',
    colorImpact: 'Silky golden amber',
    flavorNotes: 'Bronze-backed canopy leaves shelter sweet late-summer clusters visited by foraging honeybees.',
    aromaProfile: { floral: 74, fruity: 72, spiced: 26, caramel: 56, brightness: 64 },
    medicinal: {
      primaryBenefit: 'Natural Antioxidants & Smooth Throat Feel',
      keyCompounds: 'Late-summer star apple flower antioxidants',
      honeyEffect: 'Provides soothing antioxidant richness during Jamaica’s warm late-summer blooming window.',
      scores: { antioxidant: 86, soothing: 85, immuneVitality: 83, mineralDensity: 76, pollenNutrition: 76 },
    },
    mapZone: 'Valley Groves',
    x: 64,
    y: 74,
  },
  {
    id: 'pumpkin',
    commonName: 'Jamaican Pumpkin',
    botanicalName: 'Cucurbita moschata',
    layer: 'Fruit & Herb Blossoms',
    bloomMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    peakMonths: [5, 6, 9, 10, 11],
    nectarScore: 3,
    pollenScore: 5,
    colorHex: '#E0A43B',
    colorImpact: 'Rich yellow-gold',
    flavorNotes: 'Large sunlit morning blossoms packed with protein-rich golden pollen and soft gourd-blossom nectar.',
    aromaProfile: { floral: 62, fruity: 42, spiced: 22, caramel: 48, brightness: 70 },
    medicinal: {
      primaryBenefit: 'Carotenoid-Dense Golden Pollen',
      keyCompounds: 'Beta-carotene pollen pigments, zinc traces, amino acids',
      honeyEffect: 'Large golden pumpkin blossoms infuse raw unfiltered honey with beta-carotene-rich bee pollen.',
      scores: { antioxidant: 84, soothing: 76, immuneVitality: 83, mineralDensity: 78, pollenNutrition: 95 },
    },
    mapZone: 'Farm Terraces',
    x: 73,
    y: 74,
  },
  {
    id: 'sweet-potato',
    commonName: 'Sweet Potato Vine',
    botanicalName: 'Ipomoea batatas',
    layer: 'Fruit & Herb Blossoms',
    bloomMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    peakMonths: [5, 6, 10, 11],
    nectarScore: 3,
    pollenScore: 3,
    colorHex: '#E3B04B',
    colorImpact: 'Light golden',
    flavorNotes: 'Delicate morning-glory-like blooms providing gentle meadow nectar across St. Mary hillside plots.',
    aromaProfile: { floral: 74, fruity: 38, spiced: 15, caramel: 35, brightness: 78 },
    medicinal: {
      primaryBenefit: 'Gentle Prebiotic & Antioxidant Support',
      keyCompounds: 'Caffeic acid derivatives, gentle floral flavonoids',
      honeyEffect: 'Contributes light, easily digested wildflower nectar with mild soothing antioxidants.',
      scores: { antioxidant: 78, soothing: 82, immuneVitality: 78, mineralDensity: 68, pollenNutrition: 74 },
    },
    mapZone: 'Farm Terraces',
    x: 86,
    y: 74,
  },
  {
    id: 'hibiscus',
    commonName: 'Hibiscus',
    botanicalName: 'Hibiscus rosa-sinensis',
    layer: 'Fruit & Herb Blossoms',
    bloomMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    peakMonths: [4, 5, 6, 7, 8],
    nectarScore: 3,
    pollenScore: 4,
    colorHex: '#D68E2E',
    colorImpact: 'Bright amber',
    flavorNotes: 'Vibrant tropical blooms lining the apiary border, contributing trace floral aromatics and rich pollen.',
    aromaProfile: { floral: 84, fruity: 58, spiced: 22, caramel: 38, brightness: 76 },
    medicinal: {
      primaryBenefit: 'Floral Anthocyanins & Cooling Antioxidants',
      keyCompounds: 'Anthocyanin pigments, hibiscus flavonoids, rich golden pollen',
      honeyEffect: 'Adds colorful floral antioxidants traditionally valued for cooling wellness infusions.',
      scores: { antioxidant: 86, soothing: 84, immuneVitality: 82, mineralDensity: 70, pollenNutrition: 84 },
    },
    mapZone: 'Apiary Border',
    x: 59,
    y: 43,
  },
  {
    id: 'bougainvillea',
    commonName: 'Bougainvillea',
    botanicalName: 'Bougainvillea spp.',
    layer: 'Fruit & Herb Blossoms',
    bloomMonths: [12, 1, 2, 3, 4, 5],
    peakMonths: [1, 2, 3, 4],
    nectarScore: 2,
    pollenScore: 2,
    colorHex: '#E5B55A',
    colorImpact: 'Light warm gold',
    flavorNotes: 'Dry-season magenta and gold bracts sheltering tiny nectar-bearing inner white flowers.',
    aromaProfile: { floral: 72, fruity: 32, spiced: 16, caramel: 28, brightness: 80 },
    medicinal: {
      primaryBenefit: 'Traditional Cough-Soothing Floral Notes',
      keyCompounds: 'Betalain botanical pigments, light dry-season floral phenolics',
      honeyEffect: 'Long loved in Caribbean tea traditions for gentle respiratory comfort during dry dusty seasons.',
      scores: { antioxidant: 76, soothing: 86, immuneVitality: 76, mineralDensity: 62, pollenNutrition: 66 },
    },
    mapZone: 'Apiary Border',
    x: 37,
    y: 57,
  },
  {
    id: 'nutmeg',
    commonName: 'Nutmeg',
    botanicalName: 'Myristica fragrans',
    layer: 'Fruit & Herb Blossoms',
    bloomMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    peakMonths: [3, 4, 5, 6, 7],
    nectarScore: 2,
    pollenScore: 3,
    colorHex: '#C9822B',
    colorImpact: 'Warm spiced gold',
    flavorNotes: 'Fragrant pale-yellow hillside blossoms contributing subtle natural spice notes.',
    aromaProfile: { floral: 52, fruity: 36, spiced: 90, caramel: 58, brightness: 52 },
    medicinal: {
      primaryBenefit: 'Warming Digestive & Restful Notes',
      keyCompounds: 'Warm spice-tree flower aromas & natural oils',
      honeyEffect: 'Adds subtle warming spice aromas traditionally paired with warm milk or chamomile before rest.',
      scores: { antioxidant: 84, soothing: 88, immuneVitality: 82, mineralDensity: 76, pollenNutrition: 74 },
    },
    mapZone: 'Highland Ridge',
    x: 35,
    y: 14,
  },
  {
    id: 'tobacco',
    commonName: 'Wild Hillside Tobacco',
    botanicalName: 'Nicotiana tabacum',
    layer: 'Fruit & Herb Blossoms',
    bloomMonths: [12, 1, 2, 3, 4],
    peakMonths: [1, 2, 3],
    nectarScore: 3,
    pollenScore: 2,
    colorHex: '#B86E22',
    colorImpact: 'Deep golden amber',
    flavorNotes: 'Pale tubular flowers visited on cool winter mornings, adding subtle earthy herbaceous complexity.',
    aromaProfile: { floral: 46, fruity: 24, spiced: 68, caramel: 74, brightness: 42 },
    medicinal: {
      primaryBenefit: 'Rich Natural Minerals & Plant Depth',
      keyCompounds: 'Plant antioxidants & deeper amber minerals',
      honeyEffect: 'Occasional winter visits add trace plant antioxidants and deeper earthy richness to wildflower blends.',
      scores: { antioxidant: 82, soothing: 70, immuneVitality: 78, mineralDensity: 82, pollenNutrition: 66 },
    },
    mapZone: 'North Ridge',
    x: 15,
    y: 35,
  },
  {
    id: 'cocoa',
    commonName: 'Cocoa (Cacao)',
    botanicalName: 'Theobroma cacao',
    layer: 'Surrounding Trees & Crops',
    bloomMonths: [10, 11, 12, 1, 2, 5, 6, 7],
    peakMonths: [11, 12, 6],
    nectarScore: 1,
    pollenScore: 1,
    colorHex: '#8F4F1D',
    colorImpact: 'Shaded valley greenery',
    flavorNotes: 'Pollinated by tiny midges rather than honeybees, St. Mary cocoa groves form the pesticide-free shade canopy surrounding our hives.',
    aromaProfile: { floral: 30, fruity: 45, spiced: 55, caramel: 80, brightness: 30 },
    medicinal: {
      primaryBenefit: 'Pesticide-Free Clean Ecosystem Guarantee',
      keyCompounds: 'Chemical-free forest canopy preserving pure bee propolis & resin',
      honeyEffect: 'Healthy shade-grown cocoa valleys allow bees to harvest clean resin for natural propolis without industrial spray drift.',
      scores: { antioxidant: 80, soothing: 76, immuneVitality: 84, mineralDensity: 76, pollenNutrition: 64 },
    },
    mapZone: 'Louisiana Valley',
    x: 32,
    y: 74,
  },
  {
    id: 'breadfruit',
    commonName: 'Breadfruit',
    botanicalName: 'Artocarpus altilis',
    layer: 'Surrounding Trees & Crops',
    bloomMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    peakMonths: [7, 8, 9, 10],
    nectarScore: 1,
    pollenScore: 2,
    colorHex: '#C98A32',
    colorImpact: 'Lush hillside canopy',
    flavorNotes: 'Iconic St. Mary canopy trees shielding our apiaries from wind while preserving fertile valley humidity.',
    aromaProfile: { floral: 35, fruity: 50, spiced: 25, caramel: 50, brightness: 45 },
    medicinal: {
      primaryBenefit: 'Clean Propolis Resin & Thriving Colony Habitat',
      keyCompounds: 'Natural tree sap resins for antimicrobial bee propolis',
      honeyEffect: 'Provides natural tree resins that bees transform into antimicrobial propolis lining every raw honeycomb cell.',
      scores: { antioxidant: 76, soothing: 74, immuneVitality: 85, mineralDensity: 72, pollenNutrition: 68 },
    },
    mapZone: "Guy's Hill Groves",
    x: 23,
    y: 66,
  },
  {
    id: 'jackfruit',
    commonName: 'Jackfruit',
    botanicalName: 'Artocarpus heterophyllus',
    layer: 'Surrounding Trees & Crops',
    bloomMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    peakMonths: [3, 4, 5, 6, 7],
    nectarScore: 1,
    pollenScore: 2,
    colorHex: '#C7862D',
    colorImpact: 'Orchard biodiversity',
    flavorNotes: 'Deep-rooted tropical fruit trees thriving right alongside our wildflower forage corridors.',
    aromaProfile: { floral: 38, fruity: 72, spiced: 22, caramel: 54, brightness: 48 },
    medicinal: {
      primaryBenefit: 'Natural Resin & Biodiverse Forage Sanctuary',
      keyCompounds: 'Antimicrobial sap resins, micro-pollen biodiversity',
      honeyEffect: 'Supports rich tree-resin propolis production and clean year-round forage corridors around our St. Mary hives.',
      scores: { antioxidant: 75, soothing: 72, immuneVitality: 82, mineralDensity: 70, pollenNutrition: 68 },
    },
    mapZone: 'Valley Groves',
    x: 68,
    y: 52,
  },
  {
    id: 'naseberry',
    commonName: 'Naseberry (Sapodilla)',
    botanicalName: 'Manilkara zapota',
    layer: 'Surrounding Trees & Crops',
    bloomMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    peakMonths: [3, 4, 5, 6],
    nectarScore: 2,
    pollenScore: 2,
    colorHex: '#B87225',
    colorImpact: 'Warm brown-sugar richness',
    flavorNotes: 'Small bell-shaped cream flowers thriving in lush St. Mary orchards with rich malty hillside shade.',
    aromaProfile: { floral: 52, fruity: 74, spiced: 28, caramel: 78, brightness: 50 },
    medicinal: {
      primaryBenefit: 'Clean Tree Canopy & Natural Propolis',
      keyCompounds: 'Natural antioxidants & tree resins that protect the hive',
      honeyEffect: 'Supports healthy orchards and provides natural tree resins that help protect bees naturally.',
      scores: { antioxidant: 80, soothing: 76, immuneVitality: 82, mineralDensity: 74, pollenNutrition: 70 },
    },
    mapZone: 'Valley Groves',
    x: 56,
    y: 66,
  },
  {
    id: 'sugarcane',
    commonName: 'Sugarcane',
    botanicalName: 'Saccharum officinarum',
    layer: 'Surrounding Trees & Crops',
    bloomMonths: [12, 1, 2, 3, 4, 5],
    peakMonths: [1, 2, 3, 4],
    nectarScore: 1,
    pollenScore: 1,
    colorHex: '#D49B3A',
    colorImpact: 'Surrounding valley landscape',
    flavorNotes: 'Part of St. Mary’s storied landscape, yet Hey Hon never feeds sugar syrup; our bees forage wild floral nectar only.',
    aromaProfile: { floral: 25, fruity: 35, spiced: 20, caramel: 65, brightness: 45 },
    medicinal: {
      primaryBenefit: 'Zero Cane-Syrup Adulteration Promise',
      keyCompounds: '100% pure flower honey with living enzymes, never stretched with sugar',
      honeyEffect: 'Because we never stretch honey with cane sugar, every jar keeps its pure natural balance and living enzymes.',
      scores: { antioxidant: 72, soothing: 72, immuneVitality: 80, mineralDensity: 68, pollenNutrition: 60 },
    },
    mapZone: 'Lower Valley',
    x: 40,
    y: 90,
  },
  {
    id: 'irish-potato',
    commonName: 'Irish Potato',
    botanicalName: 'Solanum tuberosum',
    layer: 'Surrounding Trees & Crops',
    bloomMonths: [11, 12, 1, 2, 3, 4],
    peakMonths: [1, 2, 3],
    nectarScore: 1,
    pollenScore: 2,
    colorHex: '#D8A446',
    colorImpact: 'Cool highland elevation',
    flavorNotes: 'Signature Guy’s Hill cool-elevation agriculture reflecting the crisp, unpolluted mountain air around our apiaries.',
    aromaProfile: { floral: 40, fruity: 25, spiced: 20, caramel: 35, brightness: 65 },
    medicinal: {
      primaryBenefit: 'Cool Mountain Air & Fresh Enzyme Preservation',
      keyCompounds: 'Cool Guy’s Hill elevation keeps raw honey naturally fresh',
      honeyEffect: 'Cooler Guy’s Hill hillside air naturally protects heat-sensitive nutrients and delicate flower aroma inside the comb.',
      scores: { antioxidant: 74, soothing: 76, immuneVitality: 80, mineralDensity: 72, pollenNutrition: 68 },
    },
    mapZone: "Guy's Hill Highlands",
    x: 14,
    y: 14,
  },
];

export function blendHexColors(hexes: { hex: string; weight: number }[]): string {
  if (!hexes.length) return '#D98A2B';
  let r = 0;
  let g = 0;
  let b = 0;
  let total = 0;
  for (const { hex, weight } of hexes) {
    const clean = hex.replace('#', '');
    const nr = parseInt(clean.slice(0, 2), 16);
    const ng = parseInt(clean.slice(2, 4), 16);
    const nb = parseInt(clean.slice(4, 6), 16);
    r += nr * weight;
    g += ng * weight;
    b += nb * weight;
    total += weight;
  }
  if (total === 0) return '#D98A2B';
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n / total))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function getMonthBloomSummary(month: number) {
  const active = ST_MARY_FLORA.filter((f) => f.bloomMonths.includes(month));
  const peak = active.filter((f) => f.peakMonths.includes(month));
  const nectarDrivers = active.filter((f) => f.layer === 'Main Honey Flowers');
  const src = nectarDrivers.length ? nectarDrivers : active;

  const colorHex = blendHexColors(
    src.map((f) => ({
      hex: f.colorHex,
      weight: f.nectarScore * (f.peakMonths.includes(month) ? 2.2 : 1),
    }))
  );

  const avgAroma = (key: keyof FloraSpecies['aromaProfile']) => {
    const sumW = src.reduce((acc, f) => acc + f.nectarScore * (f.peakMonths.includes(month) ? 1.8 : 1), 0);
    if (!sumW) return 50;
    const weighted = src.reduce(
      (acc, f) => acc + f.aromaProfile[key] * f.nectarScore * (f.peakMonths.includes(month) ? 1.8 : 1),
      0
    );
    return Math.round(weighted / sumW);
  };

  const avgMed = (key: keyof MedicinalProfile['scores']) => {
    const medSrc = active.filter((f) => f.layer !== 'Surrounding Trees & Crops');
    const pool = medSrc.length ? medSrc : active;
    const sumW = pool.reduce(
      (acc, f) => acc + (f.nectarScore + f.pollenScore) * (f.peakMonths.includes(month) ? 1.7 : 1),
      0
    );
    if (!sumW) return 75;
    const weighted = pool.reduce(
      (acc, f) =>
        acc + f.medicinal.scores[key] * (f.nectarScore + f.pollenScore) * (f.peakMonths.includes(month) ? 1.7 : 1),
      0
    );
    return Math.round(weighted / sumW);
  };

  let pfundLabel = 'Warm Golden Amber';
  let seasonalMedicinalNote = 'Rich in natural antioxidants, living enzymes, and raw flower pollen.';

  if (month === 1 || month === 2) {
    pfundLabel = 'Pale Luminous Gold (Logwood, Avocado & Citrus)';
    seasonalMedicinalNote = 'Soothing winter blossoms paired with mineral-rich avocado and citrus flower antioxidants.';
  } else if (month === 3 || month === 4) {
    pfundLabel = 'Radiant Orchard Gold (Citrus, Guango, Moringa & Pimento)';
    seasonalMedicinalNote = 'Great everyday immune and digestion support from Moringa pollen, Citrus, and warming Pimento.';
  } else if (month === 5 || month === 6) {
    pfundLabel = 'Bright Wildflower Amber (Spanish Needle, Pimento & Moringa)';
    seasonalMedicinalNote = 'Peak bee pollen richness and wildflower antioxidants from Spanish Needle, Guava, Moringa, and Blue Mahoe.';
  } else if (month === 7 || month === 8) {
    pfundLabel = 'Rich Tropical Amber (Ackee, Blue Vervain & Banana)';
    seasonalMedicinalNote = 'Cooling throat comfort from Blue Vervain paired with mineral-rich banana blossom nectar.';
  } else if (month === 9 || month === 10 || month === 11) {
    pfundLabel = 'Autumn Spiced Amber (Sorrel, Spanish Needle & Blue Vervain)';
    seasonalMedicinalNote = 'High natural antioxidants driven by autumn Sorrel, Moringa, and Spanish Needle pollen.';
  } else if (month === 12) {
    pfundLabel = 'Early Winter Gold (Christmas Pops, Logwood & Gungo Pea)';
    seasonalMedicinalNote = 'Smooth winter floral nectar and nourishing pollen, ideal for warm evening teas.';
  }

  return {
    month,
    monthName: FULL_MONTHS[month - 1],
    activeCount: active.length,
    peakCount: peak.length,
    nectarDrivers,
    peakSpecies: peak,
    colorHex,
    pfundLabel,
    seasonalMedicinalNote,
    profile: {
      floral: avgAroma('floral'),
      fruity: avgAroma('fruity'),
      spiced: avgAroma('spiced'),
      caramel: avgAroma('caramel'),
      brightness: avgAroma('brightness'),
    },
    medicinal: {
      antioxidant: avgMed('antioxidant'),
      soothing: avgMed('soothing'),
      immuneVitality: avgMed('immuneVitality'),
      mineralDensity: avgMed('mineralDensity'),
      pollenNutrition: avgMed('pollenNutrition'),
    },
  };
}
