import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type OnboardingStep = 'welcome' | 'otp' | 'profile' | 'location' | 'complete'

interface OnboardingState {
  completed: boolean
  currentStep: OnboardingStep
  setStep: (step: OnboardingStep) => void
  markCompleted: () => void
  reset: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      completed: false,
      currentStep: 'welcome',
      setStep: (step) => set({ currentStep: step }),
      markCompleted: () => set({ completed: true, currentStep: 'complete' }),
      reset: () => set({ completed: false, currentStep: 'welcome' }),
    }),
    { name: 'farm-app-onboarding' },
  ),
)
