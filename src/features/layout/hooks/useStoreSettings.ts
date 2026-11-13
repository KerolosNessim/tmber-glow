import { useAsync } from '@/shared/hooks/useAsync'
import { api } from '@/shared/services/api'
import type { ApiResponse } from '@/shared/types/common.types'
import { SOCIAL_LINKS } from '../constants/navigation'
import type { SocialLink } from '../types/layout.types'

export interface StoreSettings {
  /** International format without +, e.g. 201001234567 */
  whatsappNumber: string
  social: { instagram: string; facebook: string; tiktok: string }
}

/** WhatsApp number and social links, edited from the dashboard. */
export function useStoreSettings() {
  return useAsync('settings', async () => (await api.get<ApiResponse<StoreSettings>>('/settings')).data.data)
}

/** Only the accounts that are filled in; the placeholders until none are. */
export function useSocialLinks(): SocialLink[] {
  const { data } = useStoreSettings()
  if (!data) return SOCIAL_LINKS
  const links: SocialLink[] = [
    { label: 'Instagram', icon: 'instagram', href: data.social.instagram },
    { label: 'TikTok', icon: 'tiktok', href: data.social.tiktok },
    { label: 'Facebook', icon: 'facebook', href: data.social.facebook },
    { label: 'WhatsApp', icon: 'whatsapp', href: data.whatsappNumber ? `https://wa.me/${data.whatsappNumber}` : '' },
  ]
  const filled = links.filter((link) => link.href)
  return filled.length ? filled : SOCIAL_LINKS
}
