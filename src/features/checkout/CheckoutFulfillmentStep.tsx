import { useNavigate } from 'react-router-dom'
import { Truck, Store } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cart.store'
import { useCheckoutStore } from '@/store/checkout.store'
import { groupCartItemsByFulfillment } from '@/lib/fulfillment'
import { cn } from '@/lib/utils'

export function CheckoutFulfillmentStep() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const pickupGroupKeys = useCheckoutStore((s) => s.pickupGroupKeys)
  const togglePickupGroup = useCheckoutStore((s) => s.togglePickupGroup)

  const buckets = groupCartItemsByFulfillment(items)

  return (
    <div>
      <h1 className="text-h2 text-charcoal-900">Delivery or pickup</h1>
      <p className="mt-1 text-body-lg text-charcoal-600">Choose how you’d like to receive each group of items.</p>

      <div className="mt-5 space-y-4">
        {buckets.map((bucket) => {
          const isPickup = pickupGroupKeys.includes(bucket.key)
          return (
            <div key={bucket.key} className="rounded-lg border border-border p-4">
              <p className="text-body-lg font-medium text-charcoal-900">{bucket.label}</p>
              <p className="mt-0.5 text-body text-charcoal-500">
                {bucket.items.length} item{bucket.items.length > 1 ? 's' : ''}: {bucket.items.map((i) => i.name).join(', ')}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => isPickup && togglePickupGroup(bucket.key, false)}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-md border py-2.5 text-body font-medium transition-colors',
                    !isPickup ? 'border-forest-600 bg-forest-50 text-forest-800' : 'border-border-strong text-charcoal-600 hover:bg-cream-200',
                  )}
                >
                  <Truck className="h-4 w-4" aria-hidden="true" /> Delivery
                </button>
                <button
                  type="button"
                  onClick={() => !isPickup && togglePickupGroup(bucket.key, true)}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-md border py-2.5 text-body font-medium transition-colors',
                    isPickup ? 'border-forest-600 bg-forest-50 text-forest-800' : 'border-border-strong text-charcoal-600 hover:bg-cream-200',
                  )}
                >
                  <Store className="h-4 w-4" aria-hidden="true" /> Pickup
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <Button fullWidth size="lg" className="mt-8" onClick={() => navigate('/checkout/schedule')}>
        Continue
      </Button>
    </div>
  )
}
