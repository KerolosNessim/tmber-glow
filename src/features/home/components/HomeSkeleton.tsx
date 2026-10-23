import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/shared/components/Skeleton'

export function HomeSkeleton() {
  const { t } = useTranslation()
  return (
    <div className="wrap pt-3" aria-busy="true" aria-label={t('states.loading')}>
      <Skeleton className="h-[clamp(520px,76vh,760px)] rounded-xl" />
      <Skeleton className="mt-4 h-[74px]" />
      <div className="mt-section grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="aspect-[4/5]" />
        ))}
      </div>
    </div>
  )
}
