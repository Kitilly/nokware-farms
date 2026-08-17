import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFavoritesStore } from '@/store/favorites.store'
import { useAnalytics } from '@/hooks/useAnalytics'

interface FavoriteButtonProps {
  productId: string
  className?: string
  size?: 'sm' | 'md'
}

export function FavoriteButton({ productId, className, size = 'md' }: FavoriteButtonProps) {
  const isFavorite = useFavoritesStore((s) => s.favoriteProductIds.includes(productId))
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)
  const { track } = useAnalytics()

  return (
    <button
      type="button"
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isFavorite}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(productId)
        if (!isFavorite) track('favorite_added', { productId })
      }}
      className={cn(
        'flex items-center justify-center rounded-full bg-cream-50/90 shadow-xs backdrop-blur-sm transition-transform duration-150',
        'hover:scale-105 focus-visible:outline-none active:scale-95',
        size === 'sm' ? 'h-7 w-7' : 'h-9 w-9',
        className,
      )}
    >
      <Heart
        className={cn(size === 'sm' ? 'h-3.5 w-3.5' : 'h-4.5 w-4.5', isFavorite ? 'fill-terracotta-500 text-terracotta-500' : 'text-charcoal-500')}
        aria-hidden="true"
      />
    </button>
  )
}
