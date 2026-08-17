import { Truck, Store } from 'lucide-react'
import { CartLineItem } from './CartLineItem'
import type { FulfillmentBucket } from '@/lib/fulfillment'

export function FulfillmentGroupCard({ bucket }: { bucket: FulfillmentBucket }) {
  const Icon = bucket.fulfillmentType === 'delivery' ? Truck : Store

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="flex items-start gap-2.5 border-b border-border bg-cream-200 px-4 py-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-forest-700" aria-hidden="true" />
        <div>
          <p className="text-body-lg font-medium text-charcoal-900">{bucket.label}</p>
          <p className="text-body text-charcoal-600">{bucket.description}</p>
        </div>
      </div>
      <div className="divide-y divide-border px-4">
        {bucket.items.map((item) => (
          <CartLineItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
