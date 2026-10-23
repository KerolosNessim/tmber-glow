import { useAsync } from '@/shared/hooks/useAsync'
import { homeService } from '../services/home.service'

export function useHomeContent() {
  return useAsync('home', homeService.getHomeContent)
}
