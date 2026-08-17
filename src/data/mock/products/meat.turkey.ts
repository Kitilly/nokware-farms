import { createMeatProduct, weightPresets } from './_helpers'
import type { MeatProduct } from '@/types/product'

export const turkeyMeatProducts: MeatProduct[] = [
  createMeatProduct({
    id: 'turkey-drumsticks',
    name: 'Turkey Drumsticks 1kg',
    subCategory: 'turkey-meat',
    meatType: 'turkey',
    description: 'Meaty turkey drumsticks, cleaned and packaged fresh.',
    shortDescriptor: 'Meaty, packaged fresh',
    price: 58,
    priceUnit: 'per-pack',
    saleUnit: 'pack',
    pricingModel: 'fixed',
    weightOptions: weightPresets([1]),
    availability: 'available',
    processingTimeHours: 8,
  }),
  createMeatProduct({
    id: 'turkey-breast-fillet',
    name: 'Turkey Breast Fillet',
    subCategory: 'turkey-meat',
    meatType: 'turkey',
    description: 'Lean, boneless turkey breast fillet — a versatile everyday cut.',
    shortDescriptor: 'Lean, boneless',
    price: 72,
    weightOptions: weightPresets([0.5, 1, 1.5]),
    allowsCustomWeight: true,
    customWeightRangeKg: { min: 0.5, max: 4, stepKg: 0.5 },
    availability: 'available',
    featured: true,
    processingTimeHours: 8,
  }),
]
