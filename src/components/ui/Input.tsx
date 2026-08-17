import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  hideLabel?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, leadingIcon, trailingIcon, hideLabel, className, id, ...props },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined
  const helperId = helperText ? `${inputId}-helper` : undefined

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className={cn('mb-1.5 block text-body font-medium text-charcoal-800', hideLabel && 'sr-only')}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leadingIcon && <span className="pointer-events-none absolute left-3 text-charcoal-400">{leadingIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={cn(errorId, helperId) || undefined}
          className={cn(
            'h-11 w-full rounded-md border bg-cream-50 px-3.5 text-body-lg text-charcoal-900 placeholder:text-charcoal-400',
            'transition-colors duration-150 focus-visible:outline-none',
            error ? 'border-error' : 'border-border-strong focus-visible:border-forest-500',
            leadingIcon && 'pl-10',
            trailingIcon && 'pr-10',
            className,
          )}
          {...props}
        />
        {trailingIcon && <span className="absolute right-3 text-charcoal-400">{trailingIcon}</span>}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-caption text-error">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={helperId} className="mt-1.5 text-caption text-charcoal-500">
          {helperText}
        </p>
      )}
    </div>
  )
})
