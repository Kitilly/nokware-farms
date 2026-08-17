export type SlotPeriod = 'morning' | 'afternoon' | 'evening'

export interface DeliverySlot {
  id: string
  date: string
  period: SlotPeriod
  startTime: string
  endTime: string
  available: boolean
  unavailableReason?: string
  extraFee?: number
  requiresLeadTime?: boolean
}
