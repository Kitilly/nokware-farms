import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Switch } from '@/components/ui/Switch'
import { Divider } from '@/components/ui/Divider'
import { useNotificationsStore } from '@/store/notifications.store'
import { transactionalCategories, promotionalCategories } from '@/types/notification'
import type { NotificationCategory } from '@/types/notification'

const categoryLabels: Record<NotificationCategory, string> = {
  order: 'Order updates',
  payment: 'Payment updates',
  delivery: 'Delivery updates',
  inventory: 'Stock & availability',
  promotions: 'Promotions & offers',
  seasonal: 'Farm & seasonal updates',
}

export function NotificationSettingsPage() {
  const navigate = useNavigate()
  const preferences = useNotificationsStore((s) => s.preferences)
  const setPreference = useNotificationsStore((s) => s.setPreference)

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-5 pt-4 md:px-8">
        <button type="button" onClick={() => navigate('/account/settings')} className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Settings
        </button>
        <h1 className="text-h1 text-charcoal-900">Notification preferences</h1>

        <p className="mt-4 text-body font-medium text-charcoal-800">Transactional</p>
        <p className="mb-2 text-caption text-charcoal-500">Updates about your orders — recommended to keep on.</p>
        <div className="space-y-1">
          {transactionalCategories.map((cat) => (
            <div key={cat} className="flex items-center justify-between rounded-lg px-3 py-2.5">
              <span className="text-body-lg text-charcoal-800">{categoryLabels[cat]}</span>
              <Switch checked={preferences[cat]} onCheckedChange={(v) => setPreference(cat, v)} label={categoryLabels[cat]} />
            </div>
          ))}
        </div>

        <Divider className="my-4" />

        <p className="text-body font-medium text-charcoal-800">Promotional</p>
        <p className="mb-2 text-caption text-charcoal-500">Deals, seasonal offers, and farm news.</p>
        <div className="space-y-1">
          {promotionalCategories.map((cat) => (
            <div key={cat} className="flex items-center justify-between rounded-lg px-3 py-2.5">
              <span className="text-body-lg text-charcoal-800">{categoryLabels[cat]}</span>
              <Switch checked={preferences[cat]} onCheckedChange={(v) => setPreference(cat, v)} label={categoryLabels[cat]} />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
