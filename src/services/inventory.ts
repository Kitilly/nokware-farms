import { mockRequest } from './_client'
import { allProducts, getProductById as findById, getProductBySlug as findBySlug } from '@/data/mock/products'
import { isLiveAnimal, isMeatProduct } from '@/types/product'
import type { AvailabilityStatus, Product, ProductCategory, ProductFilters } from '@/types/product'
import type { CartItemSelection } from '@/types/cart'

function applyFilters(products: Product[], filters: ProductFilters): Product[] {
  let result = products

  if (filters.category) result = result.filter((p) => p.category === filters.category)
  if (filters.subCategory) result = result.filter((p) => p.subCategory === filters.subCategory)
  if (filters.liveOrProcessed === 'live') result = result.filter((p) => p.type === 'live-animal')
  if (filters.liveOrProcessed === 'processed') result = result.filter((p) => p.type === 'meat-product')
  if (filters.priceMin !== undefined) result = result.filter((p) => p.price >= filters.priceMin!)
  if (filters.priceMax !== undefined) result = result.filter((p) => p.price <= filters.priceMax!)
  if (filters.availability?.length) result = result.filter((p) => filters.availability!.includes(p.availability))
  if (filters.freshOnly) result = result.filter((p) => isMeatProduct(p) && Boolean(p.freshnessLabel))
  if (filters.featured) result = result.filter((p) => p.featured)
  if (filters.popular) result = result.filter((p) => p.popular)
  if (filters.seasonal) result = result.filter((p) => p.seasonal)
  if (filters.breedOrType) {
    result = result.filter((p) => {
      const type = isLiveAnimal(p) ? p.animalType : isMeatProduct(p) ? p.meatType : ''
      const breed = isLiveAnimal(p) ? p.breed : undefined
      return type === filters.breedOrType || breed === filters.breedOrType
    })
  }
  if (filters.weightMin !== undefined || filters.weightMax !== undefined) {
    result = result.filter((p) => {
      const range = isLiveAnimal(p) ? p.approximateWeightKg : undefined
      const weights = isMeatProduct(p) ? p.weightOptions.map((w) => w.kg) : []
      if (range) {
        if (filters.weightMin !== undefined && range.max < filters.weightMin) return false
        if (filters.weightMax !== undefined && range.min > filters.weightMax) return false
        return true
      }
      if (weights.length > 0) {
        return weights.some(
          (kg) =>
            (filters.weightMin === undefined || kg >= filters.weightMin) &&
            (filters.weightMax === undefined || kg <= filters.weightMax),
        )
      }
      return true
    })
  }

  result = sortProducts(result, filters.sort ?? 'recommended')

  return result
}

function sortProducts(products: Product[], sort: NonNullable<ProductFilters['sort']>): Product[] {
  const copy = [...products]
  switch (sort) {
    case 'popular':
      return copy.sort((a, b) => Number(b.popular) - Number(a.popular))
    case 'newest':
      return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'price-low-high':
      return copy.sort((a, b) => a.price - b.price)
    case 'price-high-low':
      return copy.sort((a, b) => b.price - a.price)
    case 'recommended':
    default:
      return copy.sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.popular) - Number(a.popular))
  }
}

export function getProducts(filters: ProductFilters = {}): Promise<{ items: Product[]; total: number }> {
  return mockRequest(() => {
    const filtered = applyFilters(allProducts, filters)
    const page = filters.page ?? 1
    const pageSize = filters.pageSize ?? 20
    const start = (page - 1) * pageSize
    return { items: filtered.slice(start, start + pageSize), total: filtered.length }
  })
}

export function getProductById(id: string): Promise<Product | null> {
  return mockRequest(() => findById(id) ?? null)
}

export function getProductBySlug(slug: string): Promise<Product | null> {
  return mockRequest(() => findBySlug(slug) ?? null)
}

export function getProductsByCategory(category: ProductCategory, subCategory?: string): Promise<Product[]> {
  return mockRequest(() => allProducts.filter((p) => p.category === category && (!subCategory || p.subCategory === subCategory)))
}

export function getFeaturedProducts(): Promise<Product[]> {
  return mockRequest(() => allProducts.filter((p) => p.featured))
}

export function getPopularProducts(): Promise<Product[]> {
  return mockRequest(() => allProducts.filter((p) => p.popular))
}

export function getSeasonalProducts(): Promise<Product[]> {
  return mockRequest(() => allProducts.filter((p) => p.seasonal))
}

export interface CheckAvailabilityResult {
  ok: boolean
  availability: AvailabilityStatus
  message?: string
}

export function checkAvailability(
  productId: string,
  _selection: CartItemSelection,
  quantity: number,
): Promise<CheckAvailabilityResult> {
  return mockRequest(() => {
    const product = findById(productId)
    if (!product) return { ok: false, availability: 'unavailable', message: 'This product is no longer available.' }
    if (product.availability === 'unavailable') {
      return { ok: false, availability: 'unavailable', message: 'This product is currently unavailable.' }
    }
    if (product.availability === 'reserved') {
      return { ok: false, availability: 'reserved', message: 'This item is reserved for another order.' }
    }
    if (product.stock !== null && quantity > product.stock) {
      return {
        ok: false,
        availability: product.availability,
        message: `Only ${product.stock} left in stock — reduce the quantity to continue.`,
      }
    }
    if (quantity < product.minQuantity || quantity > product.maxQuantity) {
      return {
        ok: false,
        availability: product.availability,
        message: `Quantity must be between ${product.minQuantity} and ${product.maxQuantity}.`,
      }
    }
    return { ok: true, availability: product.availability }
  })
}
