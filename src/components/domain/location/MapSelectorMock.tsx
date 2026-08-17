import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MapSelectorMockProps {
  label?: string
  className?: string
}

/**
 * A stylized, clearly-illustrative stand-in for a real map provider — no
 * live map SDK is wired up in this demo. Shows a soft grid "map" texture
 * with a centered pin so the location step still feels spatial.
 */
export function MapSelectorMock({ label, className }: MapSelectorMockProps) {
  return (
    <div
      className={cn('relative flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-sage-100', className)}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(100,120,93,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(100,120,93,0.25) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.5), transparent 60%)' }}
      />
      <div className="relative flex flex-col items-center gap-1.5">
        <MapPin className="h-9 w-9 text-forest-700 drop-shadow-sm" strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} />
        {label && <span className="rounded-full bg-cream-50/90 px-3 py-1 text-caption font-medium text-charcoal-700 shadow-xs">{label}</span>}
      </div>
      <span className="absolute bottom-2 right-2 rounded bg-cream-50/80 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-charcoal-500">
        Demo map
      </span>
    </div>
  )
}
