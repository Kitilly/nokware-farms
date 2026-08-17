import type { Product } from '@/types/product'
import type { SearchInterpretation } from '@/types/search'
import { synonymGroups, descriptorWords, intentGuidance } from '@/data/mock/search-synonyms'
import { isLiveAnimal, isMeatProduct } from '@/types/product'

interface ParsedQuery {
  raw: string
  normalized: string
  tokens: string[]
  canonicalTags: string[]
  weightKg?: number
  wantsFresh: boolean
  wantsLive: boolean
  wantsProcessed: boolean
  wantsWhole: boolean
  wantsSmall: boolean
  wantsLarge: boolean
  wantsNearMe: boolean
  guidance?: (typeof intentGuidance)[number]
}

const WEIGHT_PATTERN = /(\d+(?:\.\d+)?)\s?kg/i

// Filler words carry no product-identifying signal and are prone to
// substring false-positives (e.g. "for" matching "great for grilling"), so
// they're dropped before tokens ever reach tag matching.
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'for', 'to', 'in', 'on', 'at', 'of', 'near', 'me', 'with',
  'and', 'or', 'is', 'are', 'my', 'some', 'any', 'please', 'want', 'looking',
])

function normalize(query: string): string {
  return query.toLowerCase().trim().replace(/[^a-z0-9.\s]/g, ' ').replace(/\s+/g, ' ')
}

function containsAny(haystack: string, needles: string[]): boolean {
  return needles.some((n) => haystack.includes(n))
}

function expandToken(token: string): string[] {
  for (const group of synonymGroups) {
    if (group.terms.includes(token)) return [group.canonicalTag]
  }
  return [token]
}

function findGuidance(normalized: string) {
  return intentGuidance.find((g) => g.matchPhrases.some((phrase) => normalized.includes(phrase)))
}

export function parseQuery(query: string): ParsedQuery {
  const normalized = normalize(query)
  const weightMatch = normalized.match(WEIGHT_PATTERN)
  const weightKg = weightMatch ? parseFloat(weightMatch[1]) : undefined

  const withoutWeight = normalized.replace(WEIGHT_PATTERN, ' ').trim()
  const tokens = withoutWeight.split(' ').filter((t) => t.length > 0 && !STOP_WORDS.has(t))
  const canonicalTags = Array.from(new Set(tokens.flatMap(expandToken)))

  return {
    raw: query,
    normalized,
    tokens,
    canonicalTags,
    weightKg,
    wantsFresh: containsAny(normalized, descriptorWords.fresh),
    wantsLive: containsAny(normalized, descriptorWords.live),
    wantsProcessed: containsAny(normalized, descriptorWords.processed),
    wantsWhole: containsAny(normalized, descriptorWords.whole),
    wantsSmall: containsAny(normalized, descriptorWords.small),
    wantsLarge: containsAny(normalized, descriptorWords.large),
    wantsNearMe: containsAny(normalized, descriptorWords.nearMe),
    guidance: findGuidance(normalized),
  }
}

// Simple typo tolerance: allows a one-character edit distance for tokens of
// length >= 4, so mild misspellings ("chiken", "gaot") still resolve.
function levenshteinWithinOne(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false
  if (a === b) return true
  const [shorter, longer] = a.length <= b.length ? [a, b] : [b, a]
  let i = 0
  let j = 0
  let edits = 0
  while (i < shorter.length && j < longer.length) {
    if (shorter[i] === longer[j]) {
      i += 1
      j += 1
      continue
    }
    edits += 1
    if (edits > 1) return false
    if (shorter.length === longer.length) i += 1
    j += 1
  }
  return true
}

function fuzzyTokenMatches(token: string, target: string): boolean {
  if (target.includes(token)) return true
  if (token.length < 4) return false
  return target.split(/\s+/).some((word) => levenshteinWithinOne(token, word))
}

