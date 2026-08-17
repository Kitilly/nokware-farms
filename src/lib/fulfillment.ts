import type { CartItem } from '@/types/cart'
import type { FulfillmentType } from '@/types/product'

export type ProcessingTimeTier = 'standard' | 'extended'

export interface FulfillmentBucket {
  key: string
  fulfillmentType: FulfillmentType
  isLiveAnimal: boolean
  processingTimeTier: ProcessingTimeTier
  items: CartItem[]
  label: string
  description: string
  minLeadTimeHours: number
}

const EXTENDED_PROCESSING_THRESHOLD_HOURS = 24

function tierFor(hours: number): ProcessingTimeTier {
  return hours > EXTENDED_PROCESSING_THRESHOLD_HOURS ? 'extended' : 'standard'
}

function bucketLabel(fulfillmentType: FulfillmentType, isLiveAnimal: boolean, tier: ProcessingTimeTier): string {
  if (isLiveAnimal) return fulfillmentType === 'delivery' ? 'Live animal delivery' : 'Live animal pickup'
  if (tier === 'extended') return fulfillmentType === 'delivery' ? 'Fresh order — extended prep' : 'Pickup — extended prep'
  return fulfillmentType === 'delivery' ? 'Standard delivery' : 'Pickup'
}

function bucketDescription(
  fulfillmentType: FulfillmentType,
  isLiveAnimal: boolean,
  tier: ProcessingTimeTier,
): string {
  if (isLiveAnimal) {
    return fulfillmentType === 'delivery'
      ? 'Scheduled separately — live animals require transport arrangements.'
      : 'Ready for collection once transport is arranged with our team.'
  }
  if (tier === 'extended') {
    return 'Needs additional processing time before it can be fulfilled.'
  }
  return fulfillmentType === 'delivery' ? 'Delivered on your selected date and time slot.' : 'Ready for pickup at our farm store.'
}

/**
 * Groups cart items into visually and operationally distinct fulfillment
 * buckets. Grouping key = fulfillment type + live-animal flag + processing
 * time tier, so a live goat, a fresh chicken, and a slow-processing cut never
 * silently share one fulfillment path.
 */
export function groupCartItemsByFulfillment(items: CartItem[]): FulfillmentBucket[] {
  const buckets = new Map<string, FulfillmentBucket>()

  for (const item of items) {
    if (item.savedForLater) continue
    const fulfillmentType: FulfillmentType = item.fulfillmentTypes.includes('delivery') ? 'delivery' : 'pickup'
    const tier = tierFor(item.processingTimeHours)
    const key = `${fulfillmentType}|${item.isLiveAnimal ? 'live' : 'processed'}|${tier}`

    const existing = buckets.get(key)
    if (existing) {
      existing.items.push(item)
      existing.minLeadTimeHours = Math.max(existing.minLeadTimeHours, item.processingTimeHours)
      continue
    }

    buckets.set(key, {
      key,
      fulfillmentType,
      isLiveAnimal: item.isLiveAnimal,
      processingTimeTier: tier,
      items: [item],
      label: bucketLabel(fulfillmentType, item.isLiveAnimal, tier),
      description: bucketDescription(fulfillmentType, item.isLiveAnimal, tier),
      minLeadTimeHours: item.processingTimeHours,
    })
  }

  return Array.from(buckets.values())
}

export function isMixedFulfillmentCart(items: CartItem[]): boolean {
  return groupCartItemsByFulfillment(items).length > 1
}
