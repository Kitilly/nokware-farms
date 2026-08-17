import { useEffect, useState } from 'react'
import { checkDeliveryEligibility, type DeliveryEligibilityResult } from '@/services/location'

export function useDeliveryEligibility(deliveryZoneId: string | undefined) {
  const [result, setResult] = useState<DeliveryEligibilityResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    checkDeliveryEligibility(deliveryZoneId).then((res) => {
      if (!cancelled) {
        setResult(res)
        setIsLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [deliveryZoneId])

  return { result, isLoading }
}
