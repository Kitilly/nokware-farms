export type AnalyticsEvent =
  | 'signup_started'
  | 'signup_completed'
  | 'search_used'
  | 'product_viewed'
  | 'favorite_added'
  | 'cart_added'
  | 'checkout_started'
  | 'payment_selected'
  | 'order_created'
  | 'order_viewed'
  | 'support_opened'

export type AnalyticsPayload = Record<string, unknown>
export type AnalyticsProvider = { track: (event: string, payload?: AnalyticsPayload) => void }

const defaultProvider: AnalyticsProvider = {
  track: (event, payload) => {
    if (import.meta.env.DEV) {
      console.debug(`[analytics] ${event}`, payload ?? {})
    }
  },
}

let activeProvider: AnalyticsProvider = defaultProvider

/** Swap in a real analytics vendor later without touching call sites. */
export function setProvider(provider: AnalyticsProvider): void {
  activeProvider = provider
}

export function track(event: AnalyticsEvent, payload?: AnalyticsPayload): void {
  activeProvider.track(event, payload)
}
