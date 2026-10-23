import { useAsync } from '@/shared/hooks/useAsync'
import { catalogService } from '../services/catalog.service'
import type { CategoryGroup } from '../types/catalog.types'

export function useCategories(group?: CategoryGroup) {
  return useAsync(`categories:${group ?? 'all'}`, () => catalogService.getCategories(group))
}

export function useCategory(slug: string | undefined) {
  return useAsync(slug ? `category:${slug}` : null, () => catalogService.getCategory(slug!))
}
