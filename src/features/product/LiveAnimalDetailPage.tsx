import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Truck, Store, ShieldCheck, Info, PhoneCall, MessageCircle } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { ProductGallery } from '@/components/domain/product/ProductGallery'
import { AvailabilityBadge } from '@/components/domain/product/AvailabilityBadge'
import { FavoriteButton } from '@/components/domain/product/FavoriteButton'
import { RatingStars } from '@/components/domain/reviews/RatingStars'
import { ReviewList } from '@/components/domain/reviews/ReviewList'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Divider } from '@/components/ui/Divider'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { toast } from '@/components/ui/Toast'
import { getProductBySlug, checkAvailability } from '@/services/inventory'
import { submitTicket } from '@/services/support'
import { getRatingSummary as getRatingSummaryReviews, getReviews as getReviewsSvc } from '@/services/reviews'
import { useCartStore } from '@/store/cart.store'
import { useAnalytics } from '@/hooks/useAnalytics'
import { getContactChannels } from '@/config/contact-channels.config'
import { formatMoney } from '@/lib/currency'
import type { LiveAnimalProduct } from '@/types/product'
import type { Review, RatingSummary } from '@/types/review'

export function LiveAnimalDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const { track } = useAnalytics()

  const [product, setProduct] = useState<LiveAnimalProduct | null | undefined>(undefined)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState<Review[]>([])
  const [ratingSummary, setRatingSummary] = useState<RatingSummary | null>(null)
  const [contactOpen, setContactOpen] = useState(false)
  const [contactMessage, setContactMessage] = useState('')
  const [contactSent, setContactSent] = useState(false)
  const [stockIssue, setStockIssue] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setProduct(undefined)
    getProductBySlug(slug).then((p) => {
      if (cancelled) return
      if (p && p.type === 'live-animal') {
        setProduct(p)
        track('product_viewed', { productId: p.id })
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
    getReviewsSvc(productId).then((r) => !cancelled && setReviews(r))
    getRatingSummaryReviews(productId).then((r) => !cancelled && setRatingSummary(r))
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
          body="This animal may have been removed or the link is incorrect."
          action={<Button onClick={() => navigate('/shop/live-livestock')}>Browse livestock</Button>}
          className="pt-20"
        />
      </AppShell>
    )
  }

  const canPurchase = product.availability === 'available' || product.availability === 'low-stock'

  async function handleAddToCart() {
    const result = await checkAvailability(product!.id, {}, quantity)
    if (!result.ok) {
      setStockIssue(result.message ?? 'This item is unavailable.')
      return
    }
    setStockIssue(null)
    addItem(product!, {}, quantity)
    track('cart_added', { productId: product!.id, quantity })
    toast.success(`Added ${product!.name}`, `${quantity} animal${quantity > 1 ? 's' : ''} added to your cart`)
  }

  async function handleSendInquiry() {
    await submitTicket({
      topic: 'other',
      message: `Inquiry about ${product!.name}: ${contactMessage}`,
      channel: 'in-app',
    })
    setContactSent(true)
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
                <p className="text-caption font-semibold uppercase tracking-wide text-forest-700">Live animal</p>
                <h1 className="mt-0.5 text-h1 text-charcoal-900">{product.name}</h1>
                {product.breed && <p className="mt-1 text-body-lg text-charcoal-600">{product.breed}</p>}
              </div>
              <FavoriteButton productId={product.id} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <AvailabilityBadge status={product.availability} />
              {ratingSummary && ratingSummary.count > 0 && <RatingStars rating={ratingSummary.average} showValue count={ratingSummary.count} />}
            </div>

            <div className="mt-4">
              <PriceDisplay amount={product.price} unit={product.priceUnit} size="lg" />
            </div>

            <p className="mt-3 text-body-lg text-charcoal-700">{product.description}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-cream-200 p-4">
              {product.approximateWeightKg && (
                <div>
                  <p className="text-caption text-charcoal-500">Approximate weight</p>
                  <p className="text-body-lg font-medium text-charcoal-900">
                    {product.approximateWeightKg.min}–{product.approximateWeightKg.max}kg
                  </p>
                </div>
              )}
              {product.approximateAgeMonths && (
                <div>
                  <p className="text-caption text-charcoal-500">Approximate age</p>
                  <p className="text-body-lg font-medium text-charcoal-900">
                    {product.approximateAgeMonths.min}–{product.approximateAgeMonths.max} months
                  </p>
                </div>
              )}
              <div>
                <p className="text-caption text-charcoal-500">Farm source</p>
                <p className="text-body-lg font-medium text-charcoal-900">{product.farmSource.farmName}</p>
              </div>
              <div>
                <p className="text-caption text-charcoal-500">Lead time</p>
                <p className="text-body-lg font-medium text-charcoal-900">
                  {product.minLeadTimeDays === 0 ? 'Same day' : `${product.minLeadTimeDays}+ day${product.minLeadTimeDays > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>

            <p className="mt-3 flex items-start gap-2 rounded-md bg-warning-bg px-3.5 py-2.5 text-body text-warning">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {product.weightDisclaimer}
            </p>

            {canPurchase ? (
              <div className="mt-5">
                <p className="mb-2 text-body font-medium text-charcoal-800">Quantity</p>
                <QuantitySelector value={quantity} onChange={setQuantity} min={product.minQuantity} max={product.maxQuantity} />
                {stockIssue && <p className="mt-2 text-body text-error">{stockIssue}</p>}
                <Button fullWidth size="lg" className="mt-4 hidden md:flex" onClick={handleAddToCart}>
                  Add to cart — {formatMoney(product.price * quantity)}
                </Button>
              </div>
            ) : (
              <p className="mt-5 rounded-md bg-cream-200 px-3.5 py-3 text-body text-charcoal-600">
                This animal is currently {product.availability.replace('-', ' ')}. Check back soon or explore similar livestock.
              </p>
            )}

            {product.allowsContactInquiry && (
              <Button variant="outline" fullWidth className="mt-3" leadingIcon={<MessageCircle className="h-4 w-4" />} onClick={() => setContactOpen(true)}>
                Ask about this animal
              </Button>
            )}

            <Divider className="my-6" />

            <div className="space-y-4">
              <div className="flex gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-forest-700" aria-hidden="true" />
                <div>
                  <p className="text-body-lg font-medium text-charcoal-900">Handling & transport</p>
                  <p className="text-body text-charcoal-600">{product.handlingInfo}</p>
                  {product.transportRequirements && <p className="mt-1 text-body text-charcoal-600">{product.transportRequirements}</p>}
                </div>
              </div>
              <div className="flex gap-3">
                <Info className="h-5 w-5 shrink-0 text-forest-700" aria-hidden="true" />
                <div>
                  <p className="text-body-lg font-medium text-charcoal-900">Care & feeding</p>
                  <p className="text-body text-charcoal-600">{product.careSummary}</p>
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
            Add to cart — {formatMoney(product.price * quantity)}
          </Button>
        </div>
      )}

      <Dialog open={contactOpen} onOpenChange={setContactOpen} title={`Ask about ${product.name}`} description="Our team will get back to you about this animal.">
        {contactSent ? (
          <p className="py-4 text-body-lg text-success">Thanks — we’ve received your message and will be in touch shortly.</p>
        ) : (
          <div className="space-y-3">
            <textarea
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="What would you like to know?"
              rows={4}
              className="w-full rounded-md border border-border-strong bg-cream-50 px-3.5 py-2.5 text-body-lg text-charcoal-900 focus-visible:outline-none focus-visible:border-forest-500"
            />
            <Button fullWidth disabled={contactMessage.trim().length === 0} onClick={handleSendInquiry}>
              Send message
            </Button>
            <div className="flex justify-center gap-4 pt-1">
              {getContactChannels().map((c) => (
                <a key={c.type} href={c.href} className="flex items-center gap-1.5 text-body text-forest-700 hover:underline">
                  <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" /> {c.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </Dialog>
    </AppShell>
  )
}
