import type { FulfillmentType } from './product'

export interface CartItemSelection {
  cutId?: string
  cutName?: string
  weightOptionId?: string
  weightLabel?: string
  customWeightKg?: number
  preparationIds?: string[]
  preparationLabels?: string[]
}

export interface CartItem {
  id: string
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
  fulfillmentTypes: FulfillmentType[]
  isLiveAnimal: boolean
  processingTimeHours: number
  isPricePending: boolean
  savedForLater: boolean
  addedAt: string
}

export interface CartPromo {
  code: string
  description: string
  discountType: 'percentage' | 'flat'
  discountValue: number
  appliedAmount: number
}

export interface Cart {
  items: CartItem[]
  promo?: CartPromo
  subtotal: number
  deliveryFee: number
  serviceCharge: number
  tax: number
  discount: number
  total: number
}
