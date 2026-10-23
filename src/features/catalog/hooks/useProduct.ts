import { useAsync } from '@/shared/hooks/useAsync'
import { catalogService } from '../services/catalog.service'

export function useProduct(id: string | undefined) {
  return useAsync(id ? `product:${id}` : null, () => catalogService.getProduct(id!))
}
