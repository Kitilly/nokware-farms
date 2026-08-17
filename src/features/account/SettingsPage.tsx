import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell, Shield, Accessibility, Globe, DollarSign, MapPin } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { SettingsRow } from '@/components/domain/account/SettingsRow'
import { Divider } from '@/components/ui/Divider'
import { Switch } from '@/components/ui/Switch'
import { useSettingsStore } from '@/store/settings.store'

export function SettingsPage() {
  const navigate = useNavigate()
  const locationPermissionGranted = useSettingsStore((s) => s.locationPermissionGranted)
  const setLocationPermission = useSettingsStore((s) => s.setLocationPermission)
  const language = useSettingsStore((s) => s.language)
  const currency = useSettingsStore((s) => s.currency)

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-5 pt-4 md:px-8">
        <button type="button" onClick={() => navigate('/account')} className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Account
        </button>
        <h1 className="text-h1 text-charcoal-900">Settings</h1>

        <div className="mt-5 space-y-0.5">
          <SettingsRow icon={<Bell className="h-4 w-4 text-charcoal-600" />} label="Notifications" to="/account/settings/notifications" />
          <SettingsRow icon={<Shield className="h-4 w-4 text-charcoal-600" />} label="Security" to="/account/settings/security" />
          <SettingsRow icon={<Accessibility className="h-4 w-4 text-charcoal-600" />} label="Accessibility" to="/account/settings/accessibility" />
        </div>

        <Divider className="my-4" />

        <div className="space-y-0.5">
          <SettingsRow
            icon={<MapPin className="h-4 w-4 text-charcoal-600" />}
            label="Location permission"
            description={locationPermissionGranted ? 'Enabled' : 'Disabled'}
            trailing={<Switch checked={locationPermissionGranted} onCheckedChange={setLocationPermission} label="Location permission" />}
          />
          <SettingsRow icon={<Globe className="h-4 w-4 text-charcoal-600" />} label="Language" description={language === 'en' ? 'English' : language} trailing={<span className="text-body text-charcoal-500">English</span>} />
          <SettingsRow icon={<DollarSign className="h-4 w-4 text-charcoal-600" />} label="Currency" trailing={<span className="text-body text-charcoal-500">{currency}</span>} />
        </div>

        <p className="mt-6 text-center text-caption text-charcoal-400">App version 1.0.0 (Demo)</p>
      </div>
    </AppShell>
  )
}
