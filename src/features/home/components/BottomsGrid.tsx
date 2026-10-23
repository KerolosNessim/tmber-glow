import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { CategoryTile } from '@/features/catalog/components/CategoryTile'
import type { Category } from '@/features/catalog/types/catalog.types'
import AnimatedContent from '@/shared/components/reactbits/AnimatedContent'
import { BrandIcon } from '@/shared/components/BrandIcon'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { Button } from '@/shared/components/ui/button'

export function BottomsGrid({ categories }: { categories: Category[] }) {
  const { t } = useTranslation('home')

  return (
    <section id="bottoms" aria-labelledby="bottoms-title" className="pb-section">
      <div className="wrap">
        <SectionHeader
          id="bottoms-title"
          title={t('bottoms.title')}
          subtitle={t('bottoms.subtitle')}
          action={
            <Button asChild variant="outline" size="sm">
              <Link to="/collections?group=bottoms">
                {t('bottoms.cta')} <BrandIcon name="arrow" directional />
              </Link>
            </Button>
          }
        />
        <AnimatedContent
          distance={36}
          duration={1}
          stagger={0.08}
          className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-3 md:gap-4 max-md:[&>*:first-child]:col-span-2"
        >
          {categories.map((c) => (
            <div key={c.id}>
              <CategoryTile category={c} />
            </div>
          ))}
        </AnimatedContent>
      </div>
    </section>
  )
}
