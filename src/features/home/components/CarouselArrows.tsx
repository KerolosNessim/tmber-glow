import { useTranslation } from 'react-i18next'
import { BrandIcon } from '@/shared/components/BrandIcon'
import { Button } from '@/shared/components/ui/button'

const arrow = 'hidden md:inline-flex size-12 border-[1.5px] border-line-strong bg-surface hover:bg-ink hover:text-surface disabled:opacity-30'

interface CarouselArrowsProps {
  index: number
  total: number
  canPrev: boolean
  canNext: boolean
  onStep: (direction: 1 | -1) => void
}

export function CarouselArrows({ index, total, canPrev, canNext, onStep }: CarouselArrowsProps) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon-lg" className={arrow} disabled={!canPrev} aria-label={t('actions.previous')} onClick={() => onStep(-1)}>
        <BrandIcon name="arrow" className="ltr:-scale-x-100" />
      </Button>
      <span className="min-w-14 text-center font-mono text-[13px] leading-none tabular-nums" dir="ltr" aria-live="polite">
        {index + 1} / {total}
      </span>
      <Button variant="ghost" size="icon-lg" className={arrow} disabled={!canNext} aria-label={t('actions.next')} onClick={() => onStep(1)}>
        <BrandIcon name="arrow" directional />
      </Button>
    </div>
  )
}
