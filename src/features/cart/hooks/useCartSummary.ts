import { useMemo } from 'react'
import { FREE_SHIPPING_THRESHOLD } from '../constants/cart.constants'
import { useCartStore } from '../store/cart.store'
import type { CartSummary } from '../types/cart.types'

export function useCartSummary(): CartSummary {
  const lines = useCartStore((s) => s.lines)
  return useMemo(() => {
    const count = lines.reduce((sum, l) => sum + l.qty, 0)
    const subtotal = lines.reduce((sum, l) => sum + l.qty * l.product.price, 0)
    return {
      count,
      subtotal,
      remainingForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
      freeShippingProgress: Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100),
    }
  }, [lines])
}
