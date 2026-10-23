/** Every piece of copy in the dummy data carries both languages. */
export type Lang = 'ar' | 'en'

export type Localized = Record<Lang, string>

export interface Photo {
  src: string
  alt: Localized
  /** CSS object-position focal point, e.g. "50% 22%" */
  focus?: string
}

export interface ApiResponse<T> {
  data: T
}
