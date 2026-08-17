import { Smartphone, CreditCard, Landmark, Banknote, Star, Trash2 } from 'lucide-react'
import type { PaymentMethod, PaymentMethodType } from '@/types/payment'

const typeIcons: Record<PaymentMethodType, typeof Smartphone> = {
  'mobile-money': Smartphone,
  card: CreditCard,
  'bank-transfer': Landmark,
  'cash-on-delivery': Banknote,
}

interface PaymentMethodListItemProps {
  method: PaymentMethod
  onSetDefault: () => void
  onDelete: () => void
}

export function PaymentMethodListItem({ method, onSetDefault, onDelete }: PaymentMethodListItemProps) {
  const Icon = typeIcons[method.type]

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-200">
        <Icon className="h-4 w-4 text-charcoal-600" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-body-lg font-medium text-charcoal-900">{method.label}</p>
          {method.isDefault && <span className="rounded-full bg-forest-50 px-2 py-0.5 text-caption text-forest-700">Default</span>}
        </div>
        {method.expiryDisplay && <p className="text-caption text-charcoal-500">Expires {method.expiryDisplay}</p>}
        <div className="mt-2 flex gap-4">
          {!method.isDefault && (
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
