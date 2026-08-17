import { useParams } from 'react-router-dom'
import { ProductBrowseView } from './ProductBrowseView'
import { NotFoundPage } from '@/router/NotFoundPage'
import { getCategory } from '@/config/categories.config'
import type { ProductCategory } from '@/types/product'

export function CategoryPage() {
  const { category, subCategory } = useParams<{ category: string; subCategory?: string }>()
  const categoryDef = category ? getCategory(category as ProductCategory) : undefined

  if (!categoryDef) return <NotFoundPage />

  return <ProductBrowseView initialCategory={categoryDef.id} initialSubCategory={subCategory} />
}
