import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Bell, Search, ShoppingCart } from 'lucide-react'
import { LocationHeader } from '@/components/domain/location/LocationHeader'
import { Avatar } from '@/components/ui/Avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/DropdownMenu'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart.store'
import { cartItemCount } from '@/lib/cart-math'
import { useNotificationsStore } from '@/store/notifications.store'
import { useProfileStore } from '@/store/profile.store'
import { useAuthStore } from '@/store/auth.store'

const navLinks = [
  { to: '/home', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/orders', label: 'Orders' },
  { to: '/favorites', label: 'Favorites' },
]

export function DesktopNav() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const cartCount = useCartStore((s) => cartItemCount(s.items))
  const unread = useNotificationsStore((s) => s.unreadCount())
  const { firstName, lastName } = useProfileStore()
  const logout = useAuthStore((s) => s.logout)

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="sticky top-0 z-30 hidden border-b border-border bg-cream-50/95 backdrop-blur-sm md:block">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-8 py-3">
        <NavLink to="/home" className="shrink-0 font-display text-h3 text-forest-800">
          Nokware Farms
        </NavLink>

        <nav aria-label="Primary" className="flex shrink-0 items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-body-lg font-medium transition-colors focus-visible:outline-none',
                  isActive ? 'text-forest-700' : 'text-charcoal-600 hover:text-charcoal-900',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="min-w-0 max-w-[220px] shrink-0">
          <LocationHeader />
        </div>

        <form onSubmit={handleSearchSubmit} className="ml-auto flex-1 max-w-md">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search livestock, meat, poultry…"
              className="h-10 w-full rounded-full border border-border-strong bg-cream-100 pl-9 pr-3.5 text-body text-charcoal-900 placeholder:text-charcoal-400 focus-visible:outline-none focus-visible:border-forest-500"
            />
          </div>
        </form>

        <div className="flex shrink-0 items-center gap-1.5">
          <NavLink
            to="/notifications"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-charcoal-600 transition-colors hover:bg-cream-200 focus-visible:outline-none"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            {unread > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-terracotta-500" />}
          </NavLink>
          <NavLink
            to="/cart"
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-charcoal-600 transition-colors hover:bg-cream-200 focus-visible:outline-none"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-terracotta-500 px-1 text-[10px] font-semibold text-cream-50">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </NavLink>

          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full focus-visible:outline-none">
              <Avatar firstName={firstName} lastName={lastName} size="sm" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => navigate('/account')}>Account</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate('/orders')}>Orders</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate('/account/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate('/account/support')}>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  logout()
                  navigate('/onboarding/welcome')
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
