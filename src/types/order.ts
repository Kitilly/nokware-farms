import type { CartItemSelection } from './cart'
import type { Address } from './address'
import type { DeliverySlot } from './delivery'
import type { PaymentMethodType } from './payment'
import type { FulfillmentType } from './product'

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'ready'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'

export type LiveAnimalOrderStatus =
  | 'placed'
  | 'preparing-transport'
  | 'transport-scheduled'
  | 'on-the-way'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  productId: string
  productSlug: string
  productType: 'live-animal' | 'meat-product'
  name: string
  image: string
  selection: CartItemSelection
  quantity: number
  unitPrice: number
  itemTotal: number
  priceUnit: string
  isPricePending: boolean
  fulfillmentGroupId: string
}

export interface FulfillmentGroup {
  id: string
  type: FulfillmentType
  isLiveAnimal: boolean
  itemIds: string[]
  estimatedDateLabel: string
  slot: DeliverySlot | null
  extraFee?: number
  leadTimeNote?: string
}

export interface OrderTimelineEvent {
  status: OrderStatus | LiveAnimalOrderStatus
  label: string
  description?: string
  timestamp: string | null
  completed: boolean
}

export type OrderLifecycleStatus = 'active' | 'completed' | 'cancelled'
export type OrderPaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded'

export interface Order {
  id: string
  orderNumber: string
  createdAt: string
  status: OrderLifecycleStatus
  items: OrderItem[]
  fulfillmentGroups: FulfillmentGroup[]
  address: Address | null
  contact: { name: string; phone: string }
  paymentMethod: { type: PaymentMethodType; label: string }
  paymentStatus: OrderPaymentStatus
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  timelineType: 'standard' | 'live-animal' | 'mixed'
  timelineEvents: OrderTimelineEvent[]
  cancellationReason?: string
  supportTicketIds?: string[]
}

export interface OrderDraft {
  items: OrderItem[]
  fulfillmentGroups: FulfillmentGroup[]
  address: Address | null
  contact: { name: string; phone: string }
  paymentMethodId: string
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
}
