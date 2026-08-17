import { cn } from '@/lib/utils'

interface AvatarProps {
  firstName?: string
  lastName?: string
  imageUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8 text-caption',
  md: 'h-11 w-11 text-body-lg',
  lg: 'h-16 w-16 text-h2',
}

export function Avatar({ firstName, lastName, imageUrl, size = 'md', className }: AvatarProps) {
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || '?'

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`${firstName ?? ''} ${lastName ?? ''}`.trim() || 'Profile photo'}
        className={cn('rounded-full object-cover', sizeClasses[size], className)}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={`${firstName ?? ''} ${lastName ?? ''}`.trim() || 'Profile initials'}
      className={cn(
        'flex items-center justify-center rounded-full bg-forest-600 font-semibold text-cream-50',
        sizeClasses[size],
        className,
      )}
    >
      {initials}
    </div>
  )
}
