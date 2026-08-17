import { mockRequest } from './_client'
import { generateId } from '@/lib/id'
import type { RatingSummary, Review } from '@/types/review'

const seedReviews: Review[] = [
  {
    id: 'review-1',
    productId: 'chicken-dressed-whole-2kg',
    authorName: 'Kojo A.',
    rating: 5,
    comment: 'Always fresh and well packaged. My go-to for Sunday meals.',
    createdAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
    verifiedPurchase: true,
  },
  {
    id: 'review-2',
    productId: 'chicken-dressed-whole-2kg',
    authorName: 'Efua S.',
    rating: 4,
    comment: 'Great quality, delivery was a little later than expected.',
    createdAt: new Date(Date.now() - 12 * 86_400_000).toISOString(),
    verifiedPurchase: true,
  },
  {
    id: 'review-3',
    productId: 'goat-wedding-package',
    authorName: 'Nana O.',
    rating: 5,
    comment: 'Used this for my sister’s wedding — perfect size and the farm team was very helpful.',
    createdAt: new Date(Date.now() - 20 * 86_400_000).toISOString(),
    verifiedPurchase: true,
  },
]

let reviews: Review[] = [...seedReviews]

export function getReviews(productId: string): Promise<Review[]> {
  return mockRequest(() => reviews.filter((r) => r.productId === productId))
}

export function submitReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  return mockRequest(() => {
    const created: Review = { ...review, id: generateId('review'), createdAt: new Date().toISOString() }
    reviews = [created, ...reviews]
    return created
  })
}

export function getRatingSummary(productId: string): Promise<RatingSummary> {
  return mockRequest(() => {
    const productReviews = reviews.filter((r) => r.productId === productId)
    const distribution: RatingSummary['distribution'] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    for (const r of productReviews) {
      const bucket = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5
      distribution[bucket] += 1
    }
    const count = productReviews.length
    const average = count === 0 ? 0 : productReviews.reduce((sum, r) => sum + r.rating, 0) / count
    return { average, count, distribution }
  })
}
