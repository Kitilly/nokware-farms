import { useMemo, useState } from 'react'
import { Sun, Sunset, Moon } from 'lucide-react'
import { formatShortDate } from '@/lib/date'
import { cn } from '@/lib/utils'
import type { DeliverySlot, SlotPeriod } from '@/types/delivery'

const periodIcons: Record<SlotPeriod, typeof Sun> = { morning: Sun, afternoon: Sunset, evening: Moon }
const periodLabels: Record<SlotPeriod, string> = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' }

interface DeliverySlotPickerProps {
  slots: DeliverySlot[]
  selectedSlotId?: string
  onSelect: (slot: DeliverySlot) => void
}

export function DeliverySlotPicker({ slots, selectedSlotId, onSelect }: DeliverySlotPickerProps) {
  const dates = useMemo(() => Array.from(new Set(slots.map((s) => s.date))), [slots])
  const [activeDate, setActiveDate] = useState(dates[0])

  const daySlots = slots.filter((s) => s.date === activeDate)

  return (
    <div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {dates.map((date) => (
          <button
            key={date}
            type="button"
            onClick={() => setActiveDate(date)}
            className={cn(
              'shrink-0 rounded-lg border px-3.5 py-2 text-body font-medium transition-colors',
              activeDate === date ? 'border-forest-600 bg-forest-600 text-cream-50' : 'border-border-strong text-charcoal-700 hover:bg-cream-200',
            )}
          >
            {formatShortDate(date)}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        {daySlots.map((slot) => {
          const Icon = periodIcons[slot.period]
          const selected = slot.id === selectedSlotId
          return (
            <button
              key={slot.id}
              type="button"
              disabled={!slot.available}
              onClick={() => onSelect(slot)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors',
                !slot.available && 'cursor-not-allowed opacity-60',
                selected ? 'border-forest-600 bg-forest-50' : 'border-border hover:bg-cream-200',
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0 text-charcoal-600" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-body-lg font-medium text-charcoal-900">
                  {periodLabels[slot.period]} · {slot.startTime}–{slot.endTime}
                </p>
                {!slot.available && slot.unavailableReason && <p className="text-caption text-charcoal-500">{slot.unavailableReason}</p>}
                {slot.available && slot.extraFee && <p className="text-caption text-charcoal-500">+GHS {slot.extraFee} handling fee</p>}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
