import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Plus } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { PaymentMethodListItem } from '@/components/domain/account/PaymentMethodListItem'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { usePaymentStore } from '@/store/payment.store'

export function PaymentMethodsPage() {
  const navigate = useNavigate()
  const savedMethods = usePaymentStore((s) => s.savedMethods)
  const setDefaultPaymentMethod = usePaymentStore((s) => s.setDefaultPaymentMethod)
  const removePaymentMethod = usePaymentStore((s) => s.removePaymentMethod)

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-5 pt-4 md:px-8">
        <button type="button" onClick={() => navigate('/account')} className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Account
        </button>
        <h1 className="text-h1 text-charcoal-900">Payment methods</h1>

        {savedMethods.length === 0 ? (
          <EmptyState
            icon={<CreditCard className="h-7 w-7 text-charcoal-500" aria-hidden="true" />}
            title="No saved payment methods"
            body="Add a payment method for faster checkout."
            action={<Button onClick={() => navigate('/account/payment-methods/new')}>Add payment method</Button>}
            className="pt-10"
          />
        ) : (
          <div className="mt-5 space-y-3">
            {savedMethods.map((m) => (
              <PaymentMethodListItem key={m.id} method={m} onSetDefault={() => setDefaultPaymentMethod(m.id)} onDelete={() => removePaymentMethod(m.id)} />
            ))}
            <Button variant="outline" fullWidth leadingIcon={<Plus className="h-4 w-4" />} onClick={() => navigate('/account/payment-methods/new')}>
              Add payment method
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  )
}
