import type { ProductImage } from '@/types/product'

/**
 * Centralized product/scene imagery layer.
 *
 * No real farm photography has been supplied yet, and this app must render
 * reliably offline/in a live demo — so rather than gambling on unverified
 * external stock photos (risking broken links or content that doesn't match
 * the product, which reads as "cheap stock template"), every image resolves
 * through a single consistent branded treatment: a duotone gradient in our
 * palette + one icon from our one outline-icon system.
 *
 * This is a deliberate stand-in, not a limitation of the architecture — swap
 * a real photo in by setting `url` to a real https URL on any ProductImage;
 * `ProductMedia` renders a real <img> whenever the url isn't a placeholder
 * reference, so production photography drops in without touching components.
 */

export const PLACEHOLDER_PREFIX = 'placeholder:'

export interface MediaTreatment {
  icon: string
  gradientFrom: string
  gradientTo: string
}

export const subCategoryTreatments: Record<string, MediaTreatment> = {
  cattle: { icon: 'Beef', gradientFrom: '#5a3e24', gradientTo: '#2c1e11' },
  goats: { icon: 'Mountain', gradientFrom: '#1f4d36', gradientTo: '#122d20' },
  sheep: { icon: 'Cloud', gradientFrom: '#7c9273', gradientTo: '#4e5d48' },
  pigs: { icon: 'PiggyBank', gradientFrom: '#9c4c21', gradientTo: '#582a13' },
  rabbits: { icon: 'Rabbit', gradientFrom: '#93a98a', gradientTo: '#64785d' },
  chickens: { icon: 'Bird', gradientFrom: '#c1622d', gradientTo: '#7a3b1a' },
  'guinea-fowl': { icon: 'Feather', gradientFrom: '#8c6239', gradientTo: '#5a3e24' },
  turkeys: { icon: 'Bird', gradientFrom: '#9c4c21', gradientTo: '#5a3e24' },
  ducks: { icon: 'Bird', gradientFrom: '#2f6b47', gradientTo: '#183c2a' },
  'live-snails': { icon: 'Shell', gradientFrom: '#ad8a5f', gradientTo: '#74502f' },
  'processed-snails': { icon: 'Shell', gradientFrom: '#a8b99c', gradientTo: '#64785d' },
  beef: { icon: 'Beef', gradientFrom: '#7a3b1a', gradientTo: '#23221f' },
  'goat-meat': { icon: 'Drumstick', gradientFrom: '#9c4c21', gradientTo: '#422d1a' },
  mutton: { icon: 'Drumstick', gradientFrom: '#74502f', gradientTo: '#2d2c28' },
  pork: { icon: 'Ham', gradientFrom: '#c1622d', gradientTo: '#5a3e24' },
  'chicken-meat': { icon: 'Drumstick', gradientFrom: '#c1622d', gradientTo: '#7a3b1a' },
  'turkey-meat': { icon: 'Drumstick', gradientFrom: '#8c6239', gradientTo: '#422d1a' },
  'duck-meat': { icon: 'Drumstick', gradientFrom: '#1f4d36', gradientTo: '#2d2c28' },
  'rabbit-meat': { icon: 'Rabbit', gradientFrom: '#7c9273', gradientTo: '#403e39' },
}

export const sceneTreatments: Record<string, MediaTreatment> = {
  'welcome-hero': { icon: 'Wheat', gradientFrom: '#1f4d36', gradientTo: '#0c1f16' },
  'location-hero': { icon: 'Tractor', gradientFrom: '#183c2a', gradientTo: '#122d20' },
  'promo-banner': { icon: 'Leaf', gradientFrom: '#9c4c21', gradientTo: '#5a3e24' },
  'farm-story': { icon: 'Wheat', gradientFrom: '#5a3e24', gradientTo: '#2c1e11' },
  'about-farm': { icon: 'Tractor', gradientFrom: '#1f4d36', gradientTo: '#122d20' },
  'trust-banner': { icon: 'LeafyGreen', gradientFrom: '#64785d', gradientTo: '#384333' },
}

const DEFAULT_TREATMENT: MediaTreatment = { icon: 'PawPrint', gradientFrom: '#55534c', gradientTo: '#23221f' }

export function getSubCategoryTreatment(subCategory: string): MediaTreatment {
  return subCategoryTreatments[subCategory] ?? DEFAULT_TREATMENT
}

export function getSceneTreatment(key: string): MediaTreatment {
  return sceneTreatments[key] ?? DEFAULT_TREATMENT
}

export function isPlaceholderRef(url: string): boolean {
  return url.startsWith(PLACEHOLDER_PREFIX)
}

export function parsePlaceholderKey(url: string): string {
  return url.slice(PLACEHOLDER_PREFIX.length)
}

export function placeholderImage(subCategory: string, alt: string, isPrimary = true): ProductImage {
  return { url: `${PLACEHOLDER_PREFIX}${subCategory}`, alt, isPrimary }
}

export function placeholderGallery(subCategory: string, name: string, count = 3): ProductImage[] {
  return Array.from({ length: count }, (_, i) => ({
    url: `${PLACEHOLDER_PREFIX}${subCategory}`,
    alt: `${name} — photo ${i + 1}`,
    isPrimary: i === 0,
  }))
}
