import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'

/** Round toggle that shows the code of the language you will switch to (AR / EN). */
export function LanguageSwitch({ className }: { className?: string }) {
  const { t, i18n } = useTranslation()
  const next = i18n.resolvedLanguage === 'en' ? 'ar' : 'en'

  return (
    <button
      type="button"
      lang={next}
      aria-label={t('language.switchTo')}
      onClick={() => void i18n.changeLanguage(next)}
      className={cn(
        'grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border-[1.5px] border-line-strong bg-transparent p-0 text-xs font-bold tracking-[0.04em] text-ink uppercase transition-colors hover:border-ember hover:bg-ember hover:text-white lg:ms-2 lg:size-9',
        className,
      )}
    >
      {next}
    </button>
  )
}
