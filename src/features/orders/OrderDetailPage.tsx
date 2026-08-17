import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Phone, CreditCard, LifeBuoy } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { OrderTimeline } from '@/components/domain/orders/OrderTimeline'
import { OrderReceipt } from '@/components/domain/orders/OrderReceipt'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { ErrorState } from '@/components/ui/ErrorState'
import { toast } from '@/components/ui/Toast'
import { formatMoney } from '@/lib/currency'
import { useOrdersStore } from '@/store/orders.store'
import { cancelOrder } from '@/services/orders'

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const orders = useOrdersStore((s) => s.orders)
  const updateOrder = useOrdersStore((s) => s.updateOrder)
  const order = orders.find((o) => o.id === orderId) ?? null

  const [cancelOpen, setCancelOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  if (!order) {
    return (
      <AppShell>
        <ErrorState title="Order not found" body="We couldn’t find this order." action={<Button onClick={() => navigate('/orders')}>Back to orders</Button>} className="pt-20" />
      </AppShell>
    )
  }

  const canCancel = order.status === 'active' && order.timelineEvents.filter((e) => e.completed).length <= 1

  async function handleCancel() {
    setIsCancelling(true)
    const updated = await cancelOrder(order!.id, 'Cancelled by customer before processing began.')
    updateOrder(order!.id, updated)
    setIsCancelling(false)
    setCancelOpen(false)
    toast.success('Order cancelled', `${order!.orderNumber} has been cancelled.`)
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-5 pb-10 pt-4 md:px-8">
        <button type="button" onClick={() => navigate('/orders')} className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to orders
        </button>

        <div className="flex items-center justify-between">
          <h1 className="text-h1 text-charcoal-900">{order.orderNumber}</h1>
          {order.status === 'active' && (
            <Button size="sm" variant="outline" onClick={() => navigate(`/orders/${order.id}/tracking`)}>
              Track
            </Button>
          )}
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-lg border border-border p-4">
            <p className="mb-3 text-body font-medium text-charcoal-800">Order timeline</p>
            <OrderTimeline events={order.timelineEvents} />
          </div>

          {order.address && (
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" aria-hidden="true" />
              <div>
                <p className="text-body-lg font-medium text-charcoal-900">Delivery address</p>
                <p className="text-body text-charcoal-600">
                  {order.address.line1}, {order.address.city}, {order.address.region}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" aria-hidden="true" />
            <div>
              <p className="text-body-lg font-medium text-charcoal-900">Contact</p>
              <p className="text-body text-charcoal-600">
                {order.contact.name} · {order.contact.phone}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" aria-hidden="true" />
            <div>
              <p className="text-body-lg font-medium text-charcoal-900">Payment</p>
              <p className="text-body text-charcoal-600">
                {order.paymentMethod.label} · {formatMoney(order.total)}
              </p>
            </div>
          </div>

          <OrderReceipt order={order} />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" fullWidth leadingIcon={<LifeBuoy className="h-4 w-4" />} onClick={() => navigate(`/account/support/order/${order.id}`)}>
              Get help with this order
            </Button>
            {canCancel && (
              <Button variant="destructive" fullWidth onClick={() => setCancelOpen(true)}>
                Cancel order
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen} title="Cancel this order?" description="This can’t be undone. You can request a refund via support afterward if you’ve already paid.">
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setCancelOpen(false)}>
            Keep order
          </Button>
          <Button variant="destructive" fullWidth isLoading={isCancelling} onClick={handleCancel}>
            Cancel order
          </Button>
        </div>
      </Dialog>
    </AppShell>
  )
}
