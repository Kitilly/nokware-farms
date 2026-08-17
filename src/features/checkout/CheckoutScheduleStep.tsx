import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { DeliverySlotPicker } from '@/components/domain/checkout/DeliverySlotPicker'
import { useCartStore } from '@/store/cart.store'
import { useCheckoutStore } from '@/store/checkout.store'
import { groupCartItemsByFulfillment } from '@/lib/fulfillment'
import { getAvailableSlots } from '@/services/delivery'
import type { DeliverySlot } from '@/types/delivery'

export function CheckoutScheduleStep() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const pickupGroupKeys = useCheckoutStore((s) => s.pickupGroupKeys)
  const selectedSlotByGroup = useCheckoutStore((s) => s.selectedSlotByGroup)
  const setSlotForGroup = useCheckoutStore((s) => s.setSlotForGroup)

  const buckets = groupCartItemsByFulfillment(items)
  const [slotsByGroup, setSlotsByGroup] = useState<Record<string, DeliverySlot[]>>({})

  useEffect(() => {
    buckets.forEach((bucket) => {
      const isPickup = pickupGroupKeys.includes(bucket.key)
      const startDate = new Date()
      if (bucket.isLiveAnimal) startDate.setDate(startDate.getDate() + 1)
      getAvailableSlots({ startDate, fulfillmentType: isPickup ? 'pickup' : 'delivery' }).then((slots) => {
        setSlotsByGroup((prev) => ({ ...prev, [bucket.key]: slots }))
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(buckets.map((b) => b.key)), JSON.stringify(pickupGroupKeys)])

  const allSelected = buckets.every((b) => selectedSlotByGroup[b.key]?.available)

  return (
    <div>
      <h1 className="text-h2 text-charcoal-900">Choose a time</h1>
      <p className="mt-1 text-body-lg text-charcoal-600">Pick a date and time slot for each group.</p>

      <div className="mt-5 space-y-6">
        {buckets.map((bucket) => (
          <div key={bucket.key}>
            <p className="mb-2 text-body-lg font-medium text-charcoal-900">{bucket.label}</p>
            {bucket.processingTimeTier === 'extended' && <p className="mb-2 text-body text-charcoal-500">{bucket.description}</p>}
            {slotsByGroup[bucket.key] ? (
              <DeliverySlotPicker
                slots={slotsByGroup[bucket.key]}
                selectedSlotId={selectedSlotByGroup[bucket.key]?.id}
                onSelect={(slot) => setSlotForGroup(bucket.key, slot)}
              />
            ) : (
              <p className="text-body text-charcoal-500">Loading available times…</p>
            )}
          </div>
        ))}
      </div>

      <Button fullWidth size="lg" className="mt-8" disabled={!allSelected} onClick={() => navigate('/checkout/contact')}>
        Continue
      </Button>
    </div>
  )
}
