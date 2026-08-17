import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Info } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { FulfillmentGroupCard } from '@/components/domain/cart/FulfillmentGroupCard'
import { CartLineItem } from '@/components/domain/cart/CartLineItem'
import { CartSummary } from '@/components/domain/cart/CartSummary'
import { PromoCodeField } from '@/components/domain/cart/PromoCodeField'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useCartStore } from '@/store/cart.store'
import { groupCartItemsByFulfillment } from '@/lib/fulfillment'
import { computeCartTotals } from '@/lib/cart-math'
import { useAnalytics } from '@/hooks/useAnalytics'
import { formatMoney } from '@/lib/currency'

export function CartPage() {
  const navigate = useNavigate()
  const { track } = useAnalytics()
  const items = useCartStore((s) => s.items)
  const promo = useCartStore((s) => s.promo)
  const totals = computeCartTotals(items, promo)

  const activeItems = items.filter((i) => !i.savedForLater)
  const savedItems = items.filter((i) => i.savedForLater)
  const buckets = groupCartItemsByFulfillment(activeItems)
  const hasPendingPrices = activeItems.some((i) => i.isPricePending)

  if (items.length === 0) {
    return (
      <AppShell>
        <EmptyState
          icon={<ShoppingCart className="h-7 w-7 text-charcoal-500" aria-hidden="true" />}
          title="Your cart is empty"
          body="Browse live livestock, poultry, and fresh meat to get started."
          action={<Button onClick={() => navigate('/shop')}>Start shopping</Button>}
          className="pt-20"
        />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-5 pb-40 pt-4 md:px-8 md:pb-16">
        <h1 className="text-h1 text-charcoal-900">Cart</h1>

        {buckets.length > 1 && (
          <p className="mt-3 flex items-start gap-2 rounded-md bg-info-bg px-3.5 py-3 text-body text-info">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Your order includes items with different fulfillment — they’ll be prepared and delivered separately, shown as {buckets.length} groups below.
          </p>
        )}

        <div className="mt-4 space-y-4">
          {buckets.map((bucket) => (
            <FulfillmentGroupCard key={bucket.key} bucket={bucket} />
          ))}
        </div>

        {savedItems.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-1 text-h3 text-charcoal-900">Saved for later ({savedItems.length})</h2>
            <div className="divide-y divide-border rounded-lg border border-border px-4">
              {savedItems.map((item) => (
                <CartLineItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <PromoCodeField />
        </div>

        <div className="mt-6 rounded-lg border border-border p-4">
          <CartSummary totals={totals} hasPendingPrices={hasPendingPrices} />
        </div>

        <Button
          fullWidth
          size="lg"
          className="mt-5 hidden md:flex"
          onClick={() => {
            track('checkout_started')
            navigate('/checkout/address')
          }}
        >
          Proceed to checkout
        </Button>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-cream-50 p-4 md:hidden">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-body text-charcoal-600">Total</span>
          <span className="text-h3 text-charcoal-900">{formatMoney(totals.total)}</span>
        </div>
        <Button
          fullWidth
          size="lg"
          onClick={() => {
            track('checkout_started')
            navigate('/checkout/address')
          }}
        >
          Proceed to checkout
        </Button>
      </div>
    </AppShell>
  )
}
