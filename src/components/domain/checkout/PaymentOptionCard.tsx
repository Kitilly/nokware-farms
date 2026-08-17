import { Smartphone, CreditCard, Landmark, Banknote } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PaymentMethodType } from '@/types/payment'

const typeConfig: Record<PaymentMethodType, { label: string; description: string; icon: typeof Smartphone }> = {
  'mobile-money': { label: 'Mobile Money', description: 'MTN, Vodafone, AirtelTigo', icon: Smartphone },
  card: { label: 'Bank Card', description: 'Visa, Mastercard', icon: CreditCard },
  'bank-transfer': { label: 'Bank Transfer', description: 'Direct transfer', icon: Landmark },
  'cash-on-delivery': { label: 'Cash on Delivery', description: 'Pay when your order arrives', icon: Banknote },
}

interface PaymentOptionCardProps {
  type: PaymentMethodType
  label?: string
  selected?: boolean
  onSelect?: () => void
}

export function PaymentOptionCard({ type, label, selected, onSelect }: PaymentOptionCardProps) {
  const { label: defaultLabel, description, icon: Icon } = typeConfig[type]

  return (
    <button
      type="button"
      disabled={!onSelect}
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg border px-4 py-3.5 text-left transition-colors',
        selected ? 'border-forest-600 bg-forest-50' : 'border-border hover:bg-cream-200',
      )}
    >
      <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', selected ? 'bg-forest-600' : 'bg-cream-200')}>
        <Icon className={cn('h-4 w-4', selected ? 'text-cream-50' : 'text-charcoal-600')} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body-lg font-medium text-charcoal-900">{label ?? defaultLabel}</p>
        <p className="text-body text-charcoal-500">{description}</p>
      </div>
    </button>
  )
}
