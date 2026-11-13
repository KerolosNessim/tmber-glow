import { useCallback } from 'react'
import type { Product, Size } from '@/features/catalog/types/catalog.types'
import { defaultSize, isSizeAvailable, isSoldOut } from '@/features/catalog/lib/availability'
import { useUiStore } from '@/shared/store/ui.store'
import { useCartStore } from '../store/cart.store'

/**
 * Adds one or more products and opens the bag, like the original page.
 * Without a size (or when that size is sold out) each product gets its own default size;
 * products that are completely sold out are skipped.
 */
export function useAddToCart() {
  const add = useCartStore((s) => s.add)
  const openCart = useUiStore((s) => s.openCart)

  return useCallback(
    (items: Product | Product[], size?: Size) => {
      ;(Array.isArray(items) ? items : [items])
        .filter((p) => !isSoldOut(p))
        .forEach((p) => add(p, size && isSizeAvailable(p, size) ? size : defaultSize(p)))
      openCart()
    },
    [add, openCart],
  )
}
