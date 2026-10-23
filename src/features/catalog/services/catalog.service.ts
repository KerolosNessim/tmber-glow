import { api } from '@/shared/services/api'
import type { ApiResponse } from '@/shared/types/common.types'
import { CATALOG_ENDPOINTS } from '../constants/catalog.constants'
import type { Category, CategoryGroup, Product, ProductQuery } from '../types/catalog.types'

export const catalogService = {
  async getCategories(group?: CategoryGroup) {
    const res = await api.get<ApiResponse<Category[]>>(CATALOG_ENDPOINTS.categories, { params: group ? { group } : undefined })
    return res.data.data
  },

  async getCategory(slug: string) {
    const res = await api.get<ApiResponse<Category>>(CATALOG_ENDPOINTS.category(slug))
    return res.data.data
  },

  async getProducts(query: ProductQuery = {}) {
    const params: Record<string, string> = {}
    if (query.category) params.category = query.category
    if (query.ids?.length) params.ids = query.ids.join(',')
    const res = await api.get<ApiResponse<Product[]>>(CATALOG_ENDPOINTS.products, { params })
    return res.data.data
  },

  async getProduct(id: string) {
    const res = await api.get<ApiResponse<Product>>(CATALOG_ENDPOINTS.product(id))
    return res.data.data
  },
}
