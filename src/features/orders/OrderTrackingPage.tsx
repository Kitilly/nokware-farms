import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, PlayCircle } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { OrderTimeline } from '@/components/domain/orders/OrderTimeline'
import { TrackingMap } from '@/components/domain/orders/TrackingMap'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { featureFlags } from '@/config/feature-flags'
import { useOrdersStore } from '@/store/orders.store'

export function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const orders = useOrdersStore((s) => s.orders)
  const updateOrder = useOrdersStore((s) => s.updateOrder)
  const order = orders.find((o) => o.id === orderId) ?? null

  if (!featureFlags.liveTracking) {
    return (
      <AppShell>
        <ErrorState title="Tracking unavailable" body="Live tracking isn’t enabled for this order." action={<Button onClick={() => navigate('/orders')}>Back to orders</Button>} className="pt-20" />
      </AppShell>
    )
  }

  if (!order) {
    return (
      <AppShell>
        <ErrorState title="Order not found" body="We couldn’t find this order." action={<Button onClick={() => navigate('/orders')}>Back to orders</Button>} className="pt-20" />
      </AppShell>
    )
  }

  const nextIncompleteIndex = order.timelineEvents.findIndex((e) => !e.completed)
  const isOutForDelivery = order.timelineEvents.some((e) => (e.status === 'out-for-delivery' || e.status === 'on-the-way') && e.completed)
  const isLiveAnimal = order.timelineType === 'live-animal' || order.timelineType === 'mixed'
  const currentLabel = [...order.timelineEvents].reverse().find((e) => e.completed)?.label ?? 'Order placed'

  function handleAdvance() {
    if (!order || nextIncompleteIndex === -1) return
    const events = order.timelineEvents.map((e, i) => (i === nextIncompleteIndex ? { ...e, completed: true, timestamp: new Date().toISOString() } : e))
    const allDone = events.every((e) => e.completed)
    updateOrder(order.id, { timelineEvents: events, status: allDone ? 'completed' : order.status })
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-5 pb-10 pt-4 md:px-8">
        <button type="button" onClick={() => navigate(`/orders/${order.id}`)} className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Order details
        </button>

        <h1 className="text-h1 text-charcoal-900">Track order</h1>
        <p className="mt-1 text-body-lg text-charcoal-600">{order.orderNumber}</p>

        <TrackingMap isLiveAnimal={isLiveAnimal} isOutForDelivery={isOutForDelivery} className="mt-4" />

        <p className="mt-4 text-h3 text-charcoal-900">{currentLabel}</p>

        <div className="mt-5 rounded-lg border border-border p-4">
          <OrderTimeline events={order.timelineEvents} />
        </div>

        {order.status === 'active' && nextIncompleteIndex !== -1 && (
          <div className="mt-5 rounded-lg border border-dashed border-border-strong p-3.5">
            <p className="mb-2 text-caption font-medium uppercase tracking-wide text-charcoal-400">Demo control</p>
            <Button variant="outline" size="sm" leadingIcon={<PlayCircle className="h-4 w-4" />} onClick={handleAdvance}>
              Simulate: mark "{order.timelineEvents[nextIncompleteIndex].label}"
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  )
}
