export interface MockRequestOptions {
  minDelayMs?: number
  maxDelayMs?: number
  failureRate?: number
  errorMessage?: string
}

/**
 * Wraps a synchronous mock resolver in a Promise with randomized network-like
 * latency (and optional simulated failure), so every mocked service call
 * feels like a real request and loading/error UI states stay exercisable.
 */
export function mockRequest<T>(resolver: () => T, options: MockRequestOptions = {}): Promise<T> {
  const { minDelayMs = 350, maxDelayMs = 900, failureRate = 0, errorMessage = 'Something went wrong. Please try again.' } = options
  const delay = minDelayMs + Math.random() * (maxDelayMs - minDelayMs)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (failureRate > 0 && Math.random() < failureRate) {
        reject(new Error(errorMessage))
        return
      }
      try {
        resolve(resolver())
      } catch (err) {
        reject(err instanceof Error ? err : new Error(errorMessage))
      }
    }, delay)
  })
}
