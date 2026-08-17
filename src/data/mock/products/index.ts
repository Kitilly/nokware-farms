import { cattleProducts } from './livestock.cattle'
import { goatProducts } from './livestock.goats'
import { sheepProducts } from './livestock.sheep'
import { pigProducts } from './livestock.pigs'
import { rabbitProducts } from './livestock.rabbits'
import { chickenProducts } from './poultry.chickens'
import { guineaFowlProducts } from './poultry.guinea-fowl'
import { turkeyProducts } from './poultry.turkeys'
import { duckProducts } from './poultry.ducks'
import { snailProducts } from './snails'
import { beefProducts } from './meat.beef'
import { goatMeatProducts } from './meat.goat'
import { muttonProducts } from './meat.mutton'
import { porkProducts } from './meat.pork'
import { chickenMeatProducts } from './meat.chicken'
import { turkeyMeatProducts } from './meat.turkey'
import { duckMeatProducts } from './meat.duck'
import { rabbitMeatProducts } from './meat.rabbit'
import type { Product, ProductCategory } from '@/types/product'

export const allProducts: Product[] = [
  ...cattleProducts,
  ...goatProducts,
  ...sheepProducts,
  ...pigProducts,
  ...rabbitProducts,
  ...chickenProducts,
  ...guineaFowlProducts,
  ...turkeyProducts,
  ...duckProducts,
  ...snailProducts,
  ...beefProducts,
  ...goatMeatProducts,
  ...muttonProducts,
  ...porkProducts,
  ...chickenMeatProducts,
  ...turkeyMeatProducts,
  ...duckMeatProducts,
  ...rabbitMeatProducts,
]

export function getAllProducts(): Product[] {
  return allProducts
}

export function getProductById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id)
}

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug)
}

export function getProductsByCategory(category: ProductCategory, subCategory?: string): Product[] {
  return allProducts.filter((p) => p.category === category && (!subCategory || p.subCategory === subCategory))
}

export function getFeaturedProducts(): Product[] {
  return allProducts.filter((p) => p.featured)
}

export function getPopularProducts(): Product[] {
  return allProducts.filter((p) => p.popular)
}

export function getSeasonalProducts(): Product[] {
  return allProducts.filter((p) => p.seasonal)
}

export {
  cattleProducts,
  goatProducts,
  sheepProducts,
  pigProducts,
  rabbitProducts,
  chickenProducts,
  guineaFowlProducts,
  turkeyProducts,
  duckProducts,
  snailProducts,
  beefProducts,
  goatMeatProducts,
  muttonProducts,
  porkProducts,
  chickenMeatProducts,
  turkeyMeatProducts,
  duckMeatProducts,
  rabbitMeatProducts,
}
