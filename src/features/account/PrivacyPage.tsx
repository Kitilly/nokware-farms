import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Info } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { SettingsRow } from '@/components/domain/account/SettingsRow'
import { Switch } from '@/components/ui/Switch'
import { Divider } from '@/components/ui/Divider'
import { copy } from '@/config/copy'
import { useSettingsStore } from '@/store/settings.store'

export function PrivacyPage() {
  const navigate = useNavigate()
  const locationPermissionGranted = useSettingsStore((s) => s.locationPermissionGranted)
  const setLocationPermission = useSettingsStore((s) => s.setLocationPermission)
  const marketingOptIn = useSettingsStore((s) => s.marketingOptIn)
  const setMarketingOptIn = useSettingsStore((s) => s.setMarketingOptIn)

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-5 pb-10 pt-4 md:px-8">
        <button type="button" onClick={() => navigate('/account')} className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Account
        </button>
        <h1 className="text-h1 text-charcoal-900">Privacy</h1>

        <p className="mt-3 flex items-start gap-2 rounded-md bg-warning-bg px-3.5 py-3 text-body text-warning">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {copy.legal.placeholderNotice}
        </p>

        <div className="mt-5 space-y-3 text-body text-charcoal-700">
          <div>
            <p className="font-medium text-charcoal-900">Information we collect</p>
            <p>Placeholder: account details (name, phone, email), delivery addresses, order history, and app usage data collected to operate and improve the service.</p>
          </div>
          <div>
            <p className="font-medium text-charcoal-900">How we use your information</p>
            <p>Placeholder: to process orders, arrange delivery, provide support, and — where you opt in — send promotional updates.</p>
          </div>
          <div>
            <p className="font-medium text-charcoal-900">Third-party services</p>
            <p>Placeholder: payment processing and delivery logistics may involve trusted third-party providers under their own privacy terms.</p>
          </div>
        </div>

        <Divider className="my-5" />

        <div className="space-y-0.5">
          <SettingsRow
            label="Location permission"
            description={locationPermissionGranted ? 'Enabled' : 'Disabled'}
            trailing={<Switch checked={locationPermissionGranted} onCheckedChange={setLocationPermission} label="Location permission" />}
          />
          <SettingsRow
            label="Marketing communications"
            description="Promotions, offers, and seasonal updates"
            trailing={<Switch checked={marketingOptIn} onCheckedChange={setMarketingOptIn} label="Marketing communications" />}
          />
          <SettingsRow label="Notification permission" to="/account/settings/notifications" description="Manage what we notify you about" />
        </div>

        <Divider className="my-5" />

        <div className="space-y-0.5">
          <SettingsRow label="Request my data" to="/account/privacy/data-request" />
          <SettingsRow label="Terms & privacy policy" to="/account/terms" />
        </div>
      </div>
    </AppShell>
  )
}
