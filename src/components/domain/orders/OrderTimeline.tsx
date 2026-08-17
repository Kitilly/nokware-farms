import { Check } from 'lucide-react'
import { formatFullDate, formatTime } from '@/lib/date'
import { cn } from '@/lib/utils'
import type { OrderTimelineEvent } from '@/types/order'

export function OrderTimeline({ events }: { events: OrderTimelineEvent[] }) {
  const activeIndex = [...events].reverse().findIndex((e) => e.completed)
  const currentIndex = activeIndex === -1 ? -1 : events.length - 1 - activeIndex

  return (
    <ol>
      {events.map((event, i) => {
        const isCurrent = i === currentIndex
        return (
          <li key={event.status} className="relative flex gap-3 pb-6 last:pb-0">
            {i < events.length - 1 && (
              <span className={cn('absolute left-[13px] top-6 h-full w-0.5', event.completed ? 'bg-forest-600' : 'bg-border-strong')} />
            )}
            <span
              className={cn(
                'z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                event.completed ? 'bg-forest-600' : 'border-2 border-border-strong bg-cream-50',
                isCurrent && 'ring-4 ring-forest-100',
              )}
            >
              {event.completed && <Check className="h-3.5 w-3.5 text-cream-50" aria-hidden="true" />}
            </span>
            <div className="pb-1">
              <p className={cn('text-body-lg font-medium', event.completed ? 'text-charcoal-900' : 'text-charcoal-400')}>{event.label}</p>
              {event.timestamp && (
                <p className="text-caption text-charcoal-500">
                  {formatFullDate(event.timestamp)} · {formatTime(event.timestamp)}
                </p>
              )}
              {event.description && <p className="mt-0.5 text-body text-charcoal-500">{event.description}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
