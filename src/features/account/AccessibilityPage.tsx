import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Switch } from '@/components/ui/Switch'
import { useSettingsStore } from '@/store/settings.store'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

export function AccessibilityPage() {
  const navigate = useNavigate()
  const reducedMotion = useSettingsStore((s) => s.reducedMotion)
  const setReducedMotion = useSettingsStore((s) => s.setReducedMotion)
  const systemPrefersReducedMotion = usePrefersReducedMotion()

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-5 pt-4 md:px-8">
        <button type="button" onClick={() => navigate('/account/settings')} className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Settings
        </button>
        <h1 className="text-h1 text-charcoal-900">Accessibility</h1>

        <div className="mt-5 flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p className="text-body-lg font-medium text-charcoal-900">Reduce motion</p>
            <p className="text-body text-charcoal-500">Minimizes animations and transitions throughout the app.</p>
            {systemPrefersReducedMotion && <p className="mt-1 text-caption text-charcoal-400">Your device already requests reduced motion.</p>}
          </div>
          <Switch checked={reducedMotion || systemPrefersReducedMotion} onCheckedChange={setReducedMotion} label="Reduce motion" disabled={systemPrefersReducedMotion} />
        </div>

        <div className="mt-4 space-y-2 text-body text-charcoal-600">
          <p>Nokware Farms is designed with semantic structure, visible keyboard focus, descriptive labels, and non-color-only status indicators throughout.</p>
          <p>If you experience any accessibility issues, please let us know via Support.</p>
        </div>
      </div>
    </AppShell>
  )
}
