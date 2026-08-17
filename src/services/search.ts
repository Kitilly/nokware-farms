import { mockRequest } from './_client'
import { allProducts } from '@/data/mock/products'
import { fuzzySearchProducts, type FuzzySearchOptions } from '@/lib/fuzzy-search'
import type { SearchResult } from '@/types/search'

export function search(query: string, options: FuzzySearchOptions = {}): Promise<SearchResult> {
  return mockRequest(() => fuzzySearchProducts(allProducts, query, options), { minDelayMs: 250, maxDelayMs: 550 })
}

const suggestedSearches = ['2kg chicken', 'live goat', 'fresh beef', 'whole chicken', 'goat for wedding', 'live snails']
const popularSearches = ['chicken', 'beef', 'goat', 'turkey', 'pork', 'snails']

export function getSuggestedSearches(): Promise<string[]> {
  return mockRequest(() => suggestedSearches, { minDelayMs: 100, maxDelayMs: 250 })
}

export function getPopularSearches(): Promise<string[]> {
  return mockRequest(() => popularSearches, { minDelayMs: 100, maxDelayMs: 250 })
}
