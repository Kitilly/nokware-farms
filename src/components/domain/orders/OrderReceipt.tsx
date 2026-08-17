import { formatMoney } from '@/lib/currency'
import { formatFullDate } from '@/lib/date'
import type { Order } from '@/types/order'

export function OrderReceipt({ order }: { order: Order }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <p className="text-body-lg font-medium text-charcoal-900">{order.orderNumber}</p>
          <p className="text-caption text-charcoal-500">{formatFullDate(order.createdAt)}</p>
        </div>
      </div>

      <ul className="divide-y divide-border">
        {order.items.map((item, i) => {
          const selectionLabel = [item.selection.cutName, item.selection.weightLabel].filter(Boolean).join(' · ')
          return (
            <li key={i} className="flex items-center justify-between gap-2 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-body-lg text-charcoal-800">
                  {item.quantity}× {item.name}
                </p>
                {selectionLabel && <p className="text-caption text-charcoal-500">{selectionLabel}</p>}
              </div>
              <span className="shrink-0 text-body-lg text-charcoal-800">{formatMoney(item.itemTotal)}</span>
            </li>
          )
        })}
      </ul>

      <div className="space-y-1.5 border-t border-border pt-3">
        <div className="flex justify-between text-body text-charcoal-600">
          <span>Subtotal</span>
          <span>{formatMoney(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-body text-charcoal-600">
          <span>Delivery fee</span>
          <span>{order.deliveryFee > 0 ? formatMoney(order.deliveryFee) : 'Free'}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-body text-success">
            <span>Discount</span>
            <span>-{formatMoney(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-h3 text-charcoal-900">
          <span>Total</span>
          <span>{formatMoney(order.total)}</span>
        </div>
      </div>
    </div>
  )
}
