import { mockRequest } from './_client'
import { generateId, generateOrderNumber } from '@/lib/id'
import { ordersSeed } from '@/data/mock/orders.seed'
import type { Order, OrderDraft, OrderLifecycleStatus, OrderTimelineEvent } from '@/types/order'

let orders: Order[] = [...ordersSeed]

function buildTimeline(timelineType: Order['timelineType']): OrderTimelineEvent[] {
  const now = new Date().toISOString()
  if (timelineType === 'live-animal') {
    return [
      { status: 'placed', label: 'Order placed', timestamp: now, completed: true },
      { status: 'preparing-transport', label: 'Preparing animal for transport', timestamp: null, completed: false },
      { status: 'transport-scheduled', label: 'Transport scheduled', timestamp: null, completed: false },
      { status: 'on-the-way', label: 'On the way', timestamp: null, completed: false },
      { status: 'delivered', label: 'Delivered', timestamp: null, completed: false },
    ]
  }
  return [
    { status: 'placed', label: 'Order placed', timestamp: now, completed: true },
    { status: 'confirmed', label: 'Farm confirmed', timestamp: null, completed: false },
    { status: 'processing', label: 'Processing', timestamp: null, completed: false },
    { status: 'ready', label: 'Ready', timestamp: null, completed: false },
    { status: 'out-for-delivery', label: 'Out for delivery', timestamp: null, completed: false },
    { status: 'delivered', label: 'Delivered', timestamp: null, completed: false },
  ]
}

export function createOrder(draft: OrderDraft, paymentLabel: { type: Order['paymentMethod']['type']; label: string }): Promise<Order> {
  return mockRequest(
    () => {
      const hasLiveAnimal = draft.fulfillmentGroups.some((g) => g.isLiveAnimal)
      const isMixed = new Set(draft.fulfillmentGroups.map((g) => g.type)).size > 1 || draft.fulfillmentGroups.length > 1
      const timelineType: Order['timelineType'] = hasLiveAnimal ? (isMixed ? 'mixed' : 'live-animal') : 'standard'

      const order: Order = {
        id: generateId('order'),
        orderNumber: generateOrderNumber(),
        createdAt: new Date().toISOString(),
        status: 'active',
        items: draft.items,
        fulfillmentGroups: draft.fulfillmentGroups,
        address: draft.address,
        contact: draft.contact,
        paymentMethod: paymentLabel,
        paymentStatus: 'paid',
        subtotal: draft.subtotal,
        deliveryFee: draft.deliveryFee,
        discount: draft.discount,
        total: draft.total,
        timelineType,
        timelineEvents: buildTimeline(timelineType === 'mixed' ? 'live-animal' : timelineType),
      }

      orders = [order, ...orders]
      return order
    },
    { minDelayMs: 600, maxDelayMs: 1100 },
  )
}

export function getOrders(status?: OrderLifecycleStatus): Promise<Order[]> {
  return mockRequest(() => (status ? orders.filter((o) => o.status === status) : [...orders]))
}

export function getOrderById(id: string): Promise<Order | null> {
  return mockRequest(() => orders.find((o) => o.id === id) ?? null)
}

export function cancelOrder(id: string, reason: string): Promise<Order> {
  return mockRequest(() => {
    orders = orders.map((o) =>
      o.id === id
        ? {
            ...o,
            status: 'cancelled' as const,
            cancellationReason: reason,
            timelineEvents: [
              ...o.timelineEvents,
              { status: 'cancelled' as const, label: 'Cancelled', timestamp: new Date().toISOString(), completed: true },
            ],
          }
        : o,
    )
    const updated = orders.find((o) => o.id === id)
    if (!updated) throw new Error('Order not found')
    return updated
  })
}

export function requestRefund(id: string, _reason: string): Promise<{ success: boolean }> {
  return mockRequest(() => {
    orders = orders.map((o) => (o.id === id ? { ...o, paymentStatus: 'refunded' as const } : o))
    return { success: true }
  })
}

export function getOrderTracking(id: string): Promise<{ events: OrderTimelineEvent[] }> {
  return mockRequest(() => {
    const order = orders.find((o) => o.id === id)
    if (!order) return { events: [] }
    return { events: order.timelineEvents }
  })
}
