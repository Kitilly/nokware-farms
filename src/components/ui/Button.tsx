import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-forest-600 text-cream-50 hover:bg-forest-700 active:bg-forest-800 disabled:bg-charcoal-200',
  secondary: 'bg-terracotta-500 text-cream-50 hover:bg-terracotta-600 active:bg-terracotta-700 disabled:bg-charcoal-200',
  outline: 'border border-border-strong bg-transparent text-charcoal-900 hover:bg-cream-200 active:bg-cream-300 disabled:text-charcoal-300',
  ghost: 'bg-transparent text-forest-700 hover:bg-forest-50 active:bg-forest-100 disabled:text-charcoal-300',
  destructive: 'bg-error text-cream-50 hover:bg-error/90 active:bg-error/80 disabled:bg-charcoal-200',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-body gap-1.5 rounded-md',
  md: 'h-11 px-4 text-body-lg gap-2 rounded-md',
  lg: 'h-13 px-6 text-body-lg gap-2 rounded-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', isLoading, leadingIcon, trailingIcon, fullWidth, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-150',
        'focus-visible:outline-none disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        leadingIcon && <span className="shrink-0">{leadingIcon}</span>
      )}
      {children}
      {!isLoading && trailingIcon && <span className="shrink-0">{trailingIcon}</span>}
    </button>
  )
})
