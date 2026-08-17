import type { ProductCategory } from '@/types/product'

export interface SynonymGroup {
  terms: string[]
  canonicalTag: string
  category?: ProductCategory
  subCategory?: string
}

// Maps common natural-language words to canonical search tags / category hints
// so queries like "hen", "cow", or "mutton" resolve sensibly without exact
// string matches against product names.
export const synonymGroups: SynonymGroup[] = [
  { terms: ['hen', 'hens', 'chick', 'chicks'], canonicalTag: 'chicken', category: 'poultry', subCategory: 'chickens' },
  { terms: ['cow', 'cows', 'bull', 'bulls', 'heifer', 'ox', 'cattle'], canonicalTag: 'cattle', category: 'live-livestock', subCategory: 'cattle' },
  { terms: ['goat', 'goats', 'buck', 'doe'], canonicalTag: 'goat' },
  { terms: ['sheep', 'ram', 'ewe', 'lamb'], canonicalTag: 'sheep' },
  { terms: ['pig', 'pigs', 'hog', 'piglet', 'swine'], canonicalTag: 'pig', category: 'live-livestock', subCategory: 'pigs' },
  { terms: ['rabbit', 'rabbits', 'bunny', 'bunnies'], canonicalTag: 'rabbit' },
  { terms: ['guinea', 'guineafowl', 'guinea-fowl'], canonicalTag: 'guinea-fowl', category: 'poultry', subCategory: 'guinea-fowl' },
  { terms: ['turkey', 'turkeys'], canonicalTag: 'turkey' },
  { terms: ['duck', 'ducks', 'duckling'], canonicalTag: 'duck' },
  { terms: ['snail', 'snails', 'escargot'], canonicalTag: 'snail', category: 'snails' },
  { terms: ['beef'], canonicalTag: 'beef', category: 'fresh-meat', subCategory: 'beef' },
  { terms: ['mutton', 'muttons'], canonicalTag: 'mutton', category: 'fresh-meat', subCategory: 'mutton' },
  { terms: ['pork'], canonicalTag: 'pork', category: 'fresh-meat', subCategory: 'pork' },
]

// Descriptor words that modify intent rather than naming a product type.
export const descriptorWords = {
  fresh: ['fresh', 'freshest'],
  live: ['live', 'alive'],
  processed: ['dressed', 'processed', 'cleaned'],
  whole: ['whole', 'full'],
  small: ['small', 'little', 'young', 'baby'],
  large: ['large', 'big', 'jumbo', 'mature'],
  nearMe: ['near me', 'nearby', 'close by'],
}

export interface IntentGuidance {
  matchPhrases: string[]
  subCategory?: string
  category?: ProductCategory
  weightRangeKg?: { min: number; max: number }
  guidanceNote: string
}

// Non-literal, occasion-driven queries that need curated guidance rather than
// a plain keyword match.
export const intentGuidance: IntentGuidance[] = [
  {
    matchPhrases: ['wedding', 'for a wedding', 'goat for wedding'],
    category: 'live-livestock',
    subCategory: 'goats',
    weightRangeKg: { min: 35, max: 45 },
    guidanceNote: 'Popular for weddings and large gatherings: 35–45kg goats.',
  },
  {
    matchPhrases: ['naming ceremony', 'outdooring', 'christening'],
    category: 'live-livestock',
    subCategory: 'goats',
    weightRangeKg: { min: 25, max: 35 },
    guidanceNote: 'Popular for naming ceremonies: 25–35kg goats.',
  },
  {
    matchPhrases: ['festive', 'christmas', 'funeral'],
    category: 'live-livestock',
    subCategory: 'sheep',
    weightRangeKg: { min: 40, max: 50 },
    guidanceNote: 'Popular for festive occasions: large 40–50kg rams.',
  },
]
