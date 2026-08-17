import { createMeatProduct, weightPresets } from './_helpers'
import type { MeatProduct } from '@/types/product'

export const duckMeatProducts: MeatProduct[] = [
  createMeatProduct({
    id: 'duck-breast-fillet',
    name: 'Duck Breast Fillet',
    subCategory: 'duck-meat',
    meatType: 'duck',
    description: 'Rich, flavorful duck breast fillet — ideal for pan-searing.',
    shortDescriptor: 'Rich, ideal for pan-searing',
    price: 68,
    weightOptions: weightPresets([0.5, 1]),
    allowsCustomWeight: true,
    customWeightRangeKg: { min: 0.5, max: 3, stepKg: 0.5 },
    availability: 'available',
    processingTimeHours: 8,
  }),
  createMeatProduct({
    id: 'duck-breast-smoked-limited',
    name: 'Limited Batch Smoked Duck Breast',
    subCategory: 'duck-meat',
    meatType: 'duck',
    description: 'A small-batch, house-smoked duck breast — limited availability while stocks last.',
    shortDescriptor: 'House-smoked, limited batch',
    price: 90,
    weightOptions: weightPresets([0.5, 1]),
    availability: 'available',
    limited: true,
    stock: 8,
    processingTimeHours: 30,
    freshnessLabel: 'Small batch, house-smoked',
    tags: ['smoked', 'limited'],
  }),
]
