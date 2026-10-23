import type { Localized, Photo } from '@/shared/types/common.types'

export type CategoryGroup = 'tops' | 'bottoms'

export type ProductBadge = 'new' | 'bestseller'

export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL'

export interface Category {
  id: string
  slug: string
  group: CategoryGroup
  name: Localized
  description: Localized
  photo: Photo
  /** Number of styles shown on the tile, e.g. "12 STYLES" */
  styles: number
  badge?: ProductBadge
}

export interface Product {
  id: string
  categorySlug: string
  name: Localized
  /** Colour name, shown as a spec (English only, like the original page) */
  color: string
  /** CSS colour of the swatch */
  swatch: string
  /** Products sharing a family are the same style in other colours */
  family?: string
  gsm: number
  price: number
  compareAtPrice?: number
  photo: Photo
  sizes: Size[]
  badge?: ProductBadge
}

export interface ProductQuery {
  category?: string
  ids?: string[]
}
