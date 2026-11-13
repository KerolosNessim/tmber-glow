import type { Category, Product, Size } from '@/features/catalog/types/catalog.types'
import type { Localized, Photo } from '@/shared/types/common.types'

export interface StockRow {
  size: Size
  qty: number
}

/** Product as the admin API returns it: full stock table instead of `sizes`. */
export interface AdminProduct extends Omit<Product, 'sizes' | 'badge' | 'compareAtPrice'> {
  stock: StockRow[]
  gallery: Photo[]
  isActive: boolean
  badge?: Product['badge'] | null
  compareAtPrice?: number | null
  order: number
  updatedAt: string
}

export type ProductInput = Omit<AdminProduct, 'order' | 'updatedAt'>

export interface AdminCategory extends Omit<Category, 'badge'> {
  badge?: Category['badge'] | null
  isActive: boolean
  order: number
  productCount?: number
}

export type CategoryInput = Omit<AdminCategory, 'order' | 'productCount'>

export type OrderStatus = 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  productId: string
  name: Localized
  color?: string
  photo?: string
  size: Size
  qty: number
  price: number
}

export interface Order {
  number: string
  customer: { name: string; phone: string; governorate: string; city: string; address: string; notes: string }
  items: OrderItem[]
  subtotal: number
  shippingFee?: number | null
  total: number
  status: OrderStatus
  statusHistory: { status: OrderStatus; at: string }[]
  stockDeducted: boolean
  adminNotes: string
  createdAt: string
  /** Only on the single-order endpoint */
  customerChatUrl?: string
}

export interface OrderPage {
  items: Order[]
  total: number
  page: number
  pages: number
  counts: Partial<Record<OrderStatus, number>>
}

export interface OrderQuery {
  status?: OrderStatus
  q?: string
  from?: string
  to?: string
  page?: number
}

export interface Stats {
  sales: Record<'today' | 'week' | 'month', { revenue: number; orders: number }>
  byStatus: Partial<Record<OrderStatus, number>>
  topProducts: { productId: string; name: Localized; photo?: string; qty: number; revenue: number }[]
  lowStock: { productId: string; name: Localized; color: string; size: Size; qty: number }[]
  latest: (Pick<Order, 'number' | 'subtotal' | 'status' | 'createdAt'> & { customer: { name: string } })[]
}

export interface StoreSettings {
  whatsappNumber: string
  social: { instagram: string; facebook: string; tiktok: string }
}

/** Cloudinary when it's configured on the API; "local" only in development without it. */
export type UploadSignature =
  | { mode: 'cloudinary'; cloudName: string; apiKey: string; folder: string; timestamp: number; signature: string }
  | { mode: 'local' }
