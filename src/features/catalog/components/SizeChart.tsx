import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'
import { SIZE_CHARTS, type ChartColumn } from '../constants/size-charts'
import type { CategoryGroup, Size } from '../types/catalog.types'

const HOW_TO: Record<CategoryGroup, ChartColumn[]> = {
  tops: ['width', 'length'],
  bottoms: ['waist', 'hip', 'inseam'],
}

const HOW_TO_KEY = {
  width: 'chart.howWidth',
  length: 'chart.howLength',
  waist: 'chart.howWaist',
  hip: 'chart.howHip',
  inseam: 'chart.howInseam',
} as const

/** Size table plus the measuring diagram; the row of the chosen size is highlighted. */
export function SizeChart({ group, selected }: { group: CategoryGroup; selected: Size }) {
  const { t } = useTranslation('catalog')
  const chart = SIZE_CHARTS[group]

  return (
    <div className={cn('grid gap-8 lg:gap-12', chart.image && 'lg:grid-cols-[1.3fr_1fr]')}>
      <div className="grid min-w-0 content-start gap-6">
        <div>
          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full border-collapse text-center tabular-nums" dir="ltr">
              <caption className="sr-only">{t(group === 'tops' ? 'chart.titleTops' : 'chart.titleBottoms')}</caption>
              <thead>
                <tr className="bg-surface-sunken text-[13px] font-semibold text-ink-muted">
                  <th scope="col" className="px-4 py-3.5 text-start">{t('chart.size')}</th>
                  {chart.columns.map((c) => (
                    <th key={c} scope="col" className="px-4 py-3.5">{t(`chart.${c}`)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chart.rows.map((row) => {
                  const on = row.size === selected
                  return (
                    <tr key={row.size} className={cn('border-t border-line transition-colors', on && 'bg-forest-tint')}>
                      <th scope="row" className="px-4 py-3.5 text-start">
                        <span className={cn('inline-grid h-8 min-w-10 place-items-center rounded-full text-[13px] font-bold', on ? 'bg-ink text-surface' : 'text-ink')}>
                          {row.size}
                        </span>
                      </th>
                      {chart.columns.map((c) => (
                        <td key={c} className={cn('px-4 py-3.5 text-[15px]', on ? 'font-bold text-ink' : 'text-ink-muted')}>{row.cm[c]}</td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-ink-muted">{t('chart.subtitle')}</p>
        </div>

        <div className="grid gap-3">
          <h3 className="text-lg font-semibold">{t('chart.howTitle')}</h3>
          <ul className="grid gap-2.5 text-sm text-ink-muted">
            {HOW_TO[group].map((c) => (
              <li key={c} className="border-t border-dashed border-line-strong pt-2.5 first:border-0 first:pt-0">
                {t(HOW_TO_KEY[c as keyof typeof HOW_TO_KEY])}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {chart.image && (
        // Same height as the table column on large screens; the photo's blank margins are cropped away
        <figure className="relative m-0 aspect-[4/5] overflow-hidden rounded-lg border border-line bg-white lg:aspect-auto">
          <img
            src={chart.image}
            alt={t('chart.imageAlt')}
            loading="lazy"
            className="absolute inset-0 size-full object-contain [object-view-box:inset(13.5%_6%_14%_10%)]"
          />
        </figure>
      )}
    </div>
  )
}
