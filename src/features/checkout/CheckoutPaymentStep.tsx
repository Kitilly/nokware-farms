import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PaymentOptionCard } from '@/components/domain/checkout/PaymentOptionCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { featureFlags } from '@/config/feature-flags'
import { appConfig } from '@/config/app.config'
import { usePaymentStore } from '@/store/payment.store'
import { useCheckoutStore } from '@/store/checkout.store'
import type { PaymentMethodType } from '@/types/payment'

const allTypes: PaymentMethodType[] = ['mobile-money', 'card', 'bank-transfer', 'cash-on-delivery']

export function CheckoutPaymentStep() {
  const navigate = useNavigate()
  const savedMethods = usePaymentStore((s) => s.savedMethods)
  const addPaymentMethod = usePaymentStore((s) => s.addPaymentMethod)
  const paymentMethodId = useCheckoutStore((s) => s.paymentMethodId)
  const setPaymentMethodId = useCheckoutStore((s) => s.setPaymentMethodId)

  const [expandedType, setExpandedType] = useState<PaymentMethodType | null>(null)
  const [momoNumber, setMomoNumber] = useState('')
  const [cardLast4, setCardLast4] = useState('')
  const [error, setError] = useState<string | null>(null)

  const availableTypes = allTypes.filter((t) => t !== 'cash-on-delivery' || featureFlags.cashOnDelivery)

  function handleUseNew(type: PaymentMethodType) {
    if (type === 'mobile-money') {
      const digits = momoNumber.replace(/\D/g, '')
      if (digits.length !== appConfig.phone.nationalLength) {
        setError(`Enter a valid ${appConfig.phone.nationalLength}-digit mobile money number`)
        return
      }
      const method = addPaymentMethod({ type, isDefault: false, label: `Mobile Money •••${digits.slice(-4)}`, maskedNumber: digits.slice(-4) })
      setPaymentMethodId(method.id)
    } else if (type === 'card') {
      if (cardLast4.replace(/\D/g, '').length !== 4) {
        setError('Enter the last 4 digits of your card')
        return
      }
      const method = addPaymentMethod({ type, isDefault: false, label: `Card •••${cardLast4}`, maskedNumber: cardLast4, expiryDisplay: '12/28' })
      setPaymentMethodId(method.id)
    } else {
      const method = addPaymentMethod({ type, isDefault: false, label: type === 'bank-transfer' ? 'Bank Transfer' : 'Cash on Delivery' })
      setPaymentMethodId(method.id)
    }
    setError(null)
    setExpandedType(null)
  }

  function handleContinue() {
    if (!paymentMethodId) {
      setError('Select a payment method to continue')
      return
    }
    navigate('/checkout/summary')
  }

  return (
    <div>
      <h1 className="text-h2 text-charcoal-900">Payment method</h1>
      <p className="mt-1 text-body-lg text-charcoal-600">This is a demo checkout — no real charge will be made.</p>

      {savedMethods.length > 0 && (
        <div className="mt-5 space-y-2.5">
          <p className="text-body font-medium text-charcoal-800">Saved methods</p>
          {savedMethods.map((m) => (
            <PaymentOptionCard key={m.id} type={m.type} label={m.label} selected={paymentMethodId === m.id} onSelect={() => setPaymentMethodId(m.id)} />
          ))}
        </div>
      )}

      <div className="mt-5 space-y-2.5">
        <p className="text-body font-medium text-charcoal-800">Add a payment method</p>
        {availableTypes.map((type) => (
          <div key={type}>
            <PaymentOptionCard type={type} selected={expandedType === type} onSelect={() => setExpandedType(expandedType === type ? null : type)} />
            {expandedType === type && (
              <div className="mt-2 space-y-3 rounded-lg border border-border bg-cream-100 p-3.5">
                {type === 'mobile-money' && (
                  <Input label="Mobile money number" value={momoNumber} onChange={(e) => setMomoNumber(e.target.value)} placeholder={appConfig.phone.exampleFormat} />
                )}
                {type === 'card' && <Input label="Last 4 digits of card" value={cardLast4} onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="1234" />}
                {type === 'bank-transfer' && <p className="text-body text-charcoal-600">Transfer details will be shown after you place your order.</p>}
                {type === 'cash-on-delivery' && <p className="text-body text-charcoal-600">Pay with cash when your order is delivered.</p>}
                <Button size="sm" onClick={() => handleUseNew(type)}>
                  Use this method
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {error && <p className="mt-3 text-body text-error">{error}</p>}

      <Button fullWidth size="lg" className="mt-8" onClick={handleContinue}>
        Continue
      </Button>
    </div>
  )
}
