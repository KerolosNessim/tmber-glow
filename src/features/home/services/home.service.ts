import { api } from '@/shared/services/api'
import type { ApiResponse } from '@/shared/types/common.types'
import { HOME_ENDPOINT } from '../constants/home.constants'
import type { HomeContent } from '../types/home.types'

export const homeService = {
  async getHomeContent() {
    const res = await api.get<ApiResponse<HomeContent>>(HOME_ENDPOINT)
    return res.data.data
  },
}
