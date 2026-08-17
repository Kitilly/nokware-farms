import { formatMoney } from '@/lib/currency'
import type { CartTotals } from '@/lib/cart-math'

export function CartSummary({ totals, hasPendingPrices }: { totals: CartTotals; hasPendingPrices?: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-body-lg text-charcoal-700">
        <span>Subtotal</span>
        <span>{formatMoney(totals.subtotal)}</span>
      </div>
      <div className="flex justify-between text-body-lg text-charcoal-700">
        <span>Delivery fee</span>
        <span>{totals.deliveryFee > 0 ? formatMoney(totals.deliveryFee) : 'Free'}</span>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between text-body-lg text-success">
          <span>Discount</span>
          <span>-{formatMoney(totals.discount)}</span>
        </div>
      )}
      <div className="flex justify-between border-t border-border pt-2 text-h3 text-charcoal-900">
        <span>Total</span>
        <span>{formatMoney(totals.total)}</span>
      </div>
      {hasPendingPrices && <p className="text-caption text-charcoal-500">Some items are priced by weight — the final total may adjust slightly.</p>}
    </div>
  )
}
