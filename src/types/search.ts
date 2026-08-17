import type { Product, ProductCategory } from './product'

export interface SearchInterpretation {
  category?: ProductCategory
  subCategory?: string
  weightKg?: number
  freshness?: boolean
  liveOrProcessed?: 'live' | 'processed'
  guidanceNote?: string
}

export interface SearchResult {
  results: Product[]
  suggestions: string[]
  interpreted: SearchInterpretation
}
