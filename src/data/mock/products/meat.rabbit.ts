import { createMeatProduct, weightPresets } from './_helpers'
import type { MeatProduct } from '@/types/product'

export const rabbitMeatProducts: MeatProduct[] = [
  createMeatProduct({
    id: 'rabbit-whole-dressed',
    name: 'Fresh Rabbit Meat, Whole Dressed',
    subCategory: 'rabbit-meat',
    meatType: 'rabbit',
    description: 'A whole rabbit, cleaned and dressed fresh — a lean alternative to poultry.',
    shortDescriptor: 'Whole, lean alternative',
    price: 58,
    weightOptions: weightPresets([1, 1.5, 2]),
    allowsCustomWeight: true,
    customWeightRangeKg: { min: 1, max: 3, stepKg: 0.5 },
    availability: 'available',
    processingTimeHours: 6,
    tags: ['whole'],
  }),
  createMeatProduct({
    id: 'rabbit-cuts-pack',
    name: 'Rabbit Cuts Pack 0.8kg',
    subCategory: 'rabbit-meat',
    meatType: 'rabbit',
    description: 'Rabbit meat, cleaned and cut into pieces — ready to season and cook.',
    shortDescriptor: 'Cut into pieces',
    price: 52,
    priceUnit: 'per-pack',
    saleUnit: 'pack',
    pricingModel: 'fixed',
    weightOptions: weightPresets([0.8]),
    availability: 'low-stock',
    stock: 4,
    processingTimeHours: 6,
  }),
]
