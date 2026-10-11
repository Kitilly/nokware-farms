import { resolveIcon } from '@/lib/icon-registry'
import { cn } from '@/lib/utils'
import type { MediaTreatment } from '@/data/mock/images'

interface MediaPlaceholderProps {
  treatment: MediaTreatment
  alt: string
  className?: string
  iconClassName?: string
}

// Fine film grain + soft contour lines, inlined so the treatment renders offline.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
const CONTOURS =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' fill='none' stroke='white' stroke-width='1'%3E%3Cpath d='M-20 60c40-30 80 30 120 0s80-30 120 0 60 20 60 20'/%3E%3Cpath d='M-20 110c40-30 80 30 120 0s80-30 120 0 60 20 60 20'/%3E%3Cpath d='M-20 160c40-30 80 30 120 0s80-30 120 0 60 20 60 20'/%3E%3Cpath d='M-20 210c40-30 80 30 120 0s80-30 120 0 60 20 60 20'/%3E%3C/svg%3E\")"

export function MediaPlaceholder({ treatment, alt, className, iconClassName }: MediaPlaceholderProps) {
  const Icon = resolveIcon(treatment.icon)

  return (
    <div
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={cn('relative isolate flex items-center justify-center overflow-hidden', className)}
      style={{
        backgroundImage: `linear-gradient(155deg, ${treatment.gradientFrom} 0%, ${treatment.gradientTo} 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(120% 90% at 25% 15%, rgba(255,250,235,0.22), transparent 60%)' }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: CONTOURS, backgroundSize: '240px 240px' }} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      <Icon
        className="pointer-events-none absolute -bottom-[12%] -right-[8%] h-[70%] w-auto text-cream-50/[0.06]"
        strokeWidth={1}
        aria-hidden="true"
      />
      <Icon className={cn('relative text-cream-50/85 drop-shadow-sm', iconClassName ?? 'h-10 w-10')} strokeWidth={1.25} aria-hidden="true" />
    </div>
  )
}
