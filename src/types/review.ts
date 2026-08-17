export interface Review {
  id: string
  productId: string
  authorName: string
  rating: number
  comment?: string
  createdAt: string
  verifiedPurchase: boolean
}

export interface RatingSummary {
  average: number
  count: number
  distribution: Record<1 | 2 | 3 | 4 | 5, number>
}
