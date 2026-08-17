import { Link } from 'react-router-dom'
import { ChevronRight, Package } from 'lucide-react'
import { StatusBadge, type StatusTone } from '@/components/ui/StatusBadge'
import { formatMoney } from '@/lib/currency'
import { formatFullDate } from '@/lib/date'
import type { Order, OrderPaymentStatus } from '@/types/order'

const paymentStatusConfig: Record<OrderPaymentStatus, { label: string; tone: StatusTone }> = {
  pending: { label: 'Payment pending', tone: 'warning' },
  processing: { label: 'Payment processing', tone: 'info' },
  paid: { label: 'Paid', tone: 'success' },
  failed: { label: 'Payment failed', tone: 'error' },
  refunded: { label: 'Refunded', tone: 'neutral' },
}

function latestStatusLabel(order: Order): string {
  const lastCompleted = [...order.timelineEvents].reverse().find((e) => e.completed)
  return lastCompleted?.label ?? 'Placed'
}

export function OrderCard({ order }: { order: Order }) {
  const payment = paymentStatusConfig[order.paymentStatus]

  return (
    <Link to={`/orders/${order.id}`} className="flex items-center gap-3 rounded-lg border border-border bg-cream-50 p-4 transition-colors hover:bg-cream-200">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-200">
        <Package className="h-5 w-5 text-charcoal-600" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-body-lg font-medium text-charcoal-900">{order.orderNumber}</p>
          <p className="text-body-lg font-semibold text-charcoal-900">{formatMoney(order.total)}</p>
        </div>
        <p className="text-body text-charcoal-500">
          {formatFullDate(order.createdAt)} · {order.items.length} item{order.items.length > 1 ? 's' : ''}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <StatusBadge tone={payment.tone} label={payment.label} size="sm" />
          {order.status !== 'cancelled' && <StatusBadge tone="info" label={latestStatusLabel(order)} size="sm" />}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-charcoal-400" aria-hidden="true" />
    </Link>
  )
}
