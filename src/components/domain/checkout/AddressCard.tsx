import { Home, Briefcase, Building2, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Address, AddressLabel } from '@/types/address'

const labelIcons: Record<AddressLabel, typeof Home> = {
  Home: Home,
  Work: Briefcase,
  Dorm: Building2,
  Office: Briefcase,
  Other: MapPin,
}

interface AddressCardProps {
  address: Address
  selected?: boolean
  onSelect?: () => void
}

export function AddressCard({ address, selected, onSelect }: AddressCardProps) {
  const Icon = labelIcons[address.label]

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg border px-4 py-3.5 text-left transition-colors',
        selected ? 'border-forest-600 bg-forest-50' : 'border-border hover:bg-cream-200',
      )}
    >
      <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', selected ? 'bg-forest-600' : 'bg-cream-200')}>
        <Icon className={cn('h-4 w-4', selected ? 'text-cream-50' : 'text-charcoal-600')} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-body-lg font-medium text-charcoal-900">{address.customLabel || address.label}</p>
          {address.isDefault && <span className="rounded-full bg-cream-200 px-2 py-0.5 text-caption text-charcoal-600">Default</span>}
        </div>
        <p className="mt-0.5 truncate text-body text-charcoal-600">
          {address.line1}, {address.city}
        </p>
        {address.landmark && <p className="text-caption text-charcoal-400">Near {address.landmark}</p>}
      </div>
    </button>
  )
}
