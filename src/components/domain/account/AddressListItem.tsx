import { Home, Briefcase, Building2, MapPin, Star, Trash2 } from 'lucide-react'
import type { Address, AddressLabel } from '@/types/address'

const labelIcons: Record<AddressLabel, typeof Home> = {
  Home: Home,
  Work: Briefcase,
  Dorm: Building2,
  Office: Briefcase,
  Other: MapPin,
}

interface AddressListItemProps {
  address: Address
  onSetDefault: () => void
  onDelete: () => void
}

export function AddressListItem({ address, onSetDefault, onDelete }: AddressListItemProps) {
  const Icon = labelIcons[address.label]

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-200">
        <Icon className="h-4 w-4 text-charcoal-600" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-body-lg font-medium text-charcoal-900">{address.customLabel || address.label}</p>
          {address.isDefault && <span className="rounded-full bg-forest-50 px-2 py-0.5 text-caption text-forest-700">Default</span>}
        </div>
        <p className="mt-0.5 text-body text-charcoal-600">
          {address.line1}, {address.city}, {address.region}
        </p>
        {address.landmark && <p className="text-caption text-charcoal-400">Near {address.landmark}</p>}
        <div className="mt-2 flex gap-4">
          {!address.isDefault && (
            <button type="button" onClick={onSetDefault} className="flex items-center gap-1 text-caption font-medium text-forest-700 hover:underline">
              <Star className="h-3 w-3" aria-hidden="true" /> Set as default
            </button>
          )}
          <button type="button" onClick={onDelete} className="flex items-center gap-1 text-caption font-medium text-error hover:underline">
            <Trash2 className="h-3 w-3" aria-hidden="true" /> Remove
          </button>
        </div>
      </div>
    </div>
  )
}
