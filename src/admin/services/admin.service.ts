import { isAxiosError } from 'axios'
import { api } from '@/shared/services/api'
import type { ApiResponse } from '@/shared/types/common.types'
import type { HomeContent } from '@/features/home/types/home.types'
import type {
  AdminCategory,
  AdminProduct,
  CategoryInput,
  Order,
  OrderPage,
  OrderQuery,
  OrderStatus,
  ProductInput,
  Stats,
  StoreSettings,
  UploadSignature,
} from '../types'

const get = async <T>(url: string, params?: object) => (await api.get<ApiResponse<T>>(url, { params })).data.data

export const adminService = {
  me: () => get<{ email: string }>('/admin/me'),
  login: async (email: string, password: string) => (await api.post('/admin/login', { email, password })).data,
  logout: () => api.post('/admin/logout'),

  products: (category?: string) => get<AdminProduct[]>('/admin/products', category ? { category } : undefined),
  product: (id: string) => get<AdminProduct>(`/admin/products/${encodeURIComponent(id)}`),
  createProduct: (input: ProductInput) => api.post('/admin/products', input),
  updateProduct: (id: string, input: ProductInput) => api.put(`/admin/products/${encodeURIComponent(id)}`, input),
  deleteProduct: (id: string) => api.delete(`/admin/products/${encodeURIComponent(id)}`),

  categories: () => get<AdminCategory[]>('/admin/categories'),
  category: (id: string) => get<AdminCategory>(`/admin/categories/${encodeURIComponent(id)}`),
  createCategory: (input: CategoryInput) => api.post('/admin/categories', input),
  updateCategory: (id: string, input: CategoryInput) => api.put(`/admin/categories/${encodeURIComponent(id)}`, input),
  deleteCategory: (id: string) => api.delete(`/admin/categories/${encodeURIComponent(id)}`),
  reorderCategories: (ids: string[]) => api.put('/admin/categories/order', { ids }),

  orders: (query: OrderQuery) => get<OrderPage>('/admin/orders', query),
  order: (number: string) => get<Order>(`/admin/orders/${encodeURIComponent(number)}`),
  updateOrder: async (number: string, patch: { status?: OrderStatus; shippingFee?: number | null; adminNotes?: string }) =>
    (await api.patch<ApiResponse<Order>>(`/admin/orders/${encodeURIComponent(number)}`, patch)).data.data,

  stats: () => get<Stats>('/admin/stats'),

  home: () => get<HomeContent | null>('/admin/home'),
  saveHome: (content: HomeContent) => api.put('/admin/home', content),
  settings: () => get<StoreSettings>('/admin/settings'),
  saveSettings: (settings: StoreSettings) => api.put('/admin/settings', settings),

  /**
   * Uploads straight from the browser to Cloudinary with a signature from the API.
   * Locally without Cloudinary, the API stores the file itself.
   */
  async uploadImage(file: File): Promise<{ src: string; publicId?: string }> {
    const sig = (await api.post<ApiResponse<UploadSignature>>('/admin/uploads/sign')).data.data
    if (sig.mode === 'local') {
      const res = await api.post<ApiResponse<{ src: string }>>('/admin/uploads/local', file, { headers: { 'Content-Type': file.type } })
      return res.data.data
    }
    const body = new FormData()
    body.append('file', file)
    body.append('api_key', sig.apiKey)
    body.append('timestamp', String(sig.timestamp))
    body.append('signature', sig.signature)
    body.append('folder', sig.folder)
    const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: 'POST', body })
    const json = (await res.json()) as { secure_url?: string; public_id?: string; error?: { message: string } }
    if (!res.ok || !json.secure_url || !json.public_id) throw new Error(json.error?.message ?? 'Upload failed')
    // Serve a resized, auto-format (WebP/AVIF) version instead of the original file.
    return { src: json.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_1600/'), publicId: json.public_id }
  },
}

export function isUnauthorized(error: unknown) {
  return isAxiosError(error) && error.response?.status === 401
}

/** Turns an API error into one readable line for a toast. */
export function errorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const body = error.response?.data as { error?: string; issues?: { path: (string | number)[]; message: string }[] } | undefined
    const issue = body?.issues?.[0]
    if (issue) return `${issue.path.join('.') || 'البيانات'}: ${issue.message}`
    if (body?.error) return body.error
    if (!error.response) return 'مش قادر أوصل للسيرفر. اتأكد إن الـ API شغال.'
  }
  if (error instanceof Error && error.message) return error.message
  return 'حصل خطأ، حاول تاني.'
}
