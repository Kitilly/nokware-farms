import { resolveIcon } from '@/lib/icon-registry'
import { cn } from '@/lib/utils'
import type { MediaTreatment } from '@/data/mock/images'

interface MediaPlaceholderProps {
  treatment: MediaTreatment
  alt: string
  className?: string
  iconClassName?: string
}

export function MediaPlaceholder({ treatment, alt, className, iconClassName }: MediaPlaceholderProps) {
  const Icon = resolveIcon(treatment.icon)

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn('relative flex items-center justify-center overflow-hidden', className)}
      style={{
        backgroundImage: `linear-gradient(155deg, ${treatment.gradientFrom} 0%, ${treatment.gradientTo} 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18), transparent 55%)' }}
      />
      <Icon className={cn('relative text-cream-50/80', iconClassName ?? 'h-10 w-10')} strokeWidth={1.5} aria-hidden="true" />
    </div>
  )
}
