import { TrendingUp } from 'lucide-react'

interface SearchSuggestionsProps {
  title: string
  terms: string[]
  onSelect: (term: string) => void
}

export function SearchSuggestions({ title, terms, onSelect }: SearchSuggestionsProps) {
  if (terms.length === 0) return null

  return (
    <div>
      <h3 className="mb-2.5 flex items-center gap-1.5 text-body font-medium text-charcoal-700">
        <TrendingUp className="h-4 w-4 text-charcoal-400" aria-hidden="true" />
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {terms.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => onSelect(term)}
            className="rounded-full border border-border-strong bg-cream-50 px-3.5 py-2 text-body text-charcoal-700 transition-colors hover:bg-cream-200 focus-visible:outline-none"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  )
}
