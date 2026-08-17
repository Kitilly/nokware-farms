import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingLayoutProps {
  children: ReactNode
  onBack?: () => void
  step?: { current: number; total: number }
  className?: string
}

export function OnboardingLayout({ children, onBack, step, className }: OnboardingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-cream-100">
      {(onBack || step) && (
        <header className="flex items-center justify-between px-5 pt-5 md:px-8">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal-700 transition-colors hover:bg-cream-200 focus-visible:outline-none"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : (
            <span />
          )}
          {step && (
            <div className="flex gap-1.5" aria-label={`Step ${step.current} of ${step.total}`}>
              {Array.from({ length: step.total }).map((_, i) => (
                <span
                  key={i}
                  className={cn('h-1.5 w-6 rounded-full', i < step.current ? 'bg-forest-600' : 'bg-cream-300')}
                />
              ))}
            </div>
          )}
          <span className="w-10" />
        </header>
      )}
      <div className={cn('mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-10 pt-6 md:px-8', className)}>{children}</div>
    </div>
  )
}
