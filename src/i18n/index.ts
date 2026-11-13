import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import arCommon from './locales/ar/common.json'
import arLayout from './locales/ar/layout.json'
import arHome from './locales/ar/home.json'
import arCatalog from './locales/ar/catalog.json'
import arCart from './locales/ar/cart.json'
import arCheckout from './locales/ar/checkout.json'
import enCommon from './locales/en/common.json'
import enLayout from './locales/en/layout.json'
import enHome from './locales/en/home.json'
import enCatalog from './locales/en/catalog.json'
import enCart from './locales/en/cart.json'
import enCheckout from './locales/en/checkout.json'

export const LANG_STORAGE_KEY = 'tg-lang'

export const resources = {
  ar: { common: arCommon, layout: arLayout, home: arHome, catalog: arCatalog, cart: arCart, checkout: arCheckout },
  en: { common: enCommon, layout: enLayout, home: enHome, catalog: enCatalog, cart: enCart, checkout: enCheckout },
} as const

/** Keeps <html lang dir> in step with the active language (RTL for Arabic). */
function applyDocumentLanguage(lng: string) {
  const lang = lng.startsWith('en') ? 'en' : 'ar'
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

i18n.on('languageChanged', applyDocumentLanguage)

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    supportedLngs: ['ar', 'en'],
    nonExplicitSupportedLngs: true,
    defaultNS: 'common',
    ns: ['common', 'layout', 'home', 'catalog', 'cart', 'checkout'],
    interpolation: { escapeValue: false },
    // Arabic is the default; English only when the visitor picked it before.
    detection: { order: ['localStorage'], lookupLocalStorage: LANG_STORAGE_KEY, caches: ['localStorage'] },
  })

applyDocumentLanguage(i18n.resolvedLanguage ?? 'ar')

export default i18n
