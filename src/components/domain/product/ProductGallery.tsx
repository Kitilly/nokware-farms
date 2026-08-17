import { useState } from 'react'
import { ProductMedia } from './ProductMedia'
import { cn } from '@/lib/utils'
import type { ProductImage } from '@/types/product'

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = images[activeIndex] ?? images[0]

  return (
    <div>
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl md:aspect-[16/10]">
        <ProductMedia url={active?.url ?? ''} alt={active?.alt ?? name} iconClassName="h-16 w-16 md:h-20 md:w-20" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2.5">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              aria-label={`View photo ${i + 1}`}
              aria-current={i === activeIndex}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'h-16 w-16 shrink-0 overflow-hidden rounded-md ring-2 transition-all',
                i === activeIndex ? 'ring-forest-600' : 'ring-transparent opacity-70 hover:opacity-100',
              )}
            >
              <ProductMedia url={img.url} alt={img.alt} iconClassName="h-6 w-6" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
