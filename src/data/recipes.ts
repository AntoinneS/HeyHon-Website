export interface RecipeItem {
  slug: string;
  title: string;
  category: 'Coffee & Matcha' | 'Savory' | 'Jamaican Pairings' | 'Wellness';
  badge: string;
  prepTimeIso: string;
  prepTimeLabel: string;
  servings: string;
  image: string;
  summary: string;
  tip: string;
  ingredients: string[];
  steps: string[];
  recommendedSku: 'HH-RAW-266' | 'HH-RAW-500';
}

export const RECIPES: RecipeItem[] = [
  {
    slug: 'iced-strawberry-matcha-honey-cloud',
    title: 'Iced Strawberry Matcha with Raw Honey Cloud Foam',
    category: 'Coffee & Matcha',
    badge: 'Aesthetic Sips',
    prepTimeIso: 'PT7M',
    prepTimeLabel: '7 mins',
    servings: '1 tall glass',
    image: '/media/matcha-latte.webp',
    summary:
      'Replace refined syrups with cold-extracted St. Mary wildflower honey for an earthy, velvety layered matcha ritual.',
    tip: 'Whisk Hey Hon into warm (never boiling) water or chilled cream so living wildflower enzymes and aroma stay vibrant.',
    ingredients: [
      '2 tbsp Hey Hon Raw St. Mary Wildflower Honey',
      '1 tsp ceremonial-grade matcha powder',
      '2 oz warm water (~75°C / 167°F)',
      '1/4 cup fresh strawberries, finely mashed or pureed',
      '3/4 cup oat milk (or milk of choice)',
      '2 tbsp heavy cream or thick coconut cream',
      'Ice cubes',
    ],
    steps: [
      'Whisk matcha powder with warm water until smooth and frothy.',
      'In a chilled bowl, whisk cream with 1 tbsp Hey Hon Raw Honey until soft, glossy cloud peaks form.',
      'Spoon strawberry puree into the base of a tall glass and fill generously with ice.',
      'Pour in oat milk stirred with the remaining 1 tbsp raw honey.',
      'Float the vibrant green matcha slowly over the milk to create distinct layers.',
      'Crown with honey cloud foam and serve immediately.',
    ],
    recommendedSku: 'HH-RAW-266',
  },
  {
    slug: 'raw-honey-shaken-espresso',
    title: 'Raw Honey & Sea Salt Shaken Espresso',
    category: 'Coffee & Matcha',
    badge: 'Morning Rituals',
    prepTimeIso: 'PT5M',
    prepTimeLabel: '5 mins',
    servings: '1 glass',
    image: '/media/shaken-espresso.webp',
    summary:
      'Freshly pulled Blue Mountain espresso melts St. Mary raw wildflower honey instantly before being shaken hard over ice for café-grade crema.',
    tip: 'Stir the honey with espresso first, then add ice immediately so the temperature drops right after dissolving.',
    ingredients: [
      '1 generous tbsp Hey Hon Raw St. Mary Wildflower Honey',
      '2 shots freshly pulled espresso (Jamaican Blue Mountain shines here)',
      'Splash of cold oat or whole milk',
      '1 pinch flaky sea salt',
      'Generous handful of ice cubes',
    ],
    steps: [
      'Spoon Hey Hon Raw Honey into the bottom of a cocktail shaker or tight-lidded mason jar.',
      'Pour hot freshly pulled espresso directly over the honey and swirl 5 seconds until dissolved.',
      'Pack the shaker with ice and add a pinch of flaky sea salt.',
      'Shake vigorously for 15 seconds until deeply chilled and richly aerated.',
      'Pour everything into a chilled glass and finish with a ribbon of cold milk.',
    ],
    recommendedSku: 'HH-RAW-500',
  },
  {
    slug: 'chili-raw-honey-ricotta-sourdough',
    title: 'Chili Raw Honey & Whipped Ricotta Artisan Toast',
    category: 'Savory',
    badge: 'Savory Cravings',
    prepTimeIso: 'PT10M',
    prepTimeLabel: '10 mins',
    servings: '2 toasts',
    image: '/media/ricotta-toast.webp',
    summary:
      'Creamy whipped ricotta over crisp olive-oil sourdough, finished with Scotch bonnet or red-pepper infused Hey Hon Raw Honey and fresh Jamaican thyme.',
    tip: 'For an unmistakable Jamaican twist, infuse 2 tbsp of Hey Hon with a sliver of deseeded Scotch bonnet for 10 minutes before drizzling.',
    ingredients: [
      '2 tbsp Hey Hon Raw St. Mary Wildflower Honey',
      '1 pinch crushed red pepper flakes (or a thin sliver of Scotch bonnet)',
      '2 thick slices artisan sourdough bread',
      '1/2 cup whole-milk ricotta cheese',
      'Fresh figs, ripe mango slices, or roasted pear',
      'Flaky sea salt & fresh Jamaican thyme leaves',
    ],
    steps: [
      'Stir chili flakes (or Scotch bonnet sliver) into Hey Hon Raw Honey and rest 10 minutes.',
      'Pan-toast sourdough in a drizzle of olive oil until golden and crisp.',
      'Whip ricotta with a fork until airy, then spread generously edge to edge.',
      'Arrange seasonal fruit over the ricotta.',
      'Drizzle the chili-infused raw honey liberally across the toast.',
      'Finish with flaky sea salt and fresh thyme leaves.',
    ],
    recommendedSku: 'HH-RAW-266',
  },
  {
    slug: 'ginger-lime-pimento-wellness-elixir',
    title: 'St. Mary Ginger, Lime & Raw Honey Immunity Elixir',
    category: 'Wellness',
    badge: 'Jamaican Wellness',
    prepTimeIso: 'PT8M',
    prepTimeLabel: '8 mins',
    servings: '2 mugs',
    image: '/media/bee-forage.webp',
    summary:
      'A soothing Jamaican hillside tonic pairing crushed fresh ginger, bruised pimento berries, fresh lime juice, and unheated St. Mary raw honey.',
    tip: 'Always let ginger tea cool below 45°C (drinkably warm) before stirring in raw honey so its natural enzymes remain active.',
    ingredients: [
      '2 tbsp Hey Hon Raw St. Mary Wildflower Honey',
      '2 inches fresh Jamaican ginger root, sliced and lightly crushed',
      '3 whole Jamaican pimento (allspice) berries, lightly cracked',
      'Juice of 1 fresh Jamaican lime',
      '2 cups filtered water',
    ],
    steps: [
      'Simmer sliced ginger and cracked pimento berries in water for 6–8 minutes.',
      'Strain into two mugs and let cool for 3–4 minutes until pleasantly warm (not boiling).',
      'Squeeze in fresh lime juice and stir in 1 tbsp Hey Hon Raw Honey per mug.',
      'Sip slowly morning or night.',
    ],
    recommendedSku: 'HH-RAW-500',
  },
];
