import { useCallback } from 'react'
import { track, type AnalyticsEvent, type AnalyticsPayload } from '@/services/analytics'

export function useAnalytics() {
  const trackEvent = useCallback((event: AnalyticsEvent, payload?: AnalyticsPayload) => {
    track(event, payload)
  }, [])

  return { track: trackEvent }
}
