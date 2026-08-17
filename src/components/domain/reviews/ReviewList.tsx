import { MessageSquare, BadgeCheck } from 'lucide-react'
import { RatingStars } from './RatingStars'
import { EmptyState } from '@/components/ui/EmptyState'
import { relativeTimeFromNow } from '@/lib/date'
import type { Review } from '@/types/review'

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare className="h-6 w-6 text-charcoal-500" aria-hidden="true" />}
        title="No reviews yet"
        body="Be the first to share your experience with this product."
        className="py-8"
      />
    )
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li key={review.id} className="border-b border-border pb-4 last:border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-body-lg font-medium text-charcoal-900">{review.authorName}</span>
              {review.verifiedPurchase && (
                <span className="flex items-center gap-0.5 text-caption text-forest-700">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified
                </span>
              )}
            </div>
            <span className="text-caption text-charcoal-400">{relativeTimeFromNow(review.createdAt)}</span>
          </div>
          <RatingStars rating={review.rating} className="mt-1" />
          {review.comment && <p className="mt-1.5 text-body-lg text-charcoal-700">{review.comment}</p>}
        </li>
      ))}
    </ul>
  )
}
