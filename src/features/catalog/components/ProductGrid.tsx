import { useTranslation } from 'react-i18next'
import AnimatedContent from '@/shared/components/reactbits/AnimatedContent'
import { Skeleton } from '@/shared/components/Skeleton'
import type { Product } from '../types/catalog.types'
import { ProductCard } from './ProductCard'

export function ProductGrid({ products, isLoading }: { products?: Product[]; isLoading: boolean }) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4" aria-busy="true" aria-label={t('states.loading')}>
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="aspect-[4/6]" />
        ))}
      </div>
    )
  }
  if (!products?.length) return <p className="py-12 text-center text-ink-muted">{t('states.empty')}</p>

  return (
    <AnimatedContent
      distance={36}
      duration={0.9}
      stagger={0.06}
      className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-3 md:gap-4 xl:grid-cols-4"
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </AnimatedContent>
  )
}
