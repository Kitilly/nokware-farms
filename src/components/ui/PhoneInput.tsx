import { useId } from 'react'
import { appConfig } from '@/config/app.config'
import { cn } from '@/lib/utils'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  autoFocus?: boolean
  id?: string
}

export function PhoneInput({ value, onChange, label = 'Phone number', error, autoFocus, id }: PhoneInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="mb-1.5 block text-body font-medium text-charcoal-800">
        {label}
      </label>
      <div
        className={cn(
          'flex h-11 w-full items-center overflow-hidden rounded-md border bg-cream-50 transition-colors duration-150',
          error ? 'border-error' : 'border-border-strong focus-within:border-forest-500',
        )}
      >
        <span className="flex h-full shrink-0 items-center border-r border-border bg-cream-200 px-3 text-body-lg font-medium text-charcoal-700">
          {appConfig.phone.dialCode}
        </span>
        <input
          id={inputId}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          autoFocus={autoFocus}
          placeholder={appConfig.phone.exampleFormat}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d\s]/g, ''))}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className="h-full w-full bg-transparent px-3.5 text-body-lg text-charcoal-900 placeholder:text-charcoal-400 focus-visible:outline-none"
        />
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-caption text-error">
          {error}
        </p>
      )}
    </div>
  )
}
