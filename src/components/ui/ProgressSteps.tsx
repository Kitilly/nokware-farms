import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressStepsProps {
  steps: string[]
  currentIndex: number
  className?: string
}

export function ProgressSteps({ steps, currentIndex, className }: ProgressStepsProps) {
  return (
    <ol className={cn('flex items-center', className)} aria-label="Progress">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        return (
          <li key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                aria-current={isCurrent ? 'step' : undefined}
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-caption font-semibold transition-colors',
                  isCompleted && 'bg-forest-600 text-cream-50',
                  isCurrent && 'border-2 border-forest-600 bg-cream-50 text-forest-700',
                  !isCompleted && !isCurrent && 'border-2 border-border-strong bg-cream-50 text-charcoal-400',
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : index + 1}
              </div>
              <span
                className={cn(
                  'hidden text-caption sm:block',
                  isCurrent ? 'font-medium text-charcoal-900' : 'text-charcoal-500',
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn('mx-1.5 h-0.5 flex-1 rounded-full', isCompleted ? 'bg-forest-600' : 'bg-border-strong')} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
