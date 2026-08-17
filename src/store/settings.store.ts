import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { appConfig } from '@/config/app.config'

interface SettingsState {
  language: string
  currency: string
  reducedMotion: boolean
  locationPermissionGranted: boolean
  marketingOptIn: boolean
  setLanguage: (language: string) => void
  setCurrency: (currency: string) => void
  setReducedMotion: (enabled: boolean) => void
  setLocationPermission: (granted: boolean) => void
  setMarketingOptIn: (optIn: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      currency: appConfig.currency.code,
      reducedMotion: false,
      locationPermissionGranted: false,
      marketingOptIn: true,
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setLocationPermission: (locationPermissionGranted) => set({ locationPermissionGranted }),
      setMarketingOptIn: (marketingOptIn) => set({ marketingOptIn }),
    }),
    { name: 'farm-app-settings' },
  ),
)
