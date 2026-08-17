import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  size?: 'sm' | 'md'
  showValue?: boolean
  count?: number
  className?: string
}

export function RatingStars({ rating, size = 'sm', showValue, count, className }: RatingStarsProps) {
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4.5 w-4.5'

  return (
    <div className={cn('flex items-center gap-1', className)} aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      <div className="flex" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(starSize, i < Math.round(rating) ? 'fill-terracotta-500 text-terracotta-500' : 'fill-cream-300 text-cream-300')}
          />
        ))}
      </div>
      {showValue && <span className="text-body text-charcoal-600">{rating.toFixed(1)}</span>}
      {count !== undefined && <span className="text-body text-charcoal-500">({count})</span>}
    </div>
  )
}
