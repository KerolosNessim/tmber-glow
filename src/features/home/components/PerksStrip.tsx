import { useTranslation } from 'react-i18next'
import { BrandIcon } from '@/shared/components/BrandIcon'
import { useLocalized } from '@/shared/hooks/useLocalized'
import type { Perk } from '../types/home.types'

export function PerksStrip({ perks }: { perks: Perk[] }) {
  const { t } = useTranslation('home')
  const { l } = useLocalized()

  return (
    <ul
      aria-label={t('perksLabel')}
      className="mt-4 grid grid-cols-2 rounded-lg border border-line bg-surface md:grid-cols-4 [&>li:nth-child(n+3)]:border-t md:[&>li:nth-child(n+3)]:border-t-0 [&>li+li]:border-s max-md:[&>li:nth-child(3)]:border-s-0"
    >
      {perks.map((perk) => (
        <li key={perk.id} className="flex items-center gap-3 border-line px-4 py-3 md:px-6 md:py-4">
          <span className="grid size-[34px] flex-none place-items-center rounded-full bg-forest-tint text-forest md:size-10">
            <BrandIcon name={perk.icon} className="size-5 md:size-[22px]" strokeWidth={1.6} />
          </span>
          <div>
            <b className="block text-sm leading-snug font-semibold md:text-[15px]">{l(perk.title)}</b>
            <small className="hidden text-[13px] leading-snug text-ink-muted md:block">{l(perk.text)}</small>
          </div>
        </li>
      ))}
    </ul>
  )
}
