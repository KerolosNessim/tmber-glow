import { isAxiosError } from 'axios'
import type { Size } from '@/features/catalog/types/catalog.types'
import { api } from '@/shared/services/api'
import type { ApiResponse, Lang } from '@/shared/types/common.types'

export interface CustomerInfo {
  name: string
  phone: string
  governorate: string
  city: string
  address: string
  notes: string
}

export interface OrderRequest {
  customer: CustomerInfo
  items: { productId: string; size: Size; qty: number }[]
  lang: Lang
  /** Honeypot, always empty for real visitors */
  website: string
}

export interface PlacedOrder {
  number: string
  subtotal: number
  /** null when the store hasn't set its WhatsApp number yet */
  whatsappUrl: string | null
}

export interface UnavailableItem {
  productId: string
  size: Size
  available: number
}

export const orderService = {
  async place(order: OrderRequest) {
    const res = await api.post<ApiResponse<PlacedOrder>>('/orders', order)
    return res.data.data
  },
}

/** Lines the server refused because there isn't enough stock any more. */
export function unavailableItems(error: unknown): UnavailableItem[] | null {
  if (isAxiosError(error) && error.response?.status === 409) {
    return (error.response.data as { unavailable?: UnavailableItem[] }).unavailable ?? null
  }
  return null
}

/** The phone field the server rejected, if that's what went wrong. */
export function isPhoneError(error: unknown) {
  if (!isAxiosError(error) || error.response?.status !== 400) return false
  const issues = (error.response.data as { issues?: { path: string[] }[] }).issues ?? []
  return issues.some((i) => i.path.join('.') === 'customer.phone')
}

/** Kept for the "order placed" page so it survives a reload. */
export const LAST_ORDER_KEY = 'tg-last-order'
