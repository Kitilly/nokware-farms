export type ProductCategory = 'live-livestock' | 'poultry' | 'snails' | 'fresh-meat'

export type PriceUnit = 'per-kg' | 'from-per-kg' | 'per-pack' | 'per-piece' | 'per-animal' | 'per-pair'

export type SaleUnit = 'kg' | 'pack' | 'animal' | 'piece' | 'pair'

export type AvailabilityStatus =
  | 'available'
  | 'low-stock'
  | 'unavailable'
  | 'pre-order'
  | 'reserved'
  | 'seasonal'

export type FulfillmentType = 'delivery' | 'pickup'

export interface ProductImage {
  url: string
  alt: string
  isPrimary: boolean
}

export interface FarmSourceInfo {
  farmName: string
  location: string
  description: string
}

export interface ProductPolicyNotes {
  weightDisclaimer?: string
  cancellationPolicy?: string
  substitutionPolicy?: string
}

interface ProductBase {
  id: string
  slug: string
  name: string
  category: ProductCategory
  subCategory: string
  description: string
  shortDescriptor: string
  images: ProductImage[]
  price: number
  priceUnit: PriceUnit
  saleUnit: SaleUnit
  minQuantity: number
  maxQuantity: number
  stock: number | null
  availability: AvailabilityStatus
  featured: boolean
  popular: boolean
  seasonal: boolean
  limited: boolean
  farmSource: FarmSourceInfo
  processingTimeHours: number
  fulfillmentTypes: FulfillmentType[]
  deliveryRestrictions?: string[]
  freshnessLabel?: string
  policyNotes?: ProductPolicyNotes
  tags: string[]
  createdAt: string
}

export interface LiveAnimalProduct extends ProductBase {
  type: 'live-animal'
  animalType: string
  breed?: string
  approximateAgeMonths?: { min: number; max: number }
  approximateWeightKg?: { min: number; max: number }
  sex?: 'male' | 'female' | 'unspecified'
  handlingInfo: string
  careSummary: string
  weightDisclaimer: string
  transportRequirements?: string
  allowsContactInquiry: boolean
  minLeadTimeDays: number
}

export interface CutOption {
  id: string
  name: string
  priceModifier?: number
  imageUrl?: string
}

export interface WeightOption {
  id: string
  label: string
  kg: number
  priceOverride?: number
  isDefault?: boolean
}

export interface PreparationOption {
  id: string
  label: string
  isDefault?: boolean
}

export type PricingModel = 'fixed' | 'estimated' | 'per-kg' | 'final-weighed'

export interface MeatProduct extends ProductBase {
  type: 'meat-product'
  meatType: string
  cuts: CutOption[]
  weightOptions: WeightOption[]
  allowsCustomWeight: boolean
  customWeightRangeKg?: { min: number; max: number; stepKg: number }
  preparationOptions: PreparationOption[]
  pricingModel: PricingModel
  finalWeightAdjustmentNotice?: string
  storageGuidance: string
  freshnessWindowHours?: number
}

export type Product = LiveAnimalProduct | MeatProduct

export function isLiveAnimal(product: Product): product is LiveAnimalProduct {
  return product.type === 'live-animal'
}

export function isMeatProduct(product: Product): product is MeatProduct {
  return product.type === 'meat-product'
}

export interface ProductFilters {
  category?: ProductCategory
  subCategory?: string
  liveOrProcessed?: 'live' | 'processed'
  priceMin?: number
  priceMax?: number
  weightMin?: number
  weightMax?: number
  availability?: AvailabilityStatus[]
  freshOnly?: boolean
  breedOrType?: string
  featured?: boolean
  popular?: boolean
  seasonal?: boolean
  query?: string
  sort?: SortOption
  page?: number
  pageSize?: number
}

export type SortOption = 'recommended' | 'popular' | 'newest' | 'price-low-high' | 'price-high-low'