function scoreProduct(product: Product, parsed: ParsedQuery): number {
  let score = 0
  const name = product.name.toLowerCase()
  const searchable = [name, product.subCategory, product.shortDescriptor.toLowerCase(), ...product.tags.map((t) => t.toLowerCase())]
  const typeToken = isLiveAnimal(product) ? product.animalType : isMeatProduct(product) ? product.meatType : ''

  let tagScore = 0
  for (const tag of parsed.canonicalTags) {
    if (typeToken === tag) tagScore += 6
    if (product.subCategory.toLowerCase().includes(tag)) tagScore += 5
    if (product.tags.some((t) => t.toLowerCase() === tag)) tagScore += 4
    if (name.includes(tag)) tagScore += 3
    if (searchable.some((s) => fuzzyTokenMatches(tag, s))) tagScore += 1
  }
  score += tagScore

  // Descriptor modifiers (guidance/weight/fresh/live/whole/small/large) only
  // refine an already-relevant match — if the query named a specific product
  // type ("chicken"/"goat"), a modifier must not alone surface unrelated
  // products. A category-only guidance match is deliberately NOT used as a
  // standalone qualifier here: it's far too broad (e.g. "wedding" guidance
  // targets live-livestock category as a whole, which would pull in every
  // cow, sheep, and pig alongside goats). When the query has no named type
  // at all (just "2kg" or "fresh"), modifiers apply broadly.
  const modifiersApply = parsed.canonicalTags.length === 0 || tagScore > 0
  if (!modifiersApply) return score

  if (parsed.guidance) {
    if (parsed.guidance.subCategory && product.subCategory === parsed.guidance.subCategory) score += 4
    if (parsed.guidance.weightRangeKg && isLiveAnimal(product) && product.approximateWeightKg) {
      const { min, max } = parsed.guidance.weightRangeKg
      const overlap = product.approximateWeightKg.max >= min && product.approximateWeightKg.min <= max
      if (overlap) score += 5
    }
  }

  if (parsed.wantsFresh) {
    if (isMeatProduct(product)) score += 3
    if (product.freshnessLabel) score += 2
  }

  if (parsed.wantsLive && isLiveAnimal(product)) score += 4
  if (parsed.wantsProcessed && isMeatProduct(product)) score += 2

  if (parsed.wantsWhole) {
    if (isLiveAnimal(product)) score += 2
    if (isMeatProduct(product) && (product.cuts.some((c) => /whole/i.test(c.name)) || product.saleUnit === 'piece')) {
      score += 3
    }
  }

  if (parsed.weightKg !== undefined) {
    if (isMeatProduct(product) && product.weightOptions.length > 0) {
      const closest = product.weightOptions.reduce((best, opt) =>
        Math.abs(opt.kg - parsed.weightKg!) < Math.abs(best.kg - parsed.weightKg!) ? opt : best,
      )
      const distance = Math.abs(closest.kg - parsed.weightKg)
      if (distance <= 0.25) score += 5
      else if (distance <= 0.75) score += 3
      else if (distance <= 1.5) score += 1
    }
    if (isLiveAnimal(product) && product.approximateWeightKg) {
      const { min, max } = product.approximateWeightKg
      if (parsed.weightKg >= min && parsed.weightKg <= max) score += 5
    }
  }

  if (parsed.wantsSmall) {
    if (isLiveAnimal(product) && product.approximateWeightKg && product.approximateWeightKg.max <= 5) score += 3
    if (product.tags.some((t) => t.toLowerCase() === 'small')) score += 2
  }
  if (parsed.wantsLarge) {
    if (isLiveAnimal(product) && product.approximateWeightKg && product.approximateWeightKg.min >= 8) score += 3
    if (product.tags.some((t) => t.toLowerCase() === 'large')) score += 2
  }

  // Small bonus so featured/popular items surface first when scores tie.
  if (score > 0) {
    if (product.popular) score += 0.5
    if (product.featured) score += 0.3
  }

  return score
}

export interface FuzzySearchOptions {
  deliveryEligibleOnly?: boolean
  isDeliveryEligible?: (product: Product) => boolean
}

export function fuzzySearchProducts(
  products: Product[],
  query: string,
  options: FuzzySearchOptions = {},
): { results: Product[]; suggestions: string[]; interpreted: SearchInterpretation } {
  const parsed = parseQuery(query)

  let pool = products
  if (parsed.wantsNearMe && options.deliveryEligibleOnly && options.isDeliveryEligible) {
    pool = pool.filter((p) => options.isDeliveryEligible!(p))
  }

  const scored = pool
    .map((product) => ({ product, score: scoreProduct(product, parsed) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  const results = scored.map((entry) => entry.product)

  const interpreted: SearchInterpretation = {
    category: parsed.guidance?.category,
    subCategory: parsed.guidance?.subCategory,
    weightKg: parsed.weightKg,
    freshness: parsed.wantsFresh || undefined,
    liveOrProcessed: parsed.wantsLive ? 'live' : parsed.wantsProcessed ? 'processed' : undefined,
    guidanceNote: parsed.guidance?.guidanceNote,
  }

  const suggestions =
    results.length > 0
      ? []
      : buildFallbackSuggestions(products, parsed)

  return { results, suggestions, interpreted }
}

function buildFallbackSuggestions(products: Product[], parsed: ParsedQuery): string[] {
  // Try a looser match on the parsed tags first (catches near-misses the
  // strict scorer rejected), then fall back to popular category-level terms
  // so a vague or misspelled query still leads somewhere useful.
  if (parsed.canonicalTags.length > 0) {
    const looseMatches = products.filter((p) =>
      parsed.canonicalTags.some((tag) => p.subCategory.includes(tag) || p.tags.some((t) => t.toLowerCase().includes(tag))),
    )
    if (looseMatches.length > 0) {
      return Array.from(new Set(looseMatches.map((p) => p.subCategory.replace(/-/g, ' ')))).slice(0, 5)
    }
  }

  const popularNames = products
    .filter((p) => p.popular || p.featured)
    .slice(0, 5)
    .map((p) => p.subCategory)

  const unique = Array.from(new Set(popularNames))
  if (unique.length > 0) return unique.map((s) => s.replace(/-/g, ' '))

  return ['chicken', 'beef', 'goat', 'live goat', 'fresh meat']
}
