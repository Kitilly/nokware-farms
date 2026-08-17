import { useState } from 'react'
import { Tag, X, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cart.store'

export function PromoCodeField() {
  const promo = useCartStore((s) => s.promo)
  const promoError = useCartStore((s) => s.promoError)
  const isApplyingPromo = useCartStore((s) => s.isApplyingPromo)
  const applyPromoCode = useCartStore((s) => s.applyPromoCode)
  const removePromoCode = useCartStore((s) => s.removePromoCode)
  const [code, setCode] = useState('')

  if (promo) {
    return (
      <div className="flex items-center justify-between rounded-md bg-success-bg px-3.5 py-2.5">
        <span className="flex items-center gap-1.5 text-body font-medium text-success">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          {promo.code} applied — {promo.description}
        </span>
        <button type="button" aria-label="Remove promo code" onClick={removePromoCode} className="text-success hover:opacity-70">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" aria-hidden="true" />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Promo code"
            className="h-11 w-full rounded-md border border-border-strong bg-cream-50 pl-9 pr-3 text-body-lg text-charcoal-900 placeholder:text-charcoal-400 focus-visible:outline-none focus-visible:border-forest-500"
          />
        </div>
        <Button variant="outline" isLoading={isApplyingPromo} disabled={code.trim().length === 0} onClick={() => applyPromoCode(code)}>
          Apply
        </Button>
      </div>
      {promoError && <p className="mt-1.5 text-body text-error">{promoError}</p>}
    </div>
  )
}
