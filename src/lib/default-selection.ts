import { isMeatProduct } from '@/types/product'
import type { Product } from '@/types/product'
import type { CartItemSelection } from '@/types/cart'

export function getDefaultSelection(product: Product): CartItemSelection {
  if (!isMeatProduct(product)) return {}

  const defaultCut = product.cuts[0]
  const defaultWeight = product.weightOptions.find((w) => w.isDefault) ?? product.weightOptions[0]
  const defaultPreps = product.preparationOptions.filter((p) => p.isDefault).map((p) => p.id)
  const defaultPrepLabels = product.preparationOptions.filter((p) => p.isDefault).map((p) => p.label)

  return {
    cutId: product.cuts.length > 0 ? defaultCut?.id : undefined,
    cutName: product.cuts.length > 0 ? defaultCut?.name : undefined,
    weightOptionId: defaultWeight?.id,
    weightLabel: defaultWeight?.label,
    preparationIds: defaultPreps.length > 0 ? defaultPreps : undefined,
    preparationLabels: defaultPrepLabels.length > 0 ? defaultPrepLabels : undefined,
  }
}
