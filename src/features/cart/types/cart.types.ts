import type { Product, Size } from '@/features/catalog/types/catalog.types'

/** A product snapshot is stored with the line so the bag renders without a request. */
export type CartProduct = Pick<Product, 'id' | 'name' | 'color' | 'price' | 'photo'>

export interface CartLine {
  key: string
  product: CartProduct
  size: Size
  qty: number
}

export interface CartSummary {
  count: number
  subtotal: number
  /** Amount still needed for free shipping, 0 once reached */
  remainingForFreeShipping: number
  /** 0–100 */
  freeShippingProgress: number
}
