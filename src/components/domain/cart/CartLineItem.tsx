import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2, Heart, RotateCcw } from 'lucide-react'
import { ProductMedia } from '@/components/domain/product/ProductMedia'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import { ItemTotalDisplay } from '@/components/ui/PriceDisplay'
import { EditCartItemSheet } from './EditCartItemSheet'
import { useCartStore } from '@/store/cart.store'
import type { CartItem } from '@/types/cart'

export function CartLineItem({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const saveForLater = useCartStore((s) => s.saveForLater)
  const moveToCart = useCartStore((s) => s.moveToCart)
  const [editOpen, setEditOpen] = useState(false)

  const detailPath = item.productType === 'live-animal' ? `/product/live/${item.productSlug}` : `/product/meat/${item.productSlug}`
  const selectionLabel = [item.selection.cutName, item.selection.weightLabel, ...(item.selection.preparationLabels ?? [])].filter(Boolean).join(' · ')
  const canEdit = item.productType === 'meat-product'

  return (
    <div className="flex gap-3 py-4">
      <Link to={detailPath} className="h-20 w-20 shrink-0 overflow-hidden rounded-md">
        <ProductMedia url={item.image} alt={item.name} />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link to={detailPath} className="line-clamp-2 text-body-lg font-medium text-charcoal-900 hover:underline">
            {item.name}
          </Link>
          <ItemTotalDisplay amount={item.itemTotal} isPending={item.isPricePending} size="sm" />
        </div>
        {selectionLabel && <p className="mt-0.5 text-body text-charcoal-500">{selectionLabel}</p>}

        <div className="mt-2 flex items-center justify-between">
          {item.savedForLater ? (
            <button
              type="button"
              onClick={() => moveToCart(item.id)}
              className="flex items-center gap-1.5 text-body font-medium text-forest-700 hover:underline"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Move to cart
            </button>
          ) : (
            <QuantitySelector value={item.quantity} onChange={(q) => updateQuantity(item.id, q)} size="sm" />
          )}

          <div className="flex items-center gap-3">
            {canEdit && !item.savedForLater && (
              <button type="button" aria-label="Edit selection" onClick={() => setEditOpen(true)} className="text-charcoal-500 hover:text-charcoal-800">
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            {!item.savedForLater && (
              <button type="button" aria-label="Save for later" onClick={() => saveForLater(item.id)} className="text-charcoal-500 hover:text-charcoal-800">
                <Heart className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <button type="button" aria-label="Remove item" onClick={() => removeItem(item.id)} className="text-charcoal-500 hover:text-error">
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {canEdit && <EditCartItemSheet item={item} open={editOpen} onOpenChange={setEditOpen} />}
    </div>
  )
}
