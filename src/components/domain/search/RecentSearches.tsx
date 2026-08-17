import { Clock, X } from 'lucide-react'

interface RecentSearchesProps {
  terms: string[]
  onSelect: (term: string) => void
  onClear: () => void
}

export function RecentSearches({ terms, onSelect, onClear }: RecentSearchesProps) {
  if (terms.length === 0) return null

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="text-body font-medium text-charcoal-700">Recent searches</h3>
        <button type="button" onClick={onClear} className="text-caption font-medium text-charcoal-500 hover:text-charcoal-700 focus-visible:outline-none">
          Clear
        </button>
      </div>
      <ul className="space-y-1">
        {terms.map((term) => (
          <li key={term}>
            <button
              type="button"
              onClick={() => onSelect(term)}
              className="flex w-full items-center gap-2.5 rounded-md px-1 py-2 text-left text-body-lg text-charcoal-800 transition-colors hover:bg-cream-200 focus-visible:outline-none"
            >
              <Clock className="h-4 w-4 shrink-0 text-charcoal-400" aria-hidden="true" />
              <span className="flex-1 truncate">{term}</span>
              <X className="h-3.5 w-3.5 shrink-0 text-charcoal-300" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
