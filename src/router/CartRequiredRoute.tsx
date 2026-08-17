import { useRef, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useCartStore } from '@/store/cart.store'

/**
 * Guards /checkout/* against being entered directly with an empty cart.
 * Checked once at mount only — NOT reactively on every render — because a
 * successful "place order" clears the cart as a side effect while this
 * route is still mounted; if the check re-ran reactively it would fire a
 * competing redirect to /cart that races the intentional navigate() to the
 * order confirmation page (same class of bug as a guard reacting to its own
 * success side effect).
 */
export function CartRequiredRoute({ children }: { children: ReactNode }) {
  const itemCount = useCartStore((s) => s.items.filter((i) => !i.savedForLater).length)
  const hadItemsOnMount = useRef(itemCount > 0)

  if (!hadItemsOnMount.current) return <Navigate to="/cart" replace />
  return <>{children}</>
}
