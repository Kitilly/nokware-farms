import type { ProductCategory } from './product'

export interface Promo {
  code: string
  description: string
  discountType: 'percentage' | 'flat'
  discountValue: number
  minimumSpend?: number
  expiresAt?: string
  applicableCategories?: ProductCategory[]
  usageLimitPerUser?: number
}
