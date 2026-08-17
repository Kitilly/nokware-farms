export type SupportTopic =
  | 'order'
  | 'delivery'
  | 'payment'
  | 'product-quality'
  | 'damaged-incorrect-item'
  | 'cancellation-refund'
  | 'other'

export type SupportChannel = 'phone' | 'whatsapp' | 'email' | 'in-app'

export interface SupportTicket {
  id: string
  topic: SupportTopic
  relatedOrderId?: string
  message: string
  status: 'open' | 'in-progress' | 'resolved'
  createdAt: string
  channel: SupportChannel
}

export interface FaqEntry {
  id: string
  topic: SupportTopic | 'general'
  question: string
  answer: string
}
