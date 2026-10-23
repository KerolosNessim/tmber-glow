import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Product, Size } from '@/features/catalog/types/catalog.types'
import { CART_STORAGE_KEY, MAX_QTY_PER_LINE } from '../constants/cart.constants'
import type { CartLine } from '../types/cart.types'

interface CartState {
  lines: CartLine[]
  add: (product: Product, size: Size, qty?: number) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
}

const lineKey = (productId: string, size: Size) => `${productId}:${size}`

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (product, size, qty = 1) =>
        set((state) => {
          const key = lineKey(product.id, size)
          const existing = state.lines.find((l) => l.key === key)
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.key === key ? { ...l, qty: Math.min(l.qty + qty, MAX_QTY_PER_LINE) } : l,
              ),
            }
          }
          const { id, name, color, price, photo } = product
          return { lines: [...state.lines, { key, size, qty, product: { id, name, color, price, photo } }] }
        }),
      setQty: (key, qty) =>
        set((state) => ({
          lines:
            qty < 1
              ? state.lines.filter((l) => l.key !== key)
              : state.lines.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, MAX_QTY_PER_LINE) } : l)),
        })),
      remove: (key) => set((state) => ({ lines: state.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [] }),
    }),
    { name: CART_STORAGE_KEY, storage: createJSONStorage(() => localStorage), version: 1 },
  ),
)
