import type { FooterLink, NavItem, SocialLink } from '../types/layout.types'

export const NAV_ITEMS: NavItem[] = [
  { key: 'home', to: '/' },
  { key: 'catalog', to: '/collections' },
  { key: 'sets', to: '/#look' },
  { key: 'contact', to: '#contact' },
]

/** Hash links (#contact, /#look) only scroll within a page, so they never mark the active page. */
export function isNavActive(to: string, pathname: string) {
  if (to.includes('#')) return false
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

export const FOOTER_SHOP: FooterLink[] = [
  { key: 'tops', to: '/#tops' },
  { key: 'bottoms', to: '/#bottoms' },
  { key: 'sets', to: '/#look' },
]

export const FOOTER_HELP: FooterLink[] = [
  { key: 'sizeGuide', to: '#contact' },
  { key: 'exchange', to: '#contact' },
  { key: 'track', to: '#contact' },
]

/** Placeholder links until the real accounts are confirmed */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Instagram', icon: 'instagram', href: '#' },
  { label: 'TikTok', icon: 'tiktok', href: '#' },
  { label: 'Facebook', icon: 'facebook', href: '#' },
  { label: 'WhatsApp', icon: 'whatsapp', href: '#' },
]
