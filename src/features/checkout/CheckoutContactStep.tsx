import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { validateName, validatePhone } from '@/lib/validators'
import { appConfig } from '@/config/app.config'
import { useProfileStore } from '@/store/profile.store'
import { useCheckoutStore } from '@/store/checkout.store'

export function CheckoutContactStep() {
  const navigate = useNavigate()
  const { firstName, lastName } = useProfileStore()
  const contactName = useCheckoutStore((s) => s.contactName)
  const contactPhone = useCheckoutStore((s) => s.contactPhone)
  const setContact = useCheckoutStore((s) => s.setContact)

  const [name, setName] = useState(contactName || `${firstName} ${lastName}`.trim())
  const [phone, setPhone] = useState(contactPhone || '')
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})

  function handleContinue() {
    const nameResult = validateName(name, 'Name')
    const phoneResult = validatePhone(phone)
    if (!nameResult.valid || !phoneResult.valid) {
      setErrors({ name: nameResult.message, phone: phoneResult.message })
      return
    }
    setContact(name.trim(), `${appConfig.phone.dialCode} ${phone}`)
    navigate('/checkout/payment')
  }

  return (
    <div>
      <h1 className="text-h2 text-charcoal-900">Contact details</h1>
      <p className="mt-1 text-body-lg text-charcoal-600">We’ll use this to reach you about your delivery.</p>

      <div className="mt-5 space-y-4">
        <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <Input
          label="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ''))}
          error={errors.phone}
          placeholder={appConfig.phone.exampleFormat}
        />
      </div>

      <Button fullWidth size="lg" className="mt-8" onClick={handleContinue}>
        Continue
      </Button>
    </div>
  )
}
