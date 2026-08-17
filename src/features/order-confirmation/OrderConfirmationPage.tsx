import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MapPin, CreditCard, Package } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { ConfirmationState } from '@/components/ui/ConfirmationState'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatMoney } from '@/lib/currency'
import { useOrdersStore } from '@/store/orders.store'
import { useAnalytics } from '@/hooks/useAnalytics'

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { track } = useAnalytics()
  const orders = useOrdersStore((s) => s.orders)
  const [ready, setReady] = useState(false)

  const order = orders.find((o) => o.id === orderId) ?? null

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 150)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (order) track('order_viewed', { orderId: order.id })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id])

  if (!ready) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg px-5 pt-10 md:px-8">
          <Skeleton className="mx-auto h-16 w-16 rounded-full" />
          <Skeleton className="mx-auto mt-4 h-6 w-1/2" />
        </div>
      </AppShell>
    )
  }

  if (!order) {
    return (
      <AppShell>
        <ErrorState title="Order not found" body="We couldn’t find this order." action={<Button onClick={() => navigate('/orders')}>View orders</Button>} className="pt-20" />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-5 pb-10 pt-10 md:px-8">
        <ConfirmationState
          title="Order placed!"
          body={`Order ${order.orderNumber} has been confirmed.`}
        />

        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" aria-hidden="true" />
            <div>
              <p className="text-body-lg font-medium text-charcoal-900">Delivery address</p>
              {order.address ? (
                <p className="text-body text-charcoal-600">
                  {order.address.line1}, {order.address.city}
                </p>
              ) : (
                <p className="text-body text-charcoal-600">Pickup at farm store</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <Package className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-body-lg font-medium text-charcoal-900">
                {order.items.length} item{order.items.length > 1 ? 's' : ''}
              </p>
              <ul className="mt-1 space-y-0.5">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-body text-charcoal-600">
                    <span className="truncate pr-2">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="shrink-0">{formatMoney(item.itemTotal)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 flex justify-between border-t border-border pt-2 text-body-lg font-semibold text-charcoal-900">
                <span>Total</span>
                <span>{formatMoney(order.total)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" aria-hidden="true" />
            <div>
              <p className="text-body-lg font-medium text-charcoal-900">Payment</p>
              <p className="text-body text-charcoal-600">{order.paymentMethod.label}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Button fullWidth size="lg" onClick={() => navigate(`/orders/${order.id}/tracking`)}>
            Track order
          </Button>
          <Button fullWidth variant="outline" onClick={() => navigate('/home')}>
            Continue shopping
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
