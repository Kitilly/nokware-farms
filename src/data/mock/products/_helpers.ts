import { placeholderGallery } from '../images'
import type {
  AvailabilityStatus,
  CutOption,
  FarmSourceInfo,
  FulfillmentType,
  LiveAnimalProduct,
  MeatProduct,
  PreparationOption,
  PriceUnit,
  PricingModel,
  ProductCategory,
  ProductPolicyNotes,
  SaleUnit,
  WeightOption,
} from '@/types/product'

export const defaultFarmSource: FarmSourceInfo = {
  farmName: 'Nokware Farms',
  location: 'Nsawam, Eastern Region',
  description: 'Raised on our own pastures and monitored daily by our farm team.',
}

const BASE_DATE = new Date('2026-06-01T08:00:00Z').getTime()
let sequence = 0
function stableCreatedAt(): string {
  sequence += 1
  return new Date(BASE_DATE - sequence * 3_600_000).toISOString()
}

export const standardCuts: CutOption[] = [
  { id: 'bone-in', name: 'Bone-in' },
  { id: 'boneless', name: 'Boneless' },
]

export function preparationOptions(labels: string[], defaultId?: string): PreparationOption[] {
  return labels.map((label, i) => ({
    id: label.toLowerCase().replace(/\s+/g, '-'),
    label,
    isDefault: defaultId ? label.toLowerCase().replace(/\s+/g, '-') === defaultId : i === 0,
  }))
}

export function cutOptions(names: string[]): CutOption[] {
  return names.map((name) => ({ id: name.toLowerCase().replace(/\s+/g, '-'), name }))
}

export function weightPresets(kgs: number[], defaultKg?: number): WeightOption[] {
  return kgs.map((kg) => ({
    id: `${kg}kg`,
    label: `${kg}kg`,
    kg,
    isDefault: defaultKg ? kg === defaultKg : kg === kgs[0],
  }))
}

interface LiveAnimalInput {
  id: string
  name: string
  category?: ProductCategory
  subCategory: string
  animalType: string
  description: string
  shortDescriptor: string
  price: number
  priceUnit?: PriceUnit
  breed?: string
  sex?: LiveAnimalProduct['sex']
  approximateWeightKg?: { min: number; max: number }
  approximateAgeMonths?: { min: number; max: number }
  availability?: AvailabilityStatus
  featured?: boolean
  popular?: boolean
  seasonal?: boolean
  limited?: boolean
  stock?: number | null
  minLeadTimeDays?: number
  allowsContactInquiry?: boolean
  tags?: string[]
  fulfillmentTypes?: FulfillmentType[]
  handlingInfo?: string
  careSummary?: string
  weightDisclaimer?: string
  transportRequirements?: string
  policyNotes?: ProductPolicyNotes
  imageCount?: number
}

export function createLiveAnimal(input: LiveAnimalInput): LiveAnimalProduct {
  const slug = input.id
  return {
    id: input.id,
    slug,
    name: input.name,
    category: input.category ?? 'live-livestock',
    subCategory: input.subCategory,
    description: input.description,
    shortDescriptor: input.shortDescriptor,
    images: placeholderGallery(input.subCategory, input.name, input.imageCount ?? 3),
    price: input.price,
    priceUnit: input.priceUnit ?? 'per-animal',
    saleUnit: input.priceUnit === 'per-pair' ? 'pair' : 'animal',
    minQuantity: 1,
    maxQuantity: 5,
    stock: input.stock === undefined ? (input.availability === 'low-stock' ? 3 : 12) : input.stock,
    availability: input.availability ?? 'available',
    featured: input.featured ?? false,
    popular: input.popular ?? false,
    seasonal: input.seasonal ?? false,
    limited: input.limited ?? false,
    farmSource: defaultFarmSource,
    processingTimeHours: 0,
    fulfillmentTypes: input.fulfillmentTypes ?? ['delivery', 'pickup'],
    freshnessLabel: undefined,
    policyNotes: input.policyNotes,
    tags: Array.from(new Set([input.animalType, input.subCategory, input.breed ?? '', ...(input.tags ?? [])].filter(Boolean))),
    createdAt: stableCreatedAt(),
    type: 'live-animal',
    animalType: input.animalType,
    breed: input.breed,
    approximateAgeMonths: input.approximateAgeMonths,
    approximateWeightKg: input.approximateWeightKg,
    sex: input.sex ?? 'unspecified',
    handlingInfo:
      input.handlingInfo ??
      'Handled by trained farm staff and transported in ventilated, humane conditions to minimize stress.',
    careSummary:
      input.careSummary ??
      'Raised free-range on natural feed with regular veterinary checks.',
    weightDisclaimer:
      input.weightDisclaimer ??
      'Weight is an approximate range — live animals are not sold by exact weight. Final size is confirmed with our team before dispatch.',
    transportRequirements: input.transportRequirements,
    allowsContactInquiry: input.allowsContactInquiry ?? true,
    minLeadTimeDays: input.minLeadTimeDays ?? 1,
  }
}

