import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { PaymentOptionCard } from '@/components/domain/checkout/PaymentOptionCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { featureFlags } from '@/config/feature-flags'
import { appConfig } from '@/config/app.config'
import { usePaymentStore } from '@/store/payment.store'
import type { PaymentMethodType } from '@/types/payment'

const allTypes: PaymentMethodType[] = ['mobile-money', 'card', 'bank-transfer', 'cash-on-delivery']

export function PaymentMethodFormPage() {
  const navigate = useNavigate()
  const addPaymentMethod = usePaymentStore((s) => s.addPaymentMethod)

  const [type, setType] = useState<PaymentMethodType>('mobile-money')
  const [momoNumber, setMomoNumber] = useState('')
  const [cardLast4, setCardLast4] = useState('')
  const [error, setError] = useState<string | null>(null)

  const availableTypes = allTypes.filter((t) => t !== 'cash-on-delivery' || featureFlags.cashOnDelivery)

  function handleSave() {
    if (type === 'mobile-money') {
      const digits = momoNumber.replace(/\D/g, '')
      if (digits.length !== appConfig.phone.nationalLength) {
        setError(`Enter a valid ${appConfig.phone.nationalLength}-digit mobile money number`)
        return
      }
      addPaymentMethod({ type, isDefault: false, label: `Mobile Money •••${digits.slice(-4)}`, maskedNumber: digits.slice(-4) })
    } else if (type === 'card') {
      if (cardLast4.replace(/\D/g, '').length !== 4) {
        setError('Enter the last 4 digits of your card')
        return
      }
      addPaymentMethod({ type, isDefault: false, label: `Card •••${cardLast4}`, maskedNumber: cardLast4, expiryDisplay: '12/28' })
    } else {
      addPaymentMethod({ type, isDefault: false, label: type === 'bank-transfer' ? 'Bank Transfer' : 'Cash on Delivery' })
    }
    toast.success('Payment method added')
    navigate('/account/payment-methods')
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-5 pt-4 md:px-8">
        <button type="button" onClick={() => navigate('/account/payment-methods')} className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Payment methods
        </button>
        <h1 className="text-h1 text-charcoal-900">Add payment method</h1>

        <div className="mt-5 space-y-2.5">
          {availableTypes.map((t) => (
            <PaymentOptionCard key={t} type={t} selected={type === t} onSelect={() => setType(t)} />
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {type === 'mobile-money' && (
            <Input label="Mobile money number" value={momoNumber} onChange={(e) => setMomoNumber(e.target.value)} placeholder={appConfig.phone.exampleFormat} />
          )}
          {type === 'card' && <Input label="Last 4 digits of card" value={cardLast4} onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="1234" />}
          {type === 'bank-transfer' && <p className="text-body text-charcoal-600">Transfer details will be shown after you place your order.</p>}
          {type === 'cash-on-delivery' && <p className="text-body text-charcoal-600">Pay with cash when your order is delivered.</p>}
        </div>

        {error && <p className="mt-3 text-body text-error">{error}</p>}

        <Button fullWidth size="lg" className="mt-6" onClick={handleSave}>
          Save payment method
        </Button>
      </div>
    </AppShell>
  )
}
