import type { ProductCategory } from '@/types/product'

export interface SubCategory {
  id: string
  label: string
  icon: string
  categoryId: ProductCategory
}

export interface CategoryDef {
  id: ProductCategory
  label: string
  shortLabel: string
  icon: string
  description: string
  subCategories: SubCategory[]
}

export const categories: CategoryDef[] = [
  {
    id: 'live-livestock',
    label: 'Live Livestock',
    shortLabel: 'Livestock',
    icon: 'PawPrint',
    description: 'Healthy, farm-raised animals sold whole.',
    subCategories: [
      { id: 'cattle', label: 'Cattle & Cows', icon: 'Beef', categoryId: 'live-livestock' },
      { id: 'goats', label: 'Goats', icon: 'Mountain', categoryId: 'live-livestock' },
      { id: 'sheep', label: 'Sheep', icon: 'Cloud', categoryId: 'live-livestock' },
      { id: 'pigs', label: 'Pigs', icon: 'Ham', categoryId: 'live-livestock' },
      { id: 'rabbits', label: 'Rabbits', icon: 'Rabbit', categoryId: 'live-livestock' },
    ],
  },
  {
    id: 'poultry',
    label: 'Poultry & Birds',
    shortLabel: 'Poultry',
    icon: 'Bird',
    description: 'Live and freshly dressed birds.',
    subCategories: [
      { id: 'chickens', label: 'Chickens', icon: 'Bird', categoryId: 'poultry' },
      { id: 'guinea-fowl', label: 'Guinea Fowl', icon: 'Bird', categoryId: 'poultry' },
      { id: 'turkeys', label: 'Turkeys', icon: 'Bird', categoryId: 'poultry' },
      { id: 'ducks', label: 'Ducks', icon: 'Bird', categoryId: 'poultry' },
    ],
  },
  {
    id: 'snails',
    label: 'Snails',
    shortLabel: 'Snails',
    icon: 'Shell',
    description: 'Live and cleaned, ready-to-cook snails.',
    subCategories: [
      { id: 'live-snails', label: 'Live Snails', icon: 'Shell', categoryId: 'snails' },
      { id: 'processed-snails', label: 'Cleaned & Processed', icon: 'Shell', categoryId: 'snails' },
    ],
  },
  {
    id: 'fresh-meat',
    label: 'Fresh Meat',
    shortLabel: 'Fresh Meat',
    icon: 'UtensilsCrossed',
    description: 'Freshly processed cuts, packs, and portions.',
    subCategories: [
      { id: 'beef', label: 'Beef', icon: 'Beef', categoryId: 'fresh-meat' },
      { id: 'goat-meat', label: 'Goat Meat', icon: 'Drumstick', categoryId: 'fresh-meat' },
      { id: 'mutton', label: 'Mutton & Sheep', icon: 'Drumstick', categoryId: 'fresh-meat' },
      { id: 'pork', label: 'Pork', icon: 'Ham', categoryId: 'fresh-meat' },
      { id: 'chicken-meat', label: 'Chicken', icon: 'Drumstick', categoryId: 'fresh-meat' },
      { id: 'turkey-meat', label: 'Turkey', icon: 'Drumstick', categoryId: 'fresh-meat' },
      { id: 'duck-meat', label: 'Duck', icon: 'Drumstick', categoryId: 'fresh-meat' },
      { id: 'rabbit-meat', label: 'Rabbit', icon: 'Drumstick', categoryId: 'fresh-meat' },
    ],
  },
]

export function getCategory(id: ProductCategory): CategoryDef | undefined {
  return categories.find((c) => c.id === id)
}

export function getSubCategory(categoryId: ProductCategory, subCategoryId: string): SubCategory | undefined {
  return getCategory(categoryId)?.subCategories.find((s) => s.id === subCategoryId)
}

export const animalTypes = [
  'cattle',
  'goat',
  'sheep',
  'pig',
  'rabbit',
  'chicken',
  'guinea-fowl',
  'turkey',
  'duck',
  'snail',
] as const

export const meatTypes = [
  'beef',
  'goat',
  'mutton',
  'pork',
  'chicken',
  'turkey',
  'duck',
  'rabbit',
] as const

export const addressLabels = ['Home', 'Work', 'Dorm', 'Office', 'Other'] as const
