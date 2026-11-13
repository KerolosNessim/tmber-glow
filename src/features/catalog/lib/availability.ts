import { DEFAULT_SIZE } from '../constants/catalog.constants'
import type { Product, Size } from '../types/catalog.types'

export const isSizeAvailable = (product: Product, size: Size) => product.sizes.includes(size) && !product.soldOut?.includes(size)

export const availableSizes = (product: Product) => product.sizes.filter((s) => isSizeAvailable(product, s))

export const isSoldOut = (product: Product) => availableSizes(product).length === 0

/** L when it's in stock, otherwise the first size that is. */
export function defaultSize(product: Product): Size {
  const sizes = availableSizes(product)
  return sizes.includes(DEFAULT_SIZE) ? DEFAULT_SIZE : (sizes[0] ?? product.sizes[0])
}
