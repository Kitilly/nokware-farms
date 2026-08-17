import { mockRequest } from './_client'
import { generateId } from '@/lib/id'
import type { PaymentMethod, PaymentState } from '@/types/payment'

let savedMethods: PaymentMethod[] = []
const paymentStates = new Map<string, PaymentState>()

export function getSavedPaymentMethods(): Promise<PaymentMethod[]> {
  return mockRequest(() => [...savedMethods])
}

export function addPaymentMethod(method: Omit<PaymentMethod, 'id' | 'createdAt'>): Promise<PaymentMethod> {
  return mockRequest(() => {
    const newMethod: PaymentMethod = { ...method, id: generateId('pm'), createdAt: new Date().toISOString() }
    if (newMethod.isDefault || savedMethods.length === 0) {
      savedMethods = savedMethods.map((m) => ({ ...m, isDefault: false }))
      newMethod.isDefault = true
    }
    savedMethods = [...savedMethods, newMethod]
    return newMethod
  })
}

export function removePaymentMethod(id: string): Promise<{ success: boolean }> {
  return mockRequest(() => {
    savedMethods = savedMethods.filter((m) => m.id !== id)
    return { success: true }
  })
}

export interface InitiatePaymentResult {
  paymentId: string
  state: PaymentState
}

/**
 * Simulates a payment attempt. ~15% of attempts fail, so retry/failed UI
 * states are reliably demonstrable — never a real charge.
 */
export function initiatePayment(
  _orderDraftId: string,
  _methodId: string,
  _amount: number,
  options: { forceOutcome?: 'success' | 'failed' } = {},
): Promise<InitiatePaymentResult> {
  return mockRequest(
    () => {
      const paymentId = generateId('pay')
      paymentStates.set(paymentId, 'processing')

      const willFail = options.forceOutcome ? options.forceOutcome === 'failed' : Math.random() < 0.15
      setTimeout(() => {
        paymentStates.set(paymentId, willFail ? 'failed' : 'success')
      }, 1200)

      return { paymentId, state: 'processing' as PaymentState }
    },
    { minDelayMs: 300, maxDelayMs: 600 },
  )
}

export function pollPaymentStatus(paymentId: string): Promise<{ state: PaymentState }> {
  return mockRequest(() => ({ state: paymentStates.get(paymentId) ?? 'processing' }), {
    minDelayMs: 150,
    maxDelayMs: 300,
  })
}

export function cancelPayment(paymentId: string): Promise<{ success: boolean }> {
  return mockRequest(() => {
    paymentStates.set(paymentId, 'cancelled')
    return { success: true }
  })
}
