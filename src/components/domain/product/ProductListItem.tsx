import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { ProductMedia } from './ProductMedia'
import { AvailabilityBadge } from './AvailabilityBadge'
import { FavoriteButton } from './FavoriteButton'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { toast } from '@/components/ui/Toast'
import { getDefaultSelection } from '@/lib/default-selection'
import { useCartStore } from '@/store/cart.store'
import { useAnalytics } from '@/hooks/useAnalytics'
import { isLiveAnimal, isMeatProduct } from '@/types/product'
import type { Product } from '@/types/product'

export function ProductListItem({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const { track } = useAnalytics()
  const canQuickAdd = product.availability === 'available' || product.availability === 'low-stock'
  const detailPath = isLiveAnimal(product) ? `/product/live/${product.slug}` : `/product/meat/${product.slug}`

  const sizeLine = isLiveAnimal(product)
    ? product.approximateWeightKg
      ? `~${product.approximateWeightKg.min}–${product.approximateWeightKg.max}kg`
      : null
    : isMeatProduct(product) && product.weightOptions.length > 0
      ? `${product.weightOptions[0].kg}kg${product.weightOptions.length > 1 ? ` – ${product.weightOptions[product.weightOptions.length - 1].kg}kg` : ''}`
      : null

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const selection = getDefaultSelection(product)
    addItem(product, selection, 1)
    track('cart_added', { productId: product.id, quantity: 1 })
    toast.success(`Added ${product.name}`, 'Added to your cart')
  }

  return (
    <Link
      to={detailPath}
      onClick={() => track('product_viewed', { productId: product.id })}
      className="flex items-center gap-3.5 rounded-lg border border-border bg-cream-50 p-2.5 transition-colors hover:bg-cream-200"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
        <ProductMedia url={product.images[0]?.url ?? ''} alt={product.images[0]?.alt ?? product.name} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 text-body-lg font-medium text-charcoal-900">{product.name}</h3>
        <p className="line-clamp-1 text-body text-charcoal-500">{product.shortDescriptor}</p>
        <div className="mt-1 flex items-center gap-2">
          <PriceDisplay
            amount={product.price}
            unit={product.priceUnit}
            size="sm"
            isPending={isMeatProduct(product) && (product.pricingModel === 'estimated' || product.pricingModel === 'final-weighed')}
          />
          {sizeLine && <span className="text-caption text-charcoal-400">{sizeLine}</span>}
        </div>
        {product.availability !== 'available' && <AvailabilityBadge status={product.availability} className="mt-1.5" />}
      </div>
      <div className="flex shrink-0 flex-col items-center gap-2">
        <FavoriteButton productId={product.id} size="sm" className="static bg-transparent shadow-none hover:bg-cream-300" />
        {canQuickAdd && (
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={handleQuickAdd}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-600 text-cream-50 transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </Link>
  )
}
