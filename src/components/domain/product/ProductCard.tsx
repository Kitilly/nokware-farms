import { LiveAnimalCard } from './LiveAnimalCard'
import { MeatProductCard } from './MeatProductCard'
import { isLiveAnimal } from '@/types/product'
import type { Product } from '@/types/product'

export function ProductCard({ product }: { product: Product }) {
  return isLiveAnimal(product) ? <LiveAnimalCard product={product} /> : <MeatProductCard product={product} />
}
