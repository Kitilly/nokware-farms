import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Info } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { copy } from '@/config/copy'
import { appConfig } from '@/config/app.config'

export function TermsPage() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-5 pb-10 pt-4 md:px-8">
        <button type="button" onClick={() => navigate('/account')} className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Account
        </button>
        <h1 className="text-h1 text-charcoal-900">Terms & policies</h1>

        <p className="mt-3 flex items-start gap-2 rounded-md bg-warning-bg px-3.5 py-3 text-body text-warning">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {copy.legal.placeholderNotice}
        </p>

        <div className="mt-5 space-y-4 text-body text-charcoal-700">
          <div>
            <p className="font-medium text-charcoal-900">1. Orders & fulfillment</p>
            <p>Placeholder: orders are subject to product availability. Live animal weights are approximate; final size is confirmed before dispatch. Some fresh meat pricing is estimated and adjusted to the exact weight at packing.</p>
          </div>
          <div>
            <p className="font-medium text-charcoal-900">2. Payments</p>
            <p>Placeholder: {appConfig.brand.name} accepts mobile money, bank card, and bank transfer where available. This demo does not process real payments.</p>
          </div>
          <div>
            <p className="font-medium text-charcoal-900">3. Delivery & pickup</p>
            <p>Placeholder: delivery is available within our configured service area. Live animals and select products may require additional lead time to arrange transport.</p>
          </div>
          <div>
            <p className="font-medium text-charcoal-900">4. Cancellations & refunds</p>
            <p>Placeholder: orders can typically be cancelled before processing begins. Refund eligibility depends on order status and product type.</p>
          </div>
          <div>
            <p className="font-medium text-charcoal-900">5. Privacy</p>
            <p>
              See our <button type="button" onClick={() => navigate('/account/privacy')} className="text-forest-700 underline">Privacy page</button> for details on how we handle your information.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
