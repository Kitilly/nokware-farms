import { Truck, Store, PawPrint } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TrackingMapProps {
  isLiveAnimal?: boolean
  isOutForDelivery?: boolean
  className?: string
}

/**
 * A clearly-illustrative stand-in for a real live-tracking map — no map SDK
 * or live GPS is wired up in this demo.
 */
export function TrackingMap({ isLiveAnimal, isOutForDelivery, className }: TrackingMapProps) {
  const Icon = isLiveAnimal ? PawPrint : isOutForDelivery ? Truck : Store

  return (
    <div className={cn('relative flex h-44 w-full items-center justify-center overflow-hidden rounded-xl bg-sage-100', className)}>
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(100,120,93,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(100,120,93,0.25) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {isOutForDelivery && (
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path d="M 30 140 Q 150 40 340 90" fill="none" stroke="#1F4D36" strokeWidth="2" strokeDasharray="6 6" opacity="0.5" />
        </svg>
      )}
      <div className="relative flex flex-col items-center gap-1.5">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-600 shadow-sm">
          <Icon className="h-5 w-5 text-cream-50" aria-hidden="true" />
        </span>
        <span className="rounded-full bg-cream-50/90 px-3 py-1 text-caption font-medium text-charcoal-700 shadow-xs">
          {isOutForDelivery ? 'On the way' : 'At the farm'}
        </span>
      </div>
      <span className="absolute bottom-2 right-2 rounded bg-cream-50/80 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-charcoal-500">
        Demo map
      </span>
    </div>
  )
}
