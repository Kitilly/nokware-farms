import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Snowflake, Info, Truck, Store } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { ProductGallery } from '@/components/domain/product/ProductGallery'
import { AvailabilityBadge } from '@/components/domain/product/AvailabilityBadge'
import { FavoriteButton } from '@/components/domain/product/FavoriteButton'
import { CutSelector } from '@/components/domain/product/CutSelector'
import { WeightSelector } from '@/components/domain/product/WeightSelector'
import { PreparationOptions } from '@/components/domain/product/PreparationOptions'
import { RatingStars } from '@/components/domain/reviews/RatingStars'
import { ReviewList } from '@/components/domain/reviews/ReviewList'
import { ItemTotalDisplay } from '@/components/ui/PriceDisplay'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import { Button } from '@/components/ui/Button'
import { Divider } from '@/components/ui/Divider'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { toast } from '@/components/ui/Toast'
import { getProductBySlug, checkAvailability } from '@/services/inventory'
import { getRatingSummary, getReviews } from '@/services/reviews'
import { computeItemTotal, computeUnitPrice, isPricePending } from '@/lib/pricing'
import { formatMoney, formatPriceWithUnit } from '@/lib/currency'
import { useCartStore } from '@/store/cart.store'
import { useAnalytics } from '@/hooks/useAnalytics'
import type { MeatProduct, WeightOption, CutOption } from '@/types/product'
import type { CartItemSelection } from '@/types/cart'
import type { Review, RatingSummary } from '@/types/review'

const pricingModelLabel: Record<MeatProduct['pricingModel'], string> = {
  fixed: 'Fixed price',
  'per-kg': 'Priced per kg',
  estimated: 'Estimated price',
  'final-weighed': 'Estimated — final weight confirmed at packing',
}

