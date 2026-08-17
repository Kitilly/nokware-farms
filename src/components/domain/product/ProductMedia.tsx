import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder'
import { isPlaceholderRef, parsePlaceholderKey, getSubCategoryTreatment } from '@/data/mock/images'
import { cn } from '@/lib/utils'

interface ProductMediaProps {
  url: string
  alt: string
  className?: string
  iconClassName?: string
}

export function ProductMedia({ url, alt, className, iconClassName }: ProductMediaProps) {
  if (isPlaceholderRef(url)) {
    const treatment = getSubCategoryTreatment(parsePlaceholderKey(url))
    return <MediaPlaceholder treatment={treatment} alt={alt} className={cn('h-full w-full', className)} iconClassName={iconClassName} />
  }

  return <img src={url} alt={alt} loading="lazy" className={cn('h-full w-full object-cover', className)} />
}
