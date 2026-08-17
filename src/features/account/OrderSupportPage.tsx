import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Truck, CreditCard, PackageX, RotateCcw, MessageCircleQuestion } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { SettingsRow } from '@/components/domain/account/SettingsRow'
import { ConfirmationState } from '@/components/ui/ConfirmationState'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { submitTicket } from '@/services/support'
import { useOrdersStore } from '@/store/orders.store'
import type { SupportTopic } from '@/types/support'

const topics: { topic: SupportTopic; label: string; icon: typeof Truck }[] = [
  { topic: 'delivery', label: 'Delivery issue with this order', icon: Truck },
  { topic: 'payment', label: 'Payment issue with this order', icon: CreditCard },
  { topic: 'product-quality', label: 'Product quality issue', icon: MessageCircleQuestion },
  { topic: 'damaged-incorrect-item', label: 'Item arrived damaged or incorrect', icon: PackageX },
  { topic: 'cancellation-refund', label: 'Cancellation or refund', icon: RotateCcw },
]

export function OrderSupportPage() {
  const navigate = useNavigate()
  const { orderId } = useParams<{ orderId: string }>()
  const orders = useOrdersStore((s) => s.orders)
  const order = orders.find((o) => o.id === orderId) ?? null
  const [submittedTopic, setSubmittedTopic] = useState<string | null>(null)

  if (!order) {
    return (
      <AppShell>
        <ErrorState title="Order not found" body="We couldn’t find this order." action={<Button onClick={() => navigate('/orders')}>Back to orders</Button>} className="pt-20" />
      </AppShell>
    )
  }

  async function handleSelectTopic(topic: SupportTopic, label: string) {
    await submitTicket({ topic, relatedOrderId: order!.id, message: `${label} — order ${order!.orderNumber}`, channel: 'in-app' })
    setSubmittedTopic(label)
  }

  if (submittedTopic) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg px-5 pt-10 md:px-8">
          <ConfirmationState
            title="We've got your report"
            body={`Our team will follow up about "${submittedTopic}" for order ${order.orderNumber}.`}
            action={<Button onClick={() => navigate(`/orders/${order.id}`)}>Back to order</Button>}
          />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-5 pt-4 md:px-8">
        <button type="button" onClick={() => navigate(`/orders/${order.id}`)} className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Order details
        </button>
        <h1 className="text-h1 text-charcoal-900">Get help</h1>
        <p className="mt-1 text-body-lg text-charcoal-600">Order {order.orderNumber}</p>

        <div className="mt-5 space-y-0.5">
          {topics.map((t) => (
            <SettingsRow key={t.topic} icon={<t.icon className="h-4 w-4 text-charcoal-600" />} label={t.label} onClick={() => handleSelectTopic(t.topic, t.label)} />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
