import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { ProductMedia } from './ProductMedia'
import { AvailabilityBadge } from './AvailabilityBadge'
import { FavoriteButton } from './FavoriteButton'
import { FreshnessBadge } from './FreshnessBadge'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { toast } from '@/components/ui/Toast'
import { getDefaultSelection } from '@/lib/default-selection'
import { useCartStore } from '@/store/cart.store'
import { useAnalytics } from '@/hooks/useAnalytics'
import type { MeatProduct } from '@/types/product'

export function MeatProductCard({ product }: { product: MeatProduct }) {
  const addItem = useCartStore((s) => s.addItem)
  const { track } = useAnalytics()
  const canQuickAdd = product.availability === 'available' || product.availability === 'low-stock'

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const selection = getDefaultSelection(product)
    addItem(product, selection, 1)
    track('cart_added', { productId: product.id, quantity: 1 })
    toast.success(`Added ${product.name}`, selection.weightLabel ? `${selection.weightLabel} added to your cart` : 'Added to your cart')
  }

  const weightRange =
    product.weightOptions.length > 0
      ? `${product.weightOptions[0].kg}kg${product.weightOptions.length > 1 ? ` – ${product.weightOptions[product.weightOptions.length - 1].kg}kg` : ''}`
      : null

  return (
    <Link to={`/product/meat/${product.slug}`} className="group block w-full" onClick={() => track('product_viewed', { productId: product.id })}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
        <ProductMedia url={product.images[0]?.url ?? ''} alt={product.images[0]?.alt ?? product.name} className="transition-transform duration-300 group-hover:scale-105" />
        <FavoriteButton productId={product.id} className="absolute right-2 top-2" size="sm" />
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {product.availability !== 'available' && <AvailabilityBadge status={product.availability} />}
          {product.freshnessLabel && product.availability === 'available' && <FreshnessBadge label={product.freshnessLabel} />}
        </div>
        {canQuickAdd && (
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={handleQuickAdd}
            className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-forest-600 text-cream-50 shadow-sm transition-transform hover:scale-105 focus-visible:outline-none active:scale-95"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="mt-2.5">
        <h3 className="line-clamp-1 text-body-lg font-medium text-charcoal-900">{product.name}</h3>
        <p className="mt-0.5 line-clamp-1 text-body text-charcoal-500">{product.shortDescriptor}</p>
        {weightRange && <p className="mt-0.5 text-caption text-charcoal-500">{weightRange}</p>}
        <div className="mt-1.5">
          <PriceDisplay
            amount={product.price}
            unit={product.priceUnit}
            isPending={product.pricingModel === 'estimated' || product.pricingModel === 'final-weighed'}
          />
        </div>
      </div>
    </Link>
  )
}
