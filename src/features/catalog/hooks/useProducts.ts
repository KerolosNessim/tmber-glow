import { useAsync } from '@/shared/hooks/useAsync'
import { catalogService } from '../services/catalog.service'
import type { ProductQuery } from '../types/catalog.types'

export function useProducts(query: ProductQuery = {}) {
  const key = `products:${query.category ?? ''}:${query.ids?.join(',') ?? ''}`
  return useAsync(key, () => catalogService.getProducts(query))
}
