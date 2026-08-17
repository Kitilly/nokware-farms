import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { AddressCard } from '@/components/domain/checkout/AddressCard'
import { PaymentOptionCard } from '@/components/domain/checkout/PaymentOptionCard'
import { CartSummary } from '@/components/domain/cart/CartSummary'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { formatShortDate } from '@/lib/date'
import { formatMoney } from '@/lib/currency'
import { computeCartTotals } from '@/lib/cart-math'
import { groupCartItemsByFulfillment } from '@/lib/fulfillment'
import { deliveryZones } from '@/data/mock/delivery-zones'
import { useCartStore } from '@/store/cart.store'
import { useCheckoutStore } from '@/store/checkout.store'
import { useLocationStore } from '@/store/location.store'
import { usePaymentStore } from '@/store/payment.store'
import { useOrdersStore } from '@/store/orders.store'
import { useAnalytics } from '@/hooks/useAnalytics'
import { initiatePayment, pollPaymentStatus } from '@/services/payments'
import { createOrder } from '@/services/orders'
import type { FulfillmentGroup, OrderItem } from '@/types/order'
import type { PaymentState } from '@/types/payment'

export function CheckoutSummaryStep() {
  const navigate = useNavigate()
  const { track } = useAnalytics()

  const items = useCartStore((s) => s.items)
  const promo = useCartStore((s) => s.promo)
  const clearCart = useCartStore((s) => s.clearCart)

  const selectedAddressId = useCheckoutStore((s) => s.selectedAddressId)
  const pickupGroupKeys = useCheckoutStore((s) => s.pickupGroupKeys)
  const selectedSlotByGroup = useCheckoutStore((s) => s.selectedSlotByGroup)
  const contactName = useCheckoutStore((s) => s.contactName)
  const contactPhone = useCheckoutStore((s) => s.contactPhone)
  const paymentMethodId = useCheckoutStore((s) => s.paymentMethodId)
  const resetCheckout = useCheckoutStore((s) => s.reset)

  const savedAddresses = useLocationStore((s) => s.savedAddresses)
  const savedMethods = usePaymentStore((s) => s.savedMethods)
  const addOrder = useOrdersStore((s) => s.addOrder)

  const [paymentState, setPaymentState] = useState<PaymentState | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const address = savedAddresses.find((a) => a.id === selectedAddressId) ?? null
  const paymentMethod = savedMethods.find((m) => m.id === paymentMethodId) ?? null
  const buckets = groupCartItemsByFulfillment(items)
  const extraDeliveryFee = deliveryZones.find((z) => z.id === address?.deliveryZoneId)?.extraFee ?? 0
  const totals = computeCartTotals(items, promo, extraDeliveryFee)
  const hasPendingPrices = items.some((i) => i.isPricePending && !i.savedForLater)

  async function handlePlaceOrder(forceOutcome?: 'success' | 'failed') {
    if (!address || !paymentMethod || isSubmitting) return
    setIsSubmitting(true)
    track('checkout_started')
    track('payment_selected', { type: paymentMethod.type })

    const { paymentId, state } = await initiatePayment('draft', paymentMethod.id, totals.total, { forceOutcome })
    setPaymentState(state)

    let finalState: PaymentState = state
    for (let attempt = 0; attempt < 10 && finalState === 'processing'; attempt += 1) {
      await new Promise((r) => setTimeout(r, 400))
      const poll = await pollPaymentStatus(paymentId)
      finalState = poll.state
      setPaymentState(finalState)
    }

    if (finalState !== 'success') {
      setIsSubmitting(false)
      return
    }

    const fulfillmentGroups: FulfillmentGroup[] = buckets.map((bucket) => {
      const isPickup = pickupGroupKeys.includes(bucket.key)
      const slot = selectedSlotByGroup[bucket.key] ?? null
      return {
        id: bucket.key,
        type: isPickup ? 'pickup' : 'delivery',
        isLiveAnimal: bucket.isLiveAnimal,
        itemIds: bucket.items.map((i) => i.productId),
        estimatedDateLabel: slot ? formatShortDate(slot.date) : 'To be confirmed',
        slot,
        extraFee: !isPickup ? extraDeliveryFee || undefined : undefined,
        leadTimeNote: bucket.processingTimeTier === 'extended' ? bucket.description : undefined,
      }
    })

    const bucketKeyByItemId = new Map<string, string>()
    buckets.forEach((bucket) => bucket.items.forEach((item) => bucketKeyByItemId.set(item.id, bucket.key)))

    const orderItems: OrderItem[] = items
      .filter((i) => !i.savedForLater)
      .map((item) => ({
        productId: item.productId,
        productSlug: item.productSlug,
        productType: item.productType,
        name: item.name,
        image: item.image,
        selection: item.selection,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        itemTotal: item.itemTotal,
        priceUnit: item.priceUnit,
        isPricePending: item.isPricePending,
        fulfillmentGroupId: bucketKeyByItemId.get(item.id) ?? '',
      }))

    const order = await createOrder(
      {
        items: orderItems,
        fulfillmentGroups,
        address,
        contact: { name: contactName, phone: contactPhone },
        paymentMethodId: paymentMethod.id,
        subtotal: totals.subtotal,
        deliveryFee: totals.deliveryFee,
        discount: totals.discount,
        total: totals.total,
      },
      { type: paymentMethod.type, label: paymentMethod.label },
    )

    addOrder(order)
    clearCart()
    resetCheckout()
    track('order_created', { orderId: order.id, total: totals.total })
    setIsSubmitting(false)
    navigate(`/order-confirmation/${order.id}`)
  }

  const canSubmit = Boolean(address && paymentMethod && items.some((i) => !i.savedForLater))

  return (
    <div>
      <h1 className="text-h2 text-charcoal-900">Review & place order</h1>

      <div className="mt-5 space-y-5">
        {address && (
          <div>
            <p className="mb-2 text-body font-medium text-charcoal-800">Delivering to</p>
            <AddressCard address={address} selected />
          </div>
        )}

        <div>
          <p className="mb-2 text-body font-medium text-charcoal-800">Schedule</p>
          <div className="space-y-2">
            {buckets.map((bucket) => {
              const slot = selectedSlotByGroup[bucket.key]
              return (
                <div key={bucket.key} className="rounded-md bg-cream-200 px-3.5 py-2.5 text-body text-charcoal-700">
                  <span className="font-medium text-charcoal-900">{bucket.label}:</span>{' '}
                  {slot ? `${formatShortDate(slot.date)} · ${slot.period}` : 'Not scheduled'}
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-body font-medium text-charcoal-800">Contact</p>
          <p className="text-body-lg text-charcoal-700">
            {contactName} · {contactPhone}
          </p>
        </div>

        {paymentMethod && (
          <div>
            <p className="mb-2 text-body font-medium text-charcoal-800">Payment</p>
            <PaymentOptionCard type={paymentMethod.type} label={paymentMethod.label} selected />
          </div>
        )}

        <div className="rounded-lg border border-border p-4">
          <p className="mb-3 text-body font-medium text-charcoal-800">Order summary ({items.filter((i) => !i.savedForLater).length} items)</p>
          <CartSummary totals={totals} hasPendingPrices={hasPendingPrices} />
        </div>
      </div>

      <Button fullWidth size="lg" className="mt-8" disabled={!canSubmit} isLoading={isSubmitting && paymentState === null} onClick={() => handlePlaceOrder()}>
        Place order — {formatMoney(totals.total)}
      </Button>
      <p className="mt-2 text-center text-caption text-charcoal-400">Demo checkout — no real payment is processed.</p>

      <Dialog open={paymentState !== null} onOpenChange={() => {}} title="Payment status" hideTitle>
        <div className="flex flex-col items-center py-4 text-center">
          {(paymentState === 'processing' || paymentState === 'awaiting') && (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-forest-600" aria-hidden="true" />
              <p className="mt-3 text-h3 text-charcoal-900">Processing payment…</p>
              <p className="mt-1 text-body text-charcoal-600">This is a simulated payment — no real charge is made.</p>
            </>
          )}
          {paymentState === 'success' && (
            <>
              <CheckCircle2 className="h-10 w-10 text-success" aria-hidden="true" />
              <p className="mt-3 text-h3 text-charcoal-900">Payment successful</p>
              <p className="mt-1 text-body text-charcoal-600">Creating your order…</p>
            </>
          )}
          {paymentState === 'failed' && (
            <>
              <XCircle className="h-10 w-10 text-error" aria-hidden="true" />
              <p className="mt-3 text-h3 text-charcoal-900">Payment failed</p>
              <p className="mt-1 text-body text-charcoal-600">Your payment could not be processed. No charge was made.</p>
              <div className="mt-4 flex gap-3">
                <Button variant="outline" onClick={() => setPaymentState(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handlePlaceOrder('success')}>Retry payment</Button>
              </div>
            </>
          )}
        </div>
      </Dialog>
    </div>
  )
}
