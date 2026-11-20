import type { BrandIconName } from '@/shared/components/BrandIcon'

export interface NavItem {
  /** Key under `layout:nav` */
  key: 'home' | 'catalog' | 'sets' | 'contact'
  to: string
}

export interface FooterLink {
  /** Key under `layout:footer` */
  key: 'tops' | 'bottoms' | 'sets' | 'sizeGuide' | 'exchange' | 'track'
  to: string
}

export interface SocialLink {
  label: string
  icon: BrandIconName
  href: string
}
