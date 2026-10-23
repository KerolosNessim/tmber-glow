import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { Lang, Localized } from '@/shared/types/common.types'
import { formatPrice } from '@/shared/lib/format'

/** Current language plus helpers to read `{ ar, en }` fields from the dummy data. */
export function useLocalized() {
  const { i18n } = useTranslation()
  const lang: Lang = i18n.resolvedLanguage === 'en' ? 'en' : 'ar'

  const l = useCallback((value: Localized) => value[lang], [lang])
  const price = useCallback((value: number) => formatPrice(value, lang), [lang])

  return { lang, dir: lang === 'ar' ? 'rtl' : 'ltr', isRtl: lang === 'ar', l, price } as const
}
