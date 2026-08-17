import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { appConfig } from '@/config/app.config'

interface ProfileState {
  firstName: string
  lastName: string
  email: string
  avatarUrl: string | null
  language: string
  currency: string
  setProfile: (patch: Partial<Pick<ProfileState, 'firstName' | 'lastName' | 'email' | 'avatarUrl'>>) => void
  reset: () => void
}

const initial = {
  firstName: '',
  lastName: '',
  email: '',
  avatarUrl: null as string | null,
  language: 'en',
  currency: appConfig.currency.code,
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      ...initial,
      setProfile: (patch) => set(patch),
      reset: () => set(initial),
    }),
    { name: 'farm-app-profile' },
  ),
)
