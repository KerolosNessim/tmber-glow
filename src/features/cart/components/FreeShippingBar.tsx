import { useTranslation } from 'react-i18next'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { cn } from '@/shared/lib/utils'
import { useCartSummary } from '../hooks/useCartSummary'

export function FreeShippingBar() {
  const { t } = useTranslation('cart')
  const { price } = useLocalized()
  const { remainingForFreeShipping, freeShippingProgress } = useCartSummary()
  const done = remainingForFreeShipping === 0

  return (
    <div className="grid gap-2 border-b border-line bg-surface-soft px-6 py-4 text-sm" aria-live="polite">
      <span>{done ? t('freeShippingDone') : t('freeShippingLeft', { amount: price(remainingForFreeShipping) })}</span>
      <div className="h-1.5 overflow-hidden rounded-md bg-surface-sunken">
        <i
          className={cn('block h-full transition-[width] duration-500 ease-brand', done ? 'bg-success' : 'bg-forest')}
          style={{ width: `${freeShippingProgress}%` }}
        />
      </div>
    </div>
  )
}
