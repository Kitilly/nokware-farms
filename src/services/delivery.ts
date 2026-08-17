import { mockRequest } from './_client'
import { generateDeliverySlots } from '@/data/mock/delivery-slots.seed'
import type { DeliverySlot } from '@/types/delivery'
import type { CartItem } from '@/types/cart'
import type { FulfillmentType } from '@/types/product'

export interface GetSlotsParams {
  startDate: Date
  days?: number
  fulfillmentType: FulfillmentType
}

export function getAvailableSlots(params: GetSlotsParams): Promise<DeliverySlot[]> {
  return mockRequest(() => generateDeliverySlots(params.startDate, params.days ?? 7))
}

export interface LeadTimeEstimate {
  minDate: string
  note: string
}

export function getLeadTimeEstimate(items: CartItem[]): Promise<LeadTimeEstimate> {
  return mockRequest(() => {
    const hasLiveAnimal = items.some((i) => i.isLiveAnimal)
    const maxProcessingHours = Math.max(0, ...items.map((i) => i.processingTimeHours))

    const minLeadDays = hasLiveAnimal ? 1 : maxProcessingHours > 24 ? 2 : 0
    const minDate = new Date(Date.now() + minLeadDays * 86_400_000).toISOString().slice(0, 10)

    const note = hasLiveAnimal
      ? 'Live animals need at least a day’s notice to arrange transport.'
      : maxProcessingHours > 24
        ? 'Some items need extra processing time before they can be fulfilled.'
        : 'Most items can be fulfilled the same day, subject to slot availability.'

    return { minDate, note }
  })
}
