import type { DeliverySlot, SlotPeriod } from '@/types/delivery'
import { addDays, toISODate } from '@/lib/date'

const periods: { period: SlotPeriod; startTime: string; endTime: string }[] = [
  { period: 'morning', startTime: '08:00', endTime: '11:00' },
  { period: 'afternoon', startTime: '12:00', endTime: '15:00' },
  { period: 'evening', startTime: '16:00', endTime: '19:00' },
]

/**
 * Generates a rolling window of delivery slots starting from `startDate`.
 * A handful of slots are deterministically marked unavailable/fully-booked
 * (with a reason) so the "why is this slot unavailable" states are always
 * exercisable in the demo, not left to chance.
 */
export function generateDeliverySlots(startDate: Date, days: number): DeliverySlot[] {
  const slots: DeliverySlot[] = []

  for (let dayOffset = 0; dayOffset < days; dayOffset += 1) {
    const date = addDays(startDate, dayOffset)
    const iso = toISODate(date)
    const isSunday = date.getDay() === 0

    for (const p of periods) {
      const id = `${iso}-${p.period}`
      let available = true
      let unavailableReason: string | undefined

      if (isSunday) {
        available = false
        unavailableReason = 'We don’t deliver on Sundays.'
      } else if (dayOffset === 0 && p.period !== 'evening') {
        available = false
        unavailableReason = 'Same-day slots need at least 6 hours’ notice — try this evening or tomorrow.'
      } else if (dayOffset === 1 && p.period === 'morning') {
        available = false
        unavailableReason = 'This slot is fully booked. Please choose another time.'
      }

      slots.push({
        id,
        date: iso,
        period: p.period,
        startTime: p.startTime,
        endTime: p.endTime,
        available,
        unavailableReason,
        requiresLeadTime: dayOffset === 0,
      })
    }
  }

  return slots
}
