import { Link } from 'react-router-dom'
import { HelpCircle } from 'lucide-react'
import { appConfig } from '@/config/app.config'

export function SupportFooter() {
  return (
    <footer className="border-t border-border px-5 py-8 text-center md:px-8">
      <HelpCircle className="mx-auto h-6 w-6 text-charcoal-400" aria-hidden="true" />
      <p className="mt-2 text-body-lg font-medium text-charcoal-800">Need help with an order?</p>
      <Link to="/account/support" className="mt-1 inline-block text-body font-medium text-forest-700 hover:underline">
        Visit Support
      </Link>
      <p className="mt-4 text-caption text-charcoal-400">
        © {new Date().getFullYear()} {appConfig.brand.name}. Demo build — no real orders are processed.
      </p>
    </footer>
  )
}
