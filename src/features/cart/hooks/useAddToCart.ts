import { useCallback } from 'react'
import type { Product, Size } from '@/features/catalog/types/catalog.types'
import { DEFAULT_SIZE } from '@/features/catalog/constants/catalog.constants'
import { useUiStore } from '@/shared/store/ui.store'
import { useCartStore } from '../store/cart.store'

/** Adds one or more products and opens the bag, like the original page. */
export function useAddToCart() {
  const add = useCartStore((s) => s.add)
  const openCart = useUiStore((s) => s.openCart)

  return useCallback(
    (items: Product | Product[], size: Size = DEFAULT_SIZE) => {
      ;(Array.isArray(items) ? items : [items]).forEach((p) => add(p, size))
      openCart()
    },
    [add, openCart],
  )
}
