export const featureFlags = {
  guestCheckout: false,
  cashOnDelivery: true,
  pickup: true,
  reviews: true,
  voiceSearch: false,
  promotions: true,
  liveTracking: true,
} as const

export type FeatureFlags = typeof featureFlags
export type FeatureFlagKey = keyof FeatureFlags

export function isFeatureEnabled(key: FeatureFlagKey): boolean {
  return featureFlags[key]
}
