export type PaymentMethodType = 'mobile-money' | 'card' | 'bank-transfer' | 'cash-on-delivery'

export type PaymentState =
  | 'selected'
  | 'awaiting'
  | 'processing'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'retry'

export interface PaymentMethod {
  id: string
  type: PaymentMethodType
  isDefault: boolean
  label: string
  provider?: string
  maskedNumber?: string
  expiryDisplay?: string
  createdAt: string
}
