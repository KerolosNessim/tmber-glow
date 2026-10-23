import type { CategoryGroup, Size } from '../types/catalog.types'

export const CATEGORY_GROUPS: CategoryGroup[] = ['tops', 'bottoms']

export const ALL_SIZES: Size[] = ['S', 'M', 'L', 'XL', 'XXL']

export const DEFAULT_SIZE: Size = 'L'

export const CATALOG_ENDPOINTS = {
  categories: '/categories',
  category: (slug: string) => `/categories/${slug}`,
  products: '/products',
  product: (id: string) => `/products/${id}`,
} as const
