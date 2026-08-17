import { useEffect, useState } from 'react'
import { Sheet } from '@/components/ui/Sheet'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { CutSelector } from '@/components/domain/product/CutSelector'
import { WeightSelector } from '@/components/domain/product/WeightSelector'
import { PreparationOptions } from '@/components/domain/product/PreparationOptions'
import { getProductById } from '@/services/inventory'
import { useCartStore } from '@/store/cart.store'
import { isMeatProduct } from '@/types/product'
import type { CartItem, CartItemSelection } from '@/types/cart'
import type { MeatProduct, WeightOption, CutOption } from '@/types/product'

interface EditCartItemSheetProps {
  item: CartItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCartItemSheet({ item, open, onOpenChange }: EditCartItemSheetProps) {
  const updateSelection = useCartStore((s) => s.updateSelection)
  const [product, setProduct] = useState<MeatProduct | null>(null)
  const [selection, setSelection] = useState<CartItemSelection>(item.selection)

  useEffect(() => {
    if (!open) return
    setSelection(item.selection)
    getProductById(item.productId).then((p) => {
      if (p && isMeatProduct(p)) setProduct(p)
    })
  }, [open, item])

  function handleSelectWeight(option: WeightOption) {
    setSelection((s) => ({ ...s, weightOptionId: option.id, weightLabel: option.label, customWeightKg: undefined }))
  }
  function handleSelectCustomWeight(kg: number) {
    setSelection((s) => ({ ...s, customWeightKg: kg, weightOptionId: undefined, weightLabel: `${kg.toFixed(2)}kg` }))
  }
  function handleSelectCut(cut: CutOption) {
    setSelection((s) => ({ ...s, cutId: cut.id, cutName: cut.name }))
  }
  function handleTogglePrep(id: string) {
    if (!product) return
    setSelection((s) => {
      const has = (s.preparationIds ?? []).includes(id)
      const nextIds = has ? (s.preparationIds ?? []).filter((p) => p !== id) : [...(s.preparationIds ?? []), id]
      const label = product.preparationOptions.find((o) => o.id === id)?.label
      const nextLabels = has ? (s.preparationLabels ?? []).filter((l) => l !== label) : [...(s.preparationLabels ?? []), label!]
      return { ...s, preparationIds: nextIds, preparationLabels: nextLabels }
    })
  }

  function handleSave() {
    if (!product) return
    updateSelection(item.id, product, selection)
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={`Edit ${item.name}`}
      footer={
        <Button fullWidth disabled={!product} onClick={handleSave}>
          Save changes
        </Button>
      }
    >
      {!product ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <div className="space-y-5">
          <CutSelector cuts={product.cuts} selectedId={selection.cutId} onSelect={handleSelectCut} />
          <WeightSelector
            weightOptions={product.weightOptions}
            allowsCustomWeight={product.allowsCustomWeight}
            customWeightRangeKg={product.customWeightRangeKg}
            selectedOptionId={selection.weightOptionId}
            customWeightKg={selection.customWeightKg}
            onSelectPreset={handleSelectWeight}
            onSelectCustom={handleSelectCustomWeight}
          />
          <PreparationOptions options={product.preparationOptions} selectedIds={selection.preparationIds ?? []} onToggle={handleTogglePrep} />
        </div>
      )}
    </Sheet>
  )
}
