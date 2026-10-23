import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { CategoryTile } from '@/features/catalog/components/CategoryTile'
import type { Category } from '@/features/catalog/types/catalog.types'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { useCarouselScroll } from '../hooks/useCarouselScroll'
import { CarouselArrows } from './CarouselArrows'

export function TopsCarousel({ categories }: { categories: Category[] }) {
  const { t } = useTranslation('home')
  const trackRef = useRef<HTMLUListElement>(null)
  const { index, canPrev, canNext, scrollBy } = useCarouselScroll(trackRef, categories.length)

  return (
    <section id="tops" aria-labelledby="tops-title" className="pb-section">
      <div className="wrap">
        <SectionHeader
          id="tops-title"
          title={t('tops.title')}
          subtitle={t('tops.subtitle')}
          action={<CarouselArrows index={index} total={categories.length} canPrev={canPrev} canNext={canNext} onStep={scrollBy} />}
        />
        <ul
          ref={trackRef}
          className="no-scrollbar -mx-gutter grid snap-x snap-mandatory auto-cols-[72%] grid-flow-col gap-3 overflow-x-auto scroll-px-gutter px-gutter md:mx-0 md:auto-cols-[calc((100%-2rem)/3.25)] md:gap-4 md:px-0"
        >
          {categories.map((c, i) => (
            <li key={c.id} className="min-w-0 snap-start">
              <CategoryTile category={c} eager={i < 3} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
