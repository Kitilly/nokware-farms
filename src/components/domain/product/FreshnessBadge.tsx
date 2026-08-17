import { Leaf } from 'lucide-react'

export function FreshnessBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-forest-50 px-2 py-0.5 text-caption font-medium text-forest-700">
      <Leaf className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>
  )
}
