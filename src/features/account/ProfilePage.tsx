import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { validateName, validateEmail, formatMaskedPhone } from '@/lib/validators'
import { useProfileStore } from '@/store/profile.store'
import { useAuthStore } from '@/store/auth.store'

export function ProfilePage() {
  const navigate = useNavigate()
  const { firstName, lastName, email, setProfile } = useProfileStore()
  const user = useAuthStore((s) => s.user)

  const [form, setForm] = useState({ firstName, lastName, email })
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string }>({})

  function handleSave() {
    const firstNameResult = validateName(form.firstName, 'First name')
    const lastNameResult = validateName(form.lastName, 'Last name')
    const emailResult = validateEmail(form.email)
    if (!firstNameResult.valid || !lastNameResult.valid || !emailResult.valid) {
      setErrors({ firstName: firstNameResult.message, lastName: lastNameResult.message, email: emailResult.message })
      return
    }
    setProfile({ firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim() })
    setErrors({})
    toast.success('Profile updated')
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-5 pt-4 md:px-8">
        <button type="button" onClick={() => navigate('/account')} className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Account
        </button>
        <h1 className="text-h1 text-charcoal-900">Profile</h1>

        <div className="mt-5 flex justify-center">
          <Avatar firstName={form.firstName} lastName={form.lastName} size="lg" />
        </div>

        <div className="mt-6 space-y-4">
          <Input label="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} error={errors.firstName} />
          <Input label="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} error={errors.lastName} />
          <Input label="Email (optional)" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
          <div>
            <label className="mb-1.5 block text-body font-medium text-charcoal-800">Phone number</label>
            <div className="flex h-11 items-center justify-between rounded-md border border-border bg-cream-200 px-3.5 text-body-lg text-charcoal-600">
              {user ? formatMaskedPhone(user.phone) : '—'}
              <button type="button" onClick={() => navigate('/account/settings/security')} className="text-caption font-medium text-forest-700 hover:underline">
                Manage
              </button>
            </div>
          </div>
        </div>

        <Button fullWidth size="lg" className="mt-8" onClick={handleSave}>
          Save changes
        </Button>
      </div>
    </AppShell>
  )
}
