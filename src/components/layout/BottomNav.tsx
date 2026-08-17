import { NavLink } from 'react-router-dom'
import { Home, Store, ClipboardList, ShoppingCart, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart.store'
import { cartItemCount } from '@/lib/cart-math'

const navItems = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/shop', label: 'Shop', icon: Store },
  { to: '/orders', label: 'Orders', icon: ClipboardList },
  { to: '/cart', label: 'Cart', icon: ShoppingCart },
  { to: '/account', label: 'Account', icon: User },
]

export function BottomNav() {
  const count = useCartStore((s) => cartItemCount(s.items))

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-cream-50/95 backdrop-blur-sm md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex items-stretch justify-around">
        {navItems.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 py-2.5 text-caption font-medium transition-colors focus-visible:outline-none',
                  isActive ? 'text-forest-700' : 'text-charcoal-500',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <Icon className="h-5.5 w-5.5" strokeWidth={isActive ? 2.25 : 1.75} aria-hidden="true" />
                    {to === '/cart' && count > 0 && (
                      <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta-500 px-1 text-[10px] font-semibold text-cream-50">
                        {count > 9 ? '9+' : count}
                      </span>
                    )}
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
