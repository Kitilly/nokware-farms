import { useNavigate } from 'react-router-dom'
import {
  User,
  MapPin,
  CreditCard,
  ClipboardList,
  Heart,
  Bell,
  Settings,
  Shield,
  LifeBuoy,
  FileText,
  Tractor,
  LogOut,
} from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Avatar } from '@/components/ui/Avatar'
import { SettingsRow } from '@/components/domain/account/SettingsRow'
import { Divider } from '@/components/ui/Divider'
import { useProfileStore } from '@/store/profile.store'
import { useAuthStore } from '@/store/auth.store'
import { useOnboardingStore } from '@/store/onboarding.store'

export function AccountHomePage() {
  const navigate = useNavigate()
  const { firstName, lastName, email } = useProfileStore()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const resetOnboarding = useOnboardingStore((s) => s.reset)

  function handleLogout() {
    logout()
    resetOnboarding()
    navigate('/onboarding/welcome')
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-5 pt-4 md:px-8">
        <h1 className="text-h1 text-charcoal-900">Account</h1>

        <button type="button" onClick={() => navigate('/account/profile')} className="mt-4 flex w-full items-center gap-3 rounded-lg border border-border p-4 text-left hover:bg-cream-200">
          <Avatar firstName={firstName} lastName={lastName} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-h3 text-charcoal-900">
              {firstName} {lastName}
            </p>
            <p className="truncate text-body text-charcoal-500">{user?.phone}</p>
            {email && <p className="truncate text-body text-charcoal-500">{email}</p>}
          </div>
        </button>

        <div className="mt-5 space-y-0.5">
          <SettingsRow icon={<User className="h-4 w-4 text-charcoal-600" />} label="Profile" to="/account/profile" />
          <SettingsRow icon={<MapPin className="h-4 w-4 text-charcoal-600" />} label="Addresses" to="/account/addresses" />
          <SettingsRow icon={<CreditCard className="h-4 w-4 text-charcoal-600" />} label="Payment methods" to="/account/payment-methods" />
          <SettingsRow icon={<ClipboardList className="h-4 w-4 text-charcoal-600" />} label="Orders" to="/orders" />
          <SettingsRow icon={<Heart className="h-4 w-4 text-charcoal-600" />} label="Favorites" to="/favorites" />
          <SettingsRow icon={<Bell className="h-4 w-4 text-charcoal-600" />} label="Notifications" to="/notifications" />
        </div>

        <Divider className="my-4" />

        <div className="space-y-0.5">
          <SettingsRow icon={<Settings className="h-4 w-4 text-charcoal-600" />} label="Settings" to="/account/settings" />
          <SettingsRow icon={<Shield className="h-4 w-4 text-charcoal-600" />} label="Privacy" to="/account/privacy" />
          <SettingsRow icon={<LifeBuoy className="h-4 w-4 text-charcoal-600" />} label="Support" to="/account/support" />
          <SettingsRow icon={<FileText className="h-4 w-4 text-charcoal-600" />} label="Terms & policies" to="/account/terms" />
          <SettingsRow icon={<Tractor className="h-4 w-4 text-charcoal-600" />} label="About the farm" to="/account/about-farm" />
        </div>

        <Divider className="my-4" />

        <SettingsRow icon={<LogOut className="h-4 w-4 text-error" />} label="Log out" onClick={handleLogout} destructive />

        <p className="mt-6 text-center text-caption text-charcoal-400">App version 1.0.0 (Demo)</p>
      </div>
    </AppShell>
  )
}
