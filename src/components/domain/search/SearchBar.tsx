import { useNavigate } from 'react-router-dom'
import { Search, Mic } from 'lucide-react'
import { featureFlags } from '@/config/feature-flags'
import { copy } from '@/config/copy'
import { cn } from '@/lib/utils'

export function SearchBar({ className }: { className?: string }) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate('/search')}
      className={cn(
        'flex h-12 w-full items-center gap-2.5 rounded-full border border-border-strong bg-cream-50 px-4 text-left shadow-xs',
        'transition-colors hover:bg-cream-200 focus-visible:outline-none',
        className,
      )}
    >
      <Search className="h-4.5 w-4.5 shrink-0 text-charcoal-400" aria-hidden="true" />
      <span className="flex-1 truncate text-body-lg text-charcoal-400">{copy.home.searchPlaceholder}</span>
      {featureFlags.voiceSearch && <Mic className="h-4.5 w-4.5 shrink-0 text-charcoal-400" aria-hidden="true" />}
    </button>
  )
}
