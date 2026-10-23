import type { Lang } from '@/shared/types/common.types'

const CURRENCY: Record<Lang, string> = { ar: 'جنيه', en: 'EGP' }

/** Prices stay in Western digits in both languages, as on the original page. */
export function formatPrice(value: number, lang: Lang) {
  return `${value.toLocaleString('en-US')} ${CURRENCY[lang]}`
}

export function pad2(n: number) {
  return String(n).padStart(2, '0')
}