interface MeatInput {
  id: string
  name: string
  category?: ProductCategory
  subCategory: string
  meatType: string
  description: string
  shortDescriptor: string
  price: number
  priceUnit?: PriceUnit
  saleUnit?: SaleUnit
  pricingModel?: PricingModel
  cuts?: CutOption[]
  weightOptions?: WeightOption[]
  allowsCustomWeight?: boolean
  customWeightRangeKg?: { min: number; max: number; stepKg: number }
  preparationOptions?: PreparationOption[]
  availability?: AvailabilityStatus
  featured?: boolean
  popular?: boolean
  seasonal?: boolean
  limited?: boolean
  stock?: number | null
  freshnessLabel?: string
  storageGuidance?: string
  processingTimeHours?: number
  tags?: string[]
  fulfillmentTypes?: FulfillmentType[]
  finalWeightAdjustmentNotice?: string
  imageCount?: number
}

export function createMeatProduct(input: MeatInput): MeatProduct {
  const slug = input.id
  const pricingModel: PricingModel = input.pricingModel ?? (input.priceUnit === 'per-pack' ? 'fixed' : 'per-kg')
  return {
    id: input.id,
    slug,
    name: input.name,
    category: input.category ?? 'fresh-meat',
    subCategory: input.subCategory,
    description: input.description,
    shortDescriptor: input.shortDescriptor,
    images: placeholderGallery(input.subCategory, input.name, input.imageCount ?? 3),
    price: input.price,
    priceUnit: input.priceUnit ?? 'per-kg',
    saleUnit: input.saleUnit ?? 'kg',
    minQuantity: 1,
    maxQuantity: 20,
    stock: input.stock === undefined ? (input.availability === 'low-stock' ? 4 : 30) : input.stock,
    availability: input.availability ?? 'available',
    featured: input.featured ?? false,
    popular: input.popular ?? false,
    seasonal: input.seasonal ?? false,
    limited: input.limited ?? false,
    farmSource: defaultFarmSource,
    processingTimeHours: input.processingTimeHours ?? 6,
    fulfillmentTypes: input.fulfillmentTypes ?? ['delivery', 'pickup'],
    freshnessLabel: input.freshnessLabel ?? 'Processed within 24 hours',
    policyNotes: {
      substitutionPolicy: 'If an exact cut is unavailable, our team will contact you with the closest match.',
    },
    tags: Array.from(new Set([input.meatType, input.subCategory, ...(input.tags ?? [])].filter(Boolean))),
    createdAt: stableCreatedAt(),
    type: 'meat-product',
    meatType: input.meatType,
    cuts: input.cuts ?? [],
    weightOptions: input.weightOptions ?? [],
    allowsCustomWeight: input.allowsCustomWeight ?? false,
    customWeightRangeKg: input.customWeightRangeKg,
    preparationOptions: input.preparationOptions ?? preparationOptions(['Cleaned', 'Cut into pieces', 'Whole']),
    pricingModel,
    finalWeightAdjustmentNotice:
      input.finalWeightAdjustmentNotice ??
      (pricingModel === 'final-weighed' || pricingModel === 'estimated'
        ? 'Price shown is an estimate based on selected weight. The final charge reflects the exact weight at packing, within a small margin.'
        : undefined),
    storageGuidance:
      input.storageGuidance ?? 'Refrigerate at 0–4°C and use within 2 days, or freeze for up to 3 months.',
    freshnessWindowHours: 48,
  }
}
