import type { Localized, Photo } from '@/shared/types/common.types'

/** Titles mark the highlighted words with *asterisks*, e.g. "Built for *cold* mornings". */
export interface HeroSlide {
  id: string
  photo: Photo
  eyebrow: { kind: 'spec'; text: string } | { kind: 'new' }
  title: Localized
  body: Localized
  cta: { label: Localized; to: string }
}

export type PerkIcon = 'truck' | 'swap' | 'cash' | 'leaf'

export interface Perk {
  id: string
  icon: PerkIcon
  title: Localized
  text: Localized
}

export interface Hotspot {
  productId: string
  /** Position in % of the photo, measured from its left and top edges (the photo is not mirrored in RTL) */
  x: number
  y: number
}

export interface LookSet {
  id: string
  title: string
  subtitle: Localized
  photo: Photo
  productIds: string[]
  setPrice: number
  hotspots: Hotspot[]
}

export interface LookbookPost {
  id: string
  photo: Photo
  href: string
}

export interface HomeContent {
  slides: HeroSlide[]
  perks: Perk[]
  intro: { spec: string; title: Localized; body: Localized }
  look: LookSet
  lookbook: { handle: string; posts: LookbookPost[] }
}
