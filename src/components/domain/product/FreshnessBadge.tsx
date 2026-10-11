import { Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FreshnessBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-forest-50 px-2 py-0.5 text-caption font-medium text-forest-700',
        className,
      )}
    >
      <Leaf className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>
  )
}