export function MeatDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const { track } = useAnalytics()

  const [product, setProduct] = useState<MeatProduct | null | undefined>(undefined)
  const [selection, setSelection] = useState<CartItemSelection>({})
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState<Review[]>([])
  const [ratingSummary, setRatingSummary] = useState<RatingSummary | null>(null)
  const [stockIssue, setStockIssue] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setProduct(undefined)
    getProductBySlug(slug).then((p) => {
      if (cancelled) return
      if (p && p.type === 'meat-product') {
        setProduct(p)
        track('product_viewed', { productId: p.id })
        const defaultWeight = p.weightOptions.find((w) => w.isDefault) ?? p.weightOptions[0]
        const defaultCut = p.cuts[0]
        const defaultPreps = p.preparationOptions.filter((o) => o.isDefault)
        setSelection({
          weightOptionId: defaultWeight?.id,
          weightLabel: defaultWeight?.label,
          cutId: defaultCut?.id,
          cutName: defaultCut?.name,
          preparationIds: defaultPreps.map((o) => o.id),
          preparationLabels: defaultPreps.map((o) => o.label),
        })
      } else {
        setProduct(null)
      }
    })
    return () => {
      cancelled = true
    }
  }, [slug, track])

  const productId = product?.id
  useEffect(() => {
    if (!productId) return
    let cancelled = false
    getReviews(productId).then((r) => !cancelled && setReviews(r))
    getRatingSummary(productId).then((r) => !cancelled && setRatingSummary(r))
    return () => {
      cancelled = true
    }
  }, [productId])

  if (product === undefined) {
    return (
      <AppShell>
        <div className="mx-auto max-w-4xl px-5 pt-6 md:px-8">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <Skeleton className="mt-4 h-6 w-2/3" />
          <Skeleton className="mt-2 h-4 w-1/3" />
        </div>
      </AppShell>
    )
  }

  if (product === null) {
    return (
      <AppShell>
        <ErrorState
          title="Product not found"
          body="This product may have been removed or the link is incorrect."
          action={<Button onClick={() => navigate('/shop/fresh-meat')}>Browse fresh meat</Button>}
          className="pt-20"
        />
      </AppShell>
    )
  }

  const canPurchase = product.availability === 'available' || product.availability === 'low-stock'
  const unitPrice = computeUnitPrice(product, selection)
  const itemTotal = computeItemTotal(product, selection, quantity)
  const pending = isPricePending(product)

  function handleSelectWeight(option: WeightOption) {
    setSelection((s) => ({ ...s, weightOptionId: option.id, weightLabel: option.label, customWeightKg: undefined }))
  }
  function handleSelectCustomWeight(kg: number) {
    setSelection((s) => ({ ...s, customWeightKg: kg, weightOptionId: undefined, weightLabel: `${kg.toFixed(2)}kg` }))
  }
  function handleSelectCut(cut: CutOption) {
    setSelection((s) => ({ ...s, cutId: cut.id, cutName: cut.name }))
  }
  function handleTogglePrep(id: string) {
    setSelection((s) => {
      const has = (s.preparationIds ?? []).includes(id)
      const nextIds = has ? (s.preparationIds ?? []).filter((p) => p !== id) : [...(s.preparationIds ?? []), id]
      const label = product!.preparationOptions.find((o) => o.id === id)?.label
      const nextLabels = has ? (s.preparationLabels ?? []).filter((l) => l !== label) : [...(s.preparationLabels ?? []), label!]
      return { ...s, preparationIds: nextIds, preparationLabels: nextLabels }
    })
  }

  async function handleAddToCart() {
    const result = await checkAvailability(product!.id, selection, quantity)
    if (!result.ok) {
      setStockIssue(result.message ?? 'This item is unavailable.')
      return
    }
    setStockIssue(null)
    addItem(product!, selection, quantity)
    track('cart_added', { productId: product!.id, quantity })
    toast.success(`Added ${product!.name}`, `${selection.weightLabel ?? ''} added to your cart`)
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-5 pt-4 md:px-8 md:pt-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900 md:hidden"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
        </button>

        <div className="md:grid md:grid-cols-2 md:items-start md:gap-10">
          <div className="md:sticky md:top-24">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          <div className="mt-5 md:mt-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-caption font-semibold uppercase tracking-wide text-terracotta-600">Fresh meat</p>
                <h1 className="mt-0.5 text-h1 text-charcoal-900">{product.name}</h1>
              </div>
              <FavoriteButton productId={product.id} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <AvailabilityBadge status={product.availability} />
              {product.freshnessLabel && (
                <span className="inline-flex items-center gap-1 rounded-full bg-forest-50 px-2.5 py-1 text-body text-forest-700">{product.freshnessLabel}</span>
              )}
              {ratingSummary && ratingSummary.count > 0 && <RatingStars rating={ratingSummary.average} showValue count={ratingSummary.count} />}
            </div>

            <p className="mt-3 text-body-lg text-charcoal-700">{product.description}</p>

            <div className="mt-4 rounded-lg bg-cream-200 p-4">
              <p className="text-caption text-charcoal-500">{pricingModelLabel[product.pricingModel]}</p>
              <p className="mt-0.5 text-h3 text-charcoal-900">{formatPriceWithUnit(product.price, product.priceUnit)}</p>
              {product.finalWeightAdjustmentNotice && (
                <p className="mt-1.5 flex items-start gap-1.5 text-caption text-charcoal-600">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {product.finalWeightAdjustmentNotice}
                </p>
              )}
            </div>

            <div className="mt-5 space-y-5">
              <CutSelector cuts={product.cuts} selectedId={selection.cutId} onSelect={handleSelectCut} />
              <WeightSelector
                weightOptions={product.weightOptions}
                allowsCustomWeight={product.allowsCustomWeight}
                customWeightRangeKg={product.customWeightRangeKg}
                selectedOptionId={selection.weightOptionId}
                customWeightKg={selection.customWeightKg}
                onSelectPreset={handleSelectWeight}
                onSelectCustom={handleSelectCustomWeight}
              />
              <PreparationOptions options={product.preparationOptions} selectedIds={selection.preparationIds ?? []} onToggle={handleTogglePrep} />
            </div>

            {canPurchase ? (
              <div className="mt-5">
                <p className="mb-2 text-body font-medium text-charcoal-800">Quantity</p>
                <QuantitySelector value={quantity} onChange={setQuantity} min={product.minQuantity} max={product.maxQuantity} />
                <div className="mt-3 flex items-center justify-between rounded-md bg-cream-100 px-3.5 py-2.5">
                  <span className="text-body text-charcoal-600">
                    {formatMoney(unitPrice)} × {quantity}
                  </span>
                  <ItemTotalDisplay amount={itemTotal} isPending={pending} size="lg" />
                </div>
                {stockIssue && <p className="mt-2 text-body text-error">{stockIssue}</p>}
                <Button fullWidth size="lg" className="mt-4 hidden md:flex" onClick={handleAddToCart}>
                  Add to cart — {formatMoney(itemTotal)}
                </Button>
              </div>
            ) : (
              <p className="mt-5 rounded-md bg-cream-200 px-3.5 py-3 text-body text-charcoal-600">
                This product is currently {product.availability.replace('-', ' ')}. Check back soon or explore similar products.
              </p>
            )}

            <Divider className="my-6" />

            <div className="space-y-4">
              <div className="flex gap-3">
                <Snowflake className="h-5 w-5 shrink-0 text-forest-700" aria-hidden="true" />
                <div>
                  <p className="text-body-lg font-medium text-charcoal-900">Storage guidance</p>
                  <p className="text-body text-charcoal-600">{product.storageGuidance}</p>
                </div>
              </div>
              <div className="flex gap-3">
                {product.fulfillmentTypes.includes('delivery') ? <Truck className="h-5 w-5 shrink-0 text-forest-700" aria-hidden="true" /> : <Store className="h-5 w-5 shrink-0 text-forest-700" aria-hidden="true" />}
                <div>
                  <p className="text-body-lg font-medium text-charcoal-900">Delivery & pickup</p>
                  <p className="text-body text-charcoal-600">
                    {product.fulfillmentTypes.includes('delivery') && product.fulfillmentTypes.includes('pickup')
                      ? 'Available for delivery or farm pickup.'
                      : product.fulfillmentTypes.includes('delivery')
                        ? 'Delivery only.'
                        : 'Farm pickup only.'}
                    {' '}Typically processed within {product.processingTimeHours}h.
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-body-lg font-medium text-charcoal-900">{product.farmSource.farmName}</p>
                <p className="mt-1 text-body text-charcoal-600">{product.farmSource.description}</p>
              </div>
            </div>

            <Divider className="my-6" />

            <div>
              <h2 className="mb-3 text-h3 text-charcoal-900">Reviews</h2>
              <ReviewList reviews={reviews} />
            </div>
          </div>
        </div>
      </div>

      {canPurchase && (
        <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-cream-50 p-4 md:hidden">
          <Button fullWidth size="lg" onClick={handleAddToCart}>
            Add to cart — {formatMoney(itemTotal)}
          </Button>
        </div>
      )}
    </AppShell>
  )
}
